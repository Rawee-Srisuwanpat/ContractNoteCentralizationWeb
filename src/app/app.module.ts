import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from './shared/shared.module';
import { AuthGuard } from './core/guards/auth.guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { ConfirmationService, MessageService } from 'primeng/api';
import { MyHttpInterceptor } from './core/interceptors/myhttp-interceptor';
import { MyHttp2Interceptor } from './core/interceptors/modifybody-interceptor';
import { httpInterceptorProviders } from './core/interceptors';
//import { ApiService } from './core/services/api.service';

//import {  DynamicDialogRef } from 'primeng/dynamicdialog';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FontAwesomeModule,
    SharedModule,
    HttpClientModule,
  ],
  providers: [
    AuthGuard,
    ConfirmationService,
    MessageService,
    httpInterceptorProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
