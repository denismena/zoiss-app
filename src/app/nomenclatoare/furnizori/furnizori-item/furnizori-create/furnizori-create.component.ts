import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { FurnizoriService } from '../../furnizori.service';
import { furnizoriDTO } from '../furnizori.model';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-furnizori-create',
    templateUrl: './furnizori-create.component.html',
    styleUrls: ['./furnizori-create.component.scss'],
    standalone: false
})
export class FurnizoriCreateComponent implements OnInit {
  errors: string[] = [];
  private destroyRef = inject(DestroyRef);
  constructor(private router:Router, private furnizoriService: FurnizoriService) { }

  ngOnInit(): void {
  }
  saveChanges(furnizoriDTO: furnizoriDTO){    
    this.furnizoriService.create(furnizoriDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(()=>{
      this.router.navigate(['/furnizori'])
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }
}
