import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { Auth } from './features/auth/auth';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'auth', component: Auth },
  { path: 'forgot-password', component: ForgotPassword }
];
