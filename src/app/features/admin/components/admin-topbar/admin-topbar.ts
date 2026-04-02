import { Component, inject, signal, computed } from '@angular/core';
import { UserState } from '../../../../core/states/user.state';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [],
  templateUrl: './admin-topbar.html',
})
export class AdminTopbarComponent {
  private userState = inject(UserState);

  notificationCount = signal(3);

  adminName = computed(() => this.userState.currentUser()?.fullName ?? 'Admin Vodka');
  adminAvatar = computed(() => this.userState.currentUser()?.avatarUrl ?? '');
}
