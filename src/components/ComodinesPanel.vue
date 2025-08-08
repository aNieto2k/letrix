<template>
  <div class="mb-8">
    

    <!-- Comodines Status -->
    <div class="grid grid-cols-1 gap-6 mb-6">
      <!-- Consonantes Comodines -->
      <div class="glass-effect rounded-2xl p-6 animate-slide-up">
        <div class="text-center">
          <div class="text-4xl mb-3">🎯</div>
          <h3 class="text-xl font-bold text-white mb-2">Consonantes Extra</h3>
          
          <div class="text-3xl font-bold text-white mb-2">
            {{ comodines.consonantes }}
          </div>
          
          <div class="text-white/70 text-sm mb-4">
            Disponibles
          </div>
          
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-white/70">Usados hoy:</span>
              <span class="text-white font-medium">{{ comodinesUsed.consonantes }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-white/70">Total disponibles:</span>
              <span class="text-white font-medium">2</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Vocales Comodines -->
      <div class="glass-effect rounded-2xl p-6 animate-slide-up" style="animation-delay: 0.1s">
        <div class="text-center">
          <div class="text-4xl mb-3">✨</div>
          <h3 class="text-xl font-bold text-white mb-2">Vocales Extra</h3>
          
          <div class="text-3xl font-bold text-white mb-2">
            {{ comodines.vocales }}
          </div>
          
          <div class="text-white/70 text-sm mb-4">
            Disponibles
          </div>
          
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-white/70">Usados hoy:</span>
              <span class="text-white font-medium">{{ comodinesUsed.vocales }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-white/70">Total disponibles:</span>
              <span class="text-white font-medium">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Componente reducido a lo esencial: estados de comodines -->
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ComodinesPanel',
  props: {
    comodines: {
      type: Object,
      required: true
    },
    comodinesUsed: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // Computed properties
    const totalComodinesUsed = computed(() => {
      return props.comodinesUsed.consonantes + props.comodinesUsed.vocales
    })

    const totalComodinesAvailable = computed(() => {
      return 3 // 2 consonantes + 1 vocal
    })

    const comodinesUsagePercentage = computed(() => {
      return Math.round((totalComodinesUsed.value / totalComodinesAvailable.value) * 100)
    })

    return {
      totalComodinesUsed,
      totalComodinesAvailable,
      comodinesUsagePercentage
    }
  }
}
</script>
