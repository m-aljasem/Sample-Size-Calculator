<template>
  <div class="scenario-comparison">
    <div class="feature-header">
      <h2>📊 Multiple Scenarios Comparison</h2>
      <p>Compare different study designs side-by-side for grant proposals and planning</p>
    </div>

    <div class="scenario-container">
      <!-- Scenario Manager -->
      <div class="scenario-manager">
        <h3>Scenarios</h3>
        <div class="scenarios-list">
          <div 
            v-for="scenario in scenarios" 
            :key="scenario.id"
            class="scenario-card"
            :class="{ active: activeScenarioId === scenario.id }"
            @click="activeScenarioId = scenario.id">
            <div class="scenario-header">
              <input 
                v-model="scenario.name"
                @click.stop
                @blur="updateScenario(scenario)"
                class="scenario-name-input">
              <button @click.stop="deleteScenario(scenario.id)" class="delete-btn">×</button>
            </div>
            <div class="scenario-preview">
              <span class="calc-name">{{ getCalculatorName(scenario.calculatorKey) }}</span>
              <span class="param-count">{{ Object.keys(scenario.inputs).length }} params</span>
            </div>
          </div>
          
          <button @click="createNewScenario" class="add-scenario-btn">
            + Add Scenario
          </button>
        </div>
      </div>

      <!-- Scenario Editor -->
      <div v-if="activeScenario" class="scenario-editor">
        <h3>Edit Scenario: {{ activeScenario.name }}</h3>
        
        <div class="editor-section">
          <label>Calculator Type</label>
          <select v-model="activeScenario.calculatorKey" @change="updateScenario(activeScenario)">
            <option value="">-- Select --</option>
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

        <div v-if="activeScenario.calculatorKey" class="params-editor">
          <div 
            v-for="input in getCalculatorInputs(activeScenario.calculatorKey)" 
            :key="input.name"
            class="param-edit">
            <label>{{ input.label }}</label>
            <input 
              type="number"
              :step="input.step || 0.01"
              :min="input.min"
              :max="input.max"
              :value="activeScenario.inputs[input.name] || ''"
              @input="updateScenarioInput(input.name, $event.target.value)"
              :placeholder="input.placeholder">
          </div>
        </div>
      </div>

      <!-- Comparison Results -->
      <div v-if="comparisons.length > 0" class="comparison-results">
        <h3>Comparison Results</h3>
        
        <div class="comparison-table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Calculator</th>
                <th>Sample Size</th>
                <th>Adjusted</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(comp, idx) in comparisons" 
                :key="idx"
                :class="{ error: comp.summary?.error }">
                <td><strong>{{ comp.scenario?.name || 'Unknown' }}</strong></td>
                <td>{{ getCalculatorName(comp.scenario?.calculatorKey) }}</td>
                <td>{{ comp.summary?.sampleSize || 'N/A' }}</td>
                <td>{{ comp.summary?.sampleSizeAdjusted || 'N/A' }}</td>
                <td>{{ comp.summary?.total || 'N/A' }}</td>
                <td>
                  <span v-if="comp.summary?.error" class="error-badge">Error</span>
                  <span v-else class="success-badge">✓ Valid</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="comparison-summary">
          <h4>Summary</h4>
          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-label">Minimum Sample Size</div>
              <div class="summary-value">{{ minSampleSize }}</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">Maximum Sample Size</div>
              <div class="summary-value">{{ maxSampleSize }}</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">Average Sample Size</div>
              <div class="summary-value">{{ avgSampleSize }}</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">Range</div>
              <div class="summary-value">{{ maxSampleSize - minSampleSize }}</div>
            </div>
          </div>
        </div>

        <div class="export-comparison">
          <button @click="exportComparison" class="export-btn">📥 Export Comparison</button>
          <button @click="copyComparisonText" class="export-btn">📋 Copy for Grant</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { estimationCalculators, hypothesisCalculators } from '../data/calculators.js'
import * as calculators from '../utils/calculators.js'
import { createScenario, compareScenarios } from '../utils/scenarioComparison.js'

