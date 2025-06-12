import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar, Topbar],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css'],
})
export class MainLayout {
  // Mobile sidebar state
  isMobileSidebarOpen = signal<boolean>(false);
  // Desktop sidebar minimized state
  isSidebarMinimized = signal<boolean>(false);

  // Toggle mobile sidebar
  toggleMobileSidebar() {
    this.isMobileSidebarOpen.update(isOpen => !isOpen);
  }

  // Toggle desktop sidebar minimization
  toggleSidebarMinimization() {
    this.isSidebarMinimized.update(isMinimized => !isMinimized);
  } // Close mobile sidebar
  closeMobileSidebar() {
    this.isMobileSidebarOpen.set(false);
  }
}
