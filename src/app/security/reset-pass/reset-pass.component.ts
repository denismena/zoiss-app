import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { resetPass } from '../security.models';
import { SecurityService } from '../security.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-reset-pass',
    templateUrl: './reset-pass.component.html',
    styleUrls: ['./reset-pass.component.scss'],
    standalone: false
})
export class ResetPassComponent implements OnInit, OnDestroy {

  constructor(private securityService: SecurityService, private router: Router, private formBuilder: FormBuilder, private unsubscribeService: UnsubscribeService,
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
    this.securityService.resetPassword(userCredentials)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(authenticationResponse=>{
      this.router.navigate(['/']);
    }, error=> this.errors = parseWebAPIErrors(error));
  }

  ngOnDestroy(): void {
  }
}
