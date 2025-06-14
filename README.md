# NexAcademyHub - Angular 20 Project

## Development Guidelines

This project follows Angular 20 best practices with a focus on modern development patterns, performance, maintainability, and exceptional user experience. All code and design decisions are made with the expertise of a senior Angular architect and experienced UI/UX designer.

### 📚 Documentation

- **[Angular Best Practices Guide](./ANGULAR_BEST_PRACTICES.md)** - Comprehensive guide covering Angular development, UI/UX design principles, and accessibility
- **[Quick Reference Guide](./QUICK_REFERENCE.md)** - Quick templates and common patterns for rapid development
- **[GitHub Copilot Instructions](./.copilot-instructions.md)** - Expert-level instructions for AI code generation with architectural and UX guidance

### 🏗️ Architecture & Design Philosophy

- **Framework**: Angular 20 with modern patterns (signals, standalone components)
- **Styling**: Tailwind CSS (primary) + PrimeNG components + minimal custom CSS
- **State Management**: Angular Signals for reactive, performant state handling
- **Forms**: Signal Forms with real-time validation and accessibility
- **HTTP**: HttpClient with comprehensive error handling and retry logic
- **Components**: Standalone, feature-based organization with OnPush strategy
- **Accessibility**: WCAG 2.1 AA compliance throughout
- **UX**: Mobile-first, responsive design with micro-interactions
- **Performance**: Optimized for Core Web Vitals and bundle size

### 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### 📁 Project Structure

```
src/app/
├── core/                    # Singleton services, guards, interceptors
├── shared/                  # Reusable components, pipes, directives
├── features/                # Feature modules (auth, dashboard, etc.)
├── layout/                  # Layout components
└── services/                # Global services
```

### 🎨 Design System & Styling

1. **Accessibility First** - WCAG 2.1 AA compliance in all components
2. **Tailwind CSS First** - Utility-first approach with consistent spacing and typography
3. **Design Tokens** - Systematic color palette, typography scale, and spacing
4. **Component CSS** - Only for complex animations, gradients, or PrimeNG customizations
5. **Mobile-First** - Responsive design starting from mobile breakpoints

### 🧪 Expert Development Workflow

1. **Architecture Review** - Follow senior-level patterns from [Quick Reference Guide](./QUICK_REFERENCE.md)
2. **Signal-Based State** - Use Angular signals for all reactive state management
3. **Performance First** - Implement OnPush strategy, lazy loading, and proper error handling
4. **Accessibility Testing** - Test with screen readers and keyboard navigation
5. **UI/UX Validation** - Ensure proper loading states, feedback, and user experience
6. **Code Quality** - Use GitHub Copilot with expert-level architectural guidance

### 📋 Before You Code - Expert Checklist

Read the [Angular Best Practices Guide](./ANGULAR_BEST_PRACTICES.md) to understand:

- **Angular Architecture**: Component patterns, service design, performance optimization
- **UI/UX Design**: User-centered design, visual hierarchy, responsive patterns
- **Accessibility**: WCAG compliance, keyboard navigation, screen reader support
- **State Management**: Signal-based reactive patterns and form handling
- **Testing & Quality**: Testing strategies and code quality standards

### 🎯 Development Philosophy

> **"Code with the expertise of a Senior Angular Architect and the empathy of a UX Designer"**
>
> Every component should be performant, accessible, and delightful to use. Every line of code should consider both technical excellence and user experience.

---

_Keep these guidelines in mind for consistent, maintainable code!_
