/**
 * Quick action interface for home page navigation cards
 * @description Represents interactive action cards with routing and metrics
 */
export interface QuickAction {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly route: string;
  readonly color: 'primary' | 'secondary';
  readonly metrics?: string;
  readonly ariaLabel: string;
}

/**
 * Type guard to validate QuickAction object
 * @param obj - Object to validate
 * @returns boolean indicating if object is valid QuickAction
 */
export function isQuickAction(obj: unknown): obj is QuickAction {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }

  const record = obj as Record<string, unknown>;
  return (
    'id' in record &&
    'title' in record &&
    'description' in record &&
    'icon' in record &&
    'route' in record &&
    'color' in record &&
    'ariaLabel' in record &&
    typeof record['id'] === 'string' &&
    typeof record['title'] === 'string' &&
    typeof record['description'] === 'string' &&
    typeof record['icon'] === 'string' &&
    typeof record['route'] === 'string' &&
    typeof record['ariaLabel'] === 'string' &&
    (record['color'] === 'primary' || record['color'] === 'secondary') &&
    (record['metrics'] === undefined || typeof record['metrics'] === 'string')
  );
}

/**
 * Default quick actions for the home page
 */
export const DEFAULT_QUICK_ACTIONS: readonly QuickAction[] = [
  {
    id: 'manage-players',
    title: 'Manage Players',
    description: 'Add, edit, and organize player profiles',
    icon: 'pi pi-users',
    route: '/players',
    color: 'primary',
    metrics: '1,247 Active',
    ariaLabel: 'Navigate to player management with 1,247 active players',
  },
  {
    id: 'manage-teams',
    title: 'Team Management',
    description: 'Create and manage team rosters',
    icon: 'pi pi-flag',
    route: '/teams',
    color: 'secondary',
    metrics: '89 Teams',
    ariaLabel: 'Navigate to team management with 89 active teams',
  },
  {
    id: 'schedule-events',
    title: 'Schedule & Events',
    description: 'Plan training sessions and matches',
    icon: 'pi pi-calendar',
    route: '/schedule',
    color: 'primary',
    metrics: '15 This Week',
    ariaLabel: 'Navigate to schedule management with 15 events this week',
  },
  {
    id: 'age-groups',
    title: 'Age Groups',
    description: 'Organize players by age categories',
    icon: 'pi pi-sitemap',
    route: '/age-groups',
    color: 'secondary',
    metrics: '12 Categories',
    ariaLabel: 'Navigate to age group management with 12 categories',
  },
  {
    id: 'branch-management',
    title: 'Branch Management',
    description: 'Manage academy locations and facilities',
    icon: 'pi pi-building',
    route: '/branches',
    color: 'primary',
    metrics: '5 Locations',
    ariaLabel: 'Navigate to branch management with 5 active locations',
  },
  {
    id: 'reports',
    title: 'Reports & Analytics',
    description: 'View performance metrics and insights',
    icon: 'pi pi-chart-bar',
    route: '/reports',
    color: 'secondary',
    metrics: 'Real-time',
    ariaLabel: 'Navigate to reports and analytics with real-time data',
  },
] as const;
