import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { produseCreationDTO, produseDTO } from './produse.model';

@Component({
  selector: 'app-produse-item',
  templateUrl: './produse-item.component.html',
  styleUrls: ['./produse-item.component.scss']
})
export class ProduseItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder) { }
  public form!: FormGroup;
  @Input()
  model!:produseCreationDTO;
  
   @Output()
   onSaveChanges: EventEmitter<produseCreationDTO> = new EventEmitter<produseCreationDTO>();
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });

    this.form = this.formBuilder.group({
      cod:['', {validators:[RxwebValidators.required(), RxwebValidators.maxLength({value:50 })]}],
      nume:['', {validators:[RxwebValidators.required(), RxwebValidators.maxLength({value:255 })]}],
      um: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],
      perCutie: [null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      pret: [null, {validators:[RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      greutatePerUm: [null, {validators:[RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      codVamal: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],
      active: true
    });
    if(this.model !== undefined)
    {
      this.form.patchValue(this.model);
    }    
  }

  saveProduse(){
    //this.router.navigate(['/clienti'])
    this.onSaveChanges.emit(this.form.value);
  }

}
