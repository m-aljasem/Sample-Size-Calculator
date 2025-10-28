import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import './styles/main.css'

// Set document direction based on saved language preference
const savedLocale = localStorage.getItem('preferred-language') || 'en'
if (savedLocale === 'ar' || savedLocale === 'fa') {
  document.documentElement.dir = 'rtl'
  document.documentElement.lang = savedLocale
} else {
  document.documentElement.dir = 'ltr'
  document.documentElement.lang = savedLocale
}

const app = createApp(App)
app.use(i18n)
app.mount('#app')
