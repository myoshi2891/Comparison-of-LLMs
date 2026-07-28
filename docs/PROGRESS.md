# プロジェクト進捗・ステータス (PROGRESS.md)

> 本ファイルは Next.js 移行完了後の保守・改善フェーズにおける開発の進捗（特にテスト関連）および品質チェックのルールを記録する。
> - 最終更新日: **Updated 2026-07-28**
> - 過去の移行進捗・旧ルール: [`docs/archive/MIGRATION_PROGRESS.md`](archive/MIGRATION_PROGRESS.md)
> - 移行計画アーカイブ: [`docs/archive/NEXTJS_PHASE_A_F_PLAN.md`](archive/NEXTJS_PHASE_A_F_PLAN.md)

## 現在のステータス

- **フェーズ**: 保守・機能改善・品質強化フェーズ
- **ブランチ**: `dev`（本番 `main` への Next.js 移行マージ完了 🚀）
- **動作検証**:
  - `bun run build` ✅（`web-next` の全ルートが Static プリレンダリングされる。※Antigravity環境では実行禁止）
  - `bun run typecheck` ✅
  - `npm run lint` ⚠️（**27 errors / 2 warnings**。今回のレビュー範囲外を含む既存の未整形・semantic 診断が残るため、全体自動修正は未実施）
- **テストの実行状況**:
- **フロントエンド (`web-next/`)**: Vitest 実行で **1232 件すべて合格** (全 Green ✅)
  - **バックエンド (`scraper/`)**: pytest 実行で **43 件すべて合格** (全 Green ✅)

## 最近の追加内容

- **レビュー追加指摘のアクセシビリティ・Mermaid・文書整合性修正**: Claude Agent / Fable 5 / AI SDD のモバイル目次で状態依存の `aria-label` と `aria-expanded` を同期し、閉状態を `visibility: hidden` + `pointer-events: none`、開状態を visible + interactive に統一。
  Gemini 静的 HTML の目次にも一意な ID / `aria-controls` / `aria-expanded` と開閉ラベル同期を追加。Harness Mermaid ソースをカラム0へ修正し、2つの Skill HTML では描画 Promise の rejection 時に既存 SVG を保持しつつ fallback 文言を表示。
  Claude Platform の `name` / `description` を任意とする frontmatter 説明と Fable 5 のヒーロー改訂日を基準日に同期。Vitest **1232 件** / typecheck 全 Green、lint は既存ベースラインの **27 errors / 2 warnings**（ビルド・目視確認は依頼により省略）。
