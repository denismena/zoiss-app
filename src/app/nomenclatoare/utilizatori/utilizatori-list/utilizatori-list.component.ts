import { Component, DestroyRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UtilizatoriDTO } from 'src/app/security/security.models';
import { SecurityService } from 'src/app/security/security.service';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { Subject } from 'rxjs';
import { catchError, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-utilizatori-list',
    templateUrl: './utilizatori-list.component.html',
    styleUrls: ['./utilizatori-list.component.scss'],
    standalone: false
})
export class UtilizatoriListComponent {

  errors: string[] = [];
  private refresh$ = new Subject<void>();
  private destroyRef = inject(DestroyRef);
  private securitySevice = inject(SecurityService);
  private dialog = inject(MatDialog);

  utilizatori$ = this.refresh$.pipe(
    startWith(void 0),
    switchMap(() => this.securitySevice.getUsers().pipe(
      catchError(error => {
        this.errors = parseWebAPIErrors(error);
        return of([] as UtilizatoriDTO[]);
      }),
      shareReplay(1)
    ))
  );

  columnsToDisplay = ['nume', 'email', 'tel', 'sucursala', 'action'];

  changeStatus(user: UtilizatoriDTO){
    const dialogRef = this.dialog.open(OkCancelDialogComponent, {data:{title: "Confirmare", message: `Doriti sa ${user.active ? 'dezactivati' : 'activati'} utilizatorul ${user.name}?`}});
    dialogRef.afterClosed()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((confirm) => {      
      if(confirm) this.changeUserStatus(user);
    });
  }

  private changeUserStatus(user: UtilizatoriDTO){
    this.securitySevice.changeStatus(user.id, !user.active)
    .subscribe({
      next: () => this.refresh$.next(),
      error: error => {
        this.errors = parseWebAPIErrors(error);
        this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
      }
    });
  }
}
