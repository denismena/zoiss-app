import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Router } from '@angular/router';
import { formatDateFormData, parseWebAPIErrors } from 'src/app/utilities/utils';
import { comenziDTO, produseComandaDTO } from '../comenzi-item/comenzi.model';
import { ComenziService } from '../comenzi.service';
import Swal from 'sweetalert2';
import { ComenziFurnizorService } from 'src/app/comenzi-furn/comenzi-furn.service';
import { HttpResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { date } from '@rxweb/reactive-form-validators';
import { ClientiAutocompleteComponent } from 'src/app/nomenclatoare/clienti/clienti-autocomplete/clienti-autocomplete.component';
import { ArhitectiAutocompleteComponent } from 'src/app/nomenclatoare/arhitecti/arhitecti-autocomplete/arhitecti-autocomplete.component';
import { ProduseAutocompleteComponent } from 'src/app/nomenclatoare/produse/produse-autocomplete/produse-autocomplete.component';
import { FurnizoriAutocompleteComponent } from 'src/app/nomenclatoare/furnizori/furnizori-autocomplete/furnizori-autocomplete.component';
import { furnizoriDTO } from 'src/app/nomenclatoare/furnizori/furnizori-item/furnizori.model';
import { RapoarteService } from 'src/app/rapoarte/rapoarte.service';
import { CookieService } from 'src/app/utilities/cookie.service';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-comenzi-list',
  templateUrl: './comenzi-list.component.html',
  styleUrls: ['./comenzi-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ComenziListComponent implements OnInit {

  comenzi: comenziDTO[];
  expandedElement: comenziDTO[];
  checked = [];
  @ViewChildren ('checkBox') 
  checkBox:QueryList<any> = new QueryList();
  errors: string[] = [];
  public form!: FormGroup;
  totalRecords:number = 0;
  currentPage:number = 1;
  pageSize: number = 20;
  initialFormValues: any;
  panelOpenState = false;
  loading$: boolean = true;
  @ViewChild(ClientiAutocompleteComponent)
  clientFilter!: ClientiAutocompleteComponent;
  @ViewChild(ArhitectiAutocompleteComponent)
  arhitectFilter!: ArhitectiAutocompleteComponent;
  @ViewChild(ProduseAutocompleteComponent)
  produsFilter!: ProduseAutocompleteComponent;
  @ViewChild(FurnizoriAutocompleteComponent)
  furnizorFilter!: FurnizoriAutocompleteComponent;

  constructor(private comenziService: ComenziService, private comenziFurnizorService: ComenziFurnizorService, 
    private router:Router, private formBuilder:FormBuilder, private rapoarteService: RapoarteService, public cookie: CookieService) { 
    this.comenzi = [];
    this.expandedElement = [];
  }
  columnsToDisplay= ['expand', 'numar', 'data', 'client', 'arhitect', 'utilizator', 'avans', 'valoare', 'comandate', 'platit', 'select', 'action'];

  ngOnInit(): void {
    let date: Date = new Date();
    date.setDate(date.getDate() - 30);
    this.form = this.formBuilder.group({
      fromDate: formatDateFormData(date),
      toDate: formatDateFormData(new Date()),
      clientId: 0,
      arhitectId: 0,      
      produsId: 0,
      furnizorId:0,
      // mine: false,
      // sucursala: true,
      // allComandate: false
      mine: this.cookie.getCookie('comanda_mine')== '' ? false: this.cookie.getCookie('comanda_mine'),
      sucursala: this.cookie.getCookie('comanda_sucursala')== '' ? false: this.cookie.getCookie('comanda_sucursala'),
      allComandate: this.cookie.getCookie('comanda_allComandate')== '' ? false: this.cookie.getCookie('comanda_allComandate')
    });

    this.initialFormValues = this.form.value
    this.loadList(this.form.value);

    this.form.valueChanges.subscribe(values=>{
      values.fromDate = formatDateFormData(values.fromDate);
      values.toDate = formatDateFormData(values.toDate);
      this.loadList(values);      
      //set cookies      
      this.cookie.setCookie({name: 'comanda_mine',value: values.mine, session: true});
      this.cookie.setCookie({name: 'comanda_sucursala',value: values.sucursala, session: true});
      this.cookie.setCookie({name: 'comanda_allComandate',value: values.allComandate, session: true});
    })
  }

  loadList(values: any){
    values.page = this.currentPage;
    values.recordsPerPage = this.pageSize;
    this.comenziService.getAll(values).subscribe((response: HttpResponse<comenziDTO[]>)=>{
      this.comenzi = response.body??[];
      this.totalRecords = Number(response.headers.get("totalRecords"));
      this.loading$ = false;
    });    
  }

  delete(id: number){
    this.comenziService.delete(id)
    .subscribe(() => {
      this.loadList(this.form.value);
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }

  expand(element: comenziDTO){
    var index = this.expandedElement.findIndex(f=>f.id == element.id);
    if(index == -1)
      this.expandedElement.push(element);
    else this.expandedElement.splice(index,1);    
  }

  togglePanel(){
    this.panelOpenState = !this.panelOpenState;
  }

  getCheckbox(checkbox: any, row: comenziDTO){
    this.checked = [];
    console.log(row);
    row.comenziProduses.forEach(p=>p.addToComandaFurnizor = checkbox.checked
    );    
  }

  isAllSelected(row: comenziDTO) {   
    row.allComandate = row.comenziProduses.every(function(item:any) {
          return item.addToComandaFurnizor == true;
    })
  }

  genereazaComandaFurnizor()
  {
    console.log('in generat');
    var selectedProd: produseComandaDTO[] = [];
    var comenziNeplatite = false;
    var maiMultiFurnizori = false;
    var faraFurnizor = false;
    var furnizorId = 0;
    this.comenzi.forEach(element => {
      element.comenziProduses.forEach(prod=>{
        //console.log('prod', prod);
        if(prod.addToComandaFurnizor && !prod.isInComandaFurnizor && !prod.isCategory && !prod.isStoc) 
          {            
            if(prod.furnizorId == null && prod.isCategory == false) 
            { 
              faraFurnizor = true;
            }
            else{
              selectedProd.push(prod);
              if(!element.platit) comenziNeplatite = true;
              
              if(furnizorId != prod.furnizorId && furnizorId > 0)  maiMultiFurnizori = true; 
              else furnizorId = prod.furnizorId;
            }
          }
      });      
    });

    console.log('selectedProd', selectedProd);    
    if(faraFurnizor) 
    {       
      Swal.fire({ title: "Atentie!", text: "Unul dintre produse nu are furnizor!", icon: 'info' });
      return;
    }
    if(maiMultiFurnizori) 
    { 
      Swal.fire({ title: "Atentie!", text: "Ati selectat produse de la mai multi furnizori!", icon: 'info' });
      return;
    }
    if(selectedProd.length == 0){
      Swal.fire({ title: "Atentie!", text: "Nu ati selectat nici o oferta!", icon: 'info' });
      return;
    }
    
    if(comenziNeplatite)
      Swal.fire({
        title: 'Atentie!',
        text: "Ati selectat o comanda care nu este platita! Doriti sa continuati?",
        icon: 'warning',
        showCancelButton: true,
        // confirmButtonColor: '#3085d6',
        // cancelButtonColor: '#d33',
        // confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.genereazaComnada(selectedProd);
        }
      });  
      
      this.genereazaComnada(selectedProd);
  }

  genereazaComnada(selectedProd:any){
    this.comenziFurnizorService.fromOferta(selectedProd).subscribe(id=>{
      console.log('comanda new id', id);
      this.router.navigate(['/comenziFurnizor/edit/' + id])
    }, 
    error=> this.errors = parseWebAPIErrors(error));
    console.log('aici a generat comanda');
  }
  updatePagination(event: PageEvent){
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadList(this.form.value);
  }

  clearForm(){
    this.form.patchValue(this.initialFormValues);
    this.clientFilter.clearSelection();
    this.arhitectFilter.clearSelection();
    this.produsFilter.clearSelection();    
    this.furnizorFilter.clearSelection();
  }

//#region filtre
  selectProdus(produs: any){    
    this.form.get('produsId')?.setValue(produs.id);
    this.form.get('produsNume')?.setValue(produs.nume);    
    console.log('produsId: ', this.form.get('produsId')?.value);
 }

 selectClient(clientId: string){
    this.form.get('clientId')?.setValue(clientId);
    console.log('clientNume: ', this.form.get('clientId')?.value);
  }

  selectArhitect(arhitectId: string){
    this.form.get('arhitectId')?.setValue(arhitectId);
    console.log('arhitectId: ', this.form.get('arhitectId')?.value);
  }
  selectFurnizor(furnizor: any){
    this.form.get('furnizorId')?.setValue(furnizor.id);
    console.log('furnizorId: ', this.form.get('furnizorId')?.value);
  }
 //#endregion
 genereazaExcel(element:any)
 {
   this.loading$ = true;
   this.rapoarteService.comandaReport(element.id).subscribe(blob => {
     const dt = new Date(element.data)
     saveAs(blob, 'Comanda ' + element.client + ' ' + dt.toLocaleDateString() + '.xlsx');
     this.loading$ = false;
   }, error => {
     console.log("Something went wrong");
   });
 }
 genereazaPDF(element:any)
  {    
    this.loading$ = true;
    this.rapoarteService.comandaReportPDF(element.id).subscribe(blob => {
      //var fileURL = window.URL.createObjectURL(blob);
      this.loading$ = false;
      const dt = new Date(element.data)
      saveAs(blob, 'Comanda ' + element.client + ' ' + dt.toLocaleDateString()+'.pdf');
      //window.open(fileURL, "_blank");
    }, error => {
      console.log("Something went wrong");
    });
  }

}
