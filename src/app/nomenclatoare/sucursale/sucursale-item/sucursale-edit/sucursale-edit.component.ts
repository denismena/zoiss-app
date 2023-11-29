import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SucursaleService } from '../../sucursala.service';
import { sucursalaCreationDTO, sucursalaDTO } from '../sucursala.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sucursale-edit',
  templateUrl: './sucursale-edit.component.html',
  styleUrls: ['./sucursale-edit.component.scss']
})
export class SucursaleEditComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute,private router:Router, private sucursaleService: SucursaleService,
    private unsubscribeService: UnsubscribeService) { }

  model!:sucursalaDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.sucursaleService.getById(params.id)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(um => {
        this.model = um;
      })
    });
  }
  saveChanges(sucursalaCreationDTO:sucursalaCreationDTO){
    this.sucursaleService.edit(this.model.id, sucursalaCreationDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.router.navigate(["/sucursale"]);
    });
  }

  ngOnDestroy(): void {}

}
