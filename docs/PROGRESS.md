# プロジェクト進捗・ステータス (PROGRESS.md)

> 本ファイルは Next.js 移行完了後の保守・改善フェーズにおける開発の進捗（特にテスト関連）および品質チェックのルールを記録する。
>
> - 最終更新日: **Updated 2026-08-14**
> - 過去の移行進捗・旧ルール: [`docs/archive/MIGRATION_PROGRESS.md`](archive/MIGRATION_PROGRESS.md)
> - 移行計画アーカイブ: [`docs/archive/NEXTJS_PHASE_A_F_PLAN.md`](archive/NEXTJS_PHASE_A_F_PLAN.md)

## 現在のステータス

- **フェーズ**: 保守・機能改善・品質強化フェーズ
- **ブランチ**: `dev`（本番 `main` への Next.js 移行マージ完了 🚀）
- **動作検証**:
  - `bun run build`: 今回はユーザー指定により未実行（直近の成功記録は 2026-08-13。許可環境または CI で再確認する）
  - `npm run typecheck` ✅（`tsc --noEmit`。2026-08-14 実測）
  - `npm run lint` ✅（Biome check / 457 files / 0 diagnostics。2026-08-14 実測）
- **テストの実行状況**:
  - **フロントエンド (`web-next/`)**: `npm test` で Vitest **164 files / 1467 tests すべて合格**（2026-08-14 実測。全 Green ✅）
  - **バックエンド (`scraper/`)**: pytest 実行で **43 件すべて合格** (全 Green ✅)

## 最近の追加内容

- **レビュー指摘の再検証 — フォント生成の原子化・契約強化・移行監査拡張**:
  - Noto Sans JP の woff2・CSS・preload module を一時世代へ全件生成し、成功後だけ現行世代と置換するよう変更。昇格途中の失敗時も旧世代へ復元する。preload URL、`:root` の `--font-sans`、layout の named import / font variable classes は完全一致契約へ強化。
  - 原本照合監査は HTML / Markdown / TSX の h1〜h6、SVG、callout / alert をインベントリ化し、欠落・改変を blocking failure（exit 1）として扱う。Node 回帰テストは **11件**すべて合格。
  - OpenClaw の条件付き `HEARTBEAT.md`、git worktree の signal trap、Netlify の Noto Sans JP 限定コメントを修正。`npm test` **164 files / 1467 tests**、typecheck、lint（457 files / 0 diagnostics）が Green。ユーザー指定により build と目視確認は省略。

- **Netlify ビルド失敗（Turbopack 496 errors）の恒久対処 — Noto Sans JP の自前ホスト化**:
  - 原因は `next/font/google` が Google Fonts の `@font-face` を**全件**ビルド時に取得する挙動。Noto Sans JP は CJK を `unicode-range` で 124 分割 × weight 4 種 = **496 `@font-face`** を返し、その一括取得が Netlify のビルドコンテナで失敗して `Can't resolve '@vercel/turbopack-next/internal/font/google/font'` が 496 件出ていた（`subsets: ["latin"]` は preload 判定のみでダウンロード数を減らさない）。SWC バイナリ欠損や `--webpack` 切り替えは的外れで、`netlify.toml` の該当コメントも訂正済み。
  - 対策: `web-next/scripts/vendor-noto-sans-jp.ts` で woff2 124 本 + `@font-face` CSS 496 件 + latin preload リストを生成し `web-next/public/fonts/` へ vendor。`lib/fonts.ts` は latin のみで完結する JetBrains Mono / Syne だけを `next/font` で読み、`--font-sans` は `globals.css` の `:root` で定義。`app/layout.tsx` は React 19 の `precedence` 付き `<link rel="stylesheet">` と latin preload を出力する。
  - 検証: `out/index.html` の `<head>` に stylesheet / preload が巻き上がることを確認。`out/_next/static/media` は 7.5MB → 184KB（mono/syne のみ）、フォント CSS は 449KB / brotli 18.9KB。契約テスト `web-next/tests/fonts-selfhost.test.ts` を 11 件追加（Vitest **164 files / 1466 tests** 全 Green ✅、typecheck / lint / build も Green）。

