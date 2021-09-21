import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { clientiDTO } from './clienti.model';

@Component({
  selector: 'app-clienti-item',
  templateUrl: './clienti-item.component.html',
  styleUrls: ['./clienti-item.component.scss']
})
export class ClientiItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private formBuilder:FormBuilder) { }
  public form!: FormGroup;  
  @Input()
  model:clientiDTO | undefined;
  
  
  @Output()
  onSaveChanges: EventEmitter<clientiDTO> = new EventEmitter<clientiDTO>();
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });
    this.form = this.formBuilder.group({
      nume:['', {validators:[Validators.required]}],
      pfpj: true,
      cuicnp:'',
      registruComert:'',
      active: true
    });
    if(this.model !== undefined)
    {
      console.log('model: ', this.model);
      this.form.patchValue(this.model);
    }    
  }
  saveChanges(){
    //this.router.navigate(['/clienti'])
    
    if(this.form.controls['pfpj'].value == "0") this.form.controls['pfpj'].setValue(false);
    else this.form.controls['pfpj'].setValue(true);
    console.log('click done',this.form.value);
    this.onSaveChanges.emit(this.form.value);
  }
}
