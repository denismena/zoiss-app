import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarErrorComponent } from './snackbar-error/snackbar-error.component';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private snackBar: MatSnackBar) {}

  showErrors(errors: string[]): void {
    if (!errors || errors.length === 0) return;
    this.snackBar.openFromComponent(SnackbarErrorComponent, {
      data: { errors },
      duration: 6000,
      panelClass: 'error-snackbar',
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: 'success-snackbar',
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
