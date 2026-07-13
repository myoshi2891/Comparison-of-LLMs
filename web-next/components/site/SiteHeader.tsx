"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavLeaf, type NavLink, type NavNode, type NavSubGroup, navLinks } from "./nav-links";
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

/**
 * F-4' 以降ナビは最大 3 段（グループ → カテゴリ → ページ）になったため、
 * active 判定も再帰させる。祖先まで波及させないと、現在地が畳まれたメニューの
 * 中に埋もれてどのグループにいるのか分からなくなる。
 */
function isNodeActive(node: NavNode, pathname: string): boolean {
  if (isNavLeaf(node)) return isActivePath(node.href, pathname);
  return node.children.some((leaf) => isActivePath(leaf.href, pathname));
}

function isParentActive(link: NavLink, pathname: string): boolean {
  if (isNavLeaf(link)) return false;
  return link.children.some((child) => isNodeActive(child, pathname));
}

/** リーフ 1 件分の <li><Link>。1 段目・2 段目・3 段目で共通。 */
function NavLeafItem({ href, name, pathname }: { href: string; name: string; pathname: string }) {
  const active = isActivePath(href, pathname);
  return (
    <li key={href}>
      <Link
        href={href}
        className={active ? "ch-active" : undefined}
        aria-current={active ? "page" : undefined}
      >
        {name}
      </Link>
    </li>
  );
}

/** 2 段目のサブドロップダウン（Providers ▸ Claude など）。 */
function NavSubDropdown({ group, pathname }: { group: NavSubGroup; pathname: string }) {
  const active = isNodeActive(group, pathname);
  return (
    <li className="ch-subdropdown">
      <button
        type="button"
        className={`ch-subdropdown-toggle${active ? " ch-active" : ""}`}
        aria-expanded="false"
        aria-haspopup="true"
      >
        <span>{group.name}</span>
      </button>
      <ul className="ch-subsubmenu">
        {group.children.map((leaf) => (
          <NavLeafItem key={leaf.href} href={leaf.href} name={leaf.name} pathname={pathname} />
        ))}
      </ul>
    </li>
  );
}

/**
 * Render the site header with primary navigation and active-route highlighting.
 *
 * Chooses the current pathname from `pathnameProp` (if provided), otherwise from the router, and falls back to `"/"`. Renders site branding, a hamburger toggle, navigation links (dropdowns for items with children) with active-state classes and `aria-current="page"` for matching routes, and an external GitHub link.
 *
 * @param pathnameProp - Optional pathname to override the router-derived path; when omitted the component uses the router pathname or `"/"` as a fallback.
 * @returns The header element containing site branding, the navigation menu (including dropdowns and active-state handling), and an external GitHub link.
 */
export function SiteHeader({ pathname: pathnameProp }: { pathname?: string } = {}) {
  const fromHook = usePathname();
  const pathname = pathnameProp ?? fromHook ?? "/";

  return (
    <SiteHeaderClient>
      <nav id="common-header" aria-label="Main Navigation" className="ch-nav">
        <Link className="ch-brand" href="/">
          LLM Studies
        </Link>
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
            if (isNavLeaf(link)) {
              return (
                <NavLeafItem
                  key={link.href}
                  href={link.href}
                  name={link.name}
                  pathname={pathname}
                />
              );
            }

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
                  {link.children.map((child) =>
                    isNavLeaf(child) ? (
                      <NavLeafItem
                        key={child.href}
                        href={child.href}
                        name={child.name}
                        pathname={pathname}
                      />
                    ) : (
                      <NavSubDropdown key={child.name} group={child} pathname={pathname} />
                    )
                  )}
                </ul>
              </li>
            );
          })}
          <li>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub\uff08\u65b0\u3057\u3044\u30bf\u30d6\u3067\u958b\u304f\uff09"
            >
              GitHub
              <span aria-hidden="true">{"\u2197"}</span>
            </a>
          </li>
        </ul>
      </nav>
    </SiteHeaderClient>
  );
}
