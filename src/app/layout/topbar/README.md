# Top Bar Component

A modern, responsive top bar component for the NexAcademy Hub application, designed to work seamlessly with the sidebar component.

## Features

- **Mobile Menu Toggle**: Hamburger menu button that integrates with the sidebar
- **User Profile Dropdown**: Displays user information with profile management options
- **Notifications**: Bell icon with unread count and notification dropdown
- **Responsive Design**: Adapts to different screen sizes
- **Purple Theme**: Matches the application's purple gradient theme
- **Accessibility**: ARIA labels and keyboard navigation support

## Structure

```
src/app/layout/topbar/
├── topbar.ts           # Component logic with signals
├── topbar.html         # Template
├── topbar.css          # Styles matching purple theme
└── models/
    └── topbar.models.ts # TypeScript interfaces
```

## Usage

### Basic Integration

```typescript
import { Topbar } from './layout/topbar/topbar';

@Component({
  imports: [Topbar],
  template: ` <app-topbar (menuToggle)="toggleSidebar()"></app-topbar> `,
})
export class AppLayout {
  toggleSidebar() {
    // Handle sidebar toggle
  }
}
```

### With Main Layout

The topbar is designed to work with the main layout component:

```html
<app-topbar (menuToggle)="toggleMobileSidebar()"></app-topbar>
<div class="layout-content">
  <app-sidebar [isMobileOpen]="isMobileSidebarOpen()"></app-sidebar>
  <main class="main-content">
    <router-outlet></router-outlet>
  </main>
</div>
```

## API

### Outputs

- `menuToggle()`: Emitted when the hamburger menu is clicked

### Properties (Signals)

- `currentUser`: User profile information
- `notifications`: Array of notifications
- `isUserMenuOpen`: State of user dropdown menu
- `isNotificationsOpen`: State of notifications dropdown

## Styling

The topbar uses a purple gradient background matching the app theme:

```css
background: linear-gradient(90deg, #4c1d95 0%, #312e81 50%, #1e1b4b 100%);
```

### Customization

Colors can be customized by modifying the CSS custom properties:

- Primary gradient colors
- Text colors
- Dropdown shadows and borders
- Notification badge colors

## Features Detail

### User Profile Section

- Avatar with user initials
- User name and email display
- Dropdown with profile actions
- Sign out functionality

### Notifications

- Unread count badge
- Different notification types (info, success, warning)
- Mark as read functionality
- Timestamp display

### Mobile Responsiveness

- Hamburger menu for sidebar control
- Touch-friendly button sizes
- Proper dropdown positioning

## Dependencies

- Angular 18+ (standalone components)
- PrimeIcons for icons
- Toast service for notifications
- Router for navigation

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- IE11+ (with polyfills)
