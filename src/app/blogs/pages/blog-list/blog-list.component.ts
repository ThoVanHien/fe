import { Component, OnInit } from '@angular/core';

import { BlogPost } from '../../../core/models';
import { BlogService } from '../../../core/services';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html'
})
export class BlogListComponent implements OnInit {
  posts: BlogPost[] = [];

  constructor(private readonly blogService: BlogService) {}

  ngOnInit(): void {
    this.posts = this.blogService.getFeaturedPosts();
  }

  trackByPostId(_index: number, post: BlogPost): number {
    return post.id;
  }
}

