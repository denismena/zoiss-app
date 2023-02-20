import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdusSplitDialogComponent } from './produs-split-dialog.component';

describe('ProdusSplitDialogComponent', () => {
  let component: ProdusSplitDialogComponent;
  let fixture: ComponentFixture<ProdusSplitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdusSplitDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdusSplitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
