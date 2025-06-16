/**
 * Barrel file for branch feature models
 * @description Centralized exports for all branch-related type definitions
 */

// Branch core models
export {
  CATEGORY_CONFIGS,
  DEFAULT_BRANCH,
  isBranch,
  isBranchCategory,
  type Branch,
  type BranchCategory,
  type BranchContact,
  type BranchStats,
  type CategoryConfig,
} from './branch.model';

// Branch list configuration
export {
  BRANCH_LIST_CONSTANTS,
  DEFAULT_BRANCH_LIST_CONFIG,
  isSortOption,
  isViewMode,
  type BranchFilter,
  type BranchListConfig,
  type SortOption,
  type ViewMode,
} from './branch-list-config.model';
