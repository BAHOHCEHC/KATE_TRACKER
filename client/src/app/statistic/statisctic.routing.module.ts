import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticComponent } from './statistic.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':id/:from/:to/:name/:imgRoute',
        // path: ':id/:from/:to/:name',
        component: StatisticComponent,
      },
      { path: '', redirectTo: '/statistic'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticRoutingModule { }
