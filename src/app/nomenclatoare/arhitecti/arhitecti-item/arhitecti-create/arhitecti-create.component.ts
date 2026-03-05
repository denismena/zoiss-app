import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ArhitectiService } from '../../arhitecti.service';
import { arhitectiDTO } from '../arhitecti.model';

@Component({
    selector: 'app-arhitecti-create',
    templateUrl: './arhitecti-create.component.html',
    styleUrls: ['./arhitecti-create.component.scss'],
    standalone: false
})
export class ArhitectiCreateComponent implements OnInit {

  errors: string[] = [];
  private destroyRef = inject(DestroyRef);
  constructor(private router:Router, private arhitectiService: ArhitectiService) { }

  ngOnInit(): void {
  }
  saveChanges(arhitectiDTO: arhitectiDTO){    
    this.arhitectiService.create(arhitectiDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(()=>{
      this.router.navigate(['/arhitecti'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }
}
