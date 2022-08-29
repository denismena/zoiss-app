import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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
  public form!: UntypedFormGroup;

  constructor(private reportService: RapoarteService, private formBuilder:UntypedFormBuilder, private router:Router) { 
    this.comisioaneArhitecti = [];
    this.expandedElement = [];
  }

  columnsToDisplay= ['expand', 'arhitect', 'valoare', 'select'];
  ngOnInit(): void {
    let date: Date = new Date();
    date.setDate(date.getDate() - 30);
    this.form = this.formBuilder.group({
      fromDate: formatDateFormData(date),
      toDate: formatDateFormData(new Date()),
    });

    this.loadList(this.form.value);

    this.form.valueChanges.subscribe(values=>{
      values.fromDate = formatDateFormData(values.fromDate);
      values.toDate = formatDateFormData(values.toDate);
      this.loadList(values);            
    })
  }

  loadList(values: any){
    this.reportService.comisionArhitecti(values).subscribe((response: HttpResponse<arhitectiComisionDTO[]>)=>{
      this.comisioaneArhitecti = response.body??[];
      console.log('this.comisioaneArhitecti', this.comisioaneArhitecti);
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

}
