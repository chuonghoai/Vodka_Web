import { MovieService } from './../../services/movie.service';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieDetail } from '../../models/movie.model';
import { CommonModule } from '@angular/common';
import { MovieSliderComponent } from '../home/components/movie-slider/movie-slider';
import { DurationPipe } from "../../shared/pipes/duration.pipe";
import { ReviewComponent } from './components/review/review';
import { TotalViewsPipe } from '../../shared/pipes/total-views.pipe';
import { FavoritesPipe } from '../../shared/pipes/favorites.pipe';
import { NotificationService } from '../../services/notification.service';
import { NotificationType } from '../../models/notification.model';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MovieSliderComponent,
    ReviewComponent,
    DurationPipe,
    TotalViewsPipe,
    FavoritesPipe
  ],
  templateUrl: './movie.html'
})
export class MovieComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private notifService = inject(NotificationService);

  isMainContentDimmed = signal<boolean>(false);
  movieId = signal<number>(0);
  movie = signal<MovieDetail | null>(null);
  selectedSeasonId = signal<number>(0);
  isDescriptionExpanded = signal<boolean>(false);
  isFavorited = signal<boolean>(false);
  isTogglingFavorite = signal<boolean>(false);

  // Get list episodes of current season
  currentEpisodes = computed(() => {
    const data = this.movie();
    if (!data || !data.episodes) return [];
    const season = data.episodes.find(s => s.id === this.selectedSeasonId());
    return season ? season.episodes : [];
  });

  // Get thumbnail of current season
  currentSeasonThumbnail = computed(() => {
    const data = this.movie();
    if (!data || !data.episodes) return null;
    const season = data.episodes.find(s => s.id === this.selectedSeasonId());
    return season?.thumbnailUrl || null;
  });

  // Auto compute first episode
  firstEpisodeId = computed(() => {
    const data = this.movie();
    if (data?.episodes?.[0]?.episodes?.[0]) {
      return data.episodes[0].episodes[0].id;
    }
    return 0;
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!Number.isFinite(id)) return;
      this.movieId.set(id);
      this.isFavorited.set(false);

      this.selectedSeasonId.set(0);
      this.isDescriptionExpanded.set(false);
      this.movie.set(null);

      this.movieService.getMovieById(id).subscribe(res => {
        if (res.success && res.data) {
          if (!res.data.movie) {
            this.movie.set({
              movie: res.data,
              episodes: [],
              reviews: [],
              relatedMovies: [],
              stats: { totalReviews: 0, totalViews: 0, favorites: 0 }
            } as any);
          } else {
            this.movie.set(res.data);
          }

          const currentData = this.movie();
          if (currentData?.episodes && currentData.episodes.length > 0) {
            this.selectedSeasonId.set(currentData.episodes[0].id);
          }
        }
      });
    });
  }

  toggleFavorite() {
    if (this.isTogglingFavorite() || !this.movieId()) return;
    this.isTogglingFavorite.set(true);

    this.movieService.toggleFavorite(this.movieId()).subscribe({
      next: (res) => {
        this.isTogglingFavorite.set(false);
        if (res.success && res.data) {
          this.isFavorited.set(res.data.isFavorited);
          this.notifService.show(NotificationType.SUCCESS, res.message);
        } else {
          this.notifService.show(NotificationType.ERROR, res.message || 'Có lỗi xảy ra');
        }
      },
      error: (err) => {
        this.isTogglingFavorite.set(false);
        this.notifService.show(NotificationType.ERROR, 'Không thể cập nhật yêu thích lúc này. Vui lòng thử lại sau.');
      }
    });
  }

  // Render new review
  onReviewAdded(newReview: any) {
    this.movie.update(currentMovie => {
      if (!currentMovie) return currentMovie;

      const updatedReviews = [...(currentMovie.reviews || [])];

      if (!newReview.replyToId) {
        updatedReviews.unshift(newReview);
      } else {
        const parentIndex = updatedReviews.findIndex(r => r.id === newReview.replyToId);

        if (parentIndex > -1) {
          const parentReview = { ...updatedReviews[parentIndex] };
          parentReview.replied = [...(parentReview.replied || []), newReview];
          updatedReviews[parentIndex] = parentReview;
        }
      }

      return {
        ...currentMovie,
        reviews: updatedReviews
      };
    });
  }

  // Blue screen if open rating modal
  onRatingModalToggled(isDimmed: boolean) {
    this.isMainContentDimmed.set(isDimmed);
  }
}
