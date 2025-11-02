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
            
            <!-- Advanced Options -->
            <div class="advanced-options" v-if="showAdvancedOptions">
              <!-- One/Two-Tailed Toggle (for hypothesis testing) -->
              <div class="input-group" v-if="isHypothesisTest">
                <label class="input-label">
                  Test Type
                  <span class="tooltip" data-tooltip="Two-tailed tests are standard for most research. One-tailed tests assume a directional hypothesis and require smaller sample sizes.">?</span>
                </label>
                <div class="toggle-group">
                  <button 
                    class="toggle-button" 
                    :class="{ active: !inputs[activeCalculator].twoTailed }"
                    @click="updateInput('twoTailed', false)">
                    One-Tailed
                  </button>
                  <button 
                    class="toggle-button" 
                    :class="{ active: inputs[activeCalculator].twoTailed !== false }"
                    @click="updateInput('twoTailed', true)">
                    Two-Tailed
                  </button>
                </div>
                <small v-if="inputs[activeCalculator].twoTailed === false" class="warning-text">
                  ⚠️ One-tailed assumes directional hypothesis
                </small>
              </div>
              
              <!-- Allocation Ratio (for two-group tests) -->
              <div class="input-group" v-if="isTwoGroupTest">
                <label class="input-label">
                  Allocation Ratio (n₂:n₁)
                  <span class="tooltip" data-tooltip="Ratio of sample size in group 2 to group 1. Default is 1:1 (equal groups).">?</span>
                </label>
                <input 
                  type="number" 
                  class="input-field"
                  step="0.1"
                  min="0.1"
                  :value="inputs[activeCalculator].allocationRatio || 1"
                  @input="updateInput('allocationRatio', $event.target.value)"
                  placeholder="1">
                <small class="info-text" v-if="inputs[activeCalculator].allocationRatio && inputs[activeCalculator].allocationRatio !== 1">
                  Group 2 will have {{ (inputs[activeCalculator].allocationRatio || 1).toFixed(1) }}x the size of Group 1
                </small>
              </div>
              
              <!-- Attrition/Dropout Rate -->
              <div class="input-group">
                <label class="input-label">
                  Expected Dropout Rate (%)
                  <span class="tooltip" data-tooltip="Percentage of participants expected to drop out. Sample size will be adjusted automatically.">?</span>
                </label>
                <input 
                  type="number" 
                  class="input-field"
                  step="1"
                  min="0"
                  max="99"
                  :value="(inputs[activeCalculator].dropoutRate || 0) * 100"
                  @input="updateInput('dropoutRate', ($event.target.value / 100) || 0)"
                  placeholder="0">
                <small class="info-text" v-if="inputs[activeCalculator].dropoutRate && inputs[activeCalculator].dropoutRate > 0">
                  Sample size will be increased by {{ ((1 / (1 - inputs[activeCalculator].dropoutRate) - 1) * 100).toFixed(0) }}% to account for dropouts
                </small>
              </div>
            </div>
            
            <button class="toggle-advanced-button" @click="showAdvancedOptions = !showAdvancedOptions">
              {{ showAdvancedOptions ? '▼ Hide' : '▶ Show' }} Advanced Options
            </button>
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
          <!-- Validation Warnings -->
          <div v-if="validationWarnings.length > 0" class="warnings-container">
            <div 
              v-for="(warning, idx) in validationWarnings" 
              :key="idx"
              class="warning-message"
              :class="warning.severity">
              <span v-if="warning.severity === 'warning'">⚠️</span>
              <span v-else>ℹ️</span>
              {{ warning.message }}
            </div>
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
              <div v-if="calculatedResult.valueAdjusted" class="result-adjusted">
                <strong>Adjusted for {{ (calculatedResult.dropoutRate * 100).toFixed(0) }}% dropout:</strong> {{ calculatedResult.valueAdjusted }} 🎯
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

      <FormulaDisplay :calculator-key="activeCalculator" />

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
      :calculator-key="activeCalculator"
      :input-values="inputs[activeCalculator]"
      :result="calculatedResult"
      @close="showExportModal = false" />
  </main>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FormulaDisplay from './FormulaDisplay.vue'
import { estimationCalculators, hypothesisCalculators, ratesCalculators } from '../data/calculators.js'
import * as calculators from '../utils/calculators.js'
import ExportResults from './ExportResults.vue'
import { validateInputs, validateCalculationResult } from '../utils/validation.js'

export default {
  name: 'CalculatorContent',
  components: {
    ExportResults,
    FormulaDisplay
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
    const showAdvancedOptions = ref(false)
    
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
    
    const isHypothesisTest = computed(() => {
      return ['testProportion', 'test2Proportions', 'test2Means', 'test2Correlations', 'test2Rates'].includes(props.activeCalculator)
    })
    
    const isTwoGroupTest = computed(() => {
      return ['test2Proportions', 'test2Means', 'test2Correlations', 'test2Rates'].includes(props.activeCalculator)
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
    
    const validationWarnings = computed(() => {
      const validation = validateInputs(props.inputs[props.activeCalculator], props.activeCalculator)
      const resultValidation = validateCalculationResult(calculatedResult.value)
      return [...validation.warnings, ...resultValidation.warnings]
    })
    
    const updateInput = (inputName, value) => {
      emit('update-input', props.activeCalculator, inputName, parseFloat(value) || 0)
    }
    
    return {
      showExportModal,
      showAdvancedOptions,
      currentCalculator,
      calculatedResult,
      updateInput,
      isHypothesisTest,
      isTwoGroupTest,
      validationWarnings
    }
  }
}
</script>
