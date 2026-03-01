import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ClientiListComponent } from './clienti-list.component';
import { ClientiService } from '../clienti.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { MaterialModule } from 'src/app/material/material.module';
import { DisplayErrorsComponent } from 'src/app/utilities/display-errors/display-errors.component';

describe('ClientiListComponent', () => {
  let component: ClientiListComponent;
  let fixture: ComponentFixture<ClientiListComponent>;

  beforeEach(async () => {
    const mockHeaders = new HttpHeaders().set('totalrecords', '0');
    await TestBed.configureTestingModule({
      declarations: [ ClientiListComponent, DisplayErrorsComponent ],
      imports: [ MaterialModule, RouterTestingModule ],
      providers: [
        UnsubscribeService,
        { provide: ClientiService, useValue: { getAll: () => of(new HttpResponse({ body: [], headers: mockHeaders })), delete: () => of({}) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
