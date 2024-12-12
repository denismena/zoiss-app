import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { clientiDTO } from '../clienti-item/clienti.model';
import { ClientiService } from '../clienti.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';

@Component({
    selector: 'app-clienti-list',
    templateUrl: './clienti-list.component.html',
    styleUrls: ['./clienti-list.component.scss'],
    standalone: false
})
export class ClientiListComponent implements OnInit, OnDestroy {

  clienti: clientiDTO[];
  errors: string[] = [];
  loading$: boolean = true;
  public form!: FormGroup;
  totalRecords:number = 0;
  currentPage:number = 1;
  pageSize: number = 100;
  initialFormValues: any;
  panelOpenState = false;
  constructor(private clientiService: ClientiService, private formBuilder:FormBuilder, private unsubscribeService: UnsubscribeService, private dialog: MatDialog) { 
    this.clienti = [];
  }
  columnsToDisplay= ['nume', 'pfPj', 'cuicnp', 'registruComert', 'action'];
  ngOnInit(): void {

    this.form = this.formBuilder.group({            
      nume: '',
      pfPj: '',
      cuicnp: '',
      registruComert: '',      
      active: 0,
      faraAdresa: false
    });  

    this.initialFormValues = this.form.value
    this.loadList(this.form.value);
    this.form.valueChanges.subscribe(values=>{
      this.loadList(values);      
    })
  }

  loadList(values:any){
    values.page = this.currentPage;
    values.recordsPerPage = this.pageSize;
    this.clientiService.getAll(values)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((response: HttpResponse<clientiDTO[]>)=>{
      this.clienti = response.body??[];
      this.totalRecords = Number(response.headers.get("totalrecords"));
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
    this.clientiService.delete(id)
    .subscribe(() => {
      this.loadList(this.form.value);
    }, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
    });
  }

  clearForm(){
    this.form.patchValue(this.initialFormValues);    
  }

  updatePagination(event: PageEvent){
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadList(this.form.value);
  }
  togglePanel(){
    this.panelOpenState = !this.panelOpenState;
  }

  ngOnDestroy(): void {}
  
}
