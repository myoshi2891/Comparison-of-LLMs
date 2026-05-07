"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type StepData = {
  step: number;
  title: string;
  desc: string;
  tag: string;
  tagStyle: string;
  codeNode: React.ReactNode;
  tip: string;
};

/* ---- pre-rendered code blocks (JSX spans, no unsafe HTML injection) ---- */

function Code1() {
  return (
    <div className={styles.codeWrap}>
      <div className={styles.codeBar}>
        <span>shell</span>
        <span className={styles.codeLang}>BASH</span>
      </div>
      <div className={styles.codeBody}>
        <span className={styles.cc}>{"# グローバルスコープ（全プロジェクトで使える）"}</span>
        {"\n"}
        <span className={styles.ck}>{"mkdir"}</span>
        {" -p ~/.agents/skills/my-first-skill\n\n"}
        <span className={styles.cc}>{"# ワークスペーススコープ（このプロジェクトのみ）"}</span>
        {"\n"}
        <span className={styles.ck}>{"mkdir"}</span>
        {" -p .gemini/skills/my-first-skill\n\n"}
        <span className={styles.cc}>{"# ディレクトリに移動"}</span>
        {"\n"}
        <span className={styles.ck}>{"cd"}</span>
        {" ~/.agents/skills/my-first-skill"}
      </div>
    </div>
  );
}

function Code2() {
  return (
    <div className={styles.codeWrap}>
      <div className={styles.codeBar}>
        <span>{"SKILL.md (front matter)"}</span>
        <span className={styles.codeLang}>YAML</span>
      </div>
      <div className={styles.codeBody}>
        <span className={styles.cs}>{"---"}</span>
        {"\n"}
        <span className={styles.cc}>{"# スキルの一意な識別子（ケバブケース）"}</span>
        {"\n"}
        <span className={styles.cm}>{"name"}</span>
        {": "}
        <span className={styles.cv}>{"my-first-skill"}</span>
        {"\n\n"}
        <span className={styles.cc}>{"# 【最重要】いつ・どんな言葉で呼ばれるかを明記"}</span>
        {"\n"}
        <span className={styles.cm}>{"description"}</span>
        {": "}
        <span className={styles.cv}>{"|"}</span>
        {"\n"}
        {"  "}
        <span className={styles.cv}>{"初めてのスキルテスト用。"}</span>
        {"\n"}
        {"  "}
        <span className={styles.cv}>{"「テスト」「hello」「最初のスキル」が出たら使うこと。"}</span>
        {"\n"}
        <span className={styles.cs}>{"---"}</span>
      </div>
    </div>
  );
}

function Code3() {
  return (
    <div className={styles.codeWrap}>
      <div className={styles.codeBar}>
        <span>{"SKILL.md (body)"}</span>
        <span className={styles.codeLang}>MARKDOWN</span>
      </div>
      <div className={styles.codeBody}>
        <span className={styles.ch}>{"# My First Skill"}</span>
        {"\n\n"}
        <span className={styles.ch}>{"## Overview"}</span>
        {"\n"}
        {"このスキルは初学者向けのサンプルスキルです。\n"}
        {"挨拶メッセージを生成する方法を示します。\n\n"}
        <span className={styles.ch}>{"## Step-by-Step Guide"}</span>
        {"\n"}
        {"1. ユーザーの名前を確認する（不明な場合は質問する）\n"}
        {"2. 日本語で丁寧な挨拶文を生成する\n"}
        {"3. スキルが正常に動作したことを確認する\n\n"}
        <span className={styles.ch}>{"## Examples"}</span>
        {"\n"}
        <span className={styles.cw}>{"**Input**"}</span>
        {": 「田中さんに挨拶して」\n"}
        <span className={styles.cw}>{"**Output**"}</span>
        {": 「田中さん、こんにちは！本日もよろしくお願いします。」\n\n"}
        <span className={styles.ch}>{"## Rules"}</span>
        {"\n"}
        <span className={styles.ce}>{"❌ 行わないこと:"}</span>
        {"\n"}
        {"- ユーザーの名前を勝手に推測すること\n\n"}
        <span className={styles.cg}>{"✅ 必ず行うこと:"}</span>
        {"\n"}
        {"- 敬語を使った丁寧な表現を選ぶ"}
      </div>
    </div>
  );
}

function Code4() {
  return (
    <div className={styles.codeWrap}>
      <div className={styles.codeBar}>
        <span>shell</span>
        <span className={styles.codeLang}>BASH</span>
      </div>
      <div className={styles.codeBody}>
        <span className={styles.cc}>{"# Gemini CLI でスキル一覧を確認"}</span>
        {"\n"}
        <span className={styles.ck}>{"gemini"}</span>
        {" skills list\n\n"}
        <span className={styles.cc}>{"# 期待される出力例:"}</span>
        {"\n"}
        <span className={styles.cc}>{"# ✅ my-first-skill     - 初めてのスキルテスト用"}</span>
        {"\n"}
        <span className={styles.cc}>{"# ✅ git-commit-formatter - コミットメッセージを整形"}</span>
        {"\n"}
        <span className={styles.cc}>{"# ..."}</span>
        {"\n\n"}
        <span className={styles.cc}>{"# 実際にテスト"}</span>
        {"\n"}
        <span className={styles.ck}>{"gemini"}</span>
        {' "テスト！最初のスキルを呼び出して"'}
      </div>
    </div>
  );
}

