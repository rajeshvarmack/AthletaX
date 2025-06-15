import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Subject } from 'rxjs';

interface ValidationState {
  username: {
    touched: boolean;
    valid: boolean;
    message: string;
  };
  password: {
    touched: boolean;
    valid: boolean;
    message: string;
  };
}

interface LoginAttempt {
  timestamp: number;
  count: number;
}

interface SecurityConfig {
  maxAttempts: number;
  lockoutDuration: number; // in milliseconds
  attemptWindow: number; // in milliseconds
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy, AfterViewInit {
  private readonly _messageService = inject(MessageService);
  private readonly _router = inject(Router);
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _destroy$ = new Subject<void>();

  @ViewChild('usernameInput') usernameInput!: ElementRef<HTMLInputElement>;
  // Form state signals - initialize with empty values
  credentials = signal({
    username: '',
    password: '',
  });

  constructor() {
    // Clear any potential cached data on component initialization
    this.clearFormData();
  }
  // UI state signals
  isLoading = signal(false);
  showPassword = signal(false);
  formSubmitted = signal(false);
  rememberMe = signal(false);
  usernameFocused = signal(false);
  passwordFocused = signal(false);

  // Validation state
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

  // Security configuration
  private readonly securityConfig: SecurityConfig = {
    maxAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    attemptWindow: 15 * 60 * 1000, // 15 minutes
  };

  // Rate limiting state
  private loginAttempts = signal<LoginAttempt>({
    timestamp: Date.now(),
    count: 0,
  });

  // Computed properties for form validation
  isFormValid = computed(() => {
    const v = this.validation();
    return v.username.valid && v.password.valid;
  });
  canSubmit = computed(() => {
    const creds = this.credentials();
    return (
      this.isFormValid() &&
      creds.username.trim() &&
      creds.password &&
      !this.isLoading() &&
      !this.isAccountLocked()
    );
  });

  // Security computed properties
  isAccountLocked = computed(() => {
    const attempts = this.loginAttempts();
    const now = Date.now();
    const timeSinceLastAttempt = now - attempts.timestamp;

    return (
      attempts.count >= this.securityConfig.maxAttempts &&
      timeSinceLastAttempt < this.securityConfig.lockoutDuration
    );
  });

  remainingLockoutTime = computed(() => {
    if (!this.isAccountLocked()) return 0;
    const attempts = this.loginAttempts();
    const now = Date.now();
    const elapsed = now - attempts.timestamp;
    return Math.max(0, this.securityConfig.lockoutDuration - elapsed);
  });

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngAfterViewInit(): void {
    // Focus the username input after the view is initialized
    setTimeout(() => {
      if (this.usernameInput) {
        this.usernameInput.nativeElement.focus();
        // Remove readonly after a short delay to prevent autofill
        this.removeReadonlyFromFields();
      }
    }, 100);
  }

  // Remove readonly attribute to make fields editable
  removeReadonlyFromFields(): void {
    setTimeout(() => {
      const usernameField = document.getElementById(
        'username'
      ) as HTMLInputElement;
      const passwordField = document.getElementById(
        'password'
      ) as HTMLInputElement;

      if (usernameField) {
        usernameField.removeAttribute('readonly');
      }
      if (passwordField) {
        passwordField.removeAttribute('readonly');
      }
    }, 500);
  }

  // Make field editable when clicked
  makeFieldEditable(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      target.removeAttribute('readonly');
      target.focus();
    }
  }

  // Clear all form data and reset state
  clearFormData(): void {
    this.credentials.set({ username: '', password: '' });
    this.validation.set({
      username: { touched: false, valid: true, message: '' },
      password: { touched: false, valid: true, message: '' },
    });
    this.formSubmitted.set(false);
    this.showPassword.set(false);
    this.usernameFocused.set(false);
    this.passwordFocused.set(false);
  }

