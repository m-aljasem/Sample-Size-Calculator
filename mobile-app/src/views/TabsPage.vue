<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/advanced">
          <ion-icon :icon="appsOutline"></ion-icon>
          <ion-label>{{ $t('tabs.advanced') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/about">
          <ion-icon :icon="informationCircleOutline"></ion-icon>
          <ion-label>{{ $t('tabs.about') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/calculators">
          <ion-icon :icon="calculatorOutline"></ion-icon>
          <ion-label>{{ $t('tabs.calculators') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab4" href="/tabs/education">
          <ion-icon :icon="schoolOutline"></ion-icon>
          <ion-label>{{ $t('tabs.education') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab5" href="/tabs/settings">
          <ion-icon :icon="settingsOutline"></ion-icon>
          <ion-label>{{ $t('tabs.settings') }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/vue';
import {
  appsOutline,
  informationCircleOutline,
  calculatorOutline,
  schoolOutline,
  settingsOutline
} from 'ionicons/icons';
</script>

