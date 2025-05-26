import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security/security.service';
import { CookieService } from '../utilities/cookie.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements OnInit {
  pdfComponentNou: boolean = false;
  constructor(public securityService: SecurityService, public cookie: CookieService) { }

  ngOnInit(): void {
    this.pdfComponentNou = this.cookie.getCookie('pdfComponentNou') === 'true';    
  }
  pdfComponentNouChange() {
    this.cookie.setCookie({ name: 'pdfComponentNou', value: this.pdfComponentNou.toString() });
  }

}
