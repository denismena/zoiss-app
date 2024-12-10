import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ArhitectiService } from '../../arhitecti.service';
import { arhitectiDTO } from '../arhitecti.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-arhitecti-create',
    templateUrl: './arhitecti-create.component.html',
    styleUrls: ['./arhitecti-create.component.scss'],
    standalone: false
})
export class ArhitectiCreateComponent implements OnInit, OnDestroy {

  errors: string[] = [];
  constructor(private router:Router, private arhitectiService: ArhitectiService, private unsubscribeService: UnsubscribeService) { }

  ngOnInit(): void {
  }
  saveChanges(arhitectiDTO: arhitectiDTO){    
    this.arhitectiService.create(arhitectiDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{
      this.router.navigate(['/arhitecti'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

  ngOnDestroy(): void {}

}
