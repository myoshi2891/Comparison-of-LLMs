---
paths:
  - "web-next/app/**/*.ts"
  - "web-next/app/**/*.tsx"
  - "web-next/components/**/*.ts"
  - "web-next/components/**/*.tsx"
  - "web-next/lib/**/*.ts"
  - "web-next/tests/**/*.test.ts"
  - "web-next/tests/**/*.test.tsx"
---

# TDD 必須サイクル & コミット分割ルール

(最終更新日: 2026-08-13)

プロジェクトの品質とトレーサビリティを担保するため、以下の TDD サイクルおよびコミット分割を**絶対的な強制ルール**として適用する。

## 核心原則

<ai_agent_directive>
**AI エージェントへの厳格な指示**:

1. **Red（テスト失敗）フェーズを経ないコード実装は「未完了」とみなす。** 実装コードを書く前に、必ず失敗するテストをコミットすること。
2. **一括コミットの禁止。** 「テスト + 実装 + ドキュメント」を一つのコミットにまとめることは重大な規約違反である。
3. **違反検知時は即時報告。** サイクルを飛ばしたことに気づいた場合、独断で `git reset` 等を実行せず、直ちにユーザーへ報告し、承認を得たうえでリカバリ手順を実施すること（詳細は「違反時の対応」を参照）。
4. **テストは「弱い契約」で書いてはならない。** 件数のみ・存在のみ・部分一致のみの検証は
   移行漏れを素通しするため、契約テストとして認めない（詳細は後述「テスト強度の下限」）。
5. **期待値を実装に合わせて書き換えてはならない。** テストが落ちたとき、正しいのは常に原本と仕様であり、
   実装ではない。期待値の変更が必要だと考えた場合は、独断で変更せずユーザーに根拠を提示して確認を取ること。
6. **`plans/NNN-*.md` に紐づく作業は、該当プランの Status 更新までを 1 サイクルに含める。** 実装内容に応じて `plans/README.md` の Status を必ず同期し、未完了の F-\* 項目が残る間は IN PROGRESS を維持すること。該当プランの全スコープが完了した場合のみ Status を完了状態（DONE 等）へ更新し、部分実装を完了扱いにしないこと（実装を終えても未完了の F-\* 項目が残るか、Status 行が TODO / IN PROGRESS のままなら、そのサイクルは未完了である）。
</ai_agent_directive>

## 必須ワークフロー

### ステップ 1: Red（テストの作成と失敗）

作業種別に応じて以下を選択する:

- **新機能の場合**: 実装する機能の仕様を反映したテストファイルを `web-next/` 内の該当するディレクトリか `web-next/tests/` 下に作成する。
- **バグ修正の場合**: 現在の不具合を再現する失敗テストを追加する。テストがパスしてしまう場合は再現条件を見直す。
  - **例外: CSS 視覚バグ**（配色崩壊・レイアウト崩壊等）はユニットテストで再現できない。
    この場合は**リファクタリング扱い**として既存テストが Green のままであることを確認し、
    Green コミット後に `web-next` ディレクトリから `bun run dev` を実行して行うブラウザ目視確認をもってバグ修正の完了とする。
    よくある CSS 視覚バグとその原因:
    - `bun run build` が通るのに全配色が崩壊 → `globals.css` に存在しない変数を `var()` 参照（`nextjs-page-migration/SKILL.md` §CSS地雷 参照）
    - スクロールでサイドバーが流れる → `position: sticky` 未設定
    - ハンバーガーメニューがデスクトップで表示 → `.sidebarToggle { display: none }` デフォルト未定義
- **機能改善の場合**: 期待する新しい振る舞いを記述した失敗テストを追加する。
- **リファクタリングのみの場合**: 既存テストをそのまま実行してすべてパスすることを確認する。新規テストの作成は不要。

