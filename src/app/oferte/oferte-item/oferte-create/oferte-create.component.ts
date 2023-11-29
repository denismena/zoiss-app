import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { OferteService } from '../../oferte.service';
import { oferteDTO } from '../oferte.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-oferte-create',
  templateUrl: './oferte-create.component.html',
  styleUrls: ['./oferte-create.component.scss']
})
export class OferteCreateComponent implements OnInit, OnDestroy {

  errors: string[] = [];
  constructor(private router:Router, private oferteService: OferteService, private unsubscribeService: UnsubscribeService ) { }

  nextNumber: number = 1;
  ngOnInit(): void {    
  }

  saveChanges(oferteDTO:oferteDTO){
    this.oferteService.create(oferteDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{
      this.router.navigate(['/oferte'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

  ngOnDestroy(): void {}
}
