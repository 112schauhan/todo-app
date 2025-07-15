/* eslint-env node */
import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), "")
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT),
    },
  }
})
