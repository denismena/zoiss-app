import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ConfirmEmailComponent } from './confirm-email.component';
import { SecurityService } from '../security.service';
import { DisplayErrorsComponent } from 'src/app/utilities/display-errors/display-errors.component';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmEmailComponent, DisplayErrorsComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
        { provide: SecurityService, useValue: { confirmEmail: () => of(null) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
