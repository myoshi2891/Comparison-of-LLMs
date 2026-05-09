import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveSiteUrl } from "./site-url";

describe("resolveSiteUrl", () => {
  const DEFAULT_SITE_URL = "https://comparison-of-llms.netlify.app";
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("returns URL.origin when NEXT_PUBLIC_SITE_URL is valid", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://custom.example.com/path";
    const result = resolveSiteUrl("robots.ts");
    expect(result).toBe("https://custom.example.com");
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("falls back to DEFAULT_SITE_URL and does not throw when NEXT_PUBLIC_SITE_URL is invalid", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "not-a-valid-url";
    process.env.NETLIFY = "true"; // Prevent warn for missing Netlify
    const result = resolveSiteUrl("sitemap.ts");
    expect(result).toBe(DEFAULT_SITE_URL);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("returns DEFAULT_SITE_URL and warns when NEXT_PUBLIC_SITE_URL is undefined on non-Netlify", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NETLIFY;
    const result = resolveSiteUrl("robots.ts");
    expect(result).toBe(DEFAULT_SITE_URL);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("[robots.ts] NEXT_PUBLIC_SITE_URL is not set or invalid.")
    );
  });

  it("returns DEFAULT_SITE_URL and does not warn when NEXT_PUBLIC_SITE_URL is undefined on Netlify", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NETLIFY = "true";
    const result = resolveSiteUrl("sitemap.ts");
    expect(result).toBe(DEFAULT_SITE_URL);
    expect(console.warn).not.toHaveBeenCalled();
  });
});
