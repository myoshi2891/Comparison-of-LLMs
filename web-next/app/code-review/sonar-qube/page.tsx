/* biome-ignore-all lint/suspicious/noTemplateCurlyInString: code examples contain bash/yaml variables */
"use client";

import { useEffect, useRef, useState } from "react";
import CodeCopyButton from "@/components/docs/CodeCopyButton";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

// ── MERMAID DIAGRAMS ──
const DIAG_CH1 = `flowchart TD
DEV["Developer (IDE / ローカル)"] -->|コードプッシュ| SCM["SCM (GitHub / GitLab / Bitbucket)"]
SCM -->|Webhook / Trigger| CI["CI Pipeline (GitHub Actions / Jenkins / GitLab CI)"]
CI -->|SonarScanner 実行| SCAN["SonarScanner (ソース静的解析)"]
SCAN -->|解析レポート送信| SQ["SonarQube Server / SonarQube Cloud"]
SQ -->|Quality Gate 判定| QG{"Quality Gate (Passed / Failed)"}
QG -->|通過| MERGE["PR Merge 許可 / Deployment 続行"]
QG -->|失敗| BLOCK["Pipeline 停止 / PR Merge ブロック"]
SQ -->|PR Decoration| SCM
SQ -->|Issue 通知| DEV
IDE["SonarQube for IDE (VS Code / IntelliJ 等)"] -->|リアルタイム解析| DEV`;

const DIAG_CH2 = `flowchart LR
subgraph DEF["New Code の定義オプション"]
A["直近 N 日間のコード変更"]
B["特定ブランチとの差分"]
C["前回バージョン以降の変更"]
end
subgraph GATE["Sonar way Quality Gate の条件"]
D["新規 Issue: 0件"]
E["新規脆弱性: 0件"]
F["Hotspot 全件レビュー済み: 100%"]
G["カバレッジ 80%以上"]
H["重複率 3%以下"]
end
A & B & C --> D & E & F & G & H`;

const DIAG_CH3 = `flowchart TD
START([プロジェクト種別は?]) --> Q1{Maven プロジェクト?}
Q1 -->|Yes| MAVEN["sonar-maven-plugin (mvn sonar:sonar)"]
Q1 -->|No| Q2{Gradle プロジェクト?}
Q2 -->|Yes| GRADLE["sonar-gradle-plugin (./gradlew sonar)"]
Q2 -->|No| Q3{NET プロジェクト?}
Q3 -->|Yes| MSBUILD["SonarScanner for .NET (dotnet-sonarscanner)"]
Q3 -->|No| Q4{Node / Python / Go 等?}
Q4 -->|Yes| CLI["SonarScanner CLI (汎用スキャナー)"]
Q4 -->|No| Q5{外部ツール結果のみインポート?}
Q5 -->|Yes| GENERIC["Generic Issue Format (JSONレポートをインポート)"]
Q5 -->|No| CLI`;

const DIAG_CH4 = `flowchart LR
DEV["Developer (コードプッシュ)"] -->|Trigger| CI["CI Pipeline"]
CI --> BUILD["Build and Test (ユニットテスト + カバレッジ)"]
BUILD --> SCAN["SonarScanner (解析実行)"]
SCAN --> SQ["SonarQube (解析処理)"]
SQ --> QG{"Quality Gate"}
QG -->|PASSED| DEPLOY["Deploy / Merge 許可"]
QG -->|FAILED| FAIL["パイプライン失敗 (修正を促す)"]
SQ -.->|Webhook| NOTIFY["Slack / Teams 通知"]`;

const DIAG_CH5 = `sequenceDiagram
participant Dev as Developer
participant SCM as GitHub or GitLab
participant CI as CI Pipeline
participant SS as SonarScanner
participant SQ as SonarQube
Dev->>SCM: PR 作成 / コミットプッシュ
SCM->>CI: Webhook でパイプライン起動
CI->>CI: Build and テスト実行
CI->>SS: SonarScanner 起動 (PR パラメータ付き)
SS->>SQ: 解析レポート送信
SQ->>SQ: PRブランチ vs targetブランチ差分解析
Note over SQ: 差分コード of Issue のみ報告
SQ->>SCM: Quality Gate 結果をデコレーション
Note over SCM: PR ページにインラインコメント表示
SQ-->>CI: QG ステータスを返答
CI->>Dev: パイプライン結果通知`;

const DIAG_CH6 = `flowchart TD
ANALYSIS["解析完了"] --> EVAL["Quality Gate 全条件を評価"]
EVAL --> C1{"新規 Issue = 0件?"}
EVAL --> C2{"Security Hotspot 全件レビュー済み?"}
EVAL --> C3{"カバレッジ >= 閾値%?"}
EVAL --> C4{"重複率 <= 閾値%?"}
C1 -->|OK| P1["OK"]
C1 -->|NG| F1["ERROR"]
C2 -->|OK| P2["OK"]
C2 -->|NG| F2["ERROR"]
C3 -->|OK| P3["OK"]
C3 -->|NG| F3["ERROR"]
C4 -->|OK| P4["OK"]
C4 -->|NG| F4["ERROR"]
P1 & P2 & P3 & P4 --> PASS["PASSED (デプロイ可能 / PR マージ許可)"]
F1 --> FAIL["FAILED (パイプライン停止 / マージブロック)"]
F2 --> FAIL
F3 --> FAIL
F4 --> FAIL`;

const DIAG_CH7 = `flowchart TD
SW["Sonar way (SonarSource 提供・読み取り専用)"]
SW -->|extends| BASE["Org Base Profile (組織共通ルール追加)"]
BASE -->|extends| BE["Backend Profile (Java / Go / Python 固有)"]
BASE -->|extends| FE["Frontend Profile (TypeScript / JavaScript / CSS)"]
BASE -->|extends| SEC["Security Profile (セキュリティ強化ルール追加)"]
BE -->|プロジェクト割り当て| P1["Service A"]
BE -->|プロジェクト割り当て| P2["Service B"]
FE -->|プロジェクト割り当て| P3["Web App"]
SEC -->|プロジェクト割り当て| P4["Payment Service"]`;

const DIAG_CH8 = `flowchart TD
DETECT["SonarQube が Security Hotspot を検出"] --> ASSIGN["担当者にアサイン (自動割り当て)"]
ASSIGN --> REVIEW["コードレビュー実施 (脅威シナリオを確認)"]
REVIEW --> SAFE{"実際に脅威あり?"}
SAFE -->|脅威なし| MARK_SAFE["Safe としてマーク (根拠を記録)"]
SAFE -->|脅威あり| FIX["コードを修正 (脆弱性として扱う)"]
SAFE -->|判断不能| ESCALATE["セキュリティ専門家へエスカレーション"]
MARK_SAFE --> CLOSED["Hotspot クローズ (QG の条件に算入)"]
FIX --> REANALYSIS["再解析 -> Vulnerability として追跡"]
ESCALATE --> REVIEW`;

const DIAG_CH9 = `flowchart LR
subgraph GUIDE["Guide フェーズ"]
    CA["Context Augmentation (プロジェクト固有知識を LLM に注入)"]
end
subgraph GEN["Generate フェーズ"]
    AI["AI Agent (Claude / Cursor / Copilot 等)"]
end
subgraph VERIFY["Verify フェーズ"]
    AA["Agentic Analysis (CI 同等精度の解析を実行)"]
end
MCP["SonarQube MCP Server"] -.->|ツール提供| CA & AA
CA -->|ガイドライン注入| AI
AI -->|コード生成・修正| AA
AA -->|Issue フィードバック| AI
AA -->|品質基準 PASSED| DONE["PR マージ / デプロイ"]
AA -->|品質基準 FAILED| AI`;

const DIAG_CH11 = `flowchart LR
S1["Stage 1: メインブランチ解析の確立 (2-4週間)"] --> S2["Stage 2: CI/CD パイプライン統合 (2-4週間)"]
S2 --> S3["Stage 3: PR デコレーション有効化 (1-2週間)"]
S3 --> S4["Stage 4: Quality Gate の段階的締め付け"]
S4 --> S5["Stage 5: AI エージェント統合 (オプション)"]`;

interface ExtProps {
  href: string;
  children: React.ReactNode;
}

