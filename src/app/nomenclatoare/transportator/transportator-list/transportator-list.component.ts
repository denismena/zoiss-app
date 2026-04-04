import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { transportatorDTO } from '../transportator-item/transportator.model';
import { TransporatorService } from '../transportator.service';
import { MatDialog } from '@angular/material/dialog';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';
import { Subject } from 'rxjs';
import { catchError, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-transportator-list',
    templateUrl: './transportator-list.component.html',
    styleUrls: ['./transportator-list.component.scss'],
    standalone: false
})
export class TransportatorListComponent {

  errors: string[] = [];
  private refresh$ = new Subject<void>();
  private destroyRef = inject(DestroyRef);
  private transporatorService = inject(TransporatorService);
  private dialog = inject(MatDialog);

  transportator$ = this.refresh$.pipe(
    startWith(void 0),
    switchMap(() => this.transporatorService.getAll().pipe(
      catchError(error => {
        this.errors = parseWebAPIErrors(error);
        return of([] as transportatorDTO[]);
      }),
      shareReplay(1)
    ))
  );

  columnsToDisplay = ['nume', 'nrInmatriculare', 'adresa', 'tel', 'email', 'active', 'action'];

  delete(id: number){
    const dialogRef = this.dialog.open(OkCancelDialogComponent, {data:{}});
    dialogRef.afterClosed()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((confirm) => {      
      if(confirm) this.deleteComanda(id);
    });
  }

  private deleteComanda(id: number){
    this.transporatorService.delete(id)
    .subscribe({
      next: () => this.refresh$.next(),
      error: error => {
        this.errors = parseWebAPIErrors(error);
        this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
      }
    });
  }
}
