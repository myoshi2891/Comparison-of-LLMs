import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata = {
  title: "Claude Fable 5 実践活用ガイド | Claude Code エンジニアのためのベストプラクティス",
  description:
    "Claude Codeエンジニアのための中級〜上級者向けベストプラクティス。「指示を積み上げる」から「ゴールと検証基準を渡して任せる」へ ― Fable 5に最適化された思考法をステップバイステップで解説します。",
};

const DIAGRAMS = {
  diagram1: `graph TD
    MF["共通の基盤モデル<br/>(旧世代 Mythos Preview からの進化)"]
    MF --> Mythos5["Claude Mythos 5<br/>安全分類器なし<br/>Project Glasswing 経由の限定提供"]
    MF --> Fable5["Claude Fable 5<br/>安全分類器あり<br/>一般提供(GA)"]
    Mythos5 --> GW["Project Glasswing<br/>重要インフラ防御パートナー向けプログラム<br/>(AWS / Apple / Google / Microsoft / NVIDIA / CrowdStrike 等)"]
    Fable5 --> Users["Claude API / Claude Platform on AWS / Bedrock<br/>Google Cloud / Microsoft Foundry<br/>Claude Code / Claude.ai / Claude Cowork"]`,
};

export default function Fable5BestPracticesPage() {
  return (
    <div className={styles.pageContainer}>
      <aside className={styles.sidebar}>
        <a href="#top" className={styles.brand}>
          <div className={styles.brandMark}>F5</div>
          <div className={styles.brandText}>
            Claude Fable 5
            <span className={styles.brandSub}>Best Practices</span>
          </div>
        </a>
        <div className={styles.sidebarMeta}>
          最終更新: 2026-07-04
          <br />
          対象: Claude Code 中〜上級者
        </div>
        <nav className={styles.toc} id="toc">
          <a href="#ch1" className={styles.tocLink}>
            <span className={styles.num}>01</span>Fable 5とは何か
          </a>
          <a href="#ch2" className={styles.tocLink}>
            <span className={styles.num}>02</span>タイムライン
          </a>
          <a href="#ch3" className={styles.tocLink}>
            <span className={styles.num}>03</span>安全分類器とフォールバック
          </a>
          <a href="#ch4" className={styles.tocLink}>
            <span className={styles.num}>04</span>プロンプティングの転換
          </a>
          <a href="#ch5" className={styles.tocLink}>
            <span className={styles.num}>05</span>Effortレベル
          </a>
          <a href="#ch6" className={styles.tocLink}>
            <span className={styles.num}>06</span>Claude Codeでの実践設定
          </a>
          <a href="#ch7" className={styles.tocLink}>
            <span className={styles.num}>07</span>Loop Engineering
          </a>
          <a href="#ch8" className={styles.tocLink}>
            <span className={styles.num}>08</span>Unknownsフレームワーク
          </a>
          <a href="#ch9" className={styles.tocLink}>
            <span className={styles.num}>09</span>検証ループとメモリ
          </a>
          <a href="#ch10" className={styles.tocLink}>
            <span className={styles.num}>10</span>モデル選定とコスト
          </a>
          <a href="#ch11" className={styles.tocLink}>
            <span className={styles.num}>11</span>アンチパターン
          </a>
          <a href="#ch12" className={styles.tocLink}>
            <span className={styles.num}>12</span>実力と検証の必要性
          </a>
          <a href="#ch13" className={styles.tocLink}>
            <span className={styles.num}>13</span>既知の制限事項
          </a>
          <a href="#ch14" className={styles.tocLink}>
            <span className={styles.num}>14</span>まとめ
          </a>
          <a href="#ch15" className={styles.tocLink}>
            <span className={styles.num}>15</span>参考文献
          </a>
        </nav>
      </aside>

      <main className={styles.content}>
        <div className={styles.wrap}>
          <header className={styles.hero} id="top">
            <span className={styles.heroEyebrow}>CLAUDE CODE ・ MODEL PLAYBOOK</span>
            <h1>
              Claude Fable 5
              <br />
              実践活用ガイド
            </h1>
            <p className={styles.lead}>
              Claude Codeエンジニアのための中級〜上級者向けベストプラクティス。「指示を積み上げる」から「ゴールと検証基準を渡して任せる」へ ― Fable 5に最適化された思考法をステップバイステップで解説する。
            </p>
            <div className={styles.heroAudience}>
              <b>対象読者:</b> Claude Codeを日常的に使っており、Opus / Sonnet世代のプロンプト設計には慣れているが、Fable 5特有の挙動にまだ最適化できていないエンジニア。
              <br />
              <br />
              <b>情報時点:</b> 2026年7月4日。Fable 5は現在進行形でアップデートされているモデルのため、記載内容は今後変わる可能性がある。
            </div>
          </header>

          <section className={`${styles.chapter} chapter`} id="ch1">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>01</span>
              <h2>Claude Fable 5 とは何か</h2>
            </div>

            <p>
              Claude Fable 5 は、Anthropic が2026年6月9日に発表した「Claude 5」世代の最初のモデルで、Opus よりも上位に位置づけられる新しい「Mythos」クラスの一般提供版である。同時に発表された <b>Claude Mythos 5</b> は同一の基盤モデルを共有しているが、Fable 5 にのみ追加の安全分類器(セーフガード)が搭載されている点が異なる。Mythos 5 は &quot;Project Glasswing&quot; という信頼されたパートナー向けプログラムを通じてのみ限定提供されている。
            </p>

            <h3>1.1 スペック概要</h3>
            <div className={styles.specGrid}>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>Model ID</div>
                <div className={styles.specValue}>
                  <code className={styles.inlineCode}>claude-fable-5</code>
                </div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>コンテキスト窓</div>
                <div className={styles.specValue}>既定 100万トークン</div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>最大出力</div>
                <div className={styles.specValue}>12.8万トークン/リクエスト</div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>価格(入力)</div>
                <div className={styles.specValue}>$10 / 100万トークン</div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>価格(出力)</div>
                <div className={styles.specValue}>$50 / 100万トークン</div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>Thinking</div>
                <div className={styles.specValue}>Adaptive Thinkingのみ</div>
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>位置づけ</td>
                    <td>Anthropicが一般提供する中で最も高性能なモデル。長時間・高難度・曖昧なタスク向け</td>
                  </tr>
                  <tr>
                    <td>提供チャネル</td>
                    <td>
                      Claude API / Claude Platform on AWS / Amazon Bedrock / Google Cloud / Microsoft Foundry / Claude Code / Claude.ai / Claude Cowork
                    </td>
                  </tr>
                  <tr>
                    <td>データ保持</td>
                    <td>30日間保持の「Covered Model」扱い。Zero Data Retention(ZDR)は非対応</td>
                  </tr>
                  <tr>
                    <td>Thinking表示</td>
                    <td>
                      生の思考過程(raw chain of thought)は返却されない。
                      <code className={styles.inlineCode}>thinking.display</code>
                      で「要約」または「非表示」を選択
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>1.2 モデルファミリーの関係性</h3>
            <div className={styles.diagramFrame}>
              <div className={styles.mermaid} id="diagram-1">
                <MermaidDiagram chart={DIAGRAMS.diagram1} />
              </div>
              <div className={styles.diagramCaption}>図1: Fable 5 / Mythos 5 / Project Glasswing の関係</div>
            </div>

            <p>
              Fable 5 と Mythos 5 は「同じ頭脳、異なる安全装備」というイメージで捉えると理解しやすい。Fable 5 は分類器というガードレールを装備することで安全に広く配布できるようにした版、Mythos 5 はガードレールなしで信頼できるパートナーにのみ渡す版、という棲み分けである。
            </p>
          </section>

          <section className={`${styles.chapter} chapter`} id="ch2">
            <div className={styles.chapterHead}>
              <span className={styles.chapterNum}>02</span>
              <h2>タイムライン: リリースから輸出規制、復旧まで</h2>
            </div>

            <p>
              Fable 5 は発表から1ヶ月足らずで、一度サービス停止という大きな出来事を経験している。プロンプト設計とは直接関係ないが、可用性設計(フォールバックの必要性)を理解する上で重要な背景である。
            </p>

            <div className={styles.timeline}>
              <div className={styles.tItem}>
                <div className={styles.tDate}>2026-06-09</div>
                <div className={styles.tBody}>
                  <b>Fable 5 / Mythos 5 発表・一般提供開始。</b>
                  Claude 5世代の最初のモデルとして、Claude API・Claude Code・Claude.ai等で同時に利用可能になった。
                </div>
              </div>
              <div className={styles.tItem}>
                <div className={styles.tDate}>2026-06-12</div>
                <div className={styles.tBody}>
                  <b>米商務省が輸出規制を適用、全世界でアクセスを一時停止。</b>
                  Amazonの研究者がFable 5の安全策を回避してソフトウェア脆弱性を特定できる手法を発見・報告したことがきっかけ。外国籍ユーザーを区別する即時的な手段がなかったため、全ユーザー向けに停止された。
                </div>
              </div>
              <div className={styles.tItem}>
                <div className={styles.tDate}>2026-06-30</div>
                <div className={styles.tBody}>
                  <b>米商務省が規制を解除、Anthropicが復旧を発表。</b>
                  Anthropicが安全対策の強化と米政府への協力を約束したことを受け、輸出管理措置が撤回された。
                </div>
              </div>
              <div className={styles.tItem}>
                <div className={styles.tDate}>2026-07-01</div>
                <div className={styles.tBody}>
                  <b>全世界でアクセス復旧。</b>
                  Claude Code / Claude.ai / API / Cowork を含む全チャネルで利用可能に。分類器の精度は強化され、サイバーセキュリティ関連の誤検知率も改善されたと報告されている。
                </div>
              </div>
              <div className={styles.tItem}>
                <div className={styles.tDate}>2026-07-07(予定)</div>
                <div className={styles.tBody}>
                  <b>無料利用枠の変更予定。</b>
                  Pro/Max/Team等における週次利用枠上限50%の無料提供が終了し、以降は使用クレジット制に移行する見込み。
                </div>
              </div>
            </div>

            <div className={`${styles.callout} ${styles.warn}`}>
              <span className={styles.calloutLabel}>実務への含意</span>
              <p>
                この一件は、「Fable 5 に固定的に依存する設計は避け、フォールバック先(Opus 4.8 など)を必ず用意しておく」という教訓を残した。一時停止の経緯についての公式声明は、Anthropicのニュースページで確認できる(巻末の参考文献を参照)。次章で解説する自動フォールバック機構は、まさにこの種のリスクに対する備えとしても機能する。
              </p>
            </div>
          </section>
        </div>
      </main>

      <TocObserver />
    </div>
  );
}
