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
    MatDialogModule
  ],
  imports: [
    CommonModule
  ]
})
export class MaterialModule { }
