import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { transportatorDTO } from './transportator.model';

@Component({
  selector: 'app-transportator-item',
  templateUrl: './transportator-item.component.html',
  styleUrls: ['./transportator-item.component.scss']
})
export class TransportatorItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder) { }
  public form!: FormGroup;
  @Input()
  model:transportatorDTO | undefined;
  
  @Output()
  onSaveChanges: EventEmitter<transportatorDTO> = new EventEmitter<transportatorDTO>();

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });

    this.form = this.formBuilder.group({
      nume:['', {validators:[RxwebValidators.required(), RxwebValidators.maxLength({value:150 })]}],
      nrInmatriculare: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],
      adresa: ['', {validators:[RxwebValidators.maxLength({value:255 })]}],
      tel: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],
      email: [null, {validators: [RxwebValidators.email(), RxwebValidators.maxLength({value:100 })]}],
      active: true
    });
    if(this.model !== undefined)
    {
      this.form.patchValue(this.model);
    }    
  }
  saveChanges(){
    if(this.form.valid)
      this.onSaveChanges.emit(this.form.value);
  }

}
