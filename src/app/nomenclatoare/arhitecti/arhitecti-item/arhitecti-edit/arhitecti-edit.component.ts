import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArhitectiService } from '../../arhitecti.service';
import { arhitectiCreationDTO, arhitectiDTO } from '../arhitecti.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
    selector: 'app-arhitecti-edit',
    templateUrl: './arhitecti-edit.component.html',
    styleUrls: ['./arhitecti-edit.component.scss'],
    standalone: false
})
export class ArhitectiEditComponent implements OnInit, OnDestroy {
  errors: string[] = [];
  constructor(private activatedRoute: ActivatedRoute,private router:Router, private arhitectiService: ArhitectiService,
    private unsubscribeService: UnsubscribeService) { }
  
  model!:arhitectiDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.arhitectiService.getById(params.id)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(arhitect => {
        this.model = arhitect;        
      },
      error=> this.errors = parseWebAPIErrors(error));
    });
  }

  saveChanges(arhitectiCreationDTO:arhitectiCreationDTO){
    this.arhitectiService.edit(this.model.id, arhitectiCreationDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.router.navigate(["/arhitecti"]);
    },
    error => this.errors = parseWebAPIErrors(error));
  }

  ngOnDestroy(): void {}

}
