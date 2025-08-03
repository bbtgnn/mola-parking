import { defineConfig } from "vite";

export default defineConfig({
  // Set base path for GitHub Pages deployment
  // Uses BASE_PATH environment variable or defaults to repo name
  base: (() => {
    if (process.env.BASE_PATH) {
      // Ensure BASE_PATH has trailing slash
      return process.env.BASE_PATH.endsWith("/")
        ? process.env.BASE_PATH
        : process.env.BASE_PATH + "/";
    }
    return process.env.NODE_ENV === "production" ? "/mola-parking/" : "/";
  })(),

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
