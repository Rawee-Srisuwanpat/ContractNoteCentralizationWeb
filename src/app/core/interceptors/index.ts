import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyHttpInterceptor } from './myhttp-interceptor';
import { MyHttp2Interceptor } from './modifybody-interceptor';



/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: MyHttpInterceptor, multi: true },
  // { provide: HTTP_INTERCEPTORS, useClass: MyHttp2Interceptor, multi: true },
];