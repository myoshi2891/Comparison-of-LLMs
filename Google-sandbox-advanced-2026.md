# Google Sandbox 技術完全リファレンス 2026 — 中上級者向け

> **対象読者**: Googleサンドボックス技術の設計・実装・運用を担う中級〜上級エンジニア
> **最終更新**: 2026-06-12（Google Cloud Next '26 以降の最新 GA 情報を反映）
> **前提知識**: Linux カーネル、Kubernetes CRD、C/C++メモリモデル、BPFの基礎知識

---

## 目次

1. [サンドボックス技術の分類と選定フレームワーク](#1-サンドボックス技術の分類と選定フレームワーク)
2. [GKE Agent Sandbox — CRD階層・Pod Snapshot・Agent Substrate](#2-gke-agent-sandbox)
3. [Gemini Code Execution — Tool API・マルチターン・グラウンディング統合](#3-gemini-code-execution)
4. [gVisor / GKE Sandbox — Platform・Sentry/Gofer・syscall面管理](#4-gvisor--gke-sandbox)
5. [Sandbox2 / SAPI — seccomp-bpf ポリシー設計と Namespace 隔離](#5-sandbox2--sapi)
6. [V8 Sandbox — ポインタ圧縮・間接テーブル・セキュリティ境界](#6-v8-sandbox)
7. [Privacy Sandbox — 廃止経緯と移行戦略](#7-privacy-sandbox--廃止経緯と移行戦略)
8. [クロスカッティング：ゼロトラスト多層防御設計](#8-クロスカッティングゼロトラスト多層防御設計)
9. [パフォーマンス・コスト比較マトリクス](#9-パフォーマンスコスト比較マトリクス)
10. [公式リファレンス一覧](#10-公式リファレンス一覧)

---

## 1. サンドボックス技術の分類と選定フレームワーク

### 1-1. 隔離レイヤーモデル

Googleのサンドボックス技術群は「どのレイヤーで攻撃面を削減するか」という観点で4つの隔離レイヤーに分類できる。

```mermaid
graph TD
    subgraph L4["L4: プロセス内メモリ境界"]
        V8["V8 Sandbox<br/>ポインタ圧縮 + EPT/TPT"]
    end
    subgraph L3["L3: OS syscall境界"]
        S2["Sandbox2 / SAPI<br/>seccomp-bpf + Namespaces"]
    end
    subgraph L2["L2: カーネル境界（ユーザー空間カーネル）"]
        GV["gVisor (runsc)<br/>Sentry + Gofer + systrap/KVM"]
    end
    subgraph L1["L1: マネージドインフラ境界"]
        GAS["GKE Agent Sandbox<br/>CRD + Pod Snapshot + WarmPool"]
        GCE["Gemini Code Execution<br/>Managed Linux Env."]
    end
    L4 --> L3 --> L2 --> L1
    style L1 fill:#e8f5e9
    style L2 fill:#e3f2fd
    style L3 fill:#fff3e0
    style L4 fill:#fce4ec
```

### 1-2. 技術選定マトリクス（上級者用）

| 選定軸 | GKE Agent Sandbox | Gemini Code Execution | gVisor/GKE | Sandbox2/SAPI | V8 Sandbox |
|---|:---:|:---:|:---:|:---:|:---:|
| **カーネル分離** | ◎（gVisor） | ◎（マネージド） | ◎（Sentry） | △（Seccomp） | △（プロセス内） |
| **ステートフル** | ◎（PVC + Snapshot） | ✗ | ○（PVC） | ✗ | N/A |
| **言語非依存** | ◎ | ✗（Python専用） | ◎ | ✗（C/C++専用） | ✗（JS/WASM） |
| **スループット** | 300 sand/sec | API quota依存 | ノード依存 | syscall latency依存 | N/A |
| **コールドスタート** | <1s（WarmPool） | ~数秒 | ~数秒 | μs（fork後） | N/A |
| **GPU/TPU対応** | ◎（gVisor v2）| ✗ | ○（注意点あり） | ✗ | N/A |
| **Kubernetesネイティブ** | ◎（CRD） | ✗ | ◎（RuntimeClass） | ✗ | N/A |
| **インフラ管理コスト** | 中（GKE管理） | 最小 | 中（GKE管理） | 高（自己実装） | 最小（自動） |

---

## 2. GKE Agent Sandbox

> **ステータス**: GA — 2026年5月20日 Google Cloud Next '26 にて発表（KubeCon NA 2025でプレビュー後）
> **APIグループ**: `extensions.agents.x-k8s.io/v1alpha1`

### 2-1. CRD階層の完全解剖

GKE Agent Sandboxは4つのCRDが連携してライフサイクルを管理する。PersistentVolumeClaimと同様のClaimモデルを採用し、リクエスト元（AIフレームワーク）と実装（Pod仕様）を分離する。

```mermaid
graph TB
    subgraph framework["AIフレームワーク層（ADK / LangChain）"]
        SC["SandboxClaim<br/>リソース要求（PVCと同等の抽象）<br/>spec.sandboxTemplateRef: required"]
    end

    subgraph controller["GKE Agent Sandbox Controller"]
        ST["SandboxTemplate<br/>再利用可能なセキュリティ設計図<br/>spec.podTemplate + networkPolicy"]
        SWP["SandboxWarmPool<br/>事前起動プール管理<br/>spec.replicas: N"]
        SB["Sandbox CRD<br/>単一ステートフルPodリソース<br/>shutdownPolicy / shutdownTime"]
    end

    subgraph execution["実行層"]
        POD["gVisor Pod<br/>RuntimeClass: gvisor<br/>cos_containerd"]
        PVC["PersistentVolumeClaim<br/>volumeClaimTemplates"]
    end

    subgraph snapshot["スナップショット層（GCS）"]
        PSSC["PodSnapshotStorageConfig<br/>GCSバケット + パスプレフィックス"]
        PSP["PodSnapshotPolicy<br/>作成タイミング + 保持ポリシー"]
        PSOBJ["PodSnapshot オブジェクト<br/>チェックポイント完了状態"]
    end

    SC -->|"1. TemplateRef参照"| ST
    ST -->|"2. Blueprint展開"| SWP
    SWP -->|"3. 事前起動Pod確保"| POD
    SC -->|"4. Pool Adoptで<1秒割り当て"| SB
    SB -->|"5. Pod管理"| POD
    POD -->|"6. 永続化"| PVC
    PSSC -->|"7. Storage設定"| PSP
    PSP -->|"8. Checkpoint制御"| PSOBJ
    POD -.->|"9. 状態保存"| PSOBJ
    PSOBJ -.->|"10. Restore（コールドスタート解消）"| POD

    style SC fill:#e8eaf6
    style ST fill:#e3f2fd
    style SWP fill:#e8f5e9
    style PSOBJ fill:#fff3e0
```

### 2-2. CRDスペック詳細

#### SandboxTemplate（設計図）

```yaml
apiVersion: extensions.agents.x-k8s.io/v1alpha1
kind: SandboxTemplate
metadata:
  name: python-agent-template
  namespace: agent-ns
spec:
  # NetworkPolicy: Kubernetes NetworkPolicy semantics準拠
  networkPolicy:
    egress:
      - ports:
          - port: 443    # HTTPS のみ許可
            protocol: TCP
      - ports:
          - port: 53     # DNS 許可
            protocol: UDP
    # ingressルールなし = デフォルト拒否
  podTemplate:
    spec:
      runtimeClassName: gvisor            # gVisor必須
      serviceAccountName: agent-sa        # Workload Identity
      automountServiceAccountToken: false # 明示的にfalse
      containers:
      - name: executor
        image: python:3.12-slim
        resources:
          limits:
            cpu: "2"
            memory: "4Gi"
          requests:
            cpu: "500m"
            memory: "1Gi"
        securityContext:
          runAsNonRoot: true
          runAsUser: 65534
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop: ["ALL"]
```

#### SandboxWarmPool（事前起動プール）

```yaml
apiVersion: extensions.agents.x-k8s.io/v1alpha1
kind: SandboxWarmPool
metadata:
  name: python-runtime-warmpool
  namespace: agent-ns
spec:
  replicas: 5                             # 常時5つのwarm Podを維持
  sandboxTemplateRef:
    name: python-agent-template
```

#### SandboxClaim（フレームワークからの要求）

```yaml
apiVersion: extensions.agents.x-k8s.io/v1alpha1
kind: SandboxClaim
metadata:
  name: task-execution-001
  namespace: agent-ns
spec:
  sandboxTemplateRef:
    name: python-agent-template
# → ControllerがWarmPoolから即時割り当て（<1秒）
```

#### Pod Snapshot — PodSnapshotStorageConfig

```yaml
apiVersion: podsnapshot.gke.io/v1
kind: PodSnapshotStorageConfig
metadata:
  name: cpu-pssc-gcs
  namespace: agent-ns
spec:
  gcsPath: gs://my-bucket/snapshots/agent/
---
apiVersion: podsnapshot.gke.io/v1
kind: PodSnapshotPolicy
metadata:
  name: cpu-psp
  namespace: agent-ns
spec:
  storageConfigRef:
    name: cpu-pssc-gcs
  snapshotOnPodReady: true    # Pod Ready時に自動スナップショット
  restoreOnPodCreate: true    # Pod作成時にスナップショットから復元
```

### 2-3. Pod Snapshotの仕組みとコールドスタート削減

gVisorのcheckpoint/restore（CRIU相当）機能を利用し、実行中のPod状態をGCSに永続化する。

```mermaid
sequenceDiagram
    participant Agent as AI Agent
    participant Controller as Sandbox Controller
    participant WarmPool as WarmPool Pod
    participant GCS as GCS Snapshot

    Note over WarmPool: 起動済み・Pythonランタイムロード完了
    Note over WarmPool: PodSnapshotPolicy → GCSに状態保存済み

    Agent->>Controller: SandboxClaim 発行
    Controller->>WarmPool: Pool Adopt（既存Podを割り当て）
    WarmPool-->>Agent: <1秒でサンドボックス提供

    Note over Agent,WarmPool: タスク実行（モデル推論・コード実行）

    Agent->>Controller: タスク完了 → Sandbox解放
    Controller->>GCS: Pod状態チェックポイント保存
    Controller->>WarmPool: Suspendコマンド（アイドルコスト削減）

    Note over Controller: 次のClaimに備えてGCSからRestore
    GCS-->>WarmPool: 状態リストア
    WarmPool->>WarmPool: <1秒でReady状態に復帰
```

### 2-4. Agent Substrate（2026年5月 新発表）

Cloud Next '26 で発表されたエージェントインフラ密度を最大化する新OSS プロジェクト。GKE Agent Sandboxの上位コンポーネントとして位置づけられる。

```mermaid
flowchart LR
    AS["Agent Substrate<br/>（新OSS / 2026-05～）<br/>エージェントインフラ密度最大化"] -->|"基盤として使用"| GAS["GKE Agent Sandbox<br/>（GA）"]
    GAS -->|"基盤として使用"| GV["gVisor<br/>（カーネル分離）"]
    GAS -->|"統合"| PS["Pod Snapshot<br/>（GCS）"]
```

### 2-5. Python SDK による制御

```python
# pip install google-cloud-agent-sandbox
from google.cloud import agent_sandbox_v1

client = agent_sandbox_v1.AgentSandboxClient()

# SandboxClaim経由でサンドボックスを取得
claim = client.create_sandbox_claim(
    parent="projects/{project}/locations/{location}/clusters/{cluster}/namespaces/agent-ns",
    sandbox_claim={
        "sandbox_template_ref": {"name": "python-agent-template"}
    }
)

# サンドボックスが Ready になるまで待機
sandbox = client.wait_for_sandbox(claim.sandbox_ref)

# コード実行
result = sandbox.execute_code(
    code="import numpy as np; print(np.sqrt(2))",
    timeout=30
)
print(result.stdout)

# 解放
client.delete_sandbox_claim(name=claim.name)
```

### 2-6. セキュリティ・本番運用ベストプラクティス

```mermaid
flowchart TD
    BP1["✅ BP1: Workload Identity Federation<br/>Pod単位で最小権限IAMを紐付け<br/>機密情報へのアクセスを限定"] --> BP2
    BP2["✅ BP2: NetworkPolicy default-deny<br/>allowリストで必要なエンドポイントのみ開放<br/>横断攻撃・外部コールバックを防止"] --> BP3
    BP3["✅ BP3: WarmPool + Pod Snapshot併用<br/>WarmPool: 常温Pod確保（<1秒）<br/>Snapshot: アイドルSuspendでコスト削減"] --> BP4
    BP4["✅ BP4: resource.limits 必須設定<br/>ノードリソース枯渇のDoS攻撃を防止"] --> BP5
    BP5["✅ BP5: readOnlyRootFilesystem: true<br/>コンテナ書き込みを/tmpと明示PVCのみに制限"] --> BP6
    BP6["✅ BP6: GPU共有（time-sharing）は使用しない<br/>gVisorはGPU分離が不完全（NVIDIA driver非対応の脆弱性残存）"]
```

---

## 3. Gemini Code Execution

> **ステータス**: GA
> **APIリビジョン**: 2026-05-20（Interactions API 統合版）

### 3-1. Tool APIとしてのCode Executionの設計原則

Gemini Code Execution は「ツール」として提供される。モデルが自律的にコード生成→実行→結果確認のイテレーションを行うReActパターンを実装する。

```mermaid
sequenceDiagram
    participant App as アプリケーション
    participant API as Gemini API
    participant Model as Geminiモデル（推論）
    participant Sandbox as マネージドサンドボックス<br/>（マネージドLinux環境）

    App->>API: POST /v1beta/interactions<br/>tools: [{type: "code_execution"}]
    API->>Model: ツール有効化状態でプロンプト転送

    loop ReAct ループ（モデルが自律判断）
        Model->>Model: 問題分析・Pythonコード生成
        Model->>Sandbox: executableCode ブロック送信
        Sandbox->>Sandbox: 安全な環境で実行（最大30秒）
        Sandbox-->>Model: codeExecutionResult ブロック返却
        Model->>Model: 結果を評価・次のステップを判断
    end

    Model-->>API: 最終的なテキスト回答
    API-->>App: content[]: text + executableCode + codeExecutionResult
```

### 3-2. レスポンス構造の詳細解析

```python
from google import genai
from google.genai.types import Tool, ToolCodeExecution, GenerateContentConfig

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash",  # 推奨モデル（2026年6月時点）
    contents="データセット[1,4,9,16,25]の標準偏差と平均を求め、正規化せよ",
    config=GenerateContentConfig(
        tools=[Tool(code_execution=ToolCodeExecution())],
        temperature=0,      # 再現性確保
    )
)

# レスポンスの content[] は複数ブロックで構成される
for part in response.candidates[0].content.parts:
    if part.text:
        print(f"[TEXT] {part.text}")
    if part.executable_code:
        print(f"[CODE] language={part.executable_code.language}")
        print(part.executable_code.code)
    if part.code_execution_result:
        print(f"[RESULT] outcome={part.code_execution_result.outcome}")
        print(part.code_execution_result.output)
```

**レスポンス構造:**

| パートタイプ | フィールド | 説明 |
|---|---|---|
| `text` | `part.text` | モデルの説明テキスト |
| `executable_code` | `part.executable_code.code` | 生成されたPythonコード |
| `executable_code` | `part.executable_code.language` | 常に`PYTHON` |
| `code_execution_result` | `part.code_execution_result.outcome` | `OUTCOME_OK` / `OUTCOME_FAILED` / `OUTCOME_DEADLINE_EXCEEDED` |
| `code_execution_result` | `part.code_execution_result.output` | stdout + stderr |

### 3-3. 主要な制約事項と設計上の対策

| 制約 | 技術的背景 | 設計上の対策 |
|---|---|---|
| **タイムアウト 30秒** | マネージド環境のリソース保護 | 処理をチャンク分割し、複数ターンで連続実行 |
| **ファイルI/O 不可** | サンドボックス境界ポリシー | データはプロンプト内にインライン埋め込み、または Function Calling でファイル取得APIを実装 |
| **外部ネットワーク不可** | マネージド環境のネットワーク隔離 | Function Calling との組み合わせで外部API呼び出しを実装 |
| **Python専用** | マネージドランタイムの制約 | 他言語実行が必要な場合は GKE Agent Sandbox を採用 |
| **ステートレス** | マルチテナント隔離の要件 | マルチターン会話履歴でコンテキスト継続 |

### 3-4. Function Calling との組み合わせパターン

Code Execution（計算・分析）と Function Calling（外部I/O）を組み合わせることで、I/O制約を克服する。

```mermaid
flowchart LR
    subgraph compute["計算・分析（Code Execution）"]
        CE["Python実行<br/>数値計算・データ分析<br/>可視化コード生成"]
    end
    subgraph io["外部I/O（Function Calling）"]
        FC["カスタム関数<br/>ファイル読み込み<br/>DB問い合わせ<br/>外部API呼び出し"]
    end
    subgraph grounding["事実確認（Grounding）"]
        GS["Google Search<br/>最新情報取得<br/>ハルシネーション抑制"]
    end
    Model["Geminiモデル"] --> compute
    Model --> io
    Model --> grounding
    compute & io & grounding --> Model
```

```python
# Function Calling + Code Execution の統合例
from google import genai
from google.genai import types

def load_csv_data(filepath: str) -> str:
    """CSVファイルを読み込んでJSON文字列で返す"""
    import pandas as pd
    return pd.read_csv(filepath).to_json()

tools = [
    types.Tool(code_execution=types.ToolCodeExecution()),
    types.Tool(function_declarations=[
        types.FunctionDeclaration(
            name="load_csv_data",
            description="ローカルCSVファイルを読み込む",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={"filepath": types.Schema(type=types.Type.STRING)},
                required=["filepath"]
            )
        )
    ])
]
```

### 3-5. Vertex AI 統合ベストプラクティス

```mermaid
flowchart TD
    ENV{"実行環境"} -->|"プロトタイプ・個人開発"| AI_STUDIO
    ENV -->|"エンタープライズ・本番"| VERTEX

    AI_STUDIO["Google AI Studio / ai.google.dev<br/>APIキー認証<br/>無料枠あり・レート制限低"]
    VERTEX["Vertex AI / Gemini Enterprise Agent Platform<br/>OAuth 2.0 / Workload Identity<br/>SLA・VPC-SC・CMEK対応"]

    VERTEX -->|"本番推奨設定"| BP1["モデルピン留め<br/>gemini-2.5-flash (安定版)<br/>Previewモデルは本番禁止"]
    BP1 --> BP2["リトライ設計<br/>指数バックオフ<br/>OUTCOME_DEADLINE_EXCEEDED対応"]
    BP2 --> BP3["コスト管理<br/>max_output_tokens 上限設定<br/>Usage Meter でトークン追跡"]
```

---

## 4. gVisor / GKE Sandbox

> **ステータス**: GA（GKE Agent Sandboxの基盤技術）
> **デフォルトPlatform**: systrap（2023年6月以降）

### 4-1. gVisor の3コンポーネントアーキテクチャ

```mermaid
graph TB
    subgraph app["アプリケーション（コンテナ）"]
        APP_THREAD["アプリスレッド<br/>user-space 実行"]
    end

    subgraph gvisor["gVisor ランタイム（runsc）"]
        subgraph sentry["Sentry（Goで実装）"]
            PLATFORM["Platform Interface<br/>systrap / KVM / ptrace"]
            FAKE_KERNEL["Linux API 再実装<br/>~260 syscalls (AMD64)<br/>scheduler / vfs / net"]
            SECCOMP_SENTRY["Sentry 自身への seccomp フィルタ<br/>ホストへの最小限syscallのみ許可"]
        end

        subgraph gofer["Gofer（I/Oプロキシ）"]
            P9["9P / Lisafs プロトコル<br/>ファイルシステム仲介"]
            DIRECTFS["Directfs モード<br/>（高スループット要件時）"]
        end
    end

    subgraph host["ホストOS"]
        HK["Linuxカーネル<br/>（最小限の実syscall）"]
        HOST_FS["ホストファイルシステム"]
    end

    APP_THREAD -->|"1. syscall 発行"| PLATFORM
    PLATFORM -->|"2. systrap/KVM でSentryへ転送"| FAKE_KERNEL
    FAKE_KERNEL -->|"3. ファイル操作"| P9
    P9 <-->|"4. IPC (socket/pipe)"| HOST_FS
    FAKE_KERNEL -->|"5. 許可syscallのみ"| SECCOMP_SENTRY
    SECCOMP_SENTRY -->|"6. 最小限syscall"| HK

    style PLATFORM fill:#bbdefb
    style SECCOMP_SENTRY fill:#ffcdd2
    style P9 fill:#ffe0b2
```

### 4-2. Platformバックエンドの選定

| Platform | 動作原理 | 本番推奨度 | 適合環境 | syscall オーバーヘッド |
|---|---|---|---|---|
| **systrap** | seccomp trap → SIGSYS シグナルでSentryへ | ✅ **デフォルト・推奨** | VM内・ベアメタル両対応 | 中（getpid: ~800ns） |
| **KVM** | KVM仮想化でSentryがGuest OS/VMMを兼任 | ✅ ベアメタルで最速 | ベアメタルのみ（ネストVM不可） | 低（getpid: ~200ns） |
| **ptrace** | PTRACE_SYSEMU でsyscall傍受 | ❌ 非推奨・廃止予定 | デバッグ用途のみ | 最大（getpid: ~7ms） |

**Platformの選択フロー:**

```mermaid
flowchart TD
    Q1{"実行環境は？"} -->|"ベアメタル"| Q2
    Q1 -->|"GCE VM / GKE"| SYSTRAP["systrap<br/>（デフォルト設定で最適）"]

    Q2{"ネストVMが利用可能か？<br/>(/dev/kvm が存在するか？)"} -->|"Yes"| KVM_CHOICE["KVM Platform<br/>--platform=kvm<br/>最高パフォーマンス"]
    Q2 -->|"No"| SYSTRAP

    KVM_CHOICE --> KVM_NOTE["⚠️ ARM CPUは未サポート<br/>一部クラウド環境では利用不可"]
    SYSTRAP --> SYSTRAP_NOTE["✅ GKEのデフォルト<br/>gVisor v20231102以降"]
```

**runsc での Platform 指定（containerd config）:**

```toml
# /etc/containerd/config.toml
[plugins."io.containerd.runtime.v1.linux"]
  shim_debug = true

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runsc]
  runtime_type = "io.containerd.runsc.v1"

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runsc.options]
  TypeUrl = "io.containerd.runsc.v1.options"
  ConfigPath = "/etc/containerd/runsc.toml"
```

```toml
# /etc/containerd/runsc.toml
[runsc_config]
  platform = "systrap"        # または "kvm"
  file-access = "shared"      # Directfs有効化
  directfs = true             # ファイルシステムアクセスの高速化
  overlay = false
```

### 4-3. Sentry が実装する syscall の範囲

gVisor が実装する syscall はAMD64で約260個。以下に重要なカテゴリと実装状況を示す。

| カテゴリ | 主要 syscall | 実装状況 | 注意点 |
|---|---|---|---|
| **プロセス管理** | `fork`, `execve`, `exit`, `wait4` | ✅ 完全実装 | — |
| **ファイルI/O** | `read`, `write`, `open`, `close` | ✅ Gofer経由 | Directfs で高速化可 |
| **ネットワーク** | `socket`, `connect`, `send`, `recv` | ✅ 独自TCPスタック | パフォーマンス注意 |
| **メモリ管理** | `mmap`, `mprotect`, `brk` | ✅ 完全実装 | — |
| **シグナル** | `kill`, `sigaction`, `sigprocmask` | ✅ 完全実装 | — |
| **eBPF** | `bpf` | ❌ **未実装** | eBPF依存ツール使用不可 |
| **io_uring** | `io_uring_setup` | 部分実装 | 非推奨、要検証 |
| **Docker-in-Docker** | `clone(CLONE_NEWNS)` | ❌ **非対応** | ネストコンテナ実行不可 |
| **高度な ioctl** | 一部の`ioctl` | 部分実装 | デバイス固有 ioctl は要確認 |

### 4-4. セキュリティモデルの技術的詳細

```mermaid
graph LR
    subgraph attack_scenario["攻撃シナリオ"]
        RCE["RCE脆弱性<br/>（AIコード内に存在）"]
    end

    subgraph native["通常コンテナの場合"]
        NC["コンテナ → ホストカーネル<br/>直接アクセス可能"]
        NC --> PWNED["ホストOS侵害 🔴"]
    end

    subgraph gvisor_case["gVisorコンテナの場合"]
        GV_ESCAPE["コンテナ → Sentry到達"]
        SENTRY_BUG["Sentryに脆弱性が必要<br/>（攻撃対象面を大幅縮小）"]
        GV_ESCAPE --> SENTRY_BUG --> CONTAINED["ホストOS保護 🟢<br/>（Sentry自身はseccompで制限済み）"]
    end

    RCE --> NC
    RCE --> GV_ESCAPE
```

**重要な制約:**
- gVisor は **すべてのカーネル脆弱性を防ぐわけではない**（特にNVIDIA GPUドライバー脆弱性は対象外）
- Kata Containers（VMベース）より隔離強度は弱いが、軽量で起動が速い
- セキュリティ目標: Linuxカーネルへの直接接触面を最小化

---

## 5. Sandbox2 / SAPI

> **ステータス**: GA（OSS）
> **リポジトリ**: `github.com/google/sandboxed-api`

### 5-1. Sandbox2 のコンポーネントモデル

```mermaid
graph TB
    subgraph trusted["信頼済みプロセス（Executor）"]
        HOST_CODE["Host Code<br/>（メインアプリ）"]
        POLICY_BUILDER["PolicyBuilder<br/>seccomp-bpf ポリシー構築"]
        IPC_LAYER["IPC Layer<br/>TLV / FD渡し / credential"]
        EXECUTOR["Sandbox Executor<br/>（Tracerプロセス）"]
        MONITOR["Transactions API<br/>クラッシュ自動リスタート"]
    end

    subgraph sandbox_env["サンドボックス環境（Sandboxee）"]
        SANDBOXEE["Sandboxee<br/>（信頼されないC/C++コード）"]
        subgraph policy["適用済みポリシー"]
            SECCOMP["seccomp-bpf フィルタ<br/>syscall allow-list"]
            NS_IPC["IPC Namespace"]
            NS_NET["Network Namespace<br/>（デフォルト分離）"]
            NS_MOUNT["Mount Namespace<br/>（カスタムFS view）"]
            NS_PID["PID Namespace"]
            NS_USER["User Namespace"]
            NS_UTS["UTS Namespace"]
        end
    end

    HOST_CODE -->|"Sandboxee起動"| EXECUTOR
    EXECUTOR -->|"ポリシー適用"| POLICY_BUILDER
    POLICY_BUILDER -->|"seccomp_bpf プログラムインストール"| SANDBOXEE
    HOST_CODE <-->|"データ交換"| IPC_LAYER
    IPC_LAYER <-->|"TLV/FD"| SANDBOXEE
    SANDBOXEE -->|"syscall発行"| SECCOMP
    SECCOMP -->|"ポリシー違反 → SIGKILL"| MONITOR
    MONITOR -->|"自動リスタート"| HOST_CODE

    style SECCOMP fill:#ffcdd2
    style SANDBOXEE fill:#fff3e0
```

### 5-2. seccomp-bpf ポリシー設計の詳細

PolicyBuilderは3層のsyscallフィルタリングを提供する。

| PolicyBuilder メソッド | フィルタレベル | 用途 |
|---|---|---|
| `AllowSystemMalloc()` | 高レベル | メモリ確保系 syscall を一括許可 |
| `AllowRead()` / `AllowWrite()` | 中レベル | 読み書き系 syscall |
| `AllowSyscall(nr)` | 低レベル | 特定 syscall 番号を許可 |
| `AddPolicyOnSyscall(nr, bpf)` | 生 BPF | syscall + 引数レベルのフィルタ |
| `AddPolicyOnSyscalls(nrs, bpf)` | 生 BPF | 複数 syscall に同じルール適用 |
| `BlockSyscallsWithErrno(nrs, err)` | ブロック | 指定syscallをエラー返却で無害化 |

**PolicyBuilder による段階的ポリシー設計（C++）:**

```cpp
#include "sandboxed_api/sandbox2/policybuilder.h"

auto policy = sandbox2::PolicyBuilder()
    // === Level 1: 最小限の実行基盤 ===
    .AllowSystemMalloc()          // malloc/free (brk, mmap, munmap)
    .AllowRead()                  // read, pread, readv
    .AllowWrite()                 // write, pwrite, writev
    .AllowExit()                  // exit, exit_group
    .AllowStat()                  // stat, fstat, lstat

    // === Level 2: 対象ライブラリの要件 ===
    .AllowSyscall(__NR_futex)     // スレッド同期（マルチスレッドライブラリ）
    .AllowSyscall(__NR_clock_gettime) // タイムスタンプ取得

    // === Level 3: 引数レベルの精密制御 ===
    // read は fd=0（stdin）のみ許可
    .AddPolicyOnSyscall(__NR_read, {
        ARG_32(0),                // fd引数を検査
        JEQ32(0, ALLOW),         // fd==0 (stdin) なら許可
        KILL_PROCESS,             // それ以外は強制終了
    })

    // open は /tmp/safe_dir/ 以下のみ許可
    // （引数はポインタなのでpath-based allowlistは別途実装）

    // === Level 4: 危険な syscall を明示的ブロック ===
    .BlockSyscallsWithErrno({
        __NR_ptrace,              // デバッガ接続禁止
        __NR_process_vm_readv,   // 他プロセスメモリ読み取り禁止
        __NR_process_vm_writev,  // 他プロセスメモリ書き込み禁止
    }, EPERM)

    .BuildOrDie();
```

### 5-3. Namespace 構成と分離強度

```mermaid
graph TB
    subgraph host_view["ホストの見え方"]
        HOST_PID["PID 1234 (Executor)<br/>PID 1235 (Sandboxee)"]
        HOST_NET["eth0: 192.168.1.1"]
        HOST_FS["/ (ルートFS全体)"]
    end

    subgraph sandbox_view["Sandboxee の見え方"]
        SBX_PID["PID 1 (自分のみ)<br/>PID Namespace分離"]
        SBX_NET["lo: 127.0.0.1 のみ<br/>Network Namespace分離<br/>（AllowUnrestrictedNetworking()で解除可）"]
        SBX_FS["/tmp, /lib, /usr/lib のみ<br/>Mount Namespace + chroot<br/>Mapfile()で許可パス追加"]
        SBX_UTS["hostname: sandbox-xxx<br/>UTS Namespace分離"]
    end

    HOST_PID -.->|"Namespace分離"| SBX_PID
    HOST_NET -.->|"Network Namespace"| SBX_NET
    HOST_FS -.->|"Mount Namespace"| SBX_FS
```

### 5-4. SAPI: 「一度書いたらどこでも」パターン

SAPI は Sandbox2 をラップし、C/C++ライブラリをRPC経由で呼び出す抽象化レイヤーを自動生成する。

```mermaid
sequenceDiagram
    participant HC as Host Code
    participant STUB as SAPI Stub（自動生成）
    participant SAPI_LIB as SAPI Library
    participant SANDBOXEE as Sandboxee（ライブラリ本体）

    HC->>STUB: zlib_sapi.deflate(&stream, Z_SYNC_FLUSH)
    STUB->>STUB: 引数をシリアライズ（SAPI Types）
    STUB->>SAPI_LIB: RPC over Unix Socket
    SAPI_LIB->>SANDBOXEE: 実際の deflate() 呼び出し
    SANDBOXEE->>SANDBOXEE: zlib処理実行（sandboxed）
    SANDBOXEE-->>SAPI_LIB: 戻り値・出力バッファ
    SAPI_LIB-->>STUB: RPC 応答
    STUB-->>HC: 戻り値（デシリアライズ済み）
```

**Transactions API によるクラッシュ自動リスタート（C++）:**

```cpp
#include "sandboxed_api/transaction.h"

class ZlibTransaction : public sapi::Transaction {
 public:
  ZlibTransaction() : sapi::Transaction(std::make_unique<ZlibSandbox>()) {}

  absl::Status Run() override {
    SAPI_ASSIGN_OR_RETURN(int result, api_.deflate(&stream_, Z_SYNC_FLUSH));
    return absl::OkStatus();
  }
};

// クラッシュ時も自動リスタートされる
ZlibTransaction txn;
auto status = txn.Run();
// ポリシー違反 → Sandboxee が終了 → 次回Run()で自動リスタート
```

---

## 6. V8 Sandbox

> **ステータス**: 開発継続中（Chrome に段階的統合。Bug Bounty の対象セキュリティ境界）
> **設計ドキュメント**: `chromium.googlesource.com/v8/v8.git/+/refs/heads/main/src/sandbox/README.md`

### 6-1. V8 Sandbox が解決する問題の技術的背景

2021〜2023年のChromeゼロデイのうち60%がV8起因。V8の脆弱性の特徴は、UAF/OOBのような「古典的メモリ破壊」ではなく、JIT最適化の型混乱（Type Confusion）やロジックバグであり、メモリセーフ言語やMTE/CFIだけでは緩和が困難。

```mermaid
graph LR
    subgraph v8_vuln["V8 脆弱性の特徴"]
        TC["型混乱（Type Confusion）<br/>JIT最適化時の型推測失敗"]
        LOGIC["ロジックバグ<br/>JIT仮定の違反"]
        OOB_SUBTLE["微妙なOOB<br/>サンドボックス内で強力な<br/>Read/Write Primitiveを構築"]
    end

    subgraph mitigation["従来の緩和策では不十分"]
        RUST["Memory Safe 言語<br/>（V8はC++で記述）"]
        MTE["MTE / CFI<br/>（ハードウェア支援）"]
        RUST -.->|"V8のJITロジックバグは防げない"| LIMIT["❌"]
        MTE -.->|"Primitive構築には対応困難"| LIMIT
    end

    subgraph solution["V8 Sandbox の解決策"]
        ISOLATE["ヒープメモリをサンドボックス内に封じ込め<br/>ポインタ圧縮 + 間接テーブル"]
        ISOLATE --> CONTAIN["メモリ破壊がV8ヒープ外に<br/>伝播しない設計"]
    end

    v8_vuln --> mitigation
    v8_vuln --> solution
```

### 6-2. V8 Sandbox のメモリレイアウト

```mermaid
graph TB
    subgraph process["Chrome Rendererプロセスの仮想アドレス空間（64bit）"]
        subgraph sandbox["V8 Sandbox 領域（最大1TB / 連続仮想アドレス）"]
            JS_HEAP["JavaScript Heap<br/>全JSオブジェクトはここに存在"]
            COMPRESSED_PTR["ポインタ圧縮ポインタ（32bit）<br/>= sandbox_base + 32bit_offset<br/>最大4GBの参照範囲"]
            GUARD_L["Guard Region (Left)<br/>境界保護"]
            GUARD_R["Guard Region (Right)<br/>境界保護"]
        end

        subgraph tables["サンドボックス外テーブル（改ざん保護済み）"]
            EPT["ExternalPointerTable (EPT)<br/>外部ポインタの間接テーブル<br/>（C関数ポインタ・DOM参照等）"]
            TPT["TrustedPointerTable (TPT)<br/>信頼済みオブジェクトの間接テーブル<br/>（Bytecode・JITメタデータ）"]
            JSDT["JSDispatchTable (JSDT)<br/>JS関数ディスパッチテーブル<br/>（JITコードのエントリポイント）"]
        end

        subgraph trusted_heap["Trusted Heap（サンドボックス外）"]
            BYTECODE["Bytecodeコンテナ"]
            JIT_META["JITコードメタデータ"]
        end
    end

    COMPRESSED_PTR -->|"外部参照はEPTインデックス経由"| EPT
    COMPRESSED_PTR -->|"信頼済みオブジェクトはTPTインデックス経由"| TPT
    JS_HEAP -->|"JS関数呼び出しはJSDTインデックス経由"| JSDT
    TPT -->|"実際のポインタ解決"| BYTECODE
    JSDT -->|"実際のエントリポイント解決"| JIT_META

    style GUARD_L fill:#ffcdd2
    style GUARD_R fill:#ffcdd2
    style JS_HEAP fill:#e3f2fd
    style EPT fill:#e8f5e9
    style TPT fill:#e8f5e9
    style JSDT fill:#e8f5e9
```

### 6-3. 3種類の間接テーブル（Pointer Table）の役割

| テーブル | 保護対象 | なぜ必要か | インデックスサイズ |
|---|---|---|---|
| **ExternalPointerTable (EPT)** | V8ヒープ外へのポインタ（C関数ポインタ、ArrayBuffer backing store等） | 攻撃者がヒープ内のポインタを改ざんしても、EPTを経由するため任意アドレスへのジャンプが不可能 | 32bit |
| **TrustedPointerTable (TPT)** | Bytecodeコンテナ・JITコードメタデータ（信頼済みヒープ上のオブジェクト） | JITコードの実行フロー改ざんを防止 | 32bit |
| **JSDispatchTable (JSDT)** | JS関数のディスパッチエントリポイント | 関数ポインタの改ざんによるRCEを防止 | 32bit |

**ポインタ圧縮の仕組み:**

```
// 攻撃前（通常の64bitポインタ）
uint64_t* evil_ptr = (uint64_t*)0xdeadbeef00000000; // 任意アドレスへ到達可能

// V8 Sandbox のポインタ圧縮後
// sandbox_base = 0x7f0000000000  (連続1TB仮想アドレスの先頭)
// compressed_ptr = 0x00001234    (32bitオフセット)
// 実際のアドレス = sandbox_base + compressed_ptr
//               = 0x7f0000001234  (サンドボックス内に限定)
// → 攻撃者がcompressed_ptrを最大値0xFFFFFFFFに改ざんしても
//   sandbox_base + 0xFFFFFFFF = 0x7f00ffffffff (まだサンドボックス内)
```

### 6-4. セキュリティ境界とスコープ

V8 Sandboxが守るもの・守らないものを明確に理解することが重要。

```mermaid
graph LR
    subgraph in_scope["V8 Sandbox が防ぐ攻撃"]
        A1["V8ヒープの型混乱による<br/>プロセスメモリへの任意R/W"]
        A2["外部ポインタ改ざんによる<br/>任意コード実行（EPTで防御）"]
        A3["JITコードポインタ改ざん<br/>（JSDT/TPTで防御）"]
    end

    subgraph out_of_scope["V8 Sandbox のスコープ外<br/>（Chromeの多層防御が担当）"]
        B1["Sentry/Gofer/OS レベルのバグ<br/>→ OS Sandboxが担当"]
        B2["Renderer全体からのサンドボックス逃脱<br/>→ Chrome Site Isolation が担当"]
        B3["ネットワーク経由の脅威<br/>→ Network Snadbox が担当"]
    end
```

### 6-5. 開発者・セキュリティチーム向けアクションアイテム

| 役割 | 推奨アクション | 根拠 |
|---|---|---|
| **Chrome/Node.js 組み込みエンジニア** | V8ビルド時 `v8_enable_sandbox=true` を設定 | デフォルトは一部環境でfalse |
| **セキュリティ研究者** | V8 Sandboxのバイパスを発見した場合はChrome VRPへ報告（対象境界として認定済み） | Bug Bounty対象 |
| **エンタープライズセキュリティ** | Chrome Enterprise ポリシーで自動更新を強制（V8ゼロデイの迅速パッチ適用） | 2025年に8件のV8 CVEが野外悪用 |
| **Node.js でのサンドボックス実装** | `isolated-vm` パッケージ（V8 Isolate ベース）を使用し、各テナントに独立Isolateを割り当て | V8 Sandboxは同一プロセス内複数Isolate間の境界も提供 |

---

## 7. Privacy Sandbox — 廃止経緯と移行戦略

> ⛔ **ステータス**: **2025年10月17日 Google が全APIを正式廃止**

### 7-1. タイムライン

```mermaid
timeline
    title Privacy Sandbox 終焉の軌跡
    2019 : Google が Privacy Sandbox 構想発表
         : サードパーティCookieの段階廃止計画
    2022 : 廃止期限を2023年に延期
    2024年7月 : 完全廃止 → ユーザー選択モデルへ方針転換
    2025年4月 : 新規プロンプト展開を中止
             : 既存Cookie設定の維持を発表
    2025年10月17日 : Topics API / Protected Audience<br/>Attribution Reporting / Fenced Frames<br/>全APIを正式廃止
    2025年10月以降 : サードパーティCookieはChromeに存続<br/>（ただしSafari/Firefoxは既にブロック）
```

### 7-2. 廃止された主なAPI群と代替戦略

| 廃止されたAPI | 目的 | 2026年時点の代替アプローチ |
|---|---|---|
| **Topics API** | 関心カテゴリベースのターゲティング | ファーストパーティデータ + Customer Match |
| **Protected Audience** | リマーケティング（クロスサイト） | サーバーサイドオーディエンス + Consent Mode |
| **Attribution Reporting** | コンバージョン計測 | サーバーサイドタギング（GTM Server-Side） |
| **Fenced Frames** | 分離されたフレーム広告 | 標準 iframe（Cookie残存のため暫定的に不要） |

### 7-3. 移行アーキテクチャ：ファーストパーティデータ戦略

```mermaid
graph LR
    subgraph collect["ファーストパーティデータ収集"]
        USER_CONSENT["Consent Management Platform<br/>（GDPR/CCPA 準拠）"]
        TAG["GTM Server-Side<br/>ファーストパーティ計測"]
        CRM["CRM / データウェアハウス<br/>（BigQuery）"]
    end

    subgraph activate["データ活用（広告）"]
        CM["Customer Match<br/>（ハッシュ化メールでマッチング）"]
        GA4["Google Analytics 4<br/>モデリングベース計測"]
    end

    subgraph compliance["コンプライアンス"]
        GDPR["GDPR / 各国プライバシー規制<br/>同意管理は引き続き必須"]
    end

    USER_CONSENT -->|"同意取得済みデータ"| CRM
    TAG -->|"イベントデータ"| CRM
    CRM -->|"エクスポート"| CM
    CRM -->|"接続"| GA4
    CM & GA4 --> GDPR
```

---

## 8. クロスカッティング：ゼロトラスト多層防御設計

Google が全サンドボックス技術を組み合わせる際の多層防御アーキテクチャ。

### 8-1. AIエージェント本番システムの参照アーキテクチャ

```mermaid
graph TB
    subgraph external["外部からの入力"]
        USER["ユーザーリクエスト"]
        LLM_OUTPUT["LLM生成コード<br/>（信頼しない）"]
    end

    subgraph perimeter["境界防御層"]
        WAF["Cloud Armor / WAF<br/>L7 フィルタリング"]
        IAP["Identity-Aware Proxy<br/>認証・認可"]
    end

    subgraph control_plane["コントロールプレーン"]
        ADK["Agent Framework<br/>（ADK / LangChain）"]
        GAS_CTRL["GKE Agent Sandbox Controller<br/>SandboxClaim 処理"]
    end

    subgraph execution_plane["実行プレーン（強分離）"]
        GVISOR_POD["gVisor Pod<br/>（SandboxTemplate適用）<br/>runAsNonRoot: true<br/>readOnlyRootFilesystem: true"]
        NETPOL["Network Policy<br/>default-deny + allowlist"]
    end

    subgraph identity["IDと権限管理"]
        WIF["Workload Identity Federation<br/>Pod単位のIAM権限"]
        GSM["Google Secret Manager<br/>シークレット管理"]
    end

    subgraph observability["可視化・監視"]
        GCC["Cloud Logging<br/>全syscallイベント記録"]
        SCC["Security Command Center<br/>異常検知・脅威インテリジェンス"]
    end

    USER --> WAF --> IAP --> ADK
    LLM_OUTPUT --> ADK
    ADK -->|"SandboxClaim"| GAS_CTRL
    GAS_CTRL -->|"Pod割り当て"| GVISOR_POD
    GVISOR_POD <--> NETPOL
    GVISOR_POD <-->|"Workload Identity"| WIF
    WIF --> GSM
    GVISOR_POD -->|"ログ出力"| GCC
    GCC --> SCC

    style GVISOR_POD fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style NETPOL fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    style WIF fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
```

### 8-2. ISOLATE / RESTRICT / ACCELERATE の3原則

```mermaid
flowchart LR
    subgraph isolate["🔒 ISOLATE（封じ込め）"]
        I1["GKE Agent Sandbox (gVisor)<br/>信頼できないコードをカーネル分離"]
    end

    subgraph restrict["🚫 RESTRICT（最小権限）"]
        R1["Workload Identity Federation<br/>最小権限IAM"]
        R2["GKE Network Policy<br/>default-deny + allowlist"]
    end

    subgraph accelerate["⚡ ACCELERATE（性能維持）"]
        A1["SandboxWarmPool<br/>事前起動でコールドスタート解消"]
        A2["Pod Snapshot<br/>アイドルsuspendでコスト削減"]
    end

    isolate --> restrict --> accelerate
```

---

## 9. パフォーマンス・コスト比較マトリクス

### 9-1. コールドスタートレイテンシ比較

| 技術 | コールドスタート | WarmPool/最適化後 | 備考 |
|---|---|---|---|
| GKE Agent Sandbox (WarmPool) | ~数秒（新Pod） | **<1秒** | Pod Snapshot + WarmPool |
| GKE Agent Sandbox (Snapshot) | <1秒（GCSリストア） | <1秒 | GPU: Driver version一致が必要 |
| gVisor/GKE Sandbox（単体） | ~2〜5秒 | ~2〜5秒 | WarmPool未使用時 |
| Gemini Code Execution | ~1〜3秒（API往復） | ~1〜3秒 | マネージド、チューン不可 |
| Sandbox2/SAPI | μs（fork後） | μs | 起動は最速クラス |

### 9-2. syscall オーバーヘッド（gVisor Platform比較）

| Platform | getpid() レイテンシ | 実用的影響 | 推奨場面 |
|---|---|---|---|
| Native（参考値） | ~4ns | — | サンドボックスなし |
| **systrap（推奨）** | **~800ns** | CPU-bound: <3%、I/O-heavy: 10〜30% | GKE / VM環境デフォルト |
| KVM | ~200ns | CPU-bound: <1% | ベアメタルのみ |
| ptrace（廃止予定） | ~7ms | 実用不可（x350遅延） | デバッグのみ |

### 9-3. 技術別コスト構造

```mermaid
graph LR
    subgraph opex["運用コスト（OpEx）"]
        GAS_COST["GKE Agent Sandbox<br/>GKEノード + Sandbox管理 + GCS Snapshot"]
        GCE_COST["Gemini Code Execution<br/>API従量課金（トークン＋実行）"]
        GV_COST["gVisor単体<br/>GKEノード（+10〜30%のCPUオーバーヘッド）"]
        S2_COST["Sandbox2/SAPI<br/>OSS無料（自社サーバーコストのみ）"]
    end
    subgraph capex["開発コスト（CapEx）"]
        GAS_DEV["GKE Agent Sandbox<br/>低（CRD + Python SDK）"]
        GCE_DEV["Gemini Code Execution<br/>最低（API 1行）"]
        GV_DEV["gVisor単体<br/>中（RuntimeClass + securityContext）"]
        S2_DEV["Sandbox2/SAPI<br/>高（C++実装 + Policy設計）"]
    end
```

---

## 10. 公式リファレンス一覧

### GKE Agent Sandbox

| ドキュメント種別 | URL |
|---|---|
| **GA発表ブログ（2026/05/20）** | https://cloud.google.com/blog/products/containers-kubernetes/bringing-you-agent-sandbox-on-gke-and-agent-substrate |
| コンセプトドキュメント | https://cloud.google.com/kubernetes-engine/docs/concepts/machine-learning/agent-sandbox |
| セットアップガイド | https://cloud.google.com/kubernetes-engine/docs/how-to/how-install-agent-sandbox |
| Agent Sandbox Code Isolationガイド | https://cloud.google.com/kubernetes-engine/docs/how-to/agent-sandbox |
| **CRD リファレンス** | https://cloud.google.com/kubernetes-engine/docs/reference/crds/agentsandbox |
| Pod Snapshot ハウツー | https://cloud.google.com/kubernetes-engine/docs/how-to/agent-sandbox-pod-snapshots |
| Google Codelabs: AI Agents on GKE | https://codelabs.developers.google.com/codelabs/gke/ai-agents-on-gke |
| InfoQ: Cloud Next '26 レポート | https://www.infoq.com/news/2026/05/gke-agent-sandbox-hypercluster/ |

### Gemini Code Execution

| ドキュメント種別 | URL |
|---|---|
| **API リファレンス（generateContent）** | https://ai.google.dev/gemini-api/docs/code-execution |
| Interactions API リファレンス | https://ai.google.dev/gemini-api/docs/interactions/code-execution |
| Vertex AI / Enterprise Agent Platform | https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/tools/code-execution |
| Function Calling ガイド | https://ai.google.dev/gemini-api/docs/interactions/function-calling |

### gVisor / GKE Sandbox

| ドキュメント種別 | URL |
|---|---|
| **GKE Sandbox 公式ドキュメント** | https://cloud.google.com/kubernetes-engine/docs/concepts/sandbox-pods |
| gVisor Platform ガイド | https://gvisor.dev/docs/architecture_guide/platforms/ |
| gVisor Performance ガイド | https://gvisor.dev/docs/architecture_guide/performance/ |
| **Systrap リリースブログ（2023）** | https://gvisor.dev/blog/2023/04/28/systrap-release/ |
| gVisor Production ガイド | https://gvisor.dev/docs/user_guide/production/ |

### Sandbox2 / SAPI

| ドキュメント種別 | URL |
|---|---|
| **Code Sandboxing 概要** | https://developers.google.com/code-sandboxing |
| **Sandbox2 設計解説** | https://developers.google.com/code-sandboxing/sandbox2/explained |
| SAPI 解説 | https://developers.google.com/code-sandboxing/sandboxed-api/explained |
| SAPI Getting Started | https://developers.google.com/code-sandboxing/sandboxed-api/getting-started |
| GitHub リポジトリ | https://github.com/google/sandboxed-api |

### V8 Sandbox

| ドキュメント種別 | URL |
|---|---|
| **V8 Sandbox 設計ブログ** | https://v8.dev/blog/sandbox |
| **ソースREADME（設計詳細）** | https://chromium.googlesource.com/v8/v8.git/+/refs/heads/main/src/sandbox/README.md |
| MoreVMs 2025 学術論文 | https://2025.programming-conference.org/details/MoreVMs-2025-papers/3/The-V8-Sandbox |

### Privacy Sandbox（廃止済み・歴史的記録）

| ドキュメント種別 | URL |
|---|---|
| 廃止発表の分析（2026年3月） | https://segwise.ai/blog/google-privacy-sandbox-shutdown-reason |
| 廃止経緯（2026年2月） | https://usercentrics.com/knowledge-hub/what-is-google-privacy-sandbox/ |
| Wikipedia（廃止タイムライン） | https://en.wikipedia.org/wiki/Privacy_Sandbox |

---

*本ドキュメントは 2026年6月12日時点の Google 公式情報・発表に基づいています。*
*各技術は急速に進化しており、最新情報は公式ドキュメントを参照してください。*
