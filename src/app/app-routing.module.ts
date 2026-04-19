import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(module => module.HomeModule)
  },
  {
    path: 'blogs',
    loadChildren: () => import('./blogs/blogs.module').then(module => module.BlogsModule)
  },
  {
    path: 'courses',
    loadChildren: () => import('./courses/courses.module').then(module => module.CoursesModule)
  },
  {
    path: 'github',
    loadChildren: () => import('./github/github.module').then(module => module.GithubModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(module => module.AdminModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
