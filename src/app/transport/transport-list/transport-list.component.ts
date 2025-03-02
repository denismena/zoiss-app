import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { LivrariService } from 'src/app/livrari/livrari.service';
import { ClientiAutocompleteComponent } from 'src/app/nomenclatoare/clienti/clienti-autocomplete/clienti-autocomplete.component';
import { depoziteDTO } from 'src/app/nomenclatoare/depozite/depozite-item/depozite.model';
import { DepoziteService } from 'src/app/nomenclatoare/depozite/depozite.service';
import { FurnizoriAutocompleteComponent } from 'src/app/nomenclatoare/furnizori/furnizori-autocomplete/furnizori-autocomplete.component';
import { ProduseAutocompleteComponent } from 'src/app/nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';
import { CookieService } from 'src/app/utilities/cookie.service';
import { formatDateFormData, parseWebAPIErrors } from 'src/app/utilities/utils';
import { LivrariNumberDialogComponent } from '../livrari-number-dialog/livrari-number-dialog.component';
import { transportDTO, transportProduseDTO } from '../transport-item/transport.model';
import { TransportService } from '../transport.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';

@Component({
    selector: 'app-transport-list',
    templateUrl: './transport-list.component.html',
    styleUrls: ['./transport-list.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: false
})
export class TransportListComponent implements OnInit, OnDestroy {

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
  loading$: boolean = true;
  @ViewChild(ClientiAutocompleteComponent) clientFilter!: ClientiAutocompleteComponent;  
  @ViewChild(ProduseAutocompleteComponent) produsFilter!: ProduseAutocompleteComponent;
  @ViewChild(FurnizoriAutocompleteComponent) furnizorFilter!: FurnizoriAutocompleteComponent;
  
  constructor(private transporService: TransportService, private livrariService: LivrariService, private router:Router, private unsubscribeService: UnsubscribeService,
    public dialog: MatDialog, private formBuilder:FormBuilder, private depoziteService: DepoziteService, public cookie: CookieService) { 
    this.transport = [];
    this.expandedElement = [];
  }

  columnsToDisplay= ['expand','referinta', 'data', 'transportator', 'detalii', 'utilizator', 'livrate', 'select', 'action'];

  ngOnInit(): void {

    let date: Date = new Date();
    date.setDate(date.getDate() - 30);

    this.form = this.formBuilder.group({
      fromDate: this.cookie.getCookie('transport_fromDate')== '' ? formatDateFormData(date): this.cookie.getCookie('transport_fromDate'),
      toDate: formatDateFormData(new Date()),      
      clientId: 0,      
      produsId: 0,
      furnizorId:0,
      mine: this.cookie.getCookie('transport_mine')== '' ? false: this.cookie.getCookie('transport_mine'),
      allSpreLivrare: this.cookie.getCookie('transport_allSpreLivrare')== '' ? false: this.cookie.getCookie('transport_allSpreLivrare'),
      depozitId:0,
      comandaNr:['', {validators:[RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber, allowDecimal:false })]}],
    });

    this.initialFormValues = this.form.value
    this.loadList(this.form.value);
    
    this.form.valueChanges.subscribe(values=>{
      values.fromDate = formatDateFormData(values.fromDate);
      values.toDate = formatDateFormData(values.toDate);
      values.comandaNr = values.comandaNr == null ? '' : values.comandaNr;
      this.loadList(values);      
      //set cookies      
      this.cookie.setCookie({name: 'transport_fromDate',value: values.fromDate, session: true});
      this.cookie.setCookie({name: 'transport_mine',value: values.mine, session: true});
      this.cookie.setCookie({name: 'transport_allSpreLivrare',value: values.allSpreLivrare, session: true});
    })

    this.depoziteService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(dep=>{this.depozitList=dep;});
  }

  loadList(values: any){
    values.page = this.currentPage;
    values.recordsPerPage = this.pageSize;
    this.transporService.getAll(values)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe((response: HttpResponse<transportDTO[]>)=>{
      this.transport = response.body??[];
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
    this.transporService.delete(id)
    .subscribe(() => {
      this.loadList(this.form.value);
    }, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
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
              if(prod.addToLivrare && !prod.livrat && prod.livrabil)
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
      this.dialog.open(MessageDialogComponent, {data:{title: "Atentie!", message: "Ati selectat produse de la mai multi clienti!"}});
      return;
    }
    if(selectedProd.length == 0){
      this.dialog.open(MessageDialogComponent, {data:{title: "Atentie!", message: "Nu ati selectat nici un produs!"}});
      return;
    }

    const dialogRef = this.dialog.open(LivrariNumberDialogComponent,      
      { data:{ }, width: '400px', height: '300px' });

    dialogRef.afterClosed()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((data) => {      
      if (data.clicked === 'submit') {
        var numar = data.form.numar;

        if(selectedProd.length > 0){
          this.livrariService.fromTransport(numar, selectedProd)
          .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
          .subscribe(id=>{
            this.router.navigate(['/livrari/edit/' + id])
          }, 
          error=> this.errors = parseWebAPIErrors(error));
        }
        else this.errors.push("Nu ati selectat nici o comanda!");
      }      
    });
  }
  togglePanel(){
    this.panelOpenState = !this.panelOpenState;
  }
  getCheckbox(checkbox: any, row: transportDTO){
    this.checked = [];
    console.log(row);
    row.transportProduse.forEach(p=>p.addToLivrare = p.livrabil ? checkbox.checked : false
    );    
  }

  isAllSelected(row: transportDTO) {
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

  ngOnDestroy(): void {
  }

}
