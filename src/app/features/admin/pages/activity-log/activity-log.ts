import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../../services/dashboard.service';
import { mapActivitiesToView } from '../../utils/activity.utils';
@Component({
    selector: 'app-activity-log',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './activity-log.html',
})

export class ActivityLogComponent {
    private dashboardService = inject(DashboardService);

    // State
    isLoading = signal(true);
    activities = signal<ActivityView[]>([]);

    // Filter
    searchText = '';
    selectedEntityType = '';
    entityTypes = ['', 'Movie', 'Review', 'Genre', 'Tag', 'User'];

    // Pagination
    currentPage = signal(1);
    totalPages = signal(1);
    pageSize = 10;

    constructor() {
        this.loadActivities();
    }
    loadActivities() {
        this.isLoading.set(true);
        this.dashboardService.getActivities({
            page: this.currentPage(),
            pageSize: this.pageSize,
            search: this.searchText || undefined,
            entityType: this.selectedEntityType || undefined,
        }).subscribe({
            next: (res) => {
                if (res.success) {
                    this.activities.set(mapActivitiesToView(res.data));
                    if (res.pagination) {
                        this.totalPages.set(res.pagination.totalPages);
                    }
                }
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false),
        });
    }
    onSearch() {
        this.currentPage.set(1);
        this.loadActivities();
    }
    goToPage(page: number) {
        if (page < 1 || page > this.totalPages()) return;
        this.currentPage.set(page);
        this.loadActivities();
    }

}