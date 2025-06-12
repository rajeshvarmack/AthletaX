# Sidebar Component

## Overview

A modern, responsive Angular sidebar component built with Angular 20 best practices, featuring:

- **Standalone Component Architecture**: Uses Angular 20 standalone components
- **Signal-based State Management**: Reactive state with Angular signals
- **ng-select Integration**: Professional dropdowns with search functionality
- **Mobile-first Responsive Design**: Hamburger menu and mobile-friendly layout
- **Purple Theme**: Matches the AthletaNX Academy brand colors
- **Accessibility**: ARIA labels, keyboard navigation, focus management

## Features

### Navigation Menu

- **Dashboard**: Main dashboard view
- **Players**: Player management
- **Invoices**: Invoice management
- **Masters**: Expandable submenu with:
  - Sessions
  - Age Groups
  - Membership Types
  - Products
  - Product Bundles
  - Discounts
  - Waiting List
  - Sport Types
- **Settings**: Expandable submenu with:
  - Users
  - Roles
  - Permissions

### Bottom Dropdowns

- **Branch Selector**: Multi-location branch selection with location details
- **Sport Type Selector**: Sport type selection for filtering

### Mobile Responsiveness

- **Hamburger Menu**: 3-line animated menu toggle
- **Slide Navigation**: Smooth slide-in/out animation
- **Backdrop**: Click-to-close overlay
- **Touch-friendly**: Optimized button sizes for mobile

## Usage

### Basic Implementation

```typescript
import { Sidebar } from './layout/sidebar/sidebar';

@Component({
  imports: [Sidebar],
  template: '<app-sidebar></app-sidebar>',
})
export class MyComponent {}
```

### Demo

Visit `/sidebar-demo` route to see the component in action with sample data.

## Technical Stack

- **Angular 20**: Latest Angular features and standalone components
- **ng-select 15.x**: Professional select dropdowns
- **PrimeIcons**: Icon library for UI elements
- **TypeScript**: Type-safe development
- **CSS3**: Modern styling with CSS Grid/Flexbox
- **Responsive Design**: Mobile-first approach

## File Structure

```
src/app/layout/sidebar/
├── sidebar.ts              # Main component logic
├── sidebar.html             # Template
├── sidebar.css              # Styling
└── models/
    └── sidebar.models.ts    # Type definitions
```

## Customization

### Theming

The sidebar uses CSS custom properties for easy theming:

```css
.ng-select-custom {
  --ng-select-highlight: #a855f7;
  --ng-select-primary-text: #ffffff;
  --ng-select-border: rgba(255, 255, 255, 0.2);
}
```

### Adding Menu Items

Update the `menuItems` array in `sidebar.ts`:

```typescript
menuItems: MenuItem[] = [
  {
    id: 'new-item',
    label: 'New Item',
    icon: 'pi-new-icon',
    route: '/new-route',
    isActive: false,
  }
];
```

### Mobile Breakpoints

- **Desktop**: > 768px (full sidebar)
- **Tablet**: 768px - 1024px (condensed sidebar)
- **Mobile**: < 768px (hamburger menu)

## Accessibility Features

- **ARIA Labels**: All interactive elements have proper labels
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Screen Reader Support**: Semantic HTML structure
- **Color Contrast**: WCAG 2.1 AA compliant

## Best Practices Implemented

1. **Co-located Models**: Component-specific types in dedicated models file
2. **Signal State Management**: Reactive state with Angular signals
3. **Standalone Components**: No NgModule dependencies
4. **TypeScript Strict Mode**: Full type safety
5. **Responsive Design**: Mobile-first CSS approach
6. **Performance**: OnPush change detection strategy
7. **Accessibility**: WCAG 2.1 compliance
