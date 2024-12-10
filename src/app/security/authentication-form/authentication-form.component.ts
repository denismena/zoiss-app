import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { userCredentials } from '../security.models';

@Component({
    selector: 'app-authentication-form',
    templateUrl: './authentication-form.component.html',
    styleUrls: ['./authentication-form.component.scss'],
    standalone: false
})
export class AuthenticationFormComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, ) { }
  public form!: FormGroup;
  @Input()
  action: string = '';
  
  @Output()
  onSaveChanges: EventEmitter<userCredentials> = new EventEmitter<userCredentials>();
  
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [null, {validators:[RxwebValidators.required(), RxwebValidators.email() ]}],
      password: [null,{validators:[RxwebValidators.required()]}]
    })
  }

}
