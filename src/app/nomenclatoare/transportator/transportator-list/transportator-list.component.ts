import { Component, OnDestroy, OnInit } from '@angular/core';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { transportatorDTO } from '../transportator-item/transportator.model';
import { TransporatorService } from '../transportator.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';

@Component({
    selector: 'app-transportator-list',
    templateUrl: './transportator-list.component.html',
    styleUrls: ['./transportator-list.component.scss'],
    standalone: false
})
export class TransportatorListComponent implements OnInit, OnDestroy {

  transportator: transportatorDTO[];
  errors: string[] = [];
  loading$: boolean = true;
  constructor(private transporatorService: TransporatorService, private unsubscribeService: UnsubscribeService, private dialog: MatDialog) { 
    this.transportator = [];
  }

  columnsToDisplay= ['nume', 'nrInmatriculare', 'adresa', 'tel', 'email', 'active', 'action'];

  ngOnInit(): void {
    this.loadList();
  }
  loadList(){
    this.transporatorService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(transportator=>{
      this.transportator = transportator;
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
    this.transporatorService.delete(id)
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
    });
  }

  ngOnDestroy(): void {}
}
