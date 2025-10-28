<template>
  <div class="welcome-screen">
    <div class="welcome-content">
      <div class="welcome-header">
        <h2>{{ $t('app.welcome.title') }}</h2>
        <p>{{ $t('app.welcome.subtitle') }}</p>
      </div>

      <div class="calculator-categories">
        <div class="category-card">
          <div class="category-icon">📊</div>
          <h3>{{ $t('app.welcome.estimation') }}</h3>
          <p>{{ $t('app.welcome.estimationDesc') }}</p>
          <div class="category-options">
            <button 
              v-for="calc in estimationCalculators" 
              :key="calc.key"
              class="option-button"
              @click="$emit('select-calculator', calc.key)">
              {{ calc.emoji }} {{ calc.title }}
            </button>
          </div>
        </div>

        <div class="category-card">
          <div class="category-icon">🔬</div>
          <h3>{{ $t('app.welcome.hypothesis') }}</h3>
          <p>{{ $t('app.welcome.hypothesisDesc') }}</p>
          <div class="category-options">
            <button 
              v-for="calc in hypothesisCalculators" 
              :key="calc.key"
              class="option-button"
              @click="$emit('select-calculator', calc.key)">
              {{ calc.emoji }} {{ calc.title }}
            </button>
          </div>
        </div>

        <div class="category-card">
          <div class="category-icon">⏱️</div>
          <h3>{{ $t('app.welcome.rates') }}</h3>
          <p>{{ $t('app.welcome.ratesDesc') }}</p>
          <div class="category-options">
            <button 
              v-for="calc in ratesCalculators" 
              :key="calc.key"
              class="option-button"
              @click="$emit('select-calculator', calc.key)">
              {{ calc.emoji }} {{ calc.title }}
            </button>
          </div>
        </div>
      </div>

      <div class="welcome-footer">
        <p>{{ $t('app.welcome.help') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { estimationCalculators, hypothesisCalculators, ratesCalculators } from '../data/calculators.js'

export default {
  name: 'WelcomeScreen',
  data() {
    return {
      estimationCalculators,
      hypothesisCalculators,
      ratesCalculators
    }
  },
  emits: ['select-calculator']
}
</script>
