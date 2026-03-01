import { Pipe, PipeTransform } from '@angular/core';
import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: false
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): string {
    if (value == null || value === '') {
      return '';
    }
    return this.sanitizer.sanitize(SecurityContext.HTML, value) ?? '';
  }
}
