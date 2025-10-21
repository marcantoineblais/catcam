import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Typescript and Next.js files
  ...compat
    .config({
      extends: ["prettier", "next/core-web-vitals", "next/typescript", "next"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
      },
    })
    .map((config) => ({ ...config, files: ["**/*.{ts,tsx,cts,mts}"] })),

  // Standard JavaScript files
  {
    files: ["**/*.{js,cjs}"],
    ...js.configs.recommended,
    rules: {
      "no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }],
      "no-console": "off",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
