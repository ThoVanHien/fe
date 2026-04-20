import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { courseExistsGuard } from './guards/course-exists.guard';
import { adminMatchGuard } from './guards/auth.guard';
import { pendingChangesGuard } from './guards/pending-changes.guard';
import { courseResolver } from './resolvers/course.resolver';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { CourseLessonsComponent } from './pages/course-lessons/course-lessons.component';
import { CourseListComponent } from './pages/courses/course-list.component';
import { CourseOverviewComponent } from './pages/course-overview/course-overview.component';
import { CourseReviewsComponent } from './pages/course-reviews/course-reviews.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DiDemoComponent } from './pages/di-demo/di-demo.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Router Lab',
  },
  {
    path: 'courses',
    component: CourseListComponent,
    title: 'Danh sách khóa học',
  },
  {
    path: 'di',
    component: DiDemoComponent,
    title: 'Dependency Injection lab',
  },
  {
    path: 'courses/:id',
    component: CourseDetailComponent,
    canActivate: [courseExistsGuard],
    resolve: {
      course: courseResolver,
    },
    title: 'Chi tiết khóa học',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        component: CourseOverviewComponent,
        title: 'Tổng quan khóa học',
      },
      {
        path: 'lessons',
        component: CourseLessonsComponent,
        title: 'Bài học',
      },
      {
        path: 'reviews',
        component: CourseReviewsComponent,
        title: 'Đánh giá',
      },
    ],
  },
  {
    path: 'classes',
    pathMatch: 'full',
    redirectTo: 'courses',
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canDeactivate: [pendingChangesGuard],
    title: 'Form guard',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Đăng nhập demo',
  },
  {
    path: 'admin',
    canMatch: [adminMatchGuard],
    loadChildren: () =>
      import('./features/admin/admin.module').then(
        (module) => module.AdminModule,
      ),
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Không tìm thấy trang',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
