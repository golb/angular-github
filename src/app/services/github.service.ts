import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repo } from '../models/repo';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  repos: Repo[];
  apiUrl: string = 'https://api.github.com/';

  constructor(
    private http: HttpClient
  ) { }

  getRepo(owner: string, repo: string): Observable<Repo> {
    return this.http.get<Repo>(this.apiUrl + `repos/${owner}/${repo}`)
    .pipe(
      map((item: any) => this.writeToRepo(item))
    )
  }

  getRepos(searchWord: string, page: number = 1): Observable<Repo[]> {
    return this.http.get(this.apiUrl + `search/repositories?q=${searchWord}&page=${page}`)
    .pipe(
      map(data => {
        this.repos = data['items'].map((item: any) => this.writeToRepo(item));
        return this.repos;
      })
    );    
  }

  writeToRepo(item: any): Repo {
    return {
      id: item.id, 
      name: item.name,
      language: item.language,
      avatar: item.owner.avatar_url,
      owner: item.owner.login,
      owner_url: item.owner.url,
      description: item.description,
      url: item.git_url,
      date: item.created_at,
      size: item.size,
      score: item.score
    }
  }
}
