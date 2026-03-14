import { Component, inject, input, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../../../../models/movie.model';
import { ReviewService } from '../../../../services/review.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.html'
})
export class ReviewComponent {
  private reviewService = inject(ReviewService);

  movieId = input.required<string>();
  initialReviews = input<Review[]>([]);
  totalReviews = input<number>(0);

  currentPage = signal<number>(1);
  isLoading = signal<boolean>(false);
  reviewsList = signal<Review[]>([]);

  totalPages = computed(() => Math.ceil(this.totalReviews() / 10) || 1);

  constructor() {
    effect(() => {
      this.reviewsList.set(this.initialReviews());
      this.currentPage.set(1);
    }, { allowSignalWrites: true });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages() || this.isLoading()) return;

    this.currentPage.set(page);
    this.isLoading.set(true);

    this.reviewService.getReviewsByMovieId(this.movieId(), page, 10).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success && res.data) {
          this.reviewsList.set(res.data);
        }
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
