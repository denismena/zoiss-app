import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { TransporatorService } from '../../transportator.service';
import { transportatorDTO } from '../transportator.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-transportator-create',
    templateUrl: './transportator-create.component.html',
    styleUrls: ['./transportator-create.component.scss'],
    standalone: false
})
export class TransportatorCreateComponent implements OnInit, OnDestroy {

  errors: string[] = [];
  constructor(private router:Router, private transporatorService: TransporatorService, private unsubscribeService: UnsubscribeService) { }

  ngOnInit(): void {
  }
  saveChanges(transportatorDTO: transportatorDTO){    
    this.transporatorService.create(transportatorDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{
      this.router.navigate(['/transportator'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

  ngOnDestroy(): void {}

}
