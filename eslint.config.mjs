import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
import react from "eslint-plugin-react";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.config({
    extends: ["eslint:recommended", "prettier"],
    rules: {
      semi: ["error"],
    },
    globals: { ...globals.browser, ...globals.node, ...globals.jest },
  }),
];

export default eslintConfig;
