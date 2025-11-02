import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import './styles/main.css'
import './styles/enhancements.css'
import { redirectToMobileApp, shouldStayOnWebApp } from './utils/deviceDetection.js'

// Automatic mobile redirect (if enabled and configured)
const enableMobileRedirect = process.env.VUE_APP_ENABLE_MOBILE_REDIRECT !== 'false'
const mobileAppUrl = process.env.VUE_APP_MOBILE_APP_URL

if (enableMobileRedirect && mobileAppUrl && !shouldStayOnWebApp()) {
  // Automatic redirect happens immediately on mobile devices
  // (before Vue app initializes to avoid flash of content)
  redirectToMobileApp(mobileAppUrl)
}

// Set document direction based on saved language preference
const savedLocale = localStorage.getItem('preferred-language') || 'en'
if (savedLocale === 'ar' || savedLocale === 'fa') {
  document.documentElement.dir = 'rtl'
  document.documentElement.lang = savedLocale
} else {
  document.documentElement.dir = 'ltr'
  document.documentElement.lang = savedLocale
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use the correct service worker path based on build
    const swPath = process.env.NODE_ENV === 'production' 
      ? './service-worker.js' 
      : '/service-worker.js'
    
    navigator.serviceWorker.register(swPath)
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope)
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          console.log('New service worker found, installing...')
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available, reload to activate
              console.log('New service worker installed, reloading...')
              window.location.reload()
            }
          })
        })
      })
      .catch((registrationError) => {
        console.error('Service Worker registration failed:', registrationError)
      })
  })
}

// Handle online/offline events for better PWA experience
window.addEventListener('online', () => {
  console.log('App is online')
  // Optionally notify user
})

window.addEventListener('offline', () => {
  console.log('App is offline - using cached resources')
  // Optionally notify user that offline mode is active
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')
