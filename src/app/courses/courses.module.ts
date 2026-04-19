import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../shared';
import { CoursesRoutingModule } from './courses-routing.module';
import { CourseListComponent, LessonDetailComponent } from './pages';

@NgModule({
  declarations: [CourseListComponent, LessonDetailComponent],
  imports: [CommonModule, MaterialModule, CoursesRoutingModule]
})
export class CoursesModule {}

