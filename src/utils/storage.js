// Claves para el almacenamiento local
const GAME_STATE_KEY = 'wordgame_state_'
const SCORE_HISTORY_KEY = 'wordgame_scores'

// Guardar el estado del juego para un día específico
export function saveGameState(date, gameState) {
  try {
    const key = GAME_STATE_KEY + date
    localStorage.setItem(key, JSON.stringify({
      ...gameState,
      timestamp: Date.now()
    }))
  } catch (error) {
    console.error('Error al guardar el estado del juego:', error)
  }
}

// Cargar el estado del juego para un día específico
export function loadGameState(date) {
  try {
    const key = GAME_STATE_KEY + date
    const savedState = localStorage.getItem(key)
    
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      
      // Verificar si el estado es del día actual
      const savedDate = new Date(parsedState.timestamp).toDateString()
      if (savedDate === date) {
        return parsedState
      }
    }
    
    return null
  } catch (error) {
    console.error('Error al cargar el estado del juego:', error)
    return null
  }
}

// Guardar puntuación en el historial
export function saveScoreHistory(date, scoreData) {
  try {
    const existingScores = loadScoreHistory()
    
    // Actualizar o agregar la puntuación del día
    existingScores[date] = {
      ...scoreData,
      date: date,
      timestamp: Date.now()
    }
    
    localStorage.setItem(SCORE_HISTORY_KEY, JSON.stringify(existingScores))
  } catch (error) {
    console.error('Error al guardar el historial de puntuaciones:', error)
  }
}

// Cargar historial de puntuaciones
export function loadScoreHistory() {
  try {
    const savedScores = localStorage.getItem(SCORE_HISTORY_KEY)
    return savedScores ? JSON.parse(savedScores) : {}
  } catch (error) {
    console.error('Error al cargar el historial de puntuaciones:', error)
    return {}
  }
}

// Obtener estadísticas del historial
export function getScoreStats() {
  try {
    const scores = loadScoreHistory()
    const scoreValues = Object.values(scores)
    
    if (scoreValues.length === 0) {
      return {
        totalGames: 0,
        totalScore: 0,
        averageScore: 0,
        bestScore: 0,
        totalWords: 0,
        streak: 0,
        longestWord: ''
      }
    }
    
    const totalGames = scoreValues.length
    const totalScore = scoreValues.reduce((sum, game) => sum + game.score, 0)
    const averageScore = Math.round(totalScore / totalGames)
    const bestScore = Math.max(...scoreValues.map(game => game.score))
    const totalWords = scoreValues.reduce((sum, game) => sum + game.words, 0)
    const longestWord = scoreValues.reduce((longest, game) => {
      const candidate = (game && game.longestWord) ? game.longestWord : ''
      if (!candidate) return longest
      return candidate.length > longest.length ? candidate : longest
    }, '')
    
    // Calcular racha actual (días consecutivos jugados)
    let streak = 0
    const sortedDates = Object.keys(scores).sort()
    const today = new Date()
    
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const gameDate = new Date(sortedDates[i])
      const daysDiff = Math.floor((today - gameDate) / (1000 * 60 * 60 * 24))
      
      if (daysDiff <= streak + 1) {
        streak++
      } else {
        break
      }
    }
    
    return {
      totalGames,
      totalScore,
      averageScore,
      bestScore,
      totalWords,
      streak,
      longestWord
    }
  } catch (error) {
    console.error('Error al calcular estadísticas:', error)
    return {
      totalGames: 0,
      totalScore: 0,
      averageScore: 0,
      bestScore: 0,
      totalWords: 0,
      streak: 0,
      longestWord: ''
    }
  }
}

// Limpiar datos antiguos (más de 30 días)
export function cleanupOldData() {
  try {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    
    // Limpiar estados de juego antiguos
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(GAME_STATE_KEY)) {
        try {
          const data = JSON.parse(localStorage.getItem(key))
          if (data.timestamp && data.timestamp < thirtyDaysAgo) {
            localStorage.removeItem(key)
          }
        } catch (e) {
          // Si hay error al parsear, eliminar la clave
          localStorage.removeItem(key)
        }
      }
    })
    
    // Limpiar historial de puntuaciones antiguas
    const scores = loadScoreHistory()
    const cleanedScores = {}
    
    Object.entries(scores).forEach(([date, scoreData]) => {
      if (scoreData.timestamp && scoreData.timestamp >= thirtyDaysAgo) {
        cleanedScores[date] = scoreData
      }
    })
    
    localStorage.setItem(SCORE_HISTORY_KEY, JSON.stringify(cleanedScores))
  } catch (error) {
    console.error('Error al limpiar datos antiguos:', error)
  }
}

// Exportar datos del juego
export function exportGameData() {
  try {
    const scores = loadScoreHistory()
    const dataStr = JSON.stringify(scores, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `wordgame_scores_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(link.href)
  } catch (error) {
    console.error('Error al exportar datos:', error)
  }
}

// Importar datos del juego
export function importGameData(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)
          const existingScores = loadScoreHistory()
          
          // Combinar datos importados con existentes
          const mergedScores = { ...existingScores, ...importedData }
          
          localStorage.setItem(SCORE_HISTORY_KEY, JSON.stringify(mergedScores))
          resolve(mergedScores)
        } catch (parseError) {
          reject(new Error('Formato de archivo inválido'))
        }
      }
      
      reader.onerror = () => reject(new Error('Error al leer el archivo'))
      reader.readAsText(file)
    } catch (error) {
      reject(error)
    }
  })
}
