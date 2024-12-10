import { Component, OnDestroy, OnInit } from '@angular/core';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { transportatorDTO } from '../transportator-item/transportator.model';
import { TransporatorService } from '../transportator.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-transportator-list',
    templateUrl: './transportator-list.component.html',
    styleUrls: ['./transportator-list.component.scss'],
    standalone: false
})
export class TransportatorListComponent implements OnInit, OnDestroy {

  transportator: transportatorDTO[];
  errors: string[] = [];
  loading$: boolean = true;
  constructor(private transporatorService: TransporatorService, private unsubscribeService: UnsubscribeService) { 
    this.transportator = [];
  }

  columnsToDisplay= ['nume', 'nrInmatriculare', 'adresa', 'tel', 'email', 'active', 'action'];

  ngOnInit(): void {
    this.loadList();
  }
  loadList(){
    this.transporatorService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(transportator=>{
      this.transportator = transportator;
      this.loading$ = false;
    }, error => {
      this.errors = parseWebAPIErrors(error);      
      this.loading$ = false;
    });    
  }
  delete(id: number){
    this.transporatorService.delete(id)
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
