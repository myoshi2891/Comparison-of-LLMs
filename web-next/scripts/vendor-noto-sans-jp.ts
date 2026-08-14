/**
 * Noto Sans JP を Google Fonts からリポジトリへ vendor する生成スクリプト。
 *
 * 実行: cd web-next && bun scripts/vendor-noto-sans-jp.ts
 *
 * 背景:
 *   next/font/google は @font-face を全件ビルド時にダウンロードする。
 *   Noto Sans JP は CJK を unicode-range で 124 分割し weight 4 種を掛けた
 *   496 @font-face を返すため、CI (Netlify) のビルドコンテナから
 *   fonts.gstatic.com への 496 本のバーストが失敗し、Turbopack が
 *   "Can't resolve '@vercel/turbopack-next/internal/font/google/font'" で停止していた。
 *
 * 出力 (いずれも生成物。手で編集しない):
 *   - public/fonts/noto-sans-jp/<hash>.woff2   実体 (124 ファイル / 4 weight で共有)
 *   - public/fonts/noto-sans-jp.css            @font-face 定義 (496 件)
 *   - lib/noto-sans-jp-preload.ts              latin slice の preload 対象
 *
 * 出力は決定論的 (Google が返す CSS の順序と、gstatic 側のコンテンツハッシュ
 * ファイル名をそのまま踏襲する) なので、再実行しても差分は出ない。
 */

import { existsSync, mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FONT_FAMILY = "Noto Sans JP";
const WEIGHTS = ["300", "400", "500", "700"];
const CSS_URL = `https://fonts.googleapis.com/css2?family=${FONT_FAMILY.replace(/ /g, "+")}:wght@${WEIGHTS.join(";")}&display=swap`;
/** woff2 入りの CSS を得るために必要 (UA によって Google が返す形式が変わる)。 */
const WOFF2_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36";
/** 同時ダウンロード数。gstatic のレート制限を避けるため小さく保つ。 */
const CONCURRENCY = 6;

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDirRelative = "fonts/noto-sans-jp";
const outDir = join(repoRoot, "public", outDirRelative);
const cssOut = join(repoRoot, "public/fonts/noto-sans-jp.css");
const preloadOut = join(repoRoot, "lib/noto-sans-jp-preload.ts");

type ParsedFace = {
  subset: string;
  style: string;
  weight: string;
  unicodeRange: string;
  remoteUrl: string;
  fileName: string;
};

/**
 * Derives a local file name from a remote font URL.
 *
 * @param remoteUrl - The remote URL containing the file name
 * @returns The URL's final path segment, prefixed with `f` when it starts with `-`
 * @throws Error if the URL does not contain a file name
 */
function toFileName(remoteUrl: string): string {
  const base = remoteUrl.split("/").pop();
  if (!base) throw new Error(`cannot derive file name from ${remoteUrl}`);
  return base.startsWith("-") ? `f${base}` : base;
}

/**
 * Extracts a required declaration value from a CSS block.
 *
 * @param block - The CSS block containing the declaration
 * @param pattern - The pattern used to capture the declaration value
 * @param label - The declaration name used in the error message
 * @returns The trimmed declaration value
 */
function requireDeclaration(block: string, pattern: RegExp, label: string): string {
  const value = pattern.exec(block)?.[1];
  if (!value) throw new Error(`@font-face without ${label}:\n${block}`);
  return value.trim();
}

/**
 * Parses Google Fonts CSS into ordered font-face definitions.
 *
 * @param css - The Google Fonts CSS to parse
 * @returns The parsed font-face definitions, including subset, style, weight, Unicode range, remote URL, and local file name
 */
function parseFaces(css: string): ParsedFace[] {
  const faces: ParsedFace[] = [];
  let subset = "";
  // Google の CSS では /* subset */ コメントは直後の 1 件だけを指す。
  // CJK slice はコメントを持たないため、1 件消費したらラベルを空へ戻す
  // (引き継ぐと weight 境界で latin ラベルが 120 件の CJK slice に伝播する)。
  const tokenPattern = /\/\*\s*(.+?)\s*\*\/|@font-face\s*\{([\s\S]*?)\}/g;
  for (const token of css.matchAll(tokenPattern)) {
    const comment = token[1];
    if (comment !== undefined) {
      subset = comment;
      continue;
    }
    const block = token[2] ?? "";
    const remoteUrl = requireDeclaration(block, /src:\s*url\(([^)]+)\)/, "src url");
    faces.push({
      subset,
      style: requireDeclaration(block, /font-style:\s*([^;]+);/, "font-style"),
      weight: requireDeclaration(block, /font-weight:\s*([^;]+);/, "font-weight"),
      unicodeRange: requireDeclaration(block, /unicode-range:\s*([^;]+);/, "unicode-range"),
      remoteUrl,
      fileName: toFileName(remoteUrl),
    });
    subset = "";
  }
  return faces;
}

