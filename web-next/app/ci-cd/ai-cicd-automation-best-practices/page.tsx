import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "AI CI/CD 自動化 完全ガイド ― 初学者のためのステップバイステップ実践入門 | LLM-Studies",
  description:
    "機械学習(MLOps)・生成AI(LLMOps)・AIエージェントを活用した、AIシステムのCI/CD自動化プロセスを学ぶ初学者のためのステップバイステップ実践入門。",
};

const DIAGRAMS = {
  maturity0: `flowchart TD
A["データ抽出と分析"] --> B["データ準備"]
B --> C["モデル学習（手動）"]
C --> D["モデル評価（手動）"]
D --> E["データサイエンティストが手渡し"]
E --> F["エンジニアが手動デプロイ"]
F --> G["予測サービス"]

style A fill:#4c1d95,stroke:#ddd6fe,color:#ede9fe
style B fill:#4c1d95,stroke:#ddd6fe,color:#ede9fe
style C fill:#115e59,stroke:#99f6e4,color:#ccfbf1
style D fill:#115e59,stroke:#99f6e4,color:#ccfbf1
style E fill:#78350f,stroke:#fde68a,color:#fef3c7
style F fill:#78350f,stroke:#fde68a,color:#fef3c7
style G fill:#115e59,stroke:#99f6e4,color:#ccfbf1`,

  maturity1: `flowchart LR
A["データ取り込み"] --> B["データ検証"]
B --> C["特徴量エンジニアリング"]
C --> D["モデル学習"]
D --> E["モデル評価・検証"]
E --> F{"性能基準を満たすか"}
F -->|Yes| G["モデルレジストリへ登録"]
F -->|No| H["パイプライン停止・通知"]
G --> I["予測サービスへ自動デプロイ"]
I --> J["本番監視"]
J -->|ドリフト検知| A

style B fill:#115e59,stroke:#99f6e4,color:#ccfbf1
style E fill:#115e59,stroke:#99f6e4,color:#ccfbf1
style F fill:#78350f,stroke:#fde68a,color:#fef3c7
style H fill:#7f1d1d,stroke:#fecaca,color:#fee2e2
style G fill:#4c1d95,stroke:#ddd6fe,color:#ede9fe
style I fill:#4c1d95,stroke:#ddd6fe,color:#ede9fe`,

  maturity2: `flowchart TD
A["開発・実験"] --> B["ソースリポジトリへpush"]
B --> C["パイプラインCI"]
C --> D["パイプラインCD"]
D --> E["自動トリガー実行"]
E --> F["モデルレジストリへ登録"]
F --> G["モデルCD"]
G --> H["本番監視"]
H -->|性能劣化検知| A

style C fill:#115e59,stroke:#99f6e4,color:#ccfbf1
style D fill:#115e59,stroke:#99f6e4,color:#ccfbf1
style F fill:#4c1d95,stroke:#ddd6fe,color:#ede9fe
style G fill:#4c1d95,stroke:#ddd6fe,color:#ede9fe
style H fill:#78350f,stroke:#fde68a,color:#fef3c7`,

  canary: `flowchart LR
A["新モデルv2をデプロイ"] --> B["トラフィックの1〜5%をv2へ"]
B --> C["カナリア分析"]
C --> D{"品質基準を満たすか"}
D -->|Yes| E["トラフィック割合を増加"]
D -->|No| F["自動ロールバック"]
E --> G{"100%到達"}
G -->|Yes| H["v2へ完全移行"]
G -->|No| B

style A fill:#4c1d95,stroke:#ddd6fe,color:#ede9fe
style C fill:#115e59,stroke:#99f6e4,color:#ccfbf1
style D fill:#78350f,stroke:#fde68a,color:#fef3c7
style F fill:#7f1d1d,stroke:#fecaca,color:#fee2e2
style H fill:#115e59,stroke:#99f6e4,color:#ccfbf1`,

  promptCi: `flowchart TD
A["プロンプト・RAG設定を変更"] --> B["Gitへコミット"]
B --> C["プロンプトのリンティング"]
C --> D["決定的テスト"]
D --> E["評価ゲート（Eval Gate）"]
E --> F{"しきい値を超えるか"}
F -->|No| G["デプロイをブロック"]
F -->|Yes| H["ステージングへデプロイ"]
H --> I["カナリア配信"]
I --> J["本番監視"]

style E fill:#115e59,stroke:#99f6e4,color:#ccfbf1
style F fill:#78350f,stroke:#fde68a,color:#fef3c7
style G fill:#7f1d1d,stroke:#fecaca,color:#fee2e2
style H fill:#4c1d95,stroke:#ddd6fe,color:#ede9fe
style I fill:#4c1d95,stroke:#ddd6fe,color:#ede9fe`,

  prReview: `flowchart LR
A["PR作成またはIssueラベル付与"] --> B["GitHub Actions起動"]
B --> C["コーディングエージェント呼び出し"]
C --> D["差分分析・バグ・セキュリティ検出"]
D --> E["PRへレビューコメント投稿"]
E --> F["人間レビュアーが確認・承認"]
F --> G["マージしCI/CDへ"]

style C fill:#4c1d95,stroke:#ddd6fe,color:#ede9fe
style D fill:#115e59,stroke:#99f6e4,color:#ccfbf1
style F fill:#78350f,stroke:#fde68a,color:#fef3c7`,
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Page() {
  return (
    <div className={styles.pageWrap}>
      <TocObserver />
      <nav className={styles.sidebar} id="sidebar">
        <div className={styles.sidebarTitle}>
          <i className="ti ti-topology-star-3" />
          <span>AI CI/CD 自動化ガイド</span>
        </div>

        <ul>
          <li>
            <a className={styles.tocLink} href="#intro">
              <i className={`${styles.tocIcon} ti ti-bulb`} />
              <span>1. はじめに</span>
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#diff">
              <i className={`${styles.tocIcon} ti ti-git-compare`} />
              <span>2. 従来のCI/CDとの違い</span>
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#maturity">
              <i className={`${styles.tocIcon} ti ti-stairs-up`} />
              <span>3. MLOps成熟度モデル</span>
            </a>
          </li>
        </ul>

        <div className={styles.navGroupLabel}>ステップバイステップ</div>
        <ul>
          <li>
            <a className={styles.tocLink} href="#step1">
              <i className={`${styles.tocIcon} ti ti-database`} />
              <span>Step1 データ・モデル管理</span>
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#step2">
              <i className={`${styles.tocIcon} ti ti-flask`} />
              <span>Step2 実験管理／レジストリ</span>
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#step3">
              <i className={`${styles.tocIcon} ti ti-checklist`} />
              <span>Step3 CI（検証）</span>
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#step4">
              <i className={`${styles.tocIcon} ti ti-truck-delivery`} />
              <span>Step4 CD（配信）</span>
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#step5">
              <i className={`${styles.tocIcon} ti ti-refresh`} />
              <span>Step5 CT（再学習）</span>
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#step6">
              <i className={`${styles.tocIcon} ti ti-git-branch`} />
              <span>Step6 デプロイ戦略</span>
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#step7">
              <i className={`${styles.tocIcon} ti ti-activity`} />
              <span>Step7 監視・ドリフト検知</span>
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#step8">
              <i className={`${styles.tocIcon} ti ti-message-chatbot`} />
              <span>Step8 LLMOps</span>
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#step9">
              <i className={`${styles.tocIcon} ti ti-robot`} />
              <span>Step9 AIエージェント自動化</span>
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#step10">
              <i className={`${styles.tocIcon} ti ti-shield-lock`} />
              <span>Step10 セキュリティ</span>
            </a>
          </li>
        </ul>

        <div className={styles.navGroupLabel}>まとめ</div>
        <ul>
          <li>
            <a className={styles.tocLink} href="#tools">
              <i className={`${styles.tocIcon} ti ti-tools`} />
              <span>5. 主要ツールマップ</span>
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#pitfalls">
              <i className={`${styles.tocIcon} ti ti-alert-triangle`} />
              <span>6. アンチパターン</span>
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#roadmap">
              <i className={`${styles.tocIcon} ti ti-map`} />
              <span>7. 導入ロードマップ</span>
            </a>
          </li>
          <li>
            <a className={styles.tocLink} href="#references">
              <i className={`${styles.tocIcon} ti ti-books`} />
              <span>8. 参考文献一覧</span>
            </a>
          </li>
        </ul>
      </nav>

      <button
        id="navToggle"
        className={styles.mobileToggle}
        aria-label="目次を開く"
        aria-expanded="false"
        type="button"
      >
        <i className="ti ti-menu-2" />
      </button>

      <main className={styles.content}>
        <div className={styles.hero}>
          <div className={styles.eyebrow}>
            <i className="ti ti-sparkles" />
            <span>AI Engineering Guide</span>
          </div>
          <h1 className={styles.pageTitle}>
            AI CI/CD 自動化 完全ガイド ― 初学者のためのステップバイステップ実践入門
          </h1>
          <p className={styles.subtitle}>
            対象読者:
            ソフトウェアエンジニア／QAエンジニアで、機械学習（ML）・生成AI（LLM）を組み込んだシステムのCI/CD自動化をこれから学ぶ人
          </p>
          <p className={styles.subtitle}>
            前提知識: 従来型ソフトウェアのCI/CD（GitHub Actions、GitLab
            CIなど）の基本を理解していること
          </p>
        </div>

        <section id="intro" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-bulb" />
            1. はじめに：なぜ「AI CI/CD」という言葉が必要なのか
          </h2>
          <p>「AI CI/CD」とは、大きく分けて3つの領域を指す言葉として使われている。</p>
          <ul>
            <li>
              <strong>MLOps CI/CD</strong>:
              機械学習モデルの学習・評価・デプロイを自動化する仕組み（CI/CD/CTの3点セット）
            </li>
            <li>
              <strong>LLMOps CI/CD</strong>:
              プロンプト・RAG構成・評価データセットなど、生成AIアプリケーション特有の成果物をバージョン管理・評価・デプロイする仕組み
            </li>
            <li>
              <strong>AIエージェントによるCI/CD自動化</strong>: Claude CodeやGitHub
              Copilot、Codexのようなコーディングエージェントを、コードレビューやテスト生成、CI最適化そのものの自動化に使う取り組み（2026年に入り「Continuous
              AI」とも呼ばれ始めている）
            </li>
          </ul>
          <p>
            このガイドでは、この3つすべてをステップバイステップで扱う。全体を貫く原則はシンプルで、「モデルもプロンプトもデータも、コードと同じようにバージョン管理・自動テスト・自動デプロイ・自動監視の対象にする」ということに尽きる。
          </p>
        </section>

        <section id="diff" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-git-compare" />
            2. 従来のCI/CDとAI CI/CDは何が違うのか
          </h2>
          <p>
            Google
            Cloudの公式アーキテクチャドキュメントは、MLシステムが従来のソフトウェアシステムと異なる理由を、チームスキル・開発プロセス・テスト・デプロイ・本番運用の5つの観点で整理している。ML開発は本質的に実験的であり、どの特徴量やアルゴリズムが最良かを試行錯誤する必要がある一方、モデルの性能はコードの品質だけでなく学習データの分布にも左右されるため、コードのCIだけでは不十分になる。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>従来のソフトウェアCI/CD</th>
                  <th>ML CI/CD（MLOps）</th>
                  <th>LLM CI/CD（LLMOps）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>デプロイ対象</td>
                  <td>コード・バイナリ</td>
                  <td>コード＋データ＋モデルの3点セット</td>
                  <td>コード＋プロンプト＋評価しきい値＋モデル選択</td>
                </tr>
                <tr>
                  <td>CIでテストする内容</td>
                  <td>単体テスト・結合テスト</td>
                  <td>データスキーマ検証、学習収束テスト、モデル品質評価を追加</td>
                  <td>
                    プロンプトのリンティング、ゴールデンデータセットに対する評価（Eval）を追加
                  </td>
                </tr>
                <tr>
                  <td>出力の再現性</td>
                  <td>決定的（同じ入力なら同じ出力）</td>
                  <td>非決定的になりうる（データやシードで変動）</td>
                  <td>非決定的（同じプロンプトでも出力が変わりうる）</td>
                </tr>
                <tr>
                  <td>リリース頻度</td>
                  <td>コード変更のたびに高頻度</td>
                  <td>データドリフトや性能劣化に応じて可変（週次〜日次が多い）</td>
                  <td>プロンプト変更は非常に高頻度（1日に何度も）</td>
                </tr>
                <tr>
                  <td>追加される自動化</td>
                  <td>なし</td>
                  <td>CT（継続的トレーニング）が新たに必要</td>
                  <td>評価ゲート（Eval Gate）とプロンプトの環境昇格が必要</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.sourceNote}>
            出典: MLOpsとDevOpsの違いについては{" "}
            <Ext href="https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning">
              Google Cloud Architecture Center
            </Ext>{" "}
            ／ ML CI/CDの3層テストピラミッドについては{" "}
            <Ext href="https://mlflow.org/articles/mlops-pipeline-automation-best-practices-in-2026/">
              MLflow公式ブログ
            </Ext>{" "}
            ／ LLMOpsとMLOpsの違いについては{" "}
            <Ext href="https://myengineeringpath.dev/genai-engineer/llmops/">MyEngineeringPath</Ext>{" "}
            を参照。
          </div>
        </section>

        <section id="maturity" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-stairs-up" />
            3. 全体像をつかむ：MLOps成熟度モデル
          </h2>
          <p>
            Google
            Cloudは、MLOpsの自動化レベルを3段階（レベル0〜2）に分類している。これは非常に有名なフレームワークで、多くの実務ガイドが引用している。自分のチームが今どのレベルにいるかを把握することが、最初の一歩になる。
          </p>

          <h3>レベル0：手動プロセス</h3>
          <p>
            データサイエンティストがノートブック上で試行錯誤し、できあがったモデルをエンジニアに手渡して本番化する。CIもCDも存在せず、モデルの更新頻度は年に数回程度にとどまる。
          </p>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAMS.maturity0} />
            </div>
            <div className={styles.mermaidCaption}>レベル0：手動MLワークフロー</div>
          </div>

          <p>
            課題:
            モデルは本番投入後に劣化する。データの分布は時間とともに変化し（データドリフト）、入力と出力の関係自体が変わることもある（コンセプトドリフト）ため、手動運用では性能劣化に気づくのが遅れる。
          </p>

          <h3>レベル1：MLパイプラインの自動化（CT）</h3>
          <p>
            パイプライン全体をオーケストレーションし、新しいデータが来るたびに自動で再学習（Continuous
            Training）する段階。データ検証・モデル検証のステップが自動化され、特徴量ストア（Feature
            Store）やメタデータ管理が導入される。
          </p>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAMS.maturity1} />
            </div>
            <div className={styles.mermaidCaption}>
              レベル1：継続的トレーニング（CT）パイプライン
            </div>
          </div>

          <p>
            パイプラインの実行トリガーには、オンデマンド実行・スケジュール実行（日次／週次）・新規データ到着時・性能劣化検知時・分布の有意な変化（コンセプトドリフト）検知時などがある。
          </p>

          <h3>レベル2：CI/CDパイプラインの自動化（完全自動化）</h3>
          <p>
            パイプラインの実装コード自体も、ソースリポジトリへのコミットをトリガーにビルド・テスト・デプロイされる段階。ソース管理、テスト・ビルドサービス、デプロイサービス、モデルレジストリ、特徴量ストア、MLメタデータストア、パイプラインオーケストレーターがすべて連携する。
          </p>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAMS.maturity2} />
            </div>
            <div className={styles.mermaidCaption}>
              レベル2：完全自動化されたCI/CD/CTパイプライン
            </div>
          </div>

          <p>
            このレベル2の状態こそが、一般に「AI
            CI/CD」と呼ばれる完成形である。以降のステップでは、レベル0からレベル2へ向かうために必要な個別のプラクティスを、順を追って解説する。
          </p>

          <div className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning">
              Google Cloud Architecture Center「MLOps: Continuous delivery and automation pipelines
              in machine learning」
            </Ext>
            。同ドキュメントのMLOps成熟度3段階モデルは業界で広く参照されている一次情報であり、
            <Ext href="https://www.glasierinc.com/blog/machine-learning-operations-mlops-guide">
              Glasier社のガイド
            </Ext>
            や
            <Ext href="https://medium.com/@flexianadevgroup/mlops-maturity-model-2026-4-stages-to-resilient-risk-free-machine-learning-468c097dc25c">
              Flexiana社の解説
            </Ext>
            でも同様の段階モデルが紹介されている。
          </div>
        </section>

        <section id="step1" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-database" />
            Step 1: データとモデルのバージョン管理
          </h2>
          <p>
            もっとも見落とされがちで、かつもっとも重要な土台がこれである。コードはGitで管理していても、学習データやモデルの重みファイルは「dataset_v2_final.csv」のようなファイル名でごまかされているチームが非常に多い。これでは、ある本番モデルがどのデータで学習されたのか、後から正確に追跡することができなくなる。
          </p>

          <h3>ベストプラクティス</h3>
          <ul>
            <li>
              <strong>データはコードと同じ扱いにする</strong>: DVC（Data Version
              Control）は、Gitの仕組みをそのまま使いながら、大容量のデータセットやモデルファイルをクラウドストレージ側に置き、Git側にはポインタとなる小さなメタファイル（
              <code>.dvc</code>ファイルや<code>dvc.yaml</code>
              ）だけをコミットする方式を取る。これにより、<code>git checkout</code>
              だけで過去のどの時点のデータ・モデル・パイプラインの組み合わせも再現できる。
            </li>
            <li>
              <strong>content hash（内容ハッシュ）でデータセットにタグ付けする</strong>:
              ファイル名ではなく中身のハッシュ値で識別することで、同じ名前で中身が違う、という事故を防ぐ。
            </li>
            <li>
              <strong>Dockerイメージのバージョンを固定する</strong>:
              学習環境のライブラリバージョンが変わると、同じコード・同じデータでも結果が変わりうるため、環境そのものもバージョン管理の対象にする。
            </li>
            <li>
              <strong>学習・検証・テストの分割比率を固定する</strong>:
              例えば80/10/10の分割比率とシード値を固定し、再現可能なデータ分割を行う。
            </li>
          </ul>

          <p>
            DVC以外の選択肢としては、Git
            LFS、lakeFS、Pachyderm、Nessie、Doltなどがあり、画像・動画などの大規模データレイクにはlakeFSの方がスケールしやすいとされる。なお2025年11月、lakeFSがDVCを買収したことが公表されている。
          </p>

          <div className={styles.sourceNote}>
            出典: <Ext href="https://dvc.org/">DVC公式サイト</Ext> ／{" "}
            <Ext href="https://doc.dvc.org/user-guide">DVC公式ユーザーガイド</Ext> ／{" "}
            <Ext href="https://lakefs.io/data-version-control/dvc-tools/">
              lakeFSによるデータバージョニングツール比較
            </Ext>{" "}
            ／{" "}
            <Ext href="https://en.wikipedia.org/wiki/Data_Version_Control_(software)">
              Data Version ControlのWikipedia項目
            </Ext>{" "}
            ／{" "}
            <Ext href="https://labelyourdata.com/articles/machine-learning/data-versioning">
              Label Your Dataによるベストプラクティスまとめ
            </Ext>{" "}
            ／{" "}
            <Ext href="https://www.datacamp.com/tutorial/data-version-control-dvc">
              DataCampによるDVCチュートリアル
            </Ext>
            。
          </div>
        </section>

        <section id="step2" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-flask" />
            Step 2: 実験管理とモデルレジストリ
          </h2>
          <p>
            データが再現可能になったら、次は「どの実験がどのハイパーパラメータでどんな結果を出したか」を自動記録する仕組みを導入する。
          </p>
          <ul>
            <li>
              <strong>実験トラッキングツール</strong>（MLflow、Weights &amp; Biases
              など）は、各学習実行（run）ごとにパラメータ・メトリクス・成果物を自動で記録する。手動でスプレッドシートに記入する運用から脱却することが第一歩になる。
            </li>
            <li>
              <strong>モデルレジストリ</strong>
              は「モデル版のGit」に相当する中央リポジトリで、モデル成果物のバージョン管理と昇格（development
              → staging →
              production）ワークフローを担う。モデルレジストリがあることで、今どのバージョンが本番稼働中かを正確に把握でき、問題発生時に即座に前バージョンへロールバックできる。承認ワークフローを強制することもでき、規制業界における監査証跡の確保にもつながる。
            </li>
          </ul>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>機能</th>
                  <th>実験トラッキング</th>
                  <th>モデルレジストリ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>主な目的</td>
                  <td>試行錯誤の記録・比較</td>
                  <td>本番投入バージョンの管理</td>
                </tr>
                <tr>
                  <td>記録対象</td>
                  <td>ハイパーパラメータ、メトリクス、成果物</td>
                  <td>承認状態、デプロイ履歴、学習データへの参照</td>
                </tr>
                <tr>
                  <td>典型ツール</td>
                  <td>MLflow Tracking, Weights &amp; Biases</td>
                  <td>
                    MLflow Model Registry, Vertex AI Model Registry, SageMaker Model Registry,
                    Hugging Face Hub
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://mlflow.org/articles/mlops-pipeline-automation-best-practices-in-2026/">
              MLflowブログのモデルレジストリ解説
            </Ext>{" "}
            ／{" "}
            <Ext href="https://prepzee.com/blog/top-15-mlops-tools-to-learn/">
              Prepzeeによる主要MLOpsツール比較
            </Ext>{" "}
            ／{" "}
            <Ext href="https://medium.com/online-inference/top-mlops-tools-in-2026-858fd479acac">
              Online Inference誌によるMLOpsツールまとめ
            </Ext>
            。
          </div>
        </section>

        <section id="step3" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-checklist" />
            Step 3: CI（継続的インテグレーション）でコード・データ・モデルを検証する
          </h2>
          <p>
            ML
            CI/CDでは、CIは「コードのテスト」だけでなく「データとモデルの検証」も担う点が従来のCI/CDと決定的に異なる。テストは以下の多層ピラミッドで考えるとよい。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>レイヤー</th>
                  <th>テスト内容</th>
                  <th>主なツール例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>コードレベル</td>
                  <td>
                    特徴量エンジニアリング関数の単体テスト、モデルクラスの各メソッドの単体テスト
                  </td>
                  <td>pytest など通常の単体テストフレームワーク</td>
                </tr>
                <tr>
                  <td>データレベル</td>
                  <td>スキーマの逸脱（想定外の欠損・型不一致）検知、データ分布の逸脱検知</td>
                  <td>Great Expectations, Evidently AI</td>
                </tr>
                <tr>
                  <td>モデルレベル</td>
                  <td>学習が収束するか、NaN値が出ないか、評価指標が基準値を超えるか</td>
                  <td>各フレームワークの評価API、MLflow Evaluate</td>
                </tr>
                <tr>
                  <td>統合レベル</td>
                  <td>パイプライン各コンポーネントの成果物整合性、結合テスト</td>
                  <td>パイプラインオーケストレーターのend-to-endテスト</td>
                </tr>
                <tr>
                  <td>セキュリティレベル</td>
                  <td>依存パッケージの脆弱性スキャン、モデル成果物自体のスキャン、IaCのスキャン</td>
                  <td>
                    Checkov（IaCスキャン）, ModelScan（モデル成果物スキャン）,
                    Fairlearn（バイアステスト）
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            CIで確認すべき具体的な項目としては、モデル学習が収束すること、ゼロ除算などでNaN値が発生しないこと、各パイプラインコンポーネントが期待通りの成果物を生成することなどが挙げられる。
          </p>

          <div className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning">
              Google Cloud Architecture Center
            </Ext>{" "}
            ／{" "}
            <Ext href="https://www.kernshell.com/best-practices-for-scalable-machine-learning-deployment/">
              Kernshellによる2026年MLOpsベストプラクティス
            </Ext>{" "}
            ／{" "}
            <Ext href="https://mlflow.org/articles/mlops-pipeline-automation-best-practices-in-2026/">
              MLflowブログの多層テストピラミッドの解説
            </Ext>
            。
          </div>
        </section>

        <section id="step4" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-truck-delivery" />
            Step 4: CD（継続的デリバリー）でパイプラインとモデルを配信する
          </h2>
          <p>
            ML
            CI/CDにおけるCDは、単一のソフトウェアパッケージをデプロイするのではなく、「別のサービス（モデル予測サービス）を自動的にデプロイするシステム（学習パイプライン）」をデプロイする点が特徴である。CDで確認すべき項目には次のようなものがある。
          </p>
          <ul>
            <li>
              モデルが対象インフラと互換性を持つか（必要なパッケージ・メモリ・アクセラレータが揃っているか）を事前検証する
            </li>
            <li>予測サービスAPIを実際に呼び出し、期待通りのレスポンスが返るかをテストする</li>
            <li>秒間クエリ数（QPS）やレイテンシなど、負荷テストによる性能検証を行う</li>
            <li>
              開発ブランチへのpushで自動的にテスト環境へデプロイし、mainブランチへのマージ（レビュー承認後）でステージング環境へ半自動デプロイし、ステージングでの実績を確認してから本番へ手動承認デプロイする、という段階的な昇格フローを組む
            </li>
          </ul>
          <div className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning">
              Google Cloud Architecture Center
            </Ext>
            。
          </div>
        </section>

        <section id="step5" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-refresh" />
            Step 5: CT（継続的トレーニング）で自動再学習する
          </h2>
          <p>
            CT（Continuous Training）はML
            CI/CDにのみ存在する、従来のソフトウェアCI/CDにはない新しい概念である。CI/CD/CTの3点セットが揃うことで、本番データが変化し続ける中でもモデルが自律的に改善し続けるループが完成する。
          </p>

          <h3>再学習をトリガーする条件の代表例</h3>
          <ul>
            <li>
              <strong>スケジュールベース</strong>: 週次・日次など、定期的な再学習サイクル
            </li>
            <li>
              <strong>データドリフトベース</strong>: PSI（Population Stability
              Index）などの指標が閾値を超えたら、通常サイクル外の再学習評価を発火する
            </li>
            <li>
              <strong>性能劣化ベース</strong>: 本番での予測精度が一定基準（例：accuracy
              0.85）を下回ったら再学習する
            </li>
            <li>
              <strong>新規データ到着ベース</strong>:
              バッチでラベル付きデータが到着した時点で再学習する
            </li>
          </ul>

          <div className={styles.callout}>
            <i className="ti ti-alert-circle" />
            <div>
              <strong>注意点</strong>:
              再学習後のモデルは、必ず「新モデルが現行の本番モデルより優れているか」を比較検証してから昇格させるゲートを設ける。データ全体だけでなく、顧客セグメントごとなど、データの部分集合でも性能が一貫しているかを確認することが望ましい。
            </div>
          </div>

          <div className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning">
              Google Cloud Architecture Center
            </Ext>{" "}
            ／{" "}
            <Ext href="https://mlflow.org/articles/mlops-pipeline-automation-best-practices-in-2026/">
              MLflowブログにおけるCT運用例
            </Ext>{" "}
            ／{" "}
            <Ext href="https://www.azilen.com/blog/mlops-best-practices/">
              Azilenによる継続的再学習のプラクティス
            </Ext>
            。
          </div>
        </section>

        <section id="step6" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-git-branch" />
            Step 6: デプロイ戦略を選ぶ（カナリア／ブルーグリーン／シャドウ）
          </h2>
          <p>
            新しいモデルをいきなり全トラフィックへ投入するのはリスクが高い。ソフトウェアのデプロイと同様、モデルにも段階的なロールアウト戦略が必要になる。
          </p>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAMS.canary} />
            </div>
            <div className={styles.mermaidCaption}>
              カナリアデプロイの段階的トラフィック移行フロー
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>戦略</th>
                  <th>仕組み</th>
                  <th>向いているケース</th>
                  <th>必要なインフラ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ローリングデプロイ</td>
                  <td>既存インスタンスを順次新バージョンに置き換える</td>
                  <td>定常的な小規模更新, コストを抑えたい場合</td>
                  <td>既存キャパシティの再利用のみで最も安価</td>
                </tr>
                <tr>
                  <td>ブルーグリーンデプロイ</td>
                  <td>新旧2つの環境を用意し、検証後に一気にトラフィックを切り替える</td>
                  <td>ダウンタイムを許容できない場合, 即座のロールバックが必要な場合</td>
                  <td>二重のインフラが必要（コスト高）</td>
                </tr>
                <tr>
                  <td>カナリアデプロイ</td>
                  <td>
                    新バージョンへ少数（1〜5%）のトラフィックのみ流し、問題なければ徐々に拡大する
                  </td>
                  <td>ツールや前処理のアーキテクチャ変更を伴わず段階的にリスクを検証したい場合</td>
                  <td>Istio, Linkerdなどのサービスメッシュ、Argo Rolloutsなど</td>
                </tr>
                <tr>
                  <td>シャドウデプロイ</td>
                  <td>
                    新バージョンにも本番トラフィックを複製して流すが、結果はユーザーに返さず比較のみ行う
                  </td>
                  <td>ユーザー体験に影響を与えず新モデルの挙動を検証したい場合</td>
                  <td>トラフィックミラーリングの仕組み</td>
                </tr>
                <tr>
                  <td>A/Bテスト</td>
                  <td>複数バージョンに実際にトラフィックを分けて配信し、ビジネス指標で比較する</td>
                  <td>UX・レコメンドなど統計的な効果検証をしたい場合</td>
                  <td>実験基盤・統計的有意性の検証基盤</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            なお、特徴量ストアのスキーマ変更や入力前処理そのものを変える大規模なアーキテクチャ変更の場合は、同一APIコントラクト上でのトラフィック分割であるカナリアではなく、完全な切り替えを伴うブルーグリーンデプロイが適している。GPUを大量に使うLLMのような高コストなモデルでは、2バージョンを並行稼働させるカナリア自体のコストが課題になる点にも注意したい。
          </p>

          <div className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://devops-daily.com/posts/deployment-strategies-guide">
              devops-daily.comによるデプロイ戦略比較
            </Ext>{" "}
            ／{" "}
            <Ext href="https://www.intuz.com/blog/strategies-for-deploying-ml-models">
              Intuzによるモデルデプロイパターンの解説
            </Ext>{" "}
            ／{" "}
            <Ext href="https://123ofai.com/qnalab/system-design/blocks/canary-deploy">
              123ofaiによるMLモデル向けカナリアデプロイの完全ガイド
            </Ext>{" "}
            ／{" "}
            <Ext href="https://circleci.com/blog/deployment-strategies-types-trade-offs-and-how-to-choose/">
              CircleCIによるデプロイ戦略トレードオフ解説
            </Ext>{" "}
            ／{" "}
            <Ext href="https://www.harness.io/blog/blue-green-canary-deployment-strategies">
              Harnessによるブルーグリーン/カナリア解説
            </Ext>
            。
          </div>
        </section>

        <section id="step7" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-activity" />
            Step 7: 本番監視とドリフト検知
          </h2>
          <p>
            モデルは、コードにバグがなくても劣化する。これは従来ソフトウェアにはない、MLシステム特有の重大なリスクである。データの分布そのものが変化する「データドリフト」と、入力と出力の関係性が変化する「コンセプトドリフト」の2種類を区別して理解しておく必要がある。
          </p>
          <ul>
            <li>
              <strong>データドリフト</strong>:
              本番環境に入ってくるデータが、学習時のデータと統計的に大きく異なってしまう状態
            </li>
            <li>
              <strong>コンセプトドリフト</strong>:
              入力データと正解ラベルの関係性そのものが時間とともに変化してしまう状態（例：市場環境の変化により、以前は有効だった与信スコアリングの基準が通用しなくなる）
            </li>
          </ul>
          <p>
            監視すべき指標としては、モデルの予測精度そのものに加え、レイテンシ、エラー率、そして特徴量ごとの分布の変化などがある。オープンソースのEvidently
            AIのようなツールを使えば、リファレンスデータと本番データを比較したドリフトレポートを自動生成できる。監視基盤としては、Prometheusでメトリクスを収集し、Grafanaで可視化するという組み合わせも定番になっている。
          </p>
          <div className={styles.callout}>
            <i className="ti ti-alert-circle" />
            <div>
              <strong>重要</strong>: 監視結果は、単なるダッシュボード表示で終わらせず、必ずStep
              5のCTパイプラインへのトリガーとして接続する。監視して終わりでは意味がなく、監視結果が自動的に再学習や人間へのアラートにつながる設計にして初めて「継続的」という言葉に見合う仕組みになる。
            </div>
          </div>

          <div className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://www.gitnexa.com/blogs/mlops-implementation-best-practices">
              GitNexaによるMLOps実装ガイド（Evidently AIによるドリフト検知）
            </Ext>{" "}
            ／{" "}
            <Ext href="https://www.azilen.com/blog/mlops-best-practices/">
              Azilenによるデータドリフト・コンセプトドリフトの定義
            </Ext>{" "}
            ／{" "}
            <Ext href="https://prepzee.com/blog/top-15-mlops-tools-to-learn/">
              Prepzeeによる監視ツールの紹介
            </Ext>
            。
          </div>
        </section>

        <section id="step8" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-message-chatbot" />
            Step 8: LLMOps特有の考慮点（プロンプトはコードである）
          </h2>
          <p>
            生成AI・LLMを組み込んだアプリケーションでは、デプロイ対象がモデルのバイナリではなく「プロンプト・検索設定（RAGの取得元）・モデルプロバイダー設定・評価しきい値」に置き換わる。システムプロンプトのたった一言の変更が、モデルの再学習以上に出力品質を左右することもある。プロンプトをアプリケーションコードにハードコードしたまま金曜午後にこっそり変更し、評価も走らせずに月曜の朝に大量のクレームで気づく、というのが典型的な失敗パターンとして紹介されている。
          </p>

          <h3>LLMOpsのCI/CDパイプラインが従来のML CI/CDに追加する要素</h3>
          <ul>
            <li>
              <strong>プロンプトのバージョン管理</strong>:
              プロンプトをGitでバージョン管理される独立した資産として扱い、開発（dev）→ステージング（staging）→本番（production）という環境ごとに、どのプロンプトバージョンが割り当てられているかを管理する
            </li>
            <li>
              <strong>プロンプトのリンティング</strong>:
              必須変数の欠落やフォーマット崩れがないかを機械的にチェックする
            </li>
            <li>
              <strong>評価ゲート（Eval Gate）</strong>: 忠実性（faithfulness）や関連性（answer
              relevancy）といった指標を、ゴールデンデータセット（正解付きテストケース集）に対して自動計算し、スコアが既定の閾値を下回った場合はデプロイをブロックする。これがLLMOpsにおける品質ゲートであり、従来のCIにおける単体テストに相当する役割を果たす
            </li>
            <li>
              <strong>段階的ロールアウト</strong>:
              プロンプトのA/Bテストやカナリア配信により、新しいプロンプト・モデル設定を一部トラフィックにのみ適用してから拡大する
            </li>
          </ul>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAMS.promptCi} />
            </div>
            <div className={styles.mermaidCaption}>LLMOpsにおけるプロンプトCI/CDと評価ゲート</div>
          </div>

          <p>
            Google Cloud上でこのパイプラインを組む場合、Cloud
            BuildがCI/CDのオーケストレーションを担い、Vertex AI
            Pipelines（Kubeflowベース）が複雑なワークフローを、Vertex AI Evaluation
            Serviceが忠実性・関連性などの自動評価指標の計算を担う、という役割分担が一つの実例として紹介されている。RAGシステムでは、アプリケーションコード・プロンプトテンプレート・検索対象データという3種類の更新をそれぞれ独立して扱えるパイプライン設計が求められる点も重要である。
          </p>

          <div className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://myengineeringpath.dev/genai-engineer/llmops/">
              MyEngineeringPathによるLLMOps解説
            </Ext>{" "}
            ／{" "}
            <Ext href="https://jubinsoni.medium.com/engineering-llmops-building-robust-ci-cd-pipelines-for-llm-applications-on-google-cloud-136b1fdbcbb5">
              Jubin Soni氏によるGoogle Cloud上でのLLMOps CI/CD構築記事
            </Ext>
            （
            <Ext href="https://dev.to/jubinsoni/engineering-llmops-building-robust-cicd-pipelines-for-llm-applications-on-google-cloud-22hc">
              DEV Community版
            </Ext>
            ）／
            <Ext href="https://langwatch.ai/blog/what-is-prompt-management-and-how-to-version-control-deploy-prompts-in-productions">
              LangWatchによるプロンプト管理解説
            </Ext>{" "}
            ／{" "}
            <Ext href="https://agenta.ai/blog/cicd-for-llm-prompts">
              Agentaによるプロンプト専用デプロイパイプライン構築ガイド
            </Ext>{" "}
            ／{" "}
            <Ext href="https://apxml.com/courses/mlops-for-large-models-llmops/chapter-6-advanced-llmops-systems-workflows/integrating-llmops-cicd">
              apxmlによるLLMOpsとCI/CD統合の技術解説
            </Ext>{" "}
            ／{" "}
            <Ext href="https://www.examcert.app/blog/llmops-skills-certifications-2026/">
              ExamCertAIによる2026年のLLMOpsスキルマップ
            </Ext>{" "}
            ／{" "}
            <Ext href="https://machinelearningmastery.com/the-roadmap-for-mastering-llmops-in-2026/">
              MachineLearningMasteryによるLLMOpsロードマップ
            </Ext>
            。
          </div>
        </section>

        <section id="step9" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-robot" />
            Step 9: AIエージェントでCI/CDそのものを自動化する
          </h2>
          <p>
            ここまでは「AIシステムをCI/CDでどう扱うか」という話だったが、2026年に入り、逆に「AIエージェントを使ってCI/CDのプロセス自体を自動化する」という潮流が急速に実用化している。GitHubはこれを「Continuous
            AI」と呼び、CI/CDの実践と同様に、自動化とコラボレーションを強化するAIをソフトウェア開発ライフサイクル（SDLC）へ統合する取り組みと位置づけている。
          </p>

          <h3>代表的な実装パターン</h3>
          <ul>
            <li>
              <strong>PRメンション型のコードレビュー自動化</strong>: GitHub
              ActionsのワークフローからClaude Code（<code>anthropics/claude-code-action</code>
              ）やOpenAI Codex（<code>openai/codex-action</code>
              ）、Gemini系のアクションを呼び出し、プルリクエストに<code>@claude</code>
              のようなメンションを付けるだけで、差分分析・バグ検出・セキュリティ検出・スタイルチェック・フォローアップコミットの作成までを自動実行させる
            </li>
            <li>
              <strong>Issueベースの自律的PR生成</strong>:
              Issueにラベルを付けるだけでコーディングエージェントが自律的にPRを作成する運用
            </li>
            <li>
              <strong>GitHub Agentic Workflows</strong>: GitHub Next、Microsoft Research、Azure Core
              Upstreamの協働で開発された技術プレビュー機能で、トリアージやドキュメント作成、コード品質向上など、より主観的で反復的な作業を、GitHub
              Actionsの信頼性・制御性を保ったまま自動化する。公式ブログは、これを「従来のCI/CD用YAMLワークフローの代替」ではなく、CI/CDと併用してこそ最も効果を発揮するものと明確に位置づけている
            </li>
          </ul>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaid}>
              <MermaidDiagram chart={DIAGRAMS.prReview} />
            </div>
            <div className={styles.mermaidCaption}>AIエージェントによるPRレビュー自動化フロー</div>
          </div>

          <h3>導入時の注意点</h3>
          <ul>
            <li>
              <strong>権限は最小限に絞る</strong>:
              エージェントはコードを読み、コマンド実行やファイル出力を行う可能性があるため、
              <code>contents: read</code>、<code>pull-requests: write</code>
              のように、通常のCIジョブ以上に権限境界を明確にする
            </li>
            <li>
              <strong>実行環境（ランナー）を選ぶ</strong>:
              一部のツールはWindows環境で追加のセーフティ設定が必要になる場合があり、まずはLinuxランナーから始めるのが扱いやすい
            </li>
            <li>
              <strong>モデルバージョンを固定するかどうかを検討する</strong>:
              アップデートによってプロンプトへの反応が変わることがあるため、本番運用では固定し、セキュリティパッチのみ計画的に適用するフローを別途設ける
            </li>
            <li>
              <strong>会話型ではなく自走型の設計にする</strong>:
              細かく対話しながら進める使い方ではなく、適切な入力・指示を与えてエージェントに自走させることで真価を発揮する。そのためにはタスクごとに特化したプロンプトや実行環境をチームで共有できる仕組みが必要になる
            </li>
          </ul>

          <div className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://renue.co.jp/posts/ai-devops-claude-code-github-actions-ci-cd-ai-review-2026">
              renue社によるAI DevOps完全ガイド
            </Ext>{" "}
            ／{" "}
            <Ext href="https://github.blog/jp/2026-02-16-automate-repository-tasks-with-github-agentic-workflows/">
              GitHub公式ブログ「GitHub Agentic Workflowsを発表」
            </Ext>{" "}
            ／{" "}
            <Ext href="https://uravation.com/media/codex-github-action-complete-guide-2026/">
              Uravation社によるCodex GitHub Action完全ガイド
            </Ext>{" "}
            ／{" "}
            <Ext href="https://aizen-ai.co.jp/codex-github-actions/">
              AIzen社によるCodexのGitHub Actions統合手順
            </Ext>{" "}
            ／{" "}
            <Ext href="https://codelabs.developers.google.com/genai-for-dev-github-code-review">
              Google Codelabs「生成AIを使用したコードレビューの自動化」
            </Ext>{" "}
            ／{" "}
            <Ext href="https://fintan.jp/page/19508/">
              FintanによるGitLab環境でのAI駆動開発の実践知見
            </Ext>{" "}
            ／{" "}
            <Ext href="https://blog.potproject.net/2025/04/14/github-pr-automate-ai-agents/">
              potproject氏による自律型GitHub Actions実装記
            </Ext>
            。
          </div>
        </section>

        <section id="step10" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-shield-lock" />
            Step 10: セキュリティとガバナンスをパイプラインに組み込む
          </h2>
          <p>
            AI
            CI/CDパイプラインは、従来のCI/CDが抱えるセキュリティリスクに加えて、AI・LLM特有のリスクにも対応する必要がある。両者は別物として管理するのではなく、同じパイプライン内で一貫して統制することが望ましい。
          </p>

          <h3>CI/CDパイプライン自体のセキュリティ</h3>
          <p>
            OWASPはCI/CD特有のセキュリティリスクを整理したチートシートを公開しており、実運用ではまず可視性（ログの一元化）を確保し、次に最小権限化とシークレット管理を徹底し、その後パイプラインの改ざん防止やハードニングへ進み、サプライチェーン対策（依存関係の固定、成果物の署名検証）に着手する、という優先順位づけが推奨されている。CodecovやSolarWindsの事例が示すように、過度な権限を持つサービスアカウントが侵害されると被害が広範囲に及ぶため、CI/CD専用のワークフローファイル（
            <code>.github/workflows/</code>など）の変更には<code>CODEOWNERS</code>
            によるレビュー必須化や署名付きコミットの検証を組み込むことが有効である。
          </p>

          <h3>LLM・AIエージェント特有のセキュリティ</h3>
          <p>
            OWASPは「LLMアプリケーションのためのTop
            10」として、プロンプトインジェクション、機微情報の開示、データ・モデルのポイズニング、不適切な出力処理、過剰なエージェンシー（Excessive
            Agency）、システムプロンプトの漏洩、ベクトル・埋め込みの脆弱性、過剰消費（Unbounded
            Consumption）などをカタログ化している。これらのリスクは実行時（ランタイム）の問題であることが多く、アプリケーションコード側だけでは解決できないため、認可チェックや最小権限、出力バリデーションといった制御は、LLM自身に委ねず、決定論的で監査可能な外部システム側で強制することが基本原則とされる。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>OWASP LLMリスク</th>
                  <th>CI/CDへの組み込み方</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>プロンプトインジェクション（LLM01）</td>
                  <td>
                    インジェクション対策の検証を、本番投入前にCI内の自動テストとして実行する（本番で発見するのではなく）
                  </td>
                </tr>
                <tr>
                  <td>過剰なエージェンシー</td>
                  <td>
                    エージェントが呼び出せるAPI・ツールのスコープを、パイプライン側で検証し、想定より広い権限を持とうとした変更は自動的に拒否する
                  </td>
                </tr>
                <tr>
                  <td>機微情報の開示</td>
                  <td>
                    モデル応答からの機密データ漏洩を検知する自動テスト（カナリートークンの埋め込みとログ監視など）をCIに組み込む
                  </td>
                </tr>
                <tr>
                  <td>モデル・データのポイズニング</td>
                  <td>
                    サードパーティモデル・データセットをソフトウェア依存関係と同様に扱い、SBOMや来歴（provenance）検証を行う
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            自動化されたレッドチーム演習（既知のジェイルブレイクパターンや間接的インジェクションへの耐性テスト）をCI/CDに組み込み、モデルアップデートのたびに安全特性が変化していないかを回帰テストすることも、2025年以降のベストプラクティスとして推奨されている。
          </p>

          <div className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html">
              OWASP公式「CI/CD Security Cheat Sheet」
            </Ext>{" "}
            ／{" "}
            <Ext href="https://secure-pipelines.com/ci-cd-security/owasp-top-10-ci-cd-risks-explained-real-world-examples/">
              Secure Pipelinesによる「OWASP Top 10 CI/CD Risks」実例解説
            </Ext>{" "}
            ／{" "}
            <Ext href="https://cycode.com/blog/the-2025-owasp-top-10-addressing-software-supply-chain-and-llm-risks-with-cycode/">
              Cycodeによる2025年版OWASP Top 10とLLMリスク of 統合解説
            </Ext>{" "}
            ／{" "}
            <Ext href="https://www.gravitee.io/blog/owasp-top-10-for-llm-applications-2025-a-practical-guide">
              Gravitee社によるOWASP LLM Top 10実践ガイド
            </Ext>{" "}
            ／{" "}
            <Ext href="https://securityboulevard.com/2026/03/the-owasp-top-10-for-llm-applications-2025-explained-simply/">
              Security Boulevardによる2025年版OWASP LLM Top 10解説
            </Ext>{" "}
            ／{" "}
            <Ext href="https://medium.com/@aucestovara/from-owasp-top-10-for-llms-to-ci-cd-securing-ai-systems-at-build-time-1dce225cb9c0">
              Alejandro Aucestovar氏によるOWASP LLM Top 10のCI/CDへの落とし込み方
            </Ext>{" "}
            ／{" "}
            <Ext href="https://socfortress.medium.com/owasp-top-10-for-llm-applications-2025-testing-local-models-against-real-attack-scenarios-part-5e453e4015cb">
              SOCFortressによる実攻撃シナリオ検証
            </Ext>{" "}
            ／{" "}
            <Ext href="https://www.siemba.io/owasp-top-10-llm-security-testing">
              Siembaによる OWASP LLM Top 10セキュリティテストガイド
            </Ext>
            。
          </div>
        </section>

        <section id="tools" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-tools" />
            5. 主要ツールマップ
          </h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>カテゴリ</th>
                  <th>代表的なツール</th>
                  <th>主な用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>データ・モデルバージョン管理</td>
                  <td>DVC, Git LFS, lakeFS, Pachyderm</td>
                  <td>データセット・モデルのGit的バージョン管理</td>
                </tr>
                <tr>
                  <td>実験管理・モデルレジストリ</td>
                  <td>MLflow, Weights &amp; Biases</td>
                  <td>実験のトラッキング、モデルの承認・昇格ワークフロー</td>
                </tr>
                <tr>
                  <td>パイプラインオーケストレーション</td>
                  <td>
                    Kubeflow, Vertex AI Pipelines, SageMaker Pipelines, Prefect, ZenML, Airflow
                  </td>
                  <td>学習・評価・デプロイの一連の流れを自動実行</td>
                </tr>
                <tr>
                  <td>CI/CD基盤</td>
                  <td>GitHub Actions, GitLab CI, Jenkins, Cloud Build, CircleCI</td>
                  <td>ビルド・テスト・デプロイの自動化そのもの</td>
                </tr>
                <tr>
                  <td>データ検証・品質管理</td>
                  <td>Great Expectations, Evidently AI</td>
                  <td>データスキーマ検証、ドリフトレポート生成</td>
                </tr>
                <tr>
                  <td>モデル・IaCセキュリティスキャン</td>
                  <td>ModelScan, Checkov, Fairlearn</td>
                  <td>モデル成果物の安全性チェック、IaCスキャン、バイアス検証</td>
                </tr>
                <tr>
                  <td>監視・可観測性</td>
                  <td>Prometheus, Grafana, Evidently AI</td>
                  <td>本番稼働メトリクスの収集・可視化・ドリフト検知</td>
                </tr>
                <tr>
                  <td>コンテナ・実行基盤</td>
                  <td>Docker, Kubernetes</td>
                  <td>学習・推論環境の一貫性確保とスケーリング</td>
                </tr>
                <tr>
                  <td>LLMOps・プロンプト管理</td>
                  <td>LangWatch, Agenta, Vertex AI Evaluation Service</td>
                  <td>プロンプトのバージョン管理、評価ゲート、A/Bテスト</td>
                </tr>
                <tr>
                  <td>AIエージェントによるCI/CD自動化</td>
                  <td>
                    Claude Code Action, OpenAI Codex Action, GitHub Agentic Workflows, GitHub
                    Copilot
                  </td>
                  <td>PRレビュー・Issue対応・テスト生成・ドキュメント同期の自動化</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://prepzee.com/blog/top-15-mlops-tools-to-learn/">
              Prepzeeによる2026年版主要MLOpsツール15選
            </Ext>{" "}
            ／{" "}
            <Ext href="https://medium.com/online-inference/top-mlops-tools-in-2026-858fd479acac">
              Online Inference誌によるMLOpsツールまとめ
            </Ext>{" "}
            ／{" "}
            <Ext href="https://www.kernshell.com/best-practices-for-scalable-machine-learning-deployment/">
              Kernshellによるツールスタック例
            </Ext>{" "}
            ／{" "}
            <Ext href="https://www.gitnexa.com/blogs/mlops-implementation-best-practices">
              GitNexaによるツール選定ガイド
            </Ext>
            。
          </div>
        </section>

        <section id="pitfalls" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-alert-triangle" />
            6. よくある落とし穴（アンチパターン）チェックリスト
          </h2>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-x" />
              <div>
                <strong>
                  データセットをファイル名だけで管理し、どのモデルがどのデータで学習されたか追跡できない
                </strong>
              </div>
            </li>
            <li>
              <i className="ti ti-x" />
              <div>
                <strong>
                  モデル評価をオフラインの精度指標のみで行い、ビジネスKPIを評価基準に含めていない
                </strong>
              </div>
            </li>
            <li>
              <i className="ti ti-x" />
              <div>
                <strong>
                  データサイエンティストとエンジニアが分業しすぎて、モデルの手渡しの過程で「学習時と提供時のスキュー（training-serving
                  skew）」が発生している
                </strong>
              </div>
            </li>
            <li>
              <i className="ti ti-x" />
              <div>
                <strong>モデルを本番投入したきり、性能劣化を検知する監視の仕組みがない</strong>
              </div>
            </li>
            <li>
              <i className="ti ti-x" />
              <div>
                <strong>
                  再学習を完全手動で行っており、データが変化しても気づいた時にはすでに性能が劣化している
                </strong>
              </div>
            </li>
            <li>
              <i className="ti ti-x" />
              <div>
                <strong>
                  新モデルをいきなり100%のトラフィックに投入し、問題発生時に即座にロールバックできる体制がない
                </strong>
              </div>
            </li>
            <li>
              <i className="ti ti-x" />
              <div>
                <strong>
                  プロンプトをアプリケーションコードにハードコードしており、変更のたびにアプリ全体の再デプロイが必要になっている
                </strong>
              </div>
            </li>
            <li>
              <i className="ti ti-x" />
              <div>
                <strong>
                  プロンプトやモデル設定を変更しても、評価（Eval）を自動実行せずに本番反映してしまっている
                </strong>
              </div>
            </li>
            <li>
              <i className="ti ti-x" />
              <div>
                <strong>
                  AIエージェントにCIワークフローの実行権限を過剰に付与し、最小権限の原則を守っていない
                </strong>
              </div>
            </li>
            <li>
              <i className="ti ti-x" />
              <div>
                <strong>
                  規制業界向けのシステムで、独立したチームによるモデル検証や、承認の文書化されたエスカレーションパスを用意していない
                </strong>
              </div>
            </li>
          </ul>
          <div className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://mlflow.org/articles/mlops-pipeline-automation-best-practices-in-2026/">
              MLflowブログにおけるMLOps成熟度の考え方
            </Ext>{" "}
            ／{" "}
            <Ext href="https://www.n-ix.com/mlops-best-practices/">
              N-iXによる実運用でよく見落とされるプラクティスの指摘
            </Ext>{" "}
            ／{" "}
            <Ext href="https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning">
              Google Cloud Architecture Centerにおけるtraining-serving skewの解説
            </Ext>
            。
          </div>
        </section>

        <section id="roadmap" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-map" />
            7. まとめ：導入ロードマップ
          </h2>
          <p>すべてを一度に導入する必要はない。以下のような段階的な進め方が現実的である。</p>

          <div className={styles.roadmapStep}>
            <div className={styles.roadmapNum}>1</div>
            <div className={styles.roadmapStepContent}>
              <h3>土台づくり（Step 1〜2）</h3>
              <p>
                まずデータ・モデルのバージョン管理と実験トラッキングを整備する。ここが崩れていると、この先の自動化はすべて「再現できない自動化」になってしまう。
              </p>
            </div>
          </div>
          <div className={styles.roadmapStep}>
            <div className={styles.roadmapNum}>2</div>
            <div className={styles.roadmapStepContent}>
              <h3>テストとデリバリーの自動化（Step 3〜4）</h3>
              <p>
                コード・データ・モデルを対象にした多層テストをCIに組み込み、テスト環境への自動デプロイパイプラインを構築する。
              </p>
            </div>
          </div>
          <div className={styles.roadmapStep}>
            <div className={styles.roadmapNum}>3</div>
            <div className={styles.roadmapStepContent}>
              <h3>継続的トレーニングと段階的ロールアウト（Step 5〜6）</h3>
              <p>
                スケジュールまたはドリフトベースの再学習トリガーを設定し、カナリアなど安全なロールアウト戦略を組み込む。
              </p>
            </div>
          </div>
          <div className={styles.roadmapStep}>
            <div className={styles.roadmapNum}>4</div>
            <div className={styles.roadmapStepContent}>
              <h3>監視のループを閉じる（Step 7）</h3>
              <p>
                監視結果が自動的に再学習やアラートへつながるようにし、CI/CD/CTのループを完成させる。
              </p>
            </div>
          </div>
          <div className={styles.roadmapStep}>
            <div className={styles.roadmapNum}>5</div>
            <div className={styles.roadmapStepContent}>
              <h3>生成AI固有の layer を足す（Step 8）</h3>
              <p>プロンプトをコードと同格の資産として扱い、評価ゲートを設ける。</p>
            </div>
          </div>
          <div className={styles.roadmapStep}>
            <div className={styles.roadmapNum}>6</div>
            <div className={styles.roadmapStepContent}>
              <h3>AIエージェントで開発プロセス自体を加速する（Step 9）</h3>
              <p>
                コードレビューやドキュメント同期など、反復的なタスクからAIエージェントの導入を始める。
              </p>
            </div>
          </div>
          <div className={styles.roadmapStep}>
            <div className={styles.roadmapNum}>7</div>
            <div className={styles.roadmapStepContent}>
              <h3>セキュリティを後付けにしない（Step 10）</h3>
              <p>
                最初のパイプライン設計の段階から、最小権限・監査ログ・評価の回帰テストを組み込んでおく。
              </p>
            </div>
          </div>

          <p style={{ marginTop: "20px" }}>
            この順番で少しずつ成熟度を上げていくことで、無理なく「AI CI/CD」の実践に到達できる。
          </p>
        </section>

        <section id="references" className={styles.chapter}>
          <h2 className={styles.chapterTitle}>
            <i className="ti ti-books" />
            8. 参考文献・出典URL一覧
          </h2>

          <div className={styles.refGroup}>
            <h3>
              <i className="ti ti-stairs-up" />
              MLOps全般・成熟度モデル
            </h3>
            <ul className={styles.refList}>
              <li>
                <span className={styles.refTitle}>
                  Google Cloud Architecture Center「MLOps: Continuous delivery and automation
                  pipelines in machine learning」
                </span>
                <Ext href="https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning">
                  https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  MLflow公式ブログ「MLOps Pipeline Automation Best Practices in 2026」
                </span>
                <Ext href="https://mlflow.org/articles/mlops-pipeline-automation-best-practices-in-2026/">
                  https://mlflow.org/articles/mlops-pipeline-automation-best-practices-in-2026/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Kernshell「MLOps in 2026: Best Practices for Scalable ML Deployment」
                </span>
                <Ext href="https://www.kernshell.com/best-practices-for-scalable-machine-learning-deployment/">
                  https://www.kernshell.com/best-practices-for-scalable-machine-learning-deployment/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Azilen「8 MLOps Best Practices You Should Implement in 2026」
                </span>
                <Ext href="https://www.azilen.com/blog/mlops-best-practices/">
                  https://www.azilen.com/blog/mlops-best-practices/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Glasier「Ultimate Guide to MLOps Process and Best Practices, 2026」
                </span>
                <Ext href="https://www.glasierinc.com/blog/machine-learning-operations-mlops-guide">
                  https://www.glasierinc.com/blog/machine-learning-operations-mlops-guide
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  N-iX「MLOps best practices: A hands-on experience guide」
                </span>
                <Ext href="https://www.n-ix.com/mlops-best-practices/">
                  https://www.n-ix.com/mlops-best-practices/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Flexiana「MLOps Maturity Model 2026: 4 Stages to Resilient, Risk-Free Machine
                  Learning」
                </span>
                <Ext href="https://medium.com/@flexianadevgroup/mlops-maturity-model-2026-4-stages-to-resilient-risk-free-machine-learning-468c097dc25c">
                  https://medium.com/@flexianadevgroup/mlops-maturity-model-2026-4-stages-to-resilient-risk-free-machine-learning-468c097dc25c
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Prepzee「Top 15 MLOps Tools to Learn in 2026」
                </span>
                <Ext href="https://prepzee.com/blog/top-15-mlops-tools-to-learn/">
                  https://prepzee.com/blog/top-15-mlops-tools-to-learn/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>Online Inference「Top MLOps tools in 2026」</span>
                <Ext href="https://medium.com/online-inference/top-mlops-tools-in-2026-858fd479acac">
                  https://medium.com/online-inference/top-mlops-tools-in-2026-858fd479acac
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  GitNexa「MLOps Implementation Guide for 2026」
                </span>
                <Ext href="https://www.gitnexa.com/blogs/mlops-implementation-best-practices">
                  https://www.gitnexa.com/blogs/mlops-implementation-best-practices
                </Ext>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h3>
              <i className="ti ti-database" />
              データ・モデルバージョン管理
            </h3>
            <ul className={styles.refList}>
              <li>
                <span className={styles.refTitle}>DVC公式サイト</span>
                <Ext href="https://dvc.org/">https://dvc.org/</Ext>
              </li>
              <li>
                <span className={styles.refTitle}>DVC公式ユーザーガイド</span>
                <Ext href="https://doc.dvc.org/user-guide">https://doc.dvc.org/user-guide</Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  lakeFS「Best Data Version Control Tools in 2026」
                </span>
                <Ext href="https://lakefs.io/data-version-control/dvc-tools/">
                  https://lakefs.io/data-version-control/dvc-tools/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Wikipedia「Data Version Control (software)」
                </span>
                <Ext href="https://en.wikipedia.org/wiki/Data_Version_Control_(software)">
                  https://en.wikipedia.org/wiki/Data_Version_Control_(software)
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Label Your Data「Data Versioning: ML Best Practices Checklist 2026」
                </span>
                <Ext href="https://labelyourdata.com/articles/machine-learning/data-versioning">
                  https://labelyourdata.com/articles/machine-learning/data-versioning
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  DataCamp「The Complete Guide to Data Version Control With DVC」
                </span>
                <Ext href="https://www.datacamp.com/tutorial/data-version-control-dvc">
                  https://www.datacamp.com/tutorial/data-version-control-dvc
                </Ext>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h3>
              <i className="ti ti-message-chatbot" />
              LLMOps・プロンプトCI/CD
            </h3>
            <ul className={styles.refList}>
              <li>
                <span className={styles.refTitle}>
                  MyEngineeringPath「LLMOps — CI/CD, Eval Gates &amp; LLM Deployment (2026)」
                </span>
                <Ext href="https://myengineeringpath.dev/genai-engineer/llmops/">
                  https://myengineeringpath.dev/genai-engineer/llmops/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Jubin Soni「Engineering LLMOps: Building Robust CI/CD Pipelines for LLM
                  Applications on Google Cloud」
                </span>
                <Ext href="https://jubinsoni.medium.com/engineering-llmops-building-robust-ci-cd-pipelines-for-llm-applications-on-google-cloud-136b1fdbcbb5">
                  https://jubinsoni.medium.com/engineering-llmops-building-robust-ci-cd-pipelines-for-llm-applications-on-google-cloud-136b1fdbcbb5
                </Ext>{" "}
                （
                <Ext href="https://dev.to/jubinsoni/engineering-llmops-building-robust-cicd-pipelines-for-llm-applications-on-google-cloud-22hc">
                  DEV Community版
                </Ext>
                ）
              </li>
              <li>
                <span className={styles.refTitle}>
                  ExamCertAI「LLMOps Skills &amp; Certifications 2026」
                </span>
                <Ext href="https://www.examcert.app/blog/llmops-skills-certifications-2026/">
                  https://www.examcert.app/blog/llmops-skills-certifications-2026/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  MachineLearningMastery「The Roadmap for Mastering LLMOps in 2026」
                </span>
                <Ext href="https://machinelearningmastery.com/the-roadmap-for-mastering-llmops-in-2026/">
                  https://machinelearningmastery.com/the-roadmap-for-mastering-llmops-in-2026/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  LangWatch「Prompt Management: Version &amp; Deploy Prompts in Production」
                </span>
                <Ext href="https://langwatch.ai/blog/what-is-prompt-management-and-how-to-version-control-deploy-prompts-in-productions">
                  https://langwatch.ai/blog/what-is-prompt-management-and-how-to-version-control-deploy-prompts-in-productions
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  apxml「Integrating LLMOps with CI/CD Systems」
                </span>
                <Ext href="https://apxml.com/courses/mlops-for-large-models-llmops/chapter-6-advanced-llmops-systems-workflows/integrating-llmops-cicd">
                  https://apxml.com/courses/mlops-for-large-models-llmops/chapter-6-advanced-llmops-systems-workflows/integrating-llmops-cicd
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Agenta「CI/CD for LLM Prompts: How to Build a Prompt Deployment Pipeline」
                </span>
                <Ext href="https://agenta.ai/blog/cicd-for-llm-prompts">
                  https://agenta.ai/blog/cicd-for-llm-prompts
                </Ext>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h3>
              <i className="ti ti-robot" />
              AIエージェントによるCI/CD自動化
            </h3>
            <ul className={styles.refList}>
              <li>
                <span className={styles.refTitle}>
                  renue「AI DevOps完全ガイド2026｜Claude Code×GitHub Actions×CI/CD自動化」
                </span>
                <Ext href="https://renue.co.jp/posts/ai-devops-claude-code-github-actions-ci-cd-ai-review-2026">
                  https://renue.co.jp/posts/ai-devops-claude-code-github-actions-ci-cd-ai-review-2026
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  GitHubブログ「GitHub Agentic Workflowsを発表」
                </span>
                <Ext href="https://github.blog/jp/2026-02-16-automate-repository-tasks-with-github-agentic-workflows/">
                  https://github.blog/jp/2026-02-16-automate-repository-tasks-with-github-agentic-workflows/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>Uravation「Codex GitHub Action 完全ガイド」</span>
                <Ext href="https://uravation.com/media/codex-github-action-complete-guide-2026/">
                  https://uravation.com/media/codex-github-action-complete-guide-2026/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>AIzen「CodexをGitHub Actionsで使う方法」</span>
                <Ext href="https://aizen-ai.co.jp/codex-github-actions/">
                  https://aizen-ai.co.jp/codex-github-actions/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Google Codelabs「生成AIを使用したコードレビューの自動化」
                </span>
                <Ext href="https://codelabs.developers.google.com/genai-for-dev-github-code-review">
                  https://codelabs.developers.google.com/genai-for-dev-github-code-review
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Fintan「GitLab環境でGitリポジトリをハブとしたAI駆動開発」
                </span>
                <Ext href="https://fintan.jp/page/19508/">https://fintan.jp/page/19508/</Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  potproject「GitHub上で依頼してPR作成する自律型AIエージェントを作った」
                </span>
                <Ext href="https://blog.potproject.net/2025/04/14/github-pr-automate-ai-agents/">
                  https://blog.potproject.net/2025/04/14/github-pr-automate-ai-agents/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  note.com（mnuma）「GitHub公式actions/ai-inferenceアクションでコード自動レビュー」
                </span>
                <Ext href="https://note.com/mnuma/n/ne5dbb93a340e">
                  https://note.com/mnuma/n/ne5dbb93a340e
                </Ext>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h3>
              <i className="ti ti-git-branch" />
              デプロイ戦略
            </h3>
            <ul className={styles.refList}>
              <li>
                <span className={styles.refTitle}>
                  devops-daily.com「Deployment Strategies: Blue-Green, Canary, and Rolling
                  Deployments Explained」
                </span>
                <Ext href="https://devops-daily.com/posts/deployment-strategies-guide">
                  https://devops-daily.com/posts/deployment-strategies-guide
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Intuz「8 Most Reliable Strategies for Secure ML Model Deployment」
                </span>
                <Ext href="https://www.intuz.com/blog/strategies-for-deploying-ml-models">
                  https://www.intuz.com/blog/strategies-for-deploying-ml-models
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  123ofai「Canary Deployment for ML Models — Complete Guide (2026)」
                </span>
                <Ext href="https://123ofai.com/qnalab/system-design/blocks/canary-deploy">
                  https://123ofai.com/qnalab/system-design/blocks/canary-deploy
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>CloudBees「Deployment strategies」</span>
                <Ext href="https://docs.cloudbees.com/docs/cloudbees-cd/latest/plan/deployment-strategies">
                  https://docs.cloudbees.com/docs/cloudbees-cd/latest/plan/deployment-strategies
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  CircleCI「Deployment strategies: Types, trade-offs, and how to choose」
                </span>
                <Ext href="https://circleci.com/blog/deployment-strategies-types-trade-offs-and-how-to-choose/">
                  https://circleci.com/blog/deployment-strategies-types-trade-offs-and-how-to-choose/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Harness「Blue-Green and Canary Deployments Explained」
                </span>
                <Ext href="https://www.harness.io/blog/blue-green-canary-deployment-strategies">
                  https://www.harness.io/blog/blue-green-canary-deployment-strategies
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  arXiv「A Multivocal Review of MLOps Practices, Challenges and Open Issues」
                </span>
                <Ext href="https://arxiv.org/pdf/2406.09737">https://arxiv.org/pdf/2406.09737</Ext>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h3>
              <i className="ti ti-shield-lock" />
              セキュリティ・ガバナンス
            </h3>
            <ul className={styles.refList}>
              <li>
                <span className={styles.refTitle}>OWASP「CI/CD Security Cheat Sheet」</span>
                <Ext href="https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html">
                  https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Secure Pipelines「OWASP Top 10 CI/CD Risks Explained with Real-World Examples」
                </span>
                <Ext href="https://secure-pipelines.com/ci-cd-security/owasp-top-10-ci-cd-risks-explained-real-world-examples/">
                  https://secure-pipelines.com/ci-cd-security/owasp-top-10-ci-cd-risks-explained-real-world-examples/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Cycode「OWASP Top 10 2025: Addressing Software Supply Chain and LLM Risks」
                </span>
                <Ext href="https://cycode.com/blog/the-2025-owasp-top-10-addressing-software-supply-chain-and-llm-risks-with-cycode/">
                  https://cycode.com/blog/the-2025-owasp-top-10-addressing-software-supply-chain-and-llm-risks-with-cycode/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Gravitee「OWASP Top 10 for LLM Applications (2025): A Practical Guide」
                </span>
                <Ext href="https://www.gravitee.io/blog/owasp-top-10-for-llm-applications-2025-a-practical-guide">
                  https://www.gravitee.io/blog/owasp-top-10-for-llm-applications-2025-a-practical-guide
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Security Boulevard「The OWASP Top 10 for LLM Applications (2025): Explained
                  Simply」
                </span>
                <Ext href="https://securityboulevard.com/2026/03/the-owasp-top-10-for-llm-applications-2025-explained-simply/">
                  https://securityboulevard.com/2026/03/the-owasp-top-10-for-llm-applications-2025-explained-simply/
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Alejandro Aucestovar「From OWASP Top 10 for LLMs to CI/CD: Securing AI Systems at
                  Build Time」
                </span>
                <Ext href="https://medium.com/@aucestovara/from-owasp-top-10-for-llms-to-ci-cd-securing-ai-systems-at-build-time-1dce225cb9c0">
                  https://medium.com/@aucestovara/from-owasp-top-10-for-llms-to-ci-cd-securing-ai-systems-at-build-time-1dce225cb9c0
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  SOCFortress「OWASP Top 10 for LLM Applications 2025: Testing Local Models Against
                  Real Attack Scenarios — Part III」
                </span>
                <Ext href="https://socfortress.medium.com/owasp-top-10-for-llm-applications-2025-testing-local-models-against-real-attack-scenarios-part-5e453e4015cb">
                  https://socfortress.medium.com/owasp-top-10-for-llm-applications-2025-testing-local-models-against-real-attack-scenarios-part-5e453e4015cb
                </Ext>
              </li>
              <li>
                <span className={styles.refTitle}>
                  Siemba「OWASP Top 10 for LLMs (2026) Security Testing &amp; Mitigation Guide」
                </span>
                <Ext href="https://www.siemba.io/owasp-top-10-llm-security-testing">
                  https://www.siemba.io/owasp-top-10-llm-security-testing
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        <footer className={styles.pageFooter}>
          本ガイドは2026年7月時点で参照可能な情報をもとに作成している。CI/CDツールやAIエージェントの機能は変化が速い領域のため、実際の導入にあたっては各ツールの公式ドキュメントで最新の仕様を確認することを推奨する。
        </footer>
      </main>
    </div>
  );
}
