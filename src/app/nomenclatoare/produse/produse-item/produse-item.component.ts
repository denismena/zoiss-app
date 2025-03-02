import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { furnizoriDTO } from '../../furnizori/furnizori-item/furnizori.model';
import { umDTO } from '../../um/um-item/um.model';
import { UMService } from '../../um/um.service';
import { produseCreationDTO, produseDTO } from './produse.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-produse-item',
    templateUrl: './produse-item.component.html',
    styleUrls: ['./produse-item.component.scss'],
    standalone: false
})
export class ProduseItemComponent implements OnInit, OnDestroy {

  constructor(private router:Router, private formBuilder: FormBuilder, private umService: UMService,
    private unsubscribeService: UnsubscribeService) { }
  public form!: FormGroup;
  
  @Input() preselectFurnizor:furnizoriDTO|undefined;
  @Input() model!:produseCreationDTO;
  @Input() isDialog:boolean = false;
  umList: umDTO[]=[];
   @Output() onSaveChanges: EventEmitter<produseCreationDTO> = new EventEmitter<produseCreationDTO>();
  
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      cod:['', {validators:[RxwebValidators.required(), RxwebValidators.maxLength({value:50 })]}],
      nume:['', {validators:[RxwebValidators.required(), RxwebValidators.maxLength({value:255 })]}],
      umId: ['', {validators:[RxwebValidators.required()]}],
      perCutie: [null, {validators:[RxwebValidators.required(), RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      pret: [null, {validators:[RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      greutatePerUm: [null, {validators:[RxwebValidators.numeric({acceptValue:NumericValueType.PositiveNumber  ,allowDecimal:true })]}],
      codVamal: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],
      prefFurnizorId: null,
      prefFurnizor: '',
      poza: '',
      stoc:'',
      pozaPath: '',
      active: true,
      isCategory: false
    });
    if(this.model !== undefined)
    {
      this.form.patchValue(this.model);
    }

    this.umService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(um=>{
      this.umList=um;
    })
  }

  saveProduse(){
    if(this.form.valid)
      this.onSaveChanges.emit(this.form.value);
    else 
    {
      this.form.markAllAsTouched();
      Object.keys(this.form.controls).forEach(controlName => {
        const control = this.form.get(controlName);
        if (control?.invalid) {
          console.log('Invalid field:', controlName);
          console.log('Validation errors:', control?.errors);
        }
      });
    }
  }

  onImageSelected(image: any){
    console.log('image', image);
    this.form.get('poza')?.setValue(image);
    this.form.get('pozaPath')?.setValue('image');
  }

  onImageDeleted(){
    this.form.get('poza')?.setValue(null);
    this.form.get('pozaPath')?.setValue(null);
  }

  cancel(){
    if(this.isDialog) this.onSaveChanges.emit(undefined);
    else this.router.navigate(["/produse"]);
  }
  selectFurnizor(furnizor: any){
    if(furnizor!==undefined){
     this.form.get('prefFurnizorId')?.setValue(furnizor.id);
     this.form.get('prefFurnizor')?.setValue(furnizor.nume);
    }
  }

  ngOnDestroy(): void {}
}
