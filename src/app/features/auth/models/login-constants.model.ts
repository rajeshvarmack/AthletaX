/**
 * Authentication validation rules and constraints
 * These constants define the business rules for login validation
 */
export const VALIDATION_RULES = {
  /** Minimum length required for username */
  USERNAME_MIN_LENGTH: 3,

  /** Minimum length required for password */
  PASSWORD_MIN_LENGTH: 6,

  /** Maximum number of failed login attempts before lockout */
  MAX_FAILED_ATTEMPTS: 5,

  /** Duration of account lockout in milliseconds (15 minutes) */
  LOCKOUT_DURATION: 15 * 60 * 1000,

  /** Delay before clearing autofill data in milliseconds */
  AUTOFILL_CLEAR_DELAY: 100,
} as const;

/**
 * UI timing and animation constants
 * Controls the timing of various UI interactions and animations
 */
export const UI_CONSTANTS = {
  /** Delay before focusing elements in milliseconds */
  FOCUS_DELAY: 100,

  /** Duration of UI animations in milliseconds */
  ANIMATION_DURATION: 300,

  /** Simulated loading time for demo purposes in milliseconds */
  LOADING_SIMULATION: 1500,
} as const;

/**
 * Toast notification display durations
 * Controls how long different types of toast messages are visible
 */
export const TOAST_LIFETIMES = {
  /** Duration for success messages in milliseconds */
  SUCCESS: 3000,

  /** Duration for error messages in milliseconds */
  ERROR: 4000,

  /** Duration for info messages in milliseconds */
  INFO: 3000,

  /** Duration for warning messages in milliseconds */
  WARNING: 5000,
} as const;

/**
 * Type definitions for better type safety
 */
export type ValidationRule =
  (typeof VALIDATION_RULES)[keyof typeof VALIDATION_RULES];
export type UIConstant = (typeof UI_CONSTANTS)[keyof typeof UI_CONSTANTS];
export type ToastLifetime =
  (typeof TOAST_LIFETIMES)[keyof typeof TOAST_LIFETIMES];
