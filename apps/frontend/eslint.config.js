// apps/frontend/eslint.config.js

import eslintPluginNext from "@next/eslint-plugin-next";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      next: eslintPluginNext,
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      ...eslintPluginNext.configs["core-web-vitals"].rules,
    },
  },
];