function Code5() {
  return (
    <div className={styles.codeWrap}>
      <div className={styles.codeBar}>
        <span>shell</span>
        <span className={styles.codeLang}>BASH</span>
      </div>
      <div className={styles.codeBody}>
        <span className={styles.cc}>{"# スクリプトを追加して決定論的な処理を強制"}</span>
        {"\n"}
        <span className={styles.ck}>{"mkdir"}</span>
        {" scripts references\n\n"}
        <span className={styles.cc}>{"# スクリプト例: バリデーション"}</span>
        {"\n"}
        <span className={styles.ck}>{"cat"}</span>
        {" > scripts/validate.py << "}
        <span className={styles.cs}>{"'EOF'"}</span>
        {"\n"}
        <span className={styles.ck}>{"import"}</span>
        {" sys\n"}
        <span className={styles.cc}>{"# 入力を検証して決定論的な結果を返す"}</span>
        {"\n"}
        <span className={styles.ck}>{"print"}</span>
        {"("}
        <span className={styles.cs}>{'"✅ バリデーション成功"'}</span>
        {")\n"}
        <span className={styles.cs}>{"EOF"}</span>
        {"\n\n"}
        <span className={styles.cc}>{"# 参照ドキュメントを追加"}</span>
        {"\n"}
        <span className={styles.ck}>{"cat"}</span>
        {" > references/guidelines.md << "}
        <span className={styles.cs}>{"'EOF'"}</span>
        {"\n"}
        <span className={styles.ch}>{"# コーディングガイドライン"}</span>
        {"\n"}
        {"- PEP8 準拠\n"}
        {"- 型アノテーション必須\n"}
        <span className={styles.cs}>{"EOF"}</span>
      </div>
    </div>
  );
}

const VIZ_CONFIGS = [
  { bg: "#e0f2fe", border: "#7dd3fc", icon: "📁", label: "ディレクトリ作成完了！" },
  { bg: "#fef3c7", border: "#fcd34d", icon: "📝", label: "YAMLフロントマター完成！" },
  { bg: "#d1fae5", border: "#6ee7b7", icon: "✍️", label: "指示本文完成！" },
  { bg: "#ede9fe", border: "#c4b5fd", icon: "🔍", label: "スキル認識確認中..." },
  { bg: "#ffe4e6", border: "#fda4af", icon: "🚀", label: "スキル進化中！" },
] as const;

function StepViz({ step }: { step: number }) {
  const cfg = VIZ_CONFIGS[step - 1];
  return (
    <div className={styles.stepViz} style={{ background: cfg.bg, borderColor: cfg.border }}>
      <div style={{ fontSize: "1.875rem", marginBottom: "0.5rem" }}>{cfg.icon}</div>
      <div style={{ fontWeight: 700, color: "#334155", fontSize: "0.875rem" }}>{cfg.label}</div>
    </div>
  );
}

const STEPS_DATA: StepData[] = [
  {
    step: 1,
    title: "ディレクトリを作成する",
    desc: "スキルを格納するディレクトリを作成します。スキル名と一致させることが重要です。グローバル用なら ~/.agents/skills/、プロジェクト専用なら .gemini/skills/ 配下に作成します。",
    tag: "セットアップ",
    tagStyle: styles.badgeSky,
    codeNode: <Code1 />,
    tip: "💡 ディレクトリ名 = スキルのname フィールドと完全一致させること！",
  },
  {
    step: 2,
    title: "YAMLフロントマターを記述する",
    desc: "SKILL.md ファイルを作成し、まず --- で囲んだ YAML メタデータを書きます。name（識別子）と description（トリガー条件）が最重要です。description はエージェントが「いつこのスキルを使うか」を判断するための発動スイッチです。",
    tag: "メタデータ",
    tagStyle: styles.badgeAmber,
    codeNode: <Code2 />,
    tip: "💡 description に具体的なキーワードを入れると、AIが確実に呼び出してくれます。",
  },
  {
    step: 3,
    title: "マークダウン本文を書く",
    desc: "YAML フロントマターの下に、エージェントへの指示をマークダウン形式で記述します。Overview（概要）→ Step-by-Step（手順）→ Rules（制約）の順で書くのが推奨パターンです。",
    tag: "指示本文",
    tagStyle: styles.badgeGreen,
    codeNode: <Code3 />,
    tip: "💡 Rules セクションに ❌（禁止事項）と ✅（推奨事項）を明記するとエージェントが迷いません。",
  },
  {
    step: 4,
    title: "スキルを検証する",
    desc: "作成したスキルがツールに認識されているか確認します。Gemini CLI では gemini skills list コマンドでリストを確認できます。自分のスキルが一覧に表示されれば成功です！",
    tag: "検証",
    tagStyle: styles.badgeViolet,
    codeNode: <Code4 />,
    tip: "💡 スキルが表示されない場合は name フィールドとディレクトリ名が一致しているか確認してください。",
  },
  {
    step: 5,
    title: "スキルを進化させる",
    desc: "基本スキルが動いたら、scripts/ ディレクトリにPythonやBashスクリプトを追加して「決定論的な処理」を加えましょう。また references/ に参照ドキュメントを追加することで、エージェントに専門知識を動的に与えられます。",
    tag: "発展",
    tagStyle: styles.badgeRose,
    codeNode: <Code5 />,
    tip: "💡 スクリプトを使うと、AIの「推測」を排除して確実に正確な結果を得られます。",
  },
];