function Ext({ href, children }: ExtProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("toc");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Progress bar animation observer
    const progressBars = container.querySelectorAll(`.${styles.progressBar}`);
    const barObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const bar = entry.target as HTMLElement;
            bar.style.animationPlayState = "running";
            barObserver.unobserve(bar);
          }
        }
      },
      { threshold: 0.1 }
    );

    for (const bar of Array.from(progressBars)) {
      const b = bar as HTMLElement;
      b.style.animationPlayState = "paused";
      barObserver.observe(b);
    }

    // Scroll section active highlighting observer
    const sections = container.querySelectorAll('[id^="ch"], #toc, #refs');
    const secObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.3 }
    );

    for (const sec of Array.from(sections)) {
      secObserver.observe(sec);
    }

    return () => {
      barObserver.disconnect();
      secObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.layout}>
      {/* ==================== NAVIGATION ==================== */}
      <nav className={styles.stickyNav}>
        <div className={styles.navInner}>
          <a className={styles.navLogo} href="#top">
            ⬡ SQ GUIDE
          </a>
          <a
            className={`${styles.navLink} ${activeSection === "toc" ? styles.active : ""}`}
            href="#toc"
          >
            目次
          </a>
          <a
            className={`${styles.navLink} ${activeSection === "ch1" ? styles.active : ""}`}
            href="#ch1"
          >
            Ch.1 概要
          </a>
          <a
            className={`${styles.navLink} ${activeSection === "ch2" ? styles.active : ""}`}
            href="#ch2"
          >
            Ch.2 コアコンセプト
          </a>
          <a
            className={`${styles.navLink} ${activeSection === "ch3" ? styles.active : ""}`}
            href="#ch3"
          >
            Ch.3 スキャナー設定
          </a>
          <a
            className={`${styles.navLink} ${activeSection === "ch4" ? styles.active : ""}`}
            href="#ch4"
          >
            Ch.4 CI/CD 統合
          </a>
          <a
            className={`${styles.navLink} ${activeSection === "ch5" ? styles.active : ""}`}
            href="#ch5"
          >
            Ch.5 PR 解析
          </a>
          <a
            className={`${styles.navLink} ${activeSection === "ch6" ? styles.active : ""}`}
            href="#ch6"
          >
            Ch.6 Quality Gates
          </a>
          <a
            className={`${styles.navLink} ${activeSection === "ch7" ? styles.active : ""}`}
            href="#ch7"
          >
            Ch.7 プロファイル&amp;ルール
          </a>
          <a
            className={`${styles.navLink} ${activeSection === "ch8" ? styles.active : ""}`}
            href="#ch8"
          >
            Ch.8 セキュリティ
          </a>
          <a
            className={`${styles.navLink} ${activeSection === "ch9" ? styles.active : ""}`}
            href="#ch9"
          >
            Ch.9 AI 統合
          </a>
          <a
            className={`${styles.navLink} ${activeSection === "ch10" ? styles.active : ""}`}
            href="#ch10"
          >
            Ch.10 Web API
          </a>
          <a
            className={`${styles.navLink} ${activeSection === "ch11" ? styles.active : ""}`}
            href="#ch11"
          >
            Ch.11 ベストプラクティス
          </a>
          <a
            className={`${styles.navLink} ${activeSection === "refs" ? styles.active : ""}`}
            href="#refs"
          >
            参考文献
          </a>
        </div>
      </nav>

      <main id="top">
        {/* ==================== HERO ==================== */}
        <section className={styles.hero}>
          <div className={styles.heroBgGlow} />
          <div className={styles.container}>
            <div className={styles.heroBadge}>
              SonarQube Server 2026.2 / Cloud 対応 | 2026年6月 更新
            </div>
            <h1 className={styles.heroTitle}>
              SonarQube
              <br />
              Code Review 実践ガイド
            </h1>
            <p className={styles.heroSubtitle}>
              中級者〜上級者のための、Static Analysis を核とした品質エンジニアリング完全解説。Clean
              as You Code から AI エージェント統合まで。
            </p>
            <div className={styles.heroMeta}>
              <div className={styles.heroMetaItem}>
                <span className="dot" /> 11 Chapters
              </div>
              <div className={styles.heroMetaItem}>
                <span className="dot" /> K-Level K1〜K6
              </div>
              <div className={styles.heroMetaItem}>
                <span className="dot" /> 一次情報源: docs.sonarsource.com
              </div>
              <div className={styles.heroMetaItem}>
                <span className="dot" /> 対象: 中〜上級エンジニア
              </div>
            </div>
          </div>
        </section>

        {/* ==================== TOC ==================== */}
        <section id="toc" className={styles.chapterSection}>
          <div className={styles.container}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNum}>TOC</span>
              <h2 className={styles.chapterTitle}>目次</h2>
            </div>
            <div className={styles.tocGrid}>
              <a className={styles.tocCard} href="#ch1">
                <span className={styles.tocNum}>01</span>
                <span className={styles.tocText}>SonarQube の全体像とアーキテクチャ</span>
              </a>
              <a className={styles.tocCard} href="#ch2">
                <span className={styles.tocNum}>02</span>
                <span className={styles.tocText}>コアコンセプト：CaYC / MQR / Gate</span>
              </a>
              <a className={styles.tocCard} href="#ch3">
                <span className={styles.tocNum}>03</span>
                <span className={styles.tocText}>プロジェクト設定とスキャナー構成</span>
              </a>
              <a className={styles.tocCard} href="#ch4">
                <span className={styles.tocNum}>04</span>
                <span className={styles.tocText}>CI/CD パイプラインへの統合</span>
              </a>
              <a className={styles.tocCard} href="#ch5">
                <span className={styles.tocNum}>05</span>
                <span className={styles.tocText}>Pull Request 解析とデコレーション</span>
              </a>
              <a className={styles.tocCard} href="#ch6">
                <span className={styles.tocNum}>06</span>
                <span className={styles.tocText}>Quality Gates の高度な設計</span>
              </a>
              <a className={styles.tocCard} href="#ch7">
                <span className={styles.tocNum}>07</span>
                <span className={styles.tocText}>Quality Profiles とカスタムルール</span>
              </a>
              <a className={styles.tocCard} href="#ch8">
                <span className={styles.tocNum}>08</span>
                <span className={styles.tocText}>セキュリティ解析の徹底活用</span>
              </a>
              <a className={styles.tocCard} href="#ch9">
                <span className={styles.tocNum}>09</span>
                <span className={styles.tocText}>AI エージェント統合（2026最新）</span>
              </a>
              <a className={styles.tocCard} href="#ch10">
                <span className={styles.tocNum}>10</span>
                <span className={styles.tocText}>Web API による自動化</span>
              </a>
              <a className={styles.tocCard} href="#ch11">
                <span className={styles.tocNum}>11</span>
                <span className={styles.tocText}>運用ベストプラクティス</span>
              </a>
            </div>
          </div>
        </section>

        {/* ==================== CHAPTER 1 ==================== */}
        <section id="ch1" className={styles.chapterSection}>
          <div className={styles.container}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNum}>CH 01</span>
              <span className={styles.kLevel}>K-Level: K1–K2</span>
              <h2 className={styles.chapterTitle}>SonarQube の全体像とアーキテクチャ</h2>
            </div>

            <h3 className={styles.sectionTitle}>1.1 定義：SonarQube とは何か</h3>
            <p className={styles.paragraph}>
              <strong>SonarQube</strong> は、静的解析（Static
              Analysis）によってソースコードの品質・セキュリティ・保守性を自動的に評価する
              <em>継続的インスペクション（Continuous Inspection）</em>
              プラットフォームである。コードを実行せず、ソースコードを直接解析することで、バグ・脆弱性・コードスメルを早期に検出する。
            </p>

            <div className={styles.metricGrid}>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>75%</span>
                <span className={styles.metricLabel}>Fortune 100 企業の採用率</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>750B+</span>
                <span className={styles.metricLabel}>毎日解析されるコード行数</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>30+</span>
                <span className={styles.metricLabel}>対応プログラミング言語数</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>6,000+</span>
                <span className={styles.metricLabel}>組み込みルール数</span>
              </div>
            </div>

            <h3 className={styles.sectionTitle}>1.2 理由：なぜ SonarQube が必要か</h3>
            <p className={styles.paragraph}>
              従来のコードレビューは人間のレビュアーに依存し、一貫性・速度・網羅性に限界がある。SonarQube
              は以下の課題を解決する：
            </p>
            <div className={styles.archLayers}>
              <div
                className={styles.archLayer}
                style={{ "--layer-color": "var(--neon-red)" } as React.CSSProperties}
              >
                <span className={styles.archLayerLabel}>人的レビューの限界</span>
                <span className={styles.archLayerDesc}>
                  見落とし・疲労・属人化 → SonarQube で自動化・標準化
                </span>
              </div>
              <div
                className={styles.archLayer}
                style={{ "--layer-color": "var(--neon-amber)" } as React.CSSProperties}
              >
                <span className={styles.archLayerLabel}>技術的負債の蓄積</span>
                <span className={styles.archLayerDesc}>
                  Clean as You Code で新規コードの品質を常に維持
                </span>
              </div>
              <div
                className={styles.archLayer}
                style={{ "--layer-color": "var(--neon-cyan)" } as React.CSSProperties}
              >
                <span className={styles.archLayerLabel}>セキュリティリスク</span>
                <span className={styles.archLayerDesc}>
                  OWASP/CWE対応の Taint Analysis で脆弱性を早期検出
                </span>
              </div>
              <div
                className={styles.archLayer}
                style={{ "--layer-color": "var(--neon-green)" } as React.CSSProperties}
              >
                <span className={styles.archLayerLabel}>CI/CDとの断絶</span>
                <span className={styles.archLayerDesc}>
                  Quality Gate でパイプラインを自動ブロック・制御
                </span>
              </div>
            </div>

            <h3 className={styles.sectionTitle}>1.3 アーキテクチャ概要</h3>
            <div className={styles.mermaidWrap}>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_CH1} />
              </div>
            </div>

            <h3 className={styles.sectionTitle}>1.4 エディション比較</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>機能</th>
                    <th>Community Build</th>
                    <th>Developer Ed.</th>
                    <th>Enterprise Ed.</th>
                    <th>Data Center Ed.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>メインブランチ解析</td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>✅</td>
                  </tr>
                  <tr>
                    <td>マルチブランチ解析</td>
                    <td>❌</td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>✅</td>
                  </tr>
                  <tr>
                    <td>PR 解析 &amp; デコレーション</td>
                    <td>❌</td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>✅</td>
                  </tr>
                  <tr>
                    <td>Portfolio / Application</td>
                    <td>❌</td>
                    <td>❌</td>
                    <td>✅</td>
                    <td>✅</td>
                  </tr>
                  <tr>
                    <td>Security Reports (OWASP等)</td>
                    <td>❌</td>
                    <td>❌</td>
                    <td>✅</td>
                    <td>✅</td>
                  </tr>
                  <tr>
                    <td>高可用性クラスタ (HA)</td>
                    <td>❌</td>
                    <td>❌</td>
                    <td>❌</td>
                    <td>✅</td>
                  </tr>
                  <tr>
                    <td>Remediation Agent (Beta)</td>
                    <td>❌</td>
                    <td>❌</td>
                    <td>✅ Cloud</td>
                    <td>✅ Cloud</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`${styles.callout} ${styles.calloutInfo}`}>
              <div className={styles.calloutIcon}>💡</div>
              <div className={styles.calloutBody}>
                <p className={styles.calloutTitle}>Cloud vs Server</p>
                <p>
                  SonarQube Cloud は SaaS型でインフラ管理不要。Server
                  は自社インフラへのオンプレミス／コンテナ展開型。機能セットはほぼ同等だが、Cloud
                  の最新機能（AI機能等）が先行する場合がある。
                </p>
              </div>
            </div>

            <h3 className={styles.sectionTitle}>1.5 参考 URL（Chapter 1）</h3>
            <div className={styles.refGrid}>
              <Ext href="https://docs.sonarsource.com/">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-green)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>🏠 公式ポータル</div>
                  <div className={styles.refTitle}>SonarQube 公式ドキュメント入口</div>
                  <div className={styles.refUrl}>https://docs.sonarsource.com/</div>
                </div>
              </Ext>
              <Ext href="https://docs.sonarsource.com/sonarqube-server/analyzing-source-code/analysis-overview">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-cyan)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>📚 Server Docs</div>
                  <div className={styles.refTitle}>SonarQube Server 解析概要</div>
                  <div className={styles.refUrl}>
                    docs.sonarsource.com/sonarqube-server/analyzing-source-code/analysis-overview
                  </div>
                </div>
              </Ext>
            </div>
          </div>
        </section>

        {/* ==================== CHAPTER 2 ==================== */}
        <section id="ch2" className={styles.chapterSection}>
          <div className={styles.container}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNum}>CH 02</span>
              <span className={styles.kLevel}>K-Level: K2–K3</span>
              <h2 className={styles.chapterTitle}>コアコンセプト：CaYC / MQR / Quality Gate</h2>
            </div>

            <h3 className={styles.sectionTitle}>2.1 Clean as You Code（CaYC）</h3>
            <p className={styles.paragraph}>
              <strong>定義：</strong> 既存のレガシーコード全体を一度に修正しようとせず、
              <em>新規コード（New Code）に常に高い品質基準を課す</em>
              戦略。開発者は自分が追加・変更したコードのみに責任を持つ。
            </p>
            <p className={styles.paragraph}>
              <strong>理由：</strong>{" "}
              技術的負債を段階的に解消しつつ、今日書くコードを常にクリーンに保つことで、時間をかけてコードベース全体の品質が向上する。
            </p>

            <div className={styles.mermaidWrap}>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_CH2} />
              </div>
            </div>

            <h3 className={styles.sectionTitle}>2.2 インスタンスモード：Standard vs MQR</h3>
            <p className={styles.paragraph}>
              <strong>定義：</strong> SonarQube Server 2026 では2つのモードが存在する。Standard
              Experience はバグ・脆弱性・Code Smell という従来分類。MQR（Multi-Quality
              Rule）モードはルールを
              <em>セキュリティ・信頼性・保守性</em>
              という品質特性の軸で評価し、1つのルールが複数の品質特性に影響するケースを正確に表現できる。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>観点</th>
                    <th>Standard Experience</th>
                    <th>MQR Mode（推奨）</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ルール分類</td>
                    <td>Bug / Vulnerability / Code Smell</td>
                    <td>Security / Reliability / Maintainability</td>
                  </tr>
                  <tr>
                    <td>Severity 段階</td>
                    <td>Blocker, Critical, Major, Minor, Info</td>
                    <td>Blocker, High, Medium, Low, Info</td>
                  </tr>
                  <tr>
                    <td>1ルールの影響</td>
                    <td>単一カテゴリに1 severity</td>
                    <td>複数品質特性に別々の severity を付与</td>
                  </tr>
                  <tr>
                    <td>移行</td>
                    <td>Administration → General Settings → Mode</td>
                    <td>同左（admin 権限必要）</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={`${styles.callout} ${styles.calloutWarning}`}>
              <div className={styles.calloutIcon}>⚠️</div>
              <div className={styles.calloutBody}>
                <p className={styles.calloutTitle}>注意</p>
                <p>
                  MQR モードへの切り替え後、1つの Issue が複数品質特性に紐付くため Issue
                  数が増加することがある。カスタム Quality Gate の条件も更新が必要。
                </p>
              </div>
            </div>

            <h3 className={styles.sectionTitle}>2.3 主要メトリクス定義</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>メトリクス</th>
                    <th>定義</th>
                    <th>良好値の目安</th>
                    <th>モード</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Coverage</td>
                    <td>テストが実行するコード行の割合</td>
                    <td>新規コード ≥ 80%</td>
                    <td>両モード</td>
                  </tr>
                  <tr>
                    <td>Duplications</td>
                    <td>重複コードブロックの割合</td>
                    <td>新規コード ≤ 3%</td>
                    <td>両モード</td>
                  </tr>
                  <tr>
                    <td>Reliability Rating</td>
                    <td>バグの深刻度に基づく A〜E 評価</td>
                    <td>A（バグなし）</td>
                    <td>Standard</td>
                  </tr>
                  <tr>
                    <td>Security Rating</td>
                    <td>脆弱性の深刻度に基づく A〜E 評価</td>
                    <td>A（脆弱性なし）</td>
                    <td>Standard</td>
                  </tr>
                  <tr>
                    <td>Maintainability Rating</td>
                    <td>Code Smell 修正工数率に基づく A〜E</td>
                    <td>A（≤ 5%）</td>
                    <td>Standard</td>
                  </tr>
                  <tr>
                    <td>Software Quality Severity</td>
                    <td>各品質特性への影響深刻度</td>
                    <td>Blocker/High: 0件</td>
                    <td>MQR</td>
                  </tr>
                  <tr>
                    <td>SQALE Index</td>
                    <td>技術的負債の推定修正工数</td>
                    <td>プロジェクト規模による</td>
                    <td>両モード</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className={styles.sectionTitle}>2.4 Issue 深刻度のピラミッド</h3>
            <div className={styles.pyramid}>
              <div
                className={styles.pyramidLayer}
                style={
                  {
                    "--pyr-width": "100%",
                    "--pyr-color": "var(--neon-green)",
                  } as React.CSSProperties
                }
              >
                Info — 参考情報（要対応なし）
              </div>
              <div
                className={styles.pyramidLayer}
                style={
                  { "--pyr-width": "82%", "--pyr-color": "var(--neon-cyan)" } as React.CSSProperties
                }
              >
                Minor — 小規模なスタイル問題
              </div>
              <div
                className={styles.pyramidLayer}
                style={
                  {
                    "--pyr-width": "64%",
                    "--pyr-color": "var(--neon-amber)",
                  } as React.CSSProperties
                }
              >
                Major — 保守性・品質に影響
              </div>
              <div
                className={styles.pyramidLayer}
                style={{ "--pyr-width": "46%", "--pyr-color": "#e07000" } as React.CSSProperties}
              >
                Critical — バグ・セキュリティリスク
              </div>
              <div
                className={styles.pyramidLayer}
                style={
                  { "--pyr-width": "28%", "--pyr-color": "var(--neon-red)" } as React.CSSProperties
                }
              >
                Blocker — 即時修正必須
              </div>
            </div>

            <h3 className={styles.sectionTitle}>2.5 参考 URL（Chapter 2）</h3>
            <div className={styles.refGrid}>
              <Ext href="https://docs.sonarsource.com/sonarqube-server/user-guide/about-new-code">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-green)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>📖 Clean as You Code</div>
                  <div className={styles.refTitle}>New Code の定義と CaYC アプローチ</div>
                  <div className={styles.refUrl}>
                    docs.sonarsource.com/sonarqube-server/user-guide/about-new-code
                  </div>
                </div>
              </Ext>
              <Ext href="https://docs.sonarsource.com/sonarqube-server/user-guide/code-metrics/changing-modes">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-cyan)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>⚙️ MQR Mode</div>
                  <div className={styles.refTitle}>インスタンスモードの変更方法</div>
                  <div className={styles.refUrl}>
                    docs.sonarsource.com/sonarqube-server/user-guide/code-metrics/changing-modes
                  </div>
                </div>
              </Ext>
            </div>
          </div>
        </section>

        {/* ==================== CHAPTER 3 ==================== */}
        <section id="ch3" className={styles.chapterSection}>
          <div className={styles.container}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNum}>CH 03</span>
              <span className={styles.kLevel}>K-Level: K3</span>
              <h2 className={styles.chapterTitle}>プロジェクト設定とスキャナー構成</h2>
            </div>

            <h3 className={styles.sectionTitle}>3.1 スキャナー選択フロー</h3>
            <div className={styles.mermaidWrap}>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_CH3} />
              </div>
            </div>

            <h3 className={styles.sectionTitle}>3.2 sonar-project.properties の詳細設定</h3>
            <p className={styles.paragraph}>
              <strong>定義：</strong>{" "}
              プロジェクトルートに配置する設定ファイル。スキャナーの動作をコードとして管理できる（Infrastructure
              as Code 的アプローチ）。
            </p>

            <div className={styles.codeBlockHeader}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.codeDotRed}`} />
                <div className={`${styles.codeDot} ${styles.codeDotAmber}`} />
                <div className={`${styles.codeDot} ${styles.codeDotGreen}`} />
              </div>
              <span className={styles.codeLang}>PROPERTIES — sonar-project.properties</span>
              <CodeCopyButton
                text={`# ===== プロジェクト識別子 =====
