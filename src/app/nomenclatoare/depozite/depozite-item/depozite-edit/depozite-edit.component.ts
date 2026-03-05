import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { DepoziteService } from '../../depozite.service';
import { depoziteCreationDTO, depoziteDTO } from '../depozite.model';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
    selector: 'app-depozite-edit',
    templateUrl: './depozite-edit.component.html',
    styleUrls: ['./depozite-edit.component.scss'],
    standalone: false
})
export class DepoziteEditComponent implements OnInit {
  errors: string[] = [];
  private destroyRef = inject(DestroyRef);

  constructor(private activatedRoute: ActivatedRoute, private router:Router, 
    private depoziteService: DepoziteService) { }

  model!:depoziteDTO;
  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      if(params.id == null) return;
      this.depoziteService.getById(params.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(depozit => {
        this.model = depozit;        
      },
      error=> this.errors = parseWebAPIErrors(error))
    });
  }
  saveChanges(depoziteCreationDTO:depoziteCreationDTO){
    this.depoziteService.edit(this.model.id, depoziteCreationDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.router.navigate(["/depozite"]);
    },
    error=> this.errors = parseWebAPIErrors(error));
  }
}
