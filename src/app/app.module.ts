import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2'
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { AngularEditorModule } from '@kolkov/angular-editor';

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
import {CustomDateTimePipe, CustomDatePipe, DaNuPipe, FilterComandaProdusStocPipe} from './utilities/custom.datepipe';
import { OferteProduseAutocompleteComponent } from './oferte/oferte-produse-autocomplete/oferte-produse-autocomplete.component';
import { ClientiAdresaComponent } from './nomenclatoare/clienti/clienti-adresa/clienti-adresa.component';
import { UmListComponent } from './nomenclatoare/um/um-list/um-list.component';
import { UmItemComponent } from './nomenclatoare/um/um-item/um-item.component';
import { UmCreateComponent } from './nomenclatoare/um/um-item/um-create/um-create.component';
import { UmEditComponent } from './nomenclatoare/um/um-item/um-edit/um-edit.component';
import { ComenziItemComponent } from './comenzi/comenzi-item/comenzi-item.component';
import { ComenziListComponent } from './comenzi/comenzi-list/comenzi-list.component';
import { ComenziCreateComponent } from './comenzi/comenzi-item/comenzi-create/comenzi-create.component';
import { ComenziEditComponent } from './comenzi/comenzi-item/comenzi-edit/comenzi-edit.component';
import { ComenziProduseAutocompleteComponent } from './comenzi/comenzi-produse-autocomplete/comenzi-produse-autocomplete.component';
import { AuthorizeViewComponent } from './security/authorize-view/authorize-view.component';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { AuthenticationFormComponent } from './security/authentication-form/authentication-form.component';
import { JwtInterceptorService } from './security/jwt-interceptor.service';
import { UtilizatoriListComponent } from './nomenclatoare/utilizatori/utilizatori-list/utilizatori-list.component';
import { UtilizatoriEditComponent } from './nomenclatoare/utilizatori/utilizatori-edit/utilizatori-edit.component';
import { ComenziFurnListComponent } from './comenzi-furn/comenzi-furn-list/comenzi-furn-list.component';
import { ComenziFurnProduseAutocompleteComponent } from './comenzi-furn/comenzi-furn-produse-autocomplete/comenzi-furn-produse-autocomplete.component';
import { ComenziFurnEditComponent } from './comenzi-furn/comenzi-furn-item/comenzi-furn-edit/comenzi-furn-edit.component';
import { ComenziFurnCreateComponent } from './comenzi-furn/comenzi-furn-item/comenzi-furn-create/comenzi-furn-create.component';
import { ComenziFurnItemComponent } from './comenzi-furn/comenzi-furn-item/comenzi-furn-item.component';

