/**
 * DeepSeek LLM ベストプラクティスガイド 2026 (/deepseek/llm-best-practices)
 *
 * DeepSeek-V3 / R1 / V4 モデル選定、Thinking Mode、Context Caching、Function Calling、
 * Anthropic API互換連携を網羅する 100% Faithful 完全忠実移植ページ。
 */

import type { Metadata } from 'next';
import MermaidDiagram from '@/components/docs/MermaidDiagram';
import TocObserver from './TocObserver';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'DeepSeek LLM ベストプラクティスガイド — 初学者向けステップバイステップ解説',
  description:
    'DeepSeek-V3 / R1 / V4 などのモデル選定、Thinking Mode（思考モード）、Context Caching、Function Calling、Anthropic API互換連携までの初学者向け実践ベストプラクティスガイド。',
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

// 8つの Mermaid ダイヤグラム定義
const DIAGRAM_1 = `flowchart TB
    subgraph Y2024["2024年"]
        direction TB
        A1["DeepSeek-V2 / Coder-V2 系列"]
        A2["deepseek-chat が DeepSeek-V3 に更新 (12/26)"]
        A1 --> A2
    end

    subgraph Y2025["2025年"]
        direction TB
        B1["DeepSeek-R1 公開、reasoner登場 (1/20)"]
        B2["V3-0324 / R1-0528 で性能向上"]
        B3["DeepSeek-V3.1: ハイブリッド推論モデル登場 (8/21)"]
        B4["V3.1-Terminus (9/22) から V3.2-Exp (9/29)"]
        B5["DeepSeek-V3.2 正式版 (12/1)"]
        B1 --> B2 --> B3 --> B4 --> B5
    end

    subgraph Y2026["2026年"]
        direction TB
        C1["DeepSeek-V4 Preview 公開 (4/24)"]
        C2["deepseek-v4-pro / deepseek-v4-flash 提供開始"]
        C3["旧モデル名 deepseek-chat/reasoner 廃止予定 (7/24)"]
        C1 --> C2 --> C3
    end

    Y2024 --> Y2025 --> Y2026`;

const DIAGRAM_2 = `flowchart LR
    U["利用者のコード"] -->|"1. リクエスト送信"| E["Base URL: api.deepseek.com"]
    E -->|"2. 認証チェック"| K["APIキー検証"]
    K -->|"3. モデル推論"| M["deepseek-v4-pro / deepseek-v4-flash"]
    M -->|"4. トークン生成"| R["レスポンス生成"]
    R -->|"5. JSON返却"| U`;

const DIAGRAM_3 = `flowchart TD
    Start["タスクの発生"] --> Q1{"高い推論能力<br>（数学・難解なコード・論理パズル）<br>が必須？"}
    Q1 -- はい --> Q2{"予算・応答速度より<br/>精度を最優先？"}
    Q2 -- はい --> Pro["deepseek-v4-pro を選択"]
    Q2 -- いいえ --> Flash1["deepseek-v4-flash（思考モード）で試す"]
    Q1 -- いいえ --> Q3{"シンプルなAgentタスク・<br/>チャット・要約？"}
    Q3 -- はい --> Flash2["deepseek-v4-flash を選択（高速・低コスト）"]
    Q3 -- いいえ --> Custom["ユースケースごとにベンチマークして比較"]`;

const DIAGRAM_4 = `flowchart TD
    A["ユーザーからリクエスト"] --> B["DeepSeek API へリクエスト送信"]
    B --> C{"このターンで<br/>ツール呼び出しをしたか？"}
    C -- していない --> D["次ターンの送信時、<br/>reasoning_content は無視してよい"]
    C -- した --> E["次ターンの送信時、<br/>reasoning_content を必ず含めて再送する<br/>（省略すると400エラー）"]`;

const DIAGRAM_5 = `sequenceDiagram
    participant User as ユーザー
    participant App as アプリケーション
    participant API as DeepSeek API

    User->>App: 「世界一高い山は？」
    App->>API: messages=[user1]
    API-->>App: assistant1「エベレストです」
    App->>App: messages に assistant1 を追記
    User->>App: 「では2番目に高いのは？」
    App->>API: messages=[user1, assistant1, user2]
    API-->>App: assistant2「K2です」`;

const DIAGRAM_6 = `sequenceDiagram
    participant U as ユーザー
    participant App as アプリケーション
    participant M as DeepSeekモデル
    participant T as 外部関数(get_weather)

    U->>App: 「杭州の天気は？」
    App->>M: messages + tools定義
    M-->>App: tool_calls=[get_weather(location=杭州)]
    App->>T: get_weather(location=杭州) を実行
    T-->>App: 24℃
    App->>M: role=tool で結果を返却
    M-->>App: 「杭州の現在の気温は24℃です」
    App-->>U: 最終回答を表示`;

