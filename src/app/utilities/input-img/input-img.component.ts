import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
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
  urlCurrentImage: any | undefined;

  @Output()
  onImageSelected = new EventEmitter<File>();

  ngOnInit(): void {
    if(this.urlCurrentImage != undefined)
      this.urlCurrentImage = environment.pozeProduseUrl + this.urlCurrentImage;
  }

  change(event: any){
    if (event.target.files.length > 0){
      const file: File = event.target.files[0];
      toBase64(file).then((retValue: any) => this.imageBase64 = retValue);      
      this.onImageSelected.emit(file);
      this.urlCurrentImage = null;
    }
  }

}
