import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Course, Lesson } from '../../../core/models';
import { CourseService } from '../../../core/services';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.component.html'
})
export class LessonDetailComponent implements OnInit {
  course?: Course;
  lesson?: Lesson;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly courseService: CourseService
  ) {}

  ngOnInit(): void {
    const courseSlug = this.route.snapshot.paramMap.get('courseSlug');
    const lessonSlug = this.route.snapshot.paramMap.get('lessonSlug');

    if (!courseSlug || !lessonSlug) {
      return;
    }

    this.course = this.courseService.getCourseBySlug(courseSlug);
    this.lesson = this.courseService.getLesson(courseSlug, lessonSlug);
  }

  trackByParagraph(index: number): number {
    return index;
  }
}

