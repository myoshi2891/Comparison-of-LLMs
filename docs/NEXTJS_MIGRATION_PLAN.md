## 役割
あなたはシニア・ソフトウェアアーキテクトとして、以下のサイトを最新スタックへ移行するプロジェクトのリーダーを担当します。
対象サイト: https://comparison-of-llms.netlify.app/

## 依頼の全体像
既存のHTML/CSS/JSサイトをNext.jsへと移行し、その後は「Markdownファイルによる仕様定義 → LLMによるコンポーネント生成」という運用フローを確立します。
作業はすべてTDD（テスト駆動開発）で行い、アトミックコミットを徹底します。

## 技術スタック
- Runtime: Bun
- Framework: Next.js (App Router)
- Language: TypeScript (Strict)
- Styling: Tailwind CSS 4.0
- Linter/Formatter: Biome
- Testing: Vitest + React Testing Library

## ステップ 0: アーキテクチャの設計・レビュー (最初に行うこと)
実装に入る前に、以下の点についてあなたの設計案とレビューを提示してください。
1. **ディレクトリ構造**: `app/` 配下の構成および、共通コンポーネントの配置戦略。
2. **Markdown運用フローの設計**: 今後Markdown（仕様）を元に `page.tsx` を生成する際、LLMが迷わないための「コンポーネントの抽象化レベル」の提案。
3. **型定義戦略**: 比較サイトとしてのデータ構造をどうTypeScriptで表現すべきか。
4. **移行の懸念点**: 既存サイト（Netlify）からの移行において、SEOやパフォーマンス面でのアドバイス。
5. **多言語戦略**: 既存の `web/src/i18n.ts`（`t(key, lang)` 関数 + `T` オブジェクト）を Next.js へどう移植するかを評価すること。`next-intl` などの専用ライブラリ採用か既存ロジック流用かを比較し、推奨を提示すること。
6. **ビジネスロジックの配置**: `web/src/lib/cost.ts` の純粋関数群（`calcApiCost`, `calcSubCost`, `colorIndex`, `fmtUSD`, `fmtJPY`）を Next.js プロジェクトのどこに配置・カプセル化すべきかを提案すること。
7. **`pricing.json` のデータ取得戦略**: SSG（ビルド時静的生成）・ISR（増分静的再生成）・クライアントサイドフェッチそれぞれのトレードオフを整理し、推奨方式を提示すること。
8. **デプロイ移行パス**: 現行 Netlify の App Router サポート状況と Vercel への移行を比較し、SEO・ビルド時間・コストの観点で推奨を示すこと。
9. **単一ファイル HTML 制約の解消**: 現行は `vite-plugin-singlefile` で単一 `index.html` を生成している。Next.js App Router ではこの要件を維持できないため、この制約を**廃止可能か否かを確認し**、代替の配布・デプロイ戦略を提案すること。

## ステップ 1〜N: 実装フェーズ (設計確定後に実行)
設計の合意が取れたら、以下のルールで実装を進めます。
1. **TDD**: 各機能について `[Red] テスト作成` → `[Green] 実装` → `[Refactor] 最適化` の手順を踏む。
2. **Atomic Commit**: 作業単位ごとに、ファイル一覧とGitコミットメッセージを提示。
3. **Initial Migration**: 既存サイトの `page.tsx` への移行は、以下の優先順位で「忠実性」を定義して進めること。
   - **Visual fidelity（最優先）**: UI/UX のピクセル・インタラクションのパリティ維持（レイアウト・カラー・アニメーション等の視覚的一致）。
   - **Functional fidelity（第2優先）**: JA/EN 切替・コスト計算機・シナリオ選択・テーブルレンダリングが完全に動作すること。
   - **Technical fidelity（最低優先）**: Next.js App Router では単一ファイル HTML 出力を維持できないため、この技術的制約は許容する。実現可能な範囲でのみ対応すること。

   実装は Visual → Functional → Technical の順で進め、判断に迷った際はこの優先順位に従うこと。

---
**まずは「ステップ 0」として、あなたの設計案と、既存サイトを分析した上でのレビューを詳細に提示してください。**
