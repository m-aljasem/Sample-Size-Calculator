<template>
  <ion-card v-if="formulaData" class="formula-card">
    <ion-card-header>
      <ion-card-title>📐 Mathematical Formula</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <div class="formula-box">
        <div ref="formulaElement" class="formula-text"></div>
        <div v-if="formulaData.formulaDetail" ref="formulaDetailElement" class="formula-detail"></div>
      </div>

      <div class="variables-section">
        <h4 class="variables-title">Variables</h4>
        <ion-list>
          <ion-item 
            v-for="variable in formulaData.variables" 
            :key="variable.symbol"
            lines="none"
            class="variable-item"
          >
            <ion-label>
              <div class="variable-header">
                <span class="variable-symbol">{{ variable.symbol }}</span>
                <span class="variable-name">{{ variable.name }}</span>
              </div>
              <p class="variable-description">{{ variable.description }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick } from 'vue';
// @ts-ignore - KaTeX types
import { render } from 'katex';
import 'katex/dist/katex.min.css';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/vue';
import { formulas } from '../data/formulas';

const props = defineProps<{
  calculatorKey: string;
}>();

const formulaElement = ref<HTMLElement | null>(null);
const formulaDetailElement = ref<HTMLElement | null>(null);

const formulaData = computed(() => {
  return formulas[props.calculatorKey] || null;
});

const renderFormula = () => {
  if (!formulaData.value) return;

  // Render main formula
  if (formulaElement.value && formulaData.value.formulaLaTeX) {
    try {
      render(formulaData.value.formulaLaTeX, formulaElement.value, {
        throwOnError: false,
        displayMode: true,
        strict: false
      });
    } catch (e) {
      console.error('Error rendering formula:', e);
      if (formulaElement.value) {
        formulaElement.value.textContent = formulaData.value.formula;
      }
    }
  }

  // Render formula detail if exists
  if (formulaDetailElement.value && formulaData.value.formulaDetailLaTeX) {
    try {
      render(formulaData.value.formulaDetailLaTeX, formulaDetailElement.value, {
        throwOnError: false,
        displayMode: true,
        strict: false
      });
    } catch (e) {
      console.error('Error rendering formula detail:', e);
      if (formulaDetailElement.value && formulaData.value.formulaDetail) {
        formulaDetailElement.value.textContent = formulaData.value.formulaDetail;
      }
    }
  } else if (formulaDetailElement.value && formulaData.value.formulaDetail && !formulaData.value.formulaDetailLaTeX) {
    formulaDetailElement.value.textContent = formulaData.value.formulaDetail;
  }
};

watch(formulaData, () => {
  nextTick(() => {
    renderFormula();
  });
}, { immediate: true });

onMounted(() => {
  renderFormula();
});
</script>

<style scoped>
.formula-card {
  margin-top: 20px;
}

.formula-box {
  background: var(--ion-color-light);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.formula-text {
  font-size: 1.2rem;
  color: var(--ion-color-primary);
  display: block;
  line-height: 1.8;
  overflow-x: auto;
  text-align: center;
  padding: 10px;
}

.formula-text :deep(.katex) {
  font-size: 1.2rem;
}

.formula-text :deep(.katex-display) {
  margin: 0;
}

.formula-detail {
  margin-top: 12px;
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  font-style: italic;
  line-height: 1.6;
}

.variables-section {
  margin-top: 20px;
}

.variables-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--ion-color-primary);
  margin-bottom: 15px;
}

.variable-item {
  margin-bottom: 12px;
  --padding-start: 0;
  --inner-padding-end: 0;
}

.variable-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.variable-symbol {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--ion-color-primary);
  font-family: 'Courier New', monospace;
  min-width: 35px;
  text-align: center;
  background: var(--ion-color-light);
  padding: 4px 8px;
  border-radius: 5px;
}

.variable-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.variable-description {
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  line-height: 1.6;
  margin: 0;
  padding-left: 43px;
}
</style>

