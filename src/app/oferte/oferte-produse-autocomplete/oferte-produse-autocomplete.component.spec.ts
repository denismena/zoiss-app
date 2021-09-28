import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OferteProduseAutocompleteComponent } from './oferte-produse-autocomplete.component';

describe('OferteProduseAutocompleteComponent', () => {
  let component: OferteProduseAutocompleteComponent;
  let fixture: ComponentFixture<OferteProduseAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OferteProduseAutocompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OferteProduseAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
