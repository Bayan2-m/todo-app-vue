import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/TodoList/',     // <-- هذا السطر هو يلي أضفناه
  plugins: [vue()],
})