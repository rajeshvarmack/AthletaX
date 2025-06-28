import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

// Import our organized models and validators
import {
  LoginAttempt,
  TOAST_LIFETIMES,
  UI_CONSTANTS,
  VALIDATION_RULES,
} from './models';
import { LoginValidators } from './validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  private readonly _formBuilder = inject(FormBuilder);

  // Reactive Form with Signal integration
  readonly loginForm: FormGroup = this._formBuilder.group({
    username: ['', [LoginValidators.username]],
    password: ['', [LoginValidators.password]],
    rememberMe: [false],
  });

  // Signals for reactive state management
  readonly isLoading = signal(false);
  readonly showPassword = signal(false);
  readonly formSubmitted = signal(false);

  // Focus state tracking
  readonly usernameFocused = signal(false);
  readonly passwordFocused = signal(false);

  // Touched state tracking for better reactivity
  readonly usernameTouched = signal(false);
  readonly passwordTouched = signal(false);

  // Form value signals - reactive to form changes
  readonly formValue = signal(this.loginForm.value);
  readonly isFormValid = signal(this.loginForm.valid); // Computed properties for validation states
  readonly usernameErrors = computed(() => {
    const control = this.loginForm.get('username');
    if (!control) return null;

    // Use both signals for reactivity
    this.formValue();
    this.usernameTouched();

    if (!control.touched || !control.errors) return null;
    return control.errors;
  });

  readonly passwordErrors = computed(() => {
    const control = this.loginForm.get('password');
    if (!control) return null;

    // Use both signals for reactivity
    this.formValue();
    this.passwordTouched();

    if (!control.touched || !control.errors) return null;
    return control.errors;
  });

  // Computed properties for valid states - only show green when field is touched, has value, and is valid
  readonly isUsernameValid = computed(() => {
    const control = this.loginForm.get('username');
    if (!control) return false;

    // Use both signals for reactivity
    this.formValue();
    this.usernameTouched();

    if (!control.touched) return false;
    const value = control.value?.trim();
    return !control.errors && value && value.length > 0;
  });

  readonly isPasswordValid = computed(() => {
    const control = this.loginForm.get('password');
    if (!control) return false;

    // Use both signals for reactivity
    this.formValue();
    this.passwordTouched();

    if (!control.touched) return false;
    const value = control.value;
    return !control.errors && value && value.length > 0;
  });

  // Security state management
  private readonly securityState = {
    failedAttempts: signal(0),
    lockoutUntil: signal<number | null>(null),
    attemptHistory: signal<LoginAttempt[]>([]),
  };

  // Computed security properties
  readonly isAccountLocked = computed(() => {
    const lockoutTime = this.securityState.lockoutUntil();
    return lockoutTime !== null && Date.now() < lockoutTime;
  });

  readonly remainingLockoutTime = computed(() => {
    const lockoutTime = this.securityState.lockoutUntil();
    if (lockoutTime === null) return 0;
    return Math.max(0, lockoutTime - Date.now());
  });

  // Legacy getters for template compatibility (if needed)
  get credentials() {
    return this.formValue();
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')?.value || false;
  } 
  
  // Lifecycle hooks
  ngOnInit(): void {
    // Setup form value changes subscription with signals
    this.loginForm.valueChanges.subscribe(value => {
      this.formValue.set(value);
    });

    // Setup form validity changes subscription
    this.loginForm.statusChanges.subscribe(() => {
      this.isFormValid.set(this.loginForm.valid);
    }); 
    
    // Clear any existing form state on component initialization
    this.loginForm.reset({
      username: '',
      password: '',
      rememberMe: false,
    });

    // Reset all state signals
    this.formSubmitted.set(false);
    this.usernameTouched.set(false);
    this.passwordTouched.set(false);
    this.resetSecurityState();
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
        this.usernameFocused.set(true);
      }
    }, UI_CONSTANTS.FOCUS_DELAY); // Small delay to ensure the DOM is ready
  }

  private resetSecurityState(): void {
    this.securityState.failedAttempts.set(0);
    this.securityState.lockoutUntil.set(null);
    this.securityState.attemptHistory.set([]);
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
  
  // Form field management with reactive forms
  markFieldAsTouched(fieldName: 'username' | 'password'): void {
    const control = this.loginForm.get(fieldName);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();

      // Update touched signals for reactivity
      if (fieldName === 'username') {
        this.usernameTouched.set(true);
      } else {
        this.passwordTouched.set(true);
      }

      // Manually trigger form value signal update to ensure computed properties recalculate
      this.formValue.set(this.loginForm.value);
    }
  }

  // Focus management methods
  onUsernameFocus(): void {
    this.usernameFocused.set(true);
  }

  onUsernameBlur(): void {
    this.usernameFocused.set(false);
    this.markFieldAsTouched('username');
  }

  onPasswordFocus(): void {
    this.passwordFocused.set(true);
  }

  onPasswordBlur(): void {
    this.passwordFocused.set(false);
    this.markFieldAsTouched('password');
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

  // Main login submission method
  onLogin(): void {
    this.formSubmitted.set(true);

    // Mark all fields as touched to show validation errors
    this.loginForm.markAllAsTouched();

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
    
    // Check form validity
    if (!this.loginForm.valid) {
      // Collect all validation errors
      const errors = [];

      const usernameControl = this.loginForm.get('username');
      if (usernameControl?.errors && usernameControl.touched) {
        errors.push(usernameControl.errors['message'] || 'Username is invalid');
      }

      const passwordControl = this.loginForm.get('password');
      if (passwordControl?.errors && passwordControl.touched) {
        errors.push(passwordControl.errors['message'] || 'Password is invalid');
      }

      if (errors.length > 0) {
        this._messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: `Please fix the following issues:\n• ${errors.join('\n• ')}`,
          life: TOAST_LIFETIMES.ERROR,
        });
        return;
      }
    }

    // Proceed with login
    this.performLogin();
  }

  private performLogin(): void {
    this.isLoading.set(true);

    // Get form values
    const formValue = this.loginForm.value;
    const username = formValue.username;
    const password = formValue.password;

    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);

      // Simple credential check (replace with actual authentication)
      if (username === 'admin' && password === 'password') {
        this.resetFailedAttempts();
        this._messageService.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: `Welcome back, ${username}!`,
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
  }

  // User action handlers
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
    this.showPassword.set(!this.showPassword());
  }
}
