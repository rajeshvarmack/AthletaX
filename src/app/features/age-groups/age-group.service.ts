import { Injectable, signal } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import {
  Activity,
  ActivityOption,
  AgeGroup,
  AgeGroupFilters,
  AgeGroupStatus,
  AgeGroupStatusOption,
} from './models/age-group.models';

@Injectable({
  providedIn: 'root',
})
export class AgeGroupService {
  private ageGroups = signal<AgeGroup[]>([]);
  private loading = signal<boolean>(false);

  // Mock data for activities
  private activities: Activity[] = [
    { id: '1', name: 'Football', category: 'Sports', icon: 'pi pi-globe' },
    { id: '2', name: 'Swimming', category: 'Sports', icon: 'pi pi-heart' },
    { id: '3', name: 'Cricket', category: 'Sports', icon: 'pi pi-star' },
    { id: '4', name: 'Basketball', category: 'Sports', icon: 'pi pi-circle' },
    { id: '5', name: 'Tennis', category: 'Sports', icon: 'pi pi-circle' },
    { id: '6', name: 'Martial Arts', category: 'Sports', icon: 'pi pi-circle' },
    { id: '7', name: 'Yoga', category: 'Fitness', icon: 'pi pi-heart' },
    { id: '8', name: 'Dance', category: 'Arts', icon: 'pi pi-star' },
    { id: '9', name: 'Music', category: 'Arts', icon: 'pi pi-volume-up' },
    { id: '10', name: 'Coding', category: 'Technology', icon: 'pi pi-code' },
    { id: '11', name: 'Robotics', category: 'Technology', icon: 'pi pi-cog' },
  ];
  // Mock data for age groups
  private mockAgeGroups: AgeGroup[] = [
    {
      id: '1',
      name: 'Little Kickers',
      minAge: 3,
      maxAge: 5,
      activity: this.activities[0], // Football
      status: 'Active',
      description: 'Introduction to football for toddlers and preschoolers',
      participantCount: 15,
      createdDate: new Date('2024-01-15'),
      updatedDate: new Date('2024-06-10'),
      lastModified: new Date('2024-06-10'),
      isActive: true,
    },
    {
      id: '2',
      name: 'Junior Athletes',
      minAge: 6,
      maxAge: 8,
      activity: this.activities[0], // Football
      status: 'Active',
      description: 'Basic football skills for young children',
      participantCount: 22,
      createdDate: new Date('2024-02-01'),
      updatedDate: new Date('2024-06-12'),
      lastModified: new Date('2024-06-12'),
      isActive: true,
    },
    {
      id: '3',
      name: 'Water Babies',
      minAge: 2,
      maxAge: 4,
      activity: this.activities[1], // Swimming
      status: 'Active',
      description: 'Water safety and basic swimming for toddlers',
      participantCount: 18,
      createdDate: new Date('2024-01-20'),
      updatedDate: new Date('2024-06-08'),
      lastModified: new Date('2024-06-08'),
      isActive: true,
    },
    {
      id: '4',
      name: 'Teen Swimmers',
      minAge: 13,
      maxAge: 17,
      activity: this.activities[1], // Swimming
      status: 'Active',
      description: 'Competitive swimming training for teenagers',
      participantCount: 12,
      createdDate: new Date('2024-03-01'),
      updatedDate: new Date('2024-06-05'),
      lastModified: new Date('2024-06-05'),
      isActive: true,
    },
    {
      id: '5',
      name: 'Cricket Stars',
      minAge: 7,
      maxAge: 12,
      activity: this.activities[2], // Cricket
      status: 'Active',
      description: 'Cricket training focusing on technique and teamwork',
      participantCount: 25,
      createdDate: new Date('2024-02-15'),
      updatedDate: new Date('2024-06-11'),
      lastModified: new Date('2024-06-11'),
      isActive: true,
    },
    {
      id: '6',
      name: 'Future Footballers',
      minAge: 9,
      maxAge: 12,
      activity: this.activities[0], // Football
      status: 'Active',
      description: 'Advanced football skills for pre-teens',
      participantCount: 30,
      createdDate: new Date('2024-03-10'),
      updatedDate: new Date('2024-06-15'),
      lastModified: new Date('2024-06-15'),
      isActive: true,
    },
    {
      id: '7',
      name: 'Young Cricketers',
      minAge: 8,
      maxAge: 14,
      activity: this.activities[2], // Cricket
      status: 'Active',
      description: 'Cricket fundamentals and match play',
      participantCount: 28,
      createdDate: new Date('2024-04-01'),
      updatedDate: new Date('2024-06-14'),
      lastModified: new Date('2024-06-14'),
      isActive: true,
    },
    {
      id: '8',
      name: 'Swim Squad',
      minAge: 10,
      maxAge: 16,
      activity: this.activities[1], // Swimming
      status: 'InActive',
      description: 'Competitive swimming squad (temporarily suspended)',
      participantCount: 0,
      createdDate: new Date('2024-05-01'),
      updatedDate: new Date('2024-06-01'),
      lastModified: new Date('2024-06-01'),
      isActive: false,
    },
    {
      id: '9',
      name: 'Elite Football',
      minAge: 15,
      maxAge: 18,
      activity: this.activities[0], // Football
      status: 'Active',
      description: 'Elite level football training for teenagers',
      participantCount: 20,
      createdDate: new Date('2024-01-05'),
      updatedDate: new Date('2024-06-13'),
      lastModified: new Date('2024-06-13'),
      isActive: true,
    },
    {
      id: '10',
      name: 'Cricket Academy',
      minAge: 12,
      maxAge: 17,
      activity: this.activities[2], // Cricket
      status: 'InActive',
      description: 'Advanced cricket training (under review)',
      participantCount: 5,
      createdDate: new Date('2024-02-10'),
      updatedDate: new Date('2024-05-30'),
      lastModified: new Date('2024-05-30'),
      isActive: false,
    },
    {
      id: '11',
      name: 'Swimming Masters',
      minAge: 14,
      maxAge: 18,
      activity: this.activities[1], // Swimming
      status: 'InActive',
      description: 'Master level swimming program',
      participantCount: 8,
      createdDate: new Date('2024-03-15'),
      updatedDate: new Date('2024-05-25'),
      lastModified: new Date('2024-05-25'),
      isActive: false,
    },
    {
      id: '12',
      name: 'Code Cubs',
      minAge: 8,
      maxAge: 12,
      activity: this.activities[2], // Cricket (using Cricket for now since activities[8] doesn't exist)
      status: 'Active',
      description: 'Basic programming concepts for kids',
      participantCount: 16,
      createdDate: new Date('2024-03-15'),
      updatedDate: new Date('2024-06-07'),
      lastModified: new Date('2024-06-07'),
      isActive: true,
    },
    {
      id: '13',
      name: 'Robot Builders',
      minAge: 10,
      maxAge: 15,
      activity: this.activities[0], // Football (using Football for now since activities[9] doesn't exist)
      status: 'InActive',
      description: 'Build and program robots',
      participantCount: 10,
      createdDate: new Date('2024-04-01'),
      updatedDate: new Date('2024-05-15'),
      lastModified: new Date('2024-05-15'),
      isActive: false,
    },
    {
      id: '14',
      name: 'Cricket Champions',
      minAge: 8,
      maxAge: 14,
      activity: this.activities[2], // Cricket
      status: 'Active',
      description: 'Competitive cricket training for young players',
      participantCount: 20,
      createdDate: new Date('2024-05-01'),
      updatedDate: new Date('2024-06-10'),
      lastModified: new Date('2024-06-10'),
      isActive: true,
    },
  ];

