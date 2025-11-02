<template>
  <div v-if="showInstallPrompt" class="pwa-install-prompt">
    <div class="pwa-content">
      <div class="pwa-icon">
        <img src="/icons/icons/icon-192x192.png" alt="App Icon" />
      </div>
      <div class="pwa-text">
        <h3>Install App</h3>
        <p>Install this app on your device for quick access and offline use.</p>
      </div>
      <div class="pwa-actions">
        <button class="pwa-button install" @click="installApp">
          Install
        </button>
        <button class="pwa-button dismiss" @click="dismissPrompt">
          Not Now
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'PWAInstallPrompt',
  setup() {
    const showInstallPrompt = ref(false)
    let deferredPrompt = null
    
    onMounted(() => {
      // Check if already installed
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return
      }
      
      // Listen for the beforeinstallprompt event
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        deferredPrompt = e
        
        // Show install prompt after a delay
        setTimeout(() => {
          const dismissed = localStorage.getItem('pwa-install-dismissed')
          if (!dismissed) {
            showInstallPrompt.value = true
          }
        }, 3000)
      })
      
      // Listen for app installed event
      window.addEventListener('appinstalled', () => {
        showInstallPrompt.value = false
        localStorage.removeItem('pwa-install-dismissed')
      })
    })
    
    const installApp = async () => {
      if (!deferredPrompt) {
        console.warn('PWA install prompt not available')
        return
      }
      
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('PWA installed successfully')
      }
      
      deferredPrompt = null
      showInstallPrompt.value = false
    }
    
    const dismissPrompt = () => {
      showInstallPrompt.value = false
      localStorage.setItem('pwa-install-dismissed', 'true')
    }
    
    return {
      showInstallPrompt,
      installApp,
      dismissPrompt
    }
  }
}
</script>

<style scoped>
.pwa-install-prompt {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideUp 0.3s ease;
}

.pwa-content {
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
}

.pwa-icon {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pwa-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2px;
}

.pwa-text {
  flex: 1;
}

.pwa-text h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #343A40;
}

.pwa-text p {
  margin: 0;
  font-size: 0.875rem;
  color: #6C757D;
}

.pwa-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.pwa-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.pwa-button.install {
  background: #007BFF;
  color: white;
  border: 2px solid #007BFF;
}

.pwa-button.install:hover {
  background: #0056B3;
  border-color: #0056B3;
}

.pwa-button.dismiss {
  background: transparent;
  color: #6C757D;
  border: 2px solid #E9ECEF;
}

.pwa-button.dismiss:hover {
  background: #F8F9FA;
  border-color: #CED4DA;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .pwa-install-prompt {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
  }
  
  .pwa-content {
    flex-direction: column;
    text-align: center;
  }
  
  .pwa-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>
