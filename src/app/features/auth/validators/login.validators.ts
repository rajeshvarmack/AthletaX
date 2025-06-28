import { AbstractControl, ValidationErrors } from '@angular/forms';
import { VALIDATION_RULES } from '../models';

/**
 * Custom validators for login form fields
 * Provides reusable validation logic for authentication forms
 */
export class LoginValidators {
  /**
   * Validates username field
   * @param control - The form control to validate
   * @returns ValidationErrors object if invalid, null if valid
   */
  static username(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim();

    if (!value) {
      return {
        required: true,
        message: 'Username is required',
      };
    }

    if (value.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
      return {
        minLength: true,
        message: `Username must be at least ${VALIDATION_RULES.USERNAME_MIN_LENGTH} characters`,
      };
    }

    return null;
  }

  /**
   * Validates password field
   * @param control - The form control to validate
   * @returns ValidationErrors object if invalid, null if valid
   */
  static password(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return {
        required: true,
        message: 'Password is required',
      };
    }

    if (value.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      return {
        minLength: true,
        message: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
      };
    }

    return null;
  }

  /**
   * Additional validation helper methods can be added here
   * Examples: email validation, password strength, etc.
   */

  /**
   * Validates email format (example for future use)
   * @param control - The form control to validate
   * @returns ValidationErrors object if invalid, null if valid
   */
  static email(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim();

    if (!value) {
      return {
        required: true,
        message: 'Email is required',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return {
        email: true,
        message: 'Please enter a valid email address',
      };
    }

    return null;
  }

  /**
   * Validates password strength (example for future use)
   * @param control - The form control to validate
   * @returns ValidationErrors object if invalid, null if valid
   */
  static passwordStrength(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null; // Let required validator handle empty values
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (
      value.length < 8 ||
      !hasUpperCase ||
      !hasLowerCase ||
      !hasNumbers ||
      !hasSpecialChar
    ) {
      return {
        passwordStrength: true,
        message:
          'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
      };
    }

    return null;
  }
}
