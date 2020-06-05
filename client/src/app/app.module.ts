import { ClientsViewComponent } from './shared/layouts/clients-layout/clients-view/clients-view.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppStoreModule } from './store/app-store.module';

import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { AppRoutingModule } from './app-routing.module';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { TokenInterceptor } from './shared/classes/token.interceptor';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { ClientsPageComponent } from './clients-page/clients-page.component';
import { TasksComponent } from './clients-page/tasks/tasks.component';
import { MonthlyReportsComponent } from './monthly-reports/monthly-reports.component';
import { TaskRowComponent } from './shared/components/task-row/task-row.component';
import { ClientStatisticComponent } from './shared/layouts/clients-layout/clients-statistic.component';
import {
  DayPipe,
  HourPipe
} from './shared/pipes';


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    RegisterPageComponent,
    LoaderComponent,
    ClientsPageComponent,
    TasksComponent,
    MonthlyReportsComponent,
    TaskRowComponent,
    DayPipe,
    HourPipe,
    ClientStatisticComponent,
    ClientsViewComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
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
