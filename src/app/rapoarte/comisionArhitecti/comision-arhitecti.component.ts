import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import saveAs from 'file-saver';
import { ExportService } from 'src/app/utilities/export.service';
import { formatDateFormData, parseWebAPIErrors } from 'src/app/utilities/utils';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';
import { RapoarteService } from '../rapoarte.service';
import { arhitectiComisionDTO, comandaArhitectiDTO } from './comision-arhitecti.model';

@Component({
    selector: 'app-comision-arhitecti',
    templateUrl: './comision-arhitecti.component.html',
    styleUrls: ['./comision-arhitecti.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: false
})
export class ComisionArhitectiComponent implements OnInit {

  loading$: boolean = true;
  checked: any[] = [];
  comisioaneArhitecti: arhitectiComisionDTO[];
  expandedElement: arhitectiComisionDTO[];
  sortedData: arhitectiComisionDTO[] = [];
  errors: string[] = [];
  public form!: FormGroup;

  private destroyRef = inject(DestroyRef);
  constructor(private reportService: RapoarteService, private formBuilder:FormBuilder, 
      private exportService: ExportService, private dialog: MatDialog) { 
    this.comisioaneArhitecti = [];
    this.expandedElement = [];    
  }

  columnsToDisplay= ['expand', 'arhitect', 'cantitate', 'valoare', 'select', 'action'];
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
    this.reportService.comisionArhitecti(values)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((response: HttpResponse<arhitectiComisionDTO[]>)=>{
      this.comisioaneArhitecti = response.body??[];
      this.sortedData = this.comisioaneArhitecti.slice();
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
      this.dialog.open(MessageDialogComponent, {data:{title: "Atentie!", message: "Nu ati selectat nici o comanda!"}});
      return;
    }
    this.reportService.plateste(selectedComenzi)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(id=>{      
      this.loadList(this.form.value);
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

  genereazaPDF(element:any)
  {    
    var selectedComenziId: number[] = [];
    //this.comisioaneArhitecti.forEach(element => {
    element.comenzi.forEach((com: comandaArhitectiDTO) => {
      if (com.addToPlatit) selectedComenziId.push(com.id);
    });
      //});
    this.loading$ = true;
    const dtfrom = new Date(this.form.controls['fromDate'].value);
    const dtTo = new Date(this.form.controls['toDate'].value);
    this.exportService.comisionArhitectPDF(selectedComenziId, dtfrom, dtTo)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(blob => {      
      saveAs(blob, 'Comision Arhitect ' + element.arhitect + ' ' + dtfrom.toLocaleDateString()+ '-' + dtTo.toLocaleDateString() + '.pdf');
      this.loading$ = false;
    }, error => {
      console.log("Something went wrong");
    });
  }

  getTotalCost() {
    return this.comisioaneArhitecti.map(t => t.valoare).reduce((acc, value) => Number(acc) + Number(value), 0).toFixed(2);
  }

  sortData(sort: any) {
    console.log('sort', sort);
    const data = this.comisioaneArhitecti.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'arhitect':
          return this.compare(a.arhitect, b.arhitect, isAsc);
        case 'cantitate':
          return this.compare(a.cantitate, b.cantitate, isAsc);
        case 'valoare':
          return this.compare(a.valoare, b.valoare, isAsc);        
        default:
          return 0;
      }
    });
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
