import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const hideDebug = env.HIDE_DEBUG === '1' || env.HIDE_DEBUG === 'true'

  return {
    plugins: [
      vue(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [],
        devOptions: {
          enabled: true
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        },
        manifest: {
          name: 'Letrix - Juego de Palabras',
          short_name: 'Letrix',
          description: 'Juego diario de palabras en español. Encuentra todas las palabras posibles con las letras dadas.',
          start_url: '.',
          scope: '.',
          display: 'standalone',
          lang: 'es',
          background_color: '#0f172a',
          theme_color: '#7c3aed',
          icons: []
        }
      })
    ],
    define: {
      __HIDE_DEBUG__: JSON.stringify(hideDebug)
    },
    server: {
      port: 3000,
      open: true
    }
  }
})
