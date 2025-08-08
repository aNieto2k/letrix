<template>
  <div class="mb-10">
    <!-- Progreso (se gestiona arriba con ProgressBar) -->

    <!-- Encontradas -->
    <div class="glass-effect rounded-2xl p-4 mb-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-white font-semibold">Encontradas ({{ foundWords.length }})</h3>
      </div>
      <div>
        <div v-if="foundWords.length > 0" class="grid grid-cols-2 gap-2">
          <div 
            v-for="word in sortedFoundLimited"
            :key="`found-${word}`"
            class="bg-white/15 rounded px-3 py-2 text-white text-center"
          >
            {{ word }} ({{ scoreForWord(word) }})
          </div>
        </div>
        <div v-else class="text-white/70 text-sm text-center py-2">Aún no has encontrado palabras</div>
        <div v-if="foundOverflowCount > 0" class="text-white/60 text-xs text-center mt-2">
          y {{ foundOverflowCount }} más...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { calculateScore } from '../utils/gameLogic'

export default {
  name: 'ProgressPanel',
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
    const showFound = ref(true)
    const showRemaining = ref(true)


    const remainingWords = computed(() => {
      const foundSet = new Set(props.foundWords)
      return props.allWords.filter(word => !foundSet.has(word))
    })

    const sortedFound = computed(() => [...props.foundWords].sort((a, b) => b.length - a.length))
    const sortedRemaining = computed(() => [...remainingWords.value].sort((a, b) => b.length - a.length))

    // Limitar para performance
    const LIMIT = 100
    const sortedFoundLimited = computed(() => sortedFound.value.slice(0, LIMIT))
    const sortedRemainingLimited = computed(() => sortedRemaining.value.slice(0, LIMIT))
    const foundOverflowCount = computed(() => Math.max(sortedFound.value.length - LIMIT, 0))
    const remainingOverflowCount = computed(() => Math.max(sortedRemaining.value.length - LIMIT, 0))

    const scoreForWord = (word) => calculateScore(word, false)

    return {
      showFound,
      showRemaining,
      remainingWords,
      sortedFound,
      sortedRemaining,
      sortedFoundLimited,
      sortedRemainingLimited,
      foundOverflowCount,
      remainingOverflowCount,
      scoreForWord
    }
  }
}
</script>


