import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { furnizoriDTO } from '../furnizori-item/furnizori.model';
import { FurnizoriService } from '../furnizori.service';

@Component({
  selector: 'app-furnizori-list',
  templateUrl: './furnizori-list.component.html',
  styleUrls: ['./furnizori-list.component.scss']
})
export class FurnizoriListComponent implements OnInit {

  furnizori: furnizoriDTO[];
  errors: string[] = [];
  loading$: boolean = true;
  public form!: FormGroup;
  totalRecords:number = 0;
  currentPage:number = 1;
  pageSize: number = 100;
  initialFormValues: any;
  panelOpenState = false;
  constructor(private furnizoriService: FurnizoriService, private formBuilder:FormBuilder) { 
    this.furnizori = [];
  }

  columnsToDisplay= ['nume', 'oras', 'judet', 'tara', 'adresa', 'tel', 'email', 'action'];

  ngOnInit(): void {
    this.form = this.formBuilder.group({            
      nume: '',
      //oras: '',
      judet: '',
      tara: '',      
      active: 0
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
    this.furnizoriService.getAll(values).subscribe((response: HttpResponse<furnizoriDTO[]>)=>{
      this.furnizori = response.body??[];
      this.totalRecords = Number(response.headers.get("totalrecords"));
      this.loading$ = false;
      console.log(this.furnizori);
    });    
  }
  delete(id: number){
    this.furnizoriService.delete(id)
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
