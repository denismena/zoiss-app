import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {Observable, Subscription, of} from 'rxjs';
import {debounceTime, startWith, switchMap} from 'rxjs/operators';
import { FurnizoriCreateDialogComponent } from '../furnizori-item/furnizori-create-dialog/furnizori-create-dialog.component';
import { furnizoriDTO } from '../furnizori-item/furnizori.model';
import { FurnizoriService } from '../furnizori.service';

@Component({
    selector: 'app-furnizori-autocomplete',
    templateUrl: './furnizori-autocomplete.component.html',
    styleUrls: ['./furnizori-autocomplete.component.scss'],
    standalone: false
})
export class FurnizoriAutocompleteComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  private destroyRef = inject(DestroyRef);

  constructor(private furnizorService: FurnizoriService, public dialog: MatDialog) {
    this.selectedFurnizor = new Observable<furnizoriDTO[]>();
  }
  @ViewChild(MatAutocompleteTrigger) 
  trigger!: MatAutocompleteTrigger;

  furnizorCtrl: FormControl = new FormControl();
  selectedFurnizor: Observable<furnizoriDTO[]>;
  
  @Input() preselectFurnizor: furnizoriDTO | undefined;
  @Output() onOptionSelected: EventEmitter<string> = new EventEmitter<string>();

  subscription: Subscription | undefined;
  dataFromDialog : any;
  ngOnInit(): void {
    if (this.preselectFurnizor != undefined)
      this.furnizorCtrl.setValue(this.preselectFurnizor);

    this.selectedFurnizor = this.furnizorCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      switchMap(value => {
        if (typeof value !== 'string' || value.length <= 2) return of([]);
        return this.furnizorService.search(value);
      })
    );
  }
  ngOnChanges() {
    if (this.preselectFurnizor != undefined)
      this.furnizorCtrl.setValue(this.preselectFurnizor);
  }

  optionSelected(event: MatAutocompleteSelectedEvent){
    this.preselectFurnizor = event.option.value;  
    this.onOptionSelected.emit(event.option.value);
  }

  displayFn(furn: furnizoriDTO): string {
    return furn && furn.nume ? furn.nume : '';
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
            if(this.preselectFurnizor == undefined)//daca nu are nimic selectat, scrisul este sters
              this.furnizorCtrl.setValue(null);
            if(this.furnizorCtrl.value == '') //daca scrisul este gol atunci trimit ca nimic selectat
              this.onOptionSelected.emit(undefined);
          }
        }, 0);
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions());
  }
  public clearSelection(){
    this.furnizorCtrl.setValue(null);
  }

  addFurnizorDialog(){
    const dialogRef = this.dialog.open(FurnizoriCreateDialogComponent,      
      { data:{editId:0}, width: '800px', height: '750px' });

      dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {      
        if (data.clicked === 'submit') {
          this.dataFromDialog = data.form;
          this.dataFromDialog.id = data.id;
          this.furnizorCtrl.setValue(this.dataFromDialog);
          this.preselectFurnizor = this.dataFromDialog;
          this.onOptionSelected.emit(this.dataFromDialog);
        }
      });
  }

  editFurnizorDialog(){
    if(this.preselectFurnizor == undefined)  return; 
    const dialogRef = this.dialog.open(FurnizoriCreateDialogComponent,      
      { data:{furnizor: this.preselectFurnizor, editId: this.preselectFurnizor?.id??0}, width: '800px', height: '750px' });

      dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {      
        if (data.clicked === 'submit') {
          this.dataFromDialog = data.form;
          this.dataFromDialog.id = data.id;
          this.furnizorCtrl.setValue(this.dataFromDialog);
          this.preselectFurnizor = this.dataFromDialog;
          this.onOptionSelected.emit(this.dataFromDialog);
        }
      });
  }  
}
