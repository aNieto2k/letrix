<template>
  <div class="mb-8">
    

    <!-- Letters Grid -->
    <div class="grid grid-cols-5 gap-4 mb-6 max-w-md mx-auto">
      <div
        v-for="(letter, index) in letters"
        :key="index"
        class="letter-tile bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
        :class="{
          'animate-bounce-in': true,
          'scale-110': index < 5 // Las primeras 5 letras son las originales
        }"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <span class="text-4xl font-bold text-white block mb-2">
          {{ letter }}
        </span>
        
      </div>
    </div>

    

    <!-- Comodines Buttons -->
    <div class="flex justify-center space-x-4 mt-6">
      <button
        @click="$emit('use-comodin', 'consonantes')"
        :disabled="comodines.consonantes === 0"
        class="comodin-badge px-6 py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
        :class="{
          'animate-pulse-glow': comodines.consonantes > 0
        }"
      >
        <span class="text-xl mr-2">🎯</span>
        Consonante Extra
        <span class="ml-2 text-sm bg-white/20 px-2 py-1 rounded-full">
          {{ comodines.consonantes }}
        </span>
      </button>

      <button
        @click="$emit('use-comodin', 'vocales')"
        :disabled="comodines.vocales === 0"
        class="comodin-badge px-6 py-3 rounded-full text-white font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
        :class="{
          'animate-pulse-glow': comodines.vocales > 0
        }"
      >
        <span class="text-xl mr-2">✨</span>
        Vocal Extra
        <span class="ml-2 text-sm bg-white/20 px-2 py-1 rounded-full">
          {{ comodines.vocales }}
        </span>
      </button>
    </div>

    
  </div>
</template>

<script>
export default {
  name: 'DailyLetters',
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
    }
  },
  emits: ['use-comodin']
}
</script>
