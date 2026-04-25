"use client";

import { usePathname } from "next/navigation";
import { type NavLink, navLinks } from "./nav-links";
import { SiteHeaderClient } from "./SiteHeaderClient";

const GITHUB_URL = "https://github.com/myoshi2891/AI-Model-Cost-Calculator";

/**
 * Next.js App Router + output: 'export' では RSC から pathname を参照できない
 * (usePathname は Client 専用)。Phase A では SiteHeader を Client にし、
 * usePathname() で現在地を取得する。テストは pathname プロップで上書き可能。
 */
function isActivePath(href: string, pathname: string): boolean {
  return href === pathname;
}

function isParentActive(link: NavLink, pathname: string): boolean {
  if (!("children" in link)) return false;
  return link.children.some((c) => isActivePath(c.href, pathname));
}

export function SiteHeader({ pathname: pathnameProp }: { pathname?: string } = {}) {
  const fromHook = usePathname();
  const pathname = pathnameProp ?? fromHook ?? "/";

  return (
    <SiteHeaderClient>
      <nav id="common-header" aria-label="Main Navigation" className="ch-nav">
        <a className="ch-brand" href="/">
          LLM Studies
        </a>
        <button
          type="button"
          className="ch-hamburger"
          aria-controls="ch-menu"
          aria-expanded="false"
          aria-label="Toggle menu"
        >
          <span className="ch-bar" />
          <span className="ch-bar" />
          <span className="ch-bar" />
        </button>
        <ul id="ch-menu" className="ch-links">
          {navLinks.map((link) => {
            if ("children" in link) {
              const parentActive = isParentActive(link, pathname);
              return (
                <li key={link.name} className="ch-dropdown">
                  <button
                    type="button"
                    className={`ch-dropdown-toggle${parentActive ? " ch-active" : ""}`}
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span>{link.name}</span>
                  </button>
                  <ul className="ch-submenu">
                    {link.children.map((c) => {
                      const active = isActivePath(c.href, pathname);
                      return (
                        <li key={c.href}>
                          <a
                            href={c.href}
                            className={active ? "ch-active" : undefined}
                            aria-current={active ? "page" : undefined}
                          >
                            {c.name}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            }
            const active = isActivePath(link.href, pathname);
            return (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={active ? "ch-active" : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  {link.name}
                </a>
              </li>
            );
          })}
          <li>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              {"GitHub \u2197"}
            </a>
          </li>
        </ul>
      </nav>
    </SiteHeaderClient>
  );
}
