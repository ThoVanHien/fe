import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { adminGuard } from './guards/admin.guard';
import { AdminComponent, DashboardComponent, LessonsComponent, LoginComponent, RightsComponent, UserComponent } from './pages';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'lessons',
        component: LessonsComponent
      },
      {
        path: 'users',
        component: UserComponent
      },
      {
        path: 'rights',
        component: RightsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
