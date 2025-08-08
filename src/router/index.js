import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ResultView from '../views/ResultView.vue'
import i18n from '../locales/index.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 根路径重定向到默认语言（英文）
    {
      path: '/',
      redirect: () => {
        const savedLocale = localStorage.getItem('locale')

        // 如果有保存的语言偏好，使用它；否则默认英文
        if (savedLocale && savedLocale === 'zh') {
          return '/cn'
        }

        return '/en'
      }
    },
    // 结果页面路由 - 支持 /{locale}/result=hash 格式
    {
      path: '/en/result=:hash',
      name: 'result-en',
      component: ResultView,
      beforeEnter: (_, __, next) => {
        i18n.global.locale.value = 'en'
        localStorage.setItem('locale', 'en')
        next()
      }
    },
    {
      path: '/cn/result=:hash',
      name: 'result-zh',
      component: ResultView,
      beforeEnter: (_, __, next) => {
        i18n.global.locale.value = 'zh'
        localStorage.setItem('locale', 'zh')
        next()
      }
    },
    // 兼容旧的结果页面路由 - 重定向到默认语言
    {
      path: '/result=:hash',
      redirect: (to) => {
        const savedLocale = localStorage.getItem('locale')
        const locale = savedLocale === 'zh' ? 'cn' : 'en'
        return `/${locale}/result=${to.params.hash}`
      }
    },
    // 英文路由
    {
      path: '/en',
      name: 'home-en',
      component: HomeView,
      beforeEnter: (_, __, next) => {
        i18n.global.locale.value = 'en'
        localStorage.setItem('locale', 'en')
        next()
      }
    },
    {
      path: '/en/about',
      name: 'about-en',
      component: () => import('../views/AboutView.vue'),
      beforeEnter: (_, __, next) => {
        i18n.global.locale.value = 'en'
        localStorage.setItem('locale', 'en')
        next()
      }
    },
    // 中文路由
    {
      path: '/cn',
      name: 'home-zh',
      component: HomeView,
      beforeEnter: (_, __, next) => {
        i18n.global.locale.value = 'zh'
        localStorage.setItem('locale', 'zh')
        next()
      }
    },
    {
      path: '/cn/about',
      name: 'about-zh',
      component: () => import('../views/AboutView.vue'),
      beforeEnter: (_, __, next) => {
        i18n.global.locale.value = 'zh'
        localStorage.setItem('locale', 'zh')
        next()
      }
    },
    // 捕获所有未匹配的路由
    {
      path: '/:pathMatch(.*)*',
      redirect: '/en'
    }
  ],
})

export default router
