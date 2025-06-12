import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from '../../services/toast.service';
import { Branch, MenuItem, SportType } from './models/sidebar.models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgSelectModule, FormsModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);

  // Input for external mobile control
  isMobileOpen = input<boolean>(false);
  // Input for minimized state control
  isMinimized = input<boolean>(false);

  // Output for mobile close event
  mobileClose = output<void>();

  // Using signals for reactive state management
  selectedBranch = signal<Branch | null>(null);
  selectedSport = signal<SportType | null>(null);
  isMobileMenuOpen = signal<boolean>(false); // Hover popup state for minimized sidebar
  hoveredItem = signal<MenuItem | null>(null);
  hoverTimeout: ReturnType<typeof setTimeout> | null = null;
  hideTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Sync external mobile open state with internal state
    effect(() => {
      this.isMobileMenuOpen.set(this.isMobileOpen());
    });
  }
  // Method to check if sidebar is minimized
  isMinimizedState(): boolean {
    return this.isMinimized();
  }
  // Menu items configuration
  menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'pi-chart-line',
      route: '/app/dashboard',
      isActive: false,
    },
    {
      id: 'players',
      label: 'Players',
      icon: 'pi-users',
      route: '/app/players',
      isActive: false,
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: 'pi-file-pdf',
      route: '/app/invoices',
      isActive: false,
    },
    {
      id: 'masters',
      label: 'Masters',
      icon: 'pi-database',
      isActive: false,
      children: [
        {
          id: 'branch',
          label: 'Branch',
          icon: 'pi-building',
          route: '/app/masters/branch',
          isActive: false,
        },
        {
          id: 'age-groups',
          label: 'Age Groups',
          icon: 'pi-users',
          route: '/app/masters/age-groups',
          isActive: false,
        },
        {
          id: 'sessions',
          label: 'Sessions',
          icon: 'pi-clock',
          route: '/app/masters/sessions',
          isActive: false,
        },
        {
          id: 'membership-types',
          label: 'Membership Types',
          icon: 'pi-id-card',
          route: '/app/masters/membership-types',
          isActive: false,
        },
        {
          id: 'products',
          label: 'Products',
          icon: 'pi-box',
          route: '/app/masters/products',
          isActive: false,
        },
        {
          id: 'product-bundles',
          label: 'Product Bundles',
          icon: 'pi-th-large',
          route: '/app/masters/product-bundles',
          isActive: false,
        },
        {
          id: 'discounts',
          label: 'Discounts',
          icon: 'pi-percentage',
          route: '/app/masters/discounts',
          isActive: false,
        },
        {
          id: 'waiting-list',
          label: 'Waiting List',
          icon: 'pi-list',
          route: '/app/masters/waiting-list',
          isActive: false,
        },
        {
          id: 'sports-types',
          label: 'Sports Types',
          icon: 'pi-circle',
          route: '/app/masters/sports-types',
          isActive: false,
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'pi-cog',
      isActive: false,
      children: [
        {
          id: 'company',
          label: 'Company',
          icon: 'pi-building',
          route: '/app/settings/company',
          isActive: false,
        },
        {
          id: 'users',
          label: 'Users',
          icon: 'pi-users',
          route: '/app/settings/users',
          isActive: false,
        },
        {
          id: 'roles',
          label: 'Roles',
          icon: 'pi-user-edit',
          route: '/app/settings/roles',
          isActive: false,
        },
        {
          id: 'permissions',
          label: 'Permissions',
          icon: 'pi-shield',
          route: '/app/settings/permissions',
          isActive: false,
        },
      ],
    },
  ];

  // Available branches
  branches: Branch[] = [
    { id: 1, name: 'Downtown Branch', location: 'City Center', isActive: true },
    { id: 2, name: 'North Branch', location: 'North District', isActive: true },
    { id: 3, name: 'East Branch', location: 'East District', isActive: true },
    { id: 4, name: 'West Branch', location: 'West District', isActive: true },
  ];

  // Available sport types
  sportTypes: SportType[] = [
    { id: 1, name: 'Football', icon: 'pi-circle', isActive: true },
    { id: 2, name: 'Basketball', icon: 'pi-circle', isActive: true },
    { id: 3, name: 'Tennis', icon: 'pi-circle', isActive: true },
    { id: 4, name: 'Swimming', icon: 'pi-circle', isActive: true },
  ];

  ngOnInit() {
    // Set default selections using signals
    this.selectedBranch.set(this.branches[0]);
    this.selectedSport.set(this.sportTypes[0]);
    this.setActiveMenuItem();
  }
  toggleMenuItem(item: MenuItem, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // In minimized state, don't allow submenu expansion
    // Just navigate to the item if it has a route, or to the first child route
    if (this.isMinimizedState()) {
      if (item.route) {
        this.navigateToRoute(item);
      } else if (item.children && item.children.length > 0) {
        // Navigate to the first child route
        const firstChild = item.children[0];
        if (firstChild.route) {
          this.navigateToRoute(firstChild);
        }
      }
      return;
    }

    if (item.children) {
      item.isExpanded = !item.isExpanded;
      // Close other expanded items at the same level
      this.menuItems.forEach(menuItem => {
        if (menuItem.id !== item.id && menuItem.children) {
          menuItem.isExpanded = false;
        }
      });
    } else if (item.route) {
      this.navigateToRoute(item);
    }
  }

  toggleSubMenuItem(parentItem: MenuItem, subItem: MenuItem, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (subItem.children) {
      subItem.isExpanded = !subItem.isExpanded;
    } else if (subItem.route) {
      this.navigateToRoute(subItem);
    }
  }

  navigateToRoute(item: MenuItem) {
    if (item.route) {
      // Mark item as active
      this.setActiveMenuItem(item.id);
      this.router.navigate([item.route]);
      this.toast.show({
        type: 'info',
        title: 'Navigation',
        message: `Navigating to ${item.label}`,
      });
    }
  }

  setActiveMenuItem(activeId?: string) {
    // Reset all active states
    this.menuItems.forEach(item => {
      item.isActive = item.id === activeId;
      if (item.children) {
        item.children.forEach(child => {
          child.isActive = child.id === activeId;
        });
      }
    });
  }

  onBranchChange(branch: Branch) {
    this.selectedBranch.set(branch);
    this.toast.show({
      type: 'success',
      title: 'Branch Selected',
      message: `Selected ${branch.name}`,
    });
  }

  onSportChange(sport: SportType) {
    this.selectedSport.set(sport);
    this.toast.show({
      type: 'success',
      title: 'Sport Selected',
      message: `Selected ${sport.name}`,
    });
  }

  // Mobile menu toggle
  toggleMobileMenu() {
    const wasOpen = this.isMobileMenuOpen();
    this.isMobileMenuOpen.update(isOpen => !isOpen);

    // If we're closing the menu, emit the close event
    if (wasOpen) {
      this.mobileClose.emit();
    }
  }

  // Close mobile menu (called from backdrop or external controls)
  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
    this.mobileClose.emit();
  }
  // Helper method for ng-select option display
  getDisplayText(item: Branch | SportType | null): string {
    return item?.name || 'Select Option';
  } // Show hover popup for minimized sidebar
  showHoverPopup(item: MenuItem, event?: MouseEvent) {
    if (!this.isMinimizedState()) return;

    // Clear any existing timeouts
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    // Set timeout to show popup after a brief delay
    this.hoverTimeout = setTimeout(() => {
      this.hoveredItem.set(item);

      // Position the popup next to the hovered item
      if (event?.target) {
        this.positionPopup(event.target as HTMLElement);
      }
    }, 150);
  }

  // Hide hover popup with delay
  hideHoverPopup() {
    // Clear show timeout if it's still pending
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // Set a longer delay before hiding to allow mouse movement to popup
    this.hideTimeout = setTimeout(() => {
      this.hoveredItem.set(null);
    }, 300);
  }

  // Keep popup visible when hovering over it
  keepPopupVisible() {
    // Clear all timeouts to keep popup visible
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  // Hide popup immediately when leaving popup area
  hidePopupImmediately() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    this.hoveredItem.set(null);
  }

  // Position popup relative to hovered item
  positionPopup(targetElement: HTMLElement) {
    // Use setTimeout to ensure popup is rendered before positioning
    setTimeout(() => {
      const popup = document.querySelector(
        '.minimized-hover-popup'
      ) as HTMLElement;
      if (!popup) return;

      const rect = targetElement.getBoundingClientRect();
      const popupHeight = popup.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate top position, ensuring popup stays within viewport
      let top = rect.top;
      if (top + popupHeight > viewportHeight) {
        top = viewportHeight - popupHeight - 10;
      }
      if (top < 10) {
        top = 10;
      }

      popup.style.top = `${top}px`;
    }, 0);
  }
}
