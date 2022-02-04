import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { clientiDTO } from '../clienti-item/clienti.model';
import { ClientiService } from '../clienti.service';

@Component({
  selector: 'app-clienti-autocomplete',
  templateUrl: './clienti-autocomplete.component.html',
  styleUrls: ['./clienti-autocomplete.component.scss']
})
export class ClientiAutocompleteComponent implements OnInit, AfterViewInit, OnDestroy {

  clienti: clientiDTO[];
  constructor(private clientiService: ClientiService) { 
    this.clienti = [];
    
    this.selectedClient = new Observable<clientiDTO[]>();
    // this.selectedClient = this.clientCtrl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(c => c ? this._filterStates(c) : this.clienti.slice())
    //   );
  }
  @ViewChild(MatAutocompleteTrigger) 
  trigger!: MatAutocompleteTrigger;
  
  clientCtrl: FormControl = new FormControl();
  selectedClient: any;
  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();
  
  @Input()
  preselectClient: clientiDTO | undefined;
  
  subscription: Subscription | undefined;
  ngOnInit(): void {
    if(this.preselectClient !=undefined)
      this.clientCtrl.setValue(this.preselectClient);    
  }

  // loadClientList(){
  //   this.clientiService.getAll().subscribe(clienti=>{
  //     this.clienti = clienti;
  //     //console.log('load clienti', this.clienti);
  //     this.clientCtrl.setValue(this.preselectClient);
  //   });    
  // }
  search(event: any){
    //console.log('nume cautat:', nume.target.value);
    let searchTerm = '';
    searchTerm += event.target.value;
    if(searchTerm.length > 2){    
      this.clientiService.search(searchTerm).subscribe(clienti=>{
        this.clienti = clienti;
        console.log('load clienti', clienti);
        this.selectedClient = this.clientCtrl.valueChanges
          .pipe(
            startWith(''),
            map(c => c ? this._filterStates(c) : this.clienti.slice())
          );        
      });
    }
  }
  optionSelected(event: MatAutocompleteSelectedEvent){
    // console.log(event.option);
     console.log(event.option.value.id);
    //this.selectedProdus.push(event.option.value);
    this.onOptionSelected.emit(event.option.value.id);
    //this.produsCtrl.patchValue('');
  }

  private _filterStates(value: string): clientiDTO[] {
    const filterValue = (typeof value === 'string' ? value.toLowerCase() : value);
    return this.clienti.filter(p => p.nume.toLowerCase().includes(filterValue));
  }

  displayFn(user: clientiDTO): string {
    return user && user.nume ? user.nume : '';
  }

  ngAfterViewInit() {
    this._subscribeToClosingActions();    
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  private _subscribeToClosingActions(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.trigger.panelClosingActions
      .subscribe(e => {
        if (!e || !e.source) {
          this.clientCtrl.setValue(null);
          this.onOptionSelected.emit(undefined);
        }
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());
  }

  public clearSelection(){
    this.clientCtrl.setValue(null);
  }
}
