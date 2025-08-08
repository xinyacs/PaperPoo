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
          {{ headerText }}
        </h1>
        <p class="text-gray-400 mt-3 sm:mt-4 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">{{ subHeaderText }}</p>
      </header>

      <main class="max-w-6xl mx-auto animate-fade-in-up">
        <LoadingProgress
          v-if="isLoading && !analysisResult"
          :title="isSeriousMode ? $t('loading.analyzing') : $t('loading.sharpening')"
          :subtitle="isSeriousMode ? $t('loading.subtitle.serious') : $t('loading.subtitle.roast')"
          :show-progress-bar="true"
          :auto-progress="true"
          :progress-duration="30000"
        />

        <div v-else-if="error" class="text-center bg-red-900/50 border border-red-500/50 text-red-200 p-6 sm:p-8 rounded-xl max-w-lg mx-auto">
          <h3 class="font-bold text-xl sm:text-2xl mb-4">{{ $t('error.title') }}</h3>
          <p class="mb-6 text-base sm:text-lg">{{ error }}</p>
          <button
            @click="handleReset"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg transition-colors text-base sm:text-lg"
          >
            {{ $t('error.tryAgain') }}
          </button>
        </div>

        <div v-else-if="analysisResult">
          <div ref="resultsRef" class="space-y-6 sm:space-y-8 lg:space-y-10 bg-gray-900/80 backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-2xl border border-gray-700/50">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
              <ResultCard :title="analysisResult.summary.title" class-name="lg:col-span-1">
                <template #icon>
                  <IconSummary />
                </template>
                <p class="text-base sm:text-lg leading-relaxed">{{ analysisResult.summary.text }}</p>
              </ResultCard>

              <ResultCard :title="analysisResult.majorProblems.title" class-name="lg:col-span-1">
                <template #icon>
                  <IconProblems />
                </template>
                <ul class="space-y-3 sm:space-y-4">
                  <li v-for="(problem, index) in analysisResult.majorProblems.problems" :key="index" class="flex items-start space-x-3">
                    <span class="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full mt-2.5 sm:mt-3"></span>
                    <span class="text-base sm:text-lg leading-relaxed">{{ problem }}</span>
                  </li>
                </ul>
              </ResultCard>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
              <ScoreCard :data="analysisResult.score" />

              <ResultCard :title="analysisResult.suggestions.title" class-name="lg:col-span-1">
                <template #icon>
                  <IconSuggestions />
                </template>
                <ul class="space-y-3 sm:space-y-4">
                  <li v-for="(tip, index) in analysisResult.suggestions.tips" :key="index" class="flex items-start space-x-3">
                    <span class="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2.5 sm:mt-3"></span>
                    <span class="text-base sm:text-lg leading-relaxed">{{ tip }}</span>
                  </li>
                </ul>
              </ResultCard>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-6 sm:pt-8 lg:pt-10">
              <button
                @click="handleExport"
                class="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-8 sm:py-4 sm:px-10 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-wait text-base sm:text-lg shadow-md hover:shadow-lg"
                :disabled="isExporting"
              >
                {{ isExporting ? $t('loading.exporting') : $t('buttons.exportPdf') }}
              </button>
              <button
                @click="handleShare"
                class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 sm:py-4 sm:px-10 rounded-xl transition-all duration-300 text-base sm:text-lg shadow-md hover:shadow-lg"
              >
                {{ $t('buttons.share') }}
              </button>
              <button
                @click="handleReset"
                class="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-xl transition-all duration-300 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {{ $t('buttons.analyzeAnother') }}
              </button>
            </div>
          </div>
        </div>

        <div v-else>
          <!-- 模式切换器 -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-10 sm:mb-12 lg:mb-16">
            <span :class="['font-semibold text-lg sm:text-xl transition-colors', !isSeriousMode ? 'text-white' : 'text-gray-500']">
              {{ $t('modes.roast') }}
            </span>
            <label for="mode-toggle" class="flex items-center cursor-pointer group">
              <div class="relative">
                <input
                  type="checkbox"
                  id="mode-toggle"
                  class="sr-only"
                  v-model="isSeriousMode"
                />
                <div class="block bg-gray-700 w-16 h-9 sm:w-18 sm:h-10 rounded-full transition-colors group-hover:bg-gray-600"></div>
                <div :class="[
                  'dot absolute left-1 top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-300 shadow-lg',
                  isSeriousMode ? 'transform translate-x-7 sm:translate-x-8 bg-red-500 shadow-red-500/50' : 'bg-indigo-400 shadow-indigo-400/50'
                ]"></div>
              </div>
            </label>
            <span :class="['font-semibold text-lg sm:text-xl transition-colors', isSeriousMode ? 'text-white' : 'text-gray-500']">
              {{ $t('modes.serious') }}
            </span>
          </div>

          <FileUpload
            @file-upload="handleFileUpload"
            :is-loading="isLoading"
          />
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import LoadingProgress from '../components/LoadingProgress.vue'
import FileUpload from '../components/FileUpload.vue'
import { uploadFileForAnalysis, getAnalysisResult } from '../services/apiService.js'
import { useAnalysisStore } from '../stores/analysisStore.js'
import ResultCard from '../components/ResultCard.vue'
import ScoreCard from '../components/ScoreCard.vue'
import IconSummary from '../components/icons/IconSummary.vue'
import IconProblems from '../components/icons/IconProblems.vue'
import IconSuggestions from '../components/icons/IconSuggestions.vue'

