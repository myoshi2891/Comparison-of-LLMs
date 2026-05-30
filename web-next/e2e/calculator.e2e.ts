import { expect, test } from "@playwright/test";

test.describe("Calculator Interactive E2E Test", () => {
  test.beforeEach(async ({ page }) => {
    // ホームページへ遷移
    await page.goto("/");
  });

  test("should load calculator UI elements", async ({ page }) => {
    // 料金電卓コンポーネントが描画されていることをアサート
    const costCalcSection = page.locator("#scenario-selector");
    await expect(costCalcSection).toBeVisible();

    const apiTable = page.locator("#api-pricing-table");
    await expect(apiTable).toBeVisible();
  });

  test("should update values when preset scenario is clicked", async ({ page }) => {
    // 最初の入力トークンの値を取得
    const inputToken = page.locator('input[type="number"]').first();
    const initialVal = await inputToken.inputValue();

    // Heavy プリセットをクリックしてみる
    const heavyBtn = page.locator('button:has-text("Heavy"), button:has-text("ヘビー")').first();
    if (await heavyBtn.isVisible()) {
      await heavyBtn.click();

      // トークン入力値が更新されたかアサート
      const newVal = await inputToken.inputValue();
      expect(newVal).not.toBe(initialVal);
    }
  });

  test("should toggle language and show translations", async ({ page }) => {
    // 言語切り替えボタン (EN/JA) をクリック
    const langBtn = page.locator('button:has-text("EN"), button:has-text("日本語")').first();
    const initialText = await langBtn.textContent();

    await langBtn.click();

    // テキストが切り替わったことを検証
    await expect(langBtn).not.toHaveText(initialText ?? "");
  });

  test("should change currency and display appropriate format", async ({ page }) => {
    // 通貨切り替えボタン（JPY/USD または 円/ドル）をクリック
    const currencyBtn = page
      .locator(
        'button:has-text("USD"), button:has-text("JPY"), button:has-text("円"), button:has-text("ドル")'
      )
      .first();
    if (await currencyBtn.isVisible()) {
      const initialText = await currencyBtn.textContent();
      await currencyBtn.click();
      // ボタン表示かテーブルの通貨マークが切り替わることを期待
      await expect(currencyBtn).not.toHaveText(initialText ?? "");
    }
  });
});
