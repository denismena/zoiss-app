import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepoziteService } from '../../depozite.service';
import { depoziteCreationDTO, depoziteDTO } from '../depozite.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
    selector: 'app-depozite-edit',
    templateUrl: './depozite-edit.component.html',
    styleUrls: ['./depozite-edit.component.scss'],
    standalone: false
})
export class DepoziteEditComponent implements OnInit, OnDestroy {
  errors: string[] = [];
  constructor(private activatedRoute: ActivatedRoute, private router:Router, private unsubscribeService: UnsubscribeService, 
    private depoziteService: DepoziteService) { }

  model!:depoziteDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.depoziteService.getById(params.id)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(depozit => {
        this.model = depozit;        
      },
      error=> this.errors = parseWebAPIErrors(error))
    });
  }
  saveChanges(depoziteCreationDTO:depoziteCreationDTO){
    this.depoziteService.edit(this.model.id, depoziteCreationDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.router.navigate(["/depozite"]);
    },
    error=> this.errors = parseWebAPIErrors(error));
  }

  ngOnDestroy(): void {}

}
