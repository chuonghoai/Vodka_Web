import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
      },
      {
        path: 'movies',
        loadComponent: () =>
          import('./pages/movie-management/movie-management').then(m => m.MovieManagementComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/user-management/user-management').then(m => m.UserManagementComponent),
      },
      {
        path: 'genres',
        loadComponent: () =>
          import('./pages/genre-management/genre-management').then(m => m.GenreManagementComponent),
      },
      {
        path: 'tags',
        loadComponent: () =>
          import('./pages/tag-management/tag-management').then(m => m.TagManagementComponent),
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('./pages/review-management/review-management').then(m => m.ReviewManagementComponent),
      },
      {
        path: 'activities',
        loadComponent: () =>
          import('./pages/activity-log/activity-log').then(m => m.ActivityLogComponent),
      },
      //   {
      //     path: 'settings',
      //     loadComponent: () =>
      //       import('./pages/settings/settings').then(m => m.SettingsComponent),
      //   },
    ],
  },
];
