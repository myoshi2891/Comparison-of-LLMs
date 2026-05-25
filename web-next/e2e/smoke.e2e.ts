import { expect, test } from "@playwright/test";

test.describe("E2E Smoke Test", () => {
  test("should load homepage and display core elements", async ({ page }) => {
    await page.goto("/");

    // ページタイトルに「LLM」または「コスト」が含まれることを検証
    await expect(page).toHaveTitle(/LLM|コスト|Calculator/i);

    // 共通ヘッダー（SiteHeader）の存在検証
    const header = page.locator("nav#common-header");
    await expect(header).toBeVisible();

    // ヒーローセクションの存在検証
    const hero = page.locator(".hero");
    await expect(hero).toBeVisible();
  });
});
