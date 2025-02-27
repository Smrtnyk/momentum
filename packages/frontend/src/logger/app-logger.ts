/**
 * Log levels in ascending order of severity
 */
export enum LogLevel {
    DEBUG = 0,
    ERROR = 3,
    INFO = 1,
    // Used to disable logging completely
    NONE = 4,
    WARN = 2,
}

/**
 * Configuration options for the logger
 */
export interface LoggerConfig {
    allowedContexts?: string[];
    minLevel: LogLevel;
    useColors: boolean;
}

const DEFAULT_CONFIG: LoggerConfig = {
    minLevel: import.meta.env.MODE === "production" ? LogLevel.WARN : LogLevel.DEBUG,
    useColors: true,
};

export class AppLogger {
    private static instance: AppLogger;
    private config: LoggerConfig;

    private readonly levelConfig = {
        [LogLevel.DEBUG]: { badge: "🔍 DEBUG", color: "color: #9e9e9e", method: "log" },
        [LogLevel.ERROR]: { badge: "🛑 ERROR", color: "color: #f44336", method: "error" },
        [LogLevel.INFO]: { badge: "ℹ️ INFO", color: "color: #2196f3", method: "info" },
        [LogLevel.WARN]: { badge: "⚠️ WARN", color: "color: #ff9800", method: "warn" },
    } as const;

    private constructor(config: LoggerConfig = DEFAULT_CONFIG) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    public static getInstance(config?: LoggerConfig): AppLogger {
        if (!AppLogger.instance) {
            AppLogger.instance = new AppLogger(config);
        } else if (config) {
            AppLogger.instance.configure(config);
        }
        return AppLogger.instance;
    }

    public configure(config: Partial<LoggerConfig>): void {
        this.config = { ...this.config, ...config };
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
        } else if (typeof err === "string") {
            message = err;
        } else {
            // Unknown error type
            try {
                message =
                    typeof err === "object" && err !== null ? JSON.stringify(err) : String(err);
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
        if (level < this.config.minLevel || level === LogLevel.NONE) {
            return;
        }

        // Skip if context filtering is enabled and this context isn't allowed
        if (
            this.config.allowedContexts?.length &&
            context &&
            !this.config.allowedContexts.includes(context)
        ) {
            return;
        }

        const { badge, color, method } = this.levelConfig[level];
        const timestamp = new Date().toISOString();
        const contextStr = context ? `[${context}]` : "";

        // Format: [TIMESTAMP] LEVEL [CONTEXT] MESSAGE
        const formattedMessage = `[${timestamp}] ${contextStr} ${message}`;
        if (this.config.useColors && method !== "error") {
            // eslint-disable-next-line no-console
            console[method](`%c${badge} ${formattedMessage}`, color, ...args);
        } else {
            // eslint-disable-next-line no-console
            console[method](`${badge} ${formattedMessage}`, ...args);
        }
    }
}

export const logger = AppLogger.getInstance();
