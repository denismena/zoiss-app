import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { furnizoriDTO } from './furnizori.model';

@Component({
  selector: 'app-furnizori-item',
  templateUrl: './furnizori-item.component.html',
  styleUrls: ['./furnizori-item.component.scss']
})
export class FurnizoriItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder) { }
  public form!: FormGroup;
  @Input()
  model:furnizoriDTO | undefined;
  
  @Output()
  onSaveChanges: EventEmitter<furnizoriDTO> = new EventEmitter<furnizoriDTO>();

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });

    this.form = this.formBuilder.group({
      nume:['', {validators:[RxwebValidators.required(), RxwebValidators.maxLength({value:150 })]}],
      tara: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],
      oras: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],
      judet: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],
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
