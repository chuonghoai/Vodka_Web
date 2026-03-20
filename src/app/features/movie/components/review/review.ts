import { Component, inject, input, signal, computed, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Review } from '../../../../models/movie.model';
import { ReviewService } from '../../../../services/review.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review.html'
})
export class ReviewComponent {
  private reviewService = inject(ReviewService);
  reviewAdded = output<any>();
  ratingModalToggled = output<boolean>();

  isLoading = signal<boolean>(false);
  movieId = input.required<string>();
  reviewsList = signal<Review[]>([]);
  initialReviews = input<Review[]>([]);
  totalReviews = input<number>(0);
  currentPage = signal<number>(1);
  totalPages = computed(() => Math.ceil(this.totalReviews() / 10) || 1);

  newReviewContent = signal('');
  isRatingModalOpen = signal(false);
  selectedRating = signal(0);
  hoverRating = signal(0);
  isSubmitting = signal(false);
  replyingToId = signal<string | null>(null);
  replyContent = signal('');

  constructor() {
    effect(() => {
      this.reviewsList.set(this.initialReviews());
      this.currentPage.set(1);
    }, { allowSignalWrites: true });
  }

  // Change page reviews
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

  // Toggle rating modal
  openRatingModal() {
    if (!this.newReviewContent().trim()) return;
    this.isRatingModalOpen.set(true);
    this.ratingModalToggled.emit(true);
  }

  closeRatingModal() {
    this.isRatingModalOpen.set(false);
    this.selectedRating.set(0);
    this.hoverRating.set(0);
    this.ratingModalToggled.emit(false);
  }

  // Submit review
  submitMainReview() {
    if (this.selectedRating() === 0) return;
    this.isSubmitting.set(true);

    this.reviewService.postReview({
      movieId: this.movieId(),
      rating: this.selectedRating(),
      content: this.newReviewContent()
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.reviewAdded.emit(res.data);
          this.newReviewContent.set('');
          this.closeRatingModal();
        }
        this.isSubmitting.set(false);
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  // Toggle reply review
  toggleReply(reviewId: string) {
    if (this.replyingToId() === reviewId) {
      this.replyingToId.set(null);
      this.replyContent.set('');
    } else {
      this.replyingToId.set(reviewId);
      this.replyContent.set('');
    }
  }

  // Reply reviews
  submitReply(parentId: string) {
    if (!this.replyContent().trim()) return;
    this.isSubmitting.set(true);

    this.reviewService.postReview({
      movieId: this.movieId(),
      content: this.replyContent(),
      replyToId: parentId
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.reviewAdded.emit(res.data);
          this.replyingToId.set(null);
          this.replyContent.set('');
        }
        this.isSubmitting.set(false);
      },
      error: () => this.isSubmitting.set(false)
    });
  }
}
