import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { UtilizatoriDTO } from 'src/app/security/security.models';
import { SecurityService } from 'src/app/security/security.service';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { SucursaleService } from '../../sucursale/sucursala.service';
import { sucursalaDTO } from '../../sucursale/sucursale-item/sucursala.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-utilizatori-edit',
    templateUrl: './utilizatori-edit.component.html',
    styleUrls: ['./utilizatori-edit.component.scss'],
    standalone: false
})
export class UtilizatoriEditComponent implements OnInit, OnDestroy {

  constructor(private securityService: SecurityService, private router: Router, private unsubscribeService: UnsubscribeService, 
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
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(util => {
        this.model = util;
        if(this.model !== undefined)
        {
          this.form.patchValue(this.model);
        }
      },
      error => this.errors = parseWebAPIErrors(error))
    });

    this.form = this.formBuilder.group({     
      email: [null, {validators:[RxwebValidators.required(), RxwebValidators.email() ]}], 
      name: [null,{validators:[RxwebValidators.required()]}],
      phoneNumber: [null,{validators:[RxwebValidators.required()]}],
      sucursalaId: null
    })

    this.sucursaleService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(sucursale=>{
      this.sucursaleList=sucursale;      
    },
    error => this.errors = parseWebAPIErrors(error));
  }

  edit(utilizatoriDTO: UtilizatoriDTO){
    this.errors=[];
    if(utilizatoriDTO.sucursalaId == 0) utilizatoriDTO.sucursalaId = null;
    this.securityService.edit(this.model.id, utilizatoriDTO)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(authenticationResponse=>{
      if(this.model.email == this.securityService.getFieldFromJwt('email'))
        this.securityService.saveToken(authenticationResponse);
      this.router.navigate(['/utilizatori']);
    }, error=> this.errors = parseWebAPIErrors(error));
  }

  selectParent(depozit: any){       
    this.form.get('sucursalaId')?.setValue(depozit.value);
  }

  ngOnDestroy(): void {}
}
