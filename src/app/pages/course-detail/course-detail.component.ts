import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CourseService } from '../../core/course.service';
import { Course, CourseNavigation } from '../../models/course.model';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html'
})
export class CourseDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  private readonly destroyRef = inject(DestroyRef);

  course: Course | null = null;
  navigation: CourseNavigation = {
    previous: null,
    next: null
  };
  cameFrom = 'direct';

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        const course = data['course'] as Course;
        this.course = course;
        this.navigation = this.courseService.getCourseNavigation(course.id);
        this.cameFrom = this.route.snapshot.queryParamMap.get('ref') ?? 'direct';
      });
  }

  goToCourse(courseId: string | null): void {
    if (courseId === null) {
      return;
    }

    void this.router.navigate(['/courses', courseId], {
      queryParams: {
        ref: 'next-prev-button'
      }
    });
  }
}
