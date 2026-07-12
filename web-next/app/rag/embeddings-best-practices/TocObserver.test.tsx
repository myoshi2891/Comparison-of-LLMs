import { registerInlineNavTocSuite } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

registerInlineNavTocSuite({
  TocObserver,
  styles,
  sectionClassName: "chapter",
  toggleId: "ragNavToggle",
  listId: "ragNavList",
});
