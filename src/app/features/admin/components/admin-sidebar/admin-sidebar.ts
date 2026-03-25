import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  exact: boolean;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebarComponent {
  isCollapsed = signal(false);

  menuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'Dashboard Overview', route: '/admin', exact: true },
    { icon: 'movie', label: 'Quản lý Phim', route: '/admin/movies', exact: false },
    { icon: 'group', label: 'Quản lý User', route: '/admin/users', exact: false },
    { icon: 'category', label: 'Quản lý Thể loại', route: '/admin/genres', exact: false },
    { icon: 'label', label: 'Quản lý Tag', route: '/admin/tags', exact: false },
    { icon: 'rate_review', label: 'Quản lý Review', route: '/admin/reviews', exact: false },
    { icon: 'settings', label: 'Cài đặt', route: '/admin/settings', exact: false },
  ];

  toggleSidebar() {
    this.isCollapsed.update(v => !v);
  }
}
