<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ $t('app.title') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openSettings">
            <ion-icon :icon="settingsOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="welcome-container">
        <h1 class="welcome-title">{{ $t('app.welcome.title') }}</h1>
        <p class="welcome-subtitle">{{ $t('app.welcome.subtitle') }}</p>

        <ion-card button @click="goToCalculatorType('estimation')" class="calculator-type-card">
          <ion-card-header>
            <ion-card-title>
              <span class="emoji">📊</span>
              {{ $t('app.welcome.estimation') }}
            </ion-card-title>
            <ion-card-subtitle>{{ $t('app.welcome.estimationDesc') }}</ion-card-subtitle>
          </ion-card-header>
        </ion-card>

        <ion-card button @click="goToCalculatorType('hypothesis')" class="calculator-type-card">
          <ion-card-header>
            <ion-card-title>
              <span class="emoji">🔬</span>
              {{ $t('app.welcome.hypothesis') }}
            </ion-card-title>
            <ion-card-subtitle>{{ $t('app.welcome.hypothesisDesc') }}</ion-card-subtitle>
          </ion-card-header>
        </ion-card>

        <ion-card button @click="goToCalculatorType('rates')" class="calculator-type-card">
          <ion-card-header>
            <ion-card-title>
              <span class="emoji">⏱️</span>
              {{ $t('app.welcome.rates') }}
            </ion-card-title>
            <ion-card-subtitle>{{ $t('app.welcome.ratesDesc') }}</ion-card-subtitle>
          </ion-card-header>
        </ion-card>

        <ion-card class="help-card">
          <ion-card-content>
            <p class="help-text">{{ $t('app.welcome.help') }}</p>
          </ion-card-content>
        </ion-card>

        <!-- Advanced Features Section -->
        <div class="advanced-features-section">
          <h2 class="section-title">🚀 Advanced Features</h2>
          
          <ion-grid>
            <ion-row>
              <ion-col size="6" v-for="feature in advancedFeatures" :key="feature.id">
                <ion-card button @click="goToFeature(feature.id)" class="feature-card">
                  <ion-card-content>
                    <div class="feature-icon">{{ feature.icon }}</div>
                    <h3>{{ feature.title }}</h3>
                    <p>{{ feature.description }}</p>
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
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
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  modalController
} from '@ionic/vue';
import { settingsOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import SettingsModal from '../components/SettingsModal.vue';

const router = useRouter();

const advancedFeatures = ref([
  {
    id: 'tutorials',
    icon: '🎓',
    title: 'Educational Tutorials',
    description: 'Interactive guides for statistical concepts'
  },
  {
    id: 'visualization',
    icon: '📊',
    title: 'Data Visualization',
    description: 'Interactive charts and graphs'
  },
  {
    id: 'power',
    icon: '⚡',
    title: 'Power Analysis',
    description: 'Advanced power analysis tools'
  },
  {
    id: 'bayesian',
    icon: '🧠',
    title: 'Bayesian Analysis',
    description: 'Bayesian methods with prior distributions'
  },
  {
    id: 'sequential',
    icon: '📈',
    title: 'Sequential Analysis',
    description: 'Adaptive and sequential study designs'
  },
  {
    id: 'history',
    icon: '📋',
    title: 'Calculation History',
    description: 'Save and manage previous calculations'
  },
  {
    id: 'about',
    icon: 'ℹ️',
    title: 'About',
    description: 'Project information and team'
  }
]);

const goToCalculatorType = (type: string) => {
  router.push(`/calculators/${type}`);
};

const goToFeature = (featureId: string) => {
  router.push(`/feature/${featureId}`);
};

const openSettings = async () => {
  const modal = await modalController.create({
    component: SettingsModal
  });
  return modal.present();
};
</script>

<style scoped>
.welcome-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 0;
}

.welcome-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  color: var(--ion-color-primary);
}

.welcome-subtitle {
  font-size: 1.1rem;
  text-align: center;
  color: var(--ion-color-medium);
  margin-bottom: 30px;
}

.calculator-type-card {
  margin-bottom: 20px;
  transition: transform 0.2s;
}

.calculator-type-card:active {
  transform: scale(0.98);
}

.calculator-type-card ion-card-header {
  padding: 20px;
}

.calculator-type-card ion-card-title {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.emoji {
  font-size: 2rem;
}

.help-card {
  margin-top: 30px;
  background: var(--ion-color-light);
}

.help-text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--ion-color-dark);
}

.advanced-features-section {
  margin-top: 40px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: var(--ion-color-primary);
}

.feature-card {
  height: 100%;
  text-align: center;
  transition: transform 0.2s;
}

.feature-card:active {
  transform: scale(0.95);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.feature-card h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 10px 0 5px 0;
  color: var(--ion-color-primary);
}

.feature-card p {
  font-size: 0.85rem;
  color: var(--ion-color-medium);
  margin: 0;
  line-height: 1.4;
}
</style>
