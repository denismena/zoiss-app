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

const routes: Routes = [
  {path:  "", pathMatch:  "full",redirectTo:  "home"},
  {path: "home", component: HomeComponent},

  //{path: "produse", component: ProduseListComponent, canActivate:[IsAdminGuard]},
  {path: "produse", component: ProduseListComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "produse/create", component: ProduseCreateComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "produse/edit/:id", component: ProduseEditComponent, canActivate:[IsAuthenticatedGuard]},
  
  {path: "furnizori", component: FurnizoriListComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "furnizori/create", component: FurnizoriCreateComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "furnizori/edit/:id", component: FurnizoriEditComponent, canActivate:[IsAuthenticatedGuard]},

  {path: "arhitecti", component: ArhitectiListComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "arhitecti/create", component: ArhitectiCreateComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "arhitecti/edit/:id", component: ArhitectiEditComponent, canActivate:[IsAuthenticatedGuard]},

  {path: "clienti", component: ClientiListComponent, canActivate:[IsAuthenticatedGuard]} ,
  {path: "clienti/create", component: ClientiCreateComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "clienti/edit/:id", component: ClientiEditComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "clienti/filter", component: ClientiFilterComponent},

  {path: "oferte", component: OferteListComponent, canActivate:[IsAuthenticatedGuard]} ,
  {path: "oferte/create", component: OferteCreateComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "oferte/edit/:id", component: OferteEditComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "oferte/filter", component: OferteFilterComponent},

  {path: "comenzi", component: ComenziListComponent, canActivate:[IsAuthenticatedGuard]} ,
  {path: "comenzi/create", component: ComenziCreateComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "comenzi/edit/:id", component: ComenziEditComponent, canActivate:[IsAuthenticatedGuard]},

  {path: "transport", component: TransportListComponent, canActivate:[IsAuthenticatedGuard]} ,
  {path: "transport/create", component: TransportatorCreateComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "transport/edit/:id", component: TransportEditComponent, canActivate:[IsAuthenticatedGuard]},

  {path: "comenziFurnizor", component: ComenziFurnListComponent, canActivate:[IsAuthenticatedGuard]} ,
  {path: "comenziFurnizor/create", component: ComenziFurnCreateComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "comenziFurnizor/edit/:id", component: ComenziFurnEditComponent, canActivate:[IsAuthenticatedGuard]},

  {path: "um", component:UmListComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "um/create", component: UmCreateComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "um/edit/:id", component: UmEditComponent, canActivate:[IsAuthenticatedGuard]},

  {path: "transportator", component:TransportatorListComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "transportator/create", component: TransportatorCreateComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "transportator/edit/:id", component: TransportatorEditComponent, canActivate:[IsAuthenticatedGuard]},

  {path: "depozite", component:DepoziteListComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "depozite/create", component: DepoziteCreateComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "depozite/edit/:id", component: DepoziteEditComponent, canActivate:[IsAuthenticatedGuard]},

  {path: "livrari", component: LivrariListComponent, canActivate:[IsAuthenticatedGuard]} ,  
  {path: "livrari/create", component: LivrariCreateComponent, canActivate:[IsAuthenticatedGuard]} ,  
  {path: "livrari/edit/:id", component: LivrariEditComponent, canActivate:[IsAuthenticatedGuard]},

  {path: "notes", component: StickyNotesListComponent} ,  

  {path: "notificari", component: NotificariListComponent} ,  
  {path: "notificari/edit/:id", component: NotificariItemComponent},

  {path: "sucursale", component:SucursaleListComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "sucursale/create", component: SucursaleCreateComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "sucursale/edit/:id", component: SucursaleEditComponent, canActivate:[IsAuthenticatedGuard]},

  {path: "rapoarte/comisionArhitect", component: ComisionArhitectiComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "rapoarte/comenziUtilizatori", component: ComenziUtilizatoriComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "rapoarte/comenziDepozite", component: ComenziDepoziteComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "rapoarte/timelineStoc/:id", component: TimelineStockComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "rapoarte/removeFurnizoriDuplicate", component: RemoveDuplicatesComponent, canActivate:[IsAuthenticatedGuard]},

  {path: "nir", component: NirListComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "nir/create", component: NirCreateComponent, canActivate:[IsAuthenticatedGuard]} ,  
  {path: "nir/edit/:id", component: NirEditComponent, canActivate:[IsAuthenticatedGuard]},

  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "forgetPass", component: ForgetPassComponent},
  {path: "resetPass", component: ResetPassComponent},
  {path: "confirmEmail", component: ConfirmEmailComponent},
  {path: "utilizatori", component: UtilizatoriListComponent, canActivate:[IsAuthenticatedGuard]},
  {path: "utilizatori/edit/:id", component: UtilizatoriEditComponent, canActivate:[IsAuthenticatedGuard]},
  {path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CookieService],
})
export class AppRoutingModule { }
