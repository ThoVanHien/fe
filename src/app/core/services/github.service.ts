import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Repo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private readonly apiUrl = 'https://api.github.com';

  constructor(private readonly http: HttpClient) {}

  getUserRepos(username: string): Observable<Repo[]> {
    return this.http.get<Repo[]>(`${this.apiUrl}/users/${username}/repos`, {
      params: this.getRepoParams()
    });
  }

  getOrgRepos(org: string): Observable<Repo[]> {
    return this.http.get<Repo[]>(`${this.apiUrl}/orgs/${org}/repos`, {
      params: this.getRepoParams()
    });
  }

  private getRepoParams(): HttpParams {
    return new HttpParams()
      .set('sort', 'updated')
      .set('direction', 'desc')
      .set('per_page', '24');
  }
}

