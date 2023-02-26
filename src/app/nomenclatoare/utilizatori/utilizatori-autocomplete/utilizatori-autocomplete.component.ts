import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UtilizatoriDTO } from 'src/app/security/security.models';
import { SecurityService } from 'src/app/security/security.service';

@Component({
  selector: 'app-utilizatori-autocomplete',
  templateUrl: './utilizatori-autocomplete.component.html',
  styleUrls: ['./utilizatori-autocomplete.component.scss']
})
export class UtilizatoriAutocompleteComponent implements OnInit, AfterViewInit, OnDestroy {

  utilizatori: UtilizatoriDTO[];
  utilizatorCtrl: FormControl = new FormControl();
  selectedUtilizator: any;
  @Input()
  preselectUtilizator: UtilizatoriDTO | undefined;

  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();
  subscription: Subscription | undefined;
  @ViewChild(MatAutocompleteTrigger) 
  trigger!: MatAutocompleteTrigger;
  constructor(private securitySevice: SecurityService) {
    this.utilizatori = [];
    this.selectedUtilizator = new Observable<UtilizatoriDTO[]>();
    this.selectedUtilizator = this.utilizatorCtrl.valueChanges
      .pipe(
        startWith(''),
        map(c => c ? this._filterStates(c) : this.utilizatori.slice())
      );
   }  

  ngOnInit(): void {
    this.loadUtilizatoriList();
  }

  loadUtilizatoriList(){
    this.securitySevice.getUsers().subscribe(utilizatori=>{
      this.utilizatori = utilizatori;
      console.log('utilizatori:', this.utilizatori);
      this.utilizatorCtrl.setValue(this.preselectUtilizator);
    });    
  }

  private _filterStates(value: string): UtilizatoriDTO[] {
    const filterValue = (typeof value === 'string' ? value.toLowerCase() : value);
    return this.utilizatori.filter(p => p.name.toLowerCase().includes(filterValue));
  }

  displayFn(utilizator: UtilizatoriDTO): string {
    console.log('utilizator auto:', utilizator);
    return utilizator && utilizator.name ? utilizator.name : '';
  }

  optionSelected(event: MatAutocompleteSelectedEvent){    
    this.preselectUtilizator = event.option.value;
    this.onOptionSelected.emit(event.option.value);
  }

  ngAfterViewInit() {
    this._subscribeToClosingActions();
  }

  private _subscribeToClosingActions(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.trigger.panelClosingActions
      .subscribe(e => {
        if (!e || !e.source) {
          if(this.preselectUtilizator == undefined)//daca nu are nimic selectat, scrisul este sters
            this.utilizatorCtrl.setValue(null);
          if(this.utilizatorCtrl.value == '') //daca scrisul este gol atunci trimit ca nimic selectat
            this.onOptionSelected.emit(undefined);
        }
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
