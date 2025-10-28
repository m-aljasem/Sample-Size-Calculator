<template>
  <div class="data-visualization">
    <div class="visualization-header">
      <h3>📊 Data Visualization</h3>
      <p>Interactive charts and graphs for your statistical analysis</p>
    </div>
    
    <div class="chart-tabs">
      <button 
        v-for="tab in chartTabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="{ active: activeTab === tab.id }"
        class="tab-button">
        {{ tab.icon }} {{ tab.name }}
      </button>
    </div>
    
    <div class="chart-container">
      <!-- Power Curve Chart -->
      <div v-if="activeTab === 'power'" class="chart-section">
        <h4>Power Analysis Curve</h4>
        <canvas ref="powerChart" id="powerChart" width="400" height="300"></canvas>
        <div class="chart-description">
          <p>This curve shows how statistical power changes with sample size for your current effect size.</p>
        </div>
      </div>
      
      <!-- Sample Size vs Effect Size Chart -->
      <div v-if="activeTab === 'sample'" class="chart-section">
        <h4>Sample Size vs Effect Size</h4>
        <canvas ref="sampleChart" id="sampleChart" width="400" height="300"></canvas>
        <div class="chart-description">
          <p>Relationship between sample size requirements and effect size magnitude.</p>
        </div>
      </div>
      
      <!-- Confidence Interval Chart -->
      <div v-if="activeTab === 'confidence'" class="chart-section">
        <h4>Confidence Intervals</h4>
        <canvas ref="confidenceChart" id="confidenceChart" width="400" height="300"></canvas>
        <div class="chart-description">
          <p>Visualization of confidence intervals for different sample sizes.</p>
        </div>
      </div>
      
      <!-- Sensitivity Analysis Chart -->
      <div v-if="activeTab === 'sensitivity'" class="chart-section">
        <h4>Sensitivity Analysis</h4>
        <canvas ref="sensitivityChart" id="sensitivityChart" width="400" height="300"></canvas>
        <div class="chart-description">
          <p>How sensitive your results are to changes in key parameters.</p>
        </div>
      </div>
    </div>
    
    <div class="chart-controls">
      <div class="control-group">
        <label>Sample Size Range:</label>
        <input 
          type="range" 
          v-model="sampleSizeRange" 
          min="10" 
          max="1000" 
          step="10"
          :disabled="isChartLoading"
          @input="updateCharts">
        <span>{{ sampleSizeRange }}</span>
      </div>
      
      <div class="control-group">
        <label>Effect Size Range:</label>
        <input 
          type="range" 
          v-model="effectSizeRange" 
          min="0.1" 
          max="2.0" 
          step="0.1"
          :disabled="isChartLoading"
          @input="updateCharts">
        <span>{{ effectSizeRange }}</span>
      </div>
      
      <div v-if="isChartLoading" class="loading-indicator">
        <div class="loading-spinner"></div>
        <span>Updating chart...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'DataVisualization',
  props: {
    activeCalculator: String,
    inputs: Object,
    result: Object
  },
  setup(props) {
    const activeTab = ref('power')
    const sampleSizeRange = ref(100)
    const effectSizeRange = ref(0.5)
    const isComponentMounted = ref(false)
    const updateTimeout = ref(null)
    const isChartLoading = ref(false)
    
    const powerChart = ref(null)
    const sampleChart = ref(null)
    const confidenceChart = ref(null)
    const sensitivityChart = ref(null)
    
    const chartTabs = [
      { id: 'power', name: 'Power Curve', icon: '⚡' },
      { id: 'sample', name: 'Sample Size', icon: '📏' },
      { id: 'confidence', name: 'Confidence', icon: '🎯' },
      { id: 'sensitivity', name: 'Sensitivity', icon: '🔍' }
    ]
    
    const chartInstances = ref({})
    
    const generatePowerData = () => {
      const data = []
      const labels = []
      
      for (let n = 10; n <= sampleSizeRange.value; n += 10) {
        labels.push(n)
        // Simplified power calculation
        const power = Math.min(0.99, Math.max(0.01, 1 - Math.exp(-n * effectSizeRange.value / 10)))
        data.push(power)
      }
      
      return { labels, data }
    }
    
    const generateSampleSizeData = () => {
      const data = []
      const labels = []
      
      for (let d = 0.1; d <= effectSizeRange.value; d += 0.1) {
        labels.push(d.toFixed(1))
        // Simplified sample size calculation
        const n = Math.ceil(16 / (d * d))
        data.push(n)
      }
      
      return { labels, data }
    }
    
    const generateConfidenceData = () => {
      const data = []
      const labels = []
      
      for (let n = 10; n <= sampleSizeRange.value; n += 10) {
        labels.push(n)
        // Simplified confidence interval width
        const ciWidth = 1.96 * Math.sqrt(0.25 / n)
        data.push(ciWidth)
      }
      
      return { labels, data }
    }
    
    const generateSensitivityData = () => {
      const data = []
      const labels = []
      
      for (let alpha = 0.01; alpha <= 0.1; alpha += 0.01) {
        labels.push(alpha.toFixed(2))
        // Simplified sensitivity calculation
        const sensitivity = Math.sqrt(-2 * Math.log(alpha))
        data.push(sensitivity)
      }
      
      return { labels, data }
    }
    
    const updateChart = (canvasRef, dataGenerator, title, yLabel) => {
      // Don't update charts if component is not mounted
      if (!isComponentMounted.value) {
        console.warn('Component not mounted, skipping chart update')
        return
      }
      
      if (!canvasRef.value) {
        console.warn('Canvas ref is not available')
        return
      }
      
      // Check if canvas is still in the DOM
      if (!document.contains(canvasRef.value)) {
        console.warn('Canvas element is not in DOM')
        return
      }
      
      const chartId = canvasRef.value.id
      const existingChart = chartInstances.value[chartId]
      
      // If chart exists, update its data instead of recreating
      if (existingChart && !existingChart.destroyed) {
        try {
          isChartLoading.value = true
          const { labels, data } = dataGenerator()
          existingChart.data.labels = labels
          existingChart.data.datasets[0].data = data
          existingChart.update('none') // Update without animation for responsiveness
          isChartLoading.value = false
          return
        } catch (error) {
          console.warn('Error updating existing chart:', error)
          isChartLoading.value = false
          // If update fails, destroy and recreate
          try {
            existingChart.destroy()
          } catch (destroyError) {
            console.warn('Error destroying failed chart:', destroyError)
          }
          delete chartInstances.value[chartId]
        }
      }
      
      // If no existing chart or update failed, create new one
      createChart(canvasRef, dataGenerator, title, yLabel)
    }
    
    const createChart = (canvasRef, dataGenerator, title, yLabel) => {
      // Don't create charts if component is not mounted
      if (!isComponentMounted.value) {
        console.warn('Component not mounted, skipping chart creation')
        return
      }
      
      if (!canvasRef.value) {
        console.warn('Canvas ref is not available')
        return
      }
      
      // Check if canvas is still in the DOM
      if (!document.contains(canvasRef.value)) {
        console.warn('Canvas element is not in DOM')
        return
      }
      
      // Check if canvas is properly mounted and has context
      if (!canvasRef.value.getContext) {
        console.warn('Canvas element is not properly mounted')
        return
      }
      
      let ctx
      try {
        ctx = canvasRef.value.getContext('2d')
      } catch (error) {
        console.error('Error getting canvas context:', error)
        return
      }
      
      if (!ctx) {
        console.error('Could not get canvas context')
        return
      }
      
      // Ensure canvas has proper dimensions
      if (canvasRef.value.width === 0 || canvasRef.value.height === 0) {
        console.warn('Canvas has zero dimensions, setting default size')
        canvasRef.value.width = 400
        canvasRef.value.height = 300
      }
      
      const { labels, data } = dataGenerator()
      
      // Destroy existing chart if it exists
      const chartId = canvasRef.value.id
      if (chartInstances.value[chartId]) {
        try {
          chartInstances.value[chartId].destroy()
        } catch (error) {
          console.warn('Error destroying existing chart:', error)
        }
        delete chartInstances.value[chartId]
      }
      
      // Wait a bit to ensure DOM is stable
      setTimeout(() => {
        // Double-check canvas is still valid
        if (!canvasRef.value || !document.contains(canvasRef.value)) {
          console.warn('Canvas no longer valid, skipping chart creation')
          isChartLoading.value = false
          return
        }
        
        try {
          isChartLoading.value = true
          chartInstances.value[chartId] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: title,
            data: data,
            borderColor: '#007BFF',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#007BFF',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.5,
          plugins: {
            title: {
              display: true,
              text: title,
              font: {
                size: 16,
                weight: 'bold'
              },
              color: '#333'
            },
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Sample Size',
                font: {
                  weight: 'bold'
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            y: {
              title: {
                display: true,
                text: yLabel,
                font: {
                  weight: 'bold'
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              min: 0,
              max: activeTab.value === 'power' ? 1 : undefined
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          elements: {
            point: {
              hoverBackgroundColor: '#0056b3'
            }
          }
        }
      })
      
      // Chart creation completed successfully
      isChartLoading.value = false
    } catch (error) {
      console.error('Error creating chart:', error)
      isChartLoading.value = false
      // Clean up any partial chart instance
      if (chartInstances.value[chartId]) {
        delete chartInstances.value[chartId]
      }
    }
  }, 100) // Increased delay for DOM stability
}
    
    const updateCharts = () => {
      if (!isComponentMounted.value) {
        console.warn('Component not mounted, skipping chart update')
        return
      }
      
      // Clear any existing timeout
      if (updateTimeout.value) {
        clearTimeout(updateTimeout.value)
      }
      
      // Debounce chart updates to prevent too many rapid updates
      updateTimeout.value = setTimeout(() => {
        nextTick(() => {
          try {
            if (activeTab.value === 'power') {
              updateChart(powerChart, generatePowerData, 'Statistical Power', 'Power')
            } else if (activeTab.value === 'sample') {
              updateChart(sampleChart, generateSampleSizeData, 'Required Sample Size', 'Sample Size')
            } else if (activeTab.value === 'confidence') {
              updateChart(confidenceChart, generateConfidenceData, 'Confidence Interval Width', 'CI Width')
            } else if (activeTab.value === 'sensitivity') {
              updateChart(sensitivityChart, generateSensitivityData, 'Sensitivity Analysis', 'Sensitivity')
            }
          } catch (error) {
            console.error('Error updating charts:', error)
          }
        })
      }, 150) // Debounce delay
    }
    
    watch(activeTab, updateCharts)
    watch([sampleSizeRange, effectSizeRange], updateCharts)
    
    onMounted(() => {
      isComponentMounted.value = true
      // Wait a bit longer for DOM to be fully ready
      setTimeout(() => {
        updateCharts()
      }, 200)
    })
    
    onUnmounted(() => {
      isComponentMounted.value = false
      
      // Clear any pending updates
      if (updateTimeout.value) {
        clearTimeout(updateTimeout.value)
        updateTimeout.value = null
      }
      
      // Clean up all chart instances
      Object.values(chartInstances.value).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
          try {
            chart.destroy()
          } catch (error) {
            console.warn('Error destroying chart on unmount:', error)
          }
        }
      })
      chartInstances.value = {}
    })
    
    return {
      activeTab,
      sampleSizeRange,
      effectSizeRange,
      chartTabs,
      powerChart,
      sampleChart,
      confidenceChart,
      sensitivityChart,
      updateCharts,
      updateChart,
      isChartLoading
    }
  }
}
</script>

