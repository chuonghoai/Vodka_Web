import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AdminReviewService } from '../../../../../services/admin/review.service';
import { MovieService } from '../../../../../services/movie.service';
import { Movie } from '../../../../../models/movie.model';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './add-review.html',
})
export class AddReviewComponent {

    private reviewService = inject(AdminReviewService);
    private movieService = inject(MovieService);

  // output
  reviewCreated = output<void>();
  closed = output<void>();

  // Modal 
  isVisible = signal(true);
  isSubmitting = signal(false);

  // Form
  newRating = signal(0);
  newContent = signal('');

  // Movie Search
  movieSearchQuery = signal('');
  movieSearchResults = signal<Movie[]>([]);
  selectedMovie = signal<Movie | null>(null);
  showMovieDropdown = signal(false);
  isSearchingMovies = signal(false);
  private searchTimer: any = null;

  // Movie Search
  onMovieSearchInput(): void {
    clearTimeout(this.searchTimer);
    const query = this.movieSearchQuery().trim();
    if (!query) {
      this.movieSearchResults.set([]);
      this.showMovieDropdown.set(false);
      return;
    }
    this.searchTimer = setTimeout(() => this.searchMovies(query), 400);
  }

  private searchMovies(keyword: string) {
    this.isSearchingMovies.set(true);
    this.movieService.filterMovies({keyword, page:1, pageSize: 10 }).subscribe({
        next: (res: any) =>{
            if(res.success){
                this.movieSearchResults.set(res.data);
                this.showMovieDropdown.set(true);
            }
            this.isSearchingMovies.set(false);
        },
        error: () => this.isSearchingMovies.set(false),
    });
  }

  selectMovie(movie: Movie){
    this.selectedMovie.set(movie);
    this.movieSearchQuery.set(movie.title);
    this.movieSearchResults.set([]);
    this.showMovieDropdown.set(false);
  }

  clearSelectedMovie(){
    this.selectedMovie.set(null);
    this.movieSearchQuery.set('');
    this.movieSearchResults.set([]);
  }

  // Rating
  setRating(start: number){
    this.newRating.set(start);
  }

  getStarArray(): boolean[] {
    return Array.from({ length: 10 }, (_, i) => i < this.newRating());
  }

  // Action
  close(): void {
    this.closed.emit();
  }

  submit(): void {
    const movie = this.selectedMovie();
    const rating = this.newRating();
    const content = this.newContent().trim();

    if(!movie || !rating || !content) return;

    this.isSubmitting.set(true);
    this.reviewService.createReview({
        movieId: movie.id,
        rating,
        content
    }).subscribe({
        next: (res) =>{
            if(res.success){
                this.reviewCreated.emit();
            }
            this.isSubmitting.set(false);
        },
        error: () => this.isSubmitting.set(false),
    })

  }




}