import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "dist"],
    css: false,
    coverage: {
      // SonarQube Cloud 連携用に lcov を出力（reportsDirectory 配下に lcov.info）
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      // 計測対象はアプリ本体のみ（テスト・型定義・設定は除外）
      include: ["app/**", "components/**", "lib/**"],
      exclude: ["**/*.test.{ts,tsx}", "tests/**", "**/*.d.ts", "types/**"],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
