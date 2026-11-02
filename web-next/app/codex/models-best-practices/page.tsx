import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import { findBySlug } from "@/lib/page-registry";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";
export const metadata: Metadata = {
  title: "OpenAI 最新モデル ベストプラクティス完全ガイド",
  description:
    "OpenAI のモデル選択、Responses API、reasoning effort、ツールとコスト最適化の実践ガイド。情報基準日2026-10-23。",
};
const DIAGRAM_0 = `flowchart TB
  A["2026-04-23<br/>GPT-5.5"] --> B["2026-08<br/>GPT-5.6<br/>Sol / Terra / Luna"]
  B --> C["2026-09-03<br/>GPT-6 Astra"]
  C --> D["2026-09-22<br/>GPT-6 Sol / Luna"]
  D --> E["2026-09-29<br/>GPT-6.1 Sol<br/>DevDay"]
  E --> F["2026-10-08<br/>6.1 Sol Ultrafast"]
  F --> G["2026-10-15<br/>GPT-Live-1.1"]`;
const DIAGRAM_1 = `flowchart TD
  S["タスクを定義する"] --> Q1{"音声・リアルタイム対話か"}
  Q1 -- はい --> L["GPT-Live 系を検討"]
  Q1 -- いいえ --> Q2{"画像の生成・編集か"}
  Q2 -- はい --> I["GPT Image 2.5 系を検討"]
  Q2 -- いいえ --> Q3{"高ボリュームの定型処理で<br/>コスト最優先か"}
  Q3 -- はい --> LU["gpt-6-luna"]
  Q3 -- いいえ --> Q4{"6.1 Solで品質が足りない<br/>最難関タスクか"}
  Q4 -- はい --> AS["gpt-6-astra"]
  Q4 -- いいえ --> SO["gpt-6.1-sol を既定にする"]`;
const DIAGRAM_2 = `flowchart TD
  A["会話を続けたい"] --> B{"状態をどこに持つか"}
  B -- "OpenAI側に持つ" --> C["previous_response_id を渡す"]
  B -- "自前で管理する" --> D["入力と全出力アイテムを再送する"]
  D --> E{"store:false または<br/>Zero Data Retention か"}
  E -- はい --> F["暗号化された推論アイテムも<br/>そのまま再送する"]
  E -- いいえ --> G["通常の再送で可"]`;
const DIAGRAM_3 = `flowchart TD
  A["現行のエフォートを基準にする"] --> B["代表タスクで評価する"]
  B --> C{"品質は十分か"}
  C -- はい --> D["1段下げて再評価する"]
  D --> C
  C -- いいえ --> E["1段上げて再評価する"]
  E --> F{"改善幅がコストに見合うか"}
  F -- はい --> G["採用する"]
  F -- いいえ --> H["プロンプトとツール設計を見直す"]
  H --> B`;
const DIAGRAM_4 = `sequenceDiagram
  participant App as アプリ
  participant M as モデル
  participant T as 外部ツール
  App->>M: リクエスト送信
  M-->>App: 非同期ツール呼び出し(call_id)
  App->>T: 実行開始
  M->>M: 独立した部分の推論を継続
  T-->>App: 結果
  App->>M: 元のcall_idで結果を返す
  M-->>App: 最終回答`;
const DIAGRAM_5 = `flowchart TD
  C["コスト最適化"] --> A["モデル選択<br/>Luna / 6.1 Sol / Astra"]
  C --> B["エフォート調整<br/>出力トークンを抑える"]
  C --> D["プロンプトキャッシュ<br/>先頭を固定する"]
  C --> E["処理ティア<br/>Batch / Flex / Fast / Ultrafast"]
  A --> F["代表タスクで1タスクあたりの総コストを測る"]
  B --> F
  D --> F
  E --> F`;
const DIAGRAM_6 = `flowchart TD
  S["現行モデルを確認"] --> A["モデルIDを置換"]
  A --> B["ツール利用はResponses APIへ"]
  B --> C["エフォートを変換して比較"]
  C --> D["非対応パラメータを削除"]
  D --> E["キャッシュ設定を見直し"]
  E --> F["プロンプトとAGENTS.mdを棚卸し"]
  F --> G["評価セットで回帰テスト"]
  G --> H{"品質・コスト・遅延は許容内か"}
  H -- はい --> I["カナリア公開"]
  H -- いいえ --> C`;
