<template>
  <div class="power-analysis">
    <div class="analysis-header">
      <h3>⚡ Power Analysis</h3>
      <p>Calculate statistical power for your study design</p>
    </div>
    
    <div class="analysis-form">
      <div class="input-group">
        <label>Sample Size (n)</label>
        <input 
          type="number" 
          v-model="sampleSize"
          placeholder="Enter sample size"
          min="1">
      </div>
      
      <div class="input-group">
        <label>Effect Size (d)</label>
        <input 
          type="number" 
          v-model="effectSize"
          placeholder="Enter effect size"
          step="0.01"
          min="0">
        <div class="effect-size-help">
          <small>
            Small: 0.2 | Medium: 0.5 | Large: 0.8
          </small>
        </div>
      </div>
      
      <div class="input-group">
        <label>Alpha Level (α)</label>
        <input 
          type="number" 
          v-model="alpha"
          placeholder="0.05"
          step="0.01"
          min="0"
          max="1">
      </div>
      
      <div class="input-group">
        <label>Test Type</label>
        <select v-model="testType">
          <option value="two-tailed">Two-tailed</option>
          <option value="one-tailed">One-tailed</option>
        </select>
      </div>
    </div>
    
    <div v-if="power !== null" class="power-result">
      <div class="result-card">
        <h4>Statistical Power</h4>
        <div class="power-value" :class="getPowerClass(power)">
          {{ (power * 100).toFixed(1) }}%
        </div>
        <div class="power-interpretation">
          {{ getPowerInterpretation(power) }}
        </div>
      </div>
      
      <div class="power-chart">
        <canvas ref="powerChart" width="400" height="200"></canvas>
      </div>
      
      <!-- Enhanced Power Curves with Multiple Effect Sizes -->
      <div class="enhanced-curves" v-if="showEnhancedCurves">
        <h4>Power Curves by Effect Size</h4>
        <div class="curve-controls">
          <label>
            <input type="checkbox" v-model="showSmallEffect"> Small (d=0.2)
          </label>
          <label>
            <input type="checkbox" v-model="showMediumEffect" checked> Medium (d=0.5)
          </label>
          <label>
            <input type="checkbox" v-model="showLargeEffect"> Large (d=0.8)
          </label>
        </div>
        <canvas ref="enhancedChart" width="600" height="400"></canvas>
      </div>
      <button @click="showEnhancedCurves = !showEnhancedCurves" class="toggle-curves-btn">
        {{ showEnhancedCurves ? 'Hide' : 'Show' }} Enhanced Power Curves
      </button>
    </div>
    
    <div class="power-recommendations">
      <h4>💡 Recommendations</h4>
      <ul>
        <li v-if="power < 0.8">
          <strong>Low Power:</strong> Consider increasing sample size or effect size
        </li>
        <li v-if="power >= 0.8 && power < 0.9">
          <strong>Good Power:</strong> Adequate for most studies
        </li>
        <li v-if="power >= 0.9">
          <strong>High Power:</strong> Excellent statistical power
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

