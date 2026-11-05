import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import { findBySlug } from "@/lib/page-registry";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";
export const metadata: Metadata = {
  title: "Grok Bot(xAI)初学者向けステップバイステップ・ベストプラクティスガイド",
  description:
    "Grok Bot の導入、依頼の書き方、Skill・Routine、承認と最小権限を学ぶ初学者向けガイド。情報基準日2026-10-24。",
};
const DIAGRAM_0 = `flowchart TB
    U["あなた"]
    B1["Bot A"]
    B2["Bot B"]
    B3["Bot C"]
    PC["共有クラウドPC 個人Botで1台を共有"]
    BR["ブラウザのログイン状態"]
    FS["ファイルと workspace"]
    CLI["コマンドライン資格情報"]
    WEB["Webサイトやコマンドの接続先"]
    BE["Cursorバックエンド リモートMCPの発信元"]
    TOK["OAuthトークンはコネクタ側に保管"]
    APP["接続アプリ Slack GitHubなど"]
    U --> B1
    U --> B2
    U --> B3
    B1 --> PC
    B2 --> PC
    B3 --> PC
    PC --> BR
    PC --> FS
    PC --> CLI
    BR --> WEB
    CLI --> WEB
    PC --> BE
    WEB ~~~ BE
    BE --> TOK
    BE --> APP
    class U,B1,B2,B3,BR,FS,CLI,WEB,TOK box
    class PC,BE hub
    class APP done

classDef box fill:#ffffff,stroke:#3b4a9c,stroke-width:1.5px,color:#1f2430
classDef hub fill:#3b4a9c,stroke:#3b4a9c,color:#ffffff
classDef done fill:#2f6b4f,stroke:#2f6b4f,color:#ffffff
`;
const DIAGRAM_1 = `flowchart TB
    S0["準備"] --> S1["インストール"]
    S1 --> S2["サインイン"]
    S2 --> S3["最初のBot"]
    S3 --> S4["依頼を書く"]
    S4 --> S5["ログインは自分で"]
    S5 --> S6["レビュー"]
    S6 --> S7["Skill化"]
    S7 --> S8["Routine化"]
    class S0,S1,S2,S3,S4,S5,S6,S7 box
    class S8 done

classDef box fill:#ffffff,stroke:#3b4a9c,stroke-width:1.5px,color:#1f2430
classDef hub fill:#3b4a9c,stroke:#3b4a9c,color:#ffffff
classDef done fill:#2f6b4f,stroke:#2f6b4f,color:#ffffff
`;
const DIAGRAM_2 = `flowchart TD
    A["Grok Bot を使いたい"] --> B{"Cursorのデータ設定は Legacy Privacy Mode か"}
    B -->|"はい"| C["対応するデータ設定へ変更する"]
    B -->|"いいえ"| D["そのまま開始できる"]
    C --> D
    D --> E["学習利用の可否はCursor側設定で確認"]
    class A,B,C,E box
    class D done

classDef box fill:#ffffff,stroke:#3b4a9c,stroke-width:1.5px,color:#1f2430
classDef hub fill:#3b4a9c,stroke:#3b4a9c,color:#ffffff
classDef done fill:#2f6b4f,stroke:#2f6b4f,color:#ffffff
`;
const DIAGRAM_3 = `flowchart TB
    NG["何でも屋 Bot 1体 避けたい構成"] --> NG2["文脈が散らかり品質が下がる"]
    OKH["役割別に分ける 推奨構成"] --> P["分析担当"]
    OKH --> Q["調査担当"]
    OKH --> R["資料担当"]
    NG2 ~~~ OKH
    class NG,NG2,P,Q,R box
    class OKH hub

classDef box fill:#ffffff,stroke:#3b4a9c,stroke-width:1.5px,color:#1f2430
classDef hub fill:#3b4a9c,stroke:#3b4a9c,color:#ffffff
classDef done fill:#2f6b4f,stroke:#2f6b4f,color:#ffffff
`;
const DIAGRAM_4 = `flowchart TD
    A["Bot が認証画面に到達"] --> V{"個人Botか Shared Botか"}
    V -->|"個人Bot"| P1["Vault パスワードマネージャ Secure Form を使う"]
    V -->|"Shared Bot"| P2["個人Vaultは使わず パスワードマネージャ Secure Form を使う"]
    P2 --> P3["Managerが追加したTeam Bot専用Vault v0.78.1以降 段階配信"]
    P1 --> Q{"フォームで処理できるか"}
    P3 --> Q
    Q -->|"できる"| OK["Bot が続行"]
    Q -->|"できない"| B["Take over を依頼"]
    B --> C["あなたが Take over を選ぶ"]
    C --> D["パスワード等を自分で入力"]
    D --> E["I'm done を選ぶ"]
    E --> F["Bot に続行を指示"]
    F --> G["セッションはBotが使うコンピュータに保持"]
    class A,V,P1,P2,P3,Q,B,C,D,E,F box
    class OK,G done

classDef box fill:#ffffff,stroke:#3b4a9c,stroke-width:1.5px,color:#1f2430
classDef hub fill:#3b4a9c,stroke:#3b4a9c,color:#ffffff
classDef done fill:#2f6b4f,stroke:#2f6b4f,color:#ffffff
`;
const DIAGRAM_5 = `flowchart TD
    A["1回限りのタスクで試す"] --> B{"結果は毎回安定しているか"}
    B -->|"いいえ"| A
    B -->|"はい"| C["Skill として保存"]
    C --> D["安全な入力で Test 実行"]
    D --> E{"承認ポイントで止まるか"}
    E -->|"いいえ"| C
    E -->|"はい"| F["Routine として自動化"]
    F --> G["実行履歴を定期的に確認"]
    class A,B,C,D,E,G box
    class F done

classDef box fill:#ffffff,stroke:#3b4a9c,stroke-width:1.5px,color:#1f2430
classDef hub fill:#3b4a9c,stroke:#3b4a9c,color:#ffffff
classDef done fill:#2f6b4f,stroke:#2f6b4f,color:#ffffff
`;
const DIAGRAM_6 = `flowchart TB
    X1["Xで @bot をタグ付け"] --> X2["@bot が受領返信"]
    X2 --> X3["メインBotが作業開始"]
    X3 --> X4["アプリの会話に結果"]
    class X1,X2,X3 box
    class X4 done

classDef box fill:#ffffff,stroke:#3b4a9c,stroke-width:1.5px,color:#1f2430
classDef hub fill:#3b4a9c,stroke:#3b4a9c,color:#ffffff
classDef done fill:#2f6b4f,stroke:#2f6b4f,color:#ffffff
`;
const DIAGRAM_7 = `flowchart TD
    A["Bot が操作を実行しようとする"] --> B{"Ask first ルールに一致するか"}
    B -->|"はい"| C["必ずあなたに確認する"]
    B -->|"いいえ"| D{"Allow automatically ルールに一致するか"}
    D -->|"はい"| E{"自動レビューが別の停止理由を見つけたか"}
    E -->|"はい"| C
    E -->|"いいえ"| F["自動で実行"]
    D -->|"いいえ"| G["通常の承認フロー"]
    class A,B,D,E,G box
    class C hub
    class F done

classDef box fill:#ffffff,stroke:#3b4a9c,stroke-width:1.5px,color:#1f2430
classDef hub fill:#3b4a9c,stroke:#3b4a9c,color:#ffffff
classDef done fill:#2f6b4f,stroke:#2f6b4f,color:#ffffff
`;
const DIAGRAM_8 = `flowchart TD
    W["悪意のあるWebページ メール 投稿"] --> A["Bot が閲覧や読み取りをする"]
    A --> P["隠れた指示を実行しかける"]
    P --> S["共有コンピュータ"]
    S --> F["ファイル"]
    S --> L["ログイン済みセッション"]
    S --> C["連携サービス"]
    A --> G["防御は承認境界と最小権限と外部送信の禁止"]
    class W,A,P,F,L,C box
    class S hub
    class G done

classDef box fill:#ffffff,stroke:#3b4a9c,stroke-width:1.5px,color:#1f2430
classDef hub fill:#3b4a9c,stroke:#3b4a9c,color:#ffffff
classDef done fill:#2f6b4f,stroke:#2f6b4f,color:#ffffff
`;
const DIAGRAM_9 = `flowchart TB
    W1["Routine の実行履歴を確認"] --> W2["失敗や空振りを修正"]
    W2 --> W3["使っていないコネクタを削除"]
    W3 --> W4["Auto-review ルールを見直す"]
    W4 --> W5["共有PCの機密ファイルを掃除"]
    class W1,W2,W3,W4 box
    class W5 done

classDef box fill:#ffffff,stroke:#3b4a9c,stroke-width:1.5px,color:#1f2430
classDef hub fill:#3b4a9c,stroke:#3b4a9c,color:#ffffff
classDef done fill:#2f6b4f,stroke:#2f6b4f,color:#ffffff
`;
const DIAGRAM_10 = `flowchart TD
    R0["Routine が期待通り動かない"] --> R1{"一時停止されていないか"}
    R1 -->|"停止中"| R2["Resume する"]
    R1 -->|"動作中"| R3{"サイトのログインが切れていないか"}
    R3 -->|"切れている"| R4["Take over で再ログイン"]
    R3 -->|"有効"| R5{"Webサイトや入力形式が変わっていないか"}
    R5 -->|"変わった"| R6["Skill を修正して Test で再確認"]
    R5 -->|"変わらない"| R7["実行履歴と承認の期限切れを確認"]
    class R0,R1,R3,R5,R2,R4,R6 box
    class R7 done

classDef box fill:#ffffff,stroke:#3b4a9c,stroke-width:1.5px,color:#1f2430
classDef hub fill:#3b4a9c,stroke:#3b4a9c,color:#ffffff
classDef done fill:#2f6b4f,stroke:#2f6b4f,color:#ffffff
`;
const THEME = {
  fontFamily: '"Noto Sans JP","Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif',
  fontSize: "16px",
  primaryColor: "#ffffff",
  primaryBorderColor: "#3b4a9c",
  primaryTextColor: "#1f2430",
  lineColor: "#4a5160",
  textColor: "#1f2430",
};
export default function Page() {
  const entry = findBySlug("/xai/grok-bot-guide");
  if (!entry) throw new Error("dots guide is missing from the page registry");
  return (
    <div
      id="grok-guide"
      className={[styles.root, styles.layout].join(" ")}
      data-testid="layout-root"
      data-page="grok-bot"
    >
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Noto+Sans+JP:wght@400;500;700&family=Source+Serif+4:wght@600;700&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/atom-one-dark.min.css"
        integrity="sha384-oaMLBGEzBOJx3UHwac0cVndtX5fxGQIfnAeFZ35RTgqPcYlbprH9o9PUV/F8Le07"
        crossOrigin="anonymous"
      />
      {"\n"}
      {"    "}
      <div className={[styles.layout].join(" ")}>
        {"\n"}
        {"      "}
        <nav
          className={[styles.sidebar].join(" ")}
          id="grok-sidebar"
          aria-label="目次"
          data-testid="sidebar-nav"
        >
          {"\n"}
          {"        "}
          <div className={[styles.brand].join(" ")}>
            {"Grok Bot ガイド"}
            <small>{"初学者向けベストプラクティス"}</small>
          </div>
          {"\n"}
          {"        "}
          <a
            className={[styles["nav-a"], styles.active].join(" ")}
            href="#sec-1"
            data-testid="sidebar-nav-link"
            aria-current="location"
          >
            <span className={[styles["n-num"]].join(" ")}>{"1"}</span>
            <span className={[styles["n-t"]].join(" ")}>{"このガイドの使い方と前提"}</span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-2" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"2"}</span>
            <span className={[styles["n-t"]].join(" ")}>{"Grok Bot とは何か"}</span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-3" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"3"}</span>
            <span className={[styles["n-t"]].join(" ")}>{"全体像をつかむ"}</span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-4" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"4"}</span>
            <span className={[styles["n-t"]].join(" ")}>{"Step 0: 始める前の準備"}</span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-5" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"5"}</span>
            <span className={[styles["n-t"]].join(" ")}>{"Step 1: アプリをインストールする"}</span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-6" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"6"}</span>
            <span className={[styles["n-t"]].join(" ")}>{"Step 2: サインインする"}</span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-7" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"7"}</span>
            <span className={[styles["n-t"]].join(" ")}>{"Step 3: 最初の Bot を設定する"}</span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-8" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"8"}</span>
            <span className={[styles["n-t"]].join(" ")}>{"Step 4: 良い依頼の書き方(5要素)"}</span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-9" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"9"}</span>
            <span className={[styles["n-t"]].join(" ")}>
              {"Step 5: ログインは自分で行う(Take over)"}
            </span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-10" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"10"}</span>
            <span className={[styles["n-t"]].join(" ")}>{"Step 6: 結果をレビューして育てる"}</span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-11" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"11"}</span>
            <span className={[styles["n-t"]].join(" ")}>{"Step 7: Skill 化 → Routine 化"}</span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-12" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"12"}</span>
            <span className={[styles["n-t"]].join(" ")}>
              {"Step 8: X から @bot でタスクを渡す"}
            </span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-13" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"13"}</span>
            <span className={[styles["n-t"]].join(" ")}>
              {"承認(Approvals)と Auto Review の設計"}
            </span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-14" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"14"}</span>
            <span className={[styles["n-t"]].join(" ")}>{"セキュリティの境界を理解する"}</span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-15" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"15"}</span>
            <span className={[styles["n-t"]].join(" ")}>
              {"最小権限セットアップ・チェックリスト"}
            </span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-16" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"16"}</span>
            <span className={[styles["n-t"]].join(" ")}>{"チーム・組織で使うとき"}</span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-17" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"17"}</span>
            <span className={[styles["n-t"]].join(" ")}>{"トラブルシュート"}</span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-18" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"18"}</span>
            <span className={[styles["n-t"]].join(" ")}>
              {"よくある失敗と対策(アンチパターン集)"}
            </span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-19" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"19"}</span>
            <span className={[styles["n-t"]].join(" ")}>
              {"補足: その他のベストプラクティスと根拠ソース"}
            </span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-20" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"20"}</span>
            <span className={[styles["n-t"]].join(" ")}>{"参考URL一覧"}</span>
          </a>
          {"\n"}
          {"        "}
          <a className={[styles["nav-a"]].join(" ")} href="#sec-21" data-testid="sidebar-nav-link">
            <span className={[styles["n-num"]].join(" ")}>{"21"}</span>
            <span className={[styles["n-t"]].join(" ")}>{"検証メモと限界"}</span>
          </a>
          {"\n"}
          {"      "}
        </nav>
        {"\n"}
        {"      "}
        <div className={[styles.scrim].join(" ")} id="grok-backdrop" aria-hidden="true"></div>
        {"\n"}
        {"      "}
        <div className={[styles.main].join(" ")}>
          <div className={[styles["mobile-bar"]].join(" ")} id="grok-mobile-bar">
            {"\n"}
            {"          "}
            <button
              id="grok-menu"
              type="button"
              aria-label="目次を開く"
              aria-controls="grok-sidebar"
              aria-expanded="false"
            >
              {"目次"}
            </button>
            <span>{"Grok Bot ガイド"}</span>
            {"\n"}
            {"        "}
          </div>
          <main>
            {"\n"}
            {"        "}
            {"\n"}
            {"        "}
            <header className={[styles.hero].join(" ")}>
              <div className={styles.heroDates} data-testid="hero-dates">
                <span>
                  最終確認日 <time dateTime={entry.lastReviewed}>{entry.lastReviewed}</time>
                </span>{" "}
                <span>
                  公開日 <time dateTime={entry.addedAt}>{entry.addedAt}</time>
                </span>
              </div>
              {"\n"}
              {"          "}
              <p className={[styles.eyebrow].join(" ")}>{"xAI / GROK BOT BEST PRACTICES"}</p>
              {"\n"}
              {"          "}
              <h1>{"Grok Bot(xAI)初学者向けステップバイステップ・ベストプラクティスガイド"}</h1>
              {"\n"}
              {"          "}
              <div className={[styles.meta].join(" ")}>
                {"\n"}
                {"            "}
                <div className={[styles["meta-row"]].join(" ")}>
                  {"\n"}
                  {"              "}
                  <div className={[styles["meta-k"]].join(" ")}>{"対象読者"}</div>
                  {"\n"}
                  {"              "}
                  <div className={[styles["meta-v"]].join(" ")}>
                    {"\n"}
                    {"                "}
                    {"AIエージェントを初めて業務に使う方、Grok Bot を安全に使い始めたい方"}
                    {"\n"}
                    {"              "}
                  </div>
                  {"\n"}
                  {"            "}
                </div>
                {"\n"}
                {"            "}
                <div className={[styles["meta-row"]].join(" ")}>
                  {"\n"}
                  {"              "}
                  <div className={[styles["meta-k"]].join(" ")}>{"情報時点"}</div>
                  {"\n"}
                  {"              "}
                  <div className={[styles["meta-v"]].join(" ")}>
                    {"\n"}
                    {"                "}
                    {"2026年10月24日(Grok Bot は"}
                    {"\n"}
                    {"                "}
                    <strong>{"ベータ"}</strong>
                    {"で、仕様は頻繁に変わります。最新は必ず公式ドキュメントで確認してください)"}
                    {"\n"}
                    {"              "}
                  </div>
                  {"\n"}
                  {"            "}
                </div>
                {"\n"}
                {"            "}
                <div className={[styles["meta-row"]].join(" ")}>
                  {"\n"}
                  {"              "}
                  <div className={[styles["meta-k"]].join(" ")}>{"アンカー記事"}</div>
                  {"\n"}
                  {"              "}
                  <div className={[styles["meta-v"]].join(" ")}>
                    {"\n"}
                    {"                "}
                    <a
                      href="https://x.ai/news/introducing-grok-bot"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {"Introducing Grok Bot(x.ai)"}
                    </a>
                    {"\n"}
                    {"              "}
                  </div>
                  {"\n"}
                  {"            "}
                </div>
                {"\n"}
                {"            "}
                <div className={[styles["meta-row"]].join(" ")}>
                  {"\n"}
                  {"              "}
                  <div className={[styles["meta-k"]].join(" ")}>{"表記について"}</div>
                  {"\n"}
                  {"              "}
                  <div className={[styles["meta-v"]].join(" ")}>
                    {"\n"}
                    {"                "}
                    {"xAI の公式サイトは現在 「SpaceXSI /"}
                    {"\n"}
                    {"                "}
                    {"SpaceXAI」表記が混在しています。本ガイドでは便宜上「xAI」と書きます。"}
                    {"\n"}
                    {"              "}
                  </div>
                  {"\n"}
                  {"            "}
                </div>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"        "}
            </header>
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-1">
              {"\n"}
              {"          "}
              <h2 id="sec-1-heading">
                <span className={[styles.num].join(" ")}>{"1"}</span>
                {"このガイドの使い方と前提"}
              </h2>
              {"\n"}
              {"          "}
              <h3 id="s1-1">{"1.1 学習ゴール"}</h3>
              {"\n"}
              {"          "}
              <p>{"このガイドを読み終えると、次のことができるようになります。"}</p>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"#"}</th>
                      <th>{"できること"}</th>
                      <th>{"対応する章"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"1"}</td>
                      <td>{"Grok Bot が「何者で」「どこで動くか」を説明できる"}</td>
                      <td>{"2〜3章"}</td>
                    </tr>
                    <tr>
                      <td>{"2"}</td>
                      <td>{"インストールから最初のタスク完了までを自力で行える"}</td>
                      <td>{"4〜10章"}</td>
                    </tr>
                    <tr>
                      <td>{"3"}</td>
                      <td>{"成功したタスクを Skill / Routine にして自動化できる"}</td>
                      <td>{"11〜12章"}</td>
                    </tr>
                    <tr>
                      <td>{"4"}</td>
                      <td>{"承認ルールと最小権限で事故を防げる"}</td>
                      <td>{"13〜15章"}</td>
                    </tr>
                    <tr>
                      <td>{"5"}</td>
                      <td>{"困ったときに原因を切り分けられる"}</td>
                      <td>{"17〜18章"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <h3 id="s1-2">{"1.2 一次情報と二次情報の区別"}</h3>
              {"\n"}
              {"          "}
              <p>{"本ガイドでは情報源を次のように区別しています。"}</p>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"区分"}</th>
                      <th>{"意味"}</th>
                      <th>{"例"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{"公式(一次)"}</strong>
                      </td>
                      <td>{"xAI / Cursor の公式ドキュメント・発表"}</td>
                      <td>
                        <code>{"docs.x.ai"}</code>
                        {", "}
                        <code>{"x.ai/news"}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"第三者(二次)"}</strong>
                      </td>
                      <td>{"解説記事、レビュー、開発者のブログや投稿"}</td>
                      <td>{"Composio, eesel, 各種ブログ"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"筆者の整理"}</strong>
                      </td>
                      <td>{"上記をもとにした推奨(根拠を併記)"}</td>
                      <td>{"各章の「ベストプラクティス」"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <blockquote>
                {"\n"}
                {"            "}
                <p>
                  {"\n"}
                  {"              "}
                  <strong>{"重要"}</strong>
                  {":"}
                  {"\n"}
                  {"              "}
                  {
                    "第三者の意見は参考情報です。製品の挙動・料金・制限は公式の最新ページで確認してください。"
                  }
                  {"\n"}
                  {"            "}
                </p>
                {"\n"}
                {"          "}
              </blockquote>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-2">
              {"\n"}
              {"          "}
              <h2 id="sec-2-heading">
                <span className={[styles.num].join(" ")}>{"2"}</span>
                {"Grok Bot とは何か"}
              </h2>
              {"\n"}
              {"          "}
              <h3 id="s2-1">{"2.1 ひとことで言うと"}</h3>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                <strong>
                  {"Grok Bot"}
                  {"\n"}
                  {"              "}
                  {
                    "は、あなた専用の「クラウド上のコンピュータ」を持ち、名前付きの役割(Bot)として継続的に仕事をしてくれる"
                  }
                  {"\n"}
                  {"              "}
                  {"AI チームメイト"}
                </strong>
                {"です。ブラウザ、ターミナル、ファイル、アプリ連携(MCP"}
                {"\n"}
                {"            "}
                {"を含む)を使って作業し、スケジュールやイベントで自律的に動かすこともできます。"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <h3 id="s2-2">{"2.2 チャット型 AI との違い"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"観点"}</th>
                      <th>{"一般的なチャット AI"}</th>
                      <th>{"Grok Bot"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"動く場所"}</td>
                      <td>{"会話ウィンドウの中"}</td>
                      <td>
                        <strong>{"永続するクラウドコンピュータ"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{"記憶"}</td>
                      <td>{"会話ごと(機能による)"}</td>
                      <td>{"Bot ごとに役割・やり方を覚えさせる"}</td>
                    </tr>
                    <tr>
                      <td>{"操作できるもの"}</td>
                      <td>{"主にテキスト"}</td>
                      <td>{"ブラウザ・ファイル・ターミナル・連携アプリ"}</td>
                    </tr>
                    <tr>
                      <td>{"起動のきっかけ"}</td>
                      <td>{"あなたの発言"}</td>
                      <td>
                        {"発言 + "}
                        <strong>{"スケジュール / イベント / X での @bot"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{"リスク"}</td>
                      <td>{"回答の誤り中心"}</td>
                      <td>
                        <strong>{"実際の操作(送信・変更・削除)による被害"}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <h3 id="s2-3">{"2.3 用語集"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"用語"}</th>
                      <th>{"意味"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{"Bot"}</strong>
                      </td>
                      <td>{"役割を持った AI の個体。1 Bot = 1 つの主な仕事が基本"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"共有クラウドコンピュータ"}</strong>
                      </td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"あなたのアカウントに 1 台割り当てられる計算環境。"}
                        <strong>{"あなたの個人 Bot はすべてこれを共有"}</strong>
                        {"する。Shared Bot"}
                        {"\n"}
                        {"                    "}
                        {"は、メンバー自身のチャットではそのメンバーのコンピュータを、Slack"}
                        {"\n"}
                        {"                    "}
                        {"チャンネルやグループチャットでは Shared Bot 側のコンピュータを使う"}
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Skill"}</strong>
                      </td>
                      <td>{"作業手順・判断ルール・出力形式をまとめた再利用可能な指示"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Routine"}</strong>
                      </td>
                      <td>
                        {"「いつ(スケジュール/イベント)」「どの Bot が」「何を」実行するかの定義"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Approval(承認)"}</strong>
                      </td>
                      <td>{"重要な操作の前にあなたに確認を求める仕組み"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Auto Review"}</strong>
                      </td>
                      <td>{"実行前にモデルがツール呼び出しやPC操作を審査する機能"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Take over"}</strong>
                      </td>
                      <td>{"パスワード入力などをあなた自身が行うための操作引き継ぎ"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Team Bot"}</strong>
                      </td>
                      <td>{"Cursor チームのメンバーが一緒に話しかけられる共有 Bot"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"@bot"}</strong>
                      </td>
                      <td>{"X(旧Twitter)の投稿から自分の Grok Bot にタスクを渡す宛先"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-3">
              {"\n"}
              {"          "}
              <h2 id="sec-3-heading">
                <span className={[styles.num].join(" ")}>{"3"}</span>
                {"全体像をつかむ"}
              </h2>
              {"\n"}
              {"          "}
              <h3 id="s3-1">{"3.1 構成図"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["diagram-card"]].join(" ")}>
                {"\n"}
                {"            "}
                <div className={[styles["diagram-wrap"]].join(" ")}>
                  {"\n"}
                  {"              "}
                  <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="diag-0">
                    <MermaidDiagram
                      chart={DIAGRAM_0}
                      theme="base"
                      themeVariables={THEME}
                      flowchartHtmlLabels={false}
                    />
                  </div>
                  {"\n"}
                  {"            "}
                </div>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"\n"}
              {"          "}
              <p>
                <strong>{"読み取るべきポイント"}</strong>
              </p>
              {"\n"}
              {"          "}
              <ul>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"Bot は複数作れますが、"}
                  <strong>{"すべて同じクラウドコンピュータを使います"}</strong>
                  {"。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"ブラウザとターミナルの通信は"}
                  <strong>{"共有クラウドコンピュータから"}</strong>
                  {"出ますが、リモート"}
                  {"\n"}
                  {"              "}
                  {"MCP 接続は "}
                  <strong>{"Cursor バックエンドから"}</strong>
                  {"発信され、接続アプリの OAuth"}
                  {"\n"}
                  {"              "}
                  {"トークンは"}
                  <strong>{"コネクタのバックエンドに留まり"}</strong> {"PC には置かれません。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"したがって「Bot"}
                  {"\n"}
                  {"              "}
                  {"を分ければ権限も分かれる」わけでは"}
                  <strong>{"ありません"}</strong>
                  {"(公式ドキュメントも「別々の"}
                  {"\n"}
                  {"              "}
                  {"Bot をセキュリティ境界として使わない」と明記しています)。詳細は"}
                  {"\n"}
                  {"              "}
                  <a href="#sec-14">{"14章"}</a>
                  {"。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"          "}
              </ul>
              {"\n"}
              {"          "}
              <h3 id="s3-2">{"3.2 学習の道筋"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["diagram-card"]].join(" ")}>
                {"\n"}
                {"            "}
                <div className={[styles["diagram-wrap"]].join(" ")}>
                  {"\n"}
                  {"              "}
                  <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="diag-1">
                    <MermaidDiagram
                      chart={DIAGRAM_1}
                      theme="base"
                      themeVariables={THEME}
                      flowchartHtmlLabels={false}
                    />
                  </div>
                  {"\n"}
                  {"            "}
                </div>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-4">
              {"\n"}
              {"          "}
              <h2 id="sec-4-heading">
                <span className={[styles.num].join(" ")}>{"4"}</span>
                {"Step 0: 始める前の準備"}
              </h2>
              {"\n"}
              {"          "}
              <h3 id="s4-1">{"4.1 必要なもの"}</h3>
              {"\n"}
              {"          "}
              <p>{"公式の「Get started」によると、次が必要です。"}</p>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"項目"}</th>
                      <th>{"内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{"対象プラン"}</strong>
                      </td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"レガシー Cursor プランの有料個人プラン / Cursor Teams / Cursor"}
                        {"\n"}
                        {"                    "}
                        {
                          "Enterprise(管理者によるチームへの有効化が必要。アカウント担当者に相談し、使用量は管理者が管理。個人の"
                        }
                        {"\n"}
                        {"                    "}
                        {"SuperGrok 連携は不可)/ The X Subscription の Premium・Super・Ultra"}
                        {"\n"}
                        {"                    "}
                        {"プラン(個人シート・チームシートとも対象。Grok Bot を含み、Grok"}
                        {"\n"}
                        {"                    "}
                        {"アカウントの連携は不要。Plus は対象外)/ 個人の SuperGrok・SuperGrok"}
                        {"\n"}
                        {"                    "}
                        {"Plus・SuperGrok Heavy または X Premium+ をレガシーの Cursor"}
                        {"\n"}
                        {"                    "}
                        {"アカウントに連携(特定の Cursor プランは不要)/ 自己登録型 Grok Business"}
                        {"\n"}
                        {"                    "}
                        {"のシート("}
                        <strong>{"Sign in with Grok"}</strong> {"でサインイン)"}
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"アプリ"}</strong>
                      </td>
                      <td>
                        {"macOS / Windows / Linux 用の Grok Bot デスクトップアプリ(モバイルもあり)"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"最初の題材"}</strong>
                      </td>
                      <td>{"Bot が実際に役に立てる「アプリやWebサイト」"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <blockquote>
                {"\n"}
                {"            "}
                <p>
                  {"\n"}
                  {"              "}
                  <strong>{"料金は変わります"}</strong>
                  {"。最新は公式のプラン案内(Cursor の Grok Bot plans"}
                  {"\n"}
                  {"              "}
                  {"ページ)で確認してください。"}
                  {"\n"}
                  {"            "}
                </p>
                {"\n"}
                {"          "}
              </blockquote>
              {"\n"}
              {"          "}
              <h3 id="s4-2">{"4.2 プライバシー設定(最初に確認)"}</h3>
              {"\n"}
              {"          "}
              <ul>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"Grok Bot は "}
                  <strong>{"クラウドへのデータ保存が必須"}</strong>
                  {"で、Cursor の"}
                  {"\n"}
                  {"              "}
                  <strong>{"Legacy Privacy Mode は非対応"}</strong>
                  {"です。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {
                    "Legacy Privacy Mode のアカウントは、対応するデータ設定へ切り替えないと開始できません。"
                  }
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {
                    "学習利用のオプトアウトは、個人アカウントではそのアカウントのプライバシー設定に、チームのメンバーではチームの"
                  }
                  {"\n"}
                  {"              "}
                  {"Privacy Mode(Team Settings で確認)に従います。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"          "}
              </ul>
              {"\n"}
              {"          "}
              <div className={[styles["diagram-card"]].join(" ")}>
                {"\n"}
                {"            "}
                <div className={[styles["diagram-wrap"]].join(" ")}>
                  {"\n"}
                  {"              "}
                  <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="diag-2">
                    <MermaidDiagram
                      chart={DIAGRAM_2}
                      theme="base"
                      themeVariables={THEME}
                      flowchartHtmlLabels={false}
                    />
                  </div>
                  {"\n"}
                  {"            "}
                </div>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"\n"}
              {"          "}
              <h3 id="s4-3">{"4.3 ベストプラクティス"}</h3>
              {"\n"}
              {"          "}
              <ol>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  <strong>{"本番データや機密を扱う前に"}</strong>
                  {"、プライバシーとセキュリティの公式ページを読む。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>{"最初の1週間は「練習用の安全なデータ」だけで試す。"}</li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"会社で使うなら、"}
                  <strong>{"社内のセキュリティ部門に先に相談"}</strong>
                  {"する(Cursor"}
                  {"\n"}
                  {"              "}
                  {"側にホスト、オンプレ不可という前提も確認事項)。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"          "}
              </ol>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-5">
              {"\n"}
              {"          "}
              <h2 id="sec-5-heading">
                <span className={[styles.num].join(" ")}>{"5"}</span>
                {"Step 1: アプリをインストールする"}
              </h2>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"OS"}</th>
                      <th>{"手順の要点"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{"macOS"}</strong>
                      </td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"Apple silicon / Intel を選び、ディスクイメージから"}
                        {"\n"}
                        {"                    "}
                        <strong>{"Applications"}</strong> {"へドラッグ。初回起動で確認が出たら"}
                        {"\n"}
                        {"                    "}
                        <strong>{"Open"}</strong>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Windows"}</strong>
                      </td>
                      <td>{"x64 / Arm64 を選びインストーラを実行。スタートメニューから起動"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Linux"}</strong>
                      </td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <code>{".deb"}</code>
                        {"(Debian/Ubuntu)、"}
                        <code>{".rpm"}</code>
                        {"(Fedora/RHEL)、AppImage(その他)から選択"}
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <p>{"アーキテクチャの確認コマンド(Linux):"}</p>
              {"\n"}
              {"          "}
              <pre data-testid="code-block">
                <code className={["language-bash", styles.hljs].join(" ")}>
                  <div className={styles.codeLine}>
                    <span className="hljs-comment">
                      {"# x86_64 なら x64、aarch64 なら Arm64 版を選ぶ"}
                    </span>
                    {"\n"}
                    <span className="hljs-built_in">{"uname"}</span> {"-m"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
              <ul>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"配布元:"}
                  {"\n"}
                  {"              "}
                  <a href="https://x.ai/bot" target="_blank" rel="noopener noreferrer">
                    {"x.ai/bot"}
                  </a>
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"自動アップデート対応。手動は"}
                  {"\n"}
                  {"              "}
                  <strong>{"Settings → Updates → Check for Updates"}</strong>
                  {"\n"}
                  {"              "}
                  {"を選び、更新が見つかったら通常は "}
                  <strong>{"Restart to Update"}</strong> {"を選んで適用する。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"Linux の "}
                  <code>{".deb"}</code> {"/"}
                  {"\n"}
                  {"              "}
                  <code>{".rpm"}</code>
                  {"\n"}
                  {"              "}
                  {"版では、更新画面は新しいバージョンの通知のみ。更新はパッケージマネージャー("}
                  <code>{"apt"}</code>
                  {"\n"}
                  {"              "}
                  {"/ "}
                  <code>{"dnf"}</code> {"など)で行う。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"          "}
              </ul>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-6">
              {"\n"}
              {"          "}
              <h2 id="sec-6-heading">
                <span className={[styles.num].join(" ")}>{"6"}</span>
                {"Step 2: サインインする"}
              </h2>
              {"\n"}
              {"          "}
              <ol>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"ウェルカム画面で "}
                  <strong>{"Sign in"}</strong> {"を選ぶ(Grok Bot は Cursor"}
                  {"\n"}
                  {"              "}
                  {"アカウントを使い、専用のログインはない)。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {
                    "開いたブラウザで認証を完了する。Cursor から始めた場合でも、Cursor または Grok が xAI"
                  }
                  {"\n"}
                  {"              "}
                  {"共通のサインインページを開くことがあり、そのページには Grok や xAI"}
                  {"\n"}
                  {"              "}
                  {
                    "のロゴ・名称が表示される場合がある。複数のアカウントを持っている場合は、使うつもりのアカウントを選ぶ。通常は"
                  }
                  {"\n"}
                  {"              "}
                  {"Cursor アカウントで認証する。セルフサーブの Grok Business"}
                  {"\n"}
                  {"              "}
                  {"のシートで使う場合は、ブラウザで"}
                  {"\n"}
                  {"              "}
                  <strong>{"Sign in with Grok"}</strong>{" "}
                  {"を選び、シートを持つ Grok アカウントで認証する。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>{"アプリに戻る。"}</li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"契約経路に応じて、次の手順を行う。"}
                  {"\n"}
                  {"              "}
                  <ul>
                    {"\n"}
                    {"                "}
                    <li>
                      {"\n"}
                      {"                  "}
                      <strong>{"The X Subscription の Premium・Super・Ultra"}</strong>{" "}
                      {"の場合: Grok Bot"}
                      {"\n"}
                      {"                  "}
                      {"が含まれるため、Grok アカウントの連携は不要。"}
                      {"\n"}
                      {"                "}
                    </li>
                    {"\n"}
                    {"                "}
                    <li>
                      {"\n"}
                      {"                  "}
                      <strong>{"SuperGrok"}</strong> {"の場合("}
                      <strong>{"Cursor Enterprise のユーザーは対象外"}</strong>
                      {"。次の Enterprise の手順に従う):"}
                      {"\n"}
                      {"                  "}
                      <ul>
                        {"\n"}
                        {"                    "}
                        <li>
                          {"\n"}
                          {"                      "}
                          {"デスクトップ:"}
                          {"\n"}
                          {"                      "}
                          <strong>{"Settings → Usage & Billing → Get Access with Grok"}</strong>
                          {"\n"}
                          {"                      "}
                          {"を開き、SuperGrok の Grok アカウントでサインインする。"}
                          {"\n"}
                          {"                    "}
                        </li>
                        {"\n"}
                        {"                    "}
                        <li>
                          {"\n"}
                          {"                      "}
                          {"iPhone / Android: アクセス画面で"}
                          {"\n"}
                          {"                      "}
                          <strong>{"Link Grok Account"}</strong> {"を選んで連携し、終わったら"}
                          {"\n"}
                          {"                      "}
                          <strong>{"Finished Linking? Refresh My Status"}</strong> {"を選ぶ。"}
                          {"\n"}
                          {"                    "}
                        </li>
                        {"\n"}
                        {"                  "}
                      </ul>
                      {"\n"}
                      {"                "}
                    </li>
                    {"\n"}
                    {"                "}
                    <li>
                      {"\n"}
                      {"                  "}
                      <strong>{"X Premium+"}</strong> {"の場合:"}
                      {"\n"}
                      {"                  "}
                      <ul>
                        {"\n"}
                        {"                    "}
                        <li>
                          {"\n"}
                          {"                      "}
                          {"デスクトップ:"}
                          {"\n"}
                          {"                      "}
                          <strong>{"Settings → Usage & Billing → Get Access with Grok"}</strong>
                          {"\n"}
                          {"                      "}
                          {"を開き、X Premium+ の Grok アカウントでサインインする。"}
                          {"\n"}
                          {"                    "}
                        </li>
                        {"\n"}
                        {"                    "}
                        <li>
                          {"\n"}
                          {"                      "}
                          {"iPhone / Android: アクセス画面で"}
                          {"\n"}
                          {"                      "}
                          <strong>{"Link Grok Account"}</strong> {"を選んで連携し、終わったら"}
                          {"\n"}
                          {"                      "}
                          <strong>{"Finished Linking? Refresh My Status"}</strong> {"を選ぶ。"}
                          {"\n"}
                          {"                    "}
                        </li>
                        {"\n"}
                        {"                  "}
                      </ul>
                      {"\n"}
                      {"                "}
                    </li>
                    {"\n"}
                    {"                "}
                    <li>
                      {"\n"}
                      {"                  "}
                      <strong>{"Cursor Enterprise"}</strong>{" "}
                      {"の場合: 管理者がチームに対して Grok Bot"}
                      {"\n"}
                      {"                  "}
                      {"を有効化する必要がある。個人の SuperGrok"}
                      {"\n"}
                      {"                  "}
                      {
                        "アカウントは連携しない。利用可否や使用量は、管理者またはアカウント担当者に確認する。"
                      }
                      {"\n"}
                      {"                "}
                    </li>
                    {"\n"}
                    {"                "}
                    <li>
                      {"\n"}
                      {"                  "}
                      <strong>{"セルフサーブの Grok Business"}</strong> {"で、先に Cursor"}
                      {"\n"}
                      {"                  "}
                      {"アカウントで認証してしまった場合: いったんサインアウトし、"}
                      <strong>{"Sign in with Grok"}</strong>
                      {"\n"}
                      {"                  "}
                      {"でシートを持つ Grok アカウントを使って認証し直す。"}
                      {"\n"}
                      {"                "}
                    </li>
                    {"\n"}
                    {"              "}
                  </ul>
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"          "}
              </ol>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                {"初回は短いイントロのあと、裏側でコンピュータのセットアップが走り、"}
                <strong>{"「Grok Bot」という名前の最初の Bot"}</strong>
                {"\n"}
                {"            "}
                {"が作られてチャットが開きます。"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <blockquote>
                {"\n"}
                {"            "}
                <p>{"組織で SSO が必須の場合は、通常の組織サインインを完了してください。"}</p>
                {"\n"}
                {"          "}
              </blockquote>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-7">
              {"\n"}
              {"          "}
              <h2 id="sec-7-heading">
                <span className={[styles.num].join(" ")}>{"7"}</span>
                {"Step 3: 最初の Bot を設定する"}
              </h2>
              {"\n"}
              {"          "}
              <h3 id="s7-1">{"7.1 原則: 1つの Bot に 1つの主な仕事"}</h3>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                {"公式ガイドは「"}
                <strong>{"焦点を絞った Bot のほうが有用な文脈を蓄積する"}</strong>
                {"」と述べています。万能 Bot 1体より、役割別の Bot を勧めています。"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <div className={[styles["diagram-card"]].join(" ")}>
                {"\n"}
                {"            "}
                <div className={[styles["diagram-wrap"]].join(" ")}>
                  {"\n"}
                  {"              "}
                  <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="diag-3">
                    <MermaidDiagram
                      chart={DIAGRAM_3}
                      theme="base"
                      themeVariables={THEME}
                      flowchartHtmlLabels={false}
                    />
                  </div>
                  {"\n"}
                  {"            "}
                </div>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"\n"}
              {"          "}
              <h3 id="s7-2">{"7.2 最初のメッセージの型"}</h3>
              {"\n"}
              {"          "}
              <p>{"最初のメッセージで「役割」「やり方」「禁止事項」「覚えること」を伝えます。"}</p>
              {"\n"}
              {"          "}
              <pre data-testid="code-block">
                <code className={["language-markdown", styles.hljs].join(" ")}>
                  <div className={styles.codeLine}>
                    {"あなたの担当はプロダクトの性能分析です。"}
                    {"\n"}
                    {"監視ツールを使って性能に関する質問を調べてください。"}
                    {"\n"}
                    {"リンクとスクリーンショットを残し、「証拠」と「仮説」を分けて書き、"}
                    {"\n"}
                    {"影響が最大の問題から先に報告してください。"}
                    {"\n"}
                    {"本番設定は絶対に変更しないでください。"}
                    {"\n"}
                    {"これを今後の作業のために覚えておいてください。"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
              <blockquote>
                {"\n"}
                {"            "}
                <p>{"上記は公式ガイドの例を日本語に意訳したものです。"}</p>
                {"\n"}
                {"          "}
              </blockquote>
              {"\n"}
              {"          "}
              <h3 id="s7-3">{"7.3 Bot を増やすタイミング"}</h3>
              {"\n"}
              {"          "}
              <ul>
                {"\n"}
                {"            "}
                <li>
                  {"仕事の種類が"}
                  <strong>{"自然に分かれた"}</strong>
                  {"とき(例: 分析 / 調査 / 資料)。"}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"追加はサイドバーの "}
                  <strong>{"+"}</strong>
                  {"(または"}
                  {"\n"}
                  {"              "}
                  <strong>{"New Bot"}</strong>
                  {")から。チームのユーザーはメニューから"}
                  {"\n"}
                  {"              "}
                  <strong>{"Create a Bot"}</strong> {"を選ぶ。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"Cursor チームでチームメイトと共有したい場合は、サイドバーの"}
                  {"\n"}
                  {"              "}
                  <strong>{"+ → Create a Bot"}</strong>{" "}
                  {"で Bot を作り、チャットの Bot 名メニューにある"}
                  {"\n"}
                  {"              "}
                  <strong>{"Share"}</strong> {"からチームに共有します。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"          "}
              </ul>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-8">
              {"\n"}
              {"          "}
              <h2 id="sec-8-heading">
                <span className={[styles.num].join(" ")}>{"8"}</span>
                {"Step 4: 良い依頼の書き方(5要素)"}
              </h2>
              {"\n"}
              {"          "}
              <h3 id="s8-1">{"8.1 5要素テンプレート"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"#"}</th>
                      <th>{"要素"}</th>
                      <th>{"問い"}</th>
                      <th>{"例"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"1"}</td>
                      <td>
                        <strong>{"Outcome(成果)"}</strong>
                      </td>
                      <td>{"何が完了していればよいか"}</td>
                      <td>{"「先週の新規ユーザー活性化率を過去4週と比較」"}</td>
                    </tr>
                    <tr>
                      <td>{"2"}</td>
                      <td>
                        <strong>{"Sources(情報源)"}</strong>
                      </td>
                      <td>{"どのアプリ/サイト/ファイルを見るか"}</td>
                      <td>{"「分析ダッシュボード」"}</td>
                    </tr>
                    <tr>
                      <td>{"3"}</td>
                      <td>
                        <strong>{"Constraints(制約)"}</strong>
                      </td>
                      <td>{"やってはいけないこと、事前確認すること"}</td>
                      <td>{"「ダッシュボードは変更しない」"}</td>
                    </tr>
                    <tr>
                      <td>{"4"}</td>
                      <td>
                        <strong>{"Deliverable(成果物)"}</strong>
                      </td>
                      <td>{"何を返すか"}</td>
                      <td>{"「最大変化のステップと調査計画案」"}</td>
                    </tr>
                    <tr>
                      <td>{"5"}</td>
                      <td>
                        <strong>{"Review point(確認点)"}</strong>
                      </td>
                      <td>{"どこで止まってあなたに見せるか"}</td>
                      <td>{"「計画案の時点で一度止まる」"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <h3 id="s8-2">{"8.2 5分でできる最初の練習(ログイン不要)"}</h3>
              {"\n"}
              {"          "}
              <p>{"文書を1つ添付して、次のように依頼します(公式例の意訳)。"}</p>
              {"\n"}
              {"          "}
              <pre data-testid="code-block">
                <code className={["language-markdown", styles.hljs].join(" ")}>
                  <div className={styles.codeLine}>
                    {"この文書を5つの箇条書きで要約してください。"}
                    {"\n"}
                    {"日付・決定事項・未解決の質問は、別セクションにすべて列挙してください。"}
                    {"\n"}
                    {"各項目にページまたはセクションを引用元として付けてください。"}
                    {"\n"}
                    {"元ファイルは変更しないでください。"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
              <h3 id="s8-3">{"8.3 ツールを使う2つ目の練習"}</h3>
              {"\n"}
              {"          "}
              <pre data-testid="code-block">
                <code className={["language-markdown", styles.hljs].join(" ")}>
                  <div className={styles.codeLine}>
                    {"分析ダッシュボードを開き、今週の新規ユーザー活性化率を"}
                    {"\n"}
                    {"過去4週と比較してください。"}
                    {"\n"}
                    {"最も変化が大きいステップを特定し、"}
                    {"\n"}
                    {"関連するグラフへのリンク付きで簡単な調査計画案を作ってください。"}
                    {"\n"}
                    {"ダッシュボードは一切変更しないでください。"}
                    {"\n"}
                    {"必要ならログインを私に依頼してください。"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
              <h3 id="s8-4">{"8.4 悪い依頼と良い依頼"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"悪い例"}</th>
                      <th>{"問題"}</th>
                      <th>{"良い例"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"「売上を見といて」"}</td>
                      <td>{"成果・範囲・形式が不明"}</td>
                      <td>
                        {"「先月の売上を地域別に集計し、前年同月比を表で。数値の出典リンク付き」"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"「メール返しといて」"}</td>
                      <td>{"送信までやってしまう恐れ"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"「返信"}
                        <strong>{"案"}</strong>
                        {"を3パターン作成。"}
                        <strong>{"送信しない"}</strong>
                        {"。承認を求める」"}
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"「いい感じに整理して」"}</td>
                      <td>{"基準がない"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"「ファイル名を "}
                        <code>{"YYYY-MM-DD_内容"}</code> {"に統一。リネーム前に一覧で確認を」"}
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <h3 id="s8-5">{"8.5 音声入力"}</h3>
              {"\n"}
              {"          "}
              <ul>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"デスクトップは "}
                  <code>{"Cmd/Ctrl+D"}</code> {"で音声入力、"}
                  <strong>{"Start voice chat"}</strong>
                  {"\n"}
                  {"              "}
                  {"でライブ会話。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"モバイルは "}
                  <strong>{"Start dictation"}</strong>
                  {"。"}
                </li>
                {"\n"}
                {"          "}
              </ul>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-9">
              {"\n"}
              {"          "}
              <h2 id="sec-9-heading">
                <span className={[styles.num].join(" ")}>{"9"}</span>
                {"Step 5: ログインは自分で行う(Take over)"}
              </h2>
              {"\n"}
              {"          "}
              <h3 id="s9-1">{"9.1 なぜ引き継ぐのか"}</h3>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                {"Bot"}
                {"\n"}
                {"            "}
                {"がログインを必要とするアプリに到達すると、まず安全な方法で処理しようとします。"}
                <strong>{"個人 Bot"}</strong>
                {"\n"}
                {"            "}
                {"は"}
                {"\n"}
                {"            "}
                <strong>
                  {
                    "Vault、接続済みのパスワードマネージャ、または安全なシークレット入力フォーム(Secure"
                  }
                  {"\n"}
                  {"              "}
                  {"Form)"}
                </strong>
                {"\n"}
                {"            "}
                {"を使います。"}
                <strong>{"Shared Bot では、メンバー個人の Vault は使いません"}</strong>
                {"(公式の"}
                {"\n"}
                {"            "}
                {"Vault ページは「Vault は Shared Bot では非対応」とし、キーは Shared Bot の"}
                {"\n"}
                {"            "}
                <strong>{"Secrets"}</strong>
                {"\n"}
                {"            "}
                {
                  "に追加するよう案内しています)。代わりに、接続済みのパスワードマネージャまたは Secure"
                }
                {"\n"}
                {"            "}
                {"Form で処理します。ただし"}
                {"\n"}
                {"            "}
                <strong>{"v0.78.1"}</strong>
                {"(2026年10月27日リリース。チーム向けの変更)の changelog"}
                {"\n"}
                {"            "}
                {"では、"}
                <strong>{"Manager"}</strong> {"が "}
                <strong>{"Configure → Tools"}</strong> {"から"}
                {"\n"}
                {"            "}
                <strong>{"Team Bot 専用の Vault"}</strong> {"にログインを追加でき、Bot"}
                {"\n"}
                {"            "}
                {
                  "はそのログインでチームとしてサインインできるとされています。同じリリースで管理画面の名称が「Shared"
                }
                {"\n"}
                {"            "}
                {"Bots」に変わっているため、ここでの Team Bot はチームで共有する Bot(Shared"}
                {"\n"}
                {"            "}
                {"Bot)と同じ範囲とみられます。この機能は"}
                {"\n"}
                {"            "}
                <strong>{"アプリ v0.78.1 以降"}</strong>
                {
                  "が必要で、段階的に配信(rollout)されているため、すべてのチームですぐ使えるとは限りません。Vault"
                }
                {"\n"}
                {"            "}
                {
                  "のドキュメントはまだこの変更を反映していないため、利用前にアプリのバージョンと Configure"
                }
                {"\n"}
                {"            "}
                {"画面で確認してください。Shared Bot"}
                {"\n"}
                {"            "}
                {"が"}
                <strong>{"応答しているメンバー本人の個人アカウント"}</strong>
                {"を使う場合は、"}
                <strong>{"使う前にそのメンバーへ確認を求めます"}</strong>
                {"。オーナーまたは"}
                {"\n"}
                {"            "}
                {"Manager が Shared Bot"}
                {"\n"}
                {"            "}
                {
                  "に追加したアプリやシークレットを使う場合は、この確認は求められません。SSO・パスキー・CAPTCHA"
                }
                {"\n"}
                {"            "}
                {"など、フォームでは扱えない手順がある場合にだけ、"}
                <strong>{"あなたにコンピュータ操作を引き継ぐ(Take over)よう依頼"}</strong>
                {
                  "します。引き継いだときは、パスワード・パスキー・2要素コード・CAPTCHA・決済確認などの機密情報や確認事項を"
                }
                <strong>{"自分で"}</strong>
                {"入力します。"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <div className={[styles["diagram-card"]].join(" ")}>
                {"\n"}
                {"            "}
                <div className={[styles["diagram-wrap"]].join(" ")}>
                  {"\n"}
                  {"              "}
                  <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="diag-4">
                    <MermaidDiagram
                      chart={DIAGRAM_4}
                      theme="base"
                      themeVariables={THEME}
                      flowchartHtmlLabels={false}
                    />
                  </div>
                  {"\n"}
                  {"            "}
                </div>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"\n"}
              {"          "}
              <blockquote>
                {"\n"}
                {"            "}
                <p>
                  {"\n"}
                  {"              "}
                  <strong>{"Shared Bot のセッション保存先"}</strong>
                  {": Slack の DM"}
                  {"\n"}
                  {"              "}
                  {"では通常そのメンバーのコンピュータ、Slack のチャンネル・スレッド・グループ"}
                  {"\n"}
                  {"              "}
                  {"DM・グループチャットでは Shared Bot"}
                  {"\n"}
                  {"              "}
                  {
                    "のコンピュータにセッションが残ります。プライバシー設定によって別のコンピュータが選ばれる場合もあるため、常に共有PCに残るとは限りません。"
                  }
                  {"\n"}
                  {"            "}
                </p>
                {"\n"}
                {"          "}
              </blockquote>
              {"\n"}
              {"          "}
              <h3 id="s9-2">{"9.2 守ること"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"やる"}</th>
                      <th>{"やらない"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{"Take over"}</strong> {"で自分が入力する"}
                      </td>
                      <td>{"チャットにパスワードやワンタイムコードを書く"}</td>
                    </tr>
                    <tr>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"Bot"}
                        {"\n"}
                        {"                    "}
                        {"が出す"}
                        <strong>{"安全なシークレット入力フォーム"}</strong>
                        {"に入力する(値はマスクされ、トランスクリプトとモデルから除外)"}
                        {"\n"}
                        {"                  "}
                      </td>
                      <td>{"Bot を汎用のパスワードマネージャとして使う"}</td>
                    </tr>
                    <tr>
                      <td>
                        {"不要になったらサービスから"}
                        <strong>{"サインアウト"}</strong>
                      </td>
                      <td>{"ログインしたまま放置する"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <h3 id="s9-3">{"9.3 ハードウェアセキュリティキー"}</h3>
              {"\n"}
              {"          "}
              <ul>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"YubiKey などは、"}
                  <strong>{"Settings → General → Security Key"}</strong> {"の"}
                  {"\n"}
                  {"              "}
                  <strong>{"Use hardware security keys"}</strong>{" "}
                  {"が有効なら、デスクトップに挿したキーを Bot"}
                  {"\n"}
                  {"              "}
                  {"のブラウザで使えます。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {
                    "macOS / Windows ではデフォルトでオン、Linux は未対応、使用のたびに承認が必要です。"
                  }
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"          "}
              </ul>
              {"\n"}
              {"          "}
              <blockquote>
                {"\n"}
                {"            "}
                <p>
                  {"\n"}
                  {"              "}
                  <strong>{"注意"}</strong>
                  {": ログイン済みのセッションは共有コンピュータに残り、"}
                  <strong>{"他の Bot も使える"}</strong>
                  {"可能性があります(14章)。"}
                  {"\n"}
                  {"            "}
                </p>
                {"\n"}
                {"          "}
              </blockquote>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-10">
              {"\n"}
              {"          "}
              <h2 id="sec-10-heading">
                <span className={[styles.num].join(" ")}>{"10"}</span>
                {"Step 6: 結果をレビューして育てる"}
              </h2>
              {"\n"}
              {"          "}
              <h3 id="s10-1">{"10.1 レビューの観点"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"観点"}</th>
                      <th>{"確認すること"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"正確性"}</td>
                      <td>
                        {"数値・日付に"}
                        <strong>{"出典リンク"}</strong>
                        {"があるか"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"範囲"}</td>
                      <td>{"頼んでいないことまでやっていないか"}</td>
                    </tr>
                    <tr>
                      <td>{"形式"}</td>
                      <td>{"指定したフォーマットか"}</td>
                    </tr>
                    <tr>
                      <td>{"停止位置"}</td>
                      <td>{"承認ポイントで止まったか"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <h3 id="s10-2">{"10.2 「恒久的な好み」は明示して覚えさせる"}</h3>
              {"\n"}
              {"          "}
              <pre data-testid="code-block">
                <code className={["language-markdown", styles.hljs].join(" ")}>
                  <div className={styles.codeLine}>
                    {"今後の週次レポートはこの形式にしてください:"}
                    {"\n"}
                    {"箇条書き5つ、出典リンクは本文中にインライン、"}
                    {"\n"}
                    {"最後に「要判断事項」というセクションを付ける。"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
              <ul>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"一回限りの修正と、今後も守ってほしい好みを"}
                  <strong>{"区別して言葉にする"}</strong>
                  {"のがコツです。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"手順が安定したら、"}
                  <strong>{"Skill 化"}</strong>
                  {"または"}
                  {"\n"}
                  {"              "}
                  <strong>{"Routine 化"}</strong>
                  {"します(次章)。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"          "}
              </ul>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-11">
              {"\n"}
              {"          "}
              <h2 id="sec-11-heading">
                <span className={[styles.num].join(" ")}>{"11"}</span>
                {"Step 7: Skill 化 → Routine 化"}
              </h2>
              {"\n"}
              {"          "}
              <h3 id="s11-1">{"11.1 自動化の正しい順番"}</h3>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                {"公式ドキュメントの原則は「"}
                <strong>
                  {"まず一回限りのタスクで始め、信頼できるようにし、手順を Skill"}
                  {"\n"}
                  {"              "}
                  {"として保存し、それから自動化する"}
                </strong>
                {"」です。"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <div className={[styles["diagram-card"]].join(" ")}>
                {"\n"}
                {"            "}
                <div className={[styles["diagram-wrap"]].join(" ")}>
                  {"\n"}
                  {"              "}
                  <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="diag-5">
                    <MermaidDiagram
                      chart={DIAGRAM_5}
                      theme="base"
                      themeVariables={THEME}
                      flowchartHtmlLabels={false}
                    />
                  </div>
                  {"\n"}
                  {"            "}
                </div>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"\n"}
              {"          "}
              <h3 id="s11-2">{"11.2 良い Skill に書くこと(6項目)"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"#"}</th>
                      <th>{"項目"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"1"}</td>
                      <td>{"いつ使うか"}</td>
                    </tr>
                    <tr>
                      <td>{"2"}</td>
                      <td>{"必要な入力とアクセス"}</td>
                    </tr>
                    <tr>
                      <td>{"3"}</td>
                      <td>{"作業の順序"}</td>
                    </tr>
                    <tr>
                      <td>{"4"}</td>
                      <td>{"結果の検証方法"}</td>
                    </tr>
                    <tr>
                      <td>{"5"}</td>
                      <td>{"返すもの"}</td>
                    </tr>
                    <tr>
                      <td>{"6"}</td>
                      <td>{"承認が必要なこと"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <p>{"Skill 保存の依頼例(公式例の意訳):"}</p>
              {"\n"}
              {"          "}
              <pre data-testid="code-block">
                <code className={["language-markdown", styles.hljs].join(" ")}>
                  <div className={styles.codeLine}>
                    {"いまの手順を「Weekly account health」という Skill として保存してください。"}
                    {"\n"}
                    {"参照するシステム、リスクの定義、出力形式、"}
                    {"\n"}
                    {"そして「顧客への連絡は必ず承認が必要」というルールを含めてください。"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
              <ul>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"保存済み Skill は、依頼文の中で"}
                  {"\n"}
                  {"              "}
                  <strong>{"Skill 名を指定する"}</strong>
                  {"と呼び出せます("}
                  <code>{"/"}</code>
                  {"\n"}
                  {"              "}
                  {"メニューは対応しているインターフェースでのみ使えます)。"}
                  <code>{"@"}</code> {"で"}
                  {"\n"}
                  {"              "}
                  {"Bot・グループ・Routine・アプリを参照できます。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"Skill は"}
                  <strong>{"全 Bot で共有されるライブラリ"}</strong>
                  {"ですが、Bot"}
                  {"\n"}
                  {"              "}
                  {"にそのアプリやログインがないと使えない場合があります。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"現在の Bot で Private Skill が表示されない場合は、"}
                  <strong>{"Connect apps"}</strong>
                  {"\n"}
                  {"              "}
                  {"を開き、接続済みの項目から "}
                  <strong>{"Private skills"}</strong> {"を有効にします。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"提供されている場合、"}
                  <strong>{"Teach a task"}</strong> {"でブラウザ操作を一度やって見せて"}
                  {"\n"}
                  {"              "}
                  {
                    "Skill を作れます(最大10分間の画面操作を記録。マイク音声は記録しない)。作られた Skill"
                  }
                  {"\n"}
                  {"              "}
                  {"は"}
                  <strong>{"下書き"}</strong>
                  {"なので、判断ルール・失敗時の扱い・承認境界を必ず追記してください。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"          "}
              </ul>
              {"\n"}
              {"          "}
              <h3 id="s11-3">{"11.3 Routine の作り方"}</h3>
              {"\n"}
              {"          "}
              <p>{"Routine を所有させたい Bot に頼みます(公式例の意訳)。"}</p>
              {"\n"}
              {"          "}
              <pre data-testid="code-block">
                <code className={["language-markdown", styles.hljs].join(" ")}>
                  <div className={styles.codeLine}>
                    {"平日の毎朝8時に、現在のアカウント一覧に対して"}
                    {"\n"}
                    {"「Daily customer-risk」Skill を実行してください。"}
                    {"\n"}
                    {"リンク付きのウォッチリストをこの会話に投稿してください。"}
                    {"\n"}
                    {"顧客には連絡しないでください。"}
                    {"\n"}
                    {"元データが取得できない場合は、古いデータを使わず失敗を報告してください。"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                <strong>{"必ず確認する6点"}</strong>
                {": 所有 Bot / スケジュールとタイムゾーン / 入力元 /"}
                {"\n"}
                {"            "}
                {"期待する結果 / 承認境界 / ソース欠落時の動作"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <h3 id="s11-4">{"11.4 Routine の制限(公式記載)"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"項目"}</th>
                      <th>{"内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"1 Bot あたりの Routine 数"}</td>
                      <td>{"最大 50"}</td>
                    </tr>
                    <tr>
                      <td>{"実行記録"}</td>
                      <td>{"Routine ごとに直近 20 件"}</td>
                    </tr>
                    <tr>
                      <td>{"スケジュール間隔"}</td>
                      <td>{"最短 5 分"}</td>
                    </tr>
                    <tr>
                      <td>{"削除"}</td>
                      <td>{"即時・元に戻せない。Bot を削除するとその Bot の Routine も消える"}</td>
                    </tr>
                    <tr>
                      <td>{"長期不在"}</td>
                      <td>{"応答がなければ Routine が一時停止されることがある"}</td>
                    </tr>
                    <tr>
                      <td>{"1時間あたりの実行数"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"全 Routine 合計で 300 回、Routine ごとに 200"}
                        {"\n"}
                        {"                    "}
                        {"回まで。超過分の実行は失敗し、"}
                        <strong>{"自動では再試行されない"}</strong>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <h3 id="s11-5">{"11.5 イベントトリガー"}</h3>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                {"Slack のメッセージや GitHub の通知をきっかけに Routine を動かせます(Cursor"}
                {"\n"}
                {"            "}
                {"アカウントの連携。Slack/GitHub アプリとは別の接続が必要な場合あり)。"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <pre data-testid="code-block">
                <code className={["language-markdown", styles.hljs].join(" ")}>
                  <div className={styles.codeLine}>
                    <span className="hljs-section">
                      {"#customer-escalations チャンネルに、サポートチケットへのリンクと"}
                    </span>
                    {"\n"}
                    {"「needs repro」という語を含むメッセージが来たら、"}
                    {"\n"}
                    {"チケットを開き、ステージング環境で再現し、"}
                    {"\n"}
                    {"再現パックをこの会話に投稿してください。"}
                    {"\n"}
                    {"承認なしに Slack へ投稿し返すことは絶対にしないでください。"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
              <blockquote>
                {"\n"}
                {"            "}
                <p>
                  {"\n"}
                  {"              "}
                  <strong>{"「新着メッセージすべて」のような広すぎるトリガーは避ける"}</strong>
                  {"。ノイズが増え、使用量を消費し、無関係な入力に反応するリスクが上がります。"}
                  {"\n"}
                  {"            "}
                </p>
                {"\n"}
                {"          "}
              </blockquote>
              {"\n"}
              {"          "}
              <h3 id="s11-6">{"11.6 Test の注意点"}</h3>
              {"\n"}
              {"          "}
              <blockquote>
                {"\n"}
                {"            "}
                <p>
                  {"\n"}
                  {"              "}
                  <strong>{"Test 実行は本物の作業を行います"}</strong>
                  {
                    "(Webサイトの操作、ファイル変更、連携ツールの呼び出し)。安全な入力を使い、書き込み系は承認の後ろに置いてください。"
                  }
                  {"\n"}
                  {"            "}
                </p>
                {"\n"}
                {"          "}
              </blockquote>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                {
                  "第三者のレビュー記事(eesel)も「ドライランモードはなく、テストは実行そのもの」と指摘しています。"
                }
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <h3 id="s11-7">{"11.7 信頼できる Routine の設計7原則"}</h3>
              {"\n"}
              {"          "}
              <ol>
                {"\n"}
                {"            "}
                <li>
                  {"実行より"}
                  <strong>{"準備を自動化"}</strong>
                  {"する"}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"まず"}
                  <strong>{"下書き・突合・推奨"}</strong>
                  {"を作らせる"}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"送信・購入・削除・公開・本番変更は"}
                  <strong>{"承認必須"}</strong>
                </li>
                {"\n"}
                {"            "}
                <li>
                  <strong>{"データなし/古いデータ"}</strong>
                  {"のときの方針を書く"}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"リトライは"}
                  <strong>{"冪等"}</strong>
                  {"に(二重実行しても安全に)"}
                </li>
                {"\n"}
                {"            "}
                <li>
                  <strong>{"部分完了"}</strong>
                  {"の報告先を指定する"}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"Webサイトやデータ形式が変わったら"}
                  <strong>{"再テスト"}</strong>
                </li>
                {"\n"}
                {"          "}
              </ol>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-12">
              {"\n"}
              {"          "}
              <h2 id="sec-12-heading">
                <span className={[styles.num].join(" ")}>{"12"}</span>
                {"Step 8: X から @bot でタスクを渡す"}
              </h2>
              {"\n"}
              {"          "}
              <h3 id="s12-1">{"12.1 何ができるか"}</h3>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                {"X の投稿やリプライで"}
                {"\n"}
                {"            "}
                <a href="https://x.com/bot" target="_blank" rel="noopener noreferrer">
                  {"@bot"}
                </a>
                {"\n"}
                {"            "}
                {"をタグ付けすると、その投稿を"}
                <strong>{"あなたの Grok Bot へのタスク"}</strong>
                {"として渡せます。"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <pre data-testid="code-block">
                <code className={["language-markdown", styles.hljs].join(" ")}>
                  <div className={styles.codeLine}>
                    {"@bot このスレッドを要約して、要点を私の Slack に送って"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
              <ul>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"@bot は X 上では"}
                  <strong>{"短い受領返信のみ"}</strong>
                  {"。実際の作業と結果は Grok Bot"}
                  {"\n"}
                  {"              "}
                  {"アプリの Bot の会話に残ります。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"Bot"}
                  {"\n"}
                  {"              "}
                  {
                    "が受け取るのは、あなたの投稿・返信先の投稿・それらが引用する投稿(静止画を含む)です。"
                  }
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"初回は、タグ付き依頼が"}
                  <strong>{"自動で作業を開始し、Grok Bot の使用量を消費する"}</strong>
                  {"旨の通知が X から届きます。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"          "}
              </ul>
              {"\n"}
              {"          "}
              <div className={[styles["diagram-card"]].join(" ")}>
                {"\n"}
                {"            "}
                <div className={[styles["diagram-wrap"]].join(" ")}>
                  {"\n"}
                  {"              "}
                  <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="diag-6">
                    <MermaidDiagram
                      chart={DIAGRAM_6}
                      theme="base"
                      themeVariables={THEME}
                      flowchartHtmlLabels={false}
                    />
                  </div>
                  {"\n"}
                  {"            "}
                </div>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"\n"}
              {"          "}
              <h3 id="s12-2">{"12.2 前提条件"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"条件"}</th>
                      <th>{"内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"Grok アカウントと X の連携"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"grok.com の "}
                        <strong>{"Settings → Account"}</strong> {"で "}
                        <strong>{"𝕏 Account"}</strong> {"を"}
                        {"\n"}
                        {"                    "}
                        {"Connect"}
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Grok Bot の利用権"}</td>
                      <td>{"同じ Grok アカウントで有効"}</td>
                    </tr>
                    <tr>
                      <td>{"自分の Bot"}</td>
                      <td>
                        <strong>{"少なくとも1体"}</strong>
                        {"(共有された Bot ではタグ依頼を受けられない)"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"地域"}</td>
                      <td>{"X に登録された国が対象地域であること"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <h3 id="s12-3">{"12.3 利用できない地域(公式記載)"}</h3>
              {"\n"}
              {"          "}
              <ul>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"オーストラリア、英国、EU、アイスランド、リヒテンシュタイン、ノルウェーの X"}
                  {"\n"}
                  {"              "}
                  {"アカウントでは"}
                  <strong>{"現時点で未対応"}</strong>
                  {"。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"判定は X に登録されている国で行われ、"}
                  <strong>{"現在地や VPN は無関係"}</strong>
                  {"です。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>{"国が広域(例: South Asia)や未設定の場合も未対応です。"}</li>
                {"\n"}
                {"          "}
              </ul>
              {"\n"}
              {"          "}
              <h3 id="s12-4">{"12.4 セキュリティ上の注意"}</h3>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                {"X の投稿は"}
                <strong>{"第三者が書いた信頼できない入力"}</strong>
                {"です。@bot"}
                {"\n"}
                {"            "}
                {
                  "で渡す投稿やスレッドには、プロンプトインジェクション(隠れた指示)が含まれる可能性があります。"
                }
                <strong>{"外部送信を伴う指示(Slack送信など)は承認境界を必ず設定"}</strong>
                {"してください(13〜14章)。"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-13">
              {"\n"}
              {"          "}
              <h2 id="sec-13-heading">
                <span className={[styles.num].join(" ")}>{"13"}</span>
                {"承認(Approvals)と Auto Review の設計"}
              </h2>
              {"\n"}
              {"          "}
              <h3 id="s13-1">{"13.1 まず「依頼文の中の境界」が最強"}</h3>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                {"公式ドキュメントは「"}
                <strong>{"最も強い境界は依頼そのものの中にある"}</strong>
                {"」としています。"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <pre data-testid="code-block">
                <code className={["language-markdown", styles.hljs].join(" ")}>
                  <div className={styles.codeLine}>
                    {"キャンペーンデータを突合し、予算変更の推奨案を作成してください。"}
                    {"\n"}
                    {"キャンペーンの変更や代理店へのメッセージ送信はしないでください。"}
                    {"\n"}
                    {"現在値・提案値・想定インパクトを示したうえで承認を求めてください。"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
              <p>
                <strong>{"明示的な境界を置くべき操作"}</strong>
              </p>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"操作"}</th>
                      <th>{"例"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"メッセージ・招待の送信"}</td>
                      <td>{"メール、Slack、カレンダー招待"}</td>
                    </tr>
                    <tr>
                      <td>{"コンテンツの公開"}</td>
                      <td>{"ブログ、SNS投稿"}</td>
                    </tr>
                    <tr>
                      <td>{"購入・資金移動"}</td>
                      <td>{"決済、送金"}</td>
                    </tr>
                    <tr>
                      <td>{"削除・上書き"}</td>
                      <td>{"ファイル、データ"}</td>
                    </tr>
                    <tr>
                      <td>{"権限変更"}</td>
                      <td>{"共有設定、ロール"}</td>
                    </tr>
                    <tr>
                      <td>{"本番変更"}</td>
                      <td>{"設定、デプロイ"}</td>
                    </tr>
                    <tr>
                      <td>{"法的条件への同意"}</td>
                      <td>{"利用規約、契約"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <h3 id="s13-2">{"13.2 承認カードの読み方"}</h3>
              {"\n"}
              {"          "}
              <p>
                {"承認が必要になると、会話に"}
                <strong>{"提案された操作とその入力"}</strong>
                {"が表示されます。"}
              </p>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                {"表示されるボタンは"}
                <strong>{"操作やカードによって異なり"}</strong>
                {"、次の 3"}
                {"\n"}
                {"            "}
                {"つが常にそろうわけではありません。カードによっては"}
                {"\n"}
                {"            "}
                <strong>{"Allow"}</strong>
                {"・"}
                <strong>{"Skip"}</strong>
                {"・"}
                <strong>{"Not now"}</strong>
                {"\n"}
                {"            "}
                {"などのラベルで表示されます。"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"ボタンの例"}</th>
                      <th>{"動作"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{"Allow once"}</strong> {"/ "}
                        <strong>{"Allow"}</strong>
                      </td>
                      <td>{"その操作だけ続行"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Always allow"}</strong>
                      </td>
                      <td>
                        {"一致するルールを保存(カードがルールを提案している場合のみ表示。慎重に)"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Deny"}</strong> {"/ "}
                        <strong>{"Skip"}</strong> {"/ "}
                        <strong>{"Not now"}</strong>
                      </td>
                      <td>{"その操作を実行しない"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <p>
                <strong>{"Shared Bot の承認権限"}</strong>
                {": 承認できる人は場所によって限られます。"}
              </p>
              {"\n"}
              {"          "}
              <ul>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  <strong>{"Slack のスレッド"}</strong>
                  {": カードには"}
                  {"\n"}
                  {"              "}
                  <strong>{"Allow once"}</strong>
                  {"・"}
                  <strong>{"Deny"}</strong>
                  {"・"}
                  <strong>{"View details"}</strong>
                  {"\n"}
                  {"              "}
                  {"が表示され、操作できるのは"}
                  <strong>{"依頼した本人だけ"}</strong>
                  {"です。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  <strong>{"グループチャット"}</strong>
                  {": 承認できるのは、"}
                  <strong>{"Bot が応答している対象メッセージの投稿者だけ"}</strong>
                  {"です。"}
                  <strong>{"Always allow"}</strong> {"は表示されません。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"どちらの場合も、"}
                  <strong>{"ほかの参加者は承認できません"}</strong>
                  {"(カードが誰の回答待ちかだけが表示されます)。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"          "}
              </ul>
              {"\n"}
              {"          "}
              <p>{"重要な性質:"}</p>
              {"\n"}
              {"          "}
              <ul>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  <strong>
                    {
                      "承認は「提案された操作」を制御するもので、すでに完了した作業を元に戻すものではありません。"
                    }
                  </strong>
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  <strong>{"対象や効果を特定できない操作は承認しない"}</strong>
                  {"。平易な言葉で説明させるか、下書きを先に作らせる。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"承認カードの期限は"}
                  <strong>{"作業を起こしたきっかけ"}</strong>
                  {"で決まります。チャットのメッセージから始まった作業のカードは、この"}
                  {"\n"}
                  {"              "}
                  {"30"}
                  {"\n"}
                  {"              "}
                  {
                    "分のタイマーでは期限切れになりません。一方、Routine・受信メッセージ・その他のバックグラウンド処理が作成したカードは"
                  }
                  <strong>{"30分で期限切れ"}</strong>
                  {"になり、操作は実行されません。再実行は"}
                  {"\n"}
                  {"              "}
                  {"Bot に依頼し直します。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"          "}
              </ul>
              {"\n"}
              {"          "}
              <h3 id="s13-3">{"13.3 Auto Review の設定"}</h3>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                {"ルールの追加場所はプラットフォームで異なります。デスクトップは"}
                {"\n"}
                {"            "}
                <strong>{"Settings → General"}</strong> {"の "}
                <strong>{"Bot"}</strong> {"セクションにある"}
                {"\n"}
                {"            "}
                <strong>{"Auto-review"}</strong>
                {"、iPhone と Android は"}
                {"\n"}
                {"            "}
                <strong>{"Settings → Bot"}</strong> {"から設定します。"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <div className={[styles["diagram-card"]].join(" ")}>
                {"\n"}
                {"            "}
                <div className={[styles["diagram-wrap"]].join(" ")}>
                  {"\n"}
                  {"              "}
                  <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="diag-7">
                    <MermaidDiagram
                      chart={DIAGRAM_7}
                      theme="base"
                      themeVariables={THEME}
                      flowchartHtmlLabels={false}
                    />
                  </div>
                  {"\n"}
                  {"            "}
                </div>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"ルール種別"}</th>
                      <th>{"動作"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{"Ask first"}</strong>
                      </td>
                      <td>
                        {"一致する操作は"}
                        <strong>{"常に"}</strong>
                        {"あなたの確認で止まる"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Allow automatically"}</strong>
                      </td>
                      <td>{"一致し、かつ自動レビューが他の停止理由を見つけない場合のみ通過"}</td>
                    </tr>
                    <tr>
                      <td>{"両方に一致"}</td>
                      <td>
                        <strong>{"Ask first が優先"}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                {"チーム管理者が Auto Review"}
                {"\n"}
                {"            "}
                {"を強制している場合、編集不可の"}
                <strong>{"チームルール"}</strong>
                {"も表示されます。個人ルールは"}
                <strong>{"その上に重なり、より厳しくする方向にのみ"}</strong>
                {"働きます。"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <h3 id="s13-4">{"13.4 ルールの書き方"}</h3>
              {"\n"}
              {"          "}
              <p>
                <strong>{"狭く、対象とスコープを限定する"}</strong>
                {"(公式の例):"}
              </p>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"良いルール"}</th>
                      <th>{"理由"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"外部メールを送る前に必ず確認(Ask first)"}</td>
                      <td>{"外部送信は取り消せない"}</td>
                    </tr>
                    <tr>
                      <td>{"本番ダッシュボードを変更する前に確認(Ask first)"}</td>
                      <td>{"影響が大きい"}</td>
                    </tr>
                    <tr>
                      <td>
                        {"\n"}
                        {"                    "}
                        <code>{"/workspace/reports"}</code> {"で"}
                        {"\n"}
                        {"                    "}
                        <code>{"git status"}</code> {"を実行する場合は自動許可"}
                        {"\n"}
                        {"                  "}
                      </td>
                      <td>{"対象・コマンドが明確で読み取り中心"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                <strong>{"避けるべき広いルール"}</strong>
                {":"}
                {"\n"}
                {"            "}
                {
                  "「ブラウザ内のことはすべて許可」。Webサイトやツールの挙動は時間とともに変わるためです。"
                }
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <blockquote>
                {"\n"}
                {"            "}
                <p>
                  {"\n"}
                  {"              "}
                  {"Auto Review"}
                  {"\n"}
                  {"              "}
                  {"は"}
                  <strong>{"モデルによる判断"}</strong>
                  {"です。最小権限と明示的な承認境界を"}
                  <strong>{"置き換えるものではなく補完するもの"}</strong>
                  {"と公式も位置づけています。第三者の分析(howtoharden,"}
                  {"\n"}
                  {"              "}
                  {"eesel)は、承認がユーザーの自由記述に依存する点・自動レビューが全副作用(例:"}
                  {"\n"}
                  {"              "}
                  {"メモリ書き込み)を審査しない点を指摘しています。"}
                  {"\n"}
                  {"            "}
                </p>
                {"\n"}
                {"          "}
              </blockquote>
              {"\n"}
              {"          "}
              <h3 id="s13-5">{"13.5 ローカルPCへのアクセス"}</h3>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                {"クラウド上の共有コンピュータとは"}
                <strong>{"別の能力"}</strong>
                {"として、手元の Mac/Windows"}
                {"\n"}
                {"            "}
                {"での実行が設定できます。"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"設定(Settings → Computer → Your computer)"}</th>
                      <th>{"意味"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{"Ask every time"}</strong>
                        {"(デフォルト)"}
                      </td>
                      <td>{"毎回確認"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Always allow"}</strong>
                      </td>
                      <td>{"常に許可"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"Never allow"}</strong>
                      </td>
                      <td>{"常に拒否"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <ul>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"手元のファイルで作業させる明確な理由がなければ"}
                  {"\n"}
                  {"              "}
                  <strong>{"Never allow"}</strong> {"を推奨(公式)。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"チーム管理者がより厳しい上限を設定している場合は、そちらが優先されます。"}
                </li>
                {"\n"}
                {"          "}
              </ul>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-14">
              {"\n"}
              {"          "}
              <h2 id="sec-14-heading">
                <span className={[styles.num].join(" ")}>{"14"}</span>
                {"セキュリティの境界を理解する"}
              </h2>
              {"\n"}
              {"          "}
              <h3 id="s14-1">{"14.1 共有コンピュータの境界(最重要)"}</h3>
              {"\n"}
              {"          "}
              <p>{"公式ドキュメントの要点:"}</p>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"事実"}</th>
                      <th>{"意味"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"あなたの"}
                        <strong>{"個人 Bot はすべて 1 台のクラウドコンピュータ"}</strong>
                        {"を共有"}
                        {"\n"}
                        {"                  "}
                      </td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"ファイル・ブラウザセッション・コマンドライン資格情報が"}
                        <strong>{"全個人 Bot で利用可能"}</strong>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Shared Bot はどこで使うかで使用するコンピュータが変わる"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"メンバー自身のチャットでは"}
                        <strong>{"そのメンバーのコンピュータ"}</strong>
                        {"、Slack"}
                        {"\n"}
                        {"                    "}
                        {"チャンネルやグループチャットでは"}
                        {"\n"}
                        {"                    "}
                        <strong>{"Shared Bot のコンピュータ"}</strong>
                        {"を使う"}
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"別々の Bot をセキュリティ境界として使わない"}</strong>
                      </td>
                      <td>{"「経理用 Bot」「公開用 Bot」で権限が分かれるわけではない"}</td>
                    </tr>
                    <tr>
                      <td>{"Bot の公開共有リンク"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"設定をコピーされるだけで、あなたの PC やログインは共有されない。ただし"}
                        <strong>{"秘密情報・顧客データ・社内URLを共有 Bot に入れない"}</strong>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Bot を削除しても"}</td>
                      <td>
                        <strong>{"共有PC上のファイルやブラウザセッションは消えない"}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <h3 id="s14-2">{"14.2 プロンプトインジェクションとの関係"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["diagram-card"]].join(" ")}>
                {"\n"}
                {"            "}
                <div className={[styles["diagram-wrap"]].join(" ")}>
                  {"\n"}
                  {"              "}
                  <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="diag-8">
                    <MermaidDiagram
                      chart={DIAGRAM_8}
                      theme="base"
                      themeVariables={THEME}
                      flowchartHtmlLabels={false}
                    />
                  </div>
                  {"\n"}
                  {"            "}
                </div>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                {"Django 共同開発者の "}
                <strong>{"Simon Willison"}</strong> {"は、AI"}
                {"\n"}
                {"            "}
                {"エージェントが危険になる3条件を「"}
                <strong>{"致命的な三つ組(lethal trifecta)"}</strong>
                {"」と呼んでいます。"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"条件"}</th>
                      <th>{"Grok Bot での例"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"① 私的データへのアクセス"}</td>
                      <td>{"メール・ドライブ・ログイン済みセッション・ファイル"}</td>
                    </tr>
                    <tr>
                      <td>{"② 信頼できない内容への接触"}</td>
                      <td>{"Webページ・受信メール・X の投稿・Slack メッセージ"}</td>
                    </tr>
                    <tr>
                      <td>{"③ 外部へ送信する手段"}</td>
                      <td>{"メール送信、Slack 投稿、ブラウザからの POST"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                <strong>
                  {"3つが同時に揃うと、隠れた指示でデータが持ち出される恐れがあります。"}
                </strong>{" "}
                {"xAI"}
                {"\n"}
                {"            "}
                {"のドキュメントも、外部コンテンツを信頼できないものとして扱う層と、Auto"}
                {"\n"}
                {"            "}
                {"Review・ネットワークポリシー・操作ごとの承認を重ねつつ、これらは"}
                <strong>{"リスクを減らすが排除はしない"}</strong>
                {"としています(第三者の整理による)。"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <p>
                <strong>{"対策の考え方(三つ組を崩す)"}</strong>
              </p>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"崩す対象"}</th>
                      <th>{"具体策"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"①を減らす"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {
                          "必要なツールだけ接続。スコープ付きサービスアカウント。読み取り専用から開始"
                        }
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"②を減らす"}</td>
                      <td>
                        {"信頼できないサイトを閲覧させる Routine を作らない。広いトリガーを避ける"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"③を止める"}</td>
                      <td>
                        {"送信・公開・購入・削除・本番変更は"}
                        <strong>{"常に承認の後ろ"}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <h3 id="s14-3">{"14.3 アクセスを撤回するとき(公式の手順)"}</h3>
              {"\n"}
              {"          "}
              <ol>
                {"\n"}
                {"            "}
                <li>{"関連する Routine を一時停止/削除"}</li>
                {"\n"}
                {"            "}
                <li>{"共有コンピュータ上のWebサイトからサインアウト"}</li>
                {"\n"}
                {"            "}
                <li>
                  {"コネクタをアンインストールし、"}
                  <strong>{"元のサービス側で認可を取り消す"}</strong>
                </li>
                {"\n"}
                {"            "}
                <li>
                  <code>{"/workspace"}</code> {"から機密ファイルを削除"}
                </li>
                {"\n"}
                {"            "}
                <li>{"不要な Bot を非表示/削除"}</li>
                {"\n"}
                {"            "}
                <li>{"必要なら Cursor アカウント削除フローへ"}</li>
                {"\n"}
                {"          "}
              </ol>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-15">
              {"\n"}
              {"          "}
              <h2 id="sec-15-heading">
                <span className={[styles.num].join(" ")}>{"15"}</span>
                {"最小権限セットアップ・チェックリスト"}
              </h2>
              {"\n"}
              {"          "}
              <p>{"公式の「Use a least-privilege setup」に基づく実践リストです。"}</p>
              {"\n"}
              {"          "}
              <h3 id="s15-1">{"15.1 導入時"}</h3>
              {"\n"}
              {"          "}
              <ul>
                {"\n"}
                {"            "}
                <li className={[styles.check].join(" ")}>
                  {"\n"}
                  {"              "}
                  <label>
                    <input type="checkbox" /> {"必要なツールだけを接続している"}
                  </label>
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li className={[styles.check].join(" ")}>
                  {"\n"}
                  {"              "}
                  <label>
                    <input type="checkbox" />
                    {"\n"}
                    {"                "}
                    {"可能なものは"}
                    <strong>{"スコープ付きサービスアカウント"}</strong>
                    {"を使っている"}
                  </label>
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li className={[styles.check].join(" ")}>
                  {"\n"}
                  {"              "}
                  <label>
                    <input type="checkbox" />
                    {"\n"}
                    {"                "}
                    {"最初は"}
                    <strong>{"読み取り専用タスク"}</strong>
                    {"と"}
                    <strong>{"下書き出力"}</strong>
                    {"から始めた"}
                  </label>
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li className={[styles.check].join(" ")}>
                  {"\n"}
                  {"              "}
                  <label>
                    <input type="checkbox" />
                    {"\n"}
                    {"                "}
                    {"送信・公開・購入・削除・本番変更を"}
                    <strong>{"承認の後ろ"}</strong>
                    {"に置いた"}
                  </label>
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li className={[styles.check].join(" ")}>
                  {"\n"}
                  {"              "}
                  <label>
                    <input type="checkbox" /> {"ローカル実行を "}
                    <strong>{"Never allow"}</strong>
                    {"(または Ask"}
                    {"\n"}
                    {"                "}
                    {"every time)にしている"}
                  </label>
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li className={[styles.check].join(" ")}>
                  {"\n"}
                  {"              "}
                  <label>
                    <input type="checkbox" /> {"パスワード・コードは"}
                    {"\n"}
                    {"                "}
                    <strong>{"Take over"}</strong> {"で入力している"}
                  </label>
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"          "}
              </ul>
              {"\n"}
              {"          "}
              <h3 id="s15-2">{"15.2 運用時"}</h3>
              {"\n"}
              {"          "}
              <ul>
                {"\n"}
                {"            "}
                <li className={[styles.check].join(" ")}>
                  {"\n"}
                  {"              "}
                  <label>
                    <input type="checkbox" /> {"インストール済みコネクタと有効な Routine"}
                    {"\n"}
                    {"                "}
                    {"を"}
                    <strong>{"定期的にレビュー"}</strong>
                    {"している"}
                  </label>
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li className={[styles.check].join(" ")}>
                  {"\n"}
                  {"              "}
                  <label>
                    <input type="checkbox" /> {"連携元システムや想定フローが変わったら Routine"}
                    {"\n"}
                    {"                "}
                    {"を"}
                    <strong>{"一時停止"}</strong>
                    {"した"}
                  </label>
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li className={[styles.check].join(" ")}>
                  {"\n"}
                  {"              "}
                  <label>
                    <input type="checkbox" />
                    {"\n"}
                    {"                "}
                    {"重要な判断について"}
                    <strong>{"出典リンクと操作ログ"}</strong>
                    {"を残している"}
                  </label>
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li className={[styles.check].join(" ")}>
                  {"\n"}
                  {"              "}
                  <label>
                    <input type="checkbox" /> {"作業完了後に、機密の一時ファイルを削除している"}
                  </label>
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li className={[styles.check].join(" ")}>
                  {"\n"}
                  {"              "}
                  <label>
                    <input type="checkbox" /> {"不要になったサービスからサインアウトしている"}
                  </label>
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"          "}
              </ul>
              {"\n"}
              {"          "}
              <h3 id="s15-3">{"15.3 週次の見直し(おすすめ)"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["diagram-card"]].join(" ")}>
                {"\n"}
                {"            "}
                <div className={[styles["diagram-wrap"]].join(" ")}>
                  {"\n"}
                  {"              "}
                  <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="diag-9">
                    <MermaidDiagram
                      chart={DIAGRAM_9}
                      theme="base"
                      themeVariables={THEME}
                      flowchartHtmlLabels={false}
                    />
                  </div>
                  {"\n"}
                  {"            "}
                </div>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-16">
              {"\n"}
              {"          "}
              <h2 id="sec-16-heading">
                <span className={[styles.num].join(" ")}>{"16"}</span>
                {"チーム・組織で使うとき"}
              </h2>
              {"\n"}
              {"          "}
              <h3 id="s16-1">{"16.1 Team Bot"}</h3>
              {"\n"}
              {"          "}
              <ul>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"Cursor チームでは、サイドバーの "}
                  <strong>{"+ → Create a Bot"}</strong> {"で Bot"}
                  {"\n"}
                  {"              "}
                  {"を作り、チャットの Bot 名メニューの"}
                  {"\n"}
                  {"              "}
                  <strong>{"Share"}</strong>{" "}
                  {"からチームに共有すると、メンバーが話しかけられる Bot"}
                  {"\n"}
                  {"              "}
                  {"になります。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  <strong>{"チームで共有する Bot"}</strong> {"では、オーナーまたは Manager"}
                  {"\n"}
                  {"              "}
                  {"が追加したアプリ・シークレット・スキル・ファイル・"}
                  <strong>{"メモリ"}</strong>
                  {"が、"}
                  <strong>{"各メンバーのチャットでも利用可能"}</strong>
                  {"になります。メモリには"}
                  {"\n"}
                  {"              "}
                  {"2 種類あります。Bot"}
                  {"\n"}
                  {"              "}
                  {"が"}
                  <strong>{"チーム全体のために保存したメモリ"}</strong>
                  {"はほかのメンバーとのチャットでも使われ、保存したときは"}
                  {"\n"}
                  {"              "}
                  {"Bot がその旨を伝えます。一方、"}
                  <strong>
                    {"各メンバーとの作業について覚えたことはそのメンバーと Bot の間に留まり"}
                  </strong>
                  {
                    "、メンバー個人に関する内容はチームのメモリには保存されません。オーナーと Manager"
                  }
                  {"\n"}
                  {"              "}
                  {"のどちらが追加する場合も、"}
                  <strong>{"各メンバーのチャットで使われる指示・ファイル・メモリ"}</strong>
                  {"には認証情報や顧客データを書き込まないでください。Bot"}
                  {"\n"}
                  {"              "}
                  {"に必要なログインやキーは、"}
                  <a href="#s9-1">{"9.1"}</a> {"の手順に従い、ログインは"}
                  {"\n"}
                  {"              "}
                  <strong>{"Team Bot 専用の Vault"}</strong>
                  {"(v0.78.1"}
                  {"\n"}
                  {"              "}
                  {"以降・段階配信のため未提供のチームもある)、キーは Shared Bot の"}
                  {"\n"}
                  {"              "}
                  <strong>{"Secrets"}</strong>
                  {"\n"}
                  {"              "}
                  {"に登録します。また、"}
                  <strong>{"個人情報や顧客情報をメモリに保存させない"}</strong>
                  {"でください。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"            "}
                <li>
                  {"\n"}
                  {"              "}
                  {"一方、Bot"}
                  {"\n"}
                  {"              "}
                  {"の"}
                  <strong>{"公開テンプレート"}</strong>
                  {"としての共有は"}
                  <strong>{"ログインの共有ではありません"}</strong>
                  {"(コンピュータ・ログイン・会話履歴は共有されない)。ただし設定だけでなく、Bot"}
                  {"\n"}
                  {"              "}
                  {"の ID(名前など)・説明・"}
                  <strong>{"Skill"}</strong>
                  {"・"}
                  <strong>{"Routine"}</strong>
                  {"\n"}
                  {"              "}
                  {"といった共有用の構成が公開されます。公開する前に Bot"}
                  {"\n"}
                  {"              "}
                  {"の詳細で共有される中身を確認し、API"}
                  {"\n"}
                  {"              "}
                  {
                    "キー・社内URL・顧客データなどの機密を取り除いてください。公開後は Share メニューの"
                  }
                  {"\n"}
                  {"              "}
                  <strong>{"View template details"}</strong> {"で中身を確認できます。"}
                  {"\n"}
                  {"            "}
                </li>
                {"\n"}
                {"          "}
              </ul>
              {"\n"}
              {"          "}
              <h3 id="s16-2">{"16.2 管理者が知っておくこと(公式・第三者資料より)"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"項目"}</th>
                      <th>{"内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"設定の所在"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"Grok Bot の主要な管理設定は"}
                        {"\n"}
                        {"                    "}
                        <strong>{"Cursor のダッシュボード"}</strong>
                        {"にある。一部の設定は"}
                        {"\n"}
                        {"                    "}
                        <strong>{"Team Settings・Team Marketplace・ID プロバイダー(IdP)"}</strong>
                        {"\n"}
                        {"                    "}
                        {"側にもある。docs.x.ai はそのページを写し、Cursor に戻るリンクを持つ"}
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Auto Review の強制"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <strong>{"Enterprise プランのみ"}</strong>
                        {"。Enterprise の管理者が Enforce"}
                        {"\n"}
                        {"                    "}
                        {"Auto-review とチーム全体の Auto-review ルールを設定すると、"}
                        <strong>{"Auto-review を有効にしているメンバー"}</strong>
                        {
                          "には編集不可のチームルールが適用される。個人ルールはより厳しくする方向にのみ追加できる。グループに"
                        }
                        {"\n"}
                        {"                    "}
                        <code>{"Don't enforce for this group"}</code>{" "}
                        {"を設定すると、そのグループでは Enforce"}
                        {"\n"}
                        {"                    "}
                        {"Auto-review の設定がロック解除され、メンバーが Auto-review"}
                        {"\n"}
                        {"                    "}
                        {
                          "をオフにできるようになる(チームルールが編集可能になったり削除されたりするわけではない)"
                        }
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"ローカル実行の上限"}</td>
                      <td>{"管理者がチーム全体の上限を設定できる(厳しい方が優先)"}</td>
                    </tr>
                    <tr>
                      <td>{"Bot の ID"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"Bot には識別用の ID"}
                        {"\n"}
                        {"                    "}
                        {"があるが、独立した認証アイデンティティや資格情報は持たず、原則として"}
                        <strong>{"サインインしているメンバーとして"}</strong>
                        {"動く。例外として、"}
                        <strong>
                          {
                            "チーム管理のコネクタはチームまたはサービスアカウントの資格情報を使う場合がある"
                          }
                        </strong>
                        {"。コネクタが使う資格情報と、監査ログに操作者として記録される"}
                        {"\n"}
                        {"                    "}
                        {"ID は別物として扱う(公式ドキュメントは、どの ID"}
                        {"\n"}
                        {"                    "}
                        {"が操作者として記録されるかを明記していないため、導入前に確認する)"}
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"実行環境"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"第三者の調査では、Cursor"}
                        {"\n"}
                        {"                    "}
                        {"がホストするマシン上でのみ動作しオンプレミスの選択肢はない(OneWave"}
                        {"\n"}
                        {"                    "}
                        {"の読み込みによる)"}
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"認証・準拠"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"公式のセキュリティページは "}
                        <strong>{"ISO/IEC 27001"}</strong> {"と"}
                        {"\n"}
                        {"                    "}
                        <strong>{"ISO/IEC 42001"}</strong>
                        {"\n"}
                        {"                    "}
                        {
                          "の認証取得を示している。なお、第三者(eesel)は過去に「ドキュメントが認証取得の主張をしていない」と指摘していた(調査日"
                        }
                        {"\n"}
                        {"                    "}
                        {"2026年10月24日時点の記事。現在は公式ページで最新の認証状況を確認する)"}
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <blockquote>
                {"\n"}
                {"            "}
                <p>
                  {"\n"}
                  {"              "}
                  {
                    "組織導入の際は、公式の「Grok Bot for Teams and Enterprises」と「Grok Bot security"
                  }
                  {"\n"}
                  {"              "}
                  {"FAQ」から始めるよう公式が案内しています。"}
                  {"\n"}
                  {"            "}
                </p>
                {"\n"}
                {"          "}
              </blockquote>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-17">
              {"\n"}
              {"          "}
              <h2 id="sec-17-heading">
                <span className={[styles.num].join(" ")}>{"17"}</span>
                {"トラブルシュート"}
              </h2>
              {"\n"}
              {"          "}
              <h3 id="s17-1">{"17.1 まず試すこと"}</h3>
              {"\n"}
              {"          "}
              <p>
                {"\n"}
                {"            "}
                <strong>{"アプリを完全に終了して開き直す"}</strong>
                {
                  "(公式:セットアップの問題の多くはこれで解消)。解決しない場合は、公式の Troubleshooting"
                }
                {"\n"}
                {"            "}
                {"ページと support に問い合わせます。"}
                {"\n"}
                {"          "}
              </p>
              {"\n"}
              {"          "}
              <h3 id="s17-2">{"17.2 @bot が返信しない場合(公式の原因一覧)"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"原因"}</th>
                      <th>{"対処"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"X アカウントの国が未対応"}</td>
                      <td>{"現時点では対処不可(対応待ち)"}</td>
                    </tr>
                    <tr>
                      <td>
                        {"すでに @bot を含むスレッドに、自分では @bot をタグ付けせず返信した"}
                      </td>
                      <td>
                        <strong>{"自分の投稿で明示的に @bot を付ける"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{"投稿が @grok も同時にタグ付けしている"}</td>
                      <td>{"@bot のみにする"}</td>
                    </tr>
                    <tr>
                      <td>
                        {"投稿・返信先・引用先に"}
                        <strong>{"動画や GIF"}</strong> {"がある"}
                      </td>
                      <td>{"静止画またはテキストにする"}</td>
                    </tr>
                    <tr>
                      <td>{"内部モデレーションを通過しない"}</td>
                      <td>{"内容を見直す"}</td>
                    </tr>
                    <tr>
                      <td>
                        {"Grok Bot が Grok アカウントに未連携、または今週の使用量を使い切った"}
                      </td>
                      <td>{"連携・使用量を確認"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <h3 id="s17-3">{"17.3 @bot の返信の意味"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"@bot の返信"}</th>
                      <th>{"意味"}</th>
                      <th>{"対処"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"依頼を Grok Bot に送ったという短い返信"}</td>
                      <td>{"メイン Bot が受領"}</td>
                      <td>{"Grok Bot アプリで進捗を確認"}</td>
                    </tr>
                    <tr>
                      <td>{"「Sign up for Grok Bot」案内"}</td>
                      <td>{"X アカウントに Grok アカウントが未連携"}</td>
                      <td>{"grok.com で X を連携し、再度タグ付け"}</td>
                    </tr>
                    <tr>
                      <td>{"「Grok Bot isn't set up yet」案内"}</td>
                      <td>{"アカウントは連携済みだが自分の Bot がない"}</td>
                      <td>{"アプリで Bot を作成し、再度タグ付け"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <h3 id="s17-4">{"17.4 Routine が動かない・空振りする"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["diagram-card"]].join(" ")}>
                {"\n"}
                {"            "}
                <div className={[styles["diagram-wrap"]].join(" ")}>
                  {"\n"}
                  {"              "}
                  <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="diag-10">
                    <MermaidDiagram
                      chart={DIAGRAM_10}
                      theme="base"
                      themeVariables={THEME}
                      flowchartHtmlLabels={false}
                    />
                  </div>
                  {"\n"}
                  {"            "}
                </div>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-18">
              {"\n"}
              {"          "}
              <h2 id="sec-18-heading">
                <span className={[styles.num].join(" ")}>{"18"}</span>
                {"よくある失敗と対策(アンチパターン集)"}
              </h2>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"#"}</th>
                      <th>{"失敗"}</th>
                      <th>{"なぜ危険か"}</th>
                      <th>{"対策"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"1"}</td>
                      <td>{"何でも屋 Bot を1体だけ作る"}</td>
                      <td>{"文脈が散らかり品質が下がる"}</td>
                      <td>{"役割ごとに Bot を分ける"}</td>
                    </tr>
                    <tr>
                      <td>{"2"}</td>
                      <td>{"Bot を分ければ安全だと思う"}</td>
                      <td>{"共有コンピュータで資格情報が共有される"}</td>
                      <td>{"Bot 分割をセキュリティ境界にしない"}</td>
                    </tr>
                    <tr>
                      <td>{"3"}</td>
                      <td>{"「ブラウザ内は全部許可」のルールを作る"}</td>
                      <td>{"サイトの挙動変化で想定外の操作が通る"}</td>
                      <td>{"狭い対象・コマンドのルールにする"}</td>
                    </tr>
                    <tr>
                      <td>{"4"}</td>
                      <td>{"いきなり Routine 化する"}</td>
                      <td>{"不安定な手順が毎日誤動作する"}</td>
                      <td>{"1回限りで安定 → Skill → Test → Routine"}</td>
                    </tr>
                    <tr>
                      <td>{"5"}</td>
                      <td>{"Test を「安全な練習」だと思う"}</td>
                      <td>{"本物の操作が実行される"}</td>
                      <td>{"安全な入力+書き込みは承認の後ろ"}</td>
                    </tr>
                    <tr>
                      <td>{"6"}</td>
                      <td>{"「新着メッセージすべて」で起動する"}</td>
                      <td>{"ノイズ・使用量増・無関係入力への反応"}</td>
                      <td>{"狭い一致条件にする"}</td>
                    </tr>
                    <tr>
                      <td>{"7"}</td>
                      <td>{"パスワードをチャットに貼る"}</td>
                      <td>{"記録に残る"}</td>
                      <td>{"Take over か安全なシークレット入力"}</td>
                    </tr>
                    <tr>
                      <td>{"8"}</td>
                      <td>{"対象不明の承認を押す"}</td>
                      <td>{"取り返しがつかない操作が走る"}</td>
                      <td>{"説明/下書きを先に求める"}</td>
                    </tr>
                    <tr>
                      <td>{"9"}</td>
                      <td>{"機密を共有 Bot に入れる"}</td>
                      <td>{"共有リンクで設定がコピーされる"}</td>
                      <td>{"秘密・顧客データ・社内URLを入れない"}</td>
                    </tr>
                    <tr>
                      <td>{"10"}</td>
                      <td>{"Bot を削除すれば痕跡が消えると思う"}</td>
                      <td>{"共有PCのファイルとセッションは残る"}</td>
                      <td>{"14.3 の撤回手順を実施"}</td>
                    </tr>
                    <tr>
                      <td>{"11"}</td>
                      <td>{"古いデータで定時レポートを出す"}</td>
                      <td>{"誤判断を招く"}</td>
                      <td>{"「ソース欠落時は失敗を報告」と明記"}</td>
                    </tr>
                    <tr>
                      <td>{"12"}</td>
                      <td>{"ローカル実行を常時許可"}</td>
                      <td>{"手元ファイルへの影響範囲が拡大"}</td>
                      <td>{"Never allow / Ask every time"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-19">
              {"\n"}
              {"          "}
              <h2 id="sec-19-heading">
                <span className={[styles.num].join(" ")}>{"19"}</span>
                {"補足: その他のベストプラクティスと根拠ソース"}
              </h2>
              {"\n"}
              {"          "}
              <blockquote>
                {"\n"}
                {"            "}
                <p>
                  {"\n"}
                  {"              "}
                  <strong>{"調査方針"}</strong>
                  {":"}
                  {"\n"}
                  {"              "}
                  {
                    "2026年10月24日時点でウェブ検索を行い、公式ドキュメントを一次情報とし、国際的に知られた開発者・セキュリティ研究者の発信と、独立した第三者の分析を補足としました。"
                  }
                  {"\n"}
                  {"              "}
                  <strong>{"正直な限界"}</strong>
                  {": Grok Bot"}
                  {"\n"}
                  {"              "}
                  {
                    "に特化して著名な国際的開発者が書いた一次的な長文解説は、検索範囲では多くありませんでした。そのため、(a)"
                  }
                  {"\n"}
                  {"              "}
                  {"Simon Willison"}
                  {"\n"}
                  {"              "}
                  {"のように"}
                  <strong>{"エージェント安全性の一般原則"}</strong>
                  {"を示す著名開発者の資料と、(b)"}
                  {"\n"}
                  {"              "}
                  {"Grok Bot を直接扱った独立した解説・開発者投稿、(c)"}
                  {"\n"}
                  {"              "}
                  {"公式ドキュメント、を組み合わせています。"}
                  {"\n"}
                  {"            "}
                </p>
                {"\n"}
                {"          "}
              </blockquote>
              {"\n"}
              {"          "}
              <h3 id="s19-1">{"19.1 補足ベストプラクティス一覧(根拠付き)"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"#"}</th>
                      <th>{"ベストプラクティス"}</th>
                      <th>{"根拠・要点"}</th>
                      <th>{"発信元"}</th>
                      <th>{"URL"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"1"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {
                          "「致命的な三つ組」を崩す設計にする(私的データ・信頼できない入力・外部送信を同居させない)"
                        }
                        {"\n"}
                        {"                  "}
                      </td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"AIエージェントが情報を持ち出される3条件の整理。Grok Bot"}
                        {"\n"}
                        {"                    "}
                        {"の第三者解説でも引用されている"}
                        {"\n"}
                        {"                  "}
                      </td>
                      <td>
                        <strong>{"Simon Willison"}</strong>
                        {"(Django 共同開発者、Datasette 作者)"}
                      </td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"2"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"X"}
                        {"\n"}
                        {"                    "}
                        {
                          "上の信頼できない投稿を読むエージェントは間接プロンプトインジェクションを前提に設計する"
                        }
                        {"\n"}
                        {"                  "}
                      </td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"Grok 3 が X"}
                        {"\n"}
                        {"                    "}
                        {
                          "の投稿を検索して回答する構造について、間接プロンプトインジェクションへの脆弱性を指摘"
                        }
                        {"\n"}
                        {"                  "}
                      </td>
                      <td>
                        <strong>{"Simon Willison"}</strong>
                        {"(ブログのタグ集)"}
                      </td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://simonwillison.net/tags/prompt-injection/?page=3"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://simonwillison.net/tags/prompt-injection/?page=3"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"3"}</td>
                      <td>
                        {"Bot を分けても権限は分かれない。ログインは全個人 Bot で利用可能と考える"}
                      </td>
                      <td>
                        {"共有コンピュータ上でファイル・ブラウザセッション・資格情報が共有される"}
                      </td>
                      <td>{"xAI 公式ドキュメント"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://docs.x.ai/grok-bot/approvals-security-and-privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://docs.x.ai/grok-bot/approvals-security-and-privacy"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"4"}</td>
                      <td>{"承認ルールは狭く書き、広い許可を避ける"}</td>
                      <td>{"Auto Review はモデルベースで、最小権限の代替ではない"}</td>
                      <td>{"xAI 公式ドキュメント"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://docs.x.ai/grok-bot/approvals-security-and-privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://docs.x.ai/grok-bot/approvals-security-and-privacy"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"5"}</td>
                      <td>{"自動化は「一回限り → Skill → Test → Routine」の順"}</td>
                      <td>{"公式が順序を明記"}</td>
                      <td>{"xAI 公式ドキュメント"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://docs.x.ai/grok-bot/skills-routines-and-automations"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://docs.x.ai/grok-bot/skills-routines-and-automations"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"6"}</td>
                      <td>{"最初の1回は5要素(成果・情報源・制約・成果物・確認点)で依頼する"}</td>
                      <td>{"公式の「強い依頼」の定義"}</td>
                      <td>{"xAI 公式ドキュメント"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://docs.x.ai/grok-bot/get-started"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://docs.x.ai/grok-bot/get-started"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"7"}</td>
                      <td>
                        {
                          "@bot 経由の依頼は地域・動画/GIF・@grok の同時タグなどの制約を先に確認する"
                        }
                      </td>
                      <td>{"無反応の原因が公式に一覧化されている"}</td>
                      <td>{"xAI 公式ドキュメント"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://docs.x.ai/grok-bot/tag-on-x"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://docs.x.ai/grok-bot/tag-on-x"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"8"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {
                          "管理者は Auto Review 強制・ローカル実行の上限・シート割り当てなどを使い分ける"
                        }
                        {"\n"}
                        {"                  "}
                      </td>
                      <td>{"設定の所在が Cursor ダッシュボード側にある点を整理"}</td>
                      <td>{"How to Harden(ハードニングガイド)"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://howtoharden.com/guides/grok-bot/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://howtoharden.com/guides/grok-bot/"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"9"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {
                          "承認が自由記述ルールに依存する点・ドライランがない点を理解して導入判断する(認証は公式セキュリティページで"
                        }
                        {"\n"}
                        {"                    "}
                        {
                          "ISO/IEC 27001・ISO/IEC 42001 を確認。eesel の「認証主張がない」との指摘は調査日"
                        }
                        {"\n"}
                        {"                    "}
                        {"2026年10月24日時点の過去の評価)"}
                        {"\n"}
                        {"                  "}
                      </td>
                      <td>{"ドキュメント読み込みによる批判的レビュー"}</td>
                      <td>{"eesel AI(独立レビュー)"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://www.eesel.ai/blog/grok-bot"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://www.eesel.ai/blog/grok-bot"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"10"}</td>
                      <td>{"代替製品と比較し、監査性を重視して選ぶ"}</td>
                      <td>{"プライバシーモードの扱い・承認の性質を比較"}</td>
                      <td>{"eesel AI"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://www.eesel.ai/blog/grok-bot-alternatives"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://www.eesel.ai/blog/grok-bot-alternatives"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"11"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {
                          "導入前にセキュリティ FAQ を読み、ホスト先・オンプレの可否などを質問リスト化する"
                        }
                        {"\n"}
                        {"                  "}
                      </td>
                      <td>{"発売直後にセキュリティドキュメントを読み込んだ企業コンサルの整理"}</td>
                      <td>{"OneWave AI"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://www.onewave-ai.com/blog/grok-bot-explained-what-it-means-for-business"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://www.onewave-ai.com/blog/grok-bot-explained-what-it-means-for-business"
                          }
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"12"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"パーソナルエージェント(Grok Bot / Muse /"}
                        {"\n"}
                        {"                    "}
                        {
                          "Dots)の共通構造(記憶・自分のコンピュータ・自律起動)を理解し、副作用の審査範囲(例:"
                        }
                        {"\n"}
                        {"                    "}
                        {"メモリ書き込み)を確認する"}
                        {"\n"}
                        {"                  "}
                      </td>
                      <td>
                        {"3製品の比較解説。1ユーザー1つのマイクロVM を全 Bot が共有する説明を含む"}
                      </td>
                      <td>{"Projeckt AI"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://projecktai.substack.com/p/personal-ai-agents-explained"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://projecktai.substack.com/p/personal-ai-agents-explained"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"13"}</td>
                      <td>{"ローカル実行は「Never allowed」から始める"}</td>
                      <td>{"実践ガイドの推奨"}</td>
                      <td>{"Vantaige"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://vantaige.io/blog/grok-bot-complete-guide-2026"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://vantaige.io/blog/grok-bot-complete-guide-2026"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"14"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"プライバシー設定は Cursor 側設定が支配する。Privacy Mode"}
                        {"\n"}
                        {"                    "}
                        {"の挙動は公式フォーラムの回答で確認する"}
                        {"\n"}
                        {"                  "}
                      </td>
                      <td>{"Cursor の Privacy Mode が Grok Bot にも適用される旨の説明"}</td>
                      <td>{"Cursor 公式フォーラム"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://forum.cursor.com/t/privacy-and-term-of-use-of-grok-bot-with-cursor-account/168075"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://forum.cursor.com/t/privacy-and-term-of-use-of-grok-bot-with-cursor-account/168075"
                          }
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"15"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {
                          "見えない文字による隠し指示(Unicode)を検査する OSS コネクタを併用する選択肢"
                        }
                        {"\n"}
                        {"                  "}
                      </td>
                      <td>
                        {"実際のアプリ上で検証した開発者の報告(個人開発者。実績は要自己確認)"}
                      </td>
                      <td>{"PixelRainbow(X の投稿)"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://x.com/PixelRainbowNFT/status/2112021936662270175"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://x.com/PixelRainbowNFT/status/2112021936662270175"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"16"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {
                          "悪意あるWebコンテンツが共有コンピュータ上で何を可能にするか、シナリオで理解する"
                        }
                        {"\n"}
                        {"                  "}
                      </td>
                      <td>{"Web閲覧型エージェントのプロンプトインジェクション解説"}</td>
                      <td>{"DEV Community"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://dev.to/aiza-hextyx/grok-bot-prompt-injection-how-malicious-web-content-can-hijack-an-ai-agent-2elh"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://dev.to/aiza-hextyx/grok-bot-prompt-injection-how-malicious-web-content-can-hijack-an-ai-agent-2elh"
                          }
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"17"}</td>
                      <td>
                        {"製品の変更が速いので、ドキュメントの更新履歴(changelog)を定期的に見る"}
                      </td>
                      <td>{"ドキュメントセット公開日などを追跡している"}</td>
                      <td>{"Tech Dev Notes"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://techdevnotes.com/releases/xai-docs/20260811-181704Z-cb236dea6e3d"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://techdevnotes.com/releases/xai-docs/20260811-181704Z-cb236dea6e3d"
                          }
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"18"}</td>
                      <td>{"Bot の使い方の実例を開発者の投稿から学ぶ(中身は各自で確認)"}</td>
                      <td>{"Grok Bot 関連の開発者投稿のアーカイブ(Lingxi Li 氏の投稿)"}</td>
                      <td>{"Lingxi Li(X の投稿のアーカイブ)"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://archive.codenewsletter.ai/2094493172516966781"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://archive.codenewsletter.ai/2094493172516966781"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"19"}</td>
                      <td>{"導入ガイドと技術解説を併読する"}</td>
                      <td>{"常時稼働型 AI チームメイトの仕組みの解説"}</td>
                      <td>{"Composio"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://composio.dev/content/guide-to-frok-bot"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://composio.dev/content/guide-to-frok-bot"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <h3 id="s19-2">{"19.2 ソースの信頼度の目安"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"区分"}</th>
                      <th>{"該当"}</th>
                      <th>{"読み方"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"★★★ 一次情報"}</td>
                      <td>{"docs.x.ai、x.ai/news、Cursor 公式"}</td>
                      <td>{"仕様の根拠として使う"}</td>
                    </tr>
                    <tr>
                      <td>{"★★☆ 著名開発者の一般原則"}</td>
                      <td>{"Simon Willison"}</td>
                      <td>{"設計原則の根拠(Grok Bot 固有の検証ではない)"}</td>
                    </tr>
                    <tr>
                      <td>{"★★☆ 独立した分析"}</td>
                      <td>{"eesel、How to Harden、OneWave、Projeckt AI"}</td>
                      <td>{"批判的視点。数値・仕様は公式で再確認"}</td>
                    </tr>
                    <tr>
                      <td>{"★☆☆ 個人発信"}</td>
                      <td>{"X の投稿、DEV Community"}</td>
                      <td>{"事例・仮説として扱い、鵜呑みにしない"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-20">
              {"\n"}
              {"          "}
              <h2 id="sec-20-heading">
                <span className={[styles.num].join(" ")}>{"20"}</span>
                {"参考URL一覧"}
              </h2>
              {"\n"}
              {"          "}
              <h3 id="s20-1">{"20.1 公式"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"名称"}</th>
                      <th>{"URL"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"Introducing Grok Bot(アンカー記事)"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://x.ai/news/introducing-grok-bot"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://x.ai/news/introducing-grok-bot"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Grok Bot ダウンロード/トップ"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a href="https://x.ai/bot" target="_blank" rel="noopener noreferrer">
                          {"https://x.ai/bot"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Grok Bot ガイド集"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a href="https://x.ai/bot/guides" target="_blank" rel="noopener noreferrer">
                          {"https://x.ai/bot/guides"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Grok Bot 101"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://x.ai/bot/guides/grok-bot-101"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://x.ai/bot/guides/grok-bot-101"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Templates for Grok Bot"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://x.ai/bot/guides/templates-for-grok-bot"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://x.ai/bot/guides/templates-for-grok-bot"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Grok Bot for Work"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://x.ai/bot/guides/grok-bot-for-work"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://x.ai/bot/guides/grok-bot-for-work"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"ドキュメント: Get started"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://docs.x.ai/grok-bot/get-started"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://docs.x.ai/grok-bot/get-started"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"ドキュメント: Skills and routines"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://docs.x.ai/grok-bot/skills-routines-and-automations"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://docs.x.ai/grok-bot/skills-routines-and-automations"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"ドキュメント: Approvals, security, and privacy"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://docs.x.ai/grok-bot/approvals-security-and-privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://docs.x.ai/grok-bot/approvals-security-and-privacy"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"ドキュメント: Tag @bot on X"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://docs.x.ai/grok-bot/tag-on-x"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://docs.x.ai/grok-bot/tag-on-x"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"ドキュメント: FAQ"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://docs.x.ai/grok-bot/faq"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://docs.x.ai/grok-bot/faq"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"ドキュメント: Teams and enterprises(Cursor)"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://cursor.com/docs/grok-bot/teams"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://cursor.com/docs/grok-bot/teams"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"ドキュメント: セキュリティ(Markdown 版)"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://docs.x.ai/grok-bot/security.md"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://docs.x.ai/grok-bot/security.md"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Cursor プライバシーポリシー"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://cursor.com/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://cursor.com/privacy"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Cursor セキュリティ情報"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://cursor.com/security"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://cursor.com/security"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <h3 id="s20-2">{"20.2 第三者・開発者"}</h3>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"名称"}</th>
                      <th>{"URL"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"Simon Willison: The lethal trifecta"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Simon Willison: prompt-injection タグ"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://simonwillison.net/tags/prompt-injection/?page=3"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://simonwillison.net/tags/prompt-injection/?page=3"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"How to Harden: Grok Bot Hardening Guide"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://howtoharden.com/guides/grok-bot/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://howtoharden.com/guides/grok-bot/"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"eesel: Grok Bot explained"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://www.eesel.ai/blog/grok-bot"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://www.eesel.ai/blog/grok-bot"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"eesel: Grok Bot alternatives"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://www.eesel.ai/blog/grok-bot-alternatives"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://www.eesel.ai/blog/grok-bot-alternatives"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"OneWave AI: What it means for business"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://www.onewave-ai.com/blog/grok-bot-explained-what-it-means-for-business"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://www.onewave-ai.com/blog/grok-bot-explained-what-it-means-for-business"
                          }
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Projeckt AI: Personal AI Agents Explained"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://projecktai.substack.com/p/personal-ai-agents-explained"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://projecktai.substack.com/p/personal-ai-agents-explained"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Vantaige: Grok Bot Complete Guide"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://vantaige.io/blog/grok-bot-complete-guide-2026"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://vantaige.io/blog/grok-bot-complete-guide-2026"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Cursor フォーラム: Privacy and Terms"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://forum.cursor.com/t/privacy-and-term-of-use-of-grok-bot-with-cursor-account/168075"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://forum.cursor.com/t/privacy-and-term-of-use-of-grok-bot-with-cursor-account/168075"
                          }
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Composio: Guide to Grok Bot"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://composio.dev/content/guide-to-frok-bot"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://composio.dev/content/guide-to-frok-bot"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"DEV Community: Grok Bot Prompt Injection"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://dev.to/aiza-hextyx/grok-bot-prompt-injection-how-malicious-web-content-can-hijack-an-ai-agent-2elh"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://dev.to/aiza-hextyx/grok-bot-prompt-injection-how-malicious-web-content-can-hijack-an-ai-agent-2elh"
                          }
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Tech Dev Notes: xAI Docs リリースノート"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://techdevnotes.com/releases/xai-docs/20260811-181704Z-cb236dea6e3d"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://techdevnotes.com/releases/xai-docs/20260811-181704Z-cb236dea6e3d"
                          }
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Lingxi Li 氏の投稿(アーカイブ)"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://archive.codenewsletter.ai/2094493172516966781"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://archive.codenewsletter.ai/2094493172516966781"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"PixelRainbow: VeilBreaker 投稿"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        <a
                          href="https://x.com/PixelRainbowNFT/status/2112021936662270175"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://x.com/PixelRainbowNFT/status/2112021936662270175"}
                        </a>
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"\n"}
            {"        "}
            <section className={[styles.section].join(" ")} id="sec-21">
              {"\n"}
              {"          "}
              <h2 id="sec-21-heading">
                <span className={[styles.num].join(" ")}>{"21"}</span>
                {"検証メモと限界"}
              </h2>
              {"\n"}
              {"          "}
              <div className={[styles["table-wrap"]].join(" ")}>
                {"\n"}
                {"            "}
                <table>
                  <thead>
                    <tr>
                      <th>{"項目"}</th>
                      <th>{"内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"調査日"}</td>
                      <td>{"2026年10月24日"}</td>
                    </tr>
                    <tr>
                      <td>{"一次確認できたページ"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {
                          "Get started / Skills and routines / Approvals, security, and privacy / Tag @bot"
                        }
                        {"\n"}
                        {"                    "}
                        {"on X(いずれも公式ドキュメント。最終更新は 2026年10月7日〜22日と記載)"}
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"アンカー記事・ガイド集"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"取得は行ったが、本ガイドの数値・仕様の根拠は主に"}
                        {"\n"}
                        {"                    "}
                        <code>{"docs.x.ai"}</code> {"の確認済みページに置いた"}
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"取得できなかったもの"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"公式"}
                        {"\n"}
                        {"                    "}
                        {"changelog("}
                        <code>{"x.ai/changelog/bot"}</code>
                        {")はボット検知でブロックされ内容を確認できていない。v0.78.1"}
                        {"\n"}
                        {"                    "}
                        {
                          "の Team Bot 専用 Vault の記述は、changelog の転載サイト(gradually.ai)と xAI"
                        }
                        {"\n"}
                        {"                    "}
                        {"関係者の X 投稿(stable 版を段階配信中)で確認した(2026年11月2日)"}
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"第三者資料の扱い"}</td>
                      <td>{"見出し・要旨レベルで参照。仕様の断定は公式側の記述に限定"}</td>
                    </tr>
                    <tr>
                      <td>{"Grok Bot 固有の著名開発者による詳細解説"}</td>
                      <td>
                        {"\n"}
                        {"                    "}
                        {"検索範囲では限定的。Simon Willison の記事は"}
                        <strong>{"一般原則"}</strong>
                        {"であり、Grok"}
                        {"\n"}
                        {"                    "}
                        {"Bot の個別検証ではない"}
                        {"\n"}
                        {"                  "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"料金・対応プラン・地域"}</td>
                      <td>
                        {"変更が速い。"}
                        <strong>{"必ず公式の最新ページで確認"}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"          "}
              </div>
              {"\n"}
              {"          "}
              <blockquote>
                {"\n"}
                {"            "}
                <p>
                  {"\n"}
                  {"              "}
                  <strong>{"免責"}</strong>
                  {":"}
                  {"\n"}
                  {"              "}
                  {
                    "本ガイドは情報提供を目的とし、製品の動作を保証しません。業務での本格導入前に、公式ドキュメントと組織のセキュリティ要件を確認してください。"
                  }
                  {"\n"}
                  {"            "}
                </p>
                {"\n"}
                {"          "}
              </blockquote>
              {"\n"}
              {"        "}
            </section>
            {"\n"}
            {"        "}
            <footer className={[styles.footer].join(" ")}>
              {"\n"}
              {"          "}
              {"Grok Bot"}
              {"\n"}
              {"          "}
              {
                "はベータ版です。仕様・料金・対応地域は変更されるため、必ず公式ドキュメントで最新情報を確認してください。"
              }
              {"\n"}
              {"        "}
            </footer>
            {"\n"}
            {"      "}
          </main>
        </div>
        {"\n"}
        {"    "}
      </div>
      {"\n"}
      {"\n"}
      {"    "}
      {"\n"}
      {"    "}
      {"\n"}
      {"    "}
      {"\n"}
      {"  "}
      {"\n"}
      {"\n"}
      <TocObserver />
    </div>
  );
}
