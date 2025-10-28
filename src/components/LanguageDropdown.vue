<template>
  <div class="language-dropdown">
    <button 
      class="dropdown-toggle"
      @click="toggleDropdown"
      :title="currentLanguageName">
      {{ currentLanguageFlag }} {{ currentLanguageCode }}
      <span class="dropdown-arrow" :class="{ open: isOpen }">▼</span>
    </button>
    
    <div v-if="isOpen" class="dropdown-menu">
      <button 
        v-for="lang in languages" 
        :key="lang.code"
        @click="setLanguage(lang.code)"
        :class="{ active: currentLocale === lang.code }"
        class="dropdown-item">
        {{ lang.flag }} {{ lang.name }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'LanguageDropdown',
  setup() {
    const { locale } = useI18n()
    const isOpen = ref(false)
    
    const languages = [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
      { code: 'ar', name: 'العربية', flag: '🇸🇦' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ]
    
    const currentLocale = computed(() => locale.value)
    
    const currentLanguage = computed(() => 
      languages.find(lang => lang.code === currentLocale.value) || languages[0]
    )
    
    const currentLanguageCode = computed(() => currentLanguage.value.code.toUpperCase())
    const currentLanguageName = computed(() => currentLanguage.value.name)
    const currentLanguageFlag = computed(() => currentLanguage.value.flag)
    
    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }
    
    const setLanguage = (lang) => {
      locale.value = lang
      localStorage.setItem('preferred-language', lang)
      isOpen.value = false
      
      // Update document direction for RTL languages
      if (lang === 'ar' || lang === 'fa') {
        document.documentElement.dir = 'rtl'
        document.documentElement.lang = lang
      } else {
        document.documentElement.dir = 'ltr'
        document.documentElement.lang = lang
      }
    }
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.language-dropdown')) {
        isOpen.value = false
      }
    }
    
    // Add event listener on mount
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })
    
    return {
      isOpen,
      languages,
      currentLocale,
      currentLanguageCode,
      currentLanguageName,
      currentLanguageFlag,
      toggleDropdown,
      setLanguage
    }
  }
}
</script>

<style scoped>
.language-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  background: #F8F9FA;
  border: 2px solid #E9ECEF;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
}

.dropdown-toggle:hover {
  background: #007BFF;
  color: white;
  border-color: #007BFF;
}

.dropdown-arrow {
  font-size: 0.6rem;
  transition: transform 0.2s ease;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #E9ECEF;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 4px;
  overflow: hidden;
}

.dropdown-item {
  width: 100%;
  background: none;
  border: none;
  padding: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dropdown-item:hover {
  background: #F8F9FA;
}

.dropdown-item.active {
  background: #007BFF;
  color: white;
}

.dropdown-item.active:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .dropdown-toggle {
    padding: 0.4rem 0.6rem;
    font-size: 0.7rem;
    min-width: 70px;
  }
  
  .dropdown-item {
    padding: 0.6rem;
    font-size: 0.7rem;
  }
}
</style>
