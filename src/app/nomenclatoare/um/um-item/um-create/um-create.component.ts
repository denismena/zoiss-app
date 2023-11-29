import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { UMService } from '../../um.service';
import { umCreationDTO } from '../um.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-um-create',
  templateUrl: './um-create.component.html',
  styleUrls: ['./um-create.component.scss']
})
export class UmCreateComponent implements OnInit, OnDestroy {

  errors: string[] = [];
  constructor(private router:Router, private umService: UMService, private unsubscribeService: UnsubscribeService) { }

  ngOnInit(): void {
  }
  saveChanges(umCreationDTO: umCreationDTO){
    this.umService.create(umCreationDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{
      this.router.navigate(['/um'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

  ngOnDestroy(): void {}

}
