import {animate, state, style, transition, trigger} from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { nirDTO } from '../nir-item/nir.model';
import { Router } from '@angular/router';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExportService } from 'src/app/utilities/export.service';
import { CookieService } from 'src/app/utilities/cookie.service';
import { ProduseAutocompleteComponent } from 'src/app/nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';
import { FurnizoriAutocompleteComponent } from 'src/app/nomenclatoare/furnizori/furnizori-autocomplete/furnizori-autocomplete.component';
import { formatDateFormData, parseWebAPIErrors } from 'src/app/utilities/utils';
import { NIRService } from '../nir.service';
import { takeUntil } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-nir-list',
  templateUrl: './nir-list.component.html',
  styleUrls: ['./nir-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class NirListComponent implements OnInit, OnDestroy {
  @ViewChild(ProduseAutocompleteComponent) produsFilter!: ProduseAutocompleteComponent;
  @ViewChild(FurnizoriAutocompleteComponent) furnizorFilter!: FurnizoriAutocompleteComponent; 
  public form!: FormGroup;
  nirList: nirDTO[]
  expandedElement: nirDTO[];
  columnsToDisplay= ['expand', 'numar', 'data', 'utilizator', 'action'];
  errors: string[] = [];  
  totalRecords:number = 0;
  currentPage:number = 1;
  pageSize: number = 20;
  initialFormValues: any;
  panelOpenState = false;
  loading$: boolean = true;  
  
  constructor(private nirService: NIRService, private router:Router, private unsubscribeService: UnsubscribeService,
    private formBuilder:FormBuilder, private exportService: ExportService, public cookie: CookieService) { 
      this.nirList = [];
      this.expandedElement = [];
    }

  ngOnInit(): void {
    let date: Date = new Date();
    date.setDate(date.getDate() - 30);

    this.form = this.formBuilder.group({
      fromDate: this.cookie.getCookie('nir_fromDate')== '' ? formatDateFormData(date): this.cookie.getCookie('nir_fromDate'),
      toDate: formatDateFormData(new Date()),
      numar: '',
      produsId: 0,
      furnizorId:0,
      mine: this.cookie.getCookie('nir_mine')== '' ? false: this.cookie.getCookie('nir_mine'),      
    });

    this.initialFormValues = this.form.value
    this.loadList(this.form.value);

    this.form.valueChanges.subscribe(values=>{
      values.fromDate = formatDateFormData(values.fromDate);
      values.toDate = formatDateFormData(values.toDate);
      this.loadList(values);
      //set cookies      
      this.cookie.setCookie({name: 'nir_fromDate',value: values.fromDate, session: true});
      this.cookie.setCookie({name: 'nir_mine',value: values.mine, session: true});      
    })
  }

  loadList(values: any){
    values.page = this.currentPage;
    values.recordsPerPage = this.pageSize;
    this.nirService.getAll(values)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((response: HttpResponse<nirDTO[]>)=>{
      this.nirList = response.body??[];
      console.log('this.nirList', this.nirList);
      this.totalRecords = Number(response.headers.get("totalRecords"));
      this.loading$ = false;
    }, error => {
      this.errors = parseWebAPIErrors(error);      
      this.loading$ = false;
    });    
  }

  delete(id: number){
    this.nirService.delete(id)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.loadList(this.form.value);
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }

  expand(element: nirDTO){
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
    this.produsFilter.clearSelection();    
    this.furnizorFilter.clearSelection();
  }

  //#region filtre
  selectProdus(produs: any){    
    this.form.get('produsId')?.setValue(produs == undefined ? 0 : produs.id);
    this.form.get('produsNume')?.setValue(produs == undefined ? "" :produs.nume);    
  } 
    
  selectFurnizor(furnizor: any){
      this.form.get('furnizorId')?.setValue(furnizor == undefined ? 0 : furnizor?.id);
    }
  //#endregion
 
  togglePanel(){
    this.panelOpenState = !this.panelOpenState;
  }
  
  ngOnDestroy(): void {
  }

}
