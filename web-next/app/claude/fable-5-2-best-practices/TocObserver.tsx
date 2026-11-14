"use client";
import DrawerTocObserver, { type DrawerTocClassNames } from "@/components/docs/DrawerTocObserver";
import styles from "./page.module.css";

// モジュール定数にして参照を固定し、共通側の useEffect を再実行させない。
const CLASS_NAMES: DrawerTocClassNames = {
  main: styles.main,
  open: styles.open,
  active: styles.active,
  checklist: styles.checklist,
  done: styles.done,
};

/** 目次・チェック進捗の処理は共通コンポーネントへ委譲し、ページ固有のIDとクラス名だけを渡す。 */
export default function TocObserver() {
  return <DrawerTocObserver idPrefix="fable52" classNames={CLASS_NAMES} />;
}
