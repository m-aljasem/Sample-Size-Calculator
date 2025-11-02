<template>
  <div class="power-analysis">
    <ion-card>
      <ion-card-header>
        <ion-card-title>⚡ Power Analysis</ion-card-title>
        <ion-card-subtitle>Calculate statistical power for your study design</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-item>
          <ion-label position="stacked">Sample Size (n)</ion-label>
          <ion-input
            :value="String(sampleSize)"
            @ion-input="handleSampleSizeInput"
            type="number"
            placeholder="Enter sample size"
            :min="1"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Effect Size (d)</ion-label>
          <ion-input
            :value="String(effectSize)"
            @ion-input="handleEffectSizeInput"
            type="number"
            placeholder="Enter effect size"
            step="0.01"
            :min="0"
          ></ion-input>
          <ion-note slot="helper">
            Small: 0.2 | Medium: 0.5 | Large: 0.8
          </ion-note>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Alpha Level (α)</ion-label>
          <ion-input
            :value="String(alpha)"
            @ion-input="handleAlphaInput"
            type="number"
            placeholder="0.05"
            step="0.01"
            :min="0"
            :max="1"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label>Test Type</ion-label>
          <ion-select v-model="testType" @ionChange="calculatePower">
            <ion-select-option value="two-tailed">Two-tailed</ion-select-option>
            <ion-select-option value="one-tailed">One-tailed</ion-select-option>
          </ion-select>
        </ion-item>

        <div v-if="power !== null" class="power-result">
          <ion-card color="primary">
            <ion-card-content>
              <h2 class="power-value" :class="getPowerClass(power)">
                {{ (power * 100).toFixed(1) }}%
              </h2>
              <p class="power-interpretation">{{ getPowerInterpretation(power) }}</p>
            </ion-card-content>
          </ion-card>

          <ion-card class="recommendations-card">
            <ion-card-header>
              <ion-card-title>💡 Recommendations</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                <ion-item v-if="power < 0.8" lines="none">
                  <ion-label>
                    <h3>Low Power</h3>
                    <p>Consider increasing sample size or effect size</p>
                  </ion-label>
                </ion-item>
                <ion-item v-if="power >= 0.8 && power < 0.9" lines="none">
                  <ion-label>
                    <h3>Good Power</h3>
                    <p>Adequate for most studies</p>
                  </ion-label>
                </ion-item>
                <ion-item v-if="power >= 0.9" lines="none">
                  <ion-label>
                    <h3>High Power</h3>
                    <p>Excellent statistical power</p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>

          <ion-button 
            expand="block" 
            color="primary"
            @click="showExportModal = true"
            class="export-button"
          >
            <ion-icon :icon="downloadOutline" slot="start"></ion-icon>
            Export Results
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>

    <AdvancedFeatureExport
      :show-export="showExportModal"
      feature-name="Power Analysis"
      :inputs="{
        'Sample Size (n)': sampleSize,
        'Effect Size (d)': effectSize,
        'Alpha Level (α)': alpha,
        'Test Type': testType
      }"
      :results="{
        'Statistical Power': power !== null ? `${(power * 100).toFixed(1)}%` : 'N/A',
        'Interpretation': power !== null ? getPowerInterpretation(power) : 'N/A'
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
  IonNote,
  IonSelect,
  IonSelectOption,
  IonList,
  IonButton,
  IonIcon
} from '@ionic/vue';
import { downloadOutline } from 'ionicons/icons';
import AdvancedFeatureExport from './AdvancedFeatureExport.vue';

const sampleSize = ref(30);
const effectSize = ref(0.5);
const alpha = ref(0.05);
const testType = ref('two-tailed');
const showExportModal = ref(false);

const power = computed(() => {
  if (!sampleSize.value || !effectSize.value) return null;
  
  // Simplified power calculation
  const zAlpha = testType.value === 'two-tailed' ? 1.96 : 1.645;
  const zBeta = Math.sqrt((effectSize.value * effectSize.value * sampleSize.value) / 4) - zAlpha;
  const calculatedPower = 1 - (1 - (0.5 * (1 + Math.sign(zBeta) * (1 - Math.exp(-2 * zBeta * zBeta / Math.PI)))));
  
  return Math.max(0, Math.min(0.99, calculatedPower));
});

const handleSampleSizeInput = (event: any) => {
  const value = event.detail.value;
  sampleSize.value = parseFloat(value) || 0;
  calculatePower();
};

const handleEffectSizeInput = (event: any) => {
  const value = event.detail.value;
  effectSize.value = parseFloat(value) || 0;
  calculatePower();
};

const handleAlphaInput = (event: any) => {
  const value = event.detail.value;
  alpha.value = parseFloat(value) || 0;
  calculatePower();
};

const calculatePower = () => {
  // Power is computed reactively
};

const getPowerClass = (powerValue: number) => {
  if (powerValue < 0.8) return 'low-power';
  if (powerValue < 0.9) return 'good-power';
  return 'high-power';
};

const getPowerInterpretation = (powerValue: number) => {
  if (powerValue < 0.8) return 'Low statistical power - consider increasing sample size';
  if (powerValue < 0.9) return 'Good statistical power - adequate for most studies';
  return 'High statistical power - excellent for detecting effects';
};
</script>

<style scoped>
.power-result {
  margin-top: 20px;
}

.power-value {
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin: 10px 0;
}

.power-value.low-power {
  color: var(--ion-color-danger);
}

.power-value.good-power {
  color: var(--ion-color-warning);
}

.power-value.high-power {
  color: var(--ion-color-success);
}

.power-interpretation {
  text-align: center;
  color: var(--ion-color-medium);
  margin-top: 10px;
}

.recommendations-card {
  margin-top: 20px;
}

.recommendations-card h3 {
  font-size: 1rem;
  font-weight: 600;
}

.export-button {
  margin-top: 20px;
}
</style>

