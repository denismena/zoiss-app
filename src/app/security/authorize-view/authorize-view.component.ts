import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SecurityService } from '../security.service';

@Component({
    selector: 'app-authorize-view',
    templateUrl: './authorize-view.component.html',
    styleUrls: ['./authorize-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AuthorizeViewComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  constructor(private securityService: SecurityService, private cdr: ChangeDetectorRef) { }
  @Input()
  role: string= '';
  
  ngOnInit(): void {
    this.securityService.isLoggedIn$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  public isAuthorize(){
    if(this.role){
      return this.securityService.getRole() == this.role;
    }
    else{
       return this.securityService.isAuthenticated();
    }
  }

}
