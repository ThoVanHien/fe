import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Course, Lesson } from '../../../core/models';
import { CourseService } from '../../../core/services';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html'
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  selectedCourse?: Course;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.courses = this.courseService.getCourses();

    this.route.paramMap.subscribe(params => {
      const courseSlug = params.get('courseSlug');
      this.selectedCourse = courseSlug ? this.courseService.getCourseBySlug(courseSlug) : undefined;
    });
  }

  trackByCourseId(_index: number, course: Course): number {
    return course.id;
  }

  trackByLessonId(_index: number, lesson: Lesson): number {
    return lesson.id;
  }

  trackByStack(_index: number, stack: string): string {
    return stack;
  }
}

