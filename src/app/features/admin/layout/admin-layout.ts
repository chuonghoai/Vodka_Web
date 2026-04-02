import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar';
import { AdminTopbarComponent } from '../components/admin-topbar/admin-topbar';
import { AdminFooterComponent } from '../components/admin-footer/admin-footer';
import { NotificationComponent } from '../../../shared/components/notification/notification';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminSidebarComponent, AdminTopbarComponent, AdminFooterComponent, NotificationComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayoutComponent {}
