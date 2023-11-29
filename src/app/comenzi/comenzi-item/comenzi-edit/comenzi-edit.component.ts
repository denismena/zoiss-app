import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { arhitectiDTO } from 'src/app/nomenclatoare/arhitecti/arhitecti-item/arhitecti.model';
import { ArhitectiService } from 'src/app/nomenclatoare/arhitecti/arhitecti.service';
import { clientiDTO } from 'src/app/nomenclatoare/clienti/clienti-item/clienti.model';
import { ClientiService } from 'src/app/nomenclatoare/clienti/clienti.service';
import { ComenziService } from '../../comenzi.service';
import { comenziCreationDTO, comenziDTO, produseComandaDTO } from '../comenzi.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-comenzi-edit',
  templateUrl: './comenzi-edit.component.html',
  styleUrls: ['./comenzi-edit.component.scss']
})
export class ComenziEditComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private unsubscribeService: UnsubscribeService, 
    private comenziService: ComenziService, private clientiService: ClientiService, private arhitectService: ArhitectiService) { }
  
  model!:comenziDTO;
  selectedProdus: produseComandaDTO[] = [];
  preselectClient: clientiDTO | undefined;
  preselectArhitect: arhitectiDTO | undefined;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.comenziService.putGet(params.id)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(comanda => {
        this.model = comanda.comanda;
        this.selectedProdus = comanda.comenziProduses;        

        if(this.model){
          // forkJoin([
          //   this.clientiService.getById(comanda.comanda.clientId),
          //   this.arhitectService.getById(comanda.comanda.arhitectId)
          // ]).subscribe(([client, arhitect]) => {
          //   this.preselectClient = client;
          //   this.preselectArhitect = arhitect;
          // });
          this.clientiService.getById(comanda.comanda.clientId)
          .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
          .subscribe(client=>{
            this.preselectClient = client;
          });
          if(comanda.comanda.arhitectId != null){
            this.arhitectService.getById(comanda.comanda.arhitectId)
            .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
            .subscribe(arhitect=>{
              this.preselectArhitect = arhitect;
            });
          }
        }
      })
    });
  }
  // ngOnInit(): void {
  //   this.activatedRoute.params.pipe(
  //     takeUntil(this.unsubscribeService.unsubscribeSignal$)
  //   ).subscribe(params => {
  //     forkJoin([
  //       this.comenziService.putGet(params.id),
  //       this.clientiService.getById(params.id),
  //       this.arhitectService.getById(params.id)
  //     ]).subscribe(([comanda, client, arhitect]) => {
  //       this.model = comanda.comanda;
  //       this.selectedProdus = comanda.comenziProduses;
  //       this.preselectClient = client;
  //       this.preselectArhitect = arhitect;
  //     });
  //   });
  // }

  saveChanges(comenziCreationDTO:comenziCreationDTO){
    this.comenziService.edit(this.model.id, comenziCreationDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.router.navigate(["/comenzi"]);
    });
  }
  ngOnDestroy(): void {}
}
