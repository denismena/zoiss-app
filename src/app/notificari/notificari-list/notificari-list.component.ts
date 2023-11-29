import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { NotificariItemComponent } from '../notificari-item/notificari-item.component';
import { notificariDTO } from '../notificari.model';
import { NotificariService } from '../notificari.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-notificari-list',
  templateUrl: './notificari-list.component.html',
  styleUrls: ['./notificari-list.component.scss']
})
export class NotificariListComponent implements OnInit, OnDestroy {

  notificari: notificariDTO[];
  errors: string[] = [];
  intervalId: any | undefined;
  necitite: number = 0;
  @ViewChild('languageMenuTrigger') languageMenuTrigger: MatMenuTrigger | undefined;
  constructor(private notificariService: NotificariService, public dialog: MatDialog, private unsubscribeService: UnsubscribeService) { 
    this.notificari=[];
  }

  ngOnInit(): void {
    this.loadList();
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.loadList(); 
      }, 600000); //10min - 600000
    }
  }
  loadList(){
    this.notificariService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(notificari=>{
      this.notificari = notificari;      
      let oldNecitite = this.necitite;
      this.necitite = this.notificari.filter(f=>f.read==false).length;      
      if(oldNecitite < this.necitite){        
        if(this.languageMenuTrigger) this.languageMenuTrigger.openMenu();
        //else console.log('menul e undefined')
      }
    });    
  }

  view(itemNot: notificariDTO){
    const dialogRef = this.dialog.open(NotificariItemComponent,      
      { data:{item: itemNot}, width: '500px', height: '300px' });
      dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
      .subscribe((data) => {        
        if (data.clicked === 'submit') {
          this.notificariService.read(itemNot.id)
          .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
          .subscribe(() => {this.loadList();}, error => {
            this.errors = parseWebAPIErrors(error);
            Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
          });
        }
      });
  }

  ngOnDestroy(){
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  delete(id: number){
    this.notificariService.delete(id)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))    
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }
  deleteAll(){
    console.log('delete all:');
    this.notificariService.deleteAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }
  read(id: number){
    this.notificariService.read(id)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {this.loadList();}, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }
  readAll(){
    console.log('read all:');
    this.notificariService.readAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }
}
