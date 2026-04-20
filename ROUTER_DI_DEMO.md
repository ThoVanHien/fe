# Angular Router demo

Demo này dùng Angular 17 theo kiểu `NgModule`, đúng với cấu trúc project hiện tại.
Các phần quan trọng nằm trong `src/app/app-routing.module.ts`.

## Chạy app

```bash
npm start
```

Sau đó mở `http://localhost:4200`.

## Route map

| URL | Ý nghĩa |
| --- | --- |
| `/` | Redirect sang `/dashboard` bằng `pathMatch: 'full'`. |
| `/dashboard` | Trang tổng quan, có nhiều `routerLink`. |
| `/courses` | Danh sách khóa học, đọc filter từ query params. |
| `/courses?q=router&level=Intermediate` | Query params dùng làm URL state. |
| `/di` | Demo Dependency Injection: token, provider, hierarchical injector. |
| `/courses/:id` | Route param, có guard kiểm tra id và resolver nạp dữ liệu. |
| `/courses/:id/overview` | Child route mặc định của trang chi tiết. |
| `/courses/:id/lessons` | Child route dùng chung layout cha. |
| `/courses/:id/reviews` | Child route đọc data từ parent route. |
| `/classes` | Redirect sang `/courses`. |
| `/profile` | Form có `canDeactivate` guard. |
| `/admin` | Lazy-loaded module, chặn bằng `canMatch`. |
| `/admin/reports` | Route con trong lazy module. |
| URL bất kỳ | Wildcard `**` đưa về trang 404. |

## Các khái niệm chính

### 1. RouterModule.forRoot

Root router được khai báo trong `AppRoutingModule`:

```ts
RouterModule.forRoot(routes, {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled'
})
```

`forRoot` chỉ nên gọi một lần ở app root vì nó đăng ký Router service và cấu hình điều hướng toàn cục.

### 2. router-outlet

`AppComponent` có:

```html
<router-outlet></router-outlet>
```

Mỗi URL khớp route nào thì component của route đó render vào outlet này.
Trang detail cũng có outlet riêng cho tab con:

```html
<router-outlet></router-outlet>
```

Vì vậy `/courses/angular-router/lessons` render:

- `AppComponent`
- `CourseDetailComponent`
- `CourseLessonsComponent`

### 3. routerLink và routerLinkActive

Điều hướng template dùng:

```html
<a [routerLink]="['/courses', course.id]" [queryParams]="{ ref: 'list' }">
  Xem chi tiết
</a>
```

Active state dùng:

```html
<a routerLink="/courses" routerLinkActive="active">Khóa học</a>
```

### 4. Route params

Route:

```ts
{
  path: 'courses/:id',
  component: CourseDetailComponent
}
```

Resolver và guard đọc id bằng:

```ts
route.paramMap.get('id')
```

### 5. Query params

Trang list đọc query params:

```ts
this.route.queryParamMap.subscribe((queryParamMap) => {
  this.searchTerm = queryParamMap.get('q') ?? '';
});
```

Khi đổi filter, component cập nhật URL:

```ts
this.router.navigate([], {
  relativeTo: this.route,
  queryParams: { q: this.searchTerm || null },
  queryParamsHandling: 'merge'
});
```

### 6. Guard

Demo có bốn guard use case:

| Guard | File | Việc làm |
| --- | --- | --- |
| `courseExistsGuard` | `src/app/guards/course-exists.guard.ts` | Chặn course id không tồn tại. |
| `authGuard` | `src/app/guards/auth.guard.ts` | Chặn route đã match nhưng chưa đủ quyền. |
| `adminMatchGuard` | `src/app/guards/auth.guard.ts` | Chặn `/admin` trước khi lazy module được match. |
| `pendingChangesGuard` | `src/app/guards/pending-changes.guard.ts` | Hỏi trước khi rời form còn thay đổi chưa lưu. |

Guard có thể trả về:

- `true`: cho đi tiếp
- `false`: hủy điều hướng
- `UrlTree`: redirect sang URL khác

### 7. Resolver

Route detail có:

```ts
resolve: {
  course: courseResolver
}
```

Resolver lấy dữ liệu trước khi component render. Component đọc bằng:

```ts
this.route.data.subscribe((data) => {
  this.course = data['course'] as Course;
});
```

### 8. Child routes

Route `/courses/:id` có `children`.

```ts
children: [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: 'overview', component: CourseOverviewComponent },
  { path: 'lessons', component: CourseLessonsComponent },
  { path: 'reviews', component: CourseReviewsComponent }
]
```

Child component có thể đọc data của route cha:

```ts
this.route.parent?.data.subscribe(...)
```

### 9. Lazy loading

Route admin:

```ts
{
  path: 'admin',
  canMatch: [adminMatchGuard],
  loadChildren: () => import('./features/admin/admin.module').then((module) => module.AdminModule)
}
```

Trong feature module dùng `RouterModule.forChild(routes)`.

### 10. Wildcard route

Route `**` phải đặt cuối:

```ts
{
  path: '**',
  component: NotFoundComponent
}
```

Nếu đặt sớm hơn, nó sẽ bắt hết URL và các route phía sau không còn cơ hội match.

## Dependency Injection demo

Route `/di` bo sung mot man hinh DI chay duoc trong cung app:

- `providedIn: 'root'`: `DiSessionService`, `DiLoggerService`
- `InjectionToken`: `DI_APP_CONFIG`, `DI_LOGGER`, `DI_CLOCK`, `DI_RUNTIME_NOTE`, `DI_SCOPE_LABEL`
- Provider syntax:
  - `useValue` cho object config
  - `useExisting` cho alias logger
  - `useClass` cho implementation cua dong ho
  - `useFactory` cho chuoi runtime note
- Hierarchical injector:
  - `DiDemoComponent` provide `DI_SCOPE_LABEL = 'di-page'`
  - `DiPanelComponent` override thanh `di-panel`
  - `PanelStateService` duoc provide tai component, nen moi panel co instance rieng
- Resolution flags:
  - `@Self()` chi tim o injector hien tai
  - `@SkipSelf()` bo qua injector hien tai, tim len cha
  - `@Optional()` tranh nem loi khi khong tim thay dependency

Muc tieu cua man hinh nay la de ban thay ngay tren UI su khac nhau giua singleton root va provider theo component scope.
