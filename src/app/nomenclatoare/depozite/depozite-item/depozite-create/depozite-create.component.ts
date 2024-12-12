import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { DepoziteService } from '../../depozite.service';
import { depoziteDTO } from '../depozite.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-depozite-create',
    templateUrl: './depozite-create.component.html',
    styleUrls: ['./depozite-create.component.scss'],
    standalone: false
})
export class DepoziteCreateComponent implements OnInit, OnDestroy {

  errors: string[] = [];
  constructor(private router:Router, private depoziteService: DepoziteService, private unsubscribeService: UnsubscribeService) { }

  ngOnInit(): void {
  }

  saveChanges(depoziteDTO: depoziteDTO){
    console.log(depoziteDTO);
    this.depoziteService.create(depoziteDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{
      this.router.navigate(['/depozite'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

  ngOnDestroy(): void {}

}
