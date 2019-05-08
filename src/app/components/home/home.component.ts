import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GithubService } from 'src/app/services/github.service';
import { Subject } from 'rxjs';
import { Repo } from 'src/app/models/repo';
import { filter, debounceTime, switchMap, tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {  
  searchForm: FormGroup;
  filteredRepos: Repo[];
  search: Subject<string> = new Subject<string>();
  repos: Repo[];
  isLoading: boolean = false;

  constructor(
    private githubService: GithubService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      searchControl: null
    });
    
    this.searchForm.get('searchControl').valueChanges.pipe(
      filter(value => value.length > 2),
      debounceTime(200),
      tap(() => this.isLoading = true),
      switchMap(value => this.githubService.getRepos(value).pipe(
        finalize(() => this.isLoading = false),
      ))
    ).subscribe(data => this.filteredRepos = data);

    this.search.subscribe(
      searchWord => {
        if (this.searchForm.get('searchControl').value === searchWord) {
          this.repos = this.filteredRepos;
        } else {
          this.githubService.getRepos(searchWord).subscribe(
            data => this.repos = data,
            err => {
              console.log(err);
            }
          );
        }
    });
  }

  displayFn(repo: Repo) {
    if (repo) { return repo.name; }
  }

  onEnter(query: string): void {
    if (query !== '') this.search.next(query);
  }

}
