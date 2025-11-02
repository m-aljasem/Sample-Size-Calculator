<template>
  <div class="effect-size-helpers">
    <div class="feature-header">
      <h2>📐 Effect Size Estimation Helpers</h2>
      <p>Convert from published results, use field-specific benchmarks, and get guidance on effect sizes</p>
    </div>

    <div class="helpers-container">
      <!-- Converter Tools -->
      <div class="helper-section">
        <h3>Convert from Published Statistics</h3>
        <div class="converter-tabs">
          <button 
            v-for="tab in converterTabs" 
            :key="tab.id"
            class="tab-button"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id">
            {{ tab.label }}
          </button>
        </div>

        <!-- T-Statistic Converter -->
        <div v-if="activeTab === 'tstat'" class="converter-form">
          <div class="input-group">
            <label>t-statistic</label>
            <input type="number" v-model.number="tStat" step="0.01" placeholder="2.5">
          </div>
          <div class="input-group">
            <label>n₁ (Group 1 Sample Size)</label>
            <input type="number" v-model.number="n1" step="1" placeholder="30">
          </div>
          <div class="input-group">
            <label>n₂ (Group 2 Sample Size)</label>
            <input type="number" v-model.number="n2" step="1" placeholder="30">
          </div>
          <button @click="convertTStat" class="convert-btn">Convert</button>
          <div v-if="convertedEffectSize" class="result-box">
            <strong>Cohen's d:</strong> {{ convertedEffectSize.toFixed(3) }}
            <div class="interpretation">{{ getEffectInterpretation(convertedEffectSize) }}</div>
          </div>
        </div>

        <!-- F-Statistic Converter -->
        <div v-if="activeTab === 'fstat'" class="converter-form">
          <div class="input-group">
            <label>F-statistic</label>
            <input type="number" v-model.number="fStat" step="0.01" placeholder="5.2">
          </div>
          <div class="input-group">
            <label>df₁ (Between groups)</label>
            <input type="number" v-model.number="df1" step="1" placeholder="2">
          </div>
          <div class="input-group">
            <label>df₂ (Within groups)</label>
            <input type="number" v-model.number="df2" step="1" placeholder="57">
          </div>
          <button @click="convertFStat" class="convert-btn">Convert</button>
          <div v-if="convertedEffectSize" class="result-box">
            <strong>Effect Size:</strong> {{ convertedEffectSize.toFixed(3) }}
            <div class="interpretation">{{ getEffectInterpretation(convertedEffectSize) }}</div>
          </div>
        </div>

        <!-- Chi-Square Converter -->
        <div v-if="activeTab === 'chisq'" class="converter-form">
          <div class="input-group">
            <label>χ² (Chi-square)</label>
            <input type="number" v-model.number="chiSq" step="0.01" placeholder="8.5">
          </div>
          <div class="input-group">
            <label>n (Total Sample Size)</label>
            <input type="number" v-model.number="nTotal" step="1" placeholder="100">
          </div>
          <div class="input-group">
            <label>df (Degrees of Freedom)</label>
            <input type="number" v-model.number="chiDf" step="1" placeholder="1">
          </div>
          <button @click="convertChiSq" class="convert-btn">Convert</button>
          <div v-if="convertedEffectSize" class="result-box">
            <strong>Cramér's V:</strong> {{ convertedEffectSize.toFixed(3) }}
          </div>
        </div>

        <!-- P-Value Converter -->
        <div v-if="activeTab === 'pval'" class="converter-form">
          <div class="input-group">
            <label>p-value</label>
            <input type="number" v-model.number="pValue" step="0.001" min="0" max="1" placeholder="0.03">
          </div>
          <div class="input-group">
            <label>n₁</label>
            <input type="number" v-model.number="pN1" step="1" placeholder="30">
          </div>
          <div class="input-group">
            <label>n₂</label>
            <input type="number" v-model.number="pN2" step="1" placeholder="30">
          </div>
          <div class="input-group">
            <label>Two-tailed?</label>
            <input type="checkbox" v-model="twoTailedP">
          </div>
          <button @click="convertPValue" class="convert-btn">Convert</button>
          <div v-if="convertedEffectSize" class="result-box">
            <strong>Approximate Effect Size:</strong> {{ convertedEffectSize.toFixed(3) }}
            <div class="interpretation warning">⚠️ This is an approximation. Use with caution.</div>
          </div>
        </div>
      </div>

      <!-- Field-Specific Benchmarks -->
      <div class="helper-section">
        <h3>Field-Specific Effect Size Benchmarks</h3>
        <div class="field-selector">
          <label>Select Research Field</label>
          <select v-model="selectedField" @change="updateBenchmarks">
            <option value="default">General/Default</option>
            <option value="psychology">Psychology</option>
            <option value="medicine">Medicine</option>
            <option value="education">Education</option>
          </select>
        </div>

        <div v-if="currentBenchmarks" class="benchmarks-display">
          <div class="benchmark-card">
            <h4>Cohen's d</h4>
            <div class="benchmark-item">
              <span class="size-label">Small:</span> {{ currentBenchmarks.cohensD.small }}
            </div>
            <div class="benchmark-item">
              <span class="size-label">Medium:</span> {{ currentBenchmarks.cohensD.medium }}
            </div>
            <div class="benchmark-item">
              <span class="size-label">Large:</span> {{ currentBenchmarks.cohensD.large }}
            </div>
          </div>

          <div v-if="currentBenchmarks.correlation" class="benchmark-card">
            <h4>Correlation (r)</h4>
            <div class="benchmark-item">
              <span class="size-label">Small:</span> {{ currentBenchmarks.correlation.small }}
            </div>
            <div class="benchmark-item">
              <span class="size-label">Medium:</span> {{ currentBenchmarks.correlation.medium }}
            </div>
            <div class="benchmark-item">
              <span class="size-label">Large:</span> {{ currentBenchmarks.correlation.large }}
            </div>
          </div>
        </div>
      </div>

      <!-- Effect Size Calculator -->
      <div class="helper-section">
        <h3>Calculate Effect Size from Raw Data</h3>
        <div class="calc-type-selector">
          <button 
            class="calc-type-btn"
            :class="{ active: calcType === 'means' }"
            @click="calcType = 'means'">
            Means & SDs
          </button>
          <button 
            class="calc-type-btn"
            :class="{ active: calcType === 'proportions' }"
            @click="calcType = 'proportions'">
            Proportions
          </button>
        </div>

        <div v-if="calcType === 'means'" class="calc-form">
          <div class="input-group">
            <label>μ₁ (Mean Group 1)</label>
            <input type="number" v-model.number="mean1" step="0.01" placeholder="100">
          </div>
          <div class="input-group">
            <label>μ₂ (Mean Group 2)</label>
            <input type="number" v-model.number="mean2" step="0.01" placeholder="95">
          </div>
          <div class="input-group">
            <label>SD₁ (Standard Deviation Group 1)</label>
            <input type="number" v-model.number="sd1" step="0.01" min="0" placeholder="15">
          </div>
          <div class="input-group">
            <label>SD₂ (Standard Deviation Group 2)</label>
            <input type="number" v-model.number="sd2" step="0.01" min="0" placeholder="15">
          </div>
          <button @click="calculateCohenD" class="convert-btn">Calculate</button>
          <div v-if="calculatedCohenD !== null" class="result-box">
            <strong>Cohen's d:</strong> {{ calculatedCohenD.toFixed(3) }}
            <div class="interpretation">{{ getEffectInterpretation(calculatedCohenD) }}</div>
          </div>
        </div>

        <div v-if="calcType === 'proportions'" class="calc-form">
          <div class="input-group">
            <label>p₁ (Proportion Group 1)</label>
            <input type="number" v-model.number="prop1" step="0.01" min="0" max="1" placeholder="0.6">
          </div>
          <div class="input-group">
            <label>p₂ (Proportion Group 2)</label>
            <input type="number" v-model.number="prop2" step="0.01" min="0" max="1" placeholder="0.4">
          </div>
          <button @click="calculatePropEffect" class="convert-btn">Calculate</button>
          <div v-if="calculatedPropEffect !== null" class="result-box">
            <strong>Effect Size:</strong> {{ calculatedPropEffect.toFixed(3) }}
            <div class="interpretation">{{ getEffectInterpretation(calculatedPropEffect) }}</div>
          </div>
        </div>
      </div>

      <!-- Interpretation Guide -->
      <div class="helper-section">
        <h3>Effect Size Interpretation Guide</h3>
        <div class="interpretation-guide">
          <div class="guide-item">
            <div class="guide-size small">Small Effect</div>
            <p>Effect is present but may not be practically significant. Large sample sizes needed.</p>
          </div>
          <div class="guide-item">
            <div class="guide-size medium">Medium Effect</div>
            <p>Moderate practical significance. Standard sample sizes typically sufficient.</p>
          </div>
          <div class="guide-item">
            <div class="guide-size large">Large Effect</div>
            <p>Strong practical significance. Smaller sample sizes may be adequate.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { 
  convertTStatToEffectSize, 
  convertFStatToEffectSize, 
  convertChiSqToEffectSize, 
  convertPValueToEffectSize,
  effectSizeBenchmarks,
  getEffectSizeInterpretation
} from '../utils/effectSizeHelpers.js'

