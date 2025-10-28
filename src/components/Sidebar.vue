<template>
  <aside class="sidebar" :class="{ 'mobile-open': mobileMenuOpen }">
    <div class="nav-section">
      <div class="nav-section-title">{{ $t('app.navigation.estimation') }}</div>
      <div 
        v-for="calc in estimationCalculators" 
        :key="calc.key"
        class="nav-item"
        :class="{ active: activeCalculator === calc.key }"
        @click="$emit('set-calculator', calc.key)">
        {{ calc.emoji }} {{ calc.title }}
      </div>
    </div>

    <div class="nav-section">
      <div class="nav-section-title">{{ $t('app.navigation.hypothesis') }}</div>
      <div 
        v-for="calc in hypothesisCalculators" 
        :key="calc.key"
        class="nav-item"
        :class="{ active: activeCalculator === calc.key }"
        @click="$emit('set-calculator', calc.key)">
        {{ calc.emoji }} {{ calc.title }}
      </div>
    </div>

    <div class="nav-section">
      <div class="nav-section-title">{{ $t('app.navigation.rates') }}</div>
      <div 
        v-for="calc in ratesCalculators" 
        :key="calc.key"
        class="nav-item"
        :class="{ active: activeCalculator === calc.key }"
        @click="$emit('set-calculator', calc.key)">
        {{ calc.emoji }} {{ calc.title }}
      </div>
    </div>
  </aside>
</template>

<script>
import { estimationCalculators, hypothesisCalculators, ratesCalculators } from '../data/calculators.js'

export default {
  name: 'Sidebar',
  props: {
    activeCalculator: {
      type: String,
      required: true
    },
    mobileMenuOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      estimationCalculators,
      hypothesisCalculators,
      ratesCalculators
    }
  },
  emits: ['set-calculator']
}
</script>