- **実行**: `cd web-next && bun run test` または `make test-web` で失敗（またはコンパイルエラー）を確認する（リファクタリングはパスを確認）。
  **「失敗するはず」と推測してコミットしてはならない。実際に実行し、失敗出力を目で確認すること。**
  実装ファイルが未作成で import エラーになる状態も正当な Red である。
- **コミット（新機能・バグ修正・機能改善時）**: `test(<scope>): add failing spec for <feature-or-bug-id>`

#### テスト強度の下限（ガイドページ移行・保守で必須）

移行漏れ（原本のセクション・リスト項目・参考リンクの脱落）を検知できないテストは、
書いても品質を担保しない。以下を**契約テストとして認めない**。

```tsx
// ❌ 件数のみ — セクションを 1 つ落として別を重複させれば通る
expect(container.querySelectorAll("h2")).toHaveLength(11);
// ❌ 存在のみ — 1 個でも通る
expect(container.querySelectorAll("pre, code").length).toBeGreaterThan(0);
// ❌ 部分一致のみ — 本文が半分消えても通る
expect(container.textContent).toContain("Managed Agents");
```

```tsx
// ✅ 完全一致（順序込み）— 原本と同じものが同じ順に並ぶことを保証する
expect(Array.from(container.querySelectorAll("h2")).map(headingText))
  .toEqual([...EXPECTED_H2]);
```

`web-next/app/**/page.tsx` の新規作成・移行では、**最低 17 契約**
（原本照合 S-1〜S-4 / コンテンツ C-1〜C-6 / デザイン D-1〜D-4 / 品質 Q-1〜Q-3）を Red で用意する。
各契約の定義と実装例は `.claude/skills/nextjs-page-migration/SKILL.md` §5 Step 1 および
`.claude/skills/nextjs-page-migration/references/source-parity-audit.md` を参照。

### ステップ 2: Green（最小実装と成功）

- テストをパスさせるための最小限のコードを `web-next/app/` または `web-next/components/` 等に実装。
- **HTML/Markdown からのガイドページ移行時は、原本とのラインバイライン全件要素照合監査を厳格に実施してから Green コミットを行うこと。** 監査対象は、全セクション、全見出しレベル、全段落、全リスト項目、全コードブロック、全 SVG、全 callout/alert、全 table、全参考文献リンクとする。各対象の要素数と内容を原本と照合し、未エスケープ文字も静的スキャンすること。要約・省略・見出しの言い換えは即時規約違反となる。
- **この照合は目視ではなく監査スクリプトで機械実行し、終了コード 0 を Green の前提条件とする。**
  目視照合は 1,000 行超の原本では必ず見落としが出るため、実行証跡の残る機械照合を必須とする。

  ```bash
  bun .claude/skills/nextjs-page-migration/scripts/audit_source_parity.mjs \
    archive/html/<ベンダー>/<原本>.html \
    web-next/app/<provider>/<slug>/page.tsx
  echo "exit=$?"   # 0 以外なら移行漏れあり → Green コミット禁止
  ```

  漏れのうち「正当な差分」（原本の `目次` 見出しがサイドバー TOC に置き換わる等）と判断した項目は、
  **その理由を Green コミットのメッセージ本文または `docs/PROGRESS.md` に必ず書き残す**こと。
  無言で見逃すと、次回の監査で同じ判断を再現できない。判断の分類表は
  `.claude/skills/nextjs-page-migration/references/source-parity-audit.md` §1 を参照。
- **新規ページを追加した場合、`web-next/lib/page-registry.ts` への登録を含めて初めて Green とする。**
  レジストリは鮮度表示・What's New・sitemap・**ナビゲーション**の導出元であり、未登録のページは
  どこからも辿れない。`tests/page-registry-coverage.test.ts` と `tests/nav-derivation.test.ts` が
  登録漏れを機械検知するため、登録しない限りテストは Red のままになる。
- **実行**: `cd web-next && bun run test` でパスを確認。
- **コミット**: `feat(<scope>): <feature implementation summary>`

### ステップ 3: Refactor（リファクタリング・最適化）

