<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-list>
        <ion-item 
          v-for="calculator in calculators" 
          :key="calculator.key"
          button
          @click="goToCalculator(calculator.key)"
          lines="full"
        >
          <ion-icon :icon="calculatorIcon" slot="start" class="calculator-icon"></ion-icon>
          <ion-label>
            <h2>{{ calculator.emoji }} {{ calculator.title }}</h2>
            <p>{{ calculator.description }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
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
  IonList,
  IonItem,
  IonLabel,
  IonIcon
} from '@ionic/vue';
import { calculatorOutline } from 'ionicons/icons';
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { estimationCalculators, hypothesisCalculators, ratesCalculators } from '../data/calculators';

const route = useRoute();
const router = useRouter();

const type = route.params.type as string;

const calculators = computed(() => {
  switch (type) {
    case 'estimation':
      return estimationCalculators;
    case 'hypothesis':
      return hypothesisCalculators;
    case 'rates':
      return ratesCalculators;
    default:
      return [];
  }
});

const title = computed(() => {
  switch (type) {
    case 'estimation':
      return 'Estimation Studies';
    case 'hypothesis':
      return 'Hypothesis Testing';
    case 'rates':
      return 'Rates & Survival';
    default:
      return 'Calculators';
  }
});

const calculatorIcon = calculatorOutline;

const goToCalculator = (key: string) => {
  router.push(`/calculator/${key}`);
};
</script>

<style scoped>
.calculator-icon {
  font-size: 1.5rem;
  color: var(--ion-color-primary);
}

ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  margin-bottom: 8px;
  border-radius: 8px;
}

ion-item h2 {
  font-weight: 600;
  margin-bottom: 4px;
}

ion-item p {
  color: var(--ion-color-medium);
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>

