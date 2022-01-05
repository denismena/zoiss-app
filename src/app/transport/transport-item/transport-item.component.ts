import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { depoziteDTO } from 'src/app/nomenclatoare/depozite/depozite-item/depozite.model';
import { transportatorDTO } from 'src/app/nomenclatoare/transportator/transportator-item/transportator.model';
import { TransporatorService } from 'src/app/nomenclatoare/transportator/transportator.service';
import { TransportService } from '../transport.service';
import { transportDTO, transportProduseDTO } from './transport.model';

@Component({
  selector: 'app-transport-item',
  templateUrl: './transport-item.component.html',
  styleUrls: ['./transport-item.component.scss']
})
export class TransportItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private formBuilder:FormBuilder, 
    private transportService: TransportService, private transportatorService: TransporatorService) { }
  @Input()
  model:transportDTO | undefined;
  @Input()
  selectedProdus: transportProduseDTO[] = [];
  @Input()
  depoziteLista: string[]=[];
  
  public form!: FormGroup;
  transportatorList: transportatorDTO[]=[];
  @Output()
  onSaveChanges: EventEmitter<transportDTO> = new EventEmitter<transportDTO>();
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });

    this.form = this.formBuilder.group({
      transportatorId:[null, {validators:[RxwebValidators.required()]}],
      referinta:[null, {validators:[RxwebValidators.required()]}],
      data:[new Date(), {validators:[RxwebValidators.required()]}],
      adresa: null,
      detalii: null,
      transportProduse: ''
    });    
    this.transportatorService.getAll().subscribe(trans=>{
      this.transportatorList=trans;
    })
    if(this.model !== undefined)
    {
      //on edit form
      this.form.patchValue(this.model);      
    }
  }

  selectTransportator(trans: any){       
    console.log('trans.source.triggerValue', trans.value);
    this.form.get('transportatorId')?.setValue(trans.value);
  }

  saveChanges(){
    // const produse = this.selectedProdus.map(val => {
    //   console.log('saveChanges: ', val);
    //   return {id: val.id, cantitate: val.cantitate, produsId: val.produsId, comenziProdusId: val.comenziProdusId,
    //     umId:val.umId, um: val.um, cutii: val.cutii, pretUm: val.pretUm, valoare: val.valoare, 
    //     disponibilitate:val.disponibilitate, discount: val.discount, detalii:val.detalii}
    // });
    // console.log('set produse', produse);
    // this.form.get('transportProduse')?.setValue(produse);
    
    console.log('this.form.value', this.form.value);
    this.onSaveChanges.emit(this.form.value);
  }

}
