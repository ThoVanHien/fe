import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { AboutUsComponent, ContactUsComponent, HomeUsComponent, PostDetailComponent } from './pages';
import { MaterialModule } from '../shared';

@NgModule({
  declarations: [HomeUsComponent, AboutUsComponent, ContactUsComponent, PostDetailComponent],
  imports: [CommonModule, FormsModule, MaterialModule, HomeRoutingModule]
})
export class HomeModule {}
