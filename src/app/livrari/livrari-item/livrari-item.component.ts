import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';
import { LivrariService } from '../livrari.service';
import { LivrariDTO, livrariProduseDTO } from './livrari.model';

@Component({
    selector: 'app-livrari-item',
    templateUrl: './livrari-item.component.html',
    styleUrls: ['./livrari-item.component.scss'],
    standalone: false
})
export class LivrariItemComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  constructor(private formBuilder:FormBuilder, private dialog: MatDialog,
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
      .pipe(takeUntilDestroyed(this.destroyRef))
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
    if(produse.filter(produse=>produse.livrat== true).length > 0 && (this.form.get('curier')?.value ==null || this.form.get('curier')?.value == '')){
      this.dialog.open(MessageDialogComponent, {data:{title: "Atentie!", message: "Nu ati selectat nici un curier!"}});
      return;
    }
    this.form.get('livrariProduse')?.setValue(produse);
    if(this.form.valid)
      this.onSaveChanges.emit(this.form.value);
  }

}
