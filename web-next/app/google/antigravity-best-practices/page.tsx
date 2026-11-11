import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import { findBySlug } from "@/lib/page-registry";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";
export const metadata: Metadata = {
  title: "Google Antigravity 最新ベストプラクティス完全ガイド(中級〜上級者向け)",
  description:
    "Google Antigravity の導入・権限設計・AGENTS.md・スキル・検証ループ・並列実行・自動化・CLI・SDK・セキュリティ・コスト管理を学ぶ中級〜上級ガイド。情報基準日2026-11-06。",
};
const DIAGRAM_0 =
  'flowchart TB\n  A["Antigravity エージェント本体 (共通ハーネス)"] --> B["App (デスクトップ)"]\n  A --> C["CLI (agy)"]\n  A --> D["SDK (Python)"]\n  A --> E["IDE (VS Code系)"]\n  B --> F["Remote Control (ブラウザから遠隔操作)"]\n  C --> F\n  B --> G["Remote Agents (Google管理の隔離環境)"]\n  C --> G\n  B <--> H["設定・権限・プラグインを共有"]\n  C <--> H';
const DIAGRAM_1 =
  'flowchart TB\n  A["タスクの難易度は?"] --> B{"設計判断や原因不明のバグを含むか?"}\n  B -- "はい" --> C["Argon または Opus (High)"]\n  B -- "いいえ" --> D{"成果物はテストで機械的に検証できるか?"}\n  D -- "はい" --> E["Flash (Medium) + 検証ループ"]\n  D -- "いいえ" --> F["Flash (High) もしくは Pro 系 + 人間レビュー強化"]\n  C --> G["サブエージェントは flash を明示指定"]\n  E --> G\n  F --> G';
const DIAGRAM_2 =
  'flowchart TB\n  A["エージェントの操作 action(target)"] --> B{"Deny に一致?"}\n  B -- "はい" --> B1["即ブロック"]\n  B -- "いいえ" --> C{"Ask に一致?"}\n  C -- "はい" --> C1["ユーザーに承認を求める"]\n  C -- "いいえ" --> D{"Allow に一致?"}\n  D -- "はい" --> D1["確認なしで実行"]\n  D -- "いいえ" --> E["プリセット / モードの既定動作にフォールバック"]';
const DIAGRAM_3 =
  'flowchart TB\n  A["作業の前提を確認"] --> B{"未知のリポジトリ / 外部入力 / 本番に近い資格情報を扱う?"}\n  B -- "はい" --> C["隔離 VM を使うか、サンドボックスを有効に保つ<br/>Request Review + 厳しめの Deny<br/>コマンドを確認してから承認"]\n  B -- "いいえ" --> D{"自分が管理するリポジトリで反復作業?"}\n  D -- "はい" --> E["Auto (使える場合) または Default"]\n  D -- "いいえ" --> F["Default"]\n  C --> G["Turbo は使わない"]\n  E --> G\n  F --> G';
const DIAGRAM_4 =
  'flowchart TB\n  A["エージェントに覚えさせたいこと"] --> B{"常に守る制約・不変条件か?"}\n  B -- "はい" --> C{"ほぼ毎ターン必要か?"}\n  C -- "はい" --> C1["AGENTS.md (常時有効)"]\n  C -- "いいえ" --> C2["rules/*.md (model_decision / glob / manual)"]\n  B -- "いいえ" --> D{"複数手順のワークフローか?"}\n  D -- "はい" --> D1["skill (SKILL.md)"]\n  D -- "いいえ" --> E["プロンプトで都度指示"]';
const DIAGRAM_5 =
  'flowchart TB\n  S["依頼の受領"] --> Q{"要件は明確か?"}\n  Q -- "いいえ" --> G["/plan /grill-me で1問ずつ詰める<br/>(plan を有効にしてから質問を始める)"]\n  Q -- "はい" --> P["/plan で探索と計画を作成"]\n  G -- "回答をもとに計画を作成" --> R\n  P --> R{"計画をレビューして承認?"}\n  R -- "修正が必要" --> P\n  R -- "承認" --> X["実装"]\n  X --> V["検証コマンドを実行"]\n  V --> T{"成功したか?"}\n  T -- "失敗" --> X\n  T -- "成功" --> H["差分レビュー (/diff または Review ペイン)"]\n  H --> D["コミット / PR"]';
const DIAGRAM_6 =
  'flowchart TB\n  A["メインエージェント (計画・調整)"] --> B["実装サブエージェント (branch: 隔離worktree)"]\n  B --> D["実装完了を親へ報告"]\n  D --> G["親が実装worktreeの変更を親ワークスペースへ取り込む"]\n  G --> C["検証サブエージェント (code-auditor・読み取り中心)"]\n  C --> E{"問題あり?"}\n  E -- "はい" --> B\n  E -- "いいえ" --> F["親が結果を統合して人間に報告"]';
const DIAGRAM_7 =
  'flowchart TB\n  A["タスク"] --> B{"要件は曖昧か?"}\n  B -- "はい" --> C["/grill-me"]\n  B -- "いいえ" --> D{"完了を機械判定できるか?"}\n  C --> D\n  D -- "はい" --> E{"規模は大きいか?"}\n  D -- "いいえ" --> F["/plan + 人間が逐次レビュー"]\n  E -- "小〜中" --> G["/goal (完了条件と中断条件を明記)"]\n  E -- "大 (複数マイルストーン)" --> H["/teamwork (有料プラン)"]\n  G --> I{"難しい不具合で行き詰まった?"}\n  I -- "はい" --> J["/boost"]';
const DIAGRAM_8 =
  'flowchart TB\n  A["Automations (定期起動)"] --> B["トリアージ skill"]\n  B --> C["隔離 worktree"]\n  C --> D["実装 subagent"]\n  D --> E["検証 subagent (別コンテキスト)"]\n  E --> F{"テスト・基準を満たす?"}\n  F -- "いいえ" --> D\n  F -- "はい" --> G["人間のゲート (外側ループ)"]\n  G --> H["コミット / PR"]';
const DIAGRAM_9 =
  'flowchart TB\n  A["作業の性質"] --> B{"社内ネットワークやローカル資格情報が必要?"}\n  B -- "はい" --> C["Remote Control (ローカル実行を遠隔操作)"]\n  B -- "いいえ" --> D{"コードや資料を外部の管理環境に置いてよい?"}\n  D -- "はい" --> E["Remote Agents (PCを閉じても継続)"]\n  D -- "いいえ" --> C';
const DIAGRAM_10 =
  'flowchart LR\n  A["機密データへのアクセス (.env, ソースコード)"] --> D["情報漏えいが成立"]\n  B["信頼できない入力 (Webページ, README, MCP, 依存コード)"] --> D\n  C["外部への通信手段 (ブラウザ, curl, 画像URL)"] --> D\n  D --> E["対策: どれか1本を確実に断つ"]';
