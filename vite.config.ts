import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      entryRoot: "src", // must match baseUrl
      pathsToAliases: true,
      compilerOptions: {
        paths: {
          "@lib/*": ["./*"]
        }
      },
      insertTypesEntry: true,
    }),
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
      formats: ["es", "cjs"],
      fileName: (format) =>
        format === "cjs"
          ? "react-form-krafter.cjs"
          : "react-form-krafter.es.js",
    },
    rollupOptions: {
      // Fully externalize React and related runtime
      external: [/^react($|\/)/, /^react-dom($|\/)/, "@standard-schema/spec"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@standard-schema/spec": "StandardSchema",
        },
      },
    },
  },
  define: {
    __DEV__: mode !== "production", // strip dev warnings in production
  },
}));
