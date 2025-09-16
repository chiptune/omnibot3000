import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default tseslint.config(
  {ignores: ["dist"]},
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-hooks/exhaustive-deps": "off", // to fix later
      "@typescript-eslint/no-unused-vars": ["warn", {argsIgnorePattern: "^_"}],
      /*"@typescript-eslint/no-undef": ["error", {argsIgnorePattern: "^__.*__$"}],*/
      "import/first": "error",
      "import/no-unresolved": "off",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "no-console": ["error", {allow: ["info", "warn", "error"]}],
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^(vite.*)(/.*|$)"],
            ["^(react.*|zustand)(/.*|$)"],
            ["^(openai)(/.*|$)"],
            ["^(@mui.*)(/.*|$)"],
            ["^(@root)(/.*|$)"],
            ["^(@api|@commons|@layout|@ui|@utils)(/.*|$)"],
            ["^(@hooks)(/.*|$)"],
            ["^(@styles)(/.*|$)"],
            ["^(@home|@chat|@history|@console|@help)(/.*|$)"],
            ["^(@)(/.*|$)"],
            ["^\\u0000"],
            // parent imports. put ".." last
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // other relative imports. put same folder imports and "." last
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // style imports
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
);
