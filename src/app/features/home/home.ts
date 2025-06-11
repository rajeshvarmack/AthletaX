import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  private router = inject(Router);
  private toast = inject(ToastService);

  onSignOut() {
    // Add any cleanup logic here (e.g., clearing tokens, session data)
    this.toast.showSuccess(
      'Signed out',
      'You have been signed out successfully.'
    );
    this.router.navigate(['/auth/login']);
  }

  onBranchesClick() {
    this.router.navigate(['/branches']);
  }

  onManagementClick() {
    // Navigate to management dashboard
    this.toast.showInfo(
      'Coming Soon',
      'Management dashboard will be available soon.'
    );
  }
}
