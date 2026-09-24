import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const migrationWarnings = new Set([
  "@typescript-eslint/no-explicit-any",
  "react/no-unescaped-entities",
  "@typescript-eslint/no-unused-vars",
  "react-hooks/purity",
  "react-hooks/set-state-in-effect",
  "@typescript-eslint/no-require-imports",
  "react-hooks/exhaustive-deps",
  "@next/next/no-html-link-for-pages",
  "react-hooks/immutability",
  "@next/next/no-img-element",
  "@typescript-eslint/ban-ts-comment",
  "prefer-const",
  "@next/next/no-location-assign-relative-destination",
  "react-hooks/refs",
]);

const migrationBaseline = nextCoreWebVitals.map((config) => {
  const rules = { ...config.rules };
  for (const rule of Object.keys(rules)) {
    if (migrationWarnings.has(rule)) rules[rule] = "warn";
  }
  return { ...config, rules };
});

export default defineConfig([
  ...migrationBaseline,
  globalIgnores([".next/**", "out/**", "dist/**", "build/**", "next-env.d.ts"]),
]);
