import styles from "./page.module.css";

export default function HarnessEngineeringGuide() {
  return (
    <div className={styles.wrapper}>
      {/*  ═══ HERO ═══  */}
      <header>
        <div className={styles.eyebrow}>OpenAI Harness Engineering · 2026 Edition</div>
        <h1>
          <span className={styles.t1}>ハーネスエンジニアリング</span>
          <span className={styles.t2}>完全ガイド</span>
        </h1>
        <p className={styles.heroSub}>
          AIエージェントの品質を自動・継続的に測定するための評価基盤を、
          <br />
          ゼロからステップバイステップで構築する実践的解説。
        </p>
        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <div className={styles.statV}>11</div>
            <div className={styles.statL}>チャプター</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statV}>3</div>
            <div className={styles.statL}>Eval パターン</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statV}>10</div>
            <div className={styles.statL}>BP 原則</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statV}>13</div>
            <div className={styles.statL}>参考ソース</div>
          </div>
        </div>
        <div className={styles.scrollCue}>
          <span>scroll</span>
          <div className={styles.scrollLine}></div>
        </div>
      </header>

      {/*  ═══ NAV ═══  */}
      <nav>
        <div className={styles.navInner}>
          <div className={styles.navLogo}>HARNESS GUIDE</div>
          <a href="#what">概要</a>
          <a href="#why">背景</a>
          <a href="#overview">全体像</a>
          <a href="#setup">セットアップ</a>
          <a href="#patterns">Eval パターン</a>
          <a href="#bp">ベストプラクティス</a>
          <a href="#agents">AGENTS.md 統合</a>
          <a href="#cicd">CI/CD</a>
          <a href="#advanced">上級テクニック</a>
          <a href="#pitfalls">落とし穴</a>
          <a href="#sources">参考文献</a>
        </div>
      </nav>

      {/*  ═══ MAIN ═══  */}
      <main>
        {/*  ────────────────────────────────  */}
        {/*  SECTION 1 — WHAT IS  */}
        {/*  ────────────────────────────────  */}
        <section id="what">
          <div className={styles.secLabel}>Chapter 01</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>1</div>
            <div>
              <h2 className={styles.secTitle}>ハーネスエンジニアリングとは何か？</h2>
              <div className={styles.secSub}>AI 評価基盤の概念・定義・位置づけ</div>
            </div>
          </div>

          <p className={styles.body}>
            <strong>ハーネスエンジニアリング（Harness Engineering）</strong>
            とは、AIモデル・エージェントの品質を
            <strong>体系的・自動的に評価するためのテスト基盤</strong>
            を設計・構築する工学的手法です。 "ハーネス"
            とは「被試験体を取り囲み、制御・計測する仕組み全体」を指します。LLMの時代において、これは
            <strong>Eval（Evaluation）フレームワーク</strong>
            と呼ばれる評価パイプラインとして具体化されます。
          </p>

          <h3 className={styles.subH}>従来のテストとの根本的な違い</h3>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>比較軸</th>
                  <th>従来のソフトウェアテスト</th>
                  <th>AI ハーネスエンジニアリング</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>出力の性質</td>
                  <td>入力が同じなら出力は常に同じ</td>
                  <td>確率的・非決定的（モデルごとに異なる）</td>
                </tr>
                <tr>
                  <td>判定方式</td>
                  <td>Pass / Fail の二値</td>
                  <td>スコア・グレードによる多段階評価</td>
                </tr>
                <tr>
                  <td>テスト手法</td>
                  <td>ユニットテスト・統合テスト</td>
                  <td>Eval セット・ベンチマーク・LLM-as-Judge</td>
                </tr>
                <tr>
                  <td>正解の定義</td>
                  <td>明確・一意</td>
                  <td>複数の正解あり・文脈依存</td>
                </tr>
                <tr>
                  <td>回帰テスト</td>
                  <td>コード変更時に実行</td>
                  <td>プロンプト変更・モデル更新時にも必要</td>
                </tr>
                <tr>
                  <td>実行環境</td>
                  <td>ローカル・高速</td>
                  <td>クラウド・API コスト・並列実行</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={styles.subH}>OpenAI が定義するハーネスエンジニアリングの3層構造</h3>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ ハーネスエンジニアリング サイクル</div>
            <div id="diag-0"></div>
          </div>

          <div className={styles.cardGrid3}>
            <div className={`${styles.mc} ${styles.mcOai}`}>
              <div className={`${styles.mcTag} ${styles.oai}`}>🎯 Layer 1 — 評価目標</div>
              <p>
                「何を評価するか」を定義する。精度・安全性・レイテンシ・コストなど、ビジネス目標と直結した指標を選ぶ。
              </p>
            </div>
            <div className={`${styles.mc} ${styles.mcBlue}`}>
              <div className={`${styles.mcTag} ${styles.blue}`}>🔬 Layer 2 — Eval セット</div>
              <p>
                「どうやって評価するか」を設計する。テストケース・正解データ・採点基準の3点セットを用意する。
              </p>
            </div>
            <div className={`${styles.mc} ${styles.mcPurp}`}>
              <div className={`${styles.mcTag} ${styles.purple}`}>⚙️ Layer 3 — インフラ</div>
              <p>
                「評価の仕組み」を実装する。自動実行・結果の記録・CI/CD
                統合・ダッシュボードで継続的に品質を見える化する。
              </p>
            </div>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 2 — WHY  */}
        {/*  ────────────────────────────────  */}
        <section id="why">
          <div className={styles.secLabel}>Chapter 02</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>2</div>
            <div>
              <h2 className={styles.secTitle}>なぜ必要なのか？</h2>
              <div className={styles.secSub}>LLM 特有の課題とハーネスなし開発のリスク</div>
            </div>
          </div>

          <h3 className={styles.subH}>LLM アプリケーション固有の問題</h3>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ LLM テスト課題マップ</div>
            <div id="diag-1"></div>
          </div>

          <h3 className={styles.subH}>ハーネスなし開発のリスク一覧</h3>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>リスク</th>
                  <th>発生確率</th>
                  <th>影響度</th>
                  <th>対策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>サイレント品質劣化（モデル更新時）</td>
                  <td>
                    <span className={`${styles.tag} ${styles.tRose}`}>高</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tRose}`}>高</span>
                  </td>
                  <td>自動 Eval CI/CD の構築</td>
                </tr>
                <tr>
                  <td>プロンプト変更による意図しない副作用</td>
                  <td>
                    <span className={`${styles.tag} ${styles.tRose}`}>高</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tAmb}`}>中</span>
                  </td>
                  <td>回帰テストスイート</td>
                </tr>
                <tr>
                  <td>エッジケースの見落とし</td>
                  <td>
                    <span className={`${styles.tag} ${styles.tAmb}`}>中</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tRose}`}>高</span>
                  </td>
                  <td>Eval セット多様化</td>
                </tr>
                <tr>
                  <td>本番環境でのユーザー体験劣化</td>
                  <td>
                    <span className={`${styles.tag} ${styles.tAmb}`}>中</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tRose}`}>高</span>
                  </td>
                  <td>本番ログからの Eval 生成</td>
                </tr>
                <tr>
                  <td>コスト爆発（無効 API 呼び出し）</td>
                  <td>
                    <span className={`${styles.tag} ${styles.tAmb}`}>中</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tAmb}`}>中</span>
                  </td>
                  <td>キャッシュ + ミニセット戦略</td>
                </tr>
                <tr>
                  <td>Fine-tuning 効果の検証不能</td>
                  <td>
                    <span className={`${styles.tag} ${styles.tBlue}`}>低</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tRose}`}>高</span>
                  </td>
                  <td>ゴールデンセットの固定管理</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 3 — OVERVIEW  */}
        {/*  ────────────────────────────────  */}
        <section id="overview">
          <div className={styles.secLabel}>Chapter 03</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>3</div>
            <div>
              <h2 className={styles.secTitle}>OpenAI Evals フレームワーク全体像</h2>
              <div className={styles.secSub}>
                コンポーネント構成と openai/evals ライブラリの役割
              </div>
            </div>
          </div>

          <p className={styles.body}>
            <strong>OpenAI Evals</strong> は、LLM
            の品質を評価するためのオープンソースフレームワークです（
            <code>github.com/openai/evals</code>）。 JSONL 形式のデータセット・YAML
            定義ファイル・Python Evaluator クラスの3要素で構成されています。
          </p>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ OpenAI Evals コンポーネント構成</div>
            <div id="diag-2"></div>
          </div>

          <h3 className={styles.subH}>Evaluator クラス一覧（組み込み）</h3>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>クラス</th>
                  <th>判定方式</th>
                  <th>適用場面</th>
                  <th>コスト</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Match</td>
                  <td>完全一致</td>
                  <td>数値・固定値・コード出力</td>
                  <td>
                    <span className={`${styles.tag} ${styles.tOai}`}>最低</span>
                  </td>
                </tr>
                <tr>
                  <td>Includes</td>
                  <td>部分一致</td>
                  <td>特定キーワードの有無</td>
                  <td>
                    <span className={`${styles.tag} ${styles.tOai}`}>最低</span>
                  </td>
                </tr>
                <tr>
                  <td>FuzzyMatch</td>
                  <td>近似一致</td>
                  <td>大文字小文字・スペース無視</td>
                  <td>
                    <span className={`${styles.tag} ${styles.tOai}`}>最低</span>
                  </td>
                </tr>
                <tr>
                  <td>ClosedQA</td>
                  <td>LLM 採点</td>
                  <td>自由記述・Yes/No 判定</td>
                  <td>
                    <span className={`${styles.tag} ${styles.tAmb}`}>中</span>
                  </td>
                </tr>
                <tr>
                  <td>Criteria</td>
                  <td>LLM ルーブリック</td>
                  <td>品質・スタイル・完全性</td>
                  <td>
                    <span className={`${styles.tag} ${styles.tAmb}`}>中</span>
                  </td>
                </tr>
                <tr>
                  <td>Custom Python</td>
                  <td>任意ロジック</td>
                  <td>コード実行・API 検証・複合評価</td>
                  <td>
                    <span className={`${styles.tag} ${styles.tBlue}`}>設計次第</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.ib} ${styles.iOai}`}>
            <span className={styles.ibIcon}>💡</span>
            <div>
              <strong>OpenAI Evals はオープンソースです。</strong>
              <code>github.com/openai/evals</code> でコードを確認でき、自作 Evaluator
              クラスをプルリクエストで貢献することも可能です。 公式ドキュメント:
              <code>github.com/openai/evals/blob/main/docs/build-eval.md</code>
            </div>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 4 — SETUP  */}
        {/*  ────────────────────────────────  */}
        <section id="setup">
          <div className={styles.secLabel}>Chapter 04</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>4</div>
            <div>
              <h2 className={styles.secTitle}>5ステップでゼロから始める</h2>
              <div className={styles.secSub}>インストールから初回 Eval 実行まで</div>
            </div>
          </div>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ セットアップ → 実行 → 改善サイクル</div>
            <div id="diag-3"></div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.stepFlow}>
            {/*  Step 0  */}
            <div className={styles.stepItem}>
              <div className={styles.stepLine}>
                <div className={styles.stepDot}>0</div>
                <div className={styles.stepConnector}></div>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>環境構築 — openai/evals をインストールする</div>
                <div className={styles.stepDesc}>
                  GitHub からリポジトリをクローンし、仮想環境に依存パッケージをインストールします。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeHdr}>
                    <div className={styles.codeDots}>
                      <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdG}`}></div>
                    </div>
                    <div className={styles.codeLang}>bash</div>
                  </div>
                  <pre>
                    <span className={styles.cm}># 1. リポジトリをクローン</span>
                    <span className={styles.fn}>git</span> clone https://github.com/openai/evals.git
                    <span className={styles.fn}>cd</span> evals
                    <span className={styles.cm}># 2. 仮想環境を作成（推奨）</span>
                    <span className={styles.fn}>python</span> -m venv .venv
                    <span className={styles.fn}>source</span> .venv/bin/activate{" "}
                    <span className={styles.cm}># Windows: .venv\Scripts\activate</span>
                    <span className={styles.cm}># 3. 依存パッケージをインストール</span>
                    <span className={styles.fn}>pip</span> install -e{" "}
                    <span className={styles.str}>".[dev]"</span>
                    <span className={styles.cm}># 4. API キーを設定</span>
                    <span className={styles.kw}>export</span>{" "}
                    <span className={styles.op}>OPENAI_API_KEY</span>=
                    <span className={styles.str}>"sk-..."</span>
                    <span className={styles.cm}># 5. 動作確認（サンプル Eval を実行）</span>
                    <span className={styles.fn}>oaieval</span> gpt-4o test-match --max_samples{" "}
                    <span className={styles.num}>10</span>
                  </pre>
                </div>
                <div className={`${styles.ib} ${styles.iBlue}`}>
                  <span className={styles.ibIcon}>ℹ️</span>
                  <div>
                    <code>pip install -e ".[dev]"</code> の<code>-e</code>
                    は「編集可能インストール」。ソースコードを変更しても再インストール不要になるため、カスタム
                    Evaluator 開発時に必須です。
                  </div>
                </div>
              </div>
            </div>

            {/*  Step 1  */}
            <div className={styles.stepItem}>
              <div className={styles.stepLine}>
                <div className={styles.stepDot}>1</div>
                <div className={styles.stepConnector}></div>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>
                  データセット作成 — JSONL 形式で 1行 = 1テストケース
                </div>
                <div className={styles.stepDesc}>
                  各行に <code>input</code>（会話履歴）と
                  <code>ideal</code>（期待する回答）を記述します。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeHdr}>
                    <div className={styles.codeDots}>
                      <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdG}`}></div>
                    </div>
                    <div className={styles.codeLang}>
                      jsonl — evals/registry/data/my_qa/samples.jsonl
                    </div>
                  </div>
                  <pre className={styles.wrapLines}>
                    <span className={styles.str}>
                      &#123;"input": [&#123;"role": "user", "content":
                      "日本の首都はどこですか？"&#125;], "ideal": "東京"&#125;
                    </span>
                    <span className={styles.str}>
                      &#123;"input": [&#123;"role": "user", "content":
                      "富士山の標高を教えてください"&#125;], "ideal": ["3776メートル", "3,776m",
                      "3776m"]&#125;
                    </span>
                    <span className={styles.str}>
                      &#123;"input": [&#123;"role": "system", "content":
                      "あなたはSQLの専門家です"&#125;, &#123;"role": "user", "content":
                      "ユーザー一覧を取得するSQLを書いてください"&#125;], "ideal": "SELECT * FROM
                      users"&#125;
                    </span>
                  </pre>
                </div>
                <div className={styles.tableWrap}>
                  <table>
                    <thead>
                      <tr>
                        <th>フィールド</th>
                        <th>型</th>
                        <th>説明</th>
                        <th>注意点</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>input</td>
                        <td>Array</td>
                        <td>role/content 形式の会話履歴</td>
                        <td>system プロンプトも含められる</td>
                      </tr>
                      <tr>
                        <td>ideal</td>
                        <td>String / Array</td>
                        <td>期待する回答（正解）</td>
                        <td>配列で複数の正解を指定可能</td>
                      </tr>
                      <tr>
                        <td>metadata</td>
                        <td>Object（任意）</td>
                        <td>カテゴリ・難易度などのタグ</td>
                        <td>分析時のフィルタリングに活用</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/*  Step 2  */}
            <div className={styles.stepItem}>
              <div className={styles.stepLine}>
                <div className={styles.stepDot}>2</div>
                <div className={styles.stepConnector}></div>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>
                  YAML 定義 — Evaluator クラスとデータセットを紐付ける
                </div>
                <div className={styles.stepDesc}>
                  <code>evals/registry/evals/</code> 配下に YAML ファイルを作成します。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeHdr}>
                    <div className={styles.codeDots}>
                      <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdG}`}></div>
                    </div>
                    <div className={styles.codeLang}>yaml — evals/registry/evals/my_qa.yaml</div>
                  </div>
                  <pre>
                    <span className={styles.cm}># Eval グループ定義（最上位）</span>
                    <span className={styles.op}>my_qa</span>
                    <span className={styles.kw}>:</span>
                    <span className={styles.fn}>id</span>
                    <span className={styles.kw}>:</span> my_qa.v1
                    <span className={styles.fn}>metrics</span>
                    <span className={styles.kw}>:</span> [accuracy]
                    <span className={styles.cm}># Eval バージョン定義</span>
                    <span className={styles.op}>my_qa.v1</span>
                    <span className={styles.kw}>:</span>
                    <span className={styles.fn}>class</span>
                    <span className={styles.kw}>:</span>{" "}
                    <span className={styles.str}>evals.elsuite.basic.match:Match</span>
                    <span className={styles.fn}>args</span>
                    <span className={styles.kw}>:</span>
                    <span className={styles.fn}>samples_jsonl</span>
                    <span className={styles.kw}>:</span> my_qa/samples.jsonl
                  </pre>
                </div>
              </div>
            </div>

            {/*  Step 3  */}
            <div className={styles.stepItem}>
              <div className={styles.stepLine}>
                <div className={styles.stepDot}>3</div>
                <div className={styles.stepConnector}></div>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Eval 実行 — oaieval CLI で評価を走らせる</div>
                <div className={styles.stepDesc}>
                  モデル名と Eval 名を指定するだけで評価が実行されます。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeHdr}>
                    <div className={styles.codeDots}>
                      <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdG}`}></div>
                    </div>
                    <div className={styles.codeLang}>bash</div>
                  </div>
                  <pre>
                    <span className={styles.cm}># 基本実行</span>
                    <span className={styles.fn}>oaieval</span> gpt-4o my_qa
                    <span className={styles.cm}># コスト節約: サンプル数を制限してテスト</span>
                    <span className={styles.fn}>oaieval</span> gpt-4o my_qa --max_samples{" "}
                    <span className={styles.num}>20</span>
                    <span className={styles.cm}># モデル比較: 結果ファイルを分けて保存</span>
                    <span className={styles.fn}>oaieval</span> gpt-4o-mini my_qa --record_path
                    results/mini.jsonl
                    <span className={styles.fn}>oaieval</span> gpt-4o my_qa --record_path
                    results/4o.jsonl
                    <span className={styles.cm}># 並列実行でスピードアップ（コスト注意）</span>
                    <span className={styles.fn}>oaieval</span> gpt-4o my_qa --num_threads{" "}
                    <span className={styles.num}>10</span>
                    <span className={styles.cm}># 結果を OpenAI Platform にアップロード</span>
                    <span className={styles.fn}>oaieval</span> gpt-4o my_qa --upload
                  </pre>
                </div>
              </div>
            </div>

            {/*  Step 4  */}
            <div className={styles.stepItem}>
              <div className={styles.stepLine}>
                <div className={styles.stepDot}>4</div>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>結果の確認 — results.jsonl を分析する</div>
                <div className={styles.stepDesc}>
                  各サンプルの採点結果が JSONL
                  形式で保存されます。集計スクリプトで合否を判定します。
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeHdr}>
                    <div className={styles.codeDots}>
                      <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdG}`}></div>
                    </div>
                    <div className={styles.codeLang}>jsonl — results.jsonl（出力サンプル）</div>
                  </div>
                  <pre className={styles.wrapLines}>
                    <span className={styles.str}>
                      &#123;"run_id": "abc123", "event_id": 0, "type": "match", "data":
                      &#123;"correct": true, "expected": "東京", "sampled": "東京"&#125;&#125;
                    </span>
                    <span className={styles.str}>
                      &#123;"run_id": "abc123", "event_id": 1, "type": "match", "data":
                      &#123;"correct": false, "expected": "3776メートル", "sampled":
                      "約3776m"&#125;&#125;
                    </span>
                  </pre>
                </div>
                <div className={styles.codeWrap}>
                  <div className={styles.codeHdr}>
                    <div className={styles.codeDots}>
                      <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                      <div className={`${styles.codeDot} ${styles.cdG}`}></div>
                    </div>
                    <div className={styles.codeLang}>python — 合否判定スクリプト</div>
                  </div>
                  <pre>
                    <span className={styles.kw}>import</span> json, sys
                    <span className={styles.kw}>def</span>{" "}
                    <span className={styles.fn}>check_threshold</span>(results_path:{" "}
                    <span className={styles.fn}>str</span>, threshold:{" "}
                    <span className={styles.fn}>float</span> ={" "}
                    <span className={styles.num}>0.85</span>): correct = total ={" "}
                    <span className={styles.num}>0</span>
                    <span className={styles.kw}>with</span> <span className={styles.fn}>open</span>
                    (results_path) <span className={styles.kw}>as</span> f:
                    <span className={styles.kw}>for</span> line{" "}
                    <span className={styles.kw}>in</span> f: ev = json.
                    <span className={styles.fn}>loads</span>(line)
                    <span className={styles.kw}>if</span> ev.get(
                    <span className={styles.str}>"type"</span>) =={" "}
                    <span className={styles.str}>"match"</span>: total +={" "}
                    <span className={styles.num}>1</span>
                    <span className={styles.kw}>if</span> ev[
                    <span className={styles.str}>"data"</span>][
                    <span className={styles.str}>"correct"</span>]: correct +={" "}
                    <span className={styles.num}>1</span>
                    accuracy = correct / total <span className={styles.kw}>if</span> total{" "}
                    <span className={styles.kw}>else</span> <span className={styles.num}>0</span>
                    <span className={styles.fn}>print</span>(
                    <span className={styles.str}>
                      f"Accuracy: &#123;accuracy:.2%&#125; (&#123;correct&#125;/&#123;total&#125;)"
                    </span>
                    ) sys.<span className={styles.fn}>exit</span>(
                    <span className={styles.num}>0</span> <span className={styles.kw}>if</span>{" "}
                    accuracy &gt;= threshold <span className={styles.kw}>else</span>{" "}
                    <span className={styles.num}>1</span>)
                    <span className={styles.fn}>check_threshold</span>(
                    <span className={styles.str}>"results/4o.jsonl"</span>, threshold=
                    <span className={styles.num}>0.85</span>)
                  </pre>
                </div>
              </div>
            </div>
          </div>
          {/*  /step-flow  */}
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 5 — PATTERNS  */}
        {/*  ────────────────────────────────  */}
        <section id="patterns">
          <div className={styles.secLabel}>Chapter 05</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>5</div>
            <div>
              <h2 className={styles.secTitle}>Eval の3大パターン</h2>
              <div className={styles.secSub}>
                String Match · Model Graded · Custom Python — 使い分けの判断木
              </div>
            </div>
          </div>

          <h3 className={styles.subH}>パターン選択フロー</h3>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ Eval パターン選択の判断木</div>
            <div id="diag-4"></div>
          </div>

          <h3 className={styles.subH}>パターン比較表</h3>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>パターン</th>
                  <th>精度</th>
                  <th>コスト</th>
                  <th>速度</th>
                  <th>適用場面</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>String Match</td>
                  <td>
                    <span className={`${styles.tag} ${styles.tAmb}`}>△ 固定正解のみ</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tOai}`}>◎ 最低</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tOai}`}>◎ 最速</span>
                  </td>
                  <td>固定値・数値・コード出力・True/False</td>
                </tr>
                <tr>
                  <td>Model Graded</td>
                  <td>
                    <span className={`${styles.tag} ${styles.tOai}`}>◎ 高精度</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tAmb}`}>△ 高め</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tAmb}`}>△ 低め</span>
                  </td>
                  <td>自由記述・要約・翻訳・説明品質</td>
                </tr>
                <tr>
                  <td>Human Eval</td>
                  <td>
                    <span className={`${styles.tag} ${styles.tOai}`}>◎◎ 最高</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tRose}`}>✗ 最高</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tRose}`}>✗ 最遅</span>
                  </td>
                  <td>ゴールデンデータセット構築・最終検証</td>
                </tr>
                <tr>
                  <td>Custom Python</td>
                  <td>
                    <span className={`${styles.tag} ${styles.tBlue}`}>設計次第</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tBlue}`}>設計次第</span>
                  </td>
                  <td>
                    <span className={`${styles.tag} ${styles.tBlue}`}>設計次第</span>
                  </td>
                  <td>コード実行・API 検証・複合評価</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.patternGrid}>
            <div className={`${styles.patCard} ${styles.pcOai}`}>
              <div className={styles.patNum}>01</div>
              <div className={styles.patIcon}>🎯</div>
              <div className={styles.patName}>String Match</div>
              <p className={styles.patDesc}>
                最もシンプル。出力が固定値に一致するかを検証。<strong>Match</strong>（完全）・
                <strong>Includes</strong>（部分）・<strong>FuzzyMatch</strong>
                （近似）の3種類がある。
              </p>
              <span className={`${styles.patBadge} ${styles.tOai}`}>最安・最速</span>
            </div>
            <div className={`${styles.patCard} ${styles.pcBlue}`}>
              <div className={styles.patNum}>02</div>
              <div className={styles.patIcon}>🤖</div>
              <div className={styles.patName}>Model Graded</div>
              <p className={styles.patDesc}>
                別の LLM（通常
                GPT-4o）が採点者として評価。自由記述など正解が一意でない場合に有効。採点プロンプトの設計が品質を左右する。
              </p>
              <span className={`${styles.patBadge} ${styles.tBlue}`}>LLM-as-Judge</span>
            </div>
            <div className={`${styles.patCard} ${styles.pcPurp}`}>
              <div className={styles.patNum}>03</div>
              <div className={styles.patIcon}>🔧</div>
              <div className={styles.patName}>Custom Python</div>
              <p className={styles.patDesc}>
                完全にカスタマイズした評価ロジックを Python で実装。コードの実行確認・外部 API
                の検証・複数条件の組み合わせなど複雑なケースに対応。
              </p>
              <span className={`${styles.patBadge} ${styles.tPurp}`}>最も柔軟</span>
            </div>
          </div>

          <h3 className={styles.subH}>パターン 2 — Model Graded の仕組み（シーケンス図）</h3>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ LLM-as-Judge シーケンス</div>
            <div id="diag-5"></div>
          </div>

          <h3 className={styles.subH}>パターン 2 — LLM-as-Judge 採点プロンプトテンプレート</h3>

          <div className={styles.codeWrap}>
            <div className={styles.codeHdr}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                <div className={`${styles.codeDot} ${styles.cdG}`}></div>
              </div>
              <div className={styles.codeLang}>
                python — 採点プロンプト（OpenAI 推奨フォーマット）
              </div>
            </div>
            <pre>
              <span className={styles.op}>GRADER_PROMPT</span> ={" "}
              <span className={styles.str}>
                """ あなたは厳格かつ公平な評価者です。以下の基準で回答を評価してください。 ##
                評価対象 **質問**: &#123;question&#125; **回答**: &#123;answer&#125; ## 評価基準
                &#123;criteria&#125; ## 採点ルール - `Y` : 基準を完全に満たしている - `N` :
                基準を満たしていない - `Unclear` : 判断が難しい場合（乱用禁止） ## 重要な指示 1.
                自分の知識ではなく「提示された情報のみ」で評価すること 2.
                部分的に正しくても基準を完全に満たさなければ N 3. 採点理由を 1 文で説明すること ##
                出力（JSON のみ） &#123;&#123;"grade": "Y/N/Unclear", "reason":
                "採点理由"&#125;&#125; """
              </span>
            </pre>
          </div>

          <div className={`${styles.ib} ${styles.iRose}`}>
            <span className={styles.ibIcon}>🔑</span>
            <div>
              <strong>採点モデルは被評価モデルと分けること。</strong>
              GPT-4o-mini を評価する場合は
              GPT-4o（上位モデル）を採点者にする。採点者が自分と同じ出力を高く評価する「採点者バイアス」を防ぐためです。
            </div>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 6 — BEST PRACTICES  */}
        {/*  ────────────────────────────────  */}
        <section id="bp">
          <div className={styles.secLabel}>Chapter 06</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>6</div>
            <div>
              <h2 className={styles.secTitle}>ハーネス設計のベストプラクティス</h2>
              <div className={styles.secSub}>データセット品質 10 原則 + 推奨ディレクトリ構成</div>
            </div>
          </div>

          <h3 className={styles.subH}>データセット品質の 10 原則</h3>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>原則</th>
                  <th>悪い例 ❌</th>
                  <th>良い例 ✅</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>多様性</td>
                  <td>同パターンの問題のみ</td>
                  <td>エッジケース・境界値を含む</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>代表性</td>
                  <td>開発者が作った問題のみ</td>
                  <td>実際のユーザーログから抽出</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>難易度分散</td>
                  <td>簡単な問題だけ</td>
                  <td>Easy / Medium / Hard を均等に</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>正解の明確化</td>
                  <td>「良い回答」</td>
                  <td>「100文字以内で箇条書き3点」</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>カテゴリバランス</td>
                  <td>特定カテゴリに偏る</td>
                  <td>カテゴリ比率を意図的に設計</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>汚染防止</td>
                  <td>訓練データと重複</td>
                  <td>独立したホールドアウトセット</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>バージョン管理</td>
                  <td>上書き保存</td>
                  <td>v1, v2 ... と分けて git 管理</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>サイズ適正化</td>
                  <td>1000件を毎回全実行</td>
                  <td>ミニ 20件 + フル 500件 で使い分け</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>ゴールデンセット</td>
                  <td>随時更新</td>
                  <td>固定した参照セットを保持</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>メタデータ付与</td>
                  <td>JSONL のみ</td>
                  <td>カテゴリ・難易度タグを追加</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={styles.subH}>推奨ディレクトリ構成</h3>

          <div className={styles.codeWrap}>
            <div className={styles.codeHdr}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                <div className={`${styles.codeDot} ${styles.cdG}`}></div>
              </div>
              <div className={styles.codeLang}>tree — プロジェクト構成（推奨）</div>
            </div>
            <pre>
              <span className={styles.hl}>my-ai-project/</span>
              ├── <span className={styles.op}>evals/</span>{" "}
              <span className={styles.cm}>← Eval ルートディレクトリ</span>│ ├── registry/ │ │ ├──
              data/ │ │ │ ├── <span className={styles.fn}>qa_basic/</span>{" "}
              <span className={styles.cm}>← カテゴリ別に分割</span>│ │ │ │ ├── train.jsonl{" "}
              <span className={styles.cm}>← 開発用（少量・変更可）</span>│ │ │ │ └── test.jsonl{" "}
              <span className={styles.cm}>← 本番評価用（固定・変更禁止）</span>│ │ │ ├──{" "}
              <span className={styles.fn}>code_gen/</span>│ │ │ │ └── samples.jsonl │ │ │ └──{" "}
              <span className={styles.rose}>safety/</span>{" "}
              <span className={styles.cm}>← セーフティ Eval は必ず独立</span>│ │ │ └── samples.jsonl
              │ │ └── evals/ │ │ ├── qa_basic.yaml │ │ ├── code_gen.yaml │ │ └── safety.yaml │ └──
              elsuite/custom/ │ └── my_custom_eval.py{" "}
              <span className={styles.cm}>← カスタム Evaluator</span>
              ├── scripts/ │ ├── run_evals.sh <span className={styles.cm}>← 実行スクリプト</span>│
              └── compare_models.py <span className={styles.cm}>← モデル比較スクリプト</span>
              ├── results/ <span className={styles.rose}>← .gitignore 推奨</span>
              ├── <span className={styles.op}>AGENTS.md</span>{" "}
              <span className={styles.cm}>← Codex 向け永続設定</span>
              └── <span className={styles.op}>TEST.md</span>{" "}
              <span className={styles.cm}>← 受け入れ基準チェックリスト</span>
            </pre>
          </div>

          <h3 className={styles.subH}>ベストプラクティス10則</h3>

          <div className={styles.bpGrid}>
            <div className={`${styles.bpCard} ${styles.bpOai}`}>
              <div className={styles.bpN}>01</div>
              <h4>テストコマンドを AGENTS.md に明示する</h4>
              <p>
                AGENTS.md はテストを自動実行しない。「ファイル変更後は必ず oaieval
                を実行すること」と明記することで Codex が自動的に Eval を走らせる。
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpBlue}`}>
              <div className={styles.bpN}>02</div>
              <h4>ゴールデンセットを絶対に更新しない</h4>
              <p>
                ゴールデンセットは参照基準。更新する場合は新バージョン (v2)
                として作成し、旧バージョンは残す。
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpPurp}`}>
              <div className={styles.bpN}>03</div>
              <h4>temperature=0 + seed を固定する</h4>
              <p>
                Eval 実行時は決定的出力のため temperature=0 と seed
                を固定。再現性のある結果が得られる。
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpAmb}`}>
              <div className={styles.bpN}>04</div>
              <h4>採点モデルは上位モデルを使う</h4>
              <p>被評価モデルより高性能なモデルを採点者に。採点者バイアスを最小化できる。</p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpRose}`}>
              <div className={styles.bpN}>05</div>
              <h4>セーフティ Eval は violation_rate=0</h4>
              <p>安全性に関する Eval だけは合格基準をゼロトレランス（違反率 0%）に設定する。</p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpCyan}`}>
              <div className={styles.bpN}>06</div>
              <h4>ミニセット戦略でコスト管理</h4>
              <p>
                PR 時は 20〜30件のミニセットで高速チェック。フルセットは main ブランチの PR
                前のみ実行。
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpOai}`}>
              <div className={styles.bpN}>07</div>
              <h4>本番ログからサンプルを自動生成</h4>
              <p>高評価ユーザー回答を Eval データセットに取り込む自動パイプラインを構築する。</p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpBlue}`}>
              <div className={styles.bpN}>08</div>
              <h4>難易度別に合格基準を分ける</h4>
              <p>Easy ≥ 0.95、Medium ≥ 0.85、Hard ≥ 0.70 のように難易度別に閾値を設定する。</p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpPurp}`}>
              <div className={styles.bpN}>09</div>
              <h4>Eval セットを公開しない</h4>
              <p>
                テストデータを公開するとプロンプトが最適化され、本当の性能が見えなくなる過学習を招く。
              </p>
            </div>
            <div className={`${styles.bpCard} ${styles.bpAmb}`}>
              <div className={styles.bpN}>10</div>
              <h4>複数の指標を組み合わせる</h4>
              <p>
                accuracy 一つだけ高くても意味がない。ROUGE、レイテンシ、コスト、人手評価を併用する。
              </p>
            </div>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 7 — AGENTS / TEST.md  */}
        {/*  ────────────────────────────────  */}
        <section id="agents">
          <div className={styles.secLabel}>Chapter 07</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>7</div>
            <div>
              <h2 className={styles.secTitle}>AGENTS.md / TEST.md とハーネスの統合</h2>
              <div className={styles.secSub}>
                Codex エージェントが自律的に Eval を実行する仕組み
              </div>
            </div>
          </div>

          <h3 className={styles.subH}>AGENTS.md — Eval コマンドを永続記録する</h3>

          <div className={styles.codeWrap}>
            <div className={styles.codeHdr}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                <div className={`${styles.codeDot} ${styles.cdG}`}></div>
              </div>
              <div className={styles.codeLang}>markdown — AGENTS.md（Eval セクションの記載例）</div>
            </div>
            <pre>
              <span className={styles.hl}>## Build & Test Commands</span>
              <span className={styles.op}>### AI Eval（ハーネス）</span>
              <span className={styles.cm}># ★ ファイルを変更したら必ず以下を実行すること</span>-
              ミニセット（開発中）: `oaieval gpt-4o-mini qa_basic --max_samples 20` -
              フルセット（PR前必須）:`oaieval gpt-4o qa_basic` - モデル比較: `python
              scripts/compare_models.py --models gpt-4o,gpt-4o-mini` - 合格基準: accuracy &gt;= 0.85
              <span className={styles.op}>### 注意事項</span>- Eval 実行には OPENAI_API_KEY
              環境変数が必要 - フルセットはコストが発生するため main ブランチ PR 時のみ実行 -
              results/ ディレクトリは .gitignore 済み
            </pre>
          </div>

          <h3 className={styles.subH}>TEST.md — 受け入れ基準を定義する</h3>

          <div className={styles.codeWrap}>
            <div className={styles.codeHdr}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                <div className={`${styles.codeDot} ${styles.cdG}`}></div>
              </div>
              <div className={styles.codeLang}>markdown — TEST.md（Eval 品質基準）</div>
            </div>
            <pre>
              <span className={styles.hl}># TEST.md — AI 品質基準チェックリスト</span>
              <span className={styles.op}>## Eval 基準</span>- [ ] [Eval] `qa_basic` eval の
              accuracy &gt;= 0.85 - [ ] [Eval] `code_gen` eval の pass_rate &gt;= 0.80 - [ ] [Eval]
              `safety` eval の violation_rate == 0.0（ゼロトレランス） - [ ] [Eval]
              新機能追加時は対応する eval サンプルを最低 10件追加
              <span className={styles.op}>## 回帰テスト</span>- [ ] [CI] 前バージョン比で accuracy
              が 2% 以上低下していない - [ ] [CI] レスポンスタイム p99 &lt; 3000ms
            </pre>
          </div>

          <h3 className={styles.subH}>Eval と開発フローの統合（全体シーケンス）</h3>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>
              ▸ Codex エージェント × Eval ハーネス 統合フロー
            </div>
            <div id="diag-6"></div>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 8 — CI/CD  */}
        {/*  ────────────────────────────────  */}
        <section id="cicd">
          <div className={styles.secLabel}>Chapter 08</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>8</div>
            <div>
              <h2 className={styles.secTitle}>CI/CD パイプラインへの組み込み</h2>
              <div className={styles.secSub}>GitHub Actions × Eval の自動化とコスト管理戦略</div>
            </div>
          </div>

          <h3 className={styles.subH}>コスト管理：段階的 Eval 実行戦略</h3>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ 実行タイミング別コスト管理戦略</div>
            <div id="diag-7"></div>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>タイミング</th>
                  <th>サンプル数</th>
                  <th>モデル</th>
                  <th>目安コスト</th>
                  <th>合格基準</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PR 作成時</td>
                  <td>20〜30件</td>
                  <td>gpt-4o-mini</td>
                  <td>~$0.01</td>
                  <td>≥ 0.80</td>
                </tr>
                <tr>
                  <td>main ブランチ PR</td>
                  <td>200〜500件</td>
                  <td>gpt-4o</td>
                  <td>~$0.30〜$0.80</td>
                  <td>≥ 0.85</td>
                </tr>
                <tr>
                  <td>毎日 cron</td>
                  <td>100件固定</td>
                  <td>gpt-4o</td>
                  <td>~$0.10</td>
                  <td>前日比 -2%以内</td>
                </tr>
                <tr>
                  <td>リリース前</td>
                  <td>全件</td>
                  <td>gpt-4o + human</td>
                  <td>$5〜$50</td>
                  <td>≥ 0.90</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={styles.subH}>GitHub Actions ワークフロー実装例</h3>

          <div className={styles.codeWrap}>
            <div className={styles.codeHdr}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                <div className={`${styles.codeDot} ${styles.cdG}`}></div>
              </div>
              <div className={styles.codeLang}>yaml — .github/workflows/eval.yml</div>
            </div>
            <pre>
              <span className={styles.op}>name:</span>{" "}
              <span className={styles.str}>AI Eval Pipeline</span>
              <span className={styles.op}>on:</span>
              <span className={styles.fn}>pull_request:</span>
              <span className={styles.fn}>branches:</span> [main]
              <span className={styles.fn}>paths:</span>-{" "}
              <span className={styles.str}>'prompts/**'</span>{" "}
              <span className={styles.cm}># プロンプト変更時</span>-{" "}
              <span className={styles.str}>'evals/**'</span>{" "}
              <span className={styles.cm}># Eval 定義変更時</span>-{" "}
              <span className={styles.str}>'src/ai/**'</span>{" "}
              <span className={styles.cm}># AI ロジック変更時</span>
              <span className={styles.op}>jobs:</span>
              <span className={styles.fn}>mini_eval:</span>
              <span className={styles.fn}>name:</span>{" "}
              <span className={styles.str}>ミニセット Eval（高速チェック）</span>
              <span className={styles.fn}>runs-on:</span> ubuntu-latest
              <span className={styles.fn}>steps:</span>- <span className={styles.kw}>uses:</span>{" "}
              actions/checkout@v4 - <span className={styles.kw}>name:</span>{" "}
              <span className={styles.str}>Python セットアップ</span>
              <span className={styles.kw}>uses:</span> actions/setup-python@v5
              <span className={styles.kw}>with:</span>
              <span className={styles.fn}>python-version:</span>{" "}
              <span className={styles.str}>'3.11'</span>- <span className={styles.kw}>name:</span>{" "}
              <span className={styles.str}>依存関係インストール</span>
              <span className={styles.kw}>run:</span>{" "}
              <span className={styles.str}>pip install -e "evals/[dev]"</span>-{" "}
              <span className={styles.kw}>name:</span>{" "}
              <span className={styles.str}>ミニセット Eval 実行</span>
              <span className={styles.fn}>env:</span>
              <span className={styles.fn}>OPENAI_API_KEY:</span>{" "}
              <span className={styles.str}>$&#123;&#123; secrets.OPENAI_API_KEY &#125;&#125;</span>
              <span className={styles.fn}>run:</span> | oaieval gpt-4o-mini qa_basic \ --max_samples{" "}
              <span className={styles.num}>30</span> \ --record_path results/mini_eval.jsonl -{" "}
              <span className={styles.kw}>name:</span>{" "}
              <span className={styles.str}>合格判定（0.80 以上）</span>
              <span className={styles.fn}>run:</span>{" "}
              <span className={styles.str}>
                python scripts/check_threshold.py --results results/mini_eval.jsonl --threshold 0.80
              </span>
              <span className={styles.fn}>full_eval:</span>
              <span className={styles.fn}>name:</span>{" "}
              <span className={styles.str}>フルセット Eval（マージ前）</span>
              <span className={styles.fn}>runs-on:</span> ubuntu-latest
              <span className={styles.hl}>needs:</span> mini_eval{" "}
              <span className={styles.cm}># ミニセット合格後のみ実行</span>
              <span className={styles.fn}>steps:</span>- <span className={styles.kw}>uses:</span>{" "}
              actions/checkout@v4 - <span className={styles.kw}>name:</span>{" "}
              <span className={styles.str}>フルセット Eval 実行</span>
              <span className={styles.fn}>env:</span>
              <span className={styles.fn}>OPENAI_API_KEY:</span>{" "}
              <span className={styles.str}>$&#123;&#123; secrets.OPENAI_API_KEY &#125;&#125;</span>
              <span className={styles.fn}>run:</span> | oaieval gpt-4o qa_basic \ --record_path
              results/full_eval.jsonl \ --num_threads <span className={styles.num}>10</span>-{" "}
              <span className={styles.kw}>name:</span>{" "}
              <span className={styles.str}>結果をアーティファクト保存</span>
              <span className={styles.kw}>uses:</span> actions/upload-artifact@v4
              <span className={styles.kw}>with:</span>
              <span className={styles.fn}>name:</span>{" "}
              <span className={styles.str}>eval-results</span>
              <span className={styles.fn}>path:</span> results/
            </pre>
          </div>

          <div className={`${styles.ib} ${styles.iWarn}`}>
            <span className={styles.ibIcon}>⚠️</span>
            <div>
              <strong>コスト暴走を防ぐ2つの安全策：</strong>
              (1) <code>paths:</code> フィルタで AI 関連ファイル変更時のみ Eval を実行。(2)
              <code>needs:</code>
              でミニセット合格後にのみフルセットを実行し、早期失敗でコストを節約します。
            </div>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 9 — ADVANCED  */}
        {/*  ────────────────────────────────  */}
        <section id="advanced">
          <div className={styles.secLabel}>Chapter 09</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>9</div>
            <div>
              <h2 className={styles.secTitle}>上級テクニック</h2>
              <div className={styles.secSub}>
                Eval Chain · 本番ログからの自動生成 · カスタム Evaluator
              </div>
            </div>
          </div>

          <h3 className={styles.subH}>Eval Chain — 段階的評価でコストを早期カット</h3>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ Eval チェーン フロー（ゲート条件付き）</div>
            <div id="diag-8"></div>
          </div>

          <h3 className={styles.subH}>本番ログからの Eval サンプル自動生成</h3>

          <div className={styles.codeWrap}>
            <div className={styles.codeHdr}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                <div className={`${styles.codeDot} ${styles.cdG}`}></div>
              </div>
              <div className={styles.codeLang}>python — scripts/generate_eval_from_logs.py</div>
            </div>
            <pre>
              <span className={styles.kw}>import</span> json, random
              <span className={styles.kw}>def</span>{" "}
              <span className={styles.fn}>extract_eval_samples</span>( log_file:{" "}
              <span className={styles.fn}>str</span>, output_jsonl:{" "}
              <span className={styles.fn}>str</span>, sample_rate:{" "}
              <span className={styles.fn}>float</span> = <span className={styles.num}>0.01</span>,{" "}
              <span className={styles.cm}># 本番ログの 1% をサンプリング</span>
              min_quality: <span className={styles.fn}>float</span> ={" "}
              <span className={styles.num}>4.5</span>,{" "}
              <span className={styles.cm}># ユーザー評価 4.5 以上のみ</span>
              ):
              <span className={styles.str}>
                """ 高評価ユーザー回答を本番ログから抽出し、 Eval データセットを自動生成する。 """
              </span>
              samples = []
              <span className={styles.kw}>with</span> <span className={styles.fn}>open</span>
              (log_file) <span className={styles.kw}>as</span> f:
              <span className={styles.kw}>for</span> line <span className={styles.kw}>in</span> f:
              log = json.<span className={styles.fn}>loads</span>(line)
              <span className={styles.cm}># 品質フィルタリング</span>
              <span className={styles.kw}>if</span> log.<span className={styles.fn}>get</span>(
              <span className={styles.str}>"user_rating"</span>,{" "}
              <span className={styles.num}>0</span>) &lt; min_quality:
              <span className={styles.kw}>continue</span>
              <span className={styles.kw}>if</span> random.<span className={styles.fn}>random</span>
              () &gt; sample_rate:
              <span className={styles.kw}>continue</span>
              <span className={styles.cm}># Eval 形式に変換</span>
              samples.<span className={styles.fn}>append</span>(&#123;
              <span className={styles.str}>"input"</span>: log[
              <span className={styles.str}>"messages"</span>],
              <span className={styles.str}>"ideal"</span>: log[
              <span className={styles.str}>"response"</span>],{" "}
              <span className={styles.cm}># 高評価回答を正解として使用</span>
              <span className={styles.str}>"metadata"</span>: &#123;
              <span className={styles.str}>"source"</span>:{" "}
              <span className={styles.str}>"production_log"</span>,
              <span className={styles.str}>"date"</span>: log[
              <span className={styles.str}>"timestamp"</span>],
              <span className={styles.str}>"rating"</span>: log[
              <span className={styles.str}>"user_rating"</span>], &#125; &#125;)
              <span className={styles.cm}># JSONL として保存</span>
              <span className={styles.kw}>with</span> <span className={styles.fn}>open</span>
              (output_jsonl, <span className={styles.str}>"w"</span>){" "}
              <span className={styles.kw}>as</span> f:
              <span className={styles.kw}>for</span> s <span className={styles.kw}>in</span>{" "}
              samples: f.<span className={styles.fn}>write</span>(json.
              <span className={styles.fn}>dumps</span>(s, ensure_ascii=
              <span className={styles.kw}>False</span>) + <span className={styles.str}>"\n"</span>)
              <span className={styles.fn}>print</span>(
              <span className={styles.str}>f"生成サンプル数: &#123;len(samples)&#125;"</span>)
              <span className={styles.kw}>return</span> samples
            </pre>
          </div>

          <h3 className={styles.subH}>カスタム Python Evaluator の実装例</h3>

          <div className={styles.codeWrap}>
            <div className={styles.codeHdr}>
              <div className={styles.codeDots}>
                <div className={`${styles.codeDot} ${styles.cdR}`}></div>
                <div className={`${styles.codeDot} ${styles.cdY}`}></div>
                <div className={`${styles.codeDot} ${styles.cdG}`}></div>
              </div>
              <div className={styles.codeLang}>python — evals/elsuite/custom/code_exec_eval.py</div>
            </div>
            <pre>
              <span className={styles.kw}>import</span> evals
              <span className={styles.kw}>import</span> evals.metrics
              <span className={styles.kw}>from</span> evals.api{" "}
              <span className={styles.kw}>import</span> CompletionFn
              <span className={styles.kw}>from</span> evals.record{" "}
              <span className={styles.kw}>import</span> RecorderBase
              <span className={styles.kw}>class</span>{" "}
              <span className={styles.fn}>CodeExecutionEval</span>(evals.Eval):
              <span className={styles.str}>
                """生成コードが実際に実行可能かを検証する Evaluator"""
              </span>
              <span className={styles.kw}>def</span> <span className={styles.fn}>__init__</span>(
              self, completion_fns: list[CompletionFn], samples_jsonl:{" "}
              <span className={styles.fn}>str</span>, *args, **kwargs ):
              <span className={styles.fn}>super</span>().<span className={styles.fn}>__init__</span>
              (completion_fns, *args, **kwargs) self.samples_jsonl = samples_jsonl
              <span className={styles.kw}>def</span> <span className={styles.fn}>eval_sample</span>
              (self, sample, rng):
              <span className={styles.cm}># 1. モデル呼び出し（temperature=0 で決定的出力）</span>
              result = self.completion_fn( prompt=sample[<span className={styles.str}>"input"</span>
              ], temperature=<span className={styles.num}>0</span>, max_tokens=
              <span className={styles.num}>500</span>, ) code = result.
              <span className={styles.fn}>get_completions</span>()[
              <span className={styles.num}>0</span>]
              <span className={styles.cm}># 2. カスタム採点: コードが実行可能か確認</span>
              <span className={styles.kw}>try</span>:<span className={styles.fn}>exec</span>(
              <span className={styles.fn}>compile</span>(code,{" "}
              <span className={styles.str}>"&lt;string&gt;"</span>,{" "}
              <span className={styles.str}>"exec"</span>), &#123;&#125;) correct ={" "}
              <span className={styles.kw}>True</span>
              <span className={styles.kw}>except</span> Exception{" "}
              <span className={styles.kw}>as</span> e: correct ={" "}
              <span className={styles.kw}>False</span>
              <span className={styles.cm}># 3. 結果を記録</span>
              evals.<span className={styles.fn}>record_and_check_match</span>( prompt=sample[
              <span className={styles.str}>"input"</span>], sampled=code, expected=
              <span className={styles.kw}>None</span>,{" "}
              <span className={styles.cm}># 実行可否で判定するため ideal は不使用</span>)
              <span className={styles.kw}>return</span> correct
              <span className={styles.kw}>def</span> <span className={styles.fn}>run</span>(self,
              recorder: RecorderBase): self.<span className={styles.fn}>eval_all_samples</span>
              (recorder, self.<span className={styles.fn}>get_samples</span>()) events = recorder.
              <span className={styles.fn}>get_events</span>(
              <span className={styles.str}>"match"</span>)<span className={styles.kw}>return</span>{" "}
              &#123;<span className={styles.str}>"pass_rate"</span>: evals.metrics.
              <span className={styles.fn}>get_accuracy</span>(events)&#125;
            </pre>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 10 — PITFALLS  */}
        {/*  ────────────────────────────────  */}
        <section id="pitfalls">
          <div className={styles.secLabel}>Chapter 10</div>
          <div className={styles.secHeader}>
            <div className={styles.secNum}>10</div>
            <div>
              <h2 className={styles.secTitle}>よくある落とし穴と対策</h2>
              <div className={styles.secSub}>Eval アンチパターン7選 + デバッグフロー</div>
            </div>
          </div>

          <h3 className={styles.subH}>Eval アンチパターン一覧</h3>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>アンチパターン</th>
                  <th>症状</th>
                  <th>対策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>テスト汚染</td>
                  <td>スコアは高いのに本番品質が低い</td>
                  <td>訓練データと Eval データを厳密に分離</td>
                </tr>
                <tr>
                  <td>メトリクス固執</td>
                  <td>accuracy は高いが使いにくい</td>
                  <td>複数指標（F1/ROUGE/レイテンシ）を組み合わせる</td>
                </tr>
                <tr>
                  <td>採点者バイアス</td>
                  <td>GPT-4o が自分と似た回答を高評価</td>
                  <td>採点モデルと被評価モデルを分離する</td>
                </tr>
                <tr>
                  <td>ゴールドセット陳腐化</td>
                  <td>半年前の正解が今も有効とは限らない</td>
                  <td>四半期ごとにゴールドセットを見直す</td>
                </tr>
                <tr>
                  <td>コスト超過</td>
                  <td>Eval に月数万円かかる</td>
                  <td>ミニセット戦略 + gpt-4o-mini の活用</td>
                </tr>
                <tr>
                  <td>非再現性</td>
                  <td>同じ Eval を走らせても毎回結果が違う</td>
                  <td>temperature=0 + seed パラメータを固定</td>
                </tr>
                <tr>
                  <td>過学習 Eval</td>
                  <td>Eval スコアだけ最適化してしまう</td>
                  <td>ホールドアウトセットを非公開にする</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={styles.subH}>スコアが低い時のデバッグフロー</h3>

          <div className={styles.mermaidWrap}>
            <div className={styles.mermaidLabel}>▸ Eval スコア低下 — 原因特定フローチャート</div>
            <div id="diag-9"></div>
          </div>

          <h3 className={styles.subH}>ハーネスエンジニアリング成熟度モデル</h3>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>レベル</th>
                  <th>名称</th>
                  <th>特徴</th>
                  <th>次のステップ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lv.0</td>
                  <td>未整備</td>
                  <td>手動テストのみ / 評価の仕組みなし</td>
                  <td>最小 Eval セットを 20件作成する</td>
                </tr>
                <tr>
                  <td>Lv.1</td>
                  <td>基礎</td>
                  <td>String Match Eval がある / 手動実行</td>
                  <td>CI/CD に Eval を組み込む</td>
                </tr>
                <tr>
                  <td>Lv.2</td>
                  <td>自動化</td>
                  <td>CI で自動実行 / 合格基準がある</td>
                  <td>LLM-as-Judge パターンを追加する</td>
                </tr>
                <tr>
                  <td>Lv.3</td>
                  <td>高度化</td>
                  <td>本番ログからのフィードバックループがある</td>
                  <td>Eval Chain と回帰テストを実装する</td>
                </tr>
                <tr>
                  <td>Lv.4</td>
                  <td>最適化</td>
                  <td>コスト・精度・速度のトレードオフが最適化</td>
                  <td>Fine-tuning サイクルと Eval を連携</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/*  ────────────────────────────────  */}
        {/*  SECTION 11 — SOURCES  */}
        {/*  ────────────────────────────────  */}
        <section id="sources">
          <div className={styles.secLabel}>Chapter 11</div>
          <div className={styles.secHeader}>
            <div
              className={styles.secNum}
              style={{ background: "linear-gradient(135deg, #334155, #5a6e8c)" }}
            >
              📚
            </div>
            <div>
              <h2 className={styles.secTitle}>参考ソース一覧</h2>
              <div className={styles.secSub}>公式ドキュメント · ブログ · コミュニティリソース</div>
            </div>
          </div>

          <div className={styles.srcList}>
            <a
              href="https://github.com/openai/evals"
              target="_blank"
              className={styles.srcItem}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>🐙</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>openai/evals — GitHub（公式リポジトリ）</div>
                <div className={styles.srcUrl}>https://github.com/openai/evals</div>
              </div>
              <span className={`${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={styles.srcArr}>↗</span>
            </a>
            <a
              href="https://github.com/openai/evals/blob/main/README.md"
              target="_blank"
              className={styles.srcItem}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>📖</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>Evals README — セットアップ・CLI リファレンス</div>
                <div className={styles.srcUrl}>
                  https://github.com/openai/evals/blob/main/README.md
                </div>
              </div>
              <span className={`${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={styles.srcArr}>↗</span>
            </a>
            <a
              href="https://github.com/openai/evals/blob/main/docs/build-eval.md"
              target="_blank"
              className={styles.srcItem}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>🔧</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>
                  How to Build an Eval — カスタム Eval 作成ガイド
                </div>
                <div className={styles.srcUrl}>
                  https://github.com/openai/evals/blob/main/docs/build-eval.md
                </div>
              </div>
              <span className={`${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={styles.srcArr}>↗</span>
            </a>
            <a
              href="https://github.com/openai/evals/blob/main/docs/eval-templates.md"
              target="_blank"
              className={styles.srcItem}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>📋</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>
                  Eval Templates — 組み込み Evaluator クラス一覧
                </div>
                <div className={styles.srcUrl}>
                  https://github.com/openai/evals/blob/main/docs/eval-templates.md
                </div>
              </div>
              <span className={`${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={styles.srcArr}>↗</span>
            </a>
            <a
              href="https://platform.openai.com/docs/guides/evals"
              target="_blank"
              className={styles.srcItem}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>🖥️</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>
                  OpenAI Platform — Evals ガイド（Dashboard 統合）
                </div>
                <div className={styles.srcUrl}>https://platform.openai.com/docs/guides/evals</div>
              </div>
              <span className={`${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={styles.srcArr}>↗</span>
            </a>
            <a
              href="https://cookbook.openai.com/examples/evaluation/how_to_eval_abstractive_summarization"
              target="_blank"
              className={styles.srcItem}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>🍳</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>OpenAI Cookbook — LLM-as-Judge パターン実装例</div>
                <div className={styles.srcUrl}>
                  https://cookbook.openai.com/examples/evaluation/how_to_eval_abstractive_summarization
                </div>
              </div>
              <span className={`${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={styles.srcArr}>↗</span>
            </a>
            <a
              href="https://platform.openai.com/docs/guides/agents"
              target="_blank"
              className={styles.srcItem}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>🤖</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>
                  OpenAI Agents SDK — エージェント開発とハーネス統合
                </div>
                <div className={styles.srcUrl}>https://platform.openai.com/docs/guides/agents</div>
              </div>
              <span className={`${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={styles.srcArr}>↗</span>
            </a>
            <a
              href="https://openai.com/research/evals"
              target="_blank"
              className={styles.srcItem}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>🔬</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>
                  Introducing Evals — Evals フレームワーク発表・設計思想
                </div>
                <div className={styles.srcUrl}>https://openai.com/research/evals</div>
              </div>
              <span className={`${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={styles.srcArr}>↗</span>
            </a>
            <a
              href="https://developers.openai.com/codex/learn/best-practices"
              target="_blank"
              className={styles.srcItem}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>⚡</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>
                  Codex ベストプラクティス — AGENTS.md / TEST.md との統合
                </div>
                <div className={styles.srcUrl}>
                  https://developers.openai.com/codex/learn/best-practices
                </div>
              </div>
              <span className={`${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={styles.srcArr}>↗</span>
            </a>
            <a
              href="https://hamel.dev/blog/posts/evals/"
              target="_blank"
              className={styles.srcItem}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>📝</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>Your AI Product Needs Evals — Hamel Husain</div>
                <div className={styles.srcUrl}>https://hamel.dev/blog/posts/evals/</div>
              </div>
              <span className={`${styles.srcCat} ${styles.scComm}`}>コミュニティ</span>
              <span className={styles.srcArr}>↗</span>
            </a>
            <a
              href="https://eugeneyan.com/writing/llm-evaluations/"
              target="_blank"
              className={styles.srcItem}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>📊</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>
                  LLM Evaluations — Eugene Yan（評価指標の選び方）
                </div>
                <div className={styles.srcUrl}>https://eugeneyan.com/writing/llm-evaluations/</div>
              </div>
              <span className={`${styles.srcCat} ${styles.scComm}`}>コミュニティ</span>
              <span className={styles.srcArr}>↗</span>
            </a>
            <a
              href="https://github.com/openai/evals/blob/main/docs/custom-eval.md"
              target="_blank"
              className={styles.srcItem}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>🛠️</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>
                  Custom Eval Documentation — Python Evaluator 実装リファレンス
                </div>
                <div className={styles.srcUrl}>
                  https://github.com/openai/evals/blob/main/docs/custom-eval.md
                </div>
              </div>
              <span className={`${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={styles.srcArr}>↗</span>
            </a>
            <a
              href="https://openai.com/safety"
              target="_blank"
              className={styles.srcItem}
              rel="noopener noreferrer"
            >
              <div className={styles.srcIcon}>🛡️</div>
              <div className={styles.srcInfo}>
                <div className={styles.srcTitle}>OpenAI Safety — セーフティ Eval の考え方</div>
                <div className={styles.srcUrl}>https://openai.com/safety</div>
              </div>
              <span className={`${styles.srcCat} ${styles.scOai}`}>公式</span>
              <span className={styles.srcArr}>↗</span>
            </a>
          </div>
        </section>
        {/*  /section sources  */}
      </main>

      {/*  ═══ FOOTER ═══  */}
      <footer>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          <div
            style={{
              fontSize: "13px",
              color: "var(--text2)",
              marginBottom: "8px",
              fontFamily: "var(--disp)",
              fontWeight: "700",
            }}
          >
            OpenAI ハーネスエンジニアリング 完全ガイド 2026
          </div>
          <div>
            最終更新: 2026年5月 ｜ 情報は記載時点のものです。最新情報は
            <a
              href="https://platform.openai.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--oai)", textDecoration: "none" }}
            >
              platform.openai.com/docs
            </a>
            を参照してください。
          </div>
        </div>
      </footer>
    </div>
  );
}
