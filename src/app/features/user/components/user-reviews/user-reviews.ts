import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-reviews',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="py-6">
      <h2 class="text-xl font-bold text-white mb-6 pl-4 border-l-4 border-red-600">Đánh giá của tôi</h2>

      <div class="flex flex-col gap-5">
        @for (review of reviews(); track review.id) {
          <div class="bg-zinc-900/60 backdrop-blur rounded-2xl p-5 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col md:flex-row gap-5 group">

            <div [routerLink]="['/movie', review.movie.id]" class="flex items-center gap-4 cursor-pointer md:w-1/3 shrink-0">
              <div class="w-16 h-24 md:w-20 md:h-28 rounded-lg overflow-hidden shrink-0 shadow-md">
                <img [src]="review.movie.posterUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
              </div>
              <div>
                <h4 class="text-base font-bold text-white group-hover:text-red-500 transition-colors line-clamp-2">{{ review.movie.title }}</h4>
                <div class="flex flex-wrap gap-1 mt-2">
                  @for (t of review.movie.tags; track t.id) {
                    <span class="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700">{{ t.name }}</span>
                  }
                </div>
              </div>
            </div>

            <div class="flex-1 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50 flex flex-col justify-center">
              <div class="flex items-center justify-between mb-2">
                <span class="text-yellow-500 font-bold text-sm bg-yellow-500/10 px-3 py-1 rounded-lg">⭐ Điểm của bạn: {{ review.rating }}/10</span>
                <span class="text-zinc-500 text-xs">{{ review.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <p class="text-zinc-300 text-sm leading-relaxed italic">"{{ review.content }}"</p>
            </div>

          </div>
        }

        @if (reviews().length === 0) {
          <div class="text-center py-10 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
            <p class="text-zinc-500">Bạn chưa có đánh giá nào.</p>
          </div>
        }
      </div>

      @if (totalPages() > 1) {
        <div class="flex justify-center items-center gap-4 mt-8">
          <button (click)="changePage.emit(currentPage() - 1)" [disabled]="currentPage() === 1" class="w-10 h-10 rounded-full flex items-center justify-center text-white bg-zinc-800 hover:bg-red-500 disabled:opacity-30 disabled:hover:bg-zinc-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <span class="text-zinc-400 font-bold">{{ currentPage() }} / {{ totalPages() }}</span>
          <button (click)="changePage.emit(currentPage() + 1)" [disabled]="currentPage() === totalPages()" class="w-10 h-10 rounded-full flex items-center justify-center text-white bg-zinc-800 hover:bg-red-500 disabled:opacity-30 disabled:hover:bg-zinc-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>
      }
    </div>
  `
})
export class UserReviewsComponent {
  reviews = input.required<any[]>();
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  changePage = output<number>();
}
