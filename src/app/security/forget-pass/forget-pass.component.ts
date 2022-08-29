import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { forgetPass } from '../security.models';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.scss']
})
export class ForgetPassComponent implements OnInit {

  constructor(private formBuilder: UntypedFormBuilder, private securityservice: SecurityService, private router: Router ) { }
  public form!: UntypedFormGroup;
  errors: string[] = [];
  success: boolean = false;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [null, {validators:[RxwebValidators.required(), RxwebValidators.email() ]}]      
    })
  }

  confirm(email: forgetPass){
    this.success=false; this.errors = [];
    this.securityservice.forgetPassword(email).subscribe(authenticatorResponse=>{      
      this.success = true;
    }, error=> {this.errors = parseWebAPIErrors(error);
      console.log('this.errors', this.errors);
    })
  }

}
