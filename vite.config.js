import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const hideDebug = env.HIDE_DEBUG === '1' || env.HIDE_DEBUG === 'true'

  return {
    plugins: [vue()],
    define: {
      __HIDE_DEBUG__: JSON.stringify(hideDebug)
    },
    server: {
      port: 3000,
      open: true
    }
  }
})