- **レビュー指摘の現行コード照合とガイド品質修正**: 静的 HTML/Markdown の Mermaid 初期化・脚注・パス・リンク・アクセシビリティを現行コードと原本に照合して修正。Next.js 側は Claude 2ページと AI SDD ガイドのモバイル TOC を Server Component 維持のまま操作部分だけ Client Component 化し、チェックボックスのラベル、装飾 SVG、流動幅レイアウト、SDD の単一 `h1`、monospace CSS 変数の自己参照を修正。共有 `MermaidDiagram` は `default` / `forest` / `neutral` のネイティブ配色を保持し、sequenceDiagram の色補正を関数抽出。`IntersectionObserver` テストモックを setupFiles へ集約し、Vitest **1232 件** / typecheck 全 Green（ビルド・目視確認は依頼により省略）。
- **仕様駆動開発（SDD）実践ガイド ― 中級・上級エンジニア向けベストプラクティス（/sdd/spec-driven-development-guide）の Next.js 移行**: `Spec-driven-development-guide.html` を `web-next/app/sdd/spec-driven-development-guide/page.tsx` に Pure JSX として完全忠実移植 🚀。要約・省略一切なしで全16セクション・全1.1〜14.1サブセクション・全8表・全コードブロック・10 Mermaid図・全コールアウト・全58件参考文献・TOCスクロール追従（`TocObserver.tsx`）・外部リンク安全属性・`page-registry.ts`（`開発プロセス` グループ）登録を完了。メインコンテンツ幅を 100% 化し画面全幅に拡張。第11章（タイムライン型カード）、第15章（SVGアイコン付きチェックリストグリッド）、第16章（ナンバーバッジ付きカードグリッド）のデザインブラッシュアップを完了。原本 `Spec-driven-development-guide.html` は `archive/html/SDD/Spec-driven-development-guide.html` へ `git mv` 退避保存。契約テスト5件を追加。
- **AI仕様駆動開発（Spec-Driven Development）実践ガイド（/sdd/ai-spec-driven-development-guide）の Next.js 移行とグローバルナビ同期**: `Ai-spec-driven-development-guide.html` を `web-next/app/sdd/ai-spec-driven-development-guide/page.tsx` に Pure JSX として完全忠実移植 🚀。要約・省略なしで全13章（全12セクション+参考文献）・全表・全コードブロック・6 Mermaid図・TOCスクロール追従（`TocObserver.tsx`）・外部リンク安全属性・`page-registry.ts`（`開発プロセス` グループ）登録を完了。原本 `Ai-spec-driven-development-guide.html` / `Ai-spec-driven-development-guide.md` は `archive/html/SDD/` および `archive/md/SDD/` へ `git mv` 退避。契約テスト5件を追加し全クリア。
- **Claude Fable 5 実践活用ガイド（/claude/fable-5-best-practices）のフィールドガイド版への全面刷新**: 『地図は、現地ではない。』から始まる最新のフィールドガイド版 `Fable5-guide.html` を `web-next/app/claude/fable-5-best-practices/page.tsx` に Pure JSX として完全忠実移植 🚀。要約・省略なしで全15セクション・全表・全コードブロック・12 Mermaid図・TOCスクロール追従（`TocObserver.tsx`）・外部リンク安全属性を適用し、旧コンテンツと置き換え完了。原本 `Fable5-guide.html` は `archive/html/` へ `git mv` 退避。契約テスト6件を更新し全クリア（Vitest PASS）。
- **Claude サブエージェント & Agent Teams ベストプラクティスガイド（/claude/agent）の刷新**: `Claude-code-subagents-agentteams-markdown-bestpractices.html` を `web-next/app/claude/agent/page.tsx` に Pure JSX として完全忠実移植 🚀。要約・省略なしで全9セクション・全表・全コードブロック・4 Mermaid図・TOCスクロール追従（`TocObserver.tsx`）・外部リンク安全属性・`page-registry.ts` 登録を完了。原本 `Claude-code-subagents-agentteams-markdown-bestpractices.html` は `archive/html/` へ `git mv` 退避。契約テスト5件を更新し全クリア（Vitest **1183 件** / pytest **43 件** 全 Green ✅）。
- **Claude Fable 5 追加 + 参考リンク集の更新（新2社カード・リンク切れ修正）**: コスト計算機の Anthropic 料金一覧に最上位モデル **Claude Fable 5**（$10 / $50 per 1M・1M ctx）を追加（`anthropic.py` の `_FALLBACKS`/`_TAG`/`_CLS`/`_SUB_*` 先頭、TDD）。参考リンク集（`RefLinks.tsx`）へ **Moonshot(Kimi) / Zhipu(GLM)** の公式料金ページカードを追加（16→18枚）し、リンク切れ3件を修正（Claude Code pricing `docs.anthropic.com/.../pricing`→`docs.claude.com/.../costs`、Windsurf `credits-and-billing`→`docs.windsurf.com/`、Junie `junie/faq/`→`help/junie/faq.html`）。Zhipu 料金は `z.ai/pricing` が 404 のため `docs.z.ai/guides/overview/pricing` を採用。全 URL を curl 実測で検証（403 のボット保護3件・FRED の HTTP/2 quirk は切れではないと確認）。`pricing.json` 3ファイルへ Fable を反映。Vitest **1203 件** / pytest **43 件** 全 Green。
- **Google AI スクレイパーの `price_in` 誤スクレイプバグ修正（ライブ抽出を無効化）**: `providers/google.py` の `price_in` 抽出が、料金ページ上のモデル名手前の無関係な `$` 額を拾う正規表現バグ（逆順パターン `\$X ... model_key`）で全 Google AI モデルの入力価格を汚染していた。原因調査の結果、当該ページは TOC 重複・ラベル無し価格・1モデル複数価格併記のため正規表現抽出が構造的に不安定（実測で正しく取れるモデルが 0 件）と判明。TDD で ① 逆順パターン除去 → ② `input` キーワードアンカー追加を試行するも 2 モデルが残存したため、最終的にユーザー方針で **ライブ抽出を廃止し `_FALLBACKS`(SSoT/WebSearch確定値) を決定論的に採用**（Vertex と同扱い）。`scrape()` を `_FALLBACKS` 生成のみに簡素化（`get_page_text` 不使用）、`TestGoogle` をフォールバック固定・ネット非依存へ更新、smoke で Google を分離。設計判断を CLAUDE.md に固定（スクレイプ復活の禁止）。pytest **42 件合格（据え置き）**。
- **2026-07 月次更新: 新規2社(Moonshot(Kimi)/Zhipu(GLM))追加 + 既存6社の 2026-07 モデル刷新**: Moonshot(Kimi)（Kimi K3 / K2.6）と Zhipu(GLM)（GLM-5.2 / GLM-4.6）を新規プロバイダースクレイパーとして追加（`providers/moonshot.py` / `zhipu.py`、`cls="tag-oss"`）。既存6社（Anthropic/OpenAI/Google/AWS/DeepSeek/xAI）の `_FALLBACKS` を GPT-5.6 系・Claude Sonnet 5・Gemini 3.6 Flash / 3.5 Flash-Lite・Grok 4.5・Amazon Nova Premier / Lite 追加で刷新。フロント側は唯一のハードコード `ApiTable.tsx` の `PROVIDER_COLORS` に新2社（Moonshot(Kimi)=`#818cf8` / Zhipu(GLM)=`#f472b6`）を追加（Red→Green、色検証テスト2件）。`pricing.json` を再生成（USD/JPY 163.47）し、Google AI 全モデルの `price_in` ライブ誤スクレイプ（ページ上の無関係な `$` 額を拾う既存の正規表現バグ）と Amazon Nova Premier の `price_out` を SSoT(`_FALLBACKS`) 値へ直接補正。provider ブロックの連続性・型パリティ・build/lint/typecheck を全 Green で確認（合計 **1202 テスト合格**、pytest **42 件合格**）。
- **Mermaid 図解レイアウトの全サイト統一（中央寄せ・全幅・横スクロール）**: 共有コンポーネント `web-next/components/docs/MermaidDiagram.tsx` を2層構造（外側=`width:100%` / 内側=`display:flex; justify-content:center`、`useMaxWidth:false` + `mermaid.run` 後に svg へ `max-width:100%; height:auto` を付与）に変更し、**図解レイアウトの唯一の真実の源**とした。従来は約50ページの `page.module.css` が個別に `:global(.mermaid)` / `:global(svg)` の幅を強制しており、`svg{width:100%}`（引き伸ばし）／`svg{max-width:100%}`（縮小）／override 無し（左寄せ）の三分裂が起きていた。34 ページの per-page レイアウト強制ルールを削除（配色テーマルールは保持）し、`enterprise-agent-platform-intermediate` はフレーム装飾を `.diagramWrap` へ移設。併せてユーザー要望により 32 ページの本文カラムの固定 `max-width`（1000〜1200px のバラつき）を**統一の 1440px**（サイトの `.container` と同値。旧値より広くしつつワイド画面でのバランスを確保）に揃え、手書き（非 Mermaid）横並び図解の中央寄せも修正（`claude/skill`・`claude/agent`・`google/agent`・`codex/skill`・`copilot/skill`・`copilot/markdown-file-guide`・`copilot/agent`・`google/skill`・`google/antigravity-guide`）、`claude/skill-guide` は 900px 固定を外してサイドバートラックいっぱいに。Mermaid は列幅への縮小フィット＋中央寄せに変更。静的ビルドを別ポートで配信し **Playwright でレンダリング座標を実測**して全図の中央寄せ・全ページのコンテンツ幅を検証（残る左寄せ検出はヒーローのメタ/バッジ行のみで意図的）。`MermaidDiagram.test.tsx` を新設（Red→Green）、`gpt-5-6` 契約テストを新不変条件へ更新。不変条件を `.claude/rules/mermaid-diagram-layout.md` に固定し、`fix-mermaid` / `nextjs-page-migration` スキルをブラッシュアップ（合計 **1199 テスト合格**）。
- **PR #126 SonarCloud Quality Gate の新規コードカバレッジを復旧**: Gemma、Kimi、Amazon Bedrock 2ページの `TocObserver.tsx` はページ契約テストで初期化だけが実行され、`IntersectionObserver` コールバックの32条件中26条件が未カバーだったため、新規コードカバレッジが47.7%（基準80%）まで低下していた。クラス選択型と `href` 解決型の共通テストスイートを追加し、4ファイルすべて行・条件カバレッジ100%を実測。テスト12件を追加して合計 **1195 テスト合格**とし、併せて既存ファイルのBiome指摘26 errors / 1 warningもファイル単位で全件解消した。
- **Amazon Bedrock 活用ベストプラクティスガイドの Next.js 移行とグローバルナビ同期**: `Amazon-bedrock-best-practices-guide.html` を `web-next/app/infra/amazon-bedrock-best-practices-guide/page.tsx` に Pure JSX として完全忠実移植 🚀。要約・省略なしで全18セクション・全表・全コードブロック・6 Mermaid図・TOCスクロール追従・外部リンク安全属性・グローバルナビ（`運用・品質` グループ / `page-registry.ts`）登録を完了。原本 `Amazon-bedrock-best-practices-guide.html` は `archive/` へ `git mv` 退避。契約テスト5件を追加し全クリア（合計 **1183 テスト合格**）。
- **Amazon Bedrock ベストプラクティス完全ガイドの Next.js 移行とグローバルナビ同期**: `Amazon-bedrock-best-practices-2026-intermediate.html` を `web-next/app/infra/amazon-bedrock-best-practices-2026-intermediate/page.tsx` に Pure JSX として完全忠実移植 🚀。要約・省略なしで全15セクション・全表・全コードブロック・6 Mermaid図・TOCスクロール追従・外部リンク安全属性・グローバルナビ（`運用・品質` グループ）登録を完了。原本 `Amazon-bedrock-best-practices-2026-intermediate.html` は `archive/` へ `git mv` 退避。契約テスト5件を追加し全クリア（合計 **1178 テスト合格**）。
- **Kimi(Moonshot AI) LLM 徹底ガイドの Pure JSX 移行とグローバルナビ同期**: `Kimi-llm-best-practices.html` を `web-next/app/moonshot/kimi-llm-best-practices/page.tsx` に Pure JSX として完全忠実移植 🚀。要約・省略なしで全19セクション・全表・全コードブロック・9 Mermaid図・TOCスクロール追従・外部リンク安全属性・グローバルナビ登録を完了。原本 `Kimi-llm-best-practices.html` / `.md` は `archive/html/moonshot/` および `archive/md/moonshot/` へ `git mv` 退避。契約テスト5件を追加し全クリア（合計 **1173 テスト合格**）。
- **OpenAI GPT-5.6 完全ガイドの Pure JSX 移行とグローバルナビ同期**: `Gpt-5.6-best-practices-guide.html` を `web-next/app/model-data/gpt-5-6-best-practices/page.tsx` に Pure JSX として完全忠実移植 🚀。要約・省略なしで全18セクション・全7表・8 Mermaid図・コードブロック・TOCスクロール追従・外部リンク安全属性・グローバルナビ登録を完了。仮の `GuideContent.tsx` 動的読み込みを廃止し、原本 `Gpt-5.6-best-practices-guide.html` / `.md` を `archive/` へ `git mv` 退避。契約テストを増強し全クリア（合計 **1168 テスト合格**）。
- **Google Gemma 実践ガイド 2026 の Next.js 移行**: `Gemma-best-practices-guide.html` を `web-next/app/google/gemma-best-practices-guide/page.tsx` に移行 🚀。原文の全14セクション・全表・全コードブロック・7 Mermaid図を React 要素として faithful に保持し、TOCのスクロール追従、外部リンクの安全属性、ページレジストリ登録、CSS Modules化によるCSS変数定義のスコープ化、フッター等幅フォント設定を追加。原本は `archive/html/google/` および `archive/md/google/` 配下に退避。契約テスト6件を追加（合計 **1167 テスト合格**）。
- **Biome 指摘 224 件を全て解消（lint がクリーンに）**: `bun run lint` の 36 errors / 186 warnings / 2 infos をゼロにした。テストは **1161 件合格（変化なし）**、build / typecheck / pytest 38 件も全て Green。
  - **CSS 警告 179 件**（`noImportantStyles` 169 + `noDescendingSpecificity` 10）: `biome.json` の `overrides` で `app/**/page.module.css` に限定して無効化。これらは `globals.css` の素の要素セレクタを打ち消すための意図的な `!important` であり、除去するとガイドページ 24 枚の表示が壊れる。**理由は `biome.json` 内に書けない** — 厳密 JSON のためコメントを入れると設定がパース不能になり、Biome がデフォルト設定へフォールバックして `node_modules` まで走査する（実際に一度踏んで 154,586 件の診断が出た）。よって理由は CLAUDE.md に記載。これに伴い不要化した `biome-ignore` コメント 48 件を 11 ファイルから削除。
  - **format 22 + organizeImports 2**: 該当ファイルのみ個別に `biome check --write`（リポジトリ全体走査は禁止ルール）。CSS 20 ファイルは「コメント・引用符・空白を正規化すると変更前後が完全一致」することを機械的に検証済み＝**意味的変更ゼロ・視覚回帰リスクなし**（実変更は `'` → `"` の統一と複数値プロパティの改行のみ）。
  - **`noArrayIndexKey` 9 件**（`app/model-data/gpt-5-6-best-practices/GuideContent.tsx`）: ビルド時に確定する静的 Markdown 由来の表セル・リスト項目。内容ベースのキーにすると「○」「必須」等の重複で**キー衝突という実在のバグを新たに作り込む**ため、index キーのままが正しい。理由付きの局所抑制で対応（抑制コメントは `if` 文ではなく対象の JSX 直前に置かないと効かない）。
  - **その他**: `noEmptyBlockStatements` 3 件は他 10 数ファイルと同じ `{ /* mock */ }` 形式へ統一。`noNonNullAssertion` 2 件はアクセサ関数経由の読み取りで `!` を除去（`capturedCallback` の代入が `render()` 内のコンストラクタ経由で TS の制御フロー解析から見えず、直接参照すると `never` へ絞り込まれる。型注釈では回避できない）。`useTemplate` 2 件 / `useOptionalChain` 1 件 / 不要な suppression 3 件も解消。
