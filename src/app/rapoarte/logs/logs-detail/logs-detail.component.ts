import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { ApplicationErrorLog } from '../application-error-log.model';
import { ApplicationErrorLogsService } from '../application-error-logs.service';

@Component({
  selector: 'app-logs-detail',
  templateUrl: './logs-detail.component.html',
  styleUrls: ['./logs-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
})
export class LogsDetailComponent implements OnInit {
  log: ApplicationErrorLog | null = null;
  loading = true;
  notFound = false;

  private destroyRef = inject(DestroyRef);
  constructor(private service: ApplicationErrorLogsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: HttpResponse<ApplicationErrorLog>) => {
          this.log = response.body;
          this.loading = false;
        },
        error: () => {
          this.notFound = true;
          this.loading = false;
        }
      });
  }
}
