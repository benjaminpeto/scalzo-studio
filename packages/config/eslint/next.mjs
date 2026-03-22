import { FlatCompat } from "@eslint/eslintrc";

export function createNextEslintConfig(baseDirectory, options = {}) {
  const compat = new FlatCompat({
    baseDirectory,
  });

  return [
    {
      ignores: [".next/**", "out/**", ...(options.ignores ?? [])],
      rules: {
        "@next/next/no-html-link-for-pages": "off",
        ...(options.rules ?? {}),
      },
    },
    ...compat.extends("next/core-web-vitals", "next/typescript"),
  ];
}
