import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ComenziService } from '../../comenzi.service';
import { comenziDTO } from '../comenzi.model';

@Component({
    selector: 'app-comenzi-create',
    templateUrl: './comenzi-create.component.html',
    styleUrls: ['./comenzi-create.component.scss'],
    standalone: false
})
export class ComenziCreateComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  errors: string[] = [];
  constructor(private router:Router, private comenziService: ComenziService) { }

  nextNumber: number = 1;
  ngOnInit(): void {    
  }

  saveChanges(comenziDTO:comenziDTO){
    console.log(comenziDTO);
    this.comenziService.create(comenziDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(()=>{
      this.router.navigate(['/comenzi'])
    }, 
    error => {
      console.error('error', error);
      this.errors = parseWebAPIErrors(error);
    });
  }
}
