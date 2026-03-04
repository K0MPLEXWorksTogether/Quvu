import { createLogger, Logger } from "lovely-logs";

export default class AppLogger {
  private static instance: Logger | null = null;

  private constructor() { }
  public static getInstance(): Logger {
    if (!this.instance) {
      this.instance = createLogger({
        timestampEnabled: true,
        prefix: {
          debug: "DEBUG",
          info: "INFO",
          warn: "WARN",
          error: "ERROR",
          success: "SUCCESS",
        },
      });
    }

    return this.instance
  }
}
