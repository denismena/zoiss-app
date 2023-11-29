import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepoziteService } from '../../depozite.service';
import { depoziteCreationDTO, depoziteDTO } from '../depozite.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-depozite-edit',
  templateUrl: './depozite-edit.component.html',
  styleUrls: ['./depozite-edit.component.scss']
})
export class DepoziteEditComponent implements OnInit, OnDestroy {

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
        console.log(this.model);
      })
    });
  }
  saveChanges(depoziteCreationDTO:depoziteCreationDTO){
    this.depoziteService.edit(this.model.id, depoziteCreationDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.router.navigate(["/depozite"]);
    });
  }

  ngOnDestroy(): void {}

}
