<template>
  <div class="mb-8">
    <div class="text-center mb-6">
      <h2 class="text-3xl font-bold text-white mb-2 animate-fade-in">
        ✍️ Ingresa una Palabra
      </h2>
      <p class="text-white/80 animate-slide-up">
        Escribe una palabra que puedas formar con las letras disponibles
      </p>
    </div>

    <!-- Word Input Form -->
    <div class="max-w-md mx-auto">
      <form @submit.prevent="submitWord" class="space-y-4">
        <div class="relative">
          <input
            v-model="wordInput"
            type="text"
            placeholder="Escribe aquí..."
            class="word-input w-full px-6 py-4 text-xl font-semibold text-center rounded-2xl shadow-lg transition-all duration-300"
            :class="{
              'border-green-500 bg-green-50': inputStatus === 'success',
              'border-red-500 bg-red-50': inputStatus === 'error',
              'border-gray-300': inputStatus === 'neutral'
            }"
            :disabled="isGameComplete"
            maxlength="20"
            autocomplete="off"
            ref="wordInputRef"
          />
          
          <!-- Character Counter -->
          <div class="absolute top-2 right-3 text-xs text-gray-400">
            {{ wordInput.length }}/20
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="!wordInput.trim() || isGameComplete"
          class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span class="text-xl mr-2">🚀</span>
          {{ isGameComplete ? 'Juego Completado' : 'Enviar Palabra' }}
        </button>
      </form>

      <!-- Status Message -->
      <div v-if="statusMessage" class="mt-4 animate-bounce-in">
        <div 
          class="text-center p-4 rounded-2xl font-semibold shadow-lg"
          :class="{
            'bg-green-500/20 text-green-800 border border-green-500/30': inputStatus === 'success',
            'bg-red-500/20 text-red-800 border border-red-500/30': inputStatus === 'error',
            'bg-blue-500/20 text-blue-800 border border-blue-500/30': inputStatus === 'info'
          }"
        >
          <span class="text-lg mr-2">
            {{ inputStatus === 'success' ? '✅' : inputStatus === 'error' ? '❌' : 'ℹ️' }}
          </span>
          {{ statusMessage }}
        </div>
      </div>

      <!-- Game Complete Message -->
      <div v-if="isGameComplete" class="mt-6 text-center animate-celebrate">
        <div class="bg-gradient-to-r from-green-400 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl">
          <div class="text-2xl mb-2">🎉</div>
          <div class="text-lg font-bold">¡Felicidades!</div>
          <div class="text-sm opacity-90">Has encontrado todas las palabras posibles</div>
        </div>
      </div>
    </div>

    <!-- Word Suggestions (Optional) -->
    <div v-if="showSuggestions && wordSuggestions.length > 0" class="mt-6 max-w-2xl mx-auto">
      <div class="text-center mb-4">
        <button
          @click="toggleSuggestions"
          class="text-white/80 hover:text-white transition-colors duration-200"
        >
          {{ showSuggestions ? 'Ocultar' : 'Mostrar' }} sugerencias
          <span class="ml-2">{{ showSuggestions ? '▼' : '▶' }}</span>
        </button>
      </div>
      
      <div v-if="showSuggestions" class="glass-effect rounded-2xl p-6 animate-fade-in">
        <h3 class="text-white font-semibold mb-4 text-center">💡 Palabras que podrías probar:</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            v-for="suggestion in wordSuggestions.slice(0, 9)"
            :key="suggestion"
            @click="useSuggestion(suggestion)"
            class="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
          >
            {{ suggestion }}
          </button>
        </div>
        <div v-if="wordSuggestions.length > 9" class="text-center mt-3 text-white/60 text-sm">
          Y {{ wordSuggestions.length - 9 }} más...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick, watch } from 'vue'

export default {
  name: 'WordInput',
  props: {
    isGameComplete: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit-word'],
  setup(props, { emit }) {
    const wordInput = ref('')
    const inputStatus = ref('neutral')
    const statusMessage = ref('')
    const showSuggestions = ref(false)
    const wordInputRef = ref(null)

    // Computed
    const canSubmit = computed(() => {
      return wordInput.value.trim().length > 0 && !props.isGameComplete
    })

    // Methods
    const submitWord = async () => {
      const word = wordInput.value.trim().toUpperCase()
      
      if (!word) return
      
      // Emit the word submission
      const result = emit('submit-word', word)
      
      // Handle the result
      if (result && result.success) {
        inputStatus.value = 'success'
        statusMessage.value = result.message
        wordInput.value = ''
        
        // Focus back to input after success
        await nextTick()
        if (wordInputRef.value) {
          wordInputRef.value.focus()
        }
      } else if (result && !result.success) {
        inputStatus.value = 'error'
        statusMessage.value = result.message
        
        // Shake animation for error
        if (wordInputRef.value) {
          wordInputRef.value.classList.add('animate-shake')
          setTimeout(() => {
            wordInputRef.value.classList.remove('animate-shake')
          }, 500)
        }
      }
      
      // Clear status after 3 seconds
      setTimeout(() => {
        inputStatus.value = 'neutral'
        statusMessage.value = ''
      }, 3000)
    }

    const toggleSuggestions = () => {
      showSuggestions.value = !showSuggestions.value
    }

    const useSuggestion = (suggestion) => {
      wordInput.value = suggestion
      submitWord()
    }

    // Watch for game completion
    watch(() => props.isGameComplete, (complete) => {
      if (complete) {
        inputStatus.value = 'neutral'
        statusMessage.value = ''
      }
    })

    // Focus input on mount
    const focusInput = () => {
      if (wordInputRef.value && !props.isGameComplete) {
        wordInputRef.value.focus()
      }
    }

    return {
      wordInput,
      inputStatus,
      statusMessage,
      showSuggestions,
      wordInputRef,
      canSubmit,
      submitWord,
      toggleSuggestions,
      useSuggestion,
      focusInput
    }
  },
  mounted() {
    this.focusInput()
  }
}
</script>