- **`bun audit` 検出の脆弱性 2 件を解消（CI 復旧）**: CI の `Dependency vulnerability audit` ステップ（`.github/workflows/test.yaml`）が exit 1 で失敗していた問題を修正。① **high**: `next` の optionalDependency である `sharp` が 0.34.5（libvips 1.2.4）で GHSA-f88m-g3jw-g9cj（CVE-2026-33327 / 33328 / 35590 / 35591）に該当 → `overrides` に `"sharp": "^0.35.3"` を追加し libvips 1.3.2 へ更新。`next@16.2.6` の宣言レンジ `^0.34.5` は外れるが、本プロジェクトは `images: { unoptimized: true }` + `output: 'export'` の pure SSG で sharp のコードパスを一切実行しないため実害なし（`engines.node >= 20.9.0` は Netlify `NODE_VERSION=20` / CI Node 22 の双方を満たす）。② **low**: `mermaid` → `dompurify` が 3.4.11 で GHSA-c2j3-45gr-mqc4 に該当 → 既存 override を `^3.4.11` → `^3.4.12` へ引き上げ（脆弱版が範囲に残らないよう下限を更新）。mermaid 10.9.6 の宣言 `^3.2.4` を満たすため **mermaid 本体のアップグレードは不要**。`bun update` の全体実行は行わず overrides による外科的 pin のみ。ロックファイル差分は sharp サブツリー + dompurify + semver に限定。`bun audit` は `No vulnerabilities found`（exit 0）、テストは **1161 件合格（変化なし）**。
- **共有フック `useTocObserver` のカバレッジ拡充とサブリンク親章連動バグの修正**: PR #124 の SonarCloud Quality Gate が `new_coverage 64.3% < 80%` で失敗していた原因（`web-next/lib/useTocObserver.ts` の 18 行・17 分岐が未カバー）を解消。`web-next/lib/useTocObserver.test.tsx` を新設し、サブリンク経路・モバイルサイドバー開閉・複数 entry の最上位選択・クリーンアップを直接検証（行 65/65・分岐 36/37）。テスト作成の過程で、サブリンク交差時に親章の TOC リンクを点灯させる処理が `subLink.closest("section")` を使っており、TOC リンクはサイドバー内にあって `<section>` の子孫にならないため本番で一度も実行されない死んだコードだったことが判明 → 交差した対象要素側から `closest("section")` する形に修正。併せて、リスナ登録ブロック内でしか呼ばれないハンドラの到達不能な null ガードを `const` クロージャ化して除去。TDD の Red / Green / Refactor を分割コミット。契約テスト 14 件を追加（合計 **1161 テスト合格**）。
- **AWS Bedrock ガイドの表記および Mermaid 修正**: `Amazon-bedrock-best-practices-guide.md` 内の Mermaid フローチャートのインデントをカラム 0 に揃え、Contextual Grounding（コンテキスト根拠確認）の実行条件と、その後の Automated Reasoning 事実検証およびアプリ側による再生成・拒否・代替応答判断の評価フローを明示（Mermaid 図と表の両方に反映）。また、Converse API 説明での複数 Guardrail 同時適用（重ね合わせ）の記述を `guardrailConfig` で指定できる単一の Guardrail の適用に修正。（合計 **1147 テスト合格**）。
- **Gemini Enterprise Agent Platform (中級) ガイドの Next.js 新設移行**: `Gemini-enterprise-agent-platform-best-practices.html` (実践ベストプラクティスガイド、中級向け) を `web-next/app/google/enterprise-agent-platform-intermediate/page.tsx` に新設移行。既存の完全ガイドはそのまま残し、原文の全14セクション・7 Mermaid図・コードブロックを React 要素として faithful に保持。SEO Heading 構造の適合（単一 h1 化）、TOC のスクロール追従、外部リンクの安全属性、ページレジストリ登録、CSS modules 化による CSS 変数定義 of スコープ化、フッター等幅フォント設定を追加。原本は `archive/html/google/` 配下に退避。契約テスト6件を追加（合計 **1144 テスト合格**）。
- **Gemini Enterprise Agent Platform ガイドの Next.js 移行**: `Gemini-enterprise-agent-platform-guide.html` を `web-next/app/google/enterprise-agent-platform/page.tsx` に移行。原文の全20セクション・チェックリスト・アンチパターン・外部リンク・15 Mermaid図を React 要素として faithful に保持し、TOC のスクロール追従、外部リンクの安全属性、ページレジストリ登録、テーブル左寄せ強制、CSS modules 化による CSS 変数定義のスコープ化、フッター等幅フォント設定を追加。原本は `archive/html/google` および `archive/md/google` 配下に退避。契約テスト7件を追加（合計 **1138 テスト合格**）。
- **Claude Tag ガイド CSS 移行修正**: `web-next/app/claude/tag-best-practices/page.module.css` の3件の CSS 不具合を修正。① `--bg-elevated` / `--bg-card` / `--accent` 等の CSS 変数が `globals.css` に存在しないため全配色が崩壊していた問題を、`.layout` スコープ内に元 HTML の `:root` 定義を移植して解決。② `.sidebar` に `position: sticky; top: 0; height: 100vh; overflow-y: auto` を追加してスクロール時のサイドバー固定を実現。③ `.sidebarToggle { display: none }` をメディアクエリ外に追加してデスクトップでのハンバーガーボタン非表示を修正。また `.pageFooter` で未定義だった `--text-tertiary` を `--text-faint` に修正（合計 **1130 テスト合格、変化なし**）。
- **Claude Tag 活用ガイドの Next.js 移行**: `Claude-tag-best-practices.html` を `web-next/app/claude/tag-best-practices/page.tsx` に移行。原文の全15セクション・10チェックリスト・全表・6 Mermaid図を React 要素として faithful に保持し、TOC のスクロール追従、モバイル開閉トグル、外部リンクの安全属性、ページレジストリ登録を追加。原本は `archive/html/Anthropic` および `archive/md/Anthropic` 配下に退避。契約テスト1件を追加（合計 **1130 テスト合格**）。
- **GPT-5.6 ガイドのナビ・表示改善**: `/model-data/gpt-5-6-best-practices` を Providers の Codex 配下へ移動。メインコンテンツを全幅化し、Mermaid SVGを中央寄せ、Python/Bashコードブロックに依存追加なしのトークンハイライトを追加（合計 **1129 テスト合格**）。
- **OpenAI GPT-5.6 完全ガイドの Next.js 移行**: `Gpt-5.6-best-practices-guide.html` の対応Markdown原本をビルド時に安全なReact要素へ変換し、`/model-data/gpt-5-6-best-practices` に追加。18セクション、7表、8 Mermaid図、コードブロック、目次スクロール追従、外部リンクの安全属性、ページレジストリ登録を実装。TDDのRed / Greenを分割し、契約テスト7件を追加（合計 **1126 テスト合格**）。
- **AIガバナンス実践ガイドの Next.js 移行**: `Ai-governance-guide.html` を `/governance/ai-governance` へ移行。原文の全22セクション・表4件・Mermaid図5件・外部リンク84件をReact要素としてfaithfulに保持し、TOCスクロール追従、外部リンクの安全属性、ページレジストリ登録を追加。HTMLと対応Markdown原本は `archive/` に退避。TDDのRed / Green / Refactorを分割し、契約テスト6件を追加（合計 **1119 テスト合格**）。
- **LLMファインチューニング ベストプラクティスガイドのデザイン刷新**: `/local-llm/finetuning-best-practices` をアンバー×ブルーのダーク技術ドキュメントとして再設計。本文・リンク・12表・5コードブロック・9 Mermaid図・99外部リンクは維持したまま、旧インラインスタイルをページ専用CSSへ集約し、表の左寄せとコード5件の依存追加なしのシンタックスハイライトを追加。契約テストを1件追加（合計 **1113 テスト合格**）。
- **LLMファインチューニング ベストプラクティスガイドの Next.js 移行**: `Finetuning-best-practices-guide.html` を `/local-llm/finetuning-best-practices` へ移行。原文の全17セクション・12表・5コードブロック・9 Mermaid図・99外部リンクを React 要素として faithful に保持し、TOC のスクロール追従、外部リンクの安全属性、ページレジストリ登録を追加。原本は `archive/` に退避。TDD の Red / Green / Refactor を分割し、契約テスト6件を追加（合計 **1112 テスト合格**）。
- **横断導線（RSS / 関連ページリンク / 横断検索）— plans/006 Phase 3（F-3' / F-7 / F-5、[plans/009](../plans/009-phase3-cross-navigation.md)）**: 58 ルートに達し「読者が目的のガイドへナビのドロップダウン経由でしか到達できない」状態を解消 🚀。3 導線すべてを `page-registry.ts` からの導出で追加した（手書きのフィード・関連リンク表・検索インデックスを一切持たない）。ナビは `nav-taxonomy.ts` の `NAV_GROUPS` に「検索」をフラットリンクとして What's New の直前へ挿入し、トップレベル 7 → 8 グループへ。TDD サイクル（Red/Green/Refactor/Docs Sync）でコミット分割。Vitest 契約テスト 42 件追加（合計 **1106 テスト合格**）。
  - **F-3' RSS**: `app/rss.xml/route.ts` を Route Handler + `dynamic = "force-static"` で実装し、`output: 'export'` 下でも `out/rss.xml` として静的生成（addedAt 降順 20 件）。XML 予約 5 文字のエスケープは純粋関数 `escapeXml` に切り出してユニットテスト。`lib/metadata.ts` の `alternates.types` に自動発見リンクを追加。
  - **F-7 関連ページリンク**: `lib/related-pages.ts` が topics の共有数からスコアし、「共有 topics 数 降順 → 同一 group 優先 → addedAt 降順 → slug 昇順」の 4 段タイブレークで順序を一意に決める（決定論的でないと無関係なページ追加で全ページの関連リンクが揺れ SSG 出力が不安定になる）。共有 0 件は除外し、無関係なリンクを出さない。`RelatedPages.tsx` は PageFreshness と同じく `app/layout.tsx` に 1 箇所マウントし、55 個の page.tsx を未編集のまま全ページへ関連 3 件を表示。
  - **F-5 横断検索**: `/search` を新設。**外部ライブラリを追加せず自前実装**（57 ページの title/summary/topics は数十 KB で全件走査の部分一致で十分）。NFKC + 小文字化で正規化し、空白区切りの全トークンが title/summary/topics/group/category のいずれかに一致（AND）。**タグは `/tags/[tag]` の静的ページ群を作らず `/search` に集約**し（1〜2 ページしか持たないタグで薄いページが量産されるため）、`?q=` / `?tag=` の URL クエリで検索状態を共有可能にした。page.tsx は metadata のため Server Component に保ち、`useSearchParams` を使う `SearchClient` を `<Suspense>` 境界に置く（`output: 'export'` の要件）。
