<template>
  <div class="sequential-analysis">
    <div class="analysis-header">
      <h3>📈 Sequential Analysis</h3>
      <p>Advanced methods for adaptive and sequential study designs</p>
    </div>
    
    <div class="analysis-tabs">
      <button 
        v-for="tab in analysisTabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="{ active: activeTab === tab.id }"
        class="tab-button">
        {{ tab.icon }} {{ tab.name }}
      </button>
    </div>
    
    <!-- Group Sequential Design -->
    <div v-if="activeTab === 'group'" class="analysis-section">
      <h4>Group Sequential Design</h4>
      <div class="input-grid">
        <div class="input-group">
          <label>Number of Interim Analyses</label>
          <select v-model="numInterims">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        
        <div class="input-group">
          <label>Alpha Level (α)</label>
          <input 
            type="number" 
            v-model="alpha"
            step="0.01"
            min="0.01"
            max="0.1"
            placeholder="0.05">
        </div>
        
        <div class="input-group">
          <label>Power (1-β)</label>
          <input 
            type="number" 
            v-model="power"
            step="0.01"
            min="0.5"
            max="0.99"
            placeholder="0.8">
        </div>
        
        <div class="input-group">
          <label>Effect Size (δ)</label>
          <input 
            type="number" 
            v-model="effectSize"
            step="0.01"
            placeholder="0.5">
        </div>
        
        <div class="input-group">
          <label>Boundary Type</label>
          <select v-model="boundaryType">
            <option value="obrien">O'Brien-Fleming</option>
            <option value="pocock">Pocock</option>
            <option value="haybittle">Haybittle-Peto</option>
          </select>
        </div>
      </div>
      
      <div v-if="groupSequentialResult" class="result-display">
        <div class="result-card">
          <h5>Maximum Sample Size</h5>
          <div class="result-value">{{ Math.ceil(groupSequentialResult.maxSampleSize) }}</div>
        </div>
        
        <div class="result-card">
          <h5>Inflation Factor</h5>
          <div class="result-value">{{ groupSequentialResult.inflationFactor.toFixed(2) }}</div>
        </div>
        
        <div class="result-card">
          <h5>Expected Sample Size</h5>
          <div class="result-value">{{ Math.ceil(groupSequentialResult.expectedSampleSize) }}</div>
        </div>
      </div>
      
      <div class="boundary-table">
        <h5>Stopping Boundaries</h5>
        <table>
          <thead>
            <tr>
              <th>Analysis</th>
              <th>Information Fraction</th>
              <th>Critical Value</th>
              <th>P-value Threshold</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(boundary, index) in groupSequentialResult.boundaries" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ boundary.infoFraction.toFixed(2) }}</td>
              <td>{{ boundary.criticalValue.toFixed(3) }}</td>
              <td>{{ boundary.pValueThreshold.toFixed(4) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Adaptive Design -->
    <div v-if="activeTab === 'adaptive'" class="analysis-section">
      <h4>Adaptive Design</h4>
      <div class="input-grid">
        <div class="input-group">
          <label>Adaptation Type</label>
          <select v-model="adaptationType">
            <option value="sample-size">Sample Size Re-estimation</option>
            <option value="allocation">Treatment Allocation</option>
            <option value="population">Population Selection</option>
            <option value="endpoint">Endpoint Selection</option>
          </select>
        </div>
        
        <div class="input-group">
          <label>Initial Sample Size</label>
          <input 
            type="number" 
            v-model="initialSampleSize"
            min="10"
            placeholder="50">
        </div>
        
        <div class="input-group">
          <label>Interim Analysis Point</label>
          <input 
            type="number" 
            v-model="interimPoint"
            step="0.1"
            min="0.1"
            max="0.9"
            placeholder="0.5">
        </div>
        
        <div class="input-group">
          <label>Effect Size Uncertainty</label>
          <input 
            type="number" 
            v-model="effectSizeUncertainty"
            step="0.1"
            min="0.1"
            max="1.0"
            placeholder="0.3">
        </div>
        
        <div class="input-group">
          <label>Adaptation Threshold</label>
          <input 
            type="number" 
            v-model="adaptationThreshold"
            step="0.01"
            min="0.01"
            max="0.5"
            placeholder="0.1">
        </div>
      </div>
      
      <div v-if="adaptiveResult" class="result-display">
        <div class="result-card">
          <h5>Final Sample Size</h5>
          <div class="result-value">{{ Math.ceil(adaptiveResult.finalSampleSize) }}</div>
        </div>
        
        <div class="result-card">
          <h5>Adaptation Probability</h5>
          <div class="result-value">{{ (adaptiveResult.adaptationProbability * 100).toFixed(1) }}%</div>
        </div>
        
        <div class="result-card">
          <h5>Power Preservation</h5>
          <div class="result-value">{{ (adaptiveResult.powerPreservation * 100).toFixed(1) }}%</div>
        </div>
      </div>
    </div>
    
    <!-- Futility Analysis -->
    <div v-if="activeTab === 'futility'" class="analysis-section">
      <h4>Futility Analysis</h4>
      <div class="input-grid">
        <div class="input-group">
          <label>Futility Threshold</label>
          <input 
            type="number" 
            v-model="futilityThreshold"
            step="0.01"
            min="0.01"
            max="0.5"
            placeholder="0.1">
        </div>
        
        <div class="input-group">
          <label>Interim Analysis Timing</label>
          <input 
            type="number" 
            v-model="interimTiming"
            step="0.1"
            min="0.2"
            max="0.8"
            placeholder="0.5">
        </div>
        
        <div class="input-group">
          <label>True Effect Size</label>
          <input 
            type="number" 
            v-model="trueEffectSize"
            step="0.01"
            placeholder="0.3">
        </div>
      </div>
      
      <div v-if="futilityResult" class="result-display">
        <div class="result-card">
          <h5>Futility Stopping Probability</h5>
          <div class="result-value">{{ (futilityResult.stoppingProbability * 100).toFixed(1) }}%</div>
        </div>
        
        <div class="result-card">
          <h5>Sample Size Savings</h5>
          <div class="result-value">{{ Math.ceil(futilityResult.sampleSizeSavings) }}</div>
        </div>
        
        <div class="result-card">
          <h5>Type I Error Inflation</h5>
          <div class="result-value">{{ (futilityResult.typeIErrorInflation * 100).toFixed(2) }}%</div>
        </div>
      </div>
    </div>
    
    <!-- Sequential Analysis Chart -->
    <div class="sequential-chart">
      <h4>Sequential Analysis Visualization</h4>
      <canvas ref="sequentialChart" width="400" height="300"></canvas>
      <div class="chart-controls">
        <button @click="updateChart" class="update-button">🔄 Update Chart</button>
        <button @click="exportChart" class="export-button">📊 Export Chart</button>
      </div>
    </div>
    
    <!-- Interpretation Guide -->
    <div class="interpretation-guide">
      <h4>📚 Sequential Analysis Guide</h4>
      <div class="guide-content">
        <div class="guide-item">
          <h5>Group Sequential Design</h5>
          <p>Allows early stopping for efficacy or futility at predetermined interim analyses while controlling overall Type I error.</p>
        </div>
        
        <div class="guide-item">
          <h5>Adaptive Design</h5>
          <p>Permits modifications to the study design based on interim results, increasing efficiency and flexibility.</p>
        </div>
        
        <div class="guide-item">
          <h5>Futility Analysis</h5>
          <p>Helps identify studies unlikely to succeed, allowing early termination to save resources.</p>
        </div>
        
        <div class="guide-item">
          <h5>Boundary Types</h5>
          <ul>
            <li><strong>O'Brien-Fleming:</strong> Conservative early stopping, liberal final analysis</li>
            <li><strong>Pocock:</strong> Equal critical values at all analyses</li>
            <li><strong>Haybittle-Peto:</strong> Very conservative interim boundaries</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'SequentialAnalysis',
  setup() {
    const activeTab = ref('group')
    const numInterims = ref(3)
    const alpha = ref(0.05)
    const power = ref(0.8)
    const effectSize = ref(0.5)
    const boundaryType = ref('obrien')
    
    const adaptationType = ref('sample-size')
    const initialSampleSize = ref(50)
    const interimPoint = ref(0.5)
    const effectSizeUncertainty = ref(0.3)
    const adaptationThreshold = ref(0.1)
    
    const futilityThreshold = ref(0.1)
    const interimTiming = ref(0.5)
    const trueEffectSize = ref(0.3)
    
    const sequentialChart = ref(null)
    
    const analysisTabs = [
      { id: 'group', name: 'Group Sequential', icon: '📊' },
      { id: 'adaptive', name: 'Adaptive Design', icon: '🔄' },
      { id: 'futility', name: 'Futility Analysis', icon: '⏹️' }
    ]
    
    const groupSequentialResult = computed(() => {
      if (!numInterims.value || !alpha.value || !power.value || !effectSize.value) return null
      
      const k = parseInt(numInterims.value)
      const alphaLevel = alpha.value
      const powerLevel = power.value
      const delta = effectSize.value
      
      // Calculate inflation factor based on boundary type
      let inflationFactor = 1.0
      if (boundaryType.value === 'obrien') {
        inflationFactor = 1.0 + (k - 1) * 0.1
      } else if (boundaryType.value === 'pocock') {
        inflationFactor = 1.0 + (k - 1) * 0.2
      } else if (boundaryType.value === 'haybittle') {
        inflationFactor = 1.0 + (k - 1) * 0.05
      }
      
      // Calculate sample size
      const zAlpha = 1.96 // Simplified
      const zBeta = 0.84 // Simplified
      const baseSampleSize = Math.pow((zAlpha + zBeta) / delta, 2)
      const maxSampleSize = baseSampleSize * inflationFactor
      const expectedSampleSize = maxSampleSize * 0.7 // Simplified
      
      // Generate boundaries
      const boundaries = []
      for (let i = 1; i <= k; i++) {
        const infoFraction = i / k
        let criticalValue = 0
        let pValueThreshold = 0
        
        if (boundaryType.value === 'obrien') {
          criticalValue = 1.96 / Math.sqrt(infoFraction)
          pValueThreshold = 2 * (1 - normalCDF(criticalValue))
        } else if (boundaryType.value === 'pocock') {
          criticalValue = 2.4 // Simplified
          pValueThreshold = 2 * (1 - normalCDF(criticalValue))
        } else if (boundaryType.value === 'haybittle') {
          criticalValue = 3.0 // Simplified
          pValueThreshold = 2 * (1 - normalCDF(criticalValue))
        }
        
        boundaries.push({
          infoFraction,
          criticalValue,
          pValueThreshold
        })
      }
      
      return {
        maxSampleSize,
        inflationFactor,
        expectedSampleSize,
        boundaries
      }
    })
    
    const adaptiveResult = computed(() => {
      if (!initialSampleSize.value || !interimPoint.value || !effectSizeUncertainty.value) return null
      
      const n0 = initialSampleSize.value
      const interim = interimPoint.value
      const uncertainty = effectSizeUncertainty.value
      
      // Simplified adaptive calculations
      const adaptationProbability = Math.min(0.8, uncertainty * 2)
      const finalSampleSize = n0 * (1 + adaptationProbability * 0.5)
      const powerPreservation = Math.max(0.7, 1 - adaptationProbability * 0.3)
      
      return {
        finalSampleSize,
        adaptationProbability,
        powerPreservation
      }
    })
    
    const futilityResult = computed(() => {
      if (!futilityThreshold.value || !interimTiming.value || !trueEffectSize.value) return null
      
      const threshold = futilityThreshold.value
      const timing = interimTiming.value
      const trueEffect = trueEffectSize.value
      
      // Simplified futility calculations
      const stoppingProbability = Math.min(0.6, threshold * 5)
      const sampleSizeSavings = 100 * timing * stoppingProbability
      const typeIErrorInflation = Math.max(0, stoppingProbability * 0.02)
      
      return {
        stoppingProbability,
        sampleSizeSavings,
        typeIErrorInflation
      }
    })
    
    const normalCDF = (x) => {
      // Simplified normal CDF approximation
      return 0.5 * (1 + Math.sign(x) * Math.sqrt(1 - Math.exp(-2 * x * x / Math.PI)))
    }
    
    const createSequentialChart = () => {
      if (!sequentialChart.value) return
      
      const ctx = sequentialChart.value.getContext('2d')
      const result = groupSequentialResult.value
      
      if (!result) return
      
      const labels = result.boundaries.map((_, i) => `Analysis ${i + 1}`)
      const criticalValues = result.boundaries.map(b => b.criticalValue)
      const infoFractions = result.boundaries.map(b => b.infoFraction)
      
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Upper Boundary',
              data: criticalValues,
              borderColor: '#dc3545',
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
              borderWidth: 3,
              fill: false,
              tension: 0.4
            },
            {
              label: 'Lower Boundary',
              data: criticalValues.map(v => -v),
              borderColor: '#dc3545',
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
              borderWidth: 3,
              fill: false,
              tension: 0.4
            },
            {
              label: 'Information Fraction',
              data: infoFractions,
              borderColor: '#007BFF',
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              borderWidth: 2,
              fill: false,
              tension: 0.4,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.5,
          plugins: {
            title: {
              display: true,
              text: 'Sequential Analysis Boundaries',
              font: { size: 16, weight: 'bold' }
            }
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Critical Value'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Information Fraction'
              },
              grid: {
                drawOnChartArea: false,
              }
            }
          }
        }
      })
    }
    
    const updateChart = () => {
      createSequentialChart()
    }
    
    const exportChart = () => {
      if (sequentialChart.value) {
        const link = document.createElement('a')
        link.download = 'sequential-analysis-chart.png'
        link.href = sequentialChart.value.toDataURL()
        link.click()
      }
    }
    
    watch(activeTab, () => {
      if (activeTab.value === 'group') {
        setTimeout(createSequentialChart, 100)
      }
    })
    
    watch(groupSequentialResult, createSequentialChart, { deep: true })
    
    onMounted(() => {
      if (activeTab.value === 'group') {
        createSequentialChart()
      }
    })
    
    return {
      activeTab,
      analysisTabs,
      numInterims,
      alpha,
      power,
      effectSize,
      boundaryType,
      adaptationType,
      initialSampleSize,
      interimPoint,
      effectSizeUncertainty,
      adaptationThreshold,
      futilityThreshold,
      interimTiming,
      trueEffectSize,
      groupSequentialResult,
      adaptiveResult,
      futilityResult,
      sequentialChart,
      updateChart,
      exportChart
    }
  }
}
</script>

