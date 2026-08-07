import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "git worktreeで実現する並列開発ベストプラクティスガイド",
  description:
    "AIコーディングエージェント時代に再注目される git worktree。内部構造からClaude Code / OpenAI Codex / Cursorとの統合、依存関係の分離、トラブルシューティングまでをステップバイステップで解説します。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const DIAGRAM_1_1 = `flowchart TB
    A["feature-A ブランチで作業中"] --> B["緊急バグ報告が届く"]
    B --> C["git stash で作業を退避"]
    C --> D["git checkout main<br/>git pull origin main"]
    D --> E["git checkout -b hotfix/bug"]
    E --> F["修正・コミット・push・PR作成"]
    F --> G["git checkout feature-A"]
    G --> H["git stash pop で作業を復元"]
    H --> I["コンテキストを思い出しながら作業再開"]

    style B fill:#7c1d1d,stroke:#ff8080,color:#fff
    style C fill:#5a3d00,stroke:#ffcc66,color:#fff
    style H fill:#5a3d00,stroke:#ffcc66,color:#fff
    style I fill:#7c1d1d,stroke:#ff8080,color:#fff`;

const DIAGRAM_2_1 = `flowchart TB
    subgraph SHARED[" "]
        direction TB
        OBJ["共有オブジェクトDB<br/>(コミット・ブランチ・タグ・blob)<br/>メインリポジトリの .git ディレクトリ"]
    end
    OBJ --> W1["worktree: main<br/>独自のHEAD / index / 作業ファイル"]
    OBJ --> W2["worktree: feature-auth<br/>独自のHEAD / index / 作業ファイル"]
    OBJ --> W3["worktree: hotfix-payment<br/>独自のHEAD / index / 作業ファイル"]

    style OBJ fill:#1d3a5f,stroke:#7c9eff,color:#fff
    style W1 fill:#123524,stroke:#4caf7d,color:#fff
    style W2 fill:#123524,stroke:#4caf7d,color:#fff
    style W3 fill:#123524,stroke:#4caf7d,color:#fff`;

const DIAGRAM_5_4 = `sequenceDiagram
    participant Dev as 開発者
    participant Agent1 as エージェント1<br/>(worktree: feat-auth)
    participant Agent2 as エージェント2<br/>(worktree: feat-payments)
    participant Git as 共有Gitオブジェクト
    participant PR as プルリクエスト

    Dev->>Git: git worktree add feat-auth
    Dev->>Git: git worktree add feat-payments
    Dev->>Agent1: 認証まわりの実装を依頼
    Dev->>Agent2: 決済まわりの実装を依頼
    par 並列実行
        Agent1->>Agent1: 編集・テスト実行・コミット
    and
        Agent2->>Agent2: 編集・テスト実行・コミット
    end
    Agent1-->>Dev: 差分レビューを依頼
    Agent2-->>Dev: 差分レビューを依頼
    Dev->>PR: feat-auth をPR化
    Dev->>PR: feat-payments をPR化
    PR-->>Git: レビュー後mainへマージ
    Dev->>Git: git worktree remove feat-auth
    Dev->>Git: git worktree remove feat-payments`;

const DIAGRAM_6_4 = `flowchart TB
    A["新しいworktreeを作成した"] --> B{"依存関係マネージャーは<br/>グローバルストア/キャッシュを持つか?<br/>(pnpm / uv 等)"}
    B -- "Yes" --> C["グローバルストア機能を有効化し<br/>通常どおりinstall/syncを実行<br/>(ダウンロード不要・ほぼ瞬時)"]
    B -- "No(npm/yarn等)" --> D{"全worktreeの依存関係は<br/>完全に一致しているか?"}
    D -- "Yes" --> E["node_modulesをsymlinkで共有<br/>(簡易・ただし分岐に弱い)"]
    D -- "No" --> F["worktreeごとに npm ci を実行<br/>(lockfileベースの決定的install)"]
    C --> G[".envは.env.exampleから<br/>都度コピーする"]
    E --> G
    F --> G

    style C fill:#123524,stroke:#4caf7d,color:#fff
    style F fill:#123524,stroke:#4caf7d,color:#fff
    style E fill:#5a3d00,stroke:#ffcc66,color:#fff`;

const DIAGRAM_12_5 = `flowchart TB
    A["worktree関連のエラーが発生"] --> B{"エラー内容は?"}
    B -- "既に他のworktreeで<br/>チェックアウト済みというエラー" --> C["同じブランチを2箇所で<br/>チェックアウトすることはできない<br/>→ 別ブランチ名にするか<br/>--force で強制(注意して使用)"]
    B -- "パスが見つからない/<br/>リンクが壊れている" --> D["mvで直接移動していないか確認<br/>→ git worktree repair を実行"]
    B -- "prune対象なのに消えない" --> E["git worktree lock されていないか確認<br/>→ unlock してから remove"]
    B -- "submodule絡みのエラー" --> F["submoduleを含むworktreeの<br/>move/remove制限を確認<br/>→ 公式ドキュメントの制約を参照"]
    B -- "ディスク容量エラー" --> G["git worktree list で全worktreeを棚卸し<br/>→ マージ済みブランチのworktreeをremove"]

    style C fill:#5a3d00,stroke:#ffcc66,color:#fff
    style D fill:#5a3d00,stroke:#ffcc66,color:#fff
    style E fill:#5a3d00,stroke:#ffcc66,color:#fff
    style F fill:#5a3d00,stroke:#ffcc66,color:#fff
    style G fill:#5a3d00,stroke:#ffcc66,color:#fff`;

