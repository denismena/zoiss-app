import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Router } from '@angular/router';
import { formatDateFormData, parseWebAPIErrors } from 'src/app/utilities/utils';
import { comenziDTO, produseComandaDTO } from '../comenzi-item/comenzi.model';
import { ComenziService } from '../comenzi.service';
import { ComenziFurnizorService } from 'src/app/comenzi-furn/comenzi-furn.service';
import { HttpResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientiAutocompleteComponent } from 'src/app/nomenclatoare/clienti/clienti-autocomplete/clienti-autocomplete.component';
import { ArhitectiAutocompleteComponent } from 'src/app/nomenclatoare/arhitecti/arhitecti-autocomplete/arhitecti-autocomplete.component';
import { ProduseAutocompleteComponent } from 'src/app/nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';
import { FurnizoriAutocompleteComponent } from 'src/app/nomenclatoare/furnizori/furnizori-autocomplete/furnizori-autocomplete.component';
import { CookieService } from 'src/app/utilities/cookie.service';
import saveAs from 'file-saver';
import { ExportService } from 'src/app/utilities/export.service';
import { ComenziFurnSelectDialogComponent } from '../comenzi-furn-select-dialog/comenzi-furn-select-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { toExistingComenziFurnizoriDTO } from 'src/app/comenzi-furn/comenzi-furn-item/comenzi-furn.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';

