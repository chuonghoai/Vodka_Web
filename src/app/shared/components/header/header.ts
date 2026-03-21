import { Component, inject, OnInit, signal } from '@angular/core';
import { Genre } from '../../../models/genre.model';
import { FilterService } from '../../../services/filter.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserState } from '../../../core/states/user.state';
import { Tag } from '../../../models/tag.model';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  // Inject
  private filterService = inject(FilterService);
  private authService = inject(AuthService);
  private userState = inject(UserState);
  private router = inject(Router);

  // Meta data
  genres = this.filterService.genres;
  tags = this.filterService.tags;
  selectedGenreSlugs = signal<string[]>([]);

  // mobile/pc
  isMobileMenuOpen = signal<boolean>(false);

  // Current user from state
  currentUser = this.userState.currentUser;

  // Init
  ngOnInit(): void {
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  // API filter movies
  applyFilter(tagSlug?: string) {
    const queryParams: any = { page: 1 };
    if (tagSlug) queryParams.tag = tagSlug;
    if (this.selectedGenreSlugs().length > 0) queryParams.genres = this.selectedGenreSlugs();

    this.router.navigate(['/search'], { queryParams });
    this.isMobileMenuOpen.set(false);
  }

  toggleGenre(slug: string) {
    this.selectedGenreSlugs.update(slugs =>
      slugs.includes(slug) ? slugs.filter(item => item !== slug) : [...slugs, slug]
    );
  }

  clearSelectedGenres() {
    this.selectedGenreSlugs.set([]);
  }

  logout() {
    this.authService.logout();
    this.isMobileMenuOpen.set(false);
  }
}
