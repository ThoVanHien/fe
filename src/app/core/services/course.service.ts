import { Injectable } from '@angular/core';

import { Course, Lesson } from '../models';

const COURSES: Course[] = [
  {
    id: 1,
    title: 'TOEIC Grammar',
    slug: 'toeic-grammar',
    description: 'Tenses, clauses, word forms, connectors, and the patterns that decide Part 5 and Part 6.',
    coverImage: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80',
    accent: '#0d74ce',
    techStack: ['Tenses', 'Clauses', 'Word forms', 'Connectors'],
    lessons: [
      {
        id: 101,
        courseSlug: 'toeic-grammar',
        title: 'Verb tenses in business notices',
        slug: 'verb-tenses-in-business-notices',
        summary: 'Read time markers and sentence purpose before choosing a tense.',
        content: [
          'TOEIC tense questions usually give you a time marker, a business event, or both. Read the sentence around the blank before looking at the answer choices.',
          'Present perfect often appears when the result matters now. Past simple points to a finished time, while future forms usually connect to plans, schedules, or promises.',
          'Build the habit of underlining the time signal first. The verb choice becomes less about memory and more about evidence.'
        ],
        durationMinutes: 18,
        level: 'Beginner',
        order: 1,
        updatedAt: '2026-04-01'
      },
      {
        id: 102,
        courseSlug: 'toeic-grammar',
        title: 'Relative clauses without over-reading',
        slug: 'relative-clauses-without-over-reading',
        summary: 'Pick who, which, that, or where by locating the noun before the blank.',
        content: [
          'A relative clause describes the noun before it. In TOEIC, that noun is the first clue and often enough to remove two wrong options.',
          'Use who for people, which for things, and where for places when the place idea is still active in the clause.',
          'Do not translate the whole sentence too early. First identify the noun, then check whether the clause has a subject or needs one.'
        ],
        durationMinutes: 22,
        level: 'Intermediate',
        order: 2,
        updatedAt: '2026-04-06'
      }
    ]
  },
  {
    id: 2,
    title: 'TOEIC Listening',
    slug: 'toeic-listening',
    description: 'Photo cues, question-response patterns, short conversations, and replay habits for cleaner listening.',
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    accent: '#47c2ff',
    techStack: ['Part 1', 'Part 2', 'Shadowing', 'Paraphrase'],
    lessons: [
      {
        id: 201,
        courseSlug: 'toeic-listening',
        title: 'Photo cues before the audio starts',
        slug: 'photo-cues-before-the-audio-starts',
        summary: 'Name people, actions, objects, and locations before Part 1 choices begin.',
        content: [
          'Before the audio starts, describe the photo in simple English. Name who is there, what they are doing, and what objects are visible.',
          'Wrong answers often mention a real object with the wrong action. Keep your prediction flexible, but listen for action accuracy.',
          'After each practice item, write the missed cue in one phrase. That phrase becomes the next mini-review.'
        ],
        durationMinutes: 20,
        level: 'Beginner',
        order: 1,
        updatedAt: '2026-04-03'
      }
    ]
  },
  {
    id: 3,
    title: 'TOEIC Reading',
    slug: 'toeic-reading',
    description: 'Sentence completion, text completion, and long-passage evidence strategies for Parts 5, 6, and 7.',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
    accent: '#476cff',
    techStack: ['Part 5', 'Part 6', 'Part 7', 'Evidence'],
    lessons: [
      {
        id: 301,
        courseSlug: 'toeic-reading',
        title: 'Evidence lines in long passages',
        slug: 'evidence-lines-in-long-passages',
        summary: 'Use names, dates, numbers, and transition words to find the answer faster.',
        content: [
          'Long passages become easier when you search for anchors instead of reading in panic. Names, dates, numbers, and locations usually lead you to the answer area.',
          'Read the question stem first, then scan for the anchor. Once you find it, read one sentence before and one sentence after.',
          'If an answer copies a word from the passage but changes the meaning, treat it as a warning sign and check the relationship again.'
        ],
        durationMinutes: 16,
        level: 'Beginner',
        order: 1,
        updatedAt: '2026-04-04'
      }
    ]
  },
  {
    id: 4,
    title: 'Vocabulary System',
    slug: 'vocabulary-system',
    description: 'Business collocations, word families, prefixes, suffixes, and spaced review for TOEIC vocabulary.',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80',
    accent: '#ab6400',
    techStack: ['Collocations', 'Word family', 'Review', 'Context'],
    lessons: [
      {
        id: 401,
        courseSlug: 'vocabulary-system',
        title: 'Word families in Part 5',
        slug: 'word-families-in-part-5',
        summary: 'Use grammar position to choose noun, verb, adjective, or adverb forms.',
        content: [
          'Word-family questions test the position around the blank. Before translating, decide what part of speech the sentence needs.',
          'A noun often follows articles or adjectives. An adverb often modifies a verb, adjective, or full clause.',
          'Make a small table for each word family you miss. Review it with one sentence, not only a translated list.'
        ],
        durationMinutes: 21,
        level: 'Beginner',
        order: 1,
        updatedAt: '2026-04-05'
      }
    ]
  },
  {
    id: 5,
    title: 'Mock Test Review',
    slug: 'mock-test-review',
    description: 'Analyze score gaps, label mistake patterns, and turn full tests into a focused next-week plan.',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80',
    accent: '#30a46c',
    techStack: ['Score log', 'Error types', 'Timing', 'Next action'],
    lessons: [
      {
        id: 501,
        courseSlug: 'mock-test-review',
        title: 'Turn one mock test into a study plan',
        slug: 'turn-one-mock-test-into-a-study-plan',
        summary: 'Sort wrong answers by pattern, not by shame, and pick the next practice block.',
        content: [
          'A mock test is useful after the score is separated into patterns. Count misses by part, by skill, and by cause.',
          'Do not try to fix everything in one week. Choose the highest-frequency pattern and design one small drill around it.',
          'Keep the next action visible: what to review, how long to practice, and what result would show improvement.'
        ],
        durationMinutes: 25,
        level: 'Intermediate',
        order: 1,
        updatedAt: '2026-04-08'
      }
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly courses = COURSES.map(course => ({
    ...course,
    lessons: [...course.lessons]
  }));

  getCourses(): Course[] {
    return this.courses.map(course => ({
      ...course,
      lessons: [...course.lessons].sort((first, second) => first.order - second.order)
    }));
  }

  getCourseBySlug(slug: string): Course | undefined {
    const course = this.courses.find(item => item.slug === slug);

    return course
      ? {
          ...course,
          lessons: [...course.lessons].sort((first, second) => first.order - second.order)
        }
      : undefined;
  }

  getLesson(courseSlug: string, lessonSlug: string): Lesson | undefined {
    return this.getCourseBySlug(courseSlug)?.lessons.find(lesson => lesson.slug === lessonSlug);
  }

  getRecentLessons(limit = 4): Lesson[] {
    return this.courses
      .flatMap(course => course.lessons)
      .sort((first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime())
      .slice(0, limit);
  }

  getLessonCount(): number {
    return this.courses.reduce((total, course) => total + course.lessons.length, 0);
  }

  addLesson(courseSlug: string, lesson: Omit<Lesson, 'id' | 'courseSlug' | 'slug' | 'order' | 'updatedAt'>): Lesson | undefined {
    const course = this.courses.find(item => item.slug === courseSlug);

    if (!course) {
      return undefined;
    }

    const nextOrder = course.lessons.length + 1;
    const newLesson: Lesson = {
      ...lesson,
      id: Date.now(),
      courseSlug,
      slug: this.createSlug(lesson.title),
      order: nextOrder,
      updatedAt: new Date().toISOString()
    };

    course.lessons.push(newLesson);
    return newLesson;
  }

  private createSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
