import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
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
