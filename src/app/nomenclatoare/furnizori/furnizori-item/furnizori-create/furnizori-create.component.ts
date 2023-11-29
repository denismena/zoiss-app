import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { FurnizoriService } from '../../furnizori.service';
import { furnizoriDTO } from '../furnizori.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-furnizori-create',
  templateUrl: './furnizori-create.component.html',
  styleUrls: ['./furnizori-create.component.scss']
})
export class FurnizoriCreateComponent implements OnInit, OnDestroy {
  errors: string[] = [];
  constructor(private router:Router, private furnizoriService: FurnizoriService, private unsubscribeService: UnsubscribeService) { }

  ngOnInit(): void {
  }
  saveChanges(furnizoriDTO: furnizoriDTO){    
    this.furnizoriService.create(furnizoriDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{
      this.router.navigate(['/furnizori'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

  ngOnDestroy(): void {}

}
