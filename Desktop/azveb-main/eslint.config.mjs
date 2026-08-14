import nextPlugin from "next/dist/compiled/@next/eslint-plugin-next/index.js";

export default [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    ignores: [".next/*", "node_modules/*", "coverage/*"],
  },
];