- **ナビ再グルーピング（18 → 7 項目）— plans/006 Phase 2（F-4' / STATE-06 対応、[plans/008](../plans/008-nav-regrouping-f4.md)）**: サイトヘッダーのトップレベルが 18 項目に膨張し（うち 4 つは子リンク 1 件のみのドロップダウン）、かつ `nav-links.ts` が 170 行の手書きデータで `page-registry.ts` と二重管理になっていた問題を解消 🚀。**ナビを registry からの導出に変更**し、手書きリンクデータを全廃。トップレベルは 7 グループ（Home / Providers / Agent 開発 / 開発プロセス / 運用・品質 / モデル・データ / What's New）へ集約。新規 `lib/nav-taxonomy.ts` がグループの並び順とネスト対象の SSoT（registry のエントリは slug 昇順のため表示順を表現できない）。`page-registry.ts` に `category`（ナビ 2 段目ラベル）を追加し `group` を Zod enum 化（**`group` の値自体は 1 件も変更なし** — Phase 1 の投入時点で正しかった）。**2 段ネストは Providers（30 リンク）のみ**に適用（全グループを 2 段にすると CI/CD・Git Worktree・RAG のような 1 ページのカテゴリで 3 段ホバーが生まれ、STATE-06 の問題が階層を変えて再発するため）。`SiteHeaderClient` はサブトグル専用ハンドラを追加（既存の `closeAllDropdowns()` を呼ぶと親ドロップダウンごと閉じてしまうため、閉じるのは同一サブメニュー内の兄弟のみ）。**registry ⇔ ナビの全単射を契約テストで固定**し、以後ページ追加時のナビ登録漏れを機械検知。URL は不変（`app/**/page.tsx` と `netlify.toml` は未編集）。TDD サイクル（Red/Green/Refactor/Docs Sync）でコミット分割。Vitest 契約テスト 18 件追加（合計 **1064 テスト合格**）。
- **metadata 欠落 3 ページの SEO 修正**: F-1 のレジストリ初期値採取中に、`/code-review/coderabbit-guide`・`/code-review/sonar-qube`・`/codex/harness-engineering` の 3 ページだけ `export const metadata` を持たず、SEO タイトル・説明が出力されていないことが判明。根因は書き忘れではなく **Client Component 境界の設計差**で、前 2 ページはページ全体が `"use client"` のため Next.js の規約上 page.tsx から metadata を export できない状態だった（他 53 ページは Server Component）。TDD（Red→Green）で対応し、`"use client"` の 2 ページはルート単位の `layout.tsx`（Server Component）から metadata を供給（本体の大規模リファクタは行わない最小差分）、`codex/harness-engineering` は page.tsx へ直接追加。description は `lib/page-registry.ts` の summary と同一文言に統一。Vitest 契約テスト 6 件追加（合計 **1046 テスト合格**）。
- **鮮度基盤（ページレジストリ + What's New）の導入 — plans/006 Phase 1（F-1 / F-2）**: `web-next/lib/page-registry.ts` を新設し、全 57 ルート（Home + 55 ガイド + What's New）のメタデータ（title / group / provider / topics / summary / addedAt / lastReviewed）を Zod 検証付きの SSoT として集約 🚀。初期値は全フィールドを機械採取（title/group は nav-links、summary は各 page.tsx の metadata.description、日付は git log）。TDD サイクル（Red/Green/Refactor）でコミット分割。派生実装として ① `components/site/PageFreshness.tsx` を `app/layout.tsx` に 1 箇所マウントし、55 個の page.tsx を編集せずに全ページへ「最終確認日 / 公開日」バッジを表示（SiteHeader と同じ `usePathname()` パターン。SSG プリレンダで静的 HTML に焼き込まれることをビルド出力で確認済み）、② `app/whats-new/page.tsx` を registry から静的生成（新着 = addedAt 降順 / 最近更新 = lastReviewed 降順、各上位 12 件）、③ `app/sitemap.ts` のハードコード ROUTES（24 件で実ルート 55 と乖離＝stale）を registry 駆動へ置換し欠落 31 ルートを解消、`lastmod` にビルド日時ではなく `lastReviewed` を出力。ナビはトップレベル 17 → 18 項目（末尾に What's New）。Vitest 契約テスト 44 件追加（合計 **1040 テスト合格**）。
- **LLM評価・ベンチマーク & オブザーバビリティ ガイドの Next.js 移行**: ルートの `Llm-evaluation-observability-best-practices.html` を `web-next/app/llm-ops/evaluation-observability/page.tsx` に完全移行 🚀。TDD サイクル（Red/Green/Refactor）に沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、外部リンクのセキュリティ対策（target/rel）、10個の Mermaid 図の中央寄せ、TOCスクロールハイライト追従（Intersection Observer）、およびモバイル開閉トグルを実装。ナビゲーションに新規カテゴリ「LLMOps -> Evaluation & Observability」を追加し、関連統合テストを 15 ドロップダウン対応に更新。元のHTML・MDファイルはアーカイブディレクトリに退避。Vitest 契約テスト 9 件追加（合計 931 テスト合格）。
- **Google Stitch 実践ガイドの Next.js 移行**: ルートの `Google-stitch-guide.html` を `web-next/app/google/stitch-guide/page.tsx` に完全移行 🚀。TDD サイクル（Red/Green/Refactor）に沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、外部リンクのセキュリティ対策（target/rel）、等幅フォント適用、7つの Mermaid 図の中央寄せ、TOCスクロールハイライト追従（Intersection Observer）、およびモバイル開閉トグルを実装。ナビゲーションの「Google -> Stitch Guide」に新規登録。元のHTML・MDファイルはアーカイブディレクトリに退避。Vitest 契約テスト 9 件追加（合計 922 テスト合格）。
- **マルチモーダルAI実践ガイド：画像・音声生成のベストプラクティス 2026の Next.js 移行**: ルートの `Multimodal-image-audio-best-practices-2026.html` を `web-next/app/multimodal/image-audio-best-practices-2026/page.tsx` に完全移行 🚀。TDD サイクル（Red/Green/Refactor）に沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、外部リンクのセキュリティ対策（target/rel）、18個の Mermaid 図の中央寄せ、TOCスクロールハイライト追従（Intersection Observer）、およびモバイル開閉トグルを実装。ナビゲーションの「Multimodal -> Image & Audio (2026)」に新規登録。元のHTML・MDファイルはアーカイブディレクトリに退避。Vitest 契約テスト 6 件追加（合計 911 テスト合格）。
- **マルチモーダルAI(画像・音声生成)ベストプラクティスガイド 2026の Next.js 移行**: ルートの `Multimodal-ai-image-audio-generation-best-practices.html` を `web-next/app/multimodal/generation-best-practices/page.tsx` に完全移行 🚀。TDD サイクル（Red/Green/Refactor）に沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、外部リンクのセキュリティ対策（target/rel）、8つの Mermaid 図の中央寄せ、TOCスクロールハイライト追従（Intersection Observer）、およびモバイル開閉トグルを実装。ナビゲーションに新規カテゴリ「Multimodal -> Generation Best Practices」を追加。元のHTML・MDファイルはアーカイブディレクトリに退避。Vitest 契約テスト 6 件追加（合計 905 テスト合格）。
- **RAG & Embeddings 完全ベストプラクティスガイドの Next.js 移行**: ルートの `Rag-embeddings-best-practices-guide.html` を `web-next/app/rag/embeddings-best-practices/page.tsx` に完全移行 🚀。TDD サイクル（Red/Green/Refactor）に沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、等幅フォント適用、外部リンクのセキュリティ対策（target/rel）、4つの Mermaid 図の中央寄せ、TOCスクロールハイライト追従（Intersection Observer）、およびモバイル開閉トグルを実装。ナビゲーションに新規カテゴリ「RAG -> RAG & Embeddings Best Practices」を追加。元のHTML・MDファイルはアーカイブディレクトリに退避。Vitest 契約テスト 5 件追加（合計 899 テスト合格）。
- **MCP実践ベストプラクティスガイド（中級〜上級者向け）の Next.js 新設移行**: 既存の `/mcp/mcp-best-practices` はそのまま残し、ルートの `Mcp-best-practices.html` を `web-next/app/mcp/mcp-best-practices-intermediate/page.tsx` に新設移行。TDD サイクル（Red/Green/Refactor）に沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、等幅フォント適用、外部リンクのセキュリティ対策（target/rel）、12点の Mermaid 図の中央寄せ、TOCスクロールハイライト追従（Intersection Observer）、およびモバイル開閉トグルを実装。ナビゲーションの「MCP -> MCP Best Practices (中級)」に新規登録。元の HTML ファイルはアーカイブディレクトリに退避。Vitest 契約テスト 9 件追加（合計 892 テスト合格）。
- **MCP実践ガイドの Next.js 移行**: `Mcp-best-practices-guide.html` から `web-next/app/mcp/mcp-best-practices/page.tsx` への完全移行を完了 🚀。TDD サイクルに沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、等幅フォント適用、外部リンクのセキュリティ対策（target/rel）、Mermaid遅延ロードと中央寄せ、TOCスクロールハイライト追従（Intersection Observer）、およびモバイル開閉トグルを実装。ナビゲーションの「MCP -> MCP Best Practices」に新規登録。 Vitest 契約テスト 9 件追加（合計 883 テスト合格）。
- **コンテキストエンジニアリング入門の Next.js 移行**: ルートの `Context-engineering-guide.html` から `web-next/app/agent/context-engineering-best-practices/page.tsx` への完全移行を完了 🚀。TDD サイクルに沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、等幅フォントの適用、外部リンクのセキュリティ対策（target/rel）、Mermaid遅延ロードと中央寄せ、TOCスクロールハイライト追従（Intersection Observer）、およびモバイル開閉トグルを実装。ナビゲーションの「Agent -> Context Engineering」に新規登録。元の HTML ファイルは `legacy/` 配下に移動。Vitest 契約テスト 8 件がすべて合格。
- **AI CI/CD 自動化 完全ガイドの Next.js 移行**: `Ai-cicd-automation-best-practices.html` から `web-next/app/ci-cd/ai-cicd-automation-best-practices/page.tsx` への完全移行を完了 🚀。TDD サイクルに沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、等幅フォント適用、外部リンクのセキュリティ対策、Mermaid遅延ロードと中央寄せ、TOCスクロールハイライト追従（Intersection Observer）、およびモバイル開閉トグルを実装。ナビゲーションに新規カテゴリ「CI/CD -> AI CI/CD Automation」を追加し、関連統合テストを 11 ドロップダウン対応に更新。Vitest 契約テスト 8 件追加（合計 864 テスト合格）。
- **AIセキュリティ ベストプラクティス完全ガイド（中級〜上級者向け）の Next.js 移行**: `Ai-security-best-practices-intermediate.html` から `web-next/app/security/ai-security-best-practices-intermediate/page.tsx` への完全移行を完了 🚀。TDD サイクルに沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、等幅フォント適用、外部リンクのセキュリティ対策（target/rel）、Mermaid遅延ロードと中央寄せ、TOCスクロールハイライト追従（Intersection Observer）、およびモバイル開閉トグルを実装。ナビゲーションの「Security -> AI Security Best Practices (中級)」に新規登録。 Vitest 契約テスト 8 件追加（合計 856 テスト合格）。
- **Google Agent Development Kit 実践ガイドの Next.js 移行**: `Adk-best-practices-guide.html` から `web-next/app/google/adk-best-practices/page.tsx` への完全移行を完了 🚀。TDD サイクルに沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、等幅フォント適用、外部リンクのセキュリティ対策（target/rel）、Mermaid遅延ロードと中央寄せ、TOCスクロールハイライト追従（Intersection Observer）、およびモバイル開閉トグルを実装。ナビゲーションの「Google -> ADK Best Practices」に新規登録。 Vitest 契約テスト 9 件追加（合計 848 テスト合格）。
- **ローカルLLM／セルフホスティング ベストプラクティスガイドの Next.js 移行**: `Local-llm-self-hosting-best-practices.html` から `web-next/app/local-llm/best-practices/page.tsx` への完全移行を完了 🚀。TDD サイクルに沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、外部リンクのセキュリティ対策（target/rel）、Mermaid遅延ロード、TOCスクロールハイライト追従（Intersection Observer）を実装。ナビゲーションの「Local LLM -> Self-hosting Best Practices」に新規登録。 Vitest 契約テスト 9 件追加（合計 839 テスト合格）。
- **ローカルLLM/セルフホスティング 完全ガイドの Next.js 移行**: `Local-llm-self-hosting-guide.html` から `web-next/app/local-llm/self-hosting/page.tsx` への完全移行を完了 🚀。TDD サイクルに沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、外部リンクのセキュリティ対策、Mermaid遅延ロード、TOCスクロールハイライト追従（Intersection Observer）を実装。ナビゲーションの「Local LLM -> Self-hosting Guide」に新規登録。 Vitest 契約テスト 8 件追加（合計 830 テスト合格）。
- **Google NotebookLM 完全ベストプラクティスガイドの Next.js 移行**: `Google-NotebookLM.html` から `web-next/app/google/notebook-lm/page.tsx` への完全移行を完了 🚀。TDD サイクルに沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、外部リンクのセキュリティ対策、Mermaid遅延ロード、TOCスクロールハイライト追従（Intersection Observer）を実装。ナビゲーションの「Google -> NotebookLM Guide」に新規登録。 Vitest 契約テスト 9 件追加（合計 820 テスト合格）。
- **AIセキュリティ ベストプラクティスガイドの Next.js 移行**: `Ai-security-best-practices.html` から `web-next/app/security/ai-security-best-practices/page.tsx` への完全移行を完了 🚀。TDD サイクルに沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、外部リンクのセキュリティ対策、Mermaid遅延ロード、TOCスクロールハイライト追従（Intersection Observer）を実装。ナビゲーションの「Security -> AI Security Best Practices」に新規登録。 Vitest 契約テスト 8 件追加（合計 811 テスト合格）。
- **Agent Skills 完全ガイドのNext.js 移行**: `Agent-skills-guide.html` から `web-next/app/agent/skills/page.tsx` への完全移行を完了 🚀。TDD サイクルに沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化とメインコンテンツの画面幅100%化、外部リンクのセキュリティ対策、Mermaid遅延ロード、TOCスクロールハイライト追従（Intersection Observer）を実装。ナビゲーションの「Agent -> Agent Skills Guide」に新規登録。 Vitest 契約テスト 7 件追加（合計 801 テスト合格）。
- **skills.sh 完全ガイドの Next.js 移行**: `Skills-sh-guide.html` から `web-next/app/claude/skills-sh/page.tsx` への完全移行を完了 🚀。TDD サイクルに沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化とメインコンテンツの画面幅100%化、外部リンクのセキュリティ対策、Mermaid遅延ロード、TOCスクロールハイライト追従（Intersection Observer）、進捗バーおよびモバイル開閉ロジックの TocObserver 移行を実装。ナビゲーションの「Agent -> skills.sh Guide」に新規登録。 Vitest 契約テスト 7 件追加（合計 794 テスト合格）。
- **Claude Fable 5 実践活用ガイドの Next.js 移行**: `Claude-fable-5-best-practices.html` から `web-next/app/claude/fable-5-best-practices/page.tsx` への完全移行を完了 🚀。カテゴリ毎に TDD サイクルに沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、外部リンクのセキュリティ対策、Mermaid遅延ロード、TOCスクロールハイライト追従（Intersection Observer）を実装。ナビゲーションの「Claude -> Fable 5 Best Practices」に新規登録。 Vitest 契約テスト 9 件追加（合計 787 テスト合格）。
- **Cursor 実践ガイド（中〜上級者向け）の Next.js 移行**: `Cursor-complete-guide-intermediate.html` から `web-next/app/cursor/complete-guide-intermediate/page.tsx` への完全移行を完了 🚀。カテゴリ毎に TDD サイクルに沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、外部リンクのセキュリティ対策、Mermaid遅延ロード、TOCスクロールハイライト追従（Intersection Observer）を実装。ナビゲーションの「IDE -> Cursor Guide (中級)」に新規登録。 Vitest 契約テスト 2 件追加（合計 778 テスト合格）。
- **Loop Engineering 完全ガイドの Next.js 移行**: `Loop-engineering-guide.html` から `web-next/app/agent/loop-engineering/page.tsx` への完全移行を完了 🚀。カテゴリ毎に TDD サイクルに沿ってステップバイステップでコミット。CSS Modules によるレイアウトスコープ化、外部リンクのセキュリティ対策、モノスペースコードブロック、警告バナー、Mermaid遅延ロード、TOCスクロールハイライト追従（Intersection Observer）を実装。ナビゲーションの「Agent -> Loop Engineering Guide」に新規登録。 Vitest 契約テスト 19 件追加（合計 778 テスト合格）。
- **Cursor 完全ガイド コードブロック・フッターCSS修正**: コードブロック (`.codeBody`・`.codeLine`・`.codeBar`) に `font-family: var(--font-mono)` を追加し、レガシーHTMLと同様の JetBrains Mono 等のモノスペースフォントで表示されるよう修正。フッター (`.pageFooter`) も `font-family: var(--font-mono)` と `font-size: 12.5px` に統一。Intersection Observer によるTOCスクロール追従、モバイル幅でのサイドバー強制非表示、コードハイライト Atom One Dark 配色の修正も含む。全744件テスト合格。
- **Cursor 完全ガイドの Next.js 移行**: `Cursor-complete-guide.html` から `web-next/app/cursor/complete-guide/page.tsx` への完全移行を完了 🚀。CSS Modules によるレイアウトスコープ化、外部リンクのセキュリティ対策、コピー機能付きコードブロック、Mermaid遅延ロードを実装。ナビゲーションに新規カテゴリ「IDE -> Cursor Guide」を追加。さらに、共通ヘッダーによるサイドバー重なり（top/heightオフセット）を修正し、目次テキストを元のHTMLに完全一致するよう補正。フッターをメインコンテンツ内に戻して元の背景色・上境界線を復元。全コードブロックのインデント（スペース数）を忠実に復元修正。全744件のテストがパス。
- **Vercel Sandbox 完全入門ガイドの Next.js 移行**: `Vercel-sandbox-guide.html` から `web-next/app/vercel/sandbox/page.tsx` への完全移行を完了 🚀。CSS Modules によるレイアウト調整、Mermaid遅延ロード、安全な外部リンク対応、コードコピーボタンを実装。ナビゲーションに「Vercel` -> `Vercel Sandbox`」を新規登録し、テスト期待値の修正や新規の契約テストを含めた 743 件のフロントエンドテストが全合格。
- **ビルド実行禁止ルールの明文化**: Antigravity環境におけるメモリ制限（OOM）クラッシュやネットワーク遮断エラーを防止するため、`CLAUDE.md` および `GEMINI.md` に Antigravity サンドボックス環境下でのみビルドコマンド実行を禁止するルールを追加整備。
- **InteractiveChecklist 状態同期バグの修正**: `items` プロップの動的変更時に `checkedStates` が追従せず表示と不整合を起こす問題を `useEffect` による再初期化で解決。テストケースを新規追加。
- **Vercel Sandbox 実践・上級者ガイド**: Vercel Sandbox のアーキテクチャ、SDK API リファレンス、認証、ネットワークポリシー、セキュリティ等を詳細に解説した上級者向けガイド (`Vercel-sandbox-advanced-guide.md`) を追加。
- **InteractiveChecklist コンポーネントの導入**: `claude/self-hosted-sandboxes` ページに、クライアントサイドで状態を保持し、Enter/Spaceキーやクリックで切り替え可能な `InteractiveChecklist` を導入。アクセシビリティ（aria-checked/role="checkbox"）にも配慮。
- **Vercel Sandbox 完全入門ガイド**: Vercel Sandbox (MicroVM) のアーキテクチャ、セットアップ、SDK利用法、ベストプラクティスを網羅した詳細ガイド (`Vercel-sandbox-guide.md`) を追加。HTML版 (`Vercel-sandbox-guide.html`) も作成。
- **Claude Self-hosted Sandboxes ガイドの強化**: インタラクティブチェックリストの導入と、誤字の修正を実施。合計 742 テスト合格（2件追加）。
- **Google 関連コンポーネントテストの堅牢性向上**: `StepsApp` のテストにおいて、`fakeTimers` のクリーンアップを確実にするため `try-finally` ブロックを導入。インポート順の整理。合計 738 テスト合格（維持）。
- **CIエラー修正およびGoogle関連コンポーネントテスト追加**: Biomeフォーマットエラーを修正し、テストカバレッジが不足していた8つの新規Googleコンポーネントに対する Vitest テストを追加。合計738テスト合格。
- **Claude Self-hosted Sandboxes 完全ガイド**: Next.js App Router への移行完了 🚀（7件の契約テストを追加し、合計710テスト合格）。Claude Managed Agents のセルフホスト型サンドボックス環境におけるアーキテクチャ、Docker 連携、セキュリティ制御、MCP 統合などのベストプラクティスを解説する詳細ガイド。
- **Hermes Agent 中級・上級者向け完全ガイド**: Next.js App Router への移行完了 🚀（8件の契約テストを追加し、合計693テスト合格）。アーキテクチャの深掘り、7層の多層防御セキュリティモデル、DMペアリング、Docker サンドボックス、サブエージェント委譲、Cron ジョブチェーニング等、本番運用を見据えた高度な活用法を解説する詳細ガイド。
- **Hermes Agent 完全ガイド**: Nous Research が開発した自己改善型 AI エージェント「Hermes Agent」のアーキテクチャ、セットアップ、メモリ、スキル、自動化（Cron）等を解説する総合ガイドをルートに配置。
- **Code Review Tool Pricing（1/3/12ヶ月プラン別料金表）**: 既存の `/code-review/tool-pricing` ページに**プラン別・USD+円の料金表**を追加 🚀。`ToolEntry.price: string` を `plans: readonly PricingPlan[]` に置き換え、`planAmounts`（1/3/12ヶ月計算・純粋関数）と `representativePrice`（マトリクス用最安値ラベル）を `constants.ts` に追加。pricing.json の `jpy_rate` / `generated_at` を `parsePricingData` で取得し、`fmtUSD` / `fmtJPY` で USD+円を二段表示。年額割引あるプランには「年額割引」バッジを表示。Hero と免責セクションに更新時レートと基準日を明記。テスト 7 件追加（plan-header / plan-row / ¥記号 各ページテスト + planAmounts 純粋関数テスト4件、計684テスト合格）。Gemini Code Assist / Google Jules AI Ultra は公式ページで WebSearch 確認済み（Standard $19〜22.80、Enterprise $45〜54、Jules Ultra $200/月）。確定不能プラン（AWS CodeGuru・SonarQube Developer）は `priceNote` で「従量課金」「LOC依存（年額）」と非推測値で明記。
- **Code Review Tool Pricing（料金比較ページ）**: `/code-review/tool-pricing` を新規追加 🚀。Code Review 系 AI ツール 9 種（GitHub Copilot / Codex / Claude / CodeRabbit / Gemini Code Assist / Jules / AWS CodeGuru / SonarQube ×2）の料金目安・主用途・メリット/デメリットを比較マトリクス＋カテゴリ別カードで横断表示。各価格に**公式 pricing ページの出典リンク**と確認年月を併記し、可変データは `app/code-review/tool-pricing/constants.ts` に SSoT として集約（**月次価格レビュー対象**）。Code Review ナビ先頭に「Tool Pricing」を追加。契約テスト 7 件追加（合計 677 テスト合格）。本ページの lint はクリーン（既存 `sonar-qube` / `antigravity-slash-commands-guide` の既知 lint 指摘は本作業の対象外）。
- **Antigravity スラッシュコマンド完全ガイド (CSS修正)**: Next.js CSS Modules の `:global()` ラッパーを用いて、約400行のスタイルを安全にスコープ化し適用完了。
- **Antigravity スラッシュコマンド完全ガイド**: Next.js App Router への移行完了 🚀（5件の契約テストを追加し、合計670テスト合格）。
- **Antigravity スラッシュコマンド完全ガイド (HTML版)**: Gemini CLI から Antigravity CLI への移行に伴う、スラッシュコマンド、カスタムコマンド（TOML）、Plan Mode 等の解説ガイドをルートに配置。
- **SonarQube Cloud 解析の導入（品質 CI/CD）**: public 無料プランをモノレポ単一プロジェクトで導入。両言語にカバレッジ計測を追加（web-next: `@vitest/coverage-v8`→`lcov.info` / scraper: `pytest-cov`→`coverage.xml`、いずれも dev 依存）。`sonar-project.properties` / `.github/workflows/sonarqube.yml`（`push:main,dev`+PR）/ `make sonar`（Docker scanner CLI）を追加。**モノレポのレポートパス補正**（lcov `SF:`→`web-next/`、coverage.xml `<source>`→`scraper/src/scraper`）でカバレッジ 0% を回避。既定 `uv run pytest` の出力は不変。**初回手動作業**: Cloud import→Automatic Analysis OFF、org/projectKey 反映、GitHub Secrets に `SONAR_TOKEN` 登録。
- **SonarQube Code Review 実践ガイド**: Next.js App Router への移行完了 🚀（5件の契約テストを追加し、合計665テスト合格）。
- **GitHub Copilot Code Review 完全活用ガイド**: Next.js App Router への移行完了 🚀（5件の契約テストを追加し、合計660テスト合格）。
- **CodeRabbit 完全活用ガイド**: Next.js App Router への移行完了 🚀（5件の契約テストを追加し、合計655テスト合格）。
- **Claude Code スラッシュコマンド完全ガイド**: Next.js App Router への移行完了 🚀（5件の契約テストを追加し、合計650テスト合格）。
- **CodeCopyButton コンポーネント**: `web-next/components/docs/` に追加。`managed-agents` ページ等で利用開始。

## テストカバレッジの進捗状況

総合的なテストカバレッジの詳細は [`docs/TEST_COVERAGE_PROGRESS.md`](TEST_COVERAGE_PROGRESS.md) および [`docs/coverage-dashboard.html`](coverage-dashboard.html) を参照のこと。

### テスト分野別のカバレッジ概要 (2026-06-01 時点)
- **Unit**:
  - `app/` (全 23 ガイドページルート): ✅ 100% 契約テスト（タイトル、セクション数、rel、metadata）
  - `components/` (電卓 UI 9/9 コンポーネント): ✅ 100%
  - `site/` (共通ヘッダー/バナー): ✅ 100%
  - `lib/` (ユーティリティ): ほぼ網羅 (metadata, fonts を除く)
  - `types/`, `providers/`, `tools/`, `core/`: ⚠️ 一部モックテストのみ (ランタイム検証や詳細ロジック未整備)
- **Integration**:
  - `components/` (データフロー連携): ✅ 実装済み (`HomePage.integration.test.tsx`)
  - その他 (`app/`, `site/`, `scraper/` 関連): ❌ 未実装 (missing)
- **E2E / Visual**: ❌ 未実装
- **Accessibility (a11y)**: ⚠️ 部分的 (`LanguageToggle` や `ApiTable` 等の aria 属性確認のみ。axe-core 自動テスト未導入)
- **Performance**: ❌ 未実装 (Lighthouse CI 未整備)
- **API / Contract**:
  - `lib/` (Zod スキーマ): ✅ 実装済み
  - `types/` (TypeScript-Pydantic パリティ): ✅ コンパイル時アサートで同期検証
  - スクレイパー関連: ❌ 未実装
- **Security**:
  - `lib/` / `components/`: ⚠️ `tRich` の HTML 文字列 XSS 耐性テストあり。その他監査ゲート未整備

---

## 開発・品質チェックルール (AI/人間共通)

`CLAUDE.md` の開発ルールを補完する、現在の保守フェーズで厳守すべきルールです。

### R1. Biome フォーマット・lint の適用スコープ
- **禁止**: リポジトリ全体を対象とする自動修正 (`bun run lint:fix` / `biome check . --write` など引数なしの実行)
- **理由**: 作業範囲外のファイルを意図せずフォーマットまたは修正し、差分を汚してしまうのを防ぐため。
- **手順**: 変更したファイルのみを明示的にパス指定して実行すること (例: `bunx biome check --write web-next/app/some-page/page.tsx`)

### R2. 型定義の同期 (SSoT)
- **原則**: スクレイパーの `scraper/src/scraper/models.py` (Pydantic) が Single Source of Truth (SSoT)。
- **手順**: スキーマを変更する際は、必ず `web-next/types/pricing.ts` (TypeScript) を手動で更新し、`web-next/lib/pricing.ts` 内の `_AssertParity` が通ることを確認する。

---

## 保守・開発用 検証コマンド早見表

```bash
# フロントエンドテスト (Vitest)
cd web-next && bun run test

