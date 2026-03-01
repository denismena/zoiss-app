import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ProdusStocDialogComponent } from './produs-stoc-dialog.component';
import { ComenziService } from 'src/app/comenzi/comenzi.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { MaterialModule } from 'src/app/material/material.module';

describe('ProdusStocDialogComponent', () => {
  let component: ProdusStocDialogComponent;
  let fixture: ComponentFixture<ProdusStocDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdusStocDialogComponent ],
      imports: [ ReactiveFormsModule, MaterialModule ],
      providers: [
        UnsubscribeService,
        { provide: MAT_DIALOG_DATA, useValue: { id: 0 } },
        { provide: MatDialogRef, useValue: {} },
        { provide: ComenziService, useValue: { produseStoc: () => of([]) } }
      ]
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
