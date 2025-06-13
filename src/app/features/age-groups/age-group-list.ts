import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

// ng-select
import { NgSelectModule } from '@ng-select/ng-select';

// Services
import { ConfirmationService, MessageService } from 'primeng/api';

// Local imports
import { AgeGroupService } from './age-group.service';
import {
  Activity,
  ActivityOption,
  AgeGroup,
  AgeGroupFilters,
  AgeGroupStatus,
  TableColumn,
} from './models/age-group.models';

@Component({
  selector: 'app-age-group-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ProgressSpinnerModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    FileUploadModule,
    DialogModule,
    DropdownModule,
    CheckboxModule,
    CalendarModule,
    InputNumberModule,
    PaginatorModule,
    NgSelectModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './age-group-list.html',
  styleUrls: ['./age-group-list.css'],
})
export class AgeGroupList implements OnInit {
  @ViewChild('ageGroupTable') ageGroupTable!: Table;

  // Injected services
  private ageGroupService = inject(AgeGroupService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  // Signals
  ageGroups = signal<AgeGroup[]>([]);
  selectedAgeGroups = signal<AgeGroup[]>([]);
  loading = signal<boolean>(false);
  globalFilter = signal<string>('');

  // Filter signals
  selectedActivity = signal<Activity | null>(null);
  selectedStatus = signal<AgeGroupStatus | null>(null);

  // Options
  activityOptions = signal<ActivityOption[]>([]);
  statusOptions = signal<
    { label: string; value: AgeGroupStatus | null; severity: string }[]
  >([]);

  // Table configuration
  columns = signal<TableColumn[]>([
    {
      field: 'name',
      header: 'Name',
      sortable: true,
      filterable: true,
      width: '20%',
    },
    {
      field: 'minAge',
      header: 'Min Age',
      sortable: true,
      width: '10%',
      type: 'number',
    },
    {
      field: 'maxAge',
      header: 'Max Age',
      sortable: true,
      width: '10%',
      type: 'number',
    },
    {
      field: 'activity.name',
      header: 'Activity',
      sortable: true,
      filterable: true,
      width: '15%',
    },
    {
      field: 'status',
      header: 'Status',
      sortable: true,
      width: '12%',
      type: 'status',
    },
    {
      field: 'participantCount',
      header: 'Participants',
      sortable: true,
      width: '12%',
      type: 'number',
    },
    {
      field: 'createdDate',
      header: 'Created',
      sortable: true,
      width: '12%',
      type: 'date',
    },
    { field: 'actions', header: 'Actions', width: '9%', type: 'actions' },
  ]);

  // Pagination
  first = signal<number>(0);
  rows = signal<number>(10);
  totalRecords = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(8);

  // Form controls for search
  searchControl = new FormControl('');

  // Computed values
  filteredAgeGroups = computed(() => {
    let filtered = this.ageGroups();
    const searchTerm = this.globalFilter().toLowerCase();
    const activity = this.selectedActivity();
    const status = this.selectedStatus();

    if (searchTerm) {
      filtered = filtered.filter(
        group =>
          group.name.toLowerCase().includes(searchTerm) ||
          group.description?.toLowerCase().includes(searchTerm) ||
          group.activity.name.toLowerCase().includes(searchTerm)
      );
    }

    if (activity) {
      filtered = filtered.filter(group => group.activity.id === activity.id);
    }

    if (status) {
      filtered = filtered.filter(group => group.status === status);
    }

    this.totalRecords.set(filtered.length);
    return filtered;
  });

  // Computed properties for stats and pagination
  activeGroupsCount = computed(
    () => this.ageGroups().filter(g => g.status === 'Active').length
  );

  totalParticipants = computed(() =>
    this.ageGroups().reduce((sum, g) => sum + g.participantCount, 0)
  );

  uniqueActivities = computed(
    () => new Set(this.ageGroups().map(g => g.activity.name)).size
  );

  paginatedAgeGroups = computed(() => {
    const filtered = this.filteredAgeGroups();
    const start = this.currentPage() * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  // Updated computed properties
  totalStats = computed(() => {
    const groups = this.ageGroups();
    const total = groups.length;
    const activeGroups = groups.filter(g => g.status === 'Active').length;
    const totalParticipants = groups.reduce(
      (sum, g) => sum + g.participantCount,
      0
    );
    const totalActivities = groups.reduce(
      (sum, g) => sum + (g.activity ? 1 : 0),
      0
    );
    const expiringSoon = groups.filter(g => g.status === 'InActive').length;

    return {
      total,
      activeGroups,
      totalParticipants,
      totalActivities,
      expiringSoon,
    };
  });

  constructor() {
    // Setup search debouncing
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(value => {
        this.globalFilter.set(value || '');
      });

    // Effect to reload data when filters change
    effect(() => {
      this.loadAgeGroups();
    });
  }

  // Add Cricket activity support
  ngOnInit(): void {
    this.loading.set(true);

    // Load activity options with Football, Swimming, and Cricket
    this.activityOptions.set([
      {
        label: 'Football',
        value: { id: '1', name: 'Football', category: 'Sports' },
        group: 'Sports',
      },
      {
        label: 'Swimming',
        value: { id: '2', name: 'Swimming', category: 'Sports' },
        group: 'Sports',
      },
      {
        label: 'Cricket',
        value: { id: '3', name: 'Cricket', category: 'Sports' },
        group: 'Sports',
      },
    ]);

    // Load status options
    this.statusOptions.set(this.ageGroupService.getStatusOptions());

    // Load initial data
    this.loadInitialData();
  }

  // Load initial data
  private loadInitialData(): void {
    this.loading.set(true);

    // Load age groups
    this.ageGroupService.loadAgeGroups().subscribe({
      next: ageGroups => {
        this.ageGroups.set(ageGroups);
        this.loading.set(false);
      },
      error: _error => {
        console.error('Error loading age groups:', _error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load age groups',
        });
        this.loading.set(false);
      },
    });

    // Load activity options
    this.ageGroupService.getActivityOptions().subscribe({
      next: options => {
        this.activityOptions.set(options);
      },
    });

    // Load status options
    this.statusOptions.set(this.ageGroupService.getStatusOptions());
  }

  // Load age groups with current filters
  private loadAgeGroups(): void {
    const filters: AgeGroupFilters = {
      activity: this.selectedActivity(),
      status: this.selectedStatus(),
      searchTerm: this.globalFilter(),
    };

    this.ageGroupService.loadAgeGroups(filters).subscribe({
      next: ageGroups => {
        this.ageGroups.set(ageGroups);
      },
    });
  }
  // Filter methods
  onActivityChange(activity: Activity | null): void {
    this.selectedActivity.set(activity);
  }

  onStatusChange(status: AgeGroupStatus | null): void {
    this.selectedStatus.set(status);
  }

  // Clear all filters
  clearFilters(): void {
    this.selectedActivity.set(null);
    this.selectedStatus.set(null);
    this.searchControl.setValue('');
    this.globalFilter.set('');
    if (this.ageGroupTable) {
      this.ageGroupTable.clear();
    }
  }

  // Export data
  exportCSV(): void {
    const dataToExport = this.filteredAgeGroups();
    const csvContent = this.ageGroupService.exportToCSV(dataToExport);

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `age-groups-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    this.messageService.add({
      severity: 'success',
      summary: 'Export Successful',
      detail: `Exported ${dataToExport.length} age groups`,
    });
  }

  // Export functionality
  exportData(): void {
    const data = this.filteredAgeGroups();
    this.ageGroupService.exportToCSV(data);
    this.messageService.add({
      severity: 'success',
      summary: 'Export Complete',
      detail: `Exported ${data.length} age groups`,
    });
  }

  // UI Helper Methods
  hasActiveFilters(): boolean {
    return (
      !!this.selectedActivity() ||
      !!this.selectedStatus() ||
      !!this.searchControl.value
    );
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  getActivityColor(activity: Activity): string {
    const colors = {
      Sports: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      Fitness: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      Arts: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      Technology: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    };
    return colors[activity.category as keyof typeof colors] || colors.default;
  }
  getStatusLabel(status: AgeGroupStatus): string {
    const labels: Record<AgeGroupStatus, string> = {
      Active: 'Active',
      InActive: 'Inactive',
    };
    return labels[status];
  }
  getStatusSeverity(
    status: AgeGroupStatus
  ): 'success' | 'secondary' | 'warning' | 'danger' {
    const severities: Record<
      AgeGroupStatus,
      'success' | 'secondary' | 'warning' | 'danger'
    > = {
      Active: 'success',
      InActive: 'secondary',
    };
    return severities[status];
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  trackByAgeGroupId(index: number, item: AgeGroup): string {
    return item.id;
  }

  isSelected(group: AgeGroup): boolean {
    return this.selectedAgeGroups().includes(group);
  }

  toggleSelection(group: AgeGroup): void {
    const selected = this.selectedAgeGroups();
    const index = selected.indexOf(group);

    if (index === -1) {
      this.selectedAgeGroups.set([...selected, group]);
    } else {
      this.selectedAgeGroups.set(selected.filter(g => g !== group));
    }
  }
  onPageChange(event: { page?: number; first?: number; rows?: number }): void {
    this.currentPage.set(event.page || 0);
  }

  getDisplayRange(): { start: number; end: number } {
    const filtered = this.filteredAgeGroups();
    const start = this.currentPage() * this.pageSize() + 1;
    const end = Math.min(
      (this.currentPage() + 1) * this.pageSize(),
      filtered.length
    );
    return { start, end };
  }

  // Page info method
  getPageInfo(): { start: number; end: number } {
    const filtered = this.filteredAgeGroups();
    const start = Math.min(
      this.currentPage() * this.pageSize() + 1,
      filtered.length
    );
    const end = Math.min(
      (this.currentPage() + 1) * this.pageSize(),
      filtered.length
    );
    return { start, end };
  }

  // Action Methods
  viewAgeGroup(group: AgeGroup): void {
    this.messageService.add({
      severity: 'info',
      summary: 'View Age Group',
      detail: `Viewing details for ${group.name}`,
    });
  }

  editAgeGroup(group: AgeGroup): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Edit Age Group',
      detail: `Editing ${group.name}`,
    });
  }

  deleteAgeGroup(group: AgeGroup): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the age group "${group.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ageGroupService.deleteAgeGroup(group.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Age group "${group.name}" has been deleted`,
            });
            this.loadAgeGroups();
          },
          error: _error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete age group',
            });
          },
        });
      },
    });
  }

  showCardMenu(event: Event, _group: AgeGroup): void {
    event.stopPropagation();
    // Implementation for context menu
  }

  exportSelected(): void {
    const selected = this.selectedAgeGroups();
    this.ageGroupService.exportToCSV(selected);
    this.messageService.add({
      severity: 'success',
      summary: 'Export Complete',
      detail: `Exported ${selected.length} age groups`,
    });
  }

  // Delete selected age groups
  deleteSelectedAgeGroups(): void {
    const selected = this.selectedAgeGroups();
    if (selected.length === 0) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${selected.length} selected age groups?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        const ids = selected.map(group => group.id);
        this.ageGroupService.deleteMultipleAgeGroups(ids).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `${selected.length} age groups deleted successfully`,
            });
            this.selectedAgeGroups.set([]);
            this.loadAgeGroups();
          },
          error: _error => {
            console.error('Error deleting age groups:', _error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete age groups',
            });
          },
        });
      },
    });
  }

  // Create new age group (placeholder for now)
  createAgeGroup(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Create Feature',
      detail: 'Create new age group functionality will be implemented',
    });
  }

  // Filter methods for clickable cards
  filterByStatus(status: AgeGroupStatus | null): void {
    this.selectedStatus.set(status);
    this.currentPage.set(0); // Reset to first page
  }

  filterByActivity(activity: Activity | null): void {
    this.selectedActivity.set(activity);
    this.currentPage.set(0); // Reset to first page
  }

  // Helper methods for counting
  getTotalByStatus(status: AgeGroupStatus | null): number {
    const groups = this.ageGroups();
    if (status === null) {
      return groups.length;
    }
    return groups.filter(g => g.status === status).length;
  }

  getTotalByActivity(activity: Activity | null): number {
    const groups = this.ageGroups();
    if (activity === null) {
      return groups.length;
    }
    return groups.filter(g => g.activity.name === activity.name).length;
  }
  getActivityByName(name: string): Activity | null {
    const allActivities = this.activityOptions();
    const activityOption = allActivities.find(opt => opt.label === name);
    return activityOption ? activityOption.value : null;
  }

  // Icon helper methods
  getStatusIcon(status: AgeGroupStatus): string {
    switch (status) {
      case 'Active':
        return 'pi-check-circle';
      case 'InActive':
        return 'pi-times-circle';
      default:
        return 'pi-circle';
    }
  }

  getActivityIcon(activityName: string): string {
    switch (activityName?.toLowerCase()) {
      case 'football':
        return 'pi-globe';
      case 'swimming':
        return 'pi-heart';
      case 'cricket':
        return 'pi-bat';
      default:
        return 'pi-calendar';
    }
  }
}
