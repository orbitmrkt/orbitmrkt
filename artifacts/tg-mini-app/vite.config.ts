import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vite';
import javaScriptObfuscator from 'vite-plugin-javascript-obfuscator';

const rawPort = process.env.PORT || '5000';
const port = Number(rawPort) || 5000;
const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    svgr(),
    tailwindcss(),
    // Obfuscate only in production builds
    ...(process.env.NODE_ENV === 'production'
      ? [
          javaScriptObfuscator({
            options: {
              compact: true,
              controlFlowFlattening: true,
              controlFlowFlatteningThreshold: 0.5,
              deadCodeInjection: false,
              debugProtection: false,
              disableConsoleOutput: false,
              identifierNamesGenerator: 'hexadecimal',
              log: false,
              renameGlobals: false,
              rotateStringArray: true,
              selfDefending: false,
              shuffleStringArray: true,
              splitStrings: true,
              splitStringsChunkLength: 10,
              stringArray: true,
              stringArrayEncoding: ['base64'],
              stringArrayThreshold: 0.75,
              unicodeEscapeSequence: false,
            },
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
    sourcemap: false,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
