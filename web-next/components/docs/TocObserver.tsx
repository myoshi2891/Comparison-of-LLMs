"use client";

import { useTocObserver } from "@/lib/useTocObserver";

interface TocObserverProps {
  navLinkClassName: string;
  activeClassName: string;
  tocSubLinkSelector?: string;
  toggleId?: string;
  sidebarId?: string;
  sidebarOpenClassName?: string;
}

export default function TocObserver({
  navLinkClassName,
  activeClassName,
  tocSubLinkSelector,
  toggleId,
  sidebarId,
  sidebarOpenClassName,
}: TocObserverProps) {
  useTocObserver({
    chapterSelector: "section",
    tocLinkSelector: `.${navLinkClassName}`,
    activeClassName,
    tocSubLinkSelector,
    toggleId,
    sidebarId,
    sidebarOpenClassName,
  });

  return null;
}
