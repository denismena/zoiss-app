import { Directive } from '@angular/core';

/** Directive to mark custom loading content for app-generic-list. When present, suppresses the default loading gif. */
@Directive({
  selector: '[loading]',
  standalone: false
})
export class LoadingSlotDirective {}