<style scoped>
.data-visualization {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.visualization-header h3 {
  color: #007BFF;
  margin: 0 0 8px 0;
  font-size: 24px;
}

.visualization-header p {
  color: #666;
  margin: 0 0 20px 0;
}

.chart-tabs {
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

.chart-container {
  margin-bottom: 24px;
}

.chart-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.chart-section h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
}

.chart-section canvas {
  max-width: 100%;
  max-height: 400px;
}

.chart-description {
  margin-top: 16px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border-left: 4px solid #007BFF;
}

.chart-description p {
  margin: 0;
  color: #666;
  font-size: 14px;
  font-style: italic;
}

.chart-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.control-group input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
}

.control-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #007BFF;
  cursor: pointer;
}

.control-group input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #007BFF;
  cursor: pointer;
  border: none;
}

.control-group span {
  font-weight: 600;
  color: #007BFF;
  text-align: center;
  font-size: 16px;
}

.control-group input[type="range"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f5f5f5;
}

.control-group input[type="range"]:disabled::-webkit-slider-thumb {
  background: #ccc;
  cursor: not-allowed;
}

.control-group input[type="range"]:disabled::-moz-range-thumb {
  background: #ccc;
  cursor: not-allowed;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background: #e3f2fd;
  border-radius: 8px;
  color: #007BFF;
  font-size: 14px;
  font-weight: 500;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e3f2fd;
  border-top: 2px solid #007BFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .chart-tabs {
    flex-direction: column;
  }
  
  .tab-button {
    text-align: center;
  }
  
  .chart-controls {
    grid-template-columns: 1fr;
  }
  
  .chart-section canvas {
    height: 250px;
  }
}
</style>
