import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CourseService } from '../core/course.service';

export const courseExistsGuard: CanActivateFn = (route) => {
  const courseService = inject(CourseService);
  const router = inject(Router);
  const courseId = route.paramMap.get('id');

  if (courseId !== null && courseService.getCourse(courseId)) {
    return true;
  }

  return router.createUrlTree(['/courses'], {
    queryParams: {
      missing: courseId ?? 'unknown'
    }
  });
};
