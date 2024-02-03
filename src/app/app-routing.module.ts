import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProduseListComponent } from './nomenclatoare/produse/produse-list/produse-list.component';
import { ProduseCreateComponent } from './nomenclatoare/produse/produse-item/produse-create/produse-create.component'
import { ProduseEditComponent } from './nomenclatoare/produse/produse-item/produse-edit/produse-edit.component';
import { ClientiListComponent } from './nomenclatoare/clienti/clienti-list/clienti-list.component';
import { ClientiCreateComponent } from './nomenclatoare/clienti/clienti-item/clienti-create/clienti-create.component';
import { ClientiEditComponent } from './nomenclatoare/clienti/clienti-item/clienti-edit/clienti-edit.component';
import { ClientiFilterComponent } from './nomenclatoare/clienti/clienti-list/clienti-filter/clienti-filter.component';
import { FurnizoriListComponent} from './nomenclatoare/furnizori/furnizori-list/furnizori-list.component';
import { FurnizoriCreateComponent } from './nomenclatoare/furnizori/furnizori-item/furnizori-create/furnizori-create.component';
import { FurnizoriEditComponent } from './nomenclatoare/furnizori/furnizori-item/furnizori-edit/furnizori-edit.component';
import { OferteListComponent } from './oferte/oferte-list/oferte-list.component';
import { OferteFilterComponent } from './oferte/oferte-list/oferte-filter/oferte-filter.component';
import { OferteCreateComponent } from './oferte/oferte-item/oferte-create/oferte-create.component';
import { OferteEditComponent } from './oferte/oferte-item/oferte-edit/oferte-edit.component';
import { ArhitectiListComponent } from './nomenclatoare/arhitecti/arhitecti-list/arhitecti-list.component';
import { ArhitectiCreateComponent } from './nomenclatoare/arhitecti/arhitecti-item/arhitecti-create/arhitecti-create.component';
import { ArhitectiEditComponent } from './nomenclatoare/arhitecti/arhitecti-item/arhitecti-edit/arhitecti-edit.component';
import { UmListComponent } from './nomenclatoare/um/um-list/um-list.component';
import { UmCreateComponent } from './nomenclatoare/um/um-item/um-create/um-create.component';
import { UmEditComponent } from './nomenclatoare/um/um-item/um-edit/um-edit.component';
import { ComenziListComponent } from './comenzi/comenzi-list/comenzi-list.component';
import { ComenziCreateComponent } from './comenzi/comenzi-item/comenzi-create/comenzi-create.component';
import { ComenziEditComponent } from './comenzi/comenzi-item/comenzi-edit/comenzi-edit.component';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { UtilizatoriListComponent } from './nomenclatoare/utilizatori/utilizatori-list/utilizatori-list.component';
import { UtilizatoriEditComponent } from './nomenclatoare/utilizatori/utilizatori-edit/utilizatori-edit.component';
import { ComenziFurnListComponent } from './comenzi-furn/comenzi-furn-list/comenzi-furn-list.component';
import { ComenziFurnCreateComponent } from './comenzi-furn/comenzi-furn-item/comenzi-furn-create/comenzi-furn-create.component';
import { ComenziFurnEditComponent } from './comenzi-furn/comenzi-furn-item/comenzi-furn-edit/comenzi-furn-edit.component';
import { TransportatorListComponent } from './nomenclatoare/transportator/transportator-list/transportator-list.component';
import { TransportatorCreateComponent } from './nomenclatoare/transportator/transportator-item/transportator-create/transportator-create.component';
import { TransportatorEditComponent } from './nomenclatoare/transportator/transportator-item/transportator-edit/transportator-edit.component';
import { DepoziteListComponent } from './nomenclatoare/depozite/depozite-list/depozite-list.component';
import { DepoziteCreateComponent } from './nomenclatoare/depozite/depozite-item/depozite-create/depozite-create.component';
import { DepoziteEditComponent } from './nomenclatoare/depozite/depozite-item/depozite-edit/depozite-edit.component';
import { TransportListComponent } from './transport/transport-list/transport-list.component';
import { TransportEditComponent } from './transport/transport-item/transport-edit/transport-edit.component';
import { LivrariListComponent } from './livrari/livrari-list/livrari-list.component';
import { LivrariEditComponent } from './livrari/livrari-item/livrari-edit/livrari-edit.component';
import { StickyNotesListComponent } from './stickyNote/sticky-notes-list/sticky-notes-list.component';
import { NotificariListComponent } from './notificari/notificari-list/notificari-list.component';
import { NotificariItemComponent } from './notificari/notificari-item/notificari-item.component';
import { ForgetPassComponent } from './security/forget-pass/forget-pass.component';
import { ResetPassComponent } from './security/reset-pass/reset-pass.component';
import { SucursaleListComponent } from './nomenclatoare/sucursale/sucursale-list/sucursale-list.component';
import { SucursaleCreateComponent } from './nomenclatoare/sucursale/sucursale-item/sucursale-create/sucursale-create.component';
import { SucursaleEditComponent } from './nomenclatoare/sucursale/sucursale-item/sucursale-edit/sucursale-edit.component';
import { CookieService } from './utilities/cookie.service';
import { IsAuthenticatedGuard } from './is-authenticated.guard';
import { ComisionArhitectiComponent } from './rapoarte/comisionArhitecti/comision-arhitecti.component';
import { ConfirmEmailComponent } from './security/confirm-email/confirm-email.component';
import { LivrariCreateComponent } from './livrari/livrari-item/livrari-create/livrari-create.component';
import { ComenziUtilizatoriComponent } from './rapoarte/comenzi-utilizatori/comenzi-utilizatori.component';
import { ComenziDepoziteComponent } from './rapoarte/comenzi-depozite/comenzi-depozite.component';
import { NirListComponent } from './nir/nir-list/nir-list.component';
import { NirCreateComponent } from './nir/nir-item/nir-create/nir-create.component';
import { NirEditComponent } from './nir/nir-item/nir-edit/nir-edit.component';
import { TimelineStockComponent } from './rapoarte/timeline-stock/timeline-stock.component';
import { RemoveDuplicatesComponent } from './rapoarte/remove-duplicates/remove-duplicates.component';

