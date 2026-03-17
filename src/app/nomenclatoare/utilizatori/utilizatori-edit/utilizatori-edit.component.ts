import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { UtilizatoriDTO } from 'src/app/security/security.models';
import { SecurityService } from 'src/app/security/security.service';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { SucursaleService } from '../../sucursale/sucursala.service';
import { sucursalaDTO } from '../../sucursale/sucursale-item/sucursala.model';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-utilizatori-edit',
    templateUrl: './utilizatori-edit.component.html',
    styleUrls: ['./utilizatori-edit.component.scss'],
    standalone: false
})
export class UtilizatoriEditComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  constructor(private securityService: SecurityService, private router: Router, 
    private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private sucursaleService: SucursaleService) { 
      
    }
  errors: string[] = [];
  public form!: FormGroup;
  public model!: UtilizatoriDTO;
  sucursaleList: sucursalaDTO[]=[];

  ngOnInit(): void {   

    this.activatedRoute.params.subscribe(params => {
      if(params.id == null) return;
      this.securityService.getById(params.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: util => {
          this.model = util;
          if(this.model !== undefined)
          {
            this.form.patchValue(this.model);
          }
        },
        error: error => this.errors = parseWebAPIErrors(error)
      })
    });

    this.form = this.formBuilder.group({     
      email: [null, {validators:[RxwebValidators.required(), RxwebValidators.email() ]}], 
      name: [null,{validators:[RxwebValidators.required()]}],
      phoneNumber: [null,{validators:[RxwebValidators.required()]}],
      sucursalaId: null
    })

    this.sucursaleService.getAll()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: sucursale => this.sucursaleList = sucursale,
      error: error => this.errors = parseWebAPIErrors(error)
    });
  }

  edit(utilizatoriDTO: UtilizatoriDTO){
    this.errors=[];
    if(utilizatoriDTO.sucursalaId == 0) utilizatoriDTO.sucursalaId = null;
    this.securityService.edit(this.model.id, utilizatoriDTO)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: authenticationResponse => {
        if(this.model.email == this.securityService.getFieldFromJwt('email'))
          this.securityService.saveToken(authenticationResponse);
        this.router.navigate(['/utilizatori']);
      },
      error: error => this.errors = parseWebAPIErrors(error)
    });
  }

  selectParent(depozit: any){       
    this.form.get('sucursalaId')?.setValue(depozit.value);
  }
}
