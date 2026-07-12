import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title:
    "Google Stitch 実践ガイド - 初学者のためのステップバイステップ ベストプラクティス | LLM-Studies",
  description:
    "Google Labsが提供する無料のAIデザインツール「Google Stitch」の実践ガイド。Vibe Design、無限キャンバス、DESIGN.mdによるデザインシステム管理、MCP・SDK統合、プロンプト設計などのベストプラクティスを解説。",
};

const DIAGRAMS = {
  timeline: `flowchart LR
n1["2025年5月 GoogleIOで単一画面生成として公開"]
n2["2025年12月 Prototypes機能追加とGemini3導入"]
n3["2026年3月 vibe design発表 無限キャンバスとDESIGN.md追加"]
n4["2026年4月 DESIGN.mdをApache2.0でオープンソース化"]
n5["2026年5月 GoogleIOでストリーミング型design agent発表"]
n1 --> n2 --> n3 --> n4 --> n5
classDef purple fill:#2a2140,stroke:#a78bfa,color:#eef0f2
classDef teal fill:#123b38,stroke:#2dd4bf,color:#eef0f2
classDef coral fill:#3a1f1c,stroke:#f2836b,color:#eef0f2
classDef pink fill:#3a1f30,stroke:#f472b6,color:#eef0f2
class n1 purple
class n2 teal
class n3 coral
class n4,n5 pink`,

  overview: `flowchart TD
idea["アイデアとビジネス目標を言葉で説明"]
vibe["Vibe Designでキャンバス上に生成"]
iterate["テキスト 音声 注釈で反復修正"]
multi["マルチスクリーン生成で関連画面を追加"]
proto["Prototypesで画面を接続しユーザージャーニーを検証"]
expo["Figma コード AI Studio MCPへエクスポート"]
build["Figmaで仕上げ または開発チームへハンドオフ"]
idea --> vibe --> iterate --> multi --> proto --> expo --> build
classDef purple fill:#2a2140,stroke:#a78bfa,color:#eef0f2
classDef teal fill:#123b38,stroke:#2dd4bf,color:#eef0f2
classDef coral fill:#3a1f1c,stroke:#f2836b,color:#eef0f2
classDef pink fill:#3a1f30,stroke:#f472b6,color:#eef0f2
class idea,vibe purple
class iterate,multi teal
class proto,expo coral
class build pink`,

  setup: `flowchart TD
s1["1 stitch withgoogle com へアクセスしGoogleアカウントでサインイン"]
s2["2 New Projectをクリックして新規キャンバスを作成"]
s3["3 StandardモードかExperimentalモードかを選択"]
s4["4 WebかAppかのプラットフォームを選択"]
s5["5 構造化されたプロンプトを入力して生成"]
s6["6 生成結果をレビューし追加プロンプトで反復修正"]
s7["7 必要に応じてマルチセレクトで複数画面へ一括適用"]
s8["8 Figma コード MCPなどへエクスポート"]
s1 --> s2 --> s3 --> s4 --> s5 --> s6 --> s7 --> s8
classDef purple fill:#2a2140,stroke:#a78bfa,color:#eef0f2
classDef teal fill:#123b38,stroke:#2dd4bf,color:#eef0f2
classDef coral fill:#3a1f1c,stroke:#f2836b,color:#eef0f2
classDef pink fill:#3a1f30,stroke:#f472b6,color:#eef0f2
class s1,s2 purple
class s3,s4,s5 teal
class s6,s7 coral
class s8 pink`,

  zoom: `flowchart TD
zo["Zoom Out 想定ユーザー プラットフォームなど大枠 of コンテキストを設定"]
zi["Zoom In 画面のゴール レイアウト階層 主要コンポーネントを定義"]
gen["Stitchが具体的なレイアウト判断を行い生成"]
zo --> zi --> gen
classDef purple fill:#2a2140,stroke:#a78bfa,color:#eef0f2
classDef teal fill:#123b38,stroke:#2dd4bf,color:#eef0f2
classDef coral fill:#3a1f1c,stroke:#f2836b,color:#eef0f2
class zo purple
class zi teal
class gen coral`,

  designmd: `flowchart LR
brand["ブランド資産 または参考URL"]
extract["Stitchでデザインシステムを抽出生成"]
file["DESIGN.mdファイルとして出力"]
repo["Gitリポジトリへコミットしバージョン管理"]
reuse["別のStitchプロジェクトへ再インポート"]
agents["Claude Code Cursor Gemini CLIなどが読み込み適用"]
brand --> extract --> file --> repo
repo --> reuse
repo --> agents
classDef purple fill:#2a2140,stroke:#a78bfa,color:#eef0f2
classDef teal fill:#123b38,stroke:#2dd4bf,color:#eef0f2
classDef coral fill:#3a1f1c,stroke:#f2836b,color:#eef0f2
classDef pink fill:#3a1f30,stroke:#f472b6,color:#eef0f2
class brand purple
class extract,file teal
class repo coral
class reuse,agents pink`,

  export: `flowchart TD
gen2["Stitchで高速に方向性を探索生成"]
figma["Figmaへエクスポートしチームでレビュー"]
code["コードエクスポートで開発ハンドオフ"]
studio["AI Studioでバックエンド連携を実験"]
gen2 --> figma
gen2 --> code
gen2 --> studio
classDef purple fill:#2a2140,stroke:#a78bfa,color:#eef0f2
classDef teal fill:#123b38,stroke:#2dd4bf,color:#eef0f2
classDef coral fill:#3a1f1c,stroke:#f2836b,color:#eef0f2
class gen2 purple
class figma,code,studio teal`,

  mcp: `flowchart TD
dev["開発者がIDE上でエージェントに指示 例 Claude CodeやCursor"]
mcpclient["MCPクライアント設定を通じてStitch MCPサーバーへ接続"]
mcpserver["Stitch MCPサーバー 公式またはコミュニティ製プロキシ"]
api["Stitch API generate screen from text等のツール群"]
result["生成されたHTMLとデザインメタデータを取得"]
integrate["エージェントが自分のコードベースへ統合"]
dev --> mcpclient --> mcpserver --> api --> result --> integrate
classDef purple fill:#2a2140,stroke:#a78bfa,color:#eef0f2
classDef teal fill:#123b38,stroke:#2dd4bf,color:#eef0f2
classDef coral fill:#3a1f1c,stroke:#f2836b,color:#eef0f2
classDef pink fill:#3a1f30,stroke:#f472b6,color:#eef0f2
class dev purple
class mcpclient,mcpserver teal
class api,result coral
class integrate pink`,
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function GoogleStitchGuidePage() {
  return (
    <div className={styles.pageWrap}>
      <TocObserver />
      <div className={styles.layout}>
        <nav className={styles.sidebar} id="stitchSideNav">
          <button className={styles.mobileToggle} id="stitchNavToggle" type="button">
            <i className="ti ti-menu-2" />
            目次を開く
          </button>
          <p className={styles.navTitle}>目次</p>
          <ul className={styles.navList} id="stitchNavList">
            <li>
              <a href="#s1" className={styles.tocLink}>
                1. Stitchとは何か
              </a>
            </li>
            <li>
              <a href="#s2" className={styles.tocLink}>
                2. 開発の背景と沿革
              </a>
            </li>
            <li>
              <a href="#s3" className={styles.tocLink}>
                3. 主要機能の全体像
              </a>
            </li>
            <li>
              <a href="#s4" className={styles.tocLink}>
                4. 料金体系と利用制限
              </a>
            </li>
            <li>
              <a href="#s5" className={styles.tocLink}>
                5. セットアップと基本操作
              </a>
            </li>
            <li>
              <a href="#s6" className={styles.tocLink}>
                6. プロンプト設計
              </a>
            </li>
            <li>
              <a href="#s7" className={styles.tocLink}>
                7. DESIGN.mdの活用
              </a>
            </li>
            <li>
              <a href="#s8" className={styles.tocLink}>
                8. マルチスクリーンとプロトタイプ
              </a>
            </li>
            <li>
              <a href="#s9" className={styles.tocLink}>
                9. Voice CanvasとAgent Manager
              </a>
            </li>
            <li>
              <a href="#s10" className={styles.tocLink}>
                10. エクスポートとハンドオフ
              </a>
            </li>
            <li>
              <a href="#s11" className={styles.tocLink}>
                11. MCP・SDK統合
              </a>
            </li>
            <li>
              <a href="#s12" className={styles.tocLink}>
                12. Do / Don't 早見表
              </a>
            </li>
            <li>
              <a href="#s13" className={styles.tocLink}>
                13. 既知の制限事項
              </a>
            </li>
            <li>
              <a href="#s14" className={styles.tocLink}>
                14. 他ツールとの比較
              </a>
            </li>
            <li>
              <a href="#s15" className={styles.tocLink}>
                15. まとめと次のステップ
              </a>
            </li>
            <li>
              <a href="#s16" className={styles.tocLink}>
                16. 参考文献
              </a>
            </li>
          </ul>
        </nav>

        <main className={styles.main}>
          <div className={styles.hero}>
            <h1>
              Google Stitch 実践ガイド
              <br />
              初学者のためのステップバイステップ ベストプラクティス
            </h1>
            <div className={styles.meta}>
              <span className={styles.pill}>
                <i className="ti ti-calendar" />
                最終確認日: 2026年7月11日
              </span>
              <span className={styles.pill}>
                <i className="ti ti-link" />
                <Ext href="https://stitch.withgoogle.com/">stitch.withgoogle.com</Ext>
              </span>
              <span className={styles.pill}>
                <i className="ti ti-users" />
                対象: UI/UX初学者のエンジニア・PM・デザイナー
              </span>
            </div>
          </div>

          <section id="s1" className={styles.stitchSection}>
            <h2>
              <span className={styles.stepNum}>1</span>Stitchとは何か
            </h2>
            <p className={styles.lead}>
              Google Stitchは、Google Labsが提供する無料のAIデザインツールで、自然言語のプロンプトやスケッチ画像からモバイル向け・Web向けのUIデザインを生成する。公式サイトの説明では、モバイルアプリとWebアプリケーション向けのUIを生成し、デザインの発案（ideation）を高速かつ簡単にすることを目的としたツールだと位置づけられている。
              <span className={`${styles.badge} ${styles.badgeOfficial}`}>
                <i className="ti ti-brand-google" />
                公式
              </span>
              {" "}
              <Ext href="https://stitch.withgoogle.com/">stitch.withgoogle.com</Ext>
            </p>

            <p>
              2026年3月の大型アップデート以降、Stitchは単なる「1画面を生成する実験」から、テキストのみならず画像やコードもコンテキストとして扱える「AIネイティブな無限キャンバス」へと進化した。Googleはこの新しい体験を「vibe design（バイブデザイン）」と呼んでおり、ワイヤーフレームから始めるのではなく、実現したいビジネス目標やユーザーに与えたい感情を言葉で説明するところから設計を始められる点が特徴だとしている。
              <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span>
              {" "}
              <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/">
                Google公式ブログ
              </Ext>
            </p>

            <h3>得意なこと・不得意なこと</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "16%" }}>観点</th>
                    <th>内容</th>
                    <th style={{ width: "22%" }}>出典</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>得意なこと</td>
                    <td>
                      テキストや画像から短時間で高品質な最初のドラフト画面を作る、複数の画面をまたいで一貫したトンマナを素早く出す
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://tech-insider.org/google-stitch-ai-design-tool-march-2026-update/">
                        Tech Insider
                      </Ext>
                      ,{" "}
                      <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/">
                        Google公式
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>不得意なこと</td>
                    <td>
                      ピクセル単位の精密な編集、要素単位の細かい選択・修正、ローディングアニメーションなどのマイクロインタラクション設計
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://moda.app/blog/google-stitch-review">Moda</Ext>
                      ,{" "}
                      <Ext href="https://www.nxcode.io/resources/news/google-stitch-complete-guide-vibe-design-2026">
                        NxCode
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>向いていない用途</td>
                    <td>
                      プレゼン資料、SNS用画像、マーケティング素材などUI以外のビジュアルコンテンツ制作
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://moda.app/blog/google-stitch-review">Moda</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>位置づけ</td>
                    <td>
                      「探索・プロトタイピングの入口」であり、Figmaなど従来の設計ツールを置き換えるものではない
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://gozade.com/blog/google-stitch-review-2026-a-gozade-verdict-on-the-ai-ui-design-tool-everyone-is-talking-about">
                        Gozade
                      </Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="s2" className={styles.stitchSection}>
            <h2>
              <span className={styles.stepNum}>2</span>開発の背景と沿革
            </h2>
            <p>
              Stitchの前身は、2022年に登場したプロンプトからUIモックアップを生成するツール「Galileo AI」である。Googleは2025年初頭にGalileo AIを買収し、Gemini系モデルと統合したうえで「Stitch」としてGoogle Labsからリブランド発表した。
              <Ext href="https://gozade.com/blog/google-stitch-review-2026-a-gozade-verdict-on-the-ai-ui-design-tool-everyone-is-talking-about">
                Gozade
              </Ext>
              {" / "}
              <Ext href="https://almcorp.com/blog/google-stitch-complete-guide-ai-ui-design-tool-2026/">
                ALM Corp
              </Ext>
            </p>

            <div className={styles.diagram}>
              <div style={{ width: "100%" }}>
                <MermaidDiagram chart={DIAGRAMS.timeline} />
                <p className={styles.diagramCaption}>Stitchの主な沿革タイムライン</p>
              </div>
            </div>

            <ul>
              <li>
                <strong>2025年5月20日</strong> - Google I/Oにて、単一画面をテキストプロンプトまたは画像アップロードから生成するシンプルな実験としてスタート。
                <span className={styles.srcLink}>
                  <Ext href="https://tech-insider.org/google-stitch-ai-design-tool-march-2026-update/">
                    Tech Insider
                  </Ext>
                </span>
              </li>
              <li>
                <strong>2025年12月</strong> - 複数画面を接続してインタラクティブなプロトタイプとして体験できる「Prototypes」機能が追加され、Gemini 3がStitchに導入された。
                <span className={styles.srcLink}>
                  <Ext href="https://almcorp.com/blog/google-stitch-complete-guide-ai-ui-design-tool-2026/">
                    ALM Corp
                  </Ext>
                  {" / "}
                  <Ext href="https://www.nxcode.io/resources/news/google-stitch-complete-guide-vibe-design-2026">
                    NxCode
                  </Ext>
                </span>
              </li>
              <li>
                <strong>2026年3月18〜19日</strong> - 「vibe design」と名付けられた大型アップデートが発表され、AIネイティブな無限キャンバス、Voice Canvas、Agent Manager、DESIGN.mdが同時に導入された。
                <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span>
                {" "}
                <span className={styles.srcLink}>
                  <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/">
                    Google公式ブログ
                  </Ext>
                </span>
                。このアップデート発表後、競合であるFigmaの株価が数日間で下落したと複数メディアが報じている。
                <span className={styles.srcLink}>
                  <Ext href="https://tech-insider.org/google-stitch-ai-design-tool-march-2026-update/">
                    Tech Insider
                  </Ext>
                  {" / "}
                  <Ext href="https://www.the-ai-corner.com/p/google-stitch-ai-design-tool-guide-2026">
                    The AI Corner
                  </Ext>
                </span>
              </li>
              <li>
                <strong>2026年4月21〜23日</strong> - DESIGN.mdの草案仕様がApache 2.0ライセンスでオープンソース化され、Stitch以外のツールでも利用可能になった。
                <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span>
                {" "}
                <span className={styles.srcLink}>
                  <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/">
                    Google公式ブログ
                  </Ext>
                </span>
              </li>
              <li>
                <strong>2026年5月20日</strong> - Google I/O 2026にて、画面を生成しながらリアルタイムに描画するストリーミング型design agentが発表された。
                <span className={styles.srcLink}>
                  <Ext href="https://techlogstack.com/explore/google-stitch-ai-design-tool-2026/">
                    TechLogStack
                  </Ext>
                </span>
              </li>
            </ul>

            <div className={`${styles.callout} ${styles.calloutInfo}`}>
              <i className="ti ti-info-circle" />
              <div className={styles.calloutBody}>
                Stitchは現在もGoogle Labsの実験的プロダクトという位置づけであり、正式な稼働保証（SLA）やエンタープライズ向けの長期コミットメントは公表されていない点には留意したい。
                <span className={styles.srcLink}>
                  <Ext href="https://moda.app/blog/google-stitch-review">Moda</Ext>
                  {" / "}
                  <Ext href="https://computertech.co/google-stitch-review/">ComputerTech</Ext>
                </span>
              </div>
            </div>
          </section>

          <section id="s3" className={styles.stitchSection}>
            <h2>
              <span className={styles.stepNum}>3</span>主要機能の全体像
            </h2>
            <p>
              2026年3月のアップデート以降、Stitchが提供する主な機能は次のとおりである。
              <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span>
              {" "}
              <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/">
                Google公式ブログ
              </Ext>
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>機能</th>
                    <th>概要</th>
                    <th style={{ width: "20%" }}>出典</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Vibe Design</td>
                    <td>
                      ワイヤーフレームではなく、達成したいビジネス目標やユーザーに与えたい感情を言葉で説明することから設計を始めるアプローチ
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/">
                        Google公式
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>AIネイティブな無限キャンバス</td>
                    <td>
                      画像・テキスト・コードをそのままコンテキストとしてキャンバスに置ける、発散と収束を繰り返すためのワークスペース
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/">
                        Google公式
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Design agent / Agent manager</td>
                    <td>
                      プロジェクト全体の変遷を踏まえて提案するエージェントと、複数案を並行して整理しながら進捗を追跡する管理機能
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/">
                        Google公式
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>DESIGN.md</td>
                    <td>
                      デザインルールをエクスポート・インポートできるagent-friendlyなMarkdown形式のファイル
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/">
                        Google公式
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Prototypes（画面接続）</td>
                    <td>
                      画面同士を数秒で接続し、Playボタンでユーザージャーニーをプレビューできる。クリックに応じて次の論理的な画面を自動生成することも可能
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/">
                        Google公式
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Voice Canvas（音声操作）</td>
                    <td>キャンバスに直接話しかけ、リアルタイムのデザイン批評や更新を受けられる</td>
                    <td className={styles.srcLink}>
                      <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/">
                        Google公式
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>マルチスクリーン生成</td>
                    <td>1回のプロンプトで最大5画面程度の相互接続された画面をまとめて生成できる</td>
                    <td className={styles.srcLink}>
                      <Ext href="https://tech-insider.org/google-stitch-ai-design-tool-march-2026-update/">
                        Tech Insider
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>MCPサーバー・SDK・Skills</td>
                    <td>
                      Stitchの機能をAIコーディングエージェント（Claude Code、Cursor、Gemini CLIなど）から呼び出せるようにする開発者向けの仕組み
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://github.com/google-labs-code/stitch-sdk">GitHub</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Figma / AI Studio / Antigravityへのエクスポート</td>
                    <td>
                      編集可能なレイヤーとAuto Layout付きでFigmaへ、あるいは開発ツールへデザインを渡せる
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/">
                        Google公式
                      </Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.diagram}>
              <div style={{ width: "100%" }}>
                <MermaidDiagram chart={DIAGRAMS.overview} />
                <p className={styles.diagramCaption}>Stitchを使った全体ワークフロー</p>
              </div>
            </div>
          </section>

          <section id="s4" className={styles.stitchSection}>
            <h2>
              <span className={styles.stepNum}>4</span>料金体系と利用制限
            </h2>
            <p>
              Stitchは2026年7月時点でも引き続きGoogle Labsの実験プロダクトとして無料で提供されており、クレジットカード登録なしでGoogleアカウントのみでサインインできる。
              <Ext href="https://www.nxcode.io/resources/news/google-stitch-pricing-plans-complete-guide-2026">
                NxCode
              </Ext>
              {" / "}
              <Ext href="https://moda.app/blog/google-stitch-review">Moda</Ext>
            </p>

            <p>
              ただし、利用上限（生成回数の上限）についてはメディアごとに報告内容が異なり、2026年内でも変遷している点に注意が必要である。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "18%" }}>報告時期</th>
                    <th>Standardモード上限</th>
                    <th>Experimental / Proモード上限</th>
                    <th style={{ width: "18%" }}>出典</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2026年1〜2月頃</td>
                    <td>月350回（Gemini 2.5 Flash）</td>
                    <td>月50回（Gemini 2.5 Pro）</td>
                    <td className={styles.srcLink}>
                      <Ext href="https://www.toolworthy.ai/tool/stitch-by-google">Toolworthy</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>2026年3〜4月頃（vibe designアップデート後）</td>
                    <td>月350回</td>
                    <td>月200回に拡大</td>
                    <td className={styles.srcLink}>
                      <Ext href="https://www.nxcode.io/resources/news/google-stitch-pricing-plans-complete-guide-2026">
                        NxCode
                      </Ext>
                      {" / "}
                      <Ext href="https://moda.app/blog/google-stitch-review">Moda</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>2026年4月以降の一部報告</td>
                    <td colSpan={2}>
                      1日あたり設計クレジット400・redesignクレジット15の日次制へ移行との報告あり
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://www.banani.co/blog/google-stitch-pricing-and-credits">Banani</Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`${styles.callout} ${styles.calloutWarning}`}>
              <i className="ti ti-alert-triangle" />
              <div className={styles.calloutBody}>
                <strong>実務上のポイント</strong>：数値は変動するため、本ガイドの数字を鵜呑みにせず、実際にサインインした際のアカウント設定画面や利用状況表示で最新の上限を確認することを強く推奨する。現時点でも有料プランや追加クレジットの購入手段は公式に案内されていない。
                <span className={styles.srcLink}>
                  <Ext href="https://computertech.co/google-stitch-review/">ComputerTech</Ext>
                </span>
              </div>
            </div>
          </section>

          <section id="s5" className={styles.stitchSection}>
            <h2>
              <span className={styles.stepNum}>5</span>セットアップと基本操作
            </h2>
            <p>
              初めてStitchを使う場合の手順は次のとおりである。
              <Ext href="https://www.nxcode.io/resources/news/google-stitch-tutorial-design-first-app-2026">
                NxCode
              </Ext>
              {" / "}
              <Ext href="https://uithings.com/what-is-google-stitch">UIThings</Ext>
            </p>

            <div className={styles.diagram}>
              <div style={{ width: "100%" }}>
                <MermaidDiagram chart={DIAGRAMS.setup} />
                <p className={styles.diagramCaption}>セットアップ〜初回デザイン生成のステップフロー</p>
              </div>
            </div>

            <ol>
              <li>
                <strong>サインイン</strong>：
                <Ext href="https://stitch.withgoogle.com/">stitch.withgoogle.com</Ext>
                にアクセスし、個人のGoogleアカウントでサインインすればよい。ウェイトリストやクレジットカード登録は不要である。なお、Google Workspaceアカウントを利用する場合は、管理者側で「Google Workspace Experiments」を有効化しておく必要があるとの報告があるため、組織アカウントで表示されない場合はまずこの設定を確認するとよい（この点は公式ドキュメント未確認の情報である点に留意）。
                <span className={styles.srcLink}>
                  <Ext href="https://marketingagent.blog/2026/03/26/tutorial-build-app-prototypes-with-google-stitch/">
                    Marketing Agent Blog
                  </Ext>
                </span>
              </li>
              <li>
                <strong>新規プロジェクト作成</strong>：ダッシュボードから新規プロジェクトを開始すると、中央に無限キャンバス、左下にチャット入力欄、上部にモード切り替えが表示される。
              </li>
              <li>
                <strong>モード選択</strong>：探索段階の速さを優先するか、画像入力や高精浅な仕上がりを優先するかで、StandardモードとExperimentalモードを使い分ける。
              </li>
              <li>
                <strong>プラットフォーム選択</strong>：モバイルアプリを想定するか、Webサイト・Webアプリを想定するかをトグルで指定する。
              </li>
              <li>
                <strong>プロンプト入力</strong>：具体性が高いほど良い結果につながる（詳細は第6章）。
              </li>
              <li>
                <strong>反復修正</strong>：生成後は会話形式で追加指示を出し、微調整を重ねる。
              </li>
              <li>
                <strong>マルチセレクト一括編集</strong>：Shiftキーを押しながら複数画面を選択し、1つのプロンプトやテーマ変更を一括適用することで、画面間の一貫性を保ちやすくなる。
              </li>
              <li>
                <strong>エクスポート</strong>：詳細は第10章で扱う。
              </li>
            </ol>

            <h3>StandardモードとExperimentalモードの使い分け</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>Standardモード</th>
                    <th>Experimental / Proモード</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ベースモデル</td>
                    <td>Gemini 2.5 Flash系</td>
                    <td>Gemini 2.5 Pro系（最新ではGemini 3系の報告もあり）</td>
                  </tr>
                  <tr>
                    <td>向いている場面</td>
                    <td>素早い反復・複数案の探索・アイデア出し</td>
                    <td>高精細な仕上がり・画像入力を使った検討</td>
                  </tr>
                  <tr>
                    <td>入力形式</td>
                    <td>テキストが中心</td>
                    <td>テキストに加え画像・スケッチも活用可能</td>
                  </tr>
                  <tr>
                    <td>Figmaへのエクスポート</td>
                    <td>対応（テキストプロンプトから生成した場合）</td>
                    <td>一部レポートでは非対応、または制限ありと報告</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.srcLink}>
              出典:{" "}
              <Ext href="https://almcorp.com/blog/google-stitch-complete-guide-ai-ui-design-tool-2026/">
                ALM Corp
              </Ext>
              ,{" "}
              <Ext href="https://uxpilot.ai/blogs/google-stitch-ai">UX Pilot</Ext>
              ,{" "}
              <Ext href="https://uithings.com/what-is-google-stitch">UIThings</Ext>
            </p>

            <div className={`${styles.callout} ${styles.calloutSuccess}`}>
              <i className="ti ti-bulb" />
              <div className={styles.calloutBody}>
                アイデア出しの段階ではStandardモードで数多くの方向性を素早く試し、方向性が固まった段階でExperimentalモードに切り替えて仕上げの精度を上げる、という使い分けが複数の解説記事で推奨されている。
                <span className={styles.srcLink}>
                  <Ext href="https://computertech.co/google-stitch-review/">ComputerTech</Ext>
                </span>
              </div>
            </div>
          </section>

          <section id="s6" className={styles.stitchSection}>
            <h2>
              <span className={styles.stepNum}>6</span>プロンプト設計のベストプラクティス
            </h2>
            <p>
              Stitchの出力品質を左右する最大の変数はプロンプトの質である。曖昧なプロンプトは汎用的なレイアウトしか生まないが、具体的なプロンプトは実際に使えるものを生む、と複数の実践記事が指摘している。
              <Ext href="https://blog.openreplay.com/prompt-ui-google-stitch/">OpenReplay</Ext>
            </p>

            <h3>6.1 Zoom-Out-Zoom-Inフレームワーク</h3>
            <p>
              実践者コミュニティで有効とされているのが「Zoom-Out-Zoom-In」というフレームワークである。
            </p>

            <div className={styles.diagram}>
              <div style={{ width: "100%" }}>
                <MermaidDiagram chart={DIAGRAMS.zoom} />
                <p className={styles.diagramCaption}>Zoom-Out-Zoom-Inプロンプトフレームワーク</p>
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>要素</th>
                    <th>記述内容の例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Context（背景）</td>
                    <td>
                      チーム運用状況を毎日確認するB2Bプロジェクト管理SaaSの管理者ダッシュボードである、という前提
                    </td>
                  </tr>
                  <tr>
                    <td>Screen goal（画面の目的）</td>
                    <td>
                      アクティブなプロジェクト数、チームの稼働状況、遅延タスクを一目で把握できるようにする
                    </td>
                  </tr>
                  <tr>
                    <td>Layout（構造）</td>
                    <td>
                      上部固定ナビ、KPIカードの並び、稼働状況を示す横棒グラフ、その下に遅延タスク一覧
                    </td>
                  </tr>
                  <tr>
                    <td>Visual direction（見た目の方向性）</td>
                    <td>装飾を排したクリーンでデータ密度の高い配色</td>
                  </tr>
                  <tr>
                    <td>Constraints（制約）</td>
                    <td>
                      デスクトップファースト、アクセシブルな文字サイズ、
                      <Ext href="https://www.w3.org/TR/WCAG21/">WCAG 2.1</Ext>
                      のコントラスト基準準拠
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.srcLink}>
              出典:{" "}
              <Ext href="https://blog.openreplay.com/prompt-ui-google-stitch/">OpenReplay</Ext>
            </p>

            <h3>6.2 プロンプトを構成する5つの要素</h3>
            <p>
              別の実践記事では、出力品質を大きく左右する要素として次の5点を挙げている。
              <Ext href="https://www.allaboutai.com/ai-how-to/use-google-stitch-for-ui-design/">All About AI</Ext>
            </p>
            <ol>
              <li>
                <strong>プラットフォーム指定</strong>：「モバイルアプリを作って」「Webダッシュボードをデザインして」など
              </li>
              <li>
                <strong>目的・機能の明示</strong>：何のためのアプリ・画面かを明確にする
              </li>
              <li>
                <strong>レイアウトスタイル</strong>：カード形式か、リスト形式か、といった構造の指定
              </li>
              <li>
                <strong>カラーテーマ</strong>：具体的な色味や雰囲気（例：スカイブルーのテーマ、ダークネイビーのヒーローセクションなど）
              </li>
              <li>
                <strong>主要な操作要素</strong>：検索バー、お気に入りボタンなど、含めたいUI部品を具体的に列挙する
              </li>
            </ol>

            <h3>6.3 Skillsリポジトリが推奨するプロンプト構造</h3>
            <p>
              Google Labsが公開しているStitch Skillsのenhance-promptスキルでは、次のような構造化テンプレートを推奨している。
              <span className={`${styles.badge} ${styles.badgeCommunity}`}>コミュニティ</span>
              {" "}
              <Ext href="https://agentskills.so/skills/google-labs-code-stitch-skills-enhance-prompt">
                Agent Skills
              </Ext>
            </p>
            <ul>
              <li>見出し（ナビゲーションとロゴ、メニュー項目）</li>
              <li>ヒーローセクション（見出し・補足文・主要CTA）</li>
              <li>コンテンツエリア（主要コンテンツの説明）</li>
              <li>フッター（リンク・SNSアイコン・著作権表記）</li>
            </ul>
            <p>
              さらに、番号付きセクションで階層構造を明示すること、複数ページにまたがるプロジェクトではデザインシステム（DESIGN.md）を明示的に含めることが推奨されている。同スキルは、最新のベストプラクティスは公式ドキュメントの
              <Ext href="https://stitch.withgoogle.com/docs/learn/prompting/">
                Stitch Effective Prompting Guide
              </Ext>
              を優先して参照するよう案内している。
            </p>

            <h3>6.4 反復修正（イテレーション）のコツ</h3>
            <ul>
              <li>
                1回の生成がAI生成のクレジットを消費するため、テキストの文言変更や配色スウォッチの変更程度であれば、キャンバス上の直接編集（クレジットを消費しない操作）を活用する。
                <span className={styles.srcLink}>
                  <Ext href="https://justinmckelvey.com/blog/how-to-use-google-stitch">
                    Justin McKelvey
                  </Ext>
                </span>
              </li>
              <li>
                AI生成のクレジットは、新規画面の追加、レイアウトの大幅な変更、デザイン方向性の刷新など、構造的な変更のために温存するとよい。
              </li>
              <li>
                修正を依頼する際も具体的に伝えると、これまでの文脈を踏まえた一貫性のある変更が適用されやすい。
                <span className={styles.srcLink}>
                  <Ext href="https://blog.openreplay.com/prompt-ui-google-stitch/">OpenReplay</Ext>
                </span>
              </li>
            </ul>
          </section>

          <section id="s7" className={styles.stitchSection}>
            <h2>
              <span className={styles.stepNum}>7</span>DESIGN.mdによるデザインシステムの一貫性管理
            </h2>
            <p>
              DESIGN.mdは、Stitchで生まれた「デザインシステムのルールをプロジェクト間で持ち運ぶ」ためのMarkdown形式のファイルであり、2026年4月にApache 2.0ライセンスでオープンソース化された。
              <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span>
              {" "}
              <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/">
                Google公式ブログ
              </Ext>
            </p>

            <p>
              DESIGN.mdの狙いは、色や文字などの「値」だけでなく、その色が何のためにあるのか（primaryなのか、accentなのか等）という「意図」までAIエージェントに伝えることで、AIが推測に頼らずに済むようにする点にある。あわせて、生成された配色案がWCAGのアクセシビリティ基準を満たしているかを検証できる仕組みも含まれている。
            </p>

            <h3>7.1 DESIGN.mdの取得方法</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "26%" }}>作成方法</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>URLからの自動抽出</td>
                    <td>既存のWebサイトのURLを指定し、デザインシステムを自動的に抽出する</td>
                  </tr>
                  <tr>
                    <td>ブランド資産のアップロード</td>
                    <td>ロゴやビジュアルアイデンティティの資料をアップロードし、AIに解析させる</td>
                  </tr>
                  <tr>
                    <td>ゼロから作成</td>
                    <td>Stitchのインターフェース上で直接記述して作成する</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.srcLink}>
              出典:{" "}
              <Ext href="https://www.newsdefused.com/googles-stitch-open-sources-design-md-specification-to-make-brand-rules-portable-for-ai-agents/">
                News Defused
              </Ext>
            </p>

            <h3>7.2 DESIGN.mdの構成セクション</h3>
            <p>
              草案仕様では、9つの定義済みセクションからなるMarkdown構造が提案されている。代表的なセクションの例は次のとおり。
              <Ext href="https://pasqualepillitteri.it/en/news/1251/google-stitch-design-md-open-source-spec-2026">
                Pasquale Pillitteri
              </Ext>
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "26%" }}>セクション例</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Visual Theme &amp; Atmosphere</td>
                    <td>全体的なビジュアルのトーンやブランドが意図する審美的な方向性</td>
                  </tr>
                  <tr>
                    <td>Color Palette &amp; Roles</td>
                    <td>primary・surface・accent・errorなど、意味的な役割を持たせた色定義</td>
                  </tr>
                  <tr>
                    <td>Typography</td>
                    <td>見出しや本文で使うフォントファミリー・サイズなどの階層</td>
                  </tr>
                  <tr>
                    <td>Spacing / Radius</td>
                    <td>余白や角丸のトークン</td>
                  </tr>
                  <tr>
                    <td>Component Patterns</td>
                    <td>ボタンやカードなど代表的なコンポーネントの振る舞い</td>
                  </tr>
                  <tr>
                    <td>Tool-specific Notes（任意）</td>
                    <td>Gemini CLIやClaude Code、Cursorなど特定エージェント向けの補足指示</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.srcLink}>
              構成の全体像は複数の二次情報から要約したものであり、正式な全項目は
              <Ext href="https://github.com/google-labs-code/design.md">公式リポジトリ</Ext>
              を参照されたい。
            </p>

            <h3>7.3 DESIGN.mdを使った運用フロー</h3>
            <div className={styles.diagram}>
              <div style={{ width: "100%" }}>
                <MermaidDiagram chart={DIAGRAMS.designmd} />
                <p className={styles.diagramCaption}>
                  DESIGN.mdを使った一貫性のあるマルチプロジェクトワークフロー
                </p>
              </div>
            </div>

            <p>
              DESIGN.mdはプレーンなMarkdownファイルとしてリポジトリに置けるため、READMEと同じ感覚でGit管理・レビュー・差分確認ができる点が特徴である。
              <span className={styles.srcLink}>
                <Ext href="https://notes.nicolasdeville.com/ai/design-md/">Nic&apos;s Notes</Ext>
              </span>
              また、トークンはW3C Design Token Format（DTCG）と互換性を持たせる設計になっており、Tailwind設定ファイルなどへのエクスポートも想定されている。
              <span className={styles.srcLink}>
                <Ext href="https://medium.com/design-bootcamp/google-makes-design-md-open-source-on-its-way-to-become-a-industry-standard-16119f2368dd">
                  Medium
                </Ext>
              </span>
            </p>

            <div className={`${styles.callout} ${styles.calloutWarning}`}>
              <i className="ti ti-alert-triangle" />
              <div className={styles.calloutBody}>
                <strong>注意点</strong>：2026年7月時点でDESIGN.mdの仕様はまだ「alpha」段階であり、破壊的変更が入る可能性がある。金融・医療など規制対象のプロジェクトでの本番利用は時期尚早との指摘もある。
                <span className={styles.srcLink}>
                  <Ext href="https://vibecoding.app/blog/design-md-review">Vibecoding</Ext>
                </span>
                またガバナンス面では、Apache 2.0ライセンスではあるものの、現状は主にGoogle Labsが仕様策定を主導しており、W3CやOpenAPI Initiativeのような独立した標準化団体はまだ存在しない。
                <span className={styles.srcLink}>
                  <Ext href="https://pasqualepillitteri.it/en/news/1251/google-stitch-design-md-open-source-spec-2026">
                    Pasquale Pillitteri
                  </Ext>
                </span>
              </div>
            </div>
          </section>

          <section id="s8" className={styles.stitchSection}>
            <h2>
              <span className={styles.stepNum}>8</span>マルチスクリーン生成とプロトタイピング
            </h2>
            <p>
              2026年3月のアップデートにより、1回のプロンプトで最大5画面程度の相互接続された画面をまとめて生成できるようになった。例えば「チェックアウトフロー」と指示するだけで、カート画面・配送先入力・決済画面・注文完了画面・配送状況確認画面までを、統一されたタイポグラフィと配色で一括生成できる。
              <Ext href="https://tech-insider.org/google-stitch-ai-design-tool-march-2026-update/">
                Tech Insider
              </Ext>
            </p>

            <p>
              Prototypes機能を使うと、生成済みの画面同士を数秒で接続し、Playボタンを押すだけでアプリ内遷移を体験できる。さらに、あるボタンをクリックした際に遷移すべき「論理的に妥当な次の画面」をStitch自身が自動生成することも可能である。
              <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span>
              {" "}
              <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/">
                Google公式ブログ
              </Ext>
            </p>

            <p>
              一方で、長いフローを扱うと画面ごとにトーンがわずかにズレる（1画面目は洗練されているが4画面目で余白や配色が微妙に変化するなど）という指摘も複数のレビューで挙がっている。DESIGN.mdの活用はこの問題を緩和する手段の一つとされているが、完全には解決しないとの評価もある。
              <span className={styles.srcLink}>
                <Ext href="https://gozade.com/blog/google-stitch-review-2026-a-gozade-verdict-on-the-ai-ui-design-tool-everyone-is-talking-about">
                  Gozade
                </Ext>
              </span>
            </p>

            <div className={`${styles.callout} ${styles.calloutSuccess}`}>
              <i className="ti ti-bulb" />
              <div className={styles.calloutBody}>
                <strong>実務Tips</strong>：複数画面の一貫性を担保したい場合は、次の順序で進めると良い。
                <span className={styles.srcLink}>
                  <Ext href="https://www.sotaaz.com/post/stitch-mcp-guide-en">SOTAAZ Blog</Ext>
                </span>
                <ol>
                  <li>まず1つの基準となる画面（例：ダッシュボード）を生成する</li>
                  <li>
                    その画面から「デザインDNA」（配色・タイポグラフィ・コンポーネントパターン）を抽出する
                  </li>
                  <li>抽出したデザインDNAを参照しながら、2画面目以降を生成する</li>
                  <li>画面同士を比較し、不整合があれば個別に調整する</li>
                </ol>
              </div>
            </div>
          </section>

          <section id="s9" className={styles.stitchSection}>
            <h2>
              <span className={styles.stepNum}>9</span>Voice CanvasとAgent Managerの活用
            </h2>
            <p>
              Voice Canvasは、キャンバスに直接話しかけることでデザインを操作できる機能である。エージェントは会話をリアルタイムに解析し、「メニュー案を3パターン出して」「この画面を別のカラーパレットで見せて」といった発話に応じてキャンバスをその場で更新する。エージェントはランディングページの設計時にヒアリング形式で質問を投げかけたり、リアルタイムでデザイン批評を行ったりすることもできるとされている。
              <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span>
              {" "}
              <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/">
                Google公式ブログ
              </Ext>
            </p>

            <p>
              Agent Managerは、複数の方向性を並行して探索する際に進捗を管理するための機能である。デザインの発散と収束を繰り返すプロセスにおいて、どの案がどこまで進んでいるかを俯瞰しやすくする役割を持つ。
            </p>

            <h3>初学者向けの活用手順</h3>
            <ol>
              <li>まずテキストプロンプトで大枠のレイアウトを生成する</li>
              <li>
                Voice Canvasを使い、口頭で「もっとミニマルに」「アクセントカラーをコーラルに」など細かい調整を重ねる
              </li>
              <li>気に入った方向性が複数出てきたら、Agent Managerで並行管理しながら比較検討する</li>
              <li>最終的な1案に絞り込んだら、第10章のエクスポート手順に進む</li>
            </ol>
          </section>

          <section id="s10" className={styles.stitchSection}>
            <h2>
              <span className={styles.stepNum}>10</span>エクスポートとハンドオフワークフロー
            </h2>
            <p>
              Stitchのエクスポート経路は、大きく分けて「デザイナー向け（Figma）」「開発者向け（コード）」「Google生態系向け（AI Studio / Antigravity / Firebase Studio）」の3方向を想定して設計されている。
              <Ext href="https://techlogstack.com/explore/google-stitch-ai-design-tool-2026/">
                TechLogStack
              </Ext>
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "24%" }}>エクスポート先</th>
                    <th>用途</th>
                    <th style={{ width: "18%" }}>出典</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Figma</td>
                    <td>
                      編集可能なレイヤーとAuto Layout付きでデザインを渡し、デザインチームでのレビュー・仕上げに使う
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/">
                        Google公式
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>HTML / CSS・Tailwind CSS</td>
                    <td>そのまま実装のたたき台として使えるフロントエンドコードを出力する</td>
                    <td className={styles.srcLink}>
                      <Ext href="https://blog.openreplay.com/prompt-ui-google-stitch/">OpenReplay</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>React / Vue / Angular / Flutter / SwiftUIなど</td>
                    <td>
                      主要フロントエンドフレームワーク向けのコード出力（対応状況はアップデートにより変化）
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://tech-insider.org/google-stitch-ai-design-tool-march-2026-update/">
                        Tech Insider
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Google AI Studio</td>
                    <td>
                      デザインをバックエンドロジックと組み合わせてフルスタックで実験するための連携先
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://techlogstack.com/explore/google-stitch-ai-design-tool-2026/">
                        TechLogStack
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Antigravity</td>
                    <td>
                      Googleのコーディングエージェントへデザインを引き渡し、開発ワークフローへ接続する
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/">
                        Google公式
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>Firebase Studio</td>
                    <td>
                      Google製のクラウド開発環境へエクスポートし、デプロイ可能なコードへの道筋を作る
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://www.uxpin.com/studio/blog/google-stitch-ai-design-tool-updates-ui-ux/">
                        UXPin
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>MCPサーバー / 共有リンク</td>
                    <td>開発エージェントからの直接呼び出し、または閲覧用の共有プレビューURLの発行</td>
                    <td className={styles.srcLink}>
                      <Ext href="https://marketingagent.blog/2026/03/26/tutorial-build-app-prototypes-with-google-stitch/">
                        Marketing Agent Blog
                      </Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.diagram}>
              <div style={{ width: "100%" }}>
                <MermaidDiagram chart={DIAGRAMS.export} />
                <p className={styles.diagramCaption}>パワーユーザーが採用する統合的なハンドオフの流れ</p>
              </div>
            </div>

            <div className={`${styles.callout} ${styles.calloutWarning}`}>
              <i className="ti ti-alert-triangle" />
              <div className={styles.calloutBody}>
                <strong>注意点</strong>：画像入力を使うExperimentalモードで作成したデザインは、Figmaへのエクスポートに対応していない、または制限があるとの報告がある。
                <span className={styles.srcLink}>
                  <Ext href="https://uithings.com/what-is-google-stitch">UIThings</Ext>
                </span>
                Figma連携を業務フローの前提にする場合は、テキストプロンプトから生成する経路を基本とするか、事前に自分のアカウントで挙動を確認しておくとよい。また、AI Studioへのエクスポートでは一部のStitch固有機能が引き継がれない場合があるとの指摘もある。
                <span className={styles.srcLink}>
                  <Ext href="https://marketingagent.blog/2026/03/26/tutorial-build-app-prototypes-with-google-stitch/">
                    Marketing Agent Blog
                  </Ext>
                </span>
              </div>
            </div>
          </section>

          <section id="s11" className={styles.stitchSection}>
            <h2>
              <span className={styles.stepNum}>11</span>MCP・SDKによる開発者向け統合
            </h2>
            <p>
              Stitchは、Model Context Protocol（MCP）を通じてIDEやCLIから呼び出せる公式のMCPサーバーと、Node.js向けの公式SDK（<code>@google/stitch-sdk</code>）を提供している。あわせて、Claude Code・Cursor・Gemini CLI・Antigravityなど、Agent Skillsのオープン標準に対応したコーディングエージェント向けの「Stitch Skills」ライブラリも公開されている。
              <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span>
              {" "}
              <Ext href="https://github.com/google-labs-code/stitch-sdk">GitHub: stitch-sdk</Ext>
            </p>

            <h3>11.1 公式SDKの基本的な使い方</h3>
            <p>
              公式SDKには、低レベルのツールクライアント、Vercel AI SDK向けのツール定義、環境変数から自動初期化される簡易インスタンスなど複数のレイヤーが用意されている。認証には<code>STITCH_API_KEY</code>（APIキー）または<code>STITCH_ACCESS_TOKEN</code>（OAuthアクセストークン）のいずれかを使用する。
            </p>

            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>app.js</span>
                <span className={styles.codeLang}>javascript</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-javascript">
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>import</span>
                    <span>{" { "}</span>
                    <span className={styles.cv}>StitchToolClient</span>
                    <span>{" } "}</span>
                    <span className={styles.ck}>from</span>
                    <span className={styles.cs}> &quot;@google/stitch-sdk&quot;</span>
                    <span>;</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>const</span>
                    <span> client </span>
                    <span className={styles.ck}>=</span>
                    <span className={styles.ck}> new</span>
                    <span className={styles.cv}> StitchToolClient</span>
                    <span>{"({"}</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span>  apiKey</span>
                    <span className={styles.ck}>:</span>
                    <span className={styles.cs}> &quot;your-api-key&quot;</span>
                    <span>,</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span>  baseUrl</span>
                    <span className={styles.ck}>:</span>
                    <span className={styles.cs}> &quot;https://stitch.googleapis.com/mcp&quot;</span>
                    <span>,</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span>  timeout</span>
                    <span className={styles.ck}>:</span>
                    <span className={styles.cv}> 300005</span>
                    <span>,</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span>{"});"}</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>const</span>
                    <span> result </span>
                    <span className={styles.ck}>=</span>
                    <span className={styles.ck}> await</span>
                    <span> client</span>
                    <span className={styles.ck}>.</span>
                    <span className={styles.cv}>callTool</span>
                    <span>{"("}</span>
                    <span className={styles.cs}>&quot;generate_screen_from_text&quot;</span>
                    <span>{", {"}</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span>  prompt</span>
                    <span className={styles.ck}>:</span>
                    <span className={styles.cs}>
                      &quot;dark mode dashboard, card layout, top summary stats&quot;
                    </span>
                    <span>,</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span>{"});"}</span>
                  </div>
                </code>
              </pre>
            </div>

            <p className={styles.srcLink}>
              出典:{" "}
              <Ext href="https://github.com/google-labs-code/stitch-sdk">
                GitHub: google-labs-code/stitch-sdk
              </Ext>
            </p>

            <h3>11.2 コミュニティ製MCPサーバーの選択肢</h3>
            <p>
              公式SDK・MCPサーバーに加えて、コミュニティによって複数のMCPサーバー実装が公開されている。それぞれ思想や機能範囲が異なるため、用途に応じて選ぶとよい。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>プロジェクト</th>
                    <th>特徴</th>
                    <th>認証方式</th>
                    <th style={{ width: "14%" }}>出典</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span>{" "}
                      @_davideast/stitch-mcp
                    </td>
                    <td>
                      ローカルプレビューやAstroサイト生成など、開発者の実務動線に寄せたCLI一体型MCPサーバー
                    </td>
                    <td>gcloud CLI経由のOAuth</td>
                    <td className={styles.srcLink}>
                      <Ext href="https://github.com/davideast/stitch-mcp">GitHub</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span>{" "}
                      stitch-mcp (Kargatharaakash)
                    </td>
                    <td>ゼロコンフィグを重視したユニバーサルMCPサーバー。Windows/Mac/Linux対応</td>
                    <td>Google Cloud CLI経由</td>
                    <td className={styles.srcLink}>
                      <Ext href="https://github.com/Kargatharaakash/stitch-mcp">GitHub</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span>{" "}
                      stitch-mcp (piyushcreates)
                    </td>
                    <td>
                      公式Stitch APIへ直接接続する透過的な実装で、サードパーティのプロキシを挟まない
                    </td>
                    <td>APIキー</td>
                    <td className={styles.srcLink}>
                      <Ext href="https://github.com/piyushcreates/stitch-mcp">GitHub</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span>{" "}
                      stitch-mcp-server (oogleyskr)
                    </td>
                    <td>
                      アクセシビリティチェックやデザイン差分比較など、25個のツールを備えた統合型MCPサーバー
                    </td>
                    <td>APIキー / アクセストークン / gcloud CLI</td>
                    <td className={styles.srcLink}>
                      <Ext href="https://github.com/oogleyskr/stitch-mcp-server">GitHub</Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`${styles.callout} ${styles.calloutInfo}`}>
              <i className="ti ti-info-circle" />
              <div className={styles.calloutBody}>
                コミュニティ製ツールは公式のGoogleプロダクトではないため、導入前にリポジトリの内容とメンテナンス状況を確認することを推奨する。
              </div>
            </div>

            <h3>11.3 開発ワークフローのイメージ</h3>
            <div className={styles.diagram}>
              <div style={{ width: "100%" }}>
                <MermaidDiagram chart={DIAGRAMS.mcp} />
                <p className={styles.diagramCaption}>MCPを使った開発ワークフロー</p>
              </div>
            </div>

            <h3>11.4 Stitch Skillsで代表的にできること</h3>
            <p>
              Stitch Skillsライブラリでは、既存のフロントエンドコード（React、Vueなど）をHTML抽出とデザインシステム化を経てStitchプロジェクトへ取り込む、生成済み画面をReactやReact Nativeのコンポーネントへ変換する、複数画面のデザイン一貫性を検証する、といったワークフローがスキルとして提供されている。
              <span className={styles.srcLink}>
                <Ext href="https://github.com/google-labs-code/stitch-skills">
                  GitHub: stitch-skills
                </Ext>
              </span>
            </p>
          </section>

          <section id="s12" className={styles.stitchSection}>
            <h2>
              <span className={styles.stepNum}>12</span>Do / Don&apos;t 早見表
            </h2>

            <div className={styles.dodontGrid}>
              <div className={`${styles.dodontCol} ${styles.do}`}>
                <h4>
                  <i className="ti ti-circle-check" />
                  Do（推奨）
                </h4>
                <ul>
                  <li>
                    背景・目的・レイアウト構造・見た目・制約を順に言語化する（Zoom-Out-Zoom-In）
                  </li>
                  <li>探索段階はStandard、仕上げ段階はExperimentalと使い分ける</li>
                  <li>DESIGN.mdを作成し、複数プロジェクト・複数画面で再利用する</li>
                  <li>文言修正や配色スウォッチの変更はビジュアルエディタの直接編集で行う</li>
                  <li>基準画面のデザインDNAを抽出してから追加画面を生成する</li>
                  <li>テキストプロンプト由来のデザインをFigmaへエクスポートして仕上げる</li>
                  <li>生成コードは「たたき台」として扱い、開発者がレビュー・調整してから使う</li>
                  <li>MCP・SDK・Skillsを使い、DESIGN.mdをリポジトリで版管理する</li>
                  <li>
                    料金・上限・対応フレームワークなどは公式サイトや自分のアカウントで都度確認する
                  </li>
                </ul>
              </div>
              <div className={`${styles.dodontCol} ${styles.dont}`}>
                <h4>
                  <i className="ti ti-circle-x" />
                  Don&apos;t（避けたい）
                </h4>
                <ul>
                  <li>「いい感じにして」のような曖昧な一言で済ませる</li>
                  <li>最初から高精細モードだけで大量に試行し、上限を早期に使い切る</li>
                  <li>画面ごとに毎回ゼロから配色やフォントを指定する</li>
                  <li>些細な修正のたびにAI再生成を行い、クレジットを浪費する</li>
                  <li>各画面を独立したプロンプトでバラバラに生成し、後から統一しようとする</li>
                  <li>画像入力（Experimentalモード）由来のデザインでFigmaエクスポートを前提にする</li>
                  <li>生成されたコードをそのまま無検証で本番環境にデプロイする</li>
                  <li>プロンプトのたびに口頭でブランドルールを説明し直す</li>
                  <li>過去に読んだ数値（生成回数の上限など）を恒久的な仕様だと思い込む</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="s13" className={styles.stitchSection}>
            <h2>
              <span className={styles.stepNum}>13</span>既知の制限事項と注意点
            </h2>
            <p>Stitchを業務フローに組み込む前に把握しておきたい制限事項を整理する。</p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "22%" }}>制限事項</th>
                    <th>内容</th>
                    <th style={{ width: "18%" }}>出典</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ピクセル単位の精密編集が弱い</td>
                    <td>
                      要素を個別に選択して細かく調整するような、Figma的なワークフローには向いていない
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://moda.app/blog/google-stitch-review">Moda</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>実験プロダクトゆえの継続性リスク</td>
                    <td>
                      SLAや長期運用の保証がなく、Google Labsの過去の実績を踏まえると打ち切りの可能性もゼロではない
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://computertech.co/google-stitch-review/">ComputerTech</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>生成結果の非決定性</td>
                    <td>
                      同じプロンプトでも毎回異なる結果が出ることがあり、複雑な複合レイアウトでは複数回の反復が必要になりやすい
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://www.nxcode.io/resources/news/google-stitch-complete-guide-vibe-design-2026">
                        NxCode
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>マイクロインタラクション非対応</td>
                    <td>
                      ローディングアニメーション、ホバー効果、スクロール演出などはStitch内では設計できない
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://www.nxcode.io/resources/news/google-stitch-complete-guide-vibe-design-2026">
                        NxCode
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>長いフローでの一貫性のブレ</td>
                    <td>
                      画面数が増えるにつれ、余白やコンポーネントスタイルが微妙にズレていくことがある
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://gozade.com/blog/google-stitch-review-2026-a-gozade-verdict-on-the-ai-ui-design-tool-everyone-is-talking-about">
                        Gozade
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>汎用的な出力になりやすい</td>
                    <td>
                      独自のプロダクション用コンポーネントライブラリからではなく、Stitch自身のモデルからUIを生成するため、ブランド固有の要素は反映されにくい
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://www.uxpin.com/studio/blog/google-stitch-ai-design-tool-updates-ui-ux/">
                        UXPin
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>DESIGN.mdはalpha仕様</td>
                    <td>
                      フォーマットやCLIが今後変更される可能性があり、規制対象領域での本番利用には時期尚早との指摘がある
                    </td>
                    <td className={styles.srcLink}>
                      <Ext href="https://vibecoding.app/blog/design-md-review">Vibecoding</Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>利用上限に達すると新規生成が停止</td>
                    <td>上限に達すると翌月（または翌日）までAI生成そのものは待つ必要がある</td>
                    <td className={styles.srcLink}>
                      <Ext href="https://www.banani.co/blog/google-stitch-pricing-and-credits">Banani</Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="s14" className={styles.stitchSection}>
            <h2>
              <span className={styles.stepNum}>14</span>他ツールとの比較
            </h2>
            <p>
              Stitchの位置づけを理解するために、Figmaとの比較を整理する。あくまで一般的な傾向であり、両ツールとも継続的にアップデートされている点に留意されたい。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "18%" }}>観点</th>
                    <th>Google Stitch</th>
                    <th>Figma</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>得意な段階</td>
                    <td>初期アイデア出し・素早いプロトタイピング</td>
                    <td>精密な仕上げ・チームコラボレーション・本番デザインシステム管理</td>
                  </tr>
                  <tr>
                    <td>入力方法</td>
                    <td>自然言語プロンプト、画像・スケッチ、音声</td>
                    <td>マニュアル操作、プラグイン、一部AI機能</td>
                  </tr>
                  <tr>
                    <td>コスト</td>
                    <td>無料（Google Labs実験、上限あり）</td>
                    <td>有料プランが中心（無料枠は限定的）</td>
                  </tr>
                  <tr>
                    <td>学習コスト</td>
                    <td>低い（デザイン未経験でも扱える）</td>
                    <td>中〜高（レイヤー操作やAuto Layoutの理解が必要）</td>
                  </tr>
                  <tr>
                    <td>チームコラボレーション</td>
                    <td>
                      2026年5月時点で複数人同時編集機能が報告されているが、Figmaほど成熟していない
                    </td>
                    <td>リアルタイム共同編集、コメント、権限管理が成熟</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.srcLink}>
              出典:{" "}
              <Ext href="https://justinmckelvey.com/blog/how-to-use-google-stitch">
                Justin McKelvey
              </Ext>
              ,{" "}
              <Ext href="https://www.the-ai-corner.com/p/google-stitch-ai-design-tool-guide-2026">
                The AI Corner
              </Ext>
            </p>

            <p>
              複数のレビュー記事が共通して勧める現実的なワークフローは、「Stitchで探索し、Figmaで仕上げ、開発ツール（Antigravity・AI Studio・Claude Codeなど）でビルドする」というハイブリッド構成である。
              <span className={styles.srcLink}>
                <Ext href="https://www.nxcode.io/resources/news/google-stitch-complete-guide-vibe-design-2026">
                  NxCode
                </Ext>
              </span>
            </p>
          </section>

          <section id="s15" className={styles.stitchSection}>
            <h2>
              <span className={styles.stepNum}>15</span>まとめと次のステップ
            </h2>
            <p>
              Google Stitchは、2025年5月の単一画面生成という小さな実験から、2026年3月のvibe designアップデートを経て、無限キャンバス・Voice Canvas・DESIGN.md・MCP統合までを備えたAIネイティブなデザインキャンバスへと急速に進化してきた。初学者がまず押さえるべきポイントは次の3つに集約できる。
            </p>
            <ol>
              <li>
                <strong>プロンプトは構造化する</strong>：Zoom-Out-Zoom-Inフレームワークのように、背景・目的・構造・見た目・制約の順で言語化する。
              </li>
              <li>
                <strong>一貫性はDESIGN.mdで担保する</strong>：複数画面・複数プロジェクトにまたがる場合は、デザインシステムをMarkdownファイルとして持ち運ぶ。
              </li>
              <li>
                <strong>Stitchはゴールではなくスタート地点と捉える</strong>：生成された画面やコードは「たたき台」であり、Figmaでの仕上げや開発者によるレビューを経て初めて本番品質に近づく。
              </li>
            </ol>
            <p>
              次のステップとしては、まず小さな1画面（ログイン画面やダッシュボードなど）から試作を始め、慣れてきたらDESIGN.mdの作成、続いてMCP経由でのコーディングエージェントとの連携という順に発展させていくのが無理のない学習パスといえる。
            </p>
          </section>

          <section id="s16" className={styles.stitchSection}>
            <h2>
              <span className={styles.stepNum}>16</span>参考文献（URL一覧）
            </h2>
            <p>
              本ガイドの作成にあたり参照した情報源を一覧化する。
              <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span>
              はGoogleが公開している一次情報、
              <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span>
              は第三者メディア・コミュニティ製リポジトリを示す。
            </p>
            <ol className={styles.refList}>
              <li>
                <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span> Stitch 公式サイト -{" "}
                <Ext href="https://stitch.withgoogle.com/">https://stitch.withgoogle.com/</Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span>{" "}
                Google公式ブログ「Introducing &quot;vibe design&quot; with Stitch」 -{" "}
                <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/">
                  https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span>{" "}
                Tech Insider「Google Stitch AI: Vibe Design and 5-Screen Canvas」 -{" "}
                <Ext href="https://tech-insider.org/google-stitch-ai-design-tool-march-2026-update/">
                  https://tech-insider.org/google-stitch-ai-design-tool-march-2026-update/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> Moda「Google Stitch Review」 -{" "}
                <Ext href="https://moda.app/blog/google-stitch-review">
                  https://moda.app/blog/google-stitch-review
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> NxCode「Google Stitch Complete Guide」 -{" "}
                <Ext href="https://www.nxcode.io/resources/news/google-stitch-complete-guide-vibe-design-2026">
                  https://www.nxcode.io/resources/news/google-stitch-complete-guide-vibe-design-2026
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> Gozade「Google Stitch Review 2026」 -{" "}
                <Ext href="https://gozade.com/blog/google-stitch-review-2026-a-gozade-verdict-on-the-ai-ui-design-tool-everyone-is-talking-about">
                  https://gozade.com/blog/google-stitch-review-2026-a-gozade-verdict-on-the-ai-ui-design-tool-everyone-is-talking-about
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> ALM Corp「Google Stitch: The Complete Guide」 -{" "}
                <Ext href="https://almcorp.com/blog/google-stitch-complete-guide-ai-ui-design-tool-2026/">
                  https://almcorp.com/blog/google-stitch-complete-guide-ai-ui-design-tool-2026/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span>{" "}
                The AI Corner「Google Stitch: The Free AI Design Tool Killing Figma」 -{" "}
                <Ext href="https://www.the-ai-corner.com/p/google-stitch-ai-design-tool-guide-2026">
                  https://www.the-ai-corner.com/p/google-stitch-ai-design-tool-guide-2026
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span>{" "}
                Google公式ブログ「Stitch&apos;s DESIGN.md format is now open-source」 -{" "}
                <Ext href="https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/">
                  https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> TechLogStack「Google Stitch 2026」 -{" "}
                <Ext href="https://techlogstack.com/explore/google-stitch-ai-design-tool-2026/">
                  https://techlogstack.com/explore/google-stitch-ai-design-tool-2026/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span>{" "}
                ComputerTech「Google Stitch 2.0 Review 2026」 -{" "}
                <Ext href="https://computertech.co/google-stitch-review/">
                  https://computertech.co/google-stitch-review/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span> GitHub「google-labs-code/stitch-sdk」 -{" "}
                <Ext href="https://github.com/google-labs-code/stitch-sdk">
                  https://github.com/google-labs-code/stitch-sdk
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> NxCode「Google Stitch Pricing 2026」 -{" "}
                <Ext href="https://www.nxcode.io/resources/news/google-stitch-pricing-plans-complete-guide-2026">
                  https://www.nxcode.io/resources/news/google-stitch-pricing-plans-complete-guide-2026
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> Toolworthy「Stitch by Google」 -{" "}
                <Ext href="https://www.toolworthy.ai/tool/stitch-by-google">
                  https://www.toolworthy.ai/tool/stitch-by-google
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span>{" "}
                Aipedia「Google Stitch: Features, Pricing &amp; Review」 -{" "}
                <Ext href="https://www.aipedia.wiki/tools/google-stitch/">
                  https://www.aipedia.wiki/tools/google-stitch/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> Banani「Google Stitch Pricing」 -{" "}
                <Ext href="https://www.banani.co/blog/google-stitch-pricing-and-credits">
                  https://www.banani.co/blog/google-stitch-pricing-and-credits
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span>{" "}
                Justin McKelvey「How to Use Google Stitch」 -{" "}
                <Ext href="https://justinmckelvey.com/blog/how-to-use-google-stitch">
                  https://justinmckelvey.com/blog/how-to-use-google-stitch
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> NxCode「Google Stitch Tutorial」 -{" "}
                <Ext href="https://www.nxcode.io/resources/news/google-stitch-tutorial-design-first-app-2026">
                  https://www.nxcode.io/resources/news/google-stitch-tutorial-design-first-app-2026
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> UIThings「What Is Google Stitch?」 -{" "}
                <Ext href="https://uithings.com/what-is-google-stitch">
                  https://uithings.com/what-is-google-stitch
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span>{" "}
                Marketing Agent Blog「Tutorial: Build App Prototypes with Google Stitch」 -{" "}
                <Ext href="https://marketingagent.blog/2026/03/26/tutorial-build-app-prototypes-with-google-stitch/">
                  https://marketingagent.blog/2026/03/26/tutorial-build-app-prototypes-with-google-stitch/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> UX Pilot「Google Stitch AI Walkthrough」 -{" "}
                <Ext href="https://uxpilot.ai/blogs/google-stitch-ai">
                  https://uxpilot.ai/blogs/google-stitch-ai
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> OpenReplay「From Prompt to UI with Google Stitch」 -{" "}
                <Ext href="https://blog.openreplay.com/prompt-ui-google-stitch/">
                  https://blog.openreplay.com/prompt-ui-google-stitch/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span>{" "}
                All About AI「How to Use Google Stitch for UI Design」 -{" "}
                <Ext href="https://www.allaboutai.com/ai-how-to/use-google-stitch-for-ui-design/">
                  https://www.allaboutai.com/ai-how-to/use-google-stitch-for-ui-design/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> Agent Skills「enhance-prompt skill」 -{" "}
                <Ext href="https://agentskills.so/skills/google-labs-code-stitch-skills-enhance-prompt">
                  https://agentskills.so/skills/google-labs-code-stitch-skills-enhance-prompt
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> Creative AI News「Google DESIGN.md」 -{" "}
                <Ext href="https://www.creativeainews.com/blog/google-design-md-open-source-ai-brand-design-stitch/">
                  https://www.creativeainews.com/blog/google-design-md-open-source-ai-brand-design-stitch/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span>{" "}
                News Defused「Google&apos;s Stitch open-sources DESIGN.md」 -{" "}
                <Ext href="https://www.newsdefused.com/googles-stitch-open-sources-design-md-specification-to-make-brand-rules-portable-for-ai-agents/">
                  https://www.newsdefused.com/googles-stitch-open-sources-design-md-specification-to-make-brand-rules-portable-for-ai-agents/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span>{" "}
                Pasquale Pillitteri「Google Stitch Open-Sources DESIGN.md」 -{" "}
                <Ext href="https://pasqualepillitteri.it/en/news/1251/google-stitch-design-md-open-source-spec-2026">
                  https://pasqualepillitteri.it/en/news/1251/google-stitch-design-md-open-source-spec-2026
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> Nic&apos;s Notes「DESIGN.md」 -{" "}
                <Ext href="https://notes.nicolasdeville.com/ai/design-md/">
                  https://notes.nicolasdeville.com/ai/design-md/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span>{" "}
                Medium (fernandocomet) 「Google makes DESIGN.md open source」 -{" "}
                <Ext href="https://medium.com/design-bootcamp/google-makes-design-md-open-source-on-its-way-to-become-a-industry-standard-16119f2368dd">
                  https://medium.com/design-bootcamp/google-makes-design-md-open-source-on-its-way-to-become-a-industry-standard-16119f2368dd
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> Vibecoding「DESIGN.md Review 2026」 -{" "}
                <Ext href="https://vibecoding.app/blog/design-md-review">
                  https://vibecoding.app/blog/design-md-review
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> SOTAAZ Blog「Google Stitch MCP Setup Guide」 -{" "}
                <Ext href="https://www.sotaaz.com/post/stitch-mcp-guide-en">
                  https://www.sotaaz.com/post/stitch-mcp-guide-en
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> UXPin「Google Stitch AI Design Tool」 -{" "}
                <Ext href="https://www.uxpin.com/studio/blog/google-stitch-ai-design-tool-updates-ui-ux/">
                  https://www.uxpin.com/studio/blog/google-stitch-ai-design-tool-updates-ui-ux/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span> GitHub「google-labs-code/stitch-skills」 -{" "}
                <Ext href="https://github.com/google-labs-code/stitch-skills">
                  https://github.com/google-labs-code/stitch-skills
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> GitHub「davideast/stitch-mcp」 -{" "}
                <Ext href="https://github.com/davideast/stitch-mcp">
                  https://github.com/davideast/stitch-mcp
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> GitHub「Kargatharaakash/stitch-mcp」 -{" "}
                <Ext href="https://github.com/Kargatharaakash/stitch-mcp">
                  https://github.com/Kargatharaakash/stitch-mcp
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> GitHub「piyushcreates/stitch-mcp」 -{" "}
                <Ext href="https://github.com/piyushcreates/stitch-mcp">
                  https://github.com/piyushcreates/stitch-mcp
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeCommunity}`}>非公式</span> GitHub「oogleyskr/stitch-mcp-server」 -{" "}
                <Ext href="https://github.com/oogleyskr/stitch-mcp-server">
                  https://github.com/oogleyskr/stitch-mcp-server
                </Ext>
              </li>
            </ol>

            <h3>公式ドキュメント（内容取得はJavaScriptレンダリングのため一部制限あり）</h3>
            <ul className={styles.refList}>
              <li>
                <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span> Stitch MCPセットアップ -{" "}
                <Ext href="https://stitch.withgoogle.com/docs/mcp/setup/">
                  https://stitch.withgoogle.com/docs/mcp/setup/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span> DESIGN.md概要 -{" "}
                <Ext href="https://stitch.withgoogle.com/docs/design-md/overview/">
                  https://stitch.withgoogle.com/docs/design-md/overview/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span> Stitch Effective Prompting Guide -{" "}
                <Ext href="https://stitch.withgoogle.com/docs/learn/prompting/">
                  https://stitch.withgoogle.com/docs/learn/prompting/
                </Ext>
              </li>
              <li>
                <span className={`${styles.badge} ${styles.badgeOfficial}`}>公式</span> DESIGN.md 公式リポジトリ -{" "}
                <Ext href="https://github.com/google-labs-code/design.md">
                  https://github.com/google-labs-code/design.md
                </Ext>
              </li>
            </ul>
          </section>

          <div className={styles.pageFooter}>
            <p>
              <i className="ti ti-shield-exclamation" />
              <strong>免責事項</strong>
              ：本ガイドは2026年7月11日時点でWeb検索により収集した二次情報を基に作成している。Google Stitchは実験段階のプロダクトであり、機能・料金・利用上限・対応フレームワークなどは予告なく変更される可能性が高い。重要な意思決定を行う前には、必ず
              <Ext href="https://stitch.withgoogle.com/">stitch.withgoogle.com</Ext>
              および公式ドキュメントで最新情報を確認すること。
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
