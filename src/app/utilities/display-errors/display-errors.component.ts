import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-display-errors',
    templateUrl: './display-errors.component.html',
    styleUrls: ['./display-errors.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DisplayErrorsComponent implements OnInit {

  @Input()
  errors: string[] = [];
  
  constructor() { }

  ngOnInit(): void {
  }

}
