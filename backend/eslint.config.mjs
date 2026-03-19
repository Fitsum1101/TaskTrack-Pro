import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['node_modules/**', 'generated/prisma/**', '.prisma/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.node, // ✅ switch to node instead of browser
      ecmaVersion: 'latest',
    },
    rules: {
      // 🔴 Possible errors
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-console': 'off', // allow console in backend
      'no-debugger': 'warn',

      // 🟡 Best practices
      eqeqeq: ['error', 'always'],
      curly: 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',

      // 🟢 Code style (light, let prettier handle most)
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'comma-dangle': ['error', 'only-multiline'],

      // ⚡ Node.js specific improvements
      'handle-callback-err': 'warn',
      'no-path-concat': 'error',

      // 🧼 Clean code habits
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
    },
  },

  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs', // for Node (require/module.exports)
    },
  },
]);
