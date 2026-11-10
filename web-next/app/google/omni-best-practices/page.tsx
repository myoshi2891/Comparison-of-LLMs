import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import { findBySlug } from "@/lib/page-registry";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";
export const metadata: Metadata = {
  title: "Gemini Omni 実践ガイド:中級〜上級者向けステップバイステップ・ベストプラクティス",
  description:
    "Gemini Omni Flash のモデル選定、動画生成・編集・拡張、プロンプト、コスト設計、信頼性・安全性・地域制約を学ぶ中級〜上級ガイド。情報基準日2026-11-05。",
};
const DIAGRAM_0 =
  'flowchart LR\n    A["入力<br/>テキスト / 画像 / 音声 / 動画"] --> B["Gemini Omni Flash<br/>any-to-any ファミリーの第1弾"]\n    B --> C["出力<br/>音声付き動画<br/>1回あたり最大10秒"]\n    C --> D["シーン拡張<br/>10秒単位で累計40秒"]\n    B -.-> E["今後の計画<br/>画像・音声出力 / Omni Pro"]';
const DIAGRAM_1 =
  'flowchart TD\n    S["動画生成の要件が発生"] --> Q1{"既存動画の部分編集や<br/>会話での反復が必要?"}\n    Q1 -->|はい| O["Omni 1.1 Flash を採用"]\n    Q1 -->|いいえ| Q2{"既存の本番パイプラインが<br/>Veo 3.1 前提?"}\n    Q2 -->|はい| V["Veo 3.1 を継続<br/>移行は段階的に検証"]\n    Q2 -->|いいえ| Q3{"複数の参照素材で<br/>人物や物の一貫性が重要?"}\n    Q3 -->|はい| O\n    Q3 -->|いいえ| AB["同一プロンプトで<br/>Omni と Veo 3.1 を A/B 比較"]';
const DIAGRAM_2 =
  'flowchart LR\n    A["1 構造を決める<br/>単一ショットか複数カットか"] --> B["2 被写体と動き"]\n    B --> C["3 カメラとライティング"]\n    C --> D["4 音を指定する<br/>台詞は引用符"]\n    D --> E["5 不要要素を文中で禁止"]';
const DIAGRAM_3 =
  'flowchart TD\n    A["手元の素材は?"] --> B{"素材の種類"}\n    B -->|"テキストのみ"| T["text_to_video"]\n    B -->|"画像1枚を動かす"| I["image_to_video<br/>FIRST_FRAME"]\n    B -->|"始点と終点の2枚"| F["先頭と末尾フレームの補間"]\n    B -->|"人物・物・画風の参照"| R["reference_to_video<br/>IMAGE_REF / VIDEO_REF"]\n    B -->|"既存動画を直したい"| E["edit<br/>短い指示で変更"]\n    B -->|"続きを作りたい"| X["extend<br/>末尾に追加"]';
const DIAGRAM_4 =
  'flowchart TD\n    A["Turn 1 生成<br/>保存を有効にする"] --> B["interaction.id を保存"]\n    B --> C["Turn 2 以降<br/>previous_interaction_id + 短い編集指示"]\n    C --> D{"結果は意図通り?"}\n    D -->|はい| E["採用 または 次の編集へ"]\n    D -->|いいえ| F["指示を 1動詞+1対象 に絞る<br/>Keep everything else the same を付ける"]\n    F --> C\n    E --> G["最終版は URI 配信で保存"]';
const DIAGRAM_5 =
  'flowchart TD\n    A["ストーリーボードとプロンプト案"] --> B["360p ドラフト<br/>約1/3コスト・最大60%高速"]\n    B --> C{"構図・動き・音は合格?"}\n    C -->|いいえ| D["プロンプトを修正"]\n    D --> B\n    C -->|はい| E["720p 以上で本番生成"]\n    E --> F{"尺が足りない?"}\n    F -->|はい| G["10秒単位で拡張<br/>累計40秒まで"]\n    F -->|いいえ| H["QA チェック"]\n    G --> H\n    H --> I["配信 SynthID は付いたまま"]';
const DIAGRAM_6 =
  'flowchart TD\n    P["期待と違う出力"] --> Q1{"勝手にカットが入る?"}\n    Q1 -->|はい| A1["single continuous shot と<br/>no scene cuts を明記"]\n    Q1 -->|いいえ| Q2{"編集で余計な所まで変わる?"}\n    Q2 -->|はい| A2["指示を短くし<br/>Keep everything else the same を付ける"]\n    Q2 -->|いいえ| Q3{"音が不要または不自然?"}\n    Q3 -->|はい| A3["No dialogue や音楽の種類を具体指定"]\n    Q3 -->|いいえ| Q4{"モードを誤認している?"}\n    Q4 -->|はい| A4["task パラメータで明示<br/>最後の手段"]\n    Q4 -->|いいえ| A5["参照素材のタグ付けと<br/>上限を確認"]';
