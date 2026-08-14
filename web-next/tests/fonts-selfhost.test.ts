/**
 * 契約テスト: Noto Sans JP の完全自前ホスト。
 *
 * 背景 (Netlify ビルド失敗 / Turbopack "496 errors"):
 * - next/font/google は CSS に載っている @font-face を **全件** ビルド時に
 *   fonts.gstatic.com からダウンロードする。`subsets` は preload 対象の
 *   判定に使われるだけで、ダウンロード数を減らさない
 *   (node_modules/next/dist/compiled/@next/font/dist/google/find-font-files-in-css.js)。
 * - Noto Sans JP は CJK を unicode-range で 124 分割し、weight 4 種を
 *   掛けた 496 @font-face を返す。この 496 本のバーストが Netlify の
 *   ビルドコンテナから失敗し、Turbopack が 496 errors で停止していた。
 * - 対策: woff2 と @font-face CSS をリポジトリへ vendor し、ビルド時の
 *   外部ネットワーク依存をゼロにする (生成は scripts/vendor-noto-sans-jp.ts)。
 *
 * ここでは「再びリモート取得へ戻っていないこと」を機械検知する。
 */

import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { notoSansJpPreloadHrefs } from "@/lib/noto-sans-jp-preload";

const repoRoot = join(__dirname, "..");
const fontCssPath = join(repoRoot, "public/fonts/noto-sans-jp.css");

/** Google Fonts API が返す Noto Sans JP の @font-face 総数 (124 slice × 4 weight)。 */
const EXPECTED_FACE_COUNT = 496;
/** 実体の woff2 ファイル数。可変フォントのため 4 weight が同一ファイルを共有する。 */
const EXPECTED_FILE_COUNT = 124;
const EXPECTED_WEIGHTS = [300, 400, 500, 700];

type FontFace = {
  block: string;
  weight: number;
  url: string;
};

let fontCss = "";
let faces: FontFace[] = [];
let fontsTs = "";
let globalsCss = "";
let layoutTsx = "";
let vendorScript = "";

beforeAll(() => {
  fontCss = existsSync(fontCssPath) ? readFileSync(fontCssPath, "utf8") : "";
  faces = Array.from(fontCss.matchAll(/@font-face\s*\{([^}]*)\}/g)).map((match) => {
    const block = match[1];
    const weight = Number(/font-weight:\s*(\d+)/.exec(block)?.[1] ?? Number.NaN);
    const url = /src:\s*url\(([^)]+)\)/.exec(block)?.[1] ?? "";
    return { block, weight, url };
  });
  fontsTs = readFileSync(join(repoRoot, "lib/fonts.ts"), "utf8");
  globalsCss = readFileSync(join(repoRoot, "app/globals.css"), "utf8");
  layoutTsx = readFileSync(join(repoRoot, "app/layout.tsx"), "utf8");
  vendorScript = readFileSync(join(repoRoot, "scripts/vendor-noto-sans-jp.ts"), "utf8");
});

