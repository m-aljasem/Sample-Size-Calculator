<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ $t('app.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="calculators-container">
        <h1 class="welcome-title">{{ $t('app.welcome.title') }}</h1>
        <p class="welcome-subtitle">{{ $t('app.welcome.subtitle') }}</p>

        <ion-card 
          button 
          @click="goToCalculatorType('estimation')" 
          class="calculator-type-card"
        >
          <ion-card-header>
            <ion-card-title>
              <span class="emoji">📊</span>
              {{ $t('app.welcome.estimation') }}
            </ion-card-title>
            <ion-card-subtitle>{{ $t('app.welcome.estimationDesc') }}</ion-card-subtitle>
          </ion-card-header>
        </ion-card>

        <ion-card 
          button 
          @click="goToCalculatorType('hypothesis')" 
          class="calculator-type-card"
        >
          <ion-card-header>
            <ion-card-title>
              <span class="emoji">🔬</span>
              {{ $t('app.welcome.hypothesis') }}
            </ion-card-title>
            <ion-card-subtitle>{{ $t('app.welcome.hypothesisDesc') }}</ion-card-subtitle>
          </ion-card-header>
        </ion-card>

        <ion-card 
          button 
          @click="goToCalculatorType('rates')" 
          class="calculator-type-card"
        >
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
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/vue';

const router = useRouter();

const goToCalculatorType = (type: string) => {
  router.push(`/calculators/${type}`);
};
</script>

<style scoped>
.calculators-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 10px 0;
}

.welcome-title {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  color: var(--ion-color-primary);
}

.welcome-subtitle {
  font-size: 1rem;
  text-align: center;
  color: var(--ion-color-medium);
  margin-bottom: 25px;
}

.calculator-type-card {
  margin-bottom: 18px;
  transition: transform 0.2s;
}

.calculator-type-card:active {
  transform: scale(0.98);
}

.calculator-type-card ion-card-header {
  padding: 20px;
}

.calculator-type-card ion-card-title {
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.emoji {
  font-size: 2rem;
}

.help-card {
  margin-top: 25px;
  background: var(--ion-color-light);
}

.help-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--ion-color-dark);
}
</style>

