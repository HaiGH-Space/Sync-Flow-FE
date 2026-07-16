import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCookieValue } from "./cookies";

describe("getCookieValue", () => {
  const originalDocument = global.document;

  beforeEach(() => {
    // Reset global document
    global.document = {
      cookie: ""
    } as unknown as typeof global.document;
  });

  afterEach(() => {
    global.document = originalDocument;
  });

  it("should return undefined when document is undefined", () => {
    // @ts-expect-error - testing undefined document
    delete global.document;
    expect(getCookieValue("session_token")).toBeUndefined();
  });

  it("should return undefined when cookie does not exist", () => {
    global.document.cookie = "other_cookie=value";
    expect(getCookieValue("session_token")).toBeUndefined();
  });

  it("should retrieve the cookie value when it exists", () => {
    global.document.cookie = "session_token=test-token-123; other=456";
    expect(getCookieValue("session_token")).toBe("test-token-123");
  });

  it("should handle URI encoded cookies", () => {
    global.document.cookie = "session_token=test%20token; other=456";
    expect(getCookieValue("session_token")).toBe("test token");
  });
});
