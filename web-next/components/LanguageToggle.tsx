"use client";

/**
 * JA/EN 言語切替トグル。
 *
 * Client Component 必須の理由:
 * - onClick ハンドラを持つ (React イベントは Client Runtime でしか実行不可)
 * - onToggle コールバック prop は関数なので serializable ではなく、
 *   呼び出し側 (親) も Client Component である必要がある
 *   → Phase 10 で app/page.tsx → <AppShell/> (Client) → <LanguageToggle/>
 *     の構成を想定
 *
 * レガシーとの差分:
 * - type="button" を明示的に追加（submit 誤発火防止、a11y 準拠）
 */

import type { Lang } from "@/lib/i18n";

interface Props {
  lang: Lang;
  onToggle: (lang: Lang) => void;
}

export function LanguageToggle({ lang, onToggle }: Props) {
  return (
    <div className="lang-toggle">
      <button
        type="button"
        className={`lang-btn ja${lang === "ja" ? " active" : ""}`}
        onClick={() => onToggle("ja")}
      >
        JA
      </button>
      <button
        type="button"
        className={`lang-btn en${lang === "en" ? " active" : ""}`}
        onClick={() => onToggle("en")}
      >
        EN
      </button>
    </div>
  );
}
