<template>
  <div id="app">
    <AppHeader 
      :show-welcome="showWelcome"
      :mobile-menu-open="mobileMenuOpen"
      @toggle-mobile-menu="toggleMobileMenu" />

    <WelcomeScreen 
      v-if="showWelcome"
      @select-calculator="selectCalculator" />

    <div v-else class="main-container">
      <Sidebar 
        :active-calculator="activeCalculator"
        :mobile-menu-open="mobileMenuOpen"
        @set-calculator="setCalculator" />

      <CalculatorContent 
        :active-calculator="activeCalculator"
        :inputs="inputs" />
    </div>

    <button v-if="!showWelcome" class="back-to-welcome" @click="showWelcome = true">
      {{ $t('app.navigation.backToWelcome') }}
    </button>

    <AppFooter />
    <PWAInstallPrompt />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import WelcomeScreen from './components/WelcomeScreen.vue'
import Sidebar from './components/Sidebar.vue'
import CalculatorContent from './components/CalculatorContent.vue'
import AppFooter from './components/AppFooter.vue'
import PWAInstallPrompt from './components/PWAInstallPrompt.vue'
import { defaultInputs } from './data/calculators.js'

export default {
  name: 'App',
  components: {
    AppHeader,
    WelcomeScreen,
    Sidebar,
    CalculatorContent,
    AppFooter,
    PWAInstallPrompt
  },
  data() {
    return {
      showWelcome: true,
      activeCalculator: 'estimateProportion',
      mobileMenuOpen: false,
      inputs: { ...defaultInputs }
    }
  },
  methods: {
    selectCalculator(key) {
      this.activeCalculator = key
      this.showWelcome = false
      this.mobileMenuOpen = false
      window.scrollTo(0, 0)
    },
    setCalculator(key) {
      this.activeCalculator = key
      this.mobileMenuOpen = false
      window.scrollTo(0, 0)
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    }
  }
}
</script>
