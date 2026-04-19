import { Component, OnInit } from '@angular/core';

import { BlogPost, BlogRight, BlogStats, BlogUser, Course, Lesson } from '../../../core/models';
import { AdminService, BlogService, CourseService } from '../../../core/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  stats: BlogStats = {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    categories: 0,
    monthlyViews: 0
  };

  topPosts: BlogPost[] = [];
  courses: Course[] = [];
  recentLessons: Lesson[] = [];
  users: BlogUser[] = [];
  rights: BlogRight[] = [];

  constructor(
    private readonly blogService: BlogService,
    private readonly adminService: AdminService,
    private readonly courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.stats = this.blogService.getStats();
    this.topPosts = this.blogService.getFeaturedPosts();
    this.courses = this.courseService.getCourses();
    this.recentLessons = this.courseService.getRecentLessons(3);
    this.users = this.adminService.getUsers();
    this.rights = this.adminService.getRights();
  }

  get lessonCount(): number {
    return this.courseService.getLessonCount();
  }

  get activeUsers(): number {
    return this.users.filter(user => user.status === 'Active').length;
  }

  get enabledRights(): number {
    return this.rights.filter(right => right.enabled).length;
  }

  trackByPostId(_index: number, post: BlogPost): number {
    return post.id;
  }

  trackByLessonId(_index: number, lesson: Lesson): number {
    return lesson.id;
  }
}
