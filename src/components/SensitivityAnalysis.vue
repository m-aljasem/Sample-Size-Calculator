<template>
  <div class="sensitivity-analysis">
    <div class="feature-header">
      <h2>📈 Sensitivity Analysis</h2>
      <p>Explore how sample size changes when you're uncertain about parameter values</p>
    </div>

    <div class="sensitivity-container">
      <!-- Calculator Selection -->
      <div class="selector-section">
        <h3>Select Calculator</h3>
        <select v-model="selectedCalculator" class="calculator-select">
          <option value="">-- Select Calculator --</option>
          <optgroup label="Hypothesis Testing">
            <option value="test2Proportions">Two Proportions</option>
            <option value="test2Means">Two Means</option>
            <option value="test2Correlations">Two Correlations</option>
          </optgroup>
          <optgroup label="Estimation">
            <option value="estimateProportion">Single Proportion</option>
            <option value="estimateMean">Single Mean</option>
          </optgroup>
        </select>
      </div>

      <!-- Base Parameters -->
      <div v-if="selectedCalculator" class="base-parameters">
        <h3>Base Parameters</h3>
        <div class="params-grid">
          <div v-for="input in currentCalculator?.inputs || []" :key="input.name" class="param-input">
            <label>{{ input.label }}</label>
            <input 
              type="number"
              :step="input.step || 0.01"
              :min="input.min"
              :max="input.max"
              :value="baseInputs[input.name]"
              @input="updateBaseInput(input.name, $event.target.value)"
              :placeholder="input.placeholder">
          </div>
        </div>
      </div>

      <!-- Sensitivity Parameters -->
      <div v-if="selectedCalculator" class="sensitivity-params">
        <h3>Sensitivity Parameters</h3>
        <p class="info-text">Select parameters to vary and see their impact on sample size</p>
        
        <div v-for="(param, idx) in sensitivityParams" :key="idx" class="sensitivity-item">
          <div class="param-controls">
            <select v-model="param.paramName" class="param-select">
              <option value="">-- Select Parameter --</option>
              <option v-for="input in availableParams" :key="input.name" :value="input.name">
                {{ input.label }}
              </option>
            </select>
            <button @click="removeSensitivityParam(idx)" class="remove-btn">×</button>
          </div>
          <div v-if="param.paramName" class="range-inputs">
            <div>
              <label>Min Value</label>
              <input type="number" v-model.number="param.min" step="0.01" @input="runAnalysis">
            </div>
            <div>
              <label>Max Value</label>
              <input type="number" v-model.number="param.max" step="0.01" @input="runAnalysis">
            </div>
            <div>
              <label>Steps</label>
              <input type="number" v-model.number="param.steps" min="5" max="50" @input="runAnalysis">
            </div>
          </div>
        </div>
        
        <button @click="addSensitivityParam" class="add-param-btn">+ Add Parameter</button>
      </div>

      <!-- Results -->
      <div v-if="sensitivityResults.length > 0" class="results-section">
        <h3>Sensitivity Results</h3>
        
        <div class="summary-box">
          <div class="summary-item">
            <strong>Minimum Sample Size:</strong> {{ minMax.min }}
          </div>
          <div class="summary-item">
            <strong>Maximum Sample Size:</strong> {{ minMax.max }}
          </div>
          <div class="summary-item">
            <strong>Range:</strong> {{ minMax.range }}
          </div>
        </div>

        <div class="charts-container">
          <div v-for="(paramResult, idx) in sensitivityResults" :key="idx" class="chart-wrapper">
            <h4>{{ getParamLabel(paramResult.paramName) }}</h4>
            <div class="chart-container">
              <canvas :ref="el => { if (el) chartRefs[idx] = el }" :id="`chart-${idx}`"></canvas>
            </div>
            <div class="data-table">
              <table>
                <thead>
                  <tr>
                    <th>{{ getParamLabel(paramResult.paramName) }}</th>
                    <th>Sample Size</th>
                    <th v-if="paramResult.results[0]?.total">Total (n₁+n₂)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(result, rIdx) in paramResult.results.slice(0, 10)" :key="rIdx">
                    <td>{{ result.paramValue }}</td>
                    <td>{{ result.sampleSize || result.value }}</td>
                    <td v-if="result.total">{{ result.total }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="export-section">
          <button @click="exportResults" class="export-btn">📥 Export Results</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue'
import { estimationCalculators, hypothesisCalculators } from '../data/calculators.js'
import * as calculators from '../utils/calculators.js'
import { generateSensitivityRange, generateMultipleParamRanges, findMinMaxSampleSize } from '../utils/sensitivityAnalysis.js'

export default {
  name: 'SensitivityAnalysis',
  setup() {
    const selectedCalculator = ref('')
    const baseInputs = ref({})
    const sensitivityParams = ref([])
    const sensitivityResults = ref([])
    const chartRefs = ref({})

    const allCalculators = [...estimationCalculators, ...hypothesisCalculators]

    const currentCalculator = computed(() => {
      return allCalculators.find(c => c.key === selectedCalculator.value)
    })

    const availableParams = computed(() => {
      return currentCalculator.value?.inputs || []
    })

    const minMax = computed(() => {
      if (sensitivityResults.value.length === 0) return { min: 0, max: 0, range: 0 }
      return findMinMaxSampleSize(sensitivityResults.value)
    })

    const updateBaseInput = (name, value) => {
      baseInputs.value[name] = parseFloat(value) || 0
      runAnalysis()
    }

    const addSensitivityParam = () => {
      sensitivityParams.value.push({
        paramName: '',
        min: 0,
        max: 1,
        steps: 10
      })
    }

    const removeSensitivityParam = (idx) => {
      sensitivityParams.value.splice(idx, 1)
      runAnalysis()
    }

    const runAnalysis = () => {
      if (!selectedCalculator.value || sensitivityParams.value.length === 0) {
        sensitivityResults.value = []
        return
      }

      const calcFunction = getCalculatorFunction(selectedCalculator.value)
      if (!calcFunction) return

      // Initialize base inputs with defaults if needed
      if (Object.keys(baseInputs.value).length === 0 && currentCalculator.value) {
        currentCalculator.value.inputs.forEach(input => {
          if (input.placeholder) {
            const placeholderValue = parseFloat(input.placeholder.replace(/[^0-9.]/g, ''))
            if (!isNaN(placeholderValue)) {
              baseInputs.value[input.name] = placeholderValue
            }
          }
        })
      }

      const validParams = sensitivityParams.value.filter(p => p.paramName && p.min !== undefined && p.max !== undefined)
      
      if (validParams.length === 0) {
        sensitivityResults.value = []
        return
      }

      const paramsForAnalysis = validParams.map(p => ({
        name: p.paramName,
        label: getParamLabel(p.paramName),
        min: p.min,
        max: p.max,
        steps: p.steps || 10
      }))

      sensitivityResults.value = generateMultipleParamRanges(
        calcFunction,
        baseInputs.value,
        paramsForAnalysis
      )

      nextTick(() => {
        drawCharts()
      })
    }

    const getCalculatorFunction = (calcKey) => {
      const functionMap = {
        estimateProportion: calculators.calculateEstimateProportion,
        estimateMean: calculators.calculateEstimateMean,
        test2Proportions: calculators.calculateTest2Proportions,
        test2Means: calculators.calculateTest2Means,
        test2Correlations: calculators.calculateTest2Correlations
      }
      return functionMap[calcKey]
    }

    const getParamLabel = (paramName) => {
      const param = availableParams.value.find(p => p.name === paramName)
      return param ? param.label : paramName
    }

    const drawCharts = () => {
      sensitivityResults.value.forEach((paramResult, idx) => {
        const canvas = chartRefs.value[idx]
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        const width = canvas.offsetWidth || 600
        const height = 300
        canvas.width = width
        canvas.height = height

        const results = paramResult.results
        if (results.length === 0) return

        const padding = 40
        const chartWidth = width - 2 * padding
        const chartHeight = height - 2 * padding

        const xValues = results.map(r => r.paramValue)
        const yValues = results.map(r => r.total || r.sampleSize || r.value || 0)

        const xMin = Math.min(...xValues)
        const xMax = Math.max(...xValues)
        const yMin = Math.min(...yValues)
        const yMax = Math.max(...yValues)

        const xScale = chartWidth / (xMax - xMin || 1)
        const yScale = chartHeight / (yMax - yMin || 1)

        // Clear canvas
        ctx.clearRect(0, 0, width, height)

        // Draw axes
        ctx.strokeStyle = '#666'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(padding, height - padding)
        ctx.lineTo(width - padding, height - padding)
        ctx.moveTo(padding, height - padding)
        ctx.lineTo(padding, padding)
        ctx.stroke()

        // Draw line
        ctx.strokeStyle = '#007BFF'
        ctx.lineWidth = 2
        ctx.beginPath()
        results.forEach((result, i) => {
          const x = padding + (result.paramValue - xMin) * xScale
          const y = height - padding - (yValues[i] - yMin) * yScale
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })
        ctx.stroke()

        // Draw points
        ctx.fillStyle = '#007BFF'
        results.forEach((result, i) => {
          const x = padding + (result.paramValue - xMin) * xScale
          const y = height - padding - (yValues[i] - yMin) * yScale
          ctx.beginPath()
          ctx.arc(x, y, 4, 0, 2 * Math.PI)
          ctx.fill()
        })

        // Labels
        ctx.fillStyle = '#333'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(getParamLabel(paramResult.paramName), width / 2, height - 10)
        ctx.save()
        ctx.translate(15, height / 2)
        ctx.rotate(-Math.PI / 2)
        ctx.textAlign = 'center'
        ctx.fillText('Sample Size', 0, 0)
        ctx.restore()
      })
    }

    const exportResults = () => {
      let csv = 'Parameter,Value,Sample Size,Total\n'
      sensitivityResults.value.forEach(paramResult => {
        paramResult.results.forEach(result => {
          csv += `${getParamLabel(paramResult.paramName)},${result.paramValue},${result.sampleSize || result.value},${result.total || ''}\n`
        })
      })

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'sensitivity-analysis.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    }

    watch(selectedCalculator, (newVal) => {
      baseInputs.value = {}
      sensitivityParams.value = []
      sensitivityResults.value = []
    })

    return {
      selectedCalculator,
      baseInputs,
      sensitivityParams,
      sensitivityResults,
      chartRefs,
      currentCalculator,
      availableParams,
      minMax,
      updateBaseInput,
      addSensitivityParam,
      removeSensitivityParam,
      runAnalysis,
      getParamLabel,
      exportResults
    }
  }
}
</script>

<style scoped>
.sensitivity-analysis {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-header {
  text-align: center;
  margin-bottom: 2rem;
}

.feature-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.selector-section, .base-parameters, .sensitivity-params {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.selector-section:hover, .base-parameters:hover, .sensitivity-params:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

.calculator-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #CED4DA;
  border-radius: 8px;
  font-size: 1rem;
}

.params-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.param-input label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.param-input input {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #CED4DA;
  border-radius: 6px;
}

.sensitivity-item {
  background: #F8F9FA;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.param-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.param-select {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #CED4DA;
  border-radius: 6px;
}

.remove-btn {
  padding: 0.5rem 1rem;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.range-inputs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.range-inputs label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.range-inputs input {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #CED4DA;
  border-radius: 6px;
}

.add-param-btn {
  padding: 0.75rem 1.5rem;
  background: #20C997;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.results-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.summary-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%);
  border-radius: 12px;
  border: 2px solid rgba(0, 123, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
}

.summary-item {
  text-align: center;
}

.chart-wrapper {
  margin-bottom: 3rem;
}

.chart-container {
  margin: 1rem 0;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  padding: 1rem;
}

.chart-container canvas {
  width: 100%;
  max-width: 800px;
  height: auto;
}

.data-table {
  margin-top: 1rem;
  overflow-x: auto;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #E9ECEF;
}

.data-table th {
  background: #F8F9FA;
  font-weight: 600;
}

.export-section {
  margin-top: 2rem;
  text-align: center;
}

.export-btn {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
}

.info-text {
  color: #6C757D;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
</style>
