import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { WatchDetailData } from '../../models/watch.model';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { MovieSliderComponent } from '../home/components/movie-slider/movie-slider';
import { ReviewComponent } from '../movie/components/review/review';
import { WatchService } from '../../services/watch.service';
import { TotalViewsPipe } from '../../shared/pipes/total-views.pipe';

@Component({
  selector: 'app-watch',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DurationPipe,
    MovieSliderComponent,
    ReviewComponent,
    TotalViewsPipe
  ],
  templateUrl: './watch.html'
})
export class WatchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private watchService = inject(WatchService);
  private platformId = inject(PLATFORM_ID);

  episodeId = signal<string>('');
  watchData = signal<WatchDetailData | null>(null);

  selectedSeasonId = signal<string>('');

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.episodeId.set(id);
        this.loadWatchData(id);
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });
  }

  loadWatchData(id: string) {
    this.watchData.set(null);

    this.watchService.getWatchDetail(id).subscribe(res => {
      if (res.success && res.data) {
        this.watchData.set(res.data);
        // console.log(res.data);
        const seasons = res.data.seasons || [];

        for (const season of seasons) {
          if (season.episodes.some(ep => ep.id === id)) {
            this.selectedSeasonId.set(season.id);
            break;
          }
        }

      }
    });
  }

  goToEpisode(epId: string) {
    if (this.episodeId() !== epId) {
      this.router.navigate(['/watch', epId]);
    }
  }

  toggleSeason(seasonId: string) {
    if (this.selectedSeasonId() === seasonId) {
      this.selectedSeasonId.set('');
    } else {
      this.selectedSeasonId.set(seasonId);
    }
  }
}
