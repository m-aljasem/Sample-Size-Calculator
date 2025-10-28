<template>
  <div class="language-switcher">
    <button 
      class="language-button"
      :class="{ active: currentLocale === 'en' }"
      @click="setLanguage('en')"
      title="English">
      🇺🇸 EN
    </button>
    <button 
      class="language-button"
      :class="{ active: currentLocale === 'fa' }"
      @click="setLanguage('fa')"
      title="فارسی">
      🇮🇷 FA
    </button>
    <button 
      class="language-button"
      :class="{ active: currentLocale === 'ar' }"
      @click="setLanguage('ar')"
      title="العربية">
      🇸🇦 AR
    </button>
    <button 
      class="language-button"
      :class="{ active: currentLocale === 'fr' }"
      @click="setLanguage('fr')"
      title="Français">
      🇫🇷 FR
    </button>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'LanguageSwitcher',
  setup() {
    const { locale } = useI18n()
    
    const setLanguage = (lang) => {
      locale.value = lang
      localStorage.setItem('preferred-language', lang)
      
      // Update document direction for RTL languages
      if (lang === 'ar' || lang === 'fa') {
        document.documentElement.dir = 'rtl'
        document.documentElement.lang = lang
      } else {
        document.documentElement.dir = 'ltr'
        document.documentElement.lang = lang
      }
    }
    
    return {
      currentLocale: locale,
      setLanguage
    }
  }
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.language-button {
  background: #F8F9FA;
  border: 2px solid #E9ECEF;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.language-button:hover {
  background: #007BFF;
  color: white;
  border-color: #007BFF;
}

.language-button.active {
  background: #007BFF;
  color: white;
  border-color: #007BFF;
}

@media (max-width: 768px) {
  .language-switcher {
    margin-left: 0;
    margin-top: 1rem;
    justify-content: center;
  }
}
</style>
