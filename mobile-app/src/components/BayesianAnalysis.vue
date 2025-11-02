<template>
  <div class="bayesian-analysis">
    <ion-card>
      <ion-card-header>
        <ion-card-title>🧠 Bayesian Analysis</ion-card-title>
        <ion-card-subtitle>Bayesian methods with prior distributions</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-item>
          <ion-label position="stacked">Prior Mean</ion-label>
          <ion-input
            :value="String(priorMean)"
            @ion-input="handlePriorMeanInput"
            type="number"
            placeholder="0.5"
            step="0.01"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Prior Standard Deviation</ion-label>
          <ion-input
            :value="String(priorSD)"
            @ion-input="handlePriorSDInput"
            type="number"
            placeholder="0.1"
            step="0.01"
            :min="0"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Sample Size</ion-label>
          <ion-input
            :value="String(sampleSize)"
            @ion-input="handleSampleSizeInput"
            type="number"
            placeholder="30"
            :min="1"
          ></ion-input>
        </ion-item>

        <ion-card v-if="posteriorMean !== null" color="primary" class="result-card">
          <ion-card-header>
            <ion-card-title>Bayesian Results</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="result-item">
              <h3>Posterior Mean</h3>
              <p class="result-value">{{ posteriorMean.toFixed(4) }}</p>
            </div>
            <div class="result-item">
              <h3>Posterior SD</h3>
              <p class="result-value">{{ posteriorSDCalc?.toFixed(4) || 'N/A' }}</p>
            </div>
            <div class="result-item">
              <h3>95% Credible Interval</h3>
              <p class="result-value">
                [{{ credibleInterval[0]?.toFixed(4) || 'N/A' }}, {{ credibleInterval[1]?.toFixed(4) || 'N/A' }}]
              </p>
            </div>

            <ion-button 
              expand="block" 
              color="primary"
              @click="showExportModal = true"
              class="export-button"
            >
              <ion-icon :icon="downloadOutline" slot="start"></ion-icon>
              Export Results
            </ion-button>
          </ion-card-content>
        </ion-card>

        <ion-card class="info-card">
          <ion-card-content>
            <p><strong>Bayesian Analysis</strong> incorporates prior knowledge or beliefs about parameters, updating them with observed data to form posterior distributions. This approach is valuable when prior information is available or for small sample sizes.</p>
          </ion-card-content>
        </ion-card>
      </ion-card-content>
    </ion-card>

    <AdvancedFeatureExport
      :show-export="showExportModal"
      feature-name="Bayesian Analysis"
      :inputs="{
        'Prior Mean': priorMean,
        'Prior Standard Deviation': priorSD,
        'Sample Size': sampleSize
      }"
      :results="{
        'Posterior Mean': posteriorMean !== null ? posteriorMean.toFixed(4) : 'N/A',
        'Posterior SD': posteriorSDCalc !== null ? posteriorSDCalc.toFixed(4) : 'N/A',
        '95% Credible Interval': posteriorMean !== null ? `[${credibleInterval[0]?.toFixed(4) || 'N/A'}, ${credibleInterval[1]?.toFixed(4) || 'N/A'}]` : 'N/A'
      }"
      @close="showExportModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon
} from '@ionic/vue';
import { downloadOutline } from 'ionicons/icons';
import AdvancedFeatureExport from './AdvancedFeatureExport.vue';

const priorMean = ref(0.5);
const priorSD = ref(0.1);
const sampleSize = ref(30);
const showExportModal = ref(false);

// Simplified Bayesian calculation (example)
const posteriorMean = computed(() => {
  if (!sampleSize.value || !priorSD.value) return null;
  // Simplified: weighted average of prior and sample mean (assumed 0.5)
  const sampleMean = 0.5;
  const priorWeight = 1 / (priorSD.value * priorSD.value);
  const sampleWeight = sampleSize.value;
  const totalWeight = priorWeight + sampleWeight;
  
  return (priorMean.value * priorWeight + sampleMean * sampleWeight) / totalWeight;
});

const posteriorSDCalc = computed(() => {
  if (!sampleSize.value || !priorSD.value) return null;
  // Simplified: posterior precision
  const priorPrecision = 1 / (priorSD.value * priorSD.value);
  const samplePrecision = sampleSize.value;
  const posteriorPrecision = priorPrecision + samplePrecision;
  
  return Math.sqrt(1 / posteriorPrecision);
});

const credibleInterval = computed(() => {
  if (posteriorMean.value === null || posteriorSDCalc.value === null) return [0, 0];
  const mean = posteriorMean.value;
  const sd = posteriorSDCalc.value;
  return [mean - 1.96 * sd, mean + 1.96 * sd];
});

const handlePriorMeanInput = (event: any) => {
  const value = event.detail.value;
  priorMean.value = parseFloat(value) || 0;
  calculateBayesian();
};

const handlePriorSDInput = (event: any) => {
  const value = event.detail.value;
  priorSD.value = parseFloat(value) || 0;
  calculateBayesian();
};

const handleSampleSizeInput = (event: any) => {
  const value = event.detail.value;
  sampleSize.value = parseFloat(value) || 0;
  calculateBayesian();
};

const calculateBayesian = () => {
  // Computed reactively
};
</script>

<style scoped>
.result-card {
  margin-top: 20px;
}

.result-item {
  margin: 15px 0;
  text-align: center;
}

.result-item h3 {
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  margin-bottom: 5px;
}

.result-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--ion-color-primary);
}

.info-card {
  margin-top: 20px;
  background: var(--ion-color-light);
}

.export-button {
  margin-top: 20px;
}
</style>

