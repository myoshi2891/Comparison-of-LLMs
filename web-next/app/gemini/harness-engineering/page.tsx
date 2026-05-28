import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Google ハーネスエンジニアリング 完全ガイド",
  description:
    "Googleが実践するテストハーネス設計の技術とベストプラクティスを解説する完全ガイドです。",
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
          <strong>テストハーネス</strong>（Test
          Harness）とは、テスト対象のコードを「安全かつ再現可能な環境」で動かすための
          <strong>足場（スキャフォールディング）</strong>のことです。
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
          Googleは1日に<strong>数億行のコード変更</strong>と<strong>数十億件のテスト</strong>
          を実行します。この規模で「テストが適当」だと以下の問題が発生します。
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
          <strong>テストピラミッド</strong>（Testing
          Pyramid）は「テストの種類ごとの理想的な量の比率」を表す考え方です。下（細かい粒度）ほど多く・上（粗い粒度）ほど少なくという形になります。
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
            <strong>このテストをユニットテストで代替できないか</strong>
            」を必ず問い直すことを推奨しています。
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
              テスト実行前後の「部屋の掃除」担当。setUp でDB用意、tearDown
              でDB破棄を自動実行します。
            </p>
            <span className={`${styles.tag} ${styles.tagG}`}>setUp / tearDown</span>
          </div>
          <div className={`${styles.card} ${styles.cardY}`}>
            <div className={styles.cardNum}>03</div>
            <h4 className={styles.cardTitle}>テストダブル</h4>
            <p className={styles.cardDesc}>
              本物の依存コンポーネントの「替え玉」。Mock・Stub・Fake・Spy
              の4種類があります（次章で詳述）。
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
            <span className={styles.cc}>
              # 本物の天気APIを呼ぶと「ネットワーク障害」「APIキー切れ」でテストが落ちるため
            </span>
            {"\n"}
            <span className={styles.cc}>
              # 替え玉を使ってテスト対象コードの判断ロジックのみをテストする
            </span>
            {"\n\n"}
            <span className={styles.ck}>class</span>{" "}
            <span className={styles.cv}>StubWeatherApi</span>:{"\n"}
            {"    "}
            <span className={styles.cs}>
              &quot;&quot;&quot;本物のWeatherApiの替え玉。常に晴れを返す。&quot;&quot;&quot;
            </span>
            {"\n"}
            {"    "}
            <span className={styles.ck}>def</span> <span className={styles.cv}>get_weather</span>
            (self, city: <span className={styles.ce}>str</span>) -&gt;{" "}
            <span className={styles.ce}>str</span>:{"\n"}
            {"        "}
            <span className={styles.ck}>return</span>{" "}
            <span className={styles.cs}>&quot;sunny&quot;</span>
            {"  "}
            <span className={styles.cc}># 固定値を返すだけ。ネットワーク接続なし</span>
            {"\n\n"}
            <span className={styles.ck}>def</span>{" "}
            <span className={styles.cv}>test_suggest_activity_when_sunny</span>():
            {"\n"}
            {"    "}
            stub_api = <span className={styles.cv}>StubWeatherApi</span>()
            {"\n"}
            {"    "}
            service = <span className={styles.cv}>ActivitySuggester</span>(weather_api=stub_api)
            {"  "}
            <span className={styles.cc}># DI で注入</span>
            {"\n"}
            {"    "}
            suggestion = service.suggest(city=<span className={styles.cs}>&quot;Tokyo&quot;</span>)
            {"\n"}
            {"    "}
            <span className={styles.ck}>assert</span> suggestion =={" "}
            <span className={styles.cs}>&quot;Let&apos;s go outside!&quot;</span>
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
            <span className={styles.ck}>from</span> unittest.mock{" "}
            <span className={styles.ck}>import</span> <span className={styles.cv}>MagicMock</span>
            {"\n\n"}
            <span className={styles.ck}>def</span>{" "}
            <span className={styles.cv}>test_email_sent_on_registration</span>():
            {"\n"}
            {"    "}
            <span className={styles.cc}>
              # なぜモックを使うか: 本物のメールが送信されると受信ボックスが汚れるため
            </span>
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
            <span className={styles.cc}>
              # 「send_email が1回・正しい引数で呼ばれたか」を検証する
            </span>
            {"\n"}
            {"    "}
            mock_mailer.send_email.assert_called_once_with(
            {"\n"}
            {"        "}
            to=<span className={styles.cs}>&quot;user@example.com&quot;</span>,{"\n"}
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
            <span className={styles.ck}>class</span>{" "}
            <span className={styles.cv}>FakeUserRepository</span>:{"\n"}
            {"    "}
            <span className={styles.cs}>
              &quot;&quot;&quot;本物のPostgreSQLの代わりに辞書で動くインメモリDB&quot;&quot;&quot;
            </span>
            {"\n\n"}
            {"    "}
            <span className={styles.ck}>def</span> <span className={styles.cv}>__init__</span>
            (self):
            {"\n"}
            {"        "}
            <span className={styles.cc}>
              # メモリ上の辞書でデータを管理。DBなし・ネットワークなし
            </span>
            {"\n"}
            {"        "}
            self._store: <span className={styles.ce}>dict</span>[
            <span className={styles.ce}>str</span>, <span className={styles.cv}>User</span>] ={" "}
            {"{}"}
            {"\n\n"}
            {"    "}
            <span className={styles.ck}>def</span> <span className={styles.cv}>save</span>(self,
            user: <span className={styles.cv}>User</span>) -&gt;{" "}
            <span className={styles.ce}>None</span>:{"\n"}
            {"        "}
            self._store[user.id] = user{"  "}
            <span className={styles.cc}># 辞書に保存するだけ</span>
            {"\n\n"}
            {"    "}
            <span className={styles.ck}>def</span> <span className={styles.cv}>find_by_id</span>
            (self, user_id: <span className={styles.ce}>str</span>) -&gt;{" "}
            <span className={styles.cv}>User</span> | <span className={styles.ck}>None</span>:{"\n"}
            {"        "}
            <span className={styles.ck}>return</span> self._store.get(user_id)
            {"\n\n"}
            <span className={styles.ck}>def</span>{" "}
            <span className={styles.cv}>test_update_user_email</span>():
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
            service.update_email(user.id, new_email=
            <span className={styles.cs}>&quot;new@example.com&quot;</span>){"\n"}
            {"    "}
            saved = fake_repo.find_by_id(user.id)
            {"\n"}
            {"    "}
            <span className={styles.ck}>assert</span> saved.email =={" "}
            <span className={styles.cs}>&quot;new@example.com&quot;</span>
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
        <div className={styles.secNo}>Section 06</div>
        <h2 className={styles.secTitle}>
          <span className={styles.n}>06.</span>ステップバイステップ実装ガイド
        </h2>

        <div className={styles.mermaidWrap}>
          <div className={styles.mermaidLabel}>実装ステップ全体フロー</div>
          <MermaidDiagram
            chart={`flowchart TD
S1["Step 1<br />プロダクションコードの設計<br />DIパターンで依存を注入可能にする"]
S2["Step 2<br />テストダブルの実装<br />Fake / Stub / Mock を作る"]
S3["Step 3<br />フィクスチャの設定<br />setUp / tearDown を定義する"]
S4["Step 4<br />テストケースの実装<br />AAAパターンで書く"]
S5["Step 5<br />CIパイプラインへの統合<br />GitHub Actions / Cloud Build"]
S1 --> S2
S2 --> S3
S3 --> S4
S4 --> S5`}
          />
        </div>

        <h3>Step 1 — DI（依存性注入）設計</h3>
        <p>
          <strong>DI（Dependency Injection）</strong>
          とは「必要な道具を外から渡してもらう」設計です。テスト時に本物の依存を替え玉に差し替えるために必須です。
        </p>

        <div className={styles.cmp}>
          <div className={styles.cmpNg}>
            <div className={styles.cmpLabel}>❌ DIなし（テスト不可能）</div>
            <div className={styles.codeWrap} style={{ margin: 0 }}>
              <pre className={styles.codeBody}>
                <span className={styles.ck}>class</span>{" "}
                <span className={styles.cv}>UserService</span>:{"\n"}
                {"  "}
                <span className={styles.ck}>def</span> <span className={styles.cv}>__init__</span>
                (self):
                {"\n"}
                {"    "}
                <span className={styles.cc}># ハードコード。替え玉を差し込めない</span>
                {"\n"}
                {"    "}
                self._db = <span className={styles.cv}>PostgreSQLDatabase</span>({"\n"}
                {"      "}
                host=<span className={styles.cs}>&quot;prod.db.example.com&quot;</span>
                {"\n"}
                {"    "})
              </pre>
            </div>
          </div>
          <div className={styles.cmpOk}>
            <div className={styles.cmpLabel}>✅ DIあり（テスト可能）</div>
            <div className={styles.codeWrap} style={{ margin: 0 }}>
              <pre className={styles.codeBody}>
                <span className={styles.ck}>class</span>{" "}
                <span className={styles.cv}>UserService</span>:{"\n"}
                {"  "}
                <span className={styles.ck}>def</span> <span className={styles.cv}>__init__</span>
                (self, repo: <span className={styles.cv}>UserRepository</span>):
                {"\n"}
                {"    "}
                <span className={styles.cc}># 外から渡してもらう</span>
                {"\n"}
                {"    "}
                <span className={styles.cc}># 本番=PostgreSQL / テスト=Fake</span>
                {"\n"}
                {"    "}
                self._repo = repo
              </pre>
            </div>
          </div>
        </div>

        <h3>Step 2 — フィクスチャの設定（pytest）</h3>
        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <div className={styles.dots}>
              <div className={styles.dot} style={{ background: "#ea4335" }} />
              <div className={styles.dot} style={{ background: "#fbbc04" }} />
              <div className={styles.dot} style={{ background: "#34a853" }} />
            </div>
            <span>conftest.py — pytest フィクスチャ定義</span>
          </div>
          <pre className={styles.codeBody}>
            <span className={styles.ck}>import</span> pytest
            {"\n\n"}
            <span className={styles.cv}>@pytest.fixture</span>
            {"\n"}
            <span className={styles.ck}>def</span> <span className={styles.cv}>fake_repo</span>():
            {"\n"}
            {"    "}
            <span className={styles.cs}>
              &quot;&quot;&quot;各テスト関数に渡されるクリーンなフェイクリポジトリ。
            </span>
            {"\n"}
            {"    "}
            <span className={styles.cs}>
              なぜfixture を使うか: 毎回 FakeUserRepository() を書く手間を省き、
            </span>
            {"\n"}
            {"    "}
            <span className={styles.cs}>
              さらに各テストが必ず独立したインスタンスを使うことを保証するため。&quot;&quot;&quot;
            </span>
            {"\n"}
            {"    "}
            <span className={styles.ck}>return</span>{" "}
            <span className={styles.cv}>FakeUserRepository</span>()
            {"\n\n"}
            <span className={styles.cv}>@pytest.fixture</span>
            {"\n"}
            <span className={styles.ck}>def</span> <span className={styles.cv}>user_service</span>
            (fake_repo):
            {"\n"}
            {"    "}
            <span className={styles.cs}>
              &quot;&quot;&quot;依存関係を注入済みのサービスインスタンスを返す。&quot;&quot;&quot;
            </span>
            {"\n"}
            {"    "}
            <span className={styles.ck}>return</span> <span className={styles.cv}>UserService</span>
            (repo=fake_repo)
          </pre>
        </div>

        <h3>Step 3 — AAAパターンでテストを書く</h3>
        <p>
          <strong>AAAパターン</strong>
          （Arrange-Act-Assert）とは「準備→実行→検証」の3段構成でテストを書くGoogleの標準スタイルです。
        </p>

        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <div className={styles.dots}>
              <div className={styles.dot} style={{ background: "#ea4335" }} />
              <div className={styles.dot} style={{ background: "#fbbc04" }} />
              <div className={styles.dot} style={{ background: "#34a853" }} />
            </div>
            <span>test_user_service.py — AAAパターンによるテスト</span>
          </div>
          <pre className={styles.codeBody}>
            <span className={styles.ck}>def</span>{" "}
            <span className={styles.cv}>test_register_user_saves_to_repository</span>(user_service,
            fake_repo):
            {"\n"}
            {"    "}
            <span className={styles.cc}>
              # ── Arrange（準備）: テストに必要なデータを用意する ──
            </span>
            {"\n"}
            {"    "}
            user_data = {"{"}
            <span className={styles.cs}>&quot;name&quot;</span>:{" "}
            <span className={styles.cs}>&quot;Alice&quot;</span>,{" "}
            <span className={styles.cs}>&quot;email&quot;</span>:{" "}
            <span className={styles.cs}>&quot;alice@example.com&quot;</span>
            {"}"}
            {"\n\n"}
            {"    "}
            <span className={styles.cc}># ── Act（実行）: テスト対象のコードを1つだけ呼ぶ ──</span>
            {"\n"}
            {"    "}
            <span className={styles.cc}>
              # なぜ1つだけか: 複数呼ぶと「どれが失敗原因か」分からなくなるため
            </span>
            {"\n"}
            {"    "}
            created_user = user_service.register(**user_data)
            {"\n\n"}
            {"    "}
            <span className={styles.cc}>
              # ── Assert（検証）: 期待どおりの結果になっているか確認する ──
            </span>
            {"\n"}
            {"    "}
            saved = fake_repo.find_by_id(created_user.id)
            {"\n"}
            {"    "}
            <span className={styles.ck}>assert</span> saved{" "}
            <span className={styles.ck}>is not</span> <span className={styles.ck}>None</span>,
            {"       "}
            <span className={styles.cs}>&quot;ユーザーがリポジトリに保存されていること&quot;</span>
            {"\n"}
            {"    "}
            <span className={styles.ck}>assert</span> saved.name =={" "}
            <span className={styles.cs}>&quot;Alice&quot;</span>,{"   "}
            <span className={styles.cs}>&quot;名前が正しく保存されていること&quot;</span>
            {"\n"}
            {"    "}
            <span className={styles.ck}>assert</span> saved.email =={" "}
            <span className={styles.cs}>&quot;alice@example.com&quot;</span>,{" "}
            <span className={styles.cs}>&quot;メールが正しく保存されていること&quot;</span>
          </pre>
        </div>

        <h3>Step 4 — Google Test (C++) でハーネスを組む例</h3>
        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <div className={styles.dots}>
              <div className={styles.dot} style={{ background: "#ea4335" }} />
              <div className={styles.dot} style={{ background: "#fbbc04" }} />
              <div className={styles.dot} style={{ background: "#34a853" }} />
            </div>
            <span>user_service_test.cc — Google Test + GMock</span>
          </div>
          <pre className={styles.codeBody}>
            <span className={styles.cv}>#include</span>{" "}
            <span className={styles.cs}>&lt;gtest/gtest.h&gt;</span>
            {"\n"}
            <span className={styles.cv}>#include</span>{" "}
            <span className={styles.cs}>&lt;gmock/gmock.h&gt;</span>
            {"\n\n"}
            <span className={styles.cc}>
              {"// モッククラス: MOCK_METHOD で呼び出し記録・検証機能を自動付与"}
            </span>
            {"\n"}
            <span className={styles.ck}>class</span>{" "}
            <span className={styles.cv}>MockEmailService</span> :{" "}
            <span className={styles.ck}>public</span>{" "}
            <span className={styles.cv}>EmailServiceInterface</span> {"{"}
            {"\n"}
            <span className={styles.ck}>public</span>:{"\n"}
            {"    "}
            MOCK_METHOD(<span className={styles.ce}>void</span>, Send,
            {"\n"}
            {"        "}(<span className={styles.ck}>const</span> std::string&amp; to,{" "}
            <span className={styles.ck}>const</span> std::string&amp; subject),
            {"\n"}
            {"        "}(<span className={styles.ck}>override</span>));
            {"\n"}
            {"}"};{"\n\n"}
            <span className={styles.cc}>
              {"// テストフィクスチャクラス: SetUp/TearDown を定義"}
            </span>
            {"\n"}
            <span className={styles.ck}>class</span>{" "}
            <span className={styles.cv}>UserServiceTest</span> :{" "}
            <span className={styles.ck}>public</span> testing::Test {"{"}
            {"\n"}
            <span className={styles.ck}>protected</span>:{"\n"}
            {"    "}
            <span className={styles.ce}>void</span> SetUp(){" "}
            <span className={styles.ck}>override</span> {"{"}
            {"\n"}
            {"        "}
            mock_email_ = std::make_unique&lt;<span className={styles.cv}>MockEmailService</span>
            &gt;();
            {"\n"}
            {"        "}
            service_ = std::make_unique&lt;<span className={styles.cv}>UserService</span>
            &gt;(mock_email_.get());
            {"\n"}
            {"    "}
            {"}"}
            {"\n"}
            {"    "}
            std::unique_ptr&lt;<span className={styles.cv}>MockEmailService</span>&gt; mock_email_;
            {"\n"}
            {"    "}
            std::unique_ptr&lt;<span className={styles.cv}>UserService</span>&gt; service_;
            {"\n"}
            {"}"};{"\n\n"}
            <span className={styles.cc}>
              {"// テストケース: 登録時にウェルカムメールが送信されるか"}
            </span>
            {"\n"}
            TEST_F(<span className={styles.cv}>UserServiceTest</span>, RegisterSendsWelcomeEmail){" "}
            {"{"}
            {"\n"}
            {"    "}
            <span className={styles.cc}>
              {"// Arrange: メールが1回・正しい引数で呼ばれることを期待として設定"}
            </span>
            {"\n"}
            {"    "}
            EXPECT_CALL(*mock_email_, Send(
            {"\n"}
            {"        "}
            testing::Eq(<span className={styles.cs}>&quot;alice@example.com&quot;</span>),
            {"\n"}
            {"        "}
            testing::HasSubstr(<span className={styles.cs}>&quot;Welcome&quot;</span>){"\n"}
            {"    "})).Times(<span className={styles.ce}>1</span>);
            {"\n"}
            {"    "}
            <span className={styles.cc}>{"// Act: ユーザー登録を実行"}</span>
            {"\n"}
            {"    "}
            service_-&gt;Register(<span className={styles.cs}>&quot;alice@example.com&quot;</span>);
            {"\n"}
            {"    "}
            <span className={styles.cc}>
              {"// Assert: EXPECT_CALL の期待が満たされなければ自動でFAIL"}
            </span>
            {"\n"}
            {"}"}
          </pre>
        </div>

        <div className={styles.vocab}>
          <div className={styles.vocabHead}>📖 用語集</div>
          <dl>
            <dt>DI</dt>
            <dd>
              Dependency Injection。コンストラクタ等で依存オブジェクトを外から注入する設計パターン
            </dd>
            <dt>AAAパターン</dt>
            <dd>
              Arrange-Act-Assert。テストを「準備・実行・検証」の3段に分けるGoogleの標準スタイル
            </dd>
            <dt>GMock</dt>
            <dd>Google TestにC++向けモック生成機能を提供するライブラリ</dd>
          </dl>
        </div>
      </section>

      <section id="s7" className={styles.sec}>
        <div className={styles.secNo}>Section 07</div>
        <h2 className={styles.secTitle}>
          <span className={styles.n}>07.</span>フレイキーテスト対策
        </h2>

        <div className={`${styles.callout} ${styles.cWarn}`}>
          <span className={styles.ci}>🌦️</span>
          <div>
            <strong>日常の例え話 — 当てれない天気予報</strong>
            <br />
            天気予報が「明日は降ったり止んだり」と言うようなものです。予測不能なため「信頼できない情報源」として扱われてしまいます。
            フレイキーなテストも「信頼できないCI」として無視されるようになり、本物のバグを見逃す原因になります。
          </div>
        </div>

        <h3>フレイキーの4大原因と解決策</h3>
        <div className={styles.tblWrap}>
          <table>
            <thead>
              <tr>
                <th>原因</th>
                <th>具体例</th>
                <th>解決策</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>時刻依存</code>
                </td>
                <td>
                  <code>datetime.now()</code> を使った条件分岐
                </td>
                <td>
                  時刻をDIで注入・<code>freezegun</code> でモック
                </td>
              </tr>
              <tr>
                <td>
                  <code>並行性</code>
                </td>
                <td>スレッド間のレースコンディション</td>
                <td>
                  <code>asyncio.Lock</code> / Mutex で排他制御
                </td>
              </tr>
              <tr>
                <td>
                  <code>テスト順序依存</code>
                </td>
                <td>テストAがDBを汚したままテストBが実行</td>
                <td>tearDown でDB完全クリア</td>
              </tr>
              <tr>
                <td>
                  <code>乱数依存</code>
                </td>
                <td>
                  <code>random.random()</code> を使った条件分岐
                </td>
                <td>
                  シードを固定 <code>random.seed(42)</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Googleのフレイキーテスト検出・解消フロー</h3>
        <div className={styles.mermaidWrap}>
          <div className={styles.mermaidLabel}>フレイキーテスト対処フロー</div>
          <MermaidDiagram
            chart={`flowchart TD
DETECT["フレイキーテスト検出<br />CIで3回以上 PASS/FAIL が混在"]
QUARANTINE["隔離 Quarantine<br />専用ラベルを付けてメインCIから除外"]
ANALYZE["原因分析<br />時刻 / 並行性 / 順序 / 乱数"]
FIX["修正<br />原因に応じた対策を実施"]
VERIFY["再検証<br />10回連続 PASS を確認"]
RESTORE["メインCIに復帰<br />ラベルを外す"]
DEADLINE["修正デッドライン超過<br />テストを削除してチケット発行"]
DETECT --> QUARANTINE
QUARANTINE --> ANALYZE
ANALYZE --> FIX
FIX --> VERIFY
VERIFY --> RESTORE
QUARANTINE --> DEADLINE`}
          />
        </div>

        <div className={styles.vocab}>
          <div className={styles.vocabHead}>📖 用語集</div>
          <dl>
            <dt>フレイキーテスト</dt>
            <dd>同じコードで実行のたびに合否が変わる不安定なテスト</dd>
            <dt>レースコンディション</dt>
            <dd>複数のスレッドが同じリソースに競合アクセスすることで発生する不定動作</dd>
            <dt>隔離（Quarantine）</dt>
            <dd>問題のあるテストをメインCIから一時的に切り離す手法</dd>
          </dl>
        </div>
      </section>

      <section id="s8" className={styles.sec}>
        <div className={styles.secNo}>Section 08</div>
        <h2 className={styles.secTitle}>
          <span className={styles.n}>08.</span>CIパイプラインへの組み込み
        </h2>

        <h3>Google Cloud Build の設定例</h3>
        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <div className={styles.dots}>
              <div className={`${styles.dot} ${styles.red}`} />
              <div className={`${styles.dot} ${styles.yel}`} />
              <div className={`${styles.dot} ${styles.grn}`} />
            </div>
            <span>cloudbuild.yaml — テストハーネスをCIに統合</span>
          </div>
          <pre className={styles.codeBody}>
            <span className={styles.cc}>{"# cloudbuild.yaml"}</span>
            {"\n"}
            <span className={styles.cc}>
              {"# なぜ Cloud Build を使うか: 隔離されたコンテナ環境を提供し、"}
            </span>
            {"\n"}
            <span className={styles.cc}>{"# ハーミティックなテスト実行を保証するため"}</span>
            {"\n\n"}
            {"steps:"}
            {"\n"}
            {"  "}
            <span className={styles.cc}>{"# Step 1: 依存パッケージのインストール"}</span>
            {"\n"}
            {"  - "}
            <span className={styles.ck}>name</span>
            {": "}
            <span className={styles.cs}>{"'python:3.12-slim'"}</span>
            {"\n"}
            {"    "}
            <span className={styles.ck}>entrypoint</span>
            {": pip"}
            {"\n"}
            {"    "}
            <span className={styles.ck}>args</span>
            {": ["}
            <span className={styles.cs}>{"'install'"}</span>
            {", "}
            <span className={styles.cs}>{"'-r'"}</span>
            {", "}
            <span className={styles.cs}>{"'requirements.txt'"}</span>
            {"]"}
            {"\n\n"}
            {"  "}
            <span className={styles.cc}>
              {"# Step 2: ユニットテスト（Small テスト）を先に実行"}
            </span>
            {"\n"}
            {"  "}
            <span className={styles.cc}>
              {"# なぜ先に実行するか: 失敗時の早期検出でCDを節約するため"}
            </span>
            {"\n"}
            {"  - "}
            <span className={styles.ck}>name</span>
            {": "}
            <span className={styles.cs}>{"'python:3.12-slim'"}</span>
            {"\n"}
            {"    "}
            <span className={styles.ck}>entrypoint</span>
            {": pytest"}
            {"\n"}
            {"    "}
            <span className={styles.ck}>args</span>
            {": ["}
            <span className={styles.cs}>{"'-m'"}</span>
            {", "}
            <span className={styles.cs}>{"'small'"}</span>
            {", "}
            <span className={styles.cs}>{"'--tb=short'"}</span>
            {", "}
            <span className={styles.cs}>{"'-q'"}</span>
            {"]"}
            {"\n\n"}
            {"  "}
            <span className={styles.cc}>{"# Step 3: 統合テスト（Medium テスト）"}</span>
            {"\n"}
            {"  - "}
            <span className={styles.ck}>name</span>
            {": "}
            <span className={styles.cs}>{"'python:3.12-slim'"}</span>
            {"\n"}
            {"    "}
            <span className={styles.ck}>entrypoint</span>
            {": pytest"}
            {"\n"}
            {"    "}
            <span className={styles.ck}>args</span>
            {": ["}
            <span className={styles.cs}>{"'-m'"}</span>
            {", "}
            <span className={styles.cs}>{"'medium'"}</span>
            {", "}
            <span className={styles.cs}>{"'--tb=short'"}</span>
            {"]"}
            {"\n\n"}
            {"services:"}
            {"\n"}
            {"  "}
            <span className={styles.cc}>
              {"# テスト専用の一時DBコンテナ（毎回新規作成でハーミティックを保つ）"}
            </span>
            {"\n"}
            {"  - "}
            <span className={styles.ck}>name</span>
            {": "}
            <span className={styles.cs}>{"'postgres:16'"}</span>
            {"\n"}
            {"    "}
            <span className={styles.ck}>env</span>
            {":"}
            {"\n"}
            {"      - "}
            <span className={styles.cs}>{"'POSTGRES_DB=testdb'"}</span>
            {"\n"}
            {"      - "}
            <span className={styles.cs}>{"'POSTGRES_PASSWORD=testpass'"}</span>
          </pre>
        </div>

        <h3>GitHub Actions での例</h3>
        <div className={styles.codeWrap}>
          <div className={styles.codeBar}>
            <div className={styles.dots}>
              <div className={`${styles.dot} ${styles.red}`} />
              <div className={`${styles.dot} ${styles.yel}`} />
              <div className={`${styles.dot} ${styles.grn}`} />
            </div>
            <span>.github/workflows/test.yaml</span>
          </div>
          <pre className={styles.codeBody}>
            <span className={styles.ck}>name</span>
            {": "}
            <span className={styles.cs}>Harness Test Pipeline</span>
            {"\n\n"}
            <span className={styles.ck}>on</span>
            {": [push, pull_request]"}
            {"\n\n"}
            <span className={styles.ck}>jobs</span>
            {":"}
            {"\n"}
            {"  "}
            <span className={styles.ck}>small-tests</span>
            {":"}
            {"\n"}
            {"    "}
            <span className={styles.ck}>runs-on</span>
            {": ubuntu-latest"}
            {"\n"}
            {"    "}
            <span className={styles.ck}>steps</span>
            {":"}
            {"\n"}
            {"      - "}
            <span className={styles.ck}>uses</span>
            {": actions/checkout@v4"}
            {"\n"}
            {"      - "}
            <span className={styles.ck}>uses</span>
            {": actions/setup-python@v5"}
            {"\n"}
            {"        "}
            <span className={styles.ck}>with</span>
            {": { python-version: "}
            <span className={styles.cs}>{"'3.12'"}</span>
            {" }"}
            {"\n"}
            {"      - "}
            <span className={styles.ck}>run</span>
            {": pip install -r requirements.txt"}
            {"\n"}
            {"      - "}
            <span className={styles.ck}>run</span>
            {": pytest -m small --cov=src --cov-report=xml"}
            {"\n\n"}
            {"  "}
            <span className={styles.ck}>medium-tests</span>
            {":"}
            {"\n"}
            {"    "}
            <span className={styles.ck}>runs-on</span>
            {": ubuntu-latest"}
            {"\n"}
            {"    "}
            <span className={styles.ck}>needs</span>
            {": small-tests  "}
            <span className={styles.cc}>{"# Small が通過してから Medium を実行"}</span>
            {"\n"}
            {"    "}
            <span className={styles.ck}>services</span>
            {":"}
            {"\n"}
            {"      "}
            <span className={styles.ck}>postgres</span>
            {":"}
            {"\n"}
            {"        "}
            <span className={styles.ck}>image</span>
            {": postgres:16"}
            {"\n"}
            {"        "}
            <span className={styles.ck}>env</span>
            {": { POSTGRES_DB: testdb, POSTGRES_PASSWORD: testpass }"}
            {"\n"}
            {"    "}
            <span className={styles.ck}>steps</span>
            {":"}
            {"\n"}
            {"      - "}
            <span className={styles.ck}>uses</span>
            {": actions/checkout@v4"}
            {"\n"}
            {"      - "}
            <span className={styles.ck}>uses</span>
            {": actions/setup-python@v5"}
            {"\n"}
            {"        "}
            <span className={styles.ck}>with</span>
            {": { python-version: "}
            <span className={styles.cs}>{"'3.12'"}</span>
            {" }"}
            {"\n"}
            {"      - "}
            <span className={styles.ck}>run</span>
            {": pip install -r requirements.txt"}
            {"\n"}
            {"      - "}
            <span className={styles.ck}>run</span>
            {": pytest -m medium"}
            {"\n"}
            {"        "}
            <span className={styles.ck}>env</span>
            {": { DB_HOST: localhost }"}
          </pre>
        </div>

        <h3>テスト実行時間の最適化戦略</h3>
        <div className={styles.tblWrap}>
          <table>
            <thead>
              <tr>
                <th>戦略</th>
                <th>効果</th>
                <th>実装方法</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>並列実行</code>
                </td>
                <td>実行時間を1/N に短縮</td>
                <td>
                  <code>pytest-xdist -n auto</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>シャーディング</code>
                </td>
                <td>大規模テストを複数マシンに分散</td>
                <td>
                  <code>--shard-index 0 --num-shards 4</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>キャッシング</code>
                </td>
                <td>依存インストール時間を省略</td>
                <td>
                  GitHub Actions <code>actions/cache</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>変更影響テスト</code>
                </td>
                <td>変更に関連するテストのみ実行</td>
                <td>
                  <code>pytest-testmon</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="s9" className={styles.sec}>
        <h2 className={styles.secTitle}>
          <span className={styles.n}>09.</span>AIエージェント評価ハーネス
        </h2>
      </section>

      <section id="s10" className={styles.sec}>
        <h2 className={styles.secTitle}>
          <span className={styles.n}>10.</span>ベストプラクティス10則
        </h2>
      </section>

      <section id="s11" className={styles.sec}>
        <h2 className={styles.secTitle}>
          <span className={styles.n}>11.</span>参考ソース一覧
        </h2>
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
