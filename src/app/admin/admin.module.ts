import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin.routing.module';
import { HasRoleDirective } from './directives/has-role.directive';
import { AdminComponent, DashboardComponent, LessonsComponent, LoginComponent, RightsComponent, UserComponent } from './pages';
import { PermissionLabelPipe } from './pipes/permission-label.pipe';
import { MaterialModule } from '../shared';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    LessonsComponent,
    LoginComponent,
    RightsComponent,
    UserComponent,
    HasRoleDirective,
    PermissionLabelPipe
  ],
  imports: [CommonModule, FormsModule, MaterialModule, AdminRoutingModule]
})
export class AdminModule {}
