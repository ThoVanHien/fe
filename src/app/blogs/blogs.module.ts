import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../shared';
import { BlogsRoutingModule } from './blogs-routing.module';
import { BlogDetailComponent, BlogListComponent } from './pages';

@NgModule({
  declarations: [BlogListComponent, BlogDetailComponent],
  imports: [CommonModule, MaterialModule, BlogsRoutingModule]
})
export class BlogsModule {}

