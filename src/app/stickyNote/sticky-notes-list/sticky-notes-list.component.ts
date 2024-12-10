import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { parseWebAPIErrors } from 'src/app/utilities/utils';
import Swal from 'sweetalert2';
import { stickyNotesCreationDTO, stickyNotesDTO } from '../sticky-notes.model';
import { StickyNotesService } from '../sticky-notes.service';
import { UnsubscribeService } from 'src/app/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-sticky-notes-list',
    templateUrl: './sticky-notes-list.component.html',
    styleUrls: ['./sticky-notes-list.component.scss'],
    standalone: false
})
export class StickyNotesListComponent implements OnInit, OnDestroy {

  notes: stickyNotesDTO[];
  errors: string[] = [];
  constructor(private stickyNotesService: StickyNotesService, private unsubscribeService: UnsubscribeService) { 
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
    this.stickyNotesService.delete(id)
    .pipe(takeUntil(this.unsubscribeService.unsubscribeSignal$))
    .subscribe(() => {
      this.loadList();
    }, error => {
      this.errors = parseWebAPIErrors(error);
      Swal.fire({ title: "A aparut o eroare!", text: error.error, icon: 'error' });
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
