import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { SecurityService } from 'src/app/security/security.service';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';
import { NotificariItemComponent } from '../notificari-item/notificari-item.component';
import { notificariDTO } from '../notificari.model';
import { NotificariService } from '../notificari.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-notificari-list',
    templateUrl: './notificari-list.component.html',
    styleUrls: ['./notificari-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NotificariListComponent implements OnInit, OnDestroy {

  notificari: notificariDTO[];
  errors: string[] = [];
  intervalId: any | undefined;
  necitite: number = 0;
  comenzileMeleValue: boolean = false;
  @ViewChild('languageMenuTrigger') languageMenuTrigger: MatMenuTrigger | undefined;
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  constructor(private notificariService: NotificariService, public dialog: MatDialog, private securityService: SecurityService) { 
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
    forkJoin([
      this.notificariService.getAll(),
      this.securityService.getByEmail(this.securityService.getFieldFromJwt('email') as string) //this.securityService.currentUser$
    ])
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(([notificari, utilizator]) => {
        this.notificari = notificari;      
      let oldNecitite = this.necitite;
      this.necitite = this.notificari.filter(f=>f.read==false).length;      
      if(oldNecitite < this.necitite){        
        if(this.languageMenuTrigger) this.languageMenuTrigger.openMenu();
        //else console.log('menul e undefined')
      }

      this.comenzileMeleValue = utilizator.showNotificationsForAllOrders;
      this.cdr.markForCheck();
    });

  }

  view(itemNot: notificariDTO){
    const dialogRef = this.dialog.open(NotificariItemComponent,      
      { data:{item: itemNot}, width: '500px', height: '300px' });
      dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {        
        if (data.clicked === 'submit') {
          this.notificariService.read(itemNot.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {this.loadList();}, error => {
            this.errors = parseWebAPIErrors(error);
            this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
            this.cdr.markForCheck();
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
    .pipe(takeUntilDestroyed(this.destroyRef))    
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
      this.cdr.markForCheck();
    });
  }
  deleteAll(){
    this.notificariService.deleteAll()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
      this.cdr.markForCheck();
    });
  }
  read(id: number){
    this.notificariService.read(id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {this.loadList();}, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
      this.cdr.markForCheck();
    });
  }
  readAll(){
    this.notificariService.readAll()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
      this.cdr.markForCheck();
    });
  }

  setNotificationStyle(item: any){
    this.securityService.setNotificationStyle(item.checked);
  }
}
