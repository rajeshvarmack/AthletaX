/**
 * View mode types for branch list display
 */
export type ViewMode = 'compact' | 'full-width';

/**
 * Sort options for branch list
 */
export type SortOption = 'name' | 'location' | 'players' | 'teams' | 'category';

/**
 * Filter options for branch list
 */
export interface BranchFilter {
  readonly category?: string;
  readonly location?: string;
  readonly minPlayers?: number;
  readonly maxPlayers?: number;
  readonly activeOnly?: boolean;
}

/**
 * Branch list view configuration
 */
export interface BranchListConfig {
  readonly viewMode: ViewMode;
  readonly sortBy: SortOption;
  readonly sortDirection: 'asc' | 'desc';
  readonly filter: BranchFilter;
  readonly showInactive: boolean;
}

/**
 * UI constants for branch list component
 */
export const BRANCH_LIST_CONSTANTS = {
  ANIMATION_DELAYS: {
    CARD_BASE: 50,
    NAVIGATION: 300,
    SIGNOUT: 1000,
  },
  GRID_BREAKPOINTS: {
    COMPACT: {
      SM: 2,
      MD: 2,
      LG: 3,
      XL: 4,
    },
    FULL_WIDTH: {
      SM: 2,
      MD: 3,
      LG: 4,
      XL: 5,
      '2XL': 6,
    },
  },
  TOAST_MESSAGES: {
    BRANCH_SELECTED: 'Branch Selected',
    SIGN_OUT_SUCCESS: 'Signed out',
    SIGN_OUT_MESSAGE: 'You have been signed out successfully.',
  },
} as const;

/**
 * Type guard for ViewMode
 */
export function isViewMode(value: unknown): value is ViewMode {
  return typeof value === 'string' && ['compact', 'full-width'].includes(value);
}

/**
 * Type guard for SortOption
 */
export function isSortOption(value: unknown): value is SortOption {
  return (
    typeof value === 'string' &&
    ['name', 'location', 'players', 'teams', 'category'].includes(value)
  );
}

/**
 * Default branch list configuration
 */
export const DEFAULT_BRANCH_LIST_CONFIG: BranchListConfig = {
  viewMode: 'compact',
  sortBy: 'name',
  sortDirection: 'asc',
  filter: {
    activeOnly: true,
  },
  showInactive: false,
} as const;
