import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "Adversarial Robustness for Machine Learning 初学者ガイド",
  description:
    "Pin-Yu Chen氏・Cho-Jui Hsieh氏著『Adversarial Robustness for Machine Learning』を土台に、敵対的攻撃(FGSM/PGD/C&W)、防御(Adversarial Training/Certified Robustness)、評価方法、およびLLM時代のセキュリティ(GCG/NIST/MITRE)をステップバイステップで学ぶ初学者向けガイド。",
  alternates: {
    canonical: "/books/adversarial-robustness",
  },
  openGraph: {
    title: "Adversarial Robustness for Machine Learning 初学者ガイド",
    description:
      "なぜAIは「だまされる」のか、そしてどう守るのか。Adversarial Robustnessの基礎から最新動向までを網羅解説。",
    type: "article",
    url: "/books/adversarial-robustness",
  },
};

const CLASSDEFS = `
classDef hub fill:#c9c4ef,color:#221f52,stroke:#413d8f,stroke-width:1px;
classDef done fill:#bfe4d2,color:#123722,stroke:#2f6b4f,stroke-width:1px;
classDef box fill:#fbe9c2,color:#4a3405,stroke:#ad7c1f,stroke-width:1px;
`;

const DIAGRAM_0 = `flowchart TD
A[元の画像 パンダ] --> B[学習済み分類器]
B --> C[正しい予測 パンダ]
A --> D[人の目にはほぼ見えない摂動を加える]
D --> E[Adversarial Example]
E --> B
B --> F[誤った予測 テナガザル 高い確信度で]
${CLASSDEFS}
class E hub;`;

const DIAGRAM_1 = `flowchart LR
T[脅威モデル Threat Model] --> K1[攻撃者の知識]
K1 --> K1a[White-box 勾配やパラメータを完全に把握]
K1 --> K1b[Black-box 入力と出力のみ観測可能]
T --> C[攻撃クラス]
C --> C1[Evasion 推論時に誤分類を狙う]
C --> C2[Poisoning 学習データを汚染する]
T --> P[攻撃者の目的 プライバシー侵害]
P --> P1[Privacy 訓練データやモデル自体を盗む]
T --> TM[攻撃のタイミング]
TM --> TM1[学習時 Training-time]
TM --> TM2[推論時 Deployment-time]
T --> N[摂動の制約]
N --> N1[Lpノルムボール 微小な数値的摂動]
N --> N2[物理的制約 パッチやステッカーなど現実の改変]
${CLASSDEFS}
class T hub;`;

const DIAGRAM_2 = `flowchart LR
A[入力xと正解ラベルy] --> B[損失関数の勾配を計算]
B --> C[勾配の符号だけを取り出す sign]
C --> D[入力に符号方向へepsilon分だけ加算]
D --> E[Adversarial Example xprimeを1ステップで生成]
${CLASSDEFS}
class E done;`;

const DIAGRAM_3 = `flowchart TD
A[ノルムボール内のランダムな点から開始] --> B[勾配を計算し損失を最大化する方向へ更新]
B --> C[許容範囲のLpノルムボールの内側に射影]
C --> D{規定回数繰り返したか}
D -- いいえ --> B
D -- はい --> E[最終的なAdversarial Example]
${CLASSDEFS}
class E done;`;

const DIAGRAM_4 = `flowchart TD
Q[Black-box 攻撃者は勾配に直接アクセスできない] --> R[経路1 代理モデルを訓練して攻撃を転移させる]
Q --> S[経路2 標的モデルに繰り返しクエリして出力だけから摂動を探索する]
R --> T[転移性により標的モデルも誤分類される]
S --> T
${CLASSDEFS}
class Q hub;
class T done;`;

const DIAGRAM_5 = `flowchart LR
A[デジタル空間で摂動を最適化] --> B[様々な角度 距離 照明条件でも効くよう頑健化]
B --> C[ポスターやステッカーとして印刷]
C --> D[実世界のカメラで撮影]
D --> E[自動運転車などの認識システムが誤認識]
${CLASSDEFS}
class E done;`;

const DIAGRAM_6 = `flowchart TD
A[通常の学習データ] --> B[内側の最大化 PGDなどで最も損失が大きい摂動を探す]
B --> C[外側の最小化 その最悪ケースの損失でパラメータを更新]
C --> D{学習が収束したか}
D -- いいえ --> B
D -- はい --> E[頑健なモデルが得られる]
${CLASSDEFS}
class E done;`;

const DIAGRAM_7 = `flowchart LR
A[任意の基底分類器] --> B[入力にガウスノイズを加えて何度も推論]
B --> C[最も多く出力されたクラスを最終予測とする]
C --> D[統計的な信頼区間から証明可能な半径を計算]
D --> E[その半径の中では予測が変わらないと数学的に保証]
${CLASSDEFS}
class E done;`;

const DIAGRAM_8 = `flowchart TD
A[新しい防御手法を提案] --> B{勾配マスキングの兆候はないか}
B -- 疑わしい兆候あり --> C[勾配ベース攻撃だけでは低い攻撃成功率になる]
C --> D[実は頑健なのではなくObfuscated Gradientsの可能性]
D --> E[Black-box攻撃やBPDAなど多様な攻撃で再評価]
B -- 疑わしい兆候なし --> F[AutoAttackなど標準化されたアンサンブル攻撃で評価]
E --> F
F --> G[RobustBenchのようなベンチマークに結果を登録し第三者が再現]
${CLASSDEFS}
class B box;
class G done;`;

const DIAGRAM_9 = `flowchart TD
A[ユーザーの入力プロンプト] --> B[GCGなど勾配ベースの探索でAdversarial Suffixを最適化]
B --> C[Suffixを付加したプロンプトをLLMに送信]
C --> D[Alignmentによる拒否をすり抜けて有害な出力を誘発]
D --> E[開発者側は入力フィルタリングや異常検知で対策]
E --> F[Red Teamingで継続的に新しい攻撃パターンを評価]
F --> B
${CLASSDEFS}
class A hub;
class D box;`;

const DIAGRAM_10 = `flowchart TD
A[目的を決める 攻撃を試す 防御を評価する 標準ベンチマークで比較する] --> B[ART IBM Research発 Evasion Poisoning Extraction Inferenceを横断]
A --> C[Foolbox Bethge Lab発 PyTorch TensorFlow JAXに対応]
A --> D[CleverHans 元祖ライブラリの一つ 教育目的でも利用]
A --> E[RobustBench AutoAttackによる標準化リーダーボードとModel Zoo]
${CLASSDEFS}
class A hub;`;

const DIAGRAM_11 = `flowchart LR
A[基礎 Adversarial Exampleの概念とFGSM] --> B[中級 PGDとAdversarial Training]
B --> C[中級 証明可能な頑健性とRandomized Smoothing]
C --> D[上級 標準化された評価とRobustBench]
D --> E[応用 画像分類を超えた領域とLLMのAdversarial Robustness]
${CLASSDEFS}
class E done;`;

