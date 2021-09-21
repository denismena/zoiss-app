import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientiFilterComponent } from './clienti-filter.component';

describe('ClientiFilterComponent', () => {
  let component: ClientiFilterComponent;
  let fixture: ComponentFixture<ClientiFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientiFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientiFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
