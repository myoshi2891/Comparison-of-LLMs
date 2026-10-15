"use client";

import ChecklistTocObserver from "@/components/docs/ChecklistTocObserver";
import styles from "./page.module.css";

const MOBILE_BREAKPOINT = 980;
const CLASS_NAMES = {
  open: styles.open,
  show: styles.show,
  active: styles.active,
  done: styles.done,
};

/** 原本のブレークポイント・チェックリスト ID・カウンタ書式を共有の目次制御へ渡す。 */
export default function TocObserver() {
  return (
    <ChecklistTocObserver
      classNames={CLASS_NAMES}
      mobileBreakpoint={MOBILE_BREAKPOINT}
      checklistId="checklistItems"
      counterId="ckCounter"
      counterSeparator=" / "
    />
  );
}
