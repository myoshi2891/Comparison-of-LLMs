import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

test("旧 Google skill-guide-intermediate URL を現行ページへ恒久転送する", () => {
  const netlifyConfig = readFileSync(resolve(__dirname, "../../netlify.toml"), "utf8");

  expect(netlifyConfig).toContain('from   = "/google/skill-guide-intermediate"');
  expect(netlifyConfig).toContain('to     = "/google/antigravity-best-practices"');
  expect(netlifyConfig).toMatch(
    /from\s*=\s*"\/google\/skill-guide-intermediate"[\s\S]*?to\s*=\s*"\/google\/antigravity-best-practices"[\s\S]*?status\s*=\s*301/
  );
});
