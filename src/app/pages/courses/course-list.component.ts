import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CourseService } from '../../core/course.service';
import { Course, CourseLevel } from '../../models/course.model';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html'
})
export class CourseListComponent implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly levels: Array<CourseLevel | 'all'> = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  searchTerm = '';
  selectedLevel: CourseLevel | 'all' = 'all';
  missingId: string | null = null;
  filteredCourses: Course[] = this.courseService.getCourses();

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((queryParamMap) => {
        this.searchTerm = queryParamMap.get('q') ?? '';
        this.selectedLevel = this.toLevel(queryParamMap.get('level'));
        this.missingId = queryParamMap.get('missing');
        this.filteredCourses = this.courseService.findCourses(this.searchTerm, this.selectedLevel);
      });
  }

  updateFilters(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.searchTerm.trim() || null,
        level: this.selectedLevel === 'all' ? null : this.selectedLevel,
        missing: null
      },
      queryParamsHandling: 'merge'
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedLevel = 'all';
    this.updateFilters();
  }

  private toLevel(level: string | null): CourseLevel | 'all' {
    if (level === 'Beginner' || level === 'Intermediate' || level === 'Advanced') {
      return level;
    }

    return 'all';
  }
}
