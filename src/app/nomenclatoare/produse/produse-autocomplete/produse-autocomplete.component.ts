import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators  } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { produseDTO, produseOfertaDTO } from '../produse-item/produse.model';
import { ProduseService } from '../produse.service';

@Component({
  selector: 'app-produse-autocomplete',
  templateUrl: './produse-autocomplete.component.html',
  styleUrls: ['./produse-autocomplete.component.scss']
})
export class ProduseAutocompleteComponent implements OnInit {

  produse: produseDTO[]
  constructor(private activatedRoute: ActivatedRoute, private formBuilder:FormBuilder, private produseService: ProduseService) { 
    this.produse = [];   

    this.selectedProdus = new Observable<produseOfertaDTO[]>();
    this.selectedProdus = this.produsCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.produse.slice())
      );    
  }

  produsCtrl: FormControl = new FormControl();

  selectedProdus: any;
  @Input()
  preselectedProdus: produseOfertaDTO[] | undefined;

  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();
  
  ngOnInit(): void {    
    this.loadProduseList();    
  }

  loadProduseList(){    
    this.produseService.getAll().subscribe(produse=>{
      this.produse = produse;
      console.log(this.produse);
      this.produsCtrl.setValue(this.preselectedProdus);
    });    
  }

  optionSelected(event: MatAutocompleteSelectedEvent){    
    this.onOptionSelected.emit(event.option.value);
  }

  private _filterStates(value: string): produseDTO[] {
    const filterValue = value;
    return this.produse.filter(p => p.nume.includes(filterValue));
  }

  displayFn(produs: produseDTO): string {
    return produs && produs.nume ? produs.nume : '';
  }
}
