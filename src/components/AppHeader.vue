<template>
  <header class="header">
    <div class="header-content">
      <div class="header-main">
        <div class="title-section">
          <h1 class="clickable-title" @click="$emit('navigate-home')">🧬 {{ $t('app.title') }}</h1>
          <div class="header-subtitle">{{ $t('app.subtitle') }}</div>
        </div>
        <button 
          class="mobile-menu-toggle" 
          @click="$emit('toggle-mobile-menu')" 
          v-if="!showWelcome"
          :title="mobileMenuOpen ? $t('app.navigation.closeMenu') : $t('app.navigation.showCalculators')">
          {{ mobileMenuOpen ? '✕' : '☰' }}
        </button>
      </div>
      
      <div class="header-controls">
        <!-- Advanced Features Buttons -->
        <div class="feature-buttons" v-if="!showWelcome">
          <button 
            class="feature-button" 
            @click="$emit('open-feature', 'tutorials')"
            title="Educational Tutorials">
            🎓
          </button>
          <button 
            class="feature-button" 
            @click="$emit('open-feature', 'visualization')"
            title="Data Visualization & Charts">
            📊
          </button>
          <button 
            class="feature-button" 
            @click="$emit('open-feature', 'power')"
            title="Power Analysis">
            ⚡
          </button>
          <button 
            class="feature-button" 
            @click="$emit('open-feature', 'bayesian')"
            title="Bayesian Analysis">
            🧠
          </button>
          <button 
            class="feature-button" 
            @click="$emit('open-feature', 'sequential')"
            title="Sequential Analysis">
            📈
          </button>
          <button 
            class="feature-button" 
            @click="$emit('open-feature', 'history')"
            title="Calculation History">
            📋
          </button>
          <!-- PWA Features temporarily hidden
          <button 
            class="feature-button" 
            @click="$emit('open-feature', 'pwa')"
            title="PWA Features">
            📱
          </button>
          -->
          <button 
            class="feature-button" 
            @click="$emit('open-feature', 'reporting')"
            title="Professional Reporting Templates">
            📄
          </button>
          <button 
            class="feature-button" 
            @click="$emit('open-feature', 'about')"
            title="About This Project">
            ℹ️
          </button>
        </div>
        
        <!-- Language and Theme Controls -->
        <div class="control-group">
          <LanguageDropdown />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import LanguageDropdown from './LanguageDropdown.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'

export default {
  name: 'AppHeader',
  components: {
    LanguageDropdown,
    ThemeSwitcher
  },
  props: {
    showWelcome: {
      type: Boolean,
      default: true
    },
    mobileMenuOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-mobile-menu', 'open-feature', 'navigate-home']
}
</script>

<style scoped>
.header {
  background: white;
  border-bottom: 2px solid #e1e5e9;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.clickable-title {
  color: #007BFF;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.clickable-title:hover {
  color: #0056b3;
  transform: scale(1.02);
}

.header-subtitle {
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

.mobile-menu-toggle {
  display: none;
  background: #007BFF;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.2rem;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.feature-buttons {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  max-width: 400px;
  visibility: visible;
}

.feature-button {
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-button:hover {
  background: #f8f9fa;
  transform: scale(1.1);
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .header-main {
    width: 100%;
    justify-content: space-between;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .header-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .feature-buttons {
    gap: 0.2rem;
    max-width: 300px;
  }
  
  .feature-button {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
    padding: 0.3rem;
  }
  
  .clickable-title {
    font-size: 1.25rem;
  }
  
  .header-subtitle {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 0.5rem;
  }
  
  .feature-buttons {
    display: none;
  }
}
</style>
