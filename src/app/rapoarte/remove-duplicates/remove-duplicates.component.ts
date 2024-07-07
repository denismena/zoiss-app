import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { furnizoriDTO } from 'src/app/nomenclatoare/furnizori/furnizori-item/furnizori.model';
import { produseDTO } from 'src/app/nomenclatoare/produse/produse-item/produse.model';
import { RapoarteService } from '../rapoarte.service';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { ProduseAutocompleteComponent } from 'src/app/nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';
import { FurnizoriAutocompleteComponent } from 'src/app/nomenclatoare/furnizori/furnizori-autocomplete/furnizori-autocomplete.component';
import { ClientiAutocompleteComponent } from 'src/app/nomenclatoare/clienti/clienti-autocomplete/clienti-autocomplete.component';
import { ClientiService } from 'src/app/nomenclatoare/clienti/clienti.service';
@Component({
  selector: 'app-remove-duplicates',  
  templateUrl: './remove-duplicates.component.html',
  styleUrls: ['./remove-duplicates.component.scss']
})
export class RemoveDuplicatesComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) produseTable!: MatTable<any>;
  @ViewChild(MatTable) furnizorTable!: MatTable<any>;
  @ViewChild(MatTable) clientTable!: MatTable<any>;
  @ViewChild('produsAuto') produsAuto!: ProduseAutocompleteComponent;
  @ViewChild('produsSters') produsSters!: ProduseAutocompleteComponent;
  @ViewChild('furnizoriAuto') furnizoriAuto!: FurnizoriAutocompleteComponent;
  @ViewChild('furnizorSters') furnizorSters!: FurnizoriAutocompleteComponent;
  @ViewChild('clientAuto') clientAuto!: ClientiAutocompleteComponent;
  @ViewChild('clientSters') clientSters!: ClientiAutocompleteComponent;
  errors: string[] = [];
  public formProduse!: FormGroup;
  public formFurnizor!: FormGroup;
  public fromClienti!: FormGroup;
  duplicatesProduse: number[] = [];
  duplicatesProduseDTO: produseDTO[] = [];  
  duplicatesFurnizor: number[] = [];
  duplicatesFurnizorDTO: furnizoriDTO[] = [];
  duplicatesClienti: number[] = [];
  duplicatesClientiDTO: any[] = [];
  columnsToDisplay = ['codProdus', 'produsNume', 'furnizorNume', 'actions']
  columnsToDisplayFurn = ['#', 'nume', 'adresa', 'actions']
  columnsToDisplayClient = ['#', 'nume', 'cnp/cui', 'adresa', 'actions']
 
  constructor(private formBuilder:FormBuilder, private rapoarteService: RapoarteService, private unsubscribeService: UnsubscribeService,
    private clientiService: ClientiService) { }
  
  ngOnInit(): void {
    this.formProduse = this.formBuilder.group({
      keepId:[null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:false })]}],
      removeListId: [null, {validators:[RxwebValidators.required()]}],
    });

    this.formFurnizor = this.formBuilder.group({
      keepId:[null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:false })]}],
      removeListId: [null, {validators:[RxwebValidators.required()]}],
    });
    
    this.fromClienti = this.formBuilder.group({
      keepId:[null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:false })]}],
      removeListId: [null, {validators:[RxwebValidators.required()]}],
    });
  }

  //Produse
  selectProdusPastrat(produs: any) {
    this.formProduse.patchValue({keepId: produs.id});
  }

  selectProdusSters(produs: any) {
    this.duplicatesProduse.push(produs.id);
    this.duplicatesProduseDTO.push(produs);
    this.formProduse.patchValue({removeListId: this.duplicatesProduse});
    this.produsSters.clearSelection();
    if(this.produseTable !== undefined)
      this.produseTable.renderRows();
  }

  removeProdus(produs:any) {
    const index = this.duplicatesProduseDTO.findIndex(a => a.id === produs.id);
    this.duplicatesProduseDTO.splice(index, 1);
    this.duplicatesProduse.splice(index, 1);
    this.formProduse.patchValue({removeListId: this.duplicatesProduse});
    this.produseTable.renderRows();
  }

  saveChangesProdus() {
    this.rapoarteService.removeDuplicatesProduse(this.formProduse.value)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{
      this.formProduse.reset();
      this.produsAuto.clearSelection();
      this.produsSters.clearSelection();
      this.duplicatesProduseDTO = [];
      this.produseTable.renderRows();
    }, 
    error=> this.errors = parseWebAPIErrors(error));  
  }
  //end Produse

  //Furnizori
  selectFurnizorPastrat(furnizor: any) {
    this.formFurnizor.patchValue({keepId: furnizor.id});
  }

  selectFurnizorSters(furnizor: any) {
    this.duplicatesFurnizor.push(furnizor.id);
    this.duplicatesFurnizorDTO.push(furnizor);
    this.formFurnizor.patchValue({removeListId: this.duplicatesFurnizor});
    this.furnizorSters.clearSelection();
    if(this.furnizorTable !== undefined)
      this.furnizorTable.renderRows();
  }

  removeFurnizor(furnizor:any) {
    const index = this.duplicatesFurnizorDTO.findIndex(a => a.id === furnizor.id);
    this.duplicatesFurnizorDTO.splice(index, 1);
    this.duplicatesFurnizor.splice(index, 1);
    this.formFurnizor.patchValue({removeListId: this.duplicatesFurnizor});
    this.furnizorTable.renderRows();
  }

  saveChangesFurnizor() {
    this.rapoarteService.removeDuplicatesFurnizori(this.formFurnizor.value)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{
      this.formFurnizor.reset();
      this.duplicatesFurnizorDTO = [];
      this.furnizoriAuto.clearSelection();
      this.furnizorSters.clearSelection();
      this.furnizorTable.renderRows();
    }, 
    error=> this.errors = parseWebAPIErrors(error));
  }
  //end Furnizori
  
  //Clienti
  selectClientPastrat(client: any) {
    this.fromClienti.patchValue({keepId: client});
  }

  selectClientSters(client: any) {
    console.log('client', client);
    this.duplicatesClienti.push(client);
    this.loadAdrese(client).subscribe((detaliiClient:any)=>{
      this.duplicatesClientiDTO.push(detaliiClient);
      this.fromClienti.patchValue({removeListId: this.duplicatesClienti});
      this.clientSters.clearSelection();
      console.log('this.fromClienti', this.fromClienti.value, this.fromClienti);
      if(this.clientTable !== undefined)
        this.clientTable.renderRows();
    });
  }

  loadAdrese(clientId: number) {
    return this.clientiService.getById(clientId)
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$));
  }

  removeClient(client:any) {
    const index = this.duplicatesClientiDTO.findIndex(a => a.id === client.id);
    this.duplicatesClientiDTO.splice(index, 1);
    this.duplicatesClienti.splice(index, 1);
    this.fromClienti.patchValue({removeListId: this.duplicatesClienti});
    this.clientTable.renderRows();
  }

  saveChangesClienti() {
    this.rapoarteService.removeDuplicatesClienti(this.fromClienti.value)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{
      this.fromClienti.reset();
      this.duplicatesClientiDTO = [];
      this.clientAuto.clearSelection();
      this.clientSters.clearSelection();
      this.clientTable.renderRows();
    }, 
    error=> this.errors = parseWebAPIErrors(error)); 
  }  
  //end Clienti

  ngOnDestroy(): void {}

}
