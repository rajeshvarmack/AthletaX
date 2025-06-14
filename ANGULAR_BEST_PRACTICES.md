# Angular 20 Best Practices Guide - NexAcademyHub

> **Senior Angular Architect & UI/UX Expert Approach**
>
> This guide embodies the expertise of a senior Angular architect with 10+ years of experience and a seasoned UI/UX designer. Every recommendation prioritizes performance, accessibility, maintainability, and exceptional user experience.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Component Best Practices](#component-best-practices)
3. [Service Best Practices](#service-best-practices)
4. [Styling Guidelines](#styling-guidelines)
5. [State Management](#state-management)
6. [Performance Optimization](#performance-optimization)
7. [UI/UX Design Principles](#uiux-design-principles)
8. [Accessibility Guidelines](#accessibility-guidelines)
9. [Testing Guidelines](#testing-guidelines)
10. [Code Quality](#code-quality)

## Project Structure

### Recommended Folder Structure

```
src/
├── app/
│   ├── core/                    # Singleton services, guards, interceptors
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── services/
│   ├── shared/                  # Reusable components, directives, pipes
│   │   ├── components/
│   │   ├── directives/
│   │   ├── pipes/
│   │   └── models/
│   ├── features/                # Feature modules
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── age-groups/
│   └── layout/                  # Layout components
├── assets/                      # Static assets
└── environments/                # Environment configurations
```

### Feature Module Structure

```
features/
└── feature-name/
    ├── components/              # Feature-specific components
    ├── services/               # Feature-specific services
    ├── models/                 # Feature-specific interfaces/types
    ├── feature-name.module.ts  # Feature module
    └── feature-name-routing.module.ts
```

## Component Best Practices

### 1. Use Standalone Components (Angular 14+)

```typescript
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeNGModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css'],
})
export class UserProfileComponent {
  // Component logic using signals
}
```

### 2. Component Naming Conventions

- **Files**: `kebab-case` without .component suffix (e.g., `user-profile.ts`)
- **Classes**: `PascalCase` with `Component` suffix (e.g., `UserProfileComponent`)
- **Selectors**: `kebab-case` with app prefix (e.g., `app-user-profile`)
- **Folders**: Use feature-based folders with component files directly inside

### 3. Use Signals for Reactive State (Angular 16+)

```typescript
export class UserComponent {
  // Use signals for reactive state
  user = signal<User | null>(null);
  loading = signal(false);

  // Computed signals for derived state
  fullName = computed(() => {
    const currentUser = this.user();
    return currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : '';
  });

  // Effect for side effects
  constructor() {
    effect(() => {
      console.log('User changed:', this.user());
    });
  }
}
```

### 4. Component Lifecycle Best Practices

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Use signals for all state management
  data = signal<DataType[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    // Initialize component
    this.loadData();
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData() {
    this.loading.set(true);
    this.dataService
      .getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.data.set(data);
          this.loading.set(false);
        },
        error: error => {
          this.error.set('Failed to load data');
          this.loading.set(false);
        },
      });
  }
}
```

### 5. Template Best Practices

```html
<!-- Use trackBy for *ngFor -->
<div *ngFor="let item of items; trackBy: trackByFn">{{ item.name }}</div>

<!-- Use OnPush change detection when possible -->
<!-- Avoid complex expressions in templates -->
<div [class.active]="isActive" [attr.aria-label]="ariaLabel">
  {{ displayText }}
</div>

<!-- Use safe navigation operator -->
<div>{{ user?.profile?.name }}</div>
```

## Service Best Practices

### 1. Injectable Services with Root Provider

```typescript
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
}
```

### 2. Use Dependency Injection with inject() Function

```typescript
export class MyComponent {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
}
```

### 3. Error Handling in Services

```typescript
@Injectable()
export class ApiService {
  private readonly http = inject(HttpClient);

  getData(): Observable<Data[]> {
    return this.http
      .get<Data[]>('/api/data')
      .pipe(retry(2), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong'));
  }
}
```

## Styling Guidelines

### 1. Tailwind CSS First Approach

```html
<!-- Prefer Tailwind classes -->
<div
  class="flex items-center justify-between rounded-lg bg-white p-4 shadow-md"
>
  <h2 class="text-xl font-semibold text-gray-800">Title</h2>
  <button class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
    Action
  </button>
</div>
```

### 2. Custom CSS Only When Necessary

```css
/* Only use custom CSS for complex animations, gradients, or PrimeNG overrides */
.custom-animation {
  animation: slideIn 0.3s ease-in-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* PrimeNG customizations */
::ng-deep .p-datatable .p-datatable-thead > tr > th {
  background-color: theme(colors.purple.50);
}
```

### 3. Global vs Component Styles

- **Global styles** (`styles.css`): Reusable utilities, PrimeNG overrides, base styles
- **Component styles**: Component-specific styles that can't be achieved with Tailwind

## State Management

### 1. Use Signals for All State Management

```typescript
export class TodoComponent {
  todos = signal<Todo[]>([]);
  filter = signal<'all' | 'active' | 'completed'>('all');

  filteredTodos = computed(() => {
    const currentTodos = this.todos();
    const currentFilter = this.filter();

    switch (currentFilter) {
      case 'active':
        return currentTodos.filter(t => !t.completed);
      case 'completed':
        return currentTodos.filter(t => t.completed);
      default:
        return currentTodos;
    }
  });

  // State update methods
  addTodo(todo: Todo) {
    this.todos.update(todos => [...todos, todo]);
  }

  toggleTodo(id: string) {
    this.todos.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  setFilter(filter: 'all' | 'active' | 'completed') {
    this.filter.set(filter);
  }
}
```

### 2. Signal-Based Forms

```typescript
export class SignalFormComponent {
  // Form state with signals - no reactive forms needed
  formData = signal({
    name: '',
    email: '',
    phone: '',
  });

  formErrors = signal<Record<string, string>>({});
  isSubmitting = signal(false);
  isFormValid = signal(false);

  constructor() {
    // Auto-validate form whenever data changes
    effect(() => {
      const data = this.formData();
      const errors = this.validateForm(data);
      this.formErrors.set(errors);
      this.isFormValid.set(Object.keys(errors).length === 0);
    });
  }

  // Update individual fields
  updateField(field: keyof typeof this.formData.value, value: string) {
    this.formData.update(current => ({
      ...current,
      [field]: value,
    }));
  }

  // Validation logic
  private validateForm(data: any): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.phone = 'Phone must be 10 digits';
    }

    return errors;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  }

  // Handle form submission
  onSubmit() {
    if (this.isFormValid()) {
      this.isSubmitting.set(true);

      // Submit form data
      this.submitForm(this.formData()).subscribe({
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

  // Reset form
  resetForm() {
    this.formData.set({
      name: '',
      email: '',
      phone: '',
    });
  }

  // Submit logic
  private submitForm(data: any): Observable<any> {
    // Your API call here
    return of(data).pipe(delay(1000));
  }
}
```

**Template Usage:**

```html
<form (ngSubmit)="onSubmit()" class="space-y-4">
  <!-- Name Field -->
  <div>
    <label for="name" class="mb-1 block text-sm font-medium text-gray-700">
      Name *
    </label>
    <input
      id="name"
      type="text"
      [value]="formData().name"
      (input)="updateField('name', $any($event.target).value)"
      class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
      [class.border-red-500]="formErrors().name"
      placeholder="Enter your name"
    />
    <span *ngIf="formErrors().name" class="mt-1 text-sm text-red-500">
      {{ formErrors().name }}
    </span>
  </div>

  <!-- Email Field -->
  <div>
    <label for="email" class="mb-1 block text-sm font-medium text-gray-700">
      Email *
    </label>
    <input
      id="email"
      type="email"
      [value]="formData().email"
      (input)="updateField('email', $any($event.target).value)"
      class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
      [class.border-red-500]="formErrors().email"
      placeholder="Enter your email"
    />
    <span *ngIf="formErrors().email" class="mt-1 text-sm text-red-500">
      {{ formErrors().email }}
    </span>
  </div>

  <!-- Submit Button -->
  <button
    type="submit"
    [disabled]="!isFormValid() || isSubmitting()"
    class="w-full rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <span *ngIf="!isSubmitting()">Submit</span>
    <span *ngIf="isSubmitting()" class="flex items-center justify-center">
      <i class="pi pi-spinner pi-spin mr-2"></i>
      Submitting...
    </span>
  </button>
</form>
```

````

### 3. Service-Level State Management

```typescript
@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private readonly http = inject(HttpClient);

  // Private signals for internal state
  private _users = signal<User[]>([]);
  private _selectedUser = signal<User | null>(null);
  private _loading = signal(false);

  // Public readonly signals
  readonly users = this._users.asReadonly();
  readonly selectedUser = this._selectedUser.asReadonly();
  readonly loading = this._loading.asReadonly();

  // Computed signals
  readonly activeUsers = computed(() =>
    this._users().filter(user => user.status === 'active')
  );

  readonly userCount = computed(() => this._users().length);

  loadUsers() {
    this._loading.set(true);
    this.http.get<User[]>('/api/users').subscribe({
      next: users => {
        this._users.set(users);
        this._loading.set(false);
      },
      error: () => {
        this._loading.set(false);
      },
    });
  }

  selectUser(user: User) {
    this._selectedUser.set(user);
  }

  addUser(user: User) {
    this._users.update(users => [...users, user]);
  }

  updateUser(updatedUser: User) {
    this._users.update(users =>
      users.map(user => (user.id === updatedUser.id ? updatedUser : user))
    );
  }

  removeUser(userId: string) {
    this._users.update(users => users.filter(user => user.id !== userId));
  }
}
````

## Performance Optimization

### 1. OnPush Change Detection

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptimizedComponent {
  // Use with signals or observables
}
```

### 2. Lazy Loading Modules

```typescript
const routes: Routes = [
  {
    path: 'users',
    loadComponent: () =>
      import('./users/users.component').then(m => m.UsersComponent),
  },
];
```

### 3. Image Optimization

```html
<!-- Use NgOptimizedImage directive -->
<img
  ngSrc="/assets/hero.jpg"
  width="400"
  height="300"
  priority
  alt="Hero image"
/>
```

## UI/UX Design Principles

### 1. User-Centered Design Approach

#### Immediate Feedback Pattern

```typescript
export class ActionButtonComponent {
  isProcessing = signal(false);
  actionResult = signal<'success' | 'error' | null>(null);

  async performAction() {
    this.isProcessing.set(true);
    this.actionResult.set(null);

    try {
      await this.service.performAction();
      this.actionResult.set('success');
      // Show success feedback for 3 seconds
      setTimeout(() => this.actionResult.set(null), 3000);
    } catch (error) {
      this.actionResult.set('error');
    } finally {
      this.isProcessing.set(false);
    }
  }
}
```

```html
<button
  (click)="performAction()"
  [disabled]="isProcessing()"
  class="relative min-w-32 rounded-lg bg-purple-600 px-4 py-2 text-white transition-all duration-200 hover:bg-purple-700 disabled:opacity-50"
>
  <!-- Loading State -->
  <span *ngIf="isProcessing()" class="flex items-center justify-center">
    <i class="pi pi-spinner pi-spin mr-2"></i>
    Processing...
  </span>

  <!-- Success State -->
  <span
    *ngIf="actionResult() === 'success'"
    class="flex items-center justify-center text-green-600"
  >
    <i class="pi pi-check mr-2"></i>
    Success!
  </span>

  <!-- Error State -->
  <span
    *ngIf="actionResult() === 'error'"
    class="flex items-center justify-center text-red-600"
  >
    <i class="pi pi-times mr-2"></i>
    Try Again
  </span>

  <!-- Default State -->
  <span *ngIf="!isProcessing() && !actionResult()"> Submit </span>
</button>
```

#### Progressive Disclosure

```html
<!-- Show complex information progressively -->
<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold">Advanced Settings</h3>
    <button
      type="button"
      (click)="toggleAdvanced()"
      class="text-sm font-medium text-purple-600 hover:text-purple-700"
      [attr.aria-expanded]="showAdvanced()"
      aria-controls="advanced-panel"
    >
      {{ showAdvanced() ? 'Hide' : 'Show' }} Advanced Options
    </button>
  </div>

  <div
    *ngIf="showAdvanced()"
    id="advanced-panel"
    @slideInOut
    class="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
  >
    <!-- Advanced options with proper spacing and organization -->
  </div>
</div>
```

### 2. Visual Hierarchy & Typography

#### Consistent Typography Scale

```html
<!-- Use systematic typography scale -->
<article class="mx-auto max-w-4xl">
  <header class="mb-8">
    <h1 class="mb-2 text-4xl leading-tight font-bold text-gray-900">
      Article Title
    </h1>
    <p class="text-xl leading-relaxed text-gray-600">
      Compelling subtitle that provides context
    </p>
    <div class="mt-4 flex items-center text-sm text-gray-500">
      <time datetime="2024-01-15">January 15, 2024</time>
      <span class="mx-2">•</span>
      <span>5 min read</span>
    </div>
  </header>

  <div class="prose prose-lg prose-purple max-w-none">
    <h2 class="mt-8 mb-4 text-2xl font-semibold text-gray-800">
      Section Heading
    </h2>
    <p class="mb-4 text-base leading-relaxed text-gray-700">
      Body text with optimal line height for readability.
    </p>
  </div>
</article>
```

#### Color System & Contrast

```html
<!-- Ensure WCAG AA compliance with proper contrast -->
<div class="space-y-4">
  <!-- Primary Actions: High contrast -->
  <button
    class="rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
  >
    Primary Action
  </button>

  <!-- Secondary Actions: Medium contrast -->
  <button
    class="rounded-lg bg-gray-100 px-6 py-3 text-gray-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
  >
    Secondary Action
  </button>

  <!-- Destructive Actions: Clear visual warning -->
  <button
    class="rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
  >
    Delete Item
  </button>
</div>
```

### 3. Responsive Design Patterns

#### Mobile-First Grid System

```html
<!-- Start with mobile, scale up -->
<div
  class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
>
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <h3 class="mb-2 text-lg font-semibold">Card Title</h3>
    <p class="text-sm leading-relaxed text-gray-600">
      Card content that adapts to different screen sizes.
    </p>
  </div>
</div>
```

#### Touch-Friendly Interactions

```html
<!-- Ensure minimum 44px touch targets -->
<nav class="flex flex-wrap gap-2">
  <button
    *ngFor="let tab of tabs"
    class="min-h-11 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
    [class.bg-purple-100]="selectedTab() === tab.id"
    [class.text-purple-700]="selectedTab() === tab.id"
    [class.text-gray-600]="selectedTab() !== tab.id"
    [class.hover:bg-gray-100]="selectedTab() !== tab.id"
  >
    {{ tab.label }}
  </button>
</nav>
```

## Accessibility Guidelines

### 1. Semantic HTML & ARIA

#### Proper Form Structure

```html
<form [attr.aria-label]="formTitle" class="space-y-6">
  <fieldset class="space-y-4">
    <legend class="mb-4 text-lg font-semibold text-gray-900">
      Personal Information
    </legend>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label
          for="firstName"
          class="mb-1 block text-sm font-medium text-gray-700"
        >
          First Name
          <span class="text-red-500" aria-label="required">*</span>
        </label>
        <input
          id="firstName"
          type="text"
          required
          [value]="formData().firstName"
          (input)="updateField('firstName', $any($event.target).value)"
          [attr.aria-describedby]="getFieldDescriptionId('firstName')"
          [attr.aria-invalid]="hasFieldError('firstName')"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
          [class.border-red-500]="hasFieldError('firstName')"
        />

        <p
          [id]="getFieldDescriptionId('firstName')"
          class="mt-1 text-sm text-gray-600"
        >
          Enter your legal first name as it appears on official documents
        </p>

        <p
          *ngIf="hasFieldError('firstName')"
          [id]="getFieldErrorId('firstName')"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ getFieldError('firstName') }}
        </p>
      </div>
    </div>
  </fieldset>
</form>
```

#### Navigation & Landmarks

```html
<div class="min-h-screen bg-gray-50">
  <!-- Skip Link for keyboard users -->
  <a
    href="#main-content"
    class="sr-only z-50 rounded-lg bg-purple-600 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
  >
    Skip to main content
  </a>

  <header role="banner" class="bg-white shadow-sm">
    <nav role="navigation" aria-label="Main navigation">
      <!-- Navigation items -->
    </nav>
  </header>

  <main id="main-content" role="main" class="container mx-auto px-4 py-8">
    <h1 class="mb-6 text-3xl font-bold text-gray-900">Page Title</h1>
    <!-- Main content -->
  </main>

  <aside role="complementary" aria-label="Sidebar">
    <!-- Sidebar content -->
  </aside>

  <footer role="contentinfo" class="mt-12 bg-gray-800 text-white">
    <!-- Footer content -->
  </footer>
</div>
```

### 2. Keyboard Navigation

#### Focus Management

```typescript
export class ModalComponent implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private previouslyFocusedElement: HTMLElement | null = null;

  ngOnInit() {
    // Store the previously focused element
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    // Focus the first focusable element in modal
    setTimeout(() => {
      const firstFocusable = this.elementRef.nativeElement.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    });
  }

  ngOnDestroy() {
    // Return focus to previously focused element
    this.previouslyFocusedElement?.focus();
  }

  @HostListener('keydown.escape')
  onEscapeKey() {
    this.closeModal();
  }

  @HostListener('keydown.tab', ['$event'])
  onTabKey(event: KeyboardEvent) {
    this.trapFocus(event);
  }

  private trapFocus(event: KeyboardEvent) {
    const focusableElements = this.elementRef.nativeElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}
```

### 3. Screen Reader Support

#### Dynamic Content Announcements

```typescript
export class LiveAnnouncerService {
  private readonly liveAnnouncer = inject(LiveAnnouncer);

  announceSuccess(message: string) {
    this.liveAnnouncer.announce(message, 'polite');
  }

  announceError(message: string) {
    this.liveAnnouncer.announce(message, 'assertive');
  }

  announceRouteChange(pageName: string) {
    this.liveAnnouncer.announce(`Navigated to ${pageName}`, 'polite');
  }
}
```

```html
<!-- Live regions for dynamic updates -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  {{ statusMessage() }}
</div>

<!-- Progress indicators -->
<div *ngIf="isLoading()" class="flex items-center space-x-2">
  <div
    class="h-4 w-4 animate-spin rounded-full border-b-2 border-purple-600"
  ></div>
  <span class="sr-only">Loading content, please wait</span>
  <span aria-hidden="true">Loading...</span>
</div>
```

### 4. Additional Resources

For comprehensive accessibility testing and implementation:

- **ng-select**: [https://ng-select.github.io/ng-select](https://ng-select.github.io/ng-select) - Accessible dropdown component
- **Angular CDK a11y**: Built-in accessibility utilities
- **WAVE Browser Extension**: Accessibility testing tool
- **axe-core**: Automated accessibility testing

## Code Quality

### 1. ESLint Configuration

```json
{
  "extends": [
    "@angular-eslint/recommended",
    "@angular-eslint/template/process-inline-templates"
  ],
  "rules": {
    "@typescript-eslint/explicit-member-accessibility": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@angular-eslint/prefer-on-push-component-change-detection": "error"
  }
}
```

### 2. Naming Conventions

```typescript
// Constants: SCREAMING_SNAKE_CASE
export const API_ENDPOINTS = {
  USERS: '/api/users',
  POSTS: '/api/posts',
};

// Interfaces: PascalCase with descriptive names
export interface UserProfile {
  id: string;
  email: string;
  preferences: UserPreferences;
}

// Enums: PascalCase
export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}
```

### 3. Type Safety

```typescript
// Use strict types
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Avoid 'any', use generics
function processData<T>(data: T[]): T[] {
  return data.filter(item => item !== null);
}
```

## GitHub Copilot Integration Tips

### 1. Use Descriptive Comments

```typescript
// Create a user registration form with validation for email, password, and confirm password
// Include real-time validation feedback and submission handling
```

### 2. Context-Rich File Names

- Use clear, descriptive file names
- Include feature context in file paths
- Maintain consistent naming patterns

### 3. Type Definitions for Better Suggestions

```typescript
// Define clear interfaces for better Copilot suggestions
interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
```

## Commit Message Conventions

```
feat: add user authentication module
fix: resolve login form validation issues
docs: update API documentation
style: format code according to style guide
refactor: extract common utilities to shared service
test: add unit tests for user service
chore: update dependencies
```

## Additional Resources

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Angular Best Practices](https://angular.io/guide/best-practices)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PrimeNG Documentation](https://primefaces.org/primeng/)
- [ng-select - Advanced Select Component](https://github.com/ng-select/ng-select)

---

_This document should be updated as the project evolves and new patterns emerge._
