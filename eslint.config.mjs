import nextPlugin from "@next/eslint-plugin-next";
import any from "eslint-config-any";
import globals from "globals";

const JS_TS_GLOB = ["**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}"];

export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "coverage/**",
      "next-env.d.ts",
      "**/*.md",
      "**/*.mdx",
      "bun.lock",
    ],
  },

  ...any.react,

  {
    files: JS_TS_GLOB,
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  {
    files: JS_TS_GLOB,
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
];
