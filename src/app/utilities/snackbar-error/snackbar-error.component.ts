import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
    selector: 'app-snackbar-error',
    templateUrl: './snackbar-error.component.html',
    styleUrls: ['./snackbar-error.component.scss'],
    standalone: false
})
export class SnackbarErrorComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { errors: string[] },
    private snackBarRef: MatSnackBarRef<SnackbarErrorComponent>
  ) {}

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
