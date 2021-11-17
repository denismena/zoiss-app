import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { comenziDTO } from '../comenzi-item/comenzi.model';
import { ComenziService } from '../comenzi.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comenzi-list',
  templateUrl: './comenzi-list.component.html',
  styleUrls: ['./comenzi-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ComenziListComponent implements OnInit {

  comenzi: comenziDTO[]
  expandedElement: comenziDTO[];
  checked = [];
  @ViewChildren ('checkBox') 
  checkBox:QueryList<any> = new QueryList();
  errors: string[] = [];

  constructor(private comenziService: ComenziService, private router:Router) { 
    this.comenzi = [];
    this.expandedElement = [];
  }
  columnsToDisplay= ['expand', 'numar', 'data', 'client', 'arhitect', 'utilizator', 'avans', 'action'];

  ngOnInit(): void {
    this.loadList();
  }

  loadList(){
    this.comenziService.getAll().subscribe(comenzi=>{
      this.comenzi = comenzi;
      console.log(this.comenzi);
    });    
  }
  delete(id: number){
    this.comenziService.delete(id)
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }

  expand(element: comenziDTO){
    var index = this.expandedElement.findIndex(f=>f.id == element.id);
    if(index == -1)
      this.expandedElement.push(element);
    else this.expandedElement.splice(index,1);    
  }

  getCheckbox(checkbox: any, row: comenziDTO){
    // this.checked = [];
    // console.log(row);
    // row.produse.forEach(p=>p.isInComanda = checkbox.checked
    // );    
  }

  isAllSelected(row: comenziDTO) {    
    // row.allComandate = row.produse.every(function(item:any) {
    //       return item.isInComanda == true;
    //     })
    //   console.log('row.allComandate', row.allComandate);
  }

  genereazaComanda()
  {
    // var selectedProd: produseOfertaDTO[] = [];
    // this.comenzi.forEach(element => {
    //   element.produse.forEach(prod=>{
    //     if(prod.isInComanda)
    //       {
    //         console.log(prod.id + ' ' +prod.produsNume + ' ' + prod.isInComanda);
    //         selectedProd.push(prod);
    //       }
    //   })
    // });

    // this.comenziService.fromOferta(selectedProd).subscribe(()=>{
    //   this.router.navigate(['/comenzi'])
    // }, 
    // error=> this.errors = parseWebAPIErrors(error));
  }
}
