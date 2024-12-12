import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { arhitectiDTO } from 'src/app/nomenclatoare/arhitecti/arhitecti-item/arhitecti.model';
import { ArhitectiService } from 'src/app/nomenclatoare/arhitecti/arhitecti.service';
import { clientiDTO } from 'src/app/nomenclatoare/clienti/clienti-item/clienti.model';
import { ClientiService } from 'src/app/nomenclatoare/clienti/clienti.service';
import { produseOfertaDTO } from 'src/app/nomenclatoare/produse/produse-item/produse.model';
import { OferteService } from '../../oferte.service';
import { oferteCreationDTO, oferteDTO } from '../oferte.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
    selector: 'app-oferte-edit',
    templateUrl: './oferte-edit.component.html',
    styleUrls: ['./oferte-edit.component.scss'],
    standalone: false
})
export class OferteEditComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private unsubscribeService: UnsubscribeService, 
    private oferteService: OferteService, private clientiService: ClientiService, private arhitectService: ArhitectiService) { }
  
  model!:oferteDTO;
  selectedProdus: produseOfertaDTO[] = [];
  preselectClient: clientiDTO | undefined;
  preselectArhitect: arhitectiDTO | undefined;
  errors: string[] = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;      
      this.oferteService.putGet(params.id)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(oferta => {
        this.model = oferta.oferta;
        this.selectedProdus = oferta.produse;
        console.log(this.model);

        this.clientiService.getById(oferta.oferta.clientId)
        .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
        .subscribe(client=>{
          this.preselectClient = client;
        });

        if(oferta.oferta.arhitectId != null){
          this.arhitectService.getById(oferta.oferta.arhitectId)
          .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
          .subscribe(arhitect=>{
            this.preselectArhitect = arhitect;
          });
        }
      })
    });
  }

  saveChanges(oferteCreationDTO:oferteCreationDTO){
    this.oferteService.edit(this.model.id, oferteCreationDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.router.navigate(["/oferte"]);
    }, 
    error=> this.errors = parseWebAPIErrors(error));
  }

  ngOnDestroy(): void {}
}
