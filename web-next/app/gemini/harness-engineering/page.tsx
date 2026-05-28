import type { Metadata } from "next";
import styles from "./page.module.css";
import MermaidDiagram from "@/components/docs/MermaidDiagram";

export const metadata: Metadata = {
  title: "Google ハーネスエンジニアリング 完全ガイド",
  description: "Googleが実践するテストハーネス設計の技術とベストプラクティスを解説する完全ガイドです。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const TOC_ITEMS = [
  { id: "s1", label: "01. ハーネスエンジニアリングとは何か" },
  { id: "s2", label: "02. Googleのテスト哲学 — テストピラミッド" },
  { id: "s3", label: "03. テストハーネスを構成する5つの要素" },
  { id: "s4", label: "04. テストダブル — 替え玉の4種類" },
  { id: "s5", label: "05. ハーミティックテスト — 孤立した清潔なテスト" },
  { id: "s6", label: "06. ステップバイステップ実装ガイド" },
  { id: "s7", label: "07. フレイキーテスト対策" },
  { id: "s8", label: "08. CIパイプラインへの組み込み" },
  { id: "s9", label: "09. AIエージェント評価ハーネス" },
  { id: "s10", label: "10. ベストプラクティス10則" },
  { id: "s11", label: "11. 参考ソース一覧" },
] as const;

