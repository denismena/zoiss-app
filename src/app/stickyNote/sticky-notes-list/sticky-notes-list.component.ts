import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { stickyNotesCreationDTO, stickyNotesDTO } from '../sticky-notes.model';
import { StickyNotesService } from '../sticky-notes.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';

@Component({
    selector: 'app-sticky-notes-list',
    templateUrl: './sticky-notes-list.component.html',
    styleUrls: ['./sticky-notes-list.component.scss'],
    standalone: false
})
export class StickyNotesListComponent implements OnInit, OnDestroy {

  notes: stickyNotesDTO[];
  errors: string[] = [];
  constructor(private stickyNotesService: StickyNotesService, private unsubscribeService: UnsubscribeService, private dialog: MatDialog) { 
    this.notes=[];
  }

  ngOnInit(): void {
    this.loadList();
  }

  loadList(){
    this.stickyNotesService.getAll()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(notes=>{
      this.notes = notes;
    });    
  }

  delete(id: number){
    const dialogRef = this.dialog.open(OkCancelDialogComponent, {data:{}});
    dialogRef.afterClosed()
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe((confirm) => {      
      if(confirm) this.deleteComanda(id);
    });
  }

  private deleteComanda(id: number){
    this.stickyNotesService.delete(id)
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      this.dialog.open(MessageDialogComponent, {data:{title: "A aparut o eroare!", message: error.error}});
    });
  }

  saveChanges(id:number, stickyNotesDTO: any){
    const note: stickyNotesCreationDTO={descriere:stickyNotesDTO.target.innerHTML};    
    this.stickyNotesService.edit(id, note)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{    
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

  addNotes(){
    const note: stickyNotesCreationDTO={descriere:''};    
    this.stickyNotesService.create(note)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(()=>{      
      this.loadList();
    }, 
    error=> this.errors = parseWebAPIErrors(error));
  }
  
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',    
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        'italic',
        'underline',
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'insertOrderedList',
        'heading',
        'fontName'
      ],
      [
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

  ngOnDestroy(): void {
  }
}
