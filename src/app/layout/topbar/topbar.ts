import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { UserProfile } from './models/topbar.models';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css'],
})
export class Topbar {
  private router = inject(Router);
  private toast = inject(ToastService);  // Output event for mobile menu toggle
  menuToggle = output<void>();
  // Output event for sidebar toggle (desktop)
  sidebarToggle = output<void>();
  // Output event for content width toggle
  contentWidthToggle = output<boolean>();

  // Input for sidebar minimized state
  isSidebarMinimized = input<boolean>(false);

  // Content width state signal
  isContentCompact = signal<boolean>(false);

  // User profile signal
  currentUser = signal<UserProfile>({
    id: '1',
    name: 'Super Admin',
    email: 'superadmin@gmail.com',
    role: 'Super Administrator',
    isActive: true,
  });

  // Dropdown states
  isUserMenuOpen = signal<boolean>(false);
  isNotificationsOpen = signal<boolean>(false);

  // Sample notifications
  notifications = signal([
    {
      id: '1',
      title: 'New Player Registration',
      message: 'John Doe has registered for Football Academy',
      type: 'info' as const,
      timestamp: new Date(),
      isRead: false,
    },
    {
      id: '2',
      title: 'Payment Received',
      message: 'Monthly fee payment received from Jane Smith',
      type: 'success' as const,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false,
    },
    {
      id: '3',
      title: 'Session Reminder',
      message: 'Basketball session starts in 30 minutes',
      type: 'warning' as const,
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isRead: true,
    },
  ]);
  // Toggle mobile menu
  toggleMobileMenu() {
    this.menuToggle.emit();
  }
  // Toggle desktop sidebar
  toggleDesktopSidebar() {
    this.sidebarToggle.emit();
  }

  // Toggle content width
  toggleContentWidth() {
    this.isContentCompact.update(isCompact => !isCompact);
    this.contentWidthToggle.emit(this.isContentCompact());
  }

  // Toggle user menu dropdown
  toggleUserMenu() {
    this.isUserMenuOpen.update(isOpen => !isOpen);
    this.isNotificationsOpen.set(false);
  }

  // Toggle notifications dropdown
  toggleNotifications() {
    this.isNotificationsOpen.update(isOpen => !isOpen);
    this.isUserMenuOpen.set(false);
  }

  // Close dropdowns when clicking outside
  closeDropdowns() {
    this.isUserMenuOpen.set(false);
    this.isNotificationsOpen.set(false);
  }

  // Navigation methods
  navigateToProfile() {
    this.router.navigate(['/profile']);
    this.closeDropdowns();
    this.toast.showInfo('Navigation', 'Navigating to profile');
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
    this.closeDropdowns();
    this.toast.showInfo('Navigation', 'Navigating to settings');
  }

  logout() {
    this.closeDropdowns();
    this.toast.showSuccess('Logout', 'Successfully logged out');
    this.router.navigate(['/auth/login']);
  }

  // Mark notification as read
  markAsRead(notificationId: string, event: Event) {
    event.stopPropagation();
    this.notifications.update(notifications =>
      notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }

  // Get unread notification count
  getUnreadCount(): number {
    return this.notifications().filter(n => !n.isRead).length;
  }

  // Get user initials for avatar
  getUserInitials(): string {
    const user = this.currentUser();
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
