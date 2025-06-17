import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

/**
 * Guard to protect the home route and ensure user is authenticated
 * Redirects to login if not authenticated
 */
export const homeGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const messageService = inject(MessageService);

  // TODO: Replace with actual authentication service
  const isAuthenticated = checkAuthenticationStatus();

  if (!isAuthenticated) {
    messageService.add({
      severity: 'warn',
      summary: 'Authentication Required',
      detail: 'Please sign in to access the dashboard.',
      life: 3000,
    });

    // Redirect to login with return URL
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });

    return false;
  }

  return true;
};

/**
 * Check if user is currently authenticated
 * TODO: Replace with actual authentication logic
 */
function checkAuthenticationStatus(): boolean {
  // Placeholder logic - replace with actual authentication check
  const token =
    localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

  if (!token) {
    return false;
  }

  // TODO: Validate token expiry and format
  try {
    // Basic token validation - replace with proper JWT validation
    const tokenData = JSON.parse(atob(token.split('.')[1] || ''));
    const isExpired = tokenData.exp && tokenData.exp < Date.now() / 1000;

    if (isExpired) {
      // Clean up expired token
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      return false;
    }

    return true;
  } catch {
    // Invalid token format
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    return false;
  }
}
