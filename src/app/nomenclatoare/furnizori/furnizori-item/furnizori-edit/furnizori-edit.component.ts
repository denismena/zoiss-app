import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FurnizoriService } from '../../furnizori.service';
import { furnizoriDTO, furnizoriCreationDTO } from '../furnizori.model';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
    selector: 'app-furnizori-edit',
    templateUrl: './furnizori-edit.component.html',
    styleUrls: ['./furnizori-edit.component.scss'],
    standalone: false
})
export class FurnizoriEditComponent implements OnInit {

  errors:string[] = [];
  private destroyRef = inject(DestroyRef);
  constructor(private activatedRoute: ActivatedRoute,private router:Router, private furnizoriService: FurnizoriService) { }

  model!:furnizoriDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.furnizoriService.getById(params.id)
      .pipe(takeUntilDestroyed(this.destroyRef))            
      .subscribe(furnizor => {
        this.model = furnizor;
      },error=> this.errors = parseWebAPIErrors(error))
    });
  }
  saveChanges(furnizoriCreationDTO:furnizoriCreationDTO){
    this.furnizoriService.edit(this.model.id, furnizoriCreationDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.router.navigate(["/furnizori"]);
    },
    error => this.errors = parseWebAPIErrors(error));
  }
}
