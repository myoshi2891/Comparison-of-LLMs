import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";
export const metadata: Metadata = {
  title: "Google Gemini 最新モデル ベストプラクティス完全ガイド",
  description:
    "Gemini のモデル選択、思考水準、Long Decode、API移行と本番運用の実践ガイド。情報基準日2026-10-23。",
};
const DIAGRAM_0 = `flowchart TB
    A["2025-11　Gemini 3 Pro"] --> B["2026-02　3 Deep Think・3.1 Pro 系"]
    B --> C["2026-05〜07　3.5 Flash・3.6 Flash　3.5 Flash-Lite"]
    C --> D["2026-08　3.7 Flash"]
    D --> E["2026-09-02　3.8 Flash GA"]
    E --> F["2026-09-30　Argon 発表　限定公開"]
    F --> G["2026-10-13　Argon API GA"]
    G --> H["2026-12-01　Argon 価格が2倍"]
    classDef hub fill:#dfe3f8,stroke:#34439a,color:#1b2360,stroke-width:2px
    classDef box fill:#f7edd3,stroke:#7d5c14,color:#4a3608,stroke-width:2px
    classDef done fill:#dff0e6,stroke:#2d6a4a,color:#14402b,stroke-width:2px
    class A hub
    class H box
    class G done`;
const DIAGRAM_1 = `flowchart TB
    n1["1　アプリ　create に model と input と system_instruction を渡す"]
    n2["2　Interactions API　モデルへ推論リクエストを送る"]
    n3["3　Gemini モデル　出力と Thought Signature を返す"]
    n4["4　API　interaction.id と output_text を返し　会話状態と署名をサーバーが保持"]
    n5["5　アプリ　previous_interaction_id と新しい input で create"]
    n6["6　API　前回の状態を引き継いでモデルへ送る"]
    n7["7　Gemini モデル　続きの出力を返す"]
    n8["8　API　新しい interaction をアプリへ返す"]
    n1 --> n2 --> n3 --> n4 --> n5 --> n6 --> n7 --> n8
    classDef hub fill:#dfe3f8,stroke:#34439a,color:#1b2360,stroke-width:2px
    classDef box fill:#f7edd3,stroke:#7d5c14,color:#4a3608,stroke-width:2px
    classDef done fill:#dff0e6,stroke:#2d6a4a,color:#14402b,stroke-width:2px
    class n1 hub
    class n8 done`;
const DIAGRAM_2 = `flowchart TD
    S["タスクの特性は?"] --> Q1{"難度が高い?　数学・科学・長期の実装・　複雑なエージェント計画"}
    Q1 -->|"はい"| Q2{"1回の応答で　64Kトークンを超える?"}
    Q2 -->|"はい"| A1["Argon + high　background + Long Decode"]
    Q2 -->|"いいえ"| A2["Argon + medium　まず既定で評価"]
    Q1 -->|"いいえ"| Q3{"大量処理・低遅延が最優先?"}
    Q3 -->|"はい"| Q4{"自律的な計画や　ツール連鎖が必要?"}
    Q4 -->|"はい"| A3["3.5 Flash-Lite + medium・high　または 3.8 Flash + low"]
    Q4 -->|"いいえ"| A4["3.5 Flash-Lite + minimal　抽出・分類・ルーティング"]
    Q3 -->|"いいえ"| A5["3.8 Flash + medium　汎用の主力"]
    A1 --> E["自社評価セットで　タスク単価と合格率を比較"]
    A2 --> E
    A3 --> E
    A4 --> E
    A5 --> E
    classDef hub fill:#dfe3f8,stroke:#34439a,color:#1b2360,stroke-width:2px
    classDef box fill:#f7edd3,stroke:#7d5c14,color:#4a3608,stroke-width:2px
    classDef done fill:#dff0e6,stroke:#2d6a4a,color:#14402b,stroke-width:2px
    class S hub
    class Q1 box
    class E done`;
const DIAGRAM_3 = `flowchart TD
    A["代表タスク30〜100件の　評価セットを用意"] --> B["low・medium・high の　3水準で実行"]
    B --> C["合格率・タスク単価・　所要時間を記録"]
    C --> D{"low が品質基準を満たす?"}
    D -->|"はい"| E["low を採用"]
    D -->|"いいえ"| F{"medium が基準を満たす?"}
    F -->|"はい"| G["medium を採用"]
    F -->|"いいえ"| H["high を採用　または難所のみ high に分岐"]
    E --> I["本番ログで　劣化を継続監視"]
    G --> I
    H --> I
    classDef hub fill:#dfe3f8,stroke:#34439a,color:#1b2360,stroke-width:2px
    classDef box fill:#f7edd3,stroke:#7d5c14,color:#4a3608,stroke-width:2px
    classDef done fill:#dff0e6,stroke:#2d6a4a,color:#14402b,stroke-width:2px
    class A hub
    class D box
    class I done`;
const DIAGRAM_4 = `flowchart TD
    A["create　background=true　max_output_tokens が 65,536 超"] --> B["ホップ1　最大64Kトークン"]
    B --> C{"モデルが完了した?"}
    C -->|"いいえ かつ 上限未満"| D["ホップ2　前ホップの続きから生成"]
    D --> C
    C -->|"はい"| E["status = completed"]
    C -->|"上限に到達"| F["status = incomplete"]
    F --> G["max_output_tokens を上げて再実行　または thinking_level を下げる"]
    E --> H["model_output ステップを連結"]
    classDef hub fill:#dfe3f8,stroke:#34439a,color:#1b2360,stroke-width:2px
    classDef box fill:#f7edd3,stroke:#7d5c14,color:#4a3608,stroke-width:2px
    classDef done fill:#dff0e6,stroke:#2d6a4a,color:#14402b,stroke-width:2px
    class A hub
    class C box
    class H done`;
const DIAGRAM_5 = `flowchart TD
    A["ユーザー入力"] --> B["モデルが functionCall を返す　Thought Signature 付き"]
    B --> C["アプリがツールを実行"]
    C --> D{"状態管理は?"}
    D -->|"Interactions API　previous_interaction_id"| E["サーバーが署名を保持　結果だけ送る"]
    D -->|"GenerateContent を直接使用"| F["署名を含む履歴を　そのまま返送"]
    E --> G["モデルが推論を再開　最終回答"]
    F --> G
    F -.->|"署名の欠落"| X["400 エラー　または推論品質の低下"]
    classDef hub fill:#dfe3f8,stroke:#34439a,color:#1b2360,stroke-width:2px
    classDef box fill:#f7edd3,stroke:#7d5c14,color:#4a3608,stroke-width:2px
    classDef done fill:#dff0e6,stroke:#2d6a4a,color:#14402b,stroke-width:2px
    class A hub
    class D,X box
    class G done`;
const DIAGRAM_6 = `flowchart TD
    S["タスクをサブエージェント化したい"] --> Q1{"自己完結していて　途中の指示変更が不要?"}
    Q1 -->|"はい"| P1["パターン1　インライン・ツール　まずここから"]
    Q1 -->|"いいえ"| Q2{"独立した作業を　並列に走らせたい?"}
    Q2 -->|"はい"| P2["パターン2　ファンアウト"]
    Q2 -->|"いいえ"| Q3{"途中で指示を出し直す　協調が必要?"}
    Q3 -->|"はい"| P3["パターン3　エージェントプール"]
    Q3 -->|"調整が複雑すぎる"| P4["パターン4　チーム　全員フロンティア級を用意"]
    classDef hub fill:#dfe3f8,stroke:#34439a,color:#1b2360,stroke-width:2px
    classDef box fill:#f7edd3,stroke:#7d5c14,color:#4a3608,stroke-width:2px
    classDef done fill:#dff0e6,stroke:#2d6a4a,color:#14402b,stroke-width:2px
    class S hub
    class Q1 box
    class P1 done`;
const DIAGRAM_7 = `flowchart TB
    U["ユーザーの依頼"] --> P["計画役　Argon + high"]
    P --> W1["実働1　3.8 Flash + medium"]
    P --> W2["実働2　3.8 Flash + medium"]
    P --> W3["抽出　3.5 Flash-Lite + minimal"]
    W1 --> R["レビュー役　Argon + medium"]
    W2 --> R
    W3 --> R
    R --> OUT["最終成果物　検証スクリプトで合否判定"]
    classDef hub fill:#dfe3f8,stroke:#34439a,color:#1b2360,stroke-width:2px
    classDef box fill:#f7edd3,stroke:#7d5c14,color:#4a3608,stroke-width:2px
    classDef done fill:#dff0e6,stroke:#2d6a4a,color:#14402b,stroke-width:2px
    class U hub
    class OUT done`;
const DIAGRAM_8 = `flowchart TD
    A["コスト評価を始める"] --> B["自社の実タスク20〜50件で　Argon と Flash を比較"]
    B --> C["usage から　入力・キャッシュ・出力・思考を集計"]
    C --> D{"キャッシュヒット率は　想定どおり?"}
    D -->|"低い"| E["プレフィックスの変動を調査　共通部分を先頭へ"]
    E --> C
    D -->|"十分"| F["標準価格 12月1日以降 で　1タスク単価を再計算"]
    F --> G{"合格率あたりの単価は　許容範囲?"}
    G -->|"はい"| H["Argon を難所に限定して採用"]
    G -->|"いいえ"| I["思考水準を下げる　または Flash へ寄せる"]
    I --> B
    classDef hub fill:#dfe3f8,stroke:#34439a,color:#1b2360,stroke-width:2px
    classDef box fill:#f7edd3,stroke:#7d5c14,color:#4a3608,stroke-width:2px
    classDef done fill:#dff0e6,stroke:#2d6a4a,color:#14402b,stroke-width:2px
    class A hub
    class D box
    class H done`;
const DIAGRAM_9 = `flowchart TD
    A["リクエスト"] --> B["Argon で実行　タイムアウト20分"]
    B --> C{"成功?"}
    C -->|"はい"| D["usage とキャッシュ率を記録"]
    C -->|"レート制限・到達不可"| E["gemini-3.8-flash へフォールバック"]
    C -->|"incomplete かつ空"| F["max_output_tokens を引き上げ　または思考水準を下げて再試行"]
    E --> D
    F --> B
    D --> G["評価セットで　週次の回帰テスト"]
    classDef hub fill:#dfe3f8,stroke:#34439a,color:#1b2360,stroke-width:2px
    classDef box fill:#f7edd3,stroke:#7d5c14,color:#4a3608,stroke-width:2px
    classDef done fill:#dff0e6,stroke:#2d6a4a,color:#14402b,stroke-width:2px
    class A hub
    class C box
    class G done`;