- **移行監査・Mermaid契約・ガイド原稿のレビュー指摘対応**:
  - 原本照合監査でHTML/Markdown/TSXの通常段落を出現回数込みのblocking対象へ追加し、MarkdownのMermaidフェンスを通常コードブロックから分離。`.markdown`入力にも対応。
  - Mermaid許可図種別を共有定義へ集約して`pie`を追加し、`block-beta`は引き続き禁止。C-6aの比較は外側空行と最小共通インデントだけを除去して相対インデントを保持。
  - OpenClaw bootstrapMode図、git worktree失敗時cleanup、Copilot coding agentの`AGENTS.md`優先順位、Copilot Code Reviewの一次資料・動的ベンチマーク記述を修正。
  - Node回帰テスト **7件**、npmでVitest **163 files / 1455 tests**、typecheck、変更対象のMarkdown lintがGreen。ユーザー指定によりビルドと目視確認は省略。

- **レビュー指摘の再検証とガイド・契約テストの修正**:
  - OpenClawのbootstrapMode条件を厳密化し、通常セッションとサブエージェントのブートストラップファイル経路を分離。
  - Copilot Code Reviewのレビュー深度・コスト削減・Martianベンチマーク・`.agent.md`とPlaywright MCPの説明を一次情報に合わせて修正。
  - Git worktreeのポート確認を助言的チェックとして明記し、gwtの`.env`操作をGitルート基準へ統一。
  - `/copilot/markdown-file-guide`の`excludeAgent`契約をコードブロックから抽出した値の完全一致に強化。npmでVitest **163 files / 1455 tests**、対象Biome、typecheckがGreen。ユーザー指定によりビルドと目視確認は省略。

- **GitHub Copilot .agent.md 実践ガイド（/copilot/agent）の Pure JSX 完全置き換え移行**:
  - `Github-copilot-agent-md-guide.html` を `web-next/app/copilot/agent/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。
  - 要約・省略なしで全10セクション（1. .agent.md とは何か〜10. 参考文献）、全52サブセクション（h3）、全表、全コードブロック（1行毎 `codeLine` ラッパー & 構文トークン化）、6 Mermaid図（`MermaidDiagram`）、TOCスクロール追従（`TocObserver.tsx`）、`TocObserver.test.tsx` の単体テスト・スクロールスパイ計算、`page-registry.ts` の内容更新・`lastReviewed` (2026-08-12) を完了。
  - 既存の旧 `/copilot/agent` コンテンツと完全入れ替え完了。
  - 原本 `Github-copilot-agent-md-guide.html` は `archive/Github-copilot-agent-md-guide.html` へ `git mv` 退避保存。
  - 契約テスト11件および TocObserver テスト4件（計15件）を作成し全クリア（**2026-08-12、commit `4031d76`時点**: Vitest **163 files / 1454 tests** 全 Green ✅）。

- **GitHub Copilot Agent Skills 公開仕様と Google Sandbox TOC アクセシビリティの修正**:
  - `/copilot/skill` の検証コマンドを `gh skill publish --dry-run` に統一し、公式に確認できない ToxicSkills 検出の説明を削除。ローカル導入の `--from-local` と `metadata.local-path` を明記し、公開用 `allowed-tools` の全例を空白区切り文字列へ統一。
  - `/google/sandbox-best-practices` の空アンカー10個に固定ヘッダー分の `scroll-margin-top` を設定し、モバイル目次の `aria-expanded` と「目次を開く／閉じる」の `aria-label` を同期。
  - サンドボックスではユーザー指定により npm を使用。Vitest **162 files / 1447 tests**、typecheck、lint（452 files / diagnostics 0）、pytest **43件**がGreen。ユーザー指定によりビルドと目視確認は省略。

- **OpenAI Codex 設定移行とモバイルTOCフォーカス管理の同期**:
  - 原本と`/codex/agent` でV1とMultiAgentV2の並列上限設定を分離。V1は `[agents]` の `max_concurrent_threads_per_session`（`max_threads` は別名）、V2は `[features.multi_agent_v2]` の `enabled = true` と `max_concurrent_threads_per_session` を使用し、V2のサブエージェント実効上限が設定値−1であることと、V2有効時の `agents.max_threads` が設定エラーになることを同期。TOMLセクションの子セクションまで検出するprefix-aware契約テストで、V1とV2のコードブロック分離も検証。
  - `agents.max_depth` はV1では実行時の深さ制限として使用し、MultiAgentV2では実行時制限に使用せずlineageとtask-pathの深さ計算にのみ使用することと、Codex PR `#20180` を原本と`/codex/agent` に明記。
  - アーカイブMarkdownの全9 Mermaidブロックで明示的な4スペースインデントを復元。V1/MultiAgentV2のスレッド上限キーを管理者制約表から通常設定表へ移し、ユーザーまたは信頼済みプロジェクトの `config.toml` 内での配置先を明記。
  - モバイルTOCを閉じた後、開いていた場合に限ってトグルへフォーカスを戻し、オーバーレイとTOCリンク経由をテスト。
  - サンドボックスではユーザー指定により npm を使用。Vitest **162 files / 1444 tests**、typecheck、lint（452 files / diagnostics 0）、pytest **43件**がGreen。ユーザー指定によりビルドと目視確認は省略。

