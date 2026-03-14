import { MovieService } from './../../services/movie.service';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieDetail } from '../../models/movie.model';
import { CommonModule } from '@angular/common';
import { MovieSliderComponent } from '../home/components/movie-slider/movie-slider';
import { DurationPipe } from "../../shared/pipes/duration.pipe";

// 1. IMPORT REVIEW COMPONENT VÀO ĐÂY
import { ReviewComponent } from './components/review/review';

@Component({
  selector: 'app-movie',
  standalone: true,
  // 2. KHAI BÁO VÀO MẢNG IMPORTS
  imports: [RouterModule, CommonModule, MovieSliderComponent, DurationPipe, ReviewComponent],
  templateUrl: './movie.html'
})
export class MovieComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

  movieId = signal<string>('');
  movie = signal<MovieDetail | null>(null);
  selectedSeasonId = signal<string>('');
  isDescriptionExpanded = signal<boolean>(false);

  currentEpisodes = computed(() => {
    const data = this.movie();
    if (!data || !data.episodes) return [];
    const season = data.episodes.find(s => s.id === this.selectedSeasonId());
    return season ? season.episodes : [];
  });

  currentSeasonThumbnail = computed(() => {
    const data = this.movie();
    if (!data || !data.episodes) return null;
    const season = data.episodes.find(s => s.id === this.selectedSeasonId());
    return season?.thumbnailUrl || null;
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') || '';
      this.movieId.set(id);

      this.selectedSeasonId.set('');
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
}
