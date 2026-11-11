import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-oferte-filter',
    templateUrl: './oferte-filter.component.html',
    styleUrls: ['./oferte-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OferteFilterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
