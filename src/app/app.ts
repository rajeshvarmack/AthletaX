import { Component } from '@angular/core';
import { LoginComponent } from './features/auth/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent],
  template: `<app-login></app-login>`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100vh;
      }
    `,
  ],
})
export class App {
  protected title = 'NexAcademyHub';
}
