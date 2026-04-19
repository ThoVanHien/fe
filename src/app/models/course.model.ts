export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  unlocked: boolean;
}

export interface Review {
  name: string;
  role: string;
  comment: string;
}

export interface Course {
  id: string;
  title: string;
  level: CourseLevel;
  summary: string;
  description: string;
  author: string;
  updatedAt: string;
  image: string;
  tags: string[];
  lessons: Lesson[];
  reviews: Review[];
}

export interface CourseNavigation {
  previous: string | null;
  next: string | null;
}
