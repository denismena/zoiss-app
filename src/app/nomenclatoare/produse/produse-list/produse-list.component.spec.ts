import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduseListComponent } from './produse-list.component';

describe('ProduseListComponent', () => {
  let component: ProduseListComponent;
  let fixture: ComponentFixture<ProduseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduseListComponent ]
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
