import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HomeService } from './home.service';
import { DashboardMetrics, DEFAULT_DASHBOARD_METRICS } from './models';

/**
 * Resolver to pre-load dashboard data before component initialization
 * Provides fallback data if loading fails
 */
export const homeResolver: ResolveFn<DashboardMetrics> = (_route, _state) => {
  const homeService = inject(HomeService);

  return homeService.getDashboardMetrics().pipe(
    catchError(error => {
      console.warn('Failed to load dashboard metrics in resolver:', error);
      // Return default metrics as fallback
      return of({
        ...DEFAULT_DASHBOARD_METRICS,
        activeBranches: 16, // Keep current override
      });
    })
  );
};
