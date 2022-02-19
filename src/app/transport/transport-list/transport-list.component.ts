import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { LivrariService } from 'src/app/livrari/livrari.service';
import { ClientiAutocompleteComponent } from 'src/app/nomenclatoare/clienti/clienti-autocomplete/clienti-autocomplete.component';
import { depoziteDTO } from 'src/app/nomenclatoare/depozite/depozite-item/depozite.model';
import { DepoziteService } from 'src/app/nomenclatoare/depozite/depozite.service';
import { FurnizoriAutocompleteComponent } from 'src/app/nomenclatoare/furnizori/furnizori-autocomplete/furnizori-autocomplete.component';
import { ProduseAutocompleteComponent } from 'src/app/nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';
import { formatDateFormData, parseWebAPIErrors } from 'src/app/utilities/utils';
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
  depozitList: depoziteDTO[] = [];

  public form!: FormGroup;
  totalRecords:number = 0;
  currentPage:number = 1;
  pageSize: number = 20;
  initialFormValues: any;
  panelOpenState = false;
  @ViewChild(ClientiAutocompleteComponent) clientFilter!: ClientiAutocompleteComponent;  
  @ViewChild(ProduseAutocompleteComponent) produsFilter!: ProduseAutocompleteComponent;
  @ViewChild(FurnizoriAutocompleteComponent) furnizorFilter!: FurnizoriAutocompleteComponent;
  
  constructor(private transporService: TransportService, private livrariService: LivrariService, private router:Router,
    public dialog: MatDialog, private formBuilder:FormBuilder, private depoziteService: DepoziteService) { 
    this.transport = [];
    this.expandedElement = [];
  }

  columnsToDisplay= ['expand','referinta', 'data', 'transportator', 'utilizator', 'livrate', 'select', 'action'];

  ngOnInit(): void {

    let date: Date = new Date();
    date.setDate(date.getDate() - 30);

    this.form = this.formBuilder.group({
      fromDate: formatDateFormData(date),
      toDate: formatDateFormData(new Date()),      
      clientId: 0,      
      produsId: 0,
      furnizorId:0,
      mine: true,
      allSpreLivrare: false,
      depozitId:0
    });

    this.initialFormValues = this.form.value
    this.loadList(this.form.value);
    
    this.form.valueChanges.subscribe(values=>{
      values.fromDate = formatDateFormData(values.fromDate);
      values.toDate = formatDateFormData(values.toDate);
      this.loadList(values);      
    })

    this.depoziteService.getAll().subscribe(dep=>{this.depozitList=dep;});
  }

  loadList(values: any){
    values.page = this.currentPage;
    values.recordsPerPage = this.pageSize;
    this.transporService.getAll(values).subscribe((response: HttpResponse<transportDTO[]>)=>{
      this.transport = response.body??[];
      this.totalRecords = Number(response.headers.get("totalRecords"));      
    });
  }

  delete(id: number){
    this.transporService.delete(id)
    .subscribe(() => {
      this.loadList(this.form.value);
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

  updatePagination(event: PageEvent){
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadList(this.form.value);
  }

  clearForm(){
    this.form.patchValue(this.initialFormValues);
    this.clientFilter.clearSelection();    
    this.produsFilter.clearSelection();    
    this.furnizorFilter.clearSelection();
  }

//#region filtre
  selectProdus(produs: any){    
    this.form.get('produsId')?.setValue(produs.id);
    this.form.get('produsNume')?.setValue(produs.nume);    
    console.log('produsId: ', this.form.get('produsId')?.value);
 }

 selectClient(clientId: string){
    this.form.get('clientId')?.setValue(clientId);
    console.log('clientNume: ', this.form.get('clientId')?.value);
  }

  selectArhitect(arhitectId: string){
    this.form.get('arhitectId')?.setValue(arhitectId);
    console.log('arhitectId: ', this.form.get('arhitectId')?.value);
  }
  selectFurnizor(furnizor: any){
    this.form.get('furnizorId')?.setValue(furnizor.id);
    console.log('furnizorId: ', this.form.get('furnizorId')?.value);
  }
 //#endregion

}
