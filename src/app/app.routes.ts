import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { Auth } from './features/auth/auth';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'auth', component: Auth }
];
