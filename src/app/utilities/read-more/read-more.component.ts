
import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-read-more',
    templateUrl: './read-more.component.html',
    styleUrls: ['./read-more.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ReadMoreComponent implements OnInit{
  expand: boolean = false;
  anchor: string = 'mai mult';

  constructor() {}

  ngOnInit() {}

  toggle() {
    this.expand = !this.expand;
    this.anchor = this.expand ? 'mai putin' : 'mai mult';
  }
}
