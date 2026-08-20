import type { Metadata } from "next";
import Link from "next/link";
import CodeCopyButton from "@/components/docs/CodeCopyButton";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "Gemini マルチエージェント開発 ベストプラクティス完全ガイド | LLM コスト計算機",
  description:
    "GEMINI.md・AGENTS.md・agent.py・.geminiignore・settings.json・A2A・Agent Engine まで、Gemini エコシステムでのマルチエージェント開発を網羅した完全実践ガイド。",
};

const CODE_TEXT_1 = `# Project: My TypeScript Library

## General Instructions
- 新しいTypeScriptコードを生成する際は、既存のコーディングスタイルに従うこと。
- 新しい関数・クラスには必ずJSDocコメントを付けること。
- 可能な限り関数型プログラミングのパラダイムを優先すること。

## Coding Style
- インデントはスペース2つ。
- インターフェース名には \`I\` プレフィックスを付ける（例: \`IUserService\`）。
- 常に厳密等価演算子（\`===\` と \`!==\`）を使うこと。`;

const CODE_TEXT_2 = `# Main GEMINI.md file
これはメインの内容です。

@./components/instructions.md

さらに内容が続きます。

@../shared/style-guide.md`;

const CODE_TEXT_3 = `{
  "context": {
    "fileName": ["AGENTS.md", "CONTEXT.md", "GEMINI.md"]
  }
}`;

const CODE_TEXT_4 = `# 認証情報・環境変数
.env*
credentials.json
service-account-key.json

# ビルド成果物・キャッシュ
dist/
build/
.cache/
__pycache__/

# 巨大なデータファイル
*.csv
*.parquet
dataset/

# 独自プロンプト・プライベートなメモ
prompts/private-*
internal-notes.md`;

const CODE_TEXT_5 = `{
  "agents": {
    "subagents": {
      "code-reviewer": {
        "description": "コードのセキュリティと品質をレビューする専門エージェント"
      },
      "tester": {
        "description": "単体テストを自動生成するエージェント"
      }
    }
  }
}`;

const CODE_TEXT_6 = `{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "\${GITHUB_TOKEN}"
      }
    }
  }
}`;

const CODE_TEXT_7 = `{
  "agents": {
    "subagents": {
      "disabled": true
    }
  }
}`;

const CODE_TEXT_8 = `---
name: security-auditor
description: コード内のセキュリティ脆弱性を発見することに特化。
kind: local
tools:
  - read_file
  - grep_search
model: gemini-3-flash-preview
temperature: 0.2
max_turns: 10
---
あなたは容赦のないセキュリティ監査官です。コードを分析し、潜在的な脆弱性を洗い出してください。

重点項目:
1. SQLインジェクション
2. XSS（クロスサイトスクリプティング）
3. ハードコードされた認証情報
4. 安全でないファイル操作

脆弱性を発見したら明確に説明し、修正案を提示すること。ただし自分で修正はしないこと。`;

const CODE_TEXT_9 = `[[rules]]
name = "Allow pr-creator to push code"
subagent = "pr-creator"
description = "pr-creatorによる自動ブランチプッシュを許可する。"
action = "allow"
toolName = "run_shell_command"
commandPrefix = "git push"`;

const CODE_TEXT_10 = `{
  "protocolVersion": "0.3.0",
  "name": "Example Agent Name",
  "description": "ドキュメント目的のサンプルエージェントの説明。",
  "version": "1.0.0",
  "url": "https://example.com/a2a",
  "preferredTransport": "HTTP+JSON",
  "capabilities": {
    "streaming": true,
    "extendedAgentCard": false
  },
  "defaultInputModes": ["text/plain"],
  "defaultOutputModes": ["application/json"],
  "skills": [
    {
      "id": "ExampleSkill",
      "name": "Example Skill Assistant",
      "description": "このスキルが行うことの説明。",
      "tags": ["example-tag"],
      "examples": ["ここに例を示してください。"]
    }
  ]
}`;

const CODE_TEXT_11 = `---
kind: remote
name: my-remote-agent
agent_card_url: https://example.com/agent-card
---`;

const CODE_TEXT_12 = `---
- kind: remote
  name: remote-1
  agent_card_url: https://example.com/1
- kind: remote
  name: remote-2
  agent_card_url: https://example.com/2
---`;

const CODE_TEXT_13 = `from google.adk.agents import Agent
from my_tools import fetch_purchase_history, get_policy, send_email, issue_refund, close_ticket

root_agent = Agent(
    name="Refund_Processor",
    tools=[fetch_purchase_history, get_policy, send_email, issue_refund, close_ticket],
    instruction="""
    あなたは返金処理を担当するカスタマーサービスエージェントです。
    以下の5ステップを厳密に守ってください。
    1. fetch_purchase_historyツールで購入履歴を確認する。
    2. get_policyツールで返金ポリシーを確認する。
    3. 対象であればissue_refundツールで返金処理を行う。
    4. send_emailツールで顧客にメールを送る。
    5. close_ticketツールで返金対応を完了とする。
    """
)`;

const CODE_TEXT_14 = `# python-extraction-agent/app/agent.py
from google.adk.agents import Agent, SequentialAgent
from google.adk.agents.remote_a2a_agent import RemoteA2aAgent
from google.adk.models import Gemini

# サブエージェント1: LLM推論でデータを抽出
extractor_agent = Agent(
    name="extractor_agent",
    model=Gemini(model="gemini-3.5-flash"),
    instruction="あなたは法務データ抽出エージェントです。契約書から金額・契約者・日付・保険条項を抽出してください。",
    tools=[read_contract_text, save_extracted_fields, classify_risk_level]
)

# サブエージェント2: Go製のA2Aコンプライアンスサービスをローカルエージェントとしてラップ
compliance_agent = RemoteA2aAgent(
    name="compliance_agent",
    agent_card=GO_AGENT_CARD_URL,
    description="抽出された契約フィールドを企業のコンプライアンスポリシーに照らして検証する。"
)

# サブエージェント3: 最終監査レポートを生成
report_agent = Agent(
    name="report_agent",
    model=Gemini(model="gemini-3.5-flash"),
    instruction="最終的なコンプライアンスレポートとMarkdown要約を生成すること。",
    tools=[generate_summary_report]
)

# コーディネーター: 上記3つを順番に連結する
root_agent = SequentialAgent(
    name="contract_compliance_coordinator",
    description="契約解析・A2Aコンプライアンス検証・最終レポート作成を順に実行する。",
    sub_agents=[extractor_agent, compliance_agent, report_agent],
)`;

const CODE_TEXT_15 = `from enum import Enum

class ComplianceStep(str, Enum):
    INGESTED = "INGESTED"                      # 契約書アップロード、抽出待ち
    EXTRACTED = "EXTRACTED"                     # Geminiによるフィールド抽出完了
    COMPLIANCE_PENDING = "COMPLIANCE_PENDING"   # Goエージェントへ送信、結果待ち
    COMPLIANCE_COMPLETE = "COMPLIANCE_COMPLETE" # Goエージェントの判定を受領
    MANUAL_REVIEW = "MANUAL_REVIEW"             # タイムアウト/エラー、人間のレビューへ
    REVIEW_READY = "REVIEW_READY"               # 違反ありのレポート生成済み
    APPROVED = "APPROVED"                       # 全チェック合格`;

const CODE_TEXT_16 = `from google.adk.agents.remote_a2a_agent import RemoteA2aAgent

# 方法1: Agent CardのURLを直接指定
remote_agent = RemoteA2aAgent(
    name="image_scoring",
    description="画像について興味深い事実を教えてくれるエージェント。",
    agent_card="http://localhost:8001/a2a/image_scoring/.well-known/agent.json",
    timeout=300.0,       # HTTPタイムアウト（秒）
    httpx_client=None,   # カスタムHTTPクライアント（省略可）
)

# 方法2: ローカルファイルパスとしてAgent Cardを指定
remote_agent_from_file = RemoteA2aAgent(
    name="illustration_agent",
    description="イラストを生成するエージェント。",
    agent_card="illustration-agent-card.json",
)

# 方法3: AgentCardオブジェクトを直接構築して渡す（プログラムから動的に生成する場合）`;

const CODE_TEXT_17 = `from google.adk.agents.remote_a2a_agent import RemoteA2aAgent
from google.adk import Agent

data_analyst = RemoteA2aAgent(
    name="DataAnalyst",
    description="データセットを分析する。",
    agent_card="https://agent-b.run.app/.well-known/agent.json"
)

orchestrator = Agent(
    name="Orchestrator",
    model="gemini-2.0-flash",
    instruction="データ分析タスクはDataAnalystに委譲すること。",
    sub_agents=[data_analyst]
)`;

const CODE_TEXT_18 = `# あなたの既存のエージェント定義
root_agent = Agent(
    model='gemini-flash-latest',
    name='hello_world_agent',
    # ...ツールや指示...
)`;

const CODE_TEXT_19 = `from google.adk.a2a.utils.agent_to_a2a import to_a2a

# エージェントをA2A対応にする
a2a_app = to_a2a(root_agent, port=8001)`;

const CODE_TEXT_20 = `# uvicornでA2Aサーバーとして起動
uvicorn agent:a2a_app --host localhost --port 8001`;

const CODE_TEXT_21 = `# following command runs the ADK agent as a2a agent
adk api_server --a2a --port 8001 remote_a2a`;

const CODE_TEXT_22 = `# 1. リモート（公開）側を起動
uvicorn contributing.samples.a2a_root.remote_a2a.hello_world.agent:a2a_app --host localhost --port 8001

# 2. 別ターミナルで、呼び出す側（コンシューマー）のadk webを起動
adk web contributing/samples/`;

const CODE_TEXT_23 = `pip install --upgrade --quiet "google-cloud-aiplatform[agent_engines,adk]>=1.112"`;

const CODE_TEXT_24 = `gcloud auth application-default login`;

const CODE_TEXT_25 = `PROJECT_ID=my-project-id
LOCATION_ID=us-central1

adk deploy agent_engine \\
  --project=$PROJECT_ID \\
  --region=$LOCATION_ID \\
  --display_name="My First Agent" \\
  multi_tool_agent`;

const CODE_TEXT_26 = `https://{LOCATION_ID}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{LOCATION_ID}/reasoningEngines/{RESOURCE_ID}:query`;

const CODE_TEXT_27 = `import vertexai
from vertexai.preview import reasoning_engines

vertexai.init(
    project="your-gcp-project-id",
    location="us-central1",
    staging_bucket="gs://my-agent-staging-bucket",  # ステージング用バケットが必須
)

# ローカルのadk_appオブジェクトをそのままデプロイ
remote_app = vertexai.agent_engines.create(
    reasoning_engines.AdkApp(agent=root_agent, enable_tracing=True),
)`;

const CODE_TEXT_28 = `import os
from google.adk.agents.remote_a2a_agent import RemoteA2aAgent

PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT")
LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION")
REASONING_ENGINE_ID = os.getenv("REASONING_ENGINE_ID")
AGENT_ENGINE_RESOURCE = f"projects/{PROJECT_ID}/locations/{LOCATION}/reasoningEngines/{REASONING_ENGINE_ID}"
a2a_url = f"https://{LOCATION}-aiplatform.googleapis.com/v1beta1/{AGENT_ENGINE_RESOURCE}/a2a"

time_agent = RemoteA2aAgent(
    name="time_agent",
    description="Agent Engine上で動くA2Aエージェント。",
    agent_card=f"{a2a_url}/v1/card",
)`;

const MERMAID_THEME_VARS = {
  fontSize: "16px",
  background: "#101f38",
  primaryColor: "#132747",
  primaryTextColor: "#e7edf7",
  primaryBorderColor: "#7c9eff",
  lineColor: "#7c9eff",
  secondaryColor: "#0d1b30",
  tertiaryColor: "#0a1729",
  textColor: "#e7edf7",
  mainBkg: "#132747",
  nodeBorder: "#7c9eff",
  clusterBkg: "#0d1b30",
  clusterBorder: "#2a4270",
  edgeLabelBackground: "#0d1b30",
  actorBkg: "#132747",
  actorBorder: "#7c9eff",
  actorTextColor: "#e7edf7",
  signalColor: "#9db4e8",
  signalTextColor: "#e7edf7",
  labelBoxBkgColor: "#132747",
  labelBoxBorderColor: "#7c9eff",
  labelTextColor: "#e7edf7",
  loopTextColor: "#e7edf7",
  noteBkgColor: "#1c2f4e",
  noteTextColor: "#e7edf7",
  noteBorderColor: "#7c9eff",
} as const;

const DIAGRAM_1 = `flowchart TB
    subgraph LOCAL["ローカル開発環境"]
        GM["GEMINI.md / AGENTS.md<br/>（プロジェクト文脈）"]
        GI[".geminiignore<br/>（除外ファイル）"]
        ST["settings.json<br/>（CLI挙動設定）"]
        AG["agent.py<br/>（ADKでのエージェント定義）"]
    end

    subgraph CLI["Gemini CLI / Antigravity CLI"]
        CORE["Core: モデル呼び出し・ツール実行・ReActループ"]
        SUB["ローカル サブエージェント<br/>（.gemini/agents/*.md）"]
    end

    subgraph REMOTE["リモート/他言語エージェント"]
        CARD["agent.json（Agent Card）<br/>= .well-known/agent.json"]
        RAGENT["RemoteA2aAgent<br/>（A2Aクライアント）"]
        SERVER["A2Aサーバー<br/>（Python/Go/Java等）"]
    end

    subgraph CLOUD["本番環境"]
        AE["Vertex AI Agent Engine<br/>（Reasoning Engine）"]
    end

    GM --> CORE
    GI --> CORE
    ST --> CORE
    CORE --> SUB
    AG --> RAGENT
    RAGENT -- "Agent Card取得" --> CARD
    RAGENT -- "JSON-RPC通信" --> SERVER
    CARD --- SERVER
    AG -- "adk deploy agent_engine" --> AE
    AE -- "A2Aエンドポイント公開" --> RAGENT`;

const DIAGRAM_2 = `flowchart TB
    A["① グローバル文脈ファイル<br/>~/.gemini/GEMINI.md<br/>（全プロジェクト共通のデフォルト指示）"]
    B["② ワークスペース文脈ファイル<br/>作業ディレクトリとその親ディレクトリを探索<br/>（現在取り組んでいるプロジェクト向け）"]
    C["③ Just-In-Time (JIT) 文脈ファイル<br/>ツールがファイル/ディレクトリにアクセスした瞬間に<br/>そのディレクトリとその祖先を自動スキャン"]
    D["すべて連結してモデルへ送信<br/>（CLIフッターに読み込み済みファイル数を表示）"]
    A --> D
    B --> D
    C --> D`;

