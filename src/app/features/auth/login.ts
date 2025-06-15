import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

// Type definitions for better type safety
interface FieldValidation {
  readonly touched: boolean;
  readonly valid: boolean;
  readonly message: string;
}

interface ValidationState {
  readonly username: FieldValidation;
  readonly password: FieldValidation;
}

interface LoginCredentials {
  readonly username: string;
  readonly password: string;
}

interface LoginAttempt {
  readonly timestamp: number;
  readonly success: boolean;
  readonly ip?: string;
}

// Enhanced constants with better categorization
const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  PASSWORD_MIN_LENGTH: 6,
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  AUTOFILL_CLEAR_DELAY: 100,
} as const;

const UI_CONSTANTS = {
  FOCUS_DELAY: 100,
  ANIMATION_DURATION: 300,
  LOADING_SIMULATION: 1500,
} as const;

const TOAST_LIFETIMES = {
  SUCCESS: 3000,
  ERROR: 4000,
  INFO: 3000,
  WARNING: 5000,
} as const;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class LoginComponent implements OnInit, AfterViewInit {
  private readonly _messageService = inject(MessageService);
  private readonly _router = inject(Router);

  // Track focus state for form inputs
  usernameFocused = false;
  passwordFocused = false;
  // Form state with signals and better typing
  credentials = signal<LoginCredentials>({
    username: '',
    password: '',
  });

  // Validation state with proper typing
  validation = signal<ValidationState>({
    username: {
      touched: false,
      valid: true,
      message: '',
    },
    password: {
      touched: false,
      valid: true,
      message: '',
    },
  });

  // Additional form state with better organization
  readonly formState = {
    rememberMe: signal(false),
    isLoading: signal(false),
    showPassword: signal(false),
    formSubmitted: signal(false),
  };

  // Legacy properties for template compatibility
  get rememberMe() {
    return this.formState.rememberMe();
  }
  set rememberMe(value: boolean) {
    this.formState.rememberMe.set(value);
  }

  get isLoading() {
    return this.formState.isLoading;
  }
  get showPassword() {
    return this.formState.showPassword();
  }
  get formSubmitted() {
    return this.formState.formSubmitted;
  }

  // Account lockout tracking with enhanced typing
  private readonly securityState = {
    failedAttempts: signal(0),
    lockoutUntil: signal<number | null>(null),
    attemptHistory: signal<LoginAttempt[]>([]),
  };
  // Computed properties for account lockout
  isAccountLocked(): boolean {
    const lockoutTime = this.securityState.lockoutUntil();
    return lockoutTime !== null && Date.now() < lockoutTime;
  }

  remainingLockoutTime(): number {
    const lockoutTime = this.securityState.lockoutUntil();
    if (lockoutTime === null) return 0;
    return Math.max(0, lockoutTime - Date.now());
  }
  // Lifecycle hooks
  ngOnInit(): void {
    // Clear any existing form state on component initialization
    this.credentials.set({ username: '', password: '' });
    this.formSubmitted.set(false);
  }

  ngAfterViewInit(): void {
    // Set focus on username field after view is initialized
    this.focusUsernameField();
  }

  // Private helper methods
  private focusUsernameField(): void {
    setTimeout(() => {
      const usernameInput = document.getElementById(
        'username'
      ) as HTMLInputElement;
      if (usernameInput) {
        usernameInput.focus();
        this.usernameFocused = true;
      }
    }, UI_CONSTANTS.FOCUS_DELAY); // Small delay to ensure the DOM is ready
  }
  private recordFailedAttempt(): void {
    const attempts = this.securityState.failedAttempts() + 1;
    this.securityState.failedAttempts.set(attempts);

    // Record attempt in history
    const attempt: LoginAttempt = {
      timestamp: Date.now(),
      success: false,
    };
    this.securityState.attemptHistory.update(history => [...history, attempt]);

    if (attempts >= VALIDATION_RULES.MAX_FAILED_ATTEMPTS) {
      this.securityState.lockoutUntil.set(
        Date.now() + VALIDATION_RULES.LOCKOUT_DURATION
      );
    }
  }

  private resetFailedAttempts(): void {
    this.securityState.failedAttempts.set(0);
    this.securityState.lockoutUntil.set(null);

    // Record successful attempt
    const attempt: LoginAttempt = {
      timestamp: Date.now(),
      success: true,
    };
    this.securityState.attemptHistory.update(history => [...history, attempt]);
  }

  private clearAutofillStyles(inputId: string): void {
    setTimeout(() => {
      const input = document.getElementById(inputId) as HTMLInputElement;
      if (input) {
        input.style.backgroundColor = '';
        input.style.color = '';
      }
    }, VALIDATION_RULES.AUTOFILL_CLEAR_DELAY);
  }
  // Form field management
  markFieldAsTouched(fieldName: 'username' | 'password'): void {
    this.validation.update(state => ({
      ...state,
      [fieldName]: {
        ...state[fieldName],
        touched: true,
      },
    }));
  }
  // Validation methods using constants
  private validateUsername(username: string): {
    valid: boolean;
    message: string;
  } {
    if (!username.trim()) {
      return { valid: false, message: 'Username is required' };
    }
    if (username.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
      return {
        valid: false,
        message: `Username must be at least ${VALIDATION_RULES.USERNAME_MIN_LENGTH} characters`,
      };
    }
    return { valid: true, message: '' };
  }

  private validatePassword(password: string): {
    valid: boolean;
    message: string;
  } {
    if (!password) {
      return { valid: false, message: 'Password is required' };
    }
    if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      return {
        valid: false,
        message: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
      };
    }
    return { valid: true, message: '' };
  }
  // Input change handlers with autofill prevention
  onUsernameChange(value: string): void {
    this.credentials.update(cred => ({ ...cred, username: value }));
    if (value !== '') {
      this.clearAutofillStyles('username');
    }
  }

  onPasswordChange(value: string): void {
    this.credentials.update(cred => ({ ...cred, password: value }));
    if (value !== '') {
      this.clearAutofillStyles('password');
    }
  }
  onLogin(): void {
    this.formSubmitted.set(true);

    // Check if account is locked
    if (this.isAccountLocked()) {
      const remainingMinutes = Math.ceil(this.remainingLockoutTime() / 60000);
      this._messageService.add({
        severity: 'error',
        summary: 'Account Locked',
        detail: `Too many failed attempts. Please try again in ${remainingMinutes} minutes.`,
        life: TOAST_LIFETIMES.ERROR,
      });
      return;
    }

    // Mark all fields as touched
    this.markFieldAsTouched('username');
    this.markFieldAsTouched('password');

    // Validate credentials
    const usernameValidation = this.validateUsername(
      this.credentials().username
    );
    const passwordValidation = this.validatePassword(
      this.credentials().password
    );

    // Update validation state
    this.validation.set({
      username: {
        touched: true,
        valid: usernameValidation.valid,
        message: usernameValidation.message,
      },
      password: {
        touched: true,
        valid: passwordValidation.valid,
        message: passwordValidation.message,
      },
    });

    // Show validation errors if any
    if (!usernameValidation.valid || !passwordValidation.valid) {
      const errors = [];
      if (!usernameValidation.valid) errors.push(usernameValidation.message);
      if (!passwordValidation.valid) errors.push(passwordValidation.message);
      this._messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: `Please fix the following issues:\n• ${errors.join('\n• ')}`,
        life: TOAST_LIFETIMES.ERROR,
      });
      return;
    }

    // Proceed with login
    this.performLogin();
  }

  private performLogin(): void {
    this.isLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);

      // Simple credential check (replace with actual authentication)
      if (
        this.credentials().username === 'admin' &&
        this.credentials().password === 'password'
      ) {
        this.resetFailedAttempts();
        this._messageService.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: `Welcome back, ${this.credentials().username}!`,
          life: TOAST_LIFETIMES.SUCCESS,
        });
        // Navigate to home/dashboard
        this._router.navigate(['/home']);
      } else {
        this.recordFailedAttempt();
        this._messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Invalid username or password. Please try again.',
          life: TOAST_LIFETIMES.ERROR,
        });
      }
    }, UI_CONSTANTS.LOADING_SIMULATION);
  } // User action handlers
  onForgotPassword(): void {
    this._messageService.add({
      severity: 'info',
      summary: 'Password Reset',
      detail: 'Password reset functionality will be available soon.',
      life: TOAST_LIFETIMES.INFO,
    });
  }

  onContactSupport(): void {
    this._messageService.add({
      severity: 'info',
      summary: 'Support Contact',
      detail: 'Support contact functionality will be available soon.',
      life: TOAST_LIFETIMES.INFO,
    });
  }
  togglePasswordVisibility(): void {
    this.formState.showPassword.set(!this.formState.showPassword());
  }
}
