import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { formatDateFormData } from 'src/app/utilities/utils';
import { MaterialModule } from 'src/app/material/material.module';
import { ApplicationErrorLog } from './application-error-log.model';
import { ApplicationErrorLogsService } from './application-error-logs.service';

@Component({
  selector: 'app-logs-list',
  templateUrl: './logs-list.component.html',
  styleUrls: ['./logs-list.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, RouterModule],
})
export class LogsListComponent implements OnInit {
  loading = true;
  logs: ApplicationErrorLog[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 50;
  form!: FormGroup;

  expandedMessage = new Map<number, boolean>();
  expandedExceptionMessage = new Map<number, boolean>();
  expandedRequestPath = new Map<number, boolean>();

  readonly MESSAGE_MAX = 120;
  readonly EXCEPTION_MAX = 120;
  readonly PATH_MAX = 100;

  columnsToDisplay = ['createdUtc', 'logLevel', 'message', 'exceptionType', 'exceptionMessage', 'userName', 'httpMethod', 'requestPath', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private destroyRef = inject(DestroyRef);
  constructor(private service: ApplicationErrorLogsService, private fb: FormBuilder) {}

  ngOnInit(): void {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    this.form = this.fb.group({
      from: formatDateFormData(from),
      to: formatDateFormData(new Date()),
    });

    this.loadList();

    this.form.valueChanges
      .pipe(debounceTime(400), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentPage = 1;
        if (this.paginator) this.paginator.pageIndex = 0;
        this.loadList();
      });
  }

  loadList(): void {
    this.loading = true;
    const values = {
      from: formatDateFormData(new Date(this.form.value.from)),
      to: formatDateFormData(new Date(this.form.value.to)),
      page: this.currentPage,
      pageSize: this.pageSize,
    };
    this.service.getAll(values)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: HttpResponse<ApplicationErrorLog[]>) => {
        this.logs = response.body ?? [];
        this.totalRecords = Number(response.headers.get('totalRecords'));
        this.loading = false;
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadList();
  }

  truncate(text: string | null | undefined, max: number): string {
    if (!text) return '';
    return text.length > max ? text.substring(0, max) + '...' : text;
  }

  isLong(text: string | null | undefined, max: number): boolean {
    return !!text && text.length > max;
  }

  toggle(map: Map<number, boolean>, id: number): void {
    map.set(id, !map.get(id));
  }

  isExpanded(map: Map<number, boolean>, id: number): boolean {
    return map.get(id) === true;
  }
}