const DIAGRAM_3 = `flowchart TB
    ROOT["/AGENTS.md（ルート）<br/>全体アーキテクチャ・共通規約・禁止事項"]
    ROOT --> PY["/agents/python-extractor/AGENTS.md<br/>Python固有: Gemini呼び出し規約・型ヒント方針"]
    ROOT --> GO["/agents/go-compliance/AGENTS.md<br/>Go固有: エラーハンドリング規約・ビルドコマンド"]
    ROOT --> ORCH["/orchestrator/GEMINI.md<br/>オーケストレーター固有: サブエージェント呼び出し順序"]`;

const DIAGRAM_4 = `flowchart LR
    U["ユーザーのプロンプト"] --> MAIN["メインエージェント<br/>（Gemini CLI Core）"]
    MAIN -- "自動委譲 or @エージェント名で明示指定" --> SUB1["ローカルサブエージェント<br/>（独立したコンテキストウィンドウ）"]
    MAIN -- "A2Aプロトコル経由" --> SUB2["リモートサブエージェント<br/>（別プロセス/別言語/別クラウド）"]
    SUB1 -- "結果のみ報告" --> MAIN
    SUB2 -- "結果のみ報告" --> MAIN
    MAIN --> ANS["ユーザーへの応答"]`;

const DIAGRAM_5 = `sequenceDiagram
    participant L as ローカルエージェント<br/>(RemoteA2aAgent)
    participant R as リモートエージェント<br/>(A2Aサーバー)

    L->>R: GET /.well-known/agent.json
    R-->>L: Agent Card（名前・スキル・対応プロトコル・認証方式）
    Note over L,R: カードを解析し、呼び出し可能なスキルを把握
    L->>R: POST JSON-RPC message/send（タスク送信）
    R-->>L: Task状態: working
    R-->>L: Task状態: completed（結果データを含む）
    alt リモートが応答不能な場合
        R--xL: タイムアウト / エラー
        L->>L: フェイルセーフ状態へ遷移（例: MANUAL_REVIEW）
    end`;

const DIAGRAM_6 = `flowchart LR
    IN["契約書入力"] --> EX["extractor_agent<br/>（Python / Gemini）"]
    EX -- "共有state経由でデータ受け渡し" --> CO["compliance_agent<br/>（RemoteA2aAgent → Go製サーバー）"]
    CO -- "正常応答" --> RE["report_agent<br/>（Python / Gemini）"]
    CO -- "タイムアウト/エラー" --> MR["MANUAL_REVIEW<br/>（人間のレビューへ）"]
    RE --> OUT["最終監査レポート出力"]`;

const DIAGRAM_7 = `flowchart LR
    A["ローカルのagent.py<br/>（root_agent定義）"] --> B["adk deploy agent_engine<br/>（CLIコマンド）"]
    B --> C["コンテナビルド"]
    C --> D["Vertex AI Agent Engine<br/>（Reasoning Engine リソース）"]
    D --> E["REST / A2A エンドポイント公開"]
    E --> F["クライアント<br/>（Vertex AI SDK / REST / RemoteA2aAgent）"]`;

const DIAGRAM_8 = `flowchart TD
    START(["開始"]) --> A["Node A（ツール）<br/>購入履歴をDB/API経由で取得"]
    A --> B["Node B（LLMエージェント）<br/>非構造化のメール内容をポリシー例外と照合"]
    B -->|"true"| C["Node C（ツール）<br/>Stripe APIで返金を実行"]
    B -->|"false"| E["Node E（ツール）<br/>CRMのチケットを更新して終了"]
    C --> D["Node D（LLMエージェント）<br/>確認メールの文面をドラフト"]
    D --> E`;

