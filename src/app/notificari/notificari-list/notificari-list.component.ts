import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { NotificariItemComponent } from '../notificari-item/notificari-item.component';
import { notificariDTO } from '../notificari.model';
import { NotificariService } from '../notificari.service';

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
  // get necitite():number{
  //   return this.notificariService.necitite;
  // }
  // set necitite(val: number){
  //   this.notificariService.necitite = val;
  //   console.log
  // }
  @ViewChild('languageMenuTrigger') languageMenuTrigger: MatMenuTrigger | undefined;
  constructor(private notificariService: NotificariService, public dialog: MatDialog) { 
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
    this.notificariService.getAll().subscribe(notificari=>{
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
    console.log('notif send:', itemNot);
    const dialogRef = this.dialog.open(NotificariItemComponent,      
      { data:{item: itemNot}, width: '500px', height: '300px' });
      dialogRef.afterClosed().subscribe((data) => {        
        if (data.clicked === 'submit') {
          this.notificariService.read(itemNot.id)
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
    console.log('delete:', id);
    this.notificariService.delete(id)
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
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }
  read(id: number){
    this.notificariService.read(id)
    .subscribe(() => {this.loadList();}, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }
  readAll(){
    console.log('read all:');
    this.notificariService.readAll()
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
    });
  }
}