  // Mark field as touched for validation
  markFieldAsTouched(fieldName: 'username' | 'password') {
    this.validation.update(state => ({
      ...state,
      [fieldName]: {
        ...state[fieldName],
        touched: true,
      },
    }));
  }
  // Enhanced validation methods with security considerations
  validateUsername(username: string) {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      return { valid: false, message: 'Username is required' };
    }
    if (trimmedUsername.length < 3) {
      return {
        valid: false,
        message: 'Username must be at least 3 characters',
      };
    }
    if (trimmedUsername.length > 50) {
      return {
        valid: false,
        message: 'Username cannot exceed 50 characters',
      };
    } // Basic sanitization - prevent common injection patterns
    const sanitizedUsername = trimmedUsername.replace(/[<>"']/g, '');
    if (sanitizedUsername !== trimmedUsername) {
      return {
        valid: false,
        message: 'Username contains invalid characters',
      };
    }
    return { valid: true, message: '' };
  }

  validatePassword(password: string) {
    if (!password) {
      return { valid: false, message: 'Password is required' };
    }
    if (password.length < 8) {
      return {
        valid: false,
        message: 'Password must be at least 8 characters',
      };
    }
    if (password.length > 128) {
      return {
        valid: false,
        message: 'Password cannot exceed 128 characters',
      };
    }

    // Enhanced password strength validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const criteriaMet = [
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    ].filter(Boolean).length;

    if (criteriaMet < 3) {
      return {
        valid: false,
        message:
          'Password must contain at least 3 of: uppercase, lowercase, numbers, special characters',
      };
    }

    return { valid: true, message: '' };
  }

  onUsernameChange(username: string) {
    const validation = this.validateUsername(username);
    this.validation.update(state => ({
      ...state,
      username: {
        touched: true,
        valid: validation.valid,
        message: validation.message,
      },
    }));
  }

  onPasswordChange(password: string) {
    const validation = this.validatePassword(password);
    this.validation.update(state => ({
      ...state,
      password: {
        touched: true,
        valid: validation.valid,
        message: validation.message,
      },
    }));
  }
  onLogin() {
    // Check for account lockout first
    if (this.isAccountLocked()) {
      const remainingMinutes = Math.ceil(this.remainingLockoutTime() / 60000);
      this._messageService.add({
        severity: 'warn',
        summary: 'Account Locked',
        detail: `Account is temporarily locked. Please try again in ${remainingMinutes} minutes.`,
        life: 5000,
      });
      return;
    }

    this.formSubmitted.set(true);

    // Mark all fields as touched
    this.markFieldAsTouched('username');
    this.markFieldAsTouched('password');

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
        detail: `Please fix the following issues: ${errors.join(', ')}`,
        life: 4000,
      });
      return;
    }

    // If validation passes, proceed with login
    this.isLoading.set(true);

    // Simulate API call with proper error handling
    setTimeout(() => {
      this.isLoading.set(false);

      // Simple credential check (replace with actual authentication)
      if (
        this.credentials().username === 'admin' &&
        this.credentials().password === 'password123A!'
      ) {
        // Reset login attempts on successful login
        this.loginAttempts.set({ timestamp: Date.now(), count: 0 });

        this._messageService.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: `Welcome back, ${this.credentials().username}!`,
          life: 3000,
        });

        // Clear all form data and sensitive information
        this.clearFormData();

        // Navigate to home/dashboard
        this._router.navigate(['/home']);
      } else {
        // Increment failed login attempts
        const currentAttempts = this.loginAttempts();
        const now = Date.now();

        // Reset counter if outside attempt window
        if (
          now - currentAttempts.timestamp >
          this.securityConfig.attemptWindow
        ) {
          this.loginAttempts.set({ timestamp: now, count: 1 });
        } else {
          this.loginAttempts.update(attempts => ({
            ...attempts,
            count: attempts.count + 1,
            timestamp: now,
          }));
        }

        const remainingAttempts =
          this.securityConfig.maxAttempts - this.loginAttempts().count;

        if (remainingAttempts <= 0) {
          this._messageService.add({
            severity: 'error',
            summary: 'Account Locked',
            detail: 'Too many failed attempts. Account locked for 15 minutes.',
            life: 5000,
          });
        } else {
          this._messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: `Invalid credentials. ${remainingAttempts} attempts remaining.`,
            life: 4000,
          });
        }
      }
    }, 1500);
  }
  onForgotPassword() {
    this._messageService.add({
      severity: 'info',
      summary: 'Password Reset',
      detail: 'Password reset functionality will be available soon.',
      life: 3000,
    });
  }

  onContactSupport() {
    this._messageService.add({
      severity: 'info',
      summary: 'Support Contact',
      detail: 'Support contact functionality will be available soon.',
      life: 3000,
    });
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  // Password strength calculation
  getPasswordStrength(): 'weak' | 'medium' | 'strong' {
    const password = this.credentials().password;
    if (!password) return 'weak';

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const criteriaMet = [
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    ].filter(Boolean).length;

    if (password.length >= 12 && criteriaMet >= 4) return 'strong';
    if (password.length >= 8 && criteriaMet >= 3) return 'medium';
    return 'weak';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'strong':
        return 'Strong password';
      case 'medium':
        return 'Good password';
      case 'weak':
        return 'Weak password - use uppercase, lowercase, numbers, and symbols';
      default:
        return '';
    }
  }
}
