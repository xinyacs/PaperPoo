<template>
  <div class="text-center text-white py-12 sm:py-16 lg:py-20">
    <div class="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-b-4 border-indigo-400 mx-auto mb-6"></div>
    <p class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3">
      {{ title }}
    </p>
    <p class="text-gray-400 text-base sm:text-lg lg:text-xl max-w-md mx-auto">
      {{ subtitle }}
    </p>
    
    <!-- 可选的进度条 -->
    <div v-if="showProgressBar" class="mt-8 max-w-md mx-auto">
      <div class="bg-gray-700 rounded-full h-2 overflow-hidden">
        <div 
          class="bg-gradient-to-r from-indigo-400 to-purple-400 h-full rounded-full transition-all duration-1000 ease-out"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
      <p class="text-sm text-gray-500 mt-2">{{ progressText }}</p>
    </div>

    <!-- 可选的取消按钮 -->
    <div v-if="showCancelButton" class="mt-8">
      <button
        @click="$emit('cancel')"
        class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors text-sm"
      >
        {{ cancelText || $t('buttons.cancel') }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'LoadingProgress',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    showProgressBar: {
      type: Boolean,
      default: false
    },
    showCancelButton: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: ''
    },
    autoProgress: {
      type: Boolean,
      default: false
    },
    progressDuration: {
      type: Number,
      default: 30000 // 30秒
    }
  },
  emits: ['cancel'],
  setup(props) {
    const { t } = useI18n()
    const progress = ref(0)
    const progressInterval = ref(null)

    const progressText = computed(() => {
      if (progress.value < 30) {
        return t('loading.progress.analyzing')
      } else if (progress.value < 60) {
        return t('loading.progress.processing')
      } else if (progress.value < 90) {
        return t('loading.progress.finalizing')
      } else {
        return t('loading.progress.almostDone')
      }
    })

    onMounted(() => {
      if (props.autoProgress && props.showProgressBar) {
        // 模拟进度条，但不会到达100%，因为我们不知道实际完成时间
        const increment = 85 / (props.progressDuration / 1000) // 85%分布在指定时间内
        progressInterval.value = setInterval(() => {
          if (progress.value < 85) {
            progress.value += increment
          }
        }, 1000)
      }
    })

    onUnmounted(() => {
      if (progressInterval.value) {
        clearInterval(progressInterval.value)
      }
    })

    return {
      progress,
      progressText,
      t
    }
  }
}
</script>
