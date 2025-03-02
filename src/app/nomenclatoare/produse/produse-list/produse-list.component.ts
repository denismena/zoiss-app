import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { takeUntil } from 'rxjs/operators';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { umDTO } from '../../um/um-item/um.model';
import { UMService } from '../../um/um.service';
import { produseDTO } from '../produse-item/produse.model';
import { ProduseService } from '../produse.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { MatDialog } from '@angular/material/dialog';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';

@Component({
    selector: 'app-produse-list',
    templateUrl: './produse-list.component.html',
    styleUrls: ['./produse-list.component.scss'],
    standalone: false
})
export class ProduseListComponent implements OnInit, OnDestroy {

  produse: produseDTO[];
  errors: string[] = [];
  loading$: boolean = true;
  public form!: FormGroup;
  umList: umDTO[]=[];
  totalRecords:number = 0;
  currentPage:number = 1;
  pageSize: number = 100;
  initialFormValues: any;
  panelOpenState = false;
  constructor(private produseService: ProduseService, private formBuilder:FormBuilder, private umService: UMService, private dialog: MatDialog, 
    private unsubscribeService: UnsubscribeService) {  
    this.produse = [];
  }
  
  columnsToDisplay= ['cod', 'nume', 'stoc', 'perCutie', 'pret', 'um', 'action'];

  ngOnInit(): void {  
    this.form = this.formBuilder.group({            
      nume: '',
      cod: '',
      stoc: 0,      
      active: 0,
      umId:0,
    });  

    this.initialFormValues = this.form.value
    this.loadList(this.form.value);

    this.umService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(um=>{
      this.umList=um;
    })

    this.form.valueChanges
    .pipe(debounceTime(1000))
    .subscribe(values => {
      this.loadList(values);
    });
  }

  loadList(values: any){
    values.page = this.currentPage;
    values.recordsPerPage = this.pageSize;
    this.produseService.getAll(values)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((response: HttpResponse<produseDTO[]>)=>{
      this.produse = response.body??[];      
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
    this.produseService.delete(id)
    .subscribe(() => {
      this.loadList(this.form.value);
    }, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
    });
  }

  togglePanel(){
    this.panelOpenState = !this.panelOpenState;
  }

  clearForm(){
    this.form.patchValue(this.initialFormValues);    
  }

  updatePagination(event: PageEvent){
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadList(this.form.value);
  }

  ngOnDestroy(): void {}

}
