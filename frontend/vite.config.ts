// vite.config.js
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		host: 'localhost', // Forces the server to use 'localhost'
		port: 5173,
		strictPort: true, // Prevents Vite from switching to 5174 if 5173 is "busy"
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
