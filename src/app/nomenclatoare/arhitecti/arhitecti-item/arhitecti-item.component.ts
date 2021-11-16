import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { arhitectiDTO } from './arhitecti.model';

@Component({
  selector: 'app-arhitecti-item',
  templateUrl: './arhitecti-item.component.html',
  styleUrls: ['./arhitecti-item.component.scss']
})
export class ArhitectiItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder) { }

  public form!: FormGroup;
  @Input()
  model:arhitectiDTO | undefined;
  
  @Output()
  onSaveChanges: EventEmitter<arhitectiDTO> = new EventEmitter<arhitectiDTO>();

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });

    this.form = this.formBuilder.group({
      nume:['', {validators:[RxwebValidators.required(), RxwebValidators.maxLength({value:50 })]}],
      comision: [null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      adresa: ['', {validators:[RxwebValidators.maxLength({value:250 })]}],
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
    this.onSaveChanges.emit(this.form.value);
  }
}
