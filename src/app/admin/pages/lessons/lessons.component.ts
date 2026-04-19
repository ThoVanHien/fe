import { Component, OnInit } from '@angular/core';

import { Course, CourseLevel, Lesson } from '../../../core/models';
import { CourseService } from '../../../core/services';

interface LessonForm {
  courseSlug: string;
  title: string;
  summary: string;
  content: string;
  durationMinutes: number;
  level: CourseLevel;
}

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html'
})
export class LessonsComponent implements OnInit {
  readonly levels: CourseLevel[] = ['Beginner', 'Intermediate'];
  courses: Course[] = [];
  lessons: Lesson[] = [];
  successMessage = '';

  lessonForm: LessonForm = {
    courseSlug: 'toeic-grammar',
    title: '',
    summary: '',
    content: '',
    durationMinutes: 20,
    level: 'Beginner'
  };

  constructor(private readonly courseService: CourseService) {}

  ngOnInit(): void {
    this.refreshData();
  }

  addLesson(): void {
    const content = this.lessonForm.content
      .split('\n')
      .map(paragraph => paragraph.trim())
      .filter(Boolean);

    const lesson = this.courseService.addLesson(this.lessonForm.courseSlug, {
      title: this.lessonForm.title,
      summary: this.lessonForm.summary,
      content,
      durationMinutes: this.lessonForm.durationMinutes,
      level: this.lessonForm.level
    });

    if (!lesson) {
      return;
    }

    this.successMessage = `Added "${lesson.title}" to ${this.getCourseTitle(lesson.courseSlug)}.`;
    this.lessonForm = {
      courseSlug: this.lessonForm.courseSlug,
      title: '',
      summary: '',
      content: '',
      durationMinutes: 20,
      level: 'Beginner'
    };
    this.refreshData();
  }

  getCourseTitle(courseSlug: string): string {
    return this.courses.find(course => course.slug === courseSlug)?.title || courseSlug;
  }

  trackByCourseId(_index: number, course: Course): number {
    return course.id;
  }

  trackByLessonId(_index: number, lesson: Lesson): number {
    return lesson.id;
  }

  private refreshData(): void {
    this.courses = this.courseService.getCourses();
    this.lessons = this.courses.flatMap(course => course.lessons);
  }
}
