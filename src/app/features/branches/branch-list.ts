import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

interface Branch {
  id: number;
  name: string;
  location: string;
  image: string;
  activePlayers: number;
  teams: number;
  category: 'Plus' | 'Advance' | 'Pro' | 'School' | 'Girls';
  isActive: boolean;
}

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './branch-list.html',
  styleUrl: './branch-list.css',
})
export class BranchList {
  private router = inject(Router);
  private toast = inject(ToastService);
  isFullWidth = false; // Default to Compact view

  constructor() {
    // Always start with compact view as default
  }
  private branchesData: Branch[] = [
    {
      id: 1,
      name: 'Alhazam',
      location: 'Riyadh',
      image: '', // Will use category icon instead
      activePlayers: 41,
      teams: 5,
      category: 'Advance' as const,
      isActive: true,
    },
    {
      id: 2,
      name: 'Almuruj',
      location: 'Riyadh',
      image: '', // Will use category icon instead
      activePlayers: 37,
      teams: 5,
      category: 'Plus' as const,
      isActive: true,
    },
    {
      id: 3,
      name: 'Alnuzha',
      location: 'Riyadh',
      image: '', // Will use category icon instead
      activePlayers: 36,
      teams: 4,
      category: 'Pro' as const,
      isActive: true,
    },
    {
      id: 4,
      name: 'Alqairawan',
      location: 'Riyadh',
      image: '', // Will use category icon instead
      activePlayers: 39,
      teams: 5,
      category: 'Advance' as const,
      isActive: true,
    },
    {
      id: 5,
      name: 'Alrayan',
      location: 'Riyadh',
      image: '', // Will use category icon instead
      activePlayers: 42,
      teams: 5,
      category: 'Plus' as const,
      isActive: true,
    },
    {
      id: 6,
      name: 'Alyarmuk',
      location: 'Riyadh',
      image: '', // Will use category icon instead
      activePlayers: 45,
      teams: 6,
      category: 'Pro' as const,
      isActive: true,
    },
    {
      id: 7,
      name: 'AlArid',
      location: 'Riyadh',
      image: '', // Will use category icon instead
      activePlayers: 35,
      teams: 5,
      category: 'Advance' as const,
      isActive: true,
    },
    {
      id: 8,
      name: 'AlDammam',
      location: 'Dammam',
      image: '', // Will use category icon instead
      activePlayers: 29,
      teams: 4,
      category: 'Plus' as const,
      isActive: true,
    },
    {
      id: 9,
      name: 'Irqah',
      location: 'Riyadh',
      image: '', // Will use category icon instead
      activePlayers: 33,
      teams: 4,
      category: 'School' as const,
      isActive: true,
    },
    {
      id: 10,
      name: 'Jeddah',
      location: 'Jeddah',
      image: '', // Will use category icon instead
      activePlayers: 38,
      teams: 5,
      category: 'Pro' as const,
      isActive: true,
    },
    {
      id: 11,
      name: 'Jeddah Girls',
      location: 'Jeddah',
      image: '', // Will use category icon instead
      activePlayers: 26,
      teams: 3,
      category: 'Girls' as const,
      isActive: true,
    },
    {
      id: 12,
      name: 'King Faisal School',
      location: 'Riyadh',
      image: '', // Will use category icon instead
      activePlayers: 31,
      teams: 4,
      category: 'School' as const,
      isActive: true,
    },
    {
      id: 13,
      name: 'Kingdom School Football',
      location: 'Riyadh',
      image: '', // Will use category icon instead
      activePlayers: 28,
      teams: 3,
      category: 'School' as const,
      isActive: true,
    },
    {
      id: 14,
      name: 'Manarat',
      location: 'Riyadh',
      image: '', // Will use category icon instead
      activePlayers: 47,
      teams: 6,
      category: 'Pro' as const,
      isActive: true,
    },
    {
      id: 15,
      name: 'Nafal',
      location: 'Riyadh',
      image: '', // Will use category icon instead
      activePlayers: 52,
      teams: 7,
      category: 'Pro' as const,
      isActive: true,
    },
    {
      id: 16,
      name: 'Najd School',
      location: 'Riyadh',
      image: '', // Will use category icon instead
      activePlayers: 44,
      teams: 6,
      category: 'School' as const,
      isActive: true,
    },
  ];

  // Get branches sorted alphabetically
  get branches(): Branch[] {
    return this.branchesData.sort((a, b) => a.name.localeCompare(b.name));
  }

