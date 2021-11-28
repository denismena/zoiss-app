import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { comenziDTO, produseComandaDTO } from '../comenzi-item/comenzi.model';
import { ComenziService } from '../comenzi.service';
import Swal from 'sweetalert2';
import { ComenziFurnizorService } from 'src/app/comenzi-furn/comenzi-furn.service';

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

  constructor(private comenziService: ComenziService, private comenziFurnizorService: ComenziFurnizorService, private router:Router) { 
    this.comenzi = [];
    this.expandedElement = [];
  }
  columnsToDisplay= ['expand', 'numar', 'data', 'client', 'arhitect', 'utilizator', 'avans', 'comandate', 'select', 'action'];

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
    this.checked = [];
    console.log(row);
    row.comenziProduses.forEach(p=>p.addToComandaFurnizor = checkbox.checked
    );    
  }

  isAllSelected(row: comenziDTO) {   
    row.allComandate = row.comenziProduses.every(function(item:any) {
          return item.addToComandaFurnizor == true;
    })
  }

  genereazaComandaFurnizor()
  {
    console.log('in');
    var selectedProd: produseComandaDTO[] = [];
    this.comenzi.forEach(element => {
      element.comenziProduses.forEach(prod=>{
        console.log('prod', prod);
        if(prod.addToComandaFurnizor)
          {
            console.log(prod.id + ' ' +prod.produsNume + ' ' + prod.isInComandaFurnizor);
            selectedProd.push(prod);
          }
      })
    });

    // this.comenziService.fromOferta(selectedProd).subscribe(()=>{
    //   this.router.navigate(['/comenzi'])
    // }, 
    // error=> this.errors = parseWebAPIErrors(error));

    if(selectedProd.length > 0){
      this.comenziFurnizorService.fromOferta(selectedProd).subscribe(id=>{
        console.log('comanda new id', id);
        this.router.navigate(['/comenziFurnizor/edit/' + id])
      }, 
      error=> this.errors = parseWebAPIErrors(error));
    }
    else this.errors.push("Nu ati selectat nici o oferta!");
  }
}
