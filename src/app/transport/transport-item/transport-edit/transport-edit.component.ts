import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { depoziteDTO } from 'src/app/nomenclatoare/depozite/depozite-item/depozite.model';
import { TransportService } from '../../transport.service';
import { transportCreationDTO, transportDTO, transportEditDTO, transportProduseDTO } from '../transport.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-transport-edit',
  templateUrl: './transport-edit.component.html',
  styleUrls: ['./transport-edit.component.scss']
})
export class TransportEditComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private transportService: TransportService,
    private unsubscribeService: UnsubscribeService) { }
  model!:transportDTO;
  selectedProdus: transportProduseDTO[] = [];
  depoziteLista: string[]=[];
  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.transportService.putGet(params.id)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(transport => {
        this.model = transport.transport;
        this.selectedProdus = transport.transportProduse;
        transport.depoziteLista.forEach(d=>{
          this.depoziteLista.push(d.nume);
        })
      })
    });
  }

  saveChanges(transportCreationDTO:transportEditDTO){
    this.transportService.edit(this.model.id, transportCreationDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.router.navigate(["/transport"]);
    });
  }

  ngOnDestroy(): void {
  }

}
