type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const getMinLogLevel = (): LogLevel => {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_LOG_LEVEL) {
    const envLevel = process.env.NEXT_PUBLIC_LOG_LEVEL.toLowerCase() as LogLevel;
    if (envLevel in LOG_LEVELS) {
      return envLevel;
    }
  }
  return typeof process !== "undefined" && process.env.NODE_ENV === "production" ? "info" : "debug";
};

const shouldLog = (level: LogLevel): boolean => {
  const minLevel = getMinLogLevel();
  return LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
};

export const logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (shouldLog("debug")) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    if (shouldLog("info")) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    if (shouldLog("warn")) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: unknown[]) => {
    if (shouldLog("error")) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
};
