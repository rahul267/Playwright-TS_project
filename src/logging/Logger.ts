export type LogLevel = "debug" | "info" | "warn" | "error";

export interface Logger {
  debug(message: string, payload?: unknown): void;
  info(message: string, payload?: unknown): void;
  warn(message: string, payload?: unknown): void;
  error(message: string, payload?: unknown): void;
}

export class ConsoleLogger implements Logger {
  constructor(private readonly minLevel: LogLevel = "info") {}

  debug(message: string, payload?: unknown): void {
    this.log("debug", message, payload);
  }

  info(message: string, payload?: unknown): void {
    this.log("info", message, payload);
  }

  warn(message: string, payload?: unknown): void {
    this.log("warn", message, payload);
  }

  error(message: string, payload?: unknown): void {
    this.log("error", message, payload);
  }

  private shouldLog(level: LogLevel): boolean {
    const priority: Record<LogLevel, number> = {
      debug: 10,
      info: 20,
      warn: 30,
      error: 40
    };

    return priority[level] >= priority[this.minLevel];
  }

  private log(level: LogLevel, message: string, payload?: unknown): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
    if (payload === undefined) {
      console.log(line);
      return;
    }

    console.log(line, payload);
  }
}
