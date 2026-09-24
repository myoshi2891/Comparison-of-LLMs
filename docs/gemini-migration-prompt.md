# 移行プロンプト（Gemini / Antigravity IDE 向け）

<!-- Updated: 2026-09-17 -->

## 目的

`<htmlファイル>`（※実際の原本配置パスに合わせて調整）の内容を、Next.js（App Router）へ
100% 欠落なく完全移行してください。
移行漏れやスタイリング劣化を完全に防ぐため、厳格な TDD（Red → Green → Refactor → Docs）と
原本照合監査スクリプトによる機械的検証を実施し、ステップバイステップの小さなコミット単位で
作業を進めてください。

---

## 参照ルール・スキル（作業開始前に必読）

> **注意**: `.gemini/skills/` および `.agent/skills/` はどちらも `.skills/` への
> シンボリックリンクです。どちらのパスで読み込んでも内容は同一です。
> Claude 用の `.claude/skills/` や `.claude/rules/` と同一の内容が
> `.gemini/skills/` や `.gemini/rules/` に存在します。

作業着手前に以下のファイルを必ず読み込み、各指示・ワークフローを遵守してください。

- `GEMINI.md`（リポジトリルート）
- `CLAUDE.md`（リポジトリルート）— GEMINI.md が委譲する正本
- `docs/PROGRESS.md`
- `.gemini/skills/nextjs-page-migration/SKILL.md`
- `.gemini/skills/nextjs-page-migration/references/source-parity-audit.md`
- `.gemini/skills/nextjs-page-migration/references/design-contract-tests.md`
- `.gemini/skills/nextjs-page-migration/references/css-full-transfer-checklist.md`
- `.gemini/rules/tdd-mandatory-cycle.md`
- `.gemini/rules/mermaid-diagram-layout.md`
- `.gemini/rules/no-absolute-paths.md`
- `.gemini/skills/fix-mermaid/SKILL.md`

---

## 厳守事項・実行制約

### 1. 実行コマンド制約（絶対遵守）

- パッケージマネージャーは **bun** を使用してください（`npm` / `npx` / `node` の実行は禁止）。
- テスト実行は必ず `(cd web-next && bun run test <対象テストパス>)` で実行してください
  （`bun test` は vitest/jsdom 設定を無視するため禁止）。
  Phase 4 の全体リグレッション確認時に限り、対象パスを省略した `bun run test`
  （フルスイート実行）を許容します。
- サンドボックス環境下での **`npm` コマンドおよび本番ビルド（`bun run build` / `next build`）の実行は禁止** です。
- Biome Lint 実行時は必ず対象ファイル/ディレクトリを指定してください
  （`bun run lint:fix` や `bunx biome check --write` をパス引数なしでリポジトリ全体に実行することは禁止）。
- `legacy/` 配下のファイル編集は禁止です。移行元の HTML ファイル・Markdown ファイルは **絶対に削除せず**、移行完了後に必ず `archive/` 配下の適切なサブディレクトリへ移動（`git mv`）してください。
  - HTML ファイルの移動先: `archive/html/<ベンダー名>/` （例: `archive/html/openai/`）
  - Markdown ファイルの移動先: `archive/md/<ベンダー名>/` （例: `archive/md/openai/`）
  - 既存の `archive/` ディレクトリ構造を確認し、同カテゴリのファイルと同じパス規則に揃えてください。
- 設定ファイル（`next.config.ts`, `tsconfig.json`, `biome.json` 等）や依存関係の勝手な変更は禁止です。

### 2. 100% 完全移植とスタイリング防犯原則（要約・省略・縮約の絶対禁止）

- ソース HTML の要約、省略、縮約、代表抽出、見出しの言い換えは重大な規約違反です。
  全セクション・全段落・全リスト項目・全図表・全コードブロック・全外部リンクを
  100% 漏れなく JSX へ転写してください。
