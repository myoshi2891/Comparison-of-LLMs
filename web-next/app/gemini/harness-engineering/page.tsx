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
        <h2 className={styles.secTitle}><span className={styles.n}>03.</span>テストハーネスを構成する5つの要素</h2>
      </section>

      <section id="s4" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>04.</span>テストダブル — 替え玉の4種類</h2>
      </section>

      <section id="s5" className={styles.sec}>
        <h2 className={styles.secTitle}><span className={styles.n}>05.</span>ハーミティックテスト — 孤立した清潔なテスト</h2>
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
