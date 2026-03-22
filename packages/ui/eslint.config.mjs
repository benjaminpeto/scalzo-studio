import { dirname } from "path";
import { fileURLToPath } from "url";

import { createNextEslintConfig } from "../config/eslint/next.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default createNextEslintConfig(__dirname, {
  ignores: ["dist/**"],
  settings: {
    next: {
      rootDir: ["../../apps/web", "apps/web"],
    },
  },
});
