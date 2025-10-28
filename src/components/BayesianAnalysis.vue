<template>
  <div class="bayesian-analysis">
    <div class="analysis-header">
      <h3>🧠 Bayesian Analysis</h3>
      <p>Advanced Bayesian methods for sample size calculation and power analysis</p>
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
    
    <!-- Bayesian Power Analysis -->
    <div v-if="activeTab === 'power'" class="analysis-section">
      <h4>Bayesian Power Analysis</h4>
      <div class="input-grid">
        <div class="input-group">
          <label>Prior Distribution</label>
          <select v-model="priorDistribution">
            <option value="normal">Normal</option>
            <option value="beta">Beta</option>
            <option value="gamma">Gamma</option>
            <option value="uniform">Uniform</option>
          </select>
        </div>
        
        <div class="input-group">
          <label>Prior Mean (μ₀)</label>
          <input 
            type="number" 
            v-model="priorMean"
            step="0.01"
            placeholder="0.5">
        </div>
        
        <div class="input-group">
          <label>Prior Variance (σ₀²)</label>
          <input 
            type="number" 
            v-model="priorVariance"
            step="0.01"
            placeholder="0.1">
        </div>
        
        <div class="input-group">
          <label>Sample Size (n)</label>
          <input 
            type="number" 
            v-model="sampleSize"
            min="1"
            placeholder="30">
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
          <label>Credible Level</label>
          <input 
            type="number" 
            v-model="credibleLevel"
            step="0.01"
            min="0.5"
            max="0.99"
            placeholder="0.95">
        </div>
      </div>
      
      <div v-if="bayesianResult" class="result-display">
        <div class="result-card">
          <h5>Bayesian Power</h5>
          <div class="result-value">{{ (bayesianResult.power * 100).toFixed(1) }}%</div>
        </div>
        
        <div class="result-card">
          <h5>Posterior Mean</h5>
          <div class="result-value">{{ bayesianResult.posteriorMean.toFixed(3) }}</div>
        </div>
        
        <div class="result-card">
          <h5>Credible Interval</h5>
          <div class="result-value">
            [{{ bayesianResult.credibleInterval.lower.toFixed(3) }}, 
            {{ bayesianResult.credibleInterval.upper.toFixed(3) }}]
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bayesian Sample Size -->
    <div v-if="activeTab === 'sample'" class="analysis-section">
      <h4>Bayesian Sample Size Calculation</h4>
      <div class="input-grid">
        <div class="input-group">
          <label>Target Power</label>
          <input 
            type="number" 
            v-model="targetPower"
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
          <label>Prior Strength</label>
          <select v-model="priorStrength">
            <option value="weak">Weak (n₀ = 1)</option>
            <option value="moderate">Moderate (n₀ = 5)</option>
            <option value="strong">Strong (n₀ = 10)</option>
          </select>
        </div>
      </div>
      
      <div v-if="bayesianSampleSize" class="result-display">
        <div class="result-card">
          <h5>Required Sample Size</h5>
          <div class="result-value">{{ Math.ceil(bayesianSampleSize) }}</div>
        </div>
        
        <div class="result-card">
          <h5>Effective Sample Size</h5>
          <div class="result-value">{{ Math.ceil(bayesianSampleSize + getPriorSampleSize()) }}</div>
        </div>
      </div>
    </div>
    
    <!-- Prior Sensitivity Analysis -->
    <div v-if="activeTab === 'sensitivity'" class="analysis-section">
      <h4>Prior Sensitivity Analysis</h4>
      <div class="sensitivity-chart">
        <canvas ref="sensitivityChart" width="400" height="300"></canvas>
      </div>
      <div class="sensitivity-results">
        <p>This analysis shows how sensitive your results are to different prior specifications.</p>
        <div class="sensitivity-table">
          <table>
            <thead>
              <tr>
                <th>Prior Type</th>
                <th>Power</th>
                <th>Sample Size</th>
                <th>Credible Interval Width</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="result in sensitivityResults" :key="result.type">
                <td>{{ result.type }}</td>
                <td>{{ (result.power * 100).toFixed(1) }}%</td>
                <td>{{ Math.ceil(result.sampleSize) }}</td>
                <td>{{ result.ciWidth.toFixed(3) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Bayesian Interpretation Guide -->
    <div class="interpretation-guide">
      <h4>📚 Bayesian Interpretation Guide</h4>
      <div class="guide-content">
        <div class="guide-item">
          <h5>What is Bayesian Power?</h5>
          <p>Bayesian power is the probability of obtaining a credible interval that excludes the null value, given your prior beliefs and the observed data.</p>
        </div>
        
        <div class="guide-item">
          <h5>Prior Distributions</h5>
          <ul>
            <li><strong>Normal:</strong> Symmetric, unbounded distribution</li>
            <li><strong>Beta:</strong> Bounded between 0 and 1, good for proportions</li>
            <li><strong>Gamma:</strong> Positive values only, good for rates</li>
            <li><strong>Uniform:</strong> Equal probability across range</li>
          </ul>
        </div>
        
        <div class="guide-item">
          <h5>Credible Intervals</h5>
          <p>Unlike confidence intervals, credible intervals represent the probability that the parameter lies within the interval, given the observed data and prior information.</p>
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
  name: 'BayesianAnalysis',
  setup() {
    const activeTab = ref('power')
    const priorDistribution = ref('normal')
    const priorMean = ref(0.5)
    const priorVariance = ref(0.1)
    const sampleSize = ref(30)
    const effectSize = ref(0.5)
    const credibleLevel = ref(0.95)
    const targetPower = ref(0.8)
    const priorStrength = ref('moderate')
    
    const sensitivityChart = ref(null)
    
    const analysisTabs = [
      { id: 'power', name: 'Power Analysis', icon: '⚡' },
      { id: 'sample', name: 'Sample Size', icon: '📏' },
      { id: 'sensitivity', name: 'Sensitivity', icon: '🔍' }
    ]
    
    const bayesianResult = computed(() => {
      if (!sampleSize.value || !effectSize.value) return null
      
      // Simplified Bayesian calculations
      const n = sampleSize.value
      const delta = effectSize.value
      const mu0 = priorMean.value
      const sigma0Sq = priorVariance.value
      
      // Posterior parameters
      const posteriorMean = (mu0 * sigma0Sq + delta * n) / (sigma0Sq + n)
      const posteriorVariance = (sigma0Sq * n) / (sigma0Sq + n)
      
      // Credible interval
      const z = 1.96 // For 95% credible interval
      const ciWidth = z * Math.sqrt(posteriorVariance)
      const credibleInterval = {
        lower: posteriorMean - ciWidth,
        upper: posteriorMean + ciWidth
      }
      
      // Bayesian power (simplified)
      const power = Math.min(0.99, Math.max(0.01, 1 - Math.exp(-n * delta / 10)))
      
      return {
        power,
        posteriorMean,
        credibleInterval
      }
    })
    
    const bayesianSampleSize = computed(() => {
      if (!targetPower.value || !effectSize.value) return null
      
      // Simplified Bayesian sample size calculation
      const power = targetPower.value
      const delta = effectSize.value
      const n0 = getPriorSampleSize()
      
      // Bayesian sample size formula
      const n = Math.ceil((16 / (delta * delta)) * (1 + n0 / 10))
      
      return n
    })
    
    const sensitivityResults = computed(() => {
      const priors = [
        { type: 'Weak', n0: 1, variance: 0.5 },
        { type: 'Moderate', n0: 5, variance: 0.1 },
        { type: 'Strong', n0: 10, variance: 0.05 }
      ]
      
      return priors.map(prior => {
        const n = sampleSize.value || 30
        const delta = effectSize.value || 0.5
        
        const posteriorMean = (priorMean.value * prior.variance + delta * n) / (prior.variance + n)
        const posteriorVariance = (prior.variance * n) / (prior.variance + n)
        const power = Math.min(0.99, Math.max(0.01, 1 - Math.exp(-n * delta / 10)))
        const ciWidth = 1.96 * Math.sqrt(posteriorVariance)
        
        return {
          type: prior.type,
          power,
          sampleSize: n,
          ciWidth
        }
      })
    })
    
    const getPriorSampleSize = () => {
      const strengthMap = {
        weak: 1,
        moderate: 5,
        strong: 10
      }
      return strengthMap[priorStrength.value] || 5
    }
    
    const createSensitivityChart = () => {
      if (!sensitivityChart.value) return
      
      const ctx = sensitivityChart.value.getContext('2d')
      const results = sensitivityResults.value
      
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: results.map(r => r.type),
          datasets: [
            {
              label: 'Power',
              data: results.map(r => r.power * 100),
              backgroundColor: 'rgba(0, 123, 255, 0.8)',
              borderColor: '#007BFF',
              borderWidth: 2
            },
            {
              label: 'CI Width',
              data: results.map(r => r.ciWidth * 100),
              backgroundColor: 'rgba(255, 193, 7, 0.8)',
              borderColor: '#ffc107',
              borderWidth: 2,
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
              text: 'Prior Sensitivity Analysis',
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
                text: 'Power (%)'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'CI Width (%)'
              },
              grid: {
                drawOnChartArea: false,
              }
            }
          }
        }
      })
    }
    
    watch(activeTab, () => {
      if (activeTab.value === 'sensitivity') {
        setTimeout(createSensitivityChart, 100)
      }
    })
    
    watch(sensitivityResults, createSensitivityChart, { deep: true })
    
    onMounted(() => {
      if (activeTab.value === 'sensitivity') {
        createSensitivityChart()
      }
    })
    
    return {
      activeTab,
      analysisTabs,
      priorDistribution,
      priorMean,
      priorVariance,
      sampleSize,
      effectSize,
      credibleLevel,
      targetPower,
      priorStrength,
      bayesianResult,
      bayesianSampleSize,
      sensitivityResults,
      sensitivityChart,
      getPriorSampleSize
    }
  }
}
</script>

<style scoped>
.bayesian-analysis {
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

.sensitivity-chart {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.sensitivity-chart canvas {
  max-width: 100%;
  max-height: 400px;
}

.sensitivity-results {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.sensitivity-results p {
  margin: 0 0 16px 0;
  color: #666;
  font-style: italic;
}

.sensitivity-table {
  overflow-x: auto;
}

.sensitivity-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.sensitivity-table th,
.sensitivity-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e1e5e9;
}

.sensitivity-table th {
  background: #007BFF;
  color: white;
  font-weight: 600;
}

.sensitivity-table tr:hover {
  background: #f8f9fa;
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
  
  .sensitivity-chart canvas {
    height: 250px;
  }
}
</style>
