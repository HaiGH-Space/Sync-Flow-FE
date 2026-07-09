import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from "vitest";
import { logger } from "./logger";

describe("logger utility", () => {
  let consoleDebugSpy: MockInstance;
  let consoleInfoSpy: MockInstance;
  let consoleWarnSpy: MockInstance;
  let consoleErrorSpy: MockInstance;

  let originalLogLevel: string | undefined;
  let originalNodeEnv: string | undefined;

  beforeEach(() => {
    originalLogLevel = process.env.NEXT_PUBLIC_LOG_LEVEL;
    originalNodeEnv = process.env.NODE_ENV;
    consoleDebugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();

    if (originalLogLevel === undefined) {
      delete process.env.NEXT_PUBLIC_LOG_LEVEL;
    } else {
      process.env.NEXT_PUBLIC_LOG_LEVEL = originalLogLevel;
    }

    // @ts-expect-error - process.env.NODE_ENV is read-only in types
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("should log info, warn, error, and debug messages by default in test environment", () => {
    logger.info("info msg", { foo: "bar" });
    expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO] info msg", { foo: "bar" });

    logger.warn("warn msg");
    expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN] warn msg");

    logger.error("error msg");
    expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR] error msg");

    logger.debug("debug msg");
    expect(consoleDebugSpy).toHaveBeenCalledWith("[DEBUG] debug msg");
  });

  it("should respect NEXT_PUBLIC_LOG_LEVEL environment variable", () => {
    process.env.NEXT_PUBLIC_LOG_LEVEL = "warn";

    logger.debug("debug msg");
    logger.info("info msg");
    expect(consoleDebugSpy).not.toHaveBeenCalled();
    expect(consoleInfoSpy).not.toHaveBeenCalled();

    logger.warn("warn msg");
    expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN] warn msg");
  });

  it("should suppress debug logs when NODE_ENV is production", () => {
    // @ts-expect-error - process.env.NODE_ENV is read-only in types
    process.env.NODE_ENV = "production";

    logger.debug("debug msg");
    expect(consoleDebugSpy).not.toHaveBeenCalled();

    logger.info("info msg");
    expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO] info msg");
  });
});
