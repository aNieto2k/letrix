<template>
  <div class="glass-effect rounded-2xl p-4 mb-4">
    <div class="flex items-center justify-between mb-2">
      <span class="text-white text-sm">Progreso</span>
      <span class="text-white/80 text-xs">{{ foundWords.length }} / {{ allWords.length }}</span>
    </div>
    <div class="w-full bg-white/20 rounded-full h-3 overflow-hidden">
      <div 
        class="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500"
        :style="{ width: `${progressPercentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ProgressBar',
  props: {
    foundWords: {
      type: Array,
      required: true
    },
    allWords: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const progressPercentage = computed(() => {
      if (props.allWords.length === 0) return 0
      return Math.round((props.foundWords.length / props.allWords.length) * 100)
    })

    return { progressPercentage }
  }
}
</script>


