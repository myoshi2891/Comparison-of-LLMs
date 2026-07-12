import { registerInlineNavTocSuite } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

registerInlineNavTocSuite({
  TocObserver,
  styles,
  sectionClassName: "adkSection",
  toggleId: "adkNavToggle",
  listId: "adkNavList",
});
