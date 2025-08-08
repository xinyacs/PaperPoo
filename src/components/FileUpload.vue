<template>
  <div class="w-full max-w-4xl mx-auto">
    <label
      for="file-upload"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      :class="[
        'flex flex-col items-center justify-center w-full h-80 sm:h-96 lg:h-[28rem] border-2 border-dashed rounded-2xl cursor-pointer bg-gray-800/30 backdrop-blur-sm transition-all duration-300 group',
        dragOver
          ? 'border-indigo-400 bg-indigo-900/20 shadow-lg shadow-indigo-500/20 scale-[1.02]'
          : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50 hover:shadow-xl hover:scale-[1.01]'
      ]"
    >
      <div class="flex flex-col items-center justify-center pt-8 pb-8 text-center px-6">
        <div class="mb-6 transform transition-transform duration-300 group-hover:scale-110">
          <IconUpload />
        </div>
        <p class="mb-4 text-xl sm:text-2xl lg:text-3xl text-gray-300 transition-all duration-500 font-medium">
          <span class="text-white">{{ currentMessage }}</span>
        </p>
        <p class="text-sm sm:text-base lg:text-lg text-gray-500 mb-6">
          {{ $t('fileUpload.subtitle') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 text-xs sm:text-sm text-gray-600">
          <span class="flex items-center gap-2">
            {{ $t('fileUpload.supportedFormats') }}
          </span>
          <span class="flex items-center gap-2">
            {{ $t('fileUpload.maxSize') }}
          </span>
          <span class="flex items-center gap-2">
            🔒 {{ $t('fileUpload.secureUpload') }}
          </span>
        </div>
      </div>
      <input
        id="file-upload"
        type="file"
        class="hidden"
        accept=".pdf,.docx,.doc"
        @change="handleInputChange"
        :disabled="isLoading"
      />
    </label>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconUpload from './icons/IconUpload.vue'

export default {
  name: 'FileUpload',
  components: {
    IconUpload
  },
  props: {
    isLoading: {
      type: Boolean,
      required: true
    }
  },
  emits: ['file-upload'],
  setup(_, { emit }) {
    const { t } = useI18n()
    const dragOver = ref(false)
    const currentMessageIndex = ref(0)

    const UPLOAD_MESSAGES = computed(() => [
      t('fileUpload.messages.ready'),
      t('fileUpload.messages.masterpiece'),
      t('fileUpload.messages.drop'),
    ])

    const currentMessage = computed(() => UPLOAD_MESSAGES.value[currentMessageIndex.value])

    let messageInterval = null

    onMounted(() => {
      messageInterval = setInterval(() => {
        currentMessageIndex.value = (currentMessageIndex.value + 1) % UPLOAD_MESSAGES.value.length
      }, 3000)
    })

    onUnmounted(() => {
      if (messageInterval) {
        clearInterval(messageInterval)
      }
    })

    const handleFile = (file) => {
      if (file) {
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
          'text/plain' // Keep text support for testing
        ]

        if (allowedTypes.includes(file.type)) {
          // For PDF and DOCX files, pass the file object directly
          // For text files, read the content
          // Pass the file object directly for all supported file types
          emit('file-upload', file)
        } else {
          alert("Please upload a PDF, DOCX, or text file.")
        }
      }
    }

    const handleDrop = (event) => {
      event.preventDefault()
      event.stopPropagation()
      dragOver.value = false
      if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
        handleFile(event.dataTransfer.files[0])
      }
    }

    const handleDragOver = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }

    const handleDragEnter = (event) => {
      event.preventDefault()
      event.stopPropagation()
      dragOver.value = true
    }

    const handleDragLeave = (event) => {
      event.preventDefault()
      event.stopPropagation()
      dragOver.value = false
    }

    const handleInputChange = (event) => {
      const target = event.target
      if (target.files && target.files[0]) {
        handleFile(target.files[0])
      }
    }

    return {
      dragOver,
      currentMessage,
      handleDrop,
      handleDragOver,
      handleDragEnter,
      handleDragLeave,
      handleInputChange
    }
  }
}
</script>
