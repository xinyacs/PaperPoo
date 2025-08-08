<template>
  <div class="fixed top-4 right-4 z-50">
    <div class="relative">
      <button
        @click="toggleDropdown"
        class="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 text-white px-4 py-2 rounded-lg transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50 shadow-lg"
      >
        <span class="text-sm font-medium">{{ currentLanguageDisplay }}</span>
        <svg 
          :class="['w-4 h-4 transition-transform duration-200', isOpen ? 'rotate-180' : '']"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      <div 
        v-show="isOpen"
        class="absolute top-full right-0 mt-2 w-40 bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-lg shadow-xl overflow-hidden"
      >
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="switchLanguage(lang.code)"
          :class="[
            'w-full text-left px-4 py-3 text-sm transition-colors duration-200 flex items-center gap-3',
            currentLocale === lang.code 
              ? 'bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-400' 
              : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
          ]"
        >
          <span class="text-lg">{{ lang.flag }}</span>
          <span class="font-medium">{{ lang.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export default {
  name: 'LanguageSwitcher',
  setup() {
    const { locale, t } = useI18n()
    const router = useRouter()
    const isOpen = ref(false)
    
    const languages = [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'zh', name: '中文', flag: '🇨🇳' }
    ]
    
    const currentLocale = computed(() => locale.value)
    
    const currentLanguageDisplay = computed(() => {
      const lang = languages.find(l => l.code === currentLocale.value)
      return lang ? `${lang.flag} ${lang.name}` : '🇺🇸 English'
    })
    
    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }
    
    const switchLanguage = (langCode) => {
      if (langCode === currentLocale.value) {
        isOpen.value = false
        return
      }
      
      // 保存语言设置到localStorage
      localStorage.setItem('locale', langCode)
      
      // 更新i18n locale
      locale.value = langCode
      
      // 更新URL路径
      const currentPath = router.currentRoute.value.path
      let newPath = currentPath
      
      // 移除现有的语言前缀
      if (currentPath.startsWith('/en/') || currentPath.startsWith('/cn/')) {
        newPath = currentPath.substring(3) || '/'
      } else if (currentPath === '/en' || currentPath === '/cn') {
        newPath = '/'
      }
      
      // 添加新的语言前缀
      const langPrefix = langCode === 'zh' ? '/cn' : '/en'
      newPath = langPrefix + (newPath === '/' ? '' : newPath)
      
      // 导航到新路径
      router.push(newPath)
      
      isOpen.value = false
    }
    
    const closeDropdown = (event) => {
      if (!event.target.closest('.relative')) {
        isOpen.value = false
      }
    }
    
    onMounted(() => {
      document.addEventListener('click', closeDropdown)
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', closeDropdown)
    })
    
    return {
      isOpen,
      languages,
      currentLocale,
      currentLanguageDisplay,
      toggleDropdown,
      switchLanguage
    }
  }
}
</script>
