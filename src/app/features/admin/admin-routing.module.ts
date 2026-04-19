import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminReportsComponent } from './admin-reports/admin-reports.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: AdminHomeComponent,
    title: 'Admin lazy module'
  },
  {
    path: 'reports',
    canActivate: [authGuard],
    component: AdminReportsComponent,
    title: 'Admin reports'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
