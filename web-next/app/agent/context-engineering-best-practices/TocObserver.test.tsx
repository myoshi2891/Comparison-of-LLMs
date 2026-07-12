import { registerSidebarTocSuite } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

registerSidebarTocSuite({
  TocObserver,
  styles,
  toggleId: "sidebarToggle",
});
