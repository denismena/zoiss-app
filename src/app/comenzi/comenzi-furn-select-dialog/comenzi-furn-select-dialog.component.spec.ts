import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ComenziFurnSelectDialogComponent } from './comenzi-furn-select-dialog.component';
import { ComenziFurnizorService } from 'src/app/comenzi-furn/comenzi-furn.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { MaterialModule } from 'src/app/material/material.module';
import { CustomDatePipe } from 'src/app/utilities/custom.datepipe';

describe('ComenziFurnSelectDialogComponent', () => {
  let component: ComenziFurnSelectDialogComponent;
  let fixture: ComponentFixture<ComenziFurnSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComenziFurnSelectDialogComponent, CustomDatePipe ],
      imports: [ ReactiveFormsModule, MaterialModule ],
      providers: [
        UnsubscribeService,
        { provide: MAT_DIALOG_DATA, useValue: { furnizorId: 0 } },
        { provide: MatDialogRef, useValue: {} },
        { provide: ComenziFurnizorService, useValue: { getBasicList: () => of([]) } }
      ]
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
