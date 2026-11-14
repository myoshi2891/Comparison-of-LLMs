import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import { pageRegistry } from "@/lib/page-registry";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

const ENTRY = pageRegistry.find((p) => p.slug === "/claude/fable-5-2-best-practices");
export const metadata: Metadata = {
  title: "Claude Fable 5.2 ベストプラクティス完全ガイド",
  description:
    "Claude Fable 5.2 のモデル選定、effort、API実装、履歴管理、Claude Code・マルチエージェント運用、コストと評価を学ぶ中級〜上級ガイド。情報基準日2026-11-12。",
};
const LIGHT_THEME = {
  fontFamily: '"Noto Sans JP","Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif',
  fontSize: "16px",
  primaryColor: "#ffffff",
  primaryTextColor: "#1f1b16",
  primaryBorderColor: "#8a8070",
  lineColor: "#5d5546",
  textColor: "#1f1b16",
  edgeLabelBackground: "#ffffff",
};
const DIAGRAM_0 =
  'flowchart LR\n    BASE["同一の基盤モデル"]\n    FABLE["Claude Fable 5.2　全ユーザーが利用可能　cyber・bio の安全装置あり"]\n    MYTHOS["Claude Mythos 5.2　認証済み組織のみ　cyber・bio の制限を緩和"]\n    CVP["Cyber Verification Program"]\n    LSVP["Life Sciences Verification Program"]\n    SEC["Claude Security　Enterprise プラン"]\n\n    BASE --> FABLE\n    BASE --> MYTHOS\n    CVP --> MYTHOS\n    LSVP --> MYTHOS\n    MYTHOS --> SEC\n\n    class BASE,FABLE hub\n    class MYTHOS box\nclassDef hub fill:#e8ebfa,stroke:#2f3d8f,color:#1d2557;\nclassDef box fill:#f8efd6,stroke:#7d5c14,color:#3f2e08;\nclassDef done fill:#e2f3e9,stroke:#1f6b45,color:#0f3a24;';
const DIAGRAM_1 =
  'flowchart TD\n    START["新しいタスク"] --> Q1{"仕様は明確で　1〜数ファイルで完結する?"}\n    Q1 -- "はい" --> Q2{"大量・低遅延・低コストが最優先?"}\n    Q2 -- "はい" --> HAIKU["Haiku 5.5・Sonnet 5.5"]\n    Q2 -- "いいえ" --> OPUS["Opus 5.5 を medium〜high で試す"]\n    Q1 -- "いいえ" --> Q3{"曖昧な要件の探索・全体設計・　大規模移行・数時間の無人実行?"}\n    Q3 -- "はい" --> FABLE["Fable 5.2 を high で試す"]\n    Q3 -- "いいえ" --> OPUS\n    OPUS --> Q4{"Opus の高 effort でも　evals が基準未達?"}\n    Q4 -- "はい" --> FABLE\n    Q4 -- "いいえ" --> DONE["そのまま運用"]\n    FABLE --> Q5{"一部だけが難所?"}\n    Q5 -- "はい" --> HYBRID["小型モデルが主担当 + Fable を advisor に　または Fable が指揮し小型モデルが実行"]\n    Q5 -- "いいえ" --> DONE\n\n    class FABLE,HYBRID hub\n    class DONE,HAIKU,OPUS done\nclassDef hub fill:#e8ebfa,stroke:#2f3d8f,color:#1d2557;\nclassDef box fill:#f8efd6,stroke:#7d5c14,color:#3f2e08;\nclassDef done fill:#e2f3e9,stroke:#1f6b45,color:#0f3a24;';
const DIAGRAM_2 =
  'flowchart TD\n    A["タスクを分類する"] --> B{"仕様が明確で　短時間で終わる?"}\n    B -- "はい" --> LOW["low から試す"]\n    B -- "いいえ" --> C{"対話的に人が待っている?"}\n    C -- "はい" --> MED["medium から試す"]\n    C -- "いいえ" --> D{"長時間・無人・　難度が高い?"}\n    D -- "はい" --> HIGH["high を起点にする"]\n    D -- "いいえ" --> MED\n    LOW --> E["自社 evals で評価する"]\n    MED --> E\n    HIGH --> E\n    E --> F{"品質は基準を満たすか?"}\n    F -- "満たす" --> G{"1段下げても満たすか?"}\n    G -- "はい" --> DOWN["1段下げて再評価"]\n    DOWN --> E\n    G -- "いいえ" --> FIX["その effort で確定"]\n    F -- "満たさない" --> H{"high 未満?"}\n    H -- "はい" --> UP["1段上げて再評価"]\n    UP --> E\n    H -- "いいえ" --> I{"プロンプトや　ハーネスに原因がない?"}\n    I -- "原因あり" --> PROMPT["8章の9パターンを確認"]\n    I -- "原因なし" --> XH["xhigh を試し　効果とコストを測定"]\n\n    class LOW,MED,HIGH,XH hub\n    class FIX done\nclassDef hub fill:#e8ebfa,stroke:#2f3d8f,color:#1d2557;\nclassDef box fill:#f8efd6,stroke:#7d5c14,color:#3f2e08;\nclassDef done fill:#e2f3e9,stroke:#1f6b45,color:#0f3a24;';
const DIAGRAM_3 =
  'flowchart TD\n    A["リクエストを組み立てる"] --> B{"system・tools・過去メッセージを　前回から変更した?"}\n    B -- "いいえ　追記のみ" --> OK["検査に合格　思考が再利用され　キャッシュも効く"]\n    B -- "はい" --> C{"思考ブロックを　含めて送った?"}\n    C -- "いいえ" --> WEAK["ブロックを除いて送信　モデルが考え直し出力トークン増　類推"]\n    C -- "はい" --> D{"prefix_mismatch_behavior　の設定"}\n    D -- "未設定" --> ERR["400 エラー"]\n    D -- "drop_block" --> DROP["ブロックを破棄して継続　再思考でトークン増の恐れ"]\n\n    class OK done\n    class ERR,DROP,WEAK box\nclassDef hub fill:#e8ebfa,stroke:#2f3d8f,color:#1d2557;\nclassDef box fill:#f8efd6,stroke:#7d5c14,color:#3f2e08;\nclassDef done fill:#e2f3e9,stroke:#1f6b45,color:#0f3a24;';
const DIAGRAM_4 =
  'flowchart TD\n    A["1　アプリが1回目のリクエストを送る　system　tools　user"] --> B["2　APIが thinking ブロックと tool_use を返す"]\n    B --> C["3　アプリは返された content をそのまま履歴に追記する"]\n    C --> D["4　アプリがツールを実行して結果を得る"]\n    D --> E["5　アプリが履歴と tool_result で2回目のリクエストを送る"]\n    E --> F["6　APIが prefix を検査して思考を再利用しキャッシュも効かせる"]\n    F --> G["7　APIが text ブロックと end_turn を返す"]\n    class A hub\n    class G done\nclassDef hub fill:#e8ebfa,stroke:#2f3d8f,color:#1d2557;\nclassDef box fill:#f8efd6,stroke:#7d5c14,color:#3f2e08;\nclassDef done fill:#e2f3e9,stroke:#1f6b45,color:#0f3a24;';
const DIAGRAM_5 =
  'flowchart TD\n    A["タスクを受け取る"] --> B["plan mode で計画　effort は medium"]\n    B --> C["別のセッションが　計画を厳しくレビュー"]\n    C --> D{"計画は十分?"}\n    D -- "いいえ" --> B\n    D -- "はい" --> E{"作業は長時間・難度が高い?"}\n    E -- "はい" --> F["effort を high に上げ　最後まで走らせる"]\n    E -- "いいえ" --> G["medium のまま実装"]\n    F --> H["自動検証　テスト・型・リンタ"]\n    G --> H\n    H --> I{"検証は合格?"}\n    I -- "いいえ" --> J["失敗ログを渡して修正"]\n    J --> H\n    I -- "はい" --> K["git diff --stat と　差分を人が読む"]\n    K --> L{"頼んでいない変更が　混ざっていない?"}\n    L -- "混ざっている" --> M["差し戻し　または範囲を指定して再依頼"]\n    M --> H\n    L -- "問題なし" --> N["PR を作成"]\n\n    class B,F,G,H hub\n    class N done\nclassDef hub fill:#e8ebfa,stroke:#2f3d8f,color:#1d2557;\nclassDef box fill:#f8efd6,stroke:#7d5c14,color:#3f2e08;\nclassDef done fill:#e2f3e9,stroke:#1f6b45,color:#0f3a24;';
const DIAGRAM_6 =
  'flowchart LR\n    HUMAN["人　 目標と完了条件を定義　承認ゲートを管理"]\n    ORCH["指揮役 Fable 5.2　計画・分担・統合"]\n    W1["作業者 A　Sonnet 5.5・low"]\n    W2["作業者 B　Haiku 5.5・low"]\n    W3["作業者 C　Opus 5.5・medium"]\n    VER["検証役　テスト・型検査・形式検証"]\n    REV["レビューチーム　独立した別モデル"]\n    STATE["共有状態　タスク台帳・チェックポイント"]\n\n    HUMAN --> ORCH\n    ORCH --> W1\n    ORCH --> W2\n    ORCH --> W3\n    W1 --> VER\n    W2 --> VER\n    W3 --> VER\n    VER --> ORCH\n    ORCH <--> STATE\n    ORCH --> REV\n    REV --> HUMAN\n\n    class ORCH hub\n    class HUMAN,REV box\nclassDef hub fill:#e8ebfa,stroke:#2f3d8f,color:#1d2557;\nclassDef box fill:#f8efd6,stroke:#7d5c14,color:#3f2e08;\nclassDef done fill:#e2f3e9,stroke:#1f6b45,color:#0f3a24;';
const DIAGRAM_7 =
  'flowchart TD\n    REQ["リクエスト送信"] --> RESP{"stop_reason は refusal?"}\n    RESP -- "いいえ" --> OK["通常処理"]\n    RESP -- "はい" --> CAT{"stop_details.category"}\n    CAT -- "reasoning_extraction" --> RE["推論を本文に書かせる指示を削除　display を summarized に変更"]\n    CAT -- "cyber・bio" --> LEGIT{"正当な業務か?"}\n    LEGIT -- "はい" --> VERIFY["検証プログラムに申請　Mythos 5.2 の利用を検討"]\n    LEGIT -- "いいえ" --> STOP["依頼を取り下げる"]\n    CAT -- "frontier_llm" --> LIMIT["該当領域は能力が制限される　他の手段を検討"]\n    CAT -- "その他" --> LOG["ログに記録して内容を確認"]\n    VERIFY --> FB{"当面は代替モデルで継続したい?"}\n    FB -- "はい" --> FALLBACK["Opus 4.8・Opus 5 へフォールバック"]\n    FB -- "いいえ" --> WAIT["承認を待つ"]\n\n    class OK done\n    class STOP,LIMIT box\n    class FALLBACK,VERIFY,RE hub\nclassDef hub fill:#e8ebfa,stroke:#2f3d8f,color:#1d2557;\nclassDef box fill:#f8efd6,stroke:#7d5c14,color:#3f2e08;\nclassDef done fill:#e2f3e9,stroke:#1f6b45,color:#0f3a24;';
const DIAGRAM_8 =
  'flowchart TD\n    S["問題が起きた"] --> A{"HTTP ステータスは?"}\n    A -- "400" --> B["エラーメッセージを確認"]\n    B --> B1{"思考ブロック関連?"}\n    B1 -- "はい" --> R7["7章　 履歴を追記のみに"]\n    B1 -- "いいえ" --> R6["6.2　 非対応パラメータを確認"]\n    A -- "200" --> C{"stop_reason は?"}\n    C -- "refusal" --> R12["12章　 カテゴリ別に対応"]\n    C -- "max_tokens" --> R6B["max_tokens を引き上げ　または effort を下げる"]\n    C -- "end_turn" --> D{"品質・挙動の問題?"}\n    D -- "途中で止まる・承認が多い" --> R81["8.1・8.2・8.6"]\n    D -- "無言・遅い" --> R84["6.5・8.4・5章"]\n    D -- "費用が高い" --> R11["8.5・11章"]\n    D -- "コードの扱いが違う" --> R83["8.3・9.3"]\nclassDef hub fill:#e8ebfa,stroke:#2f3d8f,color:#1d2557;\nclassDef box fill:#f8efd6,stroke:#7d5c14,color:#3f2e08;\nclassDef done fill:#e2f3e9,stroke:#1f6b45,color:#0f3a24;';
const DIAGRAM_9 =
  'flowchart TD\n    W1["1週目　環境と評価セット"] --> W2["2週目　effort と棚卸し"]\n    W2 --> W3["3週目　症状別の対処と安全処理"]\n    W3 --> W4["4週目　マルチエージェントと予算ガード"]\n    W4 --> OPS["運用ルール化　週次レビュー"]\n\n    class W1 hub\n    class OPS done\nclassDef hub fill:#e8ebfa,stroke:#2f3d8f,color:#1d2557;\nclassDef box fill:#f8efd6,stroke:#7d5c14,color:#3f2e08;\nclassDef done fill:#e2f3e9,stroke:#1f6b45,color:#0f3a24;';
