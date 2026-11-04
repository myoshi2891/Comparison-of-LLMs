import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { brotliDecompressSync } from "node:zlib";
import ts from "typescript";
import { expect, it } from "vitest";

const root = join(__dirname, "..");
const source = readFileSync(join(root, "lib/fonts.ts"), "utf8");
const ast = ts.createSourceFile("fonts.ts", source, ts.ScriptTarget.Latest, true);
const fonts = [
  {
    name: "jetbrainsMono",
    src: "../public/fonts/latin/JetBrainsMono-Variable.woff2",
    variable: "--font-mono",
    weight: "300 700",
    license: "JetBrainsMono-OFL.txt",
    numGlyphs: 1179,
  },
  {
    name: "syne",
    src: "../public/fonts/latin/Syne-Variable.woff2",
    variable: "--font-display",
    weight: "400 800",
    license: "Syne-OFL.txt",
    numGlyphs: 711,
  },
];

// W3C WOFF2 仕様 §5.1 の既知タグ表（flags 下位 6 bit の添字。63 は 4 バイトの明示タグ）。
const KNOWN_TAGS = [
  "cmap",
  "head",
  "hhea",
  "hmtx",
  "maxp",
  "name",
  "OS/2",
  "post",
  "cvt ",
  "fpgm",
  "glyf",
  "loca",
  "prep",
  "CFF ",
  "VORG",
  "EBDT",
  "EBLC",
  "gasp",
  "hdmx",
  "kern",
  "LTSH",
  "PCLT",
  "VDMX",
  "vhea",
  "vmtx",
  "BASE",
  "GDEF",
  "GPOS",
  "GSUB",
  "EBSC",
  "JSTF",
  "MATH",
  "CBDT",
  "CBLC",
  "COLR",
  "CPAL",
  "SVG ",
  "sbix",
  "acnt",
  "avar",
  "bdat",
  "bloc",
  "bsln",
  "cvar",
  "fdsc",
  "feat",
  "fmtx",
  "fvar",
  "gvar",
  "hsty",
  "just",
  "lcar",
  "mort",
  "morx",
  "opbd",
  "prop",
  "trak",
  "Zapf",
  "Silf",
  "Glat",
  "Gloc",
  "Feat",
  "Sill",
];

/**
 * WOFF2 を依存なしで解析し、未変換テーブルの中身をタグ別に返す。
 * 1 本の Brotli ストリームにテーブルが directory 順・パディングなしで連結されている。
 */
function readWoff2(file: Buffer): { flavor: number; tables: Map<string, Buffer> } {
  expect(file.toString("ascii", 0, 4)).toBe("wOF2");
  const numTables = file.readUInt16BE(12);
  const compressedSize = file.readUInt32BE(20);
  let at = 48;
  const readBase128 = () => {
    let value = 0;
    for (let i = 0; i < 5; i += 1) {
      const byte = file[at++];
      value = value * 128 + (byte & 0x7f);
      if ((byte & 0x80) === 0) return value;
    }
    throw new Error("invalid UIntBase128");
  };
  const entries: Array<{ tag: string; length: number; transformed: boolean }> = [];
  for (let i = 0; i < numTables; i += 1) {
    const flags = file[at++];
    const index = flags & 0x3f;
    const version = flags >> 6;
    let tag = KNOWN_TAGS[index];
    if (index === 63) {
      tag = file.toString("ascii", at, at + 4);
      at += 4;
    }
    const origLength = readBase128();
    // glyf/loca は version 0 が変換済み、それ以外は version 0 が無変換（§5.1）。
    const transformed = tag === "glyf" || tag === "loca" ? version !== 3 : version !== 0;
    const length = transformed ? readBase128() : origLength;
    entries.push({ tag, length, transformed });
  }
  const stream = brotliDecompressSync(file.subarray(at, at + compressedSize));
  const tables = new Map<string, Buffer>();
  let offset = 0;
  for (const entry of entries) {
    if (!entry.transformed) tables.set(entry.tag, stream.subarray(offset, offset + entry.length));
    offset += entry.length;
  }
  expect(offset).toBe(stream.length);
  return { flavor: file.readUInt32BE(4), tables };
}

