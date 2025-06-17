import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * Reusable skeleton loader component for better loading UX
 * Provides content-aware loading placeholders
 */
@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="animate-pulse"
      [attr.aria-label]="'Loading ' + type + ' content'"
    >
      <!-- Metrics Card Skeleton -->
      <div
        *ngIf="type === 'metrics-card'"
        class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div class="flex items-center">
          <div class="h-12 w-12 rounded-lg bg-gray-200"></div>
          <div class="ml-4 flex-1">
            <div class="mb-2 h-4 w-24 rounded bg-gray-200"></div>
            <div class="h-6 w-16 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>

      <!-- Quick Action Card Skeleton -->
      <div
        *ngIf="type === 'quick-action'"
        class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <div class="mb-6 flex items-center justify-between">
          <div class="h-14 w-14 rounded-xl bg-gray-200"></div>
          <div class="h-6 w-16 rounded-full bg-gray-200"></div>
        </div>
        <div class="space-y-3">
          <div class="h-6 w-32 rounded bg-gray-200"></div>
          <div class="h-4 w-full rounded bg-gray-200"></div>
          <div class="h-4 w-3/4 rounded bg-gray-200"></div>
          <div class="mt-4 h-4 w-24 rounded bg-gray-200"></div>
        </div>
      </div>

      <!-- Text Line Skeleton -->
      <div *ngIf="type === 'text'" class="space-y-2">
        <div
          class="h-4 rounded bg-gray-200"
          [style.width]="width || '100%'"
        ></div>
        <div
          *ngIf="lines && lines > 1"
          class="h-4 w-3/4 rounded bg-gray-200"
        ></div>
        <div
          *ngIf="lines && lines > 2"
          class="h-4 w-1/2 rounded bg-gray-200"
        ></div>
      </div>

      <!-- Header Skeleton -->
      <div *ngIf="type === 'header'" class="space-y-4">
        <div class="mx-auto h-8 w-64 rounded bg-gray-200"></div>
        <div class="mx-auto h-4 w-96 rounded bg-gray-200"></div>
      </div>

      <!-- Custom skeleton based on height -->
      <div
        *ngIf="type === 'custom'"
        class="rounded bg-gray-200"
        [style.height.px]="height || 20"
        [style.width]="width || '100%'"
      ></div>
    </div>
  `,
  styles: [
    `
      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      /* Reduce motion for users who prefer it */
      @media (prefers-reduced-motion: reduce) {
        .animate-pulse {
          animation: none;
          opacity: 0.7;
        }
      }
    `,
  ],
})
export class SkeletonLoaderComponent {
  @Input() type:
    | 'metrics-card'
    | 'quick-action'
    | 'text'
    | 'header'
    | 'custom' = 'text';
  @Input() width?: string;
  @Input() height?: number;
  @Input() lines?: number = 1;
}
