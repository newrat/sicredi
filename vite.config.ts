import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Garante que a build final fique no diretório dist
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Resolve a pasta src
    },
  },
  root: "./", // Define a raiz do projeto como a pasta atual (onde está o index.html)
});
