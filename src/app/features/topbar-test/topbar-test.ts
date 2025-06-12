import { Component } from '@angular/core';

@Component({
  selector: 'app-topbar-test',
  standalone: true,
  template: `
    <div class="test-container">
      <div class="test-header">
        <h1>Top Bar Integration Test</h1>
        <p>Testing the integration of the top bar with sidebar</p>
      </div>

      <div class="test-content">
        <div class="test-section">
          <h2>Top Bar Features</h2>
          <ul class="feature-list">
            <li>✅ Hamburger menu button (integrates with sidebar)</li>
            <li>✅ Purple gradient background matching theme</li>
            <li>✅ User profile dropdown with "SA" initials</li>
            <li>✅ User email "superadmin&#64;gmail.com"</li>
            <li>✅ Notifications bell with badge count</li>
            <li>✅ Responsive design</li>
            <li>✅ Fixed positioning</li>
          </ul>
        </div>

        <div class="test-section">
          <h2>Layout Integration</h2>
          <ul class="feature-list">
            <li>✅ Main layout with topbar and sidebar</li>
            <li>✅ Content area with proper margins</li>
            <li>✅ Mobile-responsive sidebar toggle</li>
            <li>✅ Proper z-index layering</li>
          </ul>
        </div>

        <div class="test-section">
          <h2>User Interactions</h2>
          <div class="interaction-tests">
            <p>
              <strong>Click the hamburger menu (☰)</strong> in the top bar to
              toggle the sidebar
            </p>
            <p>
              <strong>Click the user profile</strong> in the top right to see
              dropdown menu
            </p>
            <p>
              <strong>Click the notification bell (🔔)</strong> to see
              notifications
            </p>
            <p>
              <strong>Resize the window</strong> to test mobile responsiveness
            </p>
          </div>
        </div>

        <div class="test-section">
          <h2>Theme Consistency</h2>
          <div class="color-samples">
            <div class="color-sample primary">
              <span>Primary Purple</span>
            </div>
            <div class="color-sample secondary">
              <span>Secondary Purple</span>
            </div>
            <div class="color-sample accent">
              <span>Accent Purple</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .test-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .test-header {
        text-align: center;
        margin-bottom: 2rem;
        padding: 2rem 0;
      }

      .test-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 0.5rem 0;
      }

      .test-header p {
        font-size: 1.125rem;
        color: #64748b;
        margin: 0;
      }

      .test-content {
        display: grid;
        gap: 2rem;
      }

      .test-section {
        background: white;
        border-radius: 0.75rem;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: 1px solid #e2e8f0;
      }

      .test-section h2 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #4c1d95;
        margin: 0 0 1rem 0;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 0.5rem;
      }

      .feature-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .feature-list li {
        padding: 0.5rem 0;
        font-size: 0.95rem;
        color: #475569;
        border-bottom: 1px solid #f1f5f9;
      }

      .feature-list li:last-child {
        border-bottom: none;
      }

      .interaction-tests p {
        background: #f0f9ff;
        padding: 0.75rem;
        border-radius: 0.5rem;
        margin: 0.5rem 0;
        border-left: 4px solid #3b82f6;
      }

      .color-samples {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .color-sample {
        width: 120px;
        height: 80px;
        border-radius: 0.5rem;
        display: flex;
        align-items: end;
        padding: 0.5rem;
        color: white;
        font-size: 0.75rem;
        font-weight: 600;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }

      .color-sample.primary {
        background: linear-gradient(135deg, #4c1d95, #7c3aed);
      }

      .color-sample.secondary {
        background: linear-gradient(135deg, #312e81, #4c1d95);
      }

      .color-sample.accent {
        background: linear-gradient(135deg, #1e1b4b, #312e81);
      }

      @media (max-width: 768px) {
        .test-header h1 {
          font-size: 2rem;
        }

        .test-content {
          gap: 1rem;
        }

        .test-section {
          padding: 1rem;
        }

        .color-samples {
          justify-content: center;
        }
      }
    `,
  ],
})
export class TopbarTest {}
