import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { forgetPass, userCredentials } from '../security.models';
import { SecurityService } from '../security.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: false
})
export class RegisterComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  constructor(private securityService: SecurityService, private formBuilder: FormBuilder) { }
  errors: string[] = [];
  success: boolean = false;
  public form!: FormGroup;
  
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [null, {validators:[RxwebValidators.required(), RxwebValidators.email() ]}],
      password: [null,{validators:[RxwebValidators.required()]}],
      name: [null,{validators:[RxwebValidators.required()]}],
      tel: [null,{validators:[RxwebValidators.required()]}],
      confirmPassword: [null,{validators:[RxwebValidators.required(), RxwebValidators.compare({fieldName:'password'})]}]
    })
  }
  register(userCredentials: userCredentials){
    this.errors=[];
    this.success=false;
    this.securityService.register(userCredentials)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(authenticationResponse=>{      
      if(authenticationResponse == null){
        this.success=true;        
      }
    }, error=> this.errors = parseWebAPIErrors(error));
  }

}
