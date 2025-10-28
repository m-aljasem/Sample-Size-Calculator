<template>
  <aside class="sidebar" :class="{ 'mobile-open': mobileMenuOpen }">
    <!-- Mobile Close Button -->
    <div class="mobile-close-button" v-if="mobileMenuOpen">
      <button @click="$emit('close-mobile-menu')" class="close-btn">
        {{ $t('app.navigation.closeMenu') }}
      </button>
    </div>

    <!-- Calculator Navigation -->
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

    <!-- Mobile Controls Section - Moved to Bottom -->
    <div class="mobile-controls" v-if="mobileMenuOpen">
      <div class="mobile-controls-title">{{ $t('app.navigation.settings') }}</div>
      <div class="mobile-controls-content">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </div>
  </aside>
</template>

<script>
import { estimationCalculators, hypothesisCalculators, ratesCalculators } from '../data/calculators.js'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'

export default {
  name: 'Sidebar',
  components: {
    LanguageSwitcher,
    ThemeSwitcher
  },
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
  emits: ['set-calculator', 'close-mobile-menu']
}
</script>