const DIAGRAM_7 = `flowchart TB
  A["代表タスク集を作る"] --> B["ベースライン測定"]
  B --> C["変更を1つだけ加える"]
  C --> D["再測定"]
  D --> E{"成功率・コスト・遅延が改善か"}
  E -- はい --> F["採用して記録"]
  E -- いいえ --> G["差し戻す"]
  F --> C
  G --> C`;
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
  const entry = findBySlug("/codex/models-best-practices");
  if (!entry) throw new Error("OpenAI guide is missing from the page registry");
  return (
    <div
      id="openai-guide"
      className={[styles.root, styles.layout].join(" ")}
      data-testid="layout-root"
      data-page="openai-models"
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
        id="openai-backdrop"
        className={styles.overlay}
        aria-label="目次を閉じる"
        tabIndex={-1}
      />
      {"\n"}
      {"    "}
      <nav
        className={[styles.sidebar].join(" ")}
        id="openai-sidebar"
        aria-label="目次"
        data-testid="sidebar-nav"
      >
        {"\n"}
        {"      "}
        <p className={[styles.brand].join(" ")}>
          {"OpenAI 最新モデル"}
          <br />
          {"ベストプラクティス"}
        </p>
        {"\n"}
        {"      "}
        <p className={[styles["brand-sub"]].join(" ")}>{"中級〜上級者向け / 2026-10-23時点"}</p>
        {"\n"}
        {"      "}
        <a
          className={[styles["nav-a"], styles.active].join(" ")}
          href="#sec-0"
          data-testid="sidebar-nav-link"
          aria-current="location"
        >
          <span className={[styles["nav-k"]].join(" ")}>{"PART 0"}</span>
          <span className={[styles["nav-t"]].join(" ")}>{"このガイドの読み方と前提"}</span>
        </a>
        <a className={[styles["nav-a"]].join(" ")} href="#sec-1" data-testid="sidebar-nav-link">
          <span className={[styles["nav-k"]].join(" ")}>{"PART 1"}</span>
          <span className={[styles["nav-t"]].join(" ")}>{"全体像: 2026年のOpenAIモデル地図"}</span>
        </a>
        <a className={[styles["nav-a"]].join(" ")} href="#sec-2" data-testid="sidebar-nav-link">
          <span className={[styles["nav-k"]].join(" ")}>{"STEP 1"}</span>
          <span className={[styles["nav-t"]].join(" ")}>{"モデルを選ぶ"}</span>
        </a>
        <a className={[styles["nav-a"]].join(" ")} href="#sec-3" data-testid="sidebar-nav-link">
          <span className={[styles["nav-k"]].join(" ")}>{"STEP 2"}</span>
          <span className={[styles["nav-t"]].join(" ")}>{"Responses APIで最小構成を作る"}</span>
        </a>
        <a className={[styles["nav-a"]].join(" ")} href="#sec-4" data-testid="sidebar-nav-link">
          <span className={[styles["nav-k"]].join(" ")}>{"STEP 3"}</span>
          <span className={[styles["nav-t"]].join(" ")}>{"reasoning effortを設計する"}</span>
        </a>
        <a className={[styles["nav-a"]].join(" ")} href="#sec-5" data-testid="sidebar-nav-link">
          <span className={[styles["nav-k"]].join(" ")}>{"STEP 4"}</span>
          <span className={[styles["nav-t"]].join(" ")}>
            {"プロンプトを「薄く」「境界を明確に」する"}
          </span>
        </a>
        <a className={[styles["nav-a"]].join(" ")} href="#sec-6" data-testid="sidebar-nav-link">
          <span className={[styles["nav-k"]].join(" ")}>{"STEP 5"}</span>
          <span className={[styles["nav-t"]].join(" ")}>
            {"ツール・エージェント機能を使いこなす"}
          </span>
        </a>
        <a className={[styles["nav-a"]].join(" ")} href="#sec-7" data-testid="sidebar-nav-link">
          <span className={[styles["nav-k"]].join(" ")}>{"STEP 6"}</span>
          <span className={[styles["nav-t"]].join(" ")}>{"コストと速度を最適化する"}</span>
        </a>
        <a className={[styles["nav-a"]].join(" ")} href="#sec-8" data-testid="sidebar-nav-link">
          <span className={[styles["nav-k"]].join(" ")}>{"STEP 7"}</span>
          <span className={[styles["nav-t"]].join(" ")}>{"移行チェックリスト"}</span>
        </a>
        <a className={[styles["nav-a"]].join(" ")} href="#sec-9" data-testid="sidebar-nav-link">
          <span className={[styles["nav-k"]].join(" ")}>{"STEP 8"}</span>
          <span className={[styles["nav-t"]].join(" ")}>{"評価と安全性を運用に組み込む"}</span>
        </a>
        <a className={[styles["nav-a"]].join(" ")} href="#sec-10" data-testid="sidebar-nav-link">
          <span className={[styles["nav-k"]].join(" ")}>{"APPENDIX A"}</span>
          <span className={[styles["nav-t"]].join(" ")}>{"著名開発者・コミュニティの知見"}</span>
        </a>
        <a className={[styles["nav-a"]].join(" ")} href="#sec-11" data-testid="sidebar-nav-link">
          <span className={[styles["nav-k"]].join(" ")}>{"APPENDIX B"}</span>
          <span className={[styles["nav-t"]].join(" ")}>{"よくある落とし穴 FAQ"}</span>
        </a>
        <a className={[styles["nav-a"]].join(" ")} href="#sec-12" data-testid="sidebar-nav-link">
          <span className={[styles["nav-k"]].join(" ")}>{"APPENDIX C"}</span>
          <span className={[styles["nav-t"]].join(" ")}>{"情報の確度と注意点"}</span>
        </a>
        <a className={[styles["nav-a"]].join(" ")} href="#sec-13" data-testid="sidebar-nav-link">
          <span className={[styles["nav-k"]].join(" ")}>{"REFERENCES"}</span>
          <span className={[styles["nav-t"]].join(" ")}>{"参考URL一覧(根拠ソース)"}</span>
        </a>
        {"\n"}
        {"    "}
      </nav>
      {"\n"}
      {"    "}
      <div className={[styles.layout].join(" ")}>
        {"\n"}
        {"      "}
        <div className={[styles["mobile-bar"]].join(" ")} id="openai-mobile-bar">
          {"\n"}
          {"        "}
          <button
            type="button"
            id="openai-menu"
            aria-label="目次を開く"
            aria-controls="openai-sidebar"
            aria-expanded="false"
          >
            {"目次"}
          </button>
          <span>{"OpenAI 最新モデル ベストプラクティス"}</span>
          {"\n"}
          {"      "}
        </div>
        {"\n"}
        {"      "}
        <main className={[styles.main].join(" ")}>
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
            <div className={[styles.kicker].join(" ")}>{"OpenAI GPT-6 Family Guide"}</div>
            {"\n"}
            {"          "}
            <h1>{"OpenAI 最新モデル ベストプラクティス完全ガイド"}</h1>
            {"\n"}
            {"          "}
            <span className={[styles.sub].join(" ")}>{"中級〜上級者向け"}</span>
            {"\n"}
            {"          "}
            <div className={[styles["meta-row"]].join(" ")}>
              {"\n"}
              {"            "}
              <div className={[styles["meta-card"]].join(" ")}>
                {"\n"}
                {"              "}
                <span className={[styles["meta-k"]].join(" ")}>{"対象読者"}</span>
                <span className={[styles["meta-v"]].join(" ")}>
                  {"すでにOpenAI APIを使ったことがあり、GPT-6世代へ移行・最適化したいエンジニア"}
                </span>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <div className={[styles["meta-card"]].join(" ")}>
                {"\n"}
                {"              "}
                <span className={[styles["meta-k"]].join(" ")}>{"調査基準日"}</span>
                <span className={[styles["meta-v"]].join(" ")}>
                  {"2026年10月23日(この日までに公開された情報をもとに作成)"}
                </span>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <div className={[styles["meta-card"]].join(" ")}>
                {"\n"}
                {"              "}
                <span className={[styles["meta-k"]].join(" ")}>{"ゴール"}</span>
                <span className={[styles["meta-v"]].join(" ")}>
                  {
                    "「どのモデルを選び、どう呼び、どう評価し、どうコストを抑えるか」を8ステップで身につける"
                  }
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
          {"\n"}
          {"        "}
          <section className={[styles.section].join(" ")} id="sec-0">
            {"\n"}
            {"          "}
            <div className={[styles["sec-head"]].join(" ")}>
              {"\n"}
              {"            "}
              <span className={[styles.eyebrow].join(" ")}>{"PART 0"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-0-heading">{"このガイドの読み方と前提"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-0-1">{"0-1. 情報の優先順位"}</h3>
            {"\n"}
            {"          "}
            <p>{"このガイドは次の優先順位で情報を扱います。"}</p>
            {"\n"}
            {"          "}
            <div className={[styles["table-wrap"]].join(" ")}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"優先度"}</th>
                    <th>{"種別"}</th>
                    <th>{"例"}</th>
                    <th>{"扱い"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"1"}</td>
                    <td>{"OpenAI公式ドキュメント・公式ブログ"}</td>
                    <td>{"Using GPT-6、API Changelog"}</td>
                    <td>{"仕様・パラメータの根拠として採用"}</td>
                  </tr>
                  <tr>
                    <td>{"2"}</td>
                    <td>{"著名な開発者・計測者の一次発信"}</td>
                    <td>{"Simon Willison、OpenAI開発者ブログ著者"}</td>
                    <td>{"実測値・運用知見として採用"}</td>
                  </tr>
                  <tr>
                    <td>{"3"}</td>
                    <td>{"ゲートウェイ・解析企業の技術ブログ"}</td>
                    <td>{"LiteLLM、Vercel、Endor Labs"}</td>
                    <td>{"公式を補う実装情報として採用"}</td>
                  </tr>
                  <tr>
                    <td>{"4"}</td>
                    <td>{"比較サイト・まとめ記事"}</td>
                    <td>{"価格比較サイト"}</td>
                    <td>{"数値は複数ソースで一致したもののみ採用"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-0-2">{"0-2. 前提"}</h3>
            {"\n"}
            {"          "}
            <ul>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"価格・上限値・対応状況は"}
                <strong>{"頻繁に変わります"}</strong>
                {"。本番投入前に必ず公式の"}
                {"\n"}
                {"              "}
                <a
                  href="https://developers.openai.com/api/docs/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"Pricing"}
                </a>
                {"\n"}
                {"              "}
                {"と各モデルページで再確認してください。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>{"「補足C」に、ソース間で食い違いがあった点をまとめています。"}</li>
              {"\n"}
              {"            "}
              <li>
                {"コードは Python("}
                <code>{"openai"}</code> {"SDK)を中心に示します。"}
              </li>
              {"\n"}
              {"          "}
            </ul>
            {"\n"}
            {"        "}
          </section>
          {"\n"}
          {"        "}
          <section className={[styles.section].join(" ")} id="sec-1">
            {"\n"}
            {"          "}
            <div className={[styles["sec-head"]].join(" ")}>
              {"\n"}
              {"            "}
              <span className={[styles.eyebrow].join(" ")}>{"PART 1"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-1-heading">{"全体像: 2026年のOpenAIモデル地図"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-1-1">{"1-1. リリースの流れ"}</h3>
            {"\n"}
            {"          "}
            <figure className={[styles["diagram-card"]].join(" ")}>
              {"\n"}
              {"            "}
              <div className={[styles["diagram-wrap"]].join(" ")}>
                <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="d0">
                  <MermaidDiagram chart={DIAGRAM_0} theme="base" themeVariables={THEME} />
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
              {"ポイントは"}
              <strong>{"わずか2か月弱で世代が一気に進んだ"}</strong>
              {"ことです。モデルIDを固定しつつ、評価基盤(Step"}
              {"\n"}
              {"            "}
              {"8)を先に整えておかないと、追従コストが膨らみます。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-1-2">{"1-2. 現行ラインナップ(API)"}</h3>
            {"\n"}
            {"          "}
            <div className={[styles["table-wrap"]].join(" ")}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"モデル"}</th>
                    <th>{"API ID"}</th>
                    <th>{"位置づけ"}</th>
                    <th>{"入力 / キャッシュ入力 / 出力(100万トークン)"}</th>
                    <th>{"コンテキスト"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"GPT-6 Astra"}</td>
                    <td>
                      <code>{"gpt-6-astra"}</code>
                    </td>
                    <td>{"最高知能。最難関の推論・コーディング・コンピュータ操作"}</td>
                    <td>{"$10 / $1 / $50"}</td>
                    <td>{"1.05M(最大出力128K)"}</td>
                  </tr>
                  <tr>
                    <td>{"GPT-6.1 Sol"}</td>
                    <td>
                      <code>{"gpt-6.1-sol"}</code>
                    </td>
                    <td>
                      {"Astraに迫る性能を約1/5の単価で。"}
                      <strong>{"新規開発の既定候補"}</strong>
                    </td>
                    <td>{"$2 / $0.10 / $10"}</td>
                    <td>{"1.05M"}</td>
                  </tr>
                  <tr>
                    <td>{"GPT-6 Sol"}</td>
                    <td>
                      <code>{"gpt-6-sol"}</code>
                    </td>
                    <td>{"6.1 Solの前版(同価格、キャッシュ入力は$0.20)"}</td>
                    <td>{"$2 / $0.20 / $10"}</td>
                    <td>{"1.05M"}</td>
                  </tr>
                  <tr>
                    <td>{"GPT-6 Luna"}</td>
                    <td>
                      <code>{"gpt-6-luna"}</code>
                    </td>
                    <td>{"高ボリューム・定型・低コスト"}</td>
                    <td>{"$0.10 / $0.01 / $0.50"}</td>
                    <td>{"1.05M"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <p>{"補足:"}</p>
            {"\n"}
            {"          "}
            <ul>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"上記は"}
                <strong>{"短いコンテキスト(入力272K以下)の標準料金"}</strong>
                {"です。272Kを超えると、そのリクエスト全体に長文用の割増料金が掛かります(Step"}
                {"\n"}
                {"              "}
                {"6参照)。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"知識カットオフは、Astra と 6.1 Sol が 2026年4月30日と報告されています(GPT-6"}
                {"\n"}
                {"              "}
                {"Solは4月20日との報告あり)。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"入力は"}
                <strong>{"テキストと画像"}</strong>
                {"、推論エフォートは"}
                {"\n"}
                {"              "}
                <code>{"low"}</code>
                {"〜"}
                <code>{"max"}</code>
                {"(Sol/Lunaの一部は "}
                <code>{"none"}</code> {"も可)です。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"          "}
            </ul>
            {"\n"}
            {"          "}
            <h3 id="sec-1-3">{"1-3. 周辺プロダクト・モデル"}</h3>
            {"\n"}
            {"          "}
            <div className={[styles["table-wrap"]].join(" ")}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"領域"}</th>
                    <th>{"内容"}</th>
                    <th>{"要点"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"音声"}</td>
                    <td>{"GPT-Live-1(API一般提供)、GPT-Live-1.1(10月15日、ChatGPT Voice)"}</td>
                    <td>{"新しい音声が追加され、多言語・アクセントが改善"}</td>
                  </tr>
                  <tr>
                    <td>{"画像"}</td>
                    <td>{"GPT Image 2.5(9月8日、Sunburst / Flare系)"}</td>
                    <td>{"Image APIとResponses APIの画像生成ツールで利用"}</td>
                  </tr>
                  <tr>
                    <td>{"高速化"}</td>
                    <td>{"Fast mode / Ultrafast mode"}</td>
                    <td>
                      <code>{"service_tier"}</code> {"で切替(Step 6)"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"エージェント"}</td>
                    <td>{"Multi-agent(β)、Agents API、Agents SDK"}</td>
                    <td>{"サブエージェントへの委任(Step 5)"}</td>
                  </tr>
                  <tr>
                    <td>{"ChatGPT側"}</td>
                    <td>{"GPT-6 Proの並列エージェント(10月16日)、Slides"}</td>
                    <td>{"プロダクト機能。API設計とは分けて考える"}</td>
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
          <section className={[styles.section].join(" ")} id="sec-2">
            {"\n"}
            {"          "}
            <div className={[styles["sec-head"]].join(" ")}>
              {"\n"}
              {"            "}
              <span className={[styles.eyebrow].join(" ")}>{"STEP 1"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-2-heading">{"モデルを選ぶ"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-2-1">{"1-A. 選定フロー"}</h3>
            {"\n"}
            {"          "}
            <figure className={[styles["diagram-card"]].join(" ")}>
              {"\n"}
              {"            "}
              <div className={[styles["diagram-wrap"]].join(" ")}>
                <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="d1">
                  <MermaidDiagram chart={DIAGRAM_1} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <h3 id="sec-2-2">{"1-B. 「Astraか6.1 Solか」の判断材料"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"OpenAIは6.1"}
              {"\n"}
              {"            "}
              {"Solを「Astraに近い性能を約1/5の価格で」と位置づけ、"}
              <strong>{"自分のタスクで比較して品質とコストのトレードオフを評価する"}</strong>
              {"ことを勧めています。外部の実測も同じ方向です。"}
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
                    <th>{"観点"}</th>
                    <th>{"実測・報告"}</th>
                    <th>{"出典"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"タスクあたりコスト"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"6.1 Solは Astra の4分の1未満(指数タスクあたり約$0.72 対"}
                      {"\n"}
                      {"                    "}
                      {"約$3.26、指数スコアは52対53)"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"DataCamp"}</td>
                  </tr>
                  <tr>
                    <td>{"保守タスク(未使用コード調査)"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"6.1 Sol Ultraは Astra Ultra"}
                      {"\n"}
                      {"                    "}
                      {
                        "の92%の検出数を、14%のコストで達成。1件あたりコストは Astra Ultra $0.77、6.1 Sol"
                      }
                      {"\n"}
                      {"                    "}
                      {"Ultra $0.12、6.1 Sol Medium $0.06"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"OpenAI開発者ブログ"}</td>
                  </tr>
                  <tr>
                    <td>{"セキュアなコード生成"}</td>
                    <td>{"Codex上で6.1 SolとAstraはほぼ互角(安全に解けたタスクの差は7件対6件)"}</td>
                    <td>{"Endor Labs"}</td>
                  </tr>
                  <tr>
                    <td>{"最難関領域"}</td>
                    <td>{"サイバー・生物・科学の最難関評価ではAstraが依然上位との報告"}</td>
                    <td>{"DataCamp"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <p>
              <strong>{"実務の結論"}</strong>
            </p>
            {"\n"}
            {"          "}
            <ol>
              {"\n"}
              {"            "}
              <li>
                {"まず "}
                <code>{"gpt-6.1-sol"}</code> {"で全評価セットを回す。"}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"失敗が集中するタスク群だけを "}
                <code>{"gpt-6-astra"}</code> {"で再実行して差分を測る。"}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"差分が小さければ6.1"}
                {"\n"}
                {"              "}
                {"Solのまま、大きい領域だけAstraへ"}
                <strong>{"ルーティング"}</strong>
                {"する。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"大量・定型の前段処理(分類、抽出、要約の下書き)は "}
                <code>{"gpt-6-luna"}</code> {"に落とす。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"          "}
            </ol>
            {"\n"}
            {"          "}
            <h3 id="sec-2-3">{"1-C. ルーティング設計のコツ"}</h3>
            {"\n"}
            {"          "}
            <ul>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"モデル名を直書きせず、"}
                <strong>
                  {"用途名(例: "}
                  <code>{"triage"}</code> {"/ "}
                  <code>{"main_agent"}</code> {"/"}
                  {"\n"}
                  {"                "}
                  <code>{"hard_case"}</code>
                  {")から解決する設定層"}
                </strong>
                {"を作る。世代交代が速いため、差し替えコストを下げられます。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"6.1 Solは "}
                <code>{"none"}</code>
                {"/"}
                <code>{"minimal"}</code> {"エフォートに非対応です。Luna・GPT-6"}
                {"\n"}
                {"              "}
                {"Solからの置換時にエフォート設定の変換が要ります(Step 3)。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {
                  "OpenAI開発者ブログには、プロバイダ障害時のフェイルオーバー設計記事もあります(参考URL一覧)。"
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
          <section className={[styles.section].join(" ")} id="sec-3">
            {"\n"}
            {"          "}
            <div className={[styles["sec-head"]].join(" ")}>
              {"\n"}
              {"            "}
              <span className={[styles.eyebrow].join(" ")}>{"STEP 2"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-3-heading">{"Responses APIで最小構成を作る"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"GPT-6世代では、"}
              <strong>{"推論・ツール呼び出し・マルチターンはResponses APIが前提"}</strong>
              {"です。Chat Completionsはツールなしのリクエストに限り使えます(Astra / 6.1 Sol)。"}
              <code>{"gpt-6-sol"}</code>
              {"\n"}
              {"            "}
              {"と "}
              <code>{"gpt-6-luna"}</code> {"は "}
              <code>{'reasoning_effort: "none"'}</code> {"のときのみChat"}
              {"\n"}
              {"            "}
              {"Completionsで関数呼び出しが可能です。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-3-1">{"2-A. 最小リクエスト"}</h3>
            {"\n"}
            {"          "}
            <div className={[styles["code-block"]].join(" ")} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={[styles["code-head"]].join(" ")}>
                {"\n"}
                {"              "}
                <span className={[styles["code-lang"]].join(" ")}>{"Python"}</span>
                <button type="button" className={[styles["copy-btn"]].join(" ")} data-copy-code>
                  {"コピー"}
                </button>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <pre>
                <code className={["language-python"].join(" ")}>
                  <div className={styles.codeLine}>
                    <span className="hljs-keyword">{"from"}</span> {"openai "}
                    <span className="hljs-keyword">{"import"}</span> {"OpenAI"}
                    {"\n"}
                    {"\n"}
                    {"client = OpenAI()"}
                    {"\n"}
                    {"\n"}
                    {"log_text = "}
                    <span className="hljs-string">
                      {'"2026-10-23T09:12:04Z ERROR db: connection pool exhausted"'}
                    </span>
                    {"  "}
                    <span className="hljs-comment">{"# 分析対象のログ(例)"}</span>
                    {"\n"}
                    {"\n"}
                    {"response = client.responses.create("}
                    {"\n"}
                    {"    "}
                    {"model="}
                    <span className="hljs-string">{'"gpt-6.1-sol"'}</span>
                    {","}
                    {"\n"}
                    {"    "}
                    <span className="hljs-built_in">{"input"}</span>
                    {"="}
                    <span className="hljs-string">
                      {'"次のログから根本原因の候補を3つ挙げ、確認手順を示してください。\\n\\n"'}
                    </span>{" "}
                    {"+ log_text,"}
                    {"\n"}
                    {"    "}
                    {"reasoning={"}
                    <span className="hljs-string">{'"effort"'}</span>
                    {": "}
                    <span className="hljs-string">{'"medium"'}</span>
                    {"},      "}
                    <span className="hljs-comment">{"# 既定はmedium"}</span>
                    {"\n"}
                    {"    "}
                    {"text={"}
                    <span className="hljs-string">{'"verbosity"'}</span>
                    {": "}
                    <span className="hljs-string">{'"medium"'}</span>
                    {"},        "}
                    <span className="hljs-comment">{"# 詳細度の既定値"}</span>
                    {"\n"}
                    {")"}
                    {"\n"}
                    {"\n"}
                    <span className="hljs-built_in">{"print"}</span>
                    {"(response.output_text)"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-3-2">{"2-B. サンプリングパラメータに注意"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"推論エフォートが"}
              {"\n"}
              {"            "}
              <code>{"none"}</code> {"以外のとき、次のパラメータは"}
              <strong>{"削除"}</strong>
              {"します。"}
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
                    <th>{"削除するもの"}</th>
                    <th>{"API"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>{"temperature"}</code>
                      {", "}
                      <code>{"top_p"}</code>
                      {", "}
                      <code>{"top_logprobs"}</code>
                    </td>
                    <td>{"共通"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"logprobs"}</code>
                    </td>
                    <td>{"Chat Completions"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"message.output_text.logprobs"}</code>
                      {"("}
                      <code>{"include"}</code>
                      {"内)"}
                    </td>
                    <td>{"Responses"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={[styles["code-block"]].join(" ")} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={[styles["code-head"]].join(" ")}>
                {"\n"}
                {"              "}
                <span className={[styles["code-lang"]].join(" ")}>{"Python"}</span>
                <button type="button" className={[styles["copy-btn"]].join(" ")} data-copy-code>
                  {"コピー"}
                </button>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <pre>
                <code className={["language-python"].join(" ")}>
                  <div className={styles.codeLine}>
                    <span className="hljs-comment">
                      {"# NG: エフォートがnone以外で温度を指定している"}
                    </span>
                    {"\n"}
                    {"client.responses.create("}
                    {"\n"}
                    {"    "}
                    {"model="}
                    <span className="hljs-string">{'"gpt-6.1-sol"'}</span>
                    {","}
                    {"\n"}
                    {"    "}
                    <span className="hljs-built_in">{"input"}</span>
                    {"="}
                    <span className="hljs-string">{'"..."'}</span>
                    {","}
                    {"\n"}
                    {"    "}
                    {"reasoning={"}
                    <span className="hljs-string">{'"effort"'}</span>
                    {": "}
                    <span className="hljs-string">{'"high"'}</span>
                    {"},"}
                    {"\n"}
                    {"    "}
                    {"temperature="}
                    <span className="hljs-number">{"0.2"}</span>
                    {",   "}
                    <span className="hljs-comment">{"# 非対応。削除する"}</span>
                    {"\n"}
                    {")"}
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-3-3">{"2-C. 会話状態の持ち方"}</h3>
            {"\n"}
            {"          "}
            <figure className={[styles["diagram-card"]].join(" ")}>
              {"\n"}
              {"            "}
              <div className={[styles["diagram-wrap"]].join(" ")}>
                <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="d2">
                  <MermaidDiagram chart={DIAGRAM_2} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <ul>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"GPT-5.6では"}
                <strong>{"推論の持ち越し"}</strong>
                {"("}
                <code>{"reasoning.context"}</code>
                {")が既定で"}
                {"\n"}
                {"              "}
                <code>{"all_turns"}</code>
                {"\n"}
                {"              "}
                {
                  "です。前のターンの推論をモデルが参照できるため、マルチターンの品質とキャッシュ効率が上がります。ターンをまたぐ推論が必要なら、モデルの既定に頼らず"
                }
                {"\n"}
                {"              "}
                <code>{'reasoning={"context": "all_turns"}'}</code> {"を明示します。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <code>{"all_turns"}</code> {"を活かすには"}
                {"\n"}
                {"              "}
                <code>{"previous_response_id"}</code>
                {"\n"}
                {"              "}
                {"を使います。手動管理なら、過去の入力と"}
                <strong>{"すべての出力アイテム"}</strong>
                {"を欠落なく再送します。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"以前の目標・前提が無関係になったら "}
                <code>{"current_turn"}</code> {"に切り替えます。"}
              </li>
              {"\n"}
              {"          "}
            </ul>
            {"\n"}
            {"        "}
          </section>
          {"\n"}
          {"        "}
          <section className={[styles.section].join(" ")} id="sec-4">
            {"\n"}
            {"          "}
            <div className={[styles["sec-head"]].join(" ")}>
              {"\n"}
              {"            "}
              <span className={[styles.eyebrow].join(" ")}>{"STEP 3"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-4-heading">{"reasoning effortを設計する"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-4-1">{"3-A. 対応状況"}</h3>
            {"\n"}
            {"          "}
            <div className={[styles["table-wrap"]].join(" ")}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"モデル"}</th>
                    <th>{"指定できる値"}</th>
                    <th>{"既定"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>{"gpt-6-astra"}</code>
                    </td>
                    <td>{"low / medium / high / xhigh / max"}</td>
                    <td>{"medium"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"gpt-6.1-sol"}</code>
                    </td>
                    <td>{"low / medium / high / xhigh / max"}</td>
                    <td>{"medium"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"gpt-6-sol"}</code>
                    </td>
                    <td>{"none を含む(minimalは非対応)"}</td>
                    <td>{"medium"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"gpt-6-luna"}</code>
                    </td>
                    <td>{"none を含む(minimalは非対応)"}</td>
                    <td>{"medium"}</td>
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
              {"※ Astraと6.1 Solは "}
              <code>{"none"}</code> {"/ "}
              <code>{"minimal"}</code> {"非対応。既存コードに"}
              {"\n"}
              {"            "}
              <code>{"none"}</code> {"や "}
              <code>{"minimal"}</code> {"がある場合は、まず"}
              {"\n"}
              {"            "}
              <code>{"low"}</code> {"に置き換えてレイテンシを比較します。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-4-2">{"3-B. チューニング手順"}</h3>
            {"\n"}
            {"          "}
            <figure className={[styles["diagram-card"]].join(" ")}>
              {"\n"}
              {"            "}
              <div className={[styles["diagram-wrap"]].join(" ")}>
                <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="d3">
                  <MermaidDiagram chart={DIAGRAM_3} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <p>{"運用ルール:"}</p>
            {"\n"}
            {"          "}
            <ol>
              {"\n"}
              {"            "}
              <li>
                <strong>{"高いほど良い、ではない"}</strong>
                {"。medium起点で、上げる根拠を計測で示す。"}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <code>{"max"}</code> {"は最難関で品質最優先のタスクに限定する。"}
                <code>{"xhigh"}</code>
                {"\n"}
                {"              "}
                {"との差を必ず比較する。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"推論トークンは"}
                <strong>{"出力トークン単価で課金"}</strong>
                {"されます。high / max"}
                {"\n"}
                {"              "}
                {"では出力コストが跳ねます。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"旧世代(GPT-5.5 /"}
                {"\n"}
                {"              "}
                {"5.4)から移すときは、現行エフォートを基準に"}
                <strong>{"同じ値と1段下"}</strong>
                {
                  "を比較します。GPT-5.6世代はトークン効率が高く、低いエフォートでも同等品質になることがあります。"
                }
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"          "}
            </ol>
            {"\n"}
            {"          "}
            <h3 id="sec-4-3">{"3-C. 会話の途中でエフォートを変える(キャッシュを壊さない)"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"GPT-6世代の新機能として、"}
              <code>{"configuration_update"}</code>
              {"\n"}
              {"            "}
              {"という入力アイテムを足すと、"}
              <strong>{"プロンプトの先頭部分を書き換えずに"}</strong>
              {
                "エフォートを上げ下げできます。難しい局面だけ上げ、定型の追い質問は下げる、といった使い分けでキャッシュを保てます。"
              }
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
                    <th>{"守ること"}</th>
                    <th>{"理由"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"リクエストレベルの"}
                      {"\n"}
                      {"                    "}
                      <code>{"reasoning.effort"}</code> {"は"}
                      <strong>{"固定のまま"}</strong>
                      {"にする"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"先頭部分が変わるとキャッシュが外れる"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"標準の"}
                      <strong>{"単一エージェント"}</strong>
                      {"リクエストで使う"}
                    </td>
                    <td>{"マルチエージェントとは併用不可の制約あり"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{'truncation: "auto"'}</code> {"と併用しない"}
                    </td>
                    <td>{"互換制限(公式のReasoningガイドで確認)"}</td>
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
              {"正確な入力アイテムの形は、公式の「Change reasoning"}
              {"\n"}
              {"            "}
              {"mid-conversation」を参照してください(参考URL一覧)。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-4-4">{"3-D. Proモード"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"GPT-5.6世代以降、"}
              <code>{"reasoning.mode"}</code> {"を"}
              {"\n"}
              {"            "}
              <code>{"pro"}</code>
              {"\n"}
              {"            "}
              {"にすると、モデルがより多くの作業をしてから"}
              <strong>{"単一の最終回答"}</strong>
              {"を返します。別のProモデルIDに切り替える方式ではありません。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <ul>
              {"\n"}
              {"            "}
              <li>{"向く: 複雑な最適化、価値の高いレビュー、評価基準が明確な深い分析"}</li>
              {"\n"}
              {"            "}
              <li>
                {"向かない: 低遅延が必要な処理、高ボリューム処理、評価で改善が確認できない処理"}
              </li>
              {"\n"}
              {"            "}
              <li>{"エフォートとは独立。標準モードと同じ設定を基準に比較する"}</li>
              {"\n"}
              {"          "}
            </ul>
            {"\n"}
            {"        "}
          </section>
          {"\n"}
          {"        "}
          <section className={[styles.section].join(" ")} id="sec-5">
            {"\n"}
            {"          "}
            <div className={[styles["sec-head"]].join(" ")}>
              {"\n"}
              {"            "}
              <span className={[styles.eyebrow].join(" ")}>{"STEP 4"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-5-heading">{"プロンプトを「薄く」「境界を明確に」する"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-5-1">{"4-A. 基本方針(公式の移行ガイドより)"}</h3>
            {"\n"}
            {"          "}
            <ol>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <strong>{"新しいベースラインから始める"}</strong>
                {"。古いプロンプトの指示を全部持ち越さない。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"製品要件を守る"}
                <strong>{"最小のプロンプト"}</strong>
                {"から始め、エフォート・詳細度・ツール説明・出力形式を代表例で調整する。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"同じ指示を繰り返さない。"}
                <strong>{"各指示は1回だけ"}</strong>
                {"書く。"}
              </li>
              {"\n"}
              {"            "}
              <li>{"関係するツールだけを公開し、説明は簡潔かつ正確に。"}</li>
              {"\n"}
              {"          "}
            </ol>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"OpenAIは、社内のコーディングエージェント評価で、プロンプトを薄くした構成が"}
              <strong>{"スコア約10〜15%向上、総トークン41〜66%減、コスト33〜67%減"}</strong>
              {"になった例を示しています(傾向値であり、自分のワークロードで検証が必要)。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-5-2">{"4-B. Astra世代の挙動と対処"}</h3>
            {"\n"}
            {"          "}
            <div className={[styles["table-wrap"]].join(" ")}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"挙動の傾向"}</th>
                    <th>{"症状"}</th>
                    <th>{"対処の方向性"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"より協調的で、重要な不明点を質問しやすい"}</td>
                    <td>{"「ユーザーが推測して進めてほしい場面」で止まる"}</td>
                    <td>{"権限が暗黙に与えられている依頼は実行まで進める、と明文化"}</td>
                  </tr>
                  <tr>
                    <td>{"指示への感度が高い"}</td>
                    <td>
                      {"skillsや "}
                      <code>{"AGENTS.md"}</code> {"の矛盾・曖昧さで作業が止まる"}
                    </td>
                    <td>{"指示の優先順位を明示。ファイル群を監査"}</td>
                  </tr>
                  <tr>
                    <td>{"書式が多め(箇条書き・表・Markdown)"}</td>
                    <td>{"製品UIに合わない"}</td>
                    <td>{"文体と構造を明示指定"}</td>
                  </tr>
                  <tr>
                    <td>{"委譲が控えめ"}</td>
                    <td>{"サブエージェントを使わない"}</td>
                    <td>{"いつ・どれだけ並列化するか指定"}</td>
                  </tr>
                  <tr>
                    <td>{"テストが徹底的"}</td>
                    <td>{"小さな変更に広すぎるテスト"}</td>
                    <td>{"変更規模に応じた検証範囲を指定"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-5-3">{"4-C. すぐ使えるテンプレート(自分用に書き直した版)"}</h3>
            {"\n"}
            {"          "}
            <p>
              <strong>{"(1) 自律性と承認境界"}</strong>
            </p>
            {"\n"}
            {"          "}
            <div className={[styles["code-block"]].join(" ")} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={[styles["code-head"]].join(" ")}>
                {"\n"}
                {"              "}
                <span className={[styles["code-lang"]].join(" ")}>{"Markdown"}</span>
                <button type="button" className={[styles["copy-btn"]].join(" ")} data-copy-code>
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
                    <span className="hljs-section">{"# 権限の考え方"}</span>
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {
                      "「説明・レビュー・診断・計画」の依頼: 関連資料を調べて報告する。依頼がない限り変更は実装しない。"
                    }
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {
                      "「変更・構築・修正」の依頼: 範囲内のローカル変更と、非破壊の検証を、確認なしで実行する。"
                    }
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {
                      "次の場合だけ事前確認を取る: 外部への書き込み、破壊的操作、購入・課金、依頼範囲の実質的な拡大。"
                    }
                    {"\n"}
                    {"\n"}
                    <span className="hljs-section">{"# 完了の定義"}</span>
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"実装、起動確認、結果の検査、失敗の修正までを依頼に含める。"}
                    {"\n"}
                    <span className="hljs-bullet">{"-"}</span>{" "}
                    {"最初の実装が動いた時点で止まらず、受け入れ基準を満たすまで進める。"}
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
              <strong>{"(2) 優先順位の明示(指示ファイルが多い環境向け)"}</strong>
            </p>
            {"\n"}
            {"          "}
            <div className={[styles["code-block"]].join(" ")} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={[styles["code-head"]].join(" ")}>
                {"\n"}
                {"              "}
                <span className={[styles["code-lang"]].join(" ")}>{"Markdown"}</span>
                <button type="button" className={[styles["copy-btn"]].join(" ")} data-copy-code>
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
                    {
                      "指示の優先順位は、実行環境の指示階層(システム・開発者の指示)と、適用されるskill・AGENTS.mdの指示に従う。"
                    }
                    {"\n"}
                    {"ユーザーの明示的な依頼だけでは、これらの指示を上書きしない。"}
                    {"\n"}
                    {"skillが原因で確認を求めたり作業を中断したりする場合は、"}
                    {"\n"}
                    {"該当ファイル名と該当箇所を示し、明示要件と自分の解釈を区別して説明する。"}
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
              <strong>{"(3) 出力スタイル(散文中心にしたい場合)"}</strong>
            </p>
            {"\n"}
            {"          "}
            <div className={[styles["code-block"]].join(" ")} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={[styles["code-head"]].join(" ")}>
                {"\n"}
                {"              "}
                <span className={[styles["code-lang"]].join(" ")}>{"Markdown"}</span>
                <button type="button" className={[styles["copy-btn"]].join(" ")} data-copy-code>
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
                    {"結論を冒頭で述べ、段落ごとに1つの論点を展開する。"}
                    {"\n"}
                    {"箇条書きや表は、並列・手順・比較として本当に有効な場合だけ使う。"}
                    {"\n"}
                    {"専門用語は必要最小限にし、読者の前提知識に合わせて説明の深さを調整する。"}
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
              <strong>{"(4) 検証の強度"}</strong>
            </p>
            {"\n"}
            {"          "}
            <div className={[styles["code-block"]].join(" ")} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={[styles["code-head"]].join(" ")}>
                {"\n"}
                {"              "}
                <span className={[styles["code-lang"]].join(" ")}>{"Markdown"}</span>
                <button type="button" className={[styles["copy-btn"]].join(" ")} data-copy-code>
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
                    {"可逆で影響の小さい変更には、実装をなぞるだけのテストを書かない。"}
                    {"\n"}
                    {
                      "変更に見合う検証を行い、通った後は、新たな失敗や懸念がない限り検証を広げず完了に向かう。"
                    }
                    {"\n"}
                  </div>
                </code>
              </pre>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-5-4">
              {"4-D. 詳細度は "}
              <code>{"text.verbosity"}</code> {"で一元管理"}
            </h3>
            {"\n"}
            {"          "}
            <div className={[styles["code-block"]].join(" ")} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={[styles["code-head"]].join(" ")}>
                {"\n"}
                {"              "}
                <span className={[styles["code-lang"]].join(" ")}>{"Python"}</span>
                <button type="button" className={[styles["copy-btn"]].join(" ")} data-copy-code>
                  {"コピー"}
                </button>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <pre>
                <code className={["language-python"].join(" ")}>
                  <div className={styles.codeLine}>
                    {"user_query = "}
                    <span className="hljs-string">
                      {'"Responses APIとChat Completionsの違いを教えてください。"'}
                    </span>
                    {"  "}
                    <span className="hljs-comment">{"# ユーザーの質問(例)"}</span>
                    {"\n"}
                    {"\n"}
                    {"response = client.responses.create("}
                    {"\n"}
                    {"    "}
                    {"model="}
                    <span className="hljs-string">{'"gpt-6.1-sol"'}</span>
                    {","}
                    {"\n"}
                    {"    "}
                    <span className="hljs-built_in">{"input"}</span>
                    {"=user_query,"}
                    {"\n"}
                    {"    "}
                    {"reasoning={"}
                    <span className="hljs-string">{'"effort"'}</span>
                    {": "}
                    <span className="hljs-string">{'"medium"'}</span>
                    {"},"}
                    {"\n"}
                    {"    "}
                    {"text={"}
                    <span className="hljs-string">{'"verbosity"'}</span>
                    {": "}
                    <span className="hljs-string">{'"low"'}</span>
                    {"},  "}
                    <span className="hljs-comment">{"# low / medium / high"}</span>
                    {"\n"}
                    {")"}
                    {"\n"}
                  </div>
                </code>
              </pre>
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
                {"「簡潔に」だけの指示は、必要な情報まで削る場合があります。"}
                <strong>{"残すべき内容(結論・根拠・注意点・次の行動)と、削ってよい内容"}</strong>
                {"を指定します。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"「親切に」「共感的に」などの曖昧な語は避け、"}
                <strong>{"書き方の選択"}</strong>
                {"(結論の出し方、問題への触れ方、締めの有無)で定義します。"}
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
          <section className={[styles.section].join(" ")} id="sec-6">
            {"\n"}
            {"          "}
            <div className={[styles["sec-head"]].join(" ")}>
              {"\n"}
              {"            "}
              <span className={[styles.eyebrow].join(" ")}>{"STEP 5"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-6-heading">{"ツール・エージェント機能を使いこなす"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-6-1">{"5-A. 機能マップ"}</h3>
            {"\n"}
            {"          "}
            <div className={[styles["table-wrap"]].join(" ")}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"機能"}</th>
                    <th>{"何ができるか"}</th>
                    <th>{"使いどころ"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"非同期ツール呼び出し(Async tool calling)"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"ツール実行中も、モデルが推論・他ツール呼び出し・独立部分の回答を続けられる"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"実行が遅い外部API、並行できる調査"}</td>
                  </tr>
                  <tr>
                    <td>{"途中介入(Mid-turn steering)"}</td>
                    <td>{"実行中に追加指示を送れる。完了済みの作業は保持される(WebSocket接続)"}</td>
                    <td>{"長時間タスクの軌道修正"}</td>
                  </tr>
                  <tr>
                    <td>{"Programmatic Tool Calling"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"モデルがJavaScriptで複数ツールを呼び、中間結果を処理して小さな結果だけ返す"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"絞り込み・結合・集計などの定型処理"}</td>
                  </tr>
                  <tr>
                    <td>{"Multi-agent(β)"}</td>
                    <td>{"サブエージェントに委任して並列に進める"}</td>
                    <td>{"独立した作業に分割できる大きなタスク"}</td>
                  </tr>
                  <tr>
                    <td>{"圧縮(Compaction)"}</td>
                    <td>{"長い会話を圧縮して継続"}</td>
                    <td>{"長時間エージェント"}</td>
                  </tr>
                  <tr>
                    <td>{"ツール検索・Skills・MCP"}</td>
                    <td>{"ツール数が多い環境の整理、再利用可能な手順"}</td>
                    <td>{"大規模なツール群"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-6-2">{"5-B. 非同期ツール呼び出しのシーケンス"}</h3>
            {"\n"}
            {"          "}
            <figure className={[styles["diagram-card"]].join(" ")}>
              {"\n"}
              {"            "}
              <div className={[styles["diagram-wrap"]].join(" ")}>
                <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="d4">
                  <MermaidDiagram chart={DIAGRAM_4} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <div className={[styles["code-block"]].join(" ")} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={[styles["code-head"]].join(" ")}>
                {"\n"}
                {"              "}
                <span className={[styles["code-lang"]].join(" ")}>{"Python"}</span>
                <button type="button" className={[styles["copy-btn"]].join(" ")} data-copy-code>
                  {"コピー"}
                </button>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <pre>
                <code className={["language-python"].join(" ")}>
                  <div className={styles.codeLine}>
                    {"tools = ["}
                    {"\n"}
                    {"    "}
                    {"{"}
                    {"\n"}
                    {"        "}
                    <span className="hljs-string">{'"type"'}</span>
                    {": "}
                    <span className="hljs-string">{'"function"'}</span>
                    {","}
                    {"\n"}
                    {"        "}
                    <span className="hljs-string">{'"name"'}</span>
                    {": "}
                    <span className="hljs-string">{'"fetch_report"'}</span>
                    {","}
                    {"\n"}
                    {"        "}
                    <span className="hljs-string">{'"description"'}</span>
                    {": "}
                    <span className="hljs-string">
                      {'"売上レポートを取得する。完了まで数十秒かかる。"'}
                    </span>
                    {","}
                    {"\n"}
                    {"        "}
                    <span className="hljs-string">{'"parameters"'}</span>
                    {": {"}
                    {"\n"}
                    {"            "}
                    <span className="hljs-string">{'"type"'}</span>
                    {": "}
                    <span className="hljs-string">{'"object"'}</span>
                    {","}
                    {"\n"}
                    {"            "}
                    <span className="hljs-string">{'"properties"'}</span>
                    {": {"}
                    <span className="hljs-string">{'"quarter"'}</span>
                    {": {"}
                    <span className="hljs-string">{'"type"'}</span>
                    {": "}
                    <span className="hljs-string">{'"string"'}</span>
                    {"}},"}
                    {"\n"}
                    {"            "}
                    <span className="hljs-string">{'"required"'}</span>
                    {": ["}
                    <span className="hljs-string">{'"quarter"'}</span>
                    {"],"}
                    {"\n"}
                    {"            "}
                    <span className="hljs-string">{'"additionalProperties"'}</span>
                    {": "}
                    <span className="hljs-literal">{"False"}</span>
                    {","}
                    {"\n"}
                    {"        "}
                    {"},"}
                    {"\n"}
                    {"        "}
                    <span className="hljs-string">{'"strict"'}</span>
                    {": "}
                    <span className="hljs-literal">{"True"}</span>
                    {","}
                    {"\n"}
                    {"        "}
                    <span className="hljs-string">{'"async"'}</span>
                    {": "}
                    <span className="hljs-literal">{"True"}</span>
                    {",   "}
                    <span className="hljs-comment">{"# 結果がすぐ要らないツールにだけ付ける"}</span>
                    {"\n"}
                    {"    "}
                    {"}"}
                    {"\n"}
                    {"]"}
                    {"\n"}
                  </div>
                </code>
              </pre>
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
                {"実行と保留中ジョブの管理は"}
                <strong>{"アプリ側の責任"}</strong>
                {"です。結果は必ず"}
                <strong>
                  {"元の "}
                  <code>{"call_id"}</code>
                </strong>
                {"\n"}
                {"              "}
                {"で返します。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"結果をすぐ必要とするツールに "}
                <code>{"async"}</code> {"を付けない。"}
              </li>
              {"\n"}
              {"          "}
            </ul>
            {"\n"}
            {"          "}
            <h3 id="sec-6-3">{"5-C. Programmatic Tool Calling の使い分け"}</h3>
            {"\n"}
            {"          "}
            <p>{"向く条件:"}</p>
            {"\n"}
            {"          "}
            <ul>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"呼び出しが"}
                <strong>{"境界のある"}</strong>
                {"ワークフロー(絞り込み、結合、重複排除、集計、検証)"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"大きな中間出力を処理して、"}
                <strong>{"はるかに小さい構造化結果"}</strong>
                {"だけ返したい"}
              </li>
              {"\n"}
              {"          "}
            </ul>
            {"\n"}
            {"          "}
            <p>{"直接のツール呼び出しを選ぶ条件:"}</p>
            {"\n"}
            {"          "}
            <ul>
              {"\n"}
              {"            "}
              <li>{"1回の呼び出しで足りる"}</li>
              {"\n"}
              {"            "}
              <li>{"中間出力がすでに小さい"}</li>
              {"\n"}
              {"            "}
              <li>{"各結果が次の判断を変える(モデルの判断が毎回必要)"}</li>
              {"\n"}
              {"            "}
              <li>{"承認が必要な操作"}</li>
              {"\n"}
              {"            "}
              <li>{"最終出力に引用やネイティブな成果物を残す必要がある"}</li>
              {"\n"}
              {"          "}
            </ul>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"ルーティングは"}
              <strong>{"タスク固有に書く"}</strong>
              {
                "(どの段階で使うか、使えるツール、出力スキーマ、並行数・再試行・停止条件、直接呼び出しに残す作業)。ツールの説明には返却フィールド・型・エラー挙動を書きます。返却の形が事前に分からないなら、直接呼び出しで中身を見てから判断させます。"
              }
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              <strong>{"評価の注意"}</strong>
              {":"}
              {"\n"}
              {"            "}
              <code>{"program_output"}</code>
              {"\n"}
              {"            "}
              {
                "と最終メッセージは別物です。プログラムの結果が正しくても、最終回答で必須項目や引用が抜けることがあります。両方をテストします。"
              }
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-6-4">{"5-D. マルチエージェントの設計"}</h3>
            {"\n"}
            {"          "}
            <ul>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"委譲の頻度・条件は"}
                <strong>{"プロンプトで調整"}</strong>
                {
                  "する。Astraは委譲が控えめになりやすく、逆に中規模タスクで委譲しすぎる(Sol系)という報告もあります。"
                }
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"子エージェントのコンテキストと推論も課金対象です。"}
                <strong>{"サブエージェントに自分の成果物を監査させる"}</strong>
                {"運用は、気づかないうちにコストと長文料金帯に入ります(Step"}
                {"\n"}
                {"              "}
                {"6)。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {
                  "エージェント間のメッセージは人間が読むこともあるため、スペースや区切りが崩れないよう指示します。"
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
          <section className={[styles.section].join(" ")} id="sec-7">
            {"\n"}
            {"          "}
            <div className={[styles["sec-head"]].join(" ")}>
              {"\n"}
              {"            "}
              <span className={[styles.eyebrow].join(" ")}>{"STEP 6"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-7-heading">{"コストと速度を最適化する"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-7-1">{"6-A. コストの4つのてこ"}</h3>
            {"\n"}
            {"          "}
            <figure className={[styles["diagram-card"]].join(" ")}>
              {"\n"}
              {"            "}
              <div className={[styles["diagram-wrap"]].join(" ")}>
                <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="d5">
                  <MermaidDiagram chart={DIAGRAM_5} theme="base" themeVariables={THEME} />
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
              <strong>{"単価ではなく「1タスク完了あたりの総コスト」で比較する"}</strong>
              {
                "のが鉄則です。Astraは単価が高くても、出力トークンが少なくて済み、タスクあたりでは安い場合があるとOpenAIは述べています。"
              }
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-7-2">{"6-B. プロンプトキャッシュ"}</h3>
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
                    <td>{"キャッシュ読み取り"}</td>
                    <td>{"6.1 Sol: 入力の5%($0.10)。Astra: $1。Luna: $0.01"}</td>
                  </tr>
                  <tr>
                    <td>{"キャッシュ書き込み"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"TTLで単価が異なる。30分("}
                      <code>{'"30m"'}</code>
                      {"、既定): 通常入力の1.25倍(6.1 Sol:"}
                      {"\n"}
                      {"                    "}
                      {"$2.50 / Astra: $12.50)。12時間("}
                      <code>{'"12h"'}</code>
                      {"、2026-10-20追加):"}
                      {"\n"}
                      {"                    "}
                      {"通常入力の2.5倍(6.1 Sol: $5.00 / Astra: $25.00)"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"暗黙モード"}</td>
                    <td>{"最新の対象メッセージ末尾に1つのブレークポイントを置く"}</td>
                  </tr>
                  <tr>
                    <td>{"明示モード"}</td>
                    <td>
                      {"再利用する先頭部分を"}
                      <strong>{"自分で指定"}</strong>
                      {"して不要な書き込みを避ける"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"移行時の変更"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"GPT-5.5以前の "}
                      <code>{"prompt_cache_retention"}</code> {"は"}
                      {"\n"}
                      {"                    "}
                      <code>{"prompt_cache_options.ttl"}</code>
                      {"(例: "}
                      <code>{'"30m"'}</code>
                      {")に置換"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"計測"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <code>{"cached_tokens"}</code> {"と"}
                      {"\n"}
                      {"                    "}
                      <code>{"cache_write_tokens"}</code> {"を追跡して"}
                      <strong>{"正味コスト"}</strong>
                      {"を見る"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"診断"}</td>
                    <td>
                      {"Prompt Cache Diagnostics が一般提供。キャッシュミスの原因を確認できる"}
                    </td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <p>{"設計のコツ:"}</p>
            {"\n"}
            {"          "}
            <ol>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"システムプロンプト、ツール定義、固定の参考資料を"}
                <strong>{"先頭に固定"}</strong>
                {"し、変動部分を後ろに置く。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>{"ツール定義の順序や文言を毎回変えない(先頭が変わるとミスする)。"}</li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"エフォートを途中で変えるなら "}
                <code>{"configuration_update"}</code> {"を使う(Step 3-C)。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"書き込み課金があるため、再利用されない部分にまでブレークポイントを置かない。"}
              </li>
              {"\n"}
              {"          "}
            </ol>
            {"\n"}
            {"          "}
            <h3 id="sec-7-3">{"6-C. 272Kコンテキストの「崖」"}</h3>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {"1.05Mトークンのコンテキストが使えても、"}
              <strong>{"入力が272Kを超えたリクエストは全体が長文料金"}</strong>
              {"になります。"}
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
                    <th>{"モデル"}</th>
                    <th>{"短いコンテキスト(入力 / 出力)"}</th>
                    <th>{"長文(入力 / 出力)"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"6.1 Sol"}</td>
                    <td>{"$2 / $10"}</td>
                    <td>{"$4 / $15"}</td>
                  </tr>
                  <tr>
                    <td>{"GPT-6 Luna"}</td>
                    <td>{"$0.10 / $0.50"}</td>
                    <td>{"$0.20 / $0.75"}</td>
                  </tr>
                  <tr>
                    <td>{"GPT-6 Astra"}</td>
                    <td>{"$10 / $50"}</td>
                    <td>{"約$20 / 約$75(報告値)"}</td>
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
                {
                  "「入れられる」ことと「入れるべき」ことは別です。検索で絞る、圧縮(Compaction)を使う、不要なツール出力を落とす、で272K以下に収めます。"
                }
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"実際の課金閾値は提供元で異なる場合があります(例: GitHub"}
                {"\n"}
                {"              "}
                {"Copilotは200K閾値という報告)。"}
                <strong>{"API直と他社経由で料金帯の仕様が違う"}</strong>
                {"前提で確認します。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"          "}
            </ul>
            {"\n"}
            {"          "}
            <h3 id="sec-7-4">{"6-D. 処理ティア"}</h3>
            {"\n"}
            {"          "}
            <div className={[styles["table-wrap"]].join(" ")}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"ティア"}</th>
                    <th>{"指定"}</th>
                    <th>{"特徴"}</th>
                    <th>{"注意"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"Standard"}</td>
                    <td>
                      {"指定なし("}
                      <code>{"default"}</code>
                      {")"}
                    </td>
                    <td>{"既定"}</td>
                    <td>{"-"}</td>
                  </tr>
                  <tr>
                    <td>{"Fast mode"}</td>
                    <td>
                      <code>{'service_tier: "priority"'}</code>
                    </td>
                    <td>{"優先処理(旧Priority processingの改称)"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {
                        "AstraのFastにはレイテンシSLAなし。EUデータ所在地はSol/Lunaで対応、Astraは非対応"
                      }
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Ultrafast mode"}</td>
                    <td>
                      <code>{'service_tier: "ultrafast"'}</code>
                    </td>
                    <td>{"出力トークン間の時間を短縮。Responses APIで利用"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"別枠のレート上限。Astraは標準単価の約6倍課金の報告。6.1"}
                      {"\n"}
                      {"                    "}
                      {"SolのUltrafastは米国・EU・グローバル処理に対応"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Batch / Flex"}</td>
                    <td>{"各ガイド参照"}</td>
                    <td>{"非同期・低優先で割安"}</td>
                    <td>{"即時性が不要な処理向け"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={[styles["code-block"]].join(" ")} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={[styles["code-head"]].join(" ")}>
                {"\n"}
                {"              "}
                <span className={[styles["code-lang"]].join(" ")}>{"Python"}</span>
                <button type="button" className={[styles["copy-btn"]].join(" ")} data-copy-code>
                  {"コピー"}
                </button>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <pre>
                <code className={["language-python"].join(" ")}>
                  <div className={styles.codeLine}>
                    {"prompt = "}
                    <span className="hljs-string">
                      {'"この関数の名前をより分かりやすく変えてください。"'}
                    </span>
                    {"  "}
                    <span className="hljs-comment">{"# 入力(例)"}</span>
                    {"\n"}
                    {"\n"}
                    {"fast = client.responses.create("}
                    {"\n"}
                    {"    "}
                    {"model="}
                    <span className="hljs-string">{'"gpt-6.1-sol"'}</span>
                    {","}
                    {"\n"}
                    {"    "}
                    <span className="hljs-built_in">{"input"}</span>
                    {"=prompt,"}
                    {"\n"}
                    {"    "}
                    {"service_tier="}
                    <span className="hljs-string">{'"ultrafast"'}</span>
                    {",   "}
                    <span className="hljs-comment">{"# 対話・高速なコーディング反復向け"}</span>
                    {"\n"}
                    {")"}
                    {"\n"}
                  </div>
                </code>
              </pre>
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
                {"ツール呼び出しが多いワークフローは、"}
                <strong>{"WebSocket上のResponses API"}</strong>
                {"でターン間のオーバーヘッドを減らすことをOpenAIが推奨しています。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"Ultrafastは"}
                <strong>{"生成速度"}</strong>
                {
                  "を上げるもので、モデルの推論能力は変わりません。周辺のワークフロー(ツール待ち、人の確認)がボトルネックのままだと体感は伸びません。"
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
          <section className={[styles.section].join(" ")} id="sec-8">
            {"\n"}
            {"          "}
            <div className={[styles["sec-head"]].join(" ")}>
              {"\n"}
              {"            "}
              <span className={[styles.eyebrow].join(" ")}>{"STEP 7"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-8-heading">{"移行チェックリスト"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-8-1">{"7-A. 移行フロー"}</h3>
            {"\n"}
            {"          "}
            <figure className={[styles["diagram-card"]].join(" ")}>
              {"\n"}
              {"            "}
              <div className={[styles["diagram-wrap"]].join(" ")}>
                <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="d6">
                  <MermaidDiagram chart={DIAGRAM_6} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <h3 id="sec-8-2">{"7-B. 項目別チェック"}</h3>
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
                    <th>{"やること"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"1"}</td>
                    <td>{"モデルID"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <code>{"gpt-6-astra"}</code> {"/ "}
                      <code>{"gpt-6.1-sol"}</code> {"/"}
                      {"\n"}
                      {"                    "}
                      <code>{"gpt-6-luna"}</code> {"のいずれかに設定"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"2"}</td>
                    <td>{"API"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"Astra / 6.1 Sol のツール呼び出しは Responses API へ(Chat"}
                      {"\n"}
                      {"                    "}
                      {"Completionsは不可)。Luna は "}
                      <code>{'reasoning_effort: "none"'}</code> {"のときのみ"}
                      {"\n"}
                      {"                    "}
                      {"Chat Completions で関数呼び出し可(Step 2)"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"3"}</td>
                    <td>{"エフォート"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"現行値を保持。Astra/6.1 Solで "}
                      <code>{"none"}</code> {"は "}
                      <code>{"low"}</code> {"へ、"}
                      <code>{"minimal"}</code>
                      {"\n"}
                      {"                    "}
                      {"も "}
                      <code>{"low"}</code> {"から比較"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"4"}</td>
                    <td>{"サンプリング"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"エフォートが "}
                      <code>{"none"}</code> {"以外なら "}
                      <code>{"temperature"}</code> {"/"}
                      {"\n"}
                      {"                    "}
                      <code>{"top_p"}</code> {"/ "}
                      <code>{"top_logprobs"}</code> {"を削除"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"5"}</td>
                    <td>{"キャッシュ"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <code>{"prompt_cache_retention"}</code> {"→"}
                      {"\n"}
                      {"                    "}
                      <code>{"prompt_cache_options.ttl"}</code>
                      {"。書き込み課金を確認"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"6"}</td>
                    <td>{"承認の停止"}</td>
                    <td>
                      {"不要な確認で止まる場合は、自律性・承認境界のプロンプトを見直す(Step 4)"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"7"}</td>
                    <td>{"データ所在地"}</td>
                    <td>{"AstraのFastはEU非対応。要件と突き合わせる"}</td>
                  </tr>
                  <tr>
                    <td>{"8"}</td>
                    <td>{"ユーザー識別"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"エンドユーザー向けなら、安定でプライバシーに配慮した"}
                      {"\n"}
                      {"                    "}
                      <code>{"safety_identifier"}</code> {"を送る"}
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
            <h3 id="sec-8-3">{"7-C. GPT-6 Sol → GPT-6.1 Sol の落とし穴"}</h3>
            {"\n"}
            {"          "}
            <p>
              {
                "「1行置換で価格も同じ」に見えますが、コミュニティの検証記事は次の点を挙げています。"
              }
            </p>
            {"\n"}
            {"          "}
            <ul>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <code>{"none"}</code> {"/ "}
                <code>{"minimal"}</code> {"エフォートが使えない(6"}
                {"\n"}
                {"              "}
                {"Solでは動いていたコードが落ちる)"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>{"ツール呼び出しはResponses APIが必須"}</li>
              {"\n"}
              {"            "}
              <li>{"暗黙キャッシュの挙動(ブレークポイントの置き方)の違い"}</li>
              {"\n"}
              {"            "}
              <li>{"6.1 Solは持続性が高く、長く走る傾向がある(コストと時間の見積りを更新)"}</li>
              {"\n"}
              {"            "}
              <li>{"Ultrafast・Fastとデータ所在地の組み合わせに制約がある"}</li>
              {"\n"}
              {"          "}
            </ul>
            {"\n"}
            {"          "}
            <h3 id="sec-8-4">{"7-D. Codexでの自動移行"}</h3>
            {"\n"}
            {"          "}
            <p>{"公式は、OpenAI Docsスキルを使ったCodexでの機械的な移行を案内しています。"}</p>
            {"\n"}
            {"          "}
            <p>
              {"Codex に入力するプロンプト例(シェルでは実行しません。OpenAI Docsスキルが必要):"}
            </p>
            {"\n"}
            {"          "}
            <div className={[styles["code-block"]].join(" ")} data-testid="code-block">
              {"\n"}
              {"            "}
              <div className={[styles["code-head"]].join(" ")}>
                {"\n"}
                {"              "}
                <span className={[styles["code-lang"]].join(" ")}>{"Text"}</span>
                <button type="button" className={[styles["copy-btn"]].join(" ")} data-copy-code>
                  {"コピー"}
                </button>
                {"\n"}
                {"            "}
              </div>
              {"\n"}
              {"            "}
              <pre>
                <code className={["language-plaintext"].join(" ")}>
                  <div className={styles.codeLine}>
                    {"$openai-docs migrate this project to the GPT-6 model family"}
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
              {"なお、旧世代を使い続ける場合も、"}
              <strong>{"GPT-5.6には11月に価格引き上げが予定されている"}</strong>
              {"(Simon"}
              {"\n"}
              {"            "}
              {"Willisonの記事による)ため、コスト試算を更新してください。"}
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"        "}
          </section>
          {"\n"}
          {"        "}
          <section className={[styles.section].join(" ")} id="sec-9">
            {"\n"}
            {"          "}
            <div className={[styles["sec-head"]].join(" ")}>
              {"\n"}
              {"            "}
              <span className={[styles.eyebrow].join(" ")}>{"STEP 8"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-9-heading">{"評価と安全性を運用に組み込む"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-9-1">{"8-A. 評価ループ"}</h3>
            {"\n"}
            {"          "}
            <figure className={[styles["diagram-card"]].join(" ")}>
              {"\n"}
              {"            "}
              <div className={[styles["diagram-wrap"]].join(" ")}>
                <div className={[styles["diagram-canvas"]].join(" ")} data-diagram-id="d7">
                  <MermaidDiagram chart={DIAGRAM_7} theme="base" themeVariables={THEME} />
                </div>
              </div>
              {"\n"}
              {"          "}
            </figure>
            {"\n"}
            {"          "}
            <p>{"測る指標(最低限):"}</p>
            {"\n"}
            {"          "}
            <div className={[styles["table-wrap"]].join(" ")}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"指標"}</th>
                    <th>{"理由"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"タスク成功率"}</td>
                    <td>{"品質の主指標"}</td>
                  </tr>
                  <tr>
                    <td>{"完全性・必須の根拠・引用の有無"}</td>
                    <td>{"最終回答の抜けを検出"}</td>
                  </tr>
                  <tr>
                    <td>{"総トークン(入力 / 推論 / 出力 / キャッシュ)"}</td>
                    <td>{"コスト構造の把握"}</td>
                  </tr>
                  <tr>
                    <td>{"レイテンシ(最初のトークン、総所要時間)"}</td>
                    <td>{"体験の把握"}</td>
                  </tr>
                  <tr>
                    <td>{"ツール呼び出し回数・再試行・ターン数"}</td>
                    <td>{"効率の把握"}</td>
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
                {
                  "「呼び出し回数やターン数が減った」は、最終回答が品質基準を満たす場合に限り改善と数える。"
                }
              </strong>
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"          "}
            <h3 id="sec-9-2">{"8-B. 安全性の運用"}</h3>
            {"\n"}
            {"          "}
            <div className={[styles["table-wrap"]].join(" ")}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"論点"}</th>
                    <th>{"公式・報告ベースの要点"}</th>
                    <th>{"実装での対応"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"指示階層"}</td>
                    <td>
                      {"2026年10月更新のGPT-6 Sol/Lunaは指示階層評価でほぼ飽和(99.99% / 99.79%)"}
                    </td>
                    <td>{"システム指示とユーザー指示の役割を分けて設計する"}</td>
                  </tr>
                  <tr>
                    <td>{"プロンプトインジェクション"}</td>
                    <td>{"高い頑健性が報告されている"}</td>
                    <td>
                      {"それでも外部コンテンツは"}
                      <strong>{"データとして扱う"}</strong>
                      {"境界を維持する"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"過剰な拒否・注意書き"}</td>
                    <td>{"無害な依頼への拒否や余計な注意書きは減少"}</td>
                    <td>{"製品として必要な注意だけを自前で付ける"}</td>
                  </tr>
                  <tr>
                    <td>{"誤作動監視"}</td>
                    <td>{"Astraは非同期でミスアラインメントを監視し、必要時にアラートを出す"}</td>
                    <td>{"監視アラートの扱いを運用フローに組み込む"}</td>
                  </tr>
                  <tr>
                    <td>{"高リスク領域の分類器"}</td>
                    <td>{"サイバー・生物の誤用検知で、ブロックや生成の一時停止が起こりうる"}</td>
                    <td>{"正当な防御・研究用途は、公式の信頼アクセス情報を確認"}</td>
                  </tr>
                  <tr>
                    <td>{"ユーザー識別"}</td>
                    <td>
                      {"エンドユーザー向けは "}
                      <code>{"safety_identifier"}</code> {"を推奨"}
                    </td>
                    <td>{"安定した匿名ID(ハッシュ化など)を付与"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-9-3">
              {"\n"}
              {"            "}
              {"8-C. Codex・エージェント運用の整理術(Eric Provencher / OpenAI開発者ブログ)"}
              {"\n"}
              {"          "}
            </h3>
            {"\n"}
            {"          "}
            <ol>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <strong>{"Skillsの説明は短く"}</strong>
                {
                  "、「いつ使うか」を明確に。「データベース関連なら常に」のような広い書き方は避け、「マイグレーションを追加・変更するとき」のように限定する。"
                }
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"Skillは"}
                <strong>{"段階的開示"}</strong>
                {"にする。ルート文書は最小の振り分け役にして、詳細は別ファイルやスクリプトへ。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"手順を細かく縛る"}
                <strong>{"レシピ型の指示は見直す"}</strong>
                {"。高性能モデルでは過剰な制約が逆効果になりうる。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                <code>{"AGENTS.md"}</code>
                {"\n"}
                {"              "}
                {"は「作業前に全ドキュメントを読む」ではなく、"}
                <strong>{"用途別に参照先を示す"}</strong>
                {"。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"以前のモデルを抑えるために書いた強い禁止・確認の文言は、Astraでは"}
                <strong>{"効きすぎて"}</strong>
                {"止まることがある。見直す。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {
                  "完了の定義(起動、検査、失敗の修正まで)を依頼に含める。逆に「最初の実装後に必ずレビューで止まる」要件は、早期停止を誘発する。"
                }
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>
                {"\n"}
                {"              "}
                {"安全と分かっている作業(使い捨てフィクスチャのローカルテストなど)は、"}
                <code>{"AGENTS.md"}</code>
                {"\n"}
                {"              "}
                {"で"}
                <strong>{"明示的に許可"}</strong>
                {"を与える。"}
                {"\n"}
                {"            "}
              </li>
              {"\n"}
              {"            "}
              <li>{"整理自体もAstraに依頼し、監査させる。"}</li>
              {"\n"}
              {"          "}
            </ol>
            {"\n"}
            {"        "}
          </section>
          {"\n"}
          {"        "}
          <section className={[styles.section].join(" ")} id="sec-10">
            {"\n"}
            {"          "}
            <div className={[styles["sec-head"]].join(" ")}>
              {"\n"}
              {"            "}
              <span className={[styles.eyebrow].join(" ")}>{"APPENDIX A"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-10-heading">{"著名開発者・コミュニティの知見"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={[styles.callout].join(" ")} data-variant="info">
              {"\n"}
              {"            "}
              <p>
                {"\n"}
                {"              "}
                {"注意:"}
                {"\n"}
                {"              "}
                {
                  "X(旧Twitter)の投稿本体は直接取得できなかったため、ブログ本文または二次要約で確認できた内容に限って記載します。"
                }
                {"\n"}
                {"            "}
              </p>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={[styles["table-wrap"]].join(" ")}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"発信者"}</th>
                    <th>{"内容"}</th>
                    <th>{"実務への示唆"}</th>
                    <th>{"URL"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{"Simon Willison"}</strong>
                      {"(Django共同作者、LLM CLI作者)"}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {
                        "「ペリカン自転車SVG」ベンチをAstraの全エフォート(low〜max)とGPT-5.6の各階層で比較。"
                      }
                      <strong>{"Astraはlowでも5.6 Solの全描画を上回る"}</strong>
                      {"、という観察。maxでは1枚あたり出力12,638トークンで約63セント"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"エフォートはコストが桁で変わる。まず低めで品質を確認する"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://simonwillison.net/2026/Sep/4/astra-pelicans/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"Pelican comparison grid for Astra"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"Simon Willison"}</strong>
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"GPT-6 Sol /"}
                      {"\n"}
                      {"                    "}
                      {"Lunaの価格を整理。"}
                      <strong>{"5.6の半額"}</strong>
                      {"(5.6の販促価格に対して)。AstraとClaude"}
                      {"\n"}
                      {"                    "}
                      {"Fable 5.1は同じ$10 / $50"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"価格戦争が中位帯で起きている。ベンダー比較の再評価時期"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://simonwillison.net/2026/Sep/22/opus-and-sol-and-luna/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"Claude Opus 5.5, GPT-6 Sol, GPT-6 Luna, and a new price war"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"Simon Willison"}</strong>
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"ChatGPT"}
                      {"\n"}
                      {"                    "}
                      {
                        "WorkでAstra(Max)に「自宅から5K/10Kのコース」を依頼。27分でGPX・GeoJSON・HTML地図を生成。ただし"
                      }
                      <strong>{"圧縮(compaction)後に実行コードが取り出せず"}</strong>
                      {"、これを「反機能」と批判"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"圧縮前の履歴を保存し、エージェントが読み戻せる設計にする"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://ai-tldr.dev/releases/simonw-astra-running-routes-sep12/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"二次要約: AI/TLDR"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"Eric Provencher"}</strong>
                      {"(OpenAI開発者ブログ著者)"}
                    </td>
                    <td>
                      {"Skills・"}
                      <code>{"AGENTS.md"}</code>
                      {"・タスクプロンプトの棚卸し指針(Step 8-C)"}
                    </td>
                    <td>{"指示の肥大化がAstraでは性能低下と停止の原因になる"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"Rethinking skills and prompts for GPT-6 Astra"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"OpenAI開発者ブログ"}</strong>
                    </td>
                    <td>{"保守作業での6.1 Sol対Astra比較(1件あたりコスト)"}</td>
                    <td>{"検出漏れの種類は異なる。重要な監査は併用も検討"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/blog/maintaining-software-with-the-gpt-6-family"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"Maintaining software with the GPT-6 family"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"minimaxir(Hacker Newsのユーザー名)ほか"}</strong>
                      {"(HN上のコメント)"}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"6.1"}
                      {"\n"}
                      {"                    "}
                      {"Solの発表で重要なのは"}
                      <strong>{"キャッシュ入力が半額"}</strong>
                      {
                        "になった点、という指摘。Codexでは400K・1Mのコンテキストも使えるが、一定量超過は2倍課金の指摘"
                      }
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"長時間エージェントはキャッシュ単価が支配的"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://news.ycombinator.com/item?id=49896586"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"Hacker News"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"Latent Space(swyx)とゲスト"}</strong>
                      {"(Ben Davisら)"}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"6.1"}
                      {"\n"}
                      {"                    "}
                      {
                        "Solは「評価が低すぎる」「価格が良い」。サブエージェントの並列実行は、キャッシュ最適化で「大幅に速く」なった(Codexチーム談)"
                      }
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"並列化はモデルのプロンプトで増やせる(「もっと生成して」と指示)"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://finance.biggo.com/podcast/6d84f9c6b690be03"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"Latent Space要約"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"Latent Space AINews"}</strong>
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"Astra発表時の整理。Responses"}
                      {"\n"}
                      {"                    "}
                      {
                        "APIの非同期関数呼び出し・途中介入・エフォート変更(@reach_vb、@nikunjhandaの発信)。外部評価でAstraは5.6"
                      }
                      {"\n"}
                      {"                    "}
                      {"Solより"}
                      <strong>{"約70%トークン効率が高い"}</strong>
                      {"など"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"公式主張と独立計測を区別して読む"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://www.latent.space/p/ainews-gpt-6-astra-openais-biggest"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"AINews"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"Endor Labs"}</strong>
                    </td>
                    <td>{"Codex上のセキュリティ評価で6.1 SolはAstraとほぼ同等、約3分の1高速"}</td>
                    <td>{"セキュアコーディング用途の根拠データ"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://www.endorlabs.com/learn/gpt-6-1-sol-on-codex-astra-level-security-a-third-faster-zero-cheating"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"Endor Labs"}
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
          <section className={[styles.section].join(" ")} id="sec-11">
            {"\n"}
            {"          "}
            <div className={[styles["sec-head"]].join(" ")}>
              {"\n"}
              {"            "}
              <span className={[styles.eyebrow].join(" ")}>{"APPENDIX B"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-11-heading">{"よくある落とし穴 FAQ"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={[styles["table-wrap"]].join(" ")}>
              {"\n"}
              {"            "}
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
                    <td>{"6.1 Solに替えたら400エラー"}</td>
                    <td>
                      <code>{"none"}</code> {"/ "}
                      <code>{"minimal"}</code> {"エフォートを指定している"}
                    </td>
                    <td>
                      <code>{"low"}</code> {"に置換して再評価"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"温度指定でエラー"}</td>
                    <td>
                      {"推論あり("}
                      <code>{"none"}</code>
                      {"以外)では "}
                      <code>{"temperature"}</code> {"等が非対応"}
                    </td>
                    <td>{"パラメータを削除"}</td>
                  </tr>
                  <tr>
                    <td>{"ツール付きでChat Completionsが失敗"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"ツール呼び出しは原則Responses API必須。ただし "}
                      <code>{"gpt-6-sol"}</code> {"/"}
                      {"\n"}
                      {"                    "}
                      <code>{"gpt-6-luna"}</code> {"は "}
                      <code>{'reasoning_effort: "none"'}</code> {"のときのみChat"}
                      {"\n"}
                      {"                    "}
                      {"Completionsで関数呼び出し可"}
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {"上記以外はResponses APIへ移行(該当モデルは "}
                      <code>{"reasoning_effort"}</code> {"を"}
                      {"\n"}
                      {"                    "}
                      <code>{'"none"'}</code> {"に設定)"}
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"すぐ確認を求めて止まる"}</td>
                    <td>{"Astraは必要時に質問する傾向。過去の強い禁止文言が効きすぎ"}</td>
                    <td>{"権限と完了条件を明記し、過去の禁止文言を緩める"}</td>
                  </tr>
                  <tr>
                    <td>{"小さな修正で大量のテストを走らせる"}</td>
                    <td>{"Astraは検証が徹底的"}</td>
                    <td>{"検証の強度を指示"}</td>
                  </tr>
                  <tr>
                    <td>{"気づくと料金が倍近くに"}</td>
                    <td>{"入力が272Kを超え、全体が長文料金に"}</td>
                    <td>{"圧縮・検索で絞る。サブエージェントの文脈肥大も確認"}</td>
                  </tr>
                  <tr>
                    <td>{"キャッシュが効かない"}</td>
                    <td>{"先頭部分が毎回変わる、エフォートをリクエストレベルで変更している"}</td>
                    <td>
                      {"先頭を固定し、"}
                      <code>{"configuration_update"}</code> {"を使う。Diagnosticsで確認"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Fast / Ultrafastが期待通りにならない"}</td>
                    <td>{"データ所在地の制約(EUなど)でStandardに落ちる"}</td>
                    <td>{"実際に提供されたティアの課金・速度を確認"}</td>
                  </tr>
                  <tr>
                    <td>{"回答が箇条書きだらけ"}</td>
                    <td>{"Astraは書式を多用する傾向"}</td>
                    <td>{"文体・構造の指示を明記"}</td>
                  </tr>
                  <tr>
                    <td>{"圧縮後に過去のコードが追えない"}</td>
                    <td>{"圧縮で履歴が失われる"}</td>
                    <td>{"圧縮前の記録を別に保存"}</td>
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
          <section className={[styles.section].join(" ")} id="sec-12">
            {"\n"}
            {"          "}
            <div className={[styles["sec-head"]].join(" ")}>
              {"\n"}
              {"            "}
              <span className={[styles.eyebrow].join(" ")}>{"APPENDIX C"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-12-heading">{"情報の確度と注意点"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <div className={[styles["table-wrap"]].join(" ")}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"項目"}</th>
                    <th>{"状況"}</th>
                    <th>{"取り扱い"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"Astraの価格"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {
                        "複数の情報源で $10 / $50 / キャッシュ$1 が一致。1つの比較サイトのみ別の値を表示"
                      }
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"公式Pricingで確認。外れ値は不採用"}</td>
                  </tr>
                  <tr>
                    <td>{"Astraの長文料金($20 / $75)"}</td>
                    <td>{"1つの解説記事のみ"}</td>
                    <td>{"公式Pricingで要確認"}</td>
                  </tr>
                  <tr>
                    <td>{"Ultrafastの倍率(約6倍)"}</td>
                    <td>{"Vercelの更新情報(Astra向け)の記載"}</td>
                    <td>{"6.1 Solの倍率は公式Pricingで確認"}</td>
                  </tr>
                  <tr>
                    <td>{"6.1 SolのUltrafast"}</td>
                    <td>{"発表当初は「近日」との記事がある一方、10月8日のChangelogで提供開始"}</td>
                    <td>{"Changelogを正とする"}</td>
                  </tr>
                  <tr>
                    <td>{"GPT-5.6の価格"}</td>
                    <td>{"ソースにより値が異なる(販促価格・通常価格の混在)"}</td>
                    <td>{"本ガイドでは数値を採用しない"}</td>
                  </tr>
                  <tr>
                    <td>{"GPT-6 Pro(ChatGPT)"}</td>
                    <td>{"トラッカー記載。API設計にそのまま適用できるか不明"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      {
                        "API側の設定は未確認。公式ドキュメントで確認できるまで、APIの基準設定として扱わない"
                      }
                      {"\n"}
                      {"                  "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"「GPT-6 Luna Decisions」・Decisions API"}</td>
                    <td>{"一覧情報とドキュメント目次で存在を確認できたが、詳細は未確認"}</td>
                    <td>{"利用前に公式の Decisions API ガイドを確認"}</td>
                  </tr>
                  <tr>
                    <td>{"ベンチマークの数値"}</td>
                    <td>{"公式主張と独立計測が混在"}</td>
                    <td>{"自分の評価セットで再現してから採用"}</td>
                  </tr>
                  <tr>
                    <td>{"ChatGPTのプラン別提供"}</td>
                    <td>{"情報源により更新時期が異なる"}</td>
                    <td>{"公式の最新情報で確認"}</td>
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
          <section className={[styles.section].join(" ")} id="sec-13">
            {"\n"}
            {"          "}
            <div className={[styles["sec-head"]].join(" ")}>
              {"\n"}
              {"            "}
              <span className={[styles.eyebrow].join(" ")}>{"REFERENCES"}</span>
              {"\n"}
              {"            "}
              <h2 id="sec-13-heading">{"参考URL一覧(根拠ソース)"}</h2>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-13-1">{"公式ドキュメント・公式ブログ"}</h3>
            {"\n"}
            {"          "}
            <div className={[styles["table-wrap"]].join(" ")}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"#"}</th>
                    <th>{"タイトル"}</th>
                    <th>{"URL"}</th>
                    <th>{"根拠にした内容"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"1"}</td>
                    <td>{"Using GPT-6(OpenAI API)"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/api/docs/guides/latest-model"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://developers.openai.com/api/docs/guides/latest-model"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>
                      {"モデル構成、エフォート対応、移行手順、プロンプト指針、GPT-5.6の新機能"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"2"}</td>
                    <td>{"API Changelog"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/api/docs/changelog"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://developers.openai.com/api/docs/changelog"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"リリース日、Ultrafast、6.1 Sol、Multi-agent(β)"}</td>
                  </tr>
                  <tr>
                    <td>{"3"}</td>
                    <td>{"Rethinking skills and prompts for GPT-6 Astra"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra"
                        }
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"Skills・AGENTS.mdの棚卸し"}</td>
                  </tr>
                  <tr>
                    <td>{"4"}</td>
                    <td>{"Maintaining software with the GPT-6 family"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/blog/maintaining-software-with-the-gpt-6-family"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://developers.openai.com/blog/maintaining-software-with-the-gpt-6-family"
                        }
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"6.1 SolとAstraの1件あたりコスト比較"}</td>
                  </tr>
                  <tr>
                    <td>{"5"}</td>
                    <td>{"GPT-6 Sol and GPT-6 Luna: October 2026 update"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://deploymentsafety.openai.com/gpt-6-october"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://deploymentsafety.openai.com/gpt-6-october"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"指示階層・プロンプトインジェクション・拒否傾向の評価"}</td>
                  </tr>
                  <tr>
                    <td>{"6"}</td>
                    <td>{"Prompt caching"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/api/docs/guides/prompt-caching"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://developers.openai.com/api/docs/guides/prompt-caching"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"キャッシュ設計(公式)"}</td>
                  </tr>
                  <tr>
                    <td>{"7"}</td>
                    <td>{"Reasoning(エフォート・Proモード・途中変更)"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/api/docs/guides/reasoning"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://developers.openai.com/api/docs/guides/reasoning"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>
                      <code>{"configuration_update"}</code> {"の正確な仕様"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"8"}</td>
                    <td>{"Ultrafast mode"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/api/docs/guides/ultrafast-mode"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://developers.openai.com/api/docs/guides/ultrafast-mode"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"高速ティアの仕様"}</td>
                  </tr>
                  <tr>
                    <td>{"9"}</td>
                    <td>{"Fast mode"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/api/docs/guides/fast-mode"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://developers.openai.com/api/docs/guides/fast-mode"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"Fast modeの仕様"}</td>
                  </tr>
                  <tr>
                    <td>{"10"}</td>
                    <td>{"Async tool calling"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/api/docs/guides/async-tool-calling"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://developers.openai.com/api/docs/guides/async-tool-calling"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"非同期ツール呼び出し"}</td>
                  </tr>
                  <tr>
                    <td>{"11"}</td>
                    <td>{"Mid-turn steering"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/api/docs/guides/steering"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://developers.openai.com/api/docs/guides/steering"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"途中介入"}</td>
                  </tr>
                  <tr>
                    <td>{"12"}</td>
                    <td>{"Programmatic tool calling"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling"
                        }
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"PTCの使い分け"}</td>
                  </tr>
                  <tr>
                    <td>{"13"}</td>
                    <td>{"Multi-agent"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/api/docs/guides/responses-multi-agent"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://developers.openai.com/api/docs/guides/responses-multi-agent"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"マルチエージェント(β)"}</td>
                  </tr>
                  <tr>
                    <td>{"14"}</td>
                    <td>{"Safety best practices"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/api/docs/guides/safety-best-practices"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://developers.openai.com/api/docs/guides/safety-best-practices"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>
                      <code>{"safety_identifier"}</code>
                    </td>
                  </tr>
                  <tr>
                    <td>{"15"}</td>
                    <td>{"Pricing"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/api/docs/pricing"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://developers.openai.com/api/docs/pricing"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"最新料金(必ず確認)"}</td>
                  </tr>
                  <tr>
                    <td>{"16"}</td>
                    <td>{"Evaluation best practices"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/api/docs/guides/evaluation-best-practices"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://developers.openai.com/api/docs/guides/evaluation-best-practices"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"評価設計"}</td>
                  </tr>
                  <tr>
                    <td>{"17"}</td>
                    <td>{"Cost optimization"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://developers.openai.com/api/docs/guides/cost-optimization"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://developers.openai.com/api/docs/guides/cost-optimization"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"コスト最適化"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-13-2">{"著名開発者・計測者・コミュニティ"}</h3>
            {"\n"}
            {"          "}
            <div className={[styles["table-wrap"]].join(" ")}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"#"}</th>
                    <th>{"発信者"}</th>
                    <th>{"URL"}</th>
                    <th>{"内容"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"18"}</td>
                    <td>{"Simon Willison"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://simonwillison.net/2026/Sep/4/astra-pelicans/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://simonwillison.net/2026/Sep/4/astra-pelicans/"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"Astraのエフォート別比較"}</td>
                  </tr>
                  <tr>
                    <td>{"19"}</td>
                    <td>{"Simon Willison"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://simonwillison.net/2026/Sep/5/introducing-gpt-6-astra-for-developers/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://simonwillison.net/2026/Sep/5/introducing-gpt-6-astra-for-developers/"
                        }
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"Astra紹介動画へのコメント"}</td>
                  </tr>
                  <tr>
                    <td>{"20"}</td>
                    <td>{"Simon Willison"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://simonwillison.net/2026/Sep/22/opus-and-sol-and-luna/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://simonwillison.net/2026/Sep/22/opus-and-sol-and-luna/"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"価格整理"}</td>
                  </tr>
                  <tr>
                    <td>{"21"}</td>
                    <td>{"Simon Willison(二次要約)"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://ai-tldr.dev/releases/simonw-astra-running-routes-sep12/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://ai-tldr.dev/releases/simonw-astra-running-routes-sep12/"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"圧縮でコードが失われた事例"}</td>
                  </tr>
                  <tr>
                    <td>{"22"}</td>
                    <td>{"Latent Space"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://www.latent.space/p/ainews-gpt-6-astra-openais-biggest"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://www.latent.space/p/ainews-gpt-6-astra-openais-biggest"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"Astra発表の整理"}</td>
                  </tr>
                  <tr>
                    <td>{"23"}</td>
                    <td>{"Latent Space(ポッドキャスト要約)"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://finance.biggo.com/podcast/6d84f9c6b690be03"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://finance.biggo.com/podcast/6d84f9c6b690be03"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"6.1 Solの評価、サブエージェント"}</td>
                  </tr>
                  <tr>
                    <td>{"24"}</td>
                    <td>{"Hacker News"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://news.ycombinator.com/item?id=49896586"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://news.ycombinator.com/item?id=49896586"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"6.1 Solの発表への開発者コメント"}</td>
                  </tr>
                  <tr>
                    <td>{"25"}</td>
                    <td>{"Endor Labs"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://www.endorlabs.com/learn/gpt-6-1-sol-on-codex-astra-level-security-a-third-faster-zero-cheating"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://www.endorlabs.com/learn/gpt-6-1-sol-on-codex-astra-level-security-a-third-faster-zero-cheating"
                        }
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"セキュリティ評価"}</td>
                  </tr>
                </tbody>
              </table>
              {"\n"}
              {"          "}
            </div>
            {"\n"}
            {"          "}
            <h3 id="sec-13-3">{"実装情報・価格・ベンチマーク解説(補助)"}</h3>
            {"\n"}
            {"          "}
            <div className={[styles["table-wrap"]].join(" ")}>
              {"\n"}
              {"            "}
              <table>
                <thead>
                  <tr>
                    <th>{"#"}</th>
                    <th>{"提供元"}</th>
                    <th>{"URL"}</th>
                    <th>{"内容"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"26"}</td>
                    <td>{"LiteLLM"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://docs.litellm.ai/blog/gpt_6_sol_luna"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://docs.litellm.ai/blog/gpt_6_sol_luna"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"Sol / Lunaの価格表(短文・長文)、1.05M・922K入力・128K出力"}</td>
                  </tr>
                  <tr>
                    <td>{"27"}</td>
                    <td>{"LiteLLM"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://docs.litellm.ai/docs/providers/openai/ultrafast"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://docs.litellm.ai/docs/providers/openai/ultrafast"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"Fast / Ultrafastの実装例"}</td>
                  </tr>
                  <tr>
                    <td>{"28"}</td>
                    <td>{"Vercel"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://vercel.com/changelog/openai-ultrafast-mode-now-available-on-ai-gateway"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://vercel.com/changelog/openai-ultrafast-mode-now-available-on-ai-gateway"
                        }
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"Ultrafastの課金倍率・データ所在地"}</td>
                  </tr>
                  <tr>
                    <td>{"29"}</td>
                    <td>{"OpenRouter"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://openrouter.ai/docs/cookbook/evaluate-and-optimize/model-migrations/gpt-6"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://openrouter.ai/docs/cookbook/evaluate-and-optimize/model-migrations/gpt-6"
                        }
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>
                      {"移行チェックリスト、"}
                      <code>{"configuration_update"}</code>
                    </td>
                  </tr>
                  <tr>
                    <td>{"30"}</td>
                    <td>{"DataCamp"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://www.datacamp.com/blog/gpt-6-1-sol"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://www.datacamp.com/blog/gpt-6-1-sol"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"6.1 Solの価格・タスクあたりコスト"}</td>
                  </tr>
                  <tr>
                    <td>{"31"}</td>
                    <td>{"The Next Web"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://thenextweb.com/news/openai-gpt-6-1-sol-price-astra-devday"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://thenextweb.com/news/openai-gpt-6-1-sol-price-astra-devday"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"DevDay発表の価格・ベンチマーク"}</td>
                  </tr>
                  <tr>
                    <td>{"32"}</td>
                    <td>{"Codersera"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://codersera.com/blog/gpt-6-1-sol-complete-guide-2026/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://codersera.com/blog/gpt-6-1-sol-complete-guide-2026/"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"長文料金の比較表"}</td>
                  </tr>
                  <tr>
                    <td>{"33"}</td>
                    <td>{"DEV Community(AIHubMix)"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://dev.to/aihubmix/migrating-to-gpt-61-sol-9-things-that-can-go-wrong-1ff1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://dev.to/aihubmix/migrating-to-gpt-61-sol-9-things-that-can-go-wrong-1ff1"
                        }
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"6 Sol→6.1 Solの落とし穴"}</td>
                  </tr>
                  <tr>
                    <td>{"34"}</td>
                    <td>{"Kingy AI"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://kingy.ai/blog/gpt-6-1-sol-ultrafast-speed-pricing-value/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://kingy.ai/blog/gpt-6-1-sol-ultrafast-speed-pricing-value/"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"Ultrafastの実測"}</td>
                  </tr>
                  <tr>
                    <td>{"35"}</td>
                    <td>{"Remio"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://www.remio.ai/post/openai-gpt-6-1-sol-ultrafast-cuts-latency-but-moves-the-bottleneck"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          "https://www.remio.ai/post/openai-gpt-6-1-sol-ultrafast-cuts-latency-but-moves-the-bottleneck"
                        }
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"Ultrafastのボトルネック考察"}</td>
                  </tr>
                  <tr>
                    <td>{"36"}</td>
                    <td>{"Requesty"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://www.requesty.ai/blog/gpt-6-sol-luna-pricing-release-api"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://www.requesty.ai/blog/gpt-6-sol-luna-pricing-release-api"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"Sol / Lunaの価格"}</td>
                  </tr>
                  <tr>
                    <td>{"37"}</td>
                    <td>{"DataLearner"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://www.datalearner.com/en/ai-models/pretrained-models/gpt-6-astra"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://www.datalearner.com/en/ai-models/pretrained-models/gpt-6-astra"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"Astraの仕様(コンテキスト・カットオフ)"}</td>
                  </tr>
                  <tr>
                    <td>{"38"}</td>
                    <td>{"Releasebot"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://releasebot.io/updates/openai"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://releasebot.io/updates/openai"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"10月のリリースノート(GPT-Live-1.1、Codex更新)"}</td>
                  </tr>
                  <tr>
                    <td>{"39"}</td>
                    <td>{"GitHub(openai/codex)"}</td>
                    <td>
                      {"\n"}
                      {"                    "}
                      <a
                        href="https://github.com/openai/codex/issues/32486"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"https://github.com/openai/codex/issues/32486"}
                      </a>
                      {"\n"}
                      {"                  "}
                    </td>
                    <td>{"長文料金帯に入りやすい事例(GPT-5.6)"}</td>
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
          <div className={[styles.closing].join(" ")}>
            {"\n"}
            {"          "}
            <span className={[styles.eyebrow].join(" ")}>{"POINT"}</span>
            {"\n"}
            {"          "}
            <p>
              {"\n"}
              {"            "}
              {
                "世代交代は速く、数値は動きます。このガイドの核は、「(1)用途ごとにモデルを分ける、(2)エフォートは計測で決める、(3)プロンプトは薄く境界は明確に、(4)キャッシュと272K境界を意識する、(5)評価ループを先に作る」の5点です。各数値は、公式Pricingと自分の評価セットで再確認してから採用してください。"
              }
              {"\n"}
              {"          "}
            </p>
            {"\n"}
            {"        "}
          </div>
          {"\n"}
          {"        "}
          <footer className={[styles.footer].join(" ")}>
            {"\n"}
            {"          "}
            {"調査基準日: 2026年10月23日。価格・仕様は公式ドキュメントで必ず再確認してください。"}
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
