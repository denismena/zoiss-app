import { Component, OnDestroy, OnInit } from '@angular/core';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { arhitectiDTO } from '../arhitecti-item/arhitecti.model';
import { ArhitectiService } from '../arhitecti.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';

@Component({
    selector: 'app-arhitecti-list',
    templateUrl: './arhitecti-list.component.html',
    styleUrls: ['./arhitecti-list.component.scss'],
    standalone: false
})
export class ArhitectiListComponent implements OnInit, OnDestroy {

  arhitecti: arhitectiDTO[];
  errors: string[] = [];
  loading$: boolean = true;
  constructor(private arhitectiService: ArhitectiService, private unsubscribeService: UnsubscribeService, public dialog: MatDialog) { 
    this.arhitecti = [];
  }

  columnsToDisplay= ['nume', 'adresa', 'tel', 'email', 'comision', 'action'];

  ngOnInit(): void {
    this.loadList();
  }
  loadList(){
    this.arhitectiService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))    
    .subscribe(arhitecti=>{
      this.arhitecti = arhitecti;
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
    this.arhitectiService.delete(id)
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
    });
  }

  ngOnDestroy(): void {}

}
