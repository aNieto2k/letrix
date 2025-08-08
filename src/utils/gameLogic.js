import { PALABRAS } from './palabras.js'

// Diccionario filtrado de palabras (>= 3 letras)
const SPANISH_WORDS = PALABRAS.filter(word => word.length >= 3)

// Cache simple para resultados de combinaciones de letras
const possibleWordsCache = new Map()

function normalizeLetters(letters) {
  // Crear una firma estable: conteo de cada letra ordenado por letra
  const count = letters.reduce((acc, l) => {
    acc[l] = (acc[l] || 0) + 1
    return acc
  }, {})
  const entries = Object.entries(count).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  return JSON.stringify(entries)
}

function hashStringToInt(input) {
  if (!input) return 0
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0 // Convert to 32bit int
  }
  // Asegurar número positivo
  return Math.abs(hash)
}

// Generar letras del día (2 vocales + 3 consonantes)
export function generateDailyLetters() {
  const vocales = ['A', 'E', 'I', 'O', 'U']
  const consonantes = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z']
  
  // Usar la fecha como seed para generar letras consistentes por día
  const today = new Date().toDateString()
  const baseSeed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  // Incorporar sal de entorno si existe (VITE_SEED_SALT)
  const seedSalt = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SEED_SALT) ? String(import.meta.env.VITE_SEED_SALT) : ''
  const saltInt = hashStringToInt(seedSalt)
  const seed = baseSeed + saltInt
  
  // Generar 2 vocales aleatorias
  const selectedVocales = []
  for (let i = 0; i < 2; i++) {
    let vocal
    do {
      vocal = vocales[Math.floor((seed + i * 7) % vocales.length)]
    } while (selectedVocales.includes(vocal))
    selectedVocales.push(vocal)
  }
  
  // Generar 3 consonantes aleatorias
  const selectedConsonantes = []
  for (let i = 0; i < 3; i++) {
    let consonante
    do {
      consonante = consonantes[Math.floor((seed + i * 11) % consonantes.length)]
    } while (selectedConsonantes.includes(consonante))
    selectedConsonantes.push(consonante)
  }
  
  return [...selectedVocales, ...selectedConsonantes]
}

// Obtener todas las palabras posibles con las letras dadas
export function getPossibleWords(letters) {
  if (!Array.isArray(letters) || letters.length === 0) return []

  const key = normalizeLetters(letters)
  const cached = possibleWordsCache.get(key)
  if (cached) return cached

  // Precontar letras disponibles
  const letterCount = letters.reduce((acc, letter) => {
    acc[letter] = (acc[letter] || 0) + 1
    return acc
  }, {})

  // Filtrar en una sola pasada y ordenar después
  const possible = []
  for (let i = 0; i < SPANISH_WORDS.length; i++) {
    const word = SPANISH_WORDS[i]
    if (canFormWord(word, letterCount)) possible.push(word)
  }

  possible.sort((a, b) => a.length - b.length)

  // Guardar en cache con límite simple para evitar crecimiento sin control
  if (possibleWordsCache.size > 50) {
    // borrar el primer elemento insertado (estrategia FIFO simple)
    const firstKey = possibleWordsCache.keys().next().value
    possibleWordsCache.delete(firstKey)
  }
  possibleWordsCache.set(key, possible)
  return possible
}

// Verificar si se puede formar una palabra con las letras disponibles
function canFormWord(word, availableLetters) {
  // Contar letras de la palabra en una pasada
  const count = {}
  for (let i = 0; i < word.length; i++) {
    const letter = word[i]
    count[letter] = (count[letter] || 0) + 1
    if (!availableLetters[letter] || count[letter] > availableLetters[letter]) return false
  }
  return true
}

// Calcular puntuación de una palabra
export function calculateScore(word, usedComodin = false) {
  let baseScore = word.length * 10
  
  // Bonus por palabras largas
  if (word.length >= 8) baseScore += 50
  if (word.length >= 10) baseScore += 100
  
  // Penalización por usar comodín
  if (usedComodin) {
    baseScore = Math.floor(baseScore * 0.7)
  }
  
  return baseScore
}

// Validar si una palabra existe en el diccionario
export function isValidWord(word) {
  return SPANISH_WORDS.includes(word.toUpperCase())
}

// Obtener sugerencias de palabras
export function getWordSuggestions(letters, foundWords) {
  const foundSet = new Set(foundWords || [])
  const allPossible = getPossibleWords(letters)
  return allPossible.filter(word => !foundSet.has(word))
}


