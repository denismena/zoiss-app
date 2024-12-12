import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { forgetPass } from '../security.models';
import { SecurityService } from '../security.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-forget-pass',
    templateUrl: './forget-pass.component.html',
    styleUrls: ['./forget-pass.component.scss'],
    standalone: false
})
export class ForgetPassComponent implements OnInit, OnDestroy {

  constructor(private formBuilder: FormBuilder, private securityservice: SecurityService, private unsubscribeService: UnsubscribeService) { }
  public form!: FormGroup;
  errors: string[] = [];
  success: boolean = false;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [null, {validators:[RxwebValidators.required(), RxwebValidators.email() ]}]      
    })
  }

  confirm(email: forgetPass){
    this.success=false; this.errors = [];
    this.securityservice.forgetPassword(email)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(authenticatorResponse=>{      
      this.success = true;
    }, error=> {this.errors = parseWebAPIErrors(error);
      console.log('this.errors', this.errors);
    })
  }

  ngOnDestroy(): void {
  }
}
