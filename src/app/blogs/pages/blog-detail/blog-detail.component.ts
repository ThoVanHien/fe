import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BlogPost } from '../../../core/models';
import { BlogService } from '../../../core/services';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html'
})
export class BlogDetailComponent implements OnInit {
  post?: BlogPost;
  relatedPosts: BlogPost[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly blogService: BlogService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      return;
    }

    this.post = this.blogService.getPostBySlug(slug);
    this.relatedPosts = this.post ? this.blogService.getRelatedPosts(this.post) : [];
  }

  trackByParagraph(index: number): number {
    return index;
  }

  trackByTag(_index: number, tag: string): string {
    return tag;
  }

  trackByPostId(_index: number, post: BlogPost): number {
    return post.id;
  }
}

