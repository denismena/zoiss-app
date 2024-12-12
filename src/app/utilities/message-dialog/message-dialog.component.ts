import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-message-dialog',
  imports: [MatDialogActions, MatDialogContent, MatButton, MatIcon],
  templateUrl: './message-dialog.component.html',
  styleUrl: './message-dialog.component.scss'
})
export class MessageDialogComponent {

  defaultTitle = 'Confirmare'; // Default title
  defaultMessage = 'Sunteti siguri ca doriti sa stergeti inregistrarea?'; // Default message
  defaultOkButtonText = 'Renunta'; // Default OK button text

  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
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
}
