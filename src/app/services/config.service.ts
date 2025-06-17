import { Injectable } from '@angular/core';

/**
 * Configuration service for managing environment-specific settings
 * Provides centralized access to configuration values
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly config = {
    apiUrl: '/api',
    apiTimeout: 10000,
    retryAttempts: 3,
    cacheTimeout: 300000, // 5 minutes
    features: {
      darkMode: true,
      offlineMode: false,
      analytics: false,
    },
    ui: {
      toastDuration: {
        info: 2000,
        success: 3000,
        warning: 4000,
        error: 5000,
      },
      animations: {
        enabled: true,
        duration: 200,
      },
    },
  };

  /**
   * Get API base URL
   */
  get apiUrl(): string {
    return this.config.apiUrl;
  }

  /**
   * Get API timeout in milliseconds
   */
  get apiTimeout(): number {
    return this.config.apiTimeout;
  }

  /**
   * Get retry attempts for failed requests
   */
  get retryAttempts(): number {
    return this.config.retryAttempts;
  }

  /**
   * Get cache timeout in milliseconds
   */
  get cacheTimeout(): number {
    return this.config.cacheTimeout;
  }

  /**
   * Check if feature is enabled
   */
  isFeatureEnabled(feature: keyof typeof this.config.features): boolean {
    return this.config.features[feature] ?? false;
  }

  /**
   * Get toast duration for specific type
   */
  getToastDuration(type: keyof typeof this.config.ui.toastDuration): number {
    return this.config.ui.toastDuration[type];
  }

  /**
   * Check if animations are enabled
   */
  get animationsEnabled(): boolean {
    return this.config.ui.animations.enabled;
  }

  /**
   * Get animation duration
   */
  get animationDuration(): number {
    return this.config.ui.animations.duration;
  }

  /**
   * Get full configuration object (read-only)
   */
  get fullConfig(): Readonly<typeof this.config> {
    return Object.freeze(this.config);
  }
}
