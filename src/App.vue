<template>
  <div id="app" :class="{ 'mobile-menu-open': mobileMenuOpen }">
    <AppHeader 
      :show-welcome="showWelcome"
      :mobile-menu-open="mobileMenuOpen"
      @toggle-mobile-menu="toggleMobileMenu"
      @open-feature="openFeature"
      @navigate-home="navigateHome" />

    <WelcomeScreen 
      v-if="showWelcome"
      @select-calculator="selectCalculator"
      @open-feature="openFeature" />

    <div v-else class="main-container">
      <Sidebar 
        :active-calculator="activeCalculator"
        :mobile-menu-open="mobileMenuOpen"
        @set-calculator="setCalculator"
        @close-mobile-menu="closeMobileMenu" />

      <div class="content-area">
        <!-- Calculator Content - only show when no advanced feature is active -->
        <CalculatorContent 
          v-if="!activeFeature"
          :active-calculator="activeCalculator"
          :inputs="inputs"
          @update-input="updateInput"
          @save-calculation="saveCalculation" />
        
        <!-- Advanced Features - replace calculator when active -->
        <div v-if="activeFeature" class="advanced-features">
          <div class="feature-header">
            <button @click="activeFeature = null" class="close-feature-button">
              ← Back to Calculator
            </button>
          </div>
          
          <PowerAnalysis 
            v-if="activeFeature === 'power'"
            :sample-size="getCurrentSampleSize()"
            :effect-size="getCurrentEffectSize()" />
          
          <CalculationHistory 
            v-if="activeFeature === 'history'"
            @load-calculation="loadCalculation" />
          
          <!-- PWA Features temporarily hidden
          <PWAFeatures 
            v-if="activeFeature === 'pwa'" />
          -->
          
          <DataVisualization 
            v-if="activeFeature === 'visualization'"
            :active-calculator="activeCalculator"
            :inputs="inputs"
            :result="getCurrentResult()" />
          
          <BayesianAnalysis 
            v-if="activeFeature === 'bayesian'" />
          
          <SequentialAnalysis 
            v-if="activeFeature === 'sequential'" />
          
          <EducationalTutorials 
            v-if="activeFeature === 'tutorials'" />
          
          <ReportingTemplates 
            v-if="activeFeature === 'reporting'"
            :active-calculator="activeCalculator"
            :inputs="inputs"
            :result="getCurrentResult()" />
          
          <AboutPage 
            v-if="activeFeature === 'about'" />
        </div>
      </div>
    </div>

    <button v-if="!showWelcome" class="back-to-welcome" @click="showWelcome = true">
      {{ $t('app.navigation.backToWelcome') }}
    </button>

    <AppFooter />
    <!-- PWA Install Prompt temporarily hidden
    <PWAInstallPrompt />
    -->
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import WelcomeScreen from './components/WelcomeScreen.vue'
import Sidebar from './components/Sidebar.vue'
import CalculatorContent from './components/CalculatorContent.vue'
import AppFooter from './components/AppFooter.vue'
// PWA components temporarily hidden
// import PWAInstallPrompt from './components/PWAInstallPrompt.vue'
import PowerAnalysis from './components/PowerAnalysis.vue'
import CalculationHistory from './components/CalculationHistory.vue'
// import PWAFeatures from './components/PWAFeatures.vue'
import DataVisualization from './components/DataVisualization.vue'
import BayesianAnalysis from './components/BayesianAnalysis.vue'
import SequentialAnalysis from './components/SequentialAnalysis.vue'
import EducationalTutorials from './components/EducationalTutorials.vue'
import ReportingTemplates from './components/ReportingTemplates.vue'
import AboutPage from './components/AboutPage.vue'
import { defaultInputs } from './data/calculators.js'
import * as calculators from './utils/calculators.js'

