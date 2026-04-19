import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

import { Repo } from '../../../core/models';
import { GithubService } from '../../../core/services';

type RepoSource = 'user' | 'org';

@Component({
  selector: 'app-repolist',
  templateUrl: './repolist.component.html'
})
export class RepolistComponent implements OnInit {
  query = 'openai';
  source: RepoSource = 'org';
  selectedLanguage = 'All';
  repos: Repo[] = [];
  loading = false;
  errorMessage = '';

  private readonly fallbackRepos: Repo[] = [
    {
      id: 101,
      name: 'toeic-grammar-hub',
      full_name: 'dautoeic/toeic-grammar-hub',
      description: 'Documentation-style grammar lessons, review notes, and publishing screens.',
      html_url: 'https://github.com',
      language: 'TypeScript',
      stargazers_count: 48,
      forks_count: 8,
      open_issues_count: 3,
      updated_at: '2026-04-12T08:30:00Z'
    },
    {
      id: 102,
      name: 'listening-review-kit',
      full_name: 'dautoeic/listening-review-kit',
      description: 'Audio replay notes, mistake labels, and shadowing prompts for TOEIC Listening.',
      html_url: 'https://github.com',
      language: 'TypeScript',
      stargazers_count: 31,
      forks_count: 5,
      open_issues_count: 1,
      updated_at: '2026-04-09T10:15:00Z'
    },
    {
      id: 103,
      name: 'score-log-playbook',
      full_name: 'dautoeic/score-log-playbook',
      description: 'A mock-test review checklist for score gaps, part-level timing, and next actions.',
      html_url: 'https://github.com',
      language: 'JavaScript',
      stargazers_count: 19,
      forks_count: 2,
      open_issues_count: 0,
      updated_at: '2026-04-03T11:00:00Z'
    }
  ];

  constructor(private readonly githubService: GithubService) {}

  ngOnInit(): void {
    this.loadRepos();
  }

  get languages(): string[] {
    const repoLanguages = this.repos
      .map(repo => repo.language)
      .filter((language): language is string => Boolean(language));

    return ['All', ...new Set(repoLanguages)];
  }

  get filteredRepos(): Repo[] {
    if (this.selectedLanguage === 'All') {
      return this.repos;
    }

    return this.repos.filter(repo => repo.language === this.selectedLanguage);
  }

  loadRepos(): void {
    const cleanQuery = this.query.trim();

    if (!cleanQuery) {
      this.errorMessage = 'Enter a GitHub username or organization.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.selectedLanguage = 'All';

    const request = this.source === 'org'
      ? this.githubService.getOrgRepos(cleanQuery)
      : this.githubService.getUserRepos(cleanQuery);

    request
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: repos => {
          this.repos = repos;
        },
        error: () => {
          this.repos = this.fallbackRepos;
          this.errorMessage = 'GitHub data is using demo fallback right now.';
        }
      });
  }

  trackByRepoId(_index: number, repo: Repo): number {
    return repo.id;
  }
}