sonar.projectKey=com.example:my-service
sonar.projectName=My Service
sonar.projectVersion=1.0.0

# ===== ソース設定 =====
sonar.sources=src/main
sonar.tests=src/test
sonar.sourceEncoding=UTF-8

# ===== Java 固有設定 =====
sonar.java.binaries=target/classes
sonar.java.libraries=target/dependency/*.jar
sonar.java.test.binaries=target/test-classes

# ===== カバレッジ レポート =====
sonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml

# ===== 解析除外（自動生成・サードパーティ） =====
sonar.exclusions=**/generated/**,**/vendor/**,**/*.min.js,**/node_modules/**
sonar.coverage.exclusions=**/config/**,**/dto/**,**/entity/**
sonar.test.exclusions=**/testdata/**

# ===== New Code 定義（プロジェクトレベル） =====
# previous_version | NUMBER_OF_DAYS | reference_branch
sonar.newCode.referenceBranch=main`}
              />
            </div>
            <pre className={styles.codeBlock}>
              <div className={styles.codeLine}>
                <span className={styles.codeComment}># ===== プロジェクト識別子 =====</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.projectKey</span>=
                <span className={styles.codeString}>com.example:my-service</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.projectName</span>=
                <span className={styles.codeString}>My Service</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.projectVersion</span>=
                <span className={styles.codeString}>1.0.0</span>
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.codeComment}># ===== ソース設定 =====</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.sources</span>=
                <span className={styles.codeString}>src/main</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.tests</span>=
                <span className={styles.codeString}>src/test</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.sourceEncoding</span>=
                <span className={styles.codeString}>UTF-8</span>
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.codeComment}># ===== Java 固有設定 =====</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.java.binaries</span>=
                <span className={styles.codeString}>target/classes</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.java.libraries</span>=
                <span className={styles.codeString}>target/dependency/*.jar</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.java.test.binaries</span>=
                <span className={styles.codeString}>target/test-classes</span>
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.codeComment}># ===== カバレッジ レポート =====</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.coverage.jacoco.xmlReportPaths</span>=
                <span className={styles.codeString}>target/site/jacoco/jacoco.xml</span>
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.codeComment}>
                  # ===== 解析除外（自動生成・サードパーティ） =====
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.exclusions</span>=
                <span className={styles.codeString}>
                  **/generated/**,**/vendor/**,**/*.min.js,**/node_modules/**
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.coverage.exclusions</span>=
                <span className={styles.codeString}>**/config/**,**/dto/**,**/entity/**</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.test.exclusions</span>=
                <span className={styles.codeString}>**/testdata/**</span>
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.codeComment}>
                  # ===== New Code 定義（プロジェクトレベル） =====
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeComment}>
                  # previous_version | NUMBER_OF_DAYS | reference_branch
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.newCode.referenceBranch</span>=
                <span className={styles.codeString}>main</span>
              </div>
            </pre>

            <h3 className={styles.sectionTitle}>3.3 トークン管理：良い例 vs 悪い例</h3>
            <div className={styles.compareGrid}>
              <div className={`${styles.compareCard} ${styles.compareGood}`}>
                <div className={styles.compareHeader}>✅ 推奨：環境変数経由</div>
                <div className={styles.codeBlockHeader}>
                  <span className={styles.codeLang}>BASH</span>
                  <CodeCopyButton
                    text={`# CI シークレットとして設定
# SONAR_TOKEN=sqp_xxxxx

sonar-scanner \\
  -Dsonar.token="\${SONAR_TOKEN}" \\
  -Dsonar.host.url="\${SONAR_HOST_URL}"`}
                  />
                </div>
                <pre className={styles.codeBlock}>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># CI シークレットとして設定</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># SONAR_TOKEN=sqp_xxxxx</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.codeGreen}>sonar-scanner</span> \
                  </div>
                  <div className={styles.codeLine}>
                    {" "}
                    <span className={styles.codeCyan}>-Dsonar.token</span>=
                    <span className={styles.codeString}>"{"${SONAR_TOKEN}"}"</span> \
                  </div>
                  <div className={styles.codeLine}>
                    {" "}
                    <span className={styles.codeCyan}>-Dsonar.host.url</span>=
                    <span className={styles.codeString}>"{"${SONAR_HOST_URL}"}"</span>
                  </div>
                </pre>
              </div>
              <div className={`${styles.compareCard} ${styles.compareBad}`}>
                <div className={styles.compareHeader}>❌ NG：ファイルにハードコード</div>
                <div className={styles.codeBlockHeader}>
                  <span className={styles.codeLang}>PROPERTIES</span>
                  <CodeCopyButton
                    text={`# sonar-project.properties に直書き
# → Git 履歴にトークンが残る！

sonar.login=sqp_ab12cd34ef56
sonar.host.url=https://sonar.example.com`}
                  />
                </div>
                <pre className={styles.codeBlock}>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># sonar-project.properties に直書き</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># → Git 履歴にトークンが残る！</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.codeRed}>sonar.login</span>=
                    <span className={styles.codeRed}>sqp_ab12cd34ef56</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeRed}>sonar.host.url</span>=
                    <span className={styles.codeRed}>https://sonar.example.com</span>
                  </div>
                </pre>
              </div>
            </div>

            <h3 className={styles.sectionTitle}>3.4 トークン種別と最小権限の原則</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>トークン種別</th>
                    <th>スコープ</th>
                    <th>推奨用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className={styles.tag}>User Token</span>
                    </td>
                    <td>ユーザー権限相当</td>
                    <td>ローカル開発・デバッグ</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.tag} ${styles.tagCyan}`}>
                        Project Analysis Token
                      </span>
                    </td>
                    <td>単一プロジェクトの解析のみ</td>
                    <td>✅ CI/CD パイプライン（最小権限）</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.tag} ${styles.tagAmber}`}>
                        Global Analysis Token
                      </span>
                    </td>
                    <td>全プロジェクトの解析</td>
                    <td>中央集権 CI（使用は最小限に）</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={`${styles.callout} ${styles.calloutWarning}`}>
              <div className={styles.calloutIcon}>⚠️</div>
              <div className={styles.calloutBody}>
                <p className={styles.calloutTitle}>注意</p>
                <p>
                  CI/CD では必ず <strong>Project Analysis Token</strong>{" "}
                  を使用すること。万が一の漏洩時の影響範囲を最小化できる。
                </p>
              </div>
            </div>

            <h3 className={styles.sectionTitle}>3.5 参考 URL（Chapter 3）</h3>
            <div className={styles.refGrid}>
              <Ext href="https://docs.sonarsource.com/sonarqube-server/extension-guide/adding-coding-rules">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-green)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>⚙️ Configuration</div>
                  <div className={styles.refTitle}>SonarScanner 設定リファレンス</div>
                  <div className={styles.refUrl}>
                    docs.sonarsource.com/sonarqube-server/extension-guide/adding-coding-rules
                  </div>
                </div>
              </Ext>
            </div>
          </div>
        </section>

        {/* ==================== CHAPTER 4 ==================== */}
        <section id="ch4" className={styles.chapterSection}>
          <div className={styles.container}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNum}>CH 04</span>
              <span className={styles.kLevel}>K-Level: K3–K4</span>
              <h2 className={styles.chapterTitle}>CI/CD パイプラインへの統合</h2>
            </div>

            <h3 className={styles.sectionTitle}>4.1 統合パターン概要</h3>
            <div className={styles.mermaidWrap}>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_CH4} />
              </div>
            </div>

            <h3 className={styles.sectionTitle}>4.2 GitHub Actions</h3>
            <div className={`${styles.callout} ${styles.calloutInfo}`}>
              <div className={styles.calloutIcon}>ℹ️</div>
              <div className={styles.calloutBody}>
                <p className={styles.calloutTitle}>重要：fetch-depth: 0 は必須</p>
                <p>
                  浅いクローン（デフォルト fetch-depth: 1）では Git 履歴が不足し、New Code
                  の検出精度が大幅に低下する。必ず fetch-depth: 0 を指定すること。
                </p>
              </div>
            </div>

            <div className={styles.codeBlockHeader}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.codeDotRed}`} />
                <div className={`${styles.codeDot} ${styles.codeDotAmber}`} />
                <div className={`${styles.codeDot} ${styles.codeDotGreen}`} />
              </div>
              <span className={styles.codeLang}>YAML — .github/workflows/sonarqube.yml</span>
              <CodeCopyButton
                text={`name: SonarQube Analysis