/** README の資産表から、指定ファイル名の行に記録された SHA-256 を返す。 */
function recordedSha256(fileName: string): string {
  const readme = readFileSync(join(root, "public/fonts/latin/README.md"), "utf8");
  const hash = readme
    .split("\n")
    .find((line) => line.startsWith(`| ${fileName} |`))
    ?.match(/`([0-9a-f]{64})`/)?.[1];
  if (hash === undefined) throw new Error(`README に ${fileName} の SHA-256 がない`);
  return hash;
}
it("uses only the local font loader and never Google-generated URLs", () => {
  const imports = ast.statements
    .filter(ts.isImportDeclaration)
    .map((s) => (s.moduleSpecifier as ts.StringLiteral).text);
  expect(imports).toEqual(["next/font/local"]);
});
for (const font of fonts) {
  it(`${font.name}: preserves its public export, CSS variable, swap and weight coverage`, () => {
    const calls: Array<{
      name: string;
      exported: boolean;
      loader: string;
      config: Record<string, string>;
    }> = [];
    for (const statement of ast.statements) {
      if (!ts.isVariableStatement(statement)) continue;
      const exported =
        statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
      for (const declaration of statement.declarationList.declarations) {
        const call = declaration.initializer;
        if (!call || !ts.isCallExpression(call) || !ts.isObjectLiteralExpression(call.arguments[0]))
          continue;
        const config: Record<string, string> = {};
        for (const prop of call.arguments[0].properties) {
          if (ts.isPropertyAssignment(prop) && ts.isStringLiteral(prop.initializer))
            config[prop.name.getText(ast)] = prop.initializer.text;
        }
        calls.push({
          name: declaration.name.getText(ast),
          exported,
          loader: call.expression.getText(ast),
          config,
        });
      }
    }
    expect(calls.find((c) => c.name === font.name)).toEqual({
      name: font.name,
      exported: true,
      loader: "localFont",
      config: { src: font.src, variable: font.variable, weight: font.weight, display: "swap" },
    });
  });
  it(`${font.name}: ships a real variable WOFF2 font with the required glyphs and weights`, () => {
    const file = readFileSync(join(root, "lib", font.src));
    const { flavor, tables } = readWoff2(file);
    // WOFF2 の中身が TrueType アウトラインの sfnt であること。
    expect(flavor).toBe(0x00010000);
    // 上流 TTF の maxp.numGlyphs を固定値として照合し、変換でグリフが欠けていないことを保証する。
    expect(tables.get("maxp")?.readUInt16BE(4)).toBe(font.numGlyphs);
    // README の資産表に記録した SHA-256 を基準とし、変換済み WOFF2 の世代が一致することを保証する。
    expect(createHash("sha256").update(file).digest("hex")).toBe(
      recordedSha256(basename(font.src))
    );
    const data = tables.get("fvar");
    expect(data).toBeDefined();
    if (data === undefined) return;
    const offset = 0;
    const axesOffset = data.readUInt16BE(offset + 4),
      count = data.readUInt16BE(offset + 8),
      size = data.readUInt16BE(offset + 10);
    const axes = Array.from({ length: count }, (_, i) => {
      const at = offset + axesOffset + i * size;
      return {
        tag: data.toString("ascii", at, at + 4),
        min: data.readInt32BE(at + 4) / 65536,
        max: data.readInt32BE(at + 12) / 65536,
      };
    });
    const axis = axes.find((a) => a.tag === "wght");
    expect(axis?.min).toBeLessThanOrEqual(Number(font.weight.split(" ")[0]));
    expect(axis?.max).toBeGreaterThanOrEqual(Number(font.weight.split(" ")[1]));
  });
  it(`${font.name}: retains its upstream redistribution license`, () => {
    const file = readFileSync(join(root, "public/fonts/latin", font.license));
    const license = file.toString("utf8");
    expect(license).toContain("SIL OPEN FONT LICENSE Version 1.1");
    expect(license).toMatch(/Copyright/i);
    // 部分一致だけでは条文の欠落・改変を見逃すため、ファイル全体を README 記録の SHA-256 と照合する。
    expect(createHash("sha256").update(file).digest("hex")).toBe(recordedSha256(font.license));
  });
}
