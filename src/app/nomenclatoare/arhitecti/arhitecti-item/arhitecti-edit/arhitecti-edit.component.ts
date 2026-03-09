import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ArhitectiService } from '../../arhitecti.service';
import { arhitectiCreationDTO, arhitectiDTO } from '../arhitecti.model';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
    selector: 'app-arhitecti-edit',
    templateUrl: './arhitecti-edit.component.html',
    styleUrls: ['./arhitecti-edit.component.scss'],
    standalone: false
})
export class ArhitectiEditComponent implements OnInit {
  errors: string[] = [];
  private destroyRef = inject(DestroyRef);
  constructor(private activatedRoute: ActivatedRoute,private router:Router, private arhitectiService: ArhitectiService) { }
  
  model!:arhitectiDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.arhitectiService.getById(params.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(arhitect => {
        this.model = arhitect;        
      },
      error=> this.errors = parseWebAPIErrors(error));
    });
  }

  saveChanges(arhitectiCreationDTO:arhitectiCreationDTO){
    this.arhitectiService.edit(this.model.id, arhitectiCreationDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.router.navigate(["/arhitecti"]);
    },
    error => this.errors = parseWebAPIErrors(error));
  }
}
