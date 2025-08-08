<template>
  <div
    :class="[
      'bg-gray-800/70 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl transition-all duration-300 hover:border-gray-500/70 hover:shadow-2xl hover:bg-gray-800/80 group',
      className
    ]"
  >
    <div class="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div class="transform transition-transform duration-300 group-hover:scale-110">
        <slot name="icon"></slot>
      </div>
      <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-wide">{{ title }}</h3>
    </div>
    <div class="text-gray-300 space-y-4 sm:space-y-5 leading-relaxed text-base sm:text-lg">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultCard',
  props: {
    title: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  }
}
</script>
