import { describe, expect, it } from "vitest";
import { escapeHtml } from "../escape-html";

describe("escapeHtml", () => {
  it("escapes HTML-significant characters", () => {
    expect(escapeHtml(`<b class="x">A & B</b>`)).toBe(
      "&lt;b class=&quot;x&quot;&gt;A &amp; B&lt;/b&gt;",
    );
  });
});
