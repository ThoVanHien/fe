export type BlogStatus = 'Draft' | 'Published' | 'Archived';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  status: BlogStatus;
  viewCount: number;
  readingMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  categories: number;
  monthlyViews: number;
}
