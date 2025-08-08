<template>
  <ResultCard :title="data.title" class-name="col-span-1 lg:col-span-2">
    <template #icon>
      <IconScore />
    </template>

    <div class="bg-gradient-to-r from-red-900/30 to-pink-900/30 border border-red-500/40 p-6 sm:p-8 lg:p-10 rounded-xl mb-8 sm:mb-10 backdrop-blur-sm">
      <h4 class="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-red-300 mb-6">
        Overall Score: {{ averageScore.toFixed(1) }}/5.0
      </h4>
      <div class="flex justify-center mb-4">
        <div class="flex space-x-1">
          <span v-for="star in 5" :key="star" class="text-3xl sm:text-4xl">
            <span v-if="star <= Math.floor(averageScore)" class="text-yellow-400">★</span>
            <span v-else-if="star === Math.ceil(averageScore) && averageScore % 1 !== 0" class="text-yellow-400">☆</span>
            <span v-else class="text-gray-600">☆</span>
          </span>
        </div>
      </div>
      <div class="text-center text-red-200 italic text-base sm:text-lg lg:text-xl leading-relaxed max-w-4xl mx-auto">
        <p class="whitespace-pre-wrap break-words">"{{ data.overall.comment }}"</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
      <ScoreBar
        :label="$t('score.labels.fluff')"
        :value="data.fluff_score ? data.fluff_score.value : (data.creativity ? data.creativity.value : 0)"
        :max="5"
        :comment="data.fluff_score ? data.fluff_score.comment : (data.creativity ? data.creativity.comment : $t('result.notFound'))"
        :colorClass="'bg-purple-500 text-purple-300'"
      />
      <ScoreBar
        :label="$t('score.labels.fabrication')"
        :value="data.fabrication_score ? data.fabrication_score.value : (data.grammar ? data.grammar.value : 0)"
        :max="5"
        :comment="data.fabrication_score ? data.fabrication_score.comment : (data.grammar ? data.grammar.comment : $t('result.notFound'))"
        :colorClass="'bg-blue-500 text-blue-300'"
      />
      <ScoreBar
        :label="$t('score.labels.logic')"
        :value="data.brain_off_score ? data.brain_off_score.value : (data.structure ? data.structure.value : 0)"
        :max="5"
        :comment="data.brain_off_score ? data.brain_off_score.comment : (data.structure ? data.structure.comment : $t('result.notFound'))"
        :colorClass="'bg-orange-500 text-orange-300'"
      />
      <ScoreBar
        :label="$t('score.labels.writing')"
        :value="data.writing_disaster_score ? data.writing_disaster_score.value : (data.writing ? data.writing.value : 0)"
        :max="5"
        :comment="data.writing_disaster_score ? data.writing_disaster_score.comment : (data.writing ? data.writing.comment : $t('result.notFound'))"
        :colorClass="'bg-red-500 text-red-300'"
      />
    </div>
  </ResultCard>
</template>

<script>
import { computed } from 'vue'
import ResultCard from './ResultCard.vue'
import IconScore from './icons/IconScore.vue'
import ScoreBar from './ScoreBar.vue'

export default {
  name: 'ScoreCard',
  components: {
    ResultCard,
    IconScore,
    ScoreBar
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const averageScore = computed(() => {
      const scores = []

      // 收集所有分数
      if (props.data.fluff_score?.value) scores.push(props.data.fluff_score.value)
      if (props.data.fabrication_score?.value) scores.push(props.data.fabrication_score.value)
      if (props.data.brain_off_score?.value) scores.push(props.data.brain_off_score.value)
      if (props.data.writing_disaster_score?.value) scores.push(props.data.writing_disaster_score.value)

      // 如果没有新格式的分数，尝试旧格式
      if (scores.length === 0) {
        if (props.data.creativity?.value) scores.push(props.data.creativity.value)
        if (props.data.grammar?.value) scores.push(props.data.grammar.value)
        if (props.data.structure?.value) scores.push(props.data.structure.value)
        if (props.data.writing?.value) scores.push(props.data.writing.value)
      }

      // 计算平均值
      return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0
    })

    return {
      averageScore
    }
  }
}
</script>
