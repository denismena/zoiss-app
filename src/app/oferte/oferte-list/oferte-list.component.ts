import {animate, state, style, transition, trigger} from '@angular/animations';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatRow } from '@angular/material/table';
import { Router } from '@angular/router';
import { ComenziService } from 'src/app/comenzi/comenzi.service';
import { produseDTO, produseOfertaDTO } from 'src/app/nomenclatoare/produse/produse-item/produse.model';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { oferteDTO } from '../oferte-item/oferte.model';
import { OferteService } from '../oferte.service';

@Component({
  selector: 'app-oferte-list',
  templateUrl: './oferte-list.component.html',
  styleUrls: ['./oferte-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OferteListComponent implements OnInit {

  oferte: oferteDTO[]
  expandedElement: oferteDTO[];
  checked = [];
  @ViewChildren ('checkBox') 
  checkBox:QueryList<any> = new QueryList();
  errors: string[] = [];

  constructor(private oferteService: OferteService, private comenziService: ComenziService, private router:Router) { 
    this.oferte = [];
    this.expandedElement = [];
  }
  columnsToDisplay= ['numar', 'data', 'client', 'arhitect', 'utilizator', 'avans', 'select', 'action'];
  
  
  ngOnInit(): void {
    this.loadList();
  }

  loadList(){
    this.oferteService.getAll().subscribe(oferte=>{
      this.oferte = oferte;
      console.log(this.oferte);
    });    
  }
  delete(id: number){
    this.oferteService.delete(id)
    .subscribe(() => {
      this.loadList();
    });
  }

  expand(element: oferteDTO){
    var index = this.expandedElement.findIndex(f=>f.id == element.id);
    if(index == -1)
      this.expandedElement.push(element);
    else this.expandedElement.splice(index,1);    
  }

  getCheckbox(checkbox: any, row: oferteDTO){
    this.checked = [];
    console.log(row);
    row.produse.forEach(p=>p.isInComanda = checkbox.checked
    );    
  }

  isAllSelected(row: oferteDTO) {    
    row.allComandate = row.produse.every(function(item:any) {
          return item.isInComanda == true;
        })
      console.log('row.allComandate', row.allComandate);
  }

  genereazaComanda()
  {
    var selectedProd: produseOfertaDTO[] = [];
    this.oferte.forEach(element => {
      element.produse.forEach(prod=>{
        if(prod.isInComanda)
          {
            console.log(prod.id + ' ' +prod.produsNume + ' ' + prod.isInComanda);
            selectedProd.push(prod);
          }
      })
    });

    this.comenziService.fromOferta(selectedProd).subscribe(()=>{
      this.router.navigate(['/oferte'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));
  }

}
