<template>
  <main class="content">
    <div class="calculator-card">
      <div class="calculator-header">
        <h2 class="calculator-title">
          {{ currentCalculator.emoji }} {{ currentCalculator.title }}
        </h2>
        <p class="calculator-description">{{ currentCalculator.description }}</p>
      </div>

      <div class="calculator-layout">
        <div class="input-section">
          <h3 class="section-title">📝 Input Parameters</h3>
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
                :value="inputs[activeCalculator][input.name]"
                @input="updateInput(input.name, $event.target.value)"
                :placeholder="input.placeholder">
            </div>
          </div>
        </div>

        <div class="result-section">
          <div class="result-section-header">
            <h3 class="section-title">📊 Results</h3>
            <button 
              v-if="calculatedResult.value !== null" 
              class="export-button floating" 
              @click="showExportModal = true">
              📤 {{ $t('app.export.title') }}
            </button>
          </div>
          <div v-if="calculatedResult.error" class="error-message">
            ⚠️ {{ calculatedResult.error }}
          </div>
          <div v-else-if="calculatedResult.value !== null" class="result-container">
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
          <div v-else class="result-placeholder">
            <div class="placeholder-icon">🎯</div>
            <p>Enter your parameters to see the calculated sample size</p>
          </div>
        </div>
      </div>

      <div class="usage-info" v-if="currentCalculator.usage">
        <div class="usage-title">{{ $t('app.calculators.usage') }}</div>
        <p class="usage-text">{{ currentCalculator.usage }}</p>
        <div class="usage-example" v-if="currentCalculator.example">
          <strong>{{ $t('app.calculators.example') }}</strong> {{ currentCalculator.example }}
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
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
  emits: ['update-input'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const showExportModal = ref(false)
    
    const currentCalculator = computed(() => {
      const calculator = [...estimationCalculators, ...hypothesisCalculators, ...ratesCalculators]
        .find(c => c.key === props.activeCalculator)
      
      if (!calculator) return null
      
      // Try to get translations, fallback to original data
      const titleKey = `app.calculatorData.${props.activeCalculator}.title`
      const descKey = `app.calculatorData.${props.activeCalculator}.description`
      const usageKey = `app.calculatorData.${props.activeCalculator}.usage`
      const exampleKey = `app.calculatorData.${props.activeCalculator}.example`
      
      // Get translations - if translation key is returned, it means translation not found
      const translatedTitle = t(titleKey)
      const translatedDesc = t(descKey)
      const translatedUsage = t(usageKey)
      const translatedExample = t(exampleKey)
      
      
      // Check if translation was found (if it equals the key, it wasn't found)
      const finalTitle = translatedTitle === titleKey ? calculator.title : translatedTitle
      const finalDesc = translatedDesc === descKey ? calculator.description : translatedDesc
      const finalUsage = translatedUsage === usageKey ? calculator.usage : translatedUsage
      const finalExample = translatedExample === exampleKey ? calculator.example : translatedExample
      
      return {
        ...calculator,
        title: finalTitle,
        description: finalDesc,
        usage: finalUsage,
        example: finalExample
      }
    })
    
    const calculatedResult = computed(() => {
      switch(props.activeCalculator) {
        case 'estimateProportion':
          return calculators.calculateEstimateProportion(props.inputs.estimateProportion)
        case 'estimateMean':
          return calculators.calculateEstimateMean(props.inputs.estimateMean)
        case 'estimateDiff2Proportions':
          return calculators.calculateEstimateDiff2Proportions(props.inputs.estimateDiff2Proportions)
        case 'estimateOddsRatio':
          return calculators.calculateEstimateOddsRatio(props.inputs.estimateOddsRatio)
        case 'estimateRelativeRisk':
          return calculators.calculateEstimateRelativeRisk(props.inputs.estimateRelativeRisk)
        case 'estimateCorrelation':
          return calculators.calculateEstimateCorrelation(props.inputs.estimateCorrelation)
        case 'testProportion':
          return calculators.calculateTestProportion(props.inputs.testProportion)
        case 'test2Proportions':
          return calculators.calculateTest2Proportions(props.inputs.test2Proportions)
        case 'test2Means':
          return calculators.calculateTest2Means(props.inputs.test2Means)
        case 'test2Correlations':
          return calculators.calculateTest2Correlations(props.inputs.test2Correlations)
        case 'test2Rates':
          return calculators.calculateTest2Rates(props.inputs.test2Rates)
        default:
          return { value: null, error: null }
      }
    })
    
    const updateInput = (inputName, value) => {
      emit('update-input', props.activeCalculator, inputName, parseFloat(value) || 0)
    }
    
    return {
      showExportModal,
      currentCalculator,
      calculatedResult,
      updateInput
    }
  }
}
</script>
