<template>
  <div class="fixed inset-0 z-50">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>

    <!-- Fullscreen Modal Content -->
    <div class="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 w-full h-full overflow-y-auto animate-bounce-in">
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-white/80 hover:text-white text-2xl transition-colors duration-200"
      >
        ✕
      </button>

      <!-- Victory Content Wrapper -->
      <div class="max-w-2xl mx-auto p-8 text-center text-white">
        <!-- Trophy Icon -->
        <div class="text-8xl mb-6 animate-celebrate">🏆</div>
        
        <!-- Title -->
        <h2 class="text-4xl font-bold mb-4 animate-fade-in">
          ¡Felicidades!
        </h2>
        
        <!-- Subtitle -->
        <p class="text-xl mb-6 animate-slide-up">
          Has completado el Juego de Palabras de hoy
        </p>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-4 animate-slide-up">
            <div class="text-2xl font-bold">{{ score }}</div>
            <div class="text-sm opacity-90">Puntuación</div>
          </div>
          
          <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-4 animate-slide-up" style="animation-delay: 0.1s">
            <div class="text-2xl font-bold">{{ wordsFound.length }}</div>
            <div class="text-sm opacity-90">Palabras</div>
          </div>
          
          <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-2xl p-4 animate-slide-up" style="animation-delay: 0.2s">
            <div class="text-2xl font-bold">{{ totalWords }}</div>
            <div class="text-sm opacity-90">Total</div>
          </div>
        </div>

        <!-- Performance Rating -->
        <div class="mb-8 animate-fade-in">
          <div class="text-lg mb-2">Tu rendimiento:</div>
          <div class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <span class="text-2xl">{{ performanceEmoji }}</span>
            <span class="font-semibold">{{ performanceText }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <button
            @click="$emit('close')"
            class="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/30"
          >
            Continuar Jugando
          </button>
          
      
        </div>

        <!-- Motivational Message -->
        <div class="mt-8 text-center animate-fade-in">
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <p class="text-lg font-medium mb-2">🎯 ¡Mañana será otro desafío!</p>
            <p class="text-sm opacity-90">
              Las letras cambiarán y tendrás nuevas oportunidades de mejorar tu puntuación
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'VictoryModal',
  props: {
    score: {
      type: Number,
      required: true
    },
    wordsFound: {
      type: Array,
      required: true
    },
    totalWords: {
      type: Number,
      required: true
    }
  },
  emits: ['close', 'share'],
  setup(props, { emit }) {
    // Computed properties
    const performanceRating = computed(() => {
      const percentage = (props.wordsFound.length / props.totalWords) * 100
      
      if (percentage >= 100) return 5
      if (percentage >= 80) return 4
      if (percentage >= 60) return 3
      if (percentage >= 40) return 2
      return 1
    })

    const performanceEmoji = computed(() => {
      const ratings = {
        5: '🌟',
        4: '⭐',
        3: '✨',
        2: '💫',
        1: '⭐'
      }
      return ratings[performanceRating.value]
    })

    const performanceText = computed(() => {
      const texts = {
        5: '¡Perfecto!',
        4: '¡Excelente!',
        3: '¡Muy bien!',
        2: '¡Bien!',
        1: '¡Sigue practicando!'
      }
      return texts[performanceRating.value]
    })

    // Methods
    const shareOnSocial = (platform) => {
      emit('share', platform)
    }

    const copyLink = async (event) => {
      try {
        await navigator.clipboard.writeText(window.location.href)
        
        // Show success feedback
        const button = event.target.closest('button')
        const originalText = button.innerHTML
        button.innerHTML = '<span class="text-xl">✅</span><span>¡Copiado!</span>'
        
        setTimeout(() => {
          button.innerHTML = originalText
        }, 2000)
      } catch (err) {
        console.error('Error al copiar enlace:', err)
      }
    }

    const shareResult = async (event) => {
      const percentage = props.totalWords > 0
        ? Math.round((props.wordsFound.length / props.totalWords) * 100)
        : 0
      const longestWord = props.wordsFound.slice().sort((a, b) => b.length - a.length)[0] || '—'
      const text = `Letrix — Resultado de hoy\nPuntuación: ${props.score}\nPalabras: ${props.wordsFound.length}/${props.totalWords} (${percentage}%)\nMás larga: ${longestWord}\n${window.location.href}`

      try {
        if (navigator.share) {
          await navigator.share({ title: 'Letrix', text })
        } else {
          await navigator.clipboard.writeText(text)
          // Feedback visual en el botón
          const button = event.target.closest('button')
          const originalText = button.innerHTML
          button.innerHTML = '<span class="text-xl">✅</span><span>¡Copiado!</span>'
          setTimeout(() => { button.innerHTML = originalText }, 2000)
        }
      } catch (err) {
        console.error('Error al compartir:', err)
      }
    }

    const viewHistory = () => {
      // This could open a history modal or navigate to a history page
      console.log('Ver historial')
    }

    return {
      performanceRating,
      performanceEmoji,
      performanceText,
      shareOnSocial,
      copyLink,
      shareResult,
      viewHistory
    }
  }
}
</script>
