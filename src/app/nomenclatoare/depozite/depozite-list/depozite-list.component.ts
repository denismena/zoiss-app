import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { depoziteDTO } from '../depozite-item/depozite.model';
import { DepoziteService } from '../depozite.service';
import { MatDialog } from '@angular/material/dialog';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';
import { Subject } from 'rxjs';
import { catchError, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-depozite-list',
    templateUrl: './depozite-list.component.html',
    styleUrls: ['./depozite-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DepoziteListComponent {

  errors: string[] = [];
  private refresh$ = new Subject<void>();
  private destroyRef = inject(DestroyRef);
  private depoziteService = inject(DepoziteService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  depozite$ = this.refresh$.pipe(
    startWith(void 0),
    switchMap(() => this.depoziteService.getAll().pipe(
      catchError(error => {
        this.errors = parseWebAPIErrors(error);
        this.cdr.markForCheck();
        return of([] as depoziteDTO[]);
      }),
      shareReplay(1)
    ))
  );

  columnsToDisplay = ['nume', 'adresa', 'persoanaContact', 'persoanaContactTel', 'persoanaContactEmail', 'sort', 'parent', 'active', 'action'];

  delete(id: number){
    const dialogRef = this.dialog.open(OkCancelDialogComponent, {data:{}});
    dialogRef.afterClosed()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((confirm) => {      
      if(confirm) this.deleteComanda(id);
    });
  }

  private deleteComanda(id: number){
    this.depoziteService.delete(id)
    .subscribe({
      next: () => this.refresh$.next(),
      error: error => {
        this.errors = parseWebAPIErrors(error);
        this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
        this.cdr.markForCheck();
      }
    });
  }
}