on:
  push:
    branches: [main, develop]
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  sonarqube:
    name: SonarQube Scan
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # ← 完全 Git 履歴（必須！）

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: 'maven'

      - name: Cache SonarQube packages
        uses: actions/cache@v4
        with:
          path: ~/.sonar/cache
          key: \${{ runner.os }}-sonar
          restore-keys: \${{ runner.os }}-sonar

      - name: Build and run tests with coverage
        run: mvn -B verify -Pcoverage

      - name: SonarQube Scan
        uses: SonarSource/sonarqube-scan-action@v5
        env:
          SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: \${{ secrets.SONAR_HOST_URL }}

      - name: Quality Gate check
        id: sonarqube-quality-gate-check
        uses: SonarSource/sonarqube-quality-gate-action@v1
        timeout-minutes: 5
        env:
          SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: \${{ secrets.SONAR_HOST_URL }}

      - name: Fail if Quality Gate failed
        if: steps.sonarqube-quality-gate-check.outputs.quality-gate-status == 'FAILED'
        run: exit 1`}
              />
            </div>
            <pre className={styles.codeBlock}>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>name</span>:{" "}
                <span className={styles.codeString}>SonarQube Analysis</span>
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>on</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>push</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>branches</span>: [main, develop]
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>pull_request</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>types</span>: [opened, synchronize, reopened]
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>jobs</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>sonarqube</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>name</span>: SonarQube Scan
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>runs-on</span>: ubuntu-latest
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>steps</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                - <span className={styles.codeCyan}>name</span>: Checkout repository
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>uses</span>: actions/checkout@v4
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>with</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>fetch-depth</span>:{" "}
                <span className={styles.codeNum}>0</span>{" "}
                <span className={styles.codeComment}># ← 完全 Git 履歴（必須！）</span>
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                {" "}
                - <span className={styles.codeCyan}>name</span>: Set up JDK 21
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>uses</span>: actions/setup-java@v4
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>with</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>java-version</span>:{" "}
                <span className={styles.codeString}>'21'</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>distribution</span>:{" "}
                <span className={styles.codeString}>'temurin'</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>cache</span>:{" "}
                <span className={styles.codeString}>'maven'</span>
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                {" "}
                - <span className={styles.codeCyan}>name</span>: Cache SonarQube packages
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>uses</span>: actions/cache@v4
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>with</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>path</span>: ~/.sonar/cache
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>key</span>: {"${{ runner.os }}-sonar"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>restore-keys</span>: {"${{ runner.os }}-sonar"}
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                {" "}
                - <span className={styles.codeCyan}>name</span>: Build and run tests with coverage
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>run</span>: mvn -B verify -Pcoverage
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                {" "}
                - <span className={styles.codeCyan}>name</span>: SonarQube Scan
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>uses</span>: SonarSource/sonarqube-scan-action@v5
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>env</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>SONAR_TOKEN</span>:{" "}
                {"${{ secrets.SONAR_TOKEN }}"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>SONAR_HOST_URL</span>:{" "}
                {"${{ secrets.SONAR_HOST_URL }}"}
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                {" "}
                - <span className={styles.codeCyan}>name</span>: Quality Gate check
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>id</span>: sonarqube-quality-gate-check
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>uses</span>:
                SonarSource/sonarqube-quality-gate-action@v1
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>timeout-minutes</span>:{" "}
                <span className={styles.codeNum}>5</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>env</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>SONAR_TOKEN</span>:{" "}
                {"${{ secrets.SONAR_TOKEN }}"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>SONAR_HOST_URL</span>:{" "}
                {"${{ secrets.SONAR_HOST_URL }}"}
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                {" "}
                - <span className={styles.codeCyan}>name</span>: Fail if Quality Gate failed
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>if</span>:
                steps.sonarqube-quality-gate-check.outputs.quality-gate-status == 'FAILED'
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>run</span>: exit{" "}
                <span className={styles.codeNum}>1</span>
              </div>
            </pre>

            <h3 className={styles.sectionTitle}>4.3 Jenkins Declarative Pipeline</h3>
            <div className={styles.codeBlockHeader}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.codeDotRed}`} />
                <div className={`${styles.codeDot} ${styles.codeDotAmber}`} />
                <div className={`${styles.codeDot} ${styles.codeDotGreen}`} />
              </div>
              <span className={styles.codeLang}>GROOVY — Jenkinsfile</span>
              <CodeCopyButton
                text={`pipeline {
    agent any
    environment {
        SONAR_ENV = 'SonarQube'  // Jenkins 管理画面での名前
    }
    stages {
        stage('Build & Test') {
            steps {
                sh 'mvn -B clean verify -Pcoverage'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv(env.SONAR_ENV) {
                    sh 'mvn sonar:sonar'
                }
            }
        }
        stage('Quality Gate') {
            steps {
                // Webhook 使用でノンブロッキング待機（推奨）
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
    post {
        failure {
            slackSend(color: 'danger',
              message: "❌ Quality Gate Failed: \${env.JOB_NAME} #\${env.BUILD_NUMBER}")
        }
    }
}`}
              />
            </div>
            <pre className={styles.codeBlock}>
              <div className={styles.codeLine}>
                <span className={styles.codeKeyword}>pipeline</span> {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeKeyword}>agent</span> any
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>environment</span> {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>SONAR_ENV</span> ={" "}
                <span className={styles.codeString}>'SonarQube'</span>{" "}
                <span className={styles.codeComment}>{"// Jenkins 管理画面での名前"}</span>
              </div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>stages</span> {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeKeyword}>stage</span>(
                <span className={styles.codeString}>'Build &amp; Test'</span>) {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>steps</span> {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                sh <span className={styles.codeString}>'mvn -B clean verify -Pcoverage'</span>
              </div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeKeyword}>stage</span>(
                <span className={styles.codeString}>'SonarQube Analysis'</span>) {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>steps</span> {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeKeyword}>withSonarQubeEnv</span>(env.SONAR_ENV) {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                sh <span className={styles.codeString}>'mvn sonar:sonar'</span>
              </div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeKeyword}>
                {" "}
                stage(<span className={styles.codeString}>'Quality Gate'</span>) {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>steps</span> {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeComment}>
                  {"// Webhook 使用でノンブロッキング待機（推奨）"}
                </span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                timeout(time: <span className={styles.codeNum}>5</span>, unit:{" "}
                <span className={styles.codeString}>'MINUTES'</span>) {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeKeyword}>waitForQualityGate</span> abortPipeline:{" "}
                <span className={styles.codeCyan}>true</span>
              </div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>post</span> {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeKeyword}>failure</span> {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                slackSend(color: <span className={styles.codeString}>'danger'</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                message:{" "}
                <span className={styles.codeString}>
                  "❌ Quality Gate Failed: {"${env.JOB_NAME} #${env.BUILD_NUMBER}"}"
                </span>
                )
              </div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}>{"}"}</div>
            </pre>

            <div className={`${styles.callout} ${styles.calloutWarning}`}>
              <div className={styles.calloutIcon}>⚙️</div>
              <div className={styles.calloutBody}>
                <p className={styles.calloutTitle}>Jenkins Webhook の設定が必須</p>
                <p>
                  SonarQube 管理画面 → Administration → Configuration → Webhooks で
                  <code>{"http://<jenkins-host>/sonarqube-webhook/"}</code> を登録すること。Webhook
                  がないと waitForQualityGate がタイムアウトする。
                </p>
              </div>
            </div>

            <h3 className={styles.sectionTitle}>4.4 GitLab CI/CD</h3>
            <div className={styles.codeBlockHeader}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.codeDotRed}`} />
                <div className={`${styles.codeDot} ${styles.codeDotAmber}`} />
                <div className={`${styles.codeDot} ${styles.codeDotGreen}`} />
              </div>
              <span className={styles.codeLang}>YAML — .gitlab-ci.yml</span>
              <CodeCopyButton
                text={`variables:
  SONAR_USER_HOME: "\${CI_PROJECT_DIR}/.sonar"
  GIT_DEPTH: "0"  # 完全 Git 履歴（必須）

sonarqube-check:
  stage: test
  image:
    name: sonarsource/sonar-scanner-cli:latest
    entrypoint: [""]
  cache:
    key: "\${CI_JOB_NAME}"
    paths:
      - .sonar/cache
  script:
    - sonar-scanner
      -Dsonar.qualitygate.wait=true
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
    - if: $CI_COMMIT_BRANCH == 'main'`}
              />
            </div>
            <pre className={styles.codeBlock}>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>variables</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>SONAR_USER_HOME</span>:{" "}
                <span className={styles.codeString}>"{"${CI_PROJECT_DIR}/.sonar"}"</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>GIT_DEPTH</span>:{" "}
                <span className={styles.codeString}>"0"</span>{" "}
                <span className={styles.codeComment}># 完全 Git 履歴（必須）</span>
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonarqube-check</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>stage</span>: test
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>image</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>name</span>: sonarsource/sonar-scanner-cli:latest
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>entrypoint</span>: [
                <span className={styles.codeString}>""</span>]
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>cache</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>key</span>:{" "}
                <span className={styles.codeString}>"{"${CI_JOB_NAME}"}"</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>paths</span>:
              </div>
              <div className={styles.codeLine}> - .sonar/cache</div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>script</span>:
              </div>
              <div className={styles.codeLine}> - sonar-scanner</div>
              <div className={styles.codeLine}>
                {" "}
                -Dsonar.qualitygate.wait=<span className={styles.codeCyan}>true</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>rules</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                - <span className={styles.codeCyan}>if</span>: $CI_PIPELINE_SOURCE =={" "}
                <span className={styles.codeString}>'merge_request_event'</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                - <span className={styles.codeCyan}>if</span>: $CI_COMMIT_BRANCH =={" "}
                <span className={styles.codeString}>'main'</span>
              </div>
            </pre>

            <h3 className={styles.sectionTitle}>4.5 Quality Gate 待機方式の比較</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>方式</th>
                    <th>利点</th>
                    <th>欠点</th>
                    <th>推奨シーン</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>sonar.qualitygate.wait=true</code>
                    </td>
                    <td>設定シンプル、どのCIでも動作</td>
                    <td>スキャナーがポーリング（時間・CPU消費）</td>
                    <td>小規模・シンプルな構成</td>
                  </tr>
                  <tr>
                    <td>Quality Gate Action（GitHub）</td>
                    <td>非同期・効率的</td>
                    <td>GitHub Actions 依存</td>
                    <td>GitHub Actions</td>
                  </tr>
                  <tr>
                    <td>
                      <code>waitForQualityGate</code>（Jenkins）
                    </td>
                    <td>Webhook 活用で軽量、再起動耐性あり</td>
                    <td>Webhook 設定が必要</td>
                    <td>Jenkins</td>
                  </tr>
                  <tr>
                    <td>外部 API ポーリング（自作）</td>
                    <td>CI ツール非依存</td>
                    <td>実装コスト高</td>
                    <td>独自 CI 基盤</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ==================== CHAPTER 5 ==================== */}
        <section id="ch5" className={styles.chapterSection}>
          <div className={styles.container}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNum}>CH 05</span>
              <span className={styles.kLevel}>K-Level: K3</span>
              <h2 className={styles.chapterTitle}>Pull Request 解析とデコレーション</h2>
            </div>

            <p className={styles.paragraph}>
              <strong>定義：</strong> PR
              解析は、プルリクエストが開かれた時点、およびプッシュがあるたびに自動実行される。PR
              ブランチとターゲットブランチを比較し、<em>差分コードに導入された Issue のみ</em>{" "}
              を報告する。Developer Edition 以上で利用可能。
            </p>

            <h3 className={styles.sectionTitle}>5.1 PR 解析シーケンス</h3>
            <div className={styles.mermaidWrap}>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_CH5} />
              </div>
            </div>

            <h3 className={styles.sectionTitle}>5.2 PR パラメータの手動設定</h3>
            <p className={styles.paragraph}>
              多くの CI 環境ではパラメータを自動検出するが、カスタム CI
              環境では手動設定が必要な場合がある。
            </p>
            <div className={styles.codeBlockHeader}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.codeDotRed}`} />
                <div className={`${styles.codeDot} ${styles.codeDotAmber}`} />
                <div className={`${styles.codeDot} ${styles.codeDotGreen}`} />
              </div>
              <span className={styles.codeLang}>BASH — 手動 PR パラメータ</span>
              <CodeCopyButton
                text={`sonar-scanner \\
  -Dsonar.pullrequest.key=\${PR_NUMBER} \\
  -Dsonar.pullrequest.branch=\${SOURCE_BRANCH} \\
  -Dsonar.pullrequest.base=\${TARGET_BRANCH} \\
  -Dsonar.pullrequest.provider=GitHub \\
  -Dsonar.pullrequest.github.repository=org/repo`}
              />
            </div>
            <pre className={styles.codeBlock}>
              <div className={styles.codeLine}>sonar-scanner \</div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>-Dsonar.pullrequest.key</span>=
                <span className={styles.codeString}>{"${PR_NUMBER}"}</span> \{" "}
                <span className={styles.codeComment}># PR の一意識別子</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>-Dsonar.pullrequest.branch</span>=
                <span className={styles.codeString}>{"${SOURCE_BRANCH}"}</span> \{" "}
                <span className={styles.codeComment}># feature ブランチ名</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>-Dsonar.pullrequest.base</span>=
                <span className={styles.codeString}>{"${TARGET_BRANCH}"}</span> \{" "}
                <span className={styles.codeComment}># マージ先（main 等）</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>-Dsonar.pullrequest.provider</span>=
                <span className={styles.codeString}>GitHub</span> \
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>-Dsonar.pullrequest.github.repository</span>=
                <span className={styles.codeString}>org/repo</span>
              </div>
            </pre>

            <p className={styles.paragraph}>
              <strong>自動検出対応環境：</strong> <span className={styles.tag}>GitHub Actions</span>{" "}
              <span className={`${styles.tag} ${styles.tagCyan}`}>GitLab CI</span>{" "}
              <span className={`${styles.tag} ${styles.tagCyan}`}>Jenkins（Multibranch）</span>{" "}
              <span className={`${styles.tag} ${styles.tagPurple}`}>CircleCI</span>{" "}
              <span className={`${styles.tag} ${styles.tagPurple}`}>Azure Pipelines</span>{" "}
              <span className={`${styles.tag} ${styles.tagAmber}`}>Bitbucket Pipelines</span>
            </p>

            <h3 className={styles.sectionTitle}>5.3 PR 解析の重要な挙動と制約</h3>
            <div className={styles.stepList}>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>1</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>差分コードのみを対象</div>
                  <p className={styles.stepDesc}>
                    PR ブランチで追加・編集されたコード of Issue のみ報告。既存コードの Issue
                    は報告されない（Issue バックデーティングが適用外）。
                  </p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>2</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>マージ後の新規 Issue の可能性</div>
                  <p className={styles.stepDesc}>
                    マージ後の最初のメインブランチ解析で、PR 解析が未検出の旧コード上の Issue
                    が出現することがある。
                  </p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>3</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>30日間の自動パージ</div>
                  <p className={styles.stepDesc}>
                    PR 解析結果はデフォルト30日間保持。Administration → Housekeeping で変更可能。
                  </p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>4</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>Issue 属性の同期</div>
                  <p className={styles.stepDesc}>
                    Issue のステータス・アサイン・コメントはターゲットブランチの対応 Issue
                    と同期される。
                  </p>
                </div>
              </div>
            </div>

            <div className={`${styles.alert} ${styles.alertGreen}`}>
              ✅ PR 解析では <strong>差分コードに絞ることで解析時間を短縮</strong>
              するために差分インクリメンタル解析機構が採用されている。
            </div>
          </div>
        </section>

        {/* ==================== CHAPTER 6 ==================== */}
        <section id="ch6" className={styles.chapterSection}>
          <div className={styles.container}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNum}>CH 06</span>
              <span className={styles.kLevel}>K-Level: K4</span>
              <h2 className={styles.chapterTitle}>Quality Gates の高度な設計</h2>
            </div>

            <p className={styles.paragraph}>
              <strong>定義：</strong> Quality Gate
              はコードを一連の条件（Condition）で評価し「プロジェクトはリリース可能か？」という問いに答える。各条件はメトリクスと閾値の組み合わせで構成される。
            </p>

            <h3 className={styles.sectionTitle}>6.1 Quality Gate 評価フロー</h3>
            <div className={styles.mermaidWrap}>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_CH6} />
              </div>
            </div>

            <h3 className={styles.sectionTitle}>6.2 Sonar way Quality Gate の条件（デフォルト）</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>条件</th>
                    <th>メトリクス</th>
                    <th>演算子</th>
                    <th>閾値</th>
                    <th>変更可否</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>新規 Issue ゼロ</td>
                    <td>Issues</td>
                    <td>is greater than</td>
                    <td>0</td>
                    <td>🔒 固定</td>
                  </tr>
                  <tr>
                    <td>Hotspot 全件レビュー</td>
                    <td>Security Hotspots Reviewed</td>
                    <td>is less than</td>
                    <td>100%</td>
                    <td>🔒 固定</td>
                  </tr>
                  <tr>
                    <td>信頼性評価</td>
                    <td>Reliability Rating</td>
                    <td>is worse than</td>
                    <td>A</td>
                    <td>🔒 固定</td>
                  </tr>
                  <tr>
                    <td>セキュリティ評価</td>
                    <td>Security Rating</td>
                    <td>is worse than</td>
                    <td>A</td>
                    <td>🔒 固定</td>
                  </tr>
                  <tr>
                    <td>テストカバレッジ</td>
                    <td>Coverage</td>
                    <td>is less than</td>
                    <td>80%</td>
                    <td>✏️ 変更可</td>
                  </tr>
                  <tr>
                    <td>重複率</td>
                    <td>Duplicated Lines (%)</td>
                    <td>is greater than</td>
                    <td>3%</td>
                    <td>✏️ 変更可</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className={styles.sectionTitle}>6.3 プロジェクト特性別 Quality Gate 設計</h3>
            <div className={styles.examGrid}>
              <div className={styles.examCard}>
                <div className={styles.examCardTitle}>🏭 本番サービス（厳格型）</div>
                <div className={styles.examStars}>★★★★★</div>
                <div className={styles.examDesc}>
                  Coverage ≥ 85%、重複 ≤ 2%、Blocker Issue 0件絶対。セキュリティ評価 A
                  必須。リリース頻度が高く、ダウンタイムのコストが大きいサービス向け。
                </div>
              </div>
              <div className={styles.examCard}>
                <div className={styles.examCardTitle}>🚀 スタートアップ MVP（段階的型）</div>
                <div className={styles.examStars}>★★★☆☆</div>
                <div className={styles.examDesc}>
                  Coverage ≥ 60% から開始し、フェーズごとに締め付け。Blocker のみブロック、Major
                  以下は警告のみ。スピードと品質のバランスを取る。
                </div>
              </div>
              <div className={styles.examCard}>
                <div className={styles.examCardTitle}>🔬 実験的プロジェクト（緩和型）</div>
                <div className={styles.examStars}>★★☆☆☆</div>
                <div className={styles.examDesc}>
                  Hotspot レビューのみ必須。Coverage
                  要件なし。PoC・研究目的のプロジェクトで、品質よりも開発速度を優先するケース。
                </div>
              </div>
            </div>

            <h3 className={styles.sectionTitle}>6.4 段階的締め付け戦略（レガシー移行期）</h3>
            <div className={styles.progressList}>
              <div className={styles.progressItem}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>Phase 1（導入期）: Coverage ≥ 50%</span>
                  <span className={styles.progressValue}>50%</span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressBar}
                    style={{ "--bar-width": "50%", "--delay": "0s" } as React.CSSProperties}
                  />
                </div>
              </div>
              <div className={styles.progressItem}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>Phase 2（安定期）: Coverage ≥ 70%</span>
                  <span className={styles.progressValue}>70%</span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressBar}
                    style={{ "--bar-width": "70%", "--delay": "0.2s" } as React.CSSProperties}
                  />
                </div>
              </div>
              <div className={styles.progressItem}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>Phase 3（成熟期）: Coverage ≥ 80%</span>
                  <span className={styles.progressValue}>80%</span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressBar}
                    style={{ "--bar-width": "80%", "--delay": "0.4s" } as React.CSSProperties}
                  />
                </div>
              </div>
              <div className={styles.progressItem}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>Phase 4（最終目標）: Coverage ≥ 85%</span>
                  <span className={styles.progressValue}>85%</span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressBar}
                    style={{ "--bar-width": "85%", "--delay": "0.6s" } as React.CSSProperties}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CHAPTER 7 ==================== */}
        <section id="ch7" className={styles.chapterSection}>
          <div className={styles.container}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNum}>CH 07</span>
              <span className={styles.kLevel}>K-Level: K4–K6</span>
              <h2 className={styles.chapterTitle}>Quality Profiles とカスタムルール</h2>
            </div>

            <p className={styles.paragraph}>
              <strong>定義：</strong> Quality Profile
              は解析時に適用するルールセットを定義する設定。プロジェクト単位・言語単位で割り当て可能。Sonar
              way は SonarSource が提供する読み取り専用の推奨プロファイル。
            </p>

            <h3 className={styles.sectionTitle}>7.1 継承戦略：Sonar way を直接変更しない</h3>
            <div className={styles.mermaidWrap}>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_CH7} />
              </div>
            </div>

            <div className={`${styles.alert} ${styles.alertGreen}`}>
              ✅ 継承により、Sonar way
              が更新された際の新ルールを子プロファイルが自動的に受け継ぐ。Sonar way
              を直接コピーしてカスタマイズすると、この自動更新の恩恵を失う。
            </div>

            <h3 className={styles.sectionTitle}>7.2 カスタムルールの追加（3 つの方法）</h3>

            <div className={styles.subsectionTitle}>方法 1：XPath ルール（UIから即座に作成）</div>
            <p className={styles.paragraph}>
              Quality Profiles → ルール詳細画面 →
              テンプレートから作成。テンプレートが存在する言語のみ利用可能。実装コストが低いが機能は限定的。
            </p>

            <div className={styles.subsectionTitle}>方法 2：Java Plugin API（フル機能・推奨）</div>
            <div className={styles.codeBlockHeader}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.codeDotRed}`} />
                <div className={`${styles.codeDot} ${styles.codeDotAmber}`} />
                <div className={`${styles.codeDot} ${styles.codeDotGreen}`} />
              </div>
              <span className={styles.codeLang}>JAVA — カスタムルール実装例</span>
              <CodeCopyButton
                text={`@Rule(key = "NoSystemOutPrintlnRule")
