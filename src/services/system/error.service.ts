export enum ErrorCategory {
  APPLICATION = 'APPLICATION_ERROR',
  API = 'API_ERROR',
  DATABASE = 'DATABASE_ERROR',
  NETWORK = 'NETWORK_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
}

export interface AppError {
  code: string;
  category: ErrorCategory;
  message: string;
  details?: unknown;
  recoverySuggestion: string;
  timestamp: string;
}

export class ErrorService {
  private static errorLog: AppError[] = [];

  static createError(
    category: ErrorCategory,
    code: string,
    message: string,
    recoverySuggestion: string,
    details?: unknown
  ): AppError {
    const error: AppError = {
      code,
      category,
      message,
      recoverySuggestion,
      details,
      timestamp: new Date().toISOString(),
    };

    this.errorLog.push(error);
    if (this.errorLog.length > 100) {
      this.errorLog.shift(); // Keep last 100 errors in memory
    }

    return error;
  }

  static getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  static clearErrorLog(): void {
    this.errorLog = [];
  }
}
