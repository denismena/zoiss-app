import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import saveAs from 'file-saver';
import { ClientiAutocompleteComponent } from 'src/app/nomenclatoare/clienti/clienti-autocomplete/clienti-autocomplete.component';
import { FurnizoriAutocompleteComponent } from 'src/app/nomenclatoare/furnizori/furnizori-autocomplete/furnizori-autocomplete.component';
import { ProduseAutocompleteComponent } from 'src/app/nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';
import { CookieService } from 'src/app/utilities/cookie.service';
import { ExportService } from 'src/app/utilities/export.service';
import { formatDateFormData, parseWebAPIErrors } from 'src/app/utilities/utils';
import { LivrariDTO } from '../livrari-item/livrari.model';
import { LivrariService } from '../livrari.service';
import { MatDialog } from '@angular/material/dialog';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';

@Component({
    selector: 'app-livrari-list',
    templateUrl: './livrari-list.component.html',
    styleUrls: ['./livrari-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: false
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
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  constructor(private livrariService: LivrariService,
    private formBuilder:FormBuilder, private exportService: ExportService, public cookie: CookieService, private dialog: MatDialog) { }

  columnsToDisplay= ['expand', 'numar', 'data', 'client', 'curier', 'receptionatDe', 'detalii', 'utilizator', 'livrate', 'action'];

  ngOnInit(): void {
    let date: Date = new Date();
    date.setDate(date.getDate() - 30);

    this.form = this.formBuilder.group({
      fromDate: this.cookie.getCookie('livrare_FromDate')== '' ? formatDateFormData(date): this.cookie.getCookie('livrare_FromDate'),
      toDate: formatDateFormData(new Date()),
      clientId: 0,      
      produsId: 0,
      furnizorId:0,
      mine: this.cookie.getCookie('livrare_mine')== '' ? false: this.cookie.getCookie('livrare_mine'),
      allLivrate: this.cookie.getCookie('livrare_allLivrate')== '' ? false: this.cookie.getCookie('livrare_allLivrate'),
    });

    this.initialFormValues = this.form.value
    this.loadList(this.form.value);

    this.form.valueChanges.subscribe(values=>{
      values.fromDate = formatDateFormData(values.fromDate);
      values.toDate = formatDateFormData(values.toDate);
      this.loadList(values);      
      //set cookies      
      this.cookie.setCookie({name: 'livrare_FromDate',value: values.fromDate, session: true});
      this.cookie.setCookie({name: 'livrare_mine',value: values.mine, session: true});
      this.cookie.setCookie({name: 'livrare_allLivrate',value: values.allLivrate, session: true});
    })
  }

  loadList(values: any){
    values.page = this.currentPage;
    values.recordsPerPage = this.pageSize;
    this.livrariService.getAll(values)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((response: HttpResponse<LivrariDTO[]>)=>{
      this.livrari = response.body??[];
      this.totalRecords = Number(response.headers.get("totalRecords"));
      this.loading$ = false;
      this.cdr.markForCheck();
    }, error => {
      this.errors = parseWebAPIErrors(error);      
      this.loading$ = false;
      this.cdr.markForCheck();
    });    
  }

  delete(id: number){
    const dialogRef = this.dialog.open(OkCancelDialogComponent, {data:{}});
    dialogRef.afterClosed()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((confirm) => {      
      if(confirm) this.deleteComanda(id);
    });
  }

  private deleteComanda(id: number){
    this.livrariService.delete(id)
    .subscribe(() => {
      this.loadList(this.form.value);
    }, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
      this.cdr.markForCheck();
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
    this.exportService.aimPDF(element.id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(blob => {
      this.loading$ = false;
      const dt = new Date(element.data)
      saveAs(blob, 'AIM ' + element.client + ' ' + dt.toLocaleDateString()+'.pdf');
      this.cdr.markForCheck();
    }, error => {
      this.loading$ = false;
      this.cdr.markForCheck();
    });
  }

  //#region filtre
  selectProdus(produs: any){    
    this.form.get('produsId')?.setValue(produs.id);
    this.form.get('produsNume')?.setValue(produs.nume);    
 }

 selectClient(clientId: string){
    this.form.get('clientId')?.setValue(clientId);
  }

  selectArhitect(arhitectId: string){
    this.form.get('arhitectId')?.setValue(arhitectId);
  }
  selectFurnizor(furnizor: any){
    this.form.get('furnizorId')?.setValue(furnizor.id);
  }
 //#endregion

}
