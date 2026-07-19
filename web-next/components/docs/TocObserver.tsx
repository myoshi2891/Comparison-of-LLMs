"use client";

import { useTocObserver } from "@/lib/useTocObserver";

interface TocObserverProps {
  navLinkClassName: string;
  activeClassName: string;
}

export default function TocObserver({
  navLinkClassName,
  activeClassName,
}: TocObserverProps) {
  useTocObserver({
    chapterSelector: "section",
    tocLinkSelector: `.${navLinkClassName}`,
    activeClassName,
  });

  return null;
}
