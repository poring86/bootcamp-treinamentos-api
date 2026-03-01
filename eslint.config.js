import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node }
  },
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-unused-vars": "off", // Desliga a regra do JS puro para não duplicar

      // Ordenação de imports
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    }
  }
]);
