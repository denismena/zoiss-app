import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { UMService } from '../../um.service';
import { umCreationDTO } from '../um.model';

@Component({
    selector: 'app-um-create',
    templateUrl: './um-create.component.html',
    styleUrls: ['./um-create.component.scss'],
    standalone: false
})
export class UmCreateComponent implements OnInit {

  errors: string[] = [];
  private destroyRef = inject(DestroyRef);
  constructor(private router:Router, private umService: UMService) { }

  ngOnInit(): void {
  }
  saveChanges(umCreationDTO: umCreationDTO){
    this.umService.create(umCreationDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(()=>{
      this.router.navigate(['/um'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }
}
