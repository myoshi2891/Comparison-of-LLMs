import { readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { expect, it } from "vitest";

const root = join(__dirname, "..");
const source = readFileSync(join(root, "lib/fonts.ts"), "utf8");
const ast = ts.createSourceFile("fonts.ts", source, ts.ScriptTarget.Latest, true);
const fonts = [
  {
    name: "jetbrainsMono",
    src: "../public/fonts/latin/JetBrainsMono-Variable.ttf",
    variable: "--font-mono",
    weight: "300 700",
    license: "JetBrainsMono-OFL.txt",
  },
  {
    name: "syne",
    src: "../public/fonts/latin/Syne-Variable.ttf",
    variable: "--font-display",
    weight: "400 800",
    license: "Syne-OFL.txt",
  },
];
it("uses only the local font loader and never Google-generated URLs", () => {
  const imports = ast.statements
    .filter(ts.isImportDeclaration)
    .map((s) => (s.moduleSpecifier as ts.StringLiteral).text);
  expect(imports).toEqual(["next/font/local"]);
});
for (const font of fonts) {
  it(`${font.name}: preserves its public export, CSS variable, swap and weight coverage`, () => {
    const calls: Array<{ name: string; loader: string; config: Record<string, string> }> = [];
    for (const statement of ast.statements) {
      if (!ts.isVariableStatement(statement)) continue;
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
          loader: call.expression.getText(ast),
          config,
        });
      }
    }
    expect(calls.find((c) => c.name === font.name)).toEqual({
      name: font.name,
      loader: "localFont",
      config: { src: font.src, variable: font.variable, weight: font.weight, display: "swap" },
    });
  });
  it(`${font.name}: ships a real variable TrueType font with the required weights`, () => {
    const data = readFileSync(join(root, "lib", font.src));
    expect(data.readUInt32BE(0)).toBe(0x00010000);
    const tables = Array.from({ length: data.readUInt16BE(4) }, (_, i) => ({
      tag: data.toString("ascii", 12 + i * 16, 16 + i * 16),
      offset: data.readUInt32BE(20 + i * 16),
    }));
    const fvar = tables.find((t) => t.tag === "fvar");
    expect(fvar).toBeDefined();
    const offset = fvar?.offset ?? 0;
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
    const license = readFileSync(join(root, "public/fonts/latin", font.license), "utf8");
    expect(license).toContain("SIL OPEN FONT LICENSE Version 1.1");
    expect(license).toMatch(/Copyright/i);
  });
}
