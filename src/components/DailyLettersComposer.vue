<template>
  <div class="mb-8">
    <!-- Comodines (rediseño: botones redondos con contador) -->
    <div class="flex justify-center gap-8 mb-6">
      <!-- Consonante -->
      <button
        @click="$emit('use-comodin', 'consonantes')"
        :disabled="comodines.consonantes === 0"
        class="relative group select-none"
        aria-label="Usar comodín de consonante"
      >
        <div
          class="w-14 h-14 rounded-full flex items-center justify-center border text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          :class="[
            comodines.consonantes > 0
              ? 'bg-white/15 border-white/40'
              : 'bg-white/10 border-white/20'
          ]"
        >
          <span class="text-2xl">🎯</span>
        </div>
        <span
          class="absolute -top-1 -right-2 text-[11px] font-bold px-2 py-0.5 rounded-full shadow"
          :class="comodines.consonantes > 0 ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white/70'"
        >
          {{ comodines.consonantes }}
        </span>
        <div class="text-xs text-white/80 text-center mt-2">Consonante</div>
      </button>

      <!-- Vocal -->
      <button
        @click="$emit('use-comodin', 'vocales')"
        :disabled="comodines.vocales === 0"
        class="relative group select-none"
        aria-label="Usar comodín de vocal"
      >
        <div
          class="w-14 h-14 rounded-full flex items-center justify-center border text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          :class="[
            comodines.vocales > 0
              ? 'bg-white/15 border-white/40'
              : 'bg-white/10 border-white/20'
          ]"
        >
          <span class="text-2xl">✨</span>
        </div>
        <span
          class="absolute -top-1 -right-2 text-[11px] font-bold px-2 py-0.5 rounded-full shadow"
          :class="comodines.vocales > 0 ? 'bg-sky-500 text-white' : 'bg-white/20 text-white/70'"
        >
          {{ comodines.vocales }}
        </span>
        <div class="text-xs text-white/80 text-center mt-2">Vocal</div>
      </button>
    </div>
    

    <!-- Letters Grid -->
    <div class="grid grid-cols-5 gap-3 mb-6 max-w-sm mx-auto">
      <button
        v-for="(letter, index) in letters"
        :key="index"
        @click="selectLetter(letter, index)"
        :disabled="usedLetterIndices.includes(index)"
        class="flex items-center justify-center aspect-square rounded-lg text-center shadow-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none"
        :class="[
          usedLetterIndices.includes(index)
            ? 'bg-green-500/30 border-green-400 text-white'
            : (index >= 5
                ? 'bg-amber-400/20 border-amber-300 text-white hover:bg-amber-400/30'
                : 'bg-white/15 border-white/30 text-white hover:bg-white/25'),
          'active:scale-95',
          'animate-bounce-in'
        ]"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <span class="text-2xl font-extrabold tracking-wide">
          {{ letter }}
        </span>
      </button>
    </div>

    <!-- Current Word Display -->
    <div class="text-center mb-6">
      <div class="inline-block bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
        <div class="text-sm text-white/70 mb-2">Palabra actual:</div>
        <div class="text-4xl font-bold text-white min-h-[3rem] flex items-center justify-center">
          {{ currentWord || '...' }}
        </div>
      </div>
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
    
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'DailyLettersComposer',
  props: {
    letters: {
      type: Array,
      required: true
    },
    comodines: {
      type: Object,
      required: true
    },
    comodinesUsed: {
      type: Object,
      default: () => ({ consonantes: 0, vocales: 0 })
    },
    isGameComplete: {
      type: Boolean,
      default: false
    }
  },
  emits: ['use-comodin', 'submit-word'],
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
