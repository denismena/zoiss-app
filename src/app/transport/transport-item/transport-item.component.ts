import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { depoziteDTO } from 'src/app/nomenclatoare/depozite/depozite-item/depozite.model';
import { DepoziteService } from 'src/app/nomenclatoare/depozite/depozite.service';
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

  constructor(private formBuilder:FormBuilder, private transportatorService: TransporatorService,
    private depoziteService: DepoziteService) { }
  @Input()
  model:transportDTO | undefined;
  @Input()
  selectedProdus: transportProduseDTO[] = [];
  @Input()
  depoziteLista: string[]=[];
  
  public form!: FormGroup;
  transportatorList: transportatorDTO[]=[];
  depoziteList: depoziteDTO[]=[];
  showModificaDepozit: boolean = false;
  @Output()
  onSaveChanges: EventEmitter<transportDTO> = new EventEmitter<transportDTO>();
    
  ngOnInit(): void {
    // this.activatedRoute.params.subscribe(params=>{
    //   //alert(params.id);
    // });

    this.form = this.formBuilder.group({
      transportatorId:[null, {validators:[RxwebValidators.required()]}],
      referinta:[null, {validators:[RxwebValidators.required()]}],
      data:[new Date(), {validators:[RxwebValidators.required()]}],
      adresa: null,
      detalii: null,
      transportProduse: '',
      newDepozitId:null,
    });    
    
    this.transportatorService.getAll().subscribe(trans=>{
      this.transportatorList=trans;
    })

    this.depoziteService.getAll().subscribe(depozite=>{
      this.depoziteList=depozite;
    })
    
    if(this.model !== undefined)
    {
      //on edit form
      this.form.patchValue(this.model);      
    }
  }

  selectTransportator(trans: any){       
    this.form.get('transportatorId')?.setValue(trans.value);
  }

  selectNewDepozit(depozit: any){       
    this.form.get('newDepozitId')?.setValue(depozit.value);
  }

  saveChanges(){
    console.log('this.selectedProdus', this.selectedProdus);
    const produse = this.selectedProdus.map(val => {
      return {id: val.id, depozitId: val.depozitId, comenziFurnizoriProdusId: val.comenziFurnizoriProdusId, 
        selectedNewDepozit:val.selectedNewDepozit}
    });
    console.log('set produse', produse);
    this.form.get('transportProduse')?.setValue(produse);
    if(this.form.valid)
      this.onSaveChanges.emit(this.form.value);
  }

  modificaDepozitClick(){
    this.showModificaDepozit = !this.showModificaDepozit;
  }
}
