import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { clientiDTO } from 'src/app/nomenclatoare/clienti/clienti-item/clienti.model';
import { ClientiService } from 'src/app/nomenclatoare/clienti/clienti.service';
import Swal from 'sweetalert2';
import { LivrariService } from '../livrari.service';
import { LivrariDTO, livrariProduseDTO } from './livrari.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-livrari-item',
    templateUrl: './livrari-item.component.html',
    styleUrls: ['./livrari-item.component.scss'],
    standalone: false
})
export class LivrariItemComponent implements OnInit, OnDestroy {

  constructor(private formBuilder:FormBuilder, private unsubscribeService: UnsubscribeService, 
    private livrariService: LivrariService) { }

  @Input() model:LivrariDTO | undefined;  
  @Input() clientId: number | undefined;
  @Input() selectedProdus: livrariProduseDTO[] = [];
  livrariProduse!: FormArray;
  public form!: FormGroup;

  @Output() onSaveChanges: EventEmitter<LivrariDTO> = new EventEmitter<LivrariDTO>();

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      numar:[null, {validators:[RxwebValidators.required()]}],
      data:[new Date(new Date().getTime() + 24 * 60 * 60 * 1000), {validators:[RxwebValidators.required()]}],
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
    else{
      //on add form
      this.form.get('clientId')?.setValue(this.clientId);
      this.livrariService.getNextNumber()
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe(data=>{
        console.log(data);
        this.form.get('numar')?.setValue(data);
      });
    }
  }

  selectClient(clientId: string){
    this.form.get('clientId')?.setValue(clientId);
    this.clientId = parseInt(clientId);
  }

  saveChanges(){  
    const produse = this.selectedProdus.map(val => {
      return {id: val.id??0, transportProduseId: val.transportProduseId, comenziProdusId:val.comenziProdusId, livrat: val.livrat}
    });
    if(produse.filter(produse=>produse.livrat== true).length > 0 && this.form.get('curier')?.value ==null){
      Swal.fire({ title: "Atentie!", text: "Nu ati selectat nici un curier!", icon: 'info' });
      return;
    }
    this.form.get('livrariProduse')?.setValue(produse);
    if(this.form.valid)
      this.onSaveChanges.emit(this.form.value);
  }

  ngOnDestroy(): void {}
}
