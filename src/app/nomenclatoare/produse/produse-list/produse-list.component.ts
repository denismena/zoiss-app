import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { umDTO } from '../../um/um-item/um.model';
import { UMService } from '../../um/um.service';
import { produseDTO } from '../produse-item/produse.model';
import { ProduseService } from '../produse.service';

@Component({
  selector: 'app-produse-list',
  templateUrl: './produse-list.component.html',
  styleUrls: ['./produse-list.component.scss']
})
export class ProduseListComponent implements OnInit {

  produse: produseDTO[];
  errors: string[] = [];
  loading$: boolean = true;
  public form!: FormGroup;
  umList: umDTO[]=[];
  totalRecords:number = 0;
  currentPage:number = 1;
  pageSize: number = 100;
  initialFormValues: any;
  panelOpenState = false;
  constructor(private produseService: ProduseService, private formBuilder:FormBuilder, private umService: UMService) {  
    this.produse = [];
  }
  
  columnsToDisplay= ['cod', 'nume', 'perCutie', 'pret', 'um', 'action'];

  ngOnInit(): void {  
    this.form = this.formBuilder.group({            
      nume: '',
      cod: '',      
      active: 0,
      umId:0,
    });  

    this.initialFormValues = this.form.value
    this.loadList(this.form.value);

    this.umService.getAll().subscribe(um=>{
      this.umList=um;
    })

    this.form.valueChanges.subscribe(values=>{
      this.loadList(values);      
    })
  }

  loadList(values: any){
    values.page = this.currentPage;
    values.recordsPerPage = this.pageSize;
    this.produseService.getAll(values).subscribe((response: HttpResponse<produseDTO[]>)=>{
      this.produse = response.body??[];
      console.log(this.produse);
      this.totalRecords = Number(response.headers.get("totalRecords"));
      this.loading$ = false;
    });    
  }
  delete(id: number){
    this.produseService.delete(id)
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

}
