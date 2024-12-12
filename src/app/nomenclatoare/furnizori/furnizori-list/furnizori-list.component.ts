import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { furnizoriDTO } from '../furnizori-item/furnizori.model';
import { FurnizoriService } from '../furnizori.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';

@Component({
    selector: 'app-furnizori-list',
    templateUrl: './furnizori-list.component.html',
    styleUrls: ['./furnizori-list.component.scss'],
    standalone: false
})
export class FurnizoriListComponent implements OnInit, OnDestroy {

  furnizori: furnizoriDTO[];
  errors: string[] = [];
  loading$: boolean = true;
  public form!: FormGroup;
  totalRecords:number = 0;
  currentPage:number = 1;
  pageSize: number = 100;
  initialFormValues: any;
  panelOpenState = false;
  constructor(private furnizoriService: FurnizoriService, private formBuilder:FormBuilder, private unsubscribeService: UnsubscribeService, private dialog: MatDialog) { 
    this.furnizori = [];
  }

  columnsToDisplay= ['nume', 'oras', 'judet', 'tara', 'adresa', 'tel', 'email', 'action'];

  ngOnInit(): void {
    this.form = this.formBuilder.group({            
      nume: '',
      //oras: '',
      judet: '',
      tara: '',      
      active: 0
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
    this.furnizoriService.getAll(values)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((response: HttpResponse<furnizoriDTO[]>)=>{
      this.furnizori = response.body??[];
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
    this.furnizoriService.delete(id)
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
