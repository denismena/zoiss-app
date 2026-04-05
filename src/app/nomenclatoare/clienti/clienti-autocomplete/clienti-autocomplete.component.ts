import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {Observable, Subscription, of} from 'rxjs';
import {debounceTime, startWith, switchMap} from 'rxjs/operators';
import { ClientiCreateDialogComponent } from '../clienti-item/clienti-create-dialog/clienti-create-dialog.component';
import { clientiDTO } from '../clienti-item/clienti.model';
import { ClientiService } from '../clienti.service';

@Component({
    selector: 'app-clienti-autocomplete',
    templateUrl: './clienti-autocomplete.component.html',
    styleUrls: ['./clienti-autocomplete.component.scss'],
    standalone: false
})
export class ClientiAutocompleteComponent implements OnInit, AfterViewInit, OnDestroy {

  private destroyRef = inject(DestroyRef);
  constructor(private clientiService: ClientiService, public dialog: MatDialog) {
    this.selectedClient = new Observable<clientiDTO[]>();
  }

  @ViewChild(MatAutocompleteTrigger) 
  trigger!: MatAutocompleteTrigger;
  
  clientCtrl: FormControl = new FormControl();
  selectedClient: Observable<clientiDTO[]>;
  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();
  
  @Input() preselectClient: clientiDTO | undefined;  
  subscription: Subscription | undefined;

  dataFromDialog : any;

  ngOnInit(): void {
    if (this.preselectClient != undefined)
      this.clientCtrl.setValue(this.preselectClient);

    this.selectedClient = this.clientCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      switchMap(value => {
        if (typeof value !== 'string' || value.length <= 2) return of([]);
        return this.clientiService.search(value);
      })
    );
  }
  optionSelected(event: MatAutocompleteSelectedEvent){
    this.preselectClient = event.option.value;
    this.onOptionSelected.emit(event.option.value.id);
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
        setTimeout(() => {
          if (!e || !e.source) {
            if(this.preselectClient == undefined)//daca nu are nimic selectat, scrisul este sters
              this.clientCtrl.setValue(null);          
            if(this.clientCtrl.value == '') //daca scrisul este gol atunci trimit ca nimic selectat
              this.onOptionSelected.emit(undefined);
          }
        }, 0);
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());
  }

  public clearSelection(){
    this.clientCtrl.setValue(null);
  }
  addClientDialog(){
    const dialogRef = this.dialog.open(ClientiCreateDialogComponent,      
      { data:{editId: 0}, width: '900px', height: '750px' });

      dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {      
        if (data.clicked === 'submit') {
          this.dataFromDialog = data.form;
          this.dataFromDialog.id = data.id;
          this.clientCtrl.setValue(this.dataFromDialog);
          this.preselectClient = this.dataFromDialog;
          this.onOptionSelected.emit(this.dataFromDialog.id);
        }
      });
  }
  editClientDialog(){
    if(this.preselectClient == undefined)  return; 
    const dialogRef = this.dialog.open(ClientiCreateDialogComponent,      
      { data:{client: this.preselectClient, editId: this.preselectClient?.id??0}, width: '1000px', height: '750px' });

      dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {      
        if (data.clicked === 'submit') {
          this.dataFromDialog = data.form;
          this.dataFromDialog.id = data.id;
          this.clientCtrl.setValue(this.dataFromDialog);
          this.preselectClient = this.dataFromDialog;
          this.onOptionSelected.emit(this.dataFromDialog.id);
        }
      });

  }
}
