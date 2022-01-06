import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
// import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { TokenInterceptor } from './shared/classes/token.interceptor';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { AppStoreModule } from './store/app-store.module';

import { ClientsPageComponent } from './clients-page/clients-page.component';
import { TasksComponent } from './clients-page/tasks/tasks.component';
import { ReportsComponent } from './reports/reports.component';
import { ClientStatisticComponent } from './shared/layouts/clients-layout/clients-statistic.component';
import { SharedModule } from './shared/module/shared-module/shared-module.module';
import { ClientReportsComponent } from './reports/client-reports/client-reports.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    RegisterPageComponent,
    ClientsPageComponent,
    TasksComponent,
    ReportsComponent,
    ClientReportsComponent,
    ClientStatisticComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SharedModule,
    AppStoreModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
