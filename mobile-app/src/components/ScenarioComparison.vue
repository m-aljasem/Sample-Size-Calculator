<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="scenario-comparison">
        <h2>📊 Scenario Comparison</h2>
        <p class="subtitle">Compare multiple study designs side-by-side</p>

        <!-- Add Scenario Button -->
        <ion-button expand="block" @click="createNewScenario" class="add-btn">
          + Add Scenario
        </ion-button>

        <!-- Scenarios List -->
        <div v-for="(scenario, idx) in scenarios" :key="scenario.id" class="scenario-card">
          <ion-card>
            <ion-card-header>
              <div class="scenario-header">
                <input 
                  v-model="scenario.name"
                  @blur="updateScenario(scenario)"
                  class="scenario-name">
                <ion-button 
                  fill="clear" 
                  color="danger" 
                  @click="deleteScenario(scenario.id)"
                  size="small">
                  ×
                </ion-button>
              </div>
            </ion-card-header>
            <ion-card-content>
              <ion-item>
                <ion-label position="stacked">Calculator</ion-label>
                <ion-select 
                  v-model="scenario.calculatorKey" 
                  @ionChange="updateScenario(scenario)">
                  <ion-select-option value="">-- Select --</ion-select-option>
                  <ion-select-option value="test2Proportions">Two Proportions</ion-select-option>
                  <ion-select-option value="test2Means">Two Means</ion-select-option>
                </ion-select>
              </ion-item>

              <div v-if="scenario.calculatorKey" class="params-grid">
                <ion-item 
                  v-for="input in getCalculatorInputs(scenario.calculatorKey)" 
                  :key="input.name"
                  lines="none">
                  <ion-label position="stacked">{{ input.label }}</ion-label>
                  <ion-input
                    :value="String(scenario.inputs[input.name] || '')"
                    @ion-input="updateScenarioInput(scenario.id, input.name, $event)"
                    type="number"
                    :step="String(input.step || 0.01)"
                    :placeholder="input.placeholder"
                  ></ion-input>
                </ion-item>
              </div>
            </ion-card-content>
          </ion-card>
        </div>

        <!-- Comparison Results -->
        <ion-card v-if="comparisons.length > 0" class="comparison-card">
          <ion-card-header>
            <ion-card-title>Comparison Results</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item 
                v-for="(comp, idx) in comparisons" 
                :key="idx"
                :class="{ error: comp.summary.error }">
                <ion-label>
                  <h2>{{ comp.scenario.name }}</h2>
                  <p>Calculator: {{ getCalculatorName(comp.scenario.calculatorKey) }}</p>
                  <p><strong>Sample Size:</strong> {{ comp.summary.sampleSize || comp.summary.total || 'N/A' }}</p>
                  <p v-if="comp.summary.sampleSizeAdjusted">
                    <strong>Adjusted:</strong> {{ comp.summary.sampleSizeAdjusted }}
                  </p>
                </ion-label>
                <ion-badge v-if="comp.summary.error" color="danger">Error</ion-badge>
                <ion-badge v-else color="success">✓</ion-badge>
              </ion-item>
            </ion-list>

            <div class="summary-box">
              <h3>Summary</h3>
              <div class="summary-grid">
                <div class="summary-card">
                  <div class="summary-label">Minimum</div>
                  <div class="summary-value">{{ minSampleSize }}</div>
                </div>
                <div class="summary-card">
                  <div class="summary-label">Maximum</div>
                  <div class="summary-value">{{ maxSampleSize }}</div>
                </div>
                <div class="summary-card">
                  <div class="summary-label">Average</div>
                  <div class="summary-value">{{ avgSampleSize }}</div>
                </div>
                <div class="summary-card">
                  <div class="summary-label">Range</div>
                  <div class="summary-value">{{ maxSampleSize - minSampleSize }}</div>
                </div>
              </div>
            </div>

            <ion-button expand="block" @click="exportComparison">
              📥 Export Comparison
            </ion-button>
            <ion-button expand="block" fill="outline" @click="copyComparisonText">
              📋 Copy for Grant
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonList,
  IonBadge,
  alertController
} from '@ionic/vue';
import { estimationCalculators, hypothesisCalculators } from '../data/calculators';
import * as calculators from '../utils/calculators';
import { createScenario, compareScenarios } from '../utils/scenarioComparison';

const scenarios = ref<Array<{ id: string | number; name: string; calculatorKey: string; inputs: Record<string, number> }>>([]);

