import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-avatar-cropper',
  standalone: true,
  imports: [CommonModule, ImageCropperComponent],
  template: `
    @if (imageChangedEvent()) {
      <div class="fixed inset-0 z-150 bg-black/80 backdrop-blur-sm animate-fade-in"></div>

      <div class="fixed inset-0 z-151 flex items-center justify-center p-4">

        <div class="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative w-full max-w-lg animate-fade-in-up">

          <button (click)="cancelCrop()" class="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors bg-zinc-800/50 hover:bg-zinc-800 rounded-full">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <h3 class="text-2xl font-black text-white mb-6 pr-8">Cắt ảnh đại diện</h3>

          <div class="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden mb-6 aspect-square max-h-100">
            <image-cropper
              [imageChangedEvent]="imageChangedEvent()"
              [maintainAspectRatio]="true"
              [aspectRatio]="1 / 1"
              [roundCropper]="true"
              format="png"
              output="base64"
              (imageCropped)="imageCropped($event)"
              (imageLoaded)="imageLoaded($event)"
              (cropperReady)="cropperReady()"
              (loadImageFailed)="loadImageFailed()"
              class="w-full h-full"
            ></image-cropper>
          </div>

          <div class="flex gap-3">
            <button type="button" (click)="cancelCrop()" class="flex-1 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-colors">
              Hủy
            </button>
            <button type="button" (click)="confirmCrop()" class="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-lg shadow-red-600/20">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
    .animate-fade-in-up { animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

    /* Tùy chỉnh CSS của thư viện để ẩn viền đen mặc định */
    :host ::ng-deep .cropper-bg { background: none !important; }
    :host ::ng-deep .ngx-ic-cropper { border: 2px solid #ef4444 !important; box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7) !important; }
  `]
})
export class AvatarCropperComponent {
  // Nhận event chọn file từ input
  imageChangedEvent = input<any>(null);

  // Output trả về ảnh đã cắt dạng Base64 (hoặc Blob)
  onCropped = output<string>();
  // Output khi đóng modal
  onCancel = output<void>();

  croppedImageBase64 = signal<string>('');

  imageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      this.croppedImageBase64.set(event.base64);
    }
  }

  confirmCrop() {
    if (this.croppedImageBase64()) {
      this.onCropped.emit(this.croppedImageBase64());
    }
  }

  cancelCrop() {
    this.onCancel.emit();
  }

  // --- Các hàm hỗ trợ của thư viện (Tạm thời không dùng đến) ---
  imageLoaded(image: LoadedImage) { /* Chạy khi ảnh gốc load xong */ }
  cropperReady() { /* Chạy khi khung cắt sẵn sàng */ }
  loadImageFailed() { console.error('Không thể tải hình ảnh này!'); this.cancelCrop(); }
}