public class NoSystemOutPrintlnRule extends IssuableSubscriptionVisitor {

  // 監視するAST ノード AST ノード種別を宣言
  @Override
  public List<Tree.Kind> nodesToVisit() {
    return Collections.singletonList(Tree.Kind.EXPRESSION_STATEMENT);
  }

  @Override
  public void visitNode(Tree tree) {
    ExpressionStatementTree expr = (ExpressionStatementTree) tree;
    String text = expr.firstToken().text();
    if (text.contains("System.out.println")) {
      reportIssue(tree,
        "System.out.println を使用しないでください。" +
        "ロガーを使用してください。");
    }
  }
}`}
              />
            </div>
            <pre className={styles.codeBlock}>
              <div className={styles.codeLine}>
                <span className={styles.codeKeyword}>@Rule</span>(key ={" "}
                <span className={styles.codeString}>"NoSystemOutPrintlnRule"</span>)
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeKeyword}>public class</span>{" "}
                <span className={styles.codeCyan}>NoSystemOutPrintlnRule</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeKeyword}>extends</span> IssuableSubscriptionVisitor{" "}
                {"{"}
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeComment}>{"// 監視するAST ノード種別を宣言"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeKeyword}>@Override</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeKeyword}>public</span> List&lt;Tree.Kind&gt;{" "}
                <span className={styles.codeGreen}>nodesToVisit</span>() {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeKeyword}>return</span>{" "}
                Collections.singletonList(Tree.Kind.EXPRESSION_STATEMENT);
              </div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeKeyword}>@Override</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeKeyword}>public void</span>{" "}
                <span className={styles.codeGreen}>visitNode</span>(Tree tree) {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                ExpressionStatementTree expr = (ExpressionStatementTree) tree;
              </div>
              <div className={styles.codeLine}> String text = expr.firstToken().text();</div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeKeyword}>if</span> (text.contains(
                <span className={styles.codeString}>"System.out.println"</span>)) {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>reportIssue</span>(tree,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeString}>
                  "System.out.println を使用しないでください。"
                </span>{" "}
                +
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeString}>"ロガーを使用してください。"</span>);
              </div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}>{"}"}</div>
            </pre>

            <div className={styles.subsectionTitle}>
              方法 3：Generic Issue Format（外部ツール結果のインポート）
            </div>
            <p className={styles.paragraph}>
              ESLint・Semgrep・Checkstyle 等の結果を JSON 形式で SonarQube に取り込む。
            </p>
            <div className={styles.compareGrid}>
              <div className={`${styles.compareCard} ${styles.compareGood}`}>
                <div className={styles.compareHeader}>✅ レポート JSON 形式</div>
                <div className={styles.codeBlockHeader}>
                  <span className={styles.codeLang}>JSON</span>
                  <CodeCopyButton
                    text={`{
  "issues": [{
    "engineId": "eslint",
    "ruleId": "no-console",
    "severity": "MINOR",
    "type": "CODE_SMELL",
    "primaryLocation": {
      "message": "console.log を避けて",
      "filePath": "src/helper.js",
      "textRange": {
        "startLine": 42,
        "endLine": 42
      }
    }
  }]
}`}
                  />
                </div>
                <pre className={styles.codeBlock}>
                  <div className={styles.codeLine}>{"{"}</div>
                  <div className={styles.codeLine}>
                    {" "}
                    <span className={styles.codeGreen}>"issues"</span>: [{"{"}
                  </div>
                  <div className={styles.codeLine}>
                    {" "}
                    <span className={styles.codeCyan}>"engineId"</span>:{" "}
                    <span className={styles.codeString}>"eslint"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {" "}
                    <span className={styles.codeCyan}>"ruleId"</span>:{" "}
                    <span className={styles.codeString}>"no-console"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {" "}
                    <span className={styles.codeCyan}>"severity"</span>:{" "}
                    <span className={styles.codeString}>"MINOR"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {" "}
                    <span className={styles.codeCyan}>"type"</span>:{" "}
                    <span className={styles.codeString}>"CODE_SMELL"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {" "}
                    <span className={styles.codeCyan}>"primaryLocation"</span>: {"{"}
                  </div>
                  <div className={styles.codeLine}>
                    {" "}
                    <span className={styles.codeGreen}>"message"</span>:{" "}
                    <span className={styles.codeString}>"console.log を避けて"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {" "}
                    <span className={styles.codeGreen}>"filePath"</span>:{" "}
                    <span className={styles.codeString}>"src/helper.js"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {" "}
                    <span className={styles.codeGreen}>"textRange"</span>: {"{"}
                  </div>
                  <div className={styles.codeLine}>
                    {" "}
                    <span className={styles.codeAmber}>"startLine"</span>:{" "}
                    <span className={styles.codeNum}>42</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {" "}
                    <span className={styles.codeAmber}>"endLine"</span>:{" "}
                    <span className={styles.codeNum}>42</span>
                  </div>
                  <div className={styles.codeLine}> {"}"}</div>
                  <div className={styles.codeLine}> {"}"}</div>
                  <div className={styles.codeLine}> {"}"}]</div>
                  <div className={styles.codeLine}>{"}"}</div>
                </pre>
              </div>
              <div className={`${styles.compareCard} ${styles.compareBad}`}>
                <div className={styles.compareHeader}>❌ スキャナーコマンド例（NG）</div>
                <div className={styles.codeBlockHeader}>
                  <span className={styles.codeLang}>BASH</span>
                  <CodeCopyButton
                    text={`# NG: レポートパスを指定しない
