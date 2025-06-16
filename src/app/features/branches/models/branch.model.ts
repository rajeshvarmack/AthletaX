/**
 * Branch interface for academy location management
 * @description Represents a branch location with category-based organization
 */
export interface Branch {
  readonly id: number;
  readonly name: string;
  readonly location: string;
  readonly activePlayers: number;
  readonly teams: number;
  readonly category: BranchCategory;
  readonly isActive: boolean;
  readonly description?: string;
  readonly contactInfo?: BranchContact;
  readonly facilities?: readonly string[];
}

/**
 * Branch category types for classification
 */
export type BranchCategory = 'Plus' | 'Advance' | 'Pro' | 'School' | 'Girls';

/**
 * Branch contact information
 */
export interface BranchContact {
  readonly phone?: string;
  readonly email?: string;
  readonly manager?: string;
}

/**
 * Branch statistics for dashboard display
 */
export interface BranchStats {
  readonly totalBranches: number;
  readonly activeBranches: number;
  readonly totalPlayers: number;
  readonly totalTeams: number;
  readonly categoriesCount: Record<BranchCategory, number>;
}

/**
 * Category configuration for UI styling and display
 */
export interface CategoryConfig {
  readonly icon: string;
  readonly color: string;
  readonly displayName: string;
  readonly description: string;
}

/**
 * Type guard to validate Branch object
 * @param obj - Object to validate
 * @returns boolean indicating if object is valid Branch
 */
export function isBranch(obj: unknown): obj is Branch {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }

  const record = obj as Record<string, unknown>;
  return (
    'id' in record &&
    'name' in record &&
    'location' in record &&
    'activePlayers' in record &&
    'teams' in record &&
    'category' in record &&
    'isActive' in record &&
    typeof record['id'] === 'number' &&
    typeof record['name'] === 'string' &&
    typeof record['location'] === 'string' &&
    typeof record['activePlayers'] === 'number' &&
    typeof record['teams'] === 'number' &&
    typeof record['isActive'] === 'boolean' &&
    isBranchCategory(record['category'])
  );
}

/**
 * Type guard to validate BranchCategory
 * @param value - Value to validate
 * @returns boolean indicating if value is valid BranchCategory
 */
export function isBranchCategory(value: unknown): value is BranchCategory {
  return (
    typeof value === 'string' &&
    ['Plus', 'Advance', 'Pro', 'School', 'Girls'].includes(value)
  );
}

/**
 * Default empty branch for initialization
 */
export const DEFAULT_BRANCH: Branch = {
  id: 0,
  name: '',
  location: '',
  activePlayers: 0,
  teams: 0,
  category: 'Plus',
  isActive: true,
} as const;

/**
 * Category configurations for consistent UI theming
 */
export const CATEGORY_CONFIGS: Record<BranchCategory, CategoryConfig> = {
  Plus: {
    icon: 'pi-plus-circle',
    color: 'blue',
    displayName: 'Plus',
    description: 'Enhanced programs with additional features',
  },
  Advance: {
    icon: 'pi-crown',
    color: 'purple',
    displayName: 'Advanced',
    description: 'Elite training for advanced athletes',
  },
  Pro: {
    icon: 'pi-star-fill',
    color: 'indigo',
    displayName: 'Professional',
    description: 'Professional-level training and facilities',
  },
  School: {
    icon: 'pi-graduation-cap',
    color: 'violet',
    displayName: 'School',
    description: 'Educational institution partnerships',
  },
  Girls: {
    icon: 'pi-user-plus',
    color: 'pink',
    displayName: 'Girls',
    description: 'Specialized programs for female athletes',
  },
} as const;
