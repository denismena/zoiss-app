import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ComenziService } from '../../comenzi.service';
import { comenziDTO } from '../comenzi.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-comenzi-create',
  templateUrl: './comenzi-create.component.html',
  styleUrls: ['./comenzi-create.component.scss']
})
export class ComenziCreateComponent implements OnInit, OnDestroy {

  errors: string[] = [];
  constructor(private router:Router, private comenziService: ComenziService, private unsubscribeService: UnsubscribeService) { }

  nextNumber: number = 1;
  ngOnInit(): void {    
  }

  saveChanges(comenziDTO:comenziDTO){
    console.log(comenziDTO);
    this.comenziService.create(comenziDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{
      this.router.navigate(['/comenzi'])
    }, 
    error => {
      console.error('error', error);
      this.errors = parseWebAPIErrors(error);
    });
  }
  ngOnDestroy(): void {}
}
