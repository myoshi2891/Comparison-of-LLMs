import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "AIセキュリティ ベストプラクティスガイド | LLM-Studies",
  description:
    "初学者のためのステップバイステップ解説。OWASP・MITRE ATLAS・NIST・Google SAIF・EU AI Actなど業界標準フレームワークに基づき、LLMアプリケーションとAIエージェントのセキュリティを体系的に解説します。",
};

const DIAGRAMS = {
  dOverview: `flowchart TD
A["AIセキュリティの全体像"] --> B["脅威モデリング層<br/>攻撃者はどう動くか"]
A --> C["アプリケーションリスク層<br/>何が弱点になりやすいか"]
A --> D["ガバナンス・法規制層<br/>組織としてどう管理するか"]
B --> B1["MITRE ATLAS<br/>AI/ML特化の攻撃者戦術・技術カタログ"]
C --> C1["OWASP Top 10 for LLM Applications 2025<br/>単体LLMアプリの10大リスク"]
C --> C2["OWASP Top 10 for Agentic Applications 2026<br/>自律型エージェントの10大リスク"]
D --> D1["NIST AI RMF / AI 600-1<br/>リスクマネジメントの実務指針"]
D --> D2["Google SAIF<br/>セキュアな開発ライフサイクル"]
D --> D3["EU AI Act / ISO・IEC 42001<br/>法規制・認証制度"]`,

  dLlmFlow: `flowchart LR
IN["入力<br/>ユーザー・外部データ"] --> LLM["LLM本体"]
LLM --> OUT["出力・アクション"]
RAG["RAG / ベクトルDB"] --> LLM
SUP["サプライチェーン<br/>学習データ・ライブラリ・プラグイン"] --> LLM
LLM --> TOOL["ツール・API呼び出し"]`,

  dAgenticOverview: `flowchart TD
U["ユーザー"] --> A["AIエージェント"]
A --> P["計画・推論"]
P --> T["ツール呼び出し"]
P --> M["長期記憶 / コンテキスト"]
A --> EA["外部エージェント<br/>Agent-to-Agent通信"]
T --> EXT["外部API・システム"]
A -.悪用経路.-> ASI["ASI01-10のリスク"]`,

  dDefenseLayers: `flowchart TD
L0["外部入力<br/>ユーザー入力 / 文書 / ツール結果 / RAG検索結果"] --> L1
L1["レイヤー1: 入力の来歴タグ付け<br/>Spotlighting"] --> L2
L2["レイヤー2: 権限分離アーキテクチャ<br/>Dual LLM / CaMeL"] --> L3
L3["レイヤー3: 最小権限のツールアクセス制御"] --> L4
L4["レイヤー4: 出力検証・エンコーディング"] --> L5
L5["レイヤー5: 人間による承認<br/>Human-in-the-loop"] --> L6
L6["レイヤー6: 監査ログ・異常検知・レート制限"]`,

  dSaif: `flowchart TD
E1["1. 既存のセキュリティ基盤をAIエコシステムへ拡張する"] --> E2
E2["2. 検知と対応の範囲をAIにも広げる"] --> E3
E3["3. 防御の自動化"] --> E4
E4["4. プラットフォーム統制の一貫性を確保する"] --> E5
E5["5. コンテキストに応じて制御を適応させる"] --> E6
E6["6. 事業プロセス全体の中でAIリスクを捉える"]
E6 -.継続的改善サイクル.-> E1`,

  dNist: `flowchart TD
G["Govern 統治<br/>組織文化・ポリシー・アカウンタビリティの確立"] --> M1
M1["Map 特定<br/>利用文脈とリスクの洗い出し"] --> M2
M2["Measure 測定<br/>リスクの分析・評価・追跡"] --> M3
M3["Manage 対応<br/>リスクへの対応・優先順位付け・低減"]
M3 -.フィードバック.-> M1`,

  dRedteam: `flowchart LR
D1["設計・脅威モデリング<br/>MITRE ATLAS / OWASP"] --> B1["構築・実装<br/>多層防御・最小権限"]
B1 --> T1["レッドチーミング<br/>既知の攻撃シナリオで検証"]
T1 --> M1["本番監視<br/>異常検知・監査ログ・レート制限"]
M1 --> I1["インシデント対応<br/>検知・封じ込め・是正"]
I1 -.学びをフィードバック.-> D1`,
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function AISecurityBestPracticesPage() {
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
              <a href="#intro" className={styles.tocLink}>
                <i className="ti ti-bulb" aria-hidden="true" />
                ステップ0: なぜ別物か
              </a>
            </li>
            <li>
              <a href="#overview" className={styles.tocLink}>
                <i className="ti ti-map" aria-hidden="true" />
                ステップ1: 全体像
              </a>
            </li>
            <li>
              <a href="#atlas" className={styles.tocLink}>
                <i className="ti ti-target" aria-hidden="true" />
                ステップ2: MITRE ATLAS
              </a>
            </li>
            <li>
              <a href="#owasp-llm" className={styles.tocLink}>
                <i className="ti ti-list-numbers" aria-hidden="true" />
                ステップ3: OWASP LLM Top10
              </a>
            </li>
            <li>
              <a href="#owasp-agentic" className={styles.tocLink}>
                <i className="ti ti-robot" aria-hidden="true" />
                ステップ4: OWASP Agentic Top10
              </a>
            </li>
            <li>
              <a href="#prompt-injection" className={styles.tocLink}>
                <i className="ti ti-shield-bolt" aria-hidden="true" />
                ステップ5: プロンプトインジェクション
              </a>
            </li>
            <li>
              <a href="#saif" className={styles.tocLink}>
                <i className="ti ti-recycle" aria-hidden="true" />
                ステップ6: Google SAIF
              </a>
            </li>
            <li>
              <a href="#nist" className={styles.tocLink}>
                <i className="ti ti-building-bank" aria-hidden="true" />
                ステップ7: NIST AI RMF
              </a>
            </li>
            <li>
              <a href="#regulation" className={styles.tocLink}>
                <i className="ti ti-scale" aria-hidden="true" />
                ステップ8: 法規制・認証
              </a>
            </li>
            <li>
              <a href="#redteam" className={styles.tocLink}>
                <i className="ti ti-crosshair" aria-hidden="true" />
                ステップ9: レッドチーミング
              </a>
            </li>
            <li>
              <a href="#checklist" className={styles.tocLink}>
                <i className="ti ti-checklist" aria-hidden="true" />
                ステップ10: チェックリスト
              </a>
            </li>
            <li>
              <a href="#summary" className={styles.tocLink}>
                <i className="ti ti-flag" aria-hidden="true" />
                まとめ
              </a>
            </li>
            <li>
              <a href="#references" className={styles.tocLink}>
                <i className="ti ti-link" aria-hidden="true" />
                参考URL一覧
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={styles.content}>
        <header className={styles.hero}>
          <div className={styles.eyebrow}>
            <i className="ti ti-shield-lock" aria-hidden="true" />
            AI SECURITY BEST PRACTICES
          </div>
          <h1 className={styles.pageTitle}>AIセキュリティ ベストプラクティスガイド</h1>
          <p className={styles.subtitle}>
            初学者のためのステップバイステップ解説。OWASP・MITRE ATLAS・NIST・Google SAIF・EU AI
            Actなど業界標準フレームワークに基づき、LLMアプリケーションとAIエージェントのセキュリティを体系的に解説します。
          </p>
        </header>

        <section className={styles.step} id="intro">
          <p className={styles.stepLabel}>Step 0</p>
          <h2>
            <i className="ti ti-bulb" aria-hidden="true" />
            なぜAIセキュリティは「別物」なのか
          </h2>
          <p>
            従来のWebアプリケーションセキュリティは、SQLインジェクションやXSSのように、コードと入力データが明確に分離されていることを前提にしていました。ところがLLM(大規模言語モデル)は、
            <strong>指示(instruction)とデータ(data)を同じ自然言語のチャネルで処理する</strong>
            という根本的な特性を持っています。この結果、次のような新しい攻撃対象領域(attack
            surface)が生まれます。
          </p>

          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>従来のAppSec</th>
                <th style={{ textAlign: "left" }}>AIセキュリティ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>コードとデータが分離されている</td>
                <td>指示とデータが同じ入力チャネルに混在する</td>
              </tr>
              <tr>
                <td>静的なロジックを検証すればよい</td>
                <td>確率的(stochastic)にふるまうモデルを検証する必要がある</td>
              </tr>
              <tr>
                <td>攻撃対象はネットワーク・OS・DB</td>
                <td>
                  攻撃対象は学習データ・モデル本体・推論プロセス・エージェントのツール群にも広がる
                </td>
              </tr>
              <tr>
                <td>一度パッチを当てれば直る</td>
                <td>プロンプトインジェクションのように「完全な解決策が存在しない」リスクがある</td>
              </tr>
            </tbody>
          </table>

          <p>
            さらに2026年時点では、LLMが単に文章を生成するだけでなく、ツールを呼び出し、他のエージェントと通信し、実際の業務システムを操作する「エージェント型AI(Agentic
            AI)」が急速に普及しており、セキュリティの検討範囲はさらに拡大しています。
          </p>
        </section>

        <section className={styles.step} id="overview">
          <p className={styles.stepLabel}>Step 1</p>
          <h2>
            <i className="ti ti-map" aria-hidden="true" />
            全体像 ― どのフレームワークをいつ使うか
          </h2>
          <p>
            AIセキュリティには複数の標準フレームワークが存在し、それぞれ役割が異なります。まずは全体のマップを把握しましょう。
          </p>

          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.dOverview} />
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>フレームワーク</th>
                <th style={{ textAlign: "left" }}>主な用途</th>
                <th style={{ textAlign: "left" }}>対象読者</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>MITRE ATLAS</td>
                <td>攻撃者視点での脅威モデリング、レッドチーム演習の設計</td>
                <td>セキュリティエンジニア、脅威インテリジェンス担当</td>
              </tr>
              <tr>
                <td>OWASP Top 10 for LLM Applications (2025)</td>
                <td>LLMアプリの代表的な脆弱性チェックリスト</td>
                <td>開発者、アプリケーションセキュリティ担当</td>
              </tr>
              <tr>
                <td>OWASP Top 10 for Agentic Applications (2026)</td>
                <td>自律型AIエージェントに特化したリスクチェックリスト</td>
                <td>エージェント開発者、アーキテクト</td>
              </tr>
              <tr>
                <td>NIST AI RMF / AI 600-1</td>
                <td>組織全体のAIリスクガバナンス体制の構築</td>
                <td>コンプライアンス、リスク管理部門</td>
              </tr>
              <tr>
                <td>Google SAIF</td>
                <td>AI開発ライフサイクル全体のセキュリティ統制</td>
                <td>プラットフォームエンジニア、クラウドアーキテクト</td>
              </tr>
              <tr>
                <td>EU AI Act / ISO・IEC 42001</td>
                <td>法的義務・認証取得の要件整理</td>
                <td>法務、経営層、AIガバナンス責任者</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.refBlock}>
            <p className={styles.refTitle}>
              <i className="ti ti-link" aria-hidden="true" />
              参考URL
            </p>
            <ul>
              <li>
                OWASP GenAI Security Project:{" "}
                <Ext href="https://genai.owasp.org/">https://genai.owasp.org/</Ext>
              </li>
              <li>
                MITRE ATLAS 公式サイト:{" "}
                <Ext href="https://atlas.mitre.org/">https://atlas.mitre.org/</Ext>
              </li>
              <li>
                NIST AI Risk Management Framework:{" "}
                <Ext href="https://www.nist.gov/itl/ai-risk-management-framework">
                  https://www.nist.gov/itl/ai-risk-management-framework
                </Ext>
              </li>
              <li>
                Google Secure AI Framework (SAIF):{" "}
                <Ext href="https://saif.google/">https://saif.google/</Ext>
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.step} id="atlas">
          <p className={styles.stepLabel}>Step 2</p>
          <h2>
            <i className="ti ti-target" aria-hidden="true" />
            脅威モデリングの基礎 ― MITRE ATLASを理解する
          </h2>
          <p>
            <strong>
              MITRE ATLAS(Adversarial Threat Landscape for Artificial-Intelligence Systems)
            </strong>
            は、2021年にMITREが公開した、AI/MLシステムを狙う攻撃者の戦術(Tactics)と技術(Techniques)を体系化したナレッジベースです。サイバーセキュリティで広く使われるMITRE
            ATT&CKと同じ「マトリクス形式」を採用しており、攻撃者の目的(列)と具体的な手口(行)をフカンできます。
          </p>

          <p>
            2025年11月時点でATLASは16の戦術・84の技術・56のサブ技術・32の緩和策・42件の実際のケーススタディを収録するまでに拡大しており、2026年2月の更新ではさらにエージェント特有の技術(悪意あるAIエージェントツールの公開など)が追加されました。ATLASは月次リリースサイクルに移行しており、AI攻撃の実態を継続的に反映しています。
          </p>

          <h3>ATLASの基本戦術(ATT&CKから継承・拡張された代表的な13の戦術)</h3>
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>フェーズ</th>
                <th style={{ textAlign: "left" }}>戦術</th>
                <th style={{ textAlign: "left" }}>内容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>準備</td>
                <td>Reconnaissance(偵察)</td>
                <td>対象モデルのAPI仕様・論文・公開ドキュメントなどから情報収集</td>
              </tr>
              <tr>
                <td>準備</td>
                <td>Resource Development(リソース開発)</td>
                <td>攻撃用インフラや悪意あるモデル・データセットの準備</td>
              </tr>
              <tr>
                <td>侵入</td>
                <td>Initial Access(初期アクセス)</td>
                <td>学習パイプラインやAPIへの最初の足がかりを得る</td>
              </tr>
              <tr>
                <td>AI固有</td>
                <td>ML Model Access(MLモデルアクセス)</td>
                <td>推論APIや直接のモデルアーティファクトへのアクセスを獲得</td>
              </tr>
              <tr>
                <td>実行</td>
                <td>Execution(実行)</td>
                <td>モデルや関連システム上で悪意あるコードを実行</td>
              </tr>
              <tr>
                <td>定着</td>
                <td>Persistence(永続化)</td>
                <td>バックドアモデルなどでアクセスを維持</td>
              </tr>
              <tr>
                <td>権限昇格</td>
                <td>Privilege Escalation(権限昇格)</td>
                <td>より高い権限を奪取</td>
              </tr>
              <tr>
                <td>回避</td>
                <td>Defense Evasion(防御回避)</td>
                <td>検知機構をすり抜ける</td>
              </tr>
              <tr>
                <td>探索</td>
                <td>Discovery(探索)</td>
                <td>内部構成やデータソースを調査</td>
              </tr>
              <tr>
                <td>収集</td>
                <td>Collection(収集)</td>
                <td>攻撃対象となるデータを集める</td>
              </tr>
              <tr>
                <td>AI固有</td>
                <td>ML Attack Staging(ML攻撃準備)</td>
                <td>学習データの汚染やバックドア埋め込みなど攻撃の下準備</td>
              </tr>
              <tr>
                <td>窃取</td>
                <td>Exfiltration(持ち出し)</td>
                <td>モデルやデータを外部へ持ち出す</td>
              </tr>
              <tr>
                <td>目的達成</td>
                <td>Impact(影響)</td>
                <td>サービス停止・誤動作・信頼失墜などの最終的な被害</td>
              </tr>
            </tbody>
          </table>

          <p>
            代表的なAI特有の攻撃技術には、
            <strong>Adversarial Examples(敵対的サンプル)</strong>・
            <strong>Model Inversion(モデル逆転攻撃)</strong>・
            <strong>Data Poisoning(データ汚染)</strong>・<strong>Model Stealing(モデル窃取)</strong>
            ・<strong>Prompt Injection(プロンプトインジェクション)</strong>
            などがあり、いずれも従来のATT&CKには存在しない、AI/ML特有の攻撃対象領域を扱います。
          </p>

          <h3>実践のはじめ方</h3>
          <ol className={styles.plain}>
            <li>ATLAS Navigator(atlas.mitre.org)で自社システムに関連する戦術・技術を洗い出す</li>
            <li>
              各技術について「検知できているか」「緩和策があるか」をスコアリングし、独自のカバレッジレイヤーを作成する
            </li>
            <li>
              実際のケーススタディ(EchoLeak、iProovのディープフェイク事例など)を参考に、攻撃の連鎖(kill
              chain)をイメージした演習を設計する
            </li>
          </ol>

          <div className={styles.refBlock}>
            <p className={styles.refTitle}>
              <i className="ti ti-link" aria-hidden="true" />
              参考URL
            </p>
            <ul>
              <li>
                MITRE ATLAS 公式サイト:{" "}
                <Ext href="https://atlas.mitre.org/">https://atlas.mitre.org/</Ext>
              </li>
              <li>
                MITRE ATLASの成長に関するCTIDブログ(2026年5月):{" "}
                <Ext href="https://ctid.mitre.org/blog/2026/05/06/secure-ai-v2-release/">
                  https://ctid.mitre.org/blog/2026/05/06/secure-ai-v2-release/
                </Ext>
              </li>
              <li>
                MITRE ATLASの戦術リスト解説:{" "}
                <Ext href="https://versa-networks.com/blog/mitre-attck-vs-atlas-ai-threat-frameworks/">
                  https://versa-networks.com/blog/mitre-attck-vs-atlas-ai-threat-frameworks/
                </Ext>
              </li>
              <li>
                MITRE ATLAS統計データ(16戦術・84技術):{" "}
                <Ext href="https://www.vectra.ai/topics/mitre-atlas">
                  https://www.vectra.ai/topics/mitre-atlas
                </Ext>
              </li>
              <li>
                MITRE ATT&CKとATLASの違い(CrowdStrike):{" "}
                <Ext href="https://www.crowdstrike.com/en-us/cybersecurity-101/artificial-intelligence/mitre-atlas/">
                  https://www.crowdstrike.com/en-us/cybersecurity-101/artificial-intelligence/mitre-atlas/
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.step} id="owasp-llm">
          <p className={styles.stepLabel}>Step 3</p>
          <h2>
            <i className="ti ti-list-numbers" aria-hidden="true" />
            LLMアプリケーションの10大リスク(OWASP Top 10 for LLM Applications 2025)
          </h2>
          <p>
            <strong>OWASP Top 10 for LLM Applications</strong>
            は2023年に始まり、2025年版で大幅に改訂されました。プロンプトインジェクションが2版連続で1位を維持する一方、機微情報の開示は6位から2位へ急上昇するなど、実際のインシデントを反映した並び替えが行われています。
          </p>

          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.dLlmFlow} />
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>コード</th>
                <th style={{ textAlign: "left" }}>リスク名</th>
                <th style={{ textAlign: "left" }}>概要</th>
                <th style={{ textAlign: "left" }}>主な緩和策</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>LLM01:2025</td>
                <td>プロンプトインジェクション</td>
                <td>直接・間接の入力によってモデルの指示を上書きし、意図しない挙動を引き起こす</td>
                <td>指示とデータのチャネル分離、外部コンテンツの隔離、出力前の人による承認</td>
              </tr>
              <tr>
                <td>LLM02:2025</td>
                <td>機微情報の開示</td>
                <td>学習データの記憶や設定情報の露出により、個人情報・秘密情報が漏洩する</td>
                <td>出力フィルタリング、データの最小化、保持ポリシーの明確化</td>
              </tr>
              <tr>
                <td>LLM03:2025</td>
                <td>サプライチェーン</td>
                <td>
                  基盤モデル・データセット・ライブラリ・プラグインなど第三者コンポーネントの脆弱性
                </td>
                <td>コンポーネントの来歴検証、SBOM(部品表)管理、信頼できる供給元の選定</td>
              </tr>
              <tr>
                <td>LLM04:2025</td>
                <td>データ・モデルポイズニング</td>
                <td>学習データやファインチューニングデータへの汚染によるバックドア埋め込み</td>
                <td>データ来歴の検証、バージョン管理、異常検知</td>
              </tr>
              <tr>
                <td>LLM05:2025</td>
                <td>不適切な出力処理</td>
                <td>
                  LLM出力を無検証で下流システム(SQL・シェル・HTMLレンダラー)に渡すことによる各種インジェクション
                </td>
                <td>出力のコンテキストに応じたエンコーディング、パラメータ化クエリの使用</td>
              </tr>
              <tr>
                <td>LLM06:2025</td>
                <td>過剰なエージェンシー(自律性)</td>
                <td>必要以上の機能・権限・自律性をエージェントに与えることによる誤動作や悪用</td>
                <td>最小権限の原則、重要操作への人の承認、機能スコープの制限</td>
              </tr>
              <tr>
                <td>LLM07:2025</td>
                <td>システムプロンプトの漏洩</td>
                <td>システムプロンプトに含めた秘密情報や内部ロジックが露出する</td>
                <td>秘密情報をシステムプロンプトに含めない、別レイヤーでのアクセス制御</td>
              </tr>
              <tr>
                <td>LLM08:2025</td>
                <td>ベクトル・埋め込みの脆弱性</td>
                <td>ベクトルDBへの汚染注入やテナント間のアクセス制御不備</td>
                <td>ベクトルストアのアクセス制御、埋め込みモデルの検証</td>
              </tr>
              <tr>
                <td>LLM09:2025</td>
                <td>誤情報(旧:過度の依存)</td>
                <td>もっともらしい誤った情報(ハルシネーション)を生成・流布する</td>
                <td>出力の裏取り(grounding)、引用元の明示、利用者教育</td>
              </tr>
              <tr>
                <td>LLM10:2025</td>
                <td>制御不能な消費</td>
                <td>リソースを浪費させるDoSやコスト急増(Denial of Wallet)を引き起こす</td>
                <td>レート制限、タイムアウト設定、使用量の監視とアラート</td>
              </tr>
            </tbody>
          </table>

          <div className={`${styles.callout} ${styles.info}`}>
            <i className="ti ti-info-circle" aria-hidden="true" />
            <div>
              <strong>なぜプロンプトインジェクションは「解決できない」と言われるのか。</strong>
              LLMは指示とデータを同じ自然言語のチャネルで処理するため、モデルは「これは正規の指示なのか、それとも処理すべきデータなのか」を原理的に区別できません。OWASPも「生成AIの性質上、確実な防止策が存在するかは不明」と明記しており、完全な解決ではなく多層防御によるリスク低減が現実的なアプローチとされています(詳細はステップ5)。
            </div>
          </div>

          <div className={styles.refBlock}>
            <p className={styles.refTitle}>
              <i className="ti ti-link" aria-hidden="true" />
              参考URL
            </p>
            <ul>
              <li>
                OWASP Top 10 for LLM Applications 2025(公式):{" "}
                <Ext href="https://genai.owasp.org/llm-top-10/">
                  https://genai.owasp.org/llm-top-10/
                </Ext>
              </li>
              <li>
                OWASP Top 10 for LLM Applications 2025 PDF:{" "}
                <Ext href="https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf">
                  https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf
                </Ext>
              </li>
              <li>
                OWASPプロジェクトページ:{" "}
                <Ext href="https://owasp.org/www-project-top-10-for-large-language-model-applications/">
                  https://owasp.org/www-project-top-10-for-large-language-model-applications/
                </Ext>
              </li>
              <li>
                OWASP Top 10 for LLM 2025 解説記事(Aembit):{" "}
                <Ext href="https://aembit.io/blog/owasp-top-10-llm-risks-explained/">
                  https://aembit.io/blog/owasp-top-10-llm-risks-explained/
                </Ext>
              </li>
              <li>
                OWASP Top 10 for LLM 2025 実務ガイド(Gravitee):{" "}
                <Ext href="https://www.gravitee.io/blog/owasp-top-10-for-llm-applications-2025-a-practical-guide">
                  https://www.gravitee.io/blog/owasp-top-10-for-llm-applications-2025-a-practical-guide
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.step} id="owasp-agentic">
          <p className={styles.stepLabel}>Step 4</p>
          <h2>
            <i className="ti ti-robot" aria-hidden="true" />
            AIエージェントの10大リスク(OWASP Top 10 for Agentic Applications 2026)
          </h2>
          <p>
            チャットボットが「質問に答える」だけの存在だったのに対し、
            <strong>AIエージェントは「実際に行動する」</strong>
            存在です。ツールを呼び出し、他のエージェントと通信し、記憶を保持し、実世界のワークフローを操作します。この自律性の高まりに対応するため、OWASP
            GenAI Security Projectは2025年12月、Black Hat Europe 2025に合わせて
            <strong>OWASP Top 10 for Agentic Applications 2026</strong>
            を公開しました。100名以上の業界専門家によるレビューを経た、agentic
            AI固有のリスクを扱う初の業界標準リストです。
          </p>

          <p>
            このリストはOWASP Top 10 for LLM Applicationsを置き換えるものではなく、
            <strong>
              ほとんどのエージェントシステムはLLMアプリケーションでもあるため、両方のリストを併用する
            </strong>
            ことが推奨されています。
          </p>

          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.dAgenticOverview} />
            </div>
          </div>

          <h3>ASI01からASI10までの全体像</h3>
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>コード</th>
                <th style={{ textAlign: "left" }}>リスク名</th>
                <th style={{ textAlign: "left" }}>概要</th>
                <th style={{ textAlign: "left" }}>主な緩和策</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ASI01:2026</td>
                <td>エージェントの目標ハイジャック</td>
                <td>
                  直接・間接の指示操作によって、エージェントの意思決定プロセスそのものを乗っ取られる
                </td>
                <td>厳格な行動制約とガードレール、異常な逸脱の継続的な監視</td>
              </tr>
              <tr>
                <td>ASI02:2026</td>
                <td>ツールの誤用・悪用</td>
                <td>認可された範囲外のパラメータ・順序でツールを呼び出させる</td>
                <td>ツール呼び出し時点でのパラメータ検証、呼び出し元ごとのスコープ制御</td>
              </tr>
              <tr>
                <td>ASI03:2026</td>
                <td>アイデンティティ・権限の悪用</td>
                <td>エージェントの権限が過剰・共有されており、昇格や横断的な悪用が発生する</td>
                <td>エージェント固有の管理されたアイデンティティ、権限の最小化</td>
              </tr>
              <tr>
                <td>ASI04:2026</td>
                <td>エージェント型サプライチェーンの脆弱性</td>
                <td>
                  実行時に動的読み込みされるツール・プロンプト・MCPサーバー・エージェントカードの汚染
                </td>
                <td>ツールマニフェストの署名検証、信頼できるレジストリの利用</td>
              </tr>
              <tr>
                <td>ASI05:2026</td>
                <td>予期しないコード実行</td>
                <td>コード生成・実行系エージェントが悪意ある命令を実行させられる</td>
                <td>サンドボックス化、実行権限の分離、危険な操作の承認フロー</td>
              </tr>
              <tr>
                <td>ASI06:2026</td>
                <td>メモリ・コンテキストの汚染</td>
                <td>長期記憶や検索結果への汚染により、以降のセッションの挙動が歪められる</td>
                <td>メモリ書き込み前のバリデーション、外部由来コンテンツの明示的タグ付け</td>
              </tr>
              <tr>
                <td>ASI07:2026</td>
                <td>安全でないエージェント間通信</td>
                <td>
                  エージェント間メッセージのなりすまし・再送・非認証によるクラスタ全体の誤誘導
                </td>
                <td>エージェント間の相互認証、メッセージの署名・検証</td>
              </tr>
              <tr>
                <td>ASI08:2026</td>
                <td>連鎖的な障害</td>
                <td>1つのエージェントの誤動作・侵害がシステム全体に波及する</td>
                <td>サーキットブレーカー, 短命な認証情報, レート制限</td>
              </tr>
              <tr>
                <td>ASI09:2026</td>
                <td>人間とエージェント間の信頼の悪用</td>
                <td>
                  流暢で説得力のあるエージェントの発言を人間が過信し、危険な操作を承認してしまう
                </td>
                <td>同意取得はチャットUIではなく別の検証済みチャネルで行う</td>
              </tr>
              <tr>
                <td>ASI10:2026</td>
                <td>暴走エージェント</td>
                <td>エージェントが意図と乖離した目的で行動を継続する</td>
                <td>常時の行動監査、キルスイッチ、権限の即時失効機構</td>
              </tr>
            </tbody>
          </table>

          <h3>実践への落とし込み ― 「Identity」と「Containment」の2本柱</h3>
          <p>
            すべてのリスクを一度に解決する必要はありません。多くの実務家は、次の2つの軸に沿って優先順位をつけています。
          </p>
          <ol className={styles.plain}>
            <li>
              <strong>アイデンティティ管理</strong>
              :ASI03・ASI05・ASI10に関連。エージェントごとに固有の管理されたアイデンティティを与え、認証情報の共有を避ける。
            </li>
            <li>
              <strong>自律性の封じ込め(Containment)</strong>
              :ASI01・ASI02・ASI07・ASI08に関連。「Least
              Agency(必要最小限の自律性)」の原則に基づき、高リスクな操作には必ず人間の承認を挟む。
            </li>
          </ol>

          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>順序</th>
                <th style={{ textAlign: "left" }}>アクション</th>
                <th style={{ textAlign: "left" }}>対応するリスク</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>エージェントとその認証情報の棚卸し</td>
                <td>ASI03</td>
              </tr>
              <tr>
                <td>2</td>
                <td>自律性とツールスコープの制限(Least Agency / Least Privilege)</td>
                <td>ASI01, ASI02, ASI05</td>
              </tr>
              <tr>
                <td>3</td>
                <td>入力と記憶の堅牢化(信頼できる指示と外部コンテンツの分離)</td>
                <td>ASI06、ASI01の一部</td>
              </tr>
              <tr>
                <td>4</td>
                <td>エージェント間通信の相互認証</td>
                <td>ASI07</td>
              </tr>
              <tr>
                <td>5</td>
                <td>障害の影響範囲(blast radius)を限定する仕組みの整備</td>
                <td>ASI08</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.refBlock}>
            <p className={styles.refTitle}>
              <i className="ti ti-link" aria-hidden="true" />
              参考URL
            </p>
            <ul>
              <li>
                OWASP Top 10 for Agentic Applications 2026(公式リソース):{" "}
                <Ext href="https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/">
                  https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
                </Ext>
              </li>
              <li>
                OWASP Top 10 for Agentic Applications 2026 公式PDF:{" "}
                <Ext href="https://genai.owasp.org/download/52117">
                  https://genai.owasp.org/download/52117
                </Ext>
              </li>
              <li>
                OWASP GenAI Security Project発表記事:{" "}
                <Ext href="https://genai.owasp.org/2025/12/09/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/">
                  https://genai.owasp.org/2025/12/09/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/
                </Ext>
              </li>
              <li>
                ASI01-10の実務的な優先順位付け解説:{" "}
                <Ext href="https://arnav.au/2026/07/02/owasp-top-10-for-agentic-applications/">
                  https://arnav.au/2026/07/02/owasp-top-10-for-agentic-applications/
                </Ext>
              </li>
              <li>
                Auth0による解説記事(Least Agencyの概念):{" "}
                <Ext href="https://auth0.com/blog/owasp-top-10-agentic-applications-lessons/">
                  https://auth0.com/blog/owasp-top-10-agentic-applications-lessons/
                </Ext>
              </li>
              <li>
                Modulosガバナンスガイド:{" "}
                <Ext href="https://docs.modulos.ai/frameworks/owasp-top-10-agentic/index">
                  https://docs.modulos.ai/frameworks/owasp-top-10-agentic/index
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.step} id="prompt-injection">
          <p className={styles.stepLabel}>Step 5</p>
          <h2>
            <i className="ti ti-shield-bolt" aria-hidden="true" />
            プロンプトインジェクション対策を深掘りする
          </h2>
          <p>
            プロンプトインジェクションは2025年版・2026年版いずれのOWASPリストでも中心的なリスクとして扱われています。OpenAI・Anthropic・Google
            DeepMindの各社も「現在のLLMアーキテクチャの範囲内では完全に解決できない」と2025年の論文で認めています。したがって現実的な目標は「攻撃を完全に防ぐこと」ではなく、
            <strong>多層防御によって被害範囲(blast radius)を許容できる水準まで下げること</strong>
            です。
          </p>

          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.dDefenseLayers} />
            </div>
          </div>

          <h3>代表的な対策手法の比較</h3>
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>手法</th>
                <th style={{ textAlign: "left" }}>種類</th>
                <th style={{ textAlign: "left" }}>概要</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Spotlighting</td>
                <td>前処理(訓練不要)</td>
                <td>
                  区切り文字・データマーキング・エンコーディングにより、外部コンテンツの出所をモデルに明示する。軽量で導入しやすいが確率的な効果にとどまる
                </td>
              </tr>
              <tr>
                <td>Instruction Hierarchy(命令階層)</td>
                <td>モデル訓練</td>
                <td>システム・開発者・ユーザーなど、指示の発信元ごとに優先順位を学習させる</td>
              </tr>
              <tr>
                <td>StruQ / SecAlign</td>
                <td>モデル訓練</td>
                <td>
                  プロンプトとデータのチャネルを構造的に分離し、選好最適化により攻撃成功率を大幅に低減(研究では2%程度まで低下との報告)
                </td>
              </tr>
              <tr>
                <td>CaMeL(Google DeepMind)</td>
                <td>アーキテクチャ的防御</td>
                <td>
                  「特権LLM」と「隔離LLM」を分離。隔離LLMはツール呼び出し権限を持たず、データの来歴(provenance)をプログラム全体で追跡する
                </td>
              </tr>
              <tr>
                <td>Progent</td>
                <td>実行時制御</td>
                <td>
                  プログラム可能な権限制御により、攻撃成功率を約41%から2%程度まで低減したとする報告あり
                </td>
              </tr>
              <tr>
                <td>出力側の検知(MELON等)</td>
                <td>実行時監視</td>
                <td>
                  エージェントの挙動が本来のタスクから逸脱していないかを再実行・比較して検知する
                </td>
              </tr>
            </tbody>
          </table>

          <h3>実務上の重要な原則</h3>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-circle-check" aria-hidden="true" />
              <div>
                <strong>外部コンテンツは常に「信頼できないデータ」として扱う:</strong>
                文書・Webページ・ツールの実行結果・メールなど、モデルが読み込むあらゆる外部情報は、たとえエージェント自身が生成したものでなくても、指示ではなくデータとして扱う
              </div>
            </li>
            <li>
              <i className="ti ti-circle-check" aria-hidden="true" />
              <div>
                <strong>単一の防御手法に依存しない:</strong>
                検知ベースの手法とアーキテクチャ的な防御(権限分離)を組み合わせる
              </div>
            </li>
            <li>
              <i className="ti ti-circle-check" aria-hidden="true" />
              <div>
                <strong>不可逆な操作には必ず人の承認を挟む:</strong>
                メール送信、レコード削除、決済処理などの高リスク操作は自動承認しない
              </div>
            </li>
            <li>
              <i className="ti ti-circle-check" aria-hidden="true" />
              <div>
                <strong>出口(egress)を制限する:</strong>
                仮にインジェクションが成功しても、機密データを外部に送信できる経路自体を塞ぐ
              </div>
            </li>
          </ul>

          <div className={styles.refBlock}>
            <p className={styles.refTitle}>
              <i className="ti ti-link" aria-hidden="true" />
              参考URL
            </p>
            <ul>
              <li>
                間接的プロンプトインジェクション:攻撃と防御の2026年最新動向:{" "}
                <Ext href="https://zylos.ai/research/2026-04-12-indirect-prompt-injection-defenses-agents-untrusted-content/">
                  https://zylos.ai/research/2026-04-12-indirect-prompt-injection-defenses-agents-untrusted-content/
                </Ext>
              </li>
              <li>
                エージェント型コーディングアシスタントへのプロンプトインジェクション調査(arXiv):{" "}
                <Ext href="https://arxiv.org/html/2601.17548v1">
                  https://arxiv.org/html/2601.17548v1
                </Ext>
              </li>
              <li>
                Spotlighting等の防御手法の学術的整理(arXiv):{" "}
                <Ext href="https://arxiv.org/pdf/2512.00136">https://arxiv.org/pdf/2512.00136</Ext>
              </li>
              <li>
                OWASP Foundationによるプロンプトインジェクション防御の推奨事項:{" "}
                <Ext href="https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf">
                  https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.step} id="saif">
          <p className={styles.stepLabel}>Step 6</p>
          <h2>
            <i className="ti ti-recycle" aria-hidden="true" />
            セキュアな開発ライフサイクルを作る(Google SAIF)
          </h2>
          <p>
            <strong>Google Secure AI Framework(SAIF)</strong>
            は、AIシステム全体のライフサイクルにセキュリティを組み込むための概念的フレームワークです。従来のソフトウェア開発で培われた「レビュー・テスト・サプライチェーン管理」のベストプラクティスを、AI特有のリスク(モデル窃取・学習データポイズニング・プロンプトインジェクション・機密情報の抽出)に適用する形で設計されています。
          </p>

          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.dSaif} />
            </div>
          </div>

          <h3>実務チェックリスト(SAIFに基づく代表的な統制例)</h3>
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>領域</th>
                <th style={{ textAlign: "left" }}>具体的な統制</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>データ</td>
                <td>
                  学習用ストレージからの公開アクセスを排除し、DLP(データ損失防止)で機微情報をサニタイズする
                </td>
              </tr>
              <tr>
                <td>モデル</td>
                <td>
                  モデルへの不正コピー・読み取りを防ぐアクセス制御と、不正な挙動を監視する検知機構を備える
                </td>
              </tr>
              <tr>
                <td>アプリケーション</td>
                <td>
                  プロンプトの入力・出力の両方を検査するミドルウェア層(AIゲートウェイ)を設ける
                </td>
              </tr>
              <tr>
                <td>エージェント</td>
                <td>
                  サービスアカウントには読み取り専用など必要最小限のIAMロールのみを付与し、Editor/Ownerのような広範な権限は与えない
                </td>
              </tr>
              <tr>
                <td>監視</td>
                <td>リアルタイムでの異常検知とアラート、定期的な監査を組み合わせる</td>
              </tr>
            </tbody>
          </table>

          <p>
            SAIFの推進母体としてGoogleは、Anthropic・Cisco・IBM・Intel・NVIDIA・PayPalなどを創設メンバーとする
            <strong>Coalition for Secure AI(CoSAI)</strong>
            を組成し、業界横断でのAIセキュリティ標準化を進めています。
          </p>

          <div className={styles.refBlock}>
            <p className={styles.refTitle}>
              <i className="ti ti-link" aria-hidden="true" />
              参考URL
            </p>
            <ul>
              <li>
                Google Secure AI Framework 公式サイト:{" "}
                <Ext href="https://saif.google/">https://saif.google/</Ext>
              </li>
              <li>
                SAIF発表ブログ(Google公式):{" "}
                <Ext href="https://blog.google/innovation-and-ai/technology/safety-security/introducing-googles-secure-ai-framework/">
                  https://blog.google/innovation-and-ai/technology/safety-security/introducing-googles-secure-ai-framework/
                </Ext>
              </li>
              <li>
                Google Safety Centre によるSAIF解説:{" "}
                <Ext href="https://safety.google/intl/en_in/safety/saif/">
                  https://safety.google/intl/en_in/safety/saif/
                </Ext>
              </li>
              <li>
                Google CloudにおけるSAIFの実装ガイド:{" "}
                <Ext href="https://cloud.google.com/use-cases/secure-ai-framework">
                  https://cloud.google.com/use-cases/secure-ai-framework
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.step} id="nist">
          <p className={styles.stepLabel}>Step 7</p>
          <h2>
            <i className="ti ti-building-bank" aria-hidden="true" />
            リスクマネジメント体制を構築する(NIST AI RMF)
          </h2>
          <p>
            <strong>NIST AI Risk Management Framework(AI RMF 1.0)</strong>
            は2023年1月に米国NISTが公開した、業種横断で利用可能な自主的(voluntary)フレームワークです。4つの中核機能(Govern・Map・Measure・Manage)から構成され、AIのライフサイクル全体でリスクを管理するための土台を提供します。
          </p>

          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.dNist} />
            </div>
          </div>

          <h3>NIST AI 600-1(生成AIプロファイル)の12のリスクカテゴリ</h3>
          <p>
            2024年7月、NISTはAI RMFの生成AI特化版として
            <strong>NIST AI 600-1(Generative AI Profile)</strong>
            を公開しました。12のリスクカテゴリと200以上の推奨アクションを定義しています。
          </p>

          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>#</th>
                <th style={{ textAlign: "left" }}>リスクカテゴリ</th>
                <th style={{ textAlign: "left" }}>概要</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>CBRN情報・能力</td>
                <td>
                  化学・生物・放射性物質・核兵器に関する情報アクセスの障壁を下げてしまうリスク
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>作話(Confabulation)</td>
                <td>もっともらしい誤情報を自信満々に生成するリスク(いわゆるハルシネーション)</td>
              </tr>
              <tr>
                <td>3</td>
                <td>危険・暴力的・憎悪的コンテンツ</td>
                <td>有害なコンテンツの生成</td>
              </tr>
              <tr>
                <td>4</td>
                <td>データプライバシー</td>
                <td>個人情報の記憶・漏洩・不適切な利用</td>
              </tr>
              <tr>
                <td>5</td>
                <td>環境への影響</td>
                <td>学習・推論にかかる計算資源とエネルギー消費</td>
              </tr>
              <tr>
                <td>6</td>
                <td>有害なバイアスと均質化</td>
                <td>特定の属性への偏見や、多様性の喪失</td>
              </tr>
              <tr>
                <td>7</td>
                <td>人間とAIの構成</td>
                <td>人間がAIの出力にどう向き合うか、過信や誤解のリスク</td>
              </tr>
              <tr>
                <td>8</td>
                <td>情報の完全性(Information Integrity)</td>
                <td>偽情報・偽装コンテンツの拡散</td>
              </tr>
              <tr>
                <td>9</td>
                <td>情報セキュリティ</td>
                <td>プロンプトインジェクションやデータ漏洩などの技術的セキュリティリスク</td>
              </tr>
              <tr>
                <td>10</td>
                <td>知的財産</td>
                <td>著作権のある学習データの記憶・再生成に関するリスク</td>
              </tr>
              <tr>
                <td>11</td>
                <td>わいせつ・侮辱的コンテンツ</td>
                <td>不適切なコンテンツ生成のリスク</td>
              </tr>
              <tr>
                <td>12</td>
                <td>バリューチェーン・コンポーネントの完全性</td>
                <td>サードパーティモデル・データセット・ライブラリの信頼性</td>
              </tr>
            </tbody>
          </table>

          <p>
            NISTはこのフレームワークを「エージェント型AI」の文脈にも拡張する準備を進めており、2026年2月にはNIST
            CAISI(AI標準化イニシアチブ)がエージェント標準化に関する取り組みを発表し、937件のパブリックコメントを受け付けています。
          </p>

          <h3>実務への落とし込み</h3>
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>機能</th>
                <th style={{ textAlign: "left" }}>具体的なアクション例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Govern</td>
                <td>
                  AI利用ポリシーの策定、アカウンタビリティの明確化、インシデントのエスカレーションパスの設定
                </td>
              </tr>
              <tr>
                <td>Map</td>
                <td>
                  社内のAIユースケース・利害関係者・データソースを文書化し、生成AI特有のリスクをマッピングする
                </td>
              </tr>
              <tr>
                <td>Measure</td>
                <td>
                  ハルシネーション・バイアス・プライバシー漏洩・環境影響のテストを、内部評価とレッドチーミングの両方で実施する
                </td>
              </tr>
              <tr>
                <td>Manage</td>
                <td>
                  コンテンツの来歴管理、インシデント開示の手順整備、サードパーティ依存に対するフォールバック計画の策定
                </td>
              </tr>
            </tbody>
          </table>

          <div className={styles.refBlock}>
            <p className={styles.refTitle}>
              <i className="ti ti-link" aria-hidden="true" />
              参考URL
            </p>
            <ul>
              <li>
                NIST AI Risk Management Framework 公式:{" "}
                <Ext href="https://www.nist.gov/itl/ai-risk-management-framework">
                  https://www.nist.gov/itl/ai-risk-management-framework
                </Ext>
              </li>
              <li>
                NIST AI 600-1(Generative AI Profile)公式ページ:{" "}
                <Ext href="https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence">
                  https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence
                </Ext>
              </li>
              <li>
                NIST AI 600-1 本文PDF:{" "}
                <Ext href="https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf">
                  https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf
                </Ext>
              </li>
              <li>
                NIST AI RMFのエージェント拡張に関する提案:{" "}
                <Ext href="https://labs.cloudsecurityalliance.org/agentic/agentic-nist-ai-rmf-profile-v1/">
                  https://labs.cloudsecurityalliance.org/agentic/agentic-nist-ai-rmf-profile-v1/
                </Ext>
              </li>
              <li>
                NIST AI 600-1の12カテゴリ解説:{" "}
                <Ext href="https://docs.modulos.ai/frameworks/nist-ai-rmf/generative-ai-profile">
                  https://docs.modulos.ai/frameworks/nist-ai-rmf/generative-ai-profile
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.step} id="regulation">
          <p className={styles.stepLabel}>Step 8</p>
          <h2>
            <i className="ti ti-scale" aria-hidden="true" />
            法規制・認証への対応(EU AI Act と ISO/IEC 42001)
          </h2>

          <h3>EU AI Act:2026年の最新スケジュール</h3>
          <p>
            EU AI
            Actは2024年8月に発効した、世界初の包括的なAI規制です。2025年11月、欧州委員会は実装の遅れを踏まえて
            <strong>Digital Omnibus on AI</strong>
            という簡素化パッケージを提案し、2026年5月7日に欧州議会と理事会が暫定合意に至りました。2026年7月8日時点での最新の状況は以下の通りです。
          </p>

          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>時期</th>
                <th style={{ textAlign: "left" }}>内容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025年2月2日〜(発効済み)</td>
                <td>
                  禁止されるAI慣行(サブリミナル操作、ソーシャルスコアリング、公共空間でのリアルタイム遠隔生体認証等)の適用開始
                </td>
              </tr>
              <tr>
                <td>2026年8月2日</td>
                <td>
                  高リスクAIシステム(Annex
                  III)の義務化が本来予定されていた日。Omnibus未成立の場合はこの日から原文通り適用
                </td>
              </tr>
              <tr>
                <td>2026年8月2日</td>
                <td>
                  Article 50の透明性義務(AI生成コンテンツである旨の開示等)は原則予定通り適用開始
                </td>
              </tr>
              <tr>
                <td>2026年12月2日</td>
                <td>
                  生成AI出力の電子透かし・機械可読な表示義務(Article
                  50(2))。Omnibusにより4か月延期された新しい期限
                </td>
              </tr>
              <tr>
                <td>2026年12月2日</td>
                <td>
                  新設予定の禁止事項:非同意の性的合成コンテンツおよびCSAMを生成・改変するAIシステムの禁止
                </td>
              </tr>
              <tr>
                <td>2027年8月2日</td>
                <td>Omnibus未成立の場合の、Annex III高リスクAIシステムの本来の義務化期限</td>
              </tr>
              <tr>
                <td>2027年12月2日</td>
                <td>
                  Omnibus成立を前提とした、Annex
                  III(単体高リスクAIシステム)の新しい義務化期限(16か月延期)
                </td>
              </tr>
              <tr>
                <td>2027年8月2日</td>
                <td>国内AI規制サンドボックス設置義務の新しい期限(1年延期)</td>
              </tr>
              <tr>
                <td>2028年8月2日</td>
                <td>
                  Annex
                  I(医療機器・機械類等、既存の製品規制に組み込まれた高リスクAIシステム)の新しい義務化期限
                </td>
              </tr>
            </tbody>
          </table>

          <div className={`${styles.callout} ${styles.danger}`}>
            <i className="ti ti-alert-triangle" aria-hidden="true" />
            <div>
              <strong>重要な注意点。</strong>
              Omnibusはあくまで「まだ正式採択されていない暫定合意」であり、2026年8月2日までに正式採択・官報公示がなされない場合は、原文どおりのスケジュール(2026年8月2日/2027年8月2日)が有効になります。実務上は、どちらの結果になっても対応できるよう、AIシステムの棚卸しと分類作業は前倒しで進めることが推奨されています。
            </div>
          </div>

          <h3>ISO/IEC 42001:世界初のAIマネジメントシステム認証</h3>
          <p>
            <strong>ISO/IEC 42001:2023</strong>
            は2023年12月に発行された、世界初のAIマネジメントシステム(AIMS)に関する認証可能な国際規格です。ISO
            27001(情報セキュリティ)やISO
            9001(品質管理)と同様に、第三者機関による正式な認証取得が可能です。PDCA(Plan-Do-Check-Act)サイクルに基づき、データガバナンス・モデルの透明性・バイアス低減・人による監督といったAI特有の統制を含みます。
          </p>

          <p>
            注意点として、ISO/IEC 42001の認証取得は組織のAIマネジメント体制を証明するものであり、
            <strong>
              それ自体がEU AI Actなど個別法規制への準拠を自動的に意味するわけではありません
            </strong>
            。個々のAIシステムがEU AI
            Actの要求事項を満たしているかどうかは、別途の適合性評価が必要です。
          </p>

          <div className={styles.refBlock}>
            <p className={styles.refTitle}>
              <i className="ti ti-link" aria-hidden="true" />
              参考URL
            </p>
            <ul>
              <li>
                EU AI Actオムニバス合意の解説(Gibson Dunn):{" "}
                <Ext href="https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/">
                  https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/
                </Ext>
              </li>
              <li>
                EU理事会 プレスリリース(2026年5月7日):{" "}
                <Ext href="https://www.consilium.europa.eu/en/press/press-releases/2026/05/07/artificial-intelligence-council-and-parliament-agree-to-simplify-and-streamline-rules/">
                  https://www.consilium.europa.eu/en/press/press-releases/2026/05/07/artificial-intelligence-council-and-parliament-agree-to-simplify-and-streamline-rules/
                </Ext>
              </li>
              <li>
                White & Case による解説:{" "}
                <Ext href="https://www.whitecase.com/insight-alert/eu-agrees-digital-omnibus-deal-simplify-ai-rules">
                  https://www.whitecase.com/insight-alert/eu-agrees-digital-omnibus-deal-simplify-ai-rules
                </Ext>
              </li>
              <li>
                EU AI Actの現状まとめ(Travers Smith):{" "}
                <Ext href="https://www.traverssmith.com/knowledge/knowledge-container/the-eu-ai-act-the-current-state-of-play/">
                  https://www.traverssmith.com/knowledge/knowledge-container/the-eu-ai-act-the-current-state-of-play/
                </Ext>
              </li>
              <li>
                ISO/IEC 42001 公式ページ:{" "}
                <Ext href="https://www.iso.org/standard/42001">
                  https://www.iso.org/standard/42001
                </Ext>
              </li>
              <li>
                ISO/IEC 42001 概要(ISO公式):{" "}
                <Ext href="https://www.iso.org/artificial-intelligence/ai-management-systems">
                  https://www.iso.org/artificial-intelligence/ai-management-systems
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.step} id="redteam">
          <p className={styles.stepLabel}>Step 9</p>
          <h2>
            <i className="ti ti-crosshair" aria-hidden="true" />
            レッドチーミングと継続的な監視を始める
          </h2>
          <p>
            フレームワークを理解しただけでは、実際のリスクは低減できません。最後のステップは、
            <strong>継続的な検証サイクル</strong>
            を業務プロセスに組み込むことです。
          </p>

          <div className={styles.diagramWrap}>
            <div>
              <MermaidDiagram chart={DIAGRAMS.dRedteam} />
            </div>
          </div>

          <h3>レッドチーミングの実践ポイント</h3>
          <ol className={styles.plain}>
            <li>
              <strong>フレームワークベース of テスト:</strong>
              OWASP LLM Top 10 / Agentic Top 10 / MITRE
              ATLASのカテゴリごとに、実際に攻撃を試みるテストケースを用意する
            </li>
            <li>
              <strong>適応的攻撃を想定する:</strong>
              静的な防御は、攻撃者が防御手法を知った上で調整してくる「適応的攻撃(adaptive
              attack)」に対して脆弱になりがちである。研究では、最新の防御手法に対しても適応的攻撃の成功率が85%を超えるケースが報告されている
            </li>
            <li>
              <strong>継続的な実施:</strong>
              AIモデルやエージェントの構成は頻繁に更新されるため、一度きりの評価ではなく、リリースごとの継続的なテストを組み込む
            </li>
            <li>
              <strong>人間の監督との組み合わせ:</strong>
              自動化されたレッドチーミングツールと、人間による定性的なレビューの両方を組み合わせる
            </li>
          </ol>

          <h3>監視すべき代表的なシグナル</h3>
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>シグナル</th>
                <th style={{ textAlign: "left" }}>検知したい事象</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>異常なプロンプトパターン</td>
                <td>プロンプトインジェクションの試行</td>
              </tr>
              <tr>
                <td>ツール呼び出しの急増・逸脱</td>
                <td>エージェントの目標ハイジャックやツールの誤用</td>
              </tr>
              <tr>
                <td>トークン消費量の急増</td>
                <td>リソース枯渇攻撃(Denial of Wallet)</td>
              </tr>
              <tr>
                <td>出力内の機密情報パターン</td>
                <td>機微情報の開示</td>
              </tr>
              <tr>
                <td>エージェント間メッセージの整合性エラー</td>
                <td>なりすまし・改ざんされた通信</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.refBlock}>
            <p className={styles.refTitle}>
              <i className="ti ti-link" aria-hidden="true" />
              参考URL
            </p>
            <ul>
              <li>
                適応的攻撃に対する防御成功率に関する研究(arXiv):{" "}
                <Ext href="https://arxiv.org/html/2601.17548v1">
                  https://arxiv.org/html/2601.17548v1
                </Ext>
              </li>
              <li>
                AIレッドチーミングの手法論に関する系統的レビュー(arXiv):{" "}
                <Ext href="https://arxiv.org/pdf/2602.21267">https://arxiv.org/pdf/2602.21267</Ext>
              </li>
              <li>
                MITRE ATLASのレッドチーム活用ガイド:{" "}
                <Ext href="https://www.getastra.com/blog/security-audit/mitre-atlas/">
                  https://www.getastra.com/blog/security-audit/mitre-atlas/
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.step} id="checklist">
          <p className={styles.stepLabel}>Step 10</p>
          <h2>
            <i className="ti ti-checklist" aria-hidden="true" />
            今日から使える実践チェックリスト
          </h2>
          <p>組織の成熟度に応じて、以下のチェックリストを段階的に導入することを推奨します。</p>

          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>フェーズ</th>
                <th style={{ textAlign: "left" }}>期間の目安</th>
                <th style={{ textAlign: "left" }}>やるべきこと</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>フェーズ1:可視化</td>
                <td>最初の2〜4週間</td>
                <td>社内のAIシステム・エージェントとその権限を棚卸しする</td>
              </tr>
              <tr>
                <td>フェーズ2:基本防御</td>
                <td>1〜2か月目</td>
                <td>OWASP LLM Top 10に沿って、入出力の検証・最小権限・レート制限を実装する</td>
              </tr>
              <tr>
                <td>フェーズ3:エージェント対応</td>
                <td>2〜3か月目</td>
                <td>
                  OWASP Agentic Top
                  10(ASI01-10)に基づき、アイデンティティ管理と自律性の封じ込めを行う
                </td>
              </tr>
              <tr>
                <td>フェーズ4:ガバナンス整備</td>
                <td>3〜6か月目</td>
                <td>
                  NIST AI RMFのGovern/Map/Measure/Manageサイクルを回す体制を作り、Google
                  SAIFと組み合わせる
                </td>
              </tr>
              <tr>
                <td>フェーズ5:法規制対応</td>
                <td>継続的</td>
                <td>EU AI Actの適用対象を確認し、必要に応じてISO/IEC 42001の認証取得を検討する</td>
              </tr>
              <tr>
                <td>フェーズ6:継続的検証</td>
                <td>継続的</td>
                <td>MITRE ATLASを参照したレッドチーミングと本番監視を定期的に実施する</td>
              </tr>
            </tbody>
          </table>

          <h3>最終チェックリスト(抜粋)</h3>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <div>
                外部から入力されるすべてのコンテンツを「信頼できないデータ」として扱っているか
              </div>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <div>
                LLM・エージェントの出力を、下流システムに渡す前に検証・エンコーディングしているか
              </div>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <div>エージェントに与えている権限は、タスク遂行に必要な最小限にとどまっているか</div>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <div>不可逆・高リスクな操作には、必ず人間による承認ステップが入っているか</div>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <div>
                学習データ・プラグイン・MCPサーバーなどサプライチェーンの来歴を検証しているか
              </div>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <div>プロンプトパターン・ツール呼び出し・トークン消費量を継続的に監視しているか</div>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <div>組織としてのAIガバナンス方針(Govern)が明文化されているか</div>
            </li>
            <li>
              <i className="ti ti-square-check" aria-hidden="true" />
              <div>適用対象となる法規制(EU AI Actなど)のスケジュールを把握しているか</div>
            </li>
          </ul>
        </section>

        <section className={styles.step} id="summary">
          <h2>
            <i className="ti ti-flag" aria-hidden="true" />
            まとめ
          </h2>
          <p>
            AIセキュリティは、単一のツールや一度きりの対策では完結しません。本ガイドで紹介したように、
            <strong>
              「脅威モデリング(MITRE
              ATLAS)」「アプリケーションリスクの理解(OWASP)」「開発ライフサイクルへの組み込み(Google
              SAIF)」「組織的なガバナンス(NIST AI RMF)」「法規制対応(EU AI Act / ISO
              42001)」「継続的な検証(レッドチーミング)」
            </strong>
            という複数のレイヤーを組み合わせることで、初めて実効性のある防御体制が構築できます。
          </p>

          <p>
            特にプロンプトインジェクションのように「完全な解決策が存在しない」リスクについては、多層防御によって被害の範囲を限定するという考え方が現実的です。また、AIエージェントの普及に伴い、従来のアプリケーションセキュリティの知見だけではカバーしきれない新しいリスク(ASI01-10)が急速に増えている点にも注意が必要です。
          </p>

          <p>
            このガイドで紹介したフレームワークはいずれも継続的にアップデートされているため、定期的に公式サイトを確認し、最新の情報を追い続けることを強くお勧めします。
          </p>
        </section>

        <section className={styles.step} id="references">
          <h2>
            <i className="ti ti-link" aria-hidden="true" />
            参考URL一覧(全体)
          </h2>

          <div className={styles.refGroup}>
            <h4>業界フレームワーク・標準</h4>
            <ul className={styles.plain}>
              <li>
                OWASP GenAI Security Project:{" "}
                <Ext href="https://genai.owasp.org/">https://genai.owasp.org/</Ext>
              </li>
              <li>
                OWASP Top 10 for LLM Applications 2025:{" "}
                <Ext href="https://genai.owasp.org/llm-top-10/">
                  https://genai.owasp.org/llm-top-10/
                </Ext>
              </li>
              <li>
                OWASP Top 10 for LLM Applications 2025 PDF:{" "}
                <Ext href="https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf">
                  https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf
                </Ext>
              </li>
              <li>
                OWASP Top 10 for Agentic Applications 2026:{" "}
                <Ext href="https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/">
                  https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
                </Ext>
              </li>
              <li>
                OWASP Top 10 for Agentic Applications 2026 公式PDF:{" "}
                <Ext href="https://genai.owasp.org/download/52117">
                  https://genai.owasp.org/download/52117
                </Ext>
              </li>
              <li>
                MITRE ATLAS 公式サイト:{" "}
                <Ext href="https://atlas.mitre.org/">https://atlas.mitre.org/</Ext>
              </li>
              <li>
                MITRE ATLAS成長に関するCTIDブログ:{" "}
                <Ext href="https://ctid.mitre.org/blog/2026/05/06/secure-ai-v2-release/">
                  https://ctid.mitre.org/blog/2026/05/06/secure-ai-v2-release/
                </Ext>
              </li>
              <li>
                NIST AI Risk Management Framework:{" "}
                <Ext href="https://www.nist.gov/itl/ai-risk-management-framework">
                  https://www.nist.gov/itl/ai-risk-management-framework
                </Ext>
              </li>
              <li>
                NIST AI 600-1(生成AIプロファイル):{" "}
                <Ext href="https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence">
                  https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence
                </Ext>
              </li>
              <li>
                NIST AI 600-1 本文PDF:{" "}
                <Ext href="https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf">
                  https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf
                </Ext>
              </li>
              <li>
                Google Secure AI Framework(SAIF):{" "}
                <Ext href="https://saif.google/">https://saif.google/</Ext>
              </li>
              <li>
                SAIF発表ブログ(Google公式):{" "}
                <Ext href="https://blog.google/innovation-and-ai/technology/safety-security/introducing-googles-secure-ai-framework/">
                  https://blog.google/innovation-and-ai/technology/safety-security/introducing-googles-secure-ai-framework/
                </Ext>
              </li>
              <li>
                ISO/IEC 42001 公式ページ:{" "}
                <Ext href="https://www.iso.org/standard/42001">
                  https://www.iso.org/standard/42001
                </Ext>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h4>法規制</h4>
            <ul className={styles.plain}>
              <li>
                EU理事会 プレスリリース(2026年5月7日、Digital Omnibus合意):{" "}
                <Ext href="https://www.consilium.europa.eu/en/press/press-releases/2026/05/07/artificial-intelligence-council-and-parliament-agree-to-simplify-and-streamline-rules/">
                  https://www.consilium.europa.eu/en/press/press-releases/2026/05/07/artificial-intelligence-council-and-parliament-agree-to-simplify-and-streamline-rules/
                </Ext>
              </li>
              <li>
                EU AI Actオムニバス解説(Gibson Dunn):{" "}
                <Ext href="https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/">
                  https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/
                </Ext>
              </li>
              <li>
                EU AI Actオムニバス解説(White & Case):{" "}
                <Ext href="https://www.whitecase.com/insight-alert/eu-agrees-digital-omnibus-deal-simplify-ai-rules">
                  https://www.whitecase.com/insight-alert/eu-agrees-digital-omnibus-deal-simplify-ai-rules
                </Ext>
              </li>
              <li>
                EU AI Actの現状まとめ(Travers Smith):{" "}
                <Ext href="https://www.traverssmith.com/knowledge/knowledge-container/the-eu-ai-act-the-current-state-of-play/">
                  https://www.traverssmith.com/knowledge/knowledge-container/the-eu-ai-act-the-current-state-of-play/
                </Ext>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h4>技術的な深掘り(プロンプトインジェクション・エージェントセキュリティ)</h4>
            <ul className={styles.plain}>
              <li>
                間接的プロンプトインジェクションの2026年最新動向:{" "}
                <Ext href="https://zylos.ai/research/2026-04-12-indirect-prompt-injection-defenses-agents-untrusted-content/">
                  https://zylos.ai/research/2026-04-12-indirect-prompt-injection-defenses-agents-untrusted-content/
                </Ext>
              </li>
              <li>
                エージェント型コーディングアシスタントへの攻撃調査(arXiv):{" "}
                <Ext href="https://arxiv.org/html/2601.17548v1">
                  https://arxiv.org/html/2601.17548v1
                </Ext>
              </li>
              <li>
                OWASP Agentic Top 10の実務的優先順位付け:{" "}
                <Ext href="https://arnav.au/2026/07/02/owasp-top-10-for-agentic-applications/">
                  https://arnav.au/2026/07/02/owasp-top-10-for-agentic-applications/
                </Ext>
              </li>
              <li>
                Auth0によるLeast Agency解説:{" "}
                <Ext href="https://auth0.com/blog/owasp-top-10-agentic-applications-lessons/">
                  https://auth0.com/blog/owasp-top-10-agentic-applications-lessons/
                </Ext>
              </li>
              <li>
                AIレッドチーミング手法の系統的レビュー(arXiv):{" "}
                <Ext href="https://arxiv.org/pdf/2602.21267">https://arxiv.org/pdf/2602.21267</Ext>
              </li>
            </ul>
          </div>

          <footer className={styles.pageFooter}>
            本ガイドは2026年7月時点で入手可能な最新の公開情報に基づいて作成されています。特にEU AI
            Actのスケジュールおよび各フレームワークのバージョンは今後も更新される可能性が高いため、実務での適用にあたっては必ず一次情報源で最新状況をご確認ください。
          </footer>
        </section>
      </main>
    </div>
  );
}
