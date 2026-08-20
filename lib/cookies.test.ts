import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getCookieValue, isValidSessionToken, getSecureCookieOptions } from "./cookies";

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

describe("isValidSessionToken", () => {
  it("should return false for undefined or empty tokens", () => {
    expect(isValidSessionToken(undefined)).toBe(false);
    expect(isValidSessionToken("")).toBe(false);
    expect(isValidSessionToken("   ")).toBe(false);
  });

  it("should return false for malformed tokens or tokens with whitespace/control characters", () => {
    expect(isValidSessionToken("invalid token")).toBe(false);
    expect(isValidSessionToken("token\nwith\rnewlines")).toBe(false);
    expect(isValidSessionToken("token\0nullbyte")).toBe(false);
    expect(isValidSessionToken("<script>alert(1)</script>")).toBe(false);
  });

  it("should return false for excessively long tokens (>1024 chars)", () => {
    const longToken = "a".repeat(1025);
    expect(isValidSessionToken(longToken)).toBe(false);
  });

  it("should return true for valid session tokens", () => {
    expect(isValidSessionToken("valid-session-token-123")).toBe(true);
  });
});

describe("getSecureCookieOptions", () => {
  it("should return standard security options", () => {
    const options = getSecureCookieOptions();
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("lax");
    expect(options.path).toBe("/");
  });
});

