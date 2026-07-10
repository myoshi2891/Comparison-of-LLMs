import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "ローカルLLM/セルフホスティング 完全ガイド 2026 | LLM-Studies",
  description:
    "クラウドAPIを使わず、自分のPCやサーバーでLLMを動かすための実践ガイド。ハードウェア選定、モデル選定、推論エンジン(Ollama/vLLM)、Web UI、RAG構築、本番運用、セキュリティ対策までステップバイステップで解説します。",
};

const DIAGRAMS = {
  architecture: `flowchart TB
    User["利用者"] --> App["チャットUIやアプリ"]
    App --> API["OpenAI互換API"]
    API --> Engine["推論エンジン"]
    Engine --> Model["量子化済みモデル"]
    Engine --> HW["GPU VRAM or CPU RAM"]
    App -.-> Retriever["検索コンポーネント RAG"]
    Retriever --> VectorDB["ベクトルDB"]
    VectorDB --> Docs["社内ドキュメント"]`,

  roadmap: `flowchart LR
    A["目的定義"] --> B["ハードウェア確認"]
    B --> C["量子化理解"]
    C --> D["モデル選定"]
    D --> E["ツール選定"]
    E --> F["インストール"]
    F --> G["Web UI導入"]
    G --> H["RAG構築"]
    H --> I["本番スケール"]
    I --> J["セキュリティ"]
    J --> K["監視運用"]`,

  modelSelect: `flowchart TD
    Start["モデルを選ぶ"] --> Q1{"最優先事項は?"}
    Q1 -->|"VRAMに収める"| HW["ステップ2の早見表を確認"]
    Q1 -->|"コーディング性能"| Coding["Qwen Coder系 GLM-5.1系"]
    Q1 -->|"長文書処理"| LongCtx["Llama4 Scout DeepSeekV4"]
    Q1 -->|"商用ライセンス重視"| License["Apache2.0 MIT系モデル"]
    HW --> Pick["候補モデルを確認する"]
    Coding --> Pick
    LongCtx --> Pick
    License --> Pick`,

  toolSelect: `flowchart TD
    Start["ローカルLLMを動かしたい"] --> Q1{"用途は?"}
    Q1 -->|"個人利用"| Q2{"GUIが欲しいか"}
    Q1 -->|"チーム本番利用"| Q4{"同時利用者数は?"}
    Q2 -->|"はい"| LMStudio["LM Studio"]
    Q2 -->|"いいえ"| Ollama["Ollama"]
    Q4 -->|"少数"| OllamaServer["Ollama + Open WebUI"]
    Q4 -->|"多数"| VLLM["vLLM + Docker"]
    Ollama --> WebUIAdd["必要ならOpen WebUI追加"]`,

  rag: `flowchart LR
    Doc["ドキュメント"] --> Split["チャンク分割"]
    Split --> Embed["埋め込みモデル"]
    Embed --> Store["ベクトルDB"]
    Query["ユーザーの質問"] --> EmbedQ["質問の埋め込み化"]
    EmbedQ --> Search["類似検索"]
    Store --> Search
    Search --> Context["関連チャンク取得"]
    Context --> Prompt["プロンプトに追加"]
    Prompt --> LLM["ローカルLLM"]
    LLM --> Answer["根拠付き回答"]`,

  security: `flowchart TB
    Internet["外部ネットワーク"] --> FW["ファイアウォールとプロキシ"]
    FW --> Auth["認証層 APIキー JWT"]
    Auth --> RateLimit["レート制限"]
    RateLimit --> LLMServer["LLM推論サーバー"]
    LLMServer --> Isolation["コンテナ ネットワーク分離"]
    Isolation --> Logging["ログと監視"]`,
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function LocalLlmSelfHostingPage() {
  return (
    <div className={styles.pageWrap}>
      <TocObserver />

      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <i className="ti ti-cpu" aria-hidden="true" />
          <span>ローカルLLM完全ガイド</span>
        </div>
        <nav aria-label="ページ内目次">
          <div className={styles.navGroupLabel}>はじめに</div>
          <a className={styles.tocLink} href="#overview">
            <i className="ti ti-info-circle" aria-hidden="true" />
            ローカルLLMとは
          </a>
          <a className={styles.tocLink} href="#architecture">
            <i className="ti ti-sitemap" aria-hidden="true" />
            全体アーキテクチャ
          </a>

          <div className={styles.navGroupLabel}>設計フェーズ</div>
          <a className={styles.tocLink} href="#step1">
            <i className="ti ti-target-arrow" aria-hidden="true" />
            1. 目的の明確化
          </a>
          <a className={styles.tocLink} href="#step2">
            <i className="ti ti-cpu-2" aria-hidden="true" />
            2. ハードウェア要件
          </a>
          <a className={styles.tocLink} href="#step3">
            <i className="ti ti-binary" aria-hidden="true" />
            3. 量子化フォーマット
          </a>
          <a className={styles.tocLink} href="#step4">
            <i className="ti ti-brain" aria-hidden="true" />
            4. モデル選定
          </a>
          <a className={styles.tocLink} href="#step5">
            <i className="ti ti-apps" aria-hidden="true" />
            5. 実行エンジン選定
          </a>

          <div className={styles.navGroupLabel}>構築フェーズ</div>
          <a className={styles.tocLink} href="#step6">
            <i className="ti ti-download" aria-hidden="true" />
            6. Ollama導入
          </a>
          <a className={styles.tocLink} href="#step7">
            <i className="ti ti-layout-dashboard" aria-hidden="true" />
            7. Web UI導入
          </a>
          <a className={styles.tocLink} href="#step8">
            <i className="ti ti-database-search" aria-hidden="true" />
            8. RAG構築
          </a>

          <div className={styles.navGroupLabel}>運用フェーズ</div>
          <a className={styles.tocLink} href="#step9">
            <i className="ti ti-server-2" aria-hidden="true" />
            9. 本番スケール
          </a>
          <a className={styles.tocLink} href="#step10">
            <i className="ti ti-shield-lock" aria-hidden="true" />
            10. セキュリティ
          </a>
          <a className={styles.tocLink} href="#step11">
            <i className="ti ti-activity" aria-hidden="true" />
            11. 監視/運用
          </a>

          <div className={styles.navGroupLabel}>まとめ</div>
          <a className={styles.tocLink} href="#summary">
            <i className="ti ti-checklist" aria-hidden="true" />
            導入チェックリスト
          </a>
          <a className={styles.tocLink} href="#references">
            <i className="ti ti-link" aria-hidden="true" />
            参考文献一覧
          </a>
        </nav>
      </aside>

      <main className={styles.content}>
        <header className={styles.hero}>
          <div className={styles.eyebrow}>
            <i className="ti ti-sparkles" aria-hidden="true" />
            初学者向けステップバイステップガイド
          </div>
          <h1 className={styles.pageTitle}>ローカルLLM/セルフホスティング 完全ガイド</h1>
          <p className={styles.lead}>
            クラウドAPIを使わず、自分のPCやサーバーでLLMを動かすための実践ガイドです。ハードウェア選定からモデル選び、環境構築、RAG連携、本番運用、セキュリティ対策までをステップバイステップで解説します。
          </p>
          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <i className="ti ti-calendar" aria-hidden="true" />
              2026年7月時点の情報に基づく
            </div>
            <div className={styles.metaItem}>
              <i className="ti ti-list-numbers" aria-hidden="true" />
              全11ステップ
            </div>
            <div className={styles.metaItem}>
              <i className="ti ti-link" aria-hidden="true" />
              参照元URL 60件以上
            </div>
          </div>
        </header>

        <section className={styles.step} id="overview">
          <h2>ローカルLLMとは何か、なぜ自前でホストするのか</h2>
          <p>
            ローカルLLMとは、ChatGPTやClaudeのようなクラウドAPIを使わず、自分のPCやサーバー上で大規模言語モデルを直接動かす方式です。2026年現在、量子化技術と推論エンジンの成熟により、コンシューマー向けGPUでも実用的な速度で数十億〜数百億パラメータのモデルを動かせるようになっています
            <sup className={styles.cite}>
              <a href="#ref-1">[1]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-3">[3]</a>
            </sup>
            。
          </p>

          <h3>メリット</h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>観点</th>
                  <th style={{ textAlign: "left" }}>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>プライバシー/データ主権</td>
                  <td>
                    プロンプトやデータが外部サーバーに送信されない。医療・法務・金融など機密性の高い業務に必須
                    <sup className={styles.cite}>
                      <a href="#ref-8">[8]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-30">[30]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>コスト</td>
                  <td>
                    一度ハードウェアに投資すれば、トークン単価は実質ゼロ。高頻度・大量利用ほど有利
                    <sup className={styles.cite}>
                      <a href="#ref-3">[3]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-21">[21]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>オフライン動作</td>
                  <td>インターネット接続なしで動作可能</td>
                </tr>
                <tr>
                  <td>カスタマイズ性</td>
                  <td>モデルのファインチューニングやシステムプロンプトの完全制御が可能</td>
                </tr>
                <tr>
                  <td>レイテンシ</td>
                  <td>
                    ネットワーク往復がないため応答が高速(ローカル環境では100ms未満も可能)
                    <sup className={styles.cite}>
                      <a href="#ref-1">[1]</a>
                    </sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>デメリット・注意点</h3>
          <ul>
            <li>
              最先端 of
              クローズドモデルと比べると、特に複雑な推論や最新情報を要するタスクでは品質差が残る場合がある
              <sup className={styles.cite}>
                <a href="#ref-4">[4]</a>
              </sup>
              <sup className={styles.cite}>
                <a href="#ref-47">[47]</a>
              </sup>
            </li>
            <li>初期のハードウェア投資が必要</li>
            <li>運用・保守(セキュリティパッチ、モデル更新、監視)は自己責任</li>
            <li>
              小規模・低頻度利用ではクラウドAPIの方がトータルコストで有利なケースもある
              <sup className={styles.cite}>
                <a href="#ref-47">[47]</a>
              </sup>
            </li>
          </ul>

          <div className={`${styles.callout} ${styles.tip}`}>
            <i className="ti ti-bulb" aria-hidden="true" />
            <div className={styles.calloutBody}>
              <strong>経験則</strong>:
              自前運用がクラウドAPIに対してコスト面で有利になる分岐点は、単一ホスト構成でおよそ1日あたり500万トークン程度からと言われています(モデル規模やGPU単価により変動)
              <sup className={styles.cite}>
                <a href="#ref-47">[47]</a>
              </sup>
              。
            </div>
          </div>
        </section>

        <section className={styles.step} id="architecture">
          <h2>全体アーキテクチャを理解する</h2>
          <p>
            ローカルLLM環境は大きく「推論エンジン層」「アプリケーション層」「(任意で)RAG層」に分かれます。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAMS.architecture} />
            <div className={styles.diagramCaption}>図: ローカルLLM環境の全体アーキテクチャ</div>
          </div>

          <p>
            この後のステップでは、この図の各要素を下から順番に(ハードウェア &rarr; モデル &rarr; エンジン
            &rarr; UI &rarr; RAG &rarr; 本番運用 &rarr; セキュリティ)構築していきます。
          </p>

          <h3>学習ロードマップ</h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAMS.roadmap} />
            <div className={styles.diagramCaption}>図: 本ガイドの学習ロードマップ(全11ステップ)</div>
          </div>
        </section>

        <section className={styles.step} id="step1">
          <h2>ステップ1: 目的とユースケースを明確にする</h2>
          <p>
            最初に決めるべきは「何のためにローカルLLMを使うか」です。これによってハードウェア・モデル・ツールの選択がすべて変わります。
          </p>

          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>ユースケース</th>
                  <th style={{ textAlign: "left" }}>想定規模</th>
                  <th style={{ textAlign: "left" }}>推奨アプローチ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>個人の学習・実験</td>
                  <td>7B〜14Bモデル</td>
                  <td>ノートPC + Ollama</td>
                </tr>
                <tr>
                  <td>コーディング支援(個人/小規模チーム)</td>
                  <td>14B〜32Bモデル</td>
                  <td>デスクトップGPU + Ollama/LM Studio</td>
                </tr>
                <tr>
                  <td>社内RAGチャットボット</td>
                  <td>8B〜70Bモデル</td>
                  <td>GPUサーバー + Open WebUI + ベクトルDB</td>
                </tr>
                <tr>
                  <td>複数ユーザー向け本番API</td>
                  <td>20B〜70B以上</td>
                  <td>vLLM + Docker/Kubernetes</td>
                </tr>
                <tr>
                  <td>機密データを扱う規制業界向け</td>
                  <td>要件次第</td>
                  <td>
                    オンプレGPU + 厳格なネットワーク分離
                    <sup className={styles.cite}>
                      <a href="#ref-8">[8]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-30">[30]</a>
                    </sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.step} id="step2">
          <h2>ステップ2: ハードウェア要件を把握する</h2>

          <h3>VRAM計算の基本公式</h3>
          <p>
            モデルが必要とするVRAM(またはRAM)は、おおよそ次の式で見積もれます
            <sup className={styles.cite}>
              <a href="#ref-1">[1]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-59">[59]</a>
            </sup>
            。
          </p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                必要VRAM(GB) &asymp; パラメータ数(B) &times; 1バイトあたりのビット数 &divide; 8
              </div>
            </div>
          </div>
          <p>
            例えば70億パラメータ(7B)モデルをFP16(16bit)で動かす場合、7 &times; 16 &divide; 8 =
            14GB程度が必要です。4bit量子化(Q4)まで落とせば、およそ4分の1の3.5〜5GB程度まで圧縮できます
            <sup className={styles.cite}>
              <a href="#ref-59">[59]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-62">[62]</a>
            </sup>
            。
          </p>

          <h3>モデルサイズ別 必要VRAM早見表</h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>モデル規模</th>
                  <th style={{ textAlign: "left" }}>FP16(元精度)</th>
                  <th style={{ textAlign: "left" }}>Q8(8bit)</th>
                  <th style={{ textAlign: "left" }}>Q4_K_M(4bit)</th>
                  <th style={{ textAlign: "left" }}>目安となるGPU</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>7B〜8B</td>
                  <td>約14GB</td>
                  <td>約7〜8GB</td>
                  <td>約4〜6GB</td>
                  <td>
                    RTX 4060/5060 Ti(8GB)
                    <sup className={styles.cite}>
                      <a href="#ref-60">[60]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-62">[62]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>13B〜14B</td>
                  <td>約26〜28GB</td>
                  <td>約13〜14GB</td>
                  <td>約8〜10GB</td>
                  <td>
                    RTX 4070 Ti/5070(12GB)
                    <sup className={styles.cite}>
                      <a href="#ref-60">[60]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>24B〜32B</td>
                  <td>約48〜64GB</td>
                  <td>約24〜32GB</td>
                  <td>約16〜20GB</td>
                  <td>
                    RTX 4090/5080(16〜24GB)
                    <sup className={styles.cite}>
                      <a href="#ref-60">[60]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-65">[65]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>70B</td>
                  <td>約140GB</td>
                  <td>約70GB</td>
                  <td>約38〜42GB</td>
                  <td>
                    デュアルRTX 5090(64GB)、Mac Studio(128GB統合メモリ)
                    <sup className={styles.cite}>
                      <a href="#ref-58">[58]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-65">[65]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>100B〜1T級(MoE)</td>
                  <td>数百GB〜</td>
                  <td>-</td>
                  <td>数十〜百GB台</td>
                  <td>
                    H100/H200等データセンターGPU
                    <sup className={styles.cite}>
                      <a href="#ref-21">[21]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-29">[29]</a>
                    </sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.tip}`}>
            <i className="ti ti-info-circle" aria-hidden="true" />
            <div className={styles.calloutBody}>
              実際のVRAM使用量はモデル重みだけでなく、KVキャッシュ(会話の文脈保持)やフレームワークのオーバーヘッドで10〜30%程度増加します
              <sup className={styles.cite}>
                <a href="#ref-29">[29]</a>
              </sup>
              <sup className={styles.cite}>
                <a href="#ref-59">[59]</a>
              </sup>
              。長いコンテキストウィンドウを使うほどKVキャッシュの負荷が大きくなる点に注意してください。
            </div>
          </div>

          <h3>環境別の現実的な性能目安</h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>環境</th>
                  <th style={{ textAlign: "left" }}>動作するモデル規模</th>
                  <th style={{ textAlign: "left" }}>体感速度</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CPUのみ(16GB RAM)</td>
                  <td>3B〜7B(Q4)</td>
                  <td>
                    5〜25トークン/秒。バッチ処理向き
                    <sup className={styles.cite}>
                      <a href="#ref-2">[2]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>Apple Silicon(16GB統合メモリ)</td>
                  <td>7B〜13B</td>
                  <td>
                    7Bで1〜3秒/クエリ
                    <sup className={styles.cite}>
                      <a href="#ref-4">[4]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>Apple Silicon(64GB)</td>
                  <td>70B</td>
                  <td>
                    段落単位の応答で8〜15秒程度
                    <sup className={styles.cite}>
                      <a href="#ref-4">[4]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>NVIDIA GPU 8GB VRAM</td>
                  <td>7B</td>
                  <td>
                    2秒未満/クエリ
                    <sup className={styles.cite}>
                      <a href="#ref-4">[4]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>NVIDIA GPU 24GB VRAM(RTX 4090)</td>
                  <td>13B〜34B</td>
                  <td>
                    34Bで4〜6秒/クエリ
                    <sup className={styles.cite}>
                      <a href="#ref-4">[4]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>NVIDIA GPU 32GB VRAM(RTX 5090)</td>
                  <td>70B(Q4、フルVRAM収容時)</td>
                  <td>
                    45トークン/秒以上。オフロード発生時は1〜2トークン/秒まで急落
                    <sup className={styles.cite}>
                      <a href="#ref-61">[61]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-64">[64]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>データセンターGPU(H100/H200&times;2)</td>
                  <td>70B以上</td>
                  <td>
                    300〜500トークン/秒、80〜120同時リクエスト
                    <sup className={styles.cite}>
                      <a href="#ref-21">[21]</a>
                    </sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.warning}`}>
            <i className="ti ti-alert-triangle" aria-hidden="true" />
            <div className={styles.calloutBody}>
              <strong>重要な原則</strong>:
              「モデルがVRAMに収まりきるかどうか」が最大の分岐点です。収まらずシステムRAMにオフロードが発生すると、速度は5〜20倍程度低下することがあります
              <sup className={styles.cite}>
                <a href="#ref-61">[61]</a>
              </sup>
              。ハードウェア購入前に、必ず目的のモデル&times;量子化レベルでの必要VRAMを計算してください。
            </div>
          </div>

          <h3>GPUを選ぶ際の判断軸</h3>
          <ul>
            <li>
              <strong>VRAM容量が最優先</strong>(コンピュート性能やCUDAコア数は二の次)
              <sup className={styles.cite}>
                <a href="#ref-61">[61]</a>
              </sup>
            </li>
            <li>
              <strong>メモリ帯域幅</strong>
              が実効速度に直結(LLM推論はメモリ帯域律速のワークロードが大半)
              <sup className={styles.cite}>
                <a href="#ref-62">[62]</a>
              </sup>
              <sup className={styles.cite}>
                <a href="#ref-64">[64]</a>
              </sup>
            </li>
            <li>
              予算に応じた選択肢:
              <ul>
                <li>
                  エントリー: 中古RTX 3090(24GB、コスパ最強)
                  <sup className={styles.cite}>
                    <a href="#ref-65">[65]</a>
                  </sup>
                </li>
                <li>バランス型: RTX 4070 Ti/5070 Ti(12〜16GB)</li>
                <li>ハイエンド: RTX 4090/5090(24〜32GB)</li>
                <li>
                  Mac派: Apple Silicon Studio/Max系(統合メモリで大容量、ただし速度はNVIDIA
                  GPUに劣る)
                  <sup className={styles.cite}>
                    <a href="#ref-58">[58]</a>
                  </sup>
                  <sup className={styles.cite}>
                    <a href="#ref-65">[65]</a>
                  </sup>
                </li>
                <li>
                  業務用途: RTX PRO 6000(96GB)、H100/H200(データセンター向け)
                  <sup className={styles.cite}>
                    <a href="#ref-63">[63]</a>
                  </sup>
                </li>
              </ul>
            </li>
          </ul>
        </section>

        <section className={styles.step} id="step3">
          <h2>ステップ3: 量子化フォーマットを理解する</h2>
          <p>
            量子化(Quantization)とは、モデルの重みを16bit浮動小数点から8bit/4bitなどの低精度表現に圧縮する技術です。これにより、モデルサイズとVRAM使用量を大幅に削減できます
            <sup className={styles.cite}>
              <a href="#ref-13">[13]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-17">[17]</a>
            </sup>
            。
          </p>

          <h3>主要フォーマットの違い</h3>
          <p>
            重要な区別として、<strong>GGUF/EXL2/MLXは「ファイル形式」</strong>であり、<strong>GPTQ/AWQは「量子化アルゴリズム」</strong>である点があります。GPTQ・AWQで量子化されたモデルは通常のHugging
            Face safetensors形式で配布されます
            <sup className={styles.cite}>
              <a href="#ref-12">[12]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-18">[18]</a>
            </sup>
            。
          </p>

          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>フォーマット</th>
                  <th style={{ textAlign: "left" }}>種別</th>
                  <th style={{ textAlign: "left" }}>主な対応環境</th>
                  <th style={{ textAlign: "left" }}>特徴</th>
                  <th style={{ textAlign: "left" }}>品質保持率の目安(4bit時)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>GGUF</td>
                  <td>ファイル形式</td>
                  <td>CPU/GPU/Apple Silicon(llama.cpp・Ollama・LM Studio)</td>
                  <td>
                    汎用性が高くCPUオフロードが可能。K-quantで層ごとに精度を最適化
                    <sup className={styles.cite}>
                      <a href="#ref-13">[13]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-17">[17]</a>
                    </sup>
                  </td>
                  <td>
                    約92%
                    <sup className={styles.cite}>
                      <a href="#ref-11">[11]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>GPTQ</td>
                  <td>量子化アルゴリズム</td>
                  <td>NVIDIA GPU(vLLM・ExLlama等)</td>
                  <td>
                    列単位でキャリブレーションし誤差を補正。既存資産が豊富
                    <sup className={styles.cite}>
                      <a href="#ref-18">[18]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-19">[19]</a>
                    </sup>
                  </td>
                  <td>
                    約90%
                    <sup className={styles.cite}>
                      <a href="#ref-11">[11]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>AWQ</td>
                  <td>量子化アルゴリズム</td>
                  <td>NVIDIA GPU(vLLM)</td>
                  <td>
                    活性化値を観測し重要な重みを高精度に保持
                    <sup className={styles.cite}>
                      <a href="#ref-13">[13]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-19">[19]</a>
                    </sup>
                  </td>
                  <td>
                    約95%
                    <sup className={styles.cite}>
                      <a href="#ref-11">[11]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>EXL2</td>
                  <td>ファイル形式</td>
                  <td>NVIDIA GPU(ExLlamaV2)</td>
                  <td>
                    可変ビット幅で柔軟に圧縮率を調整可能
                    <sup className={styles.cite}>
                      <a href="#ref-12">[12]</a>
                    </sup>
                  </td>
                  <td>モデル依存</td>
                </tr>
                <tr>
                  <td>MLX</td>
                  <td>ファイル形式</td>
                  <td>Apple Silicon専用</td>
                  <td>
                    Mac環境に最適化
                    <sup className={styles.cite}>
                      <a href="#ref-12">[12]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-20">[20]</a>
                    </sup>
                  </td>
                  <td>
                    GGUF Q4相当
                    <sup className={styles.cite}>
                      <a href="#ref-20">[20]</a>
                    </sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>用途別の選び方</h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>状況</th>
                  <th style={{ textAlign: "left" }}>推奨フォーマット</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ノートPC/CPU中心/汎用利用</td>
                  <td>
                    GGUF Q4_K_M(Ollama・LM Studio・llama.cpp)
                    <sup className={styles.cite}>
                      <a href="#ref-15">[15]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-17">[17]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>NVIDIA GPU専用の本番推論サーバー</td>
                  <td>
                    AWQ(vLLM経由、品質重視)
                    <sup className={styles.cite}>
                      <a href="#ref-13">[13]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-19">[19]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>既にGPTQ資産がある場合</td>
                  <td>
                    GPTQ継続利用 + Marlinカーネルで高速化
                    <sup className={styles.cite}>
                      <a href="#ref-18">[18]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>Apple Silicon専用環境</td>
                  <td>
                    MLX、または互換性重視でGGUF
                    <sup className={styles.cite}>
                      <a href="#ref-12">[12]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-20">[20]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>コーディング・数学など複雑推論タスク</td>
                  <td>
                    Q4未満(Q3・Q2)は避け、Q4以上を維持
                    <sup className={styles.cite}>
                      <a href="#ref-17">[17]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-20">[20]</a>
                    </sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.warning}`}>
            <i className="ti ti-alert-triangle" aria-hidden="true" />
            <div className={styles.calloutBody}>
              <strong>精度低下の非対称性</strong>:
              パープレキシティ(予測精度の指標)の低下は緩やかでも、数学やコード生成などの多段階推論タスクでは、低ビット量子化(Q3以下)での品質低下がパープレキシティの低下よりも大きく現れる傾向があります
              <sup className={styles.cite}>
                <a href="#ref-17">[17]</a>
              </sup>
              <sup className={styles.cite}>
                <a href="#ref-20">[20]</a>
              </sup>
              。エージェント/ツール利用が絡むワークロードではQ4を下回らないことが推奨されています。
            </div>
          </div>
        </section>

        <section className={styles.step} id="step4">
          <h2>ステップ4: モデルを選定する</h2>
          <p>
            2026年時点でのオープンウェイトモデルは、多くのベンチマークで商用クローズドモデルに肉薄、あるいは特定領域で上回るケースも出てきています
            <sup className={styles.cite}>
              <a href="#ref-39">[39]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-43">[43]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-44">[44]</a>
            </sup>
            。
          </p>

          <h3>ユースケース別おすすめモデル(2026年中頃時点)</h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>ユースケース</th>
                  <th style={{ textAlign: "left" }}>おすすめモデル例</th>
                  <th style={{ textAlign: "left" }}>ライセンス</th>
                  <th style={{ textAlign: "left" }}>備考</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>軽量汎用チャット</td>
                  <td>Llama 3.2/3.3、Qwen3 8B</td>
                  <td>Meta独自/Apache 2.0</td>
                  <td>
                    8GB VRAM級で動作
                    <sup className={styles.cite}>
                      <a href="#ref-40">[40]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-43">[43]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>コーディング支援</td>
                  <td>Qwen2.5/3 Coder系、GLM-5.1、DeepSeek Coder系</td>
                  <td>Apache 2.0/MIT</td>
                  <td>
                    HumanEvalで高スコア
                    <sup className={styles.cite}>
                      <a href="#ref-39">[39]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-40">[40]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-44">[44]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>長文コンテキスト処理</td>
                  <td>Llama 4 Scout(最大約1000万トークン)、DeepSeek V4(約100万トークン)</td>
                  <td>Meta独自/MIT</td>
                  <td>
                    大量ドキュメントの一括処理に強い
                    <sup className={styles.cite}>
                      <a href="#ref-40">[40]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-44">[44]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>エッジ/軽量デバイス</td>
                  <td>Gemma 4(2B/4B)、Phi-4-mini</td>
                  <td>Apache 2.0/MIT</td>
                  <td>
                    ノートPCやモバイル、IoT向け
                    <sup className={styles.cite}>
                      <a href="#ref-40">[40]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-46">[46]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>高度な推論(数学・論理)</td>
                  <td>DeepSeek R1、Qwen3 235B-A22B</td>
                  <td>MIT/Apache 2.0</td>
                  <td>
                    AIME等の推論ベンチマークで高評価
                    <sup className={styles.cite}>
                      <a href="#ref-40">[40]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-43">[43]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>エンタープライズ導入</td>
                  <td>Qwen3/3.5系、Mistral Small系、GLM-5系</td>
                  <td>Apache 2.0/MIT</td>
                  <td>
                    利用制限が少なく安全
                    <sup className={styles.cite}>
                      <a href="#ref-40">[40]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-44">[44]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-47">[47]</a>
                    </sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>ライセンスの注意点</h3>
          <ul>
            <li>
              <strong>Apache 2.0 / MIT</strong>: 商用利用・改変・再配布に制限がほぼなく最も安全
              <sup className={styles.cite}>
                <a href="#ref-40">[40]</a>
              </sup>
              <sup className={styles.cite}>
                <a href="#ref-45">[45]</a>
              </sup>
            </li>
            <li>
              <strong>Meta Llamaシリーズ独自ライセンス</strong>:
              月間アクティブユーザー数7億人超の企業には追加条件が発生する等、大規模事業者には制約がある点に注意
              <sup className={styles.cite}>
                <a href="#ref-40">[40]</a>
              </sup>
            </li>
            <li>
              必ず<strong>個々のモデルカード</strong>でライセンス条項を確認すること(本ガイドの情報は変動する可能性があります)
              <sup className={styles.cite}>
                <a href="#ref-39">[39]</a>
              </sup>
              <sup className={styles.cite}>
                <a href="#ref-44">[44]</a>
              </sup>
            </li>
          </ul>

          <h3>選定のフローチャート</h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAMS.modelSelect} />
            <div className={styles.diagramCaption}>図: モデル選定の判断フロー</div>
          </div>
        </section>

        <section className={styles.step} id="step5">
          <h2>ステップ5: 実行エンジン/ツールを選ぶ</h2>

          <h3>主要ツール比較表</h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>ツール</th>
                  <th style={{ textAlign: "left" }}>想定ユーザー</th>
                  <th style={{ textAlign: "left" }}>インターフェース</th>
                  <th style={{ textAlign: "left" }}>得意分野</th>
                  <th style={{ textAlign: "left" }}>ライセンス</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ollama</td>
                  <td>初学者〜開発者</td>
                  <td>CLI + OpenAI互換REST API</td>
                  <td>
                    手軽な導入、豊富なモデルライブラリ、Docker対応
                    <sup className={styles.cite}>
                      <a href="#ref-5">[5]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-9">[9]</a>
                    </sup>
                  </td>
                  <td>
                    MIT
                    <sup className={styles.cite}>
                      <a href="#ref-1">[1]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>LM Studio</td>
                  <td>非エンジニアを含む一般利用者</td>
                  <td>GUIチャット画面</td>
                  <td>
                    直感的な操作、初心者向け
                    <sup className={styles.cite}>
                      <a href="#ref-5">[5]</a>
                    </sup>
                  </td>
                  <td>独自(無料利用可)</td>
                </tr>
                <tr>
                  <td>llama.cpp</td>
                  <td>上級開発者</td>
                  <td>CLI/軽量サーバー</td>
                  <td>
                    細かいパラメータ調整、最小オーバーヘッド
                    <sup className={styles.cite}>
                      <a href="#ref-1">[1]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-15">[15]</a>
                    </sup>
                  </td>
                  <td>MIT</td>
                </tr>
                <tr>
                  <td>vLLM</td>
                  <td>本番運用チーム</td>
                  <td>OpenAI互換API</td>
                  <td>
                    PagedAttentionによる高スループット、連続バッチング
                    <sup className={styles.cite}>
                      <a href="#ref-21">[21]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-26">[26]</a>
                    </sup>
                  </td>
                  <td>Apache 2.0</td>
                </tr>
                <tr>
                  <td>LocalAI</td>
                  <td>セルフホスト志向の開発者</td>
                  <td>OpenAI互換API</td>
                  <td>
                    多様なモデル形式に対応した代替ランタイム
                    <sup className={styles.cite}>
                      <a href="#ref-22">[22]</a>
                    </sup>
                  </td>
                  <td>MIT</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>選定フローチャート</h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAMS.toolSelect} />
            <div className={styles.diagramCaption}>図: 実行エンジン/ツールの選定フロー</div>
          </div>

          <div className={`${styles.callout} ${styles.tip}`}>
            <i className="ti ti-bulb" aria-hidden="true" />
            <div className={styles.calloutBody}>
              <strong>なぜOllamaから始めるのが定石なのか</strong>:
              OllamaはPython環境構築やCUDA周りの複雑さを隠蔽し、「モデルをpullして実行する」体験を提供します。量子化・GPU割り当て・OpenAI互換APIの提供までワンコマンドで完結するため、学習コストが最も低いスタート地点です
              <sup className={styles.cite}>
                <a href="#ref-7">[7]</a>
              </sup>
              <sup className={styles.cite}>
                <a href="#ref-9">[9]</a>
              </sup>
              。
            </div>
          </div>
        </section>

        <section className={styles.step} id="step6">
          <h2>ステップ6: Ollamaで最初のモデルを動かす</h2>

          <h3>インストール</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>Terminal</span>
              <span className={styles.codeLang}>bash</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.cc}># macOS / Linux</span>
              </div>
              <div className={styles.codeLine}>
                curl -fsSL https://ollama.ai/install.sh | bash
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.cc}>
                  # Windows は ollama.com からインストーラーをダウンロード
                </span>
              </div>
            </div>
          </div>

          <p>Dockerで動かす場合:</p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>Terminal</span>
              <span className={styles.codeLang}>bash</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>docker pull ollama/ollama</div>
              <div className={styles.codeLine}>
                docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama
                ollama/ollama
              </div>
            </div>
          </div>

          <h3>モデルの取得と実行</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>Terminal</span>
              <span className={styles.codeLang}>bash</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.cc}># モデルをダウンロード</span>
              </div>
              <div className={styles.codeLine}>ollama pull llama3.2</div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.cc}># 対話モードで実行</span>
              </div>
              <div className={styles.codeLine}>ollama run llama3.2</div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.cc}># バックグラウンドでAPIサーバーとして起動</span>
              </div>
              <div className={styles.codeLine}>ollama serve</div>
            </div>
          </div>
          <p>
            初回実行時にモデル本体(数GB)がダウンロードされ、以降はローカルキャッシュから即座に起動します
            <sup className={styles.cite}>
              <a href="#ref-4">[4]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-9">[9]</a>
            </sup>
            。
          </p>

          <h3>量子化バリアントを指定する</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>Terminal</span>
              <span className={styles.codeLang}>bash</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.cc}># 特定の量子化レベルを明示的に指定</span>
              </div>
              <div className={styles.codeLine}>ollama pull llama3:70b-instruct-q5_K_M</div>
            </div>
          </div>
          <p>
            Ollamaはハードウェアに応じて既定でQ4_K_M等を選択しますが、精度を優先したい場合は明示的にQ5_K_M・Q8等を指定できます
            <sup className={styles.cite}>
              <a href="#ref-15">[15]</a>
            </sup>
            。
          </p>

          <h3>ネットワーク越しにアクセスできるようにする</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>Terminal</span>
              <span className={styles.codeLang}>bash</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.cc}>
                  # 全インターフェースでリッスン(必ずステップ10のセキュリティ対策と併用すること)
                </span>
              </div>
              <div className={styles.codeLine}>export OLLAMA_HOST=0.0.0.0</div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.cc}>
                  # 同時実行数(並列スロット)を設定。スロットごとにVRAMを追加消費する
                </span>
              </div>
              <div className={styles.codeLine}>export OLLAMA_NUM_PARALLEL=4</div>
            </div>
          </div>
          <p>
            チーム利用の場合は<code>OLLAMA_HOST=0.0.0.0</code>で外部からの接続を許可し、<code>OLLAMA_NUM_PARALLEL</code>で同時ユーザー数に応じたスロット数を設定します
            <sup className={styles.cite}>
              <a href="#ref-5">[5]</a>
            </sup>
            。ただし、外部公開する場合は必ずステップ10のセキュリティ対策(認証・ネットワーク分離)を先に実施してください。
          </p>

          <h3>systemdサービス化(常時起動・自動再起動)</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>/etc/systemd/system/ollama.service</span>
              <span className={styles.codeLang}>ini</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>[Unit]</div>
              <div className={styles.codeLine}>Description=Ollama Service</div>
              <div className={styles.codeLine}>After=network-online.target</div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>[Service]</div>
              <div className={styles.codeLine}>ExecStart=/usr/local/bin/ollama serve</div>
              <div className={styles.codeLine}>User=ollama</div>
              <div className={styles.codeLine}>Restart=always</div>
              <div className={styles.codeLine}>RestartSec=3</div>
              <div className={styles.codeLine}>Environment=&quot;OLLAMA_HOST=0.0.0.0&quot;</div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>[Install]</div>
              <div className={styles.codeLine}>WantedBy=multi-user.target</div>
            </div>
          </div>
          <p>
            本番運用に近い環境では、専用のサービスユーザーを作成し、root権限では実行しないことが推奨されます
            <sup className={styles.cite}>
              <a href="#ref-24">[24]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-30">[30]</a>
            </sup>
            。
          </p>

          <h3>動作確認</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>Terminal</span>
              <span className={styles.codeLang}>bash</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>curl http://localhost:11434/api/generate -d &apos;&#123;</div>
              <div className={styles.codeLine}>  &quot;model&quot;: &quot;llama3.2&quot;,</div>
              <div className={styles.codeLine}>  &quot;prompt&quot;: &quot;自己紹介してください&quot;</div>
              <div className={styles.codeLine}>&#125;&apos;</div>
            </div>
          </div>
          <p>
            OllamaはOpenAI互換API(<code>http://localhost:11434/v1</code>)も提供しているため、既存のOpenAI
            SDKベースのコードを<code>base_url</code>変更だけで流用できます
            <sup className={styles.cite}>
              <a href="#ref-1">[1]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-21">[21]</a>
            </sup>
            。
          </p>
        </section>

        <section className={styles.step} id="step7">
          <h2>ステップ7: Web UIを導入する</h2>
          <p>
            CLIだけでなくChatGPTのようなブラウザUIが欲しい場合、<strong>Open WebUI</strong>が定番の選択肢です
            <sup className={styles.cite}>
              <a href="#ref-6">[6]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-51">[51]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-57">[57]</a>
            </sup>
            。
          </p>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>Terminal</span>
              <span className={styles.codeLang}>bash</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>docker run -d -p 3000:8080 \</div>
              <div className={styles.codeLine}>  --add-host=host.docker.internal:host-gateway \</div>
              <div className={styles.codeLine}>  -v open-webui:/app/backend/data \</div>
              <div className={styles.codeLine}>  --name open-webui \</div>
              <div className={styles.codeLine}>  ghcr.io/open-webui/open-webui:main</div>
            </div>
          </div>

          <p>
            起動後、ブラウザで<code>http://localhost:3000</code>にアクセスし、Ollamaのエンドポイント(<code>http://host.docker.internal:11434</code>)を管理画面から設定します
            <sup className={styles.cite}>
              <a href="#ref-54">[54]</a>
            </sup>
            。
          </p>

          <h3>Open WebUIの主な機能</h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>機能</th>
                  <th style={{ textAlign: "left" }}>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>マルチユーザー管理</td>
                  <td>
                    アカウント作成、チャット履歴の保存
                    <sup className={styles.cite}>
                      <a href="#ref-5">[5]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>ドキュメントRAG</td>
                  <td>
                    PDF/Word/Markdownをアップロードして知識ベース化
                    <sup className={styles.cite}>
                      <a href="#ref-51">[51]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-57">[57]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>カスタムエージェント</td>
                  <td>
                    システムプロンプト・ツール・知識をバインドした専用アシスタントを作成
                    <sup className={styles.cite}>
                      <a href="#ref-57">[57]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>Function Calling</td>
                  <td>
                    モデルが自律的に検索・ブラウジング・知識ベース横断を実行
                    <sup className={styles.cite}>
                      <a href="#ref-57">[57]</a>
                    </sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.step} id="step8">
          <h2>ステップ8: RAGで自分のデータと繋ぐ</h2>
          <p>
            RAG(Retrieval-Augmented
            Generation)は、モデルの学習データに含まれない自社ドキュメントや最新情報を、検索によって動的にプロンプトへ注入する手法です。ファインチューニングなしでモデルに独自知識を持たせられます
            <sup className={styles.cite}>
              <a href="#ref-49">[49]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-53">[53]</a>
            </sup>
            。
          </p>

          <h3>RAGパイプラインの全体像</h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAMS.rag} />
            <div className={styles.diagramCaption}>図: RAGパイプラインの全体像</div>
          </div>

          <h3>導入方法の3パターン</h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>方法</th>
                  <th style={{ textAlign: "left" }}>難易度</th>
                  <th style={{ textAlign: "left" }}>向いている人</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Open WebUIの内蔵RAG機能</td>
                  <td>最も簡単(コード不要)</td>
                  <td>
                    すぐに始めたい人
                    <sup className={styles.cite}>
                      <a href="#ref-51">[51]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-54">[54]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>AnythingLLM等の専用デスクトップアプリ</td>
                  <td>簡単(GUI操作)</td>
                  <td>
                    非エンジニアも含むチーム
                    <sup className={styles.cite}>
                      <a href="#ref-49">[49]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>Python + LangChain + ベクトルDB</td>
                  <td>中級(コーディング必要)</td>
                  <td>
                    カスタムパイプラインを作りたい開発者
                    <sup className={styles.cite}>
                      <a href="#ref-52">[52]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-56">[56]</a>
                    </sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>埋め込みモデルの選び方</h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>モデル</th>
                  <th style={{ textAlign: "left" }}>サイズ</th>
                  <th style={{ textAlign: "left" }}>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>nomic-embed-text</td>
                  <td>約274MB</td>
                  <td>
                    標準的な選択肢。軽量かつ多くのRAGツールに対応
                    <sup className={styles.cite}>
                      <a href="#ref-49">[49]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>mxbai-embed-large</td>
                  <td>約669MB</td>
                  <td>
                    より高い検索精度を求める場合のアップグレード先
                    <sup className={styles.cite}>
                      <a href="#ref-49">[49]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>all-minilm</td>
                  <td>約23MB</td>
                  <td>
                    VRAMが極めて限られる場合のフォールバック
                    <sup className={styles.cite}>
                      <a href="#ref-49">[49]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>bge-m3</td>
                  <td>-</td>
                  <td>
                    多言語対応・長文コンテキストに強い
                    <sup className={styles.cite}>
                      <a href="#ref-54">[54]</a>
                    </sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Python(LangChain)での最小構成例</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>rag_demo.py</span>
              <span className={styles.codeLang}>python</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.cc}>
                  # 必要なライブラリ: pip install langchain langchain-ollama chromadb --break-system-packages
                </span>
              </div>
              <div className={styles.codeLine}>
                from langchain_community.document_loaders import PyPDFLoader
              </div>
              <div className={styles.codeLine}>
                from langchain.text_splitter import RecursiveCharacterTextSplitter
              </div>
              <div className={styles.codeLine}>from langchain_community.vectorstores import Chroma</div>
              <div className={styles.codeLine}>from langchain_ollama import OllamaEmbeddings, ChatOllama</div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.cc}># 1. ドキュメントを読み込み、チャンクに分割する</span>
              </div>
              <div className={styles.codeLine}>loader = PyPDFLoader(&quot;./docs/manual.pdf&quot;)</div>
              <div className={styles.codeLine}>documents = loader.load()</div>
              <div className={styles.codeLine}>
                splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
              </div>
              <div className={styles.codeLine}>chunks = splitter.split_documents(documents)</div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.cc}># 2. 埋め込みを作成しベクトルDBに保存する</span>
              </div>
              <div className={styles.codeLine}>embeddings = OllamaEmbeddings(model=&quot;nomic-embed-text&quot;)</div>
              <div className={styles.codeLine}>
                vectorstore = Chroma.from_documents(documents=chunks, embedding=embeddings)
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                <span className={styles.cc}># 3. ローカルLLMと組み合わせて質問応答を行う</span>
              </div>
              <div className={styles.codeLine}>llm = ChatOllama(model=&quot;llama3.2&quot;)</div>
              <div className={styles.codeLine}>retriever = vectorstore.as_retriever(search_kwargs=&#123;&quot;k&quot;: 4&#125;)</div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>def answer(question: str) -&gt; str:</div>
              <div className={styles.codeLine}>    relevant_docs = retriever.invoke(question)</div>
              <div className={styles.codeLine}>    context = &quot;\\n\\n&quot;.join(doc.page_content for doc in relevant_docs)</div>
              <div className={styles.codeLine}>    prompt = f&quot;以下の文脈だけを根拠に日本語で回答してください。\\n\\n文脈:\\n&#123;context&#125;\\n\\n質問: &#123;question&#125;&quot;</div>
              <div className={styles.codeLine}>    return llm.invoke(prompt).content</div>
            </div>
          </div>
          <p>
            このパターンはあくまで最小構成の一例です。実運用では、メタデータによるフィルタリング、リランカー(Cohere
            Rerank・FlashRank等)の追加、RAGAS等を用いた評価パイプラインの整備が推奨されています
            <sup className={styles.cite}>
              <a href="#ref-52">[52]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-56">[56]</a>
            </sup>
            。
          </p>

          <h3>よくある失敗パターンと対策</h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>失敗パターン</th>
                  <th style={{ textAlign: "left" }}>原因</th>
                  <th style={{ textAlign: "left" }}>対策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>関係ないチャンクが検索される</td>
                  <td>チャンク分割が粗い/埋め込みモデルが弱い</td>
                  <td>
                    チャンクサイズを調整、埋め込みモデルを強化
                    <sup className={styles.cite}>
                      <a href="#ref-52">[52]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>検索結果をモデルが無視する</td>
                  <td>プロンプトの指示が弱い</td>
                  <td>
                    「文脈だけを根拠に」等、明示的な指示を追加
                    <sup className={styles.cite}>
                      <a href="#ref-52">[52]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>情報が古いまま更新されない</td>
                  <td>ベクトルストアの再インデックスがない</td>
                  <td>
                    ドキュメントハッシュによる差分更新の仕組みを導入
                    <sup className={styles.cite}>
                      <a href="#ref-52">[52]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>コンテキスト超過</td>
                  <td>チャンク数/サイズが大きすぎる</td>
                  <td>
                    取得件数kを減らす、リランカーで圧縮
                    <sup className={styles.cite}>
                      <a href="#ref-52">[52]</a>
                    </sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.step} id="step9">
          <h2>ステップ9: 本番運用へのスケールアップ(vLLM)</h2>
          <p>
            個人利用や小規模チームを超え、複数ユーザーへ同時にサービス提供する場合は、<strong>vLLM</strong>への移行が業界標準です
            <sup className={styles.cite}>
              <a href="#ref-21">[21]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-23">[23]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-26">[26]</a>
            </sup>
            。
          </p>

          <h3>vLLMの中核技術: PagedAttention</h3>
          <p>
            vLLMはPagedAttentionというアルゴリズムにより、KVキャッシュ(会話文脈の記憶領域)をOSの仮想メモリのようにページ単位で管理し、メモリの断片化を大幅に削減します。これにより、従来型の推論サーバーと比較して2〜24倍のスループット向上が報告されています
            <sup className={styles.cite}>
              <a href="#ref-26">[26]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-27">[27]</a>
            </sup>
            。
          </p>

          <h3>インストールと起動</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>Terminal</span>
              <span className={styles.codeLang}>bash</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>pip install vllm --break-system-packages</div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>python -m vllm.entrypoints.openai.api_server \</div>
              <div className={styles.codeLine}>  --model meta-llama/Llama-3.1-8B-Instruct \</div>
              <div className={styles.codeLine}>  --host 0.0.0.0 \</div>
              <div className={styles.codeLine}>  --port 8000 \</div>
              <div className={styles.codeLine}>  --max-model-len 8192 \</div>
              <div className={styles.codeLine}>  --gpu-memory-utilization 0.85 \</div>
              <div className={styles.codeLine}>  --served-model-name llama3</div>
            </div>
          </div>

          <h3>バッチングパラメータのチューニング</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>vLLM config snippet</span>
              <span className={styles.codeLang}>bash</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>--max-num-seqs 32 \</div>
              <div className={styles.codeLine}>--max-num-batched-tokens 16384</div>
            </div>
          </div>
          <p>
            これらの値は、ハードウェアが処理しきれない量のリクエストを受け付けないようにするための上限設定です
            <sup className={styles.cite}>
              <a href="#ref-24">[24]</a>
            </sup>
            。
          </p>

          <h3>systemdによる常時稼働化</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>/etc/systemd/system/vllm.service</span>
              <span className={styles.codeLang}>ini</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>[Unit]</div>
              <div className={styles.codeLine}>Description=vLLM Inference Server</div>
              <div className={styles.codeLine}>After=network.target</div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>[Service]</div>
              <div className={styles.codeLine}>Type=simple</div>
              <div className={styles.codeLine}>User=inference</div>
              <div className={styles.codeLine}>
                ExecStart=/home/inference/.local/bin/python -m vllm.entrypoints.openai.api_server \
              </div>
              <div className={styles.codeLine}>  --model /opt/models/llama3-8b-instruct \</div>
              <div className={styles.codeLine}>  --host 0.0.0.0 --port 8000 \</div>
              <div className={styles.codeLine}>  --max-model-len 8192 --gpu-memory-utilization 0.85</div>
              <div className={styles.codeLine}>Restart=always</div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>[Install]</div>
              <div className={styles.codeLine}>WantedBy=multi-user.target</div>
            </div>
          </div>
          <p>
            推論プロセスは必ずroot以外の専用ユーザーで実行し、障害時に自動再起動するようRestart=alwaysを設定します
            <sup className={styles.cite}>
              <a href="#ref-24">[24]</a>
            </sup>
            。
          </p>

          <h3>量子化との組み合わせ</h3>
          <p>
            vLLMはFP8、INT8、INT4、GPTQ/AWQ、GGUFなど幅広い量子化形式に対応しています
            <sup className={styles.cite}>
              <a href="#ref-26">[26]</a>
            </sup>
            。本番GPU推論ではAWQまたはFP8(Hopper/Blackwell世代のGPUで利用可)の組み合わせが、品質とスループットのバランスに優れた選択肢です
            <sup className={styles.cite}>
              <a href="#ref-17">[17]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-19">[19]</a>
            </sup>
            。
          </p>

          <h3>コンテナ/Kubernetesでの展開</h3>
          <p>
            大規模チームでは、Kubernetes + NVIDIA GPU
            Operatorの組み合わせで、readinessProbe/livenessProbeによるヘルスチェック、PersistentVolumeClaimによるモデルキャッシュの永続化、複数レプリカへのスケーリングを行うのが一般的です
            <sup className={styles.cite}>
              <a href="#ref-23">[23]</a>
            </sup>
            。GPU間の分散が必要な場合は、<code>--tensor-parallel-size</code>オプションでテンソル並列を有効化します
            <sup className={styles.cite}>
              <a href="#ref-29">[29]</a>
            </sup>
            。
          </p>
        </section>

        <section className={styles.step} id="step10">
          <h2>ステップ10: セキュリティのベストプラクティス</h2>
          <p>
            自前ホスティングは「外部にデータを送らない」という利点がある一方、<strong>セキュリティ設定を怠ると自らインフラを危険に晒す</strong>ことになります。実際、Shodan等での調査では、多数 of 自己ホスト型LLMサーバーが認証なし・ネットワーク分離なしのまま公開されている実態が報告されています
            <sup className={styles.cite}>
              <a href="#ref-31">[31]</a>
            </sup>
            。
          </p>

          <h3>攻撃対象領域(アタックサーフェス)</h3>
          <p>
            ローカルLLM特有の攻撃対象領域として、以下が挙げられます
            <sup className={styles.cite}>
              <a href="#ref-30">[30]</a>
            </sup>
            。
          </p>
          <ul>
            <li>推論APIエンドポイントへの不正アクセス</li>
            <li>プロンプトインジェクション(直接・間接)</li>
            <li>モデル重みの窃取(モデル抽出攻撃)</li>
            <li>RAG連携先の知識ベースを経由したデータ漏洩</li>
          </ul>

          <h3>実装すべき対策</h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAMS.security} />
            <div className={styles.diagramCaption}>図: セキュリティ多層防御の全体像</div>
          </div>

          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>対策項目</th>
                  <th style={{ textAlign: "left" }}>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ネットワーク分離</td>
                  <td>
                    推論エンドポイントを直接インターネットに公開せず、VPN/プライベートサブネット経由に限定する
                    <sup className={styles.cite}>
                      <a href="#ref-30">[30]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-31">[31]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-33">[33]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>リバースプロキシの前段配置</td>
                  <td>
                    vLLM等は既定でネイティブ認証を持たないため、Nginx等でTLS終端とAPIキー検証を行う
                    <sup className={styles.cite}>
                      <a href="#ref-24">[24]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-28">[28]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>認証の徹底</td>
                  <td>
                    JWTベースのスコープ付き認証、短い有効期限を設定。役割ごとにRBACを分離する
                    <sup className={styles.cite}>
                      <a href="#ref-30">[30]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>エンドポイント単位の確認</td>
                  <td>
                    APIキー保護フラグが全エンドポイントを保護するとは限らない。棚卸しを行う
                    <sup className={styles.cite}>
                      <a href="#ref-28">[28]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>最小権限の原則</td>
                  <td>
                    推論プロセスをroot以外の専用ユーザーで実行し、権限を絞る
                    <sup className={styles.cite}>
                      <a href="#ref-24">[24]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-33">[33]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>プロンプトインジェクション対策</td>
                  <td>
                    システム指示とユーザー入力を構造的に分離する
                    <sup className={styles.cite}>
                      <a href="#ref-32">[32]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-35">[35]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>封じ込め設計</td>
                  <td>
                    モデルが乗っ取られても実害が出ないよう、機密操作は人間の承認を介する
                    <sup className={styles.cite}>
                      <a href="#ref-32">[32]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>マルチユーザーの文脈分離</td>
                  <td>
                    一人のユーザーの入力が他ユーザーのセッションに影響しないようにする
                    <sup className={styles.cite}>
                      <a href="#ref-33">[33]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>出力後処理</td>
                  <td>
                    機密トークンや隠された指示が出力に含まれていないか検査する
                    <sup className={styles.cite}>
                      <a href="#ref-33">[33]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>ログ・監視</td>
                  <td>
                    異常なクエリパターンや大量データ持ち出しの兆候を監視する
                    <sup className={styles.cite}>
                      <a href="#ref-32">[32]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-33">[33]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>定期的な脆弱性対応</td>
                  <td>
                    推論エンジンのCVE情報を継続的に確認し、迅速にパッチ適用する
                    <sup className={styles.cite}>
                      <a href="#ref-28">[28]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>レッドチーム演習</td>
                  <td>
                    定期的にプロンプトインジェクションの侵入テストを実施する
                    <sup className={styles.cite}>
                      <a href="#ref-33">[33]</a>
                    </sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.danger}`}>
            <i className="ti ti-alert-triangle" aria-hidden="true" />
            <div className={styles.calloutBody}>
              <strong>落とし穴</strong>:
              「認証を有効化した」だけでは不十分な場合があります。実際の事例として、APIキーによる保護がチャット補完系のエンドポイントのみに適用され、他の管理系エンドポイントが無防備なまま残っていたケースが報告されています
              <sup className={styles.cite}>
                <a href="#ref-28">[28]</a>
              </sup>
              。デプロイ時は必ずエンドポイント一覧を棚卸しし、全経路が保護されているか確認してください。
            </div>
          </div>
        </section>

        <section className={styles.step} id="step11">
          <h2>ステップ11: 監視・運用・トラブルシューティング</h2>

          <h3>監視すべき主要メトリクス</h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>メトリクス</th>
                  <th style={{ textAlign: "left" }}>意味</th>
                  <th style={{ textAlign: "left" }}>なぜ重要か</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>VRAM使用率</td>
                  <td>KVキャッシュがVRAMの上限に達していないか</td>
                  <td>
                    上限到達でリクエストが詰まる/失敗する
                    <sup className={styles.cite}>
                      <a href="#ref-24">[24]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>リクエストキュー長</td>
                  <td>ユーザーがGPUの空き待ちをしていないか</td>
                  <td>
                    待ち時間の悪化を早期検知
                    <sup className={styles.cite}>
                      <a href="#ref-24">[24]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>Time to First Token(TTFT)</td>
                  <td>最初のトークンが返るまでの時間</td>
                  <td>
                    体感速度に直結
                    <sup className={styles.cite}>
                      <a href="#ref-29">[29]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>Time Per Output Token(TPOT)</td>
                  <td>1トークンあたりの生成時間</td>
                  <td>
                    ユーザー体験の劣化を検知
                    <sup className={styles.cite}>
                      <a href="#ref-24">[24]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-29">[29]</a>
                    </sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Prometheus + Grafanaでこれらを可視化するのが一般的な構成です
            <sup className={styles.cite}>
              <a href="#ref-10">[10]</a>
            </sup>
            <sup className={styles.cite}>
              <a href="#ref-29">[29]</a>
            </sup>
            。Ollamaは2026年時点でネイティブPrometheusメトリクスを持たないため、OpenTelemetryサイドカー経由か、<code>/api/ps</code>エンドポイントを定期的にスクレイピングするカスタムエクスポーターで代替する必要があります
            <sup className={styles.cite}>
              <a href="#ref-2">[2]</a>
            </sup>
            。
          </p>

          <h3>よくあるトラブルと対処</h3>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>症状</th>
                  <th style={{ textAlign: "left" }}>想定原因</th>
                  <th style={{ textAlign: "left" }}>対処</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>応答が異常に遅い(1〜2トークン/秒)</td>
                  <td>VRAMに収まらずシステムRAMにオフロードしている</td>
                  <td>
                    より小さいモデル/低ビット量子化に変更するか、GPUをアップグレード
                    <sup className={styles.cite}>
                      <a href="#ref-61">[61]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>起動時にOOM(メモリ不足)エラー</td>
                  <td><code>--gpu-memory-utilization</code>が高すぎる、または他プロセスと競合</td>
                  <td>
                    値を下げる、他のGPUプロセスを終了する
                    <sup className={styles.cite}>
                      <a href="#ref-24">[24]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>複数ユーザーで急激に遅くなる</td>
                  <td>並列スロット数がVRAMに対して過剰</td>
                  <td>
                    <code>OLLAMA_NUM_PARALLEL</code>や<code>--max-num-seqs</code>を適正化
                    <sup className={styles.cite}>
                      <a href="#ref-5">[5]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-24">[24]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>RAGの回答精度が低い</td>
                  <td>チャンク分割/埋め込みモデルが不適切</td>
                  <td>
                    チャンクサイズ調整、埋め込みモデルのアップグレード、リランカー追加
                    <sup className={styles.cite}>
                      <a href="#ref-52">[52]</a>
                    </sup>
                  </td>
                </tr>
                <tr>
                  <td>外部から繋がらない</td>
                  <td>ネットワーク設定またはファイアウォール</td>
                  <td>
                    <code>OLLAMA_HOST</code>設定を確認、ネットワーク分離方針と整合させる
                    <sup className={styles.cite}>
                      <a href="#ref-5">[5]</a>
                    </sup>
                    <sup className={styles.cite}>
                      <a href="#ref-30">[30]</a>
                    </sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.step} id="summary">
          <h2>まとめ: 導入チェックリスト</h2>
          <ul className={styles.checklist}>
            <li>
              <i className="ti ti-circle-check" aria-hidden="true" />
              <div>目的とユースケースを明確にした(ステップ1)</div>
            </li>
            <li>
              <i className="ti ti-circle-check" aria-hidden="true" />
              <div>目的モデル&times;量子化レベルでの必要VRAMを計算し、ハードウェアを確保した(ステップ2)</div>
            </li>
            <li>
              <i className="ti ti-circle-check" aria-hidden="true" />
              <div>量子化フォーマット(GGUF/AWQ/GPTQ等)の違いを理解し、自分の環境に合うものを選んだ(ステップ3)</div>
            </li>
            <li>
              <i className="ti ti-circle-check" aria-hidden="true" />
              <div>ライセンス条件を確認した上でモデルを選定した(ステップ4)</div>
            </li>
            <li>
              <i className="ti ti-circle-check" aria-hidden="true" />
              <div>用途に合った実行エンジン(Ollama/LM Studio/vLLM等)を選んだ(ステップ5)</div>
            </li>
            <li>
              <i className="ti ti-circle-check" aria-hidden="true" />
              <div>Ollama等で最初のモデルを動かし、動作確認をした(ステップ6)</div>
            </li>
            <li>
              <i className="ti ti-circle-check" aria-hidden="true" />
              <div>必要に応じてOpen WebUIを導入した(ステップ7)</div>
            </li>
            <li>
              <i className="ti ti-circle-check" aria-hidden="true" />
              <div>必要に応じてRAGパイプラインを構築した(ステップ8)</div>
            </li>
            <li>
              <i className="ti ti-circle-check" aria-hidden="true" />
              <div>複数ユーザー向けにはvLLM等でスケールアップした(ステップ9)</div>
            </li>
            <li>
              <i className="ti ti-circle-check" aria-hidden="true" />
              <div>ネットワーク分離・認証・ログ監視などセキュリティ対策を実施した(ステップ10)</div>
            </li>
            <li>
              <i className="ti ti-circle-check" aria-hidden="true" />
              <div>監視体制を整え、トラブルシューティングの手順を把握した(ステップ11)</div>
            </li>
          </ul>
          <p>
            ローカルLLMの世界は月単位で新しいモデルとツールが登場するため、本ガイドの構成(目的定義 &rarr; ハードウェア
            &rarr; モデル &rarr; ツール &rarr; 運用 &rarr; セキュリティ)という
            <strong>思考の型</strong>を押さえておけば、個々のツールやモデルが入れ替わっても迷わず対応できます。
          </p>
        </section>

        <section className={styles.step} id="references">
          <h2>参考文献一覧</h2>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
            本ガイドの作成にあたり参照した情報源です。ツールやモデルは更新が速い分野のため、最新情報は各リンク先で直接ご確認ください。
          </p>

          <div className={styles.refGroupTitle}>Ollama / 実行ツール全般</div>
          <div className={styles.refList}>
            <div className={styles.refItem} id="ref-1">
              <span className={styles.refNum}>[1]</span>
              <span>
                daily.dev, &quot;Running LLMs Locally in 2026: Ollama, llama.cpp, and Self-Hosted AI for Developers&quot; &mdash;{" "}
                <Ext href="https://daily.dev/blog/running-llms-locally-ollama-llama-cpp-self-hosted-ai-developers/">
                  daily.dev
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-2">
              <span className={styles.refNum}>[2]</span>
              <span>
                DanubeData, &quot;Run Ollama on a VPS: Self-Host Local LLMs in Europe (2026)&quot; &mdash;{" "}
                <Ext href="https://danubedata.ro/blog/run-ollama-vps-self-host-llm-2026">
                  danubedata.ro
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-3">
              <span className={styles.refNum}>[3]</span>
              <span>
                sanj.dev, &quot;Self-Hosted LLM Guide 2026&quot; &mdash;{" "}
                <Ext href="https://sanj.dev/post/self-hosted-llm-guide-2026/">
                  sanj.dev
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-4">
              <span className={styles.refNum}>[4]</span>
              <span>
                Pristren, &quot;Ollama Complete Guide 2026&quot; &mdash;{" "}
                <Ext href="https://pristren.com/blog/ollama-complete-guide-2026/">
                  pristren.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-5">
              <span className={styles.refNum}>[5]</span>
              <span>
                tech-insider.org, &quot;How to Run LLMs Locally with Ollama in 11 Steps [2026]&quot; &mdash;{" "}
                <Ext href="https://tech-insider.org/ollama-tutorial-run-llm-locally-2026/">
                  tech-insider.org
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-6">
              <span className={styles.refNum}>[6]</span>
              <span>
                Effloow, &quot;Ollama + Open WebUI Self-Hosting Guide 2026&quot; &mdash;{" "}
                <Ext href="https://effloow.com/articles/ollama-open-webui-self-hosting-guide-2026">
                  effloow.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-7">
              <span className={styles.refNum}>[7]</span>
              <span>
                YUV.AI, &quot;Self-Hosting LLMs with Ollama&quot; &mdash;{" "}
                <Ext href="https://yuv.ai/blog/self-hosting-llms-with-ollama">
                  yuv.ai
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-8">
              <span className={styles.refNum}>[8]</span>
              <span>
                Cohorte, &quot;Run LLMs Locally with Ollama: 2026 Production Guide&quot; &mdash;{" "}
                <Ext href="https://cohorte.co/blog/run-llms-locally-with-ollama-privacy-first-ai-for-developers-in-2025">
                  cohorte.co
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-9">
              <span className={styles.refNum}>[9]</span>
              <span>
                DEV Community, &quot;The Complete Guide to Ollama&quot; &mdash;{" "}
                <Ext href="https://dev.to/ajitkumar/the-complete-guide-to-ollama-run-large-language-models-locally-2mge">
                  dev.to
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-10">
              <span className={styles.refNum}>[10]</span>
              <span>
                Open Source For You, &quot;Self-Hosting LLMs Using Ollama and Docker&quot; &mdash;{" "}
                <Ext href="https://www.opensourceforu.com/2026/07/self-hosting-llms-using-ollama-and-docker/">
                  opensourceforu.com
                </Ext>
              </span>
            </div>
          </div>

          <div className={styles.refGroupTitle}>量子化(GGUF/GPTQ/AWQ/EXL2/MLX)</div>
          <div className={styles.refList}>
            <div className={styles.refItem} id="ref-11">
              <span className={styles.refNum}>[11]</span>
              <span>
                Local AI Master, &quot;GGUF vs GPTQ vs AWQ 2026&quot; &mdash;{" "}
                <Ext href="https://localaimaster.com/blog/quantization-explained">
                  localaimaster.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-12">
              <span className={styles.refNum}>[12]</span>
              <span>
                Digital Applied, &quot;GGUF vs AWQ vs GPTQ vs MLX: LLM Quant Formats 2026&quot; &mdash;{" "}
                <Ext href="https://www.digitalapplied.com/blog/gguf-vs-awq-vs-gptq-vs-mlx-llm-quantization-formats-2026">
                  digitalapplied.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-13">
              <span className={styles.refNum}>[13]</span>
              <span>
                Fungies.io, &quot;LLM Quantization Explained: GGUF vs AWQ vs GPTQ&quot; &mdash;{" "}
                <Ext href="https://fungies.io/llm-quantization-gguf-awq-gptq-guide-2026/">
                  fungies.io
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-14">
              <span className={styles.refNum}>[14]</span>
              <span>
                dasroot.net, &quot;GGUF vs GPTQ vs AWQ: LLM Quantization Methods Compared&quot; &mdash;{" "}
                <Ext href="https://dasroot.net/posts/2026/01/gguf-vs-gptq-vs-awq-llm-quantization-methods-compared/">
                  dasroot.net
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-15">
              <span className={styles.refNum}>[15]</span>
              <span>
                TensorRigs, &quot;LLM Quantization Explained: GGUF vs GPTQ vs AWQ&quot; &mdash;{" "}
                <Ext href="https://tensorrigs.com/blog/llm-quantization-guide/">
                  tensorrigs.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-16">
              <span className={styles.refNum}>[16]</span>
              <span>
                Index.dev, &quot;AWQ vs GGUF vs GPTQ: Quantization Methods Compared&quot; &mdash;{" "}
                <Ext href="https://www.index.dev/skill-vs-skill/ai-gptq-vs-awq-vs-gguf">
                  index.dev
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-17">
              <span className={styles.refNum}>[17]</span>
              <span>
                Sesame Disk, &quot;Quantization Techniques for AI Inference in 2026&quot; &mdash;{" "}
                <Ext href="https://sesamedisk.com/quantization-techniques-ai-inference-2026/">
                  sesamedisk.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-18">
              <span className={styles.refNum}>[18]</span>
              <span>
                The AI Engineer (Substack), &quot;GPTQ vs AWQ vs GGUF: Which 4-Bit to Pick in 2026&quot; &mdash;{" "}
                <Ext href="https://theaiengineer.substack.com/p/quantization-in-practice-gptq-vs">
                  theaiengineer.substack.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-19">
              <span className={styles.refNum}>[19]</span>
              <span>
                VRLA Tech, &quot;LLM Quantization Explained: INT4, INT8, FP8, AWQ, and GPTQ in 2026&quot; &mdash;{" "}
                <Ext href="https://vrlatech.com/llm-quantization-explained-int4-int8-fp8-awq-and-gptq-in-2026/">
                  vrlatech.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-20">
              <span className={styles.refNum}>[20]</span>
              <span>
                Presenc AI, &quot;Local LLM Quantization Quality Benchmarks 2026&quot; &mdash;{" "}
                <Ext href="https://presenc.ai/research/local-llm-quantization-quality-benchmarks-2026">
                  presenc.ai
                </Ext>
              </span>
            </div>
          </div>

          <div className={styles.refGroupTitle}>vLLM / 本番運用</div>
          <div className={styles.refList}>
            <div className={styles.refItem} id="ref-21">
              <span className={styles.refNum}>[21]</span>
              <span>
                Spheron, &quot;Build a Self-Hosted OpenAI-Compatible API with vLLM in 2026&quot; &mdash;{" "}
                <Ext href="https://www.spheron.network/blog/openai-compatible-api-self-hosted/">
                  spheron.network
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-22">
              <span className={styles.refNum}>[22]</span>
              <span>
                Rost Glukhov, &quot;vLLM Quickstart: High-Performance LLM Serving in 2026&quot; &mdash;{" "}
                <Ext href="https://www.glukhov.org/llm-hosting/vllm/vllm-quickstart/">
                  glukhov.org
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-23">
              <span className={styles.refNum}>[23]</span>
              <span>
                SitePoint, &quot;vLLM Production Deployment: Complete 2026 Guide&quot; &mdash;{" "}
                <Ext href="https://www.sitepoint.com/vllm-production-deployment-guide-2026/">
                  sitepoint.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-24">
              <span className={styles.refNum}>[24]</span>
              <span>
                n1n.ai, &quot;Guide to Self-Hosting Enterprise LLMs with vLLM and Llama 3&quot; &mdash;{" "}
                <Ext href="https://explore.n1n.ai/blog/enterprise-llm-self-hosting-vllm-guide-2026-06-17">
                  n1n.ai
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-25">
              <span className={styles.refNum}>[25]</span>
              <span>
                Lyceum Technology, &quot;vLLM Production Deployment Guide 2026&quot; &mdash;{" "}
                <Ext href="https://lyceum.technology/magazine/vllm-production-deployment-guide-2026/">
                  lyceum.technology
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-26">
              <span className={styles.refNum}>[26]</span>
              <span>
                GitHub, &quot;vllm-project/vllm&quot; &mdash;{" "}
                <Ext href="https://github.com/vllm-project/vllm">
                  github.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-27">
              <span className={styles.refNum}>[27]</span>
              <span>
                Introl, &quot;vLLM Production Deployment&quot; &mdash;{" "}
                <Ext href="https://introl.com/blog/vllm-production-deployment-inference-serving-architecture-guide">
                  introl.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-28">
              <span className={styles.refNum}>[28]</span>
              <span>
                Medium, &quot;vLLM in Production: A Security Hardening Guide for Enterprise Deployments&quot; &mdash;{" "}
                <Ext href="https://medium.com/@michael.hannecke/vllm-in-production-a-security-hardening-guide-for-enterprise-deployments-56a9c2c213dd">
                  medium.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-29">
              <span className={styles.refNum}>[29]</span>
              <span>
                SitePoint, &quot;Enterprise Local LLM Deployment: vLLM, GPUs...&quot; &mdash;{" "}
                <Ext href="https://www.sitepoint.com/the-2026-definitive-guide-to-running-local-llms-in-production/">
                  sitepoint.com
                </Ext>
              </span>
            </div>
          </div>

          <div className={styles.refGroupTitle}>セキュリティ</div>
          <div className={styles.refList}>
            <div className={styles.refItem} id="ref-30">
              <span className={styles.refNum}>[30]</span>
              <span>
                SitePoint, &quot;Local LLM Security Best Practices for Enterprise in 2026&quot; &mdash;{" "}
                <Ext href="https://www.sitepoint.com/local-llm-security-best-practices-2026/">
                  sitepoint.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-31">
              <span className={styles.refNum}>[31]</span>
              <span>
                Cisco Blogs, &quot;Detecting Exposed LLM Servers: A Shodan Case Study on Ollama&quot; &mdash;{" "}
                <Ext href="https://blogs.cisco.com/security/detecting-exposed-llm-servers-shodan-case-study-on-ollama">
                  blogs.cisco.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-32">
              <span className={styles.refNum}>[32]</span>
              <span>
                Sombra, &quot;LLM Security Risks in 2026: Prompt Injection, RAG, and Shadow AI&quot; &mdash;{" "}
                <Ext href="https://sombrainc.com/blog/llm-security-risks-2026">
                  sombrainc.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-33">
              <span className={styles.refNum}>[33]</span>
              <span>
                DatabaseMart, &quot;Securing LLM Hosting Against Prompt Injection Attacks&quot; &mdash;{" "}
                <Ext href="https://www.databasemart.com/blog/how-to-secure-llm-hosting-environment">
                  databasemart.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-34">
              <span className={styles.refNum}>[34]</span>
              <span>
                A10 Networks, &quot;LLM Security: Protecting AI Models &amp; Applications&quot; &mdash;{" "}
                <Ext href="https://www.a10networks.com/blog/llm-security/">
                  a10networks.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-35">
              <span className={styles.refNum}>[35]</span>
              <span>
                Capture The Bug, &quot;Prompt Injection in LLMs: Complete Guide for 2026&quot; &mdash;{" "}
                <Ext href="https://capturethebug.xyz/blogs/Prompt-Injection-in-LLMs-Complete-Guide-for-2026">
                  capturethebug.xyz
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-36">
              <span className={styles.refNum}>[36]</span>
              <span>
                GetMaxim.ai, &quot;Top 5 LLM Security Tools for Enterprise AI Applications in 2026&quot; &mdash;{" "}
                <Ext href="https://www.getmaxim.ai/articles/top-5-llm-security-tools-for-enterprise-ai-applications-in-2026/">
                  getmaxim.ai
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-37">
              <span className={styles.refNum}>[37]</span>
              <span>
                EPAM SolutionsHub, &quot;Open LLM Security Risks and Best Practices&quot; &mdash;{" "}
                <Ext href="https://solutionshub.epam.com/blog/post/llm-security">
                  solutionshub.epam.com
                </Ext>
              </span>
            </div>
          </div>

          <div className={styles.refGroupTitle}>モデル比較</div>
          <div className={styles.refList}>
            <div className={styles.refItem} id="ref-39">
              <span className={styles.refNum}>[39]</span>
              <span>
                Hugging Face Blog, &quot;Best Open-Source LLM Models in 2026&quot; &mdash;{" "}
                <Ext href="https://huggingface.co/blog/daya-shankar/open-source-llms">
                  huggingface.co
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-40">
              <span className={styles.refNum}>[40]</span>
              <span>
                ComputingForGeeks, &quot;Open Source LLM Comparison Table (2026)&quot; &mdash;{" "}
                <Ext href="https://computingforgeeks.com/open-source-llm-comparison/">
                  computingforgeeks.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-42">
              <span className={styles.refNum}>[42]</span>
              <span>
                AceCloud, &quot;Best Open Source LLMs In 2026&quot; &mdash;{" "}
                <Ext href="https://acecloud.ai/blog/best-open-source-llms/">
                  acecloud.ai
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-43">
              <span className={styles.refNum}>[43]</span>
              <span>
                TECHSY, &quot;Best Open-Source LLMs: July 2026 Leaderboard&quot; &mdash;{" "}
                <Ext href="https://techsy.io/en/blog/best-open-source-llms-2026">
                  techsy.io
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-44">
              <span className={styles.refNum}>[44]</span>
              <span>
                Lushbinary, &quot;Best Open-Source LLMs April 2026&quot; &mdash;{" "}
                <Ext href="https://lushbinary.com/blog/best-open-source-llms-april-2026-comparison-guide/">
                  lushbinary.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-45">
              <span className={styles.refNum}>[45]</span>
              <span>
                BuildFastWithAI, &quot;Best Open-Source LLMs 2026&quot; &mdash;{" "}
                <Ext href="https://www.buildfastwithai.com/blogs/collection/open-source-llms">
                  buildfastwithai.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-46">
              <span className={styles.refNum}>[46]</span>
              <span>
                BentoML, &quot;The Best Open-Source LLMs in 2026&quot; &mdash;{" "}
                <Ext href="https://www.bentoml.com/blog/navigating-the-world-of-open-source-large-language-models">
                  bentoml.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-47">
              <span className={styles.refNum}>[47]</span>
              <span>
                CoderSera, &quot;Best Open-Source LLM in May 2026&quot; &mdash;{" "}
                <Ext href="https://codersera.com/blog/best-open-source-llm-2026-llama-4-qwen-3-5-deepseek-v4-gemma-4-mistral/">
                  codersera.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-48">
              <span className={styles.refNum}>[48]</span>
              <span>
                Onyx, &quot;Best Self-Hosted LLM Leaderboard 2026&quot; &mdash;{" "}
                <Ext href="https://onyx.app/self-hosted-llm-leaderboard">
                  onyx.app
                </Ext>
              </span>
            </div>
          </div>

          <div className={styles.refGroupTitle}>RAG</div>
          <div className={styles.refList}>
            <div className={styles.refItem} id="ref-49">
              <span className={styles.refNum}>[49]</span>
              <span>
                LLM Hardware, &quot;RAG with Local LLMs: Complete Guide (2026)&quot; &mdash;{" "}
                <Ext href="https://llmhardware.io/guides/rag-local-llm-guide">
                  llmhardware.io
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-50">
              <span className={styles.refNum}>[50]</span>
              <span>
                Terros, &quot;RAG: Complete 2025 Guide - Python, LangChain, OpenWebUI&quot; &mdash;{" "}
                <Ext href="https://terros.io/en/blog/rag-guide-complet-2025">
                  terros.io
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-51">
              <span className={styles.refNum}>[51]</span>
              <span>
                Open WebUI Docs, &quot;Retrieval Augmented Generation (RAG)&quot; &mdash;{" "}
                <Ext href="https://docs.openwebui.com/features/chat-conversations/rag/">
                  docs.openwebui.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-52">
              <span className={styles.refNum}>[52]</span>
              <span>
                Medium (CodeToDeploy), &quot;Building Your Own RAG: Step-by-Step with LangChain and a Vector Database&quot; &mdash;{" "}
                <Ext href="https://medium.com/codetodeploy/building-your-own-rag-a-step-by-step-guide-using-langchain-and-a-vector-database-21d0566d3c51">
                  medium.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-53">
              <span className={styles.refNum}>[53]</span>
              <span>
                Local AI Master, &quot;RAG Local Setup: Build RAG Without APIs&quot; &mdash;{" "}
                <Ext href="https://localaimaster.com/blog/rag-local-setup-guide">
                  localaimaster.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-54">
              <span className={styles.refNum}>[54]</span>
              <span>
                Medium (John Wong), &quot;Getting Started with Local AI - Open WebUI Documents and Tools (Part 2)&quot; &mdash;{" "}
                <Ext href="https://medium.com/@able_wong/getting-started-with-local-ai-open-webui-documents-and-tools-part-2-5f8f9c67a414">
                  medium.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-55">
              <span className={styles.refNum}>[55]</span>
              <span>
                Microsoft Azure Cosmos DB Blog, &quot;Build a RAG application with LangChain and Local LLMs powered by Ollama&quot; &mdash;{" "}
                <Ext href="https://devblogs.microsoft.com/cosmosdb/build-a-rag-application-with-langchain-and-local-llms-powered-by-ollama/">
                  devblogs.microsoft.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-56">
              <span className={styles.refNum}>[56]</span>
              <span>
                DEV Community, &quot;Learn How to Build Reliable RAG Applications in 2026!&quot; &mdash;{" "}
                <Ext href="https://dev.to/pavanbelagatti/learn-how-to-build-reliable-rag-applications-in-2026-1b7p">
                  dev.to
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-57">
              <span className={styles.refNum}>[57]</span>
              <span>
                Open WebUI Docs, &quot;Features&quot; &mdash;{" "}
                <Ext href="https://docs.openwebui.com/features/">
                  docs.openwebui.com
                </Ext>
              </span>
            </div>
          </div>

          <div className={styles.refGroupTitle}>ハードウェア/GPU選定</div>
          <div className={styles.refList}>
            <div className={styles.refItem} id="ref-58">
              <span className={styles.refNum}>[58]</span>
              <span>
                Julien Simon (Medium), &quot;What to Buy for Local LLMs (April 2026)&quot; &mdash;{" "}
                <Ext href="https://julsimon.medium.com/what-to-buy-for-local-llms-april-2026-a4946a381a6a">
                  julsimon.medium.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-59">
              <span className={styles.refNum}>[59]</span>
              <span>
                BIZON, &quot;Best GPU for LLM Inference and Training &ndash; 2026&quot; &mdash;{" "}
                <Ext href="https://bizon-tech.com/blog/best-gpu-llm-training-inference">
                  bizon-tech.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-60">
              <span className={styles.refNum}>[60]</span>
              <span>
                PromptQuorum, &quot;Local LLM Hardware Requirements 2026: Best Models by VRAM&quot; &mdash;{" "}
                <Ext href="https://www.promptquorum.com/local-llms/local-llm-hardware-guide-2026">
                  promptquorum.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-61">
              <span className={styles.refNum}>[61]</span>
              <span>
                Medium (Codex), &quot;Local LLM GPU Guide: RTX 5090, 4090, 3090 Compared&quot; &mdash;{" "}
                <Ext href="https://medium.com/codex/best-gpus-for-running-local-llms-in-2026-what-actually-works-292f27a99f04">
                  medium.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-62">
              <span className={styles.refNum}>[62]</span>
              <span>
                Local AI Master, &quot;Local AI Hardware Requirements (2026): Complete Guide&quot; &mdash;{" "}
                <Ext href="https://localaimaster.com/blog/ai-hardware-requirements-2025-complete-guide">
                  localaimaster.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-63">
              <span className={styles.refNum}>[63]</span>
              <span>
                Spheron, &quot;Best NVIDIA GPUs for LLMs in 2026: Ranked by Use Case&quot; &mdash;{" "}
                <Ext href="https://www.spheron.network/blog/best-nvidia-gpus-for-llms/">
                  spheron.network
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-64">
              <span className={styles.refNum}>[64]</span>
              <span>
                RunPod, &quot;RTX 5090 Specs and VRAM: Specifications, AI Benchmarks, and LLM Guide&quot; &mdash;{" "}
                <Ext href="https://www.runpod.io/articles/guides/nvidia-rtx-5090">
                  runpod.io
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-65">
              <span className={styles.refNum}>[65]</span>
              <span>
                CoreLab, &quot;LLM GPU Buyer&quot;s Guide (April 2026): Best VRAM per Dollar Tier List&quot; &mdash;{" "}
                <Ext href="https://corelab.tech/llmgpu/">
                  corelab.tech
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-66">
              <span className={styles.refNum}>[66]</span>
              <span>
                Kunal Ganglani, &quot;RTX 5090 vs RTX 4090 for AI in 2026&quot; &mdash;{" "}
                <Ext href="https://www.kunalganglani.com/blog/rtx-5090-vs-rtx-4090-for-ai">
                  kunalganglani.com
                </Ext>
              </span>
            </div>
            <div className={styles.refItem} id="ref-67">
              <span className={styles.refNum}>[67]</span>
              <span>
                Fluence, &quot;7 Best GPU for LLM in 2026&quot; &mdash;{" "}
                <Ext href="https://www.fluence.network/blog/best-gpu-for-llm/">
                  fluence.network
                </Ext>
              </span>
            </div>
          </div>

          <p className={styles.footerNote}>
            本ガイドはAIによって2026年7月時点の公開情報を調査・要約して作成されています。実際の導入前には、各リンク先の一次情報および最新のツール/モデルのドキュメントを必ずご確認ください。
          </p>
        </section>
      </main>

      <footer className={styles.pageFooter}>
        <div>&copy; 2026 LLM-Studies. All rights reserved.</div>
      </footer>
    </div>
  );
}
