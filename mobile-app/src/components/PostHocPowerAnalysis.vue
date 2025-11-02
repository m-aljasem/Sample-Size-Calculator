<template>
  <div class="post-hoc-power">
    <ion-card>
      <ion-card-header>
        <ion-card-title>📊 Post-Hoc Power Analysis</ion-card-title>
        <ion-card-subtitle>Calculate achieved power based on actual study results</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <div class="input-section">
          <ion-item>
            <ion-label position="stacked">Test Type</ion-label>
            <ion-select v-model="testType" placeholder="Select test type">
              <ion-select-option value="testProportion">Single Proportion</ion-select-option>
              <ion-select-option value="test2Proportions">Two Proportions</ion-select-option>
              <ion-select-option value="test2Means">Two Means</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">α (Alpha)</ion-label>
            <ion-input
              v-model.number="alpha"
              type="number"
              step="0.01"
              min="0"
              max="1"
              placeholder="0.05"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Sample Size (n per group)</ion-label>
            <ion-input
              v-model.number="sampleSize"
              type="number"
              step="1"
              min="1"
              placeholder="100"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label>Test Type</ion-label>
            <ion-segment :value="twoTailed ? 'two' : 'one'" @ionChange="twoTailed = ($event.detail.value as string) === 'two'">
              <ion-segment-button value="one">
                <ion-label>One-Tailed</ion-label>
              </ion-segment-button>
              <ion-segment-button value="two">
                <ion-label>Two-Tailed</ion-label>
              </ion-segment-button>
            </ion-segment>
          </ion-item>

          <!-- Test-specific inputs -->
          <template v-if="testType === 'testProportion'">
            <ion-item>
              <ion-label position="stacked">p₀ (Null Proportion)</ion-label>
              <ion-input
                v-model.number="p0"
                type="number"
                step="0.01"
                min="0"
                max="1"
                placeholder="0.5"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">pₐ (Alternative/Observed)</ion-label>
              <ion-input
                v-model.number="pa"
                type="number"
                step="0.01"
                min="0"
                max="1"
                placeholder="0.6"
              ></ion-input>
            </ion-item>
          </template>

          <template v-if="testType === 'test2Proportions'">
            <ion-item>
              <ion-label position="stacked">p₁ (Group 1)</ion-label>
              <ion-input
                v-model.number="p1"
                type="number"
                step="0.01"
                min="0"
                max="1"
                placeholder="0.6"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">p₂ (Group 2)</ion-label>
              <ion-input
                v-model.number="p2"
                type="number"
                step="0.01"
                min="0"
                max="1"
                placeholder="0.4"
              ></ion-input>
            </ion-item>
          </template>

          <template v-if="testType === 'test2Means'">
            <ion-item>
              <ion-label position="stacked">μ₁ (Group 1 Mean)</ion-label>
              <ion-input
                v-model.number="mu1"
                type="number"
                step="0.01"
                placeholder="100"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">μ₂ (Group 2 Mean)</ion-label>
              <ion-input
                v-model.number="mu2"
                type="number"
                step="0.01"
                placeholder="95"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">σ₁ (Group 1 SD)</ion-label>
              <ion-input
                v-model.number="sd1"
                type="number"
                step="0.01"
                min="0"
                placeholder="15"
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">σ₂ (Group 2 SD)</ion-label>
              <ion-input
                v-model.number="sd2"
                type="number"
                step="0.01"
                min="0"
                placeholder="15"
              ></ion-input>
            </ion-item>
          </template>
        </div>
      </ion-card-content>
    </ion-card>

    <!-- Results -->
    <ion-card v-if="powerResult.power !== null && powerResult.power !== undefined || powerResult.error" class="result-card">
      <ion-card-header>
        <ion-card-title>Calculated Power</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <div v-if="powerResult.error" class="error-message">
          <ion-icon :icon="alertCircleOutline" color="danger"></ion-icon>
          <p>{{ powerResult.error }}</p>
        </div>
        <div v-else class="power-result">
          <div class="power-value">
            {{ (powerResult.power! * 100).toFixed(1) }}%
          </div>
          <div class="power-interpretation">
            <ion-note v-if="powerResult.power! < 0.5" color="danger">
              ⚠️ Low power: Your study had insufficient power to detect this effect.
            </ion-note>
            <ion-note v-else-if="powerResult.power! < 0.8" color="warning">
              ⚠️ Moderate power: Power below 80% may limit your ability to detect true effects.
            </ion-note>
            <ion-note v-else color="success">
              ✅ Adequate power: Your study had sufficient power to detect this effect.
            </ion-note>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
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
  IonSegment,
  IonSegmentButton,
  IonNote,
  IonIcon
} from '@ionic/vue';
import { alertCircleOutline } from 'ionicons/icons';
import * as calculators from '../utils/calculators';

const testType = ref('test2Proportions');
const alpha = ref(0.05);
const sampleSize = ref(100);
const twoTailed = ref(true);
const p0 = ref(0.5);
const pa = ref(0.6);
const p1 = ref(0.6);
const p2 = ref(0.4);
const mu1 = ref(100);
const mu2 = ref(95);
const sd1 = ref(15);
const sd2 = ref(15);

const powerResult = computed(() => {
  if (!alpha.value || !sampleSize.value) {
    return { power: null, error: null };
  }

  let inputs: Record<string, number> = {
    alpha: alpha.value,
    n: sampleSize.value,
    twoTailed: twoTailed.value ? 1 : 0
  };

  try {
    switch(testType.value) {
      case 'testProportion':
        if (!p0.value || !pa.value) return { power: null, error: null };
        inputs = { ...inputs, p0: p0.value, pa: pa.value };
        const result1 = calculators.calculatePostHocPowerTestProportion(inputs);
        return { power: result1.value, error: result1.error };
      case 'test2Proportions':
        if (!p1.value || !p2.value) return { power: null, error: null };
        inputs = { ...inputs, p1: p1.value, p2: p2.value };
        const result2 = calculators.calculatePostHocPowerTest2Proportions(inputs);
        return { power: result2.value, error: result2.error };
      case 'test2Means':
        if (!mu1.value || !mu2.value || !sd1.value || !sd2.value) return { power: null, error: null };
        inputs = { ...inputs, mu1: mu1.value, mu2: mu2.value, sd1: sd1.value, sd2: sd2.value };
        const result3 = calculators.calculatePostHocPowerTest2Means(inputs);
        return { power: result3.value, error: result3.error };
      default:
        return { power: null, error: 'Invalid test type' };
    }
  } catch (e: any) {
    return { power: null, error: e.message || 'Calculation error' };
  }
});
</script>

<style scoped>
.post-hoc-power {
  max-width: 100%;
}

.power-result {
  text-align: center;
  padding: 1rem 0;
}

.power-value {
  font-size: 3rem;
  font-weight: 700;
  color: var(--ion-color-primary);
  margin: 1rem 0;
}

.power-interpretation {
  margin-top: 1.5rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ion-color-danger);
}

.result-card {
  margin-top: 1rem;
}
</style>
