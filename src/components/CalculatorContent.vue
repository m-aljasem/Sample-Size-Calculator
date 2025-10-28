<template>
  <main class="content">
    <div class="calculator-card">
      <div class="calculator-header">
        <h2 class="calculator-title">
          {{ currentCalculator.emoji }} {{ currentCalculator.title }}
        </h2>
        <p class="calculator-description">{{ currentCalculator.description }}</p>
        
        <div class="usage-info" v-if="currentCalculator.usage">
          <div class="usage-title">{{ $t('app.calculators.usage') }}</div>
          <p class="usage-text">{{ currentCalculator.usage }}</p>
          <div class="usage-example" v-if="currentCalculator.example">
            <strong>{{ $t('app.calculators.example') }}</strong> {{ currentCalculator.example }}
          </div>
        </div>
      </div>

      <div class="input-form">
        <div 
          v-for="input in currentCalculator.inputs" 
          :key="input.name"
          class="input-group">
          <label class="input-label">
            {{ input.label }}
            <span 
              class="tooltip" 
              :data-tooltip="input.tooltip">
              ?
            </span>
          </label>
          <input 
            type="number" 
            class="input-field"
            :step="input.step || 'any'"
            :min="input.min"
            :max="input.max"
            v-model.number="inputs[activeCalculator][input.name]"
            :placeholder="input.placeholder">
        </div>
      </div>

      <div v-if="calculatedResult.error" class="error-message">
        ⚠️ {{ calculatedResult.error }}
      </div>
      <div v-else-if="calculatedResult.value !== null" class="result-container">
        <div class="result-actions">
          <button class="export-button" @click="showExportModal = true">
            📤 {{ $t('export.title') }}
          </button>
        </div>
        <div v-if="calculatedResult.isMulti" class="result-multi">
          <div class="result-label">{{ calculatedResult.label || $t('app.calculators.calculatedSampleSizes') }}</div>
          <div class="result-item">
            <div class="result-item-label">{{ calculatedResult.label1 }}</div>
            <div class="result-item-value">{{ calculatedResult.value }} 🎯</div>
          </div>
          <div class="result-item">
            <div class="result-item-label">{{ calculatedResult.label2 }}</div>
            <div class="result-item-value">{{ calculatedResult.value2 }} 🎯</div>
          </div>
        </div>
        <div v-else>
          <div class="result-label">{{ calculatedResult.label || $t('app.calculators.requiredSampleSize') }}</div>
          <div class="result-value">
            {{ calculatedResult.value }} 🎯
          </div>
          <div class="result-note">{{ calculatedResult.note || $t('app.calculators.roundedUp') }}</div>
        </div>
      </div>
    </div>

    <ExportResults 
      v-if="showExportModal"
      :show-export="showExportModal"
      :calculator-data="currentCalculator"
      :result="calculatedResult"
      @close="showExportModal = false" />
  </main>
</template>

<script>
import { ref } from 'vue'
import { estimationCalculators, hypothesisCalculators, ratesCalculators } from '../data/calculators.js'
import * as calculators from '../utils/calculators.js'
import ExportResults from './ExportResults.vue'

export default {
  name: 'CalculatorContent',
  components: {
    ExportResults
  },
  props: {
    activeCalculator: {
      type: String,
      required: true
    },
    inputs: {
      type: Object,
      required: true
    }
  },
  setup() {
    const showExportModal = ref(false)
    
    return {
      showExportModal
    }
  },
  data() {
    return {
      estimationCalculators,
      hypothesisCalculators,
      ratesCalculators
    }
  },
  computed: {
    currentCalculator() {
      return [...this.estimationCalculators, ...this.hypothesisCalculators, ...this.ratesCalculators]
        .find(c => c.key === this.activeCalculator)
    },
    calculatedResult() {
      switch(this.activeCalculator) {
        case 'estimateProportion':
          return calculators.calculateEstimateProportion(this.inputs.estimateProportion)
        case 'estimateMean':
          return calculators.calculateEstimateMean(this.inputs.estimateMean)
        case 'estimateDiff2Proportions':
          return calculators.calculateEstimateDiff2Proportions(this.inputs.estimateDiff2Proportions)
        case 'estimateOddsRatio':
          return calculators.calculateEstimateOddsRatio(this.inputs.estimateOddsRatio)
        case 'estimateRelativeRisk':
          return calculators.calculateEstimateRelativeRisk(this.inputs.estimateRelativeRisk)
        case 'estimateCorrelation':
          return calculators.calculateEstimateCorrelation(this.inputs.estimateCorrelation)
        case 'testProportion':
          return calculators.calculateTestProportion(this.inputs.testProportion)
        case 'test2Proportions':
          return calculators.calculateTest2Proportions(this.inputs.test2Proportions)
        case 'test2Means':
          return calculators.calculateTest2Means(this.inputs.test2Means)
        case 'test2Correlations':
          return calculators.calculateTest2Correlations(this.inputs.test2Correlations)
        case 'test2Rates':
          return calculators.calculateTest2Rates(this.inputs.test2Rates)
        default:
          return { value: null, error: null }
      }
    }
  }
}
</script>
