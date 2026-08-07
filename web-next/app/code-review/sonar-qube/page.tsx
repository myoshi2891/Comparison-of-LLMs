/* biome-ignore-all lint/suspicious/noTemplateCurlyInString: code examples contain bash/yaml variables */
import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import Checklist from "./Checklist";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "SonarQubeコードレビュー実践ガイド ― 中級者〜上級者のためのベストプラクティス",
  description:
    "Quality Gate設計からIssueトリアージ、CI/CD統合、そしてAC/DC時代のAIコーディングエージェント連携まで。SonarQube公式ドキュメントと業界動向をもとに、ステップバイステップで整理しています。",
};

// ── MERMAID DIAGRAMS ──
const DIAG_1 = `flowchart TB
    subgraph Dev["開発者のワークフロー"]
        IDE["SonarQube for IDE<br/>(旧SonarLint)"]
        Agent["AIコーディングエージェント<br/>(Cursor / Claude Code / Copilot等)"]
    end
    subgraph CI["CI/CDパイプライン"]
        Scanner["SonarScanner"]
        GateCheck["Quality Gate 判定"]
    end
    subgraph Platform["Sonar 分析プラットフォーム"]
        Server["SonarQube Server<br/>(自己ホスト)"]
        Cloud["SonarQube Cloud<br/>(SaaS)"]
        MCP["SonarQube MCP Server"]
    end

    IDE -->|保存時にローカル解析| Platform
    Agent -->|自然言語で問い合わせ| MCP
    MCP --> Server
    MCP --> Cloud
    Scanner -->|解析結果を送信| Platform
    Server --> GateCheck
    Cloud --> GateCheck
    GateCheck -->|Pass / Fail| PR["プルリクエストへの<br/>デコレーション"]`;

const DIAG_3 = `flowchart LR
    A["コードをpush"] --> B{"New Code Definitionで<br/>新規/変更コードかを判定"}
    B -->|"新規・変更コード"| C["Quality Gateの主対象"]
    B -->|"既存コード(レガシー)"| D["技術的負債として記録<br/>(即時修正は必須ではない)"]
    C --> E{"新規コードの品質基準<br/>(カバレッジ・重複・格付け)を満たすか"}
    E -->|"Yes"| F["Quality Gate: Green<br/>マージ可"]
    E -->|"No"| G["Quality Gate: Red<br/>マージをブロック"]
    G --> H["開発者が自分の変更分を修正"]
    H --> B`;

const DIAG_4 = `flowchart LR
    subgraph Attributes["Clean Code属性（4分類）"]
        Consistent["Consistent<br/>一貫性"]
        Intentional["Intentional<br/>意図の明確さ"]
        Adaptable["Adaptable<br/>適応性"]
        Responsible["Responsible<br/>責任"]
    end
    subgraph Qualities["Software Qualities（3分類）"]
        Security["Security"]
        Reliability["Reliability"]
        Maintainability["Maintainability"]
    end

    Consistent --> Maintainability
    Intentional --> Reliability
    Intentional --> Security
    Adaptable --> Maintainability
    Adaptable --> Reliability
    Responsible --> Security
    Responsible --> Reliability`;

const DIAG_5 = `flowchart TB
    A["プルリクエスト作成 / コミットpush"] --> B["SonarScannerが解析実行"]
    B --> C{"新規コードの全条件を判定"}
    C -->|"カバレッジ不足"| F1["Fail: カバレッジ条件"]
    C -->|"新規Bug/脆弱性あり"| F2["Fail: Reliability/Security Rating"]
    C -->|"未レビューのHotspotあり"| F3["Fail: Hotspotレビュー率"]
    C -->|"全条件を満たす"| G["Quality Gate: Green"]
    F1 --> H["Quality Gate: Red"]
    F2 --> H
    F3 --> H
    G --> I["マージ可能<br/>(ブランチ保護ルールと連動)"]
    H --> J["マージブロック<br/>開発者が修正して再push"]
    J --> B`;

const DIAG_6 = `flowchart TB
    A["言語別デフォルト<br/>(Sonar way)"] --> B["組織共通のベースプロファイルを作成"]
    B --> C{"プロジェクト固有の<br/>調整が必要か"}
    C -->|"Yes"| D["子プロファイルを継承して作成<br/>(差分のみ管理)"]
    C -->|"No"| E["ベースプロファイルをそのまま割当"]
    D --> F["プロジェクトへ割当"]
    E --> F
    F --> G["解析実行 → False Positive率を定期観測"]
    G --> H{"特定ルールの<br/>誤検知が多発"}
    H -->|"Yes"| I["該当ルールを無効化 or<br/>除外パターンを追加"]
    H -->|"No"| J["現状維持"]
    I --> G`;

const DIAG_7 = `stateDiagram-v2
    direction LR
    [*] --> Open
    Open --> Accepted: Accept（後で対応と判断）
    Open --> FalsePositive: False Positiveと判定
    Open --> Fixed: コード修正がpushされ再解析で検知
    Accepted --> Open: 対応時期が来て再オープン
    FalsePositive --> Open: 実は真の問題だったと判明
    Fixed --> [*]
    Accepted --> [*]: 棚卸しで着手を決定するまで保持
    FalsePositive --> [*]`;

const DIAG_8 = `stateDiagram-v2
    [*] --> ToReview: 検出
    ToReview --> Acknowledged: 対応方針を検討中
    ToReview --> Safe: リスクなしと判断
    ToReview --> Fixed: 修正を適用
    Acknowledged --> Fixed: 修正完了
    Acknowledged --> Safe: 他の防御層で対応済みと確認
    Fixed --> [*]
    Safe --> [*]`;

const DIAG_10 = `flowchart LR
    A["開発者がPRを作成"] --> B["CI: SonarScanner実行"]
    B --> C["SonarQube Server/Cloudへ<br/>解析結果を送信"]
    C --> D{"Quality Gate判定"}
    D -->|"Green"| E["PRにGreenバッジ表示<br/>+ インラインコメント"]
    D -->|"Red"| F["PRにRedバッジ表示<br/>+ 修正必須のコメント"]
    E --> G["ブランチ保護ルールにより<br/>マージ許可"]
    F --> H["ブランチ保護ルールにより<br/>マージブロック"]
    H --> I["開発者が修正しPush"]
    I --> B`;

const DIAG_11 = `flowchart TB
    subgraph Loop["エージェントのコーディングループ"]
        Gen["AIエージェントがコード生成"]
        Vortex["Sonar Vortex<br/>生成前にコンテキスト/制約を付与<br/>生成中にリアルタイム検証"]
    end
    subgraph Verify["検証レイヤー(別メソドロジー)"]
        Agentic["Agentic Analysis<br/>(数秒でCI相当の解析)"]
        MCP["MCP Server<br/>(自然言語での問い合わせ)"]
    end
    subgraph PostGen["生成後の防護"]
        CIGate["CI: Quality Gate"]
        Remediation["SonarQube Remediation Agent<br/>(バックグラウンドで技術的負債を自動修正)"]
    end

    Gen --> Vortex
    Vortex --> Agentic
    Gen -->|"問い合わせ"| MCP
    MCP --> Agentic
    Agentic -->|"問題を検出したら生成側へフィードバック"| Gen
    Vortex --> CIGate
    CIGate -->|"見逃した既存負債"| Remediation
    Remediation -->|"修正PRを自動作成"| CIGate`;

