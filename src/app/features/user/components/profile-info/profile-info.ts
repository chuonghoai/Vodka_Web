import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-zinc-800/60 shadow-xl relative">
      <div class="flex justify-between items-start mb-6">
        <h3 class="text-2xl font-black text-white pl-4 border-l-4 border-red-600">Thông tin chi tiết</h3>
        <button (click)="onEdit.emit()" class="bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold px-4 py-2 rounded-xl border border-zinc-700 hover:border-zinc-500 transition-colors flex items-center gap-2 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
          Chỉnh sửa
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
          <p class="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Số điện thoại</p>
          <p class="text-zinc-200 font-medium text-lg">{{ profile()?.phone || 'Chưa cập nhật' }}</p>
        </div>
        <div class="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
          <p class="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Ngày sinh</p>
          <p class="text-zinc-200 font-medium text-lg">{{ profile()?.dateOfBirth || 'Chưa cập nhật' }}</p>
        </div>
        <div class="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
          <p class="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Giới tính</p>
          <p class="text-zinc-200 font-medium text-lg">{{ profile()?.gender || 'Chưa cập nhật' }}</p>
        </div>
      </div>
    </div>
  `
})
export class ProfileInfoComponent {
  profile = input<User | null>(null);
  onEdit = output<void>();
}
