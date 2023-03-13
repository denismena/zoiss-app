import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComenziFurnSelectDialogComponent } from './comenzi-furn-select-dialog.component';

describe('ComenziFurnSelectDialogComponent', () => {
  let component: ComenziFurnSelectDialogComponent;
  let fixture: ComponentFixture<ComenziFurnSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComenziFurnSelectDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComenziFurnSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
