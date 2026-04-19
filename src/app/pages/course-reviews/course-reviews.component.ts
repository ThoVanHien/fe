import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-reviews',
  templateUrl: './course-reviews.component.html'
})
export class CourseReviewsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  course: Course | null = null;

  ngOnInit(): void {
    this.route.parent?.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.course = data['course'] as Course;
      });
  }
}
