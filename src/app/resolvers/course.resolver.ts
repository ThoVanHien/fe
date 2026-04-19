import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CourseService } from '../core/course.service';
import { Course } from '../models/course.model';

export const courseResolver: ResolveFn<Course> = (route) => {
  const courseService = inject(CourseService);
  const courseId = route.paramMap.get('id') ?? '';
  const course = courseService.getCourse(courseId);

  if (!course) {
    throw new Error(`Course "${courseId}" should be checked by courseExistsGuard before resolving.`);
  }

  return course;
};
