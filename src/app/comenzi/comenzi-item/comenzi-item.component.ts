import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { arhitectiDTO } from 'src/app/nomenclatoare/arhitecti/arhitecti-item/arhitecti.model';
import { clientiDTO } from 'src/app/nomenclatoare/clienti/clienti-item/clienti.model';
import { ComenziService } from '../comenzi.service';
import { comenziDTO, produseComandaDTO } from './comenzi.model';

@Component({
  selector: 'app-comenzi-item',
  templateUrl: './comenzi-item.component.html',
  styleUrls: ['./comenzi-item.component.scss']
})
export class ComenziItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private formBuilder:FormBuilder, private comenziService: ComenziService) { }
  @Input()
  model:comenziDTO | undefined;
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
      numar:[null, {validators:[Validators.required]}],
      data:[new Date(), {validators:[Validators.required]}],
      clientId:[null, {validators:[Validators.required]}],
      arhitectId: null,      
      avans: null,
      conditiiPlata: '',
      termenLivrare: null,
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
  }

  saveChanges(){
    const produse = this.selectedProdus.map(val => {
      return {id: val.id, cantitate: val.cantitate, furnizorId: val.furnizorId, produsId: val.produsId, oferteProdusId: val.oferteProdusId,
        umId:val.umId, um: val.um, cutii: val.cutii, pretUm: val.pretUm, valoare: val.valoare}
    });
    console.log('set produse', produse);
    this.form.get('comenziProduses')?.setValue(produse);
    
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
