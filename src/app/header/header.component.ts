import { Component, DestroyRef, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SecurityService } from '../security/security.service';
import { CookieService } from '../utilities/cookie.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements OnInit {
  pdfComponentNou: boolean = false;
  @ViewChild('navbarCollapse') navbarCollapse?: ElementRef<HTMLElement>;
  @ViewChild('navbarToggle') navbarToggle?: ElementRef<HTMLButtonElement>;
  private destroyRef = inject(DestroyRef);

  constructor(
    public securityService: SecurityService,
    public cookie: CookieService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pdfComponentNou = this.cookie.getCookie('pdfComponentNou') === 'true';
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.closeNavbarOnMobile());
  }

  pdfComponentNouChange() {
    this.cookie.setCookie({ name: 'pdfComponentNou', value: this.pdfComponentNou.toString() });
  }

  onCollapsedAreaClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }

    const clickedLink = target.closest('a.nav-link, a[routerLink], a[href]');
    const clickedToggle = target.closest('.dropdown-toggle, .navbar-toggler');

    if (clickedLink && !clickedToggle) {
      this.closeNavbarOnMobile();
    }
  }

  private closeNavbarOnMobile(): void {
    if (typeof window !== 'undefined' && window.innerWidth >= 992) {
      return;
    }

    const collapse = this.navbarCollapse?.nativeElement;
    const toggle = this.navbarToggle?.nativeElement;
    if (!collapse || !toggle) {
      return;
    }

    collapse.classList.remove('show');
    toggle.classList.add('collapsed');
    toggle.setAttribute('aria-expanded', 'false');
  }
}
