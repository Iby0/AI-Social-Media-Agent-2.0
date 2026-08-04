export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  timestamp: string;
}

export class LoggerService {
  private static logs: LogEntry[] = [];
  private static isProd = import.meta.env.PROD;

  static info(message: string, context?: string, data?: unknown): void {
    this.log('info', message, context, data);
  }

  static warn(message: string, context?: string, data?: unknown): void {
    this.log('warn', message, context, data);
  }

  static error(message: string, context?: string, data?: unknown): void {
    this.log('error', message, context, data);
  }

  static debug(message: string, context?: string, data?: unknown): void {
    if (!this.isProd) {
      this.log('debug', message, context, data);
    }
  }

  private static log(level: LogLevel, message: string, context?: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      context: context || 'App',
      data,
      timestamp: new Date().toISOString(),
    };

    this.logs.push(entry);
    if (this.logs.length > 200) {
      this.logs.shift();
    }

    const formattedContext = context ? `[${context}]` : '[App]';
    if (level === 'error') {
      console.error(`${formattedContext} ${message}`, data ?? '');
    } else if (level === 'warn') {
      console.warn(`${formattedContext} ${message}`, data ?? '');
    } else if (level === 'info') {
      console.info(`${formattedContext} ${message}`, data ?? '');
    } else if (level === 'debug') {
      console.debug(`${formattedContext} ${message}`, data ?? '');
    }
  }

  static getLogs(): LogEntry[] {
    return [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
  }
}