export default {
  name: 'HomeView',
  components: {
    LanguageSwitcher,
    LoadingProgress,
    FileUpload,
    ResultCard,
    ScoreCard,
    IconSummary,
    IconProblems,
    IconSuggestions
  },
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const analysisStore = useAnalysisStore()
    const analysisResult = ref(null)
    const isLoading = ref(false)
    const error = ref(null)
    const isSeriousMode = ref(false)
    const resultsRef = ref(null)
    const analysisHash = ref(null)
    const pollingInterval = ref(null)
    const isExporting = ref(false)

    const backgroundStyle = computed(() => ({
      backgroundImage: 'radial-gradient(circle at top right, rgba(121, 69, 237, 0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(49, 130, 206, 0.15), transparent 50%)'
    }))

    const headerText = computed(() =>
      isSeriousMode.value ? t('header.title.serious') : t('header.title.roast')
    )

    const subHeaderText = computed(() =>
      isSeriousMode.value ? t('header.subtitle.serious') : t('header.subtitle.roast')
    )



    const handleReset = () => {
      analysisResult.value = null
      error.value = null
      isLoading.value = false
      analysisHash.value = null
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
        pollingInterval.value = null
      }
    }

    const startPolling = () => {
      const pollForResult = async () => {
        try {
          console.log('Polling for result with hash:', analysisHash.value)
          const result = await getAnalysisResult(analysisHash.value)

          console.log('Polling result:', result) // 添加详细日志

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
            if (pollingInterval.value) {
              clearInterval(pollingInterval.value)
              pollingInterval.value = null
            }
            return
          }

          // 检查是否有结果
          if (result && result.summary && result.score) {
            console.log('Analysis completed successfully')

            // 转换并缓存结果
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

            // 缓存结果到全局状态
            analysisStore.setAnalysisResult(analysisHash.value, transformedResult)

            // 停止轮询
            if (pollingInterval.value) {
              clearInterval(pollingInterval.value)
              pollingInterval.value = null
            }

            // 导航到结果页面 - 使用 replace 而不是 push 来避免历史记录问题
            const savedLocale = localStorage.getItem('locale')
            const locale = savedLocale === 'zh' ? 'cn' : 'en'

            // 立即导航，不等待 DOM 更新
            try {
              const timer = measureNavigationTime()
              await router.replace(`/${locale}/result=${analysisHash.value}`)
              timer.end()
              console.log('Navigation completed successfully')
            } catch (navError) {
              console.error('Navigation error:', navError)
              // 如果导航失败，显示结果在当前页面
              analysisResult.value = transformedResult
              isLoading.value = false
            }
          } else {
            console.log('Result not ready yet, continuing to poll...')
          }
        } catch (err) {
          console.error('Polling error:', err)
          // 不要在轮询错误时停止，继续尝试
        }
      }

      // 立即执行一次
      pollForResult()

      // 然后每3秒轮询一次
      pollingInterval.value = setInterval(pollForResult, 3000)
    }

    const handleFileUpload = async (file) => {
      if (!file) return

      isLoading.value = true
      error.value = null
      analysisResult.value = null

      try {
        console.log('Uploading file:', file.name)

        // 获取当前语言设置
        const savedLocale = localStorage.getItem('locale')
        const locale = savedLocale === 'zh' ? 'zh' : 'en'

        const response = await uploadFileForAnalysis(file, isSeriousMode.value, locale)
        console.log('Upload response:', response)

        if (response && response.hash) {
          analysisHash.value = response.hash
          console.log('Analysis started with hash:', analysisHash.value)

          // 开始轮询结果
          startPolling()
        } else {
          throw new Error(t('error.uploadFailed'))
        }
      } catch (err) {
        console.error('Upload error:', err)
        error.value = err.message || t('error.uploadFailed')
        isLoading.value = false
      }
    }

    const handleExport = async () => {
      if (!resultsRef.value) return

      isExporting.value = true
      try {
        const canvas = await html2canvas(resultsRef.value, {
          backgroundColor: '#111827',
          scale: 2,
          useCORS: true,
          allowTaint: true
        })

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')

        const imgWidth = 210
        const pageHeight = 295
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight

        let position = 0

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }

        pdf.save('paper-analysis-result.pdf')
      } catch (e) {
        console.error('Export error:', e)
        error.value = t('error.export')
      } finally {
        isExporting.value = false
      }
    }

    const handleShare = async () => {
      if (!analysisHash.value) return

      // 获取当前语言设置
      const savedLocale = localStorage.getItem('locale')
      const locale = savedLocale === 'zh' ? 'cn' : 'en'
      const shareUrl = `${window.location.origin}/${locale}/result=${analysisHash.value}`

      if (navigator.share) {
        try {
          await navigator.share({
            title: t('share.title'),
            text: t('share.text'),
            url: shareUrl
          })
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error('Share error:', err)
            // 回退到复制链接
            await navigator.clipboard.writeText(shareUrl)
            alert(t('share.copied'))
          }
        }
      } else {
        // 回退到复制链接
        try {
          await navigator.clipboard.writeText(shareUrl)
          alert(t('share.copied'))
        } catch (err) {
          console.error('Copy error:', err)
          // 最后的回退方案
          prompt(t('share.copyManually'), shareUrl)
        }
      }
    }

    // 清理函数
    onMounted(() => {
      return () => {
        if (pollingInterval.value) {
          clearInterval(pollingInterval.value)
        }
      }
    })

    return {
      analysisResult,
      isLoading,
      error,
      isSeriousMode,
      resultsRef,
      backgroundStyle,
      headerText,
      subHeaderText,
      handleFileUpload,
      handleReset,
      handleExport,
      handleShare,
      isExporting
    }
  }
}
</script>