const THEME_VARS = {
  fontSize: "16px",
  fontFamily: '"Noto Sans JP",sans-serif',
  primaryColor: "#e8ebf8",
  primaryTextColor: "#1f2430",
  primaryBorderColor: "#33428f",
  lineColor: "#4a5160",
  secondaryColor: "#f7f1e3",
  tertiaryColor: "#fff",
} as const;
/** 原本のAntigravityガイド全文と図解、目次、公開・確認日を描画する。 */
export default function AntigravityBestPracticesPage() {
  const entry = findBySlug("/google/antigravity-best-practices");
  return (
    <div id="antigravity-guide" className={styles.root}>
      <TocObserver />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Source+Serif+4:wght@600;700&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.0/build/styles/atom-one-dark.min.css"
        integrity="sha384-oaMLBGEzBOJx3UHwac0cVndtX5fxGQIfnAeFZ35RTgqPcYlbprH9o9PUV/F8Le07"
        crossOrigin="anonymous"
      />
      <button
        id="antigravity-backdrop"
        className={styles.scrim}
        type="button"
        aria-label="目次を閉じる"
        tabIndex={-1}
      />
      <div className={styles.layout} data-testid="layout-root">
        {" "}
        <nav
          className={styles.sidebar}
          id="antigravity-sidebar"
          aria-label="ページ内ナビゲーション"
          data-testid="sidebar-nav"
        >
          {" "}
          <div className={styles.brand}>
            {"Google Antigravity"}
            <br />
            {"ベストプラクティス"}
          </div>{" "}
          <a
            className={[styles["nav-a"], styles.active].join(" ")}
            href="#s0"
            data-t="s0"
            aria-current="location"
            data-testid="sidebar-nav-link"
          >
            {"0. このガイドの読み方"}
          </a>
          <a className={styles["nav-a"]} href="#s1" data-t="s1" data-testid="sidebar-nav-link">
            {"1. 全体像: Antigravityは何が違うのか"}
          </a>
          <a className={styles["nav-a"]} href="#s2" data-t="s2" data-testid="sidebar-nav-link">
            {"2. 直近の動向(2026年10〜11月)"}
          </a>
          <a className={styles["nav-a"]} href="#s3" data-t="s3" data-testid="sidebar-nav-link">
            {"3. モデルと思考レベルの選び方"}
          </a>
          <a className={styles["nav-a"]} href="#s4" data-t="s4" data-testid="sidebar-nav-link">
            {"Step 1: 導入・認証・初期設定"}
          </a>
          <a className={styles["nav-a"]} href="#s5" data-t="s5" data-testid="sidebar-nav-link">
            {"Step 2: プロジェクトと権限設計(最重要)"}
          </a>
          <a className={styles["nav-a"]} href="#s6" data-t="s6" data-testid="sidebar-nav-link">
            {"Step 3: ルール(AGENTS.md)の設計"}
          </a>
          <a className={styles["nav-a"]} href="#s7" data-t="s7" data-testid="sidebar-nav-link">
            {"Step 4: スキルで「手順」を資産化する"}
          </a>
          <a className={styles["nav-a"]} href="#s8" data-t="s8" data-testid="sidebar-nav-link">
            {"Step 5: 探索 → 計画 → 実行(/grill-me と /plan)"}
          </a>
          <a className={styles["nav-a"]} href="#s9" data-t="s9" data-testid="sidebar-nav-link">
            {"Step 6: 検証ループを先に作る"}
          </a>
          <a className={styles["nav-a"]} href="#s10" data-t="s10" data-testid="sidebar-nav-link">
            {"Step 7: サブエージェントと並列実行"}
          </a>
          <a className={styles["nav-a"]} href="#s11" data-t="s11" data-testid="sidebar-nav-link">
            {"Step 8: /goal・/boost・/teamwork の使い分け"}
          </a>
          <a className={styles["nav-a"]} href="#s12" data-t="s12" data-testid="sidebar-nav-link">
            {"Step 9: Automations と /schedule"}
          </a>
          <a className={styles["nav-a"]} href="#s13" data-t="s13" data-testid="sidebar-nav-link">
            {"Step 10: MCP・プラグイン・フック"}
          </a>
          <a className={styles["nav-a"]} href="#s14" data-t="s14" data-testid="sidebar-nav-link">
            {"Step 11: Remote Control・Remote Agents・Voice mode"}
          </a>
          <a className={styles["nav-a"]} href="#s15" data-t="s15" data-testid="sidebar-nav-link">
            {"Step 12: レビューとアーティファクト"}
          </a>
          <a className={styles["nav-a"]} href="#s16" data-t="s16" data-testid="sidebar-nav-link">
            {"Step 13: CLI運用(セッション管理・ヘッドレス・CI)"}
          </a>
          <a className={styles["nav-a"]} href="#s17" data-t="s17" data-testid="sidebar-nav-link">
            {"Step 14: SDKで独自エージェントを作る"}
          </a>
          <a className={styles["nav-a"]} href="#s18" data-t="s18" data-testid="sidebar-nav-link">
            {"Step 15: セキュリティ硬化"}
          </a>
          <a className={styles["nav-a"]} href="#s19" data-t="s19" data-testid="sidebar-nav-link">
            {"Step 16: クォータ・コスト管理"}
          </a>
          <a className={styles["nav-a"]} href="#s20" data-t="s20" data-testid="sidebar-nav-link">
            {"アンチパターン集"}
          </a>
          <a className={styles["nav-a"]} href="#s21" data-t="s21" data-testid="sidebar-nav-link">
            {"トラブルシューティング"}
          </a>
          <a className={styles["nav-a"]} href="#s22" data-t="s22" data-testid="sidebar-nav-link">
            {"導入ロードマップ(4週間)"}
          </a>
          <a className={styles["nav-a"]} href="#s23" data-t="s23" data-testid="sidebar-nav-link">
            {"付録A: クイックリファレンス"}
          </a>
          <a className={styles["nav-a"]} href="#s24" data-t="s24" data-testid="sidebar-nav-link">
            {"補足: 著名開発者の知見に基づく追加ベストプラクティス"}
          </a>
          <a className={styles["nav-a"]} href="#s25" data-t="s25" data-testid="sidebar-nav-link">
            {"参考URL一覧(根拠ソース)"}
          </a>
          <a className={styles["nav-a"]} href="#s26" data-t="s26" data-testid="sidebar-nav-link">
            {"注意事項と今後の確認事項"}
          </a>{" "}
        </nav>{" "}
        <div className={styles.main}>
          <div className={styles["mobile-bar"]} id="antigravity-mobile-bar">
            {" "}
            <button
              id="antigravity-menu"
              type="button"
              aria-label="目次を開く"
              aria-expanded="false"
              aria-controls="antigravity-sidebar"
            >
              {"☰ メニュー"}
            </button>
            <span>{"Antigravity ガイド"}</span>{" "}
          </div>
          <div data-guide-content>
            <header className={styles.hero}>
              <div className={styles.heroDates} data-testid="hero-dates">
                <span>
                  最終確認日: <time dateTime={entry?.lastReviewed}>{entry?.lastReviewed}</time>
                </span>
                <span>
                  公開日: <time dateTime={entry?.addedAt}>{entry?.addedAt}</time>
                </span>
              </div>{" "}
              <h1>{"Google Antigravity 最新ベストプラクティス完全ガイド(中級〜上級者向け)"}</h1>{" "}
              <p>
                {" "}
                <strong>{"情報基準日: 2026-11-06"}</strong>
                {
                  "(App v2.29.0 / CLI v1.4.12 時点の公式ドキュメント・公式ブログ・著名開発者の投稿を調査) "
                }
              </p>{" "}
              <p>
                {
                  " 対象読者: すでにAIコーディングエージェントを使った経験があり、Antigravityを「実務で壊れず、速く、安全に」使い込みたいエンジニア "
                }
              </p>{" "}
              <p>
                {
                  " 構成: 全体像 → ステップバイステップ実践(Step 1〜16) → アンチパターン → 導入ロードマップ → 補足ベストプラクティスと根拠URL "
                }
              </p>{" "}
            </header>
            <section className={styles.section} id="s0">
              {" "}
              <h2 id="s0-heading">{"0. このガイドの読み方"}</h2>{" "}
              <h3 id="antigravity-h81">{"0.1 根拠タグの凡例"}</h3>{" "}
              <p>{"本文の各記述には、根拠の強さを示すタグを付けています。"}</p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"タグ"}</th>
                      <th>{"意味"}</th>
                      <th>{"信頼度の扱い"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {" "}
                        <strong>
                          <span className={[styles.tag, styles["t-official"]].join(" ")}>
                            {"公式"}
                          </span>
                        </strong>{" "}
                      </td>
                      <td>
                        {" "}
                        <code>{"antigravity.google"}</code>
                        {" の公式ドキュメント・公式ブログ・公式GitHubに基づく事実 "}
                      </td>
                      <td>{"仕様として扱える(ただし更新が速いので再確認推奨)"}</td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <strong>
                          <span className={[styles.tag, styles["t-dev"]].join(" ")}>
                            {"開発者"}
                          </span>
                        </strong>{" "}
                      </td>
                      <td>
                        {
                          " Addy Osmani、Simon Willison、Johann Rehberger など著名開発者・研究者の投稿に基づく知見 "
                        }
                      </td>
                      <td>{"設計思想・リスク判断の根拠として扱う"}</td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <strong>
                          <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                        </strong>{" "}
                      </td>
                      <td>{"技術メディア・解説記事・コミュニティの報告"}</td>
                      <td>{"参考情報。公式で裏取りできるまで断定しない"}</td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <strong>
                          <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                            {"筆者推奨"}
                          </span>
                        </strong>{" "}
                      </td>
                      <td>{"上記の事実から導いた運用上の推奨(筆者の判断)"}</td>
                      <td>{"自分の環境で検証してから採用する"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h82">
                {"0.2 「Antigravity」という名称の整理(混乱しやすいポイント)"}
              </h3>{" "}
              <p>
                {"2026年5月の「Antigravity 2.0」以降、名称が複数の製品面を指すようになりました。"}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"呼称"}</th>
                      <th>{"実体"}</th>
                      <th>{"備考"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{"Antigravity App"}</strong>
                        {"(2.0)"}
                      </td>
                      <td>
                        {"スタンドアロンのデスクトップアプリ。エージェントの起動・監視・調整の中核"}
                      </td>
                      <td>
                        {" Windows / macOS / Linux 対応 "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>
                          {"二次"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>
                          {"Antigravity CLI("}
                          <code>{"agy"}</code>
                          {")"}
                        </strong>
                      </td>
                      <td>{"Go製のターミナル版。Gemini CLI(コンシューマー向け)の後継"}</td>
                      <td>
                        {
                          " 2026-06-18 に、個人のGoogleアカウントでログインするGemini CLI利用(無料枠とGoogle AI Pro / Ultra)が終了。Gemini APIキーの認証(従量課金)と、Gemini Code Assist Standard / Enterpriseのライセンスは引き続き使えるので、個人でもAPIキーで使う場合は移行は必須ではない "
                        }
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>
                          {"開発者"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Antigravity IDE"}</strong>
                      </td>
                      <td>
                        {"旧「Antigravity 1.0」(VS Code系エディタ)を別製品として再提供したもの"}
                      </td>
                      <td>
                        {
                          " 版番号は 2.0.1 から再開。2026-10時点で企業向けは非対応、最新リリースは2026-08 "
                        }
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>
                          {"二次"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"IDE Extensions"}</strong>
                      </td>
                      <td>
                        {
                          " VS Code / Visual Studio / JetBrains / Zed / Xcode / Eclipse 向け拡張、ACP経由のその他エディタ "
                        }
                      </td>
                      <td>
                        {" Eclipse拡張は初回リリースが直近 "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>
                          {"二次"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Antigravity SDK"}</strong>
                      </td>
                      <td>{"Pythonで独自エージェントを作るためのSDK(研究プレビュー扱い)"}</td>
                      <td>
                        {" "}
                        <code>{"pip install google-antigravity"}</code>{" "}
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>
                          {"二次"}
                        </span>{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>
                  {" このガイドは「App と CLI が同じエージェントを動かす」"}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {" 前提で、"}
                  <strong>{"App + CLI を主軸"}</strong>
                  {
                    "に解説します。IDEは旧来のエディタ中心の作業に限定して考えると整理しやすくなります。 "
                  }
                </p>{" "}
              </blockquote>{" "}
            </section>
            <section className={styles.section} id="s1">
              {" "}
              <h2 id="s1-heading">{"1. 全体像: Antigravityは何が違うのか"}</h2>{" "}
              <h3 id="antigravity-h83">{"1.1 沿革(要点)"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"時期"}</th>
                      <th>{"出来事"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"2025-11-18"}</td>
                      <td>
                        {
                          " Gemini 3 と同日に公開。VS Code系のエージェント中心IDEとして無料プレビュー開始 "
                        }
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                        {" Wikipedia / TechCrunch"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"2025-12"}</td>
                      <td>{"Pro / Ultra のレート制限引き上げ、無料ユーザーは週次制限へ"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                        {" Wikipedia"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"2026-01〜03"}</td>
                      <td>
                        {
                          " エージェントのターミナルコマンドをサンドボックスで実行するオプションを追加(macOS / Linux) "
                        }
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                        {" Wikipedia"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"2026-05-19"}</td>
                      <td>
                        {" "}
                        <strong>{"Antigravity 2.0"}</strong>
                        {
                          "(Google I/O)。デスクトップApp・CLI・SDKを発表。サブエージェントとスケジュール実行、音声コマンドを追加 "
                        }
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                        {" TechCrunch / TNW"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"2026-06-18"}</td>
                      <td>
                        {
                          " 個人のGoogleアカウントでログインするGemini CLI利用が終了し、Antigravity CLIへ移行(APIキー認証は継続) "
                        }
                      </td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>
                          {"開発者"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"2026-09"}</td>
                      <td>
                        {
                          " SDKでローカルモデル対応、サブエージェント別モデル指定、scheduleツールを標準有効化(Python SDK 0.1.18) "
                        }
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        {" GitHub"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"2026-10-13"}</td>
                      <td>
                        <strong>{"Gemini 4 Argon"}</strong>
                        {" をApp / CLIへ展開(Pro・Ultra向け)"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        {" ブログ"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"2026-11-03"}</td>
                      <td>
                        {" "}
                        <strong>{"App v2.29.0"}</strong>
                        {": Voice mode、Remote Agents、Automations再設計、Jupyterビューア "}
                      </td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>
                          {"二次"}
                        </span>{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h84">{"1.2 設計思想: 「エージェント・ファースト」"}</h3>{" "}
              <p>
                {" 従来のAIコーディング支援(補完・チャット)との最大の違いは、"}
                <strong>{"人間の役割がタイピングから「委任・監督・検証」へ移る"}</strong>
                {"点です。 "}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"観点"}</th>
                      <th>{"従来のIDE内アシスタント"}</th>
                      <th>{"Antigravity"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"主役"}</td>
                      <td>{"人間のエディタ操作"}</td>
                      <td>{"エージェント(複数並列)"}</td>
                    </tr>
                    <tr>
                      <td>{"成果物"}</td>
                      <td>{"コード差分"}</td>
                      <td>
                        {" コード + "}
                        <strong>{"アーティファクト"}</strong>
                        {"(計画・スクリーンショット・ブラウザ録画など) "}
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>
                          {"二次"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"実行環境"}</td>
                      <td>{"エディタ内"}</td>
                      <td>{"ターミナル・ブラウザ・サンドボックス・リモート環境"}</td>
                    </tr>
                    <tr>
                      <td>{"拡張"}</td>
                      <td>{"設定・拡張機能"}</td>
                      <td>
                        {" ルール / スキル / サブエージェント / MCP / プラグイン / フック "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"無人実行"}</td>
                      <td>{"基本なし"}</td>
                      <td>
                        {" Automations・"}
                        <code>{"/schedule"}</code>
                        {"・Remote Agents "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h85">{"1.3 製品面の関係図"}</h3>{" "}
              <div className={styles["diagram-wrap"]}>
                {" "}
                <div
                  className={styles["diagram-canvas"]}
                  data-diagram-id="d0"
                  role="img"
                  aria-label="フローチャート"
                >
                  <MermaidDiagram chart={DIAGRAM_0} theme="base" themeVariables={THEME_VARS} />
                </div>{" "}
              </div>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  </strong>
                  {
                    " App と CLI は同じエージェントを動かし、設定と権限が双方向に同期されます。CLIのセッションはAppへエクスポートして続行できます。 "
                  }
                  <strong>
                    <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                  </strong>
                  {
                    " Simon Willison は、SDKが「オープンソースのPythonラッパー + 同梱のクローズドなGoバイナリ」である点、CLIがクローズドソースである点を指摘しています(2026-05-20)。"
                  }
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>
                  {" 長期運用では、ベンダー依存の度合いを意識して設計してください。 "}
                </p>{" "}
              </blockquote>{" "}
            </section>
            <section className={styles.section} id="s2">
              {" "}
              <h2 id="s2-heading">{"2. 直近の動向(2026年10〜11月)"}</h2>{" "}
              <h3 id="antigravity-h86">{"2.1 最新アップデートの要点"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"日付"}</th>
                      <th>{"版"}</th>
                      <th>{"内容"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"2026-11-03"}</td>
                      <td>{"App v2.29.0"}</td>
                      <td>
                        {" "}
                        <strong>{"Voice mode"}</strong>
                        {"(Gemini Live)、"}
                        <strong>{"Remote Agents"}</strong>
                        {
                          "(Pro / Ultra、段階的展開)、Automationsページ再設計、Jupyter notebookビューア、組み込みブラウザの履歴とダウンロード "
                        }
                      </td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>
                          {"二次"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"2026-11-02前後"}</td>
                      <td>{"App v2.28.2"}</td>
                      <td>
                        {
                          " プラグインMarketplaceにパートナー製(Figma、Linear、Notion、Stripe など)を追加、プラグイン追加直後のサインイン "
                        }
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                        {" Releasebot"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"2026-10〜11"}</td>
                      <td>{"App v2.26.0"}</td>
                      <td>
                        {
                          " 通知設定、質問・権限プロンプトを入力欄の上に固定、会話の並べ替え・絞り込み "
                        }
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                        {" Releasebot"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"2026-11-03前後"}</td>
                      <td>{"CLI v1.4.12"}</td>
                      <td>
                        {"プラグインAPIキープロバイダー(任意)、Markdown表のストリーミング表示改善"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"2026-10-13"}</td>
                      <td>{"Gemini 4 Argon 展開"}</td>
                      <td>{"Pro / Ultra向けにApp・CLIで利用可能"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"2026-11-18(予定)"}</td>
                      <td>{"旧モデル削除"}</td>
                      <td>{"Claude Sonnet 4.6 / Opus 4.6、GPT-OSS-120b が削除予定"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>
                  {
                    " Voice mode と Remote Agents は「段階的展開」のため、自分のアカウントでは未表示の可能性があります。まず設定画面と最新版への更新を確認してください。 "
                  }
                </p>{" "}
              </blockquote>{" "}
              <h3 id="antigravity-h87">{"2.2 Gemini 4 Argon の社内実績(公式ブログ)"}</h3>{" "}
              <p>
                {
                  " 公式ブログによれば、Alphabet内でArgon搭載のAntigravityを使った結果、4週間でエージェント生成コードが35%増え、投稿後ロールバックが30%減ったと報告されています "
                }
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {
                  "。また、134件の古いバグ報告のうち97件を3時間未満でクローズした事例が紹介されています "
                }
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>
                  {
                    " これらは提供元の自己報告です。自社環境へそのまま当てはめず、Step 6(検証ループ)で自分の指標を取ってから拡大してください。 "
                  }
                </p>{" "}
              </blockquote>{" "}
            </section>
            <section className={styles.section} id="s3">
              {" "}
              <h2 id="s3-heading">{"3. モデルと思考レベルの選び方"}</h2>{" "}
              <h3 id="antigravity-h88">
                {"3.1 利用できるモデル(2026-11-06時点・公式ドキュメント)"}
              </h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"モデル"}</th>
                      <th style={{ textAlign: "center" }}>{"Free / Plus"}</th>
                      <th style={{ textAlign: "center" }}>{"Pro"}</th>
                      <th style={{ textAlign: "center" }}>{"Ultra"}</th>
                      <th style={{ textAlign: "center" }}>{"Enterprise"}</th>
                      <th>{"備考"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"Gemini 4 Argon"}</td>
                      <td style={{ textAlign: "center" }}>{"不可"}</td>
                      <td style={{ textAlign: "center" }}>
                        {"有料Pro、または対象プレミアムデバイスの試用"}
                      </td>
                      <td style={{ textAlign: "center" }}>{"可"}</td>
                      <td style={{ textAlign: "center" }}>{"可"}</td>
                      <td>{"最上位。Low / Medium / High"}</td>
                    </tr>
                    <tr>
                      <td>{"Gemini 3.8 Flash"}</td>
                      <td style={{ textAlign: "center" }}>{"可"}</td>
                      <td style={{ textAlign: "center" }}>{"可"}</td>
                      <td style={{ textAlign: "center" }}>{"可"}</td>
                      <td style={{ textAlign: "center" }}>{"可"}</td>
                      <td>{"標準の常用モデル"}</td>
                    </tr>
                    <tr>
                      <td>{"Gemini 3.7 Flash / 3.6 Flash"}</td>
                      <td style={{ textAlign: "center" }}>{"不可"}</td>
                      <td style={{ textAlign: "center" }}>{"不可"}</td>
                      <td style={{ textAlign: "center" }}>{"不可"}</td>
                      <td style={{ textAlign: "center" }}>{"可"}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>{"Gemini 3.1 Pro"}</td>
                      <td style={{ textAlign: "center" }}>{"不可"}</td>
                      <td style={{ textAlign: "center" }}>{"不可"}</td>
                      <td style={{ textAlign: "center" }}>{"不可"}</td>
                      <td style={{ textAlign: "center" }}>{"可"}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>{"Claude Sonnet 5.5 / Opus 5.5 (Thinking)"}</td>
                      <td style={{ textAlign: "center" }}>{"不可"}</td>
                      <td style={{ textAlign: "center" }}>{"有料Proのみ"}</td>
                      <td style={{ textAlign: "center" }}>{"可"}</td>
                      <td style={{ textAlign: "center" }}>{"可"}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>{"Claude Sonnet 4.6 / Opus 4.6 (Thinking)"}</td>
                      <td style={{ textAlign: "center" }}>{"可"}</td>
                      <td style={{ textAlign: "center" }}>{"可"}</td>
                      <td style={{ textAlign: "center" }}>{"不可"}</td>
                      <td style={{ textAlign: "center" }}>{"不可"}</td>
                      <td>
                        <strong>{"2026-11-18 に削除予定"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{"GPT-OSS-120b"}</td>
                      <td style={{ textAlign: "center" }}>{"可"}</td>
                      <td style={{ textAlign: "center" }}>{"可"}</td>
                      <td style={{ textAlign: "center" }}>{"可"}</td>
                      <td style={{ textAlign: "center" }}>{"不可"}</td>
                      <td>
                        <strong>{"2026-11-18 に削除予定"}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" 出典: "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>{" "}
                <code>{"https://antigravity.google/docs/models/"}</code>
                {
                  " 補足: 画像生成(UIモックアップや図の生成など)には別モデル(Nano Banana 2)が内部的に使われ、選択はできません "
                }
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <h3 id="antigravity-h89">{"3.2 思考レベルとモデルの使い分け"}</h3>{" "}
              <p>
                {
                  " 公式ドキュメントでは、思考レベル(Low / Medium / High)で「素早い小編集」と「深い多段推論(設計・デバッグ)」のバランスを取るとされています "
                }
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"作業の種類"}</th>
                      <th>{"推奨モデル"}</th>
                      <th>{"思考レベル"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"小さな修正・命名・フォーマット"}</td>
                      <td>{"Gemini 3.8 Flash"}</td>
                      <td>{"Low"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"通常の機能実装・テスト追加"}</td>
                      <td>{"Gemini 3.8 Flash"}</td>
                      <td>{"Medium"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"並行バグ・アーキテクチャ設計・難しいデバッグ"}</td>
                      <td>{"Gemini 4 Argon / Claude Opus 5.5"}</td>
                      <td>{"High"}</td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        {"の思考レベル説明に基づく "}
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"セキュリティ監査・大規模レビュー"}</td>
                      <td>{"Gemini 4 Argon"}</td>
                      <td>{"High"}</td>
                      <td>
                        {"公式ブログの監査事例 "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"大量の定型タスク(サブエージェント、Automationsの一次処理)"}</td>
                      <td>{"Flash系"}</td>
                      <td>{"Low〜Medium"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h90">{"3.3 モデル選択フロー"}</h3>{" "}
              <div className={styles["diagram-wrap"]}>
                {" "}
                <div
                  className={styles["diagram-canvas"]}
                  data-diagram-id="d1"
                  role="img"
                  aria-label="フローチャート"
                >
                  <MermaidDiagram chart={DIAGRAM_1} theme="base" themeVariables={THEME_VARS} />
                </div>{" "}
              </div>{" "}
              <h3 id="antigravity-h91">{"3.4 モデルを切り替えるときの注意"}</h3>{" "}
              <ul>
                {" "}
                <li>
                  {" 会話中にモデルを変えても、"}
                  <strong>{"実行中のターンは前のモデルで完走"}</strong>
                  {"します "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" Gemini系とClaude / GPT系では"}
                  <strong>{"クォータ(週次・5時間枠)が別バケット"}</strong>
                  {"で表示されます "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。片方が尽きても、もう片方で続行できます。 "}
                </li>{" "}
                <li>
                  {
                    " Automationsは、モデル階層(Flash Lite / Flash(既定)/ Pro)を自動化ごとに選べます "
                  }
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
              </ul>{" "}
            </section>
            <section className={styles.section} id="s4">
              {" "}
              <h2 id="s4-heading">{"Step 1: 導入・認証・初期設定"}</h2>{" "}
              <h3 id="antigravity-h92">{"1.1 インストール"}</h3>{" "}
              <p>
                {" CLIは公式READMEのワンライナーで導入できます "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <pre data-testid="code-block">
                <code className="language-bash hljs">
                  <span className="hljs-comment">
                    <span className={styles.codeLine}>{"# macOS / Linux"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>
                    {"curl -fsSL https://antigravity.google/cli/install.sh | bash"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-comment">
                    <span className={styles.codeLine}>{"# 起動(対話TUI)"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"agy"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                </code>
              </pre>{" "}
              <pre data-testid="code-block">
                <code className="language-bash hljs">
                  <span className="hljs-comment">
                    <span className={styles.codeLine}>{"# Windows (PowerShell)"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>
                    {"irm https://antigravity.google/cli/install.ps1 | iex"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                </code>
              </pre>{" "}
              <p>
                {" Appは "}
                <code>{"https://antigravity.google/download"}</code>
                {" から入手します "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {
                  "。CLIの認証はシステムのキーリングを使い、セッションがなければGoogleサインインにフォールバックします "
                }
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <h3 id="antigravity-h93">{"1.2 導入前に必ず確認すること"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"確認項目"}</th>
                      <th>{"理由"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"利用するアカウント種別(個人 / 企業)"}</td>
                      <td>
                        {" Auto権限プリセット、CLIの音声入力、IDEなど、"}
                        <strong>{"企業アカウントで使えない機能がある"}</strong>{" "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"インタラクションデータの扱い"}</td>
                      <td>
                        {
                          " CLIのREADMEには、利用によりインタラクションデータの収集・利用に同意する旨の記載がある。機密コードを扱う前に規約を確認する "
                        }
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"Gemini CLIからの移行"}</td>
                      <td>
                        {
                          " 個人のGoogleアカウントでログインするGemini CLI利用は2026-06-18で終了(APIキー認証は継続)。公式に移行ガイドあり "
                        }
                      </td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>
                          {"開発者"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"旧ワークフローのスキル移行"}</td>
                      <td>{"公式ドキュメントに「Workflows to Skills」の移行ページがある"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>
                  {" 業務リポジトリで使う前に、"}
                  <strong>{"ダミーのリポジトリで Step 2〜6 を一巡"}</strong>
                  {"してください。権限と検証ループの感覚をつかむ最短ルートです。 "}
                </p>{" "}
              </blockquote>{" "}
              <h3 id="antigravity-h94">{"1.3 設定ファイルの置き場所(早見表)"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"対象"}</th>
                      <th>{"置き場所"}</th>
                      <th>{"備考"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"CLI設定・権限"}</td>
                      <td>
                        <code>{"~/.gemini/antigravity-cli/settings.json"}</code>
                      </td>
                      <td>
                        {"AppとCLIで権限は同期 "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"グローバルルール"}</td>
                      <td>
                        {" "}
                        <code>{"~/.gemini/AGENTS.md"}</code>
                        {" / "}
                        <code>{"~/.gemini/GEMINI.md"}</code>
                        {" / "}
                        <code>{"~/.gemini/config/rules/*.md"}</code>{" "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"ワークスペースルール"}</td>
                      <td>
                        {" "}
                        <code>{"AGENTS.md"}</code>
                        {" / "}
                        <code>{"GEMINI.md"}</code>
                        {" / "}
                        <code>{".agents/rules/*.md"}</code>{" "}
                      </td>
                      <td>
                        {" リポジトリルートまでの親フォルダも対象 "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"ワークスペーススキル"}</td>
                      <td>
                        <code>{"<root>/.agents/skills/<name>/SKILL.md"}</code>
                      </td>
                      <td>
                        {" 旧 "}
                        <code>{".agent/skills"}</code>
                        {" も互換 "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"グローバルスキル"}</td>
                      <td>
                        <code>{"~/.gemini/config/skills/<name>/"}</code>
                      </td>
                      <td>
                        {"AppとCLIで共有 "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"カスタムサブエージェント"}</td>
                      <td>
                        {" "}
                        <code>{".agents/agents/<name>.md"}</code>
                        {" / "}
                        <code>{"~/.gemini/config/agents/"}</code>{" "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"プラグイン"}</td>
                      <td>
                        <code>{"~/.gemini/config/plugins/<plugin>/"}</code>
                      </td>
                      <td>
                        {" skills / agents / rules / MCP / hooks を同梱 "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </section>
            <section className={styles.section} id="s5">
              {" "}
              <h2 id="s5-heading">{"Step 2: プロジェクトと権限設計(最重要)"}</h2>{" "}
              <p>
                {" エージェントを「速く」使うほど、"}
                <strong>{"権限設計の質がそのまま事故率"}</strong>
                {"になります。Antigravityの権限は、すべての操作を "}
                <code>{"action(target)"}</code>
                {" 形式で評価する統一エンジンです "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <h3 id="antigravity-h95">{"2.1 プロジェクトという単位"}</h3>{" "}
              <ul>
                {" "}
                <li>
                  {" エージェントは"}
                  <strong>{"プロジェクト"}</strong>
                  {
                    "単位で動き、アクセスできるフォルダと設定・権限がプロジェクトごとに定義されます "
                  }
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" Appではプロジェクトが"}
                  <strong>{"Git worktree"}</strong>
                  {
                    "をネイティブにサポートし、エージェントを隔離された作業フォルダで走らせられます "
                  }
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" 設定はプロジェクトごとに変えられるため、"}
                  <strong>{"信頼できるリポジトリは緩め、未知のフォルダは厳しめ"}</strong>
                  {"にできます "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" 複数フォルダ(複数リポジトリ)をまたぐ作業も設定できます "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
              </ul>{" "}
              <h3 id="antigravity-h96">{"2.2 権限評価の順序"}</h3>{" "}
              <div className={styles["diagram-wrap"]}>
                {" "}
                <div
                  className={styles["diagram-canvas"]}
                  data-diagram-id="d2"
                  role="img"
                  aria-label="フローチャート"
                >
                  <MermaidDiagram chart={DIAGRAM_2} theme="base" themeVariables={THEME_VARS} />
                </div>{" "}
              </div>{" "}
              <p>
                {" 優先順位は "}
                <strong>{"Deny > Ask > Allow"}</strong>
                {" です。たとえば "}
                <code>{"command(*)"}</code>
                {" をAskに、"}
                <code>{"command(git)"}</code>
                {" をAllowに入れると、Askが勝ってすべてのコマンドで確認が出ます "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <h3 id="antigravity-h97">{"2.3 App の権限プリセット(2026-11時点)"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"プリセット"}</th>
                      <th>{"ターミナルサンドボックス"}</th>
                      <th>{"ターミナルコマンド"}</th>
                      <th>{"ファイル範囲"}</th>
                      <th>{"MCP / Web"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{"Request Review"}</strong>
                      </td>
                      <td>{"無効"}</td>
                      <td>{"常に確認"}</td>
                      <td>{"ワークスペースのみ"}</td>
                      <td>{"確認"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Default"}</strong>
                        {"(既定。個人アカウント)"}
                      </td>
                      <td>{"有効"}</td>
                      <td>{"サンドボックス内は自動、外は確認"}</td>
                      <td>{"ワークスペース + 一時ディレクトリ"}</td>
                      <td>{"確認"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Auto"}</strong>
                      </td>
                      <td>{"有効"}</td>
                      <td>{"サンドボックス内は自動、外は自動判定"}</td>
                      <td>{"ワークスペース + 一時ディレクトリ"}</td>
                      <td>{"確認"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Turbo"}</strong>
                      </td>
                      <td>{"無効"}</td>
                      <td>{"無制限に許可"}</td>
                      <td>
                        <strong>{"マシン全体"}</strong>
                      </td>
                      <td>{"許可"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" 出典: "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>{" "}
                <code>{"https://antigravity.google/docs/permissions/"}</code>{" "}
              </p>{" "}
              <p>{"注意点:"}</p>{" "}
              <ul>
                {" "}
                <li>
                  {" "}
                  <strong>{"ビジネス・企業アカウント"}</strong>
                  {"は、上の表とは別の設定を使います。Security Preset の "}
                  <strong>{"Default"}</strong>
                  {" は Terminal Command Auto Execution が Require Review で、"}
                  <strong>{"サンドボックスを有効にしません"}</strong>
                  {"。Full machine と Turbo mode でも有効になりません "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {
                    "。サンドボックスを使うには、次の順に設定します。① Settings > General > Agent Settings で "
                  }
                  <strong>{"Enable Sandbox Mode"}</strong>
                  {" をオンにする(プリセットは Custom に切り替わります)。② "}
                  <strong>{"Terminal Command Auto Execution"}</strong>
                  {" を "}
                  <strong>{"Proceed in Sandbox"}</strong>
                  {
                    " にする(サンドボックス内は自動、外は確認)。プロジェクト単位の変更は Settings > Projects で行います "
                  }
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" "}
                  <strong>{"Auto"}</strong>
                  {
                    " は macOS / Linux は v2.23.0 以降、Windows は v2.26.0 以降で、サンドボックスが使える場合に利用可能。"
                  }
                  <strong>{"企業・ビジネスアカウントでは現状使えません"}</strong>{" "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" Defaultのサンドボックスは、既定で"}
                  <strong>{"ネットワーク接続なし"}</strong>
                  {
                    "です。コマンドが書き込めるのはワークスペース、一時ディレクトリ、共有ビルドキャッシュです。"
                  }
                  <code>{"/usr"}</code>
                  {" や "}
                  <code>{"/etc"}</code>
                  {" などのシステムディレクトリは読み取れますが、"}
                  <code>{"~/.ssh"}</code>
                  {" や "}
                  <code>{".env"}</code>
                  {" などの機密ファイルはブロックされます "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。詳細は "}
                  <a
                    href="https://antigravity.google/docs/sandbox/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {"Terminal sandbox"}
                  </a>
                  {" を参照してください。 "}
                </li>{" "}
                <li>
                  {" "}
                  <code>{"read_url"}</code>
                  {" に許可したドメインは、そのまま"}
                  <strong>{"サンドボックスの外向き通信許可リストにコンパイルされます"}</strong>{" "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。つまり "}
                  <code>{"read_url(*)"}</code>
                  {" は、サンドボックスの外向き通信を事実上全開にします。 "}
                </li>{" "}
              </ul>{" "}
              <h3 id="antigravity-h98">{"2.4 プリセットの選び方"}</h3>{" "}
              <div className={styles["diagram-wrap"]}>
                {" "}
                <div
                  className={styles["diagram-canvas"]}
                  data-diagram-id="d3"
                  role="img"
                  aria-label="フローチャート"
                >
                  <MermaidDiagram chart={DIAGRAM_3} theme="base" themeVariables={THEME_VARS} />
                </div>{" "}
              </div>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>
                  {
                    " Turboは、使い捨ての隔離環境(VM / コンテナ)以外では選ばないでください。マシン全体への読み書きとMCP・Webの自動許可が同時に開きます "
                  }
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </p>{" "}
              </blockquote>{" "}
              <h3 id="antigravity-h99">{"2.5 CLIの権限設定"}</h3>{" "}
              <p>
                {" CLIは、"}
                <strong>{"実行モード"}</strong>
                {"と "}
                <code>{"toolPermission"}</code>
                {" と詳細ルール(allow / ask / deny)の三層で制御されます "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"実行モード"}</th>
                      <th>{"動作"}</th>
                      <th>{"備考"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>{"default"}</code>
                      </td>
                      <td>
                        {" ファイル変更前に差分レビュー。コマンドは "}
                        <code>{"toolPermission"}</code>
                        {" に従う "}
                      </td>
                      <td>{"既定"}</td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"accept-edits"}</code>
                      </td>
                      <td>{"ワークスペース内のファイル編集・作成を自動承認"}</td>
                      <td>{"コマンドは引き続き評価"}</td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"auto"}</code>
                      </td>
                      <td>{"編集とサンドボックス内コマンドを自動承認、外は自動判定"}</td>
                      <td>{"macOS / Linux は v1.3.5+、Windows は v1.4.4+。企業は不可"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" "}
                <code>{"Shift"}</code>
                {" + "}
                <code>{"Tab"}</code>
                {" でモードを切り替えられます "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。"}
                <code>{"toolPermission"}</code>
                {" の値は次のとおりです "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"値"}</th>
                      <th>{"意味"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>{"request-review"}</code>
                        {"(既定)"}
                      </td>
                      <td>{"書き込み・Bash・外部通信の前に確認"}</td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"proceed-in-sandbox"}</code>
                      </td>
                      <td>{"サンドボックス内は自動、外は確認"}</td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"strict"}</code>
                      </td>
                      <td>
                        {"読み取り以外は常に確認("}
                        <code>{"auto"}</code>
                        {" を上書き)"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"always-proceed"}</code>
                      </td>
                      <td>
                        {"承認を完全に省略("}
                        <code>{"--dangerously-skip-permissions"}</code>
                        {" と同等)"}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                  </strong>
                  {" DEV Community の解説によれば、"}
                  <code>{"--dangerously-skip-permissions"}</code>
                  {
                    " は承認を切るだけで、ターミナルサンドボックスの設定は変えません。CLIのサンドボックスは既定で無効なので、"
                  }
                  <strong>{"承認なし + サンドボックスなし"}</strong>
                  {"になり得ます。 "}
                </p>{" "}
              </blockquote>{" "}
              <h3 id="antigravity-h100">{"2.6 まず入れておくべき設定例(CLI)"}</h3>{" "}
              <pre data-testid="code-block">
                <code className="language-json hljs">
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"{"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"  "}</span>
                  <span className="hljs-attr">
                    <span className={styles.codeLine}>{'"toolPermission"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{":"}</span>
                  </span>
                  <span className={styles.codeLine}> </span>
                  <span className="hljs-string">
                    <span className={styles.codeLine}>{'"proceed-in-sandbox"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{","}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"  "}</span>
                  <span className="hljs-attr">
                    <span className={styles.codeLine}>{'"enableTerminalSandbox"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{":"}</span>
                  </span>
                  <span className={styles.codeLine}> </span>
                  <span className="hljs-literal">
                    <span className="hljs-keyword">
                      <span className={styles.codeLine}>{"true"}</span>
                    </span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{","}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"  "}</span>
                  <span className="hljs-attr">
                    <span className={styles.codeLine}>{'"permissions"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{":"}</span>
                  </span>
                  <span className={styles.codeLine}> </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"{"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"    "}</span>
                  <span className="hljs-attr">
                    <span className={styles.codeLine}>{'"allow"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{":"}</span>
                  </span>
                  <span className={styles.codeLine}> </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"["}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"      "}</span>
                  <span className="hljs-string">
                    <span className={styles.codeLine}>{'"write_file(src/)"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{","}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"      "}</span>
                  <span className="hljs-string">
                    <span className={styles.codeLine}>{'"read_url(developer.mozilla.org)"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{","}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"      "}</span>
                  <span className="hljs-string">
                    <span className={styles.codeLine}>{'"mcp(linter/*)"'}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"    "}</span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"]"}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{","}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"    "}</span>
                  <span className="hljs-attr">
                    <span className={styles.codeLine}>{'"ask"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{":"}</span>
                  </span>
                  <span className={styles.codeLine}> </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"["}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"      "}</span>
                  <span className="hljs-string">
                    <span className={styles.codeLine}>{'"command(git push)"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{","}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"      "}</span>
                  <span className="hljs-string">
                    <span className={styles.codeLine}>{'"execute_url(aws.amazon.com)"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{","}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"      "}</span>
                  <span className="hljs-string">
                    <span className={styles.codeLine}>{'"mcp(sql/execute_mutation)"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{","}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"      "}</span>
                  <span className="hljs-string">
                    <span className={styles.codeLine}>{'"command(regex:(.*/)?curl .*)"'}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"    "}</span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"]"}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{","}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"    "}</span>
                  <span className="hljs-attr">
                    <span className={styles.codeLine}>{'"deny"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{":"}</span>
                  </span>
                  <span className={styles.codeLine}> </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"["}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"      "}</span>
                  <span className="hljs-string">
                    <span className={styles.codeLine}>{'"command(rm -rf)"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{","}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"      "}</span>
                  <span className="hljs-string">
                    <span className={styles.codeLine}>{'"command(sudo)"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{","}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"      "}</span>
                  <span className="hljs-string">
                    <span className={styles.codeLine}>{'"write_file(.git/)"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{","}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"      "}</span>
                  <span className="hljs-string">
                    <span className={styles.codeLine}>{'"write_file(<HOME>/.ssh)"'}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"    "}</span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"]"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"  "}</span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"}"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"}"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                </code>
              </pre>{" "}
              <p>
                {" 出典: "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {" の設定例を元に、"}
                <code>{"toolPermission"}</code>
                {" と "}
                <code>{"read_url"}</code>
                {" の許可範囲を絞って構成("}
                <strong>
                  <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                </strong>
                {")。 "}
              </p>{" "}
              <ul>
                {" "}
                <li>
                  {" "}
                  <code>{"<HOME>"}</code>
                  {" は、自分のホームディレクトリの絶対パス(macOS / Linux では "}
                  <code>{'echo "$HOME"'}</code>
                  {"、Windows PowerShell では "}
                  <code>{"$HOME"}</code>
                  {
                    " で確認)に置き換えてください。Windows のパスをこの JSON に書く場合は、区切りを "
                  }
                  <code>{"/"}</code>
                  {" にするか、バックスラッシュを "}
                  <code>{"\\\\"}</code>
                  {" とJSONエスケープします。公式の例も絶対パスで、"}
                  <code>{"write_file"}</code>
                  {" が "}
                  <code>{"~"}</code>
                  {" を展開するとは書かれていません "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" "}
                  <code>{"command"}</code>
                  {" の "}
                  <code>{"allow"}</code>
                  {" ルールは、サンドボックスの"}
                  <strong>{"内外を問わず"}</strong>
                  {"確認なしの実行を許可します "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。"}
                  <code>{"proceed-in-sandbox"}</code>
                  {
                    " ならサンドボックス内のコマンドは自動で実行され、外で実行するときは確認が出るので、"
                  }
                  <code>{"npm run"}</code>
                  {" の "}
                  <code>{"allow"}</code>
                  {" ルールは入れていません("}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>
                  {")。 "}
                </li>{" "}
                <li>
                  {" この例の "}
                  <code>{"curl"}</code>
                  {" は "}
                  <code>{"ask"}</code>
                  {" なので、実行のたびに確認します。例外を認めず常に止めたい場合の代替は "}
                  <code>{"deny"}</code>
                  {" です(Step 15.3)。 "}
                </li>{" "}
                <li>
                  {" "}
                  <code>{"command(...)"}</code>
                  {" は既定で単語・トークンの前方一致です "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。そのため "}
                  <code>{"command(git push)"}</code>
                  {" は "}
                  <code>{"git -C /path push"}</code>
                  {" のような別の書き方を捕まえません(前方一致の仕様からの帰結)。別の書き方はこの "}
                  <code>{"ask"}</code>
                  {
                    " に一致しないので、サンドボックスからリモートと必要な資格情報へ到達できる場合は、確認なしで push される可能性があります。すべてのコマンドで確認が必要なら、"
                  }
                  <code>{"ask"}</code>
                  {" に "}
                  <code>{"command(*)"}</code>
                  {" を設定します。"}
                  <code>{"ask"}</code>
                  {" は "}
                  <code>{"allow"}</code>
                  {" より優先されます "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" "}
                  <code>{"command(rm -rf)"}</code>
                  {" の保護も同じ前方一致の範囲に限られ、"}
                  <code>{"rm -fr"}</code>
                  {
                    " のようにオプションの順序を変えた形には一致しません(前方一致の仕様からの帰結)。また、サンドボックス内でもワークスペースへは書き込めるので、この "
                  }
                  <code>{"deny"}</code>
                  {
                    " を入れていても、サンドボックス内のコマンドがワークスペースのファイルを削除する可能性はあります。 "
                  }
                </li>{" "}
              </ul>{" "}
              <h3 id="antigravity-h101">{"2.7 コマンドマッチの落とし穴"}</h3>{" "}
              <p>
                {" 次の構文は、無害な接頭辞の裏で任意コマンドを実行できるため、"}
                <strong>
                  {"接頭辞マッチが無効化され、行全体の完全一致でしか自動許可されません"}
                </strong>{" "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"構文"}</th>
                      <th>{"例"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"コマンド置換・プロセス置換"}</td>
                      <td>
                        <code>{"$(...)"}</code>
                        {"、バッククォート、"}
                        <code>{"<(...)"}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>{"算術展開・ブレース展開"}</td>
                      <td>
                        <code>{"$((...))"}</code>
                        {"、"}
                        <code>{"{a,b}"}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>{"サブコマンドを実行させるフラグ"}</td>
                      <td>
                        <code>{"git -c core.pager=<cmd>"}</code>
                        {"、"}
                        <code>{"tar --to-command"}</code>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" たとえば "}
                <code>{"command(git)"}</code>
                {" を許可していても、"}
                <code>{"git status && git log"}</code>
                {" は通り、"}
                <code>{"git log $(whoami)"}</code>
                {" は確認が出ます "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。許可ルールが「効かない」と感じたら、まずこの仕様を疑ってください。 "}
              </p>{" "}
              <h3 id="antigravity-h102">{"2.8 承認プロンプトのスコープ編集"}</h3>{" "}
              <p>
                {
                  " ファイル・URL・MCPの承認カードでは、許可前に対象文字列を編集してスコープを広げられます(単一ファイル → 親ディレクトリなど)。広げた許可は"
                }
                <strong>{"そのターンの間"}</strong>
                {"有効で、同じ種類の確認の連発を防げます。ただし"}
                <strong>{"ターミナルコマンドには使えません"}</strong>{" "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
            </section>
            <section className={styles.section} id="s6">
              {" "}
              <h2 id="s6-heading">{"Step 3: ルール(AGENTS.md)の設計"}</h2>{" "}
              <h3 id="antigravity-h103">{"3.1 ルールとスキルの違い"}</h3>{" "}
              <p>
                {" 公式は、"}
                <strong>{"ルール = 制約・不変条件"}</strong>
                {"、"}
                <strong>{"スキル = 複数手順のワークフロー"}</strong>
                {"と整理しています "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <div className={styles["diagram-wrap"]}>
                {" "}
                <div
                  className={styles["diagram-canvas"]}
                  data-diagram-id="d4"
                  role="img"
                  aria-label="フローチャート"
                >
                  <MermaidDiagram chart={DIAGRAM_4} theme="base" themeVariables={THEME_VARS} />
                </div>{" "}
              </div>{" "}
              <h3 id="antigravity-h104">{"3.2 ルールの探索ルール"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"項目"}</th>
                      <th>{"仕様"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"探索範囲"}</td>
                      <td>{"ワークスペースと、リポジトリルートまでの親フォルダ + グローバル"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"サブフォルダ"}</strong>
                      </td>
                      <td>
                        {" ワークスペースより"}
                        <strong>{"下"}</strong>
                        {"のフォルダのルールは、そこを編集しても読まれない "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"結合方式"}</td>
                      <td>
                        {"置換ではなく"}
                        <strong>{"累積"}</strong>
                        {"(見つかったすべてを結合)"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"AGENTS.md"}</code>
                        {" / "}
                        <code>{"GEMINI.md"}</code>
                      </td>
                      <td>{"frontmatter不要、常時有効"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"rules/*.md"}</code>
                      </td>
                      <td>
                        {" "}
                        <strong>
                          {"frontmatterと有効な "}
                          <code>{"trigger"}</code>
                          {" が必須"}
                        </strong>
                        {"。欠落や不正値("}
                        <code>{"alwaysOn"}</code>
                        {" など)は"}
                        <strong>{"黙って破棄される"}</strong>{" "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"rules/"}</code>
                        {" 直下のみ走査"}
                      </td>
                      <td>
                        {"サブディレクトリは "}
                        <code>{".agents/rules.json"}</code>
                        {" に登録しない限り無視"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"サイズ上限"}</td>
                      <td>
                        {
                          " include の展開後に24,000バイトを超えるファイルは切り詰められる。有効なグローバルルールと "
                        }
                        <code>{"always_on"}</code>
                        {
                          " ルールの合計が20,000トークンを超えると、大きいルールファイルから順にポインタへ降格 "
                        }
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                  </strong>
                  {" 一部の解説記事には「ルールは12,000文字上限」という古い情報があります。"}
                  <strong>{"公式の現行値は上記(24KB / 20,000トークン)"}</strong>
                  {" です。 "}
                </p>{" "}
              </blockquote>{" "}
              <h3 id="antigravity-h105">
                {"3.3 "}
                <code>{"trigger"}</code>
                {" の4種類"}
              </h3>{" "}
              <pre data-testid="code-block">
                <code className="language-markdown hljs">
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"trigger: model"}</span>
                  <span className="hljs-emphasis">
                    <span className={styles.codeLine}>{"_decision   # always_"}</span>
                  </span>
                  <span className={styles.codeLine}>{"on | model"}</span>
                  <span className="hljs-emphasis">
                    <span className={styles.codeLine}>{"_decision | glob | manual"}</span>
                    <span className={styles.codeLine}>{"\n"}</span>
                    <span className={styles.codeLine}>
                      {
                        'description: "DBマイグレーションやSQLスキーマ変更を書く・レビューするときに適用する"'
                      }
                    </span>
                    <span className={styles.codeLine}>{"\n"}</span>
                    <span className={styles.codeLine}>{"\n"}</span>
                    <span className={styles.codeLine}>{"# DBマイグレーション規約"}</span>
                    <span className={styles.codeLine}>{"\n"}</span>
                    <span className={styles.codeLine}>{"\n"}</span>
                    <span className={styles.codeLine}>
                      {
                        "1. カラムの削除・改名は1回のデプロイで行わず、expand-and-contract で段階的に行う。"
                      }
                    </span>
                    <span className={styles.codeLine}>{"\n"}</span>
                    <span className={styles.codeLine}>
                      {
                        "2. 既存テーブルへのインデックス作成には必ず CONCURRENTLY を付ける。CONCURRENTLY はトランザクションブロック内で実行できないので、トランザクションを使わないマイグレーションとして実行する。パーティションテーブルの親には CONCURRENTLY で直接作成できないので、親には ON ONLY で作成し、各パーティションに CONCURRENTLY で作成してから ATTACH する。"
                      }
                    </span>
                    <span className={styles.codeLine}>{"\n"}</span>
                  </span>
                </code>
              </pre>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"trigger"}</th>
                      <th>{"動作"}</th>
                      <th>{"向いている内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>{"always_on"}</code>
                      </td>
                      <td>{"毎ターン全文を注入"}</td>
                      <td>
                        {"絶対に外せない制約("}
                        <code>{"AGENTS.md"}</code>
                        {" に直接書く方が簡単)"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"model_decision"}</code>
                      </td>
                      <td>
                        {"パスと "}
                        <code>{"description"}</code>
                        {" だけ先に注入し、必要時に全文を読む"}
                      </td>
                      <td>{"詳細なドメイン別ガイド"}</td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"glob"}</code>
                      </td>
                      <td>
                        {" 必須の "}
                        <code>{"globs"}</code>
                        {" のパターンに一致するファイルを扱うときだけ自動で有効化 "}
                      </td>
                      <td>
                        {"言語別・領域別の規約(例: "}
                        <code>{"*.proto"}</code>
                        {")"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"manual"}</code>
                      </td>
                      <td>
                        <code>{"@"}</code>
                        {" メンションしたときだけ読み込む"}
                      </td>
                      <td>{"リリースチェックリスト、監査基準(CLIはルールのメンション非対応)"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" "}
                <code>{"glob"}</code>
                {" の frontmatter は次のように書きます。"}
                <code>{"globs"}</code>
                {" はカンマ区切りの文字列で、"}
                <code>{"*"}</code>
                {" で始まるパターンは引用符で囲みます "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <pre data-testid="code-block">
                <code className="language-markdown hljs">
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"trigger: glob"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{'globs: "'}</span>
                  <span className="hljs-emphasis">
                    <span className={styles.codeLine}>{"*.proto, "}</span>
                    <span className="hljs-strong">
                      <span className={styles.codeLine}>{'**/*.pb.go"'}</span>
                      <span className={styles.codeLine}>{"\n"}</span>
                      <span className={styles.codeLine}>{"\n"}</span>
                    </span>
                  </span>
                </code>
              </pre>{" "}
              <h3 id="antigravity-h106">{"3.4 AGENTS.md の雛形"}</h3>{" "}
              <pre data-testid="code-block">
                <code className="language-markdown hljs">
                  <span className="hljs-section">
                    <span className={styles.codeLine}>{"# プロジェクト概要"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"-"}</span>
                  </span>
                  <span className={styles.codeLine}>
                    {" "}
                    {"目的: 請求サービスのAPI。TypeScript + PostgreSQL。"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-section">
                    <span className={styles.codeLine}>{"# 必ず守るコマンド"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"-"}</span>
                  </span>
                  <span className={styles.codeLine}> {"テスト: "}</span>
                  <span className="hljs-code">
                    <span className={styles.codeLine}>{"`npm test`"}</span>
                  </span>
                  <span className={styles.codeLine}>{"(変更後は必ず実行して結果を報告する)"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"-"}</span>
                  </span>
                  <span className={styles.codeLine}> {"Lint: "}</span>
                  <span className="hljs-code">
                    <span className={styles.codeLine}>{"`npm run lint`"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"-"}</span>
                  </span>
                  <span className={styles.codeLine}> {"型チェック: "}</span>
                  <span className="hljs-code">
                    <span className={styles.codeLine}>{"`npm run typecheck`"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-section">
                    <span className={styles.codeLine}>{"# コーディング規約"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"-"}</span>
                  </span>
                  <span className={styles.codeLine}> {"入力検証は zod を使う。"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"-"}</span>
                  </span>
                  <span className={styles.codeLine}> </span>
                  <span className="hljs-code">
                    <span className={styles.codeLine}>{"`internal/`"}</span>
                  </span>
                  <span className={styles.codeLine}> {"を他パッケージから import しない。"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-section">
                    <span className={styles.codeLine}>{"# 触ってはいけないもの"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"-"}</span>
                  </span>
                  <span className={styles.codeLine}> </span>
                  <span className="hljs-code">
                    <span className={styles.codeLine}>{"`migrations/`"}</span>
                  </span>
                  <span className={styles.codeLine}> {"の既存ファイル、"}</span>
                  <span className="hljs-code">
                    <span className={styles.codeLine}>{"`.env*`"}</span>
                  </span>
                  <span className={styles.codeLine}>{"、"}</span>
                  <span className="hljs-code">
                    <span className={styles.codeLine}>{"`infra/prod/`"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-section">
                    <span className={styles.codeLine}>{"# 完了の定義"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"-"}</span>
                  </span>
                  <span className={styles.codeLine}>
                    {" "}
                    {"テスト・Lint・型チェックがすべて成功し、変更点と未確認事項を最後に要約する。"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                </code>
              </pre>{" "}
              <p>
                {" "}
                <strong>
                  <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                </strong>
                {" 設計の指針: "}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"指針"}</th>
                      <th>{"理由"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"短く保つ(まず50〜100行を目安に)"}</td>
                      <td>
                        {" 常時有効ルールは毎ターン文脈を消費する(上限もある) "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"「何をしないか」と「完了の定義」を必ず書く"}</td>
                      <td>{"検証ループ(Step 6)の入口になる"}</td>
                    </tr>
                    <tr>
                      <td>{"詳細手順はスキルへ逃がす"}</td>
                      <td>
                        {" 段階的開示でコンテキストを節約できる "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"他ツールと共通化したいなら "}
                        <code>{"AGENTS.md"}</code>
                      </td>
                      <td>
                        {" Cursor、Claude Code、Codexなどとの共通形式として扱える "}
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>
                          {"二次"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"Antigravity固有の上書きだけ "}
                        <code>{"GEMINI.md"}</code>
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                        {" CoinGecko公式ドキュメントの説明"}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" ファイルの取り込みには "}
                <code>{"@[ラベル](パス)"}</code>
                {"(本文をインライン展開)と "}
                <code>{"@ファイル名"}</code>
                {"(正規パスへの書き換えのみ)の2種類があります "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <pre data-testid="code-block">
                <code className="language-markdown hljs">
                  <span className={styles.codeLine}>{"APIの設計基準は次に従う:"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"@["}</span>
                  <span className="hljs-string">
                    <span className={styles.codeLine}>{"API Design Standards"}</span>
                  </span>
                  <span className={styles.codeLine}>{"]("}</span>
                  <span className="hljs-link">
                    <span className={styles.codeLine}>{"../docs/api-standards.md"}</span>
                  </span>
                  <span className={styles.codeLine}>{")"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>
                    {"DBモデルを変更する前に @src/db/schema.ts を確認する。"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                </code>
              </pre>{" "}
            </section>
            <section className={styles.section} id="s7">
              {" "}
              <h2 id="s7-heading">{"Step 4: スキルで「手順」を資産化する"}</h2>{" "}
              <h3 id="antigravity-h107">{"4.1 スキルの仕組み(段階的開示)"}</h3>{" "}
              <p>
                {" スキルは、"}
                <code>{"SKILL.md"}</code>
                {" を含むフォルダです。エージェントは"}
                <strong>{"毎ターン、スキルの名前と説明の一覧だけを見て"}</strong>
                {"、関連しそうなら全文を読み、その手順に従います "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"段階"}</th>
                      <th>{"内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"発見"}</td>
                      <td>
                        {"毎ターン、名前と "}
                        <code>{"description"}</code>
                        {" の一覧を見る"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"起動"}</td>
                      <td>
                        {"関連すると判断したら "}
                        <code>{"SKILL.md"}</code>
                        {" 全文を読む"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"実行"}</td>
                      <td>{"手順に従って作業する"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h108">{"4.2 スキルの書き方(公式ベストプラクティス)"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"原則"}</th>
                      <th>{"具体策"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"1スキル1目的"}</td>
                      <td>{"「何でも屋」を作らず、タスクごとに分ける"}</td>
                    </tr>
                    <tr>
                      <td>{"説明が命"}</td>
                      <td>
                        {" "}
                        <code>{"description"}</code>
                        {" は三人称で、"}
                        <strong>{"何をするか + いつ使うか"}</strong>
                        {"を具体的に書く(キーワードを含める) "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"スクリプトはブラックボックス"}</td>
                      <td>
                        {" 信頼できるスクリプトは、まず "}
                        <code>{"--help"}</code>
                        {
                          " で使い方を確認させ、ソース全体を読ませない。信頼できないスクリプトは、実行前に本体と依存関係を確認し、書き込みとネットワークの権限を制限する "
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{"決定木を入れる"}</td>
                      <td>{"複雑なスキルには「状況ごとの選択肢」の節を設ける"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" 出典: "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>{" "}
                <code>{"https://antigravity.google/docs/skills/"}</code>{" "}
              </p>{" "}
              <h3 id="antigravity-h109">{"4.3 スキル例(検証必須の実装手順)"}</h3>{" "}
              <pre data-testid="code-block">
                <code className="language-markdown hljs">
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"name: implement-with-verification"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>
                    {
                      "description: 機能追加やバグ修正を、先にテストを用意してから実装し、テスト成功を確認して完了報告する。実装タスクで、変更後に検証が必要なときに使う。"
                    }
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-section">
                    <span className={styles.codeLine}>{"# 手順"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"1."}</span>
                  </span>
                  <span className={styles.codeLine}>
                    {" "}
                    {"変更対象と既存テストを確認する(探索のみ。この段階ではファイルを編集しない)。"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"2."}</span>
                  </span>
                  <span className={styles.codeLine}>
                    {" "}
                    {"再現または仕様を表す失敗するテストを先に書く。"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"3."}</span>
                  </span>
                  <span className={styles.codeLine}> {"最小の実装でテストを通す。"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"4."}</span>
                  </span>
                  <span className={styles.codeLine}> </span>
                  <span className="hljs-code">
                    <span className={styles.codeLine}>{"`npm test`"}</span>
                  </span>
                  <span className={styles.codeLine}> {"と "}</span>
                  <span className="hljs-code">
                    <span className={styles.codeLine}>{"`npm run lint`"}</span>
                  </span>
                  <span className={styles.codeLine}> {"を実行し、出力を貼って報告する。"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"5."}</span>
                  </span>
                  <span className={styles.codeLine}>
                    {" "}
                    {
                      "失敗したら原因を特定して2回まで自力修正する。解消しなければ中断して状況を報告する。"
                    }
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-section">
                    <span className={styles.codeLine}>{"# 判断基準"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"-"}</span>
                  </span>
                  <span className={styles.codeLine}>
                    {" "}
                    {"既存テストがない場合: 先に最小のテストを追加してよいか、ユーザーに確認する。"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"-"}</span>
                  </span>
                  <span className={styles.codeLine}>
                    {" "}
                    {"変更が3ファイルを超える場合: 実装前に計画を提示して承認を得る。"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                </code>
              </pre>{" "}
              <h3 id="antigravity-h110">{"4.4 スキルの配置・呼び出し・配布"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"観点"}</th>
                      <th>{"内容"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"配置(App / CLI共通)"}</td>
                      <td>
                        {" "}
                        <code>{"<workspace>/.agents/skills/"}</code>
                        {" と "}
                        <code>{"~/.gemini/config/skills/"}</code>{" "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"CLIのみ追加で読む場所"}</td>
                      <td>
                        {" "}
                        <code>{"~/.gemini/antigravity-cli/skills/"}</code>
                        {"、"}
                        <code>{"~/.gemini/skills/"}</code>
                        {"(Appは読まない) "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"呼び出し"}</td>
                      <td>
                        {"自動(説明との照合)、または "}
                        <code>{"/<スキル名>"}</code>
                        {" で明示"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"CLIでの扱い"}</td>
                      <td>
                        {" スキルは自動でスラッシュコマンドになる。追加後は "}
                        <code>{"/skills reload"}</code>
                        {" か新規会話 "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"プラグインで配布"}</td>
                      <td>
                        {" "}
                        <code>{"agy plugin install <名前>"}</code>
                        {"(GitHub URLやローカルパスも可) "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <pre data-testid="code-block">
                <code className="language-bash hljs">
                  <span className={styles.codeLine}>{"agy plugin list --json            "}</span>
                  <span className="hljs-comment">
                    <span className={styles.codeLine}>{"# 同梱スキル名とパスも確認できる"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"agy plugin install ./my-skills-plugin"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                </code>
              </pre>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                  </strong>
                  {
                    " Addy Osmani は、開発ライフサイクル(定義・計画・実装・検証・レビュー・出荷)を24のスキルにした "
                  }
                  <code>{"agent-skills"}</code>
                  {
                    " を公開し、Antigravity CLI向けのセットアップ手順も用意しています。厳密に「計画してから実装」を守らせたい場合は、プロジェクトの "
                  }
                  <code>{"AGENTS.md"}</code>
                  {" に必要なスキルの流れを書くよう案内しています。 "}
                </p>{" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>
                  {
                    " 自作する前に、まず既存スキル集を試し、自分のリポジトリで効いたものだけを残してください。スキルを増やしすぎると、説明一覧そのものが文脈を圧迫します。 "
                  }
                </p>{" "}
              </blockquote>{" "}
            </section>
            <section className={styles.section} id="s8">
              {" "}
              <h2 id="s8-heading">{"Step 5: 探索 → 計画 → 実行(/grill-me と /plan)"}</h2>{" "}
              <h3 id="antigravity-h111">{"5.1 公式が示す基本形"}</h3>{" "}
              <p>
                {" 公式のCLIベストプラクティスは、複雑な変更を"}
                <strong>{"探索・計画・実行の3段階に分けると精度が最も高い"}</strong>
                {"としています "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"段階"}</th>
                      <th>{"やること"}</th>
                      <th>{"プロンプト例"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"探索"}</td>
                      <td>{"書き込み前に、コードベースがどう解決しているかを説明させる"}</td>
                      <td>
                        <code>{"ルーターが /docs/:page をどう解決しているか説明して"}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>{"計画"}</td>
                      <td>
                        {" 対象ファイル・依存・ロジック変更を"}
                        <strong>{"実装計画アーティファクト"}</strong>
                        {"に出させる "}
                      </td>
                      <td>
                        <code>{"/plan /docs/best-practices を追加する計画を書いて"}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>{"実行"}</td>
                      <td>{"計画を承認してから編集させる"}</td>
                      <td>
                        <code>{"計画どおりに実装して"}</code>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h112">
                {"5.2 "}
                <code>{"/grill-me"}</code>
                {" と "}
                <code>{"/plan"}</code>
                {" の組み合わせ"}
              </h3>{" "}
              <ul>
                {" "}
                <li>
                  {" "}
                  <code>{"/grill-me <タスク>"}</code>
                  {" は、エージェントが"}
                  <strong>{"1問ずつ質問し、各質問に推奨回答を添えて"}</strong>
                  {"、作業前に判断事項を詰めます "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" 回答を計画に変えるには、"}
                  <code>{"/plan"}</code>
                  {" と重ねて使います "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" "}
                  <code>{"/plan"}</code>
                  {
                    " は、コードベース探索 → 要件確認 → レビュー可能な計画の作成を行います。ただし、"
                  }
                  <strong>{"変更前に対話的な承認を待つとは限りません"}</strong>
                  {"。CLI v1.4.12 では、"}
                  <code>{"/config"}</code>
                  {" の "}
                  <strong>{"Artifact Review"}</strong>
                  {" が "}
                  <code>{"always-proceed"}</code>
                  {
                    " ならレビューは自動で進み、ヘッドレス実行でも保存済みのレビュー設定が適用されます "
                  }
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。対話実行で承認を必須にするには、Artifact Review を "}
                  <code>{"asks-for-review"}</code>
                  {
                    " に明示設定し、「承認を得るまで編集しない」と依頼します。CI では人が計画を確認してから実装ジョブを起動する"
                  }
                  <strong>{"別の承認ゲート"}</strong>
                  {"を設けます "}
                  <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  {"。根拠: "}
                  <a
                    href="https://antigravity.google/docs/settings?tab=cli"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {"公式の設定"}
                  </a>
                  {"、"}
                  <a
                    href="https://antigravity.google/docs/changelog?tab=cli"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {"CLI変更履歴"}
                  </a>{" "}
                </li>{" "}
              </ul>{" "}
              <pre data-testid="code-block">
                <code className="language-markdown hljs">
                  <span className={styles.codeLine}>
                    {"/plan /grill-me ユーザー単位のレート制限をブックマークAPIに追加する"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                </code>
              </pre>{" "}
              <h3 id="antigravity-h113">{"5.3 全体フロー"}</h3>{" "}
              <div className={styles["diagram-wrap"]}>
                {" "}
                <div
                  className={styles["diagram-canvas"]}
                  data-diagram-id="d5"
                  role="img"
                  aria-label="フローチャート"
                >
                  <MermaidDiagram chart={DIAGRAM_5} theme="base" themeVariables={THEME_VARS} />
                </div>{" "}
              </div>{" "}
              <h3 id="antigravity-h114">{"5.4 使い分けの目安"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"状況"}</th>
                      <th>{"推奨"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"要件が曖昧・破壊的変更を含む"}</td>
                      <td>
                        {" "}
                        <code>{"/plan /grill-me"}</code>
                        {" を同じプロンプトで使う("}
                        <code>{"/grill-me"}</code>
                        {" だけだと、質問の後に承認なしで作業が続く) "}
                      </td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>
                          {"開発者"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"影響範囲が広い・複数ファイル"}</td>
                      <td>
                        <code>{"/plan"}</code>
                        {" で計画を承認してから実装"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"1〜2行の自明な修正"}</td>
                      <td>{"計画を省いて直接依頼"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"高コストな作業(大規模・長時間)"}</td>
                      <td>{"計画段階で止めて見積りを確認"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>{" "}
                  <code>{"/grill-me"}</code>
                  {
                    " は最初は手間に感じますが、後から修正ループに入るコストを大きく減らせます。曖昧な依頼ほど先に使ってください。 "
                  }
                </p>{" "}
              </blockquote>{" "}
            </section>
            <section className={styles.section} id="s9">
              {" "}
              <h2 id="s9-heading">{"Step 6: 検証ループを先に作る"}</h2>{" "}
              <h3 id="antigravity-h115">{"6.1 公式の最重要ルール"}</h3>{" "}
              <p>
                {" 公式のCLIベストプラクティスは、自律エージェントから"}
                <strong>
                  {
                    "信頼できる変更を得る最も効果的な方法は、ローカルで検証できる仕組み(テスト・ビルド・フォーマッタ)を渡すこと"
                  }
                </strong>
                {"だと明記しています "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <p>{"手順:"}</p>{" "}
              <ol>
                {" "}
                <li>{"ワークスペースにテストスイートを用意する。"}</li>{" "}
                <li>
                  {"テストがなければ、"}
                  <strong>{"先にテストを書かせる"}</strong>
                  {"。"}
                </li>{" "}
                <li>{"エージェントが実装したら、ローカルのテストコマンドで検証させる。"}</li>{" "}
                <li>{"実行結果を見て、エージェントが自動で反復するのを確認する。"}</li>{" "}
              </ol>{" "}
              <pre data-testid="code-block">
                <code className="language-markdown hljs">
                  <span className={styles.codeLine}>
                    {
                      "main.py に機能Xを実装して。実装後に npm test を実行し、結果を貼って報告して。"
                    }
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                </code>
              </pre>{" "}
              <h3 id="antigravity-h116">{"6.2 検証手段の階層"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"層"}</th>
                      <th>{"手段"}</th>
                      <th>{"向いている変更"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"1. 静的"}</td>
                      <td>{"型チェック、Lint、フォーマッタ"}</td>
                      <td>{"すべて"}</td>
                    </tr>
                    <tr>
                      <td>{"2. 単体・統合"}</td>
                      <td>{"テストスイート"}</td>
                      <td>{"ロジック、API"}</td>
                    </tr>
                    <tr>
                      <td>{"3. 実行確認"}</td>
                      <td>{"ローカルサーバー起動 + 組み込みブラウザ"}</td>
                      <td>{"UI、フロー"}</td>
                    </tr>
                    <tr>
                      <td>{"4. 自動ブラウザ検証"}</td>
                      <td>
                        <code>{"/browser"}</code>
                        {"(ブラウザサブエージェント)"}
                      </td>
                      <td>{"Webアプリ全般"}</td>
                    </tr>
                    <tr>
                      <td>{"5. 人間"}</td>
                      <td>{"差分・録画・スクリーンショットのレビュー"}</td>
                      <td>{"最終判断"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {
                  " ブラウザサブエージェントは、Chromeを操作してWebページのテスト・デバッグを行い、Chrome DevTools MCPとネイティブ統合され、セッションをWebM動画で録画できます "
                }
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。UIの不具合を調べるときは、スクリーンショットや録画を "}
                <code>{"ctrl+v"}</code>
                {" で添付すると、エージェントが映像を参照して診断します "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <h3 id="antigravity-h117">{"6.3 「作る側」と「確かめる側」を分ける"}</h3>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                  </strong>
                  {" Addy Osmani のLoop Engineeringでは、"}
                  <strong>{"生成するエージェントと検証するエージェントを分ける"}</strong>
                  {
                    "ことを勧めています(モデルに自分の宿題を採点させない)。実装と検証でサブエージェントを分ける設計は、Step 7で扱います。 "
                  }
                </p>{" "}
              </blockquote>{" "}
              <h3 id="antigravity-h118">{"6.4 検証プロンプトのテンプレート"}</h3>{" "}
              <pre data-testid="code-block">
                <code className="language-markdown hljs">
                  <span className="hljs-section">
                    <span className={styles.codeLine}>{"# 依頼"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"<やりたいこと>"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-section">
                    <span className={styles.codeLine}>{"# 完了条件(すべて満たしたら完了)"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"-"}</span>
                  </span>
                  <span className={styles.codeLine}>
                    {" "}
                    {"npm test が成功し、新規テストが追加されている"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"-"}</span>
                  </span>
                  <span className={styles.codeLine}>
                    {" "}
                    {"npm run lint と npm run typecheck がエラーなし"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"-"}</span>
                  </span>
                  <span className={styles.codeLine}>
                    {" "}
                    {"変更したファイル一覧と、確認できなかった点を最後に報告する"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-section">
                    <span className={styles.codeLine}>{"# 禁止"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"-"}</span>
                  </span>
                  <span className={styles.codeLine}>
                    {" "}
                    {"既存テストを削除・スキップして通すこと"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"-"}</span>
                  </span>
                  <span className={styles.codeLine}>
                    {" "}
                    {"完了条件を満たしていないのに完了と報告すること"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                </code>
              </pre>{" "}
            </section>
            <section className={styles.section} id="s10">
              {" "}
              <h2 id="s10-heading">{"Step 7: サブエージェントと並列実行"}</h2>{" "}
              <h3 id="antigravity-h119">{"7.1 サブエージェントの基本"}</h3>{" "}
              <p>
                {" メインエージェントは、調査・ビルド・テスト実行などを"}
                <strong>{"サブエージェント"}</strong>
                {"に委任できます。各サブエージェントは"}
                <strong>{"クリーンなコンテキスト"}</strong>
                {"で起動し、独立した会話として並列に動きます "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"項目"}</th>
                      <th>{"仕様"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"起動"}</td>
                      <td>
                        {"親が "}
                        <code>{"invoke_subagent"}</code>
                        {" を呼ぶ"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"作業場所"}</td>
                      <td>
                        {" "}
                        <code>{"inherit"}</code>
                        {"(親と同じ)/ "}
                        <code>{"branch"}</code>
                        {"(隔離Git worktree)/ "}
                        <code>{"share"}</code>
                        {"(ディレクトリ共有) "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"コンテキスト"}</td>
                      <td>
                        {"親の会話履歴は"}
                        <strong>{"引き継がない"}</strong>
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"組み込み"}</td>
                      <td>
                        {" "}
                        <code>{"research"}</code>
                        {"(調査)、"}
                        <code>{"browser"}</code>
                        {"("}
                        <code>{"/browser"}</code>
                        {" 経由のみ)、"}
                        <code>{"self"}</code>
                        {"(呼び出し元の複製) "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"入れ子の深さ"}</td>
                      <td>{"最大10階層"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"権限"}</td>
                      <td>
                        {" 親の許可コマンド接頭辞・ファイル範囲・サンドボックス設定を"}
                        <strong>{"継承"}</strong>{" "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"承認要求"}</td>
                      <td>{"親のUI・サブエージェントパネルに上がってくる"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h120">{"7.2 カスタムサブエージェントの定義"}</h3>{" "}
              <pre data-testid="code-block">
                <code className="language-markdown hljs">
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"name: code-auditor"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>
                    {
                      "description: セキュリティ監査・静的解析・品質レビュー用のサブエージェント。実装後の独立した検証で使う。"
                    }
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"tools:"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>
                      {"  "}
                      {"-"}
                    </span>
                  </span>
                  <span className={styles.codeLine}> {"view"}</span>
                  <span className="hljs-emphasis">
                    <span className={styles.codeLine}>{"_file"}</span>
                    <span className={styles.codeLine}>{"\n"}</span>
                    <span className={styles.codeLine}>
                      {"  "}
                      {"- grep_"}
                    </span>
                  </span>
                  <span className={styles.codeLine}>{"search"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"subagent: true"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"mainAgent: false"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"model: pro"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"commandExecutionPolicy: sandbox"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"skills:"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>
                      {"  "}
                      {"-"}
                    </span>
                  </span>
                  <span className={styles.codeLine}> {"skills/security-checklist"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-section">
                    <span className={styles.codeLine}>{"# System Prompt"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>
                    {
                      "あなたはセキュリティ監査とコードレビューの専門家です。ファイルを変更せず、脆弱性・メモリリーク・アンチパターンを検査してください。"
                    }
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-section">
                    <span className={styles.codeLine}>{"# Review Guidelines"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"1."}</span>
                  </span>
                  <span className={styles.codeLine}>
                    {" "}
                    {"明示的に求められない限り、ファイルは編集しない。"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"2."}</span>
                  </span>
                  <span className={styles.codeLine}>
                    {" "}
                    {"インジェクション、未検証入力、ハードコードされた秘密情報を指摘する。"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-bullet">
                    <span className={styles.codeLine}>{"3."}</span>
                  </span>
                  <span className={styles.codeLine}>
                    {" "}
                    {"各指摘に、簡潔で実行可能な修正案を付ける。"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                </code>
              </pre>{" "}
              <p>
                {" 出典: "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {" の例("}
                <code>{"https://antigravity.google/docs/subagents/"}</code>
                {")を、検証担当として使う想定に**"}
                <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                {"** で調整。 "}
              </p>{" "}
              <p>
                {" この検証担当はファイル閲覧・検索だけで足りるため、"}
                <code>{"run_command"}</code>
                {" を許可していません。"}
                <code>{"commandExecutionPolicy: sandbox"}</code>
                {
                  " は共有ワークスペースへの書き込みを禁止する設定ではありません。シェルが必要な検証は、ワークスペースを読み取り専用でマウントし、書き込み先を使い捨て領域へ分離した既存のコンテナや CI 環境で実行します。プロンプトの「編集しない」だけに依存しないでください "
                }
                <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                {"。 "}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"frontmatter"}</th>
                      <th>{"既定値"}</th>
                      <th>{"説明"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>{"name"}</code>
                        {" / "}
                        <code>{"description"}</code>
                      </td>
                      <td>{"必須"}</td>
                      <td>
                        <code>{"description"}</code>
                        {" は、親が委任先を決める判断材料"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"tools"}</code>
                      </td>
                      <td>
                        <code>{"[]"}</code>
                      </td>
                      <td>
                        {" 許可するツールを明示。"}
                        <strong>{"ツール名の綴り間違いはハングの原因になる既知の問題"}</strong>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"model"}</code>
                      </td>
                      <td>
                        <code>{"inherit"}</code>
                      </td>
                      <td>
                        <code>{"inherit"}</code>
                        {" / "}
                        <code>{"flash"}</code>
                        {" / "}
                        <code>{"pro"}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"commandExecutionPolicy"}</code>
                      </td>
                      <td>
                        <code>{"sandbox"}</code>
                      </td>
                      <td>
                        {" "}
                        <code>{"off"}</code>
                        {" / "}
                        <code>{"auto"}</code>
                        {" / "}
                        <code>{"eager"}</code>
                        {" / "}
                        <code>{"sandbox"}</code>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"mainAgent"}</code>
                        {" / "}
                        <code>{"subagent"}</code>
                      </td>
                      <td>
                        <code>{"true"}</code>
                      </td>
                      <td>
                        {"主エージェントとして選べるか / "}
                        <code>{"invoke_subagent"}</code>
                        {" で呼べるか"}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h121">{"7.3 実装と検証を分ける構成"}</h3>{" "}
              <div className={styles["diagram-wrap"]}>
                {" "}
                <div
                  className={styles["diagram-canvas"]}
                  data-diagram-id="d6"
                  role="img"
                  aria-label="フローチャート"
                >
                  <MermaidDiagram chart={DIAGRAM_6} theme="base" themeVariables={THEME_VARS} />
                </div>{" "}
              </div>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>{" "}
                  <code>{"branch"}</code>
                  {
                    " の変更が親ワークスペースへ自動で戻るとは、公式に書かれていません。親と同じワークスペースで検証するなら、古いコードを検証しないよう、検証の前に変更を取り込んでください。 "
                  }
                </p>{" "}
              </blockquote>{" "}
              <h3 id="antigravity-h122">{"7.4 ライフサイクルと操作"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"状態"}</th>
                      <th>{"意味"}</th>
                      <th>{"操作"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"Running"}</td>
                      <td>{"実行中"}</td>
                      <td>
                        {"停止はパネルの Stop Subagent、CLIでは "}
                        <code>{"k"}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>{"Idle"}</td>
                      <td>
                        {" 作業完了で待機。メッセージを受けると"}
                        <strong>{"文脈を保ったまま"}</strong>
                        {"再起動 "}
                      </td>
                      <td>
                        <code>{"@名前 追加指示"}</code>
                        {" で直接話しかけられる"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Killed"}</td>
                      <td>{"完全終了。一時worktreeは自動削除、履歴はJSONLで残る"}</td>
                      <td>{"再起動不可"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {"CLIの主要な操作 "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {":"}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"操作"}</th>
                      <th>{"キー / コマンド"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"状況一覧・切り替え"}</td>
                      <td>
                        <code>{"/agents"}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>{"承認待ちのサブエージェントへ移動"}</td>
                      <td>
                        <code>{"Alt"}</code>
                        {" + "}
                        <code>{"J"}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>{"画面を離れずに承認"}</td>
                      <td>
                        <code>{"Ctrl"}</code>
                        {" + "}
                        <code>{"K"}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>{"非エージェントのバックグラウンド処理"}</td>
                      <td>
                        <code>{"/tasks"}</code>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h123">{"7.5 並列化の運用ルール"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"ルール"}</th>
                      <th>{"理由"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {" 並列サブエージェントは"}
                        <strong>{"最初は2〜3体"}</strong>
                        {"にし、検証できたら"}
                        <strong>{"3〜5程度へ"}</strong>
                        {"増やす "}
                      </td>
                      <td>{"クォータが共有され、1つの目標が10以上の呼び出しに展開され得る"}</td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                        {" Addy Osmani(2〜3体) "}
                        <a href="3〜5程度">{"二次"}</a> <a href="段階の組み合わせ">
                          {"筆者推奨"}
                        </a>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"同じファイルを複数エージェントに触らせない"}</td>
                      <td>{"人間の同時コミットと同じ衝突が起きる。worktreeで隔離する"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                        {" Addy Osmani"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"サブエージェントは "}
                        <code>{"model: flash"}</code>
                        {" を基本にする"}
                      </td>
                      <td>{"コスト・速度の最適化"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"権限は親から継承されることを前提に設計する"}</td>
                      <td>{"親に広い権限を与えると全サブエージェントに及ぶ"}</td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>
                          {"二次"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"tools"}</code>
                        {" の綴りを検証する"}
                      </td>
                      <td>{"未対応の名前でハングする既知の問題がある"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </section>
            <section className={styles.section} id="s11">
              {" "}
              <h2 id="s11-heading">{"Step 8: /goal・/boost・/teamwork の使い分け"}</h2>{" "}
              <h3 id="antigravity-h124">{"8.1 コマンド比較"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"コマンド"}</th>
                      <th>{"役割"}</th>
                      <th>{"利用条件"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>{"/plan"}</code>
                      </td>
                      <td>{"探索・要件確認・計画"}</td>
                      <td>{"全プラン"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"/grill-me"}</code>
                      </td>
                      <td>{"1問ずつ質問して判断を詰める"}</td>
                      <td>{"全プラン"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"/goal <目的>"}</code>
                      </td>
                      <td>{"目標が完了するまで自律的に継続"}</td>
                      <td>{"全プラン"}</td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>
                          {"二次"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"/boost"}</code>
                      </td>
                      <td>
                        {
                          " 難問向けの3階層マルチエージェント推論(Orchestrator → DeepCoder / DeepInvestigator → ワーカー) "
                        }
                      </td>
                      <td>{"Pro / Ultra / Enterprise"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"/teamwork"}</code>
                      </td>
                      <td>
                        {
                          " 長期・大規模作業向けのエージェントチーム(マイルストーン分解・並列実装・独立検証) "
                        }
                      </td>
                      <td>{"有料プラン"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                  </strong>{" "}
                  <code>{"/teamwork"}</code>
                  {" は一部のリリースノートで "}
                  <code>{"/teamwork-preview"}</code>
                  {" と表記されています。自分の版のコマンド一覧("}
                  <code>{"/"}</code>
                  {" 入力)で確認してください。 "}
                </p>{" "}
              </blockquote>{" "}
              <h3 id="antigravity-h125">
                {"8.2 "}
                <code>{"/goal"}</code>
                {" を安全に使う"}
              </h3>{" "}
              <p>
                {" "}
                <code>{"/goal"}</code>
                {" は、ターンごとの確認なしで完了まで走るため、"}
                <strong>{"完了条件が機械的に判定できるときだけ"}</strong>
                {"有効です。 "}
              </p>{" "}
              <p>
                {" "}
                <code>{"/goal"}</code>
                {" が変えるのは停止の挙動だけで、"}
                <strong>{"ツールの権限や承認要件は変わりません"}</strong>{" "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。詳細は "}
                <a
                  href="https://antigravity.google/docs/commands/goal/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"Goal command"}
                </a>
                {
                  " を参照してください。承認が必要な操作に当たると、承認されるまで実行は止まります。 "
                }
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"条件"}</th>
                      <th>
                        {"良い "}
                        <code>{"/goal"}</code>
                      </th>
                      <th>
                        {"悪い "}
                        <code>{"/goal"}</code>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"完了が明確"}</td>
                      <td>
                        <code>{"npm test が全件成功し、lint エラーが0になるまで"}</code>
                      </td>
                      <td>
                        <code>{"コードをよくして"}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>{"範囲が限定的"}</td>
                      <td>
                        <code>{"src/billing/ 配下のみ変更してよい"}</code>
                      </td>
                      <td>{"範囲の指定なし"}</td>
                    </tr>
                    <tr>
                      <td>{"失敗時の中断を指示"}</td>
                      <td>
                        {" "}
                        <code>{"同じ失敗が3回続いたら中断して報告"}</code>
                        {"(プロンプトの指示で、強制された停止条件ではない) "}
                      </td>
                      <td>{"中断の指示なし"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" "}
                <code>{"/goal"}</code>
                {" に反復回数の上限はありません "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {
                  "。「3回で中断」はプロンプト内の指示なので、繰り返し失敗したときに止まるかどうかは、エージェントがこの指示に従うかどうかに依存します。確実に止めるには、実行時間の上限や使用量の監視など、エージェントの外から止める仕組みを併用してください "
                }
                <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                {"。 "}
              </p>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                  </strong>
                  {" ループ設計の解説(Developers Digestなど)でも、"}
                  <strong>{"終了判定・予算(回数/クォータ)・1周に含める内容"}</strong>
                  {"の3点が、エージェントの失敗の大半に関わると整理されています。"}
                  <code>{"/goal"}</code>
                  {" は「プロンプト」ではなく「ループ」として設計してください。 "}
                </p>{" "}
              </blockquote>{" "}
              <h3 id="antigravity-h126">{"8.3 エスカレーションの考え方"}</h3>{" "}
              <div className={styles["diagram-wrap"]}>
                {" "}
                <div
                  className={styles["diagram-canvas"]}
                  data-diagram-id="d7"
                  role="img"
                  aria-label="フローチャート"
                >
                  <MermaidDiagram chart={DIAGRAM_7} theme="base" themeVariables={THEME_VARS} />
                </div>{" "}
              </div>{" "}
            </section>
            <section className={styles.section} id="s12">
              {" "}
              <h2 id="s12-heading">{"Step 9: Automations と /schedule"}</h2>{" "}
              <h3 id="antigravity-h127">{"9.1 2種類の「予約実行」"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"機能"}</th>
                      <th>{"対象"}</th>
                      <th>{"用途"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{"Automations"}</strong>
                        {"(旧 scheduled tasks)"}
                      </td>
                      <td>{"App"}</td>
                      <td>
                        {" プロジェクトに対し、"}
                        <strong>{"スケジュールで会話を開始"}</strong>
                        {"する(不在中も実行) "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <strong>
                          <code>{"/schedule"}</code>
                        </strong>{" "}
                      </td>
                      <td>{"App / CLI"}</td>
                      <td>
                        <strong>{"1つの会話の中"}</strong>
                        {"でのタイマーや定期チェック"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {"Automationsの仕様 "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {":"}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"項目"}</th>
                      <th>{"内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"繰り返し"}</td>
                      <td>{"時間ベースのトリガーで定期的に会話を開始"}</td>
                    </tr>
                    <tr>
                      <td>{"モデル階層"}</td>
                      <td>{"自動化ごとに Flash Lite / Flash(既定)/ Pro を選択"}</td>
                    </tr>
                    <tr>
                      <td>{"実行時刻"}</td>
                      <td>
                        {" 正確な分ではなく"}
                        <strong>{"おおよそ"}</strong>
                        {"。間隔の最大10%(上限15分)までばらつく "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"手動実行"}</td>
                      <td>
                        {" メニューの "}
                        <strong>{"Run Now"}</strong>
                        {"。"}
                        <strong>{"Create with Prompt"}</strong>
                        {" で作成をエージェントに案内させられる "}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h128">{"9.2 無人化は段階的に進める"}</h3>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                  </strong>
                  {
                    " Addy Osmani は、Loop Engineering(2026-06-07)で、ループを成立させる要素としてAutomations(スケジュール)、worktree、スキル、プラグイン/コネクタ、サブエージェントの5つを挙げています。AntigravityにはこれらのプリミティブがApp内に揃っています。 同様に、コミュニティの参照リポジトリでは「レポートのみ → 修正支援 → 無人実行」と段階的に展開する進め方が示されています "
                  }
                  <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                  {"。 "}
                </p>{" "}
              </blockquote>{" "}
              <div className={styles["diagram-wrap"]}>
                {" "}
                <div
                  className={styles["diagram-canvas"]}
                  data-diagram-id="d8"
                  role="img"
                  aria-label="フローチャート"
                >
                  <MermaidDiagram chart={DIAGRAM_8} theme="base" themeVariables={THEME_VARS} />
                </div>{" "}
              </div>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"段階"}</th>
                      <th>{"内容"}</th>
                      <th>{"権限"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"L1: レポートのみ"}</td>
                      <td>
                        {"失敗CI・古い依存・未解決Issueを"}
                        <strong>{"調べて報告するだけ"}</strong>
                      </td>
                      <td>{"読み取りのみ"}</td>
                    </tr>
                    <tr>
                      <td>{"L2: 修正案"}</td>
                      <td>
                        {"worktreeで修正し、"}
                        <strong>{"PR下書きまで"}</strong>
                        {"。人間が承認"}
                      </td>
                      <td>
                        {
                          " ローカルの書き込みはworktreeのみ。ブランチのpushとPR下書きの作成にはリモートへの書き込み権限が要るので、自動で作るなら範囲を限ったリモート書き込み権限を明示的に許可する。許可しない場合、pushとPR作成は人間が行う "
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{"L3: 無人修正"}</td>
                      <td>{"信頼できる定型作業だけ、基準を満たしたら自動PR"}</td>
                      <td>{"検証サブエージェント必須"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" "}
                <strong>
                  <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                </strong>
                {" の運用: "}
              </p>{" "}
              <ul>
                {" "}
                <li>
                  {" 一次処理(分類・要約)は Flash Lite / Flash、修正は Pro、と"}
                  <strong>{"階層を分ける"}</strong>
                  {"。 "}
                </li>{" "}
                <li>
                  {" Automationsにも権限設定は効く。"}
                  <strong>{"設定を変えても既存タスクは書き換わらない"}</strong>
                  {"との報告があるため "}
                  <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                  {"、権限変更後は既存の自動化を見直す。 "}
                </li>{" "}
                <li>
                  {
                    " 「人間が最終ゲートを持つ」設計にする。Addy Osmaniの7月のフォローアップは、エージェントが内側のループを回し、"
                  }
                  <strong>{"品質判断と出荷判断は人間が外側のループで持つ"}</strong>
                  {"べきだと整理しています "}
                  <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                  <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                  {"。 "}
                </li>{" "}
              </ul>{" "}
            </section>
            <section className={styles.section} id="s13">
              {" "}
              <h2 id="s13-heading">{"Step 10: MCP・プラグイン・フック"}</h2>{" "}
              <h3 id="antigravity-h129">{"10.1 拡張の全体像"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"仕組み"}</th>
                      <th>{"役割"}</th>
                      <th>{"配置・操作"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{"MCP"}</strong>
                      </td>
                      <td>{"ローカルツール・DB・リモートAPIへの接続"}</td>
                      <td>
                        {"設定ファイル、"}
                        <code>{"/mcp"}</code>
                        {"(CLI)"}
                      </td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>
                          {"二次"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"プラグイン"}</strong>
                      </td>
                      <td>{"skills / agents / rules / MCP / hooks を1単位で配布"}</td>
                      <td>
                        {"App: Customizations → Marketplace。CLI: "}
                        <code>{"agy plugin ..."}</code>
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"JSONフック"}</strong>
                      </td>
                      <td>{"実行サイクルの要所でローカルのシェルスクリプトを実行"}</td>
                      <td>{"グローバルまたはワークスペースのJSON"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h130">{"10.2 MCPの権限設計"}</h3>{" "}
              <ul>
                {" "}
                <li>
                  {" 未設定のMCPツールは"}
                  <strong>{"既定で確認"}</strong>
                  {"になります "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" 権限は "}
                  <code>{"mcp(サーバー/ツール)"}</code>
                  {"、"}
                  <code>{"mcp(サーバー/*)"}</code>
                  {"、"}
                  <code>{"mcp(*)"}</code>
                  {" で指定します "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
              </ul>{" "}
              <pre data-testid="code-block">
                <code className="language-json hljs">
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"{"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"  "}</span>
                  <span className="hljs-attr">
                    <span className={styles.codeLine}>{'"permissions"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{":"}</span>
                  </span>
                  <span className={styles.codeLine}> </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"{"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"    "}</span>
                  <span className="hljs-attr">
                    <span className={styles.codeLine}>{'"allow"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{":"}</span>
                  </span>
                  <span className={styles.codeLine}> </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"["}</span>
                  </span>
                  <span className="hljs-string">
                    <span className={styles.codeLine}>{'"mcp(linter/*)"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"]"}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{","}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"    "}</span>
                  <span className="hljs-attr">
                    <span className={styles.codeLine}>{'"ask"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{":"}</span>
                  </span>
                  <span className={styles.codeLine}> </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"["}</span>
                  </span>
                  <span className="hljs-string">
                    <span className={styles.codeLine}>{'"mcp(sql/execute_mutation)"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"]"}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{","}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"    "}</span>
                  <span className="hljs-attr">
                    <span className={styles.codeLine}>{'"deny"'}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{":"}</span>
                  </span>
                  <span className={styles.codeLine}> </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"["}</span>
                  </span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"]"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"  "}</span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"}"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-punctuation">
                    <span className={styles.codeLine}>{"}"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                </code>
              </pre>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>
                  {" 「読み取り系は許可、更新系は確認」を原則にしてください。"}
                  <code>{"mcp(*)"}</code>
                  {" の一括許可は避けます。 "}
                </p>{" "}
              </blockquote>{" "}
              <h3 id="antigravity-h131">{"10.3 プラグインの導入と運用"}</h3>{" "}
              <pre data-testid="code-block">
                <code className="language-bash hljs">
                  <span className={styles.codeLine}>{"agy plugin list"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>
                    {"agy plugin install <plugin-name>      "}
                  </span>
                  <span className="hljs-comment">
                    <span className={styles.codeLine}>
                      {"# 公式マーケットプレイスの既定は antigravity-plugins-official"}
                    </span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>
                    {"agy plugin install https://github.com/<owner>/<repo>"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>
                    {"agy plugin validate /path/to/plugin   "}
                  </span>
                  <span className="hljs-comment">
                    <span className={styles.codeLine}>
                      {"# 自作・外部プラグインの検証(Addy Osmaniのセットアップ手順でも使用)"}
                    </span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                </code>
              </pre>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"運用ルール"}</th>
                      <th>{"理由"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{"サードパーティ製プラグインは中身を確認してから"}</strong>
                        {"入れる"}
                      </td>
                      <td>
                        {
                          " スキル・フック・MCPを一括で持ち込むため、実質的に任意のコード実行経路になる "
                        }
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Appで入れたプラグインはCLIにも反映される"}</td>
                      <td>
                        {"設定が共有される "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"外部サービス連携は、認証後に権限("}
                        <code>{"mcp(...)"}</code>
                        {")を絞る"}
                      </td>
                      <td>
                        {" 既定は確認だが、一括許可で崩れやすい "}
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                  </strong>
                  {
                    " 2026年11月のMarketplaceにはパートナー製プラグインが追加されています(Figma、Linear、Notion、Stripe など)。コードレビュー系(CodeRabbit など)のプラグインは、"
                  }
                  <strong>{"Antigravity側のターミナル権限とサンドボックスの対象"}</strong>
                  {"になります。事前承認したい場合は、許可ルールを設定します。 "}
                </p>{" "}
              </blockquote>{" "}
              <h3 id="antigravity-h132">{"10.4 フックの使いどころ"}</h3>{" "}
              <p>
                {
                  " フックは、ツール呼び出しの前、モデル応答の後、ループの停止条件で処理を差し込めます "
                }
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"用途"}</th>
                      <th>{"例"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"実行前ガード"}</td>
                      <td>{"禁止パターンのコマンドや秘密情報を含む出力を事前に止める"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"実行後チェック"}</td>
                      <td>{"編集後に自動でフォーマッタ・Lintを走らせる"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"停止条件の強制"}</td>
                      <td>{"「テスト未実行では完了としない」をスクリプトで担保する"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </section>
            <section className={styles.section} id="s14">
              {" "}
              <h2 id="s14-heading">{"Step 11: Remote Control・Remote Agents・Voice mode"}</h2>{" "}
              <h3 id="antigravity-h133">{"11.1 Remote Control と Remote Agents の違い"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"観点"}</th>
                      <th>{"Remote Control"}</th>
                      <th>{"Remote Agents"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"実行場所"}</td>
                      <td>
                        {" "}
                        <strong>{"自分のマシン"}</strong>
                        {"(ローカルのファイル・ツール・認証情報・worktreeをそのまま使う) "}
                      </td>
                      <td>
                        <strong>{"Googleが管理する隔離環境"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{"目的"}</td>
                      <td>
                        {"長時間作業を"}
                        <strong>{"外出先から監視・承認"}</strong>
                      </td>
                      <td>
                        {"PCをスリープ/オフにしても"}
                        <strong>{"作業を継続"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{"作業対象"}</td>
                      <td>{"ローカルのワークスペース"}</td>
                      <td>
                        {
                          " リモートプロジェクト(GitHubリポジトリ、Google Driveファイル、アップロード) "
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{"利用条件"}</td>
                      <td>{"設定で有効化"}</td>
                      <td>
                        <strong>{"Google AI Pro / Ultra"}</strong>
                        {"(個人のGoogleアカウント)"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"アクセス"}</td>
                      <td>{"任意のWebブラウザ、プッシュ通知"}</td>
                      <td>
                        {"App、CLI、"}
                        <code>{"antigravity.google.com"}</code>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" 出典: "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>{" "}
                <code>{"https://antigravity.google/docs/features/"}</code>{" "}
              </p>{" "}
              <pre data-testid="code-block">
                <code className="language-bash hljs">
                  <span className="hljs-comment">
                    <span className={styles.codeLine}>{"# Remote Control"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"agy --remote-control              "}</span>
                  <span className="hljs-comment">
                    <span className={styles.codeLine}>{"# 新規セッションで有効化"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"agy remote-control start          "}</span>
                  <span className="hljs-comment">
                    <span className={styles.codeLine}>
                      {"# 常時待機のヘッドレスCLI(OSのサービスとして登録)"}
                    </span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"agy remote-control stop           "}</span>
                  <span className="hljs-comment">
                    <span className={styles.codeLine}>
                      {"# 常時待機サービスを停止し、登録も解除"}
                    </span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-comment">
                    <span className={styles.codeLine}>
                      {
                        "# 現在のセッションだけ: /remote-control で有効化、/remote-control off で解除"
                      }
                    </span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className="hljs-comment">
                    <span className={styles.codeLine}>{"# Remote Agents"}</span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                  <span className={styles.codeLine}>
                    {"agy --remote-agent --project <remote_project_id>"}
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                </code>
              </pre>{" "}
              <ul>
                {" "}
                <li>
                  {" "}
                  <strong>{"Remote Controlの止め方"}</strong>
                  {": 常時待機サービスを止めるのは "}
                  <code>{"agy remote-control stop"}</code>
                  {" です。"}
                  <code>{"/remote-control off"}</code>
                  {
                    " は現在のセッションのトンネルを切断するだけで、公式の説明にサービスの停止は含まれません "
                  }
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" "}
                  <strong>{"Remote Agentsの接続先"}</strong>
                  {": "}
                  <code>{"--project"}</code>
                  {" に存在しないプロジェクトIDや名前を指定すると、CLIは "}
                  <code>{"Project Not Found"}</code>
                  {" の警告を出し、このマシンの既定のリモートプロジェクト("}
                  <code>{"CLI Project (<hostname>)"}</code>
                  {")を使います "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。プロンプトを送る前に、"}
                  <code>{"/projects"}</code>
                  {" でプロジェクトを確認し、ステータスラインの "}
                  <code>{"remote"}</code>
                  {" とプロジェクト名が意図した接続先と一致することを確かめてください "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" "}
                  <strong>{"Remote Agentsの権限"}</strong>
                  {
                    ": リモートセッションの権限はローカルとは別で、リモートエージェントの設定に従います。既定のプリセットは "
                  }
                  <code>{"always-proceed (turbo)"}</code>
                  {" なので、ローカルの "}
                  <code>{"deny"}</code>
                  {" ルールが適用されるとは限りません。リモートセッションで "}
                  <code>{"/config"}</code>
                  {" の Remote Agent タブからプリセットを、"}
                  <code>{"/permissions"}</code>
                  {" からリモートのルールを確認してください "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
              </ul>{" "}
              <p>
                {" 出典: "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>{" "}
                <code>{"https://antigravity.google/docs/remote-control/"}</code>
                {"、"}
                <code>{"https://antigravity.google/docs/remote-agents/"}</code>{" "}
              </p>{" "}
              <h3 id="antigravity-h134">{"11.2 選び方"}</h3>{" "}
              <div className={styles["diagram-wrap"]}>
                {" "}
                <div
                  className={styles["diagram-canvas"]}
                  data-diagram-id="d9"
                  role="img"
                  aria-label="フローチャート"
                >
                  <MermaidDiagram chart={DIAGRAM_9} theme="base" themeVariables={THEME_VARS} />
                </div>{" "}
              </div>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>
                  {
                    " 機密性の高いコードは、Remote Agents でも Remote Control でも、適用される利用規約と組織のポリシーを確認してから扱ってください。Remote Control はローカルで実行しますが、データがローカルにとどまることを保証するものではありません。 "
                  }
                </p>{" "}
              </blockquote>{" "}
              <h3 id="antigravity-h135">{"11.3 Voice mode(2026-11-03〜、段階的展開)"}</h3>{" "}
              <ul>
                {" "}
                <li>
                  {" "}
                  <strong>{"Gemini Live"}</strong>
                  {
                    "による双方向の音声会話で、タスクの指示、実行中の補足・修正、停止の指示ができます "
                  }
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" 権限プロンプトへの許可/拒否や質問への回答も音声でできますが、"}
                  <strong>{"破壊的な操作は画面でのクリックが必要"}</strong>
                  {"です "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" 既定では静かに作業し、進捗報告の頻度は指示で変えられます "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" CLIは "}
                  <code>{"/voice live"}</code>
                  {"(または "}
                  <code>{"F6"}</code>
                  {")で音声会話、"}
                  <code>{"/voice dictate"}</code>
                  {"(または "}
                  <code>{"F5"}</code>
                  {")で音声入力です。企業アカウントのCLIでは音声入力は利用できません "}
                  <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                  {"。 "}
                </li>{" "}
              </ul>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>
                  {" 音声でも承認が通せるため、"}
                  <strong>
                    {"権限設計(Step 2)が甘いまま使うと、誤認識がそのまま実行に繋がります"}
                  </strong>
                  {"。Request ReviewまたはDefaultで使い始めてください。 "}
                </p>{" "}
              </blockquote>{" "}
            </section>
            <section className={styles.section} id="s15">
              {" "}
              <h2 id="s15-heading">{"Step 12: レビューとアーティファクト"}</h2>{" "}
              <h3 id="antigravity-h136">{"12.1 App のレビュー機能"}</h3>{" "}
              <p>
                {" AppのGitネイティブな "}
                <strong>{"Review"}</strong>
                {" ペインでは、次ができます "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"機能"}</th>
                      <th>{"内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"比較ビュー"}</td>
                      <td>
                        {
                          " Uncommitted(未コミット)/ Branch(ブランチ全体)/ Agent Edits(エージェントが編集したファイル) "
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{"ファイル操作"}</td>
                      <td>{"ステージ、アンステージ、未ステージ変更の破棄"}</td>
                    </tr>
                    <tr>
                      <td>{"リポジトリ操作"}</td>
                      <td>{"コミット(メッセージ空欄なら自動生成)、Amend、Push"}</td>
                    </tr>
                    <tr>
                      <td>{"フィードバック"}</td>
                      <td>{"差分の行にコメントして、エージェントに修正を指示"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" CLIでは "}
                <code>{"/diff"}</code>
                {" で、作業ツリー・コミット履歴・"}
                <strong>{"ターンごとの変更"}</strong>
                {"を見られ、行コメントで次の指示を出せます "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <h3 id="antigravity-h137">{"12.2 アーティファクトで「信頼」を作る"}</h3>{" "}
              <p>
                {
                  " エージェントは生のツール呼び出しではなく、タスクリスト・実装計画・スクリーンショット・ブラウザ録画といった"
                }
                <strong>{"検証可能な成果物(アーティファクト)"}</strong>
                {" を出します "}
                <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                {
                  "。公式ドキュメントには、実装計画・ウォークスルー・スクリーンショットの各アーティファクトの解説があります "
                }
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"使い方"}</th>
                      <th>{"内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"計画アーティファクトを承認の単位にする"}</td>
                      <td>{"実行前に、対象ファイル・依存・変更方針を人間が確認する(Step 5)"}</td>
                    </tr>
                    <tr>
                      <td>{"ウォークスルーで変更の意図を読む"}</td>
                      <td>{"コードを読む前に、変更の全体像を把握する"}</td>
                    </tr>
                    <tr>
                      <td>{"コメントで差し戻す"}</td>
                      <td>
                        {
                          " 計画・差分・成果物に対するインラインのコメントで修正を依頼(音声入力も可) "
                        }
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h138">{"12.3 メンションと引用で、文脈を狭く正確に渡す"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"操作"}</th>
                      <th>{"App"}</th>
                      <th>{"CLI"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"ファイル・フォルダ・ルール・過去会話の参照"}</td>
                      <td>
                        <code>{"@"}</code>
                      </td>
                      <td>
                        <code>{"@"}</code>
                        {"(ファイルとディレクトリ)"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"応答・差分・成果物の一部を次の発言へ"}</td>
                      <td>
                        {"選択して "}
                        <strong>{"Quote"}</strong>
                      </td>
                      <td>{"—"}</td>
                    </tr>
                    <tr>
                      <td>{"組み込みブラウザ上の文面を指す"}</td>
                      <td>
                        {"選択して "}
                        <strong>{"Comment"}</strong>
                        {"("}
                        <code>{"C"}</code>
                        {")/ "}
                        <strong>{"Quote"}</strong>
                      </td>
                      <td>{"—"}</td>
                    </tr>
                    <tr>
                      <td>{"特定サブエージェントへ直接指示"}</td>
                      <td>
                        <code>{"@サブエージェント名"}</code>
                      </td>
                      <td>
                        <code>{"@サブエージェント名"}</code>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" 出典: "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>{" "}
                <code>{"https://antigravity.google/docs/features/"}</code>{" "}
              </p>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>
                  {" 「探させる」より「指す」。"}
                  <code>{"@"}</code>
                  {" でパスを渡すほうが、トークンも誤読も減ります。 "}
                </p>{" "}
              </blockquote>{" "}
            </section>
            <section className={styles.section} id="s16">
              {" "}
              <h2 id="s16-heading">{"Step 13: CLI運用(セッション管理・ヘッドレス・CI)"}</h2>{" "}
              <h3 id="antigravity-h139">{"13.1 セッションを制御するコマンド"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"操作"}</th>
                      <th>{"コマンド"}</th>
                      <th>{"用途"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"中断"}</td>
                      <td>
                        <code>{"esc"}</code>
                      </td>
                      <td>{"誤った検索や逸脱に気づいたら即座に止める"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"巻き戻し"}</td>
                      <td>
                        <code>{"/rewind"}</code>
                        {"("}
                        <code>{"/undo"}</code>
                        {")"}
                      </td>
                      <td>{"ビルドエラーが積み重なったとき、安定した時点へ戻す"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"分岐"}</td>
                      <td>
                        <code>{"/fork"}</code>
                      </td>
                      <td>
                        {
                          " 安定した地点から複製セッションで実験する。複製されるのは会話だけで、ローカルのファイルは複製されない。失敗したら "
                        }
                        <code>{"/resume"}</code>
                        {
                          " で会話を戻せるが、作業ツリーの変更は元に戻らない。ブランチを切るだけでは作業ツリーのファイルは分離されない。ファイルも分離するには、実験用に別の "
                        }
                        <code>{"git worktree"}</code>
                        {
                          " を使う。同じ作業ツリーでブランチを切り替えるなら、先に実験の変更をコミットするか stash する "
                        }
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"別プロジェクトへ分岐"}</td>
                      <td>
                        <code>{"/fork <project_id>"}</code>
                      </td>
                      <td>{"会話のコピーを別プロジェクトで続ける"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"再開"}</td>
                      <td>
                        <code>{"/resume"}</code>
                        {" / "}
                        <code>{"--conversation"}</code>
                      </td>
                      <td>{"その会話のプロジェクトで再開"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"文脈の確認"}</td>
                      <td>
                        <code>{"/context"}</code>
                      </td>
                      <td>{"文脈の使用状況を確認"}</td>
                      <td>
                        <a href="コマンド一覧">{"公式"}</a>
                      </td>
                    </tr>
                    <tr>
                      <td>{"クォータ確認"}</td>
                      <td>
                        <code>{"/usage"}</code>
                      </td>
                      <td>{"使用量とレート制限"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"Appへ引き継ぎ"}</td>
                      <td>
                        <code>{"/export"}</code>
                      </td>
                      <td>{"CLIセッションをAppのGUIで続行"}</td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>
                          {"二次"}
                        </span>{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h140">{"13.2 ヘッドレス実行(スクリプト・CI)"}</h3>{" "}
              <p>
                {" "}
                <code>{"-p"}</code>
                {"("}
                <code>{"--print"}</code>
                {" / "}
                <code>{"--prompt"}</code>
                {")で1回だけ実行して終了します。機械可読な出力も得られます "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
              <pre data-testid="code-block">
                <code className="language-bash hljs">
                  <span className={styles.codeLine}>{"agy -p "}</span>
                  <span className="hljs-string">
                    <span className={styles.codeLine}>
                      {
                        '"このgit diffをレビューして、Conventional Commits形式のコミットメッセージ案を書いて"'
                      }
                    </span>
                  </span>
                  <span className={styles.codeLine}>{"\n"}</span>
                </code>
              </pre>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"CIでの注意"}</th>
                      <th>{"理由"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {" "}
                        <strong>{"必要な許可ルールだけ"}</strong>
                        {"を事前に定義し、実行後は "}
                        <code>{"stderr"}</code>
                        {" の拒否通知を確認する "}
                      </td>
                      <td>
                        {" 承認できない操作は待たずに soft-deny され、実行は続いて終了コード "}
                        <code>{"0"}</code>
                        {
                          " で終わるため、終了コードだけでは拒否を検知できない(公式のヘッドレス文書の記載。v1.4.12 の変更履歴には個別の記載なし) "
                        }
                      </td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <code>{"always-proceed"}</code>
                        {" / "}
                        <code>{"--dangerously-skip-permissions"}</code>
                        {" を使わない "}
                      </td>
                      <td>{"承認を丸ごと切るため"}</td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>
                          {"二次"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"出力をそのままマージ判断に使わない"}</td>
                      <td>{"検証は別のゲート(テスト・人間)で行う"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {" 印刷モードでスラッシュコマンド展開を止めたいなら "}
                        <code>{"--disable-slash-commands"}</code>{" "}
                      </td>
                      <td>{"想定外のスキル展開を避ける"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h141">{"13.3 エディタ連携(ACP)"}</h3>{" "}
              <p>
                {
                  " Agent Client Protocol(ACP)で、Zedなど対応エディタからAntigravityを呼べます。公式には、VS Code、Visual Studio、JetBrains、Zed、Xcode、Eclipse向けの拡張のドキュメントがあります "
                }
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>
                {"。 "}
              </p>{" "}
            </section>
            <section className={styles.section} id="s17">
              {" "}
              <h2 id="s17-heading">{"Step 14: SDKで独自エージェントを作る"}</h2>{" "}
              <h3 id="antigravity-h142">{"14.1 SDKの位置づけ"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"項目"}</th>
                      <th>{"内容"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"言語"}</td>
                      <td>
                        {" Python("}
                        <code>{"pip install google-antigravity"}</code>
                        {")。Dart向けのクライアントSDKパッケージ(pub.dev)も公開されている "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"ライセンス"}</td>
                      <td>{"Apache 2.0(研究プレビュー扱いとの報告)"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"主な構成"}</td>
                      <td>
                        {"ポリシーエンジン、フック、MCP、スキル、サブエージェント、構造化出力"}
                      </td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                        {" / "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        {"ドキュメント構成 "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"実体"}</td>
                      <td>{"オープンソースのPythonラッパー + 同梱のクローズドなGoバイナリ"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"関連"}</td>
                      <td>
                        {"Gemini API側の"}
                        <strong>{"Managed Agents"}</strong>
                        {"(隔離サンドボックスで実行)"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <pre data-testid="code-block">
                <code className="language-bash hljs">
                  <span className={styles.codeLine}>{"pip install google-antigravity"}</span>
                  <span className={styles.codeLine}>{"\n"}</span>
                </code>
              </pre>{" "}
              <h3 id="antigravity-h143">{"14.2 直近の主な変更(Python SDK 0.1.18 / 2026-09-21)"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"変更"}</th>
                      <th>{"内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"ローカルモデル"}</td>
                      <td>{"LiteRT 設定とローカルOpenAI互換設定が正式に利用可能"}</td>
                    </tr>
                    <tr>
                      <td>{"評価用プリセット"}</td>
                      <td>
                        {" "}
                        <code>{"AgentConfig.eval()"}</code>
                        {
                          ": 自律許可・ベンチ向けリトライ・コマンドのデーモン実行を設定し、画像生成とサブエージェントを外してコーディング能力の評価に集中 "
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{"サブエージェント別モデル"}</td>
                      <td>{"親とは独立にモデルを指定可能"}</td>
                    </tr>
                    <tr>
                      <td>{"scheduleツール"}</td>
                      <td>
                        {
                          " 標準のツール群で既定有効。エージェントとサブエージェントがタイマーやcron型のバックグラウンドジョブを設定可能 "
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{"Vertex AI"}</td>
                      <td>{"サービス階層の扱いが拡張"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" 出典: "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>{" "}
                <code>
                  {"https://github.com/google-antigravity/antigravity-sdk-python/discussions/216"}
                </code>{" "}
              </p>{" "}
              <h3 id="antigravity-h144">{"14.3 SDK運用の勘所"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"勘所"}</th>
                      <th>{"理由"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {"バージョンを"}
                        <strong>{"固定"}</strong>
                        {"する(0.1.x)"}
                      </td>
                      <td>{"設定クラスが短期間で大きく変わっている(例: モデル設定の再設計)"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                        {" pub.dev の変更履歴"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"ポリシーを"}
                        <strong>{"拒否基本"}</strong>
                        {"で組む"}
                      </td>
                      <td>{"Appと同じく、操作を許可・確認・拒否で評価する設計思想"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        {"の権限モデル"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"フックで監査ログを残す"}</td>
                      <td>{"ステップ前後のフックで、ツール呼び出しを記録できる"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"構造化出力を使う"}</td>
                      <td>{"後段の処理(CI、チケット連携)を安定させる"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        {"ドキュメント構成"}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>
                  {" 社内ツールにする場合は、"}
                  <strong>{"CLIのヘッドレス実行で足りないか"}</strong>
                  {
                    "を先に検討してください。SDKは、独自のUIやポリシー、複数エージェントのオーケストレーションが必要なときに価値が出ます。 "
                  }
                </p>{" "}
              </blockquote>{" "}
            </section>
            <section className={styles.section} id="s18">
              {" "}
              <h2 id="s18-heading">{"Step 15: セキュリティ硬化"}</h2>{" "}
              <h3 id="antigravity-h145">{"15.1 なぜ重要か: 「致命的な三要素」"}</h3>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                  </strong>
                  {
                    " Simon Willison は、エージェントに**(1)機密データへのアクセス、(2)信頼できない入力への露出、(3)外部への通信手段**の3つがそろうと、データ流出が構造的に起こり得ると整理しています(lethal trifecta)。 "
                  }
                </p>{" "}
              </blockquote>{" "}
              <div className={styles["diagram-wrap"]}>
                {" "}
                <div
                  className={styles["diagram-canvas"]}
                  data-diagram-id="d10"
                  role="img"
                  aria-label="フローチャート"
                >
                  <MermaidDiagram chart={DIAGRAM_10} theme="base" themeVariables={THEME_VARS} />
                </div>{" "}
              </div>{" "}
              <h3 id="antigravity-h146">{"15.2 Antigravityでの実例(2025-11の指摘)"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"年月"}</th>
                      <th>{"指摘者"}</th>
                      <th>{"内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"2025-11"}</td>
                      <td>{"PromptArmor"}</td>
                      <td>
                        {
                          " Web上の「連携ガイド」に隠した指示(1pxの文字)で、ワークスペースの資格情報とコードを収集させ、ブラウザサブエージェントで外部サイトへ送出させる攻撃連鎖 "
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{"2025-11"}</td>
                      <td>{"PromptArmor"}</td>
                      <td>
                        {"ブラウザの許可リストに、ログ収集に悪用できるドメインが含まれていた"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"2025-11"}</td>
                      <td>{"PromptArmor"}</td>
                      <td>
                        {" "}
                        <code>{".gitignore"}</code>
                        {" 対象ファイルの読み取り制限が、シェルコマンド経由で回避された "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"2025-11"}</td>
                      <td>{"Johann Rehberger"}</td>
                      <td>{"他の関連する脆弱性を報告(「Antigravity Grounded!」)"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" 出典: "}
                <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                {
                  " Simon Willison の紹介記事と、PromptArmor・Johann Rehberger の元記事(参考URL一覧を参照) "
                }
              </p>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                  </strong>
                  {" Willison によれば、当時Googleはこれらを既知の問題として扱っていました。"}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>
                  {
                    " 現行版(2.x)ではサンドボックスや権限モデルが大きく更新されていますが、修正状況は自分で検証できていない限り「対策済み」とは考えないでください。 "
                  }
                </p>{" "}
              </blockquote>{" "}
              <h3 id="antigravity-h147">{"15.3 多層防御チェックリスト"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"層"}</th>
                      <th>{"対策"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"資格情報"}</td>
                      <td>
                        {" "}
                        <strong>
                          {"エージェントから見える資格情報は、非本番・厳しい利用上限付き"}
                        </strong>
                        {"にする "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                        {" Simon Willison"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"資格情報"}</td>
                      <td>
                        {" "}
                        <code>{".env"}</code>
                        {" をワークスペース外へ置く。ワークスペース内に残す場合は、"}
                        <code>{"read_file"}</code>
                        {" と "}
                        <code>{"write_file"}</code>
                        {" の両方を "}
                        <code>{"deny"}</code>
                        {
                          " に入れる。ターミナルサンドボックスを無効にした構成では、コマンドはホストで動く。サンドボックスが有効でも、サンドボックス外での実行を認めたコマンド("
                        }
                        <code>{"command"}</code>
                        {" の allow ルール(ビジネス・企業アカウントは "}
                        <code>{"unsandboxed"}</code>
                        {")、承認した実行要求、"}
                        <code>{"auto"}</code>
                        {
                          " モードの自動判定)はホストで動く。どちらの場合も、これらのルールでは承認済みのコマンドによる "
                        }
                        <code>{".env"}</code>
                        {
                          " の読み取りを防げない場合がある。こうした実行を認める構成での保護は、ファイルの保存場所(コマンドの実行ユーザーが読めない場所)で確保する "
                        }
                      </td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        {"の実行モデル "}
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"通信"}</td>
                      <td>
                        {" "}
                        <code>{"read_url"}</code>
                        {" の許可は"}
                        <strong>{"必要なドメインだけ"}</strong>
                        {"(サンドボックスの外向き通信に直結) "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"通信"}</td>
                      <td>
                        {" "}
                        <code>{"command(regex:(.*/)?curl .*)"}</code>
                        {" を "}
                        <code>{"ask"}</code>
                        {" に入れ、実行のたびに確認する。公式の例の "}
                        <code>{"command(regex:curl .*)"}</code>
                        {" は "}
                        <code>{"/usr/bin/curl"}</code>
                        {" のような絶対パス指定に一致しない。CLI 1.5.2 のヘッドレス実行("}
                        <code>{"allow"}</code>
                        {" は "}
                        <code>{"command(*)"}</code>
                        {")での単発の観察では、公式の例では "}
                        <code>{"/usr/bin/curl --version"}</code>
                        {" が確認なしで実行され、上の形では "}
                        <code>{"curl"}</code>
                        {" と "}
                        <code>{"/usr/bin/curl"}</code>
                        {" の両方が "}
                        <code>{"ask"}</code>
                        {
                          " に一致した(ヘッドレスは確認を出せないので拒否される)。本ガイドの基準の CLI v1.4.12 やほかの版では確認していないので、使う版で確かめる。このルールで止まるのは "
                        }
                        <code>{"curl"}</code>
                        {" だけで、"}
                        <code>{"wget"}</code>
                        {
                          " やスクリプト言語からの通信は止まらない。ターミナルのコマンドの外向き通信は "
                        }
                        <code>{"read_url"}</code>
                        {
                          " の許可とサンドボックスで絞る。ただし、これらが外向き通信のすべてを制限するわけではない。ブラウザのサブエージェントがページを開くときは "
                        }
                        <code>{"read_url"}</code>
                        {" ではなく "}
                        <code>{"execute_url"}</code>
                        {" で判定され、MCP ツールは "}
                        <code>{"mcp"}</code>
                        {
                          " のルールで判定される。ブラウザと MCP の権限は、それぞれ別に絞る。優先順位は Deny > Ask > Allow なので、"
                        }
                        <code>{"deny"}</code>
                        {" や "}
                        <code>{"ask"}</code>
                        {" を個別の "}
                        <code>{"allow"}</code>
                        {" で緩めることはできない。例外を認めない場合だけ "}
                        <code>{"deny"}</code>
                        {" にする "}
                      </td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        {"の優先順位 "}
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"実行"}</td>
                      <td>{"Default / Auto を使い、Turboを避ける"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"破壊"}</td>
                      <td>
                        {" "}
                        <code>{"command(rm -rf)"}</code>
                        {"、"}
                        <code>{"command(sudo)"}</code>
                        {"、"}
                        <code>{"write_file(.git/)"}</code>
                        {"、"}
                        <code>{"write_file(<HOME>/.ssh)"}</code>
                        {"("}
                        <code>{"<HOME>"}</code>
                        {" は自分のホームの絶対パス)を "}
                        <code>{"deny"}</code>{" "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        {"の例"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"ブラウザ"}</td>
                      <td>
                        {" "}
                        <code>{"execute_url"}</code>
                        {
                          " は、ブラウザのサブエージェントがサイトのページを開くときに既定で確認する。「Yes, allow this time」を選ぶと、そのサイトは現在のタスクの残りの間ずっと許可され、既定ではクリックや入力は1件ずつ確認されない。本番コンソールは "
                        }
                        <code>{"ask"}</code>
                        {
                          " に固定する。この承認はコンソールへのアクセスの承認で、個々の操作の承認ではないので、本番での変更操作は権限の小さいアカウントなどで別に制限する "
                        }
                      </td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>{" "}
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"ブラウザ"}</td>
                      <td>
                        {
                          " 組み込みブラウザは、自分のChromeプロファイルとは別のCookie・ログインを持つ "
                        }
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"入力"}</td>
                      <td>
                        {" 外部ドキュメント・Issue・READMEは"}
                        <strong>{"信頼できない入力"}</strong>
                        {"として扱い、読ませた直後は書き込み権限を絞る "}
                      </td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"継承"}</td>
                      <td>{"サブエージェントは親の権限を継承する。親に広い権限を与えない"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"監視"}</td>
                      <td>
                        {" 承認プロンプトの対象文字列を"}
                        <strong>{"読んでから"}</strong>
                        {"許可する(スコープ編集は広げすぎない) "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"企業"}</td>
                      <td>
                        {"企業アカウントはAutoが使えないなど、制限が異なる。管理者設定を確認"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </section>
            <section className={styles.section} id="s19">
              {" "}
              <h2 id="s19-heading">{"Step 16: クォータ・コスト管理"}</h2>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"観点"}</th>
                      <th>{"内容"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"制限の単位"}</td>
                      <td>
                        {" "}
                        <strong>{"5時間枠"}</strong>
                        {"と"}
                        <strong>{"週次"}</strong>
                        {"の2種類。Gemini系とClaude / GPT系は別バケット "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"共有範囲"}</td>
                      <td>{"使用量はApp・CLI・SDKで共有されるとの報告"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"見える化"}</td>
                      <td>
                        {" "}
                        <code>{"/usage"}</code>
                        {"(クォータ)、"}
                        <code>{"/credits"}</code>
                        {"(クレジット)、"}
                        <code>{"/context"}</code>
                        {"(文脈) "}
                      </td>
                      <td>
                        <a href="コマンド一覧">{"公式"}</a>
                      </td>
                    </tr>
                    <tr>
                      <td>{"エージェントは残量を知らない"}</td>
                      <td>
                        {"自分で "}
                        <code>{"/usage"}</code>
                        {" を確認する運用にする"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"思考量の調整"}</td>
                      <td>
                        <code>{"/effort"}</code>
                        {" コマンド、モデルの思考レベル(Low / Medium / High)"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"脇道の質問"}</td>
                      <td>
                        <code>{"/btw"}</code>
                        {" でメインの流れを止めずに別質問"}
                      </td>
                      <td>
                        <a href="コマンド一覧">{"公式"}</a>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" "}
                <strong>
                  <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                </strong>
                {" コスト最適化の順序: "}
              </p>{" "}
              <ol>
                {" "}
                <li>
                  {"計画を先に作り、"}
                  <strong>{"無駄な再実装を避ける"}</strong>
                  {"(Step 5)。"}
                </li>{" "}
                <li>{"サブエージェントとAutomationsの既定モデルをFlash系にする。"}</li>{" "}
                <li>
                  {"難問だけArgon / Opus(High)、"}
                  <code>{"/boost"}</code>
                  {" は「行き詰まったとき」に限る。"}
                </li>{" "}
                <li>
                  {"長い会話は区切り、"}
                  <code>{"/fork"}</code>
                  {" と "}
                  <code>{"/resume"}</code>
                  {" で文脈を整理する。"}
                </li>{" "}
                <li>
                  {" 無人実行は、実行時間や使用量の実質的な上限を決めてから回す。"}
                  <code>{"/goal"}</code>
                  {
                    " に書く中断条件はプロンプト内の指示で、強制力はない(Step 8.2)。ローカル実行では、CIジョブのタイムアウト、OSの "
                  }
                  <code>{"timeout"}</code>
                  {
                    " コマンド、実行を止める処理までつないだ使用量の監視など、エージェントの外から止められる仕組みを併用する。Remote Agents はGoogle管理の環境で動き続けるため(Step 11)、ローカルの "
                  }
                  <code>{"timeout"}</code>
                  {
                    " コマンドやCIジョブの終了だけではリモートの作業は止まらない。リモートで回すときは、進行状況の監視と、リモートタスク自体をキャンセルする手順を事前に決めて確認しておく。 "
                  }
                </li>{" "}
              </ol>{" "}
            </section>
            <section className={styles.section} id="s20">
              {" "}
              <h2 id="s20-heading">{"アンチパターン集"}</h2>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"#"}</th>
                      <th>{"アンチパターン"}</th>
                      <th>{"何が起きるか"}</th>
                      <th>{"代わりにやること"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"1"}</td>
                      <td>{"計画なしで大規模変更を依頼"}</td>
                      <td>{"方針違いの実装を丸ごとやり直し"}</td>
                      <td>
                        {" "}
                        <code>{"/plan"}</code>
                        {"(必要なら "}
                        <code>{"/grill-me"}</code>
                        {")で承認してから実装(Step 5) "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"2"}</td>
                      <td>{"検証手段がない状態で自律実行"}</td>
                      <td>{"「動いたつもり」の変更が混入"}</td>
                      <td>{"テスト・Lint・型チェックを先に用意(Step 6)"}</td>
                    </tr>
                    <tr>
                      <td>{"3"}</td>
                      <td>
                        {"Turbo / "}
                        <code>{"always-proceed"}</code>
                        {" を日常運用に使う"}
                      </td>
                      <td>{"マシン全体への読み書きと外部通信が全開"}</td>
                      <td>{"Default / Auto + 拒否リスト(Step 2)"}</td>
                    </tr>
                    <tr>
                      <td>{"4"}</td>
                      <td>
                        <code>{"read_url(*)"}</code>
                        {" を許可"}
                      </td>
                      <td>{"サンドボックスの外向き通信が事実上全開"}</td>
                      <td>{"必要ドメインのみ許可"}</td>
                    </tr>
                    <tr>
                      <td>{"5"}</td>
                      <td>
                        {" ルールを"}
                        <code>{"rules/"}</code>
                        {"に置くがfrontmatterなし/"}
                        <code>{"trigger"}</code>
                        {"のtypo "}
                      </td>
                      <td>
                        <strong>{"黙って破棄"}</strong>
                        {"され、効いていると誤認"}
                      </td>
                      <td>
                        {" 有効な "}
                        <code>{"trigger"}</code>
                        {" を必ず記述、"}
                        <code>{"/"}</code>
                        {" 入力や設定画面で読み込みを確認 "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"6"}</td>
                      <td>{"ルール・スキルを肥大化させる"}</td>
                      <td>{"文脈を圧迫、重要な指示が埋もれる"}</td>
                      <td>
                        {"常時有効は短く、詳細は "}
                        <code>{"model_decision"}</code>
                        {" やスキルへ"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"7"}</td>
                      <td>{"同一ファイルを複数エージェントが編集"}</td>
                      <td>{"衝突・上書き"}</td>
                      <td>
                        {"worktree("}
                        <code>{"branch"}</code>
                        {")で隔離"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"8"}</td>
                      <td>{"作ったエージェント自身に検証もさせる"}</td>
                      <td>{"自己採点で甘くなる"}</td>
                      <td>{"検証は別サブエージェント(Step 7)"}</td>
                    </tr>
                    <tr>
                      <td>{"9"}</td>
                      <td>
                        <code>{"/goal"}</code>
                        {" に曖昧な目標"}
                      </td>
                      <td>{"無限ループ・クォータ浪費"}</td>
                      <td>{"機械判定できる完了条件と中断条件(Step 8)"}</td>
                    </tr>
                    <tr>
                      <td>{"10"}</td>
                      <td>{"外部ドキュメントを読ませた直後に高権限で作業"}</td>
                      <td>{"間接プロンプトインジェクション"}</td>
                      <td>{"信頼できない入力の後は書き込み・通信を絞る(Step 15)"}</td>
                    </tr>
                    <tr>
                      <td>{"11"}</td>
                      <td>{"本番資格情報をエージェントから見える場所に置く"}</td>
                      <td>{"流出時の被害が最大化"}</td>
                      <td>{"非本番・上限付きの資格情報(Step 15)"}</td>
                    </tr>
                    <tr>
                      <td>{"12"}</td>
                      <td>{"サードパーティのプラグインを無検証で導入"}</td>
                      <td>{"スキル・フック・MCPを一括で持ち込む"}</td>
                      <td>{"中身を確認し、権限を絞る(Step 10)"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </section>
            <section className={styles.section} id="s21">
              {" "}
              <h2 id="s21-heading">{"トラブルシューティング"}</h2>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"症状"}</th>
                      <th>{"想定原因"}</th>
                      <th>{"確認・対処"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"ルールが効かない"}</td>
                      <td>
                        {" "}
                        <code>{"rules/*.md"}</code>
                        {" にfrontmatterがない、または "}
                        <code>{"trigger"}</code>
                        {" が不正("}
                        <code>{"alwaysOn"}</code>
                        {" など) "}
                      </td>
                      <td>
                        {" "}
                        <code>{"always_on"}</code>
                        {" / "}
                        <code>{"model_decision"}</code>
                        {" / "}
                        <code>{"glob"}</code>
                        {" / "}
                        <code>{"manual"}</code>
                        {" のいずれかに修正 "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"サブフォルダのルールが効かない"}</td>
                      <td>{"ワークスペースより下のルールは読まれない"}</td>
                      <td>
                        {"ルートまたは親、"}
                        <code>{"rules.json"}</code>
                        {" で登録"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"rules/"}</code>
                        {" 配下のサブディレクトリが無視される"}
                      </td>
                      <td>
                        {"直下の "}
                        <code>{".md"}</code>
                        {" のみ走査"}
                      </td>
                      <td>
                        <code>{".agents/rules.json"}</code>
                        {" に登録"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"スキルが出てこない"}</td>
                      <td>{"配置場所の違い、CLI実行中に追加した"}</td>
                      <td>
                        {" "}
                        <code>{".agents/skills/"}</code>
                        {" を確認し、"}
                        <code>{"/skills reload"}</code>
                        {" か新規会話 "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"サブエージェントが固まる"}</td>
                      <td>
                        <code>{"tools"}</code>
                        {" に未対応・綴り違いの名前"}
                      </td>
                      <td>
                        <code>{"view_file"}</code>
                        {"、"}
                        <code>{"run_command"}</code>
                        {" など正確な名前に"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"command(git)"}</code>
                        {" を許可したのに確認が出る"}
                      </td>
                      <td>
                        <code>{"$(...)"}</code>
                        {" など完全一致が必要な構文を含む"}
                      </td>
                      <td>
                        {"行全体の完全一致ルール、または "}
                        <code>{"regex:"}</code>
                        {" を使う"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"Windowsでコマンドルールが効かない"}</td>
                      <td>{"単語に分割できないコマンドは完全一致が必要"}</td>
                      <td>
                        {" 必要なコマンド行だけを、その行全体と一致するルールで許可する("}
                        <code>{"git"}</code>
                        {" 全体を許可しない) "}
                      </td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        <span className={[styles.tag, styles["t-rec"]].join(" ")}>
                          {"筆者推奨"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Autoが選べない"}</td>
                      <td>{"企業・ビジネスアカウント、サンドボックス非対応、版が古い"}</td>
                      <td>{"版(v2.23.0+ / Windowsはv2.26.0+)とアカウント種別を確認"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"CLIで "}
                        <code>{"proceed-in-sandbox"}</code>
                        {" が確認になる"}
                      </td>
                      <td>{"サンドボックスが使えない環境(v1.4.4以降)"}</td>
                      <td>
                        <code>{"request-review"}</code>
                        {" と同様に動作する仕様"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{"Voice mode / Remote Agents が出ない"}</td>
                      <td>{"段階的展開、Pro / Ultra限定"}</td>
                      <td>{"最新版に更新、アカウントと権限を確認"}</td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                        <span className={[styles.tag, styles["t-sec"]].join(" ")}>
                          {"二次"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"承認プロンプトの連発"}</td>
                      <td>{"許可スコープが細かすぎる"}</td>
                      <td>
                        {"ファイル・URL・MCPはスコープ編集で親ディレクトリへ(コマンドは不可)"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </section>
            <section className={styles.section} id="s22">
              {" "}
              <h2 id="s22-heading">{"導入ロードマップ(4週間)"}</h2>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"週"}</th>
                      <th>{"ゴール"}</th>
                      <th>{"やること"}</th>
                      <th>{"完了の目安"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"1"}</td>
                      <td>{"安全に動かす"}</td>
                      <td>{"Step 1〜2。ダミーリポジトリで権限プリセットと拒否リストを設定"}</td>
                      <td>
                        {"Default / Request Review で、危険操作がブロックされることを確認できた"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"2"}</td>
                      <td>{"再現性を作る"}</td>
                      <td>
                        {" Step 3〜6。"}
                        <code>{"AGENTS.md"}</code>
                        {"、スキル1本、"}
                        <code>{"/grill-me"}</code>
                        {" → "}
                        <code>{"/plan"}</code>
                        {" → 検証ループ "}
                      </td>
                      <td>{"同じ依頼で、毎回テスト付きの変更が出る"}</td>
                    </tr>
                    <tr>
                      <td>{"3"}</td>
                      <td>{"並列化する"}</td>
                      <td>
                        {" Step 7〜8、12。実装と検証のサブエージェント、"}
                        <code>{"/goal"}</code>
                        {" の完了条件 "}
                      </td>
                      <td>{"2タスクを並列に回し、差分レビューで衝突しなかった"}</td>
                    </tr>
                    <tr>
                      <td>{"4"}</td>
                      <td>{"無人化と拡張"}</td>
                      <td>{"Step 9〜11、13。L1のAutomations、MCP、Remote Control、CI"}</td>
                      <td>{"レポート型の自動化が安定し、承認すべき操作だけが人間に届く"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </section>
            <section className={styles.section} id="s23">
              {" "}
              <h2 id="s23-heading">{"付録A: クイックリファレンス"}</h2>{" "}
              <h3 id="antigravity-h148">{"A.1 よく使うコマンド・キー"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"目的"}</th>
                      <th>{"コマンド / キー"}</th>
                      <th>{"補足"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"起動"}</td>
                      <td>
                        <code>{"agy"}</code>
                      </td>
                      <td>{"対話TUI"}</td>
                    </tr>
                    <tr>
                      <td>{"1回だけ実行"}</td>
                      <td>
                        <code>{'agy -p "<プロンプト>"'}</code>
                      </td>
                      <td>{"ヘッドレス。CI向け"}</td>
                    </tr>
                    <tr>
                      <td>{"モード切替"}</td>
                      <td>
                        <code>{"Shift"}</code>
                        {" + "}
                        <code>{"Tab"}</code>
                      </td>
                      <td>{"default / accept-edits / auto"}</td>
                    </tr>
                    <tr>
                      <td>{"要件を詰める"}</td>
                      <td>
                        <code>{"/grill-me <タスク>"}</code>
                      </td>
                      <td>{"1問ずつ質問"}</td>
                    </tr>
                    <tr>
                      <td>{"計画する"}</td>
                      <td>
                        <code>{"/plan <タスク>"}</code>
                      </td>
                      <td>{"承認後に実装"}</td>
                    </tr>
                    <tr>
                      <td>{"両方"}</td>
                      <td>
                        <code>{"/plan /grill-me <タスク>"}</code>
                      </td>
                      <td>{"質問の結果を計画へ"}</td>
                    </tr>
                    <tr>
                      <td>{"目標まで継続"}</td>
                      <td>
                        <code>{"/goal <目的>"}</code>
                      </td>
                      <td>{"完了条件と中断条件を書く"}</td>
                    </tr>
                    <tr>
                      <td>{"難問"}</td>
                      <td>
                        <code>{"/boost"}</code>
                      </td>
                      <td>{"Pro / Ultra / Enterprise"}</td>
                    </tr>
                    <tr>
                      <td>{"大規模"}</td>
                      <td>
                        <code>{"/teamwork"}</code>
                      </td>
                      <td>{"有料プラン"}</td>
                    </tr>
                    <tr>
                      <td>{"ブラウザ検証"}</td>
                      <td>
                        <code>{"/browser"}</code>
                      </td>
                      <td>{"ブラウザサブエージェント"}</td>
                    </tr>
                    <tr>
                      <td>{"エージェント一覧"}</td>
                      <td>
                        <code>{"/agents"}</code>
                      </td>
                      <td>
                        {" "}
                        <code>{"Alt"}</code>
                        {"+"}
                        <code>{"J"}</code>
                        {" で承認待ちへ、"}
                        <code>{"Ctrl"}</code>
                        {"+"}
                        <code>{"K"}</code>
                        {" で即承認 "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"巻き戻し / 分岐"}</td>
                      <td>
                        <code>{"/rewind"}</code>
                        {" / "}
                        <code>{"/fork"}</code>
                      </td>
                      <td>
                        {"戻るときは "}
                        <code>{"/resume"}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>{"差分"}</td>
                      <td>
                        <code>{"/diff"}</code>
                      </td>
                      <td>{"行コメントで修正指示"}</td>
                    </tr>
                    <tr>
                      <td>{"権限"}</td>
                      <td>
                        <code>{"/permissions"}</code>
                      </td>
                      <td>{"セッション中のモードとルール"}</td>
                    </tr>
                    <tr>
                      <td>{"設定"}</td>
                      <td>
                        <code>{"/config"}</code>
                        {"("}
                        <code>{"/settings"}</code>
                        {")"}
                      </td>
                      <td>{"設定エディタ"}</td>
                    </tr>
                    <tr>
                      <td>{"使用量"}</td>
                      <td>
                        <code>{"/usage"}</code>
                      </td>
                      <td>{"5時間枠・週次"}</td>
                    </tr>
                    <tr>
                      <td>{"Appへ送る"}</td>
                      <td>
                        <code>{"/export"}</code>
                      </td>
                      <td>{"GUIで続行"}</td>
                    </tr>
                    <tr>
                      <td>{"音声"}</td>
                      <td>
                        {" "}
                        <code>{"/voice live"}</code>
                        {"("}
                        <code>{"F6"}</code>
                        {")/ "}
                        <code>{"/voice dictate"}</code>
                        {"("}
                        <code>{"F5"}</code>
                        {") "}
                      </td>
                      <td>{"企業アカウントの音声入力は不可"}</td>
                    </tr>
                    <tr>
                      <td>{"遠隔操作"}</td>
                      <td>
                        <code>{"/remote-control"}</code>
                      </td>
                      <td>
                        {" 現在のセッションの解除は "}
                        <code>{"/remote-control off"}</code>
                        {"。常時待機サービスの停止は "}
                        <code>{"agy remote-control stop"}</code>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"検索パレット(App)"}</td>
                      <td>
                        <code>{"Cmd"}</code>
                        {"/"}
                        <code>{"Ctrl"}</code>
                        {" + "}
                        <code>{"K"}</code>
                      </td>
                      <td>{"会話・ファイル・コマンド"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" 出典: "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>{" "}
                <code>{"https://antigravity.google/docs/features/"}</code>
                {"、"}
                <code>{"https://antigravity.google/docs/subagents/"}</code>
                {"、"}
                <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                {" DEV Community(権限コマンド) "}
              </p>{" "}
              <h3 id="antigravity-h149">{"A.2 初日にやることチェックリスト"}</h3>{" "}
              <p className={styles["chk-count"]}>
                {"進捗: "}
                <strong id="chkDone">{"0"}</strong>
                {" / 8"}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"✔"}</th>
                      <th>{"項目"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {" "}
                        <label className={styles.chk}>
                          <input type="checkbox" aria-label="項目1" />
                        </label>{" "}
                      </td>
                      <td>
                        {"ダミーリポジトリで "}
                        <code>{"agy"}</code>
                        {" を起動し、認証を完了した"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <label className={styles.chk}>
                          <input type="checkbox" aria-label="項目2" />
                        </label>{" "}
                      </td>
                      <td>{"権限プリセット(Default または Request Review)を明示的に選んだ"}</td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <label className={styles.chk}>
                          <input type="checkbox" aria-label="項目3" />
                        </label>{" "}
                      </td>
                      <td>
                        {" "}
                        <code>{"deny"}</code>
                        {" に "}
                        <code>{"rm -rf"}</code>
                        {" / "}
                        <code>{"sudo"}</code>
                        {" / "}
                        <code>{".git/"}</code>
                        {" / ホームの絶対パスで書いた "}
                        <code>{".ssh"}</code>
                        {" を入れた "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <label className={styles.chk}>
                          <input type="checkbox" aria-label="項目4" />
                        </label>{" "}
                      </td>
                      <td>
                        {" "}
                        <code>{"AGENTS.md"}</code>
                        {" に「テスト・Lintコマンド」「触らない場所」「完了の定義」を書いた "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <label className={styles.chk}>
                          <input type="checkbox" aria-label="項目5" />
                        </label>{" "}
                      </td>
                      <td>
                        <code>{"/plan /grill-me"}</code>
                        {" で小さな機能を1本通した"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <label className={styles.chk}>
                          <input type="checkbox" aria-label="項目6" />
                        </label>{" "}
                      </td>
                      <td>{"テストを先に書かせ、実行結果を貼らせた"}</td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <label className={styles.chk}>
                          <input type="checkbox" aria-label="項目7" />
                        </label>{" "}
                      </td>
                      <td>
                        <code>{"/usage"}</code>
                        {" で枠の残量を確認した"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <label className={styles.chk}>
                          <input type="checkbox" aria-label="項目8" />
                        </label>{" "}
                      </td>
                      <td>{"資格情報が非本番・上限付きであることを確認した"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </section>
            <section className={styles.section} id="s24">
              {" "}
              <h2 id="s24-heading">{"補足: 著名開発者の知見に基づく追加ベストプラクティス"}</h2>{" "}
              <p>
                {" ここでは、Antigravity固有のドキュメントに加えて、"}
                <strong>{"著名な国際的開発者・研究者"}</strong>
                {"が公開している知見を、Antigravityの運用へ翻訳します。 "}
              </p>{" "}
              <h3 id="antigravity-h150">{"B.1 Addy Osmani: 「ループを設計する」"}</h3>{" "}
              <p>
                {" 著名な開発者であるAddy Osmaniは、2026-06-07のエッセイ「Loop Engineering」で、"}
                <strong>
                  {"エージェントに毎回プロンプトを打つ人から、プロンプトを打つ仕組みを設計する人へ"}
                </strong>
                {"移ることを提唱しました "}
                <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                {"。主要な構成要素を、Antigravityの機能に対応づけると次のとおりです。 "}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"Loop Engineering の要素"}</th>
                      <th>{"役割"}</th>
                      <th>{"Antigravityでの対応"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"Automations"}</td>
                      <td>{"定期的な発見・トリアージ"}</td>
                      <td>
                        {"App の Automations、"}
                        <code>{"/schedule"}</code>
                      </td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Worktrees"}</td>
                      <td>{"並列エージェントの衝突回避"}</td>
                      <td>
                        {"プロジェクトのworktree対応、サブエージェントの "}
                        <code>{"branch"}</code>
                      </td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Skills"}</td>
                      <td>{"プロジェクト知識の明文化"}</td>
                      <td>
                        <code>{".agents/skills/"}</code>
                        {"(Step 4)"}
                      </td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Plugins / Connectors"}</td>
                      <td>{"既存ツールへの接続"}</td>
                      <td>{"MCP、プラグインMarketplace(Step 10)"}</td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Sub-agents"}</td>
                      <td>{"アイデア出しと独立した検証"}</td>
                      <td>{"カスタムサブエージェント(Step 7)"}</td>
                      <td>
                        {" "}
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                        <span className={[styles.tag, styles["t-official"]].join(" ")}>
                          {"公式"}
                        </span>{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" この対応づけは、Osmaniの記事の構成要素と公式機能を突き合わせた**"}
                  <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  {"** の整理です。Osmani自身の記事は、複数のツールを横断して書かれています。 "}
                </p>{" "}
              </blockquote>{" "}
              <p>{"運用上の示唆:"}</p>{" "}
              <ul>
                {" "}
                <li>
                  {
                    " スキルがないループは、毎周プロジェクト知識をゼロから再導出する。スキルがあれば知識が複利で積み上がる "
                  }
                  <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {"「作る側」と「検証する側」を分ける "}
                  <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                  {"。"}
                </li>{" "}
                <li>
                  {" 2026-07-09 のフォローアップでは、"}
                  <strong>
                    {
                      "エージェントが内側のループ(調査・実装・検証・反復)を回し、人間が外側のループ(品質判定と出荷判断)の責任を持つ"
                    }
                  </strong>
                  {"と整理されている "}
                  <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                  {"。 "}
                </li>{" "}
                <li>
                  {" 単発の作業や、完了の判断が主観的な作業では、"}
                  <strong>{"ループ化より単発の良いプロンプトの方が有利"}</strong>
                  {"な場合がある "}
                  <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                  {"。すべてをループにしない。 "}
                </li>{" "}
              </ul>{" "}
              <h3 id="antigravity-h151">{"B.2 Addy Osmani: 仕様をエージェントに渡す"}</h3>{" "}
              <p>
                {
                  " Osmaniは「How to write a good spec for AI agents」で、エージェント向けの仕様書の書き方を整理しています。その中でSimon Willisonの指摘を引用し、段階的なゲート(仕様 → 計画 → 実装)が、脆い成果物(「カードの家」型のコード)を防ぐと述べています "
                }
                <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                {"。また、"}
                <strong>
                  {"複数エージェントの並列運用は有効だが精神的に消耗するため、最初は2〜3体から"}
                </strong>
                {"始めるよう勧めています "}
                <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                {"。 "}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"翻訳先"}</th>
                      <th>{"Antigravityでの実践"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"仕様 → 計画 → 実装のゲート"}</td>
                      <td>
                        <code>{"/grill-me"}</code>
                        {" → "}
                        <code>{"/plan"}</code>
                        {" → 承認 → 実装(Step 5)"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"仕様をエージェントに常時見せる"}</td>
                      <td>
                        {" "}
                        <code>{"AGENTS.md"}</code>
                        {" から "}
                        <code>{"@[...]"}</code>
                        {" で仕様書をインライン展開(Step 3) "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"並列は最初2〜3体"}</td>
                      <td>
                        {"サブエージェントの同時数を絞り、検証できたら3〜5程度へ増やす(Step 7)"}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h152">
                {"B.3 Addy Osmani: agent-skills(24スキル)をAntigravityで使う"}
              </h3>{" "}
              <p>
                {" OsmaniのGitHubリポジトリ "}
                <code>{"agent-skills"}</code>
                {
                  " は、定義・計画・実装・検証・レビュー・出荷の各段階をスキル化し、Antigravity CLI向けのセットアップ手順(プラグインとして導入、"
                }
                <code>{"agy plugin validate"}</code>
                {" で検証)を用意しています "}
                <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                {"。ワークフローを厳格に守らせるには、プロジェクトの "}
                <code>{"AGENTS.md"}</code>
                {" に仕様・計画・必要なスキルの流れを書くよう案内されています "}
                <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                {"。 "}
              </p>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>
                  {" 一括導入ではなく、"}
                  <strong>{"自分のチームで効いた2〜3スキルから"}</strong>
                  {"始めてください(説明一覧が文脈を使うため)。 "}
                </p>{" "}
              </blockquote>{" "}
              <h3 id="antigravity-h153">
                {"B.4 Simon Willison: 「製品を評価するときは、触れるものだけを」"}
              </h3>{" "}
              <p>
                {" Willisonは2026-05-20のGoogle I/O記事で、"}
                <strong>{"自分で試せないもの(coming soon)については書かない"}</strong>
                {"方針を示し、Antigravityについて次を整理しました "}
                <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                {"。 "}
              </p>{" "}
              <ul>
                {" "}
                <li>
                  {
                    " 公式サイトはAntigravityを、デスクトップApp・CLI(Go製)・SDK(Pythonラッパー + 同梱のクローズドバイナリ)・元のIDE(VS Code系)として並べている。 "
                  }
                </li>{" "}
                <li>
                  {
                    " Gemini CLI(オープンソース)は、サブスクリプションでは2026-06-18に使えなくなり、クローズドソースのAntigravity CLIに置き換わる。 "
                  }
                </li>{" "}
                <li>
                  {
                    " 個人向けエージェント(Gemini Spark)がGemini 3.5 FlashとAntigravityの上で動くと説明されており、サンドボックス化された一時VMで実行する旨が企業向け記事に書かれている。 "
                  }
                </li>{" "}
                <li>
                  {
                    " 機密データを大量に流す製品なので、プロンプトインジェクション対策が堅牢であることを望む、という趣旨の警鐘。 "
                  }
                </li>{" "}
              </ul>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>
                    <span className={[styles.tag, styles["t-rec"]].join(" ")}>{"筆者推奨"}</span>
                  </strong>
                  {" Voice modeやRemote Agentsのような"}
                  <strong>{"段階的展開の新機能"}</strong>
                  {
                    "は、本番に近い作業へ使う前に、小さな検証プロジェクトで挙動を確認してください。 "
                  }
                </p>{" "}
              </blockquote>{" "}
              <h3 id="antigravity-h154">
                {"B.5 Simon Willison / Johann Rehberger / PromptArmor: セキュリティの教訓"}
              </h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"教訓"}</th>
                      <th>{"内容"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"三要素のどれかを断つ"}</td>
                      <td>
                        {" 機密データ・信頼できない入力・外部通信のうち、最も断ちやすいのは通常"}
                        <strong>{"外部通信"}</strong>{" "}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                        {" Willison"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"資格情報の爆発半径を縮める"}</td>
                      <td>{"エージェントが見える資格情報は、非本番・厳しい利用上限付きに"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                        {" Willison"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"「許可リストの既定」を鵜呑みにしない"}</td>
                      <td>{"ブラウザの既定許可ドメインに、悪用可能なものが含まれていた事例"}</td>
                      <td>
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                        {" PromptArmor / Willison"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"設定でなく"}
                        <strong>{"権限層"}</strong>
                        {"で守る"}
                      </td>
                      <td>
                        {
                          " モデルは、特に攻撃者が介在する場合、指示や文脈整合性を一貫して守るとは限らない "
                        }
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                        {" Rehberger"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"読み取り制限の迂回を想定する"}</td>
                      <td>
                        <code>{".gitignore"}</code>
                        {" の読み取り制限が、シェル経由で迂回された事例"}
                      </td>
                      <td>
                        <span className={[styles.tag, styles["t-dev"]].join(" ")}>{"開発者"}</span>
                        {" PromptArmor"}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" → Antigravityでは、"}
                <strong>
                  {"プロンプトでの禁止ではなく、"}
                  <code>{"deny"}</code>
                  {" ルールとサンドボックス、"}
                  <code>{"read_url"}</code>
                  {" の最小化で守る"}
                </strong>
                {"(Step 2、Step 15)。 "}
              </p>{" "}
              <h3 id="antigravity-h155">{"B.6 Google公式Codelab: 役割分担パイプライン"}</h3>{" "}
              <p>
                {" Googleのコードラボでは、"}
                <code>{".agents/"}</code>
                {" ディレクトリに"}
                <strong>{"PM(仕様化)・エンジニア(実装)・QA(レビュー)・DevOps"}</strong>
                {"の役割を定義し、"}
                <code>{"/startcycle"}</code>
                {" で連結する自律開発パイプラインが紹介されています "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>
                  {"公式 Codelab"}
                </span>
                {"。 "}
              </p>{" "}
              <p>
                {" ただし、コードラボの手順は"}
                <strong>{"独立したエージェントを起動しません"}</strong>
                {
                  "。同じ会話の中で、Gemini が文脈を切り替えて各役割を順に担当します。そのため、コードラボをなぞるだけでは、Step 7 が求める別コンテキストでの検証にはなりません。下の表は、コードラボの役割を、本ガイドのカスタムエージェントとサブエージェントへ置き換えたものです。別コンテキストで検証するには、この構成を使ってください。 "
                }
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"役割"}</th>
                      <th>{"担当"}</th>
                      <th>{"Antigravityの実装先"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"仕様化"}</td>
                      <td>{"あいまいな依頼を技術仕様へ"}</td>
                      <td>
                        <code>{"/grill-me"}</code>
                        {" + 仕様用カスタムエージェント"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"実装"}</td>
                      <td>{"承認された仕様をコードへ"}</td>
                      <td>
                        {"実装サブエージェント("}
                        <code>{"branch"}</code>
                        {")"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"レビュー"}</td>
                      <td>{"本番水準かを精査"}</td>
                      <td>{"読み取り中心の検証サブエージェント"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h156">{"B.7 公式ブログの実用ユースケース(Gemini 4 Argon)"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"ユースケース"}</th>
                      <th>{"要点"}</th>
                      <th>{"本ガイドの該当"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"バックログ整理"}</td>
                      <td>
                        {
                          " 134件の古い不具合報告から、現存性を履歴・テレメトリで調べ、97件をクローズ。残りは担当者別に分類 "
                        }
                      </td>
                      <td>{"Step 9(L1の調査型)"}</td>
                    </tr>
                    <tr>
                      <td>{"レガシー移行"}</td>
                      <td>{"カスタムスキルで旧コードベースをRustへ書き換え"}</td>
                      <td>{"Step 4(スキル)"}</td>
                    </tr>
                    <tr>
                      <td>{"セキュリティ監査"}</td>
                      <td>
                        {" 差分ではなく"}
                        <strong>{"実行時の権限の流れ"}</strong>
                        {"をたどって重大な不具合を発見 "}
                      </td>
                      <td>{"Step 7(検証サブエージェント)"}</td>
                    </tr>
                    <tr>
                      <td>{"サポートチケット対応"}</td>
                      <td>
                        {"分類・原因追跡・修正案と返信の下書きまで。"}
                        <strong>{"人間が承認"}</strong>
                      </td>
                      <td>{"Step 9(人間のゲート)"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" 出典: "}
                <span className={[styles.tag, styles["t-official"]].join(" ")}>{"公式"}</span>{" "}
                <code>
                  {"https://antigravity.google/blog/gemini-4-argon-in-google-antigravity"}
                </code>
                {"(提供元の自己報告として扱う) "}
              </p>{" "}
              <h3 id="antigravity-h157">{"B.8 国内の実践知(スラッシュコマンドの使い分け)"}</h3>{" "}
              <p>
                {" 日本語の実践記事では、最初に覚えるべきコマンドとして "}
                <code>{"/plan"}</code>
                {"、"}
                <code>{"/grill-me"}</code>
                {"、"}
                <code>{"/goal"}</code>
                {"、"}
                <code>{"/browser"}</code>
                {" が挙げられ、"}
                <strong>
                  {"要件が曖昧なら "}
                  <code>{"/grill-me"}</code>
                  {"、計画を確認したいなら "}
                  <code>{"/plan"}</code>
                  {"、完走まで任せたいなら "}
                  <code>{"/goal"}</code>
                  {"、Webアプリを実機確認したいなら "}
                  <code>{"/browser"}</code>
                </strong>
                {" という使い分けが紹介されています "}
                <span className={[styles.tag, styles["t-sec"]].join(" ")}>{"二次"}</span>
                {"。本ガイドのStep 5・8と一致します。 "}
              </p>{" "}
            </section>
            <section className={styles.section} id="s25">
              {" "}
              <h2 id="s25-heading">{"参考URL一覧(根拠ソース)"}</h2>{" "}
              <h3 id="antigravity-h158">{"C.1 公式ドキュメント・公式ブログ(Google)"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"ID"}</th>
                      <th>{"URL"}</th>
                      <th>{"根拠となる内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"D1"}</td>
                      <td>{"https://antigravity.google/docs/features/"}</td>
                      <td>
                        {
                          " App・CLI共通機能、プロジェクト、サブエージェント、Remote Control / Agents、Voice mode、Automations、VCSパネル "
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{"D2"}</td>
                      <td>{"https://antigravity.google/docs/cli/best-practices/"}</td>
                      <td>
                        {" 検証ループ、探索→計画→実行、権限、"}
                        <code>{"/rewind"}</code> <code>{"/fork"}</code>
                        {"、ヘッドレス実行 "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"D3"}</td>
                      <td>{"https://antigravity.google/docs/skills/"}</td>
                      <td>{"スキルの構造、段階的開示、ベストプラクティス、配置場所"}</td>
                    </tr>
                    <tr>
                      <td>{"D4"}</td>
                      <td>{"https://antigravity.google/docs/rules/"}</td>
                      <td>
                        {" ルールの探索範囲、"}
                        <code>{"trigger"}</code>
                        {"、サイズ上限、"}
                        <code>{"rules.json"}</code>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"D5"}</td>
                      <td>{"https://antigravity.google/docs/subagents/"}</td>
                      <td>
                        {" サブエージェントの定義・状態・継承・"}
                        <code>{"/boost"}</code> <code>{"/teamwork"}</code>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"D6"}</td>
                      <td>{"https://antigravity.google/docs/permissions/"}</td>
                      <td>{"権限プリセット、Deny > Ask > Allow、完全一致の例外、CLIモード"}</td>
                    </tr>
                    <tr>
                      <td>{"D7"}</td>
                      <td>{"https://antigravity.google/docs/models/"}</td>
                      <td>{"利用可能モデルとプラン、思考レベル、削除予定"}</td>
                    </tr>
                    <tr>
                      <td>{"D8"}</td>
                      <td>
                        {"https://antigravity.google/blog/gemini-4-argon-in-google-antigravity"}
                      </td>
                      <td>{"Argonの展開と社内ユースケース"}</td>
                    </tr>
                    <tr>
                      <td>{"D9"}</td>
                      <td>{"https://antigravity.google/docs/commands/grill-me/"}</td>
                      <td>
                        <code>{"/grill-me"}</code>
                        {" の動作と "}
                        <code>{"/plan"}</code>
                        {" との併用"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"D10"}</td>
                      <td>{"https://antigravity.google/docs/slash-commands/"}</td>
                      <td>{"スラッシュコマンド概要"}</td>
                    </tr>
                    <tr>
                      <td>{"D11"}</td>
                      <td>{"https://github.com/google-antigravity/antigravity-cli"}</td>
                      <td>{"CLIのインストールと機能一覧"}</td>
                    </tr>
                    <tr>
                      <td>{"D12"}</td>
                      <td>
                        {
                          " https://github.com/google-antigravity/antigravity-sdk-python/discussions/216 "
                        }
                      </td>
                      <td>{"Python SDK 0.1.18 のリリースノート"}</td>
                    </tr>
                    <tr>
                      <td>{"D13"}</td>
                      <td>
                        {
                          " https://codelabs.developers.google.com/autonomous-ai-developer-pipelines-antigravity "
                        }
                      </td>
                      <td>
                        <code>{".agents/"}</code>
                        {" による役割分担パイプライン(Google Codelabs)"}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h159">{"C.2 著名開発者・研究者の投稿"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"ID"}</th>
                      <th>{"発信者"}</th>
                      <th>{"URL"}</th>
                      <th>{"根拠となる内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"P1"}</td>
                      <td>{"Addy Osmani"}</td>
                      <td>{"https://addyosmani.com/blog/loop-engineering/"}</td>
                      <td>{"Loop Engineering。ループ設計の5要素、作る側と確かめる側の分離"}</td>
                    </tr>
                    <tr>
                      <td>{"P2"}</td>
                      <td>{"Addy Osmani"}</td>
                      <td>
                        {
                          " https://github.com/addyosmani/agent-skills/blob/main/docs/antigravity-setup.md "
                        }
                      </td>
                      <td>{"agent-skillsのAntigravity CLI向けセットアップ"}</td>
                    </tr>
                    <tr>
                      <td>{"P3"}</td>
                      <td>{"Addy Osmani"}</td>
                      <td>
                        {"https://addyo.substack.com/p/how-to-write-a-good-spec-for-ai-agents"}
                      </td>
                      <td>{"エージェント向け仕様の書き方、最初は2〜3体の並列"}</td>
                    </tr>
                    <tr>
                      <td>{"P4"}</td>
                      <td>{"Simon Willison"}</td>
                      <td>{"https://simonwillison.net/2026/may/20/google-io"}</td>
                      <td>{"Google I/O 2026とAntigravity(構成・CLIの移行・セキュリティ懸念)"}</td>
                    </tr>
                    <tr>
                      <td>{"P5"}</td>
                      <td>{"Simon Willison"}</td>
                      <td>{"https://simonwillison.net/2025/Nov/18/google-antigravity/"}</td>
                      <td>{"Antigravity公開時の第一印象"}</td>
                    </tr>
                    <tr>
                      <td>{"P6"}</td>
                      <td>{"Simon Willison"}</td>
                      <td>
                        {
                          " https://simonwillison.net/2025/Nov/25/google-antigravity-exfiltrates-data/ "
                        }
                      </td>
                      <td>{"PromptArmorの指摘の紹介と対策(資格情報の限定)"}</td>
                    </tr>
                    <tr>
                      <td>{"P7"}</td>
                      <td>{"Simon Willison"}</td>
                      <td>{"https://simonwillison.net/tags/lethal-trifecta"}</td>
                      <td>{"致命的な三要素の解説集"}</td>
                    </tr>
                    <tr>
                      <td>{"P8"}</td>
                      <td>{"PromptArmor"}</td>
                      <td>
                        {
                          "https://www.promptarmor.com/resources/google-antigravity-exfiltrates-data"
                        }
                      </td>
                      <td>{"間接プロンプトインジェクションによる情報流出の実証"}</td>
                    </tr>
                    <tr>
                      <td>{"P9"}</td>
                      <td>{"Johann Rehberger"}</td>
                      <td>
                        {
                          " https://embracethered.com/blog/posts/2025/security-keeps-google-antigravity-grounded/ "
                        }
                      </td>
                      <td>{"Antigravityの関連する脆弱性の報告"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="antigravity-h160">{"C.3 技術メディア・解説記事(二次情報)"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"ID"}</th>
                      <th>{"URL"}</th>
                      <th>{"根拠となる内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"M1"}</td>
                      <td>
                        {
                          " https://techcrunch.com/2026/05/19/google-launches-antigravity-2-0-with-an-updated-desktop-app-and-cli-tool/ "
                        }
                      </td>
                      <td>{"Antigravity 2.0の発表(App・CLI・SDK)"}</td>
                    </tr>
                    <tr>
                      <td>{"M2"}</td>
                      <td>
                        {"https://thenextweb.com/news/google-antigravity-2-desktop-cli-sdk-io-2026"}
                      </td>
                      <td>{"2.0の概要、Go製CLI、Gemini CLIの終了"}</td>
                    </tr>
                    <tr>
                      <td>{"M3"}</td>
                      <td>{"https://en.wikipedia.org/wiki/Google_Antigravity"}</td>
                      <td>{"沿革、サンドボックス導入、IDEの扱い、版情報"}</td>
                    </tr>
                    <tr>
                      <td>{"M4"}</td>
                      <td>
                        {
                          " https://dev.to/moruku36/what-changed-in-google-antigravitys-november-update-remote-agents-voice-mode-and-a-native-1ph9 "
                        }
                      </td>
                      <td>{"2026-11-03アップデートの要点"}</td>
                    </tr>
                    <tr>
                      <td>{"M5"}</td>
                      <td>
                        {
                          " https://dev.to/agentrq/there-is-no-agy-yolo-how-yolo-mode-actually-works-in-antigravity-ide-and-cli-456l "
                        }
                      </td>
                      <td>{"YOLO相当の設定とサンドボックスの関係"}</td>
                    </tr>
                    <tr>
                      <td>{"M6"}</td>
                      <td>{"https://www.layer3labs.io/guides/google-antigravity-2-0"}</td>
                      <td>{"2.0とIDEの違い、SDK、サブエージェントの権限継承"}</td>
                    </tr>
                    <tr>
                      <td>{"M7"}</td>
                      <td>{"https://www.aibuilderclub.com/blog/antigravity-cli-guide"}</td>
                      <td>{"CLIのコマンド・モード・クォータの注意"}</td>
                    </tr>
                    <tr>
                      <td>{"M8"}</td>
                      <td>{"https://www.firecrawl.dev/blog/antigravity-skills"}</td>
                      <td>{"スキル・ルール・ワークフロー・MCPの整理、スキル集の比較"}</td>
                    </tr>
                    <tr>
                      <td>{"M9"}</td>
                      <td>{"https://releasebot.io/updates/google/antigravity"}</td>
                      <td>{"直近リリースの要約"}</td>
                    </tr>
                    <tr>
                      <td>{"M10"}</td>
                      <td>{"https://www.gradually.ai/en/changelogs/antigravity/"}</td>
                      <td>{"変更履歴(v2.29.0、CLI v1.4.12、Eclipse拡張)"}</td>
                    </tr>
                    <tr>
                      <td>{"M11"}</td>
                      <td>{"https://www.gradually.ai/en/antigravity-cli-commands/"}</td>
                      <td>{"CLIコマンド一覧"}</td>
                    </tr>
                    <tr>
                      <td>{"M12"}</td>
                      <td>{"https://docs.coderabbit.ai/cli/antigravity.md"}</td>
                      <td>{"プラグインと権限・サンドボックスの関係"}</td>
                    </tr>
                    <tr>
                      <td>{"M13"}</td>
                      <td>{"https://www.aibuilderclub.com/blog/loop-engineering-addy-osmani"}</td>
                      <td>{"Osmaniのループ設計の要約とフォローアップ"}</td>
                    </tr>
                    <tr>
                      <td>{"M14"}</td>
                      <td>
                        {
                          " https://www.developersdigest.tech/blog/loop-engineering-designing-agent-loops "
                        }
                      </td>
                      <td>{"ループの終了判定・予算の設計"}</td>
                    </tr>
                    <tr>
                      <td>{"M15"}</td>
                      <td>{"https://gittrend.io/repo/cobusgreyling/loop-engineering"}</td>
                      <td>{"段階的なループ展開(L1〜L3)の参照リポジトリ"}</td>
                    </tr>
                    <tr>
                      <td>{"M16"}</td>
                      <td>
                        {
                          " https://www.yoshidumi.co.jp/collaboration-lab/google-antigravity-slash-commands "
                        }
                      </td>
                      <td>{"日本語のスラッシュコマンド解説"}</td>
                    </tr>
                    <tr>
                      <td>{"M17"}</td>
                      <td>{"https://docs.coingecko.com/docs/ai-agent-hub/antigravity"}</td>
                      <td>{"AGENTS.md / GEMINI.md の使い分け事例、MCP設定の場所"}</td>
                    </tr>
                    <tr>
                      <td>{"M18"}</td>
                      <td>{"https://docs.agno.com/tools/toolkits/others/antigravity.md"}</td>
                      <td>{"Gemini APIのManaged Agents(サンドボックス)連携"}</td>
                    </tr>
                    <tr>
                      <td>{"M19"}</td>
                      <td>{"https://pub.dev/packages/antigravity/changelog"}</td>
                      <td>{"Dartクライアントの変更履歴(サブエージェント、フック)"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </section>
            <section className={styles.section} id="s26">
              {" "}
              <h2 id="s26-heading">{"注意事項と今後の確認事項"}</h2>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"区分"}</th>
                      <th>{"内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"情報の鮮度"}</td>
                      <td>
                        {
                          " Antigravityは更新頻度が非常に高く、AppはおおむねリリースごとにUI・権限・コマンドが変わります。"
                        }
                        <strong>
                          {"最終的な仕様は必ず公式ドキュメントと自分の版のコマンド一覧で確認"}
                        </strong>
                        {"してください "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"自己報告の数値"}</td>
                      <td>{"Argonの社内実績(35%増・30%減など)は提供元の自己報告です"}</td>
                    </tr>
                    <tr>
                      <td>{"未確認の領域"}</td>
                      <td>
                        {
                          " 次の項目は今回、一次情報を直接確認していないため、本文では詳細に踏み込んでいません: "
                        }
                        <code>{"/plan"}</code>
                        {
                          " の内部手順の詳細、JSONフックのスキーマ、サンドボックスの内部構成、各プランの料金・制限値 "
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{"情報源の食い違い"}</td>
                      <td>
                        {
                          " ルールの上限は、古い解説で12,000文字とされるものがありますが、公式は24KB / 20,000トークンです。"
                        }
                        <strong>{"公式を優先"}</strong>
                        {"しています "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"脆弱性情報"}</td>
                      <td>
                        {
                          " 2025-11の指摘は当時の版に対するものです。現行版での修正状況は、個別に検証してください "
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{"名称"}</td>
                      <td>{"依頼文の「Googlei」は、Googleとして解釈しました"}</td>
                    </tr>
                    <tr>
                      <td>{"個人・企業の違い"}</td>
                      <td>
                        {
                          " Auto権限、CLIの音声入力、IDEなどは、企業・ビジネスアカウントで利用できない場合があります "
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{"免責"}</td>
                      <td>
                        {
                          " 本ガイドは情報提供であり、セキュリティ・法務・契約上の判断を保証するものではありません。機密コードの取り扱いは、所属組織のポリシーと各サービスの規約に従ってください "
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </section>
            <footer className={styles.foot}>{"最終更新: 2026-11-06(情報基準日)"}</footer>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
