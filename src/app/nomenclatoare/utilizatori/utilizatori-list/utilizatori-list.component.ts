import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { UtilizatoriDTO } from 'src/app/security/security.models';
import { SecurityService } from 'src/app/security/security.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
    selector: 'app-utilizatori-list',
    templateUrl: './utilizatori-list.component.html',
    styleUrls: ['./utilizatori-list.component.scss'],
    standalone: false
})
export class UtilizatoriListComponent implements OnInit, OnDestroy {

  utilizatori: UtilizatoriDTO[];
  errors: string[] = [];
  constructor(private securitySevice: SecurityService, private unsubscribeService: UnsubscribeService, private dialog: MatDialog) { 
    this.utilizatori = [];
  }
  columnsToDisplay= ['nume', 'email', 'tel', 'sucursala', 'action'];
  ngOnInit(): void {
    this.loadList();
  }
  loadList(){
    this.securitySevice.getUsers()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(utilizatori=>{
      this.utilizatori = utilizatori;
    },
    error => this.errors = parseWebAPIErrors(error));    
  }

  changeStatus(user: UtilizatoriDTO){
    const dialogRef = this.dialog.open(OkCancelDialogComponent, {data:{title: "Confirmare", message: `Doriti sa ${user.active ? 'dezactivati' : 'activati'} utilizatorul ${user.name}?`}});
    dialogRef.afterClosed()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((confirm) => {      
      if(confirm) this.changeUserStatus(user);
    });
  }

  private changeUserStatus(user: UtilizatoriDTO){
    this.securitySevice.changeStatus(user.id, !user.active)
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
    });
  }

  ngOnDestroy(): void {}
}
