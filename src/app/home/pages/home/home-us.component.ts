import { Component, OnInit } from '@angular/core';

import { BlogPost, Course, Lesson } from '../../../core/models';
import { BlogService, CourseService } from '../../../core/services';

@Component({
  selector: 'app-home-us',
  templateUrl: './home-us.component.html'
})
export class HomeUsComponent implements OnInit {
  featuredPosts: BlogPost[] = [];
  courses: Course[] = [];
  recentLessons: Lesson[] = [];
  categories: string[] = [];

  constructor(
    private readonly blogService: BlogService,
    private readonly courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.featuredPosts = this.blogService.getFeaturedPosts();
    this.courses = this.courseService.getCourses();
    this.recentLessons = this.courseService.getRecentLessons();
    this.categories = this.blogService.getCategories();
  }

  trackByPostId(_index: number, post: BlogPost): number {
    return post.id;
  }

  trackByCourseId(_index: number, course: Course): number {
    return course.id;
  }

  trackByLessonId(_index: number, lesson: Lesson): number {
    return lesson.id;
  }

  trackByCategory(_index: number, category: string): string {
    return category;
  }
}
