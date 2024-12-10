import { Component, OnDestroy, OnInit } from '@angular/core';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { SucursaleService } from '../sucursala.service';
import { sucursalaDTO } from '../sucursale-item/sucursala.model';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-sucursale-list',
    templateUrl: './sucursale-list.component.html',
    styleUrls: ['./sucursale-list.component.scss'],
    standalone: false
})
export class SucursaleListComponent implements OnInit, OnDestroy {

  sucursala: sucursalaDTO[] = [];
  columnsToDisplay= ['nume', 'action'];
  errors: string[] = [];
  loading$: boolean = true;
  constructor(private sucursalaService: SucursaleService, private unsubscribeService: UnsubscribeService) { }

  ngOnInit(): void {
    this.loadList();
  }

  loadList(){
    this.sucursalaService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(sucursala=>{
      this.sucursala = sucursala;
      this.loading$ = false;
    }, error => {
      this.errors = parseWebAPIErrors(error);      
      this.loading$ = false;
    });    
  }
  delete(id: number){
    this.sucursalaService.delete(id)
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
