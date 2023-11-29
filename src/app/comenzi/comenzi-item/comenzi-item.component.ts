import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { arhitectiDTO } from 'src/app/nomenclatoare/arhitecti/arhitecti-item/arhitecti.model';
import { clientiAdresaDTO, clientiDTO } from 'src/app/nomenclatoare/clienti/clienti-item/clienti.model';
import { ClientiService } from 'src/app/nomenclatoare/clienti/clienti.service';
import { UtilizatoriDTO } from 'src/app/security/security.models';
import { SecurityService } from 'src/app/security/security.service';
import { ComenziService } from '../comenzi.service';
import { comenziDTO, produseComandaDTO } from './comenzi.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-comenzi-item',
  templateUrl: './comenzi-item.component.html',
  styleUrls: ['./comenzi-item.component.scss']
})
export class ComenziItemComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute, private formBuilder:FormBuilder, private unsubscribeService: UnsubscribeService,
    private comenziService: ComenziService, private clientiService: ClientiService, private securityService: SecurityService) { }
  @Input()
  model:comenziDTO | undefined;
  adresa: clientiAdresaDTO[] | undefined;
  preselectUtilizator: UtilizatoriDTO | undefined;
  public form!: FormGroup;

  @Input()
  selectedProdus: produseComandaDTO[] = [];
  
  @Input()
  preselectClient: clientiDTO | undefined;

  @Input()
  preselectArhitect: arhitectiDTO | undefined;    

  @Output()
  onSaveChanges: EventEmitter<comenziDTO> = new EventEmitter<comenziDTO>();

  ngOnInit(): void {   

    this.form = this.formBuilder.group({
      numar:[null, {validators:[RxwebValidators.required()]}],
      data:[new Date(), {validators:[RxwebValidators.required()]}],
      clientId:[null, {validators:[RxwebValidators.required()]}],
      arhitectId: null,      
      avans: [null, {validators:[RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber, allowDecimal:true })]}],
      facturaAvans: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],
      comision: [null, {validators:[RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber, allowDecimal:true })]}],
      conditiiPlata: ['50% avans, 50% inainte de livrare', {validators:[RxwebValidators.maxLength({value:250 })]}],
      termenLivrare: ['', {validators:[RxwebValidators.maxLength({value:255 })]}],
      conditiiLivrare:['Transportul este asigurat până în fața locuinței, iar descărcarea și manipularea produselor cad în sarcina clientului.', {validators:[RxwebValidators.maxLength({value:255 })]}],
      observatii: ['', {validators:[RxwebValidators.maxLength({value:255 })]}],
      platit: null,
      arhitectPlatit: null,
      clientiAdresaId: [null, {validators:[RxwebValidators.required()]}],
      comenziProduses: '',
      utilizatorId: [null, {validators:[RxwebValidators.required()]}],
    });    
    
    if(this.model !== undefined)
    {
      //on edit form
      this.form.patchValue(this.model);      
    }    
    else 
    {      
      //on add form get the next contract number
      this.comenziService.getNextNumber()
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(data=>{
        this.form.get('numar')?.setValue(data);
      });
    }
    if(this.form.get('clientId')?.value)
      this.loadAdrese(this.form.get('clientId')?.value);
    
    if(this.form.get('utilizatorId')?.value){
      this.securityService.getById(this.form.get('utilizatorId')?.value)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(utilizator => {
        this.preselectUtilizator = utilizator;
        if(this.model !== undefined)
        {
          this.form.patchValue(this.model);
        }
      });
    }
  }

  loadAdrese(clientId: number)
  {
    this.clientiService.getById(clientId)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(adresa=>{
      this.adresa = adresa.adrese.filter(a=>a.livrare == true);
    });
  }

  saveChanges(){
    const produse = this.selectedProdus.map(val => {
      return {id: val.id??0, cantitate: val.cantitate??0, furnizorId: val.furnizorId, produsId: val.produsId, oferteProdusId: val.oferteProdusId,
        umId:val.umId??1, um: val.um, cutii: val.cutii??0, pretUm: val.pretUm??0, valoare: val.valoare??0, discount: val.discount, isStoc: val.isStoc??false}
    });
    this.form.get('comenziProduses')?.setValue(produse);
    if(this.form.valid)
      this.onSaveChanges.emit(this.form.value);
  }

  selectClient(clientId: string){
    this.form.get('clientId')?.setValue(clientId);
    this.loadAdrese(Number(clientId));
  }

  selectArhitect(arhitect: any){    
    this.form.get('arhitectId')?.setValue(arhitect?.id);    
    this.form.get('comision')?.setValue(arhitect?.comision);    
  }

  selectUtilizator(utilizator: any){    
    this.form.get('utilizatorId')?.setValue(utilizator?.id);
  }
  ngOnDestroy(): void {}
}
