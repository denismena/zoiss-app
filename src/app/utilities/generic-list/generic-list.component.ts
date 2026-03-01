import { Component, ContentChild, Input, OnInit } from '@angular/core';
import { EmptySlotDirective } from './empty-slot.directive';
import { LoadingSlotDirective } from './loading-slot.directive';

@Component({
    selector: 'app-generic-list',
    templateUrl: './generic-list.component.html',
    styles: [],
    standalone: false
})
export class GenericListComponent implements OnInit {

  @Input()
  list: any;

  @ContentChild(LoadingSlotDirective) hasCustomLoading?: LoadingSlotDirective;
  @ContentChild(EmptySlotDirective) hasCustomEmpty?: EmptySlotDirective;

  constructor() { }

  ngOnInit(): void {}

}
