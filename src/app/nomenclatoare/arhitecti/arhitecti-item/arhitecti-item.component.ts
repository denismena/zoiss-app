import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { arhitectiDTO } from './arhitecti.model';

@Component({
  selector: 'app-arhitecti-item',
  templateUrl: './arhitecti-item.component.html',
  styleUrls: ['./arhitecti-item.component.scss']
})
export class ArhitectiItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder) { }

  public form!: FormGroup;
  @Input()
  model:arhitectiDTO | undefined;
  
  @Output()
  onSaveChanges: EventEmitter<arhitectiDTO> = new EventEmitter<arhitectiDTO>();

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });

    this.form = this.formBuilder.group({
      nume:['', {validators:[Validators.required]}],
      comision: [null, {validators:[Validators.required]}],
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
