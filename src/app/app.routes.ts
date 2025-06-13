import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default redirect to login
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },

  // Authentication routes (no layout)
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login').then(m => m.LoginComponent),
  },

  // Standalone pages (no layout)
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then(m => m.Home),
  },
  {
    path: 'branches',
    loadComponent: () =>
      import('./features/branches/branch-list').then(m => m.BranchList),
  },

  // Main application routes (with layout)
  {
    path: 'app',
    loadComponent: () =>
      import('./layout/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      // Dashboard routes
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'branch-dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'management-dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },

      // Players routes
      {
        path: 'players',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },

      // Invoices routes
      {
        path: 'invoices',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },

      // Masters routes
      {
        path: 'masters/branch',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'masters/age-groups',
        loadComponent: () =>
          import('./features/age-groups/age-group-list').then(
            m => m.AgeGroupList
          ),
      },
      {
        path: 'masters/sessions',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'masters/membership-types',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'masters/products',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'masters/product-bundles',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'masters/discounts',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'masters/waiting-list',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'masters/sports-types',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },

      // Settings routes
      {
        path: 'settings/company',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'settings/users',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'settings/roles',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'settings/permissions',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },

      // Development/Test routes
      {
        path: 'sidebar-demo',
        loadComponent: () =>
          import('./features/sidebar-demo/sidebar-demo').then(
            m => m.SidebarDemo
          ),
      },
      {
        path: 'sidebar-test',
        loadComponent: () =>
          import('./features/sidebar-test/sidebar-test').then(
            m => m.SidebarTest
          ),
      },
      {
        path: 'topbar-test',
        loadComponent: () =>
          import('./features/topbar-test/topbar-test').then(m => m.TopbarTest),
      },

      // Default redirect for /app
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },

  // 404 route
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found').then(m => m.NotFound),
  },
];
