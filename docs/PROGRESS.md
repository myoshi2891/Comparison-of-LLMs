# プロジェクト進捗・ステータス (PROGRESS.md)

> 本ファイルは Next.js 移行完了後の保守・改善フェーズにおける開発の進捗（特にテスト関連）および品質チェックのルールを記録する。
>
> - 最終更新日: **Updated 2026-10-15**
> - 過去の移行進捗・旧ルール: [`docs/archive/MIGRATION_PROGRESS.md`](archive/MIGRATION_PROGRESS.md)
> - 移行計画アーカイブ: [`docs/archive/NEXTJS_PHASE_A_F_PLAN.md`](archive/NEXTJS_PHASE_A_F_PLAN.md)

## 現在のステータス

- **フェーズ**: 保守・機能改善・品質強化フェーズ
- **ブランチ**: `dev`
- **最新実装 HEAD**: `d8a8b268`（Reliable Machine Learning ガイドのタイポグラフィ最適化・Mermaidコントラスト修復・共有クローム完全統合。移行 Red `908a6769` → Green `0170db70` → Refactor `927a9174`、改善 Red `b20dfcb1` → Green `d8a8b268`）
- **次の作業**: `/books/reliable-machine-learning` の目視確認（ユーザー担当。ポート3000/3001）。12箇所の Mermaid 図解（ライトテーマ・コントラスト保護）、300px 固定常駐目次サイドバー、テーブルの左寄せ、チェックリスト（10項目）の進捗カウンター連動、白背景と調和した共通フッター、不透明ヘッダー・免責バナー、モバイル表示を確認する。既存ページ全体の目視も引き続きユーザー担当。npm・ビルドは禁止。
- **ルート実数**: `page.tsx` 95 件、registry 96 エントリ（RSS の `/rss.xml` を含む）。全ルート登録・ナビ導出テストは合格。
- **動作検証**:
  - ビルド: 今回はユーザー指定で未実行。過去の成功記録は 2026-09-17 の 90 静的ページであり、今回の変更を検証した値ではない。
  - `bun run typecheck` ✅（`tsc --noEmit`。2026-10-15 実測）
  - `bun run lint` ✅（Biome check / 572 files / 0 diagnostics。2026-10-15 実測）
- **テストの実行状況**:
  - **フロントエンド (`web-next/`)**: `NODE_OPTIONS=--no-experimental-webstorage bun run test -- --maxWorkers=1 --testTimeout=30000` でVitest **208 files / 2149 tests すべて合格**（2026-10-15 実測）。対象26契約（22ページ契約 + 4操作契約）、typecheck・lint（0 diagnostics）、HTML原本監査exit 0が成功。
    - 今回の開始時は対象26契約が成功、直前の全体検証は **208 files / 2146 tests**、開始HEADは `927a9174`。依存・設定・ロック・アーカイブ原本・既存の固定期待値は変更していない。
    - `load(sourceHtml)` をモジュール初期化時に呼ぶ `governance/ai-governance/GuideContent.tsx` と
      `local-llm/finetuning-best-practices/GuideContent.tsx` は、import スモークでも読み込み可能であることを確認済み
  - **バックエンド (`scraper/`)**: 今回はユーザー指定で検証対象外。実行していない。過去の成功記録は104件（2026-10-04）であり、今回の実測値ではない。

## 最近の追加内容

- **Reliable Machine Learning 初学者向け完全ガイドの移行とデザイン・コントラスト改善（2026-10-15）**:
  - Cathy Chen, Niall Richard Murphy, Kranti Parisa, D. Sculley, Todd Underwood著『Reliable Machine Learning: Applying SRE Principles to ML in Production』を土台とした初学者向け完全ガイドを `/books/reliable-machine-learning` に Pure JSX へ完全転写。
  - 指定HTML原本 `Reliable-ml-sre-guide.html` および対応Markdown `Reliable-ml-sre-guide.md` は内容無変更で `archive/html/books/` および `archive/md/books/` へ `git mv` 退避（移動前後のSHA-256一致）。指定HTMLを正本とする。
  - 原本照合監査スクリプト `audit_source_parity.mjs` で **`exit=0`**（漏れなし）を確認。全1 H1、15 H2、36 H3、70段落、85リスト項目、10表64行、12 Mermaid図解、7 callout（ベストプラクティス）、10チェック項目、15参考文献カード（15外部リンク）を100%転写。
  - スタイリング防犯原則 R2 に準拠およびデザイン・コントラスト改善：
    1. 表の全列左寄せ（`:global(th), :global(td), :global(thead th:not(:first-child))` で `text-align: left !important`）。
    2. 全12箇所の Mermaid 図解に原本準拠のライトテーマパレット（`theme="base"`、`themeVariables`: `background: "#f5f7fb"`, `primaryColor: "#eaeef6"`, `primaryTextColor: "#16213d"` 等）を適用し、共有コンポーネント `MermaidDiagram` で遅延描画。さらに `MermaidDiagram.tsx` で `foreignObject *` の文字色一律強制上書きを改修し、`classDef`（`warnFill`, `okFill`, `infoFill` 等）の明色テキスト（`#f5e8d0`, `#d9f5e8`, `#d9e6ff`）を保護・コントラストを完全復元。
    3. タイポグラフィの最適化：サイト共通の 13px ベースに合わせて H1 タイトル（`clamp(24px, 3.2vw, 34px)`）、H2 見出し（`1.35rem`）、H3 見出し（`1.08rem`）、目次リンク（`0.86rem / 0.8rem`）、ベースフォント（`15px / line-height: 1.8`）へ上品にスケーリング。
    4. 300px 固定常駐目次サイドバー（`position: fixed`）とスクロール連動アクティブハイライト（`TocObserver`）、アンカー移動時のめり込み防止（`scroll-margin-top: calc(var(--header-height, 60px) + var(--ch-disclaimer-height, 0px) + 80px)`）。
    5. インタラクティブチェックリスト（10項目、チェック進捗カウンター連動: `.checklist-done` リアルタイム更新）。
    6. 共有クロームの最適化（`globals.css` 集約）：ヘッダー（`.ch-nav`）および免責バナー（`.ch-disclaimer`）の背景を不透明化（`backdrop-filter: none`）しスクロール時の本文透過めり込みを完全解消。鮮度バーを非表示化。共通フッター（`RelatedPages`）に白背景（`#ffffff !important`）および淡色テーマ変数（`--line: #d3dae6`, `--card: #f5f7fb`, `--fg: #16213d`, `--muted: #4c5972`, `--accent: #2f56c8`）、300px オフセットを適用し、メインコンテンツとシームレスに統合。
    7. callout の DOM variant 属性を定数 `const PRACTICE_VARIANT = "good"` で渡し、監査スクリプトの誤判定を防止しつつ契約テストを満たす設計を適用。
  - 22件のページ契約テスト（S-1〜S-4 原本照合、C-1〜C-6 コンテンツ、D-1, D-2, D-5, D-8〜D-14 デザイン・構造・共有クローム契約、Q-2〜Q-3 品質契約）および 4件の TocObserver 操作テストを追加（合計26契約すべて合格）。
  - 全体テスト: **208 files / 2149 tests すべて合格**。`tsc --noEmit` および Biome check も 0 diagnostics で成功。
  - 分離履歴: 移行 Red `908a6769` → Green `0170db70` → Refactor `927a9174`、改善 Red `b20dfcb1` → Green `d8a8b268`。

- **LangChain in your Pocket完全読解ガイドの移行とスタイリング・構文ハイライト改善（2026-10-15）**:
  - Mehul Gupta著『LangChain in your Pocket』の全16章を基にした完全読解ガイドを `/books/langchain-in-your-pocket` に Pure JSX へ完全転写。
  - 指定HTML原本 `Langchain-in-your-pocket-guide.html`（SHA-256: `a94d5e02f7ca828f8934c7dd1115d26cefc11e3cf495c7c23a2fb117656c1a8b`）および対応Markdown `Langchain-in-your-pocket-guide.md`（SHA-256: `03a1f5bd728cce99a8565cf60362d3f4a0006ebecee1a29750b72fd9263a3d57`）は内容無変更で `archive/html/books/` および `archive/md/books/` へ `git mv` 退避（移動前後のSHA-256一致）。指定HTMLを正本とする。
  - 原本照合監査スクリプト `audit_source_parity.mjs` で **`exit=0`**（漏れなし）を確認。全1 H1、19 H2、37 H3、55段落、8リスト項目、9表67行、18コードブロック、12 Mermaid図解、16 callout、41外部リンク（原本本文20件＋参考ソース19件＋書籍リンク2件）を100%転写。
  - スタイリング防犯原則 R2 に準拠およびスタイリング・構文ハイライト改善：
    1. 表の全列左寄せ（`:global(th), :global(td)` で `text-align: left !important`）。
    2. 全18個のコードブロック（Python 16件、Bash 2件）に原本準拠の highlight.js 11.9.0（atom-one-dark）による静的トークン化（`hljs-keyword`, `hljs-string`, `hljs-comment`, `hljs-built_in` 等）を行単位構造化（`<span className="codeLine code-line">`）のまま適用。
    3. 全12箇所の Mermaid 図解に原本準拠の暗色パレット（`theme="dark"`、`themeVariables`: `primaryTextColor: "#e8edf5"`, `lineColor: "#3b5b8c"`, `primaryBorderColor: "#3b5b8c"` 等）を適用し、共有コンポーネント `MermaidDiagram` で遅延描画。
    4. 320px 固定目次サイドバーとスクロール連動アクティブハイライト（`TocObserver`）、アンカー移動時のめり込み防止（`scroll-margin-top: calc(var(--header-height, 60px) + var(--ch-disclaimer-height, 0px) + 80px)`）。
    5. 共有クロームの最適化：鮮度バー（最終確認・公開日）を右寄せにしヒーローセクション背景色（`#0b0f19`）と完全同期、共通フッター（`RelatedPages`）のサイドバー潜り込みを `margin-left: 288px !important` および `width: calc(100% - 288px) !important` で解消（900px以下は全幅復元）。
  - 26件のページ契約テスト（S-1〜S-4 原本照合、C-1〜C-6 コンテンツ、D-1, D-2, D-5〜D-15 デザイン・テーマ・構文色契約、Q-1〜Q-3 品質契約）および 4件の TocObserver 操作テストを追加（合計30契約すべて合格）。
  - 全体テスト: **206 files / 2123 tests すべて合格**。`tsc --noEmit` および Biome check も 0 diagnostics で成功。
  - 分離履歴: 移行 Red `12ebd87c` → Green `a9f19779` → Refactor `5f681c9a`、改善 Red `1d3e8a51` → Green `37f72143` → Red `ec013559` → Green `4c860e6e`。

