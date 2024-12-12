import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { SucursaleService } from '../../sucursala.service';
import { sucursalaCreationDTO } from '../sucursala.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-sucursale-create',
    templateUrl: './sucursale-create.component.html',
    styleUrls: ['./sucursale-create.component.scss'],
    standalone: false
})
export class SucursaleCreateComponent implements OnInit, OnDestroy {

  errors: string[] = [];
  constructor(private router:Router, private sucursaleService: SucursaleService, private unsubscribeService: UnsubscribeService) { }

  ngOnInit(): void {
  }
  saveChanges(sucursalaCreationDTO: sucursalaCreationDTO){
    this.sucursaleService.create(sucursalaCreationDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{
      this.router.navigate(['/sucursale'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

  ngOnDestroy(): void {}
}
