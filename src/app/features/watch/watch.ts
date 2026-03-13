import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-watch',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './watch.html'
})
export class WatchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  movieId = signal<string>('');

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.movieId.set(params.get('id') || '');
    });
  }
}
