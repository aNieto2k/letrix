<template>
  <div class="mb-8">
    

    <!-- Words List -->
    <div v-if="words.length > 0" class="max-w-2xl mx-auto">
      <!-- Words Grid -->
      <div class="grid grid-cols-1 gap-3">
        <div
          v-for="(word, index) in sortedWords"
          :key="word"
          class="glass-effect rounded-xl p-3 animate-slide-up"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <div class="text-lg font-bold text-white">{{ word }}</div>
        </div>
      </div>
    </div>

    <div v-else></div>

  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'FoundWords',
  props: {
    words: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const sortedWords = computed(() => {
      return [...props.words].sort((a, b) => b.length - a.length)
    })

    return {
      sortedWords,
    }
  }
}
</script>