import { TransportatorListComponent } from './nomenclatoare/transportator/transportator-list/transportator-list.component';
import { TransportatorCreateComponent } from './nomenclatoare/transportator/transportator-item/transportator-create/transportator-create.component';
import { TransportatorEditComponent } from './nomenclatoare/transportator/transportator-item/transportator-edit/transportator-edit.component';
import { TransportatorItemComponent } from './nomenclatoare/transportator/transportator-item/transportator-item.component';
import { DepoziteItemComponent } from './nomenclatoare/depozite/depozite-item/depozite-item.component';
import { DepoziteCreateComponent } from './nomenclatoare/depozite/depozite-item/depozite-create/depozite-create.component';
import { DepoziteEditComponent } from './nomenclatoare/depozite/depozite-item/depozite-edit/depozite-edit.component';
import { DepoziteListComponent } from './nomenclatoare/depozite/depozite-list/depozite-list.component';
import { TransportListComponent } from './transport/transport-list/transport-list.component';
import { TransportEditComponent } from './transport/transport-item/transport-edit/transport-edit.component';
import { TransportItemComponent } from './transport/transport-item/transport-item.component';
import { TransportProduseComponent } from './transport/transport-produse/transport-produse.component';
import { DepoziteDialogComponent } from './transport/depozite-dialog/depozite-dialog.component';
import { DepoziteAllDialogComponent } from './transport/depozite-all-dialog/depozite-all-dialog.component';
import { ProduseCreateDialogComponent } from './nomenclatoare/produse/produse-item/produse-create-dialog/produse-create-dialog.component';
import { LivrariListComponent } from './livrari/livrari-list/livrari-list.component';
import { LivrariEditComponent } from './livrari/livrari-item/livrari-edit/livrari-edit.component';
import { LivrariItemComponent } from './livrari/livrari-item/livrari-item.component';
import { LivrariNumberDialogComponent } from './transport/livrari-number-dialog/livrari-number-dialog.component';
import { LivrariProduseComponent } from './livrari/livrari-produse/livrari-produse.component';
import { ClientiCreateDialogComponent } from './nomenclatoare/clienti/clienti-item/clienti-create-dialog/clienti-create-dialog.component';
import { ArhitectiCreateDialogComponent } from './nomenclatoare/arhitecti/arhitecti-item/arhitecti-create-dialog/arhitecti-create-dialog.component';
import { FurnizoriCreateDialogComponent } from './nomenclatoare/furnizori/furnizori-item/furnizori-create-dialog/furnizori-create-dialog.component';
import { StickyNotesListComponent } from './stickyNote/sticky-notes-list/sticky-notes-list.component';
import { NotificariItemComponent } from './notificari/notificari-item/notificari-item.component';
import { NotificariListComponent } from './notificari/notificari-list/notificari-list.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';
import { ScanQRComponent } from './scan-qr/scan-qr.component';
import { ForgetPassComponent } from './security/forget-pass/forget-pass.component';
import { ResetPassComponent } from './security/reset-pass/reset-pass.component';
import { SucursaleListComponent } from './nomenclatoare/sucursale/sucursale-list/sucursale-list.component';
import { SucursaleItemComponent } from './nomenclatoare/sucursale/sucursale-item/sucursale-item.component';
import { SucursaleCreateComponent } from './nomenclatoare/sucursale/sucursale-item/sucursale-create/sucursale-create.component';
import { SucursaleEditComponent } from './nomenclatoare/sucursale/sucursale-item/sucursale-edit/sucursale-edit.component';
import { CookieService } from './utilities/cookie.service';
import { ComisionArhitectiComponent } from './rapoarte/comisionArhitecti/comision-arhitecti.component';
import { ConfirmEmailComponent } from './security/confirm-email/confirm-email.component';
import { ProdusStocDialogComponent } from './livrari/produs-stoc-dialog/produs-stoc-dialog.component';
import { ProdusSplitDialogComponent } from './comenzi-furn/produs-split-dialog/produs-split-dialog.component';
import { UtilizatoriAutocompleteComponent } from './nomenclatoare/utilizatori/utilizatori-autocomplete/utilizatori-autocomplete.component';
import { ComenziFurnSelectDialogComponent } from './comenzi/comenzi-furn-select-dialog/comenzi-furn-select-dialog.component';
import { LivrariCreateComponent } from './livrari/livrari-item/livrari-create/livrari-create.component';
import { ComenziUtilizatoriComponent } from './rapoarte/comenzi-utilizatori/comenzi-utilizatori.component';
import { ComenziDepoziteComponent } from './rapoarte/comenzi-depozite/comenzi-depozite.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

    CustomDateTimePipe,
    CustomDatePipe,
    DaNuPipe,
    FilterComandaProdusStocPipe,
    
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
    OferteProduseAutocompleteComponent,
    ClientiAdresaComponent,
    UmListComponent,
    UmItemComponent,
    UmCreateComponent,
    UmEditComponent,
    ComenziItemComponent,
    ComenziListComponent,
    ComenziCreateComponent,
    ComenziEditComponent,
    ComenziProduseAutocompleteComponent,
    AuthorizeViewComponent,
    LoginComponent,
    RegisterComponent,
    AuthenticationFormComponent,
    UtilizatoriListComponent,
    UtilizatoriEditComponent,
    ComenziFurnListComponent,
    ComenziFurnProduseAutocompleteComponent,
    ComenziFurnEditComponent,
    ComenziFurnCreateComponent,
    ComenziFurnItemComponent,
    TransportatorListComponent,
    TransportatorCreateComponent,
    TransportatorEditComponent,
    TransportatorItemComponent,
    DepoziteItemComponent,
    DepoziteCreateComponent,
    DepoziteEditComponent,
    DepoziteListComponent,
    TransportListComponent,
    TransportEditComponent,
    TransportItemComponent,
    TransportProduseComponent,
    DepoziteDialogComponent,
    DepoziteAllDialogComponent,
    ProduseCreateDialogComponent,
    LivrariListComponent,
    LivrariEditComponent,
    LivrariItemComponent,
    LivrariNumberDialogComponent,
    LivrariProduseComponent,    
    ClientiCreateDialogComponent,
    ArhitectiCreateDialogComponent,
    FurnizoriCreateDialogComponent,
    StickyNotesListComponent,
    NotificariItemComponent,
    NotificariListComponent,
    ScanQRComponent,
    ForgetPassComponent,
    ResetPassComponent,
    SucursaleListComponent,
    SucursaleItemComponent,
    SucursaleCreateComponent,
    SucursaleEditComponent,
    ComisionArhitectiComponent,
    ConfirmEmailComponent,
    ProdusStocDialogComponent,
    ProdusSplitDialogComponent,
    UtilizatoriAutocompleteComponent,
    ComenziFurnSelectDialogComponent,
    LivrariCreateComponent,
    ComenziUtilizatoriComponent,
    ComenziDepoziteComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    SweetAlert2Module.forRoot(),
    RxReactiveFormsModule,
    AngularEditorModule,
    ZXingScannerModule,
    QRCodeModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptorService,
    multi: true
  }, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
