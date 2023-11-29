import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransporatorService } from '../../transportator.service';
import { transportatorCreationDTO, transportatorDTO } from '../transportator.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-transportator-edit',
  templateUrl: './transportator-edit.component.html',
  styleUrls: ['./transportator-edit.component.scss']
})
export class TransportatorEditComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private unsubscribeService: UnsubscribeService,
    private transporatorService: TransporatorService) { }

  model!:transportatorDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.transporatorService.getById(params.id)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(transportator => {
        this.model = transportator;
        console.log(this.model);
      })
    });
  }
  saveChanges(transportatorCreationDTO:transportatorCreationDTO){
    this.transporatorService.edit(this.model.id, transportatorCreationDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.router.navigate(["/transportator"]);
    });
  }

  ngOnDestroy(): void {}

}
