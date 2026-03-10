import { Component, input, output, computed } from '@angular/core';
import { Movie } from '../../../../models/movie.model';
import { MovieCardComponent } from '../movie-card/movie-card';

// Interface hỗ trợ render các nút (kể cả dấu '...')
interface PageItem {
  label: string | number;
  value: number | null;
}

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [MovieCardComponent],
  templateUrl: './movie-list.html'
})
export class MovieListComponent {
  title = input.required<string>();
  movies = input.required<Movie[]>();

  currentPage = input.required<number>();
  totalPages = input.required<number>();

  changePage = output<number>();

  pages = computed<PageItem[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const items: PageItem[] = [];

    if (total <= 13) {
      for (let i = 1; i <= total; i++) items.push({ label: i, value: i });
      return items;
    }

    if (current < 6) {
      for (let i = 1; i <= 9; i++) items.push({ label: i, value: i });
      items.push({ label: '...', value: null });
      for (let i = total - 2; i <= total; i++) items.push({ label: i, value: i });
    }
    else if (current > total - 7) {
      items.push({ label: '...', value: null });
      for (let i = total - 11; i <= total; i++) items.push({ label: i, value: i });
    }
    else {
      items.push({ label: '...', value: null });
      for (let i = current - 4; i <= current + 4; i++) items.push({ label: i, value: i });
      items.push({ label: '...', value: null });
      for (let i = total - 2; i <= total; i++) items.push({ label: i, value: i });
    }

    return items;
  });
}
