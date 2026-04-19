import { Injectable } from '@angular/core';

import { BlogPost, BlogStats } from '../models';

const POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'A 15-minute checklist for TOEIC Part 5',
    slug: 'toeic-part-5-checklist',
    excerpt:
      'A compact grammar pass for spotting tense, agreement, word form, and connector traps before answering.',
    content: [
      'Part 5 becomes calmer when every question gets the same first scan. Look for the blank position, read the words around it, then decide whether the problem is grammar or vocabulary.',
      'For grammar questions, check subject-verb agreement, verb tense, word form, and connector logic before reading all four options. Most traps are built around one of those signals.',
      'For vocabulary questions, read the whole sentence once for business context. The right word should fit the collocation, not only the Vietnamese translation in your head.',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80',
    category: 'Grammar',
    tags: ['Part 5', 'Grammar', 'Checklist'],
    author: 'BLOG Team',
    status: 'Published',
    viewCount: 3420,
    readingMinutes: 7,
    createdAt: '2026-03-18',
    updatedAt: '2026-04-10',
  },
  {
    id: 2,
    title: 'How to review listening mistakes without guessing',
    slug: 'review-listening-mistakes',
    excerpt:
      'A repeatable loop for replaying audio, marking the missed cue, and turning one mistake into one rule.',
    content: [
      'Listening improves fastest when a wrong answer becomes evidence. Replay the short section, write the exact cue you missed, then classify the mistake.',
      'Common categories include sound confusion, paraphrase, speaker intention, and lost context. Naming the error keeps the next review focused.',
      'Do not replay the whole track endlessly. Replay the smallest useful segment, shadow it once, and save one short rule for tomorrow.',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    category: 'Listening',
    tags: ['Part 2', 'Review', 'Audio'],
    author: 'BLOG Team',
    status: 'Published',
    viewCount: 2180,
    readingMinutes: 5,
    createdAt: '2026-03-26',
    updatedAt: '2026-04-08',
  },
  {
    id: 3,
    title: 'Reading faster with paragraph signals',
    slug: 'reading-with-paragraph-signals',
    excerpt:
      'Use dates, names, transitions, and purpose words to move through TOEIC Reading with less rereading.',
    content: [
      'Part 7 is not only about reading every word. It is about finding the structure of the text quickly enough to answer with confidence.',
      'Scan names, dates, prices, locations, and transition words before choosing where to read deeply. Those anchors usually point to the evidence line.',
      'When two answers look close, return to the sentence before and after the evidence. TOEIC distractors often copy a word but change the relationship.',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
    category: 'Reading',
    tags: ['Part 7', 'Skimming', 'Evidence'],
    author: 'BLOG Team',
    status: 'Published',
    viewCount: 1870,
    readingMinutes: 4,
    createdAt: '2026-04-02',
    updatedAt: '2026-04-12',
  },
  {
    id: 4,
    title: 'Designing a weekly TOEIC review rhythm',
    slug: 'weekly-toeic-review-rhythm',
    excerpt:
      'A draft plan for balancing grammar drills, listening shadowing, vocabulary review, and mock-test analysis.',
    content: [
      'A weekly review rhythm should protect attention. Put the heaviest reading and listening work on the days when you can sit without interruption.',
      'Short grammar drills fit better as warmups. They build accuracy without draining the time you need for longer passages.',
      'The review day matters most. Collect wrong answers, name the pattern, and choose the next small rule to practice.',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80',
    category: 'Study Plan',
    tags: ['Routine', 'Review', 'Mock Test'],
    author: 'BLOG Team',
    status: 'Draft',
    viewCount: 430,
    readingMinutes: 6,
    createdAt: '2026-04-11',
    updatedAt: '2026-04-14',
  },
];

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  getPosts(): BlogPost[] {
    return [...POSTS];
  }

  getPublishedPosts(): BlogPost[] {
    return POSTS.filter((post) => post.status === 'Published');
  }

  getFeaturedPosts(): BlogPost[] {
    return this.getPublishedPosts()
      .sort((first, second) => second.viewCount - first.viewCount)
      .slice(0, 3);
  }

  getRecentPosts(): BlogPost[] {
    return this.getPublishedPosts()
      .sort(
        (first, second) =>
          new Date(second.updatedAt).getTime() -
          new Date(first.updatedAt).getTime(),
      )
      .slice(0, 3);
  }

  getPostBySlug(slug: string): BlogPost | undefined {
    return this.getPublishedPosts().find((post) => post.slug === slug);
  }

  getRelatedPosts(post: BlogPost): BlogPost[] {
    const related = this.getPublishedPosts()
      .filter((item) => item.id !== post.id)
      .filter(
        (item) =>
          item.category === post.category ||
          item.tags.some((tag) => post.tags.includes(tag)),
      )
      .slice(0, 3);

    if (related.length === 3) {
      return related;
    }

    const fallbackPosts = this.getRecentPosts().filter(
      (item) =>
        item.id !== post.id &&
        !related.some((relatedPost) => relatedPost.id === item.id),
    );

    return [...related, ...fallbackPosts].slice(0, 3);
  }

  getCategories(): string[] {
    return [...new Set(POSTS.map((post) => post.category))];
  }

  getStats(): BlogStats {
    return {
      totalPosts: POSTS.length,
      publishedPosts: POSTS.filter((post) => post.status === 'Published')
        .length,
      draftPosts: POSTS.filter((post) => post.status === 'Draft').length,
      categories: this.getCategories().length,
      monthlyViews: POSTS.reduce((total, post) => total + post.viewCount, 0),
    };
  }
}
