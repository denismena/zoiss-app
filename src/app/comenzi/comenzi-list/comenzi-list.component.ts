import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Router } from '@angular/router';
import { formatDateFormData, parseWebAPIErrors } from 'src/app/utilities/utils';
import { comenziDTO, produseComandaDTO } from '../comenzi-item/comenzi.model';
import { ComenziService } from '../comenzi.service';
import Swal from 'sweetalert2';
import { ComenziFurnizorService } from 'src/app/comenzi-furn/comenzi-furn.service';
import { HttpResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { date } from '@rxweb/reactive-form-validators';
import { ClientiAutocompleteComponent } from 'src/app/nomenclatoare/clienti/clienti-autocomplete/clienti-autocomplete.component';
import { ArhitectiAutocompleteComponent } from 'src/app/nomenclatoare/arhitecti/arhitecti-autocomplete/arhitecti-autocomplete.component';
import { ProduseAutocompleteComponent } from 'src/app/nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';
import { FurnizoriAutocompleteComponent } from 'src/app/nomenclatoare/furnizori/furnizori-autocomplete/furnizori-autocomplete.component';
import { furnizoriDTO } from 'src/app/nomenclatoare/furnizori/furnizori-item/furnizori.model';

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

  comenzi: comenziDTO[];
  expandedElement: comenziDTO[];
  checked = [];
  @ViewChildren ('checkBox') 
  checkBox:QueryList<any> = new QueryList();
  errors: string[] = [];
  public form!: FormGroup;
  totalRecords:number = 0;
  currentPage:number = 1;
  pageSize: number = 5;
  initialFormValues: any;
  panelOpenState = false;
  @ViewChild(ClientiAutocompleteComponent)
  clientFilter!: ClientiAutocompleteComponent;
  @ViewChild(ArhitectiAutocompleteComponent)
  arhitectFilter!: ArhitectiAutocompleteComponent;
  @ViewChild(ProduseAutocompleteComponent)
  produsFilter!: ProduseAutocompleteComponent;
  @ViewChild(FurnizoriAutocompleteComponent)
  furnizorFilter!: FurnizoriAutocompleteComponent;

  constructor(private comenziService: ComenziService, private comenziFurnizorService: ComenziFurnizorService, 
    private router:Router, private formBuilder:FormBuilder) { 
    this.comenzi = [];
    this.expandedElement = [];
  }
  columnsToDisplay= ['expand', 'numar', 'data', 'client', 'arhitect', 'utilizator', 'avans', 'platit', 'comandate', 'select', 'action'];

  ngOnInit(): void {
    let date: Date = new Date();
    date.setDate(date.getDate() - 30);

    this.form = this.formBuilder.group({
      fromDate: formatDateFormData(date),
      toDate: formatDateFormData(new Date()),
      clientId: 0,
      arhitectId: 0,      
      produsId: 0,
      furnizorId:0,
      mine: true,
      allComandate: false
    });

    this.initialFormValues = this.form.value
    this.loadList(this.form.value);

    this.form.valueChanges.subscribe(values=>{
      values.fromDate = formatDateFormData(values.fromDate);
      values.toDate = formatDateFormData(values.toDate);
      this.loadList(values);      
    })
  }

  loadList(values: any){
    values.page = this.currentPage;
    values.recordsPerPage = this.pageSize;
    this.comenziService.getAll(values).subscribe((response: HttpResponse<comenziDTO[]>)=>{
      this.comenzi = response.body??[];
      this.totalRecords = Number(response.headers.get("totalRecords"));
      console.log('this.comenzi', this.comenzi);
      console.log('totalRecords', response.headers);
    });    
  }

  delete(id: number){
    this.comenziService.delete(id)
    .subscribe(() => {
      this.loadList(this.form.value);
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

    if(selectedProd.length > 0){
      this.comenziFurnizorService.fromOferta(selectedProd).subscribe(id=>{
        console.log('comanda new id', id);
        this.router.navigate(['/comenziFurnizor/edit/' + id])
      }, 
      error=> this.errors = parseWebAPIErrors(error));
    }
    else this.errors.push("Nu ati selectat nici o oferta!");
  }

  upadatePagination(event: PageEvent){
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadList(this.form.value);
  }

  clearForm(){
    this.form.patchValue(this.initialFormValues);
    this.clientFilter.clearSelection();
    this.arhitectFilter.clearSelection();
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
