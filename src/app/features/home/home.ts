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
import { catchError, finalize, interval, of } from 'rxjs';

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
  styleUrls: ['./home.css'],
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
  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  readonly currentTime = signal(new Date());

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
    // Simulate API call with error handling - replace with actual service
    of(null)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        catchError(error => {
          console.error('Error loading dashboard data:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Loading Error',
            detail: 'Failed to load dashboard data. Please refresh the page.',
            life: 5000,
          });
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        // Simulate delay
        setTimeout(() => {
          this.metrics.set({
            totalPlayers: 1247,
            activeTeams: 48,
            activeBranches: 16,
            sportsOffered: 12,
            monthlyGrowth: 8.5,
          });
        }, UI_CONSTANTS.DATA_LOAD_SIMULATION);
      });
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
      // Analytics tracking could be added here
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

      // Clear any stored user data, tokens, etc.
      // sessionStorage.clear();
      // localStorage.removeItem('authToken');

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
  trackByActionId(index: number, action: QuickAction): string {
    return action.id;
  }
}
