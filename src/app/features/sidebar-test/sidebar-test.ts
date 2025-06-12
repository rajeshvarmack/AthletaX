import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-sidebar-test',
  standalone: true,
  imports: [CommonModule, Sidebar],
  template: `
    <div class="test-container">
      <app-sidebar></app-sidebar>

      <div class="test-content">
        <div class="test-header">
          <h1>🧪 Sidebar Testing Dashboard</h1>
          <p>Use this page to test all sidebar features</p>
        </div>

        <div class="test-sections">
          <!-- Navigation Test -->
          <div class="test-section">
            <h2>📋 Navigation Menu Test</h2>
            <div class="test-checklist">
              <label class="test-item">
                <input type="checkbox" /> Click Dashboard - should navigate and
                show active state
              </label>
              <label class="test-item">
                <input type="checkbox" /> Click Players - should navigate and
                show active state
              </label>
              <label class="test-item">
                <input type="checkbox" /> Click Invoices - should navigate and
                show active state
              </label>
              <label class="test-item">
                <input type="checkbox" /> Click Masters - should expand submenu
              </label>
              <label class="test-item">
                <input type="checkbox" /> Click Settings - should expand submenu
              </label>
              <label class="test-item">
                <input type="checkbox" /> Test all submenu items (Sessions, Age
                Groups, etc.)
              </label>
            </div>
          </div>

          <!-- Dropdown Test -->
          <div class="test-section">
            <h2>🏢 Dropdowns Test</h2>
            <div class="test-checklist">
              <label class="test-item">
                <input type="checkbox" /> Branch selector opens dropdown
              </label>
              <label class="test-item">
                <input type="checkbox" /> Search functionality works in branch
                selector
              </label>
              <label class="test-item">
                <input type="checkbox" /> Branch selection updates header
                subtitle
              </label>
              <label class="test-item">
                <input type="checkbox" /> Sport type selector opens dropdown
              </label>
              <label class="test-item">
                <input type="checkbox" /> Sport selection shows toast
                notification
              </label>
              <label class="test-item">
                <input type="checkbox" /> Icons appear in dropdown options
              </label>
            </div>
          </div>

          <!-- Mobile Test -->
          <div class="test-section">
            <h2>📱 Mobile Responsive Test</h2>
            <div class="test-checklist">
              <label class="test-item">
                <input type="checkbox" /> Hamburger menu appears on mobile (<
                768px)
              </label>
              <label class="test-item">
                <input type="checkbox" /> Hamburger menu toggles sidebar
                visibility
              </label>
              <label class="test-item">
                <input type="checkbox" /> Backdrop closes menu when clicked
              </label>
              <label class="test-item">
                <input type="checkbox" /> Sidebar slides smoothly in/out
              </label>
              <label class="test-item">
                <input type="checkbox" /> All touch interactions work properly
              </label>
            </div>
          </div>

          <!-- Accessibility Test -->
          <div class="test-section">
            <h2>♿ Accessibility Test</h2>
            <div class="test-checklist">
              <label class="test-item">
                <input type="checkbox" /> Tab navigation works through all menu
                items
              </label>
              <label class="test-item">
                <input type="checkbox" /> Enter/Space keys activate menu items
              </label>
              <label class="test-item">
                <input type="checkbox" /> Screen reader announces menu states
              </label>
              <label class="test-item">
                <input type="checkbox" /> Focus indicators are visible
              </label>
              <label class="test-item">
                <input type="checkbox" /> ARIA labels are present
              </label>
            </div>
          </div>

          <!-- Performance Test -->
          <div class="test-section">
            <h2>⚡ Performance Test</h2>
            <div class="test-checklist">
              <label class="test-item">
                <input type="checkbox" /> Menu animations are smooth (60fps)
              </label>
              <label class="test-item">
                <input type="checkbox" /> No console errors in browser
              </label>
              <label class="test-item">
                <input type="checkbox" /> Dropdown search is responsive
              </label>
              <label class="test-item">
                <input type="checkbox" /> Memory usage stays stable
              </label>
            </div>
          </div>
        </div>

        <div class="test-tools">
          <h2>🛠 Testing Tools</h2>
          <div class="tool-buttons">
            <button
              onclick="window.open('chrome://inspect/#devices', '_blank')"
              class="tool-btn"
            >
              📱 Mobile Inspector
            </button>
            <button
              onclick="console.log('Testing console output')"
              class="tool-btn"
            >
              🔍 Console Check
            </button>
            <button
              onclick="navigator.deviceMemory && console.log('Memory:', navigator.deviceMemory + 'GB')"
              class="tool-btn"
            >
              🧠 Memory Info
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .test-container {
        display: flex;
        min-height: 100vh;
        background: #f8fafc;
      }

      .test-content {
        flex: 1;
        margin-left: 280px;
        padding: 2rem;
        max-width: 1200px;
      }

      .test-header {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .test-header h1 {
        color: #4c1d95;
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
      }

      .test-header p {
        color: #6b7280;
        margin: 0;
      }

      .test-sections {
        display: grid;
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .test-section {
        background: white;
        padding: 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .test-section h2 {
        color: #4c1d95;
        margin: 0 0 1rem 0;
        font-size: 1.25rem;
      }

      .test-checklist {
        display: grid;
        gap: 0.75rem;
      }

      .test-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .test-item:hover {
        background: #f3f4f6;
      }

      .test-item input[type='checkbox'] {
        width: 1.25rem;
        height: 1.25rem;
        accent-color: #4c1d95;
      }

      .test-tools {
        background: white;
        padding: 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .test-tools h2 {
        color: #4c1d95;
        margin: 0 0 1rem 0;
        font-size: 1.25rem;
      }

      .tool-buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .tool-btn {
        padding: 0.75rem 1.5rem;
        background: #4c1d95;
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
      }

      .tool-btn:hover {
        background: #3a1c71;
        transform: translateY(-1px);
      }

      /* Mobile responsiveness for test page */
      @media (max-width: 768px) {
        .test-content {
          margin-left: 0;
          padding: 1rem;
        }

        .test-header h1 {
          font-size: 1.5rem;
        }

        .tool-buttons {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class SidebarTest {}
