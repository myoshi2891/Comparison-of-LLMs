import { registerBasicObserverTocSuite } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

registerBasicObserverTocSuite({
  TocObserver,
  activeClassName: styles.active,
  navClassName: styles.navList,
  sectionClassName: styles.section,
});
