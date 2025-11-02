<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Settings</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="dismiss">
            <ion-icon :icon="closeOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-list-header>
          <ion-label>Language</ion-label>
        </ion-list-header>
        <ion-item 
          v-for="lang in languages" 
          :key="lang.code"
          button
          @click="changeLanguage(lang.code)"
        >
          <ion-label>{{ lang.name }}</ion-label>
          <ion-icon 
            v-if="currentLocale === lang.code" 
            :icon="checkmarkOutline" 
            slot="end"
            color="primary"
          ></ion-icon>
        </ion-item>

        <ion-list-header>
          <ion-label>Theme</ion-label>
        </ion-list-header>
        <ion-item button @click="toggleTheme">
          <ion-icon :icon="darkMode ? sunnyOutline : moonOutline" slot="start"></ion-icon>
          <ion-label>{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</ion-label>
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
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  modalController
} from '@ionic/vue';
import { closeOutline, checkmarkOutline, moonOutline, sunnyOutline } from 'ionicons/icons';
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fa', name: 'فارسی (Farsi)' },
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'fr', name: 'Français (French)' }
];

const currentLocale = computed(() => locale.value);

const darkMode = ref(false);

onMounted(() => {
  const isDark = document.body.classList.contains('dark');
  darkMode.value = isDark;
  
  // Check localStorage
  const savedTheme = localStorage.getItem('preferred-theme');
  if (savedTheme === 'dark') {
    darkMode.value = true;
    document.body.classList.add('dark');
  }
});

const changeLanguage = (langCode: string) => {
  locale.value = langCode;
  localStorage.setItem('preferred-language', langCode);
  
  // Set document direction for RTL languages
  if (langCode === 'ar' || langCode === 'fa') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = langCode;
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = langCode;
  }
};

const toggleTheme = () => {
  darkMode.value = !darkMode.value;
  if (darkMode.value) {
    document.body.classList.add('dark');
    localStorage.setItem('preferred-theme', 'dark');
  } else {
    document.body.classList.remove('dark');
    localStorage.setItem('preferred-theme', 'light');
  }
};

const dismiss = () => {
  modalController.dismiss();
};
</script>

<style scoped>
ion-list-header {
  margin-top: 20px;
}

ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
}
</style>