# TypeScript 型チェック
cd web-next && bun run typecheck

# 静的ビルド検証
cd web-next && bun run build

# Biome リント確認
cd web-next && bun run lint

# スクレイパーテスト (pytest)
cd scraper && uv run pytest
```

---

## 移行完了後の継続的課題とネクストアクション

移行（Phase 1–14, Phase A–F）が完了したため、今後は以下の継続的課題と改善に注力する。

### 1. 月次データアップデート（定常運用）
毎月、各プロバイダー（Anthropic, Google, OpenAI など）の最新価格を反映させる。
為替レート更新および `pricing.json` の型定義と `lib/pricing.ts` の `_AssertParity` の一致を確認する。
加えて、**`/code-review/tool-pricing` の料金**（`app/code-review/tool-pricing/constants.ts`）も毎月見直す。
各エントリの `sourceUrl`（公式 pricing ページ）を辿って `price` / `priceCheckedAt` を更新し、ページ全体の `PRICE_CHECKED_AT` を当月へ更新する。

### 2. テストカバレッジの拡充
[`docs/TEST_COVERAGE_PROGRESS.md`](TEST_COVERAGE_PROGRESS.md) で `missing` または `partial` となっている領域のテストを順次追加する。
特に **E2Eテストの導入**、**アクセシビリティ自動検証テストの追加**、**セキュリティ監査ゲートの整備** に注力する。

### 3. 表示パフォーマンスおよび Core Web Vitals の監視
Netlify 上での SSG (Static Site Generation) 出力物の Lighthouse 計測を行い、LCP (Largest Contentful Paint) や INP (Interaction to Next Paint) が高スコアを維持しているか監視する。

---

## 次回セッションでの再開・実行依頼プロンプト

以下は、任意の Coding Agent（Jules, Claude Code, Gemini CLI, Cline など）に特定の作業を依頼する際の指示プロンプトテンプレートです。

### 1. 月次データアップデート実行依頼

```text
Next.js 移行完了後のリポジトリ `LLM-Studies` にて、最新のAIモデル価格と為替レートへのアップデート作業（月次データアップデート）を実行してください。

