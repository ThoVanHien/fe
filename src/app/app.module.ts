import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { CourseLessonsComponent } from './pages/course-lessons/course-lessons.component';
import { CourseListComponent } from './pages/courses/course-list.component';
import { CourseOverviewComponent } from './pages/course-overview/course-overview.component';
import { CourseReviewsComponent } from './pages/course-reviews/course-reviews.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DiDemoComponent } from './pages/di-demo/di-demo.component';
import { DiPanelComponent } from './pages/di-demo/di-panel.component';
import { DiScopeProbeComponent } from './pages/di-demo/di-scope-probe.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    CourseDetailComponent,
    CourseLessonsComponent,
    CourseListComponent,
    CourseOverviewComponent,
    CourseReviewsComponent,
    DashboardComponent,
    DiDemoComponent,
    DiPanelComponent,
    DiScopeProbeComponent,
    LoginComponent,
    NotFoundComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
