<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
    <!-- Header -->
    <header class="relative text-center py-6">
      <button
        @click="showHelpModal = true"
        class="absolute right-4 top-4 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full w-9 h-9 flex items-center justify-center shadow"
        aria-label="Abrir ayuda"
      >
        ?
      </button>
      <h1 class="text-3xl font-bold text-white mb-1 animate-bounce-in">
        Letrix
      </h1>
      <p class="text-base text-white/80 animate-fade-in p-3">
        Encuentra todas las palabras posibles con las letras del día
      </p>
    </header>

    <!-- Game Container -->
    <main class="container mx-auto px-4 max-w-2xl pb-12">
      <ProgressBar
        :found-words="wordsFound"
        :all-words="allPossibleWords"
      />

      <DailyLettersComposer 
        :letters="dailyLetters" 
        :comodines="comodines"
        :comodines-used="comodinesUsed"
        :is-game-complete="isGameComplete"
        @use-comodin="useComodin"
        @submit-word="submitWord"
      />

      <ProgressPanel 
        :found-words="wordsFound"
        :all-words="allPossibleWords"
      />
    </main>

    <!-- Victory Modal -->
    <VictoryModal 
      v-if="showVictoryModal"
      :score="score"
      :words-found="wordsFound"
      :total-words="totalPossibleWords"
      @close="showVictoryModal = false"
      @share="shareScore"
    />

    <!-- Celebration Effect -->
    <div v-if="showCelebration" class="celebration">
      <div 
        v-for="i in 50" 
        :key="i"
        class="confetti"
        :style="{
          left: Math.random() * 100 + '%',
          backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          animationDelay: Math.random() * 3 + 's',
          animationDuration: (Math.random() * 2 + 2) + 's'
        }"
      ></div>
    </div>

    <!-- Help Modal -->
    <HelpModal v-if="showHelpModal" @close="showHelpModal = false" />

    <!-- Footer Stats -->
    <footer class="sticky bottom-0 w-full bg-black/20 backdrop-blur-sm border-t border-white/10">
      <div class="container mx-auto px-4 max-w-2xl py-3">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-white text-center">
          <div class="glass-effect rounded-xl py-2">
            <div class="text-xs uppercase tracking-wide text-white/70">Días jugados</div>
            <div class="text-lg font-bold">{{ stats.totalGames }}</div>
          </div>
          <div class="glass-effect rounded-xl py-2">
            <div class="text-xs uppercase tracking-wide text-white/70">Puntos totales</div>
            <div class="text-lg font-bold">{{ stats.totalScore }}</div>
          </div>
          <div class="glass-effect rounded-xl py-2">
            <div class="text-xs uppercase tracking-wide text-white/70">Media por día</div>
            <div class="text-lg font-bold">{{ stats.averageScore }}</div>
          </div>
          <div class="glass-effect rounded-xl py-2">
            <div class="text-xs uppercase tracking-wide text-white/70">Palabra más larga</div>
            <div class="text-lg font-bold truncate" :title="stats.longestWord">{{ stats.longestWord || '—' }}</div>
          </div>
        </div>
      </div>
    </footer>
    
    <!-- Install Prompt (móviles) -->
    <InstallPrompt />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import DailyLettersComposer from './components/DailyLettersComposer.vue'
import VictoryModal from './components/VictoryModal.vue'
import { generateDailyLetters, getPossibleWords, calculateScore } from './utils/gameLogic'
import { saveGameState, loadGameState, saveScoreHistory, getScoreStats } from './utils/storage'
import ProgressPanel from './components/ProgressPanel.vue'
import ProgressBar from './components/ProgressBar.vue'
import HelpModal from './components/HelpModal.vue'
import InstallPrompt from './components/InstallPrompt.vue'

