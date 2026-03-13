import { Component, input } from '@angular/core';
import { Movie } from '../../../../models/movie.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './movie-card.html'
})
export class MovieCardComponent {
  // Angular 21: Sử dụng Signal Input
  movie = input.required<Movie>();
}
