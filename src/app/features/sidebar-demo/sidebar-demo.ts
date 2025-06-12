import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-sidebar-demo',
  standalone: true,
  imports: [CommonModule, Sidebar],
  template: `
    <div class="demo-container">
      <app-sidebar></app-sidebar>

      <!-- Main Content Area -->
      <div class="main-content">
        <div class="content-wrapper">
          <h1 class="demo-title">Sidebar Demo</h1>
          <p class="demo-description">
            This is a demo page showcasing the sidebar component with all the
            requested features:
          </p>

          <div class="feature-list">
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>Dashboard, Players, Invoices menu items</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>Masters menu with expandable submenu</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>Settings submenu under Masters</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>Branch selector dropdown at bottom</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>Sport type selector dropdown at bottom</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>Purple theme matching your brand</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>Responsive design and accessibility</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        display: flex;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .main-content {
        flex: 1;
        margin-left: 280px;
        padding: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .content-wrapper {
        max-width: 600px;
        background: rgba(255, 255, 255, 0.95);
        padding: 3rem;
        border-radius: 1rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
      }

      .demo-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: #1e1b4b;
        margin-bottom: 1rem;
        text-align: center;
      }

      .demo-description {
        font-size: 1.125rem;
        color: #4b5563;
        margin-bottom: 2rem;
        line-height: 1.6;
        text-align: center;
      }

      .feature-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .feature-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background: rgba(139, 92, 246, 0.1);
        border-radius: 0.5rem;
        border-left: 4px solid #8b5cf6;
      }

      .feature-item i {
        color: #10b981;
        font-size: 1.25rem;
      }

      .feature-item span {
        color: #374151;
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .main-content {
          margin-left: 0;
          padding: 1rem;
        }

        .content-wrapper {
          padding: 2rem;
        }

        .demo-title {
          font-size: 2rem;
        }
      }
    `,
  ],
})
export class SidebarDemo {}
