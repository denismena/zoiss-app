import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FurnizoriService } from '../../furnizori.service';
import { furnizoriDTO, furnizoriCreationDTO } from '../furnizori.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
  selector: 'app-furnizori-edit',
  templateUrl: './furnizori-edit.component.html',
  styleUrls: ['./furnizori-edit.component.scss']
})
export class FurnizoriEditComponent implements OnInit, OnDestroy {

  errors:string[] = [];
  constructor(private activatedRoute: ActivatedRoute,private router:Router, private furnizoriService: FurnizoriService,
    private unsubscribeService: UnsubscribeService) { }

  model!:furnizoriDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.furnizoriService.getById(params.id)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))            
      .subscribe(furnizor => {
        this.model = furnizor;
        console.log(this.model);
      },error=> this.errors = parseWebAPIErrors(error))
    });
  }
  saveChanges(furnizoriCreationDTO:furnizoriCreationDTO){
    this.furnizoriService.edit(this.model.id, furnizoriCreationDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.router.navigate(["/furnizori"]);
    },
    error => this.errors = parseWebAPIErrors(error));
  }

  ngOnDestroy(): void {}

}
