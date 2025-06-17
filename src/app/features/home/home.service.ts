import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, map, retry, timeout } from 'rxjs/operators';
import { DashboardMetrics, isDashboardMetrics } from './models';

/**
 * Service for managing home dashboard data
 * Handles API calls, caching, and error recovery
 */
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly http = inject(HttpClient);
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly REQUEST_TIMEOUT = 10000; // 10 seconds
  private readonly MAX_RETRIES = 3;

  private metricsCache: { data: DashboardMetrics; timestamp: number } | null =
    null;

  /**
   * Fetch dashboard metrics with caching and error handling
   */
  getDashboardMetrics(): Observable<DashboardMetrics> {
    // Check cache first
    if (this.metricsCache && this.isCacheValid()) {
      return of(this.metricsCache.data);
    }

    // For now, simulate API call - replace with actual HTTP call
    return this.simulateApiCall().pipe(
      timeout(this.REQUEST_TIMEOUT),
      retry({
        count: this.MAX_RETRIES,
        delay: (error: HttpErrorResponse, retryCount: number) => {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, retryCount - 1) * 1000;
          return timer(delay);
        },
      }),
      map(data => {
        // Validate data structure
        if (!isDashboardMetrics(data)) {
          throw new Error('Invalid dashboard metrics data structure');
        }

        // Cache the result
        this.metricsCache = {
          data,
          timestamp: Date.now(),
        };

        return data;
      }),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Clear the metrics cache
   */
  clearCache(): void {
    this.metricsCache = null;
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(): boolean {
    if (!this.metricsCache) return false;
    return Date.now() - this.metricsCache.timestamp < this.CACHE_DURATION;
  }

  /**
   * Simulate API call - replace with actual HTTP call
   */
  private simulateApiCall(): Observable<DashboardMetrics> {
    return timer(800).pipe(
      map(() => ({
        totalPlayers: 1247,
        activeTeams: 48,
        activeBranches: 16,
        sportsOffered: 12,
        monthlyGrowth: 8.5,
      }))
    );
  }

  /**
   * Handle HTTP errors with user-friendly messages
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage =
            'Unable to connect to server. Please check your internet connection.';
          break;
        case 401:
          errorMessage = 'Authentication required. Please sign in again.';
          break;
        case 403:
          errorMessage =
            'Access denied. You do not have permission to view this data.';
          break;
        case 404:
          errorMessage =
            'Data not found. The requested information is not available.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 503:
          errorMessage =
            'Service temporarily unavailable. Please try again later.';
          break;
        default:
          errorMessage = `Server error (${error.status}): ${error.message}`;
      }
    }

    console.error('HomeService error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
