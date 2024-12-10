import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { sucursalaCreationDTO } from './sucursala.model';

@Component({
    selector: 'app-sucursale-item',
    templateUrl: './sucursale-item.component.html',
    styleUrls: ['./sucursale-item.component.scss'],
    standalone: false
})
export class SucursaleItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder) { }
  public form!: FormGroup;
  @Input()
  model!:sucursalaCreationDTO;
  
   @Output()
   onSaveChanges: EventEmitter<sucursalaCreationDTO> = new EventEmitter<sucursalaCreationDTO>();

   ngOnInit(): void {
    this.form = this.formBuilder.group({
      nume:['', {validators:[RxwebValidators.required(), RxwebValidators.maxLength({value:150 })]}],      
    });    
    if(this.model !== undefined)
    {
      this.form.patchValue(this.model);
    }    
  }

  saveProduse(){
    if(this.form.valid)
      this.onSaveChanges.emit(this.form.value);
  }

}
