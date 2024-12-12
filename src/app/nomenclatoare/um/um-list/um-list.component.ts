import { Component, OnDestroy, OnInit } from '@angular/core';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { umDTO } from '../um-item/um.model';
import { UMService } from '../um.service';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { MatDialog } from '@angular/material/dialog';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';

@Component({
    selector: 'app-um-list',
    templateUrl: './um-list.component.html',
    styleUrls: ['./um-list.component.scss'],
    standalone: false
})
export class UmListComponent implements OnInit, OnDestroy {

  um: umDTO[] = [];
  columnsToDisplay= ['nume', 'action'];
  errors: string[] = [];
  loading$: boolean = true;
  constructor(private umService: UMService, private unsubscribeService: UnsubscribeService, private dialog: MatDialog) { }

  ngOnInit(): void {    
    this.loadList();
  }

  loadList(){
    this.umService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(um=>{
      this.um = um;
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
    this.umService.delete(id)
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
    });
  }


  ngOnDestroy(): void {}
}
