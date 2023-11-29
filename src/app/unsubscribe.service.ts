import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

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