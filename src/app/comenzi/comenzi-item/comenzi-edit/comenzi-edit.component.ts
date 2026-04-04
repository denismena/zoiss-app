import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { arhitectiDTO } from 'src/app/nomenclatoare/arhitecti/arhitecti-item/arhitecti.model';
import { ArhitectiService } from 'src/app/nomenclatoare/arhitecti/arhitecti.service';
import { clientiDTO } from 'src/app/nomenclatoare/clienti/clienti-item/clienti.model';
import { ClientiService } from 'src/app/nomenclatoare/clienti/clienti.service';
import { ComenziService } from '../../comenzi.service';
import { comenziCreationDTO, comenziDTO, produseComandaDTO } from '../comenzi.model';
import { forkJoin } from 'rxjs';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
    selector: 'app-comenzi-edit',
    templateUrl: './comenzi-edit.component.html',
    styleUrls: ['./comenzi-edit.component.scss'],
    standalone: false
})
export class ComenziEditComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  constructor(private activatedRoute: ActivatedRoute,private router:Router, 
    private comenziService: ComenziService, private clientiService: ClientiService, private arhitectService: ArhitectiService) { }
  
    errors: string[] = [];
  model!:comenziDTO;
  selectedProdus: produseComandaDTO[] = [];
  preselectClient: clientiDTO | undefined;
  preselectArhitect: arhitectiDTO | undefined;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.model = undefined!;
      this.preselectClient = undefined;
      this.preselectArhitect = undefined;
      this.selectedProdus = [];
      this.comenziService.putGet(params.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: comanda => {
          this.model = comanda.comanda;
          this.selectedProdus = comanda.comenziProduses;        

          if(this.model){
            this.clientiService.getById(comanda.comanda.clientId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({ next: client => this.preselectClient = client });
            if(comanda.comanda.arhitectId != null){
              this.arhitectService.getById(comanda.comanda.arhitectId)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({ next: arhitect => this.preselectArhitect = arhitect });
            }
          }
        },
        error: error => this.errors = parseWebAPIErrors(error)
      })
    });
  }
  // ngOnInit(): void {
  //   this.activatedRoute.params.pipe(
  //     takeUntilDestroyed(this.destroyRef)
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
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => this.router.navigate(["/comenzi"]),
      error: error => this.errors = parseWebAPIErrors(error)
    });
  }

  cloneComanda(){
    this.comenziService.clone(this.model.id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (newId) => this.router.navigate(['/comenzi/edit', newId]),
      error: error => this.errors = parseWebAPIErrors(error)
    });
  }
}
