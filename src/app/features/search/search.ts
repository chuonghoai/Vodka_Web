import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { FilterService } from '../../services/filter.service';
import { MovieListComponent } from '../home/components/movie-list/movie-list';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, MovieListComponent],
  template: `
    <div class="pt-32 pb-12 min-h-[80vh]">
      <app-movie-list
        [title]="listTitle()"
        [movies]="movies()"
        [currentPage]="page()"
        [totalPages]="totalPages()"
        (changePage)="onPageChange($event)">
      </app-movie-list>
    </div>
  `
})
export class SearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);
  private filterService = inject(FilterService);

  movies = signal<Movie[]>([]);
  page = signal(1);
  totalPages = signal(1);

  listTitle = signal<string>('Đang tải...');

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.updateTitle(params);
      this.loadData(params);
    });
  }

  /**
   * Cập nhật tiêu đề trang dựa trên tham số filter (Keyword, Genre, Tag)
   */
  updateTitle(params: any) {
    let parts = [];
    if (params['keyword']) parts.push(`Từ khóa "${params['keyword']}"`);
    if (params['tag']) parts.push(this.filterService.getNameBySlug(params['tag']));
    if (params['genres']) {
      const g = Array.isArray(params['genres']) ? params['genres'] : [params['genres']];
      parts.push(g.map((slug: string) => this.filterService.getNameBySlug(slug)).join(', '));
    }
    this.listTitle.set(parts.length > 0 ? `Kết quả: ${parts.join(' - ')}` : 'Tất cả phim');
  }

  /**
   * Tải danh sách kết quả tìm kiếm dựa theo các bộ lọc
   */
  loadData(params: any) {
    const page = params['page'] ? parseInt(params['page'], 10) : 1;

    this.movieService.filterMovies({
      keyword: params['keyword'],
      tag: params['tag'],
      genres: params['genres'] ? (Array.isArray(params['genres']) ? params['genres'] : [params['genres']]) : undefined,
      page: page,
      pageSize: 30
    }).subscribe(res => {
      if (res.success) {
        this.movies.set(Array.isArray(res.data) ? res.data : []);
        this.page.set(page);
        this.totalPages.set(res.pagination?.totalPages || 1);
      }
    });
  }

  /**
   * Chuyển trang (Pagination) thông qua cập nhật queryParams trên URL
   */
  onPageChange(newPage: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: newPage },
      queryParamsHandling: 'merge'
    });
  }
}
