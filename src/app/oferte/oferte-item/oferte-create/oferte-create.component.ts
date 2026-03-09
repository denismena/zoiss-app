import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { OferteService } from '../../oferte.service';
import { oferteDTO } from '../oferte.model';

@Component({
    selector: 'app-oferte-create',
    templateUrl: './oferte-create.component.html',
    styleUrls: ['./oferte-create.component.scss'],
    standalone: false
})
export class OferteCreateComponent implements OnInit {

  errors: string[] = [];
  private destroyRef = inject(DestroyRef);
  constructor(private router:Router, private oferteService: OferteService) { }

  nextNumber: number = 1;
  ngOnInit(): void {    
  }

  saveChanges(oferteDTO:oferteDTO){
    this.oferteService.create(oferteDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(()=>{
      this.router.navigate(['/oferte'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }
}