@Component({
    selector: 'app-comenzi-list',
    templateUrl: './comenzi-list.component.html',
    styleUrls: ['./comenzi-list.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: false
})
export class ComenziListComponent implements OnInit, OnDestroy {

  comenzi: comenziDTO[];
  expandedElement: comenziDTO[];
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
  @ViewChild(ClientiAutocompleteComponent)
  clientFilter!: ClientiAutocompleteComponent;
  @ViewChild(ArhitectiAutocompleteComponent)
  arhitectFilter!: ArhitectiAutocompleteComponent;
  @ViewChild(ProduseAutocompleteComponent)
  produsFilter!: ProduseAutocompleteComponent;
  @ViewChild(FurnizoriAutocompleteComponent)
  furnizorFilter!: FurnizoriAutocompleteComponent;

  constructor(private comenziService: ComenziService, private comenziFurnizorService: ComenziFurnizorService, private unsubscribeService: UnsubscribeService, 
    private router:Router, private formBuilder: FormBuilder, private exportService: ExportService, public cookie: CookieService,
    private dialog: MatDialog) { 
    this.comenzi = [];
    this.expandedElement = [];
  }
  columnsToDisplay= ['expand', 'numar', 'data', 'client', 'orasClient', 'arhitect', 'utilizator', 'avans', 'total', 'discount', 'valoare', 'comandate', 'platit', 'select', 'action'];

  ngOnInit(): void {
    let date: Date = new Date();
    date.setDate(date.getDate() - 180);
    this.form = this.formBuilder.group({
      fromDate: this.cookie.getCookie('comanda_fromDate')== '' ? formatDateFormData(date): this.cookie.getCookie('comanda_fromDate'),
      toDate: formatDateFormData(new Date()),
      numar: '',
      clientId: 0,
      arhitectId: 0,      
      produsId: 0,
      furnizorId:0,      
      mine: this.cookie.getCookie('comanda_mine')== '' ? false: this.cookie.getCookie('comanda_mine'),
      sucursala: this.cookie.getCookie('comanda_sucursala')== '' ? false: this.cookie.getCookie('comanda_sucursala'),
      allComandate: this.cookie.getCookie('comanda_allComandate')== '' ? false: this.cookie.getCookie('comanda_allComandate')
    });

    this.initialFormValues = this.form.value
    this.loadList(this.form.value);

    this.form.valueChanges
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(values=>{
      values.fromDate = formatDateFormData(values.fromDate);
      values.toDate = formatDateFormData(values.toDate);
      this.loadList(values);      
      //set cookies      
      this.cookie.setCookie({name: 'comanda_fromDate',value: values.fromDate, session: true});
      this.cookie.setCookie({name: 'comanda_mine',value: values.mine, session: true});
      this.cookie.setCookie({name: 'comanda_sucursala',value: values.sucursala, session: true});
      this.cookie.setCookie({name: 'comanda_allComandate',value: values.allComandate, session: true});
    })
  }

  loadList(values: any){
    values.page = this.currentPage;
    values.recordsPerPage = this.pageSize;
    this.comenziService.getAll(values).subscribe((response: HttpResponse<comenziDTO[]>)=>{
      this.comenzi = response.body??[];
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
    this.comenziService.delete(id)
    .subscribe(() => {
      this.loadList(this.form.value);
    }, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
    });
  } 

  expand(element: comenziDTO){
    var index = this.expandedElement.findIndex(f=>f.id == element.id);
    if(index == -1)
      this.expandedElement.push(element);
    else this.expandedElement.splice(index,1);    
  }

  togglePanel(){
    this.panelOpenState = !this.panelOpenState;
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
    const resuls = this.valideazaComandaFurnizor();    
    const comenziNeplatite = resuls[0];
    const selectedProd = resuls[1];
    const furnizorId = resuls[2];
    if(!comenziNeplatite && selectedProd.length == 0 && furnizorId == 0) return;
    
    if(comenziNeplatite){
      const dialogRef = this.dialog.open(OkCancelDialogComponent, {data:{title: 'Atentie!', message: "Ati selectat o comanda care nu este platita! Doriti sa continuati?"}});
      dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe((confirm) => {      
        if(confirm) this.genereazaComnada(selectedProd);
      });
    }
    else {
      this.genereazaComnada(selectedProd);
    }
  }

  genereazaComnada(selectedProd:any){
    this.comenziFurnizorService.fromComanda(selectedProd)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(id=>{
      this.router.navigate(['/comenziFurnizor/edit/' + id])
    }, 
    error=> this.errors = parseWebAPIErrors(error));
  }

  valideazaComandaFurnizor():[boolean, produseComandaDTO[], number] {
    var selectedProd: produseComandaDTO[] = [];
    var comenziNeplatite = false;
    var maiMultiFurnizori = false;
    var faraFurnizor = false;
    var furnizorId = 0;
    this.comenzi.forEach(element => {
      element.comenziProduses.forEach(prod=>{
        if(prod.addToComandaFurnizor && !prod.isInComandaFurnizor && !prod.isCategory && !prod.isStoc) 
          {            
            if(prod.furnizorId == null && prod.isCategory == false) 
            { 
              faraFurnizor = true;
            }
            else{
              selectedProd.push(prod);
              if(!element.platit) comenziNeplatite = true;
              
              if(furnizorId != prod.furnizorId && furnizorId > 0)  maiMultiFurnizori = true; 
              else furnizorId = prod.furnizorId;
            }
          }
      });      
    });

    if(faraFurnizor) 
    {       
      this.dialog.open(MessageDialogComponent, {data:{title: "Atentie!", message: "Unul dintre produse nu are furnizor!"}});
      return [false, [], 0];
    }
    if(maiMultiFurnizori) 
    { 
      this.dialog.open(MessageDialogComponent, {data:{title: "Atentie!", message: "Ati selectat produse de la mai multi furnizori!"}});
      return [false, [], 0];
    }
    if(selectedProd.length == 0){
      this.dialog.open(MessageDialogComponent, {data:{title: "Atentie!", message: "Nu ati selectat nici o comanda!"}});
      return [false, [], 0];
    }

    return [comenziNeplatite, selectedProd, furnizorId];
  }

  adaugaLaComandaFurnizor()
  {
    const resuls = this.valideazaComandaFurnizor();    
    const comenziNeplatite = resuls[0];
    const selectedProd = resuls[1];
    const furnizorId = resuls[2];
    if(!comenziNeplatite && selectedProd.length == 0 && furnizorId == 0) return;
    
    if(comenziNeplatite){
      const dialogRef = this.dialog.open(OkCancelDialogComponent, {data:{title: 'Atentie!', message: "Ati selectat o comanda care nu este platita! Doriti sa continuati?"}});
      dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe((confirm) => {      
        if(confirm) this.adaugaLaComnada(selectedProd, furnizorId);
      }); 
    }
    else {
      this.adaugaLaComnada(selectedProd, furnizorId);
    }
  }

  adaugaLaComnada(selectedProd:any, furnizorId: number){    
    const dialogRef = this.dialog.open(ComenziFurnSelectDialogComponent,      
      { data:{ furnizorId : furnizorId}, width: '450px', height: '400px' });

    dialogRef.afterClosed()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((data) => {      
      if (data.clicked === 'submit') {
        var comandaFurnizorId = data.form.comandaFurnId;

        const paramObject: toExistingComenziFurnizoriDTO = {
          comandaFurnizorId: comandaFurnizorId,
          comenziProduse: selectedProd
        };
        
        if(selectedProd.length > 0){
          this.comenziFurnizorService.addToExisting(paramObject)
          .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
          .subscribe(()=>{
            this.router.navigate(['/comenziFurnizor/edit/' + comandaFurnizorId])
          }, 
          error=> this.errors = parseWebAPIErrors(error));
        }
        else this.errors.push("Nu ati selectat nici o comanda!");
      }      
    });
    
    
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
    console.log('produsId: ', this.form.get('produsId')?.value);
 }

 selectClient(clientId: string){
    this.form.get('clientId')?.setValue(clientId??0);
    console.log('clientNume: ', this.form.get('clientId')?.value);
  }

  selectArhitect(arhitect: any){
    this.form.get('arhitectId')?.setValue(arhitect == undefined ? 0 : arhitect.id);
  }
  selectFurnizor(furnizor: any){
    this.form.get('furnizorId')?.setValue(furnizor == undefined ? 0 : furnizor?.id);
    console.log('furnizorId: ', this.form.get('furnizorId')?.value);
  }
 //#endregion
 genereazaExcel(element:any)
 {
   this.loading$ = true;
   this.exportService.comandaReport(element.id)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
   .subscribe(blob => {
     const dt = new Date(element.data)
     saveAs(blob, 'Comanda ' + element.client + ' ' + dt.toLocaleDateString() + '.xlsx');
     this.loading$ = false;
   }, error => {
     console.log("Something went wrong");
   });
 }
 genereazaPDF(element:any)
  {    
    this.loading$ = true;
    this.exportService.comandaReportPDF(element.id)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(blob => {
      //var fileURL = window.URL.createObjectURL(blob);
      this.loading$ = false;
      const dt = new Date(element.data)
      saveAs(blob, 'Comanda ' + element.client + ' ' + dt.toLocaleDateString()+'.pdf');
      //window.open(fileURL, "_blank");
    }, error => {
      console.log("Something went wrong");
    });
  }

  ngOnDestroy(): void {}

}
