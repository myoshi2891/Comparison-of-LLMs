"use client";

import { useEffect, useRef } from "react";

/**
 * legacy/shared/common-header.js:295-329 相当。
 * 2 行のディスクレイマーを描画し、ResizeObserver で高さを
 * --ch-disclaimer-height に同期する。body.has-common-header の
 * margin-top 計算に使われる。
 */
export function DisclaimerBanner() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sync = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--ch-disclaimer-height", `${h}px`);
    };

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(sync);
      ro.observe(el);
      return () => ro.disconnect();
    }

    requestAnimationFrame(sync);
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return (
    <div ref={ref} className="ch-disclaimer" lang="ja">
      <span className="ch-disclaimer-line">
        {
          "\u26A0 本サイトは個人開発の参考用に作成したものです。必ず各社公式ページで最新の料金/仕様をご確認ください。"
        }
      </span>
      <span className="ch-disclaimer-line">
        情報の正確性は保証しません。本サイトの利用による損害等について一切の責任を負いません。
      </span>
    </div>
  );
}
