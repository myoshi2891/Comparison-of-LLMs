import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "SKILL.md 実践ベストプラクティスガイド (Google Antigravity 対応版) | AI Model Cost Calculator",
  description:
    "Google Antigravity / Gemini CLI / Claude Code 対応。Agent Skills (SKILL.md) の完全解説とベストプラクティス、プログレッシブ・ディスクロージャー設計、description 記述術、指示文 vs スクリプト判断基準など。",
};

const MERMAID_LIFECYCLE = `flowchart TD
    A["会話が開始される"] --> B["全スキルのname/descriptionのみを読み込む"]
    B --> C{"要求とdescriptionが一致するか"}
    C -->|"一致しない"| D["読み込まれない(コストほぼ0)"]
    C -->|"一致する"| E["SKILL.md本文全体を読み込む"]
    E --> F{"scripts/referencesへの参照があるか"}
    F -->|"ある"| G["必要なファイルだけをオンデマンドで読み込み実行"]
    F -->|"ない"| H["本文の指示だけでタスクを遂行"]
    G --> I["タスク完了"]
    H --> I
    class A,B,E,G,H,I process
    class C,F decision
    classDef process fill:#2f2559,stroke:#b9a6f5,color:#f5f2ff
    classDef decision fill:#0f2c2a,stroke:#5eead4,color:#eafff9`;

const MERMAID_DECISION = `flowchart TD
    A["スキルの本文を書く"] --> B{"操作は壊れやすく厳密な手順が必要か"}
    B -->|"はい"| C["Low freedom: 具体的なスクリプトを用意し、そのまま実行させる"]
    B -->|"いいえ"| D{"ある程度決まったパターンが存在するか"}
    D -->|"はい"| E["Medium freedom: パラメータ付きテンプレートや疑似コードを示す"]
    D -->|"いいえ"| F["High freedom: 自然言語の方針とヒューリスティックを示す"]
    class A process
    class B,D decision
    class C,E,F process
    classDef process fill:#2f2559,stroke:#b9a6f5,color:#f5f2ff
    classDef decision fill:#0f2c2a,stroke:#5eead4,color:#eafff9`;

