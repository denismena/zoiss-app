import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { arhitectiDTO } from '../arhitecti-item/arhitecti.model';
import { ArhitectiService } from '../arhitecti.service';
import { MatDialog } from '@angular/material/dialog';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';
import { Subject } from 'rxjs';
import { catchError, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-arhitecti-list',
    templateUrl: './arhitecti-list.component.html',
    styleUrls: ['./arhitecti-list.component.scss'],
    standalone: false
})
export class ArhitectiListComponent {

  errors: string[] = [];
  private refresh$ = new Subject<void>();
  private destroyRef = inject(DestroyRef);
  private arhitectiService = inject(ArhitectiService);
  private dialog = inject(MatDialog);

  arhitecti$ = this.refresh$.pipe(
    startWith(void 0),
    switchMap(() => this.arhitectiService.getAll().pipe(
      catchError(error => {
        this.errors = parseWebAPIErrors(error);
        return of([] as arhitectiDTO[]);
      }),
      shareReplay(1)
    ))
  );

  columnsToDisplay = ['nume', 'adresa', 'tel', 'email', 'comision', 'action'];

  delete(id: number){
    const dialogRef = this.dialog.open(OkCancelDialogComponent, {data:{}});
    dialogRef.afterClosed()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((confirm) => {      
      if(confirm) this.deleteComanda(id);
    });
  }

  private deleteComanda(id: number){
    this.arhitectiService.delete(id)
    .subscribe(() => {
      this.refresh$.next();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
    });
  }
}
