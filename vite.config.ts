import { defineConfig } from "vite";

export default defineConfig({
  // Set base path for GitHub Pages deployment
  base: process.env.NODE_ENV === "production" ? "/mola-parking/" : "/",

  // Build configuration
  build: {
    outDir: "dist",
    sourcemap: true,
  },

  // Development server configuration
  server: {
    port: 3000,
    open: true,
  },
});
