import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { environment } from 'src/environments/environment';
import { furnizoriCreationDTO, furnizoriDTO } from './furnizori.model';

@Component({
  selector: 'app-furnizori-item',
  templateUrl: './furnizori-item.component.html',
  styleUrls: ['./furnizori-item.component.scss']
})
export class FurnizoriItemComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder, private router:Router) { }
  public form!: FormGroup;
  @Input()model:furnizoriDTO | undefined;
  @Input()isDialog:boolean = false;
  @Output()
  onSaveChanges: EventEmitter<furnizoriDTO> = new EventEmitter<furnizoriDTO>();
  public selectedFiles: File[] = [];
  containerName: string = 'furnizor';

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nume:['', {validators:[RxwebValidators.required(), RxwebValidators.maxLength({value:150 })]}],
      tara: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],
      oras: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],
      judet: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],
      adresa: ['', {validators:[RxwebValidators.maxLength({value:250 })]}],
      tel: ['', {validators:[RxwebValidators.maxLength({value:50 })]}],
      email: [null, {validators: [RxwebValidators.email(), RxwebValidators.maxLength({value:100 })]}],
      conditii: ['', {validators:[RxwebValidators.maxLength({value:500 })]}],
      active: true,
      files:[null],
      fileNames:[null]
    });
    if(this.model !== undefined)
    {
      this.form.patchValue(this.model);
    }    
  }
  cancel(){
    if(this.isDialog) this.onSaveChanges.emit(undefined);
    else this.router.navigate(["/furnizori"]);
  }
  saveChanges(){
    if(this.form.valid)
    {
      this.form.get('files')?.setValue(this.selectedFiles);
      this.onSaveChanges.emit(this.form.value);
    }
  }

  onFileChange(event: any) {
    for (let index = 0; index < event.target.files.length; index++) {      
      this.selectedFiles.push(event.target.files[index]);
    }
  }

  viewFile(event:any, file: File): void {
    event.preventDefault();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const url = reader.result as string;
      window.open(url);
    };
  }

  deleteFile(event:any, file: File): void {
    event.preventDefault();
    const index = this.selectedFiles.indexOf(file);
    if (index !== -1) {
      this.selectedFiles.splice(index, 1);
    }
  }

  viewFileFromServer(event:any, fileId: string, fileName: any): void {
    event.preventDefault();
    const url = environment.rootUrl + this.containerName + "/" + this.model?.id + "/" + fileId + fileName.substring(fileName.lastIndexOf('.'));
    window.open(url);    
  }

  deleteFileFromServer(event:any, fileId: any): void {
    event.preventDefault();
    delete this.model?.fileNames[fileId];    
  }
    
  get f() { return this.form.controls; }

}
