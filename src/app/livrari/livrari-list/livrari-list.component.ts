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
import { ExportService } from 'src/app/utilities/export.service';
import { formatDateFormData, parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { LivrariDTO } from '../livrari-item/livrari.model';
import { LivrariService } from '../livrari.service';

@Component({
  selector: 'app-livrari-list',
  templateUrl: './livrari-list.component.html',
  styleUrls: ['./livrari-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LivrariListComponent implements OnInit {

  livrari: LivrariDTO[]=[]
  expandedElement: LivrariDTO[]=[];
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
  constructor(private livrariService: LivrariService, private router:Router, 
    private formBuilder:FormBuilder, private exportService: ExportService) { }

  columnsToDisplay= ['expand', 'numar', 'data', 'client', 'curier', 'receptionatDe', 'detalii', 'utilizator', 'livrate', 'action'];

  ngOnInit(): void {
    let date: Date = new Date();
    date.setDate(date.getDate() - 30);

    this.form = this.formBuilder.group({
      fromDate: formatDateFormData(date),
      toDate: formatDateFormData(new Date()),
      clientId: 0,      
      produsId: 0,
      furnizorId:0,
      mine: false,
      allSpreLivrare: false
    });

    this.initialFormValues = this.form.value
    this.loadList(this.form.value);

    this.form.valueChanges.subscribe(values=>{
      values.fromDate = formatDateFormData(values.fromDate);
      values.toDate = formatDateFormData(values.toDate);
      console.log(values.disponibilitateFromDate);     
      
      this.loadList(values);      
    })
  }

  loadList(values: any){
    values.page = this.currentPage;
    values.recordsPerPage = this.pageSize;
    this.livrariService.getAll(values).subscribe((response: HttpResponse<LivrariDTO[]>)=>{
      this.livrari = response.body??[];
      this.totalRecords = Number(response.headers.get("totalRecords"));
      this.loading$ = false;
    }, error => {
      this.errors = parseWebAPIErrors(error);      
      this.loading$ = false;
    });    
  }

  delete(id: number){
    this.livrariService.delete(id)
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
  expand(element: LivrariDTO){
    var index = this.expandedElement.findIndex(f=>f.id == element.id);
    if(index == -1)
      this.expandedElement.push(element);
    else this.expandedElement.splice(index,1);    
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

  genereazaPDF(element:any)
  {    
    this.loading$ = true;
    this.exportService.aimPDF(element.id).subscribe(blob => {
      this.loading$ = false;
      const dt = new Date(element.data)
      saveAs(blob, 'AIM ' + element.client + ' ' + dt.toLocaleDateString()+'.pdf');
    }, error => {
      console.log("Something went wrong");
    });
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
