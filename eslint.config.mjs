import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.config({
    extends: ["eslint:recommended", "prettier", "next"],
    rules: {
      semi: ["error"],
    },
    globals: { ...globals.browser, ...globals.node, ...globals.jest },
  }),
  {
    ignores: [
      ".config/*",
      "node_modules",
      ".next",
      ".swc",
      ".vscode",
      "infra/migrations/*",
    ],
  },
];

export default eslintConfig;
