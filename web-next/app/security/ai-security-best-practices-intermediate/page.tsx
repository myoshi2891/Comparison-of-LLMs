import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "AIセキュリティ ベストプラクティス完全ガイド（中級〜上級者向け） | LLM-Studies",
  description:
    "LLM・RAG基盤・AIエージェント・MCP(Model Context Protocol)連携システムを設計/実装/運用するエンジニアのための、2026年7月時点の最新フレームワークと実践的な多層防御の設計指針。",
};

const DIAGRAMS = {
  threatLandscape: `flowchart TB
subgraph L1["データ層"]
A1["学習データ汚染<br/>(Data Poisoning)"]
A2["個人情報混入<br/>(PII Leakage)"]
A3["著作権/ライセンス違反データ"]
end

subgraph L2["モデル層"]
B1["モデル抽出・窃取<br/>(Model Extraction)"]
B2["メンバーシップ推論攻撃"]
B3["バックドア/トロイの木馬"]
end

subgraph L3["アプリケーション層"]
C1["直接プロンプトインジェクション"]
C2["間接プロンプトインジェクション"]
C3["システムプロンプト漏洩"]
C4["出力の不適切な処理"]
end

subgraph L4["エージェント/ツール層"]
D1["目標ハイジャック<br/>(Goal Hijack)"]
D2["ツール誤用・過剰な自律性"]
D3["MCPサーバーのなりすまし/Rug Pull"]
D4["メモリ・コンテキスト汚染"]
D5["エージェント間通信の詐称"]
end

subgraph L5["インフラ/サプライチェーン層"]
E1["依存パッケージの侵害"]
E2["モデルレジストリのなりすまし"]
E3["ベクトルDB/RAGパイプラインの汚染"]
E4["無制限リソース消費(DoW/DoS)"]
end

L1 --> L2 --> L3 --> L4
L5 -.->|供給元を汚染| L1
L5 -.->|ツール/サーバーを汚染| L4

style L1 fill:#1a2f4a,color:#fff
style L2 fill:#1a2f4a,color:#fff
style L3 fill:#1a2f4a,color:#fff
style L4 fill:#1a2f4a,color:#fff
style L5 fill:#1a2f4a,color:#fff`,

  frameworkRelations: `flowchart LR
subgraph Legal["法的拘束力"]
EU["EU AI Act"]
end
subgraph Voluntary["任意フレームワーク（ガバナンス）"]
NIST["NIST AI RMF<br/>+ GenAIプロファイル"]
ISO["ISO/IEC 42001<br/>(認証可能)"]
end
subgraph Technical["技術的チェックリスト・脅威DB"]
OWASP1["OWASP LLM Top10"]
OWASP2["OWASP Agentic Top10"]
ATLAS["MITRE ATLAS<br/>(攻撃手法DB)"]
end

NIST -->|コンプライアンス根拠として引用| EU
ISO -->|認証がEU AI Act対応の裏付けに| EU
OWASP1 -->|技術的な実装指針を提供| NIST
OWASP2 -->|技術的な実装指針を提供| NIST
ATLAS -->|具体的な攻撃手法とレッドチーム項目を提供| OWASP1
ATLAS -->|具体的な攻撃手法とレッドチーム項目を提供| OWASP2

style Legal fill:#4a1a1a,color:#fff
style Voluntary fill:#1a3a1a,color:#fff
style Technical fill:#1a2f4a,color:#fff`,

  promptInjection: `flowchart TD
subgraph Direct["直接プロンプトインジェクション"]
U1["攻撃者"] -->|"'これまでの指示を無視して...'"| P1["ユーザー入力欄"]
P1 --> M1["LLM"]
M1 --> R1["システムプロンプトの上書き・<br/>安全策の迂回"]
end

subgraph Indirect["間接プロンプトインジェクション"]
U2["攻撃者"] -->|"悪意ある指示を埋め込む"| D2["外部コンテンツ<br/>(Webページ/メール/文書/<br/>ツール出力/RAG検索結果)"]
AGENT["エージェント/RAGパイプライン"] -->|"信頼された処理として取り込む"| D2
D2 --> M2["LLM"]
M2 --> R2["意図しないツール実行・<br/>データ窃取・目標乗っ取り"]
end

style Direct fill:#3a1a1a,color:#fff
style Indirect fill:#1a2f4a,color:#fff`,

  dataPoisoning: `flowchart LR
A["公開データセット/<br/>Webスクレイピング"] --> B{"データ検証<br/>パイプライン"}
C["サードパーティ提供データ"] --> B
B -->|"検証済み"| D["学習パイプライン"]
B -->|"異常検知でブロック"| X["隔離・レビュー"]
D --> E["ファインチューニング/<br/>継続学習"]
E --> F["デプロイ済みモデル"]
F -->|"継続的な振る舞い監視"| G["異常検知アラート"]
G -.->|"疑わしい場合ロールバック"| F

style B fill:#1a3a1a,color:#fff
style X fill:#4a1a1a,color:#fff
style G fill:#4a3a1a,color:#fff`,

  ragSecurity: `flowchart LR
subgraph Ingest["取り込みパイプライン"]
S1["社内文書/Wiki"] --> CH["チャンク分割"]
S2["Web/外部データ"] --> CH
CH --> EMB["埋め込み生成<br/>(Embedding)"]
EMB --> VDB[("ベクトルDB")]
end

subgraph Query["検索・生成"]
Q["ユーザークエリ"] --> QE["クエリ埋め込み"]
QE --> VDB
VDB -->|"類似度検索結果"| GEN["LLM生成"]
GEN --> RESP["応答"]
end

ATT["攻撃者"] -.->|"① 汚染文書を混入<br/>(RAGポイズニング)"| S2
ATT -.->|"② 未認証エンドポイント経由で<br/>ベクトルDBに直接書き込み"| VDB
ATT -.->|"③ 検索結果に指示を<br/>埋め込み間接インジェクション"| GEN

style Ingest fill:#1a2f4a,color:#fff
style Query fill:#1a3a1a,color:#fff
style ATT fill:#4a1a1a,color:#fff`,

  mcpTrust: `flowchart TB
subgraph Host["ホスト (Claude Desktop等)"]
H["AIアプリケーション"]
end
subgraph Client["MCPクライアント"]
C["サーバーごとに1インスタンス"]
end
subgraph Servers["MCPサーバー群"]
S1["社内データソース<br/>(信頼できるサーバー)"]
S2["サードパーティ公開サーバー<br/>(信頼境界の外)"]
S3["悪意あるなりすましサーバー"]
end

H --> C
C -->|"信頼境界①"| S1
C -->|"信頼境界②<br/>(要検証)"| S2
C -.->|"③ Rug Pull攻撃:<br/>承認後にツール定義を変更"| S3
S2 -.->|"④ Confused Deputy:<br/>ユーザー権限を超えて実行"| S1
S3 -.->|"⑤ Tool Poisoning:<br/>ツール説明文に隠し指示"| H

style Host fill:#1a2f4a,color:#fff
style Client fill:#1a3a1a,color:#fff
style S3 fill:#4a1a1a,color:#fff`,

  guardrailArchitecture: `flowchart LR
IN["ユーザー入力/<br/>外部コンテンツ"] --> L1["レイヤー1<br/>入力サニタイズ・分類器"]
L1 --> LLM["LLM推論"]
LLM --> L2["レイヤー2<br/>出力スキーマ検証"]
L2 --> L3["レイヤー3<br/>コンテンツポリシー<br/>フィルタ"]
L3 --> L4["レイヤー4<br/>高リスクアクション<br/>人間承認ゲート"]
L4 --> OUT["実行/表示"]

L2 -.->|"逸脱検知"| BLOCK1["ブロック・再生成"]
L3 -.->|"ポリシー違反"| BLOCK2["ブロック・ログ記録"]
L4 -.->|"承認拒否"| BLOCK3["実行キャンセル"]

style L1 fill:#1a2f4a,color:#fff
style L2 fill:#1a2f4a,color:#fff
style L3 fill:#1a2f4a,color:#fff
style L4 fill:#4a3a1a,color:#fff`,

  redteamLifecycle: `flowchart TD
A["脅威モデリング<br/>(OWASP/MITRE ATLASを参照)"] --> B["攻撃シナリオ設計<br/>(直接/間接インジェクション、<br/>ツール誤用、多ターン攻撃等)"]
B --> C["自動化敵対的テスト実行<br/>(Garak, PyRIT, DeepTeam等)"]
C --> D["手動レッドチーム演習<br/>(高度な適応的攻撃)"]
D --> E["結果の重大度評価・<br/>再現可能なエビデンス収集"]
E --> F["修正・ガードレール強化"]
F --> G["リリースゲートでの<br/>回帰テスト"]
G -->|"モデル/プロンプト/<br/>接続データソースの変更ごと"| A

style A fill:#1a2f4a,color:#fff
style C fill:#1a3a1a,color:#fff
style E fill:#4a3a1a,color:#fff`,

  incidentResponse: `flowchart TD
A["異常検知<br/>(監視アラート/ユーザー報告)"] --> B{"重大度評価"}
B -->|"低"| C["ログ記録・定期レビューへ"]
B -->|"中〜高"| D["インシデント対応チーム招集"]
D --> E["影響範囲の特定<br/>(侵害されたツール/データ/<br/>エージェントの特定)"]
E --> F["封じ込め<br/>(該当エージェント/ツールの<br/>一時停止、トークン失効)"]
F --> G["根本原因分析<br/>(プロンプト/データ/<br/>サプライチェーンのどこが起点か)"]
G --> H["復旧・修正<br/>(ガードレール強化、<br/>ロールバック)"]
H --> I["事後レビュー・<br/>再発防止策の文書化"]
I -.->|"フィードバック"| J["レッドチームシナリオへ追加"]

style D fill:#4a1a1a,color:#fff
style F fill:#4a3a1a,color:#fff
style I fill:#1a3a1a,color:#fff`,

  supplyChain: `flowchart LR
A["モデル/データセット<br/>取得・開発"] --> B["AIBOM生成<br/>(CycloneDX形式)"]
B --> C["Sigstore/cosignで<br/>署名"]
C --> D["レジストリへ登録<br/>(検証可能な形で)"]
D --> E["デプロイ時に<br/>署名検証"]
E --> F["継続的な脆弱性<br/>スキャン(依存関係含む)"]
F -.->|"新たな脆弱性発見時"| G["ロールバック/<br/>再署名フロー"]

style B fill:#1a2f4a,color:#fff
style C fill:#1a3a1a,color:#fff
style E fill:#1a3a1a,color:#fff`,

  maturityModel: `flowchart LR
L1["Level 1<br/>場当たり的"] --> L2["Level 2<br/>基礎的"]
L2 --> L3["Level 3<br/>体系的"]
L3 --> L4["Level 4<br/>最適化"]

L1 -.- N1["インベントリなし"]
L2 -.- N2["OWASP準拠の<br/>基本対策"]
L3 -.- N3["NIST/ISO準拠の<br/>ガバナンス+AIBOM"]
L4 -.- N4["継続的自動化+<br/>法規制対応完了"]

style L1 fill:#4a1a1a,color:#fff
style L2 fill:#4a3a1a,color:#fff
style L3 fill:#1a3a3a,color:#fff
style L4 fill:#1a3a1a,color:#fff`,
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function AISecurityBestPracticesIntermediatePage() {
  return (
    <div className={styles.pageWrap}>
      <TocObserver />

      <button
        type="button"
        id="navToggle"
        className={styles.mobileNavToggle}
        aria-label="目次を開く"
        aria-expanded={false}
        aria-controls="sidebar"
      >
        <i className="ti ti-menu-2" />
      </button>

      <aside id="sidebar" className={styles.sidebar}>
        <p className={styles.sidebarTitle}>目次</p>
        <nav aria-label="ページ内目次">
          <ul>
            <li>
              <a href="#sec-01" className={styles.tocLink}>
                <span className={styles.tocIcon}>01</span>
                はじめに
              </a>
            </li>
            <li>
              <a href="#sec-02" className={styles.tocLink}>
                <span className={styles.tocIcon}>02</span>
                脅威ランドスケープ
              </a>
            </li>
            <li>
              <a href="#sec-03" className={styles.tocLink}>
                <span className={styles.tocIcon}>03</span>
                主要フレームワーク
              </a>
            </li>
            <li>
              <a href="#sec-04" className={styles.tocLink}>
                <span className={styles.tocIcon}>04</span>
                プロンプトインジェクション
              </a>
            </li>
            <li>
              <a href="#sec-05" className={styles.tocLink}>
                <span className={styles.tocIcon}>05</span>
                機密情報漏洩対策
              </a>
            </li>
            <li>
              <a href="#sec-06" className={styles.tocLink}>
                <span className={styles.tocIcon}>06</span>
                データ/モデル汚染
              </a>
            </li>
            <li>
              <a href="#sec-07" className={styles.tocLink}>
                <span className={styles.tocIcon}>07</span>
                モデル抽出・窃取
              </a>
            </li>
            <li>
              <a href="#sec-08" className={styles.tocLink}>
                <span className={styles.tocIcon}>08</span>
                RAG/ベクトルDB
              </a>
            </li>
            <li>
              <a href="#sec-09" className={styles.tocLink}>
                <span className={styles.tocIcon}>09</span>
                エージェント/MCP
              </a>
            </li>
            <li>
              <a href="#sec-10" className={styles.tocLink}>
                <span className={styles.tocIcon}>10</span>
                出力検証・ガードレール
              </a>
            </li>
            <li>
              <a href="#sec-11" className={styles.tocLink}>
                <span className={styles.tocIcon}>11</span>
                レッドチーミング
              </a>
            </li>
            <li>
              <a href="#sec-12" className={styles.tocLink}>
                <span className={styles.tocIcon}>12</span>
                監視・IR
              </a>
            </li>
            <li>
              <a href="#sec-13" className={styles.tocLink}>
                <span className={styles.tocIcon}>13</span>
                サプライチェーン/AIBOM
              </a>
            </li>
            <li>
              <a href="#sec-14" className={styles.tocLink}>
                <span className={styles.tocIcon}>14</span>
                ガバナンス・法規制
              </a>
            </li>
            <li>
              <a href="#sec-15" className={styles.tocLink}>
                <span className={styles.tocIcon}>15</span>
                インシデント事例
              </a>
            </li>
            <li>
              <a href="#sec-16" className={styles.tocLink}>
                <span className={styles.tocIcon}>16</span>
                成熟度モデル
              </a>
            </li>
            <li>
              <a href="#sec-17" className={styles.tocLink}>
                <span className={styles.tocIcon}>17</span>
                参考文献
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={styles.content}>
        <section className={styles.hero} id="sec-00">
          <div className={styles.eyebrow}>中級〜上級者向け実践ガイド</div>
          <h1 className={styles.pageTitle}>
            AIセキュリティ ベストプラクティス完全ガイド（中級〜上級者向け）
          </h1>
          <p className={styles.subtitle}>
            LLM・RAG基盤・AIエージェント・MCP(Model Context
            Protocol)連携システムを設計/実装/運用するエンジニアのための、2026年7月時点の最新フレームワークと実践的な多層防御の設計指針。
          </p>
          <div className={styles.heroFooter}>
            <span>最終更新基準日: 2026年7月8日</span>
          </div>
        </section>

        <section className={styles.step} id="sec-01">
          <p className={styles.stepLabel}>Step 01</p>
          <h2>なぜ今、AIセキュリティなのか</h2>
          <p>
            生成AI・LLMアプリケーションは、2024年後半から2026年にかけて「文章を生成するだけの存在」から「ツールを呼び出し、記憶を持ち、自律的に行動するエージェント」へと急速に進化しました。この変化に伴い、セキュリティ上の前提そのものが変わっています。
          </p>
          <p>
            従来のアプリケーションセキュリティは「決定論的なコードパス」を前提としていましたが、LLMは非決定論的かつ自然言語駆動であるため、攻撃面もSAST/DASTのような従来型ツールでは捉えきれません。攻撃はコードレベルではなく、プロンプトや会話レベルで発生します。さらに2025〜2026年にかけては、AIエージェントが実運用のワークフローに組み込まれ、平均的な企業ではマシンID対ヒューマンIDの比率が82対1に達しているとの報告もあり、エージェントは「テキストを生成するだけ」の存在から「現実世界のアクションを実行する」存在へと変わりました
            <sup>[5]</sup>。
          </p>
          <p>この結果、以下のような新しいリスクカテゴリが実務上の最優先事項になっています。</p>
          <ul className={styles.plain}>
            <li>プロンプトインジェクション（直接・間接）</li>
            <li>機密情報の漏洩（システムプロンプト、PII、学習データ）</li>
            <li>データ/モデルポイズニング、サプライチェーン攻撃</li>
            <li>モデル抽出・窃取</li>
            <li>RAG・ベクトルDBを経由した攻撃</li>
            <li>エージェントの目標乗っ取り、ツール誤用、権限昇格</li>
            <li>MCP（Model Context Protocol）のようなツール連携プロトコル特有の脆弱性</li>
          </ul>

          <div className={`${styles.callout} ${styles.info}`}>
            <i className="ti ti-info-circle" aria-hidden="true" />
            <div>
              <strong>Guide Scope:</strong>{" "}
              本ガイドは、これらすべてを中級〜上級者向けに、最新（2026年7月時点）の一次情報に基づいて整理し、実践的な多層防御の設計指針を提供します。
            </div>
          </div>
        </section>

        <section className={styles.step} id="sec-02">
          <p className={styles.stepLabel}>Step 02</p>
          <h2>AI脅威ランドスケープの全体像</h2>
          <p>
            AIシステムは、データ層・モデル層・アプリケーション層・エージェント/ツール層・インフラ層という5つの層それぞれに固有の攻撃面を持ちます。まず全体像を俯瞰します。
          </p>

          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.threatLandscape} />
            </div>
          </div>

          <p>
            この全体像を踏まえたうえで、業界標準のフレームワークがそれぞれの層をどうカバーしているかを次章で整理します。
          </p>
        </section>

        <section className={styles.step} id="sec-03">
          <p className={styles.stepLabel}>Step 03</p>
          <h2>主要セキュリティフレームワークの理解</h2>
          <p>
            AIセキュリティには「唯一の標準」は存在せず、複数のフレームワークを組み合わせて使うのが実務上の標準的アプローチです。それぞれの役割分担を理解することが最初のステップです。
          </p>

          <table>
            <thead>
              <tr>
                <th>フレームワーク</th>
                <th>発行元</th>
                <th>性質</th>
                <th>主なカバー範囲</th>
                <th>最新状況（2026年7月時点）</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OWASP Top 10 for LLM Applications</td>
                <td>OWASP GenAI Security Project</td>
                <td>優先度付きリスクリスト（チェックリスト型）</td>
                <td>
                  プロンプトインジェクション、機密情報漏洩、サプライチェーン、データ/モデルポイズニング等10項目
                </td>
                <td>
                  2025年版が最新。LLM01〜LLM10として体系化<sup>[1][3]</sup>
                </td>
              </tr>
              <tr>
                <td>OWASP Top 10 for Agentic Applications</td>
                <td>OWASP GenAI Security Project</td>
                <td>エージェント特化の優先度付きリスクリスト</td>
                <td>目標ハイジャック、ツール誤用、ID/権限乱用、サプライチェーン侵害等</td>
                <td>
                  2026年版がBlack Hat Europe 2025で発表され、ASI01〜ASI10として整理
                  <sup>[10][11]</sup>
                </td>
              </tr>
              <tr>
                <td>MITRE ATLAS</td>
                <td>MITRE Corporation</td>
                <td>攻撃者の戦術・手法のナレッジベース（ATT&CK類似）</td>
                <td>偵察からモデル窃取、侵害後の影響まで攻撃チェーン全体</td>
                <td>
                  2026年2月時点でv5.4.0、16戦術・84手法・56サブ手法・32緩和策・42実事例に拡大
                  <sup>[40][41]</sup>
                </td>
              </tr>
              <tr>
                <td>NIST AI RMF + Generative AI Profile</td>
                <td>米国NIST</td>
                <td>任意適用のリスクマネジメントフレームワーク</td>
                <td>Govern/Map/Measure/Manageの4機能、生成AI特有の12リスク領域</td>
                <td>
                  2026年2月にNIST CAISIがAI Agent Standards
                  Initiativeを発表、将来的な成果物の策定に向け活動中<sup>[30][32]</sup>
                </td>
              </tr>
              <tr>
                <td>ISO/IEC 42001</td>
                <td>ISO/IEC</td>
                <td>認証可能なマネジメントシステム規格（PDCA型）</td>
                <td>AI管理システム全体のガバナンス、リスク管理、説明責任</td>
                <td>
                  世界初の認証可能なAI管理システム規格。Microsoft、Synthesia等が認証取得済み
                  <sup>[102][106]</sup>
                </td>
              </tr>
              <tr>
                <td>EU AI Act</td>
                <td>欧州連合</td>
                <td>法的拘束力のある規制</td>
                <td>リスクベースのAI規制、GPAIモデル義務、高リスクAIシステム義務</td>
                <td>
                  2026年8月2日（現行法）に大部分が適用開始。高リスク義務は2027年12月/2028年8月（延期案、官報公布待ち）へ延期見込み（Omnibus合意）
                  <sup>[58][60]</sup>
                </td>
              </tr>
            </tbody>
          </table>

          <p>これらの関係性を図で整理すると、次のようになります。</p>

          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.frameworkRelations} />
            </div>
          </div>

          <h3>実務上の使い分けの目安:</h3>
          <ul className={styles.plain}>
            <li>
              <strong>ガバナンス・経営層への説明責任</strong>が目的なら → NIST AI RMF / ISO 42001
            </li>
            <li>
              <strong>開発チームの技術的実装チェックリスト</strong>が目的なら → OWASP Top 10 (LLM /
              Agentic)
            </li>
            <li>
              <strong>レッドチーム演習・脅威モデリングの語彙</strong>が目的なら → MITRE ATLAS
            </li>
            <li>
              <strong>法的コンプライアンス</strong>が目的なら → EU AI Act（および各国のAI関連法）
            </li>
          </ul>
        </section>

        <section className={styles.step} id="sec-04">
          <p className={styles.stepLabel}>Step 04</p>
          <h2>ステップ1: プロンプトインジェクション対策</h2>
          <p>
            OWASP Top 10 for LLM Applications
            2025において、プロンプトインジェクションは依然として第1位（LLM01:2025）の重大リスクです
            <sup>[1][3]</sup>
            。攻撃者がLLMへの入力を操作し、意図した振る舞いを上書きすることで、機密情報の窃取・意思決定
            の改ざん・不正なツール実行を引き起こします。
          </p>

          <h3>4.1 直接インジェクションと間接インジェクションの違い</h3>
          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.promptInjection} />
            </div>
          </div>
          <p>
            間接インジェクションが特に危険な理由は、コンテンツの出どころ（provenance）をユーザーが検証できない点にあります。エージェントが読み込む文書・メール・ツール出力は「データ」であるはずなのに、LLMの内部ではそれが「指示」として解釈されてしまう構造的な問題です。
          </p>

          <h3>4.2 防御技術の比較</h3>
          <div className={`${styles.callout} ${styles.warn}`}>
            <i className="ti ti-alert-triangle" aria-hidden="true" />
            <div>
              <strong>重要な前提:</strong> OpenAI・Anthropic・Google
              DeepMindはいずれも2025年の公表資料で「現在のLLMアーキテクチャの範囲内ではプロンプトインジェクションを完全に解決することはできない」と認めています。モデルレベルで表現される防御策は原理的にすべて上書きされうるためです
              <sup>[28]</sup>
              。したがって実務上は「多層防御でブラスト半径を縮小する」ことが目標になります。
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>防御技術</th>
                <th>概要</th>
                <th>効果（研究報告値）</th>
                <th>コスト/トレードオフ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Spotlighting（区切り・データマーキング・エンコーディング）</td>
                <td>
                  信頼できない外部コンテンツを特殊なマーカーで囲み、モデルに「これは指示ではなくデータ」と明示する
                </td>
                <td>
                  攻撃成功率を50%超から2%未満に低減（GPT系モデルでの実験）<sup>[32][53]</sup>
                </td>
                <td>実装コストは低いが、適応的攻撃には依然脆弱</td>
              </tr>
              <tr>
                <td>StruQ（構造化クエリ）</td>
                <td>
                  ベースモデルを再学習し、プロンプト部分とデータ部分を分離したチャネルとして扱わせる
                </td>
                <td>プロンプトインジェクション成功率を大幅に低減</td>
                <td>モデルの再学習が必要でコスト高</td>
              </tr>
              <tr>
                <td>SecAlign（選好最適化）</td>
                <td>学習時にプロンプトインジェクションへの耐性を最適化する</td>
                <td>
                  各種インジェクションの成功率を10%未満に低減（訓練時に見ていない高度な攻撃に対しても）
                  <sup>[54]</sup>
                </td>
                <td>モデル提供側でのみ実施可能</td>
              </tr>
              <tr>
                <td>Self-Reminder</td>
                <td>システムプロンプトにユーザークエリを包み込み、責任ある応答を促す</td>
                <td>
                  ジェイルブレイク成功率を67.21%から19.34%へ低減<sup>[54]</sup>
                </td>
                <td>軽量だが万能ではない</td>
              </tr>
              <tr>
                <td>LLMベース前処理フィルタ（PromptArmor等）</td>
                <td>専用LLMで入力を検査し、インジェクション内容を検出・除去する</td>
                <td>
                  AgentDojoベンチマークで誤検知/見逃し率1%未満<sup>[50]</sup>
                </td>
                <td>追加のLLM呼び出しにより200〜600msのレイテンシ増</td>
              </tr>
              <tr>
                <td>出力スキーマ検証</td>
                <td>ツール呼び出しやレスポンスをJSON Schema等で厳格に検証する</td>
                <td>明らかな逸脱を機械的に検出</td>
                <td>低コストで常時導入すべき基礎対策</td>
              </tr>
              <tr>
                <td>行動監視・多モデル投票</td>
                <td>複数モデルでの合議、または実行後の振る舞い一貫性チェック（MELON等）</td>
                <td>高リスクなアクションに限定して有効</td>
                <td>コスト・レイテンシ増（30〜50%程度）</td>
              </tr>
            </tbody>
          </table>

          <p>
            実務でのプライオリティは、TokenMixの2026年ベンチマークが示す実装順序が参考になります:
            ①構造化プロンプトフォーマット（無償・常時導入）→ ②出力スキーマ検証（低コスト）→
            ③レート制限 → ④LLMフィルタ → ⑤行動監視 →
            ⑥高リスクアクション限定の多モデル投票、という段階的な積み上げです<sup>[50]</sup>。
          </p>

          <h3>4.3 実装チェックリスト</h3>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                すべての外部コンテンツ（RAG検索結果、Web取得結果、ツール出力、添付ファイル）を「信頼できない入力」として扱う
              </span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                システムプロンプトとユーザー/外部データを明確に分離する区切り文字・タグを導入する（例:{" "}
                <code>&lt;user_input&gt;</code>、<code>&lt;untrusted_content&gt;</code>）
              </span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                高リスクなアクション（送金、削除、デプロイ、権限変更等）には人間による再確認（Step-up確認）を要求する
              </span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                単一の防御技術に依存せず、入力検証・出力検証・行動監視を組み合わせた多層防御を構築する
              </span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                プロンプトインジェクションは「防御しきれない前提」でインシデント対応計画を用意する
              </span>
            </li>
          </ul>
        </section>

        <section className={styles.step} id="sec-05">
          <p className={styles.stepLabel}>Step 05</p>
          <h2>ステップ2: 機密情報漏洩・システムプロンプト漏洩対策</h2>
          <p>
            OWASP Top 10 2025では「Sensitive Information Disclosure」がLLM02、「System Prompt
            Leakage」がLLM07として独立したカテゴリになっています<sup>[8]</sup>。
          </p>

          <h3>5.1 何が漏洩しうるか</h3>
          <ul className={styles.plain}>
            <li>
              システムプロンプトそのもの（内部ロジック、機密ビジネスルール、APIキーの参照方法などが含まれる場合がある）
            </li>
            <li>学習データに含まれるPII（個人識別情報）や機密文書の記憶（memorization）</li>
            <li>RAGパイプラインを通じて取得された、本来アクセス権のない他テナントのデータ</li>
            <li>ツール呼び出しの引数・レスポンスに含まれる認証情報</li>
          </ul>

          <h3>5.2 対策</h3>
          <table>
            <thead>
              <tr>
                <th>対策領域</th>
                <th>具体策</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>システムプロンプト設計</td>
                <td>
                  機密情報（APIキー、内部ロジックの詳細、他ユーザーの情報）をシステムプロンプトに含めない。含めざるを得ない場合は別レイヤー（ツール呼び出し経由）で注入し、モデルのコンテキストウィンドウに直接置かない
                </td>
              </tr>
              <tr>
                <td>出力フィルタリング</td>
                <td>
                  正規表現・分類器・DLP（データ損失防止）ツールを組み合わせ、APIキーやPIIパターンを含む応答をブロックする
                </td>
              </tr>
              <tr>
                <td>アクセス制御</td>
                <td>
                  RAG検索やツール呼び出しは、呼び出し元ユーザーの権限スコープでのみ実行する（Confused
                  Deputy対策と直結）
                </td>
              </tr>
              <tr>
                <td>監査ログ</td>
                <td>
                  すべての入出力をログ化し、異常な質問パターン（システムプロンプトを聞き出そうとする探索的クエリ等）を検知する
                </td>
              </tr>
              <tr>
                <td>ネットワーク境界での保護</td>
                <td>
                  AI Gatewayやプロキシ層でトラフィックを可視化し、ビット単位でのデータ漏洩検知を行う
                  <sup>[7]</sup>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.step} id="sec-06">
          <p className={styles.stepLabel}>Step 06</p>
          <h2>ステップ3: データ/モデルポイズニング対策</h2>
          <p>
            データポイズニングは学習データを汚染して推論時の振る舞いを操作する攻撃であり、推論時に入力を細工する回避攻撃（evasion
            attack）とは区別されます<sup>[76]</sup>
            。攻撃者は「特定の入力に対してのみ攻撃者が望む出力を返し、それ以外では正常に動作する」よう仕込むため、標準的な評価だけでは検出が困難です。
          </p>

          <h3>6.1 データポイズニングとモデルポイズニングの違い</h3>
          <ul className={styles.plain}>
            <li>
              <strong>データポイズニング</strong>: 学習データそのものに悪意あるサンプルを注入する
            </li>
            <li>
              <strong>モデルポイズニング</strong>:
              学習済みモデルのパラメータやファインチューニング過程を操作する（例:
              手書き文字認識モデルで「3」を「8」と誤認識させ、小切手の金額を改ざんする実例が知られています）
              <sup>[77]</sup>
            </li>
          </ul>

          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.dataPoisoning} />
            </div>
          </div>

          <h3>6.2 実践的な防御策（OWASP推奨に基づく8つの戦術）</h3>
          <ol className={styles.plain}>
            <li>
              <strong>データ来歴の検証</strong>:
              学習パイプラインを通過するすべてのデータを厳格に検証する。デジタル署名やハッシュ検証で改ざんを検知する
            </li>
            <li>
              <strong>アクセス制御</strong>:
              学習データセット・パイプラインへのアクセスにRBAC、多要素認証、最小権限原則を適用する
              <sup>[77]</sup>
            </li>
            <li>
              <strong>データバージョン管理</strong>:
              変更履歴を追跡し、いつ・誰が・何を追加したかを監査可能にする
            </li>
            <li>
              <strong>サンドボックス化</strong>:
              外部データソースの取り込みは隔離環境で行い、影響範囲を限定する
            </li>
            <li>
              <strong>異常検知</strong>:
              特定の入力グループに対する性能劣化や予測パターンの偏りを継続的にモニタリングする
            </li>
            <li>
              <strong>分布シフト検知</strong>:
              モデル振る舞いの分布シフトに対する自動アラートを設定する
            </li>
            <li>
              <strong>敵対的トレーニング</strong>:
              既知の攻撃パターンを意図的に学習に含め、頑健性を高める
            </li>
            <li>
              <strong>EU AI Actへのコンプライアンス</strong>:
              高リスクAIシステム提供者はデータガバナンス（品質管理・バイアス検出）の実施が義務付けられており、ポイズニング対策はコンプライアンス上の要求でもあります
              <sup>[76]</sup>
            </li>
          </ol>

          <div className={`${styles.callout} ${styles.note}`}>
            <i className="ti ti-bookmark" aria-hidden="true" />
            <div>
              <strong>参考標準:</strong> NIST AI 100-2（Adversarial Machine Learning: A Taxonomy and
              Terminology of Attacks and
              Mitigations）は、ポイズニング攻撃に関する標準化された語彙と脅威分類を提供しており、リスクアセスメントの共通言語として活用できます
              <sup>[76]</sup>。
            </div>
          </div>
        </section>

        <section className={styles.step} id="sec-07">
          <p className={styles.stepLabel}>Step 07</p>
          <h2>ステップ4: モデル抽出・窃取対策</h2>
          <p>
            モデル抽出（Model Extraction / Model
            Stealing）は、公開されている推論API（予測API）に大量のクエリを投げ、その入出力ペアから代理モデル（サロゲートモデル）を再構築する攻撃です。2016年のTramèrらによる「Stealing
            Machine Learning Models via Prediction APIs」以降、研究が蓄積されています
            <sup>[78][80]</sup>。
          </p>

          <h3>7.1 関連する攻撃のファミリー</h3>
          <table>
            <thead>
              <tr>
                <th>攻撃</th>
                <th>概要</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>モデル抽出攻撃</td>
                <td>予測APIへの大量クエリから、機能的に類似したモデルを再構築する</td>
              </tr>
              <tr>
                <td>メンバーシップ推論攻撃</td>
                <td>ある特定のデータが学習データに含まれていたかどうかを推測する</td>
              </tr>
              <tr>
                <td>モデル反転攻撃</td>
                <td>モデルの出力から学習データ（機密情報を含む可能性がある）を復元する</td>
              </tr>
              <tr>
                <td>データフリー抽出</td>
                <td>実データを用いず、合成データのみでモデルを抽出する高度な手法</td>
              </tr>
            </tbody>
          </table>

          <h3>7.2 防御策</h3>
          <ul className={styles.plain}>
            <li>
              <strong>レート制限とクエリ監視</strong>:
              単一アカウント/IPからの異常に高頻度・高ボリュームなクエリを検知し、レート制限やCAPTCHA、一時停止で対応する
            </li>
            <li>
              <strong>出力の丸め・ノイズ付加</strong>:
              確信度スコアなど詳細すぎる出力情報を制限し、丸め処理やノイズを加えることでモデル内部構造の推測を難しくする
            </li>
            <li>
              <strong>透かし（Watermarking）</strong>:
              モデルの出力に検出可能な透かしを埋め込み、不正な複製モデルの証拠とする
            </li>
            <li>
              <strong>クエリパターン分析</strong>:
              決定境界を探るような系統的なクエリパターン（クラス境界の走査等）を検知する異常検知システムを導入する
            </li>
            <li>
              <strong>APIキー・利用規約による法的保護</strong>:
              技術的対策に加え、利用規約・レート制限・APIキー単位の追跡で法的責任の所在を明確にする
            </li>
            <li>
              <strong>知的財産としてのモデル管理</strong>:
              モデル自体をAIBOM（後述）で資産管理し、不正な複製や再配布を検知する仕組みを整える
            </li>
          </ul>
        </section>

        <section className={styles.step} id="sec-08">
          <p className={styles.stepLabel}>Step 08</p>
          <h2>ステップ5: RAG・ベクトルDBセキュリティ</h2>
          <p>
            RAG（Retrieval-Augmented
            Generation）は、LLMの知識をリアルタイムの外部データで補強する強力な仕組みですが、OWASP
            Top 10 2025では新たに「LLM08:2025 Vector and Embedding
            Weaknesses」というカテゴリが追加されたことが示す通り、独自の攻撃面を持ちます
            <sup>[97][99]</sup>。
          </p>

          <h3>8.1 RAGパイプラインの構造と攻撃面</h3>
          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.ragSecurity} />
            </div>
          </div>

          <h3>8.2 主要な攻撃パターン</h3>
          <ul className={styles.plain}>
            <li>
              <strong>RAGポイズニング（PoisonedRAG / CorruptRAG）</strong>:
              わずか数件、場合によっては単一の汚染文書をベクトルDBに混入させるだけで、特定の高価値クエリに対する回答を97%の確率でハイジャックできるという研究結果が報告されています。単純な複数文書注入型（PoisonedRAG）に加え、2026年1月に発表されたCorruptRAGは単一文書での攻撃を実現し、ボリュームベースの異常検知を回避しやすくなっています
              <sup>[97][98]</sup>
            </li>
            <li>
              <strong>埋め込み反転攻撃（Embedding Inversion）</strong>:
              高次元ベクトルから元のテキスト（機密情報を含む可能性がある）を復元する攻撃
            </li>
            <li>
              <strong>クロステナント意味的漏洩</strong>:
              マルチテナントのベクトルDBにおいて、あるテナントのクエリの埋め込みが別テナントの機密文書の埋め込みと意味的に近接しているために、意図せず情報が漏洩するケース
              <sup>[98]</sup>
            </li>
            <li>
              <strong>未認証エンドポイントの露出</strong>:
              2026年2月に発生したAnythingLLMのインシデントでは、未認証のエンドポイントがPinecone
              APIキーを露出させ、企業の埋め込みデータへの読み書き削除フルアクセスを許してしまいました（詳細は15章の事例を参照）
              <sup>[94]</sup>
            </li>
          </ul>

          <h3>8.3 対策</h3>
          <table>
            <thead>
              <tr>
                <th>領域</th>
                <th>具体策</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>取り込みパイプラインの保護</td>
                <td>
                  外部ソースからの取り込みには「検疫（quarantine）→レビュー→承認」のワークフローを設ける。隠れたUnicode文字や指示的なフレーズなど既知のポイズニングパターンをスキャンする
                  <sup>[96]</sup>
                </td>
              </tr>
              <tr>
                <td>書き込み権限の分離</td>
                <td>
                  取り込み用ロールと検索用ロールを分離し、コレクション/名前空間単位で最小権限を適用する
                  <sup>[95]</sup>
                </td>
              </tr>
              <tr>
                <td>アクセス制御</td>
                <td>
                  RBAC/ABACとネットワーク分離を組み合わせたマルチテナントアクセス制御を実装する
                </td>
              </tr>
              <tr>
                <td>暗号化</td>
                <td>
                  保存時・転送時の埋め込み暗号化。高リスク用途では準同型暗号による暗号化ベクトル上での類似度検索も検討する
                  <sup>[98]</sup>
                </td>
              </tr>
              <tr>
                <td>監視</td>
                <td>
                  特定チャンクへの検索急増、低信頼度マッチの連続、最近更新されたドキュメントからの逸脱パターンなど、異常な検索パターンを監視する
                  <sup>[96]</sup>
                </td>
              </tr>
              <tr>
                <td>コンプライアンス基盤</td>
                <td>
                  クエリレベルのアクセスログ、RBACのエビデンス、暗号鍵管理文書、名前空間エスケープテストを整備する。これらの欠如がSOC
                  2 Type II監査やHIPAA評価の失敗要因になっています<sup>[94]</sup>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.step} id="sec-09">
          <p className={styles.stepLabel}>Step 09</p>
          <h2>ステップ6: エージェント型AI・MCPセキュリティ</h2>
          <p>
            AIエージェントとMCP（Model Context
            Protocol）は、2026年時点で最も急速にリスクが拡大している領域です。エージェントは「計画し、ツールを呼び出し、記憶を保持し、他のエージェントと通信し、実世界のクレデンシャルで行動する」存在であるため、単なるチャットボットのセキュリティモデルでは対応できません
            <sup>[16]</sup>。
          </p>

          <h3>9.1 OWASP Top 10 for Agentic Applications 2026 (ASI01〜ASI10)</h3>
          <p>
            2026年版OWASP Top 10 for Agentic Applicationsは、Black Hat Europe 2025でのOWASP Agentic
            Security Summitと合わせて発表され、100以上の業界専門家によるレビューを経て策定されました
            <sup>[10]</sup>。
          </p>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>リスク名</th>
                <th>概要</th>
                <th>主な緩和策</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className={`${styles.badge} ${styles.badgeCritical}`}>ASI01</span>
                </td>
                <td>
                  <strong>Agent Goal Hijack（目標ハイジャック）</strong>
                </td>
                <td>
                  ツール出力・検索結果・メール等に埋め込まれた悪意ある指示によって、エージェントの目的そのものが書き換えられる
                </td>
                <td>
                  すべてのエージェント消費コンテンツを信頼できないものとして扱う。指示とデータを構造的に分離し、目標スコープを固定する
                  <sup>[16]</sup>
                </td>
              </tr>
              <tr>
                <td>
                  <span className={`${styles.badge} ${styles.badgeHigh}`}>ASI02</span>
                </td>
                <td>
                  <strong>Tool Misuse & Exploitation（ツール誤用・悪用）</strong>
                </td>
                <td>過剰な権限を持つツールが、悪意なくとも誤用される</td>
                <td>ツールごとに最小権限のスコープを設計し、実行前に文脈依存の承認を要求する</td>
              </tr>
              <tr>
                <td>
                  <span className={`${styles.badge} ${styles.badgeCritical}`}>ASI03</span>
                </td>
                <td>
                  <strong>Agent Identity & Privilege Abuse（ID・権限乱用）</strong>
                </td>
                <td>
                  セッション・ユーザー・委任ワークフローをまたいで権限が誤って継承・保持される（例:
                  マネージャーがタスクを委任した後も管理者権限が残存）
                </td>
                <td>
                  エージェントに専用の管理されたIDと制限付きスコープを持たせ、ユーザーセッションを「借用」させない
                  <sup>[17][56]</sup>
                </td>
              </tr>
              <tr>
                <td>
                  <span className={`${styles.badge} ${styles.badgeHigh}`}>ASI04</span>
                </td>
                <td>
                  <strong>Agentic Supply Chain Compromise（サプライチェーン侵害）</strong>
                </td>
                <td>
                  プロンプト・プラグイン・ツール・エージェントカード・モデルを動的にロードする際、侵害/なりすましコンポーネントが混入する
                </td>
                <td>署名検証、レジストリのスキャン、バージョン固定、変更のレビュー</td>
              </tr>
              <tr>
                <td>
                  <span className={`${styles.badge} ${styles.badgeCritical}`}>ASI05</span>
                </td>
                <td>
                  <strong>Unexpected Code Execution（意図しないコード実行）</strong>
                </td>
                <td>コード生成/実行を行うエージェントが悪意ある指示で任意コードを実行させられる</td>
                <td>サンドボックス実行環境、実行前の静的解析、ネットワークアウトバウンド制限</td>
              </tr>
              <tr>
                <td>
                  <span className={`${styles.badge} ${styles.badgeHigh}`}>ASI06</span>
                </td>
                <td>
                  <strong>Memory & Context Poisoning（メモリ・コンテキスト汚染）</strong>
                </td>
                <td>
                  将来のセッションで読み取られるメモリに悪意ある内容が書き込まれ、書き込みと読み取りの時間差により検出が困難な遅延攻撃となる
                </td>
                <td>
                  メモリに書き込む前に構造的分離（spotlighting等）を適用する。メモリの出所を追跡する
                  <sup>[48]</sup>
                </td>
              </tr>
              <tr>
                <td>
                  <span className={`${styles.badge} ${styles.badgeMid}`}>ASI07</span>
                </td>
                <td>
                  <strong>
                    Insecure Inter-Agent Communication（安全でないエージェント間通信）
                  </strong>
                </td>
                <td>
                  複数エージェントが連携する際の通信チャネルが検証されず、なりすましや改ざんが可能になる
                </td>
                <td>エージェント間通信の相互認証、メッセージ署名、ゼロトラスト設計</td>
              </tr>
              <tr>
                <td>
                  <span className={`${styles.badge} ${styles.badgeMid}`}>ASI08</span>
                </td>
                <td>
                  <strong>Cascading Agent Failures（連鎖的障害）</strong>
                </td>
                <td>
                  1つのエージェントの誤動作が、依存する他のエージェント/ワークフローに連鎖的に波及する
                </td>
                <td>サーキットブレーカーパターン、障害の分離、段階的縮退設計</td>
              </tr>
              <tr>
                <td>
                  <span className={`${styles.badge} ${styles.badgeMid}`}>ASI09</span>
                </td>
                <td>
                  <strong>Human-Agent Trust Exploitation（人間-エージェント間信頼の悪用）</strong>
                </td>
                <td>
                  説得力のあるエージェントの出力が人間の承認を「ゴム印」化させ、自動化バイアスを助長する
                </td>
                <td>
                  高リスクアクションへのステップアップ認証、信頼度スコアの明示、AIが書いていない平易な要約の提示
                  <sup>[17]</sup>
                </td>
              </tr>
              <tr>
                <td>
                  <span className={`${styles.badge} ${styles.badgeCritical}`}>ASI10</span>
                </td>
                <td>
                  <strong>Rogue Agents（暴走エージェント）</strong>
                </td>
                <td>エージェントの意思決定プロセスが乗っ取られ、悪意ある主体として振る舞う</td>
                <td>厳格な運用上の制約とガードレール、振る舞いの異常に対する継続的監視</td>
              </tr>
            </tbody>
          </table>

          <div className={`${styles.callout} ${styles.warn}`}>
            <i className="ti ti-alert-triangle" aria-hidden="true" />
            <div>
              <strong>Least Agency（最小自律性）の原則:</strong>{" "}
              自律性は既定値ではなく「勝ち取るべき機能」であり、エージェントに白紙委任を与えることは、単一の悪意あるプロンプトで操作可能な内部脅威を生み出すことに等しい、という指摘が2026年版で強調されています
              <sup>[17]</sup>。
            </div>
          </div>

          <h3>9.2 MCP（Model Context Protocol）特有の攻撃面</h3>
          <p>
            MCPは2024年11月にAnthropicが発表したオープン標準で、AIホスト（Claude Desktop、Cursor、VS
            Code Copilot等）とツール/データソースを標準化されたJSON-RPCベースの仕組みで接続します
            <sup>[11][21]</sup>
            。2025年11月の仕様（2025-11-25）ではリモートMCPサーバーの認証方式としてOAuth
            2.1が正式に組み込まれ、プロトコルのセキュリティ成熟度が一段階進みましたが<sup>[22]</sup>
            、2026年1〜2月には30件以上のCVEがMCPサーバー・クライアント・インフラコンポーネントに対して報告されています。中でもmcp-remoteプロキシパッケージに関わるCVE-2025-6514はCVSS
            9.6という高スコアを記録しました<sup>[22]</sup>。
          </p>

          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.mcpTrust} />
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>攻撃パターン</th>
                <th>概要</th>
                <th>対策</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tool Poisoning（ツール説明文の毒化）</td>
                <td>
                  ユーザーが検査できないツール説明文の部分に悪意ある指示を埋め込み、AIの意思決定に影響を与える。OWASP
                  Agentic Top10のASI01（目標ハイジャック）に構造的に類似する
                </td>
                <td>
                  ツール説明文を既知の正常なベースラインと照合検証する。セッション間での変化を検知する（Invariant
                  Labsのmcp-scan等のOSSツールが利用可能）<sup>[22]</sup>
                </td>
              </tr>
              <tr>
                <td>Rug Pull攻撃（Bait-and-Switch）</td>
                <td>
                  一度承認されたMCPツール登録が継続的に再検証されないことを悪用し、承認後にツール定義を差し替える
                </td>
                <td>
                  ツール定義のハッシュ検証、定期的な再承認フロー、変更検知アラート<sup>[22]</sup>
                </td>
              </tr>
              <tr>
                <td>Confused Deputy Problem</td>
                <td>
                  MCPサーバーがユーザーより広い権限で動作できる場合、ユーザーが本来許可されていない操作を実行してしまう
                </td>
                <td>
                  サーバーは「ユーザーに代わって明示的な同意のもと、最小権限スコープで」動作させる。包括的なサービスIDでの実行を避ける
                  <sup>[26]</sup>
                </td>
              </tr>
              <tr>
                <td>Token Passthrough</td>
                <td>
                  クライアントトークンを適切な検証なしに下流APIへそのまま渡してしまい、信頼境界とオーディエンス制御が破られる
                </td>
                <td>
                  トークンのオーディエンス検証を必須化し、パススルーを許可しない<sup>[26]</sup>
                </td>
              </tr>
              <tr>
                <td>サプライチェーン型侵害</td>
                <td>
                  typosquattingされたツール名、リモートで差し替えられたプロンプトテンプレート、署名されていないエージェントカードによる隠し動作の注入
                </td>
                <td>
                  パッケージレジストリのアカウント検証、依存関係のスキャンとバージョン固定、公開前レビュー
                  <sup>[17][26]</sup>
                </td>
              </tr>
              <tr>
                <td>リポジトリ設定ファイル経由のRCE</td>
                <td>
                  信頼できないプロジェクトをクローンして開くだけで、リポジトリレベルの設定ファイルが実行層の一部として機能し、ユーザーの同意ダイアログの前にリモートコード実行やAPIキー流出が起きる（Claude
                  CodeにおけるCVE-2025-59536, CVE-2026-21852として報告）
                </td>
                <td>
                  未検証リポジトリを開く前のサンドボックス化、設定ファイルの自動実行を無効化するデフォルト設定
                  <sup>[18]</sup>
                </td>
              </tr>
            </tbody>
          </table>

          <h3>9.3 「Lethal Trifecta（致死の三要素）」という考え方</h3>
          <p>
            Simon WillisonとPalo Alto
            Networksが2026年に提唱した概念で、以下の3条件が同時に満たされるとエージェントスキル/ツールは特に危険になるとされています
            <sup>[18]</sup>。
          </p>
          <ol className={styles.plain}>
            <li>
              <strong>プライベートデータへのアクセス</strong>
              （SSHキー、APIクレデンシャル、ウォレットファイル、ブラウザデータ等）
            </li>
            <li>
              <strong>信頼できないコンテンツへの露出</strong>
              （スキル指示、メモリファイル、メール等）
            </li>
            <li>
              <strong>外部通信能力</strong>（ネットワークegress、webhook呼び出し、curl等）
            </li>
          </ol>
          <p>
            多くの本番エージェントデプロイはこの3条件をすべて満たしているのが実情であり、いずれか1つを断ち切る設計（例:
            外部通信が必要なツールにはプライベートデータへのアクセスを与えない）がリスク低減の鍵になります。
          </p>

          <h3>9.4 MCP実装チェックリスト</h3>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                すべてのツール入力を「LLMから来たものであり、ユーザーから直接来たものではない」信頼できない入力として扱う
                <sup>[20]</sup>
              </span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                JSON Schemaで<code>additionalProperties: false</code>を含む厳格なスキーマ検証を行う
                <sup>[20]</sup>
              </span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                ツール登録は一度きりでなく、定期的な再検証・変更検知の仕組みを持たせる（Rug
                Pull対策）
              </span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                MCPサーバーはユーザーの同意のもと最小権限スコープで動作させ、包括的なサービスIDを使わない（Confused
                Deputy対策）
              </span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>リモートMCPサーバーとの通信にはOAuth 2.1ベースの認証を利用する</span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                ローカルMCPサーバーはサンドボックス化して実行する<sup>[24]</sup>
              </span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                サプライチェーン全体（依存パッケージ、スキル、エージェントカード）に署名検証とスキャンを適用する
              </span>
            </li>
          </ul>
        </section>

        <section className={styles.step} id="sec-10">
          <p className={styles.stepLabel}>Step 10</p>
          <h2>ステップ7: 出力検証・ガードレール設計</h2>
          <p>
            入力側の防御だけでなく、LLMの出力を実行・表示する前に検証する「出力側のガードレール」が同様に重要です。OWASP
            LLM05:2025「Improper Output
            Handling」は、出力の検証・サニタイズ・エスケープが不十分なために、下流システムでのコード実行やXSS等につながるリスクを指摘しています
            <sup>[1]</sup>。
          </p>

          <h3>10.1 多層防御としてのガードレール設計</h3>
          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.guardrailArchitecture} />
            </div>
          </div>

          <h3>10.2 具体的な実装ポイント</h3>
          <ul className={styles.plain}>
            <li>
              <strong>構造化出力の強制</strong>: 自由形式のテキストではなく、JSON
              Schema等で構造化された出力を要求し、機械的に検証する
            </li>
            <li>
              <strong>コード実行前のサンドボックス</strong>:
              生成されたコードは、実行前に必ず隔離されたサンドボックス環境を経由させる
            </li>
            <li>
              <strong>エスケープ処理の徹底</strong>:
              出力をHTML/SQL/シェルコマンド等に埋め込む場合は、必ず適切なエスケープ・パラメータ化を行う（従来のインジェクション対策と同様の考え方）
            </li>
            <li>
              <strong>確信度・出典表示</strong>:
              RAGベースの回答には出典を明示し、ユーザーが検証可能にする
            </li>
            <li>
              <strong>ハルシネーション対策</strong>:
              重要な事実確認が必要な出力については、複数ソースでのクロスチェックや、モデル自身による自己検証ステップを組み込む
            </li>
            <li>
              <strong>ポリシー違反コンテンツの検知</strong>:
              差別的表現、機密情報、規制対象コンテンツ等を検知する分類器をパイプラインに組み込む
            </li>
          </ul>
        </section>

        <section className={styles.step} id="sec-11">
          <p className={styles.stepLabel}>Step 11</p>
          <h2>ステップ8: AIレッドチーミング・敵対的テスト</h2>
          <p>
            AIレッドチーミングは、LLMやAIエージェントに対して敵対的手法で組織的にテストを行い、攻撃者より先に脆弱性を発見する実践です。従来のペネトレーションテストとは根本的に異なり、攻撃面が確率的であり、脆弱性はモデルの振る舞いに起因し、パッチは離散的なコード修正ではありません
            <sup>[71]</sup>。
          </p>

          <h3>11.1 セーフティ・レッドチーミングとセキュリティ・レッドチーミング</h3>
          <p>
            Microsoft AI Red Teamは2つの重複する目的を区別しています<sup>[71]</sup>。
          </p>
          <ul className={styles.plain}>
            <li>
              <strong>セーフティ・レッドチーミング</strong>:
              有害コンテンツ生成やポリシー違反のテスト
            </li>
            <li>
              <strong>セキュリティ・レッドチーミング</strong>:
              データ漏洩・システム侵害・不正なツール使用のテスト
            </li>
          </ul>

          <h3>11.2 レッドチーミングのライフサイクル</h3>
          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.redteamLifecycle} />
            </div>
          </div>
          <p>
            一度きりのテストでは不十分です。モデルの更新、ファインチューニング、システムプロンプトの変更、接続データソースの変更のいずれもが新たな脆弱性を生む、または既存の修正を後退させる可能性があるため、継続的な回帰テストが必要です
            <sup>[71]</sup>。
          </p>

          <h3>11.3 主要なツール・フレームワーク</h3>
          <table>
            <thead>
              <tr>
                <th>ツール/フレームワーク</th>
                <th>種別</th>
                <th>特徴</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OWASP Top 10 for LLMs / Agentic Applications</td>
                <td>カバレッジフレームワーク</td>
                <td>テスト対象リスクの優先順位付けに使用</td>
              </tr>
              <tr>
                <td>MITRE ATLAS</td>
                <td>脅威分類・戦術データベース</td>
                <td>レッドチームのシナリオ設計の語彙として活用</td>
              </tr>
              <tr>
                <td>Garak</td>
                <td>OSSツール</td>
                <td>LLM脆弱性の自動スキャン</td>
              </tr>
              <tr>
                <td>PyRIT (Microsoft)</td>
                <td>OSSフレームワーク</td>
                <td>敵対的プロンプトの自動生成・評価</td>
              </tr>
              <tr>
                <td>DeepTeam</td>
                <td>OSSフレームワーク</td>
                <td>
                  OWASP Top10フレームワークに基づく自動レッドチーム実行<sup>[8]</sup>
                </td>
              </tr>
              <tr>
                <td>Confident AI / General Analysis 等</td>
                <td>商用プラットフォーム</td>
                <td>
                  エージェント・RAG・MCP・マルチステップツール利用を含むシステムレベルの敵対的テスト、CI/CDリリースゲート統合
                  <sup>[68][69]</sup>
                </td>
              </tr>
            </tbody>
          </table>

          <h3>11.4 コミュニティリソース</h3>
          <ul className={styles.plain}>
            <li>
              <strong>Humane Intelligence</strong>:
              公開レッドチーム演習の実施とコミュニティでの知見共有
            </li>
            <li>
              <strong>AI Vulnerability Database（AI Risk and Vulnerability Alliance）</strong>:
              コミュニティ主導の脆弱性登録データベース
            </li>
            <li>
              <strong>DEF CON GRT / AISI</strong>:
              レッドチーミング競技会を通じたスキル習得と知見の蓄積<sup>[72]</sup>
            </li>
          </ul>
        </section>

        <section className={styles.step} id="sec-12">
          <p className={styles.stepLabel}>Step 12</p>
          <h2>ステップ9: 監視・可観測性・インシデントレスポンス</h2>
          <p>
            NISTは2026年3月のAI監視に関する報告書で、エージェント型システムの監視は「機能性・運用性・セキュリティ・コンプライアンス・人的要因」の5次元にまたがる必要があり、従来ソフトウェアの稼働率監視だけでは不十分だと明言しています
            <sup>[20]</sup>。
          </p>

          <h3>12.1 監視すべき5つの次元</h3>
          <table>
            <thead>
              <tr>
                <th>次元</th>
                <th>監視内容の例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>機能性</td>
                <td>タスク成功率、ハルシネーション率、出力品質の劣化</td>
              </tr>
              <tr>
                <td>運用性</td>
                <td>
                  レイテンシ、コスト（トークン消費）、リソース使用量の異常（Denial of Wallet対策）
                </td>
              </tr>
              <tr>
                <td>セキュリティ</td>
                <td>
                  異常なツール呼び出しパターン、権限外アクセス試行、既知の攻撃シグネチャとの一致
                </td>
              </tr>
              <tr>
                <td>コンプライアンス</td>
                <td>
                  データ処理の記録、監査証跡、規制で要求されるロギング（EU AI Act Article 12等）
                </td>
              </tr>
              <tr>
                <td>人的要因</td>
                <td>
                  人間の承認プロセスの遵守状況、自動化バイアスの兆候（過剰な「承認」クリック）
                </td>
              </tr>
            </tbody>
          </table>

          <h3>12.2 インシデントレスポンスフロー</h3>
          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.incidentResponse} />
            </div>
          </div>

          <h3>12.3 実装のポイント</h3>
          <ul className={styles.plain}>
            <li>
              <strong>完全な監査ログ</strong>:
              すべてのプロンプト、ツール呼び出し、レスポンス、承認/拒否の記録を改ざん耐性のある形で保存する
            </li>
            <li>
              <strong>リプレイ可能なエビデンス</strong>:
              レッドチーム/インシデント調査の双方で「再現可能なトレース」を残すことが、監査での説得力を左右します
              <sup>[68]</sup>
            </li>
            <li>
              <strong>異常検知の自動化</strong>:
              単なるルールベースだけでなく、ベースラインからの逸脱を検知する統計的/機械学習的手法を組み合わせる
            </li>
            <li>
              <strong>ロールバック可能性</strong>:
              モデル・プロンプト・ツール構成のバージョン管理を行い、迅速なロールバックを可能にする
            </li>
            <li>
              <strong>開示・通知プロセス</strong>: NIST AI RMF Generative AI
              Profileが重視する4つの柱の1つが「インシデント開示」であり、組織内外への適切な通知プロセスをあらかじめ設計しておく必要があります
              <sup>[32]</sup>
            </li>
          </ul>
        </section>

        <section className={styles.step} id="sec-13">
          <p className={styles.stepLabel}>Step 13</p>
          <h2>ステップ10: サプライチェーン・AIBOM・モデル署名</h2>
          <p>
            2026年、ソフトウェアサプライチェーンセキュリティは「静的SBOM（Software Bill of
            Materials）」の時代から「AIエージェントをサプライチェーンの主要なアクターとして扱うガバナンスの時代」へ移行しつつあります
            <sup>[86]</sup>。
          </p>

          <h3>13.1 AIBOM（AI Bill of Materials）とは</h3>
          <p>
            AIBOMは、モデルの来歴・ライセンス・学習データ・意図された用途を記録した検証可能な記録です
            <sup>[91]</sup>
            。従来のSBOMがカバーしていた「ソースコードと依存関係」に加え、以下の要素をカバーします。
          </p>
          <ul className={styles.plain}>
            <li>モデルの重み（weights）とその来歴</li>
            <li>学習データセットとそのライセンス</li>
            <li>ハイパーパラメータと推論時の依存関係</li>
            <li>ファインチューニングの履歴</li>
            <li>RAGソースとエージェントツールの依存関係</li>
          </ul>

          <h3>13.2 標準化の動向</h3>
          <table>
            <thead>
              <tr>
                <th>標準/取り組み</th>
                <th>発行元</th>
                <th>状況</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CycloneDX 1.7</td>
                <td>OWASP CycloneDX</td>
                <td>
                  2025年10月にAI/ML-BOMカバレッジを拡張。モデル来歴・学習データ・ハイパーパラメータ・推論依存関係の表現に2026年時点で事実上の標準として使われている
                  <sup>[84]</sup>
                </td>
              </tr>
              <tr>
                <td>OWASP AIBOMプロジェクト</td>
                <td>OWASP</td>
                <td>
                  2025年11月にv0.1マイルストーンに到達。SPDX
                  3.0と並行してAIシステム特有の要件を拡張中<sup>[84]</sup>
                </td>
              </tr>
              <tr>
                <td>Sigstore + cosignによるモデル署名</td>
                <td>CoSAI / OSS</td>
                <td>
                  「モデル署名はエンタープライズセキュリティに不可欠な、欠けていたプリミティブ」として2025年7月に位置付けられ、2026年のベンダーRFPでは事実上の標準要求になっている
                  <sup>[84]</sup>
                </td>
              </tr>
              <tr>
                <td>CISA他「AI in OTの安全な統合のための原則」</td>
                <td>CISA, NSA, FBI, 豪ACSC等</td>
                <td>
                  2025年12月3日に共同署名。重要インフラにおけるAI統合の安全原則を規定<sup>[84]</sup>
                </td>
              </tr>
            </tbody>
          </table>

          <h3>13.3 実践的な導入ステップ</h3>
          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.supplyChain} />
            </div>
          </div>

          <h3>13.4 セーフシリアライゼーションの重要性</h3>
          <p>
            モデルファイルの配布形式にも注意が必要です。Pickle形式でのモデルロードは任意コード実行のリスクを内包するため、Hugging
            Faceは公式にPickleスキャンのドキュメントを提供しており、Safetensors形式（安全なシリアライゼーション）への移行が推奨されています
            <sup>[90]</sup>。
          </p>
        </section>

        <section className={styles.step} id="sec-14">
          <p className={styles.stepLabel}>Step 14</p>
          <h2>ガバナンス・法規制コンプライアンス</h2>
          <p>
            技術的対策だけでなく、組織的なガバナンス体制の構築が不可欠です。ここでは実務上重要な3つの柱（EU
            AI Act、NIST AI RMF、ISO/IEC 42001）を整理します。
          </p>

          <h3>14.1 EU AI Actの適用タイムライン（2026年7月時点の最新状況）</h3>
          <p>
            EU AI
            Actは2024年8月1日に発効し、段階的に適用されています。2025年11月19日に欧州委員会が提案した「Digital
            Omnibus on
            AI」により、高リスクAIシステムの義務化時期が延期される見込みで、2026年5月7日に政治合意、6月16日に欧州議会が正式承認、6月29日に理事会が最終承認しました
            <sup>[64][66]</sup>。
          </p>

          <table>
            <thead>
              <tr>
                <th>適用日</th>
                <th>内容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025年2月2日</td>
                <td>禁止されるAI慣行、AIリテラシー義務が適用開始</td>
              </tr>
              <tr>
                <td>2025年8月2日</td>
                <td>ガバナンス規則、汎用AI（GPAI）モデル提供者の義務が適用開始</td>
              </tr>
              <tr>
                <td>
                  <strong>2026年8月2日</strong>
                </td>
                <td>
                  大部分の規則が適用開始。透明性義務（第50条、チャットボット等のAI利用開示）もこの日から適用
                  <sup>[58][59]</sup>
                </td>
              </tr>
              <tr>
                <td>2026年12月2日</td>
                <td>
                  AI生成コンテンツのラベリング（透かし等）義務の猶予期限。CSAM・非合意的性的画像生成の新たな禁止事項もこの日から
                  <sup>[61][64]</sup>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>2027年12月2日</strong>
                </td>
                <td>
                  単体の高リスクAIシステム（Annex III:
                  採用、信用スコアリング、法執行、教育、国境管理等）の義務化（Omnibusにより延期後の日程）
                  <sup>[60][64]</sup>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>2028年8月2日</strong>
                </td>
                <td>
                  規制対象製品に組み込まれた高リスクAI（Annex I: 医療機器、機械等）の義務化（同上）
                  <sup>[60][64]</sup>
                </td>
              </tr>
            </tbody>
          </table>

          <div className={`${styles.callout} ${styles.note}`}>
            <i className="ti ti-info-circle" aria-hidden="true" />
            <div>
              <strong>注意:</strong>{" "}
              2026年8月2日は「現行の拘束力ある期日」として扱うべきです。Omnibusによる延期は政治合意・議会承認を経ていますが、正式にEU官報で公布されるまでは、企業は元のスケジュール（2026年8月2日）に沿った準備を継続すべきとする法律専門家の見解が一般的です
              <sup>[63][66]</sup>。
            </div>
          </div>

          <h3>14.2 NIST AI RMFとGenerative AI Profile</h3>
          <p>
            NIST AI RMF（AI
            100-1）は2023年1月に公開された任意フレームワークで、Govern/Map/Measure/Manageの4機能から構成されます。2024年7月26日には生成AI特有のリスクに対応する「Generative
            AI Profile（NIST AI 600-1）」が追加公開され、以下12のリスク領域を定義しています
            <sup>[19][30][36]</sup>。
          </p>
          <ul className={styles.plain}>
            <li>CBRN情報（化学・生物・放射性・核兵器に関する有害情報へのアクセス）</li>
            <li>ハルシネーション（confabulation）</li>
            <li>ヘイトスピーチ・偏見的表現</li>
            <li>データプライバシー</li>
            <li>情報インテグリティ（誤情報）</li>
            <li>知的財産権侵害</li>
            <li>環境影響</li>
            <li>有害なバイアス</li>
            <li>危険・違法・倫理に反する行為の助長</li>
            <li>過度な依存（Overreliance）</li>
            <li>セキュリティ（従来型・新規のサイバー攻撃対象領域の拡大）</li>
            <li>CSAM/NCII生成リスク</li>
          </ul>
          <p>
            2026年2月には、NIST CAISI（Center for AI Standards and Innovation）が「AI Agent
            Standards
            Initiative」を発表し、ID・認可、セキュリティ・リスク管理、監視・ロギングをカバーするエージェント向けガイドラインを2026年第4四半期に予定しています
            <sup>[20][33]</sup>。
          </p>

          <h3>14.3 ISO/IEC 42001によるマネジメントシステム認証</h3>
          <p>
            ISO/IEC 42001:2023は、世界初の「認証可能な」AIマネジメントシステム規格です
            <sup>[103][108]</sup>。他のフレームワーク（NIST AI
            RMF等）が任意のガイダンスであるのに対し、ISO/IEC
            42001はPDCA（Plan-Do-Check-Act）サイクルに基づく認証プロセスを備えており、独立した認証機関による第三者監査を受けられます。
          </p>
          <ul className={styles.plain}>
            <li>
              Microsoftは自社AIシステムについて定期的な第三者監査を受け、Service Trust
              Portalで証明書・監査報告書を公開しています<sup>[102]</sup>
            </li>
            <li>
              SynthesiaはA-LIGNとのパートナーシップでISO/IEC 42001認証を取得し、EU AI
              Actへの準拠を先取りする形でコンプライアンス姿勢を示しました<sup>[111]</sup>
            </li>
            <li>
              実務上は「NIST AI RMFで内部のリスク管理プロセスを構築し、ISO/IEC
              42001で第三者認証による対外的な信頼性を担保する」という組み合わせが典型的です
            </li>
          </ul>

          <h3>14.4 ガバナンス構築の優先順位（実務ガイド）</h3>
          <ol className={styles.plain}>
            <li>
              <strong>AIシステムのインベントリ作成</strong>:
              組織内で使用されているすべてのAIシステム（サードパーティ・生成AIツールを含む）を棚卸しし、目的・データ・影響を受ける集団・市場を文書化する
              <sup>[63]</sup>
            </li>
            <li>
              <strong>リスク分類</strong>: 各システムをEU AI
              Actのリスク階層（禁止/高リスク/限定リスク/最小リスク）にマッピングする
            </li>
            <li>
              <strong>ガバナンス体制の確立</strong>:
              Map/Measure/Manageを反復可能にするため、まず「Govern」（方針・責任・監督ロール）を整備する。これを飛ばすと多くのAI
              RMFプログラムがパイロット後に停滞します<sup>[37]</sup>
            </li>
            <li>
              <strong>段階的な適用範囲拡大</strong>:
              最初は1つの中リスクシステムに絞って実践し、成功パターンを横展開する
            </li>
          </ol>
        </section>

        <section className={styles.step} id="sec-15">
          <p className={styles.stepLabel}>Step 15</p>
          <h2>実際のインシデント事例から学ぶ</h2>
          <p>
            理論だけでなく、2025年後半〜2026年前半に実際に発生した事例を把握しておくことは、レッドチームのシナリオ設計にも直結します。
          </p>

          <table>
            <thead>
              <tr>
                <th>時期</th>
                <th>事例</th>
                <th>概要</th>
                <th>教訓</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2026年2月</td>
                <td>AnythingLLMインシデント</td>
                <td>
                  未認証のエンドポイントがPineconeのAPIキーを露出させ、企業の埋め込みデータへの読み書き削除フルアクセスが可能になった
                  <sup>[94]</sup>
                </td>
                <td>
                  ベクトルDBへのアクセスも「通常のAPIエンドポイント」と同じ厳格さで認証・認可を設計する必要がある
                </td>
              </tr>
              <tr>
                <td>2026年1〜2月</td>
                <td>MCPエコシステムへの大量CVE報告</td>
                <td>
                  30件以上のCVEがMCPサーバー・クライアント・インフラに報告され、mcp-remoteプロキシのCVE-2025-6514はCVSS
                  9.6を記録<sup>[22]</sup>
                </td>
                <td>
                  急速に普及したプロトコルは、普及速度にセキュリティガバナンスが追いつかない典型例。サプライチェーン全体のスキャンが必須
                </td>
              </tr>
              <tr>
                <td>2026年第1四半期</td>
                <td>ClawHub（OpenClawスキルレジストリ）の組織的汚染</td>
                <td>
                  主要なAIエージェントスキルレジストリが体系的に汚染された最初の事例。ピーク時、最もダウンロードされたスキル上位7件中5件がマルウェアと確認された
                  <sup>[9]</sup>
                </td>
                <td>
                  自動スキャンとVirusTotal連携などの防御が事後的に導入されたが、エコシステム全体としては依然無防備な領域が広い
                </td>
              </tr>
              <tr>
                <td>継続的観測</td>
                <td>
                  Claude Codeのリポジトリ設定ファイル関連の脆弱性（CVE-2025-59536, CVE-2026-21852）
                </td>
                <td>
                  信頼できないプロジェクトをクローンして開くだけで、ユーザーの同意ダイアログが表示される前にリモートコード実行やAPIキー流出が発生しうることが実証された
                  <sup>[9]</sup>
                </td>
                <td>「開くだけ」の操作が実行層になり得るという前提でのサンドボックス設計が必要</td>
              </tr>
              <tr>
                <td>2026年1月</td>
                <td>Microsoft Copilot「Reprompt」（CVE-2026-24307）</td>
                <td>
                  単一クリックによるデータ流出（Single-Click Data Exfiltration）の脆弱性がVaronis
                  Threat Labsにより開示され、2026年1月のセキュリティ更新でパッチが適用された
                  <sup>[51]</sup>
                </td>
                <td>
                  エンタープライズAIアシスタントにおいても、間接プロンプトインジェクション経由の1クリック攻撃が現実的な脅威であることが示された
                </td>
              </tr>
              <tr>
                <td>2026年2月</td>
                <td>「AIメモリの営利目的汚染」に関するMicrosoft Security Blogの報告</td>
                <td>
                  AIの推薦・記憶機構を汚染し、利益を得ようとする手法の台頭が報告された
                  <sup>[51]</sup>
                </td>
                <td>長期記憶を持つエージェントは、メモリそのものが新たな攻撃対象領域になる</td>
              </tr>
              <tr>
                <td>継続的観測</td>
                <td>SesameOp AIエージェントバックドア（MITRE ATLAS AML.CS0042として記録）</td>
                <td>
                  AIエージェントにバックドアが仕込まれた実例としてMITRE
                  ATLASのケーススタディに追加された<sup>[23]</sup>
                </td>
                <td>エージェントの振る舞いの継続的な異常監視が、バックドアの早期発見に直結する</td>
              </tr>
            </tbody>
          </table>

          <div className={`${styles.callout} ${styles.info}`}>
            <i className="ti ti-info-circle" aria-hidden="true" />
            <div>
              これらの事例に共通するのは、「攻撃はモデルそのものの脆弱性というより、モデルを取り巻くエコシステム（サプライチェーン、認証・認可、ツール連携）の隙間を突いている」という点です。したがって、AIセキュリティは「モデルを守ること」だけでなく「AIを取り巻くシステム全体を守ること」として捉える必要があります
              <sup>[4]</sup>。
            </div>
          </div>
        </section>

        <section className={styles.step} id="sec-16">
          <p className={styles.stepLabel}>Step 16</p>
          <h2>AIセキュリティ成熟度モデルと実践チェックリスト</h2>

          <h3>16.1 成熟度モデル</h3>
          <p>組織のAIセキュリティ体制を4段階で自己評価するためのモデルです。</p>

          <div className={styles.ladder}>
            <div className={`${styles.ladderItem} ${styles.l1}`}>
              <div className={styles.level}>L1</div>
              <div className={styles.levelInfo}>
                <div className={styles.levelName}>Level 1: 場当たり的（Ad Hoc）</div>
                <div className={styles.levelDesc}>
                  AIシステムのインベントリが存在しない。プロンプトインジェクション対策やアクセス制御が個別チーム任せで一貫性がない。
                </div>
              </div>
            </div>
            <div className={`${styles.ladderItem} ${styles.l2}`}>
              <div className={styles.level}>L2</div>
              <div className={styles.levelInfo}>
                <div className={styles.levelName}>Level 2: 基礎的（Foundational）</div>
                <div className={styles.levelDesc}>
                  OWASP Top
                  10を参照した基本的な入出力検証がある。MCPサーバー等のツール連携には最小権限の意識はあるが、継続的な監視・レッドチームは未実施。
                </div>
              </div>
            </div>
            <div className={`${styles.ladderItem} ${styles.l3}`}>
              <div className={styles.level}>L3</div>
              <div className={styles.levelInfo}>
                <div className={styles.levelName}>Level 3: 体系的（Managed）</div>
                <div className={styles.levelDesc}>
                  NIST AI RMFまたはISO/IEC
                  42001に基づくガバナンス体制がある。AIBOM・モデル署名を導入し、定期的なレッドチーム演習とインシデント対応計画がある。
                </div>
              </div>
            </div>
            <div className={`${styles.ladderItem} ${styles.l4}`}>
              <div className={styles.level}>L4</div>
              <div className={styles.levelInfo}>
                <div className={styles.levelName}>Level 4: 最適化（Optimized）</div>
                <div className={styles.levelDesc}>
                  継続的な自動化レッドチーム、リリースゲートへの統合、エージェント間・MCPサーバー間の相互認証、法規制（EU
                  AI
                  Act等）への体系的対応、成熟したインシデント事後レビューのフィードバックループが機能している。
                </div>
              </div>
            </div>
          </div>

          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.maturityModel} />
            </div>
          </div>

          <h3>16.2 実践チェックリスト（本ガイド全体のまとめ）</h3>

          <h4>フレームワーク・ガバナンス</h4>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                OWASP Top 10 for LLM Applications / Agentic
                Applicationsを開発チームの共通言語として導入した
              </span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>NIST AI RMF（またはISO/IEC 42001）に基づくガバナンス体制を整備した</span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>MITRE ATLASを参照した脅威モデリングを実施した</span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                該当する法規制（EU AI
                Act等）の適用範囲とタイムラインを把握し、コンプライアンス計画を持っている
              </span>
            </li>
          </ul>

          <h4>入力・出力防御</h4>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                すべての外部コンテンツを信頼できない入力として扱い、構造的分離（spotlighting等）を導入した
              </span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                出力をJSON Schema等で検証し、高リスクアクションには人間の承認ゲートを設けた
              </span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>システムプロンプトに機密情報を含めない設計にした</span>
            </li>
          </ul>

          <h4>データ・モデル</h4>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>学習データパイプラインにアクセス制御・来歴検証・異常検知を導入した</span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                モデル抽出攻撃対策としてレート制限・出力ノイズ・クエリパターン分析を実施している
              </span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>AIBOM（CycloneDX形式等）とモデル署名（Sigstore/cosign等）を導入した</span>
            </li>
          </ul>

          <h4>RAG・エージェント・MCP</h4>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>ベクトルDBへのアクセスを認証・認可し、取り込み/検索ロールを分離した</span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                エージェントに専用の管理されたIDと最小権限スコープを与え、ユーザーセッションを借用させない設計にした
              </span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                MCPサーバーのツール定義を継続的に再検証し、Rug Pull攻撃を検知する仕組みを持っている
              </span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                Lethal
                Trifecta（機密データアクセス・信頼できないコンテンツ・外部通信）の3条件が同時に満たされるツール設計を避けている
              </span>
            </li>
          </ul>

          <h4>継続的な運用</h4>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>定期的な自動化レッドチーム演習をCI/CDのリリースゲートに統合している</span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>
                機能性・運用性・セキュリティ・コンプライアンス・人的要因の5次元での監視を実施している
              </span>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <span>インシデント対応計画とロールバック手順を文書化し、訓練済みである</span>
            </li>
          </ul>
        </section>

        <section className={styles.step} id="sec-17">
          <p className={styles.stepLabel}>Step 17</p>
          <h2>参考文献・引用URL一覧</h2>
          <p>
            本文中の <code>[番号]</code>{" "}
            は以下のリストに対応しています。番号は検索・収集時の通し番号をそのまま維持しているため欠番がありますが、そのぶん本文で直接引用していない関連情報源も同じ体系で参照できるようにしてあります。すべて2026年7月8日時点でアクセス可能な情報に基づきます。
          </p>

          <div className={styles.refBlock}>
            <div className={styles.refGroup}>
              <h4 className={styles.refTitle}>OWASP Top 10 for LLM Applications（1〜9）</h4>
              <ul>
                <li>
                  <span className={styles.tocIcon}>1.</span>{" "}
                  <Ext href="https://genai.owasp.org/llm-top-10/">
                    OWASP Gen AI Security Project - LLM Top 10
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>2.</span>{" "}
                  <Ext href="https://owasp.org/www-project-top-10-for-large-language-model-applications/">
                    OWASP Foundation - OWASP Top 10 for Large Language Model Applications
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>3.</span>{" "}
                  <Ext href="https://www.oligo.security/academy/owasp-top-10-llm-updated-2025-examples-and-mitigation-strategies">
                    Oligo Security - OWASP Top 10 LLM, Updated 2025: Examples & Mitigation
                    Strategies
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>4.</span>{" "}
                  <Ext href="https://genai.owasp.org/">OWASP Gen AI Security Project - Home</Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>5.</span>{" "}
                  <Ext href="https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/">
                    OWASP Top 10 for LLM Applications 2025
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>6.</span>{" "}
                  <Ext href="https://application.security/free/llm">
                    Security Compass / Kontra - OWASP Top 10 for LLM - 2025
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>7.</span>{" "}
                  <Ext href="https://www.cloudflare.com/learning/ai/owasp-top-10-risks-for-llms/">
                    Cloudflare - What are the OWASP Top 10 risks for LLMs?
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>8.</span>{" "}
                  <Ext href="https://www.trydeepteam.com/docs/frameworks-owasp-top-10-for-llms">
                    DeepTeam - OWASP Top 10 for LLMs 2025
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>9.</span>{" "}
                  <Ext href="https://infosecwriteups.com/owasp-top-10-for-llms-in-2025-security-test-cases-you-must-know-ef2cb6d1bbda">
                    InfoSec Write-ups - OWASP Top 10 for LLMs in 2025: Security Test Cases
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refGroup}>
              <h4 className={styles.refTitle}>
                OWASP Top 10 for Agentic Applications 2026（10〜19）
              </h4>
              <ul>
                <li>
                  <span className={styles.tocIcon}>10.</span>{" "}
                  <Ext href="https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/">
                    OWASP Gen AI Security Project - OWASP Top 10 for Agentic Applications for 2026
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>11.</span>{" "}
                  <Ext href="https://www.paloaltonetworks.com/blog/cloud-security/owasp-agentic-ai-security/">
                    Palo Alto Networks Blog - OWASP Top 10 for Agentic Applications 2026 Is Here
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>12.</span>{" "}
                  <Ext href="https://www.trydeepteam.com/docs/frameworks-owasp-top-10-for-agentic-applications">
                    DeepTeam - OWASP Top 10 for Agents 2026
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>13.</span>{" "}
                  <Ext href="https://auth0.com/blog/owasp-top-10-agentic-applications-lessons/">
                    Auth0 - Lessons from OWASP Top 10 for Agentic Applications
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>14.</span>{" "}
                  <Ext href="https://www.practical-devsecops.com/owasp-top-10-agentic-applications/">
                    Practical DevSecOps - OWASP Top 10 for Agentic Applications
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>15.</span>{" "}
                  <Ext href="https://www.microsoft.com/en-us/security/blog/2026/03/30/addressing-the-owasp-top-10-risks-in-agentic-ai-with-microsoft-copilot-studio/">
                    Microsoft Security Blog - Addressing the OWASP Top 10 Risks in Agentic AI with
                    Microsoft Copilot Studio
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>16.</span>{" "}
                  <Ext href="https://arnav.au/2026/07/02/owasp-top-10-for-agentic-applications/">
                    OWASP Top 10 for Agentic Applications – Where Cloud, Security and AI Converge
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>17.</span>{" "}
                  <Ext href="https://blog.nishanc.com/2026/02/owasp-top-10-for-agentic-applications.html">
                    blog.nishanc.com - OWASP Top 10 for Agentic Applications 2026: A Security Guide
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>18.</span>{" "}
                  <Ext href="https://owasp.org/www-project-agentic-skills-top-10/">
                    OWASP Foundation - OWASP Agentic Skills Top 10
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>19.</span>{" "}
                  <Ext href="https://www.gravitee.io/blog/owasp-top-10-for-agentic-applications-2026-a-practical-review-and-how-gravitee-supports-secure-agentic-architecture">
                    Gravitee - OWASP Top 10 for Agentic Applications 2026: A Practical Security
                    Guide
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refGroup}>
              <h4 className={styles.refTitle}>
                MCP（Model Context Protocol）セキュリティ（20〜29）
              </h4>
              <ul>
                <li>
                  <span className={styles.tocIcon}>20.</span>{" "}
                  <Ext href="https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices">
                    Model Context Protocol Quick Reference (Webfuse) - MCP Cheat Sheet (2026)
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>21.</span>{" "}
                  <Ext href="https://www.anthropic.com/news/model-context-protocol">
                    Anthropic - Introducing the Model Context Protocol
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>22.</span>{" "}
                  <Ext href="https://labs.cloudsecurityalliance.org/agentic/agentic-mcp-security-best-practices-v1/">
                    Cloud Security Alliance - Agentic MCP Security Best Practices Guide
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>23.</span>{" "}
                  <Ext href="https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices">
                    Model Context Protocol Documentation - Security Best Practices
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>24.</span>{" "}
                  <Ext href="https://www.aiforanything.io/blog/anthropic-mcp-model-context-protocol-explained-2026">
                    AI for Anything - Anthropic MCP Explained 2026
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>25.</span>{" "}
                  <Ext href="https://github.com/cosai-oasis/ws4-secure-design-agentic-systems/blob/main/model-context-protocol-security.md">
                    CoSAI ws4-secure-design-agentic-systems - Model Context Protocol Security
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>26.</span>{" "}
                  <Ext href="https://socprime.com/blog/mcp-security-risks-and-mitigations/">
                    SOC Prime - Model Context Protocol: Security Risks & Mitigations
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>27.</span>{" "}
                  <Ext href="https://www.linkedin.com/posts/satveerkhurpa_mcp-anthropic-security-activity-7342308920234823681-acD-">
                    LinkedIn Post - Anthropic updates MCP security best practices
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>28.</span>{" "}
                  <Ext href="https://anthropic.skilljar.com/introduction-to-model-context-protocol">
                    Anthropic Academy - Introduction to Model Context Protocol
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>29.</span>{" "}
                  <Ext href="https://arxiv.org/html/2601.17549v1">
                    arXiv - Breaking the Protocol: Security Analysis of the Model Context Protocol
                    Specification
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refGroup}>
              <h4 className={styles.refTitle}>NIST AI Risk Management Framework（30〜39）</h4>
              <ul>
                <li>
                  <span className={styles.tocIcon}>30.</span>{" "}
                  <Ext href="https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence-profile">
                    NIST - Artificial Intelligence Risk Management Framework: Generative Artificial
                    Intelligence Profile
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>31.</span>{" "}
                  <Ext href="https://www.nist.gov/itl/ai-risk-management-framework">
                    NIST - AI Risk Management Framework
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>32.</span>{" "}
                  <Ext href="https://www.nist.gov/news-events/news/2026/02/nist-launches-ai-agent-standards-initiative">
                    NIST News - NIST Launches AI Agent Standards Initiative
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>33.</span>{" "}
                  <Ext href="https://labs.cloudsecurityalliance.org/agentic/agentic-nist-ai-rmf-profile-v1/">
                    Cloud Security Alliance - NIST AI Risk Management Framework: Agentic Profile
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>34.</span>{" "}
                  <Ext href="https://www.modelop.com/ai-governance/ai-regulations-standards/nist-ai-rmf">
                    ModelOp - NIST AI RMF
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>35.</span>{" "}
                  <Ext href="https://digitalgovernmenthub.org/examples/nist-artificial-intelligence-risk-management-framework-generative-artificial-intelligence-profile/">
                    Digital Government Hub - NIST Artificial Intelligence Risk Management Framework:
                    Generative Artificial Intelligence Profile
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>36.</span>{" "}
                  <Ext href="https://casrai.org/news/nist-ai-rmf-generative-ai-profile-ai-600-1-explained/">
                    CASRAI - NIST AI RMF & the Generative AI Profile Explained (AI 600-1)
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>37.</span>{" "}
                  <Ext href="https://www.modulos.ai/nist-ai-rmf/">
                    Modulos AI - Implement NIST AI Risk Management Framework
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>38.</span>{" "}
                  <Ext href="https://www.ispartnersllc.com/blog/nist-ai-rmf-2025-2026-updates-what-you-need-to-know-about-the-latest-framework-changes/">
                    IS Partners - NIST AI RMF 2025–2026 Updates
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>39.</span>{" "}
                  <Ext href="https://www.nist.gov/programs-projects/concept-note-ai-rmf-profile-trustworthy-ai-critical-infrastructure">
                    NIST - Concept Note: AI RMF Profile on Trustworthy AI in Critical Infrastructure
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refGroup}>
              <h4 className={styles.refTitle}>MITRE ATLAS（40〜47）</h4>
              <ul>
                <li>
                  <span className={styles.tocIcon}>40.</span>{" "}
                  <Ext href="https://zenity.io/blog/current-events/mitre-atlas-ai-security">
                    Zenity - MITRE ATLAS AI Security and Agentic Threats 2026 Update
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>41.</span>{" "}
                  <Ext href="https://www.vectra.ai/topics/mitre-atlas">
                    Vectra AI - MITRE ATLAS: AI security framework with 16 tactics and 84 techniques
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>42.</span>{" "}
                  <Ext href="https://arxiv.org/pdf/2603.09002">
                    arXiv - Security Considerations for Multi-agent Systems
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>43.</span>{" "}
                  <Ext href="https://www.practical-devsecops.com/mitre-atlas-framework-guide-securing-ai-systems/">
                    Practical DevSecOps - MITRE ATLAS Framework 2026 - Guide to Securing AI Systems
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>44.</span>{" "}
                  <Ext href="https://www.crowdstrike.com/en-us/cybersecurity-101/artificial-intelligence/mitre-atlas/">
                    CrowdStrike - What is MITRE ATLAS?
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>45.</span>{" "}
                  <Ext href="https://repello.ai/blog/mitre-atlas-framework">
                    Repello AI - MITRE ATLAS Framework: AI Attack Techniques (AML.T) Mapped to
                    Red-Team Operations
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>46.</span>{" "}
                  <Ext href="https://www.paloaltonetworks.com/cyberpedia/mitre-sensible-regulatory-framework-atlas-matrix">
                    Palo Alto Networks - MITRE's Sensible Regulatory Framework for AI Security
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>47.</span>{" "}
                  <Ext href="https://arxiv.org/pdf/2605.00927">arXiv - BioVeil MATRIX</Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refGroup}>
              <h4 className={styles.refTitle}>プロンプトインジェクション対策（48〜57）</h4>
              <ul>
                <li>
                  <span className={styles.tocIcon}>48.</span>{" "}
                  <Ext href="https://zylos.ai/research/2026-04-12-indirect-prompt-injection-defenses-agents-untrusted-content/">
                    Zylos Research - Indirect Prompt Injection: Attacks, Defenses, and the 2026
                    State of the Art
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>49.</span>{" "}
                  <Ext href="https://www.semanticscholar.org/paper/StruQ:-Defending-Against-Prompt-Injection-with-Chen-Piet/f5e7e22036c3fe7d6660eee90642f716c3b303f5">
                    Semantic Scholar - StruQ: Defending Against Prompt Injection with Structured
                    Queries
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>50.</span>{" "}
                  <Ext href="https://tokenmix.ai/blog/prompt-injection-defense-techniques-2026">
                    TokenMix Blog - Prompt Injection Defense 2026: 8 Tested Techniques Ranked
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>51.</span>{" "}
                  <Ext href="https://blog.cyberdesserts.com/prompt-injection-attacks/">
                    Cyber Desserts - Prompt Injection Attacks: Examples, Techniques, and Defence
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>52.</span>{" "}
                  <Ext href="https://arxiv.org/pdf/2601.10294">
                    arXiv - Reasoning Hijacking: The Fragility of Reasoning Alignment in LLMs
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>53.</span>{" "}
                  <Ext href="https://ceur-ws.org/Vol-3920/paper03.pdf">
                    CEUR Workshop Proceedings - Defending Against Indirect Prompt Injection Attacks
                    With Spotlighting
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>54.</span>{" "}
                  <Ext href="https://github.com/tldrsec/prompt-injection-defenses">
                    GitHub - tldrsec/prompt-injection-defenses
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>55.</span>{" "}
                  <Ext href="https://arxiv.org/html/2601.17548v1">
                    arXiv - Prompt Injection Attacks on Agentic Coding Assistants
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>56.</span>{" "}
                  <Ext href="https://arxiv.org/pdf/2512.00136">
                    arXiv - An Empirical Study on the Security Vulnerabilities of GPTs
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>57.</span>{" "}
                  <Ext href="https://arxiv.org/pdf/2509.00088">
                    arXiv - AEGIS: Automated Co-Evolutionary Framework for Guarding Prompt
                    Injections Schema
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refGroup}>
              <h4 className={styles.refTitle}>EU AI Act（58〜67）</h4>
              <ul>
                <li>
                  <span className={styles.tocIcon}>58.</span>{" "}
                  <Ext href="https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai">
                    European Commission - AI Act | Shaping Europe's digital future
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>59.</span>{" "}
                  <Ext href="https://ai-act-service-desk.ec.europa.eu/en/ai-act/timeline/timeline-implementation-eu-ai-act">
                    AI Act Service Desk - Timeline for the Implementation of the EU AI Act
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>60.</span>{" "}
                  <Ext href="https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/">
                    Gibson Dunn - EU AI Act Omnibus Agreement — Postponed High-Risk Deadlines and
                    Other Key Changes
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>61.</span>{" "}
                  <Ext href="https://www.lw.com/en/insights/ai-act-update-eu-resolves-to-change-rules-and-extend-deadlines">
                    Latham & Watkins - AI Act Update: EU Resolves to Change Rules and Extend
                    Deadlines
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>62.</span>{" "}
                  <Ext href="https://artificialintelligenceact.eu/implementation-timeline/">
                    EU Artificial Intelligence Act - Implementation Timeline
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>63.</span>{" "}
                  <Ext href="https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-high-risk-compliance-deadline-20/">
                    Cloud Security Alliance - EU AI Act High-Risk Deadline: Enterprise Readiness Gap
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>64.</span>{" "}
                  <Ext href="https://www.traverssmith.com/knowledge/knowledge-container/eu-agrees-to-delay-key-ai-act-compliance-deadlines/">
                    Travers Smith - EU agrees to delay key AI Act compliance deadlines
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>65.</span>{" "}
                  <Ext href="https://decodethefuture.org/en/eu-ai-act-explained/">
                    decodethefuture.org - EU AI Act 2026: Penalties, Risk Tiers & New Deadlines
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>66.</span>{" "}
                  <Ext href="https://knowledge.dlapiper.com/dlapiperknowledge/globalemploymentlatestdevelopments/2026/The-Digital-AI-Omnibus-Proposed-deferral-of-high-risk-AI-obligations-under-the-AI-Act">
                    DLA Piper GENIE - The Digital AI Omnibus: Proposed deferral of high risk AI
                    obligations under the AI Act
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>67.</span>{" "}
                  <Ext href="https://www.legalnodes.com/article/eu-ai-act-2026-updates-compliance-requirements-and-business-risks">
                    Legal Nodes - EU AI Act 2026 Updates: Compliance Requirements and Business Risks
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refGroup}>
              <h4 className={styles.refTitle}>AIレッドチーミング（68〜75）</h4>
              <ul>
                <li>
                  <span className={styles.tocIcon}>68.</span>{" "}
                  <Ext href="https://generalanalysis.com/guides/best-ai-red-teaming-tools">
                    General Analysis - Best AI Red Teaming Tools in 2026: Adversarial Testing
                    Comparison
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>69.</span>{" "}
                  <Ext href="https://www.confident-ai.com/knowledge-base/compare/best-ai-red-teaming-tools-2026">
                    Confident AI - 5 Best AI Red Teaming Tools to Find AI Security Vulnerabilities
                    in 2026
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>70.</span>{" "}
                  <Ext href="https://www.marktechpost.com/2026/04/17/top-ai-red-teaming-tools/">
                    MarkTechPost - Top 19 AI Red Teaming Tools (2026): Secure Your ML Models
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>71.</span>{" "}
                  <Ext href="https://repello.ai/blog/the-essential-guide-to-ai-red-teaming-in-2024">
                    Repello AI - AI Red Teaming: The Complete Guide for Security Teams (2026)
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>72.</span>{" "}
                  <Ext href="https://mindgard.ai/blog/what-is-ai-red-teaming">
                    Mindgard - AI Red Teaming in 2026: The Complete Guide
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>73.</span>{" "}
                  <Ext href="https://github.com/requie/AI-Red-Teaming-Guide">
                    GitHub - requie/AI-Red-Teaming-Guide
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>74.</span>{" "}
                  <Ext href="https://genai.owasp.org/resource/ai-security-solutions-landscape-for-ai-and-agentic-red-teaming-q2-2026/">
                    OWASP - AI Security Solutions Landscape For AI and Agentic Red Teaming Q2 2026
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>75.</span>{" "}
                  <Ext href="https://www.straiker.ai/blog/top-6-ai-red-teaming-and-adversarial-testing-tools">
                    Straiker - Top 6 AI Red Teaming and Adversarial Testing Tools for 2026
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refGroup}>
              <h4 className={styles.refTitle}>データ/モデルポイズニング・モデル抽出（76〜83）</h4>
              <ul>
                <li>
                  <span className={styles.tocIcon}>76.</span>{" "}
                  <Ext href="https://aisecurityandsafety.org/en/guides/data-poisoning/">
                    AI Safety Directory - Data Poisoning in AI: The Complete Guide to Training Data
                    Attacks & Defenses (2026)
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>77.</span>{" "}
                  <Ext href="https://blog.lastpass.com/posts/model-poisoning">
                    LastPass Blog - AI Model Poisoning in 2026: How It Works and the First Line
                    Defense Your Business Needs
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>78.</span>{" "}
                  <Ext href="https://arxiv.org/pdf/2312.10578">
                    arXiv - SAME: Sample Reconstruction against Model Extraction Attacks
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>79.</span>{" "}
                  <Ext href="https://medium.com/@nayangoel/securing-ai-from-model-poisoning-to-production-defense-6bc4553ac7e0">
                    Medium - Securing AI: From Model Poisoning to Production Defense
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>80.</span>{" "}
                  <Ext href="https://arxiv.org/pdf/2508.21654">
                    arXiv - I Stolenly Swear That I Am Up to (No) Good: Design and Evaluation of
                    Model Stealing Attacks
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>81.</span>{" "}
                  <Ext href="https://arxiv.org/pdf/2303.03592">
                    arXiv - Exploring the Limits of Model-Targeted Indiscriminate Data Poisoning
                    Attacks
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>82.</span>{" "}
                  <Ext href="https://link.springer.com/article/10.1007/s13042-026-03181-7">
                    Springer - The poisoning attack and defense method for data-driven algorithm in
                    power system
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>83.</span>{" "}
                  <Ext href="https://arxiv.org/pdf/2105.03592">
                    arXiv - De-Pois: An Attack-Agnostic Defense against Data Poisoning Attacks
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refGroup}>
              <h4 className={styles.refTitle}>AIサプライチェーン・AIBOM・モデル署名（84〜93）</h4>
              <ul>
                <li>
                  <span className={styles.tocIcon}>84.</span>{" "}
                  <Ext href="https://www.glacis.io/guide-ai-supply-chain-security">
                    GLACIS - AI Supply Chain Security Guide 2026
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>85.</span>{" "}
                  <Ext href="https://creativeminds.dev/blog/top-ai-security-tools-2026-vendor-neutral/">
                    cmdev Blog - Top AI Security Tools 2026: The Vendor-Neutral Comparison
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>86.</span>{" "}
                  <Ext href="https://cloudsmith.com/blog/the-2026-guide-to-software-supply-chain-security-from-static-sboms-to-agentic-governance">
                    Cloudsmith - The 2026 Guide to Software Supply Chain Security
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>87.</span>{" "}
                  <Ext href="https://checkmarx.com/learn/ai-cybersecurity/what-is-an-aibom/">
                    Checkmarx - What is an AIBOM?
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>88.</span>{" "}
                  <Ext href="https://apiiro.com/glossary/aibom/">
                    Apiiro - What Is An AIBOM? How To Generate Accuracy & Challenges
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>89.</span>{" "}
                  <Ext href="https://arxiv.org/pdf/2606.21877">
                    arXiv - AgentRiskBOM: A Risk-Scoping Security Bill of Materials for Agentic AI
                    Systems
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>90.</span>{" "}
                  <Ext href="https://qyntar.com/ai-security/threats/ai-supply-chain-attacks/">
                    Qyntar - Supply Chain Attacks in AI
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>91.</span>{" "}
                  <Ext href="https://arxiv.org/pdf/2606.21787">
                    arXiv - Towards Imputation of Pre-Trained Language Model Metadata using Semantic
                    Fingerprinting
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>92.</span>{" "}
                  <Ext href="https://arxiv.org/pdf/2505.10538">
                    arXiv - S3C2 Summit 2024-09: Industry Secure Software Supply Chain Summit
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>93.</span>{" "}
                  <Ext href="https://www.manifestcyber.com/aibom">
                    Manifest Cyber - AI Bill of Materials (AIBOM): Transparency for AI Supply Chains
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refGroup}>
              <h4 className={styles.refTitle}>RAG・ベクトルDBセキュリティ（94〜101）</h4>
              <ul>
                <li>
                  <span className={styles.tocIcon}>94.</span>{" "}
                  <Ext href="https://beyondscale.tech/blog/vector-database-security-rag-compliance-monitoring">
                    BeyondScale - Vector Database Security: RAG Compliance & Monitoring Guide
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>95.</span>{" "}
                  <Ext href="https://www.blockchain-council.org/ai/securing-and-governing-vector-databases-privacy-prompt-injection-multi-tenant-access-control/">
                    Blockchain Council - Securing and Governing Vector Databases in 2026
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>96.</span>{" "}
                  <Ext href="https://codesecai.com/rag-poisoning-prevention-guide/">
                    CodeSecAI - RAG Poisoning: 7 Critical Defenses to Stop Secret Leaks in AI
                    Systems (2026 Guide)
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>97.</span>{" "}
                  <Ext href="https://themenonlab.blog/blog/poisonedrag-rag-knowledge-corruption-attack">
                    themenonlab - PoisonedRAG: 5 Documents Can Hijack Your RAG System 97% of the
                    Time
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>98.</span>{" "}
                  <Ext href="https://beyondscale.tech/blog/rag-security-data-poisoning-guide">
                    BeyondScale - RAG Security: How Attackers Poison Your Knowledge Base
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>99.</span>{" "}
                  <Ext href="https://advent-of-ai-security.com/doors/08">
                    Advent of AI Security - Door 08 - Vector and Embedding Weaknesses
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>100.</span>{" "}
                  <Ext href="https://www.lasso.security/blog/rag-security">
                    Lasso Security - RAG Security: Risks and Mitigation Strategies [2026]
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>101.</span>{" "}
                  <Ext href="https://christian-schneider.net/blog/rag-security-forgotten-attack-surface/">
                    Christian Schneider - RAG security: the forgotten attack surface
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refGroup}>
              <h4 className={styles.refTitle}>ISO/IEC 42001（102〜111）</h4>
              <ul>
                <li>
                  <span className={styles.tocIcon}>102.</span>{" "}
                  <Ext href="https://learn.microsoft.com/en-us/compliance/regulatory/offering-iso-42001">
                    Microsoft Learn - ISO/IEC 42001:2023 Artificial Intelligence Management System
                    Standards
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>103.</span>{" "}
                  <Ext href="https://www.iso.org/standard/42001">
                    ISO - ISO/IEC 42001:2023 - AI management systems
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>104.</span>{" "}
                  <Ext href="https://pecb.com/en/education-and-certification-for-individuals/iso-iec-42001">
                    PECB - ISO/IEC 42001 Artificial Intelligence Management System — Training
                    Courses
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>105.</span>{" "}
                  <Ext href="https://www.bsigroup.com/en-US/products-and-services/standards/iso-42001-ai-management-system/">
                    BSI - ISO 42001 - AI Management System
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>106.</span>{" "}
                  <Ext href="https://lorikeetsecurity.com/blog/iso-42001-ai-management-system-2026">
                    Lorikeet Security - ISO/IEC 42001 Deep Dive: The AI Management System Standard,
                    Decoded (2026)
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>107.</span>{" "}
                  <Ext href="https://www.dnv.com/services/iso-iec-42001-artificial-intelligence-ai--250876/">
                    DNV - ISO/IEC 42001 Certification: AI Management System
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>108.</span>{" "}
                  <Ext href="https://www.iso.org/home/insights-news/resources/iso-42001-explained-what-it-is.html">
                    ISO - ISO 42001 explained — what it is
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>109.</span>{" "}
                  <Ext href="https://kpmg.com/ch/en/insights/artificial-intelligence/iso-iec-42001.html">
                    KPMG - ISO/IEC 42001: AI Management System for Governance
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>110.</span>{" "}
                  <Ext href="https://standards.iteh.ai/catalog/standards/cen/adc675e8-4669-4965-b4c1-c8f724832217/en-iso-iec-42001-2026">
                    iTeh Standards - EN ISO/IEC 42001:2026 - AI Management System Standards Guide
                  </Ext>
                </li>
                <li>
                  <span className={styles.tocIcon}>111.</span>{" "}
                  <Ext href="https://www.a-lign.com/articles/understanding-iso-42001">
                    A-LIGN - Understanding ISO 42001: The World's First AI Management System
                    Standard
                  </Ext>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.disclaimer}>
            <p className={styles.disclaimerText}>
              <strong>免責事項:</strong>{" "}
              本ガイドは2026年7月8日時点で公開されていた情報をもとに作成しています。AIセキュリティの分野は極めて変化が速いため、実装前に各フレームワーク・法規制の公式サイト（特に
              OWASP: genai.owasp.org、NIST: nist.gov、ISO: iso.org、EU AI Act公式ポータル、MITRE
              ATLAS:
              atlas.mitre.org）で最新情報を確認することを強く推奨します。本ガイドは一般的なベストプラクティスの解説であり、個別組織の法令遵守を保証するものではありません。法的な適用可否については専門家にご相談ください。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
