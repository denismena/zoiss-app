import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
   
   @Pipe({
    name: 'customDateTime',
    standalone: false
})
   export class CustomDateTimePipe extends 
                DatePipe implements PipeTransform {
     transform(value: any, args?: any): any {
       return super.transform(value, "dd MMM y hh:mm");
     }
   }

   @Pipe({
    name: 'customDate',
    standalone: false
})
  export class CustomDatePipe extends 
               DatePipe implements PipeTransform {
    transform(value: any, args?: any): any {
      return super.transform(value, "dd MMM y");
    }
  }

  @Pipe({
    name: 'daNu',
    standalone: false
})
  export class DaNuPipe implements PipeTransform {
    transform(value: any): any {
      return value ? 'Da' : 'Nu';;
    }
  }

  // @Pipe({
  //   name: 'filterProdusStoc'
  // })
  // export class FilterProdusStocPipe implements PipeTransform {
  //   transform(comandaStocList: comandaStocDTO[], searchText: string): comandaStocDTO[] {
  //     console.log('filterProdusStoc', comandaStocList, searchText);
      
  //     if (!searchText) {
  //       return comandaStocList;
  //     }
  
  //     return comandaStocList.filter((comanda) => {
  //       comanda.comenziProduseStoc = comanda.comenziProduseStoc.filter((produs) => {
  //         return (
  //           produs.codProdus.toLowerCase().includes(searchText.toLowerCase()) ||
  //           produs.produsNume.toLowerCase().includes(searchText.toLowerCase())
  //         );
  //       });
  //       return comanda.comenziProduseStoc.length > 0;
  //     });
  //   }
  // }

  @Pipe({
    name: 'filterComandaProdusStoc',
    standalone: false
})
  export class FilterComandaProdusStocPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
      if (!items) {
        return [];
      }
      if (!searchText) {
        return items;
      }
      searchText = searchText.toLowerCase();
      return items.filter(item => {
        return item.comandaNumar === Number(searchText);
      });
    }
  }