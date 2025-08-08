import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const vm = app.mount('#app')

// Objeto global de depuración
window.debug = {
  // Devuelve un array con las palabras que aún no se han encontrado
  getRemainingWords() {
    const all = vm.allPossibleWords || []
    const found = vm.wordsFound || []
    return all.filter((word) => !found.includes(word))
  }
}