- **レビュー指摘の現行コード再検証とガイド契約の強化**:
  - 移行スキルの契約数を「8 + 4」に統一し、CSS Modules と JSDOM の検証範囲、原本依存のレイアウト要件、TOC テストの責務を明確化。
  - OpenAI Codex のアーカイブ Markdown 2 件で Mermaid 文のインデントを修正し、MCP の実設定先を `.codex/config.toml`、`agents/openai.yaml` の役割を MCP ツール依存宣言として整理。
  - Hermes は自己参照フォント変数と Mermaid ラッパー、Harness はモバイルオーバーレイ・参考文献リスト・Mermaid ラッパーの契約を修復。
  - OpenAI Codex ガイドは TOC の CSS 重複採番を除去し、リンク先 section に基づくスクロール追従、初期アクティブ状態、通常時・早期 return 時のイベント解除、モバイルドロワーの `visibility` / `pointer-events` 同期を追加。見出し・チェックリスト・CSS・TOC の回帰テストを強化。
  - npm で Vitest **159 files / 1425 tests** と typecheck、pytest **43件**が Green。全体 lint は既存 diagnostics のみ（49 errors・2 warnings・3 infos）。ユーザー指定によりビルドと目視確認は省略。

- **OpenAI Codex ベストプラクティスガイド 2026（/codex/openai-codex-guide）の Pure JSX 完全置き換え移行**:
  - 原本 `Openai-codex-best-practices-2026.html` および `Openai-codex-best-practices-2026.md` を `web-next/app/codex/openai-codex-guide/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。
  - 要約・省略一切なしで全16セクション（1.Codexとは何か〜16.参考情報源）、全表、全コードブロック、6 Mermaid図解（`diag-loop`, `diag-plan`, `diag-agents`, `diag-sandbox`, `diag-subagents`, `diag-cicd`）、TOCスクロール追従（`TocObserver.tsx`）、15項目運用チェックリスト、全出典リンクを完了。
  - 既存の旧 `/codex/openai-codex-guide` コンテンツと完全入れ替え完了。
  - 原本 `Openai-codex-best-practices-2026.html` および `.md` は `archive/html/OpenAI/` および `archive/md/OpenAI/` へ `git mv` 退避保存。
  - 契約テスト11件（H1, 16 H2s, H3s, TOCリンク, Mermaidラッパー, 表構造, チェックリスト, Callout, 外部リンク, metadata）を作成し全クリア（bun test 全 Green ✅）。

- **OpenAI Codex ハーネスエンジニアリング実践ガイド（/codex/harness-engineering）の Pure JSX 100% Faithful 完全修復 ＆ 包括的回帰テスト・スキル強化**:
  - 原本 `Openai-codex-harness-engineering-evals.html` から 100% 寸分違わぬテキスト・セクション・スタイリングへ修復完了。
  - `page.test.tsx` に **8つの必須契約・包括的回帰防止テスト（全11テスト）** を新規整備し全 Green ✅。見出しID・タイトルの完全一致、H3レイヤークラス（L1〜L7）、クイックナビカード（L1〜L7）、TOC初期アクティブ状態、スクロール時のリアルタイムアクティブ切り替え、Mermaidラッパー構造、参考文献4カテゴリ・外部リンク安全属性をすべて契約テスト化。
  - `TocObserver.tsx` を `getBoundingClientRect` リアルタイム・スクロールスパイ計算へ刷新。
  - `.claude/skills/nextjs-page-migration/SKILL.md` に「8つの必須契約・回帰テスト定義」と「TocObserver スクロール自動追従の決定的な実装規則」をブラッシュアップ追加。（Vitest **158 files / 1418 tests** 全 Green ✅）。

- **Hermes Agent ベストプラクティスガイド（/agent/hermes-agent-advanced-guide）の Pure JSX 完全置き換え移行**: `Harness-engineering-google-guide.html` を `web-next/app/agent/hermes-agent-advanced-guide/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。要約・省略一切なしで全17セクション（1.Hermes Agentとは何か〜17.参考文献・出典）、全表、全コードブロック、11 Mermaid図、TOCスクロール追従（`TocObserver.tsx`）、総括チェックリスト、`page-registry.ts`（タイトル・概要・`lastReviewed` 2026-08-10）を完了。既存の旧 `/agent/hermes-agent-advanced-guide` コンテンツと完全入れ替え完了。原本 `Harness-engineering-google-guide.html` は `archive/Harness-engineering-google-guide.html` へ `git mv` 退避保存。契約テスト 8 件を作成・全クリア（Vitest **158 files / 1414 tests** 全 Green ✅）。