const DIAG_13 = `flowchart TD
    Start["Issueやコードレビュー指摘に直面"] --> Q1{"このルールは<br/>プロジェクトに<br/>妥当なルールか"}
    Q1 -->|"妥当ではない<br/>(誤検知が構造的)"| A1["Quality Profileでルール自体を無効化<br/>個別Issueをその都度握りつぶさない"]
    Q1 -->|"妥当"| Q2{"今すぐ<br/>直せるか"}
    Q2 -->|"Yes"| A2["修正してpush<br/>(Clean as You Codeの実践)"]
    Q2 -->|"No（技術的負債として先送り）"| Q3{"リスクは<br/>ビジネス上<br/>許容範囲か"}
    Q3 -->|"Yes"| A3["Acceptedにして理由をコメント<br/>棚卸し対象として記録"]
    Q3 -->|"No"| A4["優先度を上げてバックログ化<br/>放置しない"]`;

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function SonarQubeGuidePage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <button
        type="button"
        className={styles.sidebarToggle}
        id="sidebarToggle"
        aria-label="メニューを開閉"
      >
        ☰
      </button>

      <aside className={styles.sidebar} id="sidebar">
        <div className={styles.sidebarBrand}>
          <span className={styles.sidebarBrandDot} />
          <span className={styles.sidebarBrandText}>SonarQube Code Review Guide</span>
        </div>
        <p className={styles.sidebarLabel}>目次</p>
        <nav className={styles.sidebarNav}>
          <a href="#1-sonarqubeの現在地2026年の全体像">1. SonarQubeの現在地：2026年の全体像</a>
          <a href="#2-エディション選定community-buildからdata-centerまで">
            2. エディション選定：Community BuildからData Centerまで
          </a>
          <a href="#3-clean-as-you-code新規コードにフォーカスする哲学">
            3. Clean as You Code：新規コードにフォーカスする哲学
          </a>
          <a href="#4-clean-code-taxonomyと3つのsoftware-qualities">
            4. Clean Code Taxonomyと3つのSoftware Qualities
          </a>
          <a href="#5-quality-gate設計のベストプラクティス">
            5. Quality Gate設計のベストプラクティス
          </a>
          <a href="#6-quality-profileとルールチューニング">
            6. Quality Profileとルールチューニング
          </a>
          <a href="#7-issueライフサイクル管理とトリアージ">
            7. Issueライフサイクル管理とトリアージ
          </a>
          <a href="#8-security-hotspotレビューワークフロー">
            8. Security Hotspotレビューワークフロー
          </a>
          <a href="#9-シフトレフトsonarqube-for-ideとローカル解析">
            9. シフトレフト：SonarQube for IDEとローカル解析
          </a>
          <a href="#10-cicdパイプライン統合とプルリクエストデコレーション">
            10. CI/CDパイプライン統合とプルリクエストデコレーション
          </a>
          <a href="#11-aiネイティブ時代のコードレビューacdcとsonar-vortex">
            11. AIネイティブ時代のコードレビュー：AC/DCとSonar Vortex
          </a>
          <a href="#12-他のaiレビューツールとの併用戦略">12. 他のAIレビューツールとの併用戦略</a>
          <a href="#13-よくあるアンチパターンと対策">13. よくあるアンチパターンと対策</a>
          <a href="#14-導入運用チェックリスト">14. 導入〜運用チェックリスト</a>
          <a href="#15-まとめ">15. まとめ</a>
          <a href="#16-参考文献出典">16. 参考文献・出典</a>
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.hero}>
          <span className={styles.heroEyebrow}>Best Practices Guide</span>
          <h1>
            SonarQubeコードレビュー実践ガイド
            <br />
            中級者〜上級者のためのベストプラクティス
          </h1>
          <p className={styles.heroSub}>
            Quality
            Gate設計からIssueトリアージ、CI/CD統合、そしてAC/DC時代のAIコーディングエージェント連携まで。SonarQube公式ドキュメントと業界動向をもとに、ステップバイステップで整理しています。
          </p>
        </div>

        <blockquote className={styles.callout}>
          <p>
            対象読者: SonarQubeを導入済み、または導入検討中で、Quality
            Gate設計・Issueトリアージ・CI/CD統合・AI時代のコードレビュー運用まで踏み込みたいエンジニア・テックリード・QAエンジニア向け。
            情報基準日:
            2026年8月2日時点のSonar公式ドキュメント（docs.sonarsource.com）および業界動向をもとに構成。バージョン名・機能名は執筆時点のものであり、Sonarの高頻度リリースにより変更される可能性がある点に留意してください。
          </p>
        </blockquote>

        <hr />

        <h2 id="1-sonarqubeの現在地2026年の全体像">1. SonarQubeの現在地：2026年の全体像</h2>
        <p>
          SonarQube（開発元:
          Sonar社）は2006年の登場以来、静的解析（SAST）とコード品質管理の業界標準的ポジションを維持してきたプラットフォームです。7,000万行規模のコードベースから個人開発まで、40以上の言語・フレームワーク・IaC技術に対応し、7,000,000人以上の開発者、400,000以上の組織で利用されています。
        </p>
        <p>
          2024年10月29日、Sonar社はプロダクトブランドを大きく整理しました。これは中級者以上のエンジニアが混乱しやすいポイントなので、最初に整理しておきます。
        </p>

        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>旧名称</th>
                <th>新名称（2026年時点）</th>
                <th>位置づけ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SonarQube（自己ホスト型）</td>
                <td>
                  <strong>SonarQube Server</strong>
                </td>
                <td>オンプレミス／プライベートクラウドで運用する本体</td>
              </tr>
              <tr>
                <td>SonarQube Community Edition</td>
                <td>
                  <strong>SonarQube Community Build</strong>
                </td>
                <td>無料・OSSビルド。毎月リリースされる独自のバージョニング体系</td>
              </tr>
              <tr>
                <td>SonarCloud</td>
                <td>
                  <strong>SonarQube Cloud</strong>
                </td>
                <td>Sonar社がホストするSaaS版</td>
              </tr>
              <tr>
                <td>SonarLint</td>
                <td>
                  <strong>SonarQube for IDE</strong>
                </td>
                <td>
                  VS Code、IntelliJ、Eclipse、Visual Studio、Cursor、Windsurf向けの無料IDE拡張
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          さらに2025年には、SonarQube ServerとSonarQube
          Cloudのバージョニングがカレンダーバージョニング（例: <code>2026.1</code>、
          <code>2026.2</code>
          ）に統一され、年1回のLong-Term Active（LTA）リリース（2026年は
          <code>2026.1</code>）を軸に運用する体制に移行しました。Community Buildは
          <code>YY.M.0.BuildNumber</code>
          形式で毎月リリースされ、LTAの概念を持たない点がServerとの大きな違いです。
        </p>
        <p>
          この章の要点を、開発者のワークフローとSonarの各コンポーネントがどう繋がるかという観点で図解します。
        </p>

        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAG_1} />
        </div>

        <p>
          ポイントは、SonarQube for IDEとMCP
          Serverがどちらも「同じルールセット・同じ解析エンジン」をローカルとCIの両方で共有していることです。IDEで指摘されなかった問題がCIで初めて出る、という状況を減らすことが、中級以上のチームがまず押さえるべき設計原則になります。
        </p>

        <hr />

        <h2 id="2-エディション選定community-buildからdata-centerまで">
          2. エディション選定：Community BuildからData Centerまで
        </h2>
        <p>
          「どのエディションを選ぶか」は、ブランチ解析・プルリクエストデコレーションを使うかどうかでほぼ決まります。Community
          Buildはメインブランチ解析のみに制限されており、フィーチャーブランチ運用が主流の2026年のチームには実用上の制約が大きい、という指摘が複数の実務者レビューで共通して挙がっています。
        </p>

        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>エディション</th>
                <th>ブランチ解析/PRデコレーション</th>
                <th>主な追加機能</th>
                <th>想定チーム規模</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SonarQube Community Build</td>
                <td>不可（メインブランチのみ）</td>
                <td>20言語以上、基本Quality Gate、CI/CD連携</td>
                <td>個人開発、小規模OSS</td>
              </tr>
              <tr>
                <td>SonarQube Server Developer Edition</td>
                <td>可</td>
                <td>ブランチ解析、PRデコレーション、34言語以上</td>
                <td>小〜中規模チーム</td>
              </tr>
              <tr>
                <td>SonarQube Server Enterprise Edition</td>
                <td>可</td>
                <td>テイント解析、ポートフォリオ管理、コンプライアンスレポート</td>
                <td>複数チーム・複数プロジェクトの大規模組織</td>
              </tr>
              <tr>
                <td>SonarQube Server Data Center Edition</td>
                <td>可</td>
                <td>高可用性、水平スケーリング、ゼロダウンタイムアップグレード</td>
                <td>ミッションクリティカルな大規模基盤</td>
              </tr>
              <tr>
                <td>SonarQube Cloud（Free/Team/Enterprise）</td>
                <td>Freeから可（5万行まで）</td>
                <td>インフラ管理不要、GitHub/GitLab/Bitbucket/Azure DevOps連携</td>
                <td>インフラ運用を持ちたくない全規模のチーム</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>実務上の判断基準は次の3つに集約されます。</p>
        <ul>
          <li>
            <strong>プルリクエストベースの開発フローを使うか</strong> → 使うなら最低でもDeveloper
            EditionかSonarQube Cloud（Free可）が必須ライン
          </li>
          <li>
            <strong>データ主権・エアギャップ要件があるか</strong> → あれば自己ホストのServer系一択
          </li>
          <li>
            <strong>コードベース規模とライセンス費用のバランス</strong> →
            自己ホストは行数(LOC)ベース課金、Cloudはより単純な階層課金
          </li>
        </ul>
        <p>
          なお、SonarQube Advanced Security（2025年提供開始）はEnterprise Edition／Enterprise
          Cloud向けのアドオンで、依存関係の脆弱性検出（SCA）、悪意あるパッケージ検出、ライセンスコンプライアンス、CycloneDX/SPDX形式でのSBOM生成をカバーします。単なるコード品質ツールから、サプライチェーンセキュリティまで含む「検証プラットフォーム」へと役割が広がっている点は、エディション選定時に加味すべきポイントです。
        </p>

        <hr />

        <h2 id="3-clean-as-you-code新規コードにフォーカスする哲学">
          3. Clean as You Code：新規コードにフォーカスする哲学
        </h2>
        <p>
          SonarQubeのコードレビュー運用を理解するうえで最重要のコンセプトが
          <strong>Clean as You Code</strong>
          です。これは「既存コード全体の品質を一度に引き上げる」のではなく、「今日書いている新規・変更コードの品質に責任を持つ」という考え方です。
        </p>
        <p>
          従来型の「プロジェクト全体の品質スコアで合否判定する」アプローチには、次のような課題がありました。
        </p>
        <ul>
          <li>
            数年分のレガシーコードの技術的負債を前に、Quality Gateが恒久的に赤のまま形骸化する
          </li>
          <li>新しく書いたコードが高品質でも、既存コードの負債に埋もれて評価されない</li>
          <li>「誰が悪いのか」が不明確になり、チームの当事者意識が薄れる</li>
        </ul>
        <p>
          Clean as You Codeでは、<strong>New Code Definition（新規コード定義）</strong>
          という基準点を設定し、その基準点以降に追加・変更された行だけをQuality
          Gateの主対象にします。New Code Definitionはグローバル・プロジェクト単位に加え、Developer
          Edition以上ではブランチ単位でも設定可能です。代表的な定義方法は以下の通りです。
        </p>
        <ul>
          <li>
            <strong>Previous version</strong>
            ：直近リリースバージョンからの差分
          </li>
          <li>
            <strong>Number of days</strong>：指定日数（例: 30日）以内の変更
          </li>
          <li>
            <strong>Reference branch</strong>：指定ブランチ（通常は
            <code>main</code>
            ）との差分。プルリクエスト運用ではこれが事実上の標準
          </li>
        </ul>
        <p>
          新規コードで問題が発生した場合、SonarQubeはその問題を自動的に変更を加えた開発者にアサインします。これにより「自分が書いたコードの品質に自分で責任を持つ」という文化が、ツールのワークフローレベルで強制されます。
        </p>

        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAG_3} />
        </div>

        <p>
          Clean as You Codeの潜在的な弱点として、公式ドキュメントも「厳しすぎるQuality
          Gateの副作用」に言及しています。新規コードの基準を過度に厳格にすると、小さな修正のたびに無関係な既存コードのリファクタリングを強いられ、開発速度を落とすリスクがあります。運用初期は組み込みの{" "}
          <code>Sonar way</code> Quality
          Gateから始め、チームの実態に合わせて段階的にカスタマイズすることが推奨されます。
        </p>

        <hr />

        <h2 id="4-clean-code-taxonomyと3つのsoftware-qualities">
          4. Clean Code Taxonomyと3つのSoftware Qualities
        </h2>
        <p>
          SonarQubeは2023年以降、旧来の「Bug / Vulnerability / Code
          Smell」という3分類の課題モデルから、<strong>Clean Code Taxonomy</strong>
          という、より構造化された分類体系へ段階的に移行しています。中級者以上が押さえておくべきは、この分類が「コードの属性（なぜ問題か）」と「ソフトウェアの品質特性（何に影響するか）」を明確に分けている点です。
        </p>

        <p>
          <strong>Clean Code属性（4分類）</strong>
          は、コードがクリーンであるための特性です。
        </p>

        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>属性</th>
                <th>意味</th>
                <th>具体例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Consistent（一貫性）</td>
                <td>フォーマット・命名規則・言語慣習が統一されている</td>
                <td>インデント、命名規則、言語イディオムの遵守</td>
              </tr>
              <tr>
                <td>Intentional（意図の明確さ）</td>
                <td>コードが意図通りに、明確・論理的・完全・効率的に動く</td>
                <td>冗長なロジックの排除、明確な制御フロー</td>
              </tr>
              <tr>
                <td>Adaptable（適応性）</td>
                <td>単一責任・重複排除・モジュール化・テストがされている</td>
                <td>高凝集な関数、重複コードの排除、十分なテストカバレッジ</td>
              </tr>
              <tr>
                <td>Responsible（責任）</td>
                <td>ライセンス・機密情報・差別的表現に配慮している</td>
                <td>シークレットのハードコード禁止、ライセンス遵守</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          これらの属性に問題があると、最終的に <strong>Software Qualities（3つの品質特性）</strong>{" "}
          に影響します。
        </p>

        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>Software Quality</th>
                <th>意味</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Security</td>
                <td>不正アクセス・利用・破壊からの保護</td>
              </tr>
              <tr>
                <td>Reliability</td>
                <td>定められた条件下で性能を維持し続ける能力</td>
              </tr>
              <tr>
                <td>Maintainability</td>
                <td>修復・改善・理解のしやすさ</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          各Issueには、この4属性×3品質特性のマッピングに基づき、影響度が{" "}
          <strong>Low / Medium / High</strong>{" "}
          の3段階（旧来のBlocker/Critical/Major/Minor/Infoという5段階の重要度モデルに代わるもの）で表示されます。プロジェクト全体・新規コードそれぞれについてのReliability
          Rating・Security Rating・Maintainability RatingはA〜Eの格付けとして引き続きQuality
          Gateの条件に利用されます。
        </p>

        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAG_4} />
        </div>

        <p>
          実務上のインパクトは、レビューコメントを書くときの「言葉」が変わることです。「これはCode
          Smellです」ではなく「このコードはAdaptable属性を損ねており、Maintainabilityに影響します」という説明のほうが、レビュー相手（特にジュニアエンジニア）への納得感が高い、というのが多くの実務者の共通見解です。
        </p>

        <hr />

        <h2 id="5-quality-gate設計のベストプラクティス">5. Quality Gate設計のベストプラクティス</h2>
        <p>
          Quality
          Gateは「このプロジェクトはリリース可能か」という一つの問いに答えるための、条件のセットです。組み込みの{" "}
          <code>Sonar way</code> Quality
          Gateは、SonarSourceによって提供・維持される読み取り専用のゲートで、Clean as You
          Codeを体現するベストプラクティスとして機能します。
        </p>

        <p>
          <strong>Sonar wayが新規コードに設定する代表的な条件例:</strong>
        </p>

        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>指標</th>
                <th>推奨しきい値の例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>新規コードのカバレッジ</td>
                <td>80%以上</td>
              </tr>
              <tr>
                <td>新規コードの重複行率</td>
                <td>3%未満</td>
              </tr>
              <tr>
                <td>新規コードのMaintainability Rating</td>
                <td>A</td>
              </tr>
              <tr>
                <td>新規コードのReliability Rating</td>
                <td>A</td>
              </tr>
              <tr>
                <td>新規コードのSecurity Rating</td>
                <td>A</td>
              </tr>
              <tr>
                <td>新規コードのSecurity Hotspotレビュー率</td>
                <td>100%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>カスタムQuality Gateを設計する際のベストプラクティスは次の通りです。</p>
        <ul>
          <li>
            <strong>新規コード条件を中心に据える</strong>
            ：全体コードに対する条件を追加することは、公式ドキュメントでも非推奨とされています。新規コードにフォーカスしたほうが、レガシーコードの重みに引きずられずレビューの摩擦を最小化できます。
          </li>
          <li>
            <strong>プロジェクトの性質ごとにゲートを分ける</strong>
            ：Webアプリとバッチ処理、あるいは言語が異なるプロジェクト間でカバレッジ基準を同一にする必要はありません。
          </li>
          <li>
            <strong>プルリクエスト解析とデコレーションを組み合わせる</strong>
            ：マージ前にQuality
            Gateの結果をSonarQubeのUIとDevOpsプラットフォーム（GitHub/GitLab/Azure
            DevOps）の両方で可視化します。
          </li>
          <li>
            <strong>段階導入</strong>
            ：既存の大規模レガシープロジェクトにいきなり厳格なゲートを適用すると形骸化・回避行動（無視する文化）を招きます。まずは「新規コードのみ」「重大度Highのみ」といった限定的な条件から始め、チームの成熟度に応じて厳格化するのが現実的です。
          </li>
        </ul>

        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAG_5} />
        </div>

        <hr />

        <h2 id="6-quality-profileとルールチューニング">6. Quality Profileとルールチューニング</h2>
        <p>
          Quality
          Profileは、言語ごとに「どのルールを有効化するか」「重要度をどう設定するか」を定義する設定セットです。SonarQubeは6,500以上の決定論的ルールを提供しており、これを無調整のまま大規模プロジェクトに適用すると、初回スキャンだけで数千件のIssueが検出されることも珍しくありません。
        </p>

        <p>
          <strong>ルールチューニングの実践ステップ:</strong>
        </p>
        <ol>
          <li>
            <strong>
              組み込みの言語別デフォルトプロファイル（例: <code>Sonar way</code>
              ）から開始する
            </strong>
            ：ゼロから設計するのではなく、SonarSourceが継続的にメンテナンスするデフォルトを土台にする
          </li>
          <li>
            <strong>プロジェクトの技術スタックに合わせてカスタムプロファイルを作成する</strong>
            ：フレームワーク固有の警告（例:
            特定のテストフレームワークでは誤検知になりやすいルール）を無効化する
          </li>
          <li>
            <strong>誤検知率の高いルールを可視化する</strong>：False
            Positiveとしてマークされた件数が多いルールは、そのルール自体がプロジェクトに適合していないシグナルです。ルールを無効化するか、対象スコープ（除外パターン）を見直します
          </li>
          <li>
            <strong>重要度（Impact）のカスタマイズは慎重に行う</strong>
            ：デフォルトの重要度づけはSonarSourceの分析に基づいているため、安易な引き下げは品質基準の空洞化を招きます
          </li>
          <li>
            <strong>プロファイルの継承構造を活用する</strong>
            ：組織共通のベースプロファイルを作り、プロジェクトごとの差分だけを子プロファイルで管理すると、ルール変更の伝播が容易になります
          </li>
        </ol>

        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAG_6} />
        </div>

        <hr />

        <h2 id="7-issueライフサイクル管理とトリアージ">7. Issueライフサイクル管理とトリアージ</h2>
        <p>
          検出されたIssueをどう扱うかは、チームのコードレビュー文化そのものを反映します。SonarQubeのIssueステータスモデルは近年整理され、
          <code>Confirmed</code>（確認済み）や<code>Resolve as Fixed</code>
          （手動での修正済みマーク）といった旧アクションは非推奨となり、以下のシンプルなモデルに統一されています。
        </p>

        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>ステータス</th>
                <th>意味</th>
                <th>品質レポート・格付けへの影響</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Open</td>
                <td>デフォルトの初期状態</td>
                <td>集計対象</td>
              </tr>
              <tr>
                <td>Accepted</td>
                <td>「妥当な指摘だが今は直さない」と判断</td>
                <td>集計から除外（技術的負債として記録は残る）</td>
              </tr>
              <tr>
                <td>False Positive</td>
                <td>「解析結果自体が誤り」と判断</td>
                <td>集計から完全に除外</td>
              </tr>
              <tr>
                <td>Fixed</td>
                <td>後続の解析でコードが修正されたことを自動検知</td>
                <td>30日後にパージ</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          <strong>トリアージ運用のベストプラクティス:</strong>
        </p>
        <ul>
          <li>
            <strong>定期的なトリアージの時間を確保する</strong>
            ：スプリントや週次のタイミングで、新規に発生したIssueを見直す時間をルーティン化する
          </li>
          <li>
            <strong>False Positiveは「権限を持つ人」が判断する</strong>
            ：SonarQubeではFalse Positiveへの変更に<code>Administer Issues</code>
            権限が必要です。誰でも自己判断で握りつぶせない設計になっている点を、チーム運用でも尊重するべきです
          </li>
          <li>
            <strong>特定ルールでFalse Positiveが頻発する場合はプロファイル側を見直す</strong>
            ：個別のIssueを握りつぶすのではなく、ルール自体が自分たちのプロジェクトに合っていないというシグナルとして扱う
          </li>
          <li>
            <strong>Acceptedは「先送りの言い訳」にしない</strong>
            ：技術的負債として可視化されたままになるため、定期的にAccepted一覧を棚卸しし、本当に着手しないままでよいかを再確認する
          </li>
        </ul>

        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAG_7} />
        </div>

        <hr />

        <h2 id="8-security-hotspotレビューワークフロー">8. Security Hotspotレビューワークフロー</h2>
        <p>
          Security
          HotspotはVulnerability（脆弱性）とは異なる概念です。Vulnerabilityは「ほぼ確実に問題があるコード」を指すのに対し、Security
          Hotspotは「セキュリティ上注意が必要だが、実際にリスクになるかは文脈次第のコード」を指します。多層防御（Defense
          in
          Depth）の考え方に近く、「他の防御層が既にあるため実質的に安全」というケースも多く含まれます。
        </p>
        <p>Security Hotspotのレビューは次のステータスで管理されます。</p>

        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>ステータス</th>
                <th>意味</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>To Review</td>
                <td>検出直後のデフォルト状態。レビューが必要</td>
              </tr>
              <tr>
                <td>Acknowledged</td>
                <td>レビュー済みだが対応方針・修正が保留中</td>
              </tr>
              <tr>
                <td>Fixed</td>
                <td>レビューの結果、修正を適用した</td>
              </tr>
              <tr>
                <td>Safe</td>
                <td>レビューの結果、他の防御層により対応不要と判断した</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          レビュー時にSonarQubeが提示する3つの観点（What's the risk / Are you at risk / How can you
          fix it）に沿って判断するのが標準的な手順です。
        </p>

        <ol>
          <li>
            <strong>What's the risk?</strong> タブでそのHotspotがなぜ検出されたかを理解する
          </li>
          <li>
            <strong>Are you at risk?</strong> タブの「Ask Yourself
            Whether」の質問リストに沿って、自分たちのコンテキストで本当にリスクがあるかを判定する
          </li>
          <li>
            リスクがあると判断した場合、<strong>How can you fix it?</strong>{" "}
            タブの推奨されるセキュアコーディングプラクティスに沿って修正する
          </li>
          <li>最終的にFixed（修正済み）またはSafe（対応不要）のステータスを設定する</li>
        </ol>

        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAG_8} />
        </div>

        <p>
          Quality Gateの条件に「新規コードのSecurity Hotspotレビュー率100%」を含めるのがSonar
          wayのデフォルトです。これにより、「未レビューのHotspotを放置したままリリースする」という事態を構造的に防止できます。レビュー優先度は高い順に並べ替えられるため、まずは高優先度のHotspotから着手するのが定石です。
        </p>

        <hr />

        <h2 id="9-シフトレフトsonarqube-for-ideとローカル解析">
          9. シフトレフト：SonarQube for IDEとローカル解析
        </h2>
        <p>
          CI/CDでの検出だけに頼ると、フィードバックループが遅く、開発者はコンテキストスイッチのコストを払うことになります。
          <strong>SonarQube for IDE</strong>
          （旧SonarLint）は、コードを書いている最中にローカルでルールを適用し、CIに到達する前に問題を発見できるようにする無料のIDE拡張です。
        </p>

        <p>シフトレフトを機能させる実務上のポイント:</p>
        <ul>
          <li>
            <strong>Connected Modeを使う</strong>：SonarQube for IDEをSonarQube
            Server／Cloudに接続すると、サーバー側のQuality
            Profile設定がIDEにも同期され、「IDEでは指摘されなかったのにCIで落ちた」というギャップを防げます
          </li>
          <li>
            <strong>AI CodeFixと組み合わせる</strong>
            ：IDE上で検出された問題に対し、LLMによる修正提案（AI
            CodeFix、後述）をワンクリックで適用できるため、修正の心理的ハードルが下がります
          </li>
          <li>
            <strong>エディタ非依存の拡張性</strong>：Eclipse、Visual Studio、VS Code、IntelliJ
            IDEAに加え、Cursor・Windsurfなど「AIネイティブ」なエディタにも対応が広がっている点は、AIエージェント併用時代のシフトレフト戦略として重要です
          </li>
        </ul>

        <hr />

        <h2 id="10-cicdパイプライン統合とプルリクエストデコレーション">
          10. CI/CDパイプライン統合とプルリクエストデコレーション
        </h2>
        <p>
          プルリクエストデコレーションは、SonarQubeの解析結果をレビュープロセスに組み込む上で最も投資対効果の高い設定の一つです。マージ前にインラインコメントとQuality
          Gateのステータスチェックが表示されるため、「後から見つかる」から「マージ前に防ぐ」へと運用が変わります。
        </p>
        <p>
          以下はGitHub Actionsを使った代表的な構成例です（
          <code>sonarqube-scan-action</code>
          v5系以降の構成に準拠）。
        </p>

        <div className={styles.codeBlock}>
          <div className={styles.codeLine}>name: SonarQube Analysis</div>
          <div className={styles.codeLine} />
          <div className={styles.codeLine}>on:</div>
          <div className={styles.codeLine}> push:</div>
          <div className={styles.codeLine}> branches: [main]</div>
          <div className={styles.codeLine}> pull_request:</div>
          <div className={styles.codeLine}>{"    types: [opened, synchronize, reopened]"}</div>
          <div className={styles.codeLine} />
          <div className={styles.codeLine}>jobs:</div>
          <div className={styles.codeLine}> sonarqube:</div>
          <div className={styles.codeLine}> runs-on: ubuntu-latest</div>
          <div className={styles.codeLine}> steps:</div>
          <div className={styles.codeLine}>{"      - uses: actions/checkout@v4"}</div>
          <div className={styles.codeLine}> with:</div>
          <div className={styles.codeLine}>
            {"          fetch-depth: 0   # blame情報を正確にするため全履歴を取得"}
          </div>
          <div className={styles.codeLine} />
          <div className={styles.codeLine}>{"      - name: SonarQube Scan"}</div>
          <div className={styles.codeLine}>
            {"        uses: SonarSource/sonarqube-scan-action@v5"}
          </div>
          <div className={styles.codeLine}> env:</div>
          <div className={styles.codeLine}>
            {"          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}"}
          </div>
          <div className={styles.codeLine}>
            {"          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}"}
          </div>
          <div className={styles.codeLine} />
          <div className={styles.codeLine}>{"      - name: SonarQube Quality Gate check"}</div>
          <div className={styles.codeLine}>
            {"        uses: SonarSource/sonarqube-quality-gate-action@master"}
          </div>
          <div className={styles.codeLine}> timeout-minutes: 5</div>
          <div className={styles.codeLine}> env:</div>
          <div className={styles.codeLine}>
            {"          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}"}
          </div>
        </div>

        <p>設定時のベストプラクティス:</p>
        <ul>
          <li>
            <strong>
              <code>fetch-depth: 0</code>を必ず設定する
            </strong>
            ：浅いクローンのままだとSCM
            blame情報（誰がどの行を書いたか）が不正確になり、Issueの自動アサインが機能しません
          </li>
          <li>
            <strong>
              <code>sonar.qualitygate.wait=true</code>は乱用しない
            </strong>
            ：このパラメータをつけるとスキャナーがQuality
            Gate判定を待ってから終了するためワークフロー時間が伸びます。デプロイをブロックする用途以外では、プルリクエストデコレーション（自動で表示される）に任せるのが推奨です
          </li>
          <li>
            <strong>Quality Gate Check Actionを別ステップに分離する</strong>
            ：スキャン自体の成否とQuality
            Gateの合否を分けることで、失敗原因の切り分けが容易になります
          </li>
          <li>
            <strong>モノレポの場合はパスフィルタで対象を絞る</strong>
            ：変更のあったサービスのみをスキャンすることで、CI時間とライセンス消費（LOCベース課金）の両方を抑制できます
          </li>
          <li>
            <strong>ブランチ保護ルールと連動させる</strong>：Quality
            Gateのステータスチェックを必須チェックに指定し、Redのままではマージできないようにする
          </li>
        </ul>

        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAG_10} />
        </div>

        <hr />

        <h2 id="11-aiネイティブ時代のコードレビューacdcとsonar-vortex">
          11. AIネイティブ時代のコードレビュー：AC/DCとSonar Vortex
        </h2>
        <p>
          2026年のSonarは、単なる静的解析ツールから「AIコーディングエージェントの信頼レイヤー」へと明確にポジションを移しています。Sonarはこの一連の機能群を
          <strong>Agent Centric Development Cycle（AC/DC）</strong>
          というフレームワークで整理しています。中級者以上のエンジニアが押さえておくべき主要コンポーネントは以下の通りです。
        </p>

        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>機能</th>
                <th>概要</th>
                <th>提供段階（2026年時点）</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AI CodeFix</td>
                <td>検出されたIssueに対し、LLMによる修正案を自動生成</td>
                <td>
                  GA（一般提供）。Enterprise/Data Center、SonarQube CloudのTeam/Enterprise向け
                </td>
              </tr>
              <tr>
                <td>AI Code Assurance</td>
                <td>
                  AI生成コードを含むプロジェクトにラベル付けし、より厳格なQuality Gateを自動適用
                </td>
                <td>提供中</td>
              </tr>
              <tr>
                <td>SonarQube MCP Server</td>
                <td>
                  AIコーディングエージェント（Cursor、Claude
                  Code等）がSonarQubeに自然言語で問い合わせできるようにする無料の統合レイヤー
                </td>
                <td>GA</td>
              </tr>
              <tr>
                <td>Agentic Analysis</td>
                <td>
                  エージェントがコード生成の最中に、CIと同等精度の解析を数秒で受けられる仕組み
                </td>
                <td>Beta（SonarQube CloudのTeam/Enterprise向け）</td>
              </tr>
              <tr>
                <td>Sonar Vortex</td>
                <td>
                  エージェントのコーディングループの内側で、コード生成前にコンテキストと制約を与え、生成過程をリアルタイム検証する新製品
                </td>
                <td>提供開始</td>
              </tr>
              <tr>
                <td>SonarQube Remediation Agent</td>
                <td>バックグラウンドで自律的に技術的負債を検出・修正するエージェント</td>
                <td>GA</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          このアーキテクチャの核心は、著名なエンジニアリングブロガーであるAddy Osmani氏（Google
          Chrome関連のエンジニアリングリーダーとして知られる）が指摘する
          <strong>「maker-checker split（作る側と検証する側を分離する）」</strong>
          という原則です。同氏は2026年6月、「無人で回り続けるループは、無人でミスを重ねるループでもある」という趣旨の指摘をしており、Sonarはこれを引用する形で、コードを生成するモデルと、それを検証する仕組みを意図的に分離する設計思想（同社はこれを「ゼロトラスト」なコード検証と呼んでいます）を採用しています。
        </p>

        <p>
          Addy
          Osmani氏は自身のブログでも、2026年に入り上級エンジニアの3割以上が「主にAI生成コードを出荷している」と報告している調査に触れつつ、AIはロジック・セキュリティ・エッジケースの実装で誤りを起こしやすいと指摘しています。同氏の要点は次の3つに整理できます。
        </p>

        <ul>
          <li>個人開発では、テストスイートを安全網としながら高速に検証するワークフローが現実的</li>
          <li>
            チーム開発では、複数人が関わる分コードの寿命とミスのコストが上がるため、人間によるレビューは「AIが見落とすもの」（ロードマップとの整合性、組織的な意思決定）に焦点を移しつつ、なくならない
          </li>
          <li>
            いずれにせよ「自分の目で動作を確認していないコードは、動いているとは言えない」という原則はAI時代でも変わらない
          </li>
        </ul>

        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAG_11} />
        </div>

        <p>
          このAC/DCモデルの実務的な意味は、「コードレビューはCIの1ステップではなく、エージェントのコーディングループ全体に埋め込まれたプロセスになる」という点です。中級以上のチームは、AI
          CodeFixやMCP
          Serverの導入を「便利機能の追加」ではなく、「検証責任をどこに置くか」というアーキテクチャ上の意思決定として捉える必要があります。
        </p>

        <hr />

        <h2 id="12-他のaiレビューツールとの併用戦略">12. 他のAIレビューツールとの併用戦略</h2>
        <p>
          2026年の実務者コミュニティでは、SonarQubeを「唯一のレビューツール」として使うのではなく、
          <strong>
            決定論的な静的解析（SonarQube）とコンテキスト重視のAIレビュー（CodeRabbit、GitHub
            Copilot Code Reviewなど）を併用する
          </strong>
          運用が主流になりつつあります。これは複数の独立レビュー記事で共通して指摘されているパターンです。
        </p>

        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>観点</th>
                <th>SonarQubeが得意</th>
                <th>AIネイティブレビューツールが得意</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>判定の一貫性・再現性</td>
                <td>◎（決定論的ルールベース）</td>
                <td>△（LLMの応答は文脈依存でばらつく）</td>
              </tr>
              <tr>
                <td>監査可能性・コンプライアンス報告</td>
                <td>◎</td>
                <td>△</td>
              </tr>
              <tr>
                <td>ビジネスロジック・要件との整合性チェック</td>
                <td>△</td>
                <td>◎（自然言語での文脈理解）</td>
              </tr>
              <tr>
                <td>新規パターン・言語イディオムの機微な指摘</td>
                <td>△</td>
                <td>◎</td>
              </tr>
              <tr>
                <td>セットアップ・運用コスト</td>
                <td>自己ホストは重め、Cloudは軽量</td>
                <td>概ね軽量</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>併用時の実務パターンとしては、次のような役割分担が現実的です。</p>

        <ol>
          <li>
            <strong>SonarQube（+ Quality Gate）を必須のマージゲートとして固定する</strong>
            ：決定論的でぶれない基準は「絶対に守るライン」として機能させる
          </li>
          <li>
            <strong>AIレビューツールをコンテキストレビューの補助として並走させる</strong>
            ：ビジネスロジックの妥当性やレビューコメントの自然言語での要約などは、AI側の得意領域に任せる
          </li>
          <li>
            <strong>重複ノイズを避けるため、どちらが何を指摘する役割かをチームで明文化する</strong>
            ：両方が同じ種類の指摘（フォーマットなど）をコメントすると、レビュー体験がかえって悪化します
          </li>
        </ol>

        <p>
          SonarQube自身もこの流れを踏まえ、SonarQube MCP Serverを通じてCursorやClaude
          Code、Copilotなど外部のAIコーディングツールと直接連携する方向に舵を切っており、「競合するツール」というより「検証レイヤーとして下支えするツール」という位置づけを強めています。
        </p>

        <hr />

        <h2 id="13-よくあるアンチパターンと対策">13. よくあるアンチパターンと対策</h2>
        <p>中級〜上級チームでも陥りやすい代表的なアンチパターンを、判断フローの形で整理します。</p>

        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAG_13} />
        </div>

        <p className={styles.warningGridLabel}>特に注意すべきアンチパターン</p>
        <div className={styles.warningGrid}>
          <div className={styles.warningCard}>
            <span className={styles.warningIcon}>⚠</span>
            <div className={styles.warningBody}>
              <strong>既存コード全体にQuality Gate条件を適用する</strong>
              <p>
                Clean as You
                Codeの思想に反し、レガシー資産の重みで新規コードの評価まで歪める。新規コード条件を中心に据える
              </p>
            </div>
          </div>
          <div className={styles.warningCard}>
            <span className={styles.warningIcon}>⚠</span>
            <div className={styles.warningBody}>
              <strong>False Positiveの濫用</strong>
              <p>
                本当は妥当な指摘を「面倒だから」という理由でFalse
                Positiveにする運用が常態化すると、指標が形骸化する。権限管理とコメント必須化で歯止めをかける
              </p>
            </div>
          </div>
          <div className={styles.warningCard}>
            <span className={styles.warningIcon}>⚠</span>
            <div className={styles.warningBody}>
              <strong>Quality Gateを一度作ったら放置する</strong>
              <p>
                プロジェクトの成熟度や技術スタックの変化に合わせて定期的に見直さないと、厳しすぎる／緩すぎるゲートのまま固定化する
              </p>
            </div>
          </div>
          <div className={styles.warningCard}>
            <span className={styles.warningIcon}>⚠</span>
            <div className={styles.warningBody}>
              <strong>CI側だけに解析を任せてIDE統合を怠る</strong>
              <p>
                フィードバックが遅く、修正コストが跳ね上がる。シフトレフトを組織のデフォルトにする
              </p>
            </div>
          </div>
          <div className={styles.warningCard}>
            <span className={styles.warningIcon}>⚠</span>
            <div className={styles.warningBody}>
              <strong>AIレビューツールとの役割分担を決めないまま両方導入する</strong>
              <p>同じ種類の指摘が重複し、レビューのノイズが増えて開発者の信頼を失う</p>
            </div>
          </div>
          <div className={styles.warningCard}>
            <span className={styles.warningIcon}>⚠</span>
            <div className={styles.warningBody}>
              <strong>Security Hotspotを「Issueより優先度が低い」と誤解して放置する</strong>
              <p>レビュー率100%をQuality Gate条件に含めることで、構造的に防止する</p>
            </div>
          </div>
        </div>

        <hr />

        <h2 id="14-導入運用チェックリスト">14. 導入〜運用チェックリスト</h2>
        <Checklist />

        <hr />

        <h2 id="15-まとめ">15. まとめ</h2>
        <p>
          SonarQubeを使ったコードレビューのベストプラクティスは、突き詰めると次の3つの原則に集約されます。
        </p>

        <div className={styles.principleGrid}>
          <div className={styles.principleCard}>
            <span className={styles.principleNum}>1</span>
            <div className={styles.principleBody}>
              <strong>新規コードにフォーカスする</strong>
              <p>
                （Clean as You
                Code）ことで、レガシー資産の重みに埋もれず、開発者一人ひとりの当事者意識を維持する
              </p>
            </div>
          </div>
          <div className={styles.principleCard}>
            <span className={styles.principleNum}>2</span>
            <div className={styles.principleBody}>
              <strong>
                決定論的な解析を「絶対に守るライン」、AIレビューを「文脈理解の補助」として役割分担する
              </strong>
              <p>ことで、監査可能性と柔軟性を両立する</p>
            </div>
          </div>
          <div className={styles.principleCard}>
            <span className={styles.principleNum}>3</span>
            <div className={styles.principleBody}>
              <strong>
                レビューをCIの1ステップに閉じ込めず、IDEでのシフトレフトからAIエージェントのコーディングループの内側まで、開発フロー全体に埋め込む
              </strong>
            </div>
          </div>
        </div>

        <p className={styles.closingStatement}>
          2026年のSonarQubeは、AC/DC（Agent Centric Development Cycle）というフレームワークの下でAI
          CodeFix、Agentic Analysis、Sonar Vortex、Remediation
          Agentといった機能群を急速に拡張しており、「静的解析ツール」から「AI生成コードを含むあらゆるコードの検証プラットフォーム」への転換の途上にあります。ツールの機能を追いかけるだけでなく、Clean
          as You CodeとClean Code
          Taxonomyという不変の設計思想を理解しておくことが、この変化の速い領域で判断を誤らないための土台になります。
        </p>

        <hr />

        <h2 id="16-参考文献出典">16. 参考文献・出典</h2>
        <div className={styles.refGrid}>
          <div className={styles.refCard}>
            <h3>公式ドキュメント（docs.sonarsource.com）</h3>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                Sonar Documentation トップページ{" "}
                <Ext href="https://docs.sonarsource.com/">https://docs.sonarsource.com/</Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                Clean as You Code（SonarQube Server 10.5）{" "}
                <Ext href="https://docs.sonarsource.com/sonarqube-server/10.5/user-guide/clean-as-you-code">
                  https://docs.sonarsource.com/sonarqube-server/10.5/user-guide/clean-as-you-code
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                Clean Code definition（SonarQube Server 10.4）{" "}
                <Ext href="https://docs.sonarsource.com/sonarqube-server/10.4/user-guide/clean-code/definition">
                  https://docs.sonarsource.com/sonarqube-server/10.4/user-guide/clean-code/definition
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                Clean Code benefits: the software qualities（SonarQube Server 10.8）{" "}
                <Ext href="https://docs.sonarsource.com/sonarqube-server/10.8/core-concepts/clean-code/software-qualities">
                  https://docs.sonarsource.com/sonarqube-server/10.8/core-concepts/clean-code/software-qualities
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                Quality gates（SonarQube Server 8.9）{" "}
                <Ext href="https://docs.sonarsource.com/sonarqube-server/8.9/user-guide/quality-gates/">
                  https://docs.sonarsource.com/sonarqube-server/8.9/user-guide/quality-gates/
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                Managing Security Hotspots（SonarQube Server）{" "}
                <Ext href="https://docs.sonarsource.com/sonarqube-server/user-guide/security-hotspots">
                  https://docs.sonarsource.com/sonarqube-server/user-guide/security-hotspots
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                Reviewing security hotspots（SonarQube Cloud）{" "}
                <Ext href="https://docs.sonarsource.com/sonarqube-cloud/managing-your-projects/issues/reviewing-security-hotspots">
                  https://docs.sonarsource.com/sonarqube-cloud/managing-your-projects/issues/reviewing-security-hotspots
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                Editing issues（SonarQube Server 10.8）{" "}
                <Ext href="https://docs.sonarsource.com/sonarqube-server/10.8/user-guide/issues/managing">
                  https://docs.sonarsource.com/sonarqube-server/10.8/user-guide/issues/managing
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                Issue management solution（SonarQube Cloud）{" "}
                <Ext href="https://docs.sonarsource.com/sonarqube-cloud/managing-your-projects/issues/solution-overview">
                  https://docs.sonarsource.com/sonarqube-cloud/managing-your-projects/issues/solution-overview
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                AI Code Assurance（AC/DC）{" "}
                <Ext href="https://docs.sonarsource.com/agent-centric-development-cycle/ai-code-standards/ai-code-assurance">
                  https://docs.sonarsource.com/agent-centric-development-cycle/ai-code-standards/ai-code-assurance
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                AI CodeFix（SonarQube Server）{" "}
                <Ext href="https://docs.sonarsource.com/sonarqube-server/ai-capabilities/ai-codefix">
                  https://docs.sonarsource.com/sonarqube-server/ai-capabilities/ai-codefix
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                Agentic Analysis（AC/DC）{" "}
                <Ext href="https://docs.sonarsource.com/agent-centric-development-cycle/features/agentic-analysis">
                  https://docs.sonarsource.com/agent-centric-development-cycle/features/agentic-analysis
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                GitHub Actions連携（SonarQube Server）{" "}
                <Ext href="https://docs.sonarsource.com/sonarqube-server/analyzing-source-code/ci-integration/github-actions">
                  https://docs.sonarsource.com/sonarqube-server/analyzing-source-code/ci-integration/github-actions
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                GitHub Actions連携（SonarQube Cloud）{" "}
                <Ext href="https://docs.sonarsource.com/sonarqube-cloud/analyzing-source-code/ci-based-analysis/github-actions-for-sonarcloud">
                  https://docs.sonarsource.com/sonarqube-cloud/analyzing-source-code/ci-based-analysis/github-actions-for-sonarcloud
                </Ext>
              </span>
            </div>
          </div>

          <div className={styles.refCard}>
            <h3>Sonar社公式ブログ・プレスリリース</h3>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                Sonar Streamlines Product Naming（ブランド統合の発表, 2024年10月）{" "}
                <Ext href="https://www.sonarsource.com/company/press-releases/sonar-streamlines-product-naming-to-reflect-core-mission-of-code-quality-and-security/">
                  https://www.sonarsource.com/company/press-releases/sonar-streamlines-product-naming-to-reflect-core-mission-of-code-quality-and-security/
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                Announcing SonarQube MCP Server{" "}
                <Ext href="https://www.sonarsource.com/blog/announcing-sonarqube-mcp-server/">
                  https://www.sonarsource.com/blog/announcing-sonarqube-mcp-server/
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                MCP Server製品ページ{" "}
                <Ext href="https://www.sonarsource.com/products/sonarqube/mcp-server/">
                  https://www.sonarsource.com/products/sonarqube/mcp-server/
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                Introducing Sonar Vortex and the SonarQube Remediation Agent（Addy
                Osmani氏の言及を含む, 2026年6月）{" "}
                <Ext href="https://www.sonarsource.com/blog/introducing-sonar-vortex/">
                  https://www.sonarsource.com/blog/introducing-sonar-vortex/
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                What is Code Quality?（Clean Code Taxonomyの解説）{" "}
                <Ext href="https://www.sonarsource.com/blog/what-is-clean-code/">
                  https://www.sonarsource.com/blog/what-is-clean-code/
                </Ext>
              </span>
            </div>
          </div>

          <div className={styles.refCard}>
            <h3>著名開発者・独立系メディアの分析</h3>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                Addy Osmani「Code Review in the Age of AI」（2026年1月）{" "}
                <Ext href="https://addyo.substack.com/p/code-review-in-the-age-of-ai">
                  https://addyo.substack.com/p/code-review-in-the-age-of-ai
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                SonarQube Agentic Analysis: Verify AI code as it is generated（Security Boulevard,
                2026年3月）{" "}
                <Ext href="https://securityboulevard.com/2026/03/sonarqube-agentic-analysis-verify-ai-code-as-it-is-generated/">
                  https://securityboulevard.com/2026/03/sonarqube-agentic-analysis-verify-ai-code-as-it-is-generated/
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                AI Code Review 2026: SonarQube vs CodeRabbit vs Copilot Compared（Lushbinary,
                実務比較記事）{" "}
                <Ext href="https://lushbinary.com/blog/ai-code-review-tools-comparison-automated-pr-review/">
                  https://lushbinary.com/blog/ai-code-review-tools-comparison-automated-pr-review/
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                SonarQube Community vs Enterprise比較（DEV Community）{" "}
                <Ext href="https://dev.to/rahulxsingh/sonarqube-community-vs-enterprise-comparison-2j0d">
                  https://dev.to/rahulxsingh/sonarqube-community-vs-enterprise-comparison-2j0d
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                SonarQube Review 2026（Pricing, Tiers &amp; Honest Pros/Cons）{" "}
                <Ext href="https://appsecsanta.com/sonarqube">
                  https://appsecsanta.com/sonarqube
                </Ext>
              </span>
            </div>
            <div className={styles.refRow}>
              <span className={styles.refIcon}>↗</span>
              <span>
                SonarQube（Wikipedia、エディション構成の概観）{" "}
                <Ext href="https://en.wikipedia.org/wiki/SonarQube">
                  https://en.wikipedia.org/wiki/SonarQube
                </Ext>
              </span>
            </div>
          </div>
        </div>

        <blockquote className={styles.noteCallout}>
          <p>
            <strong>注記</strong>:
            本ガイドはSonar社のドキュメント更新頻度が高いこと、また一部の機能（Agentic
            Analysis、Sonar
            Vortexなど）がBetaないし提供開始直後であることを踏まえ、実際の導入前には必ず{" "}
            <code>docs.sonarsource.com</code>{" "}
            の最新情報を確認してください。価格・LOC課金の具体的な数値は第三者レビューサイトの情報であり、正式な見積もりはSonarSourceへの直接確認を推奨します。
          </p>
        </blockquote>

        <div className={styles.pageFooter}>
          作成日:
          2026年8月時点の情報にもとづく。Sonar社の高頻度リリースにより、機能名・バージョン・提供段階は変更される可能性があります。最新情報は{" "}
          <Ext href="https://docs.sonarsource.com/">docs.sonarsource.com</Ext> を参照してください。
        </div>
      </main>
    </div>
  );
}
