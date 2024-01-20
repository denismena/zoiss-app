import { Component, OnDestroy, OnInit } from '@angular/core';
import { nirCreationDTO, nirDTO, produseNirDTO } from '../nir.model';
import { NIRService } from '../../nir.service';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
  selector: 'app-nir-edit',
  templateUrl: './nir-edit.component.html',
  styleUrls: ['./nir-edit.component.scss']
})
export class NirEditComponent implements OnInit, OnDestroy{
  model!:nirDTO;
  selectedProdus: produseNirDTO[] = [];  
  errors: string[] = [];

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private unsubscribeService: UnsubscribeService, 
    private nirService: NIRService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;      
      this.nirService.putGet(params.id)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
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
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.router.navigate(["/nir"]);
    }, 
    error=> this.errors = parseWebAPIErrors(error));
  }

  ngOnDestroy(): void {}
}