<style scoped>
.sequential-analysis {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.analysis-header h3 {
  color: #007BFF;
  margin: 0 0 8px 0;
  font-size: 24px;
}

.analysis-header p {
  color: #666;
  margin: 0 0 20px 0;
}

.analysis-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tab-button {
  background: #f8f9fa;
  border: 2px solid transparent;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background: #e3f2fd;
  color: #007BFF;
}

.tab-button.active {
  background: #007BFF;
  color: white;
  border-color: #0056b3;
}

.analysis-section {
  margin-bottom: 30px;
}

.analysis-section h4 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 20px;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.input-group input,
.input-group select {
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #007BFF;
}

.result-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.result-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  border-left: 4px solid #007BFF;
}

.result-card h5 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
}

.result-value {
  font-size: 24px;
  font-weight: bold;
  color: #007BFF;
}

.boundary-table {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.boundary-table h5 {
  margin: 0 0 16px 0;
  color: #333;
}

.boundary-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.boundary-table th,
.boundary-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #e1e5e9;
}

.boundary-table th {
  background: #007BFF;
  color: white;
  font-weight: 600;
}

.boundary-table tr:hover {
  background: #f8f9fa;
}

.sequential-chart {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin: 30px 0;
}

.sequential-chart h4 {
  margin: 0 0 16px 0;
  color: #333;
}

.sequential-chart canvas {
  max-width: 100%;
  max-height: 400px;
}

.chart-controls {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: center;
}

.update-button,
.export-button {
  background: #007BFF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.update-button:hover,
.export-button:hover {
  background: #0056b3;
}

.interpretation-guide {
  background: #e3f2fd;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
}

.interpretation-guide h4 {
  color: #007BFF;
  margin: 0 0 20px 0;
}

.guide-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.guide-item h5 {
  color: #333;
  margin: 0 0 8px 0;
  font-size: 16px;
}

.guide-item p {
  margin: 0 0 8px 0;
  color: #666;
  line-height: 1.6;
}

.guide-item ul {
  margin: 0;
  padding-left: 20px;
}

.guide-item li {
  margin-bottom: 4px;
  color: #666;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .analysis-tabs {
    flex-direction: column;
  }
  
  .tab-button {
    text-align: center;
  }
  
  .input-grid {
    grid-template-columns: 1fr;
  }
  
  .result-display {
    grid-template-columns: 1fr;
  }
  
  .sequential-chart canvas {
    height: 250px;
  }
  
  .chart-controls {
    flex-direction: column;
  }
}
</style>
