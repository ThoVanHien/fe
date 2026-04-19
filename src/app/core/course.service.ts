import { Injectable } from '@angular/core';
import { Course, CourseLevel, CourseNavigation } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly courses: Course[] = [
    {
      id: 'angular-router',
      title: 'Angular Router từ nền tảng đến thực chiến',
      level: 'Intermediate',
      summary: 'Đi qua route config, routerLink, param, query param, child route, guard, resolver và lazy loading.',
      description: 'Khóa học này mô phỏng một luồng sản phẩm thật: danh sách, trang chi tiết, tab con, đăng nhập và khu admin lazy-loaded.',
      author: 'Mai Anh',
      updatedAt: '2026-04-10',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
      tags: ['Routes', 'Guard', 'Resolver'],
      lessons: [
        { id: 1, title: 'Root route và redirect mặc định', duration: '12 phút', unlocked: true },
        { id: 2, title: 'RouterLink, RouterOutlet và active state', duration: '18 phút', unlocked: true },
        { id: 3, title: 'Route params, query params và fragments', duration: '21 phút', unlocked: true },
        { id: 4, title: 'Guard, resolver và lazy module', duration: '28 phút', unlocked: false }
      ],
      reviews: [
        {
          name: 'Huy Tran',
          role: 'Frontend intern',
          comment: 'Phần child route làm mình hiểu vì sao detail page vẫn giữ layout khi đổi tab.'
        },
        {
          name: 'Linh Pham',
          role: 'Angular developer',
          comment: 'Guard và resolver được tách gọn, đọc route config là hiểu luồng ngay.'
        }
      ]
    },
    {
      id: 'rxjs-state',
      title: 'RxJS state cho Angular app',
      level: 'Advanced',
      summary: 'Tổ chức dữ liệu bất đồng bộ bằng observable, stream composition và service state.',
      description: 'Dùng RxJS để quản lý trạng thái nhẹ trong Angular mà chưa cần kéo thêm state library.',
      author: 'Quoc Bao',
      updatedAt: '2026-03-22',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
      tags: ['RxJS', 'State', 'Streams'],
      lessons: [
        { id: 1, title: 'Subject, BehaviorSubject và signal boundary', duration: '16 phút', unlocked: true },
        { id: 2, title: 'combineLatest cho filter UI', duration: '17 phút', unlocked: true },
        { id: 3, title: 'Error handling trong service', duration: '19 phút', unlocked: false }
      ],
      reviews: [
        {
          name: 'Nam Vo',
          role: 'Product engineer',
          comment: 'Ví dụ filter bằng query params rất dễ đem vào app nội bộ.'
        }
      ]
    },
    {
      id: 'forms-guards',
      title: 'Angular Forms và CanDeactivate guard',
      level: 'Beginner',
      summary: 'Làm form có trạng thái dirty, save/reset và chặn rời trang khi còn thay đổi chưa lưu.',
      description: 'Một demo nhỏ nhưng sát việc thật: người dùng sửa hồ sơ, Router hỏi trước khi bỏ dữ liệu.',
      author: 'Thanh Nguyen',
      updatedAt: '2026-02-14',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
      tags: ['Forms', 'CanDeactivate', 'UX'],
      lessons: [
        { id: 1, title: 'Template-driven form nhanh gọn', duration: '11 phút', unlocked: true },
        { id: 2, title: 'Dirty state và nút lưu', duration: '13 phút', unlocked: true },
        { id: 3, title: 'CanDeactivate guard', duration: '15 phút', unlocked: true }
      ],
      reviews: [
        {
          name: 'An Le',
          role: 'Junior developer',
          comment: 'Guard này đúng thứ mình hay cần khi làm màn hình cấu hình.'
        }
      ]
    }
  ];

  getCourses(): Course[] {
    return this.courses;
  }

  getCourse(courseId: string): Course | undefined {
    return this.courses.find((course) => course.id === courseId);
  }

  findCourses(searchTerm: string, level: CourseLevel | 'all'): Course[] {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return this.courses.filter((course) => {
      const matchesTerm = normalizedTerm.length === 0 ||
        course.title.toLowerCase().includes(normalizedTerm) ||
        course.summary.toLowerCase().includes(normalizedTerm) ||
        course.tags.some((tag) => tag.toLowerCase().includes(normalizedTerm));
      const matchesLevel = level === 'all' || course.level === level;

      return matchesTerm && matchesLevel;
    });
  }

  getCourseNavigation(courseId: string): CourseNavigation {
    const currentIndex = this.courses.findIndex((course) => course.id === courseId);

    if (currentIndex === -1) {
      return {
        previous: null,
        next: null
      };
    }

    return {
      previous: this.courses[currentIndex - 1]?.id ?? null,
      next: this.courses[currentIndex + 1]?.id ?? null
    };
  }
}
