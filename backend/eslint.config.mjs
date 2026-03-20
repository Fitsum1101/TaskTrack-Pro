import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['node_modules', 'generated/prisma', '.prisma'],
  },

  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node,
    },

    rules: {
      // 🔴 Errors
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',

      // 🟡 Safety / best practice
      eqeqeq: 'error',
      curly: 'error',

      // 🟢 Style (minimal — don’t fight Prettier)
      semi: ['error', 'always'],
      quotes: ['error', 'single'],

      // ⚡ Node-friendly
      'no-console': 'off',
      'no-debugger': 'warn',
    },
  },
]);
