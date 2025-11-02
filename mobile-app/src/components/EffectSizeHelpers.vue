<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="effect-size-helpers">
        <h2>📐 Effect Size Helpers</h2>
        <p class="subtitle">Convert from published results and get field-specific benchmarks</p>

        <!-- Converter Tabs -->
        <ion-segment v-model="activeTab">
          <ion-segment-button value="tstat">
            <ion-label>t-stat</ion-label>
          </ion-segment-button>
          <ion-segment-button value="fstat">
            <ion-label>F-stat</ion-label>
          </ion-segment-button>
          <ion-segment-button value="chisq">
            <ion-label>χ²</ion-label>
          </ion-segment-button>
          <ion-segment-button value="pval">
            <ion-label>p-value</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Converter Forms -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Convert from Statistics</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <!-- T-Statistic -->
            <template v-if="activeTab === 'tstat'">
              <ion-item>
                <ion-label position="stacked">t-statistic</ion-label>
                <ion-input v-model.number="tStat" type="number" step="0.01" placeholder="2.5"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">n₁</ion-label>
                <ion-input v-model.number="n1" type="number" step="1" placeholder="30"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">n₂</ion-label>
                <ion-input v-model.number="n2" type="number" step="1" placeholder="30"></ion-input>
              </ion-item>
              <ion-button expand="block" @click="convertTStat">Convert</ion-button>
            </template>

            <!-- F-Statistic -->
            <template v-if="activeTab === 'fstat'">
              <ion-item>
                <ion-label position="stacked">F-statistic</ion-label>
                <ion-input v-model.number="fStat" type="number" step="0.01" placeholder="5.2"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">df₁</ion-label>
                <ion-input v-model.number="df1" type="number" step="1" placeholder="2"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">df₂</ion-label>
                <ion-input v-model.number="df2" type="number" step="1" placeholder="57"></ion-input>
              </ion-item>
              <ion-button expand="block" @click="convertFStat">Convert</ion-button>
            </template>

            <!-- Chi-Square -->
            <template v-if="activeTab === 'chisq'">
              <ion-item>
                <ion-label position="stacked">χ²</ion-label>
                <ion-input v-model.number="chiSq" type="number" step="0.01" placeholder="8.5"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">n</ion-label>
                <ion-input v-model.number="nTotal" type="number" step="1" placeholder="100"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">df</ion-label>
                <ion-input v-model.number="chiDf" type="number" step="1" placeholder="1"></ion-input>
              </ion-item>
              <ion-button expand="block" @click="convertChiSq">Convert</ion-button>
            </template>

            <!-- P-Value -->
            <template v-if="activeTab === 'pval'">
              <ion-item>
                <ion-label position="stacked">p-value</ion-label>
                <ion-input v-model.number="pValue" type="number" step="0.001" min="0" max="1" placeholder="0.03"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">n₁</ion-label>
                <ion-input v-model.number="pN1" type="number" step="1" placeholder="30"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">n₂</ion-label>
                <ion-input v-model.number="pN2" type="number" step="1" placeholder="30"></ion-input>
              </ion-item>
              <ion-item>
                <ion-checkbox v-model="twoTailedP"></ion-checkbox>
                <ion-label>Two-tailed</ion-label>
              </ion-item>
              <ion-button expand="block" @click="convertPValue">Convert</ion-button>
            </template>

            <!-- Result -->
            <div v-if="convertedEffectSize !== null" class="result-box">
              <h3>Effect Size: {{ convertedEffectSize.toFixed(3) }}</h3>
              <p class="interpretation">{{ getEffectInterpretation(convertedEffectSize) }}</p>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Field Benchmarks -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Field-Specific Benchmarks</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Research Field</ion-label>
              <ion-select v-model="selectedField">
                <ion-select-option value="default">General</ion-select-option>
                <ion-select-option value="psychology">Psychology</ion-select-option>
                <ion-select-option value="medicine">Medicine</ion-select-option>
                <ion-select-option value="education">Education</ion-select-option>
              </ion-select>
            </ion-item>

            <div v-if="currentBenchmarks" class="benchmarks">
              <div class="benchmark-item">
                <strong>Cohen's d:</strong>
                <div>Small: {{ currentBenchmarks.cohensD.small }}</div>
                <div>Medium: {{ currentBenchmarks.cohensD.medium }}</div>
                <div>Large: {{ currentBenchmarks.cohensD.large }}</div>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Effect Size Calculator -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Calculate from Raw Data</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-segment v-model="calcType">
              <ion-segment-button value="means">
                <ion-label>Means</ion-label>
              </ion-segment-button>
              <ion-segment-button value="proportions">
                <ion-label>Proportions</ion-label>
              </ion-segment-button>
            </ion-segment>

            <template v-if="calcType === 'means'">
              <ion-item>
                <ion-label position="stacked">μ₁</ion-label>
                <ion-input v-model.number="mean1" type="number" step="0.01" placeholder="100"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">μ₂</ion-label>
                <ion-input v-model.number="mean2" type="number" step="0.01" placeholder="95"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">SD₁</ion-label>
                <ion-input v-model.number="sd1" type="number" step="0.01" min="0" placeholder="15"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">SD₂</ion-label>
                <ion-input v-model.number="sd2" type="number" step="0.01" min="0" placeholder="15"></ion-input>
              </ion-item>
              <ion-button expand="block" @click="calculateCohenD">Calculate</ion-button>
              <div v-if="calculatedCohenD !== null" class="result-box">
                <h3>Cohen's d: {{ calculatedCohenD.toFixed(3) }}</h3>
                <p class="interpretation">{{ getEffectInterpretation(calculatedCohenD) }}</p>
              </div>
            </template>

            <template v-if="calcType === 'proportions'">
              <ion-item>
                <ion-label position="stacked">p₁</ion-label>
                <ion-input v-model.number="prop1" type="number" step="0.01" min="0" max="1" placeholder="0.6"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">p₂</ion-label>
                <ion-input v-model.number="prop2" type="number" step="0.01" min="0" max="1" placeholder="0.4"></ion-input>
              </ion-item>
              <ion-button expand="block" @click="calculatePropEffect">Calculate</ion-button>
              <div v-if="calculatedPropEffect !== null" class="result-box">
                <h3>Effect Size: {{ calculatedPropEffect.toFixed(3) }}</h3>
                <p class="interpretation">{{ getEffectInterpretation(calculatedPropEffect) }}</p>
              </div>
            </template>
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
  IonSegment,
  IonSegmentButton,
  IonCheckbox
} from '@ionic/vue';
import { 
  convertTStatToEffectSize, 
  convertFStatToEffectSize, 
  convertChiSqToEffectSize, 
  convertPValueToEffectSize,
  effectSizeBenchmarks,
  getEffectSizeInterpretation
} from '../utils/effectSizeHelpers';

