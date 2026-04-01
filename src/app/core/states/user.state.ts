import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserState {
  private platformId = inject(PLATFORM_ID);

  currentUser = signal<any>(null);

  constructor() {
    this.loadInitialState();
  }

  private loadInitialState() {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.currentUser.set(JSON.parse(userStr));
      }
    }
  }

  setUser(user: any) {
    this.currentUser.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  updateUser(partialUser: any) {
    this.currentUser.update(current => {
      if (!current) return partialUser;

      const updated = { ...current, ...partialUser };

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('user', JSON.stringify(updated));
      }
      return updated;
    });
  }

  clearUser() {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    }
  }
}
