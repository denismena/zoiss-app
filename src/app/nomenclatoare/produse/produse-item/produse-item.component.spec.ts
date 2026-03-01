import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProduseItemComponent } from './produse-item.component';
import { UMService } from '../../um/um.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';

describe('ProduseItemComponent', () => {
  let component: ProduseItemComponent;
  let fixture: ComponentFixture<ProduseItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduseItemComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        UnsubscribeService,
        { provide: UMService, useValue: { getAll: () => of([]) } }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduseItemComponent);
    component = fixture.componentInstance;
    component.model = { cod: '', nume: '', umId: 0, um: '', perCutie: 0, pret: 0, greutatePerUm: 0, codVamal: '', prefFurnizorId: 0, prefFurnizor: '', poza: '', stoc: 0, pozaPath: '', active: true, isCategory: false };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
