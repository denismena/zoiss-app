import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { nirDTO, produseNirDTO } from './nir.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { NIRService } from '../nir.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-nir-item',
  templateUrl: './nir-item.component.html',
  styleUrls: ['./nir-item.component.scss']
})
export class NirItemComponent implements OnInit, OnDestroy{
  @Input() model:nirDTO | undefined;
  @Input() selectedProdus: produseNirDTO[] = [];  
  @Output() onSaveChanges: EventEmitter<nirDTO> = new EventEmitter<nirDTO>();
  public form!: FormGroup;

  constructor(private formBuilder:FormBuilder, private nirService: NIRService, private unsubscribeService: UnsubscribeService ) { }
  
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      numar:[null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:false })]}],
      data:[new Date(), {validators:[Validators.required]}],
      detalii: null,
      produse: ''
    });

    if(this.model !== undefined)
    {
      //on edit form
      this.form.patchValue(this.model);      
    }
    else 
    {      
      //on add form get the next contract number
      this.nirService.getNextNumber()
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(data=>{
        this.form.get('numar')?.setValue(data);
        console.log('next number assigne', data);
      });
    }
  }

  saveChanges(){
    const produse = this.selectedProdus.map(val => {
      return {id: val.id??0, cantitate: val.cantitate??0, furnizorId: val.furnizorId, produsId: val.produsId,
        umId:val.umId, um: val.um }
    });
    this.form.get('produse')?.setValue(produse);
    if(this.form.valid)
      this.onSaveChanges.emit(this.form.value);
  }

  ngOnDestroy(): void {}
}
