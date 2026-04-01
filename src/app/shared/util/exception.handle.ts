import { HttpErrorResponse } from '@angular/common/http';

export function handleHttpError(err: HttpErrorResponse | any): string {
  if (err.error && Array.isArray(err.error.message)) {
    return err.error.message[0];
  }
  if (err.error && typeof err.error.message === 'string') {
    return err.error.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  return 'Lỗi kết nối hoặc dữ liệu không hợp lệ. Vui lòng thử lại.';
}
