const prettierCommand = "prettier --write";
const webEslintCommand =
  "eslint --config apps/web/eslint.config.mjs --fix --max-warnings=0";
const uiEslintCommand =
  "eslint --config packages/ui/eslint.config.mjs --fix --max-warnings=0";

export default {
  "apps/web/**/*.{js,jsx,mjs,ts,tsx}": [webEslintCommand, prettierCommand],
  "packages/ui/**/*.{js,jsx,mjs,ts,tsx}": [uiEslintCommand, prettierCommand],
  "*.{css,json,md,mjs,yaml,yml}": [prettierCommand],
};
