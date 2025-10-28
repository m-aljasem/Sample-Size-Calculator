<template>
  <div class="pwa-features">
    <div class="feature-card">
      <h3>📱 PWA Features</h3>
      
      <div class="feature-item">
        <div class="feature-icon">💾</div>
        <div class="feature-content">
          <h4>Offline Calculations</h4>
          <p>All calculators work without internet connection</p>
          <div class="feature-status" :class="offlineStatus">
            {{ offlineStatus === 'online' ? '🟢 Online' : '🔴 Offline' }}
          </div>
        </div>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">🔄</div>
        <div class="feature-content">
          <h4>Auto-Sync</h4>
          <p>Calculations sync across your devices</p>
          <button @click="syncData" :disabled="!isOnline" class="sync-button">
            {{ isOnline ? '🔄 Sync Now' : '⏸️ Offline' }}
          </button>
        </div>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">🔔</div>
        <div class="feature-content">
          <h4>Smart Notifications</h4>
          <p>Get reminders for your studies</p>
          <button @click="requestNotificationPermission" class="notification-button">
            {{ notificationPermission === 'granted' ? '✅ Enabled' : '🔔 Enable' }}
          </button>
        </div>
      </div>
      
      <div class="feature-item">
        <div class="feature-icon">📊</div>
        <div class="feature-content">
          <h4>Usage Analytics</h4>
          <p>Track your calculation patterns</p>
          <div class="analytics-summary">
            <span>Total Calculations: {{ totalCalculations }}</span>
            <span>Most Used: {{ mostUsedCalculator }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'

export default {
  name: 'PWAFeatures',
  setup() {
    const isOnline = ref(navigator.onLine)
    const notificationPermission = ref('default')
    const totalCalculations = ref(0)
    const calculationHistory = ref([])
    
    const offlineStatus = computed(() => isOnline.value ? 'online' : 'offline')
    
    const mostUsedCalculator = computed(() => {
      if (calculationHistory.value.length === 0) return 'None'
      
      const counts = calculationHistory.value.reduce((acc, calc) => {
        acc[calc.calculatorName] = (acc[calc.calculatorName] || 0) + 1
        return acc
      }, {})
      
      return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
    })
    
    const syncData = async () => {
      if (!isOnline.value) return
      
      try {
        // Simulate data sync
        const localData = localStorage.getItem('calculationHistory')
        if (localData) {
          // In a real app, this would sync with a server
          console.log('Syncing data:', localData)
          
          // Show success message
          if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
            const registration = await navigator.serviceWorker.ready
            registration.showNotification('Data Synced', {
              body: 'Your calculations have been synced across devices',
              icon: '/icons/icon-192x192.png',
              badge: '/icons/icon-72x72.png'
            })
          }
        }
      } catch (error) {
        console.error('Sync failed:', error)
      }
    }
    
    const requestNotificationPermission = async () => {
      if (!('Notification' in window)) {
        alert('This browser does not support notifications')
        return
      }
      
      const permission = await Notification.requestPermission()
      notificationPermission.value = permission
      
      if (permission === 'granted') {
        // Show welcome notification
        new Notification('Notifications Enabled!', {
          body: 'You\'ll now receive helpful reminders about your studies',
          icon: '/icons/icon-192x192.png'
        })
      }
    }
    
    const loadAnalytics = () => {
      const history = localStorage.getItem('calculationHistory')
      if (history) {
        calculationHistory.value = JSON.parse(history)
        totalCalculations.value = calculationHistory.value.length
      }
    }
    
    const handleOnlineStatus = () => {
      isOnline.value = navigator.onLine
      
      if (isOnline.value) {
        // Auto-sync when coming back online
        syncData()
      }
    }
    
    onMounted(() => {
      // Check notification permission
      if ('Notification' in window) {
        notificationPermission.value = Notification.permission
      }
      
      // Load analytics
      loadAnalytics()
      
      // Listen for online/offline events
      window.addEventListener('online', handleOnlineStatus)
      window.addEventListener('offline', handleOnlineStatus)
      
      // Listen for storage changes (from other tabs)
      window.addEventListener('storage', loadAnalytics)
    })
    
    return {
      isOnline,
      offlineStatus,
      notificationPermission,
      totalCalculations,
      mostUsedCalculator,
      syncData,
      requestNotificationPermission
    }
  }
}
</script>

<style scoped>
.pwa-features {
  margin: 20px 0;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  color: #007BFF;
  margin: 0 0 20px 0;
  font-size: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-icon {
  font-size: 32px;
  margin-right: 16px;
  width: 48px;
  text-align: center;
}

.feature-content {
  flex: 1;
}

.feature-content h4 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 18px;
}

.feature-content p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.feature-status {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.feature-status.online {
  background: #d4edda;
  color: #155724;
}

.feature-status.offline {
  background: #f8d7da;
  color: #721c24;
}

.sync-button,
.notification-button {
  background: #007BFF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.sync-button:hover,
.notification-button:hover {
  background: #0056b3;
}

.sync-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.analytics-summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.analytics-summary span {
  font-size: 12px;
  color: #666;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

@media (max-width: 768px) {
  .feature-item {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  
  .feature-icon {
    margin-right: 0;
    margin-bottom: 8px;
  }
  
  .analytics-summary {
    flex-direction: column;
  }
}
</style>
