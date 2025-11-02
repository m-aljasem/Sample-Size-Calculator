<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ $t('tabs.advanced') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="features-container">
        <ion-grid>
          <ion-row>
            <ion-col 
              size="6" 
              v-for="feature in advancedFeatures" 
              :key="feature.id"
              class="feature-col"
            >
              <ion-card 
                button 
                @click="goToFeature(feature.id)" 
                class="feature-card"
              >
                <ion-card-content class="feature-content">
                  <div class="feature-icon">{{ feature.icon }}</div>
                  <h3>{{ $t(`features.${feature.id}.title`) }}</h3>
                  <p>{{ $t(`features.${feature.id}.description`) }}</p>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent
} from '@ionic/vue';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

const advancedFeatures = ref([
  {
    id: 'visualization',
    icon: '📊'
  },
  {
    id: 'power',
    icon: '⚡'
  },
  {
    id: 'posthoc',
    icon: '🔍'
  },
  {
    id: 'sensitivity',
    icon: '📈'
  },
  {
    id: 'scenarios',
    icon: '📊'
  },
  {
    id: 'effectsize',
    icon: '📐'
  },
  {
    id: 'bayesian',
    icon: '🧠'
  },
  {
    id: 'sequential',
    icon: '📈'
  },
  {
    id: 'history',
    icon: '📋'
  }
]);

const goToFeature = (featureId: string) => {
  router.push(`/feature/${featureId}`);
};
</script>

<style scoped>
.features-container {
  max-width: 100%;
  padding: 10px 0;
}

.feature-col {
  padding: 8px;
}

.feature-card {
  height: 100%;
  margin: 0;
  transition: transform 0.2s;
}

.feature-card:active {
  transform: scale(0.95);
}

.feature-content {
  padding: 20px 15px;
  text-align: center;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.feature-card h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 8px 0 5px 0;
  color: var(--ion-color-primary);
  line-height: 1.3;
}

.feature-card p {
  font-size: 0.85rem;
  color: var(--ion-color-medium);
  margin: 0;
  line-height: 1.4;
}
</style>

