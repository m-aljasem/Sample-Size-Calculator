<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ calculator?.emoji }} {{ calculator?.title }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="calculator">
        <!-- Input Fields -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Input Parameters</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item 
              v-for="input in calculator.inputs" 
              :key="input.name"
              lines="none"
            >
              <ion-label position="stacked">
                {{ input.label }}
                <ion-button 
                  fill="clear" 
                  size="small" 
                  @click="showTooltip(input.tooltip)"
                  class="tooltip-button"
                >
                  <ion-icon :icon="helpCircleOutline" slot="icon-only"></ion-icon>
                </ion-button>
              </ion-label>
              <ion-input
                :value="String(inputs[input.name] || '')"
                @ion-input="updateInput(input.name, $event)"
                type="number"
                :step="String(input.step || 0.01)"
                :min="input.min !== undefined ? String(input.min) : undefined"
                :max="input.max !== undefined ? String(input.max) : undefined"
                :placeholder="input.placeholder"
              ></ion-input>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <!-- Advanced Options -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>
              Advanced Options
              <ion-button fill="clear" size="small" @click="showAdvancedOptions = !showAdvancedOptions">
                {{ showAdvancedOptions ? 'Hide' : 'Show' }}
              </ion-button>
            </ion-card-title>
          </ion-card-header>
          <ion-card-content v-if="showAdvancedOptions">
            <!-- One/Two-Tailed Toggle (for hypothesis testing) -->
            <div v-if="isHypothesisTest" class="ion-margin-bottom">
              <ion-item>
                <ion-label>Test Type</ion-label>
                <ion-segment :value="(inputs.twoTailed !== false && inputs.twoTailed !== 0) ? 'two' : 'one'" @ionChange="updateInput('twoTailed', $event.detail.value === 'two' ? 1 : 0)">
                  <ion-segment-button value="one">
                    <ion-label>One-Tailed</ion-label>
                  </ion-segment-button>
                  <ion-segment-button value="two">
                    <ion-label>Two-Tailed</ion-label>
                  </ion-segment-button>
                </ion-segment>
              </ion-item>
              <ion-note color="warning" v-if="inputs.twoTailed === false || inputs.twoTailed === 0">
                One-tailed assumes directional hypothesis
              </ion-note>
            </div>
            
            <!-- Allocation Ratio (for two-group tests) -->
            <div v-if="isTwoGroupTest" class="ion-margin-bottom">
              <ion-item>
                <ion-label position="stacked">Allocation Ratio (n₂:n₁)</ion-label>
                <ion-input
                  :value="String(inputs.allocationRatio || 1)"
                  @ion-input="updateInput('allocationRatio', parseFloat($event.detail.value) || 1)"
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="1"
                ></ion-input>
              </ion-item>
              <ion-note v-if="inputs.allocationRatio && inputs.allocationRatio !== 1">
                Group 2 will have {{ (inputs.allocationRatio || 1).toFixed(1) }}x the size of Group 1
              </ion-note>
            </div>
            
            <!-- Attrition/Dropout Rate -->
            <div class="ion-margin-bottom">
              <ion-item>
                <ion-label position="stacked">Expected Dropout Rate (%)</ion-label>
                <ion-input
                  :value="String((inputs.dropoutRate || 0) * 100)"
                  @ion-input="updateInput('dropoutRate', (parseFloat($event.detail.value) || 0) / 100)"
                  type="number"
                  step="1"
                  min="0"
                  max="99"
                  placeholder="0"
                ></ion-input>
              </ion-item>
              <ion-note v-if="inputs.dropoutRate && inputs.dropoutRate > 0">
                Sample size will be increased by {{ ((1 / (1 - inputs.dropoutRate) - 1) * 100).toFixed(0) }}% to account for dropouts
              </ion-note>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Results -->
        <ion-card v-if="result.value !== null || result.error" class="result-card">
          <ion-card-header>
            <ion-card-title>Result</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div v-if="result.error" class="error-message">
              <ion-icon :icon="alertCircleOutline" color="danger"></ion-icon>
              <p>{{ result.error }}</p>
            </div>
            <div v-else class="result-content">
              <div v-if="result.isMulti" class="multi-result">
                <div class="result-item">
                  <h3>{{ result.label1 || 'Group 1' }}</h3>
                  <p class="result-value">{{ result.value }}</p>
                </div>
                <div class="result-item" v-if="result.value2">
                  <h3>{{ result.label2 || 'Group 2' }}</h3>
                  <p class="result-value">{{ result.value2 }}</p>
                </div>
              </div>
              <div v-else class="single-result">
                <h3>{{ result.label || $t('app.calculators.requiredSampleSize') }}</h3>
                <p class="result-value">{{ result.value }}</p>
                <div v-if="result.valueAdjusted" class="result-adjusted">
                  <strong>Adjusted for {{ (result.dropoutRate! * 100).toFixed(0) }}% dropout:</strong> {{ result.valueAdjusted }}
                </div>
                <p class="result-note" v-if="result.note">{{ result.note }}</p>
              </div>
              <p class="rounded-note">{{ $t('app.calculators.roundedUp') }}</p>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Export Button -->
        <ion-button 
          v-if="result.value !== null || result.error"
          expand="block" 
          color="primary"
          @click="showExportModal = true"
          class="export-button"
        >
          <ion-icon :icon="downloadOutline" slot="start"></ion-icon>
          Export Results
        </ion-button>

        <!-- Formula Display -->
        <FormulaDisplay :calculator-key="calculatorKey" />

        <!-- Calculator Info - Now at the bottom -->
        <ion-card class="info-card">
          <ion-card-header>
            <ion-card-title>{{ calculator.description }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item lines="none">
              <ion-label>
                <h3>{{ $t('app.calculators.usage') }}</h3>
                <p>{{ calculator.usage }}</p>
              </ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label>
                <h3>{{ $t('app.calculators.example') }}</h3>
                <p>{{ calculator.example }}</p>
              </ion-label>
            </ion-item>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Export Modal -->
      <ExportResults
        :show-export="showExportModal"
        :calculator-data="calculator"
        :calculator-key="calculatorKey"
        :input-values="inputs"
        :result="result"
        @close="showExportModal = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonNote,
  toastController
} from '@ionic/vue';
import { helpCircleOutline, alertCircleOutline, downloadOutline } from 'ionicons/icons';
import { useRoute } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import { 
  estimationCalculators, 
  hypothesisCalculators, 
  ratesCalculators,
  defaultInputs 
} from '../data/calculators';
import * as calculators from '../utils/calculators';
import FormulaDisplay from '../components/FormulaDisplay.vue';
import ExportResults from '../components/ExportResults.vue';

const route = useRoute();
const calculatorKey = route.params.key as string;

const allCalculators = [
  ...estimationCalculators,
  ...hypothesisCalculators,
  ...ratesCalculators
];

const calculator = computed(() => {
  return allCalculators.find(calc => calc.key === calculatorKey);
});

const inputs = ref<Record<string, number>>({});
const showExportModal = ref(false);
const showAdvancedOptions = ref(false);

onMounted(() => {
  if (calculator.value && defaultInputs[calculator.value.key]) {
    inputs.value = { ...defaultInputs[calculator.value.key] };
  }
});

const updateInput = (name: string, valueOrEvent: any) => {
  // Handle both event-based and direct value updates
  const value = typeof valueOrEvent === 'number' 
    ? valueOrEvent 
    : parseFloat(valueOrEvent?.detail?.value || valueOrEvent);
  inputs.value[name] = isNaN(value) ? (name === 'twoTailed' ? 1 : 0) : value;
};

const isHypothesisTest = computed(() => {
  return ['testProportion', 'test2Proportions', 'test2Means', 'test2Correlations', 'test2Rates'].includes(calculatorKey);
});

const isTwoGroupTest = computed(() => {
  return ['test2Proportions', 'test2Means', 'test2Correlations', 'test2Rates'].includes(calculatorKey);
});

const result = computed(() => {
  if (!calculator.value) {
    return { value: null, error: null };
  }

  const calcFunctions: Record<string, (inputs: Record<string, number>) => any> = {
    estimateProportion: calculators.calculateEstimateProportion,
    estimateMean: calculators.calculateEstimateMean,
    estimateDiff2Proportions: calculators.calculateEstimateDiff2Proportions,
    estimateOddsRatio: calculators.calculateEstimateOddsRatio,
    estimateRelativeRisk: calculators.calculateEstimateRelativeRisk,
    estimateCorrelation: calculators.calculateEstimateCorrelation,
    testProportion: calculators.calculateTestProportion,
    test2Proportions: calculators.calculateTest2Proportions,
    test2Means: calculators.calculateTest2Means,
    test2Correlations: calculators.calculateTest2Correlations,
    test2Rates: calculators.calculateTest2Rates
  };

  const calcFunc = calcFunctions[calculator.value.key];
  if (!calcFunc) {
    return { value: null, error: 'Calculator function not found' };
  }

  return calcFunc(inputs.value);
});

const showTooltip = async (message: string) => {
  const toast = await toastController.create({
    message: message,
    duration: 3000,
    position: 'middle',
    color: 'medium'
  });
  await toast.present();
};
</script>

<style scoped>
.tooltip-button {
  --padding-start: 4px;
  --padding-end: 4px;
  margin-left: 8px;
  height: 20px;
}

.result-card {
  margin-top: 20px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ion-color-danger);
}

.error-message p {
  margin: 0;
  flex: 1;
}

.result-content {
  text-align: center;
}

.single-result h3,
.multi-result .result-item h3 {
  font-size: 1.1rem;
  color: var(--ion-color-medium);
  margin-bottom: 10px;
}

.result-value {
  font-size: 3rem;
  font-weight: bold;
  color: var(--ion-color-primary);
  margin: 10px 0;
}

.result-note {
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  margin-top: 10px;
  font-style: italic;
}

.rounded-note {
  font-size: 0.85rem;
  color: var(--ion-color-medium);
  margin-top: 15px;
  font-style: italic;
}

.multi-result {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.result-item {
  flex: 1;
  min-width: 120px;
}

.info-card {
  margin-top: 20px;
}

.export-button {
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>

