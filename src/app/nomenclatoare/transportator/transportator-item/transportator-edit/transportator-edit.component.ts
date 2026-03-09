import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TransporatorService } from '../../transportator.service';
import { transportatorCreationDTO, transportatorDTO } from '../transportator.model';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
    selector: 'app-transportator-edit',
    templateUrl: './transportator-edit.component.html',
    styleUrls: ['./transportator-edit.component.scss'],
    standalone: false
})
export class TransportatorEditComponent implements OnInit {
  errors: string[] = [];
  private destroyRef = inject(DestroyRef);
  constructor(private activatedRoute: ActivatedRoute,private router:Router,
    private transporatorService: TransporatorService) { }

  model!:transportatorDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.transporatorService.getById(params.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(transportator => {
        this.model = transportator;        
      },
      error => this.errors = parseWebAPIErrors(error))
    });
  }
  saveChanges(transportatorCreationDTO:transportatorCreationDTO){
    this.transporatorService.edit(this.model.id, transportatorCreationDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.router.navigate(["/transportator"]);
    },
    error => this.errors = parseWebAPIErrors(error));
  }
}
