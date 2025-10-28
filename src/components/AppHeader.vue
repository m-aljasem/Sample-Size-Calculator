<template>
  <header class="header">
    <div class="header-content">
      <div class="header-main">
        <h1>🧬 {{ $t('app.title') }}</h1>
        <div class="header-subtitle">{{ $t('app.subtitle') }}</div>
        <button 
          class="mobile-menu-toggle" 
          @click="$emit('toggle-mobile-menu')" 
          v-if="!showWelcome">
          {{ mobileMenuOpen ? $t('app.navigation.closeMenu') : $t('app.navigation.showCalculators') }}
        </button>
      </div>
      <div class="header-controls">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </div>
  </header>
</template>

<script>
import LanguageSwitcher from './LanguageSwitcher.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'

export default {
  name: 'AppHeader',
  components: {
    LanguageSwitcher,
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
  emits: ['toggle-mobile-menu']
}
</script>