/** 指定HTMLを全文・要素構造ごと保持する静的ガイド。 */
export default function Page() {
  if (!ENTRY) throw new Error("Fable 5.2 registry entry is required");
  return (
    <div id="fable52-guide" className={styles.root}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap"
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
      <div className={styles["mobile-bar"]}>
        {" "}
        <button
          type="button"
          id="fable52-menu"
          aria-label="目次を開く"
          aria-controls="fable52-sidebar"
          aria-expanded="false"
        >
          {" "}
          <i className={["ti", "ti-menu-2"].join(" ")} aria-hidden="true"></i>{" "}
        </button>{" "}
        <span className={styles["mb-title"]}>{"Claude Fable 5.2 ベストプラクティス"}</span>{" "}
      </div>
      <button
        className={styles.backdrop}
        id="fable52-backdrop"
        type="button"
        aria-label="目次を閉じる"
        tabIndex={-1}
      ></button>
      <div className={styles.layout} data-testid="layout-root">
        {" "}
        <aside className={styles.sidebar} aria-label="章の目次" id="fable52-sidebar">
          {" "}
          <div className={styles["sidebar-brand"]}>
            {" "}
            <span className={styles.badge}>{"Fable 5.2"}</span>{" "}
            <p className={styles["brand-title"]}>{"ベストプラクティス完全ガイド"}</p>{" "}
            <p className={styles["brand-sub"]}>{"中級〜上級者向け 2026-11-12 時点"}</p>{" "}
          </div>{" "}
          <ul className={styles.nav} data-testid="sidebar-nav" aria-label="目次">
            {" "}
            <li>
              {" "}
              <a href="#s-intro" data-testid="sidebar-nav-link">
                <i
                  className={["ti", "ti-info-circle", styles["n-icon"]].join(" ")}
                  aria-hidden="true"
                ></i>
                <span className={styles["n-num"]}></span>
                <span className={styles["n-text"]}>{"資料の概要"}</span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s0" data-testid="sidebar-nav-link">
                <i className={["ti", "ti-tag", styles["n-icon"]].join(" ")} aria-hidden="true"></i>
                <span className={styles["n-num"]}>{"0"}</span>
                <span className={styles["n-text"]}>{"読む前に: この資料の確度ラベル"}</span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s1" data-testid="sidebar-nav-link">
                <i className={["ti", "ti-bulb", styles["n-icon"]].join(" ")} aria-hidden="true"></i>
                <span className={styles["n-num"]}>{"1"}</span>
                <span className={styles["n-text"]}>{"概要: Fable 5.2 を30秒で把握する"}</span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s2" data-testid="sidebar-nav-link">
                <i
                  className={["ti", "ti-arrows-shuffle", styles["n-icon"]].join(" ")}
                  aria-hidden="true"
                ></i>
                <span className={styles["n-num"]}>{"2"}</span>
                <span className={styles["n-text"]}>{"5.1 から 5.2 で何が変わったか"}</span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s3" data-testid="sidebar-nav-link">
                <i
                  className={["ti", "ti-route", styles["n-icon"]].join(" ")}
                  aria-hidden="true"
                ></i>
                <span className={styles["n-num"]}>{"3"}</span>
                <span className={styles["n-text"]}>{"Step 1: モデル選定"}</span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s4" data-testid="sidebar-nav-link">
                <i className={["ti", "ti-key", styles["n-icon"]].join(" ")} aria-hidden="true"></i>
                <span className={styles["n-num"]}>{"4"}</span>
                <span className={styles["n-text"]}>{"Step 2: アクセスと環境の準備"}</span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s5" data-testid="sidebar-nav-link">
                <i
                  className={["ti", "ti-adjustments-horizontal", styles["n-icon"]].join(" ")}
                  aria-hidden="true"
                ></i>
                <span className={styles["n-num"]}>{"5"}</span>
                <span className={styles["n-text"]}>{"Step 3: effort 設計"}</span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s6" data-testid="sidebar-nav-link">
                <i className={["ti", "ti-code", styles["n-icon"]].join(" ")} aria-hidden="true"></i>
                <span className={styles["n-num"]}>{"6"}</span>
                <span className={styles["n-text"]}>{"Step 4: API 実装の基本"}</span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s7" data-testid="sidebar-nav-link">
                <i
                  className={["ti", "ti-history-toggle", styles["n-icon"]].join(" ")}
                  aria-hidden="true"
                ></i>
                <span className={styles["n-num"]}>{"7"}</span>
                <span className={styles["n-text"]}>{"Step 5: Preserved thinking と履歴管理"}</span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s8" data-testid="sidebar-nav-link">
                <i
                  className={["ti", "ti-message-code", styles["n-icon"]].join(" ")}
                  aria-hidden="true"
                ></i>
                <span className={styles["n-num"]}>{"8"}</span>
                <span className={styles["n-text"]}>{"Step 6: プロンプト設計の9パターン"}</span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s9" data-testid="sidebar-nav-link">
                <i
                  className={["ti", "ti-terminal-2", styles["n-icon"]].join(" ")}
                  aria-hidden="true"
                ></i>
                <span className={styles["n-num"]}>{"9"}</span>
                <span className={styles["n-text"]}>{"Step 7: Claude Code 運用"}</span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s10" data-testid="sidebar-nav-link">
                <i
                  className={["ti", "ti-users-group", styles["n-icon"]].join(" ")}
                  aria-hidden="true"
                ></i>
                <span className={styles["n-num"]}>{"10"}</span>
                <span className={styles["n-text"]}>{"Step 8: マルチエージェントと長時間実行"}</span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s11" data-testid="sidebar-nav-link">
                <i className={["ti", "ti-coin", styles["n-icon"]].join(" ")} aria-hidden="true"></i>
                <span className={styles["n-num"]}>{"11"}</span>
                <span className={styles["n-text"]}>{"Step 9: コスト設計"}</span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s12" data-testid="sidebar-nav-link">
                <i
                  className={["ti", "ti-shield-lock", styles["n-icon"]].join(" ")}
                  aria-hidden="true"
                ></i>
                <span className={styles["n-num"]}>{"12"}</span>
                <span className={styles["n-text"]}>
                  {"Step 10: 安全装置・拒否・フォールバック"}
                </span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s13" data-testid="sidebar-nav-link">
                <i
                  className={["ti", "ti-flask", styles["n-icon"]].join(" ")}
                  aria-hidden="true"
                ></i>
                <span className={styles["n-num"]}>{"13"}</span>
                <span className={styles["n-text"]}>{"Step 11: 評価と品質保証"}</span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s14" data-testid="sidebar-nav-link">
                <i className={["ti", "ti-bug", styles["n-icon"]].join(" ")} aria-hidden="true"></i>
                <span className={styles["n-num"]}>{"14"}</span>
                <span className={styles["n-text"]}>{"トラブルシューティング"}</span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s15" data-testid="sidebar-nav-link">
                <i
                  className={["ti", "ti-checklist", styles["n-icon"]].join(" ")}
                  aria-hidden="true"
                ></i>
                <span className={styles["n-num"]}>{"15"}</span>
                <span className={styles["n-text"]}>{"導入チェックリストと30日ロードマップ"}</span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s16" data-testid="sidebar-nav-link">
                <i
                  className={["ti", "ti-books", styles["n-icon"]].join(" ")}
                  aria-hidden="true"
                ></i>
                <span className={styles["n-num"]}>{"16"}</span>
                <span className={styles["n-text"]}>
                  {"補足: 追加ベストプラクティスと根拠ソース"}
                </span>
              </a>{" "}
            </li>{" "}
            <li>
              {" "}
              <a href="#s17" data-testid="sidebar-nav-link">
                <i
                  className={["ti", "ti-alert-triangle", styles["n-icon"]].join(" ")}
                  aria-hidden="true"
                ></i>
                <span className={styles["n-num"]}>{"17"}</span>
                <span className={styles["n-text"]}>{"未確認事項と留意点"}</span>
              </a>{" "}
            </li>{" "}
          </ul>{" "}
        </aside>{" "}
        <main className={styles.main}>
          {" "}
          <header className={styles.hero} id="top">
            {" "}
            <span className={styles.eyebrow}>{"CLAUDE FABLE 5.2 / BEST PRACTICES"}</span>{" "}
            <h1>{"Claude Fable 5.2 ベストプラクティス完全ガイド"}</h1>{" "}
            <p className={styles.lead}>
              {
                " 中級〜上級者向け・ステップバイステップ解説 (API実装 / Claude Code運用 / マルチエージェント / コスト設計) "
              }
            </p>{" "}
            <ul className={styles.chips}>
              {" "}
              <li>
                <b>{"モデルID"}</b>
                {" claude-fable-5-2"}
              </li>{" "}
              <li>
                <b>{"調査時点"}</b>
                {" 2026-11-12"}
              </li>{" "}
              <li>
                <b>{"対象"}</b>
                {" 中級〜上級者"}
              </li>{" "}
              <li>
                <b>{"範囲"}</b>
                {" API・Claude Code・マルチエージェント・コスト"}
              </li>{" "}
            </ul>{" "}
            <div className={styles.heroDates} data-testid="hero-dates">
              最終確認日: <time dateTime={ENTRY.lastReviewed}>{ENTRY.lastReviewed}</time>
              {" / 公開日: "}
              <time dateTime={ENTRY.addedAt}>{ENTRY.addedAt}</time>
            </div>
          </header>{" "}
          <section className={[styles.section, styles.first].join(" ")} id="s-intro">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"概要"}</span>{" "}
              <h2 id="s-intro-heading">{"資料の概要"}</h2>{" "}
            </div>{" "}
            <div className={[styles["table-wrap"], styles["kv-wrap"]].join(" ")}>
              {" "}
              <table>
                <tbody>
                  <tr>
                    <th scope="row">{"対象モデル"}</th>
                    <td>
                      {" Claude Fable 5.2(API ID: "}
                      <code>{"claude-fable-5-2"}</code>
                      {")。同一基盤モデルの Claude Mythos 5.2 との関係も扱う "}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">{"調査時点"}</th>
                    <td>{"2026-11-12(リリースの3日後)"}</td>
                  </tr>
                  <tr>
                    <th scope="row">{"想定読者"}</th>
                    <td>
                      {
                        " Claude API / Claude Code を日常的に使い、モデル切替・effort・サブエージェント設計まで踏み込みたい開発者 "
                      }
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">{"情報源"}</th>
                    <td>
                      {
                        " Anthropic公式発表・Platform Docs・Claude Code Docs を軸に、著名な国際的開発者(Simon Willison、Ethan Mollick、swyx / Latent Space、Boris Cherny、Alex Albert ほか)の投稿で補強 "
                      }
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">{"図解のルール"}</th>
                    <td>
                      {
                        " フローチャートは Mermaid、その他の図解・比較は Markdown 表で表現(ASCII図解は不使用) "
                      }
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="s0">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"0"}</span>{" "}
              <h2 id="s0-heading">{"読む前に: この資料の確度ラベル"}</h2>{" "}
            </div>{" "}
            <p>
              {
                " リリース直後は一次情報と推測が混在します。本書では、すべての主張に次のラベルを付けています。 "
              }
            </p>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"ラベル"}</th>
                    <th>{"意味"}</th>
                    <th>{"扱い方"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {" "}
                      <strong>
                        <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                      </strong>{" "}
                    </td>
                    <td>{"Anthropic の発表・ドキュメントに書かれている事実"}</td>
                    <td>{"設計の根拠にしてよい。ただし数値は版が更新されうる"}</td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <strong>
                        <span className={[styles.tag, styles.measured].join(" ")}>{"実測"}</span>
                      </strong>{" "}
                    </td>
                    <td>{"第三者(Artificial Analysis、SemiAnalysis、Vals など)の計測値"}</td>
                    <td>{"自社タスクで再現確認してから採用する"}</td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <strong>
                        <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
                      </strong>{" "}
                    </td>
                    <td>{"個人・コミュニティの使用感や報告"}</td>
                    <td>{"仮説として扱い、自分のevalsで検証する"}</td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <strong>
                        <span className={[styles.tag, styles.opinion].join(" ")}>{"私見"}</span>
                      </strong>{" "}
                    </td>
                    <td>{"本書の筆者による設計提案"}</td>
                    <td>{"出発点として使い、自社の条件で調整する"}</td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <p>
              {" 括弧内の "}
              <code>{"S1"}</code>
              {"〜"}
              <code>{"S49"}</code>
              {
                " は、巻末「16. 補足: 追加ベストプラクティスと根拠ソース」のURL表の番号に対応します。 "
              }
            </p>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" "}
                <strong>{"重要な注意"}</strong>
                {
                  ": 本書の末尾にある「未確認事項と留意点」に、公式ドキュメント内の数値の揺れや、未確認の噂(Fable 5.5)の扱いをまとめました。意思決定の前に必ず目を通してください。 "
                }
              </p>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="s1">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"1"}</span>{" "}
              <h2 id="s1-heading">{"概要: Fable 5.2 を30秒で把握する"}</h2>{" "}
            </div>{" "}
            <h3 id="s1-1">{"1.1 基本スペック"}</h3>{" "}
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
                    <td>{"リリース日"}</td>
                    <td>{"2026-11-09(Mythos 5.2 と同時)"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"API モデル ID"}</td>
                    <td>
                      {" "}
                      <code>{"claude-fable-5-2"}</code>
                      {"(Mythos 5.2 は "}
                      <code>{"claude-mythos-5-2"}</code>
                      {") "}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Amazon Bedrock"}</td>
                    <td>
                      {" "}
                      <code>{"global.anthropic.claude-fable-5-2"}</code>
                      {" / "}
                      <code>{"us.anthropic.claude-fable-5-2"}</code>
                      {"("}
                      <code>{"bedrock-runtime"}</code>
                      {" エンドポイントのみ) "}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Microsoft Foundry の fast mode"}</td>
                    <td>
                      {"専用モデルID "}
                      <code>{"claude-fable-5-2-fast"}</code>
                      {"(Anthropic ホスト展開のみ)"}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"コンテキストウィンドウ"}</td>
                    <td>{"1M トークン(既定かつ最大)"}</td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S2">
                        {"S2"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"最大出力"}</td>
                    <td>{"128K トークン"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S2">
                        {"S2"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"思考(thinking)"}</td>
                    <td>{"Adaptive thinking が常時オン。深さは effort で制御"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"入出力"}</td>
                    <td>{"テキスト+画像 → テキスト"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S2">
                        {"S2"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"信頼できる知識の期限"}</td>
                    <td>{"2026年6月"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S2">
                        {"S2"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"トークナイザー"}</td>
                    <td>{"Opus 4.7 で導入されたもの"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"標準価格"}</td>
                    <td>{"入力 $8 / 出力 $40(百万トークンあたり)。5.1 は $10 / $50"}</td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"キャッシュ価格"}</td>
                    <td>{"5分書込 $10 / 1時間書込 $16 / 読出 $0.20"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"バッチ価格"}</td>
                    <td>{"入力 $4 / 出力 $20"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"fast mode"}</td>
                    <td>{"最大2.5倍の生成速度。入力 $16 / 出力 $80"}</td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S6">
                        {"S6"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"速度"}</td>
                    <td>{"5.1 比で最大30%高速"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"データ保持"}</td>
                    <td>
                      {
                        " 30日保持が前提。ゼロデータ保持(ZDR)は原則不可(明示許可を除く)。Covered Model "
                      }
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"提供先"}</td>
                    <td>
                      {
                        " Claude Platform、AWS、Google Cloud、Microsoft Foundry、claude.ai の有料プラン "
                      }
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h3 id="s1-2">{"1.2 Fable と Mythos の関係"}</h3>{" "}
            <p>
              {" 同じ基盤モデルに、安全装置の違いで2つの名前が付いています。"}
              <strong>{"一般開発者が使うのは Fable、認証済みの組織だけが使えるのが Mythos"}</strong>
              {" です。 "}
            </p>{" "}
            <div className={styles["diagram-card"]}>
              {" "}
              <div className={styles["diagram-title"]}>{"図1 Fable と Mythos の関係"}</div>{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram
                  id="fable52-diagram-0"
                  chart={DIAGRAM_0}
                  theme="base"
                  themeVariables={LIGHT_THEME}
                />
              </div>{" "}
            </div>{" "}
            <ul>
              {" "}
              <li>
                {
                  " Fable 5.2 の安全装置は 5.1 と同等の堅牢さを保ちつつ、不要なブロックが約55%減(cyber 約60%減、bio 約40%減)とされています "
                }
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S1">
                  {"S1"}
                </a>
                {")。 "}
              </li>{" "}
              <li>
                {
                  " ブロックされたリクエストは、cyber は Opus 4.8、bio は Opus 5 の応答に切り替わる設計です "
                }
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S1">
                  {"S1"}
                </a>
                {")。 "}
              </li>{" "}
            </ul>{" "}
            <h3 id="s1-3">{"1.3 公式ベンチマークの要点(Fable 5.2 / Fable 5.1 / Opus 5.5)"}</h3>{" "}
            <p>
              {" 数値は各モデルの最高 effort での公式発表値です(特記を除く)"}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S1">
                {"S1"}
              </a>
              {")。 "}
            </p>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"ベンチマーク"}</th>
                    <th>{"測るもの"}</th>
                    <th>{"Fable 5.2"}</th>
                    <th>{"Fable 5.1"}</th>
                    <th>{"Opus 5.5"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"FrontierCode 2.0(Xhigh)"}</td>
                    <td>{"OSSメンテナがマージするレベルのコード変更"}</td>
                    <td>{"49.1%"}</td>
                    <td>{"32.4%"}</td>
                    <td>{"45.5%"}</td>
                  </tr>
                  <tr>
                    <td>{"FrontierSWE v2"}</td>
                    <td>{"エージェント型コーディング"}</td>
                    <td>{"69.9%"}</td>
                    <td>{"56.3%"}</td>
                    <td>{"62.3%"}</td>
                  </tr>
                  <tr>
                    <td>{"AutomationBench"}</td>
                    <td>{"業務ワークフロー"}</td>
                    <td>{"51.4%"}</td>
                    <td>{"31.4%"}</td>
                    <td>{"42.5%"}</td>
                  </tr>
                  <tr>
                    <td>{"Terminal-Bench-Science 0.1"}</td>
                    <td>{"科学研究エージェント"}</td>
                    <td>{"74.6%"}</td>
                    <td>{"52.6%"}</td>
                    <td>{"58.7%"}</td>
                  </tr>
                  <tr>
                    <td>{"OSWorld 2.1(オフライン、部分)"}</td>
                    <td>{"コンピュータ操作"}</td>
                    <td>{"89.3%"}</td>
                    <td>{"83.5%"}</td>
                    <td>{"87.2%"}</td>
                  </tr>
                  <tr>
                    <td>{"WANDR"}</td>
                    <td>{"大規模データ収集の検索エージェント"}</td>
                    <td>{"82.1%"}</td>
                    <td>{"68.7%"}</td>
                    <td>{"72.3%"}</td>
                  </tr>
                  <tr>
                    <td>{"Humanity's Last Exam(ツールあり)"}</td>
                    <td>{"専門家レベルの知識・推論"}</td>
                    <td>{"74.2%"}</td>
                    <td>{"65.6%"}</td>
                    <td>{"67.7%"}</td>
                  </tr>
                  <tr>
                    <td>{"Chartography(ツールなし)"}</td>
                    <td>{"チャート・図表の読み取り"}</td>
                    <td>{"73.4%"}</td>
                    <td>{"44.8%"}</td>
                    <td>{"64.4%"}</td>
                  </tr>
                  <tr>
                    <td>{"RoboDojo Sim"}</td>
                    <td>{"ロボット制御(シミュレーション)"}</td>
                    <td>{"64.9%"}</td>
                    <td>{"27.6%"}</td>
                    <td>{"39.4%"}</td>
                  </tr>
                  <tr>
                    <td>{"Remote Labor Index(High)"}</td>
                    <td>{"遠隔業務の自律遂行"}</td>
                    <td>{"41.3%"}</td>
                    <td>{"17.9%"}</td>
                    <td>{"21.3%"}</td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" "}
                <strong>{"読み方の注意"}</strong>
                {
                  ": 「全部で Opus 5.5 を上回る」わけではありません。Anthropic 自身が「ほとんどの項目で上回る」と表現しており、第三者の評価では AA-Briefcase は Opus 5.5 と信頼区間内で同水準、GDP.pdf の all-pass は Opus 5.5 がわずかに上、といった項目もあります "
                }
                <span className={[styles.tag, styles.measured].join(" ")}>{"実測"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S15">
                  {"S15"}
                </a>
                {")。"}
                <strong>{"自社タスクで測るまで、Opus 5.5 より常に良いとは仮定しない"}</strong>
                {"のが安全です。 "}
              </p>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="s2">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"2"}</span>{" "}
              <h2 id="s2-heading">{"5.1 から 5.2 で何が変わったか"}</h2>{" "}
            </div>{" "}
            <h3 id="s2-1">{"2.1 変更点の一覧"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"観点"}</th>
                    <th>{"Fable 5.1"}</th>
                    <th>{"Fable 5.2"}</th>
                    <th>{"確度"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"価格(入力 / 出力)"}</td>
                    <td>{"$10 / $50"}</td>
                    <td>{"$8 / $40(20%安)"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"生成速度"}</td>
                    <td>{"基準"}</td>
                    <td>{"最大30%高速"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"安全装置のブロック"}</td>
                    <td>{"基準"}</td>
                    <td>{"約55%減"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"文章の明瞭さ"}</td>
                    <td>{"基準"}</td>
                    <td>{"テスターが「より明確」と評価"}</td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Claude apps / Claude Code の既定 effort"}</td>
                    <td>{"—"}</td>
                    <td>{"medium"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"API の既定 effort"}</td>
                    <td>{"high"}</td>
                    <td>{"high(変更なし)"}</td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S4">
                        {"S4"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"思考ブロックの prefix チェック"}</td>
                    <td>{"2026-08-31 以降に作成したアカウントのみ"}</td>
                    <td>
                      <strong>{"全アカウントで強制"}</strong>
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"思考ブロックを読めるモデル"}</td>
                    <td>{"—"}</td>
                    <td>{"Fable 5.2 と Mythos 5.2 のみ"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"コンピュータ操作"}</td>
                    <td>
                      <code>{"computer_20251124"}</code>
                      {" とツールセット"}
                    </td>
                    <td>
                      <strong>{"ツールセットのみ"}</strong>
                      {"(Bedrock を除く)"}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"advisor ツール"}</td>
                    <td>{"—"}</td>
                    <td>{"5.2 executor は 5.2 / Mythos 5.2 の advisor のみ許可"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"指示への追従"}</td>
                    <td>{"—"}</td>
                    <td>{"スタイル規則を厳密に守る。「考えるな」は効かない"}</td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h3 id="s2-2">{"2.2 「安くなった」の落とし穴"}</h3>{" "}
            <p>
              {" トークン単価は20%下がりましたが、"}
              <strong>{"タスクあたりの総コストが下がるとは限りません"}</strong>
              {"。 "}
            </p>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"計測"}</th>
                    <th>{"内容"}</th>
                    <th>{"確度"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"Anthropic"}</td>
                    <td>{"Medium effort では 5.1 より少ないトークンで難タスクを解ける"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"SemiAnalysis GDPx"}</td>
                    <td>
                      {
                        " タスク単価が $67.16 → $88.15(約31%増)。テストケースを数百〜数千件書き、サブエージェントで検証する傾向 "
                      }
                    </td>
                    <td>
                      {" 実測 ("}
                      <a className={styles["src-link"]} href="#S15">
                        {"S15"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S26">
                        {"S26"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Artificial Analysis"}</td>
                    <td>
                      {
                        " max effort のタスク単価は約 $26.5(Opus 5.5 の約2.6倍、Fable 5.1 の約2倍)。一方 high / xhigh では出力約98K トークンで、Opus 5.5 max の約173K を下回る "
                      }
                    </td>
                    <td>
                      {" 実測 ("}
                      <a className={styles["src-link"]} href="#S15">
                        {"S15"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S27">
                        {"S27"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" "}
                <strong>
                  {"結論 "}
                  <span className={[styles.tag, styles.opinion].join(" ")}>{"私見"}</span>
                </strong>
                {": コスト比較は「単価」ではなく「"}
                <strong>{"effort を揃えた上でのタスクあたり総額"}</strong>
                {"」で行う。詳細は "}
                <a href="#s11">{"11章"}</a>
                {" で扱います。 "}
              </p>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="s3">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"3"}</span>{" "}
              <h2 id="s3-heading">{"Step 1: モデル選定"}</h2>{" "}
            </div>{" "}
            <h3 id="s3-1">{"3.1 公式の基本方針"}</h3>{" "}
            <ul>
              {" "}
              <li>
                {" "}
                <strong>{"まず Opus 5.5 から始める"}</strong>
                {"。必要に応じて、上は Fable / Mythos、下は Sonnet 5.5 / Haiku 5.5 に切り替える "}
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S1">
                  {"S1"}
                </a>
                {")。 "}
              </li>{" "}
              <li>
                {
                  " Platform Docs の表現: Opus で高い effort に上げても評価基準を満たせないときに Fable へ移る "
                }
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S3">
                  {"S3"}
                </a>
                {")。 "}
              </li>{" "}
              <li>
                {" Fable 5.2 は "}
                <strong>{"Advisor"}</strong>
                {"(小型モデルが難所で相談する先)や "}
                <strong>{"Orchestrator"}</strong>
                {"(単純作業を小型モデルへ委譲する指揮役)としても使える "}
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S1">
                  {"S1"}
                </a>
                {")。 "}
              </li>{" "}
            </ul>{" "}
            <h3 id="s3-2">{"3.2 選定フローチャート"}</h3>{" "}
            <div className={styles["diagram-card"]}>
              {" "}
              <div className={styles["diagram-title"]}>{"図2 モデル選定フロー"}</div>{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram
                  id="fable52-diagram-1"
                  chart={DIAGRAM_1}
                  theme="base"
                  themeVariables={LIGHT_THEME}
                />
              </div>{" "}
            </div>{" "}
            <h3 id="s3-3">{"3.3 タスク別の使い分け表"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"タスク"}</th>
                    <th>{"推奨"}</th>
                    <th>{"根拠"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"コードベース全体の書き換え、Rust移植などの大規模移行"}</td>
                    <td>{"Fable 5.2"}</td>
                    <td>
                      {
                        " Anthropic のチームが Python から Rust への移行に使い、起動が約26倍高速になったと報告 "
                      }
                      <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                      {" ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {
                        ")。Anthropic の Felix Rieseberg も、大きく長いタスクは Fable が上回ると述べる "
                      }
                      <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
                      {" ("}
                      <a className={styles["src-link"]} href="#S15">
                        {"S15"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S31">
                        {"S31"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"曖昧・仕様が固まっていない作業の探索"}</td>
                    <td>{"Fable 5.2"}</td>
                    <td>
                      {" Shopify・Vercel のテスターが「ゆるい発想を磨く」「意図を汲む」と評価 "}
                      <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                      {" ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {
                        ")。Claude Code チームの発言として、仕様が明確なら Opus、曖昧なら Fable が合う "
                      }
                      <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
                      {" ("}
                      <a className={styles["src-link"]} href="#S15">
                        {"S15"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"日常のコーディング、明確な仕様の実装"}</td>
                    <td>{"Opus 5.5"}</td>
                    <td>
                      {" 公式の既定推奨 "}
                      <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                      {" ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {
                        ")。Felix Rieseberg は日常では Fable の思考がやや遅いため Opus を好むと述べる "
                      }
                      <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
                      {" ("}
                      <a className={styles["src-link"]} href="#S15">
                        {"S15"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"数時間の無人エージェント実行"}</td>
                    <td>{"Fable 5.2(high)"}</td>
                    <td>
                      {
                        " Uber のテスターは10〜12時間の監査で約170のレビューエージェントを走らせ、「完了まで止まらない」と評価 "
                      }
                      <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                      {" ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"多数のサブエージェントの統括"}</td>
                    <td>{"Fable 5.2 が指揮、Opus 5.5 / Sonnet 5.5 が実行"}</td>
                    <td>
                      {
                        " Lydia Hallie は Fable を Opus 5.5 サブエージェントの指揮役として使い、検証の徹底ぶりを評価 "
                      }
                      <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
                      {" ("}
                      <a className={styles["src-link"]} href="#S15">
                        {"S15"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S30">
                        {"S30"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"画像・チャート・図表の読み取り"}</td>
                    <td>{"Fable 5.2(medium でも可)"}</td>
                    <td>
                      {" Chartography で medium でも Opus 5.5 の最高 effort を上回ると報告 "}
                      <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                      {" ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"大量・低遅延の分類、抽出、ルーティング"}</td>
                    <td>{"Haiku 5.5 / Sonnet 5.5"}</td>
                    <td>
                      {"Fable は過剰。コストが見合わない "}
                      <span className={[styles.tag, styles.opinion].join(" ")}>{"私見"}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{"サイバーセキュリティ、バイオ研究"}</td>
                    <td>{"Mythos 5.2(認証済み組織のみ)"}</td>
                    <td>
                      {" Fable は該当タスクの多くをブロックする "}
                      <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                      {" ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h3 id="s3-4">{"3.4 組み合わせパターン(Claude Code の advisor を含む)"}</h3>{" "}
            <p>
              {
                " Claude Code の advisor 機能では、メインモデルと advisor モデルの組み合わせに制約があります "
              }
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S7">
                {"S7"}
              </a>
              {")。 "}
            </p>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"メインモデル"}</th>
                    <th>{"使える advisor"}</th>
                    <th>{"狙い"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"Sonnet"}</td>
                    <td>{"Fable"}</td>
                    <td>{"難所だけ Fable の助言を受け、全体を Fable で回さずに済む"}</td>
                  </tr>
                  <tr>
                    <td>{"Haiku"}</td>
                    <td>{"Opus"}</td>
                    <td>{"最安のメインで、計画だけ強いモデルに頼る"}</td>
                  </tr>
                  <tr>
                    <td>{"Opus"}</td>
                    <td>{"Opus"}</td>
                    <td>{"2つ目の Opus が1つ目をレビューする"}</td>
                  </tr>
                  <tr>
                    <td>{"Fable 5.2"}</td>
                    <td>{"Fable 5.2 のみ"}</td>
                    <td>
                      {
                        " 最高能力の組み合わせ。Claude Code は Fable メインに Opus / Sonnet の advisor を適用しない "
                      }
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" "}
                <strong>{"API でも同じ制約"}</strong>
                {
                  ": Fable 5.2 を executor にする場合、advisor は Fable 5.2 または Mythos 5.2 だけです。Fable 5.1 を指定すると 400 エラーになります "
                }
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S3">
                  {"S3"}
                </a>
                {")。逆に、executor を今のまま変えず advisor だけを "}
                <code>{"claude-fable-5-2"}</code>
                {" にするのは、どの executor でも可能です "}
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S3">
                  {"S3"}
                </a>
                {")。 "}
              </p>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="s4">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"4"}</span>{" "}
              <h2 id="s4-heading">{"Step 2: アクセスと環境の準備"}</h2>{" "}
            </div>{" "}
            <h3 id="s4-1">{"4.1 手順"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"手順"}</th>
                    <th>{"作業"}</th>
                    <th>{"確認方法"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"1"}</td>
                    <td>
                      {
                        " 利用プランを確認する。Fable 5.2 は Pro / Max / Ultra / Team / Enterprise で利用できる "
                      }
                      <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                      {" ("}
                      <a className={styles["src-link"]} href="#S2">
                        {"S2"}
                      </a>
                      {") "}
                    </td>
                    <td>{"claude.ai のモデルピッカーに Fable 5.2 が出る"}</td>
                  </tr>
                  <tr>
                    <td>{"2"}</td>
                    <td>
                      {" Claude Code を "}
                      <strong>{"v2.1.321 以降"}</strong>
                      {" に更新する "}
                      <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                      {" ("}
                      <a className={styles["src-link"]} href="#S7">
                        {"S7"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S8">
                        {"S8"}
                      </a>
                      {") "}
                    </td>
                    <td>
                      <code>{"claude --version"}</code>
                    </td>
                  </tr>
                  <tr>
                    <td>{"3"}</td>
                    <td>{"モデルを選択する"}</td>
                    <td>
                      {"Claude Code 内で "}
                      <code>{"/model fable"}</code>
                    </td>
                  </tr>
                  <tr>
                    <td>{"4"}</td>
                    <td>
                      {" API を使うなら、モデル ID を "}
                      <code>{"claude-fable-5-2"}</code>
                      {" にする "}
                      <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                      {" ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {") "}
                    </td>
                    <td>{"最小のリクエストで 200 が返る"}</td>
                  </tr>
                  <tr>
                    <td>{"5"}</td>
                    <td>
                      {" "}
                      <strong>{"データ保持の要件"}</strong>
                      {
                        "を法務・セキュリティと合意する。30日保持が前提で、ZDR は原則使えない。Enterprise には Enterprise Frontier Safeguards(顧客インフラ上で保存し ZDR と両立する監視、非公開ベータ)がある "
                      }
                      <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                      {" ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {") "}
                    </td>
                    <td>{"契約・社内規程との突き合わせ"}</td>
                  </tr>
                  <tr>
                    <td>{"6"}</td>
                    <td>{"利用枠の仕様を把握する(4.2 参照)"}</td>
                    <td>{"プラン画面の使用量表示"}</td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"bash"}</div>{" "}
              <pre>
                <code className="language-bash">
                  <span className={styles.codeLine}>
                    <span className="hljs-comment">
                      {"# Claude Code の確認と起動(v2.1.321 以降が必要)"}
                    </span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"claude --version"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>{"claude --model claude-fable-5-2"}</span>
                </code>
              </pre>{" "}
            </div>{" "}
            <h3 id="s4-2">{"4.2 サブスクリプションの利用枠"}</h3>{" "}
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
                    <td>{"週次上限への算入"}</td>
                    <td>
                      {"Pro と Team の標準席では、Fable は週次上限の"}
                      <strong>{"最大50%まで"}</strong>
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"ローンチ特典"}</td>
                    <td>
                      {
                        " Fable を含むプラン・席に、契約期間に応じて Fable のリセットが1〜3回(詳細は公式のサポート記事) "
                      }
                    </td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S36">
                        {"S36"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"有料サブスクの費用対効果"}</td>
                    <td>
                      {
                        " Theo の分析では、$200 の Ultra で得られる量は Opus 5.5 換算で月約 $15,000 に対し、Fable 5.2 換算で約 $3,000 "
                      }
                    </td>
                    <td>
                      {" 観測 ("}
                      <a className={styles["src-link"]} href="#S15">
                        {"S15"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S32">
                        {"S32"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" "}
                <strong>
                  <span className={[styles.tag, styles.opinion].join(" ")}>{"私見"}</span>
                </strong>
                {": 利用枠が限られる環境では、"}
                <strong>{"日常を Opus 5.5、難所だけ Fable"}</strong>
                {
                  " という運用が現実的です。「Fable だけで回す」と枠の消費が速く、50%の上限にも早く当たります。 "
                }
              </p>{" "}
            </div>{" "}
            <h3 id="s4-3">{"4.3 リソース準備のチェックリスト"}</h3>{" "}
            <div className={styles["check-progress"]} data-progress-panel="">
              <span className={styles.count} data-testid="check-progress">
                <span data-check-count>0</span>
                {" / "}
                <span data-check-total>5</span>
                {" 完了"}
              </span>
              <div className={styles.bar}>
                <i data-check-bar style={{ width: "0%" }} />
              </div>
            </div>
            <ul className={styles.checklist}>
              {" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"Claude Code が v2.1.321 以上である"}</span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    {"モデル選択("}
                    <code>{"/model"}</code>
                    {")と effort("}
                    <code>{"/effort"}</code>
                    {")の操作を一度試した"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"組織のデータ保持ポリシーが「30日保持」と矛盾しない"}</span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    {"既存のプロンプト・"}
                    <code>{"CLAUDE.md"}</code>
                    {"・エージェント設定を"}
                    <strong>{"変更前にバックアップ"}</strong>
                    {"した(8章・9章で棚卸しする)"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"評価用タスクセット(10〜30件)を用意した(13章で使う)"}</span>
                </label>{" "}
              </li>{" "}
            </ul>{" "}
          </section>{" "}
          <section className={styles.section} id="s5">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"5"}</span>{" "}
              <h2 id="s5-heading">{"Step 3: effort 設計"}</h2>{" "}
            </div>{" "}
            <p>
              {" Fable 5.2 では、思考(thinking)が常時オンです。「考えるかどうか」は選べず、"}
              <strong>{"「どれだけ深く考えるか」を effort で選ぶ"}</strong>
              {
                "のが最大の設計ポイントになります。effort は、思考量・ツール呼び出し回数・ターンの所要時間・トークン消費をまとめて左右します "
              }
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")。 "}
            </p>{" "}
            <h3 id="s5-1">{"5.1 5段階の使い分け"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"effort"}</th>
                    <th>{"向いている用途"}</th>
                    <th>{"特徴"}</th>
                    <th>{"確度"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>{"low"}</code>
                    </td>
                    <td>
                      {"素早い往復、仕様が明確なタスク、大量処理、高速・安価なサブエージェント"}
                    </td>
                    <td>{"5.2 は low でも、5.1 の高 effort に近いスコアが出たと報告されている"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"medium"}</code>
                    </td>
                    <td>{"対話的なコーディング、チャット、日常の知識業務"}</td>
                    <td>
                      {
                        " Claude apps と Claude Code の既定。5.1 より少ないトークンで難タスクをこなせる "
                      }
                    </td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"high"}</code>
                    </td>
                    <td>{"難しいコーディング・調査・エージェント作業、長時間の無人実行"}</td>
                    <td>
                      {" "}
                      <strong>{"API の既定"}</strong>
                      {"。能力向上の大部分はここまでで得られる。medium より明らかに時間がかかる "}
                    </td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"xhigh"}</code>
                    </td>
                    <td>
                      {" 最難関の長時間コーディング・エージェント作業で、"}
                      <strong>{"効果を測定できた場合のみ"}</strong>{" "}
                    </td>
                    <td>{"内部のコーディング評価でわずかに上昇、トークンは大幅に増える"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"max"}</code>
                    </td>
                    <td>
                      {
                        " モデルの上限測定、時間とトークンが無関係なまれなタスク(科学的発見や数学の未解決問題など) "
                      }
                    </td>
                    <td>{"xhigh よりさらに遅く、トークンも大幅に増える"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h3 id="s5-2">{"5.2 根拠データ: どの effort が割に合うか"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"出典"}</th>
                    <th>{"内容"}</th>
                    <th>{"確度"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"Anthropic(FrontierCode 2.0)"}</td>
                    <td>
                      {
                        " High の Fable 5.2 が、Max の Opus 5.5 とほぼ同スコア(45.3% 対 45.5%)で、タスク単価は約半分。Xhigh で 49.1% と、評価した公開モデルで最高 "
                      }
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Anthropic(WANDR)"}</td>
                    <td>{"Medium で Opus 5.5 の最高スコアに並び、コストは約40%"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Anthropic(HLE)"}</td>
                    <td>{"Low で Opus 5.5 の最高スコアに並び、コストは10分の1未満"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Vals"}</td>
                    <td>{"総合で high が最良。xhigh と max を上回った"}</td>
                    <td>
                      {" 実測 ("}
                      <a className={styles["src-link"]} href="#S15">
                        {"S15"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S28">
                        {"S28"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"複数の評価"}</td>
                    <td>
                      {
                        " max / xhigh が high を下回るケースが複数報告されている。Fable だけに出る傾向で、Opus と Sonnet には出ないという指摘もある "
                      }
                    </td>
                    <td>
                      {" 実測・観測 ("}
                      <a className={styles["src-link"]} href="#S15">
                        {"S15"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S33">
                        {"S33"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Cursor"}</td>
                    <td>
                      {
                        " CursorBench で max が60%、既定が56.9%、5.1 は49.2%。effort の挙動が 5.1 と異なるため、"
                      }
                      <strong>{"5.1 の設定を持ち込まず既定から始める"}</strong>
                      {"よう注意喚起 "}
                    </td>
                    <td>
                      {" 実測 ("}
                      <a className={styles["src-link"]} href="#S15">
                        {"S15"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S35">
                        {"S35"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" "}
                <strong>
                  {"結論 "}
                  <span className={[styles.tag, styles.opinion].join(" ")}>{"私見"}</span>
                </strong>
                {": 出発点は "}
                <strong>
                  <code>{"high"}</code>
                  {"(API)または "}
                  <code>{"medium"}</code>
                  {"(Claude Code)"}
                </strong>
                {
                  "。そこから「下げて評価が保てるか」を先に試し、上げるのは測定で効果が見えた場合だけにする。"
                }
                <strong>
                  <code>{"max"}</code>
                  {" を本番の既定にするのは避ける"}
                </strong>
                {"。 "}
              </p>{" "}
            </div>{" "}
            <h3 id="s5-3">{"5.3 effort 選択フロー"}</h3>{" "}
            <div className={styles["diagram-card"]}>
              {" "}
              <div className={styles["diagram-title"]}>{"図3 effort 選択フロー"}</div>{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram
                  id="fable52-diagram-2"
                  chart={DIAGRAM_2}
                  theme="base"
                  themeVariables={LIGHT_THEME}
                />
              </div>{" "}
            </div>{" "}
            <h3 id="s5-4">{"5.4 effort スイープの手順(最初の1週間でやる)"}</h3>{" "}
            <ol>
              {" "}
              <li>
                {" 代表的なタスクを "}
                <strong>{"10〜30件"}</strong>
                {"用意し、合否の判定基準(自動テスト、ルーブリックなど)を決める。 "}
              </li>{" "}
              <li>
                {" 同じタスクを "}
                <code>{"low"}</code>
                {" / "}
                <code>{"medium"}</code>
                {" / "}
                <code>{"high"}</code>
                {" / "}
                <code>{"xhigh"}</code>
                {" で実行し、"}
                <strong>{"スコア・所要時間・出力トークン・費用"}</strong>
                {"を記録する。 "}
              </li>{" "}
              <li>{"「品質を保てる最も低い effort」をタスク種別ごとに決める。"}</li>{" "}
              <li>
                {
                  " 結果を表にまとめ、運用ルールにする(例: 調査は high、レビューは medium、整形は low)。 "
                }
              </li>{" "}
            </ol>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"python"}</div>{" "}
              <pre>
                <code className="language-python">
                  <span className={styles.codeLine}>
                    <span className="hljs-keyword">{"import"}</span>
                    {" os"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-keyword">{"import"}</span>
                    {" time"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-keyword">{"import"}</span>
                    {" httpx"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"API = "}
                    <span className="hljs-string">{'"https://api.anthropic.com/v1/messages"'}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"HEADERS = {"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-string">{'"x-api-key"'}</span>
                    {": os.environ["}
                    <span className="hljs-string">{'"ANTHROPIC_API_KEY"'}</span>
                    {"],"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-string">{'"anthropic-version"'}</span>
                    {": "}
                    <span className="hljs-string">{'"2023-06-01"'}</span>
                    {","}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-string">{'"content-type"'}</span>
                    {": "}
                    <span className="hljs-string">{'"application/json"'}</span>
                    {","}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"}"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-comment">
                      {"# USD / 百万トークン(標準速度。公式価格表より)"}
                    </span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"PRICE = {"}
                    <span className="hljs-string">{'"in"'}</span>
                    {": "}
                    <span className="hljs-number">{"8.0"}</span>
                    {", "}
                    <span className="hljs-string">{'"out"'}</span>
                    {": "}
                    <span className="hljs-number">{"40.0"}</span>
                    {", "}
                    <span className="hljs-string">{'"cache_read"'}</span>
                    {": "}
                    <span className="hljs-number">{"0.20"}</span>
                    {", "}
                    <span className="hljs-string">{'"cache_write_5m"'}</span>
                    {": "}
                    <span className="hljs-number">{"10.0"}</span>
                    {", "}
                    <span className="hljs-string">{'"cache_write_1h"'}</span>
                    {": "}
                    <span className="hljs-number">{"16.0"}</span>
                    {"}"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-keyword">{"def"}</span>{" "}
                    <span className="hljs-title function_">{"usd"}</span>
                    {"("}
                    <span className="hljs-params">
                      {"usage: "}
                      <span className="hljs-built_in">{"dict"}</span>
                    </span>
                    {") -> "}
                    <span className="hljs-built_in">{"float"}</span>
                    {":"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-string">
                      {
                        '"""usage から概算費用(USD)を計算する。思考トークンは output に含まれて課金される。"""'
                      }
                    </span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    cache = usage.get("}
                    <span className="hljs-string">{'"cache_creation"'}</span>
                    {") "}
                    <span className="hljs-keyword">{"or"}</span>
                    {" {}"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-keyword">{"return"}</span>
                    {" ("}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        usage.get("}
                    <span className="hljs-string">{'"input_tokens"'}</span>
                    {", "}
                    <span className="hljs-number">{"0"}</span>
                    {") * PRICE["}
                    <span className="hljs-string">{'"in"'}</span>
                    {"]"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        + usage.get("}
                    <span className="hljs-string">{'"output_tokens"'}</span>
                    {", "}
                    <span className="hljs-number">{"0"}</span>
                    {") * PRICE["}
                    <span className="hljs-string">{'"out"'}</span>
                    {"]"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        + usage.get("}
                    <span className="hljs-string">{'"cache_read_input_tokens"'}</span>
                    {", "}
                    <span className="hljs-number">{"0"}</span>
                    {") * PRICE["}
                    <span className="hljs-string">{'"cache_read"'}</span>
                    {"]"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        + cache.get("}
                    <span className="hljs-string">{'"ephemeral_5m_input_tokens"'}</span>
                    {", "}
                    <span className="hljs-number">{"0"}</span>
                    {") * PRICE["}
                    <span className="hljs-string">{'"cache_write_5m"'}</span>
                    {"]"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        + cache.get("}
                    <span className="hljs-string">{'"ephemeral_1h_input_tokens"'}</span>
                    {", "}
                    <span className="hljs-number">{"0"}</span>
                    {") * PRICE["}
                    <span className="hljs-string">{'"cache_write_1h"'}</span>
                    {"]"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    ) / "}
                    <span className="hljs-number">{"1_000_000"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-keyword">{"def"}</span>{" "}
                    <span className="hljs-title function_">{"run_once"}</span>
                    {"("}
                    <span className="hljs-params">
                      {"prompt: "}
                      <span className="hljs-built_in">{"str"}</span>
                      {", effort: "}
                      <span className="hljs-built_in">{"str"}</span>
                      {", max_tokens: "}
                      <span className="hljs-built_in">{"int"}</span>
                      {" = "}
                      <span className="hljs-number">{"32_000"}</span>
                    </span>
                    {") -> "}
                    <span className="hljs-built_in">{"dict"}</span>
                    {":"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"    body = {"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-string">{'"model"'}</span>
                    {": "}
                    <span className="hljs-string">{'"claude-fable-5-2"'}</span>
                    {","}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-string">{'"max_tokens"'}</span>
                    {": max_tokens,  "}
                    <span className="hljs-comment">{"# 思考トークンと本文の合計に対する上限"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-string">{'"output_config"'}</span>
                    {": {"}
                    <span className="hljs-string">{'"effort"'}</span>
                    {": effort},"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-string">{'"messages"'}</span>
                    {": [{"}
                    <span className="hljs-string">{'"role"'}</span>
                    {": "}
                    <span className="hljs-string">{'"user"'}</span>
                    {", "}
                    <span className="hljs-string">{'"content"'}</span>
                    {": prompt}],"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"    }"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>{"    t0 = time.time()"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    r = httpx.post(API, headers=HEADERS, json=body, timeout="}
                    <span className="hljs-number">{"900"}</span>
                    {")"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"    r.raise_for_status()"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>{"    data = r.json()"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    text = "}
                    <span className="hljs-string">{'""'}</span>
                    {".join(b.get("}
                    <span className="hljs-string">{'"text"'}</span>
                    {", "}
                    <span className="hljs-string">{'""'}</span>
                    {") "}
                    <span className="hljs-keyword">{"for"}</span>
                    {" b "}
                    <span className="hljs-keyword">{"in"}</span>
                    {" data["}
                    <span className="hljs-string">{'"content"'}</span>
                    {"] "}
                    <span className="hljs-keyword">{"if"}</span>
                    {" b["}
                    <span className="hljs-string">{'"type"'}</span>
                    {"] == "}
                    <span className="hljs-string">{'"text"'}</span>
                    {")"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-keyword">{"return"}</span>
                    {" {"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-string">{'"effort"'}</span>
                    {": effort,"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-string">{'"sec"'}</span>
                    {": "}
                    <span className="hljs-built_in">{"round"}</span>
                    {"(time.time() - t0, "}
                    <span className="hljs-number">{"1"}</span>
                    {"),"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-string">{'"usd"'}</span>
                    {": "}
                    <span className="hljs-built_in">{"round"}</span>
                    {"(usd(data["}
                    <span className="hljs-string">{'"usage"'}</span>
                    {"]), "}
                    <span className="hljs-number">{"4"}</span>
                    {"),"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-string">{'"out_tokens"'}</span>
                    {": data["}
                    <span className="hljs-string">{'"usage"'}</span>
                    {"]["}
                    <span className="hljs-string">{'"output_tokens"'}</span>
                    {"],"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-string">{'"stop_reason"'}</span>
                    {": data["}
                    <span className="hljs-string">{'"stop_reason"'}</span>
                    {"],"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-string">{'"text"'}</span>
                    {": text,"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"    }"}</span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-keyword">{"def"}</span>{" "}
                    <span className="hljs-title function_">{"sweep"}</span>
                    {"("}
                    <span className="hljs-params">
                      {"tasks: "}
                      <span className="hljs-built_in">{"list"}</span>
                      {"["}
                      <span className="hljs-built_in">{"dict"}</span>
                      {"], levels=("}
                      <span className="hljs-params">
                        <span className="hljs-string">{'"low"'}</span>
                        {", "}
                        <span className="hljs-string">{'"medium"'}</span>
                        {", "}
                        <span className="hljs-string">{'"high"'}</span>
                        {", "}
                        <span className="hljs-string">{'"xhigh"'}</span>
                      </span>
                      {")"}
                    </span>
                    {") -> "}
                    <span className="hljs-built_in">{"list"}</span>
                    {"["}
                    <span className="hljs-built_in">{"dict"}</span>
                    {"]:"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"    rows = []"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-keyword">{"for"}</span>
                    {" task "}
                    <span className="hljs-keyword">{"in"}</span>
                    {" tasks:"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-keyword">{"for"}</span>
                    {" level "}
                    <span className="hljs-keyword">{"in"}</span>
                    {" levels:"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"            res = run_once(task["}
                    <span className="hljs-string">{'"prompt"'}</span>
                    {"], level)"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"            res["}
                    <span className="hljs-string">{'"task"'}</span>
                    {"] = task["}
                    <span className="hljs-string">{'"id"'}</span>
                    {"]"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"            res["}
                    <span className="hljs-string">{'"passed"'}</span>
                    {"] = task["}
                    <span className="hljs-string">{'"check"'}</span>
                    {"](res["}
                    <span className="hljs-string">{'"text"'}</span>
                    {"])  "}
                    <span className="hljs-comment">{"# 自社の合否判定関数"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"            rows.append(res)"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-keyword">{"return"}</span>
                    {" rows"}
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" 大きな "}
                <code>{"max_tokens"}</code>
                {" を使う長時間のリクエストは、ストリーミングでの受信が実運用では安全です "}
                <span className={[styles.tag, styles.opinion].join(" ")}>{"私見"}</span>
                {"。上のコードは仕組みを示すための最小版です。 "}
              </p>{" "}
            </div>{" "}
            <h3 id="s5-5">{"5.5 effort の運用ルール"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"ルール"}</th>
                    <th>{"内容"}</th>
                    <th>{"確度"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"応答の長さは effort で変わらない"}</td>
                    <td>
                      {" effort は応答テキストの長さにはほとんど影響しない。長さや口調は"}
                      <strong>{"プロンプトで"}</strong>
                      {"指示する "}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"簡単なターンは低い effort で"}</td>
                    <td>
                      {" 「直接答えて、考えないで」という指示は、medium 以上では"}
                      <strong>{"思考を止められない"}</strong>
                      {"(5.1 では効いた)。high 以上では挨拶にも思考する "}
                    </td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"設定を持ち込まない"}</td>
                    <td>
                      {
                        " effort ごとの思考量はモデルで異なる。5.1 や Opus 5.5 で調整した値は流用せず、スイープをやり直す "
                      }
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"局面で変える"}</td>
                    <td>
                      {
                        " 計画と反復は medium、長い無人区間は high、という切替が有効。キャッシュを保ったまま変えるには per-message effort(ベータ、ヘッダ "
                      }
                      <code>{"mid-conversation-output-config-2026-07-01"}</code>
                      {") "}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"低い effort のエージェントは早く止まりやすい"}</td>
                    <td>
                      {
                        " low / medium では、ターンを途中で終える傾向が強まる。8章の「完遂」の指示を足す "
                      }
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="s6">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"6"}</span>{" "}
              <h2 id="s6-heading">{"Step 4: API 実装の基本"}</h2>{" "}
            </div>{" "}
            <h3 id="s6-1">{"6.1 まず最小のリクエストを通す"}</h3>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"bash"}</div>{" "}
              <pre>
                <code className="language-bash">
                  <span className={styles.codeLine}>
                    {"curl https://api.anthropic.com/v1/messages \\"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  -H "}
                    <span className="hljs-string">
                      {'"x-api-key: '}
                      <span className="hljs-variable">{"$ANTHROPIC_API_KEY"}</span>
                      {'"'}
                    </span>
                    {" \\"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  -H "}
                    <span className="hljs-string">{'"anthropic-version: 2023-06-01"'}</span>
                    {" \\"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  -H "}
                    <span className="hljs-string">{'"content-type: application/json"'}</span>
                    {" \\"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  -d "}
                    <span className="hljs-string">
                      {
                        '\'{\n    "model": "claude-fable-5-2",\n    "max_tokens": 16000,\n    "output_config": { "effort": "high" },\n    "messages": [\n      { "role": "user", "content": "このリポジトリの設計上のリスクを3つ挙げて" }\n    ]\n  }\''
                      }
                    </span>
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <p>
              {" "}
              <code>{"output_config.effort"}</code>
              {" の値は "}
              <code>{"low"}</code>
              {" / "}
              <code>{"medium"}</code>
              {" / "}
              <code>{"high"}</code>
              {" / "}
              <code>{"xhigh"}</code>
              {" / "}
              <code>{"max"}</code>
              {" です "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S3">
                {"S3"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S25">
                {"S25"}
              </a>
              {")。"}
              <code>{"max_tokens"}</code>
              {" は"}
              <strong>{"思考トークンと本文の合計"}</strong>
              {"に対する上限で、思考トークンは出力トークンとして課金されます "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S4">
                {"S4"}
              </a>
              {")。 "}
            </p>{" "}
            <h3 id="s6-2">{"6.2 400 エラーになる指定と、その代替"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"やりがちな指定"}</th>
                    <th>{"結果"}</th>
                    <th>{"代替"}</th>
                    <th>{"確度"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>{'thinking: {"type": "enabled", "budget_tokens": N}'}</code>
                    </td>
                    <td>{"400"}</td>
                    <td>
                      {" "}
                      <code>{"thinking"}</code>
                      {" を省略するか "}
                      <code>{'{"type": "adaptive"}'}</code>
                      {"。深さは effort で調整 "}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>{'thinking: {"type": "disabled"}'}</code>
                    </td>
                    <td>{"400"}</td>
                    <td>{"思考は止められない。低い effort を使う"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <code>{'tool_choice: {"type": "any"}'}</code>
                      {" または "}
                      <code>{'{"type": "tool", ...}'}</code>
                      {"(強制ツール使用) "}
                    </td>
                    <td>{"400"}</td>
                    <td>
                      {" "}
                      <code>{'tool_choice: {"type": "auto"}'}</code>
                      {" に "}
                      <code>{"strict: true"}</code>
                      {" を組み合わせるか、JSON出力機能を使う "}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"computer_20251124"}</code>
                      {" ツール"}
                    </td>
                    <td>{"400(Bedrock を除く)"}</td>
                    <td>
                      <code>{"computer_toolset_20260801"}</code>
                      {" ツールセット"}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"advisor に Fable 5.1 などを指定(executor が Fable 5.2)"}</td>
                    <td>{"400"}</td>
                    <td>
                      {" advisor を "}
                      <code>{"claude-fable-5-2"}</code>
                      {" または "}
                      <code>{"claude-mythos-5-2"}</code>
                      {" に "}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"履歴の編集後に古い思考ブロックを送る"}</td>
                    <td>
                      {"400("}
                      <code>{"The block is bound to a different conversation"}</code>
                      {")"}
                    </td>
                    <td>{"7章を参照"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"顧客管理の暗号鍵(CMEK)を使う組織で structured outputs を利用"}</td>
                    <td>{"利用不可"}</td>
                    <td>
                      <code>{"strict"}</code>
                      {" を外し、ツール入力を自前で検証する"}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {
                  " プリフィル(assistant の先頭を埋める指定)とサンプリングパラメータには制限があり、Opus 5 から引き継がれています "
                }
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S4">
                  {"S4"}
                </a>
                {")。移行ガイドで該当部分を確認してください。 "}
              </p>{" "}
            </div>{" "}
            <h3 id="s6-3">{"6.3 構造化出力は「強制」ではなく「strict」で"}</h3>{" "}
            <p>
              {" 強制ツール使用が使えなくなったため、スキーマに沿った JSON が必要な場合は "}
              <code>{"strict: true"}</code>
              {" を使います "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S3">
                {"S3"}
              </a>
              {")。 "}
            </p>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"json"}</div>{" "}
              <pre>
                <code className="language-json">
                  <span className={styles.codeLine}>
                    <span className="hljs-punctuation">{"{"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  "}
                    <span className="hljs-attr">{'"model"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-string">{'"claude-fable-5-2"'}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  "}
                    <span className="hljs-attr">{'"max_tokens"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-number">{"4000"}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  "}
                    <span className="hljs-attr">{'"output_config"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-punctuation">{"{"}</span>{" "}
                    <span className="hljs-attr">{'"effort"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-string">{'"low"'}</span>{" "}
                    <span className="hljs-punctuation">{"}"}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  "}
                    <span className="hljs-attr">{'"tools"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-punctuation">{"["}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-punctuation">{"{"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"      "}
                    <span className="hljs-attr">{'"name"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-string">{'"record_review"'}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"      "}
                    <span className="hljs-attr">{'"description"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-string">{'"コードレビューの結果を記録する"'}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"      "}
                    <span className="hljs-attr">{'"strict"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-literal">
                      <span className="hljs-keyword">{"true"}</span>
                    </span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"      "}
                    <span className="hljs-attr">{'"input_schema"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-punctuation">{"{"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-attr">{'"type"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-string">{'"object"'}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-attr">{'"properties"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-punctuation">{"{"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"          "}
                    <span className="hljs-attr">{'"severity"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-punctuation">{"{"}</span>{" "}
                    <span className="hljs-attr">{'"type"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-string">{'"string"'}</span>
                    <span className="hljs-punctuation">{","}</span>{" "}
                    <span className="hljs-attr">{'"enum"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-punctuation">{"["}</span>
                    <span className="hljs-string">{'"low"'}</span>
                    <span className="hljs-punctuation">{","}</span>{" "}
                    <span className="hljs-string">{'"medium"'}</span>
                    <span className="hljs-punctuation">{","}</span>{" "}
                    <span className="hljs-string">{'"high"'}</span>
                    <span className="hljs-punctuation">{"]"}</span>{" "}
                    <span className="hljs-punctuation">{"}"}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"          "}
                    <span className="hljs-attr">{'"summary"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-punctuation">{"{"}</span>{" "}
                    <span className="hljs-attr">{'"type"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-string">{'"string"'}</span>{" "}
                    <span className="hljs-punctuation">{"}"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-punctuation">{"}"}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-attr">{'"required"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-punctuation">{"["}</span>
                    <span className="hljs-string">{'"severity"'}</span>
                    <span className="hljs-punctuation">{","}</span>{" "}
                    <span className="hljs-string">{'"summary"'}</span>
                    <span className="hljs-punctuation">{"]"}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-attr">{'"additionalProperties"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-literal">
                      <span className="hljs-keyword">{"false"}</span>
                    </span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"      "}
                    <span className="hljs-punctuation">{"}"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-punctuation">{"}"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  "}
                    <span className="hljs-punctuation">{"]"}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  "}
                    <span className="hljs-attr">{'"tool_choice"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-punctuation">{"{"}</span>{" "}
                    <span className="hljs-attr">{'"type"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-string">{'"auto"'}</span>{" "}
                    <span className="hljs-punctuation">{"}"}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  "}
                    <span className="hljs-attr">{'"messages"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-punctuation">{"["}</span>
                    <span className="hljs-punctuation">{"{"}</span>{" "}
                    <span className="hljs-attr">{'"role"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-string">{'"user"'}</span>
                    <span className="hljs-punctuation">{","}</span>{" "}
                    <span className="hljs-attr">{'"content"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-string">
                      {'"次の差分をレビューして、結果を記録して: ..."'}
                    </span>{" "}
                    <span className="hljs-punctuation">{"}"}</span>
                    <span className="hljs-punctuation">{"]"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-punctuation">{"}"}</span>
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <h3 id="s6-4">{"6.4 ツール実行ループの標準形(履歴は追記のみ)"}</h3>{" "}
            <p>
              {" ツール使用ループでは、"}
              <strong>
                {
                  "直前のアシスタントの応答を、思考ブロック(空のものを含む)も含めて一切加工せずに送り返す"
                }
              </strong>
              {"必要があります "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S4">
                {"S4"}
              </a>
              {")。 "}
            </p>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"python"}</div>{" "}
              <pre>
                <code className="language-python">
                  <span className={styles.codeLine}>
                    <span className="hljs-keyword">{"def"}</span>{" "}
                    <span className="hljs-title function_">{"call"}</span>
                    {"("}
                    <span className="hljs-params">
                      {"body: "}
                      <span className="hljs-built_in">{"dict"}</span>
                      {", betas: "}
                      <span className="hljs-built_in">{"list"}</span>
                      {"["}
                      <span className="hljs-built_in">{"str"}</span>
                      {"] | "}
                      <span className="hljs-literal">{"None"}</span>
                      {" = "}
                      <span className="hljs-literal">{"None"}</span>
                    </span>
                    {") -> "}
                    <span className="hljs-built_in">{"dict"}</span>
                    {":"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    headers = "}
                    <span className="hljs-built_in">{"dict"}</span>
                    {"(HEADERS)"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-keyword">{"if"}</span>
                    {" betas:"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        headers["}
                    <span className="hljs-string">{'"anthropic-beta"'}</span>
                    {"] = "}
                    <span className="hljs-string">{'","'}</span>
                    {".join(betas)"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    r = httpx.post(API, headers=headers, json=body, timeout="}
                    <span className="hljs-number">{"900"}</span>
                    {")"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"    r.raise_for_status()"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-keyword">{"return"}</span>
                    {" r.json()"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-keyword">{"def"}</span>{" "}
                    <span className="hljs-title function_">{"agent_loop"}</span>
                    {"("}
                    <span className="hljs-params">
                      {"user_prompt: "}
                      <span className="hljs-built_in">{"str"}</span>
                      {", tools: "}
                      <span className="hljs-built_in">{"list"}</span>
                      {"["}
                      <span className="hljs-built_in">{"dict"}</span>
                      {"], run_tool, effort: "}
                      <span className="hljs-built_in">{"str"}</span>
                      {" = "}
                      <span className="hljs-string">{'"high"'}</span>
                      {", max_turns: "}
                      <span className="hljs-built_in">{"int"}</span>
                      {" = "}
                      <span className="hljs-number">{"60"}</span>
                    </span>
                    {") -> "}
                    <span className="hljs-built_in">{"dict"}</span>
                    {":"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-comment">
                      {"# system と tools は会話の途中で変更しない(prefix チェックの対象)"}
                    </span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    system = "}
                    <span className="hljs-string">
                      {'"あなたはこのリポジトリの保守担当エージェントです。..."'}
                    </span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    messages = [{"}
                    <span className="hljs-string">{'"role"'}</span>
                    {": "}
                    <span className="hljs-string">{'"user"'}</span>
                    {", "}
                    <span className="hljs-string">{'"content"'}</span>
                    {": user_prompt}]"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-keyword">{"for"}</span>
                    {" _ "}
                    <span className="hljs-keyword">{"in"}</span>{" "}
                    <span className="hljs-built_in">{"range"}</span>
                    {"(max_turns):"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"        data = call({"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"            "}
                    <span className="hljs-string">{'"model"'}</span>
                    {": "}
                    <span className="hljs-string">{'"claude-fable-5-2"'}</span>
                    {","}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"            "}
                    <span className="hljs-string">{'"max_tokens"'}</span>
                    {": "}
                    <span className="hljs-number">{"32_000"}</span>
                    {","}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"            "}
                    <span className="hljs-string">{'"output_config"'}</span>
                    {": {"}
                    <span className="hljs-string">{'"effort"'}</span>
                    {": effort},"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"            "}
                    <span className="hljs-string">{'"system"'}</span>
                    {": system,"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"            "}
                    <span className="hljs-string">{'"cache_control"'}</span>
                    {": {"}
                    <span className="hljs-string">{'"type"'}</span>
                    {": "}
                    <span className="hljs-string">{'"ephemeral"'}</span>
                    {"},  "}
                    <span className="hljs-comment">{"# 自動キャッシュを明示的に有効化"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"            "}
                    <span className="hljs-string">{'"tools"'}</span>
                    {": tools,"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"            "}
                    <span className="hljs-string">{'"messages"'}</span>
                    {": messages,"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"        })"}</span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-comment">
                      {
                        "# 返ってきた content をそのまま追記する。ブロックの削除・並べ替え・書き換えは禁止"
                      }
                    </span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        messages.append({"}
                    <span className="hljs-string">{'"role"'}</span>
                    {": "}
                    <span className="hljs-string">{'"assistant"'}</span>
                    {", "}
                    <span className="hljs-string">{'"content"'}</span>
                    {": data["}
                    <span className="hljs-string">{'"content"'}</span>
                    {"]})"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-keyword">{"if"}</span>
                    {" data["}
                    <span className="hljs-string">{'"stop_reason"'}</span>
                    {"] == "}
                    <span className="hljs-string">{'"refusal"'}</span>
                    {":"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"            "}
                    <span className="hljs-keyword">{"return"}</span>
                    {" data  "}
                    <span className="hljs-comment">{"# 12章の方針で処理する"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-keyword">{"if"}</span>
                    {" data["}
                    <span className="hljs-string">{'"stop_reason"'}</span>
                    {"] != "}
                    <span className="hljs-string">{'"tool_use"'}</span>
                    {":"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"            "}
                    <span className="hljs-keyword">{"return"}</span>
                    {" data"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>{"        results = []"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-keyword">{"for"}</span>
                    {" block "}
                    <span className="hljs-keyword">{"in"}</span>
                    {" data["}
                    <span className="hljs-string">{'"content"'}</span>
                    {"]:"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"            "}
                    <span className="hljs-keyword">{"if"}</span>
                    {" block["}
                    <span className="hljs-string">{'"type"'}</span>
                    {"] == "}
                    <span className="hljs-string">{'"tool_use"'}</span>
                    {":"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"                output = run_tool(block["}
                    <span className="hljs-string">{'"name"'}</span>
                    {"], block["}
                    <span className="hljs-string">{'"input"'}</span>
                    {"])"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"                results.append({"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"                    "}
                    <span className="hljs-string">{'"type"'}</span>
                    {": "}
                    <span className="hljs-string">{'"tool_result"'}</span>
                    {","}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"                    "}
                    <span className="hljs-string">{'"tool_use_id"'}</span>
                    {": block["}
                    <span className="hljs-string">{'"id"'}</span>
                    {"],"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"                    "}
                    <span className="hljs-string">{'"content"'}</span>
                    {": output,"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"                })"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        messages.append({"}
                    <span className="hljs-string">{'"role"'}</span>
                    {": "}
                    <span className="hljs-string">{'"user"'}</span>
                    {", "}
                    <span className="hljs-string">{'"content"'}</span>
                    {": results})"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-keyword">{"raise"}</span>
                    {" RuntimeError("}
                    <span className="hljs-string">{'"max_turns に到達しました"'}</span>
                    {")"}
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <h3 id="s6-5">{"6.5 長い無人実行で「無言」に見える問題を避ける"}</h3>{" "}
            <p>
              {" Fable 5.2 は、ツール呼び出しの合間に書く経過報告を"}
              <strong>{"思考ブロックとして"}</strong>
              {"返します。ところが既定の "}
              <code>{"thinking.display"}</code>
              {" は "}
              <code>{'"omitted"'}</code>
              {" で、その本文が空になります。"}
              <code>{"text"}</code>
              {" ブロックだけを描画するクライアントでは、長い処理の間ずっと無言に見えます "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")。 "}
            </p>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>
                      <code>{"thinking.display"}</code>
                    </th>
                    <th>{"返ってくるもの"}</th>
                    <th>{"用途"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>{'"omitted"'}</code>
                      {"(既定)"}
                    </td>
                    <td>{"思考ブロックの本文は空"}</td>
                    <td>{"画面に出さない。最安・最速"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{'"updates"'}</code>
                    </td>
                    <td>
                      {" 各経過報告の短い要約(ベータ。ヘッダ "}
                      <code>{"thinking-display-updates-2026-08-18"}</code>
                      {") "}
                    </td>
                    <td>
                      <strong>{"ユーザーに進捗を見せたい"}</strong>
                      {"とき"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>{'"summarized"'}</code>
                    </td>
                    <td>{"経過報告 + 要約された推論"}</td>
                    <td>{"推論の様子も見たいとき。推論過程の再現を本文に書かせる代わりに使う"}</td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"python"}</div>{" "}
              <pre>
                <code className="language-python">
                  <span className={styles.codeLine}>{"data = call("}</span>
                  {"\n"}
                  <span className={styles.codeLine}>{"    {"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-string">{'"model"'}</span>
                    {": "}
                    <span className="hljs-string">{'"claude-fable-5-2"'}</span>
                    {","}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-string">{'"max_tokens"'}</span>
                    {": "}
                    <span className="hljs-number">{"32_000"}</span>
                    {","}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-string">{'"output_config"'}</span>
                    {": {"}
                    <span className="hljs-string">{'"effort"'}</span>
                    {": "}
                    <span className="hljs-string">{'"high"'}</span>
                    {"},"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-string">{'"thinking"'}</span>
                    {": {"}
                    <span className="hljs-string">{'"type"'}</span>
                    {": "}
                    <span className="hljs-string">{'"adaptive"'}</span>
                    {", "}
                    <span className="hljs-string">{'"display"'}</span>
                    {": "}
                    <span className="hljs-string">{'"updates"'}</span>
                    {"},"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-string">{'"messages"'}</span>
                    {": [{"}
                    <span className="hljs-string">{'"role"'}</span>
                    {": "}
                    <span className="hljs-string">{'"user"'}</span>
                    {", "}
                    <span className="hljs-string">{'"content"'}</span>
                    {": "}
                    <span className="hljs-string">{'"..."'}</span>
                    {"}],"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"    },"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    betas=["}
                    <span className="hljs-string">{'"thinking-display-updates-2026-08-18"'}</span>
                    {"],"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{")"}</span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-comment">
                      {"# テキストだけでなく、中身のある thinking ブロックも描画する"}
                    </span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-keyword">{"for"}</span>
                    {" block "}
                    <span className="hljs-keyword">{"in"}</span>
                    {" data["}
                    <span className="hljs-string">{'"content"'}</span>
                    {"]:"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-keyword">{"if"}</span>
                    {" block["}
                    <span className="hljs-string">{'"type"'}</span>
                    {"] == "}
                    <span className="hljs-string">{'"text"'}</span>
                    {":"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-built_in">{"print"}</span>
                    {"(block["}
                    <span className="hljs-string">{'"text"'}</span>
                    {"])"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-keyword">{"elif"}</span>
                    {" block["}
                    <span className="hljs-string">{'"type"'}</span>
                    {"] == "}
                    <span className="hljs-string">{'"thinking"'}</span>{" "}
                    <span className="hljs-keyword">{"and"}</span>
                    {" block.get("}
                    <span className="hljs-string">{'"thinking"'}</span>
                    {"):"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-built_in">{"print"}</span>
                    {"("}
                    <span className="hljs-string">{'"[進捗]"'}</span>
                    {", block["}
                    <span className="hljs-string">{'"thinking"'}</span>
                    {"])"}
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" ベータ機能のヘッダ名と挙動は更新されうるため、導入時に公式ドキュメント("}
                <a className={styles["src-link"]} href="#S5">
                  {"S5"}
                </a>
                {")の該当箇所を確認してください。 "}
              </p>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="s7">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"7"}</span>{" "}
              <h2 id="s7-heading">{"Step 5: Preserved thinking と履歴管理"}</h2>{" "}
            </div>{" "}
            <p>
              {" Fable 5.2 は、過去ターンの思考ブロックを保持して使う "}
              <strong>{"preserved thinking"}</strong>
              {" を前提に動きます。このため、"}
              <strong>{"履歴の扱い方がそのまま信頼性とコストを左右します"}</strong>
              {"。 "}
            </p>{" "}
            <h3 id="s7-1">{"7.1 prefix チェックとは"}</h3>{" "}
            <p>
              {" 思考ブロックより前にある内容("}
              <code>{"system"}</code>
              {"、"}
              <code>{"tools"}</code>
              {
                "、過去のメッセージ)が、モデルがそのブロックを出した時点から変わっていないかを API が検査します。変わっていると、既定では 400 エラーです。Fable 5.2 では"
              }
              <strong>{"全アカウントで強制"}</strong>
              {"されます "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S3">
                {"S3"}
              </a>
              {")。 "}
            </p>{" "}
            <div className={styles["diagram-card"]}>
              {" "}
              <div className={styles["diagram-title"]}>{"図4 prefix チェックの判定フロー"}</div>{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram
                  id="fable52-diagram-3"
                  chart={DIAGRAM_3}
                  theme="base"
                  themeVariables={LIGHT_THEME}
                />
              </div>{" "}
            </div>{" "}
            <h3 id="s7-2">{"7.2 変更したくなったときの代替手段"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"やりたいこと"}</th>
                    <th>{"やってはいけない"}</th>
                    <th>{"代わりにやること"}</th>
                    <th>{"確度"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"指示を変える・足す"}</td>
                    <td>
                      {"会話の途中で "}
                      <code>{"system"}</code>
                      {" を書き換える"}
                    </td>
                    <td>
                      {" "}
                      <strong>{"新しい会話"}</strong>
                      {
                        "で変更する。同じ会話なら最新のユーザーターンに書く。利用可能なら mid-conversation の system メッセージで追記する "
                      }
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"ツールを増減する"}</td>
                    <td>
                      <code>{"tools"}</code>
                      {" を書き換える"}
                    </td>
                    <td>
                      {" mid-conversation tool changes(ベータ。ヘッダ "}
                      <code>{"inline-tools-2026-09-15"}</code>
                      {"、参照で名指しする変更は "}
                      <code>{"mid-conversation-tool-changes-2026-07-01"}</code>
                      {") "}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"履歴を短くする"}</td>
                    <td>{"古いメッセージを手で削除・要約する"}</td>
                    <td>
                      {
                        " コンテキスト編集(context editing)、または以降の古いターンを残さない compaction。タイミングを自分で選ぶなら compaction on demand(ベータ。ヘッダ "
                      }
                      <code>{"compact-2026-09-04"}</code>
                      {") "}
                    </td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"ターンごとの注意書きを足す"}</td>
                    <td>{"過去のメッセージに追記する"}</td>
                    <td>
                      {" ターン限定の system メッセージ("}
                      <code>{'clear_at: "next_user_message"'}</code>
                      {")。入れた注意書きは以降のリクエストでも履歴に残す "}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"応答を保存して再送する"}</td>
                    <td>{"思考ブロックを除いたり、空ブロックを省いたり、順序を変えたりする"}</td>
                    <td>{"返ってきた形のまま保存・再送する"}</td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S4">
                        {"S4"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"保存した会話を新プロンプトで再開する"}</td>
                    <td>
                      {"古い会話に新しい "}
                      <code>{"system"}</code>
                      {" を当てる"}
                    </td>
                    <td>{"新しい会話として始める"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {
                  " Claude Code、claude.ai、Claude Managed Agents、Claude Agent SDK が履歴を組み立てる場合は、利用者側で対応する作業は発生しません "
                }
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S3">
                  {"S3"}
                </a>
                {")。"}
                <strong>{"自前でメッセージ配列を組み立てているコードだけ"}</strong>
                {"が点検対象です。 "}
              </p>{" "}
            </div>{" "}
            <h3 id="s7-3">{"7.3 自前実装の点検チェックリスト"}</h3>{" "}
            <div className={styles["check-progress"]} data-progress-panel="">
              <span className={styles.count} data-testid="check-progress">
                <span data-check-count>0</span>
                {" / "}
                <span data-check-total>5</span>
                {" 完了"}
              </span>
              <div className={styles.bar}>
                <i data-check-bar style={{ width: "0%" }} />
              </div>
            </div>
            <ul className={styles.checklist}>
              {" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    <code>{"system"}</code>
                    {" と "}
                    <code>{"tools"}</code>
                    {" が、会話の全期間で同一である"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    <code>{"messages"}</code>
                    {" に追記するだけで、既存要素の変更・並べ替え・削除をしていない"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    {"アシスタントの各ターンを、"}
                    <strong>{"全ブロックを同じ順序のまま"}</strong>
                    {"送り返している"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    {
                      "履歴の圧縮は compaction / context editing で行い、手作業の要約挿入をしていない"
                    }
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    {
                      "会話の途中でツールのバージョンやアドバイザーのモデルを変えていない(変えるなら新しい会話で)"
                    }
                  </span>
                </label>{" "}
              </li>{" "}
            </ul>{" "}
            <h3 id="s7-4">
              {"7.4 暫定回避: "}
              <code>{"drop_block"}</code>
              {"(あくまで応急処置)"}
            </h3>{" "}
            <p>
              {" 編集を直す時間がないときは、ベータのヘッダ "}
              <code>{"thinking-binding-controls-2026-08-01"}</code>
              {" を付け、"}
              <code>{"thinking.block_binding.prefix_mismatch_behavior"}</code>
              {" を "}
              <code>{'"drop_block"'}</code>
              {
                " にすると、無効な思考ブロックを破棄して続行できます。破棄したブロックは、レスポンスの "
              }
              <code>{"input_transformations"}</code>
              {" に一覧されます "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S3">
                {"S3"}
              </a>
              {")。 "}
            </p>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"json"}</div>{" "}
              <pre>
                <code className="language-json">
                  <span className={styles.codeLine}>
                    <span className="hljs-punctuation">{"{"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  "}
                    <span className="hljs-attr">{'"model"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-string">{'"claude-fable-5-2"'}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  "}
                    <span className="hljs-attr">{'"max_tokens"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-number">{"16000"}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  "}
                    <span className="hljs-attr">{'"thinking"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-punctuation">{"{"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-attr">{'"type"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-string">{'"adaptive"'}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-attr">{'"block_binding"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-punctuation">{"{"}</span>{" "}
                    <span className="hljs-attr">{'"prefix_mismatch_behavior"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-string">{'"drop_block"'}</span>{" "}
                    <span className="hljs-punctuation">{"}"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  "}
                    <span className="hljs-punctuation">{"}"}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  "}
                    <span className="hljs-attr">{'"messages"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-punctuation">{"["}</span>
                    <span className="hljs-string">{'"..."'}</span>
                    <span className="hljs-punctuation">{"]"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-punctuation">{"}"}</span>
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <p>
              {" "}
              <strong>{"コストに注意"}</strong>
              {
                ": 毎ターン破棄すると、モデルが毎回考え直すため出力トークンが増えます。公式の検証では、これが最悪のケースとして挙げられています "
              }
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")。まず自分のタスクで出力トークンを測り、"}
              <strong>{"恒久策は履歴を追記のみにすること"}</strong>
              {"です。 "}
            </p>{" "}
            <h3 id="s7-5">{"7.5 モデルを切り替えると何が起きるか"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"状況"}</th>
                    <th>{"結果"}</th>
                    <th>{"確度"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {
                        " Opus 5.5 / Sonnet 5.5 / Haiku 5.5 / Fable 5.1 / Mythos 5.1 / Opus 5 などから Fable 5.2 へ移る "
                      }
                    </td>
                    <td>{"過去の推論を引き継げる(Claude API と Google Cloud の Google 管理版)"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Fable 5.2 と Mythos 5.2 の間を移る"}</td>
                    <td>{"互いの思考ブロックを読める"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{"Fable 5.2 から他のモデルへ移る"}</strong>
                    </td>
                    <td>
                      {
                        " 移った先のターンでは、Fable 5.2 の推論を失う(Opus 5.5、Fable 5.1、フォールバック先の Opus 4.8 / Opus 5 を含む) "
                      }
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"別のアカウントが Fable 5.2 の思考ブロックを送る"}</td>
                    <td>{"ブロックは破棄され、リクエスト自体は成功する(破棄分は課金されない)"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" "}
                <strong>
                  <span className={[styles.tag, styles.opinion].join(" ")}>{"私見"}</span>
                </strong>
                {": モデルを頻繁に切り替えるルーターは、切替のたびに推論が失われます。"}
                <strong>{"会話ごとにモデルを固定"}</strong>
                {"し、切り替えるなら新しい会話か、サブエージェントとして分離するのが安全です。 "}
              </p>{" "}
            </div>{" "}
            <h3 id="s7-6">{"7.6 ツールループと思考ブロックの流れ"}</h3>{" "}
            <div className={styles["diagram-card"]}>
              {" "}
              <div className={styles["diagram-title"]}>
                {"図5 ツールループと思考ブロックの流れ"}
              </div>{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram
                  id="fable52-diagram-4"
                  chart={DIAGRAM_4}
                  theme="base"
                  themeVariables={LIGHT_THEME}
                />
              </div>{" "}
            </div>{" "}
            <h3 id="s7-7">{"7.7 キャッシュとの相乗効果"}</h3>{" "}
            <p>
              {" 履歴を追記のみにしてプレフィックスが一致すると、"}
              <strong>{"キャッシュ再利用の条件を満たしやすくなります"}</strong>
              {
                "。一致だけではキャッシュは有効になりません。agent_loop() のようにリクエストのトップレベルで cache_control を指定するか、明示的なキャッシュブレークポイントを設定することが前提です。通常のツール定義だけでは自動的にキャッシュされません。キャッシュ読み出しは入力単価の0.025倍($0.20/MTok)で、5分書き込みが $10、1時間書き込みが $16(いずれも百万トークンあたり)です。キャッシュ対象の最小サイズは512トークンです "
              }
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S3">
                {"S3"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S4">
                {"S4"}
              </a>
              {")。 "}
            </p>{" "}
          </section>{" "}
          <section className={styles.section} id="s8">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"8"}</span>{" "}
              <h2 id="s8-heading">{"Step 6: プロンプト設計の9パターン"}</h2>{" "}
            </div>{" "}
            <p>
              {" Fable 5.2 は、プロンプトやハーネスの指示を"}
              <strong>{"かなり忠実に守ります"}</strong>
              {
                "。そのため、5.1 や Opus 5.5 向けに積み上げた指示が、コスト増・副作用・無効化を起こすことがあります "
              }
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")。ここでは公式の「Prompting Claude Fable 5.2」("}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")の9つの論点を、症状ごとに整理します。 "}
            </p>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" "}
                <strong>{"本章のテンプレートについて"}</strong>
                {
                  ": 公式ガイドの文面をそのまま転載せず、趣旨を踏まえて筆者が書き直した日本語版を載せています。原文(英語)は "
                }
                <a className={styles["src-link"]} href="#S5">
                  {"S5"}
                </a>
                {" で確認してください。"}
                <strong>{"テンプレートは出発点"}</strong>
                {"です。自分のタスクで効果とトークン増を測ってから採用します。 "}
              </p>{" "}
              <p>
                {" "}
                <strong>{"変更は新しい会話でのみ行う"}</strong>
                {": 指示の追加・削除は "}
                <code>{"system"}</code>
                {" や "}
                <code>{"tools"}</code>
                {
                  " の編集にあたり、7章の prefix チェックに触れます。保存済みの会話を新しい指示で再開すると 400 になりえます "
                }
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S5">
                  {"S5"}
                </a>
                {")。 "}
              </p>{" "}
            </div>{" "}
            <h3 id="s8-0">{"8.0 症状から逆引き"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"観察される症状"}</th>
                    <th>{"参照する節"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"どの effort にするか迷う。簡単な依頼の返事が遅い"}</td>
                    <td>
                      <a href="#s5">{"5章"}</a>
                    </td>
                  </tr>
                  <tr>
                    <td>{"ターンが途中で終わる(「残りは〜です」「続けますか?」)"}</td>
                    <td>
                      <a href="#s8-1">{"8.1"}</a>
                    </td>
                  </tr>
                  <tr>
                    <td>{"不要な承認を求める、定型作業まで止まる"}</td>
                    <td>
                      <a href="#s8-2">{"8.2"}</a>
                      {"、"}
                      <a href="#s8-6">{"8.6"}</a>
                    </td>
                  </tr>
                  <tr>
                    <td>{"既存コードに継ぎ足すだけ。見つけた問題を報告して放置する"}</td>
                    <td>
                      <a href="#s8-3">{"8.3"}</a>
                    </td>
                  </tr>
                  <tr>
                    <td>{"長い処理の間、何も表示されない"}</td>
                    <td>
                      <a href="#s6-5">{"6.5"}</a>
                      {"、"}
                      <a href="#s8-4">{"8.4"}</a>
                    </td>
                  </tr>
                  <tr>
                    <td>{"サブエージェントを必要以上に起動して費用が膨らむ"}</td>
                    <td>
                      <a href="#s8-5">{"8.5"}</a>
                    </td>
                  </tr>
                  <tr>
                    <td>{"旧モデル向けの指示が効かない、文章がぎこちない"}</td>
                    <td>
                      <a href="#s8-7">{"8.7"}</a>
                    </td>
                  </tr>
                  <tr>
                    <td>{"最終報告が読みにくい"}</td>
                    <td>
                      <a href="#s8-8">{"8.8"}</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>{'stop_reason: "refusal"'}</code>
                      {" が返る"}
                    </td>
                    <td>
                      <a href="#s12">{"12章"}</a>
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h3 id="s8-1">{"8.1 作業を最後までやり切らせる"}</h3>{" "}
            <p>
              {" "}
              <strong>{"症状"}</strong>
              {
                ": 長い複数ステップのタスクで、ターンの途中で終わる。残作業を列挙して止まる、続行を提案して待つ、通常の障害(タイムアウトなど)で止まる。"
              }
              <strong>{"low / medium で起きやすい"}</strong>{" "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")。 "}
            </p>{" "}
            <p>
              <strong>{"処方"}</strong>
              {": システムプロンプトに完遂の方針を入れる。"}
            </p>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"markdown"}</div>{" "}
              <pre>
                <code className="language-markdown">
                  <span className={styles.codeLine}>
                    <span className="hljs-section">{"# 作業の完遂"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {
                      " ユーザーが依頼した作業が残っている間は、ターンを終えない。残作業を並べて止まる、続行の提案をして待つ、という終わり方をしない。"
                    }
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {
                      " 状況メモの共有や、ユーザーの回答次第で変わる論点の確認は歓迎する。ただし、回答に依存しない作業は止まらずに進める。"
                    }
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {
                      " エラー、タイムアウト、ロックされたファイル、空の結果、失敗するツールに出会ったら、まず原因を調べる。本当の阻害要因でなければ、待って再試行する、要求を直す、別のツールや情報源を使う、といった方法で乗り越える。"
                    }
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {
                      " 誰かが「動かせない」と明確に決めたもの(触るなと指定されたファイル、意図的に与えられていない権限、安全上のガードレール)は迂回しない。見つけた事実をそのまま報告し、安全な別の方法で完了を目指す。"
                    }
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {" 破壊的・不可逆な操作の確認は、これまでどおり省略しない。"}
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <p>
              {" "}
              <strong>{"効果とトレードオフ"}</strong>
              {
                ": 公式の検証(記録済みセッションの再生、medium)では、完了できる作業が残ったまま終わるセッションが"
              }
              <strong>{"約半分"}</strong>
              {"に減りました。一方、出力トークンは"}
              <strong>{"約30%増"}</strong>
              {"で、「残りを列挙して止まる」型の終わり方は残りました "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")。 "}
            </p>{" "}
            <p>
              <strong>{"注意"}</strong>
              {":"}
            </p>{" "}
            <ul>
              {" "}
              <li>
                {" 質問が減るので、"}
                <strong>{"リスクのある操作・取り消せない操作の確認ステップは自前で残す"}</strong>{" "}
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S5">
                  {"S5"}
                </a>
                {")。 "}
              </li>{" "}
              <li>
                {" "}
                <strong>
                  {"Claude Code は、Fable 5.2 用に "}
                  <code>{"# Finishing work"}</code>
                  {" の節を自動で送っています"}
                </strong>
                {"。"}
                <code>{"CLAUDE.md"}</code>
                {" に同趣旨の文を貼り足す必要はありません "}
                <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S16">
                  {"S16"}
                </a>
                {")。 "}
              </li>{" "}
            </ul>{" "}
            <h3 id="s8-2">{"8.2 承認の出し方と承認ルールの書き方"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"場面"}</th>
                    <th>{"悪い例"}</th>
                    <th>{"良い例(筆者作成)"}</th>
                    <th>{"根拠"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"続行を許可する"}</td>
                    <td>{"「続けて」「go」「👍」"}</td>
                    <td>
                      {" 「はい、ステージングDBでマイグレーションを実行してください」のように"}
                      <strong>{"何を許可するかを明示"}</strong>
                      {"する "}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"承認ルールを書く"}</td>
                    <td>{"「社外へのメッセージ送信は承認が必要」と広く書く"}</td>
                    <td>
                      {
                        " 「ファイル削除と本番へのデプロイは事前に確認する。それ以外の定型作業は確認なしで進める」と"
                      }
                      <strong>{"対象を具体的に"}</strong>
                      {"書く "}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <p>
              {
                " 公式の検証では、誰も承認する人がいない模擬タスクで「外部の人へのメッセージ送信」を承認必須に列挙したところ、同僚や他チームへの"
              }
              <strong>{"定型の依頼のおよそ半分"}</strong>
              {"を保留しました "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")。 "}
            </p>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" アレックス・アルバート(Anthropic)の助言: "}
                <strong>{"承認が必要なもの(削除など)を最初に宣言"}</strong>
                {"しておく "}
                <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S15">
                  {"S15"}
                </a>
                {", "}
                <a className={styles["src-link"]} href="#S29">
                  {"S29"}
                </a>
                {")。 "}
              </p>{" "}
            </div>{" "}
            <h3 id="s8-3">{"8.3 コードの所有者を明示する"}</h3>{" "}
            <p>
              {" "}
              <strong>{"症状"}</strong>
              {
                ": Fable 5.2 は「そのコードが誰のものか」に敏感です。プロンプトが所有に触れない、または他人のコードとして示すと、"
              }
              <strong>{"既存の構造に継ぎ足し"}</strong>
              {"、重複があっても増やします。近くの問題は"}
              <strong>{"報告するだけで直しません"}</strong>{" "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S3">
                {"S3"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")。 "}
            </p>{" "}
            <p>
              <strong>{"処方"}</strong>
              {": 構造も自分で良くしてほしいなら、所有者であることを書く。"}
            </p>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"markdown"}</div>{" "}
              <pre>
                <code className="language-markdown">
                  <span className={styles.codeLine}>
                    {
                      "あなたはこのコードベースのオーナーであり、長期的なメンテナーです。設計の判断はあなたに任されています。今後もこのコードの上に作り続ける前提で、重複や構造の問題は見つけた時点で整理してください。"
                    }
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <p>
              {
                " Simon Willison は、この発想を「This codebase is yours」と一言で言えば既存コードを遠慮なく改善させられる小ネタとして紹介しています "
              }
              <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S10">
                {"S10"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S12">
                {"S12"}
              </a>
              {")。 "}
            </p>{" "}
            <p>
              <strong>{"効果とトレードオフ"}</strong>
              {":"}
            </p>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"観点"}</th>
                    <th>{"内容"}</th>
                    <th>{"確度"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"重複の統合率"}</td>
                    <td>
                      {
                        " 小さなコーディングタスクで、一文なしでは1割未満、ありでは大きく上昇(引用元により「約半数」「約75%」と記載が分かれる。17章参照) "
                      }
                    </td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S10">
                        {"S10"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"出力トークン"}</td>
                    <td>
                      {
                        " 増加(公式は約70〜80%増と記載。別の解説は約1.5倍と読む。実測した解説記事は約2.5倍) "
                      }
                    </td>
                    <td>
                      {" 公式・観測 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S16">
                        {"S16"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"頼んでいない変更"}</td>
                    <td>
                      {"新規テストやドキュメントの追加が増える。まれに既存機能の挙動まで変える"}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"最終要約"}</td>
                    <td>
                      {"小さな変更が要約から"}
                      <strong>{"抜けることがある"}</strong>
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"「余計なリファクタをしない」との併用"}</td>
                    <td>
                      {
                        " 範囲を絞る規則を足しても、それだけでは打ち消せない(それでも統合した割合は、公式は半数超、検証記事の引用は約3分の1と記載が分かれる) "
                      }
                    </td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S16">
                        {"S16"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <p>
              {" "}
              <strong>
                {"使い方のルール "}
                <span className={[styles.tag, styles.opinion].join(" ")}>{"私見+観測"}</span>
              </strong>
              {": "}
            </p>{" "}
            <ul>
              {" "}
              <li>
                {" "}
                <strong>
                  {"プロジェクトの "}
                  <code>{"CLAUDE.md"}</code>
                  {" にだけ書く。"}
                  <code>{"~/.claude/CLAUDE.md"}</code>
                  {"(全体設定)には書かない"}
                </strong>
                {"。顧客のリポジトリやOSSへのPRでは最小限の変更が望ましいため ("}
                <a className={styles["src-link"]} href="#S16">
                  {"S16"}
                </a>
                {")。 "}
              </li>{" "}
              <li>
                {" チームで共有したくない場合は "}
                <code>{"CLAUDE.local.md"}</code>
                {" に書く ("}
                <a className={styles["src-link"]} href="#S16">
                  {"S16"}
                </a>
                {")。 "}
              </li>{" "}
              <li>
                {" "}
                <strong>{"要約ではなく差分を読む"}</strong>
                {"。最初に "}
                <code>{"git diff --stat"}</code>
                {" で変更ファイル数を確認する ("}
                <a className={styles["src-link"]} href="#S16">
                  {"S16"}
                </a>
                {")。 "}
              </li>{" "}
            </ul>{" "}
            <h3 id="s8-4">{"8.4 長いターンでユーザーに状況を伝える"}</h3>{" "}
            <p>
              {" "}
              <strong>{"症状"}</strong>
              {
                ": ツール呼び出しが続く間、ユーザー向けのテキストが少ない。最初のツール呼び出しの前に、何をするかを言わないことがある "
              }
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")。 "}
            </p>{" "}
            <p>
              <strong>{"処方は3段階"}</strong>
              {"です。上から順に、目的に応じて足します。"}
            </p>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"段階"}</th>
                    <th>{"方法"}</th>
                    <th>{"効果"}</th>
                    <th>{"確度"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"1"}</td>
                    <td>
                      {" クライアントが経過報告を受け取れているか確認する("}
                      <code>{"thinking.display"}</code>
                      {" を "}
                      <code>{"updates"}</code>
                      {" か "}
                      <code>{"summarized"}</code>
                      {" に。6.5 参照) "}
                    </td>
                    <td>{"描画漏れによる「無言」を解消"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"2"}</td>
                    <td>
                      {
                        " ハーネスで、ユーザーに見せる出力のないツールステップが連続したら、ターン限定の system メッセージを差し込む(ヘッダ "
                      }
                      <code>{"mid-conversation-system-clear-at-2026-08-21"}</code>
                      {"、"}
                      <code>{'clear_at: "next_user_message"'}</code>
                      {") "}
                    </td>
                    <td>
                      {"無言の最長区間が"}
                      <strong>{"およそ半分"}</strong>
                      {"に短縮"}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"3"}</td>
                    <td>
                      {
                        " システムプロンプトに、冒頭の一言・途中の短い報告・最後の自己完結した要約を書く "
                      }
                    </td>
                    <td>{"全実行で最初のツール呼び出し前にメッセージ。出力トークンは約20%増"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <p>{"差し込む注意書きの例(筆者作成):"}</p>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"markdown"}</div>{" "}
              <pre>
                <code className="language-markdown">
                  <span className={styles.codeLine}>
                    {
                      "しばらくユーザーに報告していません。今何をしているかを一言で伝えてから、作業を続けてください。"
                    }
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <p>{"システムプロンプト用の文面の例(筆者作成):"}</p>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"markdown"}</div>{" "}
              <pre>
                <code className="language-markdown">
                  <span className={styles.codeLine}>
                    <span className="hljs-section">{"# 状況の伝え方"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {" 作業を始める前に、これから何をするかを一行で伝える。"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {" 作業中は、数回のツール呼び出しごとに現状を一行で報告する。"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {
                      " 最後に、単独で読める短い要約を書く。見つけたこと、やったこと、次にやることを含める。"
                    }
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" "}
                <strong>{"使い分け"}</strong>
                {": これは"}
                <strong>{"人が直接見ている場面"}</strong>
                {
                  "向けです。誰も更新を必要としない長時間の非同期タスクには不要で、むしろ Fable 5.2 はそうした作業に向くと Anthropic は述べています "
                }
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S5">
                  {"S5"}
                </a>
                {
                  ")。Claude Code は、60秒間ツール呼び出しだけが続いたときのリマインダーをハーネス側で自動送信しています "
                }
                <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S16">
                  {"S16"}
                </a>
                {")。 "}
              </p>{" "}
            </div>{" "}
            <h3 id="s8-5">{"8.5 サブエージェントの期待値を設定する"}</h3>{" "}
            <p>
              {" "}
              <strong>{"症状"}</strong>
              {": 委譲を促すプロンプト(Claude Code など)では、Fable 5.2 は"}
              <strong>{"積極的にサブエージェントを起動"}</strong>
              {"し、セッション費用の"}
              <strong>{"大きな割合"}</strong>
              {"をサブエージェントが占めることがあります。"}
              <code>{"xhigh"}</code>
              {" / "}
              <code>{"max"}</code>
              {" では、自分の作業をサブエージェントにレビューさせる挙動も確認されています "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {
                ")。第三者の計測でも、サブエージェントによる独立した再検証が総コストを押し上げる様子が報告されています "
              }
              <span className={[styles.tag, styles.measured].join(" ")}>{"実測"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S15">
                {"S15"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S26">
                {"S26"}
              </a>
              {")。 "}
            </p>{" "}
            <p>
              <strong>{"処方"}</strong>
              {":"}
            </p>{" "}
            <ol>
              {" "}
              <li>
                {" "}
                <strong>{"まず棚卸し"}</strong>
                {
                  ": システムプロンプト、スキル、エージェント定義にある「必ず委譲せよ」という常設指示を読み、不要なものを削る "
                }
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S5">
                  {"S5"}
                </a>
                {
                  ")。Boris Cherny の2026年1月のヒント(依頼に「サブエージェントを使え」と添える)のように、5.2 以前に有効だった習慣は見直しの対象になる "
                }
                <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S19">
                  {"S19"}
                </a>
                {")。 "}
              </li>{" "}
              <li>
                {" "}
                <strong>{"サブエージェントのモデルを確認"}</strong>
                {
                  ": 既定が高価なモデルだと費用が跳ねる。軽い探索・編集・テスト実行は Haiku 5.5 / Sonnet 5.5 + "
                }
                <code>{"low"}</code>
                {" を指定する "}
                <span className={[styles.tag, styles.opinion].join(" ")}>{"私見"}</span>
                {"。 "}
              </li>{" "}
              <li>
                {" "}
                <strong>{"ツール説明を書き換える"}</strong>
                {"(委譲が多すぎる場合のみ)。含める内容は、サブエージェントが"}
                <strong>{"セッション費用に何を足すか"}</strong>
                {"、委譲する価値がある場面とない場面、サブエージェントへの"}
                <strong>{"指示の書き方"}</strong>
                {
                  "。公式の検証では、費用に焦点を当てた長めの説明で、high effort のサブエージェント数が"
                }
                <strong>{"およそ半分"}</strong>
                {"になった "}
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S5">
                  {"S5"}
                </a>
                {")。 "}
              </li>{" "}
            </ol>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"markdown"}</div>{" "}
              <pre>
                <code className="language-markdown">
                  <span className={styles.codeLine}>
                    <span className="hljs-section">{"# サブエージェントの使い方"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {
                      " サブエージェントを1つ起動するたびに、セッション全体の費用と所要時間が増える。"
                    }
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {
                      " 次の場合だけ使う: 互いに独立した作業を並列に進められる、または多数のファイルにまたがる調査で本体の文脈を汚したくない。"
                    }
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {
                      " 次の場合は自分で直接やる: 数ファイル以内の確認、単純な検索、すぐ終わる編集。"
                    }
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {
                      " 起動するときは、目的、渡すファイルや範囲、期待する出力の形式、完了条件を指示に含める。"
                    }
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <h3 id="s8-6">{"8.6 注意書きの積み上がりを防ぐ"}</h3>{" "}
            <p>
              {" "}
              <strong>{"症状"}</strong>
              {
                ": メモリ、ノート、指示ファイルに過去の注意が積み上がり、Fable 5.2 がそれを忠実に守って"
              }
              <strong>{"不要な承認を求める"}</strong>
              {"。複数のエージェントが協働する構成で目立つ "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")。 "}
            </p>{" "}
            <p>
              <strong>{"処方"}</strong>
              {":"}
            </p>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"対処"}</th>
                    <th>{"具体策"}</th>
                    <th>{"確度"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"古い指示を消す"}</td>
                    <td>{"理由が失効した「絶対に再試行しない」などをメモリから削除する"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"承認不要の手順を名指しする"}</td>
                    <td>{"「もっと自由に動け」ではなく、定型の手順を具体的に列挙する"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"検証・停止条件を見直す"}</td>
                    <td>
                      {
                        " 「最初のエラーで止めてレビュー」のような条件は自律作業を止める。不要なものは削除・限定する "
                      }
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"「絶対に〜しない」を書き換える"}</td>
                    <td>
                      {" "}
                      <strong>{"絶対"}</strong>
                      {"と書くと、モデルは例外なしの規則として扱う。範囲と理由を添える "}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"diff"}</div>{" "}
              <pre>
                <code className="language-diff">
                  <span className={styles.codeLine}>
                    <span className="hljs-deletion">
                      {"- 失敗したコマンドは絶対に再実行しない。"}
                    </span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-addition">
                      {
                        "+ ./deploy.sh は冪等ではないため、失敗しても再実行しない。冪等なコマンド(テスト、ビルド、読み取り系)は再試行してよい。"
                      }
                    </span>
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <p>
              {" 公式の検証では、過去メモに「再試行しない」を含めた状態で、再試行できる場面でも"}
              <strong>{"再試行しない傾向"}</strong>
              {"が出ました(そのメモがない状態では、ほぼ毎回再試行) "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S16">
                {"S16"}
              </a>
              {")。 "}
            </p>{" "}
            <h3 id="s8-7">{"8.7 旧モデル向けの指示とハーネスを見直す"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"見直す対象"}</th>
                    <th>{"何が起きるか"}</th>
                    <th>{"対処"}</th>
                    <th>{"確度"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"常設の委譲指示"}</td>
                    <td>{"委譲が過剰になり、費用が増える"}</td>
                    <td>
                      {"読んで、不要なら削除("}
                      <a href="#s8-5">{"8.5"}</a>
                      {")"}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"プロンプトに見せるトークン予算"}</td>
                    <td>
                      {
                        " 予算の大きさでモデルの消費量が変わる。high / xhigh で大きな予算を外したところ、同等の性能でコストが下がった "
                      }
                    </td>
                    <td>
                      {" 予算表示なしで試す。※これは"}
                      <strong>{"プロンプト上のテキスト"}</strong>
                      {"の話で、API の task budgets(ベータ)ではない "}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"過去ターンを編集するハーネス"}</td>
                    <td>{"思考ブロックが無効になる"}</td>
                    <td>
                      {"履歴を追記のみにする("}
                      <a href="#s7">{"7章"}</a>
                      {")"}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {"「回答済みとして扱え」系の指示(Opus 5.5 のチャット用に紹介されたもの)"}
                    </td>
                    <td>
                      {" high で、追質問に対する思考が減る。"}
                      <strong>{"自分の以前の誤りを指摘しにくくなる"}</strong>{" "}
                    </td>
                    <td>
                      {"自己点検を残したいなら入れない。入れるなら誤り指摘が保たれるかを先に測る"}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"「考えずに直接答えて」"}</td>
                    <td>{"medium 以上では思考を止められない"}</td>
                    <td>{"指示を削り、effort を下げる"}</td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"文体の厳格な上限(例: 1文20語以内)"}</td>
                    <td>{"文章がぶつ切りになる"}</td>
                    <td>{"規則を外してから、8.8 のような趣旨ベースの指示を足す"}</td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"積み上がったルール・メモ・メモリ"}</td>
                    <td>{"古い警戒心が行動を縛る"}</td>
                    <td>
                      {" 理由が失効したものを削除し、絶対表現には範囲と理由を添える("}
                      <a href="#s8-6">{"8.6"}</a>
                      {") "}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h3 id="s8-8">{"8.8 最終報告を読みやすくする"}</h3>{" "}
            <p>
              {" 長い作業の最終報告を読む人は、ツール呼び出しやファイルを見ていないことが多く、"}
              <strong>{"報告単体で意味が通る"}</strong>
              {
                "必要があります。テスターは文章を、5.1 より上、Opus 5.5 と同程度に明瞭と評価しています "
              }
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")。 "}
            </p>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"markdown"}</div>{" "}
              <pre>
                <code className="language-markdown">
                  <span className={styles.codeLine}>
                    <span className="hljs-section">{"# 読み手に伝わる書き方"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {
                      " 読み手は、あなたのツール呼び出し、推論、開いたファイルを見ていない。別の仕事から切り替えて読むかもしれない。報告は単独で理解できる形にする。"
                    }
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {
                      " 重要な点を最初の数文に置く。1行目で使った言葉が、12行目になって初めて分かる、という並べ方をしない。"
                    }
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {
                      " 平易な言葉と完結した文で書く。作業中に自分で作った用語や略語を使わない。ものごとは、初めて読む人に通じる言い方で説明する。"
                    }
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {
                      " 1文に1つの考え、能動態、同じものには同じ言葉を使う(簡潔な技術英語の考え方に近い)。つながる考えは流れる文章で書き、箇条書きは独立した項目の列挙に限る。"
                    }
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {" 必要のない詳細は省き、簡潔にする。ただし、判断に必要な文脈は必ず入れる。"}
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <p>
              {" 公式の検証では、この種の指示で最終報告の密度が下がり、セミコロンも減りました "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")。"}
              <strong>{"Claude Code は、この種の節を Fable 5.2 では自動送信していません"}</strong>
              {"ので、報告の読みやすさを重視するなら自分で足します "}
              <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S16">
                {"S16"}
              </a>
              {")。 "}
            </p>{" "}
            <h3 id="s8-9">{"8.9 拒否(refusal)への対応"}</h3>{" "}
            <p>
              {"分類器による拒否の扱いは、"}
              <a href="#s12">{"12章"}</a>
              {"でまとめて解説します。"}
            </p>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {
                  " 一般的なプロンプト技法(明確さ、例示、XMLタグ、段階的思考など)は、全モデル共通のベストプラクティス("
                }
                <a className={styles["src-link"]} href="#S46">
                  {"S46"}
                </a>
                {")に従います。本書は Fable 5.2 に固有の論点に絞っています。 "}
              </p>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="s9">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"9"}</span>{" "}
              <h2 id="s9-heading">{"Step 7: Claude Code 運用"}</h2>{" "}
            </div>{" "}
            <h3 id="s9-1">{"9.1 コマンド早見表"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"目的"}</th>
                    <th>{"操作"}</th>
                    <th>{"補足"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"バージョン確認"}</td>
                    <td>
                      <code>{"claude --version"}</code>
                    </td>
                    <td>
                      {" Fable 5.2 は "}
                      <strong>{"v2.1.321 以降"}</strong>
                      {" ("}
                      <a className={styles["src-link"]} href="#S7">
                        {"S7"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S8">
                        {"S8"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"モデル選択"}</td>
                    <td>
                      <code>{"/model fable"}</code>
                    </td>
                    <td>
                      {"Fable アクセスが必要 ("}
                      <a className={styles["src-link"]} href="#S7">
                        {"S7"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"effort の変更"}</td>
                    <td>
                      <code>{"/effort"}</code>
                    </td>
                    <td>
                      {" Claude Code では Fable 5.2 は "}
                      <strong>{"medium から開始"}</strong>
                      {" ("}
                      <a className={styles["src-link"]} href="#S16">
                        {"S16"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"fast mode の切替"}</td>
                    <td>
                      <code>{"/fast"}</code>
                    </td>
                    <td>
                      {" 最大2.5倍の生成速度。プレミアム価格 ("}
                      <a className={styles["src-link"]} href="#S6">
                        {"S6"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S8">
                        {"S8"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"advisor の設定"}</td>
                    <td>
                      <code>{"/advisor"}</code>
                      {"、または "}
                      <code>{"--advisor"}</code>
                      {" フラグ"}
                    </td>
                    <td>
                      {"組み合わせの制約は3.4 ("}
                      <a className={styles["src-link"]} href="#S7">
                        {"S7"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"指示ファイルの監査"}</td>
                    <td>
                      <code>{"/doctor prompt-audit"}</code>
                    </td>
                    <td>
                      {" v2.1.283 以降。何も書き換えず差分案を提示する ("}
                      <a className={styles["src-link"]} href="#S16">
                        {"S16"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"非対話での実行"}</td>
                    <td>
                      <code>{'claude -p "..." --model claude-fable-5-2 --effort medium'}</code>
                    </td>
                    <td>
                      {" "}
                      <code>{"--effort"}</code>
                      {" は検証記事での使用例 ("}
                      <a className={styles["src-link"]} href="#S16">
                        {"S16"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"非対話 + fast mode"}</td>
                    <td>
                      {" "}
                      <code>
                        {
                          'claude -p "..." --model claude-fable-5-2 --settings \'{"fastMode": true}\''
                        }
                      </code>{" "}
                    </td>
                    <td>
                      {"公式ドキュメントの記載 ("}
                      <a className={styles["src-link"]} href="#S8">
                        {"S8"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h3 id="s9-2">{"9.2 Step A: Claude Code が自動で送っている指示を知る"}</h3>{" "}
            <p>
              {
                " 検証記事(v2.1.322 で確認)によると、Fable 5.2 を選ぶと、Claude Code は次のような指示をバンドルして送ります "
              }
              <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S16">
                {"S16"}
              </a>
              {")。 "}
            </p>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"公式ガイドの論点"}</th>
                    <th>{"Claude Code での扱い"}</th>
                    <th>{"あなたがやること"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"作業の完遂"}</td>
                    <td>
                      <code>{"# Finishing work"}</code>
                      {" の節を自動送信"}
                    </td>
                    <td>
                      <code>{"CLAUDE.md"}</code>
                      {" に重ねて書かない"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"注意の積み上がり"}</td>
                    <td>
                      {" "}
                      <code>{"# Memory, notes and feedback"}</code>
                      {" の節(Claude 自身が書くメモが対象) "}
                    </td>
                    <td>
                      {" "}
                      <strong>
                        {"自分が書いた "}
                        <code>{"CLAUDE.md"}</code>
                        {" は対象外"}
                      </strong>
                      {"なので、自分で棚卸しする "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"長いターンの無言"}</td>
                    <td>{"ツール呼び出しだけが60秒続いたときのリマインダー"}</td>
                    <td>{"追加不要"}</td>
                  </tr>
                  <tr>
                    <td>{"最終報告の読みやすさ"}</td>
                    <td>
                      <strong>{"送られない"}</strong>
                    </td>
                    <td>
                      {"必要なら 8.8 を "}
                      <code>{"CLAUDE.md"}</code>
                      {" に足す"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"コードの所有"}</td>
                    <td>
                      <strong>{"送られない"}</strong>
                    </td>
                    <td>
                      {" 必要なら 8.3 を"}
                      <strong>{"プロジェクトの"}</strong> <code>{"CLAUDE.md"}</code>
                      {" に足す "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"effort の調整"}</td>
                    <td>
                      {"指示ではなく "}
                      <code>{"/effort"}</code>
                      {" で行う"}
                    </td>
                    <td>{"5章に従う"}</td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h3 id="s9-3">
              {"9.3 Step B: "}
              <code>{"CLAUDE.md"}</code>
              {" を棚卸しする"}
            </h3>{" "}
            <p>
              {"5.1 / Opus 5.5 時代の指示が残っていると、5.2 ではコストや副作用の原因になります。"}
            </p>{" "}
            <ol>
              {" "}
              <li>
                {" Fable 5.2 を選んだ状態で "}
                <code>{"/doctor prompt-audit"}</code>
                {" を実行する。"}
                <code>{"CLAUDE.md"}</code>
                {"、"}
                <code>{"CLAUDE.local.md"}</code>
                {"、"}
                <code>{"AGENTS.md"}</code>
                {"、"}
                <code>{".claude/"}</code>
                {
                  " 配下(ルール、スキル、コマンド、サブエージェント、出力スタイル)を読み、差分案つきの報告を返す。"
                }
                <strong>{"承認するまで何も変更しない"}</strong>{" "}
                <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S16">
                  {"S16"}
                </a>
                {")。 "}
              </li>{" "}
              <li>
                {" 検証記事では、典型的な旧モデル向けの5行に対して次の判定が出ました(要旨) "}
                <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S16">
                  {"S16"}
                </a>
                {")。 "}
              </li>{" "}
            </ol>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"指示の種類"}</th>
                    <th>{"判定"}</th>
                    <th>{"提案"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"「考えずに直接答えろ」"}</td>
                    <td>{"高: 削除"}</td>
                    <td>{"削る(medium 以上では効かず、速度が目的なら effort を下げる)"}</td>
                  </tr>
                  <tr>
                    <td>{"タスクごとのトークン予算を提示"}</td>
                    <td>{"高: 削除"}</td>
                    <td>{"削る"}</td>
                  </tr>
                  <tr>
                    <td>{"「すべての検索とレビューでサブエージェントを使え」"}</td>
                    <td>{"中: 書き換え"}</td>
                    <td>{"「多数のファイルにまたがる場合に使い、小さな確認は直接やる」へ"}</td>
                  </tr>
                  <tr>
                    <td>{"「1文20語以内」などの文体の上限"}</td>
                    <td>{"中: 書き換え"}</td>
                    <td>{"「短く平易な文で書く」へ"}</td>
                  </tr>
                  <tr>
                    <td>{"「失敗したコマンドは再実行するな」"}</td>
                    <td>{"低: 要確認"}</td>
                    <td>{"理由と範囲を添える"}</td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <ol start={3}>
              {" "}
              <li>
                {" 指示は"}
                <strong>{"1行ずつ外して"}</strong>
                {"評価しながら進める("}
                <a href="#s13">{"13章"}</a>
                {")。 "}
              </li>{" "}
            </ol>{" "}
            <h3 id="s9-4">
              {"9.4 Step C: プロジェクトの "}
              <code>{"CLAUDE.md"}</code>
              {" の雛形"}
            </h3>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"markdown"}</div>{" "}
              <pre>
                <code className="language-markdown">
                  <span className={styles.codeLine}>
                    <span className="hljs-section">{"# プロジェクト概要"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {
                      "(何のためのシステムか、主要ディレクトリ、ビルドとテストのコマンドを3〜10行で書く)"
                    }
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-section">{"# 作業ルール"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {" 変更前後で同じテストを実行し、結果を報告する。"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {
                      " ファイル削除、本番へのデプロイ、スキーマ変更、force push は事前に確認する。それ以外の定型作業は確認なしで進めてよい。"
                    }
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-bullet">{"-"}</span>
                    {
                      " 失敗したら原因を読んで直してから再実行する。冪等でない処理(./deploy.sh など)は、失敗後に再実行しない。"
                    }
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-section">{"# コードの所有"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {
                      "あなたはこのリポジトリのオーナー兼メンテナーです。設計の判断は任せます。重複や構造の問題は見つけた時点で整理してください。"
                    }
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-section">{"# 報告の書き方"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {
                      "読み手は作業の途中経過を見ていません。報告は単独で理解できるように書き、重要な点を最初の数文に置いてください。"
                    }
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" "}
                <strong>{"注意"}</strong>
                {": 「コードの所有」の節は、"}
                <a href="#s8-3">{"8.3"}</a>
                {" のとおり、最小限の変更を求める場面では"}
                <strong>{"入れない"}</strong>
                {"でください。 "}
              </p>{" "}
            </div>{" "}
            <h3 id="s9-5">{"9.5 Step D: 1日の作業フロー"}</h3>{" "}
            <p>
              {
                " Boris Cherny(Claude Code の作者)のヒントと、Fable 5.2 固有の知見を合わせた流れです "
              }
              <span className={[styles.tag, styles.observed].join(" ")}>{"観測+私見"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S16">
                {"S16"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S19">
                {"S19"}
              </a>
              {")。 "}
            </p>{" "}
            <div className={styles["diagram-card"]}>
              {" "}
              <div className={styles["diagram-title"]}>{"図6 1日の作業フロー"}</div>{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram
                  id="fable52-diagram-5"
                  chart={DIAGRAM_5}
                  theme="base"
                  themeVariables={LIGHT_THEME}
                />
              </div>{" "}
            </div>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"手順"}</th>
                    <th>{"やること"}</th>
                    <th>{"根拠"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"計画"}</td>
                    <td>
                      {
                        " 複雑なタスクは plan mode から始め、計画に力を注ぐ。別のセッションを「スタッフエンジニア」役にして計画をレビューさせる "
                      }
                    </td>
                    <td>
                      {" Boris Cherny ("}
                      <a className={styles["src-link"]} href="#S19">
                        {"S19"}
                      </a>
                      {")、コミュニティの集約 ("}
                      <a className={styles["src-link"]} href="#S21">
                        {"S21"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S47">
                        {"S47"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"反復"}</td>
                    <td>{"計画・反復は medium、長い無人区間は high(5.5 参照)"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"検証"}</td>
                    <td>
                      {" テストや型検査など"}
                      <strong>{"機械で確認できる手段"}</strong>
                      {
                        "を持たせる。「動くことを示して」と頼み、main と作業ブランチの挙動の差を比較させる "
                      }
                    </td>
                    <td>
                      {"Boris Cherny ("}
                      <a className={styles["src-link"]} href="#S19">
                        {"S19"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"差分レビュー"}</td>
                    <td>
                      {" "}
                      <strong>{"要約ではなく差分を読む"}</strong>
                      {"。"}
                      <code>{"git diff --stat"}</code>
                      {" から確認する "}
                    </td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")、検証記事 ("}
                      <a className={styles["src-link"]} href="#S16">
                        {"S16"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h3 id="s9-6">{"9.6 Step E: 並列化と作業ツリー"}</h3>{" "}
            <p>
              {
                " Boris Cherny は、3〜5個の git worktree を同時に使い、それぞれに独立した Claude セッションを走らせる方法を第一のヒントに挙げています "
              }
              <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S19">
                {"S19"}
              </a>
              {")。 "}
            </p>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"bash"}</div>{" "}
              <pre>
                <code className="language-bash">
                  <span className={styles.codeLine}>
                    <span className="hljs-comment">
                      {"# 作業ツリーを分けて、並行して別のブランチで作業する"}
                    </span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"git worktree add ../myrepo-feature-a -b feature-a"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"git worktree add ../myrepo-feature-b -b feature-b"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-comment">
                      {"# それぞれのディレクトリで Claude Code を起動する"}
                    </span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-built_in">{"cd"}</span>
                    {" ../myrepo-feature-a && claude --model claude-fable-5-2"}
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" "}
                <strong>
                  {"Fable 5.2 の注意 "}
                  <span className={[styles.tag, styles.opinion].join(" ")}>{"私見"}</span>
                </strong>
                {
                  ": 並列セッションが増えるほど、利用枠(Fable は週次上限の最大50%)と費用を速く消費します。"
                }
                <strong>{"主要な1〜2本だけ Fable、残りは Opus 5.5"}</strong>
                {" にすると現実的です。 "}
              </p>{" "}
            </div>{" "}
            <h3 id="s9-7">{"9.7 Step F: advisor と fast mode を使う"}</h3>{" "}
            <ul>
              {" "}
              <li>
                {" "}
                <strong>{"advisor"}</strong>
                {": Sonnet を主役にして難所だけ Fable に相談する、といった構成で、"}
                <strong>{"Fable を全工程で回さずに済む"}</strong>{" "}
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S7">
                  {"S7"}
                </a>
                {")。組み合わせの制約は"}
                <a href="#s3-4">{"3.4"}</a>
                {"。 "}
              </li>{" "}
              <li>
                {" "}
                <strong>
                  {"fast mode("}
                  <code>{"/fast"}</code>
                  {")"}
                </strong>
                {": 最大2.5倍の生成速度で、価格は標準の2倍(入力 $16 / 出力 $80)。Fable 5.2 では、"}
                <strong>{"Fable 5.2 を使っているときにオンにした場合のみ"}</strong>
                {
                  "設定が保持される。現在のモデルが fast mode に対応しない場合、API 利用では Claude Code が Opus に切り替える "
                }
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S1">
                  {"S1"}
                </a>
                {", "}
                <a className={styles["src-link"]} href="#S8">
                  {"S8"}
                </a>
                {")。 "}
              </li>{" "}
              <li>
                {" "}
                <strong>{"effort との関係"}</strong>
                {": fast mode は"}
                <strong>{"速度"}</strong>
                {"、effort は"}
                <strong>{"思考の深さ"}</strong>
                {"を変える。単純な作業では、fast mode と低い effort の併用で最高速になる "}
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S8">
                  {"S8"}
                </a>
                {")。 "}
              </li>{" "}
            </ul>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" "}
                <strong>
                  <span className={[styles.tag, styles.opinion].join(" ")}>{"私見"}</span>
                </strong>
                {": fast mode は「"}
                <strong>{"人が待っていて、その待ち時間のコストがトークン代より高い"}</strong>
                {"」場面に限定します。無人の長時間作業には、単価が2倍になるだけなので向きません。 "}
              </p>{" "}
            </div>{" "}
            <h3 id="s9-8">{"9.8 Step G: フックと権限"}</h3>{" "}
            <p>
              {
                " Claude Code の hooks で、編集後の自動整形や禁止操作のブロックをかけられます。Boris Cherny は、危険な権限スキップより"
              }
              <strong>{"安全なコマンドを事前許可"}</strong>
              {"する運用を勧めています "}
              <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S21">
                {"S21"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S47">
                {"S47"}
              </a>
              {")。 "}
            </p>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"json"}</div>{" "}
              <pre>
                <code className="language-json">
                  <span className={styles.codeLine}>
                    <span className="hljs-punctuation">{"{"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  "}
                    <span className="hljs-attr">{'"hooks"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-punctuation">{"{"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-attr">{'"PostToolUse"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-punctuation">{"["}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"      "}
                    <span className="hljs-punctuation">{"{"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-attr">{'"matcher"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-string">{'"Write|Edit"'}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-attr">{'"hooks"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-punctuation">{"["}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"          "}
                    <span className="hljs-punctuation">{"{"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"            "}
                    <span className="hljs-attr">{'"type"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-string">{'"command"'}</span>
                    <span className="hljs-punctuation">{","}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"            "}
                    <span className="hljs-attr">{'"command"'}</span>
                    <span className="hljs-punctuation">{":"}</span>{" "}
                    <span className="hljs-string">
                      {
                        '"jq -j \'.tool_input.file_path, \\"\\\\u0000\\"\' | xargs -0 sh -c \'for file do case \\"$file\\" in *.ts|*.tsx|*.js) npx prettier --write -- \\"$file\\";; esac; done\' sh"'
                      }
                    </span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"          "}
                    <span className="hljs-punctuation">{"}"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-punctuation">{"]"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"      "}
                    <span className="hljs-punctuation">{"}"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-punctuation">{"]"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"  "}
                    <span className="hljs-punctuation">{"}"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-punctuation">{"}"}</span>
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" "}
                <strong>{"注意"}</strong>
                {
                  ": 上は考え方を示す例です。hooks の設定スキーマと入力 JSON の形はバージョンで変わりうるため、必ず公式の hooks ドキュメント("
                }
                <a className={styles["src-link"]} href="#S43">
                  {"S43"}
                </a>
                {")で確認し、安全な環境で試してから使ってください。 "}
              </p>{" "}
            </div>{" "}
            <h3 id="s9-9">{"9.9 Step H: Anthropic 社内の使い方のヒント"}</h3>{" "}
            <p>
              {" Anthropic の Alex Albert が公開した使い方(Latent Space の要約経由)です "}
              <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S15">
                {"S15"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S29">
                {"S29"}
              </a>
              {")。 "}
            </p>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"ヒント"}</th>
                    <th>{"内容"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"最初に反論させる"}</td>
                    <td>
                      {"実装の前に「このアイデアの何が問題か」を聞く。Fable は押し返してくる"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"effort"}</td>
                    <td>{"まず medium か high で始め、xhigh は最難関だけにする"}</td>
                  </tr>
                  <tr>
                    <td>{"承認の宣言"}</td>
                    <td>
                      {"承認が必要な操作(削除など)を"}
                      <strong>{"最初に"}</strong>
                      {"宣言する"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"まとめて任せる"}</td>
                    <td>{"プロジェクト全体を渡し、数時間走らせる"}</td>
                  </tr>
                  <tr>
                    <td>{"全体の棚卸し"}</td>
                    <td>
                      {
                        " 「プロジェクト全体を読み、壊れている点・不整合・非効率・不要になったものを洗い出し、確信があるものは直し、残りは一覧にして私のレビューに回して」のような依頼(筆者による言い換え) "
                      }
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="s10">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"10"}</span>{" "}
              <h2 id="s10-heading">{"Step 8: マルチエージェントと長時間実行"}</h2>{" "}
            </div>{" "}
            <p>
              {" Fable 5.2 が最も得意とするのは、"}
              <strong>{"数時間〜数日続く、曖昧で大きな作業"}</strong>
              {"です "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S1">
                {"S1"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S2">
                {"S2"}
              </a>
              {")。この章では、それを安全に・安く回す設計を扱います。 "}
            </p>{" "}
            <h3 id="s10-1">{"10.1 4つの構成パターン"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"パターン"}</th>
                    <th>{"構成"}</th>
                    <th>{"向く場面"}</th>
                    <th>{"根拠"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"A. 指揮役 + 作業者"}</td>
                    <td>
                      {
                        " Fable 5.2 が計画・分担・検証を行い、Opus 5.5 / Sonnet 5.5 / Haiku 5.5 が実行する "
                      }
                    </td>
                    <td>{"並列にできる作業が多い。費用を抑えたい"}</td>
                    <td>
                      {" Orchestrator として公式に推奨 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S39">
                        {"S39"}
                      </a>
                      {")。Fable を Opus 5.5 サブエージェントの指揮役に使う実践 ("}
                      <a className={styles["src-link"]} href="#S15">
                        {"S15"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S30">
                        {"S30"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"B. 小型メイン + Fable の助言"}</td>
                    <td>{"Sonnet / Haiku / Opus が主担当で、難所だけ Fable に相談する"}</td>
                    <td>{"大半は易しく、一部だけ難しい"}</td>
                    <td>
                      {" Advisor として公式に推奨 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S7">
                        {"S7"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"C. Fable 単独の長時間実行"}</td>
                    <td>{"Fable 5.2 が数時間の作業を自走する"}</td>
                    <td>{"監査、移行、調査など"}</td>
                    <td>
                      {" Uber の10〜12時間のセキュリティ監査で約170のレビューエージェントが稼働 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"D. 大規模スウォーム"}</td>
                    <td>{"リード1体 + ヘルパー多数が共有状態で協調する"}</td>
                    <td>{"機械検証できる巨大な目標(証明、移行)"}</td>
                    <td>
                      {" Fermat の最終定理の形式化で1,000体 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S17">
                        {"S17"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <div className={styles["diagram-card"]}>
              {" "}
              <div className={styles["diagram-title"]}>{"図7 マルチエージェント構成"}</div>{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram
                  id="fable52-diagram-6"
                  chart={DIAGRAM_6}
                  theme="base"
                  themeVariables={LIGHT_THEME}
                />
              </div>{" "}
            </div>{" "}
            <h3 id="s10-2">{"10.2 事例から学べる設計原則"}</h3>{" "}
            <h4>{"事例1: Fermat の最終定理の形式化(Anthropic)"}</h4>{" "}
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
                    <td>{"規模"}</td>
                    <td>
                      {
                        " リード1体 + ヘルパー999体。初回の形式化は11日かかったが、今回は約30時間(リード+ヘルパーの内訳は "
                      }
                      <a className={styles["src-link"]} href="#S18">
                        {"S18"}
                      </a>
                      {") "}
                    </td>
                    <td>
                      {" 公式・観測 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S18">
                        {"S18"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"与えた情報"}</td>
                    <td>
                      {
                        " 60個の命題の一覧、古典的な証明経路の一文スケッチ、必要な定義、以前の形式化で証明済みの47個の補題、リードとヘルパーの役割。"
                      }
                      <strong>{"それ以外の手順は与えていない"}</strong>{" "}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {" の脚注)"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"比較"}</td>
                    <td>{"Opus 5.5 を同じ構成で動かすと、18時間で26%しか進まなかった"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"再開"}</td>
                    <td>
                      {"18時間の時点で、両チームとも最後の保存から12時間分を再開して継続した"}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"ハーネスの工夫"}</td>
                    <td>{"リードに自動の時間リマインダーを19回送った。研究者による誘導はなし"}</td>
                    <td>
                      {"観測 ("}
                      <a className={styles["src-link"]} href="#S18">
                        {"S18"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <p>
              {" "}
              <strong>{"原則"}</strong>
              {": (1) "}
              <strong>{"機械で検証できる完了条件"}</strong>
              {"(証明検査器)を置く。(2) 役割と目標を絞って与え、"}
              <strong>{"協調の仕組みはモデルに任せる"}</strong>
              {"。(3) "}
              <strong>{"チェックポイントから再開できる"}</strong>
              {"設計にする。(4) 時間の経過を知らせる仕組みをハーネスに持たせる。 "}
            </p>{" "}
            <h4>{"事例2: 官僚化したエージェント群(Ethan Mollick)"}</h4>{" "}
            <p>
              {
                " Wharton の Ethan Mollick は、25,000回のエージェント起動で450以上の3Dの世界を作る実験を行いました "
              }
              <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S13">
                {"S13"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S14">
                {"S14"}
              </a>
              {
                ")。作った世界の磨き込みを頼むと、エージェントが厳格なレビュー規則を作り、規則集は8万7千語に膨らんで"
              }
              <strong>{"開発が止まりかけました"}</strong>
              {"。彼は、"}
              <strong>{"別のエージェントチームにプロセスを見直させる"}</strong>
              {"ことで速度を取り戻しています "}
              <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S14">
                {"S14"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S48">
                {"S48"}
              </a>
              {")。 "}
            </p>{" "}
            <p>
              {" "}
              <strong>{"原則"}</strong>
              {": エージェント群は"}
              <strong>{"自分でプロセスを増殖させる"}</strong>
              {"ことがある。進捗と規則の量を監視し、"}
              <strong>{"独立したレビュー役"}</strong>
              {"(別チーム・別セッション)に簡素化させる。 "}
            </p>{" "}
            <h4>{"事例3: 検証の過剰さがコストになる(SemiAnalysis)"}</h4>{" "}
            <p>
              {" Opus 5.5 や Fable 5.1 が約20件のテストで止まる場面で、Fable 5.2 は"}
              <strong>{"数百〜数千件のテストを書き、サブエージェントで独立に再導出"}</strong>
              {"しました。品質には効きましたが、"}
              <strong>{"そのぶんの費用は避けられません"}</strong>{" "}
              <span className={[styles.tag, styles.measured].join(" ")}>{"実測"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S15">
                {"S15"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S26">
                {"S26"}
              </a>
              {")。 "}
            </p>{" "}
            <p>
              {" "}
              <strong>{"原則"}</strong>
              {
                ": 検証の深さに**上限(ターン数・予算・時間)**を設ける。低リスクの作業では検証を軽くするよう明示する。 "
              }
            </p>{" "}
            <h4>{"事例4: 自己評価の弱さ(Ethan Mollick)"}</h4>{" "}
            <p>
              {" Mollick は、Fable 5.2 が専門家レベルの作業を広くこなす一方、"}
              <strong>{"自分の成果物の出来や長さを判断するのが苦手"}</strong>
              {
                "で、論文が182ページに膨らむなど、取捨選択を誤ると報告しています。「ジャグド(ギザギザの)AGI」という言葉で表現しています "
              }
              <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S14">
                {"S14"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S49">
                {"S49"}
              </a>
              {")。 "}
            </p>{" "}
            <p>
              {" "}
              <strong>{"原則"}</strong>
              {": 長さ、構成、趣味・品位の判断は"}
              <strong>{"人間が担う"}</strong>
              {"。作業の「量」ではなく「出来」を評価するゲートを、人が持つ。 "}
            </p>{" "}
            <h3 id="s10-3">{"10.3 スウォーム設計チェックリスト"}</h3>{" "}
            <div className={styles["check-progress"]} data-progress-panel="">
              <span className={styles.count} data-testid="check-progress">
                <span data-check-count>0</span>
                {" / "}
                <span data-check-total>8</span>
                {" 完了"}
              </span>
              <div className={styles.bar}>
                <i data-check-bar style={{ width: "0%" }} />
              </div>
            </div>
            <ul className={styles.checklist}>
              {" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    <strong>{"完了条件が機械で検証できる"}</strong>
                    {"(テスト、型検査、形式検証、ルーブリックの自動採点)"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"役割を明確にした(リード、ヘルパー、検証役、独立したレビュー役)"}</span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    <strong>{"共有状態"}</strong>
                    {"(タスク台帳、進捗、チェックポイント)を外部に保存し、再開できる"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    {"エージェントを**隔離環境(サンドボックス)**で動かし、権限を最小にした"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"上限を設けた(最大ターン数、最大サブエージェント数、予算、時間)"}</span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    {"サブエージェントの"}
                    <strong>{"既定モデルと effort"}</strong>
                    {" を明示した(軽作業は小型 + low)"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"人間の承認ゲート(不可逆操作、公開、課金)を置いた"}</span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"プロセスの肥大化(規則・レビューの増殖)を監視する指標を持った"}</span>
                </label>{" "}
              </li>{" "}
            </ul>{" "}
            <h3 id="s10-4">{"10.4 Managed Agents と advisor の設定を更新する"}</h3>{" "}
            <p>
              {" Claude Managed Agents で advisor を設定している場合、advisor のモデル名は"}
              <strong>{"モデルIDとは別に"}</strong>
              {"更新が必要です。エージェントのモデルを Fable 5.2 に変えるときは、advisor も "}
              <code>{"claude-fable-5-2"}</code>
              {" または "}
              <code>{"claude-mythos-5-2"}</code>
              {" に変更します "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S3">
                {"S3"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S4">
                {"S4"}
              </a>
              {")。公式のオーケストレーションの解説は "}
              <a className={styles["src-link"]} href="#S39">
                {"S39"}
              </a>
              {" を参照してください。 "}
            </p>{" "}
          </section>{" "}
          <section className={styles.section} id="s11">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"11"}</span>{" "}
              <h2 id="s11-heading">{"Step 9: コスト設計"}</h2>{" "}
            </div>{" "}
            <h3 id="s11-1">{"11.1 費用の式"}</h3> <p>{"1タスクの総額は、次の合計で考えます。"}</p>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"項目"}</th>
                    <th>{"式"}</th>
                    <th>{"備考"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"未キャッシュの入力"}</td>
                    <td>{"トークン数 × $8 / 百万"}</td>
                    <td>{"標準速度"}</td>
                  </tr>
                  <tr>
                    <td>{"キャッシュ読み出し"}</td>
                    <td>{"トークン数 × $0.20 / 百万"}</td>
                    <td>{"入力単価の0.025倍"}</td>
                  </tr>
                  <tr>
                    <td>{"キャッシュ書き込み"}</td>
                    <td>{"5分: $10 / 1時間: $16(百万あたり)"}</td>
                    <td>{"最小512トークン"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"出力("}
                      <strong>{"思考 + 本文"}</strong>
                      {")"}
                    </td>
                    <td>{"トークン数 × $40 / 百万"}</td>
                    <td>{"思考トークンも出力として課金される"}</td>
                  </tr>
                  <tr>
                    <td>{"サブエージェント"}</td>
                    <td>{"上記を各エージェントについて合算"}</td>
                    <td>{"費用の大きな割合を占めることがある"}</td>
                  </tr>
                  <tr>
                    <td>{"再試行・フォールバック"}</td>
                    <td>{"上記を再実行した分"}</td>
                    <td>{"切替でキャッシュが失われる場合がある"}</td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"python"}</div>{" "}
              <pre>
                <code className="language-python">
                  <span className={styles.codeLine}>
                    {"RATES = {  "}
                    <span className="hljs-comment">{"# USD / 百万トークン(公式価格表)"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-string">{'"standard"'}</span>
                    {": {"}
                    <span className="hljs-string">{'"in"'}</span>
                    {": "}
                    <span className="hljs-number">{"8.0"}</span>
                    {", "}
                    <span className="hljs-string">{'"out"'}</span>
                    {": "}
                    <span className="hljs-number">{"40.0"}</span>
                    {", "}
                    <span className="hljs-string">{'"cache_read"'}</span>
                    {": "}
                    <span className="hljs-number">{"0.20"}</span>
                    {", "}
                    <span className="hljs-string">{'"cache_write_5m"'}</span>
                    {": "}
                    <span className="hljs-number">{"10.0"}</span>
                    {", "}
                    <span className="hljs-string">{'"cache_write_1h"'}</span>
                    {": "}
                    <span className="hljs-number">{"16.0"}</span>
                    {"},"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-string">{'"batch"'}</span>
                    {": {"}
                    <span className="hljs-string">{'"in"'}</span>
                    {": "}
                    <span className="hljs-number">{"4.0"}</span>
                    {", "}
                    <span className="hljs-string">{'"out"'}</span>
                    {": "}
                    <span className="hljs-number">{"20.0"}</span>
                    {"},"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-string">{'"fast"'}</span>
                    {": {"}
                    <span className="hljs-string">{'"in"'}</span>
                    {": "}
                    <span className="hljs-number">{"16.0"}</span>
                    {", "}
                    <span className="hljs-string">{'"out"'}</span>
                    {": "}
                    <span className="hljs-number">{"80.0"}</span>
                    {"},  "}
                    <span className="hljs-comment">
                      {"# fast mode のキャッシュ単価は公式の価格表で確認する"}
                    </span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"}"}</span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-keyword">{"def"}</span>{" "}
                    <span className="hljs-title function_">{"estimate_usd"}</span>
                    {"("}
                    <span className="hljs-params">
                      {"usage: "}
                      <span className="hljs-built_in">{"dict"}</span>
                      {", mode: "}
                      <span className="hljs-built_in">{"str"}</span>
                      {" = "}
                      <span className="hljs-string">{'"standard"'}</span>
                    </span>
                    {") -> "}
                    <span className="hljs-built_in">{"float"}</span>
                    {":"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>{"    r = RATES[mode]"}</span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    cache = usage.get("}
                    <span className="hljs-string">{'"cache_creation"'}</span>
                    {") "}
                    <span className="hljs-keyword">{"or"}</span>
                    {" {}"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    read = usage.get("}
                    <span className="hljs-string">{'"cache_read_input_tokens"'}</span>
                    {", "}
                    <span className="hljs-number">{"0"}</span>
                    {")"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    write_5m = cache.get("}
                    <span className="hljs-string">{'"ephemeral_5m_input_tokens"'}</span>
                    {", "}
                    <span className="hljs-number">{"0"}</span>
                    {")"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    write_1h = cache.get("}
                    <span className="hljs-string">{'"ephemeral_1h_input_tokens"'}</span>
                    {", "}
                    <span className="hljs-number">{"0"}</span>
                    {")"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    cached = read "}
                    <span className="hljs-keyword">{"or"}</span>
                    {" write_5m "}
                    <span className="hljs-keyword">{"or"}</span>
                    {" write_1h "}
                    <span className="hljs-keyword">{"or"}</span>
                    {" usage.get("}
                    <span className="hljs-string">{'"cache_creation_input_tokens"'}</span>
                    {", "}
                    <span className="hljs-number">{"0"}</span>
                    {")"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-keyword">{"if"}</span>
                    {" cached "}
                    <span className="hljs-keyword">{"and"}</span>{" "}
                    <span className="hljs-built_in">{"any"}</span>
                    {"(key "}
                    <span className="hljs-keyword">{"not"}</span>{" "}
                    <span className="hljs-keyword">{"in"}</span>
                    {" r "}
                    <span className="hljs-keyword">{"for"}</span>
                    {" key "}
                    <span className="hljs-keyword">{"in"}</span>
                    {" ("}
                    <span className="hljs-string">{'"cache_read"'}</span>
                    {", "}
                    <span className="hljs-string">{'"cache_write_5m"'}</span>
                    {", "}
                    <span className="hljs-string">{'"cache_write_1h"'}</span>
                    {")):"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-keyword">{"raise"}</span>
                    {" ValueError("}
                    <span className="hljs-string">
                      {'"このモードのキャッシュ単価を確認・設定してから見積もってください"'}
                    </span>
                    {")"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-keyword">{"return"}</span>
                    {" ("}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        usage.get("}
                    <span className="hljs-string">{'"input_tokens"'}</span>
                    {", "}
                    <span className="hljs-number">{"0"}</span>
                    {") * r["}
                    <span className="hljs-string">{'"in"'}</span>
                    {"]"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        + usage.get("}
                    <span className="hljs-string">{'"output_tokens"'}</span>
                    {", "}
                    <span className="hljs-number">{"0"}</span>
                    {") * r["}
                    <span className="hljs-string">{'"out"'}</span>
                    {"]"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        + (read * r["}
                    <span className="hljs-string">{'"cache_read"'}</span>
                    {"] "}
                    <span className="hljs-keyword">{"if"}</span>
                    {" read "}
                    <span className="hljs-keyword">{"else"}</span>{" "}
                    <span className="hljs-number">{"0"}</span>
                    {")"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        + (write_5m * r["}
                    <span className="hljs-string">{'"cache_write_5m"'}</span>
                    {"] "}
                    <span className="hljs-keyword">{"if"}</span>
                    {" write_5m "}
                    <span className="hljs-keyword">{"else"}</span>{" "}
                    <span className="hljs-number">{"0"}</span>
                    {")"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        + (write_1h * r["}
                    <span className="hljs-string">{'"cache_write_1h"'}</span>
                    {"] "}
                    <span className="hljs-keyword">{"if"}</span>
                    {" write_1h "}
                    <span className="hljs-keyword">{"else"}</span>{" "}
                    <span className="hljs-number">{"0"}</span>
                    {")"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    ) / "}
                    <span className="hljs-number">{"1_000_000"}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-comment">
                      {"# 例: 未キャッシュ入力5万 + キャッシュ読み出し15万 + 出力3万(思考込み)"}
                    </span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"example = {"}
                    <span className="hljs-string">{'"input_tokens"'}</span>
                    {": "}
                    <span className="hljs-number">{"50_000"}</span>
                    {", "}
                    <span className="hljs-string">{'"cache_read_input_tokens"'}</span>
                    {": "}
                    <span className="hljs-number">{"150_000"}</span>
                    {", "}
                    <span className="hljs-string">{'"output_tokens"'}</span>
                    {": "}
                    <span className="hljs-number">{"30_000"}</span>
                    {"}"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    <span className="hljs-built_in">{"print"}</span>
                    {"("}
                    <span className="hljs-built_in">{"round"}</span>
                    {"(estimate_usd(example), "}
                    <span className="hljs-number">{"2"}</span>
                    {"))  "}
                    <span className="hljs-comment">{"# 0.40 + 0.03 + 1.20 = 1.63"}</span>
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <h3 id="s11-2">{"11.2 コスト比較の注意"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"論点"}</th>
                    <th>{"内容"}</th>
                    <th>{"確度"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"単価と総額は別"}</td>
                    <td>
                      {" 単価は20%安いが、第三者のタスク単価は"}
                      <strong>{"増えた"}</strong>
                      {"例がある(SemiAnalysis: 約31%増) "}
                    </td>
                    <td>
                      {" 実測 ("}
                      <a className={styles["src-link"]} href="#S15">
                        {"S15"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S26">
                        {"S26"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"effort を揃えて比べる"}</td>
                    <td>
                      {
                        " Fable 5.2 の high は、Opus 5.5 の max とほぼ同等の性能で約半額。しかし Fable の max は Opus 5.5 の約2.6倍のタスク単価 "
                      }
                    </td>
                    <td>
                      {" 公式・実測 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S15">
                        {"S15"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S27">
                        {"S27"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"トークン消費の傾向"}</td>
                    <td>{"5.2 は max で 5.1 の約1.7倍の出力トークンを使うという計測がある"}</td>
                    <td>
                      {"観測 ("}
                      <a className={styles["src-link"]} href="#S25">
                        {"S25"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"サブスクの場合"}</td>
                    <td>
                      {
                        " 利用枠は費用ではなく「枠の消費速度」で効く。Fable は Pro / Team 標準席で週次上限の最大50% "
                      }
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h3 id="s11-3">{"11.3 コスト削減のレバー"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"レバー"}</th>
                    <th>{"具体策"}</th>
                    <th>{"期待できる効果"}</th>
                    <th>{"確度"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"effort を下げる"}</td>
                    <td>{"まず medium で評価し、基準を保てるタスクは medium のまま運用する"}</td>
                    <td>{"出力トークンと時間が下がる"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"履歴を追記のみにする"}</td>
                    <td>{"キャッシュ命中率が上がり、読み出しは入力単価の0.025倍になる"}</td>
                    <td>{"入力費の大幅減"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"drop_block"}</code>
                      {" に頼らない"}
                    </td>
                    <td>{"毎ターン破棄すると再思考が増える"}</td>
                    <td>{"出力トークン増を回避"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"バッチ処理"}</td>
                    <td>{"急がない処理は Batch API(入力 $4 / 出力 $20)"}</td>
                    <td>{"標準の半額"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"サブエージェントを軽量化"}</td>
                    <td>{"作業者は Haiku / Sonnet + low にする。委譲の説明に費用を書く"}</td>
                    <td>{"費用の大きな割合を占めるサブエージェント費を抑制"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"プロンプト上のトークン予算を外す"}</td>
                    <td>{"大きな予算の表示を外して再測定する"}</td>
                    <td>{"同等性能でコスト減の報告"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"所有者の指示は必要な場所だけ"}</td>
                    <td>{"出力トークンが増え、頼んでいない変更も増える"}</td>
                    <td>{"無駄な変更の回避"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"fast mode は人が待つ場面だけ"}</td>
                    <td>{"単価は2倍。無人作業には使わない"}</td>
                    <td>{"無駄な割増の回避"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S6">
                        {"S6"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"簡単なタスクは小型モデルへ"}</td>
                    <td>{"大量・低遅延の処理は Haiku / Sonnet"}</td>
                    <td>{"桁違いのコスト差"}</td>
                    <td>{"私見"}</td>
                  </tr>
                  <tr>
                    <td>{"データの量を絞る"}</td>
                    <td>{"1Mの文脈があっても、不要な資料は入れない"}</td>
                    <td>{"入力費の削減と精度の安定"}</td>
                    <td>{"私見"}</td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h3 id="s11-4">
              {"11.4 予算ガードの考え方 "}
              <span className={[styles.tag, styles.opinion].join(" ")}>{"私見"}</span>
            </h3>{" "}
            <ol>
              {" "}
              <li>
                {" "}
                <strong>{"1タスクあたりの上限金額"}</strong>
                {"と"}
                <strong>{"最大ターン数"}</strong>
                {"を決め、ハーネスで強制する。 "}
              </li>{" "}
              <li>
                {
                  " 実行ごとに「入力・出力・キャッシュ・サブエージェント数・所要時間・差分行数」を記録する。 "
                }
              </li>{" "}
              <li>
                {" 週次で"}
                <strong>{"タスク種別ごとの平均コスト"}</strong>
                {"を見て、effort と構成を見直す。 "}
              </li>{" "}
              <li>
                {"上限に達したら、"}
                <strong>{"途中経過を保存して人に引き継ぐ"}</strong>
                {"(破棄しない)。"}
              </li>{" "}
            </ol>{" "}
          </section>{" "}
          <section className={styles.section} id="s12">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"12"}</span>{" "}
              <h2 id="s12-heading">{"Step 10: 安全装置・拒否・フォールバック"}</h2>{" "}
            </div>{" "}
            <h3 id="s12-1">{"12.1 何がブロックされるか"}</h3>{" "}
            <p>
              {" Fable 5.2 には分類器があり、"}
              <strong>
                {
                  "高リスクなサイバー行為(ペネトレーションテスト、エクスプロイト生成、バイナリ起点の脆弱性解析)"
                }
                <strong>{"と"}</strong>
                {"生物学研究の多く"}
              </strong>
              {"をブロックします "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S1">
                {"S1"}
              </a>
              {")。良性のセキュリティ・ライフサイエンス業務でも誤検知されることがあります "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")。 "}
            </p>{" "}
            <p>
              {" 拒否されたリクエストは HTTP 200 で、"}
              <code>{'stop_reason: "refusal"'}</code>
              {" が返ります。"}
              <code>{"stop_details.category"}</code>
              {" に分類が入ります "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S3">
                {"S3"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")。 "}
            </p>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>
                      <code>{"category"}</code>
                    </th>
                    <th>{"意味"}</th>
                    <th>{"対応"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>{"cyber"}</code>
                    </td>
                    <td>{"マルウェアやエクスプロイトなど、サイバー被害につながりうる"}</td>
                    <td>
                      {" 正当な業務なら Cyber Verification Program("}
                      <a className={styles["src-link"]} href="#S37">
                        {"S37"}
                      </a>
                      {")へ申請。フォールバック先は Opus 4.8 "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"bio"}</code>
                    </td>
                    <td>{"危険な実験手順など、生物学的被害につながりうる"}</td>
                    <td>{"Life Sciences Verification Program へ。フォールバック先は Opus 5"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"frontier_llm"}</code>
                    </td>
                    <td>{"競合する AI モデルの開発を助ける可能性"}</td>
                    <td>
                      {
                        " 該当領域(アクセラレータのカーネル最適化、LLM のアーキテクチャ改善)は意図的に能力が Opus 5.5 並みに抑えられている "
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"reasoning_extraction"}</code>
                    </td>
                    <td>
                      {"モデルに内部推論を"}
                      <strong>{"本文に再現させる"}</strong>
                      {"依頼"}
                    </td>
                    <td>
                      {" 該当の指示を削除し、"}
                      <code>{'display: "summarized"'}</code>
                      {" で思考ブロックを読む。"}
                      <strong>{"推奨フォールバックはなく、拒否のまま"}</strong>{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"general_harms"}</code>
                    </td>
                    <td>{"その他の利用規約違反領域"}</td>
                    <td>{"依頼内容を見直す"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"null"}</code>
                    </td>
                    <td>{"特定の分類に当てはまらない"}</td>
                    <td>{"ログを取り、内容を確認する"}</td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <p>
              {" "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S3">
                {"S3"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")。"}
              <strong>
                {"許可されるフォールバック先は Claude Opus 4.8 と Claude Opus 5 のみ"}
              </strong>
              {"です。 "}
            </p>{" "}
            <h3 id="s12-2">{"12.2 拒否の処理フロー"}</h3>{" "}
            <div className={styles["diagram-card"]}>
              {" "}
              <div className={styles["diagram-title"]}>{"図8 拒否の処理フロー"}</div>{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram
                  id="fable52-diagram-7"
                  chart={DIAGRAM_7}
                  theme="base"
                  themeVariables={LIGHT_THEME}
                />
              </div>{" "}
            </div>{" "}
            <h3 id="s12-3">{"12.3 フォールバックの実装"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"方法"}</th>
                    <th>{"内容"}</th>
                    <th>{"確度"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"サーバー側フォールバック(ベータ)"}</td>
                    <td>
                      {" リクエストに "}
                      <code>{'fallbacks: "default"'}</code>
                      {
                        " を指定すると、拒否された依頼をカテゴリ別の推奨モデルで再試行する。Claude API と Google Cloud の Anthropic 管理版で利用可 "
                      }
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"SDK ミドルウェア"}</td>
                    <td>{"クライアント側で再試行する"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"自前のリトライ"}</td>
                    <td>
                      <code>{"stop_reason"}</code>
                      {" と "}
                      <code>{"category"}</code>
                      {" を見て自分で切り替える"}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <div className={styles["code-block"]} data-testid="code-block">
              {" "}
              <div className={styles["cb-head"]}>{"python"}</div>{" "}
              <pre>
                <code className="language-python">
                  <span className={styles.codeLine}>
                    <span className="hljs-keyword">{"def"}</span>{" "}
                    <span className="hljs-title function_">{"handle_response"}</span>
                    {"("}
                    <span className="hljs-params">
                      {"data: "}
                      <span className="hljs-built_in">{"dict"}</span>
                      {", retry_on_other_model"}
                    </span>
                    {"):"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-keyword">{"if"}</span>
                    {" data.get("}
                    <span className="hljs-string">{'"stop_reason"'}</span>
                    {") != "}
                    <span className="hljs-string">{'"refusal"'}</span>
                    {":"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-keyword">{"return"}</span>
                    {" data"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    category = (data.get("}
                    <span className="hljs-string">{'"stop_details"'}</span>
                    {") "}
                    <span className="hljs-keyword">{"or"}</span>
                    {" {}).get("}
                    <span className="hljs-string">{'"category"'}</span>
                    {")"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-keyword">{"if"}</span>
                    {" category == "}
                    <span className="hljs-string">{'"reasoning_extraction"'}</span>
                    {":"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-comment">
                      {"# 推奨フォールバックなし。プロンプトから推論の再現を求める指示を削除する"}
                    </span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-keyword">{"raise"}</span>
                    {" ValueError("}
                    <span className="hljs-string">
                      {'"推論の再現を本文に求めている指示を削除してください"'}
                    </span>
                    {")"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-keyword">{"if"}</span>
                    {" category "}
                    <span className="hljs-keyword">{"in"}</span>
                    {" ("}
                    <span className="hljs-string">{'"cyber"'}</span>
                    {", "}
                    <span className="hljs-string">{'"bio"'}</span>
                    {"):"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-comment">
                      {"# 許可されたフォールバック先: cyber は Opus 4.8、bio は Opus 5"}
                    </span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        target = "}
                    <span className="hljs-string">{'"claude-opus-4-8"'}</span>{" "}
                    <span className="hljs-keyword">{"if"}</span>
                    {" category == "}
                    <span className="hljs-string">{'"cyber"'}</span>{" "}
                    <span className="hljs-keyword">{"else"}</span>{" "}
                    <span className="hljs-string">{'"claude-opus-5"'}</span>
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className="hljs-keyword">{"return"}</span>
                    {" retry_on_other_model(target)"}
                  </span>
                  {"\n"}
                  <span className={styles.codeLine}></span>
                  {"\n"}
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className="hljs-keyword">{"raise"}</span>
                    {" RuntimeError("}
                    <span className="hljs-string">
                      {'f"拒否されました: category='}
                      <span className="hljs-subst">{"{category}"}</span>
                      {'"'}
                    </span>
                    {")"}
                  </span>
                </code>
              </pre>{" "}
            </div>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" "}
                <strong>{"課金とキャッシュ"}</strong>
                {
                  ": 出力が出る前の拒否が課金されるかは、カテゴリで異なります。レート制限には必ず算入されます。フォールバックでモデルを切り替えると、プロンプトキャッシュと Fable 5.2 の思考が失われますが、"
                }
                <strong>{"fallback credit"}</strong>
                {" がキャッシュの切替コストを払い戻します "}
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S3">
                  {"S3"}
                </a>
                {", "}
                <a className={styles["src-link"]} href="#S42">
                  {"S42"}
                </a>
                {")。 "}
              </p>{" "}
            </div>{" "}
            <h3 id="s12-4">{"12.4 データ保持とプライバシー"}</h3>{" "}
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
                    <td>{"保持期間"}</td>
                    <td>{"Fable 5.2 / Mythos 5.2 は30日保持が前提(Covered Model)"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"ZDR"}</td>
                    <td>{"明示的に許可された場合を除き利用不可"}</td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Enterprise Frontier Safeguards"}</td>
                    <td>
                      {
                        " 顧客のインフラに保存したプロンプトと応答に自動監視をかける仕組み。ZDR と両立する。非公開ベータ "
                      }
                    </td>
                    <td>
                      {" 公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S44">
                        {"S44"}
                      </a>
                      {") "}
                    </td>
                  </tr>
                  <tr>
                    <td>{"蒸留対策"}</td>
                    <td>
                      {"Fable 5.2 は最も強い対策を実装。preserved thinking は全アカウントに適用"}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"アカウント間の思考ブロック"}</td>
                    <td>
                      {"ブロックは生成したアカウント(またはリンクされたアカウント)でのみ有効"}
                    </td>
                    <td>
                      {"公式 ("}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {")"}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <div className={styles.callout} data-variant="info">
              {" "}
              <p>
                {" "}
                <strong>
                  <span className={[styles.tag, styles.opinion].join(" ")}>{"私見"}</span>
                </strong>
                {": 機密性の高い業務では、"}
                <strong>{"ZDR が使えない"}</strong>
                {
                  "点が導入の可否を左右します。法務・セキュリティの確認を、技術検証より先に済ませてください。 "
                }
              </p>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="s13">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"13"}</span>{" "}
              <h2 id="s13-heading">{"Step 11: 評価と品質保証"}</h2>{" "}
            </div>{" "}
            <h3 id="s13-1">{"13.1 導入の順序(公式の推奨を踏まえた4ステップ)"}</h3>{" "}
            <p>
              {" 公式ガイドが示す「どこから始めるか」を、評価の手順に置き換えると次の流れです "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S5">
                {"S5"}
              </a>
              {")。 "}
            </p>{" "}
            <ol>
              {" "}
              <li>
                {" "}
                <strong>
                  {"effort を "}
                  <code>{"high"}</code>
                  {" に明示"}
                </strong>
                {"し、"}
                <code>{"medium"}</code>
                {" と "}
                <code>{"xhigh"}</code>
                {" でも評価を回す(5.4 のスイープ)。 "}
              </li>{" "}
              <li>
                {" 持ち込む"}
                <strong>
                  {"システムプロンプト、スキル、エージェント定義、メモリ、ハーネスのテキスト"}
                </strong>
                {"を読み、8.7 の表に沿って削除または再テストする。 "}
              </li>{" "}
              <li>
                {" "}
                <strong>{"一番長いエージェントタスク"}</strong>
                {
                  "を実行し、次の6点を記録する: 早く終わる、不要な承認を求める、無言になる、委譲が多すぎる、既存コードに継ぎ足すだけ、報告が読みにくい。 "
                }
              </li>{" "}
              <li>
                {" 観察した症状ごとに、"}
                <strong>{"8章の対処を1つずつ"}</strong>
                {"足し、効果とトークン増を自分のタスクで測る。 "}
              </li>{" "}
            </ol>{" "}
            <h3 id="s13-2">{"13.2 記録する指標"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"指標"}</th>
                    <th>{"見る理由"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"合格率(自動テスト・ルーブリック)"}</td>
                    <td>{"品質の本体"}</td>
                  </tr>
                  <tr>
                    <td>{"出力トークン(思考込み)"}</td>
                    <td>{"effort とプロンプトの影響が最も出る"}</td>
                  </tr>
                  <tr>
                    <td>{"タスクあたりの総額(サブエージェント含む)"}</td>
                    <td>{"単価ではなく総額で比較する(11章)"}</td>
                  </tr>
                  <tr>
                    <td>{"所要時間"}</td>
                    <td>{"人が待つ場面の体験"}</td>
                  </tr>
                  <tr>
                    <td>{"サブエージェントの数とモデル"}</td>
                    <td>{"費用の見えない大きな割合"}</td>
                  </tr>
                  <tr>
                    <td>{"差分の行数・変更ファイル数"}</td>
                    <td>{"頼んでいない変更の検出(8.3)"}</td>
                  </tr>
                  <tr>
                    <td>{"早期終了・承認要求の回数"}</td>
                    <td>{"8.1・8.2・8.6 の効果測定"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"拒否("}
                      <code>{"refusal"}</code>
                      {")の回数とカテゴリ"}
                    </td>
                    <td>{"12章の運用"}</td>
                  </tr>
                  <tr>
                    <td>{"400 エラーの種類と回数"}</td>
                    <td>{"6・7章の実装不備の検出"}</td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h3 id="s13-3">{"13.3 プロンプトの変更は1行ずつ検証する"}</h3>{" "}
            <ul>
              {" "}
              <li>
                {" 変更は"}
                <strong>{"1回に1つ"}</strong>
                {"、同じタスクセットで、"}
                <strong>{"変更前後の合格率・トークン・時間"}</strong>
                {"を比べる。 "}
              </li>{" "}
              <li>
                {
                  " 公式の検証でも、効果(完遂の改善)とコスト(出力トークン約30%増)がセットで出ています。"
                }
                <strong>{"効果だけで採用しない"}</strong>
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S5">
                  {"S5"}
                </a>
                {")。 "}
              </li>{" "}
              <li>
                {" 旧モデル向けの指示を削るときも同様に、"}
                <strong>{"削る前後で品質が保たれるか"}</strong>
                {"を確認する。 "}
              </li>{" "}
            </ul>{" "}
            <h3 id="s13-4">{"13.4 評価環境は本番に近づける"}</h3>{" "}
            <p>
              {" Anthropic は、Fable 5.2 と Mythos 5.2 が、"}
              <strong>
                {"直近のどのモデルよりも頻繁に「評価されているのではないか」と疑う発言をする"}
              </strong>
              {"と報告しています。実運用での振る舞いを評価で測りにくくなる、という課題です "}
              <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S1">
                {"S1"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S24">
                {"S24"}
              </a>
              {")。 "}
            </p>{" "}
            <p>
              {" "}
              <strong>
                {"示唆 "}
                <span className={[styles.tag, styles.opinion].join(" ")}>{"私見"}</span>
              </strong>
              {": "}
            </p>{" "}
            <ul>
              {" "}
              <li>
                {" 評価用のプロンプトを"}
                <strong>{"玩具のような単純な形にしない"}</strong>
                {"。本番と同じハーネス・ツール・権限で回す。 "}
              </li>{" "}
              <li>
                {" モデルの自己申告(「完了しました」)を鵜呑みにせず、"}
                <strong>{"成果物を機械で検証"}</strong>
                {"する。 "}
              </li>{" "}
              <li>
                {
                  " Anthropic の自動行動監査では、5.2 は「入力を幻覚する」「やっていないのに完了したと言う」「重要な情報を省く」といった行動が減ったとされます "
                }
                <span className={[styles.tag, styles.official].join(" ")}>{"公式"}</span>
                {" ("}
                <a className={styles["src-link"]} href="#S1">
                  {"S1"}
                </a>
                {")。傾向は良好ですが、"}
                <strong>{"自分のタスクでの検証が代わりにはなりません"}</strong>
                {"。 "}
              </li>{" "}
            </ul>{" "}
            <h3 id="s13-5">{"13.5 人の判断を残す"}</h3>{" "}
            <p>
              {" Mollick の検証では、Fable 5.2 は大量の成果物を出す一方、"}
              <strong>{"長さ・構成・出来の良し悪しを自分で見切るのが苦手"}</strong>
              {"でした(10.2 事例4)"}
              <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S14">
                {"S14"}
              </a>
              {")。 "}
            </p>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"人が持つ判断"}</th>
                    <th>{"理由"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"最終成果物の取捨選択(長さ、構成、品位)"}</td>
                    <td>{"モデルは「量」を出せるが「適切さ」の判断が弱い"}</td>
                  </tr>
                  <tr>
                    <td>{"不可逆な操作の承認"}</td>
                    <td>{"8.1・8.2 のとおり、質問が減る方向に調整するため"}</td>
                  </tr>
                  <tr>
                    <td>{"目標と完了条件の定義"}</td>
                    <td>{"目標が曖昧だと、数時間後に大きくずれる"}</td>
                  </tr>
                  <tr>
                    <td>{"プロセス肥大化の検知"}</td>
                    <td>{"10.2 事例2"}</td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h3 id="s13-6">{"13.6 自前の評価セットを持つ"}</h3>{" "}
            <p>
              {" Elvis Saravia(DAIR.AI)は、本番でのモデル選定は公開ベンチマークではなく"}
              <strong>{"自社の評価セット"}</strong>
              {"に基づくべきだと述べています "}
              <span className={[styles.tag, styles.observed].join(" ")}>{"観測"}</span>
              {" ("}
              <a className={styles["src-link"]} href="#S15">
                {"S15"}
              </a>
              {", "}
              <a className={styles["src-link"]} href="#S34">
                {"S34"}
              </a>
              {
                ")。公開ベンチマークは、候補を絞る材料にとどめ、最終判断は自社タスクの数値で行います。 "
              }
            </p>{" "}
          </section>{" "}
          <section className={styles.section} id="s14">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"14"}</span>{" "}
              <h2 id="s14-heading">{"トラブルシューティング"}</h2>{" "}
            </div>{" "}
            <h3 id="s14-1">{"14.1 症状別の一覧"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"症状"}</th>
                    <th>{"原因"}</th>
                    <th>{"対処"}</th>
                    <th>{"参照"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {"400: "}
                      <code>{"The block is bound to a different conversation"}</code>
                    </td>
                    <td>{"履歴の編集後に、無効になった思考ブロックを送っている"}</td>
                    <td>
                      {"履歴を追記のみにする。暫定は "}
                      <code>{"drop_block"}</code>
                      {"(トークン増に注意)"}
                    </td>
                    <td>{"7章"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"400: "}
                      <code>{"thinking"}</code>
                      {" 指定が不正"}
                    </td>
                    <td>
                      {" "}
                      <code>{"enabled"}</code>
                      {" / "}
                      <code>{"disabled"}</code>
                      {" / "}
                      <code>{"budget_tokens"}</code>
                      {" を使っている "}
                    </td>
                    <td>
                      {"省略するか "}
                      <code>{"adaptive"}</code>
                      {"。深さは effort"}
                    </td>
                    <td>{"6.2"}</td>
                  </tr>
                  <tr>
                    <td>
                      {"400: "}
                      <code>{"tool_choice"}</code>
                      {" が不正"}
                    </td>
                    <td>
                      <code>{"any"}</code>
                      {" / 特定ツールの強制"}
                    </td>
                    <td>
                      <code>{"auto"}</code>
                      {" + "}
                      <code>{"strict: true"}</code>
                    </td>
                    <td>{"6.3"}</td>
                  </tr>
                  <tr>
                    <td>{"400: コンピュータ操作ツールのエラー"}</td>
                    <td>
                      <code>{"computer_20251124"}</code>
                      {" を使っている(Bedrock以外)"}
                    </td>
                    <td>
                      <code>{"computer_toolset_20260801"}</code>
                    </td>
                    <td>{"6.2"}</td>
                  </tr>
                  <tr>
                    <td>{"400: advisor のエラー"}</td>
                    <td>{"executor が 5.2 なのに advisor が 5.1 など"}</td>
                    <td>
                      {" advisor を "}
                      <code>{"claude-fable-5-2"}</code>
                      {" か "}
                      <code>{"claude-mythos-5-2"}</code>
                      {" に "}
                    </td>
                    <td>{"3.4"}</td>
                  </tr>
                  <tr>
                    <td>{"簡単な依頼の返事が遅い・高い"}</td>
                    <td>{"high 以上は挨拶にも思考する。「考えるな」は無効"}</td>
                    <td>{"その種のターンは low / medium に"}</td>
                    <td>{"5.5"}</td>
                  </tr>
                  <tr>
                    <td>{"ターンが途中で終わる"}</td>
                    <td>{"low / medium で起きやすい"}</td>
                    <td>{"完遂の指示(8.1)。effort を上げる"}</td>
                    <td>{"8.1"}</td>
                  </tr>
                  <tr>
                    <td>{"不要な承認を求める"}</td>
                    <td>{"承認ルールが広い、古い注意書きの積み上がり"}</td>
                    <td>{"対象を具体的に。古い指示を削除"}</td>
                    <td>{"8.2・8.6"}</td>
                  </tr>
                  <tr>
                    <td>{"長い処理の間、画面が無言"}</td>
                    <td>
                      <code>{"thinking.display"}</code>
                      {" が "}
                      <code>{"omitted"}</code>
                    </td>
                    <td>
                      <code>{"updates"}</code>
                      {" / "}
                      <code>{"summarized"}</code>
                      {"。ハーネスで差し込み"}
                    </td>
                    <td>{"6.5・8.4"}</td>
                  </tr>
                  <tr>
                    <td>{"サブエージェントが多すぎて高い"}</td>
                    <td>{"委譲を促す指示、サブエージェントの既定モデル"}</td>
                    <td>{"常設指示を削る。ツール説明に費用を書く。小型モデル + low"}</td>
                    <td>{"8.5"}</td>
                  </tr>
                  <tr>
                    <td>{"既存コードに継ぎ足すだけ"}</td>
                    <td>{"所有の言及がない"}</td>
                    <td>
                      {"プロジェクトの "}
                      <code>{"CLAUDE.md"}</code>
                      {" に所有を明記(副作用に注意)"}
                    </td>
                    <td>{"8.3"}</td>
                  </tr>
                  <tr>
                    <td>{"頼んでいない変更が増えた"}</td>
                    <td>{"所有の指示の副作用"}</td>
                    <td>{"範囲を指定する。差分を読む。必要な場所にだけ入れる"}</td>
                    <td>{"8.3"}</td>
                  </tr>
                  <tr>
                    <td>{"文章がぶつ切り"}</td>
                    <td>{"文体の厳格な上限が残っている"}</td>
                    <td>{"上限を外し、趣旨ベースの指示に"}</td>
                    <td>{"8.7・8.8"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{'stop_reason: "refusal"'}</code>
                    </td>
                    <td>{"分類器が発動"}</td>
                    <td>{"カテゴリ別に対応。必要なら検証プログラムへ"}</td>
                    <td>{"12章"}</td>
                  </tr>
                  <tr>
                    <td>{"最終報告が読みにくい"}</td>
                    <td>{"低文脈の読み手を想定していない"}</td>
                    <td>{"8.8 の指示を足す"}</td>
                    <td>{"8.8"}</td>
                  </tr>
                  <tr>
                    <td>
                      <code>{"max"}</code>
                      {" で期待ほど伸びない・遅い"}
                    </td>
                    <td>{"max は high より劣る評価が複数ある"}</td>
                    <td>{"high に戻して比較"}</td>
                    <td>{"5.2"}</td>
                  </tr>
                  <tr>
                    <td>{"ZDR で使えない"}</td>
                    <td>{"30日保持が前提のモデル"}</td>
                    <td>{"契約・保持ポリシーを確認。EFS(Enterprise)の検討"}</td>
                    <td>{"12.4"}</td>
                  </tr>
                  <tr>
                    <td>{"モデルを切り替えたら精度が落ちた"}</td>
                    <td>{"Fable 5.2 の思考が引き継がれない"}</td>
                    <td>{"会話ごとにモデルを固定する"}</td>
                    <td>{"7.5"}</td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h3 id="s14-2">{"14.2 切り分けフロー"}</h3>{" "}
            <div className={styles["diagram-card"]}>
              {" "}
              <div className={styles["diagram-title"]}>{"図9 問題の切り分けフロー"}</div>{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram
                  id="fable52-diagram-8"
                  chart={DIAGRAM_8}
                  theme="base"
                  themeVariables={LIGHT_THEME}
                />
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="s15">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"15"}</span>{" "}
              <h2 id="s15-heading">{"導入チェックリストと30日ロードマップ"}</h2>{" "}
            </div>{" "}
            <h3 id="s15-1">{"15.1 チェックリスト"}</h3>{" "}
            <p>
              <strong>{"環境"}</strong>
            </p>{" "}
            <div className={styles["check-progress"]} data-progress-panel="">
              <span className={styles.count} data-testid="check-progress">
                <span data-check-count>0</span>
                {" / "}
                <span data-check-total>3</span>
                {" 完了"}
              </span>
              <div className={styles.bar}>
                <i data-check-bar style={{ width: "0%" }} />
              </div>
            </div>
            <ul className={styles.checklist}>
              {" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"Claude Code が v2.1.321 以上"}</span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"データ保持(30日、ZDR 不可)について、法務・セキュリティと合意済み"}</span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"利用枠の仕様(Fable は週次上限の最大50%)をチーム内で共有済み"}</span>
                </label>{" "}
              </li>{" "}
            </ul>{" "}
            <p>
              <strong>{"モデルと effort"}</strong>
            </p>{" "}
            <div className={styles["check-progress"]} data-progress-panel="">
              <span className={styles.count} data-testid="check-progress">
                <span data-check-count>0</span>
                {" / "}
                <span data-check-total>3</span>
                {" 完了"}
              </span>
              <div className={styles.bar}>
                <i data-check-bar style={{ width: "0%" }} />
              </div>
            </div>
            <ul className={styles.checklist}>
              {" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"日常は Opus 5.5、難所は Fable 5.2、という使い分けを決めた"}</span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    {"effort を "}
                    <code>{"high"}</code>
                    {" に明示し、"}
                    <code>{"medium"}</code>
                    {" / "}
                    <code>{"xhigh"}</code>
                    {" と比較した"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    <code>{"max"}</code>
                    {" を既定にしていない"}
                  </span>
                </label>{" "}
              </li>{" "}
            </ul>{" "}
            <p>
              <strong>{"API 実装"}</strong>
            </p>{" "}
            <div className={styles["check-progress"]} data-progress-panel="">
              <span className={styles.count} data-testid="check-progress">
                <span data-check-count>0</span>
                {" / "}
                <span data-check-total>6</span>
                {" 完了"}
              </span>
              <div className={styles.bar}>
                <i data-check-bar style={{ width: "0%" }} />
              </div>
            </div>
            <ul className={styles.checklist}>
              {" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    <code>{"thinking"}</code>
                    {" の "}
                    <code>{"enabled"}</code>
                    {" / "}
                    <code>{"disabled"}</code>
                    {" / "}
                    <code>{"budget_tokens"}</code>
                    {" を使っていない"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    {"強制ツール使用を使っていない("}
                    <code>{"auto"}</code>
                    {" + "}
                    <code>{"strict"}</code>
                    {")"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"履歴は追記のみで、assistant の応答をそのまま保存・再送している"}</span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    <code>{"system"}</code>
                    {" と "}
                    <code>{"tools"}</code>
                    {" を会話の途中で変更していない"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    <code>{"max_tokens"}</code>
                    {" が思考分を含む上限として十分である"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    {"経過報告を見せたい画面では "}
                    <code>{"thinking.display"}</code>
                    {" を設定した"}
                  </span>
                </label>{" "}
              </li>{" "}
            </ul>{" "}
            <p>
              <strong>{"プロンプトと指示ファイル"}</strong>
            </p>{" "}
            <div className={styles["check-progress"]} data-progress-panel="">
              <span className={styles.count} data-testid="check-progress">
                <span data-check-count>0</span>
                {" / "}
                <span data-check-total>4</span>
                {" 完了"}
              </span>
              <div className={styles.bar}>
                <i data-check-bar style={{ width: "0%" }} />
              </div>
            </div>
            <ul className={styles.checklist}>
              {" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    <code>{"/doctor prompt-audit"}</code>
                    {" などで旧モデル向けの指示を棚卸しした"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    {"「考えるな」「トークン予算」「文体の上限」「常設の委譲」を見直した"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"承認ルールを具体的な操作で書いた"}</span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    {"所有者の指示は、プロジェクトの "}
                    <code>{"CLAUDE.md"}</code>
                    {" の必要な場所にだけ入れた"}
                  </span>
                </label>{" "}
              </li>{" "}
            </ul>{" "}
            <p>
              <strong>{"コストと安全"}</strong>
            </p>{" "}
            <div className={styles["check-progress"]} data-progress-panel="">
              <span className={styles.count} data-testid="check-progress">
                <span data-check-count>0</span>
                {" / "}
                <span data-check-total>4</span>
                {" 完了"}
              </span>
              <div className={styles.bar}>
                <i data-check-bar style={{ width: "0%" }} />
              </div>
            </div>
            <ul className={styles.checklist}>
              {" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"1タスクあたりの上限金額と最大ターン数をハーネスで強制している"}</span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"サブエージェントの既定モデルと effort を明示した"}</span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    <code>{"refusal"}</code>
                    {" のカテゴリ別処理とフォールバック先を実装した"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"正当なセキュリティ・バイオ業務は検証プログラムへの申請を検討した"}</span>
                </label>{" "}
              </li>{" "}
            </ul>{" "}
            <p>
              <strong>{"評価と運用"}</strong>
            </p>{" "}
            <div className={styles["check-progress"]} data-progress-panel="">
              <span className={styles.count} data-testid="check-progress">
                <span data-check-count>0</span>
                {" / "}
                <span data-check-total>3</span>
                {" 完了"}
              </span>
              <div className={styles.bar}>
                <i data-check-bar style={{ width: "0%" }} />
              </div>
            </div>
            <ul className={styles.checklist}>
              {" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    {"自前の評価セット(10〜30件)で合格率・トークン・費用・時間を記録している"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>
                    {"差分("}
                    <code>{"git diff --stat"}</code>
                    {")を読む運用がある"}
                  </span>
                </label>{" "}
              </li>{" "}
              <li>
                {" "}
                <label>
                  <input type="checkbox" data-guide-check="" />
                  <span>{"最終成果物の取捨選択と不可逆操作の承認は人が持っている"}</span>
                </label>{" "}
              </li>{" "}
            </ul>{" "}
            <h3 id="s15-2">{"15.2 30日ロードマップ"}</h3>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"期間"}</th>
                    <th>{"やること"}</th>
                    <th>{"成果物"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"1週目"}</td>
                    <td>
                      {" 環境準備、データ保持の合意、"}
                      <code>{"max_tokens"}</code>
                      {" と 400 エラーの洗い出し、評価セット作成 "}
                    </td>
                    <td>{"動く最小構成と評価セット"}</td>
                  </tr>
                  <tr>
                    <td>{"2週目"}</td>
                    <td>{"effort スイープ、旧モデル向け指示の棚卸し(1行ずつ検証)"}</td>
                    <td>
                      {"タスク別の effort 表、整理した "}
                      <code>{"CLAUDE.md"}</code>
                    </td>
                  </tr>
                  <tr>
                    <td>{"3週目"}</td>
                    <td>
                      {" 症状に応じて8章の対処を追加(完遂・進捗・委譲・所有)、"}
                      <code>{"refusal"}</code>
                      {" の処理実装 "}
                    </td>
                    <td>{"プロンプトの差分と効果測定の記録"}</td>
                  </tr>
                  <tr>
                    <td>{"4週目"}</td>
                    <td>
                      {
                        " マルチエージェント構成の試験(指揮役 + 小型作業者)、予算ガードの導入、運用ルール化 "
                      }
                    </td>
                    <td>{"運用手順書、コスト・品質の週次レポート"}</td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <div className={styles["diagram-card"]}>
              {" "}
              <div className={styles["diagram-title"]}>{"図10 30日ロードマップ"}</div>{" "}
              <div className={styles["diagram-wrap"]}>
                <MermaidDiagram
                  id="fable52-diagram-9"
                  chart={DIAGRAM_9}
                  theme="base"
                  themeVariables={LIGHT_THEME}
                />
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="s16">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"16"}</span>{" "}
              <h2 id="s16-heading">{"補足: 追加ベストプラクティスと根拠ソース"}</h2>{" "}
            </div>{" "}
            <h3 id="s16-1">{"16.1 追加ベストプラクティス一覧"}</h3>{" "}
            <p>
              {
                " 本編で扱った内容に加え、公式発表と開発者の投稿から読み取れる実践をまとめました。番号は根拠URL表(16.2)の "
              }
              <code>{"S"}</code>
              {" 番号に対応します。 "}
            </p>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"No."}</th>
                    <th>{"ベストプラクティス"}</th>
                    <th>{"根拠"}</th>
                    <th>{"発信者・種別"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"BP-01"}</td>
                    <td>
                      {"通常業務は Opus 5.5 を起点にし、評価で足りないときだけ Fable へ上げる"}
                    </td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S9">
                        {"S9"}
                      </a>{" "}
                    </td>
                    <td>{"Anthropic 公式"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-02"}</td>
                    <td>
                      {" effort は "}
                      <code>{"high"}</code>
                      {"(API)か "}
                      <code>{"medium"}</code>
                      {"(Claude Code)を起点に、下げる検証を先に行う。"}
                      <code>{"xhigh"}</code>
                      {" / "}
                      <code>{"max"}</code>
                      {" は測定後 "}
                    </td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S28">
                        {"S28"}
                      </a>{" "}
                    </td>
                    <td>{"Anthropic 公式、Vals"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-03"}</td>
                    <td>{"5.1 や Opus 5.5 の effort 設定を持ち込まず、評価でスイープし直す"}</td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S35">
                        {"S35"}
                      </a>{" "}
                    </td>
                    <td>{"Anthropic 公式、Cursor"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-04"}</td>
                    <td>
                      {" 会話履歴は追記のみにし、"}
                      <code>{"system"}</code>
                      {" / "}
                      <code>{"tools"}</code>
                      {" を途中で変えない "}
                    </td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S40">
                        {"S40"}
                      </a>{" "}
                    </td>
                    <td>{"Anthropic 公式"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-05"}</td>
                    <td>
                      {
                        " 会話の途中でモデルを切り替えない。切り替えるなら新しい会話か、サブエージェントとして分離 "
                      }
                    </td>
                    <td>
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                    </td>
                    <td>{"Anthropic 公式"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-06"}</td>
                    <td>
                      {" 長い無人実行では "}
                      <code>{"thinking.display"}</code>
                      {" を "}
                      <code>{"updates"}</code>
                      {" / "}
                      <code>{"summarized"}</code>
                      {" にして進捗を描画する "}
                    </td>
                    <td>
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                    </td>
                    <td>{"Anthropic 公式"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-07"}</td>
                    <td>
                      {
                        " 承認が必要な操作は最初に具体的に宣言する。「続けて」ではなく何を許可するか明示する "
                      }
                    </td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S29">
                        {"S29"}
                      </a>{" "}
                    </td>
                    <td>{"Anthropic 公式、Alex Albert"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-08"}</td>
                    <td>
                      {
                        " 所有者であることを書くと既存コードの構造改善が進む。ただしプロジェクト限定で書き、差分を読む "
                      }
                    </td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S10">
                        {"S10"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S12">
                        {"S12"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S16">
                        {"S16"}
                      </a>{" "}
                    </td>
                    <td>{"Anthropic 公式、Simon Willison、wmedia"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-09"}</td>
                    <td>
                      {" "}
                      <code>{"CLAUDE.md"}</code>
                      {" を "}
                      <code>{"/doctor prompt-audit"}</code>
                      {" で棚卸しし、旧モデル向けの指示を整理する "}
                    </td>
                    <td>
                      <a className={styles["src-link"]} href="#S16">
                        {"S16"}
                      </a>
                    </td>
                    <td>{"wmedia(検証記事)"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-10"}</td>
                    <td>
                      {
                        " 「考えるな」「トークン予算」「文体の厳格な上限」「常設の委譲」を外して再測定する "
                      }
                    </td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S16">
                        {"S16"}
                      </a>{" "}
                    </td>
                    <td>{"Anthropic 公式、wmedia"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-11"}</td>
                    <td>
                      {
                        " サブエージェントの既定モデルと effort を明示し、ツール説明に費用を書いて過剰な委譲を抑える "
                      }
                    </td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S5">
                        {"S5"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S26">
                        {"S26"}
                      </a>{" "}
                    </td>
                    <td>{"Anthropic 公式、SemiAnalysis"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-12"}</td>
                    <td>
                      {
                        " Fable は指揮役(Orchestrator)または助言役(Advisor)として使い、実行は小型モデルに任せる "
                      }
                    </td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S7">
                        {"S7"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S30">
                        {"S30"}
                      </a>{" "}
                    </td>
                    <td>{"Anthropic 公式、Lydia Hallie"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-13"}</td>
                    <td>
                      {"機械で検証できる完了条件を置き、チェックポイントから再開できるようにする"}
                    </td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S17">
                        {"S17"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S18">
                        {"S18"}
                      </a>{" "}
                    </td>
                    <td>{"Anthropic 公式、Lance Martin ら"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-14"}</td>
                    <td>
                      {
                        " エージェント群のプロセス肥大(規則の増殖)を監視し、独立したレビューチームに簡素化させる "
                      }
                    </td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S13">
                        {"S13"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S14">
                        {"S14"}
                      </a>{" "}
                    </td>
                    <td>{"Ethan Mollick"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-15"}</td>
                    <td>{"長さ・構成・品位の判断は人が担う。モデルの自己評価に頼らない"}</td>
                    <td>
                      <a className={styles["src-link"]} href="#S14">
                        {"S14"}
                      </a>
                    </td>
                    <td>{"Ethan Mollick"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-16"}</td>
                    <td>
                      {"実装の前に「このアイデアの何が問題か」を聞く。Fable は押し返してくる"}
                    </td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S15">
                        {"S15"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S29">
                        {"S29"}
                      </a>{" "}
                    </td>
                    <td>{"Alex Albert"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-17"}</td>
                    <td>
                      {"複雑なタスクは plan mode から始め、別のセッションに計画をレビューさせる"}
                    </td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S19">
                        {"S19"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S21">
                        {"S21"}
                      </a>{" "}
                    </td>
                    <td>{"Boris Cherny、コミュニティ"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-18"}</td>
                    <td>
                      {"3〜5個の git worktree で並列に作業する。ただし利用枠と費用の消費に注意"}
                    </td>
                    <td>
                      <a className={styles["src-link"]} href="#S19">
                        {"S19"}
                      </a>
                    </td>
                    <td>{"Boris Cherny"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-19"}</td>
                    <td>{"検証手段(テスト・型・差分比較)を渡し、「動くことを示して」と頼む"}</td>
                    <td>
                      <a className={styles["src-link"]} href="#S19">
                        {"S19"}
                      </a>
                    </td>
                    <td>{"Boris Cherny"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-20"}</td>
                    <td>{"fast mode は、人が待っていて待ち時間のコストが高い場面だけに使う"}</td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S6">
                        {"S6"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S8">
                        {"S8"}
                      </a>{" "}
                    </td>
                    <td>{"Anthropic 公式"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-21"}</td>
                    <td>{"本番のモデル選定は公開ベンチではなく、自社の評価セットで決める"}</td>
                    <td>
                      <a className={styles["src-link"]} href="#S34">
                        {"S34"}
                      </a>
                    </td>
                    <td>{"Elvis Saravia(DAIR.AI)"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-22"}</td>
                    <td>{"日常は Opus 5.5、難所は Fable、と使い分ける。Fable は枠の消費が速い"}</td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S15">
                        {"S15"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S31">
                        {"S31"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S32">
                        {"S32"}
                      </a>{" "}
                    </td>
                    <td>{"Felix Rieseberg、Theo"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-23"}</td>
                    <td>{"仕様が明確なら Opus、曖昧・探索的なら Fable、と補完関係で使う"}</td>
                    <td>
                      <a className={styles["src-link"]} href="#S15">
                        {"S15"}
                      </a>
                    </td>
                    <td>{"Claude Code チームの発言、Theo"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-24"}</td>
                    <td>
                      {"拒否("}
                      <code>{"refusal"}</code>
                      {")のカテゴリ別処理とフォールバック先を実装する"}
                    </td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S42">
                        {"S42"}
                      </a>{" "}
                    </td>
                    <td>{"Anthropic 公式"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-25"}</td>
                    <td>
                      {"出力が出る前の拒否や、フォールバックでの課金・キャッシュ損失を把握する"}
                    </td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S42">
                        {"S42"}
                      </a>{" "}
                    </td>
                    <td>{"Anthropic 公式"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-26"}</td>
                    <td>{"評価環境を本番に近づける。モデルは評価を疑う発言が増えている"}</td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S1">
                        {"S1"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S24">
                        {"S24"}
                      </a>{" "}
                    </td>
                    <td>{"Anthropic 公式、TechCrunch"}</td>
                  </tr>
                  <tr>
                    <td>{"BP-27"}</td>
                    <td>{"データ保持(30日、ZDR 不可)の可否を、技術検証より先に確認する"}</td>
                    <td>
                      {" "}
                      <a className={styles["src-link"]} href="#S3">
                        {"S3"}
                      </a>
                      {", "}
                      <a className={styles["src-link"]} href="#S44">
                        {"S44"}
                      </a>{" "}
                    </td>
                    <td>{"Anthropic 公式"}</td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h3 id="s16-2">{"16.2 根拠ソースURL一覧"}</h3>{" "}
            <p>
              {" "}
              <strong>{"「取得状況」の凡例"}</strong>
              {": "}
              <strong>{"本文取得"}</strong>
              {"=ページ本文を読んだ。"}
              <strong>{"スニペット"}</strong>
              {"=検索結果の抜粋のみ確認。"}
              <strong>{"参照リンク"}</strong>
              {
                "=公式ページ内のリンクとして確認しただけで、本文は未取得(その内容は引用元の記述に基づく)。 "
              }
            </p>{" "}
            <h4>{"Anthropic 公式(一次情報)"}</h4>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"ID"}</th>
                    <th>{"内容"}</th>
                    <th>{"取得状況"}</th>
                    <th>{"URL"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="S1">
                    <td>{"S1"}</td>
                    <td>
                      {
                        " 発表記事「Introducing Claude Fable 5.2 and Claude Mythos 5.2」(ベンチマーク、価格、安全性、導入事例、可用性) "
                      }
                    </td>
                    <td>{"本文取得"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://www.anthropic.com/claude-fable-and-mythos-5-2"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://www.anthropic.com/claude-fable-and-mythos-5-2"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S2">
                    <td>{"S2"}</td>
                    <td>{"Platform Docs: Claude Fable 5.2 概要(スペック表)"}</td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://platform.claude.com/docs/en/models/fable-5-2/overview"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://platform.claude.com/docs/en/models/fable-5-2/overview"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S3">
                    <td>{"S3"}</td>
                    <td>
                      {
                        " Platform Docs: What's new in Claude Fable 5.2(破壊的変更、価格、可用性、拒否とフォールバック) "
                      }
                    </td>
                    <td>{"本文取得"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://platform.claude.com/docs/en/models/fable-5-2/whats-new-fable-5-2"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://platform.claude.com/docs/en/models/fable-5-2/whats-new-fable-5-2"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S4">
                    <td>{"S4"}</td>
                    <td>{"Platform Docs: 移行ガイド"}</td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://platform.claude.com/docs/en/models/fable-5-2/migration-guide"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://platform.claude.com/docs/en/models/fable-5-2/migration-guide"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S5">
                    <td>{"S5"}</td>
                    <td>
                      {
                        " Platform Docs: Prompting Claude Fable 5.2(effort、完遂、所有、進捗、サブエージェント ほか) "
                      }
                    </td>
                    <td>{"本文取得"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {
                          "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2"
                        }
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S6">
                    <td>{"S6"}</td>
                    <td>{"Platform Docs: Fast mode"}</td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://platform.claude.com/docs/en/build-with-claude/fast-mode"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://platform.claude.com/docs/en/build-with-claude/fast-mode"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S7">
                    <td>{"S7"}</td>
                    <td>{"Claude Code Docs: advisor ツール"}</td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://code.claude.com/docs/en/advisor"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://code.claude.com/docs/en/advisor"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S8">
                    <td>{"S8"}</td>
                    <td>{"Claude Code Docs: fast mode"}</td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://code.claude.com/docs/en/fast-mode"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://code.claude.com/docs/en/fast-mode"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S9">
                    <td>{"S9"}</td>
                    <td>{"Platform Docs: モデル一覧"}</td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://platform.claude.com/docs/en/models/overview"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://platform.claude.com/docs/en/models/overview"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S36">
                    <td>{"S36"}</td>
                    <td>{"サポート記事: Fable 5.2 ローンチ特典"}</td>
                    <td>{"参照リンク"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://support.claude.com/en/articles/17506494"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://support.claude.com/en/articles/17506494"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S37">
                    <td>{"S37"}</td>
                    <td>{"サポート記事: Cyber Verification Program"}</td>
                    <td>{"参照リンク"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://support.claude.com/en/articles/14604842-cyber-verification-program"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {
                          "https://support.claude.com/en/articles/14604842-cyber-verification-program"
                        }
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S38">
                    <td>{"S38"}</td>
                    <td>{"Claude Fable 5.2 and Mythos 5.2 システムカード"}</td>
                    <td>{"参照リンク"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://www.anthropic.com/document/claude-fable-5-2-mythos-5-2-system-card"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {
                          "https://www.anthropic.com/document/claude-fable-5-2-mythos-5-2-system-card"
                        }
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S39">
                    <td>{"S39"}</td>
                    <td>{"Managed Agents: マルチエージェント・オーケストレーション"}</td>
                    <td>{"参照リンク"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {
                          "https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration"
                        }
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S40">
                    <td>{"S40"}</td>
                    <td>{"Platform Docs: Preserved thinking"}</td>
                    <td>{"参照リンク"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://platform.claude.com/docs/en/build-with-claude/preserved-thinking"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://platform.claude.com/docs/en/build-with-claude/preserved-thinking"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S41">
                    <td>{"S41"}</td>
                    <td>{"Platform Docs: Effort"}</td>
                    <td>{"参照リンク"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://platform.claude.com/docs/en/build-with-claude/effort"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://platform.claude.com/docs/en/build-with-claude/effort"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S42">
                    <td>{"S42"}</td>
                    <td>{"Platform Docs: Refusals and fallback"}</td>
                    <td>{"参照リンク"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {
                          "https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback"
                        }
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S43">
                    <td>{"S43"}</td>
                    <td>{"Claude Code Docs: Hooks"}</td>
                    <td>{"参照リンク"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://code.claude.com/docs/en/hooks"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://code.claude.com/docs/en/hooks"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S44">
                    <td>{"S44"}</td>
                    <td>{"Enterprise Frontier Safeguards"}</td>
                    <td>{"参照リンク"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://www.anthropic.com/news/enterprise-frontier-safeguards"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://www.anthropic.com/news/enterprise-frontier-safeguards"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S46">
                    <td>{"S46"}</td>
                    <td>{"Platform Docs: Prompting best practices(全モデル共通)"}</td>
                    <td>{"参照リンク"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {
                          "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
                        }
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S17">
                    <td>{"S17"}</td>
                    <td>
                      {
                        " Anthropic のエンジニアリング投稿「Safely scaling multi-agent teams with Claude Fable 5.2」(Barry Zhang, Tianyi Peng, Elle Najt, Keller Scholl, Lance Martin) "
                      }
                    </td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://claude.dev/blog/safely-scaling-multi-agent-teams-with-fable-5-2/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://claude.dev/blog/safely-scaling-multi-agent-teams-with-fable-5-2/"}
                      </a>{" "}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h4>{"著名な国際的開発者・研究者の投稿"}</h4>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"ID"}</th>
                    <th>{"発信者"}</th>
                    <th>{"内容"}</th>
                    <th>{"取得状況"}</th>
                    <th>{"URL"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="S10">
                    <td>{"S10"}</td>
                    <td>{"Simon Willison(Django 共同開発者、Datasette 作者)"}</td>
                    <td>{"公式ガイド「所有者」節の引用と所感"}</td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://simonwillison.net/2026/Nov/10/prompting-claude-fable-52/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://simonwillison.net/2026/Nov/10/prompting-claude-fable-52/"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S11">
                    <td>{"S11"}</td>
                    <td>{"Simon Willison"}</td>
                    <td>
                      {
                        " Fable 5.2 と Claude Code で、謎のビープ音の発生源を特定するツールを作った事例 "
                      }
                    </td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://simonwillison.net/2026/Nov/9/mysterious-beeps/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://simonwillison.net/2026/Nov/9/mysterious-beeps/"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S12">
                    <td>{"S12"}</td>
                    <td>{"Simon Willison(X)"}</td>
                    <td>{"「This codebase is yours」のヒント"}</td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://x.com/simonw/status/2120029347948220500"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://x.com/simonw/status/2120029347948220500"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S13">
                    <td>{"S13"}</td>
                    <td>{"Ethan Mollick(Wharton)(X)"}</td>
                    <td>{"2.5万エージェントで3D世界を生成した実験"}</td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://x.com/emollick/status/2119918307457577163"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://x.com/emollick/status/2119918307457577163"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S14">
                    <td>{"S14"}</td>
                    <td>
                      {
                        " Ethan Mollick「Fable 5.2 and Jagged AGI」(One Useful Thing)。記事本体は、このコメント欄URLから末尾の "
                      }
                      <code>{"/comments"}</code>
                      {" を除いたもの "}
                    </td>
                    <td></td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://www.oneusefulthing.org/p/fable-52-and-jagged-agi/comments"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://www.oneusefulthing.org/p/fable-52-and-jagged-agi/comments"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S15">
                    <td>{"S15"}</td>
                    <td>
                      {
                        " swyx / Latent Space「Fable 5.2 retakes World #1 LLM spot」(独立評価、効果的な使い方、開発者の反応の総まとめ) "
                      }
                    </td>
                    <td></td>
                    <td>{"本文取得"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://latent.space/p/ainews-fable-5-2-retakes-world-1-llm-spot-as-ant-ipo-roadshow-begins/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {
                          "https://latent.space/p/ainews-fable-5-2-retakes-world-1-llm-spot-as-ant-ipo-roadshow-begins/"
                        }
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S19">
                    <td>{"S19"}</td>
                    <td>
                      {
                        " Boris Cherny(Claude Code の作者)(X): チーム由来の使い方のヒント(2026年1月、5.2 以前) "
                      }
                    </td>
                    <td></td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://x.com/bcherny/status/2017742741636321619"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://x.com/bcherny/status/2017742741636321619"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S29">
                    <td>{"S29"}</td>
                    <td>{"Alex Albert(Anthropic)(X): Fable 5.2 の使い方"}</td>
                    <td></td>
                    <td>{"参照リンク(S15内)"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://x.com/alexalbert__/status/2119869724247077229"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://x.com/alexalbert__/status/2119869724247077229"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S30">
                    <td>{"S30"}</td>
                    <td>{"Lydia Hallie(Anthropic)(X): 指揮役としての使用"}</td>
                    <td></td>
                    <td>{"参照リンク(S15内)"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://x.com/lydiahallie/status/2119871667400999166"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://x.com/lydiahallie/status/2119871667400999166"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S31">
                    <td>{"S31"}</td>
                    <td>{"Felix Rieseberg(Anthropic)(X): 使い分けの助言"}</td>
                    <td></td>
                    <td>{"参照リンク(S15内)"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://x.com/felixrieseberg/status/2119867837296857361"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://x.com/felixrieseberg/status/2119867837296857361"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S32">
                    <td>{"S32"}</td>
                    <td>{"Theo(X): 利用枠の費用対効果の分析"}</td>
                    <td></td>
                    <td>{"参照リンク(S15内)"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://x.com/theo/status/2119960608816988596"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://x.com/theo/status/2119960608816988596"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S33">
                    <td>{"S33"}</td>
                    <td>{"Yuchen Jin(X): max の評価への指摘"}</td>
                    <td></td>
                    <td>{"参照リンク(S15内)"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://x.com/Yuchenj_UW/status/2119867942603264279"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://x.com/Yuchenj_UW/status/2119867942603264279"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S34">
                    <td>{"S34"}</td>
                    <td>{"Elvis Saravia / DAIR.AI(X): 自前の評価セットの重要性"}</td>
                    <td></td>
                    <td>{"参照リンク(S15内)"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://x.com/omarsar0/status/2119795295630324042"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://x.com/omarsar0/status/2119795295630324042"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S16">
                    <td>{"S16"}</td>
                    <td>
                      {
                        " wmedia.es(Claude Code の実践ヒント)「Fable 5.2 in Claude Code: clean up your CLAUDE.md and add one line」 "
                      }
                    </td>
                    <td></td>
                    <td>{"本文取得"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://wmedia.es/en/tips/claude-code-fable-5-2-claude-md-cleanup"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://wmedia.es/en/tips/claude-code-fable-5-2-claude-md-cleanup"}
                      </a>{" "}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h4>{"第三者の独立評価・報道"}</h4>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"ID"}</th>
                    <th>{"発信者"}</th>
                    <th>{"内容"}</th>
                    <th>{"取得状況"}</th>
                    <th>{"URL"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="S26">
                    <td>{"S26"}</td>
                    <td>{"SemiAnalysis(X): GDPx の結果と費用"}</td>
                    <td></td>
                    <td>{"参照リンク(S15内)"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://x.com/SemiAnalysis_/status/2119961455348826461"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://x.com/SemiAnalysis_/status/2119961455348826461"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S27">
                    <td>{"S27"}</td>
                    <td>{"Artificial Analysis(X): Intelligence Index とコスト"}</td>
                    <td></td>
                    <td>{"参照リンク(S15内)"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://x.com/ArtificialAnlys/status/2119878995386982508"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://x.com/ArtificialAnlys/status/2119878995386982508"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S28">
                    <td>{"S28"}</td>
                    <td>{"Vals AI(X): Vals Index"}</td>
                    <td></td>
                    <td>{"参照リンク(S15内)"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://x.com/ValsAI/status/2119872483629408658"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://x.com/ValsAI/status/2119872483629408658"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S35">
                    <td>{"S35"}</td>
                    <td>{"Cursor(X): CursorBench と effort の注意"}</td>
                    <td></td>
                    <td>{"参照リンク(S15内)"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://x.com/cursor_ai/status/2119880829212172509"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://x.com/cursor_ai/status/2119880829212172509"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S22">
                    <td>{"S22"}</td>
                    <td>{"CNBC: リリース報道"}</td>
                    <td></td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://www.cnbc.com/2026/11/09/anthropic-claude-fable-5-2-mythos-5-2.html"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {
                          "https://www.cnbc.com/2026/11/09/anthropic-claude-fable-5-2-mythos-5-2.html"
                        }
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S23">
                    <td>{"S23"}</td>
                    <td>{"MacRumors: リリース報道"}</td>
                    <td></td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://www.macrumors.com/2026/11/09/anthropic-launches-claude-fable-5-2/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {
                          "https://www.macrumors.com/2026/11/09/anthropic-launches-claude-fable-5-2/"
                        }
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S24">
                    <td>{"S24"}</td>
                    <td>{"TechCrunch: リリース報道(評価されていることへの疑い、能力制限)"}</td>
                    <td></td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://techcrunch.com/2026/11/09/anthropic-releases-new-mythos-and-fable-models-amid-rsi-concerns/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {
                          "https://techcrunch.com/2026/11/09/anthropic-releases-new-mythos-and-fable-models-amid-rsi-concerns/"
                        }
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S18">
                    <td>{"S18"}</td>
                    <td>{"TechTimes: Fermat の最終定理の形式化の補足"}</td>
                    <td></td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://www.techtimes.com/articles/330361/20261110/claude-fable-52-ai-agents-rebuild-fermats-last-theorem-proof-30-hours-starting-47-lemmas.htm"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {
                          "https://www.techtimes.com/articles/330361/20261110/claude-fable-52-ai-agents-rebuild-fermats-last-theorem-proof-30-hours-starting-47-lemmas.htm"
                        }
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S25">
                    <td>{"S25"}</td>
                    <td>{"Medium(Raja Durai): 開発者向けチートシート(第三者の解説)"}</td>
                    <td></td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://medium.com/@rajadurai80/claude-fable-5-2-the-complete-developers-guide-cheat-sheet-5ffbeb68e6a1"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {
                          "https://medium.com/@rajadurai80/claude-fable-5-2-the-complete-developers-guide-cheat-sheet-5ffbeb68e6a1"
                        }
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S48">
                    <td>{"S48"}</td>
                    <td>{"Brave New Coin: Mollick の検証の要約(8万7千語の規則集の記述)"}</td>
                    <td></td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://bravenewcoin.com/insights/claude-fable-5-2-mythos-launch-price-features"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {
                          "https://bravenewcoin.com/insights/claude-fable-5-2-mythos-launch-price-features"
                        }
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S49">
                    <td>{"S49"}</td>
                    <td>{"GPTunneL: Mollick の検証の要約(182ページの論文の記述)"}</td>
                    <td></td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://www.gptunnel.ru/en/blog/claude-fable-5-2"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://www.gptunnel.ru/en/blog/claude-fable-5-2"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S45">
                    <td>{"S45"}</td>
                    <td>{"kingy.ai: 「Fable 5.5」の噂の追跡(公式発表なしとの整理)"}</td>
                    <td></td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://kingy.ai/blog/claude-fable-5-5/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://kingy.ai/blog/claude-fable-5-5/"}
                      </a>{" "}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
            <h4>{"コミュニティの集約(参考)"}</h4>{" "}
            <div className={styles["table-wrap"]}>
              {" "}
              <table>
                <thead>
                  <tr>
                    <th>{"ID"}</th>
                    <th>{"内容"}</th>
                    <th>{"取得状況"}</th>
                    <th>{"URL"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="S20">
                    <td>{"S20"}</td>
                    <td>{"Boris Cherny のヒント集(コミュニティによる集約)"}</td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://github.com/SKZL-AI/boris-cherny-claude-code-playbook"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://github.com/SKZL-AI/boris-cherny-claude-code-playbook"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S21">
                    <td>{"S21"}</td>
                    <td>{"Claude Code ベストプラクティス集(コミュニティ)"}</td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://github.com/liambuild/claude-code-best-practice"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://github.com/liambuild/claude-code-best-practice"}
                      </a>{" "}
                    </td>
                  </tr>
                  <tr id="S47">
                    <td>{"S47"}</td>
                    <td>{"Boris Cherny のチーム由来10ヒント(コミュニティのメモ)"}</td>
                    <td>{"スニペット"}</td>
                    <td className={styles["url-cell"]}>
                      {" "}
                      <a
                        href="https://gist.github.com/joyrexus/e20ead11b3df4de46ab32b4a7269abe0"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {"https://gist.github.com/joyrexus/e20ead11b3df4de46ab32b4a7269abe0"}
                      </a>{" "}
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>{" "}
          </section>{" "}
          <section className={styles.section} id="s17">
            {" "}
            <div className={styles["sec-head"]}>
              {" "}
              <span className={styles["chapter-badge"]}>{"17"}</span>{" "}
              <h2 id="s17-heading">{"未確認事項と留意点"}</h2>{" "}
            </div>{" "}
            <p>{"意思決定の前に、次の点に注意してください。"}</p>{" "}
            <ol>
              {" "}
              <li>
                {" "}
                <strong>{"「Fable 5.5」は公式発表がありません"}</strong>
                {
                  "(2026-11-12 時点)。最新の Fable は 5.2 で、「5.5」は未確認のラベルとして一部の媒体が使っていたものです。命名が「5.5」でなく「5.2」であることを様々に読み解く議論はありますが、推測です ("
                }
                <a className={styles["src-link"]} href="#S15">
                  {"S15"}
                </a>
                {", "}
                <a className={styles["src-link"]} href="#S45">
                  {"S45"}
                </a>
                {")。 "}
              </li>{" "}
              <li>
                {" "}
                <strong>{"「所有者」の指示の効果の数値が、引用元で揺れています"}</strong>
                {
                  "。重複の統合率は、公式ドキュメントの取得時点の記述(一文なしで1割未満、ありで約75%)と、Simon Willison が引用した版(約半数)で異なります。出力トークンの増え方も、公式の記述(約70〜80%増)、検証記事の読み(約1.5倍)、検証記事の実測(約2.5倍)で異なります ("
                }
                <a className={styles["src-link"]} href="#S5">
                  {"S5"}
                </a>
                {", "}
                <a className={styles["src-link"]} href="#S10">
                  {"S10"}
                </a>
                {", "}
                <a className={styles["src-link"]} href="#S16">
                  {"S16"}
                </a>
                {")。"}
                <strong>{"傾向として理解し、自社タスクで測定"}</strong>
                {"してください。 "}
              </li>{" "}
              <li>
                {" "}
                <strong>{"Fermat の最終定理の形式化の所要時間"}</strong>
                {
                  "は、発表記事では「30時間」、エンジニアリング投稿の紹介記事では「28.7時間」(初期スナップショットでの試験的実験)と書かれています。発表記事の数値の説明は2026-11-11 に修正されています ("
                }
                <a className={styles["src-link"]} href="#S1">
                  {"S1"}
                </a>
                {", "}
                <a className={styles["src-link"]} href="#S18">
                  {"S18"}
                </a>
                {")。 "}
              </li>{" "}
              <li>
                {" "}
                <strong>{"第三者の数値の多くは、Latent Space の要約経由で確認したものです"}</strong>
                {"("}
                <a className={styles["src-link"]} href="#S26">
                  {"S26"}
                </a>
                {"〜"}
                <a className={styles["src-link"]} href="#S35">
                  {"S35"}
                </a>
                {
                  " は、ツイート本文を直接は読んでいません)。引用する場合は、一次のツイートを確認してください。 "
                }
              </li>{" "}
              <li>
                {" "}
                <strong>{"公式ベンチマークの記載"}</strong>
                {
                  "には、同じ項目で表の数値と本文の数値が併記されている箇所があります(例: Chartography。表は最高 effort、本文は Medium effort の別の数値)。effort 条件を揃えて読んでください ("
                }
                <a className={styles["src-link"]} href="#S1">
                  {"S1"}
                </a>
                {")。 "}
              </li>{" "}
              <li>
                {" "}
                <strong>{"ベータ機能とヘッダ名は変わりえます"}</strong>
                {"("}
                <code>{"thinking-display-updates-2026-08-18"}</code>
                {"、"}
                <code>{"thinking-binding-controls-2026-08-01"}</code>
                {"、"}
                <code>{"compact-2026-09-04"}</code>
                {"、"}
                <code>{"inline-tools-2026-09-15"}</code>
                {"、"}
                <code>{"mid-conversation-output-config-2026-07-01"}</code>
                {"、"}
                <code>{"mid-conversation-system-clear-at-2026-08-21"}</code>
                {" など)。導入時に公式ドキュメントで確認してください。 "}
              </li>{" "}
              <li>
                {" "}
                <strong>{"コード例は、外部APIに接続して実行したものではありません"}</strong>
                {"。構文の検査は行いましたが、動作は自分の環境で確認してください。"}
                <code>{"fast"}</code>
                {" の "}
                <code>{"speed"}</code>
                {" パラメータや、フォールバックの "}
                <code>{"fallbacks"}</code>
                {" などの正確な指定は、公式ドキュメント("}
                <a className={styles["src-link"]} href="#S6">
                  {"S6"}
                </a>
                {", "}
                <a className={styles["src-link"]} href="#S42">
                  {"S42"}
                </a>
                {")に従ってください。 "}
              </li>{" "}
              <li>
                {" "}
                <strong>{"hooks の設定例"}</strong>
                {"は考え方を示すものです。スキーマはバージョンで変わりえます ("}
                <a className={styles["src-link"]} href="#S43">
                  {"S43"}
                </a>
                {")。 "}
              </li>{" "}
              <li>
                {" "}
                <strong>{"Claude Code が自動送信する指示の内容"}</strong>
                {
                  "(9.2)は、検証記事が v2.1.322 でモデルに質問して確認したもので、Claude Code の更新で変わりえます ("
                }
                <a className={styles["src-link"]} href="#S16">
                  {"S16"}
                </a>
                {")。 "}
              </li>{" "}
              <li>
                {" "}
                <strong>{"この資料は新規に作成したものです"}</strong>
                {
                  "。既存の版からの差分ではありません。Fable 5.1 時代の資料がある場合は、2章の差分表と8.7 の見直し表を使って更新してください。 "
                }
              </li>{" "}
            </ol>{" "}
          </section>{" "}
          <footer className={styles.footer}>
            {" "}
            <p>
              {
                " 作成日: 2026-11-12 / 対象: Claude Fable 5.2 ( claude-fable-5-2 ) / 次回更新の目安: 公式ドキュメントの更新時、または Fable の次期バージョンの発表時 "
              }
            </p>{" "}
          </footer>{" "}
        </main>{" "}
      </div>
      <TocObserver />
    </div>
  );
}
