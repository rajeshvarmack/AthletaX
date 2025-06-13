export interface AgeGroup {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  activity: Activity;
  status: AgeGroupStatus;
  description?: string;
  participantCount: number;
  createdDate: Date;
  updatedDate: Date;
  lastModified: Date;
  isActive: boolean;
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

export interface AgeGroupFilters {
  activity: Activity | null;
  status: AgeGroupStatus | null;
  searchTerm: string;
}

export type AgeGroupStatus = 'Active' | 'InActive';

export interface AgeGroupStatusOption {
  label: string;
  value: AgeGroupStatus;
  severity: 'success' | 'secondary' | 'warning' | 'danger';
}

export interface ActivityOption {
  label: string;
  value: Activity | null;
  group?: string;
}

export interface TableColumn {
  field: keyof AgeGroup | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'status' | 'badge' | 'actions';
}

export interface AgeGroupFormData {
  name: string;
  minAge: number;
  maxAge: number;
  activity: Activity | null;
  status: AgeGroupStatus;
  description: string;
  isActive: boolean;
}

export interface PaginationState {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

export interface FilterMatchMode {
  value: string;
  label: string;
}

export interface SortEvent {
  field: string;
  order: number;
}

export interface FilterEvent {
  filters: Record<string, FilterMetadata>;
  first: number;
  rows: number;
  sortField?: string;
  sortOrder?: number;
  multiSortMeta?: SortMeta[];
  globalFilter?: string;
}

export interface FilterMetadata {
  value: unknown;
  matchMode: string;
}

export interface SortMeta {
  field: string;
  order: number;
}
