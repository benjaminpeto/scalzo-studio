import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["actions/**/*.test.ts", "hooks/**/*.test.ts", "**/*.test.tsx"],
    setupFiles: ["./test/setup.tsx"],
  },
});
