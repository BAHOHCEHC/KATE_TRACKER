import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { AuthGuard } from './shared/classes/auth.guard';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';

// ******************************
import { ClientsPageComponent } from './clients-page/clients-page.component';
import { ReportsComponent } from './reports/reports.component';
import { TasksComponent } from './clients-page/tasks/tasks.component';
import { ClientReportsComponent } from './reports/client-reports/client-reports.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      // { path: 'statistic', loadChildren: './statistic/statistic.module#StatisticModule' },
      { path: 'statistic', loadChildren: () => import('./statistic/statistic.module').then(m => m.StatisticModule) },
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
        component: ReportsComponent,
      },
      {
        path: 'reports/:name',
        component: ClientReportsComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
