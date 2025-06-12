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
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'branch-dashboard',
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