sonar-scanner

# OK: 明示的にレポートパスを指定
sonar-scanner \\
  -Dsonar.externalIssuesReportPaths=eslint-report.json

# また engineId は必須（ないと無視）
# type フィールドも必須`}
                  />
                </div>
                <pre className={styles.codeBlock}>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># NG: レポートパスを指定しない</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeRed}>sonar-scanner</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># OK: 明示的にレポートパスを指定</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeGreen}>sonar-scanner</span> \
                  </div>
                  <div className={styles.codeLine}>
                    {" "}
                    <span className={styles.codeCyan}>-Dsonar.externalIssues</span>\
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeCyan}> ReportPaths</span>=
                    <span className={styles.codeString}>eslint-report.json</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># また engineId は必須（ないと無視）</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}># type フィールドも必須</span>
                  </div>
                </pre>
              </div>
            </div>

            <h3 className={styles.sectionTitle}>
              7.3 MQR モードでのカスタムルール作成時の設定項目
            </h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>フィールド</th>
                    <th>選択肢</th>
                    <th>説明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Type</td>
                    <td>Issue / Security Hotspot</td>
                    <td>Issue または Hotspot のどちらか</td>
                  </tr>
                  <tr>
                    <td>Category</td>
                    <td>Consistency / Intentionality / Adaptability / Responsibility</td>
                    <td>Clean Code 属性のカテゴリ</td>
                  </tr>
                  <tr>
                    <td>Software Quality</td>
                    <td>Security / Reliability / Maintainability</td>
                    <td>複数選択可能（MQR の特長）</td>
                  </tr>
                  <tr>
                    <td>Severity</td>
                    <td>Blocker / High / Medium / Low / Info</td>
                    <td>品質特性ごとに設定</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ==================== CHAPTER 8 ==================== */}
        <section id="ch8" className={styles.chapterSection}>
          <div className={styles.container}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNum}>CH 08</span>
              <span className={styles.kLevel}>K-Level: K3–K4</span>
              <h2 className={styles.chapterTitle}>セキュリティ解析の徹底活用</h2>
            </div>

            <h3 className={styles.sectionTitle}>8.1 Security Hotspot レビューワークフロー</h3>
            <p className={styles.paragraph}>
              <strong>定義：</strong> Security Hotspot
              は脆弱性ではなく「セキュリティに敏感なコード」。深刻度は付与されず、必ず人間によるレビューが必要。レビュー後に
              Safe または Vulnerability に分類される。
            </p>

            <div className={styles.mermaidWrap}>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_CH8} />
              </div>
            </div>

            <h3 className={styles.sectionTitle}>8.2 セキュリティルールの2種類</h3>
            <div className={styles.archLayers}>
              <div
                className={styles.archLayer}
                style={{ "--layer-color": "var(--neon-red)" } as React.CSSProperties}
              >
                <span className={styles.archLayerLabel}>Security-Injection</span>
                <span className={styles.archLayerDesc}>
                  インジェクション脆弱性を検出。Taint Analysis
                  で汚染データの流れを追跡（SQL/XSS/SSRF 等）
                </span>
              </div>
              <div
                className={styles.archLayer}
                style={{ "--layer-color": "var(--neon-amber)" } as React.CSSProperties}
              >
                <span className={styles.archLayerLabel}>Security-Configuration</span>
                <span className={styles.archLayerDesc}>
                  誤った設定を検出（無効な暗号化アルゴリズム・TLS バージョン・権限チェック漏れ等）
                </span>
              </div>
            </div>

            <h3 className={styles.sectionTitle}>8.3 Taint Analysis のカスタム設定（Enterprise）</h3>
            <p className={styles.paragraph}>
              自社フレームワーク固有のソース・サニタイザー・シンクを登録し、解析精度を向上させる。
            </p>
            <div className={styles.codeBlockHeader}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.codeDotRed}`} />
                <div className={`${styles.codeDot} ${styles.codeDotAmber}`} />
                <div className={`${styles.codeDot} ${styles.codeDotGreen}`} />
              </div>
              <span className={styles.codeLang}>XML — セキュリティエンジン カスタム設定</span>
              <CodeCopyButton
                text={`<!-- security-custom-config.xml -->
<customConfiguration>
  <sources>
    <method>
      <name>getCustomInput</name>
      <className>com.example.CustomRequestWrapper</className>
    </method>
  </sources>
  <sanitizers>
    <method>
      <name>sanitizeInput</name>
      <className>com.example.InputSanitizer</className>
    </method>
  </sanitizers>
  <sinks>
    <method>
      <name>executeQuery</name>
      <className>com.example.CustomDbWrapper</className>
      <args>0</args>   <!-- 第1引数が汚染チェック対象 -->
    </method>
  </sinks>
</customConfiguration>`}
              />
            </div>
            <pre className={styles.codeBlock}>
              <div className={styles.codeLine}>
                <span className={styles.codeComment}>{"<!-- security-custom-config.xml -->"}</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeKeyword}>&lt;customConfiguration&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>&lt;sources&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>&lt;method&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>&lt;name&gt;</span>getCustomInput
                <span className={styles.codeAmber}>&lt;/name&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>&lt;className&gt;</span>
                com.example.CustomRequestWrapper
                <span className={styles.codeAmber}>&lt;/className&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>&lt;/method&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>&lt;/sources&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>&lt;sanitizers&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>&lt;method&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>&lt;name&gt;</span>sanitizeInput
                <span className={styles.codeAmber}>&lt;/name&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>&lt;className&gt;</span>
                com.example.InputSanitizer
                <span className={styles.codeAmber}>&lt;/className&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>&lt;/method&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>&lt;/sanitizers&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>&lt;sinks&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>&lt;method&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>&lt;name&gt;</span>executeQuery
                <span className={styles.codeAmber}>&lt;/name&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>&lt;className&gt;</span>
                com.example.CustomDbWrapper
                <span className={styles.codeAmber}>&lt;/className&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>&lt;args&gt;</span>0
                <span className={styles.codeAmber}>&lt;/args&gt;</span>{" "}
                <span className={styles.codeComment}>{"<!-- 第1引数が汚染チェック対象 -->"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>&lt;/method&gt;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>&lt;/sinks&gt;</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeKeyword}>&lt;/customConfiguration&gt;</span>
              </div>
            </pre>

            <h3 className={styles.sectionTitle}>8.4 対応セキュリティ標準一覧</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>標準</th>
                    <th>対応内容</th>
                    <th>エディション</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>OWASP Top 10 2021</td>
                    <td>A01〜A10 全カテゴリのルールマッピング</td>
                    <td>全エディション</td>
                  </tr>
                  <tr>
                    <td>OWASP ASVS</td>
                    <td>Level 1〜3 の要件に対応</td>
                    <td>全エディション</td>
                  </tr>
                  <tr>
                    <td>CWE Top 25</td>
                    <td>個別 CWE 番号でフィルタリング可能</td>
                    <td>全エディション</td>
                  </tr>
                  <tr>
                    <td>SANS Top 25</td>
                    <td>全 25 カテゴリに対応</td>
                    <td>全エディション</td>
                  </tr>
                  <tr>
                    <td>PCI DSS</td>
                    <td>関連ルールをタグで識別</td>
                    <td>Enterprise 以上</td>
                  </tr>
                  <tr>
                    <td>MISRA C++ 2023</td>
                    <td>組み込みシステム向けルール</td>
                    <td>Enterprise 以上</td>
                  </tr>
                  <tr>
                    <td>CERT C/C++/Java</td>
                    <td>CERT 標準への対応</td>
                    <td>Developer 以上</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ==================== CHAPTER 9 ==================== */}
        <section id="ch9" className={styles.chapterSection}>
          <div className={styles.container}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNum}>CH 09</span>
              <span className={styles.kLevel}>K-Level: K3–K4</span>
              <h2 className={styles.chapterTitle}>AI エージェント統合（2026 最新機能）</h2>
            </div>

            <h3 className={styles.sectionTitle}>
              9.1 AI 統合の全体像：Guide → Generate → Verify ループ
            </h3>
            <div className={styles.mermaidWrap}>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_CH9} />
              </div>
            </div>

            <h3 className={styles.sectionTitle}>9.2 SonarQube MCP Server のセットアップ</h3>
            <p className={styles.paragraph}>
              <strong>定義：</strong> MCP（Model Context Protocol）サーバーは AI エージェントと
              SonarQube を接続するブリッジ。Claude Code・Cursor・VS Code +
              Copilot・Windsurf・Kiro・Zed 等と接続できる。
            </p>

            <div className={styles.codeBlockHeader}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.codeDotRed}`} />
                <div className={`${styles.codeDot} ${styles.codeDotAmber}`} />
                <div className={`${styles.codeDot} ${styles.codeDotGreen}`} />
              </div>
              <span className={styles.codeLang}>
                JSON — MCP Server 設定（Claude Code / Cursor）
              </span>
              <CodeCopyButton
                text={`{
  "mcpServers": {
    "sonarqube": {
      "command": "docker",
      "args": [
        "run", "--init", "--pull=always",
        "-i", "--rm",
        "-e", "SONARQUBE_TOKEN",
        "-e", "SONARQUBE_ORG",
        "mcp/sonarqube"
      ],
      "env": {
        "SONARQUBE_TOKEN": "<YOUR_PROJECT_ANALYSIS_TOKEN>",
        "SONARQUBE_ORG": "<YOUR_ORG_KEY>"
      }
    }
  }
}`}
              />
            </div>
            <pre className={styles.codeBlock}>
              <div className={styles.codeLine}>{"{"}</div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>"mcpServers"</span>: {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>"sonarqube"</span>: {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>"command"</span>:{" "}
                <span className={styles.codeString}>"docker"</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>"args"</span>: [
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeString}>"run"</span>,{" "}
                <span className={styles.codeString}>"--init"</span>,{" "}
                <span className={styles.codeString}>"--pull=always"</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeString}>"-i"</span>,{" "}
                <span className={styles.codeString}>"--rm"</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeString}>"-e"</span>,{" "}
                <span className={styles.codeString}>"SONARQUBE_TOKEN"</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeString}>"-e"</span>,{" "}
                <span className={styles.codeString}>"SONARQUBE_ORG"</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeString}>"mcp/sonarqube"</span>
              </div>
              <div className={styles.codeLine}> ],</div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>"env"</span>: {"{"}
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>"SONARQUBE_TOKEN"</span>:{" "}
                <span className={styles.codeString}>"&lt;YOUR_PROJECT_ANALYSIS_TOKEN&gt;"</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>"SONARQUBE_ORG"</span>:{" "}
                <span className={styles.codeString}>"&lt;YOUR_ORG_KEY&gt;"</span>
              </div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}>{"}"}</div>
            </pre>

            <h3 className={styles.sectionTitle}>9.3 利用可能なツールセット</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ツールセット</th>
                    <th>提供する能力</th>
                    <th>要件</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>issues</code>
                    </td>
                    <td>Issue の取得・フィルタリング・コメント追加</td>
                    <td>標準（無料）</td>
                  </tr>
                  <tr>
                    <td>
                      <code>quality-gates</code>
                    </td>
                    <td>QG ステータス確認</td>
                    <td>標準（無料）</td>
                  </tr>
                  <tr>
                    <td>
                      <code>security-hotspots</code>
                    </td>
                    <td>Hotspot のレビュー支援</td>
                    <td>標準（無料）</td>
                  </tr>
                  <tr>
                    <td>
                      <code>coverage</code>
                    </td>
                    <td>テストカバレッジ情報の取得</td>
                    <td>標準（無料）</td>
                  </tr>
                  <tr>
                    <td>
                      <code>analysis</code>
                    </td>
                    <td>コードスニペット of 即時解析（Agentic Analysis）</td>
                    <td>Cloud アドオン</td>
                  </tr>
                  <tr>
                    <td>
                      <code>cag</code>
                    </td>
                    <td>Context Augmentation（コールフロー・ガイドライン・SCA）</td>
                    <td>Cloud アドオン</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className={styles.sectionTitle}>9.4 Context Augmentation の 4 カテゴリ</h3>
            <div className={styles.trendGrid}>
              <div
                className={styles.trendCard}
                style={{ "--trend-color": "var(--neon-cyan)" } as React.CSSProperties}
              >
                <span className={styles.trendIcon}>📖</span>
                <div className={styles.trendCardTitle}>ガイドライン (Guidelines)</div>
                <div className={styles.trendCardDesc}>
                  エージェントのプロンプト内容に基づき、関連する Sonar ルールを LLM
                  コンテキストに挿入。DB アクセス操作なら SQL インジェクション関連ルールを自動注入。
                </div>
              </div>
              <div
                className={styles.trendCard}
                style={{ "--trend-color": "var(--neon-green)" } as React.CSSProperties}
              >
                <span className={styles.trendIcon}>🔭</span>
                <div className={styles.trendCardTitle}>コードナビゲーション</div>
                <div className={styles.trendCardDesc}>
                  テキスト検索ではなく、コールスタック・クラス階層・参照情報に基づきコードベースを意味的に探索。エージェントが正確な箇所を修正できる。
                </div>
              </div>
              <div
                className={styles.trendCard}
                style={{ "--trend-color": "var(--neon-amber)" } as React.CSSProperties}
              >
                <span className={styles.trendIcon}>📦</span>
                <div className={styles.trendCardTitle}>依存関係ガイダンス</div>
                <div className={styles.trendCardDesc}>
                  新規ライブラリ追加前に、既知の脆弱性・サプライチェーンマルウェア・ライセンス準拠を事前確認（SCA
                  機能）。
                </div>
              </div>
              <div
                className={styles.trendCard}
                style={{ "--trend-color": "var(--neon-purple)" } as React.CSSProperties}
              >
                <span className={styles.trendIcon}>🧬</span>
                <div className={styles.trendCardTitle}>コーディング標準</div>
                <div className={styles.trendCardDesc}>
                  プロジェクト固有の過去 Issue
                  傾向を分析し、エージェントが行おうとしている操作に関連する標準ルールを推奨。
                </div>
              </div>
            </div>

            <h3 className={styles.sectionTitle}>9.5 Remediation Agent（Beta）</h3>
            <div className={`${styles.callout} ${styles.calloutInfo}`}>
              <div className={styles.calloutIcon}>🤖</div>
              <div className={styles.calloutBody}>
                <p className={styles.calloutTitle}>Remediation Agent とは</p>
                <p>
                  SonarQube Cloud の Team（年間）/ Enterprise プランで利用可能。PR の Issue
                  を自動修正する AI エージェント。「Assign to
                  Agent」ボタンをクリックするとエージェントが独立して Issue を解析・修正 PR
                  を作成し、開発者がレビューして承認する。Reliability・Maintainability Issue
                  に対応（Beta フェーズ）。
                </p>
              </div>
            </div>
            <div className={`${styles.alert} ${styles.alertAmber}`}>
              ⚠️ Security Issue への自動修正は必ず人間の最終確認が必須。Remediation Agent
              の提案は参考情報として扱い、盲目的に適用しないこと。
            </div>
          </div>
        </section>

        {/* ==================== CHAPTER 10 ==================== */}
        <section id="ch10" className={styles.chapterSection}>
          <div className={styles.container}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNum}>CH 10</span>
              <span className={styles.kLevel}>K-Level: K3–K4</span>
              <h2 className={styles.chapterTitle}>Web API による自動化</h2>
            </div>

            <h3 className={styles.sectionTitle}>10.1 主要 API エンドポイント</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>エンドポイント</th>
                    <th>用途</th>
                    <th>メソッド</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>/api/qualitygates/project_status</code>
                    </td>
                    <td>プロジェクトの QG ステータス取得</td>
                    <td>GET</td>
                  </tr>
                  <tr>
                    <td>
                      <code>/api/issues/search</code>
                    </td>
                    <td>Issue の検索・フィルタリング</td>
                    <td>GET</td>
                  </tr>
                  <tr>
                    <td>
                      <code>/api/measures/component</code>
                    </td>
                    <td>メトリクス値の取得</td>
                    <td>GET</td>
                  </tr>
                  <tr>
                    <td>
                      <code>/api/projects/search</code>
                    </td>
                    <td>プロジェクト一覧取得</td>
                    <td>GET</td>
                  </tr>
                  <tr>
                    <td>
                      <code>/api/qualityprofiles/search</code>
                    </td>
                    <td>Quality Profile 一覧取得</td>
                    <td>GET</td>
                  </tr>
                  <tr>
                    <td>
                      <code>/api/webhooks/create</code>
                    </td>
                    <td>Webhook の登録</td>
                    <td>POST</td>
                  </tr>
                  <tr>
                    <td>
                      <code>/api/user_tokens/generate</code>
                    </td>
                    <td>API トークン発行</td>
                    <td>POST</td>
                  </tr>
                  <tr>
                    <td>
                      <code>/api/hotspots/search</code>
                    </td>
                    <td>Security Hotspot 一覧取得</td>
                    <td>GET</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className={styles.sectionTitle}>10.2 Quality Gate ステータスの取得（cURL）</h3>
            <div className={styles.codeBlockHeader}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.codeDotRed}`} />
                <div className={`${styles.codeDot} ${styles.codeDotAmber}`} />
                <div className={`${styles.codeDot} ${styles.codeDotGreen}`} />
              </div>
              <span className={styles.codeLang}>BASH — QG ステータス確認</span>
              <CodeCopyButton
                text={`curl -u "\${SONAR_TOKEN}:" \\
  "\${SONAR_HOST_URL}/api/qualitygates/project_status" \\
  ?projectKey=com.example:my-service \\
  &branch=main \\
  | jq '{
      status: .projectStatus.status,
      failedConditions: [
        .projectStatus.conditions[] |
        select(.status != "OK") |
        {
          metric: .metricKey,
          actual: .actualValue,
          threshold: .errorThreshold
        }
      ]
    }'`}
              />
            </div>
            <pre className={styles.codeBlock}>
              <div className={styles.codeLine}>
                <span className={styles.codeComment}>
                  # QG ステータスを JSON で取得して jq で整形
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>curl</span> -u{" "}
                <span className={styles.codeString}>{'"${SONAR_TOKEN}:"'}</span> \
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeString}>
                  {'"${SONAR_HOST_URL}/api/qualitygates/project_status"'}
                </span>{" "}
                \
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>?projectKey</span>=
                <span className={styles.codeString}>com.example:my-service</span> \
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>&amp;branch</span>=
                <span className={styles.codeString}>main</span> \
              </div>
              <div className={styles.codeLine}>
                {" "}
                | jq <span className={styles.codeString}>'{"{"}</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeString}> status: .projectStatus.status,</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeString}> failedConditions: [</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeString}> .projectStatus.conditions[] |</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeString}> select(.status != "OK") |</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeString}> {"{"}</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeString}> metric: .metricKey,</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeString}> actual: .actualValue,</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeString}> threshold: .errorThreshold</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeString}> {"}"}</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeString}> ]</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeString}> {"}"}'</span>
              </div>
            </pre>

            <h3 className={styles.sectionTitle}>10.3 Issue サマリーの自動生成（Python）</h3>
            <div className={styles.codeBlockHeader}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.codeDotRed}`} />
                <div className={`${styles.codeDot} ${styles.codeDotAmber}`} />
                <div className={`${styles.codeDot} ${styles.codeDotGreen}`} />
              </div>
              <span className={styles.codeLang}>PYTHON — New Code Issue サマリー取得</span>
              <CodeCopyButton
                text={`import requests
