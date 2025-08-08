<template>
  <div class="mb-8">
    <!-- Score Display -->
    <div class="text-center mb-6">
      <div class="score-badge inline-block px-8 py-4 rounded-2xl text-white shadow-2xl animate-bounce-in">
        <div class="text-2xl font-bold mb-1">🏆 Puntuación</div>
        <div class="text-5xl font-black">{{ score }}</div>
        <div class="text-lg opacity-90">puntos</div>
      </div>
    </div>

    <!-- Progress Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Words Found -->
      <div class="glass-effect rounded-2xl p-6 text-center animate-slide-up">
        <div class="text-4xl mb-2">📚</div>
        <div class="text-2xl font-bold text-white mb-1">{{ wordsFound }}</div>
        <div class="text-white/80">Palabras encontradas</div>
      </div>

      <!-- Total Words -->
      <div class="glass-effect rounded-2xl p-6 text-center animate-slide-up" style="animation-delay: 0.1s">
        <div class="text-4xl mb-2">🎯</div>
        <div class="text-2xl font-bold text-white mb-1">{{ totalWords }}</div>
        <div class="text-white/80">Total disponibles</div>
      </div>

      <!-- Progress Percentage -->
      <div class="glass-effect rounded-2xl p-6 text-center animate-slide-up" style="animation-delay: 0.2s">
        <div class="text-4xl mb-2">📊</div>
        <div class="text-2xl font-bold text-white mb-1">{{ progressPercentage }}%</div>
        <div class="text-white/80">Progreso</div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="glass-effect rounded-2xl p-6 animate-fade-in">
      <div class="flex justify-between items-center mb-3">
        <span class="text-white font-medium">Progreso del juego</span>
        <span class="text-white/80 text-sm">{{ wordsFound }} / {{ totalWords }}</span>
      </div>
      
      <div class="w-full bg-white/20 rounded-full h-4 overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
      
      <!-- Progress Labels -->
      <div class="flex justify-between mt-2 text-xs text-white/60">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>

    <!-- Achievement Messages -->
    <div v-if="achievementMessage" class="text-center mt-4 animate-bounce-in">
      <div class="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg">
        <span class="text-2xl">🎉</span>
        <span class="font-semibold">{{ achievementMessage }}</span>
        <span class="text-2xl">🎉</span>
      </div>
    </div>

    <!-- Game Complete Indicator -->
    <div v-if="isGameComplete" class="text-center mt-6 animate-celebrate">
      <div class="inline-flex items-center space-x-3 bg-gradient-to-r from-green-400 to-emerald-600 text-white px-8 py-4 rounded-full shadow-2xl">
        <span class="text-3xl">🏆</span>
        <span class="text-xl font-bold">¡Juego Completado!</span>
        <span class="text-3xl">🏆</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'GameStats',
  props: {
    score: {
      type: Number,
      required: true
    },
    wordsFound: {
      type: Number,
      required: true
    },
    totalWords: {
      type: Number,
      required: true
    },
    comodinesUsed: {
      type: Object,
      default: () => ({ consonantes: 0, vocales: 0 })
    }
  },
  setup(props) {
    const progressPercentage = computed(() => {
      if (props.totalWords === 0) return 0
      return Math.round((props.wordsFound / props.totalWords) * 100)
    })

    const isGameComplete = computed(() => {
      return props.wordsFound >= props.totalWords
    })

    const achievementMessage = computed(() => {
      if (props.wordsFound === 0) return null
      
      const percentage = progressPercentage.value
      
      if (percentage >= 100) return '¡Perfecto! Has completado el juego'
      if (percentage >= 75) return '¡Excelente! Casi lo tienes'
      if (percentage >= 50) return '¡Buen trabajo! Sigue así'
      if (percentage >= 25) return '¡Bien! Ya vas por buen camino'
      if (percentage >= 10) return '¡Empiezas bien!'
      
      return null
    })

    return {
      progressPercentage,
      isGameComplete,
      achievementMessage
    }
  }
}
</script>