export default function GeminiHarnessEngineeringPage() {
  return (
    <main className={styles.wrap}>
      <header>
        <h1>Google ハーネスエンジニアリング 完全ガイド</h1>
      </header>

      <nav className={styles.toc} aria-label="目次">
        <div className={styles.tocTitle}>目次</div>
        <ol>
          {TOC_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <section id="s1" className={styles.sec}>
        <div className={styles.secNo}>Section 01</div>
        <h2 className={styles.secTitle}>
          <span className={styles.n}>01.</span>ハーネスエンジニアリングとは何か
        </h2>

        <p>
          <strong>テストハーネス</strong>（Test Harness）とは、テスト対象のコードを「安全かつ再現可能な環境」で動かすための<strong>足場（スキャフォールディング）</strong>のことです。
        </p>

        <div className={`${styles.callout} ${styles.cNote}`}>
          <span className={styles.ci}>🚗</span>
          <div>
            <strong>日常の例え話 — クラッシュテスト</strong>
            <br />
            車の安全試験を想像してください。ダミー人形・センサー・高速カメラ・制御された壁面——これらすべてが「ハーネス（試験用足場）」です。
            ハーネスがなければ「何が何に当たってどんな力がかかったか」を数値で再現できません。ソフトウェアのテストも同じです。
          </div>
        </div>

        <h3>なぜ Google がハーネスエンジニアリングを重視するのか</h3>
        <p>
          Googleは1日に<strong>数億行のコード変更</strong>と<strong>数十億件のテスト</strong>を実行します。この規模で「テストが適当」だと以下の問題が発生します。
        </p>

        <div className={styles.tblWrap}>
          <table>
            <thead>
              <tr>
                <th>問題</th>
                <th>具体例</th>
                <th>ハーネスがない場合のコスト</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>再現不能なバグ</code>
                </td>
                <td>本番にのみ発生する環境依存バグ</td>
                <td>調査に数日〜数週間</td>
              </tr>
              <tr>
                <td>
                  <code>フレイキーテスト</code>
                </td>
                <td>同じコードで50%の確率で失敗</td>
                <td>CI信頼性が崩壊</td>
              </tr>
              <tr>
                <td>
                  <code>遅すぎるCI</code>
                </td>
                <td>E2Eテストが1回30分</td>
                <td>開発速度が1/10以下</td>
              </tr>
              <tr>
                <td>
                  <code>テスト間依存</code>
                </td>
                <td>テストAを実行するとテストBが壊れる</td>
                <td>夜間ビルドが常に赤</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>ハーネスエンジニアリングの全体像</h3>

        <div className={styles.mermaidWrap}>
          <div className={styles.mermaidLabel}>テストハーネスの全体アーキテクチャ</div>
          <MermaidDiagram
            chart={`flowchart LR
subgraph SUT["テスト対象 SUT"]
  A[プロダクション<br />コード]
end
subgraph HARNESS["テストハーネス層"]
  B[テストダブル<br />Mock / Stub / Fake]
  C[フィクスチャ<br />setUp / tearDown]
  D[テストランナー<br />Google Test / pytest]
  E[アサーション<br />ライブラリ]
end
subgraph OUTPUT["検証・報告"]
  F[テスト結果<br />PASS / FAIL]
  G[カバレッジ<br />レポート]
  H[CIダッシュボード]
end
A --> B
B --> C
C --> D
D --> E
E --> F
F --> G
G --> H`}
          />
        </div>

        <div className={styles.vocab}>
          <div className={styles.vocabHead}>📖 用語集</div>
          <dl>
            <dt>テストハーネス</dt>
            <dd>テストを安全・再現可能に実行するための足場全体の総称</dd>
            <dt>SUT</dt>
            <dd>System Under Test。「テストされるシステム」の略</dd>
            <dt>フレイキーテスト</dt>
            <dd>同じコードで実行のたびに結果が変わる不安定なテスト</dd>
            <dt>フィクスチャ</dt>
            <dd>各テスト実行前後に状態を整えるセットアップ/クリーンアップ処理</dd>
          </dl>
        </div>
      </section>

      <section id="s2" className={styles.sec}>
        <div className={styles.secNo}>Section 02</div>
        <h2 className={styles.secTitle}>
          <span className={styles.n}>02.</span>Googleのテスト哲学 — テストピラミッド
        </h2>

        <p>
          <strong>テストピラミッド</strong>（Testing Pyramid）は「テストの種類ごとの理想的な量の比率」を表す考え方です。下（細かい粒度）ほど多く・上（粗い粒度）ほど少なくという形になります。
        </p>

        <div className={`${styles.callout} ${styles.cNote}`}>
          <span className={styles.ci}>🏗️</span>
          <div>
            <strong>日常の例え話 — 建物の検査</strong>
            <br />
            ボルト1本の締め付けトルク検査（ユニットテスト）は大量に行います。完成した建物全体の耐震検査（E2Eテスト）は費用が高く少数しか行いません。ピラミッドの形はその比率を表しています。
          </div>
        </div>

        <div className={styles.mermaidWrap}>
          <div className={styles.mermaidLabel}>テストピラミッド — 種類別の理想比率</div>
          <MermaidDiagram
            chart={`flowchart TD
E2E["E2Eテスト\n全システム結合 / 数十〜数百件\n実行時間: 分〜時間単位"]
INT["統合テスト Integration Test\n複数コンポーネント協調 / 数千〜数万件\n実行時間: 秒〜分単位"]
UNIT["ユニットテスト Unit Test\n関数・クラス単体 / 数千〜数万件\n実行時間: ミリ秒単位"]
E2E --> INT
INT --> UNIT`}
          />
        </div>

        <h3>Google の Small / Medium / Large 分類</h3>

        <div className={styles.tblWrap}>
          <table>
            <thead>
              <tr>
                <th>サイズ</th>
                <th>日本語名</th>
                <th>実行制限</th>
                <th>ネットワーク</th>
                <th>DB</th>
                <th>外部サービス</th>
                <th>目標比率</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>Small</code>
                </td>
                <td>小テスト</td>
                <td>60秒以内</td>
                <td>
                  <span className={`${styles.badge} ${styles.bRed}`}>禁止</span>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles.bRed}`}>禁止</span>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles.bRed}`}>禁止</span>
                </td>
                <td>
                  <strong>80%以上</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <code>Medium</code>
                </td>
                <td>中テスト</td>
                <td>300秒以内</td>
                <td>
                  <span className={`${styles.badge} ${styles.bYel}`}>ローカルのみ</span>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles.bYel}`}>localhostのみ</span>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles.bRed}`}>禁止</span>
                </td>
                <td>15%程度</td>
              </tr>
              <tr>
                <td>
                  <code>Large</code>
                </td>
                <td>大テスト</td>
                <td>900秒以内</td>
                <td>
                  <span className={`${styles.badge} ${styles.bGrn}`}>制限なし</span>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles.bGrn}`}>制限なし</span>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles.bGrn}`}>制限なし</span>
                </td>
                <td>5%程度</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={`${styles.callout} ${styles.cWarn}`}>
          <span className={styles.ci}>⚠️</span>
          <div>
            <strong>逆ピラミッド（Ice-cream Cone）アンチパターン</strong>
            <br />
            E2Eテストが多すぎると「CI実行時間が時間単位になる」「失敗原因がコードかインフラか分からない」という問題が発生します。GoogleはE2Eテストを増やす前に「
            <strong>このテストをユニットテストで代替できないか</strong>」を必ず問い直すことを推奨しています。
          </div>
        </div>

        <div className={styles.vocab}>
          <div className={styles.vocabHead}>📖 用語集</div>
          <dl>
            <dt>テストピラミッド</dt>
            <dd>ユニット→統合→E2Eの順に「多→少」にテストを配置するベストプラクティス</dd>
            <dt>E2Eテスト</dt>
            <dd>ユーザーの操作を模倣してシステム全体を通して動かすテスト</dd>
            <dt>Small/Medium/Large</dt>
            <dd>Googleが使うテストサイズ分類。依存する外部リソースの多さで決まる</dd>
            <dt>逆ピラミッド</dt>
            <dd>E2Eテストが多すぎる失敗パターン。CI崩壊の主原因</dd>
          </dl>
        </div>
      </section>

      <section id="s3" className={styles.sec}>
        <div className={styles.secNo}>Section 03</div>
        <h2 className={styles.secTitle}>
          <span className={styles.n}>03.</span>テストハーネスを構成する5つの要素
        </h2>

        <div className={styles.mermaidWrap}>
          <div className={styles.mermaidLabel}>5要素の関係図</div>
          <MermaidDiagram
            chart={`flowchart TD
RUNNER["テストランナー Test Runner\n全体の司令塔"]
FIXTURE["フィクスチャ Fixture\n環境の準備と後片付け"]
DOUBLE["テストダブル Test Double\n外部依存の替え玉"]
ASSERT["アサーション Assertion\n期待値との比較"]
REPORTER["レポーター Reporter\n結果の可視化"]
RUNNER --> FIXTURE
FIXTURE --> DOUBLE
DOUBLE --> ASSERT
ASSERT --> REPORTER`}
          />
        </div>

        <div className={styles.cardGrid}>
          <div className={`${styles.card} ${styles.cardB}`}>
            <div className={styles.cardNum}>01</div>
            <h4 className={styles.cardTitle}>テストランナー</h4>
            <p className={styles.cardDesc}>
              テストを順番に実行する司令塔。「どのテストを・どの順番で・何回実行するか」を管理します。
            </p>
            <span className={`${styles.tag} ${styles.tagB}`}>Google Test / pytest / Vitest</span>
          </div>
          <div className={`${styles.card} ${styles.cardG}`}>
            <div className={styles.cardNum}>02</div>
            <h4 className={styles.cardTitle}>フィクスチャ</h4>
            <p className={styles.cardDesc}>
              テスト実行前後の「部屋の掃除」担当。setUp でDB用意、tearDown でDB破棄を自動実行します。
            </p>
            <span className={`${styles.tag} ${styles.tagG}`}>setUp / tearDown</span>
          </div>
          <div className={`${styles.card} ${styles.cardY}`}>
            <div className={styles.cardNum}>03</div>
            <h4 className={styles.cardTitle}>テストダブル</h4>
            <p className={styles.cardDesc}>
              本物の依存コンポーネントの「替え玉」。Mock・Stub・Fake・Spy の4種類があります（次章で詳述）。
            </p>
            <span className={`${styles.tag} ${styles.tagY}`}>Mock / Stub / Fake / Spy</span>
          </div>
          <div className={`${styles.card} ${styles.cardR}`}>
            <div className={styles.cardNum}>04</div>
            <h4 className={styles.cardTitle}>アサーション</h4>
            <p className={styles.cardDesc}>
              「期待どおりだよね？」と確認する係。失敗時に分かりやすいエラーメッセージを出すことが重要です。
            </p>
            <span className={`${styles.tag} ${styles.tagR}`}>Google Truth / pytest assert</span>
          </div>
          <div className={`${styles.card} ${styles.cardP}`}>
            <div className={styles.cardNum}>05</div>
            <h4 className={styles.cardTitle}>レポーター</h4>
            <p className={styles.cardDesc}>
              テスト結果をグラフ・ダッシュボードで可視化。Google内部ではSpongeを、OSSではAllureが相当します。
            </p>
            <span className={`${styles.tag} ${styles.tagP}`}>Allure / pytest-html</span>
          </div>
        </div>

        <h3>テストランナーの言語別比較</h3>
        <div className={styles.tblWrap}>
          <table>
            <thead>
              <tr>
                <th>言語</th>
                <th>Google推奨フレームワーク</th>
                <th>主な特徴</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>C++</td>
                <td>
                  <code>Google Test (gtest)</code>
                </td>
                <td>GoogleがOSS公開。パラメータ化テスト・モック（GMock）対応</td>
              </tr>
              <tr>
                <td>Python</td>
                <td>
                  <code>pytest</code>
                </td>
                <td>フィクスチャが強力。プラグイン豊富。xdist で並列実行可</td>
              </tr>
              <tr>
                <td>Go</td>
                <td>
                  <code>testing パッケージ</code>
                </td>
                <td>標準ライブラリに内蔵。Table-Driven Tests が慣例</td>
              </tr>
              <tr>
                <td>Java</td>
                <td>
                  <code>JUnit5 + Google Truth</code>
                </td>
                <td>Truth でアサーションが自然言語に近い記述になる</td>
              </tr>
              <tr>
                <td>TypeScript</td>
                <td>
                  <code>Vitest / Jest</code>
                </td>
                <td>高速・ESM対応。Vitest は Vite と統合</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="s4" className={styles.sec}>
        <div className={styles.secNo}>Section 04</div>
        <h2 className={styles.secTitle}>
          <span className={styles.n}>04.</span>テストダブル — 替え玉の4種類
        </h2>

        <div className={`${styles.callout} ${styles.cNote}`}>
          <span className={styles.ci}>🎬</span>
          <div>
            <strong>日常の例え話 — スタントマン</strong>
            <br />
            映画のスタントマンは主役俳優の代わりに危険なシーンをこなします。「似た外見・特定のシーンだけ動く」という点がテストダブルと共通しています。
            本物（外部DB・外部API）の代わりにテスト専用の替え玉を使うことで、テストを速く・安全・再現可能にします。
          </div>
        </div>

        <h3>4種類の比較表</h3>
        <div className={styles.tblWrap}>
          <table>
            <thead>
              <tr>
                <th>種類</th>
                <th>日本語名</th>
                <th>動作</th>
                <th>いつ使うか</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>Stub</code>
                </td>
                <td>スタブ</td>
                <td>固定値を返すだけ</td>
                <td>「値が返ってくればいい」場合</td>
              </tr>
              <tr>
                <td>
                  <code>Mock</code>
                </td>
                <td>モック</td>
                <td>呼び出しを記録・検証する</td>
                <td>「このメソッドが呼ばれたか確認したい」場合</td>
              </tr>
              <tr>
                <td>
                  <code>Fake</code>
                </td>
                <td>フェイク</td>
                <td>本物に近いが軽量な実装</td>
                <td>DBの代わりにメモリ上で動く実装</td>
              </tr>
              <tr>
                <td>
                  <code>Spy</code>
                </td>
                <td>スパイ</td>
                <td>本物を使いつつ呼び出しを記録</td>
                <td>既存コードを変更せず動作を監視したい場合</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Stub（スタブ）の実装例</h3>
        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <div className={styles.dots}>
              <div className={styles.dot} style={{ background: "#ea4335" }} />
              <div className={styles.dot} style={{ background: "#fbbc04" }} />
              <div className={styles.dot} style={{ background: "#34a853" }} />
            </div>
            <span>stub_example.py — 固定値を返すだけの替え玉</span>
          </div>
          <pre className={styles.codeBody}>
            <span className={styles.cc}># なぜスタブを使うか:</span>
            {"\n"}
            <span className={styles.cc}># 本物の天気APIを呼ぶと「ネットワーク障害」「APIキー切れ」でテストが落ちるため</span>
            {"\n"}
            <span className={styles.cc}># 替え玉を使ってテスト対象コードの判断ロジックのみをテストする</span>
            {"\n\n"}
            <span className={styles.ck}>class</span> <span className={styles.cv}>StubWeatherApi</span>:
            {"\n"}
            {"    "}
            <span className={styles.cs}>&quot;&quot;&quot;本物のWeatherApiの替え玉。常に晴れを返す。&quot;&quot;&quot;</span>
            {"\n"}
            {"    "}
            <span className={styles.ck}>def</span> <span className={styles.cv}>get_weather</span>(self, city: <span className={styles.ce}>str</span>) -&gt; <span className={styles.ce}>str</span>:
            {"\n"}
            {"        "}
            <span className={styles.ck}>return</span> <span className={styles.cs}>&quot;sunny&quot;</span>{"  "}
            <span className={styles.cc}># 固定値を返すだけ。ネットワーク接続なし</span>
            {"\n\n"}
            <span className={styles.ck}>def</span> <span className={styles.cv}>test_suggest_activity_when_sunny</span>():
            {"\n"}
            {"    "}
            stub_api = <span className={styles.cv}>StubWeatherApi</span>()
            {"\n"}
            {"    "}
            service = <span className={styles.cv}>ActivitySuggester</span>(weather_api=stub_api){"  "}
            <span className={styles.cc}># DI で注入</span>
            {"\n"}
            {"    "}
            suggestion = service.suggest(city=<span className={styles.cs}>&quot;Tokyo&quot;</span>)
            {"\n"}
            {"    "}
            <span className={styles.ck}>assert</span> suggestion == <span className={styles.cs}>&quot;Let&apos;s go outside!&quot;</span>
          </pre>
        </div>

        <h3>Mock（モック）の実装例</h3>
        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <div className={styles.dots}>
              <div className={styles.dot} style={{ background: "#ea4335" }} />
              <div className={styles.dot} style={{ background: "#fbbc04" }} />
              <div className={styles.dot} style={{ background: "#34a853" }} />
            </div>
            <span>mock_example.py — 呼び出しを記録して検証する替え玉</span>
          </div>
          <pre className={styles.codeBody}>
            <span className={styles.ck}>from</span> unittest.mock <span className={styles.ck}>import</span> <span className={styles.cv}>MagicMock</span>
            {"\n\n"}
            <span className={styles.ck}>def</span> <span className={styles.cv}>test_email_sent_on_registration</span>():
            {"\n"}
            {"    "}
            <span className={styles.cc}># なぜモックを使うか: 本物のメールが送信されると受信ボックスが汚れるため</span>
            {"\n"}
            {"    "}
            mock_mailer = <span className={styles.cv}>MagicMock</span>()
            {"\n"}
            {"    "}
            service = <span className={styles.cv}>UserService</span>(mailer=mock_mailer)
            {"\n\n"}
            {"    "}
            service.register(email=<span className={styles.cs}>&quot;user@example.com&quot;</span>)
            {"\n\n"}
            {"    "}
            <span className={styles.cc}># 「send_email が1回・正しい引数で呼ばれたか」を検証する</span>
            {"\n"}
            {"    "}
            mock_mailer.send_email.assert_called_once_with(
            {"\n"}
            {"        "}
            to=<span className={styles.cs}>&quot;user@example.com&quot;</span>,
            {"\n"}
            {"        "}
            subject=<span className={styles.cs}>&quot;Welcome!&quot;</span>
            {"\n"}
            {"    "})
          </pre>
        </div>

        <h3>Fake（フェイク）の実装例</h3>
        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <div className={styles.dots}>
              <div className={styles.dot} style={{ background: "#ea4335" }} />
              <div className={styles.dot} style={{ background: "#fbbc04" }} />
              <div className={styles.dot} style={{ background: "#34a853" }} />
            </div>
            <span>fake_example.py — 実際に動くが軽量なインメモリDB</span>
          </div>
          <pre className={styles.codeBody}>
            <span className={styles.ck}>class</span> <span className={styles.cv}>FakeUserRepository</span>:
            {"\n"}
            {"    "}
            <span className={styles.cs}>&quot;&quot;&quot;本物のPostgreSQLの代わりに辞書で動くインメモリDB&quot;&quot;&quot;</span>
            {"\n\n"}
            {"    "}
            <span className={styles.ck}>def</span> <span className={styles.cv}>__init__</span>(self):
            {"\n"}
            {"        "}
            <span className={styles.cc}># メモリ上の辞書でデータを管理。DBなし・ネットワークなし</span>
            {"\n"}
            {"        "}
            self._store: <span className={styles.ce}>dict</span>[<span className={styles.ce}>str</span>, <span className={styles.cv}>User</span>] = {"{}"}
            {"\n\n"}
            {"    "}
            <span className={styles.ck}>def</span> <span className={styles.cv}>save</span>(self, user: <span className={styles.cv}>User</span>) -&gt; <span className={styles.ce}>None</span>:
            {"\n"}
            {"        "}
            self._store[user.id] = user{"  "}
            <span className={styles.cc}># 辞書に保存するだけ</span>
            {"\n\n"}
            {"    "}
            <span className={styles.ck}>def</span> <span className={styles.cv}>find_by_id</span>(self, user_id: <span className={styles.ce}>str</span>) -&gt; <span className={styles.cv}>User</span> | <span className={styles.ck}>None</span>:
            {"\n"}
            {"        "}
            <span className={styles.ck}>return</span> self._store.get(user_id)
            {"\n\n"}
            <span className={styles.ck}>def</span> <span className={styles.cv}>test_update_user_email</span>():
            {"\n"}
            {"    "}
            fake_repo = <span className={styles.cv}>FakeUserRepository</span>()
            {"\n"}
            {"    "}
            service = <span className={styles.cv}>UserService</span>(repo=fake_repo)
            {"\n"}
            {"    "}
            user = service.create_user(name=<span className={styles.cs}>&quot;Alice&quot;</span>)
            {"\n"}
            {"    "}
            service.update_email(user.id, new_email=<span className={styles.cs}>&quot;new@example.com&quot;</span>)
            {"\n"}
            {"    "}
            saved = fake_repo.find_by_id(user.id)
            {"\n"}
            {"    "}
            <span className={styles.ck}>assert</span> saved.email == <span className={styles.cs}>&quot;new@example.com&quot;</span>
          </pre>
        </div>

        <h3>どのテストダブルを選ぶか — 選択フロー</h3>
        <div className={styles.mermaidWrap}>
          <div className={styles.mermaidLabel}>テストダブル選択フロー</div>
          <MermaidDiagram
            chart={`flowchart TD
START["外部依存が存在する"]
Q1{"呼ばれたこと自体を<br />検証したいか"}
Q2{"実際に動くロジックが<br />必要か"}
Q3{"本物のコードを<br />変更できるか"}
MOCK["Mock を使う<br />呼び出しを記録・検証"]
FAKE["Fake を使う<br />軽量な本物実装"]
SPY["Spy を使う<br />本物のまま監視"]
STUB["Stub を使う<br />固定値を返す"]
START --> Q1
Q1 -->|Yes| MOCK
Q1 -->|No| Q2
Q2 -->|Yes| FAKE
Q2 -->|No| Q3
Q3 -->|No| SPY
Q3 -->|Yes| STUB`}
          />
        </div>

        <div className={styles.vocab}>
          <div className={styles.vocabHead}>📖 用語集</div>
          <dl>
            <dt>テストダブル</dt>
            <dd>テスト用に本物の依存コンポーネントの代わりに使う替え玉の総称</dd>
            <dt>スタブ</dt>
            <dd>固定値を返すだけのシンプルな替え玉</dd>
            <dt>モック</dt>
            <dd>呼び出しを記録して後から検証できる替え玉</dd>
            <dt>フェイク</dt>
            <dd>実際に動作するが軽量な代替実装（インメモリDBなど）</dd>
            <dt>DI</dt>
            <dd>Dependency Injection。依存するオブジェクトを外から注入する設計パターン</dd>
          </dl>
        </div>
      </section>

      <section id="s5" className={styles.sec}>
        <div className={styles.secNo}>Section 05</div>
        <h2 className={styles.secTitle}>
          <span className={styles.n}>05.</span>ハーミティックテスト — 孤立した清潔なテスト
        </h2>

        <div className={`${styles.callout} ${styles.cNote}`}>
          <span className={styles.ci}>🚀</span>
          <div>
            <strong>日常の例え話 — 宇宙服</strong>
            <br />
            宇宙服は外の真空・放射線・温度変化から宇宙飛行士を完全に「密閉」して守ります。ハーミティックテストも外部のDB状態・ネットワーク状況・時刻・他のテストから完全に隔離されたテストです。
          </div>
        </div>

        <h3>ハーミティックの3原則</h3>
        <div className={styles.tblWrap}>
          <table>
            <thead>
              <tr>
                <th>原則</th>
                <th>意味</th>
                <th>実装方法</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>孤立性</code>
                </td>
                <td>他のテストの実行順・実行有無に結果が依存しない</td>
                <td>各テストで独立したフィクスチャを使う</td>
              </tr>
              <tr>
                <td>
                  <code>冪等性</code>
                </td>
                <td>何回実行しても同じ結果になる</td>
                <td>時刻・乱数・外部APIを排除する</td>
              </tr>
              <tr>
                <td>
                  <code>自己完結性</code>
                </td>
                <td>テストデータを自分で作り・自分で片付ける</td>
                <td>DB初期化をsetUpで行う</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>ハーミティックを破るアンチパターンと解決策</h3>
        <div className={styles.mermaidWrap}>
          <div className={styles.mermaidLabel}>アンチパターン → 解決策のフロー</div>
          <MermaidDiagram
            chart={`flowchart TD
ANTI["ハーミティック違反<br />アンチパターン"]
AP1["共有DBを使う<br />テストA→B間でデータが残る"]
AP2["現在時刻に依存<br />datetime.now が変わると失敗"]
AP3["外部APIを呼ぶ<br />ネットワーク障害で失敗"]
AP4["グローバル変数を変更<br />他のテストに副作用"]
FIX1["フェイクDBを使う<br />各テストで独立したメモリDB"]
FIX2["時刻をモックする<br />freezegun / faketime"]
FIX3["テストダブルを使う<br />スタブ / モック"]
FIX4["テスト後にリストアする<br />tearDown でリセット"]
ANTI --> AP1
ANTI --> AP2
ANTI --> AP3
ANTI --> AP4
AP1 --> FIX1
AP2 --> FIX2
AP3 --> FIX3
AP4 --> FIX4`}
          />
        </div>

        <div className={styles.vocab}>
          <div className={styles.vocabHead}>📖 用語集</div>
          <dl>
            <dt>ハーミティック</dt>
            <dd>外部に依存せず完全に密閉・独立したテストの性質（hermetic = 密閉された）</dd>
            <dt>冪等性</dt>
            <dd>同じ操作を何回繰り返しても同じ結果になる性質</dd>
            <dt>freezegun</dt>
            <dd>PythonでdatetimeをモックするOSSライブラリ</dd>
          </dl>
        </div>
      </section>

      <section id="s6" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>06.</span>ステップバイステップ実装ガイド</h2>
      </section>

      <section id="s7" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>07.</span>フレイキーテスト対策</h2>
      </section>

      <section id="s8" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>08.</span>CIパイプラインへの組み込み</h2>
      </section>

      <section id="s9" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>09.</span>AIエージェント評価ハーネス</h2>
      </section>

      <section id="s10" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>10.</span>ベストプラクティス10則</h2>
      </section>

      <section id="s11" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>11.</span>参考ソース一覧</h2>
        <div>
          <Ext href="https://abseil.io/resources/swe-book">Software Engineering at Google</Ext>
          <Ext href="https://testing.googleblog.com">Google Testing Blog</Ext>
          <Ext href="https://github.com/google/googletest">Google Test</Ext>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Google Testing Blog / Software Engineering at Google 準拠 — 2026年版</p>
      </footer>
    </main>
  );
}
