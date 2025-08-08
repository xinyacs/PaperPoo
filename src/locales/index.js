import { createI18n } from 'vue-i18n'
import en from './en.js'
import zh from './zh.js'

// 从URL或localStorage获取语言设置
function getInitialLocale() {
  // 首先检查URL路径
  const path = window.location.pathname
  if (path.startsWith('/cn/') || path.startsWith('/cn')) {
    return 'zh'
  }
  if (path.startsWith('/en/') || path.startsWith('/en')) {
    return 'en'
  }

  // 然后检查localStorage
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale && ['en', 'zh'].includes(savedLocale)) {
    return savedLocale
  }

  // 默认始终为英文，不依赖浏览器语言
  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})

export default i18n
