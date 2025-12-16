import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Core React runtime (required immediately)
            if (id.includes('react-dom') || (id.includes('/react/') && !id.includes('react-router'))) {
              return 'vendor-react';
            }
            // React Router (can be deferred slightly but needed for routing)
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            // Form handling libraries (only needed after form interaction)
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
              return 'vendor-forms';
            }
            // Supabase client (only needed for form submission)
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // TanStack Query (state management)
            if (id.includes('@tanstack')) {
              return 'vendor-query';
            }
            // Radix UI core primitives (UI components)
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            // Icons (tree-shakeable, loaded with components)
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
          }
        }
      }
    },
    target: 'es2020',
    minify: mode === 'production' ? 'terser' : 'esbuild',
    cssCodeSplit: true,
    // Increase chunk size warning for vendor chunks
    chunkSizeWarningLimit: 300,
    ...(mode === 'production' && {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          passes: 2,
          pure_funcs: ['console.log', 'console.info', 'console.debug']
        },
        mangle: {
          safari10: true
        },
        format: {
          comments: false
        }
      }
    })
  }
}));
