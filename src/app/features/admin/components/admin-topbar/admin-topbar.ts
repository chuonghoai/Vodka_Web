import { Component, inject, signal, computed } from '@angular/core';
import { UserState } from '../../../../core/states/user.state';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-topbar.html',
})
export class AdminTopbarComponent {
  private userState = inject(UserState);

  searchQuery = signal('');
  notificationCount = signal(3);

  adminName = computed(() => this.userState.currentUser()?.fullName ?? 'Admin Vodka');
  adminAvatar = computed(() => this.userState.currentUser()?.avatarUrl ?? '');
}
