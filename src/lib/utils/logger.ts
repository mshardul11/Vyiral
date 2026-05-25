type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_PREFIX = "[Vyiral]";

function log(level: LogLevel, scope: string, message: string, meta?: unknown) {
  const payload = meta !== undefined ? { message, meta } : { message };
  const fn = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  fn(`${LOG_PREFIX}[${scope}]`, payload);
}

export const logger = {
  debug: (scope: string, message: string, meta?: unknown) =>
    log("debug", scope, message, meta),
  info: (scope: string, message: string, meta?: unknown) =>
    log("info", scope, message, meta),
  warn: (scope: string, message: string, meta?: unknown) =>
    log("warn", scope, message, meta),
  error: (scope: string, message: string, meta?: unknown) =>
    log("error", scope, message, meta),
};