const allCalculators = [...estimationCalculators, ...hypothesisCalculators];

const calcFunctions = computed(() => {
  return {
    estimateProportion: calculators.calculateEstimateProportion,
    test2Proportions: calculators.calculateTest2Proportions,
    test2Means: calculators.calculateTest2Means
  };
});

const comparisons = computed(() => {
  if (scenarios.value.length === 0) return [];
  return compareScenarios(scenarios.value, calcFunctions.value);
});

const minSampleSize = computed(() => {
  const sizes = comparisons.value
    .filter(c => !c.summary.error && c.summary.total)
    .map(c => c.summary.total as number);
  return sizes.length > 0 ? Math.min(...sizes) : 0;
});

const maxSampleSize = computed(() => {
  const sizes = comparisons.value
    .filter(c => !c.summary.error && c.summary.total)
    .map(c => c.summary.total as number);
  return sizes.length > 0 ? Math.max(...sizes) : 0;
});

const avgSampleSize = computed(() => {
  const sizes = comparisons.value
    .filter(c => !c.summary.error && c.summary.total)
    .map(c => c.summary.total as number);
  if (sizes.length === 0) return 0;
  return Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length);
});

const createNewScenario = () => {
  const scenario = createScenario(`Scenario ${scenarios.value.length + 1}`, {}, '');
  scenarios.value.push(scenario);
};

const deleteScenario = (id: string | number) => {
  const idx = scenarios.value.findIndex(s => s.id === id);
  if (idx > -1) {
    scenarios.value.splice(idx, 1);
  }
};

const updateScenario = (scenario: any) => {
  // Scenario updated automatically
};

const updateScenarioInput = (scenarioId: string | number, name: string, event: any) => {
  const scenario = scenarios.value.find(s => s.id === scenarioId);
  if (scenario) {
    const value = parseFloat(event.detail.value);
    scenario.inputs[name] = isNaN(value) ? 0 : value;
  }
};

const getCalculatorInputs = (calcKey: string) => {
  const calc = allCalculators.find(c => c.key === calcKey);
  return calc?.inputs || [];
};

const getCalculatorName = (calcKey: string) => {
  const calc = allCalculators.find(c => c.key === calcKey);
  return calc?.title || calcKey;
};

const exportComparison = async () => {
  const csv = comparisons.value.map(comp => ({
    Scenario: comp.scenario.name,
    Calculator: getCalculatorName(comp.scenario.calculatorKey),
    'Sample Size': comp.summary.sampleSize || 'N/A',
    'Adjusted': comp.summary.sampleSizeAdjusted || 'N/A',
    Total: comp.summary.total || 'N/A'
  }));

  const headers = Object.keys(csv[0]);
  const rows = csv.map(row => headers.map(h => (row as any)[h]).join(','));
  const content = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'scenario-comparison.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const copyComparisonText = async () => {
  let text = 'Sample Size Scenarios:\n\n';
  comparisons.value.forEach((comp, idx) => {
    text += `${idx + 1}. ${comp.scenario.name}\n`;
    text += `   Calculator: ${getCalculatorName(comp.scenario.calculatorKey)}\n`;
    text += `   Sample Size: ${comp.summary.sampleSize || comp.summary.total || 'N/A'}\n\n`;
  });
  
  text += `Summary:\n  Min: ${minSampleSize.value}\n  Max: ${maxSampleSize.value}\n  Avg: ${avgSampleSize.value}\n`;

  try {
    await navigator.clipboard.writeText(text);
    const alert = await alertController.create({
      message: 'Comparison text copied to clipboard!',
      buttons: ['OK']
    });
    await alert.present();
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>

<style scoped>
.scenario-comparison {
  max-width: 100%;
}

.add-btn {
  margin-bottom: 1.5rem;
}

.scenario-card {
  margin-bottom: 1rem;
}

.scenario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scenario-name {
  flex: 1;
  padding: 0.5rem;
  border: none;
  background: transparent;
  font-weight: 600;
  font-size: 1.1rem;
}

.params-grid {
  display: grid;
  gap: 0.5rem;
}

.comparison-card {
  margin-top: 2rem;
}

.summary-box {
  margin-top: 1.5rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.summary-card {
  background: #F8F9FA;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.summary-label {
  font-size: 0.875rem;
  color: #6C757D;
  margin-bottom: 0.5rem;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #007BFF;
}
</style>