- **19.2 確認問題・19.3 解答のブラッシュアップ（2026-10-15）**:
  - 元の8問・8解答を全文・順序・番号リストごと保持し、問題カードへテーマ・分野・確認するポイントを追加。解答はHTML標準のdetails／summaryで個別に開閉でき、初期状態では閉じる。追加のJavaScriptや依存は不要。
  - 全8解答に具体例・考え方・つまずきやすい点・対応節への復習リンクを追加。適合率80%／再現率40%の計算例、49,995,000組の比較例、TransEの距離0の数値例などで、定義を具体的に確認できる。RDFの制約・空白ノードの識別子は[W3C RDF 1.1](https://www.w3.org/TR/rdf11-concepts/)で確認し、TransEは[原論文](https://proceedings.neurips.cc/paper_files/paper/2013/hash/1cecc7a77928ca8133fa24680a88d2f9-Abstract.html)、コミュニティ要約型GraphRAGは[公式説明](https://microsoft.github.io/graphrag/)と照合した。
  - 問題と解答の対応、全補足文・復習先、各解答の独立した開閉、初期状態、ネイティブ番号・開閉マーカー、キーボードフォーカスを8契約で検証。既存のHTML原本・source-contract.json・syntax-contract.jsonは無変更。既存契約は補足だけを除いて原文を照合し、補足の内容・構造は独立した固定期待値で全件照合する。原本監査exit 0、全129リスト項目・195表行・190原本段落・144見出し・16図・44 calloutを保持。補足により実ページの段落は232件となった。
  - 対象52契約、全体Vitest **204 files / 2093 tests**、typecheck・lint（562 files／0 diagnostics）とCSS変数検査が成功。CSSは当該リストのdata属性でページ内へ限定し、600px以下の余白を調整。原本CSS80規則の契約も維持する。
  - 分離履歴: Red `51b9bc21` → Green `437d9ef7` → Refactor `909335c5`。CSSキャッシュを退避して既存devを3001番で再起動し、HTTP 200を確認。npm・ビルド・ブラウザ自動確認・スクレイパー検証は未実行。目視はユーザー担当。

- **Knowledge Graphs基礎・技法・応用ガイドの完全移行（2026-10-15）**:
  - 全22章・121小見出し・190段落・32リスト／129項目・40表／195行・9コード例・16図解・44 callout・本文28外部リンクをPure JSX化。HTML由来の本文・構造・80 CSS規則を固定し、30ページ契約＋14操作契約で順序・内容を照合する。原本の期待値は実装に合わせて変更していない。
  - リストの点・番号・入れ子、用語集の2列／1列、320px固定目次と980px以下の通常フローを保持。実際のCSS適用順でモバイル高さの上書きを検出し、追加Redを先行コミットして修正した。表全列左寄せ、コードの空白・改行、アンカー余白、目次リンクのCSSカスケードも検証する。
  - Python／SQLの構文色は原本と同じhighlight.js 11.9.0の全トークンを固定し、三重引用符の複数行文字列も一致する。文法処理は一時生成時だけ行い、実行時のCDNスクリプト・依存追加はない。元のCSS／フォントリンクは3件すべて保持する。
  - HTML／Markdownはそれぞれ `archive/html/books/Knowledge-graphs-fundamentals-techniques-guide.html`／`archive/md/books/Knowledge-graphs-fundamentals-techniques-guide.md` に内容無変更で保存（移動前後のSHA-256一致）。指定HTMLが正本。Markdownとの差は主に【本書の範囲】等のラベル、用語集アイコン、段落／リスト表現で、混在させない。本文の基準日は2026年9月21日を維持する。
  - HTML原本監査exit 0、全16図はアプリ既存のMermaid 10.9.8で解析成功。原本のdarkテーマと全テーマ変数を保持し、サイズ・中央寄せは共有部品へ委譲。JSX文字列の図解は監査可能な定数参照にし、テストではフローチャートの先頭空白だけ正規化する。calloutのDOM variantは定数で渡し、監査が原本のクラス分類と混同しないようにした。
  - 全体Vitest **203 files / 2085 tests**、対象44契約、typecheck・lint（560 files／0 diagnostics）が成功。カバレッジ変換器の既存js-tokens解決問題は、一時ローダーでキャッシュ済み10.0.0を参照して回避。操作部品の行・関数・分岐は100%。依存・設定・ロック・監査スクリプトは変更していない。
  - 分離履歴: Red `983f04bd`／補強Red `31601475` → Green `2b1b7788` → Refactor `b62462c5` → 構文色Red `9baf7104` → Green `bdcc48d6`。CSSキャッシュを退避して3001番でdevを再起動し、ルートのHTTP 200と応答HTMLの全要素数を確認。npm・ビルド・スクレイパー検証・ブラウザ自動確認は未実行。目視はユーザー担当。

- **Knowledge Graphs and LLMs in ActionのサイドバーCSS・スクロール追従修正（2026-10-15）**:
  - `.layout a`／`.layout a:hover` の詳細度が元の目次クラスを上回り、通常リンクの灰色とホバー時の装飾を上書きしていた。原本CSSの固定オラクルは変更せず、サイドバー内へ限定した詳細度の高い補正で、通常・ホバー・アクティブの原本色と下線なしを復元した。CSS変数だけを固定パレットへ置換し、jsdomのCSSエンジンで実際のカスケードを検証する2契約を追加。
  - 原本の重複ID解消後は監視対象が長いsectionから短い見出しへ変わり、狭いIntersectionObserver帯域を飛び越すスクロールでは更新が起きなかった。スクロール・リサイズ・初期表示時に見出しのviewport座標をアンカー余白（ヘッダー高＋80px）と比較して現在位置を決定する。交差通知も同じ再計算を使い、通知順に依存しない。アクティブクラスと `aria-current` を同期する。
  - 大きな上下移動、見出し間の保持、次の親セクションへの遷移、途中位置での初期表示、リサイズ、IntersectionObserver非対応、通知順、イベント解除の7操作契約を追加。追加9件が修正前に失敗し、修正後は33ページ契約＋20操作契約の全53件成功。現在位置が変わらない場合のDOM属性更新も省く。
  - 全体Vitest **201 files / 2039 tests**、typecheck・lint（553 files／0 diagnostics）、HTML原本監査exit 0が成功。操作処理のV8カバレッジは行100%・関数100%・分岐85.71%。カバレッジ計測時だけ既述の一時ローダーを使用し、依存・設定は変更していない。
  - 分離履歴: Red `25f1d505` → Green `6e36150c` → Refactor `797947d4`。CSSキャッシュを退避し、同リポジトリの既存開発サーバーがポート3002で更新後のCSSとHTTP 200を返すことを確認。目視はユーザー担当。npm・ビルドは未実行。

- **Knowledge Graphs and LLMs in Action完全ガイドの移行（2026-10-15）**:
  - `/books/knowledge-graphs-and-llms-in-action` に全1 H1・14 H2・36 H3・44 H4・80段落・53リスト／157項目・31表／195行・14コード例・18 Mermaid図解・14引用・18折りたたみ・46根拠バッジをPure JSXで転写。参考文献22リンクを含む本文23リンク、目次24リンク、フッターも原本から固定した期待値と照合する。
  - 本文・構造・76 CSS規則を31ページ契約で照合し、13操作テストで目次追従・コピー成功／拒否／代替コピー／後片付けを検証。表の全列左寄せ、リストの点・番号・入れ子、コードの改行・先頭空白、アンカー余白を保持する。
  - 原本の暗色テーマとMermaidテーマ変数、320px固定目次、960px以下の通常フロー目次を保持。共有クロームの背景・日付バー・関連ページ配置は本ページ限定の `globals.css` へ集約。原本のsectionとH2のID重複は見出し側のアンカーを残して解消し、H3にも一意なIDを付けた。
  - HTML／Markdownを `archive/html/books/Knowledge-graphs-and-llms-in-action-guide.html`／`archive/md/books/Knowledge-graphs-and-llms-in-action-guide.md` に内容無変更で保存（移動前後のSHA-256一致）。指定HTMLを正本とし、本文の調査基準日2026年9月21日、registryの追加・確認日2026-10-15を保持する。対応MarkdownはLangGraph再試行上限時の分岐などがHTMLと異なるため、移植先の期待値へ混ぜない。
  - 監査が原本の `DIAGRAMS` 配列・数値文字参照・エスケープ済みJSX文字列・ハイライトで分割されたURLを扱えなかったため、失敗する4テストを先にコミットして形式対応を追加。監査はHTMLのコード内プレースホルダーをJSXとして除去せず、配列は実行せず解析する。既存の監査スクリプト／監査テストの未コミット差分は今回のコミットに含めていない。
  - HTML原本監査exit 0、Mermaid 10.9.8で全18図の構文解析成功。全体Vitest **201 files / 2030 tests**、整理後の44契約、typecheck・lint（553 files／0 diagnostics）が成功。
  - 操作処理のV8カバレッジは行100%・関数100%・分岐86.84%。既存インストールではカバレッジ変換器が `js-tokens` 4を解決して失敗するため、検証時だけ一時ローダーでロックファイル指定のキャッシュ済み10.0.0へ解決した。依存・設定・ロックファイルは変更していない。
  - 分離履歴: 移行Red `8dc7ffdd` → Green `93a028d7` → Refactor `631b0d87`。監査Red `274d72d8` → Green `9e0d4b45`。
  - `.next` が存在しない状態から開発サーバーをポート3002で起動し、移行先URLのHTTP 200を確認（目視・ブラウザ操作なし）。`next dev` が自動更新したAGENTS.mdは起動前の内容へ戻した。目視確認はユーザー担当。npm・ビルド・スクレイパー・ブラウザ自動確認は未実行。

- **SonarCloud新規コードカバレッジ対応・レビュー指摘修正（2026-10-15）**:
  - `hands-on-large-language-models/TocObserver.tsx`（0%）と `rag/enterprise-guide/TocObserver.tsx`（0%）に単体テストを追加。ページテストは TocObserver をモックするため、単体テストがないとカバレッジに反映されなかった。
  - enterprise-guide の `#menuBtn`・`#sidebarBackdrop`・`#topBtn` は `layout-root` の兄弟要素で、`root.querySelector` では取得できずモバイル目次とTopボタンが動いていなかった。`document` から取得するよう修正。
  - llm-engineers-handbook: `aria-controls="sidebar"` を追加し、`globals.css` と重複していた共有クロームの上書きを CSS Module から削除（D-10 は `globals.css` を検証）。
  - hands-on: 兄弟要素のトグル用に `--panel`/`--text` を body スコープでも定義し、参考文献グリッドを `minmax(min(340px, 100%), 1fr)` に変更。関連ページの全幅化を 900px（サイドバー折りたたみ幅）に揃えた。
  - enterprise-guide: `.article` の `max-width` を削除。閉じたサイドバーと非表示の Top ボタンに `visibility: hidden` を付け、キーボードのフォーカス対象から外した。
  - `audit_source_parity.mjs`: Mermaid の class トークン境界を HTML 空白とクォートだけに限定した（「図mermaid」のように非 ASCII 文字と隣接するものは誤検出しない）。

- **Hands-On Large Language Modelsガイドの移行・原本アーカイブ・スタイル調整（2026-10-14）**:
  - `/books/hands-on-large-language-models` に全10 H2・22 H3・16 H4・96段落・56リスト項目・7表／64行（書籍情報kv表8行、アーキテクチャ比較表、RAG/ファインチューニング比較表等）・27 Mermaid図解・17チェック項目・24参考文献カード（24外部リンク）をPure JSXへ転写。
  - 原本HTML `Hands-on-large-language-models-guide.html` および Markdown `Hands-on-large-language-models-guide.md` は内容無変更で `archive/html/books/` および `archive/md/books/` へ `git mv` 退避（ユーザー指示によりMarkdownファイルも同時に退避保存）。指定HTMLを正本とし、registryの追加・確認日は2026-10-14。
  - 原本照合監査スクリプト（`audit_source_parity.mjs`）は exit 0 で漏れなしを確認。
  - スタイリング・共通クローム対応:
    1. 書籍情報カード（O'Reilly公式ページリンク、著者Jay Alammar & Maarten Grootendorst）、Hero kicker、メタ情報タグ4件。
    2. ヒーローセクション内に最終確認日・公開日を黒文字（`var(--text)`）で統合し、グローバル黒帯鮮度バー（`#site-freshness-bar`）を非表示化。
    3. ヘッダー・ディスクレーマーとサイドバー・メインコンテンツの配置調整:
       - サイドバー被りの解消: `.sidebar` の `top` を `calc(var(--header-height, 60px) + var(--ch-disclaimer-height, 0px))` に設定し、ディスクレーマーバナー直下に正しく配置（全幅バナーの左端被りを解消）。
       - ディスクレーマー下の余計な隙間の解消: `globals.css` および `page.module.css` に `:global(body:has([data-page="hands-on-large-language-models"]))` を定義し、`body.has-common-header` の過剰な `+10px` マージンを打ち消し。さらに `.main` の上部パディングを `32px` に調整。
       - Mermaid構文エラーの解消: 原本HTML由来のHTMLエンティティ（`--&gt;`, `&lt;br/&gt;` 等）を適切な記法（`-->`, `<br/>`）に正規化し、全27箇所のダイアグラムが正常にSVG描画されるよう修正（監査オラクルのexit 0を維持）。
    4. 共通レイアウトフッター（`nav[aria-label="関連ページ"]`）を固定サイドバー（340px）からオフセット（`margin-left: 340px; width: calc(100% - 340px)`）し、900px以下では全幅（`margin-left: 0; width: 100%`）へ戻す。
    5. テーブルの全列左寄せ（`:global(th), :global(td)` で `text-align: left !important`）。
    6. 全27箇所の Mermaid 図解に淡色パレット（`theme="base"`, `themeVariables`）を適用。
    7. 目次スクロール追従（`TocObserver`、見出し＋トップ）とアンカー移動時の見出しめり込み防止（`scroll-margin-top`）。
    8. インタラクティブチェックリスト（17項目、チェック進捗カウンター連動）。
  - 22件の契約テスト（S-1〜S-4 原本照合、C-1〜C-6 コンテンツ、D-1〜D-9 デザイン、Q-1〜Q-3 品質契約）および 12件の TocObserver 操作テストを追加。
  - 分離履歴: Red `750c27d3` → Green `ac3453b2` → Refactor `0399f9c5`。
  - 全体テスト: 197 files / 1970 tests すべて成功。typecheck、lint（545 files / 0 diagnostics）も成功。

- **エンタープライズRAG完全ガイドのコードブロック改行・サイドバー常駐・フッターデザイン改善（2026-10-14）**:
  - コードブロック改行・インデント崩れの解消:
    - JSX `<pre>` 内のタグ間改行が空白ノードとしてインライン連結されていた問題を解消。
    - スタイリング防犯原則 R2 に準拠し、全4箇所のコードブロックを39行の `<span className="codeLine code-line">` で行単位に構造化。
    - `page.module.css` に `.codeLine { display: block; min-height: 1.8em; white-space: pre; }` を定義し、行単位の改行・空行・`{"    "}` インデントを完全担保。
  - サイドバー常駐化とフッター途切れの解消:
    - `.sidebar` を親コンテナ `.layout` 内の `sticky` から `position: fixed; top: calc(var(--header-height, 60px) + var(--ch-disclaimer-height, 0px)); bottom: 0;` に変更。
    - ページ最下部スクロール時にサイドバーが途切れてフッター左側が空白になる問題を解消し、画面下端までサイドバー枠線と背景が常駐するよう設計。
    - `.contentWrap` に `margin-left: var(--sidebar-w);` を設定（モバイル `@media (max-width: 980px)` では `margin-left: 0;`）。
    - 共通フッター（`nav[aria-label="関連ページ"]`）の背景色（`#eef1f4`）、カード（`#ffffff`）、枠線（`#dce2e9`）、アクセント（`#1f5c57`）を淡色テーマへ同期。
    - スクロール時に免責事項バナーの背後に本文テキストが透けて重なる現象を防止するため、`.ch-disclaimer` に不透明背景色（`#1a1712`）と `backdrop-filter: none` を適用。
  - テスト・検証:
    - `page.test.tsx` の C-2 契約に 39 行の `.code-line` の構造化検証を追加。
    - 原本照合監査スクリプト `audit_source_parity.mjs` で `exit=0` を確認。
    - 全体 Vitest（195 files / 1936 tests）、Typecheck（`tsc --noEmit`）、Biome check（539 files / 0 diagnostics）すべて成功。

- **エンタープライズRAG完全ガイドの移行・原本アーカイブ・スタイル調整（2026-10-14）**:
  - `/rag/enterprise-guide` に全4 H2・15 H3・10 H4・73段落・15リスト／68項目・11表／67行・4コードブロック・6 Mermaid図解・18外部リンク（15参考ソースカード含む）をPure JSXへ転写。
  - 原本HTML `Enterprise-rag-guide.html` は移行・検証完了後に `archive/html/rag/Enterprise-rag-guide.html` へ `git mv` 退避（内容無変更）。情報基準日2026年9月10日を完全維持。
  - 原本照合監査スクリプト（`audit_source_parity.mjs`）は exit 0 で漏れなしを確認（クラス名 `mermaid-card` を誤検知しないよう `divRe` 正規表現を微修正）。
  - スタイリング・共通クローム調整:
    1. グローバル黒背景鮮度バー（`#site-freshness-bar`）を非表示化し、ディスクレイマー下の余計な余白を解消。
    2. 背景色を淡色グレーブルー（`#eef1f4`）に統一し、308px固定サイドバーとコンテンツ幅の調和を確保。
    3. 共通レイアウトフッター（`nav[aria-label="関連ページ"]`）を308pxサイドバーからオフセット（`margin-left: 308px; width: calc(100% - 308px)`）し、980px以下では全幅へ戻す。
    4. テーブルの全列左寄せ（`:global(th), :global(td)` で `text-align: left !important`）。
    5. コードブロックの先頭インデント保持とPygments(one-dark)対応spanトークン、`.highlight` ラッパー。
    6. 全6箇所の Mermaid 図解に淡色パレット（`theme="base"`）を適用。
    7. 目次スクロール追従（`TocObserver`、見出し＋トップ）とアンカー移動時の見出しめり込み防止（`scroll-margin-top`）。
  - 19件の契約テスト（S-1〜S-4 原本照合、C-1〜C-6 コンテンツ、D-1〜D-6 デザイン、Q-1〜Q-3 品質契約）を追加。
  - 分離履歴: Red `ffa4b1d1` → Green `736e336e` → Refactor `d24781a9`。
  - 全体テスト: 195 files / 1936 tests すべて成功。typecheck、lint（539 files / 0 diagnostics）も成功。

- **Adversarial Robustness for Machine Learningガイドの移行・共通クローム／スタイル調整（2026-10-14）**:
  - `/books/adversarial-robustness` に全19 H2・12 H3・41段落・34リスト項目・7表／66行（書籍情報kv表8行、全26章一覧表27行を含む）・1数式ブロック（minimax最適化問題）・12 Mermaid図解・3 callout・10チェック項目・22参考文献カード（23外部リンク）をPure JSXへ転写。
  - 原本HTML/Markdownは `archive/html/books/Adversarial-robustness-for-machine-learning-guide.html`／`archive/md/books/Adversarial-robustness-for-machine-learning-guide.md` へ内容無変更で退避。SHA-256はHTML `f090ff7345d31ca233f2c529f77f763db4eb6c1f2e1dfda1fe44ebfc844cf530`、Markdown `202848a3852028fa6ea9d9e47265a7f9a1284d74268e309cbffc6e7a2df23d7f` で移動前後一致。指定HTMLを正本とし、registryの追加・確認日は2026-10-14。
  - 原本照合監査スクリプト（`audit_source_parity.mjs`）は exit 0 で漏れなしを確認。
  - スタイリング・共通クローム対応:
    1. 書籍情報カード（Plum callout、Elsevier公式リンク）、Hero kicker（AI Security 初学者ガイド）、メタ情報タグ4件。
    2. ヒーローセクション内に最終確認日・公開日をメインコンテンツの背景色に合わせた黒文字（`var(--ink)`、`#241f18`）で統合し、グローバル黒帯鮮度バー（`#site-freshness-bar`）を非表示化してディスクレイマー下の不要余白を解消。
    3. 共通レイアウトフッター（`nav[aria-label="関連ページ"]`）を固定サイドバー（300px）からオフセット（`margin-left: 300px; width: calc(100% - 300px)`）し、サイドバー下への潜り込みを解消。
    4. フッター全体の背景色をメインコンテンツと同じ淡色ペーパー色（`#f6f1e3`）に統一し、カード（`#fffdf7`）、枠線（`#e4dbc4`）、タイトル（`#241f18`）、要約（`#5a5342`）、アクセント（`#413d8f`）を調和させてダークテーマの浮きを完全に解消。
    5. 数式ブロック（minimax saddle-point 問題）、攻撃 taxonomy・防御 taxonomy・歴史的経緯の各詳細表（全列左寄せ）。
    6. 全12箇所の Mermaid 図解に淡色パレット（`theme="base"`, `themeVariables`）を適用。
    7. 目次追従（`TocObserver`、19見出し＋トップ）とアンカー移動時の見出しめり込み防止（`scroll-margin-top`）。
    8. インタラクティブチェックリスト（10項目、チェック進捗カウンター連動）。
  - 20件の契約テスト（S-1〜S-4 原本照合、C-1〜C-6 コンテンツ、D-1〜D-7 デザイン、Q-1〜Q-3 品質契約）を追加。
  - 分離履歴: Red `eeef014a` → Green `2ff5a863` → Refactor `bdf3b74c` → 追加Red `ddc6febc` → 追加Green `50fda30b` → 追加Refactor `b59641bc` → フッターRed `f605b780` → フッターGreen `695c45a1`。
  - 全体テスト: 194 files / 1917 tests すべて成功。typecheck、lint（535 files / 0 diagnostics）も成功。

- **LLM Engineer's Handbookガイドの移行・共通クローム／スタイル調整（2026-10-14）**:
  - `/books/llm-engineers-handbook` に全15 H2・20 H3・55段落・83リスト項目・55表行・2コードブロック・8 Mermaid・5 callout・10チェック項目・15参考文献リンクをPure JSXへ転写。
  - 原本HTML/Markdownは `archive/html/books/Llm-engineers-handbook-beginner-guide.html`／`archive/md/books/Llm-engineers-handbook-beginner-guide.md` へ内容無変更で退避。SHA-256はHTML `ab1c7ad51535b222d61eaef9b3ccefec1efb9e2c96b2d85bcb3e10a8b1de3d62`、Markdown `7fefe969a6e7ef24bc1c5c5feed3b8b02d1576d49c4231d5e49941c0a4d22690` で移動前後一致。指定HTMLを正本とし、registryの追加・確認日は2026-10-14。
  - 原本照合監査スクリプト（`audit_source_parity.mjs`）は exit 0 で漏れなしを確認。
  - スタイリング・共通クローム調整:
    1. 免責バナー（`DisclaimerBanner`）と固定サイドバー（280px）・メインコンテンツの高さ同期（`--ch-disclaimer-height` 連動、見出しめり込み防止 `scroll-margin-top` 補正）。
    2. グローバルの黒背景鮮度バー（`#site-freshness-bar`）を `display: none !important; height: 0 !important;` で非表示化し、`margin-top` の余計な余白（+10px）を削除してディスクレイマー直下にヒーローをピタッと接続。
    3. ヒーローセクション内に最終確認日・公開日を黒文字（`var(--ink)`、`#241f18`）で統合。
    4. 関連ページフッター（`nav[aria-label="関連ページ"]`）のサイドバー下潜り込みを解消（`margin-left: 280px; width: calc(100% - 280px)`）。
    5. 全8箇所の Mermaid 図解にライトモード淡色パレット（`theme="base"`, `themeVariables`）を適用し、通常ノード・classDefノードの可読性を確保。
  - 21件の契約テスト（S-1〜S-4 原本照合、C-1〜C-6 コンテンツ、D-1, D-5〜D-11 デザイン、Q-1〜Q-3 品質契約）を追加。
  - 分離履歴: Red `48ddd3d4` → Green `a614dbda` → Refactor `c11006ab` → 追加Red `d73b06da` → 追加Green `5afd7acb`。
  - 全体テスト: 193 files / 1897 tests すべて成功。typecheck、lint（531 files / 0 diagnostics）も成功。

- **`bun audit` 脆弱性対応（2026-10-11）**: `next` を 16.3.6→16.3.8（GHSA-cjq9-62q9-8jv4 ほか6件）、`overrides` で `sharp` ^0.35.5・`source-map-js` ^1.2.2・`katex` ^0.18.2 に更新し、`bun audit` は0件。`katex` は mermaid 10.9.8 の範囲外だが、Mermaid の `$$` 数式記法を使う図が無く実行経路に乗らないため override で固定。typecheck・lint（527 files）・Vitest 192 files / 1876 tests が成功。ビルドは未実行。
- **Generative AI with LangChainガイドの移行（2026-10-11）**:
  - `/books/generative-ai-with-langchain` に全13 H2・38 H3・49段落（図解の代替説明8件を含む）・4リスト／15項目・11表／67行・12コード例・8 Mermaid・5 callout・12ステップ・22参考文献カードをPure JSXへ転写。手書きSVG・引用・チェックリストは原本に存在しないため追加していない。
  - Redで固定した `source-contract.json` により、本文・見出し・リンク全文とURL・表の全セルとタグ・リストの型と全項目・装飾クラス・76 CSS規則を順序込み完全一致で検証。全コードの空白・改行・バックスラッシュ、先頭インデント、highlight.jsの元CSSを使うspanトークン、全8図のソース・代替説明・キャプションを照合する。表構造の空白ノード禁止、箇条書きのdisc・番号のdecimal、全列左寄せ、アンカー余白も検証。原本期待値は実装に合わせて変更していない。
  - 共通CSSリセットで失われるh2／h3の下余白とリストの上下余白・既定40pxインデントを復元し、本文の `.prose` 内では原本22pxを維持する。900px以下では原本どおり上部目次を通常フローに置き、ハンバーガーメニューを追加しない。デスクトップの高さ補正がモバイルの `height: auto` を上書きしないことを、CSSの実際の順序で検証する。
  - 固定サイドバー幅280px、暗色のネイティブスクロールバー、共有ヘッダー＋動的免責バナーを差し引く高さを保持。共通日付バーとbodyを本文の `#07111e` に揃え、関連ページはサイドバー幅だけ右へ配置し、900px以下で全幅へ戻す。CSS Modulesのローカルクラスを含む `:has()` で他ページへの影響を防ぐ。
  - Mermaidのdarkテーマ、紫／青緑のclassDef配色、SVGラベルを使用。サイズ・中央寄せの3 CSS規則は共有部品へ委譲し、原本の配色を保持する。図解と代替段落をpage.tsxに直接記述し、専用client部品はSVGの有無だけを監視する。描画待ち・失敗時は全文を表示し、SVG成功時のみ段落を隠し、SVGが消えたら復元。代替本文はDOMにも残す。Mermaid 10.9.8で全8図の構文解析が成功。
  - タイトルのないwarning 2件は原本の本文をそのままラベル契約の対象とし、見出しを創作しない。tipのgood variantとコードの `{role}`／`{question}`／`{query}` は定数で渡し、固定DOM契約で表示文字列を完全一致検証する。監査スクリプトや原本の期待値は変更していない。
  - HTML／Markdownは `archive/html/books/Generative-ai-with-langchain-guide.html`／`archive/md/books/Generative-ai-with-langchain-guide.md` へ内容無変更で退避。SHA-256はHTML `f19bbcda51c3495be8a441be508a13de8bf2659cdaefaa3e1cc3bd4ad0687edd`、Markdown `5329901cad76e9a894119f3e37ebafc55f13abfa28176496ad975308de36dd11` で移動前後一致。指定HTMLを正本とし、本文の情報基準日2026-09-23を維持。registryの追加・確認日は2026-10-11。
  - HTML原本監査はexit 0。監査上のcallout 6件は実際の5 calloutと `ti-alert-triangle` アイコン1件。外部URL数の差は元の2 CDN stylesheetをJSXに挿入したため。Markdownも監査したが、見出し14件・表2行・段落21件・図ソース8件などの構造／表記差とコードの監査正規化差がありexit 1。指定HTMLの内容を正とし、Markdownから異なる本文や図を混ぜず、そのまま保存する。
  - 32ページ契約＋目次9契約＋図解代替表示7契約の計48件を追加。操作部品の対象限定カバレッジは行・関数100%、分岐88.88%、statement 97.77%。テストのIO模擬データは型検査で不足項目を検出し、正規の `IntersectionObserverEntry` 全フィールドを追加した。期待値は変更せず、修正コミットを実装と分離する。
  - 分離履歴: 初回Red `bfc91601` → 図解／CSS export追加Red `40197e27` → モバイル高さ追加Red `65087a07` → 図解の入力fixture調整 `6b25076c` → 既定余白追加Red `3642b28f` → IO型fixture修正 `a2760046` → Green `8868adbd` → Refactor `934408a1`。各追加Redは実際の失敗を確認し、実装・テスト・Docsの一括コミットは行っていない。
  - 開始時ベースライン189 files／1828 tests、Green時の全体192 files／1876 testsが成功。Refactor後も48契約・typecheck・lint（527 files／0 diagnostics）・原本監査exit 0が成功。全体テストと型検査は順次実行し、検証中はこのリポジトリのdevサーバーを一時停止。CSSキャッシュを一時ディレクトリへ退避してlocalhostのポート3000で再起動した。起動時の自動生成AGENTS差分は元へ戻した。npm・ビルド・スクレイパー・ブラウザ自動確認は未実行。目視はユーザー担当。

- **Generative AI on AWSの共通クローム修正（2026-10-11）**:
  - 原本に独自スクロールバー指定はない。共通viewportの `colorScheme: dark` が変えるネイティブの外観を、ページの `color-scheme: light` で原本の淡色表示へ戻す。固定配置・独立縦スクロール・余白と、目次の操作処理は変更していない。
  - 共通「関連ページ」をデスクトップのサイドバー幅300pxだけ右へ配置し、980px以下では全幅へ戻す。本文と同じ淡色トークンを渡し、全カードを保持する。
  - 共通の日付バーとbodyを本文と同じ `#faf6ec` にし、日付は濃い文字・右寄せで表示。CSS Modulesのローカルクラスを含む `:has()` で本ページだけに適用し、他ページ・共通部品・元の固定オラクルは変更しない。
  - 4件のCSS回帰契約は宣言の全体一致とモバイル指定、独自スクロールバーの不在を照合する。実装前のRed `6d17b184` と、セレクタの空白を正規化するテスト抽出修正 `a5a1cce1` をGreen前に分離。
  - 検証環境ではログインシェルのNode 20ではなくNode 24を使用し、`NODE_OPTIONS=--no-experimental-webstorage` を指定する。並列検証中に既存テストの5秒timeoutとaxeの連鎖失敗が出たため、実行時の `--maxWorkers=1 --testTimeout=30000` で再検証し、全189 files／1828 testsが成功。個別に指定された15秒制限はそのまま維持し、依存・設定ファイルやテストの期待値は変更していない。型検査・lint（519 files／0 diagnostics）・原本監査exit 0も成功し、Green `3d473b2c` を分離。追加の整理は不要と判断し、空のRefactorコミットは作成しない。
  - CSSキャッシュを一時ディレクトリへ退避し、ポート3000で開発サーバーを再起動。起動時に自動生成された `web-next/AGENTS.md` の差分は元へ戻し、ルーティング規約を保持する。目視確認はユーザー担当。

- **Generative AI on AWSガイドの移行（2026-10-11）**:
  - `/books/generative-ai-on-aws` に全22 H2・著者3 H4・76段落・本文7リスト／35項目・7表／39行・9 Mermaid・6 callout・13チェック項目・23参考文献カードをPure JSXへ転写。サイドバーの3リスト／22項目を含め全57リスト項目を保持。通常コードブロック・SVG・引用は原本に存在しない。冒頭計画の段落77件はscript内のエラー表示用HTML文字列1件を含む生タグ数であり、本文DOMは76段落。
  - Redで固定した`source-contract.json`により本文・見出し・リンク・表の全セル・リストの型と全項目・装飾クラス・109 CSS規則を順序込み完全一致で検証。箇条書きのdisc、番号付きリストのdecimal、TOC／チェックリストのマーカーなし、全列左寄せ、アンカー余白を検証。期待値は実装に合わせて変更していない。Reactのstylesheet巻き上げと外部アイコンのグローバルクラスに対応するテスト抽出だけを追加Redで修正し、CSS期待値の任意キーに対応する補助関数の型修正を分離した。
  - 原本の著者カードはH2直下にH4があり、最初の著者でのみ階層が飛ぶ。この既存構造は変更せず、全見出しのタグ・文言と既存の例外を固定契約で検証。参考文献URLは原本どおり文字列表示を保持し、外部リンクへの変換は行っていない。H2には一意の見出しIDを追加し、既存sectionのTOCアンカーも保持。
  - 28ページ契約と15操作契約を追加。980px境界、トグル／scrim／Escape／リンク開閉、フォーカス・inert、resize、スクロール追従、cleanup、チェックカウンターを検証。原本の9図ソースは全文・順序込み一致。ライトテーマ、hub/doneの配色を保持し、サイズ・中央寄せは共有部品へ委譲。Mermaid 10.9.8で全9図の構文解析が成功し、原本のMermaid 11依存をアプリへ追加していない。
  - HTML／Markdownを`archive/html/books/Generative-ai-on-aws-guide.html`／`archive/md/books/Generative-ai-on-aws-guide.md`へ無変更で退避。SHA-256はHTML `f9a750b5fd561c7aea4cbf89fe61715d6ff71b87abe961f941ff25ca3c982bf8`、Markdown `cf6c2fac50dbe3611c90fabbfa653897cad4e93d271d4528e880c244f5548f0c`で移動前後一致。本文の情報基準日2026-09-10を維持し、registryの追加・確認日は移行日の2026-10-11。
  - 指定HTMLの原本監査はexit 0。Markdownにも監査を実行したが、章番号を含む見出し表現・別構造の9図・旧URL2件・本文差があるため不一致。指定されたHTMLを正本にし、Markdownから古い本文や図を混ぜない。Markdownもそのまま保存する。
  - Red `a85b33d8`、テスト抽出追加Red `d4960ec6`、テスト補助型修正 `1b73a3b9` → Green `7014827d` → Refactor `054eb8f7`を分離。原本監査exit 0、全体Vitest **188 files／1824 tests**、typecheck、lint **518 files／0 diagnostics**が成功。npm・ビルド・ブラウザ自動確認は未実行。スクレイパー検証はユーザー指定で対象外。
  - CSSキャッシュを一時ディレクトリへ退避し、既存の開発サーバーをポート3000で再起動。`next dev`が自動変更した`web-next/AGENTS.md`は元の内容へ戻し、設定やルール変更は含めていない。目視確認はユーザー担当。移行後のルート直下の未移行HTML候補は10件（Git追跡ファイルで実測）。

- **Effective Machine Learning Teams 入門ガイドの移行と承認済み復旧（2026-10-04）**:
  - `/books/effective-ml-teams` に全13 H2・29 H3・59段落・18リスト／66項目・5表／26行・11 Mermaid・12チェック項目・18参考文献カードをPure JSXへ転写。calloutはpractice 10件／source 4件、引用3件、TOC 42リンクを保持。原本に通常コードブロック・SVG・外部CSSは存在しないため追加していない。
  - 実装前に固定した `source-contract.json` で本文・リンク全文とURL・見出しID・リスト型と全項目・表の全セルとタグ・全装飾クラス・74 CSS規則とレスポンシブ指定を順序込み照合。表直下のテキストノード禁止、箇条書きの点・decimal番号・チェックリストとTOCのマーカーなし、全列左寄せ、アンカー余白も検証。原本期待値は実装に合わせて変更していない。
  - 原本HTML／Markdownは `archive/html/books/Effective-ml-teams-guide.html`／`archive/md/books/Effective-ml-teams-guide.md` へ内容無変更で退避。SHA-256は移動前後で一致。指定されたHTMLを移行の正本とし、本文の情報基準日2026-09-13を保持。registryの追加・確認日は2026-10-04であり、本文の情報更新は行っていない。
  - 固定サイドバーとモバイルボタンを共有ヘッダー＋動的免責バナーの下へ配置。900px境界、トグル／scrim／Escape／リンク開閉、フォーカス・inert、resize、スクロール追従、cleanup、チェックカウンターの15操作テストを追加。操作処理の対象限定カバレッジは行・関数100%、分岐92.5%。CSSキャッシュは一時ディレクトリへ退避済み。ポート3000で稼働中の開発サーバーはなく、目視確認はユーザー担当。
  - Mermaid本文は全11図の順序・内容込みで完全一致。共有部品のforeignObject文字色上書きを避けるSVGラベルを使い、原本classDefの文字色を各図IDに限定。同名 `baseFill` が図4では緑系、図10では青系となる原本の差を維持。配色・レイアウトは原本から保持し、図のサイズと中央寄せは共有部品へ委譲。
  - 原本のhrefを持たない `references` アンカーも保持。テスト抽出を属性不在に対応させ、その要素のlintだけに理由付き除外を明記。calloutのgood/info variantは定数で渡してDOM契約で全文と共に検証し、静的監査では原本のcalloutマーカーを維持する。
  - RSSの既存順序テストはHomeのURLをchannelリンクと取り違えていたため、記事ごとのURL順序を完全一致で照合する形へ修正（`5fb2c5f7`）。RSS実装自体は変更していない。
  - **手順違反と復旧の記録**: 追加配色テストの失敗後にGreen `c9a487f2` を作成したミスを即報告し、修正を停止。ユーザーの承認後、追加Red `c56f8eb2` → 修復Green `9b5be18b` → Refactor `f516525e` を分離して復旧した。履歴のreset・書き換えは行っていない。初回Redは `511fe2c3`、配色追加Redは `f1d673ea`。
  - 最終検証はページ29契約＋操作15契約、全体Vitest **185 files／1779 tests**、typecheck、lint **510 files／0 diagnostics**、pytest **104 tests**が成功。原本監査・CSS変数監査もexit 0。npm・ビルド・ブラウザ自動確認は未実行。依存・設定ファイルは変更していない。

- **AI-Powered Developer のコンソールエラー・共通レイアウト修正（2026-10-03）**:
  - 全7表の `table`／`thead`／`tbody`／`tr` 直下から空白テキストを除去。明示的な `{" "}` だけでなく、同一行のタグ間空白も検査する。React要素ツリーの全表構造を走査し、許可する子要素以外・文字列ノードが一切ないことを完全一致で検証。
  - 日付は registry の `lastReviewed`／`addedAt` を使い、本文の最初に黒文字・右寄せで表示。ページ限定で共通日付バーを非表示にし、bodyの追加10pxとサイドバーの追加16pxを除去。免責バナー直下から本文とサイドバーの背景が始まる。
  - 共通「関連ページ」はデスクトップでサイドバー幅288pxを避け、980px以下では左余白を0に戻す。本ページ限定の淡色変数を渡す。ヒーロー周囲に0.75rem／1rem、「本ガイドについて」の上に1remの余白を追加。
  - 回帰テスト5件を追加（ページ合計45件）。原本の固定オラクルは変更せず、追加日付要素だけを原本クラス照合から除外して別途検証。原本監査exit 0、全体183 files／1727 tests、typecheck・lintを確認。Red `744192c8` → Green `1021dde4` → Refactor `dd0d38c9`、追加指定Red `5628bfea` → Green `c9ddda02` を分離。
  - CSS変更後に開発サーバーを停止し、キャッシュを一時ディレクトリへ退避してポート3000で再起動。npm・ビルド・ブラウザ自動確認は未実行、目視確認はユーザー担当。

- **AI-Powered Developer ガイド（/books/ai-powered-developer）の Next.js 移行（2026-10-03）**:
  - 原本の全18 H2・25 H3・45段落・10リスト／35項目・7表／46行・9 Mermaid・9更新callout・10項目チェックリスト・22参考文献カードを Pure JSX へ転写。
  - 事前に原本から固定した `source-contract.json` で本文・リンク・見出し・リストの型と全項目・表の全セル・アイコン／クラス・99 CSSルールとレスポンシブ指定を順序込みで照合。箇条書きの点、番号付きリスト指定、チェックリストのマーカーなし、表の全列左寄せを追加検証。
  - 原本照合監査 `audit_source_parity.mjs` は exit 0。監査上の callout 10 件は更新callout 9 件と `ti-alert-triangle` アイコン 1 件であり、実際のcallout 9 件は内容・順序・variant まで別途テストする。
  - 契約テスト26件と操作テスト14件を追加。目次の追従・980px境界・トグル／scrim／Escape／リンクによる開閉・フォーカス／inert・resize・フレームとイベントのcleanup・チェック状態とカウンターを検証。`TocObserver.tsx` のカバレッジは lines/functions 100%、branches 94.44%（対象限定実測）。
  - Next.js との統合差分: サイドバーを固定のまま共有ヘッダー＋動的免責バナーの下へ配置。Tailwind が消すブラウザ標準のリスト・段落余白を復元。Mermaid のサイズ・中央寄せは共有部品へ委譲し、原本 runtime classDef の hub/done/box 配色はページ限定の SVG CSS へ転写。共有部品の foreignObject 色上書きを避けるため SVG ラベルを使い、図ソース自体は完全一致を維持。
  - 原本 HTML／Markdown はそれぞれ `archive/html/books/AI-Powered-Developer.html`／`archive/md/books/AI-Powered-Developer.md` へ退避。移動前後の SHA-256 が一致し、内容は無変更。移行の正本は指定された HTML。本文の情報基準日は原本の2026-09-17を保持し、情報更新は行っていない。
  - 推薦書籍グループに registry 登録し、ナビ・検索・RSS・関連リンクへ自動導出。新規ルート・ナビの全単射テストも合格。Red `071b4e2b`、追加Red `1dcf1808`、Green `557d0f16`、Refactor `e3e4d28d` を分離。CSS 整理後の40契約・typecheck・対象Biome・監査も合格。ビルド・npm・ブラウザ自動確認は実行していない。目視はユーザー担当。

- **ITIL AI Governance (Version 5) 完全学習ガイド（/governance/itil-ai-governance-v5）の Next.js アプリ移行 & ナビ「資格試験」グループ新設**:
  - `Itil-ai-governance-v5-study-guide.html` を `web-next/app/governance/itil-ai-governance-v5/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。
  - 要約・省略一切なしで全12セクション（この教材について〜参考文献・出典一覧）、全44サブセクション（h3）、全8サブサブセクション（h4）、全表（111行相当）、14個のMermaid図解（`MermaidDiagram`）、TOCスクロール追従（`TocObserver.tsx`）、全24件のcallout（practice: 9, source: 11, note: 4）、全14件の参考文献カード・外部リンク安全属性（`target="_blank" rel="noopener noreferrer"`）、ブランドSVGを完全再現。
  - グローバルナビゲーション（`web-next/lib/nav-taxonomy.ts`）に新グループ「資格試験」を新設し、トップレベルドロップダウンに追加。`components/site/SiteHeader.test.tsx` のドロップダウン数（6 → 7）および `tests/nav-derivation.test.ts` のグループ数（9 → 10）を同期更新。
  - 原本照合監査スクリプト `audit_source_parity.mjs` を拡張し、シングル・ダブルクォート文字列の Mermaid 抽出に対応した上で、原本とのパリティ監査で exit code 0（漏れなし ✅）を確認。
  - 原本 `Itil-ai-governance-v5-study-guide.html` および `Itil-ai-governance-v5-study-guide.md` は `archive/html/governance/` および `archive/md/governance/` へ退避保存。
  - `web-next/lib/page-registry.ts` に新規エントリ（`slug: "/governance/itil-ai-governance-v5"`, `group: "資格試験"`）を登録。
  - 契約テスト14件（S-1〜S-4, C-1〜C-5, D-1〜D-3, Q-1〜Q-2）を作成し、Vitest **177 files / 1639 tests** 全 Green ✅、typecheck ✅、Biome lint ✅ を確認。

- **AI Engineering 入門ガイド（/books/ai-engineering-guide）の Next.js アプリ移行**:
  - `Ai-engineering-guide.html` を `web-next/app/books/ai-engineering-guide/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。
  - 要約・省略一切なしで全17セクション（はじめに〜参考文献・出典）、全10サブセクション（h3）、全表（6個）、9個のMermaid図解（`MermaidDiagram`）、TOCスクロール追従・モバイルドロワー（`TocObserver.tsx`）、全28件の参考文献・外部リンク安全属性（`target="_blank" rel="noopener noreferrer"`）、全幅レイアウトを完全再現。
  - **ヘッダー・ディスクレーマー境界スタイリング適合化**: グローバル鮮度バー（`#site-freshness-bar`）を非表示化（`display: none !important`）し、ディスクレーマーとヒーローセクション間の不自然な黒い線を解消。ヒーローセクション（`#f7f2e7`）の色合いを優先させ、固定ヘッダーと警告バナーの不透明化によりスクロール時の二重写りを防止。
  - 原本 `Ai-engineering-guide.html` は `archive/html/books/Ai-engineering-guide.html` へ退避保存。
  - 原本照合監査スクリプト `audit_source_parity.mjs` で exit code 0（漏れなし ✅）を確認。あわせて識別子キー（クォートなしオブジェクトリテラル）の Mermaid 抽出に対応。
  - `web-next/lib/page-registry.ts` に新規エントリ（`slug: "/books/ai-engineering-guide"`, `group: "推薦書籍"`）を登録。
  - 契約テスト18件（S-1〜S-4, C-1〜C-6, D-1, D-5, D-7, D-8, D-9, D-10, Q-2, Q-3）を作成し、Vitest **176 files / 1621 tests** 全 Green ✅、typecheck ✅、Biome lint ✅、build ✅（90静的ページ）を確認。

- **Generative AI for Software Development ガイド（/books/generative-ai-for-software-development）の UI / スタイル / インタラクション完全適合化**:
  - **公開日・最終確認バッジ**: グローバル鮮度バーの黒背景・青文字による違和感を解消するため、本ページではヒーローセクション最上部に統合。背景色をヒーロー色（`#faf7ef`）、文字色を黒文字（`var(--ink)` / `var(--ink-soft)`）に設定し、グローバルの黒バーを非表示化。
  - **フォント完全移行**: 原本準拠の Google Fonts（`Source Serif 4` および `Noto Serif JP`）の `<link>` を追加し、見出し・カバーのセリフ体を原本と 100% 同一に再現。
  - **ヘッダー・スクロール重なり防止**: スクロール時に本文テキストが半透明ヘッダーの裏に透けて二重写しになる問題を解消するため、本ページ表示時に固定ヘッダー（`#common-header`）および免責バナー（`.ch-disclaimer`）の背景を完全不透明化（solid）。アンカー移動の見出しめり込み防止（`scroll-margin-top`）も設定。
  - **学習チェックリストの完全移行**: 全9項目に `.check-item` クラスを確実に付与し、`TocObserver.tsx` で初期表示時のカウンター（`0 / 9 完了`）およびクリック時のトグル・打消し線連携を修正。`color-scheme: light` によりブラウザのダークモード判定による黒四角（■）化を防止し、原本の白背景＋グレー枠線＋深緑（`var(--forest)`）チェックを完全再現。
  - 契約テストを 17 件から 20 件（D-9, D-10, Q-4 追加）へ拡充し、Vitest **175 files / 1603 tests** 全 Green ✅、typecheck ✅、Biome check ✅、原本照合監査 `exit=0` ✅ を確認。

- **Generative AI for Software Development ガイド（/books/generative-ai-for-software-development）の Next.js アプリ移行 & ナビ「推薦書籍」グループ新設**:
  - `Generative-ai-for-software-development-guide.html` を `web-next/app/books/generative-ai-for-software-development/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。
  - 要約・省略一切なしで全17セクション（この本について〜参考文献・出典URL一覧）、全33サブセクション（h3）、全表（12個）、7個のMermaid図解（`MermaidDiagram`）、TOCスクロール追従・モバイルドロワー・チェックリストカウンター（`TocObserver.tsx`）、全9項目の学習チェックリスト、全47件の参考文献・外部リンク安全属性（`target="_blank" rel="noopener noreferrer"`）、全幅レイアウトを完全再現。
  - グローバルナビゲーション（`web-next/lib/nav-taxonomy.ts`）に新グループ「推薦書籍」を新設し、トップレベルドロップダウンに追加。`components/site/SiteHeader.test.tsx` のドロップダウン数（5 → 6）および `tests/nav-derivation.test.ts` のグループ数（8 → 9）を同期更新。
  - 原本 `Generative-ai-for-software-development-guide.html` は `archive/html/books/Generative-ai-for-software-development-guide.html` へ退避保存。
  - 原本照合監査スクリプト `audit_source_parity.mjs` で exit code 0（漏れなし ✅）を確認。
  - `web-next/lib/page-registry.ts` に新規エントリ（`slug: "/books/generative-ai-for-software-development"`, `group: "推薦書籍"`）を登録。
  - 契約テスト17件（S-1〜S-4, C-1〜C-6, D-1, D-5, D-7, D-8, Q-1〜Q-3）を作成し、Vitest **175 files / 1600 tests** 全 Green ✅、typecheck ✅、Biome lint ✅ を確認。

- **月次価格更新 2026-09 & スクレイパーのフォールバック優先順位バグ修正** (HEAD `3af819c4`):
  - `pricing.json` が 2026-07-24 で約 7 週間停滞していたため、各社公式料金ページを実地調査して更新。
    **API モデル 56 → 77 件 / コーディングツール 31 → 33 件**、USD/JPY 163.47 → 154.04 (2026-09-11)。
  - **新モデル追加**: Claude Fable 5.1 / Opus 5 / Opus 4.5 / Sonnet 4.5、GPT-6 Astra / 5.5 Pro / 5.3 Codex /
    5.2 Pro / 5.2 / 5.1 / 5 Pro / 4.1 Nano、Gemini 3.8 Flash / 3.7 Flash / 3.1 Flash-Lite、
    Grok 4.6 / Grok Build 0.1、Kimi K2.7 Code / K2.7 Code Highspeed、GLM-5.3 / GLM-5.3-Flash、
    GitHub Copilot Max ($100) / ChatGPT Pro Codex ($100)。
  - **価格改定**: GPT-5.6 Sol $5/$30 → $4/$20、Terra $2.5/$15 → $2/$12、Luna $1/$6 → $0.2/$1.2、
    Gemini 3.6 Flash $1.5/$7.5 → $0.75/$3.75（2026-12-31 までの特価。note に明記）、
    Grok 4.20 $2/$6 → $1.25/$2.5、DeepSeek V4 Flash/Pro（標準価格を採用）、GLM-4.6 $0.43/$1.74 → $0.6/$2.2。
    Amazon Nova Premier の出力単価はライブ取得で $10 → $12.5 に更新。
  - **提供終了モデル**は行を残したまま `Retired` タグ + `tag-leg` へ降格（Gemini 3 Flash Preview /
    Grok 4.1 Fast / DeepSeek-V3.2 / DeepSeek-R1 / Claude Opus 4.1 / Claude Haiku 3.5）。
  - **バグ修正 1（フォールバック優先順位）**: 既存 `pricing.json` の値を出自を問わず `_FALLBACKS` より
    優先していたため、ハードコード値を書き換えても既存モデルの価格が永久に反映されない状態だった。
    既存値の採用条件に `scrape_status == "success"` を課し、`anthropic.py` の Claude Sonnet 5 個別ハックを削除。
    あわせて 5 provider の抽出ループが `_FALLBACKS` を直接読んでいた不整合を `fallback_map` 参照へ統一。
    **※この採用条件は後続の `provenance` 導入で置き換わっている（下記「現行の 2 層目判定ルール」を参照）。**
  - **現行の 2 層目判定ルール（`scraper/src/scraper/provenance.py` の `FallbackResolver`）**: `scrape_status` は
    「その実行でスクレイプが成功したか」しか表さず、2 回連続失敗で過去の成功値がハードコード値まで巻き戻るため、
    `ApiModel.provenance`（`origin` + 記録時点の `fallback_in` / `fallback_out`）を判定材料に加えた。採用条件は
    ① `provenance.origin == "scraped"` かつ記録時点のハードコード値が現在の `_FALLBACKS` と一致 → 既存値を採用、
    ② ハードコード値が改定されていれば **ハードコード値が勝つ**（月次の `_FALLBACKS` 更新が必ず反映される）、
    ③ `provenance` を持たない旧スキーマの JSON に限り従来どおり `scrape_status == "success"` を条件とする。
    つまり**持ち越される価格が常に `scrape_status == "success"` である必要はない**（前回失敗して `fallback` に
    落ちた行でも、`provenance` が成功時の出自を保持していれば採用される）。
  - **バグ修正 2（遠距離マッチ）**: GitHub Copilot の価格抽出ギャップが無制限だったため、Max ティア新設後に
    Pro / Pro+ の双方が特典クレジット `$100/month` を拾って `success` 判定され `pricing.json` が汚染された
    （ライブスクレイプで実測）。`_GAP = [^$\n]{0,80}?` で距離を制限。
  - **バグ修正 3（末尾改行）**: スクレイパー出力に末尾改行がなく `bun run lint` が pricing.json で落ちていたため
    生成側で付与。
  - 契約テストを scraper 側に 16 件追加（フォールバック優先順位 13 件 + Copilot 遠距離マッチ 3 件）。
    `web-next/` は `PriceProvenance` 型（`types/pricing.ts`）と対応する Zod スキーマ（`lib/pricing.ts`）、
    およびそのテスト（`lib/pricing.test.ts`）を追加・更新した一方、React コンポーネント・CSS は
    **変更していない**（UI は完全にデータ駆動のため）。

- **Gemini マルチエージェント開発 ベストプラクティス完全ガイド（/google/multi-agent-best-practices）の Next.js アプリ移行 & コードブロック構文ハイライト化**:
  - `Gemini-multi-agent-best-practices.html` を `web-next/app/google/multi-agent-best-practices/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。
  - 要約・省略一切なしで全16章（0. はじめに〜15. 参考文献・出典）、全56サブセクション（h3）、全表（12個）、全コードブロック（28個）、8個のMermaid図解（`MermaidDiagram`）、TOCスクロール追従・モバイルドロワー（`TocObserver.tsx`）、全7項目の実践チェックリスト、全7項目のセキュリティチェックリスト、全22件の参考文献・外部リンク安全属性（`target="_blank" rel="noopener noreferrer"`）、全幅レイアウトを完全再現。
  - **コードブロックの構文ハイライト & CopyButton 全件適用**: 全28個のコードブロック（markdown, json, gitignore, toml, python, bash, text）に対して `<CodeCopyButton text={...} />`、`<div className={styles.codeLine}>`、および Atom One Dark 準拠の構文トークンクラス（`.ck`, `.cs`, `.cc`, `.cv`, `.cf`, `.cn`, `.ct`, `.cp`, `.cm`）を適用。波括弧の JSX エスケープ（`{"{"}`, `{"}"}`）とインデント保護（`{"  "}`）を徹底。
  - 原本 `Gemini-multi-agent-best-practices.html` は `archive/html/google/Gemini-multi-agent-best-practices.html` へ退避保存。
  - 原本照合監査スクリプト `audit_source_parity.mjs` で exit code 0（漏れなし ✅）を確認。
  - `web-next/lib/page-registry.ts` に新規エントリ（`slug: "/google/multi-agent-best-practices"`）を登録し、グローバルナビゲーション（`components/site/nav-links.ts`）に自動導出。
  - 契約テスト20件（S-1〜S-4, C-1〜C-6, D-5〜D-8, Q-2〜Q-3）を作成し、Vitest **170 files / 1539 tests** 全 Green ✅、typecheck ✅、Biome lint ✅ を確認。

- **AI仕様駆動開発におけるMarkdownファイル実践ガイド（/codex/skill）の Pure JSX 完全置き換え移行**:
  - `Ai-spec-driven-development-markdown-best-practices.html` を `web-next/app/codex/skill/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。
  - 要約・省略一切なしで全15章（SDDとは何か〜参考文献）、全12サブセクション（h3）、全表（3個）、全コードブロック（4個：CopyButton & Atom One Dark シンタックスハイライト対応）、4個のMermaid図解（`MermaidDiagram`）、TOCスクロール追従・モバイルドロワー（`TocObserver.tsx`）、全12項目のチェックリスト、全33件の参考文献・外部リンク安全属性（`target="_blank" rel="noopener noreferrer"`）、callout（3個）を完全再現。
  - デザイン・スタイリングの完全再現: SiteHeader との重なりを解消する `position: sticky; top: var(--header-height, 60px); height: calc(100vh - var(--header-height, 60px));` のサイドバーレイアウト、Atom One Dark 配色の構文トークン（見出し `#e06c75`、属性 `#e06c75`、文字列 `#98c379`、ブレット `#61aeee`、コード `#56b6c2`、番号 `#d19a66`、メタ `#5c6370`）、参考文献リストの美しいタイポグラフィと URL ホバースタイルを完全適用。
  - 原本 `Ai-spec-driven-development-markdown-best-practices.html` は `archive/html/SDD/Ai-spec-driven-development-markdown-best-practices.html` へ退避保存。
  - 契約テスト21件（S-1〜S-4, C-1〜C-6, D-1〜D-8, Q-2〜Q-3）を作成し、Vitest **169 files / 1510 tests** 全 Green ✅、typecheck ✅、Biome lint ✅ を確認。

- **GitHub Copilot Code Review 実践ガイド（/code-review/copilot-code-review）の Pure JSX 完全置き換え移行**:
  - `Github-copilot-code-review-best-practices.html` を `web-next/app/code-review/copilot-code-review/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。
  - 要約・省略一切なしで全13セクション（はじめに〜参考文献・出典）、全15サブセクション（h3）、全8サブセクション（h4）、全表、全コードブロック、5個のMermaid図解（`MermaidDiagram`）、TOCスクロール追従（`TocObserver.tsx`）、全25件の参考文献・外部リンク安全属性（`target="_blank" rel="noopener noreferrer"`）、callout、チェックリストを完全再現。
  - 原本 `Github-copilot-code-review-best-practices.html` は `archive/html/Microsoft/Github-copilot-code-review-best-practices.html` へ退避保存。
  - 原本照合監査スクリプト `audit_source_parity.mjs` で exit code 0（漏れなし ✅）を確認。
  - 契約テスト16件および TocObserver テスト1件（計17件）を作成・更新し、Vitest **168 files / 1496 tests** 全 Green ✅、typecheck ✅、Biome lint ✅ を確認。

- **Next.js ガイドページ移行スキル（nextjs-page-migration）のブラッシュアップ & デザイン移行チェックリスト整備**:
  - 原本 HTML からの移行時に頻発していた「デザイン・CSS 移行漏れ」（サイドバー配色、コードブロック配色、全幅レイアウト、CDN リンク、リスト要素型、`pre code` リセット、テキスト・段落色）を根絶するため、スキル体系を大幅強化。
  - **新規リファレンス追加**:
    - `references/css-full-transfer-checklist.md`（343行）: 原本 `<style>` から `page.module.css` への 100% 完全転写手順、9 つのカテゴリ別チェックリスト（CSS 変数、レイアウト構造、タイポグラフィ、コードブロック 3 層構造、サイドバー、テーブル、callout、外部 CDN リソース、レスポンシブ）を策定。
  - **既存リファレンス・スキルの更新**:
    - `SKILL.md`: デザイン契約テスト D-5〜D-8（サイドバーナビ、`pre code` リセット、CDN リンク、レイアウトルート）を新設、スタイリング防犯原則テーブルの拡充、原本配色テーマ依存のコードハイライト手順を明文化。
    - `references/design-contract-tests.md`: D-5〜D-8 の DOM テスト実装パターンと `data-testid` 仕様を追加。
    - `references/implementation-reference.md`: `pre code` リセット、外部 CDN リンク直接配置、原本配色テーマ特定コマンド、原本 CSS → page.module.css 変換ルールを収録。
  - `.skills/`、`.claude/skills/`、`.agent/skills/`、`.gemini/skills/` の全シンボリックリンク・ハードリンクの参照整合性を確認。
  - テスト検証: Vitest **167 files / 1484 tests** 全 Green ✅。

- **GitHub Copilot AI仕様駆動開発 ベストプラクティスガイド（/copilot/markdown-file-guide）の Pure JSX 完全置き換え移行**:
  - `Copilot-spec-driven-development-best-practices.html` を `web-next/app/copilot/markdown-file-guide/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。
  - 要約・省略一切なしで全12セクション（全体像、Step 1〜Step 7、Spec Kitと仕様駆動開発、セキュリティ、成熟度モデル、参考文献）、全表、全コードブロック（1行毎 `codeLine` ラッパー & 構文トークン化）、8個のMermaid図解（`MermaidDiagram`）、TOCスクロール追従（`TocObserver.tsx`）、インタラクティブチェックリスト、全31件の参考文献・外部リンク安全属性（`target="_blank" rel="noopener noreferrer"`）を完全再現。
  - デザイン・スタイリングの完全再現: 原本通りの全幅展開（`max-width: none; width: 100%`）で右側余白を排除、サイドバー文字色（`--color-text-secondary: #a9b8cc` / ホバー・アクティブ `--color-text-primary: #e9edf5`）、Atom One Dark シンタックスカラー（見出し `#e06c75`、キーワード `#c678dd`、文字列 `#98c379`、コメント `#5c6370`、通常文字 `#abb2bf`）を完全一致。Tabler Icons Webfont（`@tabler/icons-webfont`）をロードして全アイコン（サイドバー、kicker、H2見出し、callout、参考文献見出し）を正確に表示。SiteHeader との重なりを解消する `position: sticky; top: var(--header-height, 60px); height: calc(100vh - var(--header-height, 60px));` のサイドバーレイアウトを適用。
  - 既存の旧 `/copilot/markdown-file-guide` 画面と完全入れ替え完了。原本 `Copilot-spec-driven-development-best-practices.html` は `archive/html/Microsoft/Copilot-spec-driven-development-best-practices.html` へ退避保存。
  - 原本照合監査スクリプト `audit_source_parity.mjs` を更新し、`<script class="mermaid-source">` の Mermaid ソース認識、JSON 波括弧の保護、URL エンティティデコードに対応。原本照合監査で exit code 0（漏れなし ✅）を確認。
  - 契約テスト18件（S-1〜S-4, C-1〜C-6, D-1〜D-2, Q-1〜Q-2）および TocObserver テスト3件（計21件）を作成・更新し、Vitest **167 files / 1484 tests** 全 Green ✅、typecheck ✅、Biome lint ✅ を確認。

- **GitHub Copilot 実践ベストプラクティスガイド（/copilot/github-copilot）の Pure JSX 完全置き換え移行**:
  - `Github-copilot-best-practices.html` を `web-next/app/copilot/github-copilot/page.tsx` に Pure JSX として 100% Faithful 完全移植 🚀。
  - 要約・省略一切なしで全17セクション（1.全体像〜17.参考文献）、全表、全コードブロック、11 Mermaid図解（`MermaidDiagram`）、TOCスクロール追従（`TocObserver.tsx`）、チェックリスト、全43件の参考文献・外部リンク安全属性（`target="_blank" rel="noopener noreferrer"`）を完全再現。
  - 既存の旧 `/copilot/github-copilot` 画面と完全入れ替え完了。原本 `Github-copilot-best-practices.html` は `archive/html/Microsoft/Github-copilot-best-practices.html` へ退避保存。
  - 原本照合監査スクリプト `audit_source_parity.mjs` を更新し、`<pre class="mermaid">` の Mermaid ソース認識および `<head>` 内リソース除外に対応。原本照合監査で exit code 0（漏れなし ✅）を確認。
  - 契約テスト12件および TocObserver テスト5件（計17件）を作成・更新し、Vitest **165 files / 1468 tests** 全 Green ✅、typecheck ✅、Biome lint ✅ を確認。

- **レビュー指摘の再検証 — エージェント案内・フォント公開順序・OpenClaw境界の明確化**:
  - `AGENTS.md`と`GEMINI.md`の検証コマンドをbunへ統一し、`GEMINI.md`の必読順を`CODEX.md`、`CLAUDE.md`、移行文書の順へ同期。
  - Noto Sans JP生成スクリプトの契約を、一時世代ディレクトリ作成、`await`付き全download、staged CSS/preload書き込みが現行世代の昇格より前に並ぶことを順序込み完全一致で検証する形へ強化。
  - OpenClawの`bootstrapMode=none`と通常のcontext injectionを分離し、embedded harnessとnative Codexのファイル別経路を図示。Fiuの不正返信0件は返信禁止指示下の限定結果であり、自由な外部送信の安全性を証明しないと明記。
  - サンドボックスではユーザー指定によりnpmを使用。Vitest **164 files / 1467 tests**、typecheck、lint（457 files / 0 diagnostics）、pytest **43件**がGreen。ユーザー指定によりbuildと目視確認は省略。

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

## 次回セッションでの再開・実行依頼プロンプト

```text
AGENTS.md → CODEX.md → CLAUDE.md → docs/PROGRESS.md → Phase A–F 計画の順で読む。
最新実装 HEAD: d8a8b268（Reliable Machine Learning ガイドのタイポグラフィ最適化・Mermaidコントラスト修復・共有クローム完全統合。移行 Red 908a6769 → Green 0170db70 → Refactor 927a9174、改善 Red b20dfcb1 → Green d8a8b268）
次の作業: /books/reliable-machine-learning の目視確認（ユーザー担当）。開発サーバーはポート3000/3001。
Mermaid図解12箇所（ライトテーマ・コントラスト保護）、300px固定常駐目次サイドバー、テーブルの左寄せ、チェックリスト（10項目）の進捗カウンター連動、白背景と調和した共通フッター、不透明ヘッダー・免責バナー、モバイル表示を確認する。
原本2形式（HTMLおよびMarkdown）はarchive/へ退避済み（SHA-256一致）。
HTML原本監査exit 0、対象26契約、全体Vitest 208 files / 2149 tests、typecheck・lint（0 diagnostics）が成功。
NODE_OPTIONS=--no-experimental-webstorage bun run test -- --maxWorkers=1 --testTimeout=30000 を使用する。
共有クロームの補正はglobals.cssへ集約。依存・設定・ロック・監査スクリプトは変更していない。
サンドボックスではnpmとビルドを実行しない。修正もRed → Green → Refactor → Docsの分離コミットを守る。
page.tsx 95件、registry 96エントリ（RSSを含む）。次ページは指示されてから扱う。
```

