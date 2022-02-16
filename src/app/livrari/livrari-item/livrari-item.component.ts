import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { clientiDTO } from 'src/app/nomenclatoare/clienti/clienti-item/clienti.model';
import { ClientiService } from 'src/app/nomenclatoare/clienti/clienti.service';
import { LivrariService } from '../livrari.service';
import { LivrariDTO, livrariProduseDTO } from './livrari.model';

@Component({
  selector: 'app-livrari-item',
  templateUrl: './livrari-item.component.html',
  styleUrls: ['./livrari-item.component.scss']
})
export class LivrariItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private formBuilder:FormBuilder, 
    private livrariService: LivrariService, private clientiService: ClientiService) { }

  @Input() model:LivrariDTO | undefined;  
  @Input() preselectClient: clientiDTO | undefined;
  @Input() selectedProdus: livrariProduseDTO[] = [];
  public form!: FormGroup;

  @Output() onSaveChanges: EventEmitter<LivrariDTO> = new EventEmitter<LivrariDTO>();

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      numar:[null, {validators:[RxwebValidators.required()]}],
      data:[new Date(), {validators:[RxwebValidators.required()]}],
      clientId:[null, {validators:[RxwebValidators.required()]}],
      curier: null,      
      receptionatDe: null,      
      detalii: null,
      livrariProduse:''      
    });    
    
    if(this.model !== undefined)
    {
      //on edit form
      this.form.patchValue(this.model);      
    }    
  }

  selectClient(clientId: string){
    this.form.get('clientId')?.setValue(clientId);
    console.log('clientNume: ', this.form.get('clientId')?.value);
  }

  saveChanges(){  
    const produse = this.selectedProdus.map(val => {
      return {id: val.id??0, transportProduseId: val.transportProduseId, livrat: val.livrat}
    });
    console.log('set produse', produse);
    this.form.get('livrariProduse')?.setValue(produse);
    console.log('this.form.value', this.form.value);
    this.onSaveChanges.emit(this.form.value);
  }

}