  onBranchClick(_branch: Branch) {
    // Navigate to branch details or dashboard
    // this.router.navigate(['/branch', branch.id]);
  }

  onBack() {
    this.router.navigate(['/home']);
  }

  onSignOut() {
    // Add any cleanup logic here (e.g., clearing tokens, session data)
    this.toast.showSuccess(
      'Signed out',
      'You have been signed out successfully.'
    );
    this.router.navigate(['/auth/login']);
  }
  toggleViewMode() {
    this.isFullWidth = !this.isFullWidth;
  }
  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Pro':
        return 'pi-star-fill'; // Premium/Professional
      case 'Advance':
        return 'pi-crown'; // Advanced/Elite
      case 'Plus':
        return 'pi-plus-circle'; // Enhanced/Plus features
      case 'School':
        return 'pi-graduation-cap'; // Educational/Academic
      case 'Girls':
        return 'pi-user-plus'; // Girls/Women focused programs
      default:
        return 'pi-building';
    }
  }
  getCategoryColor(category: string): string {
    switch (category) {
      case 'Pro':
        return 'text-indigo-600'; // Indigo to complement purple theme
      case 'Advance':
        return 'text-purple-700'; // Deep purple for advanced
      case 'Plus':
        return 'text-blue-600'; // Blue for plus features
      case 'School':
        return 'text-violet-600'; // Violet to match purple theme
      case 'Girls':
        return 'text-pink-600'; // Pink for girls category
      default:
        return 'text-purple-600';
    }
  }
  getCategoryBgColor(category: string): string {
    switch (category) {
      case 'Pro':
        return 'bg-yellow-200 border-yellow-300 border';
      case 'Advance':
        return 'bg-purple-200 border-purple-300 border';
      case 'Plus':
        return 'bg-green-200 border-green-300 border';
      case 'School':
        return 'bg-blue-200 border-blue-300 border';
      case 'Girls':
        return 'bg-pink-200 border-pink-300 border';
      default:
        return 'bg-gray-200 border-gray-300 border';
    }
  }
  getCategoryStyles(category: string): string {
    const styles = {
      Plus: 'bg-gradient-to-r from-blue-500/95 to-blue-600/95 text-white shadow-lg ring-2 ring-blue-400/50',
      Advance:
        'bg-gradient-to-r from-purple-600/95 to-purple-700/95 text-white shadow-lg ring-2 ring-purple-400/50',
      Pro: 'bg-gradient-to-r from-indigo-500/95 to-indigo-600/95 text-white shadow-lg ring-2 ring-indigo-400/50',
      School:
        'bg-gradient-to-r from-violet-500/95 to-violet-600/95 text-white shadow-lg ring-2 ring-violet-400/50',
      Girls:
        'bg-gradient-to-r from-pink-500/95 to-pink-600/95 text-white shadow-lg ring-2 ring-pink-400/50',
    };
    return (
      styles[category as keyof typeof styles] ||
      'bg-purple-500/95 text-white shadow-lg'
    );
  }
  generateBranchLogo(name: string, color: string, iconType: string): string {
    const logoSvg = this.getLogoSvg(iconType);
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}"/>
            <stop offset="100%" stop-color="${color}90"/>
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}40"/>
            <stop offset="100%" stop-color="${color}"/>
          </linearGradient>
        </defs>
        <rect width="200" height="150" fill="url(#grad1)"/>
        <circle cx="100" cy="75" r="35" fill="url(#grad2)" opacity="0.8"/>
        <g transform="translate(100, 75)">
          ${logoSvg}
        </g>
      </svg>
    `)}`;
  }

  getLogoSvg(iconType: string): string {
    switch (iconType) {
      case 'star':
        return '<path d="M0,-20 L5.9,-6.2 L19.1,-6.2 L9.5,2.4 L15.4,16.2 L0,7.6 L-15.4,16.2 L-9.5,2.4 L-19.1,-6.2 L-5.9,-6.2 Z" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>';
      case 'crown':
        return '<path d="M-15,-5 L-8,-15 L0,-8 L8,-15 L15,-5 L15,10 L-15,10 Z" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/><circle cx="-8" cy="-15" r="2" fill="white"/><circle cx="0" cy="-8" r="2" fill="white"/><circle cx="8" cy="-15" r="2" fill="white"/>';
      case 'shield':
        return '<path d="M0,-18 L12,-12 L12,0 C12,8 8,15 0,18 C-8,15 -12,8 -12,0 L-12,-12 L0,-18 Z" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>';
      case 'trophy':
        return '<path d="M-8,-15 L8,-15 L8,-5 C8,0 4,5 0,5 C-4,5 -8,0 -8,-5 Z" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/><rect x="-2" y="5" width="4" height="8" fill="white"/><rect x="-6" y="13" width="12" height="3" fill="white"/><path d="M-12,-10 C-15,-8 -15,-2 -12,0 L-8,-2 L-8,-8 Z" fill="white" opacity="0.8"/><path d="M12,-10 C15,-8 15,-2 12,0 L8,-2 L8,-8 Z" fill="white" opacity="0.8"/>';
      case 'lightning':
        return '<path d="M-3,-18 L8,-5 L2,-5 L5,18 L-8,5 L-2,5 L-3,-18 Z" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>';
      case 'flame':
        return '<path d="M0,-18 C5,-15 8,-10 8,-5 C8,0 5,5 0,5 C-5,5 -8,0 -8,-5 C-8,-8 -6,-12 -3,-15 C-1,-17 0,-18 0,-18 Z" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/><path d="M2,-10 C4,-8 5,-5 5,-3 C5,0 3,2 0,2 C-3,2 -5,0 -5,-3 C-5,-5 -3,-8 -1,-10 Z" fill="rgba(255,255,255,0.7)"/>';
      case 'diamond':
        return '<path d="M0,-18 L12,-8 L0,18 L-12,-8 Z" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/><path d="M0,-18 L8,-8 L0,5 L-8,-8 Z" fill="rgba(255,255,255,0.7)"/>';
      case 'eagle':
        return '<path d="M0,-15 C8,-12 12,-5 12,2 C10,8 5,12 0,15 C-5,12 -10,8 -12,2 C-12,-5 -8,-12 0,-15 Z" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/><path d="M-15,-8 C-18,-5 -18,0 -15,3 L-8,0 L-8,-5 Z" fill="white" opacity="0.8"/><path d="M15,-8 C18,-5 18,0 15,3 L8,0 L8,-5 Z" fill="white" opacity="0.8"/>';
      case 'castle':
        return '<rect x="-15" y="-5" width="30" height="20" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/><rect x="-18" y="-15" width="8" height="15" fill="white"/><rect x="-3" y="-15" width="6" height="15" fill="white"/><rect x="10" y="-15" width="8" height="15" fill="white"/><rect x="-5" y="5" width="10" height="10" fill="rgba(255,255,255,0.7)"/>';
      case 'lion':
        return '<circle cx="0" cy="-8" r="10" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/><circle cx="-8" cy="-12" r="3" fill="white" opacity="0.8"/><circle cx="8" cy="-12" r="3" fill="white" opacity="0.8"/><path d="M0,2 C8,5 12,12 8,18 C4,15 0,12 0,8 C0,12 -4,15 -8,18 C-12,12 -8,5 0,2 Z" fill="white" opacity="0.9"/>';
      case 'phoenix':
        return '<path d="M0,-18 C8,-15 12,-8 10,0 C8,8 4,15 0,18 C-4,15 -8,8 -10,0 C-12,-8 -8,-15 0,-18 Z" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/><path d="M-15,-10 C-18,-5 -15,0 -10,-2 L-8,-8 Z" fill="white" opacity="0.8"/><path d="M15,-10 C18,-5 15,0 10,-2 L8,-8 Z" fill="white" opacity="0.8"/><path d="M0,-5 C3,-8 6,-5 6,-2 C6,2 3,5 0,5 C-3,5 -6,2 -6,-2 C-6,-5 -3,-8 0,-5 Z" fill="rgba(255,255,255,0.7)"/>';
      case 'royal':
        return '<path d="M0,-18 L8,-12 L15,-15 L12,-8 L18,-5 L10,-2 L12,5 L5,2 L0,8 L-5,2 L-12,5 L-10,-2 L-18,-5 L-12,-8 L-15,-15 L-8,-12 Z" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>';
      case 'wave':
        return '<path d="M-18,-5 C-12,-10 -6,-2 0,-5 C6,-8 12,0 18,-5 L18,5 C12,10 6,2 0,5 C-6,8 -12,0 -18,5 Z" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/><path d="M-18,0 C-12,-5 -6,3 0,0 C6,-3 12,5 18,0 L18,10 C12,15 6,7 0,10 C-6,13 -12,5 -18,10 Z" fill="rgba(255,255,255,0.7)"/>';
      case 'mountain':
        return '<path d="M0,-18 L15,15 L-15,15 Z" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/><path d="M0,-18 L8,5 L-8,5 Z" fill="rgba(255,255,255,0.7)"/><path d="M-8,-8 L-3,5 L-13,5 Z" fill="white" opacity="0.8"/>';
      case 'flower':
        return '<circle cx="0" cy="0" r="3" fill="white"/><circle cx="0" cy="-8" r="4" fill="white" opacity="0.8"/><circle cx="7" cy="-4" r="4" fill="white" opacity="0.8"/><circle cx="7" cy="4" r="4" fill="white" opacity="0.8"/><circle cx="0" cy="8" r="4" fill="white" opacity="0.8"/><circle cx="-7" cy="4" r="4" fill="white" opacity="0.8"/><circle cx="-7" cy="-4" r="4" fill="white" opacity="0.8"/>';
      case 'tree':
        return '<path d="M0,-18 C8,-15 12,-8 8,0 C12,-5 15,2 10,8 C15,5 18,12 12,15 L-12,15 C-18,12 -15,5 -10,8 C-15,2 -12,-5 -8,0 C-12,-8 -8,-15 0,-18 Z" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/><rect x="-2" y="15" width="4" height="8" fill="white"/>';
      default:
        return '<circle cx="0" cy="0" r="15" fill="white" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>';
    }
  }

  generatePlaceholderImage(name: string, color: string): string {
    const initials = name.substring(0, 2).toUpperCase();
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="url(#grad1)"/>
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}"/>
            <stop offset="100%" stop-color="${color}80"/>
          </linearGradient>
        </defs>
        <circle cx="100" cy="75" r="30" fill="white" fill-opacity="0.3"/>
        <text x="100" y="85" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${initials}</text>
        <svg x="85" y="25" width="30" height="30" viewBox="0 0 24 24" fill="white" fill-opacity="0.7">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </svg>
    `)}`;
  }

  getDefaultImage(): string {
    return this.generatePlaceholderImage('BR', '#6b7280');
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = this.getDefaultImage();
    }
  }
  getCategoryCardClass(category: string): string {
    const cardStyles = {
      Plus: 'bg-gradient-to-br from-blue-25 to-white border-blue-200/40',
      Advance: 'bg-gradient-to-br from-purple-25 to-white border-purple-200/40',
      Pro: 'bg-gradient-to-br from-indigo-25 to-white border-indigo-200/40',
      School: 'bg-gradient-to-br from-violet-25 to-white border-violet-200/40',
      Girls: 'bg-gradient-to-br from-pink-25 to-white border-pink-200/40',
    };
    return (
      cardStyles[category as keyof typeof cardStyles] ||
      'bg-gradient-to-br from-gray-25 to-white border-gray-200/40'
    );
  }
  getCategoryHeaderClass(category: string): string {
    const headerStyles = {
      Plus: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
      Advance: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700',
      Pro: 'bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600',
      School: 'bg-gradient-to-br from-violet-400 via-violet-500 to-violet-600',
      Girls: 'bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600',
    };
    return (
      headerStyles[category as keyof typeof headerStyles] ||
      'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600'
    );
  }
  getCategoryOverlayClass(category: string): string {
    const overlayStyles = {
      Plus: 'bg-gradient-to-br from-purple-400/12 to-purple-600/8',
      Advance: 'bg-gradient-to-br from-purple-500/15 to-purple-700/10',
      Pro: 'bg-gradient-to-br from-purple-600/18 to-purple-800/12',
      School: 'bg-gradient-to-br from-purple-300/8 to-purple-500/6',
      Girls: 'bg-gradient-to-br from-purple-400/12 to-pink-500/8',
    };
    return (
      overlayStyles[category as keyof typeof overlayStyles] ||
      'bg-gradient-to-br from-purple-400/12 to-purple-600/8'
    );
  }
  getCategoryContentClass(category: string): string {
    const contentStyles = {
      Plus: 'bg-gradient-to-br from-white to-purple-25/60 border-t border-purple-100/40',
      Advance:
        'bg-gradient-to-br from-white to-purple-50/70 border-t border-purple-200/50',
      Pro: 'bg-gradient-to-br from-white to-purple-75/80 border-t border-purple-300/60',
      School:
        'bg-gradient-to-br from-white to-purple-25/40 border-t border-purple-100/30',
      Girls:
        'bg-gradient-to-br from-white to-purple-50/50 border-t border-purple-200/40',
    };
    return (
      contentStyles[category as keyof typeof contentStyles] ||
      'bg-gradient-to-br from-white to-purple-25/60 border-t border-purple-100/40'
    );
  }
}
