import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RepolistComponent } from './pages/repolist/repolist.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'repos',
    pathMatch: 'full'
  },
  {
    path: 'repos',
    component: RepolistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GithubRoutingModule {}

