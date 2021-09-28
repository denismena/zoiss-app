import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; 
import { SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';

import { ProduseListComponent } from './nomenclatoare/produse/produse-list/produse-list.component';
import { ProduseItemComponent } from './nomenclatoare/produse/produse-item/produse-item.component';
import { ProduseCreateComponent } from './nomenclatoare/produse/produse-item/produse-create/produse-create.component';
import { ProduseEditComponent } from './nomenclatoare/produse/produse-item/produse-edit/produse-edit.component';
import { ProduseAutocompleteComponent } from './nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';

import { ClientiListComponent } from './nomenclatoare/clienti/clienti-list/clienti-list.component';
import { ClientiItemComponent } from './nomenclatoare/clienti/clienti-item/clienti-item.component';
import { ClientiCreateComponent } from './nomenclatoare/clienti/clienti-item/clienti-create/clienti-create.component';
import { ClientiEditComponent } from './nomenclatoare/clienti/clienti-item/clienti-edit/clienti-edit.component';
import { ClientiFilterComponent } from './nomenclatoare/clienti/clienti-list/clienti-filter/clienti-filter.component';
import { ClientiAutocompleteComponent } from './nomenclatoare/clienti/clienti-autocomplete/clienti-autocomplete.component';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { DisplayErrorsComponent } from './utilities/display-errors/display-errors.component';
import { GenericListComponent } from './utilities/generic-list/generic-list.component';

import { FurnizoriListComponent } from './nomenclatoare/furnizori/furnizori-list/furnizori-list.component';
import { FurnizoriItemComponent } from './nomenclatoare/furnizori/furnizori-item/furnizori-item.component';
import { FurnizoriCreateComponent } from './nomenclatoare/furnizori/furnizori-item/furnizori-create/furnizori-create.component';
import { FurnizoriEditComponent } from './nomenclatoare/furnizori/furnizori-item/furnizori-edit/furnizori-edit.component';
import { FurnizoriAutocompleteComponent } from './nomenclatoare/furnizori/furnizori-autocomplete/furnizori-autocomplete.component';

import { OferteListComponent } from './oferte/oferte-list/oferte-list.component';
import { OferteFilterComponent } from './oferte/oferte-list/oferte-filter/oferte-filter.component';
import { OferteItemComponent } from './oferte/oferte-item/oferte-item.component';
import { OferteCreateComponent } from './oferte/oferte-item/oferte-create/oferte-create.component';
import { OferteEditComponent } from './oferte/oferte-item/oferte-edit/oferte-edit.component';

import { ArhitectiListComponent } from './nomenclatoare/arhitecti/arhitecti-list/arhitecti-list.component';
import { ArhitectiItemComponent } from './nomenclatoare/arhitecti/arhitecti-item/arhitecti-item.component';
import { ArhitectiCreateComponent } from './nomenclatoare/arhitecti/arhitecti-item/arhitecti-create/arhitecti-create.component';
import { ArhitectiEditComponent } from './nomenclatoare/arhitecti/arhitecti-item/arhitecti-edit/arhitecti-edit.component';
import { ArhitectiAutocompleteComponent } from './nomenclatoare/arhitecti/arhitecti-autocomplete/arhitecti-autocomplete.component';

import { InputImgComponent } from './utilities/input-img/input-img.component';
import {CustomDateTimePipe, CustomDatePipe} from './utilities/custom.datepipe';
import { OferteProduseAutocompleteComponent } from './oferte/oferte-produse-autocomplete/oferte-produse-autocomplete.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

    CustomDateTimePipe,
    CustomDatePipe,

    ProduseListComponent,
    ProduseItemComponent,
    ClientiListComponent,
    ClientiItemComponent,
    HeaderComponent,
    FooterComponent,
    ClientiCreateComponent,
    ClientiEditComponent,
    ClientiFilterComponent,
    ProduseCreateComponent,
    ProduseEditComponent,
    FurnizoriListComponent,
    FurnizoriItemComponent,
    FurnizoriCreateComponent,
    FurnizoriEditComponent,
    OferteListComponent,
    OferteFilterComponent,
    OferteItemComponent,
    OferteCreateComponent,
    OferteEditComponent,
    ProduseAutocompleteComponent,
    ClientiAutocompleteComponent,
    FurnizoriAutocompleteComponent,
    DisplayErrorsComponent,
    GenericListComponent,
    ArhitectiListComponent,
    ArhitectiItemComponent,
    ArhitectiCreateComponent,
    ArhitectiEditComponent,
    ArhitectiAutocompleteComponent,
    InputImgComponent,
    OferteProduseAutocompleteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
