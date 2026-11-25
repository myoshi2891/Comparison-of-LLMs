import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

global.IntersectionObserver = class {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as unknown as typeof IntersectionObserver;

// jsdom は matchMedia を実装しない。既定では (max-width: Npx) を現在の innerWidth で評価する
// （個別テストが window.matchMedia を差し替えた場合はそちらが優先される）。
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = ((query: string) => ({
    get matches() {
      const max = /\(max-width:\s*(\d+(?:\.\d+)?)px\)/.exec(query);
      return max ? window.innerWidth <= Number(max[1]) : false;
    },
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

// 各テスト後に DOM をクリーンアップ（RTL のデフォルト動作を明示化）
afterEach(() => {
  cleanup();
});
