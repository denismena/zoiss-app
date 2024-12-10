import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { notificariDTO } from '../notificari.model';

@Component({
    selector: 'app-notificari-item',
    templateUrl: './notificari-item.component.html',
    styleUrls: ['./notificari-item.component.scss'],
    standalone: false
})
export class NotificariItemComponent implements OnInit {

  notif: notificariDTO;
  constructor(@Inject(MAT_DIALOG_DATA) data: { item: any },
  public dialogRef: MatDialogRef<NotificariItemComponent>) { 
    this.notif = data?.item;
    console.log('notif:', data);
  }

  ngOnInit(): void {
    console.log('notif2:', this.notif);
  }
  submit() {    
    this.dialogRef.close({
      clicked: 'submit'
    });
  }
}