export default {
  name: 'EffectSizeHelpers',
  setup() {
    const activeTab = ref('tstat')
    const convertedEffectSize = ref(null)
    
    // Converter inputs
    const tStat = ref(null)
    const n1 = ref(null)
    const n2 = ref(null)
    const fStat = ref(null)
    const df1 = ref(null)
    const df2 = ref(null)
    const chiSq = ref(null)
    const nTotal = ref(null)
    const chiDf = ref(null)
    const pValue = ref(null)
    const pN1 = ref(null)
    const pN2 = ref(null)
    const twoTailedP = ref(true)
    
    // Calculator inputs
    const calcType = ref('means')
    const mean1 = ref(null)
    const mean2 = ref(null)
    const sd1 = ref(null)
    const sd2 = ref(null)
    const prop1 = ref(null)
    const prop2 = ref(null)
    const calculatedCohenD = ref(null)
    const calculatedPropEffect = ref(null)
    
    const selectedField = ref('default')
    const currentBenchmarks = computed(() => {
      return effectSizeBenchmarks[selectedField.value] || effectSizeBenchmarks.default
    })

    const converterTabs = [
      { id: 'tstat', label: 't-statistic' },
      { id: 'fstat', label: 'F-statistic' },
      { id: 'chisq', label: 'Chi-square' },
      { id: 'pval', label: 'p-value' }
    ]

    const convertTStat = () => {
      if (tStat.value && n1.value && n2.value) {
        convertedEffectSize.value = convertTStatToEffectSize(tStat.value, n1.value, n2.value)
      }
    }

    const convertFStat = () => {
      if (fStat.value && df1.value && df2.value) {
        convertedEffectSize.value = convertFStatToEffectSize(fStat.value, df1.value, df2.value)
      }
    }

    const convertChiSq = () => {
      if (chiSq.value && nTotal.value && chiDf.value) {
        convertedEffectSize.value = convertChiSqToEffectSize(chiSq.value, nTotal.value, chiDf.value)
      }
    }

    const convertPValue = () => {
      if (pValue.value && pN1.value && pN2.value) {
        convertedEffectSize.value = convertPValueToEffectSize(pValue.value, pN1.value, pN2.value, twoTailedP.value)
      }
    }

    const calculateCohenD = () => {
      if (mean1.value !== null && mean2.value !== null && sd1.value && sd2.value) {
        const pooledSD = Math.sqrt((sd1.value * sd1.value + sd2.value * sd2.value) / 2)
        calculatedCohenD.value = (mean1.value - mean2.value) / pooledSD
      }
    }

    const calculatePropEffect = () => {
      if (prop1.value !== null && prop2.value !== null) {
        // Cohen's h for proportions
        const h = 2 * (Math.asin(Math.sqrt(prop1.value)) - Math.asin(Math.sqrt(prop2.value)))
        calculatedPropEffect.value = Math.abs(h)
      }
    }

    const getEffectInterpretation = (value) => {
      const interpretation = getEffectSizeInterpretation(Math.abs(value), 'cohensD', selectedField.value)
      return `Interpretation: ${interpretation} effect`
    }

    const updateBenchmarks = () => {
      // Benchmarks update automatically via computed property
    }

    return {
      activeTab,
      converterTabs,
      tStat,
      n1,
      n2,
      fStat,
      df1,
      df2,
      chiSq,
      nTotal,
      chiDf,
      pValue,
      pN1,
      pN2,
      twoTailedP,
      calcType,
      mean1,
      mean2,
      sd1,
      sd2,
      prop1,
      prop2,
      convertedEffectSize,
      calculatedCohenD,
      calculatedPropEffect,
      selectedField,
      currentBenchmarks,
      convertTStat,
      convertFStat,
      convertChiSq,
      convertPValue,
      calculateCohenD,
      calculatePropEffect,
      getEffectInterpretation,
      updateBenchmarks
    }
  }
}
</script>

