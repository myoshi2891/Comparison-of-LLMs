"use client";

import { useState } from "react";
import styles from "./page.module.css";

type CheckItem = {
  id: number;
  cat: string;
  text: string;
  tip: string;
};

const CAT_STYLES: Record<string, string> = {
  作成: styles.badgeSky,
  品質: styles.badgeGreen,
  テスト: styles.badgeAmber,
  運用: styles.badgeViolet,
};

const CHECK_ITEMS: CheckItem[] = [
  {
    id: 1,
    cat: "作成",
    text: "name はハイフン区切りの英語小文字になっているか",
    tip: "例: git-commit-formatter ✅　GIT_Commit ❌",
  },
  {
    id: 2,
    cat: "作成",
    text: "name とディレクトリ名が完全一致しているか",
    tip: "不一致だとエージェントがスキルを発見できない",
  },
  {
    id: 3,
    cat: "作成",
    text: "description にトリガーとなるキーワードが含まれているか",
    tip: "「〜が出たら必ず使うこと」のような明示的な指示を入れる",
  },
  {
    id: 4,
    cat: "品質",
    text: "SKILL.md 本文は 500 行以内に収まっているか",
    tip: "長すぎるとコンテキストを圧迫する。大きな参照は references/ に分離",
  },
  {
    id: 5,
    cat: "品質",
    text: "大きな参照ファイルは references/ に分離しているか",
    tip: "本文中から参照するだけで、必要時だけ読み込まれる",
  },
  {
    id: 6,
    cat: "品質",
    text: "スクリプトは引数で動作を変えられる設計になっているか",
    tip: "ハードコードされた値は再利用性を下げる",
  },
  {
    id: 7,
    cat: "品質",
    text: "DB削除など危険な操作は disable-model-invocation: true を設定しているか",
    tip: "true にすると手動 /skill-name コマンドでのみ呼び出せる安全モードになる",
  },
  {
    id: 8,
    cat: "テスト",
    text: "gemini skills list でスキルが表示されるか確認したか",
    tip: "表示されない場合はパスやnameの確認を",
  },
  {
    id: 9,
    cat: "テスト",
    text: "実際にエージェントに呼び出されるかテストしたか",
    tip: "descriptionのキーワードを含むプロンプトで動作確認",
  },
  {
    id: 10,
    cat: "テスト",
    text: "/plan（Plan Mode）でスキルが安全に動作するか確認したか（v0.29.0〜）",
    tip: "/plan はread-only環境。スキルが本番コードを誤変更しないことを事前確認できる",
  },
  {
    id: 11,
    cat: "品質",
    text: "skill-creator メタスキルでスキル品質チェックを受けたか（v0.26.0〜）",
    tip: "「このスキルを改善して」と頼むとskill-creatorが自動レビューしてくれる",
  },
  {
    id: 12,
    cat: "運用",
    text: "アクティブなスキルは 15 個以内に抑えているか",
    tip: "多すぎるとAIが混乱し精度が低下する",
  },
  {
    id: 13,
    cat: "運用",
    text: "使わなくなったスキルは無効化・削除しているか",
    tip: "/skills disable コマンドで無効化できる",
  },
];

const TOTAL = CHECK_ITEMS.length;

/**
 * Checklist UI component that tracks completed items and displays progress.
 *
 * Renders a list of checklist items with toggleable completion states, a progress bar showing the percentage complete, and a success message when all items are completed.
 *
 * @returns The React element for the checklist and progress interface.
 */
export default function ChecklistApp() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / TOTAL) * 100);

  const toggle = (id: number) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div>
      {/* Progress */}
      <div className={styles.checkProgress}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <span style={{ fontWeight: 700, color: "#334155", fontSize: "0.875rem" }}>完了度</span>
          <span
            style={{
              fontWeight: 700,
              fontSize: "1.125rem",
              color: pct === 100 ? "#059669" : "#0284c7",
            }}
          >
            {pct}%
          </span>
        </div>
        <div
          className={styles.checkProgressBar}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="チェックリスト完了率"
        >
          <div
            className={styles.checkProgressFill}
            style={{
              width: `${pct}%`,
              background: pct === 100 ? "#10b981" : "#38bdf8",
            }}
          />
        </div>
        <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
          {done} / {TOTAL} 項目完了
        </div>
        {pct === 100 && (
          <div
            style={{ marginTop: "0.5rem", color: "#059669", fontWeight: 700, fontSize: "0.875rem" }}
          >
            🎉 すべてのチェックが完了しました！スキルをリリースできます。
          </div>
        )}
      </div>

      {/* Checklist items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {CHECK_ITEMS.map((item) => {
          const isChecked = Boolean(checked[item.id]);
          return (
            <button
              key={item.id}
              type="button"
              className={styles.checkItem}
              style={{
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                background: isChecked ? "#f0fdf4" : "#ffffff",
                borderColor: isChecked ? "#86efac" : "#e2e8f0",
              }}
              onClick={() => toggle(item.id)}
              aria-pressed={isChecked}
            >
              <div
                className={styles.checkCircle}
                style={isChecked ? { background: "#10b981", borderColor: "#10b981" } : undefined}
              >
                {isChecked && (
                  <span style={{ color: "#ffffff", fontSize: "0.75rem", fontWeight: 700 }}>✓</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span className={`${styles.badge} ${CAT_STYLES[item.cat]}`}>{item.cat}</span>
                  <span
                    className={styles.checkText}
                    style={
                      isChecked ? { color: "#065f46", textDecoration: "line-through" } : undefined
                    }
                  >
                    {item.text}
                  </span>
                </div>
                <div className={styles.checkTip}>{item.tip}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
