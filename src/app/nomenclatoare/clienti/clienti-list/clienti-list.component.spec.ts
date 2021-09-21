import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientiListComponent } from './clienti-list.component';

describe('ClientiListComponent', () => {
  let component: ClientiListComponent;
  let fixture: ComponentFixture<ClientiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientiListComponent ]
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
