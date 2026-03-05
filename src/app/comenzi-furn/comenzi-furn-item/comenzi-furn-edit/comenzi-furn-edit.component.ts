import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ComenziFurnizorService } from '../../comenzi-furn.service';
import { comenziFurnizorCreationDTO, comenziFurnizorDTO, produseComandaFurnizorDTO } from '../comenzi-furn.model';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
    selector: 'app-comenzi-furn-edit',
    templateUrl: './comenzi-furn-edit.component.html',
    styleUrls: ['./comenzi-furn-edit.component.scss'],
    standalone: false
})
export class ComenziFurnEditComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  errors: string[] = [];
  public furnizorName: string='';
  constructor(private activatedRoute: ActivatedRoute,private router:Router, private comenziFurnizorService: ComenziFurnizorService) { }
  model!:comenziFurnizorDTO;
  selectedProdus: produseComandaFurnizorDTO[] = [];
  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.comenziFurnizorService.putGet(params.id)
      .pipe(takeUntilDestroyed(this.destroyRef))      
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
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.router.navigate(["/comenziFurnizor"]);
    },
    error=> this.errors = parseWebAPIErrors(error));
  }
}