- 標準ファイル 4 点セット構成（`page.tsx`, `page.module.css`, `page.test.tsx`, `TocObserver.tsx`）
  を守り、`page.tsx` は Server Component を維持してください（`"use client"` 禁止）。
- `<SiteHeader>` / `<DisclaimerBanner>` は `layout.tsx` に配置済みのため、ページ側で再配置しないでください。
- **スタイリング防犯ルール**:
  - 表の全列左寄せ（`:global(th/td)` で `text-align: left !important`）
  - コードブロックの先頭インデント保持（`{"    "}` 形式の明示埋め込み）と 1 行ごとの `.codeLine` ラッパー
  - コード構文ハイライト用 span トークン（`.ck`, `.cv`, `.cs` 等）の適用
  - `pre code` リセット（`background: none; border: none;`）
  - Mermaid 図解は `components/docs/MermaidDiagram.tsx` を使用し、ページ側 CSS で
    Mermaid の layout / svg を上書きしない（自己完結）
  - 見出しのアンカーめり込み防止（`scroll-margin-top: calc(var(--header-height, 60px) + 80px)`）
  - `globals.css` に定義のない CSS 変数は必ず `.layout` 内で自己定義して使用する

### 3. 厳格な TDD（Red → Green → Refactor → Docs）とコミット分割

- テスト・実装・リファクタ・ドキュメントを 1 コミットにまとめることは禁止です。
- コミットプレフィックス（`test(...)`, `feat(...)`, `refactor(...)`, `chore(docs)`）を厳守してください。
- Red コミット時は、実際にテストを実行して **失敗（Red）を確認** してからコミットしてください。
- Green コミット前に、**原本照合監査スクリプトの終了コード 0** を必ず確認してください。
- コミット前には必ず `git diff --cached` でローカル絶対パス（`/Users/johndoe/` 等）や PII が含まれていない
  ことを検証してください（`.gemini/rules/no-absolute-paths.md`）。

### 4. 原本照合監査スクリプト（機械的パリティ検証）の必須化

目視による確認だけに頼らず、必ず以下の監査スクリプトを実行し、`exit=0` を確認してください。

```bash
bun .gemini/skills/nextjs-page-migration/scripts/audit_source_parity.mjs \
  <原本HTMLパス> web-next/app/<provider>/<slug>/page.tsx
status=$?
echo "exit=$status"
[ "$status" -eq 0 ] || exit "$status"
```

### 5. ページレジストリ（`page-registry.ts`）への登録

新規ページは `web-next/lib/page-registry.ts` に必ずメタデータを登録してください
（`components/site/nav-links.ts` への直書きは禁止）。

---

## 実行フェーズ

### Phase 1: 原本インベントリ調査・見出し抽出・分割計画

1. 原本 HTML の規模、見出し階層、リスト構造、Mermaid 図、コードブロック、callout 構成を分析します。
2. 機械的見出し抽出コマンドを実行し、原本の見出し配列を取得します:

   ```bash
   bun .gemini/skills/nextjs-page-migration/scripts/audit_source_parity.mjs \
     <原本HTMLパス> web-next/app/<provider>/<slug>/page.tsx --emit-headings
   ```

3. 移行計画（配置先パス、slug、登録カテゴリ、実装タスクリスト）を提示してください。

---

### Phase 2: [Red] 契約テストの作成とコミット

1. `web-next/app/<provider>/<slug>/page.test.tsx` を作成します
   （`// @vitest-environment jsdom` を先頭に明記）。
   `TocObserver.tsx` を作成する場合は、同じ作業単位で
   `web-next/app/<provider>/<slug>/TocObserver.test.tsx` も作成します
   （SKILL.md §6-a）。
