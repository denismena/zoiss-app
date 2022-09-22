import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { forgetPass, userCredentials } from '../security.models';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private securityService: SecurityService, private router: Router, private formBuilder: UntypedFormBuilder) { }
  errors: string[] = [];
  success: boolean = false;
  public form!: UntypedFormGroup;
  
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
    this.securityService.register(userCredentials).subscribe(authenticationResponse=>{
      console.log('authenticationResponse', authenticationResponse);
      if(authenticationResponse == null){
        this.success=true;
        //this.confirmEmail(userCredentials.email);
      }
    }, error=> this.errors = parseWebAPIErrors(error));
  }
}
