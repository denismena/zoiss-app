import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { TransportService } from 'src/app/transport/transport.service';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { comenziFurnizorDTO, produseComandaFurnizorDTO } from '../comenzi-furn-item/comenzi-furn.model';
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
  constructor(private comenziFurnizorService: ComenziFurnizorService, private transportService: TransportService,
    private router:Router) { 
    this.comenziFurnizor = [];
    this.expandedElement = [];
  }

  columnsToDisplay= ['expand', 'numar', 'data', 'furnizor', 'utilizator', 'platit', 'termen', 'transportate', 'select', 'action'];

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
    row.comenziFurnizoriProduse.forEach(p=>p.addToTransport = checkbox.checked
    );    
  }

  isAllSelected(row: comenziFurnizorDTO) {   
    console.log('in isAllSelected', row); 
    row.allComandate = row.comenziFurnizoriProduse.every(function(item:any) {
          console.log('in isAllSelected row', item); 
          return item.addToTransport == true;
        })
      console.log('row.allComandate', row.allComandate);
  }

  genereazaTransport()
  {
    console.log('in');
    var selectedProd: produseComandaFurnizorDTO[] = [];
    this.comenziFurnizor.forEach(element => {
      element.comenziFurnizoriProduse.forEach(prod=>{
        console.log('prod', prod);
        if(prod.addToTransport)
          {
            console.log(prod.id + ' ' +prod.produsNume + ' ' + prod.isInTransport);
            selectedProd.push(prod);
          }
      })
    });
    
    if(selectedProd.length > 0){
      this.transportService.fromComandaFurnizor(selectedProd).subscribe(id=>{
        console.log('comanda new id', id);
        this.router.navigate(['/transport/edit/' + id])
      }, 
      error=> this.errors = parseWebAPIErrors(error));
    }
    else this.errors.push("Nu ati selectat nici o comanda!");
  }
}
