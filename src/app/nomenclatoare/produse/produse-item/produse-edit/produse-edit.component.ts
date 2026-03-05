import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { furnizoriDTO } from 'src/app/nomenclatoare/furnizori/furnizori-item/furnizori.model';
import { FurnizoriService } from 'src/app/nomenclatoare/furnizori/furnizori.service';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ProduseService } from '../../produse.service';
import { produseCreationDTO,produseDTO } from '../produse.model';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-produse-edit',
    templateUrl: './produse-edit.component.html',
    styleUrls: ['./produse-edit.component.scss'],
    standalone: false
})
export class ProduseEditComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  constructor(private activatedRoute: ActivatedRoute,private router:Router, private produsService: ProduseService,
      private furnizorService: FurnizoriService) { }
  
  errors: string[] = [];
  preselectFurnizor: furnizoriDTO | undefined;
  model!:produseDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.produsService.getById(params.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(produs => {
        this.model = produs;
        console.log(this.model);

        if(produs.prefFurnizorId !=undefined){
          this.furnizorService.getById(produs.prefFurnizorId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(furnizor=>{
            this.preselectFurnizor = furnizor;
          },
          error => this.errors = parseWebAPIErrors(error));
        }
      });      
    });
  }
  saveChanges(produseCreationDTO:produseCreationDTO){
    this.produsService.edit(this.model.id, produseCreationDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.router.navigate(["/produse"]);
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }
}
