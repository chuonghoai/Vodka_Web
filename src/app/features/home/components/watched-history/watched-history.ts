import { Component, input } from '@angular/core';
import { Movie } from '../../../../models/movie.model';

@Component({
  selector: 'app-watched-history',
  standalone: true,
  templateUrl: './watched-history.html'
})
export class WatchedHistoryComponent {
  title = input<string>('Đã xem');
  movies = input.required<Movie[]>();
}
