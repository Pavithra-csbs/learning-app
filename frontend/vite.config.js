import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:5020',
      '/student': 'http://localhost:5020',
      '/quiz': 'http://localhost:5020',
      '/puzzle': 'http://localhost:5020',
      '/teacher': 'http://localhost:5020',
      '/leaderboard': 'http://localhost:5020',
      '/ai-chat': 'http://localhost:5020',
      '/feedback': 'http://localhost:5020',
      '/api': 'http://localhost:5020',
      '/socket.io': {
        target: 'http://localhost:5020',
        ws: true,
      },
    },
  },
})