export default {
  name: 'PowerAnalysis',
  setup() {
    const sampleSize = ref(30)
    const effectSize = ref(0.5)
    const alpha = ref(0.05)
    const testType = ref('two-tailed')
    const power = ref(null)
    const powerChart = ref(null)
    const enhancedChart = ref(null)
    const showEnhancedCurves = ref(false)
    const showSmallEffect = ref(false)
    const showMediumEffect = ref(true)
    const showLargeEffect = ref(false)
    
    const calculatePower = () => {
      if (!sampleSize.value || !effectSize.value || !alpha.value) {
        power.value = null
        return
      }
      
      // Simplified power calculation using normal approximation
      const n = sampleSize.value
      const d = effectSize.value
      const a = alpha.value
      
      // Calculate critical value
      const zAlpha = testType.value === 'two-tailed' ? 
        1.96 : 1.645 // Simplified for common alpha values
      
      // Calculate power using normal approximation
      const zBeta = Math.sqrt(n) * d - zAlpha
      const powerValue = 1 - (1 - 0.5 * (1 + Math.sign(zBeta) * Math.sqrt(1 - Math.exp(-2 * zBeta * zBeta / Math.PI))))
      
      power.value = Math.max(0, Math.min(1, powerValue))
    }
    
    const getPowerClass = (powerValue) => {
      if (powerValue < 0.5) return 'power-low'
      if (powerValue < 0.8) return 'power-medium'
      return 'power-high'
    }
    
    const getPowerInterpretation = (powerValue) => {
      if (powerValue < 0.5) return 'Very low power - high risk of Type II error'
      if (powerValue < 0.6) return 'Low power - consider increasing sample size'
      if (powerValue < 0.7) return 'Moderate power - acceptable for exploratory studies'
      if (powerValue < 0.8) return 'Good power - suitable for most studies'
      if (powerValue < 0.9) return 'High power - excellent for confirmatory studies'
      return 'Very high power - ideal for definitive studies'
    }
    
    const drawPowerChart = () => {
      if (!powerChart.value || power.value === null) return
      
      const canvas = powerChart.value
      const ctx = canvas.getContext('2d')
      const width = canvas.width
      const height = canvas.height
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height)
      
      // Draw power curve
      ctx.strokeStyle = '#007BFF'
      ctx.lineWidth = 3
      ctx.beginPath()
      
      for (let i = 0; i <= width; i++) {
        const x = i / width
        const y = height - (power.value * height)
        if (i === 0) {
          ctx.moveTo(i, y)
        } else {
          ctx.lineTo(i, y)
        }
      }
      ctx.stroke()
      
      // Draw power line
      ctx.strokeStyle = '#ff4757'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(0, height - (power.value * height))
      ctx.lineTo(width, height - (power.value * height))
      ctx.stroke()
      ctx.setLineDash([])
      
      // Add labels
      ctx.fillStyle = '#333'
      ctx.font = '12px Arial'
      ctx.fillText('Power: ' + (power.value * 100).toFixed(1) + '%', 10, 20)
    }
    
    const drawEnhancedCurves = () => {
      if (!enhancedChart.value || !showEnhancedCurves.value) return
      
      const canvas = enhancedChart.value
      const ctx = canvas.getContext('2d')
      const width = canvas.width
      const height = canvas.height
      
      ctx.clearRect(0, 0, width, height)
      
      const padding = 50
      const chartWidth = width - 2 * padding
      const chartHeight = height - 2 * padding
      
      // Draw axes
      ctx.strokeStyle = '#666'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(padding, height - padding)
      ctx.lineTo(width - padding, height - padding)
      ctx.moveTo(padding, height - padding)
      ctx.lineTo(padding, padding)
      ctx.stroke()
      
      // Sample size range for x-axis
      const minN = 10
      const maxN = 200
      const nRange = maxN - minN
      
      // Power range for y-axis (0 to 1)
      const minPower = 0
      const maxPower = 1
      const powerRange = maxPower - minPower
      
      const effects = []
      if (showSmallEffect.value) effects.push({ d: 0.2, color: '#95E1D3', label: 'Small (d=0.2)' })
      if (showMediumEffect.value) effects.push({ d: 0.5, color: '#20C997', label: 'Medium (d=0.5)' })
      if (showLargeEffect.value) effects.push({ d: 0.8, color: '#007BFF', label: 'Large (d=0.8)' })
      
      effects.forEach(effect => {
        ctx.strokeStyle = effect.color
        ctx.lineWidth = 2
        ctx.beginPath()
        
        const zAlpha = testType.value === 'two-tailed' ? 1.96 : 1.645
        
        for (let i = 0; i <= chartWidth; i++) {
          const n = minN + (i / chartWidth) * nRange
          const zBeta = Math.sqrt(n) * effect.d - zAlpha
          const powerValue = Math.max(0, Math.min(1, 0.5 * (1 + Math.sign(zBeta) * Math.sqrt(1 - Math.exp(-2 * zBeta * zBeta / Math.PI)))))
          
          const x = padding + i
          const y = height - padding - (powerValue / powerRange) * chartHeight
          
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      })
      
      // Draw 80% power line
      ctx.strokeStyle = '#FF6B6B'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      const power80Y = height - padding - (0.8 / powerRange) * chartHeight
      ctx.moveTo(padding, power80Y)
      ctx.lineTo(width - padding, power80Y)
      ctx.stroke()
      ctx.setLineDash([])
      
      // Labels
      ctx.fillStyle = '#333'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Sample Size (n)', width / 2, height - 10)
      ctx.save()
      ctx.translate(15, height / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.textAlign = 'center'
      ctx.fillText('Power', 0, 0)
      ctx.restore()
      
      // Legend
      let legendY = padding + 10
      effects.forEach(effect => {
        ctx.fillStyle = effect.color
        ctx.fillRect(width - 120, legendY, 15, 15)
        ctx.fillStyle = '#333'
        ctx.textAlign = 'left'
        ctx.fillText(effect.label, width - 100, legendY + 12)
        legendY += 20
      })
      
      ctx.fillStyle = '#FF6B6B'
      ctx.fillRect(width - 120, legendY, 15, 2)
      ctx.fillStyle = '#333'
      ctx.fillText('80% Power', width - 100, legendY + 8)
    }
    
    watch([sampleSize, effectSize, alpha, testType], calculatePower, { immediate: true })
    watch(power, drawPowerChart)
    watch([showEnhancedCurves, showSmallEffect, showMediumEffect, showLargeEffect, testType], () => {
      nextTick(() => {
        drawEnhancedCurves()
      })
    })
    
    onMounted(() => {
      calculatePower()
      nextTick(() => {
        drawEnhancedCurves()
      })
    })
    
    return {
      sampleSize,
      effectSize,
      alpha,
      testType,
      power,
      powerChart,
      enhancedChart,
      showEnhancedCurves,
      showSmallEffect,
      showMediumEffect,
      showLargeEffect,
      getPowerClass,
      getPowerInterpretation
    }
  }
}
</script>

<style scoped>
.power-analysis {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.analysis-header h3 {
  color: #007BFF;
  margin: 0 0 8px 0;
}

.analysis-header p {
  color: #666;
  margin: 0 0 20px 0;
}

.analysis-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
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

.effect-size-help {
  margin-top: 4px;
}

.effect-size-help small {
  color: #666;
  font-style: italic;
}

.power-result {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.result-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.result-card h4 {
  margin: 0 0 16px 0;
  color: #333;
}

.power-value {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 8px;
}

.power-low { color: #ff4757; }
.power-medium { color: #ffa502; }
.power-high { color: #2ed573; }

.power-interpretation {
  color: #666;
  font-size: 14px;
}

.power-chart {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e1e5e9;
}

.power-recommendations {
  background: #e3f2fd;
  border-radius: 8px;
  padding: 20px;
}

.power-recommendations h4 {
  margin: 0 0 16px 0;
  color: #007BFF;
}

.power-recommendations ul {
  margin: 0;
  padding-left: 20px;
}

.power-recommendations li {
  margin-bottom: 8px;
  color: #333;
}

.enhanced-curves {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #F8F9FA;
  border-radius: 8px;
}

.curve-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.curve-controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.toggle-curves-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #007BFF;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.toggle-curves-btn:hover {
  background: #0056B3;
}

@media (max-width: 768px) {
  .power-result {
    grid-template-columns: 1fr;
  }
  
  .analysis-form {
    grid-template-columns: 1fr;
  }
}
</style>
