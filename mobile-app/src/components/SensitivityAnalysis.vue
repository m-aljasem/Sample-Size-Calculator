<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="sensitivity-analysis">
        <h2>📈 Sensitivity Analysis</h2>
        <p class="subtitle">Explore how sample size changes when parameters vary</p>

        <!-- Calculator Selection -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Select Calculator</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Calculator Type</ion-label>
              <ion-select v-model="selectedCalculator" @ionChange="onCalculatorChange">
                <ion-select-option value="">-- Select --</ion-select-option>
                <ion-select-option value="test2Proportions">Two Proportions</ion-select-option>
                <ion-select-option value="test2Means">Two Means</ion-select-option>
                <ion-select-option value="estimateProportion">Single Proportion</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <!-- Base Parameters -->
        <ion-card v-if="selectedCalculator">
          <ion-card-header>
            <ion-card-title>Base Parameters</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item 
              v-for="input in availableParams" 
              :key="input.name"
              lines="none">
              <ion-label position="stacked">{{ input.label }}</ion-label>
              <ion-input
                :value="String(baseInputs[input.name] || '')"
                @ion-input="updateBaseInput(input.name, $event)"
                type="number"
                :step="String(input.step || 0.01)"
                :placeholder="input.placeholder"
              ></ion-input>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <!-- Sensitivity Parameters -->
        <ion-card v-if="selectedCalculator">
          <ion-card-header>
            <ion-card-title>Sensitivity Parameters</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div v-for="(param, idx) in sensitivityParams" :key="idx" class="sensitivity-item">
              <ion-item>
                <ion-label position="stacked">Parameter</ion-label>
                <ion-select v-model="param.paramName" @ionChange="runAnalysis">
                  <ion-select-option value="">-- Select --</ion-select-option>
                  <ion-select-option 
                    v-for="input in availableParams" 
                    :key="input.name" 
                    :value="input.name">
                    {{ input.label }}
                  </ion-select-option>
                </ion-select>
              </ion-item>
              <div v-if="param.paramName" class="range-controls">
                <ion-item>
                  <ion-label position="stacked">Min</ion-label>
                  <ion-input
                    v-model.number="param.min"
                    type="number"
                    step="0.01"
                    @ion-input="runAnalysis"
                  ></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Max</ion-label>
                  <ion-input
                    v-model.number="param.max"
                    type="number"
                    step="0.01"
                    @ion-input="runAnalysis"
                  ></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Steps</ion-label>
                  <ion-input
                    v-model.number="param.steps"
                    type="number"
                    min="5"
                    max="50"
                    @ion-input="runAnalysis"
                  ></ion-input>
                </ion-item>
              </div>
              <ion-button 
                fill="clear" 
                color="danger" 
                @click="removeSensitivityParam(idx)"
                size="small">
                Remove
              </ion-button>
            </div>
            <ion-button expand="block" @click="addSensitivityParam">
              + Add Parameter
            </ion-button>
          </ion-card-content>
        </ion-card>

        <!-- Results -->
        <ion-card v-if="sensitivityResults.length > 0">
          <ion-card-header>
            <ion-card-title>Results</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="summary-box">
              <div class="summary-item">
                <strong>Min:</strong> {{ minMax.min }}
              </div>
              <div class="summary-item">
                <strong>Max:</strong> {{ minMax.max }}
              </div>
              <div class="summary-item">
                <strong>Range:</strong> {{ minMax.range }}
              </div>
            </div>

            <div v-for="(paramResult, idx) in sensitivityResults" :key="idx" class="result-item">
              <h4>{{ getParamLabel(paramResult.paramName) }}</h4>
              <ion-list>
                <ion-item 
                  v-for="(result, rIdx) in paramResult.results.slice(0, 5)" 
                  :key="rIdx">
                  <ion-label>
                    <h3>{{ result.paramValue }}</h3>
                    <p>Sample Size: {{ result.sampleSize || result.value }}</p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </div>

            <ion-button expand="block" @click="exportResults">
              📥 Export Results
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
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
  IonList
} from '@ionic/vue';
import { estimationCalculators, hypothesisCalculators } from '../data/calculators';
import * as calculators from '../utils/calculators';
import { generateSensitivityRange, generateMultipleParamRanges, findMinMaxSampleSize } from '../utils/sensitivityAnalysis';

