import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { arhitectiDTO } from 'src/app/nomenclatoare/arhitecti/arhitecti-item/arhitecti.model';
import { clientiDTO } from 'src/app/nomenclatoare/clienti/clienti-item/clienti.model';
import { produseOfertaDTO } from 'src/app/nomenclatoare/produse/produse-item/produse.model';
import { OferteService } from '../oferte.service';
import { oferteDTO } from './oferte.model';

@Component({
  selector: 'app-oferte-item',
  templateUrl: './oferte-item.component.html',
  styleUrls: ['./oferte-item.component.scss']
})
export class OferteItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private formBuilder:FormBuilder, private oferteService: OferteService) { }
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
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });

    this.form = this.formBuilder.group({
      numar:[null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:false })]}],
      data:[new Date(), {validators:[Validators.required]}],
      clientId:[null, {validators:[Validators.required]}],
      arhitectId: null,      
      avans: [null, {validators:[RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber, allowDecimal:true })]}],
      conditiiPlata: ['', {validators:[RxwebValidators.maxLength({value:250 })]}],
      termenLivrare: null,
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
      this.oferteService.getNextNumber().subscribe(data=>{
        this.form.get('numar')?.setValue(data);
        console.log('next number assigne', data);
      });
    }
  }

  saveChanges(){
    const produse = this.selectedProdus.map(val => {
      return {id: val.id??0, cantitate: val.cantitate??0, furnizorId: val.furnizorId, produsId: val.produsId,
        umId:val.umId, um: val.um, cutii: val.cutii??0, pretUm: val.pretUm??0, valoare: val.valoare??0}
    });
    console.log('set produse', produse);
    this.form.get('produse')?.setValue(produse);
    
    this.onSaveChanges.emit(this.form.value);
  }

  selectClient(clientId: string){
    this.form.get('clientId')?.setValue(clientId);
    console.log('clientNume: ', this.form.get('clientId')?.value);
  }

  selectArhitect(arhitectId: string){
    this.form.get('arhitectId')?.setValue(arhitectId);
    console.log('arhitectId: ', this.form.get('arhitectId')?.value);
  }
}
