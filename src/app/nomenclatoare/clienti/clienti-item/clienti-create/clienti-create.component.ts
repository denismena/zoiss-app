import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ClientiService } from '../../clienti.service';
import { clientiDTO } from '../clienti.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-clienti-create',
  templateUrl: './clienti-create.component.html',
  styleUrls: ['./clienti-create.component.scss']
})
export class ClientiCreateComponent implements OnInit, OnDestroy {

  errors: string[] = [];
  constructor(private router:Router, private clientiService: ClientiService, private unsubscribeService: UnsubscribeService) { }

  ngOnInit(): void {
  }
  saveChanges(clientiDTO:clientiDTO){
    this.clientiService.create(clientiDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{
      this.router.navigate(['/clienti'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

  ngOnDestroy(): void {}
}
