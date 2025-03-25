import { isNotNil, isPlainObject, isString } from "es-toolkit";

enum LogLevel {
    DEBUG = 0,
    ERROR = 3,
    INFO = 1,
    NONE = 4,
    WARN = 2,
}

export class AppLogger {
    private static instance: AppLogger;
    minLevel = import.meta.env.MODE === "production" ? LogLevel.WARN : LogLevel.DEBUG;

    private readonly levelConfig = {
        [LogLevel.DEBUG]: { badge: "🔍 DEBUG", color: "color: #9e9e9e", method: "log" },
        [LogLevel.ERROR]: { badge: "🛑 ERROR", color: "color: #f44336", method: "error" },
        [LogLevel.INFO]: { badge: "ℹ️ INFO", color: "color: #2196f3", method: "info" },
        [LogLevel.WARN]: { badge: "⚠️ WARN", color: "color: #ff9800", method: "warn" },
    } as const;

    public static getInstance(): AppLogger {
        if (!AppLogger.instance) {
            AppLogger.instance = new AppLogger();
        }
        return AppLogger.instance;
    }

    public debug(message: string, context?: string, ...args: any[]): void {
        this.log(LogLevel.DEBUG, message, context, ...args);
    }

    public error(err: unknown, context?: string, ...args: any[]): void {
        let message: string;
        let stack: string | undefined;

        if (err instanceof Error) {
            message = `${err.name}: ${err.message}`;
            stack = err.stack;
        } else if (isString(err)) {
            message = err;
        } else {
            try {
                message = isPlainObject(err) && isNotNil(err) ? JSON.stringify(err) : String(err);
            } catch (jsonError) {
                message = "[Unstringifiable error object]";
            }
        }

        if (stack) {
            this.log(LogLevel.ERROR, message, context, { stack }, ...args);
        } else {
            this.log(LogLevel.ERROR, message, context, ...args);
        }
    }

    public info(message: string, context?: string, ...args: any[]): void {
        this.log(LogLevel.INFO, message, context, ...args);
    }

    public warn(message: string, context?: string, ...args: any[]): void {
        this.log(LogLevel.WARN, message, context, ...args);
    }

    private log(level: LogLevel, message: string, context?: string, ...args: any[]): void {
        if (level < this.minLevel || level === LogLevel.NONE) {
            return;
        }

        const { badge, color, method } = this.levelConfig[level];
        const timestamp = new Date().toISOString();
        const contextStr = context ? `[${context}]` : "";

        // Format: [TIMESTAMP] LEVEL [CONTEXT] MESSAGE
        const formattedMessage = `[${timestamp}] ${contextStr} ${message}`;
        if (method === "error") {
            // eslint-disable-next-line no-console
            console[method](`${badge} ${formattedMessage}`, ...args);
        } else {
            // eslint-disable-next-line no-console
            console[method](`%c${badge} ${formattedMessage}`, color, ...args);
        }
    }
}

export const logger = AppLogger.getInstance();
