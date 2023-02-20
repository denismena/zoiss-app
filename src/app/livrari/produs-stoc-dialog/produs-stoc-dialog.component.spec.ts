import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdusStocDialogComponent } from './produs-stoc-dialog.component';

describe('ProdusStocDialogComponent', () => {
  let component: ProdusStocDialogComponent;
  let fixture: ComponentFixture<ProdusStocDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdusStocDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdusStocDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