export default function StepsApp() {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStep = STEPS_DATA[activeStep - 1];

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (activeStep === STEPS_DATA.length) {
          setActiveStep(1);
          setIsPlaying(false);
        } else {
          setActiveStep((prev) => prev + 1);
        }
      }, 2000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, activeStep]);

  return (
    <div className={styles.stepsGrid} style={{ marginTop: "0.5rem" }}>
      {/* 左: ステップ一覧 */}
      <div>
        <h3
          style={{
            marginTop: 0,
            marginBottom: "1rem",
            color: "#0f766e",
            fontSize: "1.25rem",
            fontWeight: 600,
          }}
        >
          ステップ一覧
        </h3>
        <div className={styles.stepList}>
          {STEPS_DATA.map((s) => {
            const isActive = activeStep === s.step;
            return (
              <button
                key={s.step}
                type="button"
                className={`${styles.stepItem}${isActive ? ` ${styles.stepItemActive}` : ""}`}
                style={{ cursor: "pointer", width: "100%", textAlign: "left" }}
                onClick={() => {
                  setActiveStep(s.step);
                  setIsPlaying(false);
                }}
              >
                <div className={styles.stepItemHeader}>
                  <div
                    className={`${styles.stepBadge}${isActive ? ` ${styles.stepBadgeActive}` : ""}`}
                  >
                    {s.step}
                  </div>
                  <div>
                    <div
                      className={styles.stepTitle}
                      style={isActive ? { color: "#065f46" } : undefined}
                    >
                      {s.title}
                    </div>
                    <span className={`${styles.stepTag} ${s.tagStyle}`}>{s.tag}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 右: 詳細 */}
      <div>
        <div className={styles.stepDetail}>
          <div className={styles.stepDetailHeader}>
            <div className={`${styles.stepBadge} ${styles.stepBadgeActive}`}>
              {currentStep.step}
            </div>
            <h3
              style={{
                margin: 0,
                color: "#0f766e",
                fontSize: "1.125rem",
                fontWeight: 700,
              }}
            >
              {currentStep.title}
            </h3>
          </div>
          <p className={styles.stepDesc}>{currentStep.desc}</p>
          <div className={styles.stepTip}>{currentStep.tip}</div>
        </div>

        <StepViz step={activeStep} />

        <div style={{ marginTop: "1rem" }}>{currentStep.codeNode}</div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          <button
            type="button"
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.75rem",
              fontWeight: 600,
              color: "#ffffff",
              background: "linear-gradient(135deg,#10b981,#059669)",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              opacity: isPlaying ? 0.5 : 1,
            }}
            onClick={() => setIsPlaying(true)}
            disabled={isPlaying}
          >
            ▶ Play
          </button>
          <button
            type="button"
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.75rem",
              fontWeight: 600,
              color: "#ffffff",
              background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              opacity: activeStep === 1 ? 0.5 : 1,
            }}
            onClick={() => {
              setActiveStep((s) => Math.max(1, s - 1));
              setIsPlaying(false);
            }}
            disabled={activeStep === 1}
          >
            ◀ Prev
          </button>
          <button
            type="button"
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.75rem",
              fontWeight: 600,
              color: "#ffffff",
              background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              opacity: activeStep === STEPS_DATA.length ? 0.5 : 1,
            }}
            onClick={() => {
              setActiveStep((s) => Math.min(STEPS_DATA.length, s + 1));
              setIsPlaying(false);
            }}
            disabled={activeStep === STEPS_DATA.length}
          >
            Next ▶
          </button>
          <button
            type="button"
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.75rem",
              fontWeight: 600,
              color: "#334155",
              background: "#ffffff",
              border: "2px solid #e2e8f0",
              cursor: "pointer",
              fontSize: "0.875rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
            onClick={() => {
              setActiveStep(1);
              setIsPlaying(false);
            }}
          >
            ↺ Reset
          </button>
        </div>
      </div>
    </div>
  );
}
