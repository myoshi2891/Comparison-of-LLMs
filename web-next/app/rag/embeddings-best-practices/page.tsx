import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "RAGとEmbeddings 完全ガイド | LLM-Studies",
  description:
    "RAG (検索拡張生成) と Embedding (埋め込み) についてゼロから実務レベルまで理解できるように、チャンキング、モデル選定、ベクトルDB、検索最適化、本番運用、評価方法などを体系的に解説する完全ガイド。",
};

const DIAGRAMS = {
  pipeline: `flowchart TB
    classDef purple fill:#3b2a52,stroke:#c9a8e8,color:#f3ecfa,stroke-width:1px
    classDef teal fill:#163d3a,stroke:#7fd9cd,color:#e3f7f4,stroke-width:1px
    subgraph IDX["インデキシング パイプライン(オフライン)"]
        A["生ドキュメント PDFやHTML Markdown"] --> B["パースとクリーニング"]
        B --> C["チャンキング Chunking"]
        C --> D["コンテキスト付与(任意)"]
        D --> E["Embeddingモデルでベクトル化"]
        E --> F[("ベクトルデータベース")]
    end
    subgraph QRY["クエリ パイプライン(オンライン)"]
        G["ユーザーの質問"] --> H["クエリ変換 HyDE"]
        H --> I["ハイブリッド検索 Dense+BM25"]
        F --> I
        I --> J["Reranking Cross-Encoder"]
        J --> K["上位Kチャンクを投入"]
        K --> L["LLMが回答生成"]
        L --> M["回答と引用元"]
    end
    class A,B,C,D,E,F purple
    class G,H,I,J,K,L,M teal`,

  chunking: `flowchart TD
    classDef purple fill:#3b2a52,stroke:#c9a8e8,color:#f3ecfa,stroke-width:1px
    classDef teal fill:#163d3a,stroke:#7fd9cd,color:#e3f7f4,stroke-width:1px
    classDef coral fill:#4a2a22,stroke:#f0a48a,color:#fbe6df,stroke-width:1px
    A["ドキュメントの種類は"] --> B{"構造化された見出しがあるか"}
    B -->|Yes| C["Markdownヘッダーで先に分割"]
    B -->|No| D["Recursive Chunking 300から500トークン"]
    C --> D
    D --> E{"検索精度は十分か"}
    E -->|十分| F["そのまま採用"]
    E -->|境界で意味が途切れる| G["Semantic Chunkingを試す"]
    E -->|文脈情報が足りない| H["Contextual Retrievalを追加"]
    G --> I{"コスト増に見合うか"}
    H --> J["評価指標を再測定"]
    I --> J
    J --> F
    class A,D purple
    class B,E,I teal
    class C,G,H,J,F coral`,

  hybrid: `flowchart LR
    classDef purple fill:#3b2a52,stroke:#c9a8e8,color:#f3ecfa,stroke-width:1px
    classDef teal fill:#163d3a,stroke:#7fd9cd,color:#e3f7f4,stroke-width:1px
    Q["ユーザークエリ"] --> D1["Dense Vector検索 Top50"]
    Q --> D2["BM25 Sparse検索 Top50"]
    D1 --> RRF["Reciprocal Rank Fusion"]
    D2 --> RRF
    RRF --> RR["Cross-Encoder Reranker Top100からTop5"]
    RR --> CTX["LLMへコンテキストとして投入"]
    class Q,D1,D2 purple
    class RRF,RR,CTX teal`,

  adaptive: `flowchart TD
    classDef purple fill:#3b2a52,stroke:#c9a8e8,color:#f3ecfa,stroke-width:1px
    classDef teal fill:#163d3a,stroke:#7fd9cd,color:#e3f7f4,stroke-width:1px
    classDef coral fill:#4a2a22,stroke:#f0a48a,color:#fbe6df,stroke-width:1px
    U["ユーザークエリ"] --> C{"複雑度分類器"}
    C -->|単純な事実質問| N["Naiveまたは Advanced RAG"]
    C -->|関係性を問う質問| G["GraphRAG グラフ探索"]
    C -->|複数ステップの推論| A["Agentic RAG 反復検索"]
    N --> R["回答生成"]
    G --> R
    A --> R
    class U,C teal
    class N purple
    class G coral
    class A coral`,
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Page() {
  return (
    <div className={styles.pageWrap}>
      <TocObserver />
      <div className={styles.layout}>
        {/* ================= SIDEBAR ================= */}
        <nav className={styles.sidebar} id="ragSideNav">
          <button className={styles.mobileToggle} id="ragNavToggle" type="button">
            <i className="ti ti-menu-2" />
            目次を開く
          </button>
          <div className={styles.brand}>
            RAGとEmbeddings 完全ガイド
            <p className={styles.brandSub}>初学者向けステップバイステップ解説 / 2026年版</p>
          </div>
          <p className={styles.navTitle}>目次</p>
          <ul className={styles.navList} id="ragNavList">
            <li>
              <a href="#sec-1" className={styles.tocLink}>
                <i className="ti ti-bulb" />1. RAGとは何か
              </a>
            </li>
            <li>
              <a href="#sec-2" className={styles.tocLink}>
                <i className="ti ti-sitemap" />2. 全体アーキテクチャ
              </a>
            </li>
            <li>
              <a href="#sec-3" className={styles.tocLink}>
                <i className="ti ti-vector-triangle" />3. Embeddingsの基礎
              </a>
            </li>
            <li className={styles.navTitle}>ステップバイステップ</li>
            <li>
              <a href="#sec-4" className={styles.tocLink}>
                <i className="ti ti-scissors" />4. チャンキング戦略
              </a>
            </li>
            <li>
              <a href="#sec-5" className={styles.tocLink}>
                <i className="ti ti-brain" />5. Embeddingモデル選定
              </a>
            </li>
            <li>
              <a href="#sec-6" className={styles.tocLink}>
                <i className="ti ti-database" />6. ベクトルDB選択
              </a>
            </li>
            <li>
              <a href="#sec-7" className={styles.tocLink}>
                <i className="ti ti-search" />7. 検索の最適化
              </a>
            </li>
            <li>
              <a href="#sec-8" className={styles.tocLink}>
                <i className="ti ti-message-2" />8. 生成とプロンプト
              </a>
            </li>
            <li>
              <a href="#sec-9" className={styles.tocLink}>
                <i className="ti ti-chart-bar" />9. 評価(Evaluation)
              </a>
            </li>
            <li className={styles.navTitle}>発展・運用</li>
            <li>
              <a href="#sec-10" className={styles.tocLink}>
                <i className="ti ti-topology-star" />10. 発発展的アーキテクチャ
              </a>
            </li>
            <li>
              <a href="#sec-11" className={styles.tocLink}>
                <i className="ti ti-server-2" />11. 本番運用
              </a>
            </li>
            <li>
              <a href="#sec-12" className={styles.tocLink}>
                <i className="ti ti-alert-triangle" />12. 失敗パターン
              </a>
            </li>
            <li>
              <a href="#sec-13" className={styles.tocLink}>
                <i className="ti ti-checklist" />13. 実装チェックリスト
              </a>
            </li>
            <li>
              <a href="#sec-14" className={styles.tocLink}>
                <i className="ti ti-link" />14. 参考文献一覧
              </a>
            </li>
          </ul>
        </nav>

        {/* ================= MAIN CONTENT ================= */}
        <main className={styles.content}>
          <div className={styles.hero}>
            <div className={styles.heroBadge}>
              <i className="ti ti-calendar" />
              2026年7月時点の最新情報
            </div>
            <h1>RAG(Retrieval-Augmented Generation)とEmbeddings 完全ガイド</h1>
            <p>
              本ガイドは、RAG(検索拡張生成)とEmbedding(埋め込み)についてゼロから実務レベルまで理解できるように、ステップバイステップで解説したものです。各セクションの末尾に参照した一次情報源のURLを掲載しています。
            </p>
          </div>

          <section className={`${styles.section} chapter`} id="sec-1">
            <h2>
              <i className="ti ti-bulb" />1. はじめに:RAGとは何か
            </h2>

            <h3>1.1 RAGの基本概念</h3>
            <p>
              RAG(Retrieval-Augmented Generation、検索拡張生成)は、LLM(大規模言語モデル)が回答を生成する前に、外部の知識ソース(社内ドキュメント、PDF、データベースなど)から関連情報を検索し、その情報を根拠として回答を組み立てるアーキテクチャです。
            </p>
            <p>
              イメージとしては、LLM単体は「閉じた本の試験を受ける学生」、RAGを組み込んだLLMは「参考資料を持ち込める試験を受ける学生」に例えられます。学習データが固定された時点で凍結されているLLMに対し、RAGは社内文書・製品カタログ・規制文書などの参照資料を、回答を書く前に参照させることができます。
            </p>
            <p>
              RAGという用語自体は、2020年にMeta AI(当時のFacebook AI Research)のPatrick Lewisらが NeurIPS で発表した論文で提案されました。この論文では、事前学習済みのretriever(検索器)とgenerator(生成器)を組み合わせることで、生成器単体よりも事実性・多様性・具体性に優れた回答が得られることが示されました。
            </p>

            <h3>1.2 なぜ2026年現在、RAGが「エンタープライズAIのデフォルト」なのか</h3>
            <p>
              2026年時点で、RAGはほぼすべてのチャットボット・社内ナレッジベース・AIアシスタントで採用される標準アーキテクチャになっています。理由は主に次の3点です。
            </p>
            <div className={styles.grid2}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>
                  <i className="ti ti-coin" />
                  低コスト・高速な更新
                </div>
                <p>ファインチューニングせずに外部データを差し替えるだけで知識を更新できる</p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>
                  <i className="ti ti-clock" />
                  最新情報への対応
                </div>
                <p>学習データカットオフ以降の情報や、社内限定の非公開情報にも対応できる</p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>
                  <i className="ti ti-quote" />
                  引用・説明可能性
                </div>
                <p>どの文書のどの部分を根拠に回答したかを提示でき、監査や検証がしやすい</p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>
                  <i className="ti ti-alert-triangle" />
                  落とし穴
                </div>
                <p>失敗の約7割は生成ではなく検索(Retrieval)段階が原因という指摘がある</p>
              </div>
            </div>
            <p>
              素朴な(Naive)RAG実装は本番環境で失敗しやすいという指摘が複数のソースで一致しています。「LLMが賢く答えているように見えて、実は間違った文書を根拠にしている」というケースが最大の落とし穴です。
            </p>

            <div className={styles.refBox}>
              <h4>
                <i className="ti ti-link" />
                参照URL
              </h4>
              <Ext href="https://decodethefuture.org/en/rag/">https://decodethefuture.org/en/rag/</Ext>
              <Ext href="https://lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/">
                https://lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/
              </Ext>
              <Ext href="https://www.techment.com/blogs/rag-in-2026/">https://www.techment.com/blogs/rag-in-2026/</Ext>
              <Ext href="https://nerdleveltech.com/guides/rag-systems">https://nerdleveltech.com/guides/rag-systems</Ext>
            </div>
          </section>

          <section className={`${styles.section} chapter`} id="sec-2">
            <h2>
              <i className="ti ti-sitemap" />2. RAGの全体アーキテクチャ
            </h2>
            <p>
              RAGシステムは大きく分けて「インデキシング(indexing)パイプライン」(オフライン処理)と「クエリ(query)パイプライン」(オンライン処理)の2つで構成されます。
            </p>

            <div className={styles.mermaidBlock}>
              <div className={styles.mermaidContainer}>
                <MermaidDiagram chart={DIAGRAMS.pipeline} />
              </div>
              <div className={styles.mermaidCaption}>図1: RAGの全体パイプライン(インデキシングとクエリ)</div>
            </div>

            <h3>2.1 各ステップの役割</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ステップ</th>
                    <th>処理内容</th>
                    <th>該当章</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>①パース&amp;クリーニング</td>
                    <td>PDF/HTML/Markdownからテキストを抽出し、ヘッダー・フッター等のノイズを除去</td>
                    <td>4章</td>
                  </tr>
                  <tr>
                    <td>②チャンキング</td>
                    <td>長い文書を検索可能な単位(チャンク)に分割</td>
                    <td>4章</td>
                  </tr>
                  <tr>
                    <td>③コンテキスト付与</td>
                    <td>チャンクが文脈を失わないよう要約情報を付加(Contextual Retrieval)</td>
                    <td>4章</td>
                  </tr>
                  <tr>
                    <td>④ベクトル化</td>
                    <td>Embeddingモデルでチャンクを数値ベクトルに変換</td>
                    <td>3・5章</td>
                  </tr>
                  <tr>
                    <td>⑤保存</td>
                    <td>ベクトルデータベースにベクトルとメタデータを保存</td>
                    <td>6章</td>
                  </tr>
                  <tr>
                    <td>⑥クエリ変換</td>
                    <td>ユーザーの質問を検索に適した形に変換(HyDE等)</td>
                    <td>7章</td>
                  </tr>
                  <tr>
                    <td>⑦ハイブリッド検索</td>
                    <td>DenseとBM25を組み合わせて候補を取得</td>
                    <td>7章</td>
                  </tr>
                  <tr>
                    <td>⑧Reranking</td>
                    <td>候補チャンクを精密に並べ替え、上位のみ抽出</td>
                    <td>7章</td>
                  </tr>
                  <tr>
                    <td>⑨生成</td>
                    <td>LLMが検索結果を根拠に回答を生成</td>
                    <td>8章</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              複数のソースが共通して指摘しているのは、「単純な&quot;埋め込み→ベクトルDB格納→上位k件取得→生成&quot;という素朴な構成はデモでは動くが、本番では次の3つの理由で破綻しやすい」という点です。
            </p>
            <ol className={styles.navListInline}>
              <li>
                <strong>意味的ギャップ(Semantic gap)</strong>: ユーザーの言葉と文書中の言葉が異なる(例:「解約したい」 vs 文書中の「アカウント終了ポリシー」)
              </li>
              <li>
                <strong>コンテキスト汚染</strong>: 関連チャンクが2件しかないのに10件取得すると、LLMが全体を平均化し回答が曖昧になる
              </li>
              <li>
                <strong>チャンキングの副作用</strong>: 固定長分割で文・表・コードの途中が切れ、取得できても実質使えないチャンクになる
              </li>
            </ol>

            <div className={styles.refBox}>
              <h4>
                <i className="ti ti-link" />
                参照URL
              </h4>
              <Ext href="https://lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/">
                https://lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/
              </Ext>
              <Ext href="https://nerdleveltech.com/guides/rag-systems">https://nerdleveltech.com/guides/rag-systems</Ext>
              <Ext href="https://aiml.qa/vector-database-comparison-2026/">https://aiml.qa/vector-database-comparison-2026/</Ext>
            </div>
          </section>

          <section className={`${styles.section} chapter`} id="sec-3">
            <h2>
              <i className="ti ti-vector-triangle" />3. Embeddings(埋め込み)の基礎知識
            </h2>

            <h3>3.1 Embeddingとは何か</h3>
            <p>
              Embedding(埋め込み)とは、テキスト・画像・音声などの非構造化データを、意味を保持したまま数値ベクトル(数字の配列)に変換したものです。ニューラルネットワークによって生成されたこのベクトルは、高次元の「意味空間」の中の1点として表現され、意味が近いテキスト同士は空間内でも近い位置に配置されます。
            </p>
            <p>
              例えば「software engineer」と「developer」という単語は表記が異なりますが、Embeddingベクトル上では非常に近い位置に配置されます。これにより、キーワードが完全一致しなくても「意味的に近い」文書を検索できるようになります。
            </p>

            <h3>3.2 コサイン類似度(Cosine Similarity)</h3>
            <p>
              2つのベクトルがどれだけ近いか(意味的に似ているか)を測る最も一般的な指標がコサイン類似度です。2つのベクトルのなす角度の余弦を計算し、1に近いほど類似、0に近いほど無関係、-1に近いほど正反対の意味であることを示します。RAGの検索ステップでは、ユーザーの質問ベクトルと各チャンクのベクトルとの間でコサイン類似度(または内積・ユークリッド距離)を計算し、類似度が高い順に候補を取得します。
            </p>

            <h3>3.3 次元数とMatryoshka Representation Learning(MRL)</h3>
            <p>
              Embeddingベクトルの次元数はモデルによって256〜4096程度まで幅があります。次元数が大きいほど表現力は高まりますが、ストレージコストと検索速度に直接影響します。
            </p>
            <p>
              2026年時点で主要なEmbeddingモデルのほとんどが採用しているのが<strong>Matryoshka Representation Learning(MRL)</strong>という学習手法です。ロシアの入れ子人形(マトリョーシカ)のように、1つのベクトルの前半部分だけを切り出しても意味的に重要な情報が保持されるよう学習します。
            </p>
            <p>
              MRLを使うと、例えば3072次元でEmbeddingを1回生成し、後から256次元・768次元などに切り詰める(truncateする)だけで、精度の劣化を最小限に抑えつつストレージコストを削減できます。OpenAIのtext-embedding-3-largeを256次元に切り詰めた場合でも、旧モデルのtext-embedding-ada-002をフル次元(1536次元)で使うより高い精度(MTEBベンチマーク)を示したという報告があります。Googleのgemini-embedding-001も同様にMRLを採用しており、3072次元から768次元まで、recall@10の劣化を1%未満に抑えながら縮小できるとされています。
            </p>

            <h3>3.4 MTEBベンチマークとは</h3>
            <p>
              <strong>MTEB(Massive Text Embedding Benchmark)</strong>は、Embeddingモデルの性能を測る業界標準のベンチマークで、検索・分類・クラスタリング・意味的類似度(STS)など複数のタスクにまたがる評価を行います。ただし複数の実務ガイドが「MTEBの総合スコアだけで選ぶのは危険」と警告しています。MTEBは平均的なタスク性能を示すものであり、法律文書・医療文献・多言語コーパスなど特定ドメインでの実際の検索精度とは乖離することがあるためです。自社データ・自社クエリでのオフライン評価(9章のRAGAS等)と組み合わせて判断することが推奨されています。
            </p>

            <h3>3.5 Dense EmbeddingとSparse Embedding</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>種類</th>
                    <th>説明</th>
                    <th>得意なこと</th>
                    <th>代表例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Dense Embedding</td>
                    <td>各次元に意味情報を分散させた密なベクトル</td>
                    <td>言い換え・同義語・意味的な近さの検出</td>
                    <td>OpenAI text-embedding-3、Voyage、Cohere embed-v4、Gemini Embedding</td>
                  </tr>
                  <tr>
                    <td>Sparse Embedding</td>
                    <td>ほとんどの値が0で特定の単語にのみ重みを持つベクトル</td>
                    <td>型番・固有名詞・専門用語の完全一致検索</td>
                    <td>BM25、SPLADE</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Dense(意味検索)だけでは、「SKU AZ-4471」のような型番や固有名詞の完全一致検索に弱いという弱点が繰り返し報告されています。これが7章で解説する「ハイブリッド検索」が2026年の標準構成になっている理由です。
            </p>

            <div className={styles.refBox}>
              <h4>
                <i className="ti ti-link" />
                参照URL
              </h4>
              <Ext href="https://aimultiple.com/embedding-models">https://aimultiple.com/embedding-models</Ext>
              <Ext href="https://www.mindstudio.ai/blog/what-is-matryoshka-representation-learning">
                https://www.mindstudio.ai/blog/what-is-matryoshka-representation-learning
              </Ext>
              <Ext href="https://www.mindstudio.ai/blog/matryoshka-representation-learning-gemini-embedding-2">
                https://www.mindstudio.ai/blog/matryoshka-representation-learning-gemini-embedding-2
              </Ext>
              <Ext href="https://modal.com/blog/mteb-leaderboard-article">https://modal.com/blog/mteb-leaderboard-article</Ext>
              <Ext href="https://awesomeagents.ai/leaderboards/embedding-model-leaderboard-mteb-april-2026/">
                https://awesomeagents.ai/leaderboards/embedding-model-leaderboard-mteb-april-2026/
              </Ext>
              <Ext href="https://aitechconnect.in/news/hybrid-search-rag-bm25-vector-production">
                https://aitechconnect.in/news/hybrid-search-rag-bm25-vector-production
              </Ext>
            </div>
          </section>

          <section className={`${styles.section} chapter`} id="sec-4">
            <h2>
              <i className="ti ti-scissors" />4. ステップ1: ドキュメントの前処理とチャンキング戦略
            </h2>

            <h3>4.1 なぜチャンキングが重要なのか</h3>
            <p>
              複数の2026年時点の実務ガイドが一致して指摘しているのは、「チャンクサイズは重要だが、多くのチームが思っているほど最重要のボトルネックではない」という点です。むしろ、古くなった・管理されていない・意味的に薄いソースデータの方が本番RAG失敗の根本原因になりやすいとされています。とはいえ、チャンキング戦略は依然として品質を左右する重要な4本柱(チャンキング・ハイブリッド検索・Reranker・ロングコンテキストとの使い分け)の1つとして扱われています。
            </p>

            <div className={styles.mermaidBlock}>
              <div className={styles.mermaidContainer}>
                <MermaidDiagram chart={DIAGRAMS.chunking} />
              </div>
              <div className={styles.mermaidCaption}>図2: チャンキング戦略の意思決定フロー</div>
            </div>

            <h3>4.2 チャンキング戦略の比較</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>戦略</th>
                    <th>概要</th>
                    <th>向いているケース</th>
                    <th>コスト・注意点</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>固定長分割</td>
                    <td>文字数・トークン数で機械的に分割</td>
                    <td>プロトタイプ、動作確認</td>
                    <td>文・表・コードの途中で切れやすい</td>
                  </tr>
                  <tr>
                    <td>Recursive Chunking</td>
                    <td>段落→文の順に階層的に分割し構造を保持</td>
                    <td>ほとんどの実務用途のデフォルト</td>
                    <td>300〜500トークン+10〜20%オーバーラップが目安</td>
                  </tr>
                  <tr>
                    <td>Semantic Chunking</td>
                    <td>文ごとの埋め込み類似度が閾値を下回った箇所で新チャンク開始</td>
                    <td>ナレッジベース、技術文書</td>
                    <td>索引作成が大幅に低速(トークンベースの約14倍という報告)</td>
                  </tr>
                  <tr>
                    <td>Late Chunking</td>
                    <td>文書全体を先にトークンレベルで埋め込み、その後境界を適用</td>
                    <td>見出し・代名詞・相互参照が多い文書</td>
                    <td>長文コンテキスト対応モデルが必要</td>
                  </tr>
                  <tr>
                    <td>Contextual Retrieval</td>
                    <td>チャンク先頭に文書内での位置づけをLLMで要約し付加</td>
                    <td>財務報告書等、主語や背景が欠落しやすい文書</td>
                    <td>Reranking併用でtop-20失敗率を最大67%削減と報告</td>
                  </tr>
                  <tr>
                    <td>Agentic Chunking</td>
                    <td>LLMに意味的境界を判断させる</td>
                    <td>複雑な構造を持つ長文文書</td>
                    <td>処理コストが高く大規模コーパス向きではない</td>
                  </tr>
                  <tr>
                    <td>Parent Document</td>
                    <td>小さい単位で検索し、LLMには親チャンク(広い文脈)を渡す</td>
                    <td>ピンポイント検索と広い文脈理解が両方必要なQ&amp;A</td>
                    <td>実装がやや複雑</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>4.3 チャンクサイズとオーバーラップの目安</h3>
            <p>
              複数の実務ガイドで共通する初期値は「300〜500トークン、10〜20%のオーバーラップ」です。2026年2月のあるベンダーベンチマークではRecursive 512トークン分割が7戦略中最高スコアを記録し、別のLlamaIndexの調査では1024トークン付近が忠実性(Faithfulness)のピークに近いとされています。512〜1024トークンの範囲が妥当な出発点です。
            </p>
            <div className={`${styles.callout} ${styles.calloutWarning}`}>
              <i className="ti ti-alert-triangle" />
              <div>
                <strong>注意: </strong>
                オーバーラップの効果については意見が分かれています。2026年1月のある系統的分析(SPLADE検索+Mistral-8BによるNatural Questions検証)では、オーバーラップに測定可能な効果が見られず、インデックス作成コストが増えるだけだったという結果も報告されています。自社データでの検証が重要です。
              </div>
            </div>

            <h3>4.4 メタデータの付与</h3>
            <p>
              チャンクには必ずメタデータ(ソース文書名、セクション見出し、ページ番号、親チャンクID等)を含めることが推奨されています。これにより、引用表示・フィルタリング・階層的検索が可能になります。
            </p>

            <h3>4.5 Contextual Retrievalの実装イメージ</h3>
            <p>
              Anthropicが提案したContextual Retrievalは、次のようなプロンプトで各チャンクに文脈を付与します(概念イメージ)。
            </p>

            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>Prompt Template</span>
                <span className={styles.codeLang}>text</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>&lt;document&gt;</div>
                <div className={styles.codeLine}>{"{{"}文書全体{"}}"}</div>
                <div className={styles.codeLine}>&lt;/document&gt;</div>
                <div className={styles.codeLine}>このチャンクを文書全体の中に位置づける、検索性能向上のための</div>
                <div className={styles.codeLine}>簡潔な説明を生成してください。</div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>&lt;chunk&gt;</div>
                <div className={styles.codeLine}>{"{{"}対象チャンク{"}}"}</div>
                <div className={styles.codeLine}>&lt;/chunk&gt;</div>
              </div>
            </div>

            <p>
              文書全体を毎回プロンプトに含めるとコストが増大しますが、Claudeのプロンプトキャッシュ機能を使うことでキャッシュ対象トークンのコストを大幅に抑えられます。試算例として、800トークンのチャンク・8,000トークンの文書・50トークンの指示・100トークンの生成コンテキストという条件では、文書100万トークンあたり約1.02ドルという一時的なコストで実装可能とされています。
            </p>

            <div className={styles.refBox}>
              <h4>
                <i className="ti ti-link" />
                参照URL
              </h4>
              <Ext href="https://www.callmissed.com/en/blog/rag-best-practices-2026">https://www.callmissed.com/en/blog/rag-best-practices-2026</Ext>
              <Ext href="https://www.digitalapplied.com/blog/rag-chunking-strategies-2026-retrieval-quality-playbook/">
                https://www.digitalapplied.com/blog/rag-chunking-strategies-2026-retrieval-quality-playbook/
              </Ext>
              <Ext href="https://langcopilot.com/posts/2025-10-11-document-chunking-for-rag-practical-guide">
                https://langcopilot.com/posts/2025-10-11-document-chunking-for-rag-practical-guide
              </Ext>
              <Ext href="https://www.firecrawl.dev/blog/best-chunking-strategies-rag">https://www.firecrawl.dev/blog/best-chunking-strategies-rag</Ext>
              <Ext href="https://atlan.com/know/chunking-strategies-rag/">https://atlan.com/know/chunking-strategies-rag/</Ext>
              <Ext href="https://www.anthropic.com/news/contextual-retrieval">https://www.anthropic.com/news/contextual-retrieval</Ext>
              <Ext href="https://simonwillison.net/2024/Sep/20/introducing-contextual-retrieval/">
                https://simonwillison.net/2024/Sep/20/introducing-contextual-retrieval/
              </Ext>
            </div>
          </section>

          <section className={`${styles.section} chapter`} id="sec-5">
            <h2>
              <i className="ti ti-brain" />5. ステップ2: Embeddingモデルの選定
            </h2>

            <h3>5.1 選定の判断軸</h3>
            <p>2026年の実務ガイドで共通して挙げられている判断軸は次の3点です。</p>
            <ol className={styles.navListInline}>
              <li>
                <strong>モダリティ</strong>: テキストのみか、画像・音声・動画も含む「マルチモーダル」対応が必要か
              </li>
              <li>
                <strong>保存場所とセルフホスト可否</strong>: APIサービスを使うか、自社インフラで運用するか
              </li>
              <li>
                <strong>多言語対応の要否</strong>: 日本語を含む多言語コーパスかどうか
              </li>
            </ol>
            <p>
              自己ホスティング(BGE-M3、Jina、Nomic等)とAPI型(OpenAI、Voyage、Cohere、Google)の損益分岐点は、月間の埋め込み処理件数がおおよそ1,000万〜5,000万件を超えるあたりにあるとされています。それ以下の規模ではAPIの運用負荷の低さが優位に働くケースが多いです。
            </p>

            <h3>5.2 主要Embeddingモデル比較(2026年中頃時点)</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>モデル</th>
                    <th>提供元</th>
                    <th>次元数(MRL対応)</th>
                    <th>特徴</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>text-embedding-3-large / small</td>
                    <td>OpenAI</td>
                    <td>3072(256まで縮小可)</td>
                    <td>総合的に安定した既定選択肢。MTEBの検索・分類タスクで高水準</td>
                  </tr>
                  <tr>
                    <td>voyage-4 / voyage-3-large / voyage-3.5-lite</td>
                    <td>Voyage AI(MongoDB傘下)</td>
                    <td>256〜2048</td>
                    <td>RAG特化。誤マッチを抑制する学習。Voyage 4はMoE構成で共有ベクトル空間</td>
                  </tr>
                  <tr>
                    <td>embed-v4.0</td>
                    <td>Cohere</td>
                    <td>256〜1536</td>
                    <td>多言語・マルチモーダル対応。同社Rerank APIとの併用設計</td>
                  </tr>
                  <tr>
                    <td>gemini-embedding-001 / Gemini Embedding 2</td>
                    <td>Google</td>
                    <td>768〜3072</td>
                    <td>MRL採用。テキスト・画像・動画・音声のマルチモーダル対応</td>
                  </tr>
                  <tr>
                    <td>BGE-M3</td>
                    <td>BAAI(オープンソース)</td>
                    <td>1024</td>
                    <td>100言語以上対応、dense/sparse両方を1回の呼び出しで出力可能</td>
                  </tr>
                  <tr>
                    <td>Jina Embeddings v5 / v4</td>
                    <td>Jina AI</td>
                    <td>64〜1024</td>
                    <td>32Kトークンの長文コンテキスト対応、89言語対応</td>
                  </tr>
                  <tr>
                    <td>Qwen3-Embedding-8B</td>
                    <td>Alibaba(オープンソース)</td>
                    <td>可変</td>
                    <td>MTEB多言語リーダーボードで上位。GPU必須</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={`${styles.callout} ${styles.calloutInfo}`}>
              <i className="ti ti-info-circle" />
              <div>
                <strong>補足: </strong>
                上記スコアや価格は情報源(ベンダー独自ベンチマークを含む)によって数値が食い違うことがあります。特にベンダー公表の比較は「自社モデルが有利になる条件」で計測されている場合があるため、必ず自社データ・自社クエリでの検証を行ってください。
              </div>
            </div>

            <h3>5.3 日本語・多言語での注意点</h3>
            <p>
              多言語対応が必要な場合、BGE-M3やCohereの多言語モデルが定番の選択肢として挙げられています。ただし、英語で高スコアのモデルが必ずしも他言語で同等の性能を出すとは限らない点には注意が必要です。あるベンダー比較では「英語だけで収束しているように見えても、ウクライナ語を加えると精度差が大きく開く」という開発者コメントが紹介されており、対象言語での実測評価が推奨されています。
            </p>

            <h3>5.4 ドメイン特化モデル</h3>
            <p>
              コード検索にはVoyage code系やGemini Embedding 2(MTEB Codeスコアが高い)、法律文書・金融文書には専用にファインチューニングされたBGEやQwen3系モデルが候補として挙げられています。汎用モデルで自社の検索評価スコアが頭打ちになった場合にのみ、ファインチューニングやドメイン特化モデルへの切り替えを検討するのが現実的な順序です。
            </p>

            <div className={styles.refBox}>
              <h4>
                <i className="ti ti-link" />
                参照URL
              </h4>
              <Ext href="https://aimultiple.com/embedding-models">https://aimultiple.com/embedding-models</Ext>
              <Ext href="https://pecollective.com/tools/best-embedding-models/">https://pecollective.com/tools/best-embedding-models/</Ext>
              <Ext href="https://www.buildmvpfast.com/blog/best-embedding-model-comparison-voyage-openai-cohere-2026">
                https://www.buildmvpfast.com/blog/best-embedding-model-comparison-voyage-openai-cohere-2026
              </Ext>
              <Ext href="https://mixpeek.com/curated-lists/best-embedding-models">https://mixpeek.com/curated-lists/best-embedding-models</Ext>
              <Ext href="https://www.openxcell.com/blog/best-embedding-models/">https://www.openxcell.com/blog/best-embedding-models/</Ext>
              <Ext href="https://tensoria.fr/en/blog/embedding-models-2026-guide">https://tensoria.fr/en/blog/embedding-models-2026-guide</Ext>
              <Ext href="https://christhomas.co.uk/blog/2025/10/31/match-embedding-dimensions-to-your-domain-not-defaults/">
                https://christhomas.co.uk/blog/2025/10/31/match-embedding-dimensions-to-your-domain-not-defaults/
              </Ext>
            </div>
          </section>

          <section className={`${styles.section} chapter`} id="sec-6">
            <h2>
              <i className="ti ti-database" />6. ステップ3: ベクトルデータベースの選択
            </h2>

            <h3>6.1 ベクトルデータベースの役割</h3>
            <p>
              Embeddingモデルはベクトルを生成するだけであり、それを保存し高速に検索するには別途ベクトルデータベースが必要です。多くの製品はHNSW(Hierarchical Navigable Small World)というグラフベースのアルゴリズムを採用しており、対数的な計算量で近似最近傍探索(ANN)を実現します。
            </p>

            <h3>6.2 主要ベクトルデータベース比較</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>データベース</th>
                    <th>タイプ</th>
                    <th>得意なこと</th>
                    <th>弱点・注意点</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>pgvector</td>
                    <td>PostgreSQL拡張</td>
                    <td>既存Postgres資産との統合、トランザクション整合性、運用のシンプルさ</td>
                    <td>大規模(1億ベクトル超)ではチューニングが必要</td>
                  </tr>
                  <tr>
                    <td>Pinecone</td>
                    <td>フルマネージド専用DB</td>
                    <td>ゼロ運用負荷、スケーラビリティ、SLA</td>
                    <td>クローズドソース、HNSWパラメータの詳細チューニング不可</td>
                  </tr>
                  <tr>
                    <td>Qdrant</td>
                    <td>OSS(Rust実装)</td>
                    <td>フィルタリング性能、低レイテンシ、大きな無料枠</td>
                    <td>エコシステムがPinecone/Weaviateより小さい</td>
                  </tr>
                  <tr>
                    <td>Weaviate</td>
                    <td>OSS(Java実装)</td>
                    <td>ネイティブなハイブリッド検索、自動ベクトル化モジュール、マルチテナンシー</td>
                    <td>自己ホスト時のリソース消費が大きい</td>
                  </tr>
                  <tr>
                    <td>Milvus</td>
                    <td>OSS(CNCF)</td>
                    <td>10億ベクトル級のスケール、複数インデックスタイプ</td>
                    <td>運用の複雑さが高くKubernetes運用力が必要</td>
                  </tr>
                  <tr>
                    <td>Chroma</td>
                    <td>OSS(組み込み型)</td>
                    <td>プロトタイピングのしやすさ</td>
                    <td>本番向けの高可用性・監視機能が手薄</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>6.3 選び方の目安</h3>
            <ul className={styles.navListInline}>
              <li>
                すでにPostgresを使っており、ベクトル数が1,000万未満 → <strong>pgvector</strong>が第一候補
              </li>
              <li>運用チームを持たず、マネージドサービスを希望 → <strong>Pinecone</strong></li>
              <li>
                ハイブリッド検索をネイティブに使いたい → <strong>Weaviate</strong>または<strong>Qdrant</strong>
              </li>
              <li>フィルタ付き検索の速度を最優先 → <strong>Qdrant</strong></li>
              <li>
                1億〜10億ベクトル級の規模 → <strong>Milvus</strong>または<strong>Pinecone</strong>
              </li>
              <li>マルチモーダル検索 → <strong>Weaviate</strong>または<strong>LanceDB</strong></li>
            </ul>
            <p>
              複数のベンチマークが一致して指摘しているのは、「ベクトルデータベースの選定よりも、チャンキング戦略とEmbeddingの品質の方が最終的な検索精度に与える影響が大きい」という点です。まずは手元の技術スタックに合う選択肢から始め、実運用で不足が見えてから移行する段階的アプローチが推奨されています。
            </p>

            <div className={styles.refBox}>
              <h4>
                <i className="ti ti-link" />
                参照URL
              </h4>
              <Ext href="https://encore.dev/articles/best-vector-databases">https://encore.dev/articles/best-vector-databases</Ext>
              <Ext href="https://www.firecrawl.dev/blog/best-vector-databases">https://www.firecrawl.dev/blog/best-vector-databases</Ext>
              <Ext href="https://www.datacamp.com/blog/the-top-5-vector-databases">https://www.datacamp.com/blog/the-top-5-vector-databases</Ext>
              <Ext href="https://iternal.ai/insights/best-vector-databases-2026">https://iternal.ai/insights/best-vector-databases-2026</Ext>
              <Ext href="https://medium.com/@pratik-rupareliya/top-15-vector-databases-in-2026-a-production-decision-guide-from-100-enterprise-deployments-dd58a04f51a5">
                https://medium.com/@pratik-rupareliya/top-15-vector-databases-in-2026-a-production-decision-guide-from-100-enterprise-deployments-dd58a04f51a5
              </Ext>
              <Ext href="https://aiml.qa/vector-database-comparison-2026/">https://aiml.qa/vector-database-comparison-2026/</Ext>
              <Ext href="https://vecstore.app/blog/vector-database-performance-compared">https://vecstore.app/blog/vector-database-performance-compared</Ext>
              <Ext href="https://www.kalviumlabs.ai/blog/vector-databases-compared-pgvector-pinecone-qdrant-weaviate/">
                https://www.kalviumlabs.ai/blog/vector-databases-compared-pgvector-pinecone-qdrant-weaviate/
              </Ext>
            </div>
          </section>

          <section className={`${styles.section} chapter`} id="sec-7">
            <h2>
              <i className="ti ti-search" />7. 検索(Retrieval)の最適化
            </h2>

            <h3>7.1 ハイブリッド検索(Hybrid Search)</h3>
            <p>
              Dense Embeddingによる意味検索は言い換えに強い一方、型番・固有名詞などの完全一致検索には弱いという弱点があります。逆にBM25のようなキーワード検索は完全一致には強いものの、言い換え表現を拾えません。この両者を組み合わせる<strong>ハイブリッド検索</strong>が2026年時点の実務標準になっています。
            </p>
            <p>
              2026年のあるEACL採択論文(金融文書、23,088クエリ、7,318文書を対象とした10手法の比較)では、テキストと表が混在する金融文書においてBM25が多くの指標で最先端のDense検索を上回ったという結果も報告されており、「Denseだけに頼らない」ことの重要性を裏付けています。
            </p>

            <h3>7.2 Reciprocal Rank Fusion(RRF)</h3>
            <p>
              ハイブリッド検索でDense検索とBM25検索の結果を統合する代表的な手法がRRF(Reciprocal Rank Fusion)です。RRFはスコアそのものではなく「順位」に基づいて統合するため、Dense検索のスコアとBM25のスコアのスケールが違うという問題(スコア不整合問題)を回避できます。
            </p>

            <div className={styles.mermaidBlock}>
              <div className={styles.mermaidContainer}>
                <MermaidDiagram chart={DIAGRAMS.hybrid} />
              </div>
              <div className={styles.mermaidCaption}>図3: ハイブリッド検索とRerankingのフロー</div>
            </div>

            <p>
              あるEコマース向けベンチマーク(WANDSデータセット)では、チューニング済みのハイブリッド構成がNDCGで0.7497を記録し、BM25単体(0.6983)・Dense単体(0.6953)のいずれよりも約7.4%高い結果を示しました。BM25単体とDense単体の性能差は統計的にほぼ同等であり、「どちらか一方が常に優れている」わけではなく組み合わせること自体に価値があります。
            </p>

            <h3>7.3 Reranking(リランキング)</h3>
            <p>
              一次検索(Dense/BM25/ハイブリッド)で候補を50〜100件程度に絞り込んだ後、<strong>Cross-Encoder型のReranker</strong>でクエリとチャンクの組み合わせをより精密にスコアリングし、最終的に上位5〜10件程度に絞り込むのが定石です。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Reranker</th>
                    <th>提供元</th>
                    <th>特徴</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Rerank 3.5</td>
                    <td>Cohere</td>
                    <td>幅広いドキュメントで安定した既定値として推奨されることが多い</td>
                  </tr>
                  <tr>
                    <td>rerank-2.5</td>
                    <td>Voyage AI</td>
                    <td>指示追従性能、より大きなコンテキスト長</td>
                  </tr>
                  <tr>
                    <td>bge-reranker-v2-m3</td>
                    <td>BAAI(オープンソース)</td>
                    <td>セルフホスト可能、コスト最適化に向く</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Rerankerは「一次検索のRecallは高いがPrecisionが低い」場合に効果を発揮します。逆に一次検索でそもそも正解チャンクが候補に入っていない(Recallが低い)場合は、Rerankerをいくら強化しても改善しません。RerankerをONにした場合とOFFにした場合の両方で、NDCG・Recallの変化・追加レイテンシの3点(通称「evalトライアングル」)を同じクエリセットで比較することが推奨されています。参考値として、Cohere Rerank 3.5は2,000トークン未満のチャンクでp50あたり約80〜150ミリ秒、3,000トークンを超えるとp99で200ミリ秒以上のレイテンシが追加されると報告されています。
            </p>

            <h3>7.4 クエリ変換(Query Transformation)</h3>
            <ul className={styles.navListInline}>
              <li>
                <strong>HyDE(Hypothetical Document Embeddings)</strong>: LLMに理想的な回答の仮想文書を生成させ、そのEmbeddingで検索する手法
              </li>
              <li>
                <strong>Query Rewriting</strong>: 曖昧・省略の多い質問を検索しやすい明確な形に言い換える
              </li>
              <li>
                <strong>Query Decomposition</strong>: 複数の論点を含む質問を単一の論点に分解してそれぞれ検索する
              </li>
            </ul>
            <p>
              ある学術研究(TREC DL 2019/2020データセット)では、教師あり手法がもっとも高い性能を示し、HyDEとハイブリッド検索を組み合わせた構成が最高スコアを記録した一方、クエリの書き換えや分解単体では検索性能の向上に必ずしもつながらなかったとされています。性能とレイテンシのバランスを考えると「ハイブリッド検索+HyDE」がデフォルトの推奨構成として挙げられています。
            </p>

            <div className={styles.refBox}>
              <h4>
                <i className="ti ti-link" />
                参照URL
              </h4>
              <Ext href="https://www.digitalapplied.com/blog/hybrid-search-bm25-vector-reranking-reference-2026">
                https://www.digitalapplied.com/blog/hybrid-search-bm25-vector-reranking-reference-2026
              </Ext>
              <Ext href="https://denser.ai/blog/hybrid-search-for-rag/">https://denser.ai/blog/hybrid-search-for-rag/</Ext>
              <Ext href="https://appscale.blog/en/blog/hybrid-search-and-reranking-production-rag-bm25-dense-cross-encoder-2026">
                https://appscale.blog/en/blog/hybrid-search-and-reranking-production-rag-bm25-dense-cross-encoder-2026
              </Ext>
              <Ext href="https://towardsdatascience.com/hybrid-search-and-re-ranking-in-production-rag/">
                https://towardsdatascience.com/hybrid-search-and-re-ranking-in-production-rag/
              </Ext>
              <Ext href="https://futureagi.com/blog/evaluating-cohere-rerank-rag-2026/">https://futureagi.com/blog/evaluating-cohere-rerank-rag-2026/</Ext>
              <Ext href="https://arxiv.org/pdf/2407.01219">https://arxiv.org/pdf/2407.01219</Ext>
            </div>
          </section>

          <section className={`${styles.section} chapter`} id="sec-8">
            <h2>
              <i className="ti ti-message-2" />8. ステップ5: 生成(Generation)とプロンプト設計
            </h2>

            <h3>8.1 検索結果をどのようにプロンプトに組み込むか</h3>
            <ul className={styles.navListInline}>
              <li>
                <strong>件数を絞る</strong>: 関連性の低いチャンクを大量に含めると、LLMが情報を平均化し回答の質が下がる(コンテキスト汚染)
              </li>
              <li>
                <strong>出典情報を明示する</strong>: 各チャンクにメタデータ(文書名・セクション・URL等)を付与し、LLMに引用を促す
              </li>
              <li>
                <strong>ロングコンテキストとの使い分け</strong>: コンテキスト長が伸びるほど回答品質が劣化する「コンテキスト崖(context cliff)」現象が指摘されており、約2,500トークン付近を境に応答品質が下がり始めるという分析があります
              </li>
            </ul>

            <h3>8.2 ハルシネーション対策としてのグラウンディング</h3>
            <p>
              RAGの主な目的の1つは、LLMの回答を検索結果に「グラウンディング(根拠付け)」し、ハルシネーションを抑えることです。実務ガイドでは、ハルシネーションのほとんどのケースは「LLMが何もないところから作り話をしている」のではなく、「間違ったコンテキストを検索してしまった結果、それをもっともらしく説明している」ことが原因だと繰り返し指摘されています。生成部分をいくらプロンプトエンジニアリングで改善しても、検索(Retrieval)が壊れていれば根本解決にはなりません。
            </p>

            <h3>8.3 プロンプト設計の基本パターン</h3>
            <ol className={styles.navListInline}>
              <li>役割・目的の明示: 何のためのアシスタントかを明確にする</li>
              <li>検索結果の提示: 出典情報付きでチャンクを列挙する</li>
              <li>
                回答ルールの明示: 「検索結果に含まれない情報は答えない」「不明な場合は不明と答える」といった制約を明記する
              </li>
              <li>引用形式の指定: どの文書のどの部分を根拠にしたか明示させる</li>
            </ol>

            <div className={styles.refBox}>
              <h4>
                <i className="ti ti-link" />
                参照URL
              </h4>
              <Ext href="https://www.firecrawl.dev/blog/best-chunking-strategies-rag">https://www.firecrawl.dev/blog/best-chunking-strategies-rag</Ext>
              <Ext href="https://nerdleveltech.com/guides/rag-systems">https://nerdleveltech.com/guides/rag-systems</Ext>
              <Ext href="https://lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/">
                https://lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/
              </Ext>
            </div>
          </section>

          <section className={`${styles.section} chapter`} id="sec-9">
            <h2>
              <i className="ti ti-chart-bar" />9. 評価(Evaluation)
            </h2>

            <h3>9.1 なぜ評価基盤が必須なのか</h3>
            <p>
              「動いているように見える」ことと「実際に正しい」ことは別物です。2026年には新規RAGデプロイの60%が初日から体系的な評価を組み込んでいるという調査もあり、2025年初頭の30%未満から大きく増加しています。RAGは「作って終わり」ではなく「継続的に測定するもの」として扱われるようになってきています。
            </p>

            <h3>9.2 RAGASの4大指標</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>指標</th>
                    <th>問い</th>
                    <th>段階</th>
                    <th>目安の合格ライン</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Context Precision</td>
                    <td>取得したチャンクは実際に関連しているか</td>
                    <td>検索</td>
                    <td>0.7〜0.8以上</td>
                  </tr>
                  <tr>
                    <td>Context Recall</td>
                    <td>関連する情報をすべて取得できたか</td>
                    <td>検索</td>
                    <td>0.8前後</td>
                  </tr>
                  <tr>
                    <td>Faithfulness</td>
                    <td>回答は取得した文脈と矛盾していないか</td>
                    <td>生成</td>
                    <td>0.9以上を目標にすることが多い</td>
                  </tr>
                  <tr>
                    <td>Answer Relevancy</td>
                    <td>回答は質問に対して的確に答えているか</td>
                    <td>生成</td>
                    <td>0.85前後</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              補助的な指標として、正解データがある場合には<strong>Answer Correctness</strong>を使い、事実の重なりと意味的類似度を組み合わせて生成回答と正解を直接比較することもあります。ラベル付きの正解文書がある場合はPrecision@k・Recall@k・MRR(Mean Reciprocal Rank)・NDCGといった伝統的な情報検索指標も併用されます。
            </p>

            <h3>9.3 診断の実例</h3>
            <div className={`${styles.callout} ${styles.calloutWarning}`}>
              <i className="ti ti-alert-triangle" />
              <div>
                <strong>実例: </strong>
                ある法律関連のRAG事例では、オフライン評価でFaithfulness 0.91という高スコアを記録して本番稼働しましたが、3週間後にユーザーから「重要な条文が回答に含まれていない」という苦情が相次ぎました。ダッシュボード上のFaithfulnessは0.91のままでしたが、Context Recallを測定すると0.62まで落ち込んでいました。原因は、複数条文にまたがる質問(multi-hop)で検索側が2つ目の条文を取りこぼし、生成側は取得できた部分的な文脈から一貫性のある回答を作ってしまっていたことでした。「生成指標だけを見ていると検索の劣化を見逃す」という典型的な落とし穴です。
              </div>
            </div>

            <h3>9.4 評価ツールの使い分け</h3>
            <ul className={styles.navListInline}>
              <li>
                <strong>Ragas</strong>: チャンキングやEmbeddingモデルをチューニングする際のオフライン実験的評価
              </li>
              <li><strong>DeepEval</strong>: CI/CDパイプラインに組み込むリリース前のゲート</li>
              <li>
                <strong>TruLens / LangSmith / Arize Phoenix</strong>: 本番環境での継続的なオブザーバビリティ
              </li>
            </ul>
            <p>
              多くの実務ガイドが推奨する出発点は、50〜200件程度の代表的な質問と人手で検証した理想的な回答からなるゴールデンデータセットを作成することです。まずこのデータセットでオフライン評価を行い、その後LLM-as-judgeを用いた継続的な本番監視へと発展させていく流れが一般的です。
            </p>

            <div className={styles.refBox}>
              <h4>
                <i className="ti ti-link" />
                参照URL
              </h4>
              <Ext href="https://qaskills.sh/blog/rag-evaluation-metrics-complete-2026">https://qaskills.sh/blog/rag-evaluation-metrics-complete-2026</Ext>
              <Ext href="https://futureagi.com/blog/rag-evaluation-metrics-2025/">https://futureagi.com/blog/rag-evaluation-metrics-2025/</Ext>
              <Ext href="https://datavlab.ai/post/rag-evaluation-methods-metrics-2026-guide">
                https://datavlab.ai/post/rag-evaluation-methods-metrics-2026-guide
              </Ext>
              <Ext href="https://atlan.com/know/how-to-evaluate-rag-systems-explained/">https://atlan.com/know/how-to-evaluate-rag-systems-explained/</Ext>
            </div>
          </section>

          <section className={`${styles.section} chapter`} id="sec-10">
            <h2>
              <i className="ti ti-topology-star" />10. 発展的アーキテクチャ: Agentic RAG / GraphRAG / Adaptive RAG
            </h2>
            <p>
              基本のRAG(ハイブリッド検索+Reranker)で対応できないケースに対して、2026年時点でよく使われる発展形が3つあります。
            </p>

            <h3>10.1 GraphRAG</h3>
            <p>
              GraphRAGは、文書チャンクをそのまま埋め込むのではなく、文書からエンティティ(人物・組織・製品など)と関係性を抽出してナレッジグラフを構築し、検索時にはベクトル検索に加えてグラフ探索(多段階のリレーション追跡)を行う手法です。Microsoftが2024年半ばにオープンソースとして公開し、2025年にかけて急速に普及しました。
            </p>
            <p>
              GraphRAGが特に効果を発揮するのは、規制コンプライアンス分析・研究統合・競合分析・サプライチェーンの依存関係分析など、<strong>複数文書をまたいだ関係性を問う質問(multi-hop)</strong>です。単純な事実検索であれば通常のベクトルRAGの方が高速・低コストで同等以上の精度を出せるとされています。
            </p>

            <h3>10.2 Agentic RAG</h3>
            <p>
              Agentic RAGは、LLM自身が検索の主導権を持ち、質問をサブクエリに分解し、どの検索ツールを呼ぶか判断し、結果を評価し、必要なら再検索するというループを回す手法です。単純な検索器としてではなく、LLMを「推論しながら検索するエージェント」として使う点が特徴です。複雑で曖昧な多段階質問に対してのみ品質向上分の価値があり、単純な事実質問に使うのは無駄なコストだと位置づけられています。1回のクエリあたりLLM呼び出しが3〜10倍に増えるという試算もあります。
            </p>

            <h3>10.3 Adaptive RAG(適応型ルーティング)</h3>
            <p>
              2026年に登場している最新のベストプラクティスが<strong>Adaptive RAG</strong>です。クエリの複雑さを分類する「複雑度分類器」を最初に置き、質問の性質によって異なるパイプラインへルーティングする設計です。
            </p>

            <div className={styles.mermaidBlock}>
              <div className={styles.mermaidContainer}>
                <MermaidDiagram chart={DIAGRAMS.adaptive} />
              </div>
              <div className={styles.mermaidCaption}>図4: Adaptive RAGのルーティング</div>
            </div>

            <p>
              この分類器は、数個の例を与えたシンプルなLLMプロンプトでも、専用に学習した分類モデルでも実装できます。実際のクエリの多数派を占める単純な質問には高速・低コストなパイプラインを、本当に複雑な推論が必要な少数派の質問にはコストの高いAgentic/GraphRAGを充てることで、コストと品質のバランスを最適化できます。
            </p>
            <div className={`${styles.callout} ${styles.calloutInfo}`}>
              <i className="ti ti-info-circle" />
              <div>
                <strong>重要: </strong>
                複数の実務ガイドが共通して述べているのは、「RAGにおける最も多い失敗は複雑さの過小設計ではなく、過剰設計である」という点です。まずハイブリッド検索+Rerankerというシンプルな構成から始め、RAGASなどで検索品質を測定し、指標が実際に不足を示した場合にのみクエリ変換・Agentic・GraphRAGといった複雑さを追加していく順序が推奨されています。
              </div>
            </div>

            <div className={styles.refBox}>
              <h4>
                <i className="ti ti-link" />
                参照URL
              </h4>
              <Ext href="https://blog.starmorph.com/blog/rag-techniques-compared-best-practices-guide">
                https://blog.starmorph.com/blog/rag-techniques-compared-best-practices-guide
              </Ext>
              <Ext href="https://www.teacherandtask.com/blog/advanced-rag-patterns-2026-production-engineering-guide">
                https://www.teacherandtask.com/blog/advanced-rag-patterns-2026-production-engineering-guide
              </Ext>
              <Ext href="https://aithinkerlab.com/build-rag-systems-2026-architecture-patterns/">
                https://aithinkerlab.com/build-rag-systems-2026-architecture-patterns/
              </Ext>
              <Ext href="https://ailearningguides.com/rag-production-patterns-2026/">https://ailearningguides.com/rag-production-patterns-2026/</Ext>
              <Ext href="https://jobsbyculture.com/blog/agentic-rag-guide-2026">https://jobsbyculture.com/blog/agentic-rag-guide-2026</Ext>
              <Ext href="https://kuriko-iwai.com/research/rag-architectures-decision-path-guide">
                https://kuriko-iwai.com/research/rag-architectures-decision-path-guide
              </Ext>
            </div>
          </section>

          <section className={`${styles.section} chapter`} id="sec-11">
            <h2>
              <i className="ti ti-server-2" />11. 本番運用のベストプラクティス
            </h2>

            <h3>11.1 段階的に複雑さを追加する</h3>
            <ol className={styles.navListInline}>
              <li>Recursive Chunking(300〜500トークン、10〜20%オーバーラップ)で最初のパイプラインを作る</li>
              <li>定番のEmbeddingモデルと使い慣れたベクトルDBで動かす</li>
              <li>RAGASで50〜200件のゴールデンデータセットを使いFaithfulness等を測定する</li>
              <li>指標が不足していればハイブリッド検索とRerankerを追加する</li>
              <li>それでも足りなければContextual RetrievalやSemantic Chunkingを検討する</li>
              <li>複雑な多段階質問や関係性クエリが多い場合にのみAgentic RAGやGraphRAGを検討する</li>
            </ol>

            <h3>11.2 マルチテナンシーとデータ分離</h3>
            <p>
              複数の顧客・部門にまたがってRAGシステムを提供する場合、テナント間でデータが漏洩しないような分離設計が必要です。実務では「共有インフラ+論理分離」「テナントごとの専用インフラ」「ハイブリッド」の3パターンに分類されます。Pinecone・Qdrant・Weaviateはそれぞれ異なる仕組み(namespace、インデックス済みペイロードフィールド、ネイティブなマルチテナンシー機構)でこれを実現しています。
            </p>

            <h3>11.3 セキュリティ: 間接的なプロンプトインジェクション</h3>
            <p>
              Agentic RAGのようにLLMがツールを自律的に呼び出すパターンが増えるほど、検索対象の文書内に埋め込まれた悪意ある指示(間接的プロンプトインジェクション)による攻撃リスクも増加します。「完全な防御は存在しない」という前提のもと、次のような多層防御が推奨されています。
            </p>
            <ul className={styles.navListInline}>
              <li>アクセス制御(ACL)を検索層でも確実に適用する</li>
              <li>構造的にプロンプトとデータを分離する</li>
              <li>出力の検証(Output verification)を行う</li>
              <li>異常検知・監視体制を整え、インシデント対応能力を持つ</li>
            </ul>

            <h3>11.4 コスト最適化</h3>
            <ul className={styles.navListInline}>
              <li>Embeddingの次元数をMRLで必要最小限に切り詰める</li>
              <li>ハイブリッド検索は一次候補を絞り込んだ上でRerankerを適用する</li>
              <li>プロンプトキャッシュ・検索結果キャッシュを活用する</li>
              <li>単純なクエリにはAdaptive RAGで軽量パイプラインを割り当てる</li>
            </ul>

            <div className={styles.refBox}>
              <h4>
                <i className="ti ti-link" />
                参照URL
              </h4>
              <Ext href="https://ailearningguides.com/rag-production-patterns-2026/">https://ailearningguides.com/rag-production-patterns-2026/</Ext>
              <Ext href="https://aiml.qa/vector-database-comparison-2026/">https://aiml.qa/vector-database-comparison-2026/</Ext>
              <Ext href="https://blog.starmorph.com/blog/rag-techniques-compared-best-practices-guide">
                https://blog.starmorph.com/blog/rag-techniques-compared-best-practices-guide
              </Ext>
              <Ext href="https://www.agileinfoways.com/blog/building-production-ready-rag-systems-2026">
                https://www.agileinfoways.com/blog/building-production-ready-rag-systems-2026
              </Ext>
            </div>
          </section>

          <section className={`${styles.section} chapter`} id="sec-12">
            <h2>
              <i className="ti ti-alert-triangle" />12. よくある失敗パターンと対策
            </h2>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>失敗パターン</th>
                    <th>症状</th>
                    <th>主な原因</th>
                    <th>対策</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>意味的ギャップ</td>
                    <td>検索が当たらない</td>
                    <td>Dense検索のみに依存</td>
                    <td>ハイブリッド検索、HyDEの活用</td>
                  </tr>
                  <tr>
                    <td>コンテキスト汚染</td>
                    <td>回答が曖昧・的外れになる</td>
                    <td>関連性の低いチャンクを大量に投入</td>
                    <td>Rerankerで上位のみ厳選</td>
                  </tr>
                  <tr>
                    <td>チャンキングの副作用</td>
                    <td>取得できても使えないチャンク</td>
                    <td>固定長分割で文・表・コードが分断</td>
                    <td>Recursive/構造認識分割、Contextual Retrieval</td>
                  </tr>
                  <tr>
                    <td>コンテキスト崖</td>
                    <td>回答品質が低下</td>
                    <td>不要な情報まで全文投入</td>
                    <td>本当に必要なチャンクのみ厳選</td>
                  </tr>
                  <tr>
                    <td>忠実性は高いが実は不十分</td>
                    <td>ダッシュボード上は正常に見えるが誤答</td>
                    <td>検索段階の指標を測っていない</td>
                    <td>検索指標と生成指標の両方を継続監視</td>
                  </tr>
                  <tr>
                    <td>過剰設計</td>
                    <td>コストと複雑さばかり増える</td>
                    <td>単純な質問にAgentic/GraphRAGを一律適用</td>
                    <td>Adaptive RAGでルーティング</td>
                  </tr>
                  <tr>
                    <td>ハルシネーション</td>
                    <td>もっともらしいが誤った回答</td>
                    <td>検索結果が間違っている</td>
                    <td>まず検索品質を疑う</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.refBox}>
              <h4>
                <i className="ti ti-link" />
                参照URL
              </h4>
              <Ext href="https://lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/">
                https://lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/
              </Ext>
              <Ext href="https://www.firecrawl.dev/blog/best-chunking-strategies-rag">https://www.firecrawl.dev/blog/best-chunking-strategies-rag</Ext>
              <Ext href="https://www.teacherandtask.com/blog/advanced-rag-patterns-2026-production-engineering-guide">
                https://www.teacherandtask.com/blog/advanced-rag-patterns-2026-production-engineering-guide
              </Ext>
              <Ext href="https://atlan.com/know/how-to-evaluate-rag-systems-explained/">https://atlan.com/know/how-to-evaluate-rag-systems-explained/</Ext>
            </div>
          </section>

          <section className={`${styles.section} chapter`} id="sec-13">
            <h2>
              <i className="ti ti-checklist" />13. まとめ: 実装チェックリスト
            </h2>
            <ul className={styles.checklist}>
              <li>
                <i className="ti ti-circle-check" />
                ドキュメントのパース・クリーニングを行い、ノイズを除去したか
              </li>
              <li>
                <i className="ti ti-circle-check" />
                Recursive Chunking(300〜500トークン、10〜20%オーバーラップ)から始めたか
              </li>
              <li>
                <i className="ti ti-circle-check" />
                チャンクにメタデータ(出典・見出し・ページ番号)を付与したか
              </li>
              <li>
                <i className="ti ti-circle-check" />
                自社のモダリティ・言語要件・セルフホスト可否に合ったEmbeddingモデルを選定したか
              </li>
              <li>
                <i className="ti ti-circle-check" />
                既存の技術スタックに合ったベクトルデータベースを選んだか
              </li>
              <li>
                <i className="ti ti-circle-check" />
                ハイブリッド検索(Dense+BM25、RRFで統合)を実装したか
              </li>
              <li>
                <i className="ti ti-circle-check" />
                Reranker導入前後でNDCG・Recall・レイテンシを比較したか
              </li>
              <li>
                <i className="ti ti-circle-check" />
                RAGAS等でゴールデンデータセット(50〜200件)による評価基盤を構築したか
              </li>
              <li>
                <i className="ti ti-circle-check" />
                Faithfulness・Context Precision・Context Recall・Answer Relevancyを継続的に監視しているか
              </li>
              <li>
                <i className="ti ti-circle-check" />
                質問の複雑さに応じてAdaptive RAG的なルーティングを検討したか
              </li>
              <li>
                <i className="ti ti-circle-check" />
                マルチテナンシー・アクセス制御・プロンプトインジェクション対策を設計したか
              </li>
              <li>
                <i className="ti ti-circle-check" />
                コスト最適化(MRLによる次元削減、キャッシュ活用)を検討したか
              </li>
            </ul>
          </section>

          <section className={`${styles.section} chapter`} id="sec-14">
            <h2>
              <i className="ti ti-link" />14. 参考文献一覧(全URL)
            </h2>

            <h3>RAG全体・アーキテクチャ</h3>
            <div className={styles.refBox}>
              <Ext href="https://blog.starmorph.com/blog/rag-techniques-compared-best-practices-guide">
                https://blog.starmorph.com/blog/rag-techniques-compared-best-practices-guide
              </Ext>
              <Ext href="https://nerdleveltech.com/guides/rag-systems">https://nerdleveltech.com/guides/rag-systems</Ext>
              <Ext href="https://www.callmissed.com/en/blog/rag-best-practices-2026">https://www.callmissed.com/en/blog/rag-best-practices-2026</Ext>
              <Ext href="https://lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/">
                https://lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/
              </Ext>
              <Ext href="https://decodethefuture.org/en/rag/">https://decodethefuture.org/en/rag/</Ext>
              <Ext href="https://www.techment.com/blogs/rag-in-2026/">https://www.techment.com/blogs/rag-in-2026/</Ext>
              <Ext href="https://jobsbyculture.com/blog/rag-architecture-guide-2026">https://jobsbyculture.com/blog/rag-architecture-guide-2026</Ext>
            </div>

            <h3>Embeddingsの基礎・モデル比較</h3>
            <div className={styles.refBox}>
              <Ext href="https://aimultiple.com/embedding-models">https://aimultiple.com/embedding-models</Ext>
              <Ext href="https://pecollective.com/tools/best-embedding-models/">https://pecollective.com/tools/best-embedding-models/</Ext>
              <Ext href="https://www.buildmvpfast.com/blog/best-embedding-model-comparison-voyage-openai-cohere-2026">
                https://www.buildmvpfast.com/blog/best-embedding-model-comparison-voyage-openai-cohere-2026
              </Ext>
              <Ext href="https://crazyrouter.com/en/blog/ai-embeddings-comparison-2026-guide">
                https://crazyrouter.com/en/blog/ai-embeddings-comparison-2026-guide
              </Ext>
              <Ext href="https://mixpeek.com/curated-lists/best-embedding-models">https://mixpeek.com/curated-lists/best-embedding-models</Ext>
              <Ext href="https://www.openxcell.com/blog/best-embedding-models/">https://www.openxcell.com/blog/best-embedding-models/</Ext>
              <Ext href="https://www.aitechboss.com/best-embedding-models-2026/">https://www.aitechboss.com/best-embedding-models-2026/</Ext>
              <Ext href="https://reintech.io/blog/embedding-models-comparison-2026-openai-cohere-voyage-bge">
                https://reintech.io/blog/embedding-models-comparison-2026-openai-cohere-voyage-bge
              </Ext>
              <Ext href="https://www.index.dev/skill-vs-skill/ai-openai-embed-vs-cohere-vs-voyage">
                https://www.index.dev/skill-vs-skill/ai-openai-embed-vs-cohere-vs-voyage
              </Ext>
              <Ext href="https://elephas.app/blog/best-embedding-models">https://elephas.app/blog/best-embedding-models</Ext>
              <Ext href="https://tensoria.fr/en/blog/embedding-models-2026-guide">https://tensoria.fr/en/blog/embedding-models-2026-guide</Ext>
              <Ext href="https://christhomas.co.uk/blog/2025/10/31/match-embedding-dimensions-to-your-domain-not-defaults/">
                https://christhomas.co.uk/blog/2025/10/31/match-embedding-dimensions-to-your-domain-not-defaults/
              </Ext>
            </div>

            <h3>Matryoshka Representation Learning・MTEB</h3>
            <div className={styles.refBox}>
              <Ext href="https://www.mindstudio.ai/blog/what-is-matryoshka-representation-learning">
                https://www.mindstudio.ai/blog/what-is-matryoshka-representation-learning
              </Ext>
              <Ext href="https://www.mindstudio.ai/blog/matryoshka-representation-learning-gemini-embedding-2">
                https://www.mindstudio.ai/blog/matryoshka-representation-learning-gemini-embedding-2
              </Ext>
              <Ext href="https://modal.com/blog/mteb-leaderboard-article">https://modal.com/blog/mteb-leaderboard-article</Ext>
              <Ext href="https://awesomeagents.ai/leaderboards/embedding-model-leaderboard-mteb-march-2026/">
                https://awesomeagents.ai/leaderboards/embedding-model-leaderboard-mteb-march-2026/
              </Ext>
              <Ext href="https://awesomeagents.ai/leaderboards/embedding-model-leaderboard-mteb-april-2026/">
                https://awesomeagents.ai/leaderboards/embedding-model-leaderboard-mteb-april-2026/
              </Ext>
              <Ext href="https://app.ailog.fr/en/blog/guides/choosing-embedding-models">https://app.ailog.fr/en/blog/guides/choosing-embedding-models</Ext>
              <Ext href="https://arxiv.org/pdf/2505.24581">https://arxiv.org/pdf/2505.24581</Ext>
            </div>

            <h3>チャンキング戦略</h3>
            <div className={styles.refBox}>
              <Ext href="https://www.digitalapplied.com/blog/rag-chunking-strategies-2026-retrieval-quality-playbook">
                https://www.digitalapplied.com/blog/rag-chunking-strategies-2026-retrieval-quality-playbook
              </Ext>
              <Ext href="https://langcopilot.com/posts/2025-10-11-document-chunking-for-rag-practical-guide">
                https://langcopilot.com/posts/2025-10-11-document-chunking-for-rag-practical-guide
              </Ext>
              <Ext href="https://www.firecrawl.dev/blog/best-chunking-strategies-rag">https://www.firecrawl.dev/blog/best-chunking-strategies-rag</Ext>
              <Ext href="https://atlan.com/know/chunking-strategies-rag/">https://atlan.com/know/chunking-strategies-rag/</Ext>
              <Ext href="https://arxiv.org/pdf/2603.25333">https://arxiv.org/pdf/2603.25333</Ext>
              <Ext href="https://arxiv.org/pdf/2604.22861">https://arxiv.org/pdf/2604.22861</Ext>
              <Ext href="https://arxiv.org/pdf/2502.05589">https://arxiv.org/pdf/2502.05589</Ext>
              <Ext href="https://arxiv.org/pdf/2604.17677">https://arxiv.org/pdf/2604.17677</Ext>
            </div>

            <h3>Contextual Retrieval(Anthropic)</h3>
            <div className={styles.refBox}>
              <Ext href="https://www.anthropic.com/news/contextual-retrieval">https://www.anthropic.com/news/contextual-retrieval</Ext>
              <Ext href="https://simonwillison.net/2024/Sep/20/introducing-contextual-retrieval/">
                https://simonwillison.net/2024/Sep/20/introducing-contextual-retrieval/
              </Ext>
              <Ext href="https://m-ruminer.medium.com/anthropics-contextual-retrieval-11dbd16841b4">
                https://m-ruminer.medium.com/anthropics-contextual-retrieval-11dbd16841b4
              </Ext>
              <Ext href="https://www.plushcap.com/content/anthropic/blog/anthropic-contextual-retrieval">
                https://www.plushcap.com/content/anthropic/blog/anthropic-contextual-retrieval
              </Ext>
              <Ext href="https://www.engineering.fyi/article/introducing-contextual-retrieval">
                https://www.engineering.fyi/article/introducing-contextual-retrieval
              </Ext>
            </div>

            <h3>ベクトルデータベース</h3>
            <div className={styles.refBox}>
              <Ext href="https://encore.dev/articles/best-vector-databases">https://encore.dev/articles/best-vector-databases</Ext>
              <Ext href="https://www.firecrawl.dev/blog/best-vector-databases">https://www.firecrawl.dev/blog/best-vector-databases</Ext>
              <Ext href="https://www.datacamp.com/blog/the-top-5-vector-databases">https://www.datacamp.com/blog/the-top-5-vector-databases</Ext>
              <Ext href="https://iternal.ai/insights/best-vector-databases-2026">https://iternal.ai/insights/best-vector-databases-2026</Ext>
              <Ext href="https://medium.com/@pratik-rupareliya/top-15-vector-databases-in-2026-a-production-decision-guide-from-100-enterprise-deployments-dd58a04f51a5">
                https://medium.com/@pratik-rupareliya/top-15-vector-databases-in-2026-a-production-decision-guide-from-100-enterprise-deployments-dd58a04f51a5
              </Ext>
              <Ext href="https://www.digitalapplied.com/blog/vector-databases-for-ai-agents-pinecone-qdrant-2026">
                https://www.digitalapplied.com/blog/vector-databases-for-ai-agents-pinecone-qdrant-2026
              </Ext>
              <Ext href="https://aiml.qa/vector-database-comparison-2026/">https://aiml.qa/vector-database-comparison-2026/</Ext>
              <Ext href="https://medium.com/data-science-collective/pinecone-vs-weaviate-vs-qdrant-vs-milvus-66d5bfbcc460">
                https://medium.com/data-science-collective/pinecone-vs-weaviate-vs-qdrant-vs-milvus-66d5bfbcc460
              </Ext>
              <Ext href="https://vecstore.app/blog/vector-database-performance-compared">https://vecstore.app/blog/vector-database-performance-compared</Ext>
              <Ext href="https://www.kalviumlabs.ai/blog/vector-databases-compared-pgvector-pinecone-qdrant-weaviate/">
                https://www.kalviumlabs.ai/blog/vector-databases-compared-pgvector-pinecone-qdrant-weaviate/
              </Ext>
            </div>

            <h3>ハイブリッド検索・Reranking・クエリ変換</h3>
            <div className={styles.refBox}>
              <Ext href="https://www.digitalapplied.com/blog/hybrid-search-bm25-vector-reranking-reference-2026">
                https://www.digitalapplied.com/blog/hybrid-search-bm25-vector-reranking-reference-2026
              </Ext>
              <Ext href="https://denser.ai/blog/hybrid-search-for-rag/">https://denser.ai/blog/hybrid-search-for-rag/</Ext>
              <Ext href="https://appscale.blog/en/blog/hybrid-search-and-reranking-production-rag-bm25-dense-cross-encoder-2026">
                https://appscale.blog/en/blog/hybrid-search-and-reranking-production-rag-bm25-dense-cross-encoder-2026
              </Ext>
              <Ext href="https://towardsdatascience.com/hybrid-search-and-re-ranking-in-production-rag/">
                https://towardsdatascience.com/hybrid-search-and-re-ranking-in-production-rag/
              </Ext>
              <Ext href="https://aitechconnect.in/news/hybrid-search-rag-bm25-vector-production">
                https://aitechconnect.in/news/hybrid-search-rag-bm25-vector-production
              </Ext>
              <Ext href="https://futureagi.com/blog/evaluating-cohere-rerank-rag-2026/">https://futureagi.com/blog/evaluating-cohere-rerank-rag-2026/</Ext>
              <Ext href="https://arxiv.org/pdf/2407.01219">https://arxiv.org/pdf/2407.01219</Ext>
              <Ext href="https://arxiv.org/pdf/2603.24012">https://arxiv.org/pdf/2603.24012</Ext>
              <Ext href="https://arxiv.org/pdf/2506.23026">https://arxiv.org/pdf/2506.23026</Ext>
            </div>

            <h3>評価(Evaluation)</h3>
            <div className={styles.refBox}>
              <Ext href="https://qaskills.sh/blog/rag-evaluation-metrics-complete-2026">https://qaskills.sh/blog/rag-evaluation-metrics-complete-2026</Ext>
              <Ext href="https://futureagi.com/blog/rag-evaluation-metrics-2025/">https://futureagi.com/blog/rag-evaluation-metrics-2025/</Ext>
              <Ext href="https://datavlab.ai/post/rag-evaluation-methods-metrics-2026-guide">
                https://datavlab.ai/post/rag-evaluation-methods-metrics-2026-guide
              </Ext>
              <Ext href="https://atlan.com/know/how-to-evaluate-rag-systems-explained/">https://atlan.com/know/how-to-evaluate-rag-systems-explained/</Ext>
            </div>

            <h3>Agentic RAG・GraphRAG・Adaptive RAG</h3>
            <div className={styles.refBox}>
              <Ext href="https://www.teacherandtask.com/blog/advanced-rag-patterns-2026-production-engineering-guide">
                https://www.teacherandtask.com/blog/advanced-rag-patterns-2026-production-engineering-guide
              </Ext>
              <Ext href="https://aithinkerlab.com/build-rag-systems-2026-architecture-patterns/">
                https://aithinkerlab.com/build-rag-systems-2026-architecture-patterns/
              </Ext>
              <Ext href="https://ailearningguides.com/rag-production-patterns-2026/">https://ailearningguides.com/rag-production-patterns-2026/</Ext>
              <Ext href="https://jobsbyculture.com/blog/agentic-rag-guide-2026">https://jobsbyculture.com/blog/agentic-rag-guide-2026</Ext>
              <Ext href="https://www.agileinfoways.com/blog/building-production-ready-rag-systems-2026">
                https://www.agileinfoways.com/blog/building-production-ready-rag-systems-2026
              </Ext>
              <Ext href="https://kuriko-iwai.com/research/rag-architectures-decision-path-guide">
                https://kuriko-iwai.com/research/rag-architectures-decision-path-guide
              </Ext>
              <Ext href="https://www.techment.com/blogs/rag-architectures-enterprise-use-cases-2026/">
                https://www.techment.com/blogs/rag-architectures-enterprise-use-cases-2026/
              </Ext>
              <Ext href="https://medium.com/@elammarisoufiane/rag-in-2026-architecture-shifts-emerging-patterns-and-what-it-means-for-java-developers-6f2803e39787">
                https://medium.com/@elammarisoufiane/rag-in-2026-architecture-shifts-emerging-patterns-and-what-it-means-for-java-developers-6f2803e39787
              </Ext>
            </div>

            <div className={styles.footnote}>
              本ガイドは2026年7月時点の複数の一次情報源・技術ブログ・論文プレプリントをもとに作成しています。ベンダー独自のベンチマーク数値は情報源によって食い違うことがあるため、実運用前に必ず自社データでの検証を行ってください。
            </div>
          </section>
        </main>
      </div>

      {/* ================= PAGE FOOTER ================= */}
      <footer className={styles.pageFooter}>
        <div className={styles.codeLine}>LLM Studies — RAG &amp; Embeddings Complete Guide (2026)</div>
      </footer>
    </div>
  );
}
