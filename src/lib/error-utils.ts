// src/lib/error-utils.ts

import { getTheme } from '../config/themes';

/**
 * Generates an error card with proper styling
 * @param message - Error message to display
 * @param themeName - Theme name for styling
 * @returns SVG error card
 */
export function generateErrorCard(message: string, themeName: string = 'default'): string {
  const theme = getTheme(themeName);
  
  return `
<svg width="495" height="120" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="errorTitle">
  <title id="errorTitle">LeetCode Stats Error</title>
  <style>
    .error-title { 
      font: 600 16px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; 
      fill: #${theme.titleColor}; 
    }
    .error-message { 
      font: 400 12px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; 
      fill: #${theme.textColor}; 
    }
    .error-icon {
      fill: #${theme.accentColor};
    }
  </style>
  
  <rect width="100%" height="100%" fill="#${theme.bgColor}" stroke="#${theme.borderColor}" rx="4.5"/>
  
  <!-- Error icon -->
  <circle cx="40" cy="45" r="16" class="error-icon" opacity="0.2"/>
  <text x="40" y="52" text-anchor="middle" class="error-icon" font-size="18">⚠</text>
  
  <text x="70" y="35" class="error-title">LeetCode Stats Error</text>
  <text x="70" y="55" class="error-message">${message}</text>
  <text x="70" y="75" class="error-message">Please check the username and try again.</text>
</svg>`;
}

/**
 * Error types for better categorization
 */
export enum ErrorType {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_THEME = 'INVALID_THEME',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Custom error class for LeetCode API errors
 */
export class LeetCodeError extends Error {
  public type: ErrorType;
  public statusCode: number;

  constructor(message: string, type: ErrorType = ErrorType.UNKNOWN_ERROR, statusCode: number = 500) {
    super(message);
    this.name = 'LeetCodeError';
    this.type = type;
    this.statusCode = statusCode;
  }
}

/**
 * Handles and categorizes different types of errors
 * @param error - Error object to handle
 * @returns Standardized LeetCodeError
 */
export function handleError(error: unknown): LeetCodeError {
  if (error instanceof LeetCodeError) {
    return error;
  }

  if (error instanceof Error) {
    // User not found errors
    if (error.message.includes('not found') || error.message.includes('User not found')) {
      return new LeetCodeError(
        error.message, 
        ErrorType.USER_NOT_FOUND, 
        404
      );
    }

    // API errors
    if (error.message.includes('API returned') || error.message.includes('GraphQL')) {
      return new LeetCodeError(
        'LeetCode API is currently unavailable', 
        ErrorType.API_ERROR, 
        503
      );
    }

    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new LeetCodeError(
        'Network error occurred while fetching data', 
        ErrorType.NETWORK_ERROR, 
        503
      );
    }

    // Generic error with original message
    return new LeetCodeError(
      error.message, 
      ErrorType.UNKNOWN_ERROR, 
      500
    );
  }

  // Fallback for unknown error types
  return new LeetCodeError(
    'An unexpected error occurred', 
    ErrorType.UNKNOWN_ERROR, 
    500
  );
}

/**
 * Gets user-friendly error message based on error type
 * @param error - LeetCodeError instance
 * @returns User-friendly error message
 */
export function getUserFriendlyMessage(error: LeetCodeError): string {
  switch (error.type) {
    case ErrorType.USER_NOT_FOUND:
      return 'Username not found on LeetCode';
    case ErrorType.API_ERROR:
      return 'LeetCode service is temporarily unavailable';
    case ErrorType.NETWORK_ERROR:
      return 'Network connection error';
    case ErrorType.INVALID_THEME:
      return 'Invalid theme specified';
    default:
      return 'Failed to generate LeetCode stats card';
  }
}

/**
 * Logs error with appropriate level and context
 * @param error - Error to log
 * @param context - Additional context information
 */
export function logError(error: LeetCodeError, context?: Record<string, unknown>): void {
  const logData = {
    error: {
      message: error.message,
      type: error.type,
      statusCode: error.statusCode,
      stack: error.stack
    },
    context,
    timestamp: new Date().toISOString()
  };

  // In production, you might want to use a proper logging service
  if (error.statusCode >= 500) {
    console.error('LeetCode Stats Error:', logData);
  } else {
    console.warn('LeetCode Stats Warning:', logData);
  }
}

/**
 * Creates an error response for API routes
 * @param error - Error to handle
 * @param themeName - Theme for error card
 * @returns Response object with error card SVG
 */
export function createErrorResponse(error: unknown, themeName: string = 'default') {
  const leetcodeError = handleError(error);
  const friendlyMessage = getUserFriendlyMessage(leetcodeError);
  const errorCard = generateErrorCard(friendlyMessage, themeName);

  logError(leetcodeError, { themeName });

  return {
    svg: errorCard,
    status: leetcodeError.statusCode,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  };
}