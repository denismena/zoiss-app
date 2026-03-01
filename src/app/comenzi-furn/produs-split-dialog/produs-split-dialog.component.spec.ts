import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ProdusSplitDialogComponent } from './produs-split-dialog.component';
import { produseComandaFurnizorDTO } from '../comenzi-furn-item/comenzi-furn.model';
import { MaterialModule } from 'src/app/material/material.module';

describe('ProdusSplitDialogComponent', () => {
  let component: ProdusSplitDialogComponent;
  let fixture: ComponentFixture<ProdusSplitDialogComponent>;

  const mockProdusSplit: produseComandaFurnizorDTO = {
    id: 1, produsId: 1, produsNume: 'Test', codProdus: 'A1', cantitate: 10,
    cutii: 1, um: 'buc', umId: 1, pretUm: 1, valoare: 10, disponibilitate: null as any,
    detalii: '', comenziProdusId: 1, clientNume: '', isInTransport: false, addToTransport: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdusSplitDialogComponent ],
      imports: [ ReactiveFormsModule, MaterialModule ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { produsSplit: mockProdusSplit } },
        { provide: MatDialogRef, useValue: {} }
      ]
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
