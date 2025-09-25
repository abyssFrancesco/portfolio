// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // ignora la build
  globalIgnores(['dist']),

  // Frontend (browser): solo src/** e i file di vite
  {
    files: ['src/**/*.{js,jsx}', 'vite.config.{js,ts}', 'index.html'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]'}],
    },
  },

  // API (Node): tutto sotto /api è codice server
  {
    files: ['api/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',           // ESM
      globals: {
        ...globals.node,              // process, Buffer, __dirname, ecc.
        fetch: 'readonly',            // Node 18+ ha fetch globale
        Request: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',            // utile per log in serverless
    },
  },
])