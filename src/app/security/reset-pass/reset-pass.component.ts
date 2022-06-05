import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { resetPass } from '../security.models';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassComponent implements OnInit {

  constructor(private securityService: SecurityService, private router: Router, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute) { }
  errors: string[] = [];
  public form!: FormGroup;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.form = this.formBuilder.group({
        email: [params.email, {validators:[RxwebValidators.required(), RxwebValidators.email() ]}],
        token: [params.token,{validators:[RxwebValidators.required()]}],
        newpassword: [null,{validators:[RxwebValidators.required()]}],
        confirmPassword: [null,{validators:[RxwebValidators.required(), RxwebValidators.compare({fieldName:'newpassword'})]}]        
      })      
    })
  }

  register(userCredentials: resetPass){
    this.errors=[];    
    this.securityService.resetPassword(userCredentials).subscribe(authenticationResponse=>{
      this.router.navigate(['/']);
    }, error=> this.errors = parseWebAPIErrors(error));
  }

}
