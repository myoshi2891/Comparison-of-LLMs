import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import { findBySlug } from "@/lib/page-registry";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";
export const metadata: Metadata = {
  title: "OpenAI「dots」初学者向け ステップバイステップ・ベストプラクティスガイド",
  description:
    "OpenAI dots の導入、Custom Rules、ブリーフ、安全設計と継続運用を学ぶ初学者向けガイド。情報基準日2026-10-24。",
};
const DIAGRAM_0 = `flowchart TB
  A["Part 1: 理解する<br/>dotsとは何か"] --> B["Part 2: 始める<br/>Step 0〜Step 4"]
  B --> C["Part 3: 任せる<br/>Step 5〜Step 7"]
  C --> D["Part 4: 守る<br/>安全設計と運用"]
  D --> E["Part 5: 深める<br/>国際的な開発者の知見と補足ソース"]`;
const DIAGRAM_1 = `flowchart LR
  N1["通常のチャット 質問する"] --> N2["回答が返る"] --> N3["会話が終わる"]
  D1["dot 目標と範囲を渡す"] --> D2["背景で作業が続く"]
  D2 --> D3["進捗や確認依頼が届く"]
  D3 --> D4["あなたが承認・修正"]
  D4 --> D2`;
const DIAGRAM_2 = `flowchart TB
  U["あなた"] -->|"メッセージ"| CH["チャンネル<br/>ChatGPT デスクトップ・Web・モバイル<br/>Slack / Teams"]
  U -->|"通話"| MB["ChatGPT モバイルアプリ<br/>通話はモバイルのみ"]
  MB --> D
  CH --> D["あなたの dot<br/>GPT-6 Astra"]
  D --> CC["専用クラウドPC<br/>+ クラウドブラウザ"]
  D --> PL["接続したプラグイン<br/>メール・カレンダー等"]
  D -.->|"任意・既定ではオフ"| LC["あなた自身のPC<br/>ChatGPTデスクトップ経由"]
  D --> CX["Codex / ChatGPT Work<br/>へ作業を委任"]
  D -->|"結果・確認依頼"| CH`;
const DIAGRAM_3 = `flowchart TD
  Q["やりたいこと"] --> Q1{"1回で終わる?"}
  Q1 -->|"はい: 質問や文章"| A["通常のChatGPT"]
  Q1 -->|"はい: 作業を最後までやらせたい"| B["ChatGPT Work"]
  Q1 -->|"はい: コードの作業"| C["Codex"]
  Q1 -->|"いいえ: 継続して見守りたい"| D["dot"]
  D --> E["必要に応じて Work や Codex に委任"]`;
const DIAGRAM_4 = `flowchart LR
  S0["Step 0<br/>資格と費用の確認"] --> S1["Step 1<br/>dotを作る"]
  S1 --> S2["Step 2<br/>アプリを最小限接続<br/>接続と同時に既定ルールを確認"]
  S2 --> S3["Step 3<br/>Custom Rules を確定"]
  S3 --> S4["Step 4<br/>小さな仕事を任せる"]
  S4 --> S5["1週間観察して権限を広げる"]`;
const DIAGRAM_5 = `flowchart LR
  A["デスクトップアプリ・デスクトップ Web・<br/>iOS/AndroidでChatGPTを開く"] --> B["dotを作成"]
  B --> C["名前とキャラを選ぶ"]
  C --> D["dotが自己紹介"]`;
const DIAGRAM_6 = `flowchart TD
  A["その行為は?"] --> B{"間違えても<br/>やり直せる?"}
  B -->|"はい"| C{"自分以外の人に<br/>届く?"}
  B -->|"いいえ"| H["あなたに引き渡す<br/>または 毎回確認"]
  C -->|"いいえ: 調査・下書き"| F["確認なしで実行"]
  C -->|"はい: 社内"| G["実行前に確認"]
  C -->|"はい: 社外・お金・権限"| H`;
const DIAGRAM_7 = `flowchart TD
  A["あなたが操作していない時間"] --> B["背景で読み取り専用の調査"]
  B --> C["非公開のメモを保存"]
  C --> D{"役立つ提案がある?"}
  D -->|"いいえ"| E["何もしない"]
  D -->|"はい"| F["あなたに提案を通知"]
  F --> G{"実行する?"}
  G -->|"通常のルールと<br/>Auto-reviewを通過"| H["実行"]
  G -->|"いいえ"| E`;
const DIAGRAM_8 = `flowchart TB
  L1["1. モデルの訓練<br/>意図の理解と安全ルールの順守"] --> L2["2. ChatGPT のセキュリティ<br/>暗号化・不審なログインの検知"]
  L2 --> L3["3. 隔離された作業環境<br/>ユーザーごとに分離"]
  L3 --> L4["4. 行動ルール<br/>Custom Rules と必須の確認"]
  L4 --> L5["5. Auto-review<br/>実行前の別チェック"]
  L5 --> L6["6. 監視<br/>逸脱や回避の試みを検知"]
  L6 --> L7["7. あなた<br/>Activity View と Pause"]`;
const DIAGRAM_9 = `flowchart TD
  A["dotが行動を計画"] --> B["Auto-review が確認<br/>指示・Custom Rules・安全要件"]
  B --> C{"許可?"}
  C -->|"はい"| D["実行"]
  C -->|"いいえ"| E["理由をdotに返す"]
  E --> F{"dotの次の動き"}
  F --> G["あなたに追加情報や承認を求める"]
  F --> H["許可される別の方法を試す"]
  F --> I["あなたに引き渡す"]
  F --> J["停止する"]`;
const DIAGRAM_10 = `flowchart LR
  A["Day 1-2<br/>読み取りと下書きのみ"] --> B["Day 3-4<br/>結果を確認して<br/>好みを教える"]
  B --> C["Day 5-6<br/>ルールを見直す"]
  C --> D["Day 7<br/>振り返り"]
  D --> E{"ミスが再現する?"}
  E -->|"はい"| F["権限を絞る<br/>ブリーフを直す"]
  E -->|"いいえ"| G["権限を少し広げる"]
  F --> A
  G --> A`;
const DIAGRAM_11 = `flowchart TD
  A["国際的な開発者・専門家の共通する示唆"] --> B["仕事として任せる<br/>ゴールと制約を書く"]
  A --> C["承認・外部連絡・お金は<br/>人が握る"]
  A --> D["初期は不安定な前提で<br/>小さく始める"]
  A --> E["コストと権限の<br/>上限を先に決める"]`;
