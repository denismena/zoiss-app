import { Directive } from '@angular/core';

/** Directive to mark custom empty state content for app-generic-list. When present, suppresses the default "no records" message. */
@Directive({
  selector: '[empty]',
  standalone: false
})
export class EmptySlotDirective {}
