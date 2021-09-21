import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { produseCreationDTO, produseDTO } from './produse.model';

@Component({
  selector: 'app-produse-item',
  templateUrl: './produse-item.component.html',
  styleUrls: ['./produse-item.component.scss']
})
export class ProduseItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder) { }
  public form!: FormGroup;
  @Input()
  model!:produseCreationDTO;
  
   @Output()
   onSaveChanges: EventEmitter<produseCreationDTO> = new EventEmitter<produseCreationDTO>();
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });

    this.form = this.formBuilder.group({
      cod:['', {validators:[Validators.required]}],
      nume:['', {validators:[Validators.required]}],
      um: '',
      perCutie: 1,
      pret: 0,
      greutatePerUm: 1,
      codVamal: '',
      active: true
    });
    if(this.model !== undefined)
    {
      this.form.patchValue(this.model);
    }    
  }

  saveProduse(){
    //this.router.navigate(['/clienti'])
    this.onSaveChanges.emit(this.form.value);
  }

}
