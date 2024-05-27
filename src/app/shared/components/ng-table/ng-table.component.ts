import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { NgbdSortableHeader, SortEvent } from '../../directive/Sortable.directive';
import { Observable, firstValueFrom } from 'rxjs';
import { NgTableService } from 'src/app/core/services/ng-table.service';
import { ngTableTemplate } from 'src/app/models/ng-table.interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-ng-table',
  templateUrl: './ng-table.component.html',
  styleUrls: ['./ng-table.component.css'],
  providers: [NgTableService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgTableComponent implements OnInit {
  @Input() set _source(data) {
    this.source = data;
    this.setData();
  };
  @Input() columns: any[];
  @Input() canDelete: Boolean;
  @Output() _sourceChange = new EventEmitter();
  source: any[];
  data$: Observable<any[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: NgTableService) {
  
  }
  ngOnInit(): void {
    this.setData();
  }

  setData() {
    this.service.setstaticData$ = this.source;
    this.data$ = this.service.data$
    this.total$ = this.service.total$;
    this.service.page = this.service.page
  }

  onSort({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  removeItem(index) {
    this.source.splice(index, 1)
    this.setData();
    //this.service.page = this.service.page
    //this._sourceChange.emit(this.source);
  }

}
