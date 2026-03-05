import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import { OkCancelDialogComponent } from 'src/app/utilities/ok-cancel-dialog/ok-cancel-dialog.component';
import { MessageDialogComponent } from 'src/app/utilities/message-dialog/message-dialog.component';
import { stickyNotesCreationDTO, stickyNotesDTO } from '../sticky-notes.model';
import { StickyNotesService } from '../sticky-notes.service';

@Component({
    selector: 'app-sticky-notes-list',
    templateUrl: './sticky-notes-list.component.html',
    styleUrls: ['./sticky-notes-list.component.scss'],
    standalone: false
})
export class StickyNotesListComponent implements OnInit {

  notes: stickyNotesDTO[];
  errors: string[] = [];
  private destroyRef = inject(DestroyRef);
  constructor(private stickyNotesService: StickyNotesService, private dialog: MatDialog) { 
    this.notes=[];
  }

  ngOnInit(): void {
    this.loadList();
  }

  loadList(){
    this.stickyNotesService.getAll()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(notes=>{
      this.notes = notes;
    });    
  }

  delete(id: number){
    const dialogRef = this.dialog.open(OkCancelDialogComponent, {data:{}});
    dialogRef.afterClosed()
    .pipe(takeUntilDestroyed(this.destroyRef))
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
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(()=>{    
    }, 
    error=> this.errors = parseWebAPIErrors(error));    
  }

  addNotes(){
    const note: stickyNotesCreationDTO={descriere:''};    
    this.stickyNotesService.create(note)
    .pipe(takeUntilDestroyed(this.destroyRef))
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

}
