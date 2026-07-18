export const MERMAID_THEME = "dark" as const;

export const DIAGRAMS: Record<string, string> = {
  diagram1: `flowchart TD
A["国際原則 OECD AI原則 と G7広島AIプロセス"]:::purple --> B["EU AI Act EU"]:::teal
A --> C["NIST AI RMF 米国"]:::teal
A --> D["AI事業者ガイドライン 日本"]:::teal
A --> H["ISO IEC 42001 国際認証規格"]:::teal
B --> E["組織内AIガバナンス体制"]:::coral
C --> E
D --> E
H --> E
E --> F["継続的なモニタリングと改善"]:::pink

classDef purple fill:#453482,stroke:#c9bdf0,color:#efeaff;
classDef teal fill:#1c5652,stroke:#a9e8e0,color:#e3fbf7;
classDef coral fill:#7d4535,stroke:#f0c3ab,color:#ffece3;
classDef pink fill:#7d3560,stroke:#f0bdd9,color:#ffe6f4;`,
  diagram2: `flowchart TD
START["AIシステムの用途 意図された目的を確認"]:::gray --> Q1{"第5条の禁止行為に該当するか"}:::gray
Q1 -->|"該当する"| PROHIBITED["禁止 unacceptable risk 市場投入不可"]:::red
Q1 -->|"該当しない"| Q2{"附属書3の高リスク用途に該当するか"}:::gray
Q2 -->|"該当する"| HIGH["高リスク 適合性評価と技術文書が必須"]:::amber
Q2 -->|"該当しない"| Q3{"チャットボットや生成コンテンツなど透明性義務の対象か"}:::gray
Q3 -->|"該当する"| LIMITED["限定リスク AIであることの開示が必須"]:::teal
Q3 -->|"該当しない"| MINIMAL["最小リスク 義務的要件なし"]:::green

classDef gray fill:#262d3d,stroke:#c7cfe0,color:#eef1f8;
classDef red fill:#66201f,stroke:#f0a9a9,color:#ffe9e9;
classDef amber fill:#664d1e,stroke:#f0d4a9,color:#fff3e0;
classDef teal fill:#1c5652,stroke:#a9e8e0,color:#e3fbf7;
classDef green fill:#1c5730,stroke:#a9e8bb,color:#e8fbee;`,
  diagram3: `flowchart TD
S1["Step1 経営層のコミットメントと体制構築"]:::purple --> S2["Step2 AIシステムインベントリの作成"]:::teal
S2 --> S3["Step3 リスク分類とアセスメント"]:::purple
S3 --> S4["Step4 ポリシーと標準の策定"]:::teal
S4 --> S5["Step5 Govern Map Measure Manageの実践"]:::purple
S5 --> S6["Step6 ライフサイクルへのガバナンス組み込み"]:::teal
S6 --> S7["Step7 モニタリングとインシデント対応"]:::purple
S7 --> S8["Step8 監査 認証と継続的改善"]:::teal
S8 -.->|"見直しサイクル"| S3

classDef purple fill:#453482,stroke:#c9bdf0,color:#efeaff;
classDef teal fill:#1c5652,stroke:#a9e8e0,color:#e3fbf7;`,
  diagram4: `flowchart TD
GOV["Govern ガバナンス方針と体制の確立"]:::purple --> MAP["Map コンテキストとリスクの特定"]:::teal
MAP --> MEA["Measure リスクの測定と評価"]:::teal
MEA --> MAN["Manage リスク対応と優先順位付け"]:::coral
MAN --> MAP
MAN --> GOV

classDef purple fill:#453482,stroke:#c9bdf0,color:#efeaff;
classDef teal fill:#1c5652,stroke:#a9e8e0,color:#e3fbf7;
classDef coral fill:#7d4535,stroke:#f0c3ab,color:#ffece3;`,
  diagram5: `flowchart LR
P1["企画 要件定義"]:::coral --> P2["データ収集 前処理"]:::pink
P2 --> P3["モデル開発 学習"]:::coral
P3 --> P4["評価 検証"]:::pink
P4 --> P5["デプロイ 本番運用開始"]:::coral
P5 --> P6["運用監視 モニタリング"]:::pink
P6 --> P7["廃止 再学習の判断"]:::coral
P7 -.->|"再企画"| P1

classDef coral fill:#7d4535,stroke:#f0c3ab,color:#ffece3;
classDef pink fill:#7d3560,stroke:#f0bdd9,color:#ffe6f4;`,
};