2. `.gemini/skills/nextjs-page-migration/SKILL.md` §5 Step 1 に従い、**最低 13 契約**
   （S-1〜S-4 原本照合契約、C-1〜C-5 コンテンツ契約、D-8 デザイン契約、Q-1〜Q-3 品質契約、
   および必要に応じた C-6 / D-1〜D-7）を記述します。
   - 見出しテストは順序込み完全一致（`toEqual([...EXPECTED_H2])`）で記述し、
     件数のみや部分一致の弱いアサーションは禁止します。
   - Q-1: `TocObserver.test.tsx` は `TocObserver.tsx` が持つ全ての公開挙動
     （アクティブ見出しの遷移、モバイルサイドバー/メニューの開閉、リンククリック時の
     自動クローズ、resize によるブレークポイント跨ぎの挙動、`inert` の付与/解除など）
     をすべてカバーします。
3. `(cd web-next && bun run test app/<provider>/<slug>/page.test.tsx)` を実行し、
   **テストが失敗することを確認** します。
   `TocObserver.test.tsx` を作成した場合は、
   `(cd web-next && bun run test app/<provider>/<slug>/TocObserver.test.tsx)` も実行し、
   こちらも **Red コミット前に失敗することを確認** します。
4. PII 検査後、Red コミットを実行します:

   ```
   test(<slug>): add failing contract specs for <page-title>
   ```

---

### Phase 3: [Green] 実装・原本照合監査・レジストリ登録とコミット

1. `page.tsx`, `page.module.css`, `TocObserver.tsx` を作成し、
   原本の全要素を 100% 漏れなく JSX 化・スタイリングします。
2. `web-next/lib/page-registry.ts` に新規ページのエントリを追加します。
3. 原本照合監査スクリプトを実行し、**終了コード 0** を確認します:

   ```bash
   bun .gemini/skills/nextjs-page-migration/scripts/audit_source_parity.mjs \
     <原本HTMLパス> web-next/app/<provider>/<slug>/page.tsx
   status=$?
   echo "exit=$status"   # 必ず 0 を確認
   [ "$status" -eq 0 ] || exit "$status"   # 監査失敗時は Green コミットへ進まない
   ```

4. 単体テストを実行し、すべてパス（Green）することを確認します:

   ```bash
   (cd web-next && bun run test app/<provider>/<slug>/page.test.tsx)
   (cd web-next && bun run test tests/page-registry-coverage.test.ts)
   ```

   `TocObserver.tsx` を作成した場合（Phase 2-1 と同条件）は、
   `TocObserver.test.tsx` も実行します:

   ```bash
   (cd web-next && bun run test app/<provider>/<slug>/TocObserver.test.tsx)
   ```

   同じく `TocObserver.tsx` を作成した場合に限り、対象コンポーネントのカバレッジも確認します
   （Q-1・§6-a の全公開挙動カバレッジ要件を満たすこと。作成していない場合はこの手順を省略）:

   ```bash
   (cd web-next && bun run test:coverage -- app/<provider>/<slug>/TocObserver.test.tsx)
   ```

5. 原本ファイルを `archive/` 配下の適切なサブディレクトリへ移動します:

   ```bash
   # HTML ファイルの場合
   git mv <原本HTMLパス> archive/html/<ベンダー名>/<ファイル名>.html

   # Markdown ファイルの場合
   git mv <原本MDパス> archive/md/<ベンダー名>/<ファイル名>.md
   ```

   移動先の `archive/` サブディレクトリが存在しない場合は事前に作成してください。
   既存の `archive/` 内のディレクトリ構造（`ls archive/html/` や `ls archive/md/`）を確認し、
   同カテゴリの他ファイルと同じパス規則に揃えること。

6. PII 検査後、Green コミットを実行します:

   ```
   feat(<slug>): implement <page-title> with 100% source parity
   ```

   > **注**: `git mv` によるアーカイブ移動も同一コミットに含めてください。

---

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

3. 必要に応じてリファクタリングを行い、PII 検査後、コミットを実行します（コード整理がある場合のみ）:

   ```
   refactor(<slug>): clean up styles and components for <page-title>
   ```

---

### Phase 5: [Docs] ドキュメント同期とユーザー確認依頼

1. `docs/PROGRESS.md`（および必要に応じて関連ドキュメント）の進捗状況・テスト数を
   実測値で更新します。
