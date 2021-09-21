import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { furnizoriDTO } from './furnizori.model';

@Component({
  selector: 'app-furnizori-item',
  templateUrl: './furnizori-item.component.html',
  styleUrls: ['./furnizori-item.component.scss']
})
export class FurnizoriItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder) { }
  public form!: FormGroup;
  @Input()
  model:furnizoriDTO | undefined;
  
  @Output()
  onSaveChanges: EventEmitter<furnizoriDTO> = new EventEmitter<furnizoriDTO>();

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });

    this.form = this.formBuilder.group({
      nume:['', {validators:[Validators.required]}],
      tara: '',
      adresa: '',
      tel: '',
      email: '',
      active: true
    });
    if(this.model !== undefined)
    {
      this.form.patchValue(this.model);
    }    
  }
  saveChanges(){
    this.onSaveChanges.emit(this.form.value);
  }

}
