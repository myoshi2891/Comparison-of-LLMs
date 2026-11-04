import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import { findBySlug } from "@/lib/page-registry";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";
export const metadata: Metadata = {
  title: "Claude Duet 完全ガイド｜初学者向けベストプラクティス",
  description:
    "Claude Duet の導入、依頼、承認、接続アプリと使用量管理を学ぶ初学者向けガイド。情報基準日2026-10-25。",
};
const DIAGRAM_0 = `flowchart TD
  A["初めて触る"] --> B["1章から3章<br/>何者かと用語を知る"]
  B --> C["4章から6章<br/>参加と初期設定と基本操作"]
  C --> D["7章と8章<br/>依頼の書き方と承認の読み方"]
  D --> E["10章<br/>セキュリティの考え方"]
  E --> F["12章<br/>4週間で段階的に導入"]
  F --> G["17章<br/>チェックリストで定着"]`;
const DIAGRAM_1 = `flowchart TD
  You["あなた<br/>スマホか Web"] -->|"メッセージ 文字か音声"| Thread["Duet のスレッド<br/>Tasks と Make"]
  Mem["Claude アカウントの<br/>メモリ スキル コネクタ"] --> Agent["Duet エージェント<br/>Opus 5.5"]
  Thread --> Agent
  Agent --> VM["クラウド上の専用PC"]
  VM --> Conn["接続アプリ<br/>Gmail Calendar Slack など"]
  VM --> Browser["専用ブラウザ<br/>別マシンで隔離"]
  Agent --> Gate["承認ゲート<br/>送信 支払い 署名 削除"]
  Gate -->|"承認カード"| You`;
const DIAGRAM_2 = `flowchart TD
  M["朝<br/>ブリーフが届く"] --> D["日中<br/>依頼を投げる"]
  D --> B["Duet が<br/>バックグラウンドで作業"]
  B --> N{"判断や承認が<br/>必要?"}
  N -->|"はい"| P["通知が届く"]
  P --> R["あなたが確認して返答"]
  R --> B
  N -->|"いいえ"| F["成果物が完成<br/>あなたが完了にする"]`;
const DIAGRAM_3 = `flowchart TD
  S["開始"] --> P{"Pro か Max か Ultra プラン?"}
  P -->|"いいえ"| X1["現時点では対象外<br/>Team と Enterprise は未対応"]
  P -->|"はい"| R{"米国の Claude<br/>アカウント?"}
  R -->|"いいえ"| X2["現時点では対象外<br/>続報を待つ"]
  R -->|"はい"| W["製品ページでウェイトリストに参加"]
  W --> I["順番が来ると招待メールが届く"]
  I --> M{"招待メールのアドレスと<br/>スマホの Apple か Google の<br/>アカウントが一致?"}
  M -->|"いいえ"| X3["一致するアカウントに切り替える"]
  M -->|"はい"| A["アプリを入れて<br/>Claude アカウントでサインイン"]
  A --> OK["数分後に利用開始"]`;
const DIAGRAM_4 = `flowchart TD
  Q["このアプリを<br/>Duet につなぐ?"] --> N{"最初の2週間の目的に<br/>本当に必要?"}
  N -->|"いいえ"| NO["つながない<br/>必要になったら追加"]
  N -->|"はい"| S{"機密性の高い情報が<br/>大量に入っている?"}
  S -->|"はい"| L["共有範囲や接続するアカウントを<br/>自分側で絞ることを検討"]
  S -->|"いいえ"| Y["接続する"]
  L --> Y2["最初は読み取り中心の<br/>依頼から始める"]
  Y --> Y2`;
const DIAGRAM_5 = `flowchart TD
  A["依頼を送る<br/>文字か音声"] --> B["Tasks に登場"]
  B --> C["バックグラウンドで作業"]
  C --> D{"判断や承認が<br/>必要?"}
  D -->|"はい"| E["通知が届く"]
  E --> F["内容を確認して返答"]
  F --> C
  D -->|"いいえ"| G["成果物が Make に並ぶ"]
  G --> H["あなたが完了にする"]`;
const DIAGRAM_6 = `sequenceDiagram
  autonumber
  participant U as あなた
  participant D as Duet
  participant A as 外部アプリ
  U->>D: 督促メールの下書きを依頼
  D->>A: 請求書の情報を読む
  A-->>D: 請求書のデータ
  Note over D: 下書きを作成<br/>安全チェックが意図と機密情報を検査
  D->>U: 承認カードを表示 宛先と内容と全受信者
  U->>D: 承認 または 今はしない
  D->>A: 承認後にのみ送信
  D->>U: 完了を報告`;
const DIAGRAM_7 = `flowchart TD
  C["承認カードが届いた"] --> A{"宛先は想定どおり?<br/>全受信者を確認"}
  A -->|"いいえ"| N1["承認しない<br/>今はしない を選ぶ"]
  A -->|"はい"| B{"本文に<br/>見覚えのない記述や<br/>リンクがある?"}
  B -->|"はい"| N1
  B -->|"いいえ"| M{"金額や日付は<br/>元データと合っている?"}
  M -->|"いいえ"| N2["修正を依頼して再提示"]
  M -->|"はい"| K{"自分が頼んだ範囲を<br/>超えていない?"}
  K -->|"超えている"| N1
  K -->|"超えていない"| OK["承認する"]`;
const DIAGRAM_8 = `flowchart LR
  A["A 信頼できない入力<br/>受信メール Webページ"] --> D((Duet))
  B["B 私的データへのアクセス<br/>接続アプリ メモリ"] --> D
  D --> C["C 外部への送信や状態変更<br/>メール送信 支払い 削除"]
  C --> G["対策<br/>承認ゲートで人が確認"]`;
const DIAGRAM_9 = `flowchart TD
  M["Duet が送ろうとしている<br/>メッセージ"] --> K{"最も厳格な情報を含む?<br/>認証情報 完全なカード番号<br/>完全な口座番号 公的ID"}
  K -->|"はい"| B1["送らない<br/>あなたが頼んでも不可"]
  B1 --> R1["機微な部分を除いた文面を<br/>再提案することがある"]
  K -->|"いいえ"| H{"健康や家計など<br/>同意が必要な情報を含む?"}
  H -->|"はい"| C{"あなたが明示的に<br/>共有を指示または承認した?"}
  C -->|"いいえ"| B2["ブロックされる"]
  C -->|"はい"| OK["承認カードの段階へ進む"]
  H -->|"いいえ"| OK`;
const DIAGRAM_10 = `flowchart TD
  A["接続アプリが増える"] --> B["バックグラウンドで確認する<br/>対象が増える"]
  B --> C["使用量が増える"]
  C --> D["週間枠に近づく<br/>対象アカウントでは5時間枠にも"]
  D --> E["接続を絞る<br/>大きな依頼を分割する"]
  E --> F["使用量が安定する"]`;
const DIAGRAM_11 = `flowchart LR
  W1["第1週<br/>朝ブリーフと<br/>下書きだけ"] --> W2["第2週<br/>1つの定型業務を<br/>任せる"]
  W2 --> W3["第3週<br/>大きな成果物<br/>資料や分析"]
  W3 --> W4["第4週<br/>運用ルール確定<br/>と見直し"]`;
const DIAGRAM_12 = `flowchart LR
  P["困りごと"] --> T{"どれに近い?"}
  T -->|"アプリに入れない"| T1["招待メールのアドレスと<br/>端末のアカウントを確認"]
  T -->|"通知が多すぎる<br/>または少なすぎる"| T2["聞きたい内容と頻度を<br/>言葉で指示する"]
  T -->|"上限にすぐ達する"| T3["確認対象のアプリを減らす<br/>大きな依頼を分割する"]
  T -->|"誤った前提で動く"| T4["メモリを確認して修正<br/>必要ならリセット"]
  T -->|"承認カードが不自然"| T5["承認せず 今はしない を選び<br/>経緯を質問する"]
  T -->|"不具合や誤判断"| T6["チャットで平易な言葉で伝え<br/>報告する"]`;
