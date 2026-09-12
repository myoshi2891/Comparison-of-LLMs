# 移行プロンプト

## 目的

原本ファイル（**HTML / Markdown のどちらでも可**。`archive/html/<カテゴリ>/<name>.html` または `archive/md/<カテゴリ>/<name>.md`。※実際の原本配置パスに合わせて調整）の内容を、Next.js（App Router）へ 100% 欠落なく完全移行してください。
移行漏れやスタイリング劣化を完全に防ぐため、厳格な TDD（Red → Green → Refactor → Docs）と原本照合監査スクリプトによる機械的検証を実施し、ステップバイステップの小さなコミット単位で作業を進めてください。

---

## 参照ルール・スキル（作業開始前に必読）

作業着手前に以下のファイルを必ず読み込み、各指示・ワークフローを遵守してください。

- `CLAUDE.md`（リポジトリルート）
- `docs/PROGRESS.md`
- `.claude/skills/nextjs-page-migration/SKILL.md`
- `.claude/skills/nextjs-page-migration/references/source-parity-audit.md`
- `.claude/skills/nextjs-page-migration/references/design-contract-tests.md`
- `.claude/skills/nextjs-page-migration/references/css-full-transfer-checklist.md`
- `.claude/rules/tdd-mandatory-cycle.md`
- `.claude/rules/mermaid-diagram-layout.md`
- `.claude/rules/no-absolute-paths.md`
- `.claude/skills/fix-mermaid/SKILL.md`

---

## 厳守事項・実行制約

1. **実行コマンド制約（絶対遵守）**:
   - パッケージマネージャーは **bun** を使用してください（`npm` / `npx` / `node` の実行は禁止）。
   - テスト実行は必ず `(cd web-next && bun run test <対象テストパス>)` で実行してください（`bun test` は vitest/jsdom 設定を無視するため禁止）。
   - サンドボックス環境下での **`npm` コマンドおよび本番ビルド（`bun run build` / `next build`）の実行は禁止** です。
   - Biome Lint 実行時は必ず対象ファイル/ディレクトリを指定してください（`bun run lint:fix` や `bunx biome check --write` をパス引数なしでリポジトリ全体に実行することは禁止）。
   - `legacy/` 配下のファイル編集は禁止です。移行元の原本は削除せず、HTML は `archive/html/` 配下、Markdown は `archive/md/` 配下に保管してください。
   - 設定ファイル（`next.config.ts`, `tsconfig.json`, `biome.json` 等）や依存関係の勝手な変更は禁止です。

2. **100% 完全移植とスタイリング防犯原則（要約・省略・縮約の絶対禁止）**:
   - 原本（HTML / Markdown）の要約、省略、縮約、代表抽出、見出しの言い換えは重大な規約違反です。全セクション・全段落・全リスト項目・全図表・全コードブロック・全外部リンクを 100% 漏れなく JSX へ転写してください。
   - 標準ファイル 4 点セット構成（`page.tsx`, `page.module.css`, `page.test.tsx`, `TocObserver.tsx`）を守り、`page.tsx` は Server Component を維持してください（`"use client"` 禁止）。
   - `<SiteHeader>` / `<DisclaimerBanner>` は `layout.tsx` に配置済みのため、ページ側で再配置しないでください。
   - **スタイリング防犯ルール**:
     - 表の全列左寄せ（`:global(th/td)` で `text-align: left !important`）
     - コードブロックの先頭インデント保持（`{"    "}` 形式の明示埋め込み）と 1 行ごとの `.codeLine` ラッパー
     - コード構文ハイライト用 span トークン（`.ck`, `.cv`, `.cs` 等）の適用
     - `pre code` リセット（`background: none; border: none;`）
     - Mermaid 図解は `components/docs/MermaidDiagram.tsx` を使用し、ページ側 CSS で Mermaid の layout / svg を上書きしない（自己完結）
     - 見出しのアンカーめり込み防止（`scroll-margin-top: calc(var(--header-height, 60px) + 80px)`）
     - `globals.css` に定義のない CSS 変数は必ず `.layout` 内で自己定義して使用する

3. **厳格な TDD（Red → Green → Refactor → Docs）とコミット分割**:
   - テスト・実装・リファクタ・ドキュメントを 1 コミットにまとめることは禁止です。
   - コミットプレフィックス（`test(...)`, `feat(...)`, `refactor(...)`, `chore(docs)`）を厳守してください。
   - Red コミット時は、実際にテストを実行して **失敗（Red）を確認** してからコミットしてください。
   - Green コミット前に、**原本照合監査スクリプトの終了コード 0** を必ず確認してください。
   - コミット前には必ず `git diff --cached` でローカル環境の絶対パス（`/Users/johndoe/...` 等）や PII が含まれていないことを検証してください（`.claude/rules/no-absolute-paths.md`）。

