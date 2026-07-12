import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "マルチモーダルAI(画像・音声生成)ベストプラクティスガイド 2026 | LLM-Studies",
  description:
    "これから画像・音声生成AIを学ぶ初学者を対象に、再現可能な手順、モデル横断の普遍原則とモデル固有のコツ、安全性と法令遵守を解説するベストプラクティスガイド。",
};

const DIAGRAMS = {
  understandingVsGeneration: `flowchart TD
    classDef purple fill:#241a3d,stroke:#a78bfa,color:#ede9fe,stroke-width:1px
    classDef teal fill:#0f2b28,stroke:#5eead4,color:#ccfbf1,stroke-width:1px
    A["マルチモーダルAI"] --> B["理解系モデル (Understanding)"]
    A --> C["生成系モデル (Generation)"]
    B --> B1["GPT-4o / Gemini 3 / Claude Opus"]
    B1 --> B2["画像・音声・動画を読み取り推論する"]
    C --> C1["画像生成モデル (Diffusion/Transformer系)"]
    C --> C2["音声生成モデル (TTS/音楽生成系)"]
    C1 --> C1a["FLUX.2 / GPT Image 2 / Seedream / Imagen 4"]
    C2 --> C2a["ElevenLabs / Suno / Udio"]
    class A,C,C1,C2,C1a,C2a purple
    class B,B1,B2 teal`,

  commonWorkflow: `flowchart TD
    classDef terminal fill:#0f2b28,stroke:#5eead4,color:#ccfbf1,stroke-width:1px
    classDef decision fill:#351818,stroke:#fca5a5,color:#fee2e2,stroke-width:1px
    classDef process fill:#241a3d,stroke:#a78bfa,color:#ede9fe,stroke-width:1px
    S(["開始:目的を決める"]) --> P["目的の言語化 (用途・サイズ・トーン)"]
    P --> M["モデル選定 (コスト・速度・得意分野)"]
    M --> D["プロンプト設計 (構造化された指示文)"]
    D --> G["生成 (Generate)"]
    G --> R{"品質は要求を満たすか?"}
    R -- "No: 1点だけ変更" --> D
    R -- "Yes" --> F["仕上げ (アップスケール/編集/マスタリング)"]
    F --> W["電子透かし・来歴付与 (C2PA/SynthID)"]
    W --> PUB(["公開・納品"])
    class S,PUB terminal
    class R decision
    class P,M,D,G,F,W process`,

  imageEditing: `flowchart LR
    classDef decision fill:#351818,stroke:#fca5a5,color:#fee2e2,stroke-width:1px
    classDef process fill:#241a3d,stroke:#a78bfa,color:#ede9fe,stroke-width:1px
    O["元画像"] --> Q{"何を変えたいか?"}
    Q -- "一部だけ修正" --> IP["Inpainting (マスク指定)"]
    Q -- "外側に拡張" --> OP["Outpainting (パディング+マスク)"]
    Q -- "構図・ポーズを固定" --> CN["ControlNet (エッジ/深度/ポーズ)"]
    Q -- "画風・キャラを統一" --> LA["LoRA / IP-Adapter"]
    IP --> RES["編集済み画像"]
    OP --> RES
    CN --> RES
    LA --> RES
    class Q decision
    class O,IP,OP,CN,LA,RES process`,

  imageIteration: `flowchart TD
    classDef decision fill:#351818,stroke:#fca5a5,color:#fee2e2,stroke-width:1px
    classDef process fill:#241a3d,stroke:#a78bfa,color:#ede9fe,stroke-width:1px
    A["ラフ案を安価なモデルで複数パターン生成"] --> B["良い構図を1つ選ぶ"]
    B --> C["同じseed/構図を維持しつつプロンプトを微調整"]
    C --> D{"9割方OKか?"}
    D -- "No" --> C
    D -- "Yes" --> E["高品質モデルで本番生成 or Inpaintingで微修正"]
    E --> F["アップスケール (高解像度化)"]
    F --> G["納品"]
    class D decision
    class A,B,C,E,F,G process`,

  ttsSteps: `flowchart TD
    classDef decision fill:#351818,stroke:#fca5a5,color:#fee2e2,stroke-width:1px
    classDef process fill:#241a3d,stroke:#a78bfa,color:#ede9fe,stroke-width:1px
    A["台本・テキストを用意"] --> B["言語に合ったネイティブボイスを選ぶ"]
    B --> C["モデルを選ぶ (品質重視 or 低遅延重視)"]
    C --> D["音声パラメータを調整 (stability/similarity/style/speed)"]
    D --> E["感情タグ・breakタグを追加"]
    E --> F["生成"]
    F --> G{"自然に聞こえるか?"}
    G -- "No" --> D
    G -- "Yes" --> H["後処理 (ノイズ除去・トリミング)"]
    H --> I["納品"]
    class G decision
    class A,B,C,D,E,F,H,I process`,

  musicGeneration: `flowchart TD
    classDef decision fill:#351818,stroke:#fca5a5,color:#fee2e2,stroke-width:1px
    classDef process fill:#241a3d,stroke:#a78bfa,color:#ede9fe,stroke-width:1px
    A["目的を決める (BGM/劇伴/広告/瞑想など)"] --> B["Style欄: ジャンル+雰囲気+楽器+ボーカル方向性"]
    B --> C["Lyrics欄: 構造タグ [Verse][Chorus]等を配置"]
    C --> D["Simple modeで試作"]
    D --> E{"方向性は良いか?"}
    E -- "No" --> B
    E -- "Yes" --> F["Custom modeで本番生成"]
    F --> G["必要に応じてExtend/Remix/編集"]
    G --> H["マスタリング・書き出し"]
    class E decision
    class A,B,C,D,F,G,H process`,

  multimodalIntegration: `flowchart TD
    classDef decision fill:#351818,stroke:#fca5a5,color:#fee2e2,stroke-width:1px
    classDef process fill:#241a3d,stroke:#a78bfa,color:#ede9fe,stroke-width:1px
    A["企画・台本"] --> B["画像生成 (サムネイル/背景/挿絵)"]
    A --> C["音声生成 (ナレーション)"]
    A --> D["音楽生成 (BGM)"]
    B --> E["素材レビュー"]
    C --> E
    D --> E
    E --> F{"各素材はトーンが揃っているか?"}
    F -- "No" --> A
    F -- "Yes" --> G["編集ツールで合成 (動画編集/音声ミックス)"]
    G --> H["電子透かし・開示情報を付与"]
    H --> I["公開"]
    class F decision
    class A,B,C,D,E,G,H,I process`,

  watermarkProvenance: `flowchart LR
    classDef process fill:#241a3d,stroke:#a78bfa,color:#ede9fe,stroke-width:1px
    G["画像・音声を生成"] --> S["不可視透かしを埋め込む (SynthID等)"]
    G --> C["来歴マニフェストを付与 (C2PA Content Credentials)"]
    S --> P["公開・配布"]
    C --> P
    P --> V["検証 (Content Credentials Verify等)"]
    class G,S,C,P,V process`,
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default async function Page() {
  return (
    <div className={styles.pageWrap}>
      <TocObserver />
      <div className={styles.layout}>
        {/* ================= SIDEBAR ================= */}
        <aside className={styles.sidebar}>
          <button className={styles.mobileToggle} id="multimodalNavToggle" type="button">
            <i className="ti ti-menu-2" />
            目次を開く
          </button>
          <div className={styles.brand}>
            マルチモーダルAI ガイド
            <p className={styles.brandSub}>画像・音声生成 / 2026年7月版</p>
          </div>

          <p className={styles.navTitle}>目次</p>
          <nav className={styles.navList} id="multimodalNavList">
            <ul>
              <li>
                <a href="#s1" className={styles.tocLink}>
                  <i className="ti ti-info-circle" />
                  1. はじめに
                </a>
              </li>
              <li>
                <a href="#s2" className={styles.tocLink}>
                  <i className="ti ti-brain" />
                  2. マルチモーダルAIとは
                </a>
              </li>
              <li>
                <a href="#s3" className={styles.tocLink}>
                  <i className="ti ti-route" />
                  3. 全体ワークフロー
                </a>
              </li>
              <li>
                <a href="#s4" className={styles.tocLink}>
                  <i className="ti ti-photo" />
                  4. 画像生成
                </a>
                <ul className={styles.subList}>
                  <li>
                    <a href="#s4-1" className={styles.tocLink}>
                      4.1 プロンプトの基本構造
                    </a>
                  </li>
                  <li>
                    <a href="#s4-2" className={styles.tocLink}>
                      4.2 モデル別プロンプト最適化
                    </a>
                  </li>
                  <li>
                    <a href="#s4-3" className={styles.tocLink}>
                      4.3 ネガティブプロンプト
                    </a>
                  </li>
                  <li>
                    <a href="#s4-4" className={styles.tocLink}>
                      4.4 パラメータ制御
                    </a>
                  </li>
                  <li>
                    <a href="#s4-5" className={styles.tocLink}>
                      4.5 高度な編集技術
                    </a>
                  </li>
                  <li>
                    <a href="#s4-6" className={styles.tocLink}>
                      4.6 反復ワークフロー
                    </a>
                  </li>
                  <li>
                    <a href="#s4-7" className={styles.tocLink}>
                      4.7 モデル比較
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#s5" className={styles.tocLink}>
                  <i className="ti ti-microphone" />
                  5. 音声生成
                </a>
                <ul className={styles.subList}>
                  <li>
                    <a href="#s5-1" className={styles.tocLink}>
                      5.1 TTSの基本ステップ
                    </a>
                  </li>
                  <li>
                    <a href="#s5-2" className={styles.tocLink}>
                      5.2 音声パラメータ調整
                    </a>
                  </li>
                  <li>
                    <a href="#s5-3" className={styles.tocLink}>
                      5.3 感情表現とタグ制御
                    </a>
                  </li>
                  <li>
                    <a href="#s5-4" className={styles.tocLink}>
                      5.4 発音制御
                    </a>
                  </li>
                  <li>
                    <a href="#s5-5" className={styles.tocLink}>
                      5.5 音楽生成
                    </a>
                  </li>
                  <li>
                    <a href="#s5-6" className={styles.tocLink}>
                      5.6 ボイスクローニングと倫理
                    </a>
                  </li>
                  <li>
                    <a href="#s5-7" className={styles.tocLink}>
                      5.7 音声ツール比較
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#s6" className={styles.tocLink}>
                  <i className="ti ti-git-merge" />
                  6. マルチモーダル統合
                </a>
              </li>
              <li>
                <a href="#s7" className={styles.tocLink}>
                  <i className="ti ti-list-search" />
                  7. 品質管理・レビュー
                </a>
              </li>
              <li>
                <a href="#s8" className={styles.tocLink}>
                  <i className="ti ti-shield-check" />
                  8. 倫理・法律・安全性
                </a>
                <ul className={styles.subList}>
                  <li>
                    <a href="#s8-1" className={styles.tocLink}>
                      8.1 著作権
                    </a>
                  </li>
                  <li>
                    <a href="#s8-2" className={styles.tocLink}>
                      8.2 電子透かしと来歴
                    </a>
                  </li>
                  <li>
                    <a href="#s8-3" className={styles.tocLink}>
                      8.3 開示義務
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#s9" className={styles.tocLink}>
                  <i className="ti ti-checklist" />
                  9. チェックリスト
                </a>
              </li>
              <li>
                <a href="#s10" className={styles.tocLink}>
                  <i className="ti ti-books" />
                  10. 参考文献
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className={styles.content}>
          <div className={styles.docHeader}>
            <h1>マルチモーダルAI(画像・音声生成)ベストプラクティスガイド</h1>
            <p className={styles.docSub}>
              初学者向け・ステップバイステップ解説 / Multimodal AI (Image &amp; Audio Generation)
              Best Practices Guide
            </p>
            <p className={styles.docMeta}>最終更新: 2026年7月</p>
          </div>

          <hr className={styles.divider} />

          {/* Section 1 */}
          <section id="s1" className={`${styles.chapter} chapter`}>
            <h2>
              <i className="ti ti-info-circle" />
              1. はじめに
            </h2>
            <p>
              生成AI (Generative AI)
              は、2023年頃までの「テキスト生成中心」の時代から、画像・音声・動画を統合的に扱う「マルチモーダル
              (Multimodal)」の時代へと移行しました。2026年現在、画像生成では GPT Image 2、Nano
              Banana Pro (Gemini系)、FLUX.2、Seedream 4.5/5、Midjourney v7
              などが実務レベルの品質に到達し、音声生成では ElevenLabs、Suno、Udio
              といったツールがナレーション・音楽制作の現場で標準的に使われるようになっています。
            </p>
            <p>
              本ガイドは、これから画像・音声生成AIを学ぶ初学者を対象に、以下の3点を重視して解説します。
            </p>
            <ul className={styles.plainList}>
              <li>
                <strong>再現可能な手順</strong>:
                「なんとなく上手くいった」ではなく、次も同じ品質を出せる手順を示す
              </li>
              <li>
                <strong>モデル横断の普遍原則 + モデル固有のコツ</strong>: プロンプト設計の共通原則と、主要ツールごとの違いを分けて説明
              </li>
              <li>
                <strong>安全性と法令遵守</strong>:
                著作権・電子透かし・開示義務など、2026年時点で実務上避けて通れない論点を含める
              </li>
            </ul>
            <p>
              なお、本ガイドは動画生成 (Sora, Veo, Kling等)
              を主題としませんが、画像生成・音声生成の技術は動画パイプラインの基礎にもなるため、随所で関連に触れます。
            </p>
          </section>

          <hr className={styles.divider} />

          {/* Section 2 */}
          <section id="s2" className={`${styles.chapter} chapter`}>
            <h2>
              <i className="ti ti-brain" />
              2. マルチモーダルAIとは
            </h2>
            <p>
              マルチモーダルAI (Multimodal AI)
              とは、テキスト・画像・音声・動画といった複数の「モダリティ (modality,
              データ種別)」を単一のモデルまたはパイプラインで処理・生成できるAIシステムを指します。大きく分けて2つの潮流があります。
            </p>

            <h3 id="s2-1">
              2.1 ネイティブ・マルチモーダル基盤モデル (Native Multimodal Foundation Models)
            </h3>
            <p>
              GPT-4o
              のように、画像・音声・テキストを最初から単一のアーキテクチャで学習し、モダリティ変換用の別モデル(アダプタ)を介さずに理解・生成まで行うタイプです。GPT-4oはOpenAIの主力オムニモーダルモデルで、テキスト・画像・音声・動画を統一されたアーキテクチャの中で処理・推論できます。従来モデルと異なり、モダリティ固有のアダプタに頼らずネイティブなマルチモーダル理解を実現し、視覚・言語・音声を横断したシームレスな統合を可能にしています。Google
              の Gemini
              も同様の思想で設計されており、画像とテキストのペアを土台からまとめて学習させることで、グラフや地図の解釈のような精密な空間推論を要するタスクに強みを持ちます。
            </p>
            <p>
              2026年の評価軸は「画像を理解できるか」という単純な指標では差がつかなくなっており、MMMU-Proのような主要な画像理解ベンチマークは飽和状態に達し、GPT-5.5・Gemini
              3・Claude Opus 4.7・Qwen 3.5
              Omniがいずれも81〜83%前後に収束しています。そのため実務上は、動画理解ではGemini
              3、長文書のOCRではClaude、グラフ・図表の読解ではGPT-5.5が優位という形で、モデルごとの得意領域で使い分けるのが現実的です。
            </p>

            <h3 id="s2-2">2.2 生成特化モデル (Generation-Specialized Models)</h3>
            <p>
              一方、画像・音声そのものを「生成」するタスクは、拡散モデル (Diffusion Model)
              や専用の音声合成モデルなど、理解モデルとは別系統のアーキテクチャが主流です。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.understandingVsGeneration} />
            </div>

            <p>
              本ガイドが扱うのは主に <strong>C. 生成系モデル</strong> の実践的な使い方です。
            </p>
          </section>

          <hr className={styles.divider} />

          {/* Section 3 */}
          <section id="s3" className={`${styles.chapter} chapter`}>
            <h2>
              <i className="ti ti-route" />
              3. 全体ワークフロー(Common Workflow)
            </h2>
            <p>
              画像でも音声でも、良い結果を安定して得るための基本サイクルは共通しています。「思いついたまま1回だけ生成する」のではなく、以下のような反復プロセスとして捉えることが、初学者が最初に身につけるべき最大のコツです。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.commonWorkflow} />
            </div>

            <p>このサイクルにおける重要な原則は次の3つです。</p>
            <ol className={styles.plainList}>
              <li>
                <strong>
                  安いモデルで試作し、高いモデルで仕上げる (Draft cheap, finish expensive)
                </strong>
                : 構図やアイデアの検討は低コストなモデル(例: Z-Image TurboやFlux 2
                Flash)で行い、方向性が固まった段階で高品質・高コストなモデルに切り替えるという原則は、コストと品質のバランスを取る上で有効です。
              </li>
              <li>
                <strong>一度に1つの変数だけを変える</strong>:
                色、カメラ距離、ポーズ、背景など、変更点を1つに絞って再生成することで、何が結果を変えたのかを把握できます。生成後は小さな単位で反復し、1ラウンドにつき1つの要素(色・カメラ距離・ポーズ・背景など)だけを変えるという進め方が推奨されています。
              </li>
              <li>
                <strong>やり直すより編集する</strong>:
                結果が9割方良ければ、もう一度ガチャを引くよりも画像編集機能で部分修正するほうが安価で効率的です。
              </li>
            </ol>
          </section>

          <hr className={styles.divider} />

          {/* Section 4 */}
          <section id="s4" className={`${styles.chapter} chapter`}>
            <h2>
              <i className="ti ti-photo" />
              4. 画像生成 (Image Generation) のベストプラクティス
            </h2>

            <h3 id="s4-1">4.1 プロンプトの基本構造(6要素アナトミー)</h3>
            <p>
              優れた画像プロンプトは、思いつきの羅列ではなく構造を持っています。高い成果を出すチームは、まず画像の「目的」を明確にし、そこに媒体(medium)・照明(lighting)・構図(framing)・雰囲気(mood)・色調(palette)を重ねていくという共通のプラクティスを持っています。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>要素</th>
                    <th>説明</th>
                    <th>記入例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Subject(主題)</td>
                    <td>画像の中心となる被写体</td>
                    <td>オレンジ色の猫</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Context / Use case(用途・文脈)</td>
                    <td>何のための画像か</td>
                    <td>ECサイトの商品ページ用ヒーロー画像</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Medium(媒体・技法)</td>
                    <td>写真・イラスト・3DCG等</td>
                    <td>実写風写真、水彩画、ベクターイラスト</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>Lighting(照明)</td>
                    <td>光源・時間帯・質感</td>
                    <td>柔らかい窓光、シネマティックなリムライト</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>Framing / Composition(構図)</td>
                    <td>アングル・距離・比率</td>
                    <td>ワイドショット、俯瞰、16:9</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>Mood &amp; Palette(雰囲気・配色)</td>
                    <td>感情・トーン・色調</td>
                    <td>ノスタルジック、パステルカラー</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              この6要素をそれぞれ短いフレーズとして書き出し、目的を1行で述べたうえで4〜6個の高シグナルな詳細を追加するという組み立て方が、多くのモデルで安定した結果を生みます。
            </p>
            <p>
              写真的なリアリズムを狙う場合は、カメラ用語を積極的に使うのがコツです。レンズプロファイル(35mmレンズ、85mmポートレート単焦点など)を明示し、肌のキメや埃の粒子といった表面のディテール、光の自然な散乱を描写することで、被写界深度や自然な陰影を再現しやすくなります。具体的には「85mmレンズ、f/1.8、特定のフィルムストック、シネマティックなリムライト」のように、レンズ・絞り・フィルム・照明を具体的に指定する手法が写真的リアリズムの鍵とされています。
            </p>

            <div className={styles.callout}>
              <i className="ti ti-bulb" />
              <p>
                <span className={styles.calloutTitle}>初学者向けTip:</span>
                「photorealistic」「ultra-realistic」のような抽象的なバズワードだけに頼ると、AIらしいのっぺりした質感(いわゆる&quot;plastic&quot;な仕上がり)になりがちです。抽象的な流行語ではなく、質感を伴う具体的な物理的要素を描写することが、写真的リアリズムを実現するコツです。
              </p>
            </div>

            <h3 id="s4-2">4.2 モデル別プロンプト最適化</h3>
            <p>
              2026年の画像生成は「1つのプロンプト構文がすべてのモデルで通用する」わけではありません。ChatGPT(GPT
              Image系)は段落形式かつ複数ターンでの編集に強く、Midjourney
              v7は参照画像を伴う短く高シグナルなフレーズを好み、Stable Diffusion
              3.5は構造化された重み付きキーワードで力を発揮し、Ideogramはタイポグラフィ(文字表現)に強いという傾向があります。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>モデル</th>
                    <th>プロンプトの傾向</th>
                    <th>得意分野</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>GPT Image 2(ChatGPT)</td>
                    <td>会話的・物語的な文章。空間関係の明示に強い</td>
                    <td>
                      複雑な指示の忠実な再現、テキストレンダリング、反復編集。バックエンドのLLMによる会話的言語の解釈に長け、正確なテキスト表現と複雑なシーン構成に強みがあります。
                    </td>
                  </tr>
                  <tr>
                    <td>Midjourney v7</td>
                    <td>
                      短く高シグナルなキーワード句 + パラメータ(<code>--ar</code>,{" "}
                      <code>--stylize</code>)
                    </td>
                    <td>
                      芸術的な構図・美的センス。写真的な用語による具体的な照明・カメラ制約の指定に優れて反応し、
                      <code>--ar 16:9</code>のようなアスペクト比指定や<code>--stylize 250</code>
                      のようなスタイル強度指定に対応します。
                    </td>
                  </tr>
                  <tr>
                    <td>FLUX.2 / FLUX Pro</td>
                    <td>技術寄り・カメラ物理特性の明示</td>
                    <td>写実性、色精度、オープンウェイトでの自己ホスト</td>
                  </tr>
                  <tr>
                    <td>Seedream 4.5/5(ByteDance)</td>
                    <td>短く簡潔なプロンプト</td>
                    <td>4K出力、複数画像の合成、文字表現、商品撮影</td>
                  </tr>
                  <tr>
                    <td>Ideogram</td>
                    <td>表示したい文字列を明示</td>
                    <td>ポスター・パッケージ等、画像内テキストの正確な表示</td>
                  </tr>
                  <tr>
                    <td>Stable Diffusion 3.5</td>
                    <td>構造化・重み付きキーワード(オープンソース)</td>
                    <td>ローカル実行、カスタマイズ、ControlNet/LoRAとの併用</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 id="s4-3">4.3 ネガティブプロンプト (Negative Prompt)</h3>
            <p>
              ネガティブプロンプトは「生成してほしくない要素」を明示する手法で、Stable
              Diffusion系や一部のモデルで利用できます。写実性のための代表的なネガティブプロンプトの例として、「ぼやけ・歪んだ手・余分な手足・低解像度・平坦な照明・透かし・署名・漫画調・3Dレンダリング」といった要素を除外する指定が使われます。
            </p>
            <p>
              ただし使いすぎには注意が必要です。Flux・Midjourney・Veo・Imagenを横断したテストでは、ネガティブプロンプトは3〜5個程度の具体的な語句で最も効果的に機能し、5個を超えると過剰な制約がかかって無機質な出力になったり、逆に除外したいはずの特徴が強調されてしまう現象が確認されています。
            </p>

            <h3 id="s4-4">4.4 パラメータ制御</h3>
            <p>プロンプト本文以外にも、生成品質を左右する技術パラメータがあります。</p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>パラメータ</th>
                    <th>役割</th>
                    <th>実務上のポイント</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CFG Scale</td>
                    <td>プロンプトへの忠実度を制御</td>
                    <td>高すぎると不自然に、低すぎると指示を無視した結果になりやすい</td>
                  </tr>
                  <tr>
                    <td>Seed</td>
                    <td>乱数の初期値。同じseedなら再現性が高い</td>
                    <td>気に入った構図のseedを固定し、プロンプトだけを微調整すると効率的</td>
                  </tr>
                  <tr>
                    <td>Aspect Ratio(アスペクト比)</td>
                    <td>出力の縦横比</td>
                    <td>
                      生成前にアスペクト比(正方形、16:9、4:5など)を決めておくことが推奨されます。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 id="s4-5">4.5 高度な編集技術</h3>
            <p>
              プロンプトだけでは制御しきれない構図・一貫性を扱うために、以下の技術が実務で使われます。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>技術</th>
                    <th>概要</th>
                    <th>主な用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ControlNet</td>
                    <td>
                      エッジ・深度・ポーズなど「構造ガイド画像」を条件として生成を誘導する技術。外部条件マップを用いて拡散モデルの生成を制御します。
                    </td>
                    <td>ポーズ指定、レイアウト固定、線画からの着色</td>
                  </tr>
                  <tr>
                    <td>LoRA (Low-Rank Adaptation)</td>
                    <td>
                      軽量なアダプタをベースモデルに追加し、特定のスタイル・キャラクターを再現する
                    </td>
                    <td>
                      画風の再現、高速サンプリング。LoRAアダプタを読み込んで融合することで、少ないステップ数での高速サンプリングを実現できます。
                    </td>
                  </tr>
                  <tr>
                    <td>Inpainting(部分修正)</td>
                    <td>
                      マスクで指定した領域だけを再生成する。高いdenoising
                      strength(ノイズ除去強度)で再生成しても全体の一貫性を保てるのが利点です。
                    </td>
                    <td>顔の修正、服装の変更、不要物の除去</td>
                  </tr>
                  <tr>
                    <td>Outpainting(画像拡張)</td>
                    <td>
                      画像の外側を推測して描き足し、キャンバスを拡張する。縦長画像からのワイド化やパノラマ合成に特に有効です。
                    </td>
                    <td>アスペクト比変更、シーン拡張、バナー化</td>
                  </tr>
                  <tr>
                    <td>IP-Adapter</td>
                    <td>参照画像からスタイル・構図を転送する</td>
                    <td>一貫したキャラクター/ブランドイメージの維持</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.imageEditing} />
            </div>

            <p>
              初学者はまず ComfyUI や各種WebUIの<strong>テンプレート</strong>
              から始めるのが近道です。初心者はまずシンプルなText-to-ImageやImg2Img、Inpaint、Outpaint、LoRAのテンプレートから始めるのが良く、本番運用ではControlNet・IPAdapter・アップスケール・動画生成を組み合わせたより大規模なワークフローが使われます。
            </p>

            <h3 id="s4-6">4.6 反復ワークフロー(実践フロー)</h3>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.imageIteration} />
            </div>

            <h3 id="s4-7">4.7 主要画像生成モデル比較(2026年7月時点)</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>モデル</th>
                    <th>提供元</th>
                    <th>得意分野</th>
                    <th>特徴</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>GPT Image 2</td>
                    <td>OpenAI</td>
                    <td>世界知識に基づく複雑な指示理解、文字表現</td>
                    <td>
                      「光合成を説明する図解を1960年代の教科書風に」のような、内容そのものを推論する必要があるプロンプトでも一貫性のある結果を出せる。生成は他の拡散系モデルよりやや低速・高コスト。
                    </td>
                  </tr>
                  <tr>
                    <td>Nano Banana Pro(Gemini系)</td>
                    <td>Google</td>
                    <td>編集の一貫性、キャラクター同一性維持、物理的に正確な質感</td>
                    <td>
                      「この部分だけ変えて」という自然言語での編集要求に強く、レイアウト制御と長文の可読なテキスト生成、スタジオ品質の一貫性を提供する。
                    </td>
                  </tr>
                  <tr>
                    <td>FLUX.2(Black Forest Labs)</td>
                    <td>Black Forest Labs</td>
                    <td>写実性、カメラ物理特性の再現、オープンウェイト</td>
                    <td>
                      被写界深度・レンズ歪み・色収差・フィルムグレインといった光学的効果をシミュレーションではなく光学的精度で再現する。
                    </td>
                  </tr>
                  <tr>
                    <td>Seedream 4.5/5(ByteDance)</td>
                    <td>ByteDance</td>
                    <td>文字表現、4K出力、商品撮影</td>
                    <td>
                      ほぼ全モデルの中で最も文字を正確にレンダリングでき、ネイティブ4K出力と商品・商業写真的な仕上がりに強い。
                    </td>
                  </tr>
                  <tr>
                    <td>Midjourney v7</td>
                    <td>Midjourney</td>
                    <td>芸術的な美的センス、コンセプトアート</td>
                    <td>
                      画像の「意図的に見える」構成センスにおいて他の追随を許さない。ただし画像内テキストの精度は弱点。
                    </td>
                  </tr>
                  <tr>
                    <td>Ideogram 3</td>
                    <td>Ideogram</td>
                    <td>タイポグラフィ・読める文字</td>
                    <td>ポスターや商品パッケージなど、文字を正確に表示したい用途に強い</td>
                  </tr>
                  <tr>
                    <td>Adobe Firefly</td>
                    <td>Adobe</td>
                    <td>商用利用の法的安全性</td>
                    <td>
                      ライセンス済みデータで学習されており、著作権面での安全性を重視する商用案件向き
                    </td>
                  </tr>
                  <tr>
                    <td>Stable Diffusion 3.5</td>
                    <td>Stability AI</td>
                    <td>オープンソース、自己ホスト、カスタマイズ性</td>
                    <td>ローカル環境でのControlNet/LoRA併用に最適。無料</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`${styles.callout} ${styles.principle}`}>
              <i className="ti ti-scale" />
              <p>
                <span className={styles.calloutTitle}>モデル選びの実務原則:</span>
                単一のモデルがすべてのカテゴリで勝つことはなく、ランキングは数ヶ月ごとに入れ替わるため、複数モデルを併用する「アグリゲーター」的な運用がプロの現場では主流になっています。
              </p>
            </div>
          </section>

          <hr className={styles.divider} />

          {/* Section 5 */}
          <section id="s5" className={`${styles.chapter} chapter`}>
            <h2>
              <i className="ti ti-microphone" />
              5. 音声生成 (Audio Generation) のベストプラクティス
            </h2>
            <p>
              音声生成は大きく「音声合成 (Text-to-Speech / TTS)・音声クローニング」と「音楽生成
              (Music Generation)」の2系統に分かれます。
            </p>

            <h3 id="s5-1">5.1 TTS (Text-to-Speech) の基本ステップ</h3>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.ttsSteps} />
            </div>
            <p>
              言語適性は非常に重要です。特定の言語で音声を生成する際は、その言語をネイティブに話すVoice
              Libraryの音声を使うか、正しいアクセントでその言語を話す音声をクローニングするのが最も良い結果につながります。英語ネイティブの音声でフランス語を生成すると、フランス語の内容が英語なまりで出力される可能性があります。
            </p>

            <h3 id="s5-2">5.2 音声パラメータの調整(ElevenLabsを例に)</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>パラメータ</th>
                    <th>役割</th>
                    <th>推奨レンジと注意点</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Stability(安定性)</td>
                    <td>声の一貫性とランダム性の度合い</td>
                    <td>
                      長文のナレーションでは単調さを避けるため35〜40%程度を維持しつつ、不安定化を防ぐため30%を下回らないようにするのが目安です。
                    </td>
                  </tr>
                  <tr>
                    <td>Similarity(類似度)</td>
                    <td>元の声への忠実度・明瞭さ</td>
                    <td>
                      75〜80%程度以下に保つのが目安で、それ以上に上げるとアーティファクト(音の歪み)が生じやすくなります。
                    </td>
                  </tr>
                  <tr>
                    <td>Style(スタイル強調)</td>
                    <td>表現力・感情の強さ</td>
                    <td>
                      値を低くすると生成が速く、高くするとドラマチックな表現が加わります。多くのナレーションでは10〜50%程度が扱いやすい範囲です。
                    </td>
                  </tr>
                  <tr>
                    <td>Speed(速度)</td>
                    <td>話速の調整</td>
                    <td>
                      デフォルトは1.0で、0.7〜1.2の範囲で調整可能。極端な値は品質低下を招く場合があります。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.callout}>
              <i className="ti ti-bulb" />
              <p>
                <span className={styles.calloutTitle}>初学者向けTip:</span>
                各設定は「固定値で毎回同じ結果になる」わけではありません。AIは非決定的であり、スライダーの値は同じ結果を保証するものではなく、生成ごとのランダム性の幅を決める役割に近いものです。
              </p>
            </div>

            <h3 id="s5-3">5.3 感情表現とタグ制御</h3>
            <p>
              自然な感情表現を得るには、テキスト自体に文脈を持たせる方法とタグを使う方法があります。物語的な文脈やセリフのタグを通じて感情を伝えることで、AIがどのようなトーン・感情を再現すべきか理解しやすくなります。明示的なダイアログタグは、文脈だけに頼るよりも予測可能な結果を生みますが、モデルは感情の指示語そのものも読み上げてしまうことがあるため、不要な場合は後処理で除去します。
            </p>
            <p>
              タグはキャラクターの性格に合わせることが重要です。タグは声のキャラクターや学習データに合わせるべきで、真面目でプロフェッショナルな声には
              <code>[giggles]</code>(くすくす笑い)や<code>[mischievously]</code>
              (いたずらっぽく)のような遊び心のあるタグはうまく機能しない場合があります。
            </p>
            <p>
              間(ま)の制御にも注意が必要です。breakタグを使いすぎると不安定化を招き、AIが早口になったり余計なノイズが混入したりすることがあります。短い間の代替としてダッシュ(-
              や
              —)、ためらいを表す間の代替として省略記号(…)を使う方法もありますが、一貫性はbreakタグほど高くありません。
            </p>

            <h3 id="s5-4">5.4 発音制御(音声記号)</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>方式</th>
                    <th>概要</th>
                    <th>使い所</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>IPA(国際音声記号)</td>
                    <td>
                      最新モデルはXMLタグを使わずスラッシュで囲んだIPA記号をテキスト内に直接記述することで、単語・フレーズの発音を精密に制御できます。
                    </td>
                    <td>多言語対応、精密な発音指定</td>
                  </tr>
                  <tr>
                    <td>CMU Arpabet</td>
                    <td>英語の音声記号による発音辞書を用いる方式。</td>
                    <td>英語の発音矯正</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 id="s5-5">5.5 音楽生成 (Music Generation) のベストプラクティス</h3>
            <p>
              Suno・Udio
              といったツールでは、テキストプロンプトから完結した楽曲を生成できます。プロンプトはジャンル・雰囲気(mood)・楽器編成・ボーカルの4要素で構成され、4〜7個程度の記述語が最適なバランスとされています。少なすぎると平凡な結果に、多すぎるとAIが混乱します。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.musicGeneration} />
            </div>

            <p>
              <strong>Style欄の作り方</strong>: 具体例として「lo-fi hip hop, melancholic, dusty
              vinyl texture, soft piano, muted trumpet, gentle rain ambience, 75 BPM, no
              vocals」のように、ジャンル・感情・質感・楽器・BPM(テンポ)・ボーカル有無を明示する構成が効果的です。
            </p>
            <p>
              <strong>構造タグ(メタタグ)</strong>: Sunoは<code>[Intro]</code> <code>[Verse 1]</code>{" "}
              <code>[Pre-Chorus]</code> <code>[Chorus]</code> <code>[Bridge]</code>{" "}
              <code>[Outro]</code>
              のような標準的な曲構成タグを認識し、これを歌詞欄に入れることで自動的にアレンジが調整されます。
            </p>

            <p>
              <strong>細かい実務上のコツ</strong>:
            </p>
            <ul className={styles.plainList}>
              <li>
                「instrumental(ボーカルなし)」を指定したい場合は、タグの最後尾に配置しないとボーカルが生成されてしまう確率が上がります。
              </li>
              <li>
                コーラス(サビ)の行数が多すぎるとメロディが平板になりやすいため、2〜3行程度に絞ると強いフックが生まれやすくなります。また、最も伝えたい歌詞は各セクションの最初の行に置くのが効果的です。
              </li>
              <li>
                ボーカルの感情演出をしたい場合は、<code>(whispered)</code> <code>(belted)</code>
                のようなボーカルキューを、該当セクションの直前に単独の行として配置します。インラインで歌詞に埋め込むと無視されやすくなります。
              </li>
              <li>
                著作権保護のため、実在アーティスト名を直接プロンプトに書くことはできません。代わりに、そのアーティストに近い音楽性を表す一般的なスタイル記述語(ジャンル・年代・質感など)を使うのが一般的な回避策です。
              </li>
            </ul>

            <p>
              <strong>Suno と Udio の使い分け</strong>:
              Sunoはボーカルの表現力(息づかいや感情の&quot;揺れ&quot;)の再現に強く、SNS向けのすぐ使える音源作りに向く一方、Udioは楽器の分離感が高くミックスが専門的で、さらなる編集を前提とした高品質素材を必要とする制作者に向いています。
            </p>

            <h3 id="s5-6">5.6 ボイスクローニングと倫理</h3>
            <p>
              音声クローンは強力な技術である一方、なりすまし・詐欺に悪用されるリスクを伴います。実務上は以下を徹底してください。
            </p>
            <ul className={styles.plainList}>
              <li>
                クローンする音声の<strong>本人からの明示的な同意</strong>
                を得る(自分の声、または権利者が許諾した声のみを使用する)
              </li>
              <li>実在の公人・有名人の声を無断で模倣・生成しない</li>
              <li>生成した音声が実在人物の発言であるかのように誤認させる使い方をしない</li>
              <li>プラットフォームの利用規約・年齢制限・地域法(8章で後述の開示義務)を確認する</li>
            </ul>

            <h3 id="s5-7">5.7 主要音声生成ツール比較</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ツール</th>
                    <th>得意分野</th>
                    <th>特徴</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ElevenLabs</td>
                    <td>TTS・音声クローン・多言語ナレーション</td>
                    <td>
                      TTSに加えて音声認識(STT)、Voice Library、Instant/Professional Voice
                      Cloning、リアルタイムエージェント向けの低遅延生成まで、幅広い音声ワークフローをカバーする総合プラットフォームに発展している。
                    </td>
                  </tr>
                  <tr>
                    <td>Suno</td>
                    <td>ボーカル入り楽曲の高速生成</td>
                    <td>
                      感情のこもったボーカル表現に強く、ラジオ品質の44.1kHz出力でSNS投稿にすぐ使える。
                    </td>
                  </tr>
                  <tr>
                    <td>Udio</td>
                    <td>高忠実度のインストゥルメンタル制作</td>
                    <td>48kHz出力で楽器分離が明瞭、さらなる編集を前提とした高品質アセット向き。</td>
                  </tr>
                  <tr>
                    <td>Amazon Polly</td>
                    <td>低コスト・大量処理</td>
                    <td>
                      表現力はElevenLabsに劣るが、大量のテキストを低コストで安定的に処理できる
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <hr className={styles.divider} />

          {/* Section 6 */}
          <section id="s6" className={`${styles.chapter} chapter`}>
            <h2>
              <i className="ti ti-git-merge" />
              6. マルチモーダル統合ワークフロー
            </h2>
            <p>
              画像生成・音声生成は、単体でも役立ちますが、実務では組み合わせて使うことが多くあります。代表例は「ナレーション付きスライド動画」「AIポッドキャストの表紙+音声」「SNS向けショート動画の背景画像+BGM」などです。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.multimodalIntegration} />
            </div>

            <p>
              統合時のポイントは「<strong>トーンの一貫性</strong>
              」です。画像のmood(雰囲気)と音声のstyle(表現)、音楽のmood(ジャンル・感情)がバラバラだと、視聴者に違和感を与えます。プロンプト設計の段階で、共通のキーワード(例:「ノスタルジック」「シネマティック」「ミニマル」)を画像・音声・音楽すべてのプロンプトに含めておくと一貫性を保ちやすくなります。
            </p>
          </section>

          <hr className={styles.divider} />

          {/* Section 7 */}
          <section id="s7" className={`${styles.chapter} chapter`}>
            <h2>
              <i className="ti ti-list-search" />
              7. 品質管理・レビューのベストプラクティス
            </h2>
            <ul className={styles.plainList}>
              <li>
                <strong>プロンプトライブラリを作る</strong>:
                効果的だったプロンプト・使用モデル・添付した参照画像・生成結果を記録しておくことで、時間をかけて再利用可能なブランド視覚システムとして蓄積できます。
              </li>
              <li>
                <strong>ブラインドでの多モデル比較</strong>:
                同じプロンプトを複数モデルに投げて、どのモデルが最も意図を汲み取るかを比較する。この「マルチモデル反復」というワークフローは、どのモデルを使うべきかという勘に頼るのではなく、実際の出力を経験的に比較する方法へと置き換えるものです。
              </li>
              <li>
                <strong>失敗モードに応じたモデル切り替え</strong>:
                文字が崩れる場合はSeedreamやIdeogramへ、顔が生成ごとにブレる場合はNano
                Bananaへ、肌の質感がのっぺりする場合はFLUXやImagenへ切り替えるといった対応関係を持っておく。
              </li>
              <li>
                <strong>最終確認前のチェック項目</strong>:
                解像度・アスペクト比、意図しないテキストの誤表示、手や顔の破綻、著作権上のリスク(実在の人物・ブランド・キャラクターの無断使用がないか)、音声の発音ミス、BGMと音量バランス
              </li>
            </ul>
          </section>

          <hr className={styles.divider} />

          {/* Section 8 */}
          <section id="s8" className={`${styles.chapter} chapter`}>
            <h2>
              <i className="ti ti-shield-check" />
              8. 倫理・法律・安全性 (Ethics, Law &amp; Safety)
            </h2>

            <h3 id="s8-1">8.1 著作権</h3>
            <ul className={styles.plainList}>
              <li>
                実在のアーティスト名・キャラクター名・ブランド名をそのままプロンプトに入れることは、多くのプラットフォームの利用規約違反または著作権侵害リスクになります。Sunoでは実在アーティスト名の入力自体が禁止されており、近い音楽性を表す一般的なスタイル記述に置き換える必要があります。
              </li>
              <li>
                学習データのライセンスが不透明なモデルを商用利用する際はリスクを理解した上で判断する(Adobe
                Fireflyのようにライセンス済みデータのみで学習されたモデルは、商用安全性の観点で選ばれることが多い)。
              </li>
            </ul>

            <h3 id="s8-2">8.2 電子透かしと来歴 (Watermarking &amp; Provenance)</h3>
            <p>
              2026年時点で、AI生成コンテンツには技術的な「透かし」と「来歴情報」を付与するのが業界標準になりつつあります。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>方式</th>
                    <th>概要</th>
                    <th>特性</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>SynthID</td>
                    <td>画素やテキストのトークン選択に不可視の統計的パターンを埋め込む</td>
                    <td>
                      スクリーンショットや再エンコード後もある程度検出可能な「持続性」が最大の強みだが、モデル側の協力が必須で、生成後に事後的に付与することはできない。
                    </td>
                  </tr>
                  <tr>
                    <td>C2PA(コンテンツ来歴マニフェスト)</td>
                    <td>
                      暗号署名付きのメタデータとして「いつ・どのモデルで・誰が生成したか」を記録する
                    </td>
                    <td>
                      ファイル形式を問わず適用できる利点があるが、メタデータが失われると検証情報も失われる(耐性がSynthIDより低い)。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              2026年のベストプラクティスは、同一コンテンツに両方式を併用する「二重実装」です。メタデータが失われてもSynthIDが生き残り、C2PAが改ざん検知可能な検証済みの来歴を提供するという相互補完関係になります。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.watermarkProvenance} />
            </div>

            <p>
              普及状況は急速に進んでいます。C2PA連合には
              Google・Microsoft・Adobe・Meta・OpenAI・Sony・BBC・Amazonなど6,000以上の企業・団体が参加しており、Googleは200億枚以上の画像にSynthIDを付与、TikTokは13億本以上の動画にAI来歴ラベルを付けています。ただし万能ではありません。MicrosoftやEUの報告書も認めている通り、C2PAの来歴情報・透かし・フィンガープリンティングのいずれの手法単独でも、あらゆる偽装や来歴情報の削除を完全に防ぐことはできないのが現実です。
            </p>

            <h3 id="s8-3">8.3 開示義務(法規制)</h3>
            <p>主要国・地域でAI生成コンテンツの開示が法的義務になりつつあります。</p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>規制</th>
                    <th>対象地域</th>
                    <th>概要</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>EU AI Act 第50条</td>
                    <td>EU</td>
                    <td>
                      合成音声・画像・動画・テキストを生成するシステムの提供者は、技術的に可能な場合、出力を機械可読な形式でマーキングし、人工的に生成・改変されたものと検出可能にする義務を負う。この透明性義務は2026年8月2日から適用が開始される。
                    </td>
                  </tr>
                  <tr>
                    <td>California SB 942</td>
                    <td>米国カリフォルニア州</td>
                    <td>
                      2026年1月1日に施行済み。AI生成の画像・音声・動画を提供する製品には開示が義務付けられている。
                    </td>
                  </tr>
                  <tr>
                    <td>プラットフォーム独自ポリシー</td>
                    <td>各SNS</td>
                    <td>
                      TikTokとYouTubeはクリエイターに開示を義務付けC2PAからの自動ラベル付けを行う一方、Metaは「AI
                      Info」タグを使用し、Xは開示を強制せずアップロード時に来歴情報を削除してしまう、というようにプラットフォームごとに対応が大きく異なる。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`${styles.callout} ${styles.principle}`}>
              <i className="ti ti-heart-handshake" />
              <p>
                <span className={styles.calloutTitle}>実務上の指針:</span>
                2026年初頭のEdelman Trust
                Barometerの調査では、消費者の67%が「AI生成コンテンツを見ているときにそれを知りたい」と回答しています。法的義務の有無にかかわらず、先回りした開示は信頼構築の観点でもプラスに働きます。
              </p>
            </div>
          </section>

          <hr className={styles.divider} />

          {/* Section 9 */}
          <section id="s9" className={`${styles.chapter} chapter`}>
            <h2>
              <i className="ti ti-checklist" />
              9. ベストプラクティス チェックリスト
            </h2>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>カテゴリ</th>
                    <th>チェック項目</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.purple}`}>企画</span>
                    </td>
                    <td>目的・用途・トーンを1行で言語化したか</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.purple}`}>画像プロンプト</span>
                    </td>
                    <td>Subject / Medium / Lighting / Framing / Mood / Paletteの6要素を含めたか</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.purple}`}>画像プロンプト</span>
                    </td>
                    <td>使用モデルに合わせた文体(段落 vs 短句)になっているか</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.purple}`}>画像パラメータ</span>
                    </td>
                    <td>アスペクト比・seed・ネガティブプロンプト(3〜5語以内)を設定したか</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.purple}`}>画像編集</span>
                    </td>
                    <td>
                      部分修正はInpainting、拡張はOutpainting、構図固定はControlNetを使い分けたか
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.teal}`}>音声</span>
                    </td>
                    <td>対象言語のネイティブボイスを選んでいるか</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.teal}`}>音声パラメータ</span>
                    </td>
                    <td>Stability / Similarity / Style / Speedを用途に合わせて調整したか</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.teal}`}>音声演出</span>
                    </td>
                    <td>感情タグ・breakタグを声のキャラクターに合わせて過不足なく使ったか</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.teal}`}>音楽</span>
                    </td>
                    <td>ジャンル+雰囲気+楽器+ボーカルの4要素、構造タグを整理したか</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.pink}`}>一貫性</span>
                    </td>
                    <td>画像・音声・音楽のトーン(mood)を統一したか</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.coral}`}>権利処理</span>
                    </td>
                    <td>実在人物・アーティスト・ブランド・キャラクターを無断使用していないか</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.coral}`}>ボイスクローン</span>
                    </td>
                    <td>本人または権利者の同意を得ているか</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.coral}`}>開示</span>
                    </td>
                    <td>電子透かし(SynthID等)・来歴情報(C2PA)を付与したか</td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.coral}`}>開示</span>
                    </td>
                    <td>対象地域の開示義務(EU AI Act, California SB 942等)を満たしているか</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <hr className={styles.divider} />

          {/* Section 10 */}
          <section id="s10" className={`${styles.chapter} chapter`}>
            <h2>
              <i className="ti ti-books" />
              10. 参考文献 (References / URL一覧)
            </h2>

            <div className={styles.refCategory}>
              <h4>
                <i className="ti ti-photo" />
                画像生成 / プロンプトエンジニアリング
              </h4>
              <ul className={styles.refList}>
                <li>
                  <Ext href="https://letsenhance.io/blog/article/ai-text-prompt-guide/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        How to write AI image prompts like a pro [2026]
                      </span>{" "}
                      — letsenhance.io
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://aimlinsights.com/prompts-for-image-generation/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Best Prompts for Image Generation in 2026
                      </span>{" "}
                      — AIML Insights
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://insights.vanikya.ai/prompt-engineering-ai-image-generation-2026/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Prompt Engineering for AI Image Generation: The Complete 2026 Guide
                      </span>
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.improveprompt.ai/learn/how-to-improve-image-generation-prompts">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Mastering Image Generation AI Prompts: The Complete 2026 Guide
                      </span>{" "}
                      — ImprovePrompt
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.cliprise.app/learn/guides/best-practices/ai-prompt-engineering-complete-guide-2026">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        AI Prompt Engineering for Images &amp; Video (2026)
                      </span>{" "}
                      — Cliprise
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.promptitude.io/post/the-complete-guide-to-prompt-engineering-in-2026-trends-tools-and-best-practices">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Prompt Engineering in 2026: Top Trends, Tools, and Techniques
                      </span>{" "}
                      — Promptitude.io
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/gpt-4-v-prompt-engineering">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>Image prompt engineering techniques</span> —
                      Microsoft Foundry / Microsoft Learn
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.lakera.ai/blog/prompt-engineering-guide">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        The Ultimate Guide to Prompt Engineering in 2026
                      </span>{" "}
                      — Lakera
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://orq.ai/blog/what-is-the-best-way-to-think-of-prompt-engineering">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Prompt Engineering in 2026: Tips + Best Practices
                      </span>{" "}
                      — orq.ai
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.ibm.com/think/prompt-engineering">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>The 2026 Guide to Prompt Engineering</span>{" "}
                      — IBM
                    </span>
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCategory}>
              <h4>
                <i className="ti ti-stack-2" />
                画像生成モデル比較
              </h4>
              <ul className={styles.refList}>
                <li>
                  <Ext href="https://morphed.app/blog/best-ai-image-generation-models">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        AI Image Generation Models: The Complete 2026 Guide
                      </span>{" "}
                      — Morphed
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://melies.co/compare/ai-image-models">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>Best AI Image Models 2026</span> — Melies
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.teamday.ai/blog/best-ai-image-models-2026">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>Best AI Image Models 2026</span> —
                      TeamDay.ai
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://medium.com/@social_18794/best-ai-image-generators-in-2026-complete-comparison-guide-e5399ba7eae5">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Best AI Image Generators in 2026: Complete Comparison Guide
                      </span>{" "}
                      — WaveSpeedAI (Medium)
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.xainflow.com/blog/best-ai-image-generators-2026-comparison">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        8 Best AI Image Generators in 2026 (Tested)
                      </span>{" "}
                      — XainFlow
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://llm-stats.com/leaderboards/best-ai-for-image-generation">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Best AI for Image Generation in 2026 — Ranked by Blind Human Votes
                      </span>{" "}
                      — llm-stats.com
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.gradually.ai/en/ai-image-models/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        The 9 Best AI Image Generation Models in 2026
                      </span>
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://diyai.io/ai-tools/image-generation/best-ai-image-tools/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Best AI Image Generators in 2026: Grok Imagine, Midjourney, FLUX and DALL-E
                        Compared
                      </span>{" "}
                      — DIY AI
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://getimg.ai/blog/best-ai-image-generator">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Best AI Image Generators (2026): A Honest Test &amp; Review
                      </span>{" "}
                      — getimg.ai
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://alici.ai/blog/best-ai-image-generators-2026">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Best AI Image Generator 2026: I Tested 10 Tools to Find Out
                      </span>{" "}
                      — Alici.AI
                    </span>
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCategory}>
              <h4>
                <i className="ti ti-wand" />
                画像編集技術(ControlNet / LoRA / Inpainting / Outpainting)
              </h4>
              <ul className={styles.refList}>
                <li>
                  <Ext href="https://ubos.tech/news/high%e2%80%91quality-image-generation-with-huggingface-diffusers-controlnet-lora-and-inpainting-explained/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        High-Quality Image Generation with HuggingFace Diffusers: ControlNet, LoRA,
                        and Inpainting Explained
                      </span>{" "}
                      — UBOS
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.marktechpost.com/2026/02/20/a-coding-guide-to-high-quality-image-generation-control-and-editing-using-huggingface-diffusers/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        A Coding Guide to High-Quality Image Generation, Control, and Editing Using
                        HuggingFace Diffusers
                      </span>{" "}
                      — MarkTechPost
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://stable-diffusion-art.com/inpainting/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>Inpainting: A complete guide</span> — Stable
                      Diffusion Art
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://neuraplus-ai.github.io/blog/how-to-create-ai-art.html">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        How to Create AI Art: Complete Style &amp; Workflow 2026
                      </span>{" "}
                      — NeuraPulse
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.neura.market/directories/stable-diffusion/guides/sdxl-inpainting-workflow-lora-controlnet-ip-adapter">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        SDXL Inpainting Workflow with LoRA, ControlNet and IP-Adapter
                      </span>{" "}
                      — Neura Market
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://openart.ai/workflows/terrier_delectable_76/sdxl-inpainting-workflow-with-lora-controlnet-and-ipadapter/Jhj7nRJwi5c8UuWguhvD">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        SDXL Inpainting Workflow with Lora, ControlNet, and IPAdapter
                      </span>{" "}
                      — OpenArt
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://huggingface.co/blog/OzzyGT/outpainting-controlnet">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>Outpainting I - Controlnet version</span> —
                      Hugging Face Blog (OzzyGT)
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.beam.cloud/blog/top-comfyui-workflows">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Best ComfyUI Workflows: Templates, Examples, and Downloads
                      </span>{" "}
                      — Beam
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://huggingface.co/destitech/controlnet-inpaint-dreamer-sdxl">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        destitech/controlnet-inpaint-dreamer-sdxl
                      </span>{" "}
                      — Hugging Face
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.runcomfy.com/comfyui-workflows/comfyui-image-outpainting-workflow">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>ComfyUI Outpainting Workflow</span> —
                      RunComfy
                    </span>
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCategory}>
              <h4>
                <i className="ti ti-microphone-2" />
                音声生成(TTS / ElevenLabs)
              </h4>
              <ul className={styles.refList}>
                <li>
                  <Ext href="https://elevenlabs.io/docs/eleven-creative/playground/text-to-speech">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>Text to Speech (product guide)</span> —
                      ElevenLabs Documentation
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>Best practices</span> — ElevenLabs
                      Documentation
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://elevenlabs.io/docs/overview/capabilities/text-to-speech">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>Text to Speech</span> — ElevenLabs
                      Documentation
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.webfuse.com/elevenlabs-cheat-sheet">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>ElevenLabs Cheat Sheet (2026)</span> —
                      Webfuse
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://elevenlabs.io/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Free AI Voice Generator &amp; Voice Agents Platform
                      </span>{" "}
                      — ElevenLabs
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://aitoolsdevpro.com/ai-tools/elevenlabs-guide/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>ElevenLabs Complete Guide 2026</span> — AI
                      Tools DevPro
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://elevenlabs.io/docs/eleven-creative/voices/voice-design">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>Voice Design</span> — ElevenLabs
                      Documentation
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://gptprompts.ai/elevenlabs-ai">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        ElevenLabs AI (2026): Voice Generator, Text to Speech &amp; Pricing
                      </span>{" "}
                      — gptprompts.ai
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.fahimai.com/how-to-use-elevenlabs">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>How to Use ElevenLabs in 2026</span> —
                      fahimai.com
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://nerdynav.com/elevenlabs-review/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>ElevenLabs Review 2026</span> — Nerdynav
                    </span>
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCategory}>
              <h4>
                <i className="ti ti-music" />
                音楽生成(Suno / Udio)
              </h4>
              <ul className={styles.refList}>
                <li>
                  <Ext href="https://travisnicholson.medium.com/complete-list-of-prompts-styles-for-suno-ai-music-2024-33ecee85f180">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Complete List of Prompts &amp; Styles for Suno AI Music (2026)
                      </span>{" "}
                      — Medium (Travis Nicholson)
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://musci.io/blog/suno-prompts">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Suno Prompts: 100+ Examples &amp; Complete Guide to Better AI Music (2026)
                      </span>{" "}
                      — Musci.io
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://jackrighteous.com/en-us/blogs/guides-using-suno-ai-music-creation/best-prompts-for-suno-ai-2026-guide-to-better-results">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Best Suno AI Prompts 2026: What Actually Works and Why
                      </span>{" "}
                      — Jack Righteous
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://roo.beehiiv.com/p/complete-list-of-prompts-styles-for-suno-ai-music-2026">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Complete List of Prompts &amp; Styles for Suno AI Music (2026)
                      </span>{" "}
                      — Roo (beehiiv)
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://suno.com/hub/create-music-with-ai">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        The Best Ways To Create Music With AI Using Suno [2026]
                      </span>{" "}
                      — Suno Hub
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.soundverse.ai/blog/article/how-to-write-effective-prompts-for-suno-music-1128">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        How to Write Effective Prompts for Suno Music: A Complete Guide for 2026
                      </span>{" "}
                      — Soundverse
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://suno.bi/en/blog/suno-prompt-tips-guide">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Suno AI Prompt Guide 2026: 10 Tips + Copy-Paste Templates
                      </span>{" "}
                      — SunoMV Blog
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.soundverse.ai/blog/article/how-to-structure-prompts-for-suno-ai-music-generation-0402">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        How to Structure Prompts for Suno AI Music Generation
                      </span>{" "}
                      — Soundverse
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://medium.com/write-your-world/100-best-suno-ai-prompts-list-download-2026-guide-11195b1dc6b5">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        100+ Best Suno AI Prompts List Download (2026 Guide)
                      </span>{" "}
                      — Medium (Seven Sky Writes)
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.songaifarm.com/blog/ai-music-generator-comparison-2026-suno-vs-udio-vs-stable-audio-414">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        AI Music Generator Comparison 2026: Suno vs Udio vs Stable Audio
                      </span>{" "}
                      — Song AI Farm
                    </span>
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCategory}>
              <h4>
                <i className="ti ti-brain" />
                マルチモーダル基盤モデル
              </h4>
              <ul className={styles.refList}>
                <li>
                  <Ext href="https://claude5.com/news/multimodal-ai-2026-vision-documents-real-world-applications">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Multimodal AI 2026: Claude vs GPT-4V vs Gemini Vision Compared
                      </span>{" "}
                      — Claude 5 Hub
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://claude5.com/news/multimodal-ai-face-off-claude-gpt-4v-and-gemini-in-2026">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Multimodal AI Face-Off: Claude, GPT-4V, and Gemini in 2026
                      </span>{" "}
                      — Claude 5 Hub
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://ofox.ai/blog/claude-vs-gpt-vs-gemini-model-comparison-guide-2026/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Claude 4 vs GPT-5 vs Gemini 3: Pick the Right AI Model (2026)
                      </span>
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://arxiv.org/pdf/2510.08759">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Dissecting Embodied Abilities in Multimodal Language Models
                      </span>{" "}
                      — arXiv
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://aimodelbenchmarks.com/blog/2026-02-13-multimodal-ai-models/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Best Multimodal AI Models 2026: Vision, Audio, Video, and Agents
                      </span>
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.digitalapplied.com/blog/multimodal-ai-benchmarks-2026-vision-audio-code">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Multimodal AI Benchmarks 2026: Vision, Audio, Code
                      </span>
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://encord.com/blog/gpt-4o-vs-gemini-vs-claude-3-opus/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        GPT-4o vs. Gemini 1.5 Pro vs. Claude 3 Opus
                      </span>{" "}
                      — Encord
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://callsphere.ai/blog/comparing-foundation-models-gpt4-claude-gemini-llama-mistral">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Comparing Foundation Models: GPT-4, Claude, Gemini, Llama, and Mistral
                      </span>{" "}
                      — CallSphere
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.bentoml.com/blog/multimodal-ai-a-guide-to-open-source-vision-language-models">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        Multimodal AI: The Best Open-Source Vision Language Models in 2026
                      </span>{" "}
                      — BentoML
                    </span>
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCategory}>
              <h4>
                <i className="ti ti-shield-lock" />
                電子透かし・来歴・法規制・倫理
              </h4>
              <ul className={styles.refList}>
                <li>
                  <Ext href="https://www.eyesift.com/faq/ai-watermarking-standards-2026-synthid-c2pa-iptc-iscc-comparison/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        AI Watermarking Standards 2026 — SynthID vs C2PA vs IPTC vs ISCC Comparison
                      </span>{" "}
                      — Eyesift
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.institutepm.com/knowledge-hub/ai-content-provenance-watermarking">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        AI Content Provenance and Watermarking: The PM's Guide to C2PA and SynthID
                      </span>{" "}
                      — Institute PM
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.eyesift.com/faq/ai-watermark-detection-2026-c2pa-content-credentials-google-synthid-meta-watermarking-policy-comparison/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        AI Watermark Detection 2026: C2PA vs SynthID vs Metadata
                      </span>{" "}
                      — Eyesift
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://magiclight.ai/news/c2pa-and-global-watermarking-mandates-for-ai-video-in-2026/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        C2PA and Global Watermarking mandates for AI video in 2026
                      </span>{" "}
                      — Magiclight.AI
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://aibuzz.blog/ai-watermarking-vs-metadata-vs-fingerprinting/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        AI Watermarking 2026: C2PA, Metadata and Fingerprinting
                      </span>{" "}
                      — AI Buzz
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://aivideobootcamp.com/blog/ai-disclosure-compliance-2026-c2pa-eu-ai-act/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        AI Disclosure Compliance 2026: C2PA &amp; EU AI Act Guide
                      </span>{" "}
                      — AI Video Bootcamp
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://ppl.studio/blog/ai-generated-content-disclosure-ftc-guidelines">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        FTC AI Content Disclosure Rules (2026): What Brands Must Say
                      </span>{" "}
                      — ppl.studio
                    </span>
                  </Ext>
                </li>
                <li>
                  <Ext href="https://sesamedisk.com/ai-content-provenance-2026-c2pa-watermarking/">
                    <i className="ti ti-external-link" />
                    <span>
                      <span className={styles.refTitle}>
                        AI Content Provenance in 2026: C2PA, Watermarking, and EU AI Act
                      </span>{" "}
                      — Sesame Disk
                    </span>
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          <footer className={styles.pageFooter}>
            本ガイドはWeb検索により取得した2026年時点の情報に基づいて作成されています。生成AIツール・モデル・法規制は変化が速い分野のため、実務での利用前に各公式ドキュメント・最新の法令情報を必ず確認してください。
          </footer>
        </main>
      </div>
    </div>
  );
}
