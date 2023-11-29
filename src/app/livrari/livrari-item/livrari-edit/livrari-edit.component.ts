import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { clientiDTO } from 'src/app/nomenclatoare/clienti/clienti-item/clienti.model';
import { ClientiService } from 'src/app/nomenclatoare/clienti/clienti.service';
import { LivrariService } from '../../livrari.service';
import { LivrariDTO, livrariProduseDTO } from '../livrari.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-livrari-edit',
  templateUrl: './livrari-edit.component.html',
  styleUrls: ['./livrari-edit.component.scss']
})
export class LivrariEditComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private unsubscribeService: UnsubscribeService,
    private livrareService: LivrariService) { }
  model!:LivrariDTO;
  selectedProdus: livrariProduseDTO[] = [];
  preselectClient: clientiDTO | undefined;
  public client: string |undefined;
  public clientId: number |undefined;
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.livrareService.putGet(params.id)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(livrare => {
        this.model = livrare.livrare;        
        this.selectedProdus = livrare.livrareProduse;
        
        this.client=livrare.livrare.client;
        this.clientId=livrare.livrare.clientId;       
      })
    });
  }

  saveChanges(livrariDTO:LivrariDTO){
    this.livrareService.edit(this.model.id, livrariDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.router.navigate(["/livrari"]);
    });
  }

  ngOnDestroy(): void {}
}
