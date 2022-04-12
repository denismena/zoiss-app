import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BarcodeScannerLivestreamComponent } from 'ngx-barcode-scanner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner: BarcodeScannerLivestreamComponent | undefined;
  barcodeValue: any;
  constructor() { }

  ngOnInit(): void {
  }
  scan() {
    if(this.barcodeScanner)
      this.barcodeScanner.start();
  }
  stop() {
    if(this.barcodeScanner)
      this.barcodeScanner.stop();
  }
  onValueChanges(result: any) {
    this.barcodeValue = result.codeResult.code;
  }

  onStarted(started:any) {
    console.log(started);
  }
}
