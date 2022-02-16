import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LivrariService } from 'src/app/livrari/livrari.service';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { LivrariNumberDialogComponent } from '../livrari-number-dialog/livrari-number-dialog.component';
import { transportDTO, transportProduseDTO } from '../transport-item/transport.model';
import { TransportService } from '../transport.service';

@Component({
  selector: 'app-transport-list',
  templateUrl: './transport-list.component.html',
  styleUrls: ['./transport-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TransportListComponent implements OnInit {

  transport: transportDTO[]
  expandedElement: transportDTO[];
  checked = [];
  @ViewChildren ('checkBox') 
  checkBox:QueryList<any> = new QueryList();
  errors: string[] = [];
  constructor(private transporService: TransportService, private livrariService: LivrariService, private router:Router,
    public dialog: MatDialog) { 
    this.transport = [];
    this.expandedElement = [];
  }

  columnsToDisplay= ['expand','referinta', 'data', 'transportator', 'utilizator', 'livrate', 'select', 'action'];

  ngOnInit(): void {
    this.loadList();
  }
  loadList(){
    this.transporService.getAll().subscribe(transport=>{
      this.transport = transport;
      console.log(this.transport);
    });    
  }

  delete(id: number){
    this.transporService.delete(id)
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }
  expand(element: transportDTO){
    var index = this.expandedElement.findIndex(f=>f.id == element.id);
    if(index == -1)
      this.expandedElement.push(element);
    else this.expandedElement.splice(index,1);    
  }


  genereazaLivrare(){
    var maiMultiClienti = false;
    var cclientId = 0;
    
    var selectedProd: transportProduseDTO[] = [];
          this.transport.forEach(element => {
            element.transportProduse.forEach(prod=>{              
              if(prod.addToLivrare && !prod.isInLivrare)
                {
                  console.log('prod', prod);
                  selectedProd.push(prod);

                  if(cclientId != prod.clientId && cclientId > 0)  maiMultiClienti = true; 
                  else cclientId = prod.clientId;  
                }
            })
          });

    if(maiMultiClienti) 
    { 
      Swal.fire({ title: "Atentie!", text: "Ati selectat produse de la mai multi clienti!", icon: 'info' });
      return;
    }
    if(selectedProd.length == 0){
      Swal.fire({ title: "Atentie!", text: "Nu ati selectat nici un produs!", icon: 'info' });
      return;
    }

    const dialogRef = this.dialog.open(LivrariNumberDialogComponent,      
      { data:{ }, width: '450px', height: '400px' });

      dialogRef.afterClosed().subscribe((data) => {      
        if (data.clicked === 'submit') {
          var numar = data.form.numar;
          console.log('data.form', data.form);       
          
          
          if(selectedProd.length > 0){
            this.livrariService.fromTransport(numar, selectedProd).subscribe(id=>{
              console.log('comanda new id', id);
              this.router.navigate(['/livrari/edit/' + id])
            }, 
            error=> this.errors = parseWebAPIErrors(error));
          }
          else this.errors.push("Nu ati selectat nici o comanda!");
        }
        else console.log('else');
      });
  }

  getCheckbox(checkbox: any, row: transportDTO){
    this.checked = [];
    console.log(row);
    row.transportProduse.forEach(p=>p.addToLivrare = checkbox.checked
    );    
  }

  isAllSelected(row: transportDTO) {   
    console.log('in isAllSelected', row); 
    row.allComandate = row.transportProduse.every(function(item:any) {
          console.log('in isAllSelected row', item); 
          return item.addToTransport == true;
        })
      console.log('row.allComandate', row.allComandate);
  }

}
