import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { LivrariService } from '../../livrari.service';
import { livrariCreationDTO } from '../livrari.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-livrari-create',
  templateUrl: './livrari-create.component.html',
  styleUrls: ['./livrari-create.component.scss']
})
export class LivrariCreateComponent implements OnInit, OnDestroy {

  errors: string[] = [];
  constructor(private router:Router, private livrariService: LivrariService, private unsubscribeService: UnsubscribeService) { }

  ngOnInit(): void {
  }

  saveChanges(livrariCreationDTO:livrariCreationDTO){
    this.livrariService.create(livrariCreationDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{
      this.router.navigate(['/livrari'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

  ngOnDestroy(): void {}
}
