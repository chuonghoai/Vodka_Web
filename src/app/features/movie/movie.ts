import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './movie.html'
})
export class MovieComponent implements OnInit {
  private route = inject(ActivatedRoute);

  // Biến lưu ID lấy từ URL
  movieId = signal<string>('');

  ngOnInit() {
    // Lắng nghe sự thay đổi của URL để lấy ID
    this.route.paramMap.subscribe(params => {
      this.movieId.set(params.get('id') || '');
    });
  }
}
