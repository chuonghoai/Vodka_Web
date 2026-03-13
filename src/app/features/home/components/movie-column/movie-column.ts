import { Component, input } from '@angular/core';
import { Movie } from '../../../../models/movie.model';

@Component({
  selector: 'app-movie-column',
  standalone: true,
  templateUrl: './movie-column.html'
})
export class MovieColumnComponent {
  title = input<string>('Đã xem');
  movies = input.required<Movie[]>();
}
