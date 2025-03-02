import {animate, state, style, transition, trigger} from '@angular/animations';
import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ComenziService } from 'src/app/comenzi/comenzi.service';
import { produseOfertaDTO } from 'src/app/nomenclatoare/produse/produse-item/produse.model';
import { formatDateFormData, parseWebAPIErrors } from 'src/app/utilities/utils';
import { oferteDTO } from '../oferte-item/oferte.model';
import { OferteService } from '../oferte.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientiAutocompleteComponent } from 'src/app/nomenclatoare/clienti/clienti-autocomplete/clienti-autocomplete.component';
import { ArhitectiAutocompleteComponent } from 'src/app/nomenclatoare/arhitecti/arhitecti-autocomplete/arhitecti-autocomplete.component';
import { ProduseAutocompleteComponent } from 'src/app/nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';
import { FurnizoriAutocompleteComponent } from 'src/app/nomenclatoare/furnizori/furnizori-autocomplete/furnizori-autocomplete.component';
import { HttpResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import saveAs from 'file-saver';
import { CookieService } from 'src/app/utilities/cookie.service';
import { ExportService } from 'src/app/utilities/export.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';

@Component({
    selector: 'app-oferte-list',
    templateUrl: './oferte-list.component.html',
    styleUrls: ['./oferte-list.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: false
})
export class OferteListComponent implements OnInit, OnDestroy {

  oferte: oferteDTO[]
  expandedElement: oferteDTO[];
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
  @ViewChild(ArhitectiAutocompleteComponent) arhitectFilter!: ArhitectiAutocompleteComponent;
  @ViewChild(ProduseAutocompleteComponent) produsFilter!: ProduseAutocompleteComponent;
  @ViewChild(FurnizoriAutocompleteComponent) furnizorFilter!: FurnizoriAutocompleteComponent; 
  
  constructor(private oferteService: OferteService, private comenziService:ComenziService, private router:Router, private unsubscribeService: UnsubscribeService,
      private formBuilder:FormBuilder, private exportService: ExportService, public cookie: CookieService, private dialog: MatDialog) { 
    this.oferte = [];
    this.expandedElement = [];
  }
  columnsToDisplay= ['expand', 'numar', 'data', 'client', 'arhitect', 'utilizator', 'avans', 'total', 'discount', 'valoare', 'comandate', 'select', 'action'];
  
  
  ngOnInit(): void {
    let date: Date = new Date();
    date.setDate(date.getDate() - 30);

    this.form = this.formBuilder.group({
      fromDate: this.cookie.getCookie('oferta_fromDate')== '' ? formatDateFormData(date): this.cookie.getCookie('oferta_fromDate'),
      toDate: formatDateFormData(new Date()),
      numar: '',
      clientId: 0,
      arhitectId: 0,      
      produsId: 0,
      furnizorId:0,
      mine: this.cookie.getCookie('oferta_mine')== '' ? false: this.cookie.getCookie('oferta_mine'),
      sucursala: this.cookie.getCookie('oferta_sucursala')== '' ? false: this.cookie.getCookie('oferta_sucursala'),
      allComandate: this.cookie.getCookie('oferta_allComandate')== '' ? false: this.cookie.getCookie('oferta_allComandate')
    });

    this.initialFormValues = this.form.value
    this.loadList(this.form.value);

    this.form.valueChanges.subscribe(values=>{
      values.fromDate = formatDateFormData(values.fromDate);
      values.toDate = formatDateFormData(values.toDate);
      this.loadList(values);
      //set cookies      
      this.cookie.setCookie({name: 'oferta_fromDate',value: values.fromDate, session: true});
      this.cookie.setCookie({name: 'oferta_mine',value: values.mine, session: true});
      this.cookie.setCookie({name: 'oferta_sucursala',value: values.sucursala, session: true});
      this.cookie.setCookie({name: 'oferta_allComandate',value: values.allComandate, session: true});
    })
  }

  loadList(values: any){
    values.page = this.currentPage;
    values.recordsPerPage = this.pageSize;
    this.oferteService.getAll(values)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((response: HttpResponse<oferteDTO[]>)=>{
      this.oferte = response.body??[];
      this.totalRecords = Number(response.headers.get("totalRecords"));
      this.loading$ = false;
    }, error => {
      this.errors = parseWebAPIErrors(error);      
      this.loading$ = false;
    });    
  }

  delete(id: number){
    const dialogRef = this.dialog.open(OkCancelDialogComponent, {data:{}});
    dialogRef.afterClosed()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((confirm) => {      
      if(confirm) this.deleteComanda(id);
    });
  }

  private deleteComanda(id: number){
    this.oferteService.delete(id)
    .subscribe(() => {
      this.loadList(this.form.value);
    }, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
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
    row.produse.forEach(p=>p.addToComanda = checkbox.checked
    );    
  }

  isAllSelected(row: oferteDTO) {    
    row.allComandate = row.produse.every(function(item:any) {
          return item.addToComanda == true;
        })
  }

  togglePanel(){
    this.panelOpenState = !this.panelOpenState;
  }

  genereazaComanda()
  {
    var selectedProd: produseOfertaDTO[] = [];
    this.oferte.forEach(element => {
      element.produse.forEach(prod=>{
        if(prod.addToComanda && !prod.isInComanda)
          {
            console.log(prod.id + ' ' +prod.produsNume + ' ' + prod.addToComanda);
            selectedProd.push(prod);
          }
      })
    });
    this.errors = [];

    if(selectedProd.length > 0){
      this.comenziService.fromOferta(selectedProd)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(id=>{
        this.router.navigate(['/comenzi/edit/' + id])
      }, 
      error=> this.errors = parseWebAPIErrors(error));
    }
    else this.errors.push("Nu ati selectat nici o oferta!");
  }

  updatePagination(event: PageEvent){
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
 
  private getSelectedProduse(element: any): number[]{
    const selectedProd = element.produse
      .filter((prod: produseOfertaDTO) => prod.addToComanda && !prod.isInComanda)
      .map((prod: produseOfertaDTO) => prod.id);
    return selectedProd;
  } 

  genereazaExcel(element: any) {
    this.loading$ = true;
    
    const neComandate = this.cookie.getCookie('oferta' + element.id) == '' ? 'false' : this.cookie.getCookie('oferta' + element.id);
    this.exportService.ofertaReport(element.id, this.getSelectedProduse(element), neComandate)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(blob => {
      const dt = new Date(element.data)
      saveAs(blob, 'Oferta ' + element.client + ' ' + dt.toLocaleDateString() + '.xlsx');
      this.loading$ = false;
    }, error => {
      console.log("Something went wrong");
    });
  }
  
  genereazaPDF(element:any, showPrice: boolean)
  {    
    this.loading$ = true;
    const neComandate = this.cookie.getCookie('oferta' + element.id) == '' ? 'false' : this.cookie.getCookie('oferta' + element.id);
    this.exportService.ofertaReportPDF(element.id, this.getSelectedProduse(element), neComandate, showPrice)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(blob => {
      this.loading$ = false;
      const dt = new Date(element.data)
      saveAs(blob, 'Oferta ' + element.client + ' ' + dt.toLocaleDateString()+'.pdf');
    }, error => {
      console.log("Something went wrong");
    });
  }

  genereazaPDFcuPoza(element:any)
  {    
    this.loading$ = true;
    const neComandate = this.cookie.getCookie('oferta' + element.id) == '' ? 'false' : this.cookie.getCookie('oferta' + element.id);
    this.exportService.ofertaReportPDFcuPoza(element.id, this.getSelectedProduse(element), neComandate)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(blob => {
      var fileURL = window.URL.createObjectURL(blob);
      this.loading$ = false;
      const dt = new Date(element.data)
      saveAs(blob, 'Oferta ' + element.client + ' ' + dt.toLocaleDateString()+'.pdf');
      window.open(fileURL, "_blank");
    }, error => {
      console.log("Something went wrong");
    });
  }
  
  ngOnDestroy(): void {}
}
