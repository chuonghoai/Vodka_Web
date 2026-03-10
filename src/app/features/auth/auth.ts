import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './auth.html',
})
export class Auth {
  isLoginMode = signal<boolean>(true);

  toggleMode() {
    this.isLoginMode.update(mode => !mode);
  }
}
