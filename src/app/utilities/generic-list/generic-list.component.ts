import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-generic-list',
    templateUrl: './generic-list.component.html',
    styles: [],
    standalone: false
})
export class GenericListComponent implements OnInit {

  @Input()
  list: any;
  constructor() { }

  ngOnInit(): void {
    //console.log(this.list);
  }

}
