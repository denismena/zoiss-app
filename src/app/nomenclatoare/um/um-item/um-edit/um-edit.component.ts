import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UMService } from '../../um.service';
import { umCreationDTO, umDTO } from '../um.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-um-edit',
  templateUrl: './um-edit.component.html',
  styleUrls: ['./um-edit.component.scss']
})
export class UmEditComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private umService: UMService,
    private unsubscribeService: UnsubscribeService) { }

  model!:umDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.umService.getById(params.id)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(um => {
        this.model = um;
        console.log(this.model);
      })
    });
  }
  saveChanges(umCreationDTO:umCreationDTO){
    this.umService.edit(this.model.id, umCreationDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.router.navigate(["/um"]);
    });
  }

  ngOnDestroy(): void {}
}
