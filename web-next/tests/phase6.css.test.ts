/**
 * Phase 6 契約テスト (globals.css + next/font 移植)。
 *
 * 検証方針:
 * - vitest は css: false なので computed style は使えない。
 * - next/font/google は Next.js のビルドタイム loader で vitest から
 *   直接 import すると loader コンテキスト未設定でクラッシュする。
 * - したがって「ファイル内容の文字列契約」でポートの事実を固定する。
 *
 * 対象:
 * 1. app/globals.css   - legacy web/src/index.css の design tokens と
 *                        全クラスが移植されていること
 * 2. lib/fonts.ts      - next/font/google で 3 フォントが設定され、
 *                        CSS 変数名 (--font-sans/mono/display) が
 *                        公開されていること
 * 3. app/layout.tsx    - lib/fonts.ts 経由でフォントを読み込み、
 *                        Geist scaffold が残っていないこと
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

const repoRoot = join(__dirname, "..");

let globalsCss = "";
let fontsTs = "";
let layoutTsx = "";

beforeAll(() => {
  // ファイル未存在時は readFileSync が throw するが、Red フェーズでは
  // それ自体が「まだ実装されていない」サインなので明示的には try しない。
  globalsCss = readFileSync(join(repoRoot, "app/globals.css"), "utf8");
  fontsTs = readFileSync(join(repoRoot, "lib/fonts.ts"), "utf8");
  layoutTsx = readFileSync(join(repoRoot, "app/layout.tsx"), "utf8");
});

describe("Phase 6 - globals.css tailwind + self-hosted fonts", () => {
  it("keeps Tailwind v4 import directive", () => {
    expect(globalsCss).toContain('@import "tailwindcss"');
  });

  it("does not load fonts via Google Fonts CDN", () => {
    // next/font 経由で self-host するので CDN @import は禁止。
    expect(globalsCss).not.toContain("fonts.googleapis.com");
    expect(globalsCss).not.toContain("@import url(");
  });

  it("does not retain the scaffold Geist variable bindings", () => {
    expect(globalsCss).not.toContain("--font-geist-sans");
    expect(globalsCss).not.toContain("--font-geist-mono");
  });
});

describe("Phase 6 - globals.css design tokens", () => {
  const tokens = [
    "--bg:",
    "--bg2:",
    "--srf:",
    "--srf2:",
    "--brd:",
    "--brd2:",
    "--txt:",
    "--txt2:",
    "--txt3:",
    "--acc:",
    "--acc2:",
    "--grn:",
    "--grn2:",
    "--ylw:",
    "--ylw2:",
    "--red:",
    "--red2:",
    "--prp:",
    "--teal:",
    "--orng:",
  ];

  it.each(tokens)("defines token %s", (token) => {
    expect(globalsCss).toContain(token);
  });
});

describe("Phase 6 - globals.css component classes", () => {
  const classes = [
    ".lang-toggle",
    ".lang-btn",
    ".hero",
    ".hero-inner",
    ".hero-eyebrow",
    ".hero-desc",
    ".hero-meta",
    ".rate-badge",
    ".container",
    ".panel",
    ".panel-title",
    ".scenarios",
    ".scenario-btn",
    ".custom-panel",
    ".custom-grid",
    ".input-group",
    ".input-row",
    ".assumption-bar",
    ".tabs",
    ".tab-btn",
    ".table-wrap",
    ".group-header",
    ".model-cell",
    ".model-name",
    ".model-sub",
    ".model-tag",
    ".cost-wrap",
    ".cost-usd",
    ".cost-jpy",
    ".sub-flat",
    ".cheapest-row",
    ".cheapest-badge",
    ".note-box",
    ".time-badges",
    ".time-badge",
    ".math-section",
    ".math-title",
    ".math-grid",
    ".math-card",
    ".formula",
    ".ref-section",
    ".ref-title",
    ".ref-grid",
    ".ref-card",
    ".ref-link",
    ".section",
    ".section-tabs",
    ".cell-note-label",
    ".disclaimer-box",
  ];

  it.each(classes)("ports component class %s", (cls) => {
    expect(globalsCss).toContain(cls);
  });
});

describe("Phase 6 - globals.css color scale classes", () => {
  it("ports cc-0 through cc-10 dual currency classes", () => {
    for (let i = 0; i <= 10; i++) {
      expect(globalsCss, `missing .cc-${i}`).toContain(`.cc-${i}`);
      expect(globalsCss, `missing .jpy-${i}`).toContain(`.jpy-${i}`);
    }
  });

  it("ports all tag classes", () => {
    const tags = [
      ".tag-flag",
      ".tag-bal",
      ".tag-mini",
      ".tag-rsn",
      ".tag-leg",
      ".tag-oss",
      ".tag-vtx",
      ".tag-jb",
      ".tag-ag",
    ];
    for (const tag of tags) {
      expect(globalsCss, `missing ${tag}`).toContain(tag);
    }
  });
});

describe("Phase 6 - fonts configuration (lib/fonts.ts)", () => {
  it("imports from next/font/google", () => {
    expect(fontsTs).toContain("next/font/google");
  });

  it("configures Noto Sans JP and exposes --font-sans variable", () => {
    expect(fontsTs).toContain("Noto_Sans_JP");
    expect(fontsTs).toContain("--font-sans");
  });

  it("configures JetBrains Mono and exposes --font-mono variable", () => {
    expect(fontsTs).toContain("JetBrains_Mono");
    expect(fontsTs).toContain("--font-mono");
  });

  it("configures Syne and exposes --font-display variable", () => {
    expect(fontsTs).toContain("Syne");
    expect(fontsTs).toContain("--font-display");
  });
});

describe("Phase 6 - layout integration", () => {
  it("layout.tsx imports fonts from @/lib/fonts barrel", () => {
    expect(layoutTsx).toMatch(/from\s+["']@\/lib\/fonts["']/);
  });

  it("layout.tsx no longer references Geist scaffold fonts", () => {
    expect(layoutTsx).not.toContain("Geist");
    expect(layoutTsx).not.toContain("geist-sans");
  });

  it("layout.tsx applies font variables to the html element", () => {
    // next/font の variable はテンプレリテラルで className に埋め込む慣例。
    expect(layoutTsx).toMatch(/\.variable/);
  });
});
