/**
 * 契約テスト (ナビデータ / nav-links.ts)。
 *
 * Phase A で導入し、F-4'（plans/008）でナビが page-registry からの導出に変わったのに合わせて改訂。
 * 個別グループの構成・件数・並び順は tests/nav-derivation.test.ts が導出契約として固定するため、
 * ここでは **データ構造とセキュリティ境界** に責務を絞る:
 *
 * - `navLinks` / `NavLinkSchema` が型付き export されている
 * - `navLinks` は Zod スキーマで parse 成功する
 * - Home 先頭 / What's New 末尾
 * - すべての href は `/` 始まりの clean URL（`.html` 拡張子なし）
 * - 外部 URL は `navLinks` に含まれない（GitHub リンクは layout 側の責務）
 * - Zod スキーマが `javascript:` / プロトコル相対 `//` を弾く
 *   (legacy/shared/common-header.js:94-104 の isSafeHref 相当)
 */

import { describe, expect, it } from "vitest";
import { isNavLeaf, NavLinkSchema, navLinks } from "@/components/site/nav-links";
import { collectNavHrefs } from "./helpers/nav";

const allHrefs = collectNavHrefs(navLinks);

describe("nav-links export shape", () => {
  it("exports navLinks as a non-empty array", () => {
    expect(Array.isArray(navLinks)).toBe(true);
    expect(navLinks.length).toBeGreaterThan(0);
  });

  it("exports NavLinkSchema as a Zod schema (has .parse method)", () => {
    expect(typeof NavLinkSchema.parse).toBe("function");
  });
});

describe("nav-links top-level entries", () => {
  it("starts with Home as a flat link", () => {
    const home = navLinks[0];
    expect(home.name).toBe("Home");
    expect(isNavLeaf(home) && home.href === "/").toBe(true);
  });

  it("ends with What's New as a flat link", () => {
    const last = navLinks[navLinks.length - 1];
    expect(last.name).toBe("What's New");
    expect(isNavLeaf(last) && last.href === "/whats-new").toBe(true);
  });
});

describe("nav-links href hygiene", () => {
  it("uses clean URLs everywhere (absolute path, no .html extension)", () => {
    expect(allHrefs.length).toBeGreaterThan(0);
    for (const href of allHrefs) {
      expect(href.startsWith("/"), href).toBe(true);
      expect(href.endsWith(".html"), href).toBe(false);
    }
  });

  it("does not include an external URL anywhere in the tree", () => {
    for (const href of allHrefs) {
      expect(href.startsWith("http"), href).toBe(false);
    }
  });
});

describe("nav-links Zod schema validation", () => {
  it("accepts every navLinks entry", () => {
    for (const link of navLinks) {
      expect(() => NavLinkSchema.parse(link)).not.toThrow();
    }
  });

  it("rejects entries with javascript: protocol href (XSS guard)", () => {
    expect(() => NavLinkSchema.parse({ name: "Evil", href: "javascript:alert(1)" })).toThrow();
  });

  it("rejects entries with protocol-relative // href", () => {
    expect(() => NavLinkSchema.parse({ name: "PR", href: "//evil.example" })).toThrow();
  });

  it("rejects entries missing both href and children", () => {
    expect(() => NavLinkSchema.parse({ name: "Orphan" })).toThrow();
  });

  it("rejects a nested subgroup whose leaf has an unsafe href", () => {
    expect(() =>
      NavLinkSchema.parse({
        name: "Providers",
        children: [{ name: "Evil", children: [{ name: "X", href: "javascript:alert(1)" }] }],
      })
    ).toThrow();
  });
});
