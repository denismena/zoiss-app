import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BarcodeScannerLivestreamComponent } from 'ngx-barcode-scanner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{  
  scannerEnabled: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  scan() {
    this.scannerEnabled = true;
  }
  stop() {
    this.scannerEnabled = false;
    }
}
