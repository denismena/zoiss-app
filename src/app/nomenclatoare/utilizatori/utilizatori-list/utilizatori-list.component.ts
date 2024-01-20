import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UtilizatoriDTO } from 'src/app/security/security.models';
import { SecurityService } from 'src/app/security/security.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-utilizatori-list',
  templateUrl: './utilizatori-list.component.html',
  styleUrls: ['./utilizatori-list.component.scss']
})
export class UtilizatoriListComponent implements OnInit, OnDestroy {

  utilizatori: UtilizatoriDTO[];
  errors: string[] = [];
  constructor(private securitySevice: SecurityService, private unsubscribeService: UnsubscribeService) { 
    this.utilizatori = [];
  }
  columnsToDisplay= ['nume', 'email', 'tel', 'sucursala', 'action'];
  ngOnInit(): void {
    this.loadList();
  }
  loadList(){
    this.securitySevice.getUsers()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(utilizatori=>{
      this.utilizatori = utilizatori;
    },
    error => this.errors = parseWebAPIErrors(error));    
  }
  delete(id: string){
    this.securitySevice.markAsInactive(id)
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
