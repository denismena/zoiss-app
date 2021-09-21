import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
   
   @Pipe({
     name: 'customDateTime'
   })
   export class CustomDateTimePipe extends 
                DatePipe implements PipeTransform {
     transform(value: any, args?: any): any {
       return super.transform(value, "dd MMM y hh:mm");
     }
   }

   @Pipe({
    name: 'customDate'
  })
  export class CustomDatePipe extends 
               DatePipe implements PipeTransform {
    transform(value: any, args?: any): any {
      return super.transform(value, "dd MMM y");
    }
  }