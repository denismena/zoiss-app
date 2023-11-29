import { Component, OnDestroy, OnInit } from '@angular/core';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { arhitectiDTO } from '../arhitecti-item/arhitecti.model';
import { ArhitectiService } from '../arhitecti.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-arhitecti-list',
  templateUrl: './arhitecti-list.component.html',
  styleUrls: ['./arhitecti-list.component.scss']
})
export class ArhitectiListComponent implements OnInit, OnDestroy {

  arhitecti: arhitectiDTO[];
  errors: string[] = [];
  loading$: boolean = true;
  constructor(private arhitectiService: ArhitectiService, private unsubscribeService: UnsubscribeService) { 
    this.arhitecti = [];
  }

  columnsToDisplay= ['nume', 'adresa', 'tel', 'email', 'comision', 'action'];

  ngOnInit(): void {
    this.loadList();
  }
  loadList(){
    this.arhitectiService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))    
    .subscribe(arhitecti=>{
      this.arhitecti = arhitecti;
      this.loading$ = false;
    }, error => {
      this.errors = parseWebAPIErrors(error);      
      this.loading$ = false;
    });    
  }
  delete(id: number){
    this.arhitectiService.delete(id)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }

  ngOnDestroy(): void {}

}
