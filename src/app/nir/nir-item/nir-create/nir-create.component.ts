import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { NIRService } from '../../nir.service';
import { nirDTO } from '../nir.model';
import { takeUntil } from 'rxjs/operators';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
    selector: 'app-nir-create',
    templateUrl: './nir-create.component.html',
    styleUrls: ['./nir-create.component.scss'],
    standalone: false
})
export class NirCreateComponent implements OnInit, OnDestroy{
  errors: string[] = [];

  constructor(private router:Router, private nirService: NIRService, private unsubscribeService: UnsubscribeService ) { }
  ngOnInit(): void {
    
  }

  saveChanges(nirDTO:nirDTO){
    console.log('nirDTO', nirDTO);
    this.nirService.create(nirDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{
      this.router.navigate(['/nir'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }
  
  ngOnDestroy(): void {}
}
