import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilizatoriAutocompleteComponent } from './utilizatori-autocomplete.component';

describe('UtilizatoriAutocompleteComponent', () => {
  let component: UtilizatoriAutocompleteComponent;
  let fixture: ComponentFixture<UtilizatoriAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilizatoriAutocompleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilizatoriAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
