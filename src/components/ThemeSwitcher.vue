<template>
  <div class="theme-switcher">
    <button 
      class="theme-button"
      @click="toggleTheme"
      :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
      <span v-if="isDark">☀️</span>
      <span v-else>🌙</span>
      <span class="theme-text">{{ isDark ? 'Light' : 'Dark' }}</span>
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ThemeSwitcher',
  setup() {
    const isDark = ref(false)
    
    const toggleTheme = () => {
      isDark.value = !isDark.value
      localStorage.setItem('dark-mode', isDark.value.toString())
      updateTheme()
    }
    
    const updateTheme = () => {
      if (isDark.value) {
        document.documentElement.classList.add('dark-theme')
      } else {
        document.documentElement.classList.remove('dark-theme')
      }
    }
    
    onMounted(() => {
      // Check for saved theme preference or default to light mode
      const savedTheme = localStorage.getItem('dark-mode')
      if (savedTheme !== null) {
        isDark.value = savedTheme === 'true'
      } else {
        isDark.value = false // Default to light mode
      }
      updateTheme()
    })
    
    return {
      isDark,
      toggleTheme
    }
  }
}
</script>

<style scoped>
.theme-switcher {
  margin-left: 1rem;
}

.theme-button {
  background: #F8F9FA;
  border: 2px solid #E9ECEF;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-button:hover {
  background: #007BFF;
  color: white;
  border-color: #007BFF;
}

.theme-text {
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .theme-switcher {
    margin-left: 0;
    margin-top: 0.5rem;
  }
}
</style>
