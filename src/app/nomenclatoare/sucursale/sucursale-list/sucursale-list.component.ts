import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';
import { SucursaleService } from '../sucursala.service';
import { sucursalaDTO } from '../sucursale-item/sucursala.model';
import { Subject } from 'rxjs';
import { catchError, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-sucursale-list',
    templateUrl: './sucursale-list.component.html',
    styleUrls: ['./sucursale-list.component.scss'],
    standalone: false
})
export class SucursaleListComponent {

  columnsToDisplay = ['nume', 'action'];
  errors: string[] = [];
  private refresh$ = new Subject<void>();
  private destroyRef = inject(DestroyRef);
  private sucursalaService = inject(SucursaleService);
  private dialog = inject(MatDialog);

  sucursala$ = this.refresh$.pipe(
    startWith(void 0),
    switchMap(() => this.sucursalaService.getAll().pipe(
      catchError(error => {
        this.errors = parseWebAPIErrors(error);
        return of([] as sucursalaDTO[]);
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
    this.sucursalaService.delete(id)
    .subscribe({
      next: () => this.refresh$.next(),
      error: error => {
        this.errors = parseWebAPIErrors(error);
        this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
      }
    });
  }

}