- コードの重複削除、読みやすさの向上、ビルド/リンターエラーの修正。
- **実行**: `cd web-next && bun run build` および `cd web-next && bun run lint <変更したパス>` を実行し、問題がないことを確認。
  Biome はパス引数なしでの `lint:fix` を禁止しているため、必ず変更対象パスを指定する。
- **テスト数の後退を許さない**: `bun run test` の合計テスト数がベースライン（2026-08-13 実測で
  **163 files / 1454 tests**）を下回った場合、何かを壊しているか削除している。原因を特定するまで先へ進まない。
  **収集失敗（collect error）もブロッキング失敗として扱う。**
- **コミット**: `refactor(<scope>): <clean up or optimization>`

### ステップ 4: Docs Sync（進捗同期）

作業種別に応じて、該当する **(a)**・**(b)** をすべて適用する。ページ移行にレジストリ変更を伴う場合は両方を適用する。どちらにも当てはまらない場合（構造変更を伴わないバグ修正・スタイル微調整・ユーティリティの独立変更など）は本ステップを省略してよい。なお、ナビゲーションやレジストリのバグ修正など構造変更を伴う変更は(a)または(b)の対象として扱い、スタイル微調整や独立したユーティリティ変更のみ従来どおり対象外とする。

#### (a) ページ移行タスク

HTML → Next.js ページ移行（`web-next/app/` 下のページ新規作成・移行）の場合、`docs/PROGRESS.md` を更新する。判定基準：

- HTMLコンテンツをReactコンポーネントへ変換
- 既存ページのルーティング・ビジネスロジックをNext.js構成に合わせて変更
- 移行に伴うスタイル調整やアセットパス修正
- 新規 page.tsx 作成に伴う既存 page の削除/置換

など、`web-next/app/**/page.tsx` の新規作成または明確な移行に伴う編集が含まれる場合に適用。

- **更新対象**: `docs/PROGRESS.md`
- **コミット**: `chore(docs): update docs/PROGRESS.md — <page/feature name>`

#### (b) 構造変更タスク

ページ本体ではなく**サイトの構造・データモデル・共有スキーマ**を変更した場合。判定基準（いずれかに該当）：

- `web-next/lib/page-registry.ts` のスキーマまたはエントリの変更
- `web-next/components/site/nav-*`（ナビゲーション）の変更
- 複数ページから参照される共有スキーマ・共通コンポーネントの変更
- `plans/NNN-*.md` の F-* 項目に紐づく実装作業

これらは「どのページからも見える」変更であり、`docs/PROGRESS.md` だけでは追跡できない。

- **更新対象**: `docs/PROGRESS.md`（テスト数・HEAD）+ `plans/README.md`（該当プランの Status 行）+ `CLAUDE.md`（設計判断・アーキテクチャ）+ `GEMINI.md`（CLAUDE.mdへの委譲ポインタ・ルール同期）
- **コミット**: `chore(docs): sync spec files — <変更内容の要約>`

> 詳細な監査手順は `.claude/skills/docs-sync/SKILL.md` を参照（イベント C = ナビゲーション / レジストリ変更）。

## 除外事項

- 既存ファイルの誤字修正や、コードロジックに影響しないコメントの微修正のみ。
- ただし、ロジックに変更が生じた場合は、必ず既存のテストを更新または新しいテストを追加すること。

## 違反時の対応

万が一、このルールに違反（手順のスキップや一括コミットなど）したことに気づいた場合は、以下の手順を徹底すること：

1. **即座に報告**: ユーザーに対して、どの手順をスキップしたか、どのコミットが不適切であったかを直ちに報告する。
2. **勝手な修復の禁止**: ユーザーの承認を得る前に `git reset` や修正コミットを自律的に実行してはならない。
3. **リカバリ案の提示**: 正しい状態に戻すための手順（例：直近のコミットの取り消しと再実行）を提案し、承認を得てから実行する。