4. **原本照合監査スクリプト（機械的パリティ検証）の必須化**:
   - 目視による確認だけに頼らず、必ず以下の監査スクリプトを実行し、`exit=0` を確認してください。
   - 監査スクリプトは原本の拡張子で入力形式を判定します（`.html` / `.md` の両方に対応）。`<原本パス>` には
     `archive/html/<カテゴリ>/<name>.html` または `archive/md/<カテゴリ>/<name>.md` を渡してください。

     ```bash
     bun .claude/skills/nextjs-page-migration/scripts/audit_source_parity.mjs \
       <原本パス> web-next/app/<provider>/<slug>/page.tsx
     echo "exit=$?"
     ```

5. **ページレジストリ（`page-registry.ts`）への登録**:
   - 新規ページは `web-next/lib/page-registry.ts` に必ずメタデータを登録してください（`components/site/nav-links.ts` への直書きは禁止）。

---

## 実行フェーズ

### Phase 1: 原本インベントリ調査・見出し抽出・分割計画

1. 原本（HTML / Markdown）の規模、見出し階層、リスト構造、Mermaid 図、コードブロック、callout 構成を分析します。
2. 機械的見出し抽出コマンドを実行し、原本の見出し配列を取得します:

   ```bash
   bun .claude/skills/nextjs-page-migration/scripts/audit_source_parity.mjs \
     <原本パス> web-next/app/<provider>/<slug>/page.tsx --emit-headings
   ```

3. 移行計画（配置先パス、slug、登録カテゴリ、実装タスクリスト）を提示してください。

### Phase 2: [Red] 契約テストの作成とコミット

1. `web-next/app/<provider>/<slug>/page.test.tsx` を作成します（`// @vitest-environment jsdom` を先頭に明記）。
2. `.claude/skills/nextjs-page-migration/SKILL.md` §5 Step 1 に従い、**最低 13 契約**（S-1〜S-4 原本照合契約、C-1〜C-5 コンテンツ契約、D-8 デザイン契約、Q-1〜Q-3 品質契約、および必要に応じた C-6 / D-1〜D-7）を記述します。
   - 見出しテストは順序込み完全一致（`toEqual([...EXPECTED_H2])`）で記述し、件数のみや部分一致の弱いアサーションは禁止します。
3. `(cd web-next && bun run test app/<provider>/<slug>/page.test.tsx)` を実行し、**テストが失敗することを確認** します。
4. PII 検査後、Red コミットを実行します:
   `test(<slug>): add failing contract specs for <page-title>`

### Phase 3: [Green] 実装・原本照合監査・レジストリ登録とコミット

1. `page.tsx`, `page.module.css`, `TocObserver.tsx` を作成し、原本の全要素を 100% 漏れなく JSX 化・スタイリングします。
2. `web-next/lib/page-registry.ts` に新規ページのエントリを追加します。
3. 原本照合監査スクリプトを実行し、**終了コード 0** を確認します:

   ```bash
   bun .claude/skills/nextjs-page-migration/scripts/audit_source_parity.mjs \
     <原本パス> web-next/app/<provider>/<slug>/page.tsx
   echo "exit=$?" # 必ず 0 を確認
   ```

4. 単体テストを実行し、すべてパス（Green）することを確認します:

   ```bash
   (cd web-next && bun run test app/<provider>/<slug>/page.test.tsx)
   (cd web-next && bun run test tests/page-registry-coverage.test.ts)
   ```

5. PII 検査後、Green コミットを実行します:
   `feat(<slug>): implement <page-title> with 100% source parity`

### Phase 4: [Refactor] 品質検証とコミット

1. 対象コードの Lint チェックおよび型チェックを実行し、エラーがゼロであることを確認します:

   ```bash
   (cd web-next && bunx biome check app/<provider>/<slug>)
   (cd web-next && bun run typecheck)
   ```

2. 全テストスイートを実行し、リグレッションがないことを確認します:

   ```bash
   (cd web-next && bun run test)
   ```

3. CLAUDE.md の「コミット前チェック」に従い、リポジトリ全体の Lint とビルドも実行して成功を確認します（対象ディレクトリだけの Biome チェックでは検知できない違反・ビルドエラーを防ぐため）:

   ```bash
   (cd web-next && bun run lint)
   (cd web-next && bun run build)   # ※Antigravity サンドボックス環境では実行禁止。他環境および CI では必須
   ```

4. 必要に応じてリファクタリングを行い、PII 検査後、コミットを実行します（コード整理がある場合のみ）:
   `refactor(<slug>): clean up styles and components for <page-title>`

### Phase 5: [Docs] ドキュメント同期とユーザー確認依頼

1. `docs/PROGRESS.md`（および必要に応じて関連ドキュメント）の進捗状況・テスト数を実測値で更新します。
2. PII 検査後、Docs コミットを実行します:
   `chore(docs): update docs/PROGRESS.md for <page-title>`
3. ユーザーへ実装完了を報告し、ブラウザで確認すべきローカル URL（例: `http://localhost:3000/<provider>/<slug>`）を提示して目視確認を依頼してください。
