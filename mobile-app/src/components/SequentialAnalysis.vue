<template>
  <div class="sequential-analysis">
    <ion-card>
      <ion-card-header>
        <ion-card-title>📈 Sequential Analysis</ion-card-title>
        <ion-card-subtitle>Adaptive and sequential study designs</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-item>
          <ion-label position="stacked">Maximum Sample Size</ion-label>
          <ion-input
            v-model="maxSampleSize"
            type="number"
            placeholder="100"
            :min="1"
            @ion-input="calculateSequential"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Number of Interim Analyses</ion-label>
          <ion-input
            v-model="numInterim"
            type="number"
            placeholder="3"
            :min="1"
            :max="10"
            @ion-input="calculateSequential"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Alpha Spending Function</ion-label>
          <ion-select v-model="alphaSpending" @ionChange="calculateSequential">
            <ion-select-option value="obrien-fleming">O\'Brien-Fleming</ion-select-option>
            <ion-select-option value="pocock">Pocock</ion-select-option>
            <ion-select-option value="linear">Linear</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-card v-if="interimSamples.length > 0" color="primary" class="result-card">
          <ion-card-header>
            <ion-card-title>Interim Analysis Plan</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item v-for="(sample, index) in interimSamples" :key="index" lines="full">
                <ion-label>
                  <h3>Analysis {{ index + 1 }}</h3>
                  <p>Sample Size: {{ sample }}</p>
                  <p>Alpha Level: {{ interimAlphas[index].toFixed(4) }}</p>
                </ion-label>
              </ion-item>
            </ion-list>

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
            <p><strong>Sequential Analysis</strong> allows for early stopping of a study based on interim results, potentially saving time and resources while maintaining statistical validity. The alpha spending function controls how significance thresholds are distributed across analyses.</p>
          </ion-card-content>
        </ion-card>
      </ion-card-content>
    </ion-card>

    <AdvancedFeatureExport
      :show-export="showExportModal"
      feature-name="Sequential Analysis"
      :inputs="{
        'Maximum Sample Size': maxSampleSize,
        'Number of Interim Analyses': numInterim,
        'Alpha Spending Function': alphaSpending
      }"
      :results="interimResults"
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
  IonSelect,
  IonSelectOption,
  IonList,
  IonButton,
  IonIcon
} from '@ionic/vue';
import { downloadOutline } from 'ionicons/icons';
import AdvancedFeatureExport from './AdvancedFeatureExport.vue';

const maxSampleSize = ref(100);
const numInterim = ref(3);
const alphaSpending = ref('obrien-fleming');
const showExportModal = ref(false);

const interimSamples = computed(() => {
  if (!maxSampleSize.value || !numInterim.value) return [];
  const samples: number[] = [];
  const total = maxSampleSize.value;
  const n = numInterim.value;
  
  for (let i = 1; i <= n; i++) {
    samples.push(Math.floor((total * i) / (n + 1)));
  }
  
  return samples;
});

const interimAlphas = computed(() => {
  if (!numInterim.value) return [];
  const alphas: number[] = [];
  const n = numInterim.value;
  const totalAlpha = 0.05;
  
  // Simplified alpha spending based on function type
  if (alphaSpending.value === 'obrien-fleming') {
    // O'Brien-Fleming: more conservative early, more liberal later
    for (let i = 1; i <= n; i++) {
      const fraction = i / (n + 1);
      alphas.push(totalAlpha * (1 - Math.exp(-2 * fraction)));
    }
  } else if (alphaSpending.value === 'pocock') {
    // Pocock: equal spending
    for (let i = 1; i <= n; i++) {
      alphas.push(totalAlpha / (n + 1));
    }
  } else {
    // Linear: proportional spending
    for (let i = 1; i <= n; i++) {
      alphas.push(totalAlpha * (i / (n + 1)));
    }
  }
  
  return alphas;
});

const calculateSequential = () => {
  // Computed reactively
};

const interimResults = computed(() => {
  const results: Record<string, string> = {};
  if (interimSamples.value.length > 0) {
    interimSamples.value.forEach((sample, index) => {
      results[`Analysis ${index + 1} - Sample Size`] = sample.toString();
      results[`Analysis ${index + 1} - Alpha Level`] = interimAlphas.value[index]?.toFixed(4) || 'N/A';
    });
  }
  return results;
});
</script>

<style scoped>
.result-card {
  margin-top: 20px;
}

.info-card {
  margin-top: 20px;
  background: var(--ion-color-light);
}

.export-button {
  margin-top: 20px;
}
</style>

