import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { umDTO } from '../um-item/um.model';
import { UMService } from '../um.service';
import { MatDialog } from '@angular/material/dialog';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';
import { Subject } from 'rxjs';
import { catchError, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-um-list',
    templateUrl: './um-list.component.html',
    styleUrls: ['./um-list.component.scss'],
    standalone: false
})
export class UmListComponent {

  columnsToDisplay = ['nume', 'action'];
  errors: string[] = [];
  private refresh$ = new Subject<void>();
  private destroyRef = inject(DestroyRef);
  private umService = inject(UMService);
  private dialog = inject(MatDialog);

  um$ = this.refresh$.pipe(
    startWith(void 0),
    switchMap(() => this.umService.getAll().pipe(
      catchError(error => {
        this.errors = parseWebAPIErrors(error);
        return of([] as umDTO[]);
      }),
      shareReplay(1)
    ))
  );

  delete(id: number){
    const dialogRef = this.dialog.open(OkCancelDialogComponent, {data:{}});
    dialogRef.afterClosed()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((confirm) => {      
      if(confirm) this.deleteComanda(id);
    });
  }

  private deleteComanda(id: number){
    this.umService.delete(id)
    .subscribe({
      next: () => this.refresh$.next(),
      error: error => {
        this.errors = parseWebAPIErrors(error);
        this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
      }
    });
  }
}
