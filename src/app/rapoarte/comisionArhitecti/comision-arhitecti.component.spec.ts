import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionArhitectiComponent } from './comision-arhitecti.component';

describe('ComisionArhitectiComponent', () => {
  let component: ComisionArhitectiComponent;
  let fixture: ComponentFixture<ComisionArhitectiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComisionArhitectiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionArhitectiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
