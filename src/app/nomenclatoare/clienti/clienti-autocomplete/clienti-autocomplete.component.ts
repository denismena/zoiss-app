import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { clientiDTO } from '../clienti-item/clienti.model';
import { ClientiService } from '../clienti.service';

@Component({
  selector: 'app-clienti-autocomplete',
  templateUrl: './clienti-autocomplete.component.html',
  styleUrls: ['./clienti-autocomplete.component.scss']
})
export class ClientiAutocompleteComponent implements OnInit {

  clienti: clientiDTO[];
  constructor(private clientiService: ClientiService) { 
    this.clienti = [];
    
    this.selectedClient = new Observable<clientiDTO[]>();
    this.selectedClient = this.clientCtrl.valueChanges
      .pipe(
        startWith(''),
        map(c => c ? this._filterStates(c) : this.clienti.slice())
      );
  }
  clientCtrl: FormControl = new FormControl();
  selectedClient: any;
  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();
  
  @Input()
  preselectClient: clientiDTO | undefined;
  
  ngOnInit(): void {
    this.loadClientList();
  }

  loadClientList(){
    this.clientiService.getAll().subscribe(clienti=>{
      this.clienti = clienti;
      console.log('load clienti', this.clienti);
      this.clientCtrl.setValue(this.preselectClient);
    });    
  }

  optionSelected(event: MatAutocompleteSelectedEvent){
    // console.log(event.option);
     console.log(event.option.value.id);
    //this.selectedProdus.push(event.option.value);
    this.onOptionSelected.emit(event.option.value.id);
    //this.produsCtrl.patchValue('');
  }

  private _filterStates(value: string): clientiDTO[] {
    const filterValue = value;
    return this.clienti.filter(p => p.nume.includes(filterValue));
  }

  displayFn(user: clientiDTO): string {
    console.log('am trigeruit ceva la load?', user);
    return user && user.nume ? user.nume : '';
  }
}