  constructor() {
    this.ageGroups.set(this.mockAgeGroups);
  }

  // Getters
  getAgeGroups = () => this.ageGroups.asReadonly();
  getLoading = () => this.loading.asReadonly();

  // Load age groups with optional filters
  loadAgeGroups(filters?: AgeGroupFilters): Observable<AgeGroup[]> {
    this.loading.set(true);

    return of(this.mockAgeGroups).pipe(
      delay(800), // Simulate API call
      map(ageGroups => {
        let filteredAgeGroups = [...ageGroups];

        if (filters) {
          if (filters.activity) {
            filteredAgeGroups = filteredAgeGroups.filter(
              group => group.activity.id === filters.activity?.id
            );
          }

          if (filters.status) {
            filteredAgeGroups = filteredAgeGroups.filter(
              group => group.status === filters.status
            );
          }

          if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filteredAgeGroups = filteredAgeGroups.filter(
              group =>
                group.name.toLowerCase().includes(searchLower) ||
                group.description?.toLowerCase().includes(searchLower) ||
                group.activity.name.toLowerCase().includes(searchLower)
            );
          }
        }

        this.ageGroups.set(filteredAgeGroups);
        this.loading.set(false);
        return filteredAgeGroups;
      })
    );
  }

  // Get activities for dropdown
  getActivities(): Observable<Activity[]> {
    return of(this.activities).pipe(delay(200));
  }
  // Get activity options for ng-select
  getActivityOptions(): Observable<ActivityOption[]> {
    return of([
      { label: 'All Activities', value: null },
      ...this.activities.map(activity => ({
        label: activity.name,
        value: activity,
        group: activity.category,
      })),
    ]).pipe(delay(200));
  }

  // Get status options
  getStatusOptions(): (
    | AgeGroupStatusOption
    | { label: string; value: null; severity: 'secondary' }
  )[] {
    return [
      { label: 'All Status', value: null, severity: 'secondary' },
      { label: 'Active', value: 'Active', severity: 'success' },
      { label: 'InActive', value: 'InActive', severity: 'secondary' },
    ];
  }

  // CRUD operations
  createAgeGroup(
    ageGroup: Omit<AgeGroup, 'id' | 'createdDate' | 'lastModified'>
  ): Observable<AgeGroup> {
    const newAgeGroup: AgeGroup = {
      ...ageGroup,
      id: Date.now().toString(),
      createdDate: new Date(),
      lastModified: new Date(),
    };

    const currentAgeGroups = this.ageGroups();
    this.ageGroups.set([...currentAgeGroups, newAgeGroup]);

    return of(newAgeGroup).pipe(delay(500));
  }

  updateAgeGroup(id: string, updates: Partial<AgeGroup>): Observable<AgeGroup> {
    const currentAgeGroups = this.ageGroups();
    const index = currentAgeGroups.findIndex(group => group.id === id);

    if (index !== -1) {
      const updatedAgeGroup = {
        ...currentAgeGroups[index],
        ...updates,
        lastModified: new Date(),
      };

      const newAgeGroups = [...currentAgeGroups];
      newAgeGroups[index] = updatedAgeGroup;
      this.ageGroups.set(newAgeGroups);

      return of(updatedAgeGroup).pipe(delay(500));
    }

    throw new Error('Age group not found');
  }

  deleteAgeGroup(id: string): Observable<boolean> {
    const currentAgeGroups = this.ageGroups();
    const filteredAgeGroups = currentAgeGroups.filter(group => group.id !== id);
    this.ageGroups.set(filteredAgeGroups);

    return of(true).pipe(delay(500));
  }

  deleteMultipleAgeGroups(ids: string[]): Observable<boolean> {
    const currentAgeGroups = this.ageGroups();
    const filteredAgeGroups = currentAgeGroups.filter(
      group => !ids.includes(group.id)
    );
    this.ageGroups.set(filteredAgeGroups);

    return of(true).pipe(delay(500));
  }

  // Utility methods
  getStatusSeverity(
    status: AgeGroupStatus
  ): 'success' | 'secondary' | 'warning' | 'danger' {
    const statusMap: Record<
      AgeGroupStatus,
      'success' | 'secondary' | 'warning' | 'danger'
    > = {
      Active: 'success',
      InActive: 'secondary',
    };
    return statusMap[status];
  }

  exportToCSV(ageGroups: AgeGroup[]): string {
    const headers = [
      'Name',
      'Min Age',
      'Max Age',
      'Activity',
      'Status',
      'Participants',
      'Created Date',
    ];
    const csvContent = [
      headers.join(','),
      ...ageGroups.map(group =>
        [
          `"${group.name}"`,
          group.minAge,
          group.maxAge,
          `"${group.activity.name}"`,
          group.status,
          group.participantCount,
          group.createdDate.toLocaleDateString(),
        ].join(',')
      ),
    ].join('\n');

    return csvContent;
  }
}
