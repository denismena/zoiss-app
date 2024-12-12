import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComenziFurnizorService } from '../../comenzi-furn.service';
import { comenziFurnizorCreationDTO, comenziFurnizorDTO, produseComandaFurnizorDTO } from '../comenzi-furn.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
    selector: 'app-comenzi-furn-edit',
    templateUrl: './comenzi-furn-edit.component.html',
    styleUrls: ['./comenzi-furn-edit.component.scss'],
    standalone: false
})
export class ComenziFurnEditComponent implements OnInit, OnDestroy {
  errors: string[] = [];
  public furnizorName: string='';
  constructor(private activatedRoute: ActivatedRoute,private router:Router, private comenziFurnizorService: ComenziFurnizorService,
    private unsubscribeService: UnsubscribeService) { }
  model!:comenziFurnizorDTO;
  selectedProdus: produseComandaFurnizorDTO[] = [];
  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.comenziFurnizorService.putGet(params.id)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))      
      .subscribe(comanda => {
        console.log('comanda:', comanda);
        this.model = comanda.comandaFurnizor;
        this.selectedProdus = comanda.comenziFurnizoriProduse;
        this.furnizorName = this.model.furnizor;        
      },
      error=> this.errors = parseWebAPIErrors(error))
    });
  }

  saveChanges(comenziFurnizorCreationDTO:comenziFurnizorCreationDTO){
    this.comenziFurnizorService.edit(this.model.id, comenziFurnizorCreationDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.router.navigate(["/comenziFurnizor"]);
    },
    error=> this.errors = parseWebAPIErrors(error));
  }

  ngOnDestroy(): void {}

}
