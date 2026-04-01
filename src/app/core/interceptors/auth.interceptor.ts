import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Bỏ qua intercept việc đính kèm token đối với các request đến Cloudinary để tránh lỗi CORS
  if (req.url.includes('api.cloudinary.com')) {
    return next(req);
  }

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('accessToken');

    if (token) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next(clonedReq);
    }
  }

  return next(req);
};
