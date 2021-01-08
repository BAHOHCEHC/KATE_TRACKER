import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientsPageComponent } from './clients-page/clients-page.component';
import { TasksComponent } from './clients-page/tasks/tasks.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MonthlyReportsComponent } from './monthly-reports/monthly-reports.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import {
  ClientStatisticComponent
} from './shared/layouts/clients-layout/clients-statistic.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { SharedModule } from './shared/module';
// import { AppStoreModule } from './store/app-store.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    RegisterPageComponent,
    ClientsPageComponent,
    TasksComponent,
    MonthlyReportsComponent,
    ClientStatisticComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // AppStoreModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SharedModule,
    // StoreModule.forRoot({}, {})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
