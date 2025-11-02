import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './i18n';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.class.css';

/* Theme variables */
import './theme/variables.css';

// Set document direction based on saved language preference
const savedLocale = localStorage.getItem('preferred-language') || 'en';
if (savedLocale === 'ar' || savedLocale === 'fa') {
  document.documentElement.dir = 'rtl';
  document.documentElement.lang = savedLocale;
} else {
  document.documentElement.dir = 'ltr';
  document.documentElement.lang = savedLocale;
}

// Set theme based on saved preference
const savedTheme = localStorage.getItem('preferred-theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(i18n);

router.isReady().then(() => {
  app.mount('#app');
});
