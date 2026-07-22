import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import TocObserver from "./TocObserver";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Gemma 4 実践ガイド 2026 — 中級〜上級エンジニア向けベストプラクティス",
  description:
    "2026年4月に登場した新世代Gemma 4の制御トークン体系、Thinkingモード、Function Calling、量子化(QAT)戦略、ファインチューニング、デプロイ、安全性まで一次情報に基づいて網羅した実践ガイド。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function GemmaBestPracticesGuidePage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <nav className={styles.sidebar} id="sidebar">
        <div className={styles.brand}>
          <div className={styles.brandMark}>G4</div>
          <div className={styles.brandText}>
            Gemma 4 実践ガイド
            <span>Best Practices 2026</span>
          </div>
        </div>
        <div className={styles.tocGroupLabel}>Overview</div>
        <ul className={styles.toc}>
          <li>
            <a href="#intro" className={styles.tocLink}>
              <span className={styles.num}>00</span>はじめに
            </a>
          </li>
          <li>
            <a href="#model-family" className={styles.tocLink}>
              <span className={styles.num}>01</span>モデルファミリーと選定
            </a>
          </li>
          <li>
            <a href="#memory-quant" className={styles.tocLink}>
              <span className={styles.num}>02</span>メモリ計画と量子化
            </a>
          </li>
        </ul>
        <div className={styles.tocGroupLabel}>プロンプト & エージェント</div>
        <ul className={styles.toc}>
          <li>
            <a href="#prompt-format" className={styles.tocLink}>
              <span className={styles.num}>03</span>プロンプト制御トークン
            </a>
          </li>
          <li>
            <a href="#thinking-mode" className={styles.tocLink}>
              <span className={styles.num}>04</span>Thinking Mode
            </a>
          </li>
          <li>
            <a href="#function-calling" className={styles.tocLink}>
              <span className={styles.num}>05</span>Function Calling
            </a>
          </li>
          <li>
            <a href="#mtp" className={styles.tocLink}>
              <span className={styles.num}>06</span>推論高速化(MTP)
            </a>
          </li>
        </ul>
        <div className={styles.tocGroupLabel}>学習 & デプロイ</div>
        <ul className={styles.toc}>
          <li>
            <a href="#fine-tuning" className={styles.tocLink}>
              <span className={styles.num}>07</span>ファインチューニング
            </a>
          </li>
          <li>
            <a href="#local-inference" className={styles.tocLink}>
              <span className={styles.num}>08</span>ローカル推論環境
            </a>
          </li>
          <li>
            <a href="#production" className={styles.tocLink}>
              <span className={styles.num}>09</span>本番/クラウドデプロイ
            </a>
          </li>
        </ul>
        <div className={styles.tocGroupLabel}>ガバナンス</div>
        <ul className={styles.toc}>
          <li>
            <a href="#safety" className={styles.tocLink}>
              <span className={styles.num}>10</span>安全性とガバナンス
            </a>
          </li>
          <li>
            <a href="#checklist" className={styles.tocLink}>
              <span className={styles.num}>11</span>本番投入チェックリスト
            </a>
          </li>
          <li>
            <a href="#summary" className={styles.tocLink}>
              <span className={styles.num}>12</span>まとめ
            </a>
          </li>
          <li>
            <a href="#references" className={styles.tocLink}>
              <span className={styles.num}>13</span>参考文献
            </a>
          </li>
        </ul>
      </nav>

      <main className={styles.content}>
        <header className={styles.hero} id="intro">
          <div className={styles.heroEyebrow}>● Gemma 4 世代 / 2026年7月時点</div>
          <h1>
            Google Gemma 実践ガイド
            <br />
            中級〜上級エンジニア向けベストプラクティス
          </h1>
          <p className={styles.lead}>
            2026年4月に登場した新世代
            <strong style={{ color: "var(--text)" }}>Gemma 4</strong>
            は、制御トークン体系・推論(Thinking)モード・Function
            Calling・量子化戦略のすべてが刷新されました。本ガイドは公式ドキュメントとモデルカードを一次情報として、選定からファインチューニング、デプロイ、安全性まで一気通貫でステップバイステップに解説します。
          </p>
          <div className={styles.heroMeta}>
            <span className={styles.pill}>対象: Transformer/LoRA/量子化を理解しているエンジニア</span>
            <span className={styles.pill}>ベース: Gemma 4 (E2B/E4B/12B/26B A4B/31B)</span>
            <span className={styles.pill}>形式: Markdown表 + Mermaid図解</span>
          </div>
        </header>

        <section className={styles.section} id="reading-flow" style={{ paddingTop: "2.6rem", paddingBottom: "2.6rem" }}>
          <div className={styles.sectionEyebrow}>Roadmap</div>
          <h2>このガイドの読み方</h2>
          <p>
            2026年4月2日、Google DeepMindは新世代モデル<strong>Gemma 4</strong>を発表しました。Gemma 3系列と比べてアーキテクチャそのものが刷新されており、プロンプトの制御トークン体系、Thinking(推論)モード、Function Calling、量子化戦略のすべてが変更されています。本ガイドは、旧世代(Gemma 1〜3)の情報と混同しやすいポイントを明示しながら、Gemma 4を中心にステップバイステップで解説します。
          </p>

          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart LR
    A["00. 全体像"] --> B["01. モデル選定"]
    B --> C["02. 量子化計画"]
    C --> D["03. プロンプト設計"]
    D --> E["04-05. Thinking/Function Calling"]
    E --> F["06. 推論高速化"]
    F --> G["07. ファインチューニング"]
    G --> H["08-09. デプロイ"]
    H --> I["10-11. 安全性/QA"]

    style A fill:#0f2033,stroke:#7c9eff,color:#e8edf7
    style I fill:#0f2033,stroke:#7c9eff,color:#e8edf7`}
            />
          </div>
        </section>

        <section className={styles.section} id="model-family">
          <div className={styles.sectionEyebrow}>01 / Model Selection</div>
          <h2>Gemmaファミリー全体像とモデル選定</h2>

          <h3>1.1 Gemmaのポジショニング</h3>
          <p>
            GemmaはGemini系列と同じ研究基盤から派生した<strong>オープンウェイト</strong>モデル群です。Gemma 4はGemini 3の研究を土台にしており、Apache 2.0ライセンス(Gemma利用規約に準拠)のもとで商用利用が可能です。コアのテキスト/マルチモーダルモデル以外にも、用途特化の派生モデル(Gemmaverse)が多数存在します。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>モデル系列</th>
                  <th>主な用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gemma 4(コア)</td>
                  <td>汎用テキスト・画像・音声理解、推論、エージェント</td>
                </tr>
                <tr>
                  <td>Gemma 3n</td>
                  <td>超軽量エッジ・オンデバイス向け</td>
                </tr>
                <tr>
                  <td>DiffusionGemma</td>
                  <td>拡散方式によるテキスト生成(高スループット)</td>
                </tr>
                <tr>
                  <td>FunctionGemma</td>
                  <td>関数呼び出し特化の軽量モデル</td>
                </tr>
                <tr>
                  <td>EmbeddingGemma</td>
                  <td>オンデバイス埋め込み生成(検索・分類・クラスタリング)</td>
                </tr>
                <tr>
                  <td>PaliGemma</td>
                  <td>画像＋言語のVLM研究向け</td>
                </tr>
                <tr>
                  <td>ShieldGemma 2</td>
                  <td>生成AIの入出力安全性評価(コンテンツモデレーション)</td>
                </tr>
                <tr>
                  <td>MedGemma</td>
                  <td>医療テキスト・医用画像の理解</td>
                </tr>
                <tr>
                  <td>T5Gemma</td>
                  <td>エンコーダ・デコーダ型</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://deepmind.google/models/gemma/">
              Gemma — Google DeepMind
            </Ext>{" "}
            ／{" "}
            <Ext href="https://ai.google.dev/gemma/docs">
              Gemma models overview | Google AI for Developers
            </Ext>
          </p>

          <h3>1.2 Gemma 4のサイズ展開</h3>
          <p>
            Gemma 4は5つのサイズで提供され、それぞれ異なるハードウェアターゲットを想定しています。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>プロパティ</th>
                  <th>E2B</th>
                  <th>E4B</th>
                  <th>12B Unified</th>
                  <th>26B A4B(MoE)</th>
                  <th>31B Dense</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>総パラメータ数</td>
                  <td>2.3B実効/5.1B埋込込</td>
                  <td>4.5B実効/8B埋込込</td>
                  <td>11.95B</td>
                  <td>25.2B(アクティブ3.8B)</td>
                  <td>30.7B</td>
                </tr>
                <tr>
                  <td>レイヤー数</td>
                  <td>35</td>
                  <td>42</td>
                  <td>48</td>
                  <td>30</td>
                  <td>60</td>
                </tr>
                <tr>
                  <td>コンテキスト長</td>
                  <td>128K</td>
                  <td>128K</td>
                  <td>256K</td>
                  <td>256K</td>
                  <td>256K</td>
                </tr>
                <tr>
                  <td>対応モダリティ</td>
                  <td>テキスト/画像/音声</td>
                  <td>テキスト/画像/音声</td>
                  <td>テキスト/画像/音声(EF)</td>
                  <td>テキスト/画像</td>
                  <td>テキスト/画像</td>
                </tr>
                <tr>
                  <td>アーキテクチャ</td>
                  <td>Dense(PLE)</td>
                  <td>Dense(PLE)</td>
                  <td>Unified(EF)</td>
                  <td>MoE</td>
                  <td>Dense</td>
                </tr>
                <tr>
                  <td>想定用途</td>
                  <td>スマホ/ブラウザ/IoT</td>
                  <td>モバイル/ノートPC</td>
                  <td>単一ラップトップ/単一GPU</td>
                  <td>コンシューマGPU(高速)</td>
                  <td>ワークステーション/サーバー</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.callout}>
            <span className={styles.calloutTitle}>用語補足</span>
            <p style={{ margin: "0 0 0.6rem" }}>
              <strong>E2B/E4Bの「E」= Effective(実効)</strong>：Per-Layer Embeddings(PLE)により各デコーダ層が独自の軽量埋め込みテーブルを持つ。巨大だがルックアップのみに使われるため、実ロードメモリは実効パラメータ数より多くなる。
            </p>
            <p style={{ margin: "0 0 0.6rem" }}>
              <strong>26B A4Bの「A」= Active(アクティブ)</strong>：全128エキスパート＋共有1個のうちトークンごとに8エキスパートのみ活性化。推論速度は4Bモデル並みだが、ルーティング維持のため全26Bぶんをメモリに常駐させる必要がある。
            </p>
            <p style={{ margin: 0 }}>
              <strong>12B「Unified」</strong>：画像・音声用の専用エンコーダを持たず、生の画像パッチ/音声波形を線形射影で直接LLMの埋め込み空間に投影する、初のエンコーダフリー中規模モデル。
            </p>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/core/model_card_4">
              Gemma 4 model card
            </Ext>{" "}
            ／{" "}
            <Ext href="https://ai.google.dev/gemma/docs/core">
              Gemma 4 model overview
            </Ext>
          </p>

          <h3>1.3 選定フローチャート</h3>
          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart TD
    Start(["デプロイ環境は?"]) --> Edge{"スマホ / ブラウザ / IoT?"}
    Edge -->|"Yes"| EdgeSize{"音声入力が必要?"}
    EdgeSize -->|"最軽量優先"| E2B["E2B<br/>(2.3B実効)"]
    EdgeSize -->|"精度重視"| E4B["E4B<br/>(4.5B実効)"]

    Edge -->|"No"| Laptop{"単一GPU/ラップトップ?"}
    Laptop -->|"音声+動画も欲しい"| Unified12["12B Unified<br/>(16GB前後で稼働)"]
    Laptop -->|"No: サーバー/ワークステーション"| Server{"レイテンシ or 精度?"}

    Server -->|"レイテンシ・省メモリ"| MoE26["26B A4B MoE<br/>(アクティブ3.8B)"]
    Server -->|"精度最優先"| Dense31["31B Dense"]

    style E2B fill:#0f2438,stroke:#7c9eff,color:#e8edf7
    style E4B fill:#0f2438,stroke:#7c9eff,color:#e8edf7
    style Unified12 fill:#0f2438,stroke:#7c9eff,color:#e8edf7
    style MoE26 fill:#0f2438,stroke:#7c9eff,color:#e8edf7
    style Dense31 fill:#0f2438,stroke:#7c9eff,color:#e8edf7`}
            />
          </div>

          <h3>1.4 ベンチマーク早見表(Instruction-tunedモデル)</h3>
          <p>
            Gemma 3世代との比較を含む主要ベンチマーク(数値が高いほど良い。MRCRは長文脈理解の指標)。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>ベンチマーク</th>
                  <th>31B</th>
                  <th>26B A4B</th>
                  <th>12B Unified</th>
                  <th>E4B</th>
                  <th>E2B</th>
                  <th>Gemma 3 27B(参考)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>MMLU Pro</td>
                  <td>85.2%</td>
                  <td>82.6%</td>
                  <td>77.2%</td>
                  <td>69.4%</td>
                  <td>60.0%</td>
                  <td>67.6%</td>
                </tr>
                <tr>
                  <td>AIME 2026(no tools)</td>
                  <td>89.2%</td>
                  <td>88.3%</td>
                  <td>77.5%</td>
                  <td>42.5%</td>
                  <td>37.5%</td>
                  <td>20.8%</td>
                </tr>
                <tr>
                  <td>LiveCodeBench v6</td>
                  <td>80.0%</td>
                  <td>77.1%</td>
                  <td>72.0%</td>
                  <td>52.0%</td>
                  <td>44.0%</td>
                  <td>29.1%</td>
                </tr>
                <tr>
                  <td>GPQA Diamond</td>
                  <td>84.3%</td>
                  <td>82.3%</td>
                  <td>78.8%</td>
                  <td>58.6%</td>
                  <td>43.4%</td>
                  <td>42.4%</td>
                </tr>
                <tr>
                  <td>MMMU Pro(視覚)</td>
                  <td>76.9%</td>
                  <td>73.8%</td>
                  <td>69.1%</td>
                  <td>52.6%</td>
                  <td>44.2%</td>
                  <td>49.7%</td>
                </tr>
                <tr>
                  <td>MRCR v2(長文脈128k)</td>
                  <td>66.4%</td>
                  <td>44.1%</td>
                  <td>43.4%</td>
                  <td>25.4%</td>
                  <td>19.1%</td>
                  <td>13.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            数学・コーディング・エージェント系タスクでGemma 3からの伸び幅が特に大きい点が特徴です。長文脈(MRCR)と高難度推論(AIME/GPQA)ではモデルサイズによる差が非常に大きく出るため、「小型モデルで十分」と判断する前に該当タスクでの実測評価を推奨します。
          </p>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/core/model_card_4">
              Gemma 4 model card — Benchmark Results
            </Ext>
          </p>
        </section>

        <section className={styles.section} id="memory-quant">
          <div className={styles.sectionEyebrow}>02 / Memory & Quantization</div>
          <h2>メモリ計画と量子化戦略</h2>

          <h3>2.1 推論に必要な概算メモリ</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>パラメータサイズ</th>
                  <th>BF16(16bit)</th>
                  <th>SFP8(8bit)</th>
                  <th>Q4_0(4bit)</th>
                  <th>モバイル</th>
                  <th>モバイル(テキストのみ)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>E2B</td>
                  <td>11.4 GB</td>
                  <td>5.7 GB</td>
                  <td>2.9 GB</td>
                  <td>1.1 GB</td>
                  <td>0.84 GB</td>
                </tr>
                <tr>
                  <td>E4B</td>
                  <td>17.9 GB</td>
                  <td>8.9 GB</td>
                  <td>4.5 GB</td>
                  <td>2.5 GB</td>
                  <td>2.2 GB</td>
                </tr>
                <tr>
                  <td>12B</td>
                  <td>26.7 GB</td>
                  <td>13.4 GB</td>
                  <td>6.7 GB</td>
                  <td>–</td>
                  <td>–</td>
                </tr>
                <tr>
                  <td>26B A4B</td>
                  <td>57.7 GB</td>
                  <td>28.8 GB</td>
                  <td>14.4 GB</td>
                  <td>–</td>
                  <td>–</td>
                </tr>
                <tr>
                  <td>31B</td>
                  <td>69.9 GB</td>
                  <td>34.9 GB</td>
                  <td>17.5 GB</td>
                  <td>–</td>
                  <td>–</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.calloutWarn}>
            <span className={styles.calloutTitle}>実務で見落としやすい注意点</span>
            <p style={{ margin: "0 0 0.6rem" }}>
              上表は<strong>静的な重みのロードのみ</strong>の数値で、KVキャッシュ(コンテキスト長に比例して増大)や推論エンジンのオーバーヘッドは含まれません。ロングコンテキスト運用時は追加でVRAMを確保してください。
            </p>
            <p style={{ margin: "0 0 0.6rem" }}>
              26B A4B(MoE)は「アクティブパラメータ4B」でも、ルーティングのため<strong>全26Bを常駐</strong>させる必要があり、メモリ効率は見た目ほど良くありません。
            </p>
            <p style={{ margin: 0 }}>
              ファインチューニング時のメモリ要件は推論より大幅に高くなります。フルファインチューニングかLoRA/QLoRAかで必要メモリが桁違いに変わります(第7章参照)。
            </p>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/core">
              Gemma 4 model overview — Inference Memory Requirements
            </Ext>
          </p>

          <h3>2.2 Quantization-Aware Training(QAT)を優先する</h3>
          <p>
            Gemma 4では公式のQATチェックポイントが提供されています。通常のPost-Training Quantization(PTQ)は学習済みモデルを事後圧縮するため精度劣化が起きやすいのに対し、QATは<strong>量子化を学習プロセスに組み込む</strong>ことで、低ビット化しても高精度を維持します。ローカル実行では「同じ4bitでも」PTQよりQATを優先することが推奨されます。
          </p>

          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart TD
    A["デプロイ先を決める"] --> B{"ローカル/エッジ実行?"}
    B -->|"llama.cpp / LM Studio"| C["*-qat-q4_0-gguf を選択"]
    B -->|"vLLM / SGLang サーバ"| D["*-qat-w4a16-ct(サーバ向け)"]
    B -->|"投機的デコーディングを使う"| F["*-qat-q4_0-unquantized<br/>+対応するassistantドラフトモデル"]
    B -->|"モバイル"| E["*-qat-mobile-transformers"]
    B -->|"他形式へ変換(MLX等)"| G["*-qat-q4_0-unquantized"]

    style C fill:#0f2438,stroke:#7c9eff,color:#e8edf7
    style D fill:#0f2438,stroke:#7c9eff,color:#e8edf7
    style E fill:#0f2438,stroke:#7c9eff,color:#e8edf7
    style F fill:#0f2438,stroke:#7c9eff,color:#e8edf7
    style G fill:#0f2438,stroke:#7c9eff,color:#e8edf7`}
            />
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/core">
              Gemma 4 model overview — Quantization-Aware Training
            </Ext>{" "}
            ／{" "}
            <Ext href="https://blog.google/innovation-and-ai/technology/developers-tools/quantization-aware-training-gemma-4/">
              Gemma 4 with quantization-aware training | Google Developers Blog
            </Ext>
          </p>

          <h3>2.3 QATダウンロード先クイックルーティング</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>デプロイエンジン</th>
                  <th>サフィックス例</th>
                  <th>用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>llama.cpp / LM Studio</td>
                  <td>
                    <code className={styles.inlineCode}>-qat-q4_0-gguf</code>
                  </td>
                  <td>CPU・Apple Silicon・コンシューマGPUでのゼロコンフィグ実行</td>
                </tr>
                <tr>
                  <td>vLLM / SGLang</td>
                  <td>
                    <code className={styles.inlineCode}>-qat-w4a16-ct</code>
                  </td>
                  <td>4bit重み+16bitアクティベーションの高スループット推論</td>
                </tr>
                <tr>
                  <td>投機的デコーディング</td>
                  <td>
                    <code className={styles.inlineCode}>-qat-q4_0-unquantized</code> + <code className={styles.inlineCode}>-assistant</code>
                  </td>
                  <td>MTPドラフトモデルと組み合わせた高速化</td>
                </tr>
                <tr>
                  <td>モバイル(Transformers)</td>
                  <td>
                    <code className={styles.inlineCode}>-qat-mobile-transformers</code>
                  </td>
                  <td>エッジ最適化済み参照実装</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            公式QATコレクションは Hugging Face の <code className={styles.inlineCode}>google/gemma-4-qat-q4-0</code> および
            <code className={styles.inlineCode}>google/gemma-4-qat-mobile</code> コレクション、または Kaggle から取得できます。
          </p>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/core">
              Gemma 4 model overview
            </Ext>
          </p>
        </section>

        <section className={styles.section} id="prompt-format">
          <div className={styles.sectionEyebrow}>03 / Prompt Formatting</div>
          <h2>プロンプトフォーマットと制御トークン(Gemma 4新仕様)</h2>

          <div className={styles.calloutWarn}>
            <span className={styles.calloutTitle}>重要</span>
            <p style={{ margin: 0 }}>
              Gemma 4はGemma 1〜3の <code className={styles.inlineCode}>&lt;start_of_turn&gt;</code> / <code className={styles.inlineCode}>&lt;end_of_turn&gt;</code> 形式から刷新され、新しい制御トークン体系を採用しています。旧形式のコードやプロンプトテンプレートをそのまま流用すると正しく動作しません。
            </p>
          </div>

          <h3>3.1 基本の会話制御トークン</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>トークン</th>
                  <th>役割</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code className={styles.inlineCode}>system</code></td>
                  <td>システム指示のロールを示す</td>
                </tr>
                <tr>
                  <td><code className={styles.inlineCode}>user</code></td>
                  <td>ユーザーターンを示す</td>
                </tr>
                <tr>
                  <td><code className={styles.inlineCode}>model</code></td>
                  <td>モデルターンを示す</td>
                </tr>
                <tr>
                  <td><code className={styles.inlineCode}>&lt;|turn&gt;</code></td>
                  <td>対話ターンの開始</td>
                </tr>
                <tr>
                  <td><code className={styles.inlineCode}>&lt;turn|&gt;</code></td>
                  <td>対話ターンの終了</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>基本形は以下の通りです(実際の文字列は公式トークナイザで予約済み)。</p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>prompt_format.txt</span>
              <span className={styles.codeLang}>TEXT</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.ch}>{"<|turn>"}</span><span className={styles.ck}>system</span></div>
              <div className={styles.codeLine}>{"You are a helpful assistant."}<span className={styles.ch}>{"<turn|>"}</span></div>
              <div className={styles.codeLine}><span className={styles.ch}>{"<|turn>"}</span><span className={styles.ck}>user</span></div>
              <div className={styles.codeLine}>{"Hello."}<span className={styles.ch}>{"<turn|>"}</span></div>
            </div>
          </div>

          <p>
            多くのライブラリ(Transformers、llama.cppなど)は <code className={styles.inlineCode}>apply_chat_template()</code> 等のchat templateがこの複雑さを吸収してくれるため、手書きする機会は少ないものの、<strong>デバッグ時にトークンの意味を理解しておくことが重要</strong>です。
          </p>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/core/prompt-formatting-gemma4">
              Gemma 4 Prompt Formatting | Google AI for Developers
            </Ext>
          </p>

          <h3>3.2 マルチモーダルトークン</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>トークン</th>
                  <th>用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code className={styles.inlineCode}>&lt;|image&gt;</code> ... <code className={styles.inlineCode}>&lt;image|&gt;</code></td>
                  <td>画像埋め込みを示す</td>
                </tr>
                <tr>
                  <td><code className={styles.inlineCode}>&lt;|audio&gt;</code> ... <code className={styles.inlineCode}>&lt;audio|&gt;</code></td>
                  <td>音声埋め込みを示す</td>
                </tr>
                <tr>
                  <td>プレースホルダー</td>
                  <td>トークナイズ後、実際のsoft embeddingに置換される</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.callout}>
            <span className={styles.calloutTitle}>ベストプラクティス(モダリティの並び順)</span>
            <ul style={{ margin: 0 }}>
              <li>画像コンテンツは<strong>テキストより前</strong>に配置する</li>
              <li>音声コンテンツは<strong>テキストより後</strong>に配置する</li>
            </ul>
          </div>

          <h3>3.3 画像の可変解像度(トークン予算)</h3>
          <p>
            Gemma 4は画像ごとに「視覚トークン予算」を選べます。予算が大きいほど細部が保持されますが計算コストも増えます。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>トークン予算</th>
                  <th>推奨用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>70 / 140</td>
                  <td>分類・キャプション生成・動画理解(多フレーム処理を優先)</td>
                </tr>
                <tr>
                  <td>280 / 560</td>
                  <td>一般的な画像理解</td>
                </tr>
                <tr>
                  <td>1120</td>
                  <td>OCR・文書解析・小さな文字の読み取りなど高精度が必要な場合</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/core/model_card_4">
              Gemma 4 model card — Best Practices
            </Ext>
          </p>

          <h3>3.4 会話ターンのシーケンス図</h3>
          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`sequenceDiagram
    participant App as アプリケーション
    participant Gemma as Gemma 4

    App->>Gemma: turn:system ... turn end
    App->>Gemma: turn:user ... turn end
    Gemma-->>App: turn:model ... turn end
    Note over App,Gemma: 複数ターンの履歴では、モデルの内部思考(thought)は<br/>次ターンに渡す前に必ず除去する`}
            />
          </div>

          <h3>3.5 推奨サンプリングパラメータ</h3>
          <p>
            公式ベストプラクティスとして、全ユースケースで以下の標準サンプリング設定が推奨されています。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>パラメータ</th>
                  <th>推奨値</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code className={styles.inlineCode}>temperature</code></td>
                  <td>1.0</td>
                </tr>
                <tr>
                  <td><code className={styles.inlineCode}>top_p</code></td>
                  <td>0.95</td>
                </tr>
                <tr>
                  <td><code className={styles.inlineCode}>top_k</code></td>
                  <td>64</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>これらは既存のGemma 3向け設定と異なる場合があるため、移行時は必ず確認してください。</p>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/core/model_card_4">
              Gemma 4 model card — Sampling Parameters
            </Ext>
          </p>
        </section>

        <section className={styles.section} id="thinking-mode">
          <div className={styles.sectionEyebrow}>04 / Reasoning</div>
          <h2>Thinking Mode(推論モード)を使いこなす</h2>

          <h3>4.1 有効化と構造</h3>
          <p>
            Thinking(内部推論)はシステムプロンプトの先頭に <code className={styles.inlineCode}>&lt;|think|&gt;</code> トークンを含めることで有効化します。無効化する場合はこのトークンを取り除くだけです。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>トークン</th>
                  <th>役割</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code className={styles.inlineCode}>&lt;|think|&gt;</code></td>
                  <td>Thinkingモードを有効化</td>
                </tr>
                <tr>
                  <td><code className={styles.inlineCode}>&lt;|channel&gt;</code> ... <code className={styles.inlineCode}>&lt;channel|&gt;</code></td>
                  <td>モデルの内部思考プロセスを示す(常に<code className={styles.inlineCode}>thought</code>という語を伴う)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>有効化時の出力構造:</p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>thinking_output.txt</span>
              <span className={styles.codeLang}>TEXT</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.ch}>{"<|channel>"}</span><span className={styles.cm}>thought</span></div>
              <div className={styles.codeLine}><span className={styles.cc}>{"...(内部推論)..."}</span></div>
              <div className={styles.codeLine}><span className={styles.ch}>{"<channel|>"}</span><span className={styles.cv}>{"...(最終回答)..."}</span></div>
            </div>
          </div>

          <div className={styles.calloutWarn}>
            <span className={styles.calloutTitle}>注意</span>
            <p style={{ margin: 0 }}>
              E2B/E4B以外のモデルでThinkingを無効化しても、空のチャンネルタグ(<code className={styles.inlineCode}>&lt;|channel&gt;thought &lt;channel|&gt;</code>)自体は出力される仕様です。
            </p>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/core/prompt-formatting-gemma4">
              Gemma 4 Prompt Formatting — Thinking Mode
            </Ext>
          </p>

          <h3>4.2 マルチターンでの思考履歴管理(重要な落とし穴)</h3>
          <ul>
            <li>
              <strong>通常の複数ターン会話</strong>：前ターンの内部思考(thought)は次のユーザーターンに渡す前に<strong>必ず履歴から除去</strong>します。これを怠ると文脈が肥大化し、モデルが循環的な推論ループに陥るリスクがあります。
            </li>
            <li>
              <strong>Function Calling時の例外</strong>：1回のモデルターン内でツール呼び出しが発生した場合、その思考は除去してはいけません。
            </li>
          </ul>
          <p>
            長時間稼働するエージェントでは、生の思考を毎ターン破棄しつつも、<strong>要約した思考をテキストとして文脈に再注入する</strong>ことで、推論の一貫性を保つテクニックが推奨されています。この要約に厳密なフォーマットは定められていないため、アーキテクチャに合わせて自由に設計できます。
          </p>

          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart LR
    U1["ユーザーターン1"] --> M1["モデル: thought...回答1"]
    M1 --> Strip["回答のみ抽出<br/>(thoughtは破棄 or 要約)"]
    Strip --> U2["ユーザーターン2 + 要約済み文脈"]
    U2 --> M2["モデル: 新たなthought...回答2"]

    style Strip fill:#0f2438,stroke:#7c9eff,color:#e8edf7`}
            />
          </div>

          <h3>4.3 Adaptive Thought Efficiency(思考量の調整)</h3>
          <p>
            Gemma 4のThinkingはON/OFFの二値仕様ですが、指示追従性の高さを利用して、システム指示で「浅く・効率的に考えて」と明示的に誘導することで、思考トークン数を約20%削減できることが確認されています。これは公式にトレーニングされた機能ではなく、指示追従能力の副産物であるため、プロンプトの文言はチームごとにチューニングすることが推奨されます。
          </p>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/core/prompt-formatting-gemma4">
              Gemma 4 Prompt Formatting — Tip: Adaptive Thought Efficiency
            </Ext>
          </p>

          <h3>4.4 大規模モデルのファインチューニング時の注意</h3>
          <p>
            <code className={styles.inlineCode}>gemma-4-26B-A4B-it</code> や <code className={styles.inlineCode}>gemma-4-31B-it</code> を「thinkingを含まないデータセット」でファインチューニングする場合、訓練プロンプトに空のチャンネルを追加すると結果が改善します。
          </p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>empty_channel.txt</span>
              <span className={styles.codeLang}>TEXT</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.ch}>{"<|turn>"}</span><span className={styles.ck}>model</span></div>
              <div className={styles.codeLine}><span className={styles.ch}>{"<|channel>"}</span><span className={styles.cm}>thought</span></div>
              <div className={styles.codeLine}><span className={styles.ch}>{"<channel|>"}</span></div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="function-calling">
          <div className={styles.sectionEyebrow}>05 / Agentic</div>
          <h2>Function Calling(エージェント機能)</h2>

          <h3>5.1 ツール呼び出し専用トークン</h3>
          <p>
            Gemma 4は「ツール利用ライフサイクル」を管理するため、専用の特殊トークンで学習されています。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>トークンペア</th>
                  <th>役割</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code className={styles.inlineCode}>&lt;|tool&gt;</code> ... <code className={styles.inlineCode}>&lt;tool|&gt;</code></td>
                  <td>ツール定義</td>
                </tr>
                <tr>
                  <td><code className={styles.inlineCode}>&lt;|tool_call&gt;</code> ... <code className={styles.inlineCode}>&lt;tool_call|&gt;</code></td>
                  <td>モデルによるツール利用要求</td>
                </tr>
                <tr>
                  <td><code className={styles.inlineCode}>&lt;|tool_response&gt;</code> ... <code className={styles.inlineCode}>&lt;tool_response|&gt;</code></td>
                  <td>ツール実行結果をモデルに返却</td>
                </tr>
                <tr>
                  <td><code className={styles.inlineCode}>&lt;|"|&gt;</code></td>
                  <td>構造化データ内の文字列値の区切り文字(特殊文字を無害化)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <code className={styles.inlineCode}>&lt;|tool_response&gt;</code> は推論エンジンにとって追加の停止シーケンスとしても機能します。
          </p>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/core/prompt-formatting-gemma4">
              Gemma 4 Prompt Formatting — Function Calling
            </Ext>
          </p>

          <h3>5.2 ライフサイクル(4段階)</h3>
          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`sequenceDiagram
    participant User as ユーザー
    participant Gemma as Gemma 4
    participant App as アプリケーション(実行環境)

    User->>Gemma: 「東京の気温は?」
    Note over Gemma: 内部で思考(thought)
    Gemma->>App: tool_call: get_current_weather(location="Tokyo")
    App->>App: 実際の天気APIを実行
    App->>Gemma: tool_response: temperature 15, sunny
    Gemma->>User: 「東京は15度で晴れです」`}
            />
          </div>

          <ol>
            <li><strong>ツール定義</strong>：関数名・引数・説明を含むツールをモデルに提示する</li>
            <li><strong>モデルのターン</strong>：ユーザープロンプトとツール一覧を受け取り、テキストではなく構造化された関数呼び出しオブジェクトを返す</li>
            <li><strong>開発者のターン</strong>：レスポンスをパースし、関数名と引数を抽出、実際のコードを実行し、その結果を<code className={styles.inlineCode}>tool</code>ロールとして履歴に追加する</li>
            <li><strong>最終応答</strong>：モデルがツールの実行結果を読み取り、自然文で最終回答を生成する</li>
          </ol>

          <div className={styles.calloutWarn}>
            <span className={styles.calloutTitle}>重要な注意(公式ドキュメントより)</span>
            <p style={{ margin: 0 }}>
              Gemmaモデルは自分自身ではコードを実行できません。生成された関数呼び出しは必ずアプリケーション側で検証してから実行してください。無条件の実行はセキュリティリスクになります。
            </p>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/capabilities/text/function-calling-gemma4">
              Function calling with Gemma 4 | Google AI for Developers
            </Ext>
          </p>

          <h3>5.3 実装方法の選択肢</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>方法</th>
                  <th>概要</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Hugging Face Transformers</td>
                  <td>
                    <code className={styles.inlineCode}>apply_chat_template()</code>の<code className={styles.inlineCode}>tools</code>引数にJSON schemaまたは生のPython関数を渡す。型ヒント・docstringから自動でスキーマ生成
                  </td>
                </tr>
                <tr>
                  <td>Gemini API経由</td>
                  <td>
                    <code className={styles.inlineCode}>google-genai</code> SDKの<code className={styles.inlineCode}>types.Tool(function_declarations=[...])</code>で定義
                  </td>
                </tr>
                <tr>
                  <td>vLLM(本番運用)</td>
                  <td>
                    <code className={styles.inlineCode}>--enable-auto-tool-choice --tool-call-parser gemma4 --reasoning-parser gemma4</code> でOpenAI互換API対応
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>Gemini API経由の例(要点のみ抜粋・整形):</p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>function_calling.py</span>
              <span className={styles.codeLang}>PYTHON</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.ck}>from</span> <span className={styles.cv}>google</span> <span className={styles.ck}>import</span> <span className={styles.cv}>genai</span></div>
              <div className={styles.codeLine}><span className={styles.ck}>from</span> <span className={styles.cv}>google.genai</span> <span className={styles.ck}>import</span> <span className={styles.cv}>types</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.cv}>get_weather</span> <span className={styles.ce}>=</span> <span className={styles.ce}>&#123;</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cs}>&quot;name&quot;</span><span className={styles.ce}>:</span> <span className={styles.cs}>&quot;get_weather&quot;</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cs}>&quot;description&quot;</span><span className={styles.ce}>:</span> <span className={styles.cs}>&quot;Get current weather for a given location.&quot;</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cs}>&quot;parameters&quot;</span><span className={styles.ce}>:</span> <span className={styles.ce}>&#123;</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;&nbsp;&nbsp;<span className={styles.cs}>&quot;type&quot;</span><span className={styles.ce}>:</span> <span className={styles.cs}>&quot;object&quot;</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;&nbsp;&nbsp;<span className={styles.cs}>&quot;properties&quot;</span><span className={styles.ce}>:</span> <span className={styles.ce}>&#123;</span><span className={styles.cs}>&quot;location&quot;</span><span className={styles.ce}>:</span> <span className={styles.ce}>&#123;</span><span className={styles.cs}>&quot;type&quot;</span><span className={styles.ce}>:</span> <span className={styles.cs}>&quot;string&quot;</span><span className={styles.ce}>&#125;</span><span className={styles.ce}>&#125;</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;&nbsp;&nbsp;<span className={styles.cs}>&quot;required&quot;</span><span className={styles.ce}>:</span> <span className={styles.ce}>[</span><span className={styles.cs}>&quot;location&quot;</span><span className={styles.ce}>]</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.ce}>&#125;</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}><span className={styles.ce}>&#125;</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.cv}>client</span> <span className={styles.ce}>=</span> <span className={styles.cv}>genai</span><span className={styles.ce}>.</span><span className={styles.cm}>Client</span><span className={styles.ce}>(</span><span className={styles.ce}>)</span></div>
              <div className={styles.codeLine}><span className={styles.cv}>tools</span> <span className={styles.ce}>=</span> <span className={styles.cv}>types</span><span className={styles.ce}>.</span><span className={styles.cm}>Tool</span><span className={styles.ce}>(</span><span className={styles.cv}>function_declarations</span><span className={styles.ce}>=</span><span className={styles.ce}>[</span><span className={styles.cv}>get_weather</span><span className={styles.ce}>]</span><span className={styles.ce}>)</span></div>
              <div className={styles.codeLine}><span className={styles.cv}>config</span> <span className={styles.ce}>=</span> <span className={styles.cv}>types</span><span className={styles.ce}>.</span><span className={styles.cm}>GenerateContentConfig</span><span className={styles.ce}>(</span><span className={styles.cv}>tools</span><span className={styles.ce}>=</span><span className={styles.ce}>[</span><span className={styles.cv}>tools</span><span className={styles.ce}>]</span><span className={styles.ce}>)</span></div>
              <div className={styles.codeLine}><span className={styles.cv}>response</span> <span className={styles.ce}>=</span> <span className={styles.cv}>client</span><span className={styles.ce}>.</span><span className={styles.cv}>models</span><span className={styles.ce}>.</span><span className={styles.cm}>generate_content</span><span className={styles.ce}>(</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>model</span><span className={styles.ce}>=</span><span className={styles.cs}>&quot;gemma-4-26b-a4b-it&quot;</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>contents</span><span className={styles.ce}>=</span><span className={styles.cs}>&quot;Should I bring an umbrella to Kyoto today?&quot;</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>config</span><span className={styles.ce}>=</span><span className={styles.cv}>config</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}><span className={styles.ce}>)</span></div>
            </div>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://www.philschmid.de/gemma-4-gemini-api">
              How to use Gemma 4 with the Gemini API and Google AI Studio
            </Ext>{" "}
            ／{" "}
            <Ext href="https://github.com/vllm-project/recipes/blob/main/Google/Gemma4.md">
              vllm-project/recipes: Google/Gemma4.md
            </Ext>
          </p>
        </section>

        <section className={styles.section} id="mtp">
          <div className={styles.sectionEyebrow}>06 / Inference Speed</div>
          <h2>推論高速化: Multi-Token Prediction(MTP)</h2>

          <h3>6.1 仕組み</h3>
          <p>
            MTPはGemma 4における投機的デコーディング(Speculative Decoding)専用のアーキテクチャです。小さく高速な「ドラフトモデル」が数トークン先を予測し、本体(ターゲット)モデルがそれを並列に検証します。ドラフトが却下された場合でも、その位置の正しいトークンはターゲットモデルが即座に生成するため、無駄になりません。
          </p>
          <p>
            ドラフトモデルはターゲットモデルと<strong>入力埋め込みテーブルを共有</strong>し、ターゲットの最終層のアクティベーションを直接利用するため、独立した別モデルではありません。これにより、<strong>通常の自己回帰生成と完全に同一の出力品質を保証しながら</strong>、デコーディングを高速化できます。
          </p>

          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart LR
    subgraph Draft["ドラフトモデル 小・高速"]
        D1["トークンt+1候補"] --> D2["トークンt+2候補"] --> D3["トークンt+3候補"]
    end
    subgraph Target["ターゲットモデル Gemma 4本体"]
        V["並列検証"]
    end
    Draft --> V
    V --> Accept["採用されたトークン"]
    V --> Reject["却下→ターゲットが正しいトークンを生成"]

    style Accept fill:#0f2438,stroke:#7c9eff,color:#e8edf7
    style Reject fill:#3a1f1f,stroke:#ff8a7c,color:#e8edf7`}
            />
          </div>

          <h3>6.2 Dense vs MoEでの挙動の違い</h3>
          <ul>
            <li>
              <strong>Denseモデル</strong>：全トークンで同じ重みを使うため、複数ドラフトトークンの検証オーバーヘッドは最小限
            </li>
            <li>
              <strong>26B A4B(MoE)</strong>：トークンごとに異なるエキスパートが活性化するため、複数ドラフトの検証で追加のエキスパート重みロードが必要になる場合がある。バッチサイズが大きいほどエキスパートの重複利用が進み高速化しやすいが、<strong>バッチサイズ1では並列性の低いハードウェアで速度向上が出にくい</strong>点に注意
            </li>
          </ul>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/mtp/overview">
              Speed-up Gemma 4 with Multi-Token Prediction
            </Ext>
          </p>
        </section>

        <section className={styles.section} id="fine-tuning">
          <div className={styles.sectionEyebrow}>07 / Fine-tuning</div>
          <h2>ファインチューニング ベストプラクティス</h2>

          <h3>7.1 手法の選び方</h3>
          <div className={styles.gridCards}>
            <div className={styles.card}>
              <h4>QLoRA(推奨の出発点)</h4>
              <p>
                ベースモデルを4bit量子化して重みを凍結し、LoRAアダプタのみ学習。計算資源を大幅削減しつつ高性能を維持
              </p>
            </div>
            <div className={styles.card}>
              <h4>フルファインチューニング</h4>
              <p>全パラメータを更新。最高性能だが計算資源要件は非常に高い</p>
            </div>
            <div className={styles.card}>
              <h4>Unsloth</h4>
              <p>QLoRA/LoRAをさらに高速化・省メモリ化するサードパーティ最適化ライブラリ</p>
            </div>
          </div>

          <h3>7.2 QLoRAワークフロー</h3>
          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart TD
    A["1.ユースケース定義<br/>(例:Text-to-SQL)"] --> B["2.データセット準備<br/>(messages形式のJSON)"]
    B --> C["3.モデル+トークナイザのロード<br/>(4bit量子化)"]
    C --> D["4.LoraConfig定義<br/>(r, alpha, target_modules)"]
    D --> E["5.SFTConfig+SFTTrainerで学習"]
    E --> F["6.アダプタをベースにマージ"]
    F --> G["7.推論テスト・評価"]

    style A fill:#0f2438,stroke:#7c9eff,color:#e8edf7
    style G fill:#0f2438,stroke:#7c9eff,color:#e8edf7`}
            />
          </div>

          <h3>7.3 実装例(Hugging Face TRL + PEFT)</h3>
          <p>環境構築:</p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>install.sh</span>
              <span className={styles.codeLang}>BASH</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.ck}>pip install</span> <span className={styles.cv}>torch tensorboard</span></div>
              <div className={styles.codeLine}><span className={styles.ck}>pip install</span> <span className={styles.cs}>&quot;transformers&gt;=5.10.1&quot;</span></div>
              <div className={styles.codeLine}><span className={styles.ck}>pip install</span> <span className={styles.cv}>datasets accelerate evaluate bitsandbytes trl peft protobuf sentencepiece</span></div>
            </div>
          </div>

          <p>
            データセットは会話形式(<code className={styles.inlineCode}>messages</code>)のJSONで用意します。TRLの<code className={styles.inlineCode}>SFTTrainer</code>が自動的にchat templateを適用します。
          </p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>dataset.json</span>
              <span className={styles.codeLang}>JSON</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.ce}>&#123;</span><span className={styles.ck}>&quot;messages&quot;</span><span className={styles.ce}>:</span> <span className={styles.ce}>[</span><span className={styles.ce}>&#123;</span><span className={styles.ck}>&quot;role&quot;</span><span className={styles.ce}>:</span> <span className={styles.cs}>&quot;system&quot;</span><span className={styles.ce}>,</span> <span className={styles.ck}>&quot;content&quot;</span><span className={styles.ce}>:</span> <span className={styles.cs}>&quot;...&quot;</span><span className={styles.ce}>&#125;</span><span className={styles.ce}>,</span> <span className={styles.ce}>&#123;</span><span className={styles.ck}>&quot;role&quot;</span><span className={styles.ce}>:</span> <span className={styles.cs}>&quot;user&quot;</span><span className={styles.ce}>,</span> <span className={styles.ck}>&quot;content&quot;</span><span className={styles.ce}>:</span> <span className={styles.cs}>&quot;...&quot;</span><span className={styles.ce}>&#125;</span><span className={styles.ce}>,</span> <span className={styles.ce}>&#123;</span><span className={styles.ck}>&quot;role&quot;</span><span className={styles.ce}>:</span> <span className={styles.cs}>&quot;assistant&quot;</span><span className={styles.ce}>,</span> <span className={styles.ck}>&quot;content&quot;</span><span className={styles.ce}>:</span> <span className={styles.cs}>&quot;...&quot;</span><span className={styles.ce}>&#125;</span><span className={styles.ce}>]</span><span className={styles.ce}>&#125;</span></div>
            </div>
          </div>

          <p>モデルと量子化設定のロード:</p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>load_model.py</span>
              <span className={styles.codeLang}>PYTHON</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.ck}>import</span> <span className={styles.cv}>torch</span></div>
              <div className={styles.codeLine}><span className={styles.ck}>from</span> <span className={styles.cv}>transformers</span> <span className={styles.ck}>import</span> <span className={styles.cm}>AutoTokenizer</span><span className={styles.ce}>,</span> <span className={styles.cm}>AutoModelForImageTextToText</span><span className={styles.ce}>,</span> <span className={styles.cm}>BitsAndBytesConfig</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.cv}>model_id</span> <span className={styles.ce}>=</span> <span className={styles.cs}>&quot;google/gemma-4-E2B&quot;</span></div>
              <div className={styles.codeLine}><span className={styles.cv}>torch_dtype</span> <span className={styles.ce}>=</span> <span className={styles.cv}>torch</span><span className={styles.ce}>.</span><span className={styles.cv}>bfloat16</span> <span className={styles.ck}>if</span> <span className={styles.cv}>torch</span><span className={styles.ce}>.</span><span className={styles.cv}>cuda</span><span className={styles.ce}>.</span><span className={styles.cm}>get_device_capability</span><span className={styles.ce}>(</span><span className={styles.ce}>)</span><span className={styles.ce}>[</span><span className={styles.cm}>0</span><span className={styles.ce}>]</span> <span className={styles.ce}>&gt;=</span> <span className={styles.cm}>8</span> <span className={styles.ck}>else</span> <span className={styles.cv}>torch</span><span className={styles.ce}>.</span><span className={styles.cv}>float16</span></div>
              <div className={styles.codeLine}><span className={styles.cv}>model_kwargs</span> <span className={styles.ce}>=</span> <span className={styles.cm}>dict</span><span className={styles.ce}>(</span><span className={styles.cv}>dtype</span><span className={styles.ce}>=</span><span className={styles.cv}>torch_dtype</span><span className={styles.ce}>,</span> <span className={styles.cv}>device_map</span><span className={styles.ce}>=</span><span className={styles.cs}>&quot;auto&quot;</span><span className={styles.ce}>)</span></div>
              <div className={styles.codeLine}><span className={styles.cv}>model_kwargs</span><span className={styles.ce}>[</span><span className={styles.cs}>&quot;quantization_config&quot;</span><span className={styles.ce}>]</span> <span className={styles.ce}>=</span> <span className={styles.cm}>BitsAndBytesConfig</span><span className={styles.ce}>(</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>load_in_4bit</span><span className={styles.ce}>=</span><span className={styles.ck}>True</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>bnb_4bit_use_double_quant</span><span className={styles.ce}>=</span><span className={styles.ck}>True</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>bnb_4bit_quant_type</span><span className={styles.ce}>=</span><span className={styles.cs}>&quot;nf4&quot;</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>bnb_4bit_compute_dtype</span><span className={styles.ce}>=</span><span className={styles.cv}>model_kwargs</span><span className={styles.ce}>[</span><span className={styles.cs}>&quot;dtype&quot;</span><span className={styles.ce}>]</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>bnb_4bit_quant_storage</span><span className={styles.ce}>=</span><span className={styles.cv}>model_kwargs</span><span className={styles.ce}>[</span><span className={styles.cs}>&quot;dtype&quot;</span><span className={styles.ce}>]</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}><span className={styles.ce}>)</span></div>
              <div className={styles.codeLine}><span className={styles.cv}>model</span> <span className={styles.ce}>=</span> <span className={styles.cm}>AutoModelForImageTextToText</span><span className={styles.ce}>.</span><span className={styles.cm}>from_pretrained</span><span className={styles.ce}>(</span><span className={styles.cv}>model_id</span><span className={styles.ce}>,</span> <span className={styles.ce}>**</span><span className={styles.cv}>model_kwargs</span><span className={styles.ce}>)</span></div>
              <div className={styles.codeLine}><span className={styles.cv}>tokenizer</span> <span className={styles.ce}>=</span> <span className={styles.cm}>AutoTokenizer</span><span className={styles.ce}>.</span><span className={styles.cm}>from_pretrained</span><span className={styles.ce}>(</span><span className={styles.cs}>&quot;google/gemma-4-E2B-it&quot;</span><span className={styles.ce}>)</span></div>
            </div>
          </div>

          <p>
            LoRA設定(<strong>特殊トークンを学習するため<code className={styles.inlineCode}>lm_head</code>と<code className={styles.inlineCode}>embed_tokens</code>の保存を忘れない</strong>点が重要):
          </p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>lora_config.py</span>
              <span className={styles.codeLang}>PYTHON</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.ck}>from</span> <span className={styles.cv}>peft</span> <span className={styles.ck}>import</span> <span className={styles.cm}>LoraConfig</span></div>
              <div className={styles.codeLine}><span className={styles.cv}>peft_config</span> <span className={styles.ce}>=</span> <span className={styles.cm}>LoraConfig</span><span className={styles.ce}>(</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>lora_alpha</span><span className={styles.ce}>=</span><span className={styles.cm}>16</span><span className={styles.ce}>,</span> <span className={styles.cv}>lora_dropout</span><span className={styles.ce}>=</span><span className={styles.cm}>0.05</span><span className={styles.ce}>,</span> <span className={styles.cv}>r</span><span className={styles.ce}>=</span><span className={styles.cm}>16</span><span className={styles.ce}>,</span> <span className={styles.cv}>bias</span><span className={styles.ce}>=</span><span className={styles.cs}>&quot;none&quot;</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>target_modules</span><span className={styles.ce}>=</span><span className={styles.cs}>&quot;all-linear&quot;</span><span className={styles.ce}>,</span> <span className={styles.cv}>task_type</span><span className={styles.ce}>=</span><span className={styles.cs}>&quot;CAUSAL_LM&quot;</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>modules_to_save</span><span className={styles.ce}>=</span><span className={styles.ce}>[</span><span className={styles.cs}>&quot;lm_head&quot;</span><span className={styles.ce}>,</span> <span className={styles.cs}>&quot;embed_tokens&quot;</span><span className={styles.ce}>]</span><span className={styles.ce}>,</span> <span className={styles.cv}>ensure_weight_tying</span><span className={styles.ce}>=</span><span className={styles.ck}>True</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}><span className={styles.ce}>)</span></div>
            </div>
          </div>

          <p>学習設定と実行:</p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>train.py</span>
              <span className={styles.codeLang}>PYTHON</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.ck}>from</span> <span className={styles.cv}>trl</span> <span className={styles.ck}>import</span> <span className={styles.cm}>SFTConfig</span><span className={styles.ce}>,</span> <span className={styles.cm}>SFTTrainer</span></div>
              <div className={styles.codeLine}><span className={styles.cv}>args</span> <span className={styles.ce}>=</span> <span className={styles.cm}>SFTConfig</span><span className={styles.ce}>(</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>output_dir</span><span className={styles.ce}>=</span><span className={styles.cs}>&quot;gemma-text-to-sql&quot;</span><span className={styles.ce}>,</span> <span className={styles.cv}>max_length</span><span className={styles.ce}>=</span><span className={styles.cm}>512</span><span className={styles.ce}>,</span> <span className={styles.cv}>num_train_epochs</span><span className={styles.ce}>=</span><span className={styles.cm}>3</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>per_device_train_batch_size</span><span className={styles.ce}>=</span><span className={styles.cm}>1</span><span className={styles.ce}>,</span> <span className={styles.cv}>optim</span><span className={styles.ce}>=</span><span className={styles.cs}>&quot;adamw_torch_fused&quot;</span><span className={styles.ce}>,</span> <span className={styles.cv}>learning_rate</span><span className={styles.ce}>=</span><span className={styles.cm}>5e-5</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>max_grad_norm</span><span className={styles.ce}>=</span><span className={styles.cm}>0.3</span><span className={styles.ce}>,</span> <span className={styles.cv}>lr_scheduler_type</span><span className={styles.ce}>=</span><span className={styles.cs}>&quot;constant&quot;</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>dataset_kwargs</span><span className={styles.ce}>=</span><span className={styles.ce}>&#123;</span><span className={styles.cs}>&quot;add_special_tokens&quot;</span><span className={styles.ce}>:</span> <span className={styles.ck}>False</span><span className={styles.ce}>,</span> <span className={styles.cs}>&quot;append_concat_token&quot;</span><span className={styles.ce}>:</span> <span className={styles.ck}>True</span><span className={styles.ce}>&#125;</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}><span className={styles.ce}>)</span></div>
              <div className={styles.codeLine}><span className={styles.cv}>trainer</span> <span className={styles.ce}>=</span> <span className={styles.cm}>SFTTrainer</span><span className={styles.ce}>(</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>model</span><span className={styles.ce}>=</span><span className={styles.cv}>model</span><span className={styles.ce}>,</span> <span className={styles.cv}>args</span><span className={styles.ce}>=</span><span className={styles.cv}>args</span><span className={styles.ce}>,</span> <span className={styles.cv}>train_dataset</span><span className={styles.ce}>=</span><span className={styles.cv}>dataset</span><span className={styles.ce}>[</span><span className={styles.cs}>&quot;train&quot;</span><span className={styles.ce}>]</span><span className={styles.ce}>,</span> <span className={styles.cv}>eval_dataset</span><span className={styles.ce}>=</span><span className={styles.cv}>dataset</span><span className={styles.ce}>[</span><span className={styles.cs}>&quot;test&quot;</span><span className={styles.ce}>]</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.cv}>peft_config</span><span className={styles.ce}>=</span><span className={styles.cv}>peft_config</span><span className={styles.ce}>,</span> <span className={styles.cv}>processing_class</span><span className={styles.ce}>=</span><span className={styles.cv}>tokenizer</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}><span className={styles.ce}>)</span></div>
              <div className={styles.codeLine}><span className={styles.cv}>trainer</span><span className={styles.ce}>.</span><span className={styles.cm}>train</span><span className={styles.ce}>(</span><span className={styles.ce}>)</span></div>
            </div>
          </div>

          <p>学習後、サービング(vLLM等)で使いやすいようアダプタをマージする場合:</p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>merge.py</span>
              <span className={styles.codeLang}>PYTHON</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.ck}>from</span> <span className={styles.cv}>peft</span> <span className={styles.ck}>import</span> <span className={styles.cm}>PeftModel</span></div>
              <div className={styles.codeLine}><span className={styles.cv}>model</span> <span className={styles.ce}>=</span> <span className={styles.cm}>AutoModelForImageTextToText</span><span className={styles.ce}>.</span><span className={styles.cm}>from_pretrained</span><span className={styles.ce}>(</span><span className={styles.cv}>model_id</span><span className={styles.ce}>,</span> <span className={styles.cv}>low_cpu_mem_usage</span><span className={styles.ce}>=</span><span className={styles.ck}>True</span><span className={styles.ce}>)</span></div>
              <div className={styles.codeLine}><span className={styles.cv}>peft_model</span> <span className={styles.ce}>=</span> <span className={styles.cm}>PeftModel</span><span className={styles.ce}>.</span><span className={styles.cm}>from_pretrained</span><span className={styles.ce}>(</span><span className={styles.cv}>model</span><span className={styles.ce}>,</span> <span className={styles.cv}>args</span><span className={styles.ce}>.</span><span className={styles.cv}>output_dir</span><span className={styles.ce}>)</span></div>
              <div className={styles.codeLine}><span className={styles.cv}>merged_model</span> <span className={styles.ce}>=</span> <span className={styles.cv}>peft_model</span><span className={styles.ce}>.</span><span className={styles.cm}>merge_and_unload</span><span className={styles.ce}>(</span><span className={styles.ce}>)</span></div>
              <div className={styles.codeLine}><span className={styles.cv}>merged_model</span><span className={styles.ce}>.</span><span className={styles.cm}>save_pretrained</span><span className={styles.ce}>(</span><span className={styles.cs}>&quot;merged_model&quot;</span><span className={styles.ce}>,</span> <span className={styles.cv}>safe_serialization</span><span className={styles.ce}>=</span><span className={styles.ck}>True</span><span className={styles.ce}>,</span> <span className={styles.cv}>max_shard_size</span><span className={styles.ce}>=</span><span className={styles.cs}>&quot;2GB&quot;</span><span className={styles.ce}>)</span></div>
            </div>
          </div>

          <div className={styles.callout}>
            <span className={styles.calloutTitle}>実務上の注意点</span>
            <ul style={{ margin: 0 }}>
              <li>
                Ampere以降のGPU(NVIDIA L4/A100など)では Flash Attention を併用すると学習が最大3倍高速化
              </li>
              <li>アダプタのマージには30GB以上のCPUメモリが必要な場合がある</li>
              <li>
                生成AIモデルの評価は「1入力に対し複数の正解がありうる」ため、まずは手動評価(vibe check)から始め、段階的に自動評価パイプラインを整備する
              </li>
            </ul>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/core/huggingface_text_finetune_qlora">
              Fine-Tune Gemma using Hugging Face Transformers and QLoRA
            </Ext>
          </p>
        </section>

        <section className={styles.section} id="local-inference">
          <div className={styles.sectionEyebrow}>08 / Local Inference</div>
          <h2>ローカル推論環境の構築</h2>

          <h3>8.1 主要ツールの比較</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>ツール</th>
                  <th>特徴</th>
                  <th>適したシーン</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ollama</td>
                  <td>
                    <code className={styles.inlineCode}>ollama pull</code>/<code className={styles.inlineCode}>run</code>だけで即実行。GGUFを自動管理しOpenAI互換API(localhost:11434)を提供
                  </td>
                  <td>個人開発・プロトタイピング</td>
                </tr>
                <tr>
                  <td>llama.cpp</td>
                  <td>
                    GGUF量子化モデルをCPU/Metal/CUDAで実行。<code className={styles.inlineCode}>llama-server</code>でOpenAI互換API(/v1)
                  </td>
                  <td>GPUなし環境、Apple Silicon</td>
                </tr>
                <tr>
                  <td>LM Studio</td>
                  <td>GUIベースのチャットUI+ローカルサーバ</td>
                  <td>非エンジニアも含めたチーム共有</td>
                </tr>
                <tr>
                  <td>vLLM / SGLang</td>
                  <td>高スループットなサーバ型推論エンジン</td>
                  <td>本番トラフィックの高並列処理</td>
                </tr>
                <tr>
                  <td>MLX</td>
                  <td>Apple Silicon特化の推論バックエンド</td>
                  <td>Mac上での高効率推論</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/integrations/ollama">
              Run Gemma with Ollama
            </Ext>{" "}
            ／{" "}
            <Ext href="https://ai.google.dev/gemma/docs/integrations/llamacpp">
              Run Gemma with Llama.cpp
            </Ext>
          </p>

          <h3>8.2 Ollamaでのクイックスタート</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>ollama_usage.sh</span>
              <span className={styles.codeLang}>BASH</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.cc}># インストール確認</span></div>
              <div className={styles.codeLine}><span className={styles.ck}>ollama</span> <span className={styles.ch}>--version</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.cc}># Gemma 4 のデフォルト(E4B相当)をpull</span></div>
              <div className={styles.codeLine}><span className={styles.ck}>ollama pull</span> <span className={styles.cv}>gemma4</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.cc}># サイズを指定する場合</span></div>
              <div className={styles.codeLine}><span className={styles.ck}>ollama pull</span> <span className={styles.cv}>gemma4:e2b</span>     <span className={styles.cc}># 最軽量</span></div>
              <div className={styles.codeLine}><span className={styles.ck}>ollama pull</span> <span className={styles.cv}>gemma4:e4b</span></div>
              <div className={styles.codeLine}><span className={styles.ck}>ollama pull</span> <span className={styles.cv}>gemma4:12b</span>     <span className={styles.cc}># Unified</span></div>
              <div className={styles.codeLine}><span className={styles.ck}>ollama pull</span> <span className={styles.cv}>gemma4:26b</span>     <span className={styles.cc}># MoE</span></div>
              <div className={styles.codeLine}><span className={styles.ck}>ollama pull</span> <span className={styles.cv}>gemma4:31b</span>     <span className={styles.cc}># Dense最上位</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.cc}># 対話実行</span></div>
              <div className={styles.codeLine}><span className={styles.ck}>ollama run</span> <span className={styles.cv}>gemma4</span> <span className={styles.cs}>&quot;roses are red&quot;</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.cc}># 画像入力</span></div>
              <div className={styles.codeLine}><span className={styles.ck}>ollama run</span> <span className={styles.cv}>gemma4</span> <span className={styles.cs}>&quot;caption this image /path/to/image.png&quot;</span></div>
            </div>
          </div>

          <p>Web API経由:</p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>ollama_api.sh</span>
              <span className={styles.codeLang}>BASH</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.ck}>curl</span> <span className={styles.cs}>http://localhost:11434/api/generate</span> <span className={styles.ch}>-d</span> <span className={styles.ce}>&#123;</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.ck}>&quot;model&quot;</span><span className={styles.ce}>:</span> <span className={styles.cs}>&quot;gemma4&quot;</span><span className={styles.ce}>,</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.ck}>&quot;prompt&quot;</span><span className={styles.ce}>:</span> <span className={styles.cs}>&quot;roses are red&quot;</span></div>
              <div className={styles.codeLine}><span className={styles.ce}>&#125;</span></div>
            </div>
          </div>

          <h3>8.3 llama.cppでのクイックスタート</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>llamacpp_usage.sh</span>
              <span className={styles.codeLang}>BASH</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.cc}># Hugging Faceから直接ダウンロードして実行</span></div>
              <div className={styles.codeLine}><span className={styles.ck}>llama-cli</span> <span className={styles.ch}>-hf</span> <span className={styles.cs}>ggml-org/gemma-4-E2B-it-GGUF</span> <span className={styles.ch}>--prompt</span> <span className={styles.cs}>&quot;Write a poem about the Kraken.&quot;</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.cc}># システムプロンプト付き</span></div>
              <div className={styles.codeLine}><span className={styles.ck}>llama-cli</span> <span className={styles.ch}>-hf</span> <span className={styles.cs}>ggml-org/gemma-4-E2B-it-GGUF</span> <span className={styles.ch}>-sys</span> <span className={styles.cs}>&quot;You are a helpful assistant.&quot;</span> <span className={styles.ch}>-p</span> <span className={styles.cs}>&quot;Who are you?&quot;</span></div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}><span className={styles.cc}># サーバ起動(OpenAI互換API: http://localhost:8080/v1)</span></div>
              <div className={styles.codeLine}><span className={styles.ck}>llama-server</span> <span className={styles.ch}>-hf</span> <span className={styles.cs}>ggml-org/gemma-4-E2B-it-GGUF</span></div>
            </div>
          </div>

          <p>
            マルチモーダル(画像・音声)を使う場合は、対応する<code className={styles.inlineCode}>mmproj</code>(マルチモーダル射影)ファイルを別途指定する必要があります。
          </p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>llamacpp_multimodal.sh</span>
              <span className={styles.codeLang}>BASH</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.ck}>llama-server</span> <span className={styles.ch}>\</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.ch}>-m</span> <span className={styles.cs}>gemma-4-12b-it-Q4_K_M.gguf</span> <span className={styles.ch}>\</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.ch}>--mmproj</span> <span className={styles.cs}>mmproj-gemma-4-12b.gguf</span> <span className={styles.ch}>\</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.ch}>--ctx-size</span> <span className={styles.cm}>8192</span></div>
            </div>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/integrations/llamacpp">
              Run Gemma with Llama.cpp | Google AI for Developers
            </Ext>{" "}
            ／{" "}
            <Ext href="https://unsloth.ai/docs/models/gemma-4">
              Gemma 4 - How to Run Locally | Unsloth Documentation
            </Ext>
          </p>

          <h3>8.4 デプロイ先決定フロー</h3>
          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart TD
    A["推論をどこで実行する?"] --> B{"完全ローカル/オフライン?"}
    B -->|"手軽さ優先"| Ollama["Ollama"]
    B -->|"細かい制御/GPUなし環境"| Llamacpp["llama.cpp"]
    B -->|"No"| Cloud{"本番トラフィックの規模は?"}
    Cloud -->|"大規模・高並列"| VLLM["vLLM / SGLang on GKE"]
    Cloud -->|"サーバーレス・変動負荷"| CloudRun["Cloud Run(GPU, scale-to-zero)"]
    Cloud -->|"マネージド運用重視"| Vertex["Vertex AI Model Garden"]
    Cloud -->|"Gemini APIと同じI/Fで使いたい"| GeminiAPI["Gemini API経由のGemma"]

    style Ollama fill:#0f2438,stroke:#7c9eff,color:#e8edf7
    style Llamacpp fill:#0f2438,stroke:#7c9eff,color:#e8edf7
    style VLLM fill:#0f2438,stroke:#7c9eff,color:#e8edf7
    style CloudRun fill:#0f2438,stroke:#7c9eff,color:#e8edf7
    style Vertex fill:#0f2438,stroke:#7c9eff,color:#e8edf7
    style GeminiAPI fill:#0f2438,stroke:#7c9eff,color:#e8edf7`}
            />
          </div>
        </section>

        <section className={styles.section} id="production">
          <div className={styles.sectionEyebrow}>09 / Production Deployment</div>
          <h2>本番/クラウドデプロイ</h2>

          <h3>9.1 選択肢の一覧</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>プラットフォーム</th>
                  <th>概要</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gemini API / Google AI Studio</td>
                  <td>
                    Gemma 4をGemini APIと同じSDK/I/Fで利用可能。関数呼び出し・構造化出力・システム指示をモデルレベルでサポート
                  </td>
                </tr>
                <tr>
                  <td>Google Cloud(Model Garden)</td>
                  <td>
                    Vertex AI Model Garden上でGemma 4をテスト・デプロイ。Training Clustersでファインチューニングも可能
                  </td>
                </tr>
                <tr>
                  <td>Cloud Run</td>
                  <td>GPU対応のサーバーレス実行。スケールtoゼロで従量課金</td>
                </tr>
                <tr>
                  <td>GKE</td>
                  <td>コンテナオーケストレーション上でvLLM等を用いた高スループットサービング</td>
                </tr>
                <tr>
                  <td>Cloud TPU</td>
                  <td>MaxText(JAX実装)経由でTPU上に最先端のサービング性能を提供</td>
                </tr>
                <tr>
                  <td>vLLM</td>
                  <td>OpenAI互換APIでThinking/Function Calling/可変画像解像度をフルサポート</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/integrations/google-cloud">
              Deploy Gemma with Google Cloud | Google AI for Developers
            </Ext>{" "}
            ／{" "}
            <Ext href="https://github.com/vllm-project/recipes/blob/main/Google/Gemma4.md">
              recipes/Google/Gemma4.md · vllm-project/recipes
            </Ext>
          </p>

          <h3>9.2 vLLMでのサービング例</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>vllm_serve.sh</span>
              <span className={styles.codeLang}>BASH</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.ck}>vllm serve</span> <span className={styles.cs}>google/gemma-4-31B-it</span> <span className={styles.ch}>\</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.ch}>--tensor-parallel-size</span> <span className={styles.cm}>2</span> <span className={styles.ch}>\</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.ch}>--max-model-len</span> <span className={styles.cm}>16384</span> <span className={styles.ch}>\</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.ch}>--gpu-memory-utilization</span> <span className={styles.cm}>0.90</span> <span className={styles.ch}>\</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.ch}>--enable-auto-tool-choice</span> <span className={styles.ch}>\</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.ch}>--reasoning-parser</span> <span className={styles.cv}>gemma4</span> <span className={styles.ch}>\</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.ch}>--tool-call-parser</span> <span className={styles.cv}>gemma4</span> <span className={styles.ch}>\</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.ch}>--chat-template</span> <span className={styles.cs}>examples/tool_chat_template_gemma4.jinja</span> <span className={styles.ch}>\</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.ch}>--limit-mm-per-prompt</span> <span className={styles.cs}>&#123;&apos;image&apos;: 4, &apos;audio&apos;: 1&#125;</span> <span className={styles.ch}>\</span></div>
              <div className={styles.codeLine}>&nbsp;&nbsp;<span className={styles.ch}>--host</span> <span className={styles.cs}>0.0.0.0</span> <span className={styles.ch}>--port</span> <span className={styles.cm}>8000</span></div>
            </div>
          </div>
          <p>
            <code className={styles.inlineCode}>--reasoning-parser gemma4</code> と <code className={styles.inlineCode}>--tool-call-parser gemma4</code> を指定することで、ThinkingモードとFunction CallingをOpenAI互換API経由で透過的に扱えます。TPU向けにはvLLM TPUを用いた専用イメージも提供されています。
          </p>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://github.com/vllm-project/recipes/blob/main/Google/Gemma4.md">
              vllm-project/recipes: Google/Gemma4.md
            </Ext>
          </p>

          <h3>9.3 アーキテクチャ全体図</h3>
          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart TB
    subgraph Client["クライアント層"]
        WebApp["Webアプリ"]
        Agent["エージェント/ADK"]
    end

    subgraph Serving["サービング層"]
        direction LR
        GeminiAPI["Gemini API"]
        VLLMSrv["vLLM on GKE / Cloud Run"]
        TPU["Cloud TPU(MaxText)"]
    end

    subgraph Safety["安全性フィルタ層"]
        ShieldIn["ShieldGemma(入力フィルタ)"]
        ShieldOut["ShieldGemma(出力フィルタ)"]
    end

    Client --> ShieldIn --> Serving --> ShieldOut --> Client

    style ShieldIn fill:#3a1f1f,stroke:#ff8a7c,color:#e8edf7
    style ShieldOut fill:#3a1f1f,stroke:#ff8a7c,color:#e8edf7`}
            />
          </div>
        </section>

        <section className={styles.section} id="safety">
          <div className={styles.sectionEyebrow}>10 / Safety & Governance</div>
          <h2>安全性・ガバナンスのベストプラクティス</h2>

          <h3>10.1 ShieldGemmaによる入出力フィルタリング</h3>
          <p>
            ShieldGemmaは、生成AIの入出力を事前定義された安全ポリシーに照らして評価する、Gemmaベースの安全性分類器です。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>バージョン</th>
                  <th>ベースモデル</th>
                  <th>パラメータサイズ</th>
                  <th>対象</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ShieldGemma 1</td>
                  <td>Gemma 2</td>
                  <td>2B / 9B / 27B</td>
                  <td>テキスト入出力のコンテンツモデレーション</td>
                </tr>
                <tr>
                  <td>ShieldGemma 2</td>
                  <td>Gemma 3</td>
                  <td>4B</td>
                  <td>画像(合成・自然画像)の安全性評価</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul>
            <li>
              ShieldGemma 2は「VLMの入力フィルタ」または「画像生成システムの出力フィルタ」として使うことが推奨されています。
            </li>
            <li>
              ShieldGemma 1は2B(低レイテンシなオンライン分類向け)〜27B(レイテンシより性能を優先するオフライン用途向け)まで選べます。
            </li>
            <li>
              いずれもオープンウェイトで、独自の安全基準に合わせて追加ファインチューニングが可能です。
            </li>
          </ul>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/responsible/docs/safeguards/shieldgemma">
              ShieldGemma | Responsible Generative AI Toolkit
            </Ext>{" "}
            ／{" "}
            <Ext href="https://ai.google.dev/gemma/docs/shieldgemma/model_card_2">
              ShieldGemma 2 model card
            </Ext>
          </p>

          <h3>10.2 Gemma 4本体の安全性評価</h3>
          <p>Gemma 4は、以下のカテゴリについてGeminiと同水準の安全性評価プロセスを経ています。</p>
          <div className={styles.chipRow}>
            <span className={styles.chip}>CSAM関連コンテンツ</span>
            <span className={styles.chip}>危険なコンテンツ</span>
            <span className={styles.chip}>性的に露骨なコンテンツ</span>
            <span className={styles.chip}>ヘイトスピーチ</span>
            <span className={styles.chip}>ハラスメント</span>
          </div>
          <p>
            公式の安全性評価では、Gemma 3/3n世代と比較して全カテゴリで「不当な拒否(over-refusal)を低く抑えながら」安全性が大幅に改善したと報告されています。ただし、これは<strong>モデル単体の傾向</strong>であり、実運用ではアプリケーション固有のコンテンツポリシーに応じてShieldGemma等の追加フィルタを組み合わせることが推奨されます。
          </p>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/core/model_card_4">
              Gemma 4 model card — Ethics and Safety
            </Ext>
          </p>

          <h3>10.3 データフィルタリングとライセンス</h3>
          <ul>
            <li>
              事前学習データにはCSAMフィルタリングおよび個人情報などの機微データの自動フィルタリングが多段階で適用されています。
            </li>
            <li>
              Gemma 4はApache 2.0ライセンス(<Ext href="https://ai.google.dev/gemma/terms">Gemma利用規約</Ext>に準拠)で提供され、商用利用・改変・再配布が可能です。ただし<Ext href="https://ai.google.dev/gemma/prohibited_use_policy">禁止利用ポリシー</Ext>は遵守する必要があります。
            </li>
          </ul>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://ai.google.dev/gemma/docs/core/model_card_4">
              Gemma 4 model card — Model Data
            </Ext>
          </p>
        </section>

        <section className={styles.section} id="checklist">
          <div className={styles.sectionEyebrow}>11 / Pre-launch QA</div>
          <h2>チェックリスト：本番投入前の最終確認</h2>
          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart TD
    C1["モデルサイズは実タスクのベンチマークで検証したか?"] --> C2
    C2["QATチェックポイントを優先的に検討したか?"] --> C3
    C3["Thinkingモードの有効/無効を用途ごとに設計したか?"] --> C4
    C4["マルチターンで思考(thought)を適切に除去/要約しているか?"] --> C5
    C5["Function Callingの実行結果を検証してから実行しているか?"] --> C6
    C6["ShieldGemma等の安全性フィルタを組み込んだか?"] --> C7
    C7["禁止利用ポリシー・ライセンス条件を確認したか?"]

    style C1 fill:#0f2438,stroke:#7c9eff,color:#e8edf7
    style C7 fill:#0f2438,stroke:#7c9eff,color:#e8edf7`}
            />
          </div>
        </section>

        <section className={styles.section} id="summary">
          <div className={styles.sectionEyebrow}>12 / Summary</div>
          <h2>まとめ</h2>
          <p>
            Gemma 4は、Gemma 3世代からアーキテクチャ・制御トークン体系・エージェント機能が刷新された大型アップデートです。実務でGemmaを扱う際の勘所は以下の3点に集約されます。
          </p>
          <div className={styles.gridCards}>
            <div className={styles.card}>
              <h4>1. サイズ選定はハードウェア起点</h4>
              <p>
                E2B/E4Bはエッジ、12B Unifiedは単一GPU/ラップトップでの音声・動画対応、26B A4Bは速度重視のサーバー、31Bは精度最優先のワークステーション/サーバー、という住み分けを踏まえる。
              </p>
            </div>
            <div className={styles.card}>
              <h4>2. 制御トークンとライフサイクルの正確な実装</h4>
              <p>
                特にマルチターンでの思考除去やツール呼び出しの検証は品質・安全性・コストに直結する。
              </p>
            </div>
            <div className={styles.card}>
              <h4>3. QAT起点の量子化 + 安全性フィルタ</h4>
              <p>量子化はQATを起点に検討し、ShieldGemmaと組み合わせて本番投入する。</p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.refs}`} id="references">
          <div className={styles.sectionEyebrow}>13 / References</div>
          <h2>参考文献(すべて2026年7月時点で確認済みの一次情報)</h2>

          <h3>モデル概要・アーキテクチャ</h3>
          <ul>
            <li>
              <Ext href="https://deepmind.google/models/gemma/">
                Gemma — Google DeepMind
              </Ext>
            </li>
            <li>
              <Ext href="https://ai.google.dev/gemma/docs/core">
                Gemma 4 model overview | Google AI for Developers
              </Ext>
            </li>
            <li>
              <Ext href="https://ai.google.dev/gemma/docs/core/model_card_4">
                Gemma 4 model card | Google AI for Developers
              </Ext>
            </li>
            <li>
              <Ext href="https://ai.google.dev/gemma/docs">
                Gemma models overview | Google AI for Developers
              </Ext>
            </li>
            <li>
              <Ext href="https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/">
                Gemma 4: Byte for byte, the most capable open models | Google Developers Blog
              </Ext>
            </li>
          </ul>

          <h3>プロンプト設計・Thinking・Function Calling</h3>
          <ul>
            <li>
              <Ext href="https://ai.google.dev/gemma/docs/core/prompt-formatting-gemma4">
                Gemma 4 Prompt Formatting | Google AI for Developers
              </Ext>
            </li>
            <li>
              <Ext href="https://ai.google.dev/gemma/docs/capabilities/text/function-calling-gemma4">
                Function calling with Gemma 4 | Google AI for Developers
              </Ext>
            </li>
            <li>
              <Ext href="https://www.philschmid.de/gemma-4-gemini-api">
                How to use Gemma 4 with the Gemini API and Google AI Studio
              </Ext>
            </li>
          </ul>

          <h3>推論高速化(MTP)・量子化</h3>
          <ul>
            <li>
              <Ext href="https://ai.google.dev/gemma/docs/mtp/overview">
                Speed-up Gemma 4 with Multi-Token Prediction | Google AI for Developers
              </Ext>
            </li>
            <li>
              <Ext href="https://blog.google/innovation-and-ai/technology/developers-tools/quantization-aware-training-gemma-4/">
                Gemma 4 with quantization-aware training | Google Developers Blog
              </Ext>
            </li>
          </ul>
        </section>

        <footer className={styles.pageFooter}>
          Gemma 4 Best Practices Guide — Built with Next.js &amp; CSS Modules
        </footer>
      </main>
    </div>
  );
}
