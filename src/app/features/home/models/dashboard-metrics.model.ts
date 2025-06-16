/**
 * Dashboard metrics interface for academy overview statistics
 * @description Represents real-time metrics displayed on the home dashboard
 */
export interface DashboardMetrics {
  readonly totalPlayers: number;
  readonly activeTeams: number;
  readonly activeBranches: number;
  readonly sportsOffered: number;
  readonly monthlyGrowth: number;
}

/**
 * Type guard to validate DashboardMetrics object
 * @param obj - Object to validate
 * @returns boolean indicating if object is valid DashboardMetrics
 */
export function isDashboardMetrics(obj: unknown): obj is DashboardMetrics {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }

  const record = obj as Record<string, unknown>;
  return (
    'totalPlayers' in record &&
    'activeTeams' in record &&
    'activeBranches' in record &&
    'sportsOffered' in record &&
    'monthlyGrowth' in record &&
    typeof record['totalPlayers'] === 'number' &&
    typeof record['activeTeams'] === 'number' &&
    typeof record['activeBranches'] === 'number' &&
    typeof record['sportsOffered'] === 'number' &&
    typeof record['monthlyGrowth'] === 'number'
  );
}

/**
 * Default empty metrics for initialization
 */
export const DEFAULT_DASHBOARD_METRICS: DashboardMetrics = {
  totalPlayers: 0,
  activeTeams: 0,
  activeBranches: 0,
  sportsOffered: 0,
  monthlyGrowth: 0,
} as const;
