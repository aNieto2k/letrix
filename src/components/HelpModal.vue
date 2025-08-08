<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>

    <!-- Modal Content full-screen -->
    <div class="relative w-full h-full text-white shadow-2xl animate-bounce-in">
      <div class="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-6 md:p-8">
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-white/90 hover:text-white text-2xl transition-colors"
        aria-label="Cerrar ayuda"
      >
        ✕
      </button>

      <!-- Content -->
      <div class="space-y-6 max-w-3xl mx-auto">
        <div>
          <h2 class="text-3xl font-bold mb-2">¿Cómo jugar?</h2>
          <p class="text-white/90">
            Forma palabras usando las letras del día. Cada palabra válida suma puntos. ¡Cuantas más y más largas, mejor!
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Formar palabras -->
          <div class="bg-white/15 rounded-2xl p-4 border border-white/20">
            <h3 class="font-semibold mb-2">Formar palabras</h3>
            <ul class="list-disc list-inside text-white/90 text-sm space-y-1">
              <li>Pulsa letras para construir la palabra actual.</li>
              <li>Mínimo 3 letras.</li>
              <li>No puedes usar una letra más veces de las disponibles.</li>
              <li>Pulsa <span class="font-semibold">Enviar Palabra</span> para validar.</li>
            </ul>
          </div>

          <!-- Puntuación -->
          <div class="bg-white/15 rounded-2xl p-4 border border-white/20">
            <h3 class="font-semibold mb-2">Puntuación</h3>
            <ul class="list-disc list-inside text-white/90 text-sm space-y-1">
              <li>Cada letra vale 10 puntos.</li>
              <li>Bonus: +50 si la palabra tiene ≥ 8 letras.</li>
              <li>Bonus: +100 si la palabra tiene ≥ 10 letras.</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 class="font-semibold mb-2">¿Para qué sirve cada botón?</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white/15 rounded-2xl p-4 border border-white/20 flex items-start gap-3">
              <div class="text-2xl">🎯</div>
              <div>
                <div class="font-semibold">Consonante</div>
                <div class="text-sm text-white/90">Añade una consonante aleatoria a tus letras. Usa el contador para ver cuántas te quedan.</div>
              </div>
            </div>
            <div class="bg-white/15 rounded-2xl p-4 border border-white/20 flex items-start gap-3">
              <div class="text-2xl">✨</div>
              <div>
                <div class="font-semibold">Vocal</div>
                <div class="text-sm text-white/90">Añade una vocal aleatoria a tus letras. Úsalo con cabeza, son limitadas.</div>
              </div>
            </div>
            <div class="bg-white/15 rounded-2xl p-4 border border-white/20 flex items-start gap-3">
              <div class="text-2xl">🗑️</div>
              <div>
                <div class="font-semibold">Limpiar</div>
                <div class="text-sm text-white/90">Borra la palabra actual para empezar de nuevo.</div>
              </div>
            </div>
            <div class="bg-white/15 rounded-2xl p-4 border border-white/20 flex items-start gap-3">
              <div class="text-2xl">✅</div>
              <div>
                <div class="font-semibold">Enviar Palabra</div>
                <div class="text-sm text-white/90">Intenta validar la palabra construida. Debe existir y tener al menos 3 letras.</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white/10 rounded-2xl p-4 border border-white/20">
          <h3 class="font-semibold mb-2">Consejos</h3>
          <ul class="list-disc list-inside text-white/90 text-sm space-y-1">
            <li>Empieza por palabras cortas para calentar y descubre combinaciones.</li>
            <li>Prioriza palabras largas para aprovechar los bonus.</li>
            <li>Observa el progreso y las palabras restantes para planificar.</li>
          </ul>
        </div>

        <div class="text-right pt-2">
          <button
            @click="$emit('close')"
            class="px-5 py-2 bg-white/20 hover:bg-white/30 rounded-full border border-white/30 font-semibold transition-colors"
          >
            ¡Entendido!
          </button>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelpModal',
  emits: ['close']
}
</script>


