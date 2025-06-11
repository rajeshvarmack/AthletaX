import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = signal<ToastMessage[]>([]);

  getToasts() {
    return this.toasts.asReadonly();
  }

  show(toast: Omit<ToastMessage, 'id'>) {
    const id = Date.now().toString();
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    };

    this.toasts.update(toasts => [...toasts, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      this.remove(id);
    }, newToast.duration);
  }

  showError(title: string, message: string) {
    this.show({
      type: 'error',
      title,
      message,
    });
  }

  showSuccess(title: string, message: string) {
    this.show({
      type: 'success',
      title,
      message,
    });
  }

  showWarning(title: string, message: string) {
    this.show({
      type: 'warning',
      title,
      message,
    });
  }

  showInfo(title: string, message: string) {
    this.show({
      type: 'info',
      title,
      message,
    });
  }

  remove(id: string) {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  clear() {
    this.toasts.set([]);
  }
}
