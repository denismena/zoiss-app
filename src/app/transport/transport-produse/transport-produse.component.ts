import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { depoziteDTO } from 'src/app/nomenclatoare/depozite/depozite-item/depozite.model';
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
  //depoziteNume:string[]=[];

  columnsToDisplay = ['clientNume', 'produsNume', 'cantitate', 'um', 'cutii', 'depozit']

  @ViewChild(MatTable)
  table!: MatTable<any>;

  dataFromDialog : any;
  constructor(private activatedRoute: ActivatedRoute,private router:Router, 
    public dialog: MatDialog, private transportService: TransportService) {     
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      this.id= params.id;
    });
    console.log('id', this.id);
    console.log('in trans produse', this.selectedProdus);
    console.log('in trans depoziteLista', this.depoziteLista);    
    this.depoziteLista.forEach(d=>{
      this.columnsToDisplay.push(d);
    })    
  }
  
  findByDepozit(arr:transportProduseDepozitDTO[] , name: string) {
    return arr.find(f=>f.depozit=== name);    
  }
  
  showPrompt(prodDepId:number, id:number, data: Date|null, detalii: string): void {
    const dialogRef = this.dialog.open(DepoziteDialogComponent,      
      { data:{id: id, date:data, detalii:detalii}, width: '350px', height: '400px' });

    dialogRef.afterClosed().subscribe((data) => {
      //data.form.id = id;
      this.dataFromDialog = data.form;
      if (data.clicked === 'submit') {
        //console.log('in parent', data.form);        
        this.transportService.saveDepozitArrival(data.form)
        .subscribe(() => {
          var currProDep = this.selectedProdus.find(f=>f.id === prodDepId)?.transportProduseDepozit.find(ff=>ff.id === id);
          if(currProDep !=null)
          {
            currProDep.data = data.form.data;
            currProDep.detalii = data.form.detalii;
          }
          //console.log('this.selectedProdus updatat', this.selectedProdus);
        });
      }
    });
  }
}
