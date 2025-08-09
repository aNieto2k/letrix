<template>
  <div
    v-if="canInstall && isMobile && !isInstalled"
    class="fixed inset-x-0 bottom-4 z-50 px-4"
  >
    <div class="mx-auto max-w-md rounded-2xl shadow-lg bg-white text-gray-900 p-4 border border-gray-200">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">L</div>
        <div class="flex-1">
          <p class="font-semibold">Instala Letrix</p>
          <p class="text-sm text-gray-600">Acceso rápido desde tu pantalla de inicio</p>
        </div>
        <button
          @click="install"
          class="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
        >Instalar</button>
      </div>
    </div>
  </div>
  
  <div v-else-if="iosStandaloneHint" class="fixed inset-x-0 bottom-4 z-50 px-4">
    <div class="mx-auto max-w-md rounded-2xl shadow-lg bg-white text-gray-900 p-4 border border-gray-200">
      <p class="text-sm">
        Para instalar en iOS: toca el icono Compartir y luego «Añadir a pantalla de inicio».
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

export default {
  name: 'InstallPrompt',
  setup() {
    const deferredPrompt = ref(null)
    const isInstalled = ref(false)
    const canInstall = ref(false)

    const isMobile = computed(() => {
      if (typeof navigator === 'undefined') return false
      const ua = navigator.userAgent || navigator.vendor || ''
      const isAndroid = /android/i.test(ua)
      const isIOS = /iPad|iPhone|iPod/.test(ua)
      return isAndroid || isIOS
    })

    const isIOS = computed(() => /iPad|iPhone|iPod/.test(navigator.userAgent || ''))
    const isInStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
    const iosStandaloneHint = computed(() => isIOS.value && !isInStandalone() && !canInstall.value)

    const beforeInstallPromptHandler = (e) => {
      e.preventDefault()
      deferredPrompt.value = e
      canInstall.value = true
    }

    const appInstalledHandler = () => {
      isInstalled.value = true
      canInstall.value = false
      deferredPrompt.value = null
    }

    const install = async () => {
      if (!deferredPrompt.value) return
      deferredPrompt.value.prompt()
      const { outcome } = await deferredPrompt.value.userChoice
      if (outcome === 'accepted') {
        isInstalled.value = true
      }
      deferredPrompt.value = null
      canInstall.value = false
    }

    onMounted(() => {
      window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler)
      window.addEventListener('appinstalled', appInstalledHandler)
      if (isInStandalone()) isInstalled.value = true
    })

    onBeforeUnmount(() => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler)
      window.removeEventListener('appinstalled', appInstalledHandler)
    })

    return { install, canInstall, isInstalled, isMobile, iosStandaloneHint }
  }
}
</script>

<style scoped>
</style>


