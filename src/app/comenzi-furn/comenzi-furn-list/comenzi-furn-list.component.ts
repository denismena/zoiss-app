import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { comenziFurnizorDTO } from '../comenzi-furn-item/comenzi-furn.model';
import { ComenziFurnizorService } from '../comenzi-furn.service';

@Component({
  selector: 'app-comenzi-furn-list',
  templateUrl: './comenzi-furn-list.component.html',
  styleUrls: ['./comenzi-furn-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ComenziFurnListComponent implements OnInit {

  comenziFurnizor: comenziFurnizorDTO[]
  expandedElement: comenziFurnizorDTO[];
  checked = [];
  @ViewChildren ('checkBox') 
  checkBox:QueryList<any> = new QueryList();
  errors: string[] = [];
  constructor(private comenziFurnizorService: ComenziFurnizorService, private router:Router) { 
    this.comenziFurnizor = [];
    this.expandedElement = [];
  }

  columnsToDisplay= ['expand', 'numar', 'data', 'furnizor', 'utilizator', 'platit', 'transportate', 'select', 'action'];

  ngOnInit(): void {
    this.loadList();
  }

  loadList(){
    this.comenziFurnizorService.getAll().subscribe(comenziFurnizor=>{
      this.comenziFurnizor = comenziFurnizor;
      console.log(this.comenziFurnizor);
    });    
  }

  delete(id: number){
    this.comenziFurnizorService.delete(id)
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }

  expand(element: comenziFurnizorDTO){
    var index = this.expandedElement.findIndex(f=>f.id == element.id);
    if(index == -1)
      this.expandedElement.push(element);
    else this.expandedElement.splice(index,1);    
  }

  getCheckbox(checkbox: any, row: comenziFurnizorDTO){
    this.checked = [];
    console.log(row);
    // row.comenziFurnizoriProduse.forEach(p=>p.addToComandaFurnizor = checkbox.checked
    // );    
  }

  isAllSelected(row: comenziFurnizorDTO) {   
    console.log('in isAllSelected', row); 
    // row.allComandate = row.comenziProduses.every(function(item:any) {
    //       console.log('in isAllSelected row', item); 
    //       return item.addToComandaFurnizor == true;
    //     })
    //   console.log('row.allComandate', row.allComandate);
  }

  genereazaTransport()
  {
    // console.log('in');
    // var selectedProd: produseComandaDTO[] = [];
    // this.comenzi.forEach(element => {
    //   element.comenziProduses.forEach(prod=>{
    //     console.log('prod', prod);
    //     if(prod.addToComandaFurnizor)
    //       {
    //         console.log(prod.id + ' ' +prod.produsNume + ' ' + prod.isInComandaFurnizor);
    //         selectedProd.push(prod);
    //       }
    //   })
    // });
    
    // if(selectedProd.length > 0){
    //   this.comenziFurnizorService.fromOferta(selectedProd).subscribe(id=>{
    //     console.log('comanda new id', id);
    //     this.router.navigate(['/comenziFurnizor/edit/' + id])
    //   }, 
    //   error=> this.errors = parseWebAPIErrors(error));
    // }
    // else this.errors.push("Nu ati selectat nici o oferta!");
  }
}
