import { formatDate } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { depoziteDTO } from 'src/app/nomenclatoare/depozite/depozite-item/depozite.model';
import { NotificariService } from 'src/app/notificari/notificari.service';
import { DepoziteAllDialogComponent } from '../depozite-all-dialog/depozite-all-dialog.component';
import { DepoziteDialogComponent } from '../depozite-dialog/depozite-dialog.component';
import { transportProduseDepozitDTO, transportProduseDTO } from '../transport-item/transport.model';
import { TransportService } from '../transport.service';

@Component({
  selector: 'app-transport-produse',
  templateUrl: './transport-produse.component.html',
  styleUrls: ['./transport-produse.component.scss']
})
export class TransportProduseComponent implements OnInit {

  @Input()
  selectedProdus: transportProduseDTO[]=[];
  @Input()
  depoziteLista: string[]=[];
  id!: number;
  
  //public localID: string ='';

  columnsToDisplay = ['clientNume', 'produsNume', 'cantitate', 'um', 'cutii', 'depozit']

  @ViewChild(MatTable)
  table!: MatTable<any>;

  dataFromDialog : any;
  // get necitite():number{
  //   return this.notificariService.necitite;
  // }
  // set necitite(val: number){
  //   this.notificariService.necitite = val;
  // }
  constructor(private activatedRoute: ActivatedRoute,private router:Router, 
    public dialog: MatDialog, private transportService: TransportService
    //, private notificariService: NotificariService    
    ) {     
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      this.id= params.id;
    });
    this.depoziteLista.forEach(d=>{
      this.columnsToDisplay.push(d);
    });
    this.columnsToDisplay.push('livrat');
  }
  
  findByDepozit(arr:transportProduseDepozitDTO[] , name: string) {
    return arr.find(f=>f.depozit=== name);    
  }
  
  showPrompt(prodDepId:number, id:number, data: Date|null, detalii: string, pozaPath: string): void {
    const dialogRef = this.dialog.open(DepoziteDialogComponent,      
      { data:{id: id, date:data, detalii:detalii, pozaPath:pozaPath}, width: '600px', height: '450px' });

    dialogRef.afterClosed().subscribe((data) => {
      if (data.clicked === 'submit') {
        this.dataFromDialog = data.form;
        this.transportService.saveDepozitArrival(data.form)
        .subscribe(() => {
          var currProDep = this.selectedProdus.find(f=>f.id === prodDepId)?.transportProduseDepozit.find(ff=>ff.id === id);
          if(currProDep !=null)
          {
            currProDep.data = data.form.data;
            currProDep.detalii = data.form.detalii;
            currProDep.pozaPath = data.form.pozaPath;
            //this.necitite = this.necitite+1;
          }                    
        });
      }
    });
  }

  showPromptAll(depozit: string){
    const dialogRef = this.dialog.open(DepoziteAllDialogComponent,      
      { data:{id: this.id, depozit: depozit}, width: '450px', height: '400px' });

    dialogRef.afterClosed().subscribe((data) => {      
      if (data.clicked === 'submit') {
        this.dataFromDialog = data.form;
        console.log('data.form.data', data.form.data);
        
        this.transportService.saveDepozitArrivalAll(data.form)
            .subscribe(() => {
              this.selectedProdus.forEach(produs => {
                  var currProDep = produs.transportProduseDepozit.find(f=>f.depozit === depozit);                                     
                  if(currProDep !=null)
                    if(data.form.overwriteAll || (!data.form.overwriteAll && currProDep.data == null) )
                    {
                      currProDep.data = data.form.data;
                      currProDep.detalii = data.form.detalii;
                      //this.necitite = this.necitite+1;
                    }
              });                    
            });
      }
      else console.log('else');
    }); 
    console.log('after close');
  }
}
