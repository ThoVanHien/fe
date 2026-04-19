import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlogDetailComponent, BlogListComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    component: BlogListComponent
  },
  {
    path: ':slug',
    component: BlogDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule {}

