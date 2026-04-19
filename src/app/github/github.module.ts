import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GithubRoutingModule } from './github.routing.module';
import { RepolistComponent } from './pages/repolist/repolist.component';
import { MaterialModule } from '../shared';

@NgModule({
  declarations: [RepolistComponent],
  imports: [CommonModule, FormsModule, MaterialModule, GithubRoutingModule]
})
export class GithubModule {}
