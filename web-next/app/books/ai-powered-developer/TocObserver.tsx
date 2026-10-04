"use client";

import BookTocObserver from "@/components/docs/BookTocObserver";
import styles from "./page.module.css";

const MOBILE_BREAKPOINT = 980;
const CLASS_NAMES = {
  main: styles.main,
  navA: styles.navA,
  open: styles.open,
  active: styles.active,
  done: styles.done,
};

/** 原本のブレークポイントと CSS Modules クラス名を共有の目次制御へ渡す。 */
export default function TocObserver() {
  return <BookTocObserver classNames={CLASS_NAMES} mobileBreakpoint={MOBILE_BREAKPOINT} />;
}
