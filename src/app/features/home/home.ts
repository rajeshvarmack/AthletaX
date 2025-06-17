import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { interval } from 'rxjs';

// Import types from models
import {
  type DashboardMetrics,
  type QuickAction,
  DEFAULT_DASHBOARD_METRICS,
} from './models';

// Production constants
const UI_CONSTANTS = {
  NAVIGATION_DELAY: 300,
  SIGNOUT_DELAY: 1000,
  DATA_LOAD_SIMULATION: 800,
  TIME_UPDATE_INTERVAL: 60000, // 1 minute
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
  TOAST_LIFETIMES: {
    INFO: 2000,
    SUCCESS: 3000,
    ERROR: 4000,
    WARNING: 5000,
  },
} as const;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ToastModule],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class Home implements OnInit {
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  // Reactive state management
  readonly metrics = signal<DashboardMetrics>({
    ...DEFAULT_DASHBOARD_METRICS,
    activeBranches: 16, // Override with current value
  });
  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  readonly errorMessage = signal<string>('');
  readonly currentTime = signal(new Date());
  readonly retryCount = signal(0);

  // Computed properties
  readonly welcomeMessage = computed(() => {
    const hour = this.currentTime().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  });

  readonly quickActions = computed<QuickAction[]>(() => [
    {
      id: 'branches',
      title: 'Branches',
      description: 'Manage academy locations and facilities',
      icon: 'pi-building',
      route: '/branches',
      color: 'primary',
      metrics: `${this.metrics().activeBranches} Active`,
      ariaLabel: 'Navigate to branches management',
    },
    {
      id: 'management',
      title: 'Management',
      description: 'Oversight, analytics, and administration',
      icon: 'pi-chart-line',
      route: '/app/management-dashboard',
      color: 'secondary',
      metrics: 'Dashboard',
      ariaLabel: 'Navigate to management dashboard',
    },
  ]);
  ngOnInit(): void {
    this.loadDashboardData();
    this.startTimeUpdater();
  }

  private loadDashboardData(): void {
    // Simple data loading without complex services for now
    this.isLoading.set(true);

    setTimeout(() => {
      this.metrics.set({
        totalPlayers: 1247,
        activeTeams: 48,
        activeBranches: 16,
        sportsOffered: 12,
        monthlyGrowth: 8.5,
      });
      this.isLoading.set(false);
    }, 1000);
  }

  /**
   * Retry loading dashboard data
   */
  retryLoadData(): void {
    this.loadDashboardData();
  }
  private startTimeUpdater(): void {
    // Update time every minute with proper cleanup
    interval(UI_CONSTANTS.TIME_UPDATE_INTERVAL)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentTime.set(new Date());
      });
  }
  onQuickAction(action: QuickAction): void {
    try {
      // Validate action before proceeding
      if (!action || !action.route) {
        console.error('Invalid action configuration');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid action configuration',
          life: UI_CONSTANTS.TOAST_LIFETIMES.ERROR,
        });
        return;
      }

      this.messageService.add({
        severity: 'info',
        summary: 'Navigation',
        detail: `Opening ${action.title.toLowerCase()}...`,
        life: UI_CONSTANTS.TOAST_LIFETIMES.INFO,
      });

      // Small delay for better UX
      setTimeout(() => {
        this.router.navigate([action.route]).catch(error => {
          console.error('Navigation error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Navigation Error',
            detail: 'Failed to navigate. Please try again.',
            life: UI_CONSTANTS.TOAST_LIFETIMES.ERROR,
          });
        });
      }, UI_CONSTANTS.NAVIGATION_DELAY);
    } catch (error) {
      console.error('Quick action error:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An unexpected error occurred.',
        life: UI_CONSTANTS.TOAST_LIFETIMES.ERROR,
      });
    }
  }
  onSignOut(): void {
    try {
      this.messageService.add({
        severity: 'success',
        summary: 'Signed Out',
        detail: 'You have been signed out successfully.',
        life: UI_CONSTANTS.TOAST_LIFETIMES.SUCCESS,
      });

      // Clear user data and tokens
      this.clearUserData();

      // Clear component state for security
      this.metrics.set({
        totalPlayers: 0,
        activeTeams: 0,
        activeBranches: 0,
        sportsOffered: 0,
        monthlyGrowth: 0,
      });

      setTimeout(() => {
        this.router.navigate(['/auth/login']).catch(error => {
          console.error('Sign out navigation error:', error);
          // Fallback - force page reload to ensure clean state
          window.location.href = '/auth/login';
        });
      }, UI_CONSTANTS.SIGNOUT_DELAY);
    } catch (error) {
      console.error('Sign out error:', error);
      // Fallback for any errors during sign out
      window.location.href = '/auth/login';
    }
  }

  // Accessibility and keyboard navigation
  onKeyboardNavigation(event: KeyboardEvent, action: QuickAction): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onQuickAction(action);
    }
  }

  // TrackBy function for performance optimization
  trackByActionId(_index: number, action: QuickAction): string {
    return action.id;
  }

  /**
   * Check if user is authenticated
   */
  private isAuthenticated(): boolean {
    // TODO: Replace with actual authentication service
    const token =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Clear user data on sign out
   */
  private clearUserData(): void {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userPreferences');

    // Clear sessionStorage
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userSession');

    // Clear any other cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('user-data')) {
            caches.delete(name);
          }
        });
      });
    }
  }
}
