import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { clientiDTO } from '../clienti-item/clienti.model';
import { ClientiService } from '../clienti.service';

@Component({
  selector: 'app-clienti-list',
  templateUrl: './clienti-list.component.html',
  styleUrls: ['./clienti-list.component.scss']
})
export class ClientiListComponent implements OnInit {

  clienti: clientiDTO[];
  errors: string[] = [];
  loading$: boolean = true;
  public form!: UntypedFormGroup;
  totalRecords:number = 0;
  currentPage:number = 1;
  pageSize: number = 100;
  initialFormValues: any;
  panelOpenState = false;
  constructor(private clientiService: ClientiService, private formBuilder:UntypedFormBuilder) { 
    this.clienti = [];
  }
  columnsToDisplay= ['nume', 'pfPj', 'cuicnp', 'registruComert', 'action'];
  ngOnInit(): void {

    this.form = this.formBuilder.group({            
      nume: '',
      pfPj: '',
      cuicnp: '',
      registruComert: '',      
      active: 0,
      faraAdresa: false
    });  

    this.initialFormValues = this.form.value
    this.loadList(this.form.value);
    this.form.valueChanges.subscribe(values=>{
      this.loadList(values);      
    })
  }

  loadList(values:any){
    values.page = this.currentPage;
    values.recordsPerPage = this.pageSize;
    this.clientiService.getAll(values).subscribe((response: HttpResponse<clientiDTO[]>)=>{
      this.clienti = response.body??[];
      this.totalRecords = Number(response.headers.get("totalrecords"));
      this.loading$ = false;
      console.log(this.clienti);
    });    
  }
  delete(id: number){
    this.clientiService.delete(id)
    .subscribe(() => {
      this.loadList(this.form.value);
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }

  clearForm(){
    this.form.patchValue(this.initialFormValues);    
  }

  updatePagination(event: PageEvent){
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadList(this.form.value);
  }
  togglePanel(){
    this.panelOpenState = !this.panelOpenState;
  }
  
}