const THEME = {
  fontFamily: '"Noto Sans JP","Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif',
  fontSize: "16px",
  primaryColor: "#eceefb",
  primaryBorderColor: "#3b3f8c",
  primaryTextColor: "#1c1b19",
  secondaryColor: "#faf0d6",
  tertiaryColor: "#faf7f0",
  lineColor: "#5a5a68",
  textColor: "#1c1b19",
  clusterBkg: "#faf7f0",
  clusterBorder: "#ddd6c4",
  edgeLabelBackground: "#ffffff",
};
export default function Page() {
  const entry = findBySlug("/codex/dots-best-practices");
  if (!entry) throw new Error("dots guide is missing from the page registry");
  return (
    <div
      id="dots-guide"
      className={[styles.root, styles.layout].join(" ")}
      data-testid="layout-root"
      data-page="openai-dots"
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,700&display=swap"
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
      <button
        type="button"
        id="dots-backdrop"
        className={styles.scrim}
        aria-label="目次を閉じる"
        tabIndex={-1}
      />
      {"\n"}
      {"    "}
      <div className={styles.layout}>
        {"\n"}
        {"      "}
        <aside
          className={styles.sidebar}
          id="dots-sidebar"
          aria-label="目次"
          data-testid="sidebar-nav"
        >
          {"\n"}
          {"        "}
          <div className={styles.brand}>
            {"OpenAI dots ガイド"}
            <small>{"初学者向けベストプラクティス"}</small>
          </div>
          {"\n"}
          {"        "}
          <nav className={styles.nav} id="nav">
            {"\n"}
            {"          "}
            <div className={styles["nav-group"]}>{"はじめに"}</div>
            {"\n"}
            {"          "}
            <a
              href="#0-このガイドの読み方"
              data-testid="sidebar-nav-link"
              className={styles.active}
              aria-current="location"
            >
              {"0. このガイドの読み方"}
            </a>
            {"\n"}
            {"          "}
            <div className={styles["nav-group"]}>{"Part 1: 理解する"}</div>
            {"\n"}
            {"          "}
            <a href="#1-dots-とは何か" data-testid="sidebar-nav-link">
              {"1. dots とは何か"}
            </a>
            {"\n"}
            {"          "}
            <a href="#2-全体像" data-testid="sidebar-nav-link">
              {"2. 全体像"}
            </a>
            {"\n"}
            {"          "}
            <a href="#3-chatgptchatgpt-workcodex-との使い分け" data-testid="sidebar-nav-link">
              {"3. ChatGPT・ChatGPT Work・Codex との使い分け"}
            </a>
            {"\n"}
            {"          "}
            <div className={styles["nav-group"]}>{"Part 2: 始める"}</div>
            {"\n"}
            {"          "}
            <a href="#step-0-利用資格と費用を確認する" data-testid="sidebar-nav-link">
              {"Step 0: 利用資格と費用を確認する"}
            </a>
            {"\n"}
            {"          "}
            <a href="#step-1-最初の-dot-を作る" data-testid="sidebar-nav-link">
              {"Step 1: 最初の dot を作る"}
            </a>
            {"\n"}
            {"          "}
            <a href="#step-2-アプリプラグインを最小限だけ接続する" data-testid="sidebar-nav-link">
              {"Step 2: アプリ(プラグイン)を最小限だけ接続する"}
            </a>
            {"\n"}
            {"          "}
            <a href="#step-3-custom-rules-を先に決める" data-testid="sidebar-nav-link">
              {"Step 3: Custom Rules を先に決める"}
            </a>
            {"\n"}
            {"          "}
            <a href="#step-4-最初の仕事を任せるブリーフの書き方" data-testid="sidebar-nav-link">
              {"Step 4: 最初の仕事を任せる(ブリーフの書き方)"}
            </a>
            {"\n"}
            {"          "}
            <div className={styles["nav-group"]}>{"Part 3: 任せる"}</div>
            {"\n"}
            {"          "}
            <a href="#step-5-定期タスクとバックグラウンド調査" data-testid="sidebar-nav-link">
              {"Step 5: 定期タスクとバックグラウンド調査"}
            </a>
            {"\n"}
            {"          "}
            <a href="#step-6-チャンネルと自分の-pc-をつなぐ" data-testid="sidebar-nav-link">
              {"Step 6: チャンネルと自分の PC をつなぐ"}
            </a>
            {"\n"}
            {"          "}
            <a href="#step-7-見守る止めるやり直す" data-testid="sidebar-nav-link">
              {"Step 7: 見守る・止める・やり直す"}
            </a>
            {"\n"}
            {"          "}
            <div className={styles["nav-group"]}>{"Part 4: 守る"}</div>
            {"\n"}
            {"          "}
            <a href="#8-安全設計を理解する" data-testid="sidebar-nav-link">
              {"8. 安全設計を理解する"}
            </a>
            {"\n"}
            {"          "}
            <a href="#9-メモリとプライバシー" data-testid="sidebar-nav-link">
              {"9. メモリとプライバシー"}
            </a>
            {"\n"}
            {"          "}
            <a href="#10-1週間の運用ルーチン" data-testid="sidebar-nav-link">
              {"10. 1週間の運用ルーチン"}
            </a>
            {"\n"}
            {"          "}
            <a href="#11-よくある失敗とトラブルシュート" data-testid="sidebar-nav-link">
              {"11. よくある失敗とトラブルシュート"}
            </a>
            {"\n"}
            {"          "}
            <a href="#12-ベストプラクティスチェックリスト" data-testid="sidebar-nav-link">
              {"12. ベストプラクティス・チェックリスト"}
            </a>
            {"\n"}
            {"          "}
            <div className={styles["nav-group"]}>{"Part 5: 深める"}</div>
            {"\n"}
            {"          "}
            <a href="#13-国際的な開発者専門家の知見" data-testid="sidebar-nav-link">
              {"13. 国際的な開発者・専門家の知見"}
            </a>
            {"\n"}
            {"          "}
            <a
              href="#14-補足-その他のベストプラクティスと根拠ソース"
              data-testid="sidebar-nav-link"
            >
              {"14. 補足: その他のベストプラクティスと根拠ソース"}
            </a>
            {"\n"}
            {"          "}
            <a href="#15-参考url一覧" data-testid="sidebar-nav-link">
              {"15. 参考URL一覧"}
            </a>
            {"\n"}
            {"          "}
            <a href="#16-用語集" data-testid="sidebar-nav-link">
              {"16. 用語集"}
            </a>
            {"\n"}
            {"          "}
            <a href="#17-更新時の注意" data-testid="sidebar-nav-link">
              {"17. 更新時の注意"}
            </a>
            {"\n"}
            {"        "}
          </nav>
          {"\n"}
          {"      "}
        </aside>
        {"\n"}
        {"      "}
        <div className={styles.main}>
          {"\n"}
          {"        "}
          <div className={styles["mobile-bar"]} id="dots-mobile-bar">
            {"\n"}
            {"          "}
            <button
              type="button"
              id="dots-menu"
              aria-label="目次を開く"
              aria-controls="dots-sidebar"
              aria-expanded="false"
            >
              {"目次"}
            </button>
            <span>{"OpenAI dots ガイド"}</span>
            {"\n"}
            {"        "}
          </div>
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
            <div className={styles.eyebrow}>{"OPENAI DOTS / BEST PRACTICES"}</div>
            {"\n"}
            {"          "}
            <h1>{"OpenAI「dots」初学者向け ステップバイステップ・ベストプラクティスガイド"}</h1>
            {"\n"}
            {"          "}
            <ul className={styles["hero-meta"]}>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <strong>{"対象読者"}</strong>
                {": ChatGPT"}
                {"\n"}
                {"              "}
                {"は使ったことがあるが、「常時稼働エージェント」は初めての方"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <strong>{"情報基準日"}</strong>
                {": 2026年10月24日(dots は 2026年9月29日の OpenAI DevDay 2026"}
                {"\n"}
                {"              "}
                {"で発表)"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <strong>{"ゴール"}</strong>
                {": 最初の dot"}
                {"\n"}
                {"              "}
                {"を安全に作り、小さな仕事から任せ、1週間で「信頼できる運用」に育てる"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"          "}
            </ul>
            {"\n"}
            {"        "}
          </header>
          {"\n"}
          {"        "}
          <main>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="0-このガイドの読み方">{"0. このガイドの読み方"}</h2>
              {"\n"}
              {"            "}
              <h3 id="01-情報の確度について">{"0.1 情報の確度について"}</h3>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"dots"}
                {"\n"}
                {"              "}
                {
                  "は発表から約4週間の新しい製品で、仕様・提供範囲が日々更新されています。本ガイドでは、各情報の確度を次の記号で示します。"
                }
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"記号"}</th>
                      <th>{"意味"}</th>
                      <th>{"例"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"◎"}</td>
                      <td>
                        {"OpenAI の一次資料(公式発表・ヘルプセンター・安全性投稿)を直接確認した"}
                      </td>
                      <td>{"4,000以上のアプリ連携、Custom Rules の4種類の挙動"}</td>
                    </tr>
                    <tr>
                      <td>{"○"}</td>
                      <td>{"一次資料を引用している二次資料(百科・報道)経由で確認した"}</td>
                      <td>{"行動ルールの分類表、System Card の評価結果"}</td>
                    </tr>
                    <tr>
                      <td>{"△"}</td>
                      <td>{"実践者の経験談・個人の提案で、公式の保証ではない"}</td>
                      <td>{"「1週間は既定ルールのまま使う」などの運用の工夫"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  <strong>{"注意"}</strong>
                  {":"}
                  {"\n"}
                  {"                "}
                  {"起点としてご指定いただいた日本語版("}
                  <code>{"openai.com/ja-JP/index/introducing-dots/"}</code>
                  {")は、取得時にボット検知で遮断されました。そのため同じ発表の英語版("}
                  <code>{"openai.com/index/introducing-dots/"}</code>
                  {")と、同日公開の安全性投稿・ヘルプセンター記事で内容を確認しています。"}
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"            "}
              <h3 id="02-このガイドの構成">{"0.2 このガイドの構成"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["diagram-card"]}>
                {"\n"}
                {"              "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="0">
                    <MermaidDiagram chart={DIAGRAM_0} theme="base" themeVariables={THEME} />
                  </div>
                </div>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h1 id="part-1-理解する">{"Part 1: 理解する"}</h1>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="1-dots-とは何か">{"1. dots とは何か"}</h2>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                <strong>{"dots(単数: dot)"}</strong> {"は、OpenAI が 2026年9月29日に ChatGPT"}
                {"\n"}
                {"              "}
                {"内で提供を始めた"}
                <strong>{"常時稼働(always-on)型のエージェント"}</strong>
                {"です。◎"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"OpenAI"}
                {"\n"}
                {"              "}
                {
                  "は「目標を渡し、自分でやってよいことを決めておけば、会話と会話の合間にも仕事を進め、結果を持ち帰り、判断が必要なときだけ相談してくる」存在として説明しています。◎"
                }
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <h3 id="11-30秒で押さえる要点">{"1.1 30秒で押さえる要点"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"項目"}</th>
                      <th>{"内容"}</th>
                      <th>{"確度"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"動力"}</td>
                      <td>
                        {"OpenAI の最新モデル "}
                        <strong>{"GPT-6 Astra"}</strong>
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"作業場所"}</td>
                      <td>
                        {"dot ごとに"}
                        <strong>{"専用のクラウドコンピュータとブラウザ"}</strong>
                        {"を持つ"}
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"接続先"}</td>
                      <td>
                        {"ChatGPT のプラグイン経由で "}
                        <strong>{"4,000以上のアプリ"}</strong>
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"連絡手段"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"ChatGPT(デスクトップ・Web・モバイル)、Slack、Microsoft"}
                        {"\n"}
                        {"                      "}
                        {"Teams、テキストメッセージ(限定ベータ)"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"動き方"}</td>
                      <td>{"頼まれなくても背景で調べ物をし、提案する(「プロアクティブ調査」)"}</td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"統制"}</td>
                      <td>{"何を自分で行い、いつ確認し、何を絶対にしないかを利用者が決める"}</td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"注意"}</td>
                      <td>{"間違えることがある。重要な成果物は必ず人が確認する"}</td>
                      <td>{"◎"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <h3 id="12-普通のチャットとの決定的な違い">
                {"1.2 「普通のチャット」との決定的な違い"}
              </h3>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"通常の ChatGPT は「質問 → 回答 → 終了」の"}
                <strong>{"単発のやりとり"}</strong>
                {"です。dot"}
                {"\n"}
                {"              "}
                {"は「責任を引き受けて、続きを担当する」存在です。"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <div className={styles["diagram-card"]}>
                {"\n"}
                {"              "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="1">
                    <MermaidDiagram chart={DIAGRAM_1} theme="base" themeVariables={THEME} />
                  </div>
                </div>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  <strong>{"初学者への一言"}</strong>
                  {":"}
                  {"\n"}
                  {"                "}
                  {
                    "「質問する相手」ではなく「仕事を引き継ぐ同僚」だと考えると、設計の勘所(権限・報告・確認)が理解しやすくなります。"
                  }
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"            "}
              <h3 id="13-openai-が示している利用イメージ">
                {"1.3 OpenAI が示している利用イメージ"}
              </h3>
              {"\n"}
              {"            "}
              <ul>
                {"\n"}
                {"              "}
                <li>{"Slack に不具合報告が上がると、dot がすぐ調査を始める(社内利用の例)◎"}</li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"早期テスターの dot"}
                  {"\n"}
                  {"                "}
                  {"が、請求書の送り忘れに気づき、下書きを作り、本人の承認後に送信した ◎"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"将来は「複数の dot がチームで動く」構想で、組織向けの"}
                  <strong>{"スペシャリスト dot"}</strong>
                  {"(独自の ID・権限を持つ)も試験段階にある ◎"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="2-全体像">{"2. 全体像"}</h2>
              {"\n"}
              {"            "}
              <h3 id="21-構成要素の関係">{"2.1 構成要素の関係"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["diagram-card"]}>
                {"\n"}
                {"              "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="2">
                    <MermaidDiagram chart={DIAGRAM_2} theme="base" themeVariables={THEME} />
                  </div>
                </div>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <p>{"ポイントは次の3つです。"}</p>
              {"\n"}
              {"            "}
              <ol>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  <strong>
                    {"dot の作業場所は「あなたの PC」ではなく、dot 専用のクラウド PC"}
                  </strong>{" "}
                  {"◎"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"自分の PC を使わせるかどうかは"}
                  <strong>{"任意で、既定はオフ"}</strong> {"◎"}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"作業の入口(チャンネル)が複数あっても、"}
                  <strong>{"共有メモリの一部と最近の会話の文脈は引き継がれる"}</strong>
                  {"(ChatGPT"}
                  {"\n"}
                  {"                "}
                  {"で始めた話を Slack"}
                  {"\n"}
                  {"                "}
                  {
                    "で続けられる)◎。ただし、すべての文脈が完全に共有されるとは限らないため、別のチャンネルで続けるときは"
                  }
                  <strong>{"必要な背景を改めて伝える"}</strong>
                  {"と確実です"}
                  {"\n"}
                  {"                "}
                  {"△"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ol>
              {"\n"}
              {"            "}
              <h3 id="22-用語ミニ辞典最低限">{"2.2 用語ミニ辞典(最低限)"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"用語"}</th>
                      <th>{"意味"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"dot"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"あなた専属の常時稼働エージェント。名前を付けられる(既定のハンドルは"}
                        {"\n"}
                        {"                      "}
                        <code>{"@yourname-dot"}</code>
                        {")"}
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"プラグイン"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"ChatGPT がアプリ(メール・カレンダー・Slack 等)につながる仕組み。権限は"}
                        {"\n"}
                        {"                      "}
                        {"dots・ChatGPT・Work・Codex で共有される"}
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Custom Rules"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "「何を勝手にやってよいか・必ず聞くか・任せないか」を行為ごとに決めるルール"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Auto-review"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "対象となる操作(メッセージ送信やファイル変更など)について、実行前に別の安全システムが計画をチェックする仕組み"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"プロアクティブ調査"}</td>
                      <td>{"頼まれていない時間に、読み取り専用で背景調査し、メモを残す機能"}</td>
                    </tr>
                    <tr>
                      <td>{"Activity View"}</td>
                      <td>
                        {"dot の進行中・委任中のタスクを一覧し、指示の追加や停止ができる画面"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="3-chatgptchatgpt-workcodex-との使い分け">
                {"\n"}
                {"              "}
                {"3. ChatGPT・ChatGPT Work・Codex との使い分け"}
                {"\n"}
                {"            "}
              </h2>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"dots"}
                {"\n"}
                {"              "}
                {"は既存ツールを置き換えるのではなく、"}
                <strong>{"それらに仕事を振り分ける司令塔"}</strong>
                {"として位置づけられています。◎(dot"}
                {"\n"}
                {"              "}
                {"は Work や Codex のタスクを作成でき、プラグイン権限は共有されます)"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"ツール"}</th>
                      <th>{"向いている仕事"}</th>
                      <th>{"動き方"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"ChatGPT(通常チャット)"}</td>
                      <td>{"質問、文章作成、アイデア出し"}</td>
                      <td>{"都度のやりとり"}</td>
                    </tr>
                    <tr>
                      <td>{"ChatGPT Work"}</td>
                      <td>{"1回きりの調査や作業を最後まで進める"}</td>
                      <td>{"作業ごとに依頼"}</td>
                    </tr>
                    <tr>
                      <td>{"Codex"}</td>
                      <td>{"コードの作成・修正・レビュー"}</td>
                      <td>{"開発タスクごと"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>{"dot"}</strong>
                      </td>
                      <td>
                        <strong>{"継続的な責任"}</strong>
                        {"(見守り、定期確認、段取り、手配)"}
                      </td>
                      <td>{"常時待機し、必要に応じて上記へ委任"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <div className={styles["diagram-card"]}>
                {"\n"}
                {"              "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="3">
                    <MermaidDiagram chart={DIAGRAM_3} theme="base" themeVariables={THEME} />
                  </div>
                </div>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  <strong>{"初学者の目安"}</strong>
                  {": 「来週もこの件を気にかけておいてほしい」と思ったら"}
                  {"\n"}
                  {"                "}
                  {
                    "dot、「今これを片付けて」なら Work や Codex、という切り分けが分かりやすいです。△"
                  }
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h1 id="part-2-始める">{"Part 2: 始める"}</h1>
              {"\n"}
              {"            "}
              <div className={styles["diagram-card"]}>
                {"\n"}
                {"              "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="4">
                    <MermaidDiagram chart={DIAGRAM_4} theme="base" themeVariables={THEME} />
                  </div>
                </div>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="step-0-利用資格と費用を確認する">{"Step 0: 利用資格と費用を確認する"}</h2>
              {"\n"}
              {"            "}
              <h3 id="0-1-提供範囲ローンチ時点の公式情報">
                {"0-1. 提供範囲(ローンチ時点の公式情報)"}
              </h3>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"項目"}</th>
                      <th>{"内容"}</th>
                      <th>{"確度"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"Pro"}</td>
                      <td>{"EEA(欧州経済領域)・スイス・英国を除く市場。段階的に展開"}</td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"Business Premium"}</td>
                      <td>{"サポート対象の全リージョン。ワークスペースでの利用が必要"}</td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"Enterprise(Edu・Healthcare 含む)"}</td>
                      <td>{"ベータ。ワークスペース管理者が有効化するまで既定はオフ"}</td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"年齢"}</td>
                      <td>{"18歳以上"}</td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"Free / Go / Plus"}</td>
                      <td>{"対象外と案内されている"}</td>
                      <td>{"○"}</td>
                    </tr>
                    <tr>
                      <td>{"Pro の価格帯"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"発表当初は「Pro」としか記載がなく、$200"}
                        {"\n"}
                        {"                      "}
                        {"のみとの報道もあったが、10月初旬の公式ガイドでは Pro 100 / 200 / 500"}
                        {"\n"}
                        {"                      "}
                        {"が対象と案内されたと報告されている"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"○(要再確認)"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <h3 id="0-2-費用と使用量">{"0-2. 費用と使用量"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"項目"}</th>
                      <th>{"内容"}</th>
                      <th>{"確度"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"最初の dot"}</td>
                      <td>{"Pro・Business Premium では追加料金なし"}</td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"dot との会話"}</td>
                      <td>{"ChatGPT の使用量上限にはカウントされない"}</td>
                      <td>{"○"}</td>
                    </tr>
                    <tr>
                      <td>{"dot が起動する Codex・Work のタスク"}</td>
                      <td>{"使用量にカウントされる"}</td>
                      <td>{"○"}</td>
                    </tr>
                    <tr>
                      <td>{"最初の1か月"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "プランごとに案内された、上限を拡大した使用量枠が適用される。使用量にカウントされないのは"
                        }
                        {"\n"}
                        {"                      "}
                        <strong>{"dot との会話のみ"}</strong>
                        {"で、dot が起動する Work・Codex"}
                        {"\n"}
                        {"                      "}
                        {"のタスクはカウントされる。その後の条件は各プランで案内予定"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"追加の dot・速度・作業量"}</td>
                      <td>{"今後追加できる予定(価格は未公表)"}</td>
                      <td>{"◎"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  <strong>{"要確認"}</strong>
                  {":"}
                  {"\n"}
                  {"                "}
                  {"「最初の1か月」は発表(9月29日)からの期間なので、"}
                  <strong>{"10月末に切り替わる可能性があります"}</strong>
                  {"。最新の条件は必ずヘルプセンターで確認してください。"}
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"            "}
              <h3 id="0-3-作る前の心構え3原則">{"0-3. 作る前の心構え(3原則)"}</h3>
              {"\n"}
              {"            "}
              <ol>
                {"\n"}
                {"              "}
                <li>
                  <strong>{"最初から全権を渡さない"}</strong>
                  {"。読み取りと下書きから始める。△"}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  <strong>{"取り消せないこと(送信・購入・削除)は、人が最後に押す"}</strong>
                  {"。◎(OpenAI"}
                  {"\n"}
                  {"                "}
                  {"も購入や完全削除には承認を求める設計)"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  <strong>{"初週は不具合が出る前提"}</strong>
                  {
                    "で、重要な業務に直結させない。△(早期レビューで、権限エラーやメッセージ欠落が報告されている"
                  }
                  {"\n"}
                  {"                "}
                  {"○)"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ol>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="step-1-最初の-dot-を作る">{"Step 1: 最初の dot を作る"}</h2>
              {"\n"}
              {"            "}
              <h3 id="手順">{"手順"}</h3>
              {"\n"}
              {"            "}
              <ol>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  <strong>{"ChatGPT デスクトップアプリ"}</strong>
                  {"(Windows"}
                  {"\n"}
                  {"                "}
                  {"版もあり)、"}
                  <strong>{"デスクトップのブラウザ"}</strong>
                  {"、または"}
                  {"\n"}
                  {"                "}
                  <strong>{"iOS / Android アプリ"}</strong>
                  {"で ChatGPT を開く ◎(Slack"}
                  {"\n"}
                  {"                "}
                  {
                    "など一部の接続はデスクトップで設定する。テキストメッセージはモバイルアプリ・デスクトップ"
                  }
                  {"\n"}
                  {"                "}
                  {
                    "Web・デスクトップアプリのいずれからも設定できる。dot の作成自体はモバイルでも可能)"
                  }
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"画面の案内に従って dot"}
                  {"\n"}
                  {"                "}
                  {"を作成し、"}
                  <strong>{"名前"}</strong>
                  {"を付ける(後からプロフィールの鉛筆アイコンで変更可)◎"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>{"キャラクターまたはペットを選ぶ(見た目だけの設定)◎"}</li>
                {"\n"}
                {"              "}
                <li>
                  {"作成後、dot に"}
                  <strong>{"自己紹介"}</strong>
                  {"をさせる ◎"}
                </li>
                {"\n"}
                {"            "}
              </ol>
              {"\n"}
              {"            "}
              <div className={styles["diagram-card"]}>
                {"\n"}
                {"              "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="5">
                    <MermaidDiagram chart={DIAGRAM_5} theme="base" themeVariables={THEME} />
                  </div>
                </div>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <h3 id="つまずきポイント">{"つまずきポイント"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"症状"}</th>
                      <th>{"原因と対処"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {"発表ページの作成リンクで「デスクトップから作成してください」と出る"}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"発表直後はモバイルから作成できなかった。Simon Willison"}
                        {"\n"}
                        {"                      "}
                        {"氏もこの表示に遭遇している ◎。現在は iOS / Android"}
                        {"\n"}
                        {"                      "}
                        {"アプリからの作成にも対応している"}
                        {"\n"}
                        {"                      "}
                        {
                          "◎。表示が出る場合はアプリを最新版に更新するか、デスクトップで作成する。なお、Slack"
                        }
                        {"\n"}
                        {"                      "}
                        {
                          "など一部の接続はデスクトップで設定する(テキストメッセージはモバイルからも設定可能)"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"使えない"}</td>
                      <td>{"段階的な展開のため、アカウントに届くまで数日かかる場合がある ◎"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="step-2-アプリプラグインを最小限だけ接続する">
                {"\n"}
                {"              "}
                {"Step 2: アプリ(プラグイン)を最小限だけ接続する"}
                {"\n"}
                {"            "}
              </h2>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"dot"}
                {"\n"}
                {"              "}
                {
                  "がアプリ経由で読める情報や実行できる操作は、あなたが接続したアプリの範囲に限られます。◎"
                }
                {"\n"}
                {"              "}
                {"ただし、これは dot"}
                {"\n"}
                {"              "}
                {
                  "ができることのすべての境界ではありません。専用のクラウドブラウザ・コンピュータ(および自分の"
                }
                {"\n"}
                {"              "}
                {"PC との接続)は、アプリ接続とは別に管理する権限として扱ってください(→"}
                {"\n"}
                {"              "}
                <a href="#step-6-チャンネルと自分の-pc-をつなぐ">{"Step 6"}</a>
                {"、"}
                <a href="#8-安全設計を理解する">{"8. 安全設計"}</a>
                {")。接続は"}
                {"\n"}
                {"              "}
                <strong>{"「いま任せたい仕事に必要な最小限」"}</strong> {"から始めます。また、"}
                <strong>
                  {"接続するときに同時に "}
                  <a href="#step-3-custom-rules-を先に決める">{"Step 3"}</a> {"の"}
                  {"\n"}
                  {"                "}
                  {"Custom Rules を確認し、既定のまま使うか厳しくするかを決めてください"}
                </strong>
                {"(接続とルールの判断を1つの手順として行います)。△"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <h3 id="2-1-接続の前に知っておくこと">{"2-1. 接続の前に知っておくこと"}</h3>
              {"\n"}
              {"            "}
              <ul>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"接続したアプリの情報を、dot は"}
                  <strong>{"頼まれなくても背景で確認し、記憶を作ることがある"}</strong>
                  {"\n"}
                  {"                "}
                  {"◎"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  <strong>{"アプリの接続を解除しても、すでに dot が取得した情報は消えない"}</strong>
                  {"。dot"}
                  {"\n"}
                  {"                "}
                  {
                    "自身のコンテキストから消すには dot 自体を削除(Delete)する ◎(Delete で消えるのは dot"
                  }
                  {"\n"}
                  {"                "}
                  {"自身のコンテキストで、ChatGPT"}
                  {"\n"}
                  {"                "}
                  {"のメモリ・ファイル・会話など別に管理される情報は削除されない →"}
                  {"\n"}
                  {"                "}
                  <a href="#7-3-削除する-deletedot-の削除">{"7-3"}</a>
                  {"、"}
                  <a href="#9-メモリとプライバシー">{"9"}</a>
                  {")"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"プラグインの権限は dots・ChatGPT・Work・Codex"}
                  {"\n"}
                  {"                "}
                  {"で"}
                  <strong>{"共有"}</strong>
                  {"される(すでに接続済みのものは使える)◎"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"メールは、"}
                  <strong>{"個人のメールアカウントを接続して使わせる"}</strong>
                  {"ことができる。ローンチ時点では"}
                  {"\n"}
                  {"                "}
                  {"dot 専用のメールアドレスは持てなかった"}
                  {"\n"}
                  {"                "}
                  {"◎(その後、専用アドレスを持たせた利用者の報告もあるため、最新状況は要確認 ○ →"}
                  {"\n"}
                  {"                "}
                  <a href="#132-ethan-mollickwharton-教授one-useful-thing">{"13.2"}</a>
                  {")"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"            "}
              <h3 id="2-2-最小権限の接続順序おすすめ">{"2-2. 最小権限の接続順序(おすすめ)"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"順番"}</th>
                      <th>{"接続するもの"}</th>
                      <th>{"理由"}</th>
                      <th>{"確度"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"1"}</td>
                      <td>{"カレンダー(読み取り中心)"}</td>
                      <td>{"影響が小さく、価値がすぐ分かる"}</td>
                      <td>{"△"}</td>
                    </tr>
                    <tr>
                      <td>{"2"}</td>
                      <td>{"メール(読み取り)"}</td>
                      <td>{"要約・下書き作成に使える"}</td>
                      <td>{"△"}</td>
                    </tr>
                    <tr>
                      <td>{"3"}</td>
                      <td>{"Slack"}</td>
                      <td>{"相談窓口になる。ただし「何を監視するか」は明示が必要"}</td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"4"}</td>
                      <td>{"送信・変更ができる権限"}</td>
                      <td>{"Custom Rules が固まり、挙動を観察してから"}</td>
                      <td>{"△"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  <strong>{"ベストプラクティス"}</strong>
                  {":"}
                  {"\n"}
                  {"                "}
                  {
                    "アプリを足すたびに、そのプラグインが**「読むだけ」か「変更・送信もできる」か**を権限画面で必ず確認しましょう。△"
                  }
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="step-3-custom-rules-を先に決める">{"Step 3: Custom Rules を先に決める"}</h2>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                <strong>{"Custom Rules は、dots を安全に使う最重要の設定"}</strong>
                {"です。◎"}
                {"\n"}
                {"              "}
                {"「接続の前に、または接続と同時に」決めるのが鉄則です。△"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <h3 id="3-1-4つの挙動">{"3-1. 4つの挙動"}</h3>
              {"\n"}
              {"            "}
              <p>{"行為(例:メール送信、購入、ファイル共有)ごとに、次の4つから選びます。◎"}</p>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"挙動"}</th>
                      <th>{"意味"}</th>
                      <th>{"向いている行為"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"確認なしで実行"}</td>
                      <td>{"聞かずにやる"}</td>
                      <td>{"調査・整理・下書き・自分だけが見るチェックリスト更新"}</td>
                    </tr>
                    <tr>
                      <td>{"事前承認があれば実行"}</td>
                      <td>
                        {"あなたがプロンプトで"}
                        <strong>{"明示的に依頼した行為"}</strong>
                        {"だけ実行"}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"「明日9時に、A社の経理担当(billing@example.com)へ、請求書 INV-1024"}
                        {"\n"}
                        {"                      "}
                        {
                          "を添付し、確認済みの文面で送って」のように、宛先・内容・送信時刻(または条件)を指定した送信"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"実行前に確認"}</td>
                      <td>{"毎回聞く"}</td>
                      <td>{"社内への連絡、予定の変更"}</td>
                    </tr>
                    <tr>
                      <td>{"あなたに引き渡す"}</td>
                      <td>{"あなたが自分で行う"}</td>
                      <td>{"社外への公開、金銭、パスワード、権限変更"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  {"「事前承認(pre-approved)」とは、"}
                  <strong>{"あなたがプロンプトで明示的にその行為を依頼した"}</strong>
                  {"という意味です。◎"}
                  {"\n"}
                  {"                "}
                  {"「下書きを作って」は「送って」という承認にはなりません。◎"}
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"            "}
              <h3 id="3-2-変更できないもの">{"3-2. 変更できないもの"}</h3>
              {"\n"}
              {"            "}
              <p>
                {"Custom Rules で次のものは"}
                <strong>{"オフにできません"}</strong>
                {"。◎"}
              </p>
              {"\n"}
              {"            "}
              <ul>
                {"\n"}
                {"              "}
                <li>{"中核の安全要件(例:パスワード変更ではあなたに操作を返す)"}</li>
                {"\n"}
                {"              "}
                <li>{"Auto-review(別の安全チェック)"}</li>
                {"\n"}
                {"              "}
                <li>{"プロアクティブ調査の制限(読み取り専用)"}</li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"            "}
              <h3 id="3-3-設定場所">{"3-3. 設定場所"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"画面"}</th>
                      <th>{"場所"}</th>
                      <th>{"確度"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"モバイル"}</td>
                      <td>{"Customize → Custom rules"}</td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"デスクトップ"}</td>
                      <td>{"Settings → Personalization → Permissions"}</td>
                      <td>{"○"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"dot"}
                {"\n"}
                {"              "}
                {"にルール案を作らせることもできますが、"}
                <strong>{"ルールの変更には、あなたの承認が必要"}</strong>
                {"です。◎"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <h3 id="3-4-初期設定の例コピーして使えます">
                {"3-4. 初期設定の例(コピーして使えます)"}
              </h3>
              {"\n"}
              {"            "}
              <p>{"次のプロンプトで、厳しめのルールを dot と一緒に作れます。△"}</p>
              {"\n"}
              {"            "}
              <div className={styles["code-block"]} data-testid="code-block">
                {"\n"}
                {"              "}
                <div className={styles["code-lang"]}>{"markdown"}</div>
                {"\n"}
                {"              "}
                <pre>
                  <code className={["language-markdown", styles.hljs].join(" ")}>
                    <div className={styles.codeLine}>
                      {"Custom Rules を一緒に作りたいです。最初は厳しめにしてください。"}
                      {"\n"}
                      {"\n"}
                      <span className="hljs-bullet">{"-"}</span>{" "}
                      {"メールやメッセージの送信は、毎回、実行前に私に確認する"}
                      {"\n"}
                      <span className="hljs-bullet">{"-"}</span> {"購入や支払いは必ず私に引き渡す"}
                      {"\n"}
                      <span className="hljs-bullet">{"-"}</span>{" "}
                      {"パスワードや金銭に関わる操作は必ず私に引き渡す"}
                      {"\n"}
                      <span className="hljs-bullet">{"-"}</span>{" "}
                      {"私の個人情報を、このチャット以外へ共有しない"}
                      {"\n"}
                      {"\n"}
                      {"各ルールを1つずつ見せて、私が承認してから保存してください。"}
                      {"\n"}
                    </div>
                  </code>
                </pre>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <h3 id="3-5-ルールを決める2つの質問">{"3-5. ルールを決める「2つの質問」"}</h3>
              {"\n"}
              {"            "}
              <p>{"どの挙動を選ぶか迷ったら、次の判断で整理できます。△"}</p>
              {"\n"}
              {"            "}
              <div className={styles["diagram-card"]}>
                {"\n"}
                {"              "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="6">
                    <MermaidDiagram chart={DIAGRAM_6} theme="base" themeVariables={THEME} />
                  </div>
                </div>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  <strong>{"覚えておくこと"}</strong>
                  {": OpenAI 自身も「dot"}
                  {"\n"}
                  {"                "}
                  {"は"}
                  <strong>{"ルールに従っているつもりでも"}</strong>
                  {"間違えることがある」と明記しています。◎"}
                  {"\n"}
                  {"                "}
                  {
                    "ルールは「やらせない保証」ではなく**「やらせたくない方向への強い指示」**と考え、公開物や金銭は最終ボタンを人に残してください。△"
                  }
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="step-4-最初の仕事を任せるブリーフの書き方">
                {"\n"}
                {"              "}
                {"Step 4: 最初の仕事を任せる(ブリーフの書き方)"}
                {"\n"}
                {"            "}
              </h2>
              {"\n"}
              {"            "}
              <h3 id="4-1-最初の原則-質問ではなく仕事を渡す">
                {"\n"}
                {"              "}
                {"4-1. 最初の原則: 「質問」ではなく「仕事」を渡す"}
                {"\n"}
                {"            "}
              </h3>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"dot"}
                {"\n"}
                {"              "}
                {
                  "には、孤立したプロンプトではなく、**「継続して見ておいてほしいこと」**から始めるよう"
                }
                {"\n"}
                {"              "}
                {"OpenAI のガイドが勧めています。○(Forbes が OpenAI のガイダンスとして紹介)"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <h3 id="4-2-良いブリーフの5要素">{"4-2. 良いブリーフの5要素"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"要素"}</th>
                      <th>{"書くこと"}</th>
                      <th>{"例"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"ゴール"}</td>
                      <td>{"何を達成したいか(結果)"}</td>
                      <td>{"「来週の新機能リリースを予定通り進める」"}</td>
                    </tr>
                    <tr>
                      <td>{"情報源"}</td>
                      <td>{"どこを正とするか"}</td>
                      <td>{"「進捗は共有スプレッドシート『リリース管理』を正とする」"}</td>
                    </tr>
                    <tr>
                      <td>{"成果物"}</td>
                      <td>{"何をいつ出すか"}</td>
                      <td>{"「毎週月曜9時に、遅れている項目の要約」"}</td>
                    </tr>
                    <tr>
                      <td>{"権限の範囲"}</td>
                      <td>{"やってよいこと・いけないこと"}</td>
                      <td>{"「下書きは自由。送信は私の確認後」"}</td>
                    </tr>
                    <tr>
                      <td>{"レビュー点"}</td>
                      <td>{"どこで人が見るか"}</td>
                      <td>{"「外部に出る文面は私が確認」"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  <strong>{"コツ(重要)"}</strong>
                  {":"}
                  {"\n"}
                  {"                "}
                  {"手順を細かく書くより、"}
                  <strong>{"ゴール・制約・完了条件"}</strong>
                  {"を渡すほうが、最近のエージェントには効果的です。Ethan"}
                  {"\n"}
                  {"                "}
                  {"Mollick"}
                  {"\n"}
                  {"                "}
                  {
                    "氏は、手順を1つずつ指示するプロンプトの価値が新しいモデルでは小さくなっていると述べています。→"
                  }
                  {"\n"}
                  {"                "}
                  <a href="#132-ethan-mollickwharton-教授one-useful-thing">{"13.2"}</a>
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"            "}
              <h3 id="4-3-最初の自己紹介プロンプトおすすめ">
                {"\n"}
                {"              "}
                {"4-3. 最初の自己紹介プロンプト(おすすめ)"}
                {"\n"}
                {"            "}
              </h3>
              {"\n"}
              {"            "}
              <p>{"最初に、dot に「あなたの仕事」を聞き取らせます。△"}</p>
              {"\n"}
              {"            "}
              <div className={styles["code-block"]} data-testid="code-block">
                {"\n"}
                {"              "}
                <div className={styles["code-lang"]}>{"markdown"}</div>
                {"\n"}
                {"              "}
                <pre>
                  <code className={["language-markdown", styles.hljs].join(" ")}>
                    <div className={styles.codeLine}>
                      {"自己紹介をしてください。そのあと、私の働き方を1問ずつ質問してください。"}
                      {"\n"}
                      {"聞くこと: 私の役割、今四半期の優先事項、使っているツール、良い仕事の基準。"}
                      {"\n"}
                      {"\n"}
                      {"メモは短くしてください。"}
                      {"\n"}
                      {"パスワードや金融情報など、機微な情報は保存しないでください。"}
                      {"\n"}
                      {"私が「OK」と言うまで、このチャット以外での行動はしないでください。"}
                      {"\n"}
                    </div>
                  </code>
                </pre>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <h3 id="4-4-週次ステータスのブリーフテンプレート">
                {"\n"}
                {"              "}
                {"4-4. 週次ステータスのブリーフ(テンプレート)"}
                {"\n"}
                {"            "}
              </h3>
              {"\n"}
              {"            "}
              <div className={styles["code-block"]} data-testid="code-block">
                {"\n"}
                {"              "}
                <div className={styles["code-lang"]}>{"markdown"}</div>
                {"\n"}
                {"              "}
                <pre>
                  <code className={["language-markdown", styles.hljs].join(" ")}>
                    <div className={styles.codeLine}>
                      <span className="hljs-section">{"# ミッション"}</span>
                      {"\n"}
                      {"毎週金曜16時までに、今週の進捗レポートの下書きを作ってください。"}
                      {"\n"}
                      {"\n"}
                      <span className="hljs-section">{"# 情報源"}</span>
                      {"\n"}
                      <span className="hljs-bullet">{"-"}</span> {"カレンダーの今週の会議"}
                      {"\n"}
                      <span className="hljs-bullet">{"-"}</span> {"共有ドキュメント「週次メモ」"}
                      {"\n"}
                      {"\n"}
                      <span className="hljs-section">{"# 成果物の形式"}</span>
                      {"\n"}
                      <span className="hljs-bullet">{"-"}</span>{" "}
                      {"完了 / 次にやること / 判断が必要なこと の3セクション"}
                      {"\n"}
                      <span className="hljs-bullet">{"-"}</span>{" "}
                      {"各項目に、根拠にした元メモの箇所を添える"}
                      {"\n"}
                      {"\n"}
                      <span className="hljs-section">{"# ルール"}</span>
                      {"\n"}
                      <span className="hljs-bullet">{"-"}</span> {"下書きまでは自由に作成してよい"}
                      {"\n"}
                      <span className="hljs-bullet">{"-"}</span>{" "}
                      {"メールやメッセージの送信は、必ず私に確認する"}
                      {"\n"}
                      <span className="hljs-bullet">{"-"}</span>{" "}
                      {"情報が足りないときは、推測せず質問する"}
                      {"\n"}
                    </div>
                  </code>
                </pre>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <h3 id="4-5-最初の1週間におすすめの小さな仕事">
                {"\n"}
                {"              "}
                {"4-5. 最初の1週間におすすめの「小さな仕事」"}
                {"\n"}
                {"            "}
              </h3>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"仕事"}</th>
                      <th>{"理由"}</th>
                      <th>{"権限"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"毎朝のカレンダー確認と予定の要約"}</td>
                      <td>{"読み取りのみで安全"}</td>
                      <td>{"読み取り"}</td>
                    </tr>
                    <tr>
                      <td>{"週次ステータスの下書き"}</td>
                      <td>{"下書きで止められる"}</td>
                      <td>{"読み取り+下書き"}</td>
                    </tr>
                    <tr>
                      <td>{"調べ物の定点観測(競合・ニュース)"}</td>
                      <td>{"背景調査に向く"}</td>
                      <td>{"読み取り"}</td>
                    </tr>
                    <tr>
                      <td>{"請求書の下書き(送信は承認後)"}</td>
                      <td>{"事例が公式にあり、承認の流れを体験できる"}</td>
                      <td>{"下書き+確認後送信"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h1 id="part-3-任せる">{"Part 3: 任せる"}</h1>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="step-5-定期タスクとバックグラウンド調査">
                {"\n"}
                {"              "}
                {"Step 5: 定期タスクとバックグラウンド調査"}
                {"\n"}
                {"            "}
              </h2>
              {"\n"}
              {"            "}
              <h3 id="5-1-定期タスクスケジュール">{"5-1. 定期タスク(スケジュール)"}</h3>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"dot"}
                {"\n"}
                {"              "}
                {"に「毎朝カレンダーを確認して今日の予定を教えて」のように頼むと、"}
                <strong>{"定期実行"}</strong>
                {"されます。◎"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <ul>
                {"\n"}
                {"              "}
                <li>{"実行履歴は会話に表示される ◎"}</li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"dot のプロフィールの"}
                  {"\n"}
                  {"                "}
                  <strong>{"In progress / Scheduled / Completed"}</strong> {"で状況を確認できる ◎"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>{"タスクを開いて、繰り返しの頻度・時刻・完了通知を変更できる ◎"}</li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {
                    "「決まった時刻に動かしたい仕事」には、スケジュールを明示して保存する。スケジュールには、仕事の内容、タイムゾーン、通知条件、通知先を含める"
                  }
                  {"\n"}
                  {"                "}
                  {"○"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"            "}
              <div className={styles["code-block"]} data-testid="code-block">
                {"\n"}
                {"              "}
                <div className={styles["code-lang"]}>{"markdown"}</div>
                {"\n"}
                {"              "}
                <pre>
                  <code className={["language-markdown", styles.hljs].join(" ")}>
                    <div className={styles.codeLine}>
                      {"毎週月曜の朝7時(日本時間)に、今週のカレンダーと"}
                      {"\n"}
                      {"Google Drive の「計画メモ」を確認してください。"}
                      {"\n"}
                      {"\n"}
                      <span className="hljs-bullet">{"-"}</span>{" "}
                      {"重要な変更や衝突があるときだけ、私に個別にメッセージを送る"}
                      {"\n"}
                      <span className="hljs-bullet">{"-"}</span>{" "}
                      {"何もなければ「特になし」と週次のまとめに書く(水増しはしない)"}
                      {"\n"}
                      <span className="hljs-bullet">{"-"}</span>{" "}
                      {"ファイルの変更や送信はしない(読み取りのみ)"}
                      {"\n"}
                    </div>
                  </code>
                </pre>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  <strong>{"ポイント"}</strong>
                  {":"}
                  {"\n"}
                  {"                "}
                  {
                    "通知は「毎回」ではなく**「判断が必要なときだけ」**にすると、見守りの負担が減ります。△"
                  }
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"            "}
              <h3 id="5-2-プロアクティブ調査頼まれていない時間の動き">
                {"\n"}
                {"              "}
                {"5-2. プロアクティブ調査(頼まれていない時間の動き)"}
                {"\n"}
                {"            "}
              </h3>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"dot"}
                {"\n"}
                {"              "}
                {"は、あなたが操作していない間に、背景で"}
                <strong>{"接続済みの情報源を読み取り、役立ちそうな提案を探す"}</strong>
                {"ことがあります。◎"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <p>
                {"この機能は"}
                <strong>{"コードで制限"}</strong>
                {"されており、次のことはできません。◎"}
              </p>
              {"\n"}
              {"            "}
              <ul>
                {"\n"}
                {"              "}
                <li>{"他の人にメッセージを送る"}</li>
                {"\n"}
                {"              "}
                <li>{"プラグイン経由でコンテンツを変更する"}</li>
                {"\n"}
                {"              "}
                <li>{"ブラウザやコンピュータを操作する"}</li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"            "}
              <div className={styles["diagram-card"]}>
                {"\n"}
                {"              "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="7">
                    <MermaidDiagram chart={DIAGRAM_7} theme="base" themeVariables={THEME} />
                  </div>
                </div>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                <strong>{"重要"}</strong>
                {":"}
                {"\n"}
                {"              "}
                {"能動的な調査用のツールは"}
                <strong>{"直接メッセージを送信できません"}</strong>
                {"。調査で見つけたことを実行に移す段階では、"}
                <strong>{"通常の行動ルールと安全チェックが適用"}</strong>
                {
                  "されます。これらのチェックはミスを減らしますが、完全になくすものではありません。◎"
                }
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="step-6-チャンネルと自分の-pc-をつなぐ">
                {"\n"}
                {"              "}
                {"Step 6: チャンネルと自分の PC をつなぐ"}
                {"\n"}
                {"            "}
              </h2>
              {"\n"}
              {"            "}
              <h3 id="6-1-チャンネル連絡手段">{"6-1. チャンネル(連絡手段)"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"チャンネル"}</th>
                      <th>{"設定方法"}</th>
                      <th>{"注意点"}</th>
                      <th>{"確度"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"ChatGPT(デスクトップアプリ・デスクトップ Web・モバイルアプリ)"}</td>
                      <td>{"そのまま"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"メッセージはデスクトップアプリ・デスクトップ"}
                        {"\n"}
                        {"                      "}
                        {"Web・モバイルアプリのいずれでも可能。"}
                        <strong>{"dot との通話は ChatGPT モバイルアプリのみ"}</strong>
                        {"。ローンチ時点では dot からあなたへ"}
                        <strong>{"発信はできない"}</strong>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"Slack"}</td>
                      <td>{"デスクトップで連携を設定"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"チャンネルに追加しただけでは監視は始まらない。"}
                        <strong>
                          {"監視するチャンネルとイベント(例: 不具合報告の投稿)を指定"}
                        </strong>
                        {"し、作成されたタスクの"}
                        <strong>{"条件と状態を確認"}</strong>
                        {"する"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎ / ○"}</td>
                    </tr>
                    <tr>
                      <td>{"Microsoft Teams"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "組織の設定が必要。Enterprise 管理ガイドでは招待制のアルファと記載されている"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"管理者の許可が必要"}</td>
                      <td>{"○"}</td>
                    </tr>
                    <tr>
                      <td>{"テキストメッセージ"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "ChatGPT モバイルアプリ、デスクトップアプリ、またはデスクトップ Web の dot"
                        }
                        {"\n"}
                        {"                      "}
                        {"プロフィールから電話を接続"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"限定ベータ(米国の一部 Pro のみ)。"}
                        <strong>{"iMessage または RCS が必要で、SMS には非対応"}</strong>
                        {"。"}
                        <strong>
                          {"iMessage や RCS"}
                          {"\n"}
                          {"                        "}
                          {"を使っても、テキストメッセージはエンドツーエンド暗号化されない"}
                        </strong>
                        {"。第三者プロバイダー経由なので、"}
                        <strong>{"機微な情報の送信には注意"}</strong>
                        {"。"}
                        <code>{"STOP"}</code>
                        {"\n"}
                        {"                      "}
                        {"と返信すると dot からの送信が止まる"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  <strong>{"覚えておくこと"}</strong>
                  {":"}
                  {"\n"}
                  {"                "}
                  {"通話を終えても、"}
                  <strong>{"頼んだ作業が止まるとは限りません"}</strong>
                  {"。作業を止めたいときは、Pause"}
                  {"\n"}
                  {"                "}
                  {"やタスクの停止を使いましょう。○"}
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"            "}
              <h3 id="6-2-あなた自身の-pc-を使わせる任意">
                {"6-2. あなた自身の PC を使わせる(任意)"}
              </h3>
              {"\n"}
              {"            "}
              <ul>
                {"\n"}
                {"              "}
                <li>
                  {"既定は"}
                  <strong>{"オフ"}</strong>
                  {"。dot は専用のクラウド PC で動く ◎"}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"接続するには、"}
                  <strong>{"その PC の ChatGPT デスクトップアプリ"}</strong>
                  {"で操作し、「アクセスを許可」を確認する。取り消しは「アクセスを取り消す」◎"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"接続すると、dot"}
                  {"\n"}
                  {"                "}
                  {
                    "はローカルのファイルを扱ったり、ローカルのスキルやブラウザを使えるようになる(クラウドのブラウザがブロックされたときに有効)◎"
                  }
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"作業中は、接続した PC がオンラインで ChatGPT アプリを開いている必要がある ○"}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"使う場面"}</th>
                      <th>{"判断"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"調査・下書き・スケジュール管理"}</td>
                      <td>
                        {"接続"}
                        <strong>{"不要"}</strong>
                        {"(クラウドPCで足りる)"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"手元のファイルを直接扱わせたい"}</td>
                      <td>{"必要になった時点で接続"}</td>
                    </tr>
                    <tr>
                      <td>{"機密ファイルが多いPC"}</td>
                      <td>
                        {"接続を"}
                        <strong>{"避ける"}</strong>
                        {"か、作業用の別PCを使う"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  <strong>{"ベストプラクティス"}</strong>
                  {":"}
                  {"\n"}
                  {"                "}
                  {"ローカル接続は「"}
                  <strong>{"必要な期間だけオン、終わったら取り消す"}</strong>
                  {"」運用が安全です。△"}
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="step-7-見守る止めるやり直す">{"Step 7: 見守る・止める・やり直す"}</h2>
              {"\n"}
              {"            "}
              <h3 id="7-1-見守る-activity-view">{"7-1. 見守る: Activity View"}</h3>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"デスクトップアプリの"}
                {"\n"}
                {"              "}
                <strong>{"Activity View"}</strong>
                {"\n"}
                {"              "}
                {"では、進行中・委任中のタスクと状態を確認でき、"}
                <strong>{"文脈の追加・誤解の訂正・方向転換・停止の指示"}</strong>
                {"ができます。◎"}
                {"\n"}
                {"              "}
                {"また、dot のプロフィールから"}
                <strong>{"dot の専用 PC を開いて"}</strong>
                {"、作業の様子を直接見ることもできます。◎"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <h3 id="7-2-止める-停止の4つの手段">{"7-2. 止める: 停止の4つの手段"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"操作"}</th>
                      <th>{"効果"}</th>
                      <th>{"注意"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"Pause(プロフィールの「…」メニュー)"}</td>
                      <td>
                        {"dot を一時停止し、"}
                        <strong>{"Resume するまで"}</strong>
                        {"止める"}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"委任したタスクは Activity、定期タスクの状態と操作は Scheduled で確認する"}
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Activity"}</td>
                      <td>{"個別の委任タスクを開いて確認・停止"}</td>
                      <td>{"タスクごとに操作"}</td>
                    </tr>
                    <tr>
                      <td>{"Scheduled"}</td>
                      <td>{"定期タスクを無効化・削除"}</td>
                      <td>{"繰り返しを止めたいときに使う"}</td>
                    </tr>
                    <tr>
                      <td>{"Resume"}</td>
                      <td>{"一時停止から再開"}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <p>{"出典: 公式ドキュメントの内容を二次資料経由で整理 ○"}</p>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  <strong>{"重要"}</strong>
                  {":"}
                  {"\n"}
                  {"                "}
                  <strong>
                    {"Pause や Delete(dot"}
                    {"\n"}
                    {"                  "}
                    {"の削除)は、完了済みの変更を自動的にロールバックしません"}
                  </strong>
                  {
                    "。取り消しや復元ができるかどうかは操作の種類と接続アプリによって異なるため、必要に応じて接続アプリ側の復元手段(送信取り消し、変更履歴、ゴミ箱など)を確認してください。○"
                  }
                  {"\n"}
                  {"                "}
                  {"だからこそ、事前の Custom Rules が大切です。"}
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"            "}
              <h3 id="7-3-削除する-deletedot-の削除">{"7-3. 削除する: Delete(dot の削除)"}</h3>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"Delete は、dot"}
                {"\n"}
                {"              "}
                {"の"}
                <strong>{"コンテキスト・保存済みメモリ・定期タスクを削除"}</strong>
                {"し、dot"}
                {"\n"}
                {"              "}
                {"の"}
                <strong>{"メインの会話はアーカイブ"}</strong>
                {"します(会話そのものが削除されるわけではありません)。◎"}
                {"\n"}
                {"              "}
                {
                  "一方で、dot が作成したファイルや、別に作られた Work・Codex のチャットは残ります。○"
                }
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  <strong>{"注意"}</strong>
                  {":"}
                  {"\n"}
                  {"                "}
                  <strong>{"削除した dot は復元できません"}</strong>
                  {"。確定する前に、削除内容を必ず確認してください。"}
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"手順: dot のプロフィール → 「…」メニュー → "}
                <strong>{"Delete"}</strong> {"を選ぶ →"}
                {"\n"}
                {"              "}
                {"削除内容を確認 → "}
                <strong>{"Delete"}</strong> {"を押して確定 ◎"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  <strong>{"覚えておくこと"}</strong>
                  {": ローンチ時点では、dot"}
                  {"\n"}
                  {"                "}
                  {"が持つ"}
                  <strong>{"個別のメモリを見たり編集・削除することはできず"}</strong>
                  {"、消す方法は"}
                  {"\n"}
                  {"                "}
                  {"dot の Delete のみでした。◎ 機微な情報は、そもそも教えないのが最善です。"}
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h1 id="part-4-守る">{"Part 4: 守る"}</h1>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="8-安全設計を理解する">{"8. 安全設計を理解する"}</h2>
              {"\n"}
              {"            "}
              <p>
                {"OpenAI は、dots の安全を"}
                <strong>{"多層"}</strong>
                {"で作っていると説明しています。◎"}
              </p>
              {"\n"}
              {"            "}
              <div className={styles["diagram-card"]}>
                {"\n"}
                {"              "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="8">
                    <MermaidDiagram chart={DIAGRAM_8} theme="base" themeVariables={THEME} />
                  </div>
                </div>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <h3 id="81-行動ルールの標準的な分類">{"8.1 行動ルールの標準的な分類"}</h3>
              {"\n"}
              {"            "}
              <p>{"OpenAI の安全性投稿とヘルプセンターに基づく整理です(二次資料経由 ○)。"}</p>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"区分"}</th>
                      <th>{"例"}</th>
                      <th>{"既定の扱い"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"読む・準備する"}</td>
                      <td>{"許可された情報の閲覧、分析、会話内の下書き"}</td>
                      <td>{"アプリの権限内で実行"}</td>
                    </tr>
                    <tr>
                      <td>{"情報を共有する"}</td>
                      <td>{"メッセージやファイルの送信"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "共有する情報と相手の種類をカバーする承認が必要。健康情報は相手の指名が必須"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"購入"}</td>
                      <td>{"加盟店サイトに保存済みのカードで購入"}</td>
                      <td>{"承認が必要(事前承認も、その購入を具体的にカバーする場合のみ可)"}</td>
                    </tr>
                    <tr>
                      <td>{"毎回確認(推奨設定)"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "データの完全削除、出所不明のソフトのインストール、新しいセキュリティ関連アクセスの付与"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "承認が必要になる場合がある(常に求められるとは限らない)。安全のため「毎回確認」にしておくことを推奨"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"あなたに引き渡す"}</td>
                      <td>{"パスワード変更、金融口座間の送金"}</td>
                      <td>{"あなたが自分で行う"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <p>{"さらに、次の2点が明記されています。◎"}</p>
              {"\n"}
              {"            "}
              <ul>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"1通のメッセージを承認しても、"}
                  <strong>{"以後ずっと連絡してよいという許可にはならない"}</strong>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"後で作業を続けても、他の dot に委任しても、"}
                  <strong>{"承認の範囲は広がらない"}</strong>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"            "}
              <h3 id="82-auto-review-の流れ">{"8.2 Auto-review の流れ"}</h3>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {
                  "対象となる操作(メッセージ送信やファイル変更など)について、実行前に別の安全システムが、あなたの指示・Custom"
                }
                {"\n"}
                {"              "}
                {"Rules・安全要件に照らして計画をチェックします。◎"}
                {"\n"}
                {"              "}
                {"たとえばメールなら、宛先と内容を確認し、"}
                <strong>{"宛先の間違いや意図しない情報漏えい"}</strong>
                {"のリスクを減らします(ただし、完全になくすものではありません)。◎"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <div className={styles["diagram-card"]}>
                {"\n"}
                {"              "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="9">
                    <MermaidDiagram chart={DIAGRAM_9} theme="base" themeVariables={THEME} />
                  </div>
                </div>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  {"Auto-review"}
                  {"\n"}
                  {"                "}
                  {"は「権限を与えるもの」ではなく、"}
                  <strong>{"別の審査役を挟んで確認する仕組み"}</strong>
                  {"です(「reviewer"}
                  {"\n"}
                  {"                "}
                  {"swap, not a permission grant」)。○"}
                  {"\n"}
                  {"                "}
                  <strong>{"あなたが承認しても、中核の安全要件は上書きできません。"}</strong>
                  {"◎"}
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"            "}
              <h3 id="83-認証情報パスワードの扱い">{"8.3 認証情報(パスワード)の扱い"}</h3>
              {"\n"}
              {"            "}
              <ul>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"対応しているサイトでは、"}
                  <strong>{"ログインフォームの入力中はモデルを一時停止"}</strong>
                  {"し、認証情報をモデルに見せずにブラウザ環境へ直接送る"}
                  {"\n"}
                  {"                "}
                  {"○"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {
                    "対応した保存済みパスワードの流れでは、暗号化された専用サービスが認証情報を渡し、モデルには渡さない"
                  }
                  {"\n"}
                  {"                "}
                  {"○"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"ただし、"}
                  <strong>
                    {
                      "チャット・ドキュメント・プラグインに貼り付けたパスワードは、モデルから見える可能性がある"
                    }
                  </strong>
                  {"\n"}
                  {"                "}
                  {"○"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  <strong>{"鉄則"}</strong>
                  {": パスワードや認証コードを、dot"}
                  {"\n"}
                  {"                "}
                  {"のチャットに"}
                  <strong>{"貼り付けない"}</strong>
                  {"。サインインが必要なときは、dot"}
                  {"\n"}
                  {"                "}
                  {"のブラウザ画面で自分が入力する。◎"}
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"            "}
              <h3 id="84-プロンプトインジェクションへの備え">
                {"\n"}
                {"              "}
                {"8.4 プロンプトインジェクションへの備え"}
                {"\n"}
                {"            "}
              </h3>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"Web ページ・メール・ドキュメントに埋め込まれた"}
                <strong>{"悪意ある指示"}</strong>
                {"が、dot"}
                {"\n"}
                {"              "}
                {"の行動に化けるリスクがあります。OpenAI"}
                {"\n"}
                {"              "}
                {
                  "はモデルの安全対策、ツールの制限、行動前のチェック、監視を組み合わせて対処すると説明しており、"
                }
                <strong>{"リスクを減らすが、なくすものではない"}</strong>
                {"と述べています。◎"}
                {"\n"}
                {"              "}
                {"/ ○"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <p>{"あなたにできる対策:"}</p>
              {"\n"}
              {"            "}
              <ol>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  <strong>
                    {"信頼できない相手のメールやファイルを、dot に大量に処理させない"}
                  </strong>
                  {"(特に送信権限があるとき)△"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  <strong>{"外部への送信は「毎回確認」にする"}</strong>
                  {"(Step 3)△"}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"不審な動きを見つけたら、すぐ "}
                  <strong>{"Pause"}</strong>
                  {"(Step 7)"}
                </li>
                {"\n"}
                {"            "}
              </ol>
              {"\n"}
              {"            "}
              <h3 id="85-限界を知る評価結果から">{"8.5 限界を知る(評価結果から)"}</h3>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"OpenAI は GPT-6 Astra の System Card に dots"}
                {"\n"}
                {"              "}
                {"の付録を追加し、プロンプトインジェクションや権限の遵守を評価しています。○"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"評価"}</th>
                      <th>{"報告された結果(二次資料経由)"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"大量の攻撃メールを混ぜた評価"}</td>
                      <td>{"スコア上の攻撃成功なし"}</td>
                    </tr>
                    <tr>
                      <td>{"Auto-review を守るか"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"OpenAI 公式の Auto-review 記事によると、Codex"}
                        {"\n"}
                        {"                      "}
                        {
                          "の社内運用スナップショットではレビュー対象に上がった操作の拒否率は約1%(720件中7件)。検出率(recall)はそれぞれ別の合成評価の値で、プロンプトインジェクションの合成評価で"
                        }
                        {"\n"}
                        {"                      "}
                        {"99.3%、全攻撃カテゴリの合成評価で 90.2%。dots の System Card"}
                        {"\n"}
                        {"                      "}
                        {"評価は、編集なしの実リクエスト 5,000 件と、カテゴリごとに 30"}
                        {"\n"}
                        {"                      "}
                        {"件の合成ケースで行われた。"}
                        <strong>{"完全な安全を保証するものではない"}</strong>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"権限や範囲の変化への適応"}</td>
                      <td>{"91.8% が合格(49件中45件)"}</td>
                    </tr>
                    <tr>
                      <td>{"警告を尊重するか(不要な継続)"}</td>
                      <td>{"15〜17%台で不要な継続が観測された"}</td>
                    </tr>
                    <tr>
                      <td>{"連続タスクでの境界維持"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "重大な逸脱なし。ただし中間タスクが5→10に倍増すると、中程度の範囲逸脱フラグが8.6%→19.7%に上昇"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  <strong>{"読み方"}</strong>
                  {":"}
                  {"\n"}
                  {"                "}
                  {
                    "結果は良好な項目が多い一方、「長い連続作業ほど境界がにじむ」「警告後も続けることがある」という傾向が報告されています。だからこそ、"
                  }
                  <strong>{"長時間の自動実行ほど、Pause と確認を人が握る"}</strong>
                  {"ことが大切です。△(数値の定義は System Card の原文を参照してください)"}
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="9-メモリとプライバシー">{"9. メモリとプライバシー"}</h2>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"項目"}</th>
                      <th>{"内容"}</th>
                      <th>{"確度"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"メモリ"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"dot は ChatGPT"}
                        {"\n"}
                        {"                      "}
                        {
                          "のメモリと最近の会話の文脈を受け取り、自分のメモリも作る(接続アプリからも)。dot"
                        }
                        {"\n"}
                        {"                      "}
                        {"の会話は ChatGPT のメモリにも寄与しうる"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"保持されないもの"}</td>
                      <td>{"認証情報、画像、スクリーンショットは文脈に保持されない"}</td>
                      <td>{"○"}</td>
                    </tr>
                    <tr>
                      <td>{"削除"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"dot 自身のメモリを消すには dot を Delete する。ChatGPT"}
                        {"\n"}
                        {"                      "}
                        {"側のメモリは通常のメモリ設定で管理"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"学習への利用(個人プラン)"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"「Improve the model for everyone」の設定で、dot"}
                        {"\n"}
                        {"                      "}
                        {"の会話や作業が学習に使われるか決まる"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"学習への利用(Business・Enterprise・Edu)"}</td>
                      <td>{"既定では学習に使わない"}</td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"背景調査のメモ"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "直接は学習に使わない。ただし、調査の内容を適格な会話に持ち込むと、設定次第で使われうる"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"人によるレビュー"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "モデル改善をオフにしていても、安全関連などの限られた場合に人が確認することがある"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"カメラ・マイク・画面"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"利用には、まず PC を dot に接続し、そのうえで ChatGPT"}
                        {"\n"}
                        {"                      "}
                        {"アプリにデバイスのアクセス許可を与える必要がある"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"○"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <h3 id="91-プライバシーのベストプラクティス">
                {"9.1 プライバシーのベストプラクティス"}
              </h3>
              {"\n"}
              {"            "}
              <ol>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  <strong>{"機微情報は教えない"}</strong>
                  {"(診断情報・口座・認証情報)。教えたものは Delete"}
                  {"\n"}
                  {"                "}
                  {"まで残る前提で考える △"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  <strong>{"学習への利用を避けたいなら"}</strong>
                  {"、「Improve the model for"}
                  {"\n"}
                  {"                "}
                  {"everyone」の設定を確認する ◎"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  <strong>{"接続を解除しただけで安心しない"}</strong>
                  {"。取得済みの情報を消すには Delete"}
                  {"\n"}
                  {"                "}
                  {"が必要 ◎"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  <strong>{"テキストメッセージで機微な情報をやり取りしない"}</strong>
                  {"(第三者プロバイダー経由)◎"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>{"個人データの請求は、OpenAI の Privacy Portal から行える ◎"}</li>
                {"\n"}
                {"            "}
              </ol>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="10-1週間の運用ルーチン">{"10. 1週間の運用ルーチン"}</h2>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"dot"}
                {"\n"}
                {"              "}
                {"は「設定して終わり」ではなく、"}
                <strong>{"観察して権限を少しずつ広げる"}</strong>
                {"ことで育ちます。△"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <div className={styles["diagram-card"]}>
                {"\n"}
                {"              "}
                <div className={styles["diagram-wrap"]}>
                  {"\n"}
                  {"                "}
                  <div className={styles["diagram-canvas"]} data-diagram-id="10">
                    <MermaidDiagram chart={DIAGRAM_10} theme="base" themeVariables={THEME} />
                  </div>
                  {"\n"}
                  {"              "}
                </div>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <h3 id="101-日別の目安">{"10.1 日別の目安"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"日"}</th>
                      <th>{"やること"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"Day 1"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"dot を作成、アプリは1〜2個だけ接続し、"}
                        <strong>
                          {"接続と同時に既定の Custom Rules を確認して、そのまま使うと決める"}
                        </strong>
                        {"、読み取りの仕事を1つ任せる"}
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Day 2"}</td>
                      <td>
                        {"下書きの仕事を任せる。"}
                        <strong>{"出力は必ず自分で確認"}</strong>
                        {"する"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Day 3〜4"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"良い点・悪い点を具体的に教える(例:"}
                        {"\n"}
                        {"                      "}
                        {
                          "「冗長で一般的すぎる。具体例を残して、冒頭の大げさな表現を削って」)。「ダメ」だけでは学習が進まない"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Day 5〜6"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"承認プロンプトの傾向を見て、"}
                        <strong>{"よく承認する行為だけ"}</strong>
                        {"ルールを緩める。逆に、冷や汗をかいた行為は厳しくする"}
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Day 7"}</td>
                      <td>{"下の週次振り返りを実施"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <h3 id="102-週次振り返りプロンプト">{"10.2 週次振り返りプロンプト"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["code-block"]} data-testid="code-block">
                {"\n"}
                {"              "}
                <div className={styles["code-lang"]}>{"markdown"}</div>
                {"\n"}
                {"              "}
                <pre>
                  <code className={["language-markdown", styles.hljs].join(" ")}>
                    <div className={styles.codeLine}>
                      {"1週間お疲れさまでした。振り返りをしてください。"}
                      {"\n"}
                      {"\n"}
                      <span className="hljs-bullet">{"1."}</span>{" "}
                      {"今週やった仕事を一覧にしてください"}
                      {"\n"}
                      <span className="hljs-bullet">{"2."}</span>{" "}
                      {"私に修正された点と、そこから学んだことを書いてください"}
                      {"\n"}
                      <span className="hljs-bullet">{"3."}</span>{" "}
                      {"判断に迷って止まった場面はありましたか"}
                      {"\n"}
                      <span className="hljs-bullet">{"4."}</span>{" "}
                      {"来週、権限を広げてよい行為と、絞るべき行為を提案してください"}
                      {"\n"}
                      {"\n"}
                      {"提案だけにして、ルールの変更は私の承認後に行ってください。"}
                      {"\n"}
                    </div>
                  </code>
                </pre>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="11-よくある失敗とトラブルシュート">{"11. よくある失敗とトラブルシュート"}</h2>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"失敗・症状"}</th>
                      <th>{"原因"}</th>
                      <th>{"対処"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"毎回、承認を求められて面倒"}</td>
                      <td>{"ルールが厳しい、または依頼が曖昧"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"頻繁に承認する"}
                        <strong>{"低リスク"}</strong>
                        {
                          "の行為だけ、少しずつ緩める。事前承認にするには、依頼文で対象の行為を具体的に特定する。将来送るメッセージなら、送り先・内容・送信時刻または送信条件も指定する"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"勝手に送ってしまわないか不安"}</td>
                      <td>{"送信のルール未設定"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"送信は「実行前に確認」に設定。"}
                        <strong>{"下書きの依頼は送信の承認ではない"}</strong>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"サインイン・認証コード・CAPTCHA で止まる"}</td>
                      <td>{"本人確認が必要"}</td>
                      <td>{"dot のブラウザ画面を開いて、自分でサインインを完了すると再開する"}</td>
                    </tr>
                    <tr>
                      <td>{"権限エラー・メッセージが届かない"}</td>
                      <td>{"初期のバグや権限設定"}</td>
                      <td>
                        {"プラグインの権限と、接続状態を確認。重要な業務では、まだ依存しすぎない"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"長く動いていて止まらない"}</td>
                      <td>{"委任タスクや定期タスクが残っている"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"Pause で dot を一時停止すると、Resume するまで止まる。委任タスクは"}
                        {"\n"}
                        {"                      "}
                        {"Activity、定期タスクは Scheduled で確認して停止"}
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"実行済みとあるのに成果物がない"}</td>
                      <td>{"完了表示と成果物の配信は別"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"「完了した」は成果物の到達の証拠ではない。"}
                        <strong>{"成果物を自分で確認"}</strong>
                        {"\n"}
                        {"                      "}
                        {"○"}
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"ミスが再発する"}</td>
                      <td>{"好みや基準が伝わっていない"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"「ダメ」ではなく、"}
                        <strong>{"何がどうダメで、どうしてほしいか"}</strong>
                        {"を具体的に伝える"}
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Slack で勝手に動かない"}</td>
                      <td>{"監視の指定がない"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "監視するチャンネルとイベントを明示し、作成されたタスクの条件と状態を確認する"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"使用量の消費が気になる"}</td>
                      <td>{"Work・Codex タスクはカウントされる"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"dot"}
                        {"\n"}
                        {"                      "}
                        {
                          "との会話は上限にカウントされないが、起動されたタスクはカウントされる。大きな作業の前に範囲を確認"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"アプリを外したのに情報が残る"}</td>
                      <td>{"接続解除は取得済み情報を消さない"}</td>
                      <td>{"消したい場合は Delete"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="12-ベストプラクティスチェックリスト">
                {"12. ベストプラクティス・チェックリスト"}
              </h2>
              {"\n"}
              {"            "}
              <h3 id="作る前">{"作る前"}</h3>
              {"\n"}
              {"            "}
              <ul>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" />
                    <span>
                      {"自分のプランと地域が対象か確認した(Pro は EEA・スイス・英国が対象外)"}
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
                    <span>{"最初の1週間は、重要業務に直結させないと決めた"}</span>
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
                    <span>{"費用と使用量の最新条件(最初の1か月の扱いなど)を確認した"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"            "}
              <h3 id="設定">{"設定"}</h3>
              {"\n"}
              {"            "}
              <ul>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" />
                    <span>
                      {"接続するアプリは"}
                      <strong>{"必要最小限"}</strong>
                      {"にした"}
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
                    <span>
                      {"各プラグインの権限(読み取りのみか、変更・送信もできるか)を確認した"}
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
                    <span>
                      <strong>{"Custom Rules を決めた"}</strong>
                      {"(送信・購入・パスワード・金銭)"}
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
                    <span>{"外部への送信は「実行前に確認」または「引き渡し」にした"}</span>
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
                    <span>{"自分の PC への接続はオフのままにした(必要なときだけオン)"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"            "}
              <h3 id="依頼">{"依頼"}</h3>
              {"\n"}
              {"            "}
              <ul>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" />
                    <span>
                      {
                        "「質問」ではなく「仕事」として、ゴール・情報源・成果物・権限・レビュー点を書いた"
                      }
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
                    <span>{"手順の細かい指示ではなく、完了条件と制約を書いた"}</span>
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
                    <span>{"「下書きまで」「変更しない」を依頼文に明示した"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"            "}
              <h3 id="運用">{"運用"}</h3>
              {"\n"}
              {"            "}
              <ul>
                {"\n"}
                {"              "}
                <li className={styles.task}>
                  {"\n"}
                  {"                "}
                  <label>
                    <input type="checkbox" />
                    <span>{"パスワードや認証コードを dot のチャットに貼らない"}</span>
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
                    <span>{"機微な情報は教えない"}</span>
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
                    <span>{"外部に出る成果物は、必ず自分で確認する"}</span>
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
                    <span>{"Pause・Activity・Scheduled の場所を覚えた"}</span>
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
                    <span>{"週に1回、振り返りをしてルールを見直す"}</span>
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
                    <span>{"不審な動きを見たら、すぐ Pause する"}</span>
                  </label>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h1 id="part-5-深める">{"Part 5: 深める"}</h1>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="13-国際的な開発者専門家の知見">{"13. 国際的な開発者・専門家の知見"}</h2>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"発表後の公開情報から、"}
                <strong>{"著名な国際的開発者・研究者・メディアの発言"}</strong>
                {
                  "を整理します。ここでは、**事実(何が書かれているか)**と、**本ガイドの解釈(実践への落とし込み)**を分けて書きます。"
                }
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <h3 id="131-simon-willisondjango-共同作者datasettellm-cli-の作者">
                {"\n"}
                {"              "}
                {"13.1 Simon Willison(Django 共同作者、Datasette・LLM CLI の作者)"}
                {"\n"}
                {"            "}
              </h3>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                <strong>{"ライブブログ(2026-09-29)"}</strong>
                {": DevDay の基調講演を現地から実況し、dots"}
                {"\n"}
                {"              "}
                {"の挙動を観察しています。"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"観察された事実"}</th>
                      <th>{"本ガイドの解釈"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"dots は「Muse に非常によく似た」UI。OpenAI の社員は、Slack で dot"}
                        {"\n"}
                        {"                      "}
                        {"に直接仕事を委任している"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"「チャットで話す相手」ではなく「Slack にいる同僚」のように使う設計思想"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"ライブデモで、dot"}
                        {"\n"}
                        {"                      "}
                        {
                          "が反応しない「遅い朝」の場面があった。作成リンクがモバイルでは動かず、デスクトップを求められた"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <strong>{"初期は不安定な場面がある"}</strong>
                        {"前提で、最初の1週間は重要業務に使わない"}
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"OpenAI の Thibault Sottiaux 氏は、dots は Codex"}
                        {"\n"}
                        {"                      "}
                        {"ハーネスの信頼性と長時間タスク対応から生まれたと話した"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"dots"}
                        {"\n"}
                        {"                      "}
                        {"は"}
                        <strong>{"コーディングエージェントの延長にある"}</strong>
                        {"(長い作業に強い一方、権限設計が重要)"}
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"質疑で、「dot は ChatGPT"}
                        {"\n"}
                        {"                      "}
                        {
                          "で共有した情報に既定ではすべてアクセスするわけではない」「任せる責任と目標は、自分が納得できる範囲で与えられる」という趣旨の回答があった"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        <strong>{"権限は段階的に広げる"}</strong>
                        {"のが公式の想定"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"同氏は、トークン量より**「ドル当たりの成果(outcome per"}
                        {"\n"}
                        {"                      "}
                        {"dollar)」**を重視していると述べた"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"使用量ではなく、"}
                        <strong>{"成果で評価"}</strong>
                        {"する"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                <strong>
                  {"投稿「We're going to need default hard budget caps on pretty much"}
                  {"\n"}
                  {"                "}
                  {"everything」(2026-10-03)"}
                </strong>
                {":"}
                {"\n"}
                {"              "}
                {
                  "コーディングエージェントや個人エージェントは、お金のかかるコードやサービスを簡単に立ち上げられる。だから、"
                }
                <strong>{"「X ドルを超えたら止める」ハードな上限が既定である必要がある"}</strong>
                {"(警告メールだけのソフトな上限では足りない)と主張しています。"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <ul>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"本ガイドの解釈: dots 自体の使用量は当面プランに含まれるが、"}
                  <strong>{"dot に任せて外部の従量課金サービス・API・クラウドを動かす"}</strong>
                  {"場合は、"}
                  <strong>{"そちら側にハードな予算上限を設定してから"}</strong>
                  {"任せるのが安全です。△"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"            "}
              <h3 id="132-ethan-mollickwharton-教授one-useful-thing">
                {"\n"}
                {"              "}
                {"13.2 Ethan Mollick(Wharton 教授、One Useful Thing)"}
                {"\n"}
                {"            "}
              </h3>
              {"\n"}
              {"            "}
              <p>
                <strong>{"記事「The Dot and the Swarm」(2026-10-01)"}</strong> {"の要点:"}
              </p>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"事実(記事の趣旨)"}</th>
                      <th>{"本ガイドの解釈"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"「Bitter Lesson」:"}
                        {"\n"}
                        {"                      "}
                        {
                          "人間が手順を細かく設計する必要があると思っていたことが、より強いモデルで解決されてきた。プロンプトも同様で、手順を1つずつ導く価値は新しいモデルでは小さい"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"ブリーフは"}
                        <strong>{"手順ではなく、ゴール・制約・完了条件"}</strong>
                        {"で書く(Step 4)"}
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "常時稼働の個人エージェントは、「何を伝えなくて済むか」が重要。文脈をメッセージから学び、計画を自分で立てる"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"最初の自己紹介・聞き取りで、"}
                        <strong>{"文脈を貯めさせる"}</strong>
                        {"(Step 4-3)"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"自身のエージェントが、"}
                        <strong>{"自分のミス"}</strong>
                        {"(許可申請メールのプロジェクト番号の誤り)を見つけた"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"dot"}
                        {"\n"}
                        {"                      "}
                        {"は「自分のミスを見つけてくれる」利点がある一方、"}
                        <strong>{"直す前に確認"}</strong>
                        {"させる"}
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "ただし、エージェントが自己組織化して想定外の方向へ進むリスクも指摘(Hugging"
                        }
                        {"\n"}
                        {"                      "}
                        {"Face の事案への言及)"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"承認・外部連絡・機微情報・未承認の行為は人が握る"}</td>
                    </tr>
                    <tr>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"別記事「Agency and"}
                        {"\n"}
                        {"                      "}
                        {"Agents」で、エージェントが人に助けを求めるべき場面として、"}
                        <strong>
                          {"費用の支出・部外者への連絡・機微情報へのアクセス・未承認の行為"}
                        </strong>
                        {"などの承認が必要な場面を挙げている"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"Step 3 の Custom Rules の根拠と一致"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                <strong>{"X への投稿(2026-10-15)"}</strong>
                {": 自分の Dot"}
                {"\n"}
                {"              "}
                {"に"}
                <strong>{"専用のメールアドレス"}</strong>
                {"を持たせたところ「驚くほど簡単」で、次の理由で相性が良かったと述べています。"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <ul>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  <p>{"自分のメールで dot に下書き・送信をさせたくない"}</p>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  <p>
                    {"相手に"}
                    <strong>{"AI とやりとりしていることが分かる"}</strong>
                    {"ようにしたい"}
                  </p>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  <p>
                    {"\n"}
                    {"                  "}
                    {
                      "連絡は、カスタマーサービスや、自分が知らない情報の確認などに限り、個人的な知人には送らせない"
                    }
                    {"\n"}
                    {"                "}
                  </p>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  <p>
                    {"\n"}
                    {"                  "}
                    {"本ガイドの解釈: **「自分の代理で送る」より「AI"}
                    {"\n"}
                    {"                  "}
                    {
                      "として名乗って連絡する」**運用は、誤解や責任の所在の面で安全です。ただし、ローンチ時点のヘルプでは専用メールは未対応と記載されていたので、"
                    }
                    <strong>{"現在の対応状況は最新のヘルプで確認"}</strong>
                    {"してください。△"}
                    {"\n"}
                    {"                "}
                  </p>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"            "}
              <h3 id="133-everydan-shipper-氏のチームの-vibe-check">
                {"\n"}
                {"              "}
                {"13.3 Every(Dan Shipper 氏のチーム)の Vibe Check"}
                {"\n"}
                {"            "}
              </h3>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {
                  "Every のチームは、発表前から数日間 dots を実際に使い、「Vibe Check」を公開しています。"
                }
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"事実(要約)"}</th>
                      <th>{"本ガイドの解釈"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"うまく動くときは、ChatGPT の使い方が変わる。dot が ChatGPT"}
                        {"\n"}
                        {"                      "}
                        {"のスレッドを束ね、メール・Slack を使う"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"「"}
                        <strong>{"窓口が1つ"}</strong>
                        {"で、裏で他のツールを動かす」使い方が本来の強み"}
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"テストしたバージョンは"}
                        <strong>
                          {
                            "バグが多く、権限の問題やメッセージの取りこぼし、アプリ内ブラウザへの接続失敗"
                          }
                        </strong>
                        {"があり、推奨は1〜2週間待ってから、との判断"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <strong>{"初期の不安定さは前提"}</strong>
                        {"。重要業務の依存は、安定を確認してから"}
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <h3 id="134-dan-mcateer早期テスター開発者">
                {"13.4 Dan McAteer(早期テスター、開発者)"}
              </h3>
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"OpenAI"}
                {"\n"}
                {"              "}
                {"が紹介した早期テスターの事例として、"}
                <strong>{"フリーランスの執筆の請求書"}</strong>
                {"を、dot"}
                {"\n"}
                {"              "}
                {"が背景でメールのスレッドから詳細を拾い、下書きを作り、"}
                <strong>{"承認後に PDF で送信"}</strong>
                {"した例があります。○(The Next Web 経由で AI Wiki が紹介)"}
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"            "}
              <ul>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"本ガイドの解釈:"}
                  {"\n"}
                  {"                "}
                  {"「"}
                  <strong>{"下書きまでは自動、送信は承認後"}</strong>
                  {"」という流れが、最も公式の想定に近い成功パターンです。"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"            "}
              <h3 id="135-知見の共通点">{"13.5 知見の共通点"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["diagram-card"]}>
                {"\n"}
                {"              "}
                <div className={styles["diagram-wrap"]}>
                  {"\n"}
                  {"                "}
                  <div className={styles["diagram-canvas"]} data-diagram-id="11">
                    <MermaidDiagram chart={DIAGRAM_11} theme="base" themeVariables={THEME} />
                  </div>
                  {"\n"}
                  {"              "}
                </div>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="14-補足-その他のベストプラクティスと根拠ソース">
                {"\n"}
                {"              "}
                {"14. 補足: その他のベストプラクティスと根拠ソース"}
                {"\n"}
                {"            "}
              </h2>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"#"}</th>
                      <th>{"ベストプラクティス"}</th>
                      <th>{"根拠(要約)"}</th>
                      <th>{"ソース"}</th>
                      <th>{"確度"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"1"}</td>
                      <td>
                        {"孤立したプロンプトではなく、継続してほしい"}
                        <strong>{"ジョブ"}</strong>
                        {"を渡す"}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"OpenAI"}
                        {"\n"}
                        {"                      "}
                        {
                          "のガイダンスが「見ておいてほしいこと」から始めるよう勧めていると報じられている。ヘルプセンターも「目標を渡し、自分でやってよい範囲を決める」と説明"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://www.forbes.com/sites/ronschmelzer/2026/10/05/what-are-openai-dots-and-do-you-need-them/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://www.forbes.com/sites/ronschmelzer/2026/10/05/what-are-openai-dots-and-do-you-need-them/"
                          }
                        </a>
                        {"\n"}
                        {"                      "}
                        <br />
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://help.openai.com/articles/20001530"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://help.openai.com/articles/20001530"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎/○"}</td>
                    </tr>
                    <tr>
                      <td>{"2"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <strong>{"接続の前か接続と同時に"}</strong> {"Custom Rules"}
                        {"\n"}
                        {"                      "}
                        {"を決める。外部に出るものは「確認」か「引き渡し」"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"公式 FAQ が Custom Rules"}
                        {"\n"}
                        {"                      "}
                        {"を境界設定の手段として説明。ルールに従っても間違えることがあると明記"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://help.openai.com/en/articles/20001529-dots-privacy-security-and-safety-faqs"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://help.openai.com/en/articles/20001529-dots-privacy-security-and-safety-faqs"
                          }
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"3"}</td>
                      <td>{"「下書き」と「送信」を分けて依頼する"}</td>
                      <td>{"OpenAI の説明では、返信の下書きを頼んでも送信の許可にはならない"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://help.openai.com/en/articles/20001529-dots-privacy-security-and-safety-faqs"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://help.openai.com/en/articles/20001529-dots-privacy-security-and-safety-faqs"
                          }
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"4"}</td>
                      <td>{"行為を「やり直せるか」「他人に届くか」の2軸で分類する"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "実践者の整理。公式の行動ルールの分類(読む・共有・購入・削除・引き渡し)と整合"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://gptdot.net/getting-started/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://gptdot.net/getting-started/"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"△"}</td>
                    </tr>
                    <tr>
                      <td>{"5"}</td>
                      <td>{"最初の1週間は既定のルールで、1つずつ承認して挙動を観察する"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "既定では重要な行為の前に確認が入るため、基準の挙動を見てから調整するのが合理的"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://www.aiagentslibrary.com/blog/how-to-use-openai-dots/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://www.aiagentslibrary.com/blog/how-to-use-openai-dots/"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"△"}</td>
                    </tr>
                    <tr>
                      <td>{"6"}</td>
                      <td>{"自分の PC への接続は必要時のみ"}</td>
                      <td>{"公式ヘルプ: ローカルアクセスは任意で、既定はオフ。取り消しも可能"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://help.openai.com/en/articles/20001530-getting-started-with-your-dot"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://help.openai.com/en/articles/20001530-getting-started-with-your-dot"
                          }
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"7"}</td>
                      <td>
                        {"パスワードをチャットに貼らない。サインインは dot のブラウザで本人が行う"}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"安全性投稿・FAQ:"}
                        {"\n"}
                        {"                      "}
                        {
                          "専用のセキュアサインインの流れはモデルに認証情報を見せない設計。貼り付けた値は見える可能性"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://openai.com/index/how-we-build-safety-security-and-privacy-into-dots/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://openai.com/index/how-we-build-safety-security-and-privacy-into-dots/"
                          }
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎/○"}</td>
                    </tr>
                    <tr>
                      <td>{"8"}</td>
                      <td>{"機微情報は教えない。消すなら Delete"}</td>
                      <td>{"個別メモリは編集・削除できず、接続解除では取得済み情報が消えない"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://help.openai.com/articles/20001530"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://help.openai.com/articles/20001530"}
                        </a>
                        {"\n"}
                        {"                      "}
                        <br />
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://help.openai.com/en/articles/20001529-dots-privacy-security-and-safety-faqs"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://help.openai.com/en/articles/20001529-dots-privacy-security-and-safety-faqs"
                          }
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"9"}</td>
                      <td>
                        {"外部の従量課金サービスには"}
                        <strong>{"ハードな予算上限"}</strong>
                        {"を先に設定"}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "エージェントは費用の発生するコードやサービスを簡単に立ち上げる。ソフトな警告では不十分"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://simonwillison.net/2026/Oct/3/default-hard-budget-caps/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://simonwillison.net/2026/Oct/3/default-hard-budget-caps/"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎(主張は筆者の意見)"}</td>
                    </tr>
                    <tr>
                      <td>{"10"}</td>
                      <td>{"ブリーフは手順ではなく、ゴール・制約・完了条件で書く"}</td>
                      <td>
                        {"新しいモデルでは手順を細かく導くプロンプトの価値が小さい(Bitter Lesson)"}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://www.oneusefulthing.org/p/the-dot-and-the-swarm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://www.oneusefulthing.org/p/the-dot-and-the-swarm"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎(解釈は本ガイド)"}</td>
                    </tr>
                    <tr>
                      <td>{"11"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "エージェントに「いつ人に聞くか」を設計する(費用・外部連絡・機微情報・未承認の行為)"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"エージェントが人に助けを求めるべき場面の整理"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://www.oneusefulthing.org/p/agency-and-agents"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://www.oneusefulthing.org/p/agency-and-agents"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎"}</td>
                    </tr>
                    <tr>
                      <td>{"12"}</td>
                      <td>
                        {"AI として名乗って連絡させる(専用アドレス等)。ただし最新の対応状況を確認"}
                      </td>
                      <td>
                        {"個人のメールでの代理送信を避け、相手に AI だと分かるようにする運用例"}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://x.com/emollick/status/2110557530531447165"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://x.com/emollick/status/2110557530531447165"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎(個人の経験談)"}</td>
                    </tr>
                    <tr>
                      <td>{"13"}</td>
                      <td>{"初期は不安定な前提。重要業務の依存は1〜2週間様子を見る"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "早期の実機レビューで、権限の問題やメッセージの取りこぼし、ブラウザ接続失敗が報告された"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://every.to/live/openai-devday-2026"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://every.to/live/openai-devday-2026"}
                        </a>
                        {"\n"}
                        {"                      "}
                        <br />
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://every.to/vibe-check/vibe-check-dots-always-on-agents-in-chatgpt"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://every.to/vibe-check/vibe-check-dots-always-on-agents-in-chatgpt"
                          }
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"◎(検証は各自で)"}</td>
                    </tr>
                    <tr>
                      <td>{"14"}</td>
                      <td>{"長い連続作業ほど Pause と確認を人が握る"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"System Card"}
                        {"\n"}
                        {"                      "}
                        {
                          "の付録で、連続タスクの増加により範囲逸脱フラグが上昇、警告後の不要な継続も観測"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://deploymentsafety.openai.com/gpt-6-astra/change-log"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://deploymentsafety.openai.com/gpt-6-astra/change-log"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"○"}</td>
                    </tr>
                    <tr>
                      <td>{"15"}</td>
                      <td>{"「完了」表示を成果物の到達の証拠としない"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "公式ドキュメントの内容として、完了した実行は、成果物が正しく作成・配信された証拠にはならないとされる"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://learn.chatgpt.com/docs/dots/tasks-and-memory"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://learn.chatgpt.com/docs/dots/tasks-and-memory"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"○"}</td>
                    </tr>
                    <tr>
                      <td>{"16"}</td>
                      <td>{"通知は「判断が必要なときだけ」"}</td>
                      <td>{"水増しをせず、重要なときだけ個別連絡する運用例"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://www.aiagentslibrary.com/blog/openai-dots-prompts/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://www.aiagentslibrary.com/blog/openai-dots-prompts/"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"△"}</td>
                    </tr>
                    <tr>
                      <td>{"17"}</td>
                      <td>{"組織で使うなら、管理者設定とガバナンスを確認"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"Enterprise は管理者が dot・Slack・ローカル PC・Custom Rules"}
                        {"\n"}
                        {"                      "}
                        {"を個別に制御。スペシャリスト dot は Microsoft Agent 365 との統合を進行中"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://learn.chatgpt.com/docs/enterprise/dots-admin-guide"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://learn.chatgpt.com/docs/enterprise/dots-admin-guide"}
                        </a>
                        {"\n"}
                        {"                      "}
                        <br />
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://thenewstack.io/openai-dots-gpt6-agents/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://thenewstack.io/openai-dots-gpt6-agents/"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"○"}</td>
                    </tr>
                    <tr>
                      <td>{"18"}</td>
                      <td>{"日本語の実利用レビューも参考にする"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"日本のメディアが、dots"}
                        {"\n"}
                        {"                      "}
                        {
                          "を使った体験レビューを公開している(スマホでの便利さ、指示しなくても必要時に動く点)"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://www.businessinsider.jp/article/2610-openai-dots-ai-agent-review/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://www.businessinsider.jp/article/2610-openai-dots-ai-agent-review/"
                          }
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>{"△"}</td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <aside className={styles.callout} data-variant="info">
                {"\n"}
                {"              "}
                <p>
                  {"\n"}
                  {"                "}
                  {"凡例: ◎=一次資料を直接確認 / ○=二次資料経由 / △=実践者の工夫。URL の"}
                  {"\n"}
                  {"                "}
                  <code>{"learn.chatgpt.com"}</code> {"は、二次資料(AI"}
                  {"\n"}
                  {"                "}
                  {
                    "Wiki)に記載された参照先で、今回は直接取得できていません。最新の内容は各自でご確認ください。"
                  }
                  {"\n"}
                  {"              "}
                </p>
                {"\n"}
                {"            "}
              </aside>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="15-参考url一覧">{"15. 参考URL一覧"}</h2>
              {"\n"}
              {"            "}
              <h3 id="151-openai-公式一次資料">{"15.1 OpenAI 公式(一次資料)"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"資料"}</th>
                      <th>{"URL"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"Introducing dots(日本語版・ご指定の起点)"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://openai.com/ja-JP/index/introducing-dots/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://openai.com/ja-JP/index/introducing-dots/"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Introducing dots(英語版)"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://openai.com/index/introducing-dots/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://openai.com/index/introducing-dots/"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"How we build safety, security, and privacy into dots"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://openai.com/index/how-we-build-safety-security-and-privacy-into-dots/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://openai.com/index/how-we-build-safety-security-and-privacy-into-dots/"
                          }
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Getting started with your dot(ヘルプセンター)"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://help.openai.com/articles/20001530"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://help.openai.com/articles/20001530"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Dots privacy, security, and safety FAQs"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://help.openai.com/en/articles/20001529-dots-privacy-security-and-safety-faqs"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://help.openai.com/en/articles/20001529-dots-privacy-security-and-safety-faqs"
                          }
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"DevDay 2026 Recap"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://openai.com/index/devday-2026-recap/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://openai.com/index/devday-2026-recap/"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"発表ポスト(X)"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://x.com/OpenAI/status/2104984504133918973"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://x.com/OpenAI/status/2104984504133918973"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"GPT-6 Astra System Card(dots の評価付録)"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://deploymentsafety.openai.com/gpt-6-astra#sec:appendix-sol-luna"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://deploymentsafety.openai.com/gpt-6-astra#sec:appendix-sol-luna"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"Auto-review of agent actions without synchronous human oversight(OpenAI"}
                        {"\n"}
                        {"                      "}
                        {"Alignment)"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://alignment.openai.com/auto-review/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://alignment.openai.com/auto-review/"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <h3 id="152-国際的な開発者専門家">{"15.2 国際的な開発者・専門家"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"発信者"}</th>
                      <th>{"資料"}</th>
                      <th>{"URL"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"Simon Willison"}</td>
                      <td>{"OpenAI DevDay 2026 live blog"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://simonwillison.net/2026/Sep/29/openai-devday-2026-live-blog/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://simonwillison.net/2026/Sep/29/openai-devday-2026-live-blog/"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Simon Willison"}</td>
                      <td>
                        {"We're going to need default hard budget caps on pretty much everything"}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://simonwillison.net/2026/Oct/3/default-hard-budget-caps/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://simonwillison.net/2026/Oct/3/default-hard-budget-caps/"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Ethan Mollick"}</td>
                      <td>{"The Dot and the Swarm"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://www.oneusefulthing.org/p/the-dot-and-the-swarm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://www.oneusefulthing.org/p/the-dot-and-the-swarm"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Ethan Mollick"}</td>
                      <td>{"Agency and Agents"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://www.oneusefulthing.org/p/agency-and-agents"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://www.oneusefulthing.org/p/agency-and-agents"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Ethan Mollick"}</td>
                      <td>{"X: Dot に専用メールアドレスを持たせた経験(2026-10-15)"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://x.com/emollick/status/2110557530531447165"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://x.com/emollick/status/2110557530531447165"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Every(Dan Shipper 氏のチーム)"}</td>
                      <td>{"Vibe Check: dots(実機検証)"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://every.to/vibe-check/vibe-check-dots-always-on-agents-in-chatgpt"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://every.to/vibe-check/vibe-check-dots-always-on-agents-in-chatgpt"
                          }
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Every"}</td>
                      <td>{"DevDay 2026 ライブ更新"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://every.to/live/openai-devday-2026"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://every.to/live/openai-devday-2026"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <h3 id="153-報道解説">{"15.3 報道・解説"}</h3>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"媒体"}</th>
                      <th>{"URL"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"The New Stack: OpenAI just launched Dots. Here's why they matter for"}
                        {"\n"}
                        {"                      "}
                        {"developers"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://thenewstack.io/openai-dots-gpt6-agents/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://thenewstack.io/openai-dots-gpt6-agents/"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"TechCrunch: OpenAI launches Dots, its bubbly agentic avatar"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://techcrunch.com/2026/09/29/openai-launches-dots-its-bubbly-agentic-avatar/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://techcrunch.com/2026/09/29/openai-launches-dots-its-bubbly-agentic-avatar/"
                          }
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "VentureBeat: OpenAI launches Dots, always-on AI agent coworkers, and ChatGPT"
                        }
                        {"\n"}
                        {"                      "}
                        {"Space"}
                        {"\n"}
                        {"                    "}
                      </td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://venturebeat.com/technology/openai-launches-dots-always-on-ai-agent-coworkers-and-chatgpt-space-where-they-can-collaborate-with-human-teams"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://venturebeat.com/technology/openai-launches-dots-always-on-ai-agent-coworkers-and-chatgpt-space-where-they-can-collaborate-with-human-teams"
                          }
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Al Jazeera: OpenAI launches 'dots'"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://www.aljazeera.com/economy/2026/9/30/openai-launches-dots-personal-ai-assistant-built-to-handle-everything"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://www.aljazeera.com/economy/2026/9/30/openai-launches-dots-personal-ai-assistant-built-to-handle-everything"
                          }
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Forbes: What Are OpenAI Dots And Do You Need Them?"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://www.forbes.com/sites/ronschmelzer/2026/10/05/what-are-openai-dots-and-do-you-need-them/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://www.forbes.com/sites/ronschmelzer/2026/10/05/what-are-openai-dots-and-do-you-need-them/"
                          }
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Business Insider Japan(日本語レビュー)"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://www.businessinsider.jp/article/2610-openai-dots-ai-agent-review/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            "https://www.businessinsider.jp/article/2610-openai-dots-ai-agent-review/"
                          }
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"BGR: Everything OpenAI Announced At DevDay 2026"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://www.bgr.com/2272332/openai-devday-2026-announcements/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://www.bgr.com/2272332/openai-devday-2026-announcements/"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"AI Wiki: Dots (OpenAI)(一次資料へのリンク集として有用)"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://aiwiki.ai/wiki/openai_dots"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://aiwiki.ai/wiki/openai_dots"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <h3 id="154-実践ガイド実践者コミュニティ公式の保証ではありません">
                {"\n"}
                {"              "}
                {"15.4 実践ガイド(実践者・コミュニティ。公式の保証ではありません)"}
                {"\n"}
                {"            "}
              </h3>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"資料"}</th>
                      <th>{"URL"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"gptdot.net: How to use ChatGPT Dots in 4 steps"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://gptdot.net/getting-started/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://gptdot.net/getting-started/"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"AI Agents Library: How to Use OpenAI Dots"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://www.aiagentslibrary.com/blog/how-to-use-openai-dots/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://www.aiagentslibrary.com/blog/how-to-use-openai-dots/"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"AI Agents Library: Dots プロンプト集"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://www.aiagentslibrary.com/blog/openai-dots-prompts/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://www.aiagentslibrary.com/blog/openai-dots-prompts/"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"tosheo.ai: OpenAI dots チュートリアル"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        <a
                          href="https://www.tosheo.ai/ai-tools/openai-dots"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"https://www.tosheo.ai/ai-tools/openai-dots"}
                        </a>
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="16-用語集">{"16. 用語集"}</h2>
              {"\n"}
              {"            "}
              <div className={styles["table-wrap"]}>
                {"\n"}
                {"              "}
                <table>
                  <thead>
                    <tr>
                      <th>{"用語"}</th>
                      <th>{"説明"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"常時稼働エージェント"}</td>
                      <td>{"会話が終わっても、背景で仕事を続けられるエージェント"}</td>
                    </tr>
                    <tr>
                      <td>{"GPT-6 Astra"}</td>
                      <td>{"dots を動かす OpenAI のフラッグシップモデル"}</td>
                    </tr>
                    <tr>
                      <td>{"スペシャリスト dot"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {
                          "組織が独自の ID・資格情報・権限を与えて、特定業務を担当させる dot(試験段階)"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"ChatGPT Space"}</td>
                      <td>
                        {"社員・ChatGPT・Codex・dots が共有の文脈で共同作業する場(DevDay で発表)"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Microsoft Agent 365"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"Microsoft のエージェント向けの管理・セキュリティ基盤。スペシャリスト dot"}
                        {"\n"}
                        {"                      "}
                        {"との統合を進行中"}
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"プロンプトインジェクション"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"Web"}
                        {"\n"}
                        {"                      "}
                        {
                          "ページやメールなどに仕込まれた悪意ある指示で、エージェントを誤動作させる攻撃"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Pause / Delete"}</td>
                      <td>
                        {"\n"}
                        {"                      "}
                        {"一時停止 / dot"}
                        {"\n"}
                        {"                      "}
                        {
                          "の削除(コンテキスト・メモリ・定期タスクを消し、メインの会話はアーカイブする)"
                        }
                        {"\n"}
                        {"                    "}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"          "}
            <section className={styles.section}>
              {"\n"}
              {"            "}
              <h2 id="17-更新時の注意">{"17. 更新時の注意"}</h2>
              {"\n"}
              {"            "}
              <ul>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"dots"}
                  {"\n"}
                  {"                "}
                  {"は"}
                  <strong>{"段階的な展開中"}</strong>
                  {"で、機能・プラン・地域・料金が頻繁に変わります。"}
                  <strong>{"特に次の項目は、使う前に最新情報を確認"}</strong>
                  {"してください。"}
                  {"\n"}
                  {"                "}
                  <ol>
                    {"\n"}
                    {"                  "}
                    <li>{"最初の1か月の使用量の扱い(10月末に切り替わる可能性)"}</li>
                    {"\n"}
                    {"                  "}
                    <li>{"Pro の対象ティア(100 / 200 / 500)"}</li>
                    {"\n"}
                    {"                  "}
                    <li>{"モバイルからの dot の作成"}</li>
                    {"\n"}
                    {"                  "}
                    <li>{"dot 専用メールアドレスの対応状況"}</li>
                    {"\n"}
                    {"                  "}
                    <li>{"Teams・テキストメッセージの提供範囲"}</li>
                    {"\n"}
                    {"                "}
                  </ol>
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"本ガイドの数値・仕様は "}
                  <strong>{"2026年10月24日時点"}</strong>
                  {"の公開情報に基づきます。"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"              "}
                <li>
                  {"\n"}
                  {"                "}
                  {"医療・法務・金融など、"}
                  <strong>{"重大な判断を伴う業務"}</strong>
                  {"では、dot"}
                  {"\n"}
                  {"                "}
                  {"の出力を必ず専門家や自分で確認してください。OpenAI"}
                  {"\n"}
                  {"                "}
                  {"も、重要な成果物は確認するよう案内しています。◎"}
                  {"\n"}
                  {"              "}
                </li>
                {"\n"}
                {"            "}
              </ul>
              {"\n"}
              {"          "}
            </section>
            {"\n"}
            {"        "}
          </main>
          {"\n"}
          {"        "}
          <footer className={styles.footer}>
            {"\n"}
            {"          "}
            {"本ガイドは 2026年10月24日時点の公開情報に基づきます。dots"}
            {"\n"}
            {"          "}
            {"は段階的な展開中のため、最新の仕様は必ず OpenAI のヘルプセンターで確認してください。"}
            {"\n"}
            {"        "}
          </footer>
          {"\n"}
          {"      "}
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
