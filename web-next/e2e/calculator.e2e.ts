import { expect, test } from "@playwright/test";

test.describe("Calculator Interactive E2E Test", () => {
  test.beforeEach(async ({ page }) => {
    // ホームページへ遷移
    await page.goto("/");
    // 言語切り替えのブレを防ぐため、初期状態を確実に「日本語」に設定
    const jaBtn = page.locator(".lang-btn.ja");
    await expect(jaBtn).toBeVisible();
    await jaBtn.click();
  });

  test("should load calculator UI elements", async ({ page }) => {
    // 料金電卓コンポーネントが描画されていることをアサート
    const costCalcSection = page.locator("#scenario-selector");
    await expect(costCalcSection).toBeVisible();

    const apiTable = page.locator("#api-pricing-table");
    await expect(apiTable).toBeVisible();
  });

  test("should update values when preset scenario is clicked", async ({ page }) => {
    // 初期状態でアサンプションバーが Standard であることを検証
    const scenarioVal = page.locator(".assumption-bar .val").first();
    await expect(scenarioVal).toHaveText("⚙️ Standard — 標準");

    // Heavy プリセットボタンの存在をハードアサーションで確認してクリック
    const heavyBtn = page.locator('button:has-text("Heavy"), button:has-text("ヘビー")').first();
    await expect(heavyBtn).toBeVisible();
    await heavyBtn.click();

    // プリセットが Heavy に更新されたことを期待される具体的な文字列で明示的にアサート
    await expect(scenarioVal).toHaveText("🔥 Heavy — 重量");
  });

  test("should toggle language and show translations", async ({ page }) => {
    // 英語 (EN) ボタンを取得してクリック
    const enBtn = page.locator(".lang-btn.en");
    await expect(enBtn).toBeVisible();

    // アサンプションバーの見出しが日本語であることを事前に確認
    const scenarioLabel = page.locator(".assumption-bar .lbl").first();
    await expect(scenarioLabel).toHaveText("現在のシナリオ:");

    await enBtn.click();

    // 言語が英語に切り替わったことを、期待される英語のラベルで明示的にアサート
    await expect(enBtn).toHaveClass(/active/);
    await expect(scenarioLabel).toHaveText("Scenario:");
  });

  // 通貨切り替え機能は現行コードに存在しない（USD/JPY同時表示の仕様）ため、このテストは無効としてスキップ
  test.skip("should change currency and display appropriate format", async ({ page }) => {
    // 通貨切り替えボタン（JPY/USD または 円/ドル）をクリック
    const currencyBtn = page
      .locator(
        'button:has-text("USD"), button:has-text("JPY"), button:has-text("円"), button:has-text("ドル")'
      )
      .first();
    await expect(currencyBtn).toBeVisible();
    const initialText = await currencyBtn.textContent();
    await currencyBtn.click();
    await expect(currencyBtn).not.toHaveText(initialText ?? "");
  });
});
