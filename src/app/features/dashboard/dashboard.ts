import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface BranchInfo {
  id: string;
  name: string;
  location: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p *ngIf="!selectedBranch(); else branchInfo">
          Welcome to the NexAcademy Hub dashboard
        </p>
        <ng-template #branchInfo>
          <p>
            {{ selectedBranch()?.name }} -
            {{ selectedBranch()?.location }} Management Dashboard
          </p>
        </ng-template>
      </div>

      <!-- Branch Info Banner -->
      <div *ngIf="selectedBranch()" class="branch-banner">
        <div class="branch-banner-content">
          <div class="branch-icon">
            <i class="pi pi-map-marker"></i>
          </div>
          <div class="branch-details">
            <h3>{{ selectedBranch()?.name }}</h3>
            <p>{{ selectedBranch()?.location }}</p>
          </div>
          <div class="branch-actions">
            <button
              class="clear-branch-btn"
              (click)="clearBranchFilter()"
              type="button"
            >
              <i class="pi pi-times"></i>
              <span>View All Branches</span>
            </button>
            <button
              class="back-to-branches-btn"
              (click)="goBackToBranches()"
              type="button"
            >
              <i class="pi pi-arrow-left"></i>
              <span>Back to Branches</span>
            </button>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="pi pi-users"></i>
            </div>
            <div class="stat-info">
              <h3>Total Players</h3>
              <p class="stat-value">1,234</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="pi pi-calendar"></i>
            </div>
            <div class="stat-info">
              <h3>Today's Sessions</h3>
              <p class="stat-value">12</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="pi pi-dollar"></i>
            </div>
            <div class="stat-info">
              <h3>Monthly Revenue</h3>
              <p class="stat-value">$45,678</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="pi pi-chart-line"></i>
            </div>
            <div class="stat-info">
              <h3>Growth Rate</h3>
              <p class="stat-value">+12.5%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1.5rem;
      }

      .dashboard-header {
        margin-bottom: 2rem;
      }

      .dashboard-header h1 {
        font-size: 2rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 0.5rem 0;
      }

      .dashboard-header p {
        color: #64748b;
        margin: 0;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      .stat-card {
        background: white;
        border-radius: 0.75rem;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }

      .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .stat-icon {
        width: 3rem;
        height: 3rem;
        background: linear-gradient(135deg, #4c1d95, #7c3aed);
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
      }

      .stat-info h3 {
        font-size: 0.875rem;
        font-weight: 600;
        color: #64748b;
        margin: 0 0 0.25rem 0;
        text-transform: uppercase;
        letter-spacing: 0.025em;
      }

      .stat-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
      }

      @media (max-width: 768px) {
        .dashboard-container {
          padding: 0 1rem;
        }

        .stats-grid {
          grid-template-columns: 1fr;
        }
      }

      /* Branch Banner Styles */
      .branch-banner {
        background: linear-gradient(135deg, #4c1d95, #7c3aed);
        border-radius: 0.75rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 12px rgba(76, 29, 149, 0.2);
      }

      .branch-banner-content {
        display: flex;
        align-items: center;
        padding: 1.5rem;
        gap: 1rem;
      }

      .branch-icon {
        width: 3rem;
        height: 3rem;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .branch-details {
        flex: 1;
      }

      .branch-details h3 {
        color: white;
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 0.25rem 0;
      }
      .branch-details p {
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
        font-size: 0.875rem;
      }

      .branch-actions {
        display: flex;
        gap: 0.5rem;
        flex-shrink: 0;
      }
      .clear-branch-btn,
      .back-to-branches-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        flex-shrink: 0;
      }

      .clear-branch-btn:hover,
      .back-to-branches-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
      }
      .back-to-branches-btn {
        margin-left: 0;
      }

      @media (max-width: 768px) {
        .branch-banner-content {
          flex-direction: column;
          text-align: center;
        }

        .branch-actions {
          flex-direction: column;
          width: 100%;
          margin-top: 1rem;
        }

        .clear-branch-btn,
        .back-to-branches-btn {
          width: 100%;
          justify-content: center;
          margin-left: 0;
        }

        .back-to-branches-btn {
          margin-top: 0.5rem;
        }
      }

      .clear-branch-btn {
        width: 100%;
        justify-content: center;
      }
    `,
  ],
})
export class Dashboard implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  selectedBranch = signal<BranchInfo | null>(null);
  ngOnInit() {
    // Check for branch query parameters and route
    this.route.queryParams.subscribe(params => {
      if (params['branchId'] && params['branchName']) {
        this.selectedBranch.set({
          id: params['branchId'],
          name: params['branchName'],
          location: params['branchLocation'] || 'Unknown Location',
        });
      }
    });
  }

  clearBranchFilter() {
    this.selectedBranch.set(null);
    this.router.navigate(['/app/branch-dashboard']);
  }

  goBackToBranches() {
    this.router.navigate(['/branches']);
  }
}
