<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ featureTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Educational Tutorials -->
      <EducationalTutorials v-if="featureId === 'tutorials'" />
      
      <!-- Data Visualization -->
      <DataVisualization v-else-if="featureId === 'visualization'" />
      
      <!-- Power Analysis -->
      <PowerAnalysis v-else-if="featureId === 'power'" />
      
      <!-- Post-Hoc Power Analysis -->
      <PostHocPowerAnalysis v-else-if="featureId === 'posthoc'" />
      
      <!-- Sensitivity Analysis -->
      <SensitivityAnalysis v-else-if="featureId === 'sensitivity'" />
      
      <!-- Scenario Comparison -->
      <ScenarioComparison v-else-if="featureId === 'scenarios'" />
      
      <!-- Effect Size Helpers -->
      <EffectSizeHelpers v-else-if="featureId === 'effectsize'" />
      
      <!-- Bayesian Analysis -->
      <BayesianAnalysis v-else-if="featureId === 'bayesian'" />
      
      <!-- Sequential Analysis -->
      <SequentialAnalysis v-else-if="featureId === 'sequential'" />
      
      <!-- Calculation History -->
      <CalculationHistory v-else-if="featureId === 'history'" />
      
      <!-- About Page -->
      <AboutPage v-else-if="featureId === 'about'" />
      
      <!-- Default/Unknown Feature -->
      <div v-else class="unknown-feature">
        <ion-card>
          <ion-card-content>
            <p>Feature not found</p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent
} from '@ionic/vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import EducationalTutorials from '../components/EducationalTutorials.vue';
import DataVisualization from '../components/DataVisualization.vue';
import PowerAnalysis from '../components/PowerAnalysis.vue';
import PostHocPowerAnalysis from '../components/PostHocPowerAnalysis.vue';
import SensitivityAnalysis from '../components/SensitivityAnalysis.vue';
import ScenarioComparison from '../components/ScenarioComparison.vue';
import EffectSizeHelpers from '../components/EffectSizeHelpers.vue';
import BayesianAnalysis from '../components/BayesianAnalysis.vue';
import SequentialAnalysis from '../components/SequentialAnalysis.vue';
import CalculationHistory from '../components/CalculationHistory.vue';
import AboutPage from '../components/AboutPage.vue';

const route = useRoute();
const featureId = route.params.featureId as string;

const featureTitle = computed(() => {
      const titles: Record<string, string> = {
        sensitivity: '📈 Sensitivity Analysis',
        scenarios: '📊 Scenario Comparison',
        effectsize: '📐 Effect Size Helpers',
    tutorials: '🎓 Educational Tutorials',
    visualization: '📊 Data Visualization',
    power: '⚡ Power Analysis',
    posthoc: '🔍 Post-Hoc Power Analysis',
    bayesian: '🧠 Bayesian Analysis',
    sequential: '📈 Sequential Analysis',
    history: '📋 Calculation History',
    about: 'ℹ️ About'
  };
  return titles[featureId] || 'Feature';
});
</script>

<style scoped>
.unknown-feature {
  text-align: center;
  padding: 40px 20px;
}
</style>

