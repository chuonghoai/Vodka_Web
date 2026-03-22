import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { Auth } from './features/auth/auth';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { MovieComponent } from './features/movie/movie';
import { WatchComponent } from './features/watch/watch';
import { SearchComponent } from './features/search/search';
import { UserComponent } from './features/user/user';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'auth', component: Auth },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'movie/:id', component: MovieComponent },
  { path: 'watch/:id', component: WatchComponent },
  { path: 'search', component: SearchComponent},
  { path: 'profile', component: UserComponent }
];