import os

SONAR_TOKEN = os.environ["SONAR_TOKEN"]
SONAR_HOST  = os.environ["SONAR_HOST_URL"]
PROJECT_KEY = "com.example:my-service"

def get_new_code_issues(branch: str = "main") -> dict:
    """新規コードの Issue サマリーを取得"""
    params = {
        "componentKeys": PROJECT_KEY,
        "resolved": "false",
        "sinceLeakPeriod": "true",  # New Code のみ
        "branch": branch,
        "facets": "types,severities",
        "ps": 1  # カウントのみ必要
    }
    resp = requests.get(
        f"{SONAR_HOST}/api/issues/search",
        params=params,
        auth=(SONAR_TOKEN, "")
    )
    resp.raise_for_status()
    return resp.json()

issues = get_new_code_issues()
print(f"New Code Issues: {issues['total']}")
for facet in issues.get("facets", []):
    if facet["property"] == "types":
        for v in facet["values"]:
            print(f"  {v['val']}: {v['count']}")`}
              />
            </div>
            <pre className={styles.codeBlock}>
              <div className={styles.codeLine}>
                <span className={styles.codeKeyword}>import</span> requests
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeKeyword}>import</span> os
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                SONAR_TOKEN = os.environ[<span className={styles.codeString}>"SONAR_TOKEN"</span>]
              </div>
              <div className={styles.codeLine}>
                SONAR_HOST = os.environ[<span className={styles.codeString}>"SONAR_HOST_URL"</span>]
              </div>
              <div className={styles.codeLine}>
                PROJECT_KEY = <span className={styles.codeString}>"com.example:my-service"</span>
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.codeKeyword}>def</span>{" "}
                <span className={styles.codeGreen}>get_new_code_issues</span>(branch: str ={" "}
                <span className={styles.codeString}>"main"</span>) -&gt; dict:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeString}>"""新規コードの Issue サマリーを取得"""</span>
              </div>
              <div className={styles.codeLine}> params = {"{"}</div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeString}>"componentKeys"</span>: PROJECT_KEY,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeString}>"resolved"</span>:{" "}
                <span className={styles.codeString}>"false"</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeString}>"sinceLeakPeriod"</span>:{" "}
                <span className={styles.codeString}>"true"</span>,{" "}
                <span className={styles.codeComment}># New Code のみ</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeString}>"branch"</span>: branch,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeString}>"facets"</span>:{" "}
                <span className={styles.codeString}>"types,severities"</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeString}>"ps"</span>:{" "}
                <span className={styles.codeNum}>1</span>{" "}
                <span className={styles.codeComment}># カウントのみ必要</span>
              </div>
              <div className={styles.codeLine}> {"}"}</div>
              <div className={styles.codeLine}> resp = requests.get(</div>
              <div className={styles.codeLine}>
                {" "}
                f<span className={styles.codeString}>"{"{SONAR_HOST}"}/api/issues/search"</span>,
              </div>
              <div className={styles.codeLine}> params=params,</div>
              <div className={styles.codeLine}>
                {" "}
                auth=(SONAR_TOKEN, <span className={styles.codeString}>""</span>)
              </div>
              <div className={styles.codeLine}> )</div>
              <div className={styles.codeLine}> resp.raise_for_status()</div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeKeyword}>return</span> resp.json()
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>issues = get_new_code_issues()</div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>print</span>(f
                <span className={styles.codeString}>"New Code Issues: {"{issues['total']}"}"</span>)
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeKeyword}>for</span> facet{" "}
                <span className={styles.codeKeyword}>in</span> issues.get(
                <span className={styles.codeString}>"facets"</span>, []):
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeKeyword}>if</span> facet[
                <span className={styles.codeString}>"property"</span>] =={" "}
                <span className={styles.codeString}>"types"</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeKeyword}>for</span> v{" "}
                <span className={styles.codeKeyword}>in</span> facet[
                <span className={styles.codeString}>"values"</span>]:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>print</span>(f
                <span className={styles.codeString}>" {"{v['val']}: {v['count']}"}"</span>)
              </div>
            </pre>
          </div>
        </section>

        {/* ==================== CHAPTER 11 ==================== */}
        <section id="ch11" className={styles.chapterSection}>
          <div className={styles.container}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNum}>CH 11</span>
              <span className={styles.kLevel}>K-Level: K2–K4</span>
              <h2 className={styles.chapterTitle}>運用ベストプラクティス</h2>
            </div>

            <h3 className={styles.sectionTitle}>11.1 段階的導入ロードマップ</h3>
            <div className={styles.mermaidWrap}>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_CH11} />
              </div>
            </div>

            <h3 className={styles.sectionTitle}>11.2 Issue 優先度付けの指針</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>優先度</th>
                    <th>対象 Issue</th>
                    <th>対応方針</th>
                    <th>目安</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>🔴 最高</td>
                    <td>Blocker Bug / Blocker Vulnerability</td>
                    <td>即座に修正・リリースブロック</td>
                    <td>当日中</td>
                  </tr>
                  <tr>
                    <td>🟠 高</td>
                    <td>Critical Bug / Vulnerability</td>
                    <td>次スプリントで必ず修正</td>
                    <td>1週間以内</td>
                  </tr>
                  <tr>
                    <td>🟡 中</td>
                    <td>Major Code Smell / Minor Vulnerability</td>
                    <td>バックログに積み、計画的に対応</td>
                    <td>1ヶ月以内</td>
                  </tr>
                  <tr>
                    <td>🟢 低</td>
                    <td>Info / Minor Code Smell</td>
                    <td>余裕があれば対応</td>
                    <td>随時</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className={styles.sectionTitle}>11.3 False Positive への対応ポリシー</h3>
            <div className={styles.compareGrid}>
              <div className={`${styles.compareCard} ${styles.compareGood}`}>
                <div className={styles.compareHeader}>✅ 正しい NOSONAR の使い方</div>
                <div className={styles.codeBlockHeader}>
                  <span className={styles.codeLang}>JAVA</span>
                  <CodeCopyButton
                    text={`// 設計上の例外：この箇所は意図的に
