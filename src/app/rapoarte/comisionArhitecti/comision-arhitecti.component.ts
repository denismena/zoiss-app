import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as saveAs from 'file-saver';
import { ExportService } from 'src/app/utilities/export.service';
import { formatDateFormData, parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { RapoarteService } from '../rapoarte.service';
import { arhitectiComisionDTO, comandaArhitectiDTO } from './comision-arhitecti.model';

@Component({
  selector: 'app-comision-arhitecti',
  templateUrl: './comision-arhitecti.component.html',
  styleUrls: ['./comision-arhitecti.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ComisionArhitectiComponent implements OnInit {

  loading$: boolean = true;
  checked = [];
  comisioaneArhitecti: arhitectiComisionDTO[];
  expandedElement: arhitectiComisionDTO[];
  errors: string[] = [];
  public form!: FormGroup;

  constructor(private reportService: RapoarteService, private formBuilder:FormBuilder, 
      private router:Router, private exportService: ExportService) { 
    this.comisioaneArhitecti = [];
    this.expandedElement = [];
  }

  columnsToDisplay= ['expand', 'arhitect', 'valoare', 'select', 'action'];
  ngOnInit(): void {
    let date: Date = new Date();
    date.setDate(date.getDate() - 30);
    this.form = this.formBuilder.group({
      arhitectId: 0,
      fromDate: formatDateFormData(date),
      toDate: formatDateFormData(new Date()),
      status: ''
    });

    this.loadList(this.form.value);

    this.form.valueChanges.subscribe(values=>{
      values.arhitectId = values.arhitectId;
      values.status = values.status;
      values.fromDate = formatDateFormData(values.fromDate);
      values.toDate = formatDateFormData(values.toDate);
      this.loadList(values);            
    })
  }

  loadList(values: any){
    this.reportService.comisionArhitecti(values).subscribe((response: HttpResponse<arhitectiComisionDTO[]>)=>{
      this.comisioaneArhitecti = response.body??[];
      //console.log('this.comisioaneArhitecti', this.comisioaneArhitecti);
      this.loading$ = false;
    });    
  }

  expand(element: arhitectiComisionDTO){
    var index = this.expandedElement.findIndex(f=>f.arhitect == element.arhitect);
    if(index == -1)
      this.expandedElement.push(element);
    else this.expandedElement.splice(index,1);    
  }

  isAllSelected(row: arhitectiComisionDTO) {   
    row.selectAllSprePlata = row.comenzi.every(function(item:any) {
          return item.addToPlatit == true;
    })
    return true;
  }

  getCheckbox(checkbox: any, row: arhitectiComisionDTO){
    this.checked = [];    
    row.comenzi.forEach(p=>p.addToPlatit = checkbox.checked);    
  }

  plateste(){
    //console.log('selectedComenzi', selectedComenzi);
    var selectedComenzi: comandaArhitectiDTO[] = [];
    this.comisioaneArhitecti.forEach(element => {
      element.comenzi.forEach(com=>{
        if(com.addToPlatit){
            com.arhitectPlatit = true;
            selectedComenzi.push(com);
        }
      })
    });
    if(selectedComenzi.length == 0){
      Swal.fire({ title: "Atentie!", text: "Nu ati selectat nici o comanda!", icon: 'info' });
      return;
    }
    this.reportService.plateste(selectedComenzi).subscribe(id=>{      
      this.loadList(this.form.value);
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

  genereazaPDF(element:any)
  {    
    this.loading$ = true;
    this.form.get('arhitectId')?.setValue(element.arhitectId);
    console.log('this.form.value', this.form.value);
    console.log('element', element);
    this.exportService.comisionArhitectPDF(this.form.value).subscribe(blob => {
      //var fileURL = window.URL.createObjectURL(blob);      
      const dtfrom = new Date(this.form.controls['fromDate'].value);
      const dtTo = new Date(this.form.controls['toDate'].value);
      saveAs(blob, 'Comision Arhitect ' + element.arhitect + ' ' + dtfrom.toLocaleDateString()+ '-' + dtTo.toLocaleDateString() + '.pdf');
      this.loading$ = false;
      //window.open(fileURL, "_blank");
    }, error => {
      console.log("Something went wrong");
    });
  }

}
