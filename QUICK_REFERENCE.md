# Quick Reference Guide - NexAcademyHub

## Component Creation Checklist

### 1. Generate Component

```bash
ng generate component features/feature-name/component-name --standalone
```

### 2. Component Template

```typescript
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule, FormsModule /* PrimeNG components */],
  templateUrl: './component-name.html',
  styleUrls: ['./component-name.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentNameComponent implements OnInit, OnDestroy {
  private readonly service = inject(ServiceName);
  private destroy$ = new Subject<void>();

  // Use signals for state
  data = signal<DataType[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData() {
    this.service
      .getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.data.set(data));
  }
}
```

### 3. Service Template

```typescript
@Injectable({
  providedIn: 'root',
})
export class ServiceNameService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getData(): Observable<DataType[]> {
    return this.http
      .get<DataType[]>(`${this.apiUrl}/endpoint`)
      .pipe(retry(2), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Service Error:', error);
    return throwError(() => new Error('Operation failed'));
  }
}
```

## Styling Priority

1. **First**: Use Tailwind CSS classes
2. **Second**: Use global CSS utilities (styles.css)
3. **Last**: Use component-specific CSS

### Common Tailwind Patterns

```html
<!-- Card Layout -->
<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
  <!-- Card content -->
</div>

<!-- Button Styles -->
<button
  class="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
>
  Primary Button
</button>

<!-- Form Input -->
<input
  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
/>

<!-- Grid Layout -->
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  <!-- Grid items -->
</div>
```

## Form Handling

### Signal Forms (No Reactive Forms)

```typescript
export class FormComponent {
  // Form state with signals
  formData = signal({
    name: '',
    email: '',
    age: 0,
  });

  formErrors = signal<Record<string, string>>({});
  isSubmitting = signal(false);
  isFormValid = signal(false);

  constructor() {
    // Auto-validate on data changes
    effect(() => {
      const data = this.formData();
      const errors = this.validateForm(data);
      this.formErrors.set(errors);
      this.isFormValid.set(Object.keys(errors).length === 0);
    });
  }

  // Update form fields
  updateField(field: keyof typeof this.formData.value, value: any) {
    this.formData.update(current => ({
      ...current,
      [field]: value,
    }));
  }

  // Validation
  private validateForm(data: any): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!data.email || !data.email.includes('@')) {
      errors.email = 'Please enter a valid email';
    }

    return errors;
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.isSubmitting.set(true);
      this.submitData(this.formData()).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.resetForm();
        },
        error: () => {
          this.isSubmitting.set(false);
        },
      });
    }
  }

  resetForm() {
    this.formData.set({ name: '', email: '', age: 0 });
  }
}
```

### Template Usage

```html
<form (ngSubmit)="onSubmit()">
  <input
    type="text"
    [value]="formData().name"
    (input)="updateField('name', $any($event.target).value)"
    placeholder="Name"
    class="w-full rounded-lg border border-gray-300 px-3 py-2"
  />
  <span *ngIf="formErrors().name" class="text-red-500">
    {{ formErrors().name }}
  </span>

  <button
    type="submit"
    [disabled]="!isFormValid() || isSubmitting()"
    class="rounded-lg bg-purple-600 px-4 py-2 text-white"
  >
    Submit
  </button>
</form>
```

## PrimeNG Integration

### Common PrimeNG Components

```typescript
// Component imports
imports: [
  CommonModule,
  FormsModule,
  TableModule,
  ButtonModule,
  InputTextModule,
  DropdownModule,
  CalendarModule,
  ToastModule,
  ConfirmDialogModule,
];
```

### PrimeNG Table Example

```html
<p-table [value]="data()" [loading]="loading()" responsiveLayout="scroll">
  <ng-template pTemplate="header">
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Actions</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-item>
    <tr>
      <td>{{ item.name }}</td>
      <td>{{ item.email }}</td>
      <td>
        <p-button
          label="Edit"
          icon="pi pi-pencil"
          (onClick)="edit(item)"
        ></p-button>
      </td>
    </tr>
  </ng-template>
</p-table>
```

## State Management Patterns

### Local Component State

```typescript
export class ComponentWithState {
  // Simple state
  items = signal<Item[]>([]);
  selectedItem = signal<Item | null>(null);
  loading = signal(false);

  // Computed state
  filteredItems = computed(() => {
    const items = this.items();
    const selected = this.selectedItem();
    return selected
      ? items.filter(item => item.category === selected.category)
      : items;
  });

  // State updates
  addItem(item: Item) {
    this.items.update(items => [...items, item]);
  }

  selectItem(item: Item) {
    this.selectedItem.set(item);
  }
}
```

## Error Handling Patterns

### Service Error Handling

```typescript
private handleError(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.error(`${operation} failed: ${error.message}`);

    // Show user-friendly message
    this.toastService.showError('Error', `${operation} failed. Please try again.`);

    // Return safe fallback
    return of(result as T);
  };
}
```

### Component Error Handling

```typescript
export class ComponentWithErrorHandling {
  error = signal<string | null>(null);
  loading = signal(false);

  loadData() {
    this.loading.set(true);
    this.error.set(null);

    this.dataService.getData().subscribe({
      next: data => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: error => {
        this.error.set('Failed to load data. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
```

## Testing Quick Start

### Component Test Template

```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;
  let mockService: jasmine.SpyObj<ServiceName>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ServiceName', ['getData', 'updateData']);

    await TestBed.configureTestingModule({
      imports: [ComponentName],
      providers: [{ provide: ServiceName, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
    mockService = TestBed.inject(ServiceName) as jasmine.SpyObj<ServiceName>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on init', () => {
    const testData = [{ id: 1, name: 'Test' }];
    mockService.getData.and.returnValue(of(testData));

    component.ngOnInit();

    expect(mockService.getData).toHaveBeenCalled();
    expect(component.data()).toEqual(testData);
  });
});
```

## Common CLI Commands

```bash
# Generate components
ng generate component features/auth/login --standalone
ng generate component shared/components/loading-spinner --standalone

# Generate services
ng generate service core/services/user
ng generate service features/auth/services/auth

# Generate guards
ng generate guard core/guards/auth

# Generate pipes
ng generate pipe shared/pipes/currency-format

# Build and serve
ng serve
ng build
ng test
ng lint
```

## File Organization Tips

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── http-error.interceptor.ts
│   └── services/
│       └── user.service.ts
├── shared/
│   ├── components/
│   │   ├── loading-spinner/
│   │   └── confirmation-dialog/
│   ├── models/
│   │   └── user.model.ts
│   └── pipes/
│       └── date-format.pipe.ts
└── features/
    ├── auth/
    │   ├── login/
    │   ├── register/
    │   └── services/
    └── dashboard/
        ├── components/
        └── services/
```

---

_Keep this guide handy for quick reference during development!_
