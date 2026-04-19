export type CourseLevel = 'Beginner' | 'Intermediate';

export interface Lesson {
  id: number;
  courseSlug: string;
  title: string;
  slug: string;
  summary: string;
  content: string[];
  durationMinutes: number;
  level: CourseLevel;
  order: number;
  updatedAt: string;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  accent: string;
  techStack: string[];
  lessons: Lesson[];
}

