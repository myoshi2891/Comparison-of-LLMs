import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

global.IntersectionObserver = class {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as unknown as typeof IntersectionObserver;

// 各テスト後に DOM をクリーンアップ（RTL のデフォルト動作を明示化）
afterEach(() => {
  cleanup();
});