2. PII 検査後、Docs コミットを実行します:

   ```
   chore(docs): update docs/PROGRESS.md for <page-title>
   ```

3. ユーザーへ実装完了を報告し、ブラウザで確認すべきローカル URL
   （例: `http://localhost:3000/<provider>/<slug>`）を提示して目視確認を依頼してください。

---

## Gemini / Claude パス対照表

| 用途 | Gemini / Antigravity パス | Claude パス（同一内容） |
|------|--------------------------|------------------------|
| メインルール | `GEMINI.md` → `CLAUDE.md` に委譲 | `CLAUDE.md` |
| スキルルート | `.gemini/skills/` または `.agent/skills/` | `.claude/skills/` |
| ルールルート | `.gemini/rules/` | `.claude/rules/` |
| 移行スキル | `.gemini/skills/nextjs-page-migration/SKILL.md` | `.claude/skills/nextjs-page-migration/SKILL.md` |
| 監査スクリプト | `.gemini/skills/nextjs-page-migration/scripts/audit_source_parity.mjs` | `.claude/skills/nextjs-page-migration/scripts/audit_source_parity.mjs` |
| ソースパリティ参照 | `.gemini/skills/nextjs-page-migration/references/source-parity-audit.md` | `.claude/skills/nextjs-page-migration/references/source-parity-audit.md` |
| デザイン契約参照 | `.gemini/skills/nextjs-page-migration/references/design-contract-tests.md` | `.claude/skills/nextjs-page-migration/references/design-contract-tests.md` |
| CSS 移植チェックリスト | `.gemini/skills/nextjs-page-migration/references/css-full-transfer-checklist.md` | `.claude/skills/nextjs-page-migration/references/css-full-transfer-checklist.md` |
| TDD ルール | `.gemini/rules/tdd-mandatory-cycle.md` | `.claude/rules/tdd-mandatory-cycle.md` |
| Mermaid レイアウト | `.gemini/rules/mermaid-diagram-layout.md` | `.claude/rules/mermaid-diagram-layout.md` |
| 絶対パス禁止 | `.gemini/rules/no-absolute-paths.md` | `.claude/rules/no-absolute-paths.md` |
| Mermaid 修正スキル | `.gemini/skills/fix-mermaid/SKILL.md` | `.claude/skills/fix-mermaid/SKILL.md` |

> **注**: `.gemini/skills/` と `.agent/skills/` はいずれも `.skills/` への
> シンボリックリンクであるため、どちらのパスも実体は同一です。

---

## よくある失敗パターンと対処

| 失敗パターン | 対処 |
|-------------|------|
| 監査スクリプトの exit が 1 以上 | 漏れている見出し・段落を原本と照合し追加転写する |
| テストが Red のままコミット | `bun run test` の実際の出力を確認し、失敗理由に基づき実装を修正する |
| `bun run lint` でエラー | `bunx biome check --write <対象ファイルパス>` でファイル単位修正（リポジトリ全体への実行は禁止） |
| Mermaid が描画されない | `.gemini/skills/fix-mermaid/SKILL.md` を参照し、バージョン互換と ESM 設定を確認する |
| **Mermaid Syntax Error（ブラウザでだけ図が全滅）** | 原本 HTML の Mermaid ノードラベルに全角括弧 `（）`・全角スラッシュ `／`・全角波ダッシュ `〜` が含まれていないか確認する（`.gemini/skills/fix-mermaid/SKILL.md` Part 1-b 参照）。**含まれているというだけで機械的に置換してはならない。ブラウザで実際に Syntax Error を再現した場合のみ、移行先 page.tsx の Mermaid ソースを最小限修正し、再現条件と修正内容を記録する。原本 HTML は変更しない** |
| CSS 変数が `globals.css` に未定義 | `.layout` ブロック内でその変数をフォールバック値つきで自己定義する |
| PII 混入（絶対パス等） | `git diff --cached` の出力を確認し、絶対パスを相対パスに置き換えてから再コミット |
