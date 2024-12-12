import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-ok-cancel-dialog',
  imports: [MatDialogActions, MatDialogContent, MatButton, MatIcon],
  templateUrl: './ok-cancel-dialog.component.html',
  styleUrl: './ok-cancel-dialog.component.scss'
})
export class OkCancelDialogComponent {  
  defaultTitle = 'Confirmare'; // Default title
  defaultMessage = 'Sunteti siguri ca doriti sa stergeti inregistrarea?'; // Default message
  defaultOkButtonText = 'Da'; // Default OK button text
  defaultCancelButtonText = 'Renunta'; // Default Cancel

  constructor(
    public dialogRef: MatDialogRef<OkCancelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; message?: string; okButtonText?: string; cancelButtonText?: string }
  ) {}

  ngOnInit(): void {
    if (this.data.title) {
      this.defaultTitle = this.data.title;
    }
    if (this.data.message) {
      this.defaultMessage = this.data.message;
    }
    if (this.data.okButtonText) {
      this.defaultOkButtonText = this.data.okButtonText;
    }
    if (this.data.cancelButtonText) {
      this.defaultCancelButtonText = this.data.cancelButtonText;
    }
  }

  ok() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }

}

export interface OkCancelDialogData {
  title?: string;
  message?: string;
  okButtonText?: string;
  cancelButtonText?: string;
}
