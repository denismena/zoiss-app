import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivrariCreateComponent } from './livrari-create.component';

describe('LivrariCreateComponent', () => {
  let component: LivrariCreateComponent;
  let fixture: ComponentFixture<LivrariCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LivrariCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivrariCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
