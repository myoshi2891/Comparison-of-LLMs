# Gemini 4 Hydrogen 完全ガイド(中級〜上級者向け・ステップバイステップ版)

(最終更新日: 2026-11-15)

> **対象読者**: Gemini API / Google AI Studio / Antigravity で実プロダクトやエージェントを構築・運用している中級〜上級エンジニア
> **情報基準日**: 2026年11月13日(Gemini 4 Hydrogen 発表の翌日)
> **注意**: 発表直後のため、Google公式情報(ブログ・ドキュメント・モデルカード)と第三者記事・個人検証を明確に区別して記載しています。第三者情報には「(第三者)」、推奨設計のうち筆者の設計判断には「(設計判断)」と付けています。数値・価格は必ず公式ページで再確認してください。

---

## 目次

1. [Gemini 4 Hydrogen とは(位置づけ)](#1-gemini-4-hydrogen-とは位置づけ)
2. [スペック早見表](#2-スペック早見表)
3. [Step 1: モデル選定(Hydrogen / Argon / Carbon / 3.8 Flash)](#step-1-モデル選定)
4. [Step 2: Thinking level の設計と評価](#step-2-thinking-level-の設計と評価)
5. [Step 3: Gemini 3.8 Flash からの移行](#step-3-gemini-38-flash-からの移行)
6. [Step 4: 出力トークンと Long Decode](#step-4-出力トークンと-long-decode)
7. [Step 5: エージェントのツール呼び出し設計](#step-5-エージェントのツール呼び出し設計)
8. [Step 6: Carbon / Argon との役割分担(Orchestrator)](#step-6-carbon--argon-との役割分担orchestrator)
9. [Step 7: マルチモーダル・長文書処理](#step-7-マルチモーダル長文書処理)
10. [Step 8: コスト最適化](#step-8-コスト最適化)
11. [Step 9: 評価・安全性・プロンプトインジェクション対策](#step-9-評価安全性プロンプトインジェクション対策)
12. [Step 10: 提供面別の使いどころ](#step-10-提供面別の使いどころ)
13. [アンチパターン集](#アンチパターン集)
14. [導入チェックリスト](#導入チェックリスト)
15. [補足: その他のベストプラクティスと根拠ソース](#補足-その他のベストプラクティスと根拠ソース)
16. [参考URL一覧](#参考url一覧)

---

## 1. Gemini 4 Hydrogen とは(位置づけ)

Gemini 4 Hydrogen は、Google が2026年11月12日に発表した Gemini 4 ファミリーの**高速・低コスト側のモデル**です。Googleは「日常使いのエージェント実行エンジン(daily driver for agentic workflows)」と位置づけています。

- フロンティア側の **Gemini 4 Carbon / Argon** は、深く長い推論(アーキテクチャ判断、難解なバグ、長期タスク)が得意
- **Hydrogen** は、コード記述・テスト実行・変更検証といった**高速な実行**に最適化
- 単体でも使え、Carbon / Argon と組み合わせる「実行担当」としても設計されている

```mermaid
flowchart TB
    A["Gemini 4 ファミリー"] --> B["Carbon: 最難関の推論・設計判断"]
    A --> C["Argon: 長期タスクを少ないトークンで"]
    A --> D["Hydrogen: 高速実行・日常のコーディングとエージェント"]
    B --> E["計画・難所の解決"]
    C --> E
    D --> F["実装・テスト実行・検証・並列サブエージェント"]
    E --> F
```

**押さえるべき特徴(公式発表ベース)**

| 観点 | 内容 |
|---|---|
| 速度 | デフォルトの high で Gemini 3.8 Flash 比 **2.5倍**高速にタスク完了 |
| 知能 | Artificial Analysis Intelligence Index で high=51(Argon の 50 を上回る)、xhigh=54 |
| コーディング | Terminal-Bench 4.1 で 57%(3.8 Flash は 18.2%) |
| 信頼性 | 捏造(fabricated claims)が 3.8 Flash 比 **5倍以上減少**、ツール失敗や検索結果ゼロへの適応も改善 |
| 思考制御 | 4段階の thinking level(low / medium / high〔既定〕/ **xhigh**〔Hydrogen で新設〕) |
| コンテキスト | 入力・思考・出力で共有する 1,048,576 トークンの統合ウィンドウ |
| 価格 | $1.50 / 100万入力トークン、$7.50 / 100万出力トークン(1Mコンテキスト全域でフラット) |

> 出典: Google公式ブログ(Koray Kavukcuoglu)。URLは[参考URL一覧](#参考url一覧)を参照。

**位置づけについての補足(第三者)**

- 発表前は「Gemini 4 Flash のコードネーム」と報じられていましたが、正式なモデルIDは `gemini-4-hydrogen` です(`gemini-4-flash` ではありません)。
- 「Carbon/Argon から蒸留(distillation)された」という解説を書いている個人開発者もいますが、これは**公式に確認できていない推測**です。第三者記事(MarkTechPost)は、モデルカードに「Gemini 4 Carbon から適応(adapted)された」と書かれていると報じています。モデルカード原本で確認してください。

---

## 2. スペック早見表

| 項目 | Gemini 4 Hydrogen |
|---|---|
| モデルID | `gemini-4-hydrogen` |
| 発表日 | 2026-11-12 |
| 入力モダリティ | テキスト / 画像 / 動画 / 音声 / PDF(第三者記事が公式モデルページを引用) |
| 出力 | テキスト(画像生成・音声生成・Live API は**非対応**、第三者記事が公式モデルページを引用) |
| コンテキスト | 1,048,576 トークン(入力+思考+出力の合算) |
| 出力上限 | 同期リクエストの既定は 65,536 トークン。Long Decode で最大「1M − 入力トークン」まで |
| Thinking level | `low` / `medium` / `high`(既定) / `xhigh` |
| サンプリング | `temperature` / `top_p` / `top_k` は Gemini 4 系では**無視される** |
| キャッシュ | **暗黙的(implicit)キャッシュのみ**。明示的キャッシュは非対応(第三者記事が公式を引用) |
| 無料枠 | あり(Gemini API / AI Studio) |
| 提供面 | Gemini API、Google AI Studio、Android Studio、Gemini for business、Gemini アプリ、Google Search、Gemini in Sheets、Antigravity(HydrogenはFree / Google AI Plus / Pro / Ultraで利用可。Orchestratorのプラン制限は別) |

**価格表(Gemini API・100万トークンあたり、第三者記事が公式価格ページを引用)**

| 消費オプション | 入力 | 出力(思考トークン含む) | キャッシュ |
|---|---|---|---|
| 無料階層(Free tier) | 無料 | 無料 | 暗黙キャッシュは対応(無料のため割引額はなし。Batch / Flex は有料階層のみ。レート制限・データ利用条件は公式料金表で確認) |
| Standard(有料階層) | $1.50 | $7.50 | $0.075(暗黙のみ) |
| Batch(有料階層) | $0.75 | $3.75 | $0.0375 |
| Flex(有料階層) | $0.75 | $3.75 | $0.0375 |
| Priority(有料階層) | $2.70 | $13.50 | $0.135 |

> 公式価格ページ(ai.google.dev の pricing)で最新値を確認してから設計してください。

---

## Step 1: モデル選定

**目的**: 「全部 Hydrogen」でも「全部 Carbon」でもなく、タスクごとに最小コストで品質要件を満たすモデルを選ぶ。

Googleの推奨は、**Carbon / Argon が判断し、Hydrogen が実行する**分業です。

```mermaid
flowchart TD
    S["タスク開始"] --> Q4{"画像生成・音声生成・Live API・明示的キャッシュが必須か"}
    Q4 -- "はい" --> OTHER["必要な機能を提供するモデルを選ぶ"]
    Q4 -- "いいえ" --> Q1{"設計判断・難解なバグ・セキュリティ監査など 深い推論が主目的か"}
    Q1 -- "はい" --> Q2{"長期タスクでトークン消費を抑えたいか"}
    Q2 -- "はい" --> ARGON["Gemini 4 Argon"]
    Q2 -- "いいえ" --> CARBON["Gemini 4 Carbon"]
    Q1 -- "いいえ" --> Q3{"コーディング・ツール実行・文書処理など 実行系が主目的か"}
    Q3 -- "はい" --> HYD["Gemini 4 Hydrogen"]
    Q3 -- "いいえ" --> HYD
    HYD --> Q5{"high で品質が足りないか"}
    Q5 -- "はい" --> XH["xhigh を試す それでも不足なら Carbon / Argon に計画を任せる"]
    Q5 -- "いいえ" --> Q6{"medium でも品質基準を満たすか 別途評価して確認"}
    Q6 -- "はい" --> MED["medium で運用"]
    Q6 -- "いいえ" --> HIGH["high で運用"]
```

**モデル比較表**

| 観点 | Hydrogen | Argon | Carbon |
|---|---|---|---|
| 得意領域 | 日常のコーディング、ツール実行、マルチモーダル文書、並列サブエージェント | 長期タスクを少ないトークンで | 最難関の推論、アーキテクチャ、セキュリティ |
| 既定 thinking | high | medium | medium |
| 利用可能な level | low / medium / high / xhigh | low / medium / high | low / medium / high |
| 価格(入力/出力) | $1.50 / $7.50 | 導入価格 $2 / $10(〜11/30)→ $4 / $20(12/1〜)(第三者・Simon Willison) | Argon と同価格 |
| 無料枠 | あり | なし(第三者記事) | なし |

**ステップ**

1. 必須機能(画像生成・音声生成・Live API・明示的キャッシュなど)の対応を確認してから、自分のタスクを「判断系」と「実行系」に分類する
2. 必須機能を満たす実行系は Hydrogen を既定とし、`high` から評価を始める
3. 判断系の比率が高いワークロードだけ Argon / Carbon を計画役に置く
4. 3.8 Flash を使い続ける理由(単価)がないか確認する(第三者記事では 3.8 Flash の期間限定価格が $0.75 / $3.75 とされています。**価格だけで判断せず、品質・速度・再試行率を含めた総コストで比較**すること)

> **価格の読み方に注意**: Simon Willison は「Hydrogen は安価モデルのはずだが、現時点では Carbon/Argon に対し 25% 引きにすぎない。12/1 に Carbon/Argon が倍額になると割引率が拡大する」と指摘しています。12/1 以降の比率は 1.5 ÷ 4 = 0.375 なので、**約62.5%安**になる計算です(筆者算出)。

---

## Step 2: Thinking level の設計と評価

**目的**: 「必要な推論深度にだけ待ち時間とトークン代を払う」。Hydrogen の最大の設計ポイントです。

### 2-1. 4段階の使い分け(Google公式ガイダンス)

| Level | トークン使用量 | 推奨用途 |
|---|---|---|
| `low` | 最小・最低レイテンシ | コスト/レイテンシ重視、高スループット処理、軽いチャット |
| `medium` | 少なめ | 対話的コーディング、ライブUIプロトタイピング、レスポンス重視のツール呼び出し |
| `high`(既定) | バランス | 複雑なコーディング、エージェント実行、ツール呼び出し、マルチモーダル知識作業 |
| `xhigh` | 最大 | `high` で足りない、難しい多段のコーディング/エージェント課題。追加の待ち時間とトークンを許容できる場合のみ |

**Googleの助言**: まず `high` から始め、`xhigh` は `high` で不足する問題に限定する。`xhigh` は単純なプロンプトで**考えすぎて遅く高くなる**。

### 2-2. 公開されている性能の傾向(第三者)

VentureBeat が掲載した Artificial Analysis 計測の概況です(第3列は同記事のコスト指標で、定義は原文を参照)。

| Level | AA Intelligence Index | 記事掲載のコスト指標 |
|---|---|---|
| low | 27 | $0.29 |
| medium | 41 | $0.80 |
| high | 51 | $1.87 |
| xhigh | 54 | $3.16 |

読み取れる傾向(筆者算出):

- `low → high` で指数が大きく伸びる(27 → 51)
- `high → xhigh` は +3 ポイントに対しコスト指標が約 **1.7倍**(3.16 ÷ 1.87)。**逓減が明確**
- よって「迷ったら high、xhigh は難問だけ」というGoogleの助言と整合する

### 2-3. 評価手順(推奨フロー)

Googleの助言は「**4つのlevel全てで評価し、`max_output_tokens` を大きめにして出力が途中で切れないようにしたうえで、品質基準を満たす最も低いlevelを選ぶ**」です。

```mermaid
flowchart TD
    A["評価セットを用意 実トラフィックから代表サンプル"] --> B["max_output_tokens を十分大きく設定"]
    B --> C["low medium high xhigh の4条件で実行"]
    C --> D["品質 レイテンシ 出力トークン数 再試行率 を記録"]
    D --> E{"low が品質基準を満たすか"}
    E -- "はい" --> L["low を採用"]
    E -- "いいえ" --> F{"medium が満たすか"}
    F -- "はい" --> M["medium を採用"]
    F -- "いいえ" --> G{"high が満たすか"}
    G -- "はい" --> H["high を採用"]
    G -- "いいえ" --> X{"xhigh が品質基準を満たすか"}
    X -- "はい" --> XH["xhigh を採用"]
    X -- "いいえ" --> PLAN["Carbon または Argon に計画を委譲"]
```

### 2-4. 実装上の要点

- `thinking_budget` の扱いは提供面で異なります。Agent Platform(Google Cloud)では指定すると **HTTP 400** になり、Gemini API の GenerateContent ガイドでは単独で使った場合に警告を出してレベルへ対応付けると説明されています。どちらの面でも `thinking_level` を使ってください(Carbonガイドの移行表と同じ整理)。
- `thinking_level="MINIMAL"` も Gemini 4 では **HTTP 400**。代わりに `LOW` を使います。
- Interactions API では `"low" / "medium" / "high" / "xhigh"` と小文字表記、Vertex 側のサンプルでは大文字(`LOW` など)が使われる箇所があります。SDK・APIごとの表記は公式ドキュメントで確認してください。

```python
from google import genai
from google.genai import types

client = genai.Client()

# 調査対象の代表コード。実運用では対象リポジトリのファイル本文に置き換える。
repository_code = '''
# app/orders.py
def list_orders(db):
    orders = db.execute("SELECT id, customer_id FROM orders").fetchall()
    return [(order, db.execute("SELECT name FROM customers WHERE id = ?",
                              (order[1],)).fetchone()) for order in orders]
'''

# thinking_level を明示する(表記・型はSDKバージョンにより異なるため公式ドキュメントで確認)
resp = client.models.generate_content(
    model="gemini-4-hydrogen",
    contents=f"次のリポジトリ抜粋のN+1クエリを特定し、最小差分で修正案を出して\n\n{repository_code}",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_level="high"),
        max_output_tokens=32768,  # 出力切れ防止のため十分大きく
        # temperature / top_p / top_k は Gemini 4 系では無視されるため指定しない
    ),
)
if not resp.candidates:
    raise RuntimeError("応答に候補がありません")
candidate = resp.candidates[0]
if candidate.finish_reason == types.FinishReason.MAX_TOKENS:
    raise RuntimeError("MAX_TOKENSで中断しました。出力予算・Long Decode・タスク分割を見直して再実行してください")
if candidate.finish_reason != types.FinishReason.STOP:
    # SAFETY・RECITATION などで止まった応答は、部分的な本文があっても採用しない
    raise RuntimeError(f"応答は正常完了していません: {candidate.finish_reason}")
if candidate.content is None or not candidate.content.parts or not any(
    part.text for part in candidate.content.parts
):
    raise RuntimeError("応答に有効なテキストがありません")
print(resp.text)
```

**やってはいけないこと**

- 全リクエストを `xhigh` で固定する(単純タスクで遅く高くなる)
- 評価せずに `low` へ下げてコスト削減する(`low` と `high` の品質差は大きい)

---

## Step 3: Gemini 3.8 Flash からの移行

Googleは Hydrogen を「Gemini 3.8 Flash 以前の Flash 系からの推奨アップグレード」と位置づけています。**モデル名の差し替えだけでは動かない箇所**があるため、手順化します。

```mermaid
flowchart TD
    A["移行開始"] --> B["SDKを最新版へ更新"]
    B --> C["model を gemini-4-hydrogen に変更"]
    C --> D["temperature top_p top_k を削除 frequency_penalty presence_penalty も削除 candidate_count は省略または1へ"]
    D --> E["thinking_budget を thinking_level に置換 MINIMAL は LOW へ"]
    E --> F["max_output_tokens を見直し 低すぎる値を引き上げ"]
    F --> G["非対応機能の使用有無を確認 明示的キャッシュ 画像生成 Live API"]
    G --> H["thought signature を含む履歴を保持しているか確認"]
    H --> PREFILL["prefilled modelターンを検出して削除 履歴末尾のmodelターンも確認"]
    PREFILL --> FORMAT["model応答の接頭辞は使わず system instruction や response_schema で出力形式を指定"]
    FORMAT --> I["評価セットで 3.8 Flash と比較"]
    I --> J{"品質と総コストが基準を満たすか"}
    J -- "はい" --> K["段階的にトラフィックを切替"]
    J -- "いいえ" --> L["thinking_level や指示文を調整して再評価"]
    L --> I
```

**移行チェック表**

| 領域 | Gemini 3.x | Gemini 4(Hydrogen) | 対応 |
|---|---|---|---|
| `thinking_budget` | level に変換される場合あり | Agent Platform では **HTTP 400**。Gemini API の GenerateContent では単独使用時に警告とレベルへの対応付け | `thinking_level` へ置換 |
| `thinking_level="MINIMAL"` | サポート | **HTTP 400** | `LOW` を使用 |
| `temperature` / `top_p` / `top_k` | 一部無視 | 無視(削除が公式要件) | リクエストから削除。再現性は別手段で担保 |
| `frequency_penalty` / `presence_penalty` | モデルによる | **非対応** | リクエストから削除 |
| `candidate_count > 1` | 複数候補を指定できるモデルあり | **非対応** | パラメータを削除するか `1` に調整 |
| prefilled `model` ターン | 応答の接頭辞を与える構成あり | **非対応**。履歴をmodelターンで終えない | 事前挿入したmodelターンを削除し、出力形式はsystem instructionや `response_schema` で指定。過去の実応答とthought signatureは保持 |
| 課金 | 一部トークンのみ課金 | 思考トークン、およびグラウンディング使用時の内部ツール指示・関数宣言を含め**処理した全トークンが課金対象** | コスト試算を作り直す |
| 明示的キャッシュ | 利用可 | **非対応**(第三者記事が公式を引用) | プロンプト構造を暗黙キャッシュ向けに(Step 8) |
| 出力上限 | 65,536 | 既定 65,536、Long Decode で拡張 | Step 4 参照 |

> 出典: Google Cloud「Get started with Gemini 4」および「Thinking」ドキュメント。Argon向けの移行リファレンス(gemini-skills リポジトリ)には、Python `google-genai` ≥ 2.30.1 / JS `@google/genai` ≥ 2.29.1 という要件が記載されています。Hydrogen向けの要件はWhat's newページで確認してください。

非対応パラメータとprefillの除去は[公式移行ガイド](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/migrate)も参照してください。履歴末尾がmodelの実応答なら、署名ごとその応答を保持し、次のuser入力または対応するツール結果を追加してから送信します。応答の接頭辞として挿入したmodelターンとは区別します。

**移行のコツ**

1. **まず同一プロンプトで比較**: 指示文を変えずに 3.8 Flash と並べ、差分が「モデル差」なのか「指示の曖昧さ」なのか切り分ける
2. **再試行率と総トークンを見る**: 単価ではなく「1タスク完了あたりのコスト」で比較する。Google は 2〜2.8倍高速・トークン使用 12〜23% 減という**パートナー初期検証値**を公表しています(ワークロード依存なので自社計測が必須)
3. **旧パラメータの残骸を grep**: `thinking_budget`、`temperature`、`MINIMAL`、`frequency_penalty`、`presence_penalty`、`candidate_count > 1` の残存はHTTP 400・警告・無視の原因になる

---

## Step 4: 出力トークンと Long Decode

Hydrogen は入力・思考・出力が**1つの 1,048,576 トークン窓を共有**します。思考(`xhigh` など)を深くするほど、同じ窓の中で出力に使える量が減る点に注意が必要です。

- 同期リクエストの出力は**既定で 65,536 トークン**
- それを超える出力(複数ファイルのdiff、長大なテストスイート等)は **Long Decode** を使う
- Interactions API は、`max_output_tokens` を 65,536 超に設定し、バックグラウンド実行またはフォアグラウンドのクライアント側継続を選べる。`background=True` は `store=True` が必要で、サーバーがhopを連結する。`background=False` では対応SDKの自動継続、または `automatic_continuation=False` と `continuation_token` を使う自前ループを利用する。自前ループでは各hopの出力を順に蓄積してから最終hopの状態を確認する(最後のinteractionの `output_text` だけを返すと、それ以前の継続分のテキストが欠落する)。`store=False` のステートレス実行も可能で、その場合は前回IDの代わりに元の入力を再送し、モデル・ツール・system instruction・生成設定を各hopで維持する([公式Interactions Long Decode](https://ai.google.dev/gemini-api/docs/long-decode#client-side-continuation))。SDKの自動継続中に接続が切れて `ContinuationInterruptedError` が送出された場合は、リクエストを最初からやり直さない。非ストリーミングでは例外の `partial_interaction`(受信済みの出力とusage)を保持し、`store=True` は例外が持つinteraction IDと `continuation_token` で再開して再開分を後ろへ結合する(`store=False` で例外に `interaction_id` がない場合は、元の入力とモデル・ツール・system instruction・生成設定に `continuation_token` を付けてステートレスに再開する)。一方、ストリーミング中断では `partial_interaction` が `None` になり得るため `partial_interaction` に依存せず、ストリーム受信中に記録した最後の確定チェックポイント(`continuation_token` 取得時点)までの出力だけを保持してそれ以降の未確定出力を破棄したうえで、`store=True` ではその `continuation_token` を発行した対の interaction ID(または例外の `interaction_id`)と `continuation_token` で再開して追記し、`store=False` では `previous_interaction_id` を付けず `continuation_token` と元の入力・モデル・ツール・system instruction・生成設定を再送してステートレスに再開する(最初から再送すると受信済みの出力が重複し、その分も再度課金される。属性名・利用可能なチェックポイント情報は公式SDKで確認する)。
- GenerateContent APIでも、対応する最新版SDKは `max_output_tokens > 65,536` で自動継続する。RESTや自前ループでは `CONTINUATION` と `continuation_token` を扱い、同じリクエストを継続する([公式GenerateContent Long Decode](https://ai.google.dev/gemini-api/docs/generate-content/long-decode))。必要なSDKバージョンは両APIの公式資料で確認する。
- Agent Platform(Google Cloud)経由では、Interactions・GenerateContentのどちらの継続も **`v1beta1` エンドポイント**で行う。`v1` はこの継続動作に非対応のため、SDKクライアントは `http_options` で `api_version='v1'` を指定せず、RESTの呼び出し元も `v1beta1` のパスを使う(Carbonガイドの Agent Platform 記載と同じ要件)。

```mermaid
flowchart TD
    A["思考と回答のトークン数を合算して見積る"] --> B{"思考と回答の合計が65,536 トークン以内で収まるか"}
    B -- "はい" --> C["通常リクエスト max_output_tokens は十分大きく"]
    B -- "いいえ" --> D{"待ち時間は数分許容できるか"}
    D -- "いいえ" --> E["タスクを分割して複数リクエストにする"]
    D -- "はい" --> MODE{"Long Decode の実行方式を選ぶ max_output_tokens 65,536超"}
    MODE -- "バックグラウンド" --> F["Interactions background=True store=True サーバーが継続"]
    MODE -- "フォアグラウンド またはステートレス" --> FG["Interactions SDKの自動継続 または continuation_token の自前ループ"]
    MODE -- "GenerateContent" --> GC["対応SDKの自動継続 またはRESTの継続ループ"]
    F --> G["ステータスをポーリング in_progress queued の間待機"]
    G --> H["completed を確認して output_text を取得<br/>incomplete は continuation_token があれば途中出力を保持し上限を上げて継続 なければ例外<br/>failed と cancelled は例外"]
    FG --> FGM{"継続方式は何か"}
    FGM -- "SDKの自動継続" --> AUTO["interactions.create が返す統合済みの出力とusageをそのまま使う 最終hopをidで再取得しない getは最後のhopの出力しか返さない"]
    AUTO --> AINT{"自動継続の途中で ContinuationInterruptedError が送出されたか"}
    AINT -- "いいえ" --> AUTOD["返り値の status が completed か確認して採用 失敗や不完全終了は例外"]
    AINT -- "はい" --> AMODE{"呼び出し方式 /<br/>partial_interaction の有無"}
    AMODE -- "非ストリーミング<br/>partial_interaction あり" --> ARES["例外の partial_interaction を保持し 最初からやり直さない<br/>store=True は例外の interaction ID と continuation_token で再開<br/>store=False で interaction_id がない場合は 元の入力とモデル ツール system instruction 生成設定に continuation_token を付けてステートレスに再開"]
    ARES --> AJOIN["partial_interaction の出力とusageに 再開分を順に結合する"]
    AMODE -- "ストリーミング中断<br/>partial_interaction が None になり得る" --> ASRES["partial_interaction に依存せず 最後の確定チェックポイントまでの出力だけを保持し 以降の未確定出力を破棄<br/>store=True はその continuation_token を発行した対の interaction ID(または例外の interaction_id)と continuation_token で再開<br/>store=False は previous_interaction_id を省略し continuation_token と元の入力・モデル・ツール・system instruction・生成設定を再送してステートレスに再開"]
    ASRES --> ASJOIN["確定チェックポイントまでの出力に 再開分を追記し 重複を防ぐ"]
    AJOIN --> AUTOD
    ASJOIN --> AUTOD
    FGM -- "自前ループ" --> ACC["各hopの出力テキストとusageを順に蓄積 最後のhopのoutput_textだけでは前半の継続分が欠落する"]
    ACC --> FGD["最終hopの status が completed か確認し 蓄積した全hopの出力を結合して採用 失敗や不完全終了は例外"]
    GC --> RESULT["全hopの応答とusageを集計し終了理由を確認"]
```

```python
# Interactions API のバックグラウンド実行を選ぶ場合の例
# 注意: 実機で動作確認し、SDKバージョン・パラメータ名は公式ドキュメントで確認してください
import time
from google import genai

client = genai.Client()

# 移行対象の代表ファイル。旧API v1.complete(prompt) から新API v2.responses.create(input) へ移行する。
repository_code = '''
# app/summarize.py
def summarize(client, text):
    return client.v1.complete(prompt=text).text
# app/translate.py
def translate(client, text):
    return client.v1.complete(prompt="Translate to Japanese: " + text).text
'''

CONTEXT_WINDOW = 1_048_576  # コンテキスト枠(入力と出力の合計)
prompt = f"次のモジュール群をv1.complete(prompt)からv2.responses.create(input)へ移行する差分をすべて出力して\n\n{repository_code}"

# 出力に使える上限は「コンテキスト枠 − 最初の入力トークン数」。枠全体を出力の上限にしない。
input_tokens = client.models.count_tokens(model="gemini-4-hydrogen", contents=prompt).total_tokens
MAX_OUTPUT_CEILING = CONTEXT_WINDOW - input_tokens  # 引き上げの上限。予算に合わせて小さくしてよい
if MAX_OUTPUT_CEILING <= 0:
    raise RuntimeError(f"Context limit exceeded: input uses {input_tokens} of {CONTEXT_WINDOW} tokens")
max_output_tokens = min(262144, MAX_OUTPUT_CEILING)


def model_text(interaction) -> str:
    return "".join(
        content.text
        for step in (interaction.steps or [])
        if step.type == "model_output"
        for content in (step.content or [])
        if content.type == "text" and content.text is not None
    )


interaction = client.interactions.create(
    model="gemini-4-hydrogen",
    input=prompt,
    background=True,   # サーバー側継続を選択。フォアグラウンドのクライアント側継続も可能
    store=True,
    generation_config={"max_output_tokens": max_output_tokens, "thinking_level": "high"},
)
parts: list[str] = []  # incomplete で止まった区間の出力も含め、順に保持する

while True:
    # ポーリング前にIDを保存する。get が失敗・中断しても、同じジョブを再開・取り消しできる。
    interaction_id = interaction.id
    print(f"interaction id: {interaction_id}")  # 実運用ではジョブ管理のDB等へ保存する

    while interaction.status in ("in_progress", "queued"):
        time.sleep(5)
        interaction = client.interactions.get(id=interaction_id)

    if interaction.status == "failed":
        raise RuntimeError(f"Interaction failed: {interaction.id}")
    if interaction.status == "cancelled":
        raise RuntimeError(f"Interaction cancelled: {interaction.id}")
    if interaction.status == "incomplete":
        # 出力上限で止まった場合、継続トークンがあれば最初からやり直さずに同じジョブを続ける。
        token = getattr(interaction, "continuation_token", None)
        if token is None or max_output_tokens >= MAX_OUTPUT_CEILING:
            raise RuntimeError(f"Interaction incomplete and cannot be resumed: {interaction.id}")
        # 途中までの出力は捨てずに保持する。継続したinteractionの steps に前hopの出力も
        # 含まれるかは公式資料で確認し、含まれる場合は重複して結合しないよう調整する。
        parts.append(model_text(interaction))
        max_output_tokens = min(max_output_tokens * 2, MAX_OUTPUT_CEILING)  # hopをまたいだ累積の上限として引き上げる
        # 注意: 継続の create 応答を通信断などで失うと成否が不明になり、前hopのIDから再送すると別の課金分岐が始まり得る。
        # その継続 create の成否が分かるまでは、同じ継続リクエストを再送しないこと。
        interaction = client.interactions.create(
            model="gemini-4-hydrogen",
            previous_interaction_id=interaction_id,  # store=True のため元の入力は再送しない
            continuation_token=token,
            background=True,
            store=True,
            generation_config={"max_output_tokens": max_output_tokens, "thinking_level": "high"},
        )
        continue
    if interaction.status != "completed":
        raise RuntimeError(f"Unexpected interaction status: {interaction.status}")
    parts.append(model_text(interaction))
    break

text = "".join(parts)
print(text)  # 生成された差分を表示する
```

[公式のバックグラウンド実行例](https://ai.google.dev/gemini-api/docs/background-execution)と[Interactions APIの状態定義](https://ai.google.dev/api/interactions-api)に従い、成功した完了状態でのみテキストを採用します。`incomplete`(出力上限での停止など)は失敗扱いで捨てず、途中までの出力を保持したうえで、そのinteractionのIDと `continuation_token` を使い、`max_output_tokens` を引き上げて同じジョブを継続します。引き上げの上限は1Mのコンテキスト枠そのものではなく、枠から最初の入力トークン数を引いた残りです。残りがない場合は生成を始めずにコンテキスト上限のエラーにします。継続トークンがない場合や上限まで引き上げても終わらない場合は、未完了として例外にします(継続の引数名・`max_output_tokens` が累積の上限として扱われるかは[公式Interactions Long Decode](https://ai.google.dev/gemini-api/docs/long-decode#client-side-continuation)で確認してください)。

なお、Paid tier で `background=True` と `store=True` を使って保存した interaction は既定で **55日間** 保持されます。保持期間は設定で変更可能であり、保存済み interaction は使用後に削除してください。`store=False` は interaction の保存を無効にしますが、ゼロデータ保持を保証するものではなく、プロンプトとレスポンスは不正利用の監視のために保持される場合があります。より厳しいデータ保持要件（短期保持など）がある場合は `store=False` によるステートレスなフォアグラウンド継続を選択し、ゼロデータ保持が必須のワークロードでは、Vertex AI を使うだけでは保持ゼロは保証されません。`store=False` を必ず指定したうえで、適用されるログ記録・キャッシュ・グラウンディングの制限（Google 検索によるグラウンディングの制限を含む）を公式ドキュメントで確認してから利用してください。

ポーリング中にプロセスが落ちたり `interactions.get` が失敗したりしても、`create` をやり直すと**別のジョブ**が始まり、課金も二重になります。また、`incomplete` 後の継続 `client.interactions.create` のレスポンスを通信断などで受け取れなかった場合は、その継続hopが作られたかどうかが不明になるため、前hopから継続 `create` を再送すると別の課金ブランチが始まり得ます。その継続リクエストの結果が分かるまでは継続を再送しないでください。継続するたびに、**各hopの `interaction_id`、そのhopで受け取ったテキスト、およびその時点の `max_output_tokens`(出力トークン上限)**を順序付きで永続化しておいてください。最新のinteractionが前のhopの出力を含むとは限らないため、復旧時は保存済みの前hopまでのテキストを `parts` に戻し、保存済みの `max_output_tokens` も復元したうえで、最新の `interaction_id` で `client.interactions.get(id=interaction_id)` から状態確認を再開して、そのhop以降の出力だけを追記します。ポーリング失敗が複数回続いても初期値へ戻さず、永続化しておいた `max_output_tokens` を引き継いでください(継続時に前hopの出力がどう返るかは[公式Interactions Long Decode](https://ai.google.dev/gemini-api/docs/long-decode#client-side-continuation)で確認してください)。不要になったジョブは、同じIDに対してAPIリファレンスのキャンセル操作を使って止めます(メソッド名・対応SDKバージョンは[Interactions APIリファレンス](https://ai.google.dev/api/interactions-api)で確認)。

**Long Decode の運用ルール**

| ルール | 理由 |
|---|---|
| 必要なワークロードだけに使う(Google: チャット・Q&A・要約・抽出は通常 32K 未満で完了) | 数分かかり得る、課金も膨らむ |
| `max_output_tokens` は仕事に必要な量だけに制限する | 出力トークン(思考を含む)の課金だけを抑える。リクエスト総額の上限ではなく、継続hopの追加入力課金やツール料金も発生し得る |
| `max_output_tokens > 65,536` と対応する継続方式を選ぶ | Interactionsのバックグラウンド実行、フォアグラウンド／ステートレスのSDK自動継続・自前ループ、GenerateContentのSDK自動継続・RESTループを使い分ける。SDKの対応バージョンを確認する |
| 集計トークンの扱いに注意(第三者: Long Decode 中は各hopの入力が合算され、見かけ上コンテキストが過大に見える) | 監視・課金ダッシュボードの誤読防止 |
| 固定長を狙った出力指定は効かない(第三者) | 長さ制御は指示文と分割設計で行う |

---

## Step 5: エージェントのツール呼び出し設計

Hydrogen は「エージェントループの実行役」として、次の挙動が公式に強調されています。

- **読み取り・検索系ツール呼び出しを並列にバッチ実行**する(ファイルを1つずつ読まない)
- ツール呼び出しが失敗したり検索結果が空だったりしても、**状況に適応**する
- **外科的な編集**(無関係なファイルを書き換えない)
- 根拠のない断定を避け、**不足コンテキストを指摘**する(捏造が3.8 Flash比で5倍以上減)

### 5-1. エージェントループの基本形

```mermaid
flowchart TD
    A["ゴールと制約を受領"] --> B["読み取り系ツールを並列で実行"]
    B --> C["結果を統合して次の行動を決定"]
    C --> D["書き込み系ツールを1つずつ実行"]
    D --> E{"ツール成功か"}
    E -- "いいえ" --> F["エラー内容を観察して別手段を選択"]
    F --> C
    E -- "はい" --> G["検証コマンドを実行 テスト ビルド lint"]
    G --> H{"期待どおりか"}
    H -- "いいえ" --> C
    H -- "はい" --> I{"計画の再計画条件に該当するか"}
    I -- "はい" --> J["計画役 Carbon Argon に差し戻し"]
    I -- "いいえ" --> K["完了報告 変更点と根拠を提示"]
```

### 5-2. 設計のベストプラクティス

| # | プラクティス | 理由・根拠 |
|---|---|---|
| 1 | **読み取り系ツールは並列実行を許す設計**にする(ツール側の同時実行・レート制限を確認)。並列の関数呼び出しへの結果は、**全件を呼び出しと同じ順序で1つのuserターンにまとめて**返す。GenerateContent API では thought signature は最初の関数呼び出しパートにだけ付いた状態を保持し、他のパートへ複製しない(Interactions API では thought ステップ側に署名が付与され、`store=true` 時はサーバー側で保持される) | Hydrogenが並列バッチを前提に最適化されているため。結果を別ターンへ分割したり、GenerateContent API で署名を複製したりすると、署名の検証に失敗し得る |
| 2 | **書き込み系は直列**にし、各書き込み後に検証コマンドを挟む | 外科的編集の利点を活かし、副作用の連鎖を防ぐ(設計判断) |
| 3 | ツールのエラーメッセージは**モデルが読んで次の行動を選べる情報量**で返す | 失敗への適応が強化されているため |
| 4 | プロンプトに「**不明点は推測せず、足りない情報を列挙する**」を明記する | 捏造低減の効果を最大化する(設計判断) |
| 5 | マルチターン/関数呼び出しでは **thought signature を含む履歴を丸ごと返す** | Gemini 4 の公式要件。思考の要約では代用できない(第三者の移行記事も指摘) |
| 6 | 状態を持つ会話は Interactions API の `store=true` + `previous_interaction_id` を検討 | 署名を含む状態をサーバー側で保持できる(第三者記事が公式を引用) |
| 7 | 「無関係なファイルは変更しない」「変更ファイル一覧を最後に出す」をシステム指示に入れる | 差分レビューを容易にし、過剰変更を検知する(設計判断) |

履歴を圧縮するときは、以前の資料を削って後続のthought signatureだけを保持すると会話prefixが変わり、署名の検証に失敗してHTTP 400になり得ます。圧縮が必要な場合は、**サポートされる新規履歴へのリセット**(要約などを新しいuserターンとして渡し、古い署名を持ち込まない)を使ってください。Agent Platformのドキュメントには不一致の署名を破棄させる `prefix_mismatch_behavior` の記載がありますが、Python `google-genai` の `ThinkingConfig` でこのフィールドを使えるリリースと使い方は本ガイドでは確認できていません。使う場合は、導入済みSDKの型定義(例: `types.ThinkingConfig.model_fields`)とリリースノートで対応を確認してからにしてください。変更していない履歴では引き続き署名をそのまま保持します([公式Hydrogenガイド](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/guides/gemini-4-hydrogen))。

```python
# テキスト専用のマルチターン例: thought signature を含む履歴を丸ごと再送する
# ツール呼び出しは扱わない。関数宣言や自動関数呼び出しを追加しないこと。
from google.genai import types

# 呼び出し元で会話ごとに history=[] を作成し、対応する履歴を渡す。他の会話と共有しない。
def step(client, history, user_msg):
    user_content = {"role": "user", "parts": [{"text": user_msg}]}
    request_history = [*history, user_content]
    resp = client.models.generate_content(
        model="gemini-4-hydrogen",
        contents=request_history,
        config=types.GenerateContentConfig(
            tools=[],
        ),
    )
    if not resp.candidates:
        raise RuntimeError("応答に候補がありません")
    if resp.candidates[0].finish_reason == types.FinishReason.MAX_TOKENS:
        raise RuntimeError("MAX_TOKENSで中断しました。履歴は保存せず、出力予算やタスク分割を見直して再実行してください")
    candidate = resp.candidates[0]
    if candidate.finish_reason != types.FinishReason.STOP:
        raise RuntimeError(f"応答は正常完了していません。履歴は保存しません: {candidate.finish_reason}")
    if candidate.content is None or not candidate.content.parts or not any(
        part.text for part in candidate.content.parts
    ):
        raise RuntimeError("応答に有効なテキストcontentがありません。履歴は保存しません")
    # 重要: 返却された content を加工せずそのまま履歴へ(署名の欠落・要約置換をしない)
    history.extend([user_content, candidate.content])
    return resp
```

---

## Step 6: Carbon / Argon との役割分担(Orchestrator)

Googleは Hydrogen を「Carbon / Argon が設計・難所解決を担い、Hydrogen がコード編集・並列サブエージェント・テスト実行を担う**高効率な実行エンジン**」と位置づけています。

### 6-1. Antigravity の Orchestrator

Antigravity に新設された **Orchestrator** は、1つのセッション内で Carbon と Hydrogen を動的に切り替えます。Google公表値では、Terminal-Bench 4.0 で**Carbon に近いタスク成功率**を保ちながら、平均で**クォータ消費 24%減・完了 19%高速**でした。

並列エージェントが必要な場合は、**Carbon が調整役、Hydrogen がワーカーと検証役**になり、隔離されたワークスペースで同時に実装とテストを進める構成が紹介されています。

```mermaid
flowchart TD
    U["ユーザーの依頼"] --> P["計画役 Carbon または Argon 読み取り専用で調査し仕様を作成"]
    P --> SPEC["実装仕様 対象ファイル 検証コマンド 期待結果 再計画条件"]
    SPEC --> W1["ワーカー Hydrogen 実装A"]
    SPEC --> W2["ワーカー Hydrogen 実装B"]
    W1 --> V["検証役 Hydrogen テスト実行と差分確認"]
    W2 --> V
    V --> R{"再計画条件に該当するか"}
    R -- "はい" --> P
    R -- "いいえ" --> INT["統合"]
    INT --> IV["統合後の検証 Hydrogen テスト実行と差分確認"]
    IV --> IOK{"統合後の検証に合格したか"}
    IOK -- "はい" --> OUT["完了"]
    IOK -- "いいえ" --> IR{"再計画条件に該当するか"}
    IR -- "はい" --> P
    IR -- "いいえ" --> FIX["ワーカー Hydrogen で修正"]
    FIX --> IV
```

### 6-2. 自前で分業を組むときの設計(設計判断)

| 設計項目 | 推奨 |
|---|---|
| 計画役の出力 | 実行役が**質問できない前提**で、対象ファイル・シンボル・変更内容・検証コマンド・期待出力を明記した仕様にする |
| 再計画条件 | 仕様の末尾に「Re-plan if: …(前提が崩れた兆候)」のチェックリストを必ず入れる |
| 実行役の thinking | 既定は `high`、機械的な修正は `medium` 以下、詰まったときだけ `xhigh` |
| 検証 | 実行役と別のコンテキスト(検証役)でテストを回し、自己採点バイアスを避ける |
| 計画役の呼び出し頻度 | 毎ターンではなく、仕様作成時と再計画時のみ(コスト最適化) |

> 参考(第三者の個人開発者による解説): Antigravity の Orchestrator は、計画フェーズで書き込みツールを無効化した読み取り専用ターンを Argon が実行し、`exit_plan_mode` で仕様を書いた時点で実行ターンが Hydrogen に移る二段階プロトコルだと説明されています。また Hydrogen は 3.8 Flash と同じ「高速実行クォータ枠」を共有するとの記述があります。これらは公式発表ではなく**ユーザー観察**なので、Antigravityの公式ブログで確認してください。

---

## Step 7: マルチモーダル・長文書処理

Hydrogen は入力・思考・出力で共有する 1,048,576 トークンのコンテキスト内で、**PDF・スプレッドシート・図表・音声・録画動画**を引用付きレポートや構造化成果物へ統合します。入力と出力それぞれに100万トークンを同時に使うことはできません。例えば入力80万トークンなら、思考を含む出力の残り枠は最大248,576トークンです。

公式が示す指標(Google公表値): Multimodal Knowledge Agent(MKA)53.4%、Agents' Last Exam v1.1 で 71.6%。

```mermaid
flowchart TD
    A["入力資料 PDF 表 グラフ 音声 動画"] --> B["目的と成果物の形式を明示"]
    B --> C["資料ごとにIDを付与して投入"]
    C --> D["high で統合 根拠は資料IDとページで引用させる"]
    D --> E["構造化出力 JSON スキーマで検証"]
    E --> F{"引用と数値が資料と一致するか"}
    F -- "いいえ" --> G["不一致箇所だけ再質問 または xhigh で再実行"]
    G --> E
    F -- "はい" --> H["成果物として確定"]
```

**ベストプラクティス**

1. **資料に識別子を振り、出力に「資料ID+ページ/時刻」の引用を必須化**する(捏造の検出が容易になる。設計判断)
2. 表・グラフ中心の資料は、**抽出してほしい項目と単位を先に列挙**する
3. 動画は「どの区間を見るか」を指定する。Googleは「特定フレームを検査するエージェント的動画理解」を強化したと説明。ただし区間の指定だけではエージェント的処理は有効にならず、動画入力は既定で静的処理になる。Interactions APIでは動画入力の `processing` を `agentic` に設定して初めてこの機能を使える(パラメータの表記は公式ドキュメントで確認)
4. 出力は JSON スキーマで構造化し、**スキーマ検証→不一致だけ再質問**の自己修復ループにする
5. 1Mトークンを使い切る前に、**不要資料を削る**(入力が多いほど課金と待ち時間が増える。出力と窓を共有する点も考慮)。会話prefixを変更する場合はStep 5の新規履歴へのリセットを使い、変更前の署名だけを再利用しない

---

## Step 8: コスト最適化

### 8-1. コストの構造

- 課金は**入力 + 出力(思考トークンを含む)**。Gemini 4 では処理した全トークンが課金対象
- 出力は入力の5倍単価($7.50 vs $1.50)。**思考トークンが出力側に乗る**ため、thinking level がコストに直結する
- Hydrogen は 1M コンテキスト全域でフラット価格(長文だけ高くなる階段料金がない)

**試算例(筆者算出・Standard価格、キャッシュ割引なし・ツール利用なしの仮定)**: 初期入力5万、出力10万(思考含む)を、バックグラウンド実行の2 hopで生成する場合。1 hop目の出力を65,536トークン、2 hop目を34,464トークンとすると、2 hop目の入力は初期入力と既生成分の合計115,536トークンです。課金対象の入力は全hop合計165,536トークン、出力は100,000トークンとなり、コンテキスト使用量は最大150,000トークンで共有上限内に収まります。

| モデル | 計算 | 合計 |
|---|---|---|
| Hydrogen | 0.165536 × 1.5 + 0.1 × 7.5 | **$0.998304** |
| Argon / Carbon(12/1以降の倍額 $4 / $20) | 0.165536 × 4 + 0.1 × 20 | $2.662144 |

[公式のLong Decode課金説明](https://ai.google.dev/gemini-api/docs/generate-content/long-decode#understand-billing)のとおり、継続hopには追加入力課金があります。実際の請求は各hopのusageと適用されるキャッシュ割引で確認し、ツール利用時は別途その料金も加算してください。

### 8-2. 最適化フロー

```mermaid
flowchart TD
    A["コスト削減を検討"] --> B{"リアルタイム応答が必須か"}
    B -- "いいえ" --> C["有料階層は Batch または Flex で入出力とも半額 条件が合う用途は無料階層で段階実行"]
    B -- "はい" --> D{"優先度が高く待てないか"}
    D -- "はい" --> E["Priority を検討 入力 2.70 出力 13.50"]
    D -- "いいえ" --> F["Standard"]
    C --> G["thinking level を最小限に最適化"]
    E --> G
    F --> G
    G --> H["プロンプトの共通部分を先頭に固定 暗黙キャッシュのヒット率を上げる"]
    H --> I["max_output_tokens で暴走を抑止"]
    I --> J["1タスク完了あたりのコストを継続計測"]
```

### 8-3. 具体策

| 施策 | 内容 |
|---|---|
| Batch / Flex(有料階層)と無料階層 | 非同期・夜間処理は有料階層の Batch / Flex で入出力とも半額(第三者記事が公式価格を引用)。リアルタイム応答が不要でデータ利用条件・レート制限を許容できる場合は、Gemini API / AI Studio の無料階層でレート制限内に分けて実行する選択肢もある(提供条件は[公式料金表](https://ai.google.dev/gemini-api/docs/pricing)で確認) |
| thinking level 最適化 | 評価(Step 2)に基づき、タスク種別ごとに `low`〜`high` を振り分ける。`xhigh` は例外運用 |
| 暗黙キャッシュ前提の構造化(設計判断) | 明示的キャッシュが使えないため、**システム指示・ツール定義・参照資料を常にプロンプトの先頭に同じ順序で固定**し、可変部(ユーザー入力)を末尾に置く |
| 出力の上限管理 | `max_output_tokens` は1レスポンスあたりの出力上限であり、エージェントループ全体は制限しない。用途別に設定したうえで、ループには別途「最大反復回数」と「累積トークン(またはコスト)予算」を実装して強制し、どちらかに達したら再リクエストを止める(暴走・無限ループ対策) |
| グラウンディング課金 | Google検索グラウンディングは無料階層では利用できず、対象の有料階層が必要。有料階層では月5,000検索の無料枠をGemini 3以降のモデル間で共有し、超過分は1,000検索あたり$14、日次上限あり。Geminiリクエスト数ではなく検索クエリ数で課金され、1回のGeminiリクエストが複数の課金対象検索を起こし得る(第三者記事が公式を引用。要確認。[公式料金表](https://ai.google.dev/gemini-api/docs/pricing)) |
| データの扱い | 無料階層の内容はGoogleの製品改善に使われる。通常の有料サービスでは原則として製品改善に使われないが、**Paid Contributor Tierの内容は製品・モデルの改善に利用される**。有料サービスでも不正利用監視のためプロンプト・応答が保持され得る。機密データを送信する前に、適用される階層・最新の保持方針・ログとデータ共有の設定を確認する([公式データ共有方針](https://ai.google.dev/gemini-api/docs/logs-policy#contributor-tier)、[有料サービス規約](https://ai.google.dev/gemini-api/terms#data-use-paid)) |
| モデル分業 | 計画だけ上位モデル、実行は Hydrogen(Step 6) |

---

## Step 9: 評価・安全性・プロンプトインジェクション対策

### 9-1. Googleが公表している安全性の指標

| 指標 | 内容(Google公表値) |
|---|---|
| 越権(overreach) | エージェントタスクで最大 81% 減 |
| 過少対応(under-service) | 最大 79% 減 |
| 不整合な行動・タスクの近道 | ツール使用・コーディング評価で 12倍減 |
| 権限境界の迂回 | 不可能・ブロックされたタスクで最大 2倍起きにくい |
| 誠実性 | 社内エージェント誠実性評価で 94% |
| 思考の可読性 | 20万ターン超の監査で、chain-of-thought の可読性 99.9%・欺瞞的な推論の編集ゼロ |
| 間接プロンプトインジェクション | Gray Swan IPI ベンチマークで 2.3倍超の耐性 |
| 誤拒否 | HealthBench Pro での誤拒否 0.4% 未満 |

> これらは**Google社内・自社評価を含む公表値**です。自社環境の攻撃シナリオで必ず再検証してください。耐性が向上しても、ゼロにはなりません。

### 9-2. 運用レベルの多層防御(設計判断)

```mermaid
flowchart TD
    A["外部入力 Web ファイル メール ツール出力"] --> B["信頼境界を分離 データとして扱い 命令として扱わない"]
    B --> C["最小権限のツールのみ付与"]
    C --> D["書き込みや送信など不可逆操作は人間承認"]
    D --> E["実行ログと変更差分を保存"]
    E --> F["定期的に攻撃シナリオで回帰テスト"]
```

**チェックポイント**

1. 外部コンテンツ(Web検索結果、メール、取得文書)に含まれる指示は**命令として扱わない**とシステム指示に明記する
2. ツール権限は**最小化**し、削除・送信・課金などは必ず人間承認を挟む
3. 「権限境界を越えるとき」のモデルの挙動(停止して報告するか)をテストケース化する
4. 評価セットに**インジェクションを含む入力**を入れ、リリースごとに回帰テストする
5. 思考の要約(thought summary)を有効化して監査ログに残すと、失敗解析がしやすい(Gemini API の thinking ガイドに thought summaries の記載あり)

---

## Step 10: 提供面別の使いどころ

| 提供面 | 使いどころ・ポイント |
|---|---|
| **Gemini API / Google AI Studio** | 全ティアで利用可。まず AI Studio の Run settings で thinking level を切り替えて挙動を確認 |
| **Android Studio** | Androidアプリ開発での日常的なコード生成・デバッグ(Gemini API経由) |
| **Antigravity** | HydrogenはFree、Google AI Plus、Pro、Ultraで利用可能。Orchestratorは別機能で、Carbon版はUltra、Argon版はUltraと対象のPro(有料プランまたは対象端末の試用)に限定される。Hydrogenへのアクセス権と区別する([公式モデル一覧](https://antigravity.google/docs/models)、[プラン](https://antigravity.google/docs/plans))。Gemini front end design skill(google-gemini/demolab)と併用したUI生成の事例が公式に紹介されている |
| **Gemini for business** | API・モデルドロップダウン・Antigravity・Sheets 内の Gemini から利用 |
| **Gemini in Sheets** | 財務データを対話的なモデルへ変換。Googleは「Sheets canvas で出力生成が従来比30%超高速」と説明 |
| **Gemini アプリ / Google Search** | 一般ユーザー向け。無料ユーザーは自動モデル選択で提供。Searchでは複数部分の質問の意図理解、クエリfan-outの強化、表や画像を含む視覚的回答が改善 |
| **Gemini Managed Agents** | Antigravity エージェントの既定モデルが Hydrogen になった(第三者記事が公式を引用) |

**デモの活用**: 公式は Geminisland(3Dボクセルをリアルタイム生成する共有島)や、AI Studio 上の「3D Medic Managed Agent」アプリ(3Dファイルの検査・エラー検出・修正)をデモとして公開しています。自分のプロトタイプの「動作の目安」として確認すると、thinking level の効きが掴めます。

---

## アンチパターン集

| # | アンチパターン | 問題 | 対策 |
|---|---|---|---|
| 1 | 全リクエストを `xhigh` に固定 | 単純タスクで遅く高い。逓減も大きい | 評価に基づき level を振り分け(Step 2) |
| 2 | `thinking_budget` / `MINIMAL` を残す | `MINIMAL` は HTTP 400。`thinking_budget` は Agent Platform で HTTP 400、Gemini API の GenerateContent では警告とレベルへの対応付け | `thinking_level`(`LOW`〜`XHIGH`)に置換 |
| 3 | `temperature` で再現性を担保しようとする | 無視される | 出力スキーマ・評価・リトライは同一結果や再現性を保証するものではないが、一貫性を高める品質管理として組み合わせる |
| 4 | `max_output_tokens` を小さく据え置く | 思考で枠を使い切り、回答が途中で切れる | 十分大きく設定して評価 |
| 5 | thought signature を捨てる/要約に置換 | マルチターン・関数呼び出しが壊れる | content をそのまま履歴に戻す |
| 6 | 明示的キャッシュ前提の設計 | Hydrogenでは非対応 | 暗黙キャッシュ向けのプロンプト構造 |
| 7 | 画像生成・Live API を期待する | 非対応 | 別モデルと組み合わせる |
| 8 | 計画・設計判断まで Hydrogen に丸投げ | 深い判断では Carbon/Argon が適する | 計画役を分離(Step 6) |
| 9 | 単価だけで 3.8 Flash と比較 | 再試行・トークン量を見落とす | 1タスク完了あたりの総コストで比較 |
| 10 | 外部入力の指示に従わせる | インジェクションの温床 | 信頼境界の分離、最小権限(Step 9) |
| 11 | Long Decode を常用 | 遅く高い | 必要なワークロードに限定 |
| 12 | 発表直後の第三者記事の数値を鵜呑み | 誤り・更新の可能性 | 公式ドキュメントで再確認 |

---

## 導入チェックリスト

**移行・実装**

- [ ] SDK を最新化した
- [ ] `model="gemini-4-hydrogen"` に変更した
- [ ] `temperature` / `top_p` / `top_k` を削除した
- [ ] `frequency_penalty` / `presence_penalty` を削除し、`candidate_count > 1` を削除または `1` に調整した
- [ ] prefilled modelターンを削除し、送信履歴がmodelターンで終わっていないことを確認した。出力形式は指示や `response_schema` で指定した
- [ ] `thinking_budget` / `MINIMAL` を `thinking_level` に置換した
- [ ] `max_output_tokens` を十分大きく設定した
- [ ] 思考と回答の合計が65,536を超える箇所に Long Decodeの継続方式(バックグラウンド／フォアグラウンド／ステートレス／GenerateContent)を設計した
- [ ] thought signature を含む履歴を保持している
- [ ] 非対応機能(明示的キャッシュ・画像生成・Live API・音声生成)を使っていない

**評価・運用**

- [ ] 4つの thinking level で評価し、最低限の level を選んだ
- [ ] 1タスクあたりの総コスト(再試行込み)を 3.8 Flash と比較した
- [ ] 12/1 の Carbon/Argon 価格改定を踏まえたモデル構成を検討した
- [ ] プロンプトの共通部分を先頭に固定した(暗黙キャッシュ)
- [ ] インジェクションを含む回帰テストを用意した
- [ ] 不可逆操作に人間承認を挟んだ
- [ ] 価格・仕様を公式ドキュメントで再確認した

---

## 補足: その他のベストプラクティスと根拠ソース

### A. 著名な開発者・Google関係者の発信

| 発信者 | 内容(要旨) | URL |
|---|---|---|
| **Koray Kavukcuoglu**(SVP, Google DeepMind / Chief AI Architect) | Hydrogen を「日常のエージェント実行エンジン」と位置づけ、Carbon/Argonとの併用、4段階 thinking、Orchestrator、安全性指標を公式発表 | https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-hydrogen/ |
| **Logan Kilpatrick**(Google DeepMind、Gemini API / AI Studio 担当) | 「3.8 Flash より2.5倍速く、はるかに賢く、捏造は5分の1」と発信。日常的に利用していると言及 | https://x.com/OfficialLoganK/status/2120941998014390392 |
| **Logan Kilpatrick**(同) | 発表ポスト。全ティアの AI Studio・API・Search・Antigravity 等で提供 | https://x.com/OfficialLoganK/status/2120940951292268640 |
| **Simon Willison**(Django共同作成者、LLMツール `llm` の作者) | 発表当日に `llm-gemini` 0.37 をリリース。Gemini 4 の**価格体系が分かりにくい**こと、Hydrogen が Carbon/Argon に対して現状25%引きにとどまり、12/1の倍額改定後に割引が拡大することを指摘。無料枠モデルであり Google Search のAI機能を支えるとも整理 | https://simonwillison.net/2026/Nov/12/llm-gemini/ |
| **Simon Willison**(X) | 自作の「自転車に乗るペリカン」SVG生成テストで、Hydrogen は Carbon/Argon より明らかに出来が劣ると報告(**非公式の一例**であり、コーディング性能の代表ではない点に注意) | https://x.com/simonw/status/2121039423441981444 |
| Google AI(公式X) | Hydrogen は Argon を AA Intelligence Index で上回り、Antigravity で Carbon と併用できる旨 | https://x.com/GoogleAI/status/2120940683233984862 |

### B. 追加のベストプラクティスと根拠

| # | ベストプラクティス | 根拠・補足 | ソースURL |
|---|---|---|---|
| 1 | **評価は4 level × 十分大きい `max_output_tokens`** で実施し、品質基準を満たす最低 level を採用 | Googleの level 選択ガイダンス(第三者記事が公式ページを引用) | https://teamorouter.com/blogs/gemini-4-hydrogen-api |
| 2 | `MINIMAL` は Gemini 4 で 400、`thinking_budget` は Agent Platform で 400(Gemini API の GenerateContent では警告)。`thinking_level` へ移行 | Google Cloud 公式ドキュメント | https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/thinking |
| 3 | Hydrogen の既定は HIGH、XHIGH は Hydrogen のみ対応 | Google Cloud 公式ドキュメント | https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/start/get-started-with-gemini-4 |
| 4 | Gemini 4 は `temperature` / `top_p` / `top_k` を無視 | 同上 | https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/start/get-started-with-gemini-4 |
| 5 | thought signature を含む履歴を保持する | Argon向けマイグレーションガイド(Gemini 4 共通の要件) | https://ai.google.dev/gemini-api/docs/generate-content/latest-model |
| 6 | Long Decode は必要なワークロードのみ。バックグラウンドまたはクライアント側継続を選ぶ | Google公式 Long Decode ガイド | https://ai.google.dev/gemini-api/docs/long-decode |
| 7 | 移行時は SDK 更新・パラメータ除去・出力上限見直しをチェックリスト化 | google-gemini 公式 gemini-skills の移行リファレンス | https://github.com/google-gemini/gemini-skills/blob/main/skills/gemini-api-dev/references/migration.md |
| 8 | 移行時の落とし穴(出力上限・`temperature` 無視・Long Decode の課金)を事前に把握 | 開発者コミュニティ(DEV)の Argon 移行記事 | https://dev.to/aihubmix/moving-gemini-3x-code-to-gemini-4-argon-failure-modes-and-fixes-4h1p |
| 9 | Long Decode は継続hopごとに課金・入力集計が膨らむため上限管理が必要 | 同上および DEV の Argon 統合ガイド | https://dev.to/aihubmix/gemini-4-argon-thinkinglevel-and-long-decode-a-developers-guide-35ll |
| 10 | 状態管理は `store=true` + `previous_interaction_id`、思考ブロックは改変しない | DEV の Gemini 4 Argon 本番移行ガイド | https://dev.to/hao_kang_82922526dfe5d934/gemini-4-argon-api-the-production-migration-guide-for-agents-1gkg |
| 11 | Carbon で計画、Hydrogen で並列実行・検証。Orchestrator で自動化 | Google公式(Antigravityブログへのリンク付き) | https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-4-hydrogen/ |
| 12 | Orchestrator の二段階プロトコル(読み取り専用計画→実行)と thinking tier の使い分け(ユーザー観察) | DEV 個人開発者の検証記事(**非公式**) | https://dev.to/evgenii_zinner/gemini-4-hydrogen-xhigh-thinking-and-native-orchestrator-mode-in-google-antigravity-2699 |
| 13 | AI Studio で High を選んで試験し、制限到達時はリセット/再試行情報に従う | 開発者のハンズオン(**非公式**) | https://proflead.dev/posts/gemini-4-hydrogen-review-tutorial/ |
| 14 | 第三者のベンチマーク(AA Index)で level ごとの知能・コストを確認 | VentureBeat 記事(Artificial Analysis計測を引用) | https://venturebeat.com/technology/google-launches-gemini-4-hydrogen-a-faster-smarter-pricier-flash-successor |
| 15 | Search / Gemini アプリでの挙動(fan-out・視覚的回答)を理解し、ユーザー向け体験を設計 | Google Search 公式ブログ | https://blog.google/products-and-platforms/products/search/gemini-4-hydrogen-search-upgrade/ |
| 16 | 安全性・限界の詳細はモデルカードで確認 | Google DeepMind モデルカード(PDF) | https://storage.googleapis.com/deepmind-media/Model-Cards/Gemini-4-Hydrogen-Model-Card.pdf |

### C. 情報の信頼性についての注意

1. **発表翌日の情報**です。価格・提供面・仕様は短期間で更新されることがあります。
2. 価格・非対応機能・グラウンディング課金の一部は**第三者記事が公式ページを引用した内容**で、筆者は公式のモデルページ(`ai.google.dev/gemini-api/docs/models/gemini-4-hydrogen`)と pricing ページの原文を直接確認できていません。**実装前に原文確認が必須**です。
3. Long Decode と Interactions API のコード例は **Argon向け公式ガイドの記載パターンを Hydrogen に適用した例**です。パラメータ名やSDKバージョンは実機で検証してください。
4. 「蒸留モデルである」「Antigravity のクォータ枠共有」などは**公式発表ではない観察・推測**です。
5. Simon Willison のペリカンテストは**非公式な単発の生成比較**で、コーディングやエージェント性能の代表指標ではありません。同様に、Google公表のベンチマーク値は自社公表で、第三者による再現・検証を待つ段階のものがあります。

---

## 参考URL一覧

**Google公式**

- Introducing Gemini 4 Hydrogen: https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-hydrogen/
- Gemini 4 Hydrogen for developers: https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-4-hydrogen/
- Google Search × Hydrogen: https://blog.google/products-and-platforms/products/search/gemini-4-hydrogen-search-upgrade/
- モデルカード(PDF): https://storage.googleapis.com/deepmind-media/Model-Cards/Gemini-4-Hydrogen-Model-Card.pdf
- Gemini API What's new(Hydrogen): https://ai.google.dev/gemini-api/docs/whats-new-gemini-4-hydrogen
- Gemini API モデルページ(Hydrogen): https://ai.google.dev/gemini-api/docs/models/gemini-4-hydrogen
- Antigravity × Hydrogen(Orchestrator): https://antigravity.google/blog/gemini-4-hydrogen-in-google-antigravity
- Gemini API Thinking ガイド: https://ai.google.dev/gemini-api/docs/thinking
- Long Decode ガイド: https://ai.google.dev/gemini-api/docs/long-decode
- Google Cloud: Developer's guide to Gemini 4 Hydrogen: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/guides/gemini-4-hydrogen
- Google Cloud: Get started with Gemini 4: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/start/get-started-with-gemini-4
- Google Cloud: Thinking: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/thinking
- Gemini API: 最新モデル(Argon)ガイド: https://ai.google.dev/gemini-api/docs/generate-content/latest-model
- AI Studio: Gemini 4 Argon Developer Guide: https://aistudio.google.com/learn/gemini-4-argon-developer-guide
- google-gemini/gemini-skills 移行リファレンス: https://github.com/google-gemini/gemini-skills/blob/main/skills/gemini-api-dev/references/migration.md

**著名な開発者・Google関係者の発信**

- Simon Willison: https://simonwillison.net/2026/Nov/12/llm-gemini/
- Simon Willison(X): https://x.com/simonw/status/2121039423441981444
- Logan Kilpatrick(X): https://x.com/OfficialLoganK/status/2120941998014390392
- Logan Kilpatrick(X・発表): https://x.com/OfficialLoganK/status/2120940951292268640
- Google AI(X): https://x.com/GoogleAI/status/2120940683233984862

**メディア・コミュニティ(第三者)**

- VentureBeat: https://venturebeat.com/technology/google-launches-gemini-4-hydrogen-a-faster-smarter-pricier-flash-successor
- MarkTechPost: https://www.marktechpost.com/2026/11/13/google-gemini-4-hydrogen/
- TestingCatalog: https://www.testingcatalog.com/google-launches-gemini-4-hydrogen-for-pro-and-ultra-users/
- TeamoRouter(API・価格の解説): https://teamorouter.com/blogs/gemini-4-hydrogen-api
- DEV(Antigravity / xhigh / Orchestrator): https://dev.to/evgenii_zinner/gemini-4-hydrogen-xhigh-thinking-and-native-orchestrator-mode-in-google-antigravity-2699
- DEV(Argon移行の落とし穴): https://dev.to/aihubmix/moving-gemini-3x-code-to-gemini-4-argon-failure-modes-and-fixes-4h1p
- DEV(Argon thinking_level と Long Decode): https://dev.to/aihubmix/gemini-4-argon-thinkinglevel-and-long-decode-a-developers-guide-35ll
- DEV(Argon 本番移行ガイド): https://dev.to/hao_kang_82922526dfe5d934/gemini-4-argon-api-the-production-migration-guide-for-agents-1gkg
- Proflead(ハンズオン): https://proflead.dev/posts/gemini-4-hydrogen-review-tutorial/

**ベンチマーク参照先(公式ブログ内リンク)**

- Artificial Analysis: https://artificialanalysis.ai/
- Terminal-Bench 4.0: https://www.tbench.ai/news/terminal-bench-4-0
- Agent Arena: https://arena.ai/leaderboard/agent
