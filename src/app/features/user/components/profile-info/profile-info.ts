import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-zinc-800/60 shadow-xl relative transition-all duration-300" [class.border-red-900/50]="isEditing()">
      <div class="flex justify-between items-start mb-6">
        <h3 class="text-2xl font-black text-white pl-4 border-l-4 border-red-600">Thông tin chi tiết</h3>

        @if (!isEditing()) {
          <button (click)="startEdit()" class="bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold px-4 py-2 rounded-xl border border-zinc-700 hover:border-zinc-500 transition-colors flex items-center gap-2 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
            Chỉnh sửa
          </button>
        } @else {
          <div class="flex items-center gap-2">
            <button (click)="cancelEdit()" class="bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold px-4 py-2 rounded-xl border border-zinc-700 transition-colors">
              Hủy
            </button>
            <button (click)="saveEdit()" class="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-red-600/20">
              Lưu
            </button>
          </div>
        }
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50 transition-colors" [class.border-zinc-700]="isEditing()">
          <p class="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">Số điện thoại</p>
          @if (!isEditing()) {
            <p class="text-zinc-200 font-medium text-lg">{{ profile()?.phone || 'Chưa cập nhật' }}</p>
          } @else {
            <input type="tel" [(ngModel)]="editPhone" placeholder="Nhập số điện thoại" class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500 transition-colors">
          }
        </div>

        <div class="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50 transition-colors" [class.border-zinc-700]="isEditing()">
          <p class="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">Ngày sinh</p>
          @if (!isEditing()) {
            <p class="text-zinc-200 font-medium text-lg">{{ getDisplayDate(profile()?.dateOfBirth) || 'Chưa cập nhật' }}</p>
          } @else {
            <input type="date" [(ngModel)]="editDob" class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500 transition-colors [color-scheme:dark]">
          }
        </div>

        <div class="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50 transition-colors" [class.border-zinc-700]="isEditing()">
          <p class="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">Giới tính</p>
          @if (!isEditing()) {
            <p class="text-zinc-200 font-medium text-lg">{{ getDisplayGender(profile()?.gender) }}</p>
          } @else {
            <select [(ngModel)]="editGender" class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500 transition-colors appearance-none cursor-pointer">
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          }
        </div>
      </div>
    </div>
  `
})
export class ProfileInfoComponent {
  profile = input<User | null>(null);
  onSaveProfile = output<any>();

  isEditing = signal<boolean>(false);
  editPhone = signal<string>('');
  editDob = signal<string>('');
  editGender = signal<string>('other');

  constructor() {
    effect(() => {
      if (this.profile() && !this.isEditing()) {
        this.resetEditData();
      }
    }, { allowSignalWrites: true });
  }

  private resetEditData() {
    this.editPhone.set(this.profile()?.phone || '');

    // Convert Date từ backend thành chuẩn YYYY-MM-DD để hiển thị vào thẻ <input type="date">
    let formattedDate = '';
    if (this.profile()?.dateOfBirth) {
      const d = new Date(this.profile()!.dateOfBirth);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toISOString().split('T')[0];
      }
    }
    this.editDob.set(formattedDate);
    this.editGender.set(this.profile()?.gender?.toLowerCase() || 'other');
  }

  // Hàm chuyển đổi tiếng Anh sang tiếng Việt khi hiển thị (Không lúc Edit)
  getDisplayGender(gender?: string): string {
    if (!gender) return 'Chưa cập nhật';
    const g = gender.toLowerCase();
    if (g === 'male') return 'Nam';
    if (g === 'female') return 'Nữ';
    if (g === 'other') return 'Khác';
    return gender;
  }

  // Hàm format ngày tháng đẹp cho tiếng Việt (DD/MM/YYYY)
  getDisplayDate(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('vi-VN');
  }

  startEdit() {
    this.resetEditData();
    this.isEditing.set(true);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }

  saveEdit() {
    let formattedDob = this.editDob();

    if (formattedDob && formattedDob.includes('-')) {
      const [year, month, day] = formattedDob.split('-');
      formattedDob = `${month}/${day}/${year}`;
    }

    const updatedData = {
      phone: this.editPhone(),
      dateOfBirth: formattedDob,
      gender: this.editGender()
    };
    this.onSaveProfile.emit(updatedData);
    this.isEditing.set(false);
  }
}
