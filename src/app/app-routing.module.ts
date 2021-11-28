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
import { IsAdminGuard } from './is-admin.guard';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { UtilizatoriListComponent } from './nomenclatoare/utilizatori/utilizatori-list/utilizatori-list.component';
import { UtilizatoriEditComponent } from './nomenclatoare/utilizatori/utilizatori-edit/utilizatori-edit.component';
import { ComenziFurnListComponent } from './comenzi-furn/comenzi-furn-list/comenzi-furn-list.component';
import { ComenziFurnCreateComponent } from './comenzi-furn/comenzi-furn-item/comenzi-furn-create/comenzi-furn-create.component';
import { ComenziFurnEditComponent } from './comenzi-furn/comenzi-furn-item/comenzi-furn-edit/comenzi-furn-edit.component';

const routes: Routes = [
  {path:  "", pathMatch:  "full",redirectTo:  "home"},
  {path: "home", component: HomeComponent},

  //{path: "produse", component: ProduseListComponent, canActivate:[IsAdminGuard]},
  {path: "produse", component: ProduseListComponent},
  {path: "produse/create", component: ProduseCreateComponent},
  {path: "produse/edit/:id", component: ProduseEditComponent},
  
  {path: "furnizori", component: FurnizoriListComponent},
  {path: "furnizori/create", component: FurnizoriCreateComponent},
  {path: "furnizori/edit/:id", component: FurnizoriEditComponent},

  {path: "arhitecti", component: ArhitectiListComponent},
  {path: "arhitecti/create", component: ArhitectiCreateComponent},
  {path: "arhitecti/edit/:id", component: ArhitectiEditComponent},

  {path: "clienti", component: ClientiListComponent} ,
  {path: "clienti/create", component: ClientiCreateComponent},
  {path: "clienti/edit/:id", component: ClientiEditComponent},
  {path: "clienti/filter", component: ClientiFilterComponent},

  {path: "oferte", component: OferteListComponent} ,
  {path: "oferte/create", component: OferteCreateComponent},
  {path: "oferte/edit/:id", component: OferteEditComponent},
  {path: "oferte/filter", component: OferteFilterComponent},

  {path: "comenzi", component: ComenziListComponent} ,
  {path: "comenzi/create", component: ComenziCreateComponent},
  {path: "comenzi/edit/:id", component: ComenziEditComponent},

  {path: "comenziFurnizor", component: ComenziFurnListComponent} ,
  {path: "comenziFurnizor/create", component: ComenziFurnCreateComponent},
  {path: "comenziFurnizor/edit/:id", component: ComenziFurnEditComponent},

  {path: "um", component:UmListComponent},
  {path: "um/create", component: UmCreateComponent},
  {path: "um/edit/:id", component: UmEditComponent},

  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "utilizatori", component: UtilizatoriListComponent},
  {path: "utilizatori/edit/:id", component: UtilizatoriEditComponent},
  {path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
