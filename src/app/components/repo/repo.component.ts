import { Component, OnInit } from '@angular/core';
import { GithubService } from 'src/app/services/github.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Repo } from 'src/app/models/repo';

@Component({
  selector: 'app-repo',
  templateUrl: './repo.component.html',
  styleUrls: ['./repo.component.sass']
})
export class RepoComponent implements OnInit {
  repos: Repo[] = [];
  owner: string;
  repo: string;  

  constructor(
    private githubService: GithubService,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      params => {
        this.owner = params.owner;
        this.repo = params.repo;
      });

    this.activatedRoute.paramMap.pipe(
      map(() => window.history.state)
    ).subscribe(
      data => {
        if (data.hasOwnProperty('id')) {
          this.repos.push(data);
        } else {
          this.githubService.getRepo(this.owner, this.repo).subscribe(
              data => this.repos.push(data)
            );
        }
      }
    );
  }
}