const THEME = {
  fontFamily:
    '"Noto Sans JP","Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif',
  fontSize: "15px",
  primaryColor: "#ffffff",
  primaryTextColor: "#26231e",
  primaryBorderColor: "#34439a",
  lineColor: "#4b453b",
  secondaryColor: "#f2ede1",
  tertiaryColor: "#faf7f0",
  edgeLabelBackground: "#ffffff",
};
export default function Page() {
  return (
    <div id="gemini-guide" className={styles.root} data-page="gemini-models">
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.48.0/dist/tabler-icons.min.css"
        integrity="sha384-vLTRpuTnY1DxbKXUegP6YfVJo5azL+nO4yWUyJjWFDChoMy9oUTnSmIZhMWjI5qs"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.12.0/build/styles/atom-one-dark.min.css"
        integrity="sha384-oaMLBGEzBOJx3UHwac0cVndtX5fxGQIfnAeFZ35RTgqPcYlbprH9o9PUV/F8Le07"
        crossOrigin="anonymous"
      />
      {"\n"}
      {"   "}{" "}
      <button
        className={styles["menu-btn"]}
        type="button"
        aria-label="目次を開く"
        aria-expanded="false"
        id="gemini-menu"
        aria-controls="gemini-sidebar"
      >
        {"\n"}
        {"     "} <i className={["ti", "ti-menu-2"].join(" ")}></i>
        {"\n"}
        {"   "}{" "}
      </button>
      {"\n"}
      {"   "}{" "}
      <button
        type="button"
        id="gemini-backdrop"
        className={styles.backdrop}
        aria-label="目次を閉じる"
        tabIndex={-1}
      />
      {"\n"}
      {"   "}{" "}
      <div className={styles.layout} data-testid="layout-root">
        {"\n"}
        {"     "}{" "}
        <aside className={styles.sidebar} id="gemini-sidebar" data-testid="sidebar-nav">
          {"\n"}
          {"       "}{" "}
          <div className={styles["sidebar-brand"]}>
            {"\n"}
            {"         "}{" "}
            <div className={styles["brand-icon"]}>
              <i className={["ti", "ti-sparkles"].join(" ")}></i>
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["brand-text"]}>
              {"Gemini ガイド"}
              <br />
              <span className={styles.badge}>{"2026-10-23"}</span>
            </div>
            {"\n"}
            {"       "}{" "}
          </div>
          {"\n"}
          {"       "}{" "}
          <nav>
            {"\n"}
            {"         "} <div className={styles["nav-group"]}>{"はじめに"}</div>
            {"\n"}
            {"         "}{" "}
            <a
              className={[styles["nav-link"], styles.active].join(" ")}
              href="#s0"
              data-testid="sidebar-nav-link"
              aria-current="location"
            >
              <i className={["ti", "ti-compass"].join(" ")}></i>
              <span>{"0. このガイドの読み方と情報の確からしさ"}</span>
            </a>
            {"\n"}
            {"         "}{" "}
            <a className={styles["nav-link"]} href="#s1" data-testid="sidebar-nav-link">
              <i className={["ti", "ti-map-2"].join(" ")}></i>
              <span>{"1. 2026年10月時点の全体像"}</span>
            </a>
            {"\n"}
            {"         "} <div className={styles["nav-group"]}>{"ステップ別ガイド"}</div>
            {"\n"}
            {"         "}{" "}
            <a className={styles["nav-link"]} href="#s2" data-testid="sidebar-nav-link">
              <i className={["ti", "ti-plug-connected"].join(" ")}></i>
              <span>{"Step 1: 環境を整える(Interactions API を軸にする)"}</span>
            </a>
            {"\n"}
            {"         "}{" "}
            <a className={styles["nav-link"]} href="#s3" data-testid="sidebar-nav-link">
              <i className={["ti", "ti-switch-horizontal"].join(" ")}></i>
              <span>{"Step 2: ワークロードに合うモデルを選ぶ"}</span>
            </a>
            {"\n"}
            {"         "}{" "}
            <a className={styles["nav-link"]} href="#s4" data-testid="sidebar-nav-link">
              <i className={["ti", "ti-brain"].join(" ")}></i>
              <span>{"Step 3: thinking_level を設計する"}</span>
            </a>
            {"\n"}
            {"         "}{" "}
            <a className={styles["nav-link"]} href="#s5" data-testid="sidebar-nav-link">
              <i className={["ti", "ti-arrows-exchange"].join(" ")}></i>
              <span>{"Step 4: max_output_tokens と Long Decode を使いこなす"}</span>
            </a>
            {"\n"}
            {"         "}{" "}
            <a className={styles["nav-link"]} href="#s6" data-testid="sidebar-nav-link">
              <i className={["ti", "ti-route"].join(" ")}></i>
              <span>{"Step 5: 旧モデルからの移行で壊れやすい点を先に潰す"}</span>
            </a>
            {"\n"}
            {"         "}{" "}
            <a className={styles["nav-link"]} href="#s7" data-testid="sidebar-nav-link">
              <i className={["ti", "ti-message-chatbot"].join(" ")}></i>
              <span>{"Step 6: プロンプトとコンテキストを設計する"}</span>
            </a>
            {"\n"}
            {"         "}{" "}
            <a className={styles["nav-link"]} href="#s8" data-testid="sidebar-nav-link">
              <i className={["ti", "ti-function"].join(" ")}></i>
              <span>{"Step 7: 関数呼び出しと Thought Signatures"}</span>
            </a>
            {"\n"}
            {"         "}{" "}
            <a className={styles["nav-link"]} href="#s9" data-testid="sidebar-nav-link">
              <i className={["ti", "ti-robot"].join(" ")}></i>
              <span>{"Step 8: エージェント設計(Managed Agents / サブエージェント)"}</span>
            </a>
            {"\n"}
            {"         "}{" "}
            <a className={styles["nav-link"]} href="#s10" data-testid="sidebar-nav-link">
              <i className={["ti", "ti-coin"].join(" ")}></i>
              <span>{"Step 9: コスト最適化(タスク単価で測る)"}</span>
            </a>
            {"\n"}
            {"         "}{" "}
            <a className={styles["nav-link"]} href="#s11" data-testid="sidebar-nav-link">
              <i className={["ti", "ti-shield-check"].join(" ")}></i>
              <span>{"Step 10: 本番運用(信頼性・安全性・評価)"}</span>
            </a>
            {"\n"}
            {"         "}{" "}
            <a className={styles["nav-link"]} href="#s12" data-testid="sidebar-nav-link">
              <i className={["ti", "ti-photo"].join(" ")}></i>
              <span>{"Step 11: マルチモーダル・周辺モデルの使いどころ"}</span>
            </a>
            {"\n"}
            {"         "} <div className={styles["nav-group"]}>{"付録・参考"}</div>
            {"\n"}
            {"         "}{" "}
            <a className={styles["nav-link"]} href="#s13" data-testid="sidebar-nav-link">
              <i className={["ti", "ti-bug"].join(" ")}></i>
              <span>{"よくある落とし穴と対処(トラブルシューティング表)"}</span>
            </a>
            {"\n"}
            {"         "}{" "}
            <a className={styles["nav-link"]} href="#s14" data-testid="sidebar-nav-link">
              <i className={["ti", "ti-checklist"].join(" ")}></i>
              <span>{"導入チェックリスト"}</span>
            </a>
            {"\n"}
            {"         "}{" "}
            <a className={styles["nav-link"]} href="#s15" data-testid="sidebar-nav-link">
              <i className={["ti", "ti-bulb"].join(" ")}></i>
              <span>{"補足: 著名開発者・独立評価から得られる追加のベストプラクティス"}</span>
            </a>
            {"\n"}
            {"         "}{" "}
            <a className={styles["nav-link"]} href="#s16" data-testid="sidebar-nav-link">
              <i className={["ti", "ti-link"].join(" ")}></i>
              <span>{"参考URL(根拠ソース一覧)"}</span>
            </a>
            {"\n"}
            {"       "}{" "}
          </nav>
          {"\n"}
          {"     "}{" "}
        </aside>
        {"\n"}
        {"     "}{" "}
        <div className={styles.main}>
          {"\n"}
          {"       "}{" "}
          <header className={styles.hero}>
            {"\n"}
            {"         "}{" "}
            <div className={styles["hero-eyebrow"]}>
              {"\n"}
              {"           "} <i className={["ti", "ti-rocket"].join(" ")}></i>
              <span>{"Google Gemini · 中級〜上級"}</span>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h1>{"Google Gemini 最新モデル ベストプラクティス完全ガイド"}</h1>
            {"\n"}
            {"         "}{" "}
            <div className={styles["hero-meta"]}>
              {"\n"}
              {"           "}{" "}
              <p>
                {"\n"}
                {"             "} <strong>{"対象読者"}</strong>
                {": 中級〜上級のAIエンジニア / "}
                <strong>{"情報時点"}</strong>
                {":\n              2026年10月23日 / "}
                <strong>{"形式"}</strong>
                {": ステップバイステップ\n            "}
              </p>
              {"\n"}
              {"           "}{" "}
              <p>
                {"\n"}
                {"             "} <strong>{"範囲"}</strong>
                {
                  ": Gemini 4 Argon、Gemini 3.8 / 3.6 / 3.5 Flash\n              系、周辺モデル(画像・動画・音声・Live・ロボティクス)、Interactions API、Managed\n              Agents(Antigravity)\n            "
                }
              </p>
              {"\n"}
              {"           "}{" "}
              <p>
                {"\n"}
                {"             "} <strong>{"表記ルール"}</strong>
                {
                  ": 図解は Mermaid と Markdown\n              の表のみを使用。コードブロックはすべて言語指定(シンタックスハイライト付き)。\n            "
                }
              </p>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["hero-chips"]}>
              {"\n"}
              {"           "} <span>{"Gemini 4 Argon"}</span>
              <span>{"Gemini 3.8 Flash"}</span>
              <span>{"Interactions API"}</span>
              <span>{"Long Decode"}</span>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"       "}{" "}
          </header>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s0">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-compass"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "} <h2 id="s0-heading">{"0. このガイドの読み方と情報の確からしさ"}</h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-0">{"0.1 読み方"}</h3>
            {"\n"}
            {"         "}{" "}
            <p>
              {"\n"}
              {"            "}
              {"各 Step は「"}
              <strong>{"何をするか → なぜか → どうやるか → 確認方法"}</strong>
              {
                "」の順で構成しています。最短で実務に入りたい場合は、次の順で読んでください。\n          "
              }
            </p>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"目的"}</th>
                    <th>{"読む章"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"今すぐ Argon を試したい"}</td>
                    <td>{"Step 1 → Step 3 → Step 4 → Step 5"}</td>
                  </tr>
                  <tr>
                    <td>{"既存アプリを Gemini 3.x / 2.5 から移行したい"}</td>
                    <td>{"Step 5 → Step 7 → Step 9"}</td>
                  </tr>
                  <tr>
                    <td>{"エージェントを作りたい"}</td>
                    <td>{"Step 6 → Step 7 → Step 8 → Step 10"}</td>
                  </tr>
                  <tr>
                    <td>{"コストを抑えたい"}</td>
                    <td>{"Step 3 → Step 9"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-1">{"0.2 情報の確からしさ(重要)"}</h3>
            {"\n"}
            {"         "}{" "}
            <p>
              {
                "\n            このガイドの数値・主張は、出どころによって信頼度が異なります。判断材料として必ず区別してください。\n          "
              }
            </p>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"区分"}</th>
                    <th>{"例"}</th>
                    <th>{"扱い方"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{"公式ドキュメント"}</strong>
                    </td>
                    <td>{"モデルID、価格、API仕様、移行チェックリスト"}</td>
                    <td>{"設計の根拠として採用してよい。ただし変更されるため実装前に再確認"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"ベンダー報告ベンチマーク"}</strong>
                    </td>
                    <td>{"DeepSWE v1.1、Vals Index、Gray Swan IPI など"}</td>
                    <td>{"「Google が自社の条件で測った値」。第三者再現が出るまで参考値"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"独立評価"}</strong>
                    </td>
                    <td>{"Artificial Analysis の Intelligence Index・タスク単価"}</td>
                    <td>{"比較の軸として有用。ただし指標の定義に依存する"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"個人・小規模ベンチ"}</strong>
                    </td>
                    <td>{"特定モノレポでの実測ブログなど"}</td>
                    <td>{"単一コードベースの結果。自社タスクで再現確認が必須"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={[styles.callout, styles.note].join(" ")} data-variant="info">
              {"\n"}
              {"           "} <i className={["ti", "ti-info-circle"].join(" ")}></i>
              {"\n"}
              {"           "}{" "}
              <div className={styles["callout-body"]}>
                {"\n"}
                {"             "}{" "}
                <p>
                  {"\n"}
                  {"               "}{" "}
                  <strong>{"この種のモデルの比較記事は日々更新されます。"}</strong>
                  {
                    "\n                価格・提供形態・非推奨スケジュールは、実装・見積もりの直前に公式ページ("
                  }
                  <a href="#s16">{"参考URL"}</a>
                  {"の A 群)で必ず確認してください。\n              "}
                </p>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s1">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-map-2"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "} <h2 id="s1-heading">{"1. 2026年10月時点の全体像"}</h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-2">{"1.1 一枚で把握する「現行ラインナップ」"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"モデル"}</th>
                    <th>{"モデルID"}</th>
                    <th>{"位置づけ"}</th>
                    <th>{"主な特徴"}</th>
                    <th>{"価格(100万トークンあたり、入力 / 出力)"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{"Gemini 4 Argon"}</strong>
                    </td>
                    <td>
                      <code>{"gemini-4-argon"}</code>
                    </td>
                    <td>
                      <strong>{"最上位(フロンティア)"}</strong>
                    </td>
                    <td>
                      {
                        "\n                    長期的なソフトウェア開発・エージェント・数学/科学向け。入出力で共有される約1Mトークンの統合ウィンドウ、"
                      }
                      <strong>{"Long Decode"}</strong>
                      {"(最大 約1Mトークン出力)\n                  "}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"導入価格 "}
                      <strong>{"$2 / $10"}</strong>
                      {"(〜2026-11-30)、12/1以降\n                    "}
                      <strong>{"$4 / $20"}</strong>
                      {"。キャッシュ入力 $0.10 → $0.20\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"Gemini 3.8 Flash"}</strong>
                    </td>
                    <td>
                      <code>{"gemini-3.8-flash"}</code>
                    </td>
                    <td>
                      <strong>{"最新の Flash(主力の高速モデル)"}</strong>
                    </td>
                    <td>
                      {
                        "\n                    長期ソフトウェア開発、自律エージェント、企業ワークフロー向け。Managed\n                    Agents(Antigravity)の既定モデル\n                  "
                      }
                    </td>
                    <td>{"導入価格 $0.75 / $3.75(〜2026-12-31)、2027-01-01以降 $1.50 / $7.50"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"Gemini 3.6 Flash"}</strong>
                    </td>
                    <td>
                      <code>{"gemini-3.6-flash"}</code>
                    </td>
                    <td>{"前世代の安定 Flash"}</td>
                    <td>{"トークン効率・コード/エージェント計画の改善、出力の冗長さの改善"}</td>
                    <td>
                      {
                        "\n                    3.7 Flash 公開時に導入価格 $0.75 / $3.75 が適用(〜2026-12-31)。以降 $1.50 /\n                    $7.50\n                  "
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"Gemini 3.5 Flash-Lite"}</strong>
                    </td>
                    <td>
                      <code>{"gemini-3.5-flash-lite"}</code>
                    </td>
                    <td>
                      <strong>{"低遅延・低コスト"}</strong>
                    </td>
                    <td>
                      {
                        "\n                    大量処理、データ抽出、サブエージェント向け。既定の思考レベルは\n                    "
                      }
                      <code>{"minimal"}</code>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                    <td>{"$0.30 / $2.50"}</td>
                  </tr>
                  <tr>
                    <td>{"Gemini 3.7 Flash"}</td>
                    <td>
                      <code>{"gemini-3.7-flash"}</code>
                    </td>
                    <td>{"非推奨(API では 3.8 Flash へ自動ルーティング)"}</td>
                    <td>{"—"}</td>
                    <td>{"—"}</td>
                  </tr>
                  <tr>
                    <td>{"Gemini 3.5 Flash"}</td>
                    <td>
                      <code>{"gemini-3.5-flash"}</code>
                    </td>
                    <td>{"非推奨(API では 3.6 Flash へ自動ルーティング)"}</td>
                    <td>{"—"}</td>
                    <td>{"—"}</td>
                  </tr>
                  <tr>
                    <td>{"Gemini 2.5 系"}</td>
                    <td>
                      <code>{"gemini-2.5-*"}</code>
                    </td>
                    <td>{"レガシー"}</td>
                    <td>
                      {
                        "\n                    API では「過去に使ったユーザーのみ」アクセス制限。Vertex 側の退役日は 2026-10-20\n                  "
                      }
                    </td>
                    <td>{"新規プロジェクトでは使わない"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={[styles.callout, styles.warn].join(" ")} data-variant="warn">
              {"\n"}
              {"           "}{" "}
              <i className={["ti", "ti-alert-triangle"].join(" ")} data-testid="callout-label"></i>
              {"\n"}
              {"           "}{" "}
              <div className={styles["callout-body"]}>
                {"\n"}
                {"             "}{" "}
                <p>
                  {"\n"}
                  {"               "} <strong>{"注意"}</strong>
                  {": 非推奨・退役日は "}
                  <strong>{"Gemini API(AI Studio)"}</strong> {"と\n                "}
                  <strong>{"Google Cloud(Vertex / Gemini Enterprise Agent Platform)"}</strong>
                  {
                    "\n                で異なります。たとえば 3.7 Flash は API 側で 2026-10-08 に非推奨化されて 3.8 Flash\n                にルーティングされますが、Cloud 側のモデルバージョン表では 2027-01-28\n                退役と記載されています。"
                  }
                  <strong>{"利用している提供面のページ"}</strong>
                  {"を基準にしてください。\n              "}
                </p>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-3">{"1.2 周辺モデル(用途別)"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"用途"}</th>
                    <th>{"モデル / エージェント"}</th>
                    <th>{"要点"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"画像生成・会話編集"}</td>
                    <td>
                      <code>{"gemini-nano-banana-2.1"}</code>
                      {"(Nano Banana 2.1)"}
                    </td>
                    <td>
                      {
                        "\n                    2026-10-06\n                    GA。視覚品質、プロンプト追従、キャラクター一貫性、文字描画、極端な縦横比(1:4 /\n                    4:1 / 1:8 / 8:1)を改善。旧 "
                      }
                      <code>{"gemini-3.1-flash-image"}</code> {"は非推奨\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"動画生成・編集"}</td>
                    <td>
                      <code>{"gemini-omni-1.1-flash"}</code>
                    </td>
                    <td>
                      {
                        "\n                    対話型の動画生成/編集。動画延長、最初と最後のフレーム補間、解像度指定(360p〜4K。1080p/4Kはアップスケール)\n                  "
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>{"音楽生成"}</td>
                    <td>
                      <code>{"lyria-3.5"}</code>
                    </td>
                    <td>{"フルレングス楽曲生成、44.1kHz ステレオ"}</td>
                  </tr>
                  <tr>
                    <td>{"音声合成(TTS)"}</td>
                    <td>
                      {"\n"}
                      {"                   "} <code>{"gemini-3.8-flash-tts"}</code> {"/ "}
                      <code>{"gemini-3.8-flash-lite-tts"}</code>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                    <td>
                      {
                        "\n                    スタジオ品質 / 低コスト・高スループット。Voices\n                    エンドポイントと音声デザイン・複製\n                  "
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>{"リアルタイム音声"}</td>
                    <td>
                      {"\n"}
                      {"                   "} <code>{"gemini-3.8-live"}</code> {"/ "}
                      <code>{"gemini-3.8-live-extended-thinking"}</code>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                    <td>{"Live API 用。低遅延対話 / バックグラウンド推論付き"}</td>
                  </tr>
                  <tr>
                    <td>{"文字起こし"}</td>
                    <td>
                      {"\n"}
                      {"                   "} <code>{"gemini-3.5-transcribe"}</code> {"/ "}
                      <code>{"gemini-3.5-transcribe-live"}</code>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                    <td>{"85言語以上、話者分離、単語タイムスタンプ、語彙バイアス"}</td>
                  </tr>
                  <tr>
                    <td>{"ロボティクス"}</td>
                    <td>
                      <code>{"gemini-robotics-er-2-preview"}</code> {"ほか"}
                    </td>
                    <td>{"具現化推論(プレビュー)"}</td>
                  </tr>
                  <tr>
                    <td>{"リサーチ・エージェント"}</td>
                    <td>
                      {"\n"}
                      {"                   "} <code>{"deep-research-preview-04-2026"}</code>{" "}
                      {"/\n                    "}
                      <code>{"deep-research-max-preview-04-2026"}</code>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"旧 "}
                      <code>{"deep-research-pro-preview-12-2025"}</code>{" "}
                      {"は 2026-10-23 に停止予定\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"コーディング・エージェント"}</td>
                    <td>
                      <code>{"antigravity-preview-09-2026"}</code>
                      {"(Managed Agents)"}
                    </td>
                    <td>
                      {"既定モデルは 3.8 Flash。"}
                      <code>{"agent_config"}</code> {"で Argon に切替可能"}
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-4">{"1.3 リリースの流れ(把握しておきたい時系列)"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["diagram-card"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-title"]}>
                {"\n"}
                {"             "} <i className={["ti", "ti-route"].join(" ")}></i>
                <span>{"図1　Gemini のリリースの流れ"}</span>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram chart={DIAGRAM_0} theme="base" themeVariables={THEME} />
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={[styles.callout, styles.note].join(" ")} data-variant="info">
              {"\n"}
              {"           "} <i className={["ti", "ti-info-circle"].join(" ")}></i>
              {"\n"}
              {"           "}{" "}
              <div className={styles["callout-body"]}>
                {"\n"}
                {"             "}{" "}
                <p>
                  {
                    "\n                Gemini 3.5 Pro は公開されず、最上位は Gemini 4 Argon\n                に置き換わった、と複数の報道が伝えています。\n              "
                  }
                </p>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-5">{"1.4 Argon の公式な要点(最低限これだけは押さえる)"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"項目"}</th>
                    <th>{"内容"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"統合ウィンドウ"}</td>
                    <td>
                      {"入力・思考・出力が "}
                      <strong>{"1,048,576 トークンを共有"}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{"1リクエストの出力"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"既定 "}
                      <strong>{"65,536 トークン"}</strong>
                      {"。それ以上は\n                    "}
                      <strong>{"Long Decode"}</strong>
                      {"("}
                      <code>{"background: true"}</code> {"+\n                    "}
                      <code>{"max_output_tokens"}</code> {"引き上げ)\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"思考レベル"}</td>
                    <td>
                      {"\n"}
                      {"                   "} <code>{"low"}</code> {"/ "}
                      <code>{"medium"}</code>
                      {"(既定)/ "}
                      <code>{"high"}</code>
                      {"。"}
                      <code>{"minimal"}</code>
                      {"\n"}
                      {"                    "}
                      {"は非対応\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"サンプリング"}</td>
                    <td>
                      {"\n"}
                      {"                   "} <code>{"temperature"}</code> {"/ "}
                      <code>{"top_p"}</code> {"/ "}
                      <code>{"top_k"}</code> {"は\n                    "}
                      <strong>{"無視される"}</strong>
                      {"(送っても効かない)\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"キャッシュ"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <strong>
                        {"明示キャッシュ("}
                        <code>{"cachedContents"}</code> {"/\n                      "}
                        <code>{"caches.create"}</code>
                        {")は非対応でエラー"}
                      </strong>
                      {"。"}
                      <strong>{"暗黙キャッシュのみ"}</strong>
                      {
                        "(4,096トークン以上のプロンプトで有効、キャッシュヒット入力は95%割引)\n                  "
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>{"提供"}</td>
                    <td>
                      {
                        "\n                    有料 Gemini API、Google AI Studio、Antigravity、対象の Gemini\n                    Enterprise。"
                      }
                      <strong>{"無料枠では使えない"}</strong>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"新機能"}</td>
                    <td>{"エージェント型動画理解が GA、Managed Agents(Antigravity)で利用可"}</td>
                  </tr>
                  <tr>
                    <td>{"タイムアウト"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"難しいプロンプトは数分かかる。"}
                      <strong>{"HTTPクライアントのタイムアウトは20分"}</strong>
                      {"、または\n                    background 実行\n                  "}
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-6">
              {"1.5 ベンチマークの読み方(ベンダー報告と独立評価を分けて見る)"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"指標"}</th>
                    <th>{"Gemini 4 Argon"}</th>
                    <th>{"比較"}</th>
                    <th>{"区分"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"DeepSWE v1.1"}</td>
                    <td>{"77.9%"}</td>
                    <td>{"Claude Opus 5.5 74.2% / GPT-6 Astra 74.1%"}</td>
                    <td>{"ベンダー報告"}</td>
                  </tr>
                  <tr>
                    <td>{"Vals Index"}</td>
                    <td>{"68.9%(1位と報告)"}</td>
                    <td>{"—"}</td>
                    <td>{"ベンダー報告"}</td>
                  </tr>
                  <tr>
                    <td>{"AutomationBench(Zapier)"}</td>
                    <td>{"51.3%(1位と報告)"}</td>
                    <td>{"—"}</td>
                    <td>{"ベンダー報告"}</td>
                  </tr>
                  <tr>
                    <td>{"LVBench(長尺動画理解)"}</td>
                    <td>{"91.7%"}</td>
                    <td>{"—"}</td>
                    <td>{"ベンダー報告"}</td>
                  </tr>
                  <tr>
                    <td>{"ERQA(具現化推論)"}</td>
                    <td>{"87%"}</td>
                    <td>{"—"}</td>
                    <td>{"ベンダー報告"}</td>
                  </tr>
                  <tr>
                    <td>{"Terminal-Bench 4.0"}</td>
                    <td>{"57.4%"}</td>
                    <td>{"Claude Opus 5.5 66.4%"}</td>
                    <td>{"Google の比較表(Argon が劣後)"}</td>
                  </tr>
                  <tr>
                    <td>{"Gray Swan 間接プロンプトインジェクション(攻撃成功率、低いほど良い)"}</td>
                    <td>{"0.7%"}</td>
                    <td>{"Opus 5.5 1.0% など"}</td>
                    <td>{"ベンダー報告"}</td>
                  </tr>
                  <tr>
                    <td>{"Artificial Analysis Intelligence Index"}</td>
                    <td>{"53(高思考)"}</td>
                    <td>{"GPT-6 Astra 53 / GPT-6.1 Sol 52 / Claude Opus 5.5 は5ポイント上"}</td>
                    <td>
                      <strong>{"独立評価"}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{"同 インデックス1タスクあたりコスト"}</td>
                    <td>{"$1.99(導入価格)/ $3.98(標準価格)"}</td>
                    <td>{"GPT-6 Astra $3.26"}</td>
                    <td>
                      <strong>{"独立評価"}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <p>
              <strong>{"読み取れること"}</strong>
            </p>
            {"\n"}
            {"         "}{" "}
            <ol>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"              "}
                {"Argon\n              は「全勝」ではなく、"}
                <strong>{"長期的なソフトウェア開発・金融/法務・業務自動化・長尺動画"}</strong>
                {"で強く、ターミナル操作系などでは競合が上回る領域もある。\n            "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"導入価格のうちは安い"}</strong>
                {
                  "が、12/1\n              に2倍になる。比較は必ず「標準価格」でも行う。\n            "
                }
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {
                  "\n              ベンダー報告値は、独立リーダーボードにまだ載っていないものがある。"
                }
                <strong>{"自社タスクでの再現"}</strong>
                {"が最終判断。\n            "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ol>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s2">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-plug-connected"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "}{" "}
              <h2 id="s2-heading">{"Step 1: 環境を整える(Interactions API を軸にする)"}</h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-7">{"何をするか"}</h3>
            {"\n"}
            {"         "}{" "}
            <p>
              {
                "\n            Gemini 3 世代以降の新機能(サーバー側の会話状態管理、背景実行、Managed Agents、Long\n            Decode)は "
              }
              <strong>{"Interactions API"}</strong>
              {
                " を中心に提供されています。まず SDK\n            と認証、最小の呼び出しを確立します。\n          "
              }
            </p>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-8">{"なぜか"}</h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"              "}
                {"Interactions API は\n              "}
                <strong>{"モデルとエージェントを同じインターフェースで扱う"}</strong>
                {"統一API。\n            "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <code>{"previous_interaction_id"}</code> {"で\n              "}
                <strong>{"会話状態と Thought Signatures をサーバー側で保持"}</strong>
                {
                  "でき、クライアントの履歴管理ミスを減らせる(Philipp Schmid\n              の解説でも「再送不要・署名の自動管理」が利点として挙げられています)。\n            "
                }
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"              "}
                {"Argon の Long Decode(1Mトークン出力)は\n              "}
                <strong>{"背景実行(background)を前提"}</strong>
                {"にした仕組み。\n            "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-9">{"どうやるか"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"           "}{" "}
              <div className={styles["cb-head"]}>
                <i className={["ti", "ti-code"].join(" ")}></i>
                <span>{"bash"}</span>
              </div>
              {"\n"}
              {"           "}{" "}
              <pre>
                <code className={["language-bash"].join(" ")} id="c0">
                  <div className={styles.codeLine}>
                    <span className="hljs-comment">{"# 1) SDK のインストール(Python の例)"}</span>
                    {"\npip install --upgrade google-genai\n\n"}
                    <span className="hljs-comment">
                      {
                        "# 2) 認証(Argon は無料枠では使えないため、課金が有効なプロジェクトのキーを使う)"
                      }
                    </span>
                    {"\n"}
                    <span className="hljs-built_in">{"export"}</span> {"GEMINI_API_KEY="}
                    <span className="hljs-string">{'"あなたのAPIキー"'}</span>
                  </div>
                </code>
              </pre>
              {"\n"}
              {"           "} {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"           "}{" "}
              <div className={styles["cb-head"]}>
                <i className={["ti", "ti-code"].join(" ")}></i>
                <span>{"python"}</span>
              </div>
              {"\n"}
              {"           "}{" "}
              <pre>
                <code className={["language-python"].join(" ")} id="c1">
                  <div className={styles.codeLine}>
                    <span className="hljs-comment">{"# 3) 最小の呼び出し(Interactions API)"}</span>
                    {"\n"}
                    <span className="hljs-comment">
                      {
                        "# API 単体ではリポジトリを読めないため、レビュー対象のコードを入力に含める(テキストのみのレビュー)"
                      }
                    </span>
                    {"\n"}
                    <span className="hljs-keyword">{"from"}</span> {"pathlib "}
                    <span className="hljs-keyword">{"import"}</span> {"Path\n\n"}
                    <span className="hljs-keyword">{"from"}</span> {"google "}
                    <span className="hljs-keyword">{"import"}</span>{" "}
                    {"genai\n\nclient = genai.Client()\ncode = Path("}
                    <span className="hljs-string">{'"payments/retry.py"'}</span>
                    {").read_text(encoding="}
                    <span className="hljs-string">{'"utf-8"'}</span>
                    {")\n\ninteraction = client.interactions.create(\n    model="}
                    <span className="hljs-string">{'"gemini-4-argon"'}</span>
                    {",\n    "}
                    <span className="hljs-built_in">{"input"}</span>
                    {"="}
                    <span className="hljs-string">
                      {
                        'f"次のコードの設計上のリスクを3つ挙げて、根拠も示してください。\\n\\n<code>\\n'
                      }
                      <span className="hljs-subst">{"{code}"}</span>
                      {'\\n</code>"'}
                    </span>
                    {",\n)\n"}
                    <span className="hljs-built_in">{"print"}</span>
                    {"(interaction.output_text)"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"           "} {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"           "}{" "}
              <div className={styles["cb-head"]}>
                <i className={["ti", "ti-code"].join(" ")}></i>
                <span>{"python"}</span>
              </div>
              {"\n"}
              {"           "}{" "}
              <pre>
                <code className={["language-python"].join(" ")} id="c2">
                  <div className={styles.codeLine}>
                    <span className="hljs-comment">
                      {"# 4) 会話の継続: 履歴を自分で組み立てず、前回のIDを渡す"}
                    </span>
                    {"\nfirst = client.interactions.create(\n    model="}
                    <span className="hljs-string">{'"gemini-4-argon"'}</span>
                    {",\n    "}
                    <span className="hljs-built_in">{"input"}</span>
                    {"="}
                    <span className="hljs-string">
                      {'"決済リトライ処理の競合状態を分析して。"'}
                    </span>
                    {",\n    system_instruction="}
                    <span className="hljs-string">
                      {
                        '"あなたはシニアのバックエンドエンジニアです。根拠のない断定はしないでください。"'
                      }
                    </span>
                    {",\n)\n\nsecond = client.interactions.create(\n    model="}
                    <span className="hljs-string">{'"gemini-4-argon"'}</span>
                    {",\n    "}
                    <span className="hljs-built_in">{"input"}</span>
                    {"="}
                    <span className="hljs-string">
                      {'"では、トランザクションロックを安全に書き直して。"'}
                    </span>
                    {",\n    "}
                    <span className="hljs-comment">
                      {
                        "# system_instruction は会話履歴として引き継がれないため、各リクエストで指定し直す"
                      }
                    </span>
                    {"\n"}
                    {"    "}
                    {"system_instruction="}
                    <span className="hljs-string">
                      {
                        '"あなたはシニアのバックエンドエンジニアです。根拠のない断定はしないでください。"'
                      }
                    </span>
                    {",\n    previous_interaction_id=first."}
                    <span className="hljs-built_in">{"id"}</span>
                    {",   "}
                    <span className="hljs-comment">{"# サーバー側の状態を引き継ぐ"}</span>
                    {"\n)\n"}
                    <span className="hljs-built_in">{"print"}</span>
                    {"(second.output_text)"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"           "} {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"           "}{" "}
              <div className={styles["cb-head"]}>
                <i className={["ti", "ti-code"].join(" ")}></i>
                <span>{"bash"}</span>
              </div>
              {"\n"}
              {"           "}{" "}
              <pre>
                <code className={["language-bash"].join(" ")} id="c3">
                  <div className={styles.codeLine}>
                    <span className="hljs-comment">
                      {"# 5) コマンドラインで素早く試す(Simon Willison の llm プラグイン経由)"}
                    </span>
                    {"\npip install llm llm-gemini\nllm -m gemini-4-argon -o thinking_level high "}
                    <span className="hljs-string">
                      {"'Prove that there are infinitely many primes'"}
                    </span>
                  </div>
                </code>
              </pre>
              {"\n"}
              {"           "} {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["diagram-card"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-title"]}>
                {"\n"}
                {"             "} <i className={["ti", "ti-route"].join(" ")}></i>
                <span>{"図2　Interactions API の会話の流れ"}</span>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram chart={DIAGRAM_1} theme="base" themeVariables={THEME} />
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-10">{"確認方法"}</h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"最小リクエストが成功し、"}
                <code>{"interaction.output_text"}</code> {"が返る。"}
              </li>
              {"\n"}
              {"           "} <li>{"2回目の呼び出しで、1回目の文脈が踏まえられている。"}</li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "}{" "}
            <div className={[styles.callout, styles.tip].join(" ")} data-variant="good">
              {"\n"}
              {"           "} <i className={["ti", "ti-bulb"].join(" ")}></i>
              {"\n"}
              {"           "}{" "}
              <div className={styles["callout-body"]}>
                {"\n"}
                {"             "}{" "}
                <p>
                  {"\n"}
                  {"               "} <strong>{"ヒント"}</strong>
                  {
                    ":\n                公式は「コーディングエージェントで移行を自動化する」手順を提供しています。Antigravity\n                など Skills 対応エージェントなら、"
                  }
                  <code>
                    {
                      "npx skills add google-gemini/gemini-skills --skill gemini-interactions-api\n                  --global"
                    }
                  </code>
                  {"\n"}
                  {"                "}
                  {"を実行後、"}
                  <code>{"/gemini-interactions-api migrate my app to Gemini 3.6 Flash"}</code>
                  {"\n"}
                  {"                "}
                  {"のように依頼できます(Argon 向けは "}
                  <code>{"gemini-api-dev"}</code> {"スキルで\n                "}
                  <code>{"/gemini-api-dev migrate my app to Gemini 4 Argon"}</code>
                  {")。\n              "}
                </p>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s3">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-switch-horizontal"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "} <h2 id="s3-heading">{"Step 2: ワークロードに合うモデルを選ぶ"}</h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-11">{"何をするか"}</h3>
            {"\n"}
            {"         "}{" "}
            <p>
              {"\n"}
              {"            "}
              {"「最上位を常用する」のではなく、"}
              <strong>{"難所だけ Argon、量をこなす部分は Flash / Flash-Lite"}</strong>
              {"\n"}
              {"            "}
              {"という階層設計にします。\n          "}
            </p>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-12">{"なぜか"}</h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"Argon は導入価格でも Flash より高く、"}
                <strong>{"12/1 以降は単価が2倍"}</strong>
                {"。"}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {
                  "\n              独立評価でもトークン消費は多め(Intelligence Index\n              1タスクあたり出力約62kトークンという報告)で、"
                }
                <strong>{"1トークン単価ではなく1タスク単価"}</strong>
                {"で判断する必要がある。\n            "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"              "}
                {"Google 自身が\n              "}
                <strong>{"Argon を計画役・レビュー役、3.8 Flash を並列のサブエージェント"}</strong>
                {"にする構成を提案している、と提供各社のドキュメントが伝えています。\n            "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-13">{"モデル選定フロー"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["diagram-card"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-title"]}>
                {"\n"}
                {"             "} <i className={["ti", "ti-route"].join(" ")}></i>
                <span>{"図3　モデル選定フロー"}</span>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram chart={DIAGRAM_2} theme="base" themeVariables={THEME} />
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-14">{"選定の目安(表)"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"ワークロード"}</th>
                    <th>{"第一候補"}</th>
                    <th>{"理由・注意"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"難しい数学・科学・形式的証明"}</td>
                    <td>
                      {"Argon + "}
                      <code>{"high"}</code> {"+ Long Decode"}
                    </td>
                    <td>{"64Kを超える思考が必要なことがある"}</td>
                  </tr>
                  <tr>
                    <td>{"大規模リファクタ・複数ファイル修正"}</td>
                    <td>
                      {"Argon + "}
                      <code>{"medium"}</code>
                    </td>
                    <td>{"公式は「複雑なコードやエージェント用途にも medium を推奨」"}</td>
                  </tr>
                  <tr>
                    <td>{"日常的なコーディング補助・企業ワークフロー"}</td>
                    <td>
                      {"3.8 Flash + "}
                      <code>{"medium"}</code>
                    </td>
                    <td>{"長期ソフトウェア開発向けに設計された Flash。コストが低い"}</td>
                  </tr>
                  <tr>
                    <td>{"低遅延チャット・下書き・インシデント対応"}</td>
                    <td>
                      {"3.8 Flash + "}
                      <code>{"low"}</code>
                    </td>
                    <td>{"公式が low の用途として例示"}</td>
                  </tr>
                  <tr>
                    <td>{"高スループットの文書抽出・構造化JSON"}</td>
                    <td>
                      {"3.5 Flash-Lite("}
                      <code>{"minimal"}</code> {"〜 "}
                      <code>{"high"}</code>
                      {")"}
                    </td>
                    <td>{"文書の複雑さに応じて minimal と high の両方で試す"}</td>
                  </tr>
                  <tr>
                    <td>{"自律サブエージェント(ツール連鎖あり)"}</td>
                    <td>
                      {"3.5 Flash-Lite + "}
                      <code>{"medium"}</code> {"/ "}
                      <code>{"high"}</code>
                    </td>
                    <td>
                      <code>{"minimal"}</code> {"のままだとツール実行が早期終了することがある"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"長尺動画の理解"}</td>
                    <td>{"Argon または Flash 系のエージェント型動画理解"}</td>
                    <td>{"トークンを大幅に節約できる(後述)"}</td>
                  </tr>
                  <tr>
                    <td>{"スクリーンショットからのHTML再現など視覚的な精密さ"}</td>
                    <td>{"他社モデルとの比較評価を必須に"}</td>
                    <td>{"個人ベンチで Argon が最下位だった例がある(単一ベンチ)"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s4">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-brain"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "} <h2 id="s4-heading">{"Step 3: thinking_level を設計する"}</h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-15">{"何をするか"}</h3>
            {"\n"}
            {"         "}{" "}
            <p>
              {"\n"}
              {"           "} <code>{"thinking_level"}</code>
              {"\n"}
              {"            "}
              {"を「品質・遅延・トークン消費」の"}
              <strong>{"主要ダイヤル"}</strong>
              {"として扱い、"}
              <strong>{"3水準すべてで自社評価を回し、基準を満たす最低の水準"}</strong>
              {"を採用します。\n          "}
            </p>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-16">{"なぜか"}</h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"              "}
                {"公式が「"}
                <code>{"low"}</code> {"/ "}
                <code>{"medium"}</code> {"/\n              "}
                <code>{"high"}</code>
                {
                  " の3水準で評価し、品質基準を満たす最低水準を選ぶ」と明記しています。\n            "
                }
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"              "}
                {"個人ベンチ(paddo.dev)でも、"}
                <strong>{"努力水準を上げても常に良くなるわけではない"}</strong>
                {
                  "ことが報告されています(Claude\n              / GPT 系での実測で、既定の medium が最適だった例。他社モデルの結果なので Gemini\n              にそのまま当てはまるとは限らず、"
                }
                <strong>{"自社で測る"}</strong>
                {"のが原則)。\n            "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-17">{"水準の使い分け"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"水準"}</th>
                    <th>{"トークン消費"}</th>
                    <th>{"向く用途"}</th>
                    <th>{"注意"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {"\n"}
                      {"                   "} <code>{"minimal"}</code>
                      {"(Flash / Flash-Lite のみ。"}
                      <strong>{"Argon と 3.8 Flash は非対応でエラー"}</strong>
                      {")\n                  "}
                    </td>
                    <td>{"最小"}</td>
                    <td>{"高スループットの抽出・分類・ルーティング"}</td>
                    <td>{"3.8 Flash / Argon で指定すると400系エラー"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"low"}</code>
                    </td>
                    <td>{"少"}</td>
                    <td>{"単純タスク、コスト重視、軽い分析・文章作成"}</td>
                    <td>{"難問では品質が落ちる"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"medium"}</code>
                      {"(既定)"}
                    </td>
                    <td>{"中"}</td>
                    <td>
                      <strong>{"大半のタスク"}</strong>
                      {"。複雑なコード、エージェント用途"}
                    </td>
                    <td>{"まずここから"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"high"}</code>
                    </td>
                    <td>{"多(最初のトークンまでが遅い)"}</td>
                    <td>{"難しい推論、数学/科学、最難関のコード・エージェント"}</td>
                    <td>{"Long Decode と相性が良い"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"           "}{" "}
              <div className={styles["cb-head"]}>
                <i className={["ti", "ti-code"].join(" ")}></i>
                <span>{"python"}</span>
              </div>
              {"\n"}
              {"           "}{" "}
              <pre>
                <code className={["language-python"].join(" ")} id="c4">
                  <div className={styles.codeLine}>
                    <span className="hljs-comment">
                      {"# thinking_level は generation_config で指定する"}
                    </span>
                    {"\ninteraction = client.interactions.create(\n    model="}
                    <span className="hljs-string">{'"gemini-4-argon"'}</span>
                    {",\n    "}
                    <span className="hljs-built_in">{"input"}</span>
                    {"="}
                    <span className="hljs-string">
                      {
                        '"この決済パイプラインの再試行時の競合状態を分析し、ロックを安全に書き直して。"'
                      }
                    </span>
                    {",\n    generation_config={"}
                    <span className="hljs-string">{'"thinking_level"'}</span>
                    {": "}
                    <span className="hljs-string">{'"medium"'}</span>
                    {"},\n)"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"           "} {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-18">{"水準の決め方(評価ループ)"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["diagram-card"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-title"]}>
                {"\n"}
                {"             "} <i className={["ti", "ti-route"].join(" ")}></i>
                <span>{"図4　thinking_level の決め方"}</span>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram chart={DIAGRAM_3} theme="base" themeVariables={THEME} />
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-19">{"よくある失敗"}</h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"              "}
                {"「トークンを減らしたい」ときに "}
                <code>{"max_output_tokens"}</code> {"を下げる →\n              "}
                <strong>{"思考で使い切って答えが空になる"}</strong>
                {"。トークンを減らすなら\n              "}
                <code>{"thinking_level"}</code> {"を下げる(公式の注意)。\n            "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <code>{"thinking_budget"}</code> {"を残す → "}
                <code>{"thinking_budget"}</code>
                {
                  " は Gemini 2.5\n              系向け。Gemini 3.5 Flash / 3.5 Flash-Lite を含む新しいモデルは\n              "
                }
                <code>{"thinking_level"}</code>
                {"(文字列)へ置換する。\n            "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s5">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-arrows-exchange"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "}{" "}
              <h2 id="s5-heading">{"Step 4: max_output_tokens と Long Decode を使いこなす"}</h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-20">{"何をするか"}</h3>
            {"\n"}
            {"         "}{" "}
            <p>
              {"\n"}
              {"           "} <code>{"max_output_tokens"}</code>
              {"\n"}
              {"            "}
              {"を「"}
              <strong>{"思考+出力の合計上限"}</strong>
              {"」として設計し、64Kを超える必要があるときだけ\n            "}
              <strong>{"Long Decode(背景実行)"}</strong> {"を使います。\n          "}
            </p>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-21">{"なぜか"}</h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"              "}
                {"Argon\n              は思考にも出力枠を使うため、"}
                <strong>{"低い上限だと思考だけで切れて空の応答"}</strong>
                {"になりうる。\n            "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"              "}
                {"Long Decode は\n              "}
                <strong>{"64Kトークンずつの「ホップ」"}</strong>
                {
                  "\n              で続きを生成し、サーバーが自動で連結する。使いすぎるとコストと時間が膨らむ。\n            "
                }
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-22">{"設定の目安(公式)"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"状況"}</th>
                    <th>
                      <code>{"max_output_tokens"}</code>
                    </th>
                    <th>{"background"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"標準タスク"}</td>
                    <td>{"既定(65,536)のままか未設定"}</td>
                    <td>{"不要"}</td>
                  </tr>
                  <tr>
                    <td>{"既存アプリで32K未満に制限している"}</td>
                    <td>
                      <strong>{"32,768 以上へ引き上げ"}</strong>
                    </td>
                    <td>{"不要"}</td>
                  </tr>
                  <tr>
                    <td>{"長いコーディング・エージェントタスク"}</td>
                    <td>{"65,536 から開始"}</td>
                    <td>{"不要"}</td>
                  </tr>
                  <tr>
                    <td>{"複雑な推論・数学・科学・証明"}</td>
                    <td>
                      <strong>{"131,072 / 262,144 など"}</strong>
                      {"(最大で 1,048,576 − 入力トークン)"}
                    </td>
                    <td>
                      <strong>
                        {"必須("}
                        <code>{"true"}</code>
                        {")"}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-23">{"Long Decode の実装例"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"           "}{" "}
              <div className={styles["cb-head"]}>
                <i className={["ti", "ti-code"].join(" ")}></i>
                <span>{"python"}</span>
              </div>
              {"\n"}
              {"           "}{" "}
              <pre>
                <code className={["language-python"].join(" ")} id="c5">
                  <div className={styles.codeLine}>
                    <span className="hljs-keyword">{"import"}</span> {"time\n"}
                    <span className="hljs-keyword">{"from"}</span> {"google "}
                    <span className="hljs-keyword">{"import"}</span>
                    {
                      " genai\n\nclient = genai.Client()\n\ninteraction = client.interactions.create(\n    model="
                    }
                    <span className="hljs-string">{'"gemini-4-argon"'}</span>
                    {",\n    "}
                    <span className="hljs-built_in">{"input"}</span>
                    {"="}
                    <span className="hljs-string">
                      {'"素数定理の完全で厳密な証明を書いてください。"'}
                    </span>
                    {",\n    background="}
                    <span className="hljs-literal">{"True"}</span>
                    {",                      "}
                    <span className="hljs-comment">{"# Long Decode は背景実行が前提"}</span>
                    {"\n"}
                    {"    "}
                    {"store="}
                    <span className="hljs-literal">{"True"}</span>
                    {",                           "}
                    <span className="hljs-comment">
                      {"# 背景実行には store=True が必要(store=False とは併用不可)"}
                    </span>
                    {"\n"}
                    {"    "}
                    {"generation_config={\n        "}
                    <span className="hljs-string">{'"max_output_tokens"'}</span>
                    {": "}
                    <span className="hljs-number">{"262144"}</span>
                    {",      "}
                    <span className="hljs-comment">{"# 65,536 を超える値を必ず設定する"}</span>
                    {"\n"}
                    {"       "} <span className="hljs-string">{'"thinking_level"'}</span>
                    {": "}
                    <span className="hljs-string">{'"high"'}</span>
                    {",\n    },\n)\n\n"}
                    <span className="hljs-comment">
                      {"# 完了までポーリング(長時間かかるため、短いタイムアウトで待たない)"}
                    </span>
                    {"\n"}
                    <span className="hljs-keyword">{"while"}</span> {"interaction.status "}
                    <span className="hljs-keyword">{"in"}</span> {"("}
                    <span className="hljs-string">{'"in_progress"'}</span>
                    {", "}
                    <span className="hljs-string">{'"queued"'}</span>
                    {"):\n    time.sleep("}
                    <span className="hljs-number">{"5"}</span>
                    {")\n    interaction = client.interactions.get("}
                    <span className="hljs-built_in">{"id"}</span>
                    {"=interaction."}
                    <span className="hljs-built_in">{"id"}</span>
                    {")\n\n"}
                    <span className="hljs-comment">
                      {
                        "# completed 以外(incomplete / failed / cancelled など)は部分出力を返さず、再試行・エラー処理へ回す"
                      }
                    </span>
                    {"\n"}
                    <span className="hljs-keyword">{"if"}</span> {"interaction.status != "}
                    <span className="hljs-string">{'"completed"'}</span>
                    {":\n    "}
                    <span className="hljs-keyword">{"raise"}</span> {"RuntimeError(\n        "}
                    <span className="hljs-string">
                      {'f"Interaction '}
                      <span className="hljs-subst">
                        {"{interaction."}
                        <span className="hljs-built_in">{"id"}</span>
                        {"}"}
                      </span>{" "}
                      {"ended with status="}
                      <span className="hljs-subst">{"{interaction.status}"}</span>
                      {'; "'}
                    </span>
                    {"\n"}
                    {"       "}{" "}
                    <span className="hljs-string">
                      {'"incomplete は max_output_tokens を上げて再実行、failed は再試行する"'}
                    </span>
                    {"\n"}
                    {"    "}
                    {")\n\n"}
                    <span className="hljs-comment">
                      {"# ホップごとに model_output ステップが増えるので、すべて連結する"}
                    </span>
                    {"\ntext = "}
                    <span className="hljs-string">{'""'}</span>
                    {".join(\n    content.text\n    "}
                    <span className="hljs-keyword">{"for"}</span> {"step "}
                    <span className="hljs-keyword">{"in"}</span> {"interaction.steps\n    "}
                    <span className="hljs-keyword">{"if"}</span> {"step."}
                    <span className="hljs-built_in">{"type"}</span> {"== "}
                    <span className="hljs-string">{'"model_output"'}</span>
                    {"\n"}
                    {"   "} <span className="hljs-keyword">{"for"}</span> {"content "}
                    <span className="hljs-keyword">{"in"}</span> {"step.content\n    "}
                    <span className="hljs-keyword">{"if"}</span> {"content."}
                    <span className="hljs-built_in">{"type"}</span> {"== "}
                    <span className="hljs-string">{'"text"'}</span>
                    {"\n)\n"}
                    <span className="hljs-built_in">{"print"}</span>
                    {"(text)\n"}
                    <span className="hljs-built_in">{"print"}</span>
                    {"("}
                    <span className="hljs-string">{'"Status:"'}</span>
                    {", interaction.status)\n"}
                    <span className="hljs-built_in">{"print"}</span>
                    {"("}
                    <span className="hljs-string">{'"Usage:"'}</span>
                    {", interaction.usage)"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"           "} {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["diagram-card"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-title"]}>
                {"\n"}
                {"             "} <i className={["ti", "ti-route"].join(" ")}></i>
                <span>{"図5　Long Decode のホップと終了状態"}</span>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram chart={DIAGRAM_4} theme="base" themeVariables={THEME} />
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-24">{"ステータスの扱い"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"status"}</th>
                    <th>{"意味"}</th>
                    <th>{"対処"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>{"completed"}</code>
                    </td>
                    <td>{"完了"}</td>
                    <td>
                      {"\n"}
                      {"                   "} <code>{"model_output"}</code>{" "}
                      {"を連結。続けるなら\n                    "}
                      <code>{"previous_interaction_id"}</code> {"に "}
                      <code>{"id"}</code> {"を渡す\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"requires_action"}</code>
                    </td>
                    <td>{"ツール呼び出し待ち"}</td>
                    <td>{"ツールを実行して結果を返す"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"incomplete"}</code>
                    </td>
                    <td>
                      <code>{"max_output_tokens"}</code>{" "}
                      {"を使い切った(思考中で本文が空のこともある)"}
                    </td>
                    <td>{"上限を上げて再送、または思考水準を下げる"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"failed"}</code>
                    </td>
                    <td>{"サーバー側で失敗 / 24時間超過"}</td>
                    <td>{"再試行。再発するなら interaction ID をサポートに共有"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"cancelled"}</code>
                    </td>
                    <td>{"利用者がキャンセル"}</td>
                    <td>
                      <code>{"usage"}</code> {"で課金トークンを確認"}
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-25">{"Long Decode を使うべきでない場面(公式)"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"場面"}</th>
                    <th>{"理由"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"チャット・要約・分類・抽出"}</td>
                    <td>{"32Kトークン未満で終わる"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"「70万語の本を書いて」のような"}
                      <strong>{"長さ指定"}</strong>
                    </td>
                    <td>{"モデルは長さ目標に従わない"}</td>
                  </tr>
                  <tr>
                    <td>{"短いターンを何度も重ねるエージェント"}</td>
                    <td>{"各ターンの大きな出力が共有コンテキストをすぐ埋める"}</td>
                  </tr>
                  <tr>
                    <td>{"入力が上限に近いプロンプト"}</td>
                    <td>{"出力は「1,048,576 − 入力」しか使えない"}</td>
                  </tr>
                  <tr>
                    <td>{"低遅延が必要なリクエスト"}</td>
                    <td>{"数分〜かかる"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-26">
              {"ストリーミング時の注意(長時間ストリームは切れる前提で作る)"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"ルール"}</th>
                    <th>{"内容"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"interaction ID を保存"}</td>
                    <td>
                      <code>{"interaction.created"}</code> {"イベントから取得"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {"すべての "}
                      <code>{"event_id"}</code> {"を保存"}
                    </td>
                    <td>
                      {"テキスト差分だけでなく "}
                      <code>{"status_update"}</code> {"にも付く"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {"再接続は "}
                      <code>{"last_event_id"}</code> {"で"}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"最後の "}
                      <code>{"event_id"}</code> {"を指定して "}
                      <code>{"get"}</code> {"を\n                    "}
                      <code>{"stream"}</code> {"で呼ぶ\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"読み切ってから状態確認"}</td>
                    <td>{"再接続後はストリームを最後まで読む(取りこぼしイベントは再送される)"}</td>
                  </tr>
                  <tr>
                    <td>{"読み取りタイムアウト"}</td>
                    <td>
                      <strong>{"20分"}</strong>
                      {"(公式推奨は1ストリームあたり15〜20分の範囲)"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"最初の64K以降"}</td>
                    <td>
                      {"約5,000トークンの塊で届く。"}
                      <strong>{"間が空いても止まっていない"}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-27">{"トークン数の数え方(落とし穴)"}</h3>
            {"\n"}
            {"         "}{" "}
            <p>
              {"\n"}
              {"           "} <code>{"usage.total_input_tokens"}</code> {"は\n            "}
              <strong>{"各ホップの入力の合計"}</strong>
              {
                "で、実際のコンテキスト長ではありません。たとえば1,000トークンのプロンプトで20万トークンを生成すると、入力合計は約39.7万トークンと表示されますが、実コンテキストは約20.1万トークンです。"
              }
              <strong>
                {"要約・圧縮(コンテキスト圧縮)の判断に\n              "}
                <code>{"total_input_tokens"}</code> {"を使わない"}
              </strong>
              {"でください。実サイズの推定は「プロンプト + "}
              <code>{"total_output_tokens"}</code> {"+\n            "}
              <code>{"total_thought_tokens"}</code>
              {"」です。\n          "}
            </p>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s6">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-route"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "}{" "}
              <h2 id="s6-heading">{"Step 5: 旧モデルからの移行で壊れやすい点を先に潰す"}</h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-28">{"何をするか"}</h3>
            {"\n"}
            {"         "}{" "}
            <p>
              {
                "\n            Gemini 3.6 以降(および今後のすべての世代)で適用される API\n            変更を、"
              }
              <strong>{"移行前に洗い出して修正"}</strong>
              {
                "します。多くは「エラーにならず挙動だけ変わる」ため、静かに品質が落ちます。\n          "
              }
            </p>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-29">
              {"移行チェックリスト(Argon / 3.8 Flash 共通を中心に)"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"#"}</th>
                    <th>{"項目"}</th>
                    <th>{"やること"}</th>
                    <th>{"放置した場合"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"1"}</td>
                    <td>{"モデルID"}</td>
                    <td>
                      <code>{"gemini-4-argon"}</code> {"/ "}
                      <code>{"gemini-3.8-flash"}</code> {"へ変更"}
                    </td>
                    <td>{"旧モデルは自動ルーティングや退役の対象"}</td>
                  </tr>
                  <tr>
                    <td>{"2"}</td>
                    <td>{"サンプリング引数"}</td>
                    <td>
                      {"\n"}
                      {"                   "} <code>{"temperature"}</code> {"/ "}
                      <code>{"top_p"}</code> {"/ "}
                      <code>{"top_k"}</code> {"を"}
                      <strong>{"削除"}</strong>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                    <td>{"Argon では無視される(将来の世代では400エラー)"}</td>
                  </tr>
                  <tr>
                    <td>{"3"}</td>
                    <td>{"決定性の確保"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"引数ではなく\n                    "}
                      <strong>
                        <code>{"system_instruction"}</code> {"に明示的なルール"}
                      </strong>
                      {"を書く\n                  "}
                    </td>
                    <td>{"出力の揺れが残る"}</td>
                  </tr>
                  <tr>
                    <td>{"4"}</td>
                    <td>{"明示キャッシュ"}</td>
                    <td>
                      {"\n"}
                      {"                   "} <code>{"cachedContents"}</code>{" "}
                      {"/\n                    "}
                      <code>{"caches.create"}</code> {"を"}
                      <strong>{"削除"}</strong>
                      {"(Argon)\n                  "}
                    </td>
                    <td>
                      <strong>{"エラー"}</strong>
                      {"。暗黙キャッシュへ切替"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"5"}</td>
                    <td>{"思考指定"}</td>
                    <td>
                      <code>{"thinking_budget"}</code> {"→ "}
                      <code>{"thinking_level"}</code>
                      {"(文字列)"}
                    </td>
                    <td>
                      {
                        "\n                    後方互換で受け付けられるが非推奨で、挙動を予測しにくい。"
                      }
                      <code>{"thinking_level"}</code>
                      {"\n"}
                      {"                    "}
                      {"と併用すると400エラー\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"6"}</td>
                    <td>
                      <code>{"minimal"}</code>
                    </td>
                    <td>{"Argon / 3.8 Flash では使わない"}</td>
                    <td>{"エラー"}</td>
                  </tr>
                  <tr>
                    <td>{"7"}</td>
                    <td>{"モデルターンの事前入力(prefill)"}</td>
                    <td>
                      {"廃止。"}
                      <code>{"system_instruction"}</code> {"や構造化出力で代替"}
                    </td>
                    <td>
                      <strong>{"400エラー"}</strong>
                      {"(最後の非空ターンが model の場合)"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"8"}</td>
                    <td>
                      <code>{"candidate_count"}</code>
                    </td>
                    <td>{"削除(Gemini 3以降非対応)"}</td>
                    <td>{"エラーまたは無視"}</td>
                  </tr>
                  <tr>
                    <td>{"9"}</td>
                    <td>
                      <code>{"max_output_tokens"}</code>
                    </td>
                    <td>{"32,768以上へ引き上げ(Argonは思考に枠を使う)"}</td>
                    <td>{"空応答・途中切れ"}</td>
                  </tr>
                  <tr>
                    <td>{"10"}</td>
                    <td>{"タイムアウト"}</td>
                    <td>{"HTTPクライアントを20分、または背景実行"}</td>
                    <td>{"難問で切断"}</td>
                  </tr>
                  <tr>
                    <td>{"11"}</td>
                    <td>{"会話状態"}</td>
                    <td>
                      <code>{"previous_interaction_id"}</code> {"でサーバー側に保持"}
                    </td>
                    <td>{"署名欠落・履歴不整合"}</td>
                  </tr>
                  <tr>
                    <td>{"12"}</td>
                    <td>{"関数呼び出し"}</td>
                    <td>
                      {"応答の対応("}
                      <code>{"id"}</code> {"/ "}
                      <code>{"name"}</code> {"/ 件数)を厳密に一致させる"}
                    </td>
                    <td>{"400エラー(Step 7)"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-30">{"prefill の置き換え例"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"           "}{" "}
              <div className={styles["cb-head"]}>
                <i className={["ti", "ti-code"].join(" ")}></i>
                <span>{"python"}</span>
              </div>
              {"\n"}
              {"           "}{" "}
              <pre>
                <code className={["language-python"].join(" ")} id="c6">
                  <div className={styles.codeLine}>
                    <span className="hljs-comment">
                      {"# 悪い例(旧来の prefill): 最後が model ターンだと 400 エラーになる"}
                    </span>
                    {"\n"}
                    <span className="hljs-comment">{"# contents = ["}</span>
                    {"\n"}
                    <span className="hljs-comment">
                      {
                        '#   {"role": "user",  "parts": [{"text": "Hello world をスペイン語に翻訳して"}]},'
                      }
                    </span>
                    {"\n"}
                    <span className="hljs-comment">
                      {
                        '#   {"role": "model", "parts": [{"text": "翻訳:"}]},   # <- これがエラーの原因'
                      }
                    </span>
                    {"\n"}
                    <span className="hljs-comment">{"# ]"}</span>
                    {"\n\n"}
                    <span className="hljs-comment">
                      {"# 良い例: system_instruction で出力形式を指定する"}
                    </span>
                    {"\ninteraction = client.interactions.create(\n    model="}
                    <span className="hljs-string">{'"gemini-3.8-flash"'}</span>
                    {",\n    "}
                    <span className="hljs-built_in">{"input"}</span>
                    {"="}
                    <span className="hljs-string">
                      {"\"'Hello world' をスペイン語に翻訳して。\""}
                    </span>
                    {",\n    system_instruction="}
                    <span className="hljs-string">
                      {'"前置きなしで、翻訳結果だけを出力してください。"'}
                    </span>
                    {",\n)"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"           "} {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-31">{"暗黙キャッシュへの切替(Argon)"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"項目"}</th>
                    <th>{"内容"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"仕組み"}</td>
                    <td>
                      {"自動(コード変更不要)。4,096トークン以上のプロンプトで有効という公式記載"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"割引"}</td>
                    <td>
                      {"キャッシュヒット入力は95%割引($0.10 / 100万トークン。12/1以降 $0.20)"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"設計"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <strong>
                        {"共通部分(システム指示・ツール定義・長い資料)を必ず先頭に置く"}
                      </strong>
                      {"。変化する部分は末尾に\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"確認"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"レスポンスの "}
                      <code>{"usage"}</code> {"の\n                    "}
                      <code>{"total_cached_tokens"}</code>{" "}
                      {"でヒット量を観測する\n                  "}
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={[styles.callout, styles.note].join(" ")} data-variant="info">
              {"\n"}
              {"           "} <i className={["ti", "ti-info-circle"].join(" ")}></i>
              {"\n"}
              {"           "}{" "}
              <div className={styles["callout-body"]}>
                {"\n"}
                {"             "}{" "}
                <p>
                  {"\n"}
                  {"               "} <strong>{"提供面で条件が異なる"}</strong>
                  {
                    "例: Google Cloud\n                側の開発者ガイドには、共有プレフィックスの最小サイズが API\n                の記載と異なる旨の言及があります。購入した提供面のドキュメントとレスポンスの実測値を基準にしてください。\n              "
                  }
                </p>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s7">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-message-chatbot"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "}{" "}
              <h2 id="s7-heading">{"Step 6: プロンプトとコンテキストを設計する"}</h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-32">{"何をするか"}</h3>
            {"\n"}
            {"         "}{" "}
            <p>
              {"\n"}
              {"            "}
              {"Argon / 3.8 Flash\n            は「"}
              <strong>{"長く自律的に走らせる"}</strong>
              {"」ことに強みがあります。細かいターンごとの指示ではなく、"}
              <strong>{"ゴール・制約・検証基準・使える道具"}</strong>
              {"を最初に渡す設計へ切り替えます。\n          "}
            </p>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-33">{"なぜか"}</h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {
                  "\n              公式の開発者ガイド(AI Studio)は、Argon\n              の長期タスクでの性能が出る条件として「"
                }
                <strong>{"実際のフィードバックループで自分の変更を検証できること"}</strong>
                {"」を挙げています。\n            "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"              "}
                {"Gemini 3.8 Flash は\n              "}
                <strong>{"難しい多段タスクで意図的に多くのトークンを使う"}</strong>
                {
                  "(小さな推論ステップ、反復的なツール呼び出し、途中検証)。日常タスクでは思考水準を下げて抑える、と公式が明記。\n            "
                }
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {
                  "\n              Philipp Schmid(Google\n              DeepMind)は「コンテキストエンジニアリングとは、文脈を増やすことではなく"
                }
                <strong>{"次のステップに必要な最小の有効コンテキスト"}</strong>
                {"を見つけること」と整理しています。\n            "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-34">
              {"実務で効く5つの型(公式ガイドの要点を実装向けに整理)"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"型"}</th>
                    <th>{"やること"}</th>
                    <th>{"理由"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{"1. 事前確認(pre-flight)"}</strong>
                    </td>
                    <td>
                      {
                        "\n                    作業前に「必要なツール・資料へのアクセス」と「意図の理解」をモデルに確認させる\n                  "
                      }
                    </td>
                    <td>{"長時間の自律実行の後でアクセス不足が判明する事故を防ぐ"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"2. 完走させる"}</strong>
                    </td>
                    <td>
                      {
                        "\n                    ターンごとの細切れ指示をやめ、合意した目標まで自律的に実行させる。"
                      }
                      <strong>{"不可逆な操作の前だけ"}</strong>
                      {"人間の承認を挟む\n                  "}
                    </td>
                    <td>{"計画→実装→検証→修正の反復が1回の実行内で完結する"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"3. 検証スクリプトを書かせる"}</strong>
                    </td>
                    <td>
                      {
                        "\n                    再現可能な検証スクリプトを作らせ、ベースラインを記録し、変更ごとにパス/フェイルで反復させる\n                  "
                      }
                    </td>
                    <td>
                      {
                        "\n                    具体的な合否基準があると、Argon は仮説検証を繰り返して「全部グリーン」まで進める\n                  "
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"4. 振り返りを資産化"}</strong>
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"完了後に学び(最短経路・罠)を\n                    "}
                      <code>{"AGENTS.md"}</code>{" "}
                      {"や再利用可能なスキルへ書かせる\n                  "}
                    </td>
                    <td>{"次回以降のセッションが最初から直線的に進む"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"5. 動画は「見る場所」を探させる"}</strong>
                    </td>
                    <td>
                      {"エージェント型動画理解で、必要な時刻・フレーム・音声だけを取得させる"}
                    </td>
                    <td>{"長尺動画でトークンを大幅削減(Flash系の発表では最大88%減という記載)"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-35">{"プロンプトの骨格(コピーして使える雛形)"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"           "}{" "}
              <div className={styles["cb-head"]}>
                <i className={["ti", "ti-code"].join(" ")}></i>
                <span>{"python"}</span>
              </div>
              {"\n"}
              {"           "}{" "}
              <pre>
                <code className={["language-python"].join(" ")} id="c7">
                  <div className={styles.codeLine}>
                    <span className="hljs-keyword">{"from"}</span> {"pathlib "}
                    <span className="hljs-keyword">{"import"}</span> {"Path\n\nSYSTEM = "}
                    <span className="hljs-string">
                      {
                        '"""\\\nあなたは大規模なコードベースを担当するシニアエンジニアです。\n\n# 目標\n{goal}\n\n# 制約\n- 変更は最小限。依存関係の追加は事前に確認する。\n- 不可逆な操作(削除・本番への反映・外部への送信)の前に、必ず私の承認を求める。\n\n# 検証基準(合格条件)\n- {verification_command} がすべて成功すること。\n- 既に通っているテストを壊さないこと。\n\n# 進め方\n1. 作業前に、使えるツール・資料・前提を確認し、理解した意図を1段落で述べる。\n2. 検証スクリプトを先に用意し、ベースラインを記録する。\n3. 変更 → 検証 → 修正を、合格条件を満たすまで繰り返す。\n4. 最後に、学んだこと(最短経路・つまずき)を3点にまとめる。\n"""'
                      }
                    </span>
                    {"\n\n"}
                    <span className="hljs-comment">
                      {"# この呼び出しはファイル編集もコマンド実行もできない(テキストのみ)。"}
                    </span>
                    {"\n"}
                    <span className="hljs-comment">
                      {
                        "# 実際に編集・pytest を反復させるには、リポジトリへのアクセスとシェル実行を提供する"
                      }
                    </span>
                    {"\n"}
                    <span className="hljs-comment">
                      {
                        "# エージェント環境(Gemini CLI など)にこの雛形を渡す。ここでは該当コードを渡し、変更案を出させる。"
                      }
                    </span>
                    {"\ncode = Path("}
                    <span className="hljs-string">{'"payments/retry.py"'}</span>
                    {").read_text(encoding="}
                    <span className="hljs-string">{'"utf-8"'}</span>
                    {")\n\ninteraction = client.interactions.create(\n    model="}
                    <span className="hljs-string">{'"gemini-4-argon"'}</span>
                    {",\n    system_instruction=SYSTEM."}
                    <span className="hljs-built_in">{"format"}</span>
                    {"(\n        goal="}
                    <span className="hljs-string">{'"決済リトライ処理の競合状態を解消する"'}</span>
                    {",\n        verification_command="}
                    <span className="hljs-string">{'"pytest -q tests/payments"'}</span>
                    {",\n    ),\n    "}
                    <span className="hljs-built_in">{"input"}</span>
                    {"=(\n        "}
                    <span className="hljs-string">
                      {
                        '"上記の進め方に沿って、次のコードへの変更案(差分)と、検証コマンドで確認すべき点を"'
                      }
                    </span>
                    {"\n"}
                    {"       "}{" "}
                    <span className="hljs-string">
                      {
                        '"テキストで示してください。ファイルの編集やコマンドの実行はできない前提で答えてください。"'
                      }
                    </span>
                    {"\n"}
                    {"       "}{" "}
                    <span className="hljs-string">
                      {'f"\\n\\n<code>\\n'}
                      <span className="hljs-subst">{"{code}"}</span>
                      {'\\n</code>"'}
                    </span>
                    {"\n"}
                    {"    "}
                    {"),\n    generation_config={"}
                    <span className="hljs-string">{'"thinking_level"'}</span>
                    {": "}
                    <span className="hljs-string">{'"medium"'}</span>
                    {", "}
                    <span className="hljs-string">{'"max_output_tokens"'}</span>
                    {": "}
                    <span className="hljs-number">{"65536"}</span>
                    {"},\n)"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"           "} {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-36">
              {"文脈を軽くする原則(Schmid のコンテキストエンジニアリング)"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"原則"}</th>
                    <th>{"具体策"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"圧縮・要約で「コンテキストの腐敗」を防ぐ"}</td>
                    <td>{"長時間エージェントは履歴を要約するか、新しいセッションに切り替える"}</td>
                  </tr>
                  <tr>
                    <td>{"共有は「通信」で行う"}</td>
                    <td>{"サブエージェントへは全履歴を渡さず、タスクと必要な事実だけを渡す"}</td>
                  </tr>
                  <tr>
                    <td>{"ツールセットを小さく保つ"}</td>
                    <td>{"使わないツール(例: 不要な MCP の関数)は無効化"}</td>
                  </tr>
                  <tr>
                    <td>{"ツールの説明は「ツール向けのプロンプト」"}</td>
                    <td>{"説明文と引数のスキーマを丁寧に書く"}</td>
                  </tr>
                  <tr>
                    <td>{"不要なツール呼び出しを減らす"}</td>
                    <td>
                      {
                        "\n                    低い思考水準や system instruction で呼び出し方針を明示(Gemini 3.x 公式の推奨)\n                  "
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-37">{"モデル特性に合わせた補正"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"症状"}</th>
                    <th>{"原因の例"}</th>
                    <th>{"対処"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"UIの見た目が好みでない(Flash 3.6)"}</td>
                    <td>
                      {"機能するコードは強いが、視覚的なスタイルは旧モデルが好まれた評価がある"}
                    </td>
                    <td>
                      <strong>{"明示的なデザインガイドライン"}</strong>
                      {"を渡す"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"診断タスクで余計なファイルを触る"}</td>
                    <td>{"指示追従の揺れ"}</td>
                    <td>{"「診断のみ。変更は提案として出力」と明記"}</td>
                  </tr>
                  <tr>
                    <td>{"簡単なフロントエンド作業で探索が多い(3.6 Flash)"}</td>
                    <td>{"変更前にプログラム的に調べる傾向"}</td>
                    <td>{"思考水準を下げる / 手順を指定する"}</td>
                  </tr>
                  <tr>
                    <td>{"出力が長すぎる"}</td>
                    <td>{"冗長さ"}</td>
                    <td>{"3.6 Flash 以降は改善。さらに system instruction で形式を指定"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s8">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-function"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "} <h2 id="s8-heading">{"Step 7: 関数呼び出しと Thought Signatures"}</h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-38">{"何をするか"}</h3>
            {"\n"}
            {"         "}{" "}
            <p>
              {"\n"}
              {"            "}
              {"Gemini 3 以降は、"}
              <strong>{"推論状態を暗号化した Thought Signature"}</strong>
              {"\n"}
              {"            "}
              {"を次のリクエストに返す必要があります。手動での受け渡しが必要なのは、"}
              <strong>
                <code>{"generateContent"}</code> {"と、履歴を自前で管理するステートレス運用"}
              </strong>
              {"だけです(受け取った署名・思考ブロックを改変せずに再送する)。Interactions API の"}
              <strong>
                {"ステートフル運用("}
                <code>{"store: true"}</code> {"+\n              "}
                <code>{"previous_interaction_id"}</code>
                {")"}
              </strong>
              {"では署名をサーバーが管理するため、手動での署名処理は不要です。\n          "}
            </p>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-39">{"なぜか"}</h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"              "}
                {"署名がないと、ツール実行の間にモデルが"}
                <strong>{"自分の推論ステップを「忘れる」"}</strong>
                {"。\n            "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"              "}
                {"関数呼び出しでは、現在のターンで署名が欠けると "}
                <strong>{"400エラー"}</strong>
                {"("}
                <code>{"generateContent"}</code>
                {"\n"}
                {"              "}
                {"の厳格検証)。通常のテキストでは厳格には検証されないが、"}
                <strong>{"品質が落ちる"}</strong>
                {"。\n            "}
              </li>
              {"\n"}
              {"           "} <li>{"画像の会話型編集でも署名は重要。"}</li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-40">{"署名の扱いルール(GenerateContent を直接使う場合)"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"状況"}</th>
                    <th>{"署名の位置"}</th>
                    <th>{"やること"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"単一の関数呼び出し"}</td>
                    <td>
                      {"その "}
                      <code>{"functionCall"}</code> {"パート"}
                    </td>
                    <td>{"受け取ったまま返す"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"並列"}</strong>
                      {"の関数呼び出し"}
                    </td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <strong>
                        {"最初の "}
                        <code>{"functionCall"}</code> {"だけ"}
                      </strong>
                      {"に署名\n                  "}
                    </td>
                    <td>{"受け取った順序のまま返す"}</td>
                  </tr>
                  <tr>
                    <td>{"逐次(複数ステップ)"}</td>
                    <td>{"各ステップの最初の呼び出しにそれぞれ署名"}</td>
                    <td>
                      <strong>{"蓄積したすべての署名"}</strong>
                      {"を履歴に含める"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"他世代のモデルから会話を引き継ぐ / 自前で挿入した関数呼び出し"}</td>
                    <td>{"有効な署名なし"}</td>
                    <td>{"公式の回避方法(ダミー署名等)に従う"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["diagram-card"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-title"]}>
                {"\n"}
                {"             "} <i className={["ti", "ti-route"].join(" ")}></i>
                <span>{"図6　関数呼び出しと Thought Signature の扱い"}</span>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram chart={DIAGRAM_5} theme="base" themeVariables={THEME} />
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-41">{"関数応答の作法(3.x 共通の公式推奨)"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"項目"}</th>
                    <th>{"推奨"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"応答の対応"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"Interactions API の "}
                      <code>{"function_result"}</code> {"は呼び出しの "}
                      <code>{"id"}</code> {"を\n                    "}
                      <strong>
                        <code>{"call_id"}</code>
                      </strong>{" "}
                      {"に指定する(GenerateContent の\n                    "}
                      <code>{"FunctionResponse"}</code> {"は "}
                      <code>{"id"}</code>
                      {")。"}
                      <code>{"call_id"}</code> {"/\n                    "}
                      <code>{"name"}</code> {"/ 件数が直前の呼び出しと"}
                      <strong>{"一致"}</strong>
                      {
                        "(Interactions API\n                    は不一致をエラーにする)\n                  "
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>{"マルチモーダル"}</td>
                    <td>
                      {"画像などは"}
                      <strong>{"応答ペイロードの中"}</strong>
                      {"に入れる(別パートにしない)"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"追加指示"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"関数応答テキストの末尾に\n                    "}
                      <strong>
                        <code>{"\\n\\n"}</code> {"区切りで追記"}
                      </strong>
                      {"(別パートにしない)\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"Malformed_Function_Call"}</code>
                    </td>
                    <td>{"ツール前のテキスト要件に起因する場合は、公式の回避策ページに従う"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"generateContent"}</code> {"を使う場合のみ"}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"各 "}
                      <code>{"FunctionResponse"}</code> {"の "}
                      <strong>
                        <code>{"id"}</code>
                      </strong>{" "}
                      {"に元の\n                    "}
                      <code>{"functionCall.id"}</code> {"を設定して対応付け、"}
                      <code>{"name"}</code>
                      {"\n"}
                      {"                    "}
                      {"も含める("}
                      <code>{"call_id"}</code> {"は Interactions API の\n                    "}
                      <code>{"function_result"}</code> {"側のフィールド)\n                  "}
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"           "}{" "}
              <div className={styles["cb-head"]}>
                <i className={["ti", "ti-code"].join(" ")}></i>
                <span>{"python"}</span>
              </div>
              {"\n"}
              {"           "}{" "}
              <pre>
                <code className={["language-python"].join(" ")} id="c8">
                  <div className={styles.codeLine}>
                    <span className="hljs-comment">
                      {"# 追加指示は「応答テキストの末尾」に \\n\\n で付ける"}
                    </span>
                    {"\n"}
                    <span className="hljs-keyword">{"import"}</span>{" "}
                    {"json\n\nresult_text = json.dumps(result, ensure_ascii="}
                    <span className="hljs-literal">{"False"}</span>
                    {")\nfunction_response_text = "}
                    <span className="hljs-string">
                      {'f"'}
                      <span className="hljs-subst">{"{result_text}"}</span>
                      {'\\n\\n次は、この結果を根拠に3行で要約してください。"'}
                    </span>
                  </div>
                </code>
              </pre>
              {"\n"}
              {"           "} {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s9">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-robot"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "}{" "}
              <h2 id="s9-heading">
                {"Step 8: エージェント設計(Managed Agents / サブエージェント)"}
              </h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-42">{"何をするか"}</h3>
            {"\n"}
            {"         "}{" "}
            <p>
              {"\n"}
              {"            "}
              {"(1)まずは\n            "}
              <strong>{"Managed Agents の Antigravity エージェント"}</strong>
              {"で素早く立ち上げ、(2)必要に応じて"}
              <strong>{"サブエージェントの型"}</strong>
              {"を段階的に重くします。\n          "}
            </p>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-43">{"8.1 Managed Agents(Antigravity)の基本"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"項目"}</th>
                    <th>{"内容"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"エージェントID"}</td>
                    <td>
                      {"\n"}
                      {"                   "} <code>{"antigravity-preview-09-2026"}</code>
                      {"(旧\n                    "}
                      <code>{"antigravity-preview-05-2026"}</code>{" "}
                      {"は 2026-10-05 に停止)\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"既定モデル"}</td>
                    <td>
                      {"\n"}
                      {"                   "} <strong>{"Gemini 3.8 Flash"}</strong>
                      {"。"}
                      <code>{"agent_config"}</code>{" "}
                      {"で Argon\n                    などへ変更可能\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"実行環境"}</td>
                    <td>
                      <code>{'environment="remote"'}</code>
                      {"(新しいサンドボックス)"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"会話状態と環境状態"}</td>
                    <td>
                      <strong>{"独立して管理"}</strong>
                      {"される(Schmid の解説)"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"長いセッション"}</td>
                    <td>{"約135kトークンで文脈を自動圧縮(5月時点の解説。最新値は公式で確認)"}</td>
                  </tr>
                  <tr>
                    <td>{"認証情報"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"Credentials API\n                    により、"}
                      <strong>{"秘密情報がサンドボックス内に存在しない"}</strong>
                      {
                        "設計(GitHubトークンを露出させずに利用できる、という解説)\n                  "
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"           "}{" "}
              <div className={styles["cb-head"]}>
                <i className={["ti", "ti-code"].join(" ")}></i>
                <span>{"python"}</span>
              </div>
              {"\n"}
              {"           "}{" "}
              <pre>
                <code className={["language-python"].join(" ")} id="c9">
                  <div className={styles.codeLine}>
                    <span className="hljs-comment">{"# 難しい作業だけ Argon に切り替える"}</span>
                    {"\ninteraction = client.interactions.create(\n    agent="}
                    <span className="hljs-string">{'"antigravity-preview-09-2026"'}</span>
                    {",\n    "}
                    <span className="hljs-built_in">{"input"}</span>
                    {"=(\n        "}
                    <span className="hljs-string">
                      {'"https://web.dev をパフォーマンス・Core Web Vitals・SEOの観点で監査し、"'}
                    </span>
                    {"\n"}
                    {"       "}{" "}
                    <span className="hljs-string">
                      {'"モバイル/デスクトップ別の比較表と優先度付きの修正案を出力してください。"'}
                    </span>
                    {"\n"}
                    {"    "}
                    {"),\n    environment="}
                    <span className="hljs-string">{'"remote"'}</span>
                    {",\n    agent_config={\n        "}
                    <span className="hljs-string">{'"type"'}</span>
                    {": "}
                    <span className="hljs-string">{'"antigravity"'}</span>
                    {",\n        "}
                    <span className="hljs-string">{'"model"'}</span>
                    {": "}
                    <span className="hljs-string">{'"gemini-4-argon"'}</span>
                    {",   "}
                    <span className="hljs-comment">{"# 省略時は gemini-3.8-flash"}</span>
                    {"\n"}
                    {"    "}
                    {"},\n)\n"}
                    <span className="hljs-built_in">{"print"}</span>
                    {"(interaction.output_text)"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"           "} {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={[styles.callout, styles.warn].join(" ")} data-variant="warn">
              {"\n"}
              {"           "}{" "}
              <i className={["ti", "ti-alert-triangle"].join(" ")} data-testid="callout-label"></i>
              {"\n"}
              {"           "}{" "}
              <div className={styles["callout-body"]}>
                {"\n"}
                {"             "}{" "}
                <p>
                  {"\n"}
                  {"               "} <strong>{"移行の注意(09-2026版)"}</strong>
                  {":\n                ローカルでツールを実行する("}
                  <code>{"local_environment"}</code>
                  {")場合や\n                "}
                  <code>{"function_call"}</code>
                  {"\n"}
                  {"                "}
                  {"ステップを解析している場合は、組み込みツールの"}
                  <strong>{"引数名がPascalCase"}</strong>
                  {"になり、ファイル編集が"}
                  <strong>{"行範囲置換"}</strong>
                  {"へ変わっています(例:\n                "}
                  <code>{"replace_file_content(TargetFile, StartLine, EndLine, ...)"}</code>
                  {")。リモートサンドボックスで "}
                  <code>{"output_text"}</code> {"/\n                "}
                  <code>{"model_output"}</code>{" "}
                  {"だけを読む場合は、エージェント文字列の更新だけで済みます。\n              "}
                </p>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-44">
              {"8.2 サブエージェント4パターン(Philipp Schmid, 2026-05)"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"パターン"}</th>
                    <th>{"仕組み"}</th>
                    <th>{"向くケース"}</th>
                    <th>{"必要なモデル能力"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{"1. インライン・ツール"}</strong>
                    </td>
                    <td>{"サブエージェントを関数として呼ぶ(同期/非同期)"}</td>
                    <td>{"自己完結の作業(調査・レビュー・テスト生成)"}</td>
                    <td>{"ツールを呼べれば小型モデルでも可"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"2. ファンアウト"}</strong>
                    </td>
                    <td>
                      <code>{"spawn"}</code> {"で並列起動 → "}
                      <code>{"wait"}</code> {"で回収"}
                    </td>
                    <td>{"独立した並列タスク"}</td>
                    <td>{"「いつ待つか」を判断できること"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"3. エージェントプール"}</strong>
                    </td>
                    <td>{"永続エージェントにメッセージを送る"}</td>
                    <td>{"複数ステップで専門家が協調"}</td>
                    <td>{"複数エージェントの状態を追跡できること"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"4. チーム"}</strong>
                    </td>
                    <td>{"エージェント同士が直接メッセージ"}</td>
                    <td>{"調整ロジックが単独エージェントの手に余る大規模作業"}</td>
                    <td>
                      <strong>{"全員がフロンティア級"}</strong>
                      {"が必要"}
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["diagram-card"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-title"]}>
                {"\n"}
                {"             "} <i className={["ti", "ti-route"].join(" ")}></i>
                <span>{"図7　サブエージェントのパターン選択"}</span>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram chart={DIAGRAM_6} theme="base" themeVariables={THEME} />
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <p>
              {"\n"}
              {"           "} <strong>{"鉄則(Schmid)"}</strong>
              {
                ":\n            パターン1から始める。上のパターンに上がるほど、より高性能なモデルが必要。"
              }
              <strong>{"小型モデルを使うならパターン1か2に留める"}</strong>
              {"。\n          "}
            </p>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-45">
              {"8.3 「Argon は計画とレビュー、Flash は実働」の階層構成"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <p>
              {"\n"}
              {"            "}
              {"提供各社のドキュメントでは、Google の提案として\n            "}
              <strong>{"Argon を計画役・レビュー役、3.8 Flash を並列サブエージェント"}</strong>
              {"にしてコストと品質を両立する構成が紹介されています。\n          "}
            </p>
            {"\n"}
            {"         "}{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"           "}{" "}
              <div className={styles["cb-head"]}>
                <i className={["ti", "ti-code"].join(" ")}></i>
                <span>{"python"}</span>
              </div>
              {"\n"}
              {"           "}{" "}
              <pre>
                <code className={["language-python"].join(" ")} id="c10">
                  <div className={styles.codeLine}>
                    <span className="hljs-comment">
                      {"# 役割ごとにモデルと思考水準を割り当てる(簡易ルーター)"}
                    </span>
                    {"\nROUTES = {\n    "}
                    <span className="hljs-string">{'"plan"'}</span>
                    {":    {"}
                    <span className="hljs-string">{'"model"'}</span>
                    {": "}
                    <span className="hljs-string">{'"gemini-4-argon"'}</span>
                    {",       "}
                    <span className="hljs-string">{'"thinking_level"'}</span>
                    {": "}
                    <span className="hljs-string">{'"high"'}</span>
                    {"},\n    "}
                    <span className="hljs-string">{'"work"'}</span>
                    {":    {"}
                    <span className="hljs-string">{'"model"'}</span>
                    {": "}
                    <span className="hljs-string">{'"gemini-3.8-flash"'}</span>
                    {",     "}
                    <span className="hljs-string">{'"thinking_level"'}</span>
                    {": "}
                    <span className="hljs-string">{'"medium"'}</span>
                    {"},\n    "}
                    <span className="hljs-string">{'"extract"'}</span>
                    {": {"}
                    <span className="hljs-string">{'"model"'}</span>
                    {": "}
                    <span className="hljs-string">{'"gemini-3.5-flash-lite"'}</span>
                    {", "}
                    <span className="hljs-string">{'"thinking_level"'}</span>
                    {": "}
                    <span className="hljs-string">{'"minimal"'}</span>
                    {"},\n    "}
                    <span className="hljs-string">{'"review"'}</span>
                    {":  {"}
                    <span className="hljs-string">{'"model"'}</span>
                    {": "}
                    <span className="hljs-string">{'"gemini-4-argon"'}</span>
                    {",       "}
                    <span className="hljs-string">{'"thinking_level"'}</span>
                    {": "}
                    <span className="hljs-string">{'"medium"'}</span>
                    {"},\n}\n\n"}
                    <span className="hljs-keyword">{"def"}</span>{" "}
                    <span className="hljs-title function_">{"run"}</span>
                    {"("}
                    <span className="hljs-params">
                      {"role: "}
                      <span className="hljs-built_in">{"str"}</span>
                      {", prompt: "}
                      <span className="hljs-built_in">{"str"}</span>
                      {", system: "}
                      <span className="hljs-built_in">{"str"}</span> {"= "}
                      <span className="hljs-string">{'""'}</span>
                    </span>
                    {"):\n    cfg = ROUTES[role]\n    "}
                    <span className="hljs-keyword">{"return"}</span>{" "}
                    {"client.interactions.create(\n        model=cfg["}
                    <span className="hljs-string">{'"model"'}</span>
                    {"],\n        "}
                    <span className="hljs-built_in">{"input"}</span>
                    {"=prompt,\n        system_instruction=system "}
                    <span className="hljs-keyword">{"or"}</span>{" "}
                    <span className="hljs-literal">{"None"}</span>
                    {",\n        generation_config={"}
                    <span className="hljs-string">{'"thinking_level"'}</span>
                    {": cfg["}
                    <span className="hljs-string">{'"thinking_level"'}</span>
                    {"]},\n    )\n\nplan = run("}
                    <span className="hljs-string">{'"plan"'}</span>
                    {", "}
                    <span className="hljs-string">
                      {'"この移行作業を、独立して並列実行できる5つ以内のタスクに分解して。"'}
                    </span>
                    {")"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"           "} {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["diagram-card"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-title"]}>
                {"\n"}
                {"             "} <i className={["ti", "ti-route"].join(" ")}></i>
                <span>{"図8　Argon を計画役、Flash を実働にする階層構成"}</span>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram chart={DIAGRAM_7} theme="base" themeVariables={THEME} />
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s10">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-coin"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "} <h2 id="s10-heading">{"Step 9: コスト最適化(タスク単価で測る)"}</h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-46">{"何をするか"}</h3>
            {"\n"}
            {"         "}{" "}
            <p>
              {"\n"}
              {"           "}{" "}
              <strong>{"「1トークン単価」ではなく「1タスクを解く総コスト」"}</strong>
              {
                "で評価し、キャッシュを効かせ、価格改定(12/1)を織り込んだ見積もりを作ります。\n          "
              }
            </p>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-47">{"なぜか"}</h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {
                  "\n              Simon Willison\n              は発表当日に「重要なのは、エージェント環境でゴールに到達するまでにモデルが使うトークン数だ」と指摘しています。\n            "
                }
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {
                  "\n              Artificial Analysis の測定では、Argon の導入価格でのタスク単価は $1.99(標準価格では\n              $3.98)。一方、個人ベンチ(paddo.dev)では\n              "
                }
                <strong>
                  {
                    "トークン単価は Opus 5.5\n                の半分でも、出力トークンが約2.8倍で総コストは上回った"
                  }
                </strong>
                {"という結果も報告されています(単一ベンチ・Claude Code\n              経由)。"}
                <strong>{"独立評価と個人ベンチで傾向が異なるため、自社タスクで測る"}</strong>
                {"のが唯一確実な方法です。\n            "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-48">{"コスト見積もりの実装"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"           "}{" "}
              <div className={styles["cb-head"]}>
                <i className={["ti", "ti-code"].join(" ")}></i>
                <span>{"python"}</span>
              </div>
              {"\n"}
              {"           "}{" "}
              <pre>
                <code className={["language-python"].join(" ")} id="c11">
                  <div className={styles.codeLine}>
                    <span className="hljs-keyword">{"from"}</span> {"datetime "}
                    <span className="hljs-keyword">{"import"}</span> {"date\n\n"}
                    <span className="hljs-comment">
                      {
                        "# 公式の導入価格(2026-11-30まで)と標準価格(2026-12-01から)。100万トークンあたりUSD"
                      }
                    </span>
                    {"\nPRICES = {\n    "}
                    <span className="hljs-string">{'"intro"'}</span>
                    {":    {"}
                    <span className="hljs-string">{'"input"'}</span>
                    {": "}
                    <span className="hljs-number">{"2.0"}</span>
                    {", "}
                    <span className="hljs-string">{'"cached"'}</span>
                    {": "}
                    <span className="hljs-number">{"0.10"}</span>
                    {", "}
                    <span className="hljs-string">{'"output"'}</span>
                    {": "}
                    <span className="hljs-number">{"10.0"}</span>
                    {"},\n    "}
                    <span className="hljs-string">{'"standard"'}</span>
                    {": {"}
                    <span className="hljs-string">{'"input"'}</span>
                    {": "}
                    <span className="hljs-number">{"4.0"}</span>
                    {", "}
                    <span className="hljs-string">{'"cached"'}</span>
                    {": "}
                    <span className="hljs-number">{"0.20"}</span>
                    {", "}
                    <span className="hljs-string">{'"output"'}</span>
                    {": "}
                    <span className="hljs-number">{"20.0"}</span>
                    {"},\n}\n\n"}
                    <span className="hljs-keyword">{"def"}</span>{" "}
                    <span className="hljs-title function_">{"argon_cost"}</span>
                    {"("}
                    <span className="hljs-params">
                      {"usage, today: date | "}
                      <span className="hljs-literal">{"None"}</span> {"= "}
                      <span className="hljs-literal">{"None"}</span>
                      {", assume_standard: "}
                      <span className="hljs-built_in">{"bool"}</span> {"= "}
                      <span className="hljs-literal">{"False"}</span>
                    </span>
                    {") -> "}
                    <span className="hljs-built_in">{"float"}</span>
                    {":\n    today = today "}
                    <span className="hljs-keyword">{"or"}</span> {"date.today()\n    tier = "}
                    <span className="hljs-string">{'"standard"'}</span>{" "}
                    <span className="hljs-keyword">{"if"}</span> {"(assume_standard "}
                    <span className="hljs-keyword">{"or"}</span> {"today >= date("}
                    <span className="hljs-number">{"2026"}</span>
                    {", "}
                    <span className="hljs-number">{"12"}</span>
                    {", "}
                    <span className="hljs-number">{"1"}</span>
                    {")) "}
                    <span className="hljs-keyword">{"else"}</span>{" "}
                    <span className="hljs-string">{'"intro"'}</span>
                    {"\n"}
                    {"    "}
                    {"p = PRICES[tier]\n\n    cached = usage.total_cached_tokens "}
                    <span className="hljs-keyword">{"or"}</span>{" "}
                    <span className="hljs-number">{"0"}</span>
                    {"\n"}
                    {"    "}
                    {"fresh_input = (usage.total_input_tokens "}
                    <span className="hljs-keyword">{"or"}</span>{" "}
                    <span className="hljs-number">{"0"}</span>
                    {") - cached\n    "}
                    <span className="hljs-comment">{"# 思考トークンも出力として課金される"}</span>
                    {"\n"}
                    {"    "}
                    {"out = (usage.total_output_tokens "}
                    <span className="hljs-keyword">{"or"}</span>{" "}
                    <span className="hljs-number">{"0"}</span>
                    {") + (usage.total_thought_tokens "}
                    <span className="hljs-keyword">{"or"}</span>{" "}
                    <span className="hljs-number">{"0"}</span>
                    {")\n\n    "}
                    <span className="hljs-keyword">{"return"}</span> {"(fresh_input * p["}
                    <span className="hljs-string">{'"input"'}</span>
                    {"] + cached * p["}
                    <span className="hljs-string">{'"cached"'}</span>
                    {"] + out * p["}
                    <span className="hljs-string">{'"output"'}</span>
                    {"]) / "}
                    <span className="hljs-number">{"1_000_000"}</span>
                    {"\n\n"}
                    <span className="hljs-comment">
                      {"# 標準価格で見積もる習慣をつける(導入価格だけで判断しない)"}
                    </span>
                    {"\n"}
                    <span className="hljs-comment">
                      {"# print(argon_cost(interaction.usage, assume_standard=True))"}
                    </span>
                  </div>
                </code>
              </pre>
              {"\n"}
              {"           "} {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={[styles.callout, styles.note].join(" ")} data-variant="info">
              {"\n"}
              {"           "} <i className={["ti", "ti-info-circle"].join(" ")}></i>
              {"\n"}
              {"           "}{" "}
              <div className={styles["callout-body"]}>
                {"\n"}
                {"             "}{" "}
                <p>
                  {"\n"}
                  {"                "}
                  {"上記は考え方を示すための簡易コードです。Interactions API の "}
                  <code>{"usage"}</code> {"は\n                "}
                  <code>{"total_output_tokens"}</code> {"と\n                "}
                  <code>{"total_thought_tokens"}</code>
                  {"\n"}
                  {"                "}
                  {"を"}
                  <strong>{"別々に"}</strong>
                  {"報告するため、出力トークンの総使用量は両者を"}
                  <strong>{"足し合わせて"}</strong>
                  {
                    "算出します。思考トークンも出力料金として課金される点に注意してください。\n              "
                  }
                </p>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-49">{"キャッシュを効かせる設計"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"施策"}</th>
                    <th>{"内容"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"共通部分を先頭に"}</td>
                    <td>{"システム指示・ツール定義・長い参考資料 → 変化する質問は末尾"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"プレフィックスを毎回変えない"}</strong>
                    </td>
                    <td>{"ターンごとに先頭付近へメッセージを差し込む設計は避ける"}</td>
                  </tr>
                  <tr>
                    <td>{"ヒット率を計測"}</td>
                    <td>
                      <code>{"total_cached_tokens"}</code> {"をログに出し、ダッシュボード化"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"明示キャッシュに頼らない"}</td>
                    <td>{"Argon は暗黙キャッシュのみ"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <p>
              {"\n"}
              {"           "} <strong>{"実例(paddo.dev の報告)"}</strong>
              {
                ": 第三者ハーネス(Claude Code)+ OpenRouter 経由で\n            Argon を使った最初の実行は\n            "
              }
              <strong>{"$17.60"}</strong>
              {"で、入力8.4Mトークンのうちキャッシュはわずか59k。原因は、毎ターン"}
              <strong>{"システムロールのメッセージ"}</strong>
              {
                "が差し込まれ、ゲートウェイがそれを\n            Gemini\n            のシステムプロンプトへ移すため"
              }
              <strong>{"プロンプト先頭が毎回変わり"}</strong>
              {
                "、暗黙キャッシュが効かなかったこと。メッセージを直前のユーザーターンへ移すプロキシで\n            "
              }
              <strong>{"$2.62(入力の94%がキャッシュ)"}</strong>
              {"になったという報告です。"}
              <strong>
                {
                  "第三者ハーネスで Argon\n              を使うときは、価格を評価する前にキャッシュヒット率を確認"
                }
              </strong>
              {"してください。\n          "}
            </p>
            {"\n"}
            {"         "}{" "}
            <div className={styles["diagram-card"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-title"]}>
                {"\n"}
                {"             "} <i className={["ti", "ti-route"].join(" ")}></i>
                <span>{"図9　コスト評価のループ"}</span>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram chart={DIAGRAM_8} theme="base" themeVariables={THEME} />
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-50">{"その他のコスト削減レバー"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"レバー"}</th>
                    <th>{"内容"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"思考水準を下げる"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"公式:トークンを減らすなら "}
                      <code>{"max_output_tokens"}</code> {"ではなく\n                    "}
                      <code>{"thinking_level"}</code>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"階層構成"}</td>
                    <td>{"難所だけ Argon、量は Flash / Flash-Lite"}</td>
                  </tr>
                  <tr>
                    <td>{"エージェント型動画理解"}</td>
                    <td>{"Flash 系の発表で、長尺動画のトークンを最大88%削減(静的処理との比較)"}</td>
                  </tr>
                  <tr>
                    <td>{"Batch / Flex / Priority 推論"}</td>
                    <td>
                      {
                        "\n                    公式ドキュメントに最適化の選択肢として掲載(適用条件と割引は最新ページで確認)\n                  "
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s11">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-shield-check"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "} <h2 id="s11-heading">{"Step 10: 本番運用(信頼性・安全性・評価)"}</h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-51">{"10.1 信頼性"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"項目"}</th>
                    <th>{"ベストプラクティス"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"タイムアウト"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"HTTP は "}
                      <strong>{"20分"}</strong>
                      {"。難問は背景実行 + ポーリング / ストリーム再接続\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"フォールバック"}</td>
                    <td>
                      {
                        "\n                    Argon が使えない・レート制限・到達不可のとき\n                    "
                      }
                      <strong>{"3.8 Flash へ自動フォールバック"}</strong>
                      {
                        "するラッパーを用意(Argon\n                    は無料枠不可)\n                  "
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>{"空応答の監視"}</td>
                    <td>
                      {"\n"}
                      {"                   "} <code>{"incomplete"}</code>{" "}
                      {"かつ本文が空 → 思考で上限を使い切った兆候。"}
                      <code>{"max_output_tokens"}</code>
                      {"\n"}
                      {"                    "}
                      {"と思考水準を見直す\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"非推奨の追跡"}</td>
                    <td>{"モデルごとの退役日(提供面で異なる)を CI で定期チェック"}</td>
                  </tr>
                  <tr>
                    <td>{"観測性"}</td>
                    <td>
                      {"\n"}
                      {"                   "} <code>{"usage"}</code>
                      {"(入力・キャッシュ・出力・思考)、"}
                      <code>{"status"}</code>
                      {"、所要時間、ツール呼び出し回数を記録\n                  "}
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["diagram-card"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-title"]}>
                {"\n"}
                {"             "} <i className={["ti", "ti-route"].join(" ")}></i>
                <span>{"図10　フォールバックを含む本番リクエストの流れ"}</span>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"           "}{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram chart={DIAGRAM_9} theme="base" themeVariables={THEME} />
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-52">{"10.2 安全性"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"リスク"}</th>
                    <th>{"対策"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"間接プロンプトインジェクション"}</td>
                    <td>
                      {
                        "\n                    Google は Argon を「間接インジェクションに最も強いモデル」と報告(Gray Swan IPI\n                    で攻撃成功率0.7%)。ただし"
                      }
                      <strong>{"ゼロではない"}</strong>
                      {
                        "ため、外部コンテンツを読むエージェントには権限分離・出力検証・人間承認を併用\n                  "
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>{"不可逆操作"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"削除・本番反映・外部送信の前に"}
                      <strong>{"承認ゲート"}</strong>
                      {"を置く(公式ガイドの方針)\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"秘密情報"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"サンドボックス内に置かない。Credentials API 等で"}
                      <strong>{"実行時に注入し、モデルに見せない"}</strong>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"暴走・逸脱"}</td>
                    <td>
                      {
                        "\n                    Google は Argon\n                    の思考過程と行動を監視して必要時に実行を止める緩和策を展開していると説明。アプリ側でも"
                      }
                      <strong>{"ステップ数・時間・コストの上限"}</strong>
                      {"を設ける\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"セキュリティ用途"}</td>
                    <td>
                      {
                        "\n                    防御目的の脆弱性発見・修正に強い一方、既存のセキュリティ用プロンプトは"
                      }
                      <strong>{"先に Argon でテスト"}</strong>
                      {
                        "し、拒否される領域は既存ツールを併用(提供事業者の移行ガイドの助言)。専用のサイバー向け変種("
                      }
                      <code>{"gemini-4-argon-cyber-permissive"}</code>
                      {"\n"}
                      {"                    "}
                      {"等)が Cloud のモデル一覧に別枠で存在するが、"}
                      <strong>{"利用資格・用途の制限は公式で確認"}</strong>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-53">
              {"10.3 評価(エージェントは最初のプロンプト以降を測る)"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"原則"}</th>
                    <th>{"内容"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"自社タスクで測る"}</td>
                    <td>
                      {
                        "\n                    ベンダー/第三者のベンチは出発点にすぎない。実コードベース・実業務の変更を再現して合否を判定\n                  "
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>{"3水準 × 2モデル"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"Argon / Flash × "}
                      <code>{"low"}</code> {"/ "}
                      <code>{"medium"}</code> {"/\n                    "}
                      <code>{"high"}</code>
                      {"\n"}
                      {"                    "}
                      {"で、"}
                      <strong>{"合格率・壊した既存テスト数・タスク単価・所要時間"}</strong>
                      {"を並べる\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"回帰を見る"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"「新しいテストを直せたか」だけでなく"}
                      <strong>{"既に通っていたテストを壊していないか"}</strong>
                      {"も指標にする(個人ベンチの観点)\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"ハーネスを分離"}</td>
                    <td>
                      {
                        "\n                    モデルの差かハーネスの差かを、同じタスクを別ハーネスでも走らせて切り分ける\n                  "
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>{"価格改定後で再評価"}</td>
                    <td>{"標準価格(12/1以降)で再計算"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s12">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-photo"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "}{" "}
              <h2 id="s12-heading">{"Step 11: マルチモーダル・周辺モデルの使いどころ"}</h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"領域"}</th>
                    <th>{"ベストプラクティス"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{"画像理解"}</strong>
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"指示では"}
                      <strong>{"モダリティを明示"}</strong>
                      {"して(「図の凡例と本文表の両方を突き合わせて」など)、個別に分析させず"}
                      <strong>{"統合"}</strong>
                      {
                        "させる(Gemini\n                    3\n                    の公式ガイダンス)。精密なレイアウト再現が要る場合は、他モデルとの比較評価を必須に\n                  "
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"動画理解"}</strong>
                    </td>
                    <td>
                      {
                        "\n                    エージェント型動画理解(GA)で、時刻・フレーム・音声を必要に応じて取得させる。長尺で特に有効\n                  "
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"画像生成・編集"}</strong>
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"Nano Banana 2.1 で会話的に編集。"}
                      <strong>{"Thought Signatures を必ず返す"}</strong>
                      {
                        "(会話型編集では署名が重要)。極端な縦横比(1:4〜8:1)や文字描画が改善\n                  "
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"動画生成"}</strong>
                    </td>
                    <td>
                      {
                        "\n                    Omni Flash:延長・補間・解像度指定。1080p/4K\n                    はアップスケール出力である点を成果物仕様に明記\n                  "
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"音声(リアルタイム)"}</strong>
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"低遅延は "}
                      <code>{"gemini-3.8-live"}</code>
                      {"、背景推論が必要なら\n                    "}
                      <code>{"…-live-extended-thinking"}</code>
                      {"。"}
                      <code>{"gemini-3.8-live"}</code>
                      {"\n"}
                      {"                    "}
                      {"は同期("}
                      <code>{"BLOCKING"}</code>
                      {")・非同期("}
                      <code>{"NON_BLOCKING"}</code>
                      {"、既定)の両方に対応。"}
                      <code>{"gemini-3.8-live-extended-thinking"}</code>
                      {"\n"}
                      {"                    "}
                      {"は"}
                      <strong>
                        <code>{"NON_BLOCKING"}</code> {"が必須"}
                      </strong>
                      {"(同期呼び出しはエラー)\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"TTS"}</strong>
                    </td>
                    <td>
                      {
                        "\n                    高品質は Flash TTS、大量・リアルタイムは Flash-Lite TTS。Voices\n                    エンドポイントで音声デザイン/複製("
                      }
                      <strong>{"複製は同意確認が前提"}</strong>
                      {")\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"文字起こし"}</strong>
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"非ストリーミングは "}
                      <code>{"gemini-3.5-transcribe"}</code>
                      {"、ストリーミングは\n                    "}
                      <code>{"…-live"}</code>
                      {"。語彙バイアス(最大1,000語)で固有名詞を安定化\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"ロボティクス"}</strong>
                    </td>
                    <td>
                      {
                        "\n                    Argon は ERQA 87% と報告。プレビューの\n                    "
                      }
                      <code>{"gemini-robotics-er-2-*"}</code>
                      {"\n"}
                      {"                    "}
                      {"は物理動作を伴うため"}
                      <strong>{"ブロッキング関数呼び出し"}</strong>
                      {"で安全に\n                  "}
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s13">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-bug"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "}{" "}
              <h2 id="s13-heading">{"よくある落とし穴と対処(トラブルシューティング表)"}</h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"症状"}</th>
                    <th>{"原因"}</th>
                    <th>{"対処"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"応答が空だが課金される"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"思考で "}
                      <code>{"max_output_tokens"}</code> {"を使い切った("}
                      <code>{"incomplete"}</code>
                      {")\n                  "}
                    </td>
                    <td>{"上限を32,768以上に。必要なら思考水準を下げる"}</td>
                  </tr>
                  <tr>
                    <td>{"出力が64Kで止まる"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"Interactions API: "}
                      <code>{"background"}</code> {"が\n                    "}
                      <code>{"false"}</code>
                      {
                        "、または上限未設定。GenerateContent API:\n                    自動継続を無効化した、または上限未設定\n                  "
                      }
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"Interactions API: "}
                      <code>{"background: true"}</code> {"+\n                    "}
                      <code>{"max_output_tokens"}</code>
                      {
                        " > 65,536。GenerateContent API: 最新 SDK\n                    の自動継続(既定で有効)に任せるか、"
                      }
                      <code>{"finish_reason"}</code> {"が\n                    "}
                      <code>{"CONTINUATION"}</code> {"のとき\n                    "}
                      <code>{"continuation_token"}</code> {"を付けて再送する("}
                      <code>{"background"}</code>
                      {
                        " は\n                    GenerateContent のパラメータではない)\n                  "
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"400(Interactions API): "}
                      <code>{"max_output_tokens"}</code> {"> 65536 は\n                    "}
                      <code>{"background=false"}</code> {"で未対応\n                  "}
                    </td>
                    <td>{"Interactions API の Long Decode は背景実行が前提"}</td>
                    <td>
                      {"\n"}
                      {"                   "} <code>{"background: true"}</code>{" "}
                      {"にする(GenerateContent API では自動継続または\n                    "}
                      <code>{"continuation_token"}</code> {"を使う)\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {"400: "}
                      <code>{"store=true is required"}</code>
                    </td>
                    <td>{"背景実行は保存が必須"}</td>
                    <td>
                      <code>{"store: true"}</code>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"temperature"}</code> {"を変えても出力が変わらない"}
                    </td>
                    <td>{"Argon は無視する"}</td>
                    <td>
                      {"引数を削除し、"}
                      <code>{"system_instruction"}</code> {"で制御"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"caches.create"}</code> {"でエラー"}
                    </td>
                    <td>{"Argon は明示キャッシュ非対応"}</td>
                    <td>{"削除し、暗黙キャッシュ設計へ"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"3.8 Flash / Argon で "}
                      <code>{"minimal"}</code> {"がエラー"}
                    </td>
                    <td>{"非対応の水準"}</td>
                    <td>
                      <code>{"low"}</code> {"/ "}
                      <code>{"medium"}</code> {"/ "}
                      <code>{"high"}</code> {"へ"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"最後が model ターンで400"}</td>
                    <td>{"prefill の廃止"}</td>
                    <td>
                      <code>{"system_instruction"}</code> {"/ 構造化出力へ"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"関数呼び出しで400"}</td>
                    <td>
                      {"署名欠落、または応答の "}
                      <code>{"id"}</code> {"/ "}
                      <code>{"name"}</code> {"/ 件数の不一致"}
                    </td>
                    <td>{"状態管理を Interactions API に寄せる。応答を厳密に対応づける"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"Malformed_Function_Call"}</code>
                    </td>
                    <td>{"ツール前のテキスト要件"}</td>
                    <td>{"公式の回避策ページに従う"}</td>
                  </tr>
                  <tr>
                    <td>{"想定よりコストが高い"}</td>
                    <td>{"キャッシュ不発(プレフィックスの変動)/ 出力トークン過多"}</td>
                    <td>
                      {"\n"}
                      {"                   "} <code>{"total_cached_tokens"}</code>{" "}
                      {"を確認。共通部分を先頭へ。思考水準を下げる\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"長いストリームが途中で切れる"}</td>
                    <td>{"接続断は起こりうる"}</td>
                    <td>
                      {"\n"}
                      {"                   "} <code>{"event_id"}</code>{" "}
                      {"を保存し\n                    "}
                      <code>{"last_event_id"}</code>{" "}
                      {"で再接続。タイムアウト20分\n                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"コンテキスト圧縮が早すぎる"}</td>
                    <td>
                      <code>{"total_input_tokens"}</code>
                      {"(各ホップ入力の合計)を実サイズと誤認"}
                    </td>
                    <td>{"実サイズ = プロンプト + 出力 + 思考 で推定"}</td>
                  </tr>
                  <tr>
                    <td>{"Antigravity で自分のツール解析が壊れた"}</td>
                    <td>{"09-2026版でツール引数・編集方式が変更"}</td>
                    <td>{"PascalCase引数・行範囲置換へ対応"}</td>
                  </tr>
                  <tr>
                    <td>{"無料キーで Argon が呼べない"}</td>
                    <td>{"無料枠対象外"}</td>
                    <td>{"課金有効なプロジェクトのキーを使う"}</td>
                  </tr>
                  <tr>
                    <td>{"旧モデルが勝手に別モデルになった"}</td>
                    <td>{"3.7 Flash → 3.8 Flash、3.5 Flash → 3.6 Flash の自動ルーティング"}</td>
                    <td>{"モデルIDを明示的に更新し、評価をやり直す"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s14">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-checklist"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "} <h2 id="s14-heading">{"導入チェックリスト"}</h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={styles["chk-progress"]}>
              {"\n"}
              {"           "}{" "}
              <span className={styles.count}>
                <span id="chkCount">{"0"}</span> {"/ "}
                <span id="chkTotal">{"0"}</span> {"完了"}
              </span>
              {"\n"}
              {"           "}{" "}
              <div className={styles.bar}>
                <i id="chkBar"></i>
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-54">{"A. 準備"}</h3>
            {"\n"}
            {"         "}{" "}
            <ul className={styles["chk-list"]}>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>{"課金が有効なプロジェクトの API キーを用意した(Argon は無料枠不可)"}</span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>
                    {"最新の "}
                    <code>{"google-genai"}</code> {"SDK を導入した"}
                  </span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>{"Interactions API で最小リクエストが成功した"}</span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-55">{"B. 移行(旧モデルがある場合)"}</h3>
            {"\n"}
            {"         "}{" "}
            <ul className={styles["chk-list"]}>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>
                    <code>{"temperature"}</code> {"/ "}
                    <code>{"top_p"}</code> {"/ "}
                    <code>{"top_k"}</code> {"/\n                  "}
                    <code>{"candidate_count"}</code> {"を削除した"}
                  </span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>{"prefill(最後が model ターン)を排除した"}</span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>
                    <code>{"thinking_budget"}</code> {"を "}
                    <code>{"thinking_level"}</code> {"に置換した"}
                  </span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>
                    {"明示キャッシュ("}
                    <code>{"caches.create"}</code>
                    {")を削除した"}
                  </span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>
                    <code>{"max_output_tokens"}</code> {"を32,768以上にした"}
                  </span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>{"HTTPタイムアウトを20分にした(または背景実行)"}</span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-56">{"C. 設計"}</h3>
            {"\n"}
            {"         "}{" "}
            <ul className={styles["chk-list"]}>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>{"モデル階層(難所は Argon、量は Flash / Flash-Lite)を決めた"}</span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>
                    {"3水準("}
                    <code>{"low"}</code> {"/ "}
                    <code>{"medium"}</code> {"/\n                  "}
                    <code>{"high"}</code>
                    {")で評価し、基準を満たす最低水準を採用した"}
                  </span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>{"検証スクリプト(合否基準)と、不可逆操作の承認ゲートを用意した"}</span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>
                    {"関数呼び出しの応答対応("}
                    <code>{"id"}</code> {"/ "}
                    <code>{"name"}</code> {"/\n                  件数)と署名の扱いを確認した"}
                  </span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-57">{"D. 運用"}</h3>
            {"\n"}
            {"         "}{" "}
            <ul className={styles["chk-list"]}>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>
                    <code>{"usage"}</code>
                    {"(入力・キャッシュ・出力・思考)とキャッシュヒット率を記録している"}
                  </span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>
                    <strong>{"標準価格(12/1以降)"}</strong>
                    {"で1タスク単価を再計算した"}
                  </span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>{"フォールバック(Argon → 3.8 Flash)を実装した"}</span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>{"提供面ごとの非推奨・退役スケジュールを定期確認する仕組みがある"}</span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "}{" "}
                <label className={styles.chk}>
                  <input type="checkbox" data-guide-check />
                  <span>{"自社タスクの評価セットで週次の回帰テストを回している"}</span>
                </label>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s15">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-bulb"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "}{" "}
              <h2 id="s15-heading">
                {"補足: 著名開発者・独立評価から得られる追加のベストプラクティス"}
              </h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <div className={[styles.callout, styles.note].join(" ")} data-variant="info">
              {"\n"}
              {"           "} <i className={["ti", "ti-info-circle"].join(" ")}></i>
              {"\n"}
              {"           "}{" "}
              <div className={styles["callout-body"]}>
                {"\n"}
                {"             "}{" "}
                <p>
                  {
                    "\n                以下は公式ドキュメント以外の、著名な開発者・独立評価機関の発信から抽出した実践知です。"
                  }
                  <strong>{"根拠URLは各項に併記"}</strong>
                  {"し、全URLは\n                "}
                  <a href="#s16">{"参考URL"}</a>
                  {
                    "\n                にも再掲しています。個人ベンチの数値は単一ケースとして扱ってください。\n              "
                  }
                </p>
                {"\n"}
                {"           "}{" "}
              </div>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-58">
              {
                "\n            S-1. 「トークン単価」ではなく「ゴール到達までのトークン」で比較する(Simon Willison)\n          "
              }
            </h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"内容"}</strong>
                {
                  ":\n              エージェント環境では、モデルが目標に到達するまでに使う総トークンが支配的。Artificial\n              Analysis が公開する「ベンチマーク全体の実行コスト」(Argon\n              は約$2,407)のような"
                }
                <strong>{"総コスト指標"}</strong>
                {"を見る。\n            "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"根拠"}</strong>
                {": Simon Willison's Weblog(2026-10-13)"}
                <a
                  className={styles["ref-url"]}
                  href="https://simonwillison.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://simonwillison.net/"}
                </a>
                {"\n"}
                {"              "}
                {"/ llm-gemini の Argon 対応\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://github.com/simonw/llm-gemini"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://github.com/simonw/llm-gemini"}
                </a>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-59">
              {"S-2. 最小の有効コンテキストと小さなツールセット(Philipp Schmid, Google DeepMind)"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"内容"}</strong>
                {
                  ":\n              コンテキストの圧縮・要約、共有は「通信」で行う、ツールセットを小さく、「エージェント=ツール」は構造化スキーマで。\n            "
                }
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"根拠"}</strong>
                {":\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://www.philschmid.de/context-engineering"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://www.philschmid.de/context-engineering"}
                </a>
                {"\n"}
                {"              "}
                {"/\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://x.com/_philschmid/status/1996654346386526697"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://x.com/_philschmid/status/1996654346386526697"}
                </a>
                {"\n"}
                {"              "}
                {"/\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://www.philschmid.de/building-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://www.philschmid.de/building-agents"}
                </a>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-60">
              {"S-3. サブエージェントは「パターン1から」(Philipp Schmid)"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"内容"}</strong>
                {
                  ":\n              上位パターンほど高性能モデルが必要。小型モデルならパターン1〜2。\n            "
                }
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"根拠"}</strong>
                {":\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://www.philschmid.de/subagent-patterns-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://www.philschmid.de/subagent-patterns-2026"}
                </a>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-61">
              {"S-4. サーバー側状態 + 自動署名管理(Philipp Schmid)"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"内容"}</strong>
                {":\n              "}
                <code>{"previous_interaction_id"}</code>{" "}
                {"を使い、履歴再送と署名管理を省く。\n            "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"根拠"}</strong>
                {":\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://www.philschmid.de/building-agents-interactions-api"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://www.philschmid.de/building-agents-interactions-api"}
                </a>
                {"\n"}
                {"              "}
                {"/\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://x.com/_philschmid/status/2007157689999340002"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://x.com/_philschmid/status/2007157689999340002"}
                </a>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-62">
              {"S-5. Managed Agents で秘密情報をサンドボックスに入れない(Philipp Schmid)"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                <strong>{"内容"}</strong>
                {": 認証情報はサンドボックス外で管理し、実行時に注入する。"}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"根拠"}</strong>
                {":\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://www.philschmid.de/gemini-managed-agents-developer-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://www.philschmid.de/gemini-managed-agents-developer-guide"}
                </a>
                {"\n"}
                {"              "}
                {"/\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://www.philschmid.de/managed-agents-credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://www.philschmid.de/managed-agents-credentials"}
                </a>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-63">{"S-6. 仕様→計画→小さな実装→検証の規律(Addy Osmani)"}</h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"内容"}</strong>
                {": "}
                <code>{"/spec"}</code> {"→ "}
                <code>{"/plan"}</code> {"→ "}
                <code>{"/build"}</code> {"→\n              "}
                <code>{"/test"}</code> {"→ "}
                <code>{"/review"}</code> {"→\n              "}
                <code>{"/ship"}</code>
                {
                  "。「仕様が先、コードは後」「テストは証拠」。承認は計画に1回、検証は各タスクで維持。Gemini\n              CLI / Antigravity CLI 向けアダプタも提供。\n            "
                }
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"根拠"}</strong>
                {":\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://github.com/addyosmani/agent-skills"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://github.com/addyosmani/agent-skills"}
                </a>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-64">
              {"S-7. 第三者ハーネスではキャッシュヒット率を先に確認(paddo.dev)"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"内容"}</strong>
                {
                  ":\n              プレフィックスが毎回変わると暗黙キャッシュが効かず、コストが6倍以上に。ヒット率を見てから価格を判断。\n            "
                }
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"根拠"}</strong>
                {":\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://paddo.dev/blog/gemini-4-argon/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://paddo.dev/blog/gemini-4-argon/"}
                </a>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-65">
              {"S-8. 回帰(既存テストを壊さない)と視覚タスクの個別評価(paddo.dev)"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"内容"}</strong>
                {
                  ": 実モノレポの変更で Argon\n              は「既存テストを壊さない」点が強かった一方、スクリーンショット→HTML再現では最下位。"
                }
                <strong>{"用途別に評価"}</strong>
                {"する。\n            "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"根拠"}</strong>
                {":\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://paddo.dev/blog/gemini-4-argon/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://paddo.dev/blog/gemini-4-argon/"}
                </a>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-66">{"S-9. 独立評価の使い方(Artificial Analysis)"}</h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"内容"}</strong>
                {":\n              知能指数だけでなく、"}
                <strong>{"タスク単価・出力トークン数・導入価格/標準価格の差"}</strong>
                {
                  "を見る。Argon\n              は導入価格で優位だが標準価格では差が縮む。\n            "
                }
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"根拠"}</strong>
                {":\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://artificialanalysis.ai/articles/gemini-4-argon-google-top-three-labs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://artificialanalysis.ai/articles/gemini-4-argon-google-top-three-labs"}
                </a>
                {"\n"}
                {"              "}
                {"/\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://artificialanalysis.ai/models/gemini-4-argon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://artificialanalysis.ai/models/gemini-4-argon"}
                </a>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-67">
              {"S-10. 大規模実運用の移行ノウハウ(各ゲートウェイ・開発者コミュニティ)"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"内容"}</strong>
                {
                  ":\n              長い生成は「合計の許容出力トークン」をホップ全体で指定、継続中に新規ユーザーメッセージを挟まない(OpenRouter)。サンプリング引数の無視・明示キャッシュ廃止・思考水準の既定変更・低い出力上限による空応答の課金(DEV\n              Community の移行解説)。\n            "
                }
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"根拠"}</strong>
                {":\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://openrouter.ai/docs/cookbook/evaluate-and-optimize/model-migrations/gemini-4.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {
                    "https://openrouter.ai/docs/cookbook/evaluate-and-optimize/model-migrations/gemini-4.md"
                  }
                </a>
                {"\n"}
                {"              "}
                {"/\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://dev.to/aihubmix/moving-gemini-3x-code-to-gemini-4-argon-failure-modes-and-fixes-4h1p"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {
                    "https://dev.to/aihubmix/moving-gemini-3x-code-to-gemini-4-argon-failure-modes-and-fixes-4h1p"
                  }
                </a>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-68">
              {"S-11. SDK・エコシステムでの対応状況(Guillaume Laforge ほか)"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"内容"}</strong>
                {
                  ": Java の Interactions SDK v2.1.0 が Argon・Long\n              Decode・再開可能なSSEストリーム・"
                }
                <code>{"continuationToken"}</code>
                {"\n"}
                {"              "}
                {"による継続に対応。Vercel AI Gateway は "}
                <code>{"reasoning"}</code> {"で思考水準を指定。\n            "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"根拠"}</strong>
                {":\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://github.com/glaforge/gemini-interactions-api-sdk/releases/tag/v2.1.0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://github.com/glaforge/gemini-interactions-api-sdk/releases/tag/v2.1.0"}
                </a>
                {"\n"}
                {"              "}
                {"/\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://vercel.com/changelog/gemini-4-argon-now-available-on-ai-gateway"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://vercel.com/changelog/gemini-4-argon-now-available-on-ai-gateway"}
                </a>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"         "}{" "}
            <h3 id="gemini-subheading-69">
              {"S-12. グローバルなスキルの再利用(Google Developer Expert の実践)"}
            </h3>
            {"\n"}
            {"         "}{" "}
            <ul>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"内容"}</strong>
                {": "}
                <code>{"~/.agents/skills"}</code>
                {
                  " をシンボリックリンクで\n              Antigravity のグローバルスキルに読み込ませ、旧\n              "
                }
                <code>{"~/.gemini"}</code> {"の移行用フォルダを整理する。\n            "}
              </li>
              {"\n"}
              {"           "}{" "}
              <li>
                {"\n"}
                {"             "} <strong>{"根拠"}</strong>
                {":\n              "}
                <a
                  className={styles["ref-url"]}
                  href="https://dev.to/gde/google-antigravity-gemini-4-argon-how-to-load-your-global-agents-skills-2cek"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {
                    "https://dev.to/gde/google-antigravity-gemini-4-argon-how-to-load-your-global-agents-skills-2cek"
                  }
                </a>
                {"\n"}
                {"           "}{" "}
              </li>
              {"\n"}
              {"         "}{" "}
            </ul>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <section className={styles.section} id="s16">
            {"\n"}
            {"         "}{" "}
            <div className={styles["section-head"]}>
              {"\n"}
              {"           "}{" "}
              <div className={styles["section-icon"]}>
                <i className={["ti", "ti-link"].join(" ")}></i>
              </div>
              {"\n"}
              {"           "} <h2 id="s16-heading">{"参考URL(根拠ソース一覧)"}</h2>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-70">{"A. Google 公式(一次情報)"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"内容"}</th>
                    <th>{"URL"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"What's new in Gemini 4 Argon(最新モデル・移行チェックリスト・価格)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://ai.google.dev/gemini-api/docs/latest-model"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://ai.google.dev/gemini-api/docs/latest-model"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Gemini 4 Argon 発表(Google ブログ)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/"
                        }
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Gemini 4 Argon 開発者ガイド(AI Studio)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://aistudio.google.com/learn/gemini-4-argon-developer-guide"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://aistudio.google.com/learn/gemini-4-argon-developer-guide"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Long decode ガイド"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://ai.google.dev/gemini-api/docs/long-decode"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://ai.google.dev/gemini-api/docs/long-decode"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Long decode ガイド(GenerateContent API・クライアント側継続)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://ai.google.dev/gemini-api/docs/generate-content/long-decode"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://ai.google.dev/gemini-api/docs/generate-content/long-decode"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"What's new in Gemini 3.8 Flash"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.8"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.8"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"What's new in Gemini 3.6 Flash and 3.5 Flash-Lite"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.6"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.6"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"What's new in Gemini 3.7 Flash"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.7"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.7"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Antigravity エージェント"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://ai.google.dev/gemini-api/docs/antigravity-agent"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://ai.google.dev/gemini-api/docs/antigravity-agent"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Gemini 3 開発者ガイド(Interactions API)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://ai.google.dev/gemini-api/docs/interactions/gemini-3"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://ai.google.dev/gemini-api/docs/interactions/gemini-3"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Gemini API リリースノート(changelog)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://ai.google.dev/gemini-api/docs/changelog"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://ai.google.dev/gemini-api/docs/changelog"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"思考(Thinking)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://ai.google.dev/gemini-api/docs/thinking"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://ai.google.dev/gemini-api/docs/thinking"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"思考署名(Thought signatures)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://ai.google.dev/gemini-api/docs/thought-signatures"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://ai.google.dev/gemini-api/docs/thought-signatures"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"コンテキストキャッシュ"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://ai.google.dev/gemini-api/docs/caching"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://ai.google.dev/gemini-api/docs/caching"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"料金"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://ai.google.dev/gemini-api/docs/pricing"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://ai.google.dev/gemini-api/docs/pricing"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Prompt engineering"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://ai.google.dev/gemini-api/docs/prompting-strategies"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://ai.google.dev/gemini-api/docs/prompting-strategies"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Google Cloud: モデルのバージョンとライフサイクル"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions"
                        }
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Gemini アプリのリリースノート"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://gemini.google/release-notes/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://gemini.google/release-notes/"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Gemini 4 Argon for Robotics(Google Developers Blog)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://developers.googleblog.com/gemini-4-argon-for-robotics/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://developers.googleblog.com/gemini-4-argon-for-robotics/"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"New Gemini API updates for Gemini 3(Google Developers Blog)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://developers.googleblog.com/new-gemini-api-updates-for-gemini-3/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://developers.googleblog.com/new-gemini-api-updates-for-gemini-3/"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-71">{"B. 著名な国際的開発者の発信"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"発信者"}</th>
                    <th>{"内容"}</th>
                    <th>{"URL"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"Simon Willison"}</td>
                    <td>{"週次ブログ(Argon のコスト観・llm-gemini 0.35)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://simonwillison.net/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://simonwillison.net/"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Simon Willison"}</td>
                    <td>{"llm-gemini(Argon対応・thinking_level)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://github.com/simonw/llm-gemini"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://github.com/simonw/llm-gemini"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Philipp Schmid(Google DeepMind)"}</td>
                    <td>{"ブログ一覧"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://www.philschmid.de/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://www.philschmid.de/"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Philipp Schmid"}</td>
                    <td>{"サブエージェント4パターン"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://www.philschmid.de/subagent-patterns-2026"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://www.philschmid.de/subagent-patterns-2026"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Philipp Schmid"}</td>
                    <td>{"Managed Agents 開発者ガイド"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://www.philschmid.de/gemini-managed-agents-developer-guide"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://www.philschmid.de/gemini-managed-agents-developer-guide"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Philipp Schmid"}</td>
                    <td>{"Interactions API でのエージェント構築"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://www.philschmid.de/building-agents-interactions-api"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://www.philschmid.de/building-agents-interactions-api"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Philipp Schmid"}</td>
                    <td>{"Gemini 3 でのエージェント構築"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://www.philschmid.de/building-agents"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://www.philschmid.de/building-agents"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Philipp Schmid"}</td>
                    <td>{"コンテキストエンジニアリング"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://www.philschmid.de/context-engineering"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://www.philschmid.de/context-engineering"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Philipp Schmid"}</td>
                    <td>{"Credentials API"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://www.philschmid.de/managed-agents-credentials"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://www.philschmid.de/managed-agents-credentials"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Philipp Schmid(X)"}</td>
                    <td>{"最小の有効コンテキスト"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://x.com/_philschmid/status/1996654346386526697"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://x.com/_philschmid/status/1996654346386526697"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Philipp Schmid(X)"}</td>
                    <td>{"Interactions API 発表"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://x.com/_philschmid/status/2007157689999340002"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://x.com/_philschmid/status/2007157689999340002"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Addy Osmani"}</td>
                    <td>{"エンジニアリング・スキル集(Gemini CLI / Antigravity 対応)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://github.com/addyosmani/agent-skills"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://github.com/addyosmani/agent-skills"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Guillaume Laforge"}</td>
                    <td>{"Gemini Interactions API Java SDK v2.1.0"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://github.com/glaforge/gemini-interactions-api-sdk/releases/tag/v2.1.0"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://github.com/glaforge/gemini-interactions-api-sdk/releases/tag/v2.1.0"
                        }
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-72">{"C. 独立評価・実測・解説"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"内容"}</th>
                    <th>{"URL"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"Artificial Analysis: Argon が上位3ラボ入り(知能指数・タスク単価)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://artificialanalysis.ai/articles/gemini-4-argon-google-top-three-labs"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://artificialanalysis.ai/articles/gemini-4-argon-google-top-three-labs"
                        }
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Artificial Analysis: Gemini 4 Argon モデルページ"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://artificialanalysis.ai/models/gemini-4-argon"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://artificialanalysis.ai/models/gemini-4-argon"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"paddo.dev: Argon vs Opus 5.5 の実コード比較(キャッシュの罠を含む)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://paddo.dev/blog/gemini-4-argon/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://paddo.dev/blog/gemini-4-argon/"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"VentureBeat: 発表時のベンチマーク分析"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://venturebeat.com/technology/google-unveils-gemini-4-argon-retaking-benchmark-lead-over-openai-and-anthropic-but-in-limited-release"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://venturebeat.com/technology/google-unveils-gemini-4-argon-retaking-benchmark-lead-over-openai-and-anthropic-but-in-limited-release"
                        }
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"VentureBeat: 一般提供と導入価格"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://venturebeat.com/technology/google-makes-gemini-4-argon-broadly-available-with-limited-time-low-api-pricing-of-2-10-per-1m-token"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://venturebeat.com/technology/google-makes-gemini-4-argon-broadly-available-with-limited-time-low-api-pricing-of-2-10-per-1m-token"
                        }
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"9to5Google: 発表の概要"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://9to5google.com/2026/09/30/gemini-4-argon-announcement/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://9to5google.com/2026/09/30/gemini-4-argon-announcement/"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Releasebot: Gemini API 更新履歴"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://releasebot.io/updates/google/gemini-api"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://releasebot.io/updates/google/gemini-api"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"         "} <h3 id="gemini-subheading-73">{"D. 移行・統合の実践ガイド"}</h3>
            {"\n"}
            {"         "}{" "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"           "}{" "}
              <table>
                <thead>
                  <tr>
                    <th>{"内容"}</th>
                    <th>{"URL"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"OpenRouter: Gemini 4 移行ガイド"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://openrouter.ai/docs/cookbook/evaluate-and-optimize/model-migrations/gemini-4.md"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://openrouter.ai/docs/cookbook/evaluate-and-optimize/model-migrations/gemini-4.md"
                        }
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Vercel AI Gateway: Argon 対応"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://vercel.com/changelog/gemini-4-argon-now-available-on-ai-gateway"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://vercel.com/changelog/gemini-4-argon-now-available-on-ai-gateway"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"DEV: Gemini 3.x コードから Argon への移行(失敗モードと対処)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://dev.to/aihubmix/moving-gemini-3x-code-to-gemini-4-argon-failure-modes-and-fixes-4h1p"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://dev.to/aihubmix/moving-gemini-3x-code-to-gemini-4-argon-failure-modes-and-fixes-4h1p"
                        }
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"DEV: Antigravity + Argon でグローバルスキルを読み込む"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://dev.to/gde/google-antigravity-gemini-4-argon-how-to-load-your-global-agents-skills-2cek"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://dev.to/gde/google-antigravity-gemini-4-argon-how-to-load-your-global-agents-skills-2cek"
                        }
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"DEV: Gemini 3.5 Flash 開発者ガイド(関数呼び出し・思考保持)"}</td>
                    <td>
                      {"\n"}
                      {"                   "}{" "}
                      <a
                        className={styles["ref-url"]}
                        href="https://dev.to/googleai/gemini-35-flash-developer-guide-1i46"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://dev.to/googleai/gemini-35-flash-developer-guide-1i46"}
                      </a>
                      {"\n"}
                      {"                 "}{" "}
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"         "}{" "}
            </div>
            {"\n"}
            {"       "}{" "}
          </section>
          {"\n"}
          {"       "}{" "}
          <footer className={styles.footer}>
            {"\n"}
            {"         "}{" "}
            <p>
              {
                "\n            最終更新:\n            2026年10月23日。価格・提供形態・非推奨日は頻繁に変わります。実装・見積もりの前に A\n            群の公式ページで再確認してください。\n          "
              }
            </p>
            {"\n"}
            {"       "}{" "}
          </footer>
          {"\n"}
          {"     "}{" "}
        </div>
        {"\n"}
        {"   "}{" "}
      </div>
      {"\n"}
      {"   "} {"\n"} {" \n\n"}
      <TocObserver />
    </div>
  );
}
