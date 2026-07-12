import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "マルチモーダルAI実践ガイド：画像・音声生成のベストプラクティス 2026 | LLM-Studies",
  description:
    "拡散モデルの内部構造からモデル選定、プロンプト設計、ControlNet/LoRAによる制御、リアルタイム音声対話エージェント、コンテンツ来歴・法規制、プロダクション運用まで。中級〜上級のAIエンジニア向けに、意思決定に使える粒度でステップバイステップに解説します。",
};

const DIAGRAMS = {
  d1: `flowchart LR
A["テキスト入力またはマルチモーダル入力"] --> B{"モダリティ変換方式"}
B -->|"カスケード型パイプライン"| C["ASR / STT 音声認識"]
C --> D["テキストLLM 推論"]
D --> E["TTS 音声合成"]
B -->|"ネイティブ Any-to-Any"| F["単一モデルが音声・画像・テキストを直接処理"]
E --> G["出力: 音声または画像"]
F --> G
G --> H["コンテンツ来歴付与: C2PAとSynthID"]
H --> I["ユーザーへ配信"]`,

  d2: `flowchart LR
subgraph 学習時_Forward_Process
    A1["元画像"] --> A2["ノイズ付加 1回目"]
    A2 --> A3["ノイズ付加 2回目"]
    A3 --> A4["ほぼ純粋なノイズ 最終段階"]
end
subgraph 推論時_Reverse_Process
    B1["純粋なノイズ"] --> B2["ノイズ除去 ステップ1"]
    B2 --> B3["ノイズ除去 ステップ2"]
    B3 --> B4["生成画像"]
end
A4 -.モデルが学習.-> B1`,

  d3: `flowchart TD
Start["画像生成タスクの要件を確認"] --> Q1{"文字・ロゴ・タイポグラフィが主目的か"}
Q1 -->|"はい"| Ideogram["Ideogram V3 または GPT Image 2"]
Q1 -->|"いいえ"| Q2{"フォトリアリズム最優先か"}
Q2 -->|"はい"| Q2b{"大量バッチ生成が必要か"}
Q2b -->|"はい"| Flux["FLUX.2 Pro API 経由バッチ処理"]
Q2b -->|"いいえ"| Imagen["Nano Banana 2 または Midjourney V8"]
Q2 -->|"いいえ"| Q3{"複雑な指示理解や対話的編集が必要か"}
Q3 -->|"はい"| GptImage["GPT Image 2"]
Q3 -->|"いいえ"| Q4{"自前運用・完全商用フリーが必須か"}
Q4 -->|"はい"| OSS["Qwen-Image 2.0 または Stable Diffusion 3.5"]
Q4 -->|"いいえ"| Q5{"ブランドセーフティ・著作権リスク最小化が最優先か"}
Q5 -->|"はい"| Firefly["Adobe Firefly"]
Q5 -->|"いいえ"| Default["用途に応じて複数モデルをA/Bテスト"]`,

  d4: `flowchart LR
Req["生成リクエスト"] --> Classifier["タスク分類器 用途/品質要件/予算を判定"]
Classifier -->|"文字入りデザイン"| M1["Ideogram / GPT Image 2"]
Classifier -->|"フォトリアル商品写真"| M2["FLUX.2 Pro"]
Classifier -->|"高速プレビュー"| M3["蒸留モデル 例: SDXL-Lightning"]
Classifier -->|"ブランド安全性優先"| M4["Adobe Firefly"]
M1 --> Cache["結果キャッシュ 同一プロンプトの再利用"]
M2 --> Cache
M3 --> Cache
M4 --> Cache
Cache --> Out["出力・後処理・来歴付与"]`,

  d5: `flowchart LR
Edit["画像編集リクエスト"] --> C1["Change: 変更する内容を1点に絞る"]
Edit --> C2["Preserve: 顔・ポーズ・照明・構図・文字を明記"]
Edit --> C3["Constraints: 追加禁止事項を明記 ロゴのドリフト禁止など"]
C1 --> Merge["統合プロンプトとして送信"]
C2 --> Merge
C3 --> Merge
Merge --> Result["編集結果"]
Result -->|"意図しないドリフトが発生"| Retry["Preserveリストに 具体項目を追加して再実行"]
Retry --> Merge`,

  d6: `flowchart LR
Ref["参照画像"] --> Extract["特徴抽出 OpenPose 深度 Canny エッジ MLSD"]
Extract --> Control["ControlNet 条件情報として付与"]
Prompt["テキストプロンプト"] --> Base["ベース拡散モデル"]
Control --> Base
Base --> Denoise["ノイズ除去プロセス 制御情報に沿って誘導"]
Denoise --> Output["構図・ポーズが 意図通りの生成画像"]`,

  d7: `flowchart TD
Need["制御ニーズを評価"] --> Q1{"プロンプトだけで 十分な精度が出るか"}
Q1 -->|"はい"| Prompt["構造化プロンプトのみで運用"]
Q1 -->|"いいえ"| Q2{"構図・ポーズなど 空間的制御が必要か"}
Q2 -->|"はい"| CN["ControlNetを追加"]
Q2 -->|"いいえ"| Q3{"特定のスタイル・キャラクターを 繰り返し再現したいか"}
Q3 -->|"はい"| Lora["LoRAを学習・適用"]
Q3 -->|"いいえ"| Q4{"モデルの根本的な挙動を 大幅に変える必要があるか"}
Q4 -->|"はい"| FT["フルファインチューニング 高コスト・要検討"]
Q4 -->|"いいえ"| Combine["ControlNet + LoRA の組み合わせ"]`,

  d8: `flowchart TD
Gen["生成バッチ 例: 100枚"] --> Auto["自動評価層"]
Auto --> FID["FID / CLIPScore を算出"]
Auto --> Safety["安全性分類器 NSFW/暴力/著作権類似検知"]
FID --> Filter{"閾値を下回るか"}
Safety --> Filter
Filter -->|"合格"| Sample["合格分から一定割合を サンプリング"]
Filter -->|"不合格"| Reject["却下・再生成キューへ"]
Sample --> Human["人間評価 または VLM評価"]
Human --> Report["品質レポート ダッシュボード化"]
Report --> Feedback["プロンプト・モデル選定へ フィードバック"]`,

  d9: `flowchart LR
Gen1["第1世代 従来型TTS 規則ベース・連結合成"] --> Gen2["第2世代 ニューラルTTS ゼロショットボイスクローン対応"]
Gen2 --> Gen3["第3世代 ネイティブ音声対話 Audio-to-Audio 感情・間合いを直接処理"]`,

  d10: `flowchart TD
Need["音声生成要件"] --> Q1{"リアルタイム対話 サブ200ミリ秒が必須か"}
Q1 -->|"はい"| Q1b{"自前ホスティングが必要か"}
Q1b -->|"はい"| Cartesia["Cartesia Sonic"]
Q1b -->|"いいえ"| Flash["ElevenLabs Flash v2.5 または OpenAI Realtime"]
Q1 -->|"いいえ"| Q2{"感情表現・オーディオブック品質が最優先か"}
Q2 -->|"はい"| ElevenV3["ElevenLabs Eleven v3"]
Q2 -->|"いいえ"| Q3{"日本語特化・プライバシー重視か"}
Q3 -->|"はい"| JP["Style-BERT-VITS2 または AivisSpeech ローカル運用"]
Q3 -->|"いいえ"| Q4{"既存のLLM統合を最重視するか"}
Q4 -->|"はい"| OpenAITTS["OpenAI gpt-4o-mini-tts"]
Q4 -->|"いいえ"| Compare["複数モデルをブラインドテストで比較"]`,

  d11: `flowchart LR
Text["長文台本"] --> Split["意味的な区切りでチャンク分割 文単位/段落単位"]
Split --> Ctx["各チャンクに 直前チャンクの音声特徴を コンテキストとして継承"]
Ctx --> Gen["チャンクごとに音声生成"]
Gen --> Concat["音声結合"]
Concat --> QC["つなぎ目のトーン・音量チェック"]
QC -->|"違和感あり"| Regen["該当チャンクを 前チャンクの特徴を強めて再生成"]
Regen --> Concat
QC -->|"問題なし"| Final["最終音声ファイル"]`,

  d12: `flowchart LR
Speak["ユーザー発話終了"] --> VAD["音声区間検出 VAD"]
VAD --> Net["ネットワーク往復"]
Net --> Infer["モデル推論"]
Infer --> Tool["外部ツール呼び出し 必要な場合"]
Tool --> Synth["音声合成 ネイティブ方式は省略可"]
Synth --> Net2["ネットワーク往復 応答"]
Net2 --> Hear["ユーザーが応答を聞く"]`,

  d13: `flowchart TD
Music["AI生成楽曲を商用利用したい"] --> Q1{"有料プラン かつ商用利用許諾ありか"}
Q1 -->|"いいえ"| Stop["無料プランでの商用利用は規約違反 有料プランへ移行"]
Q1 -->|"はい"| Q2{"既存楽曲との類似性を 確認したか"}
Q2 -->|"未確認"| Check["Shazam等の類似検索ツールで 既存楽曲との類似性を確認"]
Check --> Q2
Q2 -->|"確認済み・問題なし"| Q3{"人間による編集・アレンジを 加えたか"}
Q3 -->|"いいえ"| Edit["AI出力を素材として扱い 人間の編集・アレンジを加える"]
Edit --> Q3
Q3 -->|"はい"| Q4{"高単価の商用案件か 広告/映画/ゲーム等"}
Q4 -->|"はい"| Legal["法務確認 訴訟リスクの低いツールを優先検討"]
Q4 -->|"いいえ"| OK["利用開始"]
Legal --> OK`,

  d14: `flowchart TB
subgraph 従来型_単機能パイプライン
    T1["テキスト入力"] --> M1["テキストLLM"]
    I1["画像入力"] --> M2["画像専用モデル"]
    A1["音声入力"] --> M3["音声専用モデル"]
    M1 --> Out1["個別の出力を 後段で統合"]
    M2 --> Out1
    M3 --> Out1
end
subgraph ネイティブAny_to_Any
    T2["テキスト"] --> Native["単一の ネイティブマルチモーダルモデル"]
    I2["画像"] --> Native
    A2["音声"] --> Native
    Native --> Out2["統合された テキスト/画像/音声 出力"]
end`,

  d15: `flowchart LR
User["ユーザー指示 自然言語"] --> Orchestrator["オーケストレーターLLM 意図解釈・タスク分解"]
Orchestrator -->|"画像が必要"| ImgTool["画像生成ツール MCP経由"]
Orchestrator -->|"音声が必要"| AudioTool["音声合成ツール MCP経由"]
Orchestrator -->|"音楽が必要"| MusicTool["音楽生成ツール MCP経由"]
ImgTool --> Compose["成果物の統合 動画への合成等"]
AudioTool --> Compose
MusicTool --> Compose
Compose --> Review["安全性・品質レビュー"]
Review --> Deliver["ユーザーへ納品"]`,

  d16: `flowchart LR
Gen["AI画像/音声の生成"] --> C2PA["C2PA Content Credentials 暗号署名付きメタデータ 作成者・生成方法・編集履歴を記録"]
Gen --> SynthID["SynthID 不可視ウォーターマーク メタデータ喪失後も検出可能"]
C2PA --> Verify["公開検証ツール"]
SynthID --> Verify
Verify --> Result["生成物の来歴を 一般ユーザーが確認可能に"]`,

  d17: `flowchart LR
Req["生成リクエスト"] --> Draft["低品質・高速設定で 下書き生成"]
Draft --> UserOK{"ユーザーが 気に入ったか"}
UserOK -->|"いいえ"| Draft
UserOK -->|"はい"| Final["高品質設定で 最終レンダリング"]
Final --> Deliver["納品"]`,

  d18: `flowchart TD
Prod["本番トラフィック"] --> Log["生成ログ プロンプト・パラメータ・レイテンシ・コスト"]
Log --> Metrics["ダッシュボード 成功率・平均レイテンシ・コスト/生成"]
Log --> QSample["品質サンプリング 6章のQAパイプラインへ"]
Metrics --> Alert{"SLA逸脱を検知"}
Alert -->|"はい"| Incident["インシデント対応 モデル切り替え/フォールバック"]
Alert -->|"いいえ"| Continue["通常運用継続"]
QSample --> Feedback["プロンプトテンプレート・ モデル選定への フィードバック"]`,
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
            目次を開く
          </button>
          <div className={styles.brand}>
            Multimodal AI Guide
            <p className={styles.brandSub}>画像・音声生成ベストプラクティス<br />2026年7月版</p>
          </div>

          <p className={styles.navTitle}>目次</p>
          <nav className={styles.navList} id="multimodalNavList">
            <ul>
              <li>
                <a href="#s1" className={styles.tocLink}>
                  <span className={styles.badge} style={{ marginRight: "8px", padding: "1px 6px" }}>01</span>
                  マルチモーダル生成AIの全体像
                </a>
              </li>
              <li>
                <a href="#s2" className={styles.tocLink}>
                  <span className={styles.badge} style={{ marginRight: "8px", padding: "1px 6px" }}>02</span>
                  画像生成モデルの技術基盤
                </a>
              </li>
              <li>
                <a href="#s3" className={styles.tocLink}>
                  <span className={styles.badge} style={{ marginRight: "8px", padding: "1px 6px" }}>03</span>
                  画像生成モデルの選定
                </a>
              </li>
              <li>
                <a href="#s4" className={styles.tocLink}>
                  <span className={styles.badge} style={{ marginRight: "8px", padding: "1px 6px" }}>04</span>
                  プロンプトエンジニアリング
                </a>
              </li>
              <li>
                <a href="#s5" className={styles.tocLink}>
                  <span className={styles.badge} style={{ marginRight: "8px", padding: "1px 6px" }}>05</span>
                  ControlNet・LoRA・FT
                </a>
              </li>
              <li>
                <a href="#s6" className={styles.tocLink}>
                  <span className={styles.badge} style={{ marginRight: "8px", padding: "1px 6px" }}>06</span>
                  評価とQAパイプライン
                </a>
              </li>
              <li>
                <a href="#s7" className={styles.tocLink}>
                  <span className={styles.badge} style={{ marginRight: "8px", padding: "1px 6px" }}>07</span>
                  音声生成の技術基盤
                </a>
              </li>
              <li>
                <a href="#s8" className={styles.tocLink}>
                  <span className={styles.badge} style={{ marginRight: "8px", padding: "1px 6px" }}>08</span>
                  TTSモデルの選定
                </a>
              </li>
              <li>
                <a href="#s9" className={styles.tocLink}>
                  <span className={styles.badge} style={{ marginRight: "8px", padding: "1px 6px" }}>09</span>
                  音声生成のベストプラクティス
                </a>
              </li>
              <li>
                <a href="#s10" className={styles.tocLink}>
                  <span className={styles.badge} style={{ marginRight: "8px", padding: "1px 6px" }}>10</span>
                  リアルタイム音声エージェント
                </a>
              </li>
              <li>
                <a href="#s11" className={styles.tocLink}>
                  <span className={styles.badge} style={{ marginRight: "8px", padding: "1px 6px" }}>11</span>
                  音楽生成AIと著作権
                </a>
              </li>
              <li>
                <a href="#s12" className={styles.tocLink}>
                  <span className={styles.badge} style={{ marginRight: "8px", padding: "1px 6px" }}>12</span>
                  マルチモーダル統合アーキテクチャ
                </a>
              </li>
              <li>
                <a href="#s13" className={styles.tocLink}>
                  <span className={styles.badge} style={{ marginRight: "8px", padding: "1px 6px" }}>13</span>
                  安全性・来歴・法規制
                </a>
              </li>
              <li>
                <a href="#s14" className={styles.tocLink}>
                  <span className={styles.badge} style={{ marginRight: "8px", padding: "1px 6px" }}>14</span>
                  プロダクション運用
                </a>
              </li>
              <li>
                <a href="#s15" className={styles.tocLink}>
                  <span className={styles.badge} style={{ marginRight: "8px", padding: "1px 6px" }}>15</span>
                  意思決定チェックリスト
                </a>
              </li>
              <li>
                <a href="#s16" className={styles.tocLink}>
                  <span className={styles.badge} style={{ marginRight: "8px", padding: "1px 6px" }}>16</span>
                  参考文献・URL一覧
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className={styles.content}>
          <div className={styles.docHeader}>
            <p className={styles.docSub}>Intermediate &mdash; Advanced Engineering Guide</p>
            <h1>マルチモーダルAI実践ガイド<br />画像・音声生成のベストプラクティス</h1>
            <p className={styles.docMeta}>
              対象: AI/LLMエンジニア・アーキテクト | 最終更新: 2026-07-10 | 図解: Mermaid 18点 | 出典: 巻末に全URL掲載
            </p>
          </div>

          <hr className={styles.divider} />

          <section className="chapter" id="s1">
            <h2>
              <span className={styles.badge} style={{ fontSize: "14px", padding: "4px 8px" }}>01 / 16</span>
              マルチモーダル生成AIの全体像
            </h2>
            <p>
              2024〜2025年は「テキスト生成AIにマルチモーダル入出力が追加される」フェーズでしたが、2026年に入り潮目が変わりました。画像・音声はもはや周辺機能ではなく、<strong>推論(reasoning)を内蔵したネイティブ・マルチモーダルモデル</strong>が主流になりつつあります。具体的には次の3つの潮流が同時並行で進んでいます。
            </p>
            <ul>
              <li>
                <strong>画像生成の自己回帰化</strong> — GPT Image 2のように拡散モデルではなく自己回帰(Autoregressive)方式でテキストと同じ仕組みで画像を生成し、複雑な指示理解・世界知識の反映に強いモデルが台頭しています。OpenAIの公開しているプロンプティングガイドでは、gpt-image-2が新規構築の推奨デフォルトとされ、画質・編集性能の向上とプロダクションワークフローへの広い対応が特徴として挙げられています。
              </li>
              <li>
                <strong>音声のネイティブ音声対話(Audio-to-Audio)化</strong> — 音声認識→LLM推論→音声合成という「カスケード型」から、単一モデルが音声を直接理解し直接発話する方式への移行が進んでいます。Gemini 3.1 Flash Liveは、従来の「文字起こし・推論・合成」という段階的スタックを単一のネイティブ音声対話プロセスへ統合し、レイテンシを大幅に削減しつつ、より自然なピッチ・間合いの認識を可能にしています。
              </li>
              <li>
                <strong>「唯一の最強モデル」の消滅</strong> — 2026年の画像生成AIモデル環境は変化が激しく、単一の最強モデルは存在せず、コンテンツの種類に応じて最適なモデルへルーティングするアーキテクチャが実務上の勝ち筋になっています。
              </li>
            </ul>
            <p>
              本ガイドは、この前提に立ったうえで「どのモデルを、どう組み合わせ、どう安全に、どう運用するか」を実装レベルで解説します。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d1} />
              <div className={styles.diagramCaption}>
                Fig 1. カスケード型パイプライン vs ネイティブ Any-to-Any モデルの構造比較
              </div>
            </div>

            <div className={styles.callout}>
              <span className={styles.calloutTitle}>Key Takeaway:</span>
              <p>
                カスケード型は各コンポーネントを個別に差し替え・最適化できる柔軟性が強みですが、変換のたびに情報(抑揚・感情・視覚的ニュアンス)が失われ、レイテンシも積み上がります。ネイティブ方式は低レイテンシ・高い表現力を持ちますが、特定ベンダーへの依存度が高くなり、細かいパラメータ制御は相対的に苦手です。この判断軸は本ガイド全体を通じて繰り返し登場します。
              </p>
            </div>
          </section>

          <section className="chapter" id="s2">
            <h2>
              <span className={styles.badge} style={{ fontSize: "14px", padding: "4px 8px" }}>02 / 16</span>
              画像生成モデルの技術基盤
            </h2>
            <p>
              実装者としてモデルを選ぶ前に、内部で何が起きているかを理解しておくと、パラメータ調整・トラブルシューティング・コスト設計の精度が上がります。2026年時点で実務上押さえるべきアーキテクチャは大きく3系統です。
            </p>

            <h3>2.1 拡散モデル(Diffusion Model)</h3>
            <p>
              拡散モデルは画像生成AIの基盤技術で、ランダムなノイズから、テキスト指示に合わせて少しずつノイズを除去(denoising)して画像を作り上げる手法であり、Stable Diffusion・FLUX・Midjourneyなど大半の画像生成ツールがこの仕組みを採用しています。学習時には実画像に段階的にノイズを加える「拡散過程」を学習し、推論時にはランダムノイズから逆方向にノイズを除去していく「逆拡散過程」を繰り返すことで画像を復元します。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d2} />
              <div className={styles.diagramCaption}>
                Fig 2. 拡散モデルの学習時(Forward Process)と推論時(Reverse Process)
              </div>
            </div>

            <h3>2.2 Flow Matching / Rectified Flow</h3>
            <p>
              FLUXやStable Diffusion 3系はFlow Matching(整流フロー)という拡散モデルの発展形を採用しています。ノイズと画像を結ぶ経路を直線(rectified)に近づけることで、少ないステップ数でも高品質な生成が可能になる点が拡散モデルとの実務上の違いです。近年はさらに、生成に必要な関数評価回数(NFE)を1〜数ステップまで削減する蒸留(Distillation)技術の研究が活発です。Consistency Model・Mean Flow Distillationなどの手法は、教師モデルの軌道(trajectory)を学習した生徒モデルが1ステップまたは数ステップで同等の品質を再現することを狙っています。プロダクションでは「SDXL-Lightning」のような蒸留済み高速モデルが、リアルタイム性が求められるUI(インタラクティブなプレビュー生成など)で採用されています。
            </p>

            <div className={`${styles.callout} ${styles.principle}`}>
              <span className={styles.calloutTitle}>実務上のポイント:</span>
              <p>
                ステップ数を減らす蒸留モデルは生成速度が数倍〜数十倍高速になりますが、細部のディテールやプロンプト忠実度がわずかに犠牲になる場合があります。プレビュー用途には蒸留モデル、最終納品用途にはフルステップモデルを使い分けるハイブリッド構成が定石です。
              </p>
            </div>

            <h3>2.3 自己回帰型画像生成(Autoregressive Image Generation)</h3>
            <p>
              拡散モデルとは根本的に異なるアプローチとして、テキストトークンと同じように画像を「一部分ずつ順番に生成する」自己回帰方式があります。4o Image Generation(image_gen)はChatGPTに組み込まれており、GPT-4oと同じ技術を使って画像を生成する点が特徴で、拡散方式ではなく単語を書くように少しずつ画像を生成していきます。
            </p>
            <p>
              注意点として、GPT Image系(自己回帰モデル)は拡散モデルではないため生成速度は遅く、1回のリクエストにつき1枚の出力となる一方で、複雑なシーン構成や指示理解では拡散モデル系を上回る場合があります。
            </p>

            <h3>2.4 3アーキテクチャの比較</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>観点</th>
                    <th>拡散モデル(Diffusion)</th>
                    <th>Flow Matching / 蒸留系</th>
                    <th>自己回帰型(Autoregressive)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>代表モデル例</td>
                    <td>Stable Diffusion 3.5, Midjourney V8</td>
                    <td>FLUX.2, SDXL-Lightning</td>
                    <td>GPT Image 2, 4o Image Generation</td>
                  </tr>
                  <tr>
                    <td>生成速度</td>
                    <td>中速(20〜50ステップが一般的)</td>
                    <td>高速(1〜8ステップ)</td>
                    <td>低速(トークンを逐次生成)</td>
                  </tr>
                  <tr>
                    <td>得意分野</td>
                    <td>フォトリアリズム、アート表現</td>
                    <td>高速プレビュー、リアルタイムUI</td>
                    <td>複雑な指示理解、文字描画、編集の一貫性</td>
                  </tr>
                  <tr>
                    <td>弱点</td>
                    <td>文字描画が崩れやすい(改善中)</td>
                    <td>蒸留による品質劣化のリスク</td>
                    <td>生成速度が遅く、1回1枚が基本</td>
                  </tr>
                  <tr>
                    <td>制御手法</td>
                    <td>ControlNet, LoRAが豊富</td>
                    <td>ControlNet系は限定的</td>
                    <td>自然言語での対話的編集が中心</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              技術選定の指針: バッチで大量の画像を高速生成したい(広告バナー量産、ECサイトの商品画像量産など)場合は拡散モデル系＋蒸留モデルの組み合わせが有利です。逆に、複雑な指示理解・文字入りデザイン・対話的な反復編集が必要な場合は自己回帰型(GPT Image系)が有利という傾向が2026年7月時点で確認できます。
            </p>
          </section>

          <section className="chapter" id="s3">
            <h2>
              <span className={styles.badge} style={{ fontSize: "14px", padding: "4px 8px" }}>03 / 16</span>
              画像生成モデルの選定(2026年7月版)
            </h2>

            <h3>3.1 主要モデル比較表</h3>
            <p>
              2026年7月時点で実務上検討対象になる主要モデルを、モデル単位(サービス名ではなく)で整理します。2026年はサービス名と中身のモデル名がねじれて分かりにくくなっており、ChatGPTの中身はGPT Image 2、GeminiはNano Banana 2であるなど、サービス名ではなくモデル単位で実態を把握することが重要です。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>モデル</th>
                    <th>提供元</th>
                    <th>アーキテクチャ</th>
                    <th>得意分野</th>
                    <th>商用ライセンス</th>
                    <th>備考</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>GPT Image 2</td>
                    <td>OpenAI</td>
                    <td>自己回帰</td>
                    <td>複雑な指示理解、文字描画、編集の一貫性</td>
                    <td>OpenAI利用規約に準拠、出力の所有権はユーザー</td>
                    <td>最大4K出力、CJK含む文字精度は約99%</td>
                  </tr>
                  <tr>
                    <td>Nano Banana 2 / Gemini 3.1 Flash Image</td>
                    <td>Google</td>
                    <td>拡散＋Gemini統合</td>
                    <td>速度と汎用性のバランス、検索・Lens統合</td>
                    <td>Geminiアプリの規約に準拠</td>
                    <td>2026年2月にGemini 3全モードへ標準搭載</td>
                  </tr>
                  <tr>
                    <td>FLUX.2</td>
                    <td>Black Forest Labs</td>
                    <td>Flow Matching</td>
                    <td>フォトリアリズム、デザイン寄りの描写</td>
                    <td>モデル本体は非商用/生成画像は商用OKの分離ライセンス</td>
                    <td>バージョンにより商用可否が異なるため要確認</td>
                  </tr>
                  <tr>
                    <td>Midjourney V8 / V8.1</td>
                    <td>Midjourney</td>
                    <td>拡散</td>
                    <td>アート性・写真的な質感の表現力</td>
                    <td>月額プランに応じ商用利用可</td>
                    <td>公式APIは提供されていない</td>
                  </tr>
                  <tr>
                    <td>Ideogram V3</td>
                    <td>Ideogram</td>
                    <td>拡散</td>
                    <td>タイポグラフィ・ロゴ・文字入りデザイン</td>
                    <td>有料プランで商用利用可</td>
                    <td>文字描画精度の高さが差別化要因</td>
                  </tr>
                  <tr>
                    <td>Seedream 5.0</td>
                    <td>ByteDance</td>
                    <td>拡散</td>
                    <td>リアルタイムWeb検索統合、インフォグラフィック</td>
                    <td>API提供</td>
                    <td>時事性の高いコンテンツに強い</td>
                  </tr>
                  <tr>
                    <td>Qwen-Image 2.0</td>
                    <td>Alibaba</td>
                    <td>拡散</td>
                    <td>自前運用・完全商用フリー</td>
                    <td>Apache 2.0(改変・再配布・自前運用が全て可能)</td>
                    <td>HuggingFace配布、自前GPU運用が前提</td>
                  </tr>
                  <tr>
                    <td>Adobe Firefly</td>
                    <td>Adobe</td>
                    <td>拡散</td>
                    <td>商用安全性(学習データの権利処理が明示的)</td>
                    <td>商用利用が明確に許可</td>
                    <td>企業のブランドセーフティ要件に強い</td>
                  </tr>
                  <tr>
                    <td>Stable Diffusion 3.5 / XL</td>
                    <td>Stability AI</td>
                    <td>拡散</td>
                    <td>完全なカスタマイズ性、ローカル運用</td>
                    <td>オープンウェイト(バージョンにより異なる)</td>
                    <td>LoRA・ControlNetのエコシステムが最も充実</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.docMeta} style={{ fontSize: "13px", marginTop: "-12px" }}>
              ※ 料金・仕様は変更が非常に速いため、契約前に必ず各社公式サイトの最新情報を確認してください。
            </p>

            <h3>3.2 用途別モデル選定フローチャート</h3>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d3} />
              <div className={styles.diagramCaption}>Fig 3. タスク要件からモデルを絞り込む意思決定フロー</div>
            </div>

            <h3>3.3 「マルチモデル・ルーティング」という実務パターン</h3>
            <p>
              2026年にAI製品で成功する開発者は最強のモデルを1つ選ぶ人ではなく、タスクに応じて最適なモデルにルーティングできるモデル非依存のアーキテクチャを構築し、進化に合わせて柔軟に最適化し続ける人です。実装上は、以下のようなルーティング層を用意するのが定石です。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d4} />
              <div className={styles.diagramCaption}>
                Fig 4. タスク分類器によるマルチモデル・ルーティングアーキテクチャ
              </div>
            </div>
            <p>
              このパターンの利点は、単一ベンダーのAPI仕様変更・値上げ・提供終了(実際に2026年4月にDALL·Eが終了しGPT Image 2へ移行した例がありました)に対する耐性が高くなることです。
            </p>
          </section>

          <section className="chapter" id="s4">
            <h2>
              <span className={styles.badge} style={{ fontSize: "14px", padding: "4px 8px" }}>04 / 16</span>
              プロンプトエンジニアリング
            </h2>

            <h3>4.1 「マーケティングコピー」から「撮影指示書」への発想転換</h3>
            <p>
              最も重要な心構えの転換は、プロンプトを&quot;魅力的な売り文句&quot;として書くのをやめ、&quot;撮影・編集の仕様書&quot;として書くことです。GPT Image 2は光源・レンズ・素材・何が変わってはいけないかを写真家やアートディレクターのように語ると精度良く応答しますが、「Stunning, cinematic, 8K, ultra-detailed」のような抽象的な誇張語は実質的にノイズとして無視されます。
            </p>
            <p>
              具体性を欠いた指示(例:「賑やかな街並み」)は雑然とした背景を生みがちなため、「被写界深度を浅く」「背景を大きくぼかしたソフトボケ」のような写真的な制約語を加えることで、主題と背景を明確に分離できます。
            </p>

            <h3>4.2 構造化プロンプトの基本フレーム(新規生成)</h3>
            <p>
              OpenAIが公開したgpt-image系のプロンプティングガイドは、マーケティング的な美辞麗句ではなく、構造化されたプロンプト・明示的な不変条件・反復的な編集を重視する、仕様書に近い規律を提示しています。実務では次の5要素を明示的にプロンプトへ組み込むことを推奨します。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>要素</th>
                    <th>内容</th>
                    <th>記述例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>被写体</td>
                    <td>誰が・何が</td>
                    <td>夜明け前の市場で紅茶を注ぐ年配の茶売り</td>
                  </tr>
                  <tr>
                    <td>環境・背景</td>
                    <td>どこで、周囲に何があるか</td>
                    <td>湯気の立つやかん、ぼやけた野菜の屋台が背景に</td>
                  </tr>
                  <tr>
                    <td>カメラ・レンズ</td>
                    <td>画角・被写界深度</td>
                    <td>Fujifilm X100VI、自然なタングステン光</td>
                  </tr>
                  <tr>
                    <td>ライティング</td>
                    <td>光源の種類・方向</td>
                    <td>単一の吊り下げ作業灯からの光</td>
                  </tr>
                  <tr>
                    <td>スタイル・制約</td>
                    <td>何を避けるか</td>
                    <td>スタジオ照明なし、過度なレタッチなし、透かしなし</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              この最も重要なワークフロー習慣は、1要素だけを変えた3〜5個のバリエーションを作成することであり、これによって照明と構図のどちらが結果を改善したのかを切り分けられます。ランダムな試行錯誤ではなく、系統的な反復こそが専門性を育てます。
            </p>

            <h3>4.3 画像編集(Edit)のための「変更・維持・制約」パターン</h3>
            <p>
              対話的な画像編集では、次の3項目を毎回明示するパターンが定石です。実務ではChange(変更点)・Preserve(顔・アイデンティティ・ポーズ・照明・構図・背景・ジオメトリ・文字・レイアウトなど維持すべき要素)・Constraints(余分な物体を追加しない、再デザインしない、ロゴをドリフトさせない、透かしを入れないなど)の3項目に分けて記述することが推奨されます。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d5} />
              <div className={styles.diagramCaption}>
                Fig 5. Change / Preserve / Constraints パターンによる編集ワークフロー
              </div>
            </div>

            <p>
              複数回の編集を重ねるワークフローでは、反復のたびに「維持すべき不変条件」を明示的に再掲することが、ドリフト(意図しない変化の蓄積)を防ぐ鍵になります。参照画像を複数渡す場合は、「画像1: 維持すべきベースシーン」「画像2: ジャケットの参照」「画像3: ブーツの参照」のように、各入力画像の役割にラベルを付けて指示の中で参照するとモデルの誤認識を防げます。
            </p>

            <h3>4.4 文字・タイポグラフィを正確に描画するコツ</h3>
            <p>
              GPT Image系はタイポグラフィが得意ですが、注意しないとランダムな文字を追加することがあるため、正確な文言は必ずダブルクォートで囲み、厳密な配置指示と組み合わせるべきです。「ネオンサインを作って」ではなく「窓の上部中央に配置された、&quot;Open&quot;と表示される光るネオンサイン」のように具体化します。
            </p>

            <h3>4.5 ネガティブプロンプトが効かないモデルへの対処</h3>
            <p>
              OpenAIの画像モデルには専用のネガティブプロンプト欄が存在しないため、「〜を含めない」という否定形をConstraints欄に明示的に列挙する必要があります。一方、Stable Diffusion系やMidjourneyでは伝統的なネガティブプロンプト(<code>--no</code>構文や専用パラメータ)が引き続き有効です。モデルごとにネガティブプロンプトの扱いが異なる点はワークフロー設計上の重要な分岐点です。
            </p>

            <h3>4.6 UIモックアップ・インフォグラフィックなどの構造化ビジュアル</h3>
            <p>
              UIモックアップは、その製品がすでに実在するかのように、レイアウト・階層・余白・実際のインターフェース要素を描写すると最も良い結果が得られ、コンセプトアート的な言い回しを避けることで、デザインスケッチではなく実際に出荷されたインターフェースのような仕上がりになります。
            </p>

            <h3>4.7 プロンプト管理のワークフロー</h3>
            <p>
              プロンプトのバージョン管理には、スプレッドシートやNotionデータベース、Obsidianボールトのような構造化されたドキュメントを用い、何が効いて何が効かなかったかのメモや、改善のたびのプロンプトのバージョンを記録し、蓄積するたびに価値が増すクリエイティブ資産として扱うことが推奨されます。プロダクション環境では、これをプロンプトテンプレート＋変数注入の形でコードベースに落とし込み、A/Bテスト結果と紐づけて管理すると、モデル移行(例: gpt-image-1.5からgpt-image-2への移行)の際にも回帰テストが容易になります。
            </p>
          </section>

          <section className="chapter" id="s5">
            <h2>
              <span className={styles.badge} style={{ fontSize: "14px", padding: "4px 8px" }}>05 / 16</span>
              ControlNet・LoRA・ファインチューニング
            </h2>
            <p>
              プロンプトだけでは制御しきれない構図・ポーズ・ブランド固有のスタイルを扱う場合、拡散モデル系エコシステムには成熟した制御技術があります。
            </p>

            <h3>5.1 ControlNetの仕組み</h3>
            <p>
              ControlNetは条件付き画像生成を実現する技術であり、既存のStable Diffusionなどのモデルに追加のネットワークとして接続し、参照画像から抽出した制御情報(エッジ・深度・ポーズなど)を基に画像生成を誘導することで、テキストプロンプトだけでは困難な構図・ポーズ・形状・エッジの具体的な制御を可能にします。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d6} />
              <div className={styles.diagramCaption}>Fig 6. ControlNetによる条件付き画像生成の流れ</div>
            </div>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>モデル</th>
                    <th>抽出する情報</th>
                    <th>主な用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>OpenPose</td>
                    <td>人体の骨格・関節位置</td>
                    <td>ポーズ指定、キャラクターの姿勢固定</td>
                  </tr>
                  <tr>
                    <td>Canny / MLSD</td>
                    <td>エッジ・直線構造</td>
                    <td>建築物・プロダクトの構図固定</td>
                  </tr>
                  <tr>
                    <td>Depth</td>
                    <td>奥行き情報</td>
                    <td>立体感・空間配置の維持</td>
                  </tr>
                  <tr>
                    <td>Tile</td>
                    <td>タイル状の高解像度情報</td>
                    <td>アップスケーリング・高画質化</td>
                  </tr>
                  <tr>
                    <td>Reference</td>
                    <td>全体的な見た目の参照</td>
                    <td>スタイル・色調の一貫性維持</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>5.2 LoRA(Low-Rank Adaptation)によるスタイル固定</h3>
            <p>
              LoRAは既存 of AIモデルに小さな部品(アダプター)だけを足して新しいスタイルやキャラクターを覚えさせる手法で、元のモデルはそのまま残し、その横に薄い「メモ帳」を挟むイメージであり、学習するパラメータ量が少なくGPU負荷も小さく、生成されるファイルも数MB〜数百MBと軽量です。フルのファインチューニングの10%のコストで95%相当の性能を達成できるというデータも公開されています。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d7} />
              <div className={styles.diagramCaption}>Fig 7. 制御ニーズに応じた手法選択の意思決定フロー</div>
            </div>

            <h3>5.3 QLoRAと量子化によるコスト最適化</h3>
            <p>
              画像モデルに限らずLLM/マルチモーダルモデル全般で、2026年時点では「QLoRA + Unsloth + DoRA」の組み合わせがコンシューマGPUでのファインチューニング実務標準になっています。自社データでのスタイル学習を検討する際は、フルパラメータ更新ではなくLoRA/QLoRAから着手し、効果が不十分な場合にのみフルファインチューニングを検討するのが費用対効果の高い進め方です。
            </p>

            <div className={`${styles.callout} ${styles.principle}`} style={{ borderLeftColor: "var(--color-text-danger, #ef4444)" }}>
              <span className={styles.calloutTitle} style={{ color: "var(--color-text-danger, #ef4444)" }}>実務上の注意:</span>
              <p>
                LoRAで学習した画風・キャラクターは、ベースモデルがバージョンアップされた際に互換性が失われることがあります。ベースモデルの更新頻度が高いクラウドAPI系(GPT Image、Nano Banana等)ではLoRAのような形の追加学習は提供されないことが多く、LoRAエコシステムは主にオープンウェイトモデル(Stable Diffusion、FLUX等)を自前運用する場合に有効な選択肢です。
              </p>
            </div>
          </section>

          <section className="chapter" id="s6">
            <h2>
              <span className={styles.badge} style={{ fontSize: "14px", padding: "4px 8px" }}>06 / 16</span>
              画像生成の評価とQAパイプライン
            </h2>
            <p>
              「良い画像かどうか」を定量化することは、モデル選定・A/Bテスト・回帰検知のいずれにおいても不可欠ですが、単一指標に依存すると評価と実感がずれるリスクがあります。
            </p>

            <h3>6.1 代表的な自動評価指標</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>指標</th>
                    <th>何を測るか</th>
                    <th>値の解釈</th>
                    <th>限界</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>FID(Fréchet Inception Distance)</td>
                    <td>生成画像と実データの特徴量分布の距離</td>
                    <td>低いほど良い(実画像分布に近い)</td>
                    <td>FIDの良さと人間が画像を本物らしいと判断するかはあまり一致しない</td>
                  </tr>
                  <tr>
                    <td>IS(Inception Score)</td>
                    <td>生成画像の多様性とクラス識別性</td>
                    <td>高いほど良い</td>
                    <td>人間にとって本当にリアルかどうかは評価できない</td>
                  </tr>
                  <tr>
                    <td>CLIPScore</td>
                    <td>テキストと生成画像の意味的な類似度</td>
                    <td>高いほどテキストに忠実</td>
                    <td>
                      CLIPが学習していない表現の評価が難しく、モデル進化に対しやや時代遅れになりつつある
                    </td>
                  </tr>
                  <tr>
                    <td>LPIPS</td>
                    <td>知覚的な画像間の類似度</td>
                    <td>低いほど類似</td>
                    <td>主に画像編集・超解像タスクの評価向け</td>
                  </tr>
                  <tr>
                    <td>VLMベース評価(GPT-4V等)</td>
                    <td>複雑な構図・文脈整合性の意味理解</td>
                    <td>定性的スコアリング</td>
                    <td>コストが高く、評価者側のバイアスも残る</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              実際に確認された例では、あるモデルが別のモデルより高いCLIP Scoreを達成したにもかかわらず、人間評価では明らかに後者が優秀と判定されるケースがあり、これは前者がCLIP空間での最適化を行っているためで、スコアと実際の品質が乖離する典型例です。
            </p>

            <h3>6.2 評価パイプラインの設計</h3>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d8} />
              <div className={styles.diagramCaption}>Fig 8. 自動評価と人間評価を組み合わせたQAパイプライン</div>
            </div>

            <h3>6.3 実務指針</h3>
            <ul>
              <li>
                <strong>単一指標に依存しない</strong> — 定量指標の効率性と人間評価の感性を適切にバランスさせ、商用サービス・研究開発・アート制作など用途に最適化された指標の組み合わせを選ぶことが重要です。
              </li>
              <li>
                <strong>人間評価のコスト最小化</strong> — 全数チェックではなく統計的サンプリング＋自動フィルタの組み合わせで、レビュー工数を現実的な範囲に抑えます。
              </li>
              <li>
                <strong>プロンプト忠実度と美的品質は別軸で評価する</strong> — CLIPScoreはプロンプト忠実度の代理指標であり、美的品質(構図・ライティング・ディテール)は別途VLMまたは人間評価で補完します。
              </li>
              <li>
                <strong>著作権・商標類似性チェックを評価パイプラインに組み込む</strong> — 特に商用配信前には、既存の著名なキャラクター・ロゴ・アートワークとの類似性を検知するステップを安全性フィルタと並列で走らせることを推奨します。
              </li>
            </ul>
          </section>

          <section className="chapter" id="s7">
            <h2>
              <span className={styles.badge} style={{ fontSize: "14px", padding: "4px 8px" }}>07 / 16</span>
              音声生成の技術基盤：TTSからネイティブ音声対話へ
            </h2>

            <h3>7.1 音声生成技術の3世代</h3>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d9} />
              <div className={styles.diagramCaption}>Fig 9. 音声生成技術の世代進化</div>
            </div>
            <p>
              従来の音声AIシステムは、音声認識(VAD→STT)・言語モデル推論・音声合成(TTS)という複数モデルを連結させる「待ち時間スタック」を持ち、AIが話し始める頃には人間はすでに話題を変えているという問題を抱えていました。第3世代のネイティブ音声対話モデルは、この「文字起こし・推論・合成」というスタックを単一のネイティブ音声処理へ統合することでこの問題を解決します。
            </p>

            <h3>7.2 カスケード型 vs ネイティブAudio-to-Audio の詳細比較</h3>
            <p>
              2026年4月時点で、半カスケード方式(ネイティブ音声入力処理とテキストベースの言語モデル推論・音声合成出力を組み合わせる方式)と、単一モデルが聞く・考える・話すをすべて1つのニューラルネットワーク内で行うネイティブ方式の2つのアプローチが存在します。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>観点</th>
                    <th>カスケード型(ASR→LLM→TTS)</th>
                    <th>ネイティブ Audio-to-Audio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>レイテンシ</td>
                    <td>各段の合計(積み上がる)</td>
                    <td>1つのモデル内で完結するため理論上は低い</td>
                  </tr>
                  <tr>
                    <td>感情・韻律の保持</td>
                    <td>変換のたびに失われやすい</td>
                    <td>音声の特徴量を直接処理するため保持しやすい</td>
                  </tr>
                  <tr>
                    <td>コンポーネントの差し替え</td>
                    <td>容易(STT/TTSを個別に最適化可能)</td>
                    <td>困難(モデル全体がベンダーに依存)</td>
                  </tr>
                  <tr>
                    <td>音声のカスタマイズ性</td>
                    <td>高い(専門TTSベンダーを選べる)</td>
                    <td>限定的(統合TTS品質は専用モデルより劣ることが多い)</td>
                  </tr>
                  <tr>
                    <td>代表モデル</td>
                    <td>Whisper＋LLM＋ElevenLabs等の組み合わせ</td>
                    <td>Gemini 3.1 Flash Live, OpenAI Realtime API, Amazon Nova 2 Sonic</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>7.3 実測レイテンシの目安(2026年4月時点)</h3>
            <p>
              Time to First Token(発話終了からエージェント発話開始までの時間)は、xAI Grok Voice Agentが約0.78秒で最速、OpenAI gpt-realtime-1.5が約0.82秒、Amazon Nova 2 Sonicが約1.14秒、Gemini 3.1 Flash Liveが約2.98秒(Google自身の「リアルタイム」訴求より実測では遅い)という報告があり、人間の会話における応答レイテンシは平均約200ミリ秒とされています。この数値は測定条件や利用シーンによって変動するため、自社ワークロードでの実測が不可欠です。
            </p>

            <div className={styles.callout}>
              <span className={styles.calloutTitle}>実務上の注意:</span>
              <p>
                ベンダーのマーケティング上のレイテンシ訴求と、サードパーティによる実測ベンチマークには乖離が生じることがあります。SLAが必要な用途では必ず自社トラフィックパターンでの実測を行ってください。
              </p>
            </div>
          </section>

          <section className="chapter" id="s8">
            <h2>
              <span className={styles.badge} style={{ fontSize: "14px", padding: "4px 8px" }}>08 / 16</span>
              音声合成(TTS)モデル of 選定(2026年7月版)
            </h2>

            <h3>8.1 クラウドAPI主要モデル比較</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>モデル</th>
                    <th>提供元</th>
                    <th>強み</th>
                    <th>レイテンシ</th>
                    <th>主な弱み</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Eleven v3</td>
                    <td>ElevenLabs</td>
                    <td>
                      感情表現に優れ、[whispers]・[laughs]・[excited]等のインラインオーディオタグに対応。長尺コンテンツ・オーディオブック向け
                    </td>
                    <td>標準的</td>
                    <td>コストが比較的高い</td>
                  </tr>
                  <tr>
                    <td>Flash v2.5</td>
                    <td>ElevenLabs</td>
                    <td>32言語対応、エンドツーエンドで500ミリ秒未満の低遅延</td>
                    <td>推論レイテンシ約75ミリ秒</td>
                    <td>表現力はv3よりやや控えめ</td>
                  </tr>
                  <tr>
                    <td>gpt-4o-mini-tts</td>
                    <td>OpenAI</td>
                    <td>テキストプロンプトで音声のトーン・感情・アクセント・速度を自由に制御可能</td>
                    <td>低コスト・高速</td>
                    <td>マルチスピーカー非対応</td>
                  </tr>
                  <tr>
                    <td>Gemini TTS / Chirp3 HD</td>
                    <td>Google</td>
                    <td>ドラマティックな感情表現、SSML対応</td>
                    <td>標準的</td>
                    <td>チャンク分割後にトーンが揺れる場合がある</td>
                  </tr>
                  <tr>
                    <td>Cartesia Sonic</td>
                    <td>Cartesia</td>
                    <td>40ミリ秒のTime-to-First-Audio、エンタープライズ向け自前ホスティング対応</td>
                    <td>最速クラス</td>
                    <td>日本語以外の言語での実績が中心</td>
                  </tr>
                  <tr>
                    <td>Fish Audio</td>
                    <td>Fish Audio</td>
                    <td>80以上の言語、50以上の感情制御、クロスリンガルなボイスクローン</td>
                    <td>標準的</td>
                    <td>ブランド認知度がまだ低い</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>8.2 日本語特化・オープンソースモデル</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>モデル</th>
                    <th>ライセンス</th>
                    <th>特徴</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Style-BERT-VITS2</td>
                    <td>オープンソース</td>
                    <td>日本語品質で最高評価を獲得、ローカル実行でデータを外部送信しない</td>
                  </tr>
                  <tr>
                    <td>AivisSpeech</td>
                    <td>オープンソース</td>
                    <td>感情豊かな日本語音声、GPU不要構成も可能</td>
                  </tr>
                  <tr>
                    <td>VOICEVOX</td>
                    <td>オープンソース・キャラクターごとに規約あり</td>
                    <td>完全無料、キャラクターボイス、YouTubeナレーションで広く利用</td>
                  </tr>
                  <tr>
                    <td>Qwen3-TTS</td>
                    <td>Apache 2.0</td>
                    <td>ボイスクローンと10言語対応で急速にシェアを拡大</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>8.3 選定フローチャート</h3>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d10} />
              <div className={styles.diagramCaption}>Fig 10. 要件別TTSモデル選定フロー</div>
            </div>

            <h3>8.4 コストと日本語品質のトレードオフ</h3>
            <p>
              クラウドAPIの日本語品質スコアは4サービスとも90点前後の僅差に収まる一方、ローカルOSSではStyle-BERT-VITS2とAivisSpeechが最高評価を獲得しています。料金面では、ローカルOSSはGPU初期投資のみで追加課金ゼロ、クラウドAPIはOpenAIのgpt-4o-mini-ttsが低コストという構図になっており、月間の生成規模と品質要件のバランスで最適解が変わります。プライバシー要件が厳しい医療・法務系の用途では、外部送信を避けられるローカルOSSモデルが第一候補になります。
            </p>
          </section>

          <section className="chapter" id="s9">
            <h2>
              <span className={styles.badge} style={{ fontSize: "14px", padding: "4px 8px" }}>09 / 16</span>
              音声生成のベストプラクティス
            </h2>

            <h3>9.1 「何を音声にするか」より「どう読ませるか」</h3>
            <p>
              TTSのAPIを叩くこと自体はそれほど難しくなく、本質的に難しいのは「何を音声にするか」と「どう読ませるか」です。テキストをそのまま流し込むのではなく、以下のような演出情報を明示的に設計に組み込む必要があります。
            </p>
            <ul>
              <li>
                <strong>オーディオタグによる感情制御</strong> — [whispers]、[laughs]、[excited]のようなインラインオーディオタグを台本中に埋め込むことで、長尺コンテンツやドラマチックなボイスオーバーの表現力を制御できます。
              </li>
              <li>
                <strong>Voice Direction(演出指示)</strong> — 抽象的な指示(「感情を込めて」)ではなく、「困惑した様子で、語尾を少し伸ばしながら」のような具体的な演出指示を与えることで、意図した抑揚に近づきます。
              </li>
              <li>
                <strong>自然言語によるスタイル制御</strong> — gpt-4o-mini-ttsは、従来のtts-1/tts-1-hdモデルとは異なり、テキストプロンプトで音声のトーン・感情・アクセント・速度を自由に制御できます。
              </li>
            </ul>

            <h3>9.2 長文音声生成におけるチャンク分割とトーンの一貫性</h3>
            <p>
              長文をそのまま一括生成すると音質が不安定になりやすいため、実務では文章をチャンク(分割単位)に分けて逐次生成し、後で結合する手法が一般的です。しかし、これには固有の課題があります。チャンク分割後にElevenLabsは声のトーンが一貫していてつなぎ目の違和感がほとんどない一方、Gemini TTSではチャンク間でトーンが揺れる問題が顕著な差として現れることがあります。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d11} />
              <div className={styles.diagramCaption}>Fig 11. 長文音声生成のチャンク分割ワークフロー</div>
            </div>
            <p>
              <strong>実務上の対策</strong>: チャンクの切れ目は文の途中ではなく、句点や段落の境界に合わせる。可能であれば「前のチャンクの音声を参照情報として次のチャンクの生成に渡す」機能を持つAPI(コンテキスト継承対応のモデル)を優先的に選定する。
            </p>

            <h3>9.3 SSML(Speech Synthesis Markup Language)の活用</h3>
            <p>
              Google Cloud TTSやAmazon Pollyなど一部のクラウドサービスはSSMLに対応しており、<code>&lt;break time=&quot;500ms&quot;/&gt;</code> による間の制御、<code>&lt;emphasis&gt;</code> による強調、<code>&lt;prosody rate=&quot;slow&quot;&gt;</code> による速度制御など、プレーンテキストでは表現できない細かな演出が可能です。ネイティブ音声対話モデル(Gemini Live、GPT Realtime等)はSSMLではなく自然言語の指示(システムプロンプト)でスタイルを制御する設計思想に移行しつつある点は、実装時に混同しないよう注意が必要です。
            </p>

            <h3>9.4 音声クローンの倫理・同意管理</h3>
            <p>
              音声クローン技術は非常に強力な反面、なりすまし・詐欺・肖像権侵害のリスクを併せ持ちます。実務では以下を最低限のガードレールとして組み込むべきです。
            </p>
            <ul>
              <li>
                <strong>本人の明示的な同意の取得と記録</strong> — クローン対象者から書面または録音による同意を取得し、利用範囲(内部利用のみ／商用公開／広告掲載)を事前に合意する。
              </li>
              <li>
                <strong>認証プロセスを備えたプラットフォームの利用</strong> — ElevenLabsやMicrosoft Custom Neural Voiceは本人認証プロセスを提供しており、これらを活用することが安全とされています。無断でのクローンは肖像権・パブリシティ権の侵害となるため避けるべきとされています。
              </li>
              <li>
                <strong>音声ウォーターマークの付与</strong> — OpenAIはVoice Engineにおいて音声ウォーターマークを導入し、精度と信頼性に関する検証と研究を継続しています。自社で音声クローン機能を提供する場合、生成音声への来歴情報の埋め込みを検討してください。
              </li>
              <li>
                <strong>なりすまし検知フローの整備</strong> — カスタマーサポート等の重要な意思決定に音声認証を用いている場合、AI音声クローンによる突破を想定した多要素認証の併用を推奨します。
              </li>
            </ul>
          </section>

          <section className="chapter" id="s10">
            <h2>
              <span className={styles.badge} style={{ fontSize: "14px", padding: "4px 8px" }}>10 / 16</span>
              リアルタイム音声対話エージェントの設計
            </h2>

            <h3>10.1 接続方式の選択: WebSocket / WebRTC / SIP</h3>
            <p>
              WebSocketはサーバーとAPI間に永続的な接続を確立するプロトコルで、通常のHTTPが毎回接続を開閉するのに対し、会話全体の間チャンネルを開いたままにし、ユーザーの音声とモデルの音声という2つのストリームが同時に流れます。Node.jsやPythonのバックエンドで音声をサーバー側で処理するアーキテクチャに向いています。電話システムとの統合が必要な場合はSIP、ブラウザから直接低遅延で接続する場合はWebRTCが適しています。
            </p>

            <h3>10.2 Gemini Live API と GPT Realtime API の比較</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>観点</th>
                    <th>Gemini 3.1 Flash Live</th>
                    <th>GPT Realtime(gpt-realtime-1.5 / 2)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>アーキテクチャ</td>
                    <td>
                      Gemini 3 Proをベースにしたネイティブマルチモーダルモデルで、音声・映像・画像・テキストを同時に受け付ける
                    </td>
                    <td>音声専用(Audio-to-Audio)でありながら強力な推論能力を持つ</td>
                  </tr>
                  <tr>
                    <td>映像入力</td>
                    <td>対応(ユーザーの画面や映像ストリームを見ながら会話できる)</td>
                    <td>非対応</td>
                  </tr>
                  <tr>
                    <td>言語対応</td>
                    <td>200以上の言語をサポート</td>
                    <td>対応言語はGeminiよりやや狭い</td>
                  </tr>
                  <tr>
                    <td>ツール呼び出しの信頼性</td>
                    <td>
                      ComplexFuncBench Audioで90.8%を記録し、構造化・決定論的なツールチェーンに強い
                    </td>
                    <td>オープンエンドな推論チェーン(調査→要約→メール作成)に強い</td>
                  </tr>
                  <tr>
                    <td>MCP対応</td>
                    <td>ロードマップ上にあるが、2026年3月時点ではネイティブ対応なし</td>
                    <td>ネイティブMCP対応済み</td>
                  </tr>
                  <tr>
                    <td>電話(SIP)統合</td>
                    <td>限定的</td>
                    <td>ネイティブSIPダイヤル対応</td>
                  </tr>
                  <tr>
                    <td>コスト</td>
                    <td>桁違いに安価</td>
                    <td>複雑なエージェントシナリオ・長時間セッション(60分)で強み</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Web起点のエージェントを新規構築する場合はまずGeminiで組み、電話統合やMCPツールサーバーが必要になった段階でOpenAIを追加する、というマルチプロバイダー構成が2026年の実務では現実的な出発点です。
            </p>

            <h3>10.3 レイテンシ予算の設計</h3>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d12} />
              <div className={styles.diagramCaption}>Fig 12. 発話終了から応答までのレイテンシ予算の内訳</div>
            </div>
            <p>
              Word Error Rate(WER)は文字起こしの誤認識率を測る指標であり、Time to First Token(TTFT)は発話終了からエージェント発話開始までの時間を測る指標です。両者を継続的に計測し、SLA違反の兆候を早期検知する体制が重要です。統合TTSの音質は専門TTSモデルに劣ることが多いため、音声品質を最優先する用途では、ネイティブAudio-to-Audioモデルの音声出力部分だけを専門TTS(ElevenLabs Conversational AI等)に差し替えるハイブリッド構成も検討に値します。
            </p>

            <h3>10.4 バージイン(割り込み)対応</h3>
            <p>
              Proactive Audio(能動的な発話判断)は単純な音声区間検出(VAD)を超えた機能で、エージェントがいつ応答すべきか、いつ静かな聞き手であり続けるべきかを賢く判断できるよう設定でき、受動的な傾聴が求められる場面での不要な割り込みを防ぎます。ノイズの多い環境(工事現場・車内・イベント会場など)での運用を想定する場合は、この能動的判断機能の有無をモデル選定の評価軸に加えてください。
            </p>
          </section>

          <section className="chapter" id="s11">
            <h2>
              <span className={styles.badge} style={{ fontSize: "14px", padding: "4px 8px" }}>11 / 16</span>
              音楽生成AIのベストプラクティスと著作権
            </h2>

            <h3>11.1 主要プラットフォームの使い分け</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ツール</th>
                    <th>強み</th>
                    <th>商用利用時の留意点</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Suno</td>
                    <td>歌モノ生成に万能、日本語歌詞対応</td>
                    <td>
                      Sony Musicとの訴訟が2026年6月時点で継続中。大規模商用案件では法務確認を推奨
                    </td>
                  </tr>
                  <tr>
                    <td>Udio</td>
                    <td>オーディオ品質で高評価</td>
                    <td>
                      2025〜2026年のライセンス移行期間中、ダウンロード機能が一時的に制限される場合がある
                    </td>
                  </tr>
                  <tr>
                    <td>AIVA</td>
                    <td>クラシック・オーケストラ、映画音楽に強くMIDI出力対応</td>
                    <td>生成楽曲の著作権がユーザーに完全帰属し商業案件で安心感が高い</td>
                  </tr>
                  <tr>
                    <td>Soundraw</td>
                    <td>ロイヤリティフリーで安心、YouTube向けBGMに最適</td>
                    <td>
                      オリジナル音源のみを学習データに使用しているため収益化トラブルが起きにくい構造
                    </td>
                  </tr>
                  <tr>
                    <td>Stable Audio</td>
                    <td>ライセンス済みデータで学習</td>
                    <td>API提供済みで開発者組み込みに現実的</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>11.2 著作権をめぐる2026年時点の状況</h3>
            <p>
              2024年6月、全米レコード協会(RIAA)がUMG・Sony Music・Warner Music Groupの3大レーベルを代理し、AIモデルの学習データへの無断使用を争点にSunoとUdioを提訴しました。その後「訴訟→和解→ライセンス契約」という流れが生まれ、WMGとSuno・Udioの提携がAI音楽正規化の最初の成功モデルとなっています。一方で、Sony Musicとの訴訟は2026年6月時点でも継続中であり、判決次第でサービス内容・ポリシーが変わる可能性があります。
            </p>
            <p>
              日本国内では、JASRACが著作権法30条の4(情報解析目的の利用を適法とする規定)の見直しを文化庁へ要望しており、クリエイターが安心して創作に専念できる環境の確保を前提に、より厳格な要件の導入を求めています。
            </p>

            <h3>11.3 商用利用における実務チェックリスト</h3>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d13} />
              <div className={styles.diagramCaption}>Fig 13. 商用利用判断のフローチャート</div>
            </div>
            <p>
              SunoやUdioなどの有料プランを契約していても、生成された楽曲が既存の著名な楽曲とメロディやアレンジにおいて類似し、それが「依拠性」と「類似性」の要件を満たすと判断された場合、著作権侵害の責任を負うリスクがあります。商用利用の前に、Shazam等の類似曲検索による類似度チェックを行うことを推奨します。
            </p>
          </section>

          <section className="chapter" id="s12">
            <h2>
              <span className={styles.badge} style={{ fontSize: "14px", padding: "4px 8px" }}>12 / 16</span>
              マルチモーダル統合アーキテクチャパターン
            </h2>

            <h3>12.1 カスケード型(単機能の疎結合) vs ネイティブAny-to-Any の使い分け</h3>
            <p>
              2026年の実務設計における最大のアーキテクチャ選択は、画像・音声・テキストをそれぞれ専用モデル(疎結合)で繋ぐ「カスケード型」にするか、単一の「ネイティブAny-to-Anyモデル」を採用するかです。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d14} />
              <div className={styles.diagramCaption}>Fig 14. カスケード型とネイティブAny-to-Anyの構造比較</div>
            </div>

            <h3>12.2 オーケストレーション設計(テキストLLM主導)</h3>
            <p>
              テキストLLMを「司令塔(Orchestrator)」とし、画像生成・音声合成・音楽生成などの各種専用ツールをツールコール(MCP経由など)で呼び出す構成は、複雑なマルチメディアコンテンツ作成において現在最も安定したパターンです。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d15} />
              <div className={styles.diagramCaption}>
                Fig 15. テキストLLM主導のコンテンツ生成オーケストレーション
              </div>
            </div>
          </section>

          <section className="chapter" id="s13">
            <h2>
              <span className={styles.badge} style={{ fontSize: "14px", padding: "4px 8px" }}>13 / 16</span>
              安全性・コンテンツ来歴・法規制
            </h2>

            <h3>13.1 C2PA Content Credentials と SynthID</h3>
            <p>
              生成コンテンツの透明性を担保するための主要な標準技術は「C2PA」と「SynthID」です。前者はメタデータへの署名による来歴記録、後者はコンテンツデータ自体への不可視の電子透かしの埋め込みであり、両者を併用することで、配信プラットフォームやSNSでの流通時にも改ざんや来歴の消失を防げます。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d16} />
              <div className={styles.diagramCaption}>Fig 16. C2PAメタデータ署名とSynthID電子透かしの併用スキーム</div>
            </div>

            <h3>13.2 各国のAI規制とコンプライアンス</h3>
            <p>
              2026年は、欧州AI法(EU AI Act)の全面的な適用開始に伴い、ウォーターマーキングやAI生成コンテンツである旨の明示義務化など、実務上のコンプライアンス対応が必須化される年です。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>法規制/地域</th>
                    <th>ステータス</th>
                    <th>開発者への影響・義務</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>欧州AI法(EU AI Act)</td>
                    <td>2026年全面適用</td>
                    <td>
                      高リスクAIシステムへの厳格な要件、生成物の透明性義務(AI生成であることの開示、電子透かしの埋め込み)
                    </td>
                  </tr>
                  <tr>
                    <td>米国大統領令</td>
                    <td>継続適用・改訂中</td>
                    <td>
                      安全保障に関わるシステムの事前報告義務、C2PA等を用いたコンテンツ来歴表示の推進
                    </td>
                  </tr>
                  <tr>
                    <td>日本(文化庁著作権セミナー)</td>
                    <td>ガイドライン改訂</td>
                    <td>
                      開発段階(学習)での30条の4の適用範囲の整理、生成利用段階での「類似性・依拠性」判断基準の明確化
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="chapter" id="s14">
            <h2>
              <span className={styles.badge} style={{ fontSize: "14px", padding: "4px 8px" }}>14 / 16</span>
              プロダクション運用のベストプラクティス
            </h2>

            <h3>14.1 コスト管理とキャッシュ戦略</h3>
            <p>
              画像・音声生成はテキスト生成と比較してAPIコストが10〜100倍高いため、キャッシュ戦略が不可欠です。プロンプトハッシュを用いた同一リクエストの検出や、前述の「下書き(低品質)→本番(高品質)」の2段階生成構成でレンダリングコストを最適化します。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d17} />
              <div className={styles.diagramCaption}>Fig 17. コスト最適化のための2段階生成アプローチ</div>
            </div>

            <h3>14.2 モニタリングとオブザーバビリティ</h3>
            <p>
              生成結果の品質が時間経過とともに劣化する「品質ドリフト」や、APIのエラー率、平均生成時間の変化をダッシュボード化し、SLA違反時に自動でモデルを切り替える(フォールバック)仕組みを組み込みます。
            </p>

            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAMS.d18} />
              <div className={styles.diagramCaption}>Fig 18. 本番環境におけるモニタリングとフィードバックループ</div>
            </div>
          </section>

          <section className="chapter" id="s15">
            <h2>
              <span className={styles.badge} style={{ fontSize: "14px", padding: "4px 8px" }}>15 / 16</span>
              意思決定チェックリスト
            </h2>
            <p>
              プロジェクト開始時、または技術選定の最終決定を行う前に、以下のチェックリストを用いて設計の抜け漏れを確認してください。
            </p>

            <ul className={styles.checklist}>
              <li>
                <input id="chk-1" type="checkbox" />
                <label htmlFor="chk-1">
                  <strong>ライセンスと商用利用権の確認:</strong> 選択したすべてのモデル(ベース、LoRA、統合TTSなど)が、プロダクトの商用要件および利用地域(特にEU規制地域)に合致しているか確認した。
                </label>
              </li>
              <li>
                <input id="chk-2" type="checkbox" />
                <label htmlFor="chk-2">
                  <strong>レイテンシ予算の合致:</strong> リアルタイム対話型エージェントなどの用途で、発話から応答開始までが目標値(例: 800ms以内)に収まる構成であることを実測で検証した。
                </label>
              </li>
              <li>
                <input id="chk-3" type="checkbox" />
                <label htmlFor="chk-3">
                  <strong>著作権と類似曲のチェック:</strong> 特に音楽生成AIを大規模プロモーションで用いる際、類似曲検索等を用いて既存曲との類似性を排除するチェックフローを設けた。
                </label>
              </li>
              <li>
                <input id="chk-4" type="checkbox" />
                <label htmlFor="chk-4">
                  <strong>来歴メタデータ/透かしの付与:</strong> EU AI法や各プラットフォームの規制基準に合わせ、C2PAメタデータの付与またはSynthID等の電子透かしの埋め込みを自動化するパイプラインを構築した。
                </label>
              </li>
              <li>
                <input id="chk-5" type="checkbox" />
                <label htmlFor="chk-5">
                  <strong>障害時のフォールバック設計:</strong> 主要モデルのAPIダウン、料金改定、サービス終了に備え、代替モデルへのルーティングをコード変更なしで切り替えられるように設計した。
                </label>
              </li>
            </ul>
          </section>

          <section className="chapter" id="s16">
            <h2>
              <span className={styles.badge} style={{ fontSize: "14px", padding: "4px 8px" }}>16 / 16</span>
              参考文献・URL一覧
            </h2>

            <div className={styles.refCategory}>
              <h4>画像生成・プロンプティング</h4>
              <ul className={styles.refList}>
                <li>
                  <Ext href="https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide">
                    <span className={styles.refTitle}>GPT Image 2 Prompting Guide and Examples (OpenAI Cookbook)</span>
                    developers.openai.com/cookbook/.../image-gen-models-prompting-guide
                  </Ext>
                </li>
                <li>
                  <Ext href="https://fal.ai/learn/tools/prompting-gpt-image-2">
                    <span className={styles.refTitle}>GPT Image 2 Prompting Guide and Examples (fal)</span>
                    fal.ai/learn/tools/prompting-gpt-image-2
                  </Ext>
                </li>
                <li>
                  <Ext href="https://developers.openai.com/cookbook/examples/multimodal/image-gen-1.5-prompting_guide">
                    <span className={styles.refTitle}>Gpt-image-1.5 Prompting Guide (OpenAI Cookbook)</span>
                    developers.openai.com/cookbook/.../image-gen-1.5-prompting_guide
                  </Ext>
                </li>
                <li>
                  <Ext href="https://platform.openai.com/docs/guides/image-generation">
                    <span className={styles.refTitle}>Image generation (OpenAI API公式ドキュメント)</span>
                    platform.openai.com/docs/guides/image-generation
                  </Ext>
                </li>
                <li>
                  <Ext href="https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api">
                    <span className={styles.refTitle}>Best practices for prompt engineering with the OpenAI API</span>
                    help.openai.com/.../best-practices-for-prompt-engineering
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.freshtechtips.com/2026/05/openai-chatgpt-image-prompting-guide.html">
                    <span className={styles.refTitle}>The Ultimate OpenAI (ChatGPT) Image Prompting Guide</span>
                    freshtechtips.com/2026/05/openai-chatgpt-image-prompting-guide
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.i-scoop.eu/prompting-gpt-image-2-like-a-pro-guide/">
                    <span className={styles.refTitle}>Prompting gpt-image-2 like a pro</span>
                    i-scoop.eu/prompting-gpt-image-2-like-a-pro-guide
                  </Ext>
                </li>
                <li>
                  <Ext href="https://medium.com/@amrstech/chatgpt-images-2-0-api-prompting-guide-47fbe5aeee3a">
                    <span className={styles.refTitle}>ChatGPT Images 2.0 API Prompting Guide (Medium)</span>
                    medium.com/@amrstech/chatgpt-images-2-0-api-prompting-guide
                  </Ext>
                </li>
                <li>
                  <Ext href="https://gptimg2ai.com/blogs/gpt-image-2-prompt-guide">
                    <span className={styles.refTitle}>GPT Image 2 Prompt Guide: Examples, Testing and How to Use</span>
                    gptimg2ai.com/blogs/gpt-image-2-prompt-guide
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCategory}>
              <h4>ControlNet・LoRA・ファインチューニング</h4>
              <ul className={styles.refList}>
                <li>
                  <Ext href="https://techotakulab.com/controlnet-guide-pose-composition-2026/">
                    <span className={styles.refTitle}>ControlNet完全ガイド</span>
                    techotakulab.com/controlnet-guide-pose-composition-2026
                  </Ext>
                </li>
                <li>
                  <Ext href="https://ururuailab.com/sd-forge-lora-settings/">
                    <span className={styles.refTitle}>Stable Diffusion Forge「LoRA」の使い方</span>
                    ururuailab.com/sd-forge-lora-settings
                  </Ext>
                </li>
                <li>
                  <Ext href="https://namaraii.com/notes/LoRA">
                    <span className={styles.refTitle}>LoRA (namaraii.com)</span>
                    namaraii.com/notes/LoRA
                  </Ext>
                </li>
                <li>
                  <Ext href="https://renue.co.jp/posts/lora-qlora-peft-finetuning-implementation-guide-2026">
                    <span className={styles.refTitle}>LoRA/QLoRA完全実装ガイド2026 (renue)</span>
                    renue.co.jp/posts/lora-qlora-peft-finetuning-implementation-guide-2026
                  </Ext>
                </li>
                <li>
                  <Ext href="https://aipicks.jp/mag/lora-stable-diffusion-2026">
                    <span className={styles.refTitle}>LoRAとは？画像生成を変える追加学習を初心者向けに解説</span>
                    aipicks.jp/mag/lora-stable-diffusion-2026
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCategory}>
              <h4>画像生成の評価指標</h4>
              <ul className={styles.refList}>
                <li>
                  <Ext href="https://service.ai-prompt.jp/article/ai365-191/">
                    <span className={styles.refTitle}>【０から学ぶAI】第191回：画像生成の評価指標</span>
                    service.ai-prompt.jp/article/ai365-191
                  </Ext>
                </li>
                <li>
                  <Ext href="https://cyberagent.ai/blog/research/computervision/18702/">
                    <span className={styles.refTitle}>クラウドソーシングを使った画像生成の評価 (CVPR2023紹介)</span>
                    cyberagent.ai/blog/research/computervision/18702
                  </Ext>
                </li>
                <li>
                  <Ext href="https://zenn.dev/d2c_mtech_blog/articles/76d4f03a78e098">
                    <span className={styles.refTitle}>画像生成モデルの比較 (Zenn)</span>
                    zenn.dev/d2c_mtech_blog/articles/76d4f03a78e098
                  </Ext>
                </li>
                <li>
                  <Ext href="https://note.com/te_ftef/n/nd7f2d7547c22">
                    <span className={styles.refTitle}>CyberAgentより、画像生成タスクにおける新たな評価指標の提案</span>
                    note.com/te_ftef/n/nd7f2d7547c22
                  </Ext>
                </li>
                <li>
                  <Ext href="https://scrapbox.io/shoji-lab-survey/%E7%94%BB%E5%83%8F%E7%94%9F%E6%88%90%E3%83%A2%E3%83%87%E3%83%AB%E3%81%AE%E3%83%A1%E3%82%B8%E3%83%A3%E3%83%BC%E3%81%AA%E8%A9%95%E4%BE%A1%E6%8C%87%E6%A8%99">
                    <span className={styles.refTitle}>画像生成モデルのメジャーな評価指標</span>
                    scrapbox.io/shoji-lab-survey/画像生成モデルの評価指標
                  </Ext>
                </li>
                <li>
                  <Ext href="https://re-birth-ai.com/image-generation-model-evaluation-methods-complete-guide/">
                    <span className={styles.refTitle}>画像生成モデル評価手法完全ガイド (Re-BIRTH)</span>
                    re-birth-ai.com/image-generation-model-evaluation-methods-complete-guide
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCategory}>
              <h4>音声生成（TTS）・比較</h4>
              <ul className={styles.refList}>
                <li>
                  <Ext href="https://tech.gmogshd.com/ai-tts-comparison/">
                    <span className={styles.refTitle}>OpenAI・ElevenLabs・Geminiを使い比べてわかった違い</span>
                    tech.gmogshd.com/ai-tts-comparison
                  </Ext>
                </li>
                <li>
                  <Ext href="https://techcreate.balubo.jp/articles/ai-voice-generation-tts-guide-2026">
                    <span className={styles.refTitle}>AI音声生成ガイド2026 (TechCreate)</span>
                    techcreate.balubo.jp/articles/ai-voice-generation-tts-guide-2026
                  </Ext>
                </li>
                <li>
                  <Ext href="https://elevenlabs.io/ja/text-to-speech">
                    <span className={styles.refTitle}>AI音声読み上げ無料 (ElevenLabs公式)</span>
                    elevenlabs.io/ja/text-to-speech
                  </Ext>
                </li>
                <li>
                  <Ext href="https://note.com/aituberonair/n/n096cd23ce3ea">
                    <span className={styles.refTitle}>【2026年最新比較】AITuber制作に最適な音声合成エンジン11選</span>
                    note.com/aituberonair/n/n096cd23ce3ea
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.befreed.ai/blog/best-tts-model-2026">
                    <span className={styles.refTitle}>Best TTS Model 2026: Top 9 AI Voice Generators Ranked</span>
                    befreed.ai/blog/best-tts-model-2026
                  </Ext>
                </li>
                <li>
                  <Ext href="https://qiita.com/0h-n0/items/8f78f7acd31000612d13">
                    <span className={styles.refTitle}>日本語TTSモデル徹底比較2026 (Qiita)</span>
                    qiita.com/0h-n0/items/8f78f7acd31000612d13
                  </Ext>
                </li>
                <li>
                  <Ext href="https://walker-s.co.jp/ai/voice-generation-tool/">
                    <span className={styles.refTitle}>おすすめの音声生成AIツール10選</span>
                    walker-s.co.jp/ai/voice-generation-tool
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.callmissed.com/en/blog/tts-showdown-2026-elevenlabs-vs-cartesia-vs-openai-vs-sesame-the-ultimate-compar">
                    <span className={styles.refTitle}>TTS Showdown 2026: ElevenLabs vs. Cartesia vs. OpenAI vs. Sesame</span>
                    callmissed.com/en/blog/tts-showdown-2026
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.solounicorn.club/blog/a-33">
                    <span className={styles.refTitle}>ElevenLabs vs OpenAI Voice vs Google TTS</span>
                    solounicorn.club/blog/a-33
                  </Ext>
                </li>
                <li>
                  <Ext href="https://renue.co.jp/posts/ai-voice-generation-elevenlabs-heygen-synthesia-2026-guide">
                    <span className={styles.refTitle}>ElevenLabs/HeyGen/Synthesia比較とビジネス活用10選</span>
                    renue.co.jp/posts/ai-voice-generation-elevenlabs-heygen-synthesia-2026-guide
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCategory}>
              <h4>コンテンツ来歴・電子透かし・規制</h4>
              <ul className={styles.refList}>
                <li>
                  <Ext href="https://renue.co.jp/posts/ai-watermark-c2pa-synthid-content-authenticity-guide-2026">
                    <span className={styles.refTitle}>AIウォーターマークとは？C2PA・SynthIDの仕組み (renue)</span>
                    renue.co.jp/posts/ai-watermark-c2pa-synthid-content-authenticity-guide-2026
                  </Ext>
                </li>
                <li>
                  <Ext href="https://qiita.com/kai_kou/items/1e7a5ed2ee470ebed394">
                    <span className={styles.refTitle}>OpenAI C2PA×SynthID入門 (Qiita)</span>
                    qiita.com/kai_kou/items/1e7a5ed2ee470ebed394
                  </Ext>
                </li>
                <li>
                  <Ext href="https://nandemo-tools.com/blog/digital-watermark-c2pa-ai-era">
                    <span className={styles.refTitle}>電子透かしの技術全解剖 (NanToo ブログ)</span>
                    nandemo-tools.com/blog/digital-watermark-c2pa-ai-era
                  </Ext>
                </li>
                <li>
                  <Ext href="https://openai.com/ja-JP/index/advancing-content-provenance/">
                    <span className={styles.refTitle}>より安全で透明性の高いAIエコシステムに向けて (OpenAI公式)</span>
                    openai.com/ja-JP/index/advancing-content-provenance
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.eyesift.com/faq/c2pa-content-credentials-2026-cryptographic-provenance-adoption/">
                    <span className={styles.refTitle}>C2PA Adoption Status 2026</span>
                    eyesift.com/faq/c2pa-content-credentials-2026
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.auditsocials.com/blog/ai-content-detection-technology-c2pa-watermarking-metadata-2026">
                    <span className={styles.refTitle}>AI Content Detection Tools 2026: C2PA, SynthID & Forensics</span>
                    auditsocials.com/blog/ai-content-detection-technology-2026
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCategory}>
              <h4>音楽生成AI・著作権</h4>
              <ul className={styles.refList}>
                <li>
                  <Ext href="https://techcreate.balubo.jp/articles/10000578">
                    <span className={styles.refTitle}>AI音楽生成ツール比較2026 (TechCreate)</span>
                    techcreate.balubo.jp/articles/10000578
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.matrixflow.net/case-study/126/">
                    <span className={styles.refTitle}>音楽×生成AIの完全ガイド (MatrixFlow)</span>
                    matrixflow.net/case-study/126
                  </Ext>
                </li>
                <li>
                  <Ext href="https://genai-ai.co.jp/ai-kanri/blog/cc-music-ai-tools/">
                    <span className={styles.refTitle}>音楽生成AIおすすめ完全ガイド</span>
                    genai-ai.co.jp/ai-kanri/blog/cc-music-ai-tools
                  </Ext>
                </li>
                <li>
                  <Ext href="https://tenbin.ai/media/generative_ai/ai-music-voice-2026-commercial-copyright">
                    <span className={styles.refTitle}>音楽・音声生成AI 目的別おすすめ5選 (天秤AIメディア byGMO)</span>
                    tenbin.ai/media/generative_ai/ai-music-voice-2026-commercial-copyright
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.matrixflow.net/case-study/137/">
                    <span className={styles.refTitle}>AI音楽生成ツール比較 (MatrixFlow)</span>
                    matrixflow.net/case-study/137
                  </Ext>
                </li>
                <li>
                  <Ext href="https://core-ms.net/2026/03/23/dtm-ai-music-tools-2026/">
                    <span className={styles.refTitle}>AI作曲ツール比較2026 (コアミュージックスクール)</span>
                    core-ms.net/2026/03/23/dtm-ai-music-tools-2026
                  </Ext>
                </li>
                <li>
                  <Ext href="https://niew.ai/ja/suno-alternatives">
                    <span className={styles.refTitle}>Suno AIの代替トップ5</span>
                    niew.ai/ja/suno-alternatives
                  </Ext>
                </li>
                <li>
                  <Ext href="https://ai-revolution.co.jp/media/what-is-suno/">
                    <span className={styles.refTitle}>Sunoとは？料金・機能・V5.5・著作権問題を完全解説</span>
                    ai-revolution.co.jp/media/what-is-suno
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.eesel.ai/ja/blog/suno-review">
                    <span className={styles.refTitle}>Sunoレビュー2026 (eesel AI)</span>
                    eesel.ai/ja/blog/suno-review
                  </Ext>
                </li>
                <li>
                  <Ext href="https://aipicks.jp/mag/suno-ai-guide-2026">
                    <span className={styles.refTitle}>Suno AIの使い方・料金を完全解説</span>
                    aipicks.jp/mag/suno-ai-guide-2026
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCategory}>
              <h4>リアルタイム音声対話・ネイティブマルチモーダル</h4>
              <ul className={styles.refList}>
                <li>
                  <Ext href="https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-3-1-flash-live/">
                    <span className={styles.refTitle}>Build real-time conversational agents with Gemini 3.1 Flash Live (Google公式)</span>
                    blog.google/.../build-with-gemini-3-1-flash-live
                  </Ext>
                </li>
                <li>
                  <Ext href="https://ai.google.dev/gemini-api/docs/models">
                    <span className={styles.refTitle}>Models | Gemini API (Google公式ドキュメント)</span>
                    ai.google.dev/gemini-api/docs/models
                  </Ext>
                </li>
                <li>
                  <Ext href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-flash-live/">
                    <span className={styles.refTitle}>Gemini 3.1 Flash Live: Making audio AI more natural and reliable (Google公式)</span>
                    blog.google/.../gemini-3-1-flash-live
                  </Ext>
                </li>
                <li>
                  <Ext href="https://cloud.google.com/blog/topics/developers-practitioners/how-to-use-gemini-live-api-native-audio-in-vertex-ai">
                    <span className={styles.refTitle}>How to use Gemini Live API Native Audio in Vertex AI (Google Cloud Blog)</span>
                    cloud.google.com/blog/.../gemini-live-api-native-audio-in-vertex-ai
                  </Ext>
                </li>
                <li>
                  <Ext href="https://flowtivity.ai/blog/gemini-3-1-flash-live-vs-gpt-realtime-1-5-voice-agent-comparison-2026/">
                    <span className={styles.refTitle}>Gemini 3.1 Flash Live vs GPT Realtime 1.5比較</span>
                    flowtivity.ai/blog/gemini-3-1-flash-live-vs-gpt-realtime-1-5
                  </Ext>
                </li>
                <li>
                  <Ext href="https://webscraft.org/blog/gptrealtime2-vs-gemini-live-api-scho-obrati-dlya-golosovogo-agenta-u-2026-rotsi?lang=en">
                    <span className={styles.refTitle}>GPT-Realtime-2 vs Gemini Live API比較</span>
                    webscraft.org/blog/gptrealtime2-vs-gemini-live-api
                  </Ext>
                </li>
                <li>
                  <Ext href="https://safina.ai/en/blog/gemini-3-1-flash-live-realtime-voice-ai/">
                    <span className={styles.refTitle}>Gemini 3.1 Flash Live: Google's Realtime Voice AI (Safina AI)</span>
                    safina.ai/en/blog/gemini-3-1-flash-live-realtime-voice-ai
                  </Ext>
                </li>
                <li>
                  <Ext href="https://www.marktechpost.com/2026/03/26/google-releases-gemini-3-1-flash-live-a-real-time-multimodal-voice-model-for-low-latency-audio-video-and-tool-use-for-ai-agents/">
                    <span className={styles.refTitle}>Google Releases Gemini 3.1 Flash Live (MarkTechPost)</span>
                    marktechpost.com/2026/03/26/google-releases-gemini-3-1-flash-live
                  </Ext>
                </li>
                <li>
                  <Ext href="https://docs.livekit.io/agents/models/realtime/plugins/gemini/">
                    <span className={styles.refTitle}>Gemini Live API plugin (LiveKit Documentation)</span>
                    docs.livekit.io/agents/models/realtime/plugins/gemini
                  </Ext>
                </li>
                <li>
                  <Ext href="https://softcery.com/lab/ai-voice-agents-real-time-vs-turn-based-tts-stt-architecture">
                    <span className={styles.refTitle}>Real-Time vs Turn-Based Voice Agents in 2026</span>
                    softcery.com/lab/ai-voice-agents-real-time-vs-turn-based
                  </Ext>
                </li>
              </ul>
            </div>

            <p className={styles.pageFooter}>
              本ガイドは2026年7月10日時点でWeb検索により収集した公開情報にもとづき作成されています。生成AI分野は変化が非常に速いため、実装・契約の際は必ず各社公式ドキュメントの最新版をご確認ください。
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
