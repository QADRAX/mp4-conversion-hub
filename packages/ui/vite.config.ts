import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import fs from 'fs';
import path from 'path';

const rootPackagePath = path.resolve(__dirname, '../../package.json');
const rootPackageJson = JSON.parse(fs.readFileSync(rootPackagePath, 'utf-8'));
const appVersion = rootPackageJson.version;

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  plugins: [preact()],
  build: {
    outDir: 'dist',
  },
});