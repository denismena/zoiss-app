import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { nirCreationDTO, nirDTO, produseNirDTO } from '../nir.model';
import { NIRService } from '../../nir.service';
import { ActivatedRoute, Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
    selector: 'app-nir-edit',
    templateUrl: './nir-edit.component.html',
    styleUrls: ['./nir-edit.component.scss'],
    standalone: false
})
export class NirEditComponent implements OnInit {
  model!:nirDTO;
  selectedProdus: produseNirDTO[] = [];  
  errors: string[] = [];

  private destroyRef = inject(DestroyRef);
  constructor(private activatedRoute: ActivatedRoute,private router:Router, 
    private nirService: NIRService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;      
      this.nirService.putGet(params.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(nir => {
        console.log('nir', nir);
        this.model = nir.nir;
        this.selectedProdus = nir.produse;
        console.log(this.model);        
      })
    });
  }

  saveChanges(nirCreationDTO:nirCreationDTO){
    this.nirService.edit(this.model.id, nirCreationDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.router.navigate(["/nir"]);
    }, 
    error=> this.errors = parseWebAPIErrors(error));
  }
}