- **GitHub Copilot Agent Skills 実践ガイド（/copilot/skill）の Pure JSX 完全置き換え移行**: `Github-copilot-skillmd-guide.html` を `web-next/app/copilot/skill/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。要約・省略なしで全16セクション（このガイドについて〜14.まとめ、参考文献・出典）・全表・全コードブロック・7 Mermaid図・TOCスクロール追従（`TocObserver.tsx`）・インタラクティブチェックリスト（`ChecklistCard.tsx`）・`page-registry.ts`（`lastReviewed` 更新）を完了。既存の旧 `/copilot/skill` コンテンツと完全入れ替え完了。原本 `Github-copilot-skillmd-guide.html` は `archive/Github-copilot-skillmd-guide.html` へ `git mv` 退避保存。契約テスト 7 件を更新し全クリア。

- **Google サンドボックス技術 完全ガイド（/google/sandbox-best-practices）の Pure JSX 完全置き換え移行**: `Google-sandbox-best-practices.html` を `web-next/app/google/sandbox-best-practices/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。要約・省略なしで全10セクション（1.はじめに〜10.参考文献）・全表・全コードブロック・9 Mermaid図・TOCスクロール追従（`TocObserver.tsx`）・`TocObserver.test.tsx` の単体テスト・`page-registry.ts`（タイトルおよび `lastReviewed` 更新）を完了。既存の旧 `/google/sandbox-best-practices` コンテンツと完全入れ替え完了。原本 `Google-sandbox-best-practices.html` は `archive/html/google/Google-sandbox-best-practices.html` へ `git mv` 退避保存。契約テストおよび `TocObserver.test.tsx` の全クリアを達成。

- **CodeRabbit Cloud/SaaS 設定優先順位図とグローバルオーバーライド仕様の更新**: CodeRabbit Cloud/SaaS における設定解決階層図 (`DIAGRAM_2` および `.md` / `.html` 原稿) を修正。通常階層（リポジトリ内 YAML 〜 スキーマ既定値）でベース設定を評価後、継承処理後の最終マージ層として Organization Global Override および Workspace Global Override (Enterpriseのみ) が最優先適用される二段階フローチャート構造へ刷新。リポジトリ側の設定で組織・ワークスペースの必須ポリシー（強制プロファイル・必須 path_instructions 等）を無効化できないことを明確化・更新。Vitest **157 files / 1414 tests** 全 Green、typecheck ✅。

- **CodeRabbit公開仕様・TOCアクセシビリティ・スクロール追従テストの修正**: CodeRabbitの設定階層をCloud / SaaS、Cloud連携Self-Hosted Git provider組織、完全Self-Hosted deploymentに分け、Global Overrideを通常階層の固定最上位ではなく解決後の最終マージ層として明記。カスタムレシピ上限をPro+・Enterpriseのリポジトリごと最大20件へ同期した。`/claude/skill`は交差中sectionをcallback間で保持して最上部を選択し、CodeRabbit・SonarQube・git-worktreeのTOCトグルは`aria-expanded`と状態依存ラベルを同期。SonarQubeの外部リンクテストは`rel`を空白区切りtokenとして厳密検証する。Vitest **157 files / 1414 tests**、typecheck、変更対象11ファイルのBiome、Markdown lintはGreen。全体lintは作業範囲外の既存17 diagnosticsで失敗。ユーザー指定によりビルドと目視確認は省略。

