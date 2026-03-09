import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { SucursaleService } from '../../sucursala.service';
import { sucursalaCreationDTO, sucursalaDTO } from '../sucursala.model';

@Component({
    selector: 'app-sucursale-edit',
    templateUrl: './sucursale-edit.component.html',
    styleUrls: ['./sucursale-edit.component.scss'],
    standalone: false
})
export class SucursaleEditComponent implements OnInit {
  errors: string[] = [];
  private destroyRef = inject(DestroyRef);
  constructor(private activatedRoute: ActivatedRoute,private router:Router, private sucursaleService: SucursaleService) { }

  model!:sucursalaDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.sucursaleService.getById(params.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(um => {
        this.model = um;
      },
      error=> this.errors = parseWebAPIErrors(error))
    });
  }
  saveChanges(sucursalaCreationDTO:sucursalaCreationDTO){
    this.sucursaleService.edit(this.model.id, sucursalaCreationDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.router.navigate(["/sucursale"]);
    },
    error=> this.errors = parseWebAPIErrors(error));
  }

}
