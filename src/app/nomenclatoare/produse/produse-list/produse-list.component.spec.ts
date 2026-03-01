import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';

import { ProduseListComponent } from './produse-list.component';
import { ProduseService } from '../produse.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';

describe('ProduseListComponent', () => {
  let component: ProduseListComponent;
  let fixture: ComponentFixture<ProduseListComponent>;

  beforeEach(async () => {
    const mockResponse = new HttpResponse({ body: [], headers: new HttpHeaders().set('totalRecords', '0') });
    await TestBed.configureTestingModule({
      declarations: [ ProduseListComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        UnsubscribeService,
        { provide: ProduseService, useValue: { getAll: () => of(mockResponse) } }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
