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
import { catchError, finalize, of } from 'rxjs';

// Import types from models
import {
  type Branch,
  type ViewMode,
  BRANCH_LIST_CONSTANTS,
  CATEGORY_CONFIGS,
} from './models';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [CommonModule, ToastModule],
  templateUrl: './branch-list.html',
  styleUrls: ['./branch-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class BranchList implements OnInit {
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  // Reactive state management
  readonly viewMode = signal<ViewMode>('compact');
  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  // Branch data signal
  readonly branches = signal<readonly Branch[]>([]);

  // Computed properties
  readonly isFullWidth = computed(() => this.viewMode() === 'full-width');
  readonly sortedBranches = computed(() =>
    [...this.branches()].sort((a, b) => a.name.localeCompare(b.name))
  );
  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    this.isLoading.set(true);

    // Simulate API call - replace with actual service
    of(this.getBranchesData())
      .pipe(
        finalize(() => this.isLoading.set(false)),
        catchError(error => {
          console.error('Error loading branches:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Loading Error',
            detail: 'Failed to load branches. Please refresh the page.',
            life: 5000,
          });
          this.hasError.set(true);
          return of([]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(branches => {
        this.branches.set(branches);
      });
  }
  private getBranchesData(): Branch[] {
    return [
      {
        id: 1,
        name: 'Alhazam',
        location: 'Riyadh',
        activePlayers: 41,
        teams: 5,
        category: 'Advance',
        isActive: true,
      },
      {
        id: 2,
        name: 'Almuruj',
        location: 'Riyadh',
        activePlayers: 37,
        teams: 5,
        category: 'Plus',
        isActive: true,
      },
      {
        id: 3,
        name: 'Alnuzha',
        location: 'Riyadh',
        activePlayers: 36,
        teams: 4,
        category: 'Pro',
        isActive: true,
      },
      {
        id: 4,
        name: 'Alqairawan',
        location: 'Riyadh',
        activePlayers: 39,
        teams: 5,
        category: 'Advance',
        isActive: true,
      },
      {
        id: 5,
        name: 'Alrayan',
        location: 'Riyadh',
        activePlayers: 42,
        teams: 5,
        category: 'Plus',
        isActive: true,
      },
      {
        id: 6,
        name: 'Alyarmuk',
        location: 'Riyadh',
        activePlayers: 45,
        teams: 6,
        category: 'Pro',
        isActive: true,
      },
      {
        id: 7,
        name: 'AlArid',
        location: 'Riyadh',
        activePlayers: 35,
        teams: 5,
        category: 'Advance',
        isActive: true,
      },
      {
        id: 8,
        name: 'AlDammam',
        location: 'Dammam',
        activePlayers: 29,
        teams: 4,
        category: 'Plus',
        isActive: true,
      },
      {
        id: 9,
        name: 'Irqah',
        location: 'Riyadh',
        activePlayers: 33,
        teams: 4,
        category: 'School',
        isActive: true,
      },
      {
        id: 10,
        name: 'Jeddah',
        location: 'Jeddah',
        activePlayers: 38,
        teams: 5,
        category: 'Pro',
        isActive: true,
      },
      {
        id: 11,
        name: 'Jeddah Girls',
        location: 'Jeddah',
        activePlayers: 26,
        teams: 3,
        category: 'Girls',
        isActive: true,
      },
      {
        id: 12,
        name: 'King Faisal School',
        location: 'Riyadh',
        activePlayers: 31,
        teams: 4,
        category: 'School',
        isActive: true,
      },
      {
        id: 13,
        name: 'Kingdom School Football',
        location: 'Riyadh',
        activePlayers: 28,
        teams: 3,
        category: 'School',
        isActive: true,
      },
      {
        id: 14,
        name: 'Manarat',
        location: 'Riyadh',
        activePlayers: 47,
        teams: 6,
        category: 'Pro',
        isActive: true,
      },
      {
        id: 15,
        name: 'Nafal',
        location: 'Riyadh',
        activePlayers: 52,
        teams: 7,
        category: 'Pro',
        isActive: true,
      },
      {
        id: 16,
        name: 'Najd School',
        location: 'Riyadh',
        activePlayers: 44,
        teams: 6,
        category: 'School',
        isActive: true,
      },
    ];
  }
  onBranchClick(branch: Branch): void {
    // Navigate to branch dashboard with branch context
    this.messageService.add({
      severity: 'success',
      summary: BRANCH_LIST_CONSTANTS.TOAST_MESSAGES.BRANCH_SELECTED,
      detail: `Navigating to ${branch.name} - ${branch.location} management`,
      life: 3000,
    });

    setTimeout(() => {
      this.router.navigate(['/app/branch-dashboard'], {
        queryParams: {
          branchId: branch.id,
          branchName: branch.name,
          branchLocation: branch.location,
        },
      });
    }, BRANCH_LIST_CONSTANTS.ANIMATION_DELAYS.NAVIGATION);
  }

  onBack(): void {
    this.router.navigate(['/home']);
  }

  onSignOut(): void {
    // Add any cleanup logic here (e.g., clearing tokens, session data)
    this.messageService.add({
      severity: 'success',
      summary: BRANCH_LIST_CONSTANTS.TOAST_MESSAGES.SIGN_OUT_SUCCESS,
      detail: BRANCH_LIST_CONSTANTS.TOAST_MESSAGES.SIGN_OUT_MESSAGE,
      life: 3000,
    });

    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, BRANCH_LIST_CONSTANTS.ANIMATION_DELAYS.SIGNOUT);
  }

  toggleViewMode(): void {
    this.viewMode.update(current =>
      current === 'compact' ? 'full-width' : 'compact'
    );
  }
  getCategoryIcon(category: string): string {
    return (
      CATEGORY_CONFIGS[category as keyof typeof CATEGORY_CONFIGS]?.icon ||
      'pi-building'
    );
  }
  getCategoryColor(category: string): string {
    // Professional vibrant colors for better category distinction
    const colorMap = {
      Pro: 'text-indigo-700', // Professional indigo
      Advance: 'text-purple-700', // Advanced purple
      Plus: 'text-blue-700', // Plus blue
      School: 'text-violet-700', // School violet
      Girls: 'text-pink-700', // Girls pink
    };
    return colorMap[category as keyof typeof colorMap] || 'text-gray-600';
  }
  getCategoryBgColor(category: string): string {
    // Clean white background with subtle borders for all categories
    const bgColorMap = {
      Pro: 'bg-white border border-gray-200',
      Advance: 'bg-white border border-gray-200',
      Plus: 'bg-white border border-gray-200',
      School: 'bg-white border border-gray-200',
      Girls: 'bg-white border border-gray-200',
    };
    return (
      bgColorMap[category as keyof typeof bgColorMap] ||
      'bg-white border border-gray-200'
    );
  }
  getCategoryStyles(category: string): string {
    // Vibrant category badges for better visual distinction
    const stylesMap = {
      Plus: 'bg-blue-500 text-white shadow-md border border-blue-600 font-medium tracking-wide hover:bg-blue-600',
      Advance:
        'bg-purple-500 text-white shadow-md border border-purple-600 font-semibold tracking-wide hover:bg-purple-600',
      Pro: 'bg-indigo-600 text-white shadow-md border border-indigo-700 font-bold tracking-wider hover:bg-indigo-700',
      School:
        'bg-violet-500 text-white shadow-md border border-violet-600 font-medium tracking-normal hover:bg-violet-600',
      Girls:
        'bg-pink-500 text-white shadow-md border border-pink-600 font-medium tracking-wide hover:bg-pink-600',
    };
    return (
      stylesMap[category as keyof typeof stylesMap] ||
      'bg-gray-500 text-white shadow-md border border-gray-600'
    );
  }
  getCategoryCardClass(_category: string): string {
    // Clean white cards matching home page design - professional and consistent
    return 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300';
  }
  getCategoryHeaderClass(_category: string): string {
    // Clean light header matching the new white card design
    return 'bg-gray-50';
  }
  getCategoryOverlayClass(_category: string): string {
    // Remove overlays completely for cleaner look
    return '';
  }
  getCategoryContentClass(_category: string): string {
    // Clean white content areas matching home page cards
    return 'bg-white border-t border-gray-100';
  }
}
