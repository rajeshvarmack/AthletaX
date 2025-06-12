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
  isMobileMenuOpen = signal<boolean>(false);

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
      route: '/app/branch-dashboard',
      isActive: false,
    },
    {
      id: 'players',
      label: 'Players',
      icon: 'pi-users',
      isActive: false,
      children: [
        {
          id: 'all-players',
          label: 'All Players',
          icon: 'pi-list',
          route: '/app/players',
          isActive: false,
        },
        {
          id: 'add-player',
          label: 'Add Player',
          icon: 'pi-plus',
          route: '/app/players/add',
          isActive: false,
        },
      ],
    },
    {
      id: 'coaches',
      label: 'Coaches',
      icon: 'pi-user-edit',
      isActive: false,
      children: [
        {
          id: 'all-coaches',
          label: 'All Coaches',
          icon: 'pi-list',
          route: '/app/coaches',
          isActive: false,
        },
        {
          id: 'add-coach',
          label: 'Add Coach',
          icon: 'pi-plus',
          route: '/app/coaches/add',
          isActive: false,
        },
      ],
    },
    {
      id: 'training',
      label: 'Training',
      icon: 'pi-calendar',
      isActive: false,
      children: [
        {
          id: 'schedules',
          label: 'Schedules',
          icon: 'pi-calendar-times',
          route: '/app/training/schedules',
          isActive: false,
        },
        {
          id: 'sessions',
          label: 'Sessions',
          icon: 'pi-clock',
          route: '/app/training/sessions',
          isActive: false,
        },
      ],
    },
    {
      id: 'management',
      label: 'Management',
      icon: 'pi-cog',
      route: '/app/management-dashboard',
      isActive: false,
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
  }
}