<style scoped>
.effect-size-helpers {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.feature-header {
  text-align: center;
  margin-bottom: 2rem;
}

.helpers-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.helper-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.converter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #E9ECEF;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: #6C757D;
}

.tab-button.active {
  color: #007BFF;
  border-bottom-color: #007BFF;
}

.converter-form, .calc-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.input-group input {
  padding: 0.75rem;
  border: 2px solid #CED4DA;
  border-radius: 8px;
}

.convert-btn {
  grid-column: 1 / -1;
  padding: 0.75rem;
  background: #007BFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  max-width: 200px;
}

.result-box {
  grid-column: 1 / -1;
  background: #E7F3FF;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  border-left: 4px solid #007BFF;
}

.interpretation {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6C757D;
}

.interpretation.warning {
  color: #FF6B6B;
}

.field-selector {
  margin-bottom: 1.5rem;
}

.field-selector label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.field-selector select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #CED4DA;
  border-radius: 8px;
}

.benchmarks-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.benchmark-card {
  background: #F8F9FA;
  padding: 1rem;
  border-radius: 8px;
}

.benchmark-card h4 {
  margin-bottom: 1rem;
  color: #007BFF;
}

.benchmark-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #E9ECEF;
}

.size-label {
  font-weight: 600;
}

.calc-type-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.calc-type-btn {
  flex: 1;
  padding: 0.75rem;
  background: #F8F9FA;
  border: 2px solid #CED4DA;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.calc-type-btn.active {
  background: #007BFF;
  color: white;
  border-color: #007BFF;
}

.interpretation-guide {
  display: grid;
  gap: 1rem;
}

.guide-item {
  padding: 1rem;
  background: #F8F9FA;
  border-radius: 8px;
}

.guide-size {
  font-weight: 700;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  text-align: center;
}

.guide-size.small {
  background: #E7F3FF;
  color: #0056B3;
}

.guide-size.medium {
  background: #FFF3CD;
  color: #856404;
}

.guide-size.large {
  background: #D1ECF1;
  color: #0C5460;
}
</style>
