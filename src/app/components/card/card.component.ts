import { Component, OnInit, Input } from '@angular/core';
import { Repo } from 'src/app/models/repo';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() repos: Repo[];
  @Input() isDetails: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  trackByItems(index: number, repo: Repo): number {
    return repo.id;
  }

}
