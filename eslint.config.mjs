import nextPlugin from '@next/eslint-plugin-next';
import anyConfig from 'eslint-config-any';
import { defineConfig } from 'eslint/config';

const JS_TS_GLOB = ['**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}'];

export default defineConfig([
  ...anyConfig.react,
  {
    files: JS_TS_GLOB,
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
]);
