import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

// Mock next-intl/middleware
vi.mock("next-intl/middleware", () => {
  return {
    default: () => () => {
      const res = new Response("ok", { status: 200 });
      return res;
    },
  };
});

describe("proxy middleware security", () => {
  it("should redirect unauthenticated request on protected route to /en/auth", () => {
    const req = new NextRequest("http://localhost:3000/en/dashboard");
    const res = proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/en/auth?redirectTo=%2Fdashboard");
  });

  it("should redirect malformed session_token cookie on protected route to /en/auth", () => {
    const req = new NextRequest("http://localhost:3000/en/dashboard", {
      headers: { cookie: "session_token=invalid%20token%0A" },
    });
    const res = proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/en/auth");
  });

  it("should redirect authenticated user on auth route to /en/dashboard", () => {
    const req = new NextRequest("http://localhost:3000/en/auth", {
      headers: { cookie: "session_token=valid-token-123" },
    });
    const res = proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/en/dashboard");
  });

  it("should attach security headers on response for valid requests", () => {
    const req = new NextRequest("http://localhost:3000/en/dashboard", {
      headers: { cookie: "session_token=valid-token-123" },
    });
    const res = proxy(req);
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
  });
});
