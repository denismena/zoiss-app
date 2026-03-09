import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { UMService } from '../../um.service';
import { umCreationDTO, umDTO } from '../um.model';
import { parseWebAPIErrors } from 'src/app/utilities/utils';

@Component({
    selector: 'app-um-edit',
    templateUrl: './um-edit.component.html',
    styleUrls: ['./um-edit.component.scss'],
    standalone: false
})
export class UmEditComponent implements OnInit {
  errors: string[] = [];
  private destroyRef = inject(DestroyRef);
  constructor(private activatedRoute: ActivatedRoute,private router:Router, private umService: UMService) { }

  model!:umDTO;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.umService.getById(params.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(um => {
        this.model = um;        
      },
      error=> this.errors = parseWebAPIErrors(error));
    });
  }
  saveChanges(umCreationDTO:umCreationDTO){
    this.umService.edit(this.model.id, umCreationDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.router.navigate(["/um"]);
    },
    error => this.errors = parseWebAPIErrors(error));
  }
}
