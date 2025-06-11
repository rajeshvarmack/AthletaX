import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  constructor(private router: Router, private toast: ToastService) {}

  onSignOut() {
    // Add any cleanup logic here (e.g., clearing tokens, session data)
    this.toast.showSuccess('Signed out', 'You have been signed out successfully.');
    this.router.navigate(['/auth/login']);
  }
} 