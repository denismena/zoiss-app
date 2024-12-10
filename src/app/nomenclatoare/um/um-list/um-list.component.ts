import { Component, OnDestroy, OnInit } from '@angular/core';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { umDTO } from '../um-item/um.model';
import { UMService } from '../um.service';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from 'src/app/unsubscribe.service';

@Component({
    selector: 'app-um-list',
    templateUrl: './um-list.component.html',
    styleUrls: ['./um-list.component.scss'],
    standalone: false
})
export class UmListComponent implements OnInit, OnDestroy {

  um: umDTO[] = [];
  columnsToDisplay= ['nume', 'action'];
  errors: string[] = [];
  loading$: boolean = true;
  constructor(private umService: UMService, private unsubscribeService: UnsubscribeService) { }

  ngOnInit(): void {    
    this.loadList();
  }

  loadList(){
    this.umService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(um=>{
      this.um = um;
      this.loading$ = false;
    }, error => {
      this.errors = parseWebAPIErrors(error);      
      this.loading$ = false;
    });    
  }
  delete(id: number){
    this.umService.delete(id)
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
