import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * @deprecated Use per-component destroy$ Subject pattern instead.
 * This service's ngOnDestroy only runs when the app is destroyed, not when components are destroyed,
 * causing memory leaks. Each component should define: private destroy$ = new Subject<void>()
 * and use takeUntil(this.destroy$) with destroy$.next() and destroy$.complete() in ngOnDestroy.
 */
@Injectable({
  providedIn: 'root',
})
export class UnsubscribeService implements OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  get unsubscribeSignal$() {
    return this.unsubscribe$.asObservable();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}