import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DepoziteAllDialogComponent } from '../depozite-all-dialog/depozite-all-dialog.component';
import { DepoziteDialogComponent } from '../depozite-dialog/depozite-dialog.component';
import { transportProduseDepozitDTO, transportProduseDTO } from '../transport-item/transport.model';
import { TransportService } from '../transport.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-transport-produse',
  templateUrl: './transport-produse.component.html',
  styleUrls: ['./transport-produse.component.scss']
})
export class TransportProduseComponent implements OnInit, OnDestroy {

  @Input()
  selectedProdus: transportProduseDTO[]=[];
  @Input()
  depoziteLista: string[]=[];
  @Input()
  showModificaDepozit: boolean = false;
  id!: number;
  columnsToDisplay = ['clientNume', 'produsCod', 'produsNume', 'cantitate', 'um', 'cutii', 'depozit']

  @ViewChild(MatTable)
  table!: MatTable<any>;
  dataFromDialog : any;
  
  constructor(private activatedRoute: ActivatedRoute, private unsubscribeService: UnsubscribeService,
    public dialog: MatDialog, private transportService: TransportService) {     
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      this.id= params.id;
    });
    this.depoziteLista.forEach(d=>{
      this.columnsToDisplay.push(d);
    });
    this.columnsToDisplay.push('livrat');
    this.columnsToDisplay.push('#');
  }
  
  findByDepozit(arr:transportProduseDepozitDTO[] , name: string) {
    return arr.find(f=>f.depozit=== name);    
  }
  
  showPrompt(prodDepId:number, id:number, data: Date|null, detalii: string, pozaPath: string): void {
    const dialogRef = this.dialog.open(DepoziteDialogComponent,      
      { data:{id: id, date:data, detalii:detalii, pozaPath:pozaPath}, width: '600px', height: '450px' });

    dialogRef.afterClosed()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((data) => {
      if (data.clicked === 'submit') {
        this.dataFromDialog = data.form;
        this.transportService.saveDepozitArrival(data.form)
        .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
        .subscribe(() => {
          var currProDep = this.selectedProdus.find(f=>f.id === prodDepId)?.transportProduseDepozit.find(ff=>ff.id === id);
          if(currProDep !=null)
          {
            currProDep.data = data.form.data;
            currProDep.detalii = data.form.detalii;
            currProDep.pozaPath = data.form.pozaPath;            
          }                    
        });
      }
    });
  }

  showPromptAll(depozit: string){
    const dialogRef = this.dialog.open(DepoziteAllDialogComponent,      
      { data:{id: this.id, depozit: depozit}, width: '450px', height: '400px' });

    dialogRef.afterClosed()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((data) => {      
      if (data.clicked === 'submit') {
        this.dataFromDialog = data.form;
        
        this.transportService.saveDepozitArrivalAll(data.form)
            .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
            .subscribe(() => {
              this.selectedProdus.forEach(produs => {
                  var currProDep = produs.transportProduseDepozit.find(f=>f.depozit === depozit);                                     
                  if(currProDep !=null)
                    if(data.form.overwriteAll || (!data.form.overwriteAll && currProDep.data == null) )
                    {
                      currProDep.data = data.form.data;
                      currProDep.detalii = data.form.detalii;                     
                    }
              });                    
            });
      }
    }); 
  }

  ngOnDestroy(): void {
  }
}