const DIAGRAM_7 = `flowchart TB
    A["1. リクエスト境界での持続化<br/>（各リクエストのユーザー入力末尾／モデル出力末尾）"]
    B["2. 共通接頭辞の検出による持続化<br/>（複数リクエストで共通する接頭辞を検出）"]
    C["3. 固定トークン間隔での持続化<br/>（長文の入出力を一定間隔でユニット化）"]
    A --> D["後続リクエストが完全一致すればキャッシュヒット"]
    B --> D
    C --> D`;

const DIAGRAM_8 = `flowchart TD
    Send["APIリクエスト送信"] --> Resp{"レスポンスコード"}
    Resp -- 200 --> OK["正常処理"]
    Resp -- 429 --> Wait["指数バックオフで再試行<br/>（Retry-Afterがあれば尊重）"]
    Resp -- "500 / 503" --> Retry["短い待機後にリトライ<br/>（最大リトライ回数を設定）"]
    Resp -- "401 / 402 / 422 / 400" --> Fix["コード側の設定・残高・<br/>リクエスト内容を修正"]
    Wait --> Send
    Retry --> Send`;

export default function DeepSeekLlmPage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>DS</div>
          <div className={styles.brandText}>DeepSeek Guide</div>
        </div>
        <div className={styles.brandSub}>LLM Best Practices</div>

        <div className={styles.navGroup}>
          <div className={styles.navLabel}>概要 & モデル</div>
          <a href="#overview" className={styles.navLink}>
            概要
          </a>
          <a href="#what-is-deepseek" className={styles.navLink}>
            1. DeepSeekとは何か
          </a>
          <a href="#model-lineup" className={styles.navLink}>
            2. 2026年7月時点のモデルラインナップ
          </a>
        </div>

        <div className={styles.navGroup}>
          <div className={styles.navLabel}>ステップ解説</div>
          <a href="#step1" className={styles.navLink}>
            Step 01. アカウント作成とAPIキー取得
          </a>
          <a href="#step2" className={styles.navLink}>
            Step 02. はじめてのAPI呼び出し
          </a>
          <a href="#step3" className={styles.navLink}>
            Step 03. モデル選定のベストプラクティス
          </a>
          <a href="#step4" className={styles.navLink}>
            Step 04. Thinking Modeの使い方
          </a>
          <a href="#step5" className={styles.navLink}>
            Step 05. マルチターン会話の実装
          </a>
          <a href="#step6" className={styles.navLink}>
            Step 06. Function Callingの活用
          </a>
          <a href="#step7" className={styles.navLink}>
            Step 07. 構造化出力（JSON Mode）
          </a>
          <a href="#step8" className={styles.navLink}>
            Step 08. Context Caching
          </a>
          <a href="#step9" className={styles.navLink}>
            Step 09. レート制限とエラー処理
          </a>
          <a href="#step10" className={styles.navLink}>
            Step 10. Anthropic互換とAgent連携
          </a>
        </div>

        <div className={styles.navGroup}>
          <div className={styles.navLabel}>運用・リファレンス</div>
          <a href="#cost" className={styles.navLink}>
            料金とトークン管理
          </a>
          <a href="#summary" className={styles.navLink}>
            ベストプラクティス総まとめ表
          </a>
          <a href="#migration" className={styles.navLink}>
            移行チェックリスト
          </a>
          <a href="#faq" className={styles.navLink}>
            トラブルシューティングFAQ
          </a>
          <a href="#references" className={styles.navLink}>
            参考文献一覧
          </a>
        </div>
      </aside>

      <main className={styles.main}>
        {/* HERO HEADER */}
        <header className={styles.hero} id="overview">
          <div className={styles.eyebrow}>
            <span>Official API Guide</span> • <span>2026年7月最新仕様対応</span>
          </div>
          <h1>
            DeepSeek LLM ベストプラクティスガイド
            <br />
            〜初学者向けステップバイステップ解説〜
          </h1>
          <p className={styles.lead}>
            中国発のオープン重みLLM「DeepSeek」のAPI仕様・モデル選定・思考モード（Thinking
            Mode）・Context Caching・Function
            Calling・Anthropic互換API連携まで、初学者が本番システムで活用するためのベストプラクティスを網羅的に解説します。
          </p>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>対象者:</span>
              <span className={styles.metaVal}>初学者 〜 中級エンジニア</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>対応API:</span>
              <span className={styles.metaVal}>DeepSeek API v3 / v4 (OpenAI/Anthropic互換)</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>最終更新:</span>
              <span className={styles.metaVal}>2026年7月16日</span>
            </div>
          </div>
        </header>

        {/* SECTION 1 */}
        <section className={styles.section} id="what-is-deepseek">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>SECTION 01</span>
          </div>
          <h2>1. DeepSeekとは何か</h2>
          <p>
            DeepSeek（ディープシーク）は、高性能な大言語モデル（LLM）および推論モデル（Reasoning
            Model）を開発するAI研究機関・企業です。GPT-4クラスやClaude 3.5
            Sonnetクラスの性能を、従来の1/10〜1/50という低価格・省リソースで実現し、世界的な注目を集めました。
          </p>
          <p>
            公式ホストの DeepSeek API は、
            <strong>OpenAI API と互換のある形式（JSON schema）</strong>および
            <strong>Anthropic API 互換形式</strong>の双方を提供しており、既存のOpenAI
            SDKやClaude用ツール（Claude
            CodeやCursorなど）からエンドポイントとモデル名を差し替えるだけで利用できます。
          </p>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>💡 なぜ今DeepSeekなのか？</div>
            <p>
              圧倒的なコストパフォーマンス（Context
              Caching適用時で1Mトークンあたり数セント〜十数セント）に加え、思考プロセスを出力する推論モデル（Thinking
              Mode）がAPIレベルで標準サポートされているため、複雑なコード生成や論理的推論、マルチステップなエージェント（Agent）構築において強力な選択肢となっています。
            </p>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className={styles.section} id="model-lineup">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>SECTION 02</span>
          </div>
          <h2>2. 2026年7月時点のモデルラインナップ全体像</h2>

          <h3>モデル進化の歴史（タイムライン図）</h3>
          <div className={styles.diagramCard}>
            <MermaidDiagram chart={DIAGRAM_1} />
            <div className={styles.diagramCaption}>図1: DeepSeekモデル進化のタイムライン（2024年〜2026年）</div>
          </div>

          <h3>現行モデル比較表（2026年7月16日時点）</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>deepseek-v4-flash</th>
                  <th>deepseek-v4-pro</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>モデル実体</td>
                  <td>DeepSeek-V4 Flash（軽量高効率）</td>
                  <td>DeepSeek-V4 Pro（フラッグシップ）</td>
                </tr>
                <tr>
                  <td>思考モード（Thinking）</td>
                  <td>対応（トグル可）</td>
                  <td>対応（トグル可・思考深度調整可）</td>
                </tr>
                <tr>
                  <td>コンテキスト窓上限</td>
                  <td>128,000 トークン (128K)</td>
                  <td>128,000 トークン (128K)</td>
                </tr>
                <tr>
                  <td>最大出力トークン</td>
                  <td>8,192 トークン (8K)</td>
                  <td>16,384 トークン (16K)</td>
                </tr>
                <tr>
                  <td>Context Caching</td>
                  <td>自動適用（割引率 〜95%）</td>
                  <td>自動適用（割引率 〜95%）</td>
                </tr>
                <tr>
                  <td>入力価格 (Miss / Hit)</td>
                  <td>$0.075 / $0.015 (per 1M)</td>
                  <td>$0.27 / $0.07 (per 1M)</td>
                </tr>
                <tr>
                  <td>出力価格</td>
                  <td>$0.30 (per 1M)</td>
                  <td>$1.10 (per 1M)</td>
                </tr>
                <tr>
                  <td>主な用途</td>
                  <td>チャット、簡単なAgent、日常タスク、高並列処理</td>
                  <td>複雑なコーディング、高度な推論、数学、厳格なJSON出力</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <div className={styles.calloutTitle}>⚠️ 旧モデル名廃止の予告（2026年7月24日）</div>
            <p>
              旧モデルエイリアスである <code className={styles.inlineCode}>deepseek-chat</code>
              （DeepSeek-V3実体）および <code className={styles.inlineCode}>deepseek-reasoner</code>
              （DeepSeek-R1実体）は、<strong>2026年7月24日に完全廃止</strong>
              されます。新規開発では必ず{' '}
              <code className={styles.inlineCode}>deepseek-v4-flash</code> または{' '}
              <code className={styles.inlineCode}>deepseek-v4-pro</code> を指定してください。
            </p>
          </div>
        </section>

        {/* STEP 1 */}
        <section className={styles.section} id="step1">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>STEP 01</span>
          </div>
          <h2>アカウント作成とAPIキー取得</h2>
          <p>DeepSeek APIを利用するための準備手順です。</p>
          <ol>
            <li>
              公式プラットフォーム（
              <Ext href="https://platform.deepseek.com">platform.deepseek.com</Ext>
              ）へアクセスしアカウントを作成します。
            </li>
            <li>
              ダッシュボードの「API Keys」メニューから「Create new API
              key」をクリックし、キーを生成・保存します。（キーは一度しか表示されません）
            </li>
            <li>
              「Top
              up」メニューからクレジットカードまたはPayPal等でクレジットをチャージします（従量課金制・最低5ドル程度からチャージ可能）。
            </li>
            <li>
              環境変数 <code className={styles.inlineCode}>DEEPSEEK_API_KEY</code>{' '}
              に取得したAPIキーを設定します。
            </li>
          </ol>

          <div className={styles.codeBlock}>
            <div className={styles.codeBar}>
              <span>bash</span>
              <span>env_setup.sh</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.ck}>export</span> DEEPSEEK_API_KEY=<span className={styles.cs}>"sk-xxxxxxxxxxxxxxxxxxxxxxxx"</span>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 2 */}
        <section className={styles.section} id="step2">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>STEP 02</span>
          </div>
          <h2>はじめてのAPI呼び出し</h2>
          <p>
            DeepSeek APIはOpenAI SDKと完全互換です。Pythonの{' '}
            <code className={styles.inlineCode}>openai</code> パッケージをそのまま使用し、
            <code className={styles.inlineCode}>base_url="https://api.deepseek.com"</code>{' '}
            を指定するだけで動作します。
          </p>

          <h3>呼び出しの全体フロー</h3>
          <div className={styles.diagramCard}>
            <MermaidDiagram chart={DIAGRAM_2} />
            <div className={styles.diagramCaption}>図2: DeepSeek APIリクエストの全体フロー</div>
          </div>

          <h3>実装例（Python / OpenAI SDK形式）</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeBar}>
              <span>python</span>
              <span>first_call.py</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span> openai <span className={styles.ck}>import</span> OpenAI
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                client = <span className={styles.fn}>OpenAI</span>(
              </div>
              <div className={styles.codeLine}>
                {"  "}api_key=<span className={styles.cs}>"your_deepseek_api_key"</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}base_url=<span className={styles.cs}>"https://api.deepseek.com"</span>
              </div>
              <div className={styles.codeLine}>)</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                response = client.chat.completions.<span className={styles.fn}>create</span>(
              </div>
              <div className={styles.codeLine}>
                {"  "}model=<span className={styles.cs}>"deepseek-v4-flash"</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}messages=[
              </div>
              <div className={styles.codeLine}>
                {"    "}{'{'}<span className={styles.cs}>"role"</span>: <span className={styles.cs}>"system"</span>, <span className={styles.cs}>"content"</span>: <span className={styles.cs}>"あなたは優秀なアシスタントです。"</span>{'}'},
              </div>
              <div className={styles.codeLine}>
                {"    "}{'{'}<span className={styles.cs}>"role"</span>: <span className={styles.cs}>"user"</span>, <span className={styles.cs}>"content"</span>: <span className={styles.cs}>"DeepSeek APIの特徴を簡潔に教えてください。"</span>{'}'}
              </div>
              <div className={styles.codeLine}>
                {"  "}],
              </div>
              <div className={styles.codeLine}>
                {"  "}stream=<span className={styles.ce}>False</span>
              </div>
              <div className={styles.codeLine}>)</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span className={styles.fn}>print</span>(response.choices[<span className={styles.cv}>0</span>].message.content)
              </div>
            </div>
          </div>

          <div className={styles.bestPractice}>
            <strong>ベストプラクティス:</strong> APIキーはコードに直接ハードコードせず、必ず環境変数{' '}
            <code className={styles.inlineCode}>DEEPSEEK_API_KEY</code>{' '}
            から読み込む設計にしてください。
          </div>

          <div className={styles.refbox}>
            <div className={styles.refboxTitle}>参照URL</div>
            <ul>
              <li>
                <Ext href="https://api-docs.deepseek.com/quick_start/first_instruction">
                  https://api-docs.deepseek.com/quick_start/first_instruction
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        {/* STEP 3 */}
        <section className={styles.section} id="step3">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>STEP 03</span>
          </div>
          <h2>モデル選定のベストプラクティス</h2>
          <p>
            ユースケースや予算に応じて、最適なモデルを選択するためのフローチャートと決定基準です。
          </p>

          <div className={styles.diagramCard}>
            <MermaidDiagram chart={DIAGRAM_3} />
            <div className={styles.diagramCaption}>図3: モデル選定ディシジョンツリー</div>
          </div>

          <h3>選定の基準まとめ</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>ユースケース</th>
                  <th>推奨モデル</th>
                  <th>理由</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>コーディングエージェント、複雑な多段階Agentタスク</td>
                  <td>
                    <code className={styles.inlineCode}>deepseek-v4-pro</code>
                  </td>
                  <td>複雑な文脈理解と厳密なステップ実行力。最大16K出力対応。</td>
                </tr>
                <tr>
                  <td>高頻度なチャット、リアルタイム要約、コスト重視タスク</td>
                  <td>
                    <code className={styles.inlineCode}>deepseek-v4-flash</code>
                  </td>
                  <td>超高速かつ超低コスト（入力 $0.075 / 出力 $0.30）。</td>
                </tr>
                <tr>
                  <td>難解な数学問題、アルゴリズム開発、論理検証</td>
                  <td>
                    <code className={styles.inlineCode}>deepseek-v4-pro</code> (Thinking)
                  </td>
                  <td>思考モードを有効化し、思考ログを出力させることで最高精度を達成。</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* STEP 4 */}
        <section className={styles.section} id="step4">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>STEP 04</span>
          </div>
          <h2>Thinking Mode（思考モード）の使い方</h2>
          <p>
            DeepSeek V4 シリーズでは、OpenAI o1/o3
            シリーズと同様に、回答の前に「思考プロセス（Reasoning
            Content）」を出力する思考モードが統合されています。
          </p>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>💡 思考モードの出力形式</div>
            <p>
              思考モードが有効な場合、レスポンスの message オブジェクト内に{' '}
              <code className={styles.inlineCode}>reasoning_content</code>{' '}
              フィールドが追加され、思考過程テキストが格納されます。最終回答は従来の{' '}
              <code className={styles.inlineCode}>content</code> フィールドに入ります。
            </p>
          </div>

          <div className={styles.diagramCard}>
            <MermaidDiagram chart={DIAGRAM_4} />
            <div className={styles.diagramCaption}>図4: マルチターンにおける reasoning_content 引き継ぎのルール</div>
          </div>

          <h3>Python実装例</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeBar}>
              <span>python</span>
              <span>thinking_mode.py</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                messages = [{"{"}<span className={styles.cs}>"role"</span>: <span className={styles.cs}>"user"</span>, <span className={styles.cs}>"content"</span>: <span className={styles.cs}>"9.11 と 9.8 はどちらが大きい？"</span>{"}"}]
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                response = client.chat.completions.<span className={styles.fn}>create</span>(
              </div>
              <div className={styles.codeLine}>
                {"  "}model=<span className={styles.cs}>"deepseek-v4-pro"</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}messages=messages,
              </div>
              <div className={styles.codeLine}>
                {"  "}reasoning_effort=<span className={styles.cs}>"high"</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}extra_body={"{"}<span className={styles.cs}>"thinking"</span>: {"{"}<span className={styles.cs}>"type"</span>: <span className={styles.cs}>"enabled"</span>{"}"}{"}"}
              </div>
              <div className={styles.codeLine}>)</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span className={styles.cc}># 思考プロセスの取得</span>
              </div>
              <div className={styles.codeLine}>
                reasoning = <span className={styles.fn}>getattr</span>(response.choices[<span className={styles.cv}>0</span>].message, <span className={styles.cs}>'reasoning_content'</span>, <span className={styles.ce}>None</span>)
              </div>
              <div className={styles.codeLine}>
                <span className={styles.fn}>print</span>(<span className={styles.cs}>"--- 思考過程 ---"</span>)
              </div>
              <div className={styles.codeLine}>
                <span className={styles.fn}>print</span>(reasoning)
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span className={styles.fn}>print</span>(<span className={styles.cs}>"--- 最終回答 ---"</span>)
              </div>
              <div className={styles.codeLine}>
                <span className={styles.fn}>print</span>(response.choices[<span className={styles.cv}>0</span>].message.content)
              </div>
            </div>
          </div>

          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <div className={styles.calloutTitle}>⚠️ 注意: マルチターン会話での引き継ぎルール</div>
            <p>
              Tool Calls（Function
              Calling）を伴うマルチターン会話で思考モードを使用する場合、次ターンの送信時に前のレスポンスに含まれていた{' '}
              <code className={styles.inlineCode}>reasoning_content</code>{' '}
              をメッセージ履歴に保持したまま送信してください。これを削除して送信すると API が 400
              エラーを返却します。
            </p>
          </div>
        </section>

        {/* STEP 5 */}
        <section className={styles.section} id="step5">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>STEP 05</span>
          </div>
          <h2>マルチターン会話の実装</h2>
          <p>
            文脈（Context）を保持して会話を継続する場合、過去のやり取りを{' '}
            <code className={styles.inlineCode}>messages</code> 配列に追加して毎回送信します。
          </p>

          <div className={styles.diagramCard}>
            <MermaidDiagram chart={DIAGRAM_5} />
            <div className={styles.diagramCaption}>図5: マルチターン会話のコンテキスト連結</div>
          </div>

          <div className={styles.codeBlock}>
            <div className={styles.codeBar}>
              <span>python</span>
              <span>multi_turn.py</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                messages = [{"{"}<span className={styles.cs}>"role"</span>: <span className={styles.cs}>"user"</span>, <span className={styles.cs}>"content"</span>: <span className={styles.cs}>"世界一高い山は？"</span>{"}"}]
              </div>
              <div className={styles.codeLine}>
                response = client.chat.completions.<span className={styles.fn}>create</span>(model=<span className={styles.cs}>"deepseek-v4-pro"</span>, messages=messages)
              </div>
              <div className={styles.codeLine}>
                messages.<span className={styles.fn}>append</span>(response.choices[<span className={styles.cv}>0</span>].message)
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                messages.<span className={styles.fn}>append</span>({"{"}<span className={styles.cs}>"role"</span>: <span className={styles.cs}>"user"</span>, <span className={styles.cs}>"content"</span>: <span className={styles.cs}>"では2番目に高いのは？"</span>{"}"})
              </div>
              <div className={styles.codeLine}>
                response = client.chat.completions.<span className={styles.fn}>create</span>(model=<span className={styles.cs}>"deepseek-v4-pro"</span>, messages=messages)
              </div>
              <div className={styles.codeLine}>
                messages.<span className={styles.fn}>append</span>(response.choices[<span className={styles.cv}>0</span>].message)
              </div>
            </div>
          </div>

          <div className={styles.bestPractice}>
            <strong>ベストプラクティス:</strong>{' '}
            会話履歴が長くなるほどトークン消費が増えるため、Step 8のContext
            Cachingと組み合わせて、履歴の「共通接頭辞」を維持する設計（システムプロンプトを変えない、履歴を編集しない）にするとキャッシュヒット率が向上します。
          </div>

          <div className={styles.refbox}>
            <div className={styles.refboxTitle}>参照URL</div>
            <ul>
              <li>
                <Ext href="https://api-docs.deepseek.com/guides/multi_round_chat">
                  https://api-docs.deepseek.com/guides/multi_round_chat
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        {/* STEP 6 */}
        <section className={styles.section} id="step6">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>STEP 06</span>
          </div>
          <h2>Function Calling（Tool Calls）の活用</h2>
          <p>
            Tool
            Callsは、モデルが外部関数（天気取得API、DB検索など）を呼び出して能力を拡張する仕組みです。
            <strong>モデル自身は関数を実行しません。</strong>
            関数を呼ぶ「意図」と「引数」を返すだけで、実際の実行と結果の返却はアプリケーション側の責務です。
          </p>

          <h3>非思考モードでの基本フロー</h3>
          <div className={styles.diagramCard}>
            <MermaidDiagram chart={DIAGRAM_6} />
            <div className={styles.diagramCaption}>図6: Tool Calls（Function Calling）の基本シーケンス</div>
          </div>

          <h3>実装例</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeBar}>
              <span>python</span>
              <span>tool_calls.py</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>tools = [</div>
              <div className={styles.codeLine}>{"  "}{"{"}</div>
              <div className={styles.codeLine}>{"    "}<span className={styles.cs}>"type"</span>: <span className={styles.cs}>"function"</span>,</div>
              <div className={styles.codeLine}>{"    "}<span className={styles.cs}>"function"</span>: {"{"}</div>
              <div className={styles.codeLine}>{"      "}<span className={styles.cs}>"name"</span>: <span className={styles.cs}>"get_weather"</span>,</div>
              <div className={styles.codeLine}>{"      "}<span className={styles.cs}>"description"</span>: <span className={styles.cs}>"指定した場所の天気を取得する"</span>,</div>
              <div className={styles.codeLine}>{"      "}<span className={styles.cs}>"parameters"</span>: {"{"}</div>
              <div className={styles.codeLine}>{"        "}<span className={styles.cs}>"type"</span>: <span className={styles.cs}>"object"</span>,</div>
              <div className={styles.codeLine}>{"        "}<span className={styles.cs}>"properties"</span>: {"{"}</div>
              <div className={styles.codeLine}>{"          "}<span className={styles.cs}>"location"</span>: {"{"}<span className={styles.cs}>"type"</span>: <span className={styles.cs}>"string"</span>, <span className={styles.cs}>"description"</span>: <span className={styles.cs}>"都市名"</span>{"}"}</div>
              <div className={styles.codeLine}>{"        "}{"}"},</div>
              <div className={styles.codeLine}>{"        "}<span className={styles.cs}>"required"</span>: [<span className={styles.cs}>"location"</span>]</div>
              <div className={styles.codeLine}>{"      "}{"}"}</div>
              <div className={styles.codeLine}>{"    "}{"}"}</div>
              <div className={styles.codeLine}>{"  "}{"}"}</div>
              <div className={styles.codeLine}>]</div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                response = client.chat.completions.<span className={styles.fn}>create</span>(
              </div>
              <div className={styles.codeLine}>
                {"  "}model=<span className={styles.cs}>"deepseek-v4-pro"</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}messages=[{"{"}<span className={styles.cs}>"role"</span>: <span className={styles.cs}>"user"</span>, <span className={styles.cs}>"content"</span>: <span className={styles.cs}>"杭州の天気は？"</span>{"}"}],
              </div>
              <div className={styles.codeLine}>
                {"  "}tools=tools
              </div>
              <div className={styles.codeLine}>)</div>
            </div>
          </div>
        </section>

        {/* STEP 7 */}
        <section className={styles.section} id="step7">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>STEP 07</span>
          </div>
          <h2>構造化出力（JSON Mode / strictモード）</h2>
          <p>
            APIからの出力を厳格なJSONオブジェクトとして受け取るための設定です。
            <code className={styles.inlineCode}>
              response_format={'{'}"type": "json_object"{'}'}
            </code>{' '}
            を指定します。
          </p>

          <div className={styles.codeBlock}>
            <div className={styles.codeBar}>
              <span>python</span>
              <span>json_mode.py</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                response = client.chat.completions.<span className={styles.fn}>create</span>(
              </div>
              <div className={styles.codeLine}>
                {"  "}model=<span className={styles.cs}>"deepseek-v4-pro"</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}messages=[
              </div>
              <div className={styles.codeLine}>
                {"    "}{"{"}<span className={styles.cs}>"role"</span>: <span className={styles.cs}>"system"</span>, <span className={styles.cs}>"content"</span>: <span className={styles.cs}>"必ずJSONオブジェクト形式で出力してください。"</span>{"}"},
              </div>
              <div className={styles.codeLine}>
                {"    "}{"{"}<span className={styles.cs}>"role"</span>: <span className={styles.cs}>"user"</span>, <span className={styles.cs}>"content"</span>: <span className={styles.cs}>"東京の基本情報をJSONで出力して。"</span>{"}"}
              </div>
              <div className={styles.codeLine}>
                {"  "}],
              </div>
              <div className={styles.codeLine}>
                {"  "}response_format={"{"}<span className={styles.cs}>"type"</span>: <span className={styles.cs}>"json_object"</span>{"}"}
              </div>
              <div className={styles.codeLine}>)</div>
            </div>
          </div>

          <div className={styles.bestPractice}>
            <strong>注意点:</strong> JSON
            Modeを使用する場合、プロンプト（systemまたはuserメッセージ）内に必ず「JSON」という単語を含めてください。含めない場合はエラーとなるか意図しない出力になります。
          </div>
        </section>

        {/* STEP 8 */}
        <section className={styles.section} id="step8">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>STEP 08</span>
          </div>
          <h2>Context Caching でコストを最大95%削減する</h2>
          <p>
            DeepSeek
            APIは、リクエスト間で共通するプロンプト接頭辞（Prefix）を自動的にディスク/メモリにキャッシュする{' '}
            <strong>Context Caching（KV Cache）</strong>{' '}
            を標準搭載しています。ユーザー側で特別なAPI呼び出しは不要で、条件を満たすと自動的にキャッシュヒット割引が適用されます。
          </p>

          <div className={styles.diagramCard}>
            <MermaidDiagram chart={DIAGRAM_7} />
            <div className={styles.diagramCaption}>図7: Context Cachingにおけるキャッシュ持続化の3パターン</div>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>フィールド</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>prompt_cache_hit_tokens</code>
                  </td>
                  <td>入力のうちキャッシュヒットしたトークン数（格安料金が適用）</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>prompt_cache_miss_tokens</code>
                  </td>
                  <td>入力のうちキャッシュミスしたトークン数（通常入力料金）</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.bestPractice}>
            <strong>ベストプラクティス:</strong>
            <ul>
              <li>
                システムプロンプトや長文コンテキスト（ドキュメント等）を
                <strong>常に会話の先頭に固定配置</strong>
                し、後半にだけ質問を変えて送信すると、共通接頭辞がキャッシュされてコストが大幅に下がります。
              </li>
              <li>
                キャッシュはベストエフォートであり100%のヒットを保証しません。未使用キャッシュは一定時間でクリアされます。
              </li>
            </ul>
          </div>

          <div className={styles.refbox}>
            <div className={styles.refboxTitle}>参照URL</div>
            <ul>
              <li>
                <Ext href="https://api-docs.deepseek.com/guides/kv_cache">
                  https://api-docs.deepseek.com/guides/kv_cache
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        {/* STEP 9 */}
        <section className={styles.section} id="step9">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>STEP 09</span>
          </div>
          <h2>レート制限・同時実行数・エラーハンドリング</h2>

          <h3>同時実行数（Concurrency Limit）</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>モデル</th>
                  <th>同時実行数上限</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>deepseek-v4-pro</td>
                  <td>500</td>
                </tr>
                <tr>
                  <td>deepseek-v4-flash</td>
                  <td>2500</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul>
            <li>
              上限はAPIキー単位ではなく<strong>アカウント単位</strong>で計算されます
            </li>
            <li>上限を超えると HTTP 429 が返却されます</li>
          </ul>

          <h3>user_id によるアイソレーション</h3>
          <p>
            <code className={styles.inlineCode}>user_id</code>{' '}
            パラメータを渡すことで、自社サービス内のエンドユーザー単位で「コンテンツ安全性」「KVCacheの分離」「スケジューリング」を分離管理できます。
          </p>

          <div className={styles.codeBlock}>
            <div className={styles.codeBar}>
              <span>python</span>
              <span>user_id.py</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                response = client.chat.completions.<span className={styles.fn}>create</span>(
              </div>
              <div className={styles.codeLine}>
                {"  "}model=<span className={styles.cs}>"deepseek-v4-pro"</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}messages=[{"{"}<span className={styles.cs}>"role"</span>: <span className={styles.cs}>"user"</span>, <span className={styles.cs}>"content"</span>: <span className={styles.cs}>"Hello!"</span>{"}"}],
              </div>
              <div className={styles.codeLine}>
                {"  "}extra_body={"{"}<span className={styles.cs}>"user_id"</span>: <span className={styles.cs}>"your_user_id"</span>{"}"},
              </div>
              <div className={styles.codeLine}>)</div>
            </div>
          </div>

          <h3>エラーハンドリングのベストプラクティスフロー</h3>
          <div className={styles.diagramCard}>
            <MermaidDiagram chart={DIAGRAM_8} />
            <div className={styles.diagramCaption}>図8: エラーハンドリングのベストプラクティスフロー</div>
          </div>
        </section>

        {/* STEP 10 */}
        <section className={styles.section} id="step10">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>STEP 10</span>
          </div>
          <h2>Anthropic API互換とコーディングエージェント連携</h2>
          <p>
            DeepSeek APIはAnthropic API形式のエンドポイント（
            <code className={styles.inlineCode}>https://api.deepseek.com/anthropic</code>
            ）も提供しています。これにより、Claude CodeなどのAnthropicツールから直接利用可能です。
          </p>

          <div className={styles.codeBlock}>
            <div className={styles.codeBar}>
              <span>bash</span>
              <span>claude_code_setup.sh</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.ck}>export</span> ANTHROPIC_BASE_URL=<span className={styles.cs}>"https://api.deepseek.com/anthropic"</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>export</span> ANTHROPIC_API_KEY=<span className={styles.cs}>"your_deepseek_api_key"</span>
              </div>
              <div className={styles.codeLine}>
                claude --model deepseek-v4-pro
              </div>
            </div>
          </div>
        </section>

        {/* COST SECTION */}
        <section className={styles.section} id="cost">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>COST MANAGEMENT</span>
          </div>
          <h2>料金とトークン管理のベストプラクティス</h2>
          <p>
            DeepSeek
            APIは非常に安価ですが、大規模な並列処理を行う場合は適切な管理が推奨されます。ダッシュボードで利用上限額（Usage
            Limit）を設定し、不要なリトライを防ぐ実装を行ってください。
          </p>
        </section>

        {/* SUMMARY SECTION */}
        <section className={styles.section} id="summary">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>SUMMARY</span>
          </div>
          <h2>ベストプラクティス総まとめ表</h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>カテゴリ</th>
                  <th>ベストプラクティス</th>
                  <th>解説</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>モデル選定</td>
                  <td>標準は Flash、高度タスクは Pro</td>
                  <td>
                    基本は <code className={styles.inlineCode}>deepseek-v4-flash</code>{' '}
                    で十分。厳密な思考やコード生成のみ Pro を採用。
                  </td>
                </tr>
                <tr>
                  <td>コスト最適化</td>
                  <td>システムプロンプトの固定配置</td>
                  <td>Prefix を固定して Context Caching（最大95%引）を最大化。</td>
                </tr>
                <tr>
                  <td>エラーハンドリング</td>
                  <td>429/500系の指数バックオフリトライ</td>
                  <td>過負荷時は即時リトライせず待機時間を延ばして再試行。</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* MIGRATION SECTION */}
        <section className={styles.section} id="migration">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>CHECKLIST</span>
          </div>
          <h2>移行チェックリスト（旧モデル廃止対応）</h2>
          <ul>
            <li>
              [ ] <code className={styles.inlineCode}>deepseek-chat</code> の記述を{' '}
              <code className={styles.inlineCode}>deepseek-v4-flash</code> または{' '}
              <code className={styles.inlineCode}>deepseek-v4-pro</code> へ変更
            </li>
            <li>
              [ ] <code className={styles.inlineCode}>deepseek-reasoner</code> の記述を{' '}
              <code className={styles.inlineCode}>deepseek-v4-pro</code> (Thinking Mode) へ変更
            </li>
            <li>
              [ ] API Base URL が{' '}
              <code className={styles.inlineCode}>https://api.deepseek.com</code> であることを確認
            </li>
            <li>[ ] 2026年7月24日の完全廃止前にテスト環境で動作検証を完了</li>
          </ul>
        </section>

        {/* FAQ SECTION */}
        <section className={styles.section} id="faq">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>FAQ</span>
          </div>
          <h2>トラブルシューティングFAQ</h2>
          <div className={styles.callout}>
            <div className={styles.calloutTitle}>Q. API呼び出しで 402 エラーが返されます</div>
            <p>
              アカウントのチャージ残高が不足しています。ダッシュボードの「Top
              up」メニューからクレジットを追加してください。
            </p>
          </div>
          <div className={styles.callout}>
            <div className={styles.calloutTitle}>Q. 思考モードで 400 エラーが発生します</div>
            <p>
              マルチターン会話で前のレスポンスの{' '}
              <code className={styles.inlineCode}>reasoning_content</code>{' '}
              を削除していないか確認してください。メッセージ履歴に含めたまま再送する必要があります。
            </p>
          </div>
        </section>

        {/* REFERENCES SECTION */}
        <section className={styles.section} id="references">
          <div className={styles.sectionKicker}>
            <span className={styles.stepNum}>REFERENCES</span>
          </div>
          <h2>参考文献一覧（全URL）</h2>
          <div className={styles.refbox}>
            <ul>
              <li>
                <Ext href="https://api-docs.deepseek.com/">
                  DeepSeek API Documentation (Official)
                </Ext>
              </li>
              <li>
                <Ext href="https://platform.deepseek.com/">DeepSeek Platform Dashboard</Ext>
              </li>
              <li>
                <Ext href="https://api-docs.deepseek.com/guides/kv_cache">
                  DeepSeek KV Cache Documentation
                </Ext>
              </li>
              <li>
                <Ext href="https://api-docs.deepseek.com/guides/multi_round_chat">
                  DeepSeek Multi-round Chat Guide
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        <footer className={styles.pageFooter}>
          <p>© 2026 DeepSeek LLM Guide. Built for AI Developers & Engineers.</p>
        </footer>
      </main>
    </div>
  );
}