export default {
  name: 'App',
  components: {
    DailyLettersComposer,
    VictoryModal,
    ProgressPanel,
    ProgressBar,
    HelpModal
    , InstallPrompt
  },
  setup() {
    // Game State
    const dailyLetters = ref([])
    const comodines = ref({
      consonantes: 2,
      vocales: 1
    })
    const wordsFound = ref([])
    const score = ref(0)
    const comodinesUsed = ref({
      consonantes: 0,
      vocales: 0
    })
    const showVictoryModal = ref(false)
    const showCelebration = ref(false)
    const showHelpModal = ref(false)

    // Stats Footer
    const stats = ref({ totalGames: 0, totalScore: 0, averageScore: 0, longestWord: '' })

    // Computed
    const totalPossibleWords = computed(() => {
      return allPossibleWords.value.length
    })

    const isGameComplete = computed(() => {
      return wordsFound.value.length >= totalPossibleWords.value
    })

    const allPossibleWords = computed(() => {
      if (dailyLetters.value.length === 0) return []
      return getPossibleWords(dailyLetters.value)
    })

    // Confetti colors
    const confettiColors = [
      '#fbbf24', '#f59e0b', '#d97706', // Yellow/Orange
      '#ec4899', '#db2777', '#be185d', // Pink
      '#3b82f6', '#2563eb', '#1d4ed8', // Blue
      '#10b981', '#059669', '#047857', // Green
      '#8b5cf6', '#7c3aed', '#6d28d9'  // Purple
    ]

    // Constants de puntuación
    const WORDS_WITH_COMODINES_MULTIPLIER = 0.85 // Penalización global si se han usado comodines en la partida
    const COMODIN_USE_PENALTY = 50 // Puntos restados por cada comodín usado
    const COMPLETION_BONUS_POINTS = 200 // Bonus al completar todas las palabras

    // Flags
    const completionBonusApplied = ref(false)

    // Methods
    const initializeGame = () => {
      const today = new Date().toDateString()
      const savedState = loadGameState(today)
      
      if (savedState) {
        dailyLetters.value = savedState.letters
        wordsFound.value = savedState.words
        score.value = savedState.score
        comodinesUsed.value = savedState.comodinesUsed
      } else {
        dailyLetters.value = generateDailyLetters()
        wordsFound.value = []
        score.value = 0
        comodinesUsed.value = { consonantes: 0, vocales: 0 }
      }
    }

    const submitWord = (word) => {
      if (wordsFound.value.includes(word)) {
        return { success: false, message: '¡Ya encontraste esa palabra!' }
      }

      const possibleWords = allPossibleWords.value
      if (possibleWords.includes(word)) {
        // Puntuación base
        let wordScore = calculateScore(word, false)
        // Penalización global si se han usado comodines en algún momento de la partida
        const hasUsedAnyComodin = (comodinesUsed.value.consonantes > 0) || (comodinesUsed.value.vocales > 0)
        if (hasUsedAnyComodin) {
          wordScore = Math.floor(wordScore * WORDS_WITH_COMODINES_MULTIPLIER)
        }
        wordsFound.value.push(word)
        score.value += wordScore
        
        // Save game state
        saveGameState(new Date().toDateString(), {
          letters: dailyLetters.value,
          words: wordsFound.value,
          score: score.value,
          comodinesUsed: comodinesUsed.value
        })

        // Check if game is complete
        if (isGameComplete.value) {
          setTimeout(() => {
            showVictoryModal.value = true
            showCelebration.value = true
            setTimeout(() => showCelebration.value = false, 3000)
          }, 500)
        }

        return { success: true, message: `¡Excelente! +${wordScore} puntos` }
      } else {
        return { success: false, message: 'Palabra no válida o no existe en el diccionario' }
      }
    }

    const useComodin = (type) => {
      if (comodines.value[type] > 0) {
        comodines.value[type]--
        comodinesUsed.value[type]++
        
        // Add extra letter
        if (type === 'consonantes') {
          const consonantes = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z']
          const randomConsonante = consonantes[Math.floor(Math.random() * consonantes.length)]
          dailyLetters.value.push(randomConsonante)
        } else {
          const vocales = ['A', 'E', 'I', 'O', 'U']
          const randomVocal = vocales[Math.floor(Math.random() * vocales.length)]
          dailyLetters.value.push(randomVocal)
        }

        // Penalización directa por uso de comodín
        score.value = Math.max(0, score.value - COMODIN_USE_PENALTY)
      }
    }

    const shareScore = (platform) => {
      const text = `¡He completado el Juego de Palabras de hoy con ${score.value} puntos! 🎯✨`
      const url = window.location.href
      
      let shareUrl = ''
      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
          break
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
          break
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
          break
      }
      
      if (shareUrl) {
        window.open(shareUrl, '_blank')
      }
    }

    // Lifecycle
    onMounted(() => {
      initializeGame()
      // Cargar estadísticas iniciales
      stats.value = getScoreStats()
    })

    // Watch for game completion
    watch(isGameComplete, (complete) => {
      if (complete) {
        // Aplicar bonus por completar todas las palabras (solo una vez)
        if (!completionBonusApplied.value) {
          score.value += COMPLETION_BONUS_POINTS
          completionBonusApplied.value = true
          // Guardar estado de juego con el bonus aplicado
          saveGameState(new Date().toDateString(), {
            letters: dailyLetters.value,
            words: wordsFound.value,
            score: score.value,
            comodinesUsed: comodinesUsed.value
          })
        }
        // Save to score history
        saveScoreHistory(new Date().toDateString(), {
          score: score.value,
          words: wordsFound.value.length,
          totalWords: totalPossibleWords.value,
          longestWord: wordsFound.value.slice().sort((a, b) => b.length - a.length)[0] || ''
        })
        // Refrescar estadísticas tras guardar
        stats.value = getScoreStats()
      }
    })

    // Lock body scroll when victory modal is open
    watch(showVictoryModal, (visible) => {
      document.body.style.overflow = visible ? 'hidden' : ''
    })

    return {
      dailyLetters,
      comodines,
      wordsFound,
      score,
      comodinesUsed,
      showVictoryModal,
      showCelebration,
      totalPossibleWords,
      isGameComplete,
      allPossibleWords,
      confettiColors,
      submitWord,
      useComodin,
      shareScore,
      showHelpModal
      , stats
    }
  }
}
</script>
