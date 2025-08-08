<template>
  <div
    class="min-h-screen bg-gray-900 text-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12"
    :style="backgroundStyle"
  >
    <!-- 语言切换组件 -->
    <LanguageSwitcher />

    <div class="container mx-auto max-w-7xl">
      <header class="text-center mb-8 sm:mb-12 lg:mb-16">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 to-indigo-400 leading-tight">
          {{ $t('header.title.result') }}
        </h1>
        <p class="text-gray-400 mt-3 sm:mt-4 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
          {{ $t('header.subtitle.result') }}
        </p>
      </header>

      <main class="max-w-6xl mx-auto animate-fade-in-up">
        <!-- 处理中状态 -->
        <LoadingProgress
          v-if="isProcessing"
          :title="$t('loading.analyzing')"
          :subtitle="$t('loading.subtitle.result')"
          :show-progress-bar="true"
          :auto-progress="true"
          :progress-duration="30000"
        />

        <!-- 普通加载状态 -->
        <LoadingProgress
          v-else-if="isLoading"
          :title="$t('loading.loadingResult')"
          :subtitle="$t('loading.subtitle.result')"
        />

        <!-- 错误状态 -->
        <div v-else-if="error" class="text-center bg-red-900/50 border border-red-500/50 text-red-200 p-6 sm:p-8 rounded-xl max-w-lg mx-auto">
          <h3 class="font-bold text-xl sm:text-2xl mb-4">{{ $t('error.title') }}</h3>
          <p class="mb-6 text-base sm:text-lg">{{ error }}</p>
          <div class="space-y-4">
            <button
              @click="loadResult"
              class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg transition-colors text-base sm:text-lg"
            >
              {{ $t('error.retry') }}
            </button>
            <button
              @click="goHome"
              class="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg transition-colors text-base sm:text-lg"
            >
              {{ $t('buttons.backToHome') }}
            </button>
          </div>
        </div>

        <!-- 分析结果 -->
        <div v-else-if="analysisResult">
          <div ref="resultsRef" class="space-y-6 sm:space-y-8 lg:space-y-10 bg-gray-900/80 backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-2xl border border-gray-700/50">
            <!-- 摘要 -->
            <ResultCard :title="analysisResult.summary.title">
              <template #icon>
                <IconSummary />
              </template>
              <p class="text-base sm:text-lg leading-relaxed">{{ analysisResult.summary.text }}</p>
            </ResultCard>

            <!-- 分数卡片 -->
            <ScoreCard :data="analysisResult.score" />

            <!-- 致命罪状清单 -->
            <ResultCard :title="analysisResult.majorProblems.title">
              <template #icon>
                <IconProblems />
              </template>
              <ul class="list-disc list-inside space-y-3 text-base sm:text-lg">
                <li v-for="(problem, index) in analysisResult.majorProblems.problems" :key="index" class="leading-relaxed">
                  {{ problem }}
                </li>
              </ul>
            </ResultCard>

            <ResultCard :title="analysisResult.suggestions.title" class-name="lg:col-span-2">
              <template #icon>
                <IconSuggestions />
              </template>
              <ul class="list-decimal list-inside space-y-3 text-base sm:text-lg">
                <li v-for="(tip, index) in analysisResult.suggestions.tips" :key="index" class="leading-relaxed">
                  {{ tip }}
                </li>
              </ul>
            </ResultCard>
          </div>

          <!-- 操作按钮 -->
          <div class="text-center pt-8 sm:pt-10 lg:pt-12 space-y-6 sm:space-y-8">
            <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <button
                @click="() => handleExport('png')"
                class="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-8 sm:py-4 sm:px-10 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-wait text-base sm:text-lg shadow-md hover:shadow-lg"
                :disabled="isExporting"
              >
                {{ isExporting ? $t('loading.exporting') : $t('buttons.exportImage') }}
              </button>
              <button
                @click="() => handleExport('pdf')"
                class="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-8 sm:py-4 sm:px-10 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-wait text-base sm:text-lg shadow-md hover:shadow-lg"
                :disabled="isExporting"
              >
                {{ isExporting ? $t('loading.exporting') : $t('buttons.exportPdf') }}
              </button>
              <button
                @click="goHome"
                class="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-xl transition-all duration-300 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {{ $t('buttons.backToHome') }}
              </button>
            </div>
          </div>
        </div>

        <!-- 无结果状态 -->
        <div v-else class="text-center text-gray-400 py-12 sm:py-16 lg:py-20">
          <p class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6">
            {{ $t('result.notFound') }}
          </p>
          <button
            @click="goHome"
            class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-10 sm:py-5 sm:px-12 rounded-xl transition-all duration-300 text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {{ $t('buttons.backToHome') }}
          </button>
        </div>
      </main>

      <footer class="text-center mt-16 sm:mt-20 lg:mt-24 text-gray-500 text-sm sm:text-base">
        <p class="mb-2">{{ $t('footer.powered') }}</p>
        <p class="text-xs sm:text-sm text-gray-600">{{ $t('footer.made') }}</p>
      </footer>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import LoadingProgress from '../components/LoadingProgress.vue'
