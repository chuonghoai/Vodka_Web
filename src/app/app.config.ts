import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import {
  GoogleLoginProvider,
  SocialLoginModule,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch(),
      withInterceptors([authInterceptor]),
    ),
    provideAnimationsAsync(),
    importProvidersFrom(SocialLoginModule),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '209986638185-no6hvfj26siiebjqst5a2ru4qk3ltt9r.apps.googleusercontent.com'
            )
          },
        ],
        onError: (err: any) => {
          console.error('Lỗi khởi tạo Google Auth: ', err);
        }
      } as SocialAuthServiceConfig,
    }
  ]
};
