import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { toBase64 } from '../utils';

@Component({
  selector: 'app-input-img',
  templateUrl: './input-img.component.html',
  styleUrls: ['./input-img.component.scss']
})
export class InputImgComponent implements OnInit {

  constructor() { }

  imageBase64!: string;

  @Input()
  urlCurrentImage: string = '';

  @Output()
  onImageSelected = new EventEmitter<File>();

  ngOnInit(): void {
  }

  change(event: any){
    if (event.target.files.length > 0){
      const file: File = event.target.files[0];
      //toBase64(file).then((retValue: string) => this.imageBase64 = retValue);
      toBase64(file);
      this.onImageSelected.emit(file);
      this.urlCurrentImage = '';
    }
  }

}
