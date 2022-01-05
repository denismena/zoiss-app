import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { transportDTO } from '../transport-item/transport.model';
import { TransportService } from '../transport.service';

@Component({
  selector: 'app-transport-list',
  templateUrl: './transport-list.component.html',
  styleUrls: ['./transport-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TransportListComponent implements OnInit {

  transport: transportDTO[]
  expandedElement: transportDTO[];
  checked = [];
  @ViewChildren ('checkBox') 
  checkBox:QueryList<any> = new QueryList();
  errors: string[] = [];
  constructor(private transporService: TransportService) { 
    this.transport = [];
    this.expandedElement = [];
  }

  columnsToDisplay= ['expand','referinta', 'data', 'transportator', 'utilizator', 'action'];

  ngOnInit(): void {
    this.loadList();
  }
  loadList(){
    this.transporService.getAll().subscribe(transport=>{
      this.transport = transport;
      console.log(this.transport);
    });    
  }

  delete(id: number){
    this.transporService.delete(id)
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }
  expand(element: transportDTO){
    var index = this.expandedElement.findIndex(f=>f.id == element.id);
    if(index == -1)
      this.expandedElement.push(element);
    else this.expandedElement.splice(index,1);    
  }

}
