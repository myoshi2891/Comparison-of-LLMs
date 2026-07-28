import { registerClassSelectedObserverTocSuite } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

registerClassSelectedObserverTocSuite({
  TocObserver,
  linkClassName: styles.tocLink,
  activeClassName: styles.active,
  sectionClassName: styles.chapter,
  heroClassName: styles.hero,
});