export default function GeminiMultiAgentBestPracticesPage() {
  return (
    <div className={styles.layout} data-testid="layout-root">
      {/* 外部 CSS リンク。CDN 改ざん対策として SRI (cdnjs 公開ハッシュ) と
          crossOrigin を付与する。integrity は crossOrigin が無いと検証されない。 */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css"
        integrity="sha512-Jk4AqjWsdSzSWCSuQTfYRIF84Rq/eV0G2+tu07byYwHcbTGfdmLrHjUSwvzp5HvbiqK4ibmNwdcG49Y5RGYPTg=="
        crossOrigin="anonymous"
      />

      <div className={styles.sidebar} id="gemini-multi-agent-sidebar" data-testid="sidebar-nav">
        <div className={styles.brand}>
          <div className={styles.brandBadge}>G</div>
          <div className={styles.brandText}>
            <strong>Gemini マルチエージェント</strong>ベストプラクティス完全ガイド
          </div>
        </div>
        <ul className={styles.sideNav}>
          <li>
            <a href="#0-はじめに--このガイドを読む前に知っておくべきこと" className={styles.active}>
              0. はじめに
            </a>
          </li>
          <li>
            <a href="#1-エコシステム全体像を1枚の図でつかむ">
              1. エコシステム全体像を1枚の図でつかむ
            </a>
          </li>
          <li>
            <a href="#2-geminimd--プロジェクトの文脈を教える指示書">2. GEMINI.md</a>
          </li>
          <li>
            <a href="#3-geminimd-と-agentsmd--どちらを使うべきか">3. GEMINI.md と AGENTS.md</a>
          </li>
          <li>
            <a href="#4-マルチエージェント向け-geminimd--agentsmd-設計">
              4. マルチエージェント向け GEMINI.md / AGENTS.md 設計
            </a>
          </li>
          <li>
            <a href="#5-geminiignore--見せたくないファイルを隠す">5. .geminiignore</a>
          </li>
          <li>
            <a href="#6-settingsjson--cli-挙動の中枢設定">6. settings.json</a>
          </li>
          <li>
            <a href="#7-サブエージェントsubagentsの設計">7. サブエージェント（Subagents）の設計</a>
          </li>
          <li>
            <a href="#8-リモートサブエージェントと-a2a-プロトコル入門">
              8. リモートサブエージェントと A2A プロトコル入門
            </a>
          </li>
          <li>
            <a href="#9-agentpy--adk-でのエージェント実装パターン">9. agent.py</a>
          </li>
          <li>
            <a href="#10-remotea2aagent-実装パターンの詳細">
              10. RemoteA2aAgent 実装パターンの詳細
            </a>
          </li>
          <li>
            <a href="#11-vertex-ai-agent-engine-へのデプロイ">
              11. Vertex AI Agent Engine へのデプロイ
            </a>
          </li>
          <li>
            <a href="#12-adk-20-agent-と-workflow-の使い分け">12. ADK 2.0</a>
          </li>
          <li>
            <a href="#13-セキュリティガバナンスのベストプラクティス">
              13. セキュリティ・ガバナンスのベストプラクティス
            </a>
          </li>
          <li>
            <a href="#14-総合ステップバイステップ-ゼロからのマルチエージェント構築フロー">
              14. 総合ステップバイステップ
            </a>
          </li>
          <li>
            <a href="#15-参考文献出典">15. 参考文献・出典</a>
          </li>
        </ul>
        <div className={styles.sideFoot}>
          情報基準日: 2026年7月26日
          <br />
          出典は「15. 参考文献・出典」を参照
        </div>
      </div>

      <button
        type="button"
        className={styles.sidebarToggle}
        aria-label="メニューを開く"
        aria-expanded="false"
        aria-controls="gemini-multi-agent-sidebar"
      >
        ☰
      </button>

      <main className={styles.content}>
        <div className={styles.hero}>
          <span className={styles.heroEyebrow}>GEMINI CLI × ADK × A2A × AGENT ENGINE</span>
          <h1>
            Gemini マルチエージェント開発
            <br />
            ベストプラクティス完全ガイド
          </h1>
          <p className={styles.subtitle}>
            GEMINI.md・AGENTS.md・agent.py・.geminiignore・settings.json・A2A・Agent Engine まで
          </p>
          <div className={styles.heroMeta}>
            <div className={styles.metaCard}>
              <div className={styles.label}>対象読者</div>
              <div className={styles.value}>
                Gemini CLI / ADK でマルチエージェントシステムを構築したい初学者〜中級エンジニア
              </div>
            </div>
            <div className={styles.metaCard}>
              <div className={styles.label}>前提知識</div>
              <div className={styles.value}>
                Python の基礎文法、ターミナル操作、JSON/YAML の読み書き
              </div>
            </div>
            <div className={styles.metaCard}>
              <div className={styles.label}>情報基準日</div>
              <div className={styles.value}>
                2026年7月26日時点のウェブ検索結果に基づく（出典は末尾の参考文献を参照）
              </div>
            </div>
          </div>
        </div>

        <h2 id="0-はじめに--このガイドを読む前に知っておくべきこと">
          0. はじめに — このガイドを読む前に知っておくべきこと
        </h2>
        <p>
          このガイドは、Gemini エコシステムでマルチエージェント（複数の AI
          エージェントが協調して動くシステム）を開発するときに触れることになる、5つの設定ファイル・コードファイルと、それらをつなぐ2つのプロトコル/サービスを、初学者でも迷わないようにステップバイステップで解説します。
        </p>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr className="header">
                <th>#</th>
                <th>ファイル/概念</th>
                <th>役割を一言でいうと</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>1</td>
                <td>
                  <code>GEMINI.md</code>
                </td>
                <td>エージェントに「このプロジェクトのルール」を教える指示書</td>
              </tr>
              <tr className="even">
                <td>2</td>
                <td>
                  <code>AGENTS.md</code>
                </td>
                <td>複数のAIツール共通の「エージェント向けREADME」オープン標準</td>
              </tr>
              <tr className="odd">
                <td>3</td>
                <td>
                  <code>.geminiignore</code>
                </td>
                <td>エージェントに「見せたくないファイル」を隠す除外リスト</td>
              </tr>
              <tr className="even">
                <td>4</td>
                <td>
                  <code>settings.json</code>
                </td>
                <td>
                  Gemini CLI
                  自体の挙動（承認モード、サブエージェント、セキュリティ等）を設定する本体設定ファイル
                </td>
              </tr>
              <tr className="odd">
                <td>5</td>
                <td>
                  <code>agent.py</code>
                </td>
                <td>
                  ADK
                  でエージェントのロジック・ツール・サブエージェント構成をPythonコードとして定義するファイル
                </td>
              </tr>
              <tr className="even">
                <td>6</td>
                <td>
                  A2A プロトコル / <code>agent.json</code>（Agent Card）
                </td>
                <td>
                  異なるエージェント同士が「何ができるか」を名刺交換のように開示し合い、通信するための共通規格
                </td>
              </tr>
              <tr className="odd">
                <td>7</td>
                <td>Vertex AI Agent Engine</td>
                <td>
                  作ったエージェントを本番環境（クラウド）にデプロイして自動スケールさせるマネージドサービス
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 id="2026年7月時点の重要な前提必ず先に読んでください">
          2026年7月時点の重要な前提（必ず先に読んでください）
        </h3>
        <p>
          Gemini CLI
          を取り巻く状況は2026年に入って大きく動いています。ガイドの内容を実践する前に、以下の2点を押さえておくと迷いません。
        </p>
        <ol type="1">
          <li>
            <strong>
              Gemini CLI は個人向け無償/Google One 利用枠では Antigravity CLI
              に統合されつつあります。
            </strong>
            Google は2026年5月19日、Gemini CLI と Antigravity CLI
            を「マルチエージェント時代に向けた単一プラットフォーム」に統合する方針を発表し、2026年6月18日をもって
            Google AI Pro/Ultra および無償の Gemini Code Assist 個人利用枠向けの Gemini CLI
            へのリクエスト提供を終了しました。一方で、
            <strong>
              Gemini Code Assist Standard/Enterprise ライセンス、または有償の Gemini / Gemini
              Enterprise Agent Platform API キーを利用する企業ユーザーには、これまで通り Gemini CLI
              へのアクセスが提供され続けます
            </strong>
            。このガイドで解説する <code>GEMINI.md</code> / <code>.geminiignore</code> /{" "}
            <code>settings.json</code> / サブエージェントの仕組みは、企業向けに存続する Gemini
            CLI、および後継の Antigravity CLI の両方で（Agent
            Skills・Hooks・Subagents・拡張機能というかたちで）概ね引き継がれています。
          </li>
          <li>
            <strong>
              ADK（Agent Development Kit）は 2.0
              世代に入り、「決定論的ワークフロー」という新しい柱が加わりました。
            </strong>
            2026年7月1日に公開された Google の技術ブログによれば、ADK 2.0
            では自律的なLLMエージェントに加えて、ビジネスロジックをコードで厳密に制御する{" "}
            <code>Workflow</code>
            （有向グラフ実行エンジン）が導入されています。マルチエージェント設計をする際は「LLMに任せるべき部分」と「コードで固定すべき部分」を切り分ける、という新しい設計判断が必要になります（詳細は第9章）。
          </li>
        </ol>
        <p>これらの背景を踏まえたうえで、以下、各ファイル・概念を順番に見ていきます。</p>

        <hr />

        <h2 id="1-エコシステム全体像を1枚の図でつかむ">1. エコシステム全体像を1枚の図でつかむ</h2>
        <p>個別のファイルに入る前に、これらがどう連携しているかを俯瞰します。</p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_1} theme="base" themeVariables={MERMAID_THEME_VARS} />
        </div>
        <p>
          読み方: <code>GEMINI.md</code> / <code>.geminiignore</code> / <code>settings.json</code>{" "}
          はいずれも
          <strong>Gemini CLI 自体を賢く・安全にするための設定</strong>です。一方{" "}
          <code>agent.py</code> と <code>agent.json</code>（Agent Card）は
          <strong>ADK で作る個々のエージェント（コード側の実体）</strong>
          を定義するもので、A2Aプロトコルを介してエージェント同士、あるいは Gemini CLI
          のサブエージェントとして接続されます。最終的に <code>agent.py</code> は Vertex AI Agent
          Engine にデプロイして本番運用します。
        </p>

        <hr />

        <h2 id="2-geminimd--プロジェクトの文脈を教える指示書">
          2. GEMINI.md — プロジェクトの「文脈」を教える指示書
        </h2>
        <h3 id="21-何をするファイルか">2.1 何をするファイルか</h3>
        <p>
          <code>GEMINI.md</code>
          は、毎回のプロンプトで同じ指示を繰り返す代わりに、プロジェクト固有のルール（コーディング規約、対象読者、テストの実行方法など）を一度だけ書いておくファイルです。Gemini
          CLI はこれを自動的に読み込み、モデルへのすべてのリクエストに文脈として付加します。
        </p>
        <h3 id="22-3段階の階層システム超重要">2.2 3段階の階層システム（超重要）</h3>
        <p>
          <code>GEMINI.md</code>
          は1ファイルだけではなく、以下の3段階で読み込まれ、<strong>すべて連結されて</strong>
          モデルに渡されます。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_2} theme="base" themeVariables={MERMAID_THEME_VARS} />
        </div>
        <ul>
          <li>
            <strong>①グローバル</strong>: <code>~/.gemini/GEMINI.md</code>
            （ホームディレクトリ）。すべてのプロジェクトに適用したいデフォルトの指示（例:「常に日本語で回答する」等）を置きます。
          </li>
          <li>
            <strong>②ワークスペース</strong>:
            作業ディレクトリとその親ディレクトリを探索して見つかった <code>GEMINI.md</code>
            。現在のプロジェクト向けのルールです。
          </li>
          <li>
            <strong>③JIT（Just-In-Time）</strong>:
            モデルがツールで特定のディレクトリのファイルに触れた瞬間に、そのディレクトリとその祖先ディレクトリの{" "}
            <code>GEMINI.md</code>{" "}
            を都度スキャンして読み込みます。これにより、モノレポの特定コンポーネントだけに関係する詳細ルールを、必要になったときだけ読み込ませることができます（＝第4章のマルチエージェント設計で重要）。
          </li>
        </ul>

        <h3 id="23-書き方のベストプラクティスステップバイステップ">
          2.3 書き方のベストプラクティス（ステップバイステップ）
        </h3>
        <ol type="1">
          <li>
            <strong>
              <code>/init</code> コマンドで雛形を作る。
            </strong>{" "}
            プロジェクトルートで Gemini CLI を起動し <code>/init</code>{" "}
            を実行すると、リポジトリを解析して <code>GEMINI.md</code>{" "}
            の初期版を自動生成してくれます。
          </li>
          <li>
            <strong>簡潔に、目的ベースで書く。</strong>
            公式のベストプラクティスは「モデルがコードから推測できない情報だけ書け」「最初は50行以内に抑え、実際にギャップが出たときだけ育てる」という考え方です。冗長なドキュメントの全文コピーは避けます。
          </li>
          <li>
            <strong>見出し構造で整理する。</strong> <code># プロジェクト概要</code> →{" "}
            <code>## 全般的な指示</code> → <code>## コーディングスタイル</code>{" "}
            のように、見出しでセクションを区切ります。
          </li>
          <li>
            <strong>500行を超えたら分割する。</strong> 巨大化してきたら <code>@ファイルパス</code>{" "}
            のインポート構文でモジュール化します。
          </li>
        </ol>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>markdown</span>
            <CodeCopyButton text={CODE_TEXT_1} />
          </div>
          <pre className="markdown">
            <code className="markdown">
              <div className={styles.codeLine}>
                <span className={styles.ct}># Project: My TypeScript Library</span>
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.ct}>## General Instructions</span>
              </div>
              <div className={styles.codeLine}>
                - 新しいTypeScriptコードを生成する際は、既存のコーディングスタイルに従うこと。
              </div>
              <div className={styles.codeLine}>
                - 新しい関数・クラスには必ずJSDocコメントを付けること。
              </div>
              <div className={styles.codeLine}>
                - 可能な限り関数型プログラミングのパラダイムを優先すること。
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.ct}>## Coding Style</span>
              </div>
              <div className={styles.codeLine}>- インデントはスペース2つ。</div>
              <div className={styles.codeLine}>
                - インターフェース名には <span className={styles.cs}>`I`</span>{" "}
                プレフィックスを付ける（例: <span className={styles.cs}>`IUserService`</span>）。
              </div>
              <div className={styles.codeLine}>
                - 常に厳密等価演算子（<span className={styles.cs}>`===`</span> と{" "}
                <span className={styles.cs}>`!==`</span>）を使うこと。
              </div>
            </code>
          </pre>
        </div>
        <ol start={5} type="1">
          <li>
            <strong>
              <code>@file.md</code> 構文でインポートして分割する。
            </strong>
          </li>
        </ol>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>markdown</span>
            <CodeCopyButton text={CODE_TEXT_2} />
          </div>
          <pre className="markdown">
            <code className="markdown">
              <div className={styles.codeLine}>
                <span className={styles.ct}># Main GEMINI.md file</span>
              </div>
              <div className={styles.codeLine}>これはメインの内容です。</div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>@./components/instructions.md</span>
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>さらに内容が続きます。</div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>@../shared/style-guide.md</span>
              </div>
            </code>
          </pre>
        </div>
        <ol start={6} type="1">
          <li>
            <strong>
              <code>/memory</code> コマンドで検証する。
            </strong>
            <ul>
              <li>
                <code>/memory show</code> —
                現在読み込まれている連結後の文脈全文を表示（実際にモデルに渡っている内容を確認できる）
              </li>
              <li>
                <code>/memory reload</code> — すべての <code>GEMINI.md</code>{" "}
                を再スキャンして再読み込み
              </li>
            </ul>
          </li>
        </ol>

        <h3 id="24-実践チェックリスト">2.4 実践チェックリスト</h3>
        <ul className={styles.taskList}>
          <li>
            <label>
              <input type="checkbox" readOnly />
              <code>/init</code> で下地を作ったか
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" readOnly />
              「コードから読み取れないこと」だけを書いているか（重複情報を削ったか）
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" readOnly />
              セクション見出しで整理されているか
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" readOnly />
              500行以内、または <code>@import</code> で分割されているか
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" readOnly />
              <code>/memory show</code> で意図通りの内容が読み込まれているか確認したか
            </label>
          </li>
        </ul>

        <hr />

        <h2 id="3-geminimd-と-agentsmd--どちらを使うべきか">
          3. GEMINI.md と AGENTS.md — どちらを使うべきか
        </h2>
        <h3 id="31-agentsmd-とは何か">3.1 AGENTS.md とは何か</h3>
        <p>
          <code>AGENTS.md</code>
          は特定ベンダーに縛られない、<strong>業界横断のオープンフォーマット</strong>です。OpenAI
          Codex・Amp・Google Jules・Cursor・Factory など複数の企業が協力して策定し、現在では
          Codex・Cursor・GitHub Copilot・Gemini CLI・Aider・Windsurf・Zed
          など20を超えるツールがネイティブに読み込みます。「エージェント向けのREADME」と考えると分かりやすく、必須フィールドも決まったスキーマもない、プレーンな
          Markdown です。
        </p>
        <h3 id="32-なぜ2つ存在するのかどう使い分けるか">
          3.2 なぜ2つ存在するのか、どう使い分けるか
        </h3>
        <p>
          <code>GEMINI.md</code> は Gemini CLI
          専用の名称・階層読み込みロジック（グローバル/ワークスペース/JIT、<code>@import</code>
          構文）を持つ
          <strong>Gemini CLI 固有の仕組み</strong>です。一方 <code>AGENTS.md</code> は
          <strong>どのツールでも読める共通ファイル</strong>という位置づけです。
        </p>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr className="header">
                <th>観点</th>
                <th>GEMINI.md</th>
                <th>AGENTS.md</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>標準化団体</td>
                <td>Google（Gemini CLI固有）</td>
                <td>複数ベンダー共同策定のオープン標準</td>
              </tr>
              <tr className="even">
                <td>対応ツール</td>
                <td>Gemini CLI / Antigravity CLI</td>
                <td>Codex, Cursor, Copilot, Gemini CLI, Aider, Windsurf, Zed 等20以上</td>
              </tr>
              <tr className="odd">
                <td>階層読み込み</td>
                <td>グローバル→ワークスペース→JIT の3段階</td>
                <td>最も近いディレクトリのファイルが優先（モノレポの各パッケージに配置可）</td>
              </tr>
              <tr className="even">
                <td>インポート構文</td>
                <td>
                  <code>@file.md</code> をサポート
                </td>
                <td>仕様上の特別な構文なし（プレーンMarkdown）</td>
              </tr>
              <tr className="odd">
                <td>チーム内での使い方</td>
                <td>Gemini CLI 中心のチームに最適</td>
                <td>複数のAIツールを併用するチーム・OSSリポジトリに最適</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 id="33-実は共存できる--settingsjson-での統合設定">
          3.3 実は共存できる — settings.json での統合設定
        </h3>
        <p>
          Gemini CLI は <code>settings.json</code> の <code>context.fileName</code>{" "}
          プロパティで、読み込むファイル名を変更・追加できます。これを使うと、<code>AGENTS.md</code>{" "}
          を正としつつ Gemini CLI にも読ませる、という一石二鳥の運用が可能です。
        </p>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>json</span>
            <CodeCopyButton text={CODE_TEXT_3} />
          </div>
          <pre className="json">
            <code className="json">
              <div className={styles.codeLine}>{"{"}</div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>&quot;context&quot;</span>: {"{"}
              </div>
              <div className={styles.codeLine}>
                {"    "}
                <span className={styles.cv}>&quot;fileName&quot;</span>: [
                <span className={styles.cs}>&quot;AGENTS.md&quot;</span>,{" "}
                <span className={styles.cs}>&quot;CONTEXT.md&quot;</span>,{" "}
                <span className={styles.cs}>&quot;GEMINI.md&quot;</span>]
              </div>
              <div className={styles.codeLine}>
                {"  "}
                {"}"}
              </div>
              <div className={styles.codeLine}>{"}"}</div>
            </code>
          </pre>
        </div>
        <p>
          この配列に指定した名前のファイルが、指定した優先順で（複数存在すれば全て連結して）読み込まれます。
          <strong>
            複数のAIコーディングツールを併用するチームでは、<code>AGENTS.md</code>
            を単一の情報源にして
            <code>GEMINI.md</code>
            は作らない、という運用が2026年時点でのベストプラクティスとして定着しつつあります。
          </strong>
        </p>

        <h3 id="34-ステップバイステップ-移行手順">3.4 ステップバイステップ: 移行手順</h3>
        <ol type="1">
          <li>
            リポジトリ直下に <code>AGENTS.md</code>{" "}
            を作成し、ビルドコマンド・テストコマンド・コーディング規約・触れてはいけないファイルなどを記述する。
          </li>
          <li>
            <code>.gemini/settings.json</code>（ワークスペース設定）に <code>context.fileName</code>{" "}
            を追加し、<code>AGENTS.md</code> を最優先で読み込ませる。
          </li>
          <li>
            モノレポの場合、各パッケージのルートにもその場限りの <code>AGENTS.md</code>{" "}
            を追加する（最も近いファイルが優先されるため、サブプロジェクトごとの独自ルールを上書き指定できる）。
          </li>
          <li>
            既存の <code>GEMINI.md</code> の内容を <code>AGENTS.md</code> に統合し、重複を避ける。
          </li>
        </ol>

        <hr />

        <h2 id="4-マルチエージェント向け-geminimd--agentsmd-設計">
          4. マルチエージェント向け GEMINI.md / AGENTS.md 設計
        </h2>
        <p>
          単一エージェントのプロジェクトと違い、複数のエージェントが協調するプロジェクトでは、文脈ファイルの設計そのものが「誰にどの情報を、いつ見せるか」という設計問題になります。
        </p>
        <h3 id="41-モノレポ型階層設計">4.1 モノレポ型階層設計</h3>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_3} theme="base" themeVariables={MERMAID_THEME_VARS} />
        </div>
        <p>
          第2章で解説した JIT（Just-In-Time）読み込みの仕組みにより、モデルが{" "}
          <code>agents/go-compliance/</code> 配下のファイルを開いた瞬間だけ、その場所の{" "}
          <code>AGENTS.md</code> が自動的に追加読み込みされます。これにより、ルートの{" "}
          <code>AGENTS.md</code>{" "}
          を薄く保ちながら、各サブエージェントの専門知識を必要な時にだけ注入できます。
        </p>

        <h3 id="42-マルチエージェント特有の記述内容">4.2 マルチエージェント特有の記述内容</h3>
        <p>
          単一エージェントの <code>GEMINI.md</code>／<code>AGENTS.md</code>{" "}
          には書かない、マルチエージェント特有の情報を追加します。
        </p>
        <ul>
          <li>
            <strong>エージェント間の責務分担の一覧</strong>（例: 「抽出は{" "}
            <code>extractor_agent</code>、コンプライアンス検証は Go 製のリモートエージェント{" "}
            <code>compliance_agent</code>、レポート生成は <code>report_agent</code> が担当」）
          </li>
          <li>
            <strong>共有状態（shared state）のキー名とスキーマ</strong>（後述する{" "}
            <code>ToolContext.state</code> 経由で受け渡すデータの形）
          </li>
          <li>
            <strong>フェイルセーフの挙動</strong>
            （あるサブエージェントが応答不能な場合、どのステートに遷移すべきか。例:「Goのコンプライアンスエージェントが3回リトライしても応答しない場合は{" "}
            <code>MANUAL_REVIEW</code> 状態へ遷移し、人間のレビューに回す」）
          </li>
          <li>
            <strong>サブエージェントの呼び出し粒度に関する指示</strong>
            （「どのタスクをメインエージェントが直接処理し、どこからサブエージェントに委譲すべきか」の判断基準）
          </li>
        </ul>

        <h3 id="43-サブエージェント定義ファイルとの役割分担">
          4.3 サブエージェント定義ファイルとの役割分担
        </h3>
        <p>
          ローカルサブエージェントは <code>.gemini/agents/*.md</code> という{" "}
          <strong>別ファイル</strong>
          （YAMLフロントマター付きMarkdown）で定義します（詳細は第6章）。<code>GEMINI.md</code>／
          <code>AGENTS.md</code>{" "}
          は「プロジェクト全体のルール」、サブエージェント定義ファイルは「個々のサブエージェントの人格・権限」という住み分けです。この2つを混同せず、
          <code>GEMINI.md</code>{" "}
          にサブエージェントの詳細なシステムプロンプトを書き込まないようにするのがコツです。
        </p>

        <hr />

        <h2 id="5-geminiignore--見せたくないファイルを隠す">
          5. .geminiignore — 見せたくないファイルを隠す
        </h2>
        <h3 id="51-仕組み">5.1 仕組み</h3>
        <p>
          <code>.geminiignore</code> は Git の <code>.gitignore</code> や Gemini Code Assist の{" "}
          <code>.aiexclude</code> と同じ考え方の除外リストです。ここに書いたパスは、<code>@</code>{" "}
          コマンドでファイルを共有するときなど、この機能に対応したツールから除外されます（ただし Git
          など他のサービスには引き続き見える点に注意）。
        </p>

        <h3 id="52-構文ルール">5.2 構文ルール</h3>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr className="header">
                <th>ルール</th>
                <th>説明</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>
                  空行・<code>#</code>で始まる行
                </td>
                <td>無視される（コメント扱い）</td>
              </tr>
              <tr className="even">
                <td>標準的なglobパターン</td>
                <td>
                  <code>*</code>, <code>?</code>, <code>[]</code> が使用可能
                </td>
              </tr>
              <tr className="odd">
                <td>
                  末尾の <code>/</code>
                </td>
                <td>ディレクトリのみにマッチ</td>
              </tr>
              <tr className="even">
                <td>
                  先頭の <code>/</code>
                </td>
                <td>
                  <code>.geminiignore</code> があるディレクトリからの相対パスとして固定
                </td>
              </tr>
              <tr className="odd">
                <td>
                  <code>!</code>
                </td>
                <td>パターンを否定（除外対象から除外＝再度含める）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 id="53-実践例">5.3 実践例</h3>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>gitignore</span>
            <CodeCopyButton text={CODE_TEXT_4} />
          </div>
          <pre className="gitignore">
            <code className="gitignore">
              <div className={styles.codeLine}>
                <span className={styles.cc}>
                  # /packages/ ディレクトリとそのサブディレクトリすべてを除外
                </span>
              </div>
              <div className={styles.codeLine}>/packages/</div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cc}># apikeys.txt ファイルを除外</span>
              </div>
              <div className={styles.codeLine}>apikeys.txt</div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cc}># すべての .md ファイルを除外（ワイルドカード）</span>
              </div>
              <div className={styles.codeLine}>*.md</div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cc}>
                  # ただし README.md だけは除外対象から除外して見せる
                </span>
              </div>
              <div className={styles.codeLine}>*.md</div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>!README.md</span>
              </div>
            </code>
          </pre>
        </div>
        <p>
          <strong>変更を反映するには Gemini CLI セッションの再起動が必要</strong>
          です。マルチエージェント開発では、各サブエージェント/リモートエージェントのシークレット（
          <code>.env</code>、認証キー、
          <code>agent_card_json</code>{" "}
          に埋め込みがちな認証情報）を確実に除外リストへ入れることが、次章のセキュリティ設定と合わせて重要になります。
        </p>

        <hr />

        <h2 id="6-settingsjson--cli-挙動の中枢設定">6. settings.json — CLI 挙動の中枢設定</h2>
        <h3 id="61-設定ファイルの場所と優先順位">6.1 設定ファイルの場所と優先順位</h3>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr className="header">
                <th>スコープ</th>
                <th>パス</th>
                <th>優先順位</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>ユーザー設定</td>
                <td>
                  <code>~/.gemini/settings.json</code>
                </td>
                <td>低い（ワークスペース設定に上書きされる）</td>
              </tr>
              <tr className="even">
                <td>ワークスペース設定</td>
                <td>
                  <code>your-project/.gemini/settings.json</code>
                </td>
                <td>高い（ユーザー設定を上書き）</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <code>/settings</code>{" "}
          コマンドでダイアログからGUI的に編集することも、ファイルを直接編集することも可能です。
        </p>

        <h3 id="62-マルチエージェント開発で特に重要なカテゴリ">
          6.2 マルチエージェント開発で特に重要なカテゴリ
        </h3>
        <p>
          全設定は10カテゴリ以上ありますが、マルチエージェント開発の文脈で押さえるべきものを抜粋します。
        </p>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr className="header">
                <th>カテゴリ</th>
                <th>主な設定キー</th>
                <th>用途</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>Context</td>
                <td>
                  <code>context.fileName</code>
                </td>
                <td>
                  読み込む文脈ファイル名（<code>AGENTS.md</code>併用など）
                </td>
              </tr>
              <tr className="even">
                <td>Context</td>
                <td>
                  <code>context.fileFiltering.respectGeminiIgnore</code>
                </td>
                <td>
                  <code>.geminiignore</code>を尊重するか（既定 <code>true</code>）
                </td>
              </tr>
              <tr className="odd">
                <td>Agents</td>
                <td>
                  <code>agents.overrides.&lt;name&gt;</code>
                </td>
                <td>特定サブエージェントの有効/無効・モデル・実行上限の上書き</td>
              </tr>
              <tr className="even">
                <td>General</td>
                <td>
                  <code>general.defaultApprovalMode</code>
                </td>
                <td>
                  ツール実行の承認モード（<code>default</code>/<code>auto_edit</code>/
                  <code>plan</code>）
                </td>
              </tr>
              <tr className="odd">
                <td>Security</td>
                <td>
                  <code>security.folderTrust.enabled</code>
                </td>
                <td>信頼済みフォルダのみで危険な操作を許可</td>
              </tr>
              <tr className="even">
                <td>Security</td>
                <td>
                  <code>security.enableConseca</code>
                </td>
                <td>LLMによる動的なセキュリティポリシー生成（コンテキスト対応セキュリティ）</td>
              </tr>
              <tr className="odd">
                <td>Tools</td>
                <td>
                  <code>tools.sandboxAllowedPaths</code> / <code>tools.sandboxNetworkAccess</code>
                </td>
                <td>サンドボックスの許可範囲</td>
              </tr>
              <tr className="even">
                <td>Model</td>
                <td>
                  <code>model.compressionThreshold</code>
                </td>
                <td>コンテキスト圧縮を発動する使用率のしきい値</td>
              </tr>
              <tr className="odd">
                <td>HooksConfig</td>
                <td>
                  <code>hooksConfig.enabled</code>
                </td>
                <td>フックシステム全体のON/OFF</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 id="63-サブエージェント向け設定例">6.3 サブエージェント向け設定例</h3>
        <p>
          特定のサブエージェント（例: <code>codebase_investigator</code>
          ）に、モデルや最大ターン数を個別指定する例です。
        </p>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>json</span>
            <CodeCopyButton text={CODE_TEXT_5} />
          </div>
          <pre className="json">
            <code className="json">
              <div className={styles.codeLine}>{"{"}</div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>&quot;agents&quot;</span>: {"{"}
              </div>
              <div className={styles.codeLine}>
                {"    "}
                <span className={styles.cv}>&quot;overrides&quot;</span>: {"{"}
              </div>
              <div className={styles.codeLine}>
                {"      "}
                <span className={styles.cv}>&quot;codebase_investigator&quot;</span>: {"{"}
              </div>
              <div className={styles.codeLine}>
                {"        "}
                <span className={styles.cv}>&quot;modelConfig&quot;</span>: {"{"}{" "}
                <span className={styles.cv}>&quot;model&quot;</span>:{" "}
                <span className={styles.cs}>&quot;gemini-3-flash-preview&quot;</span> {"}"},
              </div>
              <div className={styles.codeLine}>
                {"        "}
                <span className={styles.cv}>&quot;runConfig&quot;</span>: {"{"}{" "}
                <span className={styles.cv}>&quot;maxTurns&quot;</span>:{" "}
                <span className={styles.cn}>50</span> {"}"}
              </div>
              <div className={styles.codeLine}>
                {"      "}
                {"}"}
              </div>
              <div className={styles.codeLine}>
                {"    "}
                {"}"}
              </div>
              <div className={styles.codeLine}>
                {"  "}
                {"}"}
              </div>
              <div className={styles.codeLine}>{"}"}</div>
            </code>
          </pre>
        </div>

        <h3 id="64-mcpサーバー連携の設定例">6.4 MCPサーバー連携の設定例</h3>
        <p>
          マルチエージェント開発では、外部ツール（GitHub等）をMCP経由で各エージェントに与えることがよくあります。
        </p>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>json</span>
            <CodeCopyButton text={CODE_TEXT_6} />
          </div>
          <pre className="json">
            <code className="json">
              <div className={styles.codeLine}>{"{"}</div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>&quot;mcpServers&quot;</span>: {"{"}
              </div>
              <div className={styles.codeLine}>
                {"    "}
                <span className={styles.cv}>&quot;github&quot;</span>: {"{"}
              </div>
              <div className={styles.codeLine}>
                {"      "}
                <span className={styles.cv}>&quot;command&quot;</span>:{" "}
                <span className={styles.cs}>&quot;npx&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"      "}
                <span className={styles.cv}>&quot;args&quot;</span>: [
                <span className={styles.cs}>&quot;-y&quot;</span>,{" "}
                <span className={styles.cs}>&quot;@modelcontextprotocol/server-github&quot;</span>
                ],
              </div>
              <div className={styles.codeLine}>
                {"      "}
                <span className={styles.cv}>&quot;env&quot;</span>: {"{"}
              </div>
              <div className={styles.codeLine}>
                {"        "}
                <span className={styles.cv}>&quot;GITHUB_PERSONAL_ACCESS_TOKEN&quot;</span>:{" "}
                <span className={styles.cs}>
                  &quot;{"$"}
                  {"{GITHUB_TOKEN}"}&quot;
                </span>
              </div>
              <div className={styles.codeLine}>
                {"      "}
                {"}"}
              </div>
              <div className={styles.codeLine}>
                {"    "}
                {"}"}
              </div>
              <div className={styles.codeLine}>
                {"  "}
                {"}"}
              </div>
              <div className={styles.codeLine}>{"}"}</div>
            </code>
          </pre>
        </div>
        <p>
          <code>
            {"$"}
            {"{GITHUB_TOKEN}"}
          </code>{" "}
          のような記法で、実際の値をシェル環境変数から実行時に解決させ、設定ファイル自体にシークレットを平文で書かないのがベストプラクティスです。
        </p>

        <h3 id="65-サブエージェントを無効化したい場合">6.5 サブエージェントを無効化したい場合</h3>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>json</span>
            <CodeCopyButton text={CODE_TEXT_7} />
          </div>
          <pre className="json">
            <code className="json">
              <div className={styles.codeLine}>{"{"}</div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>&quot;experimental&quot;</span>: {"{"}{" "}
                <span className={styles.cv}>&quot;enableAgents&quot;</span>:{" "}
                <span className={styles.cn}>false</span> {"}"}
              </div>
              <div className={styles.codeLine}>{"}"}</div>
            </code>
          </pre>
        </div>

        <hr />

        <h2 id="7-サブエージェントsubagentsの設計">7. サブエージェント（Subagents）の設計</h2>
        <h3 id="71-サブエージェントとは">7.1 サブエージェントとは</h3>
        <p>
          サブエージェントは、メインの Gemini CLI
          セッションの中で動く「専門家」です。深いコードベース解析やドメイン固有の推論など、特定タスクをメインエージェントの文脈を汚さずに処理します。メインエージェントからは、サブエージェントは同名の
          <strong>1つのツール</strong>
          として見えます。呼び出されると処理を委譲し、完了すると結果だけを報告して戻ります。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_4} theme="base" themeVariables={MERMAID_THEME_VARS} />
        </div>

        <h3 id="72-組み込みサブエージェント">7.2 組み込みサブエージェント</h3>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr className="header">
                <th>名前</th>
                <th>役割</th>
                <th>既定</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>
                  <code>codebase_investigator</code>
                </td>
                <td>コードベース解析・依存関係の可視化</td>
                <td>有効</td>
              </tr>
              <tr className="even">
                <td>
                  <code>cli_help</code>
                </td>
                <td>Gemini CLI自体の使い方に関する専門知識</td>
                <td>有効</td>
              </tr>
              <tr className="odd">
                <td>
                  <code>generalist</code>
                </td>
                <td>
                  メインと同じツールを継承する汎用サブエージェント。マルチファイル改修や大量出力タスクをメインの文脈から隔離するのに使う
                </td>
                <td>有効</td>
              </tr>
              <tr className="even">
                <td>
                  <code>browser_agent</code>
                </td>
                <td>ブラウザ操作の自動化（Chrome 144以降必須）</td>
                <td>無効（要有効化）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 id="73-カスタムサブエージェントの作り方ステップバイステップ">
          7.3 カスタムサブエージェントの作り方（ステップバイステップ）
        </h3>
        <ol type="1">
          <li>
            <code>.gemini/agents/</code> （プロジェクト共有）または <code>~/.gemini/agents/</code>
            （個人用）にMarkdownファイルを作成する。
          </li>
          <li>
            ファイル先頭にYAMLフロントマターを書く（このフォーマットは<strong>必須</strong>）。
          </li>
          <li>
            フロントマター以降の本文が、そのままサブエージェントの
            <strong>システムプロンプト</strong>になる。
          </li>
        </ol>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>markdown</span>
            <CodeCopyButton text={CODE_TEXT_8} />
          </div>
          <pre className="markdown">
            <code className="markdown">
              <div className={styles.codeLine}>
                <span className={styles.cc}>---</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>name</span>:{" "}
                <span className={styles.cs}>security-auditor</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>description</span>:{" "}
                <span className={styles.cs}>
                  コード内のセキュリティ脆弱性を発見することに特化。
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>kind</span>: <span className={styles.cs}>local</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>tools</span>:
              </div>
              <div className={styles.codeLine}>
                {"  "}- <span className={styles.cs}>read_file</span>
              </div>
              <div className={styles.codeLine}>
                {"  "}- <span className={styles.cs}>grep_search</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>model</span>:{" "}
                <span className={styles.cs}>gemini-3-flash-preview</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>temperature</span>:{" "}
                <span className={styles.cn}>0.2</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>max_turns</span>: <span className={styles.cn}>10</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cc}>---</span>
              </div>
              <div className={styles.codeLine}>
                あなたは容赦のないセキュリティ監査官です。コードを分析し、潜在的な脆弱性を洗い出してください。
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.ct}>重点項目:</span>
              </div>
              <div className={styles.codeLine}>1. SQLインジェクション</div>
              <div className={styles.codeLine}>2. XSS（クロスサイトスクリプティング）</div>
              <div className={styles.codeLine}>3. ハードコードされた認証情報</div>
              <div className={styles.codeLine}>4. 安全でないファイル操作</div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                脆弱性を発見したら明確に説明し、修正案を提示すること。ただし自分で修正はしないこと。
              </div>
            </code>
          </pre>
        </div>

        <h3 id="74-フロントマター-スキーマ一覧">7.4 フロントマター スキーマ一覧</h3>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr className="header">
                <th>フィールド</th>
                <th>型</th>
                <th>必須</th>
                <th>説明</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>
                  <code>name</code>
                </td>
                <td>string</td>
                <td>○</td>
                <td>一意な識別子（小文字・数字・ハイフン・アンダースコアのみ）</td>
              </tr>
              <tr className="even">
                <td>
                  <code>description</code>
                </td>
                <td>string</td>
                <td>○</td>
                <td>どんな時に呼ぶべきかをメインエージェントが判断するための説明</td>
              </tr>
              <tr className="odd">
                <td>
                  <code>kind</code>
                </td>
                <td>string</td>
                <td>-</td>
                <td>
                  <code>local</code>（既定）または <code>remote</code>
                </td>
              </tr>
              <tr className="even">
                <td>
                  <code>tools</code>
                </td>
                <td>array</td>
                <td>-</td>
                <td>
                  使用可能なツール一覧。ワイルドカード対応。省略時は親セッションの全ツールを継承
                </td>
              </tr>
              <tr className="odd">
                <td>
                  <code>mcpServers</code>
                </td>
                <td>object</td>
                <td>-</td>
                <td>このサブエージェント専用のインラインMCPサーバー定義</td>
              </tr>
              <tr className="even">
                <td>
                  <code>model</code>
                </td>
                <td>string</td>
                <td>-</td>
                <td>使用モデル。既定は親セッションを継承</td>
              </tr>
              <tr className="odd">
                <td>
                  <code>temperature</code>
                </td>
                <td>number</td>
                <td>-</td>
                <td>
                  0.0〜2.0、既定 <code>1</code>
                </td>
              </tr>
              <tr className="even">
                <td>
                  <code>max_turns</code>
                </td>
                <td>number</td>
                <td>-</td>
                <td>
                  最大ターン数、既定 <code>30</code>
                </td>
              </tr>
              <tr className="odd">
                <td>
                  <code>timeout_mins</code>
                </td>
                <td>number</td>
                <td>-</td>
                <td>
                  最大実行時間（分）、既定 <code>10</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 id="75-ツール分離と再帰防止">7.5 ツール分離と再帰防止</h3>
        <p>
          各サブエージェントは独立したコンテキストループで動作し、明示的に許可したツールにしかアクセスできません。
          <strong>
            重要な安全設計として、サブエージェントは他のサブエージェントを呼び出せません
          </strong>
          （<code>*</code>{" "}
          ワイルドカードを与えても他エージェントは見えない）。これにより無限再帰やトークンの爆発的消費を防いでいます。
        </p>

        <h3 id="76-サブエージェント単位のポリシー制御">7.6 サブエージェント単位のポリシー制御</h3>
        <p>ポリシーエンジンのTOML設定で、特定サブエージェントにだけ適用されるルールを書けます。</p>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>toml</span>
            <CodeCopyButton text={CODE_TEXT_9} />
          </div>
          <pre className="toml">
            <code className="toml">
              <div className={styles.codeLine}>
                <span className={styles.ct}>[[rules]]</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>name</span> ={" "}
                <span className={styles.cs}>&quot;Allow pr-creator to push code&quot;</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>subagent</span> ={" "}
                <span className={styles.cs}>&quot;pr-creator&quot;</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>description</span> ={" "}
                <span className={styles.cs}>
                  &quot;pr-creatorによる自動ブランチプッシュを許可する。&quot;
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>action</span> ={" "}
                <span className={styles.cs}>&quot;allow&quot;</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>toolName</span> ={" "}
                <span className={styles.cs}>&quot;run_shell_command&quot;</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>commandPrefix</span> ={" "}
                <span className={styles.cs}>&quot;git push&quot;</span>
              </div>
            </code>
          </pre>
        </div>

        <h3 id="77-説明文descriptionの最適化がすべてを左右する">
          7.7 説明文（description）の最適化がすべてを左右する
        </h3>
        <p>
          メインエージェントはサブエージェントの <code>description</code>{" "}
          を見て「これは自分の専門家か」を判断します。呼び出し精度を上げる鉄則は、①専門分野、②いつ使うべきか、③具体的な利用シーン例、の3点を書くことです。
        </p>
        <blockquote>
          <p>Git操作全般（ローカル・リモート双方）に使うべきGitエキスパートエージェント。例:</p>
          <ul>
            <li>コミットの作成</li>
            <li>
              <code>bisect</code>によるリグレッション調査
            </li>
            <li>GitHubなどのソース管理・課題管理システムとのやり取り</li>
          </ul>
        </blockquote>

        <hr />

        <h2 id="8-リモートサブエージェントと-a2a-プロトコル入門">
          8. リモートサブエージェントと A2A プロトコル入門
        </h2>
        <h3 id="81-a2aagent-to-agentプロトコルとは何か">
          8.1 A2A（Agent-to-Agent）プロトコルとは何か
        </h3>
        <p>
          A2A
          は、実装言語やフレームワークを問わずエージェント同士が相互運用できるようにするオープン標準です。「エージェント界のHTTP」と表現され、REST
          APIにおけるOpenAPI仕様のような役割を果たす <strong>Agent Card</strong>{" "}
          を軸に、次の3つの課題を解決します。
        </p>
        <ol type="1">
          <li>
            <strong>発見（Discovery）</strong>: エージェントは <code>/.well-known/agent.json</code>{" "}
            というJSONメタデータ（Agent
            Card）を通じて自身の能力を宣言する。呼び出す側は先にこのカードを取得して「相手が何をできるか」を理解する。
          </li>
          <li>
            <strong>通信（Communication）</strong>: すべてのデータ交換は単一エンドポイント経由の
            JSON-RPC 2.0 で行われる。中心となるメソッドは <code>message/send</code>
            （同期的な送受信）で、他に <code>tasks/send</code>・<code>tasks/get</code>{" "}
            などがある。データは <code>TextPart</code>（自然言語）や <code>DataPart</code>
            （構造化JSON）といった型付きの「Message Part」で運ばれる。
          </li>
          <li>
            <strong>タスクのライフサイクル</strong>: すべてのやり取りは <code>Task</code> に包まれ、
            <code>submitted → working → completed / failed</code>{" "}
            という明確な状態遷移をたどる。この仕組みにより、同期的なワークフロー（今すぐこの契約書を確認）と非同期のワークフロー（48時間かけて文書を検証）を同じプロトコルで扱える。
          </li>
        </ol>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_5} theme="base" themeVariables={MERMAID_THEME_VARS} />
        </div>

        <h3 id="82-agent-cardagentjsonの主要フィールド">
          8.2 Agent Card（<code>agent.json</code>）の主要フィールド
        </h3>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>json</span>
            <CodeCopyButton text={CODE_TEXT_10} />
          </div>
          <pre className="json">
            <code className="json">
              <div className={styles.codeLine}>{"{"}</div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>&quot;protocolVersion&quot;</span>:{" "}
                <span className={styles.cs}>&quot;0.3.0&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>&quot;name&quot;</span>:{" "}
                <span className={styles.cs}>&quot;Example Agent Name&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>&quot;description&quot;</span>:{" "}
                <span className={styles.cs}>
                  &quot;ドキュメント目的のサンプルエージェントの説明。&quot;
                </span>
                ,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>&quot;version&quot;</span>:{" "}
                <span className={styles.cs}>&quot;1.0.0&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>&quot;url&quot;</span>:{" "}
                <span className={styles.cs}>&quot;https://example.com/a2a&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>&quot;preferredTransport&quot;</span>:{" "}
                <span className={styles.cs}>&quot;HTTP+JSON&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>&quot;capabilities&quot;</span>: {"{"}
              </div>
              <div className={styles.codeLine}>
                {"    "}
                <span className={styles.cv}>&quot;streaming&quot;</span>:{" "}
                <span className={styles.cn}>true</span>,
              </div>
              <div className={styles.codeLine}>
                {"    "}
                <span className={styles.cv}>&quot;extendedAgentCard&quot;</span>:{" "}
                <span className={styles.cn}>false</span>
              </div>
              <div className={styles.codeLine}>
                {"  "}
                {"}"},
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>&quot;defaultInputModes&quot;</span>: [
                <span className={styles.cs}>&quot;text/plain&quot;</span>],
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>&quot;defaultOutputModes&quot;</span>: [
                <span className={styles.cs}>&quot;application/json&quot;</span>
                ],
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>&quot;skills&quot;</span>: [
              </div>
              <div className={styles.codeLine}>
                {"    "}
                {"{"}
              </div>
              <div className={styles.codeLine}>
                {"      "}
                <span className={styles.cv}>&quot;id&quot;</span>:{" "}
                <span className={styles.cs}>&quot;ExampleSkill&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"      "}
                <span className={styles.cv}>&quot;name&quot;</span>:{" "}
                <span className={styles.cs}>&quot;Example Skill Assistant&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"      "}
                <span className={styles.cv}>&quot;description&quot;</span>:{" "}
                <span className={styles.cs}>&quot;このスキルが行うことの説明。&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"      "}
                <span className={styles.cv}>&quot;tags&quot;</span>: [
                <span className={styles.cs}>&quot;example-tag&quot;</span>],
              </div>
              <div className={styles.codeLine}>
                {"      "}
                <span className={styles.cv}>&quot;examples&quot;</span>: [
                <span className={styles.cs}>&quot;ここに例を示してください。&quot;</span>]
              </div>
              <div className={styles.codeLine}>
                {"    "}
                {"}"}
              </div>
              <div className={styles.codeLine}>{"  "}]</div>
              <div className={styles.codeLine}>{"}"}</div>
            </code>
          </pre>
        </div>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr className="header">
                <th>フィールド</th>
                <th>意味</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>
                  <code>protocolVersion</code>
                </td>
                <td>準拠するA2A仕様のバージョン</td>
              </tr>
              <tr className="even">
                <td>
                  <code>name</code> / <code>description</code> / <code>version</code>
                </td>
                <td>エージェントの識別情報</td>
              </tr>
              <tr className="odd">
                <td>
                  <code>url</code>
                </td>
                <td>このエージェントのA2Aエンドポイント</td>
              </tr>
              <tr className="even">
                <td>
                  <code>capabilities.streaming</code>
                </td>
                <td>SSEによるストリーミング応答に対応しているか</td>
              </tr>
              <tr className="odd">
                <td>
                  <code>defaultInputModes</code> / <code>defaultOutputModes</code>
                </td>
                <td>受け付ける/返す既定のMIMEタイプ</td>
              </tr>
              <tr className="even">
                <td>
                  <code>skills</code>
                </td>
                <td>提供する能力のリスト。各スキルにID・説明・タグ・利用例を持つ</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 id="83-gemini-cli-からリモートサブエージェントを定義する">
          8.3 Gemini CLI からリモートサブエージェントを定義する
        </h3>
        <p>
          Gemini CLI 自体も、<code>.gemini/agents/*.md</code> で <code>kind: remote</code>{" "}
          を指定することで、A2A準拠の外部エージェントをサブエージェントとして直接呼び出せます。
        </p>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>markdown</span>
            <CodeCopyButton text={CODE_TEXT_11} />
          </div>
          <pre className="markdown">
            <code className="markdown">
              <div className={styles.codeLine}>
                <span className={styles.cc}>---</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>kind</span>: <span className={styles.cs}>remote</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>name</span>:{" "}
                <span className={styles.cs}>my-remote-agent</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>agent_card_url</span>:{" "}
                <span className={styles.cs}>https://example.com/agent-card</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cc}>---</span>
              </div>
            </code>
          </pre>
        </div>
        <p>
          1つのMarkdownファイルに複数のリモートサブエージェントをリスト形式で定義することも可能です（ローカルとリモートの混在や複数ローカルの混在は不可、リモートの複数指定のみサポート）。
        </p>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>markdown</span>
            <CodeCopyButton text={CODE_TEXT_12} />
          </div>
          <pre className="markdown">
            <code className="markdown">
              <div className={styles.codeLine}>
                <span className={styles.cc}>---</span>
              </div>
              <div className={styles.codeLine}>
                - <span className={styles.cv}>kind</span>: <span className={styles.cs}>remote</span>
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>name</span>: <span className={styles.cs}>remote-1</span>
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>agent_card_url</span>:{" "}
                <span className={styles.cs}>https://example.com/1</span>
              </div>
              <div className={styles.codeLine}>
                - <span className={styles.cv}>kind</span>: <span className={styles.cs}>remote</span>
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>name</span>: <span className={styles.cs}>remote-2</span>
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>agent_card_url</span>:{" "}
                <span className={styles.cs}>https://example.com/2</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cc}>---</span>
              </div>
            </code>
          </pre>
        </div>
        <p>
          Agent Card を配信するエンドポイントを持たない場合は、<code>agent_card_json</code>{" "}
          にJSON文字列を直接埋め込むこともできます（YAMLのブロックスカラー <code>|</code>{" "}
          を使うと引用符のエスケープが不要になり可読性が上がります）。
        </p>

        <h3 id="84-認証方式の比較">8.4 認証方式の比較</h3>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr className="header">
                <th>認証タイプ</th>
                <th>概要</th>
                <th>主な用途</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>
                  <code>apiKey</code>
                </td>
                <td>静的なAPIキーをHTTPヘッダーで送信</td>
                <td>サードパーティAPI</td>
              </tr>
              <tr className="even">
                <td>
                  <code>http</code>（Bearer/Basic/Raw）
                </td>
                <td>Bearerトークン、Basic認証、その他IANA登録スキーム</td>
                <td>汎用HTTP認証</td>
              </tr>
              <tr className="odd">
                <td>
                  <code>google-credentials</code>
                </td>
                <td>
                  Google Application Default
                  Credentials（ADC）を利用。ホスト名から自動でアクセストークン/IDトークンを選択
                </td>
                <td>
                  <code>*.googleapis.com</code>（Agent Engine, Vertex AI等）、<code>*.run.app</code>
                  （Cloud Run）
                </td>
              </tr>
              <tr className="even">
                <td>
                  <code>oauth</code>
                </td>
                <td>PKCE付きOAuth 2.0 認可コードフロー。初回はブラウザでサインイン</td>
                <td>サードパーティのOAuth対応エージェント</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>セキュリティ上のポイント</strong>:
          シークレットはエージェント定義ファイルに直書きせず、<code>$MY_API_KEY</code>
          （環境変数参照）や <code>!gcloud auth print-token</code>
          （シェルコマンド実行結果）のような動的値解決を使うことが推奨されます。特にプロジェクト共有の{" "}
          <code>.gemini/agents/*.md</code>{" "}
          はバージョン管理にコミットされる可能性が高いため注意してください。
        </p>

        <hr />

        <h2 id="9-agentpy--adk-でのエージェント実装パターン">
          9. agent.py — ADK でのエージェント実装パターン
        </h2>
        <h3 id="91-基本のエージェント定義">9.1 基本のエージェント定義</h3>
        <p>
          ADK（Agent Development Kit）は、Python・Java・Go・TypeScript・Kotlin
          に対応するオープンソースのマルチエージェント構築フレームワークです。もっとも基本的な{" "}
          <code>agent.py</code> は、ツールと指示文を持つ <code>Agent</code>{" "}
          オブジェクトを1つ定義するだけです。
        </p>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>python</span>
            <CodeCopyButton text={CODE_TEXT_13} />
          </div>
          <pre className="python">
            <code className="python">
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span> google.adk.agents{" "}
                <span className={styles.ck}>import</span> Agent
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span> my_tools{" "}
                <span className={styles.ck}>import</span> fetch_purchase_history, get_policy,
                send_email, issue_refund, close_ticket
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>root_agent</span> = Agent(
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>name</span>=
                <span className={styles.cs}>&quot;Refund_Processor&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>tools</span>=[ fetch_purchase_history, get_policy,
                send_email, issue_refund, close_ticket],
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>instruction</span>=
                <span className={styles.cs}>&quot;&quot;&quot;</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cs}>
                  {"  "}
                  あなたは返金処理を担当するカスタマーサービスエージェントです。
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cs}>{"  "}以下の5ステップを厳密に守ってください。</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cs}>
                  {"  "}
                  1. fetch_purchase_historyツールで購入履歴を確認する。
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cs}>
                  {"  "}2. get_policyツールで返金ポリシーを確認する。
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cs}>
                  {"  "}
                  3. 対象であればissue_refundツールで返金処理を行う。
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cs}>{"  "}4. send_emailツールで顧客にメールを送る。</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cs}>
                  {"  "}5. close_ticketツールで返金対応を完了とする。
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cs}>{"  "}&quot;&quot;&quot;</span>
              </div>
              <div className={styles.codeLine}>)</div>
            </code>
          </pre>
        </div>
        <p>
          このパターンの弱点は、ツールが10〜15個を超えると「モデルがどのツールを呼ぶべきか混乱し始める」「文脈が肥大化して指示を見落とす」といった
          <strong>コンテキスト劣化（context degradation）</strong>
          が起きやすくなることです。この課題を解決する2つの方向性が、次節の「マルチエージェント分割」と「ADK
          2.0 Workflows」です。
        </p>

        <h3 id="92-マルチエージェント分割のパターンsequentialagent">
          9.2 マルチエージェント分割のパターン（SequentialAgent）
        </h3>
        <p>
          1つの巨大なプロンプトに全責務を詰め込む代わりに、責務ごとにエージェントを分割し、
          <code>SequentialAgent</code> で順に実行させます。以下は、Python製の抽出エージェント →
          Go製のリモート検証エージェント（A2A経由） →
          レポート生成エージェント、という3段構成の実例です。
        </p>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>python</span>
            <CodeCopyButton text={CODE_TEXT_14} />
          </div>
          <pre className="python">
            <code className="python">
              <div className={styles.codeLine}>
                <span className={styles.cc}># python-extraction-agent/app/agent.py</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span> google.adk.agents{" "}
                <span className={styles.ck}>import</span> Agent, SequentialAgent
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span> google.adk.agents.remote_a2a_agent{" "}
                <span className={styles.ck}>import</span> RemoteA2aAgent
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span> google.adk.models{" "}
                <span className={styles.ck}>import</span> Gemini
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cc}># サブエージェント1: LLM推論でデータを抽出</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>extractor_agent</span> = Agent(
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>name</span>=
                <span className={styles.cs}>&quot;extractor_agent&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>model</span>=Gemini(
                <span className={styles.cv}>model</span>=
                <span className={styles.cs}>&quot;gemini-3.5-flash&quot;</span>
                ),
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>instruction</span>=
                <span className={styles.cs}>
                  &quot;あなたは法務データ抽出エージェントです。契約書から金額・契約者・日付・保険条項を抽出してください。&quot;
                </span>
                ,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>tools</span>=[read_contract_text, save_extracted_fields,
                classify_risk_level]
              </div>
              <div className={styles.codeLine}>)</div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cc}>
                  # サブエージェント2:
                  Go製のA2Aコンプライアンスサービスをローカルエージェントとしてラップ
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>compliance_agent</span> = RemoteA2aAgent(
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>name</span>=
                <span className={styles.cs}>&quot;compliance_agent&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>agent_card</span>=GO_AGENT_CARD_URL,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>description</span>=
                <span className={styles.cs}>
                  &quot;抽出された契約フィールドを企業のコンプライアンスポリシーに照らして検証する。&quot;
                </span>
              </div>
              <div className={styles.codeLine}>)</div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cc}># サブエージェント3: 最終監査レポートを生成</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>report_agent</span> = Agent(
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>name</span>=
                <span className={styles.cs}>&quot;report_agent&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>model</span>=Gemini(
                <span className={styles.cv}>model</span>=
                <span className={styles.cs}>&quot;gemini-3.5-flash&quot;</span>
                ),
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>instruction</span>=
                <span className={styles.cs}>
                  &quot;最終的なコンプライアンスレポートとMarkdown要約を生成すること。&quot;
                </span>
                ,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>tools</span>= [generate_summary_report]
              </div>
              <div className={styles.codeLine}>)</div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cc}># コーディネーター: 上記3つを順番に連結する</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>root_agent</span> = SequentialAgent(
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>name</span>=
                <span className={styles.cs}>&quot;contract_compliance_coordinator&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>description</span>=
                <span className={styles.cs}>
                  &quot;契約解析・A2Aコンプライアンス検証・最終レポート作成を順に実行する。&quot;
                </span>
                ,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>sub_agents</span>=[extractor_agent, compliance_agent,
                report_agent],
              </div>
              <div className={styles.codeLine}>)</div>
            </code>
          </pre>
        </div>
        <p>
          このパターンの利点は、
          <strong>
            Pythonのオーケストレーターから見ると、Go製の別言語・別プロセスのサービスが、あたかもローカルのPythonクラスであるかのように呼び出せる
          </strong>
          ことです。ADKのSDKが Agent Card
          の取得、パラメータのシリアライズ、JSON-RPCの通信をすべて裏側で処理してくれます。
        </p>

        <h3 id="93-サブエージェント間のデータ受け渡し共有状態">
          9.3 サブエージェント間のデータ受け渡し（共有状態）
        </h3>
        <p>
          エージェント間で関数の引数や戻り値としてデータを渡す代わりに、ADKの{" "}
          <code>ToolContext.state</code>{" "}
          が提供する共有辞書（セッションステート）を介してやり取りするのが定石です。パイプラインの各ステップを列挙型（Enum）でチェックポイント化しておくと、状態遷移が追跡しやすくなります。
        </p>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>python</span>
            <CodeCopyButton text={CODE_TEXT_15} />
          </div>
          <pre className="python">
            <code className="python">
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span> enum{" "}
                <span className={styles.ck}>import</span> Enum
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>class</span>{" "}
                <span className={styles.ct}>ComplianceStep</span>(str, Enum):
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>INGESTED</span> ={" "}
                <span className={styles.cs}>&quot;INGESTED&quot;</span>
                {"                      "}
                <span className={styles.cc}># 契約書アップロード、抽出待ち</span>
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>EXTRACTED</span> ={" "}
                <span className={styles.cs}>&quot;EXTRACTED&quot;</span>
                {"                     "}
                <span className={styles.cc}># Geminiによるフィールド抽出完了</span>
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>COMPLIANCE_PENDING</span> ={" "}
                <span className={styles.cs}>&quot;COMPLIANCE_PENDING&quot;</span>
                {"   "}
                <span className={styles.cc}># Goエージェントへ送信、結果待ち</span>
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>COMPLIANCE_COMPLETE</span> ={" "}
                <span className={styles.cs}>&quot;COMPLIANCE_COMPLETE&quot;</span>{" "}
                <span className={styles.cc}># Goエージェントの判定を受領</span>
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>MANUAL_REVIEW</span> ={" "}
                <span className={styles.cs}>&quot;MANUAL_REVIEW&quot;</span>
                {"             "}
                <span className={styles.cc}># タイムアウト/エラー、人間のレビューへ</span>
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>REVIEW_READY</span> ={" "}
                <span className={styles.cs}>&quot;REVIEW_READY&quot;</span>
                {"               "}
                <span className={styles.cc}># 違反ありのレポート生成済み</span>
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>APPROVED</span> ={" "}
                <span className={styles.cs}>&quot;APPROVED&quot;</span>
                {"                       "}
                <span className={styles.cc}># 全チェック合格</span>
              </div>
            </code>
          </pre>
        </div>
        <p>
          <code>MANUAL_REVIEW</code>{" "}
          の設計が特に重要です。リモートのコンプライアンスエージェントがクラッシュ・ネットワークタイムアウト・未起動などの理由で応答不能になっても、パイプラインは単純に失敗するのではなく、人間のレビュー担当者にケースを引き渡す状態へフェイルセーフに遷移します。
          <strong>
            リモート依存先が断続的に利用不能になり得る本番システムでは、このフェイルセーフ設計が必須
          </strong>
          です。
        </p>

        <h3 id="94-マルチエージェントパイプラインの全体像">
          9.4 マルチエージェントパイプラインの全体像
        </h3>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_6} theme="base" themeVariables={MERMAID_THEME_VARS} />
        </div>

        <hr />

        <h2 id="10-remotea2aagent-実装パターンの詳細">10. RemoteA2aAgent 実装パターンの詳細</h2>
        <h3 id="101-3つの指定方法">10.1 3つの指定方法</h3>
        <p>
          <code>RemoteA2aAgent</code>
          はリモートのA2A準拠エージェントを指し示す方法を3通りサポートします。
        </p>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>python</span>
            <CodeCopyButton text={CODE_TEXT_16} />
          </div>
          <pre className="python">
            <code className="python">
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span> google.adk.agents.remote_a2a_agent{" "}
                <span className={styles.ck}>import</span> RemoteA2aAgent
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cc}># 方法1: Agent CardのURLを直接指定</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>remote_agent</span> = RemoteA2aAgent(
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>name</span>=
                <span className={styles.cs}>&quot;image_scoring&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>description</span>=
                <span className={styles.cs}>
                  &quot;画像について興味深い事実を教えてくれるエージェント。&quot;
                </span>
                ,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>agent_card</span>=
                <span className={styles.cs}>
                  &quot;http://localhost:8001/a2a/image_scoring/.well-known/agent.json&quot;
                </span>
                ,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>timeout</span>=<span className={styles.cn}>300.0</span>,
                {"       "}
                <span className={styles.cc}># HTTPタイムアウト（秒）</span>
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>httpx_client</span>=
                <span className={styles.cn}>None</span>,{"   "}
                <span className={styles.cc}># カスタムHTTPクライアント（省略可）</span>
              </div>
              <div className={styles.codeLine}>)</div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cc}>
                  # 方法2: ローカルファイルパスとしてAgent Cardを指定
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>remote_agent_from_file</span> = RemoteA2aAgent(
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>name</span>=
                <span className={styles.cs}>&quot;illustration_agent&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>description</span>=
                <span className={styles.cs}>&quot;イラストを生成するエージェント。&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>agent_card</span>=
                <span className={styles.cs}>&quot;illustration-agent-card.json&quot;</span>,
              </div>
              <div className={styles.codeLine}>)</div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cc}>
                  # 方法3:
                  AgentCardオブジェクトを直接構築して渡す（プログラムから動的に生成する場合）
                </span>
              </div>
            </code>
          </pre>
        </div>

        <h3 id="102-サブエージェントとして組み込む">10.2 サブエージェントとして組み込む</h3>
        <p>
          <code>RemoteA2aAgent</code> は他の <code>Agent</code> と同じインターフェースを持つため、
          <code>sub_agents</code>{" "}
          リストにそのまま加えるだけでメインのオーケストレーターから利用できます。
        </p>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>python</span>
            <CodeCopyButton text={CODE_TEXT_17} />
          </div>
          <pre className="python">
            <code className="python">
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span> google.adk.agents.remote_a2a_agent{" "}
                <span className={styles.ck}>import</span> RemoteA2aAgent
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span> google.adk{" "}
                <span className={styles.ck}>import</span> Agent
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>data_analyst</span> = RemoteA2aAgent(
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>name</span>=
                <span className={styles.cs}>&quot;DataAnalyst&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>description</span>=
                <span className={styles.cs}>&quot;データセットを分析する。&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>agent_card</span>=
                <span className={styles.cs}>
                  &quot;https://agent-b.run.app/.well-known/agent.json&quot;
                </span>
              </div>
              <div className={styles.codeLine}>)</div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>orchestrator</span> = Agent(
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>name</span>=
                <span className={styles.cs}>&quot;Orchestrator&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>model</span>=
                <span className={styles.cs}>&quot;gemini-2.0-flash&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>instruction</span>=
                <span className={styles.cs}>
                  &quot;データ分析タスクはDataAnalystに委譲すること。&quot;
                </span>
                ,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>sub_agents</span>=[data_analyst]
              </div>
              <div className={styles.codeLine}>)</div>
            </code>
          </pre>
        </div>
        <p>
          これだけで、カスタムのHTTP呼び出しコード、独自レスポンス形式のパース、手動の認証処理、非同期結果のポーリングといった定型作業をすべてADKが肩代わりします。ADKがAgent
          Cardを読み取り、DataAnalystができることを理解した上で、A2Aプロトコルによる通信をすべて処理してくれます。
        </p>

        <h3 id="103-逆方向-自分のエージェントをa2a対応で公開するto_a2a">
          10.3 逆方向: 自分のエージェントをA2A対応で公開する（<code>to_a2a()</code>）
        </h3>
        <p>
          これまでは「他人のリモートエージェントを呼ぶ側」でしたが、逆に
          <strong>自分のADKエージェントを他のエージェントから呼ばれるように公開する</strong>には{" "}
          <code>to_a2a()</code> ユーティリティを使うのが最も簡単な方法です。
        </p>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>python</span>
            <CodeCopyButton text={CODE_TEXT_18} />
          </div>
          <pre className="python">
            <code className="python">
              <div className={styles.codeLine}>
                <span className={styles.cc}># あなたの既存のエージェント定義</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>root_agent</span> = Agent(
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>model</span>=
                <span className={styles.cs}>&apos;gemini-flash-latest&apos;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>name</span>=
                <span className={styles.cs}>&apos;hello_world_agent&apos;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cc}># ...ツールや指示...</span>
              </div>
              <div className={styles.codeLine}>)</div>
            </code>
          </pre>
        </div>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>python</span>
            <CodeCopyButton text={CODE_TEXT_19} />
          </div>
          <pre className="python">
            <code className="python">
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span> google.adk.a2a.utils.agent_to_a2a{" "}
                <span className={styles.ck}>import</span> to_a2a
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cc}># エージェントをA2A対応にする</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>a2a_app</span> = to_a2a(root_agent,{" "}
                <span className={styles.cv}>port</span>=<span className={styles.cn}>8001</span>)
              </div>
            </code>
          </pre>
        </div>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>bash</span>
            <CodeCopyButton text={CODE_TEXT_20} />
          </div>
          <pre className="bash">
            <code className="bash">
              <div className={styles.codeLine}>
                <span className={styles.cc}># uvicornでA2Aサーバーとして起動</span>
              </div>
              <div className={styles.codeLine}>
                uvicorn agent:a2a_app --host localhost --port{" "}
                <span className={styles.cn}>8001</span>
              </div>
            </code>
          </pre>
        </div>
        <p>
          <code>to_a2a()</code> はAgent Card（<code>agent.json</code>
          ）を、あなたのADKエージェントのコードから<strong>自動生成</strong>してくれます（
          <code>agent_card</code> 引数に自分で用意した <code>AgentCard</code>{" "}
          オブジェクトやJSONファイルパスを渡して上書きすることも可能）。生成されたカードは{" "}
          <code>http://localhost:8001/.well-known/agent-card.json</code> で確認できます。
        </p>
        <p>
          内部的に <code>to_a2a()</code> は以下を自動セットアップします。
        </p>
        <ul>
          <li>
            <strong>
              <code>A2aAgentExecutor</code>
            </strong>
            : A2Aプロトコルとあなたの ADK エージェントを橋渡しする実行エンジン
          </li>
          <li>
            <strong>
              <code>InMemoryTaskStore</code>
            </strong>{" "}
            /{" "}
            <strong>
              <code>InMemoryPushNotificationConfigStore</code>
            </strong>
            : タスク状態とプッシュ通知の管理
          </li>
          <li>
            <strong>
              <code>DefaultRequestHandler</code>
            </strong>
            : 受信したA2A HTTPリクエストを適切にルーティング
          </li>
          <li>
            <strong>Starletteアプリ</strong>: 起動時にAgent Cardを自動構築し、必要なA2A
            APIルートをすべてマウント
          </li>
        </ul>

        <h3 id="104-もう一つの公開方法-adk-api_server---a2a">
          10.4 もう一つの公開方法: <code>adk api_server --a2a</code>
        </h3>
        <p>
          自前で <code>agent.json</code> を作成し、<code>adk api_server --a2a</code>{" "}
          でホストする方法もあります。この方式のメリットは、<code>adk web</code>{" "}
          と組み合わせてデバッグしやすいこと、また1つのサーバーで複数の独立したエージェントを親フォルダ配下にまとめて配信できることです。
        </p>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>bash</span>
            <CodeCopyButton text={CODE_TEXT_21} />
          </div>
          <pre className="bash">
            <code className="bash">
              <div className={styles.codeLine}>
                <span className={styles.cc}>
                  # following command runs the ADK agent as a2a agent
                </span>
              </div>
              <div className={styles.codeLine}>
                adk api_server --a2a --port <span className={styles.cn}>8001</span> remote_a2a
              </div>
            </code>
          </pre>
        </div>

        <h3 id="105-開発時のディレクトリ構成例">10.5 開発時のディレクトリ構成例</h3>
        <ul>
          <li>
            <code>a2a_root/</code>
            <ul>
              <li>
                <code>remote_a2a/</code>
                <ul>
                  <li>
                    <code>hello_world/</code>
                    <ul>
                      <li>
                        <code>__init__.py</code>
                      </li>
                      <li>
                        <code>agent.py</code> — 公開する側（<code>to_a2a()</code>で
                        <code>a2a_app</code>を定義）
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <code>README.md</code>
              </li>
              <li>
                <code>agent.py</code> — 呼び出す側（<code>RemoteA2aAgent</code>で
                <code>root_agent</code>を定義）
              </li>
            </ul>
          </li>
        </ul>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>bash</span>
            <CodeCopyButton text={CODE_TEXT_22} />
          </div>
          <pre className="bash">
            <code className="bash">
              <div className={styles.codeLine}>
                <span className={styles.cc}># 1. リモート（公開）側を起動</span>
              </div>
              <div className={styles.codeLine}>
                uvicorn contributing.samples.a2a_root.remote_a2a.hello_world.agent:a2a_app --host
                localhost --port <span className={styles.cn}>8001</span>
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cc}>
                  # 2. 別ターミナルで、呼び出す側（コンシューマー）のadk webを起動
                </span>
              </div>
              <div className={styles.codeLine}>adk web contributing/samples/</div>
            </code>
          </pre>
        </div>
        <p>
          <code>adk web</code> の既定ポートは <code>8000</code> なので、公開側は必ず別ポート（例では{" "}
          <code>8001</code>）で立てる必要があります。
        </p>

        <hr />

        <h2 id="11-vertex-ai-agent-engine-へのデプロイ">11. Vertex AI Agent Engine へのデプロイ</h2>
        <h3 id="111-agent-engine-とは">11.1 Agent Engine とは</h3>
        <p>
          Vertex AI Agent Engine は、ADK・LangChain
          等のフレームワークで作られたエージェントを、インフラ管理・オートスケーリング・APIサービングまで含めてマネージドで実行してくれる
          Google Cloud のサービスです。
          <strong>2026年7月時点で、Python版ADKエージェントのみが Agent Engine の対応言語</strong>
          とされています（Go/Java版ADKはCloud Run等の別ターゲットを利用）。
        </p>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_7} theme="base" themeVariables={MERMAID_THEME_VARS} />
        </div>

        <h3 id="112-デプロイ手順ステップバイステップ">11.2 デプロイ手順（ステップバイステップ）</h3>
        <ol type="1">
          <li>
            <strong>前提となるIAM権限を確認する。</strong> Agent
            Engineを使うには、プロジェクトに必要なIAMロールを管理者から付与してもらう必要があります。
          </li>
          <li>
            <strong>SDKをインストールする。</strong>
          </li>
        </ol>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>bash</span>
            <CodeCopyButton text={CODE_TEXT_23} />
          </div>
          <pre className="bash">
            <code className="bash">
              <div className={styles.codeLine}>
                pip install --upgrade --quiet{" "}
                <span className={styles.cs}>
                  &quot;google-cloud-aiplatform[agent_engines,adk]&gt;=1.112&quot;
                </span>
              </div>
            </code>
          </pre>
        </div>
        <ol start={3} type="1">
          <li>
            <strong>ローカルで認証する。</strong>
          </li>
        </ol>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>bash</span>
            <CodeCopyButton text={CODE_TEXT_24} />
          </div>
          <pre className="bash">
            <code className="bash">
              <div className={styles.codeLine}>gcloud auth application-default login</div>
            </code>
          </pre>
        </div>
        <ol start={4} type="1">
          <li>
            <strong>
              <code>adk deploy agent_engine</code> コマンドでデプロイする。
            </strong>
            このコマンドはコードのパッケージング、コンテナビルド、Agent
            Engineへのデプロイまでを一括で行います（数分かかります）。
          </li>
        </ol>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>bash</span>
            <CodeCopyButton text={CODE_TEXT_25} />
          </div>
          <pre className="bash">
            <code className="bash">
              <div className={styles.codeLine}>
                <span className={styles.cv}>PROJECT_ID</span>=my-project-id
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>LOCATION_ID</span>=us-central1
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>adk deploy agent_engine \</div>
              <div className={styles.codeLine}>
                {"  "}--project=
                <span className={styles.cv}>$PROJECT_ID</span> \
              </div>
              <div className={styles.codeLine}>
                {"  "}--region=
                <span className={styles.cv}>$LOCATION_ID</span> \
              </div>
              <div className={styles.codeLine}>
                {"  "}--display_name=
                <span className={styles.cs}>&quot;My First Agent&quot;</span> \
              </div>
              <div className={styles.codeLine}>{"  "}multi_tool_agent</div>
            </code>
          </pre>
        </div>
        <ol start={5} type="1">
          <li>
            <strong>
              デプロイ完了後に得られる <code>RESOURCE_ID</code> を控える。
            </strong>{" "}
            このIDと <code>PROJECT_ID</code>・<code>LOCATION_ID</code>{" "}
            を組み合わせて、以降のクエリ用URLを構築します。
          </li>
        </ol>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>text</span>
            <CodeCopyButton text={CODE_TEXT_26} />
          </div>
          <pre className="text">
            <code className="text">
              <div className={styles.codeLine}>
                {
                  "https://{LOCATION_ID}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{LOCATION_ID}/reasoningEngines/{RESOURCE_ID}:query"
                }
              </div>
            </code>
          </pre>
        </div>

        <h3 id="113-コードから直接デプロイする方法in-memory-object-deployment">
          11.3 コードから直接デプロイする方法（in-memory object deployment）
        </h3>
        <p>
          CLIコマンド以外に、Python から直接 <code>agent_engines</code>{" "}
          モジュールを使ってデプロイすることもできます。ローカルで動いているエージェントオブジェクトを{" "}
          <code>cloudpickle</code> でシリアライズし、Cloud Storage
          にアップロードしてからクラウド上で復元する流れです。
        </p>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>python</span>
            <CodeCopyButton text={CODE_TEXT_27} />
          </div>
          <pre className="python">
            <code className="python">
              <div className={styles.codeLine}>
                <span className={styles.ck}>import</span> vertexai
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span> vertexai.preview{" "}
                <span className={styles.ck}>import</span> reasoning_engines
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>vertexai.init(</div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>project</span>=
                <span className={styles.cs}>&quot;your-gcp-project-id&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>location</span>=
                <span className={styles.cs}>&quot;us-central1&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>staging_bucket</span>=
                <span className={styles.cs}>&quot;gs://my-agent-staging-bucket&quot;</span>,{"  "}
                <span className={styles.cc}># ステージング用バケットが必須</span>
              </div>
              <div className={styles.codeLine}>)</div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cc}># ローカルのadk_appオブジェクトをそのままデプロイ</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>remote_app</span> = vertexai.agent_engines.create(
              </div>
              <div className={styles.codeLine}>
                {"  "}
                reasoning_engines.AdkApp(
                <span className={styles.cv}>agent</span>=root_agent,{" "}
                <span className={styles.cv}>enable_tracing</span>=
                <span className={styles.cn}>True</span>),
              </div>
              <div className={styles.codeLine}>)</div>
            </code>
          </pre>
        </div>
        <p>
          Agent Engine にデプロイすると、ADKの <code>InMemorySessionService</code>
          （ローカル開発用、本番運用には不向き）に代わって、Agent Engine
          側のマネージドセッション管理が使われるようになります。
        </p>

        <h3 id="114-デプロイしたエージェントをa2a経由で呼び出す">
          11.4 デプロイしたエージェントをA2A経由で呼び出す
        </h3>
        <p>
          Agent Engine
          にデプロイしたエージェントは、A2Aエンドポイントとしても公開されるため、第10章の{" "}
          <code>RemoteA2aAgent</code> からそのまま呼び出せます。認証には{" "}
          <code>google-credentials</code>（Application Default Credentials）を使うのが定石です。
        </p>
        <div className={styles.codeBlockWrap} data-testid="code-block">
          <div className={styles.codeBlockHeader}>
            <span>python</span>
            <CodeCopyButton text={CODE_TEXT_28} />
          </div>
          <pre className="python">
            <code className="python">
              <div className={styles.codeLine}>
                <span className={styles.ck}>import</span> os
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span> google.adk.agents.remote_a2a_agent{" "}
                <span className={styles.ck}>import</span> RemoteA2aAgent
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>PROJECT_ID</span> = os.getenv(
                <span className={styles.cs}>&quot;GOOGLE_CLOUD_PROJECT&quot;</span>)
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>LOCATION</span> = os.getenv(
                <span className={styles.cs}>&quot;GOOGLE_CLOUD_LOCATION&quot;</span>)
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>REASONING_ENGINE_ID</span> = os.getenv(
                <span className={styles.cs}>&quot;REASONING_ENGINE_ID&quot;</span>)
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>AGENT_ENGINE_RESOURCE</span> ={" "}
                <span className={styles.cs}>
                  {
                    'f"projects/{PROJECT_ID}/locations/{LOCATION}/reasoningEngines/{REASONING_ENGINE_ID}"'
                  }
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>a2a_url</span> ={" "}
                <span className={styles.cs}>
                  {
                    'f"https://{LOCATION}-aiplatform.googleapis.com/v1beta1/{AGENT_ENGINE_RESOURCE}/a2a"'
                  }
                </span>
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>time_agent</span> = RemoteA2aAgent(
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>name</span>=
                <span className={styles.cs}>&quot;time_agent&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>description</span>=
                <span className={styles.cs}>&quot;Agent Engine上で動くA2Aエージェント。&quot;</span>
                ,
              </div>
              <div className={styles.codeLine}>
                {"  "}
                <span className={styles.cv}>agent_card</span>=
                <span className={styles.cs}>{'f"{a2a_url}/v1/card"'}</span>,
              </div>
              <div className={styles.codeLine}>)</div>
            </code>
          </pre>
        </div>
        <blockquote>
          <p>
            <strong>実務上の注意点</strong>: Google Cloud
            の認証トークンは有効期限があるため、長時間動作するプロセスでは <code>httpx.Auth</code>{" "}
            を実装してトークンを自動リフレッシュする仕組みを組み込む必要があります。単純に{" "}
            <code>credentials.refresh()</code>{" "}
            を一度呼ぶだけでは、長時間セッションの途中でトークン期限切れによるエラーが発生します。
          </p>
        </blockquote>

        <h3 id="115-デプロイ先の比較">11.5 デプロイ先の比較</h3>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr className="header">
                <th>デプロイ先</th>
                <th>向いているケース</th>
                <th>言語対応</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>Vertex AI Agent Engine</td>
                <td>マネージドなセッション管理・オートスケール・ADKとの統合を重視する場合</td>
                <td>Python ADKのみ</td>
              </tr>
              <tr className="even">
                <td>Cloud Run</td>
                <td>
                  ステートレス、または外部バックエンド（Cloud
                  SQL/GCS）を使うステートフルなWeb向けエージェント
                </td>
                <td>全言語（コンテナ化できれば何でも）</td>
              </tr>
              <tr className="odd">
                <td>GKE（Google Kubernetes Engine）</td>
                <td>既存のKubernetes運用基盤に統合したい、より高い制御が必要な場合</td>
                <td>全言語</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr />

        <h2 id="12-adk-20-agent-と-workflow-の使い分け">
          12. ADK 2.0: Agent と Workflow の使い分け
        </h2>
        <h3 id="121-なぜ決定論的ワークフローが必要になったのか">
          12.1 なぜ「決定論的ワークフロー」が必要になったのか
        </h3>
        <p>
          自律的なLLMエージェントに、手順が固定されたビジネスプロセス（「ステップAの後は必ずステップB」）を丸ごと任せると、コンテキストが混雑してきたときに手順を飛ばしたり、失敗を無視して先に進んでしまったりすることがあります。100回実行して95回は狙い通りでも、残り5回で逸脱するようでは本番システムとして不十分です。ADK
          2.0 の <code>Workflow</code>{" "}
          は、実行ルーティングを言語モデルの推論から切り離し、コードによる有向グラフとして厳密に制御します。
        </p>

        <h3 id="122-使い分けの判断基準">12.2 使い分けの判断基準</h3>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr className="header">
                <th>状況</th>
                <th>選ぶべきもの</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>ビジネスロジックや実行順序があらかじめ決まっている</td>
                <td>Workflow</td>
              </tr>
              <tr className="even">
                <td>決定論的な実行経路・厳格なコンプライアンス・明確な失敗状態が必要</td>
                <td>Workflow</td>
              </tr>
              <tr className="odd">
                <td>オーケストレーションのトークン消費・レイテンシを最小化したい</td>
                <td>Workflow</td>
              </tr>
              <tr className="even">
                <td>自然言語・複雑なメール・画像など非構造化/曖昧な入力を処理する</td>
                <td>Agent</td>
              </tr>
              <tr className="odd">
                <td>要約・分類・文章生成など主観的判断が要求される</td>
                <td>Agent</td>
              </tr>
              <tr className="even">
                <td>次のアクションが動的な推論に依存し、単純な条件分岐で表現できない</td>
                <td>Agent</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 id="123-効果の実例公開されているベンチマーク">
          12.3 効果の実例（公開されているベンチマーク）
        </h3>
        <p>
          Googleが公開したブログ記事によれば、返金処理という定型業務を例にした場合、LLMループにすべて任せる方式から
          ADK 2.0 の Workflow 方式に切り替えることで、次のような効率化が確認されています（Gemini 3.5
          Flash・モックAPIによる参考値）。
        </p>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr className="header">
                <th>指標</th>
                <th>従来のLLMエージェント</th>
                <th>ADK 2.0 Workflow</th>
                <th>削減率</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd">
                <td>トークン使用量（1回あたり）</td>
                <td>5,152</td>
                <td>2,265</td>
                <td>約50%</td>
              </tr>
              <tr className="even">
                <td>レイテンシ（1回あたり）</td>
                <td>7.2秒</td>
                <td>5.7秒</td>
                <td>約20%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 id="124-workflow-の考え方概念図">12.4 Workflow の考え方（概念図）</h3>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={DIAGRAM_8} theme="base" themeVariables={MERMAID_THEME_VARS} />
        </div>
        <p>
          決定論的なノード（A・C・E）はコードとして高速に遷移し、曖昧な判断が必要なノード（B・D）だけをLLMエージェントに任せます。これにより、①コンテキストの肥大化（大量のAPIレスポンスをそのまま会話履歴に積み上げない）、②プロンプトインジェクションへの耐性（ワークフローのグラフ自体が「実行できる経路」を制限する境界になるため、LLMノードが操作されても未承認のアクションへの経路が存在しない）という2つの効果が得られます。
        </p>
        <p>
          マルチエージェント設計においては、「サブエージェント間の受け渡しの多くをWorkflowの決定論的ノードにできないか」を検討する価値があります。
        </p>

        <hr />

        <h2 id="13-セキュリティガバナンスのベストプラクティス">
          13. セキュリティ・ガバナンスのベストプラクティス
        </h2>
        <h3 id="131-チェックリスト">13.1 チェックリスト</h3>
        <ul className={styles.taskList}>
          <li>
            <label>
              <input type="checkbox" readOnly />
              シークレット（APIキー・トークン）は <code>settings.json</code> や{" "}
              <code>.gemini/agents/*.md</code> に直書きせず、環境変数参照（<code>$ENV_VAR</code>
              ）またはシェルコマンド参照（
              <code>!command</code>）を使っているか
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" readOnly />
              <code>.geminiignore</code> に <code>.env</code>
              、認証情報ファイル、シークレットを含むディレクトリを登録しているか
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" readOnly />
              リモートエージェントの認証には、可能な限り <code>google-credentials</code>
              （ADC）を使い、生の長期トークンをファイルに埋め込んでいないか
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" readOnly />
              サブエージェントごとにポリシーエンジン（<code>policy.toml</code>
              ）で権限を絞っているか（特に <code>run_shell_command</code> や <code>write_file</code>{" "}
              を持つサブエージェント）
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" readOnly />
              リモート依存先が落ちた場合のフェイルセーフ状態（<code>MANUAL_REVIEW</code>{" "}
              等）を設計しているか
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" readOnly />
              決定論的に処理できる箇所をADK 2.0
              Workflowに切り出し、LLMがアクセスできる実行経路を最小化しているか
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" readOnly />
              <code>security.folderTrust.enabled</code>{" "}
              を有効にし、信頼していないディレクトリでの自動承認を防いでいるか
            </label>
          </li>
        </ul>

        <h3 id="132-認証情報の取り扱いに関する注意">13.2 認証情報の取り扱いに関する注意</h3>
        <p>
          第8章・第11章で見た通り、A2Aプロトコルは <code>apiKey</code>・<code>http</code>
          (Bearer/Basic)・<code>google-credentials</code>・<code>oauth</code>{" "}
          という複数の認証方式をサポートしています。プロジェクト共有される設定ファイル（
          <code>.gemini/agents/*.md</code> や <code>settings.json</code>{" "}
          のワークスペーススコープ）はバージョン管理にコミットされがちなので、
          <strong>シークレットの値そのものではなく、参照方法だけを記述する</strong>
          ことを徹底してください。
        </p>

        <hr />

        <h2 id="14-総合ステップバイステップ-ゼロからのマルチエージェント構築フロー">
          14. 総合ステップバイステップ: ゼロからのマルチエージェント構築フロー
        </h2>
        <p>最後に、ここまでの内容を1つの流れとして統合します。</p>
        <ol type="1">
          <li>
            <strong>リポジトリ設計</strong>: ルートに <code>AGENTS.md</code>（または{" "}
            <code>GEMINI.md</code>
            ）を作成し、全体アーキテクチャと各サブエージェントの責務分担を書く。各サブエージェントのディレクトリにその場限りの{" "}
            <code>AGENTS.md</code> を追加する。
          </li>
          <li>
            <strong>除外設定</strong>: <code>.geminiignore</code>{" "}
            でシークレット・大容量データ・生成物ディレクトリを除外する。
          </li>
          <li>
            <strong>CLI設定</strong>: <code>.gemini/settings.json</code> で{" "}
            <code>context.fileName</code>、<code>agents.overrides</code>
            、必要なMCPサーバーを設定する。
          </li>
          <li>
            <strong>ローカルサブエージェント定義</strong>: <code>.gemini/agents/*.md</code>{" "}
            にYAMLフロントマター付きでツール・モデル・実行上限を定義する。
          </li>
          <li>
            <strong>ADKでのエージェント実装</strong>: <code>agent.py</code> に <code>Agent</code> /{" "}
            <code>SequentialAgent</code> / <code>Workflow</code>{" "}
            を組み合わせて実装する。決定論的な部分はWorkflowノードに、曖昧な判断はLLMエージェントに割り振る。
          </li>
          <li>
            <strong>他言語・他チームのサービスをA2A化</strong>: 相手チームのサービスには{" "}
            <code>to_a2a()</code>（または <code>adk api_server --a2a</code>）でAgent
            Cardを自動生成させ、公開する。
          </li>
          <li>
            <strong>リモートエージェントの取り込み</strong>: 自分側では <code>RemoteA2aAgent</code>{" "}
            でAgent Cardを指定し、<code>sub_agents</code> に加えるだけでローカルクラスのように扱う。
          </li>
          <li>
            <strong>ローカルでの動作確認</strong>: <code>uvicorn</code> で公開側を起動し、
            <code>adk web</code> で呼び出し側を起動して、別ポートで対話的にテストする。
          </li>
          <li>
            <strong>本番デプロイ</strong>: <code>adk deploy agent_engine</code> で Vertex AI Agent
            Engine にデプロイし、<code>google-credentials</code> 認証でA2Aエンドポイントを保護する。
          </li>
          <li>
            <strong>継続的な運用</strong>: <code>settings.json</code>{" "}
            のポリシーエンジンとサブエージェント別のオーバーライドで、権限とコストを継続的にチューニングする。
          </li>
        </ol>

        <hr />

        <h2 id="15-参考文献出典">15. 参考文献・出典</h2>
        <p>
          本ガイドは以下の一次情報源（公式ドキュメント・Google公式ブログ・実装者による技術記事）に基づいて2026年7月時点の内容をまとめています。
        </p>
        <div className={styles.refGrid}>
          <div className={styles.refCard}>
            <h3 id="gemini-cli-公式ドキュメント">Gemini CLI 公式ドキュメント</h3>
            <ul>
              <li>
                <Link
                  href="https://geminicli.com/docs/cli/gemini-md/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GEMINI.mdによる文脈提供
                </Link>
              </li>
              <li>
                <Link
                  href="https://geminicli.com/docs/cli/gemini-ignore/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  .geminiignore（除外ファイル）
                </Link>
              </li>
              <li>
                <Link
                  href="https://geminicli.com/docs/cli/settings/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  settings.json 設定リファレンス
                </Link>
              </li>
              <li>
                <Link
                  href="https://geminicli.com/docs/core/subagents/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  サブエージェント
                </Link>
              </li>
              <li>
                <Link
                  href="https://geminicli.com/docs/core/remote-agents/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  リモートサブエージェント（A2A）
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.refCard}>
            <h3 id="google-公式ブログアナウンス">Google 公式ブログ・アナウンス</h3>
            <ul>
              <li>
                <Link
                  href="https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Gemini CLIからAntigravity CLIへの移行について（2026年5月19日）
                </Link>
              </li>
              <li>
                <Link
                  href="https://developers.googleblog.com/why-we-built-adk-20/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ADK 2.0を構築した理由（2026年7月1日）
                </Link>
              </li>
              <li>
                <Link
                  href="https://developers.googleblog.com/build-cross-language-multi-agent-team-with-google-agent-development-kit-and-a2a/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google
                  ADKとA2Aによるクロス言語マルチエージェントチーム構築（2026年6月22日、Shubham
                  Saboo・Eric Dong）
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.refCard}>
            <h3 id="adk-公式ドキュメント--github">ADK 公式ドキュメント / GitHub</h3>
            <ul>
              <li>
                <Link
                  href="https://adk.dev/a2a/quickstart-exposing/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  A2Aクイックスタート（エージェントの公開・to_a2a()）
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/google/adk-python/blob/main/src/google/adk/agents/remote_a2a_agent.py"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  RemoteA2aAgent 実装（ソースコード）
                </Link>
              </li>
              <li>
                <Link
                  href="https://codelabs.developers.google.com/codelabs/create-multi-agents-adk-a2a"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ADKを使ったマルチエージェント構築・Agent Runtimeデプロイ・A2Aプロトコル入門codelab
                </Link>
              </li>
              <li>
                <Link
                  href="https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/use/adk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vertex AI Agent EngineでのADK利用（Google Cloud公式ドキュメント）
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.skills.google/focuses/132170?parent=catalog"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Skills: A2A SDKでリモートエージェントに接続する
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.refCard}>
            <h3 id="agentsmd-オープン標準">AGENTS.md オープン標準</h3>
            <ul>
              <li>
                <Link href="https://agents.md/" target="_blank" rel="noopener noreferrer">
                  AGENTS.md 公式サイト
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/agentsmd/agents.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AGENTS.md GitHubリポジトリ
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.refCard}>
            <h3 id="実装者google-developer-expertによる技術記事">
              実装者・Google Developer Expertによる技術記事
            </h3>
            <ul>
              <li>
                <Link
                  href="https://medium.com/google-cloud/multi-agent-a2a-with-the-agent-development-kitadk-cloud-run-and-gemini-cli-52f8be838ad6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  xbill（Google Developer Expert）によるADK・A2A・Gemini
                  CLIを用いたマルチエージェント実装シリーズ（Cloud Run編）
                </Link>
              </li>
              <li>
                <Link
                  href="https://michael-scherding.medium.com/deploying-ai-agents-with-google-adk-and-vertex-ai-agent-engine-62a5c19396ff"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Michaël Scherding によるADK + Agent Engineデプロイ解説
                </Link>
              </li>
              <li>
                <Link
                  href="https://michael-scherding.medium.com/a2a-explained-with-google-adk-140b35ad04ad"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Michaël Scherding によるA2A + ADK解説
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <blockquote>
          <p>
            免責事項: Gemini CLI / ADK / Agent Engine
            はいずれも活発に開発が続いているプロダクトであり、上記の内容は情報基準日（2026年7月26日）時点のものです。特にGemini
            CLIとAntigravity
            CLIの統合方針は今後変更される可能性があるため、実装前に必ず各公式ドキュメントの最新版を確認してください。
          </p>
        </blockquote>
      </main>

      <TocObserver />
    </div>
  );
}