const isAuthenticatedGuard = IsAuthenticatedGuard;
const routes: Routes = [
  {path:  "", pathMatch:  "full",redirectTo:  "home"},
  {path: "home", component: HomeComponent, canActivate:[isAuthenticatedGuard]},

  //{path: "produse", component: ProduseListComponent, canActivate:[IsAdminGuard]},
  {path: "produse", component: ProduseListComponent, canActivate:[isAuthenticatedGuard]},
  {path: "produse/create", component: ProduseCreateComponent, canActivate:[isAuthenticatedGuard]},
  {path: "produse/edit/:id", component: ProduseEditComponent, canActivate:[isAuthenticatedGuard]},
  
  {path: "furnizori", component: FurnizoriListComponent, canActivate:[isAuthenticatedGuard]},
  {path: "furnizori/create", component: FurnizoriCreateComponent, canActivate:[isAuthenticatedGuard]},
  {path: "furnizori/edit/:id", component: FurnizoriEditComponent, canActivate:[isAuthenticatedGuard]},

  {path: "arhitecti", component: ArhitectiListComponent, canActivate:[isAuthenticatedGuard]},
  {path: "arhitecti/create", component: ArhitectiCreateComponent, canActivate:[isAuthenticatedGuard]},
  {path: "arhitecti/edit/:id", component: ArhitectiEditComponent, canActivate:[isAuthenticatedGuard]},

  {path: "clienti", component: ClientiListComponent, canActivate:[isAuthenticatedGuard]} ,
  {path: "clienti/create", component: ClientiCreateComponent, canActivate:[isAuthenticatedGuard]},
  {path: "clienti/edit/:id", component: ClientiEditComponent, canActivate:[isAuthenticatedGuard]},
  {path: "clienti/filter", component: ClientiFilterComponent},

  {path: "oferte", component: OferteListComponent, canActivate:[isAuthenticatedGuard]} ,
  {path: "oferte/create", component: OferteCreateComponent, canActivate:[isAuthenticatedGuard]},
  {path: "oferte/edit/:id", component: OferteEditComponent, canActivate:[isAuthenticatedGuard]},
  {path: "oferte/filter", component: OferteFilterComponent},

  {path: "comenzi", component: ComenziListComponent, canActivate:[isAuthenticatedGuard]} ,
  {path: "comenzi/create", component: ComenziCreateComponent, canActivate:[isAuthenticatedGuard]},
  {path: "comenzi/edit/:id", component: ComenziEditComponent, canActivate:[isAuthenticatedGuard]},

  {path: "transport", component: TransportListComponent, canActivate:[isAuthenticatedGuard]} ,
  {path: "transport/create", component: TransportatorCreateComponent, canActivate:[isAuthenticatedGuard]},
  {path: "transport/edit/:id", component: TransportEditComponent, canActivate:[isAuthenticatedGuard]},

  {path: "comenziFurnizor", component: ComenziFurnListComponent, canActivate:[isAuthenticatedGuard]} ,
  {path: "comenziFurnizor/create", component: ComenziFurnCreateComponent, canActivate:[isAuthenticatedGuard]},
  {path: "comenziFurnizor/edit/:id", component: ComenziFurnEditComponent, canActivate:[isAuthenticatedGuard]},

  {path: "um", component:UmListComponent, canActivate:[isAuthenticatedGuard]},
  {path: "um/create", component: UmCreateComponent, canActivate:[isAuthenticatedGuard]},
  {path: "um/edit/:id", component: UmEditComponent, canActivate:[isAuthenticatedGuard]},

  {path: "transportator", component:TransportatorListComponent, canActivate:[isAuthenticatedGuard]},
  {path: "transportator/create", component: TransportatorCreateComponent, canActivate:[isAuthenticatedGuard]},
  {path: "transportator/edit/:id", component: TransportatorEditComponent, canActivate:[isAuthenticatedGuard]},

  {path: "depozite", component:DepoziteListComponent, canActivate:[isAuthenticatedGuard]},
  {path: "depozite/create", component: DepoziteCreateComponent, canActivate:[isAuthenticatedGuard]},
  {path: "depozite/edit/:id", component: DepoziteEditComponent, canActivate:[isAuthenticatedGuard]},

  {path: "livrari", component: LivrariListComponent, canActivate:[isAuthenticatedGuard]} ,  
  {path: "livrari/create", component: LivrariCreateComponent, canActivate:[isAuthenticatedGuard]} ,  
  {path: "livrari/edit/:id", component: LivrariEditComponent, canActivate:[isAuthenticatedGuard]},

  {path: "notes", component: StickyNotesListComponent} ,  

  {path: "notificari", component: NotificariListComponent} ,  
  {path: "notificari/edit/:id", component: NotificariItemComponent},

  {path: "sucursale", component:SucursaleListComponent, canActivate:[isAuthenticatedGuard]},
  {path: "sucursale/create", component: SucursaleCreateComponent, canActivate:[isAuthenticatedGuard]},
  {path: "sucursale/edit/:id", component: SucursaleEditComponent, canActivate:[isAuthenticatedGuard]},

  {path: "rapoarte/comisionArhitect", component: ComisionArhitectiComponent, canActivate:[isAuthenticatedGuard]},
  {path: "rapoarte/comenziUtilizatori", component: ComenziUtilizatoriComponent, canActivate:[isAuthenticatedGuard]},
  {path: "rapoarte/comenziDepozite", component: ComenziDepoziteComponent, canActivate:[isAuthenticatedGuard]},
  {path: "rapoarte/timelineStoc/:id", component: TimelineStockComponent, canActivate:[isAuthenticatedGuard]},
  {path: "rapoarte/removeFurnizoriDuplicate", component: RemoveDuplicatesComponent, canActivate:[isAuthenticatedGuard]},

  {path: "nir", component: NirListComponent, canActivate:[isAuthenticatedGuard]},
  {path: "nir/create", component: NirCreateComponent, canActivate:[isAuthenticatedGuard]} ,  
  {path: "nir/edit/:id", component: NirEditComponent, canActivate:[isAuthenticatedGuard]},

  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "forgetPass", component: ForgetPassComponent},
  {path: "resetPass", component: ResetPassComponent},
  {path: "confirmEmail", component: ConfirmEmailComponent},
  {path: "utilizatori", component: UtilizatoriListComponent, canActivate:[isAuthenticatedGuard]},
  {path: "utilizatori/edit/:id", component: UtilizatoriEditComponent, canActivate:[isAuthenticatedGuard]},
  {path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CookieService],
})
export class AppRoutingModule { }
