import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { arhitectiDTO } from 'src/app/nomenclatoare/arhitecti/arhitecti-item/arhitecti.model';
import { clientiAdresaDTO, clientiDTO } from 'src/app/nomenclatoare/clienti/clienti-item/clienti.model';
import { ClientiService } from 'src/app/nomenclatoare/clienti/clienti.service';
import { ComenziService } from '../comenzi.service';
import { comenziDTO, produseComandaDTO } from './comenzi.model';

@Component({
  selector: 'app-comenzi-item',
  templateUrl: './comenzi-item.component.html',
  styleUrls: ['./comenzi-item.component.scss']
})
export class ComenziItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private formBuilder:FormBuilder, 
    private comenziService: ComenziService, private clientiService: ClientiService) { }
  @Input()
  model:comenziDTO | undefined;
  adresa: clientiAdresaDTO[] | undefined;
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
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });

    this.form = this.formBuilder.group({
      numar:[null, {validators:[RxwebValidators.required()]}],
      data:[new Date(), {validators:[RxwebValidators.required()]}],
      clientId:[null, {validators:[RxwebValidators.required()]}],
      arhitectId: null,      
      avans: null,
      conditiiPlata: '',
      termenLivrare: null,
      platit: null,
      clientiAdresaId: [null, {validators:[RxwebValidators.required()]}],
      comenziProduses: ''
    });    
    
    if(this.model !== undefined)
    {
      //on edit form
      this.form.patchValue(this.model);      
    }    
    else 
    {      
      //on add form get the next contract number
      this.comenziService.getNextNumber().subscribe(data=>{
        this.form.get('numar')?.setValue(data);
        console.log('next number assigne', data);
      });
    }
    if(this.form.get('clientId')?.value)
      this.loadAdrese(this.form.get('clientId')?.value);
  }

  loadAdrese(clientId: number)
  {
    this.clientiService.getById(clientId).subscribe(adresa=>{
      //console.log('adrese inainte', adresa.adrese);
      this.adresa = adresa.adrese.filter(a=>a.livrare == true);
      //console.log('adresa filtrata', this.adresa);
    });
  }

  saveChanges(){
    const produse = this.selectedProdus.map(val => {
      return {id: val.id??0, cantitate: val.cantitate??0, furnizorId: val.furnizorId, produsId: val.produsId, oferteProdusId: val.oferteProdusId,
        umId:val.umId??1, um: val.um, cutii: val.cutii??0, pretUm: val.pretUm??0, valoare: val.valoare??0, discount: val.discount, isStoc: val.isStoc??false}
    });
    console.log('set produse', produse);
    this.form.get('comenziProduses')?.setValue(produse);
    
    this.onSaveChanges.emit(this.form.value);
  }

  selectClient(clientId: string){
    this.form.get('clientId')?.setValue(clientId);
    this.loadAdrese(Number(clientId));
    console.log('clientNume: ', this.form.get('clientId')?.value);
  }

  selectArhitect(arhitectId: string){
    this.form.get('arhitectId')?.setValue(arhitectId);
    console.log('arhitectId: ', this.form.get('arhitectId')?.value);
  }

}