- **`bun audit` 検出の脆弱性 10 件を解消（CI 復旧・2 回目）**: CI の `Dependency vulnerability audit` ステップ（`.github/workflows/test.yaml`）が再び exit 1 で失敗していた問題を修正（high 2 / moderate 7 / low 1）。`bun update` の全体実行は行わず overrides による外科的 pin のみで、ロックファイル差分は該当 4 パッケージに限定（Biome 等の devDependencies は再解決されていない）。検証は `bun audit` = `No vulnerabilities found`（exit 0）、Vitest **157 files / 1412 tests**（変化なし）、typecheck、build、pytest 43 件すべて Green。lint は作業範囲外の既存 19 diagnostics のみで変化なし。
  - **mermaid 10.9.6 → 10.9.8**（直接依存）: GHSA-c4c3-pg64-4m4v（設定 API の prototype pollution）/ GHSA-6x64-9x62-f2gx（兄弟要素への CSS injection）/ GHSA-2v8p-3f2j-5mp7（XY Chart の無限ループ DoS）。10.x 保守ラインのパッチであり、破壊的変更を含む 11.x は採らない。
  - **overrides `dompurify` `^3.4.12` → `^3.4.13`**: GHSA-55q2-fjhq-7xh7（IN_PLACE フック除去後の detached subtree が実行可能になり XSS）。勧告が `<=3.4.12` のため、前回引き上げた override の下限がそのまま脆弱版を指す状態になっていた。
  - **overrides `undici` `^7.28.0` → `^7.29.0`**: GHSA-4cwx-7wf7-3272（private cache directive によるユーザー間情報漏洩）他 5 件。`cheerio`（`^7.19.0`）/ `jsdom`（`^7.24.5`）の要求を満たすため 8.x へは上げず 7 系のまま昇格。
  - **overrides `nanoid` `^3.3.17` を新規追加**: GHSA-2v37-7h3g-55p8（size=0 でカスタム生成器が無限ループ）。`postcss` 等の宣言範囲内であってもロックファイルで脆弱なバージョンが解決され続けていたため明示的な override を追加（`next` / `@tailwindcss/postcss` / `vitest → vite` の 3 経路すべてに適用）。
  - **教訓: overrides は「勧告の境界バージョン」とともに陳腐化する** — 書いた時点で最新でも、新規勧告が出れば同じ pin が脆弱版の固定に転じる。監査失敗時はまず overrides の下限が現在の勧告レンジを外れていないかを確認する。また overrides は通常指定したパッケージ自体に影響するため、子依存のピン留めが必要なパッケージは直接ターゲットにして指定する必要がある。

- **SonarQube PR カバレッジゲート対応（TocObserver 4件 + Checklist）**: PR #139 の Coverage on New Code が **60.8%** に低下していた原因は、`tests/setup.ts` のグローバル `IntersectionObserver` が no-op スタブで observer コールバック本体が一度も実行されないこと。既存の `tests/tocTestUtils.tsx` の `installIntersectionObserverStub()`（コールバックを捕捉し `emit()` で発火できる制御可能スタブ）を適用し、`/code-review/coderabbit-guide`・`/code-review/sonar-qube`・`/git-worktree` の `TocObserver.tsx` に新規テストを追加、`/claude/skill` の既存テストへスクロールスパイとバックトゥトップ可視性の分岐を追補、`/code-review/sonar-qube` の `Checklist.tsx` に状態遷移テストを追加。Sonar 算式（(covered lines + covered conditions)/(lines + conditions)）で 38.2% → 95.6%、44.0% → 96.0%、63.3% → 100%、86.9% → 93.8%、65.0% → 100%。実装コードは無変更。Vitest **157 files / 1412 tests**、typecheck、build は Green（lint は作業範囲外の既存19 diagnostics のみ）。

