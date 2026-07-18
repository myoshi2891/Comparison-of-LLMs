"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavLeaf, type NavLink, type NavNode, type NavSubGroup, navLinks } from "./nav-links";
import { SiteHeaderClient } from "./SiteHeaderClient";

const GITHUB_URL = "https://github.com/myoshi2891/AI-Model-Cost-Calculator";

/**
 * Determines whether a navigation link matches the current pathname.
 *
 * @param href - The navigation link pathname
 * @param pathname - The current pathname
 * @returns `true` if the pathnames match exactly, `false` otherwise.
 */
function isActivePath(href: string, pathname: string): boolean {
  return href === pathname;
}

/**
 * Determines whether a navigation node or one of its child routes matches the current pathname.
 *
 * @param node - The navigation node to evaluate
 * @param pathname - The current route pathname
 * @returns `true` if the node or a child route matches `pathname`, `false` otherwise.
 */
function isNodeActive(node: NavNode, pathname: string): boolean {
  if (isNavLeaf(node)) return isActivePath(node.href, pathname);
  return node.children.some((leaf) => isActivePath(leaf.href, pathname));
}

/**
 * Determines whether a navigation link should display an active state based on its descendants.
 *
 * @param link - The navigation link to evaluate.
 * @param pathname - The current route pathname.
 * @returns `true` if a descendant matches the pathname, `false` otherwise.
 */
function isParentActive(link: NavLink, pathname: string): boolean {
  if (isNavLeaf(link)) return false;
  return link.children.some((child) => isNodeActive(child, pathname));
}

/**
 * Renders a navigation link for a leaf route.
 *
 * @returns A list item containing the navigation link, marked as the current page when its route is active.
 */
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

/**
 * Renders a nested navigation group and its page links.
 *
 * @param group - The navigation group to display.
 * @param pathname - The current route path used to determine the active state.
 * @returns The rendered navigation group.
 */
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
