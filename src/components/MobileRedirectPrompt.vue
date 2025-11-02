<template>
  <div v-if="showPrompt" class="mobile-redirect-prompt">
    <div class="prompt-overlay" @click="dismissPrompt"></div>
    <div class="prompt-content">
      <div class="prompt-icon">📱</div>
      <h3>Mobile App Available</h3>
      <p>We detected you're on a mobile device. Would you like to use our optimized mobile app?</p>
      <div class="prompt-actions">
        <button class="btn-primary" @click="redirectToMobile">
          Use Mobile App
        </button>
        <button class="btn-secondary" @click="stayOnWeb">
          Stay on Web App
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { isMobileDevice, isStandaloneMode } from '../utils/deviceDetection.js'

export default {
  name: 'MobileRedirectPrompt',
  setup() {
    const showPrompt = ref(false)
    const mobileAppUrl = process.env.VUE_APP_MOBILE_APP_URL
    
    onMounted(() => {
      // Only show if:
      // 1. Mobile device detected
      // 2. Not already in standalone mode (not installed as PWA)
      // 3. Mobile app URL is configured
      // 4. User hasn't dismissed it before
      // 5. Redirect wasn't already attempted
      const dismissed = localStorage.getItem('mobile-redirect-dismissed')
      const redirectAttempted = sessionStorage.getItem('mobile-redirect-attempted')
      
      if (
        mobileAppUrl &&
        isMobileDevice() &&
        !isStandaloneMode() &&
        !dismissed &&
        !redirectAttempted
      ) {
        // Show prompt after a short delay
        setTimeout(() => {
          showPrompt.value = true
        }, 1000)
      }
    })
    
    const redirectToMobile = () => {
      if (mobileAppUrl) {
        sessionStorage.setItem('mobile-redirect-attempted', 'true')
        window.location.href = mobileAppUrl
      }
    }
    
    const stayOnWeb = () => {
      localStorage.setItem('prefer-web-app', 'true')
      localStorage.setItem('mobile-redirect-dismissed', 'true')
      showPrompt.value = false
    }
    
    const dismissPrompt = () => {
      localStorage.setItem('mobile-redirect-dismissed', 'true')
      showPrompt.value = false
    }
    
    return {
      showPrompt,
      redirectToMobile,
      stayOnWeb,
      dismissPrompt
    }
  }
}
</script>

<style scoped>
.mobile-redirect-prompt {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.prompt-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.prompt-content {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.prompt-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.prompt-content h3 {
  color: #007BFF;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.prompt-content p {
  color: #6C757D;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.prompt-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

.btn-secondary {
  background: transparent;
  color: #6C757D;
  border: 2px solid #E9ECEF;
}

.btn-secondary:hover {
  background: #F8F9FA;
  border-color: #CED4DA;
}
</style>