- ドキュメント: docs/MONTHLY_UPDATE_PROMPTS.md に定義された手順に従ってください。
- 現在のステータス: docs/PROGRESS.md を参照。

作業ステップ：
1. 為替レートとモデル価格データのスクレイピングおよび更新処理の実行。
2. scraper/src/scraper/models.py (SSoT) の変更がある場合、web-next/types/pricing.ts に型を同期。
3. web-next/lib/pricing.ts の _AssertParity によるコンパイル時整合性チェックが通ることを確認。
4. フロントエンドおよびスクレイパーの全テスト（Vitest / pytest）を実行し、問題ないことを検証。
```

### 2. テスト拡充（E2E / a11y / セキュリティ）実行依頼

```text
Next.js 移行完了後のリポジトリ `LLM-Studies` にて、テストカバレッジ拡充計画に基づき、テストの追加・強化を行ってください。

- ドキュメント: docs/TEST_COVERAGE_PROGRESS.md および docs/TESTING.md を参照。
- 現在のステータス: docs/PROGRESS.md を参照。

作業ステップ：
1. テストが不足しているセル（例: アクセシビリティの axe-core 自動テストの導入、Playwright による E2E テストの骨格作成、または security の audit 関連など）を特定。
2. 計画的にテストコードを追加し、既存テストにデグレード（不合格）が発生していないことを確認。
3. docs/TEST_COVERAGE_PROGRESS.md のカバレッジ進捗を更新し、/update-coverage-dashboard スキル等を用いて docs/coverage-dashboard.html と同期する。
```

### 3. 一般的な保守・改善作業の再開

```text
Next.js 移行完了後のリポジトリ `LLM-Studies` の保守・改善作業を再開してください。

- リポジトリ: LLM-Studies (Next.js 移行プロジェクトは dev/main へ完全マージ済み)
  - 現在のステータス: docs/PROGRESS.md を参照。テストは Vitest (1203/1203 passed) / pytest (43/43 passed) で全 Green
- リポジトリ規約: CLAUDE.md (編集上の絶対ルール。※Antigravity環境ではビルドは実行禁止)

作業方針：
1. ドキュメントや設定ファイルの更新、パフォーマンスとアクセシビリティの継続的な改善・監視。
2. 検証コマンド（※Antigravity環境ではビルドは実行禁止）:
  (cd web-next && bun run test)
  (cd web-next && bun run typecheck)
  (cd web-next && bun run build)
  (cd web-next && bun run lint)
  (cd scraper && uv run pytest)
```
