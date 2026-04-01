import { Component, input } from '@angular/core';
import { Movie } from '../../../../models/movie.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-column',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './movie-column.html'
})
export class MovieColumnComponent {
  title = input<string>('Đã xem');
  movies = input.required<Movie[]>();
}
