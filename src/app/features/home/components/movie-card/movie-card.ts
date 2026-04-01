import { Component, computed, input } from '@angular/core';
import { Movie } from '../../../../models/movie.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './movie-card.html'
})
export class MovieCardComponent {
  movie = input.required<Movie>();

  relativeWatchedTime = computed(() => {
    const watchedAt = this.movie().watchedAt;
    if (!watchedAt) return null;

    const watchedDate = new Date(watchedAt);
    const now = new Date();
    const diffMs = now.getTime() - watchedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 60) {
      return null;
    } else if (diffDays >= 30) {
      const months = Math.floor(diffDays / 30);
      return `${months} tháng trước`;
    } else if (diffDays >= 7) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} tuần trước`;
    } else if (diffDays > 0) {
      return `${diffDays} ngày trước`;
    } else {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours > 0) return `${diffHours} giờ trước`;

      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes > 0) return `${diffMinutes} phút trước`;

      return 'Vừa xong';
    }
  });
}
