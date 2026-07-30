"use client";

import { useTocObserver } from "@/lib/useTocObserver";

interface TocObserverProps {
  navLinkClassName: string;
  activeClassName: string;
  chapterSelector?: string;
  tocSubLinkSelector?: string;
  toggleId?: string;
  sidebarId?: string;
  sidebarOpenClassName?: string;
}

/**
 * Observes document sections and updates the table of contents to reflect the active section.
 *
 * @param navLinkClassName - CSS class used to identify table-of-contents links.
 * @param activeClassName - CSS class applied to the active table-of-contents link.
 * @param chapterSelector - Optional selector for observed document chapters/sections.
 * @param tocSubLinkSelector - Optional selector for table-of-contents sub-links.
 * @param toggleId - Optional identifier for the sidebar toggle element.
 * @param sidebarId - Optional identifier for the sidebar element.
 * @param sidebarOpenClassName - Optional CSS class indicating that the sidebar is open.
 */
export default function TocObserver({
  navLinkClassName,
  activeClassName,
  chapterSelector = "header[id], section",
  tocSubLinkSelector,
  toggleId,
  sidebarId,
  sidebarOpenClassName,
}: TocObserverProps) {
  useTocObserver({
    chapterSelector,
    tocLinkSelector: `.${navLinkClassName}`,
    activeClassName,
    tocSubLinkSelector,
    toggleId,
    sidebarId,
    sidebarOpenClassName,
  });

  return null;
}