export default {
  name: 'App',
  components: {
    AppHeader,
    WelcomeScreen,
    Sidebar,
    CalculatorContent,
    AppFooter,
    // PWA components temporarily hidden
    // PWAInstallPrompt,
    PowerAnalysis,
    CalculationHistory,
    // PWAFeatures,
    DataVisualization,
    BayesianAnalysis,
    SequentialAnalysis,
    EducationalTutorials,
    ReportingTemplates,
    AboutPage
  },
  data() {
    return {
      showWelcome: true,
      activeCalculator: 'estimateProportion',
      mobileMenuOpen: false,
      activeFeature: null,
      inputs: { ...defaultInputs }
    }
  },
  methods: {
    selectCalculator(key) {
      this.activeCalculator = key
      this.showWelcome = false
      this.activeFeature = null
      this.mobileMenuOpen = false
      window.scrollTo(0, 0)
    },
    setCalculator(key) {
      this.activeCalculator = key
      this.activeFeature = null
      this.mobileMenuOpen = false
      window.scrollTo(0, 0)
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false
    },
    updateInput(calculator, inputName, value) {
      this.inputs[calculator][inputName] = value
    },
    openFeature(feature) {
      this.activeFeature = feature
      this.showWelcome = false
      this.mobileMenuOpen = false
      window.scrollTo(0, 0)
    },
    navigateHome() {
      this.showWelcome = true
      this.activeFeature = null
      this.mobileMenuOpen = false
      window.scrollTo(0, 0)
    },
    saveCalculation(calculatorName, inputs, result) {
      // This will be handled by the CalculationHistory component
      console.log('Saving calculation:', { calculatorName, inputs, result })
    },
    loadCalculation(calculation) {
      this.activeCalculator = calculation.calculatorKey || this.activeCalculator
      this.activeFeature = null
      if (calculation.inputs) {
        this.inputs[this.activeCalculator] = { ...calculation.inputs }
      }
    },
    getCurrentSampleSize() {
      const result = this.getCurrentResult()
      return result?.value || 30
    },
    getCurrentEffectSize() {
      const inputs = this.inputs[this.activeCalculator]
      return inputs?.effectSize || inputs?.d || 0.5
    },
    getCurrentResult() {
      switch(this.activeCalculator) {
        case 'estimateProportion':
          return calculators.calculateEstimateProportion(this.inputs.estimateProportion)
        case 'estimateMean':
          return calculators.calculateEstimateMean(this.inputs.estimateMean)
        case 'estimateDiff2Proportions':
          return calculators.calculateEstimateDiff2Proportions(this.inputs.estimateDiff2Proportions)
        case 'estimateOddsRatio':
          return calculators.calculateEstimateOddsRatio(this.inputs.estimateOddsRatio)
        case 'estimateRelativeRisk':
          return calculators.calculateEstimateRelativeRisk(this.inputs.estimateRelativeRisk)
        case 'estimateCorrelation':
          return calculators.calculateEstimateCorrelation(this.inputs.estimateCorrelation)
        case 'testProportion':
          return calculators.calculateTestProportion(this.inputs.testProportion)
        case 'test2Proportions':
          return calculators.calculateTest2Proportions(this.inputs.test2Proportions)
        case 'test2Means':
          return calculators.calculateTest2Means(this.inputs.test2Means)
        case 'test2Correlations':
          return calculators.calculateTest2Correlations(this.inputs.test2Correlations)
        case 'test2Rates':
          return calculators.calculateTest2Rates(this.inputs.test2Rates)
        default:
          return { value: null, error: null }
      }
    }
  }
}
</script>

<style scoped>
.content-area {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.advanced-features {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-header {
  background: #f8f9fa;
  padding: 16px 20px;
  border-radius: 8px;
  border-left: 4px solid #007BFF;
  margin-bottom: 10px;
}

.close-feature-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.close-feature-button:hover {
  background: #5a6268;
}

.feature-toggle {
  text-align: center;
  margin: 30px 0;
}

.toggle-button {
  background: #007BFF;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.toggle-button:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
}

.toggle-button.active {
  background: #28a745;
}

.toggle-button.active:hover {
  background: #218838;
}

@media (max-width: 768px) {
  .content-area {
    padding: 10px;
  }
  
  .advanced-features {
    margin-top: 20px;
    gap: 15px;
  }
  
  .toggle-button {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
