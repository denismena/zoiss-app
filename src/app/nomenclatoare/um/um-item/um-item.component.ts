import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { umCreationDTO } from './um.model';

@Component({
  selector: 'app-um-item',
  templateUrl: './um-item.component.html',
  styleUrls: ['./um-item.component.scss']
})
export class UmItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder) { }
  public form!: FormGroup;
  @Input()
  model!:umCreationDTO;
  
   @Output()
   onSaveChanges: EventEmitter<umCreationDTO> = new EventEmitter<umCreationDTO>();

   ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      //alert(params.id);
    });

    this.form = this.formBuilder.group({
      nume:['', {validators:[Validators.required, Validators.maxLength(50)]}],      
    });
    if(this.model !== undefined)
    {
      this.form.patchValue(this.model);
    }    
  }

  saveProduse(){
    //this.router.navigate(['/um'])
    this.onSaveChanges.emit(this.form.value);
  }
  getErrorMessageFieldName(){
    const field = this.form.get('nume');
    if(field?.hasError('required')){
      return 'Campul este necesar!'
    }
    if(field?.hasError('maxlength')){
      return 'Numarul maxim de caractere este 50!'
    }
    return '';
  }
}
