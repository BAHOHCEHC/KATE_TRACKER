import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { AuthGuard } from './shared/classes/auth.guard';
// ******************************
import { ClientsPageComponent } from './clients-page/clients-page.component';
import { MonthlyReportsComponent } from './monthly-reports/monthly-reports.component';
import { TasksComponent } from './clients-page/tasks/tasks.component';
import { ClientStatisticComponent } from './shared/layouts/clients-layout/clients-statistic.component';
import { ClientsViewComponent } from './shared/layouts/clients-layout/clients-view/clients-view.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegisterPageComponent }
    ]
  },
  {
    path: '',
    component: SiteLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'clients',
        component: ClientsPageComponent,
        children: [
          {
            path: ':id',
            component: TasksComponent
          }
        ]
      },
      {
        path: 'reports',
        component: MonthlyReportsComponent
      }
    ]
  },
  {
    path: 'clients-statistic',
    component: ClientStatisticComponent,
    children: [
      {
        // path: ':id',
        path: ':id/:from/:to',
        component: ClientsViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
