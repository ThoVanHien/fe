import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CourseListComponent, LessonDetailComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    component: CourseListComponent
  },
  {
    path: ':courseSlug/lessons/:lessonSlug',
    component: LessonDetailComponent
  },
  {
    path: ':courseSlug',
    component: CourseListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule {}