const THEME = {
  fontFamily: '"Noto Sans JP","Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif',
  fontSize: "16px",
  primaryColor: "#e9ebf8",
  primaryBorderColor: "#343a93",
  primaryTextColor: "#1d1c24",
  lineColor: "#343a93",
  secondaryColor: "#f7edd0",
  tertiaryColor: "#faf7f0",
  noteBkgColor: "#f7edd0",
  actorBkg: "#e9ebf8",
  actorBorder: "#343a93",
  actorTextColor: "#1d1c24",
  signalColor: "#343a93",
  signalTextColor: "#1d1c24",
  labelBoxBkgColor: "#f7edd0",
};
export default function Page() {
  const entry = findBySlug("/claude/duet-best-practices");
  if (!entry) throw new Error("Claude Duet guide is missing from the page registry");
  return (
    <div
      id="duet-guide"
      className={[styles.root, styles.layout].join(" ")}
      data-testid="layout-root"
      data-page="claude-duet"
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/atom-one-dark.min.css"
      />
      {"\n"}
      {"    "}
      <div id="progress"></div>
      {"\n"}
      {"    "}
      <button
        type="button"
        id="duet-backdrop"
        className={styles.overlay}
        aria-label="目次を閉じる"
        tabIndex={-1}
      />
      {"\n"}
      {"    "}
      <nav className={styles.sidebar} id="duet-sidebar" aria-label="目次" data-testid="sidebar-nav">
        {"\n"}
        {"      "}
        <p className={styles.brand}>
          {"Claude Duet"}
          <br />
          {"ベストプラクティス"}
        </p>
        {"\n"}
        {"      "}
        <p className={styles["brand-sub"]}>{"初学者向け / 2026-10-25時点"}</p>
        {"\n"}
        {"      "}
        <a
          className={[styles["nav-a"], styles.active].join(" ")}
          href="#sec-0"
          data-testid="sidebar-nav-link"
          aria-current="location"
        >
          <span className={styles["nav-k"]}>{"CH 0"}</span>
          <span className={styles["nav-t"]}>{"このガイドの読み方"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-1" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 1"}</span>
          <span className={styles["nav-t"]}>{"Claude Duet とは"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-2" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 2"}</span>
          <span className={styles["nav-t"]}>{"全体像を図で理解する"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-3" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 3"}</span>
          <span className={styles["nav-t"]}>{"用語集（初学者向け）"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-4" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 4"}</span>
          <span className={styles["nav-t"]}>{"参加までのステップ（ステップバイステップ）"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-5" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 5"}</span>
          <span className={styles["nav-t"]}>{"初期設定のベストプラクティス"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-6" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 6"}</span>
          <span className={styles["nav-t"]}>{"画面と基本操作"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-7" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 7"}</span>
          <span className={styles["nav-t"]}>{"依頼の書き方（ステップバイステップ）"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-8" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 8"}</span>
          <span className={styles["nav-t"]}>{"承認カードの読み方（最重要）"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-9" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 9"}</span>
          <span className={styles["nav-t"]}>{"ユースケース別レシピ"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-10" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 10"}</span>
          <span className={styles["nav-t"]}>{"セキュリティの考え方"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-11" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 11"}</span>
          <span className={styles["nav-t"]}>{"使用量とコストの管理"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-12" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 12"}</span>
          <span className={styles["nav-t"]}>{"4週間導入ロードマップ（初学者向け）"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-13" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 13"}</span>
          <span className={styles["nav-t"]}>{"限界と既知の制約"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-14" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 14"}</span>
          <span className={styles["nav-t"]}>{"トラブルシューティング"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-15" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 15"}</span>
          <span className={styles["nav-t"]}>{"運用の振り返り（週1回・15分）【分析】"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-16" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 16"}</span>
          <span className={styles["nav-t"]}>
            {"開発者向け補足：Claude Code との関係と学べる設計思想"}
          </span>
        </a>
        <a className={styles["nav-a"]} href="#sec-17" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 17"}</span>
          <span className={styles["nav-t"]}>{"チェックリスト総まとめ"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-18" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 18"}</span>
          <span className={styles["nav-t"]}>{"FAQ"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-19" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 19"}</span>
          <span className={styles["nav-t"]}>{"補足ベストプラクティスと根拠ソース"}</span>
        </a>
        <a className={styles["nav-a"]} href="#sec-20" data-testid="sidebar-nav-link">
          <span className={styles["nav-k"]}>{"CH 20"}</span>
          <span className={styles["nav-t"]}>{"調査メモ（確認できたこと・できなかったこと）"}</span>
        </a>
        {"\n"}
        {"    "}
      </nav>
      {"\n"}
      {"    "}
      <div className={styles.layout}>
        {"\n"}
        {"      "}
        <div className={styles["mobile-bar"]} id="duet-mobile-bar">
          {"\n"}
          {"        "}
          <button
            type="button"
            id="duet-menu"
            aria-label="目次を開く"
            aria-controls="duet-sidebar"
            aria-expanded="false"
          >
            {"目次"}
          </button>
          <span>{"Claude Duet ベストプラクティス"}</span>
          {"\n"}
          {"      "}
        </div>
        {"\n"}
        {"      "}
        <main className={styles.main}>
          {"\n"}
          {"        "}
          <header className={styles.hero}>
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
            <div className={styles.kicker}>{"Claude Duet Beginner's Guide"}</div>
            {"\n"}
            {"          "}
            <h1>{"Claude Duet 完全ガイド"}</h1>
            {"\n"}
            {"          "}
            <span className={styles.sub}>{"初学者向け・ステップバイステップ"}</span>
            {"\n"}
            {"          "}
            <div className={styles["meta-row"]}>
              {"\n"}
              {"            "}
              <div className={styles["meta-card"]}>
                {"\n"}
                {"              "}
                <span className={styles["meta-k"]}>{"対象読者"}</span>
                <span className={styles["meta-v"]}>
                  {"AIエージェントを初めて業務に使う人、小規模事業者、開発者"}
                </span>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <div className={styles["meta-card"]}>
                {"\n"}
                {"              "}
                <span className={styles["meta-k"]}>{"調査基準日"}</span>
                <span className={styles["meta-v"]}>
                  {"2026年10月25日（この日までに確認できた情報に基づく）"}
                </span>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <div className={styles["meta-card"]}>
                {"\n"}
                {"              "}
                <span className={styles["meta-k"]}>{"製品の状態"}</span>
                <span className={styles["meta-v"]}>
                  {"リサーチプレビュー（米国の Pro / Max、ウェイトリスト制）"}
                </span>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <div className={styles["meta-card"]}>
                {"\n"}
                {"              "}
                <span className={styles["meta-k"]}>{"ゴール"}</span>
                <span className={styles["meta-v"]}>
                  {"安全に・無駄なく・失敗しにくく Duet を使い始める"}
                </span>
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
          <section className={styles.section} id="sec-0">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 0"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-0-heading">{"このガイドの読み方"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-0-1">{"0-1. 情報の確度ラベル"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"本文の各所に、情報の出どころを示すラベルを付けています。"}
              <strong>
                {"ラベルを見れば「公式が言っていること」と「筆者の推奨」を区別できます。"}
              </strong>
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"ラベル"}</th>
                    <th>{"意味"}</th>
                    <th>{"例"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"【公式】"}</td>
                    <td>{"Anthropic の公式ページ・ヘルプ・発表記事で確認できた事実"}</td>
                    <td>{"送信・支払い・署名・削除の前に承認を求めるよう設計されている"}</td>
                  </tr>
                  <tr>
                    <td>{"【開発者】"}</td>
                    <td>{"著名な国際的開発者・評論家などの公開発信"}</td>
                    <td>{"Simon Willison の安全性に関する見解"}</td>
                  </tr>
                  <tr>
                    <td>{"【分析】"}</td>
                    <td>{"上記の事実をもとにした筆者の整理・推奨（公式の約束ではない）"}</td>
                    <td>{"最初の1週間は下書きだけにする"}</td>
                  </tr>
                  <tr>
                    <td>{"【未確認】"}</td>
                    <td>{"調査時点で確認できなかった事項"}</td>
                    <td>{"確認の正確な間隔"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-0-2">{"0-2. 読み進め方（おすすめ順）"}</h3>
            {"\n"}
            {"          "}
            <figure className={styles["diagram-card"]}>
              {"\n"}
              {"            "}
              <div className={styles["diagram-wrap"]}>
                <div className={styles["diagram-canvas"]} data-diagram-id="d0">
                  <MermaidDiagram chart={DIAGRAM_0} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <div className={styles.callout} data-variant="info">
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                <strong>{"注意（同名の別製品）"}</strong>
                {": 「Duet」は他にも存在します。たとえば Decagon"}
                {"\n"}
                {"              "}
                {"社の AI エージェント改善ツール「Decagon Duet」、Claude Code"}
                {"\n"}
                {"              "}
                {"向けのコミュニティ製プラグイン「duet」（GitHub）などは"}
                {"\n"}
                {"              "}
                <strong>{"Claude Duet とは別物"}</strong>
                {"です。検索するときは必ず「Claude"}
                {"\n"}
                {"              "}
                {"Duet」＋「Anthropic」で調べてください（出典は19章）。"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"        "}
          </section>
          {"\n"}
          {"        "}
          <section className={styles.section} id="sec-1">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 1"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-1-heading">{"Claude Duet とは"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-1-1">{"1-1. 3行で理解する"}</h3>
            {"\n"}
            {"          "}
            <ol>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <strong>{"メッセージで仕事を任せる AI エージェント"}</strong>
                {"です。文字でも音声でも依頼できます。【公式】"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <strong>{"クラウド上に自分専用のコンピューター"}</strong>
                {"を持ち、アプリを閉じてもスマホや"}
                {"\n"}
                {"              "}
                {"PC の電源が切れていても作業を続けます。【公式】"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <strong>
                  {"送信・支払い・署名・削除の前には、あなたの承認を求めるように設計されています。"}
                </strong>
                {"【公式】"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"          "}
            </ol>
            {"\n"}
            {"          "}
            <h3 id="sec-1-2">{"1-2. 普段の Claude との違い"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"観点"}</th>
                    <th>{"Claude（いつものアプリ）"}</th>
                    <th>{"Claude Duet"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"主導権"}</td>
                    <td>{"あなたがチャットを開いて始める"}</td>
                    <td>
                      <strong>{"Duet の側から"}</strong>
                      {"朝のブリーフや確認依頼を届ける"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"作業の場所"}</td>
                    <td>{"会話の中、あなたと並走"}</td>
                    <td>
                      {"クラウド上の専用 PC で"}
                      <strong>{"バックグラウンド作業"}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{"仕事の単位"}</td>
                    <td>{"1回の会話"}</td>
                    <td>{"1本のスレッド＋タスク一覧＋成果物"}</td>
                  </tr>
                  <tr>
                    <td>{"引き継ぐもの"}</td>
                    <td>{"—"}</td>
                    <td>
                      {"Claude アカウントの"}
                      <strong>{"メモリ・スキル・接続済みアプリ"}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{"想定ユーザー"}</td>
                    <td>{"幅広い"}</td>
                    <td>{"仕事を多数抱える専門職・小規模事業者"}</td>
                  </tr>
                  <tr>
                    <td>{"提供形態"}</td>
                    <td>{"各アプリ"}</td>
                    <td>
                      <strong>{"独立したアプリ"}</strong>
                      {"（iOS / Android）。PC では claude.ai"}
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <p>{"【公式】出典: 製品ページ FAQ・発表記事"}</p>
            {"\n"}
            {"          "}
            <h3 id="sec-1-3">{"1-3. いまの提供状況（2026-10-25 時点）"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"項目"}</th>
                    <th>{"状況"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"公開日"}</td>
                    <td>{"2026-10-21（リサーチプレビュー）"}</td>
                  </tr>
                  <tr>
                    <td>{"入手方法"}</td>
                    <td>
                      <strong>{"ウェイトリスト"}</strong>
                      {"（順次招待）"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"対象プラン"}</td>
                    <td>
                      <strong>{"Pro / Max / Ultra"}</strong>
                      {"（Team / Enterprise は未対応）"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"対象地域"}</td>
                    <td>
                      <strong>{"米国のみ"}</strong>
                      {"（米国の Claude アカウントが必要）"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"搭載モデル"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"Claude Opus 5.5（"}
                      <strong>{"モデルの選択は不可"}</strong>
                      {"。作業量は Duet が判断）"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"料金"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"研究プレビュー中は Pro / Max / Ultra に追加料金なし。"}
                      <strong>{"使用上限は他の Claude と共有"}</strong>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"接続できるもの"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"6,000 以上のコネクタとプラグイン（Gmail・Google"}
                      {"\n"}
                      {"                    "}
                      {
                        "Calendar・Slack・QuickBooks・Stripe・HubSpot・Docusign・Gusto・Notion・Canva"
                      }
                      {"\n"}
                      {"                    "}
                      {"など）"}
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
            <p>{"【公式】出典: 製品ページ、発表記事、ヘルプセンター「Claude Duet を始める」"}</p>
            {"\n"}
            {"        "}
          </section>
          {"\n"}
          {"        "}
          <section className={styles.section} id="sec-2">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 2"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-2-heading">{"全体像を図で理解する"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-2-1">{"2-1. 仕組みの地図"}</h3>
            {"\n"}
            {"          "}
            <figure className={styles["diagram-card"]}>
              {"\n"}
              {"            "}
              <div className={styles["diagram-wrap"]}>
                <div className={styles["diagram-canvas"]} data-diagram-id="d1">
                  <MermaidDiagram chart={DIAGRAM_1} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              <strong>{"読み方"}</strong>
              {": あなたは「スレッド」に話しかけるだけです。Duet は Claude"}
              {"\n"}
              {"            "}
              {"アカウントの記憶と接続アプリを使い、クラウド上の専用 PC で作業します。"}
              <strong>
                {
                  "送信・支払い・署名・削除といった操作の前には、あなたに承認を求めるよう設計されています。"
                }
              </strong>
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-2-2">{"2-2. 1日の流れ（典型例）"}</h3>
            {"\n"}
            {"          "}
            <figure className={styles["diagram-card"]}>
              {"\n"}
              {"            "}
              <div className={styles["diagram-wrap"]}>
                <div className={styles["diagram-canvas"]} data-diagram-id="d2">
                  <MermaidDiagram chart={DIAGRAM_2} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"        "}
          </section>
          {"\n"}
          {"        "}
          <section className={styles.section} id="sec-3">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 3"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-3-heading">{"用語集（初学者向け）"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"用語"}</th>
                    <th>{"やさしい説明"}</th>
                    <th>{"本ガイドでの注意点"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{"エージェント"}</strong>
                    </td>
                    <td>
                      {"指示を受けて、自分で手順を考えて道具（アプリ）を使い、作業を進める AI"}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"「答えるだけ」の AI と違い、"}
                      <strong>{"実際に行動する"}</strong>
                      {"ため権限管理が重要"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"プロアクティブ"}</strong>
                    </td>
                    <td>{"頼まれる前に、必要そうなことを見つけて先に動くこと"}</td>
                    <td>
                      {"便利な反面、"}
                      <strong>{"通知が多すぎたり少なすぎたり"}</strong>
                      {"する調整が要る"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"コネクタ"}</strong>
                    </td>
                    <td>{"Duet が外部アプリ（Gmail など）を使えるようにする接続"}</td>
                    <td>
                      {"つなぐほど便利だが、"}
                      <strong>{"つなぐほど守るものが増える"}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"承認（Approval）"}</strong>
                    </td>
                    <td>{"Duet が行動の前に「これをやります」と見せ、あなたの OK を待つ仕組み"}</td>
                    <td>
                      {"一番大切な安全装置。"}
                      <strong>{"中身を読んで押す"}</strong>
                      {"ことが肝心"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"プロンプトインジェクション"}</strong>
                    </td>
                    <td>{"メールや Web ページに紛れ込んだ「AI への悪意ある指示」"}</td>
                    <td>
                      {"Duet はメールや Web を読むため、"}
                      <strong>{"避けて通れないリスク"}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"リサーチプレビュー"}</strong>
                    </td>
                    <td>{"完成品ではなく、利用者の声で改善している段階"}</td>
                    <td>
                      {"重要業務に全面依存せず、"}
                      <strong>{"小さく試す"}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"ウェイトリスト"}</strong>
                    </td>
                    <td>{"順番待ちの登録リスト"}</td>
                    <td>{"登録しても日付は保証されない"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"使用上限（週間・5時間）"}</strong>
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {
                        "プランごとに決まった利用量の枠。週間の上限はすべてのアカウントに適用され、5時間の上限とそのリセットは対象となるアカウントにのみ適用される（認証済みの"
                      }
                      {"\n"}
                      {"                    "}
                      {"Ultra アカウントは週間の上限の対象だが、5時間の上限はない）"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>
                      {"Duet の"}
                      <strong>{"裏の確認作業もこの枠を消費"}</strong>
                      {"する"}
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
          {"        "}
          <section className={styles.section} id="sec-4">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 4"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-4-heading">{"参加までのステップ（ステップバイステップ）"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-4-1">{"4-1. 参加できるかの判定"}</h3>
            {"\n"}
            {"          "}
            <figure className={styles["diagram-card"]}>
              {"\n"}
              {"            "}
              <div className={styles["diagram-wrap"]}>
                <div className={styles["diagram-canvas"]} data-diagram-id="d3">
                  <MermaidDiagram chart={DIAGRAM_3} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <h3 id="sec-4-2">{"4-2. 手順"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              <strong>{"Step 1　製品ページを開く"}</strong>
              <br />
              {"\n"}
              {"            "}
              <a
                href="https://claude.com/product/claude-duet"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://claude.com/product/claude-duet"}
              </a>
              {"\n"}
              {"            "}
              {"で「ウェイトリストに参加」を選びます。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              <strong>{"Step 2　情報を入力する"}</strong>
              <br />
              {"\n"}
              {"            "}
              {"名前とメールアドレスを入れます。すでに Claude を使っているなら、"}
              <strong>{"Claude アカウントと同じメールアドレス"}</strong>
              {"にします（アクセスはそのアドレスに紐づくため）。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              <strong>{"Step 3　プランと端末を選び、最初に任せたいことを書く"}</strong>
              <br />
              {"\n"}
              {"            "}
              {"Claude のプラン、iPhone か Android か、何をしているか、Duet"}
              {"\n"}
              {"            "}
              {"に最初に任せたいことを書く欄があります。"}
              <strong>{"具体的に書くほど、プレビューの改善に役立ちます。"}</strong>
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              <strong>{"Step 4　招待を待つ"}</strong>
              <br />
              {"\n"}
              {"            "}
              {"招待は段階的に届きます。登録しても日付の保証はありません。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              <strong>{"Step 5　招待メールをスマホで開く"}</strong>
              <br />
              {"\n"}
              {"            "}
              {"提供したメールアドレスに紐づく Apple / Google"}
              {"\n"}
              {"            "}
              {"アカウントで、案内に従ってアプリを入れます。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              <strong>{"Step 6　サインインする"}</strong>
              <br />
              {"\n"}
              {"            "}
              {"Claude"}
              {"\n"}
              {"            "}
              {
                "アカウントでサインインします。招待の承認後、使えるようになるまで数分かかることがあります。"
              }
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <p>{"【公式】出典: ヘルプセンター「Claude Duet を始める」"}</p>
            {"\n"}
            {"          "}
            <h3 id="sec-4-3">{"4-3. 「まだ使えない」ときの原因"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
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
                    <td>{"招待がまだ来ていない"}</td>
                    <td>{"順次送付のため待つ。日付の保証はない"}</td>
                  </tr>
                  <tr>
                    <td>{"米国外のアカウント"}</td>
                    <td>{"現時点では対象外"}</td>
                  </tr>
                  <tr>
                    <td>{"Team / Enterprise プラン"}</td>
                    <td>{"現時点では対象外（今後対応予定とされている）"}</td>
                  </tr>
                  <tr>
                    <td>{"登録メールとアカウントが不一致"}</td>
                    <td>{"登録メールに紐づく Apple / Google アカウントで入る"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-4-4">{"4-4. 招待が来るまでにやっておくこと【分析】"}</h3>
            {"\n"}
            {"          "}
            <p>{"待ち時間を使って、次の準備をしておくとスムーズです。"}</p>
            {"\n"}
            {"          "}
            <ol>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <strong>{"接続したいアプリの棚卸し"}</strong>
                {"（本当に最初の2週間で必要なものだけに絞る）"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <strong>{"Claude 側のメモリを見直す"}</strong>
                {"（Duet は Claude"}
                {"\n"}
                {"              "}
                {"のメモリを引き継ぐため、誤った記憶があれば直す）"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <strong>{"「任せたいこと」「任せたくないこと」を3つずつ書く"}</strong>
                {"（8章の承認ルールの下書きになる）"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                <strong>{"同名の別製品と混同しない"}</strong>
                {"（0章の注意参照）"}
              </li>
              {"\n"}
              {"          "}
            </ol>
            {"\n"}
            {"        "}
          </section>
          {"\n"}
          {"        "}
          <section className={styles.section} id="sec-5">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 5"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-5-heading">{"初期設定のベストプラクティス"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-5-1">{"5-1. 最初の原則：「つなぐ範囲は最小から」【分析】"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"Duet"}
              {"\n"}
              {"            "}
              {"は接続したアプリの中身を読み、メッセージを送れます。つまり、"}
              <strong>{"「私的なデータを読める」×「外部の文章を読む」×「外へ送れる」"}</strong>
              {
                "がそろいます（10章で詳しく説明）。だからこそ、最初は接続を絞るのが安全で、使用量の節約にもなります。"
              }
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <figure className={styles["diagram-card"]}>
              {"\n"}
              {"            "}
              <div className={styles["diagram-wrap"]}>
                <div className={styles["diagram-canvas"]} data-diagram-id="d4">
                  <MermaidDiagram chart={DIAGRAM_4} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <h3 id="sec-5-2">{"5-2. 推奨する接続の順序【分析】"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"順番"}</th>
                    <th>{"接続するもの"}</th>
                    <th>{"理由"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"1"}</td>
                    <td>{"メール（Gmail）＋カレンダー"}</td>
                    <td>{"朝のブリーフの中心。下書き中心で安全に試せる"}</td>
                  </tr>
                  <tr>
                    <td>{"2"}</td>
                    <td>{"ドキュメント／ストレージ（Google Drive など）"}</td>
                    <td>{"資料・要約・準備作業で効果が出やすい"}</td>
                  </tr>
                  <tr>
                    <td>{"3"}</td>
                    <td>{"チャット（Slack）"}</td>
                    <td>{"公式に「制限付きで動作」とあるため、挙動を見ながら"}</td>
                  </tr>
                  <tr>
                    <td>{"4"}</td>
                    <td>{"業務システム（QuickBooks・Stripe・HubSpot など）"}</td>
                    <td>{"金銭や顧客情報に関わるため、慣れてから"}</td>
                  </tr>
                  <tr>
                    <td>{"5"}</td>
                    <td>{"決済（Link・Shop Pay）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {
                        "承認の読み方に慣れてから最後に。Link・Shop Pay はコネクタのディレクトリではなく"
                      }
                      {"\n"}
                      {"                    "}
                      <strong>{"Claude Duet 内で接続"}</strong>
                      {"する"}
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
            <p>
              {"\n"}
              {"            "}
              {"【公式】接続は自分で開始し、いつでも切断できます。切断すると"}
              <strong>{"その時点から新たなアクセスは止まります"}</strong>
              {"が、"}
              <strong>{"すでにメモリに保持された情報は切断しても消えません"}</strong>
              {"。不要な記憶は"}
              <strong>{"個別に確認して削除"}</strong>
              {"でき、"}
              <strong>{"すべての記憶を消したい場合にだけメモリのリセット"}</strong>
              {"を使います。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-5-3">{"5-3. 設定の確認ポイント"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"設定"}</th>
                    <th>{"確認すること"}</th>
                    <th>{"公式の根拠"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"接続アプリ"}</td>
                    <td>{"不要なものが接続されていないか。Claude 側で切ると Duet 側も切れる"}</td>
                    <td>{"安全性の記事"}</td>
                  </tr>
                  <tr>
                    <td>{"メモリ"}</td>
                    <td>
                      {"古い情報・誤った情報が残っていないか（Duet は Claude のメモリを使う）"}
                    </td>
                    <td>{"発表記事・安全性の記事"}</td>
                  </tr>
                  <tr>
                    <td>{"過去チャットの検索"}</td>
                    <td>{"使いたくなければ、設定の「チャットを検索して参照」をオフにする"}</td>
                    <td>{"ヘルプセンター"}</td>
                  </tr>
                  <tr>
                    <td>{"通知の頻度"}</td>
                    <td>{"「何を・どのくらいの頻度で知らせてほしいか」を言葉で伝えられる"}</td>
                    <td>{"発表記事"}</td>
                  </tr>
                  <tr>
                    <td>{"メモリのリセット"}</td>
                    <td>{"アプリの設定からいつでも実行できる"}</td>
                    <td>{"安全性の記事"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-5-4">{"5-4. 最初に送る「自己紹介メッセージ」テンプレート【分析】"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"最初の一通で、"}
              <strong>{"あなたの仕事の優先順位と、Duet の動き方のルール"}</strong>
              {"を伝えておくと、その後の判断精度が上がります。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={styles["code-head"]}>
                {"\n"}
                {"              "}
                <span className={styles["code-lang"]}>{"Markdown"}</span>
                <button type="button" className={styles["copy-btn"]} data-copy-code>
                  {"コピー"}
                </button>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <pre>
                <code className={["language-markdown"].join(" ")}>
                  <div className={styles.codeLine}>
                    {"はじめまして。次の前提で動いてください。"}
                    {"\n"}
                    {"\n"}
                    <span className="hljs-section">{"## 私の仕事"}</span>
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"役割: （例）ECショップの運営者。従業員10人"}
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {
                      "毎日いちばん大事にしたいこと: （例）顧客対応の遅れをなくす、資金繰りを把握する"
                    }
                    {"\n"}
                    {"\n"}
                    <span className="hljs-section">{"## 知らせてほしいこと"}</span>
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"すぐ知らせる: 顧客からのクレーム、支払い期限が24時間以内のもの"}
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"朝のブリーフにまとめる: 返信が必要なメール、今日の会議の準備"}
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"知らせなくてよい: メルマガ、自動通知"}
                    {"\n"}
                    {"\n"}
                    <span className="hljs-section">{"## ルール"}</span>
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"外部に送る前は、必ず私の承認を取ってください。"}
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"数字や要約を出すときは、元のメール・ファイル名を添えてください。"}
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"迷ったら、実行せず先に質問してください。"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"        "}
          </section>
          {"\n"}
          {"        "}
          <section className={styles.section} id="sec-6">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 6"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-6-heading">{"画面と基本操作"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-6-1">{"6-1. 3つの場所を覚える"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"場所"}</th>
                    <th>{"役割"}</th>
                    <th>{"使いどころ"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{"メインスレッド"}</strong>
                    </td>
                    <td>{"1本の会話。中断したところから再開できる"}</td>
                    <td>{"軽い依頼、雑談、方針の相談"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"Tasks（タスク）"}</strong>
                    </td>
                    <td>{"Duet が取り組んでいる作業の一覧。入力が必要なものが目立つ"}</td>
                    <td>
                      {"進捗確認、"}
                      <strong>{"割り込みで方向修正"}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"Make"}</strong>
                    </td>
                    <td>{"完成した成果物（資料・表・ダッシュボードなど）が並ぶ"}</td>
                    <td>{"レビューして編集・利用"}</td>
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
              {"【公式】Tasks"}
              {"\n"}
              {"            "}
              {"タブでは入力が必要なタスクが強調され、メインスレッドは静かに保たれます。Duet"}
              {"\n"}
              {"            "}
              {"は「完了」を提案できますが、"}
              <strong>{"完了にできるのはあなただけ"}</strong>
              {"です。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-6-2">{"6-2. チャネルで話題を分ける【公式】"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"トピックごとに別のチャネルを作れます。"}
              <strong>{"メモリは共有"}</strong>
              {"されるので、話題を混ぜずに文脈だけ引き継げます。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"チャネル例"}</th>
                    <th>{"用途"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"採用"}</td>
                    <td>{"候補者との日程調整、求人文の下書き"}</td>
                  </tr>
                  <tr>
                    <td>{"経理"}</td>
                    <td>{"未払い請求書の確認、督促の下書き"}</td>
                  </tr>
                  <tr>
                    <td>{"資金調達"}</td>
                    <td>{"資料の更新、想定問答"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-6-3">{"6-3. 依頼のライフサイクル"}</h3>
            {"\n"}
            {"          "}
            <figure className={styles["diagram-card"]}>
              {"\n"}
              {"            "}
              <div className={styles["diagram-wrap"]}>
                <div className={styles["diagram-canvas"]} data-diagram-id="d5">
                  <MermaidDiagram chart={DIAGRAM_5} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <h3 id="sec-6-4">{"6-4. 中断・修正の基本【公式＋分析】"}</h3>
            {"\n"}
            {"          "}
            <ul>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"作業中でも、Duet"}
                {"\n"}
                {"              "}
                {"が何をしているかを見て、"}
                <strong>{"途中で方向を修正（steer）"}</strong>
                {"できます。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"すぐに承認できないときは、"}
                <strong>{"Duet が残りを進めて、後で承認を再提示"}</strong>
                {"します。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"画面の「今はしない」を選ぶのは、"}
                <strong>{"不安があるときの正しい選択"}</strong>
                {"です。承認は後に回せますが、"}
                <strong>{"影響がないとは限りません"}</strong>
                {
                  "。締め切りのある作業や、保留によって生じる副作用（返信や支払いの遅れなど）がないかを確認してください。"
                }
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
          {"        "}
          <section className={styles.section} id="sec-7">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 7"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-7-heading">{"依頼の書き方（ステップバイステップ）"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-7-1">{"7-1. 基本の型：5つの要素【分析】"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"Claude Code の開発者 Boris Cherny は、Claude"}
              {"\n"}
              {"            "}
              {"への指示について「同僚に話すように、"}
              <strong>{"何をしたいか・どれだけ力を入れるか・どう検証するか"}</strong>
              {"を伝えればよい」という趣旨を述べています【開発者・二次報道】。この考え方は"}
              {"\n"}
              {"            "}
              {"Duet にもそのまま使えます。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"要素"}</th>
                    <th>{"書くこと"}</th>
                    <th>{"悪い例 → 良い例"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"① ゴール"}</td>
                    <td>{"最終的に何がほしいか"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"「請求書どうなってる？」→「"}
                      <strong>{"未払い請求書を一覧にして、期限が近い順に並べて"}</strong>
                      {"」"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"② 完了条件"}</td>
                    <td>{"どうなったら終わりか"}</td>
                    <td>
                      {"「資料を作って」→「"}
                      <strong>{"12枚以内で、数字は第3四半期の最新値"}</strong>
                      {"」"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"③ 制約"}</td>
                    <td>{"触ってはいけないもの・守る線"}</td>
                    <td>
                      {"「連絡して」→「"}
                      <strong>{"社外には送らず、下書きまでで止めて"}</strong>
                      {"」"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"④ 承認の境界"}</td>
                    <td>{"どこで必ず確認を取るか"}</td>
                    <td>
                      {"「全部やっておいて」→「"}
                      <strong>{"送信と支払いの前は必ず確認"}</strong>
                      {"」"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"⑤ 根拠の提示"}</td>
                    <td>{"数字や要約の出どころ"}</td>
                    <td>
                      {"「売上は？」→「"}
                      <strong>{"どのファイル・メール由来か添えて"}</strong>
                      {"」"}
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={styles.callout} data-variant="info">
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"【公式】Duet"}
                {"\n"}
                {"              "}
                {"は、数字や要約を出すときに"}
                <strong>{"どのメール・ファイル・スプレッドシート由来かを伝える"}</strong>
                {
                  "ように設計されています。⑤はその挙動を強めるだけなので、毎回の依頼で添える習慣にしておくと、後の"
                }
                <strong>{"検証"}</strong>
                {"がとても楽になります。"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-7-2">{"7-2. 依頼テンプレート（コピーして使う）"}</h3>
            {"\n"}
            {"          "}
            <p>
              <strong>{"テンプレート A：調べて下書きまで（安全な基本形）"}</strong>
            </p>
            {"\n"}
            {"          "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={styles["code-head"]}>
                {"\n"}
                {"              "}
                <span className={styles["code-lang"]}>{"Markdown"}</span>
                <button type="button" className={styles["copy-btn"]} data-copy-code>
                  {"コピー"}
                </button>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <pre>
                <code className={["language-markdown"].join(" ")}>
                  <div className={styles.codeLine}>
                    <span className="hljs-section">{"# 依頼"}</span>
                    {"\n"}
                    {"未払い請求書を確認して、督促メールの下書きを作ってください。"}
                    {"\n"}
                    {"\n"}
                    <span className="hljs-section">{"# 完了条件"}</span>
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"期限超過の請求書を、金額の大きい順に一覧にする"}
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"各社への督促メールを下書きにする（丁寧な文面、3文以内）"}
                    {"\n"}
                    {"\n"}
                    <span className="hljs-section">{"# 制約"}</span>
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span> {"送信はしない。下書きだけ作る"}
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span> {"取引先の機密情報は文面に入れない"}
                    {"\n"}
                    {"\n"}
                    <span className="hljs-section">{"# 根拠"}</span>
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"一覧には、請求書番号と元データの場所を添える"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <p>
              <strong>{"テンプレート B：会議の準備"}</strong>
            </p>
            {"\n"}
            {"          "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={styles["code-head"]}>
                {"\n"}
                {"              "}
                <span className={styles["code-lang"]}>{"Markdown"}</span>
                <button type="button" className={styles["copy-btn"]} data-copy-code>
                  {"コピー"}
                </button>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <pre>
                <code className={["language-markdown"].join(" ")}>
                  <div className={styles.codeLine}>
                    <span className="hljs-section">{"# 依頼"}</span>
                    {"\n"}
                    {"今日14時の打ち合わせに向けて、相手企業の簡単なブリーフを作ってください。"}
                    {"\n"}
                    {"\n"}
                    <span className="hljs-section">{"# 完了条件"}</span>
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"相手企業の概要、直近のニュース、過去のやり取りの要約"}
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span> {"2分で読める分量"}
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span> {"私が確認すべき論点を3つ"}
                    {"\n"}
                    {"\n"}
                    <span className="hljs-section">{"# 根拠"}</span>
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"出典URLを必ず添える。確認できなかった点は「未確認」と書く"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <p>
              <strong>{"テンプレート C：大きな成果物（資料・分析）"}</strong>
            </p>
            {"\n"}
            {"          "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={styles["code-head"]}>
                {"\n"}
                {"              "}
                <span className={styles["code-lang"]}>{"Markdown"}</span>
                <button type="button" className={styles["copy-btn"]} data-copy-code>
                  {"コピー"}
                </button>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <pre>
                <code className={["language-markdown"].join(" ")}>
                  <div className={styles.codeLine}>
                    <span className="hljs-section">{"# 依頼"}</span>
                    {"\n"}
                    {"第3四半期の実績を反映した投資家向け資料を更新してください。"}
                    {"\n"}
                    {"\n"}
                    <span className="hljs-section">{"# 完了条件"}</span>
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span> {"12枚以内"}
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"数字は最新の会計データと一致させる"}
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"私の確認が必要なスライドには印を付ける"}
                    {"\n"}
                    {"\n"}
                    <span className="hljs-section">{"# 承認の境界"}</span>
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"外部へ共有する前に、必ず私に見せる"}
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"数字が元データと合わない箇所は、推測で埋めず質問する"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-7-3">{"7-3. 音声で依頼するときのコツ【分析】"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"公式の利用例には、"}
              <strong>{"歩きながら頭の中の to-do を話す"}</strong>
              {"という使い方があります（Anthropic"}
              {"\n"}
              {"            "}
              {"の社内利用）。音声はテキストよりも曖昧になりやすいので、次の順で話すと伝わります。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <ol>
              {"\n"}
              {"            "}
              <li>
                {"「"}
                <strong>{"ゴールは〜"}</strong>
                {"」（何がほしいか）"}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"「"}
                <strong>{"今日中に"}</strong>
                {"／"}
                <strong>{"明日の朝までに"}</strong>
                {"」（期限）"}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"「"}
                <strong>{"送る前に確認して"}</strong>
                {"」（承認の境界）"}
              </li>
              {"\n"}
              {"          "}
            </ol>
            {"\n"}
            {"          "}
            <h3 id="sec-7-4">{"7-4. 「いい依頼」の自己チェック"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"チェック"}</th>
                    <th>{"はい/いいえ"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"完了の状態が一文で言える"}</td>
                    <td>{"□"}</td>
                  </tr>
                  <tr>
                    <td>{"「送る・払う・消す」を含むなら、承認を取るよう書いた"}</td>
                    <td>{"□"}</td>
                  </tr>
                  <tr>
                    <td>{"数字や要約には出どころを添えるよう頼んだ"}</td>
                    <td>{"□"}</td>
                  </tr>
                  <tr>
                    <td>{"1つの依頼に詰め込みすぎていない（大きければ分割した）"}</td>
                    <td>{"□"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"緊急のものは、Duet の確認間隔に頼らず"}
                      <strong>{"自分でも見る"}</strong>
                      {"前提にした"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"□"}</td>
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
          {"        "}
          <section className={styles.section} id="sec-8">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 8"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-8-heading">{"承認カードの読み方（最重要）"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-8-1">{"8-1. 承認の流れ"}</h3>
            {"\n"}
            {"          "}
            <figure className={styles["diagram-card"]}>
              {"\n"}
              {"            "}
              <div className={styles["diagram-wrap"]}>
                <div className={styles["diagram-canvas"]} data-diagram-id="d6">
                  <MermaidDiagram chart={DIAGRAM_6} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"【公式】承認カードには、"}
              <strong>{"操作の内容・宛先・本文・全受信者"}</strong>
              {"が表示されます。また、モデルとは別の自動チェックが各操作の横で動き、"}
              <strong>{"意図に合っているかを評価"}</strong>
              {"します。このチェックはモデルの外側で動くため、Web"}
              {"\n"}
              {"            "}
              {"ページに仕込まれた指示では結果を左右できません。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-8-2">{"8-2. 承認が必要な操作・禁止されている操作"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"区分"}</th>
                    <th>{"操作"}</th>
                    <th>{"扱い"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"承認が必要"}</td>
                    <td>{"メッセージ（メール）の送信"}</td>
                    <td>{"承認カードで確認"}</td>
                  </tr>
                  <tr>
                    <td>{"承認が必要"}</td>
                    <td>{"支払い"}</td>
                    <td>{"承認カードで確認"}</td>
                  </tr>
                  <tr>
                    <td>{"承認が必要"}</td>
                    <td>{"購入（Link・Shop Pay）"}</td>
                    <td>{"承認カードに加え、決済アプリ側でも承認（Link など）"}</td>
                  </tr>
                  <tr>
                    <td>{"承認が必要"}</td>
                    <td>{"文書への署名"}</td>
                    <td>{"承認カードで確認"}</td>
                  </tr>
                  <tr>
                    <td>{"承認が必要"}</td>
                    <td>{"何かの削除"}</td>
                    <td>{"承認カードで確認"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"「今後は聞かないで」が"}
                      <strong>{"使えない"}</strong>
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {
                        "購入時の支払い、注文の削除、アカウントの新規作成（口座間の資金移動は含まない。下の行のとおり禁止）"
                      }
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"何度承認しても毎回確認"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"承認しても"}
                      <strong>{"禁止"}</strong>
                    </td>
                    <td>{"有価証券の取引、口座間の資金移動、他人のアカウントへのアクセス"}</td>
                    <td>{"実行されない"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <p>{"【公式】出典: 発表記事、安全性の記事、ヘルプセンター"}</p>
            {"\n"}
            {"          "}
            <h3 id="sec-8-3">{"8-3. 承認カードは「コードレビュー」と同じ目で見る【分析】"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"承認を機械的に押す習慣は、"}
              <strong>{"承認疲れ（approval fatigue）"}</strong>
              {
                "を招きます。公式の安全性の記事も、承認の頻度の調整が難しい課題であることを認めています。Simon"
              }
              {"\n"}
              {"            "}
              {"Willison"}
              {"\n"}
              {"            "}
              {
                "も、確認を求め続けるだけでは人が安全に動かなくなる、という趣旨を指摘しています【開発者】。次の4点だけは、毎回目で確認してください。"
              }
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <figure className={styles["diagram-card"]}>
              {"\n"}
              {"            "}
              <div className={styles["diagram-wrap"]}>
                <div className={styles["diagram-canvas"]} data-diagram-id="d7">
                  <MermaidDiagram chart={DIAGRAM_7} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"見るポイント"}</th>
                    <th>{"具体的に何を見るか"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"宛先"}</td>
                    <td>
                      {"全員が想定どおりか。"}
                      <strong>{"CC や BCC に見知らぬアドレスがないか"}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{"本文"}</td>
                    <td>{"頼んでいない内容、不自然なリンク、急かす文面がないか"}</td>
                  </tr>
                  <tr>
                    <td>{"数字"}</td>
                    <td>{"金額・日付が、元のメールやファイルと一致しているか"}</td>
                  </tr>
                  <tr>
                    <td>{"範囲"}</td>
                    <td>{"「下書きまで」と頼んだのに、送信や支払いに進んでいないか"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-8-4">{"8-4. 不安なときの動き方"}</h3>
            {"\n"}
            {"          "}
            <ol>
              {"\n"}
              {"            "}
              <li>
                <strong>{"「今はしない」を押す。"}</strong>
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"チャットで「"}
                <strong>{"なぜこの宛先・この内容にしたのか、根拠を示して"}</strong>
                {"」と聞く。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"納得できなければ、"}
                <strong>{"接続を一時的に切る"}</strong>
                {"ことも選べる（切るとその時点から新規アクセスが止まる）。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"異常だと感じたら、チャットで状況を平易な言葉で伝え、"}
                <strong>{"報告"}</strong>
                {"する（公式の機能）。"}
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
          {"        "}
          <section className={styles.section} id="sec-9">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 9"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-9-heading">{"ユースケース別レシピ"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={styles.callout} data-variant="info">
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"以下の例は、公式の利用例や発表記事の内容をもとに、"}
                <strong>{"初学者がそのまま試せる形"}</strong>
                {
                  "に整えたものです【公式＋分析】。最初は「下書きまで」で止めて、結果を見てから承認に進みましょう。"
                }
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-9-1">{"9-1. 朝のブリーフを使いこなす"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"【公式】毎朝、接続アプリを確認して最重要事項を選び、返信の下書きなど"}
              <strong>{"最初の一歩"}</strong>
              {"を進めたうえで要点を届けます。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"ステップ"}</th>
                    <th>{"やること"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"1"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"最初の1週間は、ブリーフの"}
                      <strong>{"項目の並び順と粒度"}</strong>
                      {"だけを観察する"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"2"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"「多すぎる」「足りない」を言葉で伝える（例：「採用と資金繰り以外は不要」）"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"3"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {
                        "良かった項目には「これは今後も」、不要な項目には「これは次から不要」と明示する"
                      }
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"4"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"1週間後、ブリーフの内容が"}
                      <strong>{"自分の優先順位と一致"}</strong>
                      {"しているか見直す"}
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
            <h3 id="sec-9-2">{"9-2. 未払い請求書の確認と督促"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={styles["code-head"]}>
                {"\n"}
                {"              "}
                <span className={styles["code-lang"]}>{"Markdown"}</span>
                <button type="button" className={styles["copy-btn"]} data-copy-code>
                  {"コピー"}
                </button>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <pre>
                <code className={["language-markdown"].join(" ")}>
                  <div className={styles.codeLine}>
                    {"Stripe（または QuickBooks）で未払いの請求書を確認し、"}
                    {"\n"}
                    {"期限超過のものを一覧にしてください。"}
                    {"\n"}
                    {"各取引先への督促メールを下書きにして、私の承認待ちにしてください。"}
                    {"\n"}
                    {"送信はしないでください。"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"【公式】Duet"}
              {"\n"}
              {"            "}
              {"は、請求書の確認とリマインダーの下書きを行い、"}
              <strong>{"送信前に承認を求めます"}</strong>
              {"。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-9-3">{"9-3. 会議前のブリーフ"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={styles["code-head"]}>
                {"\n"}
                {"              "}
                <span className={styles["code-lang"]}>{"Markdown"}</span>
                <button type="button" className={styles["copy-btn"]} data-copy-code>
                  {"コピー"}
                </button>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <pre>
                <code className={["language-markdown"].join(" ")}>
                  <div className={styles.codeLine}>
                    {"午後2時の会議の前に、相手企業についてのブリーフを作ってください。"}
                    {"\n"}
                    {"過去のメールのやり取りと、直近のニュースを入れてください。"}
                    {"\n"}
                    {"確認できなかった点は「未確認」と書いてください。"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"【公式】発表記事の事例では、会議の予定を見つけてブリーフを準備し、"}
              <strong>{"フライト直前だと気づいて予定の移動を提案"}</strong>
              {"した例が紹介されています。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-9-4">{"9-4. カレンダーの矛盾チェック"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"【公式】事例：内見の予定が"}
              <strong>{"誤った日"}</strong>
              {"に入っているのを、頼まれる前に Duet"}
              {"\n"}
              {"            "}
              {"が指摘した、という紹介があります。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={styles["code-head"]}>
                {"\n"}
                {"              "}
                <span className={styles["code-lang"]}>{"Markdown"}</span>
                <button type="button" className={styles["copy-btn"]} data-copy-code>
                  {"コピー"}
                </button>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <pre>
                <code className={["language-markdown"].join(" ")}>
                  <div className={styles.codeLine}>
                    {"今週のカレンダーを見て、移動時間が足りない予定、"}
                    {"\n"}
                    {"日付がメールの内容と食い違っている予定、"}
                    {"\n"}
                    {"同じ時間の二重予約を洗い出してください。変更はせず報告だけお願いします。"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-9-5">{"9-5. 資料・ダッシュボードなど大きめの作業"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"公式に挙がる例"}</th>
                    <th>{"初学者向けのコツ"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"ダッシュボード、財務・営業予測の作成"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <strong>{"一度に頼まず"}</strong>
                      {"、まず「必要なデータの棚卸し」→「雛形」→「数字の反映」と分割する"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"試作・Web アプリの作成"}</td>
                    <td>{"完成イメージ（目的・画面）を最初に文章で固める"}</td>
                  </tr>
                  <tr>
                    <td>{"資料（デック）の更新"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"「確認が必要なスライドに印を付けて」と頼み、"}
                      <strong>{"レビュー箇所を絞る"}</strong>
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
            <p>
              {"\n"}
              {"            "}
              {"【公式】大きな成果物は、"}
              <strong>
                {
                  "ファイル（調査ブリーフ・財務モデル・スライド・ダッシュボードなど）として返り、Make"
                }
                {"\n"}
                {"              "}
                {"に並びます"}
              </strong>
              {"。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-9-6">{"9-6. 契約・給与・採用などの業務"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"業務"}</th>
                    <th>{"公式に挙がる例"}</th>
                    <th>{"注意"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"契約"}</td>
                    <td>{"Docusign で契約書の準備と署名依頼"}</td>
                    <td>
                      <strong>{"署名は承認が必須"}</strong>
                      {"。宛先と条項の確認を丁寧に"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"給与"}</td>
                    <td>{"Gusto で勤務時間・賞与・経費を入れた給与の準備"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"実行前に"}
                      <strong>{"必ず自分で数字を確認"}</strong>
                      {"（公式も「あなたがレビューする」前提）"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"採用"}</td>
                    <td>{"求人の下書き→あなたが編集・承認→LinkedIn に投稿"}</td>
                    <td>{"公開前に必ず文面を確認"}</td>
                  </tr>
                  <tr>
                    <td>{"営業"}</td>
                    <td>{"HubSpot の履歴から、フォローアップメールの下書き"}</td>
                    <td>{"個人情報の混入に注意"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-9-7">{"9-7. 購入（Link・Shop Pay）"}</h3>
            {"\n"}
            {"          "}
            <p>{"【公式】"}</p>
            {"\n"}
            {"          "}
            <ul>
              {"\n"}
              {"            "}
              <li>
                {"Duet は、購入前に"}
                <strong>{"品目と金額をあなたに確認"}</strong>
                {"します。"}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <strong>{"Link"}</strong>
                {"（Stripe"}
                {"\n"}
                {"              "}
                {"のデジタルウォレット）で、あなたが"}
                <strong>{"決済アプリ側でも承認"}</strong>
                {"して初めて支払われます。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"支払いは"}
                <strong>{"その購入専用のワンタイム仮想カード"}</strong>
                {"で行われ、実際のカード番号は共有されません。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <strong>{"Shop Pay"}</strong>
                {"（Shopify）でオンラインストアのチェックアウトも可能です。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"1Password に保存したログイン情報でのサインインは「近日対応予定」とされています。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"          "}
            </ul>
            {"\n"}
            {"          "}
            <div className={styles.callout} data-variant="info">
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {
                  "【公式】個人的な用事（チケット予約など）は、仕事向けの機能ほど得意ではないと明記されています。"
                }
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"        "}
          </section>
          {"\n"}
          {"        "}
          <section className={styles.section} id="sec-10">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 10"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-10-heading">{"セキュリティの考え方"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-10-1">
              {"10-1. なぜ「エージェント」は危ないのか：Lethal Trifecta【開発者】"}
            </h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"Simon Willison（Django の共同開発者）は、AI"}
              {"\n"}
              {"            "}
              {"エージェントが次の3つを"}
              <strong>{"同時に"}</strong>
              {"持つと、データが盗まれやすくなると整理しました（2025年に提唱した「Lethal"}
              {"\n"}
              {"            "}
              {"Trifecta」）。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"要素"}</th>
                    <th>{"Duet では"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"① 私的データへのアクセス"}</td>
                    <td>{"Gmail・Drive・Slack・メモリを読める"}</td>
                  </tr>
                  <tr>
                    <td>{"② 信頼できない内容への接触"}</td>
                    <td>{"受信メール、Web ページを読む"}</td>
                  </tr>
                  <tr>
                    <td>{"③ 外部への通信"}</td>
                    <td>{"メール送信、ブラウザ操作、支払い"}</td>
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
              <strong>{"Duet は仕様上、3つすべてを備えます。"}</strong>
              {"\n"}
              {"            "}
              {"だからこそ、公式は承認ゲートを中心に多層の防御を組んでいます。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-10-2">{"10-2. Rule of Two で自分の使い方を点検する【開発者＋分析】"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"Meta の AI"}
              {"\n"}
              {"            "}
              {"セキュリティチームは、セッション内でエージェントが持つ性質を"}
              <strong>{"「3つのうち最大2つまで」"}</strong>
              {"に抑える考え方（Agents"}
              {"\n"}
              {"            "}
              {"Rule of"}
              {"\n"}
              {"            "}
              {"Two）を2025年10月に公開しました。3つ全部が必要な作業は、"}
              <strong>{"人間の承認など信頼できる検証を挟んで監督付きで行う"}</strong>
              {"ことが前提です。Willison"}
              {"\n"}
              {"            "}
              {
                "は、信頼できる防御が確立されていない現状で最も実用的な助言だと評価しつつ、「信頼できない入力＋状態変更」の組み合わせも安全とは言えない、という留保も付けています。"
              }
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <figure className={styles["diagram-card"]}>
              {"\n"}
              {"            "}
              <div className={styles["diagram-wrap"]}>
                <div className={styles["diagram-canvas"]} data-diagram-id="d8">
                  <MermaidDiagram chart={DIAGRAM_8} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <p>
              <strong>{"自分の使い方でできる Rule of Two 的な工夫【分析】"}</strong>
            </p>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"減らす対象"}</th>
                    <th>{"具体策"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"B（私的データ）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <strong>{"つなぐアプリを絞る。"}</strong>
                      {"\n"}
                      {"                    "}
                      {"人事・法務など機微な情報の置き場は、最初は接続しない"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"A（信頼できない入力）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"知らない相手からの依頼メールに基づく作業は、"}
                      <strong>{"慎重に"}</strong>
                      {"（本文に隠れた指示がありうる）"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"C（外部への影響）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"最初の2週間は「下書きまで」と明示し、"}
                      <strong>{"送信・支払いを自分の手で完結"}</strong>
                      {"させる"}
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
            <h3 id="sec-10-3">{"10-3. 公式が用意している防御（要点）【公式】"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"防御"}</th>
                    <th>{"内容"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"承認ゲート"}</td>
                    <td>{"送信・支払い・署名・削除の前に、操作・宛先・内容を見せて待つ"}</td>
                  </tr>
                  <tr>
                    <td>{"別系統の自動チェック"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"モデルの外側で、各操作が意図に合うかを評価（Claude Code の auto mode"}
                      {"\n"}
                      {"                    "}
                      {"の分類器を拡張）"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"機微情報の分類器"}</td>
                    <td>{"送信しようとするメッセージを別途検査（下の図）"}</td>
                  </tr>
                  <tr>
                    <td>{"認証情報の隔離"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"パスワード・Cookie・サインイン用トークンは"}
                      <strong>{"モデルから見えず"}</strong>
                      {"、"}
                      <strong>{"Duet のメモリにも保存されない"}</strong>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"ブラウザの隔離"}</td>
                    <td>
                      {"専用の仮想マシン上で動作。決まった命令（開く・クリック・入力）だけで操作"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"自己申告"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"ブラウザのリクエストに専用の User-Agent を付け、公開 IP"}
                      {"\n"}
                      {"                    "}
                      {"も公表。一部の大手サイトは拒否を選択"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"第三者による検証"}</td>
                    <td>{"レッドチーム、外部ペネトレーションテスト、公開バグバウンティの対象"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-10-4">{"10-4. 機微情報の扱い"}</h3>
            {"\n"}
            {"          "}
            <figure className={styles["diagram-card"]}>
              {"\n"}
              {"            "}
              <div className={styles["diagram-wrap"]}>
                <div className={styles["diagram-canvas"]} data-diagram-id="d9">
                  <MermaidDiagram chart={DIAGRAM_9} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {
                "【公式】自分自身の依頼は同意として扱われます（例：歯医者へ症状を伝えるメッセージ）。ただし、この仕組みは"
              }
              <strong>{"ときに見逃し、または無害なものを止める"}</strong>
              {"ことがあり、承認ゲートと併用される前提だと公式が述べています。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-10-5">{"10-5. 見落としやすい落とし穴（フィッシング）"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"【公式】パスワードのフォームは、"}
              <strong>{"アプリの中で、あなたが頼んだサインインのときだけ"}</strong>
              {"表示されます。リンク・SMS・メール・claude.ai"}
              {"\n"}
              {"            "}
              {"以外のサイトとして届くことは"}
              <strong>{"ありません"}</strong>
              {"。Duet"}
              {"\n"}
              {"            "}
              {"を名乗る何かが別の場所でパスワードを求めてきたら、"}
              <strong>{"偽物"}</strong>
              {"です。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-10-6">{"10-6. 実運用の安全ルール（そのまま使える）【分析】"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["code-block"]} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={styles["code-head"]}>
                {"\n"}
                {"              "}
                <span className={styles["code-lang"]}>{"YAML"}</span>
                <button type="button" className={styles["copy-btn"]} data-copy-code>
                  {"コピー"}
                </button>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <pre>
                <code className={["language-yaml"].join(" ")}>
                  <div className={styles.codeLine}>
                    <span className="hljs-comment">{"# 私の Claude Duet 運用ルール（例）"}</span>
                    {"\n"}
                    <span className="hljs-attr">{"connectors:"}</span>
                    {"\n"}
                    {"  "}
                    <span className="hljs-attr">{"first_two_weeks:"}</span> {"["}
                    <span className="hljs-string">{"gmail"}</span>
                    {", "}
                    <span className="hljs-string">{"calendar"}</span>
                    {"]   "}
                    <span className="hljs-comment">{"# 最初はこの2つだけ"}</span>
                    {"\n"}
                    {"  "}
                    <span className="hljs-attr">{"add_later:"}</span> {"["}
                    <span className="hljs-string">{"drive"}</span>
                    {", "}
                    <span className="hljs-string">{"slack"}</span>
                    {", "}
                    <span className="hljs-string">{"quickbooks"}</span>
                    {"]"}
                    {"\n"}
                    <span className="hljs-attr">{"approvals:"}</span>
                    {"\n"}
                    {"  "}
                    <span className="hljs-attr">{"always_read:"}</span> {"["}
                    <span className="hljs-string">{"recipients"}</span>
                    {", "}
                    <span className="hljs-string">{"body"}</span>
                    {", "}
                    <span className="hljs-string">{"amounts"}</span>
                    {", "}
                    <span className="hljs-string">{"dates"}</span>
                    {"]"}
                    {"\n"}
                    {"  "}
                    <span className="hljs-attr">{"never_approve_when:"}</span>
                    {"\n"}
                    {"    "}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    <span className="hljs-string">{"宛先に見覚えのないアドレスがある"}</span>
                    {"\n"}
                    {"    "}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    <span className="hljs-string">{"頼んでいない範囲の操作が含まれる"}</span>
                    {"\n"}
                    {"    "}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    <span className="hljs-string">{"急かす文面や不自然なリンクがある"}</span>
                    {"\n"}
                    <span className="hljs-attr">{"data:"}</span>
                    {"\n"}
                    {"  "}
                    <span className="hljs-attr">{"never_put_in_chat:"}</span> {"["}
                    <span className="hljs-string">{"パスワード"}</span>
                    {", "}
                    <span className="hljs-string">{"カード番号"}</span>
                    {", "}
                    <span className="hljs-string">{"公的ID番号"}</span>
                    {"]"}
                    {"\n"}
                    <span className="hljs-attr">{"review:"}</span>
                    {"\n"}
                    {"  "}
                    <span className="hljs-attr">{"weekly:"}</span> {"["}
                    <span className="hljs-string">{"接続アプリの棚卸し"}</span>
                    {", "}
                    <span className="hljs-string">{"メモリの確認"}</span>
                    {", "}
                    <span className="hljs-string">{"承認ログの見直し"}</span>
                    {"]"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"        "}
          </section>
          {"\n"}
          {"        "}
          <section className={styles.section} id="sec-11">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 11"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-11-heading">{"使用量とコストの管理"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-11-1">{"11-1. 何が使用量を消費するか【公式】"}</h3>
            {"\n"}
            {"          "}
            <ul>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"Duet は"}
                <strong>{"プランの使用上限を、通常の Claude のチャットと同じ枠で"}</strong>
                {"使います。"}
                <strong>{"週間の上限"}</strong>
                {"が適用され、"}
                <strong>{"5時間のセッション上限"}</strong>
                {"はその上限の対象となるアカウントにのみ適用されます。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <strong>
                  {"朝のブリーフや定期的な確認などの裏の作業も使用量に数えられます。"}
                </strong>
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {
                  "大きな作業（財務モデルや資料の作成）は、モデルの試行回数と裏作業が増えるため、使用量が大きくなります。"
                }
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"確認は"}
                <strong>{"数時間おき"}</strong>
                {
                  "（常時ではない）。常時確認すると上限の消費がはるかに速くなるため、とされています。"
                }
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"          "}
            </ul>
            {"\n"}
            {"          "}
            <figure className={styles["diagram-card"]}>
              {"\n"}
              {"            "}
              <div className={styles["diagram-wrap"]}>
                <div className={styles["diagram-canvas"]} data-diagram-id="d10">
                  <MermaidDiagram chart={DIAGRAM_10} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <h3 id="sec-11-2">{"11-2. 節約のコツ【分析】"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"コツ"}</th>
                    <th>{"理由"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"接続アプリを絞る"}</td>
                    <td>{"確認の対象が減る"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"大きな依頼は分割し、"}
                      <strong>{"途中でレビュー"}</strong>
                      {"する"}
                    </td>
                    <td>{"方向違いのやり直しを減らす"}</td>
                  </tr>
                  <tr>
                    <td>{"通知してほしい条件を絞る"}</td>
                    <td>{"無駄な往復を減らす"}</td>
                  </tr>
                  <tr>
                    <td>{"緊急でない作業は、まとめて依頼する"}</td>
                    <td>{"小さな往復の積み重ねを避ける"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-11-3">{"11-3. 上限リセットの特典【公式】"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"Duet"}
              {"\n"}
              {"            "}
              {"のリサーチプレビューに受け入れられると、"}
              <strong>{"5時間枠と週間枠の両方がリセットされる「上限リセット」を1回"}</strong>
              {"受けられます。この特典は"}
              {"\n"}
              {"            "}
              <strong>{"2026年11月30日まで"}</strong>
              {"利用可能です（ヘルプセンター記載）。"}
              <strong>{"使い始めるタイミングを逃さないよう、招待が届いたら早めに試す"}</strong>
              {"とよいでしょう。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"        "}
          </section>
          {"\n"}
          {"        "}
          <section className={styles.section} id="sec-12">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 12"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-12-heading">{"4週間導入ロードマップ（初学者向け）"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <figure className={styles["diagram-card"]}>
              {"\n"}
              {"            "}
              <div className={styles["diagram-wrap"]}>
                <div className={styles["diagram-canvas"]} data-diagram-id="d11">
                  <MermaidDiagram chart={DIAGRAM_11} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"週"}</th>
                    <th>{"目標"}</th>
                    <th>{"やること"}</th>
                    <th>{"合格ライン（目安）"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{"第1週"}</strong>
                    </td>
                    <td>{"挙動を知る"}</td>
                    <td>
                      {"接続は2つだけ（メール・カレンダー）。ブリーフと下書きのみ。送信は自分で"}
                    </td>
                    <td>
                      {"ブリーフの内容が"}
                      <strong>{"自分の優先順位と7割程度合う"}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"第2週"}</strong>
                    </td>
                    <td>{"1つ任せる"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"未払い請求書の確認など、"}
                      <strong>{"定型で結果が確かめやすい"}</strong>
                      {"業務を1つ"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>
                      {"数字・宛先の誤りを"}
                      <strong>{"承認前に毎回検出できる"}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"第3週"}</strong>
                    </td>
                    <td>{"大きく頼む"}</td>
                    <td>{"資料・分析など。分割して依頼し、途中レビュー"}</td>
                    <td>
                      <strong>{"やり直しが少なく"}</strong>
                      {"、確認が必要な箇所が絞られている"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"第4週"}</strong>
                    </td>
                    <td>{"型にする"}</td>
                    <td>{"通知ルール・承認ルール・チャネル構成を文章にして固定"}</td>
                    <td>
                      {"運用ルールを"}
                      <strong>{"他人に説明できる"}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={styles.callout} data-variant="info">
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {
                  "【分析】「合格ライン」は筆者の目安で、公式基準ではありません。自分の業務に合わせて調整してください。"
                }
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"        "}
          </section>
          {"\n"}
          {"        "}
          <section className={styles.section} id="sec-13">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 13"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-13-heading">{"限界と既知の制約"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-13-1">{"13-1. 公式に明記されている制約【公式】"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"制約"}</th>
                    <th>{"内容"}</th>
                    <th>{"対処"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"モデルを選べない"}</td>
                    <td>{"Opus 5.5 で動き、必要な作業量は Duet が判断"}</td>
                    <td>{"受け入れる。重い作業は分割して依頼"}</td>
                  </tr>
                  <tr>
                    <td>{"ブラウザ作業を見られない"}</td>
                    <td>{"動いている様子を見たり、操作を引き継いだりできない"}</td>
                    <td>{"結果と根拠の提示を依頼する"}</td>
                  </tr>
                  <tr>
                    <td>{"確認は「数時間おき」"}</td>
                    <td>{"確認と確認の間に届いた緊急事項は見逃しうる"}</td>
                    <td>
                      <strong>{"緊急のものは自分でも見る"}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{"見られる範囲"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"PC 上のすべてのプロジェクトやファイルは見えない。Claude"}
                      {"\n"}
                      {"                    "}
                      {"での作業は読めるが変更できない"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"必要な資料は接続アプリに置く"}</td>
                  </tr>
                  <tr>
                    <td>{"電話・SMS"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {
                        "他人への電話や SMS はできない。承認の上、接続済みアカウントからメール送信は可能"
                      }
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"電話は自分で"}</td>
                  </tr>
                  <tr>
                    <td>{"一部コネクタ"}</td>
                    <td>{"Slack などは制限付き。Microsoft 365 は未対応"}</td>
                    <td>{"他の接続で代替"}</td>
                  </tr>
                  <tr>
                    <td>{"誤判断"}</td>
                    <td>{"スレッドの読み違い、緊急度の見誤りがありうる"}</td>
                    <td>{"承認前に必ず確認"}</td>
                  </tr>
                  <tr>
                    <td>{"個人的な用事"}</td>
                    <td>{"仕事向けの機能に比べて弱い（チケット予約など）"}</td>
                    <td>{"仕事用途に集中"}</td>
                  </tr>
                  <tr>
                    <td>{"アプリ構成"}</td>
                    <td>{"当面は独立した別アプリ（Claude 本体とは別）"}</td>
                    <td>{"2つを使い分ける"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-13-2">{"13-2. 実際に触った評論家の指摘【開発者】"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"Claire Vo（ChatPRD 創業者、Lenny's Newsletter / How I AI のホスト）は、Duet"}
              {"\n"}
              {"            "}
              {"を受信箱・Slack・営業パイプライン・Google"}
              {"\n"}
              {"            "}
              {
                "ドキュメントの営業資料・動画・チケット探しで試し、次の趣旨の評価をしています（動画のため、要点のみ紹介）。"
              }
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"評価"}</th>
                    <th>{"内容の趣旨"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"良い点"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"オンボーディングやタスク一覧、成果物、チャネルの作りこみなど、"}
                      <strong>{"これまでの個人エージェントの発表で最も洗練されている"}</strong>
                      {"部類"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"課題"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"「プロアクティブ」と言いつつ、"}
                      <strong>{"自分から声をかける頻度が足りない"}</strong>
                      {"と感じる場面がある"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"課題"}</td>
                    <td>
                      {"応答の遅さ（レイテンシ）が、"}
                      <strong>{"同期的に付き合う意欲を削ぐ"}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{"課題"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <strong>{"デスクトップ版がない"}</strong>
                      {"、複数人での共同利用（マルチプレイヤー）に弱い"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"全体"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"洗練されていても、多くの個人エージェントと注目を奪い合う中で"}
                      <strong>{"日常に定着するかが課題"}</strong>
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
            <div className={styles.callout} data-variant="info">
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"【分析】この評価は一人の評論家の使用感であり、"}
                <strong>{"あなたの業務で同じとは限りません"}</strong>
                {"。ただし「通知の調整」「待ち時間」「PC"}
                {"\n"}
                {"              "}
                {"版の不在」は、導入前に確認しておきたい論点です。"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-13-3">{"13-3. 向き・不向きの目安【分析】"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"向いている"}</th>
                    <th>{"向いていない（現時点）"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"メール・予定・請求・会議準備など、"}
                      <strong>{"文脈が接続アプリにある"}</strong>
                      {"仕事"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>
                      {"緊急性が極めて高く、"}
                      <strong>{"確認の遅れが致命的"}</strong>
                      {"な業務"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {"結果を"}
                      <strong>{"人が最後に確認"}</strong>
                      {"できる業務"}
                    </td>
                    <td>{"承認なしで完結させたい自動処理"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"定型的で、成果物が"}
                      <strong>{"検証しやすい"}</strong>
                      {"業務"}
                    </td>
                    <td>{"個人的な予約・手配が中心の用途"}</td>
                  </tr>
                  <tr>
                    <td>{"米国の Pro / Max / Ultra ユーザー"}</td>
                    <td>{"Team / Enterprise、米国外のアカウント"}</td>
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
          {"        "}
          <section className={styles.section} id="sec-14">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 14"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-14-heading">{"トラブルシューティング"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <figure className={styles["diagram-card"]}>
              {"\n"}
              {"            "}
              <div className={styles["diagram-wrap"]}>
                <div className={styles["diagram-canvas"]} data-diagram-id="d12">
                  <MermaidDiagram chart={DIAGRAM_12} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"症状"}</th>
                    <th>{"考えられる原因"}</th>
                    <th>{"対処"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"招待メールが来ない"}</td>
                    <td>{"順次送付"}</td>
                    <td>{"待つ。登録メールと端末のアカウントを確認"}</td>
                  </tr>
                  <tr>
                    <td>{"古い情報で動く"}</td>
                    <td>{"古いメモリ・過去チャットの参照"}</td>
                    <td>{"メモリを見直す。過去チャット検索をオフにする設定もある"}</td>
                  </tr>
                  <tr>
                    <td>{"緊急メールの通知が遅れた"}</td>
                    <td>{"確認が数時間おき"}</td>
                    <td>{"緊急の連絡手段は別に確保する"}</td>
                  </tr>
                  <tr>
                    <td>{"数字が合わない"}</td>
                    <td>{"元データの読み違い"}</td>
                    <td>{"出典（メール・ファイル）の提示を求めて照合する"}</td>
                  </tr>
                  <tr>
                    <td>{"「完了」と言うのに終わっていない"}</td>
                    <td>
                      {"Duet は完了を"}
                      <strong>{"提案"}</strong>
                      {"するだけ"}
                    </td>
                    <td>{"あなたが内容を確認して完了にする"}</td>
                  </tr>
                  <tr>
                    <td>{"接続を切ったのに情報が残る"}</td>
                    <td>{"切断は新規アクセスの停止のみ"}</td>
                    <td>
                      <strong>{"メモリをリセット"}</strong>
                      {"（アプリの設定から）"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"不審なパスワード入力画面"}</td>
                    <td>{"フィッシングの可能性"}</td>
                    <td>{"アプリ内の自分が頼んだサインイン以外では入力しない"}</td>
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
          {"        "}
          <section className={styles.section} id="sec-15">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 15"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-15-heading">{"運用の振り返り（週1回・15分）【分析】"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"チェック項目"}</th>
                    <th>{"見ること"}</th>
                    <th>{"対応"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"ブリーフの質"}</td>
                    <td>{"重要事項を拾えているか。余計な項目はないか"}</td>
                    <td>{"通知ルールを言葉で修正"}</td>
                  </tr>
                  <tr>
                    <td>{"承認ログ"}</td>
                    <td>{"承認した内容に問題はなかったか"}</td>
                    <td>{"迷った操作は、次から「必ず確認」と指示"}</td>
                  </tr>
                  <tr>
                    <td>{"接続アプリ"}</td>
                    <td>{"使っていないアプリがつながっていないか"}</td>
                    <td>{"不要なら切断"}</td>
                  </tr>
                  <tr>
                    <td>{"メモリ"}</td>
                    <td>{"古い・誤った前提が残っていないか"}</td>
                    <td>{"修正またはリセット"}</td>
                  </tr>
                  <tr>
                    <td>{"使用量"}</td>
                    <td>{"上限に近づいていないか"}</td>
                    <td>{"接続や依頼を絞る"}</td>
                  </tr>
                  <tr>
                    <td>{"失敗事例"}</td>
                    <td>{"うまくいかなかった依頼"}</td>
                    <td>{"テンプレートに「完了条件」「承認の境界」を足す"}</td>
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
          {"        "}
          <section className={styles.section} id="sec-16">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 16"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-16-heading">{"開発者向け補足：Claude Code との関係と学べる設計思想"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-16-1">{"16-1. Duet の開発者の使い方【公式】"}</h3>
            {"\n"}
            {"          "}
            <p>{"発表記事では、Anthropic の社内利用が紹介されています。"}</p>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"人物"}</th>
                    <th>{"使い方（趣旨）"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"Boris Cherny（Claude Code のリード）"}</td>
                    <td>
                      <strong>{"散歩中に頭の中の to-do を話す"}</strong>
                      {"。机の前に持ち越さない"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Chelsea Larsson（モデルとプロダクトの振る舞い設計チームのリード）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"子どもと過ごす前に to-do を渡し、"}
                      <strong>{"夜のレポートで結果を受け取る"}</strong>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Karan Ahuja（Duet チームのリード）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"ユーザーインタビューの日程調整、"}
                      <strong>{"プロトタイプの共同作業、コードの出荷"}</strong>
                      {"にも使う"}
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
            <div className={styles.callout} data-variant="info">
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"補足【開発者・二次報道】Business Insider の報道では、Karan Ahuja は Meta"}
                {"\n"}
                {"              "}
                {
                  "Superintelligence Labs でプロダクトマネジメントを率いた後、2026 年 8 月に Anthropic で"
                }
                {"\n"}
                {"              "}
                {"Duet の開発を率いているとされ、X では「Duet を使って Duet"}
                {"\n"}
                {"              "}
                {"を作っている」旨を述べたと伝えられています。"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-16-2">{"16-2. Claude Code の知見を Duet に持ち込む【分析】"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"Claude Code の発想"}</th>
                    <th>{"Duet での応用"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {"\n"}
                      {"                    "}
                      <strong>{"目的・労力・検証方法"}</strong>
                      {"を同僚に話すように伝える（Boris Cherny"}
                      {"\n"}
                      {"                    "}
                      {"の提案、二次報道）"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"7章の5要素。特に「検証方法」＝出典の提示を必ず頼む"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"確認を人間に求め続けると"}
                      <strong>{"承認疲れ"}</strong>
                      {"で形骸化（Simon Willison"}
                      {"\n"}
                      {"                    "}
                      {"の指摘）"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>
                      {"8章。見るポイントを4つに絞り、"}
                      <strong>{"押す前に読む習慣"}</strong>
                      {"を作る"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"自動の安全チェック（auto"}
                      {"\n"}
                      {"                    "}
                      {"mode）は、人間のレビューより有害操作を多く止められた、とする Anthropic"}
                      {"\n"}
                      {"                    "}
                      {"の評価（Willison が紹介）"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"Duet の別系統チェックも同じ思想。ただし"}
                      <strong>{"100% ではない"}</strong>
                      {"ので承認を併用"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"防御に頼りきらず、"}
                      <strong>{"そもそも危険なデータ・道具を渡さない"}</strong>
                      {"設計（Willison"}
                      {"\n"}
                      {"                    "}
                      {"の姿勢）"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"5章・10章。接続を絞る"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"繰り返し作業は、"}
                      <strong>{"ループやルーティン"}</strong>
                      {"として自動化する流れ（Boris"}
                      {"\n"}
                      {"                    "}
                      {"Cherny の近年の発言、二次報道）"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"定型業務を1つ決めて Duet"}
                      {"\n"}
                      {"                    "}
                      {"に任せ、"}
                      <strong>{"結果が検証しやすい"}</strong>
                      {"ものから広げる"}
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
            <div className={styles.callout} data-variant="info">
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"【公式】Claude のブログ記事（"}
                <a
                  href="https://claude.com/blog/auto-mode-default-in-claude-code"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"Auto mode is now the default in Claude Code"}
                </a>
                {"）によると、有害な操作を拒否できた人間は "}
                <strong>{"13.6%"}</strong>
                {"、auto mode なら"}
                {"\n"}
                {"              "}
                <strong>{"89%"}</strong> {"を止められました。ただしこの評価は、"}
                <strong>{"研究会社を通じて募集した有償のエキスパートテスター 1,053 人"}</strong>
                {"が、"}
                <strong>{"研究用の環境で"}</strong>
                {"参加したもので、"}
                <strong>{"各セッションで危険なコマンドを1つ差し替えて提示"}</strong>
                {"したもので、"}
                <strong>{"その操作は実際には実行されていません"}</strong>
                {"。Willison"}
                {"\n"}
                {"              "}
                {"もこの数字を紹介しています。同時に Willison は、残りの約 11%"}
                {"\n"}
                {"              "}
                {
                  "が止められないこと、悪意のあるパッケージのような攻撃への懸念、さらなる独立した検証を求める姿勢も示しています。"
                }
                <strong>
                  {"この数字は Claude Code の auto mode の評価であり、Duet"}
                  {"\n"}
                  {"                "}
                  {"そのものの数値ではありません。"}
                </strong>
                {"\n"}
                {"              "}
                {
                  "また、この結果は自動チェックが人間の注意深いレビューの代わりになることを意味しません。"
                }
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-16-3">{"16-3. Duet と Claude Code の使い分け【分析】"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"場面"}</th>
                    <th>{"向いている道具"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {"メール・予定・請求・会議準備などの"}
                      <strong>{"業務の流れ"}</strong>
                    </td>
                    <td>{"Duet"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"リポジトリを読み書きする"}
                      <strong>{"コーディング作業"}</strong>
                    </td>
                    <td>{"Claude Code"}</td>
                  </tr>
                  <tr>
                    <td>{"PC のローカルファイルを扱う作業"}</td>
                    <td>
                      {"Duet は"}
                      <strong>{"見えない"}</strong>
                      {"（公式の制約）。ローカル作業は別の道具で"}
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
          {"        "}
          <section className={styles.section} id="sec-17">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 17"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-17-heading">{"チェックリスト総まとめ"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={styles["check-overall"]} id="check-overall">
              {"\n"}
              {"            "}
              <div className={styles["ov-left"]}>
                {"\n"}
                {"              "}
                <span className={styles["ov-label"]}>{"全体の進捗"}</span>
                <span className={styles["ov-num"]}>{"0%"}</span>
                <span className={styles["ov-sub"]}></span>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <div className={styles["ov-right"]}>
                {"\n"}
                {"              "}
                <div className={styles["check-bar"]}>
                  <i></i>
                </div>
                {"\n"}
                {"              "}
                <p className={styles["ov-hint"]}>{"チェックはこのブラウザに保存されます。"}</p>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <button type="button" id="check-reset" className={styles["ov-reset"]}>
                {"すべてリセット"}
              </button>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={styles["check-card"]} data-i="1">
              {"\n"}
              {"            "}
              <div className={styles["check-head"]}>
                {"\n"}
                {"              "}
                <h3 id="sec-17-1">{"17-1. 使い始める前"}</h3>
                {"\n"}
                {"              "}
                <span className={styles["check-count"]}></span>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <div className={styles["check-bar"]}>
                <i></i>
              </div>
              {"\n"}
              {"            "}
              <ul className={styles["check-list"]}>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" />
                    {"\n"}
                    {"                  "}
                    <span>
                      {"Pro / Max / Ultra プランで、米国の Claude アカウントを持っている"}
                    </span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" />
                    {"\n"}
                    {"                  "}
                    <span>
                      {"ウェイトリストに、Claude アカウントと同じメールアドレスで登録した"}
                    </span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" />
                    {"\n"}
                    {"                  "}
                    <span>
                      {"招待メールを開くスマホの Apple / Google"}
                      {"\n"}
                      {"                    "}
                      {"アカウントが、そのメールに紐づいている"}
                    </span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" /> <span>{"接続するアプリを最大2つに絞った"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" />
                    {"\n"}
                    {"                  "}
                    <span>{"Claude のメモリに、古い・誤った情報がないか確認した"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" />
                    {"\n"}
                    {"                  "}
                    <span>{"「任せたいこと」「任せたくないこと」を書き出した"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={styles["check-card"]} data-i="2">
              {"\n"}
              {"            "}
              <div className={styles["check-head"]}>
                {"\n"}
                {"              "}
                <h3 id="sec-17-2">{"17-2. 毎回の依頼で"}</h3>
                {"\n"}
                {"              "}
                <span className={styles["check-count"]}></span>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <div className={styles["check-bar"]}>
                <i></i>
              </div>
              {"\n"}
              {"            "}
              <ul className={styles["check-list"]}>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" /> <span>{"ゴールと完了条件を書いた"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" />
                    {"\n"}
                    {"                  "}
                    <span>
                      {"「送る・払う・消す」を含む場合、"}
                      <strong>{"承認を取るよう"}</strong>
                      {"書いた"}
                    </span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" />
                    {"\n"}
                    {"                  "}
                    <span>
                      {"数字や要約に"}
                      <strong>{"出どころを添える"}</strong>
                      {"よう頼んだ"}
                    </span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" /> <span>{"大きな依頼は分割した"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={styles["check-card"]} data-i="3">
              {"\n"}
              {"            "}
              <div className={styles["check-head"]}>
                {"\n"}
                {"              "}
                <h3 id="sec-17-3">{"17-3. 承認の前に"}</h3>
                {"\n"}
                {"              "}
                <span className={styles["check-count"]}></span>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <div className={styles["check-bar"]}>
                <i></i>
              </div>
              {"\n"}
              {"            "}
              <ul className={styles["check-list"]}>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" /> <span>{"宛先・CC・BCC をすべて確認した"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" />
                    {"\n"}
                    {"                  "}
                    <span>{"本文に頼んでいない内容や不自然なリンクがない"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" /> <span>{"金額・日付が元データと一致している"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" /> <span>{"頼んだ範囲を超えていない"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" /> <span>{"迷ったら「今はしない」を選んだ"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={styles["check-card"]} data-i="4">
              {"\n"}
              {"            "}
              <div className={styles["check-head"]}>
                {"\n"}
                {"              "}
                <h3 id="sec-17-4">{"17-4. 週に1回"}</h3>
                {"\n"}
                {"              "}
                <span className={styles["check-count"]}></span>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <div className={styles["check-bar"]}>
                <i></i>
              </div>
              {"\n"}
              {"            "}
              <ul className={styles["check-list"]}>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" />
                    {"\n"}
                    {"                  "}
                    <span>{"ブリーフの質を見直し、通知ルールを調整した"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" /> <span>{"接続アプリを棚卸しした"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" /> <span>{"メモリを確認した"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" /> <span>{"使用量を確認した"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"        "}
          </section>
          {"\n"}
          {"        "}
          <section className={styles.section} id="sec-18">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 18"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-18-heading">{"FAQ"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={styles["faq-tools"]}>
              {"\n"}
              {"            "}
              <input
                type="search"
                id="faq-filter"
                placeholder="質問を検索（例：料金）"
                aria-label="FAQを検索"
              />
              <button type="button" id="faq-open" className={styles["ov-reset"]}>
                {"すべて開く"}
              </button>
              <button type="button" id="faq-close" className={styles["ov-reset"]}>
                {"すべて閉じる"}
              </button>
              <span className={styles["faq-hit"]} id="faq-hit"></span>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={styles["faq-list"]}>
              {"\n"}
              {"            "}
              <details className={styles["faq-item"]} open>
                {"\n"}
                {"              "}
                <summary>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-q"]}>{"Q1"}</span>
                  <span className={styles["faq-t"]}>{"日本から使えますか？"}</span>
                  {"\n"}
                  {"              "}
                </summary>
                {"\n"}
                {"              "}
                <div className={styles["faq-a"]}>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-badge"]}>{"A"}</span>
                  {"\n"}
                  {"                "}
                  <div className={styles["faq-body"]}>
                    {"\n"}
                    {"                  "}
                    <p>
                      {"\n"}
                      {"                    "}
                      {"現時点では、リサーチプレビューは"}
                      <strong>{"米国の Pro / Max / Ultra ユーザーのみ"}</strong>
                      {"が対象で、米国の Claude アカウントが必要です。"}
                      <span className={[styles.tag, styles["tag-official"]].join(" ")}>
                        {"公式"}
                      </span>
                      {"対象拡大の時期は、確認できた範囲では示されていません。"}
                      {"\n"}
                      {"                  "}
                    </p>
                    {"\n"}
                    {"                "}
                  </div>
                  {"\n"}
                  {"              "}
                </div>
                {"\n"}
                {"            "}
              </details>
              {"\n"}
              {"            "}
              <details className={styles["faq-item"]}>
                {"\n"}
                {"              "}
                <summary>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-q"]}>{"Q2"}</span>
                  <span className={styles["faq-t"]}>{"追加料金はかかりますか？"}</span>
                  {"\n"}
                  {"              "}
                </summary>
                {"\n"}
                {"              "}
                <div className={styles["faq-a"]}>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-badge"]}>{"A"}</span>
                  {"\n"}
                  {"                "}
                  <div className={styles["faq-body"]}>
                    {"\n"}
                    {"                  "}
                    <p>
                      {"\n"}
                      {"                    "}
                      {"研究プレビュー中は Pro / Max / Ultra"}
                      {"\n"}
                      {"                    "}
                      {"に追加料金なしで含まれます。ただし、"}
                      <strong>{"使用上限は共有"}</strong>
                      {"で、裏の作業も消費します。"}
                      <span className={[styles.tag, styles["tag-official"]].join(" ")}>
                        {"公式"}
                      </span>
                      {"\n"}
                      {"                  "}
                    </p>
                    {"\n"}
                    {"                "}
                  </div>
                  {"\n"}
                  {"              "}
                </div>
                {"\n"}
                {"            "}
              </details>
              {"\n"}
              {"            "}
              <details className={styles["faq-item"]}>
                {"\n"}
                {"              "}
                <summary>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-q"]}>{"Q3"}</span>
                  <span className={styles["faq-t"]}>{"パソコンの電源を切っても動きますか？"}</span>
                  {"\n"}
                  {"              "}
                </summary>
                {"\n"}
                {"              "}
                <div className={styles["faq-a"]}>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-badge"]}>{"A"}</span>
                  {"\n"}
                  {"                "}
                  <div className={styles["faq-body"]}>
                    {"\n"}
                    {"                  "}
                    <p>
                      {"\n"}
                      {"                    "}
                      {"動きます。Duet は"}
                      <strong>{"クラウド上の専用 PC"}</strong>
                      {"で作業するため、スマホや PC"}
                      {"\n"}
                      {"                    "}
                      {"の電源に依存しません。"}
                      <span className={[styles.tag, styles["tag-official"]].join(" ")}>
                        {"公式"}
                      </span>
                      {"\n"}
                      {"                  "}
                    </p>
                    {"\n"}
                    {"                "}
                  </div>
                  {"\n"}
                  {"              "}
                </div>
                {"\n"}
                {"            "}
              </details>
              {"\n"}
              {"            "}
              <details className={styles["faq-item"]}>
                {"\n"}
                {"              "}
                <summary>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-q"]}>{"Q4"}</span>
                  <span className={styles["faq-t"]}>{"勝手にメールを送られませんか？"}</span>
                  {"\n"}
                  {"              "}
                </summary>
                {"\n"}
                {"              "}
                <div className={styles["faq-a"]}>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-badge"]}>{"A"}</span>
                  {"\n"}
                  {"                "}
                  <div className={styles["faq-body"]}>
                    {"\n"}
                    {"                  "}
                    <p>
                      {"\n"}
                      {"                    "}
                      {"送信の前には、内容・宛先・全受信者を見せて"}
                      <strong>{"承認を待つ"}</strong>
                      {"設計です。ただし完璧ではないため、"}
                      <strong>{"承認カードは必ず読んでください。"}</strong>
                      <span className={[styles.tag, styles["tag-official"]].join(" ")}>
                        {"公式"}
                      </span>
                      <span className={[styles.tag, styles["tag-analysis"]].join(" ")}>
                        {"分析"}
                      </span>
                      {"\n"}
                      {"                  "}
                    </p>
                    {"\n"}
                    {"                "}
                  </div>
                  {"\n"}
                  {"              "}
                </div>
                {"\n"}
                {"            "}
              </details>
              {"\n"}
              {"            "}
              <details className={styles["faq-item"]}>
                {"\n"}
                {"              "}
                <summary>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-q"]}>{"Q5"}</span>
                  <span className={styles["faq-t"]}>
                    {"パスワードを Duet に教えても大丈夫ですか？"}
                  </span>
                  {"\n"}
                  {"              "}
                </summary>
                {"\n"}
                {"              "}
                <div className={styles["faq-a"]}>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-badge"]}>{"A"}</span>
                  {"\n"}
                  {"                "}
                  <div className={styles["faq-body"]}>
                    {"\n"}
                    {"                  "}
                    <p>
                      {"\n"}
                      {"                    "}
                      {"Duet"}
                      {"\n"}
                      {"                    "}
                      {"はパスワード・Cookie・サインイントークンを"}
                      <strong>{"見ない"}</strong>
                      {"設計です。パスワードは、アプリ内のフォームに"}
                      <strong>{"自分で入力"}</strong>
                      {"し、暗号化されてブラウザに渡されます。チャットに書くのは避けてください。"}
                      <span className={[styles.tag, styles["tag-official"]].join(" ")}>
                        {"公式"}
                      </span>
                      <span className={[styles.tag, styles["tag-analysis"]].join(" ")}>
                        {"分析"}
                      </span>
                      {"\n"}
                      {"                  "}
                    </p>
                    {"\n"}
                    {"                "}
                  </div>
                  {"\n"}
                  {"              "}
                </div>
                {"\n"}
                {"            "}
              </details>
              {"\n"}
              {"            "}
              <details className={styles["faq-item"]}>
                {"\n"}
                {"              "}
                <summary>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-q"]}>{"Q6"}</span>
                  <span className={styles["faq-t"]}>{"モデルを選べますか？"}</span>
                  {"\n"}
                  {"              "}
                </summary>
                {"\n"}
                {"              "}
                <div className={styles["faq-a"]}>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-badge"]}>{"A"}</span>
                  {"\n"}
                  {"                "}
                  <div className={styles["faq-body"]}>
                    {"\n"}
                    {"                  "}
                    <p>
                      {"\n"}
                      {"                    "}
                      {"選べません。Opus 5.5 で動き、必要な作業量は Duet が判断します。"}
                      <span className={[styles.tag, styles["tag-official"]].join(" ")}>
                        {"公式"}
                      </span>
                      {"\n"}
                      {"                  "}
                    </p>
                    {"\n"}
                    {"                "}
                  </div>
                  {"\n"}
                  {"              "}
                </div>
                {"\n"}
                {"            "}
              </details>
              {"\n"}
              {"            "}
              <details className={styles["faq-item"]}>
                {"\n"}
                {"              "}
                <summary>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-q"]}>{"Q7"}</span>
                  <span className={styles["faq-t"]}>{"間違いを見つけたら？"}</span>
                  {"\n"}
                  {"              "}
                </summary>
                {"\n"}
                {"              "}
                <div className={styles["faq-a"]}>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-badge"]}>{"A"}</span>
                  {"\n"}
                  {"                "}
                  <div className={styles["faq-body"]}>
                    {"\n"}
                    {"                  "}
                    <p>
                      {"\n"}
                      {"                    "}
                      {"チャットで"}
                      <strong>{"平易な言葉で状況を伝える"}</strong>
                      {"と、レポートがチームに渡されます。"}
                      <span className={[styles.tag, styles["tag-official"]].join(" ")}>
                        {"公式"}
                      </span>
                      {"\n"}
                      {"                  "}
                    </p>
                    {"\n"}
                    {"                "}
                  </div>
                  {"\n"}
                  {"              "}
                </div>
                {"\n"}
                {"            "}
              </details>
              {"\n"}
              {"            "}
              <details className={styles["faq-item"]}>
                {"\n"}
                {"              "}
                <summary>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-q"]}>{"Q8"}</span>
                  <span className={styles["faq-t"]}>
                    {"接続を切ったら、Duet は私の情報を忘れますか？"}
                  </span>
                  {"\n"}
                  {"              "}
                </summary>
                {"\n"}
                {"              "}
                <div className={styles["faq-a"]}>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-badge"]}>{"A"}</span>
                  {"\n"}
                  {"                "}
                  <div className={styles["faq-body"]}>
                    {"\n"}
                    {"                  "}
                    <p>
                      {"\n"}
                      {"                    "}
                      {"切断で新規アクセスは止まりますが、"}
                      <strong>{"すでに学んだ内容は残ります"}</strong>
                      {"。消したい場合はメモリのリセットを使います。アカウントを削除すると、Duet"}
                      {"\n"}
                      {"                    "}
                      {"が保存したものはすべて消えます。"}
                      <span className={[styles.tag, styles["tag-official"]].join(" ")}>
                        {"公式"}
                      </span>
                      {"\n"}
                      {"                  "}
                    </p>
                    {"\n"}
                    {"                "}
                  </div>
                  {"\n"}
                  {"              "}
                </div>
                {"\n"}
                {"            "}
              </details>
              {"\n"}
              {"            "}
              <details className={styles["faq-item"]}>
                {"\n"}
                {"              "}
                <summary>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-q"]}>{"Q9"}</span>
                  <span className={styles["faq-t"]}>{"Claude 本体のアプリとは別物ですか？"}</span>
                  {"\n"}
                  {"              "}
                </summary>
                {"\n"}
                {"              "}
                <div className={styles["faq-a"]}>
                  {"\n"}
                  {"                "}
                  <span className={styles["faq-badge"]}>{"A"}</span>
                  {"\n"}
                  {"                "}
                  <div className={styles["faq-body"]}>
                    {"\n"}
                    {"                  "}
                    <p>
                      {"\n"}
                      {"                    "}
                      {"Claude"}
                      {"\n"}
                      {"                    "}
                      {"アカウントを共有しますが、"}
                      <strong>{"別の独立したアプリ"}</strong>
                      {"です。メモリ・スキル・接続アプリは引き継がれます。"}
                      <span className={[styles.tag, styles["tag-official"]].join(" ")}>
                        {"公式"}
                      </span>
                      {"\n"}
                      {"                  "}
                    </p>
                    {"\n"}
                    {"                "}
                  </div>
                  {"\n"}
                  {"              "}
                </div>
                {"\n"}
                {"            "}
              </details>
              {"\n"}
              {"            "}
              <p className={styles["faq-none"]} id="faq-none" hidden>
                {"該当する質問が見つかりませんでした。"}
              </p>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"        "}
          </section>
          {"\n"}
          {"        "}
          <section className={styles.section} id="sec-19">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 19"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-19-heading">{"補足ベストプラクティスと根拠ソース"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={styles.callout} data-variant="info">
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"「著名な国際的開発者の発信」を優先して調べました。"}
                <strong>{"Duet は公開から4日しか経っていない"}</strong>
                {"ため、Duet"}
                {"\n"}
                {"              "}
                {"単体を深く検証した開発者の長文記事は限られます。その場合は、"}
                <strong>{"エージェントの安全設計・承認・プロンプトインジェクション"}</strong>
                {"といった、Duet"}
                {"\n"}
                {"              "}
                {"にそのまま当てはまる一般原則の一次情報を補足として示しています。"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-19-1">{"19-1. 補足ベストプラクティス（根拠付き）"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"#"}</th>
                    <th>{"ベストプラクティス"}</th>
                    <th>{"根拠"}</th>
                    <th>{"区分"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"1"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <strong>
                        {"私的データ・信頼できない入力・外部通信の3つを同時に広げない。"}
                      </strong>
                      {"\n"}
                      {"                    "}
                      {"3つ必要なら人の承認など検証を挟む"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"Simon Willison の Lethal Trifecta ／ Meta の Agents Rule of Two"}</td>
                    <td>{"【開発者】"}</td>
                  </tr>
                  <tr>
                    <td>{"2"}</td>
                    <td>
                      <strong>{"承認疲れ"}</strong>
                      {"を前提に、見るポイントを絞って確認する"}
                    </td>
                    <td>
                      {"Simon Willison（auto mode の記事）／ 発表側も承認頻度の調整を課題と明記"}
                    </td>
                    <td>{"【開発者・公式】"}</td>
                  </tr>
                  <tr>
                    <td>{"3"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"防御を過信せず、"}
                      <strong>{"そもそも危険なデータ・道具を渡さない"}</strong>
                      {"設計を優先する"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"Simon Willison（同上）"}</td>
                    <td>{"【開発者】"}</td>
                  </tr>
                  <tr>
                    <td>{"4"}</td>
                    <td>
                      <strong>{"目的・労力・検証方法"}</strong>
                      {"を、同僚に話すように伝える"}
                    </td>
                    <td>{"Boris Cherny の X 投稿（台湾メディアの報道経由）"}</td>
                    <td>{"【開発者・二次】"}</td>
                  </tr>
                  <tr>
                    <td>{"5"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"多層防御（モデル・ハーネス・ツール・実行環境）で考える。"}
                      <strong>{"モデルの安全性だけでは足りない"}</strong>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"Anthropic「Trustworthy Agents in Practice」（2026年4月）の解説"}</td>
                    <td>{"【公式・二次解説】"}</td>
                  </tr>
                  <tr>
                    <td>{"6"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"認証情報はモデルから"}
                      <strong>{"物理的に分離"}</strong>
                      {"する（プレースホルダー＋外部プロキシ）"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"Anthropic Managed Agents の設計（Duet の記事が参照）"}</td>
                    <td>{"【公式】"}</td>
                  </tr>
                  <tr>
                    <td>{"7"}</td>
                    <td>
                      {"数字・要約には"}
                      <strong>{"出典の提示"}</strong>
                      {"を求めて検証する"}
                    </td>
                    <td>{"Duet のヘルプセンター（出典を示す設計）"}</td>
                    <td>{"【公式】"}</td>
                  </tr>
                  <tr>
                    <td>{"8"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"プロアクティブなエージェントは、"}
                      <strong>{"中断コスト・ユーザー制御・タイミング"}</strong>
                      {"のバランスが核心"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"プロアクティブエージェントの設計に関する学術論文（arXiv）"}</td>
                    <td>{"【研究】"}</td>
                  </tr>
                  <tr>
                    <td>{"9"}</td>
                    <td>
                      {"通知は「何を・どのくらいの頻度で」を"}
                      <strong>{"言葉で調整"}</strong>
                      {"する"}
                    </td>
                    <td>{"Duet 発表記事"}</td>
                    <td>{"【公式】"}</td>
                  </tr>
                  <tr>
                    <td>{"10"}</td>
                    <td>{"同名の別製品と混同しない"}</td>
                    <td>{"Decagon ブログ ／ GitHub のプラグイン"}</td>
                    <td>{"【分析】"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-19-2">{"19-2. ソース URL 一覧"}</h3>
            {"\n"}
            {"          "}
            <h4>{"A. Anthropic 公式（一次情報）"}</h4>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"内容"}</th>
                    <th>{"URL"}</th>
                    <th>{"取得状況"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"Claude Duet 製品ページ（FAQ・機能）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://claude.com/product/claude-duet"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://claude.com/product/claude-duet"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"本文を確認"}</td>
                  </tr>
                  <tr>
                    <td>{"Introducing Claude Duet（発表記事・2026-10-21）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://claude.com/resources/articles/claude-duet"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://claude.com/resources/articles/claude-duet"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"本文を確認"}</td>
                  </tr>
                  <tr>
                    <td>{"Claude Duet Safety, Privacy, and Security（2026-10-23）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://claude.com/resources/articles/claude-duet-safety-privacy-and-security"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://claude.com/resources/articles/claude-duet-safety-privacy-and-security"
                        }
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"本文を確認"}</td>
                  </tr>
                  <tr>
                    <td>{"ヘルプセンター「Claude Duet を始める」（日本語）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://support.claude.com/ja/articles/17631495-claude-duetを始める"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://support.claude.com/ja/articles/17631495-claude-duetを始める"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"本文を確認"}</td>
                  </tr>
                  <tr>
                    <td>{"同・英語版"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://support.claude.com/en/articles/17631495"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://support.claude.com/en/articles/17631495"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"検索結果で確認"}</td>
                  </tr>
                  <tr>
                    <td>{"Trustworthy agents（Duet の記事が参照）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://www.anthropic.com/research/trustworthy-agents"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://www.anthropic.com/research/trustworthy-agents"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"リンクのみ（本文は未取得）"}</td>
                  </tr>
                  <tr>
                    <td>{"Managed Agents の設計（認証情報の分離）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://www.anthropic.com/engineering/managed-agents"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://www.anthropic.com/engineering/managed-agents"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"リンクのみ（本文は未取得）"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"Auto mode is now the default in Claude Code（Claude ブログ・1,053"}
                      {"\n"}
                      {"                    "}
                      {"人の評価の一次情報）"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://claude.com/blog/auto-mode-default-in-claude-code"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://claude.com/blog/auto-mode-default-in-claude-code"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {
                        "16章の評価数値の出典。研究環境・1セッション1件の差し替え・非実行という条件付き"
                      }
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"ブラウザ利用でのプロンプトインジェクション対策"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://www.anthropic.com/research/prompt-injection-defenses"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://www.anthropic.com/research/prompt-injection-defenses"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"リンクのみ（本文は未取得）"}</td>
                  </tr>
                  <tr>
                    <td>{"バグバウンティ（HackerOne）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://hackerone.com/anthropic"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://hackerone.com/anthropic"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"リンクのみ"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h4>{"B. 著名な国際的開発者・評論家の発信"}</h4>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
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
                    <td>{"Simon Willison（Django 共同開発者・Datasette 作者）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"auto mode の評価への見解、承認疲れ、Lethal Trifecta への懸念（2026-08-08）"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://simonwillison.net/2026/Aug/8/auto-mode/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://simonwillison.net/2026/Aug/8/auto-mode/"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Simon Willison"}</td>
                    <td>{"Lethal Trifecta の原典（2025-06-16）"}</td>
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
                    <td>{"Simon Willison"}</td>
                    <td>{"Agents Rule of Two への評価と留保（2025-11-02）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://simonwillison.net/2025/Nov/2/new-prompt-injection-papers/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://simonwillison.net/2025/Nov/2/new-prompt-injection-papers/"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Meta AI"}</td>
                    <td>{"Agents Rule of Two（2025-10-31）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://ai.meta.com/blog/practical-ai-agent-security/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://ai.meta.com/blog/practical-ai-agent-security/"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Claire Vo（ChatPRD / How I AI）"}</td>
                    <td>{"Duet の実使用レビュー（2026-10-21・16分の動画）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://www.lennysnewsletter.com/p/claude-duet-is-beautiful-i-still"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://www.lennysnewsletter.com/p/claude-duet-is-beautiful-i-still"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Boris Cherny（Claude Code）"}</td>
                    <td>{"指示の出し方（X 投稿の報道）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://www.inside.com.tw/article/42593-boris-cherny-prompt-claude-like-coworker-goal-effort-verify"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://www.inside.com.tw/article/42593-boris-cherny-prompt-claude-like-coworker-goal-effort-verify"
                        }
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Boris Cherny ／ Cat Wu"}</td>
                    <td>{"Claude Code 1周年の振り返り（韓国語の要約）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://brunch.co.kr/@beingcognitive/42"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://brunch.co.kr/@beingcognitive/42"}
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
            <h4>{"C. 報道・解説（補助）"}</h4>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"内容"}</th>
                    <th>{"URL"}</th>
                    <th>{"注意"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"Business Insider 転載（Karan Ahuja ・Mike Krieger の発言）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://dnyuz.com/?p=307922"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://dnyuz.com/?p=307922"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"転載記事（2026-11-01 に閲覧できることを確認）。原典は Business"}
                      {"\n"}
                      {"                    "}
                      {
                        "Insider「Anthropic answers Meta and OpenAI with a new personal agent, Claude"
                      }
                      {"\n"}
                      {"                    "}
                      {
                        "Duet」https://www.businessinsider.com/anthropic-answers-meta-openai-new-personal-agent-claude-duet-2026-10"
                      }
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Reuters 配信記事（提供範囲の要約）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://whbl.com/?p=1019379"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://whbl.com/?p=1019379"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"ローカル局の転載"}</td>
                  </tr>
                  <tr>
                    <td>{"Trustworthy Agents の第三者解説"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://www.cequence.ai/blog/ai/anthropic-agent-security-framework-infrastructure-governance/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://www.cequence.ai/blog/ai/anthropic-agent-security-framework-infrastructure-governance/"
                        }
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"セキュリティ企業の解説（二次）"}</td>
                  </tr>
                  <tr>
                    <td>{"プロアクティブエージェントの基礎（学術）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://arxiv.org/pdf/2609.37267"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://arxiv.org/pdf/2609.37267"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"査読前の可能性あり"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"Duet 練習ガイド（"}
                      <strong>{"未検証"}</strong>
                      {"と明記された学習用）"}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://app.therundown.ai/guides/claude-duet-guide"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://app.therundown.ai/guides/claude-duet-guide"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"執筆者が未使用と明記"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h4>{"D. 同名の別製品（混同注意）"}</h4>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"製品"}</th>
                    <th>{"URL"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"Decagon Duet（エージェント改善ツール）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://decagon.ai/blog/why-we-built-decagon-duet-on-agent-operating-procedures"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://decagon.ai/blog/why-we-built-decagon-duet-on-agent-operating-procedures"
                        }
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"duet（Claude Code 向けコミュニティ製プラグイン）"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://github.com/tslateman/duet"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://github.com/tslateman/duet"}
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
          {"        "}
          <section className={styles.section} id="sec-20">
            {"\n"}
            {"          "}
            <div className={styles["sec-head"]}>
              {"\n"}
              {"            "}
              <span className={styles.eyebrow}>{"CHAPTER 20"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-20-heading">{"調査メモ（確認できたこと・できなかったこと）"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-20-1">{"20-1. 確認できたこと（2026-10-25 時点）"}</h3>
            {"\n"}
            {"          "}
            <ul>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"製品ページ・発表記事・安全性の記事・ヘルプセンター（日本語）の"}
                <strong>{"本文を直接取得して確認"}</strong>
                {"した。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"Simon Willison の auto mode の記事（2026-08-08）と Claire Vo"}
                {"\n"}
                {"              "}
                {"のレビューページは"}
                <strong>{"本文（概要）を取得"}</strong>
                {"した。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"Meta の Rule of Two、Willison の Lethal Trifecta は検索結果で内容を確認した。"}
              </li>
              {"\n"}
              {"          "}
            </ul>
            {"\n"}
            {"          "}
            <h3 id="sec-20-2">{"20-2. 確認できなかったこと【未確認】"}</h3>
            {"\n"}
            {"          "}
            <div className={styles["table-wrap"]}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"項目"}</th>
                    <th>{"状況"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"確認間隔の正確な値"}</td>
                    <td>{"公式は「数時間おき」と述べるのみ。正確な間隔は未公表"}</td>
                  </tr>
                  <tr>
                    <td>{"使用量の目安"}</td>
                    <td>{"公式に具体的な見積もりは確認できず"}</td>
                  </tr>
                  <tr>
                    <td>{"米国外への展開時期"}</td>
                    <td>{"確認できた範囲では未発表"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"Boris Cherny・Karan Ahuja の X 投稿の"}
                      <strong>{"原文"}</strong>
                    </td>
                    <td>{"本ガイドでは、公式発表記事と二次報道の記述に基づく"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"Simon Willison の "}
                      <strong>{"Duet 単体"}</strong>
                      {"に関する記事"}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"調査時点では見つからなかった。関連する一般原則（auto mode・Lethal"}
                      {"\n"}
                      {"                    "}
                      {"Trifecta）で補足した"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {"安全性の記事で"}
                      <strong>{"「近日公開」とされる詳細"}</strong>
                    </td>
                    <td>{"追加の技術詳細は今後公開される可能性がある"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-20-3">{"20-3. このガイドの更新方針"}</h3>
            {"\n"}
            {"          "}
            <ul>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"Duet"}
                {"\n"}
                {"              "}
                {"は"}
                <strong>{"リサーチプレビュー"}</strong>
                {"であり、承認の頻度・サインイン方法・分類器の精度などが"}
                <strong>{"変わると公式が述べています"}</strong>
                {"。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"新しい公式情報が出た場合は、"}
                <strong>
                  {"1章（提供状況）・8章（承認）・10章（セキュリティ）・13章（制約）"}
                </strong>
                {"を優先して更新してください。"}
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
          {"        "}
          <div className={styles.closing}>
            {"\n"}
            {"          "}
            <span className={styles.eyebrow}>{"POINT"}</span>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"Duet は先に動くエージェントです。(1) 接続は最小から、(2)"}
              {"\n"}
              {"            "}
              {"依頼はゴール・完了条件・承認の境界・根拠の4点で、(3)"}
              {"\n"}
              {"            "}
              {"承認カードは宛先・本文・数字・範囲を読んでから押す、(4) 4週間で段階的に広げる、(5)"}
              {"\n"}
              {"            "}
              {
                "週1回の振り返りで調整する。この5点を守れば、リサーチプレビュー段階でも安全に価値を引き出せます。"
              }
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"        "}
          </div>
          {"\n"}
          {"        "}
          <footer className={styles.footer}>
            {"\n"}
            {"          "}
            {"調査基準日: 2026年10月25日。Duet"}
            {"\n"}
            {"          "}
            {
              "はリサーチプレビューのため、提供範囲・上限・安全機能は変わる可能性があります。最新情報は公式ページ（https://claude.com/product/claude-duet）で確認してください。"
            }
            {"\n"}
            {"        "}
          </footer>
          {"\n"}
          {"      "}
        </main>
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
