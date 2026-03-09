import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { TransporatorService } from '../../transportator.service';
import { transportatorDTO } from '../transportator.model';

@Component({
    selector: 'app-transportator-create',
    templateUrl: './transportator-create.component.html',
    styleUrls: ['./transportator-create.component.scss'],
    standalone: false
})
export class TransportatorCreateComponent implements OnInit {

  errors: string[] = [];
  private destroyRef = inject(DestroyRef);
  constructor(private router:Router, private transporatorService: TransporatorService) { }

  ngOnInit(): void {
  }
  saveChanges(transportatorDTO: transportatorDTO){    
    this.transporatorService.create(transportatorDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(()=>{
      this.router.navigate(['/transportator'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }
}
