import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduseItemComponent } from './produse-item.component';

describe('ProduseItemComponent', () => {
  let component: ProduseItemComponent;
  let fixture: ComponentFixture<ProduseItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduseItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