- **git worktreeで実現する並列開発ベストプラクティスガイド（/git-worktree）の Pure JSX 完全置き換え移行とコードブロックハイライト最適化**: `Git-worktree-parallel-dev-guide.html` を `web-next/app/git-worktree/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。要約・省略なしで全15セクション（全15H2セクション, 全表, 全コードブロック, 5 Mermaid図, 11項目のチェックリスト, 参考文献カード群等）・TOCスクロール追従（`TocObserver.tsx`）・`page-registry.ts`（`lastReviewed` およびタイトル更新）を完了。さらに全コードブロックの `codeLine` 行構造化およびトークン構文ハイライト（`styles.ck`, `styles.cs`, `styles.cv`, `styles.cc`, `styles.cm`, `styles.fn`）を適用。既存の旧 `/git-worktree` コンテンツと完全入れ替え完了。原本 `Git-worktree-parallel-dev-guide.html` は `archive/Git-worktree-parallel-dev-guide.html` へ `git mv` 退避保存。契約テスト6件を更新し全クリア（Vitest **153 files / 1370 tests** 全 Green ✅）。

- **SonarQubeコードレビュー実践ガイド（/code-review/sonar-qube）の Pure JSX 完全置き換え移行**: `Sonarqube-code-review-best-practices.html` を `web-next/app/code-review/sonar-qube/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。要約・省略なしで全16-H2セクション（全表, 全コードブロック, 9 Mermaid図, チェックリスト等）・TOCスクロール追従（`TocObserver.tsx`）・インタラクティブチェックリスト（`Checklist.tsx`）・`page-registry.ts`（`lastReviewed` 更新）を完了。既存の旧 `/code-review/sonar-qube` コンテンツと完全入れ替え完了。原本 `Sonarqube-code-review-best-practices.html` は `archive/Sonarqube-code-review-best-practices.html` へ `git mv` 退避保存。契約テスト7件を更新し全クリア（Vitest `app/code-review/sonar-qube/page.test.tsx` 全 Green ✅）。

- **CodeRabbit 実践ガイド（/code-review/coderabbit-guide）の Pure JSX 完全置き換え移行**: `Coderabbit-best-practices.html` を `web-next/app/code-review/coderabbit-guide/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。要約・省略なしで全17-H2セクション（全17H2セクション, 全表, 全コードブロック, 10 Mermaid図, 32参考文献カード等）・TOCスクロール追従（`TocObserver.tsx`）・`page-registry.ts`（`lastReviewed` 更新）を完了。既存の旧 `/code-review/coderabbit-guide` コンテンツと完全入れ替え完了。原本 `Coderabbit-best-practices.html` および `.md` は `archive/html/code-review/` および `archive/md/code-review/` へ `git mv` 退避保存。契約テスト7件を更新し全クリア（Vitest **153 files / 1370 tests** 全 Green ✅）。

- **Claude Code AI仕様駆動開発ガイド（/claude/skill）の Pure JSX 完全置き換え移行**: `Claude-code-spec-driven-development-guide.html` を `web-next/app/claude/skill/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。要約・省略なしで全15セクション（s0〜s14）・全表・全コードブロック・5 Mermaid図 (`diagram-workflow`, `diagram-login-sequence`, `diagram-implementation`, `diagram-context-loading`, `diagram-data-flow`)・TOCスクロール追従（`TocObserver.tsx`）・外部リンク安全属性・`page-registry.ts`（`lastReviewed` 更新）を完了。既存の旧 `/claude/skill` コンテンツと完全入れ替え完了。原本 `Claude-code-spec-driven-development-guide.html` および `.md` は `archive/html/Anthropic/` および `archive/md/Anthropic/` へ `git mv` 退避保存。契約テスト9件を更新・通過し全クリア（Vitest **152 files / 1366 tests** 全 Green ✅）。

- **SonarQube 新規コードカバレッジ修正**: `MermaidDiagram` の例外型別正規化、初期化失敗、`foreignObject` 配色、一時描画要素の競合 cleanup を検証する9ケースを追加。対象ファイルは line coverage **100%**、branch coverage **94.53%**、function coverage **100%**、全体 line coverage **92.25%**。目視・ビルドは依頼により省略。Vitest **152 files / 1357 tests** と typecheck は Green。
