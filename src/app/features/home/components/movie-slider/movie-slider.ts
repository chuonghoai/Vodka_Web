import { Component, input } from '@angular/core';
import { Movie } from '../../../../models/movie.model';
import { MovieCardComponent } from '../movie-card/movie-card';

@Component({
  selector: 'app-movie-slider',
  standalone: true,
  imports: [MovieCardComponent],
  template: `
    <div class="py-6">
      <h2 class="text-xl font-bold text-white mb-4 pl-4 border-l-4 border-red-600">{{ title() }}</h2>

      <div class="flex gap-4 overflow-x-auto pb-4 px-4 snap-x hide-scrollbar">
        @for (m of movies(); track m.id) {
          <div class="min-w-[160px] md:min-w-[200px] snap-start">
            <app-movie-card [movie]="m"></app-movie-card>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class MovieSliderComponent {
  title = input.required<string>();
  movies = input.required<Movie[]>();
}
