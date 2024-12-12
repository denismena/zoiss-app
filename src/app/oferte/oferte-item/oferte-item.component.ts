import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { arhitectiDTO } from 'src/app/nomenclatoare/arhitecti/arhitecti-item/arhitecti.model';
import { clientiDTO } from 'src/app/nomenclatoare/clienti/clienti-item/clienti.model';
import { produseOfertaDTO } from 'src/app/nomenclatoare/produse/produse-item/produse.model';
import { OferteService } from '../oferte.service';
import { oferteDTO } from './oferte.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-oferte-item',
    templateUrl: './oferte-item.component.html',
    styleUrls: ['./oferte-item.component.scss'],
    standalone: false
})
export class OferteItemComponent implements OnInit, OnDestroy {

  constructor(private formBuilder:FormBuilder, private oferteService: OferteService, private unsubscribeService: UnsubscribeService ) { }
  @Input()
  model:oferteDTO | undefined;
  public form!: FormGroup;

  @Input()
  selectedProdus: produseOfertaDTO[] = [];
  
  @Input()
  preselectClient: clientiDTO | undefined;

  @Input()
  preselectArhitect: arhitectiDTO | undefined;

  @Output()
  onSaveChanges: EventEmitter<oferteDTO> = new EventEmitter<oferteDTO>();

  

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      numar:[null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:false })]}],
      data:[new Date(), {validators:[Validators.required]}],
      clientId:[null, {validators:[Validators.required]}],
      arhitectId: null,      
      avans: [null, {validators:[RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber, allowDecimal:true })]}],
      facturaAvans: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],
      comision: [null, {validators:[RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber, allowDecimal:true })]}],
      conditiiPlata: ['50% avans, 50% inainte de livrare', {validators:[RxwebValidators.maxLength({value:250 })]}],
      termenLivrare: ['', {validators:[RxwebValidators.maxLength({value:255 })]}],
      conditiiLivrare:['Transportul este asigurat până în fața locuinței, iar descărcarea și manipularea produselor cad în sarcina clientului.', {validators:[RxwebValidators.maxLength({value:255 })]}],
      observatii: ['', {validators:[RxwebValidators.maxLength({value:255 })]}],
      valabilitate: ['7 zile', {validators:[RxwebValidators.maxLength({value:255 })]}],
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
      this.oferteService.getNextNumber()
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
        umId:val.umId, um: val.um, cutii: val.cutii??0, pretUm: val.pretUm??0, valoare: val.valoare??0, discount: val.discount, isStoc: val.isStoc??false}
    });
    console.log('set produse', produse);
    this.form.get('produse')?.setValue(produse);
    if(this.form.valid)
      this.onSaveChanges.emit(this.form.value);
  }

  selectClient(clientId: string){
    this.form.get('clientId')?.setValue(clientId);
    console.log('clientNume: ', this.form.get('clientId')?.value);
  }

  selectArhitect(arhitect: any){    
    this.form.get('arhitectId')?.setValue(arhitect?.id);    
    this.form.get('comision')?.setValue(arhitect?.comision);    
  }

  ngOnDestroy(): void {}
}