const THEME_VARS = {
  fontSize: "16px",
  fontFamily: '"Noto Sans JP",sans-serif',
  primaryColor: "#e8ecf8",
  primaryBorderColor: "#3b4a9c",
  primaryTextColor: "#1f2430",
  lineColor: "#5b6178",
  tertiaryColor: "#faf7f0",
} as const;
export default function Page() {
  const entry = findBySlug("/google/omni-best-practices");
  return (
    <div id="omni-guide" className={styles.root}>
      <TocObserver />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Source+Serif+4:wght@600;700&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"
      />
      <button
        id="omni-menu"
        className={styles["menu-btn"]}
        type="button"
        aria-label="目次を開く"
        aria-expanded="false"
        aria-controls="omni-sidebar"
      >
        目次
      </button>
      <button
        id="omni-backdrop"
        className={styles.scrim}
        type="button"
        aria-label="目次を閉じる"
        tabIndex={-1}
      />
      <div className={styles.layout} data-testid="layout-root">
        {" "}
        <nav
          className={styles.sidebar}
          id="omni-sidebar"
          aria-label="目次"
          data-testid="sidebar-nav"
        >
          {" "}
          <div className={styles.brand}>
            {"Gemini Omni"}
            <br />
            {"実践ガイド"}
          </div>{" "}
          <a
            className={[styles["nav-a"], styles.active].join(" ")}
            href="#sec-0"
            aria-current="location"
            data-testid="sidebar-nav-link"
          >
            <span className={styles["n-dot"]}></span>
            <span>{"0. このガイドの前提(必ず最初に読む)"}</span>
          </a>
          <a className={styles["nav-a"]} href="#sec-1" data-testid="sidebar-nav-link">
            <span className={styles["n-dot"]}></span>
            <span>{"1. Omni を 5 分で理解する"}</span>
          </a>
          <a className={styles["nav-a"]} href="#sec-2" data-testid="sidebar-nav-link">
            <span className={styles["n-dot"]}></span>
            <span>{"Step 1: モデル選定(Omni か Veo 3.1 か)"}</span>
          </a>
          <a className={styles["nav-a"]} href="#sec-3" data-testid="sidebar-nav-link">
            <span className={styles["n-dot"]}></span>
            <span>{"Step 2: 環境準備と最小実装"}</span>
          </a>
          <a className={styles["nav-a"]} href="#sec-4" data-testid="sidebar-nav-link">
            <span className={styles["n-dot"]}></span>
            <span>{"Step 3: 出力パラメータの制御"}</span>
          </a>
          <a className={styles["nav-a"]} href="#sec-5" data-testid="sidebar-nav-link">
            <span className={styles["n-dot"]}></span>
            <span>{"Step 4: プロンプト設計の原則"}</span>
          </a>
          <a className={styles["nav-a"]} href="#sec-6" data-testid="sidebar-nav-link">
            <span className={styles["n-dot"]}></span>
            <span>{"Step 5: 入力モードの使い分け"}</span>
          </a>
          <a className={styles["nav-a"]} href="#sec-7" data-testid="sidebar-nav-link">
            <span className={styles["n-dot"]}></span>
            <span>{"Step 6: 対話型の動画編集"}</span>
          </a>
          <a className={styles["nav-a"]} href="#sec-8" data-testid="sidebar-nav-link">
            <span className={styles["n-dot"]}></span>
            <span>{"Step 7: シーン拡張で最大 40 秒へ"}</span>
          </a>
          <a className={styles["nav-a"]} href="#sec-9" data-testid="sidebar-nav-link">
            <span className={styles["n-dot"]}></span>
            <span>{"Step 8: コスト設計とドラフト運用"}</span>
          </a>
          <a className={styles["nav-a"]} href="#sec-10" data-testid="sidebar-nav-link">
            <span className={styles["n-dot"]}></span>
            <span>{"Step 9: 本番運用(信頼性・安全性・地域制約)"}</span>
          </a>
          <a className={styles["nav-a"]} href="#sec-11" data-testid="sidebar-nav-link">
            <span className={styles["n-dot"]}></span>
            <span>{"既知の制約まとめ"}</span>
          </a>
          <a className={styles["nav-a"]} href="#sec-12" data-testid="sidebar-nav-link">
            <span className={styles["n-dot"]}></span>
            <span>{"アンチパターン集"}</span>
          </a>
          <a className={styles["nav-a"]} href="#sec-13" data-testid="sidebar-nav-link">
            <span className={styles["n-dot"]}></span>
            <span>{"導入チェックリスト"}</span>
          </a>
          <a className={styles["nav-a"]} href="#sec-14" data-testid="sidebar-nav-link">
            <span className={styles["n-dot"]}></span>
            <span>{"補足: 追加ベストプラクティスと根拠ソース URL"}</span>
          </a>
          <a className={styles["nav-a"]} href="#sec-15" data-testid="sidebar-nav-link">
            <span className={styles["n-dot"]}></span>
            <span>{"情報の確度と更新方針"}</span>
          </a>{" "}
        </nav>{" "}
        <main className={styles.main}>
          {" "}
          <header className={styles.hero}>
            <div className={styles.heroDates} data-testid="hero-dates">
              最終確認日: <time dateTime={entry?.lastReviewed}>{entry?.lastReviewed}</time>公開日:{" "}
              <time dateTime={entry?.addedAt}>{entry?.addedAt}</time>
            </div>{" "}
            <h1>
              {"Gemini Omni 実践ガイド:中級〜上級者向けステップバイステップ・ベストプラクティス"}
            </h1>{" "}
            <ul>
              {" "}
              <li>
                {" "}
                <strong>{"対象読者"}</strong>
                {
                  ": 動画生成 API / 生成メディアのプロダクト実装経験がある中級〜上級の開発者・AIエンジニア "
                }
              </li>{" "}
              <li>
                <strong>{"調査時点"}</strong>
                {": 2026年11月5日までの公開情報(執筆日 2026-11-06)"}
              </li>{" "}
              <li>
                {" "}
                <strong>{"対象モデル"}</strong>
                {": Gemini Omni Flash("}
                <code>{"gemini-omni-1.1-flash"}</code>
                {") "}
              </li>{" "}
              <li>
                {" "}
                <strong>{"注意"}</strong>
                {
                  ": 数値・仕様は公開ドキュメントの記載を整理したものです。品質面の主張はベンダー発表を含むため、必ず自分のタスクで再評価してください。 "
                }
              </li>{" "}
            </ul>{" "}
          </header>{" "}
          <section className={styles.section} id="sec-0">
            {" "}
            <h2 id="omni-heading-0">{"0. このガイドの前提(必ず最初に読む)"}</h2>{" "}
            <div className={styles.prose}>
              {" "}
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
                      <td>{"表記の補正"}</td>
                      <td>
                        {"依頼文の「Googlei」は "}
                        <strong>{"Google"}</strong>
                        {" と解釈しました。"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Omni の正体"}</td>
                      <td>
                        {" Gemini Omni は "}
                        <strong>
                          {
                            "「何を入力しても動画を出力する」any-to-any 型の生成メディアモデルファミリー"
                          }
                        </strong>
                        {"です。テキスト・画像・音声・動画を入力し、現時点の出力は "}
                        <strong>{"音声付き動画"}</strong>
                        {"です。 "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"混同しやすい点"}</td>
                      <td>
                        {
                          " Google の最新フラッグシップ推論 LLM は別モデル(Gemini 4 Argon)です。Omni は LLM ではなく "
                        }
                        <strong>{"動画の生成・編集モデル"}</strong>
                        {"です。 "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"情報の確度"}</td>
                      <td>
                        {
                          " 一次情報(Google 公式ドキュメント・公式ブログ)を軸にし、報道・サードパーティ情報は "
                        }
                        <strong>{"二次情報"}</strong>
                        {"として明記します。筆者の推論は「推論」と書きます。 "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"独立ベンチマーク"}</td>
                      <td>
                        {
                          " Omni 1.1 Flash について、公開リーダーボード上の独立ベンチマークは調査時点で確認できませんでした。品質面の優位性の主張は "
                        }
                        <strong>{"ベンダー側の発表"}</strong>
                        {"として扱ってください。 "}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="sec-1">
            {" "}
            <h2 id="omni-heading-1">{"1. Omni を 5 分で理解する"}</h2>{" "}
            <div className={styles.prose}>
              {" "}
              <h3 id="omni-heading-2">{"1.1 一言でいうと"}</h3>{" "}
              <p>
                {" Omni は、Veo(動画)・Imagen(画像)・別系統の音声といった "}
                <strong>{"分離されたスタック"}</strong>
                {"を 1 つの Gemini ベースのモデルに集約し、"}
                <strong>{"モダリティをまたいで推論したうえで動画を出力する"}</strong>
                {
                  "モデルです。「動画版 Nano Banana」と紹介されることが多く、会話で少しずつ直していく "
                }
                <strong>{"対話型編集"}</strong>
                {"が中核機能です。 "}
              </p>{" "}
              <h3 id="omni-heading-3">{"1.2 公式ドキュメントが挙げる 3 つの中核能力"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"能力"}</th>
                      <th>{"意味"}</th>
                      <th>{"実装への含意"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"ネイティブ・マルチモーダル"}</td>
                      <td>{"テキスト・画像・音声・動画を同時に処理し、整合性の高い出力を作る"}</td>
                      <td>{"参照素材を足すほど制御しやすいが、タグで役割を明示する必要がある"}</td>
                    </tr>
                    <tr>
                      <td>{"対話型編集"}</td>
                      <td>{"Interactions API で「ここだけ直して」を繰り返せる"}</td>
                      <td>
                        {"状態は "}
                        <code>{"previous_interaction_id"}</code>
                        {" で引き継ぐ"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"世界知識"}</td>
                      <td>{"物理の理解に Gemini の歴史・科学・文化の知識を組み合わせる"}</td>
                      <td>{"説明的・物語的なカットでも破綻しにくい設計(ただし検証は必須)"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="omni-heading-4">{"1.3 位置づけ"}</h3>{" "}
              <div className={styles["diagram-card"]}>
                {" "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="0">
                    <MermaidDiagram chart={DIAGRAM_0} theme="base" themeVariables={THEME_VARS} />
                  </div>
                </div>{" "}
              </div>{" "}
              <h3 id="omni-heading-5">{"1.4 タイムライン"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"日付"}</th>
                      <th>{"出来事"}</th>
                      <th>{"確度"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"2026-05-19"}</td>
                      <td>
                        {
                          " Google I/O 2026 で Omni を発表。第1弾の Omni Flash が Gemini アプリ・Flow・YouTube Shorts で提供開始。1 回 10 秒の上限は「モデルの限界ではなく展開上の判断」と説明された "
                        }
                      </td>
                      <td>{"報道(TechCrunch 等)"}</td>
                    </tr>
                    <tr>
                      <td>{"2026-06-30"}</td>
                      <td>{"開発者向けに Gemini API でプレビュー公開"}</td>
                      <td>{"二次情報+Google DeepMind 所属開発者の投稿"}</td>
                    </tr>
                    <tr>
                      <td>{"2026-08-27"}</td>
                      <td>
                        {" "}
                        <strong>{"Omni 1.1 Flash が一般提供(GA)"}</strong>
                        {"。モデル ID は "}
                        <code>{"gemini-omni-1.1-flash"}</code>
                        {
                          "。シーン拡張・先頭/末尾フレーム指定・360p ドラフト・1080p/4K 出力・動画参照が追加 "
                        }
                      </td>
                      <td>{"公式ブログ+公式料金ページ"}</td>
                    </tr>
                    <tr>
                      <td>{"2026-09-30"}</td>
                      <td>
                        {"プレビュー用 ID("}
                        <code>{"gemini-omni-flash-preview"}</code>
                        {")の廃止日(最短)"}
                      </td>
                      <td>
                        {"二次情報。"}
                        <strong>{"公式の Deprecations ページで要確認"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{"未定"}</td>
                      <td>
                        {" 上位の "}
                        <strong>{"Omni Pro"}</strong>
                        {" は予告のみ。調査時点で提供日は確認できず "}
                      </td>
                      <td>{"報道・二次情報"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="omni-heading-6">{"1.5 提供面(どこで使えるか)"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"提供面"}</th>
                      <th>{"用途"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"Gemini アプリ"}</td>
                      <td>
                        {"一般ユーザー向け。Gemini アプリでは Veo 3.1 に代わる既定の動画モデル"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Google Flow"}</td>
                      <td>{"クリエイター向けスタジオ(Google AI Plus / Pro / Ultra 契約者)"}</td>
                    </tr>
                    <tr>
                      <td>{"YouTube Shorts / YouTube Create"}</td>
                      <td>{"一般ユーザー向けに無料提供と報じられている"}</td>
                    </tr>
                    <tr>
                      <td>{"Google AI Studio / Gemini API"}</td>
                      <td>{"開発者向け(本ガイドの主対象)。有料枠"}</td>
                    </tr>
                    <tr>
                      <td>{"Gemini Enterprise Agent Platform"}</td>
                      <td>{"エンタープライズ向け本番ワークロード"}</td>
                    </tr>
                    <tr>
                      <td>{"サードパーティ"}</td>
                      <td>
                        {
                          " Adobe Firefly、Figma Weave、ComfyUI などが統合(公式ブログ・各社ブログ記載) "
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="sec-2">
            {" "}
            <h2 id="omni-heading-7">{"Step 1: モデル選定(Omni か Veo 3.1 か)"}</h2>{" "}
            <div className={styles.prose}>
              {" "}
              <h3 id="omni-heading-8">{"1.1 公式の既定方針"}</h3>{" "}
              <p>
                {
                  " Gemini API の動画概要ページは **「動画生成の既定は Omni Flash」**としています。理由として、動画の一貫性、複数入力(テキスト・画像・音声・動画)の同時推論、キャラクター一貫性、事実の正確さ、多ターンの対話型編集を挙げています。Veo 3.1 は、レガシーなパイプラインとの統合などが必要な場合の選択肢という位置づけです。 "
                }
              </p>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>{"注意(情報の食い違い)"}</strong>
                  {
                    ": 動画概要ページには、Veo 3.1 の用途として「シーン拡張」「末尾フレーム指定」を挙げる記述が残っています。一方、Omni の公式ページ(2026-09-23 更新)では Omni 1.1 でも "
                  }
                  <strong>{"拡張と先頭/末尾フレーム指定をサポート"}</strong>
                  {"しています。概要ページの記述が古い可能性があるため、"}
                  <strong>{"Omni のページを正"}</strong>
                  {"として扱い、実機で検証してください。 "}
                </p>{" "}
              </blockquote>{" "}
              <h3 id="omni-heading-9">{"1.2 判断フロー"}</h3>{" "}
              <div className={styles["diagram-card"]}>
                {" "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="1">
                    <MermaidDiagram chart={DIAGRAM_1} theme="base" themeVariables={THEME_VARS} />
                  </div>
                </div>{" "}
              </div>{" "}
              <h3 id="omni-heading-10">{"1.3 Omni と Veo 3.1 の比較"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"観点"}</th>
                      <th>{"Gemini Omni 1.1 Flash"}</th>
                      <th>{"Veo 3.1"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"強み"}</td>
                      <td>{"対話型編集・複数入力の推論・参照による一貫性"}</td>
                      <td>
                        {
                          " 専用の動画生成モデル。サードパーティ解説では「写実性の専門家」と評されることが多い(二次情報) "
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{"API 形態"}</td>
                      <td>
                        <strong>{"Interactions API"}</strong>
                      </td>
                      <td>
                        <code>{"generateContent"}</code>
                        {" API"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"出力解像度"}</td>
                      <td>{"360p / 720p(既定)/ 1080p(アップスケール)/ 4K(アップスケール)"}</td>
                      <td>{"4K アップスケールと報じられている(二次情報)"}</td>
                    </tr>
                    <tr>
                      <td>{"編集"}</td>
                      <td>{"会話で反復編集(最重要の差別化点)"}</td>
                      <td>{"会話型の反復編集は公式の訴求点ではない(Omni 側の差別化点)"}</td>
                    </tr>
                    <tr>
                      <td>{"音声"}</td>
                      <td>{"動画と同期した音声を生成。プロンプトで制御"}</td>
                      <td>{"ネイティブ音声あり"}</td>
                    </tr>
                    <tr>
                      <td>{"価格目安"}</td>
                      <td>{"720p で約 $0.10/秒(公式料金ページ)"}</td>
                      <td>{"開発者の投稿では Omni と同水準と言及(Veo 3.1 Fast との比較)"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="sec-3">
            {" "}
            <h2 id="omni-heading-11">{"Step 2: 環境準備と最小実装"}</h2>{" "}
            <div className={styles.prose}>
              {" "}
              <h3 id="omni-heading-12">{"2.1 前提"}</h3>{" "}
              <ul>
                {" "}
                <li>
                  {" "}
                  <strong>{"有料枠が必要"}</strong>
                  {"です。公式料金ページ上、Omni Flash の入出力は無料枠が「Not available」です。 "}
                </li>{" "}
                <li>
                  {" SDK は "}
                  <code>{"google-genai"}</code>
                  {"。呼び出しは "}
                  <strong>{"Interactions API"}</strong>
                  {"("}
                  <code>{"client.interactions.create"}</code>
                  {")です。 "}
                </li>{" "}
                <li>
                  {
                    " Interactions API は 2026 年 5 月に破壊的変更が入っているため、古いサンプルをコピーする前に公式の移行ドキュメントを確認してください(URL は補足に記載)。 "
                  }
                </li>{" "}
              </ul>{" "}
              <pre data-testid="code-block">
                <code className="language-bash hljs">
                  <span className={styles.codeLine}>
                    {"pip install -U google-genai\n"}
                    <span className={"hljs-built_in"}>{"export"}</span>
                    {" GEMINI_API_KEY="}
                    <span className={"hljs-string"}>{'"YOUR_API_KEY"'}</span>
                    {"\n"}
                  </span>
                </code>
              </pre>{" "}
              <h3 id="omni-heading-13">{"2.2 最小実装(text-to-video)"}</h3>{" "}
              <pre data-testid="code-block">
                <code className="language-python hljs">
                  <span className={styles.codeLine}>
                    <span className={"hljs-keyword"}>{"import"}</span>
                    {" base64\n"}
                    <span className={"hljs-keyword"}>{"from"}</span>
                    {" google "}
                    <span className={"hljs-keyword"}>{"import"}</span>
                    {" genai\n\nclient = genai.Client()\nMODEL = "}
                    <span className={"hljs-string"}>{'"gemini-omni-1.1-flash"'}</span>
                    {"\n\n\n"}
                    <span className={"hljs-keyword"}>{"def"}</span>{" "}
                    <span className={["hljs-title", "function_"].join(" ")}>{"save_video"}</span>
                    {"("}
                    <span className={"hljs-params"}>
                      {"interaction, path: "}
                      <span className={"hljs-built_in"}>{"str"}</span>
                    </span>
                    {") -> "}
                    <span className={"hljs-literal"}>{"None"}</span>
                    {":\n    "}
                    <span className={"hljs-string"}>
                      {'"""SDK 専用の便利フィールド output_video から mp4 を保存する。"""'}
                    </span>
                    {"\n    "}
                    <span className={"hljs-keyword"}>{"with"}</span>{" "}
                    <span className={"hljs-built_in"}>{"open"}</span>
                    {"(path, "}
                    <span className={"hljs-string"}>{'"wb"'}</span>
                    {") "}
                    <span className={"hljs-keyword"}>{"as"}</span>
                    {
                      " f:\n        f.write(base64.b64decode(interaction.output_video.data))\n\n\ninteraction = client.interactions.create(\n    model=MODEL,\n    "
                    }
                    <span className={"hljs-built_in"}>{"input"}</span>
                    {"=(\n        "}
                    <span className={"hljs-string"}>
                      {
                        '"Continuous, unbroken handheld shot of a tabby cat on a sunny windowsill, "'
                      }
                    </span>
                    {"\n        "}
                    <span className={"hljs-string"}>
                      {
                        '"looking into a leafy garden. Sound design: gentle breeze, distant birds. "'
                      }
                    </span>
                    {"\n        "}
                    <span className={"hljs-string"}>{'"No dialogue."'}</span>
                    {"\n    ),\n)\nsave_video(interaction, "}
                    <span className={"hljs-string"}>{'"cat.mp4"'}</span>
                    {")\n"}
                    <span className={"hljs-built_in"}>{"print"}</span>
                    {"("}
                    <span className={"hljs-string"}>{'"interaction id:"'}</span>
                    {", interaction."}
                    <span className={"hljs-built_in"}>{"id"}</span>
                    {")  "}
                    <span className={"hljs-comment"}>{"# 後続の編集・拡張で使う"}</span>
                    {"\n"}
                  </span>
                </code>
              </pre>{" "}
              <h3 id="omni-heading-14">{"2.3 REST で直接呼ぶ場合の注意"}</h3>{" "}
              <p>
                {" "}
                <code>{"interaction.output_video"}</code>
                {" は "}
                <strong>{"SDK 専用の便利フィールド"}</strong>
                {"です。REST では、レスポンスの "}
                <code>{"steps"}</code>
                {" 配列から "}
                <code>{"type"}</code>
                {" が "}
                <code>{"model_output"}</code>
                {" のステップを探し、その "}
                <code>{"content"}</code>
                {" 内の "}
                <code>{'type: "video"'}</code>
                {" を取り出します。 "}
              </p>{" "}
              <pre data-testid="code-block">
                <code className="language-json hljs">
                  <span className={styles.codeLine}>
                    <span className={"hljs-punctuation"}>{"{"}</span>
                    {"\n  "}
                    <span className={"hljs-attr"}>{'"steps"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-punctuation"}>{"["}</span>
                    {"\n    "}
                    <span className={"hljs-punctuation"}>{"{"}</span>{" "}
                    <span className={"hljs-attr"}>{'"type"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-string"}>{'"user_input"'}</span>
                    <span className={"hljs-punctuation"}>{","}</span>{" "}
                    <span className={"hljs-attr"}>{'"content"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-punctuation"}>{"["}</span>
                    <span className={"hljs-punctuation"}>{"{"}</span>{" "}
                    <span className={"hljs-attr"}>{'"type"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-string"}>{'"text"'}</span>
                    <span className={"hljs-punctuation"}>{","}</span>{" "}
                    <span className={"hljs-attr"}>{'"text"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-string"}>{'"..."'}</span>{" "}
                    <span className={"hljs-punctuation"}>{"}"}</span>
                    <span className={"hljs-punctuation"}>{"]"}</span>{" "}
                    <span className={"hljs-punctuation"}>{"}"}</span>
                    <span className={"hljs-punctuation"}>{","}</span>
                    {"\n    "}
                    <span className={"hljs-punctuation"}>{"{"}</span>{" "}
                    <span className={"hljs-attr"}>{'"type"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-string"}>{'"thought"'}</span>
                    <span className={"hljs-punctuation"}>{","}</span>{" "}
                    <span className={"hljs-attr"}>{'"content"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-punctuation"}>{"["}</span>
                    <span className={"hljs-punctuation"}>{"{"}</span>{" "}
                    <span className={"hljs-attr"}>{'"text"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-string"}>{'"..."'}</span>
                    <span className={"hljs-punctuation"}>{","}</span>{" "}
                    <span className={"hljs-attr"}>{'"type"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-string"}>{'"thought"'}</span>{" "}
                    <span className={"hljs-punctuation"}>{"}"}</span>
                    <span className={"hljs-punctuation"}>{"]"}</span>{" "}
                    <span className={"hljs-punctuation"}>{"}"}</span>
                    <span className={"hljs-punctuation"}>{","}</span>
                    {"\n    "}
                    <span className={"hljs-punctuation"}>{"{"}</span>
                    {"\n      "}
                    <span className={"hljs-attr"}>{'"type"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-string"}>{'"model_output"'}</span>
                    <span className={"hljs-punctuation"}>{","}</span>
                    {"\n      "}
                    <span className={"hljs-attr"}>{'"content"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-punctuation"}>{"["}</span>
                    <span className={"hljs-punctuation"}>{"{"}</span>{" "}
                    <span className={"hljs-attr"}>{'"type"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-string"}>{'"video"'}</span>
                    <span className={"hljs-punctuation"}>{","}</span>{" "}
                    <span className={"hljs-attr"}>{'"mime_type"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-string"}>{'"video/mp4"'}</span>
                    <span className={"hljs-punctuation"}>{","}</span>{" "}
                    <span className={"hljs-attr"}>{'"data"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-string"}>{'"<base64>"'}</span>{" "}
                    <span className={"hljs-punctuation"}>{"}"}</span>
                    <span className={"hljs-punctuation"}>{"]"}</span>
                    {"\n    "}
                    <span className={"hljs-punctuation"}>{"}"}</span>
                    {"\n  "}
                    <span className={"hljs-punctuation"}>{"]"}</span>
                    <span className={"hljs-punctuation"}>{","}</span>
                    {"\n  "}
                    <span className={"hljs-attr"}>{'"id"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-string"}>{'"v1_..."'}</span>
                    <span className={"hljs-punctuation"}>{","}</span>
                    {"\n  "}
                    <span className={"hljs-attr"}>{'"status"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-string"}>{'"completed"'}</span>
                    <span className={"hljs-punctuation"}>{","}</span>
                    {"\n  "}
                    <span className={"hljs-attr"}>{'"model"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-string"}>{'"gemini-omni-1.1-flash"'}</span>
                    <span className={"hljs-punctuation"}>{","}</span>
                    {"\n  "}
                    <span className={"hljs-attr"}>{'"object"'}</span>
                    <span className={"hljs-punctuation"}>{":"}</span>{" "}
                    <span className={"hljs-string"}>{'"interaction"'}</span>
                    {"\n"}
                    <span className={"hljs-punctuation"}>{"}"}</span>
                    {"\n"}
                  </span>
                </code>
              </pre>{" "}
              <h3 id="omni-heading-15">{"2.4 動作確認の観点"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"確認項目"}</th>
                      <th>{"期待"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>{"interaction.id"}</code>
                        {" が取得できる"}
                      </td>
                      <td>{"以降の編集・拡張の起点になる"}</td>
                    </tr>
                    <tr>
                      <td>{"mp4 が再生でき、音声トラックがある"}</td>
                      <td>{"既定で適切な音声が生成される"}</td>
                    </tr>
                    <tr>
                      <td>{"意図しないカット割りがない"}</td>
                      <td>{"入っていたら Step 4 の「単一ショット指定」を適用"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="sec-4">
            {" "}
            <h2 id="omni-heading-16">{"Step 3: 出力パラメータの制御"}</h2>{" "}
            <div className={styles.prose}>
              {" "}
              <h3 id="omni-heading-17">{"3.1 アスペクト比・解像度・配信方式"}</h3>{" "}
              <p>
                {" "}
                <code>{"response_format"}</code>
                {" で制御します。"}
                <code>{'type: "video"'}</code>
                {" は省略可能です。 "}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"パラメータ"}</th>
                      <th>{"値"}</th>
                      <th>{"備考"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>{"aspect_ratio"}</code>
                      </td>
                      <td>
                        <code>{'"16:9"'}</code>
                        {"(既定)/ "}
                        <code>{'"9:16"'}</code>
                      </td>
                      <td>
                        {"縦動画は "}
                        <code>{"9:16"}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"resolution"}</code>
                      </td>
                      <td>
                        {" "}
                        <code>{'"360p"'}</code>
                        {" / "}
                        <code>{'"720p"'}</code>
                        {"(既定)/ "}
                        <code>{'"1080p"'}</code>
                        {" / "}
                        <code>{'"4k"'}</code>{" "}
                      </td>
                      <td>
                        {"1080p と 4K は "}
                        <strong>{"アップスケール出力"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"delivery"}</code>
                      </td>
                      <td>
                        <code>{'"uri"'}</code>
                      </td>
                      <td>{"4MB 超の動画は URI 配信を使う"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <pre data-testid="code-block">
                <code className="language-python hljs">
                  <span className={styles.codeLine}>
                    {"interaction = client.interactions.create(\n    model=MODEL,\n    "}
                    <span className={"hljs-built_in"}>{"input"}</span>
                    {"="}
                    <span className={"hljs-string"}>
                      {'"A futuristic city with neon lights and flying cars, cyberpunk style"'}
                    </span>
                    {",\n    response_format={\n        "}
                    <span className={"hljs-string"}>{'"type"'}</span>
                    {": "}
                    <span className={"hljs-string"}>{'"video"'}</span>
                    {",\n        "}
                    <span className={"hljs-string"}>{'"aspect_ratio"'}</span>
                    {": "}
                    <span className={"hljs-string"}>{'"9:16"'}</span>
                    {",\n        "}
                    <span className={"hljs-string"}>{'"resolution"'}</span>
                    {": "}
                    <span className={"hljs-string"}>{'"1080p"'}</span>
                    {",\n    },\n)\n"}
                  </span>
                </code>
              </pre>{" "}
              <h3 id="omni-heading-18">{"3.2 大きな動画は URI 配信で取得する"}</h3>{" "}
              <p>
                {" 公式の推奨は、"}
                <strong>
                  {"4MB を超える動画(720p 超など)では "}
                  <code>{'delivery="uri"'}</code>
                </strong>
                {" を使うことです。返ってくる Google ホストの URI が "}
                <code>{"ACTIVE"}</code>
                {" になるまでポーリングしてからダウンロードします。 "}
              </p>{" "}
              <pre data-testid="code-block">
                <code className="language-python hljs">
                  <span className={styles.codeLine}>
                    <span className={"hljs-keyword"}>{"import"}</span>
                    {" time\n"}
                    <span className={"hljs-keyword"}>{"from"}</span>
                    {" google "}
                    <span className={"hljs-keyword"}>{"import"}</span>
                    {
                      " genai\n\nclient = genai.Client()\n\ninteraction = client.interactions.create(\n    model="
                    }
                    <span className={"hljs-string"}>{'"gemini-omni-1.1-flash"'}</span>
                    {",\n    "}
                    <span className={"hljs-built_in"}>{"input"}</span>
                    {"="}
                    <span className={"hljs-string"}>
                      {'"A beautiful sunset over a calm ocean."'}
                    </span>
                    {",\n    response_format={"}
                    <span className={"hljs-string"}>{'"type"'}</span>
                    {": "}
                    <span className={"hljs-string"}>{'"video"'}</span>
                    {", "}
                    <span className={"hljs-string"}>{'"delivery"'}</span>
                    {": "}
                    <span className={"hljs-string"}>{'"uri"'}</span>
                    {
                      "},\n)\n\nvideo_output = interaction.output_video\nfile_name = video_output.uri.split("
                    }
                    <span className={"hljs-string"}>{'"/"'}</span>
                    {")[-"}
                    <span className={"hljs-number"}>{"1"}</span>
                    {"]\n\n"}
                    <span className={"hljs-keyword"}>{"while"}</span>{" "}
                    <span className={"hljs-literal"}>{"True"}</span>
                    {":\n    info = client.files.get(name="}
                    <span className={"hljs-string"}>
                      {'f"files/'}
                      <span className={"hljs-subst"}>{"{file_name}"}</span>
                      {'"'}
                    </span>
                    {")\n    "}
                    <span className={"hljs-keyword"}>{"if"}</span>
                    {" info.state.name == "}
                    <span className={"hljs-string"}>{'"ACTIVE"'}</span>
                    {":\n        "}
                    <span className={"hljs-keyword"}>{"break"}</span>
                    {"\n    "}
                    <span className={"hljs-keyword"}>{"if"}</span>
                    {" info.state.name == "}
                    <span className={"hljs-string"}>{'"FAILED"'}</span>
                    {":\n        "}
                    <span className={"hljs-keyword"}>{"raise"}</span>
                    {" RuntimeError("}
                    <span className={"hljs-string"}>{'"Generation failed."'}</span>
                    {")\n    time.sleep("}
                    <span className={"hljs-number"}>{"5"}</span>
                    {")\n\nclient.files.download(file=video_output.uri, destination="}
                    <span className={"hljs-string"}>{'"output.mp4"'}</span>
                    {")\n"}
                  </span>
                </code>
              </pre>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>{"落とし穴"}</strong>
                  {": "}
                  <code>{"GET /v1beta/interactions/{id}"}</code>
                  {" で後から取得すると、最初に "}
                  <code>{'delivery: "uri"'}</code>
                  {" で作成していても "}
                  <strong>{"動画は base64 のインラインデータで返ります"}</strong>
                  {"。"}
                  <code>{"uri"}</code>
                  {" フィールドが確実にあるのは、作成直後のレスポンスか SSE ストリームです。"}
                  <strong>{"作成直後に URI を保存"}</strong>
                  {"してください。 "}
                </p>{" "}
              </blockquote>{" "}
              <h3 id="omni-heading-19">
                {"3.3 同期・非同期と保存設定(速度と編集可否のトレードオフ)"}
              </h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"設定"}</th>
                      <th>{"効果"}</th>
                      <th>{"副作用"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {" "}
                        <code>{"background=false"}</code>
                        {", "}
                        <code>{"store=false"}</code>
                        {", "}
                        <code>{"stream=false"}</code>{" "}
                      </td>
                      <td>{"同期の単発呼び出しで最速になる"}</td>
                      <td>
                        {" "}
                        <strong>
                          <code>{"store=false"}</code>
                          {" だと、その動画は "}
                          <code>{"previous_interaction_id"}</code>
                          {" での後続編集ができない"}
                        </strong>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"既定(保存あり)"}</td>
                      <td>{"後続ターンで編集・拡張できる"}</td>
                      <td>{"同期単発より遅くなる可能性"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" "}
                <strong>{"使い分けの指針"}</strong>
                {": 一発で完結する用途(サムネイル動画など)は "}
                <code>{"store=false"}</code>
                {"。編集・拡張を想定する用途は保存を有効にします。 "}
              </p>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="sec-5">
            {" "}
            <h2 id="omni-heading-20">{"Step 4: プロンプト設計の原則"}</h2>{" "}
            <div className={styles.prose}>
              {" "}
              <p>
                {" 公式プロンプトガイドの要点を、実務で使いやすい形に整理します。"}
                <strong>{"ガイドの原文の列挙ではなく、筆者による再構成"}</strong>
                {"です。 "}
              </p>{" "}
              <h3 id="omni-heading-21">{"4.1 設計の流れ"}</h3>{" "}
              <div className={styles["diagram-card"]}>
                {" "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="2">
                    <MermaidDiagram chart={DIAGRAM_2} theme="base" themeVariables={THEME_VARS} />
                  </div>
                </div>{" "}
              </div>{" "}
              <h3 id="omni-heading-22">{"4.2 原則一覧"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"原則"}</th>
                      <th>{"やること"}</th>
                      <th>{"理由・根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"単一ショットの明示"}</td>
                      <td>{"「single continuous shot」「no scene cuts」などを書く"}</td>
                      <td>
                        {" 既定では "}
                        <strong>{"複数ショットの物語的な構成"}</strong>
                        {" を作ろうとするため(公式) "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"否定はプロンプト内に書く"}</td>
                      <td>{"「No dialogue」「No extra sound effects」"}</td>
                      <td>
                        <strong>{"ネガティブプロンプト用の独立フィールドは無い"}</strong>
                        {"(公式)"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"音は能動的に指定"}</td>
                      <td>{"音楽・環境音・台詞を具体的に書く"}</td>
                      <td>{"既定でも音声は付くが、意図通りとは限らない(公式)"}</td>
                    </tr>
                    <tr>
                      <td>{"時間指定は自然言語で良い"}</td>
                      <td>
                        {"「After 3 seconds, ...」やタイムコード "}
                        <code>{"[0-3s]"}</code>
                      </td>
                      <td>{"厳密な構文は不要。カット割りやリズムの設計に有効(公式)"}</td>
                    </tr>
                    <tr>
                      <td>{"画面内テキストは文字列を明示"}</td>
                      <td>{"看板・ナンバープレートなどの表記を引用符で指定"}</td>
                      <td>{"自然に現れる文字も、定義すると正確に描かれやすい(公式)"}</td>
                    </tr>
                    <tr>
                      <td>{"メタ指示を使う"}</td>
                      <td>{"「micro-detail, expression, timing を重視」など品質観点を伝える"}</td>
                      <td>{"公式ガイドに「meta prompting」として記載"}</td>
                    </tr>
                    <tr>
                      <td>{"英語で書く"}</td>
                      <td>{"指示文は英語で書く"}</td>
                      <td>
                        {" "}
                        <strong>{"英語は完全サポート、他言語は未評価"}</strong>
                        {"で結果にばらつきが出る(公式) "}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="omni-heading-23">{"4.3 推奨テンプレート(筆者案)"}</h3>{" "}
              <p>
                {
                  " 構造化して書くと再現性が上がります。以下は筆者が整理したテンプレートで、公式が定める書式ではありません。 "
                }
              </p>{" "}
              <pre data-testid="code-block">
                <code className="language-yaml hljs">
                  <span className={styles.codeLine}>
                    <span className={"hljs-attr"}>{"Mode:"}</span>{" "}
                    <span className={"hljs-string"}>{"text-to-video"}</span>
                    {"\n"}
                    <span className={"hljs-attr"}>{"Format:"}</span>{" "}
                    <span className={"hljs-number"}>{"9"}</span>
                    <span className={"hljs-string"}>{":16"}</span>{" "}
                    <span className={"hljs-string"}>{"vertical"}</span>{" "}
                    <span className={"hljs-string"}>{"video,"}</span>{" "}
                    <span className={"hljs-number"}>{"10"}</span>{" "}
                    <span className={"hljs-string"}>{"seconds,"}</span>{" "}
                    <span className={"hljs-string"}>{"single"}</span>{" "}
                    <span className={"hljs-string"}>{"continuous"}</span>{" "}
                    <span className={"hljs-string"}>{"shot,"}</span>{" "}
                    <span className={"hljs-literal"}>{"no"}</span>{" "}
                    <span className={"hljs-string"}>{"scene"}</span>{" "}
                    <span className={"hljs-string"}>{"cuts"}</span>
                    {"\n"}
                    <span className={"hljs-attr"}>{"Subject:"}</span>{" "}
                    <span className={"hljs-string"}>{"A"}</span>{" "}
                    <span className={"hljs-string"}>{"barista"}</span>{" "}
                    <span className={"hljs-string"}>{"in"}</span>{" "}
                    <span className={"hljs-string"}>{"a"}</span>{" "}
                    <span className={"hljs-string"}>{"small"}</span>{" "}
                    <span className={"hljs-string"}>{"Tokyo"}</span>{" "}
                    <span className={"hljs-string"}>{"coffee"}</span>{" "}
                    <span className={"hljs-string"}>{"shop,"}</span>{" "}
                    <span className={"hljs-string"}>{"mid-30s,"}</span>{" "}
                    <span className={"hljs-string"}>{"wearing"}</span>{" "}
                    <span className={"hljs-string"}>{"a"}</span>{" "}
                    <span className={"hljs-string"}>{"dark"}</span>{" "}
                    <span className={"hljs-string"}>{"apron"}</span>
                    {"\n"}
                    <span className={"hljs-attr"}>{"Action:"}</span>{" "}
                    <span className={"hljs-string"}>{"She"}</span>{" "}
                    <span className={"hljs-string"}>{"slowly"}</span>{" "}
                    <span className={"hljs-string"}>{"pours"}</span>{" "}
                    <span className={"hljs-string"}>{"steamed"}</span>{" "}
                    <span className={"hljs-string"}>{"milk"}</span>{" "}
                    <span className={"hljs-string"}>{"into"}</span>{" "}
                    <span className={"hljs-string"}>{"a"}</span>{" "}
                    <span className={"hljs-string"}>{"latte,"}</span>{" "}
                    <span className={"hljs-string"}>{"finishing"}</span>{" "}
                    <span className={"hljs-string"}>{"with"}</span>{" "}
                    <span className={"hljs-string"}>{"a"}</span>{" "}
                    <span className={"hljs-string"}>{"leaf"}</span>{" "}
                    <span className={"hljs-string"}>{"pattern"}</span>
                    {"\n"}
                    <span className={"hljs-attr"}>{"Camera:"}</span>{" "}
                    <span className={"hljs-string"}>{"Slow"}</span>{" "}
                    <span className={"hljs-string"}>{"push-in"}</span>{" "}
                    <span className={"hljs-string"}>{"from"}</span>{" "}
                    <span className={"hljs-string"}>{"medium"}</span>{" "}
                    <span className={"hljs-string"}>{"shot"}</span>{" "}
                    <span className={"hljs-string"}>{"to"}</span>{" "}
                    <span className={"hljs-string"}>{"close-up"}</span>{" "}
                    <span className={"hljs-string"}>{"on"}</span>{" "}
                    <span className={"hljs-string"}>{"the"}</span>{" "}
                    <span className={"hljs-string"}>{"cup,"}</span>{" "}
                    <span className={"hljs-string"}>{"shallow"}</span>{" "}
                    <span className={"hljs-string"}>{"depth"}</span>{" "}
                    <span className={"hljs-string"}>{"of"}</span>{" "}
                    <span className={"hljs-string"}>{"field"}</span>
                    {"\n"}
                    <span className={"hljs-attr"}>{"Lighting/Mood:"}</span>{" "}
                    <span className={"hljs-string"}>{"Warm"}</span>{" "}
                    <span className={"hljs-string"}>{"morning"}</span>{" "}
                    <span className={"hljs-string"}>{"window"}</span>{" "}
                    <span className={"hljs-string"}>{"light,"}</span>{" "}
                    <span className={"hljs-string"}>{"calm"}</span>{" "}
                    <span className={"hljs-string"}>{"and"}</span>{" "}
                    <span className={"hljs-string"}>{"cozy"}</span>
                    {"\n"}
                    <span className={"hljs-attr"}>{"Audio:"}</span>{" "}
                    <span className={"hljs-string"}>{"Soft"}</span>{" "}
                    <span className={"hljs-string"}>{"jazz"}</span>{" "}
                    <span className={"hljs-string"}>{"piano"}</span>{" "}
                    <span className={"hljs-string"}>{"in"}</span>{" "}
                    <span className={"hljs-string"}>{"the"}</span>{" "}
                    <span className={"hljs-string"}>{"background,"}</span>{" "}
                    <span className={"hljs-string"}>{"subtle"}</span>{" "}
                    <span className={"hljs-string"}>{"milk-pouring"}</span>{" "}
                    <span className={"hljs-string"}>{"sound"}</span>
                    {"\n"}
                    <span className={"hljs-attr"}>{"Constraints:"}</span>{" "}
                    <span className={"hljs-literal"}>{"No"}</span>{" "}
                    <span className={"hljs-string"}>{"dialogue."}</span>{" "}
                    <span className={"hljs-literal"}>{"No"}</span>{" "}
                    <span className={"hljs-string"}>{"on-screen"}</span>{" "}
                    <span className={"hljs-string"}>{"text."}</span>
                    {"\n"}
                  </span>
                </code>
              </pre>{" "}
              <h3 id="omni-heading-24">{"4.4 タイムコード指定の例"}</h3>{" "}
              <pre data-testid="code-block">
                <code className="language-markdown hljs">
                  <span className={styles.codeLine}>
                    {
                      "[0-3s] A person is walking along a rainy street at night\n[3-6s] They stop and turn toward the camera\n[6-10s] They start running, camera tracking from behind\nAudio: Rain ambience, low synth drone. No dialogue.\n"
                    }
                  </span>
                </code>
              </pre>{" "}
              <h3 id="omni-heading-25">{"4.5 画面内テキストの例"}</h3>{" "}
              <pre data-testid="code-block">
                <code className="language-python hljs">
                  <span className={styles.codeLine}>
                    {"prompt = (\n    "}
                    <span className={"hljs-string"}>
                      {
                        "'One word on screen at a time: \"did, you, know, that, Omni, can, do, text?\" '"
                      }
                    </span>
                    {"\n    "}
                    <span className={"hljs-string"}>
                      {
                        '"Each word appears for 1 second with a different animated style. No dialogue."'
                      }
                    </span>
                    {"\n)\n"}
                  </span>
                </code>
              </pre>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>{"日本語テキストの描画"}</strong>
                  {
                    ": 公式が評価済みとしているのは英語のみです。日本語の看板や字幕を動画内に描かせる用途は、"
                  }
                  <strong>{"必ず事前に品質検証"}</strong>
                  {
                    "し、難しければ後工程(編集ソフト)で重ねる設計にしてください(推論を含む実務上の推奨)。 "
                  }
                </p>{" "}
              </blockquote>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="sec-6">
            {" "}
            <h2 id="omni-heading-26">{"Step 5: 入力モードの使い分け"}</h2>{" "}
            <div className={styles.prose}>
              {" "}
              <h3 id="omni-heading-27">{"5.1 モード選択フロー"}</h3>{" "}
              <div className={styles["diagram-card"]}>
                {" "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="3">
                    <MermaidDiagram chart={DIAGRAM_3} theme="base" themeVariables={THEME_VARS} />
                  </div>
                </div>{" "}
              </div>{" "}
              <h3 id="omni-heading-28">{"5.2 モード別の要点"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"モード"}</th>
                      <th>{"入力"}</th>
                      <th>{"要点"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"text-to-video"}</td>
                      <td>{"テキスト"}</td>
                      <td>{"単一ショット・音・禁止事項を明記"}</td>
                    </tr>
                    <tr>
                      <td>{"image-to-video"}</td>
                      <td>{"画像 + テキスト"}</td>
                      <td>
                        {" 高解像度の画像と、"}
                        <strong>{"具体的な動きの記述"}</strong>
                        {"が有効。「make it move」のような曖昧指示は弱い(公式) "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"先頭/末尾フレーム補間"}</td>
                      <td>{"画像 2 枚 + テキスト"}</td>
                      <td>
                        {"2 枚を "}
                        <code>{"input"}</code>
                        {" に並べ、遷移を記述する"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"subject reference"}</td>
                      <td>{"参照画像 + テキスト"}</td>
                      <td>{"複数の被写体画像(例: 猫と毛糸玉)を組み合わせて 1 本の動画にできる"}</td>
                    </tr>
                    <tr>
                      <td>{"edit"}</td>
                      <td>{"動画 + テキスト"}</td>
                      <td>{"短い指示 + 「他は維持」(Step 6)"}</td>
                    </tr>
                    <tr>
                      <td>{"extend"}</td>
                      <td>{"動画 + テキスト"}</td>
                      <td>{"末尾から最大 10 秒を追加(Step 7)"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="omni-heading-29">
                {"5.3 "}
                <code>{"task"}</code>
                {" パラメータは最後の手段"}
              </h3>{" "}
              <p>
                {" "}
                <code>{"generation_config.video_config.task"}</code>
                {" に "}
                <code>{"text_to_video"}</code>
                {" / "}
                <code>{"image_to_video"}</code>
                {" / "}
                <code>{"reference_to_video"}</code>
                {" / "}
                <code>{"edit"}</code>
                {" / "}
                <code>{"extend"}</code>
                {" を指定できますが、公式は "}
                <strong>
                  {"まずプロンプトで解決し、うまくいかないときだけ "}
                  <code>{"task"}</code>
                  {" で明示"}
                </strong>
                {"することを推奨しています。"}
                <code>{"task"}</code>
                {" を使うと "}
                <strong>{"追加の制約がかかる"}</strong>
                {"ためです。 "}
              </p>{" "}
              <h3 id="omni-heading-30">{"5.4 タグで画像・動画の「役割」を縛る"}</h3>{" "}
              <p>{"素材が複数あるときは、タグで役割を明示します。"}</p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"タグ"}</th>
                      <th>{"意味"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>{"<FIRST_FRAME>"}</code>
                      </td>
                      <td>{"画像を動画の開始フレームにする"}</td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"<LAST_FRAME>"}</code>
                      </td>
                      <td>
                        {"画像を最終フレームにする("}
                        <code>{"<FIRST_FRAME>"}</code>
                        {" と併用が必須)"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"<IMAGE_REF_N>"}</code>
                      </td>
                      <td>{"画像を参照にする(N は 0 から)"}</td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"<VIDEO_REF_N>"}</code>
                      </td>
                      <td>{"動画を人物・物の参照にする(N は 0 から)"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {" "}
                <strong>{"宣言形式(素材が多い・役割が複雑な場合)"}</strong>
                {": プロンプトの先頭で素材を宣言します。 "}
              </p>{" "}
              <pre data-testid="code-block">
                <code className="language-markdown hljs">
                  <span className={styles.codeLine}>
                    {"[# Sources "}
                    <span className={"language-xml"}>
                      <span className={"hljs-tag"}>
                        {"<"}
                        <span className={"hljs-name"}>{"FIRST_FRAME"}</span>
                        {">"}
                      </span>
                    </span>
                    {"@Image1] [# References "}
                    <span className={"language-xml"}>
                      <span className={"hljs-tag"}>
                        {"<"}
                        <span className={"hljs-name"}>{"IMAGE_REF_0"}</span>
                        {">"}
                      </span>
                    </span>
                    {"@Image2]\nA woman "}
                    <span className={"language-xml"}>
                      <span className={"hljs-tag"}>
                        {"<"}
                        <span className={"hljs-name"}>{"IMAGE_REF_0"}</span>
                        {">"}
                      </span>
                    </span>
                    {
                      " is walking along a beach at sunset.\nUse Image1 as the starting frame. Use Image2 as a reference for the video generation.\n"
                    }
                  </span>
                </code>
              </pre>{" "}
              <p>
                <strong>{"末尾に添える誘導文(公式の推奨)"}</strong>
                {":"}
              </p>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"目的"}</th>
                      <th>{"末尾に書く内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"開始フレームとして使う"}</td>
                      <td>{"「Use this image as the starting frame.」"}</td>
                    </tr>
                    <tr>
                      <td>{"ループ動画にする"}</td>
                      <td>{"「Use this image as the first frame and the last frame.」"}</td>
                    </tr>
                    <tr>
                      <td>{"参照画像として使う"}</td>
                      <td>{"「…should not be used as literal initial frames.」の趣旨を書く"}</td>
                    </tr>
                    <tr>
                      <td>{"参照動画として使う"}</td>
                      <td>{"「Do not use them as a source for video editing.」の趣旨を書く"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="omni-heading-31">{"5.5 参照素材の上限と性質"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"項目"}</th>
                      <th>{"公式の記述"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"動画参照"}</td>
                      <td>
                        {" 最大 3 クリップ、各 3 秒まで。参照動画の "}
                        <strong>{"音声は無視される"}</strong>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"動画参照の向き"}</td>
                      <td>{"見た目(顔や外観)の保持に向く"}</td>
                    </tr>
                    <tr>
                      <td>{"音声参照のアップロード"}</td>
                      <td>
                        {"現行 API バージョンでは "}
                        <strong>{"非対応"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{"複数動画をまたぐ推論"}</td>
                      <td>
                        <strong>{"非対応"}</strong>
                        {"(精度低下や予期しない出力の恐れ)"}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="sec-7">
            {" "}
            <h2 id="omni-heading-32">{"Step 6: 対話型の動画編集"}</h2>{" "}
            <div className={styles.prose}>
              {" "}
              <p>
                {" Omni の最大の差別化点です。"}
                <strong>{"1 ターンで 1 つの変更"}</strong>
                {"を積み重ねる設計にします。 "}
              </p>{" "}
              <h3 id="omni-heading-33">{"6.1 状態を持つ編集(生成 → 編集)"}</h3>{" "}
              <pre data-testid="code-block">
                <code className="language-python hljs">
                  <span className={styles.codeLine}>
                    <span className={"hljs-keyword"}>{"import"}</span>
                    {" base64\n"}
                    <span className={"hljs-keyword"}>{"from"}</span>
                    {" google "}
                    <span className={"hljs-keyword"}>{"import"}</span>
                    {" genai\n\nclient = genai.Client()\nMODEL = "}
                    <span className={"hljs-string"}>{'"gemini-omni-1.1-flash"'}</span>
                    {"\n\n"}
                    <span className={"hljs-comment"}>{"# Turn 1: 生成(保存を有効にしておく)"}</span>
                    {"\nres1 = client.interactions.create(model=MODEL, "}
                    <span className={"hljs-built_in"}>{"input"}</span>
                    {"="}
                    <span className={"hljs-string"}>{'"A woman playing violin outdoors."'}</span>
                    {")\n\n"}
                    <span className={"hljs-comment"}>{"# Turn 2: 直前の動画を編集"}</span>
                    {
                      "\nres2 = client.interactions.create(\n    model=MODEL,\n    previous_interaction_id=res1."
                    }
                    <span className={"hljs-built_in"}>{"id"}</span>
                    {",\n    "}
                    <span className={"hljs-built_in"}>{"input"}</span>
                    {"="}
                    <span className={"hljs-string"}>
                      {'"Make the violin invisible. Keep everything else the same."'}
                    </span>
                    {",\n)\n\n"}
                    <span className={"hljs-keyword"}>{"with"}</span>{" "}
                    <span className={"hljs-built_in"}>{"open"}</span>
                    {"("}
                    <span className={"hljs-string"}>{'"edited.mp4"'}</span>
                    {", "}
                    <span className={"hljs-string"}>{'"wb"'}</span>
                    {") "}
                    <span className={"hljs-keyword"}>{"as"}</span>
                    {" f:\n    f.write(base64.b64decode(res2.output_video.data))\n"}
                  </span>
                </code>
              </pre>{" "}
              <h3 id="omni-heading-34">{"6.2 編集のループ設計"}</h3>{" "}
              <div className={styles["diagram-card"]}>
                {" "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="4">
                    <MermaidDiagram chart={DIAGRAM_4} theme="base" themeVariables={THEME_VARS} />
                  </div>
                </div>{" "}
              </div>{" "}
              <h3 id="omni-heading-35">{"6.3 編集プロンプトの 4 原則"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"原則"}</th>
                      <th>{"悪い例"}</th>
                      <th>{"良い例"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"短く書く"}</td>
                      <td>{"詳細に動きを描写した長文で猫を追加"}</td>
                      <td>
                        {" "}
                        <code>
                          {
                            "Add a cat that jumps onto his lap, he begins to pet it. Keep everything else the same."
                          }
                        </code>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"1 回に 1 変更"}</td>
                      <td>{"背景変更と衣装変更を同時に指示"}</td>
                      <td>
                        {"背景 → 衣装と "}
                        <strong>{"ターンを分ける"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{"維持を明示"}</td>
                      <td>{"変更点だけを書く"}</td>
                      <td>
                        {" 末尾に "}
                        <code>{"Keep everything else the same."}</code>
                        {"(公式が推奨する定型句) "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"消去は「見えなくする」"}</td>
                      <td>
                        <code>{"remove the phone and fill the background..."}</code>
                      </td>
                      <td>
                        <code>{"Make the phone invisible. Keep everything else the same."}</code>
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <p>
                {
                  " 公式が示す編集の例は、スタイル変更(アニメ調)、小物の追加、照明の変更、画面内テキストの書き換えなどです。"
                }
                <strong>{"過度に説明的なプロンプトは、意図しない変更を招く"}</strong>
                {"とされています。 "}
              </p>{" "}
              <h3 id="omni-heading-36">{"6.4 自前の動画をアップロードして編集する"}</h3>{" "}
              <p>
                {" Files API でアップロードし、"}
                <code>{"PROCESSING"}</code>
                {" が終わるまで待ってから "}
                <code>{"uri"}</code>
                {" を渡します。 "}
              </p>{" "}
              <pre data-testid="code-block">
                <code className="language-python hljs">
                  <span className={styles.codeLine}>
                    <span className={"hljs-keyword"}>{"import"}</span>
                    {" base64\n"}
                    <span className={"hljs-keyword"}>{"import"}</span>
                    {" time\n"}
                    <span className={"hljs-keyword"}>{"from"}</span>
                    {" google "}
                    <span className={"hljs-keyword"}>{"import"}</span>
                    {" genai\n\nclient = genai.Client()\n\nvideo_file = client.files.upload(file="}
                    <span className={"hljs-string"}>{'"Video.mp4"'}</span>
                    {")\n"}
                    <span className={"hljs-keyword"}>{"while"}</span>
                    {" video_file.state == "}
                    <span className={"hljs-string"}>{'"PROCESSING"'}</span>
                    {":\n    time.sleep("}
                    <span className={"hljs-number"}>{"10"}</span>
                    {")\n    video_file = client.files.get(name=video_file.name)\n\n"}
                    <span className={"hljs-keyword"}>{"if"}</span>
                    {" video_file.state == "}
                    <span className={"hljs-string"}>{'"FAILED"'}</span>
                    {":\n    "}
                    <span className={"hljs-keyword"}>{"raise"}</span>
                    {
                      " ValueError(video_file.state)\n\ninteraction = client.interactions.create(\n    model="
                    }
                    <span className={"hljs-string"}>{'"gemini-omni-1.1-flash"'}</span>
                    {",\n    "}
                    <span className={"hljs-built_in"}>{"input"}</span>
                    {"=[\n        {"}
                    <span className={"hljs-string"}>{'"type"'}</span>
                    {": "}
                    <span className={"hljs-string"}>{'"video"'}</span>
                    {", "}
                    <span className={"hljs-string"}>{'"uri"'}</span>
                    {": video_file.uri},\n        {"}
                    <span className={"hljs-string"}>{'"type"'}</span>
                    {": "}
                    <span className={"hljs-string"}>{'"text"'}</span>
                    {", "}
                    <span className={"hljs-string"}>{'"text"'}</span>
                    {": "}
                    <span className={"hljs-string"}>
                      {'"Change the lighting to be more dramatic. Keep everything else the same."'}
                    </span>
                    {"},\n    ],\n)\n\n"}
                    <span className={"hljs-keyword"}>{"with"}</span>{" "}
                    <span className={"hljs-built_in"}>{"open"}</span>
                    {"("}
                    <span className={"hljs-string"}>{'"edited.mp4"'}</span>
                    {", "}
                    <span className={"hljs-string"}>{'"wb"'}</span>
                    {") "}
                    <span className={"hljs-keyword"}>{"as"}</span>
                    {" f:\n    f.write(base64.b64decode(interaction.output_video.data))\n"}
                  </span>
                </code>
              </pre>{" "}
              <h3 id="omni-heading-37">{"6.5 編集でできないこと"}</h3>{" "}
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
                      <td>{"音声(声)の編集"}</td>
                      <td>
                        <strong>{"非対応"}</strong>
                        {"。台詞を変えたい場合は再生成か別工程で対応"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"入力動画の長さ"}</td>
                      <td>
                        {"アップロード動画は "}
                        <strong>{"10 秒以下"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{"地域"}</td>
                      <td>
                        {" アップロード動画の編集は EEA・スイス・英国では "}
                        <strong>{"提供なし"}</strong>
                        {"(日本は記載なし) "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"人物"}</td>
                      <td>{"特定の識別可能な人物を含む画像のアップロード・編集は非対応"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="sec-8">
            {" "}
            <h2 id="omni-heading-38">{"Step 7: シーン拡張で最大 40 秒へ"}</h2>{" "}
            <div className={styles.prose}>
              {" "}
              <h3 id="omni-heading-39">{"7.1 仕組み"}</h3>{" "}
              <ul>
                {" "}
                <li>
                  {" "}
                  <strong>{"末尾に最大 10 秒"}</strong>
                  {"を連続して追加します(拡張の生成は 3〜10 秒)。 "}
                </li>{" "}
                <li>
                  {" Omni 1.1 では "}
                  <strong>{"直前 10 秒を文脈として参照"}</strong>
                  {
                    "します(旧版は最後の 1 秒のみ)。そのため映像・動き・キャラクター・音の一貫性が上がります。 "
                  }
                </li>{" "}
                <li>
                  {" "}
                  <strong>{"10 秒刻みで、累計 40 秒まで"}</strong>
                  {
                    "拡張できます。入力動画の最後のフレームの一部が、遷移を滑らかにするために編集されます。 "
                  }
                </li>{" "}
              </ul>{" "}
              <h3 id="omni-heading-40">{"7.2 拡張の実装"}</h3>{" "}
              <pre data-testid="code-block">
                <code className="language-python hljs">
                  <span className={styles.codeLine}>
                    <span className={"hljs-keyword"}>{"import"}</span>
                    {" base64\n"}
                    <span className={"hljs-keyword"}>{"from"}</span>
                    {" google "}
                    <span className={"hljs-keyword"}>{"import"}</span>
                    {" genai\n\nclient = genai.Client()\nMODEL = "}
                    <span className={"hljs-string"}>{'"gemini-omni-1.1-flash"'}</span>
                    {"\n\nfirst = client.interactions.create(model=MODEL, "}
                    <span className={"hljs-built_in"}>{"input"}</span>
                    {"="}
                    <span className={"hljs-string"}>
                      {'"A fox runs across a snowy field at dawn."'}
                    </span>
                    {")\n\n"}
                    <span className={"hljs-comment"}>
                      {"# モデル生成動画の続きを作る(多ターン)"}
                    </span>
                    {
                      "\nsecond = client.interactions.create(\n    model=MODEL,\n    previous_interaction_id=first."
                    }
                    <span className={"hljs-built_in"}>{"id"}</span>
                    {",\n    "}
                    <span className={"hljs-built_in"}>{"input"}</span>
                    {"=[{"}
                    <span className={"hljs-string"}>{'"type"'}</span>
                    {": "}
                    <span className={"hljs-string"}>{'"text"'}</span>
                    {", "}
                    <span className={"hljs-string"}>{'"text"'}</span>
                    {": "}
                    <span className={"hljs-string"}>
                      {'"Continue the scene. The music builds."'}
                    </span>
                    {"}],\n    response_format={"}
                    <span className={"hljs-string"}>{'"resolution"'}</span>
                    {": "}
                    <span className={"hljs-string"}>{'"360p"'}</span>
                    {"},  "}
                    <span className={"hljs-comment"}>{"# まずドラフトで確認する"}</span>
                    {"\n)\n\n"}
                    <span className={"hljs-keyword"}>{"with"}</span>{" "}
                    <span className={"hljs-built_in"}>{"open"}</span>
                    {"("}
                    <span className={"hljs-string"}>{'"extended.mp4"'}</span>
                    {", "}
                    <span className={"hljs-string"}>{'"wb"'}</span>
                    {") "}
                    <span className={"hljs-keyword"}>{"as"}</span>
                    {" f:\n    f.write(base64.b64decode(second.output_video.data))\n"}
                  </span>
                </code>
              </pre>{" "}
              <h3 id="omni-heading-41">{"7.3 拡張のプロンプトのコツ"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"目的"}</th>
                      <th>{"書き方の例"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"音を変えたい"}</td>
                      <td>
                        {" 「The music continues into the chorus」のように "}
                        <strong>{"音の変化を明示"}</strong>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"同じシーンか、カットか"}</td>
                      <td>{"「Show the same characters in the next scene」で別シーンへ"}</td>
                    </tr>
                    <tr>
                      <td>{"新キャラ追加"}</td>
                      <td>
                        {" 参照画像・動画を一緒に渡し、"}
                        <code>{"<IMAGE_REF_0>"}</code>
                        {" / "}
                        <code>{"<VIDEO_REF_0>"}</code>
                        {" で参照 "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"時間指定"}</td>
                      <td>
                        {" タイムコードの "}
                        <strong>{"0s は「拡張部分の先頭」"}</strong>
                        {
                          "。10 秒の動画を拡張して「After 2s cut」と書くと、全体では 12 秒地点でカットが入る "
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="omni-heading-42">{"7.4 拡張の制約"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"制約"}</th>
                      <th>{"内容"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"追加位置"}</td>
                      <td>
                        <strong>{"末尾のみ"}</strong>
                        {"。先頭への追加や中間の延長は不可"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"アップロード動画の台詞"}</td>
                      <td>
                        {" 人物が話しているアップロード動画に "}
                        <strong>{"台詞を追加する拡張はできない"}</strong>
                        {"(無言のままか、台詞を足さない指示なら可) "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"モデル生成動画の台詞"}</td>
                      <td>
                        {" 多ターン("}
                        <code>{"previous_interaction_id"}</code>
                        {")での拡張なら台詞・音声の生成が可能 "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"入力長"}</td>
                      <td>{"アップロード動画は 10 秒以下(多ターンの場合は対象外)"}</td>
                    </tr>
                    <tr>
                      <td>{"地域"}</td>
                      <td>
                        {
                          " アップロード動画の拡張は EEA・スイス・英国では提供なし(モデル生成動画の拡張は全提供地域で可) "
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="sec-9">
            {" "}
            <h2 id="omni-heading-43">{"Step 8: コスト設計とドラフト運用"}</h2>{" "}
            <div className={styles.prose}>
              {" "}
              <h3 id="omni-heading-44">{"8.1 料金の事実関係"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
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
                      <td>{"入力"}</td>
                      <td>{"$1.50 / 100 万トークン(テキスト・画像・動画・音声)"}</td>
                      <td>{"公式料金ページ"}</td>
                    </tr>
                    <tr>
                      <td>{"出力(テキスト)"}</td>
                      <td>{"$9.00 / 100 万トークン"}</td>
                      <td>{"公式料金ページ"}</td>
                    </tr>
                    <tr>
                      <td>{"出力(動画)"}</td>
                      <td>
                        {" $17.50 / 100 万トークン。"}
                        <strong>{"720p の動画 1 秒 = 5,792 トークン"}</strong>
                        {"。実効では約 $0.10 / 秒 "}
                      </td>
                      <td>{"公式料金ページ"}</td>
                    </tr>
                    <tr>
                      <td>{"360p"}</td>
                      <td>
                        {"720p の約 3 分の 1 のコスト。"}
                        <strong>{"最大 60% 高速"}</strong>
                      </td>
                      <td>{"公式ブログ"}</td>
                    </tr>
                    <tr>
                      <td>{"1080p / 4K"}</td>
                      <td>
                        {
                          " 報道・再販業者の掲載値は 1080p が約 $0.15 / 秒、4K が約 $0.30 / 秒。公式料金ページには 720p のトークン換算しか見当たらない "
                        }
                      </td>
                      <td>
                        <strong>{"二次情報。購入前に公式で再確認"}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{"無料枠"}</td>
                      <td>{"公式料金ページで入出力は「Not available」"}</td>
                      <td>{"公式料金ページ"}</td>
                    </tr>
                    <tr>
                      <td>{"データ利用"}</td>
                      <td>{"有料枠では「製品改善に利用しない」と記載"}</td>
                      <td>{"公式料金ページ"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="omni-heading-45">{"8.2 見積もり関数(筆者案)"}</h3>{" "}
              <pre data-testid="code-block">
                <code className="language-python hljs">
                  <span className={styles.codeLine}>
                    {"USD_PER_M_VIDEO_TOKENS = "}
                    <span className={"hljs-number"}>{"17.50"}</span>
                    {"   "}
                    <span className={"hljs-comment"}>{"# 公式料金ページ"}</span>
                    {"\nTOKENS_PER_SEC_720P = "}
                    <span className={"hljs-number"}>{"5792"}</span>
                    {"       "}
                    <span className={"hljs-comment"}>{"# 公式料金ページ"}</span>
                    {"\n"}
                    <span className={"hljs-comment"}>
                      {
                        "# 360p は Google が約 1/3 と公表。1080p / 4K は報道・再販価格からの逆算(要確認)"
                      }
                    </span>
                    {"\nRES_MULTIPLIER = {"}
                    <span className={"hljs-string"}>{'"360p"'}</span>
                    {": "}
                    <span className={"hljs-number"}>{"1"}</span>
                    {" / "}
                    <span className={"hljs-number"}>{"3"}</span>
                    {", "}
                    <span className={"hljs-string"}>{'"720p"'}</span>
                    {": "}
                    <span className={"hljs-number"}>{"1.0"}</span>
                    {", "}
                    <span className={"hljs-string"}>{'"1080p"'}</span>
                    {": "}
                    <span className={"hljs-number"}>{"1.5"}</span>
                    {", "}
                    <span className={"hljs-string"}>{'"4k"'}</span>
                    {": "}
                    <span className={"hljs-number"}>{"3.0"}</span>
                    {"}\n\n\n"}
                    <span className={"hljs-keyword"}>{"def"}</span>{" "}
                    <span className={["hljs-title", "function_"].join(" ")}>{"estimate_cost"}</span>
                    {"("}
                    <span className={"hljs-params"}>
                      {"seconds: "}
                      <span className={"hljs-built_in"}>{"float"}</span>
                      {", resolution: "}
                      <span className={"hljs-built_in"}>{"str"}</span>
                      {" = "}
                      <span className={"hljs-string"}>{'"720p"'}</span>
                      {", attempts: "}
                      <span className={"hljs-built_in"}>{"int"}</span>
                      {" = "}
                      <span className={"hljs-number"}>{"1"}</span>
                    </span>
                    {") -> "}
                    <span className={"hljs-built_in"}>{"float"}</span>
                    {":\n    "}
                    <span className={"hljs-string"}>
                      {'"""出力動画の概算コスト(USD)。attempts は採用までの試行回数。"""'}
                    </span>
                    {"\n    per_sec = TOKENS_PER_SEC_720P * USD_PER_M_VIDEO_TOKENS / "}
                    <span className={"hljs-number"}>{"1_000_000"}</span>
                    {"\n    "}
                    <span className={"hljs-keyword"}>{"return"}</span>
                    {" seconds * per_sec * RES_MULTIPLIER[resolution] * attempts\n\n\n"}
                    <span className={"hljs-built_in"}>{"print"}</span>
                    {"("}
                    <span className={"hljs-string"}>
                      {'f"10s 720p x1      : $'}
                      <span className={"hljs-subst"}>
                        {"{estimate_cost("}
                        <span className={"hljs-number"}>{"10"}</span>
                        {"):"}
                        <span className={"hljs-number"}>{".2"}</span>
                        {"f}"}
                      </span>
                      {'"'}
                    </span>
                    {")\n"}
                    <span className={"hljs-built_in"}>{"print"}</span>
                    {"("}
                    <span className={"hljs-string"}>
                      {'f"10s 360p x5 + 4K : $'}
                      <span className={"hljs-subst"}>
                        {"{estimate_cost("}
                        <span className={"hljs-number"}>{"10"}</span>
                        {", "}
                        <span className={"hljs-string"}>{"'360p'"}</span>
                        {", "}
                        <span className={"hljs-number"}>{"5"}</span>
                        {") + estimate_cost("}
                        <span className={"hljs-number"}>{"10"}</span>
                        {", "}
                        <span className={"hljs-string"}>{"'4k'"}</span>
                        {"):"}
                        <span className={"hljs-number"}>{".2"}</span>
                        {"f}"}
                      </span>
                      {'"'}
                    </span>
                    {")\n"}
                    <span className={"hljs-built_in"}>{"print"}</span>
                    {"("}
                    <span className={"hljs-string"}>
                      {'f"10s x4 拡張 720p : $'}
                      <span className={"hljs-subst"}>
                        {"{estimate_cost("}
                        <span className={"hljs-number"}>{"10"}</span>
                        {", "}
                        <span className={"hljs-string"}>{"'720p'"}</span>
                        {", "}
                        <span className={"hljs-number"}>{"4"}</span>
                        {"):"}
                        <span className={"hljs-number"}>{".2"}</span>
                        {"f}"}
                      </span>
                      {'"'}
                    </span>
                    {")\n"}
                  </span>
                </code>
              </pre>{" "}
              <h3 id="omni-heading-46">{"8.3 コスト目安(720p 基準・筆者計算)"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"シナリオ"}</th>
                      <th>{"概算"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"5 秒 × 1 回"}</td>
                      <td>{"約 $0.51"}</td>
                    </tr>
                    <tr>
                      <td>{"10 秒 × 1 回"}</td>
                      <td>{"約 $1.01"}</td>
                    </tr>
                    <tr>
                      <td>{"10 秒 × 4 回の拡張(累計 40 秒)"}</td>
                      <td>{"約 $4.05"}</td>
                    </tr>
                    <tr>
                      <td>{"10 秒の 360p ドラフト × 5 回"}</td>
                      <td>{"約 $1.69"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="omni-heading-47">{"8.4 推奨ワークフロー"}</h3>{" "}
              <div className={styles["diagram-card"]}>
                {" "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="5">
                    <MermaidDiagram chart={DIAGRAM_5} theme="base" themeVariables={THEME_VARS} />
                  </div>
                </div>{" "}
              </div>{" "}
              <h3 id="omni-heading-48">{"8.5 ドラフト運用の注意(推論を含む)"}</h3>{" "}
              <ul>
                {" "}
                <li>
                  {" "}
                  <strong>{"ドラフトと本番は別の生成になる可能性があります。"}</strong>
                  {" 公式は "}
                  <code>{"temperature"}</code>
                  {"・"}
                  <code>{"top_p"}</code>
                  {"・システム指示などのサンプリング制御を "}
                  <strong>{"非対応"}</strong>
                  {
                    "としており、同じプロンプトでも結果が変わりえます。「360p で確定した構図が、720p 以上で再生成しても再現される」と仮定せず、"
                  }
                  <strong>{"本番の解像度でも採用判定をする"}</strong>
                  {"運用にしてください(推論。実測で確認を)。 "}
                </li>{" "}
                <li>
                  {" "}
                  <strong>{"上限の把握"}</strong>
                  {
                    ": 見積もりは「秒数 × 単価 × 成功までの試行回数」で考えます。コストを決めるのは動画の長さより "
                  }
                  <strong>{"試行回数"}</strong>
                  {"です。 "}
                </li>{" "}
              </ul>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="sec-10">
            {" "}
            <h2 id="omni-heading-49">{"Step 9: 本番運用(信頼性・安全性・地域制約)"}</h2>{" "}
            <div className={styles.prose}>
              {" "}
              <h3 id="omni-heading-50">{"9.1 運用設計のチェックポイント"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"領域"}</th>
                      <th>{"ベストプラクティス"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"ID の永続化"}</td>
                      <td>
                        {" 編集・拡張の可能性があるジョブは "}
                        <code>{"interaction.id"}</code>
                        {" を DB に保存 "}
                      </td>
                      <td>
                        {"状態は "}
                        <code>{"previous_interaction_id"}</code>
                        {" で引き継ぐ(公式)"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"保存設定"}</td>
                      <td>
                        {"後続編集が必要なら "}
                        <code>{"store=false"}</code>
                        {" にしない"}
                      </td>
                      <td>
                        <code>{"store=false"}</code>
                        {" の動画は編集不可(公式)"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"大容量出力"}</td>
                      <td>{"4MB 超は URI 配信。作成直後に URI を保存"}</td>
                      <td>{"後から GET するとインライン base64 で返る(公式)"}</td>
                    </tr>
                    <tr>
                      <td>{"生成待ち"}</td>
                      <td>
                        {" "}
                        <code>{"FAILED"}</code>
                        {" を含む状態遷移を処理し、ポーリング間隔と上限時間を設ける "}
                      </td>
                      <td>{"生成時間は長さ・解像度・負荷で変動(公式)"}</td>
                    </tr>
                    <tr>
                      <td>{"モデル ID"}</td>
                      <td>
                        {"プレビュー ID から "}
                        <code>{"gemini-omni-1.1-flash"}</code>
                        {" へ移行"}
                      </td>
                      <td>{"プレビュー ID は廃止予定(二次情報。公式で確認)"}</td>
                    </tr>
                    <tr>
                      <td>{"動画の起点管理"}</td>
                      <td>
                        {
                          " 参照・編集に使う素材はバージョン管理し、どの素材がどの出力を生んだか追跡 "
                        }
                      </td>
                      <td>{"運用上の推奨(筆者)"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="omni-heading-51">{"9.2 安全性・ガバナンス"}</h3>{" "}
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
                      <td>{"SynthID"}</td>
                      <td>
                        {" すべての生成動画に不可視の透かしが入る。"}
                        <strong>{"無効化できない"}</strong>
                        {"ため、公開側の表示ポリシーと整合させる "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"安全フィルタ"}</td>
                      <td>{"入力プロンプトと生成動画の両方に適用される(地域で異なる)"}</td>
                    </tr>
                    <tr>
                      <td>{"人物・未成年"}</td>
                      <td>
                        {
                          " 識別可能な人物や、EEA・スイス・英国での未成年を含む画像のアップロード編集には制限がある "
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{"権利"}</td>
                      <td>{"参照素材(顔・商品・画風)の利用許諾は自社で管理する"}</td>
                    </tr>
                    <tr>
                      <td>{"データ"}</td>
                      <td>
                        {
                          " 有料枠は製品改善に利用されないと公式料金ページに記載。契約条件は必ず自社で確認 "
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="omni-heading-52">{"9.3 トラブルシュート"}</h3>{" "}
              <div className={styles["diagram-card"]}>
                {" "}
                <div className={styles["diagram-wrap"]}>
                  <div className={styles["diagram-canvas"]} data-diagram-id="6">
                    <MermaidDiagram chart={DIAGRAM_6} theme="base" themeVariables={THEME_VARS} />
                  </div>
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="sec-11">
            {" "}
            <h2 id="omni-heading-53">{"既知の制約まとめ"}</h2>{" "}
            <div className={styles.prose}>
              {" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"カテゴリ"}</th>
                      <th>{"制約"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"生成長"}</td>
                      <td>{"1 回あたり最大 10 秒。拡張で累計 40 秒"}</td>
                    </tr>
                    <tr>
                      <td>{"制御パラメータ"}</td>
                      <td>
                        {" システム指示・"}
                        <code>{"temperature"}</code>
                        {"・"}
                        <code>{"top_p"}</code>
                        {"・停止シーケンス・ネガティブプロンプト欄は "}
                        <strong>{"非対応"}</strong>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"音声"}</td>
                      <td>{"声の編集は非対応。音声参照のアップロードも非対応"}</td>
                    </tr>
                    <tr>
                      <td>{"動画参照"}</td>
                      <td>{"最大 3 クリップ・各 3 秒。複数動画をまたぐ推論は非対応"}</td>
                    </tr>
                    <tr>
                      <td>{"入力動画"}</td>
                      <td>{"編集・拡張は 10 秒以下"}</td>
                    </tr>
                    <tr>
                      <td>{"拡張位置"}</td>
                      <td>{"末尾のみ"}</td>
                    </tr>
                    <tr>
                      <td>{"YouTube"}</td>
                      <td>{"YouTube 動画をメディアソースとして使うことは非対応"}</td>
                    </tr>
                    <tr>
                      <td>{"スループット"}</td>
                      <td>{"Provisioned Throughput は非対応"}</td>
                    </tr>
                    <tr>
                      <td>{"言語"}</td>
                      <td>{"英語は完全サポート。他言語は未評価"}</td>
                    </tr>
                    <tr>
                      <td>{"地域"}</td>
                      <td>{"アップロード動画の編集・拡張は EEA・スイス・英国で提供なし"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="sec-12">
            {" "}
            <h2 id="omni-heading-54">{"アンチパターン集"}</h2>{" "}
            <div className={styles.prose}>
              {" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"アンチパターン"}</th>
                      <th>{"なぜ悪いか"}</th>
                      <th>{"対策"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"1 本の長文プロンプトに全指示を詰める"}</td>
                      <td>{"編集では過剰な説明が意図しない変更を招く"}</td>
                      <td>{"生成は構造化、編集は短く 1 変更ずつ"}</td>
                    </tr>
                    <tr>
                      <td>{"単一ショットを指定せずに生成する"}</td>
                      <td>{"既定で複数ショットの物語になる"}</td>
                      <td>{"単一ショットを明記"}</td>
                    </tr>
                    <tr>
                      <td>{"否定を「ネガティブ欄」に入れようとする"}</td>
                      <td>{"そのフィールドは存在しない"}</td>
                      <td>{"「No ...」を本文に書く"}</td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"store=false"}</code>
                        {" のまま編集フローを組む"}
                      </td>
                      <td>{"動画が後続ターンで編集できない"}</td>
                      <td>{"編集前提なら保存を有効に"}</td>
                    </tr>
                    <tr>
                      <td>{"古い GET で URI を取り直そうとする"}</td>
                      <td>{"インライン base64 で返ってくる"}</td>
                      <td>{"作成直後に URI を保存"}</td>
                    </tr>
                    <tr>
                      <td>{"最初から 4K で試行錯誤する"}</td>
                      <td>{"試行回数 × 高単価でコストが膨らむ"}</td>
                      <td>{"360p ドラフトで収束させる"}</td>
                    </tr>
                    <tr>
                      <td>
                        <code>{"task"}</code>
                        {" を常時指定する"}
                      </td>
                      <td>{"追加の制約がかかる"}</td>
                      <td>{"プロンプトで解決し、最後の手段にする"}</td>
                    </tr>
                    <tr>
                      <td>{"日本語の看板や字幕を動画内に直接描かせる"}</td>
                      <td>{"非英語は未評価"}</td>
                      <td>{"事前検証し、必要なら後工程で重ねる"}</td>
                    </tr>
                    <tr>
                      <td>{"参照動画に音声を期待する"}</td>
                      <td>{"参照動画の音声は無視される"}</td>
                      <td>{"音はプロンプトで指定"}</td>
                    </tr>
                    <tr>
                      <td>{"独立ベンチ無しで「最高品質」と断定"}</td>
                      <td>{"評価はベンダー発表が中心"}</td>
                      <td>{"自社データで A/B 評価"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="sec-13">
            {" "}
            <h2 id="omni-heading-55">{"導入チェックリスト"}</h2>{" "}
            <div className={styles.prose}>
              {" "}
              <p>
                <strong>{"設計"}</strong>
              </p>{" "}
              <div className={styles.progress}>
                <span data-testid="check-progress">
                  <span data-check-count>0</span>
                  {" / "}
                  <span data-check-total>3</span>
                  {" 完了"}
                </span>
                <div className={styles.bar}>
                  <i data-check-bar />
                </div>
              </div>
              <ul className={styles.checklist}>
                {" "}
                <li className={styles.chk}>
                  {" "}
                  <label>
                    <input type="checkbox" data-guide-check="" />{" "}
                    <span>{"Omni と Veo 3.1 の選定基準を決め、同一プロンプトで A/B 比較した"}</span>
                  </label>{" "}
                </li>{" "}
                <li className={styles.chk}>
                  {" "}
                  <label>
                    <input type="checkbox" data-guide-check="" />{" "}
                    <span>
                      {"編集・拡張の要否を決め、保存設定("}
                      <code>{"store"}</code>
                      {")を設計した"}
                    </span>
                  </label>{" "}
                </li>{" "}
                <li className={styles.chk}>
                  {" "}
                  <label>
                    <input type="checkbox" data-guide-check="" />{" "}
                    <span>{"英語プロンプトのテンプレートを整備した"}</span>
                  </label>{" "}
                </li>{" "}
              </ul>{" "}
              <p>
                <strong>{"実装"}</strong>
              </p>{" "}
              <div className={styles.progress}>
                <span data-testid="check-progress">
                  <span data-check-count>0</span>
                  {" / "}
                  <span data-check-total>4</span>
                  {" 完了"}
                </span>
                <div className={styles.bar}>
                  <i data-check-bar />
                </div>
              </div>
              <ul className={styles.checklist}>
                {" "}
                <li className={styles.chk}>
                  {" "}
                  <label>
                    <input type="checkbox" data-guide-check="" />{" "}
                    <span>
                      <code>{"gemini-omni-1.1-flash"}</code>
                      {" を使い、旧プレビュー ID を使っていない"}
                    </span>
                  </label>{" "}
                </li>{" "}
                <li className={styles.chk}>
                  {" "}
                  <label>
                    <input type="checkbox" data-guide-check="" />{" "}
                    <span>{"4MB 超は URI 配信で、作成直後に URI を保存している"}</span>
                  </label>{" "}
                </li>{" "}
                <li className={styles.chk}>
                  {" "}
                  <label>
                    <input type="checkbox" data-guide-check="" />{" "}
                    <span>
                      <code>{"PROCESSING"}</code>
                      {" と "}
                      <code>{"FAILED"}</code>
                      {" を処理するポーリングを実装した"}
                    </span>
                  </label>{" "}
                </li>{" "}
                <li className={styles.chk}>
                  {" "}
                  <label>
                    <input type="checkbox" data-guide-check="" />{" "}
                    <span>
                      <code>{"interaction.id"}</code>
                      {" を永続化している"}
                    </span>
                  </label>{" "}
                </li>{" "}
              </ul>{" "}
              <p>
                <strong>{"品質"}</strong>
              </p>{" "}
              <div className={styles.progress}>
                <span data-testid="check-progress">
                  <span data-check-count>0</span>
                  {" / "}
                  <span data-check-total>3</span>
                  {" 完了"}
                </span>
                <div className={styles.bar}>
                  <i data-check-bar />
                </div>
              </div>
              <ul className={styles.checklist}>
                {" "}
                <li className={styles.chk}>
                  {" "}
                  <label>
                    <input type="checkbox" data-guide-check="" />{" "}
                    <span>{"単一ショット・音・禁止事項をテンプレートに含めた"}</span>
                  </label>{" "}
                </li>{" "}
                <li className={styles.chk}>
                  {" "}
                  <label>
                    <input type="checkbox" data-guide-check="" />{" "}
                    <span>{"編集は「短い指示 + 他は維持」で運用している"}</span>
                  </label>{" "}
                </li>{" "}
                <li className={styles.chk}>
                  {" "}
                  <label>
                    <input type="checkbox" data-guide-check="" />{" "}
                    <span>{"同一性・小物・文字・音の連続性を QA 項目にした"}</span>
                  </label>{" "}
                </li>{" "}
              </ul>{" "}
              <p>
                <strong>{"コストと運用"}</strong>
              </p>{" "}
              <div className={styles.progress}>
                <span data-testid="check-progress">
                  <span data-check-count>0</span>
                  {" / "}
                  <span data-check-total>3</span>
                  {" 完了"}
                </span>
                <div className={styles.bar}>
                  <i data-check-bar />
                </div>
              </div>
              <ul className={styles.checklist}>
                {" "}
                <li className={styles.chk}>
                  {" "}
                  <label>
                    <input type="checkbox" data-guide-check="" />{" "}
                    <span>{"360p ドラフト → 本番の二段階にし、試行回数の上限を決めた"}</span>
                  </label>{" "}
                </li>{" "}
                <li className={styles.chk}>
                  {" "}
                  <label>
                    <input type="checkbox" data-guide-check="" />{" "}
                    <span>{"1080p / 4K の単価を公式料金ページで再確認した"}</span>
                  </label>{" "}
                </li>{" "}
                <li className={styles.chk}>
                  {" "}
                  <label>
                    <input type="checkbox" data-guide-check="" />{" "}
                    <span>{"SynthID・地域制約・人物権利のポリシーを法務と整合させた"}</span>
                  </label>{" "}
                </li>{" "}
              </ul>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="sec-14">
            {" "}
            <h2 id="omni-heading-56">{"補足: 追加ベストプラクティスと根拠ソース URL"}</h2>{" "}
            <div className={styles.prose}>
              {" "}
              <p>
                {" 調査時点は 2026-11-05 まで。"}
                <strong>{"一次情報(公式)→ 著名開発者・主要メディア → サードパーティ"}</strong>
                {"の順に整理しています。 "}
              </p>{" "}
              <h3 id="omni-heading-57">{"A. 一次情報(Google 公式)"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"内容"}</th>
                      <th>{"URL"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {
                          " Omni Flash 公式ドキュメント(生成・編集・拡張・プロンプトガイド・制約。2026-09-23 更新) "
                        }
                      </td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://ai.google.dev/gemini-api/docs/omni"
                        >
                          {"https://ai.google.dev/gemini-api/docs/omni"}
                        </a>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"料金ページ(Omni のトークン単価と 720p 換算)"}</td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://ai.google.dev/gemini-api/docs/pricing"
                        >
                          {"https://ai.google.dev/gemini-api/docs/pricing"}
                        </a>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Gemini API の動画概要(Omni を既定とする方針、Veo との使い分け)"}</td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://ai.google.dev/gemini-api/docs/video"
                        >
                          {"https://ai.google.dev/gemini-api/docs/video"}
                        </a>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {
                          " 公式ブログ「Gemini Omni 1.1 Flash lets you build with more control」(シーン拡張、10 秒の文脈参照、360p プレビュー、採用事例) "
                        }
                      </td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-omni-1-1-flash/"
                        >
                          {
                            "https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-omni-1-1-flash/"
                          }
                        </a>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Gemini アプリの Omni 紹介ページ(Veo 3.1 から Omni への切り替え)"}</td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://gemini.google/overview/video-generation/"
                        >
                          {"https://gemini.google/overview/video-generation/"}
                        </a>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"公式 Skill(コーディングエージェント向けの Omni API 手順)"}</td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://github.com/google-gemini/gemini-skills/blob/main/skills/gemini-omni-flash-api/SKILL.md"
                        >
                          {
                            "https://github.com/google-gemini/gemini-skills/blob/main/skills/gemini-omni-flash-api/SKILL.md"
                          }
                        </a>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Interactions API の概要"}</td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://ai.google.dev/gemini-api/docs/interactions-overview"
                        >
                          {"https://ai.google.dev/gemini-api/docs/interactions-overview"}
                        </a>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Interactions API の破壊的変更(2026 年 5 月)"}</td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://ai.google.dev/gemini-api/docs/interactions-breaking-changes-may-2026"
                        >
                          {
                            "https://ai.google.dev/gemini-api/docs/interactions-breaking-changes-may-2026"
                          }
                        </a>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"廃止予定の一覧(プレビュー ID の確認用)"}</td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://ai.google.dev/gemini-api/docs/deprecations"
                        >
                          {"https://ai.google.dev/gemini-api/docs/deprecations"}
                        </a>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"リリースノート"}</td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://ai.google.dev/gemini-api/docs/changelog"
                        >
                          {"https://ai.google.dev/gemini-api/docs/changelog"}
                        </a>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"Files API(動画アップロード)"}</td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://ai.google.dev/gemini-api/docs/files"
                        >
                          {"https://ai.google.dev/gemini-api/docs/files"}
                        </a>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>{"クイックスタート Colab"}</td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://colab.sandbox.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_Omni.ipynb"
                        >
                          {
                            "https://colab.sandbox.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_Omni.ipynb"
                          }
                        </a>{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="omni-heading-58">{"B. 著名な開発者・主要メディア"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"内容"}</th>
                      <th>{"URL"}</th>
                      <th>{"補足"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {
                          " Philipp Schmid(Google DeepMind)の投稿。Omni Flash の API プレビュー時に「動画編集で SOTA、$0.10 / 秒で Veo 3.1 Fast と同価格」と発信(2026-06-30)。別の投稿で、Interactions API を使えば数行のコードで編集できる例も紹介 "
                        }
                      </td>
                      <td>{"https://digg.com/tech/plr69ybe(原典は X の @_philschmid)"}</td>
                      <td>
                        <strong>{"ベンダー所属開発者の発言"}</strong>
                        {"。独立した検証ではない"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {
                          " TechCrunch「Omni は動画から始まる」。Sundar Pichai の「any input から create anything」という方針、Flash の 10 秒上限が展開判断であること "
                        }
                      </td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://techcrunch.com/2026/05/19/googles-gemini-omni-turns-images-audio-and-text-into-video-and-thats-just-the-start/"
                        >
                          {
                            "https://techcrunch.com/2026/05/19/googles-gemini-omni-turns-images-audio-and-text-into-video-and-thats-just-the-start/"
                          }
                        </a>{" "}
                      </td>
                      <td>{"報道"}</td>
                    </tr>
                    <tr>
                      <td>
                        {
                          " FutureFive:発表時点の提供面(アプリ・Flow・YouTube)と、音声入力は当初は声の参照のみだった点 "
                        }
                      </td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://futurefive.co.nz/story/google-launches-gemini-omni-flash-for-video-editing"
                        >
                          {
                            "https://futurefive.co.nz/story/google-launches-gemini-omni-flash-for-video-editing"
                          }
                        </a>{" "}
                      </td>
                      <td>{"報道"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <blockquote data-testid="voice">
                {" "}
                <p>
                  {" "}
                  <strong>{"調査の限界"}</strong>
                  {
                    ": Simon Willison 氏など独立系の著名開発者による I/O 2026 の総括は確認できましたが、"
                  }
                  <strong>
                    {"Omni 1.1 の API 利用に特化した詳細な検証記事は見つけられませんでした"}
                  </strong>
                  {
                    "。この領域は今後の一次検証が出てくる余地が大きいため、定期的に再調査してください。 "
                  }
                </p>{" "}
              </blockquote>{" "}
              <h3 id="omni-heading-59">{"C. サードパーティ(実装・価格の補助情報)"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"内容"}</th>
                      <th>{"URL"}</th>
                      <th>{"補足"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {
                          " ComfyUI が Omni Flash 1.1 の統合を解説(1 つのノードで text / image / reference / edit / extend) "
                        }
                      </td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://blog.comfy.org/p/gemini-omni-11-flash-in-comfyui-faster"
                        >
                          {"https://blog.comfy.org/p/gemini-omni-11-flash-in-comfyui-faster"}
                        </a>{" "}
                      </td>
                      <td>{"公式ブログ形式"}</td>
                    </tr>
                    <tr>
                      <td>
                        {
                          " Replicate の Omni 1.1 ページ(ネイティブ音声、台詞は引用符、プロンプト内ネガティブ) "
                        }
                      </td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://replicate.com/google/gemini-omni-1.1"
                        >
                          {"https://replicate.com/google/gemini-omni-1.1"}
                        </a>{" "}
                      </td>
                      <td>{"配信プラットフォーム"}</td>
                    </tr>
                    <tr>
                      <td>
                        {"Runware の Omni Flash 1.1 ガイド(プロンプト構造、参照、編集、拡張)"}
                      </td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://runware.ai/docs/models/google-gemini-omni-flash-1-1/guides"
                        >
                          {"https://runware.ai/docs/models/google-gemini-omni-flash-1-1/guides"}
                        </a>{" "}
                      </td>
                      <td>{"推論基盤の独自ガイド"}</td>
                    </tr>
                    <tr>
                      <td>
                        {
                          " Eachlabs の編集ガイド(「1 つだけ変える」「Keep everything else the same」の運用) "
                        }
                      </td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.eachlabs.ai/blog/gemini-omni-1-1-flash-video-editing-guide"
                        >
                          {"https://www.eachlabs.ai/blog/gemini-omni-1-1-flash-video-editing-guide"}
                        </a>{" "}
                      </td>
                      <td>{"公式ガイドの解説。声の編集不可も整理"}</td>
                    </tr>
                    <tr>
                      <td>{"Atlas Cloud の価格解説(5 / 10 / 40 秒のコスト)"}</td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.atlascloud.ai/blog/tips/gemini-omni-flash-1.1-pricing"
                        >
                          {"https://www.atlascloud.ai/blog/tips/gemini-omni-flash-1.1-pricing"}
                        </a>{" "}
                      </td>
                      <td>{"解像度別単価は報道値。要確認"}</td>
                    </tr>
                    <tr>
                      <td>{"TuttoAndroid(解像度別単価を報道)"}</td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.tuttoandroid.net/news/2026/08/28/gemini-omni-1-1-flash-ufficiale-scene-estese-4k-1169741/"
                        >
                          {
                            "https://www.tuttoandroid.net/news/2026/08/28/gemini-omni-1-1-flash-ufficiale-scene-estese-4k-1169741/"
                          }
                        </a>{" "}
                      </td>
                      <td>{"二次情報"}</td>
                    </tr>
                    <tr>
                      <td>
                        {
                          " OrcaRouter の launch 解説(独立ベンチ無し、1080p / 4K の公式単価が未掲載である点の指摘) "
                        }
                      </td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.orcarouter.ai/blog/gemini-omni-1-1-flash-launch"
                        >
                          {"https://www.orcarouter.ai/blog/gemini-omni-1-1-flash-launch"}
                        </a>{" "}
                      </td>
                      <td>{"二次情報。懐疑的な視点として有用"}</td>
                    </tr>
                    <tr>
                      <td>{"Geotoolbox(日付と提供面、プレビュー ID の廃止日)"}</td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://geotoolbox.ai/blog/gemini-omni"
                        >
                          {"https://geotoolbox.ai/blog/gemini-omni"}
                        </a>{" "}
                      </td>
                      <td>{"二次情報"}</td>
                    </tr>
                    <tr>
                      <td>{"Usefastlane(Omni Pro は提供日未定、Veo 4 は未発表との整理)"}</td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.usefastlane.ai/blog/gemini-omni"
                        >
                          {"https://www.usefastlane.ai/blog/gemini-omni"}
                        </a>{" "}
                      </td>
                      <td>{"二次情報"}</td>
                    </tr>
                    <tr>
                      <td>{"コミュニティのプロンプト集"}</td>
                      <td>
                        {" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://github.com/flaqai/awesome-gemini-omni-flash"
                        >
                          {"https://github.com/flaqai/awesome-gemini-omni-flash"}
                        </a>{" "}
                      </td>
                      <td>{"コミュニティ。品質は玉石混交"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="omni-heading-60">{"D. 追加のベストプラクティス(根拠付き)"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"ベストプラクティス"}</th>
                      <th>{"根拠"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {" 台詞は "}
                        <strong>{"引用符で囲み"}</strong>
                        {"、音楽・効果音・環境音は別途記述する "}
                      </td>
                      <td>{"Replicate のモデルページ(上の C 表)"}</td>
                    </tr>
                    <tr>
                      <td>
                        {
                          " 編集結果が崩れたら、再生成する前にまず指示を「1 動詞 + 1 対象」まで短縮し、「Keep everything else the same」を付ける "
                        }
                      </td>
                      <td>{"公式ドキュメント+Eachlabs"}</td>
                    </tr>
                    <tr>
                      <td>
                        {" 新規ジョブは Omni を既定にし、既存 Veo 資産は "}
                        <strong>{"段階移行"}</strong>
                        {"で比較する "}
                      </td>
                      <td>{"公式の動画概要ページ"}</td>
                    </tr>
                    <tr>
                      <td>
                        {
                          " ComfyUI などのノードベース環境では、同一ノードで全モードを切り替えてワークフロー化する "
                        }
                      </td>
                      <td>{"ComfyUI ブログ"}</td>
                    </tr>
                    <tr>
                      <td>
                        {
                          " コーディングエージェント(Claude Code・Gemini CLI 等)には、公式 Skill を読ませて実装する "
                        }
                      </td>
                      <td>{"公式 GitHub の gemini-skills"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="sec-15">
            {" "}
            <h2 id="omni-heading-61">{"情報の確度と更新方針"}</h2>{" "}
            <div className={styles.prose}>
              {" "}
              <h3 id="omni-heading-62">{"資料間の食い違いと扱い"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"論点"}</th>
                      <th>{"状況"}</th>
                      <th>{"本ガイドの扱い"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"1080p / 4K の単価"}</td>
                      <td>
                        {
                          " 公式料金ページは 720p のトークン換算が中心。報道・再販業者は 1080p ≒ $0.15、4K ≒ $0.30 / 秒と報告。一方で「Google は 1080p / 4K の単価を公表していない」と指摘する記事もある "
                        }
                      </td>
                      <td>
                        <strong>{"二次情報として併記し、公式での再確認を必須"}</strong>
                        {"とした"}
                      </td>
                    </tr>
                    <tr>
                      <td>{"拡張・末尾フレームの対応"}</td>
                      <td>
                        {
                          " 動画概要ページは Veo 3.1 の用途として挙げるが、Omni ページは Omni 1.1 での対応を明記 "
                        }
                      </td>
                      <td>{"Omni ページを正とした"}</td>
                    </tr>
                    <tr>
                      <td>{"プレビュー ID の廃止日"}</td>
                      <td>
                        {"複数の二次情報が 2026-09-30 と記載。公式ページでの直接確認は未実施"}
                      </td>
                      <td>{"公式 Deprecations で要確認とした"}</td>
                    </tr>
                    <tr>
                      <td>{"Omni の位置づけ"}</td>
                      <td>
                        {
                          " 一部の解説記事は Omni を Gemini 2.0 系の理解モデルと説明するなど、公式と矛盾する "
                        }
                      </td>
                      <td>{"公式ドキュメントと矛盾する記事は採用しなかった"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
              <h3 id="omni-heading-63">{"更新のトリガー"}</h3>{" "}
              <div className={styles["table-wrap"]}>
                {" "}
                <table>
                  <thead>
                    <tr>
                      <th>{"トリガー"}</th>
                      <th>{"アクション"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{"Omni Pro の提供開始"}</td>
                      <td>{"モデル選定フロー(Step 1)とコスト表(Step 8)を更新"}</td>
                    </tr>
                    <tr>
                      <td>{"画像・音声出力の追加"}</td>
                      <td>{"「出力は動画のみ」という前提(第 0 章・第 1 章)を更新"}</td>
                    </tr>
                    <tr>
                      <td>{"1080p / 4K の公式単価が明示"}</td>
                      <td>{"8.1 の確度欄と見積もり関数を更新"}</td>
                    </tr>
                    <tr>
                      <td>{"Interactions API の仕様変更"}</td>
                      <td>{"全コード例を再検証"}</td>
                    </tr>
                    <tr>
                      <td>{"参照・拡張の上限緩和"}</td>
                      <td>{"5.5 と既知の制約表を更新"}</td>
                    </tr>
                  </tbody>
                </table>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <footer className={styles.footer}>
            {
              " 以上。本ガイドは 2026 年 11 月 5 日時点までの公開情報に基づきます。価格・制限・モデル ID は変わりやすいため、実装前に必ず公式ドキュメントで再確認してください。 "
            }
          </footer>{" "}
        </main>{" "}
      </div>
    </div>
  );
}
