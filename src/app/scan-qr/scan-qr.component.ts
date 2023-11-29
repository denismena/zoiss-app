import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProduseCreateDialogComponent } from '../nomenclatoare/produse/produse-item/produse-create-dialog/produse-create-dialog.component';
import { produseDTO } from '../nomenclatoare/produse/produse-item/produse.model';
import { ProduseService } from '../nomenclatoare/produse/produse.service';
import { UnsubscribeService } from '../unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.component.html',
  styleUrls: ['./scan-qr.component.scss']
})
export class ScanQRComponent implements OnInit, OnDestroy {

  produsToDisplay: produseDTO | undefined;
  constructor(private produseService: ProduseService, public dialog: MatDialog, private unsubscribeService: UnsubscribeService) { }

  ngOnInit(): void {
  }
  onCodeResult(resultString: string) {    
      this.produseService.searchByQR(resultString)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(produs => {
        this.produsToDisplay = produs;
      });    
  }
  edit(){
    if(this.produsToDisplay == undefined)  return; 
    const dialogRef = this.dialog.open(ProduseCreateDialogComponent,      
      { data:{produs: this.produsToDisplay, editId: this.produsToDisplay?.id??0}, width: '800px', height: '750px' });
      
      dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe((data) => {      
        if (data.clicked === 'submit') {
          this.produsToDisplay = data.form;          
        }
      });       
  }

  ngOnDestroy(): void {}
}
