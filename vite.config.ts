import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@lib": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "ReactFormKrafter",
      fileName: (format) => `react-form-krafter.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "@standard-schema/spec"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@standard-schema/spec": "StandardSchema",
        },
      },
    },
  },
});
