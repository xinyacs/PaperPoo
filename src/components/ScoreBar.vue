<template>
  <div class="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
    <div class="flex justify-between items-center mb-3 sm:mb-4">
      <span class="font-semibold text-gray-200 text-base sm:text-lg">{{ label }}</span>
      <div class="flex space-x-1">
        <span v-for="star in max" :key="star" class="text-xl sm:text-2xl">
          <span v-if="star <= value" :class="textColorClass">★</span>
          <span v-else class="text-gray-600">☆</span>
        </span>
      </div>
    </div>
    <div class="text-sm sm:text-base text-gray-400 italic leading-relaxed">
      <p class="whitespace-pre-wrap break-words">"{{ comment }}"</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScoreBar',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    colorClass: {
      type: String,
      required: true
    }
  },
  computed: {
    textColorClass() {
      // 从 colorClass 中提取文本颜色类
      const classes = this.colorClass.split(' ')
      return classes.find(cls => cls.startsWith('text-')) || 'text-yellow-400'
    }
  }
}
</script>