export default function GitWorktreePage() {
  return (
    <div className={styles.layout}>
      <TocObserver />

      <aside className={styles.sidebar} id="gitWorktreeSidebar">
        <div className={styles.brand}>
          <div className={styles.brandIcon}>🌳</div>
          <div>
            <div className={styles.brandText}>
              git worktree
              <br />
              並列開発ガイド
            </div>
            <div className={styles.brandSub}>中級者〜上級者向け</div>
          </div>
        </div>
        <nav className={styles.sidebarNav}>
          <a href="#1-なぜ今-git-worktree-なのか">なぜ今 git worktree なのか</a>
          <a href="#2-git-worktreeの仕組みを理解する">git worktreeの仕組みを理解する</a>
          <a href="#3-基本コマンドリファレンス">基本コマンドリファレンス</a>
          <a href="#4-ディレクトリ設計と命名規則のベストプラクティス">
            ディレクトリ設計と命名規則のベストプラクティス
          </a>
          <a href="#5-aiコーディングエージェントとの統合">AIコーディングエージェントとの統合</a>
          <a href="#6-依存関係と環境分離の課題を解決する">依存関係と環境分離の課題を解決する</a>
          <a href="#7-ポート衝突と開発サーバーの分離">ポート衝突と開発サーバーの分離</a>
          <a href="#8-自動化スクリプトとgit-hooks">自動化スクリプトとGit Hooks</a>
          <a href="#9-ideエディタ統合の現状">IDE・エディタ統合の現状</a>
          <a href="#10-ブランチ戦略とcicdレビューへの統合">ブランチ戦略とCI/CD・レビューへの統合</a>
          <a href="#11-コンテナサンドボックスとの組み合わせ">
            コンテナ・サンドボックスとの組み合わせ
          </a>
          <a href="#12-よくある落とし穴とトラブルシューティング">
            よくある落とし穴とトラブルシューティング
          </a>
          <a href="#13-運用ベストプラクティスチェックリスト">
            運用ベストプラクティスチェックリスト
          </a>
          <a href="#14-まとめ">まとめ</a>
          <a href="#15-参考文献">参考文献</a>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>🌳 GIT WORKTREE PLAYBOOK</span>
          <h1>
            git worktreeで実現する
            <br />
            並列開発ベストプラクティスガイド
          </h1>
          <p className={styles.lede}>
            AIコーディングエージェント時代に再注目される git worktree。内部構造からClaude Code /
            OpenAI Codex /
            Cursorとの統合、依存関係の分離、トラブルシューティングまでをステップバイステップで解説します。
          </p>
          <div className={styles.metaRow}>
            <div className={styles.metaPill}>
              <span className={styles.k}>対象読者</span>
              <span className={styles.v}>中級者〜上級者エンジニア</span>
            </div>
            <div className={styles.metaPill}>
              <span className={styles.k}>前提バージョン</span>
              <span className={styles.v}>Git 2.5以降(推奨 2.40+)</span>
            </div>
            <div className={styles.metaPill}>
              <span className={styles.k}>情報基準日</span>
              <span className={styles.v}>2026年7月31日</span>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          <blockquote className={styles.blockquote}>
            <p>
              対象読者: Gitの基本操作(clone/branch/merge)に習熟した中級者〜上級者エンジニア
              前提バージョン: Git 2.5以降(<code className={styles.inlineCode}>git worktree</code>
              が導入されたバージョン)。コマンド例はGit 2.40以降での動作を想定
              本ガイドの情報は2026年7月31日時点のWeb検索結果に基づいています。各セクション末尾および巻末の「参考文献」に出典URLを明記しています。
            </p>
          </blockquote>

          <h2 id="1-なぜ今-git-worktree-なのか">
            <span className={styles.chapterNum}>1</span>
            <span>なぜ今 git worktree なのか</span>
          </h2>
          <p>
            <code className={styles.inlineCode}>git worktree</code>はGit
            2.5(2015年7月リリース)で導入された機能で、10年以上前から存在します。にもかかわらず、2025年後半から2026年にかけて急速に注目を集めています。GitHub公式ブログも「worktreeは最近の&quot;最新の流行&quot;のように見えるが、実際には2015年からある」と紹介した上で、その再燃ぶりを解説しています。
          </p>
          <p>
            背景にあるのは、Claude Code・OpenAI
            Codex・Cursorといった自律型AIコーディングエージェントの普及です。1つのエージェントに1つの作業ディレクトリを与えて並列に走らせるというワークフローが一般化し、その「ファイルシステムレベルの隔離」を実現する軽量な手段としてworktreeが再発見されました。Claude
            Codeの作成者であるBoris
            Cherny氏は、3〜5個のworktreeを同時に立ち上げ、それぞれで独立したClaudeセッションを並列実行することを、チーム内で最も生産性向上に寄与した習慣として自身のXアカウントで紹介しています。また著名な開発者向けニュースレターを書くSimon
            Willison氏も、複数のcheckoutやworktreeにまたがって同時に複数のコーディングエージェントを走らせる開発スタイルへと自身が移行していった経緯を2025年10月のニュースレターで綴っています。
          </p>

          <h3 id="11-従来のワークフローの限界">1.1 従来のワークフローの限界</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_1_1} />
          </div>
          <p>
            worktreeを使わない世界では、割り込みタスクが発生するたびに「stash → checkout → 作業 →
            checkout戻し → stash
            pop」という手順が必要です。stashのコンフリクトや、戻したときにコンテキストを再構築するコストは、AIエージェントを使った並列作業では致命的なボトルネックになります。エージェントは高速にコードを生成しますが、その分だけレビュー側の人間がボトルネックになりやすく、複数タスクを同時並行で仕掛けて「待ち時間」を圧縮したいというモチベーションが強くなっています。
          </p>

          <h3 id="12-worktreeが解決する問題">1.2 worktreeが解決する問題</h3>
          <ul>
            <li>
              <strong>ブランチ切り替えなしの並列作業</strong>:
              別ディレクトリに別ブランチをチェックアウトできるため、stashが不要になる
            </li>
            <li>
              <strong>AIエージェントのファイルシステム隔離</strong>:
              複数のエージェントが同じファイルを同時に編集して壊し合う「ファイル衝突」「コンテキスト汚染」を防げる
            </li>
            <li>
              <strong>軽量なクローンの代替</strong>: フルクローンを何度も作る必要がなく、
              <code className={styles.inlineCode}>.git</code>
              オブジェクトデータベースを共有するため高速かつ省ディスク
            </li>
          </ul>
          <p>
            一方で、worktreeは万能ではありません。各worktreeは独立した作業ディレクトリなので、
            <code className={styles.inlineCode}>node_modules</code>や
            <code className={styles.inlineCode}>.env</code>
            などGit管理外のファイルは共有されず、依存関係のインストールをworktreeごとに行う必要があります(詳細は
            <a href="#6-依存関係と環境分離の課題を解決する">第6章</a>)。
          </p>

          <h2 id="2-git-worktreeの仕組みを理解する">
            <span className={styles.chapterNum}>2</span>
            <span>git worktreeの仕組みを理解する</span>
          </h2>
          <h3 id="21-内部構造">2.1 内部構造</h3>
          <p>
            worktreeを使うと、リポジトリは「メインの作業ディレクトリ」と「リンクされた複数の作業ディレクトリ(linked
            worktree)」から構成されるようになります。すべてのworktreeは同じ
            <code className={styles.inlineCode}>.git</code>
            オブジェクトデータベース(コミット・ブランチ・タグ・blobなど)を共有しますが、
            <code className={styles.inlineCode}>HEAD</code>
            ・インデックス(ステージング領域)・作業ファイルはworktreeごとに独立しています。これはGit公式ドキュメントが定義する挙動そのもので、コマンド仕様は
            <code className={styles.inlineCode}>git-scm.com/docs/git-worktree</code>
            に整理されています。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_2_1} />
          </div>
          <blockquote>
            <p>
              注記: 上図は概念上の1段階の関係(共有オブジェクトDB →
              各worktree)のみを表しています。実際には各リンクされたworktreeの
              <code className={styles.inlineCode}>.git</code>
              は「ファイル」であり、メインリポジトリの
              <code className={styles.inlineCode}>.git/worktrees/&lt;name&gt;/</code>
              配下にある管理領域を指すポインタです。
            </p>
          </blockquote>

          <h3 id="22-ディレクトリ構成のイメージ">2.2 ディレクトリ構成のイメージ</h3>
          <p>
            実際にディレクトリを作ると、以下のような構成になります(ASCIIの罫線ではなく階層構造として整理します)。
          </p>
          <ul>
            <li>
              <code className={styles.inlineCode}>my-project/</code> (メインの作業ディレクトリ、
              <code className={styles.inlineCode}>main</code>ブランチ)
              <ul>
                <li>
                  <code className={styles.inlineCode}>src/</code>
                </li>
                <li>
                  <code className={styles.inlineCode}>.git/</code>{" "}
                  (実データを持つ本体のGitディレクトリ)
                </li>
              </ul>
            </li>
            <li>
              <code className={styles.inlineCode}>my-project-feat-auth/</code> (linked worktree、
              <code className={styles.inlineCode}>feat/auth</code>ブランチ)
              <ul>
                <li>
                  <code className={styles.inlineCode}>src/</code>
                </li>
                <li>
                  <code className={styles.inlineCode}>.git</code> (ファイル。本体の
                  <code className={styles.inlineCode}>.git</code>を指すポインタ)
                </li>
              </ul>
            </li>
            <li>
              <code className={styles.inlineCode}>my-project-hotfix-payment/</code> (linked
              worktree、<code className={styles.inlineCode}>hotfix/payment</code>ブランチ)
              <ul>
                <li>
                  <code className={styles.inlineCode}>src/</code>
                </li>
                <li>
                  <code className={styles.inlineCode}>.git</code> (ファイル。本体の
                  <code className={styles.inlineCode}>.git</code>を指すポインタ)
                </li>
              </ul>
            </li>
          </ul>
          <p>
            <code className={styles.inlineCode}>ls -la</code>で
            <code className={styles.inlineCode}>.git</code>
            を見ると、メインリポジトリでは通常のディレクトリですが、linked worktree側では中身が
            <code className={styles.inlineCode}>
              gitdir: /path/to/my-project/.git/worktrees/my-project-feat-auth
            </code>
            のようなテキストファイルになっています。これによりブランチ・コミット履歴・タグはすべて即座に全worktreeへ反映されますが、作業ファイルとステージング状態は完全に独立します。
          </p>

          <h3 id="23-従来のcloneとの違い">2.3 従来のcloneとの違い</h3>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>
                    <code className={styles.inlineCode}>git clone</code>(複数クローン)
                  </th>
                  <th>
                    <code className={styles.inlineCode}>git worktree</code>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ディスク使用量</td>
                  <td>クローンごとにフルコピー(大きい)</td>
                  <td>オブジェクトDBを共有(軽量)</td>
                </tr>
                <tr>
                  <td>新規作成の速度</td>
                  <td>リモートからの再クローンが必要な場合がある</td>
                  <td>
                    ローカルで一瞬(<code className={styles.inlineCode}>git worktree add</code>)
                  </td>
                </tr>
                <tr>
                  <td>ブランチ・タグの同期</td>
                  <td>それぞれ個別にfetchが必要</td>
                  <td>即座に全worktreeで共有</td>
                </tr>
                <tr>
                  <td>ローカルブランチの一意性</td>
                  <td>各クローンで同名ブランチをチェックアウト可能</td>
                  <td>
                    同じブランチを2つのworktreeで同時にチェックアウトすることはできない(強制するには
                    <code className={styles.inlineCode}>--force</code>が必要)
                  </td>
                </tr>
                <tr>
                  <td>submodule対応</td>
                  <td>問題なし</td>
                  <td>
                    制限あり(詳細は<a href="#121-submoduleの制限">12.1</a>)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="3-基本コマンドリファレンス">
            <span className={styles.chapterNum}>3</span>
            <span>基本コマンドリファレンス</span>
          </h2>
          <p>
            <code className={styles.inlineCode}>git worktree</code>
            のサブコマンドを一通り押さえておくと、後続のワークフロー構築がスムーズになります。
          </p>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>サブコマンド</th>
                  <th>用途</th>
                  <th>代表的な使用例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>add</code>
                  </td>
                  <td>新しいworktreeを作成</td>
                  <td>
                    <code className={styles.inlineCode}>
                      git worktree add ../feat-auth feat/auth
                    </code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>add -b</code>
                  </td>
                  <td>新規ブランチを同時作成してworktree化</td>
                  <td>
                    <code className={styles.inlineCode}>
                      git worktree add -b feat/auth ../feat-auth origin/main
                    </code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>list</code>
                  </td>
                  <td>全worktreeの一覧と状態を表示</td>
                  <td>
                    <code className={styles.inlineCode}>git worktree list --porcelain</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>remove</code>
                  </td>
                  <td>worktreeを削除(作業ディレクトリごと)</td>
                  <td>
                    <code className={styles.inlineCode}>git worktree remove ../feat-auth</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>prune</code>
                  </td>
                  <td>手動削除などで壊れたworktree管理情報を掃除</td>
                  <td>
                    <code className={styles.inlineCode}>git worktree prune -v</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>lock</code>
                  </td>
                  <td>誤削除・自動pruneを防止(リムーバブルメディア等)</td>
                  <td>
                    <code className={styles.inlineCode}>
                      git worktree lock ../feat-auth --reason &quot;外付けSSD上&quot;
                    </code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>unlock</code>
                  </td>
                  <td>ロック解除</td>
                  <td>
                    <code className={styles.inlineCode}>git worktree unlock ../feat-auth</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>move</code>
                  </td>
                  <td>worktreeを別パスへ安全に移動</td>
                  <td>
                    <code className={styles.inlineCode}>
                      git worktree move ../feat-auth ../archive/feat-auth
                    </code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>repair</code>
                  </td>
                  <td>パス変更などで壊れたリンクを修復</td>
                  <td>
                    <code className={styles.inlineCode}>git worktree repair</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 id="31-ステップバイステップ-最初のworktreeを作る">
            3.1 ステップバイステップ: 最初のworktreeを作る
          </h3>
          <ol type="1">
            <li>
              <p>
                <strong>現在のブランチ構成を確認する</strong>
              </p>
              <pre className={styles.codeBlock}>
                <code>git branch -a git worktree list</code>
              </pre>
            </li>
            <li>
              <p>
                <strong>新しいworktreeを作成する(既存ブランチの場合)</strong>
              </p>
              <pre className={styles.codeBlock}>
                <code>git worktree add ../my-project-feat-auth feat/auth</code>
              </pre>
            </li>
            <li>
              <p>
                <strong>新しいworktreeを作成する(新規ブランチを同時に切る場合)</strong>
              </p>
              <pre className={styles.codeBlock}>
                <code>
                  git worktree add -b feat/payment-refactor ../my-project-payment-refactor
                  origin/main
                </code>
              </pre>
            </li>
            <li>
              <p>
                <strong>作成されたworktreeに移動して作業する</strong>
              </p>
              <pre className={styles.codeBlock}>
                <code>cd ../my-project-feat-auth git status</code>
              </pre>
            </li>
            <li>
              <p>
                <strong>作業が終わったら安全に片付ける</strong>
              </p>
              <pre className={styles.codeBlock}>
                <code>
                  cd ../my-project # メインの作業ディレクトリへ戻る git worktree remove
                  ../my-project-feat-auth git worktree prune -v # 管理情報の掃除(念のため)
                </code>
              </pre>
            </li>
          </ol>
          <blockquote>
            <p>
              重要: worktreeのディレクトリを<code className={styles.inlineCode}>mv</code>
              コマンドで直接移動してはいけません。メインリポジトリとの双方向リンクが壊れます。移動する場合は必ず
              <code className={styles.inlineCode}>git worktree move</code>
              を使用してください。もし壊れてしまった場合は
              <code className={styles.inlineCode}>git worktree repair</code>で修復を試みます。
            </p>
          </blockquote>

          <h2 id="4-ディレクトリ設計と命名規則のベストプラクティス">
            <span className={styles.chapterNum}>4</span>
            <span>ディレクトリ設計と命名規則のベストプラクティス</span>
          </h2>
          <h3 id="41-兄弟ディレクトリパターン-vs-bareリポジトリパターン">
            4.1 兄弟ディレクトリパターン vs bareリポジトリパターン
          </h3>
          <p>実務でよく使われる構成は大きく2つに分かれます。</p>
          <h4 id="パターンa-兄弟ディレクトリパターンシンプル">
            パターンA: 兄弟ディレクトリパターン(シンプル)
          </h4>
          <ul>
            <li>
              <code className={styles.inlineCode}>my-project/</code> (通常のクローン、
              <code className={styles.inlineCode}>main</code>を作業)
            </li>
            <li>
              <code className={styles.inlineCode}>my-project-feat-123-auth/</code> (worktree)
            </li>
            <li>
              <code className={styles.inlineCode}>my-project-feat-456-payments/</code> (worktree)
            </li>
            <li>
              <code className={styles.inlineCode}>my-project-bugfix-789-login/</code> (worktree)
            </li>
          </ul>
          <h4 id="パターンb-bareリポジトリ--worktree群推奨スケールしやすい">
            パターンB: bareリポジトリ + worktree群(推奨・スケールしやすい)
          </h4>
          <ul>
            <li>
              <code className={styles.inlineCode}>my-project.git/</code> (
              <code className={styles.inlineCode}>git clone --bare</code>
              で作った実データのみのベアリポジトリ)
            </li>
            <li>
              <code className={styles.inlineCode}>my-project/main/</code> (worktree)
            </li>
            <li>
              <code className={styles.inlineCode}>my-project/feat-auth/</code> (worktree)
            </li>
            <li>
              <code className={styles.inlineCode}>my-project/fix-api/</code> (worktree)
            </li>
          </ul>
          <p>
            pnpm公式ドキュメントは、AIエージェントによるマルチエージェント並列開発向けの構成例として、まさにこのbareリポジトリ
            +
            複数worktreeという構成をベストプラクティスとして紹介しています。「作業対象になりうるメインの作業ディレクトリ」という特別扱いが存在しないため、全worktreeが対等に扱え、命名の一貫性も保ちやすいという利点があります。
          </p>
          <pre className={styles.codeBlock}>
            <code>
              # パターンB: bareリポジトリから始める git clone --bare
              https://github.com/your-org/your-project.git your-project.git cd your-project.git git
              worktree add ../your-project/main main git worktree add ../your-project/feat-auth
              feat/auth
            </code>
          </pre>

          <h3 id="42-命名規則">4.2 命名規則</h3>
          <p>
            ディレクトリ名は「一目で何をしているかわかる」ことが最重要です。プロジェクト名 + 種別 +
            チケット番号 +
            短い説明、という組み合わせが実務でよく採用されるパターンとして紹介されています。
          </p>
          <ul>
            <li>
              <code className={styles.inlineCode}>my-project-feat-123-auth/</code>
            </li>
            <li>
              <code className={styles.inlineCode}>my-project-feat-456-payments/</code>
            </li>
            <li>
              <code className={styles.inlineCode}>my-project-bugfix-789-login/</code>
            </li>
          </ul>
          <p>
            ブランチ名とディレクトリ名を一致させておくと、
            <code className={styles.inlineCode}>git worktree list</code>
            の出力とファイラー上の見た目が対応し、複数のターミナルタブやAIエージェントセッションを混同するリスクが下がります。
          </p>

          <h3 id="43-worktree数の実務的な上限">4.3 worktree数の実務的な上限</h3>
          <p>
            明確なハード上限はGit自体には存在しませんが、実務上の運用複雑度から、多くのチームは同時稼働worktreeを8〜10個程度に抑えることを推奨しています。それ以上になると、どのworktreeで何をしているかの管理コストが並列化のメリットを上回ってしまうためです。Claude
            Code開発チームの実践では3〜5個程度が「ちょうどよい」範囲として語られることが多く、これは人間のレビュー速度がボトルネックになりやすいためと考えられます。
          </p>

          <h2 id="5-aiコーディングエージェントとの統合">
            <span className={styles.chapterNum}>5</span>
            <span>AIコーディングエージェントとの統合</span>
          </h2>
          <p>
            git
            worktreeが2025〜2026年にかけて再注目された最大の理由は、AIコーディングエージェントとの相性の良さです。GitButlerやZylos
            Researchなどの技術系メディアも、worktreeが複数のAIエージェントを同一コードベース上で並列稼働させるための「支配的な隔離プリミティブ」になったと指摘しています。ここではエージェント別の統合状況を整理します。
          </p>

          <h3 id="51-claude-codeの統合">5.1 Claude Codeの統合</h3>
          <p>
            Claude Code公式ドキュメントによれば、Claude
            Codeはworktreeをネイティブにサポートしており、
            <code className={styles.inlineCode}>claude --worktree</code>(短縮形
            <code className={styles.inlineCode}>-w</code>
            )で新しいセッションを専用worktree内に起動できます。デスクトップアプリでは新規セッションごとに自動的にworktreeが割り当てられる挙動になっています。さらにサブエージェントの定義(frontmatter)に
            <code className={styles.inlineCode}>isolation: worktree</code>
            を指定すると、そのサブエージェントは常に専用worktreeの中で並列編集を行うようになり、複数のサブエージェント同士のファイル衝突を防げます。非gitのバージョン管理システムを使っている場合は、
            <code className={styles.inlineCode}>WorktreeCreate</code>
            フックを実装することでworktree作成ロジックを差し替えられます。
          </p>
          <p>
            前述の通り、Boris Cherny氏(Claude
            Code作成者)は3〜5個のworktreeを並列で立ち上げてそれぞれに独立したClaudeセッションを走らせる運用を、チーム内で最も効果があった生産性向上策として紹介しています。
          </p>

          <h3 id="52-openai-codexの統合">5.2 OpenAI Codexの統合</h3>
          <p>
            OpenAI Codex(ChatGPT内のCodexモード)にもWorktreeモードが用意されています。Developer
            Toolkitの解説記事によれば、worktreeモードを使うとCodexは1つのworktree内でテスト実行・依存関係インストール・ファイル編集を行いながら、ユーザーは別のworktreeで並行して作業を続けられます。作業内容を確認できたら、スレッドヘッダーから名前付きブランチとして確定させたり、統合ターミナルやIDE連携ボタンからそのworktreeを直接開いたりできます。逆に、開発サーバーが1つしか起動できないなど「メインの作業コピーに直接変更を反映したい」場合は、worktreeを使わない通常モードの方が適しているとも説明されています。
          </p>

          <h3 id="53-cursorの統合">5.3 Cursorの統合</h3>
          <p>
            Cursorも2025年後半以降、Agentモードやバックグラウンドエージェントの並列実行にworktreeを活用する機能を追加しています。JetBrains系IDEやVS
            CodeでのGit連携強化(後述の<a href="#9-ideエディタ統合の現状">第9章</a>
            )とあわせて、エージェントを立ち上げるたびに専用worktreeを自動生成し、完了後にマージ候補としてdiffを提示する、という体験が業界標準になりつつあります。
          </p>

          <h3 id="54-並列エージェント運用フローシーケンス図">
            5.4 並列エージェント運用フロー(シーケンス図)
          </h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_5_4} />
          </div>

          <h3 id="55-タスク設計上の注意">5.5 タスク設計上の注意</h3>
          <p>
            MindStudioの実践ガイドが強調しているように、並列セッションを立ち上げる際は、エージェントに与える指示を「認証まわりを改善して」のような曖昧な指示ではなく、「認証ミドルウェアをJWTベースに置き換える」のように具体的でスコープの明確なタスクにすることが重要です。指示が曖昧なほどコンテキストの肥大化(コンテキストロット)を招きやすく、並列実行のメリットを打ち消してしまいます。また、複数worktreeで何が進行中かを見失わないよう、
            <code className={styles.inlineCode}>git worktree list</code>
            やタスク管理ツールでの状況把握を習慣化することも推奨されています。
          </p>

          <h2 id="6-依存関係と環境分離の課題を解決する">
            <span className={styles.chapterNum}>6</span>
            <span>依存関係と環境分離の課題を解決する</span>
          </h2>
          <p>
            worktreeが共有するのはGitが追跡するファイルだけです。
            <code className={styles.inlineCode}>node_modules</code>・Python仮想環境・
            <code className={styles.inlineCode}>.env</code>のようなGit管理外(
            <code className={styles.inlineCode}>.gitignore</code>
            対象)のファイルはworktreeごとに個別に用意する必要があります。ここが並列開発における最大の運用コストになりがちです。
          </p>

          <h3 id="61-node_modules問題">6.1 node_modules問題</h3>
          <p>
            素朴に各worktreeで<code className={styles.inlineCode}>npm install</code>
            を都度実行すると、依存関係のダウンロードとインストールに時間がかかるだけでなく、worktreeの数だけディスクを消費します(例:
            2GBのプロジェクトを5個のworktreeで展開すると単純計算で10GB近く消費)。
          </p>
          <p>対処法を比較すると次のようになります。</p>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>手法</th>
                  <th>概要</th>
                  <th>メリット</th>
                  <th>リスク・注意点</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    worktreeごとに<code className={styles.inlineCode}>npm install</code>
                  </td>
                  <td>最も素朴な方法</td>
                  <td>依存関係の食い違いが起きない</td>
                  <td>時間がかかる/ディスクを消費する</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>npm ci</code>
                  </td>
                  <td>lockfileから決定的インストール</td>
                  <td>
                    依存関係解決をスキップできるため
                    <code className={styles.inlineCode}>npm install</code>より高速
                  </td>
                  <td>それでもworktreeごとに実データが必要</td>
                </tr>
                <tr>
                  <td>
                    <code className={styles.inlineCode}>node_modules</code>をsymlinkで共有
                  </td>
                  <td>
                    1つのworktreeの<code className={styles.inlineCode}>node_modules</code>
                    を他からシンボリックリンク
                  </td>
                  <td>一瞬でセットアップ完了</td>
                  <td>
                    依存関係が分岐(<code className={styles.inlineCode}>package.json</code>
                    が変わる)すると壊れる。同一依存関係の場合のみ安全
                  </td>
                </tr>
                <tr>
                  <td>pnpmの共有ストア(推奨)</td>
                  <td>コンテンツアドレス方式のグローバルストアを全worktreeで共有</td>
                  <td>ダウンロード・ディスク使用量がほぼ増えない。依存関係が分岐しても安全</td>
                  <td>
                    pnpm固有の<code className={styles.inlineCode}>node_modules</code>
                    構造への移行が必要
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            pnpm公式ドキュメントは、
            <code className={styles.inlineCode}>enableGlobalVirtualStore: true</code>
            を設定したグローバル仮想ストアを使うことで、各worktreeの
            <code className={styles.inlineCode}>node_modules</code>
            が実体を持たずシンボリックリンクのみで構成される運用を、マルチエージェント開発向けの推奨パターンとして公開しています。この設定では、新しいworktreeを追加してもパッケージは既にグローバルストアに存在するため、インストールがほぼ瞬時に終わります。ただし、この共有ストアは「同じ信頼境界内にいる」エージェント・利用者同士でのみ使うべきで、互いに信頼できないエージェント間で書き込み可能な共有ストアを使うことは避けるべきだと明記されています。
          </p>
          <pre className={styles.codeBlock}>
            <code>
              # pnpmのグローバル仮想ストアを有効化する例(.npmrc または pnpm-workspace.yaml) echo
              &quot;enable-global-virtual-store=true&quot; &gt;&gt; .npmrc #
              bareリポジトリ構成での運用例 git clone --bare
              https://github.com/your-org/your-monorepo.git your-monorepo cd your-monorepo git
              worktree add ./main main git worktree add ./feature-auth feat/auth # ←
              node_modulesは即座に利用可能
            </code>
          </pre>
          <p>
            symlinkによる直接共有(
            <code className={styles.inlineCode}>ln -s ../myapp/node_modules node_modules</code>
            )は、両方のworktreeの依存関係が完全に一致している場合のみ機能する簡易策として紹介されていますが、
            <code className={styles.inlineCode}>package.json</code>
            が分岐すると壊れるため、恒常運用には向きません。
          </p>

          <h3 id="62-env設定ファイルの扱い">6.2 .env・設定ファイルの扱い</h3>
          <p>
            <code className={styles.inlineCode}>.env</code>
            も同様にGit管理外であることが多いため、worktreeを作るたびに手動でコピーする必要があります。
          </p>
          <pre className={styles.codeBlock}>
            <code>
              # .env.example をリポジトリにコミットしておき、各worktreeで複製する運用 cp
              .env.example .env
            </code>
          </pre>

          <h3 id="63-pythonuvvenvの場合">6.3 Python(uv/venv)の場合</h3>
          <p>
            Python環境でも同様の課題があります。<code className={styles.inlineCode}>uv</code>
            はグローバルキャッシュ(<code className={styles.inlineCode}>~/.cache/uv</code>
            など)を持つため、worktreeごとに<code className={styles.inlineCode}>uv sync</code>
            を実行しても、パッケージ本体の再ダウンロードは基本的に発生しません。ただし仮想環境(
            <code className={styles.inlineCode}>.venv</code>
            )自体はworktreeごとに生成し直す必要があります。
          </p>

          <h3 id="64-意思決定フロー">6.4 意思決定フロー</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_6_4} />
          </div>

          <h2 id="7-ポート衝突と開発サーバーの分離">
            <span className={styles.chapterNum}>7</span>
            <span>ポート衝突と開発サーバーの分離</span>
          </h2>
          <p>
            複数worktreeで同時にローカル開発サーバーを起動すると、デフォルトポート(例:
            3000番)が衝突します。MindStudioの実践ガイドでは、worktreeごとにポート番号やデータベース名を分離する「ポート隔離」がClaude
            Codeを使った並列開発の必須プラクティスの1つとして挙げられています。
          </p>
          <p>対処法としては次のようなアプローチがあります。</p>
          <ul>
            <li>
              worktree名からハッシュ値や連番を生成し、
              <code className={styles.inlineCode}>.env</code>の
              <code className={styles.inlineCode}>PORT</code>変数に自動設定するスクリプトを用意する
            </li>
            <li>
              Docker Composeを使う場合は、worktreeごとに
              <code className={styles.inlineCode}>COMPOSE_PROJECT_NAME</code>
              を変えてコンテナ名・ネットワーク・ポートマッピングを分離する
            </li>
            <li>
              データベースも同様に、worktreeごとにスキーマやDBブランチ(マネージドDBのbranching機能)を分ける
            </li>
          </ul>
          <pre className={styles.codeBlock}>
            <code>
              # シンプルなポート自動割り当ての例(worktree名のハッシュ下位2桁を使う)
              WORKTREE_NAME=$(basename &quot;$PWD&quot;) PORT_OFFSET=$(( 0x$(echo -n
              &quot;$WORKTREE_NAME&quot; | md5sum | cut -c1-2) % 50 )) echo &quot;PORT=$((3000 +
              PORT_OFFSET))&quot; &gt;&gt; .env
            </code>
          </pre>

          <h2 id="8-自動化スクリプトとgit-hooks">
            <span className={styles.chapterNum}>8</span>
            <span>自動化スクリプトとGit Hooks</span>
          </h2>
          <p>
            worktree作成のたびに「作成 → 依存関係インストール →{" "}
            <code className={styles.inlineCode}>.env</code>コピー →
            ポート設定」を手動で行うのは非効率です。シェル関数として1コマンド化しておくと運用が大幅に楽になります。
          </p>
          <pre className={styles.codeBlock}>
            <code>
              # ~/.zshrc または ~/.bashrc に追加する例 gwt() &#123; local branch=&quot;$1&quot;
              local dir=&quot;../$(basename &quot;$(pwd)&quot;)-$(echo &quot;$branch&quot; | tr
              &apos;/&apos; &apos;-&apos;)&quot; git worktree add -b &quot;$branch&quot;
              &quot;$dir&quot; origin/main cd &quot;$dir&quot; || return #
              依存関係のセットアップ(プロジェクトに応じて調整) if [ -f pnpm-lock.yaml ]; then pnpm
              install elif [ -f package-lock.json ]; then npm ci fi # .envの用意 [ -f
              ../&quot;$(basename &quot;$(dirname &quot;$dir&quot;)&quot;)&quot;/.env ] &amp;&amp;
              cp ../&quot;$(basename &quot;$(dirname &quot;$dir&quot;)&quot;)&quot;/.env .env echo
              &quot;worktree &apos;$dir&apos; の準備が完了しました&quot; &#125;
            </code>
          </pre>
          <p>
            Gitフックを使う場合は、<code className={styles.inlineCode}>core.hooksPath</code>
            をリポジトリ共通の場所に向けておくと、全worktreeで同じフック(例:{" "}
            <code className={styles.inlineCode}>post-checkout</code>
            でのlintキャッシュクリア)を共有できます。ただしフック自体はworktree固有の状態(どのブランチで実行されたか等)を意識して書く必要があります。
          </p>

          <h2 id="9-ideエディタ統合の現状">
            <span className={styles.chapterNum}>9</span>
            <span>IDE・エディタ統合の現状</span>
          </h2>
          <p>
            2025年後半から2026年前半にかけて、主要IDE・エディタが軒並みworktreeのネイティブサポートを追加しました。バージョンや対応時期はツールによってばらつきがあるため、チームで導入する際は各ツールの対応状況を確認してください。
          </p>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ツール</th>
                  <th>対応状況</th>
                  <th>時期</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Visual Studio Code</td>
                  <td>Git連携機能にworktreeサポートを追加</td>
                  <td>2025年7月</td>
                </tr>
                <tr>
                  <td>JetBrains系IDE(IntelliJ IDEA等)</td>
                  <td>2026.1で正式サポート(EAP版ではレジストリキーが必要な期間あり)</td>
                  <td>2026年3月</td>
                </tr>
                <tr>
                  <td>GitHub Desktop</td>
                  <td>
                    3.6でworktreeサポートを追加。Copilotによるコミット作成・コンフリクト解消も同時搭載
                  </td>
                  <td>2026年6月26日</td>
                </tr>
                <tr>
                  <td>Claude Code</td>
                  <td>
                    <code className={styles.inlineCode}>--worktree</code>フラグ・サブエージェントの
                    <code className={styles.inlineCode}>isolation: worktree</code>
                    ・デスクトップアプリでの自動worktree割り当て
                  </td>
                  <td>継続的に機能拡張中</td>
                </tr>
                <tr>
                  <td>OpenAI Codex(ChatGPT)</td>
                  <td>Worktreeモードによる隔離実行、統合ターミナル/IDE起動ボタン</td>
                  <td>継続的に機能拡張中</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Augment
            Codeの技術ガイドは、IDEのworktree表示が実体を正しく反映しないケース(特に古いバージョンや一部プラグイン)があるため、
            <code className={styles.inlineCode}>git worktree list</code>や
            <code className={styles.inlineCode}>git status</code>
            をCLIで直接確認することを「worktree状態の正とする」運用を推奨しています。IDEの表示はあくまで補助であり、最終的な信頼源はCLI出力である、という原則を持っておくと事故を防げます。
          </p>
          <p>
            また同ガイドは、大規模モノレポでworktreeを多用する際、各worktreeがフルチェックアウトを持つことによるディスクI/O負荷が、ファイルウォッチャーやテストランナーの並列稼働と重なって顕在化しやすいと指摘し、
            <code className={styles.inlineCode}>git worktree add</code>と
            <code className={styles.inlineCode}>git sparse-checkout set &lt;paths&gt;</code>
            を組み合わせて、エージェントが実際に必要とするパスだけをチェックアウトする方法を提案しています。
          </p>

          <h2 id="10-ブランチ戦略とcicdレビューへの統合">
            <span className={styles.chapterNum}>10</span>
            <span>ブランチ戦略とCI/CD・レビューへの統合</span>
          </h2>
          <h3 id="101-rebase-before-prモデル">10.1 「Rebase Before PR」モデル</h3>
          <p>
            worktreeを使った並列開発でよく採用されるブランチ運用に、「Rebase Before
            PR」モデルがあります。これは、常に最新の<code className={styles.inlineCode}>main</code>
            から機能ブランチを切り、作業中も<code className={styles.inlineCode}>main</code>
            にrebaseし続け、PRを出す直前に最終rebaseを行うというシンプルな原則です。Zylos
            Researchの調査でも、この運用が複数worktreeを使った並列開発における最も広く推奨される規約だと紹介されています。手順の骨子は次のとおりです。
          </p>
          <ol type="1">
            <li>
              <strong>Start</strong>: 常に最新化された
              <code className={styles.inlineCode}>main</code>から新しい機能ブランチ・worktreeを作る
            </li>
            <li>
              <strong>Work</strong>: 各worktree内で隔離された状態で作業する
            </li>
            <li>
              <strong>Rebase</strong>: 作業中も定期的に
              <code className={styles.inlineCode}>main</code>の変更を取り込む(
              <code className={styles.inlineCode}>git fetch &amp;&amp; git rebase origin/main</code>
              )
            </li>
            <li>
              <strong>PR</strong>:
              完成したら最終rebaseを行い、履歴をクリーンな状態にしてからPRを作成する
            </li>
          </ol>

          <h3 id="102-cicdとの関係">10.2 CI/CDとの関係</h3>
          <p>
            GitHub側は、worktreeを使っていることを意識しません。GitWorktree.orgの整理によれば、worktreeからのpushは通常のブランチpushと完全に同一に扱われ、リモート(GitHubなど)にとってはローカルでworktreeを使っているかどうかは判別できません。つまりCI/CDパイプラインの設定自体を変更する必要はなく、既存のブランチベースのワークフロー(PR作成時にCIを起動する等)がそのまま機能します。重要なのは、各worktree内でCIと同じ条件でテストを実行できるようにしておくこと(依存関係・環境変数・DBスキーマの分離、
            <a href="#6-依存関係と環境分離の課題を解決する">第6章</a>・
            <a href="#7-ポート衝突と開発サーバーの分離">第7章</a>参照)です。
          </p>

          <h2 id="11-コンテナサンドボックスとの組み合わせ">
            <span className={styles.chapterNum}>11</span>
            <span>コンテナ・サンドボックスとの組み合わせ</span>
          </h2>
          <p>
            worktreeはファイルシステムレベルの隔離を提供しますが、データベースやOS依存のサービスレベルの隔離までは行いません。Zylos
            Researchの整理によれば、worktreeが有利なのは「エージェント同士が履歴を共有し、同じコードベース上で作業し、同じリモートへ戻すコミットを生成する」場合であり、逆にエージェントごとに隔離されたデータベースやサービス、OS依存関係が必要な場合はコンテナの方が有利だとされています。
          </p>
          <p>
            4エージェント以上を同時に動かす規模になると、「worktree(ファイル隔離) +
            軽量コンテナ(DB・サービス隔離)」というハイブリッド構成が実務上の標準になりつつあると同レポートは指摘しています。代表例として、DaggerのContainer
            Useというツールは、git
            worktreeとエージェントごとのコンテナ化されたサンドボックスを組み合わせることで、ファイルシステム隔離とサービス隔離の両方を同時に得るアプローチを取っています。
          </p>
          <p>
            なお、worktree自体の代替として「仮想ブランチ」という概念を提示するGitButlerのようなツールも存在します。GitButlerは複数のブランチの変更を1つの作業ディレクトリの中で同時に管理する設計を取っており、worktreeのように「別ディレクトリに切り出す」のではなく「1つの作業ディレクトリの中で複数ブランチを共存させる」という異なるアプローチを採用しています。どちらが適しているかはチームの運用スタイル次第ですが、worktreeが提供する「本当に別ディレクトリとして隔離されている」という性質は、AIエージェントに単独の作業領域を割り当てたい場面では特に相性が良いといえます。
          </p>

          <h2 id="12-よくある落とし穴とトラブルシューティング">
            <span className={styles.chapterNum}>12</span>
            <span>よくある落とし穴とトラブルシューティング</span>
          </h2>
          <h3 id="121-submoduleの制限">12.1 submoduleの制限</h3>
          <p>
            Gitの公式ドキュメントは、複数worktreeでのsubmoduleサポートは限定的であると明記しています。具体的には、メインの作業ディレクトリやsubmoduleを含むlinked
            worktreeは<code className={styles.inlineCode}>git worktree move</code>
            で単純移動できません(移動する場合は
            <code className={styles.inlineCode}>git worktree repair</code>
            でリンクを再確立する必要があります)。submoduleを多用するリポジトリでworktreeを導入する際は、事前に小規模な検証を行うことを推奨します。
          </p>

          <h3 id="122-ディスク容量の肥大化">12.2 ディスク容量の肥大化</h3>
          <p>
            各worktreeは完全な作業ファイルのコピーを保持するため、放置すると簡単にディスクを圧迫します。目安として、2GBのリポジトリを10個のworktreeで展開すると単純計算で20GB消費するという試算が紹介されています。マージ済み・不要になったブランチのworktreeはこまめに
            <code className={styles.inlineCode}>git worktree remove</code>することが基本です。
          </p>

          <h3 id="123-mvによる移動でリンクが壊れる">
            12.3 <code className={styles.inlineCode}>mv</code>による移動でリンクが壊れる
          </h3>
          <p>
            前述の通り、worktreeディレクトリをOSの<code className={styles.inlineCode}>mv</code>
            コマンドで直接移動すると、メインリポジトリとの双方向シンボリックリンクが壊れます。移動する際は必ず
            <code className={styles.inlineCode}>git worktree move &lt;old&gt; &lt;new&gt;</code>
            を使用してください。既に壊れてしまった場合は
            <code className={styles.inlineCode}>git worktree repair</code>で修復を試みます。
          </p>

          <h3 id="124-ロックされたworktreeの扱い">12.4 ロックされたworktreeの扱い</h3>
          <p>
            外付けディスクやネットワークドライブ上にworktreeを置いている場合、そのメディアが常時マウントされているとは限りません。そうした場合は
            <code className={styles.inlineCode}>
              git worktree lock --reason &quot;&lt;理由&gt;&quot;
            </code>
            でロックしておくことで、<code className={styles.inlineCode}>git worktree prune</code>
            による誤った自動削除を防げます。作業を終えたら
            <code className={styles.inlineCode}>git worktree unlock</code>で解除します。
          </p>

          <h3 id="125-トラブルシューティング決定木">12.5 トラブルシューティング決定木</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_12_5} />
          </div>

          <h2 id="13-運用ベストプラクティスチェックリスト">
            <span className={styles.chapterNum}>13</span>
            <span>運用ベストプラクティスチェックリスト</span>
          </h2>
          <div className={styles.checklistCard}>
            <ul className={styles.taskList}>
              <li>
                <label>
                  <input type="checkbox" />{" "}
                  worktreeのディレクトリ名にプロジェクト名・種別・チケット番号・短い説明を含めている
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" />{" "}
                  8〜10個を超える同時稼働worktreeを作らないよう運用している
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" /> <code className={styles.inlineCode}>node_modules</code>
                  はpnpmの共有ストア(または同等の仕組み)で管理し、依存関係の分岐リスクを避けている
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" /> <code className={styles.inlineCode}>.env</code>は
                  <code className={styles.inlineCode}>.env.example</code>
                  から都度コピーする運用が徹底されている
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" />{" "}
                  worktreeごとにポート番号・DBスキーマを分離し、開発サーバー同士の衝突を防いでいる
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" /> worktreeの移動は
                  <code className={styles.inlineCode}>mv</code>ではなく
                  <code className={styles.inlineCode}>git worktree move</code>を使っている
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" /> リムーバブルメディア上のworktreeは
                  <code className={styles.inlineCode}>git worktree lock</code>で保護している
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" /> マージ済み・不要になったworktreeを定期的に
                  <code className={styles.inlineCode}>git worktree remove</code> +{" "}
                  <code className={styles.inlineCode}>git worktree prune</code>で片付けている
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" />{" "}
                  AIエージェントに渡すタスクは具体的でスコープが明確になっている(曖昧な指示を避ける)
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" /> 「Rebase Before
                  PR」など、チーム内でブランチ運用ルールを明文化している
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" /> IDEのworktree表示に頼りきらず、
                  <code className={styles.inlineCode}>git worktree list</code>
                  をCLIで確認する習慣がある
                </label>
              </li>
            </ul>
          </div>

          <h2 id="14-まとめ">
            <span className={styles.chapterNum}>14</span>
            <span>まとめ</span>
          </h2>
          <p>
            <code className={styles.inlineCode}>git worktree</code>はGit
            2.5以来存在する枯れた機能ですが、AIコーディングエージェントによる並列開発という新しい文脈の中で、その価値が再発見されました。ポイントを整理すると以下のとおりです。
          </p>
          <ul>
            <li>
              worktreeは<strong>ファイルシステムレベルの隔離</strong>
              を軽量に実現し、stashに頼らないブランチ切り替えを可能にする
            </li>
            <li>
              Claude Code・OpenAI
              Codex・Cursorなど主要なAIコーディングツールがネイティブにworktreeを統合しており、複数エージェントの並列稼働のデファクトスタンダードになりつつある
            </li>
            <li>
              <code className={styles.inlineCode}>node_modules</code>や
              <code className={styles.inlineCode}>.env</code>
              などGit管理外のファイルの扱いが最大の運用課題であり、pnpmの共有ストアのような仕組みで解決するのが今のベストプラクティス
            </li>
            <li>
              実務上の上限(8〜10個程度)を意識し、命名規則・ポート分離・クリーンアップを徹底することで、並列開発のメリットを事故なく享受できる
            </li>
          </ul>

          <h2 id="15-参考文献">
            <span className={styles.chapterNum}>15</span>
            <span>参考文献</span>
          </h2>
          <div className={styles.refGrid}>
            <div className={styles.refCard}>
              <h3>Git公式ドキュメント</h3>
              <ul>
                <li>
                  Git - git-worktree Documentation:{" "}
                  <Ext href="https://git-scm.com/docs/git-worktree">
                    https://git-scm.com/docs/git-worktree
                  </Ext>
                </li>
                <li>
                  Git - git-config Documentation(
                  <code className={styles.inlineCode}>--worktree</code>スコープ):{" "}
                  <Ext href="https://git-scm.com/docs/git-config">
                    https://git-scm.com/docs/git-config
                  </Ext>
                </li>
                <li>
                  Git - gitglossary Documentation:{" "}
                  <Ext href="https://git-scm.com/docs/gitglossary">
                    https://git-scm.com/docs/gitglossary
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCard}>
              <h3>GitHub公式</h3>
              <ul>
                <li>
                  What are git worktrees, and why should I use them? (The GitHub Blog,
                  2026年6月16日/7月13日更新):{" "}
                  <Ext href="https://github.blog/ai-and-ml/github-copilot/what-are-git-worktrees-and-why-should-i-use-them/">
                    https://github.blog/ai-and-ml/github-copilot/what-are-git-worktrees-and-why-should-i-use-them/
                  </Ext>
                </li>
                <li>
                  GitHub Desktop 3.6: Worktrees and deeper Copilot integration (GitHub Changelog,
                  2026年6月26日):{" "}
                  <Ext href="https://github.blog/changelog/2026-06-26-github-desktop-3-6-worktrees-and-deeper-copilot-integration/">
                    https://github.blog/changelog/2026-06-26-github-desktop-3-6-worktrees-and-deeper-copilot-integration/
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCard}>
              <h3>AIコーディングエージェント公式ドキュメント</h3>
              <ul>
                <li>
                  Run parallel sessions with worktrees - Claude Code Docs:{" "}
                  <Ext href="https://code.claude.com/docs/en/worktrees">
                    https://code.claude.com/docs/en/worktrees
                  </Ext>
                </li>
                <li>
                  Git Worktree Parallel Development | Developer Toolkit(OpenAI Codex
                  Worktreeモード):{" "}
                  <Ext href="https://developertoolkit.ai/en/codex/advanced-techniques/worktrees/">
                    https://developertoolkit.ai/en/codex/advanced-techniques/worktrees/
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCard}>
              <h3>パッケージマネージャ公式</h3>
              <ul>
                <li>
                  pnpm + Git Worktrees for Multi-Agent Development:{" "}
                  <Ext href="https://pnpm.io/git-worktrees">https://pnpm.io/git-worktrees</Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCard}>
              <h3>著名な開発者による発信</h3>
              <ul>
                <li>
                  Boris Cherny(Claude Code作成者)によるworktree運用のポスト(X, 2026年1月31日):{" "}
                  <Ext href="https://x.com/bcherny/status/2017742743125299476">
                    https://x.com/bcherny/status/2017742743125299476
                  </Ext>
                </li>
                <li>
                  Simon Willison, Embracing the parallel coding agent lifestyle(2025年10月6日):{" "}
                  <Ext href="https://simonw.substack.com/p/embracing-the-parallel-coding-agent">
                    https://simonw.substack.com/p/embracing-the-parallel-coding-agent
                  </Ext>
                </li>
                <li>
                  Simon Willison, parallel-agentsタグ一覧:{" "}
                  <Ext href="https://simonwillison.net/tags/parallel-agents/">
                    https://simonwillison.net/tags/parallel-agents/
                  </Ext>
                </li>
                <li>
                  Nicholas C. Zakas(ESLint作成者), A gentle introduction to Git worktrees(Human Who
                  Codes, 2026年7月14日/27日更新):{" "}
                  <Ext href="https://humanwhocodes.com/blog/2026/07/introduction-git-worktrees/">
                    https://humanwhocodes.com/blog/2026/07/introduction-git-worktrees/
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCard}>
              <h3>技術系メディア・調査記事</h3>
              <ul>
                <li>
                  Git Worktree Isolation Patterns for Parallel AI Agent Development(Zylos Research,
                  2026年2月22日):{" "}
                  <Ext href="https://zylos.ai/research/2026-02-22-git-worktree-parallel-ai-development/">
                    https://zylos.ai/research/2026-02-22-git-worktree-parallel-ai-development/
                  </Ext>
                </li>
                <li>
                  How to Use Git Worktrees for Parallel AI Agent Execution(Augment Code):{" "}
                  <Ext href="https://www.augmentcode.com/guides/git-worktrees-parallel-ai-agent-execution">
                    https://www.augmentcode.com/guides/git-worktrees-parallel-ai-agent-execution
                  </Ext>
                </li>
                <li>
                  How to Use Git Worktrees with Claude Code for Parallel Development(MindStudio,
                  2026年4月15日):{" "}
                  <Ext href="https://www.mindstudio.ai/blog/git-worktrees-claude-code-parallel-development">
                    https://www.mindstudio.ai/blog/git-worktrees-claude-code-parallel-development
                  </Ext>
                </li>
                <li>
                  Parallel Agentic Development With Git Worktrees: A Practical Playbook(MindStudio,
                  2026年4月25日):{" "}
                  <Ext href="https://www.mindstudio.ai/blog/parallel-agentic-development-git-worktrees">
                    https://www.mindstudio.ai/blog/parallel-agentic-development-git-worktrees
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refCard}>
              <h3>関連ツール</h3>
              <ul>
                <li>
                  GitButler(仮想ブランチによる代替アプローチ):{" "}
                  <Ext href="https://github.com/gitbutlerapp/gitbutler">
                    https://github.com/gitbutlerapp/gitbutler
                  </Ext>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <footer className={styles.footerNote}>
          本ガイドはWeb検索により2026年7月31日時点で確認できた情報に基づいて作成しています。各ツールの仕様は継続的に更新されるため、実際の導入前に本文中の公式ドキュメントで最新の挙動を確認してください。
        </footer>
      </main>
    </div>
  );
}