export default function AdversarialRobustnessGuidePage() {
  return (
    <div
      className={styles.layout}
      data-testid="layout-root"
      data-page="adversarial-robustness"
    >
      <TocObserver />

      <div className={styles.mobileBar}>
        <div className={styles.brandMini}>
          <i className="ti ti-shield-lock" />
          &nbsp;Adversarial Robustness ガイド
        </div>
        <button id="menuToggle" aria-label="メニューを開く" type="button">
          <i className="ti ti-menu-2" />
        </button>
      </div>
      <div className={styles.scrim} id="scrim" />

      <aside className={styles.sidebar} id="sidebar">
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <i className="ti ti-shield-lock" />
          </div>
          <div className={styles.brandText}>
            Adversarial Robustness<span>初学者ガイド</span>
          </div>
        </div>
        <nav className={styles.navList} data-testid="nav-list">
          <a href="#top" className={styles.navA}>
            <span className={styles.nNum}>00</span>
            <i className="ti ti-home" />
            はじめに
          </a>
          <a href="#audience" className={styles.navA}>
            <span className={styles.nNum}>01</span>
            <i className="ti ti-users" />
            対象読者
          </a>
          <a href="#book-info" className={styles.navA}>
            <span className={styles.nNum}>02</span>
            <i className="ti ti-book-2" />
            書籍情報
          </a>
          <a href="#toc26" className={styles.navA}>
            <span className={styles.nNum}>03</span>
            <i className="ti ti-list-check" />
            全26章構成
          </a>
          <a href="#step0" className={styles.navA}>
            <span className={styles.nNum}>04</span>
            <i className="ti ti-school" />
            Step0 前提知識
          </a>
          <a href="#step1" className={styles.navA}>
            <span className={styles.nNum}>05</span>
            <i className="ti ti-bug" />
            Step1 発見と直感
          </a>
          <a href="#step2" className={styles.navA}>
            <span className={styles.nNum}>06</span>
            <i className="ti ti-target" />
            Step2 脅威モデル
          </a>
          <a href="#step3" className={styles.navA}>
            <span className={styles.nNum}>07</span>
            <i className="ti ti-bolt" />
            Step3 White-box攻撃
          </a>
          <a href="#step4" className={styles.navA}>
            <span className={styles.nNum}>08</span>
            <i className="ti ti-network" />
            Step4 Black-box攻撃
          </a>
          <a href="#step5" className={styles.navA}>
            <span className={styles.nNum}>09</span>
            <i className="ti ti-car" />
            Step5 物理世界の攻撃
          </a>
          <a href="#step6" className={styles.navA}>
            <span className={styles.nNum}>10</span>
            <i className="ti ti-shield-check" />
            Step6 Adversarial Training
          </a>
          <a href="#step7" className={styles.navA}>
            <span className={styles.nNum}>11</span>
            <i className="ti ti-certificate" />
            Step7 Certified Robustness
          </a>
          <a href="#step8" className={styles.navA}>
            <span className={styles.nNum}>12</span>
            <i className="ti ti-alert-triangle"></i>Step8 壊れた防御と評価
          </a>
          <a href="#step9" className={styles.navA}>
            <span className={styles.nNum}>13</span>
            <i className="ti ti-world" />
            Step9 画像分類を超えて
          </a>
          <a href="#step10" className={styles.navA}>
            <span className={styles.nNum}>14</span>
            <i className="ti ti-robot" />
            Step10 LLM時代
          </a>
          <a href="#step11" className={styles.navA}>
            <span className={styles.nNum}>15</span>
            <i className="ti ti-tools" />
            Step11 ツールとライブラリ
          </a>
          <a href="#step12" className={styles.navA}>
            <span className={styles.nNum}>16</span>
            <i className="ti ti-route" />
            Step12 学習ロードマップ
          </a>
          <a href="#summary" className={styles.navA}>
            <span className={styles.nNum}>17</span>
            <i className="ti ti-flag" />
            まとめ
          </a>
          <a href="#checklist" className={styles.navA}>
            <span className={styles.nNum}>18</span>
            <i className="ti ti-clipboard-check" />
            理解度チェックリスト
          </a>
          <a href="#references" className={styles.navA}>
            <span className={styles.nNum}>19</span>
            <i className="ti ti-external-link" />
            参考文献・情報源
          </a>
        </nav>
      </aside>

      <main className={styles.main} id="top">
        <header className={styles.hero}>
          <div className={styles.freshnessBar} lang="ja" data-testid="page-freshness">
            <span className={styles.freshnessItem}>
              最終確認{" "}
              <time className={styles.freshnessValue} dateTime="2026-10-14">
                2026-10-14
              </time>
            </span>
            <span className={styles.freshnessSep} aria-hidden="true">
              /
            </span>
            <span className={styles.freshnessItem}>
              公開{" "}
              <time className={styles.freshnessValue} dateTime="2026-10-14">
                2026-10-14
              </time>
            </span>
          </div>
          <span className={styles.heroKicker}>
            <i className="ti ti-shield-lock" />
            AI Security 初学者ガイド
          </span>
          <h1>Adversarial Robustness for Machine Learning 初学者ガイド</h1>
          <div className={styles.heroSub}>なぜAIは「だまされる」のか、そしてどう守るのか</div>
          <p className={styles.heroLead}>
            本ガイドは、Pin-Yu Chen氏(IBM Thomas J. Watson Research Center, Principal Research
            Scientist)とCho-Jui Hsieh氏(UCLA Computer Science, Associate Professor)による書籍
            <strong>『Adversarial Robustness for Machine Learning』</strong>(Elsevier,
            2022年8月25日刊, ISBN 978-0-12-824020-5)を出発点に、 Adversarial
            Robustness(敵対的頑健性)という分野を初学者にもわかるようステップバイステップで解説するものです。
          </p>
          <p className={styles.heroLead}>
            書籍出版から現在(2026年9月)までの間に、この分野は大規模言語モデル(LLM)の登場によって「画像分類の一分野」から「AIセキュリティ全般の基盤」へと大きく広がりました。
            本ガイドでは書籍の内容に加え、GCG攻撃・MITRE ATLAS・NIST AI
            100-2e2025など、2026年9月時点の最新動向もあわせて解説します。
          </p>
          <div className={`${styles.callout} ${styles.plum}`} data-testid="callout-plum">
            <i className="ti ti-book-2" />
            <div className={styles.calloutBody}>
              <p>
                📚 原書情報:{" "}
                <a
                  href="https://shop.elsevier.com/books/adversarial-robustness-for-machine-learning/chen/978-0-12-824020-5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Elsevier Shop - Adversarial Robustness for Machine Learning
                </a>
              </p>
            </div>
          </div>
          <div className={styles.heroMeta}>
            <span className={styles.tag}>
              <i className="ti ti-calendar" />
              2026年9月14日時点の情報
            </span>
            <span className={styles.tag}>
              <i className="ti ti-books" />
              全26章 書籍を要約
            </span>
            <span className={styles.tag}>
              <i className="ti ti-chart-dots" />
              Mermaid図解 12点
            </span>
            <span className={styles.tag}>
              <i className="ti ti-link" />
              参考URL 22件
            </span>
          </div>
        </header>

        <section className={styles.section} id="audience">
          <h2>
            <i className="ti ti-users" />
            この記事の対象読者
          </h2>
          <ul>
            <li>
              機械学習やディープラーニングの基礎(分類器、損失関数、勾配降下法)は知っているが、Adversarial
              Robustnessは初めて学ぶ人
            </li>
            <li>
              「AIは画像を少し加工しただけで誤認識する」という話を聞いたことがあるが、仕組みを体系的に理解したい人
            </li>
            <li>
              LLM時代のjailbreakやprompt injectionが、古典的なAdversarial
              Exampleの研究とどうつながっているかを知りたい人
            </li>
          </ul>
        </section>

        <section className={styles.section} id="book-info">
          <h2>
            <i className="ti ti-book-2" />
            書籍情報
          </h2>
          <div className={styles.bookCard}>
            <div className={styles.bookCover}>
              <div className={styles.bcTop}>ELSEVIER / ACADEMIC PRESS</div>
              <div className={styles.bcTitle}>Adversarial Robustness for Machine Learning</div>
              <div className={styles.bcAuthor}>
                Pin-Yu Chen
                <br />
                Cho-Jui Hsieh
              </div>
            </div>
            <div className={styles.bookMeta}>
              <div className={styles.tableWrap}>
                <table className={styles.kvTable} data-testid="kv-table">
                  <tbody>
                    <tr>
                      <th>書名</th>
                      <td>Adversarial Robustness for Machine Learning</td>
                    </tr>
                    <tr>
                      <th>著者</th>
                      <td>
                        Pin-Yu Chen(IBM Thomas J. Watson Research Center) / Cho-Jui Hsieh(UCLA
                        Computer Science)
                      </td>
                    </tr>
                    <tr>
                      <th>出版社</th>
                      <td>Elsevier(Academic Press)</td>
                    </tr>
                    <tr>
                      <th>版</th>
                      <td>第1版</td>
                    </tr>
                    <tr>
                      <th>発行日</th>
                      <td>2022年8月25日</td>
                    </tr>
                    <tr>
                      <th>ISBN</th>
                      <td>978-0-12-824020-5(電子版 978-0-12-824257-5)</td>
                    </tr>
                    <tr>
                      <th>章数</th>
                      <td>全26章</td>
                    </tr>
                    <tr>
                      <th>想定読者</th>
                      <td>
                        大学院生向け教科書、研究者向けの網羅的レビュー、企業のR&amp;Dエンジニア
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.bookAuthorsNote}>
                Pin-Yu Chen氏はIBMのオープンソースライブラリ{" "}
                <strong>Adversarial Robustness Toolbox (ART)</strong> および{" "}
                <strong>AI Explainability 360</strong>{" "}
                の開発に貢献しており、NeurIPS・AAAI・CVPR・ICASSPなど国際会議でAdversarial Machine
                Learningのチュートリアルを多数実施してきた、この分野を代表する研究者の一人です。Cho-Jui
                Hsieh氏はKDD・ICDM・ICPPでのBest
                Paper賞を持ち、大規模かつ頑健なモデルの学習アルゴリズム研究で知られています。
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="toc26">
          <h2>
            <i className="ti ti-list-check" />
            書籍の全26章構成
          </h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>章</th>
                  <th>タイトル(原題)</th>
                  <th>内容カテゴリ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>White-box attack</td>
                  <td>攻撃</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Soft-label Black-box Attack</td>
                  <td>攻撃</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Decision-based attack</td>
                  <td>攻撃</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Attack Transferability</td>
                  <td>攻撃</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Attacks in the physical world</td>
                  <td>攻撃</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>Convex relaxation Framework</td>
                  <td>検証 Verification</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>Layer-wise relaxation (primal algorithms)</td>
                  <td>検証 Verification</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>Dual approach</td>
                  <td>検証 Verification</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>Probabilistic verification</td>
                  <td>検証 Verification</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>Adversarial training</td>
                  <td>防御 Defense</td>
                </tr>
                <tr>
                  <td>11</td>
                  <td>Certified defense</td>
                  <td>防御 Defense</td>
                </tr>
                <tr>
                  <td>12</td>
                  <td>Randomization</td>
                  <td>防御 Defense</td>
                </tr>
                <tr>
                  <td>13</td>
                  <td>Detection methods</td>
                  <td>防御 Defense</td>
                </tr>
                <tr>
                  <td>14</td>
                  <td>Robustness of other machine learning models beyond neural networks</td>
                  <td>画像分類を超えて</td>
                </tr>
                <tr>
                  <td>15</td>
                  <td>NLP models</td>
                  <td>画像分類を超えて</td>
                </tr>
                <tr>
                  <td>16</td>
                  <td>Graph neural network</td>
                  <td>画像分類を超えて</td>
                </tr>
                <tr>
                  <td>17</td>
                  <td>Recommender systems</td>
                  <td>画像分類を超えて</td>
                </tr>
                <tr>
                  <td>18</td>
                  <td>Reinforcement Learning</td>
                  <td>画像分類を超えて</td>
                </tr>
                <tr>
                  <td>19</td>
                  <td>Speech models</td>
                  <td>画像分類を超えて</td>
                </tr>
                <tr>
                  <td>20</td>
                  <td>Multi-modal models</td>
                  <td>画像分類を超えて</td>
                </tr>
                <tr>
                  <td>21</td>
                  <td>Backdoor attack and defense</td>
                  <td>その他の脅威と応用</td>
                </tr>
                <tr>
                  <td>22</td>
                  <td>Data poisoning attack and defense</td>
                  <td>その他の脅威と応用</td>
                </tr>
                <tr>
                  <td>23</td>
                  <td>Transfer learning</td>
                  <td>その他の脅威と応用</td>
                </tr>
                <tr>
                  <td>24</td>
                  <td>Explainability and interpretability</td>
                  <td>その他の脅威と応用</td>
                </tr>
                <tr>
                  <td>25</td>
                  <td>Representation learning</td>
                  <td>その他の脅威と応用</td>
                </tr>
                <tr>
                  <td>26</td>
                  <td>Privacy and watermarking</td>
                  <td>その他の脅威と応用</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            本ガイドのStep 3〜9はこの1〜26章の内容を初学者向けに要約したものです。Step
            10のみ、書籍刊行後にLLMを中心として発展した領域を補足しています。
          </p>
        </section>

        <section className={styles.section} id="step0">
          <h2>
            <i className="ti ti-school" />
            Step 0 前提知識のおさらい
          </h2>
          <p>Adversarial Robustnessを理解するには、以下の基礎知識があるとスムーズです。</p>
          <ul>
            <li>
              <strong>分類器(classifier)</strong>:
              画像やテキストなどの入力を受け取り、あらかじめ決められたクラス(ラベル)のどれかを出力するモデル
            </li>
            <li>
              <strong>損失関数(loss function)</strong>:
              モデルの予測がどれだけ正解からずれているかを数値化する関数
            </li>
            <li>
              <strong>勾配(gradient)</strong>:
              損失関数を各パラメータ、あるいは各入力次元で微分した値。「どの方向にどれだけ動かせば損失が増減するか」を表す
            </li>
            <li>
              <strong>Lp ノルム</strong>:
              摂動(元の入力に加える微小な変化)の大きさを測る指標。L∞ノルムは各ピクセルの変化量の最大値、L2ノルムはユークリッド距離に相当
            </li>
          </ul>
          <p>これらを踏まえたうえで、次のStep 1からAdversarial Exampleそのものの話に入ります。</p>
        </section>

        <section className={styles.section} id="step1">
          <h2>
            <i className="ti ti-bug" />
            Step 1 Adversarial Example の発見と直感
          </h2>
          <h3>1-1 発見の経緯</h3>
          <p>
            2013年、Christian Szegedy氏(当時Google)らは論文「Intriguing properties of neural
            networks」で、当時最先端だった画像分類ニューラルネットワークに対し、人間の目にはほとんど変化がわからない微小な摂動を加えるだけで、モデルの予測を意図的に誤らせることができると報告しました。この、意図的に作られた「ほぼ元の入力と見分けがつかないのに誤分類を引き起こす入力」を{" "}
            <strong>Adversarial Example(敵対的サンプル)</strong> と呼びます。
          </p>
          <h3>1-2 直感的なイメージ</h3>
          <div className={styles.diagramBlock}>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_0} id="dg-0" theme="base" />
            </div>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots" />
              図1: Adversarial Exampleが分類器を誤らせる仕組み
            </div>
          </div>
          <p>
            ポイントは、単にノイズを加えて「モデルが混乱する」のではなく、
            <strong>損失を最大化する方向に精密に計算された摂動</strong>
            であるという点です。ランダムなノイズでは通常モデルは頑健ですが、この精密な摂動には非常に弱いことが分かっています。
          </p>
          <h3>1-3 なぜ起きるのか</h3>
          <p>
            2014年、Ian Goodfellow氏(当時Google, 後にOpenAI/Apple)らは論文「Explaining and
            Harnessing Adversarial Examples」で、この脆弱性の主要な原因を{" "}
            <strong>ニューラルネットワークの線形性(linear nature)</strong>{" "}
            に求める説明を提示しました。高次元空間では、入力の各次元にごくわずかな変化を同じ符号方向に積み重ねるだけで、線形結合の出力を大きく動かせてしまう、という考え方です。この論文は同時に、後述するFGSMという最初期の代表的攻撃手法も提案しています。
          </p>
        </section>

        <section className={styles.section} id="step2">
          <h2>
            <i className="ti ti-target" />
            Step 2 脅威モデル Threat Model を理解する
          </h2>
          <p>
            Adversarial
            Robustnessを議論するうえで欠かせないのが「どのような前提のもとで攻撃者を考えるか」という{" "}
            <strong>脅威モデル(threat model)</strong>{" "}
            です。米国国立標準技術研究所(NIST)は2024年に報告書 <em>NIST AI 100-2</em>(Adversarial
            Machine Learning: A Taxonomy and Terminology of Attacks and
            Mitigations)を公開し、2025年3月には生成AI(GenAI)の脅威も統合した改訂版(NIST AI
            100-2e2025)を発行しました。この報告書は分野の用語を標準化する目的で書かれており、以下はその枠組みに沿った整理です。
          </p>
          <div className={styles.diagramBlock}>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_1} id="dg-1" theme="base" />
            </div>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots" />
              図2: 脅威モデルを構成する4つの観点
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>選択肢</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>攻撃者の知識</td>
                  <td>White-box</td>
                  <td>モデルの構造・パラメータ・勾配まで全て把握している最も強い前提</td>
                </tr>
                <tr>
                  <td>攻撃者の知識</td>
                  <td>Black-box</td>
                  <td>入力を送って出力(ラベルやスコア)を見ることしかできない</td>
                </tr>
                <tr>
                  <td>攻撃クラス</td>
                  <td>Evasion(回避)</td>
                  <td>学習済みモデルに対し推論時に誤分類を狙う、最も研究が進んだ領域</td>
                </tr>
                <tr>
                  <td>攻撃クラス</td>
                  <td>Poisoning(汚染)</td>
                  <td>学習データ自体を汚染し、モデルの挙動を歪める</td>
                </tr>
                <tr>
                  <td>攻撃者の目的(プライバシー侵害)</td>
                  <td>Privacy(プライバシー)</td>
                  <td>学習データやモデルパラメータ自体を盗み出す</td>
                </tr>
                <tr>
                  <td>攻撃のタイミング</td>
                  <td>学習時(Training-time)</td>
                  <td>Poisoningなど、モデルの学習プロセス自体を狙う</td>
                </tr>
                <tr>
                  <td>攻撃のタイミング</td>
                  <td>推論時(Deployment-time)</td>
                  <td>Evasionなど、学習済みモデルへの入力を操作する</td>
                </tr>
                <tr>
                  <td>摂動の種類</td>
                  <td>デジタル摂動</td>
                  <td>L∞やL2などのノルムで制約された微小な数値変化</td>
                </tr>
                <tr>
                  <td>摂動の種類</td>
                  <td>物理摂動</td>
                  <td>ステッカーや印刷物など、現実世界に存在できる改変</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            書籍の1〜5章(攻撃)は主にEvasion×White-box/Black-boxの組み合わせを、21〜22章はPoisoningとBackdoorを、26章はPrivacyを扱っています。
          </p>
        </section>

        <section className={styles.section} id="step3">
          <h2>
            <i className="ti ti-bolt" />
            Step 3 代表的なWhite-box攻撃 FGSM PGD C&amp;W
          </h2>
          <p>
            書籍の第1章(White-box
            attack)に対応する内容です。White-box攻撃はモデルの勾配を直接利用できるため、攻撃の仕組みそのものを学ぶのに最適です。
          </p>
          <h3>3-1 FGSM Fast Gradient Sign Method</h3>
          <p>
            Goodfellow氏らが2014年に提案した最初期の代表的手法です。損失関数の勾配の
            <strong>符号(sign)</strong>だけを使い、たった1ステップでAdversarial
            Exampleを生成します。
          </p>
          <div className={styles.diagramBlock}>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_2} id="dg-2" theme="base" />
            </div>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots" />
              図3: FGSMによる1ステップ攻撃の流れ
            </div>
          </div>
          <p>
            計算が非常に軽い一方、1ステップしか動かないため摂動としては粗く、後述するPGDのような反復攻撃に比べると弱いことが知られています。
          </p>
          <h3>3-2 PGD Projected Gradient Descent</h3>
          <p>
            2017年、Aleksander Madry氏(MIT)らは論文「Towards Deep Learning Models Resistant to
            Adversarial Attacks」で、Adversarial Robustnessを
            <strong>頑健最適化(robust optimization)</strong>
            の枠組みとして定式化し、FGSMを何度も繰り返し適用しながら、各ステップでノルムボールの中に射影(projection)し直す{" "}
            <strong>PGD</strong> を提案しました。
          </p>
          <div className={styles.diagramBlock}>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_3} id="dg-3" theme="base" />
            </div>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots" />
              図4: PGDの反復更新ループ
            </div>
          </div>
          <p>
            Madry氏らはPGDを「あらゆる一次(勾配ベース)攻撃の中でほぼ最強かつ普遍的な攻撃」と位置づけ、これをベースにした{" "}
            <strong>PGD Adversarial Training</strong>{" "}
            が、以後の防御研究の事実上の標準ベースラインになりました。
          </p>
          <h3>3-3 Carlini and Wagner攻撃 C&amp;W</h3>
          <p>
            2017年、Nicholas Carlini氏とDavid Wagner氏(UC Berkeley)は論文「Towards Evaluating the
            Robustness of Neural Networks」で、当時提案されていた
            <strong>Defensive Distillation</strong>
            という防御手法が、実は攻撃者側を過小評価していただけであることを示し、これを打ち破る最適化ベースの攻撃(C&amp;W攻撃)を提案しました。攻撃の成功率を95%から0.5%まで下げたと主張していた防御を、ほぼ完全に無効化した点が大きなインパクトを持ちました。
          </p>
          <h3>3-4 攻撃手法の比較</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>手法</th>
                  <th>発表年/著者</th>
                  <th>必要な情報</th>
                  <th>生成方法</th>
                  <th>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>FGSM</td>
                  <td>2014 Goodfellow et al.</td>
                  <td>White-box(勾配)</td>
                  <td>1ステップ</td>
                  <td>高速だが摂動が粗く弱い</td>
                </tr>
                <tr>
                  <td>PGD</td>
                  <td>2017 Madry et al.</td>
                  <td>White-box(勾配)</td>
                  <td>複数回反復+射影</td>
                  <td>事実上最強の一次攻撃、Adversarial Trainingの標準</td>
                </tr>
                <tr>
                  <td>C&amp;W</td>
                  <td>2017 Carlini and Wagner</td>
                  <td>White-box(勾配)</td>
                  <td>最適化ベース</td>
                  <td>最小摂動を追求し多くの防御を打ち破った</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section} id="step4">
          <h2>
            <i className="ti ti-network" />
            Step 4 Black-box攻撃と転移性
          </h2>
          <p>
            書籍の第2〜4章(Soft-label Black-box Attack、Decision-based attack、Attack
            Transferability)に対応します。実際の攻撃者は常にモデルの内部にアクセスできるとは限りません。
          </p>
          <div className={styles.diagramBlock}>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_4} id="dg-4" theme="base" />
            </div>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots" />
              図5: Black-box攻撃の2つの経路
            </div>
          </div>
          <ul>
            <li>
              <strong>転移性(Transferability)を利用する攻撃</strong>:
              攻撃者自身が用意した代理モデル(substitute model)でAdversarial
              Exampleを作り、標的モデルにそのまま入力する。異なるアーキテクチャ・異なる学習データで訓練されたモデル同士でも、同じAdversarial
              Exampleが誤分類を引き起こすことが多いという興味深い性質を利用します。
            </li>
            <li>
              <strong>クエリベースの攻撃</strong>:
              標的モデルに何度も入力を送り、出力(確信度スコアやラベルのみ)の変化を手がかりに摂動を探索する。出力がクラスラベルのみの場合を{" "}
              <strong>Decision-based attack</strong> と呼びます。
            </li>
          </ul>
          <p>
            これらは、モデルを完全に公開しなくても(APIとして提供するだけでも)攻撃を受けうることを意味しており、実運用上非常に重要な視点です。
          </p>
        </section>

        <section className={styles.section} id="step5">
          <h2>
            <i className="ti ti-car" />
            Step 5 物理世界での攻撃
          </h2>
          <p>
            書籍第5章(Attacks in the physical
            world)に対応します。デジタル空間の数値的な摂動を、現実の物体に落とし込めるかという問題です。
          </p>
          <div className={styles.diagramBlock}>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_5} id="dg-5" theme="base" />
            </div>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots" />
              図6: デジタル摂動から物理世界の誤認識まで
            </div>
          </div>
          <p>
            2016年、Alexey Kurakin氏らはGoogleにて「Adversarial examples in the physical
            world」で、印刷したAdversarial
            Exampleをスマートフォンのカメラ越しに撮影しても誤分類が起きることを示しました。2018年にはKevin
            Eykholt氏らがCVPRで発表した「Robust Physical-World Attacks on Deep Learning Visual
            Classification」で、ストップ標識に貼った落書き風のステッカーが、様々な角度・距離・照明条件下でも自動運転向け認識モデルを高い確率で「制限速度45標識」などに誤認識させられることを実証し、自動運転の安全性に対する具体的な懸念を広く知らしめました。
          </p>
        </section>

        <section className={styles.section} id="step6">
          <h2>
            <i className="ti ti-shield-check" />
            Step 6 防御1 Adversarial Training
          </h2>
          <p>書籍第10章に対応します。最も広く使われている経験的な防御手法です。</p>
          <div className={styles.diagramBlock}>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_6} id="dg-6" theme="base" />
            </div>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots" />
              図7: Adversarial Trainingのミニマックス学習ループ
            </div>
          </div>
          <p>
            Madry氏らの定式化では、Adversarial
            Trainingは以下のようなミニマックス(min-max)最適化として書けます。
          </p>
          <div className={styles.formulaBlock} data-testid="formula-block">
            <pre>{"min_θ  E[ max_{δ∈Δ(x)}  L( f_θ(x+δ), y ) ]"}</pre>
          </div>
          <ul>
            <li>
              内側の <code>max</code>{" "}
              は、現在のモデルパラメータθのもとで最も損失を大きくする摂動δ(=最も強いAdversarial
              Example)を探す問題
            </li>
            <li>
              外側の <code>min</code>{" "}
              は、その「最悪ケースの損失」を最小化するようにモデルパラメータθを更新する問題
            </li>
          </ul>
          <p>
            この内側の最大化をPGDで近似するのがPGD Adversarial
            Trainingであり、以後の防御研究における事実上のデファクトスタンダードになりました。ただし、学習に使った攻撃(例えばPGD)に対しては頑健になっても、未知のより強い攻撃に対して頑健である保証はない、という限界も指摘されています。
          </p>
        </section>

        <section className={styles.section} id="step7">
          <h2>
            <i className="ti ti-certificate" />
            Step 7 防御2 証明可能な頑健性 Certified Robustness
          </h2>
          <p>
            書籍第6〜9章(Convex relaxation、Layer-wise relaxation、Dual approach、Probabilistic
            verification)および第11章(Certified defense)に対応します。Adversarial
            Trainingが「経験的に頑健」であるのに対し、Certified Robustness(証明可能な頑健性)は
            <strong>数学的に「この範囲の摂動なら絶対に予測が変わらない」と保証</strong>
            することを目指します。
          </p>
          <p>
            書籍前半の6〜9章は、ニューラルネットワークの各層を凸緩和(convex
            relaxation)や区間演算で上下に挟み込み、出力の変動範囲を数学的に証明するアプローチ(いわゆる形式的検証
            Formal Verification に近い手法群)を扱っています。
          </p>
          <p>
            より実務で広く使われているのが <strong>Randomized Smoothing(ランダム化平滑化)</strong>{" "}
            です。2019年、Jeremy Cohen氏・Elan Rosenfeld氏・J. Zico
            Kolter氏(いずれもCMU)は論文「Certified Adversarial Robustness via Randomized
            Smoothing」で、ガウスノイズ下でうまく分類できる任意のベースモデルを、L2ノルムに対して証明可能な頑健性を持つ新しい分類器に変換する手法を提案しました。
          </p>
          <div className={styles.diagramBlock}>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_7} id="dg-7" theme="base" />
            </div>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots" />
              図8: Randomized Smoothingの処理フロー
            </div>
          </div>
          <p>
            この手法は当時、ImageNet級の大規模データセットに対して実用的な証明可能防御を実現した数少ない方法として大きな注目を集め、IBMのAdversarial
            Robustness Toolboxにも標準実装として取り込まれています。
          </p>
        </section>

        <section className={styles.section} id="step8">
          <h2>
            <i className="ti ti-alert-triangle"></i>Step 8 壊れた防御と正しい評価方法
          </h2>
          <p>
            書籍第13章(Detection
            methods)とも関連する、この分野の研究倫理・方法論における最重要トピックです。
          </p>
          <h3>8-1 Obfuscated Gradients という落とし穴</h3>
          <p>
            2018年、Anish Athalye氏・Nicholas Carlini氏・David Wagner氏は論文「Obfuscated Gradients
            Give a False Sense of Security」で、ICLR
            2018で発表された9つの防御手法のうち7つが、実際には頑健なのではなく
            <strong>勾配マスキング(gradient masking)</strong>
            によって勾配ベース攻撃を偶然すり抜けていただけであることを示しました。「勾配が壊れている(obfuscated)ために攻撃が効かないように見える」現象で、Shattered
            Gradients(勾配が不連続・数値的に不安定)、Stochastic
            Gradients(確率的な処理により勾配が安定しない)、Exploding/Vanishing
            Gradients(勾配が発散/消失する)の3種類に分類されています。
          </p>
          <div className={styles.diagramBlock}>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_8} id="dg-8" theme="base" />
            </div>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots" />
              図9: 新しい防御手法を正しく評価するまでの流れ
            </div>
          </div>
          <p>
            Nicholas Carlini氏(現Anthropic、以前はGoogle
            DeepMind)は自身のブログ(nicholas.carlini.com/writing)でも継続的にこの問題を取り上げており、2024年の記事「(yet
            another) Broken Adversarial Example Defense at IEEE S&amp;P 2024」では、IEEE S&amp;P
            2024で発表された防御手法をわずか1行のコード修正で打ち破ったと報告し、分野全体の評価手法に対する問題提起を続けています。
          </p>
          <h3>8-2 標準化された評価 AutoAttack と RobustBench</h3>
          <p>
            こうした「見かけ上の頑健性」を防ぐため、2020年にFrancesco Croce氏とMatthias
            Hein氏(University of Tübingen)は、複数の攻撃を組み合わせたアンサンブル攻撃{" "}
            <strong>AutoAttack</strong> と、それを使って公平にモデルを比較する標準ベンチマーク{" "}
            <strong>RobustBench</strong>
            (robustbench.github.io)を提案しました。RobustBenchは120以上のモデルの評価結果を公開リーダーボードとして管理し、80以上の頑健なモデルをすぐ使えるModel
            Zooとして提供しています。新しい防御手法を発表する際は、まずこのような標準化された攻撃で自己評価し、可能であれば第三者による再現評価を受けることが、現在の分野のベストプラクティスとされています。
          </p>
        </section>

        <section className={styles.section} id="step9">
          <h2>
            <i className="ti ti-world" />
            Step 9 画像分類を超えて
          </h2>
          <p>書籍第14〜26章に対応する内容を、初学者向けに要点だけ整理します。</p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>分野</th>
                  <th>書籍の章</th>
                  <th>要点</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>画像分類以外のモデル</td>
                  <td>14章</td>
                  <td>
                    決定木やSVMなどニューラルネットワーク以外のモデルにも頑健性の議論は存在する
                  </td>
                </tr>
                <tr>
                  <td>NLPモデル</td>
                  <td>15章</td>
                  <td>
                    テキストは離散的なため、単語の言い換えや文字挿入など画像とは異なる摂動の作り方が必要
                  </td>
                </tr>
                <tr>
                  <td>グラフニューラルネットワーク</td>
                  <td>16章</td>
                  <td>エッジやノード特徴量への摂動がグラフ構造全体の予測に影響する</td>
                </tr>
                <tr>
                  <td>推薦システム</td>
                  <td>17章</td>
                  <td>悪意ある評価データの注入によりランキングを操作される可能性</td>
                </tr>
                <tr>
                  <td>強化学習</td>
                  <td>18章</td>
                  <td>観測や環境への摂動によりエージェントの行動を誤らせる</td>
                </tr>
                <tr>
                  <td>音声モデル</td>
                  <td>19章</td>
                  <td>人間には聞こえない音声への埋め込みで音声認識を誤動作させる</td>
                </tr>
                <tr>
                  <td>マルチモーダルモデル</td>
                  <td>20章</td>
                  <td>画像とテキストなど複数モダリティを跨いだ攻撃</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            特に21〜22章の <strong>Backdoor攻撃</strong> と <strong>Data Poisoning攻撃</strong>{" "}
            は、評価時ではなく学習時にモデルを狙う点で、これまでのEvasion攻撃と根本的に性質が異なります。2019年、Tianyu
            Gu氏らはIEEE Access誌の論文「BadNets: Evaluating Backdooring Attacks on Deep Neural
            Networks」で、学習データにごく小さな「トリガー」パターン(例えばストップ標識の隅に貼った小さなステッカー)を混入させることで、クリーンな入力に対しては通常通り高精度に動作しながら、トリガーが付いた入力にだけ攻撃者が意図した誤分類を起こす「BadNet」を作れることを示しました。クラウドで訓練を外部委託したり、事前学習済みモデルを再利用したりする現代的なMLパイプラインでは、この種のサプライチェーンリスクへの注意が特に重要になっています。イタリアCagliari大学のBattista
            Biggio氏とFabio Roli氏による2018年のサーベイ論文「Wild Patterns: Ten Years After the
            Rise of Adversarial Machine Learning」も、Adversarial Machine
            Learningの前史(2000年代のスパムフィルタ回避攻撃研究など)を含めた分野全体の歴史を俯瞰する重要な文献としてよく引用されます。
          </p>
        </section>

        <section className={styles.section} id="step10">
          <h2>
            <i className="ti ti-robot" />
            Step 10 LLM時代のAdversarial Robustness
          </h2>
          <p>
            書籍の刊行は2022年8月ですが、その後の大規模言語モデル(LLM)の急速な普及に伴い、Adversarial
            Robustnessの研究対象は画像分類から大きく広がりました。ここでは2026年9月時点の状況を補足します。
          </p>
          <h3>10-1 GCG Universal and Transferable Adversarial Attacks</h3>
          <p>
            2023年、Andy Zou氏・Zifan Wang氏・Nicholas Carlini氏・Milad Nasr氏・J. Zico
            Kolter氏・Matt Fredrikson氏(Carnegie Mellon University /当時のGray Swan
            AI周辺の研究者ら)は論文「Universal and Transferable Adversarial Attacks on Aligned
            Language Models」で、<strong>GCG (Greedy Coordinate Gradient)</strong>{" "}
            と呼ばれる手法を提案しました。これは勾配情報を使って、有害な出力を引き出す「suffix(接尾辞)」をトークン単位で貪欲に最適化する攻撃です。興味深いことに、このsuffixはオープンソースモデル(Vicuna等)で最適化しても、直接アクセスできないブラックボックスの商用モデルにまである程度転移することが報告されており、これはStep
            4で説明した「転移性」がLLMの世界でも成立することを示す重要な発見でした。
          </p>
          <div className={styles.diagramBlock}>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_9} id="dg-9" theme="base" />
            </div>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots" />
              図10: GCGによる攻撃と防御側の対応サイクル
            </div>
          </div>
          <h3>10-2 分野を横断する標準フレームワーク</h3>
          <p>
            2026年9月時点で、AI/LLMへの攻撃を体系的に整理する主要なフレームワークとして以下が挙げられます。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>フレームワーク</th>
                  <th>発行元</th>
                  <th>概要</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>NIST AI 100-2e2025</td>
                  <td>米国国立標準技術研究所(NIST)</td>
                  <td>
                    Predictive AI (PredAI)
                    を対象とするEvasion・Poisoning・Privacyの3分類に、Generative AI (GenAI)
                    固有のMisuse分類を加えた4分類でAdversarial ML用語を標準化
                  </td>
                </tr>
                <tr>
                  <td>MITRE ATLAS</td>
                  <td>MITRE Corporation</td>
                  <td>
                    ATT&amp;CKと同じマトリクス形式で、AIシステムに対する実際の攻撃事例と戦術・技術をカタログ化。2026年2月更新でエージェント特有の攻撃技術も追加
                  </td>
                </tr>
                <tr>
                  <td>OWASP Top 10 for LLM and GenAI 2026</td>
                  <td>OWASP GenAI Security Project</td>
                  <td>
                    Prompt
                    Injectionをはじめ、LLMアプリケーション特有のリスクを優先順位付けした実務者向けガイド。2026年8月に最新版を公開
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            NIST AI 100-2e2025は、Apostol Vassilev氏(NIST)、Alina Oprea氏(Northeastern
            University)らに加え、英国AI Security Institute・米国AI Safety
            Institute・Ciscoの研究者も著者に名を連ねており、国際的な合意形成の一例といえます。MITRE
            ATLASはMicrosoftとの協業から始まり、現在は企業・学術機関12団体以上のパートナーシップで運営される、コミュニティ主導のナレッジベースです。
          </p>
          <h3>10-3 何がどこまで同じで何が違うのか</h3>
          <ul>
            <li>
              <strong>同じ点</strong>:
              「モデルの出力を意図的に誤らせる精密な入力を作る」という基本構造や、White-box/Black-box、転移性といった概念はそのままLLMにも当てはまります。実際GCGはPGD的な最適化の考え方を離散トークン空間に応用したものと位置づけられます。
            </li>
            <li>
              <strong>異なる点</strong>:
              LLMでは入力・出力ともに自然言語という離散的・意味を持つ空間であるため、「Lpノルムで微小」という古典的な制約がそのまま使えません。代わりに、prompt
              injection(外部データ経由での指示の乗っ取り)やjailbreak(安全対策の迂回)といった、LLM特有の脅威カテゴリが中心的な関心事になっています。
            </li>
          </ul>
        </section>

        <section className={styles.section} id="step11">
          <h2>
            <i className="ti ti-tools" />
            Step 11 実践 ツールとライブラリ
          </h2>
          <p>概念を学んだら、実際に手を動かして攻撃や防御を試すことが理解を深める近道です。</p>
          <div className={styles.diagramBlock}>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_10} id="dg-10" theme="base" />
            </div>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots" />
              図11: 目的別のツール選択
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>ツール</th>
                  <th>開発元</th>
                  <th>主な特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Adversarial Robustness Toolbox (ART)</td>
                  <td>
                    IBM Research(現Linux Foundation AI and Data配下のグラデュエートプロジェクト)
                  </td>
                  <td>
                    Evasion・Poisoning・Extraction・Inferenceの4種類の脅威を横断する総合ライブラリ。55以上の攻撃と30以上の防御を実装し、TensorFlow/PyTorch/scikit-learn等の主要フレームワークに対応
                  </td>
                </tr>
                <tr>
                  <td>Foolbox</td>
                  <td>Bethge Lab(University of Tübingen) Jonas Rauber氏ら</td>
                  <td>
                    PyTorch・TensorFlow・JAXすべてに対応した、モデル頑健性のベンチマークに特化したライブラリ
                  </td>
                </tr>
                <tr>
                  <td>CleverHans</td>
                  <td>元Google Brain発、現在はCleverHans Labが継続開発</td>
                  <td>
                    分野初期から使われている老舗ライブラリ。攻撃の再現実装のリファレンスとして広く参照される
                  </td>
                </tr>
                <tr>
                  <td>RobustBench</td>
                  <td>
                    Francesco Croce氏・Matthias Hein氏ら(Tübingen大学 / EPFL / Princeton大学など)
                  </td>
                  <td>
                    AutoAttackを用いた標準ベンチマーク。80以上の頑健なモデルを含むModel
                    Zooをpipから直接利用可能
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            書籍の著者であるPin-Yu
            Chen氏自身がART開発陣の一員であることもあり、この書籍とARTは内容的にも親和性が高く、書籍を読みながらARTのサンプルコードで手を動かすという学び方がおすすめです。
          </p>
        </section>

        <section className={styles.section} id="step12">
          <h2>
            <i className="ti ti-route" />
            Step 12 学習ロードマップ
          </h2>
          <div className={styles.diagramBlock}>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_11} id="dg-11" theme="base" />
            </div>
            <div className={styles.diagramCaption}>
              <i className="ti ti-chart-dots" />
              図12: 基礎から応用までの学習ロードマップ
            </div>
          </div>
          <ol className={styles.stepList}>
            <li>
              <strong>基礎</strong>: Szegedy et al.(2014)とGoodfellow et
              al.(2014)を読み、FGSMを実際にコードで実装してみる
            </li>
            <li>
              <strong>中級</strong>: Madry et al.(2017)のPGDとAdversarial
              Trainingを理解し、ARTやFoolboxで手を動かす
            </li>
            <li>
              <strong>中級〜上級</strong>: Cohen et al.(2019)のRandomized
              Smoothingで「証明可能」とはどういうことかを体験する
            </li>
            <li>
              <strong>上級</strong>: Athalye et
              al.(2018)を読み、自分や他人の防御手法を批判的に評価する視点を養う。RobustBenchのリーダーボードを眺め、現在のSOTAを把握する
            </li>
            <li>
              <strong>応用</strong>: 書籍第14〜26章で画像分類以外の領域を概観したのち、Zou et
              al.(2023)のGCGやMITRE ATLAS、OWASP Top 10 for LLM and GenAIでLLM時代の脅威モデルを学ぶ
            </li>
          </ol>
        </section>

        <section className={styles.section} id="summary">
          <h2>
            <i className="ti ti-flag" />
            まとめ
          </h2>
          <ul>
            <li>
              Adversarial
              Exampleは2013〜2014年にSzegedy氏・Goodfellow氏らによって発見され、ニューラルネットワークの本質的な脆弱性として広く認識されるようになった
            </li>
            <li>
              攻撃はWhite-box(FGSM, PGD,
              C&amp;W)からBlack-box、物理世界まで多様化しており、脅威モデル(攻撃者の知識・目的・摂動の制約)を正確に定義することが議論の出発点になる
            </li>
            <li>
              防御はAdversarial Training(経験的)とCertified
              Robustness(数学的に証明可能)の大きく2系統があり、それぞれにトレードオフがある
            </li>
            <li>
              「頑健に見えるだけ」のObfuscated
              Gradientsという落とし穴があり、AutoAttack/RobustBenchのような標準化された評価が分野の信頼性を支えている
            </li>
            <li>
              Backdoor攻撃やData
              Poisoningのように、学習時を狙う脅威はサプライチェーン全体のリスクとして重要性を増している
            </li>
            <li>
              2022年の書籍刊行以降、LLMの台頭によりGCGのような新しい攻撃手法や、NIST・MITRE・OWASPといった国際的な標準フレームワークが整備され、分野はAIセキュリティ全体へと拡大している
            </li>
          </ul>
        </section>

        <section className={styles.section} id="checklist">
          <h2>
            <i className="ti ti-clipboard-check" />
            理解度チェックリスト
          </h2>
          <div className={styles.checklistCounter}>
            <i className="ti ti-list-check" />
            <span id="ckCounter">0 / 10 完了</span>
          </div>
          <ul className={styles.checklist} id="checklistItems" data-testid="checklist-items">
            <li>
              <label>
                <input type="checkbox" />
                <span className={styles.ckText}>
                  Adversarial Exampleとランダムノイズの違いを、自分の言葉で説明できる
                </span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span className={styles.ckText}>
                  White-box攻撃とBlack-box攻撃の違いと、それぞれの代表的な手法を挙げられる
                </span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span className={styles.ckText}>
                  FGSMとPGDの関係(1ステップ vs 反復)を説明できる
                </span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span className={styles.ckText}>
                  Adversarial
                  Trainingのミニマックス定式化の意味(内側の最大化と外側の最小化)を理解している
                </span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span className={styles.ckText}>
                  「証明可能な頑健性」が「経験的な頑健性」とどう違うかを説明できる
                </span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span className={styles.ckText}>
                  Obfuscated Gradientsがなぜ危険な落とし穴なのかを説明できる
                </span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span className={styles.ckText}>
                  AutoAttackやRobustBenchが果たす役割を理解している
                </span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span className={styles.ckText}>
                  Backdoor攻撃がEvasion攻撃とどう違うかを説明できる
                </span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span className={styles.ckText}>
                  GCGのような攻撃が、古典的なPGDの考え方とどうつながっているかを説明できる
                </span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span className={styles.ckText}>
                  NIST AI 100-2、MITRE ATLAS、OWASP Top 10 for LLM and
                  GenAIがそれぞれ何のためのフレームワークかを説明できる
                </span>
              </label>
            </li>
          </ul>
        </section>

        <section className={styles.section} id="references">
          <h2>
            <i className="ti ti-external-link" />
            参考文献 情報源
          </h2>

          <div className={styles.refGroupTitle}>
            <i className="ti ti-book-2" />
            原書籍
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              1
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                Pin-Yu Chen, Cho-Jui Hsieh, <em>Adversarial Robustness for Machine Learning</em>,
                Elsevier, 2022
              </div>
              <a
                className={styles.refUrl}
                href="https://shop.elsevier.com/books/adversarial-robustness-for-machine-learning/chen/978-0-12-824020-5"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://shop.elsevier.com/books/adversarial-robustness-for-machine-learning/chen/978-0-12-824020-5
              </a>
            </div>
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              2
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>ScienceDirect(書籍本文の閲覧ページ)</div>
              <a
                className={styles.refUrl}
                href="https://www.sciencedirect.com/science/book/9780128240205"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.sciencedirect.com/science/book/9780128240205
              </a>
            </div>
          </div>

          <div className={styles.refGroupTitle}>
            <i className="ti ti-bug" />
            基礎理論 発見と攻撃手法
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              3
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                Szegedy et al., &quot;Intriguing properties of neural networks&quot; (2013/2014)
              </div>
              <a
                className={styles.refUrl}
                href="https://arxiv.org/abs/1312.6199"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://arxiv.org/abs/1312.6199
              </a>
            </div>
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              4
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                Goodfellow, Shlens, Szegedy, &quot;Explaining and Harnessing Adversarial
                Examples&quot; (2014)
              </div>
              <a
                className={styles.refUrl}
                href="https://arxiv.org/abs/1412.6572"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://arxiv.org/abs/1412.6572
              </a>
            </div>
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              5
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                Madry, Makelov, Schmidt, Tsipras, Vladu, &quot;Towards Deep Learning Models
                Resistant to Adversarial Attacks&quot; (2017)
              </div>
              <a
                className={styles.refUrl}
                href="https://arxiv.org/abs/1706.06083"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://arxiv.org/abs/1706.06083
              </a>
            </div>
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              6
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                Carlini, Wagner, &quot;Towards Evaluating the Robustness of Neural Networks&quot;
                (2017)
              </div>
              <a
                className={styles.refUrl}
                href="https://arxiv.org/abs/1608.04644"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://arxiv.org/abs/1608.04644
              </a>
            </div>
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              7
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                Kurakin, Goodfellow, Bengio, &quot;Adversarial examples in the physical world&quot;
                (2016)
              </div>
              <a
                className={styles.refUrl}
                href="https://arxiv.org/abs/1607.02533"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://arxiv.org/abs/1607.02533
              </a>
            </div>
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              8
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                Eykholt et al., &quot;Robust Physical-World Attacks on Deep Learning Visual
                Classification&quot;, CVPR 2018
              </div>
              <a
                className={styles.refUrl}
                href="https://openaccess.thecvf.com/content_cvpr_2018/papers/Eykholt_Robust_Physical-World_Attacks_CVPR_2018_paper.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://openaccess.thecvf.com/content_cvpr_2018/papers/Eykholt_Robust_Physical-World_Attacks_CVPR_2018_paper.pdf
              </a>
            </div>
          </div>

          <div className={styles.refGroupTitle}>
            <i className="ti ti-shield-check" />
            防御と評価
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              9
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                Cohen, Rosenfeld, Kolter, &quot;Certified Adversarial Robustness via Randomized
                Smoothing&quot; (2019)
              </div>
              <a
                className={styles.refUrl}
                href="https://arxiv.org/abs/1902.02918"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://arxiv.org/abs/1902.02918
              </a>
            </div>
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              10
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                Athalye, Carlini, Wagner, &quot;Obfuscated Gradients Give a False Sense of
                Security&quot; (2018)
              </div>
              <a
                className={styles.refUrl}
                href="https://arxiv.org/abs/1802.00420"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://arxiv.org/abs/1802.00420
              </a>
            </div>
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              11
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                Croce, Andriushchenko, Sehwag, Debenedetti, Flammarion, Chiang, Mittal, Hein,
                &quot;RobustBench: a standardized adversarial robustness benchmark&quot; (2020)
              </div>
              <a
                className={styles.refUrl}
                href="https://arxiv.org/abs/2010.09670"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://arxiv.org/abs/2010.09670
              </a>
              {" ／ リーダーボード "}
              <a
                className={styles.refUrl}
                href="https://robustbench.github.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://robustbench.github.io/
              </a>
            </div>
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              12
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                Nicholas Carlini氏 個人ブログ(継続的な防御手法への批判的検証や研究者向け考察を公開)
              </div>
              <a
                className={styles.refUrl}
                href="https://nicholas.carlini.com/writing"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://nicholas.carlini.com/writing
              </a>
            </div>
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              13
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>Nicholas Carlini氏 論文一覧</div>
              <a
                className={styles.refUrl}
                href="https://nicholas.carlini.com/papers"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://nicholas.carlini.com/papers
              </a>
            </div>
          </div>

          <div className={styles.refGroupTitle}>
            <i className="ti ti-shield-x" />
            Backdoor Poisoning 歴史的サーベイ
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              14
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                Gu, Liu, Dolan-Gavitt, Garg, &quot;BadNets: Evaluating Backdooring Attacks on Deep
                Neural Networks&quot;, IEEE Access, 2019
              </div>
              <a
                className={styles.refUrl}
                href="https://arxiv.org/abs/1708.06733"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://arxiv.org/abs/1708.06733
              </a>
            </div>
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              15
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                Biggio, Roli, &quot;Wild Patterns: Ten Years After the Rise of Adversarial Machine
                Learning&quot;, Pattern Recognition, 2018
              </div>
              <a
                className={styles.refUrl}
                href="https://arxiv.org/abs/1712.03141"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://arxiv.org/abs/1712.03141
              </a>
            </div>
          </div>

          <div className={styles.refGroupTitle}>
            <i className="ti ti-robot" />
            LLM 時代の脅威フレームワーク 2026年9月時点
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              16
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                Zou, Wang, Carlini, Nasr, Kolter, Fredrikson, &quot;Universal and Transferable
                Adversarial Attacks on Aligned Language Models&quot; (2023)
              </div>
              <a
                className={styles.refUrl}
                href="https://arxiv.org/abs/2307.15043"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://arxiv.org/abs/2307.15043
              </a>
            </div>
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              17
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                NIST AI 100-2e2025, &quot;Adversarial Machine Learning: A Taxonomy and Terminology
                of Attacks and Mitigations&quot;
              </div>
              <a
                className={styles.refUrl}
                href="https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-2e2025.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-2e2025.pdf
              </a>
            </div>
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              18
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                MITRE ATLAS(Adversarial Threat Landscape for Artificial-Intelligence Systems)
              </div>
              <a
                className={styles.refUrl}
                href="https://atlas.mitre.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://atlas.mitre.org/
              </a>
            </div>
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              19
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                OWASP GenAI Security Project, &quot;Top 10 for LLM and GenAI&quot;
              </div>
              <a
                className={styles.refUrl}
                href="https://genai.owasp.org/initiatives/top-10-for-llm-and-genai/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://genai.owasp.org/initiatives/top-10-for-llm-and-genai/
              </a>
            </div>
          </div>

          <div className={styles.refGroupTitle}>
            <i className="ti ti-tools" />
            ツール ライブラリ
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              20
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>
                Adversarial Robustness Toolbox (ART), IBM Research / Linux Foundation AI and Data
              </div>
              <a
                className={styles.refUrl}
                href="https://github.com/Trusted-AI/adversarial-robustness-toolbox"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/Trusted-AI/adversarial-robustness-toolbox
              </a>
            </div>
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              21
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>Foolbox, Bethge Lab</div>
              <a
                className={styles.refUrl}
                href="https://github.com/bethgelab/foolbox"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/bethgelab/foolbox
              </a>
            </div>
          </div>
          <div className={styles.refCard} data-testid="ref-card">
            <div className={styles.refNum} data-testid="ref-num">
              22
            </div>
            <div className={styles.refBody}>
              <div className={styles.refTitle}>CleverHans</div>
              <a
                className={styles.refUrl}
                href="https://github.com/cleverhans-lab/cleverhans"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/cleverhans-lab/cleverhans
              </a>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>
            本ガイドは2026年9月14日時点のウェブ検索結果と一次情報源に基づいて作成されています。研究は日々更新されるため、最新の攻撃手法やベンチマーク結果については各リンク先の一次情報を直接ご確認ください。
          </p>
        </footer>
      </main>
    </div>
  );
}
