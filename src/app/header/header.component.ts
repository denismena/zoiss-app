import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security/security.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public securityService: SecurityService) { }

  ngOnInit(): void {
  }

}
