import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { furnizoriDTO } from '../furnizori-item/furnizori.model';
import { FurnizoriService } from '../furnizori.service';

@Component({
  selector: 'app-furnizori-autocomplete',
  templateUrl: './furnizori-autocomplete.component.html',
  styleUrls: ['./furnizori-autocomplete.component.scss']
})
export class FurnizoriAutocompleteComponent implements OnInit {

  furnizori: furnizoriDTO[];
  constructor(private furnizorService: FurnizoriService ) { 
    this.furnizori = [];

    this.selectedFurnizor = new Observable<furnizoriDTO[]>();
    this.selectedFurnizor = this.furnizorCtrl.valueChanges
      .pipe(
        startWith(''),
        map(c => c ? this._filterStates(c) : this.furnizori.slice())
      );
  }

  furnizorCtrl: FormControl = new FormControl();
  selectedFurnizor: any;
  
  @Input()
  preselectFurnizor: number = 0;


  @Output()
  onOptionSelected: EventEmitter<string> = new EventEmitter<string>();

  
  ngOnInit(): void {
  this.loadFurnizorList();
  }

  loadFurnizorList(){
    this.furnizorService.getAll().subscribe(furnizori=>{
      this.furnizori = furnizori;
      console.log('preselectFurnizor', this.preselectFurnizor);
      
      if(this.preselectFurnizor !=0){
        this.furnizorService.getById(this.preselectFurnizor).subscribe(fur=>{
          this.furnizorCtrl.setValue(fur);
        })
      }     
      
    });    
  }

  optionSelected(event: MatAutocompleteSelectedEvent){
    console.log(event.option.value.id);
    this.onOptionSelected.emit(event.option.value.id);
  }

  private _filterStates(value: string): furnizoriDTO[] {
    const filterValue = value;
    return this.furnizori.filter(p => p.nume.includes(filterValue));
  }

  displayFn(furn: furnizoriDTO): string {
    console.log('am trigeruit ceva la load furnizor?', furn);
    return furn && furn.nume ? furn.nume : '';
  }
}