const activeTab = ref('tstat');
const convertedEffectSize = ref<number | null>(null);
const calcType = ref('means');

// Converter inputs
const tStat = ref<number | null>(null);
const n1 = ref<number | null>(null);
const n2 = ref<number | null>(null);
const fStat = ref<number | null>(null);
const df1 = ref<number | null>(null);
const df2 = ref<number | null>(null);
const chiSq = ref<number | null>(null);
const nTotal = ref<number | null>(null);
const chiDf = ref<number | null>(null);
const pValue = ref<number | null>(null);
const pN1 = ref<number | null>(null);
const pN2 = ref<number | null>(null);
const twoTailedP = ref(true);

// Calculator inputs
const mean1 = ref<number | null>(null);
const mean2 = ref<number | null>(null);
const sd1 = ref<number | null>(null);
const sd2 = ref<number | null>(null);
const prop1 = ref<number | null>(null);
const prop2 = ref<number | null>(null);
const calculatedCohenD = ref<number | null>(null);
const calculatedPropEffect = ref<number | null>(null);

const selectedField = ref('default');
const currentBenchmarks = computed(() => {
  return effectSizeBenchmarks[selectedField.value] || effectSizeBenchmarks.default;
});

const convertTStat = () => {
  if (tStat.value && n1.value && n2.value) {
    convertedEffectSize.value = convertTStatToEffectSize(tStat.value, n1.value, n2.value);
  }
};

const convertFStat = () => {
  if (fStat.value && df1.value && df2.value) {
    convertedEffectSize.value = convertFStatToEffectSize(fStat.value, df1.value, df2.value);
  }
};

const convertChiSq = () => {
  if (chiSq.value && nTotal.value && chiDf.value) {
    convertedEffectSize.value = convertChiSqToEffectSize(chiSq.value, nTotal.value, chiDf.value);
  }
};

const convertPValue = () => {
  if (pValue.value && pN1.value && pN2.value) {
    convertedEffectSize.value = convertPValueToEffectSize(pValue.value, pN1.value, pN2.value, twoTailedP.value);
  }
};

const calculateCohenD = () => {
  if (mean1.value !== null && mean2.value !== null && sd1.value && sd2.value) {
    const pooledSD = Math.sqrt((sd1.value * sd1.value + sd2.value * sd2.value) / 2);
    calculatedCohenD.value = (mean1.value - mean2.value) / pooledSD;
  }
};

const calculatePropEffect = () => {
  if (prop1.value !== null && prop2.value !== null) {
    const h = 2 * (Math.asin(Math.sqrt(prop1.value)) - Math.asin(Math.sqrt(prop2.value)));
    calculatedPropEffect.value = Math.abs(h);
  }
};

const getEffectInterpretation = (value: number) => {
  const interpretation = getEffectSizeInterpretation(Math.abs(value), 'cohensD', selectedField.value);
  return `Interpretation: ${interpretation} effect`;
};
</script>

<style scoped>
.effect-size-helpers {
  max-width: 100%;
}

.subtitle {
  color: #6C757D;
  margin-bottom: 1.5rem;
}

.result-box {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #E7F3FF;
  border-radius: 8px;
  border-left: 4px solid #007BFF;
}

.interpretation {
  margin-top: 0.5rem;
  color: #6C757D;
  font-size: 0.875rem;
}

.benchmarks {
  margin-top: 1rem;
}

.benchmark-item {
  padding: 1rem;
  background: #F8F9FA;
  border-radius: 8px;
  margin-top: 1rem;
}

.benchmark-item div {
  padding: 0.25rem 0;
}
</style>