describe("self-hosted Noto Sans JP - vendored stylesheet", () => {
  it("ships public/fonts/noto-sans-jp.css", () => {
    expect(existsSync(fontCssPath)).toBe(true);
  });

  it("declares every @font-face returned by Google Fonts", () => {
    expect(faces).toHaveLength(EXPECTED_FACE_COUNT);
  });

  it("covers exactly the weights configured for the body font", () => {
    const weights = [...new Set(faces.map((face) => face.weight))].sort((a, b) => a - b);
    expect(weights).toEqual(EXPECTED_WEIGHTS);
    for (const weight of EXPECTED_WEIGHTS) {
      expect(faces.filter((face) => face.weight === weight)).toHaveLength(EXPECTED_FILE_COUNT);
    }
  });

  it("never points at a remote origin", () => {
    // 由来 URL は先頭のコメントに残す (再生成の手掛かり) ため、
    // 検査対象は @font-face ブロックと url() 参照に限定する。
    for (const face of faces) {
      expect(face.block).not.toContain("fonts.gstatic.com");
      expect(face.block).not.toContain("fonts.googleapis.com");
      expect(face.block).not.toContain("//");
    }
    expect(fontCss).not.toMatch(/url\(\s*["']?https?:/);
    expect(fontCss).not.toMatch(/@import/);
  });

  it("resolves every src to a woff2 file that exists in public/", () => {
    const urls = faces.map((face) => face.url);
    expect(urls.every((url) => url.startsWith("/fonts/noto-sans-jp/"))).toBe(true);
    expect(urls.every((url) => url.endsWith(".woff2"))).toBe(true);

    const unique = [...new Set(urls)];
    expect(unique).toHaveLength(EXPECTED_FILE_COUNT);
    for (const url of unique) {
      const filePath = join(repoRoot, "public", url.replace(/^\//, ""));
      expect(existsSync(filePath), `missing ${url}`).toBe(true);
      expect(statSync(filePath).size, `empty ${url}`).toBeGreaterThan(0);
    }
  });

  it("keeps swap display and unicode-range on every face", () => {
    for (const face of faces) {
      expect(face.block).toContain("font-display: swap");
      expect(face.block).toContain("unicode-range:");
      expect(face.block).toContain('font-family: "Noto Sans JP"');
    }
  });
});

describe("self-hosted Noto Sans JP - wiring", () => {
  it("removes Noto Sans JP from the build-time next/font/google downloads", () => {
    expect(fontsTs).not.toContain("Noto_Sans_JP");
    expect(fontsTs).not.toContain("notoSansJp");
  });

  it("keeps the latin-only fonts on next/font/google", () => {
    expect(fontsTs).toContain("JetBrains_Mono");
    expect(fontsTs).toContain("Syne");
  });

  it("defines --font-sans in globals.css :root instead of next/font", () => {
    const rootBlock = /:root\s*\{([\s\S]*?)\n\}/.exec(globalsCss)?.[1] ?? "";
    expect(rootBlock).toMatch(/--font-sans:\s*"Noto Sans JP"/);
  });

  it("loads the vendored stylesheet from the root layout", () => {
    expect(layoutTsx).toMatch(/<link[^>]*rel="stylesheet"[^>]*href="\/fonts\/noto-sans-jp\.css"/);
    // next/font 由来の変数注入 (notoSansJp.variable) が復活していないこと。
    // preload リスト (notoSansJpPreloadHrefs) の参照は自前ホスト側の実装なので許容する。
    expect(layoutTsx).not.toMatch(/\bnotoSansJp\.variable\b/);
    expect(layoutTsx).not.toMatch(/\bnotoSansJp\b(?!PreloadHrefs)/);
  });

  it("preloads the latin slice to keep parity with next/font subsets", () => {
    const latinUrls = [
      ...new Set(
        Array.from(
          fontCss.matchAll(/\/\*\s*latin\s*\*\/\s*@font-face\s*\{[\s\S]*?src:\s*url\(([^)]+)\)/g),
          (match) => match[1]
        )
      ),
    ];

    expect([...notoSansJpPreloadHrefs]).toEqual(latinUrls);
    expect(layoutTsx).toMatch(/rel="preload"[^>]*as="font"/);
  });

  it("stages every generated artifact before replacing the current generation", () => {
    const mainBody = vendorScript.slice(vendorScript.indexOf("async function main()"));
    const publicationOrder = Array.from(
      mainBody.matchAll(
        /mkdtempSync\(|downloadAll\(filesByName,\s*stagedOutDir\)|writeFileSync\(stagedCssOut,|writeFileSync\(stagedPreloadOut,|promoteStagedGeneration\(/g
      ),
      (match) => {
        if (match[0].includes("stagedCssOut")) return "write staged CSS";
        if (match[0].includes("stagedPreloadOut")) return "write staged preload";
        return match[0].replace(/\(.*/, "");
      }
    );

    expect(publicationOrder).toEqual([
      "mkdtempSync",
      "downloadAll",
      "write staged CSS",
      "write staged preload",
      "promoteStagedGeneration",
    ]);
  });
});
