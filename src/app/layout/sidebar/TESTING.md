# 🧪 Sidebar Testing Guide

## Quick Testing Routes

### 1. **Interactive Test Dashboard**

```
http://localhost:4200/sidebar-test
```

**Features**: Complete testing checklist with interactive checkboxes for all functionality

### 2. **Basic Demo Page**

```
http://localhost:4200/sidebar-demo
```

**Features**: Simple demo showing the sidebar in action

## Manual Testing Procedures

### 🖱 **Desktop Testing (> 768px)**

#### Navigation Menu

1. **Click each main menu item**:

   - Dashboard → Should show active state and navigate
   - Players → Should show active state and navigate
   - Invoices → Should show active state and navigate

2. **Test expandable menus**:

   - Click "Masters" → Should expand with smooth animation
   - Click "Settings" → Should expand submenu
   - Click another main item → Previous expanded menu should close

3. **Test submenu navigation**:
   - Click each Masters submenu item (Sessions, Age Groups, etc.)
   - Click each Settings submenu item (Users, Roles, Permissions)
   - Verify active states and navigation

#### Dropdown Testing

1. **Branch Selector**:

   - Click dropdown → Should open with all branches
   - Type in search → Should filter results
   - Select branch → Header subtitle should update
   - Verify toast notification appears

2. **Sport Type Selector**:
   - Click dropdown → Should open with sports list
   - Search functionality → Should filter sports
   - Select sport → Should show toast notification
   - Icons should appear in options

### 📱 **Mobile Testing (< 768px)**

#### Responsive Behavior

1. **Resize browser to mobile width** (or use DevTools mobile view)
2. **Hamburger menu should appear** in header
3. **Sidebar should be hidden** by default
4. **Click hamburger** → Sidebar slides in from left
5. **Click backdrop** → Sidebar closes
6. **Test touch interactions** on all menu items

### ♿ **Accessibility Testing**

#### Keyboard Navigation

1. **Tab through the sidebar** using Tab key
2. **Use Enter/Space** to activate menu items
3. **Use Escape** to close mobile menu
4. **Verify focus indicators** are visible

#### Screen Reader Testing

1. **Enable screen reader** (Windows: Narrator, Mac: VoiceOver)
2. **Navigate through menu** and verify announcements
3. **Check ARIA labels** are properly announced

### 🔧 **Developer Testing**

#### Browser Console

```javascript
// Open DevTools (F12) and run:

// Check for console errors
console.clear();
// Navigate through menu - should see no errors

// Test signal reactivity
// Open sidebar component in DevTools and check signal values
```

#### Performance Testing

```javascript
// Monitor performance
performance.mark('sidebar-start');
// Interact with sidebar
performance.mark('sidebar-end');
performance.measure('sidebar-interaction', 'sidebar-start', 'sidebar-end');
console.log(performance.getEntriesByType('measure'));
```

### 🧪 **Automated Testing Commands**

#### Unit Tests

```bash
# Run component unit tests
npm test -- --include="**/sidebar/**"
```

#### E2E Tests

```bash
# Run end-to-end tests
npm run e2e -- --spec="sidebar"
```

#### Lint & Format

```bash
# Check code quality
npm run lint
npm run format:check
```

## Testing Checklist

### ✅ **Functionality**

- [ ] All menu items navigate correctly
- [ ] Submenus expand/collapse smoothly
- [ ] Dropdowns open and close properly
- [ ] Search functionality works
- [ ] Toast notifications appear
- [ ] Active states update correctly

### ✅ **Responsive Design**

- [ ] Desktop layout (> 768px) works
- [ ] Tablet layout (768px - 1024px) works
- [ ] Mobile layout (< 768px) works
- [ ] Hamburger menu functions properly
- [ ] Touch interactions work on mobile

### ✅ **Accessibility**

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Screen reader compatible
- [ ] Color contrast sufficient

### ✅ **Performance**

- [ ] No console errors
- [ ] Smooth animations (60fps)
- [ ] Quick dropdown search
- [ ] Memory usage stable
- [ ] Fast initial load

### ✅ **Browser Compatibility**

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Common Issues & Solutions

### Issue: Dropdown not opening

**Solution**: Check ng-select imports and verify NgSelectModule is imported

### Issue: Mobile menu not working

**Solution**: Verify signal binding in template: `[class.mobile-open]="isMobileMenuOpen()"`

### Issue: Icons not showing

**Solution**: Ensure PrimeIcons CSS is imported in styles.css

### Issue: Animations stuttering

**Solution**: Check CSS transitions and browser hardware acceleration

## Testing Tools

### Browser DevTools

- **Elements Tab**: Inspect DOM structure and CSS
- **Console Tab**: Check for JavaScript errors
- **Network Tab**: Monitor resource loading
- **Performance Tab**: Profile animations and interactions

### VS Code Extensions

- **Angular Language Service**: TypeScript errors and IntelliSense
- **Prettier**: Code formatting
- **ESLint**: Code quality checks

### External Tools

- **Lighthouse**: Accessibility and performance audit
- **axe DevTools**: Accessibility testing
- **BrowserStack**: Cross-browser testing
