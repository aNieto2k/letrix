<template>
  <div class="mb-8">
    

    <!-- Current Word Display -->
    <div class="text-center mb-6">
      <div class="inline-block bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
        <div class="text-sm text-white/70 mb-2">Palabra actual:</div>
        <div class="text-4xl font-bold text-white min-h-[3rem] flex items-center justify-center">
          {{ currentWord || '...' }}
        </div>
      </div>
    </div>

    <!-- Letter Selection Grid -->
    <div class="grid grid-cols-5 gap-3 mb-6 max-w-md mx-auto">
      <button
        v-for="(letter, index) in availableLetters"
        :key="`${letter}-${index}`"
        @click="selectLetter(letter, index)"
        :disabled="usedLetterIndices.includes(index)"
        class="letter-tile bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{
          'hover:bg-white/30 hover:scale-105': !usedLetterIndices.includes(index),
          'bg-green-500/30 border-green-400': usedLetterIndices.includes(index),
          'animate-bounce-in': true
        }"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <span class="text-3xl font-bold text-white block">
          {{ letter }}
        </span>
      </button>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-center space-x-4 mb-6">
      <button
        @click="clearWord"
        :disabled="currentWord.length === 0"
        class="px-6 py-3 bg-red-500/80 hover:bg-red-500 text-white font-semibold rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
      >
        <span class="text-xl mr-2">🗑️</span>
        Limpiar
      </button>

      <button
        @click="submitWord"
        :disabled="currentWord.length < 3"
        class="px-6 py-3 bg-green-500/80 hover:bg-green-500 text-white font-semibold rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
      >
        <span class="text-xl mr-2">✅</span>
        Enviar Palabra
      </button>
    </div>

    <!-- Word Length Info -->
    <div class="text-center text-white/80 mb-4">
      <div class="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
        <span>📏</span>
        <span>Longitud: {{ currentWord.length }}</span>
        <span v-if="currentWord.length >= 3" class="text-green-400">✓</span>
        <span v-else class="text-red-400">✗</span>
      </div>
      
      <!-- Progress Bar -->
      <div class="mt-3 max-w-xs mx-auto">
        <div class="bg-white/20 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${Math.min((currentWord.length / 8) * 100, 100)}%` }"
          ></div>
        </div>
        <div class="text-xs text-white/60 mt-1">
          {{ currentWord.length }}/8 letras (mínimo 3)
        </div>
      </div>
    </div>

    <!-- Selected Letters Order -->
    <div v-if="selectedLetters.length > 0" class="mt-4 text-center"></div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'WordComposer',
  props: {
    letters: {
      type: Array,
      required: true
    },
    isGameComplete: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit-word'],
  setup(props, { emit }) {
    const currentWord = ref('')
    const selectedLetters = ref([])
    const usedLetterIndices = ref([])

    // Computed
    const availableLetters = computed(() => props.letters)

    // Methods
    const selectLetter = (letter, index) => {
      if (usedLetterIndices.value.includes(index)) {
        return // Letra ya usada
      }

      currentWord.value += letter
      selectedLetters.value.push(letter)
      usedLetterIndices.value.push(index)
    }

    const clearWord = () => {
      currentWord.value = ''
      selectedLetters.value = []
      usedLetterIndices.value = []
    }

    const submitWord = () => {
      if (currentWord.value.length >= 3) {
        emit('submit-word', currentWord.value)
        clearWord()
      }
    }

    // Reset when letters change or game completes
    const resetComposer = () => {
      clearWord()
    }

    // Watch for game completion
    watch(() => props.isGameComplete, (complete) => {
      if (complete) {
        resetComposer()
      }
    })

    // Watch for letters change
    watch(() => props.letters, () => {
      resetComposer()
    })

    return {
      currentWord,
      selectedLetters,
      usedLetterIndices,
      availableLetters,
      selectLetter,
      clearWord,
      submitWord
    }
  }
}
</script>
