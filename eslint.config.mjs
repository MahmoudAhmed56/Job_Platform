import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Custom rules
    rules: {
      // Warn on console.log but allow other console methods
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      
      // Error on unused variables (TypeScript version)
      "@typescript-eslint/no-unused-vars": "error",
      
      // Optional: Disable base ESLint rule if needed
      "no-unused-vars": "off"
    }
  }
];

export default eslintConfig;