/**
 * Retrieves text content from a URL.
 *
 * @param url - The URL to request
 * @returns The response body as text
 */
async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": WOFF2_USER_AGENT } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return await res.text();
}

/**
 * Downloads font files and saves them to the destination directory.
 *
 * @param urls - A map of local file names to remote font URLs
 * @param destinationDir - The directory where downloaded files are saved
 */
async function downloadAll(urls: Map<string, string>, destinationDir: string): Promise<void> {
  const entries = [...urls.entries()];
  let cursor = 0;
  let done = 0;
  const workers = Array.from({ length: Math.min(CONCURRENCY, entries.length) }, async () => {
    while (cursor < entries.length) {
      const index = cursor;
      cursor += 1;
      const entry = entries[index];
      if (!entry) return;
      const [fileName, remoteUrl] = entry;
      const res = await fetch(remoteUrl, { headers: { "User-Agent": WOFF2_USER_AGENT } });
      if (!res.ok) throw new Error(`GET ${remoteUrl} -> ${res.status}`);
      const bytes = new Uint8Array(await res.arrayBuffer());
      if (bytes.byteLength === 0) throw new Error(`empty font file: ${remoteUrl}`);
      writeFileSync(join(destinationDir, fileName), bytes);
      done += 1;
      console.log(`  [${done}/${entries.length}] ${fileName} (${bytes.byteLength} bytes)`);
    }
  });
  await Promise.all(workers);
}

type StagedGeneration = {
  stagingRoot: string;
  stagedOutDir: string;
  stagedCssOut: string;
  stagedPreloadOut: string;
};

/**
 * Promotes a fully prepared generation to the current output locations.
 *
 * If promotion fails, restores the previously backed-up generation.
 *
 * @param generation - The staged font files and generated modules to publish
 */
function promoteStagedGeneration(generation: StagedGeneration): void {
  const backupRoot = join(generation.stagingRoot, "previous");
  mkdirSync(backupRoot);
  const artifacts = [
    { staged: generation.stagedOutDir, target: outDir, backup: join(backupRoot, "woff2") },
    { staged: generation.stagedCssOut, target: cssOut, backup: join(backupRoot, "font.css") },
    {
      staged: generation.stagedPreloadOut,
      target: preloadOut,
      backup: join(backupRoot, "preload.ts"),
    },
  ];
  const backedUp: typeof artifacts = [];
  const promoted: typeof artifacts = [];

  try {
    for (const artifact of artifacts) {
      if (!existsSync(artifact.target)) continue;
      renameSync(artifact.target, artifact.backup);
      backedUp.push(artifact);
    }
    for (const artifact of artifacts) {
      renameSync(artifact.staged, artifact.target);
      promoted.push(artifact);
    }
    rmSync(backupRoot, { recursive: true, force: true });
  } catch (error) {
    for (const artifact of promoted.reverse()) {
      rmSync(artifact.target, { recursive: true, force: true });
    }
    for (const artifact of backedUp.reverse()) {
      renameSync(artifact.backup, artifact.target);
    }
    throw error;
  }
}

/**
 * Generates CSS `@font-face` declarations that reference the vendored font files.
 *
 * @param faces - Parsed font-face definitions to include in the generated stylesheet
 * @returns The generated CSS stylesheet
 */
