import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "Kimi(Moonshot AI)LLM 徹底ガイド 2026年7月版 ― 初学者のためのベストプラクティス",
  description:
    "Moonshot AIが開発する大規模言語モデル「Kimi」シリーズ（K1.5, K2, K2.6, K2.7-Code, K3）の活用方法、プロンプト設計、Tool Calling、Thinking/reasoning_effort、コンテキストキャッシュ、コスト最適化を解説する完全ガイド。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function KimiLlmBestPracticesPage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          Kimi LLM <span>徹底ガイド</span>
        </div>
        <div className={styles.subbrand}>初学者のためのベストプラクティス</div>
        <div className={styles.updatebadge}>2026-07-18 更新 ・ Kimi K3対応</div>
        <nav>
          <a href="#intro" className={styles.tocLink}>
            <span className={styles.num}>01</span>はじめに
          </a>
          <a href="#k3" className={styles.tocLink}>
            <span className={styles.num}>02</span>【最新】Kimi K3
          </a>
          <a href="#ecosystem" className={styles.tocLink}>
            <span className={styles.num}>03</span>エコシステム全体像
          </a>
          <a href="#setup" className={styles.tocLink}>
            <span className={styles.num}>04</span>セットアップ
          </a>
          <a href="#params" className={styles.tocLink}>
            <span className={styles.num}>05</span>基本パラメータ
          </a>
          <a href="#system-prompt" className={styles.tocLink}>
            <span className={styles.num}>06</span>システムプロンプト
          </a>
          <a href="#tool-calling" className={styles.tocLink}>
            <span className={styles.num}>07</span>Tool Calling
          </a>
          <a href="#thinking" className={styles.tocLink}>
            <span className={styles.num}>08</span>Thinking/reasoning_effort
          </a>
          <a href="#partial-mode" className={styles.tocLink}>
            <span className={styles.num}>09</span>Partial Mode
          </a>
          <a href="#caching" className={styles.tocLink}>
            <span className={styles.num}>10</span>コンテキストキャッシュ
          </a>
          <a href="#multimodal" className={styles.tocLink}>
            <span className={styles.num}>11</span>マルチモーダル
          </a>
          <a href="#pricing" className={styles.tocLink}>
            <span className={styles.num}>12</span>料金体系
          </a>
          <a href="#rate-limits" className={styles.tocLink}>
            <span className={styles.num}>13</span>レート制限
          </a>
          <a href="#practice" className={styles.tocLink}>
            <span className={styles.num}>14</span>実践例
          </a>
          <a href="#security" className={styles.tocLink}>
            <span className={styles.num}>15</span>セキュリティ・プライバシー
          </a>
          <a href="#errors" className={styles.tocLink}>
            <span className={styles.num}>16</span>エラー対処
          </a>
          <a href="#community" className={styles.tocLink}>
            <span className={styles.num}>17</span>著名開発者の知見
          </a>
          <a href="#checklist" className={styles.tocLink}>
            <span className={styles.num}>18</span>チェックリスト
          </a>
          <a href="#references" className={styles.tocLink}>
            <span className={styles.num}>19</span>参考文献
          </a>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>AI ENGINEERING GUIDE</span>
          <span className={`${styles.eyebrow} ${styles.eyebrowNew}`}>
            🆕 Kimi K3 対応・2026年7月18日更新
          </span>
          <h1>
            Kimi(Moonshot AI)LLM 徹底ガイド
            <br />
            初学者のためのベストプラクティス
          </h1>
          <p className={styles.lead}>
            中国Moonshot
            AI社が開発する大規模言語モデル「Kimi」シリーズについて、モデルの選び方からプロンプト設計、
            Tool Calling、Thinking/reasoning_effort、コスト最適化まで、公式ドキュメントに加えSimon
            Willison氏や Hacker
            Newsなど著名な国際的開発者の知見も交えてステップバイステップで解説します。
          </p>
          <div className={styles.updated}>
            本ガイドは2026年7月18日時点のウェブ検索にもとづきます。2026年7月16日に新フラッグシップ「Kimi
            K3」が発表されたばかりであり、情報は非常に速く更新されています。 本番導入前には必ず{" "}
            <Ext href="https://platform.kimi.ai/docs/overview">
              Kimi API Platform公式ドキュメント
            </Ext>{" "}
            を確認してください。
          </div>
        </header>

        {/* ============ 1. はじめに ============ */}
        <section className={styles.section} id="intro">
          <h2>
            <span className={styles.badge}>01</span>はじめに:KimiとMoonshot AIとは
          </h2>
          <p>
            <strong>Kimi</strong> は中国のAI企業 <strong>Moonshot AI(月之暗面)</strong>{" "}
            が開発する大規模言語モデル(LLM)シリーズ、
            およびそれを使った製品群の総称です。2023年10月に一般公開されたチャットボット「Kimi」は、当時としては業界最大級となる
            12.8万トークンのコンテキスト長をサポートしたことで注目を集めました。その後モデルは急速に進化し、2025年7月には
            1兆パラメータのMoE(Mixture-of-Experts)モデル <strong>Kimi K2</strong>{" "}
            をオープンウェイトで公開し、
            コーディングとエージェント(自律実行)性能で高い評価を得ました。そして
            <strong>2026年7月16日、さらに大規模な後継モデル 「Kimi K3」が発表</strong>
            され、本ガイド執筆時点で最新のフラッグシップとなっています。
          </p>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://en.wikipedia.org/wiki/Kimi_(chatbot)">
              Kimi (chatbot) - Wikipedia
            </Ext>
          </p>

          <div className={styles.callout}>
            <strong>初学者向けポイント</strong>
            <ul>
              <li>
                <strong>Kimiは「製品」と「モデル」の2つの顔を持つ</strong>
                :一般ユーザー向けのチャットアプリ(kimi.com)と、開発者向けのAPIプラットフォーム(platform.moonshot.ai
                / platform.kimi.ai)は別物です。
              </li>
              <li>
                <strong>KimiのAPIはOpenAI互換</strong>です。既存のOpenAI SDKの{" "}
                <code className={styles.inlineCode}>base_url</code> を書き換えるだけで移行できます。
              </li>
              <li>
                <strong>オープンウェイト戦略</strong>:Kimi K2系列のモデル重みはHugging
                Faceで公開されており、Modified MIT
                Licenseのもとで自己ホスティングも可能です。最新のK3も同様にオープンウェイトで提供される予定です(2章参照)。
              </li>
            </ul>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/overview">Quickstart - Kimi API Platform</Ext>,{" "}
            <Ext href="https://github.com/moonshotai/kimi-k2">GitHub - MoonshotAI/Kimi-K2</Ext>
          </p>
        </section>

        {/* ============ 2. Kimi K3 ============ */}
        <section className={styles.section} id="k3">
          <h2>
            <span className={styles.badge}>02</span>【最新】Kimi K3の登場とモデルファミリーの現状
          </h2>

          <h3>2.1 Kimi K3とは何か(2026年7月16日発表)</h3>
          <p>
            Moonshot AIは2026年7月16日、これまでで最も強力なモデル <strong>Kimi K3</strong>{" "}
            を発表しました。 世界の主要メディア(VentureBeat、Fortune、Reutersなど)やSimon
            Willison氏、Hacker Newsのコミュニティが即日反応した、非常に大きなニュースです。
          </p>
          <ul>
            <li>
              <strong>2.8兆パラメータ</strong>
              のMoE(Mixture-of-Experts)モデルで、公開時点で世界最大のオープンウェイトモデルとされています。
            </li>
            <li>
              新しいアテンション機構 <strong>Kimi Delta Attention(KDA)</strong> と{" "}
              <strong>Attention Residuals(AttnRes)</strong> を採用。
            </li>
            <li>
              <strong>Stable LatentMoE</strong>{" "}
              フレームワークにより、896個のエキスパートのうち16個だけを活性化する、非常にスパースな設計。
            </li>
            <li>
              <strong>1,048,576トークン(約100万トークン)のコンテキスト長</strong>
              をネイティブサポート。
            </li>
            <li>
              <strong>常時思考(always-on thinking)</strong>
              :K2系列のような「思考あり/なし」の切り替えではなく、常に推論しながら応答します。
            </li>
            <li>
              ネイティブなマルチモーダル(画像・動画理解)対応。モデルの重み自体は2026年7月27日までに公開予定。
            </li>
          </ul>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://venturebeat.com/technology/chinas-moonshot-ai-releases-kimi-k3-the-largest-open-source-model-ever-rivaling-top-u-s-systems">
              China's Moonshot AI releases Kimi K3 | VentureBeat
            </Ext>
            ,{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-quickstart">
              Kimi K3 - Kimi API Platform
            </Ext>
            ,{" "}
            <Ext href="https://simonwillison.net/2026/Jul/16/kimi-k3/">
              Kimi K3, and what we can still learn from the pelican benchmark - Simon Willison
            </Ext>
          </p>

          <h3>2.2 ベンチマークと評価(第三者評価)</h3>
          <ul>
            <li>
              Artificial Analysisの長期知識労働評価でElo 1547を記録し、Kimi
              K2.6から+732ポイントの大幅向上。Claude Fable 5に次ぐ第2位。
            </li>
            <li>Arena.aiの「Frontend Code」アリーナでは首位(Claude Fable 5を上回る)。</li>
            <li>
              GDPval-AA v2ベンチマークでは1668点で、Claude Fable 5 Max・GPT-5.6 Sol
              Maxに次ぐ位置、Claude Opus 4.8 Max(1600点)を上回る。
            </li>
            <li>
              タスクあたりのコストは$0.94で、GPT-5.6 Sol($1.04)と近く、Claude Opus
              4.8($1.80)の約半分。
            </li>
          </ul>
          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <strong>注意</strong>
            :上記のベンチマーク数値の多くはMoonshot自身の発表またはArtificial
            Analysisなど特定機関の私的評価にもとづくものです。7月17日時点では、SWE-Bench・Terminal-Bench・HLEなど従来からの独立系公開ベンチマークでの検証結果はまだ出揃っていません。実運用への採用判断は、自分のタスクでの実地検証を必ず行ってください。
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://simonwillison.net/2026/Jul/16/kimi-k3/">
              Kimi K3, and what we can still learn from the pelican benchmark - Simon Willison
            </Ext>
            ,{" "}
            <Ext href="https://mlq.ai/news/moonshot-ai-releases-kimi-k3-a-28-trillion-parameter-open-weight-model-rivaling-top-us-systems/">
              Moonshot AI Releases Kimi K3 | MLQ News
            </Ext>
            , <Ext href="https://artificialanalysis.ai/">Artificial Analysis</Ext>
          </p>

          <h3>2.3 モデルファミリー全体の現状(2026年7月18日時点)</h3>
          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart TB
    A["Kimi K2 (2025年7月)<br/>1T総/32B活性化パラメータ・非思考"] --> B["Kimi K2 Thinking (2025年11月)<br/>常時思考・200-300ステップのツール呼び出し"]
    B --> C["Kimi K2.5 (2026年1月)<br/>マルチモーダル・Agent Swarm(最大100サブエージェント)"]
    C --> D["Kimi K2.6 (2026年4月)<br/>コーディング・UI生成・現行の汎用フラッグシップ"]
    D --> E["Kimi K2.7 Code (2026年6月)<br/>コーディング特化・常時思考"]
    E --> F["Kimi K3 (2026年7月16日)<br/>2.8T・1Mコンテキスト・KDA/AttnRes・常時思考"]`}
            />
          </div>
          <div className={styles.diagramCaption}>図1: Kimiモデルの進化タイムライン(K3まで)</div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>モデルID</th>
                  <th>ステータス(2026-07-18時点)</th>
                  <th>パラメータ規模</th>
                  <th>コンテキスト長</th>
                  <th>備考</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>kimi-k2</code>系列(0711/0905/turbo/thinking)
                  </td>
                  <td>
                    <strong>廃止済み(2026-05-25)</strong>
                  </td>
                  <td>1T総/32B活性化</td>
                  <td>128K〜256K</td>
                  <td>保守・サポート終了。移行必須</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>kimi-latest</code>
                  </td>
                  <td>
                    <strong>廃止済み(2026-01-28)</strong>
                  </td>
                  <td>―</td>
                  <td>―</td>
                  <td>保守・サポート終了</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>kimi-k2.5</code> /{" "}
                    <code className={styles.inlineCode}>moonshot-v1</code>系列
                  </td>
                  <td>
                    <strong>新規利用不可、2026-08-31完全終了予定</strong>
                  </td>
                  <td>1T総/32B活性化</td>
                  <td>256K</td>
                  <td>既存ユーザーも早期移行を推奨</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>kimi-k2.6</code>
                  </td>
                  <td>提供中(汎用フラッグシップ)</td>
                  <td>1T総/32B活性化・384エキスパート</td>
                  <td>256K</td>
                  <td>テキスト中心の汎用タスクに最適</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>kimi-k2.7-code</code>
                  </td>
                  <td>提供中(コーディング特化)</td>
                  <td>1T総/32B活性化・384エキスパート</td>
                  <td>256K</td>
                  <td>ルーティンコーディングの既定選択肢</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>kimi-k3</code>
                  </td>
                  <td>
                    <strong>提供中(最新フラッグシップ)</strong>
                  </td>
                  <td>2.8T総・896中16活性化</td>
                  <td>1,048,576(1M)</td>
                  <td>長時間コーディング・大規模コンテキスト・視覚推論向け</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/models">Model List - Kimi API Platform</Ext>,{" "}
            <Ext href="https://www.verdent.ai/guides/agents/kimi-k3-api-guide">
              Kimi K3 API Guide - Verdent Guides
            </Ext>
          </p>

          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <strong>重要な移行上の注意</strong>:公式のモデル一覧ページでは「
            <code className={styles.inlineCode}>kimi-k2</code>
            系列は2026年5月25日付で正式に廃止・保守終了、
            <code className={styles.inlineCode}>kimi-latest</code>
            は2026年1月28日付で廃止・保守終了、
            <code className={styles.inlineCode}>kimi-k2.5</code>と
            <code className={styles.inlineCode}>moonshot-v1</code>
            系列は新規ユーザーには提供されず2026年8月31日に完全終了予定」と明記されています。現在これらのモデルIDを使っている場合は、
            <code className={styles.inlineCode}>kimi-k2.6</code> /{" "}
            <code className={styles.inlineCode}>kimi-k2.7-code</code> /{" "}
            <code className={styles.inlineCode}>kimi-k3</code> のいずれかへ
            <strong>早急に移行</strong>してください。
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/models">Model List - Kimi API Platform</Ext>
          </p>

          <h3>2.4 モデル選定フローチャート(2026年7月版・更新)</h3>
          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart TB
    Start["解きたいタスクは？"] --> Q1{"1Mトークン級の巨大コンテキスト、\nまたは高度な視覚推論・長時間自律実行が必要か？"}
    Q1 -- はい --> R1["kimi-k3 を推奨<br/>(コストは高いが最上位の能力)"]
    Q1 -- いいえ --> Q2{"コーディング/自律的な開発作業が中心か？"}
    Q2 -- はい --> R2["kimi-k2.7-code を推奨<br/>(ルーティンなコーディングに最適な価格性能比)"]
    Q2 -- いいえ --> Q3{"画像・動画を含むマルチモーダル入力があるか？"}
    Q3 -- はい --> R3["kimi-k2.6 または kimi-k3(高精度重視) を推奨"]
    Q3 -- いいえ --> Q4{"コストを最優先するか？"}
    Q4 -- はい --> R4["kimi-k2.6 を推奨(汎用・低コスト)"]
    Q4 -- いいえ --> R2`}
            />
          </div>
          <div className={styles.diagramCaption}>図2: タスク種別によるモデル選定フロー</div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://www.verdent.ai/guides/agents/kimi-k3-api-guide">
              Kimi K3 API Guide - Verdent Guides
            </Ext>
            ,{" "}
            <Ext href="https://simonwillison.net/2026/Jul/16/kimi-k3/">
              Simon Willison - Kimi K3
            </Ext>
          </p>

          <h3>2.5 アーキテクチャの基礎知識(MoEとK3の新技術)</h3>
          <p>
            Kimiシリーズはすべて <strong>Mixture-of-Experts(MoE)</strong>{" "}
            アーキテクチャを採用しています。初学者向けに簡単に言うと、
            「膨大な知識を持つ専門家集団の中から、1回の推論ごとにごく一部の専門家だけを選んで働かせる」仕組みです。K2は1兆パラメータ中
            320億パラメータ相当を活性化していましたが、K3ではさらにスパース性が高まり、896エキスパート中16個
            (Hacker
            Newsのコミュニティ試算では概算50億〜数十億パラメータ規模)しか活性化しないよう設計されています。
          </p>
          <ul>
            <li>
              K2:
              総パラメータ1T、活性化パラメータ約32B、384エキスパート、MuonClipオプティマイザ、15.5兆トークンで事前学習
            </li>
            <li>
              K3: 総パラメータ2.8T、896エキスパート中16個活性化(Stable
              LatentMoEフレームワーク)、KDA+AttnResという新しいアテンション設計により、K2比で約2.5倍のスケーリング効率を実現(Moonshot公式発表)
            </li>
          </ul>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-quickstart">
              Kimi K3 - Kimi API Platform
            </Ext>
            ,{" "}
            <Ext href="https://news.ycombinator.com/item?id=48935342">
              Kimi K3 is now live | Hacker News
            </Ext>
          </p>
        </section>

        {/* ============ 3. エコシステム ============ */}
        <section className={styles.section} id="ecosystem">
          <h2>
            <span className={styles.badge}>03</span>Kimiのエコシステム全体像
          </h2>
          <p>
            Kimiというブランドの下には、消費者向けアプリからAPIプラットフォーム、開発者ツールまで複数の製品が存在します。まず全体像を図で把握しましょう。
          </p>

          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart TB
    A["Moonshot AI"] --> B["Kimi (統合エージェントワークスペース)"]
    A --> C["Kimi Platform (開発者向けAPI)"]
    A --> D["Kimi Code (ターミナル/IDE向けコーディングエージェント)"]
    A --> E["Kimi Work (デスクトップAIエージェント)"]
    A --> F["Kimi WebBridge (ブラウザ拡張エージェント)"]
    B --> G["Docs (文書生成・変換)"]
    B --> H["Sheets (表計算エージェント)"]
    B --> I["Slides (スライド自動生成)"]
    B --> J["Websites (Webサイト自動生成)"]
    B --> K["Deep Research (多段階リサーチ)"]
    C --> L["kimi-k3 / kimi-k2.7-code / kimi-k2.6 等のモデル"]`}
            />
          </div>
          <div className={styles.diagramCaption}>図3: Kimiエコシステムの全体構成</div>

          <ul>
            <li>
              <strong>Kimi(kimi.com)</strong>
              :チャット・エージェント・文書生成・表計算・スライド作成などを一つにまとめた統合ワークスペースです。
            </li>
            <li>
              <strong>Kimi Platform</strong>:本ガイドの中心となる開発者向けAPIで、
              <code className={styles.inlineCode}>platform.moonshot.ai</code> と{" "}
              <code className={styles.inlineCode}>platform.kimi.ai</code>{" "}
              の2つのドメインから同じドキュメントにアクセスできます。
            </li>
            <li>
              <strong>Kimi Code</strong>:ターミナル/CLIから使えるコーディングエージェントで、Kimi
              K3にも既に対応しています。
            </li>
            <li>
              <strong>Kimi Work</strong>
              :ローカルファイルへのアクセス、ブラウザ自動操作(WebBridge)、Cronベースのスケジュール実行など「24時間稼働するデスクトップの部下」のような製品です。
            </li>
          </ul>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://www.kimi.com/products/kimi-work">
              Kimi Work: Next-Gen Desktop AI Agent for Knowledge Workers
            </Ext>
            , <Ext href="https://www.kimi.com/features/docs">AI Document Agent | Kimi Docs</Ext>,{" "}
            <Ext href="https://www.kimi.com/code">Kimi Code with Kimi K3</Ext>
          </p>

          <div className={styles.callout}>
            <strong>注意</strong>
            :「Kimiでチャットができるから、APIも同じ挙動になるはず」と思い込まないことが大切です。Web版のKimiは裏側で複数のツールやエージェントを自動的に組み合わせていますが、API単体を呼び出す場合は、ツール定義・システムプロンプト・エージェントループなどを自分で設計する必要があります。また、
            <strong>
              コンシューマー版(kimi.com)とAPIプラットフォームではデータの取り扱いポリシーが異なる
            </strong>
            点に注意してください(詳細は15章)。
          </div>
        </section>

        {/* ============ 4. セットアップ ============ */}
        <section className={styles.section} id="setup">
          <h2>
            <span className={styles.badge}>04</span>開発を始める:ステップバイステップ・セットアップ
          </h2>

          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart TB
    A["1. platform.kimi.ai / platform.moonshot.ai でアカウント作成"] --> B["2. 最低限のクレジットをチャージして口座を有効化"]
    B --> C["3. コンソールの API Keys ページでキーを発行"]
    C --> D["4. MOONSHOT_API_KEY を環境変数として設定"]
    D --> E["5. OpenAI SDK (>=1.0) を pip / npm でインストール"]
    E --> F["6. base_url を https://api.moonshot.ai/v1 に設定"]
    F --> G["7. GET /v1/models で利用可能モデルを確認(廃止モデルに注意)"]
    G --> H["8. 最初のチャット補完リクエストを model=kimi-k3 で送信"]`}
            />
          </div>
          <div className={styles.diagramCaption}>図4: API利用開始までのステップ</div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-quickstart">
              Kimi K3 - Kimi API Platform
            </Ext>
          </p>

          <h3>4.1 Python環境のセットアップ</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>bash</span>
              <span>Bash</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.ck}>python3</span>
                <span> -m pip install --upgrade </span>
                <span className={styles.cs}>'openai&gt;=1.0'</span>
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>export</span>
                <span className={styles.cv}> MOONSHOT_API_KEY</span>
                <span>=</span>
                <span className={styles.cs}>"sk-xxxxxxxxxxxxxxxxxxxxxxxx"</span>
              </div>
            </div>
          </div>

          <h3>4.2 最初の呼び出し(Python / OpenAI SDK互換、K3対応版)</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>quickstart.py</span>
              <span>Python</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.ck}>import</span>
                <span> os</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span>
                <span> openai </span>
                <span className={styles.ck}>import</span>
                <span> OpenAI</span>
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span>client = OpenAI(</span>
              </div>
              <div className={styles.codeLine}>
                <span> api_key=os.environ[</span>
                <span className={styles.cs}>"MOONSHOT_API_KEY"</span>
                <span>],</span>
              </div>
              <div className={styles.codeLine}>
                <span> base_url=</span>
                <span className={styles.cs}>"https://api.moonshot.ai/v1"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span>)</span>
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span>completion = client.chat.completions.create(</span>
              </div>
              <div className={styles.codeLine}>
                <span> model=</span>
                <span className={styles.cs}>"kimi-k3"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> messages=[&#123;</span>
                <span className={styles.cs}>"role"</span>
                <span>: </span>
                <span className={styles.cs}>"user"</span>
                <span>, </span>
                <span className={styles.cs}>"content"</span>
                <span>: </span>
                <span className={styles.cs}>"Introduce Kimi K3 in one sentence."</span>
                <span>&#125;],</span>
              </div>
              <div className={styles.codeLine}>
                <span>)</span>
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>print</span>
                <span>(completion.choices[0].message.content)</span>
              </div>
            </div>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-quickstart">
              Kimi K3 - Kimi API Platform
            </Ext>
          </p>

          <div className={styles.callout}>
            <strong>重要</strong>:国際向けエンドポイントは{" "}
            <code className={styles.inlineCode}>api.moonshot.ai/v1</code>、中国本土向けは{" "}
            <code className={styles.inlineCode}>api.moonshot.cn/v1</code> です。ドキュメントも{" "}
            <code className={styles.inlineCode}>platform.moonshot.ai</code> と{" "}
            <code className={styles.inlineCode}>platform.kimi.ai</code>{" "}
            の2ドメインで公開されているため、リンク切れに見えても慌てず両方を確認してください。
          </div>
        </section>

        {/* ============ 5. 基本パラメータ ============ */}
        <section className={styles.section} id="params">
          <h2>
            <span className={styles.badge}>05</span>基本パラメータのベストプラクティス
          </h2>

          <h3>5.1 K3は多くのサンプリングパラメータが「固定」されている</h3>
          <p>
            これは今回の更新で最も重要な変更点の一つです。公式クイックスタートによると、Kimi
            K3では以下のパラメータが<strong>固定値</strong>
            であり、リクエストに含めても無視されます(省略が推奨)。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>パラメータ</th>
                  <th>K3での固定値</th>
                  <th>備考</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>temperature</code>
                  </td>
                  <td>1.0</td>
                  <td>指定しても無視される。省略推奨</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>top_p</code>
                  </td>
                  <td>0.95</td>
                  <td>同上</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>n</code>
                  </td>
                  <td>1</td>
                  <td>同上</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>presence_penalty</code>
                  </td>
                  <td>0</td>
                  <td>同上</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>frequency_penalty</code>
                  </td>
                  <td>0</td>
                  <td>同上</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>reasoning_effort</code>
                  </td>
                  <td>
                    <code className={styles.inlineCode}>"low"</code> /{" "}
                    <code className={styles.inlineCode}>"high"</code> /{" "}
                    <code className={styles.inlineCode}>"max"</code> (既定:{" "}
                    <code className={styles.inlineCode}>"max"</code>)
                  </td>
                  <td>思考レベルの指定が可能（デフォルトは最高レベルの max）</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-quickstart">
              Kimi K3 - Kimi API Platform
            </Ext>
          </p>

          <h3>5.2 max_completion_tokens の既定値と上限(K3)</h3>
          <ul>
            <li>
              K3では <code className={styles.inlineCode}>max_completion_tokens</code> の
              <strong>デフォルトが131,072トークン</strong>で、
              <strong>最大1,048,576トークンまで</strong>設定可能です。
            </li>
            <li>
              応答が途中で切れた場合、<code className={styles.inlineCode}>finish_reason</code> は{" "}
              <code className={styles.inlineCode}>"length"</code> になります。この場合は
              <a href="#partial-mode">9. Partial Mode</a>を使って続きを生成させます。
            </li>
            <li>
              K3は「flat
              pay-as-you-go」料金体系で、コンテキスト長による階層課金は行われません(12章)。
            </li>
          </ul>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-quickstart">
              Kimi K3 - Kimi API Platform
            </Ext>
          </p>

          <h3>5.3 stream=True を基本にする</h3>
          <p>
            長い出力は生成に数分かかることがあり、アイドル状態のTCP接続はネットワーク経路で切断される場合があります。ストリーミングを有効にすると接続が生かされ続け、信頼性が大きく向上します。
            K3のストリーミング応答では <code className={styles.inlineCode}>reasoning_content</code>{" "}
            と最終回答 <code className={styles.inlineCode}>content</code>{" "}
            が別々のデルタとして返されます。
          </p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>stream.py</span>
              <span>Python</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span>stream = client.chat.completions.create(</span>
              </div>
              <div className={styles.codeLine}>
                <span> model=</span>
                <span className={styles.cs}>"kimi-k3"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> messages=[&#123;</span>
                <span className={styles.cs}>"role"</span>
                <span>: </span>
                <span className={styles.cs}>"user"</span>
                <span>, </span>
                <span className={styles.cs}>"content"</span>
                <span>: </span>
                <span className={styles.cs}>"Explain why the sky is blue."</span>
                <span>&#125;],</span>
              </div>
              <div className={styles.codeLine}>
                <span> stream=True,</span>
              </div>
              <div className={styles.codeLine}>
                <span>)</span>
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>for</span>
                <span> chunk </span>
                <span className={styles.ck}>in</span>
                <span> stream:</span>
              </div>
              <div className={styles.codeLine}>
                <span> delta = chunk.choices[0].delta</span>
              </div>
              <div className={styles.codeLine}>
                <span> reasoning = </span>
                <span className={styles.ck}>getattr</span>
                <span>(delta, </span>
                <span className={styles.cs}>"reasoning_content"</span>
                <span>, None)</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.ck}>if</span>
                <span> reasoning:</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.ck}>print</span>
                <span>(reasoning, end=</span>
                <span className={styles.cs}>""</span>
                <span>, flush=True)</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.ck}>if</span>
                <span> delta.content:</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.ck}>print</span>
                <span>(delta.content, end=</span>
                <span className={styles.cs}>""</span>
                <span>, flush=True)</span>
              </div>
            </div>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-quickstart">
              Kimi K3 - Kimi API Platform
            </Ext>
          </p>
        </section>

        {/* ============ 6. システムプロンプト ============ */}
        <section className={styles.section} id="system-prompt">
          <h2>
            <span className={styles.badge}>06</span>システムプロンプト設計のベストプラクティス
          </h2>
          <p>
            システムプロンプトは、モデルが応答を生成する前に受け取る「初期指示」であり、出力の形式・内容・スタイルを決定づける最も重要な準備工程です。
            公式ドキュメントの核心的な考え方は「モデルはあなたの心を読めない」という一文に集約されます。
          </p>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/prompt-best-practice">
              Best Practices for Prompts - Kimi API Platform
            </Ext>
          </p>

          <h3>6.1 デフォルトのシステムプロンプト(K2系列向け・引き続き有効な指針)</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>default_system_prompt.txt</span>
              <span>Text</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span>
                  You are Kimi, an artificial intelligence assistant provided by Moonshot AI.
                </span>
              </div>
              <div className={styles.codeLine}>
                <span>
                  You are more proficient in Chinese and English conversations. You provide
                </span>
              </div>
              <div className={styles.codeLine}>
                <span>
                  users with safe, helpful, and accurate answers. At the same time, you will
                </span>
              </div>
              <div className={styles.codeLine}>
                <span>refuse to answer any questions involving terrorism, racism, or explicit</span>
              </div>
              <div className={styles.codeLine}>
                <span>
                  violence. Moonshot AI is a proper noun and should not be translated into
                </span>
              </div>
              <div className={styles.codeLine}>
                <span>other languages.</span>
              </div>
            </div>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/prompt-best-practice">
              Best Practices for Prompts - Kimi API Platform
            </Ext>
          </p>

          <h3>6.2 【著名開発者の発見】K3には隠しシステムプロンプトが存在する可能性</h3>
          <p>
            Simon Willison氏がK3に対して行った簡単なトークン数検証によると、
            <code className={styles.inlineCode}>
              "Generate an SVG of a pelican riding a bicycle"
            </code>
            という一見短いプロンプトが <strong>95トークン</strong>
            とカウントされ、OpenAI/Anthropicの他モデルの同一プロンプト(10〜30トークン程度)より明らかに多いことが分かりました。さらに{" "}
            <code className={styles.inlineCode}>"hi"</code>という1単語のプロンプトだけで
            <strong>86トークン</strong>とカウントされたことから、モデル側に{" "}
            <strong>約85トークンの隠しシステムプロンプトが存在する可能性</strong>
            が指摘されています。Hacker
            Newsでの検証では、モデルはこの隠しプロンプトの内容を尋ねても開示を拒否したと報告されています。
          </p>
          <div className={`${styles.callout} ${styles.calloutNew}`}>
            <strong>実務上の示唆</strong>
            :自分で明示的なシステムプロンプトを設定していなくても、見えないところでトークンが消費されている可能性があります。コスト試算や「なぜこんなに入力トークンが多いのか」という疑問が生じた場合は、この点を念頭に置いてください。
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://simonwillison.net/2026/Jul/16/kimi-k3/">
              Kimi K3, and what we can still learn from the pelican benchmark - Simon Willison
            </Ext>
            ,{" "}
            <Ext href="https://news.ycombinator.com/item?id=48935342">
              Kimi K3 is now live | Hacker News
            </Ext>
          </p>

          <h3>6.3 明確さの原則(4つのチェック)</h3>
          <ol>
            <li>
              <strong>役割を与える</strong>:<code className={styles.inlineCode}>messages</code> の{" "}
              <code className={styles.inlineCode}>system</code>{" "}
              フィールドで、モデルに期待する役割・専門性を明示する。
            </li>
            <li>
              <strong>区切り文字を使う</strong>
              :三重引用符・XMLタグ・見出しなどで、処理内容が異なるテキスト部分を分離する。
            </li>
            <li>
              <strong>少数の具体例(few-shot)を示す</strong>
              :あらゆる場合分けを網羅するより、一般的な指針の例を示す方が効率的。
            </li>
            <li>
              <strong>出力の長さ・形式を指定する</strong>
              :単語数指定は精度が低いため、段落数・箇条書き数での指定を優先する。
            </li>
          </ol>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/prompt-best-practice">
              Best Practices for Prompts - Kimi API Platform
            </Ext>
          </p>

          <h3>6.4 ツール利用時はシステムプロンプトで指図しすぎない</h3>
          <p>
            <code className={styles.inlineCode}>tools</code>{" "}
            パラメータで公式ツールを渡した場合、Kimiは自律的に「使うべきか・いつ使うか」を判断します。
            システムプロンプト側でツールの使い方を細かく指定すると、かえってこの自律的な意思決定を妨げる可能性があるため、
            <strong>ツールの使用方法そのものはシステムプロンプトに書かない</strong>
            というのが公式の推奨です。
          </p>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/use-kimi-k2-to-setup-agent">
              Use Kimi K2.6 Model to Setup Agent - Kimi API Platform
            </Ext>
          </p>
        </section>

        {/* ============ 7. Tool Calling ============ */}
        <section className={styles.section} id="tool-calling">
          <h2>
            <span className={styles.badge}>07</span>Tool Calling(関数呼び出し)のベストプラクティス
          </h2>

          <h3>7.1 基本のツール呼び出しループ(全モデル共通)</h3>
          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart TB
    A["ユーザーの質問を messages に追加"] --> B["tools 一覧とともに /v1/chat/completions へリクエスト"]
    B --> C{"finish_reason は tool_calls か？"}
    C -- はい --> D["各 tool_call の function.name / arguments を取得"]
    D --> E["自前の実装でツールを実行する"]
    E --> F["role=tool, tool_call_id 付きで結果を messages に追加"]
    F --> B
    C -- いいえ --> G["message.content を最終回答として表示"]`}
            />
          </div>
          <div className={styles.diagramCaption}>図5: 基本のツール呼び出しループ</div>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>tool_calling.py</span>
              <span>Python</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.ck}>import</span>
                <span> json</span>
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span>tools = [&#123;</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"type"</span>
                <span>: </span>
                <span className={styles.cs}>"function"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"function"</span>
                <span>: &#123;</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"name"</span>
                <span>: </span>
                <span className={styles.cs}>"get_weather"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"description"</span>
                <span>: </span>
                <span className={styles.cs}>"Get the weather for a city"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"parameters"</span>
                <span>: &#123;</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"type"</span>
                <span>: </span>
                <span className={styles.cs}>"object"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"properties"</span>
                <span>: &#123;</span>
                <span className={styles.cs}>"city"</span>
                <span>: &#123;</span>
                <span className={styles.cs}>"type"</span>
                <span>: </span>
                <span className={styles.cs}>"string"</span>
                <span>&#125;&#125;,</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"required"</span>
                <span>: [</span>
                <span className={styles.cs}>"city"</span>
                <span>],</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#125;,</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#125;,</span>
              </div>
              <div className={styles.codeLine}>
                <span>&#125;]</span>
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span>messages = [&#123;</span>
                <span className={styles.cs}>"role"</span>
                <span>: </span>
                <span className={styles.cs}>"user"</span>
                <span>, </span>
                <span className={styles.cs}>"content"</span>
                <span>: </span>
                <span className={styles.cs}>"What is the weather in San Francisco today?"</span>
                <span>&#125;]</span>
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span>first = client.chat.completions.create(</span>
              </div>
              <div className={styles.codeLine}>
                <span> model=</span>
                <span className={styles.cs}>"kimi-k3"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> messages=messages,</span>
              </div>
              <div className={styles.codeLine}>
                <span> tools=tools,</span>
              </div>
              <div className={styles.codeLine}>
                <span> tool_choice=</span>
                <span className={styles.cs}>"required"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span>)</span>
              </div>
              <div className={styles.codeLine}>
                <span>assistant_message = first.choices[0].message</span>
              </div>
              <div className={styles.codeLine}>
                <span>messages.append(assistant_message)</span>
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>for</span>
                <span> tool_call </span>
                <span className={styles.ck}>in</span>
                <span> assistant_message.tool_calls </span>
                <span className={styles.ck}>or</span>
                <span> []:</span>
              </div>
              <div className={styles.codeLine}>
                <span> arguments = json.loads(tool_call.function.arguments)</span>
              </div>
              <div className={styles.codeLine}>
                <span> result = json.dumps(&#123;</span>
                <span className={styles.cs}>"city"</span>
                <span>: arguments[</span>
                <span className={styles.cs}>"city"</span>
                <span>], </span>
                <span className={styles.cs}>"weather"</span>
                <span>: </span>
                <span className={styles.cs}>"sunny"</span>
                <span>, </span>
                <span className={styles.cs}>"temperature_c"</span>
                <span>: 24&#125;)</span>
              </div>
              <div className={styles.codeLine}>
                <span> messages.append(&#123;</span>
                <span className={styles.cs}>"role"</span>
                <span>: </span>
                <span className={styles.cs}>"tool"</span>
                <span>, </span>
                <span className={styles.cs}>"tool_call_id"</span>
                <span>: tool_call.id, </span>
                <span className={styles.cs}>"content"</span>
                <span>: result&#125;)</span>
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span>final = client.chat.completions.create(model=</span>
                <span className={styles.cs}>"kimi-k3"</span>
                <span>, messages=messages, tools=tools)</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>print</span>
                <span>(final.choices[0].message.content)</span>
              </div>
            </div>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-quickstart">
              Kimi K3 - Kimi API Platform
            </Ext>
          </p>

          <div className={`${styles.callout} ${styles.calloutNew}`}>
            <strong>K3の新機能</strong>:
            <code className={styles.inlineCode}>tool_choice="required"</code>
            を使うと、最初のターンで必ず何らかのツールを呼び出させることができます(K2系列にはなかった値)。また、マルチターンやツール呼び出しでは
            <strong>アシスタントメッセージ全体をそのまま次のリクエストに含める</strong>必要があり、
            <code className={styles.inlineCode}>content</code>だけを保持するのは不可です。
          </div>

          <h3>7.2 【K3新機能】動的ツールロードと事前検索パターン</h3>
          <p>
            K3の公式「Tool Calling Best
            Practices」ガイドでは、大量のツールを毎ターン全部渡すのではなく、次のような
            <strong>段階的ロードパターン</strong>が推奨されています。
            これは特にツール数が多いエージェントでコンテキストとコストを節約する上で重要です。
          </p>
          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart TB
    A["会話開始時: search_tools 関数 + よく使う少数のコアツールのみを宣言"] --> B["tool_choice=required で1ターン目に search_tools を強制呼び出し"]
    B --> C["検索結果にもとづき、必要なツール定義だけを system メッセージとして動的に注入"]
    C --> D["以降のターンで、注入されたツールをモデルが直接呼び出す"]
    D --> E["reasoning_effort は会話開始前に決めておく(会話途中での変更は非推奨)"]`}
            />
          </div>
          <div className={styles.diagramCaption}>
            図6: K3公式のツール事前検索+動的ロードパターン
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>dynamic_tools.py</span>
              <span>Python</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span>dynamic_messages = [</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#123;</span>
                <span className={styles.cs}>"role"</span>
                <span>: </span>
                <span className={styles.cs}>"user"</span>
                <span>, </span>
                <span className={styles.cs}>"content"</span>
                <span>: </span>
                <span className={styles.cs}>"Calculate 23 times 47."</span>
                <span>&#125;,</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#123;</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"role"</span>
                <span>: </span>
                <span className={styles.cs}>"system"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"tools"</span>
                <span>: [&#123;</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"type"</span>
                <span>: </span>
                <span className={styles.cs}>"function"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"function"</span>
                <span>: &#123;</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"name"</span>
                <span>: </span>
                <span className={styles.cs}>"calculate"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"description"</span>
                <span>: </span>
                <span className={styles.cs}>"Evaluate an arithmetic expression"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"parameters"</span>
                <span>: &#123;</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"type"</span>
                <span>: </span>
                <span className={styles.cs}>"object"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"properties"</span>
                <span>: &#123;</span>
                <span className={styles.cs}>"expression"</span>
                <span>: &#123;</span>
                <span className={styles.cs}>"type"</span>
                <span>: </span>
                <span className={styles.cs}>"string"</span>
                <span>&#125;&#125;,</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"required"</span>
                <span>: [</span>
                <span className={styles.cs}>"expression"</span>
                <span>],</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#125;,</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#125;,</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#125;],</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#125;,</span>
              </div>
              <div className={styles.codeLine}>
                <span>]</span>
              </div>
              <div className={styles.codeLine}>
                <span>completion = client.chat.completions.create(model=</span>
                <span className={styles.cs}>"kimi-k3"</span>
                <span>, messages=dynamic_messages)</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>print</span>
                <span>(completion.choices[0].message.tool_calls)</span>
              </div>
            </div>
          </div>

          <p>
            <strong>重要な運用ルール</strong>:
          </p>
          <ul>
            <li>
              動的に宣言したツール定義はサーバー側に保持されません。次のリクエストでも使いたい場合は、クライアント側で同じ宣言を保持して送り続ける必要があります。
            </li>
            <li>
              <code className={styles.inlineCode}>messages</code>の<strong>末尾</strong>
              にツール宣言を追加する分にはプレフィックスキャッシュに影響しませんが、
              <strong>途中にある</strong>
              ツール宣言を変更・削除すると、それ以降のキャッシュヒットに影響します。
            </li>
            <li>
              <code className={styles.inlineCode}>reasoning_effort</code>
              は会話開始前に決めておくべきパラメータで、
              <code className={styles.inlineCode}>"low"</code>、
              <code className={styles.inlineCode}>"high"</code>、
              <code className={styles.inlineCode}>"max"</code>
              の各レベルをサポートしています（既定値は
              <code className={styles.inlineCode}>"max"</code>）。
            </li>
          </ul>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-tool-calling-best-practice">
              Kimi K3 API Tool Calling Best Practices - Kimi API Platform
            </Ext>
          </p>

          <h3>7.3 公式ツールは「Formula」フレームワーク経由に統合(K3)</h3>
          <p>
            K3では公式ツールが <strong>Formula</strong>{" "}
            という仕組みを通じて提供されるようになりました。
          </p>
          <ol>
            <li>
              Formulaの <code className={styles.inlineCode}>/tools</code>{" "}
              エンドポイントからツール定義を取得する。
            </li>
            <li>
              その定義を Chat Completions の <code className={styles.inlineCode}>tools</code>{" "}
              フィールドに追加する。
            </li>
            <li>
              モデルが <code className={styles.inlineCode}>tool_calls</code>{" "}
              を返したら、各関数名と引数を Formula の{" "}
              <code className={styles.inlineCode}>/fibers</code> エンドポイントに送信する。
            </li>
            <li>
              完全なアシスタントメッセージと Fiber の出力を、対応する tool{" "}
              メッセージとして追加する。
            </li>
            <li>モデルが最終回答を返すまで Chat Completions を呼び出し続ける。</li>
          </ol>
          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <strong>注意</strong>
            :公式ドキュメントには「Web検索は現在更新中であり、近い将来の本番ワークフローでの使用は推奨されない」と明記されています。K3でリアルタイム検索が必要な場合は、この制約を踏まえて自前の検索ツールを実装するか、慎重に検証してから利用してください。
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-quickstart">
              Kimi K3 - Kimi API Platform
            </Ext>
          </p>

          <h3>7.4 ベストプラクティスまとめ(実運用)</h3>
          <ul>
            <li>
              ツールは<strong>単機能・小さく</strong>設計する(検索・取得・更新など役割を分離)。
            </li>
            <li>
              ツールの出力フォーマットは<strong>一貫したJSON</strong>にする。
            </li>
            <li>
              ツール実行には<strong>タイムアウトとリトライ</strong>を必ず設定する。
            </li>
            <li>
              すべてのツール呼び出しについて、監査に必要な最小限のメタデータのみを
              <strong>ログに記録</strong>
              し、生のツール引数や実行結果は保存しない（機密フィールドのマスク、保持期間の定義、アクセス制御の実施を徹底する）。
            </li>
            <li>
              ツール数が多いエージェントは、7.2の動的ロードパターンでコンテキストとキャッシュ効率を両立させる。
            </li>
          </ul>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://agentsapis.com/kimi-api/">
              Kimi API (Moonshot AI) - Complete Developer Guide
            </Ext>
          </p>
        </section>

        {/* ============ 8. Thinking / reasoning_effort ============ */}
        <section className={styles.section} id="thinking">
          <h2>
            <span className={styles.badge}>08</span>Thinking / reasoning_effort を使う際の注意点
          </h2>
          <p>
            K2系列とK3では、思考(推論)の制御方法が異なります。この違いを理解しておかないと、リクエストがエラーになったり、意図しないコストが発生したりします。
          </p>

          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart TB
    A["使用モデルは何か？"] --> B{"kimi-k3 か？"}
    B -- はい --> C["reasoning_effort フィールドを使う(low/high/max, 既定は max)"]
    B -- いいえ(K2.x系列) --> D["thinking パラメータを使う({type: enabled})"]
    C --> E["アシスタントメッセージ全体(content+reasoning_content)をそのまま次のリクエストに含める"]
    D --> E
    E --> F{"tool_choice は auto/none/required の範囲内か？"}
    F -- はい --> G["リクエスト成功"]
    F -- いいえ --> H["エラーになるため値を修正する"]`}
            />
          </div>
          <div className={styles.diagramCaption}>図7: Thinking / reasoning_effort保持フロー</div>

          <h3>8.1 reasoning_contentを必ず保持する</h3>
          <p>
            思考が常時有効なモデル(K2.6思考時・K2.7 Code・K3すべて)では、過去のassistantメッセージを
            <strong>完全な形のまま</strong>
            次のリクエストのメッセージ履歴に含めなければなりません。
            K3の公式ドキュメントは「マルチターンの会話やツール呼び出しでは、APIが返した完全なアシスタントメッセージを次のリクエストに追加すること。
            <code className={styles.inlineCode}>content</code>
            だけを保持しないこと」と明記しています。
          </p>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-quickstart">
              Kimi K3 - Kimi API Platform
            </Ext>
          </p>

          <h3>8.2 K3の reasoning_effort はデフォルト「max」で、コストに直結する</h3>
          <p>
            K3は既定値として<code className={styles.inlineCode}>reasoning_effort="max"</code>
            が適用されるため、明示的に軽量レベルを指定しない場合、軽いタスクでも重い推論を行います。Simon
            Willison氏の検証では、
            単純なSVG生成タスクで16,658個の出力トークンのうち13,241個が思考トークンで、コストは25セントに達しました。Hacker
            Newsのコミュニティも 「推論効率(reasoning
            efficiency)はモデルの実質的なコストに直結する」「GPT系モデルは推論効率が高く、Kimi
            K3が同じタスクにより多くの思考トークンを使うなら、
            見かけの単価が安くてもコスト効率で負ける可能性がある」と指摘しています。
          </p>
          <div className={`${styles.callout} ${styles.calloutNew}`}>
            <strong>実務上の示唆</strong>
            :簡単なQ&Aやテンプレート的なタスクにK3を使うと、不必要に高コストになる可能性があります。軽量なタスクには
            <code className={styles.inlineCode}>kimi-k2.6</code>や
            <code className={styles.inlineCode}>kimi-k2.7-code</code>
            を使い分けることを検討してください。
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://simonwillison.net/2026/Jul/16/kimi-k3/">
              Kimi K3, and what we can still learn from the pelican benchmark - Simon Willison
            </Ext>
            ,{" "}
            <Ext href="https://news.ycombinator.com/item?id=48935342">
              Kimi K3 is now live | Hacker News
            </Ext>
          </p>

          <h3>8.3 tool_choiceの制約</h3>
          <p>
            思考モードが有効な場合、<code className={styles.inlineCode}>tool_choice</code>
            に指定できる値には制約があります。K2.x系列では
            <code className={styles.inlineCode}>"auto"</code>または
            <code className={styles.inlineCode}>"none"</code>のみが許容され、
            それ以外を指定すると推論内容と強制されたツール選択が競合してエラーになります。K3では
            <code className={styles.inlineCode}>"required"</code>も新たに使えるようになりましたが、
            いずれのモデルでも公式ドキュメントに明記された許容値の範囲で使うことが重要です。
          </p>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.moonshot.ai/docs/guide/benchmark-best-practice">
              Best Practices for Benchmarking
            </Ext>
            ,{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-quickstart">
              Kimi K3 - Kimi API Platform
            </Ext>
          </p>
        </section>

        {/* ============ 9. Partial Mode ============ */}
        <section className={styles.section} id="partial-mode">
          <h2>
            <span className={styles.badge}>09</span>Partial Mode(プリフィル)の活用
          </h2>
          <p>
            Partial
            Mode(プリフィル)は、応答の一部をあらかじめ与えて、モデルにその続きを生成させる機能です。出力フォーマットの固定、ロールプレイの一貫性維持、
            切り詰められた出力の継続などに使えます。K3でも同様に利用できます。
          </p>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>partial_mode.py</span>
              <span>Python</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span>prefix = </span>
                <span className={styles.cs}>"Conclusion: "</span>
              </div>
              <div className={styles.codeLine}>
                <span>completion = client.chat.completions.create(</span>
              </div>
              <div className={styles.codeLine}>
                <span> model=</span>
                <span className={styles.cs}>"kimi-k3"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> messages=[</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#123;</span>
                <span className={styles.cs}>"role"</span>
                <span>: </span>
                <span className={styles.cs}>"user"</span>
                <span>, </span>
                <span className={styles.cs}>"content"</span>
                <span>: </span>
                <span className={styles.cs}>
                  "In one sentence, explain why API compatibility matters."
                </span>
                <span>&#125;,</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#123;</span>
                <span className={styles.cs}>"role"</span>
                <span>: </span>
                <span className={styles.cs}>"assistant"</span>
                <span>, </span>
                <span className={styles.cs}>"content"</span>
                <span>: prefix, </span>
                <span className={styles.cs}>"partial"</span>
                <span>: True&#125;,</span>
              </div>
              <div className={styles.codeLine}>
                <span> ],</span>
              </div>
              <div className={styles.codeLine}>
                <span>)</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>print</span>
                <span>(prefix + (completion.choices[0].message.content </span>
                <span className={styles.ck}>or</span>
                <span> </span>
                <span className={styles.cs}>""</span>
                <span>))</span>
              </div>
            </div>
          </div>
          <p>
            応答には先頭に与えたプレフィックス自体は含まれないため、呼び出し側で手動で連結する必要があります。
          </p>
          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <strong>注意</strong>:Partial Modeと
            <code className={styles.inlineCode}>response_format=json_object</code>
            (またはK3の<code className={styles.inlineCode}>json_schema</code>
            )は併用しないでください。予期しない応答になる可能性があります。また、思考モデルで途中から継続する場合は、前回の
            <code className={styles.inlineCode}>reasoning_content</code>も一緒に渡す必要があります。
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-quickstart">
              Kimi K3 - Kimi API Platform
            </Ext>
            ,{" "}
            <Ext href="https://platform.kimi.ai/docs/api/partial">
              Partial Mode - Kimi API Platform
            </Ext>
          </p>
        </section>

        {/* ============ 10. コンテキストキャッシュ ============ */}
        <section className={styles.section} id="caching">
          <h2>
            <span className={styles.badge}>10</span>コンテキストキャッシュとコスト最適化
          </h2>
          <p>
            Kimiの<strong>自動コンテキストキャッシュ</strong>
            は、直近のリクエストと共通する接頭辞(システムプロンプトや参照ドキュメントなど)を検出し、
            その部分を通常より大幅に安い「キャッシュヒット料金」で課金する仕組みです。K3の公式ドキュメントでも「通常のモデルリクエストに対してコンテキストキャッシュは自動的に行われ、
            キャッシュIDやTTL、追加パラメータは不要。長い接頭辞を変更せずに保つことで、後続リクエストが自動的にキャッシュヒットを試みる」と説明されています。
          </p>

          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart TB
    A["同一のシステムプロンプト/ドキュメント接頭辞を送信"] --> B{"直近のリクエストと接頭辞が一致するか？"}
    B -- 一致する --> C["一致した部分は cached_tokens として割引価格で課金"]
    B -- 一致しない --> D["通常の入力価格 (cache miss) で課金"]
    C --> E["レスポンスの usage.cached_tokens で確認できる"]
    D --> E`}
            />
          </div>
          <div className={styles.diagramCaption}>図8: コンテキストキャッシュの仕組み</div>

          <ul>
            <li>
              K3のキャッシュヒット料金は$0.30/Mトークンで、通常の入力価格($3.00/M)から
              <strong>90%引き</strong>という大幅な割引になります。
            </li>
            <li>
              巨大なドキュメントをそのまま毎回送るのではなく、関連する章・セクションだけを抽出して渡す(RAG的アプローチ)ことも依然として有効です。
            </li>
            <li>
              コンテキストキャッシュは「Kimiがユーザーを記憶する仕組み」ではなく、
              <strong>あくまで似た/繰り返しのプロンプトに対するAPI最適化</strong>
              である点を混同しないようにしましょう。
            </li>
          </ul>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-quickstart">
              Kimi K3 - Kimi API Platform
            </Ext>
            , <Ext href="https://www.eesel.ai/blog/kimi-k3-pricing">Kimi K3 pricing - eesel AI</Ext>
          </p>
        </section>

        {/* ============ 11. マルチモーダル ============ */}
        <section className={styles.section} id="multimodal">
          <h2>
            <span className={styles.badge}>11</span>マルチモーダル入力(画像・動画)
          </h2>
          <p>
            K3を含む最新モデルはテキストに加えて画像・動画をネイティブに理解できます。ただし、
            <strong>K3では公式に重要な制約が明記</strong>されています。
          </p>
          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <strong>K3の制約</strong>:ビジョン入力は
            <strong>パブリックな画像URLをサポートしません</strong>。base64データ、または
            <code className={styles.inlineCode}>ms://&lt;file-id&gt;</code>形式のいずれかを使い、
            <code className={styles.inlineCode}>content</code>は文字列ではなく
            <strong>オブジェクトの配列</strong>にする必要があります。
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>multimodal.py</span>
              <span>Python</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.ck}>import</span>
                <span> base64</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span>
                <span> pathlib </span>
                <span className={styles.ck}>import</span>
                <span> Path</span>
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span>image_data = base64.b64encode(Path(</span>
                <span className={styles.cs}>"image.png"</span>
                <span>).read_bytes()).decode()</span>
              </div>
              <div className={styles.codeLine}>
                <span>completion = client.chat.completions.create(</span>
              </div>
              <div className={styles.codeLine}>
                <span> model=</span>
                <span className={styles.cs}>"kimi-k3"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> messages=[</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#123;</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"role"</span>
                <span>: </span>
                <span className={styles.cs}>"user"</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span className={styles.cs}>"content"</span>
                <span>: [</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#123;</span>
                <span className={styles.cs}>"type"</span>
                <span>: </span>
                <span className={styles.cs}>"image_url"</span>
                <span>, </span>
                <span className={styles.cs}>"image_url"</span>
                <span>: &#123;</span>
                <span className={styles.cs}>"url"</span>
                <span>: f</span>
                <span className={styles.cs}>"data:image/png;base64,&#123;image_data&#125;"</span>
                <span>&#125;&#125;,</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#123;</span>
                <span className={styles.cs}>"type"</span>
                <span>: </span>
                <span className={styles.cs}>"text"</span>
                <span>, </span>
                <span className={styles.cs}>"text"</span>
                <span>: </span>
                <span className={styles.cs}>"Describe this image."</span>
                <span>&#125;,</span>
              </div>
              <div className={styles.codeLine}>
                <span> ],</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#125;</span>
              </div>
              <div className={styles.codeLine}>
                <span> ],</span>
              </div>
              <div className={styles.codeLine}>
                <span>)</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>print</span>
                <span>(completion.choices[0].message.content)</span>
              </div>
            </div>
          </div>
          <p>
            動画についても、
            <code className={styles.inlineCode}>
              client.files.create(file=..., purpose="video")
            </code>
            でアップロードし、<code className={styles.inlineCode}>ms://&lt;file-id&gt;</code>
            形式で参照する専用のフローが用意されています。
          </p>
          <p>
            Simon Willison氏の実地検証では、K3にpelicanのSVG画像(自ら生成したもの)を渡してalt
            textを生成させたところ、
            「白いペリカンが赤いスカーフを巻き、赤い自転車に乗っている」といった非常に精度の高い説明文が得られたと報告されており、視覚理解の質自体は高く評価されています。
          </p>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-quickstart">
              Kimi K3 - Kimi API Platform
            </Ext>
            ,{" "}
            <Ext href="https://simonwillison.net/2026/Jul/16/kimi-k3/">
              Kimi K3, and what we can still learn from the pelican benchmark - Simon Willison
            </Ext>
          </p>
        </section>

        {/* ============ 12. 料金体系 ============ */}
        <section className={styles.section} id="pricing">
          <h2>
            <span className={styles.badge}>12</span>料金体系を理解する
          </h2>
          <p>
            料金は変更されやすいため、契約・予算設計の前に必ず公式の料金ページ(
            <Ext href="https://platform.kimi.ai/docs/pricing/chat-k3">Kimi K3</Ext> /{" "}
            <Ext href="https://platform.kimi.ai/docs/pricing/chat-k26">Kimi K2.6</Ext>
            )で最新の値を確認してください。
            以下は2026年7月17〜18日時点で複数の一次情報・独立系情報が一致して報告している値です(単位:USD
            / 100万トークン)。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>モデル</th>
                  <th>入力(キャッシュミス)</th>
                  <th>入力(キャッシュヒット)</th>
                  <th>出力</th>
                  <th>コンテキスト長</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>kimi-k3</code>
                  </td>
                  <td>
                    <strong>$3.00</strong>
                  </td>
                  <td>
                    <strong>$0.30</strong>
                  </td>
                  <td>
                    <strong>$15.00</strong>
                  </td>
                  <td>1,048,576(1M)</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>kimi-k2.6</code>
                  </td>
                  <td>$0.95</td>
                  <td>$0.16</td>
                  <td>$4.00</td>
                  <td>256K</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>kimi-k2.7-code</code>
                  </td>
                  <td>$0.95</td>
                  <td>$0.19</td>
                  <td>$4.00</td>
                  <td>256K</td>
                </tr>
                <tr>
                  <td>廃止済みK2ファミリー</td>
                  <td>$0.60</td>
                  <td>$0.15</td>
                  <td>$2.50</td>
                  <td>128K〜256K</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://simonwillison.net/2026/Jul/16/kimi-k3/">
              Simon Willison - Kimi K3
            </Ext>
            ,{" "}
            <Ext href="https://www.verdent.ai/guides/agents/kimi-k3-api-guide">
              Kimi K3 API Guide - Verdent Guides
            </Ext>
            , <Ext href="https://www.eesel.ai/blog/kimi-k3-pricing">Kimi K3 pricing - eesel AI</Ext>
          </p>

          <h3>12.1 K3の価格をどう捉えるか(コミュニティの評価)</h3>
          <p>
            Simon Willison氏は「この価格設定はAnthropicのClaude
            Sonnetシリーズと同水準であり、これまでの中国製AIラボがリリースした中で最も高価なモデルになった」と指摘しています。
            Hacker Newsのコミュニティも「1:1でSonnetシリーズの価格と一致しており、GLM
            5.2(3分の1以下の価格)と直接競合する製品ではなさそうだ」といった冷静な分析を寄せています。
          </p>
          <ul>
            <li>
              K3はAnthropicのClaude Opus 4.8($5/$25)やGPT-5.6
              Sol($5/$30)より安いものの、DeepSeekやGLMなど「格安」路線の中国モデルとは競合する価格帯ではありません。
            </li>
            <li>
              出力コストは入力の5倍(キャッシュミス時)であり、常時maxの思考モードと合わさって、
              <strong>タスクによっては想定より高コストになりやすい</strong>点に注意が必要です。
            </li>
          </ul>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://simonwillison.net/2026/Jul/16/kimi-k3/">
              Simon Willison - Kimi K3
            </Ext>
            ,{" "}
            <Ext href="https://news.ycombinator.com/item?id=48935342">
              Kimi K3 is now live | Hacker News
            </Ext>
          </p>

          <h3>12.2 その他の課金要素</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>目安</th>
                  <th>備考</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Batch API</td>
                  <td>リアルタイム料金の約60%(≒40%割引)</td>
                  <td>即時応答が不要な非同期処理向け</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>$web_search</code> 公式ツール
                  </td>
                  <td>1呼び出しあたり約$0.005（公式料金確認日: 2026年7月19日）</td>
                  <td>K3では「近い将来の本番利用は非推奨」と公式が明記</td>
                </tr>
                <tr>
                  <td>Kimiメンバーシップ(コンシューマー向け)</td>
                  <td>無料プランのほか月額$19〜$199</td>
                  <td>API利用とは完全に別の請求</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://aireiter.com/blog/kimi-k3-pricing">
              Kimi K3 Pricing: API Cost and Whether It's Worth It
            </Ext>
            ,{" "}
            <Ext href="https://felloai.com/kimi-pricing/">
              Kimi Pricing 2026: Plans, API Costs & Free Tier
            </Ext>
          </p>

          <h3>12.3 コスト削減の実務チェックリスト</h3>
          <ul>
            <li>
              モデルは「最新=最適」ではなく、タスクに応じて
              <code className={styles.inlineCode}>k2.6</code>(汎用・低コスト)/
              <code className={styles.inlineCode}>k2.7-code</code>(ルーティンコーディング)/
              <code className={styles.inlineCode}>k3</code>
              (1Mコンテキスト・高度推論が必要な場合のみ)を使い分ける。
            </li>
            <li>
              システムプロンプトや検索結果など、繰り返し送る接頭辞を一定に保ちキャッシュヒット率を高める(K3は90%引きと割引率が特に大きい)。
            </li>
            <li>
              K3は既定で<code className={styles.inlineCode}>reasoning_effort="max"</code>
              であることを踏まえ、軽量なタスクには<code className={styles.inlineCode}>"low"</code>
              を指定するか適したモデルを選ぶ。
            </li>
            <li>即時性が不要なバッチ処理はBatch APIに回す。</li>
            <li>
              廃止予定モデル(<code className={styles.inlineCode}>kimi-k2.5</code>、
              <code className={styles.inlineCode}>moonshot-v1</code>系列、
              <code className={styles.inlineCode}>kimi-k2</code>系列、
              <code className={styles.inlineCode}>kimi-latest</code>
              )を使い続けていないか定期的に確認する。
            </li>
          </ul>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/models">Model List - Kimi API Platform</Ext>
          </p>
        </section>

        {/* ============ 13. レート制限 ============ */}
        <section className={styles.section} id="rate-limits">
          <h2>
            <span className={styles.badge}>13</span>レート制限と信頼性
          </h2>
          <p>
            Kimi APIのレート制限は、固定のプラン(Free/Pro/Enterpriseなど)ではなく、
            <strong>アカウントへの累計チャージ額に応じたティア制</strong>
            で決まります。必ず自分のコンソールの制限ページで最新の値を確認してください。
          </p>
          <h3>13.1 信頼性を高める実装のコツ</h3>
          <ul>
            <li>
              <code className={styles.inlineCode}>stream=True</code>
              を基本にし、長時間リクエストの接続断を防ぐ。
            </li>
            <li>429(レート制限超過)エラーに対して、指数バックオフ付きのリトライを実装する。</li>
            <li>
              モデルIDをハードコードせず、<code className={styles.inlineCode}>GET /v1/models</code>
              で利用可能なモデル一覧を都度取得し、廃止予定モデルを使っていないか確認する運用にする。
            </li>
            <li>
              サードパーティ経由(OpenRouterなど)でKimiモデルを利用する場合、Simon
              Willison氏のように「Moonshotに直接APIキーを作らずにOpenRouter経由で試す」という選択肢もあります。ただしレート制限やキャッシュ挙動はプロバイダごとに異なる点に注意してください。
            </li>
          </ul>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://simonwillison.net/2026/Jul/16/kimi-k3/">
              Simon Willison - Kimi K3
            </Ext>
          </p>
        </section>

        {/* ============ 14. 実践例 ============ */}
        <section className={styles.section} id="practice">
          <h2>
            <span className={styles.badge}>14</span>実践例:業界リサーチAIエージェントの構築フロー
          </h2>
          <p>
            公式ガイドで紹介されている「業界情報を検索・分析・レポート化するエージェント」の構築手順を、初学者向けに整理します。
          </p>

          <div className={styles.mermaidContainer}>
            <MermaidDiagram
              chart={`flowchart TB
    A["1. タスクを分解する<br/>(検索/分析/統合出力の3段階)"] --> B["2. 必要なツールを選定する<br/>(検索/コード実行/推論補助など)"]
    B --> C["3. システムプロンプトを設計する<br/>(役割・言語統一・出典明記ルール)"]
    C --> D["4. 出力テンプレートを固定する<br/>(要約/データ分析/レポートの章立て)"]
    D --> E["5. 特殊シナリオの扱いを定義する<br/>(データ欠落/矛盾/機微な話題への対応)"]
    E --> F["6. 小規模なタスクでテストし反復改善する"]`}
            />
          </div>
          <div className={styles.diagramCaption}>
            図9: 業界リサーチAIエージェントの構築ワークフロー
          </div>

          <ol>
            <li>
              <strong>タスク分解</strong>
              :検索(企業情報・最新データ・ニュース収集)→分析(大量情報のフィルタリング・分類)→統合出力(csv/png/pdf生成、グラフ作成)という3段階に分ける。
            </li>
            <li>
              <strong>ツール選定</strong>
              :役割ごとにツールを割り当て、ツール数が多い場合は7.2の動的ロードパターンを検討する。
            </li>
            <li>
              <strong>システムプロンプト設計</strong>
              :言語統一、配色などのビジュアル規約、データ出典の明記義務、確定情報/推定情報の区別、複数ソースでのクロスチェックといった具体的なルールをテンプレート化する。
            </li>
            <li>
              <strong>特殊シナリオ対応</strong>
              :「データが見つからない場合は検索範囲を明記した上でその旨を述べる」「情報源が矛盾する場合は両論を併記し理由を推測する」など、あらかじめ振る舞いを定義しておく。
            </li>
          </ol>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/use-kimi-k2-to-setup-agent">
              Use Kimi K2.6 Model to Setup Agent - Kimi API Platform
            </Ext>
          </p>
        </section>

        {/* ============ 15. セキュリティ・プライバシー ============ */}
        <section className={styles.section} id="security">
          <h2>
            <span className={styles.badge}>15</span>セキュリティ・プライバシーのベストプラクティス
          </h2>
          <ul>
            <li>
              <strong>APIキーはサーバーサイドの秘密情報として扱う</strong>
              :クライアントサイドのコード、公開リポジトリ、ログに絶対に含めない。環境変数で管理する。
            </li>
            <li>
              <strong>ブラウザから直接APIを呼び出さない</strong>
              :APIキーの露出を避けるため、必ずバックエンド経由で呼び出す。
            </li>
            <li>
              <strong>モデルIDと機能はconfigに外出しする</strong>
              :新モデルのリリースや旧モデルのEOLに柔軟に対応できるようにする。
            </li>
          </ul>

          <h3>15.1 【著名開発者の指摘】コンシューマー版とAPIのプライバシーポリシーの違い</h3>
          <p>
            著名なAI動向コメンテーターZvi Mowshowitz氏(thezvi.substack.com)が自身のKimi
            K2.5レビューの中で言及し、詳細な検証記事(JP
            Caparas氏、Medium/generativeai.pub)にリンクしている内容によると、
            <strong>
              Moonshot
              AIのプライバシーポリシー(2025年7月更新版)では、ユーザーが入力したプロンプトや生成物を含む「ユーザーコンテンツ」がデフォルトでモデルの学習に利用され、明確なオプトアウト手段が乏しい
            </strong>
            と報告されています。
            また、シンガポール法人と北京本社の間での管轄関係も不明瞭であると指摘されています。
          </p>
          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <strong>実務上の推奨</strong>
            <ul>
              <li>
                顧客案件・機密情報・NDA対象の内容・個人情報などは、
                <strong>コンシューマー版のkimi.com上で直接扱わない</strong>。
              </li>
              <li>
                本番・業務利用では、必ずAPIプラットフォーム(利用規約でデータの扱いが別途定義されている)を経由するか、OpenRouterなどのサードパーティ推論プロバイダ、あるいは自己ホスティングを検討する。
              </li>
              <li>
                契約・法務上の判断が必要な場合は、必ず最新の
                <Ext href="https://www.kimi.com/user/agreement/userprivacy?version=v2&utm_source=openai">
                  Moonshot AIのプライバシーポリシー・利用規約
                </Ext>
                を自分で確認する(本ガイドは法的助言ではありません)。
              </li>
            </ul>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://generativeai.pub/kimi-k2-5-is-brilliant-but-think-twice-about-using-kimi-com-157cbb26f9a3">
              Kimi K2.5 is brilliant, but think twice about using Kimi.com - Medium
            </Ext>
            , <Ext href="https://thezvi.substack.com/p/kimi-k25">Kimi K2.5 - Zvi Mowshowitz</Ext>
          </p>

          <h3>15.2 【著名開発者の指摘】オープンウェイトモデルの安全性(レッドチーミング)</h3>
          <p>
            Zvi Mowshowitz氏がまとめたコミュニティの反応(K2
            Thinkingに関する記事)では、複数のテスターが「比較的軽い工夫だけで安全策を回避できた」と報告しており、
            また開発者コミュニティ(DEV
            Community、Promptfooを使った記事)でも、Kimiモデルに対する体系的なレッドチーミング(ジェイルブレイクやプロンプトインジェクションの検証)が行われています。
          </p>
          <ul>
            <li>
              エンドユーザー向けに公開するプロダクトでは、
              <strong>
                モデル自身の安全策だけに依存せず、独自の入出力モデレーション層を追加する
              </strong>
              。
            </li>
            <li>
              本番投入前に、Promptfooのようなレッドチーミングツールで自社のユースケースに即した安全性検証を行う。
            </li>
            <li>
              特に自己ホスティングする場合、モデル自体の安全策が緩められている、または存在しない構成になっていないか確認する。
            </li>
          </ul>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://thezvi.substack.com/p/kimi-k2-thinking">
              Kimi K2 Thinking - Zvi Mowshowitz
            </Ext>
            ,{" "}
            <Ext href="https://dev.to/ayush7614/the-untold-misadventures-of-red-teaming-kimi-k2-with-promptfoo-3hig">
              The Untold Misadventures of Red Teaming Kimi K2 with Promptfoo - DEV Community
            </Ext>
          </p>
        </section>

        {/* ============ 16. エラー対処 ============ */}
        <section className={styles.section} id="errors">
          <h2>
            <span className={styles.badge}>16</span>よくあるエラーと対処法
          </h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>症状</th>
                  <th>主な原因</th>
                  <th>対処法</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>invalid_request_error</code>
                  </td>
                  <td>
                    入力+<code className={styles.inlineCode}>max_completion_tokens</code>
                    がコンテキスト長を超過
                  </td>
                  <td>入力を要約・分割するか調整する(K3は最大1,048,576)</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>finish_reason: "length"</code>
                  </td>
                  <td>出力が上限に達し途中で切れた</td>
                  <td>Partial Modeで同じプレフィックスから継続生成する</td>
                </tr>
                <tr>
                  <td>
                    K3で<code className={styles.inlineCode}>temperature</code>
                    等を指定しても効果がない
                  </td>
                  <td>K3ではこれらのパラメータが固定値で無視される仕様</td>
                  <td>リクエストから省略する(公式推奨)</td>
                </tr>
                <tr>
                  <td>
                    K3で古い<code className={styles.inlineCode}>thinking</code>
                    パラメータを送るとエラー・無視される
                  </td>
                  <td>
                    K3は<code className={styles.inlineCode}>reasoning_effort</code>
                    を使う仕様に変更された
                  </td>
                  <td>
                    <code className={styles.inlineCode}>reasoning_effort</code>（low / high /
                    max）を使う
                  </td>
                </tr>
                <tr>
                  <td>ツール呼び出し時にエラー</td>
                  <td>
                    思考モードで許容されない<code className={styles.inlineCode}>tool_choice</code>
                    値を指定した
                  </td>
                  <td>
                    K2.xは<code className={styles.inlineCode}>auto</code>/
                    <code className={styles.inlineCode}>none</code>、K3は
                    <code className={styles.inlineCode}>auto</code>/
                    <code className={styles.inlineCode}>none</code>/
                    <code className={styles.inlineCode}>required</code>の範囲で指定する
                  </td>
                </tr>
                <tr>
                  <td>マルチターンのツール呼び出しでエラー</td>
                  <td>直前ターンの完全なアシスタントメッセージを保持せずに送信した</td>
                  <td>直前のassistantメッセージをそのまま含めて送信する</td>
                </tr>
                <tr>
                  <td>非ストリーミングで接続が途切れる</td>
                  <td>長時間のアイドル接続がネットワーク経路で切断された</td>
                  <td>
                    <code className={styles.inlineCode}>stream=True</code>に切り替える
                  </td>
                </tr>
                <tr>
                  <td>動的ツールロードでキャッシュヒット率が下がった</td>
                  <td>messages途中のツール宣言を変更・削除した</td>
                  <td>末尾への追加に留めるか、トレードオフを許容する</td>
                </tr>
                <tr>
                  <td>廃止済み/廃止予定モデルIDでエラーまたは警告</td>
                  <td>
                    <code className={styles.inlineCode}>kimi-k2</code>系列・
                    <code className={styles.inlineCode}>kimi-latest</code>・
                    <code className={styles.inlineCode}>kimi-k2.5</code>・
                    <code className={styles.inlineCode}>moonshot-v1</code>系列を使用
                  </td>
                  <td>
                    <code className={styles.inlineCode}>kimi-k2.6</code>/
                    <code className={styles.inlineCode}>kimi-k2.7-code</code>/
                    <code className={styles.inlineCode}>kimi-k3</code>へ移行する
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.sourceNote}>
            出典:{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-quickstart">
              Kimi K3 - Kimi API Platform
            </Ext>
            ,{" "}
            <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-tool-calling-best-practice">
              Kimi K3 API Tool Calling Best Practices
            </Ext>
            , <Ext href="https://platform.kimi.ai/docs/models">Model List - Kimi API Platform</Ext>
          </p>
        </section>

        {/* ============ 17. 著名開発者の知見 ============ */}
        <section className={styles.section} id="community">
          <h2>
            <span className={styles.badge}>17</span>【補足】著名な国際的開発者・コミュニティの知見
          </h2>
          <p>
            ユーザーからのご要望にもとづき、公式ドキュメントだけでは分からない実践的な知見を、著名な国際的開発者・コメンテーターの投稿から補足します。
          </p>

          <div className={styles.personCard}>
            <div className={styles.personCardWho}>
              Simon Willison氏(Django共同開発者、著名AIブロガー)
            </div>
            <p>
              新しいLLMがリリースされるたびに「ペリカンが自転車に乗っているSVGを生成させる」という独自の簡易ベンチマークを実施していることで著名です。K3に関する氏の投稿から得られる実務的な知見:
            </p>
            <ul>
              <li>
                実際にモデルを動かして試すことの重要性:簡単なプロンプトを一つ実行するだけでも「思考トークンの消費量」「隠れた挙動」など多くの実務情報が得られる。
              </li>
              <li>
                K3は思考の強度(reasoning
                effort)を"low"、"high"、"max"から選択でき（既定値は"max"）、指定しないと簡単なタスクでも高コストになりがち。
              </li>
              <li>
                OpenRouterや<code className={styles.inlineCode}>llm</code>
                コマンド(氏が開発するCLIツール)経由でモデルを試すと、Moonshot
                APIキーを個別に取得せずに素早く評価できる。
              </li>
              <li>
                ペリカンテスト自体の限界(ベンチマークとしての相関が薄れてきている)も率直に述べており、単一の指標を過信しない姿勢が参考になる。
              </li>
            </ul>
            <p className={styles.sourceNote}>
              出典:{" "}
              <Ext href="https://simonwillison.net/2026/Jul/16/kimi-k3/">
                Kimi K3, and what we can still learn from the pelican benchmark
              </Ext>
              ,{" "}
              <Ext href="https://simonwillison.net/2025/Jul/11/kimi-k2/">
                moonshotai/Kimi-K2-Instruct (via) - Simon Willison
              </Ext>
            </p>
          </div>

          <div className={styles.personCard}>
            <div className={styles.personCardWho}>Hacker Newsコミュニティ</div>
            <p>
              Kimi K3発表直後のHacker
              Newsスレッドでは、多数の実務経験豊富な開発者から次のような指摘がありました。
            </p>
            <ul>
              <li>
                価格を単純比較する前に、モデルごとの<strong>トークナイザーの違い</strong>
                (同じテキストでもエンコード後のトークン数が異なる)を考慮すべき。
              </li>
              <li>
                <strong>推論効率(reasoning efficiency)</strong>
                こそが実質的なコストを左右する。「見かけの単価が安くても、思考トークンを大量に使うモデルは総コストで高くつく」可能性がある。
              </li>
              <li>
                MoEのスパース化(896エキスパート中16個活性化)から活性化パラメータ数を試算する実践的な計算方法も共有されており、コミュニティが独自に実質的な計算コストを推測する文化がある。
              </li>
            </ul>
            <p className={styles.sourceNote}>
              出典:{" "}
              <Ext href="https://news.ycombinator.com/item?id=48935342">
                Kimi K3 is now live | Hacker News
              </Ext>
            </p>
          </div>

          <div className={styles.personCard}>
            <div className={styles.personCardWho}>
              Zvi Mowshowitz氏(著名AI動向アナリスト、thezvi.substack.com)
            </div>
            <p>
              AI業界の動向を毎週まとめる著名なニュースレター執筆者で、Kimiシリーズの主要リリースのたびにコミュニティの反応を集約したレビューを公開しています。
            </p>
            <ul>
              <li>
                コーディング以外の実務では、コーディングベンチマークが高くても実際の使用感が伴わない場合がある、という複数ユーザーの声を紹介。
              </li>
              <li>
                安全性(ジェイルブレイクへの耐性)について、複数のテスターから「比較的軽微な工夫で安全策を回避できた」という報告があったことも率直に記録している。
              </li>
              <li>
                Kimi K2.5のAgent
                Swarm機能について、Cline(著名なAIコーディングエージェントツール)の開発者Saoud
                Rizwan氏が「Opus
                4.5を8分の1のコストで上回るベンチマークを達成しており、最も重要なのは並列サブエージェントの学習方法(PARL)だ」と技術的に評価したコメントも引用。
              </li>
            </ul>
            <p className={styles.sourceNote}>
              出典:{" "}
              <Ext href="https://thezvi.substack.com/p/kimi-k2-thinking">
                Kimi K2 Thinking - thezvi.substack.com
              </Ext>
              ,{" "}
              <Ext href="https://thezvi.substack.com/p/kimi-k25">
                Kimi K2.5 - thezvi.substack.com
              </Ext>
            </p>
          </div>

          <div className={styles.personCard}>
            <div className={styles.personCardWho}>
              JP Caparas氏(AIライター、Medium/generativeai.pub)
            </div>
            <p>
              Moonshot
              AIの公式プライバシーポリシーの原文を引用しながら、コンシューマー向けサービス(kimi.com)のデータ取り扱いを検証した詳細記事を公開しています。
              「モデルの能力自体は本物で優秀。ただしデータの取り扱い方針は別問題」とし、カジュアルな検証・学習用途と、業務・機密情報を扱う用途とを明確に使い分けるべきだと提言しています(詳細は15.1参照)。
            </p>
            <p className={styles.sourceNote}>
              出典:{" "}
              <Ext href="https://generativeai.pub/kimi-k2-5-is-brilliant-but-think-twice-about-using-kimi-com-157cbb26f9a3">
                Kimi K2.5 is brilliant, but think twice about using Kimi.com - Medium
              </Ext>
            </p>
          </div>

          <div className={styles.personCard}>
            <div className={styles.personCardWho}>
              Awni Hannun氏(Apple機械学習研究者、mlx-lm開発者)
            </div>
            <p>
              Kimi K2(4bit量子化版)が2台のMac Studio(512GB M3
              Ultra、合計約2万ドル相当)でmlx-lmとmx.distributedを使って実用的な速度で動作することを実証しました。
              Simon
              Willison氏もこれを引用して「個人が動かせる範囲でこれに最も近い選択肢」と評しています。K3は2.8兆パラメータとさらに大規模なため、自己ホスティングにはより大きなハードウェア投資が必要になる点に留意してください(K3の重み自体は2026年7月27日まで未公開です)。
            </p>
            <p className={styles.sourceNote}>
              出典:{" "}
              <Ext href="https://x.com/simonw/status/1946961766405263702">
                Simon Willison on X(Awni Hannun氏引用)
              </Ext>
            </p>
          </div>
        </section>

        {/* ============ 18. チェックリスト ============ */}
        <section className={styles.section} id="checklist">
          <h2>
            <span className={styles.badge}>18</span>ベストプラクティス・チェックリスト(まとめ)
          </h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>チェック項目</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    タスクの性質(巨大コンテキスト・高度推論/ルーティンコーディング/汎用・低コスト)に応じてK3/K2.7
                    Code/K2.6を使い分けたか
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    廃止済み・廃止予定モデル(<code className={styles.inlineCode}>kimi-k2</code>
                    系列、
                    <code className={styles.inlineCode}>kimi-latest</code>、
                    <code className={styles.inlineCode}>kimi-k2.5</code>、
                    <code className={styles.inlineCode}>moonshot-v1</code>
                    系列)を使い続けていないか確認したか
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>
                    K3利用時、<code className={styles.inlineCode}>temperature</code>
                    等の固定パラメータをリクエストから省略しているか
                  </td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>
                    K3では<code className={styles.inlineCode}>thinking</code>ではなく
                    <code className={styles.inlineCode}>reasoning_effort</code>を使っているか
                  </td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>
                    マルチターン・ツール呼び出しで、アシスタントメッセージ全体(reasoning_content込み)を保持しているか
                  </td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>
                    ツール数が多いエージェントで、動的ツールロード+search_toolsパターンを検討したか
                  </td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>K3のビジョン入力でパブリックURLではなくbase64/ms://形式を使っているか</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>繰り返し送る接頭辞を固定してキャッシュヒット率を上げているか(K3は90%引き)</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>軽量なタスクにK3(常時maxの思考モード)を使ってコストを浪費していないか</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>
                    コンシューマー版(kimi.com)と業務用途(API)のデータ取り扱いポリシーの違いを理解し、機密情報の扱いを分けているか
                  </td>
                </tr>
                <tr>
                  <td>11</td>
                  <td>本番投入前に独自の入出力モデレーション層・レッドチーミングを検討したか</td>
                </tr>
                <tr>
                  <td>12</td>
                  <td>APIキーをサーバーサイドで安全に管理しているか</td>
                </tr>
                <tr>
                  <td>13</td>
                  <td>429エラーに対するリトライ・バックオフを実装しているか</td>
                </tr>
                <tr>
                  <td>14</td>
                  <td>
                    本番投入前に公式ドキュメントで最新のモデルID・料金・レート制限を確認したか
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ============ 19. 参考文献 ============ */}
        <section className={`${styles.section} ${styles.refGroup}`} id="references">
          <h2>
            <span className={styles.badge}>19</span>参考文献(参照URL一覧)
          </h2>

          <h3>Kimi製品・エコシステム</h3>
          <ul className={styles.refList}>
            <li>
              Kimi Work: Next-Gen Desktop AI Agent for Knowledge Workers —{" "}
              <Ext href="https://www.kimi.com/products/kimi-work">
                https://www.kimi.com/products/kimi-work
              </Ext>
            </li>
            <li>
              AI Document Agent for Automating Knowledge Work | Kimi Docs —{" "}
              <Ext href="https://www.kimi.com/features/docs">
                https://www.kimi.com/features/docs
              </Ext>
            </li>
            <li>
              Kimi Code with Kimi K3: Next-Gen AI Code Agent & CLI —{" "}
              <Ext href="https://www.kimi.com/code">https://www.kimi.com/code</Ext>
            </li>
            <li>
              Kimi (chatbot) - Wikipedia —{" "}
              <Ext href="https://en.wikipedia.org/wiki/Kimi_(chatbot)">
                https://en.wikipedia.org/wiki/Kimi_(chatbot)
              </Ext>
            </li>
          </ul>

          <h3>Kimi K3 公式情報</h3>
          <ul className={styles.refList}>
            <li>
              Kimi K3 Quickstart - Kimi API Platform —{" "}
              <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-quickstart">
                https://platform.kimi.ai/docs/guide/kimi-k3-quickstart
              </Ext>
            </li>
            <li>
              Kimi K3 API Tool Calling Best Practices - Kimi API Platform —{" "}
              <Ext href="https://platform.kimi.ai/docs/guide/kimi-k3-tool-calling-best-practice">
                https://platform.kimi.ai/docs/guide/kimi-k3-tool-calling-best-practice
              </Ext>
            </li>
            <li>
              Kimi K3 Model Pricing - Kimi API Platform —{" "}
              <Ext href="https://platform.kimi.ai/docs/pricing/chat-k3">
                https://platform.kimi.ai/docs/pricing/chat-k3
              </Ext>
            </li>
          </ul>

          <h3>Kimi K2.6 / K2.7-Code / エコシステム公式情報</h3>
          <ul className={styles.refList}>
            <li>
              Model List - Kimi API Platform —{" "}
              <Ext href="https://platform.kimi.ai/docs/models">
                https://platform.kimi.ai/docs/models
              </Ext>
            </li>
            <li>
              Best Practices for Prompts - Kimi API Platform —{" "}
              <Ext href="https://platform.kimi.ai/docs/guide/prompt-best-practice">
                https://platform.kimi.ai/docs/guide/prompt-best-practice
              </Ext>
            </li>
            <li>
              Use Kimi K2.6 Model to Setup Agent - Kimi API Platform —{" "}
              <Ext href="https://platform.kimi.ai/docs/guide/use-kimi-k2-to-setup-agent">
                https://platform.kimi.ai/docs/guide/use-kimi-k2-to-setup-agent
              </Ext>
            </li>
            <li>
              GitHub - MoonshotAI/Kimi-K2 —{" "}
              <Ext href="https://github.com/moonshotai/kimi-k2">
                https://github.com/moonshotai/kimi-k2
              </Ext>
            </li>
          </ul>

          <h3>ニュース・第三者評価・コミュニティの分析</h3>
          <ul className={styles.refList}>
            <li>
              China's Moonshot AI releases Kimi K3 | VentureBeat —{" "}
              <Ext href="https://venturebeat.com/technology/chinas-moonshot-ai-releases-kimi-k3-the-largest-open-source-model-ever-rivaling-top-u-s-systems">
                https://venturebeat.com/technology/chinas-moonshot-ai-releases-kimi-k3-the-largest-open-source-model-ever-rivaling-top-u-s-systems
              </Ext>
            </li>
            <li>
              Kimi K3, and what we can still learn from the pelican benchmark - Simon Willison —{" "}
              <Ext href="https://simonwillison.net/2026/Jul/16/kimi-k3/">
                https://simonwillison.net/2026/Jul/16/kimi-k3/
              </Ext>
            </li>
            <li>
              Kimi K3 is now live | Hacker News —{" "}
              <Ext href="https://news.ycombinator.com/item?id=48935342">
                https://news.ycombinator.com/item?id=48935342
              </Ext>
            </li>
            <li>
              Moonshot AI Releases Kimi K3 | MLQ News —{" "}
              <Ext href="https://mlq.ai/news/moonshot-ai-releases-kimi-k3-a-28-trillion-parameter-open-weight-model-rivaling-top-us-systems/">
                https://mlq.ai/news/moonshot-ai-releases-kimi-k3-a-28-trillion-parameter-open-weight-model-rivaling-top-us-systems/
              </Ext>
            </li>
            <li>
              Kimi K3 API Guide - Verdent Guides —{" "}
              <Ext href="https://www.verdent.ai/guides/agents/kimi-k3-api-guide">
                https://www.verdent.ai/guides/agents/kimi-k3-api-guide
              </Ext>
            </li>
            <li>
              Kimi K3 pricing - eesel AI —{" "}
              <Ext href="https://www.eesel.ai/blog/kimi-k3-pricing">
                https://www.eesel.ai/blog/kimi-k3-pricing
              </Ext>
            </li>
            <li>
              Kimi K3 Pricing: API Cost and Whether It's Worth It | AI Reiter —{" "}
              <Ext href="https://aireiter.com/blog/kimi-k3-pricing">
                https://aireiter.com/blog/kimi-k3-pricing
              </Ext>
            </li>
            <li>
              Kimi Pricing 2026: Plans, API Costs & Free Tier | Fello AI —{" "}
              <Ext href="https://felloai.com/kimi-pricing/">https://felloai.com/kimi-pricing/</Ext>
            </li>
          </ul>

          <h3>プライバシー・セキュリティ・知見</h3>
          <ul className={styles.refList}>
            <li>
              Kimi K2.5 is brilliant, but think twice about using Kimi.com - Medium —{" "}
              <Ext href="https://generativeai.pub/kimi-k2-5-is-brilliant-but-think-twice-about-using-kimi-com-157cbb26f9a3">
                https://generativeai.pub/kimi-k2-5-is-brilliant-but-think-twice-about-using-kimi-com-157cbb26f9a3
              </Ext>
            </li>
            <li>
              Kimi K2 Thinking - Zvi Mowshowitz —{" "}
              <Ext href="https://thezvi.substack.com/p/kimi-k2-thinking">
                https://thezvi.substack.com/p/kimi-k2-thinking
              </Ext>
            </li>
            <li>
              Kimi K2.5 - Zvi Mowshowitz —{" "}
              <Ext href="https://thezvi.substack.com/p/kimi-k25">
                https://thezvi.substack.com/p/kimi-k25
              </Ext>
            </li>
            <li>
              The Untold Misadventures of Red Teaming Kimi K2 with Promptfoo - DEV Community —{" "}
              <Ext href="https://dev.to/ayush7614/the-untold-misadventures-of-red-teaming-kimi-k2-with-promptfoo-3hig">
                https://dev.to/ayush7614/the-untold-misadventures-of-red-teaming-kimi-k2-with-promptfoo-3hig
              </Ext>
            </li>
            <li>
              Best Practices for Benchmarking - Kimi API Platform —{" "}
              <Ext href="https://platform.moonshot.ai/docs/guide/benchmark-best-practice">
                https://platform.moonshot.ai/docs/guide/benchmark-best-practice
              </Ext>
            </li>
            <li>
              Partial Mode - Kimi API Platform —{" "}
              <Ext href="https://platform.kimi.ai/docs/api/partial">
                https://platform.kimi.ai/docs/api/partial
              </Ext>
            </li>
            <li>
              Kimi K2.7 Code API: Pricing, Playground & Docs | EmpirioLabs AI —{" "}
              <Ext href="https://empiriolabs.ai/models/kimi-k2-7-code">
                https://empiriolabs.ai/models/kimi-k2-7-code
              </Ext>
            </li>
            <li>
              Kimi K2.6 & Kimi Code Review: Saving 88% Coding Costs? | Medium —{" "}
              <Ext href="https://medium.com/@tentenco/kimi-k2-6-kimi-code-review-saving-88-coding-costs-b7e8c5eaf5f1">
                https://medium.com/@tentenco/kimi-k2-6-kimi-code-review-saving-88-coding-costs-b7e8c5eaf5f1
              </Ext>
            </li>
            <li>
              Kimi by Moonshot in 2026: K2.6, K2.7-Code and Agents for Managers —{" "}
              <Ext href="https://mysummit.school/blog/en/kimi-k25-moonshot-review-2026/">
                https://mysummit.school/blog/en/kimi-k25-moonshot-review-2026/
              </Ext>
            </li>
            <li>
              Kimi API (Moonshot AI) - Complete Developer Guide —{" "}
              <Ext href="https://agentsapis.com/kimi-api/">https://agentsapis.com/kimi-api/</Ext>
            </li>
          </ul>
        </section>

        <footer className={styles.pageFooter}>
          <strong>免責事項</strong>
          :本ガイドに記載したモデルID・料金・レート制限・仕様・ベンチマーク数値は、公式情報および複数の独立系情報を横断的に確認した2026年7月18日時点のスナップショットです。
          Kimi K3は発表から間もないモデルであり、Moonshot
          AI自身のモデルラインナップと料金体系は今後も頻繁に更新される見込みです。契約・請求・アーキテクチャ設計に関わる意思決定を行う前には、必ず{" "}
          <Ext href="https://platform.moonshot.ai/">platform.moonshot.ai</Ext> および{" "}
          <Ext href="https://platform.kimi.ai/">platform.kimi.ai</Ext>{" "}
          の公式ドキュメント・料金ページで最新情報を確認してください。
          また、著名開発者・コミュニティの投稿として引用した内容は、あくまで個人の見解・検証結果であり、Moonshot
          AIの公式見解ではありません。
        </footer>
      </main>
    </div>
  );
}
