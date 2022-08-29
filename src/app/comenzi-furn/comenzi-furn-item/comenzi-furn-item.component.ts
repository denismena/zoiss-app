import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ComenziFurnizorService } from '../comenzi-furn.service';
import { comenziFurnizorDTO, produseComandaFurnizorDTO } from './comenzi-furn.model';

@Component({
  selector: 'app-comenzi-furn-item',
  templateUrl: './comenzi-furn-item.component.html',
  styleUrls: ['./comenzi-furn-item.component.scss']
})
export class ComenziFurnItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private formBuilder:UntypedFormBuilder, private comenziFurnizorService: ComenziFurnizorService) { }

  @Input()
  model:comenziFurnizorDTO | undefined;
  public form!: UntypedFormGroup;

  @Input()
  selectedProdus: produseComandaFurnizorDTO[] = [];

  @Output()
  onSaveChanges: EventEmitter<comenziFurnizorDTO> = new EventEmitter<comenziFurnizorDTO>();
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });

    this.form = this.formBuilder.group({
      numar:[null, {validators:[RxwebValidators.required()]}],
      data:[new Date(), {validators:[RxwebValidators.required()]}],      
      termenLivrare: ['', {validators:[RxwebValidators.maxLength({value:255 })]}],
      comenziFurnizoriProduse: ''
    });    
    
    if(this.model !== undefined)
    {
      //on edit form
      this.form.patchValue(this.model);      
    }    
    else 
    {      
      //on add form get the next contract number
      this.comenziFurnizorService.getNextNumber().subscribe(data=>{
        this.form.get('numar')?.setValue(data);
      });
    }
  }

  saveChanges(){
    const produse = this.selectedProdus.map(val => {
      console.log('saveChanges: ', val);
      return {id: val.id, cantitate: val.cantitate, produsId: val.produsId, comenziProdusId: val.comenziProdusId,
        umId:val.umId, um: val.um, cutii: val.cutii, pretUm: val.pretUm, valoare: val.valoare, 
        disponibilitate:val.disponibilitate, detalii:val.detalii}
    });
    console.log('set produse', produse);
    this.form.get('comenziFurnizoriProduse')?.setValue(produse);
    if(this.form.valid)
      this.onSaveChanges.emit(this.form.value);
  }

}
