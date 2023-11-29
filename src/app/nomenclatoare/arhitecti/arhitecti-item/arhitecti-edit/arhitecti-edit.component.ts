import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArhitectiService } from '../../arhitecti.service';
import { arhitectiCreationDTO, arhitectiDTO } from '../arhitecti.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-arhitecti-edit',
  templateUrl: './arhitecti-edit.component.html',
  styleUrls: ['./arhitecti-edit.component.scss']
})
export class ArhitectiEditComponent implements OnInit, OnDestroy {

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
        console.log(this.model);
      })
    });
  }

  saveChanges(arhitectiCreationDTO:arhitectiCreationDTO){
    this.arhitectiService.edit(this.model.id, arhitectiCreationDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.router.navigate(["/arhitecti"]);
    });
  }

  ngOnDestroy(): void {}

}