export default function SkillGuidePage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarBadge}>Google Antigravity 対応</div>
          <div className={styles.sidebarTitle}>SKILL.md 実践ベストプラクティスガイド</div>
          <div className={styles.sidebarMeta}>
            最終更新: 2026年7月26日
            <br />
            オープンスタンダード仕様
          </div>
        </div>

        <div className={styles.navGroupLabel}>目次ナビゲーション</div>
        <a href="#sec-1" className={styles.navLink} data-toc-link>
          1. 概要と概念
        </a>
        <a href="#sec-2" className={styles.navLink} data-toc-link>
          2. Progressive Disclosure
        </a>
        <a href="#sec-3" className={styles.navLink} data-toc-link>
          3. Antigravity スキル
        </a>
        <a href="#sec-4" className={styles.navLink} data-toc-link>
          4. SKILL.md の基本構造
        </a>
        <a href="#sec-5" className={styles.navLink} data-toc-link>
          5. 実装ステップバイステップ
        </a>
        <a href="#sec-6" className={styles.navLink} data-toc-link>
          6. ライフサイクル図解
        </a>
        <a href="#sec-7" className={styles.navLink} data-toc-link>
          7. 指示 vs スクリプト
        </a>
        <a href="#sec-8" className={styles.navLink} data-toc-link>
          8. Claude vs Antigravity
        </a>
        <a href="#sec-9" className={styles.navLink} data-toc-link>
          9. アンチパターン
        </a>
        <a href="#sec-10" className={styles.navLink} data-toc-link>
          10. 実践チェックリスト
        </a>
        <a href="#sec-11" className={styles.navLink} data-toc-link>
          11. まとめ
        </a>
        <a href="#sec-12" className={styles.navLink} data-toc-link>
          12. 参考文献・引用ソース
        </a>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerBadge}>オープンスタンダード・仕様ガイド</div>
          <h1 className={styles.title}>SKILL.md 実践ベストプラクティスガイド</h1>
          <p className={styles.subtitle}>
            Google Antigravity / Gemini CLI / Claude Code 対応・オープンスタンダード仕様
          </p>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statCardIcon}>📋</div>
              <div className={styles.statCardValue}>12</div>
              <div className={styles.statCardLabel}>主要セクション</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardIcon}>⚡</div>
              <div className={styles.statCardValue}>3段階</div>
              <div className={styles.statCardLabel}>段階的開示モデル</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardIcon}>📊</div>
              <div className={styles.statCardValue}>2図</div>
              <div className={styles.statCardLabel}>Mermaid図解</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardIcon}>📚</div>
              <div className={styles.statCardValue}>12</div>
              <div className={styles.statCardLabel}>参照ソース</div>
            </div>
          </div>
        </header>

        <section id="sec-1" className={styles.section}>
          <h2>1. そもそも Agent Skills / SKILL.md とは何か</h2>
          <p>
            <strong>Agent Skills</strong> は、AIコーディングエージェントに「特定タスクのやり方」を教えるための、軽量かつオープンなファイルフォーマットです。もともと Anthropic が Claude 向けに設計・公開した仕組みですが、現在は特定企業に閉じない<strong>オープンスタンダード</strong>として整備されており、公式サイト agentskills.io にはこの仕様のリファレンス実装が置かれています。
          </p>
          <p>
            一言で言えば、<strong>スキルとは「フォルダ」</strong>です。そのフォルダの中に必ず <code>SKILL.md</code> というファイルが1つ存在し、そこに以下の情報が書かれています。
          </p>
          <ul>
            <li>
              <strong>メタデータ</strong>(<code>name</code> と <code>description</code>): エージェントがこのスキルを「いつ使うべきか」を判断するための情報
            </li>
            <li><strong>本文の指示(Instructions)</strong>: 実際にタスクをどう進めるかの手順書</li>
            <li>
              <strong>(任意)付属リソース</strong>: <code>scripts/</code>(実行スクリプト)、<code>references/</code>(参考資料)、<code>assets/</code>(テンプレートや画像)などのサブフォルダ
            </li>
          </ul>
          <p>
            重要なのは、SKILL.md は「システムプロンプトの一部を丸ごと常駐させる」方式とは違い、<strong>必要なときだけオンデマンドで読み込まれる</strong>という点です。この仕組みにより、エージェントは数十〜数百個のスキルを持っていても、コンテキストウィンドウ(会話が使える情報量の上限)を圧迫せずに済みます。
          </p>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <div className={styles.calloutIcon}>💬</div>
            <div>
              <p>
                著名なソフトウェア技術者であり Django フレームワークの共同開発者でもある Simon Willison 氏は、自身のブログでこの仕組みについて「概念としては極めて単純」であり、トークン効率の良さの観点から Model Context Protocol(MCP)に匹敵する、あるいはそれ以上のインパクトを持つ可能性があると評しています。実際、氏が紹介した <code>obra/superpowers</code> のようなコミュニティ製スキル集は、この仕組みの実用性を示す代表例として知られています。
              </p>
            </div>
          </div>
          <p>
            Google はこの Agent Skills フォーマットをそのまま採用し、自社のエージェント開発プラットフォーム <strong>Google Antigravity</strong> の拡張機構として組み込みました。つまり、Anthropic 向けに書いた SKILL.md の知識は、ほぼそのまま Antigravity にも応用できます。これが本ガイドで「Antigravity 対応版」と銘打っている理由です。
          </p>
        </section>

        <section id="sec-2" className={styles.section}>
          <h2>2. なぜ重要なのか: プログレッシブ・ディスクロージャーという設計思想</h2>
          <p>
            SKILL.md の価値を理解する鍵は <strong>progressive disclosure(段階的開示)</strong> という考え方です。エージェントは以下の3段階でスキルの情報を読み込みます。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>段階</th>
                  <th>名称</th>
                  <th>読み込まれるタイミング</th>
                  <th>おおよそのトークンコスト</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Level 1</td>
                  <td>メタデータ</td>
                  <td>常に(会話開始時)</td>
                  <td>1スキルあたり約100トークン</td>
                  <td><code>name</code> と <code>description</code> のみ</td>
                </tr>
                <tr>
                  <td>Level 2</td>
                  <td>本文の指示</td>
                  <td>スキルが「関連あり」と判定された時</td>
                  <td>5,000トークン未満が目安</td>
                  <td>SKILL.md 本文全体</td>
                </tr>
                <tr>
                  <td>Level 3</td>
                  <td>付属リソース</td>
                  <td>本文が実際にそのファイルを参照した時</td>
                  <td>アクセスされるまで0</td>
                  <td>scripts / references / assets 配下のファイル</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            このおかげで、たとえば100個のスキルを用意していても、起動時のコストは「100個分の name + description」だけで済み、実際に使われるスキルの本文だけが会話に読み込まれます。逆に言えば、<strong>「description の質」がスキルの発見精度(=正しい場面で正しく起動するかどうか)を左右する最重要ポイント</strong>だということです。この点はステップ5-3で詳しく扱います。
          </p>
        </section>

        <section id="sec-3" className={styles.section}>
          <h2>3. Google Antigravity におけるスキルシステム</h2>
          <p>
            Google Antigravity は「エージェントが実際に行動できる開発プラットフォーム」として設計されており、公式ドキュメントでは Skills を「エージェントの能力をオンデマンドで拡張する仕組み」と定義しています。Antigravity 側の特徴を整理すると次のとおりです。
          </p>

          <h3>3-1. スキルの配置場所(スコープ)</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>配置パス</th>
                  <th>スコープ</th>
                  <th>主な用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>.agents/skills/&lt;skill-folder&gt;/</code></td>
                  <td>ワークスペース(プロジェクト)固有</td>
                  <td>チームのデプロイ手順、テスト規約など、そのリポジトリだけで使う知識</td>
                </tr>
                <tr>
                  <td><code>~/.gemini/config/skills/&lt;skill-folder&gt;/</code></td>
                  <td>グローバル(全プロジェクト共通)</td>
                  <td>個人的によく使うユーティリティや汎用ツール</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <div className={styles.calloutIcon}>⚠️</div>
            <div>
              <p>
                Antigravity は現在 <code>.agents/skills</code> をデフォルトとしていますが、旧パスである <code>.agent/skills</code>(単数形)も後方互換のためにサポートされています。新規に作る場合は複数形の <code>.agents/skills</code> を使うのが安全です。
              </p>
            </div>
          </div>

          <h3>3-2. Antigravity 独自のフロー</h3>
          <p>Antigravity の公式ドキュメントによれば、スキルは以下の3工程で処理されます。</p>
          <ol>
            <li>
              <strong>Discovery(発見)</strong>: 会話開始時に、利用可能な全スキルの name と description の一覧をエージェントが把握する
            </li>
            <li>
              <strong>Activation(発動)</strong>: タスクに関連すると判断したスキルについて、SKILL.md 本文全体を読み込む
            </li>
            <li><strong>Execution(実行)</strong>: 読み込んだ指示に従ってタスクを遂行する</li>
          </ol>
          <p>
            ユーザー側からスキル名を明示的に指定する必要はなく、エージェントが文脈から自動判断しますが、確実に使わせたい場合はスキル名をプロンプト内で名指しすることも可能です。
          </p>

          <h3>3-3. モデルに依存しないオープンフォーマットという強み</h3>
          <p>
            Antigravity のデフォルトモデルは Gemini 3 系列ですが、SKILL.md フォーマット自体はモデルに依存しません。同じ SKILL.md ファイルは、Claude Code、Cursor、Gemini CLI、GitHub Copilot、VS Code、OpenAI Codex など、agentskills.io のクライアント一覧に掲載されている数多くのエージェントツールでそのまま利用可能です。つまり、<strong>一度書けば複数のツールで使い回せる</strong>という移植性が、このフォーマットの大きな価値になっています。
          </p>
        </section>

        <section id="sec-4" className={styles.section}>
          <h2>4. SKILL.md の基本構造</h2>

          <h3>4-1. 最小構成</h3>
          <p>
            スキルフォルダに必須なのは <code>SKILL.md</code> ファイル1つだけです。付属リソースはすべて任意です。
          </p>
          <ul>
            <li><code>my-skill/SKILL.md</code> — 必須。メタデータと本文指示</li>
            <li>
              <code>my-skill/scripts/</code> — 任意。Python・Bash・Node.js などの実行スクリプト
            </li>
            <li><code>my-skill/references/</code> — 任意。詳細ドキュメントやAPIリファレンス</li>
            <li>
              <code>my-skill/assets/</code>(または <code>examples/</code>, <code>resources/</code>) — 任意。テンプレートや画像、参考実装
            </li>
          </ul>

          <h3>4-2. YAML frontmatter の必須フィールド</h3>
          <p>
            SKILL.md ファイルの冒頭には、<code>---</code> で囲まれた YAML frontmatter を記述します。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>フィールド</th>
                  <th>Antigravity での扱い</th>
                  <th>Claude Platform(Anthropic公式)での扱い</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>name</code></td>
                  <td>任意。省略時はフォルダ名がそのまま使われる</td>
                  <td>
                    必須。最大64文字、小文字英数字とハイフンのみ、<code>anthropic</code> や <code>claude</code> などの予約語は使用不可
                  </td>
                </tr>
                <tr>
                  <td><code>description</code></td>
                  <td>必須。何をするスキルで、いつ使うべきかを明記</td>
                  <td>必須。最大1,024文字、空文字不可、XMLタグ不可</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={`${styles.callout} ${styles.calloutSuccess}`}>
            <div className={styles.calloutIcon}>✅</div>
            <div>
              <p>
                <strong>実務上のポイント</strong>: Antigravity 単体では <code>name</code> は省略可能ですが、複数のツール間でスキルを使い回す(移植性を確保する)ことを前提にするなら、より厳格な Anthropic 側のルール(64文字以内・小文字とハイフンのみ・予約語禁止)に合わせて <code>name</code> を明示的に書いておくのが安全です。これにより、どちらの環境でも問題なく動作します。
              </p>
            </div>
          </div>

          <h3>4-3. 本文の基本テンプレート</h3>
          <div className={styles.codeLabel}>SKILL.md</div>
          <pre className={styles.codeBlock}><code>{`---
name: my-skill
description: 何をするスキルで、いつ使うべきかを明記する
---

# My Skill

## When to use this skill

- こういう場面で使う
- こういう条件に該当する場合に役立つ

## How to use it

タスクの進め方、規約、パターンをステップバイステップで記述する`}</code></pre>
        </section>

        <section id="sec-5" className={styles.section}>
          <h2>5. ステップバイステップ実装ガイド</h2>

          <h3><span className={styles.stepBadge}>1</span>配置場所を決める</h3>
          <p>
            まず、そのスキルが「特定のプロジェクトだけのもの」か「あらゆるプロジェクトで使う汎用的なもの」かを判断します。前者なら <code>.agents/skills/&lt;skill-folder&gt;/</code>、後者なら <code>~/.gemini/config/skills/&lt;skill-folder&gt;/</code> に置きます。判断に迷ったら、最初はワークスペース側に置き、複数プロジェクトで使い回したくなった時点でグローバル側へ移動するのが安全です。
          </p>

          <h3><span className={styles.stepBadge}>2</span>フォルダと SKILL.md を作成する</h3>
          <p>
            スキル名を決め、そのままフォルダ名にします。命名は <strong>動名詞形(gerund, 動詞+ing)</strong> または名詞句が推奨されており、例として <code>processing-pdfs</code>、<code>generating-unit-tests</code>、<code>reviewing-code</code> のような形が挙げられます。<code>helper</code> や <code>utils</code> のような曖昧な名前は、後から見返したときに何のスキルか分からなくなるため避けます。
          </p>

          <h3><span className={styles.stepBadge}>3</span>description を磨き上げる</h3>
          <p>description はスキル発見(discovery)の生命線です。以下のルールを守ります。</p>
          <ul>
            <li>
              <strong>三人称で書く</strong>: 「〜を処理する」「〜を生成する」という客観的な書き方にする。「私が〜します」「あなたは〜に使えます」のような一人称・二人称は、system prompt に注入された際に発見精度を下げる要因になるため避ける
            </li>
            <li><strong>「何をするか」と「いつ使うか」の両方を書く</strong>: 片方だけでは不十分</li>
            <li>
              <strong>トリガーとなるキーワードを具体的に含める</strong>: ユーザーが実際に使いそうな単語を想定する
            </li>
            <li>
              <strong>曖昧な表現を避ける</strong>: 「ドキュメントを助ける」「データを処理する」のような抽象的すぎる description は、他の類似スキルとの区別がつかず、正しく発動しない原因になる
            </li>
          </ul>
          <div className={styles.goodBad}>
            <div className={`${styles.gbCard} ${styles.gbGood}`}>
              <div className={styles.gbLabel}>✅ 良い例</div>
              <p>
                PDFファイルからテキストと表を抽出し、フォームへの入力や複数ファイルの結合を行う。PDF、フォーム、文書抽出に関する依頼で使用する
              </p>
            </div>
            <div className={`${styles.gbCard} ${styles.gbBad}`}>
              <div className={styles.gbLabel}>❌ 悪い例</div>
              <p>ドキュメントの処理を手伝います</p>
            </div>
          </div>
          <p>
            さらにコミュニティのベストプラクティスとして、<code>description</code> の中に「どういう場合には使わないか(Do not use)」を明記しておくと、似たスキル同士が競合して誤発動する事態を防げます。これは特にスキル数が増えてきたプロジェクトで効果を発揮します。
          </p>

          <h3><span className={styles.stepBadge}>4</span>本文(Instructions)を設計する</h3>
          <p>
            <strong>「エージェントはすでに賢い」という前提</strong>に立ち、当たり前の説明を省くことが最初のコツです。たとえば「PDFとは何か」「ライブラリの使い方一般」のような一般常識の解説は不要で、実際に使うコード片や手順だけを書けば十分です。
          </p>
          <p>本文設計では、以下の3つの分量ルールを意識します。</p>
          <ol>
            <li>
              <strong>SKILL.md 本文は500行以内に収める。</strong>それを超える情報は別ファイル(<code>references/xxx.md</code> など)に切り出し、本文からリンクする
            </li>
            <li>
              <strong>参照は SKILL.md から1階層だけにとどめる。</strong>SKILL.md → A.md → B.md のような多段参照は、エージェントが <code>head -100</code> のような部分読み込みで済ませてしまい、情報を取りこぼす原因になる。すべての参照ファイルは SKILL.md から直接リンクする
            </li>
            <li>
              <strong>100行を超える参照ファイルには目次を付ける。</strong>部分読み込みされた場合でも、ファイル全体にどんな情報があるかをエージェントが把握できるようにするため
            </li>
          </ol>
          <p>
            また、タスクの自由度(degrees of freedom)を意識して指示の書き方を変えることも重要です。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>自由度</th>
                  <th>使う場面</th>
                  <th>書き方</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>High freedom</td>
                  <td>複数の妥当な進め方がある、状況次第で判断が変わる</td>
                  <td>自然言語での大まかな方針とヒューリスティック</td>
                </tr>
                <tr>
                  <td>Medium freedom</td>
                  <td>ある程度決まったパターンがあるが、多少の変動を許容する</td>
                  <td>パラメータ付きのテンプレートや疑似コード</td>
                </tr>
                <tr>
                  <td>Low freedom</td>
                  <td>操作が壊れやすく、一連の手順を厳密に守る必要がある</td>
                  <td>具体的なスクリプトをそのまま実行させ、コマンドの変更を禁止する</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            これは「崖のある狭い橋(唯一の安全な進み方しかない)なら具体的な手すりを与え、何もない野原(どう進んでも成功する)なら大まかな方向だけ示して任せる」という例えでよく説明されます。
          </p>

          <h3><span className={styles.stepBadge}>5</span>スクリプト・リソースを追加する</h3>
          <p>
            複雑な処理や、間違えると致命的な処理(データベースの移行、フォーム一括更新など)には、エージェントに都度コードを書かせるのではなく、<strong>事前に用意したスクリプトを実行させる</strong>方が信頼性が高くなります。理由は次のとおりです。
          </p>
          <ul>
            <li>生成コードよりも動作が安定する</li>
            <li>
              スクリプトのコード自体はコンテキストに読み込まれず、実行結果(出力)だけが消費される
            </li>
            <li>毎回同じ挙動が保証される</li>
          </ul>
          <p>
            スクリプトを書く際は「動的に判断させず、エラーを解決してしまう(solve, don't defer)」設計が推奨されています。たとえばファイルが存在しない場合に単に例外を投げるのではなく、デフォルト値を作成して処理を継続する、といった具合です。また、タイムアウト秒数やリトライ回数のような設定値には、なぜその数値なのかという根拠をコメントで残します(いわゆる「マジックナンバー」を避ける)。
          </p>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <div className={styles.calloutIcon}>💡</div>
            <div>
              <p>
                Antigravity のコミュニティ実践では、スクリプトの中身を毎回読み込ませるのではなく「まず <code>--help</code> を実行させてから使わせる」という、スクリプトをブラックボックスとして扱うパターンも推奨されています。これにより、エージェントの注意がタスク本体に集中しやすくなります。
              </p>
            </div>
          </div>

          <h3><span className={styles.stepBadge}>6</span>セキュリティとガバナンスを組み込む</h3>
          <p>
            スキルは「指示とコードを通じてエージェントに新しい能力を与える」仕組みであるため、悪意あるスキルは意図しないツール呼び出しやコード実行を引き起こす可能性があります。Anthropic 公式ドキュメントでも次の点が強調されています。
          </p>
          <ul>
            <li><strong>信頼できる提供元(自作、または公式配布)のスキルのみを使う</strong></li>
            <li>
              SKILL.md 本文だけでなく、同梱されたスクリプトや画像などすべてのファイルを監査する
            </li>
            <li>
              外部URLからデータを取得するタイプのスキルは特にリスクが高い(取得したコンテンツに悪意ある指示が混入する可能性がある)
            </li>
            <li>
              機密データへのアクセス権を持つ本番環境にスキルを組み込む際は、ソフトウェアのインストールと同程度の慎重さで扱う
            </li>
          </ul>
          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <div className={styles.calloutIcon}>🔒</div>
            <div>
              <p>
                Antigravity 環境では、ターミナルコマンドの実行許可を <code>Settings → Security → Terminal Command Policy</code> から制御できます。ターミナル操作やインフラ変更を提案するスキルには、コミュニティの実践に倣って本文中に <strong>Safety セクション</strong> を設け、想定されるリスクと安全策を明記しておくと安心です。
              </p>
            </div>
          </div>

          <h3><span className={styles.stepBadge}>7</span>テストと反復</h3>
          <p>
            スキルは一度書いて終わりではなく、実際の利用を通じて磨き込みます。Anthropic が推奨する開発フローは、<strong>評価(evaluation)を先に作ってから文書化する</strong>という順序です。
          </p>
          <ol>
            <li>スキルなしで代表的なタスクをエージェントにやらせ、どこでつまずくかを観察する</li>
            <li>そのつまずきを再現する評価シナリオを3つ程度作る</li>
            <li>スキルなしでの性能をベースラインとして記録する</li>
            <li>ギャップを埋める最小限の指示だけを SKILL.md に書く</li>
            <li>評価を実行し、ベースラインと比較しながら改善を繰り返す</li>
          </ol>
          <p>
            また、<strong>1つのエージェントインスタンス(仮に「エージェントA」)にスキルの原案を書かせ、別の新しいインスタンス(「エージェントB」)にそのスキルを実際のタスクで試させる</strong>という二者間の反復パターンも有効です。エージェントBが情報を見つけられなかった箇所や、ルールを守れなかった箇所を観察し、その具体例をエージェントAに持ち帰って改善する、というサイクルを回します。
          </p>
          <p>
            最後に、複数のモデル(軽量モデル・バランス型モデル・高性能モデルなど)で動作確認することも欠かせません。高性能なモデル向けには過剰な説明が冗長になりがちで、逆に軽量モデル向けにはガイダンス不足になりがちなため、対象とするモデルすべてで挙動を確認します。
          </p>
        </section>

        <section id="sec-6" className={styles.section}>
          <h2>6. スキルのライフサイクル(フローチャート)</h2>
          <p>
            スキルが会話の中でどう扱われるかを、discovery → activation → execution の3段階で図示します。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MERMAID_LIFECYCLE} />
          </div>
        </section>

        <section id="sec-7" className={styles.section}>
          <h2>7. 「指示文 vs スクリプト」判断フローチャート</h2>
          <p>
            ステップ5-4で紹介した自由度(degrees of freedom)の考え方を、意思決定フローとして整理すると以下のようになります。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MERMAID_DECISION} />
          </div>
        </section>

        <section id="sec-8" className={styles.section}>
          <h2>8. Claude Skills と Antigravity Skills の違い(比較表)</h2>
          <p>
            同じ SKILL.md フォーマットを使っていても、プラットフォームごとに細かな実装差があります。移植性の高いスキルを書くうえで押さえておきたい違いを整理します。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>Claude(Anthropic公式)</th>
                  <th>Google Antigravity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>name</code> の必須性</td>
                  <td>必須(64文字以内、小文字+ハイフン、予約語禁止)</td>
                  <td>任意(省略時はフォルダ名を使用)</td>
                </tr>
                <tr>
                  <td><code>description</code> の必須性</td>
                  <td>必須(1,024文字以内)</td>
                  <td>必須</td>
                </tr>
                <tr>
                  <td>主な配置場所</td>
                  <td>
                    <code>~/.claude/skills/</code>(個人用)、<code>.claude/skills/</code>(プロジェクト用)
                  </td>
                  <td>
                    <code>~/.gemini/config/skills/&lt;skill-folder&gt;/</code>(グローバル)、<code>.agents/skills/&lt;skill-folder&gt;/</code>(ワークスペース)
                  </td>
                </tr>
                <tr>
                  <td>フォーマットの立ち位置</td>
                  <td>オリジナル策定元</td>
                  <td>オープンスタンダードを採用した実装の1つ</td>
                </tr>
                <tr>
                  <td>デフォルトの実行モデル</td>
                  <td>Claude(Opus / Sonnet / Haiku など)</td>
                  <td>Gemini 3系列(モデル非依存の設計)</td>
                </tr>
                <tr>
                  <td>実行環境</td>
                  <td>サンドボックス化されたコード実行コンテナ(製品により制約が異なる)</td>
                  <td>エージェントのローカル/リモート実行環境</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={`${styles.callout} ${styles.calloutSuccess}`}>
            <div className={styles.calloutIcon}>🎯</div>
            <div>
              <p>
                移植性を最優先するなら、両方の制約の「厳しい方」に合わせておくのが実務上もっとも安全です。具体的には、<code>name</code> は省略せずに明示し、Anthropic 側の文字数・命名規則をそのまま満たしておく、という方針になります。
              </p>
            </div>
          </div>
        </section>

        <section id="sec-9" className={styles.section}>
          <h2>9. よくあるアンチパターン</h2>
          <p>
            初学者がつまずきやすいポイントを、公式ドキュメントとコミュニティの知見からまとめます。
          </p>
          <ul className={styles.antiList}>
            <li>
              <span>❌</span>
              <span><strong>description が曖昧すぎる</strong>: 「データを処理します」のような description は、他の類似スキルと区別がつかず正しく発動しない</span>
            </li>
            <li>
              <span>❌</span>
              <span><strong>参照が深すぎる</strong>: SKILL.md → 中間ファイル → さらに別ファイル、という多段参照は情報の取りこぼしを招く</span>
            </li>
            <li>
              <span>❌</span>
              <span><strong>選択肢を提示しすぎる</strong>: 「ライブラリAでもBでもCでも使える」のように並べるのではなく、デフォルトの1つを明示し、例外条件だけ補足する</span>
            </li>
            <li>
              <span>❌</span>
              <span><strong>時間依存の情報を書く</strong>: 「2025年8月より前はこの方法、以降は別の方法」のような記述は将来的に陳腐化するため、「現行の方法」と「旧方式(折りたたみ表示)」という構成に分けておく</span>
            </li>
            <li>
              <span>❌</span>
              <span><strong>Windows形式のパス区切りを使う</strong>: <code>scripts\helper.py</code> のようなバックスラッシュ区切りはUnix系環境でエラーの原因になるため、常にスラッシュ区切り(<code>scripts/helper.py</code>)を使う</span>
            </li>
            <li>
              <span>❌</span>
              <span><strong>マジックナンバーを放置する</strong>: タイムアウトやリトライ回数などの設定値に根拠のコメントを付けない</span>
            </li>
            <li>
              <span>❌</span>
              <span><strong>未検証のまま信頼できないスキルを導入する</strong>: 出所不明のスキルは、SKILL.md本文だけでなく同梱スクリプトまで含めて監査してから使う</span>
            </li>
          </ul>
        </section>

        <section id="sec-10" className={styles.section}>
          <h2>10. 実践チェックリスト</h2>
          <p>公開・共有する前に、以下の項目を確認します。</p>
          <ul className={styles.checklist}>
            <li>
              <span>🔲</span>
              <span><code>description</code> は「何をするか」と「いつ使うか」の両方を含んでいる</span>
            </li>
            <li>
              <span>🔲</span>
              <span><code>description</code> は三人称で書かれている</span>
            </li>
            <li>
              <span>🔲</span>
              <span>SKILL.md 本文は500行以内に収まっている(超える場合は別ファイルに分離済み)</span>
            </li>
            <li>
              <span>🔲</span>
              <span>参照ファイルは SKILL.md から1階層以内でリンクされている</span>
            </li>
            <li>
              <span>🔲</span>
              <span>100行を超える参照ファイルには目次がある</span>
            </li>
            <li>
              <span>🔲</span>
              <span>時間依存の情報は「現行の方法」と「旧方式」に分けて整理されている</span>
            </li>
            <li>
              <span>🔲</span>
              <span>用語(API endpoint / field / extract など)の表記が本文全体で統一されている</span>
            </li>
            <li>
              <span>🔲</span>
              <span>スクリプトはエラーを解決する設計になっており、エージェント任せにしていない</span>
            </li>
            <li>
              <span>🔲</span>
              <span>設定値(タイムアウト・リトライ回数など)に根拠のコメントがある</span>
            </li>
            <li>
              <span>🔲</span>
              <span>パス区切りはすべてスラッシュ(<code>/</code>)である</span>
            </li>
            <li>
              <span>🔲</span>
              <span>ターミナル操作やインフラ変更を伴うスキルには Safety セクションがある</span>
            </li>
            <li>
              <span>🔲</span>
              <span>少なくとも3つの評価シナリオでテスト済みである</span>
            </li>
            <li>
              <span>🔲</span>
              <span>複数のモデル(軽量・標準・高性能)で動作確認済みである</span>
            </li>
            <li>
              <span>🔲</span>
              <span>移植性が必要な場合、<code>name</code> を明示し Anthropic 側の命名規則も満たしている</span>
            </li>
          </ul>
        </section>

        <section id="sec-11" className={styles.section}>
          <h2>11. まとめ</h2>
          <p>
            SKILL.md は「フォルダ1つで完結する、オープンでモデル非依存の知識パッケージ」です。設計の核心は progressive disclosure にあり、<code>description</code> の書き方ひとつでスキルの発見精度が大きく変わります。Google Antigravity はこのフォーマットをそのまま採用しているため、Anthropic 公式が積み上げてきたベストプラクティス(簡潔さ、自由度の使い分け、1階層参照、評価駆動の反復開発など)は、ほぼそのまま Antigravity でも通用します。逆に、Antigravity 固有の配置ルール(<code>.agents/skills/</code> とグローバルスコープの使い分け)やセキュリティ設定(Terminal Command Policy)は、Antigravity を使う開発者が個別に押さえておくべきポイントです。
          </p>
          <p>
            まずは小さく、単一の目的を持つスキルを1つ作り、実際のタスクで試しながら育てていくのが、遠回りのようで最も確実な近道です。
          </p>
        </section>

        <section id="sec-12" className={styles.section}>
          <h2>12. 参考文献・引用ソース</h2>
          <p>
            本ガイドは以下の一次情報(公式ドキュメント)および著名な開発者・コミュニティの発信を基に、2026年7月26日時点で確認できる情報として構成しています。
          </p>

          <div className={styles.sourceGroupTitle}>公式ドキュメント</div>
          <ul className={styles.sourceList}>
            <li>
              <span className={styles.sourceTitle}>Google Antigravity Docs — Skills</span>
              <a
                className={styles.sourceUrl}
                href="https://antigravity.google/docs/ide/skills"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://antigravity.google/docs/ide/skills
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>
                Anthropic Claude Platform Docs — Agent Skills Overview
              </span>
              <a
                className={styles.sourceUrl}
                href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>
                Anthropic Claude Platform Docs — Skill authoring best practices
              </span>
              <a
                className={styles.sourceUrl}
                href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>
                Anthropic Engineering Blog — Equipping agents for the real world with Agent Skills
              </span>
              <a
                className={styles.sourceUrl}
                href="https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>Agent Skills オープンスタンダード公式サイト</span>
              <a
                className={styles.sourceUrl}
                href="https://agentskills.io/home"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://agentskills.io/home
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>Anthropic 公式 Agent Skills リポジトリ(GitHub)</span>
              <a
                className={styles.sourceUrl}
                href="https://github.com/anthropics/skills"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/anthropics/skills
              </a>
            </li>
          </ul>

          <div className={styles.sourceGroupTitle}>Google Codelabs / Google Cloud コミュニティ</div>
          <ul className={styles.sourceList}>
            <li>
              <span className={styles.sourceTitle}>Google Codelabs — Authoring Google Antigravity Skills</span>
              <a
                className={styles.sourceUrl}
                href="https://codelabs.developers.google.com/getting-started-with-antigravity-skills"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://codelabs.developers.google.com/getting-started-with-antigravity-skills
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>
                Google Codelabs — Getting Started with Google Antigravity
              </span>
              <a
                className={styles.sourceUrl}
                href="https://codelabs.developers.google.com/getting-started-google-antigravity"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://codelabs.developers.google.com/getting-started-google-antigravity
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>
                Google Cloud Community(Medium)— How to Build Custom Skills in Google Antigravity: 5 Practical Examples
              </span>
              <a
                className={styles.sourceUrl}
                href="https://medium.com/google-cloud/tutorial-getting-started-with-antigravity-skills-864041811e0d"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://medium.com/google-cloud/tutorial-getting-started-with-antigravity-skills-864041811e0d
              </a>
            </li>
          </ul>

          <div className={styles.sourceGroupTitle}>著名な開発者・コミュニティの発信</div>
          <ul className={styles.sourceList}>
            <li>
              <span className={styles.sourceTitle}>
                Simon Willison(Django共同開発者)によるSkillsに関する一連の考察
              </span>
              <a
                className={styles.sourceUrl}
                href="https://simonwillison.net/tags/skills/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://simonwillison.net/tags/skills/
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>
                obra/superpowers — Skills作成のベストプラクティスをまとめたコミュニティリポジトリ(Simon Willisonのブログでも紹介)
              </span>
              <a
                className={styles.sourceUrl}
                href="https://github.com/obra/superpowers/blob/main/skills/writing-skills/anthropic-best-practices.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/obra/superpowers/blob/main/skills/writing-skills/anthropic-best-practices.md
              </a>
            </li>
            <li>
              <span className={styles.sourceTitle}>
                rmyndharis/antigravity-skills — Antigravity Skillsのコミュニティ製コレクションと実践的な運用ルール
              </span>
              <a
                className={styles.sourceUrl}
                href="https://github.com/rmyndharis/antigravity-skills"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/rmyndharis/antigravity-skills
              </a>
            </li>
          </ul>

          <div className={`${styles.callout} ${styles.calloutWarning}`} style={{ marginTop: "24px" }}>
            <div className={styles.calloutIcon}>⚠️</div>
            <div>
              <p>
                本ガイドの内容は2026年7月26日前後にウェブ検索で確認できた情報に基づいています。Google Antigravity・Claude Platform ともに機能追加や仕様変更が続いている領域のため、実装前には上記の公式ドキュメントで最新情報を確認することを推奨します。
              </p>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>
            SKILL.md 実践ベストプラクティスガイド(Google Antigravity 対応版) — 2026年7月26日時点の情報に基づき作成
          </p>
        </footer>
      </main>
    </div>
  );
}
