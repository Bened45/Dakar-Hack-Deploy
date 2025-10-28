import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/chatbot': {
        target: 'https://bitbot-1.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/chatbot/, ''),
      },
      '/api': {
        target: 'https://backend-s7gk.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  plugins: [react()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ✅ Section ajoutée pour optimiser le build
  build: {
    // Supprime le warning de taille de chunk
    chunkSizeWarningLimit: 1500,

    // Découpage intelligent des bundles
    rollupOptions: {
      output: {
        manualChunks: {
          // Sépare React dans son propre chunk
          react: ["react", "react-dom"],

          ui: ["lucide-react", "react-icons"],

          vendor: [
            "axios",
            "framer-motion",
            "recharts",
          ],
        },
      },
    },
  },
}));