import { getAnalysisResult } from '../services/apiService.js'
import { useAnalysisStore } from '../stores/analysisStore.js'
import ResultCard from '../components/ResultCard.vue'
import ScoreCard from '../components/ScoreCard.vue'
import IconSummary from '../components/icons/IconSummary.vue'
import IconProblems from '../components/icons/IconProblems.vue'
import IconSuggestions from '../components/icons/IconSuggestions.vue'

export default {
  name: 'ResultView',
  components: {
    LanguageSwitcher,
    LoadingProgress,
    ResultCard,
    ScoreCard,
    IconSummary,
    IconProblems,
    IconSuggestions
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const analysisStore = useAnalysisStore()

    const analysisResult = ref(null)
    const isLoading = ref(false)
    const isExporting = ref(false)
    const error = ref(null)
    const resultsRef = ref(null)
    const pollingInterval = ref(null)
    const isProcessing = ref(false) // 区分是否正在处理中

    const backgroundStyle = computed(() => ({
      backgroundImage: 'radial-gradient(circle at top right, rgba(121, 69, 237, 0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(49, 130, 206, 0.15), transparent 50%)'
    }))

    const startPolling = () => {
      const pollForResult = async () => {
        try {
          const hash = route.params.hash
          console.log('Polling for result with hash:', hash)
          const result = await getAnalysisResult(hash)

          console.log('Polling result:', result)

          // 检查是否仍在处理中
          if (result && result.status === 'PROCESSING') {
            console.log('Analysis still processing:', result.message)
            return // 继续轮询
          }

          // 检查是否有错误
          if (result && result.status === 'ERROR') {
            console.error('Analysis failed:', result.message)
            error.value = result.message || t('error.analysisError')
            isLoading.value = false
            isProcessing.value = false
            if (pollingInterval.value) {
              clearInterval(pollingInterval.value)
              pollingInterval.value = null
            }
            return
          }

          // 检查是否有完整结果
          if (result && result.summary && result.score) {
            console.log('Analysis completed successfully')

            // 转换服务器响应数据结构以匹配前端期望
            const transformedResult = {
              summary: result.summary,
              score: result.score,
              majorProblems: result.major_problems ? {
                title: result.major_problems.title,
                problems: result.major_problems.problems
              } : { title: t('result.problems'), problems: [] },
              suggestions: result.suggestions ? {
                title: result.suggestions.title,
                tips: result.suggestions.tips
              } : { title: t('result.suggestions'), tips: [] }
            }

            // 缓存结果
            const hash = route.params.hash
            analysisStore.setAnalysisResult(hash, transformedResult)

            analysisResult.value = transformedResult
            isLoading.value = false
            isProcessing.value = false

            // 停止轮询
            if (pollingInterval.value) {
              clearInterval(pollingInterval.value)
              pollingInterval.value = null
            }
          } else {
            console.log('Result not ready yet, continuing to poll...')
          }
        } catch (err) {
          console.error('Polling error:', err)
          // 如果是404或类似错误，可能是hash不存在
          if (err.message && err.message.includes('404')) {
            error.value = t('error.resultNotFound')
            isLoading.value = false
            isProcessing.value = false
            if (pollingInterval.value) {
              clearInterval(pollingInterval.value)
              pollingInterval.value = null
            }
          }
          // 其他错误继续轮询，可能是网络问题
        }
      }

      // 立即执行一次
      pollForResult()

      // 然后每3秒轮询一次
      pollingInterval.value = setInterval(pollForResult, 3000)
    }

    const loadResult = async () => {
      const hash = route.params.hash
      if (!hash) {
        error.value = t('error.invalidHash')
        return
      }

      // 首先检查缓存中是否有结果
      const cachedResult = analysisStore.getAnalysisResult(hash)
      if (cachedResult) {
        console.log('Loading result from cache for hash:', hash)
        analysisResult.value = cachedResult
        isLoading.value = false
        isProcessing.value = false
        return
      }

      // 如果已经有结果且 hash 相同，不需要重新加载
      if (analysisResult.value && route.params.hash === hash) {
        console.log('Result already loaded for this hash')
        return
      }

      isLoading.value = true
      isProcessing.value = true
      error.value = null
      analysisResult.value = null

      try {
        console.log('Loading result for hash:', hash)
        const result = await getAnalysisResult(hash)

        if (result && result.summary && result.score) {
          // 结果已经准备好了
          const transformedResult = {
            summary: result.summary,
            score: result.score,
            majorProblems: result.major_problems ? {
              title: result.major_problems.title,
              problems: result.major_problems.problems
            } : { title: t('result.problems'), problems: [] },
            suggestions: result.suggestions ? {
              title: result.suggestions.title,
              tips: result.suggestions.tips
            } : { title: t('result.suggestions'), tips: [] }
          }

          // 缓存结果
          analysisStore.setAnalysisResult(hash, transformedResult)

          analysisResult.value = transformedResult
          isLoading.value = false
          isProcessing.value = false
        } else if (result && result.status === 'PROCESSING') {
          // 仍在处理中，开始轮询
          console.log('Analysis still processing, starting polling...')
          startPolling()
        } else {
          // 开始轮询，可能结果还没准备好
          console.log('Result not immediately available, starting polling...')
          startPolling()
        }
      } catch (e) {
        console.error('Error loading result:', e)
        if (e.message && e.message.includes('404')) {
          error.value = t('error.resultNotFound')
          isLoading.value = false
          isProcessing.value = false
        } else {
          // 可能是网络错误，尝试轮询
          console.log('Network error, starting polling...')
          startPolling()
        }
      }
    }

    const handleExport = async (format) => {
      if (!resultsRef.value || !analysisResult.value) return

      isExporting.value = true
      const elementToCapture = resultsRef.value

      try {
        const canvas = await html2canvas(elementToCapture, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#111827', // bg-gray-900
        })

        if (format === 'png') {
          const image = canvas.toDataURL('image/png', 1.0)
          const link = document.createElement('a')
          link.href = image
          link.download = `paper-analysis-${Date.now()}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else { // pdf
          const imgData = canvas.toDataURL('image/png')
          const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
          })
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
          pdf.save(`paper-analysis-${Date.now()}.pdf`)
        }
      } catch (e) {
        console.error('Export error:', e)
        error.value = t('error.export')
      } finally {
        isExporting.value = false
      }
    }

    const goHome = () => {
      const savedLocale = localStorage.getItem('locale')
      if (savedLocale === 'zh') {
        router.push('/cn')
      } else {
        router.push('/en')
      }
    }

    // 监听路由参数变化
    watch(() => route.params.hash, (newHash, oldHash) => {
      if (newHash && newHash !== oldHash) {
        console.log('Route hash changed, reloading result:', newHash)
        loadResult()
      }
    })

    onMounted(() => {
      loadResult()
    })

    // 清理函数
    onUnmounted(() => {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
        pollingInterval.value = null
      }
    })

    return {
      analysisResult,
      isLoading,
      isProcessing,
      isExporting,
      error,
      resultsRef,
      backgroundStyle,
      loadResult,
      handleExport,
      goHome
    }
  }
}
</script>
