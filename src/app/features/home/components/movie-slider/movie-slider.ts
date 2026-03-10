import { Component, input, viewChild, ElementRef } from '@angular/core';
import { Movie } from '../../../../models/movie.model';
import { MovieCardComponent } from '../movie-card/movie-card';

@Component({
  selector: 'app-movie-slider',
  standalone: true,
  imports: [MovieCardComponent],
  templateUrl: './movie-slider.html',
  styles: [`
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class MovieSliderComponent {
  title = input.required<string>();
  icon = input<string>('film');
  movies = input.required<Movie[]>();

  sliderContainer = viewChild<ElementRef<HTMLDivElement>>('sliderContainer');

  scrollLeft() {
    if (this.sliderContainer()) {
      this.sliderContainer()!.nativeElement.scrollBy({ left: -600, behavior: 'smooth' });
    }
  }

  scrollRight() {
    if (this.sliderContainer()) {
      this.sliderContainer()!.nativeElement.scrollBy({ left: 600, behavior: 'smooth' });
    }
  }
}
