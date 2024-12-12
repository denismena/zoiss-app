import { Component, OnDestroy, OnInit } from '@angular/core';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { depoziteDTO } from '../depozite-item/depozite.model';
import { DepoziteService } from '../depozite.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';

@Component({
    selector: 'app-depozite-list',
    templateUrl: './depozite-list.component.html',
    styleUrls: ['./depozite-list.component.scss'],
    standalone: false
})
export class DepoziteListComponent implements OnInit, OnDestroy {

  errors: string[] = [];
  depozite: depoziteDTO[];
  loading$: boolean = true;
  constructor(private depoziteService: DepoziteService, private unsubscribeService: UnsubscribeService, private dialog: MatDialog) { 
    this.depozite = [];
  }

  columnsToDisplay= ['nume', 'adresa', 'persoanaContact', 'persoanaContactTel', 'persoanaContactEmail', 'sort', 'parent', 'active', 'action'];

  ngOnInit(): void {
    this.loadList();
  }
  loadList(){
    this.depoziteService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(depozit=>{
      this.depozite = depozit;
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
    this.depoziteService.delete(id)
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
    });
  }

  ngOnDestroy(): void {}

}
