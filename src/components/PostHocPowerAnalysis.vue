<template>
  <div class="post-hoc-power">
    <div class="feature-header">
      <h2>📊 Post-Hoc Power Analysis</h2>
      <p>Calculate the achieved power of your study based on actual sample size and observed effect size.</p>
    </div>

    <div class="power-calculator">
      <div class="input-section">
        <h3>Study Parameters</h3>
        <div class="input-group">
          <label>Test Type</label>
          <select v-model="testType" class="input-field">
            <option value="testProportion">Single Proportion Test</option>
            <option value="test2Proportions">Two Proportions Test</option>
            <option value="test2Means">Two Means Test</option>
          </select>
        </div>

        <div class="input-group">
          <label>α (Alpha)</label>
          <input type="number" v-model.number="alpha" step="0.01" min="0" max="1" class="input-field" placeholder="0.05">
        </div>

        <div class="input-group">
          <label>Sample Size (n per group)</label>
          <input type="number" v-model.number="sampleSize" step="1" min="1" class="input-field" placeholder="100">
        </div>

        <div class="input-group">
          <label>Test Type</label>
          <div class="toggle-group">
            <button class="toggle-button" :class="{ active: !twoTailed }" @click="twoTailed = false">One-Tailed</button>
            <button class="toggle-button" :class="{ active: twoTailed }" @click="twoTailed = true">Two-Tailed</button>
          </div>
        </div>

        <!-- Test-specific inputs -->
        <template v-if="testType === 'testProportion'">
          <div class="input-group">
            <label>p₀ (Null Proportion)</label>
            <input type="number" v-model.number="p0" step="0.01" min="0" max="1" class="input-field" placeholder="0.5">
          </div>
          <div class="input-group">
            <label>pₐ (Alternative/Observed Proportion)</label>
            <input type="number" v-model.number="pa" step="0.01" min="0" max="1" class="input-field" placeholder="0.6">
          </div>
        </template>

        <template v-if="testType === 'test2Proportions'">
          <div class="input-group">
            <label>p₁ (Group 1 Proportion)</label>
            <input type="number" v-model.number="p1" step="0.01" min="0" max="1" class="input-field" placeholder="0.6">
          </div>
          <div class="input-group">
            <label>p₂ (Group 2 Proportion)</label>
            <input type="number" v-model.number="p2" step="0.01" min="0" max="1" class="input-field" placeholder="0.4">
          </div>
        </template>

        <template v-if="testType === 'test2Means'">
          <div class="input-group">
            <label>μ₁ (Group 1 Mean)</label>
            <input type="number" v-model.number="mu1" step="0.01" class="input-field" placeholder="100">
          </div>
          <div class="input-group">
            <label>μ₂ (Group 2 Mean)</label>
            <input type="number" v-model.number="mu2" step="0.01" class="input-field" placeholder="95">
          </div>
          <div class="input-group">
            <label>σ₁ (Group 1 SD)</label>
            <input type="number" v-model.number="sd1" step="0.01" min="0" class="input-field" placeholder="15">
          </div>
          <div class="input-group">
            <label>σ₂ (Group 2 SD)</label>
            <input type="number" v-model.number="sd2" step="0.01" min="0" class="input-field" placeholder="15">
          </div>
        </template>
      </div>

      <div class="result-section">
        <h3>Calculated Power</h3>
        <div v-if="powerResult.error" class="error-message">
          ⚠️ {{ powerResult.error }}
        </div>
        <div v-else-if="powerResult.power !== null && powerResult.power !== undefined" class="power-result">
          <div class="power-value">
            {{ (powerResult.power * 100).toFixed(1) }}%
          </div>
          <div class="power-interpretation">
            <p v-if="powerResult.power < 0.5" class="warning">
              ⚠️ Low power: Your study had insufficient power to detect this effect.
            </p>
            <p v-else-if="powerResult.power < 0.8" class="warning">
              ⚠️ Moderate power: Power below 80% may limit your ability to detect true effects.
            </p>
            <p v-else class="success">
              ✅ Adequate power: Your study had sufficient power to detect this effect.
            </p>
          </div>
        </div>
        <div v-else class="placeholder">
          Enter parameters to calculate power
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import * as calculators from '../utils/calculators.js'

export default {
  name: 'PostHocPowerAnalysis',
  setup() {
    const testType = ref('test2Proportions')
    const alpha = ref(0.05)
    const sampleSize = ref(100)
    const twoTailed = ref(true)
    const p0 = ref(0.5)
    const pa = ref(0.6)
    const p1 = ref(0.6)
    const p2 = ref(0.4)
    const mu1 = ref(100)
    const mu2 = ref(95)
    const sd1 = ref(15)
    const sd2 = ref(15)

    const powerResult = computed(() => {
      if (!alpha.value || !sampleSize.value) {
        return { power: null, error: null }
      }

      let inputs = {
        alpha: alpha.value,
        n: sampleSize.value,
        twoTailed: twoTailed.value
      }

      try {
        switch(testType.value) {
          case 'testProportion':
            if (!p0.value || !pa.value) return { power: null, error: null }
            inputs = { ...inputs, p0: p0.value, pa: pa.value }
            return calculators.calculatePostHocPowerTestProportion(inputs)
          case 'test2Proportions':
            if (!p1.value || !p2.value) return { power: null, error: null }
            inputs = { ...inputs, p1: p1.value, p2: p2.value }
            return calculators.calculatePostHocPowerTest2Proportions(inputs)
          case 'test2Means':
            if (!mu1.value || !mu2.value || !sd1.value || !sd2.value) return { power: null, error: null }
            inputs = { ...inputs, mu1: mu1.value, mu2: mu2.value, sd1: sd1.value, sd2: sd2.value }
            return calculators.calculatePostHocPowerTest2Means(inputs)
          default:
            return { power: null, error: 'Invalid test type' }
        }
      } catch (e) {
        return { power: null, error: e.message }
      }
    })

    return {
      testType,
      alpha,
      sampleSize,
      twoTailed,
      p0,
      pa,
      p1,
      p2,
      mu1,
      mu2,
      sd1,
      sd2,
      powerResult
    }
  }
}
</script>

<style scoped>
.post-hoc-power {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.feature-header {
  text-align: center;
  margin-bottom: 2rem;
}

.feature-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.power-calculator {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.input-section, .result-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.power-result {
  text-align: center;
}

.power-value {
  font-size: 4rem;
  font-weight: 700;
  color: #20C997;
  margin: 1rem 0;
}

.power-interpretation {
  margin-top: 1.5rem;
}

.power-interpretation .warning {
  color: #FF6B6B;
  font-weight: 600;
}

.power-interpretation .success {
  color: #20C997;
  font-weight: 600;
}

.placeholder {
  color: #6C757D;
  text-align: center;
  padding: 2rem;
}

@media (max-width: 768px) {
  .power-calculator {
    grid-template-columns: 1fr;
  }
}
</style>
