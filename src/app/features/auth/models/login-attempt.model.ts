/**
 * Interface representing a login attempt in the authentication system
 * Used for tracking failed login attempts and implementing security lockout features
 */
export interface LoginAttempt {
  /** Timestamp when the login attempt was made */
  readonly timestamp: number;

  /** Whether the login attempt was successful */
  readonly success: boolean;

  /** Optional IP address from which the attempt was made */
  readonly ip?: string;
}
