import { Component } from '@angular/core';

import { Course } from '../../../core/models';
import { CourseService } from '../../../core/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  readonly courses: Course[];

  constructor(private readonly courseService: CourseService) {
    this.courses = this.courseService.getCourses();
  }
}