// System.out を使用する必要がある
// 理由：シャットダウンフック内でロガーが
// 利用不可のため（PR #123 で議論済み）
System.out.println("Shutdown"); // NOSONAR`}
                  />
                </div>
                <pre className={styles.codeBlock}>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}>
                      {"// 設計上の例外：この箇所は意図的に"}
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}>
                      {"// System.out を使用する必要がある"}
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}>
                      {"// 理由：シャットダウンフック内でロガーが"}
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}>
                      {"// 利用不可のため（PR #123 で議論済み）"}
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    System.out.println(<span className={styles.codeString}>"Shutdown"</span>);{" "}
                    <span className={styles.codeComment}>{"// NOSONAR"}</span>
                  </div>
                </pre>
              </div>
              <div className={`${styles.compareCard} ${styles.compareBad}`}>
                <div className={styles.compareHeader}>❌ 乱用パターン</div>
                <div className={styles.codeBlockHeader}>
                  <span className={styles.codeLang}>JAVA</span>
                  <CodeCopyButton
                    text={`// 理由なし・説明なし・大量 NOSONAR
// 全行に NOSONAR を付けてメトリクスを誤魔化す

String sql = "SELECT * FROM users WHERE id=" + id; // NOSONAR
someMethod(password); // NOSONAR
eval(userInput); // NOSONAR`}
                  />
                </div>
                <pre className={styles.codeBlock}>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}>
                      {"// 理由なし・説明なし・大量 NOSONAR"}
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeComment}>
                      {"// 全行に NOSONAR を付けてメトリクスを誤魔化す"}
                    </span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.codeRed}>
                      {'String sql = "SELECT * FROM users WHERE id=" + id; // NOSONAR'}
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeRed}>{"someMethod(password); // NOSONAR"}</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeRed}>{"eval(userInput); // NOSONAR"}</span>
                  </div>
                </pre>
              </div>
            </div>

            <h3 className={styles.sectionTitle}>11.4 パフォーマンスチューニング</h3>
            <div className={styles.subsectionTitle}>除外設定で解析対象を最小化</div>
            <div className={styles.codeBlockHeader}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.codeDotRed}`} />
                <div className={`${styles.codeDot} ${styles.codeDotAmber}`} />
                <div className={`${styles.codeDot} ${styles.codeDotGreen}`} />
              </div>
              <span className={styles.codeLang}>PROPERTIES — 解析パフォーマンス最適化</span>
              <CodeCopyButton
                text={`# 自動生成・サードパーティを除外
sonar.exclusions=**/node_modules/**,**/vendor/**,**/dist/**,**/generated/**

# JVM ヒープサイズ拡張（大規模プロジェクト）
sonar.java.jvmArgs=-Xmx4g -Xms512m

# スキャナーキャッシュディレクトリ指定
sonar.scanner.cacheDirectory=/opt/sonar-cache`}
              />
            </div>
            <pre className={styles.codeBlock}>
              <div className={styles.codeLine}>
                <span className={styles.codeComment}># 自動生成・サードパーティを除外</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.exclusions</span>=
                <span className={styles.codeString}>
                  **/node_modules/**,**/vendor/**,**/dist/**,**/generated/**
                </span>
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.codeComment}>
                  # JVM ヒープサイズ拡張（大規模プロジェクト）
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.java.jvmArgs</span>=
                <span className={styles.codeString}>-Xmx4g -Xms512m</span>
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.codeComment}># スキャナーキャッシュディレクトリ指定</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>sonar.scanner.cacheDirectory</span>=
                <span className={styles.codeString}>/opt/sonar-cache</span>
              </div>
            </pre>

            <h3 className={styles.sectionTitle}>11.5 モノレポ対応</h3>
            <div className={styles.codeBlockHeader}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.codeDotRed}`} />
                <div className={`${styles.codeDot} ${styles.codeDotAmber}`} />
                <div className={`${styles.codeDot} ${styles.codeDotGreen}`} />
              </div>
              <span className={styles.codeLang}>YAML — GitHub Actions モノレポ並列解析</span>
              <CodeCopyButton
                text={`jobs:
  sonar-service-a:
    uses: ./.github/workflows/sonar-scan.yml
    with:
      project-key: com.example:service-a
      sources-path: services/service-a/src
    secrets: inherit

  sonar-service-b:
    uses: ./.github/workflows/sonar-scan.yml
    with:
      project-key: com.example:service-b
      sources-path: services/service-b/src
    secrets: inherit`}
              />
            </div>
            <pre className={styles.codeBlock}>
              <div className={styles.codeLine}>
                <span className={styles.codeGreen}>jobs</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>sonar-service-a</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>uses</span>: ./.github/workflows/sonar-scan.yml
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>with</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>project-key</span>:{" "}
                <span className={styles.codeString}>com.example:service-a</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>sources-path</span>:{" "}
                <span className={styles.codeString}>services/service-a/src</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>secrets</span>: inherit
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeCyan}>sonar-service-b</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>uses</span>: ./.github/workflows/sonar-scan.yml
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>with</span>:
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>project-key</span>:{" "}
                <span className={styles.codeString}>com.example:service-b</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeGreen}>sources-path</span>:{" "}
                <span className={styles.codeString}>services/service-b/src</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.codeAmber}>secrets</span>: inherit
              </div>
            </pre>

            <h3 className={styles.sectionTitle}>11.6 チーム文化への定着ポイント</h3>
            <div className={styles.stepList}>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>1</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>「最初の分析は穏やかに」</div>
                  <p className={styles.stepDesc}>
                    導入直後は Issue 数が膨大になりがち。最初の QG
                    は緩く設定し、チームの恐怖感を取り除く。
                  </p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>2</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>プルリクエスト文化と組み合わせる</div>
                  <p className={styles.stepDesc}>
                    PR デコレーションにより、レビュアーが SonarQube 結果を PR
                    画面で確認できるようにする。ツールを押し付けるのではなくワークフローに溶け込ませる。
                  </p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>3</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>ダッシュボードを可視化する</div>
                  <p className={styles.stepDesc}>
                    SonarQube のダッシュボードを CI/CD の状況ページや Slack
                    に定期通知。品質メトリクスをチームの共通言語にする。
                  </p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>4</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>定期的なルールレビュー</div>
                  <p className={styles.stepDesc}>
                    Quality Gate
                    の条件は四半期ごとにレビュー。ビジネス要件・チームの成熟度に応じて段階的に引き上げる。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== REFERENCES ==================== */}
        <section id="refs" className={styles.chapterSection}>
          <div className={styles.container}>
            <div className={styles.chapterHeader}>
              <span className={styles.chapterNum}>REFS</span>
              <h2 className={styles.chapterTitle}>参考文献・一次情報源</h2>
            </div>

            <div className={styles.refGrid}>
              <Ext href="https://docs.sonarsource.com/">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-green)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>🏠 一次情報源</div>
                  <div className={styles.refTitle}>SonarQube 公式ドキュメント入口</div>
                  <div className={styles.refUrl}>https://docs.sonarsource.com/</div>
                </div>
              </Ext>

              <Ext href="https://docs.sonarsource.com/sonarqube-server/analyzing-source-code/analysis-overview">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-green)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>📖 Server Docs</div>
                  <div className={styles.refTitle}>SonarQube Server 解析概要</div>
                  <div className={styles.refUrl}>
                    docs.sonarsource.com/sonarqube-server/analyzing-source-code/analysis-overview
                  </div>
                </div>
              </Ext>

              <Ext href="https://docs.sonarsource.com/sonarqube-server/user-guide/about-new-code">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-cyan)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>🌱 Clean as You Code</div>
                  <div className={styles.refTitle}>New Code の定義と CaYC アプローチ</div>
                  <div className={styles.refUrl}>
                    docs.sonarsource.com/sonarqube-server/user-guide/about-new-code
                  </div>
                </div>
              </Ext>

              <Ext href="https://docs.sonarsource.com/sonarqube-server/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-cyan)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>⚖️ Quality Gates</div>
                  <div className={styles.refTitle}>Quality Gate 概要と設計</div>
                  <div className={styles.refUrl}>
                    docs.sonarsource.com/.../introduction-to-quality-gates
                  </div>
                </div>
              </Ext>

              <Ext href="https://docs.sonarsource.com/sonarqube-server/analyzing-source-code/pull-request-analysis/introduction">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-purple)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>🔀 PR Analysis</div>
                  <div className={styles.refTitle}>PR 解析の仕組みと設定</div>
                  <div className={styles.refUrl}>
                    docs.sonarsource.com/.../pull-request-analysis/introduction
                  </div>
                </div>
              </Ext>

              <Ext href="https://docs.sonarsource.com/sonarqube-server/quality-standards-administration/managing-rules/security-related-rules">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-red)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>🔒 Security</div>
                  <div className={styles.refTitle}>
                    セキュリティルール：Injection と Configuration
                  </div>
                  <div className={styles.refUrl}>
                    docs.sonarsource.com/.../security-related-rules
                  </div>
                </div>
              </Ext>

              <Ext href="https://docs.sonarsource.com/sonarqube-server/user-guide/code-metrics/changing-modes">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-amber)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>⚙️ MQR Mode</div>
                  <div className={styles.refTitle}>Standard Experience ↔ MQR Mode の切り替え</div>
                  <div className={styles.refUrl}>
                    docs.sonarsource.com/.../code-metrics/changing-modes
                  </div>
                </div>
              </Ext>

              <Ext href="https://docs.sonarsource.com/sonarqube-mcp-server">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-green)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>🤖 AI / MCP</div>
                  <div className={styles.refTitle}>SonarQube MCP Server ドキュメント</div>
                  <div className={styles.refUrl}>docs.sonarsource.com/sonarqube-mcp-server</div>
                </div>
              </Ext>

              <Ext href="https://docs.sonarsource.com/sonarqube-cloud/analyzing-source-code/agentic-analysis">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-purple)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>⚡ Agentic Analysis</div>
                  <div className={styles.refTitle}>AI エージェント向け Agentic Analysis</div>
                  <div className={styles.refUrl}>
                    docs.sonarsource.com/sonarqube-cloud/analyzing-source-code/agentic-analysis
                  </div>
                </div>
              </Ext>

              <Ext href="https://docs.sonarsource.com/sonarqube-cloud/administering-sonarcloud/ai-features/sonarqube-remediation-agent">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-cyan)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>🔧 Remediation Agent</div>
                  <div className={styles.refTitle}>Remediation Agent（Beta）設定と利用方法</div>
                  <div className={styles.refUrl}>
                    docs.sonarsource.com/.../sonarqube-remediation-agent
                  </div>
                </div>
              </Ext>

              <Ext href="https://docs.sonarsource.com/sonarqube-server/devops-platform-integration/gitlab-integration/adding-analysis-to-gitlab-ci-cd">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-amber)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>🦊 GitLab CI</div>
                  <div className={styles.refTitle}>GitLab CI/CD パイプラインへの統合</div>
                  <div className={styles.refUrl}>
                    docs.sonarsource.com/.../adding-analysis-to-gitlab-ci-cd
                  </div>
                </div>
              </Ext>

              <Ext href="https://github.com/SonarSource/sonarqube-mcp-server">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-green)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>💻 GitHub</div>
                  <div className={styles.refTitle}>
                    SonarQube MCP Server オープンソースリポジトリ
                  </div>
                  <div className={styles.refUrl}>github.com/SonarSource/sonarqube-mcp-server</div>
                </div>
              </Ext>

              <Ext href="https://www.sonarsource.com/blog/introducing-sonar-context-augmentation">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-blue)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>📰 Blog</div>
                  <div className={styles.refTitle}>Sonar Context Augmentation 解説ブログ</div>
                  <div className={styles.refUrl}>
                    sonarsource.com/blog/introducing-sonar-context-augmentation
                  </div>
                </div>
              </Ext>

              <Ext href="https://docs.sonarsource.com/sonarqube-server/extension-guide/adding-coding-rules">
                <div
                  className={styles.refCard}
                  style={{ "--ref-color": "var(--neon-purple)" } as React.CSSProperties}
                >
                  <div className={styles.refCategory}>🛠️ Custom Rules</div>
                  <div className={styles.refTitle}>カスタムコーディングルールの追加方法</div>
                  <div className={styles.refUrl}>docs.sonarsource.com/.../adding-coding-rules</div>
                </div>
              </Ext>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p style={{ marginBottom: "0.5rem" }}>
            <span className={styles.textGreen}>⬡ SonarQube Code Review 実践ガイド</span> —
            中〜上級エンジニア向け
          </p>
          <p>
            対応バージョン: SonarQube Server 2026.2 / SonarQube Cloud (2026.1 LTA 準拠)
            &nbsp;|&nbsp; 最終更新: 2026年6月
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            一次情報源:{" "}
            <Ext href="https://docs.sonarsource.com/">
              <span className={styles.textCyan}>docs.sonarsource.com</span>
            </Ext>
          </p>
        </div>
      </footer>
    </div>
  );
}
