import { registerNavScopedHrefTocSuite } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

registerNavScopedHrefTocSuite({
  TocObserver,
  navClassName: styles.tocNav,
  activeClassName: styles.tocLinkActive,
});
