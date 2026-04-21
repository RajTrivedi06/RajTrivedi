import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/RajTrivedi/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-animation": ["gsap", "lenis"],
          "vendor-motion": ["motion"],
          "vendor-ui": [
            "@radix-ui/react-icons",
            "@radix-ui/react-tooltip",
            "lucide-react",
          ],
        },
      },
    },
    // Minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    // Source maps for debugging (disabled for production)
    sourcemap: false,
    // Target modern browsers
    target: "es2020",
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["gsap", "lenis", "motion"],
  },
});
