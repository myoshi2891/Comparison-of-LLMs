import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import Ext from "./Ext";

test("Ext component renders safe external link", () => {
  const { container } = render(<Ext href="https://example.com">Link text</Ext>);
  const link = container.querySelector("a");
  expect(link).toBeTruthy();
  expect(link?.getAttribute("href")).toBe("https://example.com");
  expect(link?.getAttribute("target")).toBe("_blank");
  expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
  expect(link?.textContent).toBe("Link text");
});
