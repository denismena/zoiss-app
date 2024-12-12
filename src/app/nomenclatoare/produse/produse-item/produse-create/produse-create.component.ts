import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ProduseService } from '../../produse.service';
import { produseCreationDTO } from '../produse.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-produse-create',
    templateUrl: './produse-create.component.html',
    styleUrls: ['./produse-create.component.scss'],
    standalone: false
})
export class ProduseCreateComponent implements OnInit, OnDestroy {

  errors: string[] = [];
  constructor(private router:Router, private produsService: ProduseService, private unsubscribeService: UnsubscribeService) { }

  ngOnInit(): void {
  }
  saveChanges(produseDTO: produseCreationDTO){    
    this.produsService.create(produseDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{
      this.router.navigate(['/produse'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

  ngOnDestroy(): void {}
}