export default {
  name: 'ScenarioComparison',
  setup() {
    const scenarios = ref([])
    const activeScenarioId = ref(null)

    const allCalculators = [...estimationCalculators, ...hypothesisCalculators]

    const activeScenario = computed(() => {
      return scenarios.value.find(s => s.id === activeScenarioId.value)
    })

    const calcFunctions = computed(() => {
      return {
        estimateProportion: calculators.calculateEstimateProportion,
        estimateMean: calculators.calculateEstimateMean,
        test2Proportions: calculators.calculateTest2Proportions,
        test2Means: calculators.calculateTest2Means,
        test2Correlations: calculators.calculateTest2Correlations
      }
    })

    const comparisons = computed(() => {
      if (scenarios.value.length === 0) return []
      return compareScenarios(scenarios.value, calcFunctions.value)
    })

    const minSampleSize = computed(() => {
      const sizes = comparisons.value
        .filter(c => c.summary && !c.summary.error && c.summary.total)
        .map(c => c.summary.total)
      return sizes.length > 0 ? Math.min(...sizes) : 0
    })

    const maxSampleSize = computed(() => {
      const sizes = comparisons.value
        .filter(c => c.summary && !c.summary.error && c.summary.total)
        .map(c => c.summary.total)
      return sizes.length > 0 ? Math.max(...sizes) : 0
    })

    const avgSampleSize = computed(() => {
      const sizes = comparisons.value
        .filter(c => c.summary && !c.summary.error && c.summary.total)
        .map(c => c.summary.total)
      if (sizes.length === 0) return 0
      return Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length)
    })

    const createNewScenario = () => {
      const scenario = createScenario(`Scenario ${scenarios.value.length + 1}`, {}, '')
      scenarios.value.push(scenario)
      activeScenarioId.value = scenario.id
    }

    const deleteScenario = (id) => {
      const idx = scenarios.value.findIndex(s => s.id === id)
      if (idx > -1) {
        scenarios.value.splice(idx, 1)
        if (activeScenarioId.value === id) {
          activeScenarioId.value = scenarios.value.length > 0 ? scenarios.value[0].id : null
        }
      }
    }

    const updateScenario = (scenario) => {
      // Scenario updated, comparisons will recompute automatically
    }

    const updateScenarioInput = (name, value) => {
      if (activeScenario.value) {
        activeScenario.value.inputs[name] = parseFloat(value) || 0
        updateScenario(activeScenario.value)
      }
    }

    const getCalculatorInputs = (calcKey) => {
      const calc = allCalculators.find(c => c.key === calcKey)
      return calc?.inputs || []
    }

    const getCalculatorName = (calcKey) => {
      const calc = allCalculators.find(c => c.key === calcKey)
      return calc?.title || calcKey
    }

    const exportComparison = () => {
      const csv = comparisons.value.map(comp => ({
        Scenario: comp.scenario?.name || 'Unknown',
        Calculator: getCalculatorName(comp.scenario?.calculatorKey),
        'Sample Size': comp.summary?.sampleSize || 'N/A',
        'Adjusted': comp.summary?.sampleSizeAdjusted || 'N/A',
        Total: comp.summary?.total || 'N/A',
        Error: comp.summary?.error || 'None'
      }))

      const headers = Object.keys(csv[0])
      const rows = csv.map(row => headers.map(h => row[h]).join(','))
      const content = [headers.join(','), ...rows].join('\n')

      const blob = new Blob([content], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'scenario-comparison.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    }

    const copyComparisonText = () => {
      let text = 'Sample Size Calculation Scenarios:\n\n'
      comparisons.value.forEach((comp, idx) => {
        text += `${idx + 1}. ${comp.scenario?.name || 'Unknown'}\n`
        text += `   Calculator: ${getCalculatorName(comp.scenario?.calculatorKey)}\n`
        text += `   Sample Size: ${comp.summary?.sampleSize || comp.summary?.total || 'N/A'}\n`
        if (comp.summary?.sampleSizeAdjusted) {
          text += `   Adjusted for Dropout: ${comp.summary.sampleSizeAdjusted}\n`
        }
        text += '\n'
      })
      
      text += `Summary:\n`
      text += `  Minimum: ${minSampleSize.value}\n`
      text += `  Maximum: ${maxSampleSize.value}\n`
      text += `  Average: ${avgSampleSize.value}\n`
      text += `  Range: ${maxSampleSize.value - minSampleSize.value}\n`

      navigator.clipboard.writeText(text).then(() => {
        alert('Comparison text copied to clipboard!')
      })
    }

    return {
      scenarios,
      activeScenarioId,
      activeScenario,
      comparisons,
      minSampleSize,
      maxSampleSize,
      avgSampleSize,
      createNewScenario,
      deleteScenario,
      updateScenario,
      updateScenarioInput,
      getCalculatorInputs,
      getCalculatorName,
      exportComparison,
      copyComparisonText
    }
  }
}
</script>

<style scoped>
.scenario-comparison {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.feature-header {
  text-align: center;
  margin-bottom: 2rem;
}

.scenario-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.scenario-manager {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: fit-content;
}

.scenarios-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.scenario-card {
  background: #F8F9FA;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.scenario-card:hover {
  border-color: #007BFF;
  background: #E7F3FF;
}

.scenario-card.active {
  border-color: #007BFF;
  background: #E7F3FF;
}

.scenario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.scenario-name-input {
  flex: 1;
  padding: 0.25rem;
  border: none;
  background: transparent;
  font-weight: 600;
  font-size: 1rem;
}

.delete-btn {
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.scenario-preview {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6C757D;
}

.add-scenario-btn {
  width: 100%;
  padding: 1rem;
  background: #20C997;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.scenario-editor {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.editor-section {
  margin-bottom: 1.5rem;
}

.editor-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.editor-section select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #CED4DA;
  border-radius: 8px;
}

.params-editor {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.param-edit label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.param-edit input {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #CED4DA;
  border-radius: 6px;
}

.comparison-results {
  grid-column: 1 / -1;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.comparison-table-wrapper {
  overflow-x: auto;
  margin-bottom: 2rem;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
}

.comparison-table th,
.comparison-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #E9ECEF;
}

.comparison-table th {
  background: #F8F9FA;
  font-weight: 600;
}

.comparison-table tr.error {
  background: #FFF3CD;
}

.error-badge {
  background: #FF6B6B;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.success-badge {
  background: #20C997;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.comparison-summary {
  margin-top: 2rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.summary-card {
  background: #F8F9FA;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.summary-label {
  font-size: 0.875rem;
  color: #6C757D;
  margin-bottom: 0.5rem;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #007BFF;
}

.export-comparison {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.export-btn {
  padding: 0.75rem 2rem;
  background: #007BFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .scenario-container {
    grid-template-columns: 1fr;
  }
}
</style>
