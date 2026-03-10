import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ForgotPassword } from './forgot-password/forgot-password';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, ForgotPassword],
  templateUrl: './auth.html',
})
export class Auth {
  // Quản lý trạng thái màn hình: login | register | forgot
  viewMode = signal<'login' | 'register' | 'forgot'>('login');

  toggleMode() {
    this.viewMode.update(m => m === 'login' ? 'register' : 'login');
  }

  goToForgot() {
    this.viewMode.set('forgot');
  }

  backToLogin() {
    this.viewMode.set('login');
  }
}