const selectedCalculator = ref('');
const baseInputs = ref<Record<string, number>>({});
const sensitivityParams = ref<Array<{ paramName: string; min: number; max: number; steps: number }>>([]);
const sensitivityResults = ref<any[]>([]);

const allCalculators = [...estimationCalculators, ...hypothesisCalculators];

const currentCalculator = computed(() => {
  return allCalculators.find(c => c.key === selectedCalculator.value);
});

const availableParams = computed(() => {
  return currentCalculator.value?.inputs || [];
});

const minMax = computed(() => {
  if (sensitivityResults.value.length === 0) return { min: 0, max: 0, range: 0 };
  return findMinMaxSampleSize(sensitivityResults.value);
});

const onCalculatorChange = () => {
  baseInputs.value = {};
  sensitivityParams.value = [];
  sensitivityResults.value = [];
};

const updateBaseInput = (name: string, event: any) => {
  const value = parseFloat(event.detail.value);
  baseInputs.value[name] = isNaN(value) ? 0 : value;
  runAnalysis();
};

const addSensitivityParam = () => {
  sensitivityParams.value.push({
    paramName: '',
    min: 0,
    max: 1,
    steps: 10
  });
};

const removeSensitivityParam = (idx: number) => {
  sensitivityParams.value.splice(idx, 1);
  runAnalysis();
};

const runAnalysis = () => {
  if (!selectedCalculator.value || sensitivityParams.value.length === 0) {
    sensitivityResults.value = [];
    return;
  }

  const calcFunction = getCalculatorFunction(selectedCalculator.value);
  if (!calcFunction) return;

  if (Object.keys(baseInputs.value).length === 0 && currentCalculator.value) {
    currentCalculator.value.inputs.forEach(input => {
      if (input.placeholder) {
        const placeholderValue = parseFloat(input.placeholder.replace(/[^0-9.]/g, ''));
        if (!isNaN(placeholderValue)) {
          baseInputs.value[input.name] = placeholderValue;
        }
      }
    });
  }

  const validParams = sensitivityParams.value.filter(p => p.paramName && p.min !== undefined && p.max !== undefined);
  
  if (validParams.length === 0) {
    sensitivityResults.value = [];
    return;
  }

  const paramsForAnalysis = validParams.map(p => ({
    name: p.paramName,
    label: getParamLabel(p.paramName),
    min: p.min,
    max: p.max,
    steps: p.steps || 10
  }));

  sensitivityResults.value = generateMultipleParamRanges(
    calcFunction,
    baseInputs.value,
    paramsForAnalysis
  );
};

const getCalculatorFunction = (calcKey: string) => {
  const functionMap: Record<string, any> = {
    estimateProportion: calculators.calculateEstimateProportion,
    test2Proportions: calculators.calculateTest2Proportions,
    test2Means: calculators.calculateTest2Means
  };
  return functionMap[calcKey];
};

const getParamLabel = (paramName: string) => {
  const param = availableParams.value.find(p => p.name === paramName);
  return param ? param.label : paramName;
};

const exportResults = () => {
  let csv = 'Parameter,Value,Sample Size\n';
  sensitivityResults.value.forEach(paramResult => {
    paramResult.results.forEach((result: any) => {
      csv += `${getParamLabel(paramResult.paramName)},${result.paramValue},${result.sampleSize || result.value}\n`;
    });
  });

  // For mobile, we'll use a different approach
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sensitivity-analysis.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
</script>

<style scoped>
.sensitivity-analysis {
  max-width: 100%;
}

.subtitle {
  color: #6C757D;
  margin-bottom: 1.5rem;
}

.sensitivity-item {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #F8F9FA;
  border-radius: 8px;
}

.range-controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.summary-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #F8F9FA;
  border-radius: 8px;
}

.summary-item {
  text-align: center;
}

.result-item {
  margin-bottom: 1.5rem;
}
</style>