function renderCss(faces: ParsedFace[]): string {
  const lines = [
    "/*",
    " * 自動生成ファイル — 直接編集しない。",
    " * 生成: cd web-next && bun scripts/vendor-noto-sans-jp.ts",
    ` * 由来: ${CSS_URL}`,
    " *",
    " * next/font/google はビルド時に fonts.gstatic.com から全 @font-face 分の",
    " * woff2 を取得するため、CI で 496 本のバーストが失敗していた。",
    " * ここに vendor することでビルド時の外部ネットワーク依存をゼロにする。",
    " */",
    "",
  ];
  for (const face of faces) {
    if (face.subset !== "") {
      lines.push(`/* ${face.subset} */`);
    }
    lines.push(
      "@font-face {",
      `  font-family: "${FONT_FAMILY}";`,
      `  font-style: ${face.style};`,
      `  font-weight: ${face.weight};`,
      "  font-display: swap;",
      `  src: url(/${outDirRelative}/${face.fileName}) format("woff2");`,
      `  unicode-range: ${face.unicodeRange};`,
      "}",
      ""
    );
  }
  return lines.join("\n");
}

/**
 * Generates a TypeScript module containing preload URLs for the Latin font slices.
 *
 * @param hrefs - The local font URLs to include in the preload list
 * @returns The generated TypeScript module source
 */
function renderPreloadModule(hrefs: string[]): string {
  return [
    "/**",
    " * 自動生成ファイル — 直接編集しない。",
    " * 生成: cd web-next && bun scripts/vendor-noto-sans-jp.ts",
    " *",
    ' * next/font/google の `subsets: ["latin"]` は latin slice を preload する挙動だった。',
    " * 自前ホストでも同じ体感速度を保つため、latin slice だけを preload する。",
    " * CJK slice は元々 preload 対象外 (合計数百 KB になるため)。",
    " */",
    "",
    "export const notoSansJpPreloadHrefs = [",
    ...hrefs.map((href) => `  "${href}",`),
    "] as const;",
    "",
  ].join("\n");
}

/**
 * Vendors Noto Sans JP assets and generated metadata from Google Fonts.
 *
 * @returns Nothing.
 */
async function main(): Promise<void> {
  console.log(`fetching ${CSS_URL}`);
  const remoteCss = await fetchText(CSS_URL);
  const faces = parseFaces(remoteCss);
  if (faces.length === 0) throw new Error("no @font-face found in the Google Fonts response");

  const filesByName = new Map<string, string>();
  for (const face of faces) {
    const known = filesByName.get(face.fileName);
    if (known && known !== face.remoteUrl) {
      throw new Error(`file name collision for ${face.fileName}`);
    }
    filesByName.set(face.fileName, face.remoteUrl);
  }
  console.log(`parsed ${faces.length} @font-face / ${filesByName.size} unique woff2`);

  const latinHrefs = [
    ...new Set(
      faces
        .filter((face) => face.subset === "latin")
        .map((face) => `/${outDirRelative}/${face.fileName}`)
    ),
  ];
  if (latinHrefs.length === 0)
    throw new Error("latin subset not found; preload list would be empty");

  const stagingRoot = mkdtempSync(join(repoRoot, ".vendor-noto-sans-jp-"));
  const stagedOutDir = join(stagingRoot, "woff2");
  const stagedCssOut = join(stagingRoot, "noto-sans-jp.css");
  const stagedPreloadOut = join(stagingRoot, "noto-sans-jp-preload.ts");
  try {
    mkdirSync(stagedOutDir);
    await downloadAll(filesByName, stagedOutDir);
    writeFileSync(stagedCssOut, renderCss(faces), "utf8");
    writeFileSync(stagedPreloadOut, renderPreloadModule(latinHrefs), "utf8");
    promoteStagedGeneration({ stagingRoot, stagedOutDir, stagedCssOut, stagedPreloadOut });
  } finally {
    rmSync(stagingRoot, { recursive: true, force: true });
  }

  console.log(`wrote ${cssOut}`);
  console.log(`wrote ${preloadOut} (${latinHrefs.length} preload target)`);
}

await main();
