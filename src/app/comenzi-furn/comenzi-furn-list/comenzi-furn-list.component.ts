import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import * as saveAs from 'file-saver';
import { ClientiAutocompleteComponent } from 'src/app/nomenclatoare/clienti/clienti-autocomplete/clienti-autocomplete.component';
import { FurnizoriAutocompleteComponent } from 'src/app/nomenclatoare/furnizori/furnizori-autocomplete/furnizori-autocomplete.component';
import { ProduseAutocompleteComponent } from 'src/app/nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';
import { TransportService } from 'src/app/transport/transport.service';
import { CookieService } from 'src/app/utilities/cookie.service';
import { ExportService } from 'src/app/utilities/export.service';
import { formatDateFormData, parseWebAPIErrors } from 'src/app/utilities/utils';
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

  public form!: FormGroup;
  totalRecords:number = 0;
  currentPage:number = 1;
  pageSize: number = 20;
  initialFormValues: any;
  panelOpenState = false;
  loading$: boolean = true;
  @ViewChild(ClientiAutocompleteComponent) clientFilter!: ClientiAutocompleteComponent;  
  @ViewChild(ProduseAutocompleteComponent) produsFilter!: ProduseAutocompleteComponent;
  @ViewChild(FurnizoriAutocompleteComponent) furnizorFilter!: FurnizoriAutocompleteComponent;
  
  constructor(private comenziFurnizorService: ComenziFurnizorService, private transportService: TransportService,
    private router:Router, private formBuilder:FormBuilder, public cookie: CookieService, private exportService: ExportService) { 
    this.comenziFurnizor = [];
    this.expandedElement = [];
  }

  columnsToDisplay= ['expand', 'numar', 'data', 'furnizor', 'utilizator', 'termen', 'transportate', 'select', 'action'];

  ngOnInit(): void {
    let date: Date = new Date();
    date.setDate(date.getDate() - 30);

    this.form = this.formBuilder.group({
      fromDate: this.cookie.getCookie('comandaFurnizor_fromDate')== '' ? formatDateFormData(date): this.cookie.getCookie('comandaFurnizor_fromDate'),
      toDate: formatDateFormData(new Date()),
      disponibilitateFromDate: '',
      disponibilitateToDate: '',
      clientId: 0,      
      produsId: 0,
      furnizorId:0,      
      mine: this.cookie.getCookie('comandaFurnizor_mine')== '' ? false: this.cookie.getCookie('comandaFurnizor_mine'),
      sucursala: this.cookie.getCookie('comandaFurnizor_sucursala')== '' ? false: this.cookie.getCookie('comandaFurnizor_sucursala'),
      allTransportate: this.cookie.getCookie('comandaFurnizor_allTransportate')== '' ? false: this.cookie.getCookie('comandaFurnizor_allTransportate')
    });

    this.initialFormValues = this.form.value
    this.loadList(this.form.value);

    this.form.valueChanges.subscribe(values=>{
      values.fromDate = formatDateFormData(values.fromDate);
      values.toDate = formatDateFormData(values.toDate);      
      values.disponibilitateFromDate = values.disponibilitateFromDate=='' || values.disponibilitateFromDate== null ? '' : formatDateFormData(values.disponibilitateFromDate);
      values.disponibilitateToDate = values.disponibilitateToDate=='' || values.disponibilitateToDate== null ? '' : formatDateFormData(values.disponibilitateToDate);
      
      this.loadList(values);      
      //set cookies     
      this.cookie.setCookie({name: 'comandaFurnizor_fromDate',value: values.fromDate, session: true}); 
      this.cookie.setCookie({name: 'comandaFurnizor_mine',value: values.mine, session: true});
      this.cookie.setCookie({name: 'comandaFurnizor_sucursala',value: values.sucursala, session: true});
      this.cookie.setCookie({name: 'comandaFurnizor_allTransportate',value: values.allTransportate, session: true});
    })
  }

  loadList(values: any){
    values.page = this.currentPage;
    values.recordsPerPage = this.pageSize;
    this.comenziFurnizorService.getAll(values).subscribe((response: HttpResponse<comenziFurnizorDTO[]>)=>{
      this.comenziFurnizor = response.body??[];
      this.totalRecords = Number(response.headers.get("totalRecords"));
      this.loading$ = false;
    }, error => {
      this.errors = parseWebAPIErrors(error);      
      this.loading$ = false;
    });    
  }

  delete(id: number){
    this.comenziFurnizorService.delete(id)
    .subscribe(() => {
      this.loadList(this.form.value);
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }
  togglePanel(){    
    this.panelOpenState = !this.panelOpenState;
  }
  expand(element: comenziFurnizorDTO){
    var index = this.expandedElement.findIndex(f=>f.id == element.id);
    if(index == -1)
      this.expandedElement.push(element);
    else this.expandedElement.splice(index,1);    
  }

  getCheckbox(checkbox: any, row: comenziFurnizorDTO){
    this.checked = [];
    row.comenziFurnizoriProduse.forEach(p=>p.addToTransport = checkbox.checked
    );    
  }

  isAllSelected(row: comenziFurnizorDTO) {   
    row.allComandate = row.comenziFurnizoriProduse.every(function(item:any) {
          console.log('in isAllSelected row', item); 
          return item.addToTransport == true;
        })
  }

  genereazaTransport()
  {
    var selectedProd: produseComandaFurnizorDTO[] = [];
    this.comenziFurnizor.forEach(element => {
      element.comenziFurnizoriProduse.forEach(prod=>{
        if(prod.addToTransport)
          {
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
  this.form.get('produsId')?.setValue(produs == undefined ? 0 : produs.id);
  this.form.get('produsNume')?.setValue(produs == undefined ? "" :produs.nume);    
}

selectClient(clientId: string){
  this.form.get('clientId')?.setValue(clientId??0);
}

selectArhitect(arhitect: any){
  this.form.get('arhitectId')?.setValue(arhitect == undefined ? 0 : arhitect.id);
}
selectFurnizor(furnizor: any){
  this.form.get('furnizorId')?.setValue(furnizor == undefined ? 0 : furnizor?.id);
}
 //#endregion
 genereazaExcel(element:any)
 {
   this.loading$ = true;
   this.exportService.comandaFurnizorReport(element.id).subscribe(blob => {
     const dt = new Date(element.data)
     saveAs(blob, 'Comanda ' + element.furnizor + ' ' + dt.toLocaleDateString() + '.xlsx');
     this.loading$ = false;
   }, error => {
     console.log("Something went wrong");
   });
 }
}
