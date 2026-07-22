import { registerHrefResolvedObserverTocSuite } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

registerHrefResolvedObserverTocSuite({
  TocObserver,
  linkClassName: styles.navItem,
  activeClassName: styles.active,
});
