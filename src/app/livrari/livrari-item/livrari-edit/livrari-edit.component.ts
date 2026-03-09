import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { clientiDTO } from 'src/app/nomenclatoare/clienti/clienti-item/clienti.model';
import { ClientiService } from 'src/app/nomenclatoare/clienti/clienti.service';
import { LivrariService } from '../../livrari.service';
import { LivrariDTO, livrariProduseDTO } from '../livrari.model';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
    selector: 'app-livrari-edit',
    templateUrl: './livrari-edit.component.html',
    styleUrls: ['./livrari-edit.component.scss'],
    standalone: false
})
export class LivrariEditComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  errors: string[] = [];
  constructor(private activatedRoute: ActivatedRoute,private router:Router,
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(livrare => {
        this.model = livrare.livrare;        
        this.selectedProdus = livrare.livrareProduse;
        
        this.client=livrare.livrare.client;
        this.clientId=livrare.livrare.clientId;       
      },
      error=> this.errors = parseWebAPIErrors(error))
    });
  }

  saveChanges(livrariDTO:LivrariDTO){
    this.livrareService.edit(this.model.id, livrariDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.router.navigate(["/livrari"]);
    },
    error=> this.errors = parseWebAPIErrors(error));
  }

}
