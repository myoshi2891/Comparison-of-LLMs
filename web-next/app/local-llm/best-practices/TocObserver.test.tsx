import { registerObserverOnlyTocSuite } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

registerObserverOnlyTocSuite({
  TocObserver,
  styles,
  sectionClassName: "",
});
