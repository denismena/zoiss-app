import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatNativeDateModule} from '@angular/material/core'
import {MatButtonModule} from '@angular/material/button'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatRadioModule} from '@angular/material/radio'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatSelectModule} from '@angular/material/select'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatTableModule} from '@angular/material/table'
import {MatIconModule} from '@angular/material/icon'
import {DragDropModule} from '@angular/cdk/drag-drop'
import {MatTabsModule} from '@angular/material/tabs'
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion'
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatProgressSpinnerModule} from "@angular/material/progress-spinner"
import {MatCardModule} from "@angular/material/card"
import {MatBadgeModule} from "@angular/material/badge"
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';

const MY_FORMATS = {
  parse: {
    dateInput: 'DD MMM YYYY',
  },
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMM YYYY',
  },
};

@NgModule({
  declarations: [],
  exports:[
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatTableModule,
    MatIconModule,
    DragDropModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDialogModule,
    MatMomentDateModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule, 
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  imports: [
    CommonModule
  ]
})
export class MaterialModule { }
