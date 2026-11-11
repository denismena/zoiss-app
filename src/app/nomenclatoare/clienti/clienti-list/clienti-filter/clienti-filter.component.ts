import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-clienti-filter',
    templateUrl: './clienti-filter.component.html',
    styleUrls: ['./clienti-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ClientiFilterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
