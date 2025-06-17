import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

/**
 * Centralized error handling service
 * Provides consistent error messaging and logging
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private readonly messageService = inject(MessageService);

  /**
   * Handle and display user-friendly error messages
   */
  handleError(error: Error | string, context?: string): void {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const contextPrefix = context ? `${context}: ` : '';

    console.error(`${contextPrefix}${errorMessage}`, error);

    // Show user-friendly toast notification
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: this.getUserFriendlyMessage(errorMessage),
      life: 5000,
      sticky: this.isSticky(errorMessage),
    });
  }

  /**
   * Handle warning messages
   */
  handleWarning(message: string, context?: string): void {
    const contextPrefix = context ? `${context}: ` : '';
    console.warn(`${contextPrefix}${message}`);

    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: message,
      life: 4000,
    });
  }

  /**
   * Handle success messages
   */
  handleSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000,
    });
  }

  /**
   * Handle info messages
   */
  handleInfo(message: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Information',
      detail: message,
      life: 2000,
    });
  }

  /**
   * Convert technical error messages to user-friendly ones
   */
  private getUserFriendlyMessage(errorMessage: string): string {
    const errorMap: Record<string, string> = {
      'Network error': 'Please check your internet connection and try again.',
      'Authentication required':
        'Your session has expired. Please sign in again.',
      'Access denied': 'You do not have permission to perform this action.',
      'Data not found': 'The requested information could not be found.',
      'Server error':
        'We are experiencing technical difficulties. Please try again later.',
      'Service temporarily unavailable':
        'The service is temporarily unavailable. Please try again in a few minutes.',
      'Invalid dashboard metrics data structure':
        'There was an issue loading the dashboard data. Please refresh the page.',
      timeout: 'The request took too long to complete. Please try again.',
      'Failed to fetch':
        'Unable to connect to the server. Please check your connection.',
    };

    // Check for partial matches
    for (const [key, value] of Object.entries(errorMap)) {
      if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    // Default fallback message
    return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
  }

  /**
   * Determine if error message should be sticky (require manual dismissal)
   */
  private isSticky(errorMessage: string): boolean {
    const stickyErrors = [
      'authentication',
      'access denied',
      'session expired',
      'unauthorized',
    ];

    return stickyErrors.some(error =>
      errorMessage.toLowerCase().includes(error)
    );
  }
}
